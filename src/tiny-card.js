import { html, nothing } from "lit";
import { renderChipRow } from "./chip-row.js";
import { renderProgressBar } from "./progress-bar.js";
import { getVolumeIconForPercent } from "./controllers/volume-hold-controller.js";
import { localize } from "./localize/localize.js";
import { isValidArtworkUrl } from "./yamp-utils.js";
import { SUPPORT_NEXT_TRACK, SUPPORT_STOP, DEFAULT_PROGRESS_BAR_HEIGHT } from "./constants.js";

/**
 * Render square artwork thumbnail or equalizer SVG fallback for tiny mode.
 * @param {string | null} validArtUrl
 * @param {boolean} matchTheme
 * @param {boolean} hasArtworkOrCardBg
 * @returns {import("lit").TemplateResult}
 */
function renderTinyArtworkContent(validArtUrl, matchTheme, hasArtworkOrCardBg) {
  if (validArtUrl) {
    return html`<img
      class="tiny-artwork"
      src="${validArtUrl}"
      onerror="this.style.display='none'"
    />`;
  }
  const placeholderColor = hasArtworkOrCardBg
    ? matchTheme
      ? "color:#fff;"
      : "color: var(--custom-accent, #ff9800);"
    : "color: var(--custom-accent, var(--primary-text, #ff9800));";

  return html`
    <div class="tiny-artwork-placeholder">
      <svg viewBox="0 0 184 184" style="${placeholderColor}" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"></rect>
        <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"></rect>
        <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"></rect>
        <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"></rect>
      </svg>
    </div>
  `;
}

/**
 * Render an interactive container for tiny mode artwork or track details without
 * duplicating markup between chip-overlay toggle mode and tap-gesture mode.
 * @param {Object} params
 * @param {string} params.className
 * @param {boolean} params.useChipOverlayTap
 * @param {Function} params.onToggleChipOverlay
 * @param {Function} params.onPointerDown
 * @param {Function} params.onPointerMove
 * @param {Function} params.onPointerUp
 * @param {Function} params.onPointerCancel
 * @param {string} params.gestureStyles
 * @param {import("lit").TemplateResult} params.content
 * @returns {import("lit").TemplateResult}
 */
function renderTinyTapTarget({
  className,
  useChipOverlayTap,
  onToggleChipOverlay,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  gestureStyles,
  content,
}) {
  return html`
    <div
      class="${className}"
      @click=${
        useChipOverlayTap
          ? (/** @type {Event} */ e) => {
              e.stopPropagation();
              onToggleChipOverlay();
            }
          : nothing
      }
      @pointerdown=${!useChipOverlayTap ? onPointerDown : nothing}
      @pointermove=${!useChipOverlayTap ? onPointerMove : nothing}
      @pointerup=${!useChipOverlayTap ? onPointerUp : nothing}
      @pointercancel=${!useChipOverlayTap ? onPointerCancel : nothing}
      style=${!useChipOverlayTap && gestureStyles ? gestureStyles : nothing}
    >
      ${content}
    </div>
  `;
}

/**
 * Render tiny mode playback controls (play/pause/stop, next, and multi-entity players toggle).
 * @param {Object} params
 * @returns {import("lit").TemplateResult}
 */
function renderTinyControls({
  currentHiddenControls,
  isPlaying,
  primaryUsesStop,
  playPauseTitle,
  canShowNext,
  hasMultipleEntities,
  tinyChipOverlayOpen,
  onControlClick,
  onToggleChipOverlay,
}) {
  const nextTitle = localize("card.media_controls.next") || "Next track";
  const playersTitle = localize("card.menu.players") || "Players";

  return html`
    <div class="tiny-controls">
      ${
        !currentHiddenControls.play_pause
          ? html`
              <button
                type="button"
                class="tiny-control-btn tiny-play-btn${isPlaying ? " active" : ""}"
                @click=${(/** @type {Event} */ e) => {
                  e.stopPropagation();
                  onControlClick(primaryUsesStop ? "stop" : "play_pause");
                }}
                aria-label=${playPauseTitle}
                title=${playPauseTitle}
              >
                <ha-icon
                  .icon=${primaryUsesStop ? "mdi:stop" : isPlaying ? "mdi:pause" : "mdi:play"}
                ></ha-icon>
              </button>
            `
          : nothing
      }
      ${
        canShowNext
          ? html`
              <button
                type="button"
                class="tiny-control-btn tiny-next-btn"
                @click=${(/** @type {Event} */ e) => {
                  e.stopPropagation();
                  onControlClick("next");
                }}
                aria-label=${nextTitle}
                title=${nextTitle}
              >
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </button>
            `
          : nothing
      }
      ${
        hasMultipleEntities
          ? html`
              <button
                type="button"
                class="tiny-control-btn tiny-players-btn${tinyChipOverlayOpen ? " active" : ""}"
                @click=${(/** @type {Event} */ e) => {
                  e.stopPropagation();
                  onToggleChipOverlay();
                }}
                aria-label=${playersTitle}
                title=${playersTitle}
              >
                <ha-icon icon="mdi:speaker-multiple"></ha-icon>
              </button>
            `
          : nothing
      }
    </div>
  `;
}

/**
 * Render tiny mode volume step and hold-to-volume overlays when active.
 * @param {Object} params
 * @returns {import("lit").TemplateResult | typeof nothing}
 */
function renderTinyVolumeOverlays({
  volumeOverlayActive,
  volumeOverlayIcon,
  volumeOverlayValue,
  dismissVolumeOverlay,
  volumeHoldController,
  currentVolumeStateObj,
}) {
  const stepOverlay = volumeOverlayActive
    ? html`
        <div class="volume-overlay" @click=${dismissVolumeOverlay}>
          <ha-icon icon=${volumeOverlayIcon}></ha-icon>
          <span class="volume-overlay-text">${volumeOverlayValue}%</span>
        </div>
      `
    : nothing;

  const holdOverlay =
    volumeHoldController?.active || volumeHoldController?.releasing
      ? (() => {
          const pct = Math.round(volumeHoldController.value * 100);
          const muted = currentVolumeStateObj?.attributes?.is_volume_muted === true;
          return html`
            <div
              class="volume-overlay volume-hold-overlay ${
                volumeHoldController.releasing ? "releasing" : ""
              }"
              style="--yamp-volume-hold-level: ${pct}%"
            >
              <div class="volume-hold-fill"></div>
              <ha-icon icon=${getVolumeIconForPercent(pct, muted)}></ha-icon>
              <span class="volume-overlay-text">${pct}%</span>
            </div>
          `;
        })()
      : nothing;

  return html`${stepOverlay}${holdOverlay}`;
}

/**
 * Render the auto-dismissing horizontal player chip overlay for multi-entity tiny cards.
 * @param {Object} params
 * @returns {import("lit").TemplateResult | typeof nothing}
 */
function renderTinyChipOverlay({ chipRowProps, onClose }) {
  const closeTitle = localize("common.close") || "Close";
  return html`
    <div class="tiny-chip-overlay" @click=${(/** @type {Event} */ e) => e.stopPropagation()}>
      <div class="chip-row tiny-chip-row">${renderChipRow(chipRowProps)}</div>
      <button
        type="button"
        class="tiny-overlay-close-btn"
        @click=${(/** @type {Event} */ e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label=${closeTitle}
        title=${closeTitle}
      >
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
  `;
}

/**
 * Render the single-row Tiny Mode card layout.
 * @param {any} params
 * @returns {import("lit").TemplateResult}
 */
export function renderTinyCard({
  config,
  customCardHeight,
  hasCustomCardHeight,
  backgroundFade,
  hasFontColor,
  cardFontColor,
  activeArtworkFit,
  hasCardBg,
  cardBgStyle,
  isDirectColorOrGradient,
  artworkUrl,
  idleImageUrl,
  sharedBackgroundStyle,
  shouldDimIdle,
  playbackStateObj,
  isPlaying,
  shouldShowDetails,
  title,
  artist,
  showAlbum,
  album,
  activeChipName,
  currentHiddenControls,
  progress,
  duration,
  hasMultipleEntities,
  tapAction,
  artworkGradientDisabled,
  isIdle,
  controlLayout,
  swapPauseForStop,
  tinyChipOverlayOpen,
  supportsFeature,
  chipRowProps,
  volumeOverlayActive,
  volumeOverlayIcon,
  volumeOverlayValue,
  dismissVolumeOverlay,
  volumeHoldController,
  currentVolumeStateObj,
  gestureHandlers,
  gestureStyles,
  onToggleChipOverlay,
  onCloseChipOverlay,
  onControlClick,
}) {
  const hasArtworkOrCardBg = !!(
    hasCardBg ||
    ((artworkUrl || idleImageUrl) && activeArtworkFit !== "no_artwork")
  );
  const artSrc = artworkUrl || idleImageUrl;
  const validArtUrl = artSrc && isValidArtworkUrl(artSrc) ? artSrc : null;

  const canShowStop = supportsFeature(playbackStateObj, SUPPORT_STOP);
  const swapPauseWithStop = controlLayout === "modern" && swapPauseForStop && canShowStop;
  const isPlayingState = playbackStateObj?.state === "playing" || isPlaying;
  const primaryUsesStop = swapPauseWithStop && isPlayingState;
  const playPauseTitle = primaryUsesStop
    ? localize("card.media_controls.stop") || "Stop"
    : isPlaying
      ? localize("card.media_controls.pause") || "Pause"
      : localize("card.media_controls.play") || "Play";

  const subtitleText = artist || (showAlbum ? album : "");
  const shouldRenderSubtitle = shouldShowDetails && !!subtitleText;
  const hideArtwork = config.hide_collapsed_artwork === true || activeArtworkFit === "no_artwork";
  const useChipOverlayTap = hasMultipleEntities && !tapAction;
  const canShowNext =
    !currentHiddenControls.next &&
    (supportsFeature(playbackStateObj, SUPPORT_NEXT_TRACK) || !isPlaying);

  const backgroundLayer = hasCardBg
    ? html`
        <div class="card-background-image-layer" style="${cardBgStyle}"></div>
        ${
          !artworkGradientDisabled && !isDirectColorOrGradient
            ? html`<div class="card-background-image-overlay"></div>`
            : nothing
        }
      `
    : (artworkUrl || idleImageUrl) && activeArtworkFit !== "no_artwork"
      ? html`
          <div class="card-lower-content-bg" style="${sharedBackgroundStyle}"></div>
          ${
            !artworkGradientDisabled && !isIdle
              ? html`<div class="card-lower-fade"></div>`
              : nothing
          }
        `
      : nothing;

  const detailsContent = html`
    <div class="tiny-title">${shouldShowDetails && title ? title : activeChipName || "\u00A0"}</div>
    ${shouldRenderSubtitle ? html`<div class="tiny-subtitle">${subtitleText}</div>` : nothing}
  `;

  return html`
    <ha-card
      class="yamp-card tiny-mode-card"
      style=${
        [
          hasCustomCardHeight ? `height:${customCardHeight}px;` : null,
          `--yamp-background-fade: ${backgroundFade}%`,
        ]
          .filter(Boolean)
          .join("; ") || nothing
      }
    >
      <div
        class="yamp-card-inner tiny-mode ${shouldDimIdle ? "dim-idle" : ""} ${
          hasArtworkOrCardBg ? "has-artwork-bg" : "no-artwork-bg"
        } ${config.dim_chips_on_idle === false ? "no-chip-dim" : ""}"
        data-match-theme="${String(config.match_theme === true)}"
        data-has-font-color="${String(hasFontColor)}"
        data-artwork-fit="${activeArtworkFit}"
        data-has-background-image="${String(hasCardBg)}"
        style=${
          [
            hasCustomCardHeight ? `height:${customCardHeight}px;` : null,
            `--yamp-background-fade: ${backgroundFade}%`,
            `--yamp-overlay-bg: color-mix(in srgb, var(--yamp-overlay-base, #000) ${backgroundFade}%, transparent)`,
            hasFontColor
              ? `--primary-text: ${cardFontColor}; --primary-text-color: ${cardFontColor}; --secondary-text: ${cardFontColor}; --secondary-text-color: ${cardFontColor}; --yamp-icon-color: ${cardFontColor};`
              : null,
          ]
            .filter(Boolean)
            .join("; ") || nothing
        }
      >
        ${backgroundLayer}

        <div class="tiny-row">
          ${
            hideArtwork
              ? nothing
              : renderTinyTapTarget({
                  className: "tiny-artwork-container",
                  useChipOverlayTap,
                  onToggleChipOverlay,
                  ...gestureHandlers,
                  gestureStyles,
                  content: renderTinyArtworkContent(
                    validArtUrl,
                    config.match_theme === true,
                    hasArtworkOrCardBg
                  ),
                })
          }
          ${renderTinyTapTarget({
            className: "tiny-details",
            useChipOverlayTap,
            onToggleChipOverlay,
            ...gestureHandlers,
            gestureStyles,
            content: detailsContent,
          })}
          ${renderTinyControls({
            currentHiddenControls,
            isPlaying,
            primaryUsesStop,
            playPauseTitle,
            canShowNext,
            hasMultipleEntities,
            tinyChipOverlayOpen,
            onControlClick,
            onToggleChipOverlay,
          })}
        </div>

        ${
          isPlaying && duration && !tinyChipOverlayOpen
            ? renderProgressBar({
                progress,
                collapsed: true,
                customHeight: config.progress_bar_height ?? DEFAULT_PROGRESS_BAR_HEIGHT,
              })
            : nothing
        }
        ${renderTinyVolumeOverlays({
          volumeOverlayActive,
          volumeOverlayIcon,
          volumeOverlayValue,
          dismissVolumeOverlay,
          volumeHoldController,
          currentVolumeStateObj,
        })}
        ${
          tinyChipOverlayOpen && hasMultipleEntities
            ? renderTinyChipOverlay({
                chipRowProps,
                onClose: onCloseChipOverlay,
              })
            : nothing
        }
      </div>
    </ha-card>
  `;
}
