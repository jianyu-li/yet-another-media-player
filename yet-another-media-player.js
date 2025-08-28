import { nothing, html, css, LitElement } from 'https://unpkg.com/lit-element@3.3.3/lit-element.js?module';
import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';
import Sortable from 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/+esm';

// import { html, nothing } from "lit";

// Helper to render a single chip
function renderChip(_ref) {
  let {
    idx,
    selected,
    playing,
    name,
    art,
    icon,
    pinned,
    maActive,
    onChipClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp
  } = _ref;
  return html`
    <button class="chip"
            ?selected=${selected}
            ?playing=${playing}
            ?ma-active=${maActive}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;">
      <span class="chip-icon">
        ${art ? html`<img class="chip-mini-art" src="${art}" />` : html`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${name}
      </span>
      ${pinned ? html`
            <span class="chip-pin-inside" @click=${e => {
    e.stopPropagation();
    onPinClick(idx, e);
  }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          ` : html`<span class="chip-pin-spacer"></span>`}
    </button>
  `;
}

// Helper to render a group chip: same as chip but with label (with count), no badge/icon for group, just art/icon and label.
function renderGroupChip(_ref2) {
  let {
    idx,
    selected,
    groupName,
    art,
    icon,
    pinned,
    maActive,
    onChipClick,
    onIconClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp
  } = _ref2;
  return html`
    <button class="chip group"
            ?selected=${selected}
            ?ma-active=${maActive}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;">
      <span class="chip-icon"
            style="cursor:pointer;"
            @click=${e => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick(idx, e);
    }
  }}>
        ${art ? html`<img class="chip-mini-art"
                      src="${art}"
                      style="cursor:pointer;"
                      @click=${e => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick(idx, e);
    }
  }}/>` : html`<ha-icon .icon=${icon}
                          style="font-size:28px;cursor:pointer;"
                          @click=${e => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick(idx, e);
    }
  }}></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${groupName}
      </span>
      ${pinned ? html`
            <span class="chip-pin-inside" @click=${e => {
    e.stopPropagation();
    onPinClick(idx, e);
  }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          ` : html`<span class="chip-pin-spacer"></span>`}
    </button>
  `;
}

// Pin/hold logic helpers (timer, etc)
function createHoldToPinHandler(_ref3) {
  let {
    onPin,
    holdTime = 600,
    moveThreshold = 8
  } = _ref3;
  let holdTimer = null;
  let startX = null;
  let startY = null;
  let moved = false;
  return {
    pointerDown: (e, idx) => {
      startX = e.clientX;
      startY = e.clientY;
      moved = false;
      holdTimer = setTimeout(() => {
        if (!moved) {
          onPin(idx, e);
        }
      }, holdTime);
    },
    pointerMove: (e, idx) => {
      if (holdTimer && startX !== null && startY !== null) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > moveThreshold || dy > moveThreshold) {
          moved = true;
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      }
    },
    pointerUp: (e, idx) => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      startX = null;
      startY = null;
      moved = false;
    }
  };
}
// Central chip row renderer
function renderChipRow(_ref4) {
  let {
    groupedSortedEntityIds,
    entityIds,
    selectedEntityId,
    pinnedIndex,
    holdToPin,
    getChipName,
    getActualGroupMaster,
    getIsChipPlaying,
    getChipArt,
    getIsMaActive,
    isIdle,
    hass,
    onChipClick,
    onIconClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp
  } = _ref4;
  if (!groupedSortedEntityIds || !groupedSortedEntityIds.length) return nothing;
  return html`
    ${groupedSortedEntityIds.map(group => {
    // If it's a group (more than one entity)
    if (group.length > 1) {
      var _hass$states, _state$attributes, _state$attributes2, _state$attributes3;
      const id = getActualGroupMaster(group);
      const idx = entityIds.indexOf(id);
      const state = hass === null || hass === void 0 || (_hass$states = hass.states) === null || _hass$states === void 0 ? void 0 : _hass$states[id];
      const art = typeof getChipArt === "function" ? getChipArt(id) : (state === null || state === void 0 || (_state$attributes = state.attributes) === null || _state$attributes === void 0 ? void 0 : _state$attributes.entity_picture) || (state === null || state === void 0 || (_state$attributes2 = state.attributes) === null || _state$attributes2 === void 0 ? void 0 : _state$attributes2.album_art) || null;
      const icon = (state === null || state === void 0 || (_state$attributes3 = state.attributes) === null || _state$attributes3 === void 0 ? void 0 : _state$attributes3.icon) || "mdi:cast";
      const isMaActive = typeof getIsMaActive === "function" ? getIsMaActive(id) : false;
      return renderGroupChip({
        idx,
        selected: selectedEntityId === id,
        groupName: getChipName(id) + (group.length > 1 ? ` [${group.length}]` : ""),
        art,
        icon,
        pinned: pinnedIndex === idx,
        maActive: isMaActive,
        onChipClick,
        onIconClick,
        onPinClick,
        onPointerDown: e => onPointerDown(e, idx),
        onPointerMove: e => onPointerMove(e, idx),
        onPointerUp: e => onPointerUp(e, idx)
      });
    } else {
      var _hass$states2, _state$attributes4, _state$attributes5, _state$attributes6;
      // Single chip
      const id = group[0];
      const idx = entityIds.indexOf(id);
      const state = hass === null || hass === void 0 || (_hass$states2 = hass.states) === null || _hass$states2 === void 0 ? void 0 : _hass$states2[id];
      const isChipPlaying = typeof getIsChipPlaying === "function" ? getIsChipPlaying(id, selectedEntityId === id) : selectedEntityId === id ? !isIdle : (state === null || state === void 0 ? void 0 : state.state) === "playing";
      const artSource = typeof getChipArt === "function" ? getChipArt(id) : (state === null || state === void 0 || (_state$attributes4 = state.attributes) === null || _state$attributes4 === void 0 ? void 0 : _state$attributes4.entity_picture) || (state === null || state === void 0 || (_state$attributes5 = state.attributes) === null || _state$attributes5 === void 0 ? void 0 : _state$attributes5.album_art) || null;
      const art = selectedEntityId === id ? !isIdle && artSource : isChipPlaying && artSource;
      const icon = (state === null || state === void 0 || (_state$attributes6 = state.attributes) === null || _state$attributes6 === void 0 ? void 0 : _state$attributes6.icon) || "mdi:cast";
      const isMaActive = typeof getIsMaActive === "function" ? getIsMaActive(id) : false;
      return renderChip({
        idx,
        selected: selectedEntityId === id,
        playing: isChipPlaying,
        name: getChipName(id),
        art,
        icon,
        pinned: pinnedIndex === idx,
        maActive: isMaActive,
        onChipClick,
        onPinClick,
        onPointerDown: e => onPointerDown(e, idx),
        onPointerMove: e => onPointerMove(e, idx),
        onPointerUp: e => onPointerUp(e, idx)
      });
    }
  })}
  `;
}

// action-chip-row.js
// import { html, nothing } from "lit";

function renderActionChipRow(_ref) {
  let {
    actions,
    onActionChipClick
  } = _ref;
  if (!(actions !== null && actions !== void 0 && actions.length)) return nothing;
  return html`
    <div class="action-chip-row">
      ${actions.map((a, idx) => html`
          <button class="action-chip" @click=${() => onActionChipClick(idx)}>
            ${a.icon ? html`<ha-icon .icon=${a.icon} style="font-size: 22px; margin-right: ${a.name ? '8px' : '0'};"></ha-icon>` : nothing}
            ${a.name || ""}
          </button>
        `)}
    </div>
  `;
}

// controls-row.js
// import { html, nothing } from "lit";

function renderControlsRow(_ref) {
  let {
    stateObj,
    showStop,
    shuffleActive,
    repeatActive,
    onControlClick,
    supportsFeature
  } = _ref;
  if (!stateObj) return nothing;
  const SUPPORT_PAUSE = 1;
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
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
      ${supportsFeature(stateObj, SUPPORT_PAUSE) || supportsFeature(stateObj, SUPPORT_PLAY) ? html`
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
          <ha-icon .icon=${stateObj.attributes.repeat === "one" ? "mdi:repeat-once" : "mdi:repeat"}></ha-icon>
        </button>
      ` : nothing}
      ${supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON) ? html`
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
function countMainControls(stateObj, supportsFeature) {
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_SHUFFLE = 32768;
  const SUPPORT_REPEAT_SET = 262144;
  const SUPPORT_TURN_ON = 128;
  const SUPPORT_TURN_OFF = 256;
  let count = 0;
  if (supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK)) count++;
  count++; // play/pause button always present if row exists
  if (supportsFeature(stateObj, SUPPORT_NEXT_TRACK)) count++;
  if (supportsFeature(stateObj, SUPPORT_SHUFFLE)) count++;
  if (supportsFeature(stateObj, SUPPORT_REPEAT_SET)) count++;
  if (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON)) count++;
  return count;
}

// volume-row.js
// import { html, nothing } from "lit";

function renderVolumeRow(_ref) {
  let {
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
    moreInfoMenu
  } = _ref;
  // Determine volume icon based on volume level and mute state
  const getVolumeIcon = (volume, muted) => {
    // For entities that don't support mute, consider them muted when volume is 0
    const effectiveMuted = supportsMute ? muted : volume === 0;
    if (effectiveMuted || volume === 0) return "mdi:volume-off";
    if (volume < 0.2) return "mdi:volume-low";
    if (volume < 0.5) return "mdi:volume-medium";
    return "mdi:volume-high";
  };
  return html`
    <div class="volume-row">
      ${isRemoteVolumeEntity ? html`
            <div class="vol-stepper">
              <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
              <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
            </div>
          ` : showSlider ? html`
            <div class="volume-controls">
              <button 
                class="volume-icon-btn" 
                @click=${onMuteToggle} 
                title=${(supportsMute ? isMuted : vol === 0) ? "Unmute" : "Mute"}
              >
                <ha-icon icon=${getVolumeIcon(vol, isMuted)}></ha-icon>
              </button>
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
            </div>
          ` : html`
            <div class="vol-stepper">
              <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
              <span>${Math.round(vol * 100)}%</span>
              <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
            </div>
          `}
      ${moreInfoMenu}
    </div>
  `;
}

// progress-bar.js
// import { html, nothing } from "lit";

function renderProgressBar(_ref) {
  let {
    progress,
    seekEnabled,
    onSeek,
    collapsed,
    accent,
    height = 6,
    style = ""
  } = _ref;
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

// yamp-card-styles.js
// import { css } from "lit";

const yampCardStyles = css`
  /* CSS Custom Properties for consistency */
  :host {
    --custom-accent: var(--accent-color, #ff9800);
    --card-bg: var(--card-background-color, #222);
    --primary-text: var(--primary-text-color, #fff);
    --secondary-text: var(--secondary-text-color, #aaa);
    --chip-bg: var(--chip-background, #333);
    --transition-fast: 0.13s;
    --transition-normal: 0.2s;
    --transition-slow: 0.4s;
    --border-radius: 16px;
    --chip-border-radius: 24px;
    --button-border-radius: 8px;
    --shadow-light: 0 2px 8px rgba(0,0,0,0.13);
    --shadow-medium: 0 2px 8px rgba(0,0,0,0.25);
    --shadow-heavy: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
  }

  :host([data-match-theme="false"]) {
    --custom-accent: #ff9800;
  }

  /* Base card styles - set once, inherit everywhere */
  :host {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
    background: var(--card-bg);
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
  }

  ha-card.yamp-card {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
    background: var(--card-bg);
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
  }

  /* Idle state dimming */
  .dim-idle .details,
  .dim-idle .controls-row,
  .dim-idle .volume-row,
  .dim-idle .chip-row,
  .dim-idle .action-chip-row {
    opacity: 0.28;
    transition: opacity 0.5s;
  }

  /* More info menu */
  .more-info-menu {
    display: flex;
    align-items: center;
    margin-right: 0;
  }

  .more-info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    padding: 0;
    margin: 0 4px;
    background: none;
    border: none;
    color: var(--primary-text);
    font: inherit;
    cursor: pointer;
    outline: none;
  }

  .more-info-btn ha-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    width: 28px;
    height: 28px;
    line-height: 1;
    vertical-align: middle;
    position: relative;
    margin: 0 0 2px 0;
    color: #fff;
  }

  /* Card artwork spacer */
  .card-artwork-spacer {
    width: 100%;
    flex: 1 1 0;
    height: auto;
    min-height: 180px;
    pointer-events: none;
  }

  /* Media background */
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  .media-bg-dim {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1;
    pointer-events: none;
  }

  /* Source menu */
  .source-menu {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0;
    margin: 0;
  }

  .source-menu-btn {
    background: none;
    border: none;
    color: var(--primary-text);
    font: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1px;
    padding: 2px 10px;
    font-size: 1em;
    outline: none;
  }

  .source-selected {
    min-width: 64px;
    font-weight: 500;
    padding-right: 4px;
    text-align: left;
  }

  .source-dropdown {
    position: absolute;
    top: 32px;
    right: 0;
    left: auto;
    background: var(--card-bg);
    color: var(--primary-text);
    border-radius: var(--button-border-radius);
    box-shadow: var(--shadow-light);
    min-width: 110px;
    z-index: 11;
    margin-top: 2px;
    border: 1px solid #444;
    overflow: hidden;
    max-height: 220px;
    overflow-y: auto;
  }

  .source-dropdown.up {
    top: auto;
    bottom: 38px;
    border-radius: var(--button-border-radius);
  }

  .source-option {
    padding: 8px 16px;
    cursor: pointer;
    transition: background var(--transition-fast);
    white-space: nowrap;
  }

  .source-option:hover,
  .source-option:focus {
    background: var(--accent-color, #1976d2);
    color: #fff;
  }

  .source-row {
    display: flex;
    align-items: center;
    padding: 0 16px 8px 16px;
    margin-top: 8px;
  }

  .source-select {
    font-size: 1em;
    padding: 4px 10px;
    border-radius: var(--button-border-radius);
    border: 1px solid #ccc;
    background: var(--card-bg);
    color: var(--primary-text);
    outline: none;
    margin-top: 2px;
  }

  /* Chip styles */
  .chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 8px;
    background: transparent;
    border-radius: 50%;
    overflow: hidden;
    padding: 0;
  }

  .chip[playing] .chip-icon {
    background: #fff;
  }

  .chip-icon ha-icon {
    width: 100%;
    height: 100%;
    font-size: 28px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    color: var(--custom-accent);
  }

  .chip[selected] .chip-icon ha-icon {
    color: #fff;
  }

  .chip:hover .chip-icon ha-icon {
    color: #fff;
  }

  .chip-mini-art {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    display: block;
  }

  /* Chip rows */
  .chip-row.grab-scroll-active,
  .action-chip-row.grab-scroll-active {
    cursor: grabbing;
  }

  .chip-row,
  .action-chip-row {
    cursor: grab;
  }

  .chip-row {
    display: flex;
    gap: 8px;
    padding: 8px 12px 0 12px;
    margin-bottom: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: none;
    scrollbar-color: var(--accent-color, #1976d2) #222;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    max-width: 100vw;
  }

  .chip-row::-webkit-scrollbar {
    display: none;
  }

  .chip-row::-webkit-scrollbar-thumb {
    background: var(--accent-color, #1976d2);
    border-radius: 6px;
  }

  .chip-row::-webkit-scrollbar-track {
    background: #222;
  }

  .action-chip-row {
    display: flex;
    gap: 8px;
    padding: 2px 12px 0 12px;
    margin-bottom: 8px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
  }

  .action-chip-row::-webkit-scrollbar {
    display: none;
  }

  /* Action chips */
  .action-chip {
    background: var(--card-bg);
    opacity: 1;
    border-radius: var(--button-border-radius);
    color: var(--primary-text);
    box-shadow: none;
    text-shadow: none;
    border: none;
    outline: none;
    padding: 4px 12px;
    font-weight: 500;
    font-size: 0.95em;
    cursor: pointer;
    margin: 4px 0;
    transition: background var(--transition-normal) ease, transform 0.1s ease;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: none;
    text-shadow: none;
  }

  .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: none;
    text-shadow: none;
  }

  /* Main chips */
  .chip {
    display: flex;
    align-items: center;
    border-radius: var(--chip-border-radius);
    padding: 6px 6px 6px 8px;
    background: var(--chip-bg);
    color: var(--primary-text);
    cursor: pointer;
    font-weight: 500;
    opacity: 0.85;
    border: none;
    outline: none;
    transition: background var(--transition-normal), opacity var(--transition-normal);
    flex: 0 0 auto;
    white-space: nowrap;
    position: relative;
  }

  .chip:hover {
    background: var(--custom-accent);
    color: #fff;
  }

  .chip[selected] {
    background: var(--custom-accent);
    color: #fff;
    opacity: 1;
  }

  .chip[playing] {
    padding-right: 6px;
  }

  /* Music Assistant active outline */
  .chip[ma-active] {
    border: 1px solid rgba(255, 152, 0, 0.6);
  }

  .chip[ma-active]:hover {
    border: 1px solid rgba(255, 152, 0, 0.8);
  }

  .chip[selected][ma-active] {
    border: 1px solid rgba(255, 152, 0, 0.8);
  }

  .chip[selected][ma-active]:hover {
    border: 1px solid rgba(255, 152, 0, 1);
  }

  /* Chip pin */
  .chip-pin {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #fff;
    border-radius: 50%;
    padding: 2px;
    z-index: 2;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--custom-accent);
    box-shadow: 0 1px 5px rgba(0,0,0,0.11);
    cursor: pointer;
    transition: box-shadow 0.18s;
  }

  .chip-pin:hover {
    box-shadow: 0 2px 12px rgba(33,33,33,0.17);
  }

  .chip-pin ha-icon {
    color: var(--custom-accent);
    font-size: 16px;
    background: transparent;
    border-radius: 50%;
    margin: 0;
    padding: 0;
  }

  .chip-pin-inside {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    background: transparent;
    border-radius: 50%;
    padding: 2px;
    cursor: pointer;
  }

  .chip-pin-inside ha-icon {
    color: var(--custom-accent);
    font-size: 17px;
    margin: 0;
  }

  .chip[selected] .chip-pin-inside ha-icon {
    color: #fff;
  }

  .chip-pin:hover ha-icon,
  .chip-pin-inside:hover ha-icon {
    color: #fff;
  }

  .chip:hover .chip-pin ha-icon,
  .chip:hover .chip-pin-inside ha-icon {
    color: #fff;
  }

  .chip-pin-spacer {
    display: flex;
    width: 24px;
    min-width: 24px;
    height: 1px;
  }

  /* Group icon */
  .chip-icon.group-icon {
    background: var(--custom-accent);
    color: #fff;
    position: relative;
  }

  .group-count {
    font-weight: 700;
    font-size: 0.9em;
    line-height: 28px;
    text-align: center;
    width: 100%;
    color: inherit;
  }

  /* Media artwork */
  .media-artwork-bg {
    position: relative;
    width: 100%;
    aspect-ratio: 1.75/1;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
  }

  .artwork {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: var(--shadow-medium);
    background: #222;
  }

  /* Details section */
  .details {
    padding: 0 16px 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    min-height: 48px;
  }

  .details .title,
  .title {
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.2;
    white-space: normal;
    word-break: break-word;
    overflow: visible;
    text-overflow: unset;
    display: block;
    padding-top: 8px;
  }

  .artist {
    font-size: 1em;
    font-weight: 400;
    color: var(--secondary-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }

  /* Controls */
  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 4px 16px;
  }

  .button {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.5em;
    cursor: pointer;
    padding: 6px;
    border-radius: var(--button-border-radius);
    transition: background var(--transition-normal);
  }

  .button:active {
    background: rgba(0,0,0,0.10);
  }

  .button.active ha-icon,
  .button.active {
    color: var(--custom-accent);
  }

  /* Progress bar */
  .progress-bar-container {
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.22);
    border-radius: 3px;
    margin: 8px 0;
    cursor: pointer;
    position: relative;
    box-shadow: var(--shadow-heavy);
  }

  .progress-inner {
    height: 100%;
    background: var(--custom-accent);
    border-radius: 3px 0 0 3px;
    box-shadow: 0 0 8px 2px rgba(0,0,0,0.24);
  }

  /* Volume controls */
  .volume-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px 12px 25px;
    justify-content: space-between;
  }

  .volume-controls {
    display: flex;
    align-items: center;
    gap: 25px;
    flex: 1;
  }

  .volume-icon-btn {
    background: none;
    border: none;
    color: var(--primary-text);
    cursor: pointer;
    padding: 0px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-normal);
    min-width: 36px;
    min-height: 36px;
    margin-right: 0px;
    margin-left: -7px;
  }

  .volume-icon-btn:hover {
    color: var(--custom-accent);
  }

  .volume-icon-btn ha-icon {
    font-size: 1.2em;
    color: #fff;
  }

  .volume-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    position: relative;
  }

  .volume-slider-icon {
    font-size: 1em;
    color: var(--primary-text);
    opacity: 0.7;
    min-width: 20px;
  }

  .vol-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: hsla(0, 0.00%, 100.00%, 0.22);
    border-radius: 3px;
    outline: none;
    box-shadow: var(--shadow-heavy);
    flex: 1 1 auto;
    min-width: 80px;
    max-width: none;
    margin-right: 12px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .volume-row .source-menu {
    flex: 0 0 auto;
  }

  /* Volume slider thumbs */
  .vol-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--custom-accent);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    border: 2px solid #fff;
  }

  .vol-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--custom-accent);
    cursor: pointer;
    border: 2px solid #fff;
  }

  .vol-slider::-moz-range-track {
    height: 6px;
    background: rgba(255,255,255,0.22);
    border-radius: 3px;
  }

  .vol-slider::-ms-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--custom-accent);
    cursor: pointer;
    border: 2px solid #fff;
  }

  .vol-slider::-ms-fill-lower,
  .vol-slider::-ms-fill-upper {
    height: 6px;
    background: rgba(255,255,255,0.22);
    border-radius: 3px;
  }

  /* Touch device improvements */
  @media (pointer: coarse) {
    .vol-slider::-webkit-slider-thumb {
      box-shadow: 0 0 0 18px rgba(0,0,0,0);
    }
    .vol-slider::-moz-range-thumb {
      box-shadow: 0 0 0 18px rgba(0,0,0,0);
    }
    .vol-slider::-ms-thumb {
      box-shadow: 0 0 0 18px rgba(0,0,0,0);
    }
  }

  .vol-stepper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .vol-stepper .button {
    min-width: 36px;
    min-height: 36px;
    font-size: 1.5em;
    padding: 6px 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Light mode styles */
  @media (prefers-color-scheme: light) {
    :host {
      background: var(--card-background-color, #fff);
    }

    .chip {
      background: #f0f0f0;
      color: #222;
    }

    :host([data-match-theme="true"]) .chip[selected] {
      background: var(--accent-color, #1976d2);
      color: #fff;
    }

    .artwork {
      background: #eee;
    }

    .progress-bar {
      background: #eee;
    }

    .source-menu-btn {
      color: #222;
    }

    .source-dropdown {
      background: #fff;
      color: #222;
      border: 1px solid #bbb;
    }

    .source-option {
      color: #222;
      background: #fff;
      transition: background var(--transition-fast), color var(--transition-fast);
    }

    .source-option:hover,
    .source-option:focus {
      background: var(--custom-accent);
      color: #222;
    }

    .source-select {
      background: #fff;
      color: #222;
      border: 1px solid #aaa;
    }

    .action-chip {
      background: var(--card-background-color, #fff);
      opacity: 1;
      border-radius: var(--button-border-radius);
      color: var(--primary-text-color, #222);
      box-shadow: none;
      text-shadow: none;
      border: none;
      outline: none;
    }

    .action-chip:active {
      background: var(--accent-color, #1976d2);
      color: #fff;
      opacity: 1;
      transform: scale(0.98);
      box-shadow: none;
      text-shadow: none;
    }

    .card-lower-content:not(.collapsed) .source-menu-btn,
    .card-lower-content:not(.collapsed) .source-selected {
      color: #fff;
    }
  }

  /* Artwork overlay */
  .artwork-dim-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, 
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.70) 100%);
    z-index: 2;
  }

  /* Card lower content */
  .card-lower-content-container {
    position: relative;
    width: 100%;
    min-height: auto;
    height: 100%;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    overflow: hidden;
  }

  .card-lower-content-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
    height: 100%;
  }

  .card-lower-fade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.92) 100%
    );
  }

  .card-lower-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-lower-content.transitioning .details,
  .card-lower-content.transitioning .card-artwork-spacer {
    transition: opacity 0.3s;
  }

  .card-lower-content.collapsed .details {
    opacity: 1;
    pointer-events: auto;
    margin-right: 120px;
    transition: margin var(--transition-normal);
  }

  @media (max-width: 420px) {
    .card-lower-content.collapsed .details {
      margin-right: 74px;
    }
  }

  .card-lower-content.collapsed .card-artwork-spacer {
    opacity: 0;
    pointer-events: none;
  }

  /* Force white text for important UI elements */
  .details,
  .title,
  .artist,
  .controls-row,
  .button,
  .vol-stepper span {
    color: #fff;
  }

  /* Media artwork placeholder */
  .media-artwork-placeholder ha-icon {
    width: 104px;
    height: 104px;
    min-width: 104px;
    min-height: 104px;
    max-width: 104px;
    max-height: 104px;
    display: block;
  }

  .media-artwork-placeholder ha-icon svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Collapsed artwork */
  .card-lower-content.collapsed .collapsed-artwork-container {
    position: absolute;
    top: 10px;
    right: 18px;
    width: 110px;
    height: calc(100% - 120px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 5;
    background: transparent;
    pointer-events: none;
    box-shadow: none;
    padding: 0;
    transition: background var(--transition-slow);
  }

  .card-lower-content.collapsed .collapsed-artwork {
    width: 98px;
    height: 98px;
    border-radius: 14px;
    object-fit: cover;
    background: transparent;
    box-shadow: 0 1px 6px rgba(0,0,0,0.22);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 2px;
  }

  .card-lower-content.collapsed .controls-row {
    max-width: calc(100% - 120px);
    margin-right: 110px;
  }

  @media (max-width: 420px) {
    .card-lower-content.collapsed .controls-row {
      max-width: 100%;
      margin-right: 0;
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 70px;
      height: 70px;
      right: 10px;
    }

    .card-lower-content.collapsed .collapsed-artwork {
      width: 62px;
      height: 62px;
    }
  }

  /* Collapsed progress bar */
  .collapsed-progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background: var(--custom-accent);
    border-radius: 0 0 12px 12px;
    z-index: 99;
    transition: width var(--transition-normal) linear;
    pointer-events: none;
  }

  /* Entity options overlay */
  .entity-options-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 30;
    background: rgba(15,18,30,0.70);
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .entity-options-sheet {
    --custom-accent: var(--accent-color, #ff9800);
    background: none;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    box-shadow: none;
    width: 98%;
    max-width: 430px;
    margin-bottom: 1.5%;
    padding: 18px 8px 8px 8px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    max-height: 85%;
    min-height: 90px;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .entity-options-sheet::-webkit-scrollbar {
    display: none;
  }

  .entity-options-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 18px;
    text-align: center;
    color: #fff;
    background: none;
    text-shadow: 0 2px 8px #0009;
  }

  .entity-options-item {
    background: none;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 500;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast), text-shadow var(--transition-fast);
    text-align: center;
    text-shadow: 0 2px 8px #0009;
  }

  .entity-options-item:hover {
    color: var(--custom-accent, #ff9800);
    text-shadow: none;
    background: none;
  }

  /* Source index */
  .source-index-letter:focus {
    background: rgba(255,255,255,0.11);
    outline: 1px solid #ff9800;
  }

  .entity-options-sheet.source-list-sheet {
    position: relative;
    overflow: visible;
  }

  .source-list-scroll {
    overflow-y: auto;
    max-height: 340px;
    scrollbar-width: none;
  }

  .source-list-scroll::-webkit-scrollbar {
    display: none;
  }

  .floating-source-index.grab-scroll-active,
  .floating-source-index.grab-scroll-active * {
    cursor: grabbing;
  }

  .floating-source-index {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    pointer-events: auto;
    overscroll-behavior: contain;
    z-index: 10;
    padding: 12px 8px 8px 0;
    overflow-y: auto;
    max-height: 100%;
    min-width: 32px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    cursor: grab;
  }

  .floating-source-index::-webkit-scrollbar {
    display: none;
  }

  .floating-source-index .source-index-letter {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.08em;
    cursor: pointer;
    margin: 2px 0;
    padding: 2px 2px;
    pointer-events: auto;
    outline: none;
    transition: color var(--transition-fast), background var(--transition-fast), transform 0.16s cubic-bezier(.35,1.8,.4,1.04);
    transform: scale(1);
    z-index: 1;
    min-height: 32px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: 3;
  }

  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: 2;
  }

  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.10);
    z-index: 1;
  }

  .floating-source-index .source-index-letter::after {
    display: none;
  }

  .floating-source-index .source-index-letter:hover,
  .floating-source-index .source-index-letter:focus {
    color: #fff;
  }

  /* Group toggle buttons */
  .group-toggle-btn {
    background: none;
    border: 1px solid currentColor;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15em;
    line-height: 1;
    margin-right: 10px;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
    overflow: hidden;
    color: #fff;
    border-color: #fff;
  }

  .group-toggle-btn span,
  .group-toggle-btn .group-toggle-fix {
    position: relative;
    left: 0.5px;
  }

  .group-toggle-btn:hover {
    background: rgba(255,255,255,0.15);
  }

  .group-toggle-transparent {
    background: none;
    border: none;
    box-shadow: none;
    color: transparent;
    pointer-events: none;
  }

  .group-toggle-transparent:hover {
    background: none;
  }

  /* Force white text in grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: #fff;
  }

  /* Search functionality */
  .entity-options-search {
    padding: 2px 0 4px 0;
  }

  .entity-options-search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
    margin-top: 2px;
  }

  .entity-options-search-result {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid #2227;
    font-size: 1.10em;
    color: var(--primary-text);
    background: none;
  }

  .entity-options-search-result:last-child {
    border-bottom: none;
  }

  .entity-options-search-result.placeholder {
    visibility: hidden;
    border-bottom: 1px solid transparent;
    min-height: 46px;
    box-sizing: border-box;
  }

  .entity-options-search-thumb {
    height: 38px;
    width: 38px;
    border-radius: var(--button-border-radius);
    object-fit: cover;
    box-shadow: 0 1px 5px rgba(0,0,0,0.16);
    margin-right: 12px;
  }

  .entity-options-search-play {
    min-width: 34px;
    font-size: 1.13em;
    border: none;
    background: var(--custom-accent);
    color: #fff;
    border-radius: 10px;
    padding: 6px 10px;
    margin-left: 7px;
    cursor: pointer;
    box-shadow: 0 1px 5px rgba(0,0,0,0.13);
    transition: background var(--transition-normal), color var(--transition-normal);
    text-shadow: 0 2px 8px #0008;
  }

  .entity-options-search-play:hover,
  .entity-options-search-play:focus {
    background: #fff;
    color: var(--custom-accent);
  }

  .entity-options-search-input {
    border: 1px solid #333;
    border-radius: var(--button-border-radius);
    background: var(--card-bg);
    color: var(--primary-text);
    font-size: 1.12em;
    outline: none;
    transition: border var(--transition-fast);
    margin-right: 7px;
    box-sizing: border-box;
  }

  .entity-options-search-row .entity-options-search-input {
    padding: 4px 10px;
    height: 32px;
    min-height: 32px;
    line-height: 1.18;
    box-sizing: border-box;
    border: 1.5px solid var(--custom-accent);
    background: #232323;
    color: #fff;
    transition: border var(--transition-fast), background var(--transition-fast);
    outline: none;
  }

  .entity-options-search-input:focus {
    border: 1.5px solid var(--custom-accent);
    background: #232323;
    color: #fff;
    outline: none;
  }

  .entity-options-search-loading,
  .entity-options-search-error,
  .entity-options-search-empty {
    padding: 8px 6px;
    font-size: 1.09em;
    opacity: 0.90;
    color: var(--primary-text);
    background: none;
    text-align: left;
  }

  .entity-options-search-error {
    color: #e44747;
    font-weight: 500;
  }

  .entity-options-search-empty {
    color: #999;
    font-style: italic;
  }

  .entity-options-search-row .entity-options-item {
    height: 32px;
    min-height: 32px;
    box-sizing: border-box;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.12em;
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Search filter chips */
  .search-filter-chips .chip {
    color: #fff;
  }

  .search-filter-chips .chip[selected],
  .search-filter-chips .chip[style*="background: var(--customAccent"],
  .search-filter-chips .chip[style*="background: var(--custom-accent"] {
    color: #111;
  }

  .entity-options-sheet .search-filter-chips .chip:not([selected]) {
    color: #fff;
  }

  .entity-options-sheet .search-filter-chips .chip[selected] {
    color: #111;
  }

  .entity-options-sheet .search-filter-chips .chip {
    text-align: center;
    justify-content: center;
  }

  .entity-options-sheet .search-filter-chips .chip:hover {
    background: var(--custom-accent);
    color: #111;
    opacity: 1;
  }

  .entity-options-sheet .entity-options-search-results {
    min-height: 210px;
  }

  /* Search layout */
  .entity-options-sheet .entity-options-search {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-sheet .entity-options-search-row,
  .entity-options-sheet .search-filter-chips {
    flex: 0 0 auto;
  }

  .entity-options-sheet .entity-options-search-results {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
  }

  .entity-options-resolved-entities {
    --custom-accent: var(--accent-color, #ff9800);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-resolved-entities-list {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
  }

  .entity-options-resolved-entities .entity-options-item {
    background: none;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 500;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast), text-shadow var(--transition-fast);
    text-align: left;
    text-shadow: 0 2px 8px #0009;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .entity-options-resolved-entities .entity-options-item:hover,
  .entity-options-resolved-entities .entity-options-item:focus {
    color: var(--custom-accent) !important;
    text-shadow: none !important;
    background: none !important;
  }

  .entity-options-resolved-entities .entity-options-item:last-child {
    border-bottom: none;
  }

  /* Clickable artist */
  .clickable-artist {
    cursor: pointer;
  }

  .clickable-artist:hover {
    text-decoration: underline;
  }
`;

// import { LitElement, html, css, nothing } from "lit";

/**
 * Renders the search sheet UI for media search.
 *
 * @param {Object} opts
 * @param {boolean} opts.open - Whether the search sheet is visible.
 * @param {string} opts.query - Current search query value.
 * @param {Function} opts.onQueryInput - Handler for query input change.
 * @param {Function} opts.onSearch - Handler for search action.
 * @param {Function} opts.onClose - Handler for closing the sheet.
 * @param {boolean} opts.loading - Loading state for search.
 * @param {Array} opts.results - Search result items (array of media items).
 * @param {Function} opts.onPlay - Handler to play a media item.
 * @param {string} [opts.error] - Optional error message.
 */
function renderSearchSheet(_ref) {
  let {
    open,
    query,
    onQueryInput,
    onSearch,
    onClose,
    loading,
    results,
    onPlay,
    error
  } = _ref;
  if (!open) return nothing;
  return html`
    <div class="search-sheet">
      <div class="search-sheet-header">
        <input
          type="text"
          .value=${query || ""}
          @input=${onQueryInput}
          placeholder="Search music..."
          autofocus
        />
        <button @click=${onSearch} ?disabled=${loading || !query}>Search</button>
        <button @click=${onClose} title="Close Search">✕</button>
      </div>
      ${loading ? html`<div class="search-sheet-loading">Loading...</div>` : nothing}
      ${error ? html`<div class="search-sheet-error">${error}</div>` : nothing}
      <div class="search-sheet-results">
        ${(results || []).length === 0 && !loading ? html`<div class="search-sheet-empty">No results.</div>` : (results || []).map(item => html`
                <div class="search-sheet-result">
                  <img
                    class="search-sheet-thumb"
                    src=${item.thumbnail}
                    alt=${item.title}
                  />
                  <span class="search-sheet-title">${item.title}</span>
                  <button class="search-sheet-play" @click=${() => onPlay(item)}>
                    ▶
                  </button>
                </div>
              `)}
      </div>
    </div>
  `;
}

// Service helpers to keep search-related logic colocated with the search UI module
async function searchMedia(hass, entityId, query) {
  var _res$response;
  const msg = {
    type: "call_service",
    domain: "media_player",
    service: "search_media",
    service_data: {
      entity_id: entityId,
      search_query: query
    },
    return_response: true
  };
  const res = await hass.connection.sendMessagePromise(msg);
  return (res === null || res === void 0 || (_res$response = res.response) === null || _res$response === void 0 || (_res$response = _res$response[entityId]) === null || _res$response === void 0 ? void 0 : _res$response.result) || (res === null || res === void 0 ? void 0 : res.result) || [];
}
function playSearchedMedia(hass, entityId, item) {
  return hass.callService("media_player", "play_media", {
    entity_id: entityId,
    media_content_type: item.media_content_type,
    media_content_id: item.media_content_id
  });
}

// Supported feature flags
const SUPPORT_VOLUME_MUTE = 8;
const SUPPORT_STOP = 4096;
const SUPPORT_GROUPING = 524288;

// import Sortable from "sortablejs";

class YampSortable extends LitElement {
  static get properties() {
    return {
      disabled: {
        type: Boolean
      },
      handleSelector: {
        type: String
      },
      draggableSelector: {
        type: String
      }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .sortable-fallback {
        display: none !important;
      }
      .sortable-ghost {
        box-shadow: 0 0 0 2px var(--primary-color);
        background: rgba(var(--rgb-primary-color), 0.25);
        border-radius: 4px;
        opacity: 0.4;
      }
      .sortable-drag {
        border-radius: 4px;
        opacity: 1;
        background: var(--card-background-color);
        box-shadow: 0px 4px 8px 3px #00000026;
        cursor: grabbing;
      }
    `;
  }
  constructor() {
    super();
    this.disabled = false;
    this.handleSelector = ".handle";
    this.draggableSelector = ".sortable-item";
    this._sortable = null;
  }
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <slot></slot>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.disabled) {
      this._createSortable();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._destroySortable();
  }
  updated(changedProperties) {
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this._destroySortable();
      } else {
        this._createSortable();
      }
    }
  }
  _createSortable() {
    if (this._sortable) return;
    const container = this.children[0];
    if (!container) return;
    const options = {
      scroll: true,
      forceAutoScrollFallback: true,
      scrollSpeed: 20,
      animation: 150,
      draggable: this.draggableSelector,
      handle: this.handleSelector,
      onChoose: this._handleChoose.bind(this),
      onStart: this._handleStart.bind(this),
      onEnd: this._handleEnd.bind(this),
      onUpdate: this._handleUpdate.bind(this)
    };
    this._sortable = new Sortable(container, options);
  }
  _handleUpdate(evt) {
    this.dispatchEvent(new CustomEvent("item-moved", {
      detail: {
        oldIndex: evt.oldIndex,
        newIndex: evt.newIndex
      },
      bubbles: true,
      composed: true
    }));
  }
  _handleEnd(evt) {
    // Put back in original location if needed
    if (evt.item.placeholder) {
      evt.item.placeholder.replaceWith(evt.item);
      delete evt.item.placeholder;
    }
  }
  _handleStart() {
    // Optional: emit drag start event
  }
  _handleChoose(evt) {
    // Create placeholder to maintain layout
    evt.item.placeholder = document.createComment("sort-placeholder");
    evt.item.after(evt.item.placeholder);
  }
  _destroySortable() {
    if (!this._sortable) return;
    this._sortable.destroy();
    this._sortable = null;
  }
}
customElements.define("yamp-sortable", YampSortable);

class YetAnotherMediaPlayerEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _entityEditorIndex: {
        type: Number
      },
      _actionEditorIndex: {
        type: Number
      },
      _actionMode: {
        type: String
      },
      _useTemplate: {
        type: Boolean
      },
      _useVolTemplate: {
        type: Boolean
      }
    };
  }
  constructor() {
    super();
    this._entityEditorIndex = null;
    this._actionEditorIndex = null;
    this._yamlDraft = "";
    this._parsedYaml = null;
    this._yamlError = false;
    this._serviceItems = [];
    this._useTemplate = null; // auto-detect per entity on open
    this._useVolTemplate = null; // auto-detect per entity on open
  }
  firstUpdated() {
    this._serviceItems = this._getServiceItems();
  }
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }
  _getServiceItems() {
    var _this$hass;
    if (!((_this$hass = this.hass) !== null && _this$hass !== void 0 && _this$hass.services)) return [];
    return Object.entries(this.hass.services).flatMap(_ref => {
      let [domain, services] = _ref;
      return Object.keys(services).map(svc => ({
        label: `${domain}.${svc}`,
        value: `${domain}.${svc}`
      }));
    });
  }
  _looksLikeTemplate(val) {
    if (typeof val !== "string") return false;
    const s = val.trim();
    return s.includes("{{") || s.includes("{%");
  }
  _isEntityId(val) {
    return typeof val === "string" && /^[a-z_]+\.[a-zA-Z0-9_]+$/.test(val.trim());
  }
  setConfig(config) {
    const rawEntities = config.entities ?? [];
    const normalizedEntities = rawEntities.map(e => typeof e === "string" ? {
      entity_id: e
    } : e);
    this._config = {
      ...config,
      entities: normalizedEntities
    };
  }
  _updateConfig(key, value) {
    const newConfig = {
      ...this._config,
      [key]: value
    };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: {
        config: newConfig
      },
      bubbles: true,
      composed: true
    }));
  }
  _updateEntityProperty(key, value) {
    const entities = [...(this._config.entities ?? [])];
    const idx = this._entityEditorIndex;
    if (entities[idx]) {
      entities[idx] = {
        ...entities[idx],
        [key]: value
      };
      this._updateConfig("entities", entities);
    }
  }
  _updateActionProperty(key, value) {
    const actions = [...(this._config.actions ?? [])];
    const idx = this._actionEditorIndex;
    if (actions[idx]) {
      actions[idx] = {
        ...actions[idx],
        [key]: value
      };
      this._updateConfig("actions", actions);
    }
  }
  static get styles() {
    return css`
        .form-row {
          padding: 12px 16px;
          gap: 8px;
        }
        /* add to rows with multiple elements to align the elements horizontally */
        .form-row-multi-column {
          display: flex;
          /*gap: 12px;*/
        }
        .form-row-multi-column > div {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* reduced padding for entity selection subrows */
        .entity-row {
          padding: 6px;
        }
        /* visually isolate grouped controls */
        .entity-group, .action-group {
          background: var(--card-background-color, #f7f7f7);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 16px;
          margin-top: 16px;
        }
        /* wraps the entity selector and edit button */
        .entity-row-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        /* wraps the action icon, name textbox and edit button */
        .action-row-inner {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        .action-row-inner > ha-icon {
          margin-right: 5px;
          margin-top: 0px;
        }
        /* allow children to fill all available space */
        .grow-children {
          flex: 1;
          display: flex;
        }
        .grow-children > * {
          flex: 1;
          min-width: 0;
        }
        .entity-editor-header, .action-editor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
        }
        .entity-editor-title, .action-editor-title {
          font-weight: 500;
          font-size: 1.1em;
          line-height: 1;
        }
        .action-icon-placeholder {
          width: 29px; 
          height: 24px; 
          display: inline-block;
        }
        .full-width {
          width: 100%;
        }
        .entity-group-header, .action-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0px 6px;
        }
        .entity-group-title, action-group-title {
          font-weight: 500;
        }
        .entity-group-actions, action-group-actions {
          display: flex;
          align-items: center;
        }
        entity-row-actions {
          display: flex;
          align-items: center;
        }
        .action-row-actions {
          display: flex;
          align-items: flex-start;
        }
        
        /* Drag handle styles */
        .handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          cursor: grab;
          color: var(--secondary-text-color);
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .handle:hover {
          opacity: 1;
        }
        .handle:active {
          cursor: grabbing;
        }
        .handle-disabled {
          opacity: 0.3;
          cursor: default;
          pointer-events: none;
        }
        .handle-disabled:hover {
          opacity: 0.3;
        }
        .action-icon {
          align-self: flex-start;
          padding-top: 16px;
        }
        .action-handle {
          align-self: flex-start;
          padding-top: 18px;
        }
        .action-row-actions {
          padding-top: 2px;
        }
        .service-data-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 4px;
        }
        .service-data-editor-title {
          font-weight: 500;
        }
        .service-data-editor-actions {
          display: flex;
          gap: 8px;
        }
        .code-editor-wrapper.error {
          border: 1px solid color: var(--error-color, red);
          border-radius: 4px;
          padding: 1px;
        }
        .yaml-error-message {
          color: var(--error-color, red);
          font-size: 14px;
          margin: 6px;
          white-space: pre-wrap;
          font-family: Consolas, Menlo, Monaco, monospace;
          line-height: 1.4;
        }
        .help-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 0.9em;
        }
        .help-table th,
        .help-table td {
          border: 1px solid var(--divider-color, #444);
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        .help-table thead {
          background: var(--card-background-color, #222);
          font-weight: bold;
        }
        .help-title {
          font-weight: bold;
          margin-top: 16px;
          font-size: 1em;
        }
        code {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 4px;
          border-radius: 4px;
        } 
        .icon-button {
          display: inline-flex;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
          align-self: center;
          align-items: center;
          padding: 12px;
        }
        .icon-button:hover {
          color: var(--primary-color, #2196f3);
        }
        .icon-button-disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        .help-text {
          padding: 12px 25px;
        }
        .add-action-button-wrapper {
          display: flex;
          justify-content: center;
        }
      `;
  }
  render() {
    if (!this._config) return html``;
    if (this._entityEditorIndex !== null) {
      var _this$_config$entitie;
      const entity = (_this$_config$entitie = this._config.entities) === null || _this$_config$entitie === void 0 ? void 0 : _this$_config$entitie[this._entityEditorIndex];
      return this._renderEntityEditor(entity);
    } else if (this._actionEditorIndex !== null) {
      var _this$_config$actions;
      const action = (_this$_config$actions = this._config.actions) === null || _this$_config$actions === void 0 ? void 0 : _this$_config$actions[this._actionEditorIndex];
      return this._renderActionEditor(action);
    }
    return this._renderMainEditor();
  }
  _renderMainEditor() {
    if (!this._config) return html``;
    let entities = [...(this._config.entities ?? [])];
    let actions = [...(this._config.actions ?? [])];

    // Append a blank row only for rendering (not saved)
    if (entities.length === 0 || entities[entities.length - 1].entity_id) {
      entities.push({
        entity_id: ""
      });
    }
    return html`
        <div class="form-row entity-group">
          <div class="entity-group-header">
            <div class="entity-group-title">
              Entities*
            </div>
          </div>
          <yamp-sortable @item-moved=${e => this._onEntityMoved(e)}>
            <div class="sortable-container">
              ${entities.map((ent, idx) => {
      var _this$_config$entitie2;
      return html`
                <div class="entity-row-inner ${idx < entities.length - 1 ? 'sortable-item' : ''}" data-index="${idx}">
                  <div class="handle ${idx === entities.length - 1 ? 'handle-disabled' : ''}">
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </div>
                  <div class="grow-children">
                    ${
      /* ha-entity-picker will show "[Object object]" for entities with extra properties,
         so we'll get around that by using ha-selector. However ha-selector always renders 
         as a required field for some reason. This is confusing for the last entity picker, 
         used to add a new entity, which is always blank and not required. So for the last
         last entity only, we'll use ha-entity-picker. This entity will never have extra
         properties, because as soon as it's populated, a new blank entity is added below it
      */
      idx === entities.length - 1 && !ent.entity_id ? html`
                          <ha-entity-picker
                            .hass=${this.hass}
                            .value=${ent.entity_id}
                            .includeDomains=${["media_player"]}
                            .excludeEntities=${((_this$_config$entitie2 = this._config.entities) === null || _this$_config$entitie2 === void 0 ? void 0 : _this$_config$entitie2.map(e => e.entity_id)) ?? []}
                            clearable
                            @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                          ></ha-entity-picker>
                        ` : html`
                          <ha-selector
                            .hass=${this.hass}
                            .selector=${{
        entity: {
          domain: "media_player"
        }
      }}
                            .value=${ent.entity_id}
                            clearable
                            @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                          ></ha-selector>
                        `}
                  </div>
                  <div class="entity-row-actions">
                    <ha-icon
                      class="icon-button ${!ent.entity_id ? "icon-button-disabled" : ""}"
                      icon="mdi:pencil"
                      title="Edit Entity Settings"
                      @click=${() => this._onEditEntity(idx)}
                    ></ha-icon>
                  </div>
                </div>
              `;
    })}
            </div>
          </yamp-sortable>
        </div>
  
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="match-theme-toggle"
              .checked=${this._config.match_theme ?? false}
              @change=${e => this._updateConfig("match_theme", e.target.checked)}
            ></ha-switch>
            <span>Match Theme</span>
          </div>
          <div>
            <ha-switch
              id="alternate-progress-bar-toggle"
              .checked=${this._config.alternate_progress_bar ?? false}
              @change=${e => this._updateConfig("alternate_progress_bar", e.target.checked)}
            ></ha-switch>
            <span>Alternate Progress Bar</span>
          </div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="collapse-on-idle-toggle"
              .checked=${this._config.collapse_on_idle ?? false}
              @change=${e => this._updateConfig("collapse_on_idle", e.target.checked)}
            ></ha-switch>
            <span>Collapse on Idle</span>
          </div>
          <div>
            <ha-switch
              id="always-collapsed-toggle"
              .checked=${this._config.always_collapsed ?? false}
              @change=${e => this._updateConfig("always_collapsed", e.target.checked)}
            ></ha-switch>
            <span>Always Collapsed</span>
          </div>
          ${this._config.always_collapsed ? html`
            <div>
              <ha-switch
                id="expand-on-search-toggle"
                .checked=${this._config.expand_on_search ?? false}
                @change=${e => this._updateConfig("expand_on_search", e.target.checked)}
              ></ha-switch>
              <span>Expand on Search</span>
            </div>
          ` : nothing}
        </div>

        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      number: {
        min: 0,
        step: 1000,
        unit_of_measurement: "ms",
        mode: "box"
      }
    }}
              .value=${this._config.idle_timeout_ms ?? 60000}
              label="Idle Timeout (ms)"
              @value-changed=${e => this._updateConfig("idle_timeout_ms", e.detail.value)}
            ></ha-selector>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="Reset to default"
            @click=${() => this._updateConfig("idle_timeout_ms", 60000)}
          ></ha-icon>
        </div>
   
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "slider",
          label: "Slider"
        }, {
          value: "stepper",
          label: "Stepper"
        }]
      }
    }}
            .value=${this._config.volume_mode ?? "slider"}
            label="Volume Mode"
            @value-changed=${e => this._updateConfig("volume_mode", e.detail.value)}
          ></ha-selector>
        </div>
        ${this._config.volume_mode === "stepper" ? html`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{
      number: {
        min: 0.01,
        max: 1,
        step: 0.01,
        unit_of_measurement: "",
        mode: "box"
      }
    }}
                .value=${this._config.volume_step ?? 0.05}
                label="Volume Step (0.05 = 5%)"
                @value-changed=${e => this._updateConfig("volume_step", e.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="Reset to default"
              @click=${() => this._updateConfig("volume_step", 0.05)}
            ></ha-icon>
          </div>
        ` : nothing}

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "auto",
          label: "Auto"
        }, {
          value: "always",
          label: "Always"
        }]
      }
    }}
            .value=${this._config.show_chip_row ?? "auto"}
            label="Show Chip Row"
            @value-changed=${e => this._updateConfig("show_chip_row", e.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="hold-to-pin-toggle"
              .checked=${this._config.hold_to_pin ?? false}
              @change=${e => this._updateConfig("hold_to_pin", e.target.checked)}
            ></ha-switch>
            <span>Hold to Pin</span>
          </div>
        </div>   
        <div class="form-row">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.idle_image ?? ""}
             .includeDomains=${["camera", "image"]}
            label="Idle Image Entity"
            clearable
            @value-changed=${e => this._updateConfig("idle_image", e.detail.value)}
          ></ha-entity-picker>
        </div>

        <div class="form-row action-group">
          <div class="action-group-header">
            <div class="action-group-title">
              Actions
            </div>
          </div>
          <yamp-sortable @item-moved=${e => this._onActionMoved(e)}>
            <div class="sortable-container">
              ${actions.map((act, idx) => html`
                <div class="action-row-inner sortable-item">
                  <div class="handle action-handle">
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </div>
                  ${act !== null && act !== void 0 && act.icon ? html`
                    <ha-icon 
                    class="action-icon"
                    icon="${act === null || act === void 0 ? void 0 : act.icon}"></ha-icon>
                  ` : html`
                    <span class="action-icon-placeholder"></span>
                  `}
                  <div class="grow-children">
                    <ha-textfield
                      placeholder="(Icon Only)"
                      .value=${(act === null || act === void 0 ? void 0 : act.name) ?? ""}
                      helper="${act !== null && act !== void 0 && act.menu_item ? `Open Menu Item: ${act === null || act === void 0 ? void 0 : act.menu_item}` : act !== null && act !== void 0 && act.service ? `Call Service: ${act === null || act === void 0 ? void 0 : act.service}` : `Not Configured`}"
                      .helperPersistent=${true}
                      @input=${a => this._onActionChanged(idx, a.target.value)}
                    ></ha-textfield>
                  </div>
                  <div class="action-row-actions">
                    <ha-icon
                      class="icon-button"
                      icon="mdi:pencil"
                      title="Edit Action Settings"
                      @click=${() => this._onEditAction(idx)}
                    ></ha-icon>
                    <ha-icon
                      class="icon-button"
                      icon="mdi:trash-can"
                      title="Delete Action"
                      @click=${() => this._removeAction(idx)}
                    ></ha-icon>
                  </div>
                </div>
              `)}
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="Add Action"
              @click=${() => {
      const newActions = [...(this._config.actions ?? []), {}];
      const newIndex = newActions.length - 1;
      this._updateConfig("actions", newActions);
      this._onEditAction(newIndex);
    }}
            ></ha-icon>
          </div>
        </div>

      `;
  }
  _renderEntityEditor(entity) {
    var _this$hass2;
    const stateObj = (_this$hass2 = this.hass) === null || _this$hass2 === void 0 || (_this$hass2 = _this$hass2.states) === null || _this$hass2 === void 0 ? void 0 : _this$hass2[entity === null || entity === void 0 ? void 0 : entity.entity_id];
    const showGroupVolume = this._supportsFeature(stateObj, SUPPORT_GROUPING);
    return html`
        <div class="entity-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromEntityEditor}>
          </ha-icon>
          <div class="entity-editor-title">Edit Entity</div>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
      entity: {
        domain: "media_player"
      }
    }}
            .value=${(entity === null || entity === void 0 ? void 0 : entity.entity_id) ?? ""}
          
            disabled
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="Name"
            .value=${(entity === null || entity === void 0 ? void 0 : entity.name) ?? ""}
            @input=${e => this._updateEntityProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

<div class="form-row form-row-multi-column">
  <div>
    <ha-switch
      id="ma-template-toggle"
      .checked=${this._useTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity)}
      @change=${e => {
      this._useTemplate = e.target.checked;
    }}
    ></ha-switch>
    <label for="ma-template-toggle">Use template for Music Assistant Entity</label>
  </div>
</div>

${this._useTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ? html`
      <div class="form-row">
        <div class=${this._yamlError && ((entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ?? "").trim() !== "" ? "code-editor-wrapper error" : "code-editor-wrapper"}>
          <ha-code-editor
            id="ma-template-editor"
            label="Music Assistant Entity Template (Jinja)"
            .hass=${this.hass}
            mode="jinja2"
            autocomplete-entities
            .value=${(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ?? ""}
            @value-changed=${e => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
          ></ha-code-editor>
          <div class="help-text">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:
            <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_select.kitchen_stream_source','Music Stream 1') %}
  media_player.picore_house
{% else %}
  media_player.ma_wiim_mini
{% endif %}</pre>
           </pre>
          </div>
        </div>
      </div>
    ` : html`
      <div class="form-row">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._isEntityId(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ? entity.music_assistant_entity : ""}
          .includeDomains=${["media_player"]}
          label="Music Assistant Entity (optional)"
          helper="Pick a Music Assistant player for search."
          clearable
          @value-changed=${e => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
        ></ha-entity-picker>
      </div>
    `}

        ${showGroupVolume ? html`
          <div class="form-row">
            <ha-switch
              id="group-volume-toggle"
              .checked=${(entity === null || entity === void 0 ? void 0 : entity.group_volume) ?? true}
              @change=${e => this._updateEntityProperty("group_volume", e.target.checked)}
            ></ha-switch>
            <label for="group-volume-toggle">Group Volume</label>
          </div>
        ` : nothing}

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="vol-template-toggle"
              .checked=${this._useVolTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.volume_entity)}
              @change=${e => {
      this._useVolTemplate = e.target.checked;
    }}
            ></ha-switch>
            <label for="vol-template-toggle">Use template for Volume Entity</label>
          </div>
        </div>

        ${this._useVolTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.volume_entity) ? html`
              <div class="form-row">
                <div class=${this._yamlError && ((entity === null || entity === void 0 ? void 0 : entity.volume_entity) ?? "").trim() !== "" ? "code-editor-wrapper error" : "code-editor-wrapper"}>
                  <ha-code-editor
                    id="vol-template-editor"
                    label="Volume Entity Template (Jinja)"
                    .hass=${this.hass}
                    mode="jinja2"
                    autocomplete-entities
                    .value=${(entity === null || entity === void 0 ? void 0 : entity.volume_entity) ?? ""}
                    @value-changed=${e => this._updateEntityProperty("volume_entity", e.detail.value)}
                  ></ha-code-editor>
                  <div class="help-text">
                    <ha-icon icon="mdi:information-outline"></ha-icon>
                    Enter a Jinja template that resolves to an entity_id (e.g. <code>media_player.office_homepod</code> or <code>remote.soundbar</code>).
                    Example switching volume entity based on a boolean:
                    <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_boolean.tv_volume','on') %}
  remote.soundbar
{% else %}
  media_player.office_homepod
{% endif %}</pre>
                  </div>
                </div>
              </div>
            ` : html`
              <div class="form-row">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${this._isEntityId(entity === null || entity === void 0 ? void 0 : entity.volume_entity) ? entity.volume_entity : (entity === null || entity === void 0 ? void 0 : entity.entity_id) ?? ""}
                  .includeDomains=${["media_player", "remote"]}
                  label="Volume Entity"
                  clearable
                  @value-changed=${e => {
      const value = e.detail.value;
      this._updateEntityProperty("volume_entity", value);
      if (!value || value === entity.entity_id) {
        // sync_power is meaningless in these cases
        this._updateEntityProperty("sync_power", false);
      }
    }}
                ></ha-entity-picker>
              </div>
            `}

        ${entity !== null && entity !== void 0 && entity.volume_entity && entity.volume_entity !== entity.entity_id ? html`
              <div class="form-row form-row-multi-column">
                <div>
                  <ha-switch
                    id="sync-power-toggle"
                    .checked=${(entity === null || entity === void 0 ? void 0 : entity.sync_power) ?? false}
                    @change=${e => this._updateEntityProperty("sync_power", e.target.checked)}
                  ></ha-switch>
                  <label for="sync-power-toggle">Sync Power</label>
                </div>
              </div>
            ` : nothing}

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="follow-active-toggle"
              .checked=${(entity === null || entity === void 0 ? void 0 : entity.follow_active_volume) ?? false}
              @change=${e => this._updateEntityProperty("follow_active_volume", e.target.checked)}
            ></ha-switch>
            <label for="follow-active-toggle">Volume Entity Follows Active Entity</label>
          </div>
        </div>

        ${entity !== null && entity !== void 0 && entity.follow_active_volume ? html`
          <div class="form-row">
            <div class="help-text">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              When enabled, the volume entity will automatically follow the active playback entity. Note: This overrides the selected volume entity.
              <br><br>
             
            </div>
          </div>
        ` : nothing}
        </div>
      `;
  }
  _renderActionEditor(action) {
    var _action$menu_item, _action$menu_item2;
    const actionMode = this._actionMode ?? (action !== null && action !== void 0 && (_action$menu_item = action.menu_item) !== null && _action$menu_item !== void 0 && _action$menu_item.trim() ? "menu" : "service");
    return html`
        <div class="action-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromActionEditor}>
          </ha-icon>
          <div class="action-editor-title">Edit Action</div>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="Name"
            placeholder="(Icon Only)"
            .value=${(action === null || action === void 0 ? void 0 : action.name) ?? ""}
            @input=${e => this._updateActionProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="Icon"
            .hass=${this.hass}
            .value=${(action === null || action === void 0 ? void 0 : action.icon) ?? ""}
            @value-changed=${e => this._updateActionProperty("icon", e.detail.value)}
          ></ha-icon-picker>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="Action Type"
            .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "menu",
          label: "Open a Card Menu Item"
        }, {
          value: "service",
          label: "Call a Service"
        }]
      }
    }}
            .value=${this._actionMode ?? (action !== null && action !== void 0 && (_action$menu_item2 = action.menu_item) !== null && _action$menu_item2 !== void 0 && _action$menu_item2.trim() ? "menu" : "service")}
            @value-changed=${e => {
      const mode = e.detail.value;
      this._actionMode = mode;
      if (mode === "service") {
        this._updateActionProperty("menu_item", undefined);
      } else if (mode === "menu") {
        this._updateActionProperty("service", undefined);
        this._updateActionProperty("service_data", undefined);
        this._updateActionProperty("script_variable", undefined);
      }
    }}
          ></ha-selector>
        </div>
        
        ${actionMode === "menu" ? html`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="Menu Item"
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "",
          label: ""
        }, {
          value: "search",
          label: "Search"
        }, {
          value: "source",
          label: "Source"
        }, {
          value: "more-info",
          label: "More Info"
        }, {
          value: "group-players",
          label: "Group Players"
        }]
      }
    }}
              .value=${(action === null || action === void 0 ? void 0 : action.menu_item) ?? ""}
              @value-changed=${e => this._updateActionProperty("menu_item", e.detail.value || undefined)}
            ></ha-selector>
          </div>
        ` : nothing} 
        ${actionMode === 'service' ? html`
          <div class="form-row">
            <ha-combo-box
              label="Service"
              .hass=${this.hass}
              .value=${action.service ?? ""}
              .items=${this._serviceItems ?? []}
              item-value-path="value"
              item-label-path="label"
              required
              @value-changed=${e => this._updateActionProperty("service", e.detail.value)}
            ></ha-combo-box>
          </div>

          ${typeof action.service === "string" && action.service.startsWith("script.") ? html`
            <div class="form-row form-row-multi-column">
              <div>
                <ha-switch
                  id="script-variable-toggle"
                  .checked=${(action === null || action === void 0 ? void 0 : action.script_variable) ?? false}
                  @change=${e => this._updateActionProperty("script_variable", e.target.checked)}
                ></ha-switch>
                <span>Script Variable (yamp_entity)</span>
              </div>
            </div>
          ` : nothing}

          ${action.service ? html`
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>

              Use <code>entity_id: current</code> to target the card's currently selected
              media player entity. The <ha-icon icon="mdi:play-circle-outline"></ha-icon> button
              below does not work if you use this feature.

            </div>
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>
            Changes to the service data below are not committed to the config until 
            <ha-icon icon="mdi:content-save"></ha-icon> is clicked!
            </div>
            <div class="form-row">
              <div class="service-data-editor-header">
                <div class="service-data-editor-title">Service Data</div>
                <div class="service-data-editor-actions">
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:content-save"
                    title="Save Service Data"
                    @click=${this._saveYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:backup-restore"
                    title="Revert to Saved Service Data"
                    @click=${this._revertYamlEditor}
                  ></ha-icon>
                  <ha-icon

                    class="icon-button ${this._yamlError || this._yamlDraftUsesCurrentEntity() || !(action !== null && action !== void 0 && action.service) ? "icon-button-disabled" : ""}"

                    icon="mdi:play-circle-outline"
                    title="Test Action"
                    @click=${this._testServiceCall}
                  ></ha-icon>              
                </div>
            </div>
            <div class=${this._yamlError && this._yamlDraft.trim() !== "" ? "code-editor-wrapper error" : "code-editor-wrapper"}>
              <ha-code-editor
                id="service-data-editor"
                label="Service Data"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                mode="yaml"
                .value=${action !== null && action !== void 0 && action.service_data ? yaml.dump(action.service_data) : ""}
                @value-changed=${e => {
      /* the yaml will be parsed in real time to detect errors, but we will defer 
        updating the config until the save button above the editor is clicked.
      */
      this._yamlDraft = e.detail.value;
      this._yamlModified = true;
      try {
        const parsed = yaml.load(this._yamlDraft);
        if (parsed && typeof parsed === "object") {
          this._yamlError = null;
        } else {
          this._yamlError = "Invalid YAML";
        }
      } catch (err) {
        this._yamlError = err.message;
      }
    }}
              ></ha-code-editor>
              ${this._yamlError && this._yamlDraft.trim() !== "" ? html`<div class="yaml-error-message">${this._yamlError}</div>` : nothing}
            </div>
          ` : nothing}
        ` : nothing}
      </div>`;
  }
  _onEntityChanged(index, newValue) {
    const original = this._config.entities ?? [];
    const updated = [...original];
    if (!newValue) {
      // Remove empty row
      updated.splice(index, 1);
    } else {
      updated[index] = {
        ...updated[index],
        entity_id: newValue
      };
    }

    // Always strip blank row before writing to config
    const cleaned = updated.filter(e => e.entity_id && e.entity_id.trim() !== "");
    this._updateConfig("entities", cleaned);
  }
  _onActionChanged(index, newValue) {
    const original = this._config.actions ?? [];
    const updated = [...original];
    updated[index] = {
      ...updated[index],
      name: newValue
    };
    this._updateConfig("actions", updated);
  }
  _onEditEntity(index) {
    var _this$_config$entitie3;
    this._entityEditorIndex = index;
    const ent = (_this$_config$entitie3 = this._config.entities) === null || _this$_config$entitie3 === void 0 ? void 0 : _this$_config$entitie3[index];
    const mae = ent === null || ent === void 0 ? void 0 : ent.music_assistant_entity;
    this._useTemplate = this._looksLikeTemplate(mae) ? true : false;
    const vol = ent === null || ent === void 0 ? void 0 : ent.volume_entity;
    this._useVolTemplate = this._looksLikeTemplate(vol) ? true : false;
  }
  _onEditAction(index) {
    var _this$_config$actions2;
    this._actionEditorIndex = index;
    const action = (_this$_config$actions2 = this._config.actions) === null || _this$_config$actions2 === void 0 ? void 0 : _this$_config$actions2[index];
    this._actionMode = action !== null && action !== void 0 && action.menu_item ? "menu" : "service";
  }
  _onBackFromEntityEditor() {
    this._entityEditorIndex = null;
    this._useTemplate = null; // re-detect next open
    this._useVolTemplate = null; // re-detect next open
  }
  _onBackFromActionEditor() {
    this._actionEditorIndex = null;
  }
  _onEntityMoved(event) {
    const {
      oldIndex,
      newIndex
    } = event.detail;

    // Don't allow moving the last blank entity
    const entities = [...this._config.entities];
    if (oldIndex >= entities.length || newIndex >= entities.length) {
      return;
    }
    const [moved] = entities.splice(oldIndex, 1);
    entities.splice(newIndex, 0, moved);
    this._updateConfig("entities", entities);
  }
  _onActionMoved(event) {
    const {
      oldIndex,
      newIndex
    } = event.detail;
    const actions = [...this._config.actions];
    if (oldIndex >= actions.length || newIndex >= actions.length) {
      return;
    }
    const [moved] = actions.splice(oldIndex, 1);
    actions.splice(newIndex, 0, moved);
    this._updateConfig("actions", actions);
  }
  _removeAction(index) {
    const actions = [...(this._config.actions ?? [])];
    if (index < 0 || index >= actions.length) return;
    actions.splice(index, 1);
    this._updateConfig("actions", actions);
  }
  _saveYamlEditor() {
    try {
      const parsed = yaml.load(this._yamlDraft);
      if (!parsed || typeof parsed !== "object") {
        this._yamlError = "YAML is not a valid object.";
        return;
      }
      this._updateActionProperty("service_data", parsed);
      this._yamlDraft = yaml.dump(parsed);
      this._yamlError = null;
      this._parsedYaml = parsed;
    } catch (err) {
      this._yamlError = err.message;
    }
  }
  _revertYamlEditor() {
    var _this$_config$actions3;
    const editor = this.shadowRoot.querySelector("#service-data-editor");
    const currentAction = (_this$_config$actions3 = this._config.actions) === null || _this$_config$actions3 === void 0 ? void 0 : _this$_config$actions3[this._actionEditorIndex];
    if (!editor || !currentAction) return;
    const yamlText = currentAction.service_data ? yaml.dump(currentAction.service_data) : "";
    editor.value = yamlText;
    this._yamlDraft = yamlText;
    this._yamlError = null;
    this._yamlModified = false;
  }
  _yamlDraftUsesCurrentEntity() {
    if (!this._yamlDraft) return false;
    const regex = /^\s*entity_id\s*:\s*current\s*$/m;
    let result = regex.test(this._yamlDraft);
    return result;
  }
  async _testServiceCall() {
    var _this$_yamlDraft, _this$_config$actions4;
    if (this._yamlError || !((_this$_yamlDraft = this._yamlDraft) !== null && _this$_yamlDraft !== void 0 && _this$_yamlDraft.trim())) {
      return;
    }
    let serviceData;
    try {
      serviceData = yaml.load(this._yamlDraft);
      if (typeof serviceData !== "object" || serviceData === null) {
        console.error("Service data must be a valid object.");
        return;
      }
    } catch (e) {
      this._yamlError = e.message;
      return;
    }
    const action = (_this$_config$actions4 = this._config.actions) === null || _this$_config$actions4 === void 0 ? void 0 : _this$_config$actions4[this._actionEditorIndex];
    const service = action === null || action === void 0 ? void 0 : action.service;
    if (!service || !this.hass) {
      return;
    }
    const [domain, serviceName] = service.split(".");
    if (!domain || !serviceName) {
      return;
    }
    try {
      await this.hass.callService(domain, serviceName, serviceData);
    } catch (err) {
      console.error("Failed to call service:", err);
    }
  }
  _onToggleChanged(e) {
    const newConfig = {
      ...this._config,
      always_collapsed: e.target.checked
    };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: {
        config: newConfig
      }
    }));
  }
}
customElements.define("yet-another-media-player-editor-beta", YetAnotherMediaPlayerEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player-beta",
  name: "Yet Another Media Player-beta",
  description: "YAMP is a multi-entity media card with custom actions",
  preview: true
});
class YetAnotherMediaPlayerCard extends LitElement {
  _handleChipPointerDown(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerDown(e, idx);
    }
  }
  _handleChipPointerMove(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerMove(e, idx);
    }
  }
  _handleChipPointerUp(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerUp(e, idx);
    }
  }
  _hoveredSourceLetterIndex = null;
  // Stores the last grouping master id for group chip selection
  _lastGroupingMasterId = null;
  _debouncedVolumeTimer = null;
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }

  // Scroll to first source option starting with the given letter
  _scrollToSourceLetter(letter) {
    // Find the options sheet (source list) in the shadow DOM
    const menu = this.renderRoot.querySelector('.entity-options-sheet');
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('.entity-options-item'));
    const item = items.find(el => (el.textContent || "").trim().toUpperCase().startsWith(letter));
    if (item) item.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  // Show Stop button if supported and layout allows.
  _shouldShowStopButton(stateObj) {
    var _this$renderRoot;
    if (!this._supportsFeature(stateObj, SUPPORT_STOP)) return false;
    // Show if wide layout or few controls.
    const row = (_this$renderRoot = this.renderRoot) === null || _this$renderRoot === void 0 ? void 0 : _this$renderRoot.querySelector('.controls-row');
    if (!row) return true; // Default to show if can't measure
    const minWide = row.offsetWidth > 480;
    const controls = countMainControls(stateObj, (s, f) => this._supportsFeature(s, f));
    // Limit Stop visibility on compact layouts.
    return minWide || controls <= 5;
  }
  get sortedEntityIds() {
    return [...this.entityIds].sort((a, b) => {
      const tA = this._playTimestamps[a] || 0;
      const tB = this._playTimestamps[b] || 0;
      return tB - tA;
    });
  }

  // Return array of groups, ordered by most recent play
  get groupedSortedEntityIds() {
    if (!this.entityIds || !Array.isArray(this.entityIds)) return [];
    const map = {};
    for (const id of this.entityIds) {
      const key = this._getGroupKey(id);
      if (!map[key]) map[key] = {
        ids: [],
        ts: 0
      };
      map[key].ids.push(id);
      map[key].ts = Math.max(map[key].ts, this._playTimestamps[id] || 0);
    }
    return Object.values(map).sort((a, b) => b.ts - a.ts) // sort groups by recency
    .map(g => g.ids.sort()); // sort ids alphabetically inside each group
  }
  static properties = {
    hass: {},
    config: {},
    _selectedIndex: {
      state: true
    },
    _lastPlaying: {
      state: true
    },
    _shouldDropdownOpenUp: {
      state: true
    },
    _pinnedIndex: {
      state: true
    },
    _showSourceList: {
      state: true
    },
    _holdToPin: {
      state: true
    }
  };
  static styles = (() => yampCardStyles)();
  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._playTimestamps = {};
    this._showSourceMenu = false;
    this._shouldDropdownOpenUp = false;
    this._collapsedArtDominantColor = "#444";
    this._lastArtworkUrl = null;
    // Timer for progress updates
    this._progressTimer = null;
    this._progressValue = null;
    this._lastProgressEntityId = null;
    this._pinnedIndex = null;
    // Accent color, updated in setConfig
    this._customAccent = "#ff9800";
    // Outside click handler for source dropdown
    this._sourceDropdownOutsideHandler = null;
    this._isIdle = false;
    this._idleTimeout = null;
    // Overlay state for entity options
    this._showEntityOptions = false;
    // Overlay state for grouping sheet
    this._showGrouping = false;
    // Overlay state for source list sheet
    this._showSourceList = false;
    // Alternate progress‑bar mode
    this._alternateProgressBar = false;
    // Group base volume for group gain logic
    this._groupBaseVolume = null;
    // Search sheet state variables
    this._searchOpen = false;
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchResults = [];
    this._searchError = "";
    this._searchTotalRows = 15; // minimum 15 rows for layout padding
    // Per-chip linger map to keep MA entity selected briefly after pause
    this._playbackLingerByIdx = {};
    // Show search-in-sheet flag for entity options sheet
    this._showSearchInSheet = false;
    this._showResolvedEntities = false;
    // Collapse on load if nothing is playing (but respect linger state)
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        var _this$_playbackLinger;
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        // Don't go idle if there's an active linger
        const hasActiveLinger = ((_this$_playbackLinger = this._playbackLingerByIdx) === null || _this$_playbackLinger === void 0 ? void 0 : _this$_playbackLinger[this._selectedIndex]) && this._playbackLingerByIdx[this._selectedIndex].until > Date.now();
        if (stateObj && stateObj.state !== "playing" && !hasActiveLinger) {
          this._isIdle = true;
          this.requestUpdate();
        }
      }
    }, 0);
    // Store previous collapsed state
    this._prevCollapsed = null;
    // Search attempted flag for search-in-sheet
    this._searchAttempted = false;
    // Media class filter for search results
    this._searchMediaClassFilter = "all";
    // Track last search chip classes for filter chip row scroll
    this._lastSearchChipClasses = "";
    // --- swipe‑to‑filter helpers ---
    this._swipeStartX = null;
    this._searchSwipeAttached = false;
    // Snapshot of entities that were playing when manual‑select started.
    this._manualSelectPlayingSet = null;
    this._idleTimeoutMs = 60000;
    this._volumeStep = 0.05;
    // Optimistic playback state after control clicks
    this._optimisticPlayback = null;
    // Debounce entity switching to prevent rapid state changes
    this._lastPlaybackEntityId = null;
    this._entitySwitchDebounceTimer = null;
    // Track previous states to detect transitions
    this._lastMainState = null;
    this._lastMaState = null;
    // Cache resolved MA entity per index to use during render without switching chips
    this._maResolveCache = {}; // { [idx:number]: { id: string, ts: number } }
    this._maResolveTtlMs = 7000; // refresh every ~7s
    // Manual select timeout for hold-to-pin functionality
    this._manualSelectTimeout = null;
    // Cache resolved Volume entity per index (template or static)
    this._volResolveCache = {}; // { [idx:number]: { id: string, ts: number } }
    this._volResolveTtlMs = 7000; // refresh every ~7s
    // Track the last entity that was playing for better pause/resume behavior
    this._lastPlayingEntityId = null;
    // Control focus lock to prefer most-recently controlled entity in brief paused window
    this._controlFocusEntityId = null;
  }

  // Resolve and cache the MA entity for a given chip index (template or static)
  async _ensureResolvedMaForIndex(idx) {
    var _this$entityObjs;
    const obj = (_this$entityObjs = this.entityObjs) === null || _this$entityObjs === void 0 ? void 0 : _this$entityObjs[idx];
    if (!obj) return;
    const raw = obj.music_assistant_entity;
    if (!raw || typeof raw !== 'string') {
      // Clear cache if no MA or not a string
      delete this._maResolveCache[idx];
      return;
    }
    const looksTemplate = raw.includes('{{') || raw.includes('{%');
    const now = Date.now();
    const cached = this._maResolveCache[idx];
    if (!looksTemplate) {
      // Static MA — always cache for consistency
      this._maResolveCache[idx] = {
        id: raw,
        ts: now
      };
      return;
    }
    // For templates, respect TTL to avoid spamming /api/template
    if (cached && now - cached.ts < this._maResolveTtlMs && cached.id) return;
    try {
      const resolved = await this._resolveTemplateAtActionTime(raw, obj.entity_id);
      if (resolved && typeof resolved === 'string') {
        // Always cache the resolved entity for service calls
        // The rendering logic will handle validation separately
        this._maResolveCache[idx] = {
          id: resolved,
          ts: now
        };
        // Trigger re-render so artwork/state can use the resolved id
        this.requestUpdate();
      }
    } catch (_) {
      // Leave existing cache (if any); do not throw
    }
  }

  // Resolve and cache the Volume entity for a given chip index (template or static)
  async _ensureResolvedVolForIndex(idx) {
    var _this$entityObjs2;
    const obj = (_this$entityObjs2 = this.entityObjs) === null || _this$entityObjs2 === void 0 ? void 0 : _this$entityObjs2[idx];
    if (!obj) return;

    // If follow_active_volume is enabled, we don't need to cache a specific volume entity
    // as it will be determined dynamically based on the active entity
    if (obj.follow_active_volume) {
      delete this._volResolveCache[idx];
      return;
    }
    const raw = obj.volume_entity;
    if (!raw || typeof raw !== 'string') {
      // Clear cache if no volume entity or not a string
      delete this._volResolveCache[idx];
      return;
    }
    const looksTemplate = raw.includes('{{') || raw.includes('{%');
    const now = Date.now();
    const cached = this._volResolveCache[idx];
    if (!looksTemplate) {
      // Static volume entity — always cache for consistency
      this._volResolveCache[idx] = {
        id: raw,
        ts: now
      };
      return;
    }
    // For templates, respect TTL to avoid spamming /api/template
    if (cached && now - cached.ts < this._volResolveTtlMs && cached.id) return;
    try {
      const resolved = await this._resolveTemplateAtActionTime(raw, obj.entity_id);
      if (resolved && typeof resolved === 'string') {
        this._volResolveCache[idx] = {
          id: resolved,
          ts: now
        };
        this.requestUpdate();
      }
    } catch (_) {
      // Leave existing cache (if any); do not throw
    }
  }

  // Get the resolved playback entity id for a chip index, preferring cache
  _getResolvedPlaybackEntityIdSync(idx) {
    return this._getEntityForPurpose(idx, 'playback_control');
  }

  // Get the resolved volume entity id for a chip index, preferring cache
  _getResolvedVolumeEntityIdSync(idx) {
    var _this$_volResolveCach;
    const obj = this.entityObjs[idx];
    if (!obj) return null;

    // If follow_active_volume is enabled, return the active playback entity
    if (obj.follow_active_volume) {
      return this._getActivePlaybackEntityId();
    }
    const cached = (_this$_volResolveCach = this._volResolveCache) === null || _this$_volResolveCach === void 0 || (_this$_volResolveCach = _this$_volResolveCach[idx]) === null || _this$_volResolveCach === void 0 ? void 0 : _this$_volResolveCach.id;
    if (cached && typeof cached === 'string') return cached;
    const raw = obj.volume_entity;
    if (raw && typeof raw === 'string') {
      const looksTemplate = raw.includes('{{') || raw.includes('{%');
      if (!looksTemplate) return raw;
    }
    return obj.entity_id;
  }

  // Get the actual resolved MA entity for state detection (can be unconfigured entities)
  _getActualResolvedMaEntityForState(idx) {
    var _this$_maResolveCache;
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    const cached = (_this$_maResolveCache = this._maResolveCache) === null || _this$_maResolveCache === void 0 || (_this$_maResolveCache = _this$_maResolveCache[idx]) === null || _this$_maResolveCache === void 0 ? void 0 : _this$_maResolveCache.id;
    if (cached && typeof cached === 'string') {
      return cached;
    }

    // No cache - check if we have a static MA entity
    const rawMaEntity = obj.music_assistant_entity;
    if (rawMaEntity && typeof rawMaEntity === 'string' && !rawMaEntity.includes('{{') && !rawMaEntity.includes('{%')) {
      return rawMaEntity;
    }

    // No MA entity or template - use main entity
    return obj.entity_id;
  }

  // Resolve template at action time with fallback to main entity (async)
  async _resolveTemplateAtActionTime(templateString, fallbackEntityId) {
    if (!templateString || typeof templateString !== 'string') return fallbackEntityId;

    // Not a template — return as-is
    if (!templateString.includes('{{') && !templateString.includes('{%')) {
      return templateString;
    }
    try {
      const res = await this.hass.callApi('POST', 'template', {
        template: templateString
      });
      const out = (res || '').toString().trim();
      // Basic validation: must look like an entity_id
      if (out && /^([a-z_]+)\.[A-Za-z0-9_]+$/.test(out)) return out;
      return fallbackEntityId;
    } catch (error) {
      console.warn('Failed to resolve template:', error);
      return fallbackEntityId; // Fallback to main entity
    }
  }

  /**
   * Attach horizontal swipe on the search‑results area to cycle media‑class filters.
   */
  _attachSearchSwipe() {
    if (this._searchSwipeAttached) return;
    const area = this.renderRoot.querySelector('.entity-options-search-results');
    if (!area) return;
    this._searchSwipeAttached = true;
    const threshold = 40; // px needed to trigger change

    const touchstartHandler = e => {
      if (e.touches.length === 1) {
        this._swipeStartX = e.touches[0].clientX;
      }
    };
    const touchendHandler = e => {
      if (this._swipeStartX === null) return;
      const endX = e.changedTouches && e.changedTouches[0].clientX || null;
      if (endX === null) {
        this._swipeStartX = null;
        return;
      }
      const dx = endX - this._swipeStartX;
      if (Math.abs(dx) > threshold) {
        const classes = Array.from(new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean)));
        const filterOrder = ['all', ...classes];
        const currIdx = filterOrder.indexOf(this._searchMediaClassFilter || 'all');
        const dir = dx < 0 ? 1 : -1; // swipe left -> next, right -> prev
        let nextIdx = (currIdx + dir + filterOrder.length) % filterOrder.length;
        this._searchMediaClassFilter = filterOrder[nextIdx];
        this.requestUpdate();
      }
      this._swipeStartX = null;
    };
    area.addEventListener('touchstart', touchstartHandler, {
      passive: true
    });
    area.addEventListener('touchend', touchendHandler, {
      passive: true
    });

    // Store handlers for cleanup
    area._searchSwipeHandlers = {
      touchstart: touchstartHandler,
      touchend: touchendHandler
    };
  }

  /**
   * Open the search sheet pre‑filled with the current track's artist and
   * launch the search immediately (only when media_artist is present).
   */
  _searchArtistFromNowPlaying() {
    var _ref;
    const artist = ((_ref = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj) === null || _ref === void 0 || (_ref = _ref.attributes) === null || _ref === void 0 ? void 0 : _ref.media_artist) || "";
    if (!artist) return; // nothing to search

    // Open overlay + search sheet
    this._showEntityOptions = true;
    this._showSearchInSheet = true;

    // Prefill search state
    this._searchQuery = artist;
    this._searchError = "";
    this._searchAttempted = false;
    this._searchLoading = false;

    // Render, then run search
    this.requestUpdate();
    this.updateComplete.then(() => this._doSearch());
  }
  // Show search sheet inside entity options
  _showSearchSheetInOptions() {
    this._showSearchInSheet = true;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchAttempted = false;
    this.requestUpdate();

    // Handle focus for expand on search
    const focusDelay = this._alwaysCollapsed && this._expandOnSearch ? 300 : 200;
    setTimeout(() => {
      const inp = this.renderRoot.querySelector('#search-input-box');
      if (inp) {
        inp.focus();
      } else {
        // If input not found, try again with a longer delay
        setTimeout(() => {
          const retryInp = this.renderRoot.querySelector('#search-input-box');
          if (retryInp) {
            retryInp.focus();
          }
        }, 200);
      }
    }, focusDelay);
  }
  _hideSearchSheetInOptions() {
    this._showSearchInSheet = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchAttempted = false;
    this.requestUpdate();
    // Force layout update for expand on search
    setTimeout(() => {
      this._notifyResize();
    }, 0);
  }
  // Search sheet methods
  _searchOpenSheet() {
    this._searchOpen = true;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this.requestUpdate();
  }
  _searchCloseSheet() {
    this._searchOpen = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchLoading = false;
    this.requestUpdate();
  }
  async _doSearch() {
    this._searchAttempted = true;
    if (!this._searchQuery) return;
    this._searchLoading = true;
    this._searchError = "";
    this._searchResults = [];
    this.requestUpdate();
    try {
      const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
      const arr = await searchMedia(this.hass, searchEntityId, this._searchQuery);
      this._searchResults = Array.isArray(arr) ? arr : [];
      // remember how many rows exist in the full ("All") set, but keep at least 15 for layout
      const rows = Array.isArray(this._searchResults) ? this._searchResults.length : 0;
      this._searchTotalRows = Math.max(15, rows); // keep at least 15
    } catch (e) {
      this._searchError = e && e.message || "Unknown error";
      this._searchResults = [];
      this._searchTotalRows = 0;
    }
    this._searchLoading = false;
    this.requestUpdate();
  }
  async _playMediaFromSearch(item) {
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    playSearchedMedia(this.hass, targetEntityId, item);
    // If searching from the bottom sheet, close the entity options overlay.
    if (this._showSearchInSheet) {
      this._closeEntityOptions();
      this._showSearchInSheet = false;
    }
    this._searchCloseSheet();
  }

  // Notify Home Assistant to recalculate layout
  _notifyResize() {
    this.dispatchEvent(new Event("iron-resize", {
      bubbles: true,
      composed: true
    }));
  }

  // Extract dominant color from image
  async _extractDominantColor(imgUrl) {
    return new Promise(resolve => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        resolve(`rgb(${r},${g},${b})`);
      };
      img.onerror = function () {
        resolve("#888");
      };
    });
  }
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = config;
    this._holdToPin = !!config.hold_to_pin;
    if (this._holdToPin) {
      this._holdHandler = createHoldToPinHandler({
        onPin: idx => this._pinChip(idx),
        holdTime: 650,
        moveThreshold: 8
      });
    } else {
      this._holdHandler = null;
    }
    this._selectedIndex = 0;
    this._lastPlaying = null;
    // Set accent color

    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    // Collapse card when idle
    this._collapseOnIdle = !!config.collapse_on_idle;
    // Force always-collapsed view
    this._alwaysCollapsed = !!config.always_collapsed;
    // Expand on search option (only available when always_collapsed is true)
    this._expandOnSearch = !!config.expand_on_search;
    // Alternate progress‑bar mode
    this._alternateProgressBar = !!config.alternate_progress_bar;
    // Set idle timeout ms
    this._idleTimeoutMs = typeof config.idle_timeout_ms === "number" ? config.idle_timeout_ms : 60000;
    this._volumeStep = typeof config.volume_step === "number" ? config.volume_step : 0.05;
    // Do not mutate config.force_chip_row here.
  }

  // Returns array of entity config objects, including group_volume if present in user config.
  get entityObjs() {
    return this.config.entities.map(e => {
      const entity_id = typeof e === "string" ? e : e.entity_id;
      const name = typeof e === "string" ? "" : e.name || "";
      const volume_entity = typeof e === "string" ? undefined : e.volume_entity;
      const music_assistant_entity = typeof e === "string" ? undefined : e.music_assistant_entity;
      const sync_power = typeof e === "string" ? false : !!e.sync_power;
      const follow_active_volume = typeof e === "string" ? false : !!e.follow_active_volume;
      let group_volume;
      if (typeof e === "object" && typeof e.group_volume !== "undefined") {
        group_volume = e.group_volume;
      } else {
        var _this$hass;
        // Determine group_volume default
        const state = (_this$hass = this.hass) === null || _this$hass === void 0 || (_this$hass = _this$hass.states) === null || _this$hass === void 0 ? void 0 : _this$hass[entity_id];
        if (state && Array.isArray(state.attributes.group_members) && state.attributes.group_members.length > 0) {
          // Are any group members in entityIds?
          const otherMembers = state.attributes.group_members.filter(id => id !== entity_id);
          // Use raw config.entities to avoid circular dependency in this.entityIds
          const configEntityIds = this.config.entities.map(en => typeof en === "string" ? en : en.entity_id);
          const visibleMembers = otherMembers.filter(id => configEntityIds.includes(id));
          group_volume = visibleMembers.length > 0;
        }
      }
      return {
        entity_id,
        name,
        volume_entity,
        music_assistant_entity,
        sync_power,
        follow_active_volume,
        ...(typeof group_volume !== "undefined" ? {
          group_volume
        } : {})
      };
    });
  }

  // Unified entity resolution system
  _getEntityForPurpose(idx, purpose) {
    var _mainState$attributes;
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    switch (purpose) {
      case 'volume_control':
        // For volume control: follow active entity if enabled, otherwise use volume_entity or main entity
        if (obj.follow_active_volume) {
          return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
        }
        return this._resolveEntity(obj.volume_entity, obj.entity_id, idx) || obj.entity_id;
      case 'volume_display':
        // For volume display: show active entity if follow_active_volume enabled, otherwise show control entity
        if (obj.follow_active_volume) {
          return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
        }
        return this._resolveEntity(obj.volume_entity, obj.entity_id, idx) || obj.entity_id;
      case 'grouping_control':
        // For grouping menu: use MA entity (main entity if it's MA, or configured MA entity)
        // Check if main entity is a Music Assistant entity by checking if it supports grouping
        const mainState = this.hass.states[obj.entity_id];
        const mainIsMA = (mainState === null || mainState === void 0 || (_mainState$attributes = mainState.attributes) === null || _mainState$attributes === void 0 ? void 0 : _mainState$attributes.supported_features) && (mainState.attributes.supported_features & SUPPORT_GROUPING) !== 0;
        if (mainIsMA) {
          return obj.entity_id;
        }
        return this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx) || obj.entity_id;
      case 'playback_control':
        // For playback controls: use the entity that is actually playing
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
      case 'sorting':
        // For chip sorting: use active playback entity (MA entity if playing, otherwise main entity)
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
      default:
        return obj.entity_id;
    }
  }

  // Helper to resolve template entities
  _resolveEntity(entityTemplate, fallbackEntityId, idx) {
    if (!entityTemplate) return null;
    if (typeof entityTemplate === 'string' && (entityTemplate.includes('{{') || entityTemplate.includes('{%'))) {
      var _this$_maResolveCache2;
      // For templates, use cached resolved entity
      const cached = (_this$_maResolveCache2 = this._maResolveCache) === null || _this$_maResolveCache2 === void 0 || (_this$_maResolveCache2 = _this$_maResolveCache2[idx]) === null || _this$_maResolveCache2 === void 0 ? void 0 : _this$_maResolveCache2.id;
      return cached || fallbackEntityId;
    }
    return entityTemplate;
  }

  // Get active playback entity for a specific index
  _getActivePlaybackEntityForIndex(idx) {
    var _this$hass2, _this$hass3;
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    const mainId = obj.entity_id;
    const maId = this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx);
    const mainState = mainId ? (_this$hass2 = this.hass) === null || _this$hass2 === void 0 || (_this$hass2 = _this$hass2.states) === null || _this$hass2 === void 0 ? void 0 : _this$hass2[mainId] : null;
    const maState = maId ? (_this$hass3 = this.hass) === null || _this$hass3 === void 0 || (_this$hass3 = _this$hass3.states) === null || _this$hass3 === void 0 ? void 0 : _this$hass3[maId] : null;
    if (maId === mainId) return mainId;
    return this._getActivePlaybackEntityForIndexInternal(idx, mainId, maId, mainState, maState);
  }

  // Internal method to avoid recursion
  _getActivePlaybackEntityForIndexInternal(idx, mainId, maId, mainState, maState) {
    var _this$_playbackLinger2, _this$_lastPlayingEnt2;
    // Check for linger first - if we recently paused MA, stay on MA unless main entity is playing
    const linger = (_this$_playbackLinger2 = this._playbackLingerByIdx) === null || _this$_playbackLinger2 === void 0 ? void 0 : _this$_playbackLinger2[idx];
    const now = Date.now();
    if (linger && linger.until > now) {
      var _this$_lastPlayingEnt;
      // If main entity is playing AND was recently controlled, prioritize it over linger
      if ((mainState === null || mainState === void 0 ? void 0 : mainState.state) === "playing" && ((_this$_lastPlayingEnt = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt === void 0 ? void 0 : _this$_lastPlayingEnt[idx]) === mainId) {
        return mainId;
      }
      // Return the entity that the linger is actually for
      return linger.entityId;
    }
    // Clear expired linger
    if (linger && linger.until <= now) {
      delete this._playbackLingerByIdx[idx];
    }

    // Prioritize the entity that is actually playing
    // When both are playing, prefer MA entity for better control
    if ((maState === null || maState === void 0 ? void 0 : maState.state) === "playing") return maId;
    if ((mainState === null || mainState === void 0 ? void 0 : mainState.state) === "playing") return mainId;

    // When neither is playing, check if one was recently controlled for this specific chip
    const lastPlayingForChip = (_this$_lastPlayingEnt2 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt2 === void 0 ? void 0 : _this$_lastPlayingEnt2[idx];
    if (lastPlayingForChip === maId) return maId;
    if (lastPlayingForChip === mainId) return mainId;

    // Default to main entity for consistency
    return mainId;
  }

  // Legacy methods for backward compatibility
  _getVolumeEntity(idx) {
    return this._getEntityForPurpose(idx, 'volume_control');
  }
  _getVolumeEntityForGrouping(idx) {
    return this._getEntityForPurpose(idx, 'grouping_control');
  }

  // Prefer Music Assistant entity for search/grouping if configured
  _getSearchEntityId(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj === null || obj === void 0 ? void 0 : obj.entity_id;

    // Check if it's a template
    if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
      // For templates, resolve at action time - return template string for now
      return obj.music_assistant_entity;
    }
    return obj.music_assistant_entity;
  }
  // Prefer Music Assistant entity for playback controls (play/pause/seek/etc.) if configured
  _getPlaybackEntityId(idx) {
    return this._getEntityForPurpose(idx, 'playback_control');
  }
  // Choose the active playback target dynamically: prefer the entity that is currently playing
  _getActivePlaybackEntityId() {
    var _this$hass4, _this$hass5;
    const mainId = this.currentEntityId;
    // Use actual resolved MA entity for active playback detection (can be unconfigured)
    const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const mainState = mainId ? (_this$hass4 = this.hass) === null || _this$hass4 === void 0 || (_this$hass4 = _this$hass4.states) === null || _this$hass4 === void 0 ? void 0 : _this$hass4[mainId] : null;
    const maState = maId ? (_this$hass5 = this.hass) === null || _this$hass5 === void 0 || (_this$hass5 = _this$hass5.states) === null || _this$hass5 === void 0 ? void 0 : _this$hass5[maId] : null;
    if (maId === mainId) return mainId;

    // Prioritize the entity that is actually playing
    if ((mainState === null || mainState === void 0 ? void 0 : mainState.state) === "playing") return mainId;
    if ((maState === null || maState === void 0 ? void 0 : maState.state) === "playing") return maId;

    // When neither is playing, prefer the main entity for consistency
    return mainId;
  }

  // Get the active playback entity for a specific entity index (for follow_active_volume)
  _getActivePlaybackEntityIdForIndex(idx) {
    var _this$hass6, _this$hass7;
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    const mainId = obj.entity_id;
    // Use actual resolved MA entity for active playback detection (can be unconfigured)
    const maId = this._getActualResolvedMaEntityForState(idx);
    const mainState = mainId ? (_this$hass6 = this.hass) === null || _this$hass6 === void 0 || (_this$hass6 = _this$hass6.states) === null || _this$hass6 === void 0 ? void 0 : _this$hass6[mainId] : null;
    const maState = maId ? (_this$hass7 = this.hass) === null || _this$hass7 === void 0 || (_this$hass7 = _this$hass7.states) === null || _this$hass7 === void 0 ? void 0 : _this$hass7[maId] : null;
    if (maId === mainId) return mainId;

    // Prioritize the entity that is actually playing
    if ((mainState === null || mainState === void 0 ? void 0 : mainState.state) === "playing") return mainId;
    if ((maState === null || maState === void 0 ? void 0 : maState.state) === "playing") return maId;

    // When neither is playing, prefer the main entity for consistency
    return mainId;
  }
  _getGroupingEntityIdByIndex(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj === null || obj === void 0 ? void 0 : obj.entity_id;

    // Check if it's a template
    if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
      // Do not return template strings in non-async paths; fall back to main entity
      return obj.entity_id;
    }
    return obj.music_assistant_entity;
  }
  _getGroupingEntityIdByEntityId(entityId) {
    const obj = this.entityObjs.find(o => o.entity_id === entityId);
    if (!obj) return entityId;
    const mae = obj.music_assistant_entity;
    if (typeof mae === 'string' && (mae.includes('{{') || mae.includes('{%'))) {
      return obj.entity_id; // avoid template strings in sync paths
    }
    return mae || obj.entity_id;
  }
  _findEntityObjByAnyId(anyId) {
    return this.entityObjs.find(o => o.entity_id === anyId || o.music_assistant_entity === anyId) || null;
  }

  // Resolve Jinja template for music_assistant_entity with fallback to main entity
  _resolveMusicAssistantEntity(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj === null || obj === void 0 ? void 0 : obj.entity_id;
    try {
      // Check if it's a template (contains Jinja syntax)
      if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
        // For now, return the template string - it will be resolved at action time
        // This allows dynamic switching based on criteria
        return obj.music_assistant_entity;
      }

      // Not a template, return as-is
      return obj.music_assistant_entity;
    } catch (error) {
      console.warn('Failed to resolve music_assistant_entity template:', error);
      return obj.entity_id; // Fallback to main entity
    }
  }

  // Return grouping key
  _getGroupKey(id) {
    var _this$hass8;
    // Use the grouping entity (e.g., Music Assistant) for membership
    const groupingId = this._getGroupingEntityIdByEntityId(id);
    const st = (_this$hass8 = this.hass) === null || _this$hass8 === void 0 || (_this$hass8 = _this$hass8.states) === null || _this$hass8 === void 0 ? void 0 : _this$hass8[groupingId];
    if (!st) return id;
    const membersRaw = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];
    // Translate raw group member ids (likely MA ids) back to configured entity ids
    const membersConfigured = this.entityIds.filter(otherId => {
      if (otherId === id) return false;
      const otherGroupingId = this._getGroupingEntityIdByEntityId(otherId);
      return membersRaw.includes(otherGroupingId);
    });
    if (!membersConfigured.length) return id;
    const allConfigured = [id, ...membersConfigured].sort();
    return allConfigured[0];
  }
  get entityIds() {
    return this.entityObjs.map(e => e.entity_id);
  }

  // Return display name for a chip/entity
  getChipName(entity_id) {
    const obj = this.entityObjs.find(e => e.entity_id === entity_id);
    if (obj && obj.name) return obj.name;
    const state = this.hass.states[entity_id];
    return (state === null || state === void 0 ? void 0 : state.attributes.friendly_name) || entity_id;
  }

  // Return group master (includes all others in group_members)
  _getActualGroupMaster(group) {
    if (!this.hass || !group || group.length < 2) return group[0];
    // If _lastGroupingMasterId is present in this group, prefer it as master
    if (this._lastGroupingMasterId && group.includes(this._lastGroupingMasterId)) {
      return this._lastGroupingMasterId;
    }
    // Evaluate mastery using grouping entities, but return configured entity id
    const candidate = group.find(id => {
      const groupingId = this._getGroupingEntityIdByEntityId(id);
      const st = this.hass.states[groupingId];
      if (!st) return false;
      const members = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];
      return group.every(otherId => {
        if (otherId === id) return true;
        const otherGroupingId = this._getGroupingEntityIdByEntityId(otherId);
        return members.includes(otherGroupingId);
      });
    });
    return candidate || group[0];
  }
  get currentEntityId() {
    return this.entityIds[this._selectedIndex];
  }
  get currentStateObj() {
    if (!this.hass || !this.currentEntityId) return null;
    return this.hass.states[this.currentEntityId];
  }
  get currentPlaybackEntityId() {
    return this._getPlaybackEntityId(this._selectedIndex);
  }
  get currentPlaybackStateObj() {
    // Use cached resolved MA ID instead of raw template string
    const resolvedMaId = this._getResolvedPlaybackEntityIdSync(this._selectedIndex);
    if (!this.hass || !resolvedMaId) {
      // Fall back to main entity if no resolved MA ID
      return this.currentStateObj;
    }
    return this.hass.states[resolvedMaId];
  }
  get currentActivePlaybackEntityId() {
    return this._getActivePlaybackEntityId();
  }
  get currentActivePlaybackStateObj() {
    var _this$hass9;
    const id = this.currentActivePlaybackEntityId;
    return id ? (_this$hass9 = this.hass) === null || _this$hass9 === void 0 || (_this$hass9 = _this$hass9.states) === null || _this$hass9 === void 0 ? void 0 : _this$hass9[id] : null;
  }
  get currentVolumeStateObj() {
    const entityId = this._getVolumeEntity(this._selectedIndex);
    return entityId ? this.hass.states[entityId] : null;
  }
  updated(changedProps) {
    var _super$updated;
    if (this.hass && this.entityIds) {
      // Update timestamps for playing entities
      this.entityIds.forEach((id, idx) => {
        const activeEntityId = this._getEntityForPurpose(idx, 'sorting');
        if (activeEntityId) {
          const activeState = this.hass.states[activeEntityId];
          if (activeState && activeState.state === "playing") {
            this._playTimestamps[id] = Date.now();
          }
        }
      });

      // If manual‑select is active (no pin) and a *new* entity begins playing,
      // clear manual mode so auto‑switching resumes.
      if (this._manualSelect && this._pinnedIndex === null && this._manualSelectPlayingSet) {
        // Remove any entities from the snapshot that are no longer playing.
        for (const id of [...this._manualSelectPlayingSet]) {
          const stSnap = this.hass.states[id];
          if (!(stSnap && stSnap.state === "playing")) {
            this._manualSelectPlayingSet.delete(id);
          }
        }
        for (const id of this.entityIds) {
          const st = this.hass.states[id];
          if (st && st.state === "playing" && !this._manualSelectPlayingSet.has(id)) {
            this._manualSelect = false;
            this._manualSelectPlayingSet = null;
            break;
          }
        }
      }

      // Auto-switch unless manually pinned
      if (!this._manualSelect) {
        // Switch to most recent if applicable
        const sortedIds = this.sortedEntityIds;
        if (sortedIds.length > 0) {
          const mostRecentId = sortedIds[0];
          const mostRecentState = this.hass.states[mostRecentId];
          if (mostRecentState && mostRecentState.state === "playing" && this.entityIds[this._selectedIndex] !== mostRecentId) {
            this._selectedIndex = this.entityIds.indexOf(mostRecentId);
          }
        }
      }
      // Warm the resolved MA/Volume caches for the selected chip
      this._ensureResolvedMaForIndex(this._selectedIndex);
      this._ensureResolvedVolForIndex(this._selectedIndex);
    }

    // Restart progress timer
    (_super$updated = super.updated) === null || _super$updated === void 0 || _super$updated.call(this, changedProps);
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    const playbackState = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (playbackState && playbackState.state === "playing" && playbackState.attributes.media_duration) {
      this._progressTimer = setInterval(() => {
        this.requestUpdate();
      }, 500);
    }

    // Update idle state after all other state checks
    this._updateIdleState();

    // Notify HA if collapsed state changes
    // If expand on search is enabled and search is open, force expanded state
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
      const collapsedNow = false;
      if (this._prevCollapsed !== collapsedNow) {
        this._prevCollapsed = collapsedNow;
        // Trigger layout update
        this._notifyResize();
      }
      return;
    }

    // Otherwise use normal collapse logic
    const collapsedNow = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    if (this._prevCollapsed !== collapsedNow) {
      this._prevCollapsed = collapsedNow;
      // Trigger layout update
      this._notifyResize();
    }

    // Add grab scroll to chip rows after update/render
    this._addGrabScroll('.chip-row');
    this._addGrabScroll('.action-chip-row');
    this._addVerticalGrabScroll('.floating-source-index');

    // Autofocus the in-sheet search box when opening the search in entity options
    if (this._showSearchInSheet) {
      // Use a longer delay when expand on search is enabled to allow for card expansion
      this._alwaysCollapsed && this._expandOnSearch ? 300 : 200;
      setTimeout(() => {
        const inp = this.renderRoot.querySelector('#search-input-box');
        if (inp) {
          inp.focus();
        } else {
          // If input not found, try again with a longer delay
          setTimeout(() => {
            const retryInp = this.renderRoot.querySelector('#search-input-box');
            if (retryInp) {
              retryInp.focus();
            }
          }, 200);
        }
        // Only scroll filter chip row to start if the set of chips has changed
        const classes = Array.from(new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean)));
        const classStr = classes.join(",");
        if (this._lastSearchChipClasses !== classStr) {
          const chipRow = this.renderRoot.querySelector('.search-filter-chips');
          if (chipRow) chipRow.scrollLeft = 0;
          // Reset scroll only when the result set (and chip classes) actually changes
          const overlayEl = this.renderRoot.querySelector('.entity-options-overlay');
          if (overlayEl) overlayEl.scrollTop = 0;
          const sheetEl = this.renderRoot.querySelector('.entity-options-sheet');
          if (sheetEl) sheetEl.scrollTop = 0;
          this._lastSearchChipClasses = classStr;
        }
        // Responsive alignment for search filter chips: center if no overflow, flex-start if overflow
        const chipRowEl = this.renderRoot.querySelector('#search-filter-chip-row');
        if (chipRowEl) {
          if (chipRowEl.scrollWidth > chipRowEl.clientWidth + 2) {
            chipRowEl.style.justifyContent = 'flex-start';
          } else {
            chipRowEl.style.justifyContent = 'center';
          }
        }
        // attach swipe gesture once
        this._attachSearchSwipe();
      }, 200);
    }
    // When the source‑list sheet opens, make sure the overlay scrolls to the top
    if (this._showSourceList) {
      setTimeout(() => {
        const overlayEl = this.renderRoot.querySelector('.entity-options-overlay');
        if (overlayEl) overlayEl.scrollTop = 0;
      }, 0);
    }
  }
  _toggleSourceMenu() {
    this._showSourceMenu = !this._showSourceMenu;
    if (this._showSourceMenu) {
      this._manualSelect = true;
      setTimeout(() => {
        this._shouldDropdownOpenUp = true;
        this.requestUpdate();
        // Setup outside click handler
        this._addSourceDropdownOutsideHandler();
      }, 0);
    } else {
      this._manualSelect = false;
      this._removeSourceDropdownOutsideHandler();
    }
  }
  _addSourceDropdownOutsideHandler() {
    if (this._sourceDropdownOutsideHandler) return;
    // Use arrow fn to preserve 'this'
    this._sourceDropdownOutsideHandler = evt => {
      // Find dropdown and button in shadow DOM
      const dropdown = this.renderRoot.querySelector('.source-dropdown');
      const btn = this.renderRoot.querySelector('.source-menu-btn');
      // If click/tap is not inside dropdown or button, close, evt.composedPath() includes shadow DOM path
      const path = evt.composedPath ? evt.composedPath() : [];
      if (dropdown && path.includes(dropdown) || btn && path.includes(btn)) {
        return;
      }
      // Otherwise, close the dropdown and remove handler
      this._showSourceMenu = false;
      this._manualSelect = false;
      this._removeSourceDropdownOutsideHandler();
      this.requestUpdate();
    };
    window.addEventListener('mousedown', this._sourceDropdownOutsideHandler, true);
    window.addEventListener('touchstart', this._sourceDropdownOutsideHandler, true);
  }
  _removeSourceDropdownOutsideHandler() {
    if (!this._sourceDropdownOutsideHandler) return;
    window.removeEventListener('mousedown', this._sourceDropdownOutsideHandler, true);
    window.removeEventListener('touchstart', this._sourceDropdownOutsideHandler, true);
    this._sourceDropdownOutsideHandler = null;
  }
  _selectSource(src) {
    const entity = this.currentEntityId;
    if (!entity || !src) return;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source: src
    });
    // Close the source list sheet after selection
    this._closeEntityOptions();
  }
  _onPinClick(e) {
    e.stopPropagation();
    this._manualSelect = false;
    this._pinnedIndex = null;
    this._manualSelectPlayingSet = null;
  }
  _onChipClick(idx) {
    // Ignore the synthetic click that fires immediately after a long‑press pin.
    if (this._holdToPin && this._justPinned) {
      this._justPinned = false;
      return;
    }

    // Select the tapped chip.
    this._selectedIndex = idx;
    clearTimeout(this._manualSelectTimeout);
    if (this._holdToPin) {
      if (this._pinnedIndex !== null) {
        // A chip is already pinned – keep manual mode active.
        this._manualSelect = true;
      } else {
        // No chip is pinned. Pause auto‑switching until any *new* player starts.
        this._manualSelect = true;
        // Take a snapshot of who is currently playing.
        this._manualSelectPlayingSet = new Set();
        for (const id of this.entityIds) {
          var _this$hass0;
          const st = (_this$hass0 = this.hass) === null || _this$hass0 === void 0 || (_this$hass0 = _this$hass0.states) === null || _this$hass0 === void 0 ? void 0 : _this$hass0[id];
          if (st && st.state === "playing") {
            this._manualSelectPlayingSet.add(id);
          }
        }
      }
      // Never change _pinnedIndex on a simple tap in hold_to_pin mode.
    } else {
      // --- default MODE ---
      this._manualSelect = true;
      this._pinnedIndex = idx;
    }
    this.requestUpdate();
  }
  _pinChip(idx) {
    // Mark that this chip was just pinned via long‑press so the
    // click event that follows the pointer‑up can be ignored.
    this._justPinned = true;

    // Cancel any pending auto‑switch re‑enable timer.
    clearTimeout(this._manualSelectTimeout);
    // Clear the manual‑select snapshot; a long‑press establishes a pin.
    this._manualSelectPlayingSet = null;
    this._pinnedIndex = idx;
    this._manualSelect = true;
    this.requestUpdate();
  }
  async _onActionChipClick(idx) {
    const action = this.config.actions[idx];
    if (!action) return;
    if (action.menu_item) {
      switch (action.menu_item) {
        case "more-info":
          this._openMoreInfo();
          this._showEntityOptions = false;
          this.requestUpdate();
          break;
        case "group-players":
          this._showEntityOptions = true;
          this._showGrouping = true;
          this.requestUpdate();
          break;
        case "search":
          this._showEntityOptions = true;
          this._showSearchInSheet = true;
          this._searchError = "";
          this._searchResults = [];
          this._searchQuery = "";
          this._searchAttempted = false;
          this.requestUpdate();

          // Force layout update for expand on search
          setTimeout(() => {
            this._notifyResize();
          }, 0);
          break;
        case "source":
          this._showEntityOptions = true;
          this._showSourceList = true;
          this._showGrouping = false;
          this.requestUpdate();
          break;
      }
      return;
    }
    if (!action.service) return;
    const [domain, service] = action.service.split(".");
    let data = {
      ...(action.service_data || {})
    };
    if (domain === "script" && action.script_variable === true) {
      const currentMainId = this.currentEntityId;
      const currentMaIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const currentMaId = await this._resolveTemplateAtActionTime(currentMaIdTemplate, currentMainId);
      const currentPlaybackIdTemplate = this.currentActivePlaybackEntityId || this._getPlaybackEntityId(this._selectedIndex);
      const currentPlaybackId = await this._resolveTemplateAtActionTime(currentPlaybackIdTemplate, currentMainId);
      if (data.entity_id === "current" || data.entity_id === "$current" || data.entity_id === "this") {
        delete data.entity_id;
      }
      // Prefer MA entity when available for script consumers
      data.yamp_entity = currentMaId || currentMainId;
      // Also expose main and active playback for advanced scripts
      data.yamp_main_entity = currentMainId;
      data.yamp_playback_entity = currentPlaybackId;
    } else if (!(domain === "script" && action.script_variable === true) && (data.entity_id === "current" || data.entity_id === "$current" || data.entity_id === "this" || !data.entity_id)) {
      // Resolve 'current' placeholder differently by domain
      if (domain === "music_assistant") {
        const maTemplate = this._getSearchEntityId(this._selectedIndex);
        data.entity_id = await this._resolveTemplateAtActionTime(maTemplate, this.currentEntityId);
      } else if (domain === "media_player") {
        const playbackTemplate = this.currentActivePlaybackEntityId || this._getPlaybackEntityId(this._selectedIndex);
        data.entity_id = await this._resolveTemplateAtActionTime(playbackTemplate, this.currentEntityId);
      } else {
        data.entity_id = this.currentEntityId;
      }
    }
    this.hass.callService(domain, service, data);
  }
  async _onControlClick(action) {
    var _this$hass1;
    // Use the unified entity resolution system for control actions
    const targetEntity = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    if (!targetEntity) return;
    const stateObj = ((_this$hass1 = this.hass) === null || _this$hass1 === void 0 || (_this$hass1 = _this$hass1.states) === null || _this$hass1 === void 0 ? void 0 : _this$hass1[targetEntity]) || this.currentStateObj;
    switch (action) {
      case "play_pause":
        if ((stateObj === null || stateObj === void 0 ? void 0 : stateObj.state) === "playing") {
          this.hass.callService("media_player", "media_pause", {
            entity_id: targetEntity
          });
          // When pausing, set the last playing entity to the one we just paused (per-chip)
          if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
          this._lastPlayingEntityIdByChip[this._selectedIndex] = targetEntity;
          // Lock controls to this entity during the paused window
          this._controlFocusEntityId = targetEntity;
          // Optimistic toggle to reduce flicker
          this._optimisticPlayback = {
            entity_id: targetEntity,
            state: "paused",
            ts: Date.now()
          };
          this.requestUpdate();
          setTimeout(() => {
            this._optimisticPlayback = null;
            this.requestUpdate();
          }, 1200);
        } else {
          this.hass.callService("media_player", "media_play", {
            entity_id: targetEntity
          });
          // On resume, lock to the target entity immediately (per-chip)
          if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
          this._lastPlayingEntityIdByChip[this._selectedIndex] = targetEntity;
          // Maintain focus lock until an entity reports playing
          this._controlFocusEntityId = targetEntity;
          // Optimistic toggle to reduce flicker
          this._optimisticPlayback = {
            entity_id: targetEntity,
            state: "playing",
            ts: Date.now()
          };
          this.requestUpdate();
          setTimeout(() => {
            this._optimisticPlayback = null;
            this.requestUpdate();
          }, 1200);
        }
        break;
      case "next":
        this.hass.callService("media_player", "media_next_track", {
          entity_id: targetEntity
        });
        break;
      case "prev":
        this.hass.callService("media_player", "media_previous_track", {
          entity_id: targetEntity
        });
        break;
      case "stop":
        this.hass.callService("media_player", "media_stop", {
          entity_id: targetEntity
        });
        if (stateObj) {
          // Set optimistic state for the entity we're actually controlling
          const targetEntityId = targetEntity;
          this._optimisticPlayback = {
            entity_id: targetEntityId,
            state: "idle",
            ts: Date.now()
          };
          // Don't clear debounce on action - let it handle state transitions naturally
          this.requestUpdate();
          setTimeout(() => {
            this._optimisticPlayback = null;
            this.requestUpdate();
          }, 1200);
        }
        break;
      case "shuffle":
        {
          // Toggle shuffle based on current state
          const curr = !!stateObj.attributes.shuffle;
          this.hass.callService("media_player", "shuffle_set", {
            entity_id: targetEntity,
            shuffle: !curr
          });
          break;
        }
      case "repeat":
        {
          // Cycle: off → all → one → off
          let curr = stateObj.attributes.repeat || "off";
          let next;
          if (curr === "off") next = "all";else if (curr === "all") next = "one";else next = "off";
          this.hass.callService("media_player", "repeat_set", {
            entity_id: targetEntity,
            repeat: next
          });
          break;
        }
      case "power":
        {
          var _this$hass10;
          // Toggle main entity power (physical power behavior)
          const mainId = this.currentEntityId;
          const mainState = ((_this$hass10 = this.hass) === null || _this$hass10 === void 0 || (_this$hass10 = _this$hass10.states) === null || _this$hass10 === void 0 ? void 0 : _this$hass10[mainId]) || stateObj;
          const svc = (mainState === null || mainState === void 0 ? void 0 : mainState.state) === "off" ? "turn_on" : "turn_off";
          this.hass.callService("media_player", svc, {
            entity_id: mainId
          });

          // Also toggle volume_entity if sync_power is enabled for this entity
          const obj = this.entityObjs[this._selectedIndex];
          if (obj && obj.sync_power) {
            const volEntityId = this._getVolumeEntity(this._selectedIndex);
            if (volEntityId && volEntityId !== obj.entity_id) {
              this.hass.callService("media_player", svc, {
                entity_id: volEntityId
              });
            }
          }
          break;
        }
    }
  }

  /**
   * Handles volume change events.
   * With group_volume: false, always sets only the single volume entity, never the group.
   * With group_volume: true/undefined, applies group logic.
   */
  async _onVolumeChange(e) {
    var _state$attributes;
    const idx = this._selectedIndex;
    const groupingEntityTemplate = this._getGroupingEntityIdByIndex(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];
    const newVol = Number(e.target.value);
    const obj = this.entityObjs[idx];

    // Always use group_volume directly from obj
    const groupVolume = typeof obj.group_volume === "boolean" ? obj.group_volume : true;
    if (!groupVolume) {
      this.hass.callService("media_player", "volume_set", {
        entity_id: this._getVolumeEntity(idx),
        volume_level: newVol
      });
      return;
    }

    // Group volume logic: ONLY runs if group_volume is true/undefined
    if (Array.isArray(state === null || state === void 0 || (_state$attributes = state.attributes) === null || _state$attributes === void 0 ? void 0 : _state$attributes.group_members) && state.attributes.group_members.length) {
      var _this$currentVolumeSt;
      // Get the main entity and all grouped members
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [mainEntity, ...state.attributes.group_members];
      const base = typeof this._groupBaseVolume === "number" ? this._groupBaseVolume : Number(((_this$currentVolumeSt = this.currentVolumeStateObj) === null || _this$currentVolumeSt === void 0 ? void 0 : _this$currentVolumeSt.attributes.volume_level) || 0);
      const delta = newVol - base;
      for (const t of targets) {
        for (const obj of this.entityObjs) {
          let resolvedGroupingId;
          if (obj.music_assistant_entity) {
            if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
              // For templates, resolve at action time
              try {
                resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
              } catch (error) {
                console.warn('Failed to resolve template for volume change:', error);
                resolvedGroupingId = obj.entity_id;
              }
            } else {
              resolvedGroupingId = obj.music_assistant_entity;
            }
          } else {
            resolvedGroupingId = obj.entity_id;
          }
          if (resolvedGroupingId === t) {
            break;
          }
        }

        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + delta;
        v = Math.max(0, Math.min(1, v));
        this.hass.callService("media_player", "volume_set", {
          entity_id: volTarget,
          volume_level: v
        });
      }
      this._groupBaseVolume = newVol;
    } else {
      const volumeEntity = this._getVolumeEntity(idx);
      this.hass.callService("media_player", "volume_set", {
        entity_id: volumeEntity,
        volume_level: newVol
      });
    }
  }
  async _onVolumeStep(direction) {
    var _state$attributes2;
    const idx = this._selectedIndex;
    const entity = this._getVolumeEntity(idx);
    if (!entity) return;
    const isRemoteVolumeEntity = entity.startsWith && entity.startsWith("remote.");
    const stateObj = this.currentVolumeStateObj;
    if (!stateObj) return;
    if (isRemoteVolumeEntity) {
      this.hass.callService("remote", "send_command", {
        entity_id: entity,
        command: direction > 0 ? "volume_up" : "volume_down"
      });
      return;
    }
    const groupingEntityTemplate = this._getGroupingEntityIdByIndex(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];
    if (Array.isArray(state === null || state === void 0 || (_state$attributes2 = state.attributes) === null || _state$attributes2 === void 0 ? void 0 : _state$attributes2.group_members) && state.attributes.group_members.length) {
      // Grouped: apply group gain step
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [mainEntity, ...state.attributes.group_members];
      // Use configurable step size
      const step = this._volumeStep * direction;
      for (const t of targets) {
        for (const obj of this.entityObjs) {
          let resolvedGroupingId;
          if (obj.music_assistant_entity) {
            if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
              // For templates, resolve at action time
              try {
                resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
              } catch (error) {
                console.warn('Failed to resolve template for volume step:', error);
                resolvedGroupingId = obj.entity_id;
              }
            } else {
              resolvedGroupingId = obj.music_assistant_entity;
            }
          } else {
            resolvedGroupingId = obj.entity_id;
          }
          if (resolvedGroupingId === t) {
            break;
          }
        }

        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + step;
        v = Math.max(0, Math.min(1, v));
        this.hass.callService("media_player", "volume_set", {
          entity_id: volTarget,
          volume_level: v
        });
      }
    } else {
      // Not grouped, set directly
      let current = Number(stateObj.attributes.volume_level || 0);
      current += this._volumeStep * direction;
      current = Math.max(0, Math.min(1, current));
      this.hass.callService("media_player", "volume_set", {
        entity_id: entity,
        volume_level: current
      });
    }
  }
  async _onMuteToggle() {
    var _state$attributes3;
    const idx = this._selectedIndex;
    const entity = this._getVolumeEntity(idx);
    if (!entity) return;
    const isRemoteVolumeEntity = entity.startsWith && entity.startsWith("remote.");
    const stateObj = this.currentVolumeStateObj;
    if (!stateObj) return;
    const isMuted = stateObj.attributes.is_volume_muted ?? false;
    const currentVolume = stateObj.attributes.volume_level ?? 0;
    if (isRemoteVolumeEntity) {
      // For remote entities, we can't easily toggle mute, so just set volume to 0 or restore
      if (isMuted) {
        // Restore to a reasonable volume if was muted
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0.5
        });
      } else {
        // Mute by setting volume to 0
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0
        });
      }
      return;
    }

    // Check if mute is supported
    const supportsMute = this._supportsFeature(stateObj, SUPPORT_VOLUME_MUTE);
    if (!supportsMute) {
      // If mute is not supported, implement mute by setting volume to 0 and storing previous volume
      if (currentVolume > 0) {
        // Store current volume and mute
        this._previousVolume = currentVolume;
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0
        });
      } else {
        // Restore previous volume
        const restoreVolume = this._previousVolume ?? 0.5;
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: restoreVolume
        });
        this._previousVolume = null;
      }
      return;
    }
    const groupingEntityTemplate = this._getGroupingEntityIdByIndex(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];
    if (Array.isArray(state === null || state === void 0 || (_state$attributes3 = state.attributes) === null || _state$attributes3 === void 0 ? void 0 : _state$attributes3.group_members) && state.attributes.group_members.length) {
      // Grouped: apply mute to all group members
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [mainEntity, ...state.attributes.group_members];
      for (const t of targets) {
        for (const obj of this.entityObjs) {
          let resolvedGroupingId;
          if (obj.music_assistant_entity) {
            if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
              // For templates, resolve at action time
              try {
                resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
              } catch (error) {
                console.warn('Failed to resolve template for mute toggle:', error);
                resolvedGroupingId = obj.entity_id;
              }
            } else {
              resolvedGroupingId = obj.music_assistant_entity;
            }
          } else {
            resolvedGroupingId = obj.entity_id;
          }
          if (resolvedGroupingId === t) {
            break;
          }
        }

        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const targetState = this.hass.states[volTarget];
        const targetSupportsMute = targetState ? this._supportsFeature(targetState, SUPPORT_VOLUME_MUTE) : false;
        if (targetSupportsMute) {
          this.hass.callService("media_player", "volume_mute", {
            entity_id: volTarget,
            is_volume_muted: !isMuted
          });
        } else {
          var _targetState$attribut;
          // For entities that don't support mute, set volume to 0 or restore
          const targetVolume = (targetState === null || targetState === void 0 || (_targetState$attribut = targetState.attributes) === null || _targetState$attribut === void 0 ? void 0 : _targetState$attribut.volume_level) ?? 0;
          if (targetVolume > 0) {
            // Store current volume and mute (simplified - in a real implementation you'd want to store per entity)
            this.hass.callService("media_player", "volume_set", {
              entity_id: volTarget,
              volume_level: 0
            });
          } else {
            // Restore to a reasonable volume
            this.hass.callService("media_player", "volume_set", {
              entity_id: volTarget,
              volume_level: 0.5
            });
          }
        }
      }
    } else {
      // Not grouped, toggle mute directly
      this.hass.callService("media_player", "volume_mute", {
        entity_id: entity,
        is_volume_muted: !isMuted
      });
    }
  }
  _onVolumeDragStart(e) {
    // Store base group volume at drag start
    if (!this.hass) return;
    const state = this.currentVolumeStateObj;
    this._groupBaseVolume = state ? Number(state.attributes.volume_level || 0) : 0;
  }
  _onVolumeDragEnd(e) {
    this._groupBaseVolume = null;
  }
  _onGroupVolumeChange(entityId, volumeEntity, e) {
    const vol = Number(e.target.value);
    this.hass.callService("media_player", "volume_set", {
      entity_id: volumeEntity,
      volume_level: vol
    });
    this.requestUpdate();
  }
  _onGroupVolumeStep(volumeEntity, direction) {
    this.hass.callService("remote", "send_command", {
      entity_id: volumeEntity,
      command: direction > 0 ? "volume_up" : "volume_down"
    });
    this.requestUpdate();
  }
  _onSourceChange(e) {
    const entity = this.currentEntityId;
    const source = e.target.value;
    if (!entity || !source) return;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source
    });
  }
  _openMoreInfo() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: {
        entityId: this.currentEntityId
      },
      bubbles: true,
      composed: true
    }));
  }
  async _onProgressBarClick(e) {
    var _this$hass11, _this$hass12, _this$hass13;
    // For seeking, we want to target the entity that is actually playing
    const mainId = this.currentEntityId;
    const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const mainState = mainId ? (_this$hass11 = this.hass) === null || _this$hass11 === void 0 || (_this$hass11 = _this$hass11.states) === null || _this$hass11 === void 0 ? void 0 : _this$hass11[mainId] : null;
    const maState = maId ? (_this$hass12 = this.hass) === null || _this$hass12 === void 0 || (_this$hass12 = _this$hass12.states) === null || _this$hass12 === void 0 ? void 0 : _this$hass12[maId] : null;
    let targetEntity;
    if (this._controlFocusEntityId && (this._controlFocusEntityId === maId || this._controlFocusEntityId === mainId)) {
      targetEntity = this._controlFocusEntityId;
    } else if ((maState === null || maState === void 0 ? void 0 : maState.state) === "playing") {
      targetEntity = maId;
    } else if ((mainState === null || mainState === void 0 ? void 0 : mainState.state) === "playing") {
      targetEntity = mainId;
    } else {
      var _this$_lastPlayingEnt3;
      // When neither is playing, prefer the last playing entity for better resume behavior
      const lastPlayingForChip = (_this$_lastPlayingEnt3 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt3 === void 0 ? void 0 : _this$_lastPlayingEnt3[this._selectedIndex];
      if (lastPlayingForChip && (lastPlayingForChip === maId || lastPlayingForChip === mainId)) {
        targetEntity = lastPlayingForChip;
      } else {
        // Fallback to the configured playback entity
        const entityTemplate = this._getPlaybackEntityId(this._selectedIndex);
        targetEntity = await this._resolveTemplateAtActionTime(entityTemplate, this.currentEntityId);
      }
    }
    const stateObj = ((_this$hass13 = this.hass) === null || _this$hass13 === void 0 || (_this$hass13 = _this$hass13.states) === null || _this$hass13 === void 0 ? void 0 : _this$hass13[targetEntity]) || this.currentStateObj;
    if (!targetEntity || !stateObj) return;
    const duration = stateObj.attributes.media_duration;
    if (!duration) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = Math.floor(percent * duration);
    if (stateObj.state === "playing") {
      // Optimistically update local progress position for smooth UI
      stateObj.attributes.media_position = seekTime;
      stateObj.attributes.media_position_updated_at = new Date().toISOString();
      this.requestUpdate();
    }
    this.hass.callService("media_player", "media_seek", {
      entity_id: targetEntity,
      seek_position: seekTime
    });
  }
  render() {
    var _this$_optimisticPlay, _this$hass14, _this$_lastPlayingEnt4, _this$_lastPlayingEnt5, _this$_playbackLinger3, _this$config$entities, _this$_lastPlayingEnt6, _this$_maResolveCache3, _this$_playbackLinger4, _this$hass15, _mainState$attributes2, _mainState$attributes3, _mainState$attributes4, _mainState$attributes5, _this$currentVolumeSt2, _this$currentVolumeSt3, _this$currentStateObj;
    if (!this.hass || !this.config) return nothing;
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    const showChipRow = this.config.show_chip_row || "auto";
    const stateObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (!stateObj) return html`<div class="details">Entity not found.</div>`;

    // Collect unique, sorted first letters of source names
    const sourceList = stateObj.attributes.source_list || [];
    const sourceLetters = Array.from(new Set(sourceList.map(s => s && s[0] ? s[0].toUpperCase() : ""))).filter(l => l && /^[A-Z]$/.test(l)).sort();

    // Idle image "picture frame" mode when idle
    let idleImageUrl = null;
    if (this.config.idle_image && this._isIdle && this.hass.states[this.config.idle_image]) {
      const sensorState = this.hass.states[this.config.idle_image];
      idleImageUrl = sensorState.attributes.entity_picture || (sensorState.state && sensorState.state.startsWith("http") ? sensorState.state : null);
    }
    const dimIdleFrame = !!idleImageUrl;
    const hideControlsNow = this._isIdle;
    const shouldDimIdle = dimIdleFrame && this._isIdle;

    // Calculate shuffle/repeat state from the active playback entity when available
    const mainStateForPlayback = this.currentStateObj;
    this.currentPlaybackStateObj;
    ((_this$_optimisticPlay = this._optimisticPlayback) === null || _this$_optimisticPlay === void 0 ? void 0 : _this$_optimisticPlay.entity_id) || null;

    // --- Fix 2: priority rule for entity selection ---
    // Keep the currently‑selected entity (even if paused)
    // unless some other entity is *playing*.
    // Use cached resolved MA ID instead of raw template string
    this._getResolvedPlaybackEntityIdSync(this._selectedIndex);
    // Also get the actual resolved MA entity for state detection (can be unconfigured)
    const actualResolvedMaId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const actualMaState = actualResolvedMaId ? (_this$hass14 = this.hass) === null || _this$hass14 === void 0 || (_this$hass14 = _this$hass14.states) === null || _this$hass14 === void 0 ? void 0 : _this$hass14[actualResolvedMaId] : null;

    // Update state tracking for optimistic playback and set/clear MA linger window
    const prevMain = this._lastMainState;
    const prevMa = this._lastMaState;
    this._lastMainState = mainStateForPlayback === null || mainStateForPlayback === void 0 ? void 0 : mainStateForPlayback.state;
    this._lastMaState = actualMaState === null || actualMaState === void 0 ? void 0 : actualMaState.state;
    const idx = this._selectedIndex;

    // If MA just transitioned from playing -> not playing, start a linger window (30s)
    if (prevMa === "playing" && this._lastMaState !== "playing") {
      this._playbackLingerByIdx[idx] = {
        entityId: actualResolvedMaId,
        until: Date.now() + 30000
      };
    }
    // Also set linger when MA entity is paused (regardless of previous state) to ensure UI stays on MA

    // Set linger when MA entity transitions to paused OR when main entity transitions to paused and was last controlled
    const shouldSetLinger = prevMa === "playing" && this._lastMaState === "paused" && ((_this$_lastPlayingEnt4 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt4 === void 0 ? void 0 : _this$_lastPlayingEnt4[idx]) === actualResolvedMaId || prevMain === "playing" && this._lastMainState === "paused" && ((_this$_lastPlayingEnt5 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt5 === void 0 ? void 0 : _this$_lastPlayingEnt5[idx]) === (mainStateForPlayback === null || mainStateForPlayback === void 0 ? void 0 : mainStateForPlayback.entity_id);
    if (shouldSetLinger) {
      // Use the last controlled entity for the linger (main entity if main was controlled, MA entity if MA was controlled)
      const lingerEntityId = this._lastPlayingEntityIdByChip[idx];
      this._playbackLingerByIdx[idx] = {
        entityId: lingerEntityId,
        // Use cached MA entity or last controlled entity
        until: Date.now() + 30000
      };
    }
    // If MA resumed playing, clear linger
    if (this._lastMaState === "playing" && (_this$_playbackLinger3 = this._playbackLingerByIdx) !== null && _this$_playbackLinger3 !== void 0 && _this$_playbackLinger3[idx]) {
      delete this._playbackLingerByIdx[idx];
    }
    // Only clear linger if main entity is playing AND MA entity is not the last controlled entity
    const maEntityId = (_this$config$entities = this.config.entities[idx]) === null || _this$config$entities === void 0 ? void 0 : _this$config$entities.music_assistant_entity;
    const currentResolvedMaId = this._getEntityForPurpose(idx, 'ma_resolve');
    const lastControlled = (_this$_lastPlayingEnt6 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt6 === void 0 ? void 0 : _this$_lastPlayingEnt6[idx];
    const cachedResolvedMaId = (_this$_maResolveCache3 = this._maResolveCache) === null || _this$_maResolveCache3 === void 0 || (_this$_maResolveCache3 = _this$_maResolveCache3[idx]) === null || _this$_maResolveCache3 === void 0 ? void 0 : _this$_maResolveCache3.id;
    const isLastControlledMa = !!(lastControlled && (lastControlled === cachedResolvedMaId || lastControlled === currentResolvedMaId || lastControlled === maEntityId || lastControlled === actualResolvedMaId));
    if (this._lastMainState === "playing" && (_this$_playbackLinger4 = this._playbackLingerByIdx) !== null && _this$_playbackLinger4 !== void 0 && _this$_playbackLinger4[idx] && !isLastControlledMa) {
      delete this._playbackLingerByIdx[idx];
    }

    // Use the unified entity resolution system for playback state
    const playbackEntityId = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    const playbackStateObj = (_this$hass15 = this.hass) === null || _this$hass15 === void 0 || (_this$hass15 = _this$hass15.states) === null || _this$hass15 === void 0 ? void 0 : _this$hass15[playbackEntityId];

    // Use the unified entity resolution system for playback state
    const finalPlaybackStateObj = playbackStateObj;

    // Keep finalEntityId for backward compatibility with existing code
    const finalEntityId = playbackEntityId;
    // Blend in optimistic playback state if present
    let effState = finalPlaybackStateObj === null || finalPlaybackStateObj === void 0 ? void 0 : finalPlaybackStateObj.state;
    if (this._optimisticPlayback) {
      // Only apply optimistic state if it matches the current playback entity
      const optimisticEntityId = this._optimisticPlayback.entity_id;
      const currentEntityId = finalEntityId;
      if (optimisticEntityId === currentEntityId) {
        effState = this._optimisticPlayback.state;
      }
    }
    const shuffleActive = !!finalPlaybackStateObj.attributes.shuffle;
    const repeatActive = finalPlaybackStateObj.attributes.repeat && finalPlaybackStateObj.attributes.repeat !== "off";

    // Artwork and idle logic
    const isPlaying = !this._isIdle && effState === "playing";
    // Artwork keeps using the visible main entity's artwork when available; fallback to playback entity if main has none
    const mainState = this.currentStateObj;
    const isRealArtwork = !this._isIdle && isPlaying && (mainState && (mainState.attributes.entity_picture || mainState.attributes.album_art) || playbackStateObj && (playbackStateObj.attributes.entity_picture || playbackStateObj.attributes.album_art));
    isRealArtwork ? mainState && (mainState.attributes.entity_picture || mainState.attributes.album_art) || playbackStateObj && (playbackStateObj.attributes.entity_picture || playbackStateObj.attributes.album_art) : null;
    // Details
    const title = isPlaying ? finalPlaybackStateObj.attributes.media_title || (mainState === null || mainState === void 0 || (_mainState$attributes2 = mainState.attributes) === null || _mainState$attributes2 === void 0 ? void 0 : _mainState$attributes2.media_title) || "" : "";
    const artist = isPlaying ? finalPlaybackStateObj.attributes.media_artist || finalPlaybackStateObj.attributes.media_series_title || finalPlaybackStateObj.attributes.app_name || (mainState === null || mainState === void 0 || (_mainState$attributes3 = mainState.attributes) === null || _mainState$attributes3 === void 0 ? void 0 : _mainState$attributes3.media_artist) || (mainState === null || mainState === void 0 || (_mainState$attributes4 = mainState.attributes) === null || _mainState$attributes4 === void 0 ? void 0 : _mainState$attributes4.media_series_title) || (mainState === null || mainState === void 0 || (_mainState$attributes5 = mainState.attributes) === null || _mainState$attributes5 === void 0 ? void 0 : _mainState$attributes5.app_name) || "" : "";
    let pos = finalPlaybackStateObj.attributes.media_position || 0;
    const duration = finalPlaybackStateObj.attributes.media_duration || 0;
    if (isPlaying) {
      const updatedAt = finalPlaybackStateObj.attributes.media_position_updated_at ? Date.parse(finalPlaybackStateObj.attributes.media_position_updated_at) : Date.parse(finalPlaybackStateObj.last_changed);
      const elapsed = (Date.now() - updatedAt) / 1000;
      pos += elapsed;
    }
    const progress = duration ? Math.min(1, pos / duration) : 0;

    // Volume entity determination
    const entity = this._getVolumeEntity(idx);
    const isRemoteVolumeEntity = entity && entity.startsWith && entity.startsWith("remote.");

    // Volume
    const vol = Number(((_this$currentVolumeSt2 = this.currentVolumeStateObj) === null || _this$currentVolumeSt2 === void 0 ? void 0 : _this$currentVolumeSt2.attributes.volume_level) || 0);
    const showSlider = this.config.volume_mode !== "stepper";

    // Collapse artwork/details on idle if configured and/or always_collapsed
    // If expand on search is enabled and search is open, force expanded state
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
      collapsed = false;
    } else {
      collapsed = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    }
    // Use null if idle or no artwork available
    let artworkUrl = null;
    if (!this._isIdle) {
      const getArt = st => st && (st.attributes.entity_picture || st.attributes.album_art);
      // Use the unified entity resolution system for artwork
      artworkUrl = getArt(playbackStateObj) || getArt(mainState) || null;
    }

    // Dominant color extraction for collapsed artwork
    if (collapsed && artworkUrl && artworkUrl !== this._lastArtworkUrl) {
      this._extractDominantColor(artworkUrl).then(color => {
        this._collapsedArtDominantColor = color;
        this.requestUpdate();
      });
      this._lastArtworkUrl = artworkUrl;
    }
    return html`
        <ha-card class="yamp-card" style="position:relative;">
          <div
            style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column;"
            data-match-theme="${String(this.config.match_theme === true)}"
            class="${shouldDimIdle ? 'dim-idle' : ''}"
          >
            ${this.entityObjs.length > 1 || showChipRow === "always" ? html`
                <div class="chip-row">
                  ${renderChipRow({
      groupedSortedEntityIds: this.groupedSortedEntityIds,
      entityIds: this.entityIds,
      selectedEntityId: this.currentEntityId,
      pinnedIndex: this._pinnedIndex,
      holdToPin: this._holdToPin,
      getChipName: id => this.getChipName(id),
      getActualGroupMaster: group => this._getActualGroupMaster(group),
      getIsChipPlaying: (id, isSelected) => {
        var _this$hass16;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return isSelected ? !this._isIdle : false;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass16 = this.hass) === null || _this$hass16 === void 0 || (_this$hass16 = _this$hass16.states) === null || _this$hass16 === void 0 ? void 0 : _this$hass16[playbackEntityId];
        const anyPlaying = (playbackState === null || playbackState === void 0 ? void 0 : playbackState.state) === "playing";
        return isSelected ? !this._isIdle : anyPlaying;
      },
      getChipArt: id => {
        var _this$hass17, _this$hass18, _playbackState$attrib, _playbackState$attrib2, _mainState$attributes6, _mainState$attributes7;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return null;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass17 = this.hass) === null || _this$hass17 === void 0 || (_this$hass17 = _this$hass17.states) === null || _this$hass17 === void 0 ? void 0 : _this$hass17[playbackEntityId];
        const mainState = (_this$hass18 = this.hass) === null || _this$hass18 === void 0 || (_this$hass18 = _this$hass18.states) === null || _this$hass18 === void 0 ? void 0 : _this$hass18[mainId];

        // Prefer playback entity artwork, fallback to main entity
        return (playbackState === null || playbackState === void 0 || (_playbackState$attrib = playbackState.attributes) === null || _playbackState$attrib === void 0 ? void 0 : _playbackState$attrib.entity_picture) || (playbackState === null || playbackState === void 0 || (_playbackState$attrib2 = playbackState.attributes) === null || _playbackState$attrib2 === void 0 ? void 0 : _playbackState$attrib2.album_art) || (mainState === null || mainState === void 0 || (_mainState$attributes6 = mainState.attributes) === null || _mainState$attributes6 === void 0 ? void 0 : _mainState$attributes6.entity_picture) || (mainState === null || mainState === void 0 || (_mainState$attributes7 = mainState.attributes) === null || _mainState$attributes7 === void 0 ? void 0 : _mainState$attributes7.album_art) || null;
      },
      getIsMaActive: id => {
        var _this$hass19;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return false;

        // Check if there's a configured MA entity
        const entityObj = this.entityObjs[idx];
        if (!(entityObj !== null && entityObj !== void 0 && entityObj.music_assistant_entity)) return false;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass19 = this.hass) === null || _this$hass19 === void 0 || (_this$hass19 = _this$hass19.states) === null || _this$hass19 === void 0 ? void 0 : _this$hass19[playbackEntityId];

        // Check if the playback entity is the MA entity and is playing
        return playbackEntityId === this._resolveEntity(entityObj.music_assistant_entity, entityObj.entity_id, idx) && (playbackState === null || playbackState === void 0 ? void 0 : playbackState.state) === "playing";
      },
      isIdle: this._isIdle,
      hass: this.hass,
      onChipClick: idx => this._onChipClick(idx),
      onIconClick: (idx, e) => {
        const entityId = this.entityIds[idx];
        const group = this.groupedSortedEntityIds.find(g => g.includes(entityId));
        if (group && group.length > 1) {
          this._selectedIndex = idx;
          this._showEntityOptions = true;
          this._showGrouping = true;
          this.requestUpdate();
        }
      },
      onPinClick: (idx, e) => {
        e.stopPropagation();
        this._onPinClick(e);
      },
      onPointerDown: (e, idx) => this._handleChipPointerDown(e, idx),
      onPointerMove: (e, idx) => this._handleChipPointerMove(e, idx),
      onPointerUp: (e, idx) => this._handleChipPointerUp(e, idx)
    })}
                </div>
            ` : nothing}
            ${renderActionChipRow({
      actions: this.config.actions,
      onActionChipClick: idx => this._onActionChipClick(idx)
    })}
            <div class="card-lower-content-container">
              <div class="card-lower-content-bg"
                style="
                  background-image: ${idleImageUrl ? `url('${idleImageUrl}')` : artworkUrl ? `url('${artworkUrl}')` : "none"};
                  min-height: ${collapsed ? hideControlsNow ? "120px" : "0px" : "320px"};
                  background-size: cover;
                  background-position: top center;
                  background-repeat: no-repeat;
                  filter: ${collapsed && artworkUrl ? "blur(18px) brightness(0.7) saturate(1.15)" : "none"};
                  transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s;
                "
              ></div>
              ${!dimIdleFrame ? html`<div class="card-lower-fade"></div>` : nothing}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}" style="${collapsed && hideControlsNow ? 'min-height: 120px;' : ''}">
                ${collapsed && artworkUrl ? html`
                  <div class="collapsed-artwork-container"
                       style="background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%);">
                    <img class="collapsed-artwork" src="${artworkUrl}" />
                  </div>
                ` : nothing}
                ${!collapsed ? html`<div class="card-artwork-spacer"></div>` : nothing}
                ${!collapsed && !artworkUrl && !idleImageUrl ? html`
                  <div class="media-artwork-placeholder"
                    style="
                      position: absolute;
                      left: 50%; top: 36px;
                      transform: translateX(-50%);
                      width: 184px; height: 184px;
                      display: flex; align-items: center; justify-content: center;
                      background: none;
                      z-index: 2;">
                    <svg width="184" height="184" viewBox="0 0 184 184"
                      style="display:block;opacity:0.85;${this.config.match_theme === true ? 'color:#fff;' : `color:${this._customAccent};`}"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"/>
                      <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"/>
                      <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"/>
                      <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"/>
                    </svg>
                  </div>
                ` : nothing}
                <div class="details">
                  <div class="title">
                    ${isPlaying ? title : ""}
                  </div>
                  ${isPlaying && artist ? html`
                    <div
                      class="artist ${stateObj.attributes.media_artist ? 'clickable-artist' : ''}"
                      @click=${() => {
      if (stateObj.attributes.media_artist) this._searchArtistFromNowPlaying();
    }}
                      title=${stateObj.attributes.media_artist ? "Search for this artist" : ""}
                    >${artist}</div>
                  ` : nothing}
                </div>
                ${!collapsed && !this._alternateProgressBar ? isPlaying && duration ? renderProgressBar({
      progress,
      seekEnabled: true,
      onSeek: e => this._onProgressBarClick(e),
      collapsed: false,
      accent: this._customAccent
    }) : renderProgressBar({
      progress: 0,
      seekEnabled: false,
      collapsed: false,
      accent: this._customAccent,
      style: "visibility:hidden"
    }) : nothing}
                ${(collapsed || this._alternateProgressBar) && isPlaying && duration ? renderProgressBar({
      progress,
      collapsed: true,
      accent: this._customAccent
    }) : nothing}
                ${!hideControlsNow ? html`
                ${renderControlsRow({
      stateObj: playbackStateObj,
      showStop: this._shouldShowStopButton(playbackStateObj),
      shuffleActive,
      repeatActive,
      onControlClick: action => this._onControlClick(action),
      supportsFeature: (state, feature) => this._supportsFeature(state, feature)
    })}

                ${renderVolumeRow({
      isRemoteVolumeEntity,
      showSlider,
      vol,
      isMuted: ((_this$currentVolumeSt3 = this.currentVolumeStateObj) === null || _this$currentVolumeSt3 === void 0 || (_this$currentVolumeSt3 = _this$currentVolumeSt3.attributes) === null || _this$currentVolumeSt3 === void 0 ? void 0 : _this$currentVolumeSt3.is_volume_muted) ?? false,
      supportsMute: this.currentVolumeStateObj ? this._supportsFeature(this.currentVolumeStateObj, SUPPORT_VOLUME_MUTE) : false,
      onVolumeDragStart: e => this._onVolumeDragStart(e),
      onVolumeDragEnd: e => this._onVolumeDragEnd(e),
      onVolumeChange: e => this._onVolumeChange(e),
      onVolumeStep: dir => this._onVolumeStep(dir),
      onMuteToggle: () => this._onMuteToggle(),
      moreInfoMenu: html`
                    <div class="more-info-menu">
                      <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                        <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                      </button>
                    </div>
                  `
    })}
                ` : nothing}
                ${hideControlsNow ? html`
                  <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: 10;">
                    <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                      <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                    </button>
                  </div>
                ` : nothing}
              </div>
            </div>
          </div>
          ${this._showEntityOptions ? html`
          <div class="entity-options-overlay" @click=${e => this._closeEntityOptions(e)}>
            <div class="entity-options-sheet" @click=${e => e.stopPropagation()}>
              ${!this._showGrouping && !this._showSourceList && !this._showSearchInSheet && !this._showResolvedEntities ? html`
                <div class="entity-options-menu" style="display:flex; flex-direction:column; margin-top:auto; margin-bottom:20px;">
                  <button class="entity-options-item" @click=${() => {
      const resolvedEntities = this._getResolvedEntitiesForCurrentChip();
      if (resolvedEntities.length === 1) {
        this._openMoreInfoForEntity(resolvedEntities[0]);
        this._showEntityOptions = false;
      } else {
        this._showResolvedEntities = true;
      }
      this.requestUpdate();
    }}>More Info</button>
                  <button class="entity-options-item" @click=${() => {
      this._showSearchSheetInOptions();
    }}>Search</button>
                  ${Array.isArray((_this$currentStateObj = this.currentStateObj) === null || _this$currentStateObj === void 0 || (_this$currentStateObj = _this$currentStateObj.attributes) === null || _this$currentStateObj === void 0 ? void 0 : _this$currentStateObj.source_list) && this.currentStateObj.attributes.source_list.length > 0 ? html`
                      <button class="entity-options-item" @click=${() => this._openSourceList()}>Source</button>
                    ` : nothing}
                  ${(() => {
      const totalEntities = this.entityIds.length;
      const groupableCount = this.entityIds.reduce((acc, id) => {
        var _this$_maResolveCache4;
        const obj = this.entityObjs.find(e => e.entity_id === id);
        if (!obj) return acc;

        // Use cached resolved entity for feature checking
        const idx = this.entityIds.indexOf(id);
        const cached = (_this$_maResolveCache4 = this._maResolveCache) === null || _this$_maResolveCache4 === void 0 || (_this$_maResolveCache4 = _this$_maResolveCache4[idx]) === null || _this$_maResolveCache4 === void 0 ? void 0 : _this$_maResolveCache4.id;
        let actualGroupId;
        if (obj.music_assistant_entity) {
          if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
            // For templates, use cached resolved entity
            actualGroupId = cached || obj.entity_id;
          } else {
            actualGroupId = obj.music_assistant_entity;
          }
        } else {
          actualGroupId = obj.entity_id;
        }
        const st = this.hass.states[actualGroupId];
        return acc + (this._supportsFeature(st, SUPPORT_GROUPING) ? 1 : 0);
      }, 0);

      // Check current entity's grouping support
      const currObj = this.entityObjs[this._selectedIndex];
      let currGroupId;
      if (currObj !== null && currObj !== void 0 && currObj.music_assistant_entity) {
        if (typeof currObj.music_assistant_entity === 'string' && (currObj.music_assistant_entity.includes('{{') || currObj.music_assistant_entity.includes('{%'))) {
          var _this$_maResolveCache5;
          // For templates, use cached resolved entity
          const cached = (_this$_maResolveCache5 = this._maResolveCache) === null || _this$_maResolveCache5 === void 0 || (_this$_maResolveCache5 = _this$_maResolveCache5[this._selectedIndex]) === null || _this$_maResolveCache5 === void 0 ? void 0 : _this$_maResolveCache5.id;
          currGroupId = cached || currObj.entity_id;
        } else {
          currGroupId = currObj.music_assistant_entity;
        }
      } else {
        currGroupId = currObj === null || currObj === void 0 ? void 0 : currObj.entity_id;
      }
      const currGroupState = this.hass.states[currGroupId];
      if (totalEntities > 1 && groupableCount > 1 && this._supportsFeature(currGroupState, SUPPORT_GROUPING)) {
        return html`
                          <button class="entity-options-item" @click=${() => this._openGrouping()}>Group Players</button>
                        `;
      }
      return nothing;
    })()}
                  <button class="entity-options-item" @click=${() => this._closeEntityOptions()}>Close</button>
                </div>
              ` : this._showResolvedEntities ? html`
                <button class="entity-options-item" @click=${() => {
      this._showResolvedEntities = false;
      this.requestUpdate();
    }} style="margin-bottom:14px;">&larr; Back</button>
                <div class="entity-options-resolved-entities" style="margin-top:12px;">
                  <div class="entity-options-title">Select Entity for More Info</div>
                  <div class="entity-options-resolved-entities-list">
                    ${this._getResolvedEntitiesForCurrentChip().map(entityId => {
      var _this$hass20, _state$attributes4, _state$attributes5;
      const state = (_this$hass20 = this.hass) === null || _this$hass20 === void 0 || (_this$hass20 = _this$hass20.states) === null || _this$hass20 === void 0 ? void 0 : _this$hass20[entityId];
      const name = (state === null || state === void 0 || (_state$attributes4 = state.attributes) === null || _state$attributes4 === void 0 ? void 0 : _state$attributes4.friendly_name) || entityId;
      const icon = (state === null || state === void 0 || (_state$attributes5 = state.attributes) === null || _state$attributes5 === void 0 ? void 0 : _state$attributes5.icon) || "mdi:help-circle";

      // Determine the role of this entity
      const idx = this._selectedIndex;
      const obj = this.entityObjs[idx];
      let role = "Main Entity";
      if (obj) {
        const maEntity = this._getActualResolvedMaEntityForState(idx);
        const volEntity = this._getVolumeEntity(idx);
        if (entityId === maEntity && maEntity !== obj.entity_id) {
          role = "Music Assistant Entity";
        } else if (entityId === volEntity && volEntity !== obj.entity_id && volEntity !== maEntity) {
          role = "Volume Entity";
        }
      }
      return html`
                        <button class="entity-options-item" @click=${() => {
        this._openMoreInfoForEntity(entityId);
        this._showEntityOptions = false;
        this._showResolvedEntities = false;
        this.requestUpdate();
      }}>
                          <ha-icon .icon=${icon} style="margin-right: 8px;"></ha-icon>
                          <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <div>${name}</div>
                            <div style="font-size: 0.85em; opacity: 0.7;">${role}</div>
                          </div>
                        </button>
                      `;
    })}
                  </div>
                </div>
              ` : this._showSearchInSheet ? html`
                <div class="entity-options-search" style="margin-top:12px;">
                  <div class="entity-options-search-row">
                      <input
                        type="text"
                        id="search-input-box"
                        autofocus
                        class="entity-options-search-input"
                        .value=${this._searchQuery}
                        @input=${e => {
      this._searchQuery = e.target.value;
      this.requestUpdate();
    }}
                        @keydown=${e => {
      if (e.key === "Enter") {
        e.preventDefault();
        this._doSearch();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this._hideSearchSheetInOptions();
      }
    }}
                        placeholder="Search music..."
                        style="flex:1; min-width:0; font-size:1.1em;"
                      />
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._doSearch()}
                      ?disabled=${this._searchLoading || !this._searchQuery}>
                      Search
                    </button>
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._hideSearchSheetInOptions()}>
                      Cancel
                    </button>
                  </div>
                  <!-- FILTER CHIPS -->
                  ${(() => {
      const classes = Array.from(new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean)));
      const filter = this._searchMediaClassFilter || "all";
      if (classes.length < 2) return nothing;
      return html`
                      <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center;">
                        <button
                          class="chip"
                          style="
                            width: 72px;
                            background: ${filter === 'all' ? this._customAccent : '#282828'};
                            opacity: ${filter === 'all' ? '1' : '0.8'};
                            font-weight: ${filter === 'all' ? 'bold' : 'normal'};
                          "
                          ?selected=${filter === 'all'}
                          @click=${() => {
        this._searchMediaClassFilter = "all";
        this.requestUpdate();
      }}
                        >All</button>
                        ${classes.map(c => html`
                          <button
                            class="chip"
                            style="
                              width: 72px;
                              background: ${filter === c ? this._customAccent : '#282828'};
                              opacity: ${filter === c ? '1' : '0.8'};
                              font-weight: ${filter === c ? 'bold' : 'normal'};
                            "
                            ?selected=${filter === c}
                            @click=${() => {
        this._searchMediaClassFilter = c;
        this.requestUpdate();
      }}
                          >
                            ${c.charAt(0).toUpperCase() + c.slice(1)}
                          </button>
                        `)}
                      </div>
                    `;
    })()}
                  ${this._searchLoading ? html`<div class="entity-options-search-loading">Loading...</div>` : nothing}
                  ${this._searchError ? html`<div class="entity-options-search-error">${this._searchError}</div>` : nothing}
                  <div class="entity-options-search-results">
                    ${(() => {
      const filter = this._searchMediaClassFilter || "all";
      const allResults = this._searchResults || [];
      const filteredResults = filter === "all" ? allResults : allResults.filter(item => item.media_class === filter);
      // Build padded array so row‑count stays constant
      const totalRows = Math.max(15, this._searchTotalRows || allResults.length);
      const paddedResults = [...filteredResults, ...Array.from({
        length: Math.max(0, totalRows - filteredResults.length)
      }, () => null)];
      // Always render paddedResults, even before first search
      return this._searchAttempted && filteredResults.length === 0 && !this._searchLoading ? html`<div class="entity-options-search-empty">No results.</div>` : paddedResults.map(item => item ? html`
                            <!-- EXISTING non‑placeholder row markup -->
                            <div class="entity-options-search-result">
                              <img
                                class="entity-options-search-thumb"
                                src=${item.thumbnail}
                                alt=${item.title}
                                style="height:38px;width:38px;object-fit:cover;border-radius:5px;margin-right:12px;"
                              />
                              <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
                                <span>${item.title}</span>
                                <span style="font-size:0.86em; color:#bbb; line-height:1.16; margin-top:2px;">
                                  ${item.media_class ? item.media_class.charAt(0).toUpperCase() + item.media_class.slice(1) : ""}
                                </span>
                              </div>
                              <button class="entity-options-search-play" @click=${() => this._playMediaFromSearch(item)}>
                                ▶
                              </button>
                            </div>
                          ` : html`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `);
    })()}
                  </div>
                </div>
              ` : this._showGrouping ? html`
                <button class="entity-options-item" @click=${() => this._closeGrouping()} style="margin-bottom:14px;">&larr; Back</button>
                ${(_masterState$attribut => {
      const masterGroupId = this._getGroupingEntityIdByIndex(this._selectedIndex);
      const masterState = this.hass.states[masterGroupId];
      const groupedAny = Array.isArray(masterState === null || masterState === void 0 || (_masterState$attribut = masterState.attributes) === null || _masterState$attribut === void 0 ? void 0 : _masterState$attribut.group_members) && masterState.attributes.group_members.length > 0;
      return html`
                      <div style="display:flex;align-items:center;justify-content:space-between;font-weight:600;margin-bottom:0;">
                        ${groupedAny ? html`
                          <button class="entity-options-item"
                            @click=${() => this._syncGroupVolume()}
                            style="color:#fff; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 16px 2px 0;">
                            Sync Volume
                          </button>
                        ` : html`<span></span>`}
                        <button class="entity-options-item"
                          @click=${() => groupedAny ? this._ungroupAll() : this._groupAll()}
                          style="color:#fff; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 0 2px 8px;">
                          ${groupedAny ? "Ungroup All" : "Group All"}
                        </button>
                      </div>
                    `;
    })()}
                <hr style="margin:8px 0 2px 0;opacity:0.19;border:0;border-top:1px solid #fff;" />
                ${(() => {
      // --- Begin new group player rows logic, wrapped in scrollable container ---
      const masterId = this.currentEntityId;

      // Build list of entities to show in group players menu
      // Prioritize Music Assistant entities when available, fall back to main entities only if they support grouping
      const groupPlayerIds = [];
      for (const id of this.entityIds) {
        const obj = this.entityObjs.find(e => e.entity_id === id);
        if (!obj) continue;
        let entityToCheck = null;
        let entityName = null;

        // First, check if there's a Music Assistant entity configured
        if (obj.music_assistant_entity) {
          let maEntityId;
          if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
            var _this$_maResolveCache6;
            // For templates, use the cached resolved entity
            const idx = this.entityIds.indexOf(id);
            const cached = (_this$_maResolveCache6 = this._maResolveCache) === null || _this$_maResolveCache6 === void 0 || (_this$_maResolveCache6 = _this$_maResolveCache6[idx]) === null || _this$_maResolveCache6 === void 0 ? void 0 : _this$_maResolveCache6.id;
            maEntityId = cached || obj.entity_id;
          } else {
            maEntityId = obj.music_assistant_entity;
          }
          const maState = this.hass.states[maEntityId];
          if (maState && this._supportsFeature(maState, SUPPORT_GROUPING)) {
            entityToCheck = maEntityId;
            entityName = id; // Use main entity name for display
          }
        }

        // If no MA entity supports grouping, check main entity
        if (!entityToCheck) {
          const mainState = this.hass.states[id];
          if (mainState && this._supportsFeature(mainState, SUPPORT_GROUPING)) {
            entityToCheck = id;
            entityName = id;
          }
        }

        // Add to list if we found a valid grouping entity
        if (entityToCheck && entityName) {
          groupPlayerIds.push({
            id: entityName,
            groupId: entityToCheck
          });
        }
      }

      // Sort with master first
      const masterFirst = groupPlayerIds.find(item => item.id === masterId);
      const others = groupPlayerIds.filter(item => item.id !== masterId);
      const sortedGroupIds = masterFirst ? [masterFirst, ...others] : groupPlayerIds;
      return html`
                      <div class="group-list-scroll" style="overflow-y: auto; max-height: 340px;">
                        ${sortedGroupIds.map(item => {
        var _displayVolumeState$a;
        const id = item.id;
        const actualGroupId = item.groupId;
        const obj = this.entityObjs.find(e => e.entity_id === id);
        if (!obj) return nothing;
        const name = this.getChipName(id);

        // Get the master's resolved MA entity for proper comparison
        const masterObj = this.entityObjs[this._selectedIndex];
        let masterGroupId;
        if (masterObj !== null && masterObj !== void 0 && masterObj.music_assistant_entity) {
          if (typeof masterObj.music_assistant_entity === 'string' && (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
            var _this$_maResolveCache7;
            // For templates, use cached resolved entity
            const cached = (_this$_maResolveCache7 = this._maResolveCache) === null || _this$_maResolveCache7 === void 0 || (_this$_maResolveCache7 = _this$_maResolveCache7[this._selectedIndex]) === null || _this$_maResolveCache7 === void 0 ? void 0 : _this$_maResolveCache7.id;
            masterGroupId = cached || masterObj.entity_id;
          } else {
            masterGroupId = masterObj.music_assistant_entity;
          }
        } else {
          masterGroupId = masterObj === null || masterObj === void 0 ? void 0 : masterObj.entity_id;
        }
        const masterState = this.hass.states[masterGroupId];
        const grouped = actualGroupId === masterGroupId ? true : Array.isArray(masterState.attributes.group_members) && masterState.attributes.group_members.includes(actualGroupId);
        // Use unified entity resolution for grouping menu
        const entityIdx = this.entityIds.indexOf(id);
        const volumeEntity = this._getEntityForPurpose(entityIdx, 'grouping_control');
        // For group players menu, use the same entity for both control and display
        const displayEntity = volumeEntity;
        const displayVolumeState = this.hass.states[displayEntity];
        const isRemoteVol = displayEntity.startsWith && displayEntity.startsWith("remote.");
        const volVal = Number((displayVolumeState === null || displayVolumeState === void 0 || (_displayVolumeState$a = displayVolumeState.attributes) === null || _displayVolumeState$a === void 0 ? void 0 : _displayVolumeState$a.volume_level) || 0);
        return html`
                            <div style="
                              display: flex;
                              align-items: center;
                              padding: 6px 4px;
                            ">
                              <span style="
                                display:inline-block;
                                width: 140px;
                                min-width: 100px;
                                max-width: 160px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                              ">${name}</span>
                              <div style="flex:1;display:flex;align-items:center;gap:9px;margin:0 10px;">
                                ${isRemoteVol ? html`
                                        <div class="vol-stepper">
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, -1)} title="Vol Down">–</button>
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, 1)} title="Vol Up">+</button>
                                        </div>
                                      ` : html`
                                        <input
                                          class="vol-slider"
                                          type="range"
                                          min="0"
                                          max="1"
                                          step="0.01"
                                          .value=${volVal}
                                          @change=${e => this._onGroupVolumeChange(id, volumeEntity, e)}
                                          title="Volume"
                                          style="width:100%;max-width:260px;"
                                        />
                                      `}
                                <span style="min-width:34px;display:inline-block;text-align:right;">${typeof volVal === "number" ? Math.round(volVal * 100) + "%" : "--"}</span>
                              </div>
                              ${actualGroupId === masterGroupId ? html`
                                      <button class="group-toggle-btn group-toggle-transparent"
                                              disabled
                                              aria-label="Master"
                                              style="margin-left:14px;"></button>
                                    ` : html`
                                      <button class="group-toggle-btn"
                                              @click=${() => this._toggleGroup(id)}
                                              title=${grouped ? "Unjoin" : "Join"}
                                              style="margin-left:14px;">
                                        <span class="group-toggle-fix">${grouped ? "–" : "+"}</span>
                                      </button>
                                    `}
                            </div>
                          `;
      })}
                      </div>
                    `;
      // --- End new group player rows logic ---
    })()}
              ` : html`
                <button class="entity-options-item" @click=${() => this._closeSourceList()} style="margin-bottom:14px;">&larr; Back</button>
                <div class="entity-options-sheet source-list-sheet" style="position:relative;">
                  <div class="source-list-scroll" style="overflow-y:auto;max-height:340px;">
                    ${sourceList.map(src => html`
                      <div class="entity-options-item" data-source-name="${src}" @click=${() => this._selectSource(src)}>${src}</div>
                    `)}
                  </div>
                </div>
                <div class="floating-source-index">
                  ${sourceLetters.map((letter, i) => {
      const hovered = this._hoveredSourceLetterIndex;
      let scale = "";
      if (hovered !== null && hovered !== undefined) {
        const dist = Math.abs(hovered - i);
        if (dist === 0) scale = "max";else if (dist === 1) scale = "large";else if (dist === 2) scale = "med";
      }
      return html`
                      <button
                        class="source-index-letter"
                        data-scale=${scale}
                        @mouseenter=${() => {
        this._hoveredSourceLetterIndex = i;
        this.requestUpdate();
      }}
                        @mouseleave=${() => {
        this._hoveredSourceLetterIndex = null;
        this.requestUpdate();
      }}
                        @click=${() => this._scrollToSourceLetter(letter)}
                      >
                        ${letter}
                      </button>
                    `;
    })}
                </div>
              `}
            </div>
          </div>
        ` : nothing}
          ${this._searchOpen ? renderSearchSheet({
      open: this._searchOpen,
      query: this._searchQuery,
      loading: this._searchLoading,
      results: this._searchResults,
      error: this._searchError,
      onClose: () => this._searchCloseSheet(),
      onQueryInput: e => {
        this._searchQuery = e.target.value;
        this.requestUpdate();
      },
      onSearch: () => this._doSearch(),
      onPlay: item => this._playMediaFromSearch(item)
    }) : nothing}
        </ha-card>
      `;
  }
  _updateIdleState() {
    var _this$hass21;
    // Check if ANY relevant entity (main or MA) is playing
    const mainState = this.currentStateObj;
    // Use actual resolved MA entity for state detection (can be unconfigured)
    const actualMaId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const actualMaState = actualMaId ? (_this$hass21 = this.hass) === null || _this$hass21 === void 0 || (_this$hass21 = _this$hass21.states) === null || _this$hass21 === void 0 ? void 0 : _this$hass21[actualMaId] : null;
    const isAnyPlaying = (mainState === null || mainState === void 0 ? void 0 : mainState.state) === "playing" || (actualMaState === null || actualMaState === void 0 ? void 0 : actualMaState.state) === "playing";
    if (isAnyPlaying) {
      // Became active, clear timer and set not idle
      if (this._idleTimeout) clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
      if (this._isIdle) {
        this._isIdle = false;
        this.requestUpdate();
      }
    } else {
      var _this$_playbackLinger5;
      // Only set timer if not already idle and not already waiting, and idle_timeout_ms > 0
      // Also check if there's an active linger - don't go idle if there's a linger
      const hasActiveLinger = ((_this$_playbackLinger5 = this._playbackLingerByIdx) === null || _this$_playbackLinger5 === void 0 ? void 0 : _this$_playbackLinger5[this._selectedIndex]) && this._playbackLingerByIdx[this._selectedIndex].until > Date.now();
      if (!this._isIdle && !this._idleTimeout && this._idleTimeoutMs > 0 && !hasActiveLinger) {
        this._idleTimeout = setTimeout(() => {
          this._isIdle = true;
          this._idleTimeout = null;
          this.requestUpdate();
        }, this._idleTimeoutMs);
      }
    }
  }

  // Home assistant layout options
  getGridOptions() {
    // Use the same logic as in render() to know if the card is collapsed.
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
      collapsed = false;
    } else {
      collapsed = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    }
    const minRows = collapsed ? 2 : 4;
    return {
      min_rows: minRows,
      // Keep the default full‑width behaviour explicit.
      columns: 12
    };
  }

  // Configuration editor schema for Home Assistant UI editors
  static get _schema() {
    return [{
      name: "entities",
      selector: {
        entity: {
          multiple: true,
          domain: "media_player"
        }
      },
      required: true
    }, {
      name: "show_chip_row",
      selector: {
        select: {
          options: [{
            value: "auto",
            label: "Auto"
          }, {
            value: "always",
            label: "Always"
          }]
        }
      },
      required: false
    }, {
      name: "hold_to_pin",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "idle_image",
      selector: {
        entity: {
          domain: "",
          multiple: false
        }
      },
      required: false
    }, {
      name: "match_theme",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "collapse_on_idle",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "always_collapsed",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "expand_on_search",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "alternate_progress_bar",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "idle_timeout_ms",
      selector: {
        number: {
          min: 0,
          step: 1000,
          unit_of_measurement: "ms",
          mode: "box"
        }
      },
      required: false
    }, {
      name: "volume_step",
      selector: {
        number: {
          min: 0.01,
          max: 1,
          step: 0.01,
          unit_of_measurement: "",
          mode: "box"
        }
      },
      required: false
    }, {
      name: "volume_mode",
      selector: {
        select: {
          options: [{
            value: "slider",
            label: "Slider"
          }, {
            value: "stepper",
            label: "Stepper"
          }]
        }
      },
      required: false
    }, {
      name: "actions",
      selector: {
        object: {}
      },
      required: false
    }];
  }
  firstUpdated() {
    var _super$firstUpdated;
    (_super$firstUpdated = super.firstUpdated) === null || _super$firstUpdated === void 0 || _super$firstUpdated.call(this);
    // Trap scroll events inside floating index so they don't scroll the page
    const index = this.renderRoot.querySelector('.floating-source-index');
    if (index) {
      index.addEventListener('wheel', function (e) {
        const {
          scrollTop,
          scrollHeight,
          clientHeight
        } = index;
        const delta = e.deltaY;
        if (delta < 0 && scrollTop === 0 || delta > 0 && scrollTop + clientHeight >= scrollHeight) {
          e.preventDefault();
          e.stopPropagation();
        }
        // Otherwise, allow scroll
      }, {
        passive: false
      });
    }
  }
  _addGrabScroll(selector) {
    const row = this.renderRoot.querySelector(selector);
    if (!row || row._grabScrollAttached) return;
    let isDown = false;
    let startX, scrollLeft;
    // Track drag state to suppress clicks

    const mousedownHandler = e => {
      isDown = true;
      row._dragged = false;
      row.classList.add('grab-scroll-active');
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
      e.preventDefault();
    };
    const mouseleaveHandler = () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    };
    const mouseupHandler = () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    };
    const mousemoveHandler = e => {
      if (!isDown) return;
      const x = e.pageX - row.offsetLeft;
      const walk = x - startX;
      // Mark as dragged if moved > 5px
      if (Math.abs(walk) > 5) {
        row._dragged = true;
      }
      e.preventDefault();
      row.scrollLeft = scrollLeft - walk;
    };
    const clickHandler = e => {
      if (row._dragged) {
        e.stopPropagation();
        e.preventDefault();
        row._dragged = false;
      }
    };
    row.addEventListener('mousedown', mousedownHandler);
    row.addEventListener('mouseleave', mouseleaveHandler);
    row.addEventListener('mouseup', mouseupHandler);
    row.addEventListener('mousemove', mousemoveHandler);
    row.addEventListener('click', clickHandler, true);

    // Store handlers for cleanup
    row._grabScrollHandlers = {
      mousedown: mousedownHandler,
      mouseleave: mouseleaveHandler,
      mouseup: mouseupHandler,
      mousemove: mousemoveHandler,
      click: clickHandler
    };
    row._grabScrollAttached = true;
  }
  _addVerticalGrabScroll(selector) {
    const col = this.renderRoot.querySelector(selector);
    if (!col || col._grabScrollAttached) return;
    let isDown = false;
    let startY, scrollTop;
    const mousedownHandler = e => {
      isDown = true;
      col._dragged = false;
      col.classList.add('grab-scroll-active');
      startY = e.pageY - col.getBoundingClientRect().top;
      scrollTop = col.scrollTop;
      e.preventDefault();
    };
    const mouseleaveHandler = () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    };
    const mouseupHandler = () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    };
    const mousemoveHandler = e => {
      if (!isDown) return;
      const y = e.pageY - col.getBoundingClientRect().top;
      const walk = y - startY;
      if (Math.abs(walk) > 5) col._dragged = true;
      e.preventDefault();
      col.scrollTop = scrollTop - walk;
    };
    const clickHandler = e => {
      if (col._dragged) {
        e.stopPropagation();
        e.preventDefault();
        col._dragged = false;
      }
    };
    col.addEventListener('mousedown', mousedownHandler);
    col.addEventListener('mouseleave', mouseleaveHandler);
    col.addEventListener('mouseup', mouseupHandler);
    col.addEventListener('mousemove', mousemoveHandler);
    col.addEventListener('click', clickHandler, true);

    // Store handlers for cleanup
    col._grabScrollHandlers = {
      mousedown: mousedownHandler,
      mouseleave: mouseleaveHandler,
      mouseup: mouseupHandler,
      mousemove: mousemoveHandler,
      click: clickHandler
    };
    col._grabScrollAttached = true;
  }
  _removeGrabScrollHandlers() {
    // Remove grab scroll handlers from all elements
    const elements = this.renderRoot.querySelectorAll('[data-grab-scroll]');
    elements.forEach(el => {
      if (el._grabScrollHandlers) {
        const handlers = el._grabScrollHandlers;
        el.removeEventListener('mousedown', handlers.mousedown);
        el.removeEventListener('mouseleave', handlers.mouseleave);
        el.removeEventListener('mouseup', handlers.mouseup);
        el.removeEventListener('mousemove', handlers.mousemove);
        el.removeEventListener('click', handlers.click, true);
        delete el._grabScrollHandlers;
        el._grabScrollAttached = false;
      }
    });
  }
  _removeSearchSwipeHandlers() {
    // Remove search swipe handlers
    const area = this.renderRoot.querySelector('.entity-options-search-results');
    if (area && area._searchSwipeHandlers) {
      const handlers = area._searchSwipeHandlers;
      area.removeEventListener('touchstart', handlers.touchstart);
      area.removeEventListener('touchend', handlers.touchend);
      delete area._searchSwipeHandlers;
      this._searchSwipeAttached = false;
    }
  }
  disconnectedCallback() {
    var _super$disconnectedCa;
    if (this._idleTimeout) {
      clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
    }
    (_super$disconnectedCa = super.disconnectedCallback) === null || _super$disconnectedCa === void 0 || _super$disconnectedCa.call(this);
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    if (this._debouncedVolumeTimer) {
      clearTimeout(this._debouncedVolumeTimer);
      this._debouncedVolumeTimer = null;
    }
    if (this._manualSelectTimeout) {
      clearTimeout(this._manualSelectTimeout);
      this._manualSelectTimeout = null;
    }
    this._removeSourceDropdownOutsideHandler();
    this._removeGrabScrollHandlers();
    this._removeSearchSwipeHandlers();
    // Clear tracking properties
    this._lastPlayingEntityId = null;
    this._controlFocusEntityId = null;
  }
  // Entity options overlay handlers
  _closeEntityOptions() {
    if (this._showGrouping) {
      // Close the grouping sheet and the overlay
      this._showGrouping = false;
      this._showEntityOptions = false;
      // Auto-select the chip for the group just created (same as _closeGrouping logic)
      const groups = this.groupedSortedEntityIds;
      const curId = this.currentEntityId;
      const group = groups.find(g => g.includes(curId));
      if (group && group.length > 1) {
        const master = this._getActualGroupMaster(group);
        const idx = this.entityIds.indexOf(master);
        if (idx >= 0) this._selectedIndex = idx;
      }
      this.requestUpdate();
    } else {
      this._showEntityOptions = false;
      this._showGrouping = false;
      this._showSourceList = false;
      this.requestUpdate();
    }
  }
  async _openEntityOptions() {
    // Resolve all templates before opening the menu so feature checking works correctly
    for (let i = 0; i < this.entityObjs.length; i++) {
      await this._ensureResolvedMaForIndex(i);
    }
    this._showEntityOptions = true;
    this.requestUpdate();
  }

  // Deprecated: _triggerMoreInfo is replaced by _openMoreInfo for clarity.

  // Grouping Helper Methods 
  _openGrouping() {
    this._showEntityOptions = true; // ensure the overlay is visible
    this._showGrouping = true; // show grouping sheet immediately
    // Remember the current entity as the last grouping master
    this._lastGroupingMasterId = this.currentEntityId;
    this.requestUpdate();
  }

  // Source List Helper Methods
  _openSourceList() {
    this._showEntityOptions = true;
    this._showSourceList = true;
    this._showGrouping = false;
    this.requestUpdate();
  }
  _closeSourceList() {
    this._showSourceList = false;
    this.requestUpdate();
  }
  _closeGrouping() {
    this._showGrouping = false;
    // After closing, try to keep the master chip selected if still valid
    const groups = this.groupedSortedEntityIds;
    let masterId = this._lastGroupingMasterId;
    // Find the group that contains the last grouping master, if any
    const group = groups.find(g => masterId && g.includes(masterId));
    if (group && group.length > 1) {
      const master = this._getActualGroupMaster(group);
      const idx = this.entityIds.indexOf(master);
      if (idx >= 0) this._selectedIndex = idx;
    }
    // No requestUpdate here; overlay close will handle it.
  }
  async _toggleGroup(targetId) {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }

    // Get the target entity's resolved MA entity for grouping
    const targetObj = this.entityObjs.find(e => e.entity_id === targetId);
    if (!targetObj) return;
    let targetGroupId;
    if (targetObj.music_assistant_entity) {
      if (typeof targetObj.music_assistant_entity === 'string' && (targetObj.music_assistant_entity.includes('{{') || targetObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        targetGroupId = await this._resolveTemplateAtActionTime(targetObj.music_assistant_entity, targetId);
      } else {
        targetGroupId = targetObj.music_assistant_entity;
      }
    } else {
      targetGroupId = targetId;
    }
    if (!masterGroupId || !targetGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    const grouped = Array.isArray(masterState === null || masterState === void 0 ? void 0 : masterState.attributes.group_members) && masterState.attributes.group_members.includes(targetGroupId);
    if (grouped) {
      // Unjoin the target from the group
      await this.hass.callService("media_player", "unjoin", {
        entity_id: targetGroupId
      });
    } else {
      // Join the target player to the master's group
      await this.hass.callService("media_player", "join", {
        entity_id: masterGroupId,
        // call on the master
        group_members: [targetGroupId] // player(s) to add
      });
    }
    // Keep sheet open for more grouping actions
  }

  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor-beta");
  }
  static getStubConfig(hass, entities) {
    return {
      entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2)
    };
  }

  // Group all supported entities to current master
  async _groupAll() {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;

    // Get all other entities that support grouping and are not already grouped with master
    const alreadyGrouped = Array.isArray(masterState.attributes.group_members) ? masterState.attributes.group_members : [];

    // Build list of resolved MA entities to join
    const toJoin = [];
    for (const id of this.entityIds) {
      if (id === this.currentEntityId) continue;
      const obj = this.entityObjs.find(e => e.entity_id === id);
      if (!obj) continue;
      let resolvedGroupId;
      if (obj.music_assistant_entity) {
        if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
          // For templates, resolve at action time
          resolvedGroupId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, id);
        } else {
          resolvedGroupId = obj.music_assistant_entity;
        }
      } else {
        resolvedGroupId = id;
      }
      const st = this.hass.states[resolvedGroupId];
      if (this._supportsFeature(st, SUPPORT_GROUPING) && !alreadyGrouped.includes(resolvedGroupId)) {
        toJoin.push(resolvedGroupId);
      }
    }
    if (toJoin.length > 0) {
      await this.hass.callService("media_player", "join", {
        entity_id: masterGroupId,
        group_members: toJoin
      });
    }
    // After grouping, keep the master set if still valid
    this._lastGroupingMasterId = this.currentEntityId;
    // Remain in grouping sheet
  }

  // Ungroup all members from current master
  async _ungroupAll() {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;
    const members = Array.isArray(masterState.attributes.group_members) ? masterState.attributes.group_members : [];
    // Only unjoin those that support grouping
    const toUnjoin = members.filter(id => {
      const st = this.hass.states[id];
      return this._supportsFeature(st, SUPPORT_GROUPING);
    });
    // Unjoin each member individually
    for (const id of toUnjoin) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: id
      });
    }
    // After ungrouping, keep the master set if still valid (may now be solo)
    this._lastGroupingMasterId = this.currentEntityId;
    // Remain in grouping sheet
  }

  // Synchronize all group member volumes to match the master
  async _syncGroupVolume() {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;
    // For sync volume, use the same entity that's being used for grouping (the MA entity) to get the master volume
    const masterVolumeEntity = masterGroupId;
    const masterVolumeState = masterVolumeEntity ? this.hass.states[masterVolumeEntity] : null;
    if (!masterVolumeState) return;
    const masterVol = Number(masterVolumeState.attributes.volume_level || 0);
    const members = Array.isArray(masterState.attributes.group_members) ? masterState.attributes.group_members : [];
    for (const groupedId of members) {
      // Find the configured entity that has this grouping entity
      let foundObj = null;
      for (const obj of this.entityObjs) {
        let resolvedGroupingId;
        if (obj.music_assistant_entity) {
          if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
            // For templates, resolve at action time
            try {
              resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
            } catch (error) {
              console.warn('Failed to resolve template for sync volume:', error);
              resolvedGroupingId = obj.entity_id;
            }
          } else {
            resolvedGroupingId = obj.music_assistant_entity;
          }
        } else {
          resolvedGroupingId = obj.entity_id;
        }
        if (resolvedGroupingId === groupedId) {
          foundObj = obj;
          break;
        }
      }
      if (!foundObj) continue;

      // For sync volume, use the same entity that's being used for grouping (the MA entity)
      const volumeEntity = groupedId;
      await this.hass.callService("media_player", "volume_set", {
        entity_id: volumeEntity,
        volume_level: masterVol
      });
    }
  }

  // Get all resolved entities for the current chip (main, MA, volume)
  _getResolvedEntitiesForCurrentChip() {
    const entities = new Set();
    const idx = this._selectedIndex;
    const obj = this.entityObjs[idx];
    if (!obj) return [];

    // Add main entity
    entities.add(obj.entity_id);

    // Add resolved MA entity if different from main
    const maEntity = this._getActualResolvedMaEntityForState(idx);
    if (maEntity && maEntity !== obj.entity_id) {
      entities.add(maEntity);
    }

    // Add resolved volume entity if different from main and MA
    const volEntity = this._getVolumeEntity(idx);
    if (volEntity && volEntity !== obj.entity_id && volEntity !== maEntity) {
      entities.add(volEntity);
    }
    return Array.from(entities);
  }

  // Open more-info for a specific entity
  _openMoreInfoForEntity(entityId) {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: {
        entityId
      },
      bubbles: true,
      composed: true
    }));
  }
  _openMoreInfo() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: {
        entityId: this.currentEntityId
      },
      bubbles: true,
      composed: true
    }));
  }
}
customElements.define("yet-another-media-player-beta", YetAnotherMediaPlayerCard);
