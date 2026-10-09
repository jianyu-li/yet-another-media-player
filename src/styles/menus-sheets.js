import { css } from "lit";
import { Z_LAYERS, BLUR_5, HIDE_SCROLLBAR, CHIP_ROW_MASK } from "./shared.js";

export const menusSheetsStyles = css`
  /* More info menu */
  .more-info-menu {
    display: flex;
    align-items: center;
    margin-right: -4px;
    margin-top: -5px;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
  }

  .dim-idle .more-info-menu,
  .more-info-menu.volume-collapsed {
    position: absolute;
    bottom: 14px;
    right: 12px;
    margin-top: 0;
    margin-right: 0;
  }

  .more-info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    padding: 0;
    margin: 0;
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
    color: var(--yamp-icon-color, #fff);
    transition: color var(--transition-normal, 0.2s);
  }

  .dim-idle .more-info-btn ha-icon {
    color: #fff;
  }

  .more-info-icon {
    font-size: 2em;
    line-height: 1;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-normal, 0.2s);
  }

  .dim-idle .more-info-icon {
    color: #fff;
  }

  :host([data-disable-artwork-gradient="true"]) .more-info-icon {
    color: var(--yamp-icon-color, var(--primary-text, #444));
  }

  :host([data-disable-artwork-gradient="true"]) .dim-idle .more-info-icon {
    color: var(--secondary-text, #9ea2a8);
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
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
    margin-top: 2px;
    border: 1px solid var(--yamp-overlay-divider);
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

  @media (hover: hover) {
    .source-option:hover,
    .source-option:focus {
      background: var(--custom-accent);
      color: #fff;
    }
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

  /* Entity options overlay */
  .entity-options-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: ${Z_LAYERS.OVERLAY_BASE};
    background: var(--yamp-overlay-bg);
    backdrop-filter: ${BLUR_5};
    -webkit-backdrop-filter: ${BLUR_5};
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  /* Opening animations for hamburger menu */
  @keyframes overlayFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes containerSlideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes sheetSlideIn {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .entity-options-overlay-opening {
    animation: overlayFadeIn 0.2s ease-out;
  }

  .entity-options-container-opening {
    animation: containerSlideIn 0.3s ease-out;
  }

  .entity-options-sheet-opening {
    animation: sheetSlideIn 0.25s ease-out 0.05s both;
  }

  /* Closing animations for hamburger menu */
  @keyframes overlayFadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes containerSlideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }

  @keyframes sheetSlideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(10px);
      opacity: 0;
    }
  }

  .entity-options-overlay-closing {
    animation: overlayFadeOut 0.15s ease-in forwards;
    pointer-events: none;
  }

  .entity-options-container-closing {
    animation: containerSlideOut 0.2s ease-in forwards;
  }

  .entity-options-sheet-closing {
    animation: sheetSlideOut 0.15s ease-in 0.05s both forwards;
  }

  .entity-options-container {
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 2% auto;
    ${HIDE_SCROLLBAR}
    display: flex;
    flex-direction: column;
    max-height: calc(96% - 70px);
    min-height: 90px;
    position: relative;
  }

  /* Expand container height when hide_menu_player is enabled (no persistent controls) */
  :host([data-hide-menu-player="true"]) .entity-options-container {
    max-height: 96%;
  }

  /* Expand container height when persistent controls are hidden due to layout constraints */
  :host([data-hide-persistent-controls="true"]) .entity-options-container,
  :host([data-pin-search-headers="true"]) .entity-options-container,
  :host([data-in-search="true"]) .entity-options-container {
    max-height: 96%;
    ${HIDE_SCROLLBAR}
  }

  .entity-options-sheet {
    background: none;
    border-radius: var(--border-radius);
    box-shadow: none;
    width: 100%;
    height: 100%;
    padding: 18px 8px 0px 8px;
    padding-top: clamp(12px, 6vh, 18px);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    ${HIDE_SCROLLBAR}
    font-size: calc(1em * var(--yamp-text-scale-menu, 1));
    position: relative;
    box-sizing: border-box;
    color: var(--yamp-overlay-text);
  }

  /* Main menu specific styling - move options down, adapt to card height */
  .entity-options-sheet .entity-options-menu {
    margin-top: 0px;
    margin-bottom: 16px;
  }

  .in-menu-active-label {
    position: absolute !important;
    left: 50%;
    bottom: 6px;
    transform: translateX(-50%);
    font-size: 0.78em;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(
      --in-menu-active-label-color,
      var(--secondary-text, var(--secondary-text-color, #aaa))
    );
    opacity: 0.85;
    pointer-events: none !important;
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

  .entity-options-container,
  .entity-options-container-opening {
    position: relative;
  }

  .entity-options-chips-wrapper {
    position: sticky;
    top: 0;
    z-index: ${Z_LAYERS.STICKY_CHIPS};
    padding: 2px 4px 2px 4px;
    background: transparent;
  }

  .entity-options-chips-strip {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;
    overflow-x: auto;
    padding: 2px 8px 6px 8px;
    background: var(--ha-menu-chip-row-background, transparent);
    -webkit-mask-image: ${CHIP_ROW_MASK};
    mask-image: ${CHIP_ROW_MASK};
  }

  .entity-options-chips-strip .chip {
    /* Uses centralized .chip styling */
  }

  .entity-options-menu.chips-in-menu {
    margin-top: 4px;
  }

  .entity-options-sheet.chips-mode {
    padding-top: 4px;
  }

  .entity-options-sheet {
    ${HIDE_SCROLLBAR}
  }

  /* Hide scrollbar for group list scroll container */
  .group-list-scroll {
    ${HIDE_SCROLLBAR}
  }

  /* Seamless grouping header and scrolling list */
  .entity-options-sheet[data-pin-search-headers="true"] .group-list-header {
    z-index: 1;
    padding-top: 4px;
    margin-top: -4px;
    padding-bottom: 4px;
  }

  .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    margin-bottom: 72px; /* Reserve space for controls */
    padding-bottom: 0;
    scrollbar-width: thin; /* Allow scrollbar if needed */
  }

  .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll::-webkit-scrollbar {
    display: block;
    width: 6px;
  }

  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .group-list-scroll,
  :host([data-hide-menu-player="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .group-list-scroll {
    margin-bottom: 12px;
    padding-bottom: 0;
  }

  .entity-options-title {
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 18px;
    text-align: center;
    color: var(--yamp-overlay-text);
    background: none;
  }

  .entity-options-item {
    background: none;
    color: var(--yamp-overlay-text);
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 400;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast);
    text-align: center;
  }

  .entity-options-item[disabled] {
    opacity: 0.5;
    cursor: default;
  }

  .transfer-queue-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
  }

  /* Override entity-options-scroll display:flex (line ~3355) — !important needed because
     .grid-menu appears earlier in source order than .entity-options-scroll */
  .grid-menu {
    display: grid !important;
    grid-template-columns: repeat(5, 1fr); /* MINI_GRID_COLUMNS */
    gap: 0;
    padding: 0;
    margin: 8px 0;
  }

  .grid-menu .entity-options-item {
    position: relative;
    margin: 0;
    border-radius: 0;
    border-bottom: 1px solid var(--divider-color, var(--yamp-overlay-divider));
    border-right: 1px solid var(--divider-color, var(--yamp-overlay-divider));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 4px;
    min-height: 64px;
    gap: 6px;
    font-size: 0.7em;
  }

  /* Remove right border on last column */
  .grid-menu .entity-options-item:nth-child(5n) {
    /* MINI_GRID_COLUMNS */
    border-right: none;
  }

  .grid-menu .entity-options-item[disabled] {
    cursor: default;
    opacity: 0.5;
  }

  .grid-menu .entity-options-item.grid-active {
    color: var(--custom-accent);
  }

  .grid-menu-transfer-btn {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--yamp-overlay-text);
    opacity: 0.7;
    transition:
      opacity 0.15s ease,
      color 0.15s ease,
      background 0.15s ease;
    z-index: 2;
  }

  .grid-menu-transfer-btn ha-icon {
    width: 15px;
    height: 15px;
    --mdc-icon-size: 15px;
  }

  .grid-menu-transfer-btn:disabled,
  .grid-menu-transfer-btn[disabled] {
    cursor: not-allowed;
    opacity: 0.25;
  }

  @media (hover: hover) {
    .grid-menu-transfer-btn:not([disabled]):hover {
      opacity: 1;
      background: var(--yamp-hover-bg, rgba(255, 255, 255, 0.15));
      color: var(--custom-accent, var(--primary-color));
    }
  }

  /* Wrapper for grid-menu children — display:contents lets items participate in the grid directly */
  .grid-menu-items {
    display: contents;
  }

  /* Grouped players card box (list and grid modes) */
  .grouped-players-card {
    background: var(--yamp-grouped-card-bg, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--yamp-grouped-card-border, var(--yamp-overlay-divider));
    border-radius: var(--button-border-radius, 8px);
    margin-bottom: 12px;
    padding: 0;
    overflow: hidden;
    box-sizing: border-box;
  }

  .grouped-players-card.is-current-group {
    border-color: var(--custom-accent, var(--primary-color, #ff9800));
  }

  .grouped-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 7px;
    border-bottom: 1px solid var(--divider-color, var(--yamp-overlay-divider));
    font-size: 0.85em;
    font-weight: 600;
    color: var(--yamp-overlay-text);
  }

  .grouped-card-title {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .grouped-card-title ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
    color: var(--custom-accent, currentColor);
    flex-shrink: 0;
  }

  .grouped-card-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .grouped-card-transfer-btn {
    background: var(--yamp-button-bg, rgba(255, 255, 255, 0.1));
    border: 1px solid var(--yamp-button-border, rgba(255, 255, 255, 0.2));
    border-radius: var(--button-border-radius, 6px);
    color: var(--yamp-overlay-text, #fff);
    padding: 2px 6px;
    cursor: pointer;
    transition:
      background var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast),
      opacity var(--transition-fast);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1.3;
  }

  .grouped-card-transfer-btn ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
  }

  .grouped-card-transfer-btn:disabled,
  .grouped-card-transfer-btn[disabled] {
    cursor: not-allowed;
    opacity: 0.35;
  }

  @media (hover: hover) {
    .grouped-card-transfer-btn:not([disabled]):hover {
      background: var(--yamp-hover-bg, rgba(255, 255, 255, 0.2));
      color: var(--custom-accent, var(--primary-color, #ff9800));
      border-color: var(--custom-accent, var(--primary-color, #ff9800));
    }
  }

  .grouped-card-ungroup-btn {
    background: var(--yamp-button-bg, rgba(255, 255, 255, 0.1));
    border: 1px solid var(--yamp-button-border, rgba(255, 255, 255, 0.2));
    border-radius: var(--button-border-radius, 6px);
    color: var(--yamp-overlay-text, #fff);
    font-size: 0.72em;
    font-weight: 600;
    padding: 2px 8px;
    cursor: pointer;
    transition:
      background var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast);
    display: inline-flex;
    align-items: center;
    line-height: 1.3;
  }

  @media (hover: hover) {
    .grouped-card-ungroup-btn:hover {
      background: var(--yamp-hover-bg, rgba(255, 255, 255, 0.2));
      color: var(--custom-accent, var(--primary-color, #ff9800));
      border-color: var(--custom-accent, var(--primary-color, #ff9800));
    }
  }

  .group-player-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 8px 4px 8px;
    margin-bottom: 1px;
  }

  .grouped-players-card .group-player-row {
    padding: 10px 7px 8px 7px;
    margin: 0;
  }

  .grouped-players-card .group-player-row:not(:last-child) {
    border-bottom: 1px solid var(--divider-color, var(--yamp-overlay-divider));
  }

  .grid-group-card {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    background: var(--yamp-grouped-card-bg, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--yamp-grouped-card-border, var(--yamp-overlay-divider));
    border-radius: var(--button-border-radius, 8px);
    margin-bottom: 12px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .grid-group-card.is-current-group {
    border-color: var(--custom-accent, var(--primary-color, #ff9800));
  }

  .grid-group-card .grouped-card-header {
    border-bottom: 1px solid var(--divider-color, var(--yamp-overlay-divider));
  }

  .grid-group-card-items {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
    width: 100%;
  }

  .grid-group-card-items .entity-options-item:nth-child(5n) {
    border-right: none;
  }

  .grid-group-card-items .entity-options-item:last-child {
    border-right: none;
  }

  .grid-group-card-items .entity-options-item:nth-last-child(-n + 5) {
    border-bottom: none;
  }

  /* Non-grid transfer queue layout */
  .transfer-queue-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* Give the icon a specific size in grid mode */
  .grid-menu .menu-action-icon,
  .grid-menu .entity-options-item > ha-icon {
    --mdc-icon-size: 24px;
    width: 24px;
    height: 24px;
    color: inherit;
    --mdc-icon-color: currentColor;
    --icon-color: currentColor;
  }

  .grid-menu .menu-action-label,
  .grid-menu .entity-options-item > span,
  .search-result-grid-mode .menu-action-label {
    line-height: 1.1;
    text-align: center;
    color: inherit;
  }

  .search-result-grid-mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    border-radius: 0;
    border-bottom: 1px solid var(--divider-color, var(--yamp-overlay-divider));
    border-right: 1px solid var(--divider-color, var(--yamp-overlay-divider));
    padding: 12px 4px;
    gap: 6px;
    font-size: 0.7em;
    width: 100%;
    height: 100%;
    background: transparent;
    cursor: pointer;
    box-sizing: border-box;
  }

  /* Remove right border on last column */
  .search-result-grid-mode:nth-child(5n) {
    /* MINI_GRID_COLUMNS */
    border-right: none;
  }

  .search-result-grid-mode .yamp-search-result-thumb,
  .search-result-grid-mode .yamp-search-result-thumb-placeholder {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
    margin: 0;
  }

  .search-result-grid-mode .yamp-search-result-thumb-placeholder {
    background-color: var(--yamp-surface-variant);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-result-grid-mode .yamp-search-result-thumb-placeholder ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
  }

  .search-result-grid-mode .menu-action-label {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 100%;
    word-break: break-word;
  }

  .entity-options-item.menu-action-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
  }

  .entity-options-item.menu-action-item .menu-action-icon {
    color: inherit;
    --mdc-icon-color: currentColor;
    --icon-color: currentColor;
    --paper-item-icon-color: currentColor;
    --ha-icon-color: currentColor;
    fill: currentColor;
  }

  .entity-options-item.menu-action-item .menu-action-label {
    color: inherit;
  }

  @media (hover: hover) {
    .entity-options-item:hover {
      color: var(--custom-accent, #ff9800);
      background: none;
    }
  }

  .entity-options-item.close-item {
    font-weight: 500;
    margin: 1px 0;
    margin-top: 12px;
    padding-top: 4px;
    padding-bottom: 5px;
    display: block;
    width: 100%;
  }

  .entity-options-divider {
    height: 1px;
    background: var(--yamp-overlay-divider);
    margin: 1px 0 8px 0;
    width: 100%;
    display: block;
  }

  /* Ensure Group Players header always shows a single divider */
  .grouping-header {
    width: 100%;
  }

  /* Source index */
  .source-index-letter:focus {
    background: rgba(255, 255, 255, 0.11);
    outline: 1px solid var(--custom-accent);
  }

  .source-list-centering-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .source-list-sheet {
    width: 100%;
    position: relative;
    overflow: visible;
  }

  .source-list-scroll {
    overflow-y: auto;
    max-height: 340px;
    ${HIDE_SCROLLBAR}
    width: 100%;
  }

  .source-list-scroll .entity-options-item {
    width: 100%;
  }

  .floating-source-index.grab-scroll-active,
  .floating-source-index.grab-scroll-active * {
    cursor: grabbing;
  }

  .floating-source-index {
    position: absolute;
    top: 55px;
    bottom: 20px;
    right: 0;
    width: 32px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    pointer-events: auto;
    overscroll-behavior: contain;
    z-index: ${Z_LAYERS.ACCENT_FOREGROUND};
    padding: 0 8px 0 0;
    overflow-y: auto;
    max-height: calc(100% - 75px);
    min-width: 38px;
    ${HIDE_SCROLLBAR}
  }

  .entity-options-sheet.chips-mode .floating-source-index {
    top: clamp(72px, 15vh, 120px);
    height: calc(100% - clamp(72px, 15vh, 120px));
  }

  .floating-source-index .source-index-letter {
    background: none;
    border: none;
    color: var(--yamp-overlay-text);
    font-size: 0.9em;
    cursor: pointer;
    margin: 1px 0;
    padding: 0;
    pointer-events: auto;
    outline: none;
    transition:
      color var(--transition-fast),
      background var(--transition-fast),
      transform 0.16s cubic-bezier(0.35, 1.8, 0.4, 1.04);
    transform: scale(1);
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    min-height: 22px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: ${Z_LAYERS.OVERLAY_BASE};
  }

  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
  }

  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.1);
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
  }

  .floating-source-index .source-index-letter::after {
    display: none;
  }

  @media (hover: hover) {
    .floating-source-index .source-index-letter:hover,
    .floating-source-index .source-index-letter:focus {
      color: var(--yamp-overlay-text);
    }
  }

  .floating-source-index .source-index-letter[disabled] {
    opacity: 0.25;
    cursor: default;
  }

  /* Group toggle buttons */
  .group-toggle-btn {
    background: none;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    margin-right: 10px;
    cursor: pointer;
    transition: background 0.15s ease;
    color: var(--yamp-overlay-text);
  }

  .group-toggle-btn ha-icon {
    width: 22px;
    height: 22px;
  }

  .group-toggle-btn:disabled,
  .group-toggle-btn[disabled] {
    cursor: not-allowed;
    opacity: 0.35;
  }

  @media (hover: hover) {
    .group-toggle-btn:not([disabled]):hover {
      background: var(--yamp-hover-bg, rgba(255, 255, 255, 0.12));
      color: var(--custom-accent, var(--primary-color));
    }
  }

  /* Group transfer queue button in list view */
  .group-transfer-btn {
    background: none;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
      background 0.15s ease,
      opacity 0.15s ease,
      color 0.15s ease;
    color: var(--yamp-overlay-text);
    padding: 0;
    margin-left: 2px;
    flex-shrink: 0;
  }

  .group-transfer-btn ha-icon {
    width: 22px;
    height: 22px;
  }

  .group-transfer-btn:disabled,
  .group-transfer-btn[disabled] {
    cursor: not-allowed;
    opacity: 0.35;
  }

  @media (hover: hover) {
    .group-transfer-btn:not([disabled]):hover {
      background: var(--yamp-hover-bg, rgba(255, 255, 255, 0.12));
      color: var(--custom-accent, var(--primary-color));
    }
  }

  .group-toggle-transparent {
    background: none;
    border: none;
    box-shadow: none;
    color: transparent;
    pointer-events: none;
  }

  @media (hover: hover) {
    .group-toggle-transparent:hover {
      background: none;
    }
  }

  /* Force theme-aware text in grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: var(--yamp-overlay-text);
  }

  /* Specific override to ensure selected/hovered chips keep their text color regardless of the global sheet rule above */
  .entity-options-sheet .chip[selected],
  .entity-options-sheet .chip[selected] * {
    color: var(--yamp-chip-selected-text) !important;
  }

  @media (hover: hover) {
    .entity-options-sheet .chip:hover,
    .entity-options-sheet .chip:hover * {
      color: var(--yamp-chip-selected-text) !important;
    }
  }

  /* Queue control buttons */
  .queue-controls {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-right: 0;
  }

  .queue-drag-handle {
    cursor: grab;
    opacity: 0.6;
  }

  .queue-drag-handle:active {
    cursor: grabbing;
  }

  @media (hover: hover) {
    .queue-drag-handle:hover {
      opacity: 1;
      color: var(--custom-accent);
    }
  }

  @media (hover: hover) {
    .queue-btn-up:hover,
    .queue-btn-up:focus {
      background: transparent;
      color: var(--yamp-success-color);
    }
  }

  @media (hover: hover) {
    .queue-btn-down:hover,
    .queue-btn-down:focus {
      background: transparent;
      color: var(--yamp-success-color);
    }
  }

  @media (hover: hover) {
    .queue-btn-next:hover,
    .queue-btn-next:focus {
      background: transparent;
      color: var(--custom-accent);
    }
  }

  @media (hover: hover) {
    .queue-btn-remove:hover,
    .queue-btn-remove:focus {
      background: transparent;
      color: var(--yamp-error-color);
    }
  }

  /* Visual feedback for moved queue items */
  .yamp-search-result.just-moved {
    background: var(--yamp-success-bg-light);
    border-left: 3px solid var(--yamp-success-color);
    animation: queueMoveHighlight 1s ease-out;
  }

  @keyframes queueMoveHighlight {
    0% {
      background: var(--yamp-success-bg-medium);
      transform: scale(1.02);
    }
    100% {
      background: var(--yamp-success-bg-light);
      transform: scale(1);
    }
  }

  /* Unified Header and Scroll Containers for Menu Sheets */
  .entity-options-header {
    flex: 0 0 auto;
    position: relative;
    z-index: 10;
    padding-top: 12px;
  }

  /* When pinning is active, the header is sticky and seamless */
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-header {
    position: sticky;
    top: 0;
    background: none;
  }

  /* The scrollable area for all menus */
  .entity-options-scroll {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
    ${HIDE_SCROLLBAR}
  }

  /* Reserved space for persistent media controls when pinning or search mode is active */
  .entity-options-sheet.search-mode .search-sheet-results,
  .entity-options-sheet.search-mode .entity-options-search-results,
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-scroll,
  .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll,
  .entity-options-sheet[data-pin-search-headers="true"] .search-sheet-results,
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search-results {
    margin-bottom: 72px;
    padding-bottom: 0px;
    background: none;
  }

  .entity-options-sheet.search-mode .entity-options-search,
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search {
    margin-bottom: 0px;
    padding-bottom: 0px;
    background: none;
  }

  /* Adjust spacing when persistent controls are hidden (e.g. disabled in config or layout constraints) */
  :host([data-hide-persistent-controls="true"]) .entity-options-sheet.search-mode,
  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet[data-pin-search-headers="true"],
  :host([data-hide-menu-player="true"]) .entity-options-sheet.search-mode,
  :host([data-hide-menu-player="true"]) .entity-options-sheet[data-pin-search-headers="true"] {
    padding-bottom: 12px;
  }

  :host([data-hide-persistent-controls="true"]) .entity-options-sheet .entity-options-scroll,
  :host([data-hide-persistent-controls="true"]) .entity-options-sheet .entity-options-search,
  :host([data-hide-persistent-controls="true"]) .entity-options-sheet .search-sheet-results,
  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet
    .entity-options-search-results,
  :host([data-hide-menu-player="true"]) .entity-options-sheet .entity-options-scroll,
  :host([data-hide-menu-player="true"]) .entity-options-sheet .entity-options-search,
  :host([data-hide-menu-player="true"]) .entity-options-sheet .search-sheet-results,
  :host([data-hide-menu-player="true"]) .entity-options-sheet .entity-options-search-results {
    margin-bottom: 0px !important;
    padding-bottom: 0px !important;
  }
  /* Hide scrollbars for Webkit browsers (Chrome, Safari, etc.) */

  .entity-options-resolved-entities {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-resolved-entities-list {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
    /* Hide scrollbars */
    ${HIDE_SCROLLBAR}
  }

  .entity-options-resolved-entities .entity-options-search-input {
    flex: 1;
    background: var(--search-input-bg);
    color: var(--search-input-text);
    border: 1px solid var(--search-border);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 1em;
    outline: none;
  }
  .entity-options-resolved-entities-list:not(.grid-menu) .entity-options-item {
    background: none;
    color: var(--yamp-overlay-text);
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 400;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast);
    text-align: left;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media (hover: hover) {
    .entity-options-resolved-entities-list:not(.grid-menu) .entity-options-item:hover,
    .entity-options-resolved-entities-list:not(.grid-menu) .entity-options-item:focus {
      color: var(--custom-accent);
      background: none;
    }
  }

  .entity-options-resolved-entities-list:not(.grid-menu) .entity-options-item:last-child {
    border-bottom: none;
  }

  .entity-active-star {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    --mdc-icon-size: 20px;
    flex-shrink: 0;
  }

  .entity-active-star.is-active {
    color: var(--custom-accent, var(--primary-color, #ff9800));
    opacity: 1;
  }

  .entity-active-star.is-inactive {
    color: inherit;
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  @media (hover: hover) {
    .entity-options-item:hover .entity-active-star.is-inactive,
    .entity-options-item:focus-visible .entity-active-star.is-inactive {
      opacity: 0.75;
      color: var(--custom-accent, var(--primary-color, #ff9800));
    }
  }

  @media (hover: none) {
    .entity-active-star.is-inactive {
      opacity: 0.35;
    }
  }

  .entity-more-info-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 4px;
    margin: 0;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    transition:
      opacity var(--transition-fast),
      color var(--transition-fast);
    flex-shrink: 0;
  }

  .entity-more-info-btn:hover {
    opacity: 1;
    color: var(--custom-accent, var(--primary-color, #ff9800));
  }

  /* Drag and drop upcoming queue styles */
  .queue-drag-wrapper {
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
    overflow: visible;
  }

  .queue-drop-indicator {
    display: none;
  }

  .queue-drag-clone {
    border-radius: 12px;
    overflow: hidden;
  }

  /* Positioning is set inline in yamp-queue-drag.js */
  .queue-play-next-dropzone {
    transition:
      background 0.2s ease,
      border 0.2s ease,
      box-shadow 0.2s ease;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  @keyframes dropzoneFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .queue-play-next-dropzone .dropzone-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .queue-play-next-dropzone ha-icon {
    color: var(--custom-accent, var(--accent-color, #ff9800));
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
