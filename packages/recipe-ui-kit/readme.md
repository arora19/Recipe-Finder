# @arora19/recipe-ui-kit

Framework-agnostic Web Component library (built with [StencilJS](https://stenciljs.com))
powering the Recipe Finder & Meal Planner platform. Ships as standard Custom
Elements, so it can be consumed from Svelte, React, Vue, or plain HTML.

## Components

| Tag | Props | Events | Slots |
|---|---|---|---|
| `<recipe-card>` | `recipe: RecipeCardData`, `is-favorite: boolean` | `favoriteToggle {id}`, `cardClick {id}` | `footer` |
| `<search-bar>` | `placeholder: string`, `value: string`, `debounce: number` | `searchSubmit: string` | — |
| `<day-slot>` | `day: string`, `recipe: DaySlotRecipe \| null` | `remove {day}`, `slotClick {day}` | `empty` |

## Local development

```bash
npm install
npm start        # watches and rebuilds the library during development
npm run build     # builds dist/ and loader/
```

## Publishing

```bash
npm version patch   # or minor / major, per semver
npm run build
npm publish --access public
```

## Consuming from a framework app

```bash
npm install @arora19/recipe-ui-kit
```

```ts
const { defineCustomElements } = await import('@arora19/recipe-ui-kit/loader');
defineCustomElements();
```

Then use the tags directly in markup, passing data via properties and
listening for events with the framework's native event-binding syntax.
