import { Component, Prop, Event, EventEmitter, Host, h } from '@stencil/core';
import { DaySlotRecipe } from '../../shared-types';

/**
 * A single meal-plan day. Displays the assigned recipe if present,
 * otherwise shows the "empty" slot content.
 *
 */
@Component({
  tag: 'day-slot',
  styleUrl: 'day-slot.css',
  shadow: true,
})
export class DaySlot {
  @Prop() day!: string;
  @Prop() recipe: DaySlotRecipe | null = null;

  /** Fires when the remove button is clicked. */
  @Event() remove!: EventEmitter<{ day: string }>;

  /** Fires when the slot itself (assigned or empty) is clicked.  */
  @Event() slotClick!: EventEmitter<{ day: string }>;

  private onRemove = (e: Event) => {
    e.stopPropagation();
    this.remove.emit({ day: this.day });
  };

  private onClick = () => {
    this.slotClick.emit({ day: this.day });
  };

  render() {
    return (
      <Host>
        <div class={{ slot: true, filled: !!this.recipe }} onClick={this.onClick}>
          {this.recipe ? (
            <div class="filled-content">
              {this.recipe.image ? (
                <img src={this.recipe.image} alt={this.recipe.title} />
              ) : (
                <span class="image-placeholder" aria-hidden="true">No image</span>
              )}
              <span class="title">{this.recipe.title}</span>
              <button type="button" class="remove-btn" onClick={this.onRemove} aria-label="Remove meal">
                Remove
              </button>
            </div>
          ) : (
            <div class="empty-content">
              <slot name="empty">
                <span class="default-empty">+ Add</span>
              </slot>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
