export interface RecipeCardData {
  id: string;
  title: string;
  image: string;
  category?: string;
  area?: string;
  tags?: string[];
}

export interface DaySlotRecipe {
  id: string;
  title: string;
  image: string;
}
