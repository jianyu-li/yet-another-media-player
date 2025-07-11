import { LitElement, html, css, nothing } from "lit";

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
  onPinClick,
  onPointerDown,
  onPointerUp,
}) {
  return html`
    <button class="chip"
            ?selected=${selected}
            ?playing=${playing}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
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
  onPinClick,
  onPointerDown,
  onPointerUp,
}) {
  return html`
    <button class="chip group"
            ?selected=${selected}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}>
      <span class="chip-icon">
        ${art
          ? html`<img class="chip-mini-art" src="${art}" />`
          : html`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
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
export function createHoldToPinHandler({ onPin, onHoldEnd, holdTime = 600 }) {
  let holdTimer = null;
  return {
    pointerDown: (e, idx) => {
      holdTimer = setTimeout(() => {
        onPin(idx, e);
        onHoldEnd && onHoldEnd(idx);
      }, holdTime);
    },
    pointerUp: (e, idx) => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    }
  };
}