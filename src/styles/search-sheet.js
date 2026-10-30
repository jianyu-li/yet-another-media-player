import { css } from "lit";
import { Z_LAYERS, BLUR_10, BLUR_20, HIDE_SCROLLBAR, LINE_CLAMP_2 } from "./shared.js";

export const searchSheetStyles = css`
  .entity-options-search-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: var(--yamp-button-bg);
    border: 1px solid var(--yamp-button-border);
  }

  /* Search functionality */
  .entity-options-search {
    padding: 0px 10px 0px 10px;
  }

  .entity-options-search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
    margin-top: 2px;
  }

  .yamp-search-result.menu-active > *:not(.search-row-slide-out):not([class$="-overlay"]) {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .yamp-search-result {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid var(--search-border);
    font-size: 1.1em;
    color: var(--primary-text);
    background: none;
    width: 100%;
    box-sizing: border-box;
  }
  .search-row-slide-out {
    position: absolute;
    inset: 0;
    left: 100%;
    background: var(--search-overlay-bg);
    backdrop-filter: ${BLUR_10};
    -webkit-backdrop-filter: ${BLUR_10};
    z-index: ${Z_LAYERS.SEARCH_SLIDE_OUT};
    display: flex;
    align-items: center;
    padding: 0 8px;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 15px 0 0 15px;
    overflow-x: auto;
    ${HIDE_SCROLLBAR}
    gap: 4px;
  }

  .search-row-slide-out.active {
    left: 0;
  }

  .search-row-success-overlay,
  .search-row-loading-overlay,
  .search-row-error-overlay {
    position: absolute;
    inset: 0;
    background: var(--search-overlay-bg);
    backdrop-filter: ${BLUR_20};
    -webkit-backdrop-filter: ${BLUR_20};
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--yamp-overlay-text);
    font-weight: 600;
    font-size: 0.95em;
    z-index: ${Z_LAYERS.SEARCH_SUCCESS};
    border-radius: inherit;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
    animation: success-fade-in 0.3s ease;
  }

  .search-row-loading-overlay {
    background: var(
      --search-row-loading-bg,
      color-mix(in srgb, var(--yamp-overlay-base, #000) 25%, transparent)
    );
    backdrop-filter: var(--search-row-loading-backdrop-filter, blur(12px) saturate(1.2));
    -webkit-backdrop-filter: var(--search-row-loading-backdrop-filter, blur(12px) saturate(1.2));
  }

  .search-row-error-overlay {
    background: var(--search-error-bg);
  }

  .search-row-success-overlay span:first-child,
  .search-row-loading-overlay ha-icon,
  .search-row-error-overlay ha-icon {
    font-size: 1.5em;
  }

  .search-row-loading-overlay ha-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes success-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .slide-out-button {
    flex: 0 0 auto;
    background: transparent;
    border: none;
    color: var(--yamp-overlay-text);
    padding: 6px 10px;
    border-radius: 18px;
    cursor: pointer;
    font-size: 0.88em;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Redundant .chip removed - now uses base styling at line 571 */
  .slide-out-button {
    transition:
      background 0.2s,
      color 0.2s;
  }

  @media (hover: hover) {
    .slide-out-button:hover {
      background: var(--custom-accent);
      color: #fff;
    }
  }

  .slide-out-button ha-icon {
    width: 18px;
    height: 18px;
    color: inherit;
    --mdc-icon-color: currentColor;
    --icon-color: currentColor;
    --paper-item-icon-color: currentColor;
    --ha-icon-color: currentColor;
    fill: currentColor;
  }

  .slide-out-close {
    margin-left: auto;
    color: var(--yamp-overlay-text);
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (hover: hover) {
    .slide-out-close:hover {
      color: var(--custom-accent);
    }
  }

  .yamp-search-result:last-child {
    border-bottom: none;
  }

  .yamp-search-result.placeholder {
    visibility: hidden;
    border-bottom: 1px solid transparent;
    min-height: 46px;
    box-sizing: border-box;
  }

  .yamp-search-result-thumb {
    height: 38px;
    width: 38px;
    border-radius: var(--button-border-radius);
    object-fit: var(--yamp-artwork-fit, cover);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.16);
    margin-right: 12px;
  }

  .entity-options-search-buttons {
    display: flex;
    gap: 4px;
    margin-left: 7px;
    align-items: center;
  }

  .entity-options-search-play,
  .entity-options-search-queue,
  .queue-btn {
    min-width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: var(--yamp-overlay-text);
    border-radius: 8px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    box-shadow: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  .entity-options-search-play ha-icon,
  .entity-options-search-queue ha-icon,
  .queue-btn ha-icon {
    width: 24px;
    height: 24px;
    --mdc-icon-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (hover: hover) {
    .entity-options-search-play:hover,
    .entity-options-search-play:focus {
      background: transparent;
      color: var(--custom-accent) !important;
      opacity: 0.8;
    }
  }

  .entity-options-search-queue {
    color: var(--yamp-overlay-text-secondary);
  }

  @media (hover: hover) {
    .entity-options-search-queue:hover,
    .entity-options-search-queue:focus {
      background: transparent;
      border: none;
      color: var(--custom-accent);
      opacity: 0.8;
    }
  }

  .entity-options-search-input {
    border: 1px solid var(--search-border);
    border-radius: var(--button-border-radius);
    background: var(--search-input-bg);
    color: var(--search-input-text);
    font-size: 1.12em;
    outline: none;
    transition: border var(--transition-fast);
    margin-right: 7px;
    box-sizing: border-box;
  }

  .entity-options-search-row .entity-options-search-input {
    padding: 4px 34px 4px 10px; /* Increased right padding for clear button */
    height: 32px;
    min-height: 32px;
    line-height: 1.18;
    box-sizing: border-box;
    border: 1.5px solid var(--custom-accent);
    background: var(--search-input-bg);
    color: var(--search-input-text);
    transition:
      border var(--transition-fast),
      background var(--transition-fast);
    outline: none;
    width: 100%;
  }

  .search-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .search-input-clear {
    position: absolute;
    right: 18px; /* Adjusted to 18px for better balance */
    top: 50%;
    transform: translateY(-68%); /* Adjusted to -68% to fix "too high" issue */
    background: none;
    border: none;
    color: var(--yamp-overlay-text-secondary);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-fast);
    z-index: 2;
  }

  @media (hover: hover) {
    .search-input-clear:hover {
      color: var(--custom-accent);
    }
  }

  .search-input-clear ha-icon {
    width: 16px; /* Slightly smaller icon (was 18px) */
    height: 16px;
  }

  .entity-options-search-input:focus {
    border: 1.5px solid var(--custom-accent);
    background: var(--search-input-bg);
    color: var(--search-input-text);
    outline: none;
  }

  .entity-options-search-loading,
  .entity-options-search-error,
  .entity-options-search-empty {
    padding: 8px 6px;
    font-size: 1.09em;
    opacity: 0.9;
    color: var(--primary-text);
    background: none;
    text-align: left;
  }

  .entity-options-search-loading {
    color: var(--yamp-overlay-text);
  }

  .entity-options-search-error {
    color: var(--yamp-error-color);
    font-weight: 500;
  }

  .entity-options-search-empty {
    color: var(--yamp-overlay-text-secondary);
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
    width: 72px;
    justify-content: center;
  }

  .search-filter-chips .chip[selected] {
    background: var(--yamp-chip-selected-bg) !important;
    color: var(--yamp-chip-selected-text) !important;
    font-weight: bold;
    opacity: 1;
  }

  .entity-options-sheet .search-filter-chips {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .entity-options-sheet .search-filter-chips .chip {
    justify-content: center;
  }

  @media (hover: hover) {
    .entity-options-sheet .search-filter-chips .chip:hover {
      background: var(--custom-accent);
      color: var(--yamp-chip-selected-text);
      opacity: 1;
    }
  }

  .entity-options-sheet .entity-options-search-results {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    margin: 12px 0;
    padding-bottom: 0px;
    /* Hide scrollbars */
    ${HIDE_SCROLLBAR}
  }

  /* Search layout */
  .search-results-count {
    margin-left: auto;
    padding-left: 0px;
    padding-right: 15px;
    font-size: 0.85em;
    font-style: italic;
    color: var(--yamp-overlay-text-secondary);
    white-space: nowrap;
    text-align: right;
    flex-shrink: 0;
  }

  .entity-options-sheet:not([data-pin-search-headers="true"]):not(.search-mode)
    .entity-options-search {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .search-header-panel {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    touch-action: pan-x;
    overscroll-behavior: contain;
    opacity: 1;
    will-change: margin-top, opacity;
  }

  .search-header-panel.smooth-transition {
    transition:
      margin-top 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.2s ease !important;
  }

  .search-header-panel.retracted {
    opacity: 0 !important;
    pointer-events: none !important;
  }

  .entity-options-sheet[data-pin-search-headers="true"] .search-header-panel {
    transition: none !important;
    margin-top: 0px !important;
    opacity: 1 !important;
    transform: none !important;
    pointer-events: auto !important;
  }

  .entity-options-sheet .entity-options-search-row,
  .entity-options-sheet .search-filter-chips,
  .entity-options-sheet .search-sub-filters {
    flex: 0 0 auto;
  }

  .search-sub-filters .button {
    background: none;
    transition: all 0.2s ease;
    color: var(--yamp-overlay-text);
  }

  .search-sub-filters .button ha-icon {
    color: var(--yamp-icon-color);
    transition: color 0.2s ease;
  }

  @media (hover: hover) {
    .search-sub-filters .button:hover {
      color: var(--custom-accent) !important;
      opacity: 1 !important;
    }
  }

  .search-sub-filters .button.active {
    color: var(--custom-accent) !important;
    opacity: 1 !important;
  }

  .search-sub-filters .button.active ha-icon {
    color: var(--custom-accent) !important;
  }

  @media (hover: hover) {
    .search-sub-filters .radio-mode-button:hover {
      color: var(--custom-accent);
    }
  }

  .entity-options-sheet.search-mode,
  .entity-options-sheet[data-pin-search-headers="true"] {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 0px;
  }

  .entity-options-sheet.search-mode .entity-options-search,
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding-bottom: 0px;
  }

  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-scroll {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Clickable artist and album */
  .clickable-artist,
  .clickable-album {
    cursor: pointer;
  }

  @media (hover: hover) {
    .clickable-artist:hover,
    .clickable-album:hover {
      text-decoration: underline;
    }
  }

  /* Clickable search results */
  .clickable-search-result {
    cursor: pointer;
    transition: color var(--transition-fast);
  }

  @media (hover: hover) {
    .clickable-search-result:hover {
      text-decoration: underline;
      color: var(--yamp-overlay-text);
    }
  }

  /* Search breadcrumb */
  .entity-options-search-breadcrumb {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--search-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .entity-options-search-breadcrumb-text {
    font-size: 0.9em;
    color: var(--yamp-overlay-text);
    font-style: italic;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entity-options-search-breadcrumb-play {
    background: none;
    border: none;
    color: var(--custom-accent);
    padding: 0;
    width: 32px;
    height: 32px;
    margin-left: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition:
      background-color 0.2s,
      color 0.2s;
    flex-shrink: 0;
  }

  @media (hover: hover) {
    .entity-options-search-breadcrumb-play:hover {
      background-color: var(--custom-accent);
      color: var(--yamp-overlay-text);
    }
  }

  .entity-options-search-breadcrumb-play ha-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Search sheet styles */
  .search-sheet {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--search-overlay-bg);
    z-index: ${Z_LAYERS.MODAL_BACKDROP};
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
    background: var(--search-input-bg);
    color: var(--search-input-text);
    font-size: 16px;
  }

  .search-sheet-header button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: var(--custom-accent);
    color: var(--yamp-overlay-text);
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
    color: var(--yamp-chip-text);
    font-size: 18px;
  }

  .search-sheet-error {
    color: var(--search-error);
  }

  .priority-toast-success {
    color: var(--search-success-text);
    font-weight: 600;
    background: var(--search-success-bg);
    border: 2px solid var(--search-success);
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    font-size: 20px;
    animation: fadeInOut 3s ease-in-out;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: ${Z_LAYERS.MODAL_TOAST};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    min-width: 200px;
    text-align: center;
    pointer-events: none;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    10% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    90% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
  }

  .search-sheet-results {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    /* Hide scrollbars */
    ${HIDE_SCROLLBAR}
  }

  .entity-options-sheet:not([data-pin-search-headers="true"]):not(.search-mode)
    .search-sheet-results,
  .entity-options-sheet:not([data-pin-search-headers="true"]):not(.search-mode)
    .entity-options-search-results {
    overflow-y: visible;
    margin-bottom: 72px;
    padding-bottom: 0px;
    flex: none;
    min-height: auto;
  }

  .queue-sortable-container {
    padding-bottom: 24px;
  }

  .queue-sortable-container.is-card-layout {
    display: grid;
    grid-template-columns: repeat(var(--search-card-columns, 4), 1fr);
    gap: 12px;
    padding: 12px 12px 24px 12px;
  }

  .queue-sortable-container.is-card-layout.grid-mode {
    gap: 0;
    padding: 0;
  }

  .queue-sortable-container.is-card-layout.grid-mode
    > .queue-drag-wrapper:nth-child(5n) /* MINI_GRID_COLUMNS */
    .search-result-grid-mode {
    border-right: none;
  }

  .queue-sortable-container.is-card-layout .queue-drag-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .queue-sortable-container.is-card-layout .yamp-search-result.search-result-card {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .yamp-search-result.search-result-card {
    flex-direction: column;
    padding: 8px;
    border-bottom: none;
    border-radius: 12px;
    background: var(--search-card-bg);
    box-shadow: var(
      --chip-box-shadow,
      var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none))
    );
    align-items: center;
    gap: 8px;
    height: min-content;
    position: relative;
    overflow: hidden;
  }

  .search-result-card.minimal {
    background: none !important;
    padding: 0;
  }

  .card-menu-button {
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    z-index: 2;
  }

  @media (hover: hover) {
    .card-menu-button:hover {
      opacity: 1;
    }
  }

  .search-result-card .search-row-slide-out {
    flex-direction: column;
    height: 100%;
    width: 100%;
    top: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: flex-start;
    overflow-y: auto;
    background: var(--search-overlay-bg);
    padding: 12px 8px;
    border-radius: 12px;
    transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 5;
    box-sizing: border-box;
  }

  .search-result-card .search-row-slide-out.active {
    top: 0;
  }

  .search-result-card .slide-out-button {
    font-size: 0.85em;
    padding: 8px 12px;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    text-align: center;
    margin: 2px 0;
    white-space: normal;
    word-break: break-word;
    flex-shrink: 0;
  }

  .search-result-card .slide-out-close {
    margin: 8px 0 4px 0;
    flex-shrink: 0;
  }

  @media (hover: hover) {
    .search-sheet-results .yamp-search-result:not(.search-result-card):hover {
      background: var(--search-hover-bg);
    }
  }

  .yamp-search-result-thumb-placeholder {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    object-fit: var(--yamp-artwork-fit, cover);
    margin-right: 12px;
  }

  .search-result-card .yamp-search-result-thumb,
  .search-result-card .yamp-search-result-thumb-placeholder {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    margin-right: 0;
  }

  .yamp-search-result-thumb-placeholder {
    background: var(--search-thumb-placeholder-bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-sheet-thumb-container {
    position: relative;
    width: auto;
    flex-shrink: 0;
    padding-left: 5px;
  }

  .search-result-card .search-sheet-thumb-container {
    width: 100%;
  }

  .search-sheet-thumb-container[data-clickable="true"] {
    cursor: pointer;
  }

  .card-overlay-buttons {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--search-overlay-bg);
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 8px;
  }

  .icon-only.search-sheet-play,
  .icon-only.search-sheet-queue,
  .icon-only.entity-options-search-play,
  .icon-only.entity-options-search-queue {
    background: var(--custom-accent);
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 50%;
  }

  .entity-options-search-thumb,
  .entity-options-search-thumb-placeholder {
    object-fit: var(--yamp-artwork-fit, cover);
    border-radius: 5px;
  }

  .yamp-search-result-thumb-placeholder ha-icon {
    color: var(--search-thumb-placeholder-icon);
    font-size: 16px;
  }

  .yamp-search-result-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .search-result-card .yamp-search-result-info {
    text-align: center;
    width: 100%;
    display: block; /* Original card behavior */
  }

  .yamp-search-result-title {
    flex: 1;
    color: var(--primary-text);
    font-size: 0.9em;
    font-weight: 500;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .yamp-search-result-subtitle {
    display: block;
    color: var(--search-text-secondary);
    font-size: 0.9em;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .yamp-search-result:not(.search-result-card) .yamp-search-result-subtitle {
    font-size: 0.86em;
    line-height: 1.16;
  }

  .search-result-card .yamp-search-result-info {
    text-align: center;
    width: 100%;
  }

  .search-result-card .yamp-search-result-title {
    text-align: center;
    width: 100%;
    /* 2-line clamping with word-level breaks */
    ${LINE_CLAMP_2}
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 14px;
    line-height: 1.3;
    min-height: 2.6em; /* Reserve space for 2 lines to keep all cards uniform */
  }

  .search-result-card .yamp-search-result-subtitle {
    text-align: center;
    width: 100%;
    /* 2-line clamping with word-level breaks */
    ${LINE_CLAMP_2}
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 0.85em;
    line-height: 1.3;
    min-height: 2.6em; /* Reserve space for 2 lines to keep all cards uniform */
  }

  .yamp-search-result.clickable {
    cursor: pointer;
  }

  .yamp-search-result-title.clickable-search-result,
  .yamp-search-result-subtitle.clickable-search-result {
    text-decoration: none;
  }

  @media (hover: hover) {
    .yamp-search-result-title.clickable-search-result:hover,
    .yamp-search-result-subtitle.clickable-search-result:hover {
      text-decoration: underline;
    }
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
    color: var(--yamp-overlay-text);
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

  @media (hover: hover) {
    .search-sheet-play:hover,
    .search-sheet-queue:hover {
      background: var(--search-play-hover);
    }
  }

  .search-sheet-queue {
    background: var(--search-queue-bg);
    border: 1px solid var(--search-queue-border);
  }

  @media (hover: hover) {
    .search-sheet-queue:hover {
      background: var(--search-queue-hover);
      border-color: var(--search-queue-hover-border);
    }
  }

  /* Override styles when match_theme is false - force default colors */
  .search-sheet[data-match-theme="false"] {
    background: var(--yamp-overlay-bg);

    /* Define CSS custom properties directly on the search sheet when match_theme is false */
    --search-overlay-bg: var(--yamp-overlay-bg);
    --search-input-bg: #333;
    --search-input-text: #fff;
    --search-text: #fff;
    --search-text-secondary: #bbb;
    --search-error: #ff6b6b;
    --search-error-bg: rgba(244, 67, 54, 0.8);
    --search-success: #4caf50;
    --search-success-text: #fff;
    --search-success-bg: rgba(76, 175, 80, 0.95);
    --search-border: rgba(255, 255, 255, 0.1);
    --search-hover-bg: rgba(255, 255, 255, 0.1);
    --search-play-hover: #e68900;
    --search-queue-bg: #4a4a4a;
    --search-queue-border: #666;
    --search-queue-hover: #5a5a5a;
    --search-queue-hover-border: #777;
    --search-card-bg: rgba(255, 255, 255, 0.05);
    --search-thumb-placeholder-bg: rgba(255, 255, 255, 0.1);
    --search-thumb-placeholder-icon: rgba(255, 255, 255, 0.6);
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header input {
    background: #333;
    color: #fff;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header button {
    background: #ff9800;
    color: #fff;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-loading,
  .search-sheet[data-match-theme="false"] .search-sheet-error,
  .search-sheet[data-match-theme="false"] .search-sheet-success,
  .search-sheet[data-match-theme="false"] .search-sheet-empty {
    color: #fff;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-error {
    color: #ff6b6b;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-success {
    color: #4caf50;
    background: rgba(76, 175, 80, 0.95);
    border: 2px solid #4caf50;
  }

  .search-sheet[data-match-theme="false"] .yamp-search-result {
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (hover: hover) {
    .search-sheet[data-match-theme="false"] .yamp-search-result:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play {
    background: var(--custom-accent);
    color: #fff;
  }

  .search-sheet-buttons .search-sheet-queue {
    color: var(--yamp-overlay-text);
  }

  .search-sheet[data-match-theme="false"] *[style*="background"] {
    background: rgba(0, 0, 0, 0.8);
  }

  /* Force override any CSS custom properties that might be inherited */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800;
    --accent-color: #ff9800;
    --primary-color: #ff9800;
    --ha-accent-color: #ff9800;
  }

  /* Also redefine --custom-accent locally in the search sheet, just like entity-options-resolved-entities does */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800;
  }

  /* Also override at the root level when match_theme is false */
  yet-another-media-player[data-match-theme="false"] {
    --custom-accent: #ff9800;
    --accent-color: #ff9800;
    --primary-color: #ff9800;
    --ha-accent-color: #ff9800;
  }

  /* Override any elements that might be using CSS custom properties */
  .search-sheet[data-match-theme="false"] .search-sheet-play,
  .search-sheet[data-match-theme="false"] .search-sheet-header button,
  .search-sheet[data-match-theme="false"] *[style*="background: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--primary-color)"] {
    background: #ff9800;
    color: #fff;
  }

  /* Override any elements that might be using CSS custom properties for color */
  .search-sheet[data-match-theme="false"] *[style*="color: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--primary-color)"] {
    color: #ff9800;
  }
`;
