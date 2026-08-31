<script lang="ts">
  import { goto } from '$app/navigation';
  import { mealPlanStore } from '$lib/stores/mealPlan.svelte';
  import { DAYS } from '$lib/types';
  import type { Day } from '$lib/types';

  function onRemove(e: CustomEvent<{ day: string }>) {
    mealPlanStore.remove(e.detail.day as Day);
  }

  function onSlotClick(e: CustomEvent<{ day: string }>) {
    const existing = mealPlanStore.get(e.detail.day as Day);
    if (existing) {
      goto(`/recipes/${existing.id}`);
    } else {
      goto('/recipes');
    }
  }

  function clearAll() {
    if (confirm('Clear the entire meal plan?')) {
      mealPlanStore.clearAll();
    }
  }
</script>

<svelte:head>
  <title>Meal Plan | Recipe Finder</title>
</svelte:head>

<div class="header-row">
  <h1>Weekly Meal Plan</h1>
  <button class="clear-btn" onclick={clearAll}>Clear all</button>
</div>

<p class="hint">
  Each day holds one recipe. Select an empty day to browse, or add a recipe from its details page.
</p>

<div class="plan-grid">
  {#each DAYS as day}
    <section class="day-column">
      <h2>{day}</h2>
      <day-slot
        day={day}
        recipe={mealPlanStore.get(day) ?? null}
        onremove={onRemove}
        onslotClick={onSlotClick}
      >
        <span slot="empty">+ Add recipe</span>
      </day-slot>
    </section>
  {/each}
</div>

<style>
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    font-size: 1.3rem;
    margin: 0 0 4px;
  }

  .clear-btn {
    border: 1px solid #eee;
    background: white;
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 0.82rem;
    color: #888;
  }

  .hint {
    color: #888;
    font-size: 0.85rem;
    margin: 4px 0 20px;
  }

  .plan-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 14px;
  }

  .day-column h2 {
    text-align: center;
    font-size: 0.82rem;
    color: #666;
    margin: 0 0 8px;
  }
</style>
