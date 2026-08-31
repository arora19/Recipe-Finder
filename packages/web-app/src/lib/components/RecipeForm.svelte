<script lang="ts">
  import { untrack } from 'svelte';
  import { validateRecipeDraft, type RecipeDraft, type ValidationErrors } from '$lib/stores/userRecipes.svelte';
  import type { Ingredient } from '$lib/types';
  

  let {
    initial = null,
    submitLabel = 'Save Recipe',
    onSubmit,
  }: {
    initial?: RecipeDraft | null;
    submitLabel?: string;
    onSubmit: (draft: RecipeDraft) => void;
  } = $props();

  let title = $state(untrack(() => initial?.title ?? ''));
  let image = $state(untrack(() => initial?.image ?? ''));
  let category = $state(untrack(() => initial?.category ?? ''));
  let area = $state(untrack(() => initial?.area ?? ''));
  let instructions = $state(untrack(() => initial?.instructions ?? ''));
  let ingredients = $state<Ingredient[]>(
   untrack(() => (initial?.ingredients?.length ? [...initial.ingredients] : [{ name: '', measure: '' }])),
  );

  let errors = $state<ValidationErrors>({});
  let submitted = $state(false);

  function addIngredientRow() {
    ingredients = [...ingredients, { name: '', measure: '' }];
  }

  function removeIngredientRow(idx: number) {
    ingredients = ingredients.filter((_, i) => i !== idx);
    if (ingredients.length === 0) ingredients = [{ name: '', measure: '' }];
  }

  function currentDraft(): RecipeDraft {
    return { title, image, category, area, instructions, ingredients };
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    submitted = true;
    const draft = currentDraft();
    errors = validateRecipeDraft(draft);
    if (Object.keys(errors).length === 0) {
      onSubmit(draft);
    }
  }
</script>

<form onsubmit={handleSubmit} novalidate>
  <div class="field">
    <label for="title">Title</label>
    <input id="title" type="text" bind:value={title} placeholder="e.g. Grandma's Lasagna" />
    {#if submitted && errors.title}<p class="err">{errors.title}</p>{/if}
  </div>

  <div class="field">
    <label for="image">Image URL (optional)</label>
    <input id="image" type="text" bind:value={image} placeholder="https://..." />
    {#if image}
      <img class="preview" src={image} alt="preview" />
    {/if}
  </div>

  <div class="row">
    <div class="field">
      <label for="category">Category</label>
      <input id="category" type="text" bind:value={category} placeholder="e.g. Dessert" />
      {#if submitted && errors.category}<p class="err">{errors.category}</p>{/if}
    </div>
    <div class="field">
      <label for="area">Cuisine (optional)</label>
      <input id="area" type="text" bind:value={area} placeholder="e.g. Italian" />
    </div>
  </div>

  <div class="field">
    <span class="group-label">Ingredients</span>
    {#each ingredients as ing, idx}
      <div class="ingredient-row">
        <input type="text" placeholder="Ingredient" bind:value={ing.name} />
        <input type="text" placeholder="Measure (e.g. 2 cups)" bind:value={ing.measure} />
        <button type="button" class="remove-btn" onclick={() => removeIngredientRow(idx)} aria-label="Remove ingredient">Remove</button>
      </div>
    {/each}
    <button type="button" class="add-btn" onclick={addIngredientRow}>+ Add ingredient</button>
    {#if submitted && errors.ingredients}<p class="err">{errors.ingredients}</p>{/if}
  </div>

  <div class="field">
    <label for="instructions">Instructions</label>
    <textarea id="instructions" rows="6" bind:value={instructions} placeholder="Step-by-step instructions..."></textarea>
    {#if submitted && errors.instructions}<p class="err">{errors.instructions}</p>{/if}
  </div>

  <button type="submit" class="submit-btn">{submitLabel}</button>
</form>

<style>
  form {
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  label,
  .group-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #444;
  }

  input[type='text'],
  textarea {
    padding: 9px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.92rem;
    font-family: inherit;
  }

  .preview {
    width: 120px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    margin-top: 6px;
  }

  .ingredient-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 8px;
    margin-bottom: 8px;
  }

  .remove-btn {
    border: none;
    background: #f4f4f4;
    border-radius: 6px;
    cursor: pointer;
    color: #999;
    padding: 0 10px;
  }

  .add-btn {
    align-self: flex-start;
    border: 1px dashed #ccc;
    background: none;
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    color: #666;
    font-size: 0.85rem;
  }

  .submit-btn {
    align-self: flex-start;
    border: none;
    background: #e8590c;
    color: white;
    border-radius: 8px;
    padding: 10px 22px;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .err {
    margin: 0;
    color: #d9342b;
    font-size: 0.78rem;
  }
</style>
