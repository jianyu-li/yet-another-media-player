import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import { LitElement, html, css, nothing } from "lit";

export function renderVolumeRow({
  isRemoteVolumeEntity,
  showSlider,
  vol,
  onVolumeDragStart,
  onVolumeDragEnd,
  onVolumeChange,
  onVolumeStep,
  moreInfoMenu,
}) {
  return html`
    <div class="volume-row">
      ${isRemoteVolumeEntity
        ? html`
            <div class="vol-stepper">
              <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
              <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
            </div>
          `
        : showSlider
        ? html`
            <input
              class="vol-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              .value=${vol}
              @mousedown=${onVolumeDragStart}
              @touchstart=${onVolumeDragStart}
              @change=${onVolumeChange}
              @mouseup=${onVolumeDragEnd}
              @touchend=${onVolumeDragEnd}
              title="Volume"
            />
          `
        : html`
            <div class="vol-stepper">
              <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
              <span>${Math.round(vol * 100)}%</span>
              <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
            </div>
          `
      }
      ${moreInfoMenu}
    </div>
  `;
}
