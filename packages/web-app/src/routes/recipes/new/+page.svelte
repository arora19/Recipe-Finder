<script lang="ts">
  import { goto } from '$app/navigation';
  import RecipeForm from '$lib/components/RecipeForm.svelte';
  import { userRecipesStore, type RecipeDraft } from '$lib/stores/userRecipes.svelte';

  function handleSubmit(draft: RecipeDraft) {
    const { recipe } = userRecipesStore.create(draft);
    if (recipe) goto(`/recipes/${recipe.id}`);
  }
</script>

<svelte:head>
  <title>New Recipe | Recipe Finder</title>
</svelte:head>

<h1>Create a Recipe</h1>
<RecipeForm submitLabel="Create Recipe" onSubmit={handleSubmit} />

<style>
  h1 {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
</style>
