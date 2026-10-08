import { css } from "lit";

export const Z_LAYERS = Object.freeze({
  MEDIA_BACKGROUND: 0,
  MEDIA_OVERLAY: 0,
  LYRICS_OVERLAY: 1,
  FLOATING_ELEMENT: 3,
  STICKY_CHIPS: 3,
  ACCENT_FOREGROUND: 3,
  FLOATING_CONTROLS: 3,
  OVERLAY_BASE: 4,
  MODAL_BACKDROP: 4,
  MODAL_TOAST: 4,
  SEARCH_SLIDE_OUT: 3,
  SEARCH_SUCCESS: 3,
  VOLUME_OVERLAY: 5,
});

export const LYRICS_MASK_GRADIENT = css`linear-gradient(to bottom, transparent 0px, black 30px, black calc(100% - 30px), transparent 100%)`;

export const HIDE_SCROLLBAR = css`
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const BLUR_5 = css`blur(5px)`;
export const BLUR_10 = css`blur(10px)`;
export const BLUR_20 = css`blur(20px)`;

export const CHIP_ROW_MASK = css`linear-gradient(to bottom, black 0%, black calc(100% - 12px), transparent 100%)`;

export const LINE_CLAMP_2 = css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

export const lightModeVariables = css`
  --card-bg: #fff;
  --primary-text: #222;
  --secondary-text: #666;
  --yamp-overlay-base: #fff;
  --yamp-overlay-bg: rgba(255, 255, 255, 0.95);
  --yamp-overlay-text: #222;
  --yamp-overlay-divider: rgba(0, 0, 0, 0.1);
  --yamp-icon-color: #444;
  --yamp-button-bg: rgba(0, 0, 0, 0.05);
  --yamp-button-border: rgba(0, 0, 0, 0.1);
  --yamp-overlay-text-secondary: rgba(0, 0, 0, 0.6);
  --yamp-chip-bg: rgba(255, 255, 255, 0.8);
  --yamp-chip-text: #222;
  --yamp-chip-border: rgba(0, 0, 0, 0.1);
  --yamp-grouped-card-bg: rgba(0, 0, 0, 0.04);
  --yamp-grouped-card-border: var(--yamp-overlay-divider, rgba(0, 0, 0, 0.1));
  --search-card-bg: rgba(0, 0, 0, 0.03);
  --search-text-secondary: #666;
  --search-thumb-placeholder-bg: rgba(0, 0, 0, 0.05);
  --search-thumb-placeholder-icon: rgba(0, 0, 0, 0.4);
  --search-success-text: #222;
  --search-input-bg: rgba(0, 0, 0, 0.05);
  --search-input-text: #222;
`;

export const lightModeDropdown = css`
  background: var(--card-bg, #fff);
  color: var(--primary-text, #222);
  border: 1px solid var(--yamp-overlay-divider, #bbb);
`;
