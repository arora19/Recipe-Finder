<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    searchRecipes,
    getBrowseRecipes,
    filterByCategory,
    listCategories,
  } from '$lib/api/mealdb';
  import { favoritesStore } from '$lib/stores/favorites.svelte';
  import { userRecipesStore } from '$lib/stores/userRecipes.svelte';
  import type { Recipe } from '$lib/types';

  let apiRecipes = $state<Recipe[]>([]);
  let categories = $state<string[]>([]);
  let selectedCategory = $state('');
  let query = $state('');
  let loading = $state(true);
  let error = $state('');

  let filteredUserRecipes = $derived(
    userRecipesStore.recipes.filter(r => {
      const matchesQuery = !query || r.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !selectedCategory || r.category === selectedCategory;
      return matchesQuery && matchesCategory;
    }),
  );

  onMount(async () => {
    try {
      categories = await listCategories();
      apiRecipes = await getBrowseRecipes();
    } catch (e) {
      error = 'Could not reach TheMealDB API. Check your connection.';
    } finally {
      loading = false;
    }
  });

  async function runSearch(q: string) {
    query = q;
    loading = true;
    error = '';
    try {
      if (selectedCategory) {
        const results = await filterByCategory(selectedCategory);
        apiRecipes = q
          ? results.filter(r => r.title.toLowerCase().includes(q.toLowerCase()))
          : results;
      } else if (q) {
        apiRecipes = await searchRecipes(q);
      } else {
        apiRecipes = await getBrowseRecipes();
      }
    } catch (e) {
      error = 'Search failed. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function onFilterChange(e: Event) {
    selectedCategory = (e.currentTarget as HTMLSelectElement).value;
    await runSearch(query);
  }

  function onFavoriteToggle(recipe: Recipe) {
    return () => {
      if (favoritesStore.isFavorite(recipe.id)) {
        favoritesStore.remove(recipe.id);
      } else {
        favoritesStore.add(recipe);
      }
    };
  }

  function onCardClick(e: CustomEvent<{ id: string }>) {
    goto(`/recipes/${e.detail.id}`);
  }
</script>

<svelte:head>
  <title>Browse Recipes | Recipe Finder</title>
</svelte:head>

<section class="controls">
  <search-bar
    placeholder="Search recipes (e.g. chicken, pasta)..."
    debounce={450}
    onsearchSubmit={(e: CustomEvent<string>) => runSearch(e.detail)}
  ></search-bar>

  <label class="category-filter">
    <span>Category</span>
    <select value={selectedCategory} onchange={onFilterChange}>
      <option value="">All categories</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </label>
</section>

{#if error}
  <p class="error">{error}</p>
{/if}

{#if filteredUserRecipes.length > 0}
  <h2 class="section-title">Your Recipes</h2>
  <div class="grid">
    {#each filteredUserRecipes as recipe (recipe.id)}
      <recipe-card
        recipe={recipe}
        is-favorite={favoritesStore.isFavorite(recipe.id)}
        onfavoriteToggle={onFavoriteToggle(recipe)}
        oncardClick={onCardClick}
      >
        <a slot="footer" href={`/recipes/${recipe.id}/edit`} class="edit-link">Edit</a>
      </recipe-card>
    {/each}
  </div>
{/if}

<h2 class="section-title">Discover</h2>

{#if loading}
  <p class="hint">Loading recipes...</p>
{:else if apiRecipes.length === 0}
  <p class="hint">No recipes found. Try a different search or filter.</p>
{:else}
  <div class="grid">
    {#each apiRecipes as recipe (recipe.id)}
      <recipe-card
        recipe={recipe}
        is-favorite={favoritesStore.isFavorite(recipe.id)}
        onfavoriteToggle={onFavoriteToggle(recipe)}
        oncardClick={onCardClick}
      ></recipe-card>
    {/each}
  </div>
{/if}

<style>
  .controls {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 28px;
  }

  .category-filter {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    color: #555;
  }

  select {
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    padding: 7px 10px;
  }

  .section-title {
    font-size: 1rem;
    color: #444;
    margin: 24px 0 12px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .hint,
  .error {
    color: #888;
    font-size: 0.92rem;
  }

  .error {
    color: #d9342b;
  }

  .edit-link {
    font-size: 0.8rem;
    color: #2451c9;
    text-decoration: none;
  }
</style>
