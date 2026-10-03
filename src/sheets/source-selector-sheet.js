import { html, nothing } from "lit";
import { localize } from "../localize/localize.js";

/**
 * Render the source list selection sheet with alphabet index scrubber.
 * @this {import("../yet-another-media-player.js").YetAnotherMediaPlayerCard}
 * @param {string[]} sourceList
 * @param {string[]} sourceLetters
 * @param {Set<string>} availableSourceFirstLetters
 */
export function renderSourceListSheet(sourceList, sourceLetters, availableSourceFirstLetters) {
  const isGridMode = this._isGridMode;

  return html`
    <div class="entity-options-header">
      <button
        class="entity-options-item close-item"
        @click=${() => {
          if (this._quickMenuInvoke) {
            this._dismissWithAnimation();
          } else {
            this._closeSourceList();
          }
        }}
      >
        ${localize("common.back")}
      </button>
      <div class="entity-options-divider"></div>
    </div>
    <div class="entity-options-scroll source-list-centering-wrapper">
      <div class="source-list-sheet">
        <div class="source-list-scroll ${isGridMode ? "grid-menu" : ""}">
          ${sourceList.map((src) => {
            if (isGridMode) {
              return html`
                <button
                  class="entity-options-item menu-action-item"
                  @click=${() => this._selectSource(src)}
                >
                  <ha-icon class="menu-action-icon" icon="mdi:login"></ha-icon>
                  <span class="menu-action-label">${src}</span>
                </button>
              `;
            }
            return html`
              <div
                class="entity-options-item"
                data-source-name="${src}"
                @click=${() => this._selectSource(src)}
              >
                ${src}
              </div>
            `;
          })}
        </div>
      </div>
    </div>
    ${
      !isGridMode
        ? html`
            <div class="floating-source-index">
              ${sourceLetters.map((letter, i) => {
                const isAvailable = availableSourceFirstLetters.has(letter);
                const hovered = this._hoveredSourceLetterIndex;
                let scale = "";
                if (isAvailable && hovered !== null && hovered !== undefined) {
                  const dist = Math.abs(hovered - i);
                  if (dist === 0) scale = "max";
                  else if (dist === 1) scale = "large";
                  else if (dist === 2) scale = "med";
                }
                return html`
                  <button
                    class="source-index-letter"
                    ?disabled=${!isAvailable}
                    data-scale=${scale}
                    @mouseenter=${
                      isAvailable
                        ? () => {
                            this._hoveredSourceLetterIndex = i;
                            this.requestUpdate();
                          }
                        : nothing
                    }
                    @mouseleave=${() => {
                      this._hoveredSourceLetterIndex = null;
                      this.requestUpdate();
                    }}
                    @click=${isAvailable ? () => this._scrollToSourceLetter(letter) : nothing}
                  >
                    ${letter}
                  </button>
                `;
              })}
            </div>
          `
        : nothing
    }
  `;
}
