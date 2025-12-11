// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";

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
  duration = 0
}) {
  // Use `accent` for color, fallback to default if not set
  const barColor = accent || "var(--custom-accent, #ff9800)";
  // Collapsed bar is typically smaller and positioned differently
  if (collapsed) {
    return html`
      <div
        class="collapsed-progress-bar"
        style="width: ${progress * 100}%; background: ${barColor}; height: 4px; ${style}"
      ></div>
    `;
  }
  return html`
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        style="height:${height}px; background:rgba(255,255,255,0.22); ${style}"
        @click=${seekEnabled ? onSeek : null}
        title=${seekEnabled ? "Seek" : ""}
      >
        <div
          class="progress-inner"
          style="width: ${progress * 100}%; background: ${barColor}; height:${height}px;"
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