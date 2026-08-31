import { readStorage, writeStorage } from '$lib/storage';
import type { MealPlan, Day, RecipeRef } from '$lib/types';

const KEY = 'mealPlan';

function load(): MealPlan {
  return readStorage<MealPlan>(KEY, {});
}

class MealPlanStore {
  plan = $state<MealPlan>(load());

  private persist() {
    writeStorage(KEY, this.plan);
  }

  get(day: Day): RecipeRef | undefined {
    return this.plan[day];
  }

  assign(day: Day, recipe: RecipeRef) {
    this.plan = { ...this.plan, [day]: recipe };
    this.persist();
  }

  remove(day: Day) {
    const next = { ...this.plan };
    delete next[day];
    this.plan = next;
    this.persist();
  }

  removeRecipe(id: string) {
    const next = Object.fromEntries(
      Object.entries(this.plan).filter(([, recipe]) => recipe?.id !== id),
    ) as MealPlan;
    this.plan = next;
    this.persist();
  }

  updateRecipe(recipe: RecipeRef) {
    this.plan = Object.fromEntries(
      Object.entries(this.plan).map(([day, planned]) => [
        day,
        planned?.id === recipe.id ? recipe : planned,
      ]),
    ) as MealPlan;
    this.persist();
  }

  clearAll() {
    this.plan = {};
    this.persist();
  }
}

export const mealPlanStore = new MealPlanStore();
