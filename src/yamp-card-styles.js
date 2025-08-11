// yamp-card-styles.js
// import { css } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { css } from "lit";

export const yampCardStyles = css`
  .dim-idle .details,
  .dim-idle .controls-row,
  .dim-idle .volume-row,
  .dim-idle .chip-row,
  .dim-idle .action-chip-row {
    opacity: 0.28 !important;
    transition: opacity 0.5s;
  }
  .more-info-menu {
    display: flex;
    align-items: center;
    margin-right: 0px;
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
    color: var(--primary-text-color, #fff);
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
  .chip-pin:hover ha-icon,
  .chip-pin-inside:hover ha-icon {
    color: #fff !important;
  }
  /* When the user hovers the chip, force the pin icon white */
  .chip:hover .chip-pin ha-icon,
  .chip:hover .chip-pin-inside ha-icon {
    color: #fff !important;
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
  
  /* Music Assistant active outline */
  .chip[ma-active] {
    border: 1px solid rgba(255, 152, 0, 0.6);
  }
  
  .chip[ma-active]:hover {
    border: 1px solid rgba(255, 152, 0, 0.8);
  }
  
  /* When selected and MA active */
  .chip[selected][ma-active] {
    border: 1px solid rgba(255, 152, 0, 0.8);
  }
  
  .chip[selected][ma-active]:hover {
    border: 1px solid rgba(255, 152, 0, 1);
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
    /* 
    .details .title {
      padding-top: 8px;
    }
    */
    .progress-bar-container {
      padding-left: 24px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    /*
    .title {
      font-size: 1.1em;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    */

    .details .title,
    .title { 
      font-size: 1.1em;
      font-weight: 600;
      line-height: 1.2;
      white-space: normal !important;
      word-break: break-word;
      overflow: visible;
      text-overflow: unset;
      display: block;
      padding-top: 8px;
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

    /* Make .vol-slider thumbs easier to grab on touch devices without changing their visual appearance */
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
  .card-lower-content.collapsed .details {
    margin-right: 120px;  /* Reserve space for floating album artwork */
    transition: margin 0.2s;
  }
  @media (max-width: 420px) {
    .card-lower-content.collapsed .details {
      margin-right: 74px; /* Reserve space for floating art on small screens */
    }
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
    margin: 4px 0;
    padding: 6px 0 8px 0;
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

  /* Source index letter button accessibility and hover styling */
  .source-index-letter:focus {
    background: rgba(255,255,255,0.11);
    outline: 1px solid #ff9800;
  }

  /* Floating source index and source list overlay styles (updated) */
  .entity-options-sheet.source-list-sheet {
    position: relative;
    overflow: visible !important;
  }
  .source-list-scroll {
    overflow-y: auto;
    max-height: 340px;
    scrollbar-width: none;           /* Firefox: hide scrollbar */
  }
  .source-list-scroll::-webkit-scrollbar {
    display: none !important;        /* Chrome/Safari/Edge: hide scrollbar */
  }
  .floating-source-index.grab-scroll-active,
  .floating-source-index.grab-scroll-active * {
    cursor: grabbing !important;
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
    pointer-events: auto;          /* was none – allow wheel capture */
    overscroll-behavior: contain;  /* stop wheel bubbling */
    z-index: 10;
    padding: 12px 8px 8px 0;
    overflow-y: auto;
    max-height: 100%;
    min-width: 32px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge */
    cursor: grab;
  }
  .floating-source-index::-webkit-scrollbar {
    display: none !important; /* Chrome, Safari, Opera */
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
    transition: color 0.13s, background 0.13s, transform 0.16s cubic-bezier(.35,1.8,.4,1.04);
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
    display: none !important;
  }
  .floating-source-index .source-index-letter:hover,
  .floating-source-index .source-index-letter:focus {
    color: #fff;
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

  /* Invisible master button to keep layout aligned */
  .group-toggle-transparent {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    color: transparent !important;
    pointer-events: none !important;
  }
  .group-toggle-transparent:hover {
    background: none !important;   /* suppress hover tint */
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
  .entity-options-search {
    padding: 2px 0 4px 0;
  }
  .entity-options-search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px !important;
    margin-top: 2px;
  }
  .entity-options-search-result {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0 9px 0;
    border-bottom: 1px solid #2227;
    font-size: 1.10em;
    color: var(--primary-text-color, #fff);
    background: none;
  }
  .entity-options-search-result:last-child {
    border-bottom: none;
  }
  .entity-options-search-thumb {
    height: 38px;
    width: 38px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 1px 5px rgba(0,0,0,0.16);
    margin-right: 12px;
  }
  .entity-options-search-play {
    min-width: 34px;
    font-size: 1.13em;
    border: none;
    background: var(--custom-accent, #ff9800);
    color: #fff !important;
    border-radius: 10px;
    padding: 6px 10px 6px 10px;
    margin-left: 7px;
    cursor: pointer;
    box-shadow: 0 1px 5px rgba(0,0,0,0.13);
    transition: background 0.2s, color 0.2s;
    text-shadow: 0 2px 8px #0008;
  }
  .entity-options-search-play:hover,
  .entity-options-search-play:focus {
    background: #fff;
    color: var(--custom-accent, #ff9800) !important;
  }
  .entity-options-search-input {
    border: 1px solid #333;
    border-radius: 8px;
    background: var(--card-background-color, #222);
    color: var(--primary-text-color, #fff);
    font-size: 1.12em;
    outline: none;
    transition: border 0.13s;
    margin-right: 7px;
    /* padding removed/overridden below for options sheet */
    box-sizing: border-box;
  }
  .entity-options-search-row .entity-options-search-input {
    padding: 4px 10px;
    height: 32px; 
    min-height: 32px;
    line-height: 1.18;
    box-sizing: border-box;
    border: 1.5px solid var(--custom-accent, #ff9800) !important;
    background: #232323 !important;
    color: #fff !important;
    transition: border 0.13s, background 0.13s;
    outline: none !important;
  }
  .entity-options-search-input:focus {
    border: 1.5px solid var(--custom-accent, #ff9800) !important;
    background: #232323 !important;
    color: #fff !important;
    outline: none !important;
  }
  .entity-options-search-loading,
  .entity-options-search-error,
  .entity-options-search-empty {
    padding: 8px 6px 8px 6px;
    font-size: 1.09em;
    opacity: 0.90;
    color: var(--primary-text-color, #fff);
    background: none;
    text-align: left;
  }
  .entity-options-search-error {
    color: #e44747 !important;
    font-weight: 500;
  }
  .entity-options-search-empty {
    color: #999 !important;
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
  /* Style for search filter chips */
  .search-filter-chips .chip {
    color: #fff !important;
  }
  .search-filter-chips .chip[selected],
  .search-filter-chips .chip[style*="background: var(--customAccent"],
  .search-filter-chips .chip[style*="background: var(--custom-accent"] {
    color: #111 !important;
  }


.entity-options-sheet .search-filter-chips .chip:not([selected]) {
  color: #fff !important;
}
.entity-options-sheet .search-filter-chips .chip[selected] {
  color: #111 !important;
}
  
.entity-options-sheet .search-filter-chips .chip {
  text-align: center !important;
  justify-content: center !important;
}

.entity-options-sheet .entity-options-search-results {
  min-height: 210px;   
  /* Remove max-height and overflow-y */
}


  /* Highlight search filter chips on hover in options sheet */
.entity-options-sheet .search-filter-chips .chip:hover {
  background: var(--custom-accent, #ff9800) !important;
  color: #111 !important;
}

.entity-options-sheet .search-filter-chips .chip:hover {
  opacity: 1 !important;
}
/* --- Make the search header fixed and results flex --- */
.entity-options-sheet .entity-options-search {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.entity-options-sheet .entity-options-search-row,
.entity-options-sheet .search-filter-chips {
  flex: 0 0 auto;          /* never grow/shrink */
}

.entity-options-sheet .entity-options-search-results {
  flex: 1 1 auto;          /* take remaining space */
  /* keeps earlier min-height */
}
/* Invisible placeholder rows (keep height, hide divider) */
/* Placeholder rows keep layout height even when invisible */
.entity-options-search-result.placeholder {
  visibility: hidden;                              /* hide contents */
  border-bottom: 1px solid transparent !important; /* divider invisible */
  min-height: 46px;                                /* match real row height */
  box-sizing: border-box;
}
;

/* Artist text becomes clickable when it can open a search */
.clickable-artist {
  cursor: pointer;
}
.clickable-artist:hover {
  text-decoration: underline;
}`