import { Component, Prop, Event, EventEmitter, Host, h } from '@stencil/core';
import { RecipeCardData } from '../../shared-types';

/**
 * Displays a recipe summary (image, title, category/area tags) with a
 * favorite toggle. Emits events instead of mutating state itself so the
 * host app (SvelteKit) owns all data.
 *
 */
@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  /** Recipe summary data. Passed as a JS object property from Svelte. */
  @Prop() recipe!: RecipeCardData;

  /** Whether this recipe is currently favorited. */
  @Prop({ attribute: 'is-favorite' }) isFavorite: boolean = false;

  /** Fires when the favorite icon is clicked. */
  @Event() favoriteToggle!: EventEmitter<{ id: string }>;

  /** Fires when the card body is clicked (for navigation). */
  @Event() cardClick!: EventEmitter<{ id: string }>;

  private handleFavClick = (e: Event) => {
    e.stopPropagation();
    this.favoriteToggle.emit({ id: this.recipe.id });
  };

  private handleCardClick = () => {
    this.cardClick.emit({ id: this.recipe.id });
  };

  render() {
    const r = this.recipe;
    if (!r) return null;

    return (
      <Host>
        <article class="card">
          <div class="image-wrap" onClick={this.handleCardClick}>
            {r.image ? (
              <img src={r.image} alt={r.title} loading="lazy" />
            ) : (
              <div class="image-placeholder" role="img" aria-label={`No image available for ${r.title}`}>No image</div>
            )}
            <button
              type="button"
              class={{ 'fav-btn': true, active: this.isFavorite }}
              onClick={this.handleFavClick}
              aria-pressed={this.isFavorite ? 'true' : 'false'}
              aria-label={this.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {this.isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>
          <div class="body">
            <h3 onClick={this.handleCardClick}>{r.title}</h3>
            <div class="meta">
              {r.category && <span class="tag">{r.category}</span>}
              {r.area && <span class="tag tag--area">{r.area}</span>}
              {(r.tags || []).slice(0, 2).map(t => (
                <span class="tag tag--muted">{t}</span>
              ))}
            </div>
            <div class="footer">
              <slot name="footer" />
            </div>
          </div>
        </article>
      </Host>
    );
  }
}
