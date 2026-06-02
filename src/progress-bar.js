// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";
import { localize } from "./localize/localize.js";
import { DEFAULT_PROGRESS_BAR_HEIGHT } from "./constants.js";

function formatTime(seconds) {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function renderProgressBar({
  progress,
  seekEnabled,
  onSeek,
  collapsed,
  accent,
  height = DEFAULT_PROGRESS_BAR_HEIGHT,
  style = "",
  displayTimestamps = false,
  currentTime = 0,
  duration = 0,
  customHeight = DEFAULT_PROGRESS_BAR_HEIGHT,
}) {
  // Use `accent` for color, fallback to default if not set
  const barColor = accent || "var(--custom-accent, #ff9800)";

  // Determine active height and derived styles
  const activeHeight = collapsed
    ? Math.min(customHeight, Math.max(4, Math.floor(customHeight / 2)))
    : customHeight;
  const progressRadius = Math.min(6, activeHeight / 2);
  const timestampSize = Math.max(10, Math.min(24, Math.floor(activeHeight * 0.6 + 6)));
  const dynamicStyles = `--progress-radius: ${progressRadius}px; --timestamp-size: ${timestampSize}px;`;

  // Collapsed bar is typically smaller and positioned differently
  if (collapsed) {
    return html`
      <div
        class="collapsed-progress-bar"
        style="width: ${progress *
        100}%; background: ${barColor}; height: ${activeHeight}px; ${dynamicStyles} ${style}"
      ></div>
    `;
  }
  return html`
    <div class="progress-bar-container" style="${dynamicStyles} ${style}">
      <div
        class="progress-bar"
        style="height:${activeHeight}px;"
        @click=${seekEnabled ? onSeek : null}
        title=${seekEnabled ? localize("common.seek") : ""}
      >
        <div
          class="progress-inner"
          style="width: ${progress * 100}%; background: ${barColor};"
        ></div>
      </div>
      ${displayTimestamps
        ? html`
            <div class="timestamps-container">
              <span>${formatTime(currentTime)}</span>
              <span>-${formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          `
        : nothing}
    </div>
  `;
}
