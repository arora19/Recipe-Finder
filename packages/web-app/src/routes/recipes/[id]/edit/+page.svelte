<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import RecipeForm from '$lib/components/RecipeForm.svelte';
  import { userRecipesStore, type RecipeDraft } from '$lib/stores/userRecipes.svelte';
  import { favoritesStore } from '$lib/stores/favorites.svelte';
  import { mealPlanStore } from '$lib/stores/mealPlan.svelte';
  import type { Recipe } from '$lib/types';

  let recipe = $state<Recipe | undefined>(undefined);
  let notFound = $state(false);

  onMount(() => {
    const id = $page.params.id;
    if (!id) {
      notFound = true;
      return;
    }
    recipe = userRecipesStore.getById(id);
    if (!recipe) notFound = true;
  });

  function handleSubmit(draft: RecipeDraft) {
    if (!recipe) return;
    const { recipe: updated } = userRecipesStore.update(recipe.id, draft);
    if (updated) {
      favoritesStore.update(updated);
      mealPlanStore.updateRecipe({
        id: updated.id,
        title: updated.title,
        image: updated.image,
        source: updated.source,
      });
      goto(`/recipes/${updated.id}`);
    }
  }
</script>

<svelte:head>
  <title>Edit Recipe | Recipe Finder</title>
</svelte:head>

<h1>Edit Recipe</h1>

{#if notFound}
  <p class="hint">Recipe not found, or it isn't one you created (only your own recipes can be edited).</p>
{:else if recipe}
  <RecipeForm
    initial={{
      title: recipe.title,
      image: recipe.image,
      category: recipe.category ?? '',
      area: recipe.area ?? '',
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    }}
    submitLabel="Save Changes"
    onSubmit={handleSubmit}
  />
{/if}

<style>
  h1 {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }

  .hint {
    color: #888;
  }
</style>
