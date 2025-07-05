
import { LitElement, html, css, nothing } from "lit";

// Supported feature flags
const SUPPORT_PAUSE = 1;
const SUPPORT_SEEK = 2;
const SUPPORT_VOLUME_SET = 4;
const SUPPORT_VOLUME_MUTE = 8;
const SUPPORT_PREVIOUS_TRACK = 16;
const SUPPORT_NEXT_TRACK = 32;
const SUPPORT_TURN_ON = 128;
const SUPPORT_TURN_OFF = 256;
const SUPPORT_PLAY_MEDIA = 512;
const SUPPORT_STOP = 4096;
const SUPPORT_SHUFFLE = 32768;
const SUPPORT_GROUPING = 524288;  
const SUPPORT_REPEAT_SET = 262144;

window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "YAMP is a multi-entity media card with custom actions"
});

class YetAnotherMediaPlayerCard extends LitElement {
  _debouncedVolumeTimer = null;
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }


   // Show Stop button if supported and layout allows.
  _shouldShowStopButton(stateObj) {
    if (!this._supportsFeature(stateObj, SUPPORT_STOP)) return false;
    // Show if wide layout or few controls.
    const row = this.renderRoot?.querySelector('.controls-row');
    if (!row) return true; // Default to show if can't measure
    const minWide = row.offsetWidth > 480;
    const controls = this._countMainControls(stateObj);
    // Limit Stop visibility on compact layouts.
    return minWide || controls <= 5;
  }

  _countMainControls(stateObj) {
    let count = 0;
    if (this._supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK)) count++;
    count++;
    if (this._supportsFeature(stateObj, SUPPORT_NEXT_TRACK)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_SHUFFLE)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_REPEAT_SET)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_TURN_OFF) ||
        this._supportsFeature(stateObj, SUPPORT_TURN_ON)) count++;
    return count;
  }
  get sortedEntityIds() {
    return [...this.entityIds].sort((a, b) => {
      const tA = this._playTimestamps[a] || 0;
      const tB = this._playTimestamps[b] || 0;
      return tB - tA;
    });
  }

  // Return array of groups, ordered by most recent play
  get groupedSortedEntityIds() {
    if (!this.entityIds || !Array.isArray(this.entityIds)) return [];
    const map = {};
    for (const id of this.entityIds) {
      const key = this._getGroupKey(id);
      if (!map[key]) map[key] = { ids: [], ts: 0 };
      map[key].ids.push(id);
      map[key].ts = Math.max(map[key].ts, this._playTimestamps[id] || 0);
    }
    return Object.values(map)
      .sort((a, b) => b.ts - a.ts)   // sort groups by recency
      .map(g => g.ids.sort());       // sort ids alphabetically inside each group
  }
  static properties = {
    hass: {},
    config: {},
    _selectedIndex: { state: true },
    _lastPlaying: { state: true },
    _shouldDropdownOpenUp: { state: true },
    _pinnedIndex: { state: true }
    ,_showSourceList: { state: true }
  };

  static styles = css`
  .dim-idle .details,
  .dim-idle .controls-row,
  .dim-idle .volume-row,
  .dim-idle .chip-row,
  .dim-idle .action-chip-row {
    opacity: 0.28 !important;
    transition: opacity 0.5s;
  }
  .media-browser-menu {
    display: flex;
    align-items: center;
    margin-right: 0px;
  }
  .media-browser-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    padding: 0;
    margin: 0 4px;
    background: none;
    border: none;
    color: var(--primary-text-color, #fff);
    font: inherit;
    cursor: pointer;
    outline: none;
  }
  .media-browser-btn ha-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    width: 28px;
    height: 28px;
    line-height: 1;
    vertical-align: middle;
    position: relative;
    margin: 0;
    margin-bottom: 2px;
    color: #fff !important;
  }
    :host {
      --custom-accent: var(--accent-color, #ff9800);
    }
    :host([data-match-theme="false"]) {
      --custom-accent: #ff9800;
    }
  .card-artwork-spacer {
    width: 100%;
    flex: 1 1 0;          /* grow *and* shrink with the card height */
    height: auto;         /* let the browser compute height */
    min-height: 180px;        /* allow the spacer to collapse on tiny cards */
   
    pointer-events: none;
  }
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-size: cover;
    background-position: top center;
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
    gap: 1px;
    padding: 2px 10px;
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

    ha-card.yamp-card {
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
  .chip-row.grab-scroll-active,
  .action-chip-row.grab-scroll-active {
    cursor: grabbing !important;
  }
  .chip-row,
  .action-chip-row {
    cursor: grab;
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
    background: var(--card-background-color, #222);
    opacity: 1;
    border-radius: 8px;
    color: var(--primary-text-color, #fff);
    box-shadow: none !important;
    text-shadow: none !important;
    border: none;
    outline: none;
    padding: 4px 12px;
    font-weight: 500;
    font-size: 0.95em;
    cursor: pointer;
    margin: 4px 0;
    transition: background 0.2s ease, transform 0.1s ease;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  :host([data-match-theme="true"]) .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  :host([data-match-theme="false"]) .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  :host([data-match-theme="true"]) .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: none !important;
    text-shadow: none !important;
  }
  :host([data-match-theme="false"]) .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: none !important;
    text-shadow: none !important;
  }

  .chip {
    display: flex;           /* Flexbox for vertical centering */
    align-items: center;     /* Vertically center content */
    border-radius: 24px;
    padding: 6px 6px 6px 8px;
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
  .chip:hover {
    background: var(--custom-accent);
    color: #fff;
  }
  .chip:hover .chip-icon ha-icon {
    color: #fff !important;
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
  .chip-pin-inside {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    background: transparent;
    border-radius: 50%;
    padding: 2px;
    cursor: pointer;
  }
  .chip-pin-inside ha-icon {
    color: var(--custom-accent, #ff9800);
    font-size: 17px;
    margin: 0;
  }
  .chip[selected] .chip-pin-inside ha-icon {
    color: #fff !important;  /* White pin icon for selected (orange) chips */
  }
  .chip-pin-spacer {
    display: flex;
    width: 24px;
    min-width: 24px;
    height: 1px;
  }
    .chip[playing] {
      padding-right: 6px;
    }
      .chip[selected] {
        background: var(--custom-accent);
        color: #fff;
        opacity: 1;
      }
  /* Grouped master chip shows a count instead of artwork/icon */
  .chip-icon.group-icon {
    background: var(--custom-accent);
    color: #fff !important;
    position: relative;
  }
  .group-count {
    font-weight: 700;
    font-size: 0.9em;
    line-height: 28px; /* matches .chip-icon width */
    text-align: center;
    width: 100%;
    color: inherit;
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
    .details .title {
      padding-top: 8px;
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
      padding: 0 12px 12px 25px;
      justify-content: space-between;
    }
    .vol-slider {
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: hsla(0, 0.00%, 100.00%, 0.22);
      border-radius: 3px;
      outline: none;
      box-shadow: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
      flex: 1 1 auto;
      min-width: 80px;
      max-width: none;
      margin-right: 12px;
      margin-top: 10px;
      margin-bottom: 10px;
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
      :host([data-match-theme="true"]) .chip[selected] {
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
        background: var(--card-background-color, #fff);
        opacity: 1;
        border-radius: 8px;
        color: var(--primary-text-color, #222);
        box-shadow: none !important;
        text-shadow: none !important;
        border: none;
        outline: none;
      }
      .action-chip:active {
        background: var(--accent-color, #1976d2);
        color: #fff;
        opacity: 1;
        transform: scale(0.98);
        box-shadow: none !important;
        text-shadow: none !important;
      }
      /* Keep source menu text white when expanded (matches controls) */
      .card-lower-content:not(.collapsed) .source-menu-btn,
      .card-lower-content:not(.collapsed) .source-selected {
        color: #fff !important;
      }
      /* Only for collapsed cards: override details/title color */
      /* .card-lower-content.collapsed .details .title,
      .card-lower-content.collapsed .title {
        color: #222 !important;
      } */
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
  .card-lower-content-container {
    position: relative;
    width: 100%;
    min-height: auto; /* allow vertical auto‑resize */
    height: 100%;     /* stretch to fill grid-assigned rows */
    display: flex;    /* enables spacer to grow */
    flex: 1 1 auto;
    flex-direction: column;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
  }
  .card-lower-content-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
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
  .card-lower-content.collapsed .card-artwork-spacer {
    opacity: 0;
    pointer-events: none;
  }

  /* Stretch the lower content to fill the card so flex‑grown elements
     like .card-artwork-spacer can expand and consume extra vertical space */
  .card-lower-content {
    display: flex;
    flex-direction: column;
    height: 100%;
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
  .card-lower-content.collapsed .collapsed-artwork-container {
    position: absolute;
    top: 10px;
    right: 18px;
    width: 110px;
    height: calc(100% - 120px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 5;
    background: transparent !important;
    pointer-events: none;
    box-shadow: none !important;
    padding: 0;
    transition: background 0.4s;
  }
  .card-lower-content.collapsed .collapsed-artwork {
    width: 98px !important;
    height: 98px !important;
    border-radius: 14px !important;
    object-fit: cover !important;
    background: transparent !important;
    box-shadow: 0 1px 6px rgba(0,0,0,0.22);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 2px;
  }
  .card-lower-content.collapsed .controls-row {
    max-width: calc(100% - 120px); /* Leaves room for floating artwork + margin */
    margin-right: 110px;            /* Visually lines up with artwork edge */
  }
  .card-lower-content-bg {
    height: 100% !important;
  }
  
  @media (max-width: 420px) {
    .card-lower-content.collapsed .controls-row {
      max-width: 100% !important;
      margin-right: 0 !important;
    }
    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 70px !important;
      height: 70px !important;
      right: 10px !important;
    }
    .card-lower-content.collapsed .collapsed-artwork {
      width: 62px !important;
      height: 62px !important;
    }
  }

  .collapsed-progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background: var(--custom-accent, #ff9800);
    border-radius: 0 0 12px 12px;
    z-index: 99;
    transition: width 0.2s linear;
    pointer-events: none;
  }
  /* Options overlay is card-contained, not fixed to viewport */
  .entity-options-overlay {
    position: absolute; /* Now relative to the card, not the page */
    left: 0; right: 0; top: 0; bottom: 0;
    z-index: 30;
    background: rgba(15,18,30,0.70); /* Increased darkening for clarity */
    display: flex;
    align-items: flex-end;
    justify-content: center;
    /* No blur/backdrop, just a hint of background */
  }
  /* Options sheet is scrollable and clipped to card, not the page */
  .entity-options-sheet {
    background: none;
    border-radius: 16px 16px 0 0;
    box-shadow: none;
    width: 98%;
    max-width: 430px;
    margin-bottom: 1.5%;
    padding: 18px 8px 8px 8px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    /* Sheet max-height is now relative to the card, so scrolling stays inside */
    max-height: 85%;
    min-height: 90px;
    overflow-y: auto !important;
    overflow-x: hidden;
    overscroll-behavior: contain;
  }
  .entity-options-sheet {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge Legacy */
  }
  .entity-options-sheet::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  .entity-options-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 18px;
    text-align: center;
    color: #fff;
    background: none;
    text-shadow: 0 2px 8px #0009;
  }
  .entity-options-item {
    background: none;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 500;
    margin: 10px 0;
    padding: 18px 0 10px 0;
    cursor: pointer;
    transition: color 0.13s, text-shadow 0.13s;
    text-align: center;
    text-shadow: 0 2px 8px #0009;
  }

  .entity-options-item:hover {
    color: var(--custom-accent, #ff9800) !important;
    text-shadow: none !important;
    background: none;
  }

  .group-toggle-btn {
    background: none;
    border: 1px solid currentColor;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15em;
    line-height: 1;
    margin-right: 10px;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
    overflow: hidden;
  }
  .group-toggle-btn span,
  .group-toggle-btn .group-toggle-fix {
    position: relative;
    left: 0.5px;
  }
  .group-toggle-btn:hover {
    background: rgba(255,255,255,0.1);
  }

  /* Force white text/icons in the grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: #fff !important;
  }

  /* Ensure the + / – toggle icon and border are white */
  .group-toggle-btn {
    color: #fff !important;
    border-color: #fff !important;
  }
  .group-toggle-btn:hover {
    background: rgba(255,255,255,0.15);
  }
`




  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._playTimestamps = {};
    this._showSourceMenu = false;
    this._shouldDropdownOpenUp = false;
    this._collapsedArtDominantColor = "#444";
    this._lastArtworkUrl = null;
    // Timer for progress updates
    this._progressTimer = null;
    this._progressValue = null;
    this._lastProgressEntityId = null;
    this._pinnedIndex = null;
    // Accent color, updated in setConfig
    this._customAccent = "#ff9800";
    // Outside click handler for source dropdown
    this._sourceDropdownOutsideHandler = null;
    this._isActuallyCollapsed = false;
    // Overlay state for entity options
    this._showEntityOptions = false;
    // Overlay state for grouping sheet
    this._showGrouping = false;
    // Overlay state for source list sheet
    this._showSourceList = false;
    // Alternate progress‑bar mode
    this._alternateProgressBar = false;
    // Collapse on load if nothing is playing
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
    // Store previous collapsed state
    this._prevCollapsed = null;
  }


   // Notify Home Assistant to recalculate layout
  _notifyResize() {
    this.dispatchEvent(new Event("iron-resize", { bubbles: true, composed: true }));
  }

  // Extract dominant color from image
  async _extractDominantColor(imgUrl) {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;
      img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        resolve(`rgb(${r},${g},${b})`);
      };
      img.onerror = function() { resolve("#888"); };
    });
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = config;
    this._selectedIndex = 0;
    this._lastPlaying = null;
    // Set accent color
    
    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    // Collapse card when idle
    this._collapseOnIdle = !!config.collapse_on_idle;
    // Force always-collapsed view
    this._alwaysCollapsed = !!config.always_collapsed;
    // Alternate progress‑bar mode
    this._alternateProgressBar = !!config.alternate_progress_bar;
    // Do not mutate config.force_chip_row here.
  }

  get entityObjs() {
    return this.config.entities.map(e =>
      typeof e === "string"
        ? { entity_id: e, name: "" }
        : {
            entity_id: e.entity_id,
            name: e.name || "",
            volume_entity: e.volume_entity,
            sync_power: !!e.sync_power
          }
    );
  }


  // Return volume entity for given index (use override if set)
  _getVolumeEntity(idx) {
    const obj = this.entityObjs[idx];
    return (obj && obj.volume_entity) ? obj.volume_entity : obj.entity_id;
  }

  // Return grouping key
  _getGroupKey(id) {
    const st = this.hass?.states?.[id];
    if (!st) return id;
    const members = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members
      : [];
    if (!members.length) return id;
    const all = [id, ...members].sort();
    return all[0];
  }

  get entityIds() {
    return this.entityObjs.map(e => e.entity_id);
  }

  // Return display name for a chip/entity
  getChipName(entity_id) {
    const obj = this.entityObjs.find(e => e.entity_id === entity_id);
    if (obj && obj.name) return obj.name;
    const state = this.hass.states[entity_id];
    return state?.attributes.friendly_name || entity_id;
  }

  // Render a chip for an entity (safe if state is missing)
  _renderChip(id) {
    const idx   = this.entityIds.indexOf(id);
    const state = this.hass?.states?.[id];
    const isPlaying = state?.state === "playing";

    const art  = isPlaying && (
      state?.attributes?.entity_picture || state?.attributes?.album_art
    );
    const icon = state?.attributes?.icon || "mdi:cast";

    return html`
      <button class="chip"
              ?selected=${this.currentEntityId === id}
              ?playing=${isPlaying}
              @click=${() => this._onChipClick(idx)}
              style="display:flex;align-items:center;justify-content:space-between;">
        <span class="chip-icon">
          ${art
            ? html`<img class="chip-mini-art" src="${art}" />`
            : html`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
        </span>
        <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
          ${this.getChipName(id)}
        </span>
        ${this._pinnedIndex === idx
          ? html`
              <span class="chip-pin-inside" @click=${e => { e.stopPropagation(); this._onPinClick(e); }} title="Unpin">
                <ha-icon .icon=${"mdi:pin"}></ha-icon>
              </span>
            `
          : html`<span class="chip-pin-spacer"></span>`
        }
      </button>
    `;
  }

  // Return group master (includes all others in group_members)
  _getActualGroupMaster(group) {
    if (!this.hass || !group || group.length < 2) return group[0];
    return group.find(id => {
      const st = this.hass.states[id];
      if (!st) return false;
      const members = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];
      // Master should include all other group members in the group
      return group.every(otherId => otherId === id || members.includes(otherId));
    }) || group[0];
  }

  // Render group chip (shows count instead of icon, opens group sheet)
  _renderGroupChip(group) {
    const id   = this._getActualGroupMaster(group); // true group master if possible
    const idx  = this.entityIds.indexOf(id);
    const state = this.hass?.states?.[id];
    const isPlaying = state?.state === "playing";
    const count = group.length;          // total players in the group

    return html`
      <button class="chip"
              ?selected=${this.currentEntityId === id}
              ?playing=${isPlaying}
              @click=${() => this._onChipClick(idx)}>
        <span class="chip-icon group-icon"
              @click=${e => { 
                e.stopPropagation(); 
                const idx = this.entityIds.indexOf(id);
                if (idx >= 0) {
                  this._selectedIndex = idx;
                  this._manualSelect = true;
                  this._pinnedIndex = idx;
                }
                this._openGrouping();
              }}
              title="Show grouped players">
          <span class="group-count">${count}</span>
        </span>
        ${this._pinnedIndex === idx ? html`
          <span class="chip-pin" @click=${e => this._onPinClick(e)} title="Unpin">
            <ha-icon .icon=${"mdi:pin"}></ha-icon>
          </span>
        ` : nothing}
        ${this.getChipName(id)}
      </button>
    `;
  }

  get currentEntityId() {
    return this.entityIds[this._selectedIndex];
  }

  get currentStateObj() {
    if (!this.hass || !this.currentEntityId) return null;
    return this.hass.states[this.currentEntityId];
  }

  get currentVolumeStateObj() {
    const obj = this.entityObjs[this._selectedIndex];
    const entityId = obj?.volume_entity || obj?.entity_id;
    return entityId ? this.hass.states[entityId] : null;
  }

  updated(changedProps) {
    if (this.hass && this.entityIds) {
      // Update timestamps for playing entities
      this.entityIds.forEach(id => {
        const state = this.hass.states[id];
        if (state && state.state === "playing") {
          this._playTimestamps[id] = Date.now();
        }
      });

      // Auto-switch unless manually pinned
      if (!this._manualSelect) {
        // Switch to most recent if applicable
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

    // Restart progress timer
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

    // Debounce collapse if idle
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

    // Notify HA if collapsed state changes
    const collapsedNow = this._alwaysCollapsed
      ? true
      : (this._collapseOnIdle ? this._isActuallyCollapsed : false);

    if (this._prevCollapsed !== collapsedNow) {
      this._prevCollapsed = collapsedNow;
      // Trigger layout update
      this._notifyResize();
    }

    // Add grab scroll to chip rows after update/render
    this._addGrabScroll('.chip-row');
    this._addGrabScroll('.action-chip-row');
  }

  _toggleSourceMenu() {
    this._showSourceMenu = !this._showSourceMenu;
    if (this._showSourceMenu) {
      this._manualSelect = true;
      setTimeout(() => {
        this._shouldDropdownOpenUp = true;
        this.requestUpdate();
        // Setup outside click handler
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
      // If click/tap is not inside dropdown or button, close, evt.composedPath() includes shadow DOM path
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
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source: src
    });
    // Close the source list sheet after selection
    this._closeEntityOptions();
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

    // For script calls **and** `script_variable: true`, inject `yamp_entity` and omit `entity_id` to avoid invalid IDs.
    if (domain === "script" && action.script_variable === true) {
      const currentId = this.currentEntityId;

      // Remove any placeholder entity_id the user might have supplied
      if (
        data.entity_id === "current" ||
        data.entity_id === "$current" ||
        data.entity_id === "this"
      ) {
        delete data.entity_id;
      }

      data.yamp_entity = currentId;
    } else if (
      !(domain === "script" && action.script_variable === true) &&
      (
        data.entity_id === "current" ||
        data.entity_id === "$current" ||
        data.entity_id === "this" ||
        !data.entity_id // Optionally default if omitted
      )
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
      case "stop":
        this.hass.callService("media_player", "media_stop", { entity_id: entity });
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
      case "power": {
        // Toggle between turn_on and turn_off based on current state
        const svc = stateObj.state === "off" ? "turn_on" : "turn_off";
        this.hass.callService("media_player", svc, { entity_id: entity });

        // Also toggle volume_entity if sync_power is enabled for this entity
        const obj = this.entityObjs[this._selectedIndex];
        if (
          obj &&
          obj.sync_power &&
          obj.volume_entity &&
          obj.volume_entity !== obj.entity_id
        ) {
          this.hass.callService("media_player", svc, { entity_id: obj.volume_entity });
        }
        break;
      }
    }
  }

  _onVolumeChange(e) {
    const idx = this._selectedIndex;
    const mainEntity = this.entityObjs[idx].entity_id;
    const state = this.hass.states[mainEntity];
    const vol = Number(e.target.value);

    // Determine group members (including self) for group chips
    let targets;
    if (Array.isArray(state?.attributes?.group_members) && state.attributes.group_members.length) {
      // Group master: update all members AND self
      targets = [mainEntity, ...state.attributes.group_members];
    } else {
      // Not grouped: use volume_entity as before
      targets = [mainEntity];
    }

    // For each target, use its own volume_entity override if present
    for (const t of targets) {
      // Find the corresponding config object (if any)
      const obj = this.entityObjs.find(e => e.entity_id === t);
      const volTarget = (obj && obj.volume_entity) ? obj.volume_entity : t;
      this.hass.callService("media_player", "volume_set", { entity_id: volTarget, volume_level: vol });
    }
  }

  _onVolumeStep(direction) {
    const entity = this._getVolumeEntity(this._selectedIndex);
    if (!entity) return;
    const isRemoteVolumeEntity = entity.startsWith && entity.startsWith("remote.");
    const stateObj = this.currentVolumeStateObj;
    if (!stateObj) return;

    if (isRemoteVolumeEntity) {
      this.hass.callService("remote", "send_command", {
        entity_id: entity,
        command: direction > 0 ? "volume_up" : "volume_down"
      });
    } else {
      let current = Number(stateObj.attributes.volume_level || 0);
      current += direction * 0.05;
      current = Math.max(0, Math.min(1, current));
      this.hass.callService("media_player", "volume_set", { entity_id: entity, volume_level: current });
    }
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

  _openMediaBrowser() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: this.currentEntityId },
      bubbles: true,
      composed: true,
    }));
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
      
      if (this.shadowRoot && this.shadowRoot.host) {
        this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      }
      
      const showChipRow = this.config.show_chip_row || "auto";
      const stateObj = this.currentStateObj;
      if (!stateObj) return html`<div class="details">Entity not found.</div>`;

      // Idle image "picture frame" mode when idle
      let idleImageUrl = null;
      if (
        this.config.idle_image &&
        stateObj.state !== "playing" &&
        this.hass.states[this.config.idle_image]
      ) {
        const sensorState = this.hass.states[this.config.idle_image];
        idleImageUrl =
          sensorState.attributes.entity_picture ||
          (sensorState.state && sensorState.state.startsWith("http") ? sensorState.state : null);
      }
      const dimIdleFrame = !!idleImageUrl;

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

      // Volume entity determination
      const idx = this._selectedIndex;
      const entity = this._getVolumeEntity(idx);
      const isRemoteVolumeEntity = entity && entity.startsWith && entity.startsWith("remote.");

      // Volume
      const vol = Number(this.currentVolumeStateObj?.attributes.volume_level || 0);
      const showSlider = this.config.volume_mode !== "stepper";

      // Collapse artwork/details on idle if configured and/or always_collapsed
      const collapsed = this._alwaysCollapsed
        ? true
        : (this._collapseOnIdle ? this._isActuallyCollapsed : false);
      // Use null if not playing or no artwork available
      const artworkUrl = stateObj && stateObj.state === "playing" && (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        ? (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        : null;

      // Dominant color extraction for collapsed artwork
      if (collapsed && artworkUrl && artworkUrl !== this._lastArtworkUrl) {
        this._extractDominantColor(artworkUrl).then(color => {
          this._collapsedArtDominantColor = color;
          this.requestUpdate();
        });
        this._lastArtworkUrl = artworkUrl;
      }

      return html`
        <ha-card class="yamp-card" style="position:relative;">
          <div
            style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column;"
            data-match-theme="${String(this.config.match_theme === true)}"
            class="${dimIdleFrame ? 'dim-idle' : ''}"
          >
            ${(this.entityObjs.length > 1 || showChipRow === "always") ? html`
              <div class="chip-row">
                ${this.groupedSortedEntityIds.map(group =>
                  group.length > 1
                    ? html`${this._renderGroupChip(group)}`
                    : html`${this._renderChip(group[0])}`
                )}
              </div>
            ` : nothing}
            ${this.config.actions && this.config.actions.length
              ? html`
                  <div class="action-chip-row">
                    ${this.config.actions.map(
                      (a, idx) => html`
                        <button class="action-chip" @click=${() => this._onActionChipClick(idx)}>
                          ${a.icon
                            ? html`<ha-icon .icon=${a.icon} style="font-size: 22px; margin-right: ${a.name ? '8px' : '0'};"></ha-icon>`
                            : nothing}
                          ${a.name || ""}
                        </button>
`
                    )}
                  </div>
                `
              : nothing}
            <div class="card-lower-content-container">
              <div class="card-lower-content-bg"
                style="
                  background-image: ${
                    idleImageUrl
                      ? `url('${idleImageUrl}')`
                      : artworkUrl
                        ? `url('${artworkUrl}')`
                        : "none"
                  };
                  min-height: ${collapsed ? "0px" : "320px"};
                  background-size: cover;
                  background-position: top center;
                  background-repeat: no-repeat;
                  filter: ${collapsed && artworkUrl ? "blur(18px) brightness(0.7) saturate(1.15)" : "none"};
                  transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s;
                "
              ></div>
              <div class="card-lower-fade"></div>
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}">
                ${collapsed && artworkUrl ? html`
                  <div class="collapsed-artwork-container"
                       style="background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%);">
                    <img class="collapsed-artwork" src="${artworkUrl}" />
                  </div>
                ` : nothing}
                ${!collapsed
                  ? html`<div class="card-artwork-spacer"></div>`
                  : nothing
                }
                ${(!collapsed && !artworkUrl && !idleImageUrl) ? html`
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
                  <div class="artist">
                    ${isPlaying ? artist : ""}
                  </div>
                </div>
                ${(collapsed || this._alternateProgressBar)
                  ? nothing
                  : (isPlaying && duration
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
                    )
                }
                <div class="controls-row">
                  ${this._supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK) ? html`
                    <button class="button" @click=${() => this._onControlClick("prev")} title="Previous">
                      <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
                    </button>
                  ` : nothing}
                  <button class="button" @click=${() => this._onControlClick("play_pause")} title="Play/Pause">
                    <ha-icon .icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
                  </button>
                  <!-- Stop button, only if supported and horizontal space allows -->
                  ${this._shouldShowStopButton(stateObj)
                    ? html`
                      <button class="button" @click=${() => this._onControlClick("stop")} title="Stop">
                        <ha-icon .icon=${"mdi:stop"}></ha-icon>
                      </button>
                    `
                    : nothing}
                  ${this._supportsFeature(stateObj, SUPPORT_NEXT_TRACK) ? html`
                    <button class="button" @click=${() => this._onControlClick("next")} title="Next">
                      <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
                    </button>
                  ` : nothing}
                  ${this._supportsFeature(stateObj, SUPPORT_SHUFFLE) ? html`
                    <button class="button${shuffleActive ? ' active' : ''}" @click=${() => this._onControlClick("shuffle")} title="Shuffle">
                      <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
                    </button>
                  ` : nothing}
                  ${this._supportsFeature(stateObj, SUPPORT_REPEAT_SET) ? html`
                    <button class="button${repeatActive ? ' active' : ''}" @click=${() => this._onControlClick("repeat")} title="Repeat">
                      <ha-icon .icon=${
                        stateObj.attributes.repeat === "one"
                          ? "mdi:repeat-once"
                          : "mdi:repeat"
                      }></ha-icon>
                    </button>
                  ` : nothing}
                  ${
                    (
                      this._supportsFeature(stateObj, SUPPORT_TURN_OFF) ||
                      this._supportsFeature(stateObj, SUPPORT_TURN_ON)
                    ) ? html`
                    <button
                      class="button${stateObj.state !== "off" ? " active" : ""}"
                      @click=${() => this._onControlClick("power")}
                      title="Power"
                    >
                      <ha-icon .icon=${"mdi:power"}></ha-icon>
                    </button>
                  ` : nothing}
                </div>
                <div class="volume-row${Array.isArray(stateObj.attributes.source_list) && stateObj.attributes.source_list.length > 0 ? ' has-source' : ''}">
                  ${isRemoteVolumeEntity
                    ? html`
                        <div class="vol-stepper">
                          <button class="button" @click=${() => this._onVolumeStep(-1)} title="Vol Down">–</button>
                          <button class="button" @click=${() => this._onVolumeStep(1)} title="Vol Up">+</button>
                        </div>
                      `
                    : (
                        showSlider
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
                              ${!isRemoteVolumeEntity ? html`<span>${Math.round(vol * 100)}%</span>` : nothing}
                              <button class="button" @click=${() => this._onVolumeStep(1)} title="Vol Up">+</button>
                            </div>
                          `
                      )
                  }
                  <div class="media-browser-menu">
                    <button class="media-browser-btn" @click=${() => this._openEntityOptions()}>
                      <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                    </button>
                  </div>
                </div>
              </div>
              ${(this._alternateProgressBar || collapsed) && isPlaying && duration
                ? html`
                    <div class="collapsed-progress-bar"
                      style="width: ${progress * 100}%;"></div>
                  `
                : nothing}
            </div>
          </div>
          ${this._showEntityOptions ? html`
          <div class="entity-options-overlay" @click=${(e) => this._closeEntityOptions(e)}>
            <div class="entity-options-sheet" @click=${e => e.stopPropagation()}>
              ${(!this._showGrouping && !this._showSourceList) ? html`
                <button class="entity-options-item" @click=${() => this._triggerMoreInfo()}>More Info</button>
                ${Array.isArray(this.currentStateObj?.attributes?.source_list) && this.currentStateObj.attributes.source_list.length > 0 ? html`
                  <button class="entity-options-item" @click=${() => this._openSourceList()}>Source</button>
                ` : nothing}
                ${
                  (() => {
                    const totalEntities = this.entityIds.length;
                    const groupableCount = this.entityIds.reduce((acc, id) => {
                      const st = this.hass.states[id];
                      return acc + (this._supportsFeature(st, SUPPORT_GROUPING) ? 1 : 0);
                    }, 0);
                    if (
                      totalEntities > 1 &&
                      groupableCount > 1 &&
                      this._supportsFeature(this.currentStateObj, SUPPORT_GROUPING)
                    ) {
                      return html`
                        <button class="entity-options-item" @click=${() => this._openGrouping()}>Group Players</button>
                      `;
                    }
                    return nothing;
                  })()
                }
                <button class="entity-options-item" @click=${() => this._closeEntityOptions()}>Close</button>
              ` : this._showGrouping ? html`
                <button class="entity-options-item" @click=${() => this._closeGrouping()} style="margin-bottom:14px;">← Back</button>
                ${
                  (() => {
                    const masterState = this.hass.states[this.currentEntityId];
                    const groupedAny = Array.isArray(masterState?.attributes?.group_members) && masterState.attributes.group_members.length > 0;
                    return html`
                      <div style="display:flex;align-items:center;justify-content:flex-end;font-weight:600;margin-bottom:0;">
                        <button class="group-all-btn"
                          @click=${() => groupedAny ? this._ungroupAll() : this._groupAll()}
                          style="color:#d22; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 0 2px 8px;">
                          ${groupedAny ? "Ungroup All" : "Group All"}
                        </button>
                      </div>
                    `;
                  })()
                }
                <hr style="margin:8px 0 2px 0;opacity:0.19;border:0;border-top:1px solid #fff;" />
                ${this.entityIds
                  .filter(id => id !== this.currentEntityId)
                  .map(id => {
                    const st = this.hass.states[id];
                    if (!this._supportsFeature(st, SUPPORT_GROUPING)) return nothing;
                    const name = this.getChipName(id);
                    const masterState = this.hass.states[this.currentEntityId];
                    const grouped =
                      Array.isArray(masterState.attributes.group_members) &&
                      masterState.attributes.group_members.includes(id);
                    return html`
                      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 4px;">
                        <span>${name}</span>
                        <button class="group-toggle-btn"
                                @click=${() => this._toggleGroup(id)}
                                title=${grouped ? "Unjoin" : "Join"}>
                          <span class="group-toggle-fix">${grouped ? "–" : "+"}</span>
                        </button>
                      </div>
                    `;
                  })}
              ` : html`
                <button class="entity-options-item" @click=${() => this._closeSourceList()} style="margin-bottom:14px;">← Back</button>
                ${this.currentStateObj?.attributes?.source_list?.map(src => html`
                  <div class="entity-options-item" @click=${() => this._selectSource(src)}>${src}</div>
                `)}
              `}
            </div>
          </div>
        ` : nothing}
        </ha-card>
      `;
    }


    // Home assistant layout options
    getGridOptions() {
      // Use the same logic as in render() to know if the card is collapsed.
      const collapsed = this._alwaysCollapsed
        ? true
        : (this._collapseOnIdle ? this._isActuallyCollapsed : false);

 
      const minRows = collapsed ? 2 : 4;

      return {
        min_rows: minRows,
        // Keep the default full‑width behaviour explicit.
        columns: 12,
      };
    }

  firstUpdated() {
    super.firstUpdated?.();
    
  }

  _addGrabScroll(selector) {
    const row = this.renderRoot.querySelector(selector);
    if (!row || row._grabScrollAttached) return;
    let isDown = false;
    let startX, scrollLeft;
    // Track drag state to suppress clicks

    row.addEventListener('mousedown', (e) => {
      isDown = true;
      row._dragged = false;
      row.classList.add('grab-scroll-active');
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
      e.preventDefault();
    });
    row.addEventListener('mouseleave', () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    });
    row.addEventListener('mouseup', () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    });
    row.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startX);
      // Mark as dragged if moved > 5px
      if (Math.abs(walk) > 5) {
        row._dragged = true;
      }
      e.preventDefault();
      row.scrollLeft = scrollLeft - walk;
    });
    // Suppress click after drag
    row.addEventListener('click', (e) => {
      if (row._dragged) {
        e.stopPropagation();
        e.preventDefault();
        row._dragged = false;
      }
    }, true);
    row._grabScrollAttached = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    // Clear collapse debounce
    if (this._collapseTimeout) {
      clearTimeout(this._collapseTimeout);
      this._collapseTimeout = null;
    }
    if (this._debouncedVolumeTimer) {
      clearTimeout(this._debouncedVolumeTimer);
      this._debouncedVolumeTimer = null;
    }
    this._removeSourceDropdownOutsideHandler();
  }
  // Entity options overlay handlers
  _closeEntityOptions() {
    if (this._showGrouping) {
      // Close the grouping sheet and the overlay
      this._showGrouping = false;
      this._showEntityOptions = false;
      // Auto-select the chip for the group just created (same as _closeGrouping logic)
      const groups = this.groupedSortedEntityIds;
      const curId = this.currentEntityId;
      const group = groups.find(g => g.includes(curId));
      if (group && group.length > 1) {
        const master = this._getActualGroupMaster(group);
        const idx = this.entityIds.indexOf(master);
        if (idx >= 0) this._selectedIndex = idx;
      }
      this.requestUpdate();
    } else {
      this._showEntityOptions = false;
      this._showGrouping = false;
      this._showSourceList = false;
      this.requestUpdate();
    }
  }

  _openEntityOptions() {
    this._showEntityOptions = true;
    this.requestUpdate();
  }

  _triggerMoreInfo() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: this.currentEntityId },
      bubbles: true,
      composed: true,
    }));
    this._closeEntityOptions();
  }

  // Grouping Helper Methods 
  _openGrouping() {
    this._showEntityOptions = true;  // ensure the overlay is visible
    this._showGrouping = true;       // show grouping sheet immediately
    this.requestUpdate();
  }

  // Source List Helper Methods
  _openSourceList() {
    this._showEntityOptions = true;
    this._showSourceList = true;
    this._showGrouping = false;
    this.requestUpdate();
  }

  _closeSourceList() {
    this._showSourceList = false;
    this.requestUpdate();
  }
  _closeGrouping() {
    this._showGrouping = false;
    // Auto-select the chip for the group just created
    const groups = this.groupedSortedEntityIds;
    const curId = this.currentEntityId;
    const group = groups.find(g => g.includes(curId));
    if (group && group.length > 1) {
      const master = this._getActualGroupMaster(group);
      const idx = this.entityIds.indexOf(master);
      if (idx >= 0) this._selectedIndex = idx;
    }
    // No requestUpdate here; overlay close will handle it.
  }
  async _toggleGroup(targetId) {
    const masterId = this.currentEntityId;
    if (!masterId || !targetId) return;

    const masterState = this.hass.states[masterId];
    const grouped =
      Array.isArray(masterState?.attributes.group_members) &&
      masterState.attributes.group_members.includes(targetId);

    if (grouped) {
      // Unjoin the target from the group
      await this.hass.callService("media_player", "unjoin", {
        entity_id: targetId,
      });
    } else {
      // Join the target player to the master's group
      await this.hass.callService("media_player", "join", {
        entity_id: masterId,          // call on the master
        group_members: [targetId],    // player(s) to add
      });
    }
    // Keep sheet open for more grouping actions
  }


  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor");
  }
  static getStubConfig(hass, entities) {
    return { entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2) };
  }

  // Group all supported entities to current master
  async _groupAll() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;

    // Get all other entities that support grouping and are not already grouped with master
    const alreadyGrouped = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];
    const toJoin = this.entityIds
      .filter(id => id !== masterId)
      .filter(id => {
        const st = this.hass.states[id];
        return this._supportsFeature(st, SUPPORT_GROUPING) && !alreadyGrouped.includes(id);
      });
    if (toJoin.length > 0) {
      await this.hass.callService("media_player", "join", {
        entity_id: masterId,
        group_members: toJoin,
      });
    }
    // Remain in grouping sheet
  }

  // Ungroup all members from current master
  async _ungroupAll() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;

    const members = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];
    // Only unjoin those that support grouping
    const toUnjoin = members.filter(id => {
      const st = this.hass.states[id];
      return this._supportsFeature(st, SUPPORT_GROUPING);
    });
    // Unjoin each member individually
    for (const id of toUnjoin) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: id,
      });
    }
    // Remain in grouping sheet
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
        name: "alternate_progress_bar",
        selector: { boolean: {} },
        required: false
      },
      {
        name: "show_chip_row",
        selector: {
          select: {
            options: [
              { value: "auto", label: "Auto (hide with one entity)" },
              { value: "always", label: "Always show" }
            ]
          }
        },
        required: false
      },
      // Add idle_image entity picker after progress bar options
      {
        name: "idle_image",
        selector: {
          entity: { domain: "sensor" },
        },
        required: false,
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
    // Display friendly names or entity_ids for all entities/objects
    const entitiesForEditor = (this.config.entities || []).map(e => {
      if (typeof e === "string") {
        const state = this.hass?.states?.[e];
        return state?.attributes?.friendly_name || e;
      }
      if (e && typeof e === "object" && e.entity_id) {
        const state = this.hass?.states?.[e.entity_id];
        return state?.attributes?.friendly_name || e.entity_id;
      }
      return "(invalid entity)";
    });
    // Show list above the form
    const configForEditor = {
      ...this.config,
      entities: this.config.entities
      
    };
    return html`
      <div>
        <ul style="list-style:none; padding:0; margin-bottom:16px;">
          ${entitiesForEditor.map(name => html`<li style="padding:2px 0;">${name}</li>`)}
        </ul>
        <ha-form
          .hass=${this.hass}
          .data=${configForEditor}
          .schema=${this._schema}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
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