// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";
import { localize } from "./localize/localize.js";
import { DEFAULT_PROGRESS_BAR_HEIGHT } from "./constants.js";

/**
 * Formats a duration in seconds into a human-readable time string.
 * Uses 'h:mm:ss' format when duration is an hour or longer, or when seconds exceed an hour.
 * Otherwise uses standard 'm:ss' format.
 *
 * @param {number} seconds - The time in seconds to format.
 * @param {boolean|number} [showHoursOrDuration=false] - If boolean true or a duration >= 3600, forces hours display ('h:mm:ss').
 * @returns {string} Formatted time string (e.g. "1:05", "1:01:05", "0:01:05").
 */
export function formatTime(seconds, showHoursOrDuration = false) {
  const forceHours =
    typeof showHoursOrDuration === "boolean"
      ? showHoursOrDuration
      : Boolean(showHoursOrDuration && Number(showHoursOrDuration) >= 3600);

  if (seconds === undefined || seconds === null || !Number.isFinite(Number(seconds))) {
    return forceHours ? "0:00:00" : "0:00";
  }
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0 || forceHours) {
    return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  }
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
        style="width: ${
          progress * 100
        }%; background: ${barColor}; height: ${activeHeight}px; ${dynamicStyles} ${style}"
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
      ${
        displayTimestamps
          ? html`
              <div class="timestamps-container">
                <span>${formatTime(currentTime, duration)}</span>
                <span>-${formatTime(Math.max(0, duration - currentTime), duration)}</span>
              </div>
            `
          : nothing
      }
    </div>
  `;
}
