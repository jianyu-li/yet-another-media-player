import { css } from "lit";
import { Z_LAYERS, lightModeVariables, lightModeDropdown } from "./shared.js";

export const baseCardStyles = css`
  /* CSS Custom Properties for consistency */
  :host {
    --custom-accent: #ff9800;
    --card-bg: #222;
    --primary-text: #fff;
    --secondary-text: #aaa;
    --chip-bg: #333;
    --transition-fast: 0.13s;
    --transition-normal: 0.2s;
    --transition-slow: 0.4s;
    --border-radius: 16px;
    --chip-border-radius: 24px;
    --button-border-radius: 8px;
    --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.13);
    --shadow-medium: 0 2px 8px rgba(0, 0, 0, 0.25);
    --shadow-heavy: 0 0 6px 1px rgba(0, 0, 0, 0.32), 0 0 1px 1px rgba(255, 255, 255, 0.13);
    --yamp-artwork-fit: cover;
    --yamp-artwork-position: top center;
    --yamp-text-scale: 1;
    --yamp-text-scale-details: 1;
    --yamp-text-scale-menu: 1;
    --yamp-text-scale-action-chips: 1;
    --yamp-details-scale: var(--yamp-text-scale-details, 1);
    --yamp-details-line-height: 1.2;
    --yamp-details-max-lines: 3;
    --yamp-details-line-clamp: 3;
    --yamp-details-display: -webkit-box;
    --yamp-details-white-space: normal;
    --yamp-section-bg: rgba(255, 255, 255, 0.02);
    --yamp-section-border: rgba(255, 255, 255, 0.1);
    --yamp-section-radius: 12px;
    --yamp-section-divider: rgba(255, 255, 255, 0.06);
    --yamp-section-title-size: 1em;
    --yamp-section-title-weight: 600;
    --yamp-section-description-size: 0.9em;
    --yamp-section-description-color: #888;

    /* Universal theme-aware variables (default to dark) */
    --yamp-overlay-base: #000;
    --yamp-overlay-bg: rgba(0, 0, 0, 0.82);
    --yamp-overlay-text: #fff;
    --yamp-overlay-text-shadow: none;
    --yamp-overlay-divider: rgba(255, 255, 255, 0.2);
    --yamp-icon-color: #fff;
    --yamp-button-bg: rgba(255, 255, 255, 0.1);
    --yamp-button-border: rgba(255, 255, 255, 0.2);
    --yamp-overlay-text-secondary: rgba(255, 255, 255, 0.7);
    --yamp-success-color: #4caf50;
    --yamp-error-color: #f44336;
    --yamp-success-bg-light: rgba(76, 175, 80, 0.2);
    --yamp-success-bg-medium: rgba(76, 175, 80, 0.4);
    --yamp-chip-bg: rgba(255, 255, 255, 0.15);
    --yamp-chip-text: #fff;
    --yamp-chip-selected-bg: var(--custom-accent);
    --yamp-chip-selected-text: #fff;
    --search-text-secondary: #bbb;
    --search-error-bg: rgba(244, 67, 54, 0.8);
    --search-card-bg: rgba(255, 255, 255, 0.05);
    --search-thumb-placeholder-bg: rgba(255, 255, 255, 0.1);
    --search-thumb-placeholder-icon: rgba(255, 255, 255, 0.6);
    --search-success-text: #fff;
  }

  :host([data-match-theme="false"]) {
    --custom-accent: #ff9800;

    /* Search sheet default theme variables when match_theme is false */
    --search-overlay-bg: var(--yamp-overlay-bg);
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
    /* Always override custom-accent to use theme accent when match_theme is true, regardless of light/dark mode */
    --custom-accent: var(
      --accent-color,
      var(
        --primary-color,
        var(--state-media_player-active-color, var(--state-active-color, #ff9800))
      )
    );

    /* Dynamically assign base components to theme variants */
    --card-bg: var(--ha-card-background, var(--card-background-color, #222));
    --primary-text: var(--primary-text-color, #fff);
    --secondary-text: var(--secondary-text-color, #aaa);
    --chip-bg: var(--chip-background, #333);
    --yamp-section-bg: var(
      --ha-card-background,
      var(--card-background-color, rgba(255, 255, 255, 0.02))
    );
    --yamp-section-border: var(--divider-color, rgba(255, 255, 255, 0.1));
    --yamp-section-description-color: var(--secondary-text-color, #888);

    /* Search sheet theme-aware variables - used when match_theme is true to follow HA theme colors dynamically */
    --search-overlay-bg: var(--yamp-overlay-bg);
    --search-input-bg: var(--ha-card-background, var(--secondary-background-color, #333));
    --search-input-text: var(--primary-text-color, #fff);
    --search-text: var(--primary-text-color, #fff);
    --search-error: var(--error-color, #ff6b6b);
    --search-success: var(--success-color, #4caf50);
    --search-success-bg: color-mix(in srgb, var(--success-color, #4caf50) 95%, transparent);
    --search-border: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-hover-bg: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-play-hover: var(--custom-accent);
    --search-queue-bg: var(--ha-card-background, var(--card-background-color, #4a4a4a));
    --search-queue-border: var(--divider-color, #666);
    --search-queue-hover: var(--secondary-background-color, #5a5a5a);
    --search-queue-hover-border: var(--divider-color, #777);

    /* Universal theme-aware variables mapped to HA theme - used when appearance is automatic */
    --yamp-overlay-base: var(--ha-card-background, var(--card-background-color, #000));
    --yamp-overlay-bg: color-mix(in srgb, var(--yamp-overlay-base), transparent 18%);
    --yamp-overlay-text: var(--primary-text-color, #fff);
    --yamp-overlay-text-shadow: none;
    --yamp-overlay-divider: var(--divider-color, rgba(255, 255, 255, 0.1));
    --yamp-icon-color: var(--primary-text-color, #fff);
    --yamp-button-bg: color-mix(in srgb, var(--primary-text-color, #fff) 10%, transparent);
    --yamp-button-border: var(--divider-color, rgba(255, 255, 255, 0.2));
    --yamp-overlay-text-secondary: var(--secondary-text-color, #888);
    --yamp-success-color: var(--success-color, #4caf50);
    --yamp-error-color: var(--error-color, #f44336);
    --yamp-success-bg-light: color-mix(in srgb, var(--success-color, #4caf50) 20%, transparent);
    --yamp-success-bg-medium: color-mix(in srgb, var(--success-color, #4caf50) 40%, transparent);
    --yamp-chip-selected-text: #fff;
    --search-text-secondary: var(--secondary-text-color, #aaa);

    /* Mode-aware chip defaults - used when appearance is automatic */
    --yamp-chip-bg: color-mix(
      in srgb,
      var(--primary-text-color, #fff) 8%,
      var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.8)))
    );
    --yamp-chip-text: var(--search-text);
    --yamp-chip-selected-bg: var(--custom-accent);
    --yamp-chip-border: var(--divider-color, rgba(0, 0, 0, 0.1));
    --search-error-bg: color-mix(in srgb, var(--error-color, #f44336) 80%, transparent);
    --search-card-bg: color-mix(
      in srgb,
      var(--primary-text-color, #fff) 4%,
      var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.8)))
    );
    --search-thumb-placeholder-bg: color-mix(
      in srgb,
      var(--primary-text-color, #fff) 10%,
      transparent
    );
    --search-thumb-placeholder-icon: var(--secondary-text-color, rgba(255, 255, 255, 0.6));
    --search-success-text: var(--primary-text-color, #fff);
  }

  /* Base card styles - set once, inherit everywhere */
  :host {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, none);
    background: transparent;
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: visible;
    clip-path: none;
  }

  ha-card.yamp-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, none);
    background: transparent;
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
    font-size: inherit;
    position: relative;
    clip-path: none;
    transform: translateZ(0);
  }

  /* Static background color fallback for inset artwork layouts */
  ha-card.yamp-card:has(
      > .yamp-card-inner[data-has-background-image="false"][data-artwork-fit="scaled-contain"]
    ),
  ha-card.yamp-card:has(
      > .yamp-card-inner[data-has-background-image="false"][data-artwork-fit="scaled-contain-alternate"]
    ) {
    background: var(--card-bg);
  }

  .yamp-card-inner {
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
    height: 100%;
    min-height: 100%;
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    container-type: inline-size;
    border-radius: var(--border-radius);
    clip-path: inset(0 round var(--border-radius));
    transform: translateZ(0);
  }

  .card-background-image-layer {
    position: absolute;
    inset: 0;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    background-repeat: no-repeat;
    pointer-events: none;
    transform: translateZ(0);
  }

  .card-background-image-overlay {
    position: absolute;
    inset: 0;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
    transform: translateZ(0);
  }

  .yamp-card-inner[data-lyrics-active="true"] .card-background-image-overlay,
  :host([data-disable-artwork-gradient="true"]) .card-background-image-overlay {
    display: none !important;
  }

  .full-bleed-artwork-bg {
    position: absolute;
    inset: -50px;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: var(--yamp-artwork-position, top center);
    background-repeat: no-repeat;
    pointer-events: none;
    transform: translateZ(0);
  }

  .full-bleed-artwork-fade {
    position: absolute;
    inset: -50px;
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      rgba(0, 0, 0, 0.92) 100%
    );
    transform: translateZ(0);
  }

  .yamp-card-inner[data-lyrics-active="true"] .full-bleed-artwork-fade,
  :host([data-disable-artwork-gradient="true"]) .full-bleed-artwork-fade {
    display: none !important;
  }

  /* Idle state dimming */
  .dim-idle .details,
  .dim-idle .controls-row,
  .dim-idle .volume-row,
  .dim-idle .more-info-menu.volume-collapsed,
  .dim-idle:not(.no-chip-dim) .chip-row,
  .dim-idle:not(.no-chip-dim) .action-chip-row {
    opacity: 0.28;
    transition: opacity 0.5s;
  }

  /* Improve selected chip readability while idle */
  .dim-idle .chip[selected] {
    color: rgba(255, 255, 255, 0.94);
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.35);
  }

  /* Card artwork spacer */
  .card-artwork-spacer {
    width: 100%;
    flex: 1 1 0;
    height: auto;
    min-height: 0;
    pointer-events: none;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host(:not([data-has-custom-height="true"])) .card-artwork-spacer {
    min-height: 180px;
  }

  /* Media background */
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  .media-bg-dim {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    pointer-events: none;
  }

  /* Media artwork */
  .media-artwork-bg {
    position: relative;
    width: 100%;
    aspect-ratio: 1.75/1;
    overflow: hidden;
    background-size: var(--yamp-artwork-bg-size, cover);
    background-repeat: no-repeat;
    background-position: top center;
  }

  .artwork {
    width: 96px;
    height: 96px;
    object-fit: var(--yamp-artwork-fit, cover);
    border-radius: 12px;
    box-shadow: var(--shadow-medium);
    background: #222;
  }

  /* Details section */
  .details {
    padding-top: 0;
    padding-right: calc(16px * var(--yamp-details-scale, 1));
    padding-bottom: calc(12px * var(--yamp-details-scale, 1));
    padding-left: calc(16px * var(--yamp-details-scale, 1));
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: calc(8px * var(--yamp-details-scale, 1));
    margin-top: calc(8px * var(--yamp-details-scale, 1));
    min-height: calc(48px * var(--yamp-details-scale, 1));
    font-size: calc(1em * var(--yamp-details-scale, 1));
    flex-shrink: 0;
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
  }

  .details .title {
    font-size: 1.1em;
    font-weight: 600;
    line-height: var(--yamp-details-line-height, 1.2);
    white-space: var(--yamp-details-white-space, normal);
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: var(--yamp-details-display, -webkit-box);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--yamp-details-line-clamp, var(--yamp-details-max-lines, 3));
    padding-top: calc(8px * var(--yamp-details-scale, 1));
    padding-bottom: calc(4px * var(--yamp-details-scale, 1));
    margin-bottom: calc(-4px * var(--yamp-details-scale, 1));
    max-width: 100%;
    position: relative;
  }

  .details .artist {
    font-size: 1em;
    line-height: var(--yamp-details-line-height, 1.2);
    padding-bottom: calc(4px * var(--yamp-details-scale, 1));
    margin-bottom: calc(-4px * var(--yamp-details-scale, 1));
    max-width: 100%;
    position: relative;
  }

  .marquee-inner {
    display: inline-block;
    white-space: inherit;
    max-width: 100%;
  }

  [data-marquee="true"] {
    overflow: hidden !important;
    display: block !important;
    text-overflow: clip !important;
    -webkit-line-clamp: unset !important;
    text-align: left !important;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
  }

  [data-marquee-dragging="true"],
  [data-marquee-dragging="true"] * {
    cursor: grabbing !important;
  }

  /* Single marquee mode (infinite loop when only 1 element overflows) */
  [data-marquee="true"]:not([data-marquee-sequential="true"]) > .marquee-inner {
    max-width: none !important;
    will-change: transform, opacity;
    animation: yamp-marquee var(--yamp-marquee-duration, 8s) ease-in-out infinite;
  }

  /* Sequential marquee mode (when both elements overflow) */
  [data-marquee="true"][data-marquee-sequential="true"] > .marquee-inner {
    max-width: none !important;
    transform: translateX(0);
    opacity: 1;
  }

  [data-marquee="true"][data-marquee-sequential="true"][data-marquee-active="true"]
    > .marquee-inner {
    will-change: transform, opacity;
    animation: yamp-marquee var(--yamp-marquee-duration, 8s) ease-in-out 1;
  }

  [data-marquee-paused="true"] > .marquee-inner {
    animation-play-state: paused !important;
  }

  [data-marquee-manual="true"] > .marquee-inner {
    animation: none !important;
    max-width: none !important;
    will-change: transform;
  }

  @media (hover: hover) {
    [data-marquee="true"]:hover > .marquee-inner,
    .details:hover [data-marquee="true"] > .marquee-inner {
      animation-play-state: paused;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-marquee="true"] > .marquee-inner,
    [data-marquee="true"][data-marquee-active="true"] > .marquee-inner {
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }

  @keyframes yamp-marquee {
    0%,
    22% {
      transform: translateX(0);
      opacity: 1;
    }
    72%,
    88% {
      transform: translateX(var(--yamp-marquee-distance, 0px));
      opacity: 1;
    }
    93% {
      transform: translateX(var(--yamp-marquee-distance, 0px));
      opacity: 0;
    }
    96% {
      transform: translateX(0);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .track-options-row {
    display: flex;
    gap: 16px;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
  }

  .track-options-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    transition:
      opacity 0.2s,
      text-decoration 0.2s;
  }

  .track-options-btn ha-icon {
    --mdc-icon-size: 1.1rem;
    margin-top: -2px;
  }

  .track-options-close ha-icon {
    --mdc-icon-size: 1.3rem;
  }

  @media (hover: hover) {
    .track-options-btn:hover {
      opacity: 0.7;
      text-decoration: underline;
    }
  }

  .track-options-title {
    cursor: pointer;
    transition: text-decoration 0.2s;
  }

  @media (hover: hover) {
    .track-options-title:hover {
      text-decoration: underline;
    }
  }

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

  :host([data-details-alignment="center"]) .details {
    align-items: center;
    text-align: center;
  }

  :host([data-details-alignment="right"]) .details {
    align-items: flex-end;
    text-align: right;
  }

  :host([data-has-custom-height="true"]) .details {
    margin-top: calc(4px * var(--yamp-details-scale, 1));
    padding-bottom: calc(6px * var(--yamp-details-scale, 1));
    gap: calc(4px * var(--yamp-details-scale, 1));
  }

  :host([data-has-custom-height="true"]) .details .title {
    padding-top: calc(4px * var(--yamp-details-scale, 1));
  }

  :host([data-has-custom-height="true"]) .controls-row {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  :host([data-details-alignment="center"]) .track-options-row {
    justify-content: center;
  }

  :host([data-details-alignment="right"]) .track-options-row {
    justify-content: flex-end;
  }

  /* Light mode overrides */
  :host([data-appearance="light"]:not([data-match-theme="true"])) {
    ${lightModeVariables}
  }

  :host([data-appearance="light"]:not([data-match-theme="true"])) .source-dropdown {
    ${lightModeDropdown}
  }

  @media (prefers-color-scheme: light) {
    :host([data-appearance="automatic"]:not([data-match-theme="true"])) {
      ${lightModeVariables}
    }

    :host([data-appearance="automatic"]:not([data-match-theme="true"])) .source-dropdown {
      ${lightModeDropdown}
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
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
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
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: var(--yamp-artwork-position, top center);
    background-repeat: no-repeat;
    pointer-events: none;
    height: 100%;
  }

  .card-lower-fade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      rgba(0, 0, 0, 0.92) 100%
    );
  }

  .yamp-card-inner[data-lyrics-active="true"] .card-lower-fade,
  :host([data-disable-artwork-gradient="true"]) .card-lower-fade {
    display: none !important;
  }

  .card-lower-content {
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .yamp-card-inner[data-lyrics-active="true"] .card-lower-content {
    z-index: auto;
    pointer-events: none;
  }

  .yamp-card-inner[data-lyrics-active="true"] .card-artwork-spacer {
    pointer-events: none !important;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
  }

  .yamp-card-inner[data-lyrics-active="true"] .card-lower-content > :not(.card-artwork-spacer) {
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
    pointer-events: auto;
  }

  .yamp-card-inner[data-lyrics-active="true"]
    .card-lower-content
    > :not(.card-artwork-spacer):not(.in-menu-active-label):not(.more-info-menu):not(
      .collapsed-artwork-container
    ):not(.collapsed-progress-bar) {
    position: relative;
  }

  .yamp-card-inner[data-lyrics-active="true"] .in-menu-active-label,
  .yamp-card-inner[data-lyrics-active="true"] .more-info-menu.volume-collapsed,
  .yamp-card-inner[data-lyrics-active="true"] .collapsed-artwork-container,
  .yamp-card-inner[data-lyrics-active="true"] .collapsed-progress-bar {
    position: absolute !important;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
  }

  .yamp-card-inner[data-lyrics-active="true"] .in-menu-active-label,
  .yamp-card-inner[data-lyrics-active="true"] .collapsed-progress-bar {
    pointer-events: none !important;
  }

  .card-lower-content.transitioning .details,
  .card-lower-content.transitioning .card-artwork-spacer {
    transition: opacity 0.3s;
  }

  .card-lower-content.collapsed.has-artwork .details {
    opacity: 1;
    pointer-events: auto;
    margin-right: var(--yamp-collapsed-details-offset, 120px);
    transition: margin var(--transition-normal);
  }

  @media (max-width: 420px) {
    .card-lower-content.collapsed.has-artwork .details {
      margin-right: var(--yamp-collapsed-details-offset, 74px);
    }
  }

  .card-lower-content.collapsed .card-artwork-spacer {
    opacity: 0;
    pointer-events: none;
  }

  .card-lower-content.collapsed .card-artwork-spacer.show-placeholder {
    opacity: 1;
    pointer-events: auto;
  }

  :host([data-has-custom-height="true"]) .card-lower-content.collapsed {
    justify-content: center;
  }

  :host([data-has-custom-height="true"])
    .card-lower-content.collapsed
    .card-artwork-spacer:not(.show-placeholder) {
    flex: 0 0 0;
    min-height: 0;
  }

  .collapsed-flex-spacer {
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
  }

  .card-lower-content .source-menu-btn,
  .card-lower-content .source-selected,
  .details,
  .title,
  .artist,
  .controls-row,
  .button,
  .vol-stepper span,
  .vol-label {
    color: #fff;
  }

  /* Custom font color, Lyrics mode & Scaled Contain Alternate mode - use custom or theme colors */
  .yamp-card-inner[data-has-font-color="true"] .details,
  .yamp-card-inner[data-has-font-color="true"] .title,
  .yamp-card-inner[data-has-font-color="true"] .artist,
  .yamp-card-inner[data-has-font-color="true"] .source-menu-btn,
  .yamp-card-inner[data-has-font-color="true"] .source-selected,
  .yamp-card-inner[data-has-font-color="true"] .controls-row,
  .yamp-card-inner[data-has-font-color="true"] .button,
  .yamp-card-inner[data-has-font-color="true"] .modern-button,
  .yamp-card-inner[data-has-font-color="true"] .vol-stepper span,
  .yamp-card-inner[data-has-font-color="true"] .vol-label,
  .yamp-card-inner[data-has-font-color="true"] .more-info-btn ha-icon,
  .yamp-card-inner[data-has-font-color="true"] .volume-icon-btn,
  .yamp-card-inner[data-has-font-color="true"] .volume-icon-btn ha-icon,
  .yamp-card-inner[data-has-font-color="true"] .radio-mode-button,
  .yamp-card-inner[data-has-font-color="true"] .volume-slider-icon,
  .yamp-card-inner[data-has-font-color="true"] .timestamps-container,
  .yamp-card-inner[data-lyrics-active="true"] .details,
  .yamp-card-inner[data-lyrics-active="true"] .title,
  .yamp-card-inner[data-lyrics-active="true"] .artist,
  .yamp-card-inner[data-lyrics-active="true"] .source-menu-btn,
  .yamp-card-inner[data-lyrics-active="true"] .source-selected,
  .yamp-card-inner[data-lyrics-active="true"] .controls-row,
  .yamp-card-inner[data-lyrics-active="true"] .button,
  .yamp-card-inner[data-lyrics-active="true"] .modern-button,
  .yamp-card-inner[data-lyrics-active="true"] .vol-stepper span,
  .yamp-card-inner[data-lyrics-active="true"] .vol-label,
  .yamp-card-inner[data-lyrics-active="true"] .more-info-btn ha-icon,
  .yamp-card-inner[data-lyrics-active="true"] .volume-icon-btn,
  .yamp-card-inner[data-lyrics-active="true"] .volume-icon-btn ha-icon,
  .yamp-card-inner[data-lyrics-active="true"] .radio-mode-button,
  .yamp-card-inner[data-lyrics-active="true"] .volume-slider-icon,
  .yamp-card-inner[data-lyrics-active="true"] .timestamps-container,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .details,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .title,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .artist,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .source-menu-btn,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .source-selected,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .controls-row,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .button,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-stepper span,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-label,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .more-info-btn ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .volume-icon-btn,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .volume-icon-btn ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .radio-mode-button,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .volume-slider-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .timestamps-container {
    color: var(--primary-text);
  }

  .yamp-card-inner[data-has-font-color="true"] .modern-button,
  .yamp-card-inner[data-lyrics-active="true"] .modern-button,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button {
    background: color-mix(in srgb, var(--primary-text), transparent 85%);
    box-shadow: none; /* Cleaner look on card background */
  }

  .card-lower-content.collapsed .details .title,
  .card-lower-content.collapsed .title {
    font-size: calc(1.1em * var(--yamp-collapsed-title-scale, 1));
    line-height: calc(1.2 * var(--yamp-collapsed-title-scale, 1));
  }

  .card-lower-content.collapsed .artist {
    font-size: calc(1em * var(--yamp-collapsed-artist-scale, 1));
  }

  /* Media artwork placeholder */
  .media-artwork-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(96px, 50%, 184px);
    aspect-ratio: 1;
  }

  .media-artwork-placeholder svg {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.85;
    pointer-events: none;
  }

  /* Collapsed artwork */
  .card-lower-content.collapsed .collapsed-artwork-container {
    position: absolute;
    top: 16px;
    right: 6px;
    width: calc(var(--yamp-collapsed-artwork-size, 102px) + 8px);
    height: calc(100% - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
    background: transparent;
    pointer-events: none;
    box-shadow: none;
    padding: 0;
    transition:
      background var(--transition-slow),
      width var(--transition-normal);
  }

  :host([data-has-custom-height="true"])
    .card-lower-content.collapsed
    .collapsed-artwork-container {
    align-items: center;
    top: 0;
    /* Clearance dynamically accounts for controls-row (~44px) + volume-row (~46px) + padding (~10px) */
    height: calc(100% - var(--yamp-collapsed-artwork-clearance, 100px));
  }

  .card-lower-content.collapsed .collapsed-artwork {
    width: var(--yamp-collapsed-artwork-size, 102px);
    height: var(--yamp-collapsed-artwork-size, 102px);
    border-radius: 16px;
    object-fit: var(--yamp-artwork-fit, cover);
    background: transparent;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.22);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 2px;
    transition:
      width var(--transition-normal),
      height var(--transition-normal);
  }

  .card-lower-content.collapsed.has-artwork .controls-row {
    max-width: calc(100% - var(--yamp-collapsed-controls-offset, 120px));
    margin-right: max(calc(var(--yamp-collapsed-controls-offset, 120px) - 5px), 0px);
    width: auto;
  }

  :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
    max-width: calc(100% - var(--yamp-collapsed-controls-offset, 120px));
    margin-right: max(calc(var(--yamp-collapsed-controls-offset, 120px) - 5px), 0px);
  }

  /* Medium screens */
  @media (max-width: 600px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 115px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 115px) - 5px), 0px);
      width: auto;
    }

    :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 115px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 115px) - 5px), 0px);
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      right: 4px;
      top: 14px;
    }
  }

  /* Small screens */
  @media (max-width: 420px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 90px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 90px) - 5px), 0px);
      width: auto;
    }

    :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 90px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 90px) - 5px), 0px);
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      right: 3px;
      top: 12px;
    }
  }

  /* Very small screens */
  @media (max-width: 320px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 80px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 80px) - 5px), 0px);
      width: auto;
    }

    :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 80px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 80px) - 5px), 0px);
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      right: 2px;
      top: 10px;
    }
  }

  /* ============================================
     Card Trigger Gesture Feedback Animations
     ============================================ */

  /* Base container for gesture feedback - positioned relative to tap area */
  .gesture-feedback-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
  }

  /* Base styles for ripple effect */
  .gesture-ripple {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }

  /* Tap: Quick expanding ripple */
  @keyframes gestureTapRipple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  .gesture-ripple.tap {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
    animation: gestureTapRipple 0.4s ease-out forwards;
  }

  /* Double-tap: Two rapid pulses */
  @keyframes gestureDoubleTapRipple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.5;
    }
    25% {
      transform: translate(-50%, -50%) scale(0.6);
      opacity: 0.3;
    }
    50% {
      transform: translate(-50%, -50%) scale(0.3);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  .gesture-ripple.double_tap {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
    animation: gestureDoubleTapRipple 0.5s ease-out forwards;
  }

  /* Hold: Slower glowing pulse */
  @keyframes gestureHoldPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.2);
      opacity: 0;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    30% {
      opacity: 0.5;
      box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.2);
    }
    100% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0;
      box-shadow: 0 0 40px 20px rgba(255, 255, 255, 0);
    }
  }

  .gesture-ripple.hold {
    width: 100px;
    height: 100px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.2) 40%,
      rgba(255, 255, 255, 0) 70%
    );
    animation: gestureHoldPulse 0.6s ease-out forwards;
  }

  /* Swipe Left: Arrow sweeping left */
  @keyframes gestureSwipeLeft {
    0% {
      transform: translate(0%, -50%) scaleX(0);
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translate(-100%, -50%) scaleX(1);
      opacity: 0;
    }
  }

  .gesture-ripple.swipe_left {
    width: 120px;
    height: 60px;
    border-radius: 30px;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.8) 100%
    );
    animation: gestureSwipeLeft 0.35s ease-out forwards;
    transform-origin: right center;
  }

  /* Swipe Right: Arrow sweeping right */
  @keyframes gestureSwipeRight {
    0% {
      transform: translate(0%, -50%) scaleX(0);
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translate(100%, -50%) scaleX(1);
      opacity: 0;
    }
  }

  .gesture-ripple.swipe_right {
    width: 120px;
    height: 60px;
    border-radius: 30px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.8) 100%
    );
    animation: gestureSwipeRight 0.35s ease-out forwards;
    transform-origin: left center;
  }
  /* Consolidated scrollbar hiding for Webkit browsers */
  .chip-row::-webkit-scrollbar,
  .action-chip-row::-webkit-scrollbar,
  .entity-options-container::-webkit-scrollbar,
  .entity-options-chips-strip::-webkit-scrollbar,
  .entity-options-sheet::-webkit-scrollbar,
  .group-list-scroll::-webkit-scrollbar,
  .source-list-scroll::-webkit-scrollbar,
  .floating-source-index::-webkit-scrollbar,
  .search-row-slide-out::-webkit-scrollbar,
  .entity-options-scroll::-webkit-scrollbar,
  .entity-options-sheet .entity-options-search-results::-webkit-scrollbar,
  .entity-options-resolved-entities-list::-webkit-scrollbar,
  .search-sheet-results::-webkit-scrollbar,
  .lyrics-scroll-container::-webkit-scrollbar {
    display: none;
  }

  /* Compact mode overrides for constrained heights */
  .yamp-card-inner.compact-collapsed .chip-row {
    padding-top: 0;
    padding-bottom: 4px;
  }
  .yamp-card-inner.compact-collapsed .action-chip-row {
    padding-bottom: 0;
    margin-bottom: -12px;
  }
  .yamp-card-inner.compact-collapsed .details {
    padding-left: 12px;
    padding-right: 12px;
    padding-bottom: 2px;
    margin-top: -12px;
    min-height: 0;
    gap: 1px;
  }
  .yamp-card-inner.compact-collapsed .controls-row {
    padding-top: 1px;
    padding-bottom: 1px;
    gap: 4px;
  }
  .yamp-card-inner.compact-collapsed .volume-row {
    padding-bottom: 4px;
  }
  .yamp-card-inner.compact-collapsed .collapsed-artwork-container {
    top: -12px;
  }

  .yamp-card-inner.compact-collapsed .modern-button.primary {
    width: 52px;
    height: 52px;
  }
  .yamp-card-inner.compact-collapsed .modern-button.medium {
    width: 38px;
    height: 38px;
  }
  .yamp-card-inner.compact-collapsed .modern-button.small {
    width: 34px;
    height: 34px;
  }
`;
