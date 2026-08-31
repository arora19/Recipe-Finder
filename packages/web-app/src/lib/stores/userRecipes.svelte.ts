import { readStorage, writeStorage, makeId } from '$lib/storage';
import type { Recipe, Ingredient } from '$lib/types';

const KEY = 'userRecipes';

export type RecipeDraft = {
  title: string;
  image: string;
  category: string;
  area?: string;
  ingredients: Ingredient[];
  instructions: string;
};

export type ValidationErrors = Partial<Record<keyof RecipeDraft, string>>;

export function validateRecipeDraft(draft: RecipeDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!draft.title || draft.title.trim().length < 3) {
    errors.title = 'Title is required (min 3 characters).';
  }
  if (!draft.category || draft.category.trim().length === 0) {
    errors.category = 'Category is required.';
  }
  const cleanIngredients = (draft.ingredients || []).filter(i => i.name && i.name.trim().length > 0);
  if (cleanIngredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required.';
  }
  if (!draft.instructions || draft.instructions.trim().length < 20) {
    errors.instructions = 'Instructions are required (min 20 characters).';
  }

  return errors;
}

function load(): Recipe[] {
  return readStorage<Recipe[]>(KEY, []);
}

class UserRecipesStore {
  recipes = $state<Recipe[]>(load());

  private persist() {
    writeStorage(KEY, this.recipes);
  }

  getById = (id: string): Recipe | undefined => this.recipes.find(r => r.id === id);

  create(draft: RecipeDraft): { errors: ValidationErrors; recipe?: Recipe } {
    const errors = validateRecipeDraft(draft);
    if (Object.keys(errors).length > 0) return { errors };

    const recipe: Recipe = {
      id: makeId('user'),
      source: 'user',
      title: draft.title.trim(),
      image: draft.image.trim(),
      category: draft.category.trim(),
      area: draft.area?.trim() || undefined,
      ingredients: draft.ingredients.filter(i => i.name.trim()),
      instructions: draft.instructions.trim(),
    };
    this.recipes = [...this.recipes, recipe];
    this.persist();
    return { errors: {}, recipe };
  }

  update(id: string, draft: RecipeDraft): { errors: ValidationErrors; recipe?: Recipe } {
    const errors = validateRecipeDraft(draft);
    if (Object.keys(errors).length > 0) return { errors };

    const existing = this.getById(id);
    if (!existing) return { errors: { title: 'Recipe not found.' } };

    const updated: Recipe = {
      ...existing,
      title: draft.title.trim(),
      image: draft.image.trim(),
      category: draft.category.trim(),
      area: draft.area?.trim() || undefined,
      ingredients: draft.ingredients.filter(i => i.name.trim()),
      instructions: draft.instructions.trim(),
    };
    this.recipes = this.recipes.map(r => (r.id === id ? updated : r));
    this.persist();
    return { errors: {}, recipe: updated };
  }

  delete(id: string) {
    this.recipes = this.recipes.filter(r => r.id !== id);
    this.persist();
  }
}

export const userRecipesStore = new UserRecipesStore();
