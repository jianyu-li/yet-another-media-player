// progress-bar.js
// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";

export function renderProgressBar({
  progress,
  seekEnabled,
  onSeek,
  collapsed,
  accent,
  height = 6,
  style = ""
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
    </div>
  `;
}