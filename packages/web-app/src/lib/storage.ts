import { browser } from '$app/environment';

/** Safely reads and writes localStorage in the browser. */
export function readStorage<T>(key: string, fallback: T): T {
  if (!browser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[storage] failed to read "${key}"`, err);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!browser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[storage] failed to write "${key}"`, err);
  }
}

export function makeId(prefix = 'user'): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
