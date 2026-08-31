import type { Recipe, Ingredient } from '$lib/types';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

type RawMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string | null;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
};

type RawFilterMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

function toIngredients(meal: RawMeal): Ingredient[] {
  const out: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = (meal as any)[`strIngredient${i}`];
    const measure = (meal as any)[`strMeasure${i}`];
    if (name && name.trim()) {
      out.push({ name: name.trim(), measure: (measure || '').trim() });
    }
  }
  return out;
}

function normalizeMeal(meal: RawMeal): Recipe {
  return {
    id: meal.idMeal,
    source: 'api',
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || undefined,
    area: meal.strArea || undefined,
    tags: meal.strTags ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    ingredients: toIngredients(meal),
    instructions: meal.strInstructions || '',
  };
}

function normalizeFilterMeal(meal: RawFilterMeal): Recipe {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    source: 'api',
    ingredients: [],
    instructions: '',
  };
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = await res.json();
  return (data.meals || []).map(normalizeMeal);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Lookup failed: ${res.status}`);
  const data = await res.json();
  if (!data.meals) return null;
  return normalizeMeal(data.meals[0]);
}

export async function filterByCategory(category: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error(`Filter failed: ${res.status}`);
  const data = await res.json();
  return (data.meals || []).map(normalizeFilterMeal);
}

export async function listCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/list.php?c=list`);
  if (!res.ok) throw new Error(`Categories failed: ${res.status}`);
  const data = await res.json();
  return (data.meals || []).map((m: any) => m.strCategory).filter(Boolean);
}

export async function getBrowseRecipes(count = 9): Promise<Recipe[]> {
  const responses = await Promise.all(
    Array.from({ length: count }, () => fetch(`${BASE}/random.php`)),
  );

  if (responses.some(response => !response.ok)) {
    throw new Error('Failed to load discovery recipes.');
  }

  const payloads = await Promise.all(responses.map(response => response.json()));
  const recipes = payloads
    .map(payload => payload.meals?.[0])
    .filter(Boolean)
    .map(normalizeMeal);

  return [...new Map(recipes.map(recipe => [recipe.id, recipe])).values()];
}
