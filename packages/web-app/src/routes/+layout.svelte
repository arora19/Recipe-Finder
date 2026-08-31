<script lang="ts">
  import { page } from '$app/stores';

  let { children } = $props();

  const links = [
    { href: '/recipes', label: 'Browse' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/meal-plan', label: 'Meal Plan' },
    { href: '/recipes/new', label: '+ New Recipe' },
  ];
</script>

<div class="app-shell">
  <header class="topbar">
    <a class="brand" href="/recipes">Recipe Finder</a>
    <nav>
      {#each links as l}
        <a href={l.href} class:active={$page.url.pathname.startsWith(l.href) && l.href !== '/recipes' || $page.url.pathname === '/recipes' && l.href === '/recipes'}>
          {l.label}
        </a>
      {/each}
    </nav>
  </header>

  <main>
    {@render children()}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: #fafafa;
    color: #1f1f1f;
  }

  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 28px;
    background: white;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .brand {
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    color: #1f1f1f;
  }

  nav {
    display: flex;
    gap: 20px;
  }

  nav a {
    text-decoration: none;
    color: #666;
    font-size: 0.92rem;
  }

  nav a.active {
    color: #e8590c;
    font-weight: 600;
  }

  main {
    flex: 1;
    max-width: 1180px;
    width: 100%;
    margin: 0 auto;
    padding: 24px 28px 60px;
    box-sizing: border-box;
  }
</style>
