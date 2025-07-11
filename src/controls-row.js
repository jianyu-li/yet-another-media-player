import { LitElement, html, css, nothing } from "lit";

export function renderControlsRow({
  stateObj,
  showStop,
  shuffleActive,
  repeatActive,
  onControlClick,
  supportsFeature,
}) {
  if (!stateObj) return nothing;

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
      ${supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK) ? html`
        <button class="button" @click=${() => onControlClick("prev")} title="Previous">
          <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
        </button>
      ` : nothing}
      ${(supportsFeature(stateObj, SUPPORT_PAUSE) || supportsFeature(stateObj, SUPPORT_PLAY)) ? html`
        <button class="button" @click=${() => onControlClick("play_pause")} title="Play/Pause">
          <ha-icon .icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
        </button>
      ` : nothing}
      ${showStop ? html`
        <button class="button" @click=${() => onControlClick("stop")} title="Stop">
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
      ` : nothing}
      ${supportsFeature(stateObj, SUPPORT_NEXT_TRACK) ? html`
        <button class="button" @click=${() => onControlClick("next")} title="Next">
          <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
        </button>
      ` : nothing}
      ${supportsFeature(stateObj, SUPPORT_SHUFFLE) ? html`
        <button class="button${shuffleActive ? ' active' : ''}" @click=${() => onControlClick("shuffle")} title="Shuffle">
          <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
        </button>
      ` : nothing}
      ${supportsFeature(stateObj, SUPPORT_REPEAT_SET) ? html`
        <button class="button${repeatActive ? ' active' : ''}" @click=${() => onControlClick("repeat")} title="Repeat">
          <ha-icon .icon=${
            stateObj.attributes.repeat === "one"
              ? "mdi:repeat-once"
              : "mdi:repeat"
          }></ha-icon>
        </button>
      ` : nothing}
      ${
        (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON))
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