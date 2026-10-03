import { html, nothing } from "lit";
import { localize } from "../localize/localize.js";
import { renderChipRow } from "../chip-row.js";
import { isValidArtworkUrl } from "../yamp-utils.js";

/**
 * Render the main options menu (More info, search, source, transfer queue, group players, remote, lyrics, custom actions).
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 * @param {string[]} sourceList
 * @param {Array<{action: any, idx: number}>} menuOnlyActions
 * @param {boolean} showChipsInMenu
 */
export function renderMainMenu(sourceList, menuOnlyActions, showChipsInMenu) {
  const isGridMode = this._isGridMode;
  const renderMenuItem = (label, icon, onClick) => {
    if (isGridMode) {
      return html`
        <button class="entity-options-item menu-action-item" @click=${onClick}>
          <ha-icon class="menu-action-icon" icon=${icon}></ha-icon>
          <span class="menu-action-label">${label}</span>
        </button>
      `;
    }
    return html` <button class="entity-options-item" @click=${onClick}>${label}</button> `;
  };

  return html`
    <div class="entity-options-header">
      <button class="entity-options-item close-item" @click=${() => this._closeEntityOptions()}>
        ${localize("common.close")}
      </button>
      <div class="entity-options-divider"></div>
    </div>
    <div
      class="entity-options-menu ${showChipsInMenu ? "chips-in-menu" : ""} ${
        isGridMode ? "grid-menu" : "entity-options-scroll"
      }"
      style="${!isGridMode ? "display:flex; flex-direction:column;" : ""}"
    >
      ${renderMenuItem(localize("card.menu.more_info"), "mdi:information-outline", () => {
        const resolvedEntities = this._getResolvedEntitiesForCurrentChip();
        if (resolvedEntities.length === 1) {
          this._openMoreInfoForEntity(resolvedEntities[0]);
          this._showEntityOptions = false;
        } else {
          this._showResolvedEntities = true;
        }
        this.requestUpdate();
      })}
      ${renderMenuItem(localize("common.search"), "mdi:magnify", () => {
        this._showSearchSheetInOptions();
      })}
      ${
        Array.isArray(sourceList) && sourceList.length > 0
          ? renderMenuItem(localize("card.menu.source"), "mdi:import", () => this._openSourceList())
          : nothing
      }
      ${
        this._canShowTransferQueueOption()
          ? renderMenuItem(localize("card.menu.transfer_queue"), "mdi:swap-horizontal", () =>
              this._openTransferQueue()
            )
          : nothing
      }
      ${this._renderGroupingMenuOption(isGridMode)}
      ${
        this._hasRemoteControlSupport()
          ? renderMenuItem(localize("card.menu.remote_controls"), "mdi:remote", () =>
              this._openRemoteControl()
            )
          : nothing
      }
      ${
        !this._alwaysCollapsed
          ? renderMenuItem(
              localize(this._lyricsActive ? "card.menu.hide_lyrics" : "card.menu.show_lyrics"),
              "mdi:script-text-outline",
              () => {
                this._lyricsActive = !this._lyricsActive;
                if (!this._lyricsActive) {
                  this._lastLyricsTrackId = null;
                  this._lastLyricsEntityId = null;
                  this._lastLyricsArtist = null;
                  this._lastLyricsTitle = null;
                }
                this._showEntityOptions = false;
                this.requestUpdate();
              }
            )
          : nothing
      }
      ${
        menuOnlyActions.length
          ? html`
              ${menuOnlyActions.map(({ action, idx }) => {
                const label = this._getActionLabel(action);
                return html`
                  <button
                    class="entity-options-item menu-action-item"
                    @click=${() => this._onMenuActionClick(idx)}
                  >
                    ${
                      action.icon
                        ? html` <ha-icon class="menu-action-icon" .icon=${action.icon}></ha-icon> `
                        : nothing
                    }
                    ${label ? html`<span class="menu-action-label">${label}</span>` : nothing}
                  </button>
                `;
              })}
            `
          : nothing
      }
    </div>
  `;
}

/**
 * Render the Group Players menu button in the main options menu if multi-player grouping is supported.
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 * @param {boolean} [isGridMode=false]
 */
export function renderGroupingMenuOption(isGridMode = false) {
  const totalEntities = this.entityIds.length;
  if (totalEntities <= 1) return nothing;

  const groupableCount = this.entityIds.reduce((acc, id, idx) => {
    const actualGroupId = this._getGroupingEntityId(idx);
    const st = this.hass.states[actualGroupId];
    return acc + (this._isGroupCapable(st) ? 1 : 0);
  }, 0);

  const currGroupId = this._getGroupingEntityId(this._selectedIndex);
  const currGroupState = this.hass.states[currGroupId];

  // Check if the current entity is a follower (unavailable for acting as a new group master)
  const currentId = this.currentEntityId;
  const groupKey = this._getGroupKey(currentId);
  const isFollower = groupKey !== currentId;

  if (groupableCount > 1 && this._isGroupCapable(currGroupState) && !isFollower) {
    if (isGridMode) {
      return html`
        <button class="entity-options-item menu-action-item" @click=${() => this._openGrouping()}>
          <ha-icon class="menu-action-icon" icon="mdi:speaker-multiple"></ha-icon>
          <span class="menu-action-label">${localize("card.menu.group_players")}</span>
        </button>
      `;
    }
    return html`
      <button class="entity-options-item" @click=${() => this._openGrouping()}>
        ${localize("card.menu.group_players")}
      </button>
    `;
  }
  return nothing;
}

/**
 * Render the outer Entity Options overlay container, sub-sheet content switcher, and persistent bottom media controls.
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 * @param {object} props
 * @param {boolean} props.showChipsInMenu
 * @param {boolean} props.reserveChipSpaceInMenu
 * @param {boolean} props.effectivePinHeaders
 * @param {string[]} props.sourceList
 * @param {Array<{action: any, idx: number}>} props.menuOnlyActions
 * @param {boolean} props.showSearchHeaders
 * @param {string[]} props.sourceLetters
 * @param {Set<string>} props.availableSourceFirstLetters
 * @param {boolean} props.shouldShowPersistentControls
 * @param {any} props.persistentArt
 * @param {any} props.selectedArt
 */
export function renderOptionsOverlay(props) {
  const {
    showChipsInMenu,
    reserveChipSpaceInMenu,
    effectivePinHeaders,
    sourceList,
    menuOnlyActions,
    showSearchHeaders,
    sourceLetters,
    availableSourceFirstLetters,
    shouldShowPersistentControls,
    persistentArt,
    selectedArt,
  } = props;

  return html`
    <div
      class="entity-options-overlay entity-options-overlay-opening"
      @click=${(e) => this._closeEntityOptions(e)}
    >
      <div
        class="entity-options-container entity-options-container-opening"
        style="${this._showSearchInSheet ? "height:100%;" : ""}"
      >
        <div
          class="entity-options-sheet${
            showChipsInMenu || reserveChipSpaceInMenu ? " chips-mode" : ""
          }${this._showSearchInSheet ? " search-mode" : ""} entity-options-sheet-opening"
          @click=${(e) => e.stopPropagation()}
          data-pin-search-headers="${effectivePinHeaders}"
        >
          ${
            showChipsInMenu || reserveChipSpaceInMenu
              ? html`
                  <div
                    class="entity-options-chips-wrapper"
                    style="${
                      reserveChipSpaceInMenu && !showChipsInMenu
                        ? "visibility:hidden;pointer-events:none;"
                        : ""
                    }"
                    @click=${(e) => e.stopPropagation()}
                  >
                    <div class="chip-row entity-options-chips-strip">
                      ${renderChipRow(this._getChipRowProps())}
                    </div>
                  </div>
                `
              : nothing
          }
          ${
            !this._showGrouping &&
            !this._showSourceList &&
            !this._showSearchInSheet &&
            !this._showResolvedEntities &&
            !this._showTransferQueue &&
            !this._showRemoteControl
              ? this._renderMainMenu(sourceList, menuOnlyActions, showChipsInMenu)
              : this._showRemoteControl
                ? this._renderRemoteControlSheet()
                : this._showGrouping
                  ? this._renderGroupingSheet()
                  : this._showTransferQueue
                    ? this._renderTransferQueueSheet()
                    : this._showResolvedEntities
                      ? this._renderResolvedEntitiesSheet()
                      : this._showSearchInSheet
                        ? this._renderSearchInOptions(showSearchHeaders, effectivePinHeaders)
                        : this._renderSourceListSheet(
                            sourceList,
                            sourceLetters,
                            availableSourceFirstLetters
                          )
          }
        </div>
      </div>
      <!-- Persistent Media Controls Section - Outside Scrollable Area -->
      ${
        shouldShowPersistentControls
          ? html`
              <div class="persistent-media-controls" @click=${(e) => e.stopPropagation()}>
                <div class="persistent-controls-artwork">
                  ${(() => {
                    const artwork = persistentArt?.url ? persistentArt : selectedArt;
                    return artwork?.url && isValidArtworkUrl(artwork.url)
                      ? html`
                          <img
                            src="${artwork.url}"
                            alt="${localize("common.album_art")}"
                            class="persistent-artwork"
                            onerror="this.style.display='none'"
                          />
                        `
                      : html`
                          <div class="persistent-artwork-placeholder">
                            <ha-icon icon="mdi:music"></ha-icon>
                          </div>
                        `;
                  })()}
                </div>
                <div class="persistent-controls-buttons" style="position: relative;">
                  <button
                    class="persistent-control-btn"
                    @click=${() => this._onControlClick("prev")}
                    title="${localize("card.media_controls.previous")}"
                  >
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button
                    class="persistent-control-btn"
                    @click=${() => this._onControlClick("play_pause")}
                    title="${localize("card.media_controls.play_pause")}"
                  >
                    <ha-icon
                      icon=${
                        this._isEntityPlaying(this.currentPlaybackStateObj)
                          ? "mdi:pause"
                          : "mdi:play"
                      }
                    ></ha-icon>
                  </button>
                  <button
                    class="persistent-control-btn"
                    @click=${() => this._onControlClick("next")}
                    title="${localize("card.media_controls.next")}"
                  >
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </button>
                  ${
                    !this.config.hide_reorder_progress &&
                    !this.config.hide_menu_player &&
                    this._queueOpsTotal > 0
                      ? html`
                          <div
                            class="queue-ops-progress"
                            style="position: absolute !important; bottom: -20px !important; left: 50% !important; transform: translate(-50%, 0) !important; z-index: 1000 !important; width: max-content !important; pointer-events: none !important; color: var(--search-text-secondary) !important;"
                          >
                            Re-ordering ${this._queueOpsCompleted} / ${this._queueOpsTotal}
                          </div>
                        `
                      : nothing
                  }
                  ${
                    this._lyricsActive && !this._isIdle && this._fetchingLyrics
                      ? html`
                          <div
                            class="queue-ops-progress"
                            style="position: absolute !important; bottom: -20px !important; left: 50% !important; transform: translate(-50%, 0) !important; z-index: 1000 !important; width: max-content !important; pointer-events: none !important; color: var(--search-text-secondary) !important;"
                          >
                            ${localize("lyrics.finding")}
                          </div>
                        `
                      : nothing
                  }
                </div>
                ${(() => {
                  const idx = this._selectedIndex;
                  const volumeEntity = this._getVolumeEntity(idx);
                  if (!volumeEntity) return nothing;

                  const isRemote = volumeEntity.startsWith && volumeEntity.startsWith("remote.");
                  const volumeState = this.currentVolumeStateObj;
                  const volumeLevel = Number(volumeState?.attributes?.volume_level ?? 0);
                  const percentLabel = !isRemote
                    ? `${Math.round((volumeLevel || 0) * 100)}%`
                    : null;

                  if (this._getEffectiveVolumeMode() === "hidden") return nothing;

                  return html`
                    <div class="persistent-volume-stepper">
                      <button
                        class="stepper-btn"
                        @click=${() => this._onVolumeStep(-1)}
                        title="${localize("common.vol_down")}"
                      >
                        –
                      </button>
                      ${
                        percentLabel
                          ? html`<span class="stepper-value">${percentLabel}</span>`
                          : nothing
                      }
                      <button
                        class="stepper-btn"
                        @click=${() => this._onVolumeStep(1)}
                        title="${localize("common.vol_up")}"
                      >
                        +
                      </button>
                    </div>
                  `;
                })()}
              </div>
            `
          : nothing
      }
    </div>
  `;
}
