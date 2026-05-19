import { html, nothing } from "lit";
import { getValidArtworkAttr, getArtworkUrl } from "./yamp-utils.js";
import { localize } from "./localize/localize.js";

// Helper to render a single chip
export function renderChip({
  idx,
  selected,
  playing,
  name,
  art,
  icon,
  pinned,
  holdToPin,
  maActive,
  onChipClick,
  onIconClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  objectFit,
  quickGroupingState,
  onQuickGroupClick,
  onDoubleClick
}) {
  const artStyle = objectFit ? `object-fit: ${objectFit};` : "";
  return html`
    <button class="chip"
            ?selected=${selected}
            ?playing=${playing}
            ?ma-active=${maActive}
            @dblclick=${onDoubleClick}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
      <span class="chip-icon">
        ${art
      ? html`<img class="chip-mini-art" src="${art}" style="${artStyle}" onerror="this.style.display='none'" />`
      : html`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${name}
      </span>
      ${playing
      ? html`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          `
      : nothing}
      ${pinned
      ? html`
            <span class="chip-pin-inside" @click=${e => { e.stopPropagation(); onPinClick(idx, e); }} title="${localize('common.unpin')}">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `
      : html`<span class="chip-pin-spacer"></span>`
    }
      ${renderQuickGroupIcon({ idx, quickGroupingState, onQuickGroupClick })}
    </button>
  `;
}

// Helper to render a group chip: same as chip but with label (with count), no badge/icon for group, just art/icon and label.
export function renderGroupChip({
  idx,
  selected,
  playing,
  groupName,
  art,
  icon,
  pinned,
  holdToPin,
  maActive,
  onChipClick,
  onIconClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  objectFit,
  quickGroupingState,
  onQuickGroupClick,
  onDoubleClick
}) {
  const artStyle = objectFit ? `object-fit: ${objectFit};` : "";
  return html`
    <button class="chip group"
            ?selected=${selected}
            ?ma-active=${maActive}
            @dblclick=${onDoubleClick}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
      <span class="chip-icon"
            style="cursor:pointer;"
            @click=${e => {
      e.stopPropagation();
      if (onIconClick) {
        onIconClick(idx, e);
      }
    }}>
        ${art
      ? html`<img class="chip-mini-art"
                      src="${art}"
                      style="cursor:pointer;${artStyle}"
                      onerror="this.style.display='none'"
                      @click=${e => {
          e.stopPropagation();
          if (onIconClick) {
            onIconClick(idx, e);
          }
        }}/>`

      : html`<ha-icon .icon=${icon}
                          style="font-size:28px;cursor:pointer;"
                          @click=${e => {
          e.stopPropagation();
          if (onIconClick) {
            onIconClick(idx, e);
          }
        }}></ha-icon>`
    }
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${groupName}
      </span>
      ${playing
      ? html`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          `
      : nothing}
      ${pinned
      ? html`
            <span class="chip-pin-inside" @click=${e => { e.stopPropagation(); onPinClick(idx, e); }} title="${localize('common.unpin')}">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `
      : html`<span class="chip-pin-spacer"></span>`
    }
      ${renderQuickGroupIcon({ idx, quickGroupingState, onQuickGroupClick })}
    </button>
  `;
}

// Helper to render the quick grouping icon (+/-/star) used by both renderChip and renderGroupChip
export function renderQuickGroupIcon({ idx, quickGroupingState, onQuickGroupClick }) {
  if (!quickGroupingState || !quickGroupingState.isGroupable) return nothing;

  const { isPrimary, isBusy, grouped, tooltip } = quickGroupingState;
  const title = tooltip || (isPrimary ? "Primary" : isBusy ? "Unavailable" : grouped ? "Unjoin" : "Join");
  const icon = isPrimary ? "mdi:star-circle-outline" : grouped ? "mdi:minus" : "mdi:plus";

  return html`
    <span class="chip-quick-group" 
          @click=${e => {
      e.stopPropagation();
      if (onQuickGroupClick && !isBusy && !isPrimary) onQuickGroupClick(idx, e);
    }} 
          title=${title} 
          style="${isPrimary ? 'cursor:default;opacity:0.7;' : isBusy ? 'opacity:0.5;cursor:not-allowed;' : ''}">
      <ha-icon .icon=${icon}></ha-icon>
    </span>
  `;
}

// Pin/hold logic helpers (timer, etc)
export function createHoldToPinHandler({ onPin, onHoldEnd, holdTime = 600, moveThreshold = 8 }) {
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
          onHoldEnd && onHoldEnd(idx);
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
export function renderChipRow({
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
  artworkHostname = '',
  mediaArtworkOverrides = [],
  fallbackArtwork = null,
  onChipClick,
  onIconClick,
  onPointerClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  quickGroupingMode,
  getQuickGroupingState,
  onQuickGroupClick,
  onDoubleClick
}) {
  if (!groupedSortedEntityIds || !groupedSortedEntityIds.length) return nothing;

  return html`
    ${groupedSortedEntityIds.map((group) => {
    // If it's a group (more than one entity)
    if (group.length > 1) {
      const id = getActualGroupMaster(group);
      const idx = entityIds.indexOf(id);
      const state = hass?.states?.[id];
      const isChipPlaying = (typeof getIsChipPlaying === "function")
        ? getIsChipPlaying(id, selectedEntityId === id)
        : (state?.state === "playing");
      const artObj = (typeof getChipArt === "function")
        ? getChipArt(id)
        : getArtworkUrl(state, { hostname: artworkHostname, overrides: mediaArtworkOverrides, fallbackArtwork });
      const art = artObj?.url;

      const objectFit = artObj?.objectFit;

      const icon = state?.attributes?.icon || "mdi:cast";
      const isMaActive = (typeof getIsMaActive === "function") ? getIsMaActive(id) : false;
      return renderGroupChip({
        idx,
        selected: selectedEntityId === id,
        playing: isChipPlaying,
        groupName: getChipName(id) + (group.length > 1 ? ` [${group.length}]` : ""),
        art,
        icon,
        pinned: pinnedIndex === idx,
        holdToPin,
        maActive: isMaActive,
        onChipClick,
        onIconClick,
        onPinClick,
        onPointerDown: (e) => onPointerDown(e, idx),
        onPointerMove: (e) => onPointerMove(e, idx),
        onPointerUp: (e) => onPointerUp(e, idx),
        objectFit,
        quickGroupingState: quickGroupingMode && typeof getQuickGroupingState === "function" ? getQuickGroupingState(id) : null,
        onQuickGroupClick,
        onDoubleClick
      });
    } else {
      // Single chip
      const id = group[0];
      const idx = entityIds.indexOf(id);
      const state = hass?.states?.[id];
      const isChipPlaying = (typeof getIsChipPlaying === "function")
        ? getIsChipPlaying(id, selectedEntityId === id)
        : (state?.state === "playing");
      const artObj = (typeof getChipArt === "function")
        ? getChipArt(id)
        : getArtworkUrl(state, { hostname: artworkHostname, overrides: mediaArtworkOverrides, fallbackArtwork });
      const artSource = artObj?.url;

      const objectFit = artObj?.objectFit;

      const art = selectedEntityId === id ? (!isIdle && artSource) : (isChipPlaying && artSource);
      const icon = state?.attributes?.icon || "mdi:cast";
      const isMaActive = (typeof getIsMaActive === "function") ? getIsMaActive(id) : false;
      return renderChip({
        idx,
        selected: selectedEntityId === id,
        playing: isChipPlaying,
        name: getChipName(id),
        art,
        icon,
        pinned: pinnedIndex === idx,
        holdToPin,
        maActive: isMaActive,
        onChipClick,
        onPinClick,
        onPointerDown: (e) => onPointerDown(e, idx),
        onPointerMove: (e) => onPointerMove(e, idx),
        onPointerUp: (e) => onPointerUp(e, idx),
        objectFit,
        quickGroupingState: quickGroupingMode && typeof getQuickGroupingState === "function" ? getQuickGroupingState(id) : null,
        onQuickGroupClick,
        onDoubleClick
      });
    }
  })}
  `;
}
