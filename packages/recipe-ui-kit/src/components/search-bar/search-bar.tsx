import { Component, Prop, Event, EventEmitter, Host, h, State, Watch } from '@stencil/core';

/**
 * Debounced search input. Emits searchSubmit both on debounce and on
 * explicit Enter/submit so the host can choose either live search or
 * submit only behavior.
 */
@Component({
  tag: 'search-bar',
  styleUrl: 'search-bar.css',
  shadow: true,
})
export class SearchBar {
  @Prop() placeholder: string = 'Search recipes...';
  @Prop({ mutable: true }) value: string = '';
  /** Debounce delay in ms before auto-emitting while typing.*/
  @Prop() debounce: number = 400;

  /** Fires with the current query string, on debounce or Enter/submit. */
  @Event() searchSubmit!: EventEmitter<string>;

  @State() internalValue: string = '';
  private debounceTimer: any;

  componentWillLoad() {
    this.internalValue = this.value;
  }

  @Watch('value')
  onValueChange(newVal: string) {
    this.internalValue = newVal;
  }

  private onInput = (e: InputEvent) => {
    const val = (e.target as HTMLInputElement).value;
    this.internalValue = val;
    if (this.debounce > 0) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.searchSubmit.emit(this.internalValue), this.debounce);
    }
  };

  private onSubmit = (e: Event) => {
    e.preventDefault();
    clearTimeout(this.debounceTimer);
    this.searchSubmit.emit(this.internalValue);
  };

  private clear = () => {
    this.internalValue = '';
    clearTimeout(this.debounceTimer);
    this.searchSubmit.emit('');
  };

  render() {
    return (
      <Host>
        <form class="search-form" onSubmit={this.onSubmit}>
          <input
            type="search"
            value={this.internalValue}
            placeholder={this.placeholder}
            onInput={this.onInput}
            aria-label="Search recipes"
          />
          {this.internalValue && (
            <button type="button" class="clear-btn" onClick={this.clear} aria-label="Clear search">
              Clear
            </button>
          )}
          <button type="submit" class="submit-btn">Search</button>
        </form>
      </Host>
    );
  }
}
