// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";

export function renderControlsRow({
  stateObj,
  showStop,
  shuffleActive,
  repeatActive,
  onControlClick,
  supportsFeature,
  showFavorite,
  favoriteActive,
  hiddenControls = {},
  adaptiveControls = false,
  controlLayout = "classic",
}) {
  if (!stateObj) return nothing;

  // NOTE: If any new controls are added or removed here, the dropdown options 
  // in src/yamp-editor.js must also be updated to match, and the README.md
  // documentation in the "Available Control Names" section should be updated.
  


  const SUPPORT_PAUSE = 1;
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_STOP = 4096;
  const SUPPORT_SHUFFLE = 32768;
  const SUPPORT_REPEAT_SET = 262144;
  const SUPPORT_TURN_ON = 128;
  const SUPPORT_TURN_OFF = 256;
  const SUPPORT_PLAY = 16384;

  const normalizedLayout = controlLayout === "modern" ? "modern" : "classic";

  let showPrevious = !hiddenControls.previous && supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK);
  let showPlayPause = !hiddenControls.play_pause && (supportsFeature(stateObj, SUPPORT_PAUSE) || supportsFeature(stateObj, SUPPORT_PLAY));
  let showStopButton = !hiddenControls.stop && showStop;
  let showNext = !hiddenControls.next && supportsFeature(stateObj, SUPPORT_NEXT_TRACK);
  let showShuffleButton = !hiddenControls.shuffle && supportsFeature(stateObj, SUPPORT_SHUFFLE);
  let showRepeatButton = !hiddenControls.repeat && supportsFeature(stateObj, SUPPORT_REPEAT_SET);
  let showFavoriteButton = !hiddenControls.favorite && showFavorite;
  let showPowerButton = !hiddenControls.power && (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON));

  if (normalizedLayout === "modern") {
    showStopButton = false;
    showFavoriteButton = false;
    showPowerButton = false;
  }

  const controlCount = countMainControls(
    stateObj,
    supportsFeature,
    showFavorite,
    hiddenControls,
    showStop,
    normalizedLayout
  );

  const baseRowClass = adaptiveControls ? "controls-row adaptive" : "controls-row";
  const rowClass = normalizedLayout === "modern" ? `${baseRowClass} modern` : baseRowClass;
  let rowStyle = adaptiveControls ? `--yamp-control-count:${Math.max(controlCount, 1)};` : nothing;

  if (adaptiveControls) {
    const sizing = (() => {
      if (controlCount <= 3) {
        return { icon: 56, minWidth: 78, maxWidth: 150, minHeight: 78, padding: 14, gap: 14 };
      }
      if (controlCount === 4) {
        return { icon: 48, minWidth: 68, maxWidth: 130, minHeight: 68, padding: 12, gap: 12 };
      }
      if (controlCount === 5) {
        return { icon: 42, minWidth: 58, maxWidth: 110, minHeight: 58, padding: 10, gap: 10 };
      }
      if (controlCount === 6) {
        return { icon: 36, minWidth: 50, maxWidth: 96, minHeight: 52, padding: 8, gap: 8 };
      }
      return { icon: 32, minWidth: 44, maxWidth: 88, minHeight: 48, padding: 6, gap: 6 };
    })();
    rowStyle += [
      `--yamp-control-gap:${sizing.gap}px`,
      `--yamp-control-min-width:${sizing.minWidth}px`,
      `--yamp-control-max-width:${sizing.maxWidth}px`,
      `--yamp-control-min-height:${sizing.minHeight}px`,
      `--yamp-control-padding:${sizing.padding}px`,
      `--yamp-control-icon-size:${sizing.icon}px`,
    ].join(";");
  }

  if (normalizedLayout === "modern") {
    return html`
      <div class=${rowClass} style=${rowStyle}>
        ${showShuffleButton ? html`
          <button class="modern-button small${shuffleActive ? " active" : ""}" @click=${() => onControlClick("shuffle")} title="Shuffle">
            <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
          </button>
        ` : nothing}
        ${showPrevious ? html`
          <button class="modern-button medium" @click=${() => onControlClick("prev")} title="Previous">
            <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
          </button>
        ` : nothing}
        ${showPlayPause ? html`
          <button class="modern-button primary${stateObj.state === "playing" ? " active" : ""}" @click=${() => onControlClick("play_pause")} title="Play/Pause">
            <ha-icon .icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
          </button>
        ` : nothing}
        ${showNext ? html`
          <button class="modern-button medium" @click=${() => onControlClick("next")} title="Next">
            <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
          </button>
        ` : nothing}
        ${showRepeatButton ? html`
          <button class="modern-button small${repeatActive ? " active" : ""}" @click=${() => onControlClick("repeat")} title="Repeat">
            <ha-icon .icon=${
              stateObj.attributes.repeat === "one"
                ? "mdi:repeat-once"
                : "mdi:repeat"
            }></ha-icon>
          </button>
        ` : nothing}
      </div>
    `;
  }

  return html`
    <div class=${rowClass} style=${rowStyle}>
      ${showPrevious ? html`
        <button class="button" @click=${() => onControlClick("prev")} title="Previous">
          <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
        </button>
      ` : nothing}
      ${showPlayPause ? html`
        <button class="button" @click=${() => onControlClick("play_pause")} title="Play/Pause">
          <ha-icon .icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
        </button>
      ` : nothing}
      ${showStopButton ? html`
        <button class="button" @click=${() => onControlClick("stop")} title="Stop">
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
      ` : nothing}
      ${showNext ? html`
        <button class="button" @click=${() => onControlClick("next")} title="Next">
          <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
        </button>
      ` : nothing}
      ${showShuffleButton ? html`
        <button class="button${shuffleActive ? ' active' : ''}" @click=${() => onControlClick("shuffle")} title="Shuffle">
          <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
        </button>
      ` : nothing}
      ${showRepeatButton ? html`
        <button class="button${repeatActive ? ' active' : ''}" @click=${() => onControlClick("repeat")} title="Repeat">
          <ha-icon .icon=${
            stateObj.attributes.repeat === "one"
              ? "mdi:repeat-once"
              : "mdi:repeat"
          }></ha-icon>
        </button>
      ` : nothing}
      ${showFavoriteButton ? html`
        <button class="button${favoriteActive ? ' active' : ''}" @click=${() => onControlClick("favorite")} title="Favorite">
          <ha-icon .icon=${favoriteActive ? "mdi:heart" : "mdi:heart-outline"}></ha-icon>
        </button>
      ` : nothing}
      ${showPowerButton ? html`
        <button
          class="button${stateObj.state !== "off" ? " active" : ""}"
          @click=${() => onControlClick("power")}
          title="Power"
        >
          <ha-icon .icon=${"mdi:power"}></ha-icon>
        </button>
      ` : nothing}
    </div>
  `;
}

// Export a small helper used by the card for layout decisions
export function countMainControls(stateObj, supportsFeature, showFavorite = false, hiddenControls = {}, showStop = false, controlLayout = "classic") {
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_SHUFFLE = 32768;
  const SUPPORT_REPEAT_SET = 262144;
  const SUPPORT_TURN_ON = 128;
  const SUPPORT_TURN_OFF = 256;

  const normalizedLayout = controlLayout === "modern" ? "modern" : "classic";

  let count = 0;
  if (!hiddenControls.previous && supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK)) count++;
  if (!hiddenControls.play_pause) count++; // play/pause button always present if row exists
  if (normalizedLayout !== "modern" && !hiddenControls.stop && showStop) count++;
  if (!hiddenControls.next && supportsFeature(stateObj, SUPPORT_NEXT_TRACK)) count++;
  if (!hiddenControls.shuffle && supportsFeature(stateObj, SUPPORT_SHUFFLE)) count++;
  if (!hiddenControls.repeat && supportsFeature(stateObj, SUPPORT_REPEAT_SET)) count++;
  if (normalizedLayout !== "modern" && !hiddenControls.favorite && showFavorite) count++; // favorite button
  if (normalizedLayout !== "modern" && !hiddenControls.power && (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON))) count++;
  return count;
}
