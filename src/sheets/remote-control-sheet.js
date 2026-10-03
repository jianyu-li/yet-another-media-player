import { html, nothing } from "lit";
import { localize } from "../localize/localize.js";

/**
 * Render the Remote Control sheet with D-Pad and navigation buttons.
 * @this {import("../yet-another-media-player.js").YetAnotherMediaPlayerCard}
 */
export function renderRemoteControlSheet() {
  const hiddenButtons = this._getHiddenRemoteButtons();

  return html`
    <style>
      .remote-control-container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding: 12px 16px 24px 16px !important;
        gap: 16px !important;
        box-sizing: border-box !important;
        width: 100% !important;
        flex: 1 !important;
        margin: 0 auto !important;
      }
      .remote-dpad-wrapper {
        position: relative !important;
        width: 200px !important;
        height: 200px !important;
        flex-shrink: 0 !important;
        margin: 4px auto 12px auto !important;
      }
      .remote-dpad-cross {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        border-radius: 50% !important;
        background: var(--yamp-overlay-divider, rgba(255, 255, 255, 0.08)) !important;
        border: 1px solid var(--yamp-overlay-divider, rgba(255, 255, 255, 0.18)) !important;
        backdrop-filter: blur(14px) !important;
        -webkit-backdrop-filter: blur(14px) !important;
        box-shadow:
          inset 0 2px 6px rgba(0, 0, 0, 0.3),
          0 6px 18px rgba(0, 0, 0, 0.25) !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      .dpad-btn {
        appearance: none !important;
        -webkit-appearance: none !important;
        position: absolute !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: transparent !important;
        border: none !important;
        color: var(--yamp-overlay-text, var(--primary-text-color, #fff)) !important;
        cursor: pointer !important;
        transition:
          background 0.15s ease,
          transform 0.1s ease,
          color 0.15s ease !important;
        padding: 0 !important;
        margin: 0 !important;
        outline: none !important;
        box-sizing: border-box !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      .dpad-btn:not(.dpad-center) {
        -webkit-mask-image: radial-gradient(
          closest-side circle at 50% 50%,
          transparent 47%,
          black 49%
        ) !important;
        mask-image: radial-gradient(
          closest-side circle at 50% 50%,
          transparent 47%,
          black 49%
        ) !important;
      }
      .dpad-btn:hover {
        background: rgba(255, 255, 255, 0.16) !important;
        color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
      }
      .dpad-btn:active {
        background: rgba(255, 255, 255, 0.28) !important;
        transform: scale(0.92) !important;
      }
      .dpad-btn ha-icon {
        --mdc-icon-size: 28px !important;
        pointer-events: none !important;
      }
      .dpad-btn.dpad-up {
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        clip-path: polygon(0 0, 100% 0, 50% 50%) !important;
        align-items: flex-start !important;
        padding-top: 12% !important;
      }
      .dpad-btn.dpad-down {
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        clip-path: polygon(100% 100%, 0 100%, 50% 50%) !important;
        align-items: flex-end !important;
        padding-bottom: 12% !important;
      }
      .dpad-btn.dpad-left {
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        clip-path: polygon(0 100%, 0 0, 50% 50%) !important;
        justify-content: flex-start !important;
        padding-left: 12% !important;
      }
      .dpad-btn.dpad-right {
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        clip-path: polygon(100% 0, 100% 100%, 50% 50%) !important;
        justify-content: flex-end !important;
        padding-right: 12% !important;
      }
      .dpad-btn.dpad-center {
        top: 28% !important;
        left: 28% !important;
        width: 44% !important;
        height: 44% !important;
        border-radius: 50% !important;
        background: rgba(255, 255, 255, 0.12) !important;
        border: 1px solid var(--yamp-overlay-divider, rgba(255, 255, 255, 0.25)) !important;
        font-weight: 600 !important;
        font-size: 0.88rem !important;
        letter-spacing: 0.03em !important;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3) !important;
        z-index: 3 !important;
      }
      .dpad-btn.dpad-center:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
      }
      .remote-control-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-around !important;
        gap: 12px !important;
        width: 100% !important;
        max-width: 320px !important;
        margin: 0 auto !important;
      }
      .remote-control-btn {
        appearance: none !important;
        -webkit-appearance: none !important;
        display: flex !important;
        flex: 1 !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        height: 48px !important;
        max-width: 72px !important;
        border-radius: 14px !important;
        background: var(--yamp-overlay-divider, rgba(255, 255, 255, 0.08)) !important;
        border: 1px solid var(--yamp-overlay-divider, rgba(255, 255, 255, 0.15)) !important;
        color: var(--yamp-overlay-text, var(--primary-text-color, #fff)) !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        outline: none !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      .remote-control-btn:hover {
        background: rgba(255, 255, 255, 0.18) !important;
        border-color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
        color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
        transform: translateY(-1px) !important;
      }
      .remote-control-btn:active {
        transform: scale(0.93) !important;
      }
      .remote-control-btn ha-icon {
        --mdc-icon-size: 22px !important;
        pointer-events: none !important;
      }
    </style>
    ${
      this._cardType !== "remote_control"
        ? html`
            <div class="entity-options-header">
              <button
                class="entity-options-item close-item"
                @click=${() => this._closeRemoteControl()}
              >
                ${localize("common.back")}
              </button>
            </div>
            <div class="entity-options-divider"></div>
          `
        : nothing
    }
    <div class="entity-options-scroll remote-control-container">
      <!-- D-Pad Directional Pad -->
      <div class="remote-dpad-wrapper">
        <div class="remote-dpad-cross">
          <button
            class="dpad-btn dpad-up"
            @click=${() => this._sendRemoteCommand("up")}
            title="${localize("card.remote.up")}"
          >
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button
            class="dpad-btn dpad-down"
            @click=${() => this._sendRemoteCommand("down")}
            title="${localize("card.remote.down")}"
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            class="dpad-btn dpad-left"
            @click=${() => this._sendRemoteCommand("left")}
            title="${localize("card.remote.left")}"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button
            class="dpad-btn dpad-right"
            @click=${() => this._sendRemoteCommand("right")}
            title="${localize("card.remote.right")}"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <button
            class="dpad-btn dpad-center"
            @click=${() => this._sendRemoteCommand("select")}
            title="${localize("card.remote.select")}"
          >
            ${localize("card.remote.select")}
          </button>
        </div>
      </div>

      <!-- Navigation Row -->
      <div class="remote-control-row">
        ${
          !hiddenButtons.includes("back")
            ? html`
                <button
                  class="remote-control-btn"
                  @click=${() => this._sendRemoteCommand("back")}
                  title="${localize("card.remote.back")}"
                >
                  <ha-icon icon="mdi:arrow-left"></ha-icon>
                </button>
              `
            : nothing
        }
        ${
          !hiddenButtons.includes("menu")
            ? html`
                <button
                  class="remote-control-btn"
                  @click=${() => this._sendRemoteCommand("menu")}
                  title="${localize("card.remote.menu")}"
                >
                  <ha-icon icon="mdi:menu"></ha-icon>
                </button>
              `
            : nothing
        }
        ${
          !hiddenButtons.includes("home")
            ? html`
                <button
                  class="remote-control-btn"
                  @click=${() => this._sendRemoteCommand("home")}
                  title="${localize("card.remote.home")}"
                >
                  <ha-icon icon="mdi:home"></ha-icon>
                </button>
              `
            : nothing
        }
        ${
          !hiddenButtons.includes("power")
            ? html`
                <button
                  class="remote-control-btn"
                  @click=${() => this._onControlClick("power")}
                  title="${localize("card.remote.power")}"
                >
                  <ha-icon icon="mdi:power"></ha-icon>
                </button>
              `
            : nothing
        }
      </div>
    </div>
  `;
}
