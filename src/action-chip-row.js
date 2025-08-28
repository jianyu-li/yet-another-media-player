// import { LitElement, html, css, nothing } from "lit";
import { html, nothing } from "lit";

export function renderActionChipRow({ actions, onActionChipClick }) {
  if (!actions?.length) return nothing;
  return html`
    <div class="action-chip-row">
      ${actions.map(
        (a, idx) => html`
          <button class="action-chip" @click=${() => onActionChipClick(idx)}>
            ${a.icon
              ? html`<ha-icon .icon=${a.icon} style="font-size: 22px; margin-right: ${a.name ? '8px' : '0'};"></ha-icon>`
              : nothing}
            ${a.name || ""}
          </button>
        `
      )}
    </div>
  `;
}