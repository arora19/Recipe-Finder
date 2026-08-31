<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getRecipeById } from '$lib/api/mealdb';
  import { favoritesStore } from '$lib/stores/favorites.svelte';
  import { userRecipesStore } from '$lib/stores/userRecipes.svelte';
  import { mealPlanStore } from '$lib/stores/mealPlan.svelte';
  import { DAYS } from '$lib/types';
  import type { Recipe, Day } from '$lib/types';

  let recipe = $state<Recipe | null>(null);
  let loading = $state(true);
  let error = $state('');
  let selectedDay = $state<Day>('Mon');
  let addedMessage = $state('');

  let id = $derived($page.params.id);
  let isFavorite = $derived(recipe ? favoritesStore.isFavorite(recipe.id) : false);

  onMount(load);

  async function load() {
    loading = true;
    error = '';
    const currentId = id;
    if (!currentId) {
      error = 'Recipe not found.';
      loading = false;
      return;
    }

    if (currentId.startsWith('user-')) {
      recipe = userRecipesStore.getById(currentId) || null;
      if (!recipe) error = 'Recipe not found.';
      loading = false;
      return;
    }

    try {
      recipe = await getRecipeById(currentId);
      if (!recipe) error = 'Recipe not found.';
    } catch (e) {
      error = 'Failed to load recipe details.';
    } finally {
      loading = false;
    }
  }

  function toggleFavorite() {
    if (!recipe) return;
    favoritesStore.toggle(recipe);
  }

  function assignToPlan() {
    if (!recipe) return;
    mealPlanStore.assign(selectedDay, {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      source: recipe.source,
    });
    addedMessage = `Added to ${selectedDay}.`;
    setTimeout(() => (addedMessage = ''), 2500);
  }

  function confirmDelete() {
    if (!recipe) return;
    if (!confirm(`Delete "${recipe.title}"? This cannot be undone.`)) return;
    favoritesStore.remove(recipe.id);
    mealPlanStore.removeRecipe(recipe.id);
    userRecipesStore.delete(recipe.id);
    goto('/recipes');
  }
</script>

<svelte:head>
  <title>{recipe ? recipe.title : 'Recipe'} | Recipe Finder</title>
</svelte:head>

{#if loading}
  <p class="hint">Loading...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if recipe}
  <div class="detail">
    <div class="hero">
      {#if recipe.image}
        <img src={recipe.image} alt={recipe.title} />
      {:else}
        <div class="image-placeholder" role="img" aria-label={`No image available for ${recipe.title}`}>No image</div>
      {/if}
    </div>

    <div class="content">
      <div class="title-row">
        <h1>{recipe.title}</h1>
        <button class="fav-toggle" class:active={isFavorite} onclick={toggleFavorite}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>

      <div class="meta">
        {#if recipe.category}<span class="tag">{recipe.category}</span>{/if}
        {#if recipe.area}<span class="tag tag--area">{recipe.area}</span>{/if}
        {#if recipe.source === 'user'}<span class="tag tag--user">Your recipe</span>{/if}
      </div>

      {#if recipe.source === 'user'}
        <div class="owner-actions">
          <a href={`/recipes/${recipe.id}/edit`} class="btn btn--ghost">Edit</a>
          <button class="btn btn--danger" onclick={confirmDelete}>Delete</button>
        </div>
      {/if}

      <section class="plan-widget">
        <h3>Add to Meal Plan</h3>
        <div class="plan-row">
          <select bind:value={selectedDay}>
            {#each DAYS as d}<option value={d}>{d}</option>{/each}
          </select>
          <button class="btn btn--primary" onclick={assignToPlan}>Add</button>
        </div>
        {#if addedMessage}<p class="added-msg">{addedMessage}</p>{/if}
      </section>

      <section>
        <h2>Ingredients</h2>
        <ul class="ingredients">
          {#each recipe.ingredients as ing}
            <li><span class="measure">{ing.measure}</span> {ing.name}</li>
          {/each}
        </ul>
      </section>

      <section>
        <h2>Instructions</h2>
        <p class="instructions">{recipe.instructions}</p>
      </section>
    </div>
  </div>
{/if}

<style>
  .detail {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 760px) {
    .detail {
      grid-template-columns: 340px 1fr;
    }
  }

  .hero img {
    width: 100%;
    border-radius: 16px;
    object-fit: cover;
    aspect-ratio: 4/3;
  }

  .image-placeholder {
    display: grid;
    place-items: center;
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: 16px;
    background: #f4f0eb;
    color: #777;
    font-size: 1rem;
  }

  .title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
  }

  .fav-toggle {
    border: 1px solid #ddd;
    background: white;
    border-radius: 999px;
    padding: 8px 14px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.85rem;
  }

  .fav-toggle.active {
    background: #fff1e6;
    border-color: #e8590c;
    color: #e8590c;
  }

  .meta {
    display: flex;
    gap: 8px;
    margin: 10px 0 6px;
  }

  .tag {
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: 999px;
    background: #fff1e6;
    color: #e8590c;
  }

  .tag--area {
    background: #eef4ff;
    color: #2451c9;
  }

  .tag--user {
    background: #eafaf0;
    color: #1f9d55;
  }

  .owner-actions {
    display: flex;
    gap: 10px;
    margin: 10px 0;
  }

  .btn {
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.85rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }

  .btn--ghost {
    background: #f1f1f1;
    color: #333;
  }

  .btn--danger {
    background: #fdeceb;
    color: #d9342b;
  }

  .btn--primary {
    background: #e8590c;
    color: white;
  }

  .plan-widget {
    background: #fafafa;
    border-radius: 12px;
    padding: 14px 16px;
    margin: 18px 0;
  }

  .plan-widget h3 {
    margin: 0 0 10px;
    font-size: 0.95rem;
  }

  .plan-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  select {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  .added-msg {
    margin: 8px 0 0;
    font-size: 0.82rem;
    color: #1f9d55;
  }

  .ingredients {
    padding-left: 18px;
  }

  .measure {
    color: #888;
    margin-right: 6px;
  }

  .instructions {
    white-space: pre-line;
    line-height: 1.6;
    color: #333;
  }

  .hint,
  .error {
    color: #888;
  }

  .error {
    color: #d9342b;
  }
</style>
