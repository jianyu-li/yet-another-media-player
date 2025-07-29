import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";

// import { LitElement, html, css, nothing } from "lit";

/**
 * Renders the search sheet UI for media search.
 *
 * @param {Object} opts
 * @param {boolean} opts.open - Whether the search sheet is visible.
 * @param {string} opts.query - Current search query value.
 * @param {Function} opts.onQueryInput - Handler for query input change.
 * @param {Function} opts.onSearch - Handler for search action.
 * @param {Function} opts.onClose - Handler for closing the sheet.
 * @param {boolean} opts.loading - Loading state for search.
 * @param {Array} opts.results - Search result items (array of media items).
 * @param {Function} opts.onPlay - Handler to play a media item.
 * @param {string} [opts.error] - Optional error message.
 */
export function renderSearchSheet({
  open,
  query,
  onQueryInput,
  onSearch,
  onClose,
  loading,
  results,
  onPlay,
  error,
}) {
  if (!open) return nothing;
  return html`
    <div class="search-sheet">
      <div class="search-sheet-header">
        <input
          type="text"
          .value=${query || ""}
          @input=${onQueryInput}
          placeholder="Search music..."
          autofocus
        />
        <button @click=${onSearch} ?disabled=${loading || !query}>Search</button>
        <button @click=${onClose} title="Close Search">✕</button>
      </div>
      ${loading ? html`<div class="search-sheet-loading">Loading...</div>` : nothing}
      ${error ? html`<div class="search-sheet-error">${error}</div>` : nothing}
      <div class="search-sheet-results">
        ${(results || []).length === 0 && !loading
          ? html`<div class="search-sheet-empty">No results.</div>`
          : (results || []).map(
              (item) => html`
                <div class="search-sheet-result">
                  <img
                    class="search-sheet-thumb"
                    src=${item.thumbnail}
                    alt=${item.title}
                  />
                  <span class="search-sheet-title">${item.title}</span>
                  <button class="search-sheet-play" @click=${() => onPlay(item)}>
                    ▶
                  </button>
                </div>
              `
            )}
      </div>
    </div>
  `;
}
