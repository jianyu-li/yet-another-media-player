// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";
import { localize } from "./localize/localize.js";

function formatTime(seconds) {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function renderProgressBar({
  progress,
  seekEnabled,
  onSeek,
  collapsed,
  accent,
  height = 6,
  style = "",
  displayTimestamps = false,
  currentTime = 0,
  duration = 0,
  largeMode = false
}) {
  // Use `accent` for color, fallback to default if not set
  const barColor = accent || "var(--custom-accent, #ff9800)";
  
  // Determine active height based on large mode
  const activeHeight = (largeMode && !collapsed) ? 24 : height;
  
  // Collapsed bar is typically smaller and positioned differently
  if (collapsed) {
    return html`
      <div
        class="collapsed-progress-bar${largeMode ? ' large-mode' : ''}"
        style="width: ${progress * 100}%; background: ${barColor}; height: ${largeMode ? '12px' : '4px'}; ${style}"
      ></div>
    `;
  }
  return html`
    <div class="progress-bar-container${largeMode ? ' large-mode' : ''}" style="${style}">
      <div
        class="progress-bar"
        style="height:${activeHeight}px; background:rgba(255,255,255,0.22);"
        @click=${seekEnabled ? onSeek : null}
        title=${seekEnabled ? localize('common.seek') : ""}
      >
        <div
          class="progress-inner"
          style="width: ${progress * 100}%; background: ${barColor}; height:${activeHeight}px;"
        ></div>
      </div>
      ${displayTimestamps ? html`
        <div class="timestamps-container">
           <span>${formatTime(currentTime)}</span>
           <span>-${formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      ` : nothing}
    </div>
  `;
}