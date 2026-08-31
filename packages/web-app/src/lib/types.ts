export type Ingredient = {
  name: string;
  measure: string;
};

export type RecipeSource = 'api' | 'user';

export type Recipe = {
  id: string; 
  source: RecipeSource;
  title: string;
  image: string;
  category?: string;
  area?: string;
  tags?: string[];
  ingredients: Ingredient[];
  instructions: string;
};

export type FavoriteEntry = {
  id: string;
  recipe: Recipe;
};

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type RecipeRef = {
  id: string;
  title: string;
  image: string;
  source: RecipeSource;
};

export type MealPlan = Partial<Record<Day, RecipeRef>>;
