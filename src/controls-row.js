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

  return html`
    <div class="controls-row">
      ${!hiddenControls.previous && supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK) ? html`
        <button class="button" @click=${() => onControlClick("prev")} title="Previous">
          <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
        </button>
      ` : nothing}
      ${!hiddenControls.play_pause && (supportsFeature(stateObj, SUPPORT_PAUSE) || supportsFeature(stateObj, SUPPORT_PLAY)) ? html`
        <button class="button" @click=${() => onControlClick("play_pause")} title="Play/Pause">
          <ha-icon .icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
        </button>
      ` : nothing}
      ${!hiddenControls.stop && showStop ? html`
        <button class="button" @click=${() => onControlClick("stop")} title="Stop">
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
      ` : nothing}
      ${!hiddenControls.next && supportsFeature(stateObj, SUPPORT_NEXT_TRACK) ? html`
        <button class="button" @click=${() => onControlClick("next")} title="Next">
          <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
        </button>
      ` : nothing}
      ${!hiddenControls.shuffle && supportsFeature(stateObj, SUPPORT_SHUFFLE) ? html`
        <button class="button${shuffleActive ? ' active' : ''}" @click=${() => onControlClick("shuffle")} title="Shuffle">
          <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
        </button>
      ` : nothing}
      ${!hiddenControls.repeat && supportsFeature(stateObj, SUPPORT_REPEAT_SET) ? html`
        <button class="button${repeatActive ? ' active' : ''}" @click=${() => onControlClick("repeat")} title="Repeat">
          <ha-icon .icon=${
            stateObj.attributes.repeat === "one"
              ? "mdi:repeat-once"
              : "mdi:repeat"
          }></ha-icon>
        </button>
      ` : nothing}
      ${!hiddenControls.favorite && showFavorite ? html`
        <button class="button${favoriteActive ? ' active' : ''}" @click=${() => onControlClick("favorite")} title="Favorite">
          <ha-icon .icon=${favoriteActive ? "mdi:heart" : "mdi:heart-outline"}></ha-icon>
        </button>
      ` : nothing}
      ${
        !hiddenControls.power && (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON))
          ? html`
            <button
              class="button${stateObj.state !== "off" ? " active" : ""}"
              @click=${() => onControlClick("power")}
              title="Power"
            >
              <ha-icon .icon=${"mdi:power"}></ha-icon>
            </button>
          `
          : nothing
      }
    </div>
  `;
}

// Export a small helper used by the card for layout decisions
export function countMainControls(stateObj, supportsFeature, showFavorite = false, hiddenControls = {}, showStop = false) {
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_SHUFFLE = 32768;
  const SUPPORT_REPEAT_SET = 262144;
  const SUPPORT_TURN_ON = 128;
  const SUPPORT_TURN_OFF = 256;

  let count = 0;
  if (!hiddenControls.previous && supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK)) count++;
  if (!hiddenControls.play_pause) count++; // play/pause button always present if row exists
  if (!hiddenControls.stop && showStop) count++;
  if (!hiddenControls.next && supportsFeature(stateObj, SUPPORT_NEXT_TRACK)) count++;
  if (!hiddenControls.shuffle && supportsFeature(stateObj, SUPPORT_SHUFFLE)) count++;
  if (!hiddenControls.repeat && supportsFeature(stateObj, SUPPORT_REPEAT_SET)) count++;
  if (!hiddenControls.favorite && showFavorite) count++; // favorite button
  if (!hiddenControls.power && (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON))) count++;
  return count;
}