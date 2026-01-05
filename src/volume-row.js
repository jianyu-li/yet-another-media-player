// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";

export function renderVolumeRow({
  isRemoteVolumeEntity,
  showSlider,
  vol,
  isMuted,
  supportsMute,
  onVolumeDragStart,
  onVolumeDragEnd,
  onVolumeChange,
  onVolumeStep,
  onMuteToggle,
  moreInfoMenu,
  leadingControlTemplate = nothing,
  reserveLeadingControlSpace = false,
  showRightPlaceholder = false,
  rightSlotTemplate = nothing,
  hideVolume = false,
}) {
  const hasLeadingControl = leadingControlTemplate !== nothing && leadingControlTemplate !== undefined && leadingControlTemplate !== null;
  // Determine volume icon based on volume level and mute state
  const getVolumeIcon = (volume, muted) => {
    // For entities that don't support mute, consider them muted when volume is 0
    const effectiveMuted = supportsMute ? muted : (volume === 0);
    if (effectiveMuted || volume === 0) return "mdi:volume-off";
    if (volume < 0.2) return "mdi:volume-low";
    if (volume < 0.5) return "mdi:volume-medium";
    return "mdi:volume-high";
  };

  return html`
    <div class="volume-row">
      <div class="volume-controls">
        ${hasLeadingControl
      ? leadingControlTemplate
      : (reserveLeadingControlSpace ? html`<div class="volume-leading-placeholder"></div>` : nothing)
    }
        ${!hideVolume ? html`
          <button 
            class="volume-icon-btn" 
            @click=${onMuteToggle} 
            title=${(supportsMute ? isMuted : (vol === 0)) ? "Unmute" : "Mute"}
          >
            <ha-icon icon=${getVolumeIcon(vol, isMuted)}></ha-icon>
          </button>

          ${isRemoteVolumeEntity
        ? html`
                <div class="vol-stepper">
                  <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
                  <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
                </div>
              `
        : showSlider
          ? html`
                <div class="volume-slider-container">
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
                </div>
              `
          : html`
                <div class="vol-stepper-container">
                  <div class="vol-stepper">
                    <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
                    <span>${Math.round(vol * 100)}%</span>
                    <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
                  </div>
                </div>
              `
      }
        ` : nothing}
      </div>
      ${showRightPlaceholder ? html`
        <div class="volume-placeholder">
          ${rightSlotTemplate || nothing}
        </div>
      ` : nothing}
      ${moreInfoMenu}
    </div>
  `;
}
