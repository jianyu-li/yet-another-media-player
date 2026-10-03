import { css } from "lit";
import { Z_LAYERS, BLUR_5, LYRICS_MASK_GRADIENT, HIDE_SCROLLBAR } from "./shared.js";

export const lyricsStyles = css`
  :host {
    display: block;
    position: absolute;
    inset: 0;
    z-index: ${Z_LAYERS.LYRICS_OVERLAY};
    overflow: hidden;
    pointer-events: auto;
    touch-action: pan-y;
    backdrop-filter: var(--yamp-lyrics-backdrop-filter, ${BLUR_5});
    -webkit-backdrop-filter: var(--yamp-lyrics-backdrop-filter, ${BLUR_5});
    background: var(
      --yamp-lyrics-bg,
      color-mix(in srgb, var(--yamp-overlay-base, #000) var(--yamp-lyrics-fade, 80%), transparent)
    );
    color: var(--yamp-lyrics-color, var(--primary-text-color, #fff));
  }

  .lyrics-scroll-container {
    position: absolute;
    top: var(--yamp-lyrics-top-offset, 0px);
    left: 0;
    right: 0;
    bottom: var(--yamp-lyrics-bottom-offset, 180px);
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 12px;
    padding-right: 12px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    overscroll-behavior-y: contain;
    mask-image: var(--yamp-lyrics-mask, ${LYRICS_MASK_GRADIENT});
    -webkit-mask-image: var(--yamp-lyrics-mask, ${LYRICS_MASK_GRADIENT});
    ${HIDE_SCROLLBAR}
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .scroll-spacer {
    flex: 0 0 50%;
    width: 100%;
    min-height: 50%;
    pointer-events: none;
  }

  .plain-scroll-spacer-top {
    flex: 0 0 24px;
    width: 100%;
    min-height: 24px;
    pointer-events: none;
  }

  .plain-scroll-spacer-bottom {
    flex: 0 0 32px;
    width: 100%;
    min-height: 32px;
    pointer-events: none;
  }

  .lyric-line {
    font-size: calc(var(--yamp-lyrics-font-size, 1.6rem) * var(--yamp-text-scale-lyrics, 1));
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 24px;
    opacity: 0.4;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    cursor: default;
    pointer-events: none;
    color: var(
      --yamp-lyrics-inactive-color,
      var(--secondary-text-color, var(--primary-text-color, #fff))
    );
    width: 100%;
    max-width: 95%;
    text-align: center;
  }

  .lyric-line.active {
    opacity: 1;
    color: var(
      --yamp-lyrics-active-color,
      var(--yamp-primary-color, var(--custom-accent, var(--accent-color, #ffffff)))
    );
    font-size: calc(
      var(--yamp-lyrics-active-font-size, var(--yamp-lyrics-font-size, 1.6rem)) *
        var(--yamp-text-scale-lyrics, 1)
    );
    text-shadow: var(--yamp-overlay-text-shadow, 0 2px 4px rgba(0, 0, 0, 0.5));
  }

  .lyric-line.scroll-mode {
    opacity: 1;
    filter: none;
    transform: none;
    margin-bottom: 18px;
  }

  .lyric-line.unsynced {
    font-size: calc(
      var(--yamp-lyrics-unsynced-font-size, 1.1rem) * var(--yamp-text-scale-lyrics, 1)
    );
    opacity: 0.8;
    margin-bottom: 12px;
    filter: none;
  }

  .lyric-line.is-instrumental {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 32px;
    filter: none;
  }

  .lyric-instrumental-text {
    font-size: calc(
      var(--yamp-lyrics-instrumental-font-size, 1.4rem) * var(--yamp-text-scale-lyrics, 1)
    );
    font-weight: 700;
    line-height: 1.3;
    opacity: 0.85;
    text-align: center;
    letter-spacing: 0.3px;
    text-shadow: var(--yamp-overlay-text-shadow, 0 2px 4px rgba(0, 0, 0, 0.5));
  }

  /* Playing indicator animation - equalizer bars within lyricsStyles */
  @keyframes chipPlayingBar1 {
    0%,
    100% {
      height: 3px;
    }
    50% {
      height: 10px;
    }
  }
  @keyframes chipPlayingBar2 {
    0%,
    100% {
      height: 5px;
    }
    50% {
      height: 12px;
    }
  }
  @keyframes chipPlayingBar3 {
    0%,
    100% {
      height: 4px;
    }
    50% {
      height: 8px;
    }
  }

  .lyrics-playing-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 24px;
    padding: 4px 8px;
    opacity: 0.4;
    transition:
      opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1),
      transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .lyrics-playing-indicator .bar {
    width: 4px;
    height: 6px;
    background: currentColor;
    border-radius: 2px;
    transition: height 0.3s ease;
  }

  .lyric-line.active .lyrics-playing-indicator {
    opacity: 1;
    transform: scale(1.15);
  }

  .lyric-line.active .lyrics-playing-indicator .bar:nth-child(1) {
    animation: chipPlayingBar1 0.8s ease-in-out 0s infinite;
  }

  .lyric-line.active .lyrics-playing-indicator .bar:nth-child(2) {
    animation: chipPlayingBar2 0.6s ease-in-out 0.15s infinite;
  }

  .lyric-line.active .lyrics-playing-indicator .bar:nth-child(3) {
    animation: chipPlayingBar3 0.7s ease-in-out 0.3s infinite;
  }

  :host([data-playing="false"]) .lyrics-playing-indicator .bar,
  .lyrics-playing-indicator.paused .bar {
    animation-play-state: paused !important;
  }

  .lyrics-loading,
  .lyrics-error,
  .lyrics-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
    color: var(
      --yamp-lyrics-status-color,
      var(--yamp-overlay-text-secondary, rgba(255, 255, 255, 0.8))
    );
    background: transparent;
    border-radius: inherit;
  }

  .lyrics-loading ha-circular-progress {
    margin-bottom: 12px;
    --md-sys-color-primary: var(--yamp-overlay-text, white);
  }

  .lyrics-error ha-icon,
  .lyrics-empty ha-icon {
    --mdc-icon-size: 40px;
    margin-bottom: 12px;
    opacity: 0.6;
  }

  .queue-ops-progress {
    background: var(--yamp-chip-bg, rgba(255, 255, 255, 0.15));
    color: var(--search-text-secondary, #666);
    border-radius: 10px;
    padding: 3px 8px;
    font-size: 10.5px;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    animation: queueOpsFadeIn 0.2s ease-out forwards;
  }
  @keyframes queueOpsFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.95;
    }
  }
`;
