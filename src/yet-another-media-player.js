
import { LitElement, html, css, nothing } from "lit-element";

// Media Player Supported Features bitmask
const SUPPORT_PAUSE = 1;
const SUPPORT_SEEK = 2;
const SUPPORT_VOLUME_SET = 4;
const SUPPORT_VOLUME_MUTE = 8;
const SUPPORT_PREVIOUS_TRACK = 16;
const SUPPORT_NEXT_TRACK = 32;
const SUPPORT_TURN_ON = 128;
const SUPPORT_TURN_OFF = 256;
const SUPPORT_PLAY_MEDIA = 512;
const SUPPORT_SHUFFLE = 4096;
const SUPPORT_REPEAT_SET = 262144;

window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "A multi-entity, feature-rich media card for Home Assistant."
});

class YetAnotherMediaPlayerCard extends LitElement {
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }
  get sortedEntityIds() {
  return [...this.entityIds].sort((a, b) => {
    const tA = this._playTimestamps[a] || 0;
    const tB = this._playTimestamps[b] || 0;
    return tB - tA;
  });
}
  static properties = {
    hass: {},
    config: {},
    _selectedIndex: { state: true },
    _lastPlaying: { state: true },
    _shouldDropdownOpenUp: { state: true },
    _pinnedIndex: { state: true }
  };

  static styles = css`
    :host {
      --custom-accent: var(--accent-color, #ff9800);
    }
    :host([data-match-theme="false"]) {
      --custom-accent: #ff9800;
    }
  .card-artwork-spacer {
    width: 100%;
    height: 180px; 
    pointer-events: none;
  }
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
  }
  .media-bg-dim {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1;
    pointer-events: none;
  }
  .source-menu {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0;
    margin: 0;
  }
  .source-menu-btn {
    background: none;
    border: none;
    color: var(--primary-text-color, #fff);
    font: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
    font-size: 1em;
    outline: none;
  }
  .source-selected {
    min-width: 64px;
    font-weight: 500;
    padding-right: 4px;
    text-align: left;
  }
  .source-dropdown {
    position: absolute;
    top: 32px;
    right: 0;
    left: auto;
    background: var(--card-background-color, #222);
    color: var(--primary-text-color, #fff);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.13);
    min-width: 110px;
    z-index: 11;
    margin-top: 2px;
    border: 1px solid #444;
    overflow: hidden;
    max-height: 220px;
    overflow-y: auto;
  }

  .source-dropdown.up {
    top: auto;
    bottom: 38px;
    border-radius: 8px 8px 8px 8px;
  }  

  .source-option {
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.13s;
    white-space: nowrap;
  }
  .source-option:hover, .source-option:focus {
    background: var(--accent-color, #1976d2);
    color: #fff;
  }

    :host {
      display: block;
      border-radius: 16px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
      background: var(--card-background-color, #222);
      color: var(--primary-text-color, #fff);
      transition: background 0.2s;
      overflow: hidden;
    }

    .source-row {
      display: flex;
      align-items: center;
      padding: 0 16px 8px 16px;
      margin-top: 8px;
    }
    .source-select {
      font-size: 1em;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      background: var(--card-background-color, #222);
      color: var(--primary-text-color, #fff);
      outline: none;
      margin-top: 2px;
    }

  .chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 8px;
    background: #fff;
    border-radius: 50%;
    overflow: hidden;
    padding: 0; /* Remove padding */
  }
  .chip:not([selected]):not([playing]) .chip-icon {
    background: transparent !important;
  }
  .chip:not([selected]) .chip-icon ha-icon {
    color: var(--custom-accent) !important; /* Orange for unselected chips */
  }
  .chip[selected]:not([playing]) .chip-icon {
    background: transparent !important;
  }
  .chip[selected]:not([playing]) .chip-icon ha-icon {
    color: #fff !important;
  }
  .chip-icon ha-icon {
    width: 100%;
    height: 100%;
    font-size: 28px !important;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
  .chip-mini-art {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    display: block;
  }
	.chip-row {
	  display: flex;
	  gap: 8px; 
	  padding: 8px 12px 0 12px;
	  margin-bottom: 12px;
	  overflow-x: auto;
	  overflow-y: hidden;
	  white-space: nowrap;
	  scrollbar-width: none;
	  scrollbar-color: var(--accent-color, #1976d2) #222;
	  -webkit-overflow-scrolling: touch; /* Enables momentum scrolling on iOS */
	  touch-action: pan-x; /* Hint for horizontal pan/swipe on some browsers */
	  max-width: 100vw;
	}
	.chip-row::-webkit-scrollbar {
	  display: none;
	}
	.chip-row::-webkit-scrollbar-thumb {
	  background: var(--accent-color, #1976d2);
	  border-radius: 6px;
	}
	.chip-row::-webkit-scrollbar-track {
	  background: #222;
	}

  .action-chip-row {
    display: flex;
    gap: 8px;
    padding: 2px 12px 0 12px;
    margin-bottom: 8px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
  }
  .action-chip-row::-webkit-scrollbar {
    display: none;
  }
  .action-chip {
    border-radius: 8px;                  /* Squarer corners */
    padding: 12px 20px;                  /* Taller chip, wider text space */
    background: var(--chip-action-bg, #222); /* Contrasting bg (override in theme if you want) */
    color: var(--primary-text-color, #fff);
    font-weight: 600;                    /* Bolder */
    font-size: 1.1em;
    cursor: pointer;
    border: 2px solid var(--custom-accent); /* Subtle border */
    margin-top: 2px;                     /* Space above */
    margin-bottom: 4px;                  /* Space below */
    outline: none;
    opacity: 0.95;
    transition: background 0.2s, opacity 0.2s;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-block;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10); /* Slight shadow */
  }
  .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    opacity: 1;
  }

  .chip {
    display: flex;           /* Flexbox for vertical centering */
    align-items: center;     /* Vertically center content */
    border-radius: 24px;
    padding: 6px 20px 6px 8px;
    background: var(--chip-background, #333);
    color: var(--primary-text-color, #fff);
    cursor: pointer;
    font-weight: 500;
    opacity: 0.85;
    border: none;
    outline: none;
    transition: background 0.2s, opacity 0.2s;
    flex: 0 0 auto;
    white-space: nowrap;
    position: relative;
  }
  .chip-pin {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #fff;
    border-radius: 50%;
    padding: 2px;
    z-index: 2;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--custom-accent);
    box-shadow: 0 1px 5px rgba(0,0,0,0.11);
    cursor: pointer;
    transition: box-shadow 0.18s;
  }
  .chip-pin:hover {
    box-shadow: 0 2px 12px rgba(33,33,33,0.17);
  }
  .chip-pin ha-icon {
    color: var(--custom-accent);
    font-size: 16px;
    background: transparent;
    border-radius: 50%;
    margin: 0;
    padding: 0;
  }
    .chip[playing] {
      padding-right: 26px;
    }
      .chip[selected] {
        background: var(--custom-accent);
        color: #fff;
        opacity: 1;
      }
    .media-artwork-bg {
      position: relative;
      width: 100%;
      aspect-ratio: 1.75/1;
      overflow: hidden;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: top center;
    }

    .artwork {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      background: #222;
      
    }
    .details {
      padding: 0 16px 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
      min-height: 48px;
    }
    .progress-bar-container {
      padding-left: 24px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    .title {
      font-size: 1.1em;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .artist {
      font-size: 1em;
      font-weight: 400;
      color: var(--secondary-text-color, #aaa);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #fff !important;
    }
    .controls-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 4px 16px;
    }
    .button {
      background: none;
      border: none;
      color: inherit;
      font-size: 1.5em;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .button:active {
      background: rgba(0,0,0,0.10);
    }
    .button.active ha-icon,
    .button.active {
      color: var(--custom-accent) !important;
    }
    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
      margin: 8px 0;
      cursor: pointer;
      position: relative;
      box-shadow: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
    }
    .progress-inner {
      height: 100%;
      background: var(--custom-accent);
      border-radius: 3px 0 0 3px;
      box-shadow: 0 0 8px 2px rgba(0,0,0,0.24);
    }
    .volume-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px 12px 16px;
      justify-content: space-between;
    }
    .vol-slider {
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
      outline: none;
      box-shadow: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
      flex: 1 1 auto;
      min-width: 80px;
      max-width: none;
      margin-right: 12px;
    }
    .volume-row .source-menu {
      flex: 0 0 auto;
    }

    /* Webkit browsers (Chrome, Safari, Edge) */
    .vol-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--custom-accent);
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      border: 2px solid #fff;
    }
    /* Firefox */
    .vol-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--custom-accent);
      cursor: pointer;
      border: 2px solid #fff;
    }
    .vol-slider::-moz-range-track {
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
    }
    /* IE and Edge (legacy) */
    .vol-slider::-ms-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--custom-accent);
      cursor: pointer;
      border: 2px solid #fff;
    }
    .vol-slider::-ms-fill-lower,
    .vol-slider::-ms-fill-upper {
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
    }
    /* .volume-row .source-menu block moved and replaced above for consistency */
    .vol-stepper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .vol-stepper .button {
      min-width: 36px;
      min-height: 36px;
      font-size: 1.5em;
      padding: 6px 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }    

    /* Consolidated Light Mode Styles */
    @media (prefers-color-scheme: light) {
      :host {
        background: var(--card-background-color, #fff);
      }
      .chip {
        background: #f0f0f0;
        color: #222;
      }
      .chip[selected] {
        background: var(--accent-color, #1976d2);
        color: #fff;
      }
      .artwork {
        background: #eee;
      }
      .progress-bar {
        background: #eee;
      }
      .source-menu-btn {
        color: #222;
      }
      .source-dropdown {
        background: #fff;
        color: #222;
        border: 1px solid #bbb;
      }
      .source-option {
        color: #222 !important;
        background: #fff !important;
        transition: background 0.13s, color 0.13s;
      }
      .source-option:hover,
      .source-option:focus {
        background: var(--custom-accent) !important;
        color: #222 !important;
      }
      .source-select {
        background: #fff;
        color: #222;
        border: 1px solid #aaa;
      }
      .action-chip {
        background: #e0e0e0;
        color: #222;
      }
      .action-chip:active {
        background: var(--accent-color, #1976d2);
        color: #fff;
      }
      /* Keep source menu text white when expanded (matches controls) */
      .card-lower-content:not(.collapsed) .source-menu-btn,
      .card-lower-content:not(.collapsed) .source-selected {
        color: #fff !important;
      }
      /* Only for collapsed cards: override details/title color */
      .card-lower-content.collapsed .details .title,
      .card-lower-content.collapsed .title {
        color: #222 !important;
      }
    }
    .artwork-dim-overlay {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, 
    rgba(0,0,0,0.0) 0%,
    rgba(0,0,0,0.40) 55%,
    rgba(0,0,0,0.70) 100%);
    z-index: 2;
  }    
  .card-lower-content-bg {
    position: relative;
    width: 100%;
    min-height: 320px;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
  }
  .card-lower-fade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background: linear-gradient(
  to bottom,
  rgba(0,0,0,0.0) 0%,
  rgba(0,0,0,0.40) 55%,
  rgba(0,0,0,0.92) 100%
);
  }
  .card-lower-content {
    position: relative;
    z-index: 2;
  }
  .card-lower-content.transitioning .details,
  .card-lower-content.transitioning .card-artwork-spacer {
    transition: opacity 0.3s;
  }
  /* Show details (title) when collapsed (but hide artist/artwork spacer) */
  .card-lower-content.collapsed .details {
    opacity: 1;
    pointer-events: auto;
  }
  .card-lower-content.collapsed .artist {
    opacity: 0;
    pointer-events: none;
  }
  .card-lower-content.collapsed .card-artwork-spacer {
    opacity: 0;
    pointer-events: none;
  }
    /* Force white text for important UI elements */
    .details,
    .title,
    .artist,
    .controls-row,
    .button,
    .vol-stepper span {
      color: #fff !important;
    }
  .media-artwork-placeholder ha-icon {
    width: 104px !important;
    height: 104px !important;
    min-width: 104px !important;
    min-height: 104px !important;
    max-width: 104px !important;
    max-height: 104px !important;
    display: block;
  }
  .media-artwork-placeholder ha-icon svg {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }
  `;





  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._playTimestamps = {};
    this._showSourceMenu = false;
    this._shouldDropdownOpenUp = false;
    // Progress bar timer
    this._progressTimer = null;
    this._progressValue = null;
    this._lastProgressEntityId = null;
    this._pinnedIndex = null;
    // Accent color property for custom accent (updated in setConfig)
    this._customAccent = "#ff9800";
    // For outside click detection on source dropdown
    this._sourceDropdownOutsideHandler = null;
    this._isActuallyCollapsed = false;
    // On initial load, collapse immediately if nothing is playing
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        if (stateObj && stateObj.state !== "playing") {
          this._isActuallyCollapsed = true;
          this.requestUpdate();
        }
      }
    }, 0);    
    this._collapseTimeout = null;
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = config;
    this._selectedIndex = 0;
    this._lastPlaying = null;
    // Update custom accent property
    // match_theme is YAML-only. If provided as true, use theme accent color; if false or undefined, use default accent.
    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    // Update data-match-theme attribute on the host (YAML-only)
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    // collapse_on_idle config option (default to false)
    this._collapseOnIdle = !!config.collapse_on_idle;
    // always_collapsed config option (default to false)
    this._alwaysCollapsed = !!config.always_collapsed;
  }

  get entityObjs() {
    return this.config.entities.map(e =>
      typeof e === "string"
        ? { entity_id: e, name: "" }
        : { entity_id: e.entity_id, name: e.name || "" }
    );
  }

  get entityIds() {
    return this.entityObjs.map(e => e.entity_id);
  }

  getChipName(entity_id) {
    const obj = this.entityObjs.find(e => e.entity_id === entity_id);
    if (obj && obj.name) return obj.name;
    const state = this.hass.states[entity_id];
    return state?.attributes.friendly_name || entity_id;
  }

  get currentEntityId() {
    return this.entityIds[this._selectedIndex];
  }

  get currentStateObj() {
    if (!this.hass || !this.currentEntityId) return null;
    return this.hass.states[this.currentEntityId];
  }

  updated(changedProps) {
    if (this.hass && this.entityIds) {
      // Update play timestamps for entities that are playing
      this.entityIds.forEach(id => {
        const state = this.hass.states[id];
        if (state && state.state === "playing") {
          this._playTimestamps[id] = Date.now();
        }
      });

      // Only auto-switch if not manually pinned
      if (!this._manualSelect) {
        // Find the most recently playing entity
        const sortedIds = this.sortedEntityIds;
        if (sortedIds.length > 0) {
          const mostRecentId = sortedIds[0];
          const mostRecentState = this.hass.states[mostRecentId];
          if (
            mostRecentState &&
            mostRecentState.state === "playing" &&
            this.entityIds[this._selectedIndex] !== mostRecentId
          ) {
            this._selectedIndex = this.entityIds.indexOf(mostRecentId);
          }
        }
      }
    }

    // Progress bar timer logic
    super.updated?.(changedProps);

    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    const stateObj = this.currentStateObj;
    if (stateObj && stateObj.state === "playing" && stateObj.attributes.media_duration) {
      this._progressTimer = setInterval(() => {
        this.requestUpdate();
      }, 500);
    }

   
    // Collapse debounce logic for collapse_on_idle
    if (this._collapseOnIdle) {
      const stateObj = this.currentStateObj;
      if (stateObj && stateObj.state === "playing") {
        // If playing, cancel any collapse timeout and expand immediately
        if (this._collapseTimeout) clearTimeout(this._collapseTimeout);
        this._collapseTimeout = null;
        if (this._isActuallyCollapsed) {
          this._isActuallyCollapsed = false;
          this.requestUpdate();
        }
      } else {
        // Only debounce collapse if card isn't already collapsed (chip switch or initial load already handled it)
        if (!this._isActuallyCollapsed && !this._collapseTimeout) {
          this._collapseTimeout = setTimeout(() => {
            this._isActuallyCollapsed = true;
            this._collapseTimeout = null;
            this.requestUpdate();
          }, 2000); // 2 seconds debounce for normal idle
        }
        // If the card is already collapsed (e.g. due to chip switch), do nothing—skip debounce
      }
    }
  }

  _toggleSourceMenu() {
    this._showSourceMenu = !this._showSourceMenu;
    if (this._showSourceMenu) {
      this._manualSelect = true;
      setTimeout(() => {
    this._shouldDropdownOpenUp = true;
    this.requestUpdate();
            // Add outside click/touch handler after dropdown is rendered
            this._addSourceDropdownOutsideHandler();
          }, 0);
        } else {
          this._manualSelect = false;
          this._removeSourceDropdownOutsideHandler();
        }
  }

  _addSourceDropdownOutsideHandler() {
    if (this._sourceDropdownOutsideHandler) return;
    // Use arrow fn to preserve 'this'
    this._sourceDropdownOutsideHandler = (evt) => {
      // Find dropdown and button in shadow DOM
      const dropdown = this.renderRoot.querySelector('.source-dropdown');
      const btn = this.renderRoot.querySelector('.source-menu-btn');
      // If click/tap is not inside dropdown or button, close
      // evt.composedPath() includes shadow DOM path
      const path = evt.composedPath ? evt.composedPath() : [];
      if (
        (dropdown && path.includes(dropdown)) ||
        (btn && path.includes(btn))
      ) {
        return;
      }
      // Otherwise, close the dropdown and remove handler
      this._showSourceMenu = false;
      this._manualSelect = false;
      this._removeSourceDropdownOutsideHandler();
      this.requestUpdate();
    };
    window.addEventListener('mousedown', this._sourceDropdownOutsideHandler, true);
    window.addEventListener('touchstart', this._sourceDropdownOutsideHandler, true);
  }

  _removeSourceDropdownOutsideHandler() {
    if (!this._sourceDropdownOutsideHandler) return;
    window.removeEventListener('mousedown', this._sourceDropdownOutsideHandler, true);
    window.removeEventListener('touchstart', this._sourceDropdownOutsideHandler, true);
    this._sourceDropdownOutsideHandler = null;
  }

  _selectSource(src) {
    const entity = this.currentEntityId;
    if (!entity || !src) return;
    this._showSourceMenu = false;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source: src
    });
  }

  _onPinClick(e) {
    e.stopPropagation();
    this._manualSelect = false;
    this._pinnedIndex = null;
    
  }  

  _onChipClick(idx) {
    this._selectedIndex = idx;
    this._manualSelect = true;
    this._pinnedIndex = idx;
    clearTimeout(this._manualSelectTimeout);
    // Collapse logic on chip switch
    const stateObj = this.hass.states[this.entityIds[idx]];
    if (stateObj && stateObj.state !== "playing") {
      this._isActuallyCollapsed = true;
    } else {
      this._isActuallyCollapsed = false;
    }
    this.requestUpdate();
  }

  _onActionChipClick(idx) {
    const action = this.config.actions[idx];
    if (!action) return;
    const [domain, service] = action.service.split(".");

    // Clone the service data
    let data = { ...(action.service_data || {}) };

    // Replace entity_id "current" (or similar placeholder) with currentEntityId
    if (
      data.entity_id === "current" ||
      data.entity_id === "$current" ||
      data.entity_id === "this" ||
      !data.entity_id // Optionally default if omitted
    ) {
      data.entity_id = this.currentEntityId;
    }

    this.hass.callService(domain, service, data);
  }

  _onControlClick(action) {
    const entity = this.currentEntityId;
    if (!entity) return;
    const stateObj = this.currentStateObj;
    switch (action) {
      case "play_pause":
        this.hass.callService("media_player", "media_play_pause", { entity_id: entity });
        break;
      case "next":
        this.hass.callService("media_player", "media_next_track", { entity_id: entity });
        break;
      case "prev":
        this.hass.callService("media_player", "media_previous_track", { entity_id: entity });
        break;
      case "shuffle": {
        // Toggle shuffle based on current state
        const curr = !!stateObj.attributes.shuffle;
        this.hass.callService("media_player", "shuffle_set", { entity_id: entity, shuffle: !curr });
        break;
      }
      case "repeat": {
        // Cycle: off → all → one → off
        let curr = stateObj.attributes.repeat || "off";
        let next;
        if (curr === "off") next = "all";
        else if (curr === "all") next = "one";
        else next = "off";
        this.hass.callService("media_player", "repeat_set", { entity_id: entity, repeat: next });
        break;
      }
      case "power":
        this.hass.callService("media_player", "turn_off", { entity_id: entity });
        break;
    }
  }

  _onVolumeChange(e) {
    const entity = this.currentEntityId;
    if (!entity) return;
    const vol = Number(e.target.value);
    this.hass.callService("media_player", "volume_set", { entity_id: entity, volume_level: vol });
  }

  _onVolumeStep(direction) {
    const entity = this.currentEntityId;
    if (!entity) return;
    const stateObj = this.currentStateObj;
    if (!stateObj) return;
    let current = Number(stateObj.attributes.volume_level || 0);
    current += direction * 0.05;
    current = Math.max(0, Math.min(1, current));
    this.hass.callService("media_player", "volume_set", { entity_id: entity, volume_level: current });
  }

  _onSourceChange(e) {
    const entity = this.currentEntityId;
    const source = e.target.value;
    if (!entity || !source) return;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source
    });
  }  

  _onProgressBarClick(e) {
    const entity = this.currentEntityId;
    const stateObj = this.currentStateObj;
    if (!entity || !stateObj) return;
    const duration = stateObj.attributes.media_duration;
    if (!duration) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = Math.floor(percent * duration);

    if (stateObj.state === "playing") {
      // Optimistically update local progress position for smooth UI
      stateObj.attributes.media_position = seekTime;
      stateObj.attributes.media_position_updated_at = new Date().toISOString();
      this.requestUpdate();
    }

    this.hass.callService("media_player", "media_seek", { entity_id: entity, seek_position: seekTime });
  }

    render() {
      if (!this.hass || !this.config) return nothing;
      // Set data-match-theme attribute on the host (YAML-only)
      if (this.shadowRoot && this.shadowRoot.host) {
        this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      }
      
      const stateObj = this.currentStateObj;
      if (!stateObj) return html`<div class="details">Entity not found.</div>`;

      // Calculate shuffle/repeat state only AFTER confirming stateObj exists
      const shuffleActive = !!stateObj.attributes.shuffle;
      const repeatActive = stateObj.attributes.repeat && stateObj.attributes.repeat !== "off";

      

      // Artwork
      const isPlaying = stateObj.state === "playing";
      const isRealArtwork = isPlaying && (stateObj.attributes.entity_picture || stateObj.attributes.album_art);
      const art = isRealArtwork
        ? (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        : null;
      // Details
      const title = isPlaying ? (stateObj.attributes.media_title || "") : "";
      const artist = isPlaying ? (stateObj.attributes.media_artist || stateObj.attributes.media_series_title || "") : "";
      let pos = stateObj.attributes.media_position || 0;
      const duration = stateObj.attributes.media_duration || 0;
      if (stateObj.state === "playing") {
        const updatedAt = stateObj.attributes.media_position_updated_at
          ? Date.parse(stateObj.attributes.media_position_updated_at)
          : Date.parse(stateObj.last_changed);
        const elapsed = (Date.now() - updatedAt) / 1000;
        pos += elapsed;
      }
      const progress = duration ? Math.min(1, pos / duration) : 0;

      // Volume
      const vol = Number(stateObj.attributes.volume_level || 0);
      const showSlider = this.config.volume_mode !== "stepper";

      // Collapse artwork/details on idle if configured and/or always_collapsed
      const collapsed = this._alwaysCollapsed
        ? true
        : (this._collapseOnIdle ? this._isActuallyCollapsed : false);
      // Use null if not playing or no artwork available
      const artworkUrl = stateObj && stateObj.state === "playing" && (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        ? (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        : null;

      return html`
        <div style="position:relative;">
          <div style="position:relative; z-index:2;"
            data-match-theme="${String(this.config.match_theme === true)}"
          >
            <div class="chip-row">
              ${this.sortedEntityIds.map((id) => {
                const state = this.hass.states[id];
                const isPlaying = state && state.state === "playing";
                // miniArt: show if playing and has entity_picture or album_art
                let miniArt = null;
                if (isPlaying && (state?.attributes.entity_picture || state?.attributes.album_art)) {
                  miniArt = state.attributes.entity_picture || state.attributes.album_art;
                }
                // entityIcon: icon attribute or fallback
                const entityIcon = state?.attributes.icon || "mdi:cast";
                return html`
                  <button
                    class="chip"
                    ?selected=${this.currentEntityId === id}
                    ?playing=${isPlaying}
                    @click=${() => this._onChipClick(this.entityIds.indexOf(id))}
                    @mousedown=${(e) => this._handleChipTouchStart?.(e, id)}
                    @mouseup=${(e) => this._handleChipTouchEnd?.(e, id)}
                    @touchstart=${(e) => this._handleChipTouchStart?.(e, id)}
                    @touchend=${(e) => this._handleChipTouchEnd?.(e, id)}
                  >
                    <span class="chip-icon">
                      ${miniArt
                        ? html`<img class="chip-mini-art" src="${miniArt}" alt="artwork" />`
                        : html`<ha-icon icon="${entityIcon}" style="font-size: 28px;"></ha-icon>`
                      }
                    </span>
                    ${this.getChipName(id)}
                    ${this._manualSelect && this._pinnedIndex === this.entityIds.indexOf(id)
                      ? html`
                          <button class="chip-pin" title="Unpin and resume auto-switch" @click=${(e) => this._onPinClick(e)}>
                            <ha-icon icon="mdi:pin"></ha-icon>
                          </button>
                        `
                      : nothing}
                  </button>
                `;
              })}
            </div>
            ${this.config.actions && this.config.actions.length
              ? html`
                  <div class="action-chip-row">
                    ${this.config.actions.map(
                      (a, idx) => html`
                        <button class="action-chip" @click=${() => this._onActionChipClick(idx)}>
                          ${a.icon
                            ? html`<ha-icon icon="${a.icon}" style="font-size: 22px; margin-right: ${a.name ? '8px' : '0'};"></ha-icon>`
                            : nothing}
                          ${a.name || ""}
                        </button>
                      `
                    )}
                  </div>
                `
              : nothing}
            <div class="card-lower-content-bg"
              style="
                background-image: ${
                  collapsed ? "none" :
                  artworkUrl ? `url('${artworkUrl}')` : "none"
                };
                min-height: ${collapsed ? "0px" : "320px"};
                background-size: cover;
                background-position: top center;
                background-repeat: no-repeat;
                transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s;
              "
            >
              <div class="card-lower-fade"></div>
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}">
                ${!collapsed
                  ? html`<div class="card-artwork-spacer"></div>`
                  : nothing
                }
                ${(!collapsed && !artworkUrl) ? html`
                  <div class="media-artwork-placeholder"
                    style="
                      position: absolute;
                      left: 50%; top: 36px;
                      transform: translateX(-50%);
                      width: 184px; height: 184px;
                      display: flex; align-items: center; justify-content: center;
                      background: none;
                      z-index: 2;">
                    <svg width="184" height="184" viewBox="0 0 184 184"
                      style="display:block;opacity:0.85;${this.config.match_theme === true ? 'color:#fff;' : `color:${this._customAccent};`}"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"/>
                      <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"/>
                      <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"/>
                      <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"/>
                    </svg>
                  </div>
                ` : nothing}
                <div class="details">
                  <div class="title">
                    ${isPlaying ? title : ""}
                  </div>
                  ${!collapsed
                    ? html`
                        <div class="artist">
                          ${isPlaying ? artist : ""}
                        </div>
                      `
                    : html`
                        <div class="artist"></div>
                      `
                  }
                </div>
                ${(isPlaying && duration && !collapsed)
                  ? html`
                      <div class="progress-bar-container">
                        <div
                          class="progress-bar"
                          @click=${(e) => this._onProgressBarClick(e)}
                          title="Seek"
                        >
                          <div class="progress-inner" style="width: ${progress * 100}%;"></div>
                        </div>
                      </div>
                    `
                  : html`
                      <div class="progress-bar-container">
                        <div class="progress-bar" style="visibility:hidden"></div>
                      </div>
                    `
                }
                <div class="controls-row">
                  ${this._supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK) ? html`
                    <button class="button" @click=${() => this._onControlClick("prev")} title="Previous">
                      <ha-icon icon="mdi:skip-previous"></ha-icon>
                    </button>
                  ` : nothing}
                  <button class="button" @click=${() => this._onControlClick("play_pause")} title="Play/Pause">
                    <ha-icon icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
                  </button>
                  ${this._supportsFeature(stateObj, SUPPORT_NEXT_TRACK) ? html`
                    <button class="button" @click=${() => this._onControlClick("next")} title="Next">
                      <ha-icon icon="mdi:skip-next"></ha-icon>
                    </button>
                  ` : nothing}
                  ${this._supportsFeature(stateObj, SUPPORT_SHUFFLE) ? html`
                    <button class="button${shuffleActive ? ' active' : ''}" @click=${() => this._onControlClick("shuffle")} title="Shuffle">
                      <ha-icon icon="mdi:shuffle"></ha-icon>
                    </button>
                  ` : nothing}
                  ${this._supportsFeature(stateObj, SUPPORT_REPEAT_SET) ? html`
                    <button class="button${repeatActive ? ' active' : ''}" @click=${() => this._onControlClick("repeat")} title="Repeat">
                      <ha-icon icon=${
                        stateObj.attributes.repeat === "one"
                          ? "mdi:repeat-once"
                          : "mdi:repeat"
                      }></ha-icon>
                    </button>
                  ` : nothing}
                  ${this._supportsFeature(stateObj, SUPPORT_TURN_OFF) ? html`
                    <button class="button" @click=${() => this._onControlClick("power")} title="Power">
                      <ha-icon icon="mdi:power"></ha-icon>
                    </button>
                  ` : nothing}
                </div>
                <div class="volume-row${Array.isArray(stateObj.attributes.source_list) && stateObj.attributes.source_list.length > 0 ? ' has-source' : ''}">
                  ${showSlider
                    ? html`
                        <input
                          class="vol-slider"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          .value=${vol}
                          @input=${(e) => this._onVolumeChange(e)}
                          title="Volume"
                        />
                      `
                    : html`
                        <div class="vol-stepper">
                          <button class="button" @click=${() => this._onVolumeStep(-1)} title="Vol Down">–</button>
                          <span>${Math.round(vol * 100)}%</span>
                          <button class="button" @click=${() => this._onVolumeStep(1)} title="Vol Up">+</button>
                        </div>
                      `}
                  ${Array.isArray(stateObj.attributes.source_list) && stateObj.attributes.source_list.length > 0 && !collapsed ? html`
                    <div class="source-menu">
                      <button class="source-menu-btn" @click=${() => this._toggleSourceMenu()}>
                        <span class="source-selected">
                          ${stateObj.attributes.source || "Source"}
                        </span>
                        <ha-icon icon="mdi:chevron-down"></ha-icon>
                      </button>
                      ${this._showSourceMenu ? html`
                        <div class="source-dropdown${this._shouldDropdownOpenUp ? ' up' : ''}">
                          ${stateObj.attributes.source_list.map(src => html`
                            <div class="source-option" @click=${() => this._selectSource(src)}>${src}</div>
                          `)}
                        </div>
                      ` : nothing}
                    </div>
                  ` : nothing}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }


  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    // Collapse debounce cleanup for collapse_on_idle
    if (this._collapseTimeout) {
      clearTimeout(this._collapseTimeout);
      this._collapseTimeout = null;
    }
    this._removeSourceDropdownOutsideHandler();
  }
  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor");
  }
  static getStubConfig(hass, entities) {
    return { entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2) };
  }
}

class YetAnotherMediaPlayerEditor extends LitElement {
  static properties = {
    hass: {},
    lovelace: {},
    config: {},
  };

  setConfig(config) {
    this.config = { ...config };
  }

  get _schema() {
    return [
      {
        name: "entities",
        selector: {
          entity: {
            multiple: true,
            domain: "media_player"
          }
        }
      },
      {
        name: "volume_mode",
        selector: {
          select: {
            options: [
              { value: "slider", label: "Slider" },
              { value: "stepper", label: "Stepper" }
            ]
          }
        }
      },
      {
        name: "match_theme",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "collapse_on_idle",
        selector: { boolean: {} },
        required: false
      },
      {
        name: "always_collapsed",
        selector: { boolean: {} },
        required: false
      },
      {
        name: "actions",
        selector: {
          array: {
            item_selector: {
              object: {
                name: { selector: { text: {} } },
                service: { selector: { text: {} } },
                service_data: { selector: { object: {} } }
              }
            }
          }
        }
      }
    ];
  }

  render() {
    if (!this.config) return html``;
    const configForEditor = {
      ...this.config,
      entities: (this.config.entities || []).filter(e => typeof e === "string"),
      // match_theme is YAML-only: do not expose in editor config
    };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${configForEditor}
        .schema=${this._schema}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  _valueChanged(ev) {
    const config = ev.detail.value;
    this.config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config } }));
  }
}
customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);

customElements.define("yet-another-media-player", YetAnotherMediaPlayerCard);