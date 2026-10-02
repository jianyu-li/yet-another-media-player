import { css } from "lit";
import { Z_LAYERS } from "./shared.js";

export const controlsStyles = css`
  /* Controls */
  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 4px 16px;
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
    flex-shrink: 0;
  }

  .controls-row.adaptive {
    justify-content: center;
    gap: var(--yamp-control-gap, 10px);
    flex-wrap: nowrap;
  }

  .controls-row.adaptive .button {
    flex: 1 1
      calc(
        (100% - (var(--yamp-control-gap, 10px) * (var(--yamp-control-count, 5) - 1))) /
          var(--yamp-control-count, 5)
      );
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--yamp-control-min-width, 48px);
    max-width: var(--yamp-control-max-width, 120px);
    min-height: var(--yamp-control-min-height, 48px);
    padding: var(--yamp-control-padding, 8px);
  }

  .controls-row.adaptive .button ha-icon {
    --mdc-icon-size: var(--yamp-control-icon-size, 36px);
    width: var(--yamp-control-icon-size, 36px);
    height: var(--yamp-control-icon-size, 36px);
    font-size: var(--yamp-control-icon-size, 36px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .controls-row.adaptive .button ha-icon svg,
  .controls-row.adaptive .button ha-icon iron-icon {
    width: 100%;
    height: 100%;
  }

  .controls-row.modern {
    justify-content: center;
    gap: var(--yamp-modern-gap, 14px);
    padding: var(--yamp-modern-padding, 10px 16px 2px 16px);
    /* Grid layout for robust centering */
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  .controls-row.modern .controls-left {
    grid-column: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;
  }

  .controls-row.modern .controls-center {
    grid-column: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
  }

  .controls-row.modern .controls-right {
    grid-column: 3;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 14px;
  }

  .modern-button {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: inherit;
    cursor: pointer;
    border-radius: 999px;
    transition:
      background var(--transition-normal),
      transform 0.12s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }

  .modern-button.small,
  .modern-button.medium,
  .modern-button.primary {
    font-size: inherit;
  }

  .modern-button.small {
    width: var(--yamp-modern-small-size, 42px);
    height: var(--yamp-modern-small-size, 42px);
    padding: 0;
  }

  .modern-button.medium {
    width: var(--yamp-modern-medium-size, 50px);
    height: var(--yamp-modern-medium-size, 50px);
    padding: 0;
  }

  .modern-button.primary {
    width: var(--yamp-modern-primary-size, 70px);
    height: var(--yamp-modern-primary-size, 70px);
    font-size: 1.9em;
    background: rgba(255, 255, 255, 0.1);
  }

  .modern-button ha-icon {
    --mdc-icon-size: var(--yamp-modern-small-icon-size, 24px);
    width: var(--yamp-modern-small-icon-size, 24px);
    height: var(--yamp-modern-small-icon-size, 24px);
  }

  .modern-button.medium ha-icon {
    --mdc-icon-size: var(--yamp-modern-medium-icon-size, 28px);
    width: var(--yamp-modern-medium-icon-size, 28px);
    height: var(--yamp-modern-medium-icon-size, 28px);
  }

  .modern-button.primary ha-icon {
    --mdc-icon-size: var(--yamp-modern-primary-icon-size, 36px);
    width: var(--yamp-modern-primary-icon-size, 36px);
    height: var(--yamp-modern-primary-icon-size, 36px);
  }

  @media (hover: hover) {
    .modern-button:hover {
      background: rgba(255, 255, 255, 0.25);
      color: var(--custom-accent);
    }
  }

  .modern-button:active {
    transform: scale(0.95);
  }

  .modern-button.active:not(.primary) {
    color: var(--custom-accent);
  }

  .modern-button.primary.active {
    color: inherit;
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
    transition:
      background var(--transition-normal),
      color var(--transition-normal);
  }

  @media (hover: hover) {
    .button:hover {
      color: var(--custom-accent);
    }
  }

  .button:active {
    background: rgba(0, 0, 0, 0.1);
  }

  .button.active ha-icon,
  .button.active {
    color: var(--custom-accent);
  }

  /* Hamburger icon (span) overrides */
  .yamp-card-inner[data-has-font-color="true"] .more-info-icon,
  .yamp-card-inner[data-lyrics-active="true"] .more-info-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .more-info-icon {
    color: var(--primary-text);
  }

  /* Ensure active buttons still use the accent color */
  .yamp-card-inner[data-lyrics-active="true"] .button.active,
  .yamp-card-inner[data-lyrics-active="true"] .button.active ha-icon,
  .yamp-card-inner[data-lyrics-active="true"] .modern-button.active,
  .yamp-card-inner[data-lyrics-active="true"] .modern-button.active ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .button.active,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .button.active ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button.active,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button.active ha-icon {
    color: var(--custom-accent);
  }

  /* Persistent Media Controls */
  /* Persistent Media Controls */
  .persistent-media-controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    padding: 14px 22px 18px 22px;
    margin: 0;
    background: transparent;
    border-radius: 0;
    border: none;
    flex-shrink: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
  }

  /* Hide persistent controls when hide_menu_player is enabled */
  :host([data-hide-menu-player="true"]) .persistent-media-controls {
    display: none;
  }

  /* Hide persistent controls when layout constraints require it */
  :host([data-hide-persistent-controls="true"]) .persistent-media-controls {
    display: none;
  }

  .persistent-controls-artwork {
    grid-column: 1;
    justify-self: start;
    flex-shrink: 0;
  }

  .persistent-artwork {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: var(--yamp-artwork-fit, cover);
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

  .artist,
  .vol-label,
  .vol-value {
    color: rgba(255, 255, 255, 0.75);
    font-weight: 400;
  }

  .persistent-controls-buttons {
    grid-column: 2;
    justify-self: center;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .persistent-volume-stepper {
    grid-column: 3;
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 0px;
  }

  .persistent-volume-stepper .stepper-btn {
    background: none;
    border: none;
    color: var(--yamp-overlay-text);
    font-size: 20px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  @media (hover: hover) {
    .persistent-volume-stepper .stepper-btn:hover {
      color: var(--custom-accent);
    }
  }

  .persistent-volume-stepper .stepper-btn:active {
    transform: scale(0.92);
  }

  .persistent-volume-stepper .stepper-value {
    font-size: 0.95em;
    opacity: 0.85;
    min-width: 48px;
    text-align: center;
    color: var(--yamp-overlay-text);
    padding-left: 6px;
  }

  .entity-options-search-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: var(--yamp-button-bg);
    border: 1px solid var(--yamp-button-border);
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
    color: var(--yamp-overlay-text);
  }

  @container (max-width: 450px) {
    .persistent-volume-stepper {
      margin-right: -12px;
    }

    .persistent-volume-stepper .stepper-value {
      min-width: 36px;
      padding-left: 2px;
    }

    .persistent-volume-stepper .stepper-btn {
      width: 32px;
      height: 32px;
      font-size: 18px;
    }
  }

  @media (hover: hover) {
    .persistent-control-btn:hover {
      background: var(--custom-accent);
      border-color: var(--custom-accent);
      transform: scale(1.05);
    }
  }

  .persistent-control-btn:active {
    transform: scale(0.95);
  }

  .persistent-control-btn ha-icon {
    font-size: 16px;
    color: inherit;
  }
`;
