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
    groupPlayerIds.push({
      id: id,
      groupId: state.entityToCheck || id,
      isBusy: state.isBusy,
      busyLabel: state.busyLabel,
      isGroupable: state.isGroupable,
    });
  });

  const activeId = this.currentEntityId;
  const activeIdx = this.entityIds.indexOf(activeId);
  const activeGroupId = activeIdx >= 0 ? this._getGroupingEntityId(activeIdx) : null;
  const activeState = activeGroupId ? this.hass.states[activeGroupId] : null;
  const activeIsGroupCapable = activeState ? this._isGroupCapable(activeState) : false;

  // Check if active entity is itself a follower (isBusy)
  const activeGroupKey = this._getGroupKey(activeId);
  const activeIsBusy = activeGroupKey !== activeId;

  if (groupPlayerIds.length === 0) {
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
        ${localize("card.grouping.no_players")}
      </div>
    `;
  }

  const hasMaTransferService = Boolean(this.hass?.services?.music_assistant?.transfer_queue);
  const currentIdx = this._selectedIndex;
  const activeMaState = this._getMusicAssistantState?.();
  const sourceMaId =
    (activeMaState &&
      this._looksLikeMusicAssistantState?.(activeMaState) &&
      activeMaState.entity_id) ||
    this._getActualResolvedMaEntityForState?.(currentIdx);
  const sourceEntityId = this.entityIds?.[currentIdx];
  const hasQueueToTransfer = Boolean(this._hasTransferQueueForCurrent);

  // Bucket into multi-speaker groups vs standalone players
  const filteredMembers = Array.isArray(masterState?.attributes?.group_members)
    ? masterState.attributes.group_members
    : [];

  const groupBuckets = new Map();
  const unGroupedList = [];

  groupPlayerIds.forEach((item) => {
    const inActiveGroup = Boolean(
      groupedAny && (item.id === masterId || filteredMembers.includes(item.groupId))
    );

    const playerGroupKey = this._getGroupKey(item.id);
    const playerGroupingState = this.hass?.states?.[item.groupId];
    const playerMembers = Array.isArray(playerGroupingState?.attributes?.group_members)
      ? playerGroupingState.attributes.group_members
      : [];
    const isMultiSpeaker =
      inActiveGroup ||
      playerMembers.length > 1 ||
      (Boolean(playerGroupKey) && playerGroupKey !== item.id);

    if (isMultiSpeaker) {
      const groupKey = inActiveGroup ? masterId : playerGroupKey || item.id;
      if (!groupBuckets.has(groupKey)) {
        groupBuckets.set(groupKey, []);
      }
      groupBuckets.get(groupKey).push(item);
    } else {
      unGroupedList.push(item);
    }
  });

  const groupedCards = [];
  const standaloneItems = [...unGroupedList];

  for (const [groupKey, items] of groupBuckets.entries()) {
    if (items.length > 1) {
      // Sort members within this group: coordinator/master first
      items.sort((a, b) => {
        if (a.id === groupKey) return -1;
        if (b.id === groupKey) return 1;
        return 0;
      });

      const isCurrentGroup = Boolean(
        (masterId && groupKey === masterId) ||
        (activeId && (groupKey === activeId || items.some((it) => it.id === activeId)))
      );

      const masterEntityId = groupKey;
      const masterName =
        (masterEntityId && this.getChipName(masterEntityId)) ||
        (activeId ? this.getChipName(activeId) : "");
      const groupLabelTemplate = localize("card.grouping.group_label") || "{master} Group";
      const groupLabel = masterName
        ? groupLabelTemplate.replace("{master}", masterName)
        : localize("card.grouping.title") || "Group";

      const masterIdx = this.entityIds.indexOf(masterEntityId);
      const targetIdx = masterIdx >= 0 ? masterIdx : 0;
      const masterMaId =
        (masterIdx >= 0 && this._getActualResolvedMaEntityForState?.(masterIdx)) ||
        this._getGroupingEntityIdByEntityId?.(masterEntityId) ||
        masterEntityId;

      const targetEntityState = this.hass?.states?.[masterEntityId];
      const targetMaState = this.hass?.states?.[masterMaId];
      const targetState = targetEntityState || targetMaState;

      const targetIsMa = this._queueController?.isTargetMusicAssistant
        ? this._queueController.isTargetMusicAssistant({
            maEntityId: masterMaId,
            entityId: masterEntityId,
            mainEntityId: masterEntityId,
          })
        : Boolean(
            (targetMaState && this._looksLikeMusicAssistantState?.(targetMaState)) ||
            (targetEntityState && this._looksLikeMusicAssistantState?.(targetEntityState))
          );

      const isDeviceUnavailable =
        targetEntityState?.state === "unavailable" || targetMaState?.state === "unavailable";

      const isTransferPending = this._transferQueuePendingTarget === masterMaId;
      const isTransferDisabled =
        !hasQueueToTransfer ||
        !targetIsMa ||
        isCurrentGroup ||
        isTransferPending ||
        isDeviceUnavailable;

      let transferTooltip;
      if (isDeviceUnavailable) {
        transferTooltip = localize("card.grouping.unavailable") || "Player is unavailable";
      } else if (!targetIsMa) {
        transferTooltip =
          localize("card.grouping.transfer_not_ma") || "Music Assistant player required";
      } else if (!hasQueueToTransfer) {
        transferTooltip =
          localize("card.grouping.transfer_no_queue") || "No active queue to transfer";
      } else {
        transferTooltip = (
          localize("card.grouping.transfer_to_group") || "Transfer queue to {master} group"
        ).replace("{master}", masterName);
      }

      const targetPayload = {
        index: targetIdx,
        entityId: masterEntityId,
        maEntityId: masterMaId,
        mainEntityId: masterEntityId,
        name: `${masterName} (${localize("card.grouping.title") || "Group"})`,
        subtitle: masterMaId !== masterEntityId ? masterMaId : masterEntityId,
        state: targetState?.state,
        icon: "mdi:speaker-multiple",
      };

      groupedCards.push({
        groupKey,
        masterId: masterEntityId,
        masterName,
        groupLabel,
        isCurrentGroup,
        isTransferDisabled,
        transferTooltip,
        targetPayload,
        items,
      });
    } else {
      // Single player configured in YAMP - display as standalone item
      standaloneItems.push(...items);
    }
  }

  // Sort group cards: active group first, then alphabetical by master name
  groupedCards.sort((a, b) => {
    if (a.isCurrentGroup) return -1;
    if (b.isCurrentGroup) return 1;
    return a.masterName.localeCompare(b.masterName);
  });

  // Sort standalone items: active solo player first, available before busy
  standaloneItems.sort((a, b) => {
    if (a.id === activeId) return -1;
    if (b.id === activeId) return 1;
    if (a.isBusy === b.isBusy) return 0;
    return a.isBusy ? 1 : -1;
  });

  const renderGroupItem = (item, isInsideGroup = false) => {
    const id = item.id;
    const actualGroupId = item.groupId;
    const grouped = filteredMembers.includes(actualGroupId);
    const name = this.getChipName(id);
    const isBusy = item.isBusy;
    const busyLabel = item.busyLabel;

    const entityIdx = this.entityIds.indexOf(id);
    const volumeEntity = this._getVolumeEntity(entityIdx);
    const displayEntity = volumeEntity || actualGroupId;
    const displayVolumeState = this.hass.states[displayEntity];

    const isRemoteVol = displayEntity?.startsWith && displayEntity.startsWith("remote.");
    const volVal = Number(displayVolumeState?.attributes?.volume_level || 0);
    const isPrimaryRow = id === masterId;
    const isGroupable = item.isGroupable !== false;
    const showToggleButton = isGroupable;
    const isCurrent = id === activeId;
    const isJustMoved = Boolean(
      this._justSelectedGroupingEntityId && this._justSelectedGroupingEntityId === id
    );
    const masterName = masterId
      ? this.getChipName(masterId)
      : activeId
        ? this.getChipName(activeId)
        : "";

    // Check if player belongs to any multi-speaker group (its own or the active master's)
    const playerGroupKey = this._getGroupKey(id);
    const playerGroupingState = this.hass?.states?.[actualGroupId];
    const playerMembers = Array.isArray(playerGroupingState?.attributes?.group_members)
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

    const targetIsMa = this._queueController?.isTargetMusicAssistant
      ? this._queueController.isTargetMusicAssistant({
          maEntityId: targetMaId,
          entityId: targetEntityId,
          mainEntityId: id,
        })
      : Boolean(
          (targetMaState && this._looksLikeMusicAssistantState?.(targetMaState)) ||
          (targetEntityState && this._looksLikeMusicAssistantState?.(targetEntityState)) ||
          (mainState && this._looksLikeMusicAssistantState?.(mainState))
        );

    const isDeviceUnavailable =
      mainState?.state === "unavailable" ||
      groupEntityState?.state === "unavailable" ||
      displayVolumeState?.state === "unavailable" ||
      volumeState?.state === "unavailable" ||
      targetEntityState?.state === "unavailable" ||
      targetMaState?.state === "unavailable";

    let stateLabel;
    if (isDeviceUnavailable) {
      stateLabel = busyLabel || localize("card.grouping.unavailable") || "Unavailable";
    } else if (isMultiSpeakerGroup) {
      stateLabel = localize("card.grouping.joined");
    } else if (isCurrent) {
      stateLabel = localize("card.grouping.current");
    } else if (!isGroupable && !targetIsMa) {
      stateLabel = localize("card.grouping.standalone") || "Standalone";
    } else {
      stateLabel = localize("card.grouping.available");
    }

    // Self check: is this target the currently active playback entity / group?
    const isSelf =
      targetMaId === sourceMaId ||
      targetEntityId === sourceEntityId ||
      targetMaId === sourceEntityId ||
      targetEntityId === sourceMaId ||
      (isMultiSpeakerGroup &&
        (groupedAny || (Boolean(activeGroupKey) && activeGroupKey !== this.currentEntityId)) &&
        targetGroupMasterId === activeGroupKey);

    const isTransferPending = this._transferQueuePendingTarget === targetMaId;
    const isTransferDisabled =
      !hasQueueToTransfer || !targetIsMa || isSelf || isTransferPending || isDeviceUnavailable;

    let transferTooltip;
    if (isDeviceUnavailable) {
      transferTooltip = localize("card.grouping.unavailable") || "Player is unavailable";
    } else if (!targetIsMa) {
      transferTooltip =
        localize("card.grouping.transfer_not_ma") || "Music Assistant player required";
    } else if (!hasQueueToTransfer) {
      transferTooltip =
        localize("card.grouping.transfer_no_queue") || "No active queue to transfer";
    } else if (isSelf) {
      transferTooltip =
        localize("card.grouping.transfer_current_player") || "Currently playing here";
    } else if (isMultiSpeakerGroup) {
      transferTooltip = (
        localize("card.grouping.transfer_to_group") || "Transfer queue to {master} group"
      ).replace("{master}", targetGroupMasterName);
    } else {
      transferTooltip = (
        localize("card.grouping.transfer_to_player") || "Transfer queue to {player}"
      ).replace("{player}", name);
    }

    const isGroupActive = isPrimaryRow ? groupedAny || isCurrent : grouped;
    const isSolePlayer = isGroupActive && !groupedAny;
    const canUnjoinMaster = hasMaTransferService && targetIsMa && groupedAny;
    const isMasterLocked = isPrimaryRow && !canUnjoinMaster;
    const isTransferInProgress = Boolean(this._transferQueuePendingTarget);

    const isToggleDisabled = Boolean(
      isBusy || isDeviceUnavailable || isSolePlayer || isMasterLocked || isTransferInProgress
    );

    const unjoinTooltip = isPrimaryRow
      ? localize("card.grouping.unjoin_from")?.replace(" {master}", "") || "Unjoin"
      : localize("card.grouping.unjoin_from")?.replace("{master}", masterName) || "Unjoin";

    const toggleTooltip =
      isDeviceUnavailable || isBusy
        ? localize("card.grouping.unavailable")
        : isSolePlayer
          ? localize("card.grouping.current")
          : isGroupActive
            ? unjoinTooltip
            : localize("card.grouping.join_with")?.replace("{master}", masterName);

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
      const isDisabled = isToggleDisabled;

      return html`
        <div
          class="entity-options-item menu-action-item ${isGroupActive ? "grid-active" : ""} ${
            isJustMoved ? "just-moved" : ""
          }"
          style="position: relative;"
        >
          ${
            hasMaTransferService && !isInsideGroup
              ? html`
                  <button
                    type="button"
                    class="grid-menu-transfer-btn"
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
                  </button>
                `
              : nothing
          }
          <div
            class="grid-menu-toggle-action"
            role="button"
            tabindex=${isDisabled ? "-1" : "0"}
            ?disabled=${isDisabled}
            @click=${() => !isDisabled && this._toggleGroup(id)}
            @keydown=${(e) => {
              if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                this._toggleGroup(id);
              }
            }}
            title=${isBusy ? localize("card.grouping.unavailable") : toggleTooltip}
            style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;height:100%;cursor:${
              isDisabled ? "default" : "pointer"
            };${isDisabled ? "opacity:0.35;" : ""}"
          >
            <ha-icon
              class="menu-action-icon"
              icon=${isGroupActive && groupedAny ? "mdi:speaker-multiple" : "mdi:speaker"}
            ></ha-icon>
            <span class="menu-action-label">${name}</span>
          </div>
        </div>
      `;
    }

    const stepperBtnStyle = `background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;cursor:${
      isDeviceUnavailable ? "not-allowed" : "pointer"
    };${isDeviceUnavailable ? "opacity:0.35;" : ""}`;

    return html`
      <div class="entity-options-item group-player-row ${isJustMoved ? "just-moved" : ""}">
        <div
          role="button"
          tabindex=${entityIdx >= 0 ? "0" : "-1"}
          @click=${(e) => {
            e?.stopPropagation?.();
            if (entityIdx >= 0) {
              if (typeof this._selectEntityFromGrouping === "function") {
                this._selectEntityFromGrouping(entityIdx);
              } else {
                this._onChipClick(entityIdx);
              }
            }
          }}
          @keydown=${(e) => {
            if (entityIdx >= 0 && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              e?.stopPropagation?.();
              if (typeof this._selectEntityFromGrouping === "function") {
                this._selectEntityFromGrouping(entityIdx);
              } else {
                this._onChipClick(entityIdx);
              }
            }
          }}
          title=${
            isCurrent
              ? localize("card.menu.active_entity") || localize("card.grouping.current") || "Active"
              : localize("card.menu.set_active_entity") || "Set as active entity"
          }
          style="flex:0.7; min-width:84px; cursor:${entityIdx >= 0 ? "pointer" : "default"};"
        >
          <div style="text-align:left;">${name}</div>
          <div style="font-size:0.8em; opacity:0.7; text-align:left;">${stateLabel}</div>
        </div>
        <div
          style="flex:1.8;display:flex;align-items:center;gap:4px;margin:0 4px; min-width:140px;"
        >
          ${
            isRemoteVol
              ? html`
                  <div
                    class="vol-stepper"
                    style="flex:1;padding:0 4px;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;"
                  >
                    <button
                      ?disabled=${isDeviceUnavailable}
                      @click=${() =>
                        !isDeviceUnavailable && this._onGroupVolumeStep(displayEntity, -1)}
                      title="${localize("common.vol_down")}"
                      style="${stepperBtnStyle}"
                    >
                      <ha-icon icon="mdi:minus"></ha-icon>
                    </button>
                    <button
                      ?disabled=${isDeviceUnavailable}
                      @click=${() =>
                        !isDeviceUnavailable && this._onGroupVolumeStep(displayEntity, 1)}
                      title="${localize("common.vol_up")}"
                      style="${stepperBtnStyle}"
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
                      ?disabled=${isDeviceUnavailable}
                      .value=${volVal}
                      @mousedown=${(e) => !isDeviceUnavailable && this._onVolumeDragStart(e, id)}
                      @touchstart=${(e) => !isDeviceUnavailable && this._onVolumeDragStart(e, id)}
                      @input=${(e) => !isDeviceUnavailable && this._onVolumeInput(e)}
                      @mouseup=${(e) => !isDeviceUnavailable && this._onVolumeDragEnd(e)}
                      @touchend=${(e) => !isDeviceUnavailable && this._onVolumeDragEnd(e)}
                      @change=${(e) =>
                        !isDeviceUnavailable && this._onGroupVolumeChange(id, displayEntity, e)}
                      title="${localize("common.volume")}"
                      style="width:100%;max-width:260px;cursor:${
                        isDeviceUnavailable ? "not-allowed" : "pointer"
                      };${isDeviceUnavailable ? "opacity:0.35;" : ""}"
                    />
                  </div>
                `
          }
          <span style="min-width:36px;display:inline-block;text-align:right;"
            >${
              !isDeviceUnavailable && typeof volVal === "number"
                ? Math.round(volVal * 100) + "%"
                : "--"
            }</span
          >
        </div>
        ${
          hasMaTransferService && !isInsideGroup
            ? html`
                <button
                  class="group-transfer-btn"
                  ?disabled=${isTransferDisabled}
                  @click=${() => !isTransferDisabled && this._transferQueueTo(targetPayload)}
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
                  ?disabled=${isToggleDisabled}
                  @click=${() => !isToggleDisabled && this._toggleGroup(id)}
                  title=${toggleTooltip}
                  style="margin-left:2px; ${
                    isToggleDisabled ? "cursor: not-allowed; opacity: 0.35;" : ""
                  }"
                >
                  <ha-icon
                    icon=${isGroupActive ? "mdi:minus-circle-outline" : "mdi:plus-circle-outline"}
                  ></ha-icon>
                </button>
              `
            : html`<span
                style="margin-left:2px;margin-right:10px;width:32px;display:inline-block;"
              ></span>`
        }
      </div>
    `;
  };

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
      ${
        activeIsGroupCapable && !activeIsBusy
          ? html`
              <button
                class="entity-options-item"
                @click=${() => (groupedAny ? this._ungroupAll() : this._groupAll())}
                style="flex:0 0 auto; min-width:140px; text-align:center; margin-left:auto;"
              >
                ${
                  groupedAny
                    ? localize("card.grouping.ungroup_all")
                    : localize("card.grouping.group_all")
                }
              </button>
            `
          : nothing
      }
    </div>
    ${
      this._transferQueueStatus
        ? html`
            <div
              class="transfer-status-banner ${this._transferQueueStatus.type || ""}"
              style="
                margin-bottom: 12px;
                padding: 10px 12px;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                background: ${
                this._transferQueueStatus.type === "error"
                  ? "rgba(244, 67, 54, 0.18)"
                  : this._transferQueueStatus.type === "pending" ||
                      this._transferQueueStatus.type === "working" ||
                      this._transferQueueStatus.type === "info"
                    ? "rgba(33, 150, 243, 0.18)"
                    : "rgba(76, 175, 80, 0.18)"
              };
                color: ${
                this._transferQueueStatus.type === "error"
                  ? "#ff8a80"
                  : this._transferQueueStatus.type === "pending" ||
                      this._transferQueueStatus.type === "working" ||
                      this._transferQueueStatus.type === "info"
                    ? "#64b5f6"
                    : "#8bc34a"
              };
              "
            >
              ${
                this._transferQueueStatus.type === "pending" ||
                this._transferQueueStatus.type === "working" ||
                this._transferQueueStatus.type === "info"
                  ? html`<ha-icon
                      icon="mdi:loading"
                      class="spin"
                      style="--mdc-icon-size: 18px; width: 18px; height: 18px;"
                    ></ha-icon>`
                  : nothing
              }
              <span>${this._transferQueueStatus.message}</span>
            </div>
          `
        : nothing
    }
    <div class="group-list-scroll ${isGridMode ? "grid-menu" : ""}">
      ${
        groupedCards.length === 0 && standaloneItems.length === 0
          ? html`
              <div
                class="entity-options-item"
                style="padding:12px; opacity:0.75; text-align:center;"
              >
                ${localize("card.grouping.no_players")}
              </div>
            `
          : html`
              ${groupedCards.map((group) => {
                const groupMasterIdx = this.entityIds.indexOf(group.masterId);
                const isCardJustMoved = Boolean(
                  this._justSelectedGroupingEntityId &&
                  (this._justSelectedGroupingEntityId === group.masterId ||
                    group.items.some((it) => it.id === this._justSelectedGroupingEntityId))
                );
                return html`
                  <div
                    class="${isGridMode ? "grid-group-card" : "grouped-players-card"} ${
                      group.isCurrentGroup ? "is-current-group" : ""
                    } ${isCardJustMoved ? "just-moved" : ""}"
                  >
                    <div class="grouped-card-header">
                      <div
                        class="grouped-card-title"
                        role="button"
                        tabindex=${groupMasterIdx >= 0 ? "0" : "-1"}
                        @click=${(e) => {
                          e?.stopPropagation?.();
                          if (groupMasterIdx >= 0) {
                            if (typeof this._selectEntityFromGrouping === "function") {
                              this._selectEntityFromGrouping(groupMasterIdx);
                            } else {
                              this._onChipClick(groupMasterIdx);
                            }
                          }
                        }}
                        @keydown=${(e) => {
                          if (groupMasterIdx >= 0 && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            e?.stopPropagation?.();
                            if (typeof this._selectEntityFromGrouping === "function") {
                              this._selectEntityFromGrouping(groupMasterIdx);
                            } else {
                              this._onChipClick(groupMasterIdx);
                            }
                          }
                        }}
                        title=${
                          group.isCurrentGroup
                            ? localize("card.menu.active_entity") ||
                              localize("card.grouping.current") ||
                              "Active"
                            : localize("card.menu.set_active_entity") || "Set as active entity"
                        }
                        style="cursor:${groupMasterIdx >= 0 ? "pointer" : "default"};"
                      >
                        <ha-icon icon="mdi:speaker-multiple"></ha-icon>
                        <span>${group.groupLabel}</span>
                      </div>
                      <div class="grouped-card-actions">
                        ${
                          !group.isCurrentGroup && hasMaTransferService
                            ? html`
                                <button
                                  type="button"
                                  class="grouped-card-transfer-btn"
                                  ?disabled=${group.isTransferDisabled}
                                  @click=${(e) => {
                                    e?.stopPropagation?.();
                                    if (!group.isTransferDisabled) {
                                      this._transferQueueTo(group.targetPayload);
                                    }
                                  }}
                                  title=${group.transferTooltip}
                                >
                                  <ha-icon icon="mdi:swap-horizontal"></ha-icon>
                                </button>
                              `
                            : nothing
                        }
                        <button
                          type="button"
                          class="grouped-card-ungroup-btn"
                          @click=${(e) => {
                            e?.stopPropagation?.();
                            this._ungroupAll(group.masterId);
                          }}
                          title="${localize("card.grouping.ungroup_all") || "Ungroup All"}"
                        >
                          ${localize("card.grouping.ungroup_all") || "Ungroup All"}
                        </button>
                      </div>
                    </div>
                    ${
                      isGridMode
                        ? html`<div class="grid-group-card-items">
                            ${group.items.map((item) => renderGroupItem(item, true))}
                          </div>`
                        : group.items.map((item) => renderGroupItem(item, true))
                    }
                  </div>
                `;
              })}
              ${
                isGridMode
                  ? standaloneItems.length > 0
                    ? html`
                        <div class="grid-menu-items">
                          ${standaloneItems.map((item) => renderGroupItem(item, false))}
                        </div>
                      `
                    : nothing
                  : standaloneItems.map((item) => renderGroupItem(item, false))
              }
            `
      }
    </div>
  `;
}

/**
 * Render the Transfer Queue overlay sheet (consolidated into Speakers & Groups).
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 */
export function renderTransferQueueSheet() {
  return renderGroupingSheet.call(this);
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
