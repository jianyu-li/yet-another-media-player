import { html, nothing } from "lit";
import { localize } from "../localize/localize.js";
import { getEntityName } from "../yamp-utils.js";

/**
 * Render the Speaker Grouping / Multi-room sheet.
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 */
export function renderGroupingSheet() {
  const isGridMode = this._isGridMode;
  const masterId = this._getGroupingMasterId();
  const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
  const masterGroupId = masterIdx >= 0 ? this._getGroupingEntityId(masterIdx) : masterId;
  const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
  const groupedAny =
    Array.isArray(masterState?.attributes?.group_members) &&
    masterState.attributes.group_members.length > 1;

  const groupPlayerIds = [];
  const myGroupKey = this._getGroupKey(this.currentEntityId);

  this.entityIds.forEach((id) => {
    const state = this._getGroupPlayerState(
      id,
      this.currentEntityId,
      null,
      masterState,
      myGroupKey
    );
    if (state.isGroupable) {
      groupPlayerIds.push({
        id: id,
        groupId: state.entityToCheck,
        isBusy: state.isBusy,
        busyLabel: state.busyLabel,
      });
    }
  });

  const activeId = this.currentEntityId;
  const activeIdx = this.entityIds.indexOf(activeId);
  const activeGroupId = activeIdx >= 0 ? this._getGroupingEntityId(activeIdx) : null;
  const activeState = activeGroupId ? this.hass.states[activeGroupId] : null;
  const activeIsGroupCapable = activeState ? this._isGroupCapable(activeState) : false;

  // Check if active entity is itself a follower (isBusy)
  const activeGroupKey = this._getGroupKey(activeId);
  const activeIsBusy = activeGroupKey !== activeId;

  if (!groupedAny && (!activeIsGroupCapable || activeIsBusy)) {
    return html`
      <div class="entity-options-header">
        ${
          this._cardType !== "group_players" && this._cardType !== "remote_control"
            ? html`
                <button
                  class="entity-options-item close-item"
                  @click=${() => {
                    if (this._quickMenuInvoke) {
                      this._dismissWithAnimation();
                    } else {
                      this._closeGrouping();
                    }
                  }}
                >
                  ${localize("common.back")}
                </button>
              `
            : nothing
        }
        <div class="entity-options-divider"></div>
      </div>
      ${nothing}
      <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
        ${activeIsBusy ? localize("card.grouping.unavailable") : localize("card.grouping.no_players")}
      </div>
    `;
  }

  const hasMaTransferService = Boolean(this.hass?.services?.music_assistant?.transfer_queue);
  const currentIdx = this._selectedIndex;
  const sourceMaId = this._getActualResolvedMaEntityForState?.(currentIdx);
  const sourceEntityId = this.entityIds?.[currentIdx];
  const hasQueueToTransfer = Boolean(this._hasTransferQueueForCurrent);

  const sortedGroupIds = [...groupPlayerIds].sort((a, b) => {
    if (groupedAny) {
      if (a.id === masterId) return -1;
      if (b.id === masterId) return 1;
    } else {
      if (a.id === activeId) return -1;
      if (b.id === activeId) return 1;
    }
    if (a.isBusy === b.isBusy) return 0;
    return a.isBusy ? 1 : -1;
  });

  return html`
    <div class="entity-options-header grouping-header group-list-header">
      ${
        this._cardType !== "group_players" && this._cardType !== "remote_control"
          ? html`
              <button
                class="entity-options-item close-item"
                @click=${() => {
                  if (this._quickMenuInvoke) {
                    this._dismissWithAnimation();
                  } else {
                    this._closeGrouping();
                  }
                }}
              >
                ${localize("common.back")}
              </button>
            `
          : nothing
      }
      <div class="entity-options-divider"></div>
    </div>
    ${nothing}
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
      ${
        groupedAny
          ? html`
              <button
                class="entity-options-item"
                @click=${() => this._syncGroupVolume()}
                style="flex:0 0 auto; min-width:140px; text-align:center;"
              >
                ${localize("card.grouping.sync_volume")}
              </button>
            `
          : nothing
      }
      <button
        class="entity-options-item"
        @click=${() => (groupedAny ? this._ungroupAll() : this._groupAll())}
        style="flex:0 0 auto; min-width:140px; text-align:center; margin-left:auto;"
      >
        ${groupedAny ? localize("card.grouping.ungroup_all") : localize("card.grouping.group_all")}
      </button>
    </div>
    ${
      this._transferQueueStatus
        ? html`
            <div
              style="
                margin-bottom: 12px;
                padding: 10px 12px;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                background: ${
                this._transferQueueStatus.type === "error"
                  ? "rgba(244, 67, 54, 0.18)"
                  : "rgba(76, 175, 80, 0.18)"
              };
                color: ${this._transferQueueStatus.type === "error" ? "#ff8a80" : "#8bc34a"};
              "
            >
              ${this._transferQueueStatus.message}
            </div>
          `
        : nothing
    }
    <div class="group-list-scroll ${isGridMode ? "grid-menu" : ""}">
      ${
        sortedGroupIds.length === 0
          ? html`
              <div
                class="entity-options-item"
                style="padding:12px; opacity:0.75; text-align:center;"
              >
                ${localize("card.grouping.no_players")}
              </div>
            `
          : html`
              <div class="${isGridMode ? "grid-menu-items" : ""}">
                ${sortedGroupIds.map((item) => {
                  const id = item.id;
                  const actualGroupId = item.groupId;
                  const filteredMembers = Array.isArray(masterState?.attributes?.group_members)
                    ? masterState.attributes.group_members
                    : [];
                  const grouped = filteredMembers.includes(actualGroupId);
                  const name = this.getChipName(id);
                  const isBusy = item.isBusy;
                  const busyLabel = item.busyLabel;

                  const entityIdx = this.entityIds.indexOf(id);
                  const volumeEntity = this._getVolumeEntity(entityIdx);
                  const displayEntity = volumeEntity || actualGroupId;
                  const displayVolumeState = this.hass.states[displayEntity];

                  const isRemoteVol =
                    displayEntity?.startsWith && displayEntity.startsWith("remote.");
                  const volVal = Number(displayVolumeState?.attributes?.volume_level || 0);
                  const isPrimaryRow = id === masterId;
                  const showToggleButton = !isPrimaryRow;
                  const isCurrent = id === activeId;
                  const masterName = masterId
                    ? this.getChipName(masterId)
                    : localize("card.grouping.master");

                  // Check if player belongs to any multi-speaker group (its own or the active master's)
                  const playerGroupKey = this._getGroupKey(id);
                  const playerGroupingState = this.hass?.states?.[actualGroupId];
                  const playerMembers = Array.isArray(
                    playerGroupingState?.attributes?.group_members
                  )
                    ? playerGroupingState.attributes.group_members
                    : [];
                  const isMultiSpeakerGroup =
                    playerMembers.length > 1 || (Boolean(playerGroupKey) && playerGroupKey !== id);

                  // Group master for this player's group
                  const targetGroupMasterId = isMultiSpeakerGroup ? playerGroupKey || id : id;
                  const targetGroupMasterIdx = this.entityIds.indexOf(targetGroupMasterId);
                  const targetGroupMasterName = this.getChipName(targetGroupMasterId);

                  const targetIdx = isMultiSpeakerGroup
                    ? targetGroupMasterIdx >= 0
                      ? targetGroupMasterIdx
                      : entityIdx
                    : entityIdx;
                  const targetEntityId = isMultiSpeakerGroup ? targetGroupMasterId : id;
                  const targetMaId = isMultiSpeakerGroup
                    ? this._getActualResolvedMaEntityForState?.(targetIdx) ||
                      this._getGroupingEntityIdByEntityId?.(targetGroupMasterId) ||
                      targetGroupMasterId
                    : this._getActualResolvedMaEntityForState?.(entityIdx) || actualGroupId;
                  const targetName = isMultiSpeakerGroup
                    ? `${targetGroupMasterName} (${localize("card.grouping.title") || "Group"})`
                    : name;

                  const mainState = this.hass?.states?.[id];
                  const groupEntityState = this.hass?.states?.[actualGroupId];
                  const volumeState = volumeEntity ? this.hass?.states?.[volumeEntity] : null;
                  const targetEntityState = this.hass?.states?.[targetEntityId];
                  const targetMaState = this.hass?.states?.[targetMaId];
                  const targetState = targetEntityState || targetMaState;

                  const isDeviceUnavailable =
                    mainState?.state === "unavailable" ||
                    groupEntityState?.state === "unavailable" ||
                    displayVolumeState?.state === "unavailable" ||
                    volumeState?.state === "unavailable" ||
                    targetEntityState?.state === "unavailable" ||
                    targetMaState?.state === "unavailable";

                  let stateLabel;
                  if (isDeviceUnavailable) {
                    stateLabel =
                      busyLabel || localize("card.grouping.unavailable") || "Unavailable";
                  } else if (isMultiSpeakerGroup) {
                    stateLabel =
                      targetGroupMasterId === id
                        ? localize("card.grouping.master")
                        : localize("card.grouping.joined");
                  } else if (isCurrent) {
                    stateLabel = localize("card.grouping.current");
                  } else {
                    stateLabel = localize("card.grouping.available");
                  }

                  // Self check: is this target the currently active playback entity / group?
                  const isSelf =
                    targetMaId === sourceMaId ||
                    targetEntityId === sourceEntityId ||
                    (isMultiSpeakerGroup &&
                      (groupedAny ||
                        (Boolean(activeGroupKey) && activeGroupKey !== this.currentEntityId)) &&
                      targetGroupMasterId === activeGroupKey);

                  const isTransferPending = this._transferQueuePendingTarget === targetMaId;
                  const isTransferDisabled =
                    !hasQueueToTransfer || isSelf || isTransferPending || isDeviceUnavailable;

                  let transferTooltip;
                  if (isDeviceUnavailable) {
                    transferTooltip =
                      localize("card.grouping.unavailable") || "Player is unavailable";
                  } else if (!hasQueueToTransfer) {
                    transferTooltip =
                      localize("card.grouping.transfer_no_queue") || "No active queue to transfer";
                  } else if (isSelf) {
                    transferTooltip =
                      localize("card.grouping.transfer_current_player") || "Currently playing here";
                  } else if (isMultiSpeakerGroup) {
                    transferTooltip = (
                      localize("card.grouping.transfer_to_group") ||
                      "Transfer queue to {master} group"
                    ).replace("{master}", targetGroupMasterName);
                  } else {
                    transferTooltip = (
                      localize("card.grouping.transfer_to_player") || "Transfer queue to {player}"
                    ).replace("{player}", name);
                  }

                  const targetPayload = {
                    index: targetIdx,
                    entityId: targetEntityId,
                    maEntityId: targetMaId,
                    name: targetName,
                    subtitle: targetMaId !== targetEntityId ? targetMaId : targetEntityId,
                    state: (isMultiSpeakerGroup ? targetState : displayVolumeState)?.state,
                    icon: isMultiSpeakerGroup ? "mdi:speaker-multiple" : "mdi:music",
                  };

                  if (isGridMode) {
                    const isDisabled = isBusy || isDeviceUnavailable || !showToggleButton;
                    const toggleTooltip =
                      isDeviceUnavailable || isBusy
                        ? localize("card.grouping.unavailable")
                        : grouped
                          ? localize("card.grouping.unjoin_from").replace("{master}", masterName)
                          : localize("card.grouping.join_with").replace("{master}", masterName);

                    return html`
                      <div
                        class="entity-options-item menu-action-item ${
                          !showToggleButton || grouped ? "grid-active" : ""
                        }"
                        style="position: relative;"
                      >
                        ${
                          hasMaTransferService
                            ? html`
                                <span
                                  class="grid-menu-transfer-btn"
                                  role="button"
                                  tabindex="0"
                                  ?disabled=${isTransferDisabled}
                                  @click=${(e) => {
                                    e.stopPropagation();
                                    if (!isTransferDisabled) {
                                      this._transferQueueTo(targetPayload);
                                    }
                                  }}
                                  title=${transferTooltip}
                                >
                                  <ha-icon icon="mdi:swap-horizontal"></ha-icon>
                                </span>
                              `
                            : nothing
                        }
                        <div
                          class="grid-menu-toggle-action"
                          role="button"
                          tabindex="0"
                          ?disabled=${isDisabled}
                          @click=${() => !isDisabled && this._toggleGroup(id)}
                          title=${
                            isBusy
                              ? localize("card.grouping.unavailable")
                              : !showToggleButton
                                ? stateLabel
                                : toggleTooltip
                          }
                          style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;height:100%;cursor:${
                            isDisabled ? "default" : "pointer"
                          };${isDisabled ? "opacity:0.35;" : ""}"
                        >
                          <ha-icon
                            class="menu-action-icon"
                            icon=${
                              isPrimaryRow
                                ? "mdi:star"
                                : grouped
                                  ? "mdi:speaker-multiple"
                                  : "mdi:speaker"
                            }
                          ></ha-icon>
                          <span class="menu-action-label">${name}</span>
                        </div>
                      </div>
                    `;
                  }

                  return html`
                    <div
                      class="entity-options-item group-player-row"
                      style="
                      display:flex;
                      align-items:center;
                      gap:6px;
                      padding: 12px 8px 4px 8px;
                      margin-bottom: 1px;
                    "
                    >
                      <div style="flex:0.7; min-width:84px;">
                        <div style="text-align:left;">${name}</div>
                        <div style="font-size:0.8em; opacity:0.7; text-align:left;">
                          ${stateLabel}
                        </div>
                      </div>
                      <div
                        style="flex:1.8;display:flex;align-items:center;gap:4px;margin:0 4px; min-width:140px;"
                      >
                        ${
                          isRemoteVol
                            ? html`
                                <div
                                  class="vol-stepper"
                                  style="display:flex;align-items:center;gap:4px;"
                                >
                                  <button
                                    @click=${() => this._onGroupVolumeStep(displayEntity, -1)}
                                    title="${localize("common.vol_down")}"
                                    style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;"
                                  >
                                    <ha-icon icon="mdi:minus"></ha-icon>
                                  </button>
                                  <button
                                    @click=${() => this._onGroupVolumeStep(displayEntity, 1)}
                                    title="${localize("common.vol_up")}"
                                    style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;"
                                  >
                                    <ha-icon icon="mdi:plus"></ha-icon>
                                  </button>
                                </div>
                              `
                            : html`
                                <div
                                  class="volume-slider-container grouping-vol-slider-container"
                                  style="flex:1; padding: 0 4px; position: relative; display: flex; align-items: center;"
                                >
                                  <div
                                    class="volume-percentage-indicator ${
                                      this._volumeDraggingEntity === id ? "visible" : ""
                                    }"
                                    style="left: calc(13px + ${this._dragVolume} * (100% - 26px))"
                                  >
                                    ${Math.round(this._dragVolume * 100)}%
                                  </div>
                                  <input
                                    class="vol-slider"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    .value=${volVal}
                                    @mousedown=${(e) => this._onVolumeDragStart(e, id)}
                                    @touchstart=${(e) => this._onVolumeDragStart(e, id)}
                                    @input=${(e) => this._onVolumeInput(e)}
                                    @mouseup=${(e) => this._onVolumeDragEnd(e)}
                                    @touchend=${(e) => this._onVolumeDragEnd(e)}
                                    @change=${(e) => this._onGroupVolumeChange(id, displayEntity, e)}
                                    title="${localize("common.volume")}"
                                    style="width:100%;max-width:260px;"
                                  />
                                </div>
                              `
                        }
                        <span style="min-width:36px;display:inline-block;text-align:right;"
                          >${
                            typeof volVal === "number" ? Math.round(volVal * 100) + "%" : "--"
                          }</span
                        >
                      </div>
                      ${
                        hasMaTransferService
                          ? html`
                              <button
                                class="group-transfer-btn"
                                ?disabled=${isTransferDisabled}
                                @click=${() =>
                                  !isTransferDisabled && this._transferQueueTo(targetPayload)}
                                title=${transferTooltip}
                              >
                                <ha-icon icon="mdi:swap-horizontal"></ha-icon>
                              </button>
                            `
                          : nothing
                      }
                      ${
                        showToggleButton
                          ? html`
                              <button
                                class="group-toggle-btn"
                                ?disabled=${isBusy || isDeviceUnavailable}
                                @click=${() =>
                                  !isBusy && !isDeviceUnavailable && this._toggleGroup(id)}
                                title=${
                                  isBusy || isDeviceUnavailable
                                    ? localize("card.grouping.unavailable")
                                    : grouped
                                      ? localize("card.grouping.unjoin_from").replace(
                                          "{master}",
                                          masterName
                                        )
                                      : localize("card.grouping.join_with").replace(
                                          "{master}",
                                          masterName
                                        )
                                }
                                style="margin-left:2px; ${
                                  isBusy || isDeviceUnavailable
                                    ? "cursor: not-allowed; opacity: 0.35;"
                                    : ""
                                }"
                              >
                                <ha-icon
                                  icon=${
                                    grouped ? "mdi:minus-circle-outline" : "mdi:plus-circle-outline"
                                  }
                                ></ha-icon>
                              </button>
                            `
                          : html`<span
                              style="margin-left:2px;margin-right:10px;width:32px;display:inline-block;"
                            ></span>`
                      }
                    </div>
                  `;
                })}
              </div>
            `
      }
    </div>
  `;
}

/**
 * Render the Transfer Queue overlay sheet.
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 */
export function renderTransferQueueSheet() {
  const isGridMode = this._isGridMode;
  const targets = this._getTransferQueueTargets();
  return html`
    <div class="entity-options-header">
      <button
        class="entity-options-item close-item"
        @click=${() => {
          if (this._quickMenuInvoke) {
            this._dismissWithAnimation();
          } else {
            this._closeTransferQueue();
          }
        }}
      >
        ${localize("common.back")}
      </button>
      <div class="entity-options-divider"></div>
      ${
        !isGridMode
          ? html`<div class="entity-options-title" style="margin-bottom:12px;">
              ${localize("card.menu.transfer_to")}
            </div>`
          : nothing
      }
    </div>
    <div class="entity-options-scroll ${isGridMode ? "grid-menu" : ""}">
      ${
        !targets.length
          ? html`
              <div style="padding: 12px; opacity: 0.75;">${localize("card.menu.no_players")}</div>
            `
          : html`
              <div class="${isGridMode ? "grid-menu-items" : "transfer-queue-list"}">
                ${targets.map((target) => {
                  if (isGridMode) {
                    return html`
                      <button
                        class="entity-options-item menu-action-item"
                        ?disabled=${this._transferQueuePendingTarget === target.maEntityId}
                        @click=${() => this._transferQueueTo(target)}
                      >
                        <ha-icon class="menu-action-icon" .icon=${target.icon}></ha-icon>
                        <span class="menu-action-label">${target.name}</span>
                      </button>
                    `;
                  }
                  return html`
                    <button
                      class="entity-options-item transfer-queue-item"
                      ?disabled=${this._transferQueuePendingTarget === target.maEntityId}
                      @click=${() => this._transferQueueTo(target)}
                    >
                      <ha-icon .icon=${target.icon} style="margin-right:4px;"></ha-icon>
                      <div style="display:flex;flex-direction:column;align-items:flex-start;">
                        <div>${target.name}</div>
                        <div style="font-size:0.82em;opacity:0.7;">${target.subtitle}</div>
                      </div>
                      ${
                        target.state
                          ? html`<div
                              style="margin-left:auto;font-size:0.82em;opacity:0.7;text-transform:capitalize;"
                            >
                              ${target.state}
                            </div>`
                          : nothing
                      }
                    </button>
                  `;
                })}
              </div>
            `
      }
      ${
        this._transferQueueStatus
          ? html`
              <div
                style="
            margin-top: 14px;
            padding: 10px 12px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            background: ${
                  this._transferQueueStatus.type === "error"
                    ? "rgba(244, 67, 54, 0.18)"
                    : "rgba(76, 175, 80, 0.18)"
                };
            color: ${this._transferQueueStatus.type === "error" ? "#ff8a80" : "#8bc34a"};
          "
              >
                ${this._transferQueueStatus.message}
              </div>
            `
          : nothing
      }
    </div>
  `;
}

/**
 * Render the Resolved Entities overlay sheet (debug / multi-entity viewer).
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 */
export function renderResolvedEntitiesSheet() {
  const isGridMode = this._isGridMode;

  return html`
    <div class="entity-options-header">
      <button
        class="entity-options-item close-item"
        @click=${() => {
          this._showResolvedEntities = false;
          this.requestUpdate();
        }}
      >
        ${localize("common.back")}
      </button>
      <div class="entity-options-divider"></div>
      <div class="entity-options-resolved-entities" style="margin-top:12px;">
        ${
          !isGridMode
            ? html`<div class="entity-options-title">${localize("card.menu.select_entity")}</div>`
            : nothing
        }
        <div class="entity-options-resolved-entities-list ${isGridMode ? "grid-menu" : ""}">
          ${this._getResolvedEntitiesForCurrentChip().map((entityId) => {
            const state = this.hass?.states?.[entityId];
            const name = getEntityName(this.hass, state || entityId);
            const icon = state?.attributes?.icon || "mdi:help-circle";

            const idx = this._selectedIndex;
            const obj = this.entityObjs[idx];
            let role = "Main Entity";

            let isActive = false;
            if (obj) {
              const maEntity = this._getActualResolvedMaEntityForState(idx);
              const volEntity = this._getVolumeEntity(idx);
              const activeEntity = this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
              isActive = activeEntity === entityId;

              if (entityId === maEntity && maEntity !== obj.entity_id) {
                role = "Music Assistant Entity";
              } else if (
                entityId === volEntity &&
                volEntity !== obj.entity_id &&
                volEntity !== maEntity
              ) {
                role = "Volume Entity";
              }
            }

            if (isGridMode) {
              return html`
                <button
                  class="entity-options-item menu-action-item"
                  @click=${() => this._setActiveEntityForCurrentChip(entityId)}
                  title=${isActive ? localize("card.menu.active_entity") : localize("card.menu.set_active_entity")}
                >
                  <ha-icon class="menu-action-icon" .icon=${icon}></ha-icon>
                  <span class="menu-action-label">${isActive ? `${name} (Active)` : name}</span>
                </button>
              `;
            }

            return html`
              <div
                class="entity-options-item"
                role="button"
                tabindex="0"
                @click=${() => this._setActiveEntityForCurrentChip(entityId)}
                @keydown=${(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this._setActiveEntityForCurrentChip(entityId);
                  }
                }}
                title=${isActive ? localize("card.menu.active_entity") : localize("card.menu.set_active_entity")}
              >
                <ha-icon .icon=${icon} style="margin-right: 8px;"></ha-icon>
                <div
                  style="display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 0;"
                >
                  <div>${isActive ? `${name} (Active)` : name}</div>
                  <div style="font-size: 0.85em; opacity: 0.7;">${role}</div>
                </div>
                <button
                  type="button"
                  class="entity-more-info-btn"
                  title="More info"
                  aria-label="More info"
                  @click=${(e) => {
                    e.stopPropagation();
                    this._openMoreInfoForEntity(entityId);
                    this._showEntityOptions = false;
                    this._showResolvedEntities = false;
                    this.requestUpdate();
                  }}
                >
                  <ha-icon icon="mdi:information-outline" style="--mdc-icon-size: 20px;"></ha-icon>
                </button>
                <ha-icon
                  class="entity-active-star ${isActive ? "is-active" : "is-inactive"}"
                  .icon=${isActive ? "mdi:star" : "mdi:star-outline"}
                ></ha-icon>
              </div>
            `;
          })}
        </div>
      </div>
    </div>
  `;
}
