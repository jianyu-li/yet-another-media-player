/**
 * Reactive Lit controller managing card idle timeout, idle screens,
 * and multi-player playback switching grace periods for Yet Another Media Player (YAMP).
 *
 * Implements the Lit ReactiveController interface to cleanly manage timers,
 * idle state transitions, and automatic view changes on idle.
 */

/**
 * @typedef {import("../types.d.ts").YetAnotherMediaPlayerCard} YetAnotherMediaPlayerCard
 * @typedef {import("../types.d.ts").YampCardConfig} YampCardConfig
 */

/**
 * Safely parses an idle timeout in milliseconds from configuration.
 * Returns 0 if 0; returns valid non-negative number, or defaultValue.
 * @param {any} [value]
 * @param {number} [defaultValue=60000]
 * @returns {number}
 */
export function parseIdleTimeoutMs(value, defaultValue = 60000) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.max(0, value) : defaultValue;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, parsed);
    }
  }
  return defaultValue;
}

/**
 * Computes whether search should be dismissed or reset when playback starts.
 * @param {YampCardConfig | any} [config]
 * @param {string} [cardType]
 * @returns {{ shouldDismiss: boolean; shouldReset: boolean }}
 */
export function getSearchDismissBehavior(config, cardType) {
  const cardDismissSetting = config?.dismiss_search_on_play !== false;
  const isSearchMode = cardType === "search";
  return {
    shouldDismiss: !isSearchMode && cardDismissSetting,
    shouldReset: isSearchMode && cardDismissSetting,
  };
}

const IDLE_SCREEN_SEARCH_FILTER_MAP = Object.freeze({
  search: "default",
  "search-recently-played": "recently-played",
  "search-next-up": "next-up",
});

export class IdleController {
  /**
   * @param {YetAnotherMediaPlayerCard} host
   */
  constructor(host) {
    /** @type {YetAnotherMediaPlayerCard} */
    this.host = host;
    if (host && typeof host.addController === "function") {
      host.addController(this);
    }

    this.isIdle =
      host && Object.prototype.hasOwnProperty.call(host, "_isIdle") ? Boolean(host._isIdle) : false;
    /** @type {any} */
    this.idleTimeout =
      host && Object.prototype.hasOwnProperty.call(host, "_idleTimeout") ? host._idleTimeout : null;
    this.idleTimeoutMs =
      host &&
      Object.prototype.hasOwnProperty.call(host, "_idleTimeoutMs") &&
      typeof host._idleTimeoutMs === "number"
        ? host._idleTimeoutMs
        : 60000;
    this.idleScreenApplied =
      host && Object.prototype.hasOwnProperty.call(host, "_idleScreenApplied")
        ? Boolean(host._idleScreenApplied)
        : false;
    this.hasSeenPlayback =
      host && Object.prototype.hasOwnProperty.call(host, "_hasSeenPlayback")
        ? Boolean(host._hasSeenPlayback)
        : false;
    /** @type {any} */
    this.initialCheckTimer = null;
  }

  hostConnected() {}

  hostDisconnected() {
    this.clearIdleTimeout();
    if (this.initialCheckTimer) {
      clearTimeout(this.initialCheckTimer);
      this.initialCheckTimer = null;
    }
  }

  clearIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  }

  /**
   * Updates configuration and synchronizes idle timeout state.
   * @param {YampCardConfig | any} [config]
   */
  setConfig(config) {
    this.idleTimeoutMs = parseIdleTimeoutMs(config?.idle_timeout_ms, 60000);
    if (this.idleTimeoutMs === 0) {
      this.clearIdleTimeout();
      if (this.isIdle) {
        this.setIdleState(false);
        this.resetIdleScreen();
        this.host?.requestUpdate?.();
      }
    }
  }

  /**
   * Centralized idle state setter.
   * @param {boolean} idle
   */
  setIdleState(idle) {
    const targetIdle = this.idleTimeoutMs === 0 ? false : Boolean(idle);
    if (this.isIdle === targetIdle) return;
    this.isIdle = targetIdle;
    if (this.host?._cardHeightTemplate) {
      this.host._cardHeightTemplateNeedsResolve = true;
    }
  }

  /**
   * Applies the configured idle screen if idle and not yet applied.
   */
  applyIdleScreen() {
    if (
      !this.host ||
      this.host._cardType === "group_players" ||
      this.host._isTinyMode ||
      this.host._cardType === "tiny" ||
      this.idleScreenApplied
    )
      return;
    const mode = this.host._idleScreen || "default";
    const searchFilter = IDLE_SCREEN_SEARCH_FILTER_MAP[mode];
    if (!searchFilter) return;
    this.host._showEntityOptions = true;
    this.host._showGrouping = false;
    this.host._showSourceList = false;
    this.host._showTransferQueue = false;
    this.host._showResolvedEntities = false;
    this.host._showSearchSheetInOptions?.(searchFilter);
    this.idleScreenApplied = true;
  }

  /**
   * Resets the idle screen overlay if currently applied.
   */
  resetIdleScreen() {
    if (!this.idleScreenApplied) return;
    const { shouldDismiss, shouldReset } = this.getSearchDismissBehavior();
    switch (this.host?._idleScreen) {
      case "search":
      case "search-recently-played":
      case "search-next-up":
        if (shouldDismiss) {
          this.host?._hideSearchSheetInOptions?.();
          if (this.host) this.host._showEntityOptions = false;
        } else if (shouldReset) {
          this.host?._showSearchSheetInOptions?.();
        } else {
          this.idleScreenApplied = false;
          return;
        }
        break;
      default:
        break;
    }
    this.idleScreenApplied = false;
    this.host?.requestUpdate?.();
  }

  /**
   * Computes whether search should be dismissed or reset when playback starts.
   * @returns {{ shouldDismiss: boolean; shouldReset: boolean }}
   */
  getSearchDismissBehavior() {
    return getSearchDismissBehavior(this.host?.config, this.host?._cardType);
  }

  /**
   * Schedules initial idle check on card load.
   */
  scheduleInitialIdleCheck() {
    if (this.initialCheckTimer) {
      clearTimeout(this.initialCheckTimer);
      this.initialCheckTimer = null;
    }
    this.initialCheckTimer = setTimeout(() => {
      this.initialCheckTimer = null;
      if (!this.host) return;
      if (this.host._cardType === "search") {
        // Dedicated search mode: auto-open search as the primary view
        this.host._showEntityOptions = true;
        this.setIdleState(false);
        this.host._showSearchSheetInOptions?.();
        this.host.requestUpdate?.();
        return;
      }
      if (this.host._cardType === "up_next") {
        // Dedicated up next mode: auto-open search filtered to up next
        this.host._showEntityOptions = true;
        this.setIdleState(false);
        this.host._showSearchSheetInOptions?.("next-up");
        this.host.requestUpdate?.();
        return;
      }
      if (this.host._cardType === "remote_control") {
        // Dedicated remote control mode
        this.host._showEntityOptions = true;
        this.host._showRemoteControl = true;
        this.setIdleState(false);
        this.host.requestUpdate?.();
        return;
      }
      if (this.host._cardType === "group_players") {
        // Dedicated group players mode: auto-open grouping as the primary view
        this.host._showEntityOptions = true;
        this.setIdleState(false);
        this.host._showGrouping = true;
        this.host.requestUpdate?.();
        return;
      }
      if (this.host.hass && this.host.entityIds && this.host.entityIds.length > 0) {
        const stateObj = this.host.hass.states?.[this.host.entityIds[this.host._selectedIndex]];
        // Don't go idle if there's an active linger or if idle_timeout_ms is 0
        const hasActiveLinger = Boolean(
          this.host._playbackLingerByIdx?.[this.host._selectedIndex] &&
          this.host._playbackLingerByIdx[this.host._selectedIndex].until > Date.now()
        );
        const isAnyUnrestrictedPlaying = this.host.entityIds.some((id, idx) => {
          if (this.host._isAutoSelectDisabled?.(idx)) return false;
          const s = this.host.hass?.states?.[id];
          return this.host._isEntityPlaying?.(s);
        });
        const isCurrentDisabled = this.host._isAutoSelectDisabled?.(this.host._selectedIndex);
        const isCurrentPlaying = Boolean(
          this.host._isEntityPlaying?.(stateObj) && (!isCurrentDisabled || this.host._manualSelect)
        );

        if (
          stateObj &&
          !isCurrentPlaying &&
          !isAnyUnrestrictedPlaying &&
          !hasActiveLinger &&
          this.idleTimeoutMs > 0
        ) {
          this.setIdleState(true);
          this.host.requestUpdate?.();
        }
      }
    }, 0);
  }

  /**
   * Updates idle state based on changed properties, playback status, and timers.
   * @param {Map<string | number | symbol, unknown>} [changedProps]
   */
  updateIdleState(changedProps) {
    if (this.host?._cardType === "group_players") {
      this.clearIdleTimeout();
      this.setIdleState(false);
      if (this.host) {
        this.host._showEntityOptions = true;
        this.host._showGrouping = true;
      }
      return;
    }
    // Consider both main and Music Assistant entities so we can wake from idle
    // even if the active selection is frozen while idle.
    const isAnyUnrestrictedPlaying = Boolean(
      this.host?.entityIds?.some((id, idx) => {
        if (this.host?._isAutoSelectDisabled?.(idx)) return false;

        const activeId = this.host?._getEntityForPurpose?.(idx, "sorting");
        return this.host?._isEntityPlaying?.(this.host?.hass?.states?.[activeId]);
      })
    );

    const isCurrentPlaying = Boolean(this.host?._isCurrentEntityPlaying?.());
    const isCurrentDisabled = Boolean(
      this.host?._isAutoSelectDisabled?.(this.host?._selectedIndex)
    );

    // Condition to wake up or stay active immediately:
    // Only wake up (from idle or initial load) if an UNRESTRICTED player is active.
    // If already active, we only stay active immediately if the CURRENT player is playing
    // AND it's either an unrestricted entity OR the user manually selected it.
    const isCurrentPlayingValidForActive =
      isCurrentPlaying && (!isCurrentDisabled || this.host?._manualSelect);

    let shouldBeActiveImmediately;
    if (this.isIdle || !this.hasSeenPlayback) {
      shouldBeActiveImmediately = isAnyUnrestrictedPlaying || isCurrentPlaying;
    } else {
      shouldBeActiveImmediately = isCurrentPlayingValidForActive;
    }

    if (shouldBeActiveImmediately) {
      // Became active, clear timer and set not idle
      this.clearIdleTimeout();
      this.hasSeenPlayback = true;
      if (this.isIdle) {
        this.setIdleState(false);
        this.resetIdleScreen();
        this.host?.requestUpdate?.();
      }
      return;
    }

    // Defer idle state if user is actively browsing menus
    if (this.host?.isAnyMenuOpen) {
      this.clearIdleTimeout();
      return;
    }

    // Current is not playing, or nothing is playing.
    if (!this.hasSeenPlayback) {
      // Initial load with nothing playing - go idle immediately
      if (this.idleTimeoutMs > 0) {
        if (!this.isIdle) {
          this.setIdleState(true);
          this.idleScreenApplied = false;
          this.applyIdleScreen();
          this.host?.requestUpdate?.();
        }
      } else if (this.isIdle) {
        this.setIdleState(false);
        this.resetIdleScreen();
        this.host?.requestUpdate?.();
      }
      return;
    }

    // Check for grace period: something is playing somewhere, but not the current choice.
    // Or nothing is playing at all. In both cases, we wait for the timeout.
    if (!this.isIdle && this.idleTimeoutMs > 0) {
      const isTabChange = changedProps && changedProps.has("_selectedIndex");

      if (isTabChange) {
        // If we manually change tabs/chips, clear any existing idle timeout to start fresh
        this.clearIdleTimeout();

        if (!isAnyUnrestrictedPlaying && this.idleTimeoutMs > 0) {
          // Bypass grace period if we just switched away from the only thing keeping the card awake (a playing disabled entity)
          this.setIdleState(true);
          this.idleScreenApplied = false;

          if (this.host && this.host._pinnedIndex === null) {
            this.host._manualSelect = false;
            this.host._manualSelectPlayingSet = null;
          }

          this.applyIdleScreen();
          this.host?.requestUpdate?.();
        } else {
          // Something is playing, start a fresh timeout for the new selection
          this.idleTimeout = setTimeout(() => {
            this.handleIdleTimeoutCallback();
          }, this.idleTimeoutMs);
          if (typeof this.idleTimeout?.unref === "function") this.idleTimeout.unref();
        }
      } else if (!this.idleTimeout) {
        this.idleTimeout = setTimeout(() => {
          this.handleIdleTimeoutCallback();
        }, this.idleTimeoutMs);
        if (typeof this.idleTimeout?.unref === "function") this.idleTimeout.unref();
      }
    }

    // If idle_timeout_ms is 0, ensure we're never idle
    if (this.idleTimeoutMs === 0 && this.isIdle) {
      this.setIdleState(false);
      this.resetIdleScreen();
      this.host?.requestUpdate?.();
    }
  }

  /**
   * Callback invoked when the idle timeout fires.
   */
  handleIdleTimeoutCallback() {
    if (this.host?._cardType === "group_players") {
      this.idleTimeout = null;
      this.setIdleState(false);
      if (this.host) {
        this.host._showEntityOptions = true;
        this.host._showGrouping = true;
        this.host.requestUpdate?.();
      }
      return;
    }
    // In search card mode: reset drill-down instead of going idle
    if (this.host?._cardType === "search" || this.host?._cardType === "up_next") {
      this.idleTimeout = null;
      if (this.host._searchHierarchy && this.host._searchHierarchy.length > 0) {
        this.host._searchHierarchy = [];
        this.host._searchBreadcrumb = "";
        this.host._searchResultsByType = {};
        const defaultFilter =
          this.host.config?.default_search_filter === "all"
            ? null
            : this.host.config?.default_search_filter;
        this.host._doSearch?.(defaultFilter).catch(() => {});
        this.host.requestUpdate?.();
      }
      return;
    }

    // Check if there is any playing entity before going idle
    const isAnyPlaying = Boolean(
      this.host?.entityIds?.some((id, idx) => {
        if (this.host._isAutoSelectDisabled?.(idx)) return false;
        const activeId = this.host._getEntityForPurpose?.(idx, "sorting");
        const stateObj = this.host.hass?.states?.[activeId];
        return stateObj && this.host._isEntityPlaying?.(stateObj);
      })
    );

    this.idleTimeout = null;

    // If not explicitly pinned, clear manual select on idle timeout
    // so we can switch to other playing entities if needed
    if (this.host && this.host._pinnedIndex === null) {
      this.host._manualSelect = false;
      this.host._manualSelectPlayingSet = null;
    }

    if (isAnyPlaying) {
      // Something is playing, so don't enter idle state. Switch to the playing entity instead.
      const sortedIds = this.host?.sortedEntityIds || [];
      if (sortedIds.length > 0) {
        let mostRecentId = sortedIds[0];
        const candidateGroup = mostRecentId
          ? (this.host?.groupedSortedEntityIds || []).find((g) => g.includes(mostRecentId))
          : null;
        if (candidateGroup && candidateGroup.length > 1) {
          const groupMaster = this.host?._getActualGroupMaster?.(candidateGroup);
          if (groupMaster) {
            mostRecentId = groupMaster;
          }
        }
        const mostRecentIdx = this.host?.entityIds?.indexOf(mostRecentId) ?? -1;
        if (mostRecentIdx >= 0 && mostRecentIdx !== this.host?._selectedIndex) {
          if (this.host) this.host._selectedIndex = mostRecentIdx;
        }
      }
      this.host?.requestUpdate?.();
      return;
    }

    if (this.host?._autoEntities?.length) {
      this.host._setTransientEntities?.({ auto: [] });
    }
    this.setIdleState(true);
    this.idleScreenApplied = false;
    this.applyIdleScreen();
    this.host?.requestUpdate?.();
  }
}
