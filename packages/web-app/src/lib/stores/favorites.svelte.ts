import { readStorage, writeStorage } from '$lib/storage';
import type { FavoriteEntry, Recipe } from '$lib/types';

const KEY = 'favorites';

function load(): FavoriteEntry[] {
  return readStorage<FavoriteEntry[]>(KEY, []);
}

class FavoritesStore {
  entries = $state<FavoriteEntry[]>(load());

  private persist() {
    writeStorage(KEY, this.entries);
  }

  isFavorite = (id: string): boolean => this.entries.some(e => e.id === id);

  add(recipe: Recipe) {
    if (this.isFavorite(recipe.id)) return;
    this.entries = [...this.entries, { id: recipe.id, recipe }];
    this.persist();
  }

  update(recipe: Recipe) {
    if (!this.isFavorite(recipe.id)) return;
    this.entries = this.entries.map(entry =>
      entry.id === recipe.id ? { ...entry, recipe } : entry,
    );
    this.persist();
  }

  remove(id: string) {
    this.entries = this.entries.filter(e => e.id !== id);
    this.persist();
  }

  toggle(recipe: Recipe) {
    if (this.isFavorite(recipe.id)) {
      this.remove(recipe.id);
    } else {
      this.add(recipe);
    }
  }
}

export const favoritesStore = new FavoritesStore();
