<script lang="ts">
  import { goto } from '$app/navigation';
  import { favoritesStore } from '$lib/stores/favorites.svelte';

  function onCardClick(e: CustomEvent<{ id: string }>) {
    goto(`/recipes/${e.detail.id}`);
  }

  function onFavoriteToggle(e: CustomEvent<{ id: string }>) {
    favoritesStore.remove(e.detail.id);
  }
</script>

<svelte:head>
  <title>Favorites | Recipe Finder</title>
</svelte:head>

<h1>Your Favorites</h1>

{#if favoritesStore.entries.length === 0}
  <p class="hint">No favorites yet. Browse recipes and tap the heart to save them here.</p>
{:else}
  <div class="grid">
    {#each favoritesStore.entries as entry (entry.id)}
      <recipe-card
        recipe={entry.recipe}
        is-favorite={true}
        onfavoriteToggle={onFavoriteToggle}
        oncardClick={onCardClick}
      ></recipe-card>
    {/each}
  </div>
{/if}

<style>
  h1 {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
  }

  .hint {
    color: #888;
  }
</style>
