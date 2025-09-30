// import { css } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { css } from "lit";

export const yampCardStyles = css`
  /* CSS Custom Properties for consistency */
  :host {
    --custom-accent: #ff9800;
    --card-bg: var(--card-background-color, #222);
    --primary-text: var(--primary-text-color, #fff);
    --secondary-text: var(--secondary-text-color, #aaa);
    --chip-bg: var(--chip-background, #333);
    --transition-fast: 0.13s;
    --transition-normal: 0.2s;
    --transition-slow: 0.4s;
    --border-radius: 16px;
    --chip-border-radius: 24px;
    --button-border-radius: 8px;
    --shadow-light: 0 2px 8px rgba(0,0,0,0.13);
    --shadow-medium: 0 2px 8px rgba(0,0,0,0.25);
    --shadow-heavy: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
  }

  :host([data-match-theme="false"]) {
    --custom-accent: #ff9800 !important;
    
    /* Search sheet default theme variables when match_theme is false */
    --search-overlay-bg: rgba(0, 0, 0, 0.8);
    --search-input-bg: #333;
    --search-input-text: #fff;
    --search-text: #fff;
    --search-error: #ff6b6b;
    --search-success: #4caf50;
    --search-success-bg: rgba(76, 175, 80, 0.95);
    --search-border: rgba(255, 255, 255, 0.1);
    --search-hover-bg: rgba(255, 255, 255, 0.1);
    --search-play-hover: #e68900;
    --search-queue-bg: #4a4a4a;
    --search-queue-border: #666;
    --search-queue-hover: #5a5a5a;
    --search-queue-hover-border: #777;
  }
  
  :host([data-match-theme="true"]) {
    /* Override custom-accent to use theme accent when match_theme is true */
    --custom-accent: var(--accent-color, #ff9800);
    
    /* Search sheet theme-aware variables */
    --search-overlay-bg: var(--ha-card-background, rgba(0, 0, 0, 0.8));
    --search-input-bg: var(--ha-card-background, #333);
    --search-input-text: var(--primary-text-color, #fff);
    --search-text: var(--primary-text-color, #fff);
    --search-error: var(--error-color, #ff6b6b);
    --search-success: var(--success-color, #4caf50);
    --search-success-bg: var(--success-color, rgba(76, 175, 80, 0.95));
    --search-border: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-hover-bg: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-play-hover: var(--accent-color, #e68900);
    --search-queue-bg: var(--ha-card-background, #4a4a4a);
    --search-queue-border: var(--divider-color, #666);
    --search-queue-hover: var(--secondary-background-color, #5a5a5a);
    --search-queue-hover-border: var(--divider-color, #777);
  }

  /* Base card styles - set once, inherit everywhere */
  :host {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
    background: var(--card-bg);
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
  }

  ha-card.yamp-card {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
    background: var(--card-bg);
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
  }

  /* Idle state dimming */
  .dim-idle .details,
  .dim-idle .controls-row,
  .dim-idle .volume-row,
  .dim-idle .chip-row,
  .dim-idle .action-chip-row {
    opacity: 0.28;
    transition: opacity 0.5s;
  }

  /* More info menu */
  .more-info-menu {
    display: flex;
    align-items: center;
    margin-right: 0;
  }

  .more-info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    padding: 0;
    margin: 0 4px;
    background: none;
    border: none;
    color: var(--primary-text);
    font: inherit;
    cursor: pointer;
    outline: none;
  }

  .more-info-btn ha-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    width: 28px;
    height: 28px;
    line-height: 1;
    vertical-align: middle;
    position: relative;
    margin: 0 0 2px 0;
    color: #fff;
  }

  /* Card artwork spacer */
  .card-artwork-spacer {
    width: 100%;
    flex: 1 1 0;
    height: auto;
    min-height: 180px;
    pointer-events: none;
  }

  /* Media background */
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

  /* Source menu */
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
    color: var(--primary-text);
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
    background: var(--card-bg);
    color: var(--primary-text);
    border-radius: var(--button-border-radius);
    box-shadow: var(--shadow-light);
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
    border-radius: var(--button-border-radius);
  }

  .source-option {
    padding: 8px 16px;
    cursor: pointer;
    transition: background var(--transition-fast);
    white-space: nowrap;
  }

  .source-option:hover,
  .source-option:focus {
    background: var(--accent-color, #1976d2);
    color: #fff;
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
    border-radius: var(--button-border-radius);
    border: 1px solid #ccc;
    background: var(--card-bg);
    color: var(--primary-text);
    outline: none;
    margin-top: 2px;
  }

  /* Chip styles */
  .chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 8px;
    background: transparent;
    border-radius: 50%;
    overflow: hidden;
    padding: 0;
  }

  .chip[playing] .chip-icon {
    background: #fff;
  }

  .chip-icon ha-icon {
    width: 100%;
    height: 100%;
    font-size: 28px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    color: var(--custom-accent);
  }

  .chip[selected] .chip-icon ha-icon {
    color: #fff;
  }

  .chip:hover .chip-icon ha-icon {
    color: #fff;
  }

  .chip-mini-art {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    display: block;
  }

  /* Chip rows */
  .chip-row.grab-scroll-active,
  .action-chip-row.grab-scroll-active {
    cursor: grabbing;
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
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
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

  /* Action chips */
  .action-chip {
    background: var(--card-bg);
    opacity: 1;
    border-radius: var(--button-border-radius);
    color: var(--primary-text);
    box-shadow: none;
    text-shadow: none;
    border: none;
    outline: none;
    padding: 4px 12px;
    font-weight: 500;
    font-size: 0.95em;
    cursor: pointer;
    margin: 4px 0;
    transition: background var(--transition-normal) ease, transform 0.1s ease;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: none;
    text-shadow: none;
  }

  .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: none;
    text-shadow: none;
  }

  /* Override action chip colors when match_theme is false */
  :host([data-match-theme="false"]) .action-chip:hover,
  :host([data-match-theme="false"]) .action-chip:active {
    background: #ff9800 !important;
  }

  /* Main chips */
  .chip {
    display: flex;
    align-items: center;
    border-radius: var(--chip-border-radius);
    padding: 6px 6px 6px 8px;
    background: var(--chip-bg);
    color: var(--primary-text);
    cursor: pointer;
    font-weight: 500;
    opacity: 0.85;
    border: none;
    outline: none;
    transition: background var(--transition-normal), opacity var(--transition-normal);
    flex: 0 0 auto;
    white-space: nowrap;
    position: relative;
  }

  .chip:hover {
    background: var(--custom-accent);
    color: #fff;
  }

  .chip[selected] {
    background: var(--custom-accent);
    color: #fff;
    opacity: 1;
  }

  .chip[playing] {
    padding-right: 6px;
  }

  /* Music Assistant active outline */
  .chip[ma-active] {
    border: 1px solid rgba(255, 152, 0, 0.6);
  }

  .chip[ma-active]:hover {
    border: 1px solid rgba(255, 152, 0, 0.8);
  }

  .chip[selected][ma-active] {
    border: 1px solid rgba(255, 152, 0, 0.8);
  }

  .chip[selected][ma-active]:hover {
    border: 1px solid rgba(255, 152, 0, 1);
  }

  /* Chip pin */
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
    color: var(--custom-accent);
    font-size: 17px;
    margin: 0;
  }

  .chip[selected] .chip-pin-inside ha-icon {
    color: #fff;
  }

  .chip-pin:hover ha-icon,
  .chip-pin-inside:hover ha-icon {
    color: #fff;
  }

  .chip:hover .chip-pin ha-icon,
  .chip:hover .chip-pin-inside ha-icon {
    color: #fff;
  }

  .chip-pin-spacer {
    display: flex;
    width: 24px;
    min-width: 24px;
    height: 1px;
  }

  /* Group icon */
  .chip-icon.group-icon {
    background: var(--custom-accent);
    color: #fff;
    position: relative;
  }

  .group-count {
    font-weight: 700;
    font-size: 0.9em;
    line-height: 28px;
    text-align: center;
    width: 100%;
    color: inherit;
  }

  /* Media artwork */
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
    box-shadow: var(--shadow-medium);
    background: #222;
  }

  /* Details section */
  .details {
    padding: 0 16px 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    min-height: 48px;
  }

  .details .title,
  .title {
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.2;
    white-space: normal;
    word-break: break-word;
    overflow: visible;
    text-overflow: unset;
    display: block;
    padding-top: 8px;
  }

  .artist {
    font-size: 1em;
    font-weight: 400;
    color: var(--secondary-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }

  /* Controls */
  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 4px 16px;
  }

  /* Tighter spacing for collapsed mode with artwork */
  .card-lower-content.collapsed.has-artwork .controls-row {
    gap: 8px;
    padding: 4px 12px 4px 16px;
  }

  .button {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.5em;
    cursor: pointer;
    padding: 6px;
    border-radius: var(--button-border-radius);
    transition: background var(--transition-normal);
  }

  .button:active {
    background: rgba(0,0,0,0.10);
  }

  .button.active ha-icon,
  .button.active {
    color: var(--custom-accent);
  }

  /* Progress bar */
  .progress-bar-container {
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.22);
    border-radius: 3px;
    margin: 8px 0;
    cursor: pointer;
    position: relative;
    box-shadow: var(--shadow-heavy);
  }

  .progress-inner {
    height: 100%;
    background: var(--custom-accent);
    border-radius: 3px 0 0 3px;
    box-shadow: 0 0 8px 2px rgba(0,0,0,0.24);
  }

  /* Volume controls */
  .volume-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px 12px 25px;
    justify-content: space-between;
  }

  .volume-controls {
    display: flex;
    align-items: center;
    gap: 25px;
    flex: 1;
  }

  .volume-icon-btn {
    background: none;
    border: none;
    color: var(--primary-text);
    cursor: pointer;
    padding: 0px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-normal);
    min-width: 36px;
    min-height: 36px;
    margin-right: 0px;
    margin-left: -7px;
  }

  .volume-icon-btn:hover {
    color: var(--custom-accent);
  }

  .volume-icon-btn ha-icon {
    font-size: 1.2em;
    color: #fff;
  }

  .volume-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    position: relative;
  }

  .volume-slider-icon {
    font-size: 1em;
    color: var(--primary-text);
    opacity: 0.7;
    min-width: 20px;
  }

  .vol-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: hsla(0, 0.00%, 100.00%, 0.22);
    border-radius: 3px;
    outline: none;
    box-shadow: var(--shadow-heavy);
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

  /* Volume slider thumbs */
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

  /* Touch device improvements */
  @media (pointer: coarse) {
    .vol-slider::-webkit-slider-thumb {
      box-shadow: 0 0 0 18px rgba(0,0,0,0);
    }
    .vol-slider::-moz-range-thumb {
      box-shadow: 0 0 0 18px rgba(0,0,0,0);
    }
    .vol-slider::-ms-thumb {
      box-shadow: 0 0 0 18px rgba(0,0,0,0);
    }
  }

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

  /* Light mode styles */
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
      color: #222;
      background: #fff;
      transition: background var(--transition-fast), color var(--transition-fast);
    }

    .source-option:hover,
    .source-option:focus {
      background: var(--custom-accent);
      color: #222;
    }

    .source-select {
      background: #fff;
      color: #222;
      border: 1px solid #aaa;
    }

    .action-chip {
      background: var(--card-background-color, #fff);
      opacity: 1;
      border-radius: var(--button-border-radius);
      color: var(--primary-text-color, #222);
      box-shadow: none;
      text-shadow: none;
      border: none;
      outline: none;
    }

    .action-chip:active {
      background: var(--accent-color, #1976d2);
      color: #fff;
      opacity: 1;
      transform: scale(0.98);
      box-shadow: none;
      text-shadow: none;
    }

    .card-lower-content:not(.collapsed) .source-menu-btn,
    .card-lower-content:not(.collapsed) .source-selected {
      color: #fff;
    }
  }

  /* Artwork overlay */
  .artwork-dim-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, 
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.70) 100%);
    z-index: 2;
  }

  /* Card lower content */
  .card-lower-content-container {
    position: relative;
    width: 100%;
    min-height: auto;
    height: 100%;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
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
    height: 100%;
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
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-lower-content.transitioning .details,
  .card-lower-content.transitioning .card-artwork-spacer {
    transition: opacity 0.3s;
  }

  .card-lower-content.collapsed .details {
    opacity: 1;
    pointer-events: auto;
    margin-right: 120px;
    transition: margin var(--transition-normal);
  }

  @media (max-width: 420px) {
    .card-lower-content.collapsed .details {
      margin-right: 74px;
    }
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
    color: #fff;
  }
  


  /* Media artwork placeholder */
  .media-artwork-placeholder ha-icon {
    width: 104px;
    height: 104px;
    min-width: 104px;
    min-height: 104px;
    max-width: 104px;
    max-height: 104px;
    display: block;
  }

  .media-artwork-placeholder ha-icon svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Collapsed artwork */
  .card-lower-content.collapsed .collapsed-artwork-container {
    position: absolute;
    top: 16px;
    right: 6px;
    width: 110px;
    height: calc(100% - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 2;
    background: transparent;
    pointer-events: none;
    box-shadow: none;
    padding: 0;
    transition: background var(--transition-slow);
  }

  .card-lower-content.collapsed .collapsed-artwork {
    width: 102px;
    height: 102px;
    border-radius: 16px;
    object-fit: cover;
    background: transparent;
    box-shadow: 0 1px 6px rgba(0,0,0,0.22);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 2px;
  }

  .card-lower-content.collapsed.has-artwork .controls-row {
    max-width: calc(100% - 120px) !important;
    margin-right: 115px !important;
    width: auto !important;
  }

  /* Medium screens */
  @media (max-width: 600px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - 115px) !important;
      margin-right: 110px !important;
      width: auto !important;
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 105px;
      right: 4px;
      top: 14px;
    }

    .card-lower-content.collapsed .collapsed-artwork {
      width: 98px;
      height: 98px;
    }
  }

  /* Small screens */
  @media (max-width: 420px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - 90px) !important;
      margin-right: 85px !important;
      width: auto !important;
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 90px;
      right: 3px;
      top: 12px;
    }

    .card-lower-content.collapsed .collapsed-artwork {
      width: 84px;
      height: 84px;
    }
  }

  /* Very small screens */
  @media (max-width: 320px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - 80px) !important;
      margin-right: 75px !important;
      width: auto !important;
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 80px;
      right: 2px;
      top: 10px;
    }

    .card-lower-content.collapsed .collapsed-artwork {
      width: 74px;
      height: 74px;
    }
  }

  /* Collapsed progress bar */
  .collapsed-progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background: var(--custom-accent);
    border-radius: 0 0 12px 12px;
    z-index: 99;
    transition: width var(--transition-normal) linear;
    pointer-events: none;
  }

  /* Entity options overlay */
  .entity-options-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 30;
    background: rgba(15,18,30,0.70);
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .entity-options-container {
    width: 98%;
    max-width: 430px;
    margin: 2% auto;
    display: flex;
    flex-direction: column;
    max-height: calc(96% - 70px);
    min-height: 90px;
    position: relative;
  }

  /* Expand container height when always collapsed (no persistent controls) */
  :host([data-always-collapsed="true"]) .entity-options-container {
    max-height: 96%;
  }

  /* Expand container height when hide_menu_player is enabled (no persistent controls) */
  :host([data-hide-menu-player="true"]) .entity-options-container {
    max-height: 96%;
  }

  /* Persistent Media Controls */
  .persistent-media-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    margin: 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-top: none;
    flex-shrink: 0;
    position: absolute;
    bottom: 1%;
    left: 50%;
    transform: translateX(-50%);
    width: calc(98% - 24px);
    max-width: calc(430px - 24px);
    z-index: 1001;
  }

  /* Hide persistent controls when always collapsed is enabled */
  :host([data-always-collapsed="true"]) .persistent-media-controls {
    display: none;
  }

  /* Hide persistent controls when hide_menu_player is enabled */
  :host([data-hide-menu-player="true"]) .persistent-media-controls {
    display: none;
  }

  .persistent-controls-artwork {
    flex-shrink: 0;
  }

  .persistent-artwork {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .persistent-artwork-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .persistent-artwork-placeholder ha-icon {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
  }

  .persistent-controls-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
    position: relative;
    margin-left: -9%; /* Percentage-based offset to align with menu text */
  }

  .persistent-control-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #fff;
  }

  .persistent-control-btn:hover {
    background: var(--custom-accent);
    border-color: var(--custom-accent);
    transform: scale(1.05);
  }

  .persistent-control-btn:active {
    transform: scale(0.95);
  }

  .persistent-control-btn ha-icon {
    font-size: 16px;
    color: inherit;
  }

  .entity-options-sheet {
    --custom-accent: var(--accent-color, #ff9800);
    background: none;
    border-radius: var(--border-radius);
    box-shadow: none;
    width: 100%;
    padding: 18px 8px 70px 8px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  /* Main menu specific styling - move options down toward center */
  .entity-options-sheet .entity-options-menu {
    margin-top: 150px;
    margin-bottom: 20px;
  }

  /* When always collapsed is enabled, keep menu at top */
  :host([data-always-collapsed="true"]) .entity-options-sheet .entity-options-menu {
    margin-top: 0px;
  }

  /* Remove spacing between menu items */
  .entity-options-sheet .entity-options-menu .entity-options-item {
    margin-top: 0px;
    margin-bottom: 0px;
  }


  /* Ensure entity-options-sheet honors match_theme for accent color */
  :host([data-match-theme="false"]) .entity-options-sheet {
    --custom-accent: #ff9800 !important;
  }
  :host([data-match-theme="true"]) .entity-options-sheet {
    --custom-accent: var(--accent-color, #ff9800) !important;
  }

  .entity-options-sheet::-webkit-scrollbar {
    display: none;
  }

  .entity-options-sheet {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  /* Hide scrollbar for group list scroll container */
  .group-list-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .group-list-scroll::-webkit-scrollbar {
    display: none;
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
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast), text-shadow var(--transition-fast);
    text-align: center;
    text-shadow: 0 2px 8px #0009;
  }

  .entity-options-item:hover {
    color: var(--custom-accent, #ff9800);
    text-shadow: none;
    background: none;
  }

  /* Source index */
  .source-index-letter:focus {
    background: rgba(255,255,255,0.11);
    outline: 1px solid #ff9800;
  }

  .entity-options-sheet.source-list-sheet {
    position: relative;
    overflow: visible;
  }

  .source-list-scroll {
    overflow-y: auto;
    max-height: 340px;
    scrollbar-width: none;
  }

  .source-list-scroll::-webkit-scrollbar {
    display: none;
  }

  .floating-source-index.grab-scroll-active,
  .floating-source-index.grab-scroll-active * {
    cursor: grabbing;
  }

  .floating-source-index {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    pointer-events: auto;
    overscroll-behavior: contain;
    z-index: 10;
    padding: 12px 8px 8px 0;
    overflow-y: auto;
    max-height: 100%;
    min-width: 32px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    cursor: grab;
  }

  .floating-source-index::-webkit-scrollbar {
    display: none;
  }

  .floating-source-index .source-index-letter {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.08em;
    cursor: pointer;
    margin: 2px 0;
    padding: 2px 2px;
    pointer-events: auto;
    outline: none;
    transition: color var(--transition-fast), background var(--transition-fast), transform 0.16s cubic-bezier(.35,1.8,.4,1.04);
    transform: scale(1);
    z-index: 1;
    min-height: 32px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: 3;
  }

  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: 2;
  }

  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.10);
    z-index: 1;
  }

  .floating-source-index .source-index-letter::after {
    display: none;
  }

  .floating-source-index .source-index-letter:hover,
  .floating-source-index .source-index-letter:focus {
    color: #fff;
  }

  /* Group toggle buttons */
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
    color: #fff;
    border-color: #fff;
  }

  .group-toggle-btn span,
  .group-toggle-btn .group-toggle-fix {
    position: relative;
    left: 0.5px;
  }

  .group-toggle-btn:hover {
    background: rgba(255,255,255,0.15);
  }

  .group-toggle-transparent {
    background: none;
    border: none;
    box-shadow: none;
    color: transparent;
    pointer-events: none;
  }

  .group-toggle-transparent:hover {
    background: none;
  }

  /* Force white text in grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: #fff;
  }

  /* Search functionality */
  .entity-options-search {
    padding: 2px 0 80px 0;
  }

  .entity-options-search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
    margin-top: 2px;
  }

  .entity-options-search-result {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid #2227;
    font-size: 1.10em;
    color: var(--primary-text);
    background: none;
  }

  .entity-options-search-result:last-child {
    border-bottom: none;
  }

  .entity-options-search-result.placeholder {
    visibility: hidden;
    border-bottom: 1px solid transparent;
    min-height: 46px;
    box-sizing: border-box;
  }

  .entity-options-search-thumb {
    height: 38px;
    width: 38px;
    border-radius: var(--button-border-radius);
    object-fit: cover;
    box-shadow: 0 1px 5px rgba(0,0,0,0.16);
    margin-right: 12px;
  }

  .entity-options-search-buttons {
    display: flex;
    gap: 6px;
    margin-left: 7px;
  }

  .entity-options-search-play,
  .entity-options-search-queue {
    min-width: 34px;
    font-size: 1.13em;
    border: none;
    background: transparent;
    color: var(--custom-accent);
    border-radius: 10px;
    padding: 6px 10px;
    cursor: pointer;
    box-shadow: none;
    transition: background var(--transition-normal), color var(--transition-normal);
    text-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .entity-options-search-play ha-icon,
  .entity-options-search-queue ha-icon {
    width: 16px;
    height: 16px;
  }

  .entity-options-search-play:hover,
  .entity-options-search-play:focus {
    background: transparent;
    color: var(--custom-accent);
    opacity: 0.8;
  }

  .entity-options-search-queue {
    background: transparent;
    border: none;
    color: #666;
  }

  .entity-options-search-queue:hover,
  .entity-options-search-queue:focus {
    background: transparent;
    border: none;
    color: var(--custom-accent);
    opacity: 0.8;
  }

  /* Queue control buttons */
  .queue-controls {
    display: flex;
    gap: 4px;
  }

  .queue-btn {
    min-width: 28px;
    height: 28px;
    font-size: 0.9em;
    border: none;
    background: transparent;
    color: #fff;
    border-radius: 6px;
    padding: 4px;
    cursor: pointer;
    box-shadow: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .queue-btn ha-icon {
    width: 14px;
    height: 14px;
  }

  .queue-btn-up:hover,
  .queue-btn-up:focus {
    background: transparent;
    color: #4caf50;
  }

  .queue-btn-down:hover,
  .queue-btn-down:focus {
    background: transparent;
    color: #4caf50;
  }

  .queue-btn-next:hover,
  .queue-btn-next:focus {
    background: transparent;
    color: var(--custom-accent);
  }

  .queue-btn-remove:hover,
  .queue-btn-remove:focus {
    background: transparent;
    color: #f44336;
  }

  /* Visual feedback for moved queue items */
  .entity-options-search-result.just-moved {
    background: rgba(76, 175, 80, 0.2) !important;
    border-left: 3px solid #4caf50 !important;
    animation: queueMoveHighlight 1s ease-out;
  }

  @keyframes queueMoveHighlight {
    0% { background: rgba(76, 175, 80, 0.4); transform: scale(1.02); }
    100% { background: rgba(76, 175, 80, 0.2); transform: scale(1); }
  }

  .entity-options-search-input {
    border: 1px solid #333;
    border-radius: var(--button-border-radius);
    background: var(--card-bg);
    color: var(--primary-text);
    font-size: 1.12em;
    outline: none;
    transition: border var(--transition-fast);
    margin-right: 7px;
    box-sizing: border-box;
  }

  .entity-options-search-row .entity-options-search-input {
    padding: 4px 10px;
    height: 32px;
    min-height: 32px;
    line-height: 1.18;
    box-sizing: border-box;
    border: 1.5px solid var(--custom-accent);
    background: #232323;
    color: #fff;
    transition: border var(--transition-fast), background var(--transition-fast);
    outline: none;
  }

  .entity-options-search-input:focus {
    border: 1.5px solid var(--custom-accent);
    background: #232323;
    color: #fff;
    outline: none;
  }

  .entity-options-search-loading,
  .entity-options-search-error,
  .entity-options-search-empty {
    padding: 8px 6px;
    font-size: 1.09em;
    opacity: 0.90;
    color: var(--primary-text);
    background: none;
    text-align: left;
  }

  .entity-options-search-loading {
    color: #fff;
  }

  .entity-options-search-error {
    color: #e44747;
    font-weight: 500;
  }

  .entity-options-search-empty {
    color: #999;
    font-style: italic;
  }

  .entity-options-search-row .entity-options-item {
    height: 32px;
    min-height: 32px;
    box-sizing: border-box;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.12em;
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Search filter chips */
  .search-filter-chips .chip {
    color: #fff;
  }

  .search-filter-chips .chip[selected],
  .search-filter-chips .chip[style*="background: var(--customAccent"],
  .search-filter-chips .chip[style*="background: var(--custom-accent"] {
    color: #111;
  }

  .entity-options-sheet .search-filter-chips .chip:not([selected]) {
    color: #fff;
  }

  .entity-options-sheet .search-filter-chips .chip[selected] {
    color: #111;
  }

  .entity-options-sheet .search-filter-chips .chip {
    text-align: center;
    justify-content: center;
  }

  .entity-options-sheet .search-filter-chips .chip:hover {
    background: var(--custom-accent);
    color: #111;
    opacity: 1;
  }

  /* Override filter chip hover text color when match_theme is false */
  :host([data-match-theme="false"]) .entity-options-sheet .search-filter-chips .chip:hover {
    color: #fff !important;
  }

  /* Add hover effect for inactive filter chips when match_theme is false */
  :host([data-match-theme="false"]) .entity-options-sheet .search-filter-chips .chip:not([selected]):hover {
    background: var(--custom-accent) !important;
    color: #fff !important;
    opacity: 1;
  }

  /* Add hover effect for inactive filter chips when match_theme is true */
  :host([data-match-theme="true"]) .entity-options-sheet .search-filter-chips .chip:not([selected]):hover {
    background: var(--custom-accent) !important;
    color: #111 !important;
    opacity: 1;
  }

  .entity-options-sheet .entity-options-search-results {
    min-height: 210px;
  }

  /* Search layout */
  .entity-options-sheet .entity-options-search {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-sheet .entity-options-search-row,
  .entity-options-sheet .search-filter-chips {
    flex: 0 0 auto;
  }

  .entity-options-sheet .entity-options-search-results {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
    padding-bottom: 80px;
  }

  .entity-options-resolved-entities {
    --custom-accent: var(--accent-color, #ff9800);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-resolved-entities-list {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
  }

  .entity-options-resolved-entities .entity-options-item {
    background: none;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 500;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast), text-shadow var(--transition-fast);
    text-align: left;
    text-shadow: 0 2px 8px #0009;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .entity-options-resolved-entities .entity-options-item:hover,
  .entity-options-resolved-entities .entity-options-item:focus {
    color: var(--custom-accent) !important;
    text-shadow: none !important;
    background: none !important;
  }

  .entity-options-resolved-entities .entity-options-item:last-child {
    border-bottom: none;
  }

  /* Clickable artist */
  .clickable-artist {
    cursor: pointer;
  }

  .clickable-artist:hover {
    text-decoration: underline;
  }

  /* Clickable search results */
  .clickable-search-result {
    cursor: pointer;
    color: var(--custom-accent);
    transition: color var(--transition-fast);
  }

  .clickable-search-result:hover {
    text-decoration: underline;
    color: #fff;
  }

  /* Search breadcrumb */
  .entity-options-search-breadcrumb {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .entity-options-search-breadcrumb-text {
    font-size: 0.9em;
    color: #fff;
    font-style: italic;
  }

  /* Search sheet styles */
  .search-sheet {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .search-sheet-header {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .search-sheet-header input {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #333;
    color: #fff;
    font-size: 16px;
  }

  .search-sheet-header button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: var(--custom-accent);
    color: #fff;
    cursor: pointer;
    font-size: 16px;
  }

  .search-sheet-header button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .search-sheet-loading,
  .search-sheet-error,
  .search-sheet-success,
  .search-sheet-empty {
    text-align: center;
    padding: 40px;
    color: #fff;
    font-size: 18px;
  }

  .search-sheet-error {
    color: #ff6b6b;
  }

  .search-sheet-success {
    color: #4caf50;
    font-weight: 600;
    background: rgba(76, 175, 80, 0.95);
    border: 2px solid #4caf50;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    font-size: 20px;
    animation: fadeInOut 3s ease-in-out;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    min-width: 200px;
    text-align: center;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -60%); }
    10% { opacity: 1; transform: translate(-50%, -50%); }
    90% { opacity: 1; transform: translate(-50%, -50%); }
    100% { opacity: 0; transform: translate(-50%, -40%); }
  }

  .search-sheet-results {
    flex: 1;
    overflow-y: auto;
  }

  .search-sheet-result {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .search-sheet-result:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .search-sheet-thumb {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }

  .search-sheet-title {
    flex: 1;
    color: #fff;
    font-size: 16px;
  }

  .search-sheet-buttons {
    display: flex;
    gap: 8px;
  }

  .search-sheet-play,
  .search-sheet-queue {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: var(--custom-accent);
    color: #fff;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .search-sheet-play ha-icon,
  .search-sheet-queue ha-icon {
    width: 20px;
    height: 20px;
  }

  .search-sheet-play:hover,
  .search-sheet-queue:hover {
    background: #e68900;
  }

  .search-sheet-queue {
    background: #4a4a4a;
    border: 1px solid #666;
  }

  .search-sheet-queue:hover {
    background: #5a5a5a;
    border-color: #777;
  }

  /* Override styles when match_theme is false - force default colors */
  .search-sheet[data-match-theme="false"] {
    background: rgba(0, 0, 0, 0.8) !important;
    
    /* Define CSS custom properties directly on the search sheet when match_theme is false */
    --custom-accent: #ff9800 !important;
    --search-overlay-bg: rgba(0, 0, 0, 0.8) !important;
    --search-input-bg: #333 !important;
    --search-input-text: #fff !important;
    --search-text: #fff !important;
    --search-error: #ff6b6b !important;
    --search-success: #4caf50 !important;
    --search-success-bg: rgba(76, 175, 80, 0.95) !important;
    --search-border: rgba(255, 255, 255, 0.1) !important;
    --search-hover-bg: rgba(255, 255, 255, 0.1) !important;
    --search-play-hover: #e68900 !important;
    --search-queue-bg: #4a4a4a !important;
    --search-queue-border: #666 !important;
    --search-queue-hover: #5a5a5a !important;
    --search-queue-hover-border: #777 !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header input {
    background: #333 !important;
    color: #fff !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header button {
    background: #ff9800 !important;
    color: #fff !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-loading,
  .search-sheet[data-match-theme="false"] .search-sheet-error,
  .search-sheet[data-match-theme="false"] .search-sheet-success,
  .search-sheet[data-match-theme="false"] .search-sheet-empty {
    color: #fff !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-error {
    color: #ff6b6b !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-success {
    color: #4caf50 !important;
    background: rgba(76, 175, 80, 0.95) !important;
    border: 2px solid #4caf50 !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-result {
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-result:hover {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-title {
    color: #fff !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play {
    background: var(--custom-accent) !important;
    color: #fff !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play:hover {
    background: #e68900 !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-queue {
    background: #4a4a4a !important;
    color: #fff !important;
    border: 1px solid #666 !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-queue:hover {
    background: #5a5a5a !important;
    border-color: #777 !important;
  }

  /* Additional overrides for search sheet elements that might inherit theme colors */
  .search-sheet[data-match-theme="false"] .clickable-search-result {
    color: #ff9800 !important;
  }

  .search-sheet[data-match-theme="false"] .clickable-search-result:hover {
    color: #fff !important;
  }

  /* Override the base clickable-search-result styles when match_theme is false */
  .search-sheet[data-match-theme="false"] .clickable-search-result,
  .search-sheet[data-match-theme="false"] .clickable-search-result:hover {
    color: #ff9800 !important;
  }

  .search-sheet[data-match-theme="false"] .clickable-search-result:hover {
    color: #fff !important;
  }

  /* Override any other elements that might be using theme variables */
  .search-sheet[data-match-theme="false"] * {
    color: #fff !important;
  }

  .search-sheet[data-match-theme="false"] .clickable-search-result {
    color: #ff9800 !important;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play,
  .search-sheet[data-match-theme="false"] .search-sheet-queue {
    color: #fff !important;
  }

  /* Force all text to be white when match_theme is false */
  .search-sheet[data-match-theme="false"] .search-sheet-title,
  .search-sheet[data-match-theme="false"] .search-sheet-loading,
  .search-sheet[data-match-theme="false"] .search-sheet-empty {
    color: #fff !important;
  }

  /* Nuclear option: Override ALL elements that might be using --custom-accent or theme colors */
  .search-sheet[data-match-theme="false"] *[style*="color"] {
    color: #fff !important;
  }

  .search-sheet[data-match-theme="false"] *[style*="background"] {
    background: rgba(0, 0, 0, 0.8) !important;
  }

  /* Force override any CSS custom properties that might be inherited */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800 !important;
    --accent-color: #ff9800 !important;
    --primary-color: #ff9800 !important;
    --ha-accent-color: #ff9800 !important;
  }

  /* Also redefine --custom-accent locally in the search sheet, just like entity-options-resolved-entities does */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800 !important;
  }

  /* Also override at the root level when match_theme is false */
  yet-another-media-player-alpha[data-match-theme="false"] {
    --custom-accent: #ff9800 !important;
    --accent-color: #ff9800 !important;
    --primary-color: #ff9800 !important;
    --ha-accent-color: #ff9800 !important;
  }

  /* Override any elements that might be using CSS custom properties */
  .search-sheet[data-match-theme="false"] .search-sheet-play,
  .search-sheet[data-match-theme="false"] .search-sheet-header button,
  .search-sheet[data-match-theme="false"] *[style*="background: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--primary-color)"] {
    background: #ff9800 !important;
    color: #fff !important;
  }

  /* Override any elements that might be using CSS custom properties for color */
  .search-sheet[data-match-theme="false"] *[style*="color: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--primary-color)"] {
    color: #ff9800 !important;
  }
`;