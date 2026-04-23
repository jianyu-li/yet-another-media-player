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
    this.preRoll = 0;
    this._activeIndex = -1;
    this._isScrolling = false;
    this._scrollTimeout = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
      this._scrollTimeout = null;
    }
  }

  firstUpdated() {
    // Initial scroll position
    if (this._activeIndex !== -1) {
      this._scrollToActive("auto");
    }
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has("lyrics")) {
      this._activeIndex = -1;
      // Re-scroll when lyrics change (new spacers or lines may have changed height)
      requestAnimationFrame(() => this._scrollToActive("auto"));
    }

    if (changedProps.has("position") || changedProps.has("lyrics")) {
      this._updateActiveLyric();
    }
  }


  _updateActiveLyric() {
    if (!this.lyrics || this.lyrics.length === 0 || this.mode === 'text') return;

    // If not a single line has a time, treat as unsynced
    const isUnsynced = !this.lyrics.some(l => l.time !== null);
    if (isUnsynced) return;

    let newActiveIndex = -1;
    const adjustedPos = this.position + this.preRoll;

    for (let i = 0; i < this.lyrics.length; i++) {
      if (this.lyrics[i].time !== null && this.lyrics[i].time <= adjustedPos) {
        newActiveIndex = i;
      } else if (this.lyrics[i].time !== null && this.lyrics[i].time > adjustedPos) {
        break;
      }
    }

    if (newActiveIndex !== this._activeIndex) {
      this._activeIndex = newActiveIndex;
      this.requestUpdate();
      // Wait for Lit to finish rendering the active class before scrolling
      if (newActiveIndex !== -1) {
        this.updateComplete.then(() => this._scrollToActive());
      }
    }
  }

  _scrollToActive(behavior = "smooth") {
    if (this._isScrolling && behavior === "smooth") return;

    const container = this.renderRoot.querySelector(".lyrics-scroll-container");
    const activeEl = container?.querySelector(".lyric-line.active");

    if (container && activeEl) {
      const containerCenter = container.clientHeight / 2;
      const elTop = activeEl.offsetTop;
      const elHeight = activeEl.clientHeight;
      const targetScrollTop = (elTop + elHeight / 2) - containerCenter;

      container.scrollTo({
        top: targetScrollTop,
        behavior: behavior
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
        <div class="scroll-spacer"></div>
        ${this.lyrics.map((lyric, index) => {
      const isActive = index === this._activeIndex;
      const isUnsyncedMode = this.mode === 'text';
      const isScrollMode = this.mode === 'scroll';
      const isDefaultMode = this.mode === 'default';

      const classes = {
        "lyric-line": true,
        "active": isActive && !isUnsynced,
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
        <div class="scroll-spacer"></div>
      </div>
    `;
  }
}

customElements.define("yamp-lyrics-view", YampLyricsView);
