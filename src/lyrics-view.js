import { LitElement, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { lyricsStyles } from "./yamp-card-styles.js";
import { localize } from "./localize/localize.js";

export class YampLyricsView extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lyrics: { type: Array },
      position: { type: Number },
      loading: { type: Boolean },
      error: { type: Boolean },
      activeThemeColor: { type: String },
      mode: { type: String },
      preRoll: { type: Number }
    };
  }

  static get styles() {
    return lyricsStyles;
  }

  constructor() {
    super();
    this.lyrics = [];
    this.position = 0;
    this.loading = false;
    this.error = false;
    this.activeThemeColor = "#ffffff";
    this.mode = "default";
    this.preRoll = 1;
    this._activeIndex = -1;
    this._isScrolling = false;
    this._scrollTimeout = null;
  }

  firstUpdated() {
    // Set the correct JS-based padding once we have real dimensions
    this._applyScrollPadding();
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has("lyrics")) {
      // Re-apply padding when lyrics change (container may have reflowed)
      requestAnimationFrame(() => this._applyScrollPadding());
    }

    if (changedProps.has("position") || changedProps.has("lyrics")) {
      this._updateActiveLyric();
    }
  }

  /**
   * Sets the scroll container's top/bottom padding to exactly half the container's
   * clientHeight (in px). This is the only reliable way to center any line — CSS
   * percentage padding is always relative to WIDTH, not height.
   */
  _applyScrollPadding() {
    const container = this.renderRoot.querySelector(".lyrics-scroll-container");
    if (!container) return;
    const halfHeight = Math.round(container.clientHeight / 2);
    container.style.paddingTop = `${halfHeight}px`;
    container.style.paddingBottom = `${halfHeight}px`;
  }

  _updateActiveLyric() {
    if (!this.lyrics || this.lyrics.length === 0 || this.mode === 'text') return;

    // If not a single line has a time, treat as unsynced
    const isUnsynced = !this.lyrics.some(l => l.time !== null);
    if (isUnsynced) return;

    let newActiveIndex = -1;
    const adjustedPos = this.position + (this.preRoll ?? 1);

    for (let i = 0; i < this.lyrics.length; i++) {
      if (this.lyrics[i].time !== null && this.lyrics[i].time <= adjustedPos) {
        newActiveIndex = i;
      } else if (this.lyrics[i].time !== null && this.lyrics[i].time > adjustedPos) {
        break;
      }
    }

    if (newActiveIndex !== this._activeIndex && newActiveIndex !== -1) {
      this._activeIndex = newActiveIndex;
      this.requestUpdate();
      // Wait for Lit to finish rendering the active class before scrolling
      this.updateComplete.then(() => this._scrollToActive());
    }
  }

  _scrollToActive() {
    if (this._isScrolling) return;

    const container = this.renderRoot.querySelector(".lyrics-scroll-container");
    const allLines = this.renderRoot.querySelectorAll(".lyric-line");
    const activeEl = allLines[this._activeIndex];

    if (container && activeEl) {
      // Center the active element within the visible portion of the container.
      // offsetTop is relative to the scroll content, so (elCenter - viewportCenter) = target scrollTop.
      const containerCenter = container.clientHeight / 2;
      const elTop = activeEl.offsetTop;
      const elHeight = activeEl.clientHeight;
      const targetScrollTop = (elTop + elHeight / 2) - containerCenter;

      container.scrollTo({
        top: targetScrollTop,
        behavior: "smooth"
      });
    }
  }

  _handleScroll() {
    this._isScrolling = true;
    if (this._scrollTimeout) clearTimeout(this._scrollTimeout);

    // Resume auto-scrolling after 3 seconds of inactivity
    this._scrollTimeout = setTimeout(() => {
      this._isScrolling = false;
      this._scrollToActive();
    }, 3000);
  }



  render() {
    if (this.error) {
      return html`
        <div class="lyrics-error">
          <ha-icon icon="mdi:text-box-remove-outline"></ha-icon>
          <div>${localize("lyrics.not_available")}</div>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="lyrics-loading">
          <ha-circular-progress active></ha-circular-progress>
          <div>${localize("lyrics.finding")}</div>
        </div>
      `;
    }

    if (!this.lyrics || this.lyrics.length === 0) {
      return html`
        <div class="lyrics-empty">
          <ha-icon icon="mdi:text-box-search-outline"></ha-icon>
          <div>${localize("lyrics.none_found")}</div>
        </div>
      `;
    }

    const isUnsynced = !this.lyrics.some(l => l.time !== null);

    return html`
      <div class="lyrics-scroll-container" @scroll=${this._handleScroll} style="--yamp-primary-color: ${this.activeThemeColor}">
        ${this.lyrics.map((lyric, index) => {
      const isActive = index === this._activeIndex;
      const isUnsyncedMode = this.mode === 'text';
      const isScrollMode = this.mode === 'scroll';
      const isDefaultMode = this.mode === 'default';

      const classes = {
        "lyric-line": true,
        "active": isActive && !isUnsynced && isDefaultMode,
        "unsynced": isUnsynced || isUnsyncedMode,
        "scroll-mode": isScrollMode && !isUnsynced
      };
      return html`
            <div
              class="${classMap(classes)}"
            >
              ${lyric.text}
            </div>
          `;
    })}
      </div>
    `;
  }
}

customElements.define("yamp-lyrics-view", YampLyricsView);
