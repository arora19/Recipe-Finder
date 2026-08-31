declare global {
  namespace App {}
}

// Custom elements supplied by the Stencil package.
declare namespace svelteHTML {
  interface IntrinsicElements {
    'recipe-card': any;
    'search-bar': any;
    'day-slot': any;
  }
}

export {};
