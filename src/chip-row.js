// chip-row.js
import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import { LitElement, html, css, nothing } from "lit";

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
  onChipClick,
  onIconClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) {
  return html`
    <button class="chip"
            ?selected=${selected}
            ?playing=${playing}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;">
      <span class="chip-icon">
        ${art
          ? html`<img class="chip-mini-art" src="${art}" />`
          : html`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${name}
      </span>
      ${pinned
        ? html`
            <span class="chip-pin-inside" @click=${e => { e.stopPropagation(); onPinClick(idx, e); }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `
        : html`<span class="chip-pin-spacer"></span>`
      }
    </button>
  `;
}

// Helper to render a group chip (simplified)
export function renderGroupChip({
  idx,
  selected,
  groupName,
  art,
  icon,
  pinned,
  holdToPin,
  onChipClick,
  onIconClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) {
  return html`
    <button class="chip group"
            ?selected=${selected}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}>
      <span class="chip-icon">
        ${
          art
            ? html`<img class="chip-mini-art" src="${art}" />`
            : html`<ha-icon
                      .icon=${icon}
                      style="font-size:28px;"
                      @click=${e => {
                        e.stopPropagation();
                        if (onIconClick) {
                          onIconClick(idx, e);
                        } else {
                          onChipClick(idx);
                        }
                      }}
                    ></ha-icon>`
        }
      </span>
      <span class="chip-label">${groupName}</span>
      ${pinned
        ? html`
            <span class="chip-pin-inside" @click=${e => { e.stopPropagation(); onPinClick(idx, e); }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `
        : html`<span class="chip-pin-spacer"></span>`
      }
    </button>
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
  isIdle,
  hass,
  onChipClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp
}) {
  if (!groupedSortedEntityIds || !groupedSortedEntityIds.length) return nothing;

  return html`
    ${groupedSortedEntityIds.map((group) => {
      // If it's a group (more than one entity)
      if (group.length > 1) {
        const id = getActualGroupMaster(group);
        const idx = entityIds.indexOf(id);
        const state = hass?.states?.[id];
        // Art is null for group chip; determine if playing for chip highlight
        const isGroupPlaying = selectedEntityId === id ? !isIdle : state?.state === "playing";
        return renderGroupChip({
          idx,
          selected: selectedEntityId === id,
          groupName: getChipName(id),
          art: null,
          icon: "mdi:group", // Or use a more specific group icon if needed
          pinned: pinnedIndex === idx,
          holdToPin,
          onChipClick,
          onPinClick,
          onPointerDown: (e) => onPointerDown(e, idx),
          onPointerMove: (e) => onPointerMove(e, idx),
          onPointerUp: (e) => onPointerUp(e, idx),
        });
      } else {
        // Single chip
        const id = group[0];
        const idx = entityIds.indexOf(id);
        const state = hass?.states?.[id];
        const isChipPlaying = selectedEntityId === id ? !isIdle : state?.state === "playing";
        const art =
          selectedEntityId === id
            ? (!isIdle && (state?.attributes?.entity_picture || state?.attributes?.album_art))
            : (state?.state === "playing" && (state?.attributes?.entity_picture || state?.attributes?.album_art));
        const icon = state?.attributes?.icon || "mdi:cast";
        return renderChip({
          idx,
          selected: selectedEntityId === id,
          playing: isChipPlaying,
          name: getChipName(id),
          art,
          icon,
          pinned: pinnedIndex === idx,
          holdToPin,
          onChipClick,
          onPinClick,
          onPointerDown: (e) => onPointerDown(e, idx),
          onPointerMove: (e) => onPointerMove(e, idx),
          onPointerUp: (e) => onPointerUp(e, idx),
        });
      }
    })}
  `;
}