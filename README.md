# Recipe Finder

A recipe discovery and weekly meal-planning platform built with **Svelte 5 + SvelteKit**, consuming a reusable **StencilJS** Web Component library.

- Discover recipes from [TheMealDB](https://www.themealdb.com/api.php) (search and filter by category)
- View full recipe details (ingredients + instructions)
- Create, edit, and delete your own recipes (stored locally)
- Favorite / unfavorite recipes
- Assign one recipe to each day in a Mon–Sun meal plan

---

## Architecture

```
recipe-platform/
├── packages/
│   ├── recipe-ui-kit/   - StencilJS component library
│   └── web-app/         - SvelteKit application
└── package.json         - npm workspaces convenience scripts
```

The app imports the library by its published package name. npm workspaces link
the local library during development; a clean standalone app install resolves
the same dependency from the npm registry.

## Package Publication

- **npm:** https://www.npmjs.com/package/@arora19/recipe-ui-kit
- **GitHub:** https://github.com/arora19/Recipe-Finder
- **Deployed app:** https://recipe-finder-web-app-18m1.vercel.app
- **Current version:** `0.1.0`

The package name is `@arora19/recipe-ui-kit`.

## Component Library API

See [`packages/recipe-ui-kit/readme.md`](./packages/recipe-ui-kit/readme.md)
for the props/events/slots reference for the three focused components:
`recipe-card`, `search-bar`, and `day-slot`.

---

## Setup Instructions

### Prerequisites

- Node.js **18+** (Node 20 LTS recommended)
- npm 9+ (or pnpm/yarn — commands below use npm)
- No API key required — TheMealDB's free tier (`www.themealdb.com/api/json/v1/1/`) is public

### 1. Install

```bash
cd recipe-platform
npm install
```

### 2. Build the component library

```bash
npm run build:ui-kit
```

The SvelteKit app depends on the published package version:

```json
"dependencies": { "@arora19/recipe-ui-kit": "^0.1.0" }
```

When developing in this monorepo, npm links the matching local workspace.

## Starting the Development Server

```bash
npm run dev:web
# or: cd packages/web-app && npm run dev
```

App runs at **http://localhost:5173**.

To work on components with live-reload in isolation (before publishing a
new version):

```bash
npm run dev:ui-kit
# or: cd packages/recipe-ui-kit && npm start
```

Stencil watches the library source and rebuilds it when a component changes.

## Building for Production

```bash
npm run build:ui-kit   # outputs packages/recipe-ui-kit/dist, /loader
npm run build:web      # outputs packages/web-app/.svelte-kit / build
```

---

## Assumptions

- TheMealDB is used for recipe discovery and provides read-only recipe data.
- User recipes, favorites, and meal plans are stored in `localStorage`.
- No authentication, backend, or database is required.
- Only user-created recipes can be edited or deleted.
- A meal-plan day can contain one recipe; assigning another replaces it.
- Image URLs are optional for user-created recipes.
