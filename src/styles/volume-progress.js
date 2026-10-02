import { css } from "lit";
import { Z_LAYERS } from "./shared.js";

export const volumeProgressStyles = css`
  /* Progress bar */
  .progress-bar-container {
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgb(234, 234, 234);
    border-radius: var(--progress-radius, 2px);
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }

  .progress-inner {
    height: 100%;
    background: var(--custom-accent);
    border-radius: var(--progress-radius, 3px) 0 0 var(--progress-radius, 3px);
  }

  .timestamps-container {
    display: flex;
    justify-content: space-between;
    font-size: var(--timestamp-size, 10px);
    margin-top: -1px;
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.9);
    padding: 0 2px;
  }

  /* Volume controls */
  .volume-row {
    display: grid;
    grid-template-columns: minmax(min-content, 1fr) auto minmax(min-content, 1fr);
    align-items: center;
    padding: var(--yamp-volume-row-padding, 10px 16px 14px 16px);
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
    flex-shrink: 0;
  }

  /* Remove flex:1 since we are using grid columns */
  .volume-left,
  .volume-right {
    display: flex;
    align-items: center;
  }

  .volume-left {
    grid-column: 1;
    justify-self: start;
    justify-content: flex-start;
    gap: 8px;
  }

  .volume-right {
    grid-column: 3;
    justify-self: end;
    justify-content: flex-end;
    gap: 8px;
  }

  .volume-center {
    grid-column: 2;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .volume-row.has-slider .volume-left,
  .volume-row.has-slider .volume-right {
    flex: 0 0 auto;
  }

  .volume-row.has-slider {
    grid-template-columns: minmax(min-content, 1fr) 4fr minmax(min-content, 1fr);
  }

  .volume-row.has-slider .volume-center {
    width: 100%;
    justify-self: stretch;
  }

  .volume-controls {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0;
  }

  .search-sheet-play,
  .search-sheet-queue {
    background: none;
    border: none;
    cursor: pointer;
    color: #fff;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .radio-mode-button {
    background: none;
    border: none;
    font-size: 1.25em;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
    margin-right: 8px;
    display: flex;
    align-items: center;
    color: #fff;
  }

  .radio-mode-button.active {
    color: var(--custom-accent, var(--accent-color));
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
    margin: 0;
  }

  @media (hover: hover) {
    .volume-icon-btn:hover {
      color: var(--custom-accent);
    }
  }

  .volume-icon-btn ha-icon,
  .custom-bottom-action ha-icon,
  .vol-stepper .button ha-icon {
    font-size: 22px;
    --mdc-icon-size: 22px;
    --ha-icon-size: 22px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .volume-icon-btn.favorite-volume-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  .volume-leading-placeholder {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  .volume-icon-btn.favorite-volume-btn.active {
    color: var(--custom-accent);
  }

  .volume-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    position: relative;
    padding: 0 24px;
  }

  .volume-slider-icon {
    font-size: 1em;
    color: var(--primary-text);
    opacity: 0.7;
    min-width: 20px;
  }

  .volume-percentage-indicator {
    position: absolute;
    top: -22px;
    background: var(--custom-accent);
    color: var(--yamp-chip-selected-text);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.72em;
    font-weight: 700;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    white-space: nowrap;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
    transform: translateX(-50%);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .volume-percentage-indicator::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: var(--custom-accent) transparent transparent transparent;
  }

  .volume-percentage-indicator.visible {
    opacity: 1;
  }

  .vol-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: hsla(0, 0%, 100%, 0.22);
    border-radius: 3px;
    outline: none;
    box-shadow: var(--shadow-heavy);
    flex: 1 1 auto;
    min-width: 80px;
    max-width: none;
    margin: 10px 0;
  }

  .volume-row .source-menu {
    flex: 0 0 auto;
  }

  .volume-placeholder {
    width: 36px;
    min-width: 36px;
    min-height: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
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
    background: rgba(255, 255, 255, 0.22);
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
    background: rgba(255, 255, 255, 0.22);
    border-radius: 3px;
  }

  /* Touch device improvements */
  @media (pointer: coarse) {
    .vol-slider::-webkit-slider-thumb {
      box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
    }
    .vol-slider::-moz-range-thumb {
      box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
    }
    .vol-slider::-ms-thumb {
      box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
    }
  }

  .vol-stepper-container {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
  }

  .vol-stepper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .vol-stepper .button {
    min-width: 36px;
    min-height: 36px;
    padding: 6px 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vol-value {
    min-width: 48px;
    display: inline-block;
    text-align: center;
    padding-left: 6px;
  }

  .vol-label {
    width: 42px;
    display: inline-block;
    font-size: 0.85em;
    text-transform: lowercase;
    opacity: 0.9;
  }

  .vol-stepper span {
    width: 42px;
    text-align: center;
    display: inline-block;
  }

  /* Collapsed progress bar */
  .collapsed-progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background: var(--custom-accent);
    border-radius: var(--progress-radius, 0) var(--progress-radius, 0) 12px 12px;
    z-index: ${Z_LAYERS.ACCENT_FOREGROUND};
    transition: width var(--transition-normal) linear;
    pointer-events: none;
  }

  /* Volume Overlay styles */
  .volume-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--volume-overlay-bg, rgba(0, 0, 0, 0.45));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 12px;
    color: var(--volume-overlay-color, #ffffff);
    animation: volume-overlay-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: auto;
    box-sizing: border-box;
    padding: 16px;
    text-align: center;
    position: absolute;
    inset: 0;
    z-index: ${Z_LAYERS.VOLUME_OVERLAY};
  }

  .volume-overlay ha-icon {
    --mdc-icon-size: clamp(48px, 12cqw, 96px);
    margin-bottom: clamp(8px, 2cqw, 16px);
    color: var(--custom-accent, var(--accent-color, #ff9800));
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    animation: volume-icon-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .volume-overlay-text {
    font-size: clamp(3.2rem, 15cqw, 7.5rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -1px;
    font-family: var(--yamp-font-family, Roboto, -apple-system, sans-serif);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  @keyframes volume-overlay-in {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes volume-icon-pop {
    0% {
      transform: scale(0.7);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Volume Overlay in Collapsed Mode */
  .collapsed .volume-overlay {
    flex-direction: row;
    gap: 12px;
    padding: 8px 16px;
    background: var(--volume-overlay-collapsed-bg, rgba(0, 0, 0, 0.65));
  }

  .collapsed .volume-overlay ha-icon {
    --mdc-icon-size: clamp(28px, 6cqw, 36px);
    margin-bottom: 0;
  }

  .collapsed .volume-overlay-text {
    font-size: clamp(1.6rem, 8cqw, 2.5rem);
  }
`;
