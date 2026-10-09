/* global __VERSION__ */
import { LitElement, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import { createHoldToPinHandler, renderChipRow } from "./chip-row.js";
import { renderActionChipRow } from "./action-chip-row.js";
import { renderControlsRow, countMainControls } from "./controls-row.js";
import { renderVolumeRow } from "./volume-row.js";
import { renderProgressBar } from "./progress-bar.js";
import { yampCardStyles } from "./yamp-card-styles.js";
import { QueueDragMixin } from "./yamp-queue-drag.js";
import "./lyrics-view.js";
import { YampMediaSessionManager } from "./yamp-media-session.js";
import {
  renderSearchOptionsOverlay,
  searchMedia,
  playSearchedMedia,
  getFavorites,
  getRecentlyPlayed,
  isTrackFavorited,
  getMassQueueConfigEntryId,
  getMusicAssistantConfigEntryId,
  ALLOWED_MEDIA_TYPES,
  transformMusicAssistantItem,
  isAiRadioAvailable,
  playAiRadioStation,
  isShow
} from "./search-sheet.js";
import "./yamp-editor.js";

import { renderSourceListSheet } from "./sheets/source-selector-sheet.js";
import { renderRemoteControlSheet } from "./sheets/remote-control-sheet.js";
import {
  renderGroupingSheet,
  renderTransferQueueSheet,
  renderResolvedEntitiesSheet,
} from "./sheets/device-group-sheet.js";
import {
  renderSearchInOptions,
  renderSearchSubFilters,
} from "./sheets/options-search-sheet.js";
import {
  renderMainMenu,
  renderGroupingMenuOption,
  renderOptionsOverlay,
} from "./sheets/options-sheet.js";
import { TemplateController } from "./controllers/template-controller.js";
import { LyricsController, cleanTrackMetadata } from "./controllers/lyrics-controller.js";
import { ArtworkController } from "./controllers/artwork-controller.js";
import { QueueController } from "./controllers/queue-controller.js";
import {
  mediaPlay,
  mediaPause,
  mediaStop,
  mediaNextTrack,
  mediaPreviousTrack,
  mediaSeek,
  setShuffle,
  setRepeat,
  selectSource,
  togglePower,
  setVolume,
  setMute,
  sendRemoteCommand,
  sendRemoteVolumeStep,
  joinPlayers,
  unjoinPlayer,
} from "./services/ha-media-services.js";


import {
  resolveTemplateAtActionTime,
  resolveStringTemplate,
  resolveStringTemplateSync,
  getActionPlacement,
  findAssociatedButtonEntities,
  getMusicAssistantState,
  getSearchResultClickTitle,
  isMusicAssistantEntity,
  isValidArtworkUrl,
  getEntityName,
  areEntitiesPlayingSameMedia,
  isPlaceholderMediaTitle
} from "./yamp-utils.js";
import { localize, setHassLanguage } from "./localize/localize.js";


import {
  SUPPORT_VOLUME_MUTE,
  SUPPORT_TURN_ON,
  SUPPORT_TURN_OFF,
  SUPPORT_STOP,
  SUPPORT_GROUPING,
  DEFAULT_PROGRESS_BAR_HEIGHT,
  DEFAULT_LYRICS_BACKGROUND_FADE,
  getTemplatePresetDefaults,
  CANONICAL_MENU_OPTION_MAP,
} from "./constants.js";

const PLAYLIST_FETCH_LIMIT = 500;
const SUCCESS_MESSAGE_TIMEOUT_MS = 3000;

const ADAPTIVE_TEXT_TARGETS = Object.freeze(["details", "menu", "action_chips", "lyrics"]);
const DEFAULT_ADAPTIVE_TEXT_TARGETS = Object.freeze([...ADAPTIVE_TEXT_TARGETS]);
const ADAPTIVE_TEXT_VAR_MAP = Object.freeze({
  details: "--yamp-text-scale-details",
  menu: "--yamp-text-scale-menu",
  action_chips: "--yamp-text-scale-action-chips"
});


const GESTURE_HOLD_TIMEOUT = 500;
const GESTURE_MOVE_THRESHOLD = 15;
const GESTURE_DOUBLE_TAP_MAX_DELAY = 300;
const GESTURE_DOUBLE_TAP_IGNORE_NATIVE_DELAY = 500;
const GESTURE_TAP_DELAY = 300;
const GESTURE_SWIPE_THRESHOLD = 50;

window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === "yet-another-media-player")) {
  window.customCards.push({
    type: "yet-another-media-player",
    name: "Yet Another Media Player",
    description: "YAMP is a multi-entity media card with custom actions",
    preview: true,
    getEntitySuggestion: (hass, entityId) => {
      const domain = entityId.split(".")[0];
      if (domain !== "media_player") {
        return null;
      }
      return {
        config: { type: "custom:yet-another-media-player", entities: [entityId] },
      };
    },
  });
}

console.info(
  `%c YET-ANOTHER-MEDIA-PLAYER %c ${__VERSION__} `,
  "color: white; background: #ff9800; font-weight: bold; border-radius: 4px 0 0 4px; padding: 1px 5px;",
  "color: #ff9800; background: white; font-weight: bold; border-radius: 0 4px 4px 0; padding: 1px 5px; border: 1px solid #ff9800; border-left: none;"
);

export class YetAnotherMediaPlayerCard extends QueueDragMixin(LitElement) {

  _handleChipPointerDown(e, idx) {
    this._chipGestureStartX = e.clientX;
    this._chipGestureStartY = e.clientY;

    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerDown(e, idx);
    }
  }

  _applyIdleScreen() {
    if (this._cardType === "group_players") return;
    if (this._idleScreenApplied) return;
    const mode = this._idleScreen || "default";
    switch (mode) {
      case "search":
        this._showEntityOptions = true;
        this._showGrouping = false;
        this._showSourceList = false;
        this._showTransferQueue = false;
        this._showResolvedEntities = false;
        this._showSearchSheetInOptions("default");
        break;
      case "search-recently-played":
        this._showEntityOptions = true;
        this._showGrouping = false;
        this._showSourceList = false;
        this._showTransferQueue = false;
        this._showResolvedEntities = false;
        this._showSearchSheetInOptions("recently-played");
        break;
      case "search-next-up":
        this._showEntityOptions = true;
        this._showGrouping = false;
        this._showSourceList = false;
        this._showTransferQueue = false;
        this._showResolvedEntities = false;
        this._showSearchSheetInOptions("next-up");
        break;
      default:
        return;
    }
    this._idleScreenApplied = true;
  }

  _getSearchDismissBehavior() {
    const cardDismissSetting = this.config.dismiss_search_on_play !== false;
    const isSearchMode = this._cardType === "search";
    return {
      shouldDismiss: !isSearchMode && cardDismissSetting,
      shouldReset: isSearchMode && cardDismissSetting,
    };
  }

  _resetIdleScreen() {
    if (!this._idleScreenApplied) return;

    const { shouldDismiss, shouldReset } = this._getSearchDismissBehavior();

    switch (this._idleScreen) {
      case "search":
      case "search-recently-played":
      case "search-next-up":
        if (shouldDismiss) {
          this._hideSearchSheetInOptions();
          this._showEntityOptions = false;
        } else if (shouldReset) {
          this._showSearchSheetInOptions();
        } else {
          this._idleScreenApplied = false;
          return;
        }
        break;
      default:
        break;
    }
    this._idleScreenApplied = false;
    this.requestUpdate();
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

    // Rely on native @dblclick for mice/desktop. This manual tap logic is only needed for touch screens.
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;

    // Both @pointerup and @pointerleave trigger this method. We must ignore pointerleave to avoid fake double-clicks.
    if (e.type !== 'pointerup') return;

    const diffX = e.clientX - this._chipGestureStartX;
    const diffY = e.clientY - this._chipGestureStartY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    if (absDiffX > GESTURE_MOVE_THRESHOLD || absDiffY > GESTURE_MOVE_THRESHOLD) return;

    const now = Date.now();
    const timeSinceLastTap = now - (this._lastChipTapTime || 0);
    this._lastChipTapTime = now;

    if (timeSinceLastTap < GESTURE_DOUBLE_TAP_MAX_DELAY && this._lastChipTapIdx === idx) {
      this._lastChipTapTime = 0; // reset
      this._lastChipDoubleTapTime = now;
      this._quickGroupingMode = !this._quickGroupingMode;
      this.requestUpdate();
    }
    this._lastChipTapIdx = idx;
  }
  _lastChipDoubleTapTime = 0;
  _hoveredSourceLetterIndex = null;
  // Stores the last grouping master id for group chip selection
  _lastGroupingMasterId = null;
  _cardTriggers = { tap: null, hold: null, double_tap: null, swipe_left: null, swipe_right: null };
  _debouncedVolumeTimer = null;
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }

  _isGroupCapable(stateObj) {
    if (!stateObj) return false;
    if (stateObj.attributes?.mass_player_type === 'group') return false;
    if (this._supportsFeature(stateObj, SUPPORT_GROUPING)) return true;
    return Array.isArray(stateObj.attributes?.group_members);
  }

  // Returns true if entity is group-capable AND currently has members
  _isCurrentlyGrouped(stateObj) {
    if (!this._isGroupCapable(stateObj)) return false;
    return Array.isArray(stateObj?.attributes?.group_members) && stateObj.attributes.group_members.length > 1;
  }

  // Find button entities associated with a Music Assistant entity
  _findAssociatedButtonEntities(maEntityId) {
    return findAssociatedButtonEntities(this.hass, maEntityId);
  }

  /**
   * Cleans track/artist names for better matching with external APIs like LRCLIB.
   * Strips common suffixes like "- Remastered", "(feat. ...)", etc.
   */
  _cleanTrackMetadata(text) {
    return cleanTrackMetadata(text);
  }

  // Get the favorite button entity for the current Music Assistant entity
  _getFavoriteButtonEntity() {
    const obj = this.entityObjs[this._selectedIndex];
    if (!obj) return null;

    // Get the active entity (the one currently selected or playing)
    const activeEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
    if (!activeEntityId) return null;

    // Check if the active entity exists
    const activeState = this.hass?.states?.[activeEntityId];
    if (!activeState) {
      return null;
    }

    // Find a favorite button associated with this entity
    const buttonEntities = this._findAssociatedButtonEntities(activeEntityId);
    const favoriteButton = buttonEntities.find(btn =>
      btn.friendly_name.toLowerCase().includes('favorite') ||
      btn.friendly_name.toLowerCase().includes('like') ||
      btn.device_class === 'favorite' ||
      btn.entity_id.toLowerCase().includes('favorite')
    );
    return favoriteButton?.entity_id || null;
  }

  // Get the current Music Assistant state
  _getMusicAssistantState() {
    const activeEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
    if (!activeEntityId) return null;

    return getMusicAssistantState(this.hass, activeEntityId);
  }

  // Check if the currently playing track is favorited
  _isCurrentTrackFavorited() {
    const obj = this.entityObjs[this._selectedIndex];
    if (!obj) return false;

    // Get the Music Assistant state (either main entity or configured MA entity)
    const maState = this._getMusicAssistantState();
    if (!maState) return false;

    // Check favorite status
    const mediaContentId = maState.attributes?.media_content_id;
    if (!mediaContentId) return false;

    // Check if Music Assistant provides favorite status in entity attributes
    if (typeof maState.attributes?.is_favorite === 'boolean') {
      return maState.attributes.is_favorite;
    }

    // Use cached result if available
    if (this._favoriteStatusCache && this._favoriteStatusCache[mediaContentId] !== undefined) {
      const cached = this._favoriteStatusCache[mediaContentId];
      if (typeof cached === 'object' && cached.isFavorited !== undefined) {
        return cached.isFavorited;
      } else if (typeof cached === 'boolean') {
        return cached;
      }
    }

    // Query Music Assistant for favorite status asynchronously (only if not already checking)
    if (!this._checkingFavorites || this._checkingFavorites !== mediaContentId) {
      this._checkingFavorites = mediaContentId;
      this._checkFavoriteStatusAsync(mediaContentId);
    }

    // Return false initially, will update when async check completes
    return false;
  }

  // Asynchronously check favorite status and cache the result
  async _checkFavoriteStatusAsync(mediaContentId) {
    if (!mediaContentId || !this.hass) {
      return;
    }

    try {
      // Get the current Music Assistant entity ID
      const maState = this._getMusicAssistantState();
      const entityId = maState?.entity_id;

      const trackName = maState.attributes?.media_title;
      const artistName = maState.attributes?.media_artist;


      const limitToUse = Math.min(this._getSearchResultsLimit(), 10);
      const isFavorited = await isTrackFavorited(this.hass, mediaContentId, entityId, trackName, artistName, limitToUse);

      // Initialize cache if needed
      if (!this._favoriteStatusCache) {
        this._favoriteStatusCache = {};
      }

      // Cache the result
      this._favoriteStatusCache[mediaContentId] = {
        isFavorited
      };

      // Clear the checking flag
      this._checkingFavorites = null;

      // Trigger a re-render to update the heart icon
      this.requestUpdate();

    } catch (error) {
      this._checkingFavorites = null;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._isEditorPreviewCached = undefined;
    window.addEventListener("scroll", this._handleGlobalScroll, { passive: true });
    window.addEventListener("resize", this._handleViewportResize, { passive: true });
    if (this._handleKeyDownBound) {
      window.addEventListener("keydown", this._handleKeyDownBound);
    }
    if (this._handleVisibilityChangeBound) {
      document.addEventListener("visibilitychange", this._handleVisibilityChangeBound);
    }
    this._updateViewportFlags();
    this._updateAdaptiveTextObserverState();
    if (this._mediaSessionManager && this._isMediaSessionEnabled) {
      this._mediaSessionManager.attach();
    }
  }

  // Scroll to first source option starting with the given letter
  _scrollToSourceLetter(letter) {
    // Find the options sheet (source list) in the shadow DOM
    const menu = this.renderRoot.querySelector('.entity-options-sheet');
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('.entity-options-item'));
    const item = items.find(el =>
      (el.textContent || "").trim().toUpperCase().startsWith(letter)
    );
    if (item) item.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Show Stop button if supported and layout allows.
  _shouldShowStopButton(stateObj) {
    if (!this._supportsFeature(stateObj, SUPPORT_STOP)) return false;
    // Show if wide layout or few controls.
    const row = this.renderRoot?.querySelector('.controls-row');
    if (!row) return true; // Default to show if can't measure
    const minWide = row.offsetWidth > 480;
    const showFavorite = !!this._getFavoriteButtonEntity() && !this._getHiddenControlsForCurrentEntity().favorite;
    const controls = countMainControls(
      stateObj,
      (s, f) => this._supportsFeature(s, f),
      showFavorite,
      this._getHiddenControlsForCurrentEntity(),
      true,
      this._controlLayout
    );
    // Limit Stop visibility on compact layouts.
    return minWide || controls <= 5;
  }
  _isAutoSelectDisabled(idx) {
    const conf = this.config.entities[idx];
    return typeof conf === "string" ? false : !!conf.disable_auto_select;
  }

  get sortedEntityIds() {
    const idList = this.entityIds;
    // Map with metadata for O(n log n) sorting
    const meta = idList.map((id, idx) => {
      const disabled = this._isAutoSelectDisabled(idx);
      const ts = disabled ? 0 : (this._playTimestamps[id] || 0);
      return { id, idx, ts, disabled };
    });

    return meta
      .sort((a, b) => {
        // Disabled entities always sort to the end
        if (a.disabled !== b.disabled) return a.disabled ? 1 : -1;
        if (a.ts === b.ts) return a.idx - b.idx;
        return b.ts - a.ts;
      })
      .map(m => m.id);
  }

  // Return array of groups, ordered by most recent play
  get groupedSortedEntityIds() {
    const idList = this.entityIds;
    if (!idList || !Array.isArray(idList)) return [];

    const idSet = new Set(idList);
    const map = {};
    for (let i = 0; i < idList.length; i++) {
      const id = idList[i];
      let key = this._getGroupKey(id);
      if (this._quickGroupingMode || !idSet.has(key)) {
        key = id;
      }

      if (!map[key]) map[key] = { ids: [], ts: 0, minIdx: i, allDisabled: true };
      map[key].ids.push(id);

      const disabled = this._isAutoSelectDisabled(i);
      const effectiveTs = disabled ? 0 : (this._playTimestamps[id] || 0);

      if (!disabled) map[key].allDisabled = false;
      map[key].ts = Math.max(map[key].ts, effectiveTs);
    }
    const result = Object.values(map)
      .sort((a, b) => {
        // Groups where all members are disabled sort to the end
        if (a.allDisabled !== b.allDisabled) return a.allDisabled - b.allDisabled;
        if (b.ts === a.ts) return a.minIdx - b.minIdx;
        return b.ts - a.ts;
      })   // sort groups by recency
      .map(g => g.ids.sort());       // sort ids alphabetically inside each group

    return result;
  }
  static properties = {
    _aspectRatioCache: { state: true },
    _quickGroupingMode: { state: true },
    hass: {},
    config: {},
    _selectedIndex: { state: true },
    _lastPlaying: { state: true },
    _shouldDropdownOpenUp: { state: true },
    _pinnedIndex: { state: true },
    _showSourceList: { state: true },
    _holdToPin: { state: true },
    _showQueueSuccessMessage: { state: true },
    _searchActiveOptionsItem: { state: true },
    _activeSearchRowMenuId: { state: true },
    _loadingSearchRowMenuId: { state: true },
    _errorSearchRowMenuId: { state: true },
    _successSearchRowMenuId: { state: true },
    _successSearchRowType: { state: true },
    _radioModeActive: { state: true },
    _showEntityOptions: { state: true },
    _showGrouping: { state: true },
    _showRemoteControl: { state: true },
    _showTransferQueue: { state: true },
    _queueOpsTotal: { state: true },
    _queueOpsCompleted: { state: true },
    _showResolvedEntities: { state: true },
    _showSearchInSheet: { state: true },
    _addToPlaylistTarget: { state: true },
    _showMediaTitleOptions: { state: true },
    _dismissMenuAfterPlaylistAdd: { state: false },
    _lyricsActive: { state: true },
    _massLyrics: { state: true },
    _fetchingLyrics: { state: true },
    _lyricsError: { state: true },
    _lastLyricsTrackId: { state: true },
    _lastLyricsEntityId: { state: true },
    _showSourceMenu: { state: true },
    _volumeDraggingEntity: { state: true },
    _dragVolume: { state: true },
    _mediaSessionOverride: { state: true },
    _fullScreenOverride: { state: true },
    _renderTick: { state: true }
  };

  static styles = yampCardStyles;

  /**
   * Handles tab/browser visibility changes to pause background timers when hidden.
   */
  _handleVisibilityChange() {
    if (typeof document !== "undefined" && document.hidden) {
      if (this._progressTimer) {
        clearInterval(this._progressTimer);
        this._progressTimer = null;
      }
    } else {
      this.requestUpdate();
    }
  }

  /**
   * Forces a re-render safely, ensuring it isn't swallowed by shouldUpdate
   * if batched in the same microtask as an irrelevant 'hass' update.
   */
  triggerRender() {
    this._renderTick = Date.now();
  }

  /**
   * Lit lifecycle hook: determines whether the element should re-render.
   * Filters out high-frequency Home Assistant entity updates unrelated to YAMP.
   * @param {Map<string | number | symbol, unknown>} changedProps
   * @returns {boolean}
   */
  shouldUpdate(changedProps) {
    // If the document is completely hidden (e.g. tablet screen off, background tab),
    // skip DOM re-renders to save RAM and CPU.
    if (typeof document !== "undefined" && document.hidden) {
      return false;
    }

    // Always update if anything other than 'hass' changed
    if (!changedProps.has("hass") || changedProps.size > 1) {
      return true;
    }

    const oldHass = /** @type {any} */ (changedProps.get("hass"));
    if (!oldHass || !this.hass) {
      return true;
    }

    // Always update in editor preview for maximum responsiveness
    if (this._isEditorPreview) {
      return true;
    }

    // Check themes, dark mode, language, locale
    if (
      this.hass.themes !== oldHass.themes ||
      this.hass.darkMode !== oldHass.darkMode ||
      this.hass.language !== oldHass.language ||
      this.hass.selectedLanguage !== oldHass.selectedLanguage ||
      this.hass.locale !== oldHass.locale
    ) {
      return true;
    }

    // Check if any overlay, sheet, or menu is active
    if (
      this._showEntityOptions ||
      this._showSearchInSheet ||
      this._showTransferQueue ||
      this._showGrouping ||
      this._showRemoteControl ||
      this._showSourceList ||
      this._lyricsActive
    ) {
      return true;
    }

    const currentStates = this.hass.states;
    const oldStates = oldHass.states;
    if (!currentStates || !oldStates) {
      return true;
    }

    // Check all configured media player entities
    const entityIds = this.entityIds;
    for (let i = 0; i < entityIds.length; i++) {
      const id = entityIds[i];
      if (currentStates[id] !== oldStates[id]) {
        this._cachedEntityObjs = null;
        return true;
      }
      // Check group members if present
      const members = currentStates[id]?.attributes?.group_members;
      if (Array.isArray(members)) {
        for (let j = 0; j < members.length; j++) {
          const mId = members[j];
          if (currentStates[mId] !== oldStates[mId]) {
            this._cachedEntityObjs = null;
            return true;
          }
        }
      }
    }

    // Check resolved companion entities (MA, Volume, Remote)
    if (this._templateController) {
      const checkCache = (cache) => {
        if (!cache) return false;
        for (const k in cache) {
          const id = cache[k]?.value || cache[k]?.id;
          if (typeof id === "string" && id.includes(".") && currentStates[id] !== oldStates[id]) {
            return true;
          }
        }
        return false;
      };

      if (
        checkCache(this._maResolveCache) ||
        checkCache(this._volResolveCache) ||
        checkCache(this._remoteResolveCache)
      ) {
        return true;
      }
    }

    // Check action helper entities (sync_selected_entity, select_entity, etc.)
    if (this._actionHelperEntities) {
      for (let i = 0; i < this._actionHelperEntities.length; i++) {
        const id = this._actionHelperEntities[i];
        if (currentStates[id] !== oldStates[id]) {
          return true;
        }
      }
    }

    // Check external entities referenced in client-side JS templates
    if (this._jsTemplateEntities) {
      for (let i = 0; i < this._jsTemplateEntities.length; i++) {
        const id = this._jsTemplateEntities[i];
        if (currentStates[id] !== oldStates[id]) {
          return true;
        }
      }
    }

    // No relevant entities or settings changed - skip re-render!
    return false;
  }

  get _controlLayout() {
    const raw = this.config?.control_layout;
    let val = raw;
    if (typeof raw === 'string' && (raw.includes('{{') || raw.includes('{%') || raw.trim().startsWith('[[['))) {
      const resolved = this._controlLayoutResolveCache?.['card']?.value;
      if (resolved !== undefined && resolved !== null && resolved !== "") {
        val = resolved;
      } else {
        return "classic"; // Default until template resolves
      }
    }
    const layoutPref = typeof val === "string" ? val.trim().toLowerCase() : "classic";
    return layoutPref === "modern" ? "modern" : "classic";
  }

  get _cardHeight() {
    const raw = this.config?.card_height;
    if (typeof raw === 'string' && (raw.includes('{{') || raw.includes('{%') || raw.trim().startsWith('[[['))) {
      let resolved = this._cardHeightResolveCache?.['card']?.value;
      
      // Fallback for synchronous client-side JS template evaluation if not yet in cache
      if (resolved === undefined && raw.trim().startsWith('[[[')) {
        try {
           resolved = resolveStringTemplateSync(this.hass, raw, this._getTemplateContext());
        } catch(e) {
           // Ignore sync evaluation error
        }
      }
      
      if (resolved !== undefined && resolved !== null && resolved !== "") {
        return resolved;
      }
      return null;
    }
    return raw;
  }

  get _alwaysCollapsed() {
    if (this._isFullScreen) {
      return false;
    }
    const raw = this.config?.always_collapsed;
    if (typeof raw === 'string' && (raw.includes('{{') || raw.includes('{%') || raw.trim().startsWith('[[['))) {
      const resolved = this._alwaysCollapsedResolveCache?.['card']?.value;
      if (resolved !== undefined && resolved !== null && resolved !== "") {
        // If JS template evaluated to boolean, handle it
        if (typeof resolved === 'boolean') return resolved;

        const lower = String(resolved).trim().toLowerCase();
        return lower === "true" || lower === "1" || lower === "on" || lower === "yes";
      }
      return false; // Default until template resolves
    }
    return !!raw;
  }

  get _lyricsBackgroundFade() {
    const raw = this.config?.lyrics_background_fade;
    if (typeof raw === "string" && (raw.includes("{{") || raw.includes("{%") || raw.trim().startsWith("[[["))) {
      let resolved = this._lyricsBackgroundFadeResolveCache?.["card"]?.value;
      if (resolved === undefined && raw.trim().startsWith("[[[")) {
        try {
          resolved = resolveStringTemplateSync(this.hass, raw, this._getTemplateContext());
        } catch (e) {
          // Ignore sync evaluation error
        }
      }
      if (resolved !== undefined && resolved !== null && resolved !== "") {
        const num = Number(resolved);
        return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : DEFAULT_LYRICS_BACKGROUND_FADE;
      }
      return DEFAULT_LYRICS_BACKGROUND_FADE;
    }
    if (raw === undefined || raw === null || raw === "") return DEFAULT_LYRICS_BACKGROUND_FADE;
    const num = Number(raw);
    return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : DEFAULT_LYRICS_BACKGROUND_FADE;
  }

  _getLyricsBackgroundFade() {
    return this._lyricsBackgroundFade;
  }

  get _artworkGradientDisabled() {
    return this.config?.disable_artwork_gradient === true;
  }

  get _artworkObjectFit() {
    const fit = this._baseArtworkObjectFit || "cover";
    if (fit === "scaled-contain-alternate" && this._alwaysCollapsed) {
      return "scaled-contain";
    }
    return fit;
  }

  get _cardType() {
    let type = this.config?.card_type;
    if (!type && this.config?.template) {
      type = getTemplatePresetDefaults(this.config.template)?.card_type;
    }
    type = type || "default";
    if (
      type === "group_players" ||
      type === "group-players" ||
      type === "speakers_and_groups" ||
      type === "speakers-and-groups" ||
      type === "speakers" ||
      type === "dedicated_grouping" ||
      type === "dedicated-grouping" ||
      type === "dedicated_speakers_and_groups" ||
      type === "dedicated-speakers-and-groups" ||
      type === "transfer_queue" ||
      type === "transfer-queue"
    ) {
      return "group_players";
    }
    if (type === "dedicated_search") {
      return "search";
    }
    return type;
  }

  get _isSpecializedCard() {
    return this._cardType !== "default";
  }

  get _isEditorPreview() {
    if (this._isEditorPreviewCached !== undefined) {
      return this._isEditorPreviewCached;
    }
    if (this.preview === true) {
      return (this._isEditorPreviewCached = true);
    }
    if (!this.isConnected) {
      return false;
    }
    const isPreview = Boolean(
      (typeof this.closest === "function" && this.closest("hui-card-preview")) ||
      (this.parentElement && this.parentElement.tagName && this.parentElement.tagName.toLowerCase() === "hui-card-preview") ||
      (this.getRootNode && this.getRootNode()?.host?.closest?.("hui-card-preview")) ||
      (this.getRootNode && this.getRootNode()?.host?.parentElement?.tagName?.toLowerCase() === "hui-card-preview")
    );
    this._isEditorPreviewCached = isPreview;
    return isPreview;
  }

  get _lockScreenControls() {
    const raw = this.config?.lock_screen_controls;
    if (typeof raw === 'string' && (raw.includes('{{') || raw.includes('{%') || raw.trim().startsWith('[[['))) {
      const resolved = this._lockScreenControlsResolveCache?.['card']?.value;
      if (resolved !== undefined && resolved !== null && resolved !== "") {
        if (typeof resolved === 'boolean') return resolved;
        const lower = String(resolved).trim().toLowerCase();
        return lower === "true" || lower === "1" || lower === "on" || lower === "yes";
      }
      return false; // Default until template resolves
    }
    return raw === true;
  }

  get _isMediaSessionEnabled() {
    if (this._isEditorPreview) {
      return false;
    }
    if (this._mediaSessionOverride !== null) {
      return this._mediaSessionOverride;
    }
    return this._lockScreenControls;
  }

  get _fullScreenConfig() {
    const raw = this.config?.full_screen;
    if (typeof raw === "string" && (raw.includes("{{") || raw.includes("{%") || raw.trim().startsWith("[[["))) {
      const resolved = this._fullScreenResolveCache?.["card"]?.value;
      if (resolved !== undefined && resolved !== null && resolved !== "") {
        if (typeof resolved === "boolean") return resolved;
        const lower = String(resolved).trim().toLowerCase();
        return lower === "true" || lower === "1" || lower === "on" || lower === "yes";
      }
      return false; // Default until template resolves
    }
    return raw === true;
  }

  get _isFullScreen() {
    if (this._isEditorPreview) {
      return false;
    }
    if (this._fullScreenOverride !== null) {
      return this._fullScreenOverride;
    }
    return this._fullScreenConfig;
  }

  constructor() {
    super();
    /** @type {boolean | null} */
    this._fullScreenOverride = null;
    this._handleKeyDownBound = this._handleKeyDown.bind(this);
    this._handleVisibilityChangeBound = this._handleVisibilityChange.bind(this);
    /** @type {string[] | null} */
    this._cachedEntityIds = null;
    /** @type {any[] | null} */
    this._cachedEntityObjs = null;
    /** @type {string[] | null} */
    this._actionHelperEntities = null;
    /** @type {string[] | null} */
    this._jsTemplateEntities = null;
    this._mediaSessionOverride = null;
    this._mediaSessionUpdatePending = false;
    this._mediaSessionManager = new YampMediaSessionManager(this);
    this._mediaSessionManager.onReadyChange = () => {
      if (this._isMediaSessionEnabled && !this._isEditorPreview) {
        if (!this._mediaSessionUpdatePending) {
          this._mediaSessionUpdatePending = true;
          this._mediaSessionUpdateTimer = setTimeout(() => {
            this._mediaSessionUpdateTimer = null;
            this._mediaSessionUpdatePending = false;
            if (this._isMediaSessionEnabled && !this._isEditorPreview) {
              this.requestUpdate();
            }
          }, 50);
        }
      }
    };
    this._selectedIndex = 0;
    this._lastSyncedEntityId = null;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._lastActiveEntityId = null;
    this._playTimestamps = {};
    this._lastMediaTitle = null;
    this._showSourceMenu = false;
    this._shouldDropdownOpenUp = false;
    this._collapsedArtDominantColor = "#444";
    this._lastArtworkUrl = null;
    this._aspectRatioCache = {};
    this._addToPlaylistTarget = null;
    // Timer for progress updates
    this._progressTimer = null;
    this._progressValue = null;
    this._lastProgressEntityId = null;
    this._pinnedIndex = null;
    // Accent color, updated in setConfig
    // Outside click handler for source dropdown
    this._sourceDropdownOutsideHandler = null;
    this._isIdle = false;
    this._idleTimeout = null;
    // Overlay state for entity options
    this._showEntityOptions = false;
    this._showMediaTitleOptions = false;
    this._dismissMenuAfterPlaylistAdd = false;
    // Overlay state for grouping sheet
    this._showGrouping = false;
    // Overlay state for source list sheet
    this._showSourceList = false;
    // Queue state & controller
    /** @type {QueueController} */
    this._queueController = new QueueController(this);
    // Overlay state for transfer queue sheet
    this._showTransferQueue = false;
    this._showRemoteControl = false;
    this._cardHeightTemplateValue = {};
    this._cardHeightResolveCache = {};
    this._lyricsBackgroundFadeTemplateValue = {};
    this._lyricsBackgroundFadeResolveCache = {};
    this._lockScreenControlsTemplateValue = {};
    this._lockScreenControlsResolveCache = {};
    this._fullScreenTemplateValue = {};
    this._fullScreenResolveCache = {};
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    this._hasTransferQueueForCurrent = false;
    this._transferQueueAutoCloseTimer = null;
    // Alternate progress‑bar mode
    this._alternateProgressBar = false;
    this._lastSpacerRendered = true;
    this._lastVolumeRendered = true;
    // Group base volume for group gain logic
    this._groupBaseVolume = null;
    // Search sheet state variables
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchResults = [];
    this._searchDisplaySortOverride = null;
    this._searchError = "";
    this._searchTotalRows = 15;  // minimum 15 rows for layout padding
    // Cache search results by media type for better performance
    this._searchResultsByType = {}; // { mediaType: results[] }
    // Track the current search query for cache invalidation
    this._currentSearchQuery = "";
    this._latestSearchToken = 0;
    this._latestManualShiftTime = 0;
    this._searchTimeoutHandle = null;
    this._swapPauseForStop = false;
    this._controlLayoutTemplateValue = {};
    this._controlLayoutResolveCache = {};
    // Search hierarchy tracking
    this._searchHierarchy = []; // Array of {type: 'artist'|'album', name: string, query: string}
    this._searchBreadcrumb = ""; // Display string for current search context
    // Per-chip linger map to keep MA entity selected briefly after pause
    this._playbackLingerByIdx = {};
    // Track the last resolved entity for each chip to provide "sticky" selection and prevent flickers
    this._lastResolvedEntityIdByChip = {};
    // Track manual active entity overrides selected via More Info sheet
    this._manualActiveEntityByChip = {};
    // Show search-in-sheet flag for entity options sheet
    this._showSearchInSheet = false;
    this._searchHeadersRetracted = false;
    this._searchHeaderOffset = 0;
    this._searchHeaderNaturalHeight = 0;
    this._lastSearchResultsScrollTop = 0;
    this._showResolvedEntities = false;
    // Queue success message
    this._showQueueSuccessMessage = false;
    this._searchActiveOptionsItem = null;
    this._volumeDraggingEntity = null;
    this._dragVolume = 0;
    this._activeSearchRowMenuId = null;
    this._loadingSearchRowMenuId = null;
    this._errorSearchRowMenuId = null;
    this._successSearchRowMenuId = null;
    this._successSearchRowType = null;
    // Search filter toggles
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._recommendationsFilterActive = false;
    this._radioModeActive = false;
    // mass_queue availability tracking
    this._massQueueAvailable = false;
    this._hasMassQueueIntegration = null;
    this._checkingMassQueueIntegration = false;
    this._aiRadioShowsAvailable = false;
    this._lyricsCache = new Map();
    // Quick-dismiss mode for action-triggered menu items
    this._quickMenuInvoke = false;
    // Track collapsed layout height for idle mode
    this._collapsedBaselineHeight = 220;
    this._lastRenderedCollapsed = false;
    this._lastRenderedHideControls = false;
    this._baseArtworkObjectFit = "cover";
    this._idleScreen = "default";
    this._idleScreenApplied = false;
    this._hasSeenPlayback = false;
    this._adaptiveText = false;
    this._textResizeObserver = null;
    this._currentTextScale = null;
    this._adaptiveTextTargets = new Set();
    this._idleImageTemplate = null;
    this._idleImageTemplateResult = "";
    this._resolvingIdleImageTemplate = false;
    this._idleImageTemplateNeedsResolve = false;
    this._backgroundImageTemplate = null;
    this._backgroundImageTemplateResult = "";
    this._resolvingBackgroundImageTemplate = false;
    this._backgroundImageTemplateNeedsResolve = false;
    this._fontColorTemplate = null;
    this._fontColorTemplateResult = "";
    this._resolvingFontColorTemplate = false;
    this._fontColorTemplateNeedsResolve = false;
    // Artwork controller
    /** @type {ArtworkController} */
    this._artworkController = new ArtworkController(this);
    this._artworkOverrideTemplateCache = this._artworkController.artworkOverrideTemplateCache;
    this._artworkOverrideIndexMap = this._artworkController.artworkOverrideIndexMap;
    this._hideActiveEntityLabel = false;
    this._hideActiveEntityLabelOnIdle = false;
    this._currentDetailsScale = null;
    this._lastNonLyricsLowerContentHeight = null;
    this._lowerControlsHeight = null;

    // Lyrics state & controller
    /** @type {LyricsController} */
    this._lyricsController = new LyricsController(this);
    this._lyricsCache = this._lyricsController.cache;
    this._massLyrics = []; // Array of parsed lyric objects { time, text }
    this._lastLyricsTrackId = null; // Track ID of currently loaded lyrics
    this._lastLyricsArtist = null; // Artist of currently loaded lyrics
    this._lastLyricsTitle = null; // Title of currently loaded lyrics
    this._lastLyricsEntityId = null; // Entity ID of currently loaded lyrics
    this._lyricsActive = false; // Is the lyrics view open?
    this._fetchingLyrics = false;
    this._fetchingCacheKey = null;
    this._lyricsError = false;
    this._suspendAdaptiveScaling = false;
    this._pendingAdaptiveScaleUpdate = false;
    this._adaptiveScrollTimer = null;
    this._marqueeSequentialTimer = null;
    this._marqueeAnimationEndHandler = null;
    this._marqueeObservedElements = null;
    this._lastMarqueeKey = null;
    this._marqueeCleanups = [];
    this._marqueeManualResetTimers = new Map();
    this._suppressMarqueeClick = false;
    this._suppressMarqueeClickTimer = null;
    this._lyricsFetchTimeout = null;
    this._handleGlobalScroll = this._handleGlobalScroll.bind(this);
    this._handleViewportResize = this._handleViewportResize.bind(this);
    this._isNarrowViewport = false;
    this._lastIsMobile = false;

    // Collapse on load if nothing is playing (but respect linger state and idle_timeout_ms)
    // In specialized card modes, skip idle and auto-open dedicated view
    setTimeout(() => {
      if (this._cardType === "search") {
        // Dedicated search mode: auto-open search as the primary view
        this._showEntityOptions = true;
        this._setIdleState(false);
        this._showSearchSheetInOptions();
        this.requestUpdate();
        return;
      }
      if (this._cardType === "up_next") {
        // Dedicated up next mode: auto-open search filtered to up next
        this._showEntityOptions = true;
        this._setIdleState(false);
        this._showSearchSheetInOptions("next-up");
        this.requestUpdate();
        return;
      }
      if (this._cardType === "remote_control") {
        // Dedicated remote control mode
        this._showEntityOptions = true;
        this._showRemoteControl = true;
        this._setIdleState(false);
        this.requestUpdate();
        return;
      }
      if (this._cardType === "group_players") {
        // Dedicated group players mode: auto-open grouping as the primary view
        this._showEntityOptions = true;
        this._setIdleState(false);
        this._showGrouping = true;
        this.requestUpdate();
        return;
      }
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        // Don't go idle if there's an active linger or if idle_timeout_ms is 0
        const hasActiveLinger = this._playbackLingerByIdx?.[this._selectedIndex] &&
          this._playbackLingerByIdx[this._selectedIndex].until > Date.now();
        const isAnyUnrestrictedPlaying = this.entityIds.some((id, idx) => {
          if (this._isAutoSelectDisabled(idx)) return false;
          const stateObj = this.hass.states[id];
          return this._isEntityPlaying(stateObj);
        });
        const isCurrentDisabled = this._isAutoSelectDisabled(this._selectedIndex);
        const isCurrentPlaying = this._isEntityPlaying(stateObj) && (!isCurrentDisabled || this._manualSelect);

        if (stateObj && !isCurrentPlaying && !isAnyUnrestrictedPlaying && !hasActiveLinger && this._idleTimeoutMs > 0) {
          this._setIdleState(true);
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
    this._keepFiltersOnSearch = false;
    // Track last search chip classes for filter chip row scroll
    this._lastSearchChipClasses = "";
    // --- swipe‑to‑filter helpers ---
    this._swipeStartX = null;
    this._searchSwipeAttached = false;
    // Snapshot of entities that were playing when manual‑select started.
    this._manualSelectPlayingSet = null;
    this._idleTimeoutMs = 60000;
    this._volumeStep = 0.05;
    this._searchInputAutoFocused = false;
    this._disableSearchAutofocus = false;
    // Optimistic playback state after control clicks
    this._optimisticPlayback = null;
    // Debounce entity switching to prevent rapid state changes
    this._lastPlaybackEntityId = null;
    this._entitySwitchDebounceTimer = null;
    // Track previous states to detect transitions
    this._lastMainState = null;
    this._lastMaState = null;
    // Initialize TemplateController for Jinja WS subscriptions and JS template evaluation
    /** @type {TemplateController} */
    this._templateController = new TemplateController(this);
    this._templateSubscriptions = this._templateController.templateSubscriptions;
    this._activeSubscriptionTokens = this._templateController.activeSubscriptionTokens;
    this._maTemplateValues = this._templateController.maTemplateValues;
    this._volTemplateValues = this._templateController.volTemplateValues;
    this._remoteTemplateValues = this._templateController.remoteTemplateValues;
    this._actionInMenuTemplateValues = this._templateController.actionInMenuTemplateValues;
    this._actionInMenuResolveCache = this._templateController.actionInMenuResolveCache;
    this._alwaysCollapsedTemplateValue = this._templateController.alwaysCollapsedTemplateValue;
    this._alwaysCollapsedResolveCache = this._templateController.alwaysCollapsedResolveCache;
    this._hiddenControlsTemplateValues = this._templateController.hiddenControlsTemplateValues;
    this._hiddenControlsResolveCache = this._templateController.hiddenControlsResolveCache;
    this._controlLayoutTemplateValue = this._templateController.controlLayoutTemplateValue;
    this._controlLayoutResolveCache = this._templateController.controlLayoutResolveCache;
    this._cardHeightTemplateValue = this._templateController.cardHeightTemplateValue;
    this._cardHeightResolveCache = this._templateController.cardHeightResolveCache;
    this._lyricsBackgroundFadeTemplateValue = this._templateController.lyricsBackgroundFadeTemplateValue;
    this._lyricsBackgroundFadeResolveCache = this._templateController.lyricsBackgroundFadeResolveCache;
    this._lockScreenControlsTemplateValue = this._templateController.lockScreenControlsTemplateValue;
    this._lockScreenControlsResolveCache = this._templateController.lockScreenControlsResolveCache;
    this._fullScreenTemplateValue = this._templateController.fullScreenTemplateValue;
    this._fullScreenResolveCache = this._templateController.fullScreenResolveCache;
    this._maResolveCache = this._templateController.maResolveCache;
    this._volResolveCache = this._templateController.volResolveCache;
    this._remoteResolveCache = this._templateController.remoteResolveCache;
    this._compiledJsTemplates = this._templateController.compiledJsTemplates;
    this._maResolveTtlMs = 7000; // refresh every ~7s
    // Manual select timeout for hold-to-pin functionality
    this._manualSelectTimeout = null;
    this._lastActionEntityId = null;
    this._volResolveTtlMs = 7000; // Used for static caching now
    // Track the last entity that was playing for better pause/resume behavior
    this._lastPlayingEntityId = null;
    // Control focus lock to prefer most-recently controlled entity in brief paused window
    this._controlFocusEntityId = null;
    // Track the last active entity per chip index for intra-chip persistence
    this._lastActiveEntityIdByChip = {};
    // Track manual active entity overrides selected via More Info sheet
    this._manualActiveEntityByChip = {};
    // Cache for detecting entity state transitions (playing -> stopped)
    this._playerStateCache = {};
    this._volumeOverlayActive = false;
    this._volumeOverlayValue = 0;
    this._volumeOverlayTimer = null;
    this._internalVolumeSuppressTimer = null;
    this._lastTrackedVolumeLevel = null;
    this._lastTrackedVolEntityId = null;
    this._volumeOverlayMuted = false;
    this._internalVolumeChangeFlag = false;
    this._showVolumeOverlay = false;
    this._queueOperationPromise = Promise.resolve();
    this._queueOpsTotal = 0;
    this._queueOpsCompleted = 0;
    this._queueOpsTimeout = null;
  }

  // Template Controller Delegations
  _subscribeToTemplate(idx, type, templateString) {
    return this._templateController.subscribeToTemplate(idx, type, templateString);
  }

  _unsubscribeFromTemplate(idx, type) {
    return this._templateController.unsubscribeFromTemplate(idx, type);
  }

  _ensureResolvedTemplateForIndex(idx, typeKey, rawValue, cacheObj, templateValsObj, options = {}) {
    return this._templateController.ensureResolvedTemplateForIndex(
      idx,
      typeKey,
      rawValue,
      options,
      cacheObj,
      templateValsObj
    );
  }

  _ensureResolvedMaForIndex(idx) {
    return this._templateController.ensureResolvedMaForIndex(idx);
  }

  _ensureResolvedVolForIndex(idx) {
    return this._templateController.ensureResolvedVolForIndex(idx);
  }

  _ensureResolvedRemoteForIndex(idx) {
    return this._templateController.ensureResolvedRemoteForIndex(idx);
  }

  _ensureResolvedHiddenControlsForIndex(idx) {
    return this._templateController.ensureResolvedHiddenControlsForIndex(idx);
  }

  _evaluateJsTemplate(templateStr) {
    return this._templateController.evaluateJsTemplate(templateStr);
  }

  _syncTemplateSubscriptions(type, currentContext, rawConfigData) {
    return this._templateController.syncTemplateSubscriptions(type, currentContext, rawConfigData);
  }

  _syncEntityTemplateSubscriptions(typeKey, currentContext) {
    return this._templateController.syncEntityTemplateSubscriptions(typeKey, currentContext);
  }

  // Get the resolved playback entity id for a chip index, preferring cache
  _getResolvedPlaybackEntityIdSync(idx) {
    return this._getEntityForPurpose(idx, 'playback_control');
  }

  // Get the resolved volume entity id for a chip index, preferring cache
  _getResolvedVolumeEntityIdSync(idx) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;

    // If follow_active_volume is enabled, return the active playback entity
    if (obj.follow_active_volume) {
      return this._getActivePlaybackEntityId();
    }

    const cached = this._volResolveCache?.[idx]?.id;
    if (cached && typeof cached === 'string') return cached;
    const raw = obj.volume_entity;
    if (raw && typeof raw === 'string') {
      const looksTemplate = raw.includes('{{') || raw.includes('{%') || raw.trim().startsWith('[[[');
      if (!looksTemplate) return raw;
    }
    return obj.entity_id;
  }

  // Get the actual resolved MA entity for state detection (can be unconfigured entities)
  _getActualResolvedMaEntityForState(idx) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;

    let candidateMaId = null;
    const cached = this._maResolveCache?.[idx]?.id;
    if (cached && typeof cached === 'string') {
      candidateMaId = cached;
    } else {
      // No cache - check if we have a static MA entity
      const rawMaEntity = obj.music_assistant_entity;
      if (
        rawMaEntity &&
        typeof rawMaEntity === 'string' &&
        !rawMaEntity.includes('{{') &&
        !rawMaEntity.includes('{%') &&
        !rawMaEntity.trim().startsWith('[[[')
      ) {
        candidateMaId = rawMaEntity;
      }
    }

    const mainId = obj.entity_id;
    if (!candidateMaId || candidateMaId === mainId) {
      return mainId;
    }

    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    const candidateState = candidateMaId ? this.hass?.states?.[candidateMaId] : null;

    const mainIsMa = mainState ? isMusicAssistantEntity(mainState) : false;
    const candidateIsMa = candidateState ? isMusicAssistantEntity(candidateState) : false;

    // If main entity is a Music Assistant player, but configured candidate is NOT,
    // prefer the actual Music Assistant player (mainId).
    if (mainIsMa && !candidateIsMa) {
      return mainId;
    }

    // If both are Music Assistant entities, prioritize the one with an active queue or playing
    if (mainIsMa && candidateIsMa) {
      const mainHasQueue = Boolean(mainState?.attributes?.active_queue);
      const candHasQueue = Boolean(candidateState?.attributes?.active_queue);
      if (mainHasQueue && !candHasQueue) {
        return mainId;
      }
      if (candHasQueue && !mainHasQueue) {
        return candidateMaId;
      }
      if (this._isEntityPlaying?.(mainState) && !this._isEntityPlaying?.(candidateState)) {
        return mainId;
      }
    }

    return candidateMaId;
  }

  _isEntityPlaying(stateObj) {
    if (!stateObj) return false;
    const s = stateObj.state?.toLowerCase();
    return s === "playing" || s === "buffering";
  }

  // Check if the currently selected entity (or its MA equivalent) is playing
  _isCurrentEntityPlaying() {
    const mainId = this.currentEntityId;
    const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    const maState = maId ? this.hass?.states?.[maId] : null;

    return this._isEntityPlaying(mainState) || this._isEntityPlaying(maState);
  }

  // Resolve template at action time with fallback to main entity (async)
  async _resolveTemplateAtActionTime(templateString, fallbackEntityId) {
    return resolveTemplateAtActionTime(this.hass, templateString, fallbackEntityId);
  }

  /**
   * Attach horizontal swipe on the search‑results area to cycle media‑class filters.
   */
  _attachSearchSwipe() {
    if (this._searchSwipeAttached) return;
    const area = this.renderRoot.querySelector('.entity-options-search-results');
    if (!area) return;

    // Disable swipe-to-filter when in a hierarchy (artist -> albums -> tracks)
    if (this._searchHierarchy.length > 0) {
      return;
    }

    this._searchSwipeAttached = true;

    const threshold = 40;  // px needed to trigger change

    const touchstartHandler = e => {
      if (e.touches.length === 1) {
        this._swipeStartX = e.touches[0].clientX;
      }
    };

    const touchendHandler = e => {
      if (this._swipeStartX === null) return;
      const endX = (e.changedTouches && e.changedTouches[0].clientX) || null;
      if (endX === null) { this._swipeStartX = null; return; }
      const dx = endX - this._swipeStartX;
      if (Math.abs(dx) > threshold) {
        // Get all available media classes from cached results
        const allClasses = new Set();
        Object.values(this._searchResultsByType).forEach(results => {
          results.forEach(item => {
            if (item.media_class) allClasses.add(item.media_class);
          });
        });
        const currEntityObj = this.entityObjs?.[this._selectedIndex] || null;
        const hiddenSet = new Set(currEntityObj?.hidden_filter_chips || []);
        const classes = Array.from(allClasses).filter(c => !hiddenSet.has(c));
        const filterOrder = ['all', ...classes];
        const currIdx = filterOrder.indexOf(this._searchMediaClassFilter || 'all');
        const dir = dx < 0 ? 1 : -1;   // swipe left -> next, right -> prev
        let nextIdx = (currIdx + dir + filterOrder.length) % filterOrder.length;
        const nextFilter = filterOrder[nextIdx];
        this._doSearch(nextFilter === 'all' ? null : nextFilter);
      }
      this._swipeStartX = null;
    };

    area.addEventListener('touchstart', touchstartHandler, { passive: true });
    area.addEventListener('touchend', touchendHandler, { passive: true });

    // Store handlers for cleanup
    area._searchSwipeHandlers = {
      touchstart: touchstartHandler,
      touchend: touchendHandler
    };
  }

  _getMockItemFromCurrentTrack() {
    const stateObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (!stateObj || !stateObj.attributes || !stateObj.attributes.media_title) return null;

    return {
      title: stateObj.attributes.media_title,
      media_title: stateObj.attributes.media_title,
      media_content_id: stateObj.attributes.media_content_id || stateObj.attributes.media_title,
      media_artist: stateObj.attributes.media_artist || "",
      media_content_type: 'track',
      media_type: 'track'
    };
  }

  _isCurrentlyPlayingRadio() {
    const stateObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (!stateObj?.attributes) return false;
    const ct = (stateObj.attributes.media_content_type || "").toLowerCase();
    const cid = (stateObj.attributes.media_content_id || "").toLowerCase();
    return ct === "radio" || cid.startsWith("library://radio/");
  }

  _handlePlaySimilar() {
    const mockItem = this._getMockItemFromCurrentTrack();
    if (!mockItem) return;

    this._showMediaTitleOptions = false;
    this._radioModeActive = true;

    this._playMediaFromSearch(mockItem);
  }

  async _handleAddCurrentToPlaylist() {
    const mockItem = this._getMockItemFromCurrentTrack();
    if (!mockItem) return;

    this._showMediaTitleOptions = false;

    // Open options sheet menu to show playlist search sheet
    this._showEntityOptions = true;
    this._showSearchInSheet = true;
    this._dismissMenuAfterPlaylistAdd = true;

    if (this._isCurrentlyPlayingRadio()) {
      // Radio streams don't have a valid MA track URI, so we need the user
      // to pick the correct track from a search first.
      // Use the track title as the primary query and artist/album as filters for precision.
      const searchTerm = mockItem.title;
      this._addToPlaylistTarget = null; // will be set when user picks a track
      this._searchHierarchy.push({
        type: 'select_track_for_playlist',
        name: localize('search.select_track_for_playlist', { '{track}': mockItem.title, '{artist}': mockItem.media_artist }),
        query: this._searchQuery,
        filter: this._searchMediaClassFilter
      });
      this._searchBreadcrumb = localize('search.select_track_for_playlist', { '{track}': mockItem.title, '{artist}': mockItem.media_artist });
      this._searchQuery = searchTerm;
      this._currentSearchQuery = searchTerm;
      this._searchMediaClassFilter = 'track';
      this._resetSearchContext();
      this._removeSearchSwipeHandlers();
      await this._doSearch('track', {
        clearFilters: true,
        artist: mockItem.media_artist
      });
      return;
    }

    this._performSearchOptionAction(mockItem, 'add_to_playlist');
  }

  /**
   * Open the search sheet and navigate directly to the current artist's albums
   * in hierarchical search view (only when media_artist is present).
   */
  async _searchArtistFromNowPlaying() {
    const artist = (this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj)?.attributes?.media_artist || "";
    if (!artist) return;

    this._openedSearchFromNowPlaying = true;

    // Open overlay + search sheet
    this._showEntityOptions = true;
    this._showSearchInSheet = true;
    this._searchInputAutoFocused = false;

    // Reset search state
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchAttempted = false;
    this._searchResultsByType = {};
    this._currentSearchQuery = "";
    this._searchHierarchy = [];
    this._searchBreadcrumb = "";
    this._usingMusicAssistant = false;
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._recommendationsFilterActive = false;
    this._initialFavoritesLoaded = false;
    this._lastSearchUsedServerFavorites = false;

    this.requestUpdate();

    let artistUri = null;
    if (this._isMusicAssistantEntity()) {
      try {
        const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
        const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
        artistUri = await this._resolveArtistUri(artist, searchEntityId);
      } catch (e) {
        console.warn("yamp: error resolving artist URI:", e);
      }
    }

    this._searchArtistAlbums(artist, artistUri).catch((error) => {
      console.error("yamp: artist quick-search failed:", error);
    });
  }

  /**
   * Resolve a media URI (album or artist) from Music Assistant
   * @param {"album"|"artist"|"playlist"|string} mediaType
   * @param {string} name
   * @param {Record<string, any>} extraParams
   * @param {string} entityId
   * @returns {Promise<string|null>}
   */
  async _resolveMediaUri(mediaType, name, extraParams = {}, entityId) {
    if (!name || !this.hass) return null;
    try {
      const configEntryId = await getMusicAssistantConfigEntryId(this.hass, entityId);
      if (!configEntryId) return null;

      const serviceData = {
        name,
        media_type: [mediaType],
        ...(configEntryId && configEntryId !== "auto" && { config_entry_id: configEntryId }),
        ...extraParams,
      };

      const msg = {
        type: "call_service",
        domain: "music_assistant",
        service: "search",
        service_data: serviceData,
        return_response: true,
      };

      const res = await this.hass.connection.sendMessagePromise(msg);
      const items = res?.response?.[`${mediaType}s`] || [];
      if (!items.length) return null;

      const normName = name.trim().toLowerCase();
      const normArtist = (extraParams.artist || "").trim().toLowerCase();

      if (mediaType === "album") {
        // Priority 1: Match both album name and artist
        const matchBoth = items.find((a) => {
          const aName = (a.name || "").toLowerCase();
          const aArtistMatch = normArtist
            ? a.artists?.some((ar) => {
                const arName = (ar.name || "").toLowerCase();
                return arName.includes(normArtist) || normArtist.includes(arName);
              })
            : true;
          return (
            (aName === normName || aName.includes(normName) || normName.includes(aName)) &&
            aArtistMatch
          );
        });
        if (matchBoth?.uri) return matchBoth.uri;
      }

      // Match item name
      const exactMatch = items.find((it) => (it.name || "").toLowerCase() === normName);
      if (exactMatch?.uri) return exactMatch.uri;

      const matchName = items.find((it) => {
        const itName = (it.name || "").toLowerCase();
        return itName === normName || itName.includes(normName) || normName.includes(itName);
      });
      if (matchName?.uri) return matchName.uri;

      // Fallback: First returned item
      return items[0]?.uri || null;
    } catch (e) {
      console.warn(`yamp: Failed to resolve ${mediaType} URI:`, e);
      return null;
    }
  }

  _resolveAlbumUri(albumName, artistName, entityId) {
    return this._resolveMediaUri("album", albumName, artistName ? { artist: artistName } : {}, entityId);
  }

  _resolveArtistUri(artistName, entityId) {
    return this._resolveMediaUri("artist", artistName, {}, entityId);
  }

  _resolvePlaylistUri(playlistName, entityId) {
    return this._resolveMediaUri("playlist", playlistName, {}, entityId);
  }

  /**
   * Open the search sheet and navigate directly to the current album's tracks
   * in hierarchical search view (only when media_album_name is present).
   */
  async _searchAlbumFromNowPlaying() {
    const activeObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    const album = activeObj?.attributes?.media_album_name || "";
    const artist = activeObj?.attributes?.media_artist || "";
    if (!album) return;

    this._openedSearchFromNowPlaying = true;

    // Open overlay + search sheet
    this._showEntityOptions = true;
    this._showSearchInSheet = true;
    this._searchInputAutoFocused = false;

    // Reset search state
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchAttempted = false;
    this._searchResultsByType = {};
    this._currentSearchQuery = "";
    this._searchHierarchy = [];
    this._searchBreadcrumb = "";
    this._usingMusicAssistant = false;
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._recommendationsFilterActive = false;
    this._initialFavoritesLoaded = false;
    this._lastSearchUsedServerFavorites = false;

    this.requestUpdate();

    let albumUri = null;
    if (this._isMusicAssistantEntity()) {
      try {
        const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
        const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
        albumUri = await this._resolveAlbumUri(album, artist, searchEntityId);
      } catch (e) {
        console.warn("yamp: error resolving album URI:", e);
      }
    }

    this._searchAlbumTracks(album, artist, albumUri).catch((error) => {
      console.error("yamp: album quick-search failed:", error);
    });
  }
  // Show search sheet inside entity options
  _showSearchSheetInOptions(mode = "default") {
    this._showSearchInSheet = true;
    this._searchHeadersRetracted = false;
    this._searchHeaderOffset = 0;
    this._searchHeaderNaturalHeight = 0;
    this._lastSearchResultsScrollTop = 0;
    this._searchInputAutoFocused = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchAttempted = false;
    this._searchResultsByType = {}; // Clear cache when opening new search
    this._currentSearchQuery = ""; // Reset current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb
    this._usingMusicAssistant = false; // Track if we're using Music Assistant search
    this._favoritesFilterActive = this.config.default_search_favorites === true; // Track if favorites filter is active
    this._recentlyPlayedFilterActive = false; // Track if recently played filter is active
    this._upcomingFilterActive = false; // Track if upcoming queue filter is active
    this._recommendationsFilterActive = false; // Track if recommendations filter is active
    this._initialFavoritesLoaded = false; // Track if initial favorites have been loaded
    void this._checkAiRadioAvailability();

    this.requestUpdate();

    // Trigger selected search mode after sheet opens
    setTimeout(() => {
      let promise;
      switch (mode) {
        case "recently-played":
          promise = this._toggleRecentlyPlayedFilter(true);
          break;
        case "next-up":
          promise = this._toggleUpcomingFilter(true);
          break;
        case "recommendations":
          promise = this._toggleRecommendationsFilter(true);
          break;
        default:
          {
            const defaultFilter = this.config.default_search_filter === 'all' ? null : this.config.default_search_filter;
            promise = this._doSearch(defaultFilter);
          }
          break;
      }
      if (promise?.catch) {
        promise.catch((err) => {
          console.error("yamp: search initialization failed:", err);
        });
      }
    }, 100);

    if (!this._disableSearchAutofocus) {
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
  }

  _openQuickSearchOverlay(mode = "default") {
    this._quickMenuInvoke = true;
    this._showEntityOptions = true;
    this._showSearchSheetInOptions(mode);
    setTimeout(() => {
      this._notifyResize();
    }, 0);
  }

  _handleNavigate(path, openInNewTab = false) {
    if (typeof path !== "string" || !path.trim()) {
      return;
    }
    const target = path.trim();

    const navEvent = new CustomEvent("hass-navigate", {
      detail: { path: target },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(navEvent);

    if (navEvent.defaultPrevented) {
      return;
    }

    let handled;
    if (target.startsWith("#")) {
      window.location.hash = target;
      handled = true;
    } else if (/^https?:\/\//i.test(target)) {
      if (openInNewTab) {
        window.open(target, "_blank", "noopener,noreferrer");
        return;
      }
      window.location.assign(target);
      handled = true;
    } else if (this.hass?.navigate) {
      this.hass.navigate(target);
      handled = true;
    } else {
      window.history.pushState(null, "", target);
      handled = true;
    }

    if (handled) {
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
    }
  }



  _hideSearchSheetInOptions() {
    // In dedicated search mode, never close the search
    if (this._cardType === "search" || this._cardType === "up_next") return;
    this._openedSearchFromNowPlaying = false;
    this._showSearchInSheet = false;
    this._searchHeadersRetracted = false;
    this._searchHeaderOffset = 0;
    this._searchHeaderNaturalHeight = 0;
    this._lastSearchResultsScrollTop = 0;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchDisplaySortOverride = null;
    this._searchInputAutoFocused = false;
    this._searchLoading = false;
    this._searchAttempted = false;
    this._searchResultsByType = {}; // Clear cache when closing
    this._currentSearchQuery = ""; // Reset current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb
    this._addToPlaylistTarget = null; // Clear playlist target
    this._dismissMenuAfterPlaylistAdd = false; // Clear dismiss flag
    this._recommendationsFilterActive = false;
    this._lastSearchUsedServerFavorites = false;
    if (this._quickMenuInvoke) {
      this._showEntityOptions = false;
      this._quickMenuInvoke = false;
    }
    this.requestUpdate();
    // Force layout update for expand on search
    setTimeout(() => {
      this._notifyResize();
    }, 0);
  }
  // Search sheet methods


  _closeMenuIfOpen() {
    if (this._queueActionsMenuOpenId) {
      this._closeQueueActionsMenu();
    }
  }

  _sortSearchResults(results, sortModeOverride = null) {
    // Upcoming queue items, Recently Played items, and Recommendations should never be sorted
    if (this._upcomingFilterActive || this._recentlyPlayedFilterActive || this._recommendationsFilterActive) {
      return Array.isArray(results) ? [...results] : [];
    }
    const sortMode = sortModeOverride ?? this._getConfiguredSearchResultsSortMode();
    const list = Array.isArray(results) ? [...results] : [];

    if (sortMode === "random") {
      // Fisher-Yates shuffle for an unbiased random order
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      return list;
    }

    // All other sorting is handled server-side via order_by parameter
    return list;
  }

  _getConfiguredSearchResultsSortMode() {
    const configured = this.config?.search_results_sort;
    const mode = typeof configured === "string" ? configured : "default";
    return this._mapLegacySortOption(mode);
  }

  _mapLegacySortOption(mode) {
    if (!mode) return "default";
    const legacyMap = {
      "title_asc": "name",
      "title_desc": "name_desc",
      "artist_asc": "artist_name",
      "artist_desc": "artist_name_desc"
    };
    return legacyMap[mode] || mode;
  }

  _isSortableSearchMode(mode) {
    if (!mode || mode === "default" || mode === "random" || mode === "random_play_count") return false;
    return true;
  }

  _getOppositeSearchSortMode(mode) {
    if (!mode || mode === "default" || mode === "random" || mode === "random_play_count") return null;
    // Toggle between asc and desc variants
    if (mode.endsWith("_desc")) {
      return mode.replace(/_desc$/, "");
    }
    return `${mode}_desc`;
  }

  _shouldShowSearchSortToggle() {
    if (this._upcomingFilterActive || this._recentlyPlayedFilterActive || this._recommendationsFilterActive) return false;
    return this._isSortableSearchMode(this._getConfiguredSearchResultsSortMode());
  }

  _toggleSearchResultsSortDirection() {
    if (!this._shouldShowSearchSortToggle()) {
      this._searchDisplaySortOverride = null;
      return;
    }
    const configured = this._getConfiguredSearchResultsSortMode();
    const alternate = this._getOppositeSearchSortMode(configured);
    if (!alternate) {
      this._searchDisplaySortOverride = null;
      return;
    }
    if (this._searchDisplaySortOverride === alternate) {
      this._searchDisplaySortOverride = null;
    } else {
      this._searchDisplaySortOverride = alternate;
    }
    // Clear cached results so _doSearch re-fetches with the new order_by
    this._searchResultsByType = {};
    // Re-trigger search with new sort order
    this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter, { orderBy: this._getActiveSearchDisplaySortMode() });
    this.requestUpdate();
  }

  _getActiveSearchDisplaySortMode() {
    if (this._upcomingFilterActive || this._recentlyPlayedFilterActive || this._recommendationsFilterActive) {
      return "default";
    }
    if (!this._shouldShowSearchSortToggle()) {
      return this._getConfiguredSearchResultsSortMode();
    }
    const override = this._searchDisplaySortOverride;
    if (override && this._isSortableSearchMode(override)) {
      return override;
    }
    return this._getConfiguredSearchResultsSortMode();
  }

  _getSearchSortToggleIcon() {
    const mode = this._getActiveSearchDisplaySortMode();
    if (!this._isSortableSearchMode(mode)) {
      return "mdi:sort-variant";
    }
    return mode.endsWith("_desc") ? "mdi:sort-descending" : "mdi:sort-ascending";
  }

  _getSearchSortToggleTitle() {
    const mode = this._getActiveSearchDisplaySortMode();
    if (!this._isSortableSearchMode(mode)) {
      return "Toggle search result order";
    }
    const isDesc = mode.endsWith("_desc");
    const baseName = isDesc ? mode.replace(/_desc$/, "") : mode;
    const label = baseName.replace(/_/g, " ");
    return `Sort by ${label} ${isDesc ? "descending" : "ascending"}`;
  }

  _getDisplaySearchResults() {
    const results = Array.isArray(this._searchResults) ? this._searchResults : [];
    const isInHierarchy = this._searchHierarchy.some(
      (h) => h.type === "album" || h.type === "playlist" || h.type === "artist"
    );
    if (isInHierarchy && this._searchQuery && this._searchQuery.trim() !== "") {
      const q = this._searchQuery.trim().toLowerCase();
      return results.filter((item) => {
        const title = (item.title || item.name || "").toLowerCase();
        const artist = (item.artist || "").toLowerCase();
        return title.includes(q) || artist.includes(q);
      });
    }
    return results;
  }

  _getSearchResultsLimit() {
    const raw = Number(this.config?.search_results_limit);
    if (Number.isFinite(raw)) {
      if (raw === 0) {
        return 0; // Explicitly disable limit
      }
      return Math.min(Math.max(raw, 1), 1000);
    }
    return 20;
  }

  _getSearchResultsCount() {
    return this._getDisplaySearchResults().length;
  }

  _shouldShowSearchResultsCount() {
    if (this._isNarrowViewport || !this._usingMusicAssistant || this._searchLoading) {
      return false;
    }
    const count = this._getSearchResultsCount();
    if (count > 0) {
      return true;
    }
    return (
      this._searchAttempted ||
      this._initialFavoritesLoaded ||
      this._favoritesFilterActive ||
      this._recentlyPlayedFilterActive ||
      this._upcomingFilterActive ||
      this._recommendationsFilterActive
    );
  }

  _getSearchResultsCountLabel() {
    const count = this._getSearchResultsCount();
    const key = count === 1 ? 'search.result' : 'search.results';
    return `${count} ${localize(key)}`;
  }








  async _doSearch(mediaType = null, searchParams = {}) {
    this._searchAttempted = true;
    this._closeMenuIfOpen();
    this._setSearchHeadersRetracted(false);
    this._lastSearchResultsScrollTop = 0;
    // Set the current filter - but don't use "favorites" as a media type
    this._searchMediaClassFilter = (mediaType && mediaType !== 'favorites') ? mediaType : 'all';

    // Respect favorites toggle across chip changes, but allow explicit filter clearing
    // FIX: Include _initialFavoritesLoaded AND _lastSearchUsedServerFavorites to persist implicit favorites state
    const isFavorites = !!(searchParams.favorites || ((this._favoritesFilterActive || this._initialFavoritesLoaded || this._lastSearchUsedServerFavorites) && !searchParams.clearFilters));

    // FIX: Explicitly persist the favorites filter state if we determined we are in favorites mode
    if (isFavorites) {
      this._favoritesFilterActive = true;
    }

    const isRecentlyPlayed = !!(searchParams.isRecentlyPlayed || (this._recentlyPlayedFilterActive && !searchParams.clearFilters));
    const isUpcoming = !!(searchParams.isUpcoming || (this._upcomingFilterActive && !searchParams.clearFilters));
    const isRecommendations = !!(searchParams.isRecommendations || (this._recommendationsFilterActive && !searchParams.clearFilters));

    // Check if search query has changed - if so, clear cache
    if (this._currentSearchQuery !== this._searchQuery) {
      this._searchResultsByType = {};
      this._currentSearchQuery = this._searchQuery;
    }

    // Use cached results if available for this media type and search params
    const sortMode = this._getActiveSearchDisplaySortMode();
    const cacheKey = `${mediaType || 'all'}${isFavorites ? '_favorites' : ''}${isRecentlyPlayed ? '_recently_played' : ''}${isUpcoming ? '_upcoming' : ''}${isRecommendations ? '_recommendations' : ''}_sort_${sortMode}`;
    const forceFetch = !!searchParams.force;

    if (this._searchResultsByType[cacheKey] && !forceFetch) {
      if (this._searchTimeoutHandle) {
        clearTimeout(this._searchTimeoutHandle);
        this._searchTimeoutHandle = null;
      }
      this._latestSearchToken = 0;
      this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
      this._searchLoading = false;
      this._searchError = "";
      this.requestUpdate();
      return;
    }

    const isSilent = !!searchParams.silent;

    if (!isSilent) {
      this._searchLoading = true;
      this._searchError = "";
      this._searchResults = [];
      this.requestUpdate();
    }
    const searchToken = searchParams.token || Date.now();
    this._latestSearchToken = searchToken;
    const progressiveUpdate = (chunk) => this._handleProgressiveSearchResults(chunk, cacheKey, searchToken);
    if (this._searchTimeoutHandle) {
      clearTimeout(this._searchTimeoutHandle);
    }
    this._searchTimeoutHandle = window.setTimeout(() => {
      if (this._latestSearchToken === searchToken && this._searchLoading) {
        this._searchLoading = false;
        this._searchError = "Search timed out. Try again.";
        this.requestUpdate();
      }
    }, this.config?.search_timeout_ms ? Number(this.config.search_timeout_ms) : 15000);

    try {
      const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);

      let searchResponse;

      // Special case: "Add to Playlist" directly reads unstripped MA library playlists with mass_queue.send_command
      if (this._addToPlaylistTarget && mediaType === 'playlist' && this._massQueueAvailable) {
        this._initialFavoritesLoaded = false;
        try {
          const mqConfigEntryId = await getMassQueueConfigEntryId(this.hass, searchEntityId);
          if (mqConfigEntryId) {
            // Fetch a generous amount so we don't truncate before filtering
            const apiData = { limit: PLAYLIST_FETCH_LIMIT };
            if (this._searchQuery && this._searchQuery.trim().length > 0) {
              apiData.search = this._searchQuery.trim();
            }
            const orderBy = this._getActiveSearchDisplaySortMode();
            if (orderBy && orderBy !== 'default') {
              apiData.order_by = orderBy;
            }

            const message = {
              type: "call_service",
              domain: "mass_queue",
              service: "send_command",
              service_data: {
                ...(mqConfigEntryId && mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
                command: "music/playlists/library_items",
                data: apiData
              },
              return_response: true
            };

            const res = await this.hass.connection.sendMessagePromise(message);

            let rawPlaylists = [];

            // The Music Assistant API send_command wrapper wraps the response deeply.
            // e.g. res.response = { id: "xxx", response: [...] }
            if (Array.isArray(res?.response)) {
              rawPlaylists = res.response;
            } else if (Array.isArray(res?.response?.response)) {
              rawPlaylists = res.response.response;
            } else if (Array.isArray(res?.response?.items)) {
              rawPlaylists = res.response.items;
            } else if (Array.isArray(res?.response?.results)) {
              rawPlaylists = res.response.results;
            }

            if (Array.isArray(rawPlaylists)) {
              const displayLimit = this._getSearchResultsLimit() || 30;
              const mappedPlaylists = rawPlaylists
                .filter(p => p.is_editable === true)
                .map(p => transformMusicAssistantItem(p))
                .filter(Boolean)
                // only return up to the configured display limit
                .slice(0, displayLimit);

              searchResponse = { results: mappedPlaylists, usedMusicAssistant: true };
            }
          }
        } catch (e) {
          console.warn("yamp: error fetching direct native playlists for add-to-target logic", e);
        }

        if (!searchResponse) {
          searchResponse = { results: [], usedMusicAssistant: true };
        }
        this._lastSearchUsedServerFavorites = false;
      } else if (isRecentlyPlayed) {
        // Load recently played items
        this._initialFavoritesLoaded = false;
        searchResponse = await getRecentlyPlayed(
          this.hass,
          searchEntityId,
          mediaType,
          this._getSearchResultsLimit(),
          { onChunk: progressiveUpdate }
        );
        this._lastSearchUsedServerFavorites = false;
      } else if (isUpcoming) {
        // Load upcoming queue items
        this._initialFavoritesLoaded = false;
        const upcomingLimit = Math.min(250, this._getSearchResultsLimit());
        searchResponse = await this._getUpcomingQueue(this.hass, searchEntityId, upcomingLimit);
        this._lastSearchUsedServerFavorites = false;
      } else if (isRecommendations) {
        this._initialFavoritesLoaded = false;
        searchResponse = await this._getRecommendations(
          this.hass,
          searchEntityId,
          mediaType,
          this._getSearchResultsLimit()
        );
        this._lastSearchUsedServerFavorites = false;
      } else if (isFavorites) {
        // Ask backend (Music Assistant) to filter favorites at source with the current query
        this._initialFavoritesLoaded = false;
        const orderBy = this._getActiveSearchDisplaySortMode();
        searchResponse = await searchMedia(
          this.hass,
          searchEntityId,
          this._searchQuery,
          mediaType,
          { ...searchParams, favorites: true, orderBy: orderBy !== 'default' ? orderBy : undefined },
          this._getSearchResultsLimit()
        );
        this._lastSearchUsedServerFavorites = true;
      } else if ((!this._searchQuery || this._searchQuery.trim() === '') && !isFavorites && !isRecentlyPlayed && (mediaType === 'all' || !mediaType)) {
        const orderBy = this._getActiveSearchDisplaySortMode();
        searchResponse = await getFavorites(
          this.hass,
          searchEntityId,
          mediaType === 'favorites' ? null : mediaType,
          this._getSearchResultsLimit(),
          { onChunk: progressiveUpdate, orderBy: orderBy !== 'default' ? orderBy : undefined }
        );
        // Mark that initial favorites have been loaded only if we're in default view
        if (!this._searchQuery || this._searchQuery.trim() === '') {
          this._initialFavoritesLoaded = true;
        }
        this._lastSearchUsedServerFavorites = true;
      } else {
        // Perform search - reset initial favorites flag since this is a user search
        this._initialFavoritesLoaded = false;
        const orderBy = this._getActiveSearchDisplaySortMode();
        searchResponse = await searchMedia(this.hass, searchEntityId, this._searchQuery, mediaType, { ...searchParams, orderBy: orderBy !== 'default' ? orderBy : undefined }, this._getSearchResultsLimit());
        this._lastSearchUsedServerFavorites = false;
      }



      // Handle the new response format
      let arr = searchResponse.results || [];
      this._usingMusicAssistant = searchResponse.usedMusicAssistant || false;

      // Initialize/Reset internal states when config changes is a completely new search (not just switching filters)
      const isNewSearch = this._currentSearchQuery !== this._searchQuery;
      if (isNewSearch) {
        this._favoritesFilterActive = false;
        this._recentlyPlayedFilterActive = false;
        this._upcomingFilterActive = false;
        this._recommendationsFilterActive = false;
        this._initialFavoritesLoaded = false;
      }

      let normalizedResults = Array.isArray(arr) ? arr : [];
      // Check search token *after* await to discard stale background fetches
      if (this._latestSearchToken !== searchToken) {
        return;
      }

      // 1. Client-side filtering for search query (Recent, Upcoming, Recommendations)
      if ((isRecentlyPlayed || isUpcoming || isRecommendations) && this._searchQuery && this._searchQuery.trim() !== '') {
        const query = this._searchQuery.trim().toLowerCase();
        normalizedResults = normalizedResults.filter(item => {
          const title = (item.title || "").toLowerCase();
          const artist = (item.artist || "").toLowerCase();
          const album = (item.album || "").toLowerCase();
          return title.includes(query) || artist.includes(query) || album.includes(query);
        });
      }

      // 2. Apply local favorites filter ONLY when needed
      if (!isNewSearch && this._favoritesFilterActive && !this._lastSearchUsedServerFavorites) {
        normalizedResults = await this._applyLocalFavoritesFilter(normalizedResults);

        // Check token again after await
        if (this._latestSearchToken !== searchToken) {
          return;
        }
      }

      // Cache the results for this media type and search params
      this._searchResultsByType[cacheKey] = normalizedResults;

      // Update active UI results
      this._searchResults = this._sortSearchResults(normalizedResults);

      // remember how many rows exist in the full ("All") set, but keep at least 15 for layout
      const rows = Array.isArray(this._searchResults) ? this._searchResults.length : 0;
      this._searchTotalRows = Math.max(15, rows);   // keep at least 15
    } catch (e) {
      this._searchError = (e && e.message) || "Unknown error";
      this._searchResults = [];
      this._searchTotalRows = 0;
    }
    if (this._latestSearchToken === searchToken && this._searchTimeoutHandle) {
      clearTimeout(this._searchTimeoutHandle);
      this._searchTimeoutHandle = null;
    }
    if (this._latestSearchToken === searchToken) {
      this._latestSearchToken = 0;
    }
    this._searchLoading = false;
    this.requestUpdate();
    setTimeout(() => this._notifyResize(), 0);
  }

  async _playCurrentCollection() {
    if (this._searchHierarchy.length === 0) return;
    const currentLevel = this._searchHierarchy[this._searchHierarchy.length - 1];
    if (!currentLevel || !currentLevel.uri) {
      this._searchError = localize('search.play_collection_error');
      this.requestUpdate();
      return;
    }

    const item = {
      media_content_id: currentLevel.uri,
      media_content_type: currentLevel.type
    };

    await this._playMediaFromSearch(item);
  }

  // Handle explicit search submission from UI (Enter key or Search Button)
  _handleSearchSubmit() {
    if (this._searchHierarchy.some((h) => h.type === "album" || h.type === "playlist" || h.type === "artist")) {
      // In hierarchy mode, filtering is already live in real-time
      return;
    }
    const keepFilters = this._keepFiltersOnSearch;
    if (!keepFilters) {
      this._favoritesFilterActive = false;
      this._recentlyPlayedFilterActive = false;
      this._upcomingFilterActive = false;
      this._recommendationsFilterActive = false;
    }
    const clearFilters = !keepFilters;
    this._doSearch(
      this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter,
      { clearFilters }
    );
  }

  _handleProgressiveSearchResults(chunk, cacheKey, searchToken) {
    if (!Array.isArray(chunk) || !chunk.length) {
      return;
    }
    if (this._latestSearchToken !== searchToken) {
      return;
    }
    const mergedResults = (this._searchResultsByType[cacheKey] || []).concat(chunk);
    this._searchResultsByType[cacheKey] = mergedResults;
    this._searchResults = this._sortSearchResults(mergedResults);
    const rows = Array.isArray(mergedResults) ? mergedResults.length : 0;
    this._searchTotalRows = Math.max(15, rows);
    this.requestUpdate();
  }

  // Derive the list of visible search filter chips based on cached results and entity visibility settings
  _getVisibleSearchFilterClasses() {
    const currEntityObj = this.entityObjs?.[this._selectedIndex] || null;
    const hiddenSet = new Set(currEntityObj?.hidden_filter_chips || []);

    const list = [...ALLOWED_MEDIA_TYPES];
    if (this._aiRadioShowsAvailable) {
      list.push("shows");
    }
    return list.filter(c => !hiddenSet.has(c));
  }

  async _playMediaFromSearch(item, event) {
    if (this._isDragging) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      return;
    }
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    this._mediaSessionManager?.startPlaybackGesture(targetEntityId);
    this._searchError = "";

    this._loadingSearchRowMenuId = item?.media_content_id || null;
    this.requestUpdate();

    let playbackStarted;
    try {
      playbackStarted = await this._performSearchPlayback(item, targetEntityId);
    } finally {
      this._loadingSearchRowMenuId = null;
      this.requestUpdate();
    }

    if (!playbackStarted) {
      this._searchError = "Unable to start playback. Please try again.";
      this.requestUpdate();
      return;
    }

    const { shouldDismiss, shouldReset } = this._getSearchDismissBehavior();

    if (shouldDismiss) {
      if (this._showSearchInSheet) {
        this._closeEntityOptions();
        this._showSearchInSheet = false;
      }
      this._hideSearchSheetInOptions();
    } else if (shouldReset) {
      this._showSearchSheetInOptions();
    } else {
      // If staying open, force a repaint to reflect playing state if needed
      this.requestUpdate();
    }
  }

  async _performSearchPlayback(item, targetEntityId) {
    // Check if this is a queue item (has queue_item_id) and we're in the upcoming filter with working mass_queue
    if (item.queue_item_id && this._upcomingFilterActive && this._isMusicAssistantEntity() && this._massQueueAvailable) {
      // For queue items in the "Next Up" filter, play the specific queue item
      try {
        const maState = this._getMusicAssistantState();
        const maEntityId = maState?.entity_id;

        if (maEntityId) {
          // Use mass_queue to play the specific queue item
          await this.hass.callService("mass_queue", "play_queue_item", {
            entity: maEntityId,
            queue_item_id: item.queue_item_id
          });
          this._advanceQueueInUI(item.queue_item_id, true); // Manual advance
          return true;
        }
      } catch (error) {
        console.error('yamp: Error playing queue item:', error);
        // Fallback to next track if service call fails
        await mediaNextTrack(this.hass, targetEntityId);
        return true;
      }
    }

    if (!targetEntityId) {
      return false;
    }

    if (isShow(item)) {
      const monitorIds = this._collectPlaybackMonitorIds(targetEntityId);
      const snapshot = this._snapshotPlaybackState(monitorIds);
      const attempt = await this._invokePlayMedia(targetEntityId, item);
      if (!attempt) {
        return false;
      }
      const wasPlaying = monitorIds.some((id) => snapshot[id]?.state === "playing");
      await this._waitForPlaybackChange(snapshot, monitorIds, 25000, {
        requireMediaChange: wasPlaying,
      });
      return true;
    }

    // For regular search results or fallback mode, use the normal play method with a retry guard.
    const monitorIds = this._collectPlaybackMonitorIds(targetEntityId);
    const firstSnapshot = this._snapshotPlaybackState(monitorIds);
    const firstAttempt = await this._invokePlayMedia(targetEntityId, item);
    if (!firstAttempt) {
      return false;
    }
    const firstWasPlaying = monitorIds.some((id) => firstSnapshot[id]?.state === "playing");
    const firstChangeDetected = await this._waitForPlaybackChange(firstSnapshot, monitorIds, 2500, {
      requireMediaChange: firstWasPlaying,
    });
    if (firstChangeDetected) {
      return true;
    }

    // Retry once if we didn't observe playback starting yet.
    const retrySnapshot = this._snapshotPlaybackState(monitorIds);
    const retryAttempt = await this._invokePlayMedia(targetEntityId, item);
    if (!retryAttempt) {
      return false;
    }
    const retryWasPlaying = monitorIds.some((id) => retrySnapshot[id]?.state === "playing");
    return await this._waitForPlaybackChange(retrySnapshot, monitorIds, 2500, {
      requireMediaChange: retryWasPlaying,
    });
  }

  _collectPlaybackMonitorIds(targetEntityId) {
    const ids = new Set();
    if (targetEntityId) ids.add(targetEntityId);
    const playbackEntity = this._getPlaybackEntityId(this._selectedIndex);
    if (playbackEntity) ids.add(playbackEntity);
    const mainEntity = this.currentEntityId;
    if (mainEntity) ids.add(mainEntity);
    const maEntity = this._getActualResolvedMaEntityForState(this._selectedIndex);
    if (maEntity) ids.add(maEntity);
    return Array.from(ids).filter(Boolean);
  }

  _snapshotPlaybackState(entityIds) {
    const snapshot = {};
    if (!Array.isArray(entityIds)) {
      return snapshot;
    }
    entityIds.forEach(id => {
      const stateObj = id ? this.hass?.states?.[id] : null;
      snapshot[id] = {
        state: stateObj?.state ?? null,
        mediaId: stateObj?.attributes?.media_content_id ?? null,
        mediaTitle: stateObj?.attributes?.media_title ?? null
      };
    });
    return snapshot;
  }

  async _waitForPlaybackChange(snapshot, entityIds, timeout = 2500, { requireMediaChange = false } = {}) {
    if (!Array.isArray(entityIds) || entityIds.length === 0) {
      return true;
    }
    const start = Date.now();
    while (Date.now() - start < timeout) {
      await this._delay(150);
      for (const id of entityIds) {
        if (!id) continue;
        const stateObj = this.hass?.states?.[id];
        if (!stateObj) continue;
        const previous = snapshot[id] || {};
        const wasPlaying = previous.state === "playing";
        const currentMediaId = stateObj.attributes?.media_content_id ?? null;
        const currentTitle = stateObj.attributes?.media_title ?? null;
        const mediaChanged =
          (currentMediaId && currentMediaId !== previous.mediaId) ||
          (currentTitle && currentTitle !== previous.mediaTitle) ||
          (!previous.mediaId && currentMediaId) ||
          (!previous.mediaTitle && currentTitle);

        if (mediaChanged) {
          return true;
        }

        if (!requireMediaChange && !wasPlaying && this._isEntityPlaying(stateObj)) {
          return true;
        }
      }
    }
    return false;
  }

  async _performSearchOptionAction(item, mode) {
    if (mode === 'add_to_playlist') {
      this._addToPlaylistTarget = item;
      this._searchHierarchy.push({
        type: 'select_playlist',
        name: localize('search.add_to_playlist'),
        query: this._searchQuery,
        filter: this._searchMediaClassFilter
      });
      // Set a special breadcrumb for context
      this._searchBreadcrumb = localize('search.select_playlist').replace('{track}', item.title);
      this._searchQuery = '';
      this._currentSearchQuery = '';
      this._searchMediaClassFilter = 'playlist';
      this._resetSearchContext();

      this._removeSearchSwipeHandlers();

      // Fetch playlists
      await this._doSearch('playlist', { clearFilters: true });
      return;
    }

    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);

    try {
      const playParams = {
        entity_id: targetEntityId,
        media_id: item.media_content_id,
        media_type: item.media_content_type,
        enqueue: mode
      };
      if (this._radioModeActive) {
        playParams.radio_mode = true;
      }

      await this.hass.callService("music_assistant", "play_media", playParams);
      // Invalidate the "Next Up" cache because we've modified the queue
      this._invalidateUpcomingCache();

      // For 'replace' mode, we dismiss according to settings and don't show success overlay
      if (mode === 'replace') {
        const { shouldDismiss, shouldReset } = this._getSearchDismissBehavior();

        if (shouldDismiss) {
          this._closeEntityOptions();
        } else if (shouldReset) {
          this._showSearchSheetInOptions();
        }
        this._activeSearchRowMenuId = null;
      } else {
        // For other modes, show the localized success message overlay within the slide-out
        this._successSearchRowMenuId = item.media_content_id;
        this.requestUpdate();

        const shouldDismissMenu = this._dismissMenuAfterPlaylistAdd && mode === 'add_to_playlist';

        setTimeout(() => {
          this._successSearchRowMenuId = null;
          this._activeSearchRowMenuId = null; // Also dismiss the slide-out after message fades

          if (shouldDismissMenu) {
            this._closeEntityOptions();
            this._dismissMenuAfterPlaylistAdd = false;
          }

          this.requestUpdate();
        }, 2000);
      }
    } catch (e) {
      console.error("Failed to perform search option action:", e);
      this._searchError = "Action failed: " + e.message;
      this.requestUpdate();
    }
  }

  async _invokePlayMedia(targetEntityId, item) {
    try {
      this._mediaSessionManager?.startPlaybackGesture(targetEntityId);
      if (isShow(item)) {
        await playAiRadioStation(this.hass, targetEntityId, item.station_id || item.item_id);
      } else if (this._radioModeActive) {
        await this.hass.callService("music_assistant", "play_media", {
          entity_id: targetEntityId,
          media_id: item.media_content_id,
          media_type: item.media_content_type,
          radio_mode: true
        });
      } else {
        await playSearchedMedia(this.hass, targetEntityId, item);
      }
      return true;
    } catch (error) {
      console.error("yamp: Error starting playback from search:", error);
      return false;
    }
  }

  _delay(ms) {
    return new Promise(resolve => {
      const timerHost = typeof window !== "undefined" ? window : globalThis;
      timerHost.setTimeout(resolve, ms);
    });
  }

  async _queueMediaFromSearch(item) {
    return this._queueController.queueMediaFromSearch(item);
  }

  // Handle hierarchical search - search for albums by artist
  async _searchArtistAlbums(artistName, artistUri = null) {
    this._searchHierarchy.push({ type: 'artist', name: artistName, query: this._searchQuery, uri: artistUri, filter: this._searchMediaClassFilter });
    this._searchBreadcrumb = `Albums by ${artistName}`;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = "";
    this._searchMediaClassFilter = 'album';

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this._searchQuery = "";
    this.requestUpdate();

    // Clear filter states to ensure accurate artist search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Remove swipe handlers when entering hierarchy
    this._removeSearchSwipeHandlers();

    // Priority 1: Use browse_media if artistUri is available and entity is Music Assistant
    if (artistUri && this._isMusicAssistantEntity()) {
      try {
        const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
        const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);

        const browseMsg = {
          type: "call_service",
          domain: "media_player",
          service: "browse_media",
          service_data: {
            entity_id: searchEntityId,
            media_content_id: artistUri,
          },
          return_response: true,
        };

        const browseRes = await this.hass.connection.sendMessagePromise(browseMsg);
        const browseResult = browseRes?.response?.[searchEntityId]?.result || browseRes?.result || {};
        const children = browseResult.children || [];
        const albums = children.filter(c => c.media_class === 'album' || c.media_content_type === 'album');

        if (albums.length > 0) {
          this._searchQuery = "";
          this._searchResults = this._sortSearchResults(albums);
          this._searchTotalRows = Math.max(15, albums.length);
          this._searchAttempted = true;
          this._searchLoading = false;
          this.requestUpdate();
          return;
        }
      } catch (e) {
        // Fall back to search
      }
    }

    // Priority 2: Use Music Assistant search with artist parameter for albums (explicitly clear filters)
    await this._doSearch('album', { artist: artistName, clearFilters: true });
  }


  // Go back in search hierarchy
  _goBackInSearch() {
    if (this._dismissMenuAfterPlaylistAdd) {
      this._closeEntityOptions();
      this._dismissMenuAfterPlaylistAdd = false;
      return;
    }

    if (this._searchHierarchy.length === 0) return;

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this.requestUpdate();

    const previousLevel = this._searchHierarchy.pop();
    if (previousLevel.type === 'select_playlist' || previousLevel.type === 'select_track_for_playlist') {
      this._addToPlaylistTarget = null;
    }

    this._searchQuery = previousLevel.query;
    this._currentSearchQuery = previousLevel.query;
    this._searchResultsByType = {}; // Clear cache for new search

    // Restore filter state
    this._searchMediaClassFilter = previousLevel.filter || 'all';

    if (this._searchHierarchy.length === 0) {
      if (this._openedSearchFromNowPlaying) {
        this._openedSearchFromNowPlaying = false;
        this._closeEntityOptions();
        return;
      }
      this._searchBreadcrumb = "";
      this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter);
    } else {
      const currentLevel = this._searchHierarchy[this._searchHierarchy.length - 1];
      if (currentLevel.type === 'artist') {
        this._searchBreadcrumb = `Albums by ${currentLevel.name}`;
        this._searchMediaClassFilter = 'album';
        this._doSearch('album', { artist: currentLevel.name });
      } else if (currentLevel.type === 'album') {
        this._searchBreadcrumb = `Tracks from ${currentLevel.name}`;
        this._searchMediaClassFilter = 'track';
        const artistLevel = this._searchHierarchy.find(level => level.type === 'artist');
        const artistName = artistLevel ? artistLevel.name : null;
        if (currentLevel.uri && this._isMusicAssistantEntity()) {
          this._searchQuery = "";
          this._currentSearchQuery = "";
          this._searchResults = [];
          this._searchLoading = true;
          this.requestUpdate();
          this._loadAlbumTracks(currentLevel.uri, currentLevel.name, artistName).then(() => {
            this._scrollToTop();
          });
          return;
        }
        // Fallback search
        const searchParams = { album: currentLevel.name };
        if (artistName) {
          searchParams.artist = artistName;
        }
        this._doSearch('track', searchParams);
      } else if (currentLevel.type === 'playlist') {
        this._searchBreadcrumb = `Tracks from ${currentLevel.name}`;
        this._searchMediaClassFilter = 'track';
        if (currentLevel.uri && this._isMusicAssistantEntity()) {
          this._searchQuery = "";
          this._currentSearchQuery = "";
          this._searchResults = [];
          this._searchLoading = true;
          this.requestUpdate();
          this._loadPlaylistTracks(currentLevel.uri, currentLevel.name).then(() => {
            this._scrollToTop();
          });
          return;
        }
        this._doSearch('track');
      }
    }
  }

  _scrollToTop() {
    const results = this.shadowRoot?.querySelector(".search-sheet-results");
    if (results) results.scrollTop = 0;
    this._updateSearchHeaderPosition(0, true);
    this._lastSearchResultsScrollTop = 0;
  }

  _getSearchHeaderHeight() {
    const panel = this.shadowRoot?.querySelector(".search-header-panel");
    if (!panel) return this._searchHeaderNaturalHeight || 120;
    const height = panel.offsetHeight;
    if (height > 0) {
      this._searchHeaderNaturalHeight = height;
      return height;
    }
    return this._searchHeaderNaturalHeight || 120;
  }

  _updateSearchHeaderPosition(offset, animated = false) {
    const headerHeight = this._getSearchHeaderHeight();
    const clampedOffset = Math.max(0, Math.min(headerHeight, offset));
    this._searchHeaderOffset = clampedOffset;
    const isRetracted = clampedOffset >= headerHeight && headerHeight > 0;
    this._searchHeadersRetracted = isRetracted;

    const panel = this.shadowRoot?.querySelector(".search-header-panel");
    if (!panel) return;

    if (animated) {
      panel.classList.add("smooth-transition");
      clearTimeout(this._searchHeaderTransitionTimer);
      this._searchHeaderTransitionTimer = setTimeout(() => {
        panel.classList.remove("smooth-transition");
      }, 280);
    } else {
      panel.classList.remove("smooth-transition");
    }

    panel.classList.toggle("retracted", isRetracted);
    panel.style.marginTop = clampedOffset > 0 ? `-${clampedOffset}px` : "0px";

    const progress = headerHeight > 0 ? clampedOffset / headerHeight : 0;
    const opacity = Math.max(0, Math.min(1, 1 - progress));
    panel.style.opacity = clampedOffset > 0 ? opacity.toFixed(3) : "";

    if (isRetracted) {
      panel.style.pointerEvents = "none";
      const input = panel.querySelector("#search-input-box");
      if (input && document.activeElement === input) {
        input.blur();
      }
    } else {
      panel.style.pointerEvents = "";
    }
  }

  _getSearchResultsElement() {
    if (!this._cachedSearchResultsElement || !this._cachedSearchResultsElement.isConnected) {
      this._cachedSearchResultsElement = this.shadowRoot?.querySelector(
        ".virtualized-results-wrapper, .queue-results-wrapper, .search-sheet-results, .entity-options-search-results"
      );
    }
    return this._cachedSearchResultsElement;
  }

  _applySearchHeaderDelta(delta) {
    if (this.config?.pin_search_headers === true) return;
    const headerHeight = this._getSearchHeaderHeight();
    if (headerHeight <= 0) return;

    const currentOffset = this._searchHeaderOffset || 0;
    const newOffset = Math.max(0, Math.min(headerHeight, currentOffset + delta));
    if (newOffset !== currentOffset) {
      this._updateSearchHeaderPosition(newOffset, false);
    }
  }

  _setSearchHeadersRetracted(retracted, animated = true) {
    const headerHeight = this._getSearchHeaderHeight();
    const targetOffset = retracted ? headerHeight : 0;
    this._updateSearchHeaderPosition(targetOffset, animated);
  }

  _handleSearchResultsScroll(e, pinSearchHeaders) {
    if (pinSearchHeaders || this.config?.pin_search_headers === true || this._isDragging) return;
    const el = e.currentTarget || e.target;
    if (!el) return;

    const currentScrollTop = el.scrollTop;
    const lastScrollTop = this._lastSearchResultsScrollTop ?? currentScrollTop;
    const delta = currentScrollTop - lastScrollTop;
    this._lastSearchResultsScrollTop = currentScrollTop;

    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    if (maxScroll <= 0) {
      if ((this._searchHeaderOffset || 0) !== 0) {
        this._updateSearchHeaderPosition(0, false);
      }
      return;
    }

    if (currentScrollTop <= 0) {
      this._updateSearchHeaderPosition(0, false);
      return;
    }

    if (currentScrollTop >= maxScroll - 6) {
      return;
    }

    if (delta === 0) return;

    this._applySearchHeaderDelta(delta);
  }

  _handleFilterChipsWheel(e) {
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY) && e.deltaX !== 0) {
      e.stopPropagation();
    }
  }

  _handleHeaderWheel(e, pinSearchHeaders) {
    const chipRow =
      e.target?.closest?.(".search-filter-chips") ||
      e.composedPath?.().find?.((el) => el?.classList?.contains?.("search-filter-chips"));

    // Allow native horizontal scrolling when scrolling horizontally over filter chips
    if (chipRow && (Math.abs(e.deltaX) >= Math.abs(e.deltaY) && e.deltaX !== 0)) {
      e.stopPropagation();
      return;
    }

    // Discriminate horizontal gestures across the header panel
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      return;
    }

    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (pinSearchHeaders || this.config?.pin_search_headers === true) {
      const results = this._getSearchResultsElement();
      if (results) {
        results.scrollTop += e.deltaY;
      }
      return;
    }
    this._applySearchHeaderDelta(e.deltaY);
  }

  _handleHeaderTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      this._headerTouchStartY = e.touches[0].clientY;
      this._headerTouchStartX = e.touches[0].clientX;
    }
  }

  _handleHeaderTouchMove(e, pinSearchHeaders) {
    if (pinSearchHeaders || this.config?.pin_search_headers === true || this._headerTouchStartY == null) return;
    if (!e.touches || e.touches.length !== 1) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - this._headerTouchStartY;
    const deltaX = currentX - this._headerTouchStartX;

    // Discriminate vertical gesture to avoid conflicting with horizontal chip scroll
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (e.cancelable) e.preventDefault();
      this._applySearchHeaderDelta(-deltaY);
      this._headerTouchStartY = currentY;
      this._headerTouchStartX = currentX;
    }
  }

  _handleHeaderTouchEnd() {
    this._headerTouchStartY = null;
    this._headerTouchStartX = null;
  }


  _handleSearchContainerWheel(e, pinSearchHeaders) {
    if (pinSearchHeaders || this.config?.pin_search_headers === true) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const headerHeight = this._getSearchHeaderHeight();
    const currentOffset = this._searchHeaderOffset || 0;
    if (e.deltaY < 0) {
      const results = this._getSearchResultsElement();
      if (!results || results.scrollTop <= 5) {
        if (e.cancelable) e.preventDefault();
        this._applySearchHeaderDelta(e.deltaY);
      }
    } else if (e.deltaY > 0 && currentOffset < headerHeight) {
      if (e.cancelable) e.preventDefault();
      this._applySearchHeaderDelta(e.deltaY);
    }
  }

  _handleSearchResultsWheel(e, pinSearchHeaders) {
    if (pinSearchHeaders || this.config?.pin_search_headers === true) return;
    const el = e.currentTarget || e.target;
    const scrollTop = el ? el.scrollTop : 0;
    if (e.deltaY < 0 && scrollTop <= 5) {
      if ((this._searchHeaderOffset || 0) > 0 && e.cancelable) {
        e.preventDefault();
      }
      this._applySearchHeaderDelta(e.deltaY);
    }
  }

  _handleResultsTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      this._resultsTouchStartY = e.touches[0].clientY;
      this._resultsTouchStartX = e.touches[0].clientX;
    }
  }

  _handleResultsTouchMove(e, pinSearchHeaders) {
    if (pinSearchHeaders || this.config?.pin_search_headers === true || this._resultsTouchStartY == null) return;
    if (!e.touches || e.touches.length !== 1) return;
    const el = e.currentTarget;
    const scrollTop = el ? el.scrollTop : 0;
    const deltaY = e.touches[0].clientY - this._resultsTouchStartY;
    const deltaX = e.touches[0].clientX - this._resultsTouchStartX;

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0 && scrollTop <= 5) {
      if ((this._searchHeaderOffset || 0) > 0 && e.cancelable) {
        e.preventDefault();
      }
      this._applySearchHeaderDelta(-deltaY);
      this._resultsTouchStartY = e.touches[0].clientY;
      this._resultsTouchStartX = e.touches[0].clientX;
    }
  }

  _handleResultsTouchEnd() {
    this._resultsTouchStartY = null;
    this._resultsTouchStartX = null;
  }

  // Check if a search result is clickable for hierarchical navigation
  _isClickableSearchResult(item) {
    if (!item) return false;
    // Always clickable if we are in a selection flow
    if (this._addToPlaylistTarget) return true;
    const currentHierarchyLevel = this._searchHierarchy[this._searchHierarchy.length - 1];
    if (currentHierarchyLevel?.type === 'select_track_for_playlist') return true;

    return !!item.is_browsable;
  }



  // Get the tooltip title for clickable search results
  _getSearchResultClickTitle(item) {
    if (!this._isClickableSearchResult(item)) return "";

    if (this._addToPlaylistTarget && item.media_class === 'playlist') {
      return localize('search.add_to_playlist');
    }

    // Track selection step for radio add-to-playlist
    const currentHierarchy = this._searchHierarchy[this._searchHierarchy.length - 1];
    if (currentHierarchy?.type === 'select_track_for_playlist' && (item.media_class === 'track' || item.media_content_type === 'track')) {
      const mockItem = this._getMockItemFromCurrentTrack();
      return localize('search.select_track_for_playlist', {
        '{track}': mockItem?.title || "",
        '{artist}': mockItem?.media_artist || ""
      });
    }

    return getSearchResultClickTitle(item);
  }

  // Force-invalidate the "Next Up" results cache
  _invalidateUpcomingCache() {
    // Force a reload of the queue to reflect server-side changes
    if (this._upcomingFilterActive) {
      // In strictly optimistic mode, we don't force a fetch here.
      // The local UI is already updated. The 20s heartbeat will eventually sync.
    } else {
      // If not active, just clear it so its fresh next time it opens
      const classFilter = this._searchMediaClassFilter || 'all';
      const cacheKey = `${classFilter}_upcoming_sort_default`;
      if (this._searchResultsByType) {
        delete this._searchResultsByType[cacheKey];
      }
      this.requestUpdate();
    }
  }

  _toggleRadioMode() {
    this._radioModeActive = !this._radioModeActive;
    this.requestUpdate();
  }

  // Toggle favorites filter - use existing _doSearch method with favorites parameter
  async _toggleFavoritesFilter() {
    const wasActive = this._favoritesFilterActive || this._initialFavoritesLoaded;
    this._favoritesFilterActive = !wasActive;

    // Make mutually exclusive with other filters
    if (this._favoritesFilterActive) {
      this._recentlyPlayedFilterActive = false;
      this._upcomingFilterActive = false;
      this._recommendationsFilterActive = false;
    }

    if (this._favoritesFilterActive) {
      // Use the existing _doSearch method with favorites parameter
      // This aligns with how initial favorites loading works
      const currentMediaType = this._searchMediaClassFilter;

      // FIX: Always use the structured search with favorites: true
      // This ensures we respect the current filter (e.g., Radio) and don't pass invalid 'favorites' media type
      try {
        await this._doSearch(currentMediaType, { favorites: true });
      } catch (error) {
        console.error('yamp: Error searching favorites:', error);
      }
    } else {
      // Favorites filter turned OFF:
      // We must reload the standard items for the current filter.
      const currentMediaType = this._searchMediaClassFilter;

      // FIX: Explicitly clear the persistence flags so _doSearch doesn't immediately re-enable favorites
      this._lastSearchUsedServerFavorites = false;
      this._initialFavoritesLoaded = false;

      // Pass clearFilters: true to ensure we don't pick up any lingering filter states from the isFavorites calculation
      await this._doSearch(currentMediaType, { clearFilters: true });
    }
  }

  // Toggle recently played filter
  async _toggleRecentlyPlayedFilter(forceState = null) {
    const targetState = typeof forceState === "boolean"
      ? forceState
      : !this._recentlyPlayedFilterActive;
    this._recentlyPlayedFilterActive = targetState;

    // Make mutually exclusive with other filters
    if (this._recentlyPlayedFilterActive) {
      this._favoritesFilterActive = false;
      this._upcomingFilterActive = false;
      this._recommendationsFilterActive = false;
      this._initialFavoritesLoaded = false; // Clear the initial favorites state
    }

    if (this._recentlyPlayedFilterActive) {
      // Clear search box since it's not used in recently played mode
      this._searchQuery = '';
      // Load recently played items
      try {
        const currentMediaType = this._searchMediaClassFilter || 'all';
        const targetFilter = this._keepFiltersOnSearch && currentMediaType !== 'favorites' ? currentMediaType : 'all';
        await this._doSearch(targetFilter, { isRecentlyPlayed: true, clearFilters: true });
      } catch (error) {
        console.error('yamp: Error in _doSearch for recently played:', error);
      }
    } else {
      // Restore original search results
      if (this._searchQuery && this._searchQuery.trim() !== '') {
        // Resubmit the original search without recently played filter
        const currentMediaType = this._searchMediaClassFilter;
        await this._doSearch(currentMediaType);
      } else {
        // Restore from cache or load favorites if no search query
        const currentMediaType = this._searchMediaClassFilter || 'all';
        if (this._restoreSearchResultsFromCache(currentMediaType)) {
          // Restored from cache
        } else if (this._keepFiltersOnSearch && currentMediaType !== 'all') {
          await this._doSearch(currentMediaType);
        } else {
          // No cache, load favorites as default
          await this._doSearch('favorites');
        }
      }
    }
  }

  // Toggle upcoming queue filter
  async _toggleUpcomingFilter(forceState = null) {
    if (!this.hass) return;

    if (forceState !== null) {
      this._upcomingFilterActive = forceState;
    } else {
      this._upcomingFilterActive = !this._upcomingFilterActive;
    }

    // Make mutually exclusive with other filters
    if (this._upcomingFilterActive) {
      this._favoritesFilterActive = false;
      this._recentlyPlayedFilterActive = false;
      this._recommendationsFilterActive = false;
      this._initialFavoritesLoaded = false; // Clear the initial favorites state
    }

    if (this._upcomingFilterActive) {
      // Clear search box since it's not used in upcoming mode
      this._searchQuery = '';
      // Clear cache to force fresh fetch
      const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming_sort_default`;
      delete this._searchResultsByType[cacheKey];
      // Subscribe to queue update events
      await this._subscribeToQueueUpdates();
      // Load upcoming queue items
      try {
        const currentMediaType = this._searchMediaClassFilter || 'all';
        const targetFilter = this._keepFiltersOnSearch && currentMediaType !== 'favorites' ? currentMediaType : 'all';
        await this._doSearch(targetFilter, { isUpcoming: true, clearFilters: true });
      } catch (error) {
        console.error('yamp: Error in _doSearch for upcoming queue:', error);
      }
    } else {
      // Unsubscribe from queue update events
      this._unsubscribeFromQueueUpdates();
      // Restore original search results
      if (this._searchQuery && this._searchQuery.trim() !== '') {
        // Resubmit the original search without upcoming filter
        const currentMediaType = this._searchMediaClassFilter;
        await this._doSearch(currentMediaType);
      } else {
        // Restore from cache or load favorites if no search query
        const currentMediaType = this._searchMediaClassFilter || 'all';
        if (this._restoreSearchResultsFromCache(currentMediaType)) {
          // Restored from cache
        } else if (this._keepFiltersOnSearch && currentMediaType !== 'all') {
          await this._doSearch(currentMediaType);
        } else {
          // No cache, load favorites as default
          await this._doSearch('favorites');
        }
      }
    }
  }

  // Toggle recommendations filter (mass_queue)
  async _toggleRecommendationsFilter(forceState = null) {
    const targetState = typeof forceState === "boolean"
      ? forceState
      : !this._recommendationsFilterActive;
    this._recommendationsFilterActive = targetState;

    if (this._recommendationsFilterActive) {
      this._favoritesFilterActive = false;
      this._recentlyPlayedFilterActive = false;
      this._upcomingFilterActive = false;
      this._initialFavoritesLoaded = false;
      this._searchQuery = '';

      try {
        const hasMassQueue = await this._isMassQueueIntegrationAvailable(this.hass);
        this._hasMassQueueIntegration = hasMassQueue;
        this._massQueueAvailable = hasMassQueue;

        if (!hasMassQueue) {
          this._recommendationsFilterActive = false;
          this._searchError = "Recommendations require the Music Assistant queue integration.";
          this.requestUpdate();
          return;
        }

        const targetFilter =
          this._keepFiltersOnSearch &&
          this._searchMediaClassFilter &&
          this._searchMediaClassFilter !== "favorites"
            ? this._searchMediaClassFilter
            : "all";

        await this._doSearch(targetFilter, { isRecommendations: true, clearFilters: true });
      } catch (error) {
        console.error('yamp: Error in _doSearch for recommendations:', error);
        this._searchError = "Unable to load recommendations.";
        this._recommendationsFilterActive = false;
        this.requestUpdate();
      }
    } else {
      if (this._searchQuery && this._searchQuery.trim() !== '') {
        const currentMediaType = this._searchMediaClassFilter;
        await this._doSearch(currentMediaType);
      } else {
        const currentMediaType = this._searchMediaClassFilter || 'all';
        if (this._restoreSearchResultsFromCache(currentMediaType)) {
          // Restored from cache
        } else if (this._keepFiltersOnSearch && currentMediaType !== 'all') {
          await this._doSearch(currentMediaType);
        } else {
          await this._doSearch('favorites');
        }
      }
    }
  }

  /**
   * Attempts to restore search results from cache based on the current media type.
   * @param {string} currentMediaType
   * @returns {boolean} True if restored from cache, false otherwise
   */
  _restoreSearchResultsFromCache(currentMediaType) {
    const sortMode = this._getActiveSearchDisplaySortMode();
    const cacheKey = `${currentMediaType}_sort_${sortMode}`;
    if (this._searchResultsByType[cacheKey] || this._searchResultsByType[currentMediaType]) {
      this._searchResults = this._sortSearchResults(
        this._searchResultsByType[cacheKey] || this._searchResultsByType[currentMediaType]
      );
      this.requestUpdate();
      return true;
    }
    return false;
  }

  // Get next track from Music Assistant (delegated to QueueController)
  async _getUpcomingQueue(hass, entityId, limit = 250) {
    return this._queueController.getUpcomingQueue(hass, entityId, limit);
  }

  // Get recommendations using mass_queue integration (delegated to QueueController)
  async _getRecommendations(hass, entityId, mediaType = null, limit = 20) {
    return this._queueController.getRecommendations(hass, entityId, mediaType, limit);
  }

  // Check if mass_queue integration is available and enabled (delegated to QueueController)
  async _isMassQueueIntegrationAvailable(hass) {
    return this._queueController.isMassQueueIntegrationAvailable(hass);
  }

  // Check if Music Assistant AI Radio shows are available
  async _checkAiRadioAvailability() {
    if (!this.hass) return;
    try {
      const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const searchEntityId = await this._resolveTemplateAtActionTime(
        searchEntityIdTemplate,
        this.currentEntityId
      );
      const available = await isAiRadioAvailable(this.hass, searchEntityId);
      if (this._aiRadioShowsAvailable !== available) {
        this._aiRadioShowsAvailable = available;
        this.requestUpdate();
      }
    } catch {
      this._aiRadioShowsAvailable = false;
    }
  }

  // Get queue using mass_queue integration (delegated to QueueController)
  async _getUpcomingQueueWithMassQueue(hass, entityId, limit = 250) {
    return this._queueController.getUpcomingQueueWithMassQueue(hass, entityId, limit);
  }

  // Queue reordering methods (delegated to QueueController)
  _enqueueQueueOperation(operationFn) {
    return this._queueController.enqueueQueueOperation(operationFn);
  }

  async _moveQueueItemUp(queueItemId) {
    return this._queueController.moveQueueItemUp(queueItemId);
  }

  async _moveQueueItemDown(queueItemId) {
    return this._queueController.moveQueueItemDown(queueItemId);
  }

  async _moveQueueItemNext(queueItemId) {
    return this._queueController.moveQueueItemNext(queueItemId);
  }

  async _removeQueueItem(queueItemId) {
    return this._queueController.removeQueueItem(queueItemId);
  }

  _showQueueError(message) {
    return this._queueController.showQueueError(message);
  }

  _moveQueueItemInUI(queueItemId, direction) {
    return this._queueController.moveQueueItemInUI(queueItemId, direction);
  }

  async _onQueueItemMoved(e) {
    return this._queueController.onQueueItemMoved(e);
  }

  _moveQueueItemInUIByIndex(oldIndex, newIndex) {
    return this._queueController.moveQueueItemInUIByIndex(oldIndex, newIndex);
  }

  _advanceQueueInUI(queueItemId = null, isManual = false) {
    return this._queueController.advanceQueueInUI(queueItemId, isManual);
  }

  _removeQueueItemFromUI(queueItemId) {
    return this._queueController.removeQueueItemFromUI(queueItemId);
  }

  _isMusicAssistantEntity() {
    return this._queueController.isMusicAssistantEntity();
  }

  _looksLikeMusicAssistantState(state) {
    if (!state) return false;
    return isMusicAssistantEntity(state);
  }

  // Check if current entity media content type is music
  _isMusicContentType() {
    const states = [
      this.metadataStateObj,
      this.currentActivePlaybackStateObj,
      this.currentPlaybackStateObj,
      this.currentStateObj,
      this._getMusicAssistantState(),
    ];
    for (const state of states) {
      const type = state?.attributes?.media_content_type;
      if (typeof type === "string" && type.trim().length > 0) {
        return type.trim().toLowerCase() === "music";
      }
    }
    return false;
  }

  _getTransferQueueTargets() {
    return this._queueController.getTransferQueueTargets();
  }

  _hasQueueInState(maState) {
    return this._queueController.hasQueueInState(maState);
  }

  async _updateTransferQueueAvailability({ refresh = false } = {}) {
    return this._queueController.updateTransferQueueAvailability({ refresh });
  }

  _canShowTransferQueueOption() {
    return this._queueController.canShowTransferQueueOption();
  }

  _openTransferQueue() {
    return this._queueController.openTransferQueue();
  }

  _closeTransferQueue() {
    return this._queueController.closeTransferQueue();
  }

  async _transferQueueTo(target) {
    return this._queueController.transferQueueTo(target);
  }

  _buildTransferQueuePayload(sourceId, targetId) {
    return this._queueController.buildTransferQueuePayload(sourceId, targetId);
  }

  _refreshQueue({ delayMs = 50 } = {}) {
    return this._queueController.refreshQueue({ delayMs });
  }

  async _subscribeToQueueUpdates() {
    return this._queueController.subscribeToQueueUpdates();
  }

  _unsubscribeFromQueueUpdates() {
    return this._queueController.unsubscribeFromQueueUpdates();
  }

  async _getUpcomingQueueOriginal(hass, entityId, limit = 20) {
    return this._queueController.getUpcomingQueueOriginal(hass, entityId, limit);
  }

  // Apply favorites filter to current results (called when switching filter chips)
  async _applyLocalFavoritesFilter(results = []) {
    if (!this._favoritesFilterActive) return results;

    const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);

    try {
      const favoritesResponse = await getFavorites(this.hass, searchEntityId, this._searchMediaClassFilter, this._getSearchResultsLimit());
      const favorites = favoritesResponse.results || [];

      // Create a set of favorite URIs for quick lookup
      const favoriteUris = new Set(favorites.map(fav => fav.media_content_id));

      // Filter current results to only show favorites
      return results.filter(item => favoriteUris.has(item.media_content_id));
    } catch (error) {
      // If favorites loading fails, just show current results
      return results;
    }
  }

  // Handle clicks on search result titles
  async _handleSearchResultClick(item, event) {
    if (this._isDragging) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      return;
    }
    if (!this._isClickableSearchResult(item)) return;


    // Radio flow: user is picking a track to resolve from search results
    const currentHierarchyLevel = this._searchHierarchy[this._searchHierarchy.length - 1];
    if (currentHierarchyLevel?.type === 'select_track_for_playlist' && (item.media_class === 'track' || item.media_content_type === 'track')) {
      // Use the selected real MA track and continue to playlist selection
      this._performSearchOptionAction(item, 'add_to_playlist');
      return;
    }

    if (this._addToPlaylistTarget && item.media_class === 'playlist') {
      this._loadingSearchRowMenuId = item.media_content_id;
      this.requestUpdate();

      try {
        const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
        const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
        const mqConfigEntryId = await getMassQueueConfigEntryId(this.hass, searchEntityId);
        if (mqConfigEntryId) {
          const playlistId = item.item_id || item.media_content_id?.split('/').pop();
          const servicePayload = {
            command: "music/playlists/add_playlist_tracks",
            data: {
              db_playlist_id: playlistId,
              uris: [this._addToPlaylistTarget.media_content_id]
            }
          };
          if (mqConfigEntryId && mqConfigEntryId !== "auto") {
            servicePayload.config_entry_id = mqConfigEntryId;
          }
          await this.hass.callService("mass_queue", "send_command", servicePayload);

          this._showSearchSuccessToast(item.media_content_id, 'playlist');
        }
      } catch (e) {
        console.error("Failed to add to playlist:", e);
        this._errorSearchRowMenuId = item.media_content_id;
        this.requestUpdate();
        setTimeout(() => {
          this._errorSearchRowMenuId = null;
          this.requestUpdate();
        }, 3000);
      } finally {
        this._loadingSearchRowMenuId = null;
        this.requestUpdate();
      }
      this._addToPlaylistTarget = null;
      setTimeout(() => {
        if (this._dismissMenuAfterPlaylistAdd) {
          this._closeEntityOptions();
          this._dismissMenuAfterPlaylistAdd = false;
        } else {
          this._goBackInSearch();
        }
      }, SUCCESS_MESSAGE_TIMEOUT_MS);
      return;
    }

    if (item.media_class === 'artist') {
      await this._searchArtistAlbums(item.title, item.media_content_id);
    } else if (item.media_class === 'album') {
      // Get artist name from hierarchy if we're viewing artist albums, or from item metadata if available
      let artistName = null;
      if (this._searchHierarchy.length > 0 && this._searchHierarchy[this._searchHierarchy.length - 1].type === 'artist') {
        artistName = this._searchHierarchy[this._searchHierarchy.length - 1].name;
      } else if (item.artist) {
        artistName = item.artist;
      }
      await this._searchAlbumTracks(item.title, artistName, item.media_content_id);
    } else if (item.media_class === 'track') {
      // Navigate to the album this track belongs to
      if (item.album) {
        await this._searchAlbumTracks(item.album, item.artist, item.album_uri);
      }
    } else if (item.media_class === 'playlist') {
      let playlistUri = item.media_content_id || item.uri || null;
      if (!playlistUri && this._isMusicAssistantEntity()) {
        try {
          const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
          const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
          playlistUri = await this._resolvePlaylistUri(item.title, searchEntityId);
        } catch (e) {
          console.warn("yamp: error resolving playlist URI:", e);
        }
      }
      await this._searchPlaylistTracks(item.title, playlistUri);
    }
  }

  // Stack-safe loader: fetches album tracks without modifying _searchHierarchy
  async _loadAlbumTracks(albumUri, albumName, artistName = null) {
    // Priority 1: Use mass_queue integration if available (preferred for Music Assistant)
    if (albumUri && (await this._isMassQueueIntegrationAvailable(this.hass))) {
      const mqTracks = await this._fetchMassQueueTracks(albumUri, "get_album_tracks");
      if (mqTracks && mqTracks.length > 0) {
        this._setSearchResultsFromMassQueue(mqTracks, "");
        return;
      }
    }

    // Priority 2: Use browse_media (fallback for non-mass_queue MA or other integration)
    if (albumUri && this._isMusicAssistantEntity()) {
      try {
        const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
        const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);

        const browseMsg = {
          type: "call_service",
          domain: "media_player",
          service: "browse_media",
          service_data: {
            entity_id: searchEntityId,
            media_content_id: albumUri,
          },
          return_response: true,
        };

        const browseRes = await this.hass.connection.sendMessagePromise(browseMsg);
        const browseResult = browseRes?.response?.[searchEntityId]?.result || browseRes?.result || {};
        const tracks = browseResult.children || [];

        if (tracks.length > 0) {
          this._searchQuery = "";
          this._searchResults = this._sortSearchResults(tracks);
          this._searchTotalRows = Math.max(15, tracks.length);
          this._searchAttempted = true;
          this._searchLoading = false;
          this.requestUpdate();
          return;
        }
      } catch (e) {
        console.error("yamp: Failed to browse album tracks:", e);
      }
    }

    // Fallback to search-based navigation
    this._searchQuery = "";

    // Clear filter states to ensure accurate album search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Pass artist and album as search parameters for more precise results
    const searchParams = { album: albumName, clearFilters: true };
    if (artistName) {
      searchParams.artist = artistName;
    }

    // Use Music Assistant search with specific parameters for tracks
    await this._doSearch('track', searchParams);
  }

  // Handle hierarchical search - search for tracks by album
  async _searchAlbumTracks(albumName, artistName, albumUri = null) {
    this._searchHierarchy.push({ type: 'album', name: albumName, query: this._searchQuery, uri: albumUri, filter: this._searchMediaClassFilter });
    this._searchBreadcrumb = `Tracks from ${albumName}`;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = "";
    this._searchMediaClassFilter = 'track';

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this._searchQuery = "";
    this.requestUpdate();

    // Remove swipe handlers when entering hierarchy
    this._removeSearchSwipeHandlers();

    await this._loadAlbumTracks(albumUri, albumName, artistName);
  }

  // Helper to load tracks for a playlist via mass_queue or browse_media
  async _loadPlaylistTracks(playlistUri, playlistName) {
    // Priority 1: Use mass_queue integration if available (preferred for Music Assistant)
    if (playlistUri && (await this._isMassQueueIntegrationAvailable(this.hass))) {
      const mqTracks = await this._fetchMassQueueTracks(playlistUri, "get_playlist_tracks");
      if (mqTracks && mqTracks.length > 0) {
        this._setSearchResultsFromMassQueue(mqTracks, "");
        return true;
      }
    }

    // Priority 2: Use browse_media (fallback for non-mass_queue MA or other integration)
    if (playlistUri && this._isMusicAssistantEntity()) {
      try {
        const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
        const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);

        const browseMsg = {
          type: "call_service",
          domain: "media_player",
          service: "browse_media",
          service_data: {
            entity_id: searchEntityId,
            media_content_id: playlistUri,
          },
          return_response: true,
        };

        const browseRes = await this.hass.connection.sendMessagePromise(browseMsg);
        const browseResult = browseRes?.response?.[searchEntityId]?.result || browseRes?.result || {};
        const tracks = browseResult.children || [];

        if (tracks.length > 0) {
          this._searchQuery = "";
          this._searchResults = this._sortSearchResults(tracks);
          this._searchTotalRows = Math.max(15, tracks.length);
          this._searchAttempted = true;
          this._searchLoading = false;
          this.requestUpdate();
          return true;
        }
      } catch (e) {
        console.error("yamp: Failed to browse playlist tracks:", e);
      }
    }

    this._searchQuery = "";
    this._searchResults = [];
    this._searchAttempted = true;
    this._searchLoading = false;
    this.requestUpdate();
    return false;
  }

  // Handle hierarchical search - search for tracks in a playlist
  async _searchPlaylistTracks(playlistName, playlistUri) {
    this._searchHierarchy.push({ type: 'playlist', name: playlistName, query: this._searchQuery, uri: playlistUri, filter: this._searchMediaClassFilter });
    this._searchBreadcrumb = `Tracks from ${playlistName}`;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = "";
    this._searchMediaClassFilter = 'track';

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this._searchQuery = "";
    this.requestUpdate();

    // Remove swipe handlers when entering hierarchy
    this._removeSearchSwipeHandlers();

    await this._loadPlaylistTracks(playlistUri, playlistName);
  }

  async _fetchMassQueueTracks(uri, serviceName) {
    return this._queueController.fetchMassQueueTracks(uri, serviceName);
  }

  _setSearchResultsFromMassQueue(tracks, queryName) {
    return this._queueController.setSearchResultsFromMassQueue(tracks, queryName);
  }



  // Notify Home Assistant to recalculate layout
  _notifyResize() {
    this.dispatchEvent(new Event("iron-resize", { bubbles: true, composed: true }));
  }

  _setupAdaptiveTextObserver() {
    if (!this._adaptiveText || this._textResizeObserver || typeof ResizeObserver === "undefined" || !this.isConnected) {
      return;
    }
    this._textResizeObserver = new ResizeObserver(() => this._updateAdaptiveTextScale());
    this._textResizeObserver.observe(/** @type {Element} */ (/** @type {unknown} */ (this)));
    this._updateAdaptiveTextScale();
  }

  _teardownAdaptiveTextObserver() {
    if (this._textResizeObserver) {
      this._textResizeObserver.disconnect();
      this._textResizeObserver = null;
    }
    this._currentTextScale = null;
    this._setAdaptiveTextVars(1, new Set());
  }

  _setAdaptiveTextVars(scale, overrideTargets, detailsScale) {
    if (!this.style) return;
    const targetSet = overrideTargets || this._adaptiveTextTargets;
    const safeScale = Number.isFinite(scale) ? scale : 1;
    const scaleString = safeScale.toFixed(2);
    this.style.setProperty("--yamp-text-scale", scaleString);
    for (const [target, varName] of Object.entries(ADAPTIVE_TEXT_VAR_MAP)) {
      const isActive = !!targetSet?.has(target);
      this.style.setProperty(varName, isActive ? scaleString : "1");
    }
    const detailActive = !!targetSet?.has("details");
    const safeDetailsScale = Number.isFinite(detailsScale) ? detailsScale : safeScale;
    const detailScaleString = detailActive ? safeDetailsScale.toFixed(2) : "1";
    const detailLineHeight = detailActive ? this._calculateDetailsLineHeight(safeDetailsScale) : 1.2;
    this.style.setProperty("--yamp-details-scale", detailScaleString);
    this.style.setProperty("--yamp-details-line-height", detailLineHeight.toFixed(2));
    const detailMaxLines = detailActive ? 1 : 3;
    this.style.setProperty("--yamp-details-max-lines", detailMaxLines.toString());
    this.style.setProperty("--yamp-details-line-clamp", detailActive ? "unset" : "3");
    this.style.setProperty("--yamp-details-display", detailActive ? "block" : "-webkit-box");
    this.style.setProperty("--yamp-details-white-space", detailActive ? "nowrap" : "normal");
    const lyricsActive = !!targetSet?.has("lyrics");
    this.style.setProperty("--yamp-text-scale-lyrics", lyricsActive ? safeDetailsScale.toFixed(2) : "1");
  }

  _updateAdaptiveTextObserverState() {
    if (this._adaptiveText && this.isConnected) {
      this._setupAdaptiveTextObserver();
    } else {
      this._teardownAdaptiveTextObserver();
    }
  }

  _handleGlobalScroll() {
    if (!this._adaptiveText) return;
    this._suspendAdaptiveScaling = true;
    this._pendingAdaptiveScaleUpdate = true;
    clearTimeout(this._adaptiveScrollTimer);
    this._adaptiveScrollTimer = setTimeout(() => {
      this._suspendAdaptiveScaling = false;
      if (this._pendingAdaptiveScaleUpdate) {
        this._pendingAdaptiveScaleUpdate = false;
        this._updateAdaptiveTextScale(true);
      }
    }, 400);
  }

  _handleViewportResize() {
    this._updateViewportFlags();
  }

  _updateViewportFlags() {
    if (typeof window === "undefined") return;
    const docWidth = typeof document !== "undefined" ? document.documentElement?.clientWidth : 0;
    const viewportWidth = window.innerWidth || docWidth || 0;
    const isNarrow = viewportWidth > 0 ? viewportWidth <= 520 : this._isNarrowViewport;
    const isMobile = this._isMobile;
    let needsUpdate = false;
    if (isNarrow !== this._isNarrowViewport) {
      this._isNarrowViewport = isNarrow;
      needsUpdate = true;
    }
    if (isMobile !== this._lastIsMobile) {
      this._lastIsMobile = isMobile;
      if (this._idleImageTemplate) this._idleImageTemplateNeedsResolve = true;
      if (this._backgroundImageTemplate) this._backgroundImageTemplateNeedsResolve = true;
      if (this._fontColorTemplate) this._fontColorTemplateNeedsResolve = true;
      needsUpdate = true;
    }
    if (needsUpdate) {
      this.requestUpdate();
    }
  }

  _updateAdaptiveTextScale(force = false) {
    if (!this._adaptiveText) return;
    if (this._suspendAdaptiveScaling && !force) {
      this._pendingAdaptiveScaleUpdate = true;
      return;
    }
    const rect = this.getBoundingClientRect();
    const width = rect?.width || 0;
    if (!width) return;
    const baselineHeight = this._getAdaptiveBaselineHeight(this._lastRenderedCollapsed || false);
    const height = rect?.height && rect.height > 0 ? rect.height : (baselineHeight || width);
    const widthFactor = width / 360;
    const heightFactor = height / 360;
    const blended = (widthFactor * 0.8) + (heightFactor * 0.2);
    const scale = Math.max(0.85, Math.min(1.4, blended));
    const detailScale = this._calculateDetailsScale(width, height);
    const textScaleChanged = this._currentTextScale === null || Math.abs(this._currentTextScale - scale) > 0.01;
    const detailScaleChanged = this._currentDetailsScale === null || Math.abs(this._currentDetailsScale - detailScale) > 0.02;
    if (!this._lyricsActive) {
      const lowerContentEl = this.shadowRoot?.querySelector('.card-lower-content');
      if (lowerContentEl && lowerContentEl.offsetHeight > 50) {
        this._lastNonLyricsLowerContentHeight = lowerContentEl.offsetHeight;
      }
    }
    if (textScaleChanged || detailScaleChanged) {
      this._currentTextScale = scale;
      this._currentDetailsScale = detailScale;
      this._setAdaptiveTextVars(scale, undefined, detailScale);
      this.requestUpdate();
    }
    this._updateMarquee();
  }

  _getTranslateX(element) {
    if (!element) return 0;
    const style = window.getComputedStyle(element);
    const transform = style.transform || style.webkitTransform;
    if (!transform || transform === "none") return 0;
    try {
      return new DOMMatrix(transform).m41;
    } catch {
      const match = transform.match(/matrix\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(",");
        return parseFloat(parts[4]) || 0;
      }
      return 0;
    }
  }

  _clearMarqueeResetTimer(container) {
    if (this._marqueeManualResetTimers?.has(container)) {
      clearTimeout(this._marqueeManualResetTimers.get(container));
      this._marqueeManualResetTimers.delete(container);
    }
  }

  _resetMarqueeManual(container, inner, resumeMarquee = true) {
    if (!container || !inner) return;
    this._clearMarqueeResetTimer(container);

    if (!container.hasAttribute("data-marquee-manual")) {
      container.removeAttribute("data-marquee-paused");
      container.removeAttribute("data-marquee-dragging");
      return;
    }

    inner.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    inner.style.transform = "translateX(0px)";

    let finished = false;
    const finishReset = () => {
      if (finished) return;
      finished = true;
      inner.removeEventListener("transitionend", onTransitionEnd);
      inner.style.transition = "";
      inner.style.transform = "";
      inner.style.opacity = "";
      container.removeAttribute("data-marquee-manual");
      container.removeAttribute("data-marquee-paused");
      container.removeAttribute("data-marquee-dragging");
      this._clearMarqueeResetTimer(container);

      if (resumeMarquee && this.isConnected && container.hasAttribute("data-marquee")) {
        if (container.hasAttribute("data-marquee-sequential")) {
          if (container.getAttribute("data-marquee-active") === "true") {
            container.removeAttribute("data-marquee-active");
            void container.offsetWidth;
            container.setAttribute("data-marquee-active", "true");
          } else {
            const activeEl = this.renderRoot?.querySelector(
              ".details [data-marquee-sequential='true'][data-marquee-active='true']"
            );
            if (!activeEl) {
              container.setAttribute("data-marquee-active", "true");
            }
          }
        }
      }
    };

    const onTransitionEnd = (e) => {
      if (e.target !== inner || e.propertyName !== "transform") return;
      finishReset();
    };

    inner.addEventListener("transitionend", onTransitionEnd);
    const fallbackTimer = setTimeout(finishReset, 450);
    this._marqueeManualResetTimers.set(container, fallbackTimer);
  }

  _setupMarqueeManualInteraction(info) {
    const { container, inner, overflow } = info;
    if (!container || !inner || overflow <= 4) return;

    let isPointerDown = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let startTransformX = 0;
    let hasMovedHorizontally = false;
    let isVerticalScroll = false;
    let lastClientX = 0;
    let lastTime = 0;
    let velocityX = 0;

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      this._clearMarqueeResetTimer(container);
      if (inner._clearMomentum) {
        inner._clearMomentum();
      }

      isPointerDown = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      lastClientX = e.clientX;
      lastTime = Date.now();
      velocityX = 0;
      hasMovedHorizontally = false;
      isVerticalScroll = false;

      if (container.hasAttribute("data-marquee-manual")) {
        inner.style.transition = "";
        startTransformX = this._getTranslateX(inner);
      } else {
        startTransformX = this._getTranslateX(inner);
        container.setAttribute("data-marquee-paused", "true");
      }
      currentX = startTransformX;
    };

    const onPointerMove = (e) => {
      if (!isPointerDown || e.pointerId !== pointerId) return;
      if (isVerticalScroll) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasMovedHorizontally) {
        if (Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx)) {
          isVerticalScroll = true;
          container.removeAttribute("data-marquee-paused");
          return;
        }
        if (Math.abs(dx) > 6) {
          hasMovedHorizontally = true;
          container.setAttribute("data-marquee-manual", "true");
          container.setAttribute("data-marquee-dragging", "true");
          inner.style.transition = "";
          inner.style.opacity = "1";
          try {
            if (container.setPointerCapture) {
              container.setPointerCapture(e.pointerId);
            }
          } catch {
            // Ignore capture failures on unsupported elements
          }
        }
      }

      if (hasMovedHorizontally) {
        if (e.cancelable) e.preventDefault();
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
          velocityX = (e.clientX - lastClientX) / dt;
          lastClientX = e.clientX;
          lastTime = now;
        }

        const maxScroll = -Math.ceil(overflow);
        const targetX = Math.min(0, Math.max(maxScroll, startTransformX + dx));
        currentX = targetX;
        inner.style.transform = `translateX(${targetX}px)`;
      }
    };

    const onPointerUp = (e) => {
      if (!isPointerDown || e.pointerId !== pointerId) return;
      isPointerDown = false;
      container.removeAttribute("data-marquee-dragging");

      try {
        if (container.hasPointerCapture && container.hasPointerCapture(pointerId)) {
          container.releasePointerCapture(pointerId);
        }
      } catch {
        // Ignore release failures
      }

      if (hasMovedHorizontally) {
        this._suppressMarqueeClick = true;
        if (this._suppressMarqueeClickTimer) {
          clearTimeout(this._suppressMarqueeClickTimer);
        }
        this._suppressMarqueeClickTimer = setTimeout(() => {
          this._suppressMarqueeClick = false;
        }, 350);

        const maxScroll = -Math.ceil(overflow);
        if (Math.abs(velocityX) > 0.25) {
          const momentumDist = velocityX * 160;
          const finalX = Math.min(0, Math.max(maxScroll, currentX + momentumDist));
          currentX = finalX;
          inner.style.transition = "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
          inner.style.transform = `translateX(${finalX}px)`;
          inner._clearMomentum = () => {
            inner.removeEventListener("transitionend", inner._clearMomentum);
            inner.style.transition = "";
            inner._clearMomentum = null;
          };
          inner.addEventListener("transitionend", inner._clearMomentum);
        }

        if (e.pointerType === "touch") {
          this._clearMarqueeResetTimer(container);
          const timer = setTimeout(() => {
            this._resetMarqueeManual(container, inner);
          }, 3000);
          this._marqueeManualResetTimers.set(container, timer);
        } else {
          // Desktop mouse: check if still hovered. If hovered, wait for mouseleave on .details.
          // Otherwise set a fallback timer in case mouse is already outside.
          const detailsEl = this.renderRoot?.querySelector(".details");
          const isHovered = detailsEl?.matches(":hover") || container.matches(":hover");
          if (!isHovered) {
            this._clearMarqueeResetTimer(container);
            const timer = setTimeout(() => {
              this._resetMarqueeManual(container, inner);
            }, 3000);
            this._marqueeManualResetTimers.set(container, timer);
          }
        }
      } else {
        container.removeAttribute("data-marquee-paused");
      }
    };

    const onWheel = (e) => {
      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontalScroll) return;

      this._clearMarqueeResetTimer(container);
      const rawDelta = e.deltaX;
      if (rawDelta === 0) return;

      let factor = 1;
      if (e.deltaMode === 1) factor = 20;
      else if (e.deltaMode === 2) factor = 100;
      const delta = rawDelta * factor;

      if (e.cancelable) e.preventDefault();

      if (!container.hasAttribute("data-marquee-manual")) {
        currentX = this._getTranslateX(inner);
        container.setAttribute("data-marquee-manual", "true");
        inner.style.transition = "";
        inner.style.opacity = "1";
        inner.style.transform = `translateX(${currentX}px)`;
      }

      const maxScroll = -Math.ceil(overflow);
      const targetX = Math.min(0, Math.max(maxScroll, currentX - delta));
      currentX = targetX;
      inner.style.transform = `translateX(${targetX}px)`;

      // If mouse is already outside, set an idle fallback timer.
      const detailsEl = this.renderRoot?.querySelector(".details");
      const isHovered = detailsEl?.matches(":hover") || container.matches(":hover");
      if (!isHovered) {
        const timer = setTimeout(() => {
          this._resetMarqueeManual(container, inner);
        }, 3000);
        this._marqueeManualResetTimers.set(container, timer);
      }
    };

    const onClickCapture = (e) => {
      if (this._suppressMarqueeClick) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("click", onClickCapture, true);

    this._marqueeCleanups.push(() => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("click", onClickCapture, true);
    });
  }

  _cleanupMarquee() {
    if (this._marqueeSequentialTimer) {
      clearTimeout(this._marqueeSequentialTimer);
      this._marqueeSequentialTimer = null;
    }
    if (this._marqueeAnimationEndHandler && this._marqueeObservedElements) {
      this._marqueeObservedElements.forEach((el) => {
        el.removeEventListener("animationend", this._marqueeAnimationEndHandler);
      });
      this._marqueeObservedElements = null;
    }
    if (this._marqueeCleanups) {
      this._marqueeCleanups.forEach((cleanup) => cleanup());
      this._marqueeCleanups = [];
    }
    if (this._marqueeManualResetTimers) {
      this._marqueeManualResetTimers.forEach((timer) => clearTimeout(timer));
      this._marqueeManualResetTimers.clear();
    }
    if (this._suppressMarqueeClickTimer) {
      clearTimeout(this._suppressMarqueeClickTimer);
      this._suppressMarqueeClickTimer = null;
    }
    this._suppressMarqueeClick = false;

    if (this.renderRoot) {
      const marqueeContainers = this.renderRoot.querySelectorAll(".details [data-marquee='true']");
      marqueeContainers.forEach((container) => {
        container.removeAttribute("data-marquee-manual");
        container.removeAttribute("data-marquee-paused");
        container.removeAttribute("data-marquee-dragging");
        const inner = container.querySelector(".marquee-inner");
        if (inner) {
          inner.style.transform = "";
          inner.style.transition = "";
          inner.style.opacity = "";
        }
      });
    }

    this._lastMarqueeKey = null;
  }

  _updateMarquee() {
    if (!this.isConnected || !this.renderRoot) return;

    const titleContainer = this.renderRoot.querySelector(".details .track-options-title");
    const artistContainer = this.renderRoot.querySelector(".details .artist");

    const getOverflowInfo = (container) => {
      if (!container) return { container: null, inner: null, overflow: 0, text: "" };
      const inner = container.querySelector(".marquee-inner");
      if (!inner) return { container, inner: null, overflow: 0, text: "" };
      const containerWidth = container.clientWidth;
      const contentWidth = inner.scrollWidth;
      const overflow = contentWidth - containerWidth;
      const text = inner.textContent || "";
      return { container, inner, overflow, text };
    };

    const titleInfo = getOverflowInfo(titleContainer);
    const artistInfo = getOverflowInfo(artistContainer);

    const titleOverflows = titleInfo.overflow > 4;
    const artistOverflows = artistInfo.overflow > 4;

    const marqueeKey = `${titleInfo.text}:${Math.round(titleInfo.overflow / 2) * 2}:${titleOverflows}|${artistInfo.text}:${Math.round(artistInfo.overflow / 2) * 2}:${artistOverflows}`;

    if (this._lastMarqueeKey === marqueeKey) {
      return;
    }

    this._cleanupMarquee();
    this._lastMarqueeKey = marqueeKey;

    const speed = 30; // pixels per second

    const applyMarqueeVars = (info) => {
      const scrollDuration = info.overflow / speed;
      const totalDuration = Math.max(5, Math.round((scrollDuration + 4.3) * 10) / 10);
      info.container.style.setProperty("--yamp-marquee-distance", `-${Math.ceil(info.overflow)}px`);
      info.container.style.setProperty("--yamp-marquee-duration", `${totalDuration}s`);
      info.container.setAttribute("data-marquee", "true");
    };

    const clearMarquee = (info) => {
      if (!info.container) return;
      info.container.removeAttribute("data-marquee");
      info.container.removeAttribute("data-marquee-sequential");
      info.container.removeAttribute("data-marquee-active");
      info.container.removeAttribute("data-marquee-manual");
      info.container.removeAttribute("data-marquee-paused");
      info.container.removeAttribute("data-marquee-dragging");
      info.container.style.removeProperty("--yamp-marquee-distance");
      info.container.style.removeProperty("--yamp-marquee-duration");
      if (info.inner) {
        info.inner.style.transform = "";
        info.inner.style.transition = "";
        info.inner.style.opacity = "";
      }
    };

    if (titleOverflows && artistOverflows) {
      // Both overflow: alternating sequential marquee mode
      applyMarqueeVars(titleInfo);
      applyMarqueeVars(artistInfo);
      titleInfo.container.setAttribute("data-marquee-sequential", "true");
      artistInfo.container.setAttribute("data-marquee-sequential", "true");

      // Start sequential animation with title active first
      titleInfo.container.setAttribute("data-marquee-active", "true");
      artistInfo.container.removeAttribute("data-marquee-active");

      this._setupMarqueeManualInteraction(titleInfo);
      this._setupMarqueeManualInteraction(artistInfo);

      const items = [titleInfo, artistInfo];
      let activeIndex = 0;

      this._marqueeAnimationEndHandler = (e) => {
        if (e.animationName !== "yamp-marquee") return;
        if (!this.isConnected || this._lastMarqueeKey !== marqueeKey) return;



        const current = items[activeIndex];
        if (current?.container) {
          current.container.removeAttribute("data-marquee-active");
        }

        activeIndex = (activeIndex + 1) % items.length;
        const next = items[activeIndex];

        this._marqueeSequentialTimer = setTimeout(() => {
          if (!this.isConnected || this._lastMarqueeKey !== marqueeKey) return;
          if (next?.container) {
            next.container.setAttribute("data-marquee-active", "true");
          }
        }, 600);
      };

      this._marqueeObservedElements = [titleInfo.inner, artistInfo.inner].filter(Boolean);
      this._marqueeObservedElements.forEach((innerEl) => {
        innerEl.addEventListener("animationend", this._marqueeAnimationEndHandler);
      });
    } else if (titleOverflows) {
      // Only title overflows: single infinite marquee
      applyMarqueeVars(titleInfo);
      titleInfo.container.removeAttribute("data-marquee-sequential");
      titleInfo.container.removeAttribute("data-marquee-active");
      clearMarquee(artistInfo);
      this._setupMarqueeManualInteraction(titleInfo);
    } else if (artistOverflows) {
      // Only artist overflows: single infinite marquee
      applyMarqueeVars(artistInfo);
      artistInfo.container.removeAttribute("data-marquee-sequential");
      artistInfo.container.removeAttribute("data-marquee-active");
      clearMarquee(titleInfo);
      this._setupMarqueeManualInteraction(artistInfo);
    } else {
      // Neither overflows
      clearMarquee(titleInfo);
      clearMarquee(artistInfo);
    }

    const detailsEl = this.renderRoot.querySelector(".details");
    if (detailsEl && (titleOverflows || artistOverflows)) {
      const onDetailsMouseLeave = () => {
        [titleInfo, artistInfo].forEach((info) => {
          if (info.container?.hasAttribute("data-marquee-manual")) {
            this._resetMarqueeManual(info.container, info.inner);
          }
        });
      };
      detailsEl.addEventListener("mouseleave", onDetailsMouseLeave);
      this._marqueeCleanups.push(() => {
        detailsEl.removeEventListener("mouseleave", onDetailsMouseLeave);
      });
    }
  }

  _calculateDetailsScale(width, height) {
    const targetSet = this._adaptiveTextTargets;
    if (!targetSet?.has("details")) return 1;

    // Width is the primary driver of text size because text expands horizontally.
    const widthFactor = width / 360;
    const desiredScale = Math.min(3.25, Math.max(1, widthFactor * 0.85 + 0.15));

    // Height acts as a physical constraint so the scaled text doesn't push the layout out of bounds.
    // We compute baseline height requirements dynamically based on what is rendered:
    const isSpacerRendered = this._lastSpacerRendered !== false;
    const isVolumeRendered = this._lastVolumeRendered !== false;

    // Exact baseline calculation:
    // Padding: 32px (16px top/bottom on card-lower-content)
    // Controls: 56px
    // Details unscaled baseline: 56px (48px min-height + 8px margin-top)
    let baselineNeeded = 32 + 56 + 56; // 144
    if (!this._alternateProgressBar) {
      const progressHeight = this.config?.progress_bar_height ?? 16;
      baselineNeeded += Number(progressHeight);
    }
    if (isSpacerRendered) baselineNeeded += 48;
    if (isVolumeRendered) baselineNeeded += 72;

    // Scale cost represents extra pixels needed per 1.0 scale factor
    // Details layout (min-height 48px, margin-top 8px) scales by 56px per 1.0 scale
    const scaleCost = 56;

    const maxHeightScale = Math.max(1, 1 + (height - baselineNeeded) / scaleCost);
    const maxScaleByHeight = Math.min(3.25, maxHeightScale);

    // The base scale must satisfy BOTH physical dimensions (width and height)
    let baseScale = Math.min(desiredScale, maxScaleByHeight);

    if (!isSpacerRendered) {
      // If spacer is missing, allow text to grow up to the height constraint to fill the void
      baseScale = maxScaleByHeight;
    }

    return Math.max(1, baseScale);
  }

  _calculateDetailsLineHeight(scale) {
    const clampedScale = Math.max(1, Math.min(scale, 2.6));
    const extra = Math.max(0, clampedScale - 1);
    // Allow line-height to rise gently from 1.2 to 1.55
    return Math.min(1.55, 1.2 + (extra * 0.35));
  }

  _getAdaptiveBaselineHeight(collapsed = false) {
    const raw = this._cardHeight;
    if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
      return raw;
    }
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed) {
        const parsed = Number(trimmed);
        if (Number.isFinite(parsed) && parsed > 0) {
          return parsed;
        }
      }
    }
    if (collapsed || this._alwaysCollapsed) {
      return this._collapsedBaselineHeight || 220;
    }
    return 350;
  }

  async _resolveIdleImageTemplate() {
    if (!this._idleImageTemplate || this._resolvingIdleImageTemplate || !this.hass) return;
    this._resolvingIdleImageTemplate = true;
    try {
      const context = this._getTemplateContext();
      const result = await resolveStringTemplate(this.hass, this._idleImageTemplate, context);
      this._idleImageTemplateResult = (result ?? "").toString().trim();
    } catch (error) {
      this._idleImageTemplateResult = "";
    } finally {
      this._resolvingIdleImageTemplate = false;
      this._idleImageTemplateNeedsResolve = false;
      this.requestUpdate();
    }
  }

  async _resolveBackgroundImageTemplate() {
    if (!this._backgroundImageTemplate || this._resolvingBackgroundImageTemplate || !this.hass) return;
    this._resolvingBackgroundImageTemplate = true;
    try {
      const context = this._getTemplateContext();
      const result = await resolveStringTemplate(this.hass, this._backgroundImageTemplate, context);
      this._backgroundImageTemplateResult = (result ?? "").toString().trim();
    } catch (error) {
      this._backgroundImageTemplateResult = "";
    } finally {
      this._resolvingBackgroundImageTemplate = false;
      this._backgroundImageTemplateNeedsResolve = false;
      this.requestUpdate();
    }
  }

  async _resolveFontColorTemplate() {
    if (!this._fontColorTemplate || this._resolvingFontColorTemplate || !this.hass) return;
    this._resolvingFontColorTemplate = true;
    try {
      const context = this._getTemplateContext();
      const result = await resolveStringTemplate(this.hass, this._fontColorTemplate, context);
      this._fontColorTemplateResult = (result ?? "").toString().trim();
    } catch (error) {
      this._fontColorTemplateResult = "";
    } finally {
      this._resolvingFontColorTemplate = false;
      this._fontColorTemplateNeedsResolve = false;
      this.requestUpdate();
    }
  }

  get _isMobile() {
    if (typeof window === "undefined") return false;
    const docWidth = typeof document !== "undefined" ? document.documentElement?.clientWidth : 0;
    const viewportWidth = window.innerWidth || docWidth || 0;
    const isMobileWidth = viewportWidth > 0 ? viewportWidth <= 768 : false;
    const isMobileUserAgent =
      typeof navigator !== "undefined" &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || "") ||
        (Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 1) && /Macintosh/i.test(navigator.userAgent || "")));
    return Boolean(isMobileWidth || isMobileUserAgent);
  }

  _getTemplateContext() {
    const isDarkMode = Boolean(
      this.hass?.themes?.darkMode ??
      (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
    );
    return {
      entity: this.currentEntityId || '',
      is_idle: this._isIdle,
      is_playing: this._isCurrentEntityPlaying(),
      is_search: this._showSearchInSheet,
      is_grouping: this._showGrouping,
      is_speakers_and_groups: this._showGrouping,
      is_group_players: this._showGrouping,
      is_source: this._showSourceList || this._showSourceMenu,
      is_lyrics: this._lyricsActive,
      is_options: this._showEntityOptions,
      is_transfer_queue: this._showGrouping || this._showTransferQueue,
      is_any_menu_open: this.isAnyMenuOpen,
      is_fullscreen: this._isFullScreen,
      is_full_screen: this._isFullScreen,
      is_dark_mode: isDarkMode,
      is_mobile: this._isMobile,
      is_music_assistant: this._isMusicAssistantEntity(),
      is_music: this._isMusicContentType(),
      current: this.currentActivePlaybackEntityId || this.currentEntityId || '',
    };
  }

  /**
   * Centralized idle state setter. Ensures _cardHeightTemplateNeedsResolve
   * is always flagged when the idle state changes, preventing missed
   * template updates.
   */
  _setIdleState(idle) {
    const targetIdle = this._idleTimeoutMs === 0 ? false : idle;
    if (this._isIdle === targetIdle) return;
    this._isIdle = targetIdle;
    if (this._cardHeightTemplate) this._cardHeightTemplateNeedsResolve = true;
  }
  _ensureArtworkOverrideIndexMap() {
    this._artworkController.ensureArtworkOverrideIndexMap();
  }

  _getArtworkOverrideCacheKey(override, type = "image", stateObj = null) {
    return this._artworkController.getArtworkOverrideCacheKey(override, type, stateObj);
  }

  _getResolvedArtworkOverrideSource(override, sourceValue, type = "image", stateObj = null) {
    return this._artworkController.getResolvedArtworkOverrideSource(override, sourceValue, type, stateObj);
  }

  _getCollapsedArtworkStyle() {
    return this._artworkController.getCollapsedArtworkStyle();
  }

  _getArtworkUrl(state, forceIdleImage = false, ignoreIdleImage = false) {
    return this._artworkController.getArtworkUrl(state, forceIdleImage, ignoreIdleImage);
  }

  _resolveSelectedArtwork(options) {
    return this._artworkController.resolveSelectedArtwork(options);
  }

  _getBackgroundSizeForFit(fit) {
    return this._artworkController.getBackgroundSizeForFit(fit);
  }

  _isExternalImageUrl(url) {
    return this._artworkController.isExternalImageUrl(url);
  }

  async _extractDominantColor(imgUrl) {
    return this._artworkController.extractDominantColor(imgUrl);
  }

  _updateArtworkAspectRatios() {
    this._artworkController.updateArtworkAspectRatios();
  }

  _calculateAspectRatio(url) {
    this._artworkController.calculateAspectRatio(url);
  }

  _normalizeAdaptiveTextTargets(config) {
    if (Array.isArray(config?.adaptive_text_targets)) {
      return config.adaptive_text_targets
        .map((item) => typeof item === "string" ? item.trim().toLowerCase() : "")
        .filter((item) => ADAPTIVE_TEXT_TARGETS.includes(item));
    }
    if (config?.adaptive_text === true) {
      return [...DEFAULT_ADAPTIVE_TEXT_TARGETS];
    }
    return [];
  }

  _normalizeImageSourceValue(value) {
    return this._artworkController.normalizeImageSourceValue(value);
  }

  _resolveImageUrlFromInput(input) {
    return this._artworkController.resolveImageUrlFromInput(input);
  }

  setConfig(rawConfig) {
    if (!rawConfig.entities || !Array.isArray(rawConfig.entities) || rawConfig.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    const oldConfig = this.config;
    const templateName = rawConfig.template || "custom";
    const templateBase = getTemplatePresetDefaults(templateName);
    const config = { ...templateBase, ...rawConfig };
    if (oldConfig?.lock_screen_controls !== config.lock_screen_controls) {
      this._mediaSessionOverride = null;
    }
    if (oldConfig?.full_screen !== config.full_screen) {
      this._fullScreenOverride = null;
    }
    this.config = config;
    if (this._cardType === "group_players") {
      this._showEntityOptions = true;
      this._setIdleState(false);
      this._showGrouping = true;
    } else if (this._cardType === "search") {
      this._showEntityOptions = true;
      this._setIdleState(false);
      this._showSearchSheetInOptions?.();
    } else if (this._cardType === "up_next") {
      this._showEntityOptions = true;
      this._setIdleState(false);
      this._showSearchSheetInOptions?.("next-up");
    } else if (this._cardType === "remote_control") {
      this._showEntityOptions = true;
      this._setIdleState(false);
      this._showRemoteControl = true;
    }
    this._cachedEntityIds = null;
    this._cachedEntityObjs = null;

    const actionHelpers = [];
    if (Array.isArray(config.actions)) {
      for (const act of config.actions) {
        if (act && typeof act === "object") {
          const helperId = act.entity || act.service_data?.entity_id;
          if (typeof helperId === "string" && helperId.includes(".")) {
            actionHelpers.push(helperId);
          }
        }
      }
    }
    this._actionHelperEntities = actionHelpers;

    const jsEntities = new Set();
    const scanForEntities = (val) => {
      if (typeof val === "string" && val.trim().startsWith("[[[")) {
        const matches = val.match(/[a-z0-9_]+\.[a-z0-9_]+/gi);
        if (matches) {
          for (const m of matches) {
            jsEntities.add(m.toLowerCase());
          }
        }
      } else if (val && typeof val === "object") {
        for (const k in val) {
          scanForEntities(val[k]);
        }
      }
    };
    scanForEntities(config);
    this._jsTemplateEntities = Array.from(jsEntities);
    this._swapPauseForStop = config.swap_pause_for_stop === true;
    this._holdToPin = !!config.hold_to_pin;
    this._disableSearchAutofocus = config.disable_autofocus === true;
    if (this._holdToPin) {
      this._holdHandler = createHoldToPinHandler({
        onPin: (idx) => this._pinChip(idx),
        onHoldEnd: () => { },
        holdTime: 650,
        moveThreshold: 8
      });
    }
    const newSelectedIndex = this._selectedIndex || 0;
    this._selectedIndex = (newSelectedIndex < this.entityIds.length) ? newSelectedIndex : 0;
    this._lastPlaying = null;
    this._lastActiveEntityId = null;
    const allowedFits = new Set(["cover", "contain", "fill", "scale-down", "none", "scaled-contain", "scaled-contain-alternate", "no_artwork"]);
    this._baseArtworkObjectFit = allowedFits.has(config.artwork_object_fit) ? config.artwork_object_fit : "cover";
    this._extendArtwork = config.extend_artwork === true;
    this._idleScreen = config.idle_screen || "default";
    this._idleScreenApplied = false;
    this._hasSeenPlayback = false;
    this._appearance = config.appearance || "automatic";
    if (this._isIdle) {
      this._applyIdleScreen();
    }

    this._updateHostAttributes();
    // Volume overlay toggle
    this._showVolumeOverlay = !!config.show_volume_overlay;
    // Collapse card when idle
    this._collapseOnIdle = !!config.collapse_on_idle;
    // Expand on search option (only available when always_collapsed is true)
    this._expandOnSearch = !!config.expand_on_search;
    // Alternate progress‑bar mode
    this._alternateProgressBar = !!config.alternate_progress_bar;
    // Display timestamps on progress bar
    this._displayTimestamps = !!config.display_timestamps;
    // Keep search filters on submit
    this._keepFiltersOnSearch = !!config.keep_filters_on_search;
    // Allow main controls to grow with available space
    this._adaptiveControls = config.adaptive_controls === true;
    // Allow typography to scale with available space
    const adaptiveTextTargets = this._normalizeAdaptiveTextTargets(config);
    this._adaptiveTextTargets = new Set(adaptiveTextTargets);
    this._adaptiveText = this._adaptiveTextTargets.size > 0;
    this._currentDetailsScale = null;
    this._updateAdaptiveTextObserverState();

    // Set default quick grouping mode based on config
    if (config.always_show_quick_group !== oldConfig?.always_show_quick_group) {
      this._quickGroupingMode = !!config.always_show_quick_group;
    }
    if (this._adaptiveText) {
      const initialScale = this._currentTextScale ?? 1;
      const initialDetailsScale = this._currentDetailsScale ?? 1;
      this._setAdaptiveTextVars(initialScale, undefined, initialDetailsScale);
      this._updateAdaptiveTextScale();
    } else {
      this._setAdaptiveTextVars(1, new Set(), 1);
    }
    this._hideActiveEntityLabel = config.hide_active_entity_label === true;
    this._hideActiveEntityLabelOnIdle = config.hide_active_entity_label_on_idle === true;
    this._artworkController.resetCaches();

    // Pre-compile wildcard regexes for artwork overrides
    if (Array.isArray(config.media_artwork_overrides)) {
      this.config.media_artwork_overrides = this._artworkController.compileArtworkOverrides(
        config.media_artwork_overrides
      );
    }
    // Handle idle image templates
    if (typeof config.idle_image === "string" &&
      (config.idle_image.includes("{{") || config.idle_image.includes("{%"))) {
      this._idleImageTemplate = config.idle_image;
      this._idleImageTemplateResult = "";
      this._idleImageTemplateNeedsResolve = true;
    } else {
      this._idleImageTemplate = null;
      this._idleImageTemplateResult = "";
      this._idleImageTemplateNeedsResolve = false;
    }
    // Handle background image templates
    if (typeof config.background_image === "string" &&
      (config.background_image.includes("{{") || config.background_image.includes("{%"))) {
      this._backgroundImageTemplate = config.background_image;
      this._backgroundImageTemplateResult = "";
      this._backgroundImageTemplateNeedsResolve = true;
    } else {
      this._backgroundImageTemplate = null;
      this._backgroundImageTemplateResult = "";
      this._backgroundImageTemplateNeedsResolve = false;
    }
    // Handle font color templates
    if (typeof config.font_color === "string" &&
      (config.font_color.includes("{{") || config.font_color.includes("{%"))) {
      this._fontColorTemplate = config.font_color;
      this._fontColorTemplateResult = "";
      this._fontColorTemplateNeedsResolve = true;
    } else {
      this._fontColorTemplate = null;
      this._fontColorTemplateResult = "";
      this._fontColorTemplateNeedsResolve = false;
    }
    // Handle card_height templates (similar to idle_image)
    // card_height now uses websocket template subscriptions
    // Set idle timeout ms
    let parsedIdle = 60000;
    if (config.idle_timeout_ms !== undefined && config.idle_timeout_ms !== null && config.idle_timeout_ms !== "") {
      const parsed = Number(config.idle_timeout_ms);
      if (!isNaN(parsed)) parsedIdle = Math.max(0, parsed);
    }
    this._idleTimeoutMs = parsedIdle;
    if (this._idleTimeoutMs === 0) {
      if (this._idleTimeout) {
        clearTimeout(this._idleTimeout);
        this._idleTimeout = null;
      }
      if (this._isIdle) {
        this._setIdleState(false);
        this._resetIdleScreen();
        this.requestUpdate();
      }
    }
    this._volumeStep = typeof config.volume_step === "number" ? config.volume_step : 0.05;
    this._volumeMode = config.volume_mode ?? "slider";
    if (config.always_show_lyrics === true) {
      this._lyricsActive = true;
    }
  }

  // Returns array of entity config objects, including group_volume if present in user config.
  get entityObjs() {
    if (this._cachedEntityObjs) {
      return this._cachedEntityObjs;
    }
    const entities = this.config?.entities || [];
    const configEntityIds = this.entityIds;
    this._cachedEntityObjs = entities.map((e, index) => {
      const entity_id = typeof e === "string" ? e : e.entity_id;
      const name = typeof e === "string" ? "" : (e.name || "");
      const volume_entity = typeof e === "string" ? undefined : e.volume_entity;
      const remote_entity = typeof e === "string" ? undefined : e.remote_entity;
      const music_assistant_entity = typeof e === "string" ? undefined : e.music_assistant_entity;
      const sync_power = typeof e === "string" ? false : !!e.sync_power;
      const follow_active_volume = typeof e === "string" ? false : !!e.follow_active_volume;
      const hidden_controls = typeof e === "string" ? undefined : e.hidden_controls;
      let group_volume;

      if (typeof e === "object" && typeof e.group_volume !== "undefined") {
        group_volume = e.group_volume;
      } else {
        // Determine group_volume default
        const state = this.hass?.states?.[entity_id];
        if (state && Array.isArray(state.attributes.group_members) && state.attributes.group_members.length > 0) {
          // Are any group members in entityIds?
          const otherMembers = state.attributes.group_members.filter(id => id !== entity_id);
          const visibleMembers = otherMembers.filter(id => configEntityIds.includes(id));
          group_volume = visibleMembers.length > 0;
        }
      }

      const entity_volume_mode = typeof e === "string" ? undefined : e.entity_volume_mode;
      const entity_volume_step = typeof e === "string" ? undefined : e.entity_volume_step;

      return {
        entity_id,
        name,
        volume_entity,
        remote_entity,
        music_assistant_entity,
        sync_power,
        follow_active_volume,
        hidden_controls,
        hidden_filter_chips: typeof e === "string" ? undefined : e.hidden_filter_chips,
        hide_remote_buttons: typeof e === "string" ? undefined : e.hide_remote_buttons,
        hidden_menu_options: typeof e === "string" ? undefined : (e.hidden_menu_options ?? e.hide_menu_options),
        hide_menu_options: typeof e === "string" ? undefined : (e.hidden_menu_options ?? e.hide_menu_options),
        disable_auto_select: this._isAutoSelectDisabled(index),
        prefer_ma_metadata: typeof e === "string" ? false : !!e.prefer_ma_metadata,
        ...(typeof group_volume !== "undefined" ? { group_volume } : {}),
        ...(entity_volume_mode ? { entity_volume_mode } : {}),
        ...(typeof entity_volume_step === "number" ? { entity_volume_step } : {})
      };
    });
    return this._cachedEntityObjs;
  }


  // Unified entity resolution system
  _getEntityForPurpose(idx, purpose) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;

    switch (purpose) {
      case 'volume_control':
        // For volume control: follow active entity if enabled, otherwise use volume_entity or main entity
        if (obj.follow_active_volume) {
          return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
        }
        return this._resolveEntity(obj.volume_entity, obj.entity_id, idx, 'vol') || obj.entity_id;

      case 'playback_control':
        // For playback controls: use the entity that is actually playing
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;

      case 'sorting':
        // For chip sorting: use active playback entity (MA entity if playing, otherwise main entity)
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;

      case 'metadata':
        // For metadata: use MA entity if prefer_ma_metadata is enabled, otherwise use active playback entity
        if (obj.prefer_ma_metadata) {
          return this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx) || obj.entity_id;
        }
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;

      default:
        return obj.entity_id;
    }
  }

  // Helper to resolve template entities
  _resolveEntity(entityTemplate, fallbackEntityId, idx, cacheType = 'ma') {
    return this._templateController.resolveEntity(entityTemplate, fallbackEntityId, idx, cacheType);
  }

  // Helper to determine if main and paired MA entities are playing the same media
  _areEntitiesPlayingSameMedia(mainState, maState) {
    return areEntitiesPlayingSameMedia(mainState, maState);
  }

  // Get active playback entity for a specific index
  _getActivePlaybackEntityForIndex(idx) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;

    const mainId = obj.entity_id;
    const maId = this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx);
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    const maState = maId ? this.hass?.states?.[maId] : null;





    if (maId === mainId) return mainId;



    return this._getActivePlaybackEntityForIndexInternal(idx, mainId, maId, mainState, maState);
  }

  // Internal method to avoid recursion
  _getActivePlaybackEntityForIndexInternal(idx, mainId, maId, mainState, maState) {
    const lastResolved = this._lastResolvedEntityIdByChip[idx];

    // Helper to return and track
    const resolve = (id) => {
      this._lastResolvedEntityIdByChip[idx] = id;
      return id;
    };

    // Check for manual override from More Info sheet first
    const manualId = this._manualActiveEntityByChip?.[idx];
    if (manualId) {
      const manualState = this.hass?.states?.[manualId];
      if (manualState && manualState.state !== "unavailable") {
        return resolve(manualId);
      }
      delete this._manualActiveEntityByChip[idx];
    }

    // Check for linger first - if we recently paused MA, stay on MA unless main entity is playing
    const linger = this._playbackLingerByIdx?.[idx];
    const now = Date.now();
    if (linger && linger.until > now) {
      // If main entity is playing AND was recently controlled, prioritize it over linger
      if (this._isEntityPlaying(mainState) && this._lastPlayingEntityIdByChip?.[idx] === mainId) {
        return resolve(mainId);
      }
      // Only resolve to linger entity if it actually exists in HA
      if (this.hass?.states?.[linger.entityId]) {
        return resolve(linger.entityId);
      }
    }
    // Clear expired linger
    if (linger && linger.until <= now) {
      delete this._playbackLingerByIdx[idx];
    }

    // Prioritize the entity that is actually playing
    const maPlaying = this._isEntityPlaying(maState);
    const mainPlaying = this._isEntityPlaying(mainState);

    // If both are playing, prioritize main entity if they are playing the same thing; otherwise be sticky
    if (maPlaying && mainPlaying) {
      if (this._areEntitiesPlayingSameMedia(mainState, maState)) {
        return resolve(mainId);
      }
      if (lastResolved === mainId) return resolve(mainId);
      if (lastResolved === maId) return resolve(maId);
      return resolve(maId); // Default to MA
    }
    if (maPlaying) return resolve(maId);
    if (mainPlaying) return resolve(mainId);

    // When neither is playing, check if one was recently controlled for this specific chip
    const lastPlayingForChip = this._lastPlayingEntityIdByChip?.[idx];
    if (lastPlayingForChip === maId && maState) return resolve(maId);
    if (lastPlayingForChip === mainId) return resolve(mainId);

    // Default to Music Assistant entity if configured, otherwise main entity
    // Stickiness Fix: Prefer staying on whichever entity we were already showing if it's still "active"
    if (maId && maId !== mainId) {
      const maVisible = maId === lastResolved;
      const mainVisible = mainId === lastResolved;

      // If we were showing main and it's still "active" (on, paused, or has metadata), stick with it
      if (mainVisible && mainState && (mainState.state !== "off" && mainState.state !== "unavailable")) {
        return resolve(mainId);
      }

      // If we were showing MA and it's still "active", stick with it
      if (maVisible && maState && (maState.state !== "off" && maState.state !== "unavailable")) {
        return resolve(maId);
      }

      // Default to MA if it actually exists in HA, otherwise fall back to main entity
      return resolve(maState ? maId : mainId);
    } else {
      return resolve(mainId);
    }
  }

  // Legacy methods for backward compatibility
  _getVolumeEntity(idx) {
    return this._getEntityForPurpose(idx, 'volume_control');
  }

  // Returns the effective volume mode for the active entity, preferring per-entity override
  _getEffectiveVolumeMode() {
    const obj = this.entityObjs?.[this._selectedIndex];
    return obj?.entity_volume_mode || this._volumeMode;
  }

  // Returns the effective volume step for the active entity, preferring per-entity override
  _getEffectiveVolumeStep() {
    const obj = this.entityObjs?.[this._selectedIndex];
    return typeof obj?.entity_volume_step === "number" ? obj.entity_volume_step : this._volumeStep;
  }

  // Resolve a grouping member ID to its configured entity index (synchronous and cache-based)
  _resolveEntityIdxByGroupingId(groupingEntityId) {
    const objs = this.entityObjs;
    for (let i = 0; i < objs.length; i++) {
      if (this._getGroupingEntityId(i) === groupingEntityId) return i;
      const resolvedId = this._resolveMaEntityForObj(objs[i], i);
      if (resolvedId === groupingEntityId || objs[i].entity_id === groupingEntityId) return i;
    }
    return -1;
  }

  // Helper to resolve the Music Assistant entity for a given entityObj (synchronous and cache-based)
  _resolveMaEntityForObj(obj, idx) {
    if (!obj) return null;
    return this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx) || obj.entity_id;
  }

  // Prefer Music Assistant entity for search/grouping if configured
  _getSearchEntityId(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj?.entity_id;

    // Check if it's a template
    if (
      typeof obj.music_assistant_entity === 'string' &&
      (obj.music_assistant_entity.includes('{{') ||
        obj.music_assistant_entity.includes('{%') ||
        obj.music_assistant_entity.trim().startsWith('[[['))
    ) {
      // For templates, resolve at action time - return template string for now
      return obj.music_assistant_entity;
    }

    return this._getActualResolvedMaEntityForState(idx);
  }
  // Prefer Music Assistant entity for playback controls (play/pause/seek/etc.) if configured
  _getPlaybackEntityId(idx) {
    return this._getEntityForPurpose(idx, 'playback_control');
  }
  // Choose the active playback target dynamically: prefer the entity that is currently playing
  _getActivePlaybackEntityId(idx = this._selectedIndex) {
    const obj = this.entityObjs?.[idx];
    if (!obj) return null;
    const mainId = obj.entity_id;
    const maId = this._getActualResolvedMaEntityForState(idx);
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    const maState = maId ? this.hass?.states?.[maId] : null;

    return this._getActivePlaybackEntityIdInternal(idx, mainId, maId, mainState, maState);
  }

  _getActivePlaybackEntityIdInternal(idx, mainId, maId, mainState, maState) {
    // Check for manual override from More Info sheet first
    const manualId = this._manualActiveEntityByChip?.[idx];
    if (manualId) {
      const manualState = this.hass?.states?.[manualId];
      if (manualState && manualState.state !== "unavailable") {
        this._lastActiveEntityIdByChip[idx] = manualId;
        return manualId;
      }
      delete this._manualActiveEntityByChip[idx];
    }

    if (maId === mainId) return mainId;

    const now = Date.now();
    const maPlayTime = this._playTimestamps?.[maId] || 0;
    const mainPlayTime = this._playTimestamps?.[mainId] || 0;

    // A conflict occurs if one entity is playing but the other STOPPED recently (< 5s).
    // Transition detection: check if state changed from "playing" since last updated() run.
    const maWasPlayingUntilNow = this._playerStateCache[maId] === "playing" && maState?.state !== "playing";
    const mainWasPlayingUntilNow = this._playerStateCache[mainId] === "playing" && mainState?.state !== "playing";

    const maWasRecent = maWasPlayingUntilNow || (now - maPlayTime) < 5000;
    const mainWasRecent = mainWasPlayingUntilNow || (now - mainPlayTime) < 5000;

    const maPlaying = this._isEntityPlaying(maState);
    const mainPlaying = this._isEntityPlaying(mainState);

    // If both are playing the same thing, prioritize the main entity
    if (maPlaying && mainPlaying && this._areEntitiesPlayingSameMedia(mainState, maState)) {
      this._lastActiveEntityIdByChip[idx] = mainId;
      return mainId;
    }

    // Prioritize the Music Assistant entity when it's playing
    if (maPlaying) {
      this._lastActiveEntityIdByChip[idx] = maId;
      return maId;
    }

    // Debounce: Stay on MA if it stopped recently, even if Main is playing.
    if (maWasRecent && maState?.state !== "playing") {
      return maId;
    }

    // Prioritize the main entity when it's playing
    if (this._isEntityPlaying(mainState)) {
      this._lastActiveEntityIdByChip[idx] = mainId;
      return mainId;
    }

    // Debounce: Stay on Main if it stopped recently, even if MA is playing.
    if (mainWasRecent && mainState?.state !== "playing") {
      return mainId;
    }

    // Persistence: If no one is playing, stay on the last active entity for this chip indefinitely.
    const lastActiveForChip = this._lastActiveEntityIdByChip?.[idx];
    if (lastActiveForChip && (lastActiveForChip === maId || lastActiveForChip === mainId)) {
      return lastActiveForChip;
    }

    // Absolute fallback: music assistant entity if configured, otherwise main.
    return (maId && maId !== mainId) ? maId : mainId;
  }

  // Get hidden controls configuration for the current entity
  _getHiddenControlsForCurrentEntity() {
    const currentEntityObj = this.entityObjs[this._selectedIndex];
    let rawHiddenControls = currentEntityObj?.hidden_controls;

    const cached = this._hiddenControlsResolveCache?.[this._selectedIndex]?.value;
    if (cached !== undefined) {
      rawHiddenControls = cached;
    }

    if (!rawHiddenControls) {
      return {};
    }

    if (typeof rawHiddenControls === 'string') {
      try {
        rawHiddenControls = JSON.parse(rawHiddenControls.replace(/'/g, '"'));
      } catch (e) {
        rawHiddenControls = rawHiddenControls.split(',').map(s => s.trim());
      }
    }

    // Convert array format to object format for compatibility
    const hiddenControls = {};
    if (Array.isArray(rawHiddenControls)) {
      rawHiddenControls.forEach(control => {
        hiddenControls[control] = true;
      });
    } else if (typeof rawHiddenControls === 'object') {
      // Handle object format as well
      Object.assign(hiddenControls, rawHiddenControls);
    }

    return hiddenControls;
  }

  // Get the active playback entity for a specific entity index (for follow_active_volume)
  _getActivePlaybackEntityIdForIndex(idx) {
    return this._getActivePlaybackEntityId(idx);
  }
  _getGroupingEntityId(idx) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    const mainId = obj.entity_id;
    let candidateId = null;
    if (obj.music_assistant_entity) {
      if (
        typeof obj.music_assistant_entity === 'string' &&
        (obj.music_assistant_entity.includes('{{') ||
          obj.music_assistant_entity.includes('{%') ||
          obj.music_assistant_entity.trim().startsWith('[[['))
      ) {
        const cached = this._maResolveCache?.[idx]?.id;
        candidateId = cached || mainId;
      } else {
        candidateId = obj.music_assistant_entity;
      }
    }
    if (!candidateId || candidateId === mainId) {
      return mainId;
    }
    const candidateState = this.hass?.states?.[candidateId];
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    if (
      mainState &&
      this._isGroupCapable(mainState) &&
      (!candidateState || !this._isGroupCapable(candidateState))
    ) {
      return mainId;
    }
    return candidateId;
  }

  _getGroupingEntityIdByEntityId(entityId) {
    const idx = this.entityIds.indexOf(entityId);
    if (idx < 0) return entityId;
    return this._getGroupingEntityId(idx);
  }
  _findEntityObjByAnyId(anyId) {
    return this.entityObjs.find(o => o.entity_id === anyId || o.music_assistant_entity === anyId) || null;
  }

  // Resolve Jinja template for music_assistant_entity with fallback to main entity
  _resolveMusicAssistantEntity(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj?.entity_id;

    try {
      // Check if it's a template (contains Jinja syntax)
      if (typeof obj.music_assistant_entity === 'string' &&
        (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
        // For now, return the template string - it will be resolved at action time
        // This allows dynamic switching based on criteria
        return obj.music_assistant_entity;
      }

      // Not a template, return as-is
      return obj.music_assistant_entity;
    } catch (error) {
      return obj.entity_id; // Fallback to main entity
    }
  }



  // Return grouping key
  _getGroupKey(id) {
    // Use the grouping entity (e.g., Music Assistant) for membership
    const groupingId = this._getGroupingEntityIdByEntityId(id);
    const st = this.hass?.states?.[groupingId];
    if (!st) return id;

    // If this entity isn't group capable (or is a preset group), treat it as its own group
    if (!this._isGroupCapable(st)) {
      return id;
    }

    const membersRaw = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members
      : [];

    // If no group members or just itself, it's not grouped
    if (membersRaw.length <= 1) return id;

    // First member is the master
    const masterGroupingId = membersRaw[0];

    // Check if the master is group capable (if it's a preset group, it won't be)
    const masterState = this.hass?.states?.[masterGroupingId];
    if (!this._isGroupCapable(masterState)) {
      return id;
    }

    // Find configured entity corresponding to this master grouping ID
    const masterEntityId = this.entityIds.find(eId => {
      const gId = this._getGroupingEntityIdByEntityId(eId);
      return gId === masterGroupingId;
    });

    // If master is not in our config, return the raw grouping ID so we know it's external/different
    return masterEntityId || masterGroupingId;
  }

  get entityIds() {
    if (!this._cachedEntityIds) {
      this._cachedEntityIds = (this.config?.entities || []).map(e =>
        typeof e === "string" ? e : e.entity_id
      );
    }
    return this._cachedEntityIds;
  }

  // Return display name for a chip/entity
  getChipName(entity_id) {
    const obj = this.entityObjs.find(e => e.entity_id === entity_id);
    if (obj && obj.name) return obj.name;
    const state = this.hass?.states?.[entity_id];
    return getEntityName(this.hass, state || entity_id);
  }

  // Return group master (includes all others in group_members)
  _getActualGroupMaster(group) {
    if (!group || !group.length) return null;
    if (!this.hass || group.length === 1) return group[0];
    // If _lastGroupingMasterId is present in this group, prefer it as master
    if (this._lastGroupingMasterId && group.includes(this._lastGroupingMasterId)) {
      return this._lastGroupingMasterId;
    }
    // Build candidate list with resolved grouping entity states
    const candidates = group
      .map(id => {
        const groupingId = this._getGroupingEntityIdByEntityId(id);
        const state = groupingId ? this.hass.states[groupingId] : null;
        return state ? { id, groupingId, state } : null;
      })
      .filter(Boolean);

    if (!candidates.length) {
      return group[0];
    }

    // User requested simplification: First item in group_members is the master.
    // Try to find a valid group definition from any of the candidates
    for (const candidate of candidates) {
      const members = candidate.state?.attributes?.group_members;
      if (Array.isArray(members) && members.length > 0) {
        const masterGroupingId = members[0];
        // Find the entity in our candidates that matches this master grouping ID
        const master = candidates.find(c => c.groupingId === masterGroupingId);
        if (master) {
          return master.id;
        }
      }
    }

    // Last resort, fall back to first entry (keeps legacy behaviour)
    return group[0];
  }

  _getGroupingMasterId() {
    if (!this.entityIds || !this.entityIds.length) return null;
    const groups = this.groupedSortedEntityIds || [];
    const currentId = this.currentEntityId || this.entityIds[0];

    let preferred = currentId;
    if (this._lastGroupingMasterId && this.entityIds.includes(this._lastGroupingMasterId)) {
      const lastGroup = groups.find(g => g.includes(this._lastGroupingMasterId));
      // Only stick to the last group if the *current* entity is actually part of it.
      // Otherwise, we've switched context to a different entity (e.g. ungrouped one).
      if (lastGroup && lastGroup.length > 1 && lastGroup.includes(currentId)) {
        preferred = this._lastGroupingMasterId;
      }
    }

    const group = preferred ? groups.find(g => g.includes(preferred)) : null;
    if (group && group.length > 1) {
      const actual = this._getActualGroupMaster(group);
      if (actual && this.entityIds.includes(actual)) {
        return actual;
      }
    }
    return preferred;
  }

  _getGroupingMasterIndex() {
    const masterId = this._getGroupingMasterId();
    return masterId ? this.entityIds.indexOf(masterId) : -1;
  }

  _getGroupingMasterObj() {
    const idx = this._getGroupingMasterIndex();
    return idx >= 0 ? this.entityObjs[idx] : null;
  }

  _isActiveChipGrouped(idx) {
    if (!this.entityIds || idx < 0 || idx >= this.entityIds.length) return false;
    const currentId = this.entityIds[idx];
    if (!currentId) return false;
    const groups = this.groupedSortedEntityIds || [];
    const activeGroup = groups.find(g => g.includes(currentId));
    return !!(activeGroup && activeGroup.length > 1);
  }

  _resolveGroupingEntityId(obj, fallbackEntityId) {
    let idx = -1;
    if (fallbackEntityId) {
      idx = this.entityIds.indexOf(fallbackEntityId);
    }
    if (idx < 0 && obj) {
      idx = this.entityObjs.indexOf(obj);
    }
    if (idx >= 0) {
      return this._getGroupingEntityId(idx);
    }
    const mainId = fallbackEntityId || obj?.entity_id || null;
    let candidateId = obj?.music_assistant_entity || null;
    if (!candidateId || candidateId === mainId) return mainId;
    const candidateState = this.hass?.states?.[candidateId];
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    if (
      mainState &&
      this._isGroupCapable(mainState) &&
      (!candidateState || !this._isGroupCapable(candidateState))
    ) {
      return mainId;
    }
    return candidateId;
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
    // Cache the result to prevent continuous re-calling during renders
    // Only recalculate if the cache is invalid or if key state has changed
    const cacheKey = `${this._selectedIndex}-${this.hass?.states?.[this.currentEntityId]?.state}-${this.hass?.states?.[this._getSearchEntityId(this._selectedIndex)]?.state}-${this._manualActiveEntityByChip?.[this._selectedIndex] || ""}`;

    if (this._cachedActivePlaybackEntityId === undefined || this._cachedActivePlaybackEntityKey !== cacheKey) {
      this._cachedActivePlaybackEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
      this._cachedActivePlaybackEntityKey = cacheKey;
    }
    return this._cachedActivePlaybackEntityId;
  }

  get metadataStateObj() {
    const id = this._getEntityForPurpose(this._selectedIndex, 'metadata');
    return id ? this.hass?.states?.[id] : null;
  }

  get currentActivePlaybackStateObj() {
    const id = this.currentActivePlaybackEntityId;
    return id ? this.hass?.states?.[id] : null;
  }

  get currentVolumeStateObj() {
    const entityId = this._getVolumeEntity(this._selectedIndex);
    return entityId ? this.hass.states[entityId] : null;
  }

  get isAnyMenuOpen() {
    return (
      this._showEntityOptions ||
      this._showGrouping ||
      this._showSourceList ||
      this._showTransferQueue ||
      this._showResolvedEntities ||
      this._showSearchInSheet ||
      this._showSourceMenu ||
      !!this._searchActiveOptionsItem ||
      !!this._activeSearchRowMenuId ||
      !!this._queueActionsMenuOpenId
    );
  }

  get _isSelectionFlow() {
    return !!this._addToPlaylistTarget || !!this._searchHierarchy.some(h => h.type === 'select_track_for_playlist');
  }

  /** Whether the mini grid menu layout is active (always_collapsed + no expand_on_search + mini menus enabled). */
  get _isGridMode() {
    return this._alwaysCollapsed && (!this._expandOnSearch || !this._showSearchInSheet) && !this.config.disable_mini_menu;
  }

  _renderMainMenu(sourceList, menuOnlyActions, showChipsInMenu) {
    return renderMainMenu.call(this, sourceList, menuOnlyActions, showChipsInMenu);
  }

  _renderOptionsOverlay(props) {
    return renderOptionsOverlay.call(this, props);
  }

  _getChipRowProps() {
    return {
      groupedSortedEntityIds: this.groupedSortedEntityIds,
      entityIds: this.entityIds,
      selectedEntityId: this.currentEntityId,
      pinnedIndex: this._pinnedIndex,
      holdToPin: this._holdToPin,
      getChipName: (id) => this.getChipName(id),
      getActualGroupMaster: (group) => this._getActualGroupMaster(group),
      artworkHostname: this.config?.artwork_hostname || '',
      mediaArtworkOverrides: this.config?.media_artwork_overrides || [],
      fallbackArtwork: this.config?.fallback_artwork || null,
      getIsChipPlaying: (id, isSelected) => {
        const idx = this.entityIds.indexOf(id);
        if (idx < 0) return false;
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = this.hass?.states?.[playbackEntityId];
        return this._isEntityPlaying(playbackState);
      },
      getChipArt: (id) => {
        const idx = this.entityIds.indexOf(id);
        if (idx < 0) return null;
        const metadataEntityId = this._getEntityForPurpose(idx, 'metadata');
        const metadataState = this.hass?.states?.[metadataEntityId];
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = this.hass?.states?.[playbackEntityId];
        const mainState = this.hass?.states?.[id];
        const metadataArtwork = this._getArtworkUrl(metadataState);
        const playbackArtwork = this._getArtworkUrl(playbackState);
        const mainArtwork = this._getArtworkUrl(mainState);

        const isPlayingSameMedia = this._areEntitiesPlayingSameMedia(mainState, playbackState);

        const metaTitle = metadataState?.attributes?.media_title;
        const isMetaPlaceholder = isPlaceholderMediaTitle(
          metaTitle,
          metadataState?.attributes?.friendly_name,
          mainState?.attributes?.app_name
        );
        const effectiveMetaTitle = (!isMetaPlaceholder && metaTitle) ? metaTitle : null;
        const displayTitle = effectiveMetaTitle || playbackState?.attributes?.media_title || mainState?.attributes?.media_title || metaTitle;

        // Prioritize metadata artwork, then fall back to others only if they match the displayed title or are playing the same media
        return this._resolveSelectedArtwork({
          metadataArtwork,
          playbackArtwork,
          mainArtwork,
          displayTitle,
          playbackStateObj: playbackState,
          mainState,
          isPlayingSameMedia,
        });
      },
      getIsMaActive: (id) => {
        const idx = this.entityIds.indexOf(id);
        if (idx < 0) return false;
        const entityObj = this.entityObjs[idx];
        if (!entityObj?.music_assistant_entity) return false;
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = this.hass?.states?.[playbackEntityId];
        return playbackEntityId === this._resolveEntity(entityObj.music_assistant_entity, entityObj.entity_id, idx) &&
          this._isEntityPlaying(playbackState);
      },
      isIdle: this._isIdle,
      hass: this.hass,
      onChipClick: (idx) => this._onChipClick(idx),
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
      onPinClick: (idx, e) => { e.stopPropagation(); this._onPinClick(e); },
      onPointerDown: (e, idx) => this._handleChipPointerDown(e, idx),
      onPointerMove: (e, idx) => this._handleChipPointerMove(e, idx),
      onPointerUp: (e, idx) => this._handleChipPointerUp(e, idx),
      quickGroupingMode: this._quickGroupingMode,
      getQuickGroupingState: id => {
        const masterId = this.currentEntityId;
        const masterIdx = this.entityIds.indexOf(masterId);
        const masterGroupId = masterIdx >= 0 ? this._getGroupingEntityId(masterIdx) : masterId;
        const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
        const myGroupKey = this._getGroupKey(this.currentEntityId);
        return this._getGroupPlayerState(id, masterId, null, masterState, myGroupKey);
      },
      onQuickGroupClick: (idx, e) => {
        const id = this.entityIds[idx];
        if (id) {
          this._toggleGroup(id);
        }
      },
      onDoubleClick: e => {
        e.stopPropagation();
        const now = Date.now();
        // Ignore native dblclick if we just processed a touch double tap
        if (now - this._lastChipDoubleTapTime < GESTURE_DOUBLE_TAP_IGNORE_NATIVE_DELAY) return;
        this._quickGroupingMode = !this._quickGroupingMode;
        this.requestUpdate();
      }
    };
  }

  _renderInlineChipRow(showChipsInline, chipsHiddenInline) {
    if (!showChipsInline) return nothing;
    return html`
      <div class="chip-row" style="${chipsHiddenInline ? "visibility: hidden; pointer-events: none;" : ""}">
        ${renderChipRow(this._getChipRowProps())}
      </div>
    `;
  }

  _renderInlineActionRow(rowActions) {
    if (!rowActions || !rowActions.length) return nothing;
    return html`
      <div style="${this._showEntityOptions ? 'visibility: hidden; pointer-events: none;' : ''}">
        ${renderActionChipRow({
      actions: rowActions.map(({ action }) => action),
      onActionChipClick: (idx) => {
        const target = rowActions[idx];
        if (!target) return;
        this._onActionChipClick(target.idx);
      }
    })}
      </div>
    `;
  }

  _renderGroupingMenuOption(isGridMode = false) {
    return renderGroupingMenuOption.call(this, isGridMode);
  }

  /**
   * Determine the grouping state of a player ID relative to an active ID
   * @param {string} targetId
   * @param {string|null} [activeId]
   * @param {string|null} [activeGroupKey]
   * @param {any} [masterState]
   * @param {string|null} [myGroupKey]
   * @returns {import("./types.d.ts").GroupPlayerState}
   */
  _getGroupPlayerState(targetId, activeId, activeGroupKey, masterState, myGroupKey) {
    const targetIdx = this.entityIds.indexOf(targetId);
    if (targetIdx < 0) {
      return {
        isGroupable: false,
        isBusy: false,
        busyLabel: "",
        grouped: false,
        isPrimary: false,
        disabled: true,
        entityToCheck: null,
        tooltip: "",
      };
    }

    const entityToCheck = this._getGroupingEntityId(targetIdx);
    const st = this.hass.states[entityToCheck];

    if (!st || !this._isGroupCapable(st)) {
      return {
        isGroupable: false,
        isBusy: false,
        busyLabel: "",
        grouped: false,
        isPrimary: false,
        disabled: true,
        entityToCheck,
        tooltip: "",
      };
    }

    const playerGroupKey = this._getGroupKey(targetId);
    let isBusy = false;
    let busyLabel = "";

    // Busy if entity or its grouping entity is unavailable
    if (st.state === "unavailable" || this.hass?.states?.[targetId]?.state === "unavailable") {
      isBusy = true;
      busyLabel = localize('common.unavailable');
    }
    // Busy if joined to a DIFFERENT group
    else if (playerGroupKey !== targetId && playerGroupKey !== myGroupKey) {
      isBusy = true;
      busyLabel = localize('common.unavailable');
    }
    // Or if it IS a master of a different group
    else if (playerGroupKey === targetId && playerGroupKey !== myGroupKey) {
      if (st.attributes?.group_members?.length > 1) {
        isBusy = true;
        busyLabel = localize('common.unavailable');
      }
    }

    const filteredMembers = Array.isArray(masterState?.attributes?.group_members) ? masterState.attributes.group_members : [];
    const grouped = filteredMembers.includes(entityToCheck);
    const isPrimary = targetId === myGroupKey;
    const groupedAny = filteredMembers.length > 1;
    const hasMaTransfer = Boolean(this.hass?.services?.music_assistant?.transfer_queue);

    const isGroupActive = isPrimary ? (groupedAny || targetId === activeId) : grouped;
    const isSolePlayer = isGroupActive && !groupedAny;
    const isMasterLocked = isPrimary && (!hasMaTransfer || !groupedAny);
    const isActionDisabled = Boolean(isBusy || isSolePlayer || isMasterLocked);

    const masterName = this.getChipName(activeId);
    let tooltip;
    if (isSolePlayer) {
      tooltip = localize('card.grouping.current') || 'Current';
    } else if (isGroupActive) {
      if (isPrimary) {
        tooltip = (localize('card.grouping.unjoin_from') || 'Unjoin from {master}').replace(' {master}', '') || 'Unjoin';
      } else {
        tooltip = localize('card.grouping.unjoin_from', '{master}', masterName);
        if (tooltip === 'card.grouping.unjoin_from') tooltip = `Unjoin from ${masterName}`;
      }
    } else {
      tooltip = localize('card.grouping.join_with', '{master}', masterName);
      if (tooltip === 'card.grouping.join_with') tooltip = `Join with ${masterName}`;
    }

    return {
      isGroupable: true,
      isBusy,
      busyLabel,
      grouped: isGroupActive,
      isPrimary,
      disabled: isActionDisabled,
      entityToCheck,
      tooltip
    };
  }

  _renderGroupingSheet() {
    return renderGroupingSheet.call(this);
  }

  _renderTransferQueueSheet() {
    return renderTransferQueueSheet.call(this);
  }

  _renderResolvedEntitiesSheet() {
    return renderResolvedEntitiesSheet.call(this);
  }
  /**
   * Universal lyrics fetcher that supports both Music Assistant and LRCLIB.
   * Delegated to LyricsController.
   */
  async _fetchLyrics() {
    return this._lyricsController.fetchLyrics();
  }

  /**
   * Internal helper to fetch lyrics from Music Assistant.
   * Delegated to LyricsController.
   */
  async _getMassLyrics(activeState, fetchToken) {
    return this._lyricsController.getMassLyrics(activeState, fetchToken);
  }

  /**
   * Internal helper to fetch lyrics from LRCLIB.
   * Delegated to LyricsController.
   */
  async _getLrclibLyrics(artist, title, album, duration, fetchToken) {
    return this._lyricsController.getLrclibLyrics(artist, title, album, duration, fetchToken);
  }

  get _fetchingLyrics() {
    return this._lyricsController?.loading ?? false;
  }

  set _fetchingLyrics(val) {
    if (this._lyricsController) {
      this._lyricsController.loading = val;
    }
  }

  get _massLyrics() {
    return this._lyricsController?.lyrics ?? [];
  }

  set _massLyrics(val) {
    if (this._lyricsController) {
      this._lyricsController.lyrics = val;
    }
  }

  get _lyricsError() {
    return this._lyricsController?.error ?? false;
  }

  set _lyricsError(val) {
    if (this._lyricsController) {
      this._lyricsController.error = val;
    }
  }

  get _massQueueAvailable() {
    return this._queueController?.massQueueAvailable ?? false;
  }

  set _massQueueAvailable(val) {
    if (this._queueController) {
      this._queueController.massQueueAvailable = val;
    }
  }

  get _hasMassQueueIntegration() {
    return this._queueController?.hasMassQueueIntegration ?? null;
  }

  set _hasMassQueueIntegration(val) {
    if (this._queueController) {
      this._queueController.hasMassQueueIntegration = val;
    }
  }

  get _checkingMassQueueIntegration() {
    return this._queueController?.checkingMassQueueIntegration ?? false;
  }

  set _checkingMassQueueIntegration(val) {
    if (this._queueController) {
      this._queueController.checkingMassQueueIntegration = val;
    }
  }

  get _showTransferQueue() {
    return this._queueController?.showTransferQueue ?? false;
  }

  set _showTransferQueue(val) {
    if (this._queueController) {
      this._queueController.showTransferQueue = val;
    }
  }

  get _transferQueuePendingTarget() {
    return this._queueController?.transferQueuePendingTarget ?? null;
  }

  set _transferQueuePendingTarget(val) {
    if (this._queueController) {
      this._queueController.transferQueuePendingTarget = val;
    }
  }

  get _transferQueueStatus() {
    return this._queueController?.transferQueueStatus ?? null;
  }

  set _transferQueueStatus(val) {
    if (this._queueController) {
      this._queueController.transferQueueStatus = val;
    }
  }

  get _hasTransferQueueForCurrent() {
    return this._queueController?.hasTransferQueueForCurrent ?? false;
  }

  set _hasTransferQueueForCurrent(val) {
    if (this._queueController) {
      this._queueController.hasTransferQueueForCurrent = val;
    }
  }

  get _queueOpsTotal() {
    return this._queueController?.queueOpsTotal ?? 0;
  }

  set _queueOpsTotal(val) {
    if (this._queueController) {
      this._queueController.queueOpsTotal = val;
    }
  }

  get _queueOpsCompleted() {
    return this._queueController?.queueOpsCompleted ?? 0;
  }

  set _queueOpsCompleted(val) {
    if (this._queueController) {
      this._queueController.queueOpsCompleted = val;
    }
  }

  get _queueOperationPromise() {
    return this._queueController?.queueOperationPromise ?? Promise.resolve();
  }

  set _queueOperationPromise(val) {
    if (this._queueController) {
      this._queueController.queueOperationPromise = val;
    }
  }

  get _queueOpsTimeout() {
    return this._queueController?.queueOpsTimeout ?? null;
  }

  set _queueOpsTimeout(val) {
    if (this._queueController) {
      this._queueController.queueOpsTimeout = val;
    }
  }

  get _queueRefreshTimer() {
    return this._queueController?.queueRefreshTimer ?? null;
  }

  set _queueRefreshTimer(val) {
    if (this._queueController) {
      this._queueController.queueRefreshTimer = val;
    }
  }

  get _queueEventSubscription() {
    return this._queueController?.queueEventSubscription ?? null;
  }

  set _queueEventSubscription(val) {
    if (this._queueController) {
      this._queueController.queueEventSubscription = val;
    }
  }

  get _transferQueueAutoCloseTimer() {
    return this._queueController?.transferQueueAutoCloseTimer ?? null;
  }

  set _transferQueueAutoCloseTimer(val) {
    if (this._queueController) {
      this._queueController.transferQueueAutoCloseTimer = val;
    }
  }


  updated(changedProps) {
    if (changedProps.has("hass") && this.hass) {
      const currentLang = this.hass.selectedLanguage || this.hass.language || this.hass.locale?.language;
      if (currentLang) {
        setHassLanguage(currentLang);
      }
    }
    this._updateHostAttributes();
    if (this._idleImageTemplate && changedProps.has("hass")) {
      this._idleImageTemplateNeedsResolve = true;
    }
    if (this._backgroundImageTemplate && changedProps.has("hass")) {
      this._backgroundImageTemplateNeedsResolve = true;
    }
    if (this._fontColorTemplate && changedProps.has("hass")) {
      this._fontColorTemplateNeedsResolve = true;
    }
    const currentContext = JSON.stringify(this._getTemplateContext());
    this._syncTemplateSubscriptions('action_in_menu', currentContext, this.config?.actions);
    this._syncTemplateSubscriptions('always_collapsed', currentContext, this.config?.always_collapsed);
    this._syncTemplateSubscriptions('control_layout', currentContext, this.config?.control_layout);
    this._syncTemplateSubscriptions('card_height', currentContext, this.config?.card_height);
    this._syncTemplateSubscriptions('lyrics_background_fade', currentContext, this.config?.lyrics_background_fade);
    this._syncTemplateSubscriptions('lock_screen_controls', currentContext, this.config?.lock_screen_controls);
    this._syncTemplateSubscriptions('full_screen', currentContext, this.config?.full_screen);
    this._syncEntityTemplateSubscriptions('ma', currentContext);
    this._syncEntityTemplateSubscriptions('vol', currentContext);
    this._syncEntityTemplateSubscriptions('remote', currentContext);
    this._syncEntityTemplateSubscriptions('hidden_controls', currentContext);
    if (changedProps.has("_selectedIndex")) {
      this._lastMediaTitle = null;
      this._searchResultsByType = {};
      if (this._upcomingFilterActive) {
        this._searchResults = [];
        this._refreshQueue({ delayMs: 50 });
      }
    }
    if (changedProps.has("_selectedIndex") || changedProps.has("hass")) {
      void this._updateTransferQueueAvailability({ refresh: false });
      void this._checkAiRadioAvailability();
    }
    if (changedProps.has("hass") || changedProps.has("config")) {
      this._updateArtworkAspectRatios();
    }

    if (this.hass && this._hasMassQueueIntegration === null && !this._checkingMassQueueIntegration) {
      this._checkingMassQueueIntegration = true;
      this._isMassQueueIntegrationAvailable(this.hass)
        .then(hasIntegration => {
          this._hasMassQueueIntegration = hasIntegration;
          if (hasIntegration) {
            this._massQueueAvailable = this._massQueueAvailable || hasIntegration;
            void this._checkAiRadioAvailability();
          }
        })
        .catch(() => {
          this._hasMassQueueIntegration = false;
        })
        .finally(() => {
          this._checkingMassQueueIntegration = false;
          this.requestUpdate();
        });
    }

    if (this.hass && this.entityIds) {

      // Check if currently playing track has changed and refresh "Next Up" if active
      if (this._upcomingFilterActive) {
        const metadataEntityId = this._getEntityForPurpose(this._selectedIndex, 'metadata');
        if (metadataEntityId) {
          const currentState = this.hass.states[metadataEntityId];
          const currentMediaTitle = currentState?.attributes?.media_title;
          if (currentMediaTitle && currentMediaTitle !== this._lastMediaTitle) {
            const isEntitySwitch = changedProps.has("_selectedIndex");
            this._lastMediaTitle = currentMediaTitle;
            // Shift UI immediately if we're looking at the queue and haven't already
            if (this._upcomingFilterActive && !isEntitySwitch) {
              // Check if we already advanced the UI manually (indicated by _latestManualShiftTime)
              const now = Date.now();
              // Increase tolerance to 4s to handle slow HA updates
              const wasManualShift = this._latestManualShiftTime && (now - this._latestManualShiftTime < 4000);

              if (!wasManualShift) {
                this._advanceQueueInUI(null, false); // Automatic advance
              }

              // Start/Extend heartbeat timer (20s)
              this._refreshQueue({ delayMs: 20000 });
            }
          }
        }
      }

      // Robust state tracking and timestamp updates
      const now = Date.now();
      for (let idx = 0; idx < this.entityIds.length; idx++) {
        const id = this.entityIds[idx];
        const obj = this.entityObjs[idx];
        if (!obj) continue;

        const mainId = obj.entity_id;
        const maId = this._getActualResolvedMaEntityForState(idx);

        // Track main player state
        const mainState = this.hass.states[mainId]?.state;
        const prevMainState = this._playerStateCache[mainId];
        if (mainState === "playing") {
          this._playTimestamps[mainId] = now;
          if (prevMainState !== "playing" && this._manualActiveEntityByChip?.[idx] && this._manualActiveEntityByChip[idx] !== mainId) {
            delete this._manualActiveEntityByChip[idx];
          }
          if (!this._manualActiveEntityByChip?.[idx]) {
            this._lastActiveEntityIdByChip[idx] = mainId;
          }
        } else if (prevMainState === "playing" && mainState !== "playing") {
          this._playTimestamps[mainId] = now;
        }
        this._playerStateCache[mainId] = mainState;

        // Track Music Assistant player state if different
        if (maId && maId !== mainId) {
          const maState = this.hass.states[maId]?.state;
          const prevMaState = this._playerStateCache[maId];
          if (maState === "playing") {
            this._playTimestamps[maId] = now;
            if (prevMaState !== "playing" && this._manualActiveEntityByChip?.[idx] && this._manualActiveEntityByChip[idx] !== maId) {
              delete this._manualActiveEntityByChip[idx];
            }
            if (!this._manualActiveEntityByChip?.[idx]) {
              this._lastActiveEntityIdByChip[idx] = maId;
            }
          } else if (prevMaState === "playing" && maState !== "playing") {
            this._playTimestamps[maId] = now;
          }
          this._playerStateCache[maId] = maState;
        }

        // Also maintain chip-level timestamp for sorting
        const activeEntityId = this._getEntityForPurpose(idx, 'sorting');
        if (activeEntityId && this.hass.states[activeEntityId]?.state === "playing") {
          this._playTimestamps[id] = now;
        }
      }

      // If manual‑select is active (no pin) and a *new* entity begins playing,
      // clear manual mode so auto‑switching resumes.
      if (this._manualSelect && this._pinnedIndex === null && this._manualSelectPlayingSet) {
        // Remove any entities from the snapshot that are no longer playing.
        for (const id of [...this._manualSelectPlayingSet]) {
          const stSnap = this.hass.states[id];
          if (!this._isEntityPlaying(stSnap)) {
            this._manualSelectPlayingSet.delete(id);
          }
        }
        for (const id of this.entityIds) {
          const st = this.hass.states[id];
          if (this._isEntityPlaying(st) && !this._manualSelectPlayingSet.has(id)) {
            this._manualSelect = false;
            this._manualSelectPlayingSet = null;
            break;
          }
        }
      }

      // Auto-switch unless manually pinned or a menu is open
      // Update idle state before checking for auto-switch
      // This ensures we respect the idle timeout if the current entity just stopped
      this._updateIdleState(changedProps);

      if (!this._manualSelect && !this.isAnyMenuOpen) {
        // Switch to most recent if applicable
        const sortedIds = this.sortedEntityIds;
        if (sortedIds.length > 0) {
          let mostRecentId = sortedIds[0];
          // If the most recent entity is part of a group, prefer the actual master
          const candidateGroup = mostRecentId
            ? (this.groupedSortedEntityIds || []).find(g => g.includes(mostRecentId))
            : null;
          if (candidateGroup && candidateGroup.length > 1) {
            const groupMaster = this._getActualGroupMaster(candidateGroup);
            if (groupMaster) {
              mostRecentId = groupMaster;
            }
          }
          const mostRecentIdx = this.entityIds.indexOf(mostRecentId);
          const mostRecentActiveEntity = mostRecentIdx >= 0
            ? this._getEntityForPurpose(mostRecentIdx, 'sorting')
            : null;
          const mostRecentActiveState = mostRecentActiveEntity
            ? this.hass.states[mostRecentActiveEntity]
            : null;
          const isCurrentPlaying = this._isCurrentEntityPlaying();
          const isCurrentDisabled = this.entityObjs[this._selectedIndex]?.disable_auto_select;
          const isCurrentUnrestrictedPlaying = isCurrentPlaying && !isCurrentDisabled;

          if (
            (this._isEntityPlaying(mostRecentActiveState) || isCurrentDisabled) &&
            this.entityIds[this._selectedIndex] !== mostRecentId &&
            (!this._idleTimeout || !this._hasSeenPlayback) &&
            !isCurrentUnrestrictedPlaying &&
            !this.entityObjs[mostRecentIdx]?.disable_auto_select
          ) {
            this._selectedIndex = mostRecentIdx;
          }
        }
      }
      // Ensure grouped selections always point at the actual master
      const selectedId = this.entityIds[this._selectedIndex];
      const selectedGroup = selectedId
        ? (this.groupedSortedEntityIds || []).find(g => g.includes(selectedId))
        : null;
      if (selectedGroup && selectedGroup.length > 1) {
        const actualMaster = this._getActualGroupMaster(selectedGroup);
        if (actualMaster && actualMaster !== selectedId) {
          const masterIdx = this.entityIds.indexOf(actualMaster);
          if (masterIdx >= 0 && !this.entityObjs[masterIdx]?.disable_auto_select) {
            this._selectedIndex = masterIdx;
            this._lastGroupingMasterId = actualMaster;
          }
        }
      }
      // Warm the resolved MA/Volume caches for the selected chip
      this._ensureResolvedMaForIndex(this._selectedIndex);
      this._ensureResolvedVolForIndex(this._selectedIndex);
      this._ensureResolvedHiddenControlsForIndex(this._selectedIndex);

      // Sync selected entity to helper if configured
      this._updateSelectedEntityHelper();
      this._handleSelectEntityFromHelper();
    }
    // Volume overlay detection (Issue #252)
    this._handleVolumeOverlayDetection(changedProps);

    if (changedProps.has("_lyricsActive")) {
      if (this._adaptiveText) {
        this._setAdaptiveTextVars(this._currentTextScale, undefined, this._currentDetailsScale);
        this._updateMarquee();
      }
    }

    const lowerContentEl = this.shadowRoot?.querySelector('.card-lower-content');
    if (!this._lyricsActive) {
      if (lowerContentEl && lowerContentEl.offsetHeight > 50) {
        this._lastNonLyricsLowerContentHeight = lowerContentEl.offsetHeight;
      }
    }
    const detailsEl = this.shadowRoot?.querySelector('.details');
    const firstControlEl = detailsEl || this.shadowRoot?.querySelector('.progress-bar-container:not(.alternate)') || this.shadowRoot?.querySelector('.controls-row') || this.shadowRoot?.querySelector('.volume-row');
    let controlsH = 0;
    if (lowerContentEl && firstControlEl && lowerContentEl.contains(firstControlEl)) {
      controlsH = lowerContentEl.offsetHeight - firstControlEl.offsetTop;
    }
    if (controlsH <= 0) {
      if (detailsEl) controlsH += detailsEl.offsetHeight;
      const progressEl = this.shadowRoot?.querySelector('.progress-bar-container:not(.alternate)');
      if (progressEl) controlsH += progressEl.offsetHeight;
      const controlsRowEl = this.shadowRoot?.querySelector('.controls-row');
      if (controlsRowEl) controlsH += controlsRowEl.offsetHeight;
      const volumeRowEl = this.shadowRoot?.querySelector('.volume-row');
      if (volumeRowEl) controlsH += volumeRowEl.offsetHeight;
    }
    if (controlsH > 30 && this._lowerControlsHeight !== controlsH) {
      this._lowerControlsHeight = controlsH;
      if (this._lyricsActive) {
        this.requestUpdate();
      }
    }

    // Lyrics fetch trigger
    this._lyricsController.checkTrackLyrics();

    // Restart progress timer
    super.updated?.(changedProps);

    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    const playbackState = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (this._isEntityPlaying(playbackState) && playbackState.attributes.media_duration) {
      if (typeof document === "undefined" || !document.hidden) {
        this._progressTimer = setInterval(() => {
          this.requestUpdate();
        }, 500);
      }
    }

    // Sync lock screen media controls (Web Media Session API)
    if (this._mediaSessionManager) {
      const activePlaybackEntity = this.currentActivePlaybackEntityId || this.currentEntityId;
      const metadataState = this.metadataStateObj;
      const mainState = this.currentStateObj;

      const metadataArtwork = this._getArtworkUrl(metadataState, false);
      const playbackArtwork = this._getArtworkUrl(playbackState, false);
      const mainArtwork = this._getArtworkUrl(mainState, false);

      const artworkUrl =
        metadataArtwork?.url ||
        playbackArtwork?.url ||
        mainArtwork?.url ||
        metadataState?.attributes?.entity_picture ||
        playbackState?.attributes?.entity_picture ||
        mainState?.attributes?.entity_picture ||
        "";

      const title =
        metadataState?.attributes?.media_title ||
        playbackState?.attributes?.media_title ||
        mainState?.attributes?.media_title ||
        getEntityName(this.hass, playbackState) ||
        getEntityName(this.hass, mainState) ||
        "";

      const artist =
        metadataState?.attributes?.media_artist ||
        playbackState?.attributes?.media_artist ||
        mainState?.attributes?.media_artist ||
        "";

      const album =
        metadataState?.attributes?.media_album_name ||
        playbackState?.attributes?.media_album_name ||
        mainState?.attributes?.media_album_name ||
        "";

      if (!this._isEditorPreview) {
        this._mediaSessionManager.update({
          enabled: this._isMediaSessionEnabled,
          stateObj: playbackState,
          targetEntityId: activePlaybackEntity,
          artworkUrl,
          title,
          artist,
          album,
        });
      }
    }

    // Update idle state after all other state checks


    // Notify HA if collapsed state changes
    // If expand on search is enabled and search is open, force expanded state
    if (this._alwaysCollapsed && this._expandOnSearch && (this._showSearchInSheet)) {
      const collapsedNow = false;
      if (this._prevCollapsed !== collapsedNow) {
        this._prevCollapsed = collapsedNow;
        // Trigger layout update
        this._notifyResize();
      }
      return;
    }

    // Otherwise use normal collapse logic
    const collapsedNow = this._alwaysCollapsed
      ? true
      : (this._collapseOnIdle ? this._isIdle : false);

    if (this._prevCollapsed !== collapsedNow) {
      this._prevCollapsed = collapsedNow;
      // Trigger layout update
      this._notifyResize();
    }

    // Add grab scroll to chip rows after update/render
    this._addGrabScroll('.chip-row');
    this._addGrabScroll('.action-chip-row');
    this._addGrabScroll('.search-filter-chips');
    this._addVerticalGrabScroll('.floating-source-index');

    if (this._lastRenderedCollapsed && !this._lastRenderedHideControls) {
      const contentEl = this.renderRoot?.querySelector('.card-lower-content');
      if (contentEl) {
        const measured = contentEl.offsetHeight;
        if (measured && measured > 0) {
          const isCardHeightTemplate = typeof this.config?.card_height === 'string' && (this.config.card_height.includes('{{') || this.config.card_height.includes('{%') || this.config.card_height.trim().startsWith('[[['));
          const customHeightInput = isCardHeightTemplate
            ? this._cardHeightResolveCache?.card?.value
            : this.config?.card_height;
          const customHeight = Number(customHeightInput);
          const hasCustomCardHeight = Number.isFinite(customHeight) && customHeight > 0;
          if (!hasCustomCardHeight) {
            this._collapsedBaselineHeight = measured;
          } else if (!this._collapsedBaselineHeight || measured < this._collapsedBaselineHeight - 1) {
            // Allow the baseline to shrink but never grow when a custom height is applied
            this._collapsedBaselineHeight = measured;
          }
        }
      }
    }

    // Autofocus the in-sheet search box when opening the search in entity options
    if (this._showSearchInSheet) {
      // Use a longer delay when expand on search is enabled to allow for card expansion
      const focusDelay = this._alwaysCollapsed && this._expandOnSearch ? 300 : 200;

      setTimeout(() => {
        const focusSearchInput = () => {
          const inputEl = this.renderRoot.querySelector('#search-input-box');
          if (inputEl) {
            inputEl.focus();
            this._searchInputAutoFocused = true;
            return true;
          }
          return false;
        };

        if (!this._disableSearchAutofocus && !this._searchInputAutoFocused) {
          const focusedNow = focusSearchInput();
          if (!focusedNow) {
            // If input not found yet, try again with a longer delay
            setTimeout(() => {
              if (this._showSearchInSheet && !this._disableSearchAutofocus && !this._searchInputAutoFocused) {
                focusSearchInput();
              }
            }, 200);
          }
        }
        // Only scroll filter chip row to start if the set of chips has changed
        const classes = this._getVisibleSearchFilterClasses();
        const classStr = classes.join(",");
        const shouldResetChipScroll =
          (!this._searchLoading || classStr) && this._lastSearchChipClasses !== classStr;
        if (shouldResetChipScroll) {
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
        // this._attachSearchSwipe(); // Disabled on mobile due to false positives
      }, focusDelay);
    }
    // When the source‑list sheet opens, make sure the overlay scrolls to the top
    if (this._showSourceList) {
      setTimeout(() => {
        const overlayEl = this.renderRoot.querySelector('.entity-options-overlay');
        if (overlayEl) overlayEl.scrollTop = 0;
      }, 0);
    }
    this.updateComplete.then(() => this._updateMarquee());
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
    this._sourceDropdownOutsideHandler = (evt) => {
      // Find dropdown and button in shadow DOM
      const dropdown = this.renderRoot.querySelector('.source-dropdown');
      const btn = this.renderRoot.querySelector('.source-menu-btn');
      // If click/tap is not inside dropdown or button, close, evt.composedPath() includes shadow DOM path
      const path = evt.composedPath ? evt.composedPath() : [];
      if (
        (dropdown && path.includes(dropdown)) ||
        (btn && path.includes(btn))
      ) {
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
    selectSource(this.hass, entity, src);
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
    this._mediaSessionManager?.resumeFromUserGesture();
    // Ignore the synthetic click that fires immediately after a long‑press pin.
    if (this._holdToPin && this._justPinned) {
      this._justPinned = false;
      return;
    }

    // Select the tapped chip immediately
    this._selectedIndex = idx;

    // Wake from idle if the selected entity is actually playing
    if (this._isIdle) {
      const entityId = this.entityIds[idx];
      const activeId = this._getEntityForPurpose(idx, 'sorting');
      const state = this.hass?.states?.[activeId] || this.hass?.states?.[entityId];
      if (this._isEntityPlaying(state)) {
        this._setIdleState(false);
        this._hasSeenPlayback = true;
        if (this._idleTimeout) {
          clearTimeout(this._idleTimeout);
          this._idleTimeout = null;
        }
        this._resetIdleScreen();
      }
    }

    // Reset last active entity when switching chips
    this._lastActiveEntityId = null;

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
          const st = this.hass?.states?.[id];
          if (this._isEntityPlaying(st)) {
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
    await this._handleAction(action);
  }

  async _handleAction(action) {
    if (!action) return;
    if (action.menu_item) {
      // Enable quick-dismiss mode for menu_item actions
      this._quickMenuInvoke = true;
      switch (action.menu_item) {
        case "more-info":
          this._openMoreInfo();
          this._showEntityOptions = false;
          this.requestUpdate();
          break;
        case "group-players":
        case "group_players":
        case "speakers-and-groups":
        case "speakers_and_groups":
        case "transfer-queue":
        case "transfer_queue":
          this._openGrouping();
          break;
        case "search":
          this._openQuickSearchOverlay();
          break;
        case "search-recently-played":
          this._showEntityOptions = true;
          this._showSearchSheetInOptions("recently-played");
          setTimeout(() => {
            this._notifyResize();
          }, 0);
          break;
        case "search-next-up":
          this._showEntityOptions = true;
          this._showSearchSheetInOptions("next-up");
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
        case "main-menu":
          this._showGrouping = false;
          this._showSourceList = false;
          this._showSearchInSheet = false;
          this._showResolvedEntities = false;
          this._showTransferQueue = false;
          await this._openEntityOptions();
          break;
        case "full-screen":
          this._toggleFullScreen();
          this._showEntityOptions = false;
          this.requestUpdate();
          break;
        default:
          // Do nothing for unknown menu_item
          break;
      }
      return;
    }
    if (
      (typeof action.navigation_path === "string" && action.navigation_path.trim() !== "") ||
      action.action === "navigate"
    ) {
      let path = (typeof action.navigation_path === "string" ? action.navigation_path : action.path || "").trim();
      const openInNewTab = action.navigation_new_tab === true;

      // Create context for template resolution
      const context = this._getTemplateContext();

      // For new tabs in mobile WebViews, we MUST resolve synchronously to preserve user-activation tokens.
      let syncResolved = null;
      if (openInNewTab) {
        syncResolved = resolveStringTemplateSync(this.hass, path, context);
      }

      if (syncResolved !== null && syncResolved !== undefined) {
        this._handleNavigate(syncResolved, openInNewTab);
      } else {
        path = await resolveStringTemplate(this.hass, path, context);
        this._handleNavigate(path, openInNewTab);
      }
      return;
    }

    if (action.action === "full_screen" || action.action === "toggle_full_screen") {
      this._toggleFullScreen();
      return;
    }

    if (action.action === "toggle_lyrics") {
      this._lyricsController.toggle();
      return;
    }

    if (
      action.action === "group_players" ||
      action.action === "group-players" ||
      action.action === "speakers_and_groups" ||
      action.action === "speakers-and-groups" ||
      action.action === "transfer_queue" ||
      action.action === "transfer-queue"
    ) {
      this._openGrouping();
      return;
    }

    if (action.action === "remote_control") {
      this._openRemoteControl();
      return;
    }

    if (
      action.action === "toggle_media_session" ||
      action.action === "toggle_lock_screen_controls"
    ) {
      const currentlyEnabled = this._isMediaSessionEnabled;
      this._mediaSessionOverride = !currentlyEnabled;
      if (this._mediaSessionOverride) {
        this._mediaSessionManager?.startPlaybackGesture(this.currentEntityId);
      } else {
        this._mediaSessionManager?.reset();
      }
      this.requestUpdate();
      return;
    }

    if (action.action === "prev_entity" || action.action === "next_entity") {
      const sortedIds = this.sortedEntityIds;
      if (sortedIds && sortedIds.length > 0) {
        const currentId = this.entityIds[this._selectedIndex];
        const currentIndex = sortedIds.indexOf(currentId);

        if (currentIndex !== -1) {
          let newIndex;
          if (action.action === "prev_entity") {
            newIndex = Math.max(0, currentIndex - 1);
          } else {
            newIndex = Math.min(sortedIds.length - 1, currentIndex + 1);
          }

          if (newIndex !== currentIndex) {
            const nextId = sortedIds[newIndex];
            const originalIndex = this.entityIds.indexOf(nextId);
            if (originalIndex !== -1 && originalIndex !== this._selectedIndex) {
              this._onChipClick(originalIndex);
            }
          }
        }
      }
      return;
    }

    if (!action.service) return;
    const [domain, service] = action.service.split(".");
    let data = { ...(action.service_data || {}) };
    if (domain === "script" && action.script_variable === true) {
      const currentMainId = this.currentEntityId;
      const currentMaIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const currentMaId = await this._resolveTemplateAtActionTime(currentMaIdTemplate, currentMainId);
      const currentPlaybackIdTemplate = this.currentActivePlaybackEntityId || this._getPlaybackEntityId(this._selectedIndex);
      const currentPlaybackId = await this._resolveTemplateAtActionTime(currentPlaybackIdTemplate, currentMainId);
      if (
        data.entity_id === "current" ||
        data.entity_id === "$current" ||
        data.entity_id === "this"
      ) {
        delete data.entity_id;
      }
      // Prefer MA entity when available for script consumers
      data.yamp_entity = currentMaId || currentMainId;
      // Also expose main and active playback for advanced scripts
      data.yamp_main_entity = currentMainId;
      data.yamp_playback_entity = currentPlaybackId;
    } else if (
      !(domain === "script" && action.script_variable === true) &&
      (
        data.entity_id === "current" ||
        data.entity_id === "$current" ||
        data.entity_id === "this" ||
        !data.entity_id
      )
    ) {
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

    if (domain === "media_player" && (service === "media_play" || service === "media_play_pause")) {
      this._mediaSessionManager?.startPlaybackGesture(data.entity_id || this.currentEntityId);
    }

    this.hass.callService(domain, service, data);
  }
  _onTapAreaPointerDown(e) {
    if (this.isAnyMenuOpen) return;

    // Check if we clicked on something interactive
    const path = e.composedPath();
    const isInteractive = path.some(el =>
      el.tagName === 'BUTTON' ||
      el.tagName === 'HA-ICON' ||
      el.tagName === 'INPUT' ||
      (el.classList && el.classList.contains('clickable-artist')) ||
      (el.classList && el.classList.contains('details') && !this._isIdle)
    );
    if (isInteractive) return;

    this._gestureActive = true;
    this._gestureStartTime = Date.now();
    this._gestureStartX = e.clientX;
    this._gestureStartY = e.clientY;
    this._gestureHoldTriggered = false;

    // Store the target tap area for positioning feedback
    this._gestureTapArea = e.currentTarget;

    if (this._cardTriggers?.hold) {
      this._gestureHoldTimer = setTimeout(() => {
        if (this._gestureActive) {
          this._gestureHoldTriggered = true;
          this._showGestureFeedback('hold', this._gestureStartX, this._gestureStartY);
          this._handleAction(this._cardTriggers.hold);
        }
      }, GESTURE_HOLD_TIMEOUT);
    }
  }

  _onTapAreaPointerMove(e) {
    if (this.isAnyMenuOpen) return;
    if (!this._gestureActive) return;
    const diffX = Math.abs(e.clientX - this._gestureStartX);
    const diffY = Math.abs(e.clientY - this._gestureStartY);
    // Cancel hold timer on any significant movement, but keep gesture active for swipe detection
    if (diffX > GESTURE_MOVE_THRESHOLD || diffY > GESTURE_MOVE_THRESHOLD) {
      clearTimeout(this._gestureHoldTimer);
    }
  }

  _onTapAreaPointerUp(e) {
    if (this.isAnyMenuOpen) return;
    if (!this._gestureActive) return;
    this._gestureActive = false;
    clearTimeout(this._gestureHoldTimer);

    if (this._gestureHoldTriggered) return;

    // Reject taps that were actually holds (long presses)
    if (Date.now() - this._gestureStartTime > GESTURE_HOLD_TIMEOUT) return;

    // Calculate movement
    const diffX = e.clientX - this._gestureStartX;
    const diffY = e.clientY - this._gestureStartY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    // Check for swipe gestures (horizontal movement > threshold, vertical movement < threshold)
    if (absDiffX >= GESTURE_SWIPE_THRESHOLD && absDiffY < GESTURE_SWIPE_THRESHOLD) {
      clearTimeout(this._tapTimer);
      const tapX = e.clientX;
      const tapY = e.clientY;

      if (diffX < 0 && this._cardTriggers?.swipe_left) {
        // Swipe Left
        this._showGestureFeedback('swipe_left', tapX, tapY);
        this._handleAction(this._cardTriggers.swipe_left);
        return;
      } else if (diffX > 0 && this._cardTriggers?.swipe_right) {
        // Swipe Right
        this._showGestureFeedback('swipe_right', tapX, tapY);
        this._handleAction(this._cardTriggers.swipe_right);
        return;
      }
    }

    // Movement threshold check for tap gestures
    if (absDiffX > GESTURE_MOVE_THRESHOLD || absDiffY > GESTURE_MOVE_THRESHOLD) return;

    const now = Date.now();
    const timeSinceLastTap = now - (this._lastTapTime || 0);
    this._lastTapTime = now;

    // Store position for delayed tap feedback
    const tapX = e.clientX;
    const tapY = e.clientY;

    if (timeSinceLastTap < GESTURE_DOUBLE_TAP_MAX_DELAY) {
      // Double Tap
      clearTimeout(this._tapTimer);
      if (this._cardTriggers?.double_tap) {
        this._showGestureFeedback('double_tap', tapX, tapY);
        this._handleAction(this._cardTriggers.double_tap);
      }
    } else {
      // Tap (delayed to see if it's a double tap)
      this._tapTimer = setTimeout(() => {
        if (this._cardTriggers?.tap) {
          this._showGestureFeedback('tap', tapX, tapY);
          this._handleAction(this._cardTriggers.tap);
        }
      }, GESTURE_TAP_DELAY);
    }
  }

  /**
   * Cancel gesture handling.
   */
  _onTapAreaPointerCancel(e) {
    this._gestureActive = false;
    clearTimeout(this._gestureHoldTimer);
  }

  /**
   * Delegators for idle-only gesture area (details text container).
   */
  _onIdleTapAreaPointerDown(e) { if (this._isIdle) this._onTapAreaPointerDown(e); }
  _onIdleTapAreaPointerMove(e) { if (this._isIdle) this._onTapAreaPointerMove(e); }
  _onIdleTapAreaPointerUp(e) { if (this._isIdle) this._onTapAreaPointerUp(e); }
  _onIdleTapAreaPointerCancel(e) { if (this._isIdle) this._onTapAreaPointerCancel(e); }

  _hasGestureTriggers() {
    return !!(this._cardTriggers?.tap || this._cardTriggers?.hold || this._cardTriggers?.double_tap || this._cardTriggers?.swipe_left || this._cardTriggers?.swipe_right);
  }

  _getGestureStyles(condition = true) {
    return (condition && this._hasGestureTriggers()) ? 'cursor:pointer; pointer-events:auto;' : '';
  }

  /**
   * Show visual feedback for card trigger gestures
   * @param {string} type - 'tap' | 'double_tap' | 'hold' | 'swipe_left' | 'swipe_right'
   * @param {number} clientX - Client X coordinate of the gesture
   * @param {number} clientY - Client Y coordinate of the gesture
   */
  _showGestureFeedback(type, clientX, clientY) {
    // Find the gesture feedback container in the shadow DOM
    const cardInner = this.shadowRoot?.querySelector('.yamp-card-inner');
    const tapArea = this._gestureTapArea || this.shadowRoot?.querySelector('.card-artwork-spacer') || this.shadowRoot?.querySelector('.collapsed-artwork-container') || this.shadowRoot?.querySelector('.media-artwork-placeholder') || cardInner;
    if (!tapArea) return;

    const feedbackHost = (tapArea.shadowRoot || tapArea.tagName === 'YAMP-LYRICS-VIEW')
      ? (cardInner || tapArea)
      : tapArea;

    // Get the bounding rect of the tap area to calculate relative position
    const rect = feedbackHost.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = `gesture-ripple ${type}`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Find or create the feedback container
    let container = feedbackHost.querySelector('.gesture-feedback-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'gesture-feedback-container';
      feedbackHost.appendChild(container);
    }

    // Remove the ripple when the animation ends
    ripple.addEventListener('animationend', () => ripple.remove());
    container.appendChild(ripple);
  }

  _onMenuActionClick(idx) {
    const action = this.config.actions?.[idx];
    if (!action) return;
    if (!action.menu_item) {
      this._quickMenuInvoke = true;
    }
    this._onActionChipClick(idx);
    if (!action.menu_item) {
      this._dismissWithAnimation();
    }
  }

  _getActionLabel(action) {
    if (!action) return "";
    const hasName = typeof action.name === "string" && action.name.trim() !== "";
    if (hasName) return action.name.trim();
    const iconOnly = !!action.icon;
    if (action.menu_item) {
      if (iconOnly) return "";
      const menuLabels = {
        "search": localize("card.menu.search"),
        "search-recently-played": localize("search.recently_played"),
        "search-next-up": localize("search.next_up"),
        "source": localize("card.menu.source"),
        "more-info": localize("card.menu.more_info"),
        "group-players": localize("card.menu.speakers_and_groups") || localize("card.menu.group_players"),
        "group_players": localize("card.menu.speakers_and_groups") || localize("card.menu.group_players"),
        "speakers-and-groups": localize("card.menu.speakers_and_groups") || localize("card.menu.group_players"),
        "speakers_and_groups": localize("card.menu.speakers_and_groups") || localize("card.menu.group_players"),
        "speakers": localize("card.menu.speakers_and_groups") || localize("card.menu.group_players"),
        "transfer-queue": localize("card.menu.speakers_and_groups") || localize("card.menu.group_players"),
        "transfer_queue": localize("card.menu.speakers_and_groups") || localize("card.menu.group_players"),
        "main-menu": localize("card.menu.main_menu"),
        "full-screen": localize(this._isFullScreen ? "card.menu.exit_full_screen" : "card.menu.full_screen"),
      };
      return menuLabels[action.menu_item] ?? action.menu_item;
    }
    if (
      (typeof action.navigation_path === "string" && action.navigation_path.trim() !== "") ||
      action.action === "navigate"
    ) {
      return iconOnly ? "" : "Navigate";
    }
    if (action.action === "full_screen" || action.action === "toggle_full_screen") {
      return iconOnly ? "" : localize(this._isFullScreen ? "card.menu.exit_full_screen" : "card.menu.full_screen");
    }
    if (action.action === "toggle_lyrics") {
      return iconOnly ? "" : localize("editor.action_types.toggle_lyrics") || "Toggle Lyrics Overlay";
    }
    if (
      action.action === "group_players" ||
      action.action === "group-players" ||
      action.action === "speakers_and_groups" ||
      action.action === "speakers-and-groups" ||
      action.action === "transfer_queue" ||
      action.action === "transfer-queue"
    ) {
      return iconOnly
        ? ""
        : localize("card.menu.speakers_and_groups") ||
            localize("card.menu.group_players") ||
            "Speakers & Groups";
    }
    if (action.action === "remote_control") {
      return iconOnly ? "" : localize("editor.action_types.remote_control") || "Open Remote Controls Overlay";
    }
    if (
      action.action === "toggle_media_session" ||
      action.action === "toggle_lock_screen_controls"
    ) {
      return iconOnly ? "" : localize("editor.action_types.toggle_media_session") || "Toggle Media Session Controls";
    }
    if (action.service) return iconOnly ? "" : action.service;
    return iconOnly ? "" : "Action";
  }

  async _onControlClick(action) {
    this._mediaSessionManager?.resumeFromUserGesture();
    // Use the unified entity resolution system for control actions
    const targetEntity = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    if (!targetEntity) return;

    const stateObj = this.hass?.states?.[targetEntity] || this.currentStateObj;



    switch (action) {
      case "play_pause":
        if (this._isEntityPlaying(stateObj)) {
          mediaPause(this.hass, targetEntity);
          // When pausing, set the last playing entity to the one we just paused (per-chip)
          if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
          this._lastPlayingEntityIdByChip[this._selectedIndex] = targetEntity;
          // Track when we paused to prevent immediate clearing due to state delay
          if (!this._pauseTimestamps) this._pauseTimestamps = {};
          this._pauseTimestamps[this._selectedIndex] = Date.now();
          // Lock controls to this entity during the paused window
          this._controlFocusEntityId = targetEntity;
          // Optimistic toggle to reduce flicker
          this._optimisticPlayback = { entity_id: targetEntity, state: "paused", ts: Date.now() };
          this.requestUpdate();
          setTimeout(() => { this._optimisticPlayback = null; this.requestUpdate(); }, 1200);
        } else {
          this._mediaSessionManager?.startPlaybackGesture(targetEntity);
          mediaPlay(this.hass, targetEntity);
          // On resume, clear the paused entity tracking since we're now playing
          if (this._lastPlayingEntityIdByChip) {
            delete this._lastPlayingEntityIdByChip[this._selectedIndex];
          }
          if (this._pauseTimestamps) {
            delete this._pauseTimestamps[this._selectedIndex];
          }
          // Lock to the target entity immediately (per-chip)
          this._controlFocusEntityId = targetEntity;
          // Optimistic toggle to reduce flicker
          this._optimisticPlayback = { entity_id: targetEntity, state: "playing", ts: Date.now() };
          this.requestUpdate();
          setTimeout(() => { this._optimisticPlayback = null; this.requestUpdate(); }, 1200);
        }
        break;
      case "next":
        this._mediaSessionManager?.startPlaybackGesture(targetEntity);
        this._advanceQueueInUI(null, true); // Manual advance
        mediaNextTrack(this.hass, targetEntity);
        break;
      case "prev":
        this._mediaSessionManager?.startPlaybackGesture(targetEntity);
        mediaPreviousTrack(this.hass, targetEntity);
        break;
      case "stop":
        mediaStop(this.hass, targetEntity);
        if (stateObj) {
          // Set optimistic state for the entity we're actually controlling
          const targetEntityId = targetEntity;
          this._optimisticPlayback = { entity_id: targetEntityId, state: "idle", ts: Date.now() };
          // Don't clear debounce on action - let it handle state transitions naturally
          this.requestUpdate();
          setTimeout(() => { this._optimisticPlayback = null; this.requestUpdate(); }, 1200);
        }
        break;
      case "shuffle": {
        // Toggle shuffle based on current state
        const curr = !!stateObj.attributes.shuffle;
        setShuffle(this.hass, targetEntity, !curr);
        break;
      }
      case "repeat": {
        // Cycle: off → all → one → off
        let curr = stateObj.attributes.repeat || "off";
        let next;
        if (curr === "off") next = "all";
        else if (curr === "all") next = "one";
        else next = "off";
        setRepeat(this.hass, targetEntity, next);
        break;
      }
      case "power": {
        // Toggle main entity power (physical power behavior)
        const mainId = this.currentEntityId;
        const mainState = this.hass?.states?.[mainId] || stateObj;
        togglePower(this.hass, mainId, mainState?.state);

        // Also toggle volume_entity if sync_power is enabled for this entity
        const obj = this.entityObjs[this._selectedIndex];
        if (obj && obj.sync_power) {
          const volEntityId = this._getVolumeEntity(this._selectedIndex);
          if (volEntityId && volEntityId !== obj.entity_id) {
            togglePower(this.hass, volEntityId, mainState?.state);
          }
        }
        break;
      }
      case "favorite": {
        // Press the associated favorite button entity OR unfavorite if already favorited
        const favoriteButtonEntity = this._getFavoriteButtonEntity();
        const maState = this.hass?.states?.[targetEntity];
        const mediaContentId = maState?.attributes?.media_content_id;

        // Check if track is already favorited
        const isCurrentlyFavorited = this._isCurrentTrackFavorited();

        // Check if mass_queue is available for unfavorite functionality
        const hasMassQueue = await this._isMassQueueIntegrationAvailable(this.hass);

        if (isCurrentlyFavorited && hasMassQueue) {
          // Unfavorite using mass_queue
          const maEntityId = this._getMusicAssistantState()?.entity_id;
          if (maEntityId) {
            try {
              const message = {
                type: "call_service",
                domain: "mass_queue",
                service: "unfavorite_current_item",
                service_data: {
                  entity: maEntityId
                },
              };
              await this.hass.connection.sendMessagePromise(message);

              // Update cache to reflect unfavorited state
              if (mediaContentId) {
                if (!this._favoriteStatusCache) {
                  this._favoriteStatusCache = {};
                }
                this._favoriteStatusCache[mediaContentId] = {
                  isFavorited: false
                };
              }

              // Clear favorites cache
              if (this._searchResultsByType) {
                Object.keys(this._searchResultsByType).forEach(key => {
                  if (key.includes('_favorites') || key === 'favorites') {
                    delete this._searchResultsByType[key];
                  }
                });
              }

              this._checkingFavorites = null;
              this.requestUpdate();
            } catch (error) {
              console.error("yamp: Failed to unfavorite current item:", error);
            }
          }
        } else if (favoriteButtonEntity) {
          // Favorite using button.press (original behavior)
          this.hass.callService("button", "press", { entity_id: favoriteButtonEntity });

          // Immediately mark as favorited when button is pressed
          if (mediaContentId) {
            // Initialize cache if needed
            if (!this._favoriteStatusCache) {
              this._favoriteStatusCache = {};
            }

            // Immediately set as favorited
            this._favoriteStatusCache[mediaContentId] = {
              isFavorited: true
            };

            // Clear the checking flag
            this._checkingFavorites = null;

            // Clear search results cache to ensure favorites filter reflects changes
            if (this._searchResultsByType) {
              // Clear favorites-related cache entries
              Object.keys(this._searchResultsByType).forEach(key => {
                if (key.includes('_favorites') || key === 'favorites') {
                  delete this._searchResultsByType[key];
                }
              });
            }

            // Trigger immediate re-render to update UI
            this.requestUpdate();
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
  _onVolumeChange(e) {
    this._suppressVolumeOverlay();
    const idx = this._selectedIndex;
    const groupingEntity = this._getGroupingEntityId(idx) || this.currentEntityId;
    const state = this.hass.states[groupingEntity];
    const newVol = Number(e.target.value);
    const obj = this.entityObjs[idx];

    // Always use group_volume directly from obj
    const groupVolume = (typeof obj.group_volume === "boolean") ? obj.group_volume : true;
    const isChipGrouped = this._isActiveChipGrouped(idx);

    if (!groupVolume || !isChipGrouped) {
      setVolume(this.hass, this._getVolumeEntity(idx), newVol);
      return;
    }

    // Group volume logic: ONLY runs if group_volume is true/undefined
    // AND it's a group-capable entity (preset groups are excluded via _isGroupCapable)
    if (this._isCurrentlyGrouped(state)) {
      // Get the main entity and all grouped members (deduplicated)
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [...new Set([mainEntity, ...state.attributes.group_members])];
      const base = typeof this._groupBaseVolume === "number"
        ? this._groupBaseVolume
        : Number(this.currentVolumeStateObj?.attributes.volume_level || 0);
      const delta = newVol - base;

      // Deduplicate resolved volume targets to prevent redundant service calls
      const seen = new Set();
      for (const t of targets) {
        const foundIdx = this._resolveEntityIdxByGroupingId(t);
        // Skip targets whose configured entity has group_volume: false (but never skip the current entity)
        if (foundIdx >= 0 && foundIdx !== idx) {
          const targetObj = this.entityObjs[foundIdx];
          if (targetObj && targetObj.group_volume === false) continue;
        }
        // Use the physical volume entity when a configured entity is found, otherwise fall back to the grouping entity
        const volTarget = (foundIdx >= 0) ? this._getVolumeEntity(foundIdx) : t;
        if (seen.has(volTarget)) continue;
        seen.add(volTarget);
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + delta;
        setVolume(this.hass, volTarget, v);
      }
      this._groupBaseVolume = newVol;
    } else {
      const volumeEntity = this._getVolumeEntity(idx);
      setVolume(this.hass, volumeEntity, newVol);
    }
  }

  _onVolumeStep(direction) {
    this._suppressVolumeOverlay();
    const idx = this._selectedIndex;
    const entity = this._getVolumeEntity(idx);
    if (!entity) return;
    const isRemoteVolumeEntity = entity.startsWith && entity.startsWith("remote.");
    const stateObj = this.currentVolumeStateObj;
    if (!stateObj) return;

    if (isRemoteVolumeEntity) {
      sendRemoteVolumeStep(this.hass, entity, direction);
      return;
    }

    const groupingEntity = this._getGroupingEntityId(idx) || this.currentEntityId;
    const state = this.hass.states[groupingEntity];

    const obj = this.entityObjs[idx];
    const groupVolume = (typeof obj.group_volume === "boolean") ? obj.group_volume : true;
    const isChipGrouped = this._isActiveChipGrouped(idx);

    if (groupVolume && isChipGrouped && this._isCurrentlyGrouped(state)) {
      // Grouped: apply group gain step (deduplicated targets)
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [...new Set([mainEntity, ...state.attributes.group_members])];
      // Use configurable step size
      const step = this._getEffectiveVolumeStep() * direction;
      // Deduplicate resolved volume targets to prevent redundant service calls
      const seen = new Set();
      for (const t of targets) {
        const foundIdx = this._resolveEntityIdxByGroupingId(t);
        // Skip targets whose configured entity has group_volume: false (but never skip the current entity)
        if (foundIdx >= 0 && foundIdx !== idx) {
          const targetObj = this.entityObjs[foundIdx];
          if (targetObj && targetObj.group_volume === false) continue;
        }
        // Use the physical volume entity when a configured entity is found, otherwise fall back to the grouping entity
        const volTarget = (foundIdx >= 0) ? this._getVolumeEntity(foundIdx) : t;
        if (seen.has(volTarget)) continue;
        seen.add(volTarget);
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + step;
        setVolume(this.hass, volTarget, v);
      }
    } else {
      // Not grouped, set directly
      let current = Number(stateObj.attributes.volume_level || 0);
      current += this._getEffectiveVolumeStep() * direction;
      setVolume(this.hass, entity, current);
    }
  }

  _onMuteToggle() {
    this._suppressVolumeOverlay();
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
      setVolume(this.hass, entity, isMuted ? 0.5 : 0);
      return;
    }

    // Check if mute is supported
    const supportsMute = this._supportsFeature(stateObj, SUPPORT_VOLUME_MUTE);

    if (!supportsMute) {
      // If mute is not supported, implement mute by setting volume to 0 and storing previous volume
      if (currentVolume > 0) {
        // Store current volume and mute
        this._previousVolume = currentVolume;
        setVolume(this.hass, entity, 0);
      } else {
        // Restore previous volume
        const restoreVolume = this._previousVolume ?? 0.5;
        setVolume(this.hass, entity, restoreVolume);
        this._previousVolume = null;
      }
      return;
    }

    const groupingEntity = this._getGroupingEntityId(idx) || this.currentEntityId;
    const state = this.hass.states[groupingEntity];

    const obj = this.entityObjs[idx];
    const groupVolume = (typeof obj.group_volume === "boolean") ? obj.group_volume : true;
    const isChipGrouped = this._isActiveChipGrouped(idx);

    if (groupVolume && isChipGrouped && this._isCurrentlyGrouped(state)) {
      // Grouped: apply mute to all group members (deduplicated)
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [...new Set([mainEntity, ...state.attributes.group_members])];

      // Deduplicate resolved volume targets to prevent redundant service calls
      const seen = new Set();
      for (const t of targets) {
        const foundIdx = this._resolveEntityIdxByGroupingId(t);
        // Skip targets whose configured entity has group_volume: false (but never skip the current entity)
        if (foundIdx >= 0 && foundIdx !== idx) {
          const targetObj = this.entityObjs[foundIdx];
          if (targetObj && targetObj.group_volume === false) continue;
        }
        // Use the physical volume entity when a configured entity is found, otherwise fall back to the grouping entity
        const volTarget = (foundIdx >= 0) ? this._getVolumeEntity(foundIdx) : t;
        if (seen.has(volTarget)) continue;
        seen.add(volTarget);
        const targetState = this.hass.states[volTarget];
        const targetSupportsMute = targetState ? this._supportsFeature(targetState, SUPPORT_VOLUME_MUTE) : false;

        if (targetSupportsMute) {
          setMute(this.hass, volTarget, !isMuted);
        } else {
          // For entities that don't support mute, set volume to 0 or restore
          const targetVolume = targetState?.attributes?.volume_level ?? 0;
          setVolume(this.hass, volTarget, targetVolume > 0 ? 0 : 0.5);
        }
      }
    } else {
      // Not grouped, toggle mute directly
      setMute(this.hass, entity, !isMuted);
    }
  }

  _onVolumeDragStart(e, entityId = 'main') {
    // Store base group volume at drag start
    if (!this.hass) return;
    const state = this.currentVolumeStateObj;
    this._groupBaseVolume = state ? Number(state.attributes.volume_level || 0) : 0;
    this._volumeDraggingEntity = entityId;
    this._dragVolume = Number(e.target.value);
  }
  _onVolumeDragEnd(e) {
    this._groupBaseVolume = null;
    this._volumeDraggingEntity = null;
  }

  _onVolumeInput(e) {
    this._dragVolume = Number(e.target.value);
  }

  _handleVolumeOverlayDetection(changedProps) {
    if (this._showVolumeOverlay && changedProps.has("hass") && this.hass && !this.isAnyMenuOpen) {
      const volEntity = this._getVolumeEntity(this._selectedIndex);
      const volState = volEntity ? this.hass.states[volEntity] : null;
      const newLevel = volState?.attributes?.volume_level ?? null;
      const isMuted = volState?.attributes?.is_volume_muted ?? false;

      // Reset tracking when volume entity changes (e.g. chip switch)
      if (volEntity !== this._lastTrackedVolEntityId) {
        this._lastTrackedVolumeLevel = newLevel;
        this._lastTrackedVolEntityId = volEntity;
      } else if (
        newLevel !== null &&
        this._lastTrackedVolumeLevel !== null &&
        newLevel !== this._lastTrackedVolumeLevel &&
        !this._internalVolumeChangeFlag &&
        !this._volumeDraggingEntity
      ) {
        this._showVolumeOverlayBriefly(newLevel, isMuted);
      }
      this._lastTrackedVolumeLevel = newLevel;
    }
  }

  /**
   * Show the volume overlay briefly, then auto-dismiss.
   */
  _showVolumeOverlayBriefly(level, isMuted) {
    this._volumeOverlayValue = Math.round(level * 100);
    this._volumeOverlayMuted = isMuted;
    this._volumeOverlayActive = true;
    if (this._volumeOverlayTimer) clearTimeout(this._volumeOverlayTimer);
    this._volumeOverlayTimer = setTimeout(() => {
      this._volumeOverlayActive = false;
      this._volumeOverlayTimer = null;
      this.requestUpdate();
    }, 3000);
    this.requestUpdate();
  }

  /**
   * Suppress the volume overlay briefly after an internal volume action.
   * The HA state update from our own service call arrives async, so we need
   * a timed window to ignore the resulting hass change.
   */
  _suppressVolumeOverlay() {
    this._internalVolumeChangeFlag = true;
    if (this._internalVolumeSuppressTimer) clearTimeout(this._internalVolumeSuppressTimer);
    this._internalVolumeSuppressTimer = setTimeout(() => {
      this._internalVolumeChangeFlag = false;
      this._internalVolumeSuppressTimer = null;
    }, 1500);
  }

  _getVolumeOverlayIcon() {
    if (this._volumeOverlayMuted || this._volumeOverlayValue === 0) return "mdi:volume-off";
    if (this._volumeOverlayValue < 20) return "mdi:volume-low";
    if (this._volumeOverlayValue < 50) return "mdi:volume-medium";
    return "mdi:volume-high";
  }

  _dismissVolumeOverlay() {
    this._volumeOverlayActive = false;
    if (this._volumeOverlayTimer) {
      clearTimeout(this._volumeOverlayTimer);
      this._volumeOverlayTimer = null;
    }
    this.requestUpdate();
  }

  _onGroupVolumeChange(entityId, volumeEntity, e) {
    this._suppressVolumeOverlay();
    const vol = Number(e.target.value);
    setVolume(this.hass, volumeEntity, vol);
    this.requestUpdate();
  }
  _onGroupVolumeStep(volumeEntity, direction) {
    this._suppressVolumeOverlay();
    sendRemoteVolumeStep(this.hass, volumeEntity, direction);
    this.requestUpdate();
  }

  _onSourceChange(e) {
    const entity = this.currentEntityId;
    const source = e.target.value;
    if (!entity || !source) return;
    selectSource(this.hass, entity, source);
  }

  _openMoreInfo() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: this.currentEntityId },
      bubbles: true,
      composed: true,
    }));
  }

  async _onProgressBarClick(e) {
    try {
      e.stopPropagation();
      // For seeking, we want to target the entity that is actually playing
      const mainId = this.currentEntityId;
      const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
      const mainState = mainId ? this.hass?.states?.[mainId] : null;
      const maState = maId ? this.hass?.states?.[maId] : null;

      let targetEntity;
      if (this._controlFocusEntityId && (this._controlFocusEntityId === maId || this._controlFocusEntityId === mainId)) {
        targetEntity = this._controlFocusEntityId;
      } else if (this._isEntityPlaying(maState) && this._isEntityPlaying(mainState) && this._areEntitiesPlayingSameMedia(mainState, maState)) {
        targetEntity = mainId;
      } else if (this._isEntityPlaying(maState)) {
        targetEntity = maId;
      } else if (this._isEntityPlaying(mainState)) {
        targetEntity = mainId;
      } else {
        // When neither is playing, prefer the last playing entity for better resume behavior
        const lastPlayingForChip = this._lastPlayingEntityIdByChip?.[this._selectedIndex];
        if (lastPlayingForChip &&
          (lastPlayingForChip === maId || lastPlayingForChip === mainId)) {
          targetEntity = lastPlayingForChip;
        } else {
          // Fallback to the configured playback entity
          const entityTemplate = this._getPlaybackEntityId(this._selectedIndex);
          targetEntity = await this._resolveTemplateAtActionTime(entityTemplate, this.currentEntityId);
        }
      }

      const stateObj = this.hass?.states?.[targetEntity] || this.currentStateObj;
      if (!targetEntity || !stateObj || !stateObj.attributes) {
        console.warn("YAMP: Cannot seek - invalid target or state", targetEntity, stateObj);
        return;
      }

      const duration = stateObj.attributes.media_duration;
      if (!duration) return;

      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const seekTime = Math.floor(percent * duration);

      // Optimistically update local progress position via offset strategy




      // Optimistically update local progress position via Simulated Playback
      // We ignore backend position entirely and simulate playback from the seek point
      this._seekAnchor = {
        position: seekTime,
        timestamp: Date.now(),
        trackId: stateObj.attributes.media_content_id || stateObj.attributes.media_title
      };
      // Lock convergence check for 2 seconds to avoid accidental sync with lagging backend
      this._seekConvergenceLock = Date.now() + 2000;
      this._seekOffset = null; // Clear old offset if any

      // Force immediate update
      this.requestUpdate();

      mediaSeek(this.hass, targetEntity, seekTime);
    } catch (err) {
      console.error("YAMP: Error in _onProgressBarClick", err);
    }
  }

  _resetSearchContext() {
    this._searchResultsByType = {}; // Clear cache
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._recommendationsFilterActive = false;
    this._initialFavoritesLoaded = false;
    this._loadingSearchRowMenuId = null;
    this._errorSearchRowMenuId = null;
  }

  _showSearchSuccessToast(menuId = null, type = null) {
    this._showQueueSuccessMessage = true;
    if (menuId) this._successSearchRowMenuId = menuId;
    if (type) this._successSearchRowType = type;
    this.requestUpdate();

    if (this._successToastHandle) {
      clearTimeout(this._successToastHandle);
    }

    this._successToastHandle = setTimeout(() => {
      this._showQueueSuccessMessage = false;
      this._successSearchRowMenuId = null;
      this._successSearchRowType = null;
      this._successToastHandle = null;
      this.requestUpdate();
    }, SUCCESS_MESSAGE_TIMEOUT_MS);
  }

  render() {
    if (!this.hass || !this.config) return nothing;

    const currentLang = this.hass.selectedLanguage || this.hass.language || this.hass.locale?.language;
    if (currentLang) {
      setHassLanguage(currentLang);
    }



    const isCardHeightTemplate = typeof this.config.card_height === 'string' && (this.config.card_height.includes('{{') || this.config.card_height.includes('{%') || this.config.card_height.trim().startsWith('[[['));
    const customCardHeightInput = isCardHeightTemplate
      ? this._cardHeightResolveCache?.card?.value
      : this.config.card_height;
    const customCardHeight = typeof customCardHeightInput === "string"
      ? (customCardHeightInput.includes('px') ? parseFloat(customCardHeightInput) : Number(customCardHeightInput))
      : Number(customCardHeightInput);
    const isValidCardHeightNumber = typeof customCardHeight === "number" && Number.isFinite(customCardHeight) && customCardHeight > 0;
    const hasCustomCardHeight =
      !this._isFullScreen &&
      (isValidCardHeightNumber ||
        (typeof customCardHeightInput === "string" &&
          customCardHeightInput.trim() !== "" &&
          customCardHeightInput !== "auto"));

    const collapsedBaselineHeight = this._collapsedBaselineHeight || 220;

    const hasSingleEntity = this.entityObjs.length === 1;
    const isMinHeight = hasSingleEntity && this._alwaysCollapsed && this.config.expand_on_search !== true;
    const effectivePinHeaders = this.config.pin_search_headers === true && !isMinHeight;
    const showSearchHeaders = !(this.config.hide_search_headers_on_idle === true && this._isIdle);



    const showChipRow = this.config.show_chip_row || "auto";
    const hasMultipleEntities = this.entityObjs.length > 1;
    // Show chips in menu if explicitly set to in_menu, or if in_menu_on_idle and currently idle
    const showChipsInMenu = (showChipRow === "in_menu" || (showChipRow === "in_menu_on_idle" && this._isIdle)) && hasMultipleEntities;
    // Always render chip row for in_menu_on_idle to preserve height, but hide visually when idle
    const showChipsInline = showChipRow !== "in_menu" && (hasMultipleEntities || showChipRow === "always");
    // Hide chips visually (but keep space) when in_menu_on_idle mode is active and card is idle
    const chipsHiddenInline = showChipRow === "in_menu_on_idle" && this._isIdle && hasMultipleEntities;
    // Always reserve space in menu for chips when in_menu_on_idle, even when playing (to prevent menu jump)
    const reserveChipSpaceInMenu = showChipRow === "in_menu_on_idle" && hasMultipleEntities && !this._showSearchInSheet;
    const allActions = (this.config.actions ?? []).map((action, idx) => ({ action, idx }));
    // Filter out sync_selected_entity / select_entity actions entirely - they don't render as chips
    const visibleActions = allActions.filter(({ action }) => action?.action !== "sync_selected_entity" && action?.action !== "select_entity");

    // Shared context for synchronous template fallback
    let actionTemplateFallbackContext = null;

    // Action placement logic
    const localPlacement = (act, actIdx) => {
      let inMenuVal = getActionPlacement(act, actIdx);
      if (typeof inMenuVal === "string" && (inMenuVal.includes("{{") || inMenuVal.includes("{%") || inMenuVal.trim().startsWith("[[["))) {
        const cached = this._actionInMenuResolveCache?.[actIdx]?.value;
        if (cached !== undefined) {
          inMenuVal = cached;
        } else {
          // Fallback for initial render before subscription resolves
          if (inMenuVal.trim().startsWith("[[[")) {
            const evaluated = this._evaluateJsTemplate(inMenuVal);
            if (evaluated !== undefined) {
              inMenuVal = evaluated;
            }
          } else {
            if (!actionTemplateFallbackContext) {
              actionTemplateFallbackContext = {
                ...this._getTemplateContext(),
                state: this.hass?.states[this.currentEntityId]?.state || "unknown",
                attributes: this.hass?.states[this.currentEntityId]?.attributes || {}
              };
            }
            const resolved = resolveStringTemplateSync(this.hass, inMenuVal, actionTemplateFallbackContext);
            if (resolved !== null) {
              inMenuVal = resolved;
            }
          }
        }
      }

      if (typeof inMenuVal === "string") {
        inMenuVal = inMenuVal.trim();
        const validPlacements = ["chip", "menu", "hidden", "replace_search", "replace_power", "replace_mute", "replace_favorite"];
        if (validPlacements.includes(inMenuVal)) return inMenuVal;
        return inMenuVal;
      }
      if (inMenuVal === true) return "menu";
      return "chip";
    };

    const rowActions = visibleActions.filter(({ action, idx }) => localPlacement(action, idx) === "chip");
    const menuOnlyActions = visibleActions.filter(({ action, idx }) => localPlacement(action, idx) === "menu");

    // Gesture trigger logic
    const tapAction = visibleActions.find(({ action }) => action?.card_trigger === "tap");
    const holdAction = visibleActions.find(({ action }) => action?.card_trigger === "hold");
    const doubleTapAction = visibleActions.find(({ action }) => action?.card_trigger === "double_tap");
    const swipeLeftAction = visibleActions.find(({ action }) => action?.card_trigger === "swipe_left");
    const swipeRightAction = visibleActions.find(({ action }) => action?.card_trigger === "swipe_right");

    this._cardTriggers = {
      tap: tapAction?.action,
      hold: holdAction?.action,
      double_tap: doubleTapAction?.action,
      swipe_left: swipeLeftAction?.action,
      swipe_right: swipeRightAction?.action
    };
    const stateObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    const activeChipName = this.getChipName(this.currentEntityId);
    if (!stateObj) return html`<div class="details">${localize('common.not_found')}</div>`;

    const currentHiddenControls = this._getHiddenControlsForCurrentEntity();
    const showFavoriteButton = !!this._getFavoriteButtonEntity() && !currentHiddenControls.favorite;
    const favoriteActive = this._isCurrentTrackFavorited();
    const powerSupported = !currentHiddenControls.power && (this._supportsFeature(stateObj, SUPPORT_TURN_OFF) || this._supportsFeature(stateObj, SUPPORT_TURN_ON));
    const showModernPowerButton = this._controlLayout === "modern" && powerSupported;
    const showModernFavoriteButton = this._controlLayout === "modern" && showFavoriteButton;
    const replaceSearchAction = visibleActions.find(({ action, idx }) => localPlacement(action, idx) === "replace_search");
    const replacePowerAction = visibleActions.find(({ action, idx }) => localPlacement(action, idx) === "replace_power");
    const replaceMuteAction = visibleActions.find(({ action, idx }) => localPlacement(action, idx) === "replace_mute");
    const replaceFavoriteAction = visibleActions.find(({ action, idx }) => localPlacement(action, idx) === "replace_favorite");

    const renderCustomBottomAction = ({ action, idx }) => {
      if (!action) return nothing;
      const label = this._getActionLabel(action);
      let iconColor = action.icon_color || "";
      if (typeof iconColor === "string" && (iconColor.includes("{{") || iconColor.includes("{%") || iconColor.trim().startsWith("[[["))) {
        iconColor = resolveStringTemplateSync(this.hass, iconColor, this._getTemplateContext()) || "";
      }
      let icon = action.icon;
      if (!icon) {
        if (action.action === "toggle_media_session" || action.action === "toggle_lock_screen_controls") {
          icon = this._isMediaSessionEnabled ? "mdi:cellphone-lock" : "mdi:cellphone-wireless";
        } else if (action.action === "full_screen" || action.action === "toggle_full_screen") {
          icon = this._isFullScreen ? "mdi:fullscreen-exit" : "mdi:fullscreen";
        } else if (action.action === "toggle_lyrics") {
          icon = "mdi:script-text-outline";
        } else if (action.action === "remote_control") {
          icon = "mdi:remote";
        } else {
          icon = "mdi:rhombus-outline";
        }
      }
      if (!iconColor && (action.action === "toggle_media_session" || action.action === "toggle_lock_screen_controls") && this._isMediaSessionEnabled) {
        iconColor = "var(--custom-accent, var(--accent-color, #ff9800))";
      } else if (!iconColor && (action.action === "full_screen" || action.action === "toggle_full_screen") && this._isFullScreen) {
        iconColor = "var(--custom-accent, var(--accent-color, #ff9800))";
      }
      return html`
        <button
          class="volume-icon-btn favorite-volume-btn custom-bottom-action"
          @click=${(e) => { e.stopPropagation(); this._onActionChipClick(idx); }}
          title="${label}"
        >
          <ha-icon style=${styleMap({ color: iconColor || undefined })} .icon=${icon}></ha-icon>
        </button>
      `;
    };

    /** @type {import('lit').TemplateResult | typeof nothing} */
    let leadingVolumeControl = nothing;
    if (showModernPowerButton) {
      if (replacePowerAction) {
        leadingVolumeControl = renderCustomBottomAction(replacePowerAction);
      } else {
        leadingVolumeControl = html`
          <button
            class="volume-icon-btn favorite-volume-btn${stateObj?.state !== "off" ? " active" : ""}"
            @click=${() => this._onControlClick("power")}
            title="${localize('common.power')}"
          >
            <ha-icon .icon=${"mdi:power"}></ha-icon>
          </button>
        `;
      }
    } else if (this._controlLayout === "modern") {
      if (replaceSearchAction) {
        leadingVolumeControl = renderCustomBottomAction(replaceSearchAction);
      } else {
        leadingVolumeControl = html`
          <button
            class="volume-icon-btn favorite-volume-btn"
            @click=${() => this._openQuickSearchOverlay()}
            title="${localize('common.search')}"
          >
            <ha-icon .icon=${"mdi:magnify"}></ha-icon>
          </button>
        `;
      }
    }

    /** @type {import('lit').TemplateResult | typeof nothing} */
    let rightSlotTemplate = nothing;
    if (replaceFavoriteAction) {
      rightSlotTemplate = renderCustomBottomAction(replaceFavoriteAction);
    } else if (showModernFavoriteButton) {
      rightSlotTemplate = html`
        <button
          class="volume-icon-btn favorite-volume-btn${favoriteActive ? " active" : ""}"
          @click=${() => this._onControlClick("favorite")}
          title="${localize('common.favorite')}"
        >
          <ha-icon
            style=${favoriteActive ? "color: var(--custom-accent);" : nothing}
            .icon=${favoriteActive ? "mdi:heart" : "mdi:heart-outline"}
          ></ha-icon>
        </button>
      `;
    }

    /** @type {import('lit').TemplateResult | typeof nothing} */
    let muteSlotTemplate = nothing;
    if (replaceMuteAction) {
      muteSlotTemplate = renderCustomBottomAction(replaceMuteAction);
    }

    // Collect unique, sorted first letters of source names
    const sourceList = stateObj.attributes.source_list || [];
    const availableSourceFirstLetters = new Set(sourceList.map(s => (s && s[0] ? s[0].toUpperCase() : "")));
    const sourceLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    if (this._idleImageTemplate && this._idleImageTemplateNeedsResolve && !this._resolvingIdleImageTemplate && this._isIdle) {
      void this._resolveIdleImageTemplate();
    }
    if (this._backgroundImageTemplate && this._backgroundImageTemplateNeedsResolve && !this._resolvingBackgroundImageTemplate) {
      void this._resolveBackgroundImageTemplate();
    }
    if (this._fontColorTemplate && this._fontColorTemplateNeedsResolve && !this._resolvingFontColorTemplate) {
      void this._resolveFontColorTemplate();
    }
    // Idle image "picture frame" mode when idle
    const isJsTemplate = typeof this.config.idle_image === "string" && this.config.idle_image.trim().startsWith("[[[");
    const rawIdleImageInput = isJsTemplate
      ? this._evaluateJsTemplate(this.config.idle_image)
      : (this._idleImageTemplate ? this._idleImageTemplateResult : this.config.idle_image);
    const normalizedIdleImageInput = this._normalizeImageSourceValue(rawIdleImageInput);

    // Persistent card background image
    const isBgJsTemplate = typeof this.config.background_image === "string" && this.config.background_image.trim().startsWith("[[[");
    const rawBgImageInput = isBgJsTemplate
      ? this._evaluateJsTemplate(this.config.background_image)
      : (this._backgroundImageTemplate ? this._backgroundImageTemplateResult : this.config.background_image);
    const cardBackgroundImageUrl = this._resolveImageUrlFromInput(rawBgImageInput);
    const trimmedBgInput = (typeof rawBgImageInput === "string" && rawBgImageInput.trim().length > 0) ? rawBgImageInput.trim() : "";
    const isDirectColorOrGradient = !cardBackgroundImageUrl && trimmedBgInput.length > 0 && (
      trimmedBgInput.startsWith("#") ||
      trimmedBgInput.startsWith("rgb") ||
      trimmedBgInput.startsWith("hsl") ||
      trimmedBgInput.startsWith("linear-gradient") ||
      trimmedBgInput.startsWith("radial-gradient") ||
      /^[a-zA-Z]+$/.test(trimmedBgInput)
    );
    const hasCardBg = !!(cardBackgroundImageUrl || isDirectColorOrGradient);

    const isFcJsTemplate = typeof this.config.font_color === "string" && this.config.font_color.trim().startsWith("[[[");
    const rawFontColorInput = isFcJsTemplate
      ? this._evaluateJsTemplate(this.config.font_color)
      : (this._fontColorTemplate ? this._fontColorTemplateResult : this.config.font_color);
    const cardFontColor = (typeof rawFontColorInput === "string" && rawFontColorInput.trim().length > 0) ? rawFontColorInput.trim() : null;
    const hasFontColor = !!cardFontColor;

    // Use the unified entity resolution system for playback state.
    // (Note: resolved here at the top of render to support show_idle_artwork_when_not_playing detection)
    const playbackEntityId = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    const playbackStateObj = this.hass?.states?.[playbackEntityId];
    const isCurrentPlayingForIdle = this._isEntityPlaying(playbackStateObj);
    const forceIdleImage = !!(
      this.config.show_idle_artwork_when_not_playing === true &&
      !isCurrentPlayingForIdle &&
      normalizedIdleImageInput
    );

    let idleImageUrl = null;
    if (normalizedIdleImageInput && (this._isIdle || forceIdleImage)) {
      idleImageUrl = this._resolveImageUrlFromInput(normalizedIdleImageInput);
    }
    const dimIdleFrame = !!idleImageUrl;
    const hideControlsNow = this._idleTimeoutMs === 0 ? false : this._isIdle;
    const shouldDimIdle = this._idleTimeoutMs === 0 ? false : this._isIdle;
    // Calculate useInsetArtwork early for artworkFullBleed unification
    // Note: collapsed and _alwaysCollapsed will be defined/checked later, so we can't use them here.
    // We'll set useInsetArtwork again later with full collapsed context for rendering.
    const preCalcInsetArtwork = this._artworkObjectFit === "scaled-contain" || this._artworkObjectFit === "scaled-contain-alternate";
    // Extend artwork when configured, when chips are hidden inline (in_menu_on_idle + idle), or when using scaled-contain
    const artworkFullBleed = this.config.extend_artwork === true || chipsHiddenInline || preCalcInsetArtwork;

    // Calculate shuffle/repeat state from the active playback entity when available
    const mainStateForPlayback = this.currentStateObj;

    // --- Priority rule for entity selection ---
    // Keep the currently‑selected entity (even if paused)
    // unless some other entity is *playing*.
    // Also get the actual resolved MA entity for state detection (can be unconfigured)
    const actualResolvedMaId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const actualMaState = actualResolvedMaId ? this.hass?.states?.[actualResolvedMaId] : null;

    // Update state tracking for optimistic playback and set/clear MA linger window
    const prevMain = this._lastMainState;


    const prevMa = this._lastMaState;
    this._lastMainState = mainStateForPlayback?.state;
    this._lastMaState = actualMaState?.state;
    const idx = this._selectedIndex;


    // If MA just transitioned from playing -> not playing, start a linger window (permanent until something else plays)
    if (prevMa === "playing" && this._lastMaState !== "playing") {
      const ttl = Math.max(Number(this._idleTimeoutMs || this.config?.idle_timeout_ms || 60000), 500);
      this._playbackLingerByIdx[idx] = {
        entityId: actualResolvedMaId,
        until: Date.now() + ttl,
      };

    }
    // Also set linger when MA entity is paused (regardless of previous state) to ensure UI stays on MA

    // Set linger when MA entity transitions to paused OR when main entity transitions to paused and was last controlled
    const shouldSetLinger = (prevMa === "playing" && this._lastMaState === "paused" && this._lastPlayingEntityIdByChip?.[idx] === actualResolvedMaId) ||
      (prevMain === "playing" && this._lastMainState === "paused" && this._lastPlayingEntityIdByChip?.[idx] === mainStateForPlayback?.entity_id);

    if (shouldSetLinger) {
      // Use the last controlled entity for the linger (main entity if main was controlled, MA entity if MA was controlled)
      const lingerEntityId = this._lastPlayingEntityIdByChip[idx];
      const ttl = Math.max(Number(this._idleTimeoutMs || this.config?.idle_timeout_ms || 60000), 500);
      this._playbackLingerByIdx[idx] = {
        entityId: lingerEntityId, // Use cached MA entity or last controlled entity
        until: Date.now() + ttl,
      };
    }
    // If MA resumed playing, clear linger
    if (this._lastMaState === "playing" && this._playbackLingerByIdx?.[idx]) {
      delete this._playbackLingerByIdx[idx];
    }
    // Only clear linger if main entity is playing AND MA entity is not the last controlled entity
    const maEntityId = this.config.entities[idx]?.music_assistant_entity;
    const currentResolvedMaId = this._getEntityForPurpose(idx, 'ma_resolve');
    const lastControlled = this._lastPlayingEntityIdByChip?.[idx];
    const cachedResolvedMaId = this._maResolveCache?.[idx]?.id;
    const isLastControlledMa = !!(lastControlled && (
      lastControlled === cachedResolvedMaId ||
      lastControlled === currentResolvedMaId ||
      lastControlled === maEntityId ||
      lastControlled === actualResolvedMaId
    ));

    if (this._lastMainState === "playing" && this._playbackLingerByIdx?.[idx] && !isLastControlledMa) {
      delete this._playbackLingerByIdx[idx];
    }



    // Use the unified entity resolution system for playback state
    const finalPlaybackStateObj = playbackStateObj;

    const shuffleActive = !!finalPlaybackStateObj?.attributes?.shuffle;
    const repeatActive = finalPlaybackStateObj?.attributes?.repeat && finalPlaybackStateObj?.attributes?.repeat !== "off";

    // Metadata and Details Source
    const metadataStateObj = this.metadataStateObj;

    // Artwork and idle logic
    // When idle_timeout_ms=0, always show content regardless of idle state
    const isPlaying = this._idleTimeoutMs === 0 ? this._isEntityPlaying(playbackStateObj) : (!this._isIdle && this._isEntityPlaying(playbackStateObj));
    // Artwork keeps using the visible main entity's artwork when available; fallback to playback entity if main has none
    const mainState = this.currentStateObj;
    const metadataArtwork = this._getArtworkUrl(metadataStateObj, forceIdleImage);
    const playbackArtwork = this._getArtworkUrl(playbackStateObj, forceIdleImage);
    const mainArtwork = this._getArtworkUrl(mainState, forceIdleImage);

    const isPlayingSameMedia = this._areEntitiesPlayingSameMedia(mainState, playbackStateObj);

    // If metadataStateObj only has a placeholder title (like 'AirPlay' or the entity name)
    // while mainState or playbackState has real media metadata, fall back to the real metadata
    const metaTitle = metadataStateObj?.attributes?.media_title;
    const isMetaPlaceholder = isPlaceholderMediaTitle(
      metaTitle,
      metadataStateObj?.attributes?.friendly_name,
      mainState?.attributes?.app_name
    );
    const effectiveMetaTitle = (!isMetaPlaceholder && metaTitle) ? metaTitle : null;

    const displayTitle = effectiveMetaTitle || finalPlaybackStateObj?.attributes?.media_title || mainState?.attributes?.media_title || metaTitle || "";

    // Intelligent artwork fallback: 
    // 1. Always prefer the explicit metadata source
    // 2. Fall back to active/main playback if they are playing the exact same track title or same media
    const selectedArt = this._resolveSelectedArtwork({
      metadataArtwork,
      playbackArtwork,
      mainArtwork,
      displayTitle,
      playbackStateObj,
      mainState,
      isPlayingSameMedia,
    });

    // Persistent media controls track artwork:
    // Always show the track's album artwork if available (ignoring idle image mode),
    // falling back to placeholder icon if no track artwork is available.
    const persistentArt = this._resolveSelectedArtwork({
      metadataArtwork: this._getArtworkUrl(metadataStateObj, false, true),
      playbackArtwork: this._getArtworkUrl(playbackStateObj, false, true),
      mainArtwork: this._getArtworkUrl(mainState, false, true),
      displayTitle,
      playbackStateObj,
      mainState,
      isPlayingSameMedia,
    });



    // Details
    // When idle_timeout_ms=0, always show title/artist if available, regardless of playing state
    const shouldShowDetails = this._idleTimeoutMs === 0 ? true : isPlaying;
    // For display-only fields, fall back to the state object that actually provides the title we matched
    const displaySource =
      (effectiveMetaTitle && metadataStateObj?.attributes?.media_title) ? metadataStateObj :
        (finalPlaybackStateObj?.attributes?.media_title) ? finalPlaybackStateObj :
          (mainState?.attributes?.media_title) ? mainState :
            (metadataStateObj || finalPlaybackStateObj || mainState);
    const title = shouldShowDetails ? ((displaySource?.attributes?.media_title || "")) : "";
    const artist = shouldShowDetails
      ? (
        displaySource?.attributes?.media_artist ||
        displaySource?.attributes?.media_series_title ||
        displaySource?.attributes?.app_name ||
        ""
      )
      : "";
    const showAlbum = this.config.show_album !== false;
    const album = shouldShowDetails && showAlbum
      ? (displaySource?.attributes?.media_album_name || "")
      : "";
    const hasSearchableArtist = !!(displaySource?.attributes?.media_artist || stateObj?.attributes?.media_artist);
    const searchAlbumTitle = localize("search.search_album") || localize("search.browse_album", { "{album}": album });
    const searchArtistTitle = hasSearchableArtist
      ? localize("search.browse_artist", { "{artist}": artist }) || localize("search.search_artist")
      : "";
    if (this._adaptiveText) {
      this._updateAdaptiveTextScale(true);
    }
    let pos = displaySource?.attributes?.media_position || 0;
    const duration = displaySource?.attributes?.media_duration || 0;

    // Calculate raw backend position
    let rawBackendPos = pos;
    if (isPlaying && displaySource) {
      const updatedAt = displaySource.attributes?.media_position_updated_at
        ? Date.parse(displaySource.attributes.media_position_updated_at)
        : (displaySource.last_changed ? Date.parse(displaySource.last_changed) : Date.now());
      const elapsed = (Date.now() - updatedAt) / 1000;
      rawBackendPos += elapsed;
    }

    // Apply persistent seek simulation if valid
    const currentTrackId = displaySource?.attributes?.media_content_id || displaySource?.attributes?.media_title;
    const now = Date.now();

    if (this._seekAnchor && this._seekAnchor.trackId === currentTrackId) {
      // Calculated simulated position
      let simulatedPos = this._seekAnchor.position;
      if (isPlaying) {
        simulatedPos += (now - this._seekAnchor.timestamp) / 1000;
      }

      // Check for convergence
      const lockedOut = this._seekConvergenceLock && now < this._seekConvergenceLock;
      const diff = Math.abs(rawBackendPos - simulatedPos);

      // If backend is close to simulated pos, we are synced
      if (!lockedOut && diff < 2) {
        // Backend caught up! Clear anchor.
        this._seekAnchor = null;
        this._seekConvergenceLock = null;
        pos = rawBackendPos;
      } else {
        // Use simulated pos
        pos = simulatedPos;
      }
    } else {
      // No anchor or track changed
      this._seekAnchor = null;
      this._seekConvergenceLock = null;
      pos = rawBackendPos;
    }


    const progress = duration ? Math.min(1, pos / duration) : 0;

    // Volume entity determination
    const entity = this._getVolumeEntity(idx);
    const isRemoteVolumeEntity = entity && entity.startsWith && entity.startsWith("remote.");

    // Volume
    const vol = Number(this.currentVolumeStateObj?.attributes.volume_level || 0);
    const showSlider = this._getEffectiveVolumeMode() !== "stepper";

    // Collapse artwork/details on idle if configured and/or always_collapsed
    // If expand on search is enabled and search is open, force expanded state
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._showSearchInSheet)) {
      collapsed = false;
    } else {
      collapsed = this._alwaysCollapsed
        ? true
        : (this._collapseOnIdle ? this._isIdle : false);
    }
    const collapsedExtraSpace = collapsed && this._alwaysCollapsed && hasCustomCardHeight
      ? customCardHeight - collapsedBaselineHeight
      : 0;
    const chipRowReserve = collapsed && showChipsInline ? 48 : 0;
    const actionRowReserve = collapsed && rowActions.length > 0 ? 40 : 0;
    const reservedTopSpace = chipRowReserve + actionRowReserve;

    const activeTopChipReserve = (showChipsInline && !chipsHiddenInline) ? (collapsed ? 48 : 58) : 0;
    const activeActionReserve = (rowActions.length > 0) ? (collapsed ? 40 : 42) : 0;
    const totalTopReserve = activeTopChipReserve + activeActionReserve;
    const effectiveCustomLowerHeight = hasCustomCardHeight ? Math.max(0, customCardHeight - totalTopReserve) : null;

    // Calculate available height for lower content
    const lowerContentAvailableHeight = hasCustomCardHeight
      ? Math.max(100, customCardHeight - reservedTopSpace)
      : (this._collapsedBaselineHeight || 220);

    // Visual artwork size for inline styles — uses 48% of available height
    // as the base, then clamps to a width-safe maximum (see _getMaxCollapsedArtworkWidth).
    let collapsedArtworkSize = Math.round(lowerContentAvailableHeight * 0.48);
    if (this.config.hide_collapsed_artwork === true) {
      collapsedArtworkSize = 0;
    }

    const cardWidth = this.offsetWidth || 0;

    // Clamping logic
    if (hasCustomCardHeight && collapsedArtworkSize > 0) {
      if (customCardHeight < 230) {
        collapsedArtworkSize = 0; // Hide if extremely small
      } else {
        const maxSize = this._getMaxCollapsedArtworkWidth(cardWidth);
        collapsedArtworkSize = Math.max(40, Math.min(maxSize, collapsedArtworkSize));
        // If we have decent room, don't go below the classic 102px
        if (customCardHeight >= 320) {
          collapsedArtworkSize = Math.max(102, collapsedArtworkSize);
        }
      }
    } else if (!hasCustomCardHeight && collapsedArtworkSize > 0) {
      collapsedArtworkSize = 102; // Default
    }

    const effectiveExtraSpace = Math.max(-60, collapsedExtraSpace - reservedTopSpace);

    const baseDetailsMinHeight = 48;

    const detailGrowth = effectiveExtraSpace > 0
      ? Math.min(effectiveExtraSpace * 0.45, 96)
      : 0;
    const collapsedDetailsMinHeight = effectiveExtraSpace > 0
      ? Math.round(baseDetailsMinHeight + detailGrowth)
      : (effectiveExtraSpace < -20 ? 36 : baseDetailsMinHeight);
    const detailsScale = this._adaptiveTextTargets?.has("details") ? (this._currentDetailsScale || 1) : 1;
    const detailsMinHeight = Math.round((collapsed ? collapsedDetailsMinHeight : baseDetailsMinHeight) * detailsScale);
    let showCollapsedPlaceholder;
    const expandedHeightBaseline = 350;
    const resolvedCollapsedHeight = collapsed
      ? (hasCustomCardHeight ? customCardHeight : (this._collapsedBaselineHeight || 220))
      : expandedHeightBaseline;
    const meetsPersistentHeight = resolvedCollapsedHeight >= expandedHeightBaseline;
    const shouldShowPersistentControls = this.config.hide_menu_player === true
      ? false
      : (!collapsed || meetsPersistentHeight);

    // Adjust offsets for compact layout
    const isCompact = hasCustomCardHeight && customCardHeight < 280;
    const isCompactVolume = hasCustomCardHeight && customCardHeight < 320 && !this._alwaysCollapsed;
    const shouldHideVolumeControls = hideControlsNow || this._showEntityOptions || isCompactVolume;


    // Use null if idle or no artwork available
    let artworkUrl = null;
    let artworkSizePercentage = null;
    let artworkObjectFit = this._artworkObjectFit;
    let artworkObjectPosition = undefined;
    if (!this._isIdle && !forceIdleImage) {
      // Use the unified entity resolution system for artwork
      const artwork = selectedArt;
      artworkUrl = artwork?.url || null;
      artworkSizePercentage = artwork?.sizePercentage;
      if (artwork?.objectFit) {
        artworkObjectFit = artwork.objectFit;
      }
      if (artwork?.objectPosition) {
        artworkObjectPosition = artwork.objectPosition;
      }

    } else {
      // Even if idle, we apply layout properties from selectedArt, 
      // because _getArtworkUrl correctly finds idle_image overrides for us.
      if (selectedArt?.url) {
        idleImageUrl = selectedArt.url;
      }
      if (selectedArt?.objectFit) {
        artworkObjectFit = selectedArt.objectFit;
      }
      if (selectedArt?.objectPosition) {
        artworkObjectPosition = selectedArt.objectPosition;
      }
      if (selectedArt?.sizePercentage !== undefined) {
        artworkSizePercentage = selectedArt.sizePercentage;
      }
    }

    showCollapsedPlaceholder = collapsed && !artworkUrl && !idleImageUrl && effectiveExtraSpace >= 40;

    // Dominant color extraction for collapsed artwork
    if (collapsed && artworkUrl && artworkUrl !== this._lastArtworkUrl) {
      this._extractDominantColor(artworkUrl).then(color => {
        this._collapsedArtDominantColor = color;
        this.requestUpdate();
      });
      this._lastArtworkUrl = artworkUrl;
    }

    const idleMinHeight = hideControlsNow
      ? (collapsed
          ? (this._collapsedBaselineHeight || 220)
          : (hasCustomCardHeight ? effectiveCustomLowerHeight : 325))
      : null;

    this._lastRenderedCollapsed = collapsed;
    this._lastRenderedHideControls = hideControlsNow;

    const activeArtworkFit = artworkObjectFit || this._artworkObjectFit;
    const isAlternateFit = activeArtworkFit === "scaled-contain-alternate";
    const useInsetArtwork = (activeArtworkFit === "scaled-contain" || isAlternateFit) && !collapsed && !this._alwaysCollapsed;
    const hasSpacerContent =
      (useInsetArtwork && artworkUrl) ||
      (!useInsetArtwork && !artworkUrl && !idleImageUrl);
    // Add top padding to artwork spacer when scaled-contain and chips are not shown inline
    const needsArtworkTopPadding = (activeArtworkFit === "scaled-contain" || isAlternateFit) &&
      (showChipRow === "in_menu" || (hasSingleEntity && showChipRow !== "always"));
    const fitBehavior = this._getBackgroundSizeForFit(activeArtworkFit);
    let backgroundSize = fitBehavior;

    if (artworkSizePercentage) {
      backgroundSize = `${artworkSizePercentage}%`;
    }

    const backgroundImageValue = (activeArtworkFit === "no_artwork")
      ? "none"
      : (idleImageUrl || isAlternateFit)
        ? (idleImageUrl ? `url('${idleImageUrl}')` : "none")
        : artworkUrl
          ? `url('${artworkUrl}')`
          : "none";
    const hasBackgroundImage = backgroundImageValue !== "none";
    const backgroundFilter = (artworkUrl && (this.config.blurred_artwork === true || (this.config.blurred_artwork !== false && (collapsed || (useInsetArtwork && activeArtworkFit === "scaled-contain")))))
      ? "blur(18px) brightness(0.7) saturate(1.15)"
      : "none";
    let artworkPos = (typeof artworkObjectPosition !== 'undefined' ? artworkObjectPosition : null) || this.config.artwork_position || "top center";
    if (artworkFullBleed) {
      // Offset artwork away from edges to account for the chip row / controls that overlay the artwork
      if (artworkPos === "top center" || artworkPos === "center top") artworkPos = "center 50px";
      else if (artworkPos === "bottom center" || artworkPos === "center bottom") artworkPos = "center calc(100% - 50px)";
    }

    const sharedBackgroundStyle = [
      `background-image: ${backgroundImageValue}`,
      `background-size: ${useInsetArtwork ? "cover" : backgroundSize}`,
      `background-position: ${artworkPos}`,
      "background-repeat: no-repeat",
      `filter: ${backgroundFilter}`
    ].join('; ');

    const bgFit = this.config.background_fit || "cover";
    const bgPosition = this.config.background_position || "center center";
    const bgSize = this._getBackgroundSizeForFit(bgFit);
    const cardBgStyle = cardBackgroundImageUrl ? [
      `background-image: url('${cardBackgroundImageUrl}')`,
      `background-size: ${bgSize}`,
      `background-position: ${bgPosition}`,
      "background-repeat: no-repeat"
    ].join('; ') : (isDirectColorOrGradient ? [
      trimmedBgInput.startsWith("linear-gradient") || trimmedBgInput.startsWith("radial-gradient")
        ? `background-image: ${trimmedBgInput}`
        : `background-color: ${trimmedBgInput}`,
      "background-repeat: no-repeat"
    ].join('; ') : '');



    const isVolumeHiddenByConfig =
      hideControlsNow ||
      this._getEffectiveVolumeMode() === "hidden" ||
      isCompactVolume ||
      (hasCustomCardHeight && customCardHeight < 260 && collapsed);

    const isVolumeHidden =
      shouldHideVolumeControls ||
      isVolumeHiddenByConfig;

    const hasRightPlaceholder = this._controlLayout === "modern";
    const hasLeadingControl = leadingVolumeControl !== nothing && leadingVolumeControl !== undefined && leadingVolumeControl !== null;

    const volumeRowWillCollapse = isVolumeHiddenByConfig && !hasLeadingControl && !hasRightPlaceholder;

    const detailsHasAdaptiveText = !!this._adaptiveTextTargets?.has("details");
    this._lastSpacerRendered = !!(showCollapsedPlaceholder || (!collapsed && (!detailsHasAdaptiveText || hasSpacerContent)));
    this._lastVolumeRendered = !volumeRowWillCollapse;

    const lowerControlsH = this._lowerControlsHeight || (
      72 + // average unscaled details height
      (!this._alternateProgressBar ? 24 : 0) +
      (hideControlsNow ? 0 : 56) +
      (volumeRowWillCollapse ? 0 : 56)
    );
    const lyricsBottomOffset = lowerControlsH;
    const lyricsFade = this._getLyricsBackgroundFade();
    const lyricsBlurPx = lyricsFade === 0 ? 0 : Math.min(5, Number(((lyricsFade / 80) * 5).toFixed(1)));
    const lyricsBackdropFilter = lyricsBlurPx === 0 ? "none" : `blur(${lyricsBlurPx}px)`;

    const shouldAdaptMenuIconColor = this._artworkGradientDisabled || (this._isIdle && !hasBackgroundImage && !artworkUrl && !idleImageUrl);
    const menuIconStyle = shouldAdaptMenuIconColor ? 'color: var(--yamp-icon-color, var(--primary-text, #444));' : '';

    return html`
        <ha-card class="yamp-card" 
          style=${(hasCustomCardHeight && (!collapsed || this._alwaysCollapsed)) ? `height:${customCardHeight}px;` : nothing}>
          <div
            data-match-theme="${String(this.config.match_theme === true)}"
            data-has-font-color="${String(hasFontColor)}"
            data-artwork-fit="${activeArtworkFit}"
            data-has-background-image="${String(hasCardBg)}"
            data-lyrics-active="${String(this._lyricsActive === true)}"
            style=${[
              (hasCustomCardHeight && (!collapsed || this._alwaysCollapsed)) ? `height:${customCardHeight}px;` : null,
              this._lyricsActive ? `--yamp-lyrics-fade: ${lyricsFade}%; --yamp-lyrics-backdrop-filter: ${lyricsBackdropFilter}` : null,
              hasFontColor ? `--primary-text: ${cardFontColor}; --primary-text-color: ${cardFontColor}; --secondary-text: ${cardFontColor}; --secondary-text-color: ${cardFontColor}; --yamp-icon-color: ${cardFontColor};` : null
            ].filter(Boolean).join('; ') || nothing}
            class=${classMap({
      "yamp-card-inner": true,
      "compact-collapsed": isCompact && collapsed,
      "dim-idle": shouldDimIdle,
      "no-chip-dim": this.config.dim_chips_on_idle === false,
      "collapsed": collapsed
    })}
          >
            ${hasCardBg ? html`
              <div class="card-background-image-layer" style="${cardBgStyle}"></div>
              ${!this._artworkGradientDisabled && !isDirectColorOrGradient ? html`<div class="card-background-image-overlay"></div>` : nothing}
            ` : nothing}
            ${artworkFullBleed && hasBackgroundImage ? html`
              <div class="full-bleed-artwork-bg" style="${sharedBackgroundStyle}"></div>
              ${!this._artworkGradientDisabled && !(dimIdleFrame || this._isIdle || this._lyricsActive) ? html`<div class="full-bleed-artwork-fade"></div>` : nothing}
            ` : nothing}
            ${(!useInsetArtwork && !artworkUrl && !idleImageUrl && !hasCardBg) ? html`
              <div class="media-artwork-placeholder"
                @pointerdown=${this._onTapAreaPointerDown}
                @pointermove=${this._onTapAreaPointerMove}
                @pointerup=${this._onTapAreaPointerUp}
                @pointercancel=${this._onTapAreaPointerCancel}
                style="${this._getGestureStyles()}"
              >
                <svg
                  viewBox="0 0 184 184"
                  style="${this.config.match_theme === true ? 'color:#fff;' : 'color: var(--custom-accent, #ff9800);'}"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"></rect>
                  <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"></rect>
                  <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"></rect>
                  <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"></rect>
                </svg>
              </div>
            ` : nothing}
            ${(this._lyricsActive && !this._isIdle) ? html`
              <yamp-lyrics-view
                data-match-theme="${String(this.config.match_theme === true)}"
                data-artwork-fit="${activeArtworkFit}"
                data-playing="${String(this._isCurrentEntityPlaying())}"
                .hass=${this.hass}
                .lyrics=${this._lyricsController.lyrics}
                .position=${pos}
                .loading=${this._lyricsController.loading}
                .error=${this._lyricsController.error}
                .playing=${this._isCurrentEntityPlaying()}
                .activeThemeColor=${this.config.match_theme === true ? "var(--custom-accent, var(--state-media_player-active-color, var(--primary-color, #ffffff)))" : "var(--custom-accent, #ffffff)"}
                .mode=${this._isCurrentlyPlayingRadio() ? 'text' : (this.config.lyrics_mode || 'default')}
                .preRoll=${this.config.lyrics_pre_roll ?? 0}
                @pointerdown=${this._onTapAreaPointerDown}
                @pointermove=${this._onTapAreaPointerMove}
                @pointerup=${this._onTapAreaPointerUp}
                @pointercancel=${this._onTapAreaPointerCancel}
                style="${[
                  `--yamp-lyrics-top-offset: ${showChipsInline ? 48 : 0}px`,
                  `--yamp-lyrics-bottom-offset: ${lyricsBottomOffset}px`,
                  `--yamp-lyrics-fade: ${lyricsFade}%`,
                  `--yamp-lyrics-backdrop-filter: ${lyricsBackdropFilter}`,
                  this._getGestureStyles()
                ].filter(Boolean).join('; ')}"
              ></yamp-lyrics-view>
            ` : nothing}
            ${chipsHiddenInline
        ? html`${this._renderInlineActionRow(rowActions)}${this._renderInlineChipRow(showChipsInline, chipsHiddenInline)}`
        : html`${this._renderInlineChipRow(showChipsInline, chipsHiddenInline)}${this._renderInlineActionRow(rowActions)}`}
            ${this._volumeOverlayActive ? html`
              <div class="volume-overlay" @click=${() => this._dismissVolumeOverlay()}>
                <ha-icon icon=${this._getVolumeOverlayIcon()}></ha-icon>
                <span class="volume-overlay-text">${this._volumeOverlayValue}%</span>
              </div>
            ` : nothing}
            <div class="card-lower-content-container" style="${idleMinHeight ? `min-height:${idleMinHeight}px;` : ''}">
              <div class="card-lower-content-bg"
                style="${(() => {
        const styles = [];
        if (!(artworkFullBleed && hasBackgroundImage)) {
          styles.push(sharedBackgroundStyle);
        } else {
          styles.push('background-image: none', 'filter: none');
        }
        styles.push(`min-height: ${collapsed
          ? (hideControlsNow ? `${this._collapsedBaselineHeight || 220}px` : '0px')
          : (hasCustomCardHeight ? `${effectiveCustomLowerHeight}px` : '350px')}`);
        styles.push('transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s');
        return styles.join('; ');
      })()}"
              ></div>
              ${!this._artworkGradientDisabled && !(dimIdleFrame || this._isIdle || this._lyricsActive || (!artworkUrl && hasCardBg)) && (!useInsetArtwork || activeArtworkFit === "scaled-contain") ? html`<div class="card-lower-fade" style="--yamp-lyrics-bottom-offset: ${lyricsBottomOffset}px;"></div>` : nothing}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}${collapsed && artworkUrl && collapsedArtworkSize > 0 ? ' has-artwork' : ''}" style="${(() => {
        if (!hideControlsNow) return '';
        return collapsed
          ? `min-height: ${this._collapsedBaselineHeight || 220}px;`
          : `min-height: ${hasCustomCardHeight ? `${effectiveCustomLowerHeight}px` : `${this._lastNonLyricsLowerContentHeight || 350}px`};`;
      })()}">
                ${collapsed && artworkUrl && collapsedArtworkSize > 0 && isValidArtworkUrl(artworkUrl) ? html`
                  <div
                    class="collapsed-artwork-container"
                    @pointerdown=${this._onTapAreaPointerDown}
                    @pointermove=${this._onTapAreaPointerMove}
                    @pointerup=${this._onTapAreaPointerUp}
                    @pointercancel=${this._onTapAreaPointerCancel}
                    style="${[
          `background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%)`,
          collapsedExtraSpace > 0 ? `width:${Math.round(collapsedArtworkSize + 8)}px` : '',
          isCompact && collapsed ? 'top: -2px; height: auto !important; overflow: visible !important;' : '',
          this._getGestureStyles()
        ].filter(Boolean).join('; ')}"
                  >
                    <img
                      class="collapsed-artwork"
                      src="${artworkUrl}" 
                      style="${[
          this._getCollapsedArtworkStyle(),
          collapsedExtraSpace > 0 ? `width:${Math.round(collapsedArtworkSize)}px; height:${Math.round(collapsedArtworkSize)}px;` : ''
        ].filter(Boolean).join(' ')}" 
                      onload="this.style.display='block'"
                      onerror="this.style.display='none'" />
                  </div>
                ` : nothing}
                ${this._lastSpacerRendered ? html`
                  <div class="card-artwork-spacer${showCollapsedPlaceholder ? ' show-placeholder' : ''}"
                    @pointerdown=${!this._lyricsActive ? this._onTapAreaPointerDown : nothing}
                    @pointermove=${!this._lyricsActive ? this._onTapAreaPointerMove : nothing}
                    @pointerup=${!this._lyricsActive ? this._onTapAreaPointerUp : nothing}
                    @pointercancel=${!this._lyricsActive ? this._onTapAreaPointerCancel : nothing}
                    style="${[
                      this._lyricsActive ? 'pointer-events: none;' : '',
                      this._getGestureStyles(!this._lyricsActive)
                    ].filter(Boolean).join('; ')}"
                  >
                    ${useInsetArtwork && artworkUrl ? html`
                      <div style="position: absolute; ${needsArtworkTopPadding ? 'top: 20px; right: 0; bottom: 0; left: 0;' : 'inset: 0;'} display: flex; align-items: center; justify-content: center; pointer-events: none; box-sizing: border-box; padding: 0 5px;">
                        <img 
                          class="inset-artwork"
                          src="${artworkUrl}" 
                          style="max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: none;" 
                          onload="this.style.display='block'"
                          onerror="this.style.display='none'"
                        />
                      </div>
                    ` : nothing}
                  </div>
                ` : nothing}
                ${this.config.details_alignment !== 'none' ? html`
                  <div class="details" 
                    @pointerdown=${this._onIdleTapAreaPointerDown}
                    @pointermove=${this._onIdleTapAreaPointerMove}
                    @pointerup=${this._onIdleTapAreaPointerUp}
                    @pointercancel=${this._onIdleTapAreaPointerCancel}
                    style="${isCompact && collapsed ? 'margin-top: -12px; padding-bottom: 2px; min-height: 0; gap: 1px;' : ''} ${(() => {
          const detailStyleParts = [];
          if (this._showEntityOptions) {
            detailStyleParts.push('opacity:0');
            detailStyleParts.push('pointer-events:none');
          }
          detailStyleParts.push(`min-height:${detailsMinHeight}px`);
          if (!shouldShowDetails) detailStyleParts.push('opacity:0');
          if (!this._lastSpacerRendered) {
            if (!this._lyricsActive) {
              detailStyleParts.push('flex: 1');
            } else {
              detailStyleParts.push('margin-top: auto');
            }
            detailStyleParts.push('justify-content: flex-end');
          }
          const gestureStyles = this._getGestureStyles(this._isIdle);
          if (gestureStyles && !this._showEntityOptions) {
            detailStyleParts.push(gestureStyles);
          }
          return detailStyleParts.join(';');
        })()}">
                    ${this._showMediaTitleOptions ? html`
                      <div class="title track-options-row" style="display: flex; gap: 16px; align-items: center; cursor: pointer;">
                        ${this._massQueueAvailable ? html`
                          <div class="track-options-btn" @click=${(e) => { e.stopPropagation(); this._handleAddCurrentToPlaylist(); }} title="${localize('search.labels.add_to_playlist')}">
                            <ha-icon icon="mdi:playlist-plus"></ha-icon>
                            <span>${localize('search.add_to_playlist')}</span>
                          </div>
                        ` : nothing}
                        <div class="track-options-btn" @click=${(e) => { e.stopPropagation(); this._handlePlaySimilar(); }} title="${localize('search.play_similar')}">
                          <ha-icon icon="mdi:radio"></ha-icon>
                          <span>${localize('search.play_similar')}</span>
                        </div>
                        <div class="track-options-btn track-options-close" @click=${(e) => { e.stopPropagation(); this._showMediaTitleOptions = false; }} title="${localize('common.close')}">
                          <ha-icon icon="mdi:close"></ha-icon>
                        </div>
                      </div>
                    ` : html`
                      <div class="title track-options-title" @click=${(e) => { if (!this._suppressMarqueeClick && shouldShowDetails && title) { e.stopPropagation(); this._showMediaTitleOptions = true; } }} style="${shouldShowDetails && title ? 'cursor: pointer;' : ''}" title="${shouldShowDetails && title ? localize('search.show_track_options') : ''}">
                        <span class="marquee-inner">${shouldShowDetails && title ? title : html`&nbsp;`}</span>
                      </div>
                    `}
                    <div class="artist">
                      <span class="marquee-inner">${shouldShowDetails ? (
                        artist && album ? html`
                          <span
                            class="artist-name ${hasSearchableArtist ? "clickable-artist" : ""}"
                            @click=${(e) => {
                              if (this._suppressMarqueeClick) return;
                              if (hasSearchableArtist) {
                                e.stopPropagation();
                                this._searchArtistFromNowPlaying();
                              }
                            }}
                            title=${searchArtistTitle}
                          >${artist}</span><span class="artist-album-separator"> - </span><span
                            class="album-name clickable-album"
                            @click=${(e) => {
                              if (this._suppressMarqueeClick) return;
                              e.stopPropagation();
                              this._searchAlbumFromNowPlaying();
                            }}
                            title=${searchAlbumTitle}
                          >${album}</span>
                        ` : artist ? html`
                          <span
                            class="artist-name ${hasSearchableArtist ? "clickable-artist" : ""}"
                            @click=${(e) => {
                              if (this._suppressMarqueeClick) return;
                              if (hasSearchableArtist) {
                                e.stopPropagation();
                                this._searchArtistFromNowPlaying();
                              }
                            }}
                            title=${searchArtistTitle}
                          >${artist}</span>
                        ` : album ? html`
                          <span
                            class="album-name clickable-album"
                            @click=${(e) => {
                              if (this._suppressMarqueeClick) return;
                              e.stopPropagation();
                              this._searchAlbumFromNowPlaying();
                            }}
                            title=${searchAlbumTitle}
                          >${album}</span>
                        ` : html`&nbsp;`
                      ) : html`&nbsp;`}</span>
                    </div>
                  </div>
                ` : nothing}
                ${(!collapsed && !this._alternateProgressBar)
        ? (isPlaying && duration
          ? renderProgressBar({
            progress,
            seekEnabled: true,
            onSeek: (e) => this._onProgressBarClick(e),
            collapsed: false,
            style: this._showEntityOptions ? "visibility:hidden; opacity:0" : "",
            displayTimestamps: this._displayTimestamps,
            currentTime: pos,
            duration: duration,
            customHeight: this.config.progress_bar_height ?? DEFAULT_PROGRESS_BAR_HEIGHT
          })
          : renderProgressBar({
            progress: 0,
            seekEnabled: false,
            collapsed: false,
            style: "visibility:hidden; opacity:0",
            displayTimestamps: this._displayTimestamps,
            currentTime: 0,
            duration: 0,
            customHeight: this.config.progress_bar_height ?? DEFAULT_PROGRESS_BAR_HEIGHT
          })
        )
        : nothing
      }
                ${(collapsed || this._alternateProgressBar)
        ? (isPlaying && duration
          ? renderProgressBar({
            progress,
            collapsed: true,
            style: this._showEntityOptions ? "visibility:hidden; opacity:0" : "",
            customHeight: this.config.progress_bar_height ?? DEFAULT_PROGRESS_BAR_HEIGHT
          })
          : renderProgressBar({
            progress: 0,
            collapsed: true,
            style: "visibility:hidden; opacity:0",
            customHeight: this.config.progress_bar_height ?? DEFAULT_PROGRESS_BAR_HEIGHT
          })
        )
        : nothing
      }

                <div style="${hideControlsNow || this._showEntityOptions ? 'visibility:hidden; opacity:0; pointer-events:none;' : ''}">
                    ${renderControlsRow({
        stateObj: playbackStateObj,
        showStop: this._shouldShowStopButton(playbackStateObj),
        shuffleActive,
        repeatActive,
        onControlClick: (action) => this._onControlClick(action),
        supportsFeature: (state, feature) => this._supportsFeature(state, feature),
        showFavorite: showFavoriteButton,
        favoriteActive,
        hiddenControls: currentHiddenControls,
        adaptiveControls: this._adaptiveControls,
        controlLayout: this._controlLayout,
        swapPauseForStop: this._controlLayout === "modern" && this._swapPauseForStop,
        lockScreenState: this._isMediaSessionEnabled ? this._mediaSessionManager?.lockScreenState : null,
      })}
                </div>
                ${renderVolumeRow({
        isRemoteVolumeEntity,
        showSlider,
        vol,
        isDragging: this._volumeDraggingEntity === 'main',
        dragVol: this._dragVolume,
        isMuted: this.currentVolumeStateObj?.attributes?.is_volume_muted ?? false,
        supportsMute: this.currentVolumeStateObj ? this._supportsFeature(this.currentVolumeStateObj, SUPPORT_VOLUME_MUTE) : false,
        onVolumeDragStart: (e) => this._onVolumeDragStart(e),
        onVolumeDragEnd: (e) => this._onVolumeDragEnd(e),
        onVolumeInput: (e) => this._onVolumeInput(e),
        onVolumeChange: (e) => this._onVolumeChange(e),
        onVolumeStep: (dir) => this._onVolumeStep(dir),
        onMuteToggle: () => this._onMuteToggle(),
        leadingControlTemplate: shouldHideVolumeControls ? (leadingVolumeControl !== nothing ? html`<div style="visibility:hidden; opacity:0; pointer-events:none;">${leadingVolumeControl}</div>` : nothing) : leadingVolumeControl,
        reserveLeadingControlSpace: this._controlLayout === "modern",
        showRightPlaceholder: this._controlLayout === "modern",
        rightSlotTemplate: shouldHideVolumeControls ? (rightSlotTemplate !== nothing ? html`<div style="visibility:hidden; opacity:0; pointer-events:none;">${rightSlotTemplate}</div>` : nothing) : rightSlotTemplate,
        muteSlotTemplate: shouldHideVolumeControls ? (muteSlotTemplate !== nothing ? html`<div style="visibility:hidden; opacity:0; pointer-events:none;">${muteSlotTemplate}</div>` : nothing) : muteSlotTemplate,
        hideVolume: isVolumeHidden,
        collapseRow: volumeRowWillCollapse,
        moreInfoMenu: (!this._showEntityOptions && !volumeRowWillCollapse) ? html`
          <div class="more-info-menu">
            <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
              <span class="more-info-icon" style="${menuIconStyle}">&#9776;</span>
            </button>
          </div>
        ` : nothing,
      })}
            ${(volumeRowWillCollapse && !this._showEntityOptions) ? html`
              <div class="more-info-menu volume-collapsed">
                <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                  <span class="more-info-icon" style="${menuIconStyle}">&#9776;</span>
                </button>
              </div>
            ` : nothing}
            ${showChipsInMenu && !this._hideActiveEntityLabel && !(this._hideActiveEntityLabelOnIdle && this._isIdle) ? html`
              <div class="in-menu-active-label" style="${this._showEntityOptions ? 'visibility:hidden; opacity:0; pointer-events:none;' : ''}">${activeChipName}</div>
            ` : nothing}
          </div>
        </div>


      ${this._showEntityOptions ? this._renderOptionsOverlay({
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
      }) : nothing}
          ${this._searchActiveOptionsItem ? renderSearchOptionsOverlay({
        item: this._searchActiveOptionsItem,
        onClose: () => {
          this._searchActiveOptionsItem = null;
          this.requestUpdate();
        },
        onPlayOption: (item, mode) => this._performSearchOptionAction(item, mode),
        massQueueAvailable: this._massQueueAvailable
      }) : nothing
      }
          ${!shouldShowPersistentControls && !this.config.hide_reorder_progress && !this.config.hide_menu_player && this._queueOpsTotal > 0 ? html`
            <div class="queue-ops-progress" style="position: absolute !important; bottom: 12px !important; left: 50% !important; transform: translate(-50%, 0) !important; z-index: 1000 !important; width: max-content !important; pointer-events: none !important; color: var(--search-text-secondary) !important;">
              Re-ordering ${this._queueOpsCompleted} / ${this._queueOpsTotal}
            </div>
          ` : ""}
          ${(!this._showEntityOptions || !shouldShowPersistentControls) && this._lyricsActive && !this._isIdle && this._fetchingLyrics ? html`
            <div class="queue-ops-progress" style="position: absolute !important; bottom: 2px !important; left: 50% !important; transform: translate(-50%, 0) !important; z-index: 1000 !important; width: max-content !important; pointer-events: none !important; color: var(--search-text-secondary) !important;">
              ${localize("lyrics.finding")}
            </div>
          ` : ""}
          </div>
    </ha-card>
  `;
  }

  _getCardHeightMetrics(config) {
    const customCardHeightInput = this._cardHeight;
    const customCardHeight = typeof customCardHeightInput === "string"
      ? parseFloat(customCardHeightInput)
      : Number(customCardHeightInput);
    const isValidCardHeightNumber = typeof customCardHeight === "number" && Number.isFinite(customCardHeight) && customCardHeight > 0;
    const hasCustomCardHeight = !this._isFullScreen && isValidCardHeightNumber;
    return { customCardHeight, hasCustomCardHeight };
  }

  /**
   * Compute the maximum allowed collapsed artwork width based on the card's
   * rendered width. The 220px clearance reserves horizontal space for the
   * details/controls to the left of the artwork. The absolute cap of 160px
   * prevents artwork from dominating the card, and 64px is the minimum so
   * artwork remains recognisable even on narrow cards.
   */
  _getMaxCollapsedArtworkWidth(cardWidth) {
    return this._artworkController.getMaxCollapsedArtworkWidth(cardWidth);
  }

  _setHostDataAttributes(host, config, hasCustomCardHeight) {
    const appearance = this._appearance || "automatic";
    host.setAttribute("data-match-theme", String(config.match_theme === true));
    host.setAttribute("data-appearance", appearance);
    host.setAttribute("data-always-collapsed", String(this._alwaysCollapsed));

    if (this._isFullScreen) {
      host.setAttribute("fullscreen", "");
    } else {
      host.removeAttribute("fullscreen");
    }

    // Force hide menu player if always collapsed and no multiple entities/grouping mode
    const hasMultipleEntities = (this.entityObjs || []).length > 1;
    const forceHideMenuPlayer = this._alwaysCollapsed &&
      !hasMultipleEntities &&
      !this._showGrouping;

    host.setAttribute("data-hide-menu-player", String(config.hide_menu_player === true || forceHideMenuPlayer));
    host.setAttribute("data-extend-artwork", String(this._extendArtwork));
    host.setAttribute("data-disable-artwork-gradient", String(this._artworkGradientDisabled));
    host.setAttribute("data-control-layout", this._controlLayout || "classic");
    host.setAttribute("data-details-alignment", config.details_alignment || "left");

    // Calculate if we're in absolute minimum height mode (64px)
    const hasSingleEntity = (this.entityObjs || []).length === 1;
    const isMinHeight = hasSingleEntity && this._alwaysCollapsed && config.expand_on_search !== true;
    const effectivePinHeaders = config.pin_search_headers === true && !isMinHeight;
    host.setAttribute("data-pin-search-headers", String(effectivePinHeaders));
    host.setAttribute("data-in-search", String(this._showSearchInSheet));

    if (hasCustomCardHeight && !this._isFullScreen) {
      host.setAttribute("data-has-custom-height", "true");
    } else {
      host.removeAttribute("data-has-custom-height");
    }
  }

  _getPlaybackAndCollapseState(config) {
    const playbackEntityId = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    const playbackStateObj = (this.hass && this.hass.states && playbackEntityId) ? this.hass.states[playbackEntityId] : undefined;
    const isCurrentPlayingForIdle = playbackStateObj ? this._isEntityPlaying(playbackStateObj) : false;
    const isJsTemplate = typeof config.idle_image === "string" && config.idle_image.trim().startsWith("[[[");
    const rawIdleImageInput = isJsTemplate
      ? this._evaluateJsTemplate(config.idle_image)
      : (this._idleImageTemplate ? this._idleImageTemplateResult : (config.idle_image ? resolveStringTemplateSync(this.hass, config.idle_image, this._getTemplateContext()) : null));
    const normalizedIdleImageInput = this._normalizeImageSourceValue(rawIdleImageInput);
    const forceIdleImage = !!(
      config.show_idle_artwork_when_not_playing === true &&
      !isCurrentPlayingForIdle &&
      normalizedIdleImageInput
    );

    const isActuallyPlaying = this._isCurrentEntityPlaying();

    const collapsed = this._alwaysCollapsed ||
      (this._isIdle && config.collapse_on_idle === true && !isActuallyPlaying);

    return { playbackStateObj, collapsed, forceIdleImage };
  }

  _updatePersistentControlsVisibility(host, config, collapsed, customCardHeight, hasCustomCardHeight) {
    const expandedHeightBaseline = 350;
    const resolvedCollapsedHeight = collapsed
      ? (hasCustomCardHeight ? customCardHeight : (this._collapsedBaselineHeight || 220))
      : expandedHeightBaseline;
    const meetsPersistentHeight = resolvedCollapsedHeight >= expandedHeightBaseline;
    const shouldShowPersistentControls = config.hide_menu_player === true
      ? false
      : (!collapsed || meetsPersistentHeight);

    if (shouldShowPersistentControls) {
      host.removeAttribute('data-hide-persistent-controls');
    } else {
      host.setAttribute('data-hide-persistent-controls', 'true');
    }
  }

  _updateHostLayoutStyles(host, config, collapsed, customCardHeight, hasCustomCardHeight) {
    const isCompact = hasCustomCardHeight && customCardHeight < 280;
    const showChipRow = config.show_chip_row || "auto";
    const hasMultipleEntities = (this.entityObjs || []).length > 1;
    const showChipsInMenu = (showChipRow === "in_menu" || (showChipRow === "in_menu_on_idle" && this._isIdle)) && hasMultipleEntities;
    const renderChipRowSeparately = showChipRow !== "hidden" && !showChipsInMenu && hasMultipleEntities;
    const renderActionChipRow = config.action_chips && config.action_chips.length > 0;

    const cardWidth = this.offsetWidth || 0;
    const topChipReserve = renderChipRowSeparately ? 58 : 0;
    const topActionReserve = renderActionChipRow ? 42 : 0;
    const totalTopReserve = topChipReserve + topActionReserve;
    const effectiveHeight = hasCustomCardHeight ? Math.max(0, customCardHeight - totalTopReserve) : 0;

    const layoutStateKey = [
      cardWidth,
      customCardHeight,
      collapsed,
      showChipRow,
      hasMultipleEntities,
      this._isIdle,
      renderActionChipRow,
      this._artworkObjectFit,
      this._collapsedBaselineHeight,
      this._alwaysCollapsed,
      this._getEffectiveVolumeMode(),
      this._showEntityOptions
    ].join('_');

    if (this._lastLayoutStateKey === layoutStateKey) {
      return;
    }
    this._lastLayoutStateKey = layoutStateKey;

    if (collapsed) {
      let collapsedArtworkSize;
      if (hasCustomCardHeight) {
        const maxSize = this._getMaxCollapsedArtworkWidth(cardWidth);
        collapsedArtworkSize = Math.max(0, Math.min(maxSize, Math.round((customCardHeight - (isCompact ? 90 : 130)) * 0.95)));
      } else {
        collapsedArtworkSize = (this._artworkObjectFit === "no_artwork") ? 0 : 64;
      }

      const collapsedBaselineHeight = this._collapsedBaselineHeight || 220;
      const collapsedExtraSpace = hasCustomCardHeight ? (customCardHeight - collapsedBaselineHeight) : 0;

      const collapsedDetailsOffset = (collapsedArtworkSize > 0)
        ? Math.round(collapsedArtworkSize + (isCompact ? 12 : 24) + Math.min(40, Math.max(0, collapsedExtraSpace) * 0.12))
        : 0;

      const baseExtraSpace = hasCustomCardHeight ? (customCardHeight - 240) : 0;
      const effectiveExtraSpace = Math.max(0, baseExtraSpace - topChipReserve);
      const detailGrowth = Math.min(90, effectiveExtraSpace * 0.45);
      const controlSpacerSize = effectiveExtraSpace > 0 ? Math.max(0, effectiveExtraSpace - detailGrowth) : 0;
      const releaseControlsRow = controlSpacerSize >= 48;
      const collapsedControlsOffset = releaseControlsRow ? 0 : collapsedDetailsOffset;

      const widthScale = cardWidth > 380 ? Math.min(1.6, 1 + (cardWidth - 380) / 520) : 1;
      const heightScale = collapsedExtraSpace > 0
        ? Math.min(1.45, 1 + effectiveExtraSpace / 180)
        : (isCompact ? 0.9 : 1);
      const titleScale = (heightScale > 1 || widthScale > 1)
        ? Math.min(1.6, Math.max(heightScale, widthScale))
        : (isCompact ? 0.95 : 1);
      const artistScale = isCompact ? 0.85 : Math.min(1.5, Math.max(heightScale * 0.92, widthScale * 0.92));

      const isCompactVolume = hasCustomCardHeight && customCardHeight < 320 && !this._alwaysCollapsed;
      const hideVolume = this._getEffectiveVolumeMode() === "hidden" || isCompactVolume || (hasCustomCardHeight && customCardHeight < 260 && !this._showEntityOptions);
      const artworkClearance = hideVolume ? 54 : 100;

      if (collapsedExtraSpace !== 0 || isCompact) {
        host.style.setProperty('--yamp-collapsed-details-offset', `${collapsedDetailsOffset}px`);
        host.style.setProperty('--yamp-collapsed-controls-offset', `${collapsedControlsOffset}px`);
        host.style.setProperty('--yamp-collapsed-title-scale', titleScale.toFixed(3));
        host.style.setProperty('--yamp-collapsed-artist-scale', artistScale.toFixed(3));
        host.style.setProperty('--yamp-collapsed-artwork-size', `${collapsedArtworkSize}px`);
        host.style.setProperty('--yamp-collapsed-artwork-clearance', `${artworkClearance}px`);
      } else {
        host.style.removeProperty('--yamp-collapsed-controls-offset');
        host.style.removeProperty('--yamp-collapsed-details-offset');
        host.style.removeProperty('--yamp-collapsed-artwork-size');
        host.style.removeProperty('--yamp-collapsed-title-scale');
        host.style.removeProperty('--yamp-collapsed-artist-scale');
        host.style.removeProperty('--yamp-collapsed-artwork-clearance');
      }
    } else {
      // Expanded mode scaling
      if (hasCustomCardHeight) {
        // Adjust button sizes and padding based on available height
        // Base expanded stack minimums: spacer 180 + details 60 + controls 82 + volume 64 = 386px
        let primarySize = 70;
        let mediumSize = 50;
        let smallSize = 42;
        let primaryIcon = 36;
        let mediumIcon = 28;
        let smallIcon = 24;
        let controlsPadding = "16px";
        let controlsGap = "20px";
        let volumePadding = "10px 16px 14px 16px";

        if (effectiveHeight < 380) {
          const heightRatio = Math.max(0.6, effectiveHeight / 380);
          
          primarySize = Math.max(48, Math.round(70 * heightRatio));
          mediumSize = Math.max(36, Math.round(50 * heightRatio));
          smallSize = Math.max(32, Math.round(42 * heightRatio));
          
          primaryIcon = Math.max(24, Math.round(36 * heightRatio));
          mediumIcon = Math.max(20, Math.round(28 * heightRatio));
          smallIcon = Math.max(18, Math.round(24 * heightRatio));
          
          controlsPadding = `${Math.max(4, Math.round(16 * heightRatio))}px 16px`;
          controlsGap = `${Math.max(8, Math.round(20 * heightRatio))}px`;
          volumePadding = `${Math.max(4, Math.round(10 * heightRatio))}px 16px ${Math.max(8, Math.round(14 * heightRatio))}px 16px`;
        }

        host.style.setProperty('--yamp-modern-primary-size', `${primarySize}px`);
        host.style.setProperty('--yamp-modern-medium-size', `${mediumSize}px`);
        host.style.setProperty('--yamp-modern-small-size', `${smallSize}px`);
        host.style.setProperty('--yamp-modern-primary-icon-size', `${primaryIcon}px`);
        host.style.setProperty('--yamp-modern-medium-icon-size', `${mediumIcon}px`);
        host.style.setProperty('--yamp-modern-small-icon-size', `${smallIcon}px`);
        host.style.setProperty('--yamp-modern-padding', controlsPadding);
        host.style.setProperty('--yamp-modern-gap', controlsGap);
        host.style.setProperty('--yamp-volume-row-padding', volumePadding);
      } else {
        host.style.removeProperty('--yamp-modern-primary-size');
        host.style.removeProperty('--yamp-modern-medium-size');
        host.style.removeProperty('--yamp-modern-small-size');
        host.style.removeProperty('--yamp-modern-primary-icon-size');
        host.style.removeProperty('--yamp-modern-medium-icon-size');
        host.style.removeProperty('--yamp-modern-small-icon-size');
        host.style.removeProperty('--yamp-modern-padding');
        host.style.removeProperty('--yamp-modern-gap');
        host.style.removeProperty('--yamp-volume-row-padding');
      }

      host.style.removeProperty('--yamp-collapsed-controls-offset');
      host.style.removeProperty('--yamp-collapsed-details-offset');
      host.style.removeProperty('--yamp-collapsed-artwork-size');
      host.style.removeProperty('--yamp-collapsed-title-scale');
      host.style.removeProperty('--yamp-collapsed-artist-scale');
      host.style.removeProperty('--yamp-collapsed-artwork-clearance');
    }
  }

  _updateHostArtworkStyles(host, playbackStateObj, forceIdleImage) {
    this._artworkController.updateHostArtworkStyles(host, playbackStateObj, forceIdleImage);
  }

  _updateHostAttributes() {
    if (!this.shadowRoot || !this.shadowRoot.host || !this.hass || !this.config) return;

    const host = this.shadowRoot.host;
    const config = this.config;

    const { customCardHeight, hasCustomCardHeight } = this._getCardHeightMetrics(config);

    this._setHostDataAttributes(host, config, hasCustomCardHeight);

    const { playbackStateObj, collapsed, forceIdleImage } = this._getPlaybackAndCollapseState(config);

    this._updatePersistentControlsVisibility(host, config, collapsed, customCardHeight, hasCustomCardHeight);

    this._updateHostLayoutStyles(host, config, collapsed, customCardHeight, hasCustomCardHeight);

    this._updateHostArtworkStyles(host, playbackStateObj, forceIdleImage);
  }

  _renderSearchSubFilters(showSearchHeaders) {
    return renderSearchSubFilters.call(this, showSearchHeaders);
  }

  _renderSearchInOptions(showSearchHeaders, pinSearchHeaders = false) {
    return renderSearchInOptions.call(this, showSearchHeaders, pinSearchHeaders);
  }

  _renderSourceListSheet(sourceList, sourceLetters, availableSourceFirstLetters) {
    return renderSourceListSheet.call(this, sourceList, sourceLetters, availableSourceFirstLetters);
  }

  _updateIdleState(changedProps) {
    if (this._cardType === "group_players") {
      if (this._idleTimeout) clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
      this._setIdleState(false);
      this._showEntityOptions = true;
      this._showGrouping = true;
      return;
    }
    // Consider both main and Music Assistant entities so we can wake from idle
    // even if the active selection is frozen while idle.
    const isAnyUnrestrictedPlaying = this.entityIds.some((id, idx) => {
      if (this._isAutoSelectDisabled(idx)) return false;

      const activeId = this._getEntityForPurpose(idx, 'sorting');
      return this._isEntityPlaying(this.hass?.states?.[activeId]);
    });

    const isCurrentPlaying = this._isCurrentEntityPlaying();
    const isCurrentDisabled = this._isAutoSelectDisabled(this._selectedIndex);

    // Condition to wake up or stay active immediately:
    // Only wake up (from idle or initial load) if an UNRESTRICTED player is active.
    // If already active, we only stay active immediately if the CURRENT player is playing
    // AND it's either an unrestricted entity OR the user manually selected it.
    const isCurrentPlayingValidForActive = isCurrentPlaying && (!isCurrentDisabled || this._manualSelect);

    let shouldBeActiveImmediately;
    if (this._isIdle || !this._hasSeenPlayback) {
      shouldBeActiveImmediately = isAnyUnrestrictedPlaying || isCurrentPlaying;
    } else {
      shouldBeActiveImmediately = isCurrentPlayingValidForActive;
    }

    if (shouldBeActiveImmediately) {
      // Became active, clear timer and set not idle
      if (this._idleTimeout) clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
      this._hasSeenPlayback = true;
      if (this._isIdle) {
        this._setIdleState(false);
        this._resetIdleScreen();
        this.requestUpdate();
      }
      return;
    }

    // Defer idle state if user is actively browsing menus
    if (this.isAnyMenuOpen) {
      if (this._idleTimeout) {
        clearTimeout(this._idleTimeout);
        this._idleTimeout = null;
      }
      return;
    }

    // Current is not playing, or nothing is playing.
    if (!this._hasSeenPlayback) {
        // Initial load with nothing playing - go idle immediately
        if (this._idleTimeoutMs > 0) {
          if (!this._isIdle) {
            this._setIdleState(true);
            this._idleScreenApplied = false;
            this._applyIdleScreen();
            this.requestUpdate();
          }
        } else if (this._isIdle) {
          this._setIdleState(false);
          this._resetIdleScreen();
          this.requestUpdate();
        }
        return;
      }

      // Check for grace period: something is playing somewhere, but not the current choice.
      // Or nothing is playing at all. In both cases, we wait for the timeout.
      if (!this._isIdle && this._idleTimeoutMs > 0) {
        const isTabChange = changedProps && changedProps.has("_selectedIndex");

        if (isTabChange) {
          // If we manually change tabs/chips, clear any existing idle timeout to start fresh
          if (this._idleTimeout) {
            clearTimeout(this._idleTimeout);
            this._idleTimeout = null;
          }

          if (!isAnyUnrestrictedPlaying && this._idleTimeoutMs > 0) {
            // Bypass grace period if we just switched away from the only thing keeping the card awake (a playing disabled entity)
            this._setIdleState(true);
            this._idleScreenApplied = false;

            if (this._pinnedIndex === null) {
              this._manualSelect = false;
              this._manualSelectPlayingSet = null;
            }

            this._applyIdleScreen();
            this.requestUpdate();
          } else {
            // Something is playing, start a fresh timeout for the new selection
            this._idleTimeout = setTimeout(() => {
              this._handleIdleTimeoutCallback();
            }, this._idleTimeoutMs);
          }
        } else if (!this._idleTimeout) {
          this._idleTimeout = setTimeout(() => {
            this._handleIdleTimeoutCallback();
          }, this._idleTimeoutMs);
        }
      }

      // If idle_timeout_ms is 0, ensure we're never idle
      if (this._idleTimeoutMs === 0 && this._isIdle) {
        this._setIdleState(false);
        this._resetIdleScreen();
        this.requestUpdate();
      }
  }

  _handleIdleTimeoutCallback() {
    if (this._cardType === "group_players") {
      this._idleTimeout = null;
      this._setIdleState(false);
      this._showEntityOptions = true;
      this._showGrouping = true;
      this.requestUpdate();
      return;
    }
    // In search card mode: reset drill-down instead of going idle
    if (this._cardType === "search" || this._cardType === "up_next") {
      this._idleTimeout = null;
      if (this._searchHierarchy.length > 0) {
        this._searchHierarchy = [];
        this._searchBreadcrumb = "";
        this._searchResultsByType = {};
        const defaultFilter = this.config?.default_search_filter === 'all' ? null : this.config?.default_search_filter;
        this._doSearch(defaultFilter).catch(() => { });
        this.requestUpdate();
      }
      return;
    }

    // Check if there is any playing entity before going idle
    const isAnyPlaying = this.entityIds.some((id, idx) => {
      if (this._isAutoSelectDisabled(idx)) return false;
      const activeId = this._getEntityForPurpose(idx, 'sorting');
      const stateObj = this.hass?.states?.[activeId];
      return stateObj && this._isEntityPlaying(stateObj);
    });

    this._idleTimeout = null;

    // If not explicitly pinned, clear manual select on idle timeout
    // so we can switch to other playing entities if needed
    if (this._pinnedIndex === null) {
      this._manualSelect = false;
      this._manualSelectPlayingSet = null;
    }

    if (isAnyPlaying) {
      // Something is playing, so don't enter idle state. Switch to the playing entity instead.
      const sortedIds = this.sortedEntityIds;
      if (sortedIds.length > 0) {
        let mostRecentId = sortedIds[0];
        const candidateGroup = mostRecentId
          ? (this.groupedSortedEntityIds || []).find(g => g.includes(mostRecentId))
          : null;
        if (candidateGroup && candidateGroup.length > 1) {
          const groupMaster = this._getActualGroupMaster(candidateGroup);
          if (groupMaster) {
            mostRecentId = groupMaster;
          }
        }
        const mostRecentIdx = this.entityIds.indexOf(mostRecentId);
        if (mostRecentIdx >= 0 && mostRecentIdx !== this._selectedIndex) {
          this._selectedIndex = mostRecentIdx;
        }
      }
      this.requestUpdate();
      return;
    }

    this._setIdleState(true);
    this._idleScreenApplied = false;
    this._applyIdleScreen();
    this.requestUpdate();
  }

  // Home assistant layout options
  getGridOptions() {
    // Use the same logic as in render() to know if the card is collapsed.
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._showSearchInSheet)) {
      collapsed = false;
    } else {
      collapsed = this._alwaysCollapsed
        ? true
        : (this._collapseOnIdle ? this._isIdle : false);
    }



    const minRows = collapsed ? 2 : 4;

    return {
      min_rows: minRows,
      // Keep the default full‑width behaviour explicit.
      columns: 12,
    };
  }

  // Configuration editor schema for Home Assistant UI editors
  static get _schema() {
    return [
      {
        name: "entities",
        selector: {
          entity: {
            multiple: true,
            domain: "media_player"
          }
        },
        required: true
      },
      {
        name: "show_chip_row",
        selector: {
          select: {
            options: [
              { value: "auto", label: "Auto" },
              { value: "always", label: "Always" },
              { value: "in_menu", label: "In Menu" },
              { value: "in_menu_on_idle", label: "In Menu on Idle" }
            ]
          }
        },
        required: false
      },
      {
        name: "idle_screen",
        selector: {
          select: {
            options: [
              { value: "default", label: "Default" },
              { value: "search", label: "Search" },
              { value: "source", label: "Source" },
              { value: "more-info", label: "More Info" },
              { value: "group-players", label: "Speakers & Groups" },
              { value: "transfer-queue", label: "Speakers & Groups (Legacy)" }
            ]
          }
        },
        required: false
      },
      {
        name: "hold_to_pin",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "disable_autofocus",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "idle_image",
        selector: {
          entity: {
            domain: "",
            multiple: false
          }
        },
        required: false
      },
      {
        name: "background_image",
        selector: {
          text: {}
        },
        required: false
      },
      {
        name: "match_theme",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "collapse_on_idle",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "always_collapsed",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "expand_on_search",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "alternate_progress_bar",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
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
      },
      {
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
      },
      {
        name: "volume_mode",
        selector: {
          select: {
            options: [
              { value: "slider", label: "Slider" },
              { value: "stepper", label: "Stepper" }
            ]
          }
        },
        required: false
      },
      {
        name: "actions",
        selector: {
          object: {}
        },
        required: false
      },
      {
        name: "dim_chips_on_idle",
        selector: {
          boolean: {}
        },
        required: false
      },
      {
        name: "pin_search_headers",
        selector: {
          boolean: {}
        },
        required: false
      }
    ];
  }

  firstUpdated() {
    super.firstUpdated?.();
    if (this._cardType === "group_players") {
      this._showEntityOptions = true;
      this._setIdleState(false);
      this._showGrouping = true;
      this.requestUpdate();
    }
    // Trap scroll events inside floating index so they don't scroll the page
    const index = this.renderRoot.querySelector('.floating-source-index');
    if (index) {
      index.addEventListener('wheel', function (e) {
        const { scrollTop, scrollHeight, clientHeight } = index;
        const delta = e.deltaY;
        if (
          (delta < 0 && scrollTop === 0) ||
          (delta > 0 && scrollTop + clientHeight >= scrollHeight)
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
        // Otherwise, allow scroll
      }, { passive: false });
    }
  }

  _addGrabScroll(selector) {
    const row = this.renderRoot.querySelector(selector);
    if (!row || row._grabScrollAttached) return;
    let isDown = false;
    let startX, scrollLeft;
    // Track drag state to suppress clicks

    const mousedownHandler = (e) => {
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
    const mousemoveHandler = (e) => {
      if (!isDown) return;
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startX);
      // Mark as dragged if moved > 5px
      if (Math.abs(walk) > 5) {
        row._dragged = true;
      }
      e.preventDefault();
      row.scrollLeft = scrollLeft - walk;
    };
    const clickHandler = (e) => {
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

    const mousedownHandler = (e) => {
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
    const mousemoveHandler = (e) => {
      if (!isDown) return;
      const y = e.pageY - col.getBoundingClientRect().top;
      const walk = (y - startY);
      if (Math.abs(walk) > 5) col._dragged = true;
      e.preventDefault();
      col.scrollTop = scrollTop - walk;
    };
    const clickHandler = (e) => {
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
    const elements = this.renderRoot.querySelectorAll(
      '.chip-row, .action-chip-row, .floating-source-index, .search-filter-chips'
    );

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
    this._isEditorPreviewCached = undefined;
    if (this._activeDragCleanup) {
      this._activeDragCleanup();
    }
    if (this._idleTimeout) {
      clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
    }
    if (this._dragClickCaptureTimeout) {
      clearTimeout(this._dragClickCaptureTimeout);
      this._dragClickCaptureTimeout = null;
    }
    if (this._dragClickCaptureFn) {
      window.removeEventListener("click", this._dragClickCaptureFn, true);
      this._dragClickCaptureFn = null;
    }
    if (this._handleKeyDownBound) {
      window.removeEventListener("keydown", this._handleKeyDownBound);
    }
    if (this._handleVisibilityChangeBound) {
      document.removeEventListener("visibilitychange", this._handleVisibilityChangeBound);
    }
    // Unsubscribe from queue update events
    this._unsubscribeFromQueueUpdates();
    if (this._lyricsController) {
      this._lyricsController.hostDisconnected();
    }
    if (this._queueController) {
      this._queueController.hostDisconnected();
    }
    if (this._mediaSessionManager) {
      this._mediaSessionManager.destroy();
    }
    if (this._mediaSessionUpdateTimer) {
      clearTimeout(this._mediaSessionUpdateTimer);
      this._mediaSessionUpdateTimer = null;
    }
    if (this._searchHeaderTransitionTimer) {
      clearTimeout(this._searchHeaderTransitionTimer);
      this._searchHeaderTransitionTimer = null;
    }
    super.disconnectedCallback?.();
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    if (this._debouncedVolumeTimer) {
      clearTimeout(this._debouncedVolumeTimer);
      this._debouncedVolumeTimer = null;
    }
    if (this._volumeOverlayTimer) {
      clearTimeout(this._volumeOverlayTimer);
      this._volumeOverlayTimer = null;
    }
    if (this._internalVolumeSuppressTimer) {
      clearTimeout(this._internalVolumeSuppressTimer);
      this._internalVolumeSuppressTimer = null;
    }

    if (this._manualSelectTimeout) {
      clearTimeout(this._manualSelectTimeout);
      this._manualSelectTimeout = null;
    }
    if (this._searchTimeoutHandle && !this._searchLoading) {
      clearTimeout(this._searchTimeoutHandle);
      this._searchTimeoutHandle = null;
    }

    if (this._queueRefreshTimer) {
      clearTimeout(this._queueRefreshTimer);
      this._queueRefreshTimer = null;
    }

    if (this._gestureHoldTimer) {
      clearTimeout(this._gestureHoldTimer);
      this._gestureHoldTimer = null;
    }

    if (this._tapTimer) {
      clearTimeout(this._tapTimer);
      this._tapTimer = null;
    }

    if (this._successToastHandle) {
      clearTimeout(this._successToastHandle);
      this._successToastHandle = null;
    }

    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }

    if (this._queueOpsTimeout) {
      clearTimeout(this._queueOpsTimeout);
      this._queueOpsTimeout = null;
    }

    this._removeSourceDropdownOutsideHandler();
    this._removeGrabScrollHandlers();
    this._removeSearchSwipeHandlers();
    window.removeEventListener("scroll", this._handleGlobalScroll);
    window.removeEventListener("resize", this._handleViewportResize);
    if (typeof this._teardownAdaptiveTextObserver === 'function') this._teardownAdaptiveTextObserver();

    // Cleanup all websocket subscriptions via TemplateController
    this._templateController.unsubscribeAll();

    if (this._adaptiveScrollTimer) {
      clearTimeout(this._adaptiveScrollTimer);
      this._adaptiveScrollTimer = null;
    }
    this._cleanupMarquee();
    // Clear tracking properties
    this._lastPlayingEntityId = null;
    this._controlFocusEntityId = null;
  }

  // Helper method to apply closing animations
  _applyClosingAnimations() {
    const overlay = this.renderRoot.querySelector('.entity-options-overlay');
    const container = this.renderRoot.querySelector('.entity-options-container');
    const sheet = this.renderRoot.querySelector('.entity-options-sheet');

    if (overlay) {
      overlay.classList.remove('entity-options-overlay-opening');
      overlay.classList.add('entity-options-overlay-closing');
    }
    if (container) {
      container.classList.remove('entity-options-container-opening');
      container.classList.add('entity-options-container-closing');
    }
    if (sheet) {
      sheet.classList.remove('entity-options-sheet-opening');
      sheet.classList.add('entity-options-sheet-closing');
    }
  }

  // Helper method for immediate dismissals with animation
  _dismissWithAnimation() {
    // In dedicated search mode, don't dismiss the search — just close other menus
    if (this._cardType === "search" || this._cardType === "up_next") {
      this._showGrouping = false;
      this._showSourceList = false;
      this._showResolvedEntities = false;
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
      // Keep search open — re-show it
      this._showEntityOptions = true;
      this._showSearchInSheet = true;
      this._quickMenuInvoke = false;
      this.requestUpdate();
      return;
    }
    if (this._cardType === "group_players") {
      this._showSourceList = false;
      this._showSearchInSheet = false;
      this._showResolvedEntities = false;
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
      this._showEntityOptions = true;
      this._showGrouping = true;
      this._quickMenuInvoke = false;
      this.requestUpdate();
      return;
    }
    this._applyClosingAnimations();
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }
    setTimeout(() => {
      this._showEntityOptions = false;
      this._showGrouping = false;
      this._showSourceList = false;
      this._showSearchInSheet = false;
      this._showResolvedEntities = false;
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
      this._quickMenuInvoke = false;
      this.requestUpdate();
    }, 200);
  }

  // Entity options overlay handlers
  _closeEntityOptions(e) {
    if (this._isDragging) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }
    // In dedicated search mode, don't close the entity options / search
    if (this._cardType === "search" || this._cardType === "up_next") {
      // Just close any sub-menus that might be open
      this._showGrouping = false;
      this._showSourceList = false;
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
      this._showResolvedEntities = false;
      this.requestUpdate();
      return;
    }
    if (this._cardType === "group_players") {
      this._showSourceList = false;
      this._showSearchInSheet = false;
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
      this._showResolvedEntities = false;
      this._showEntityOptions = true;
      this._showGrouping = true;
      this.requestUpdate();
      return;
    }
    // Apply closing animations
    this._applyClosingAnimations();
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }

    // Wait for animation to complete before hiding
    setTimeout(() => {
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
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
        this._showSearchInSheet = false;
        this._showResolvedEntities = false;
        if (this._cardType !== "remote_control") {
          this._showRemoteControl = false;
        }
        this._openedSearchFromNowPlaying = false;
        this._searchInputAutoFocused = false;
        this._searchHierarchy = [];
        this._searchBreadcrumb = "";
        this._addToPlaylistTarget = null;
        this._lastSearchUsedServerFavorites = false;
        this.requestUpdate();
      }
      // Clear quick menu flag on any overlay close
      this._quickMenuInvoke = false;
    }, 200); // Match the longest animation duration
  }

  async _openEntityOptions() {
    // Resolve all templates before opening the menu so feature checking works correctly
    for (let i = 0; i < this.entityObjs.length; i++) {
      await this._ensureResolvedMaForIndex(i);
      await this._ensureResolvedVolForIndex(i);
      await this._ensureResolvedRemoteForIndex(i);
      await this._ensureResolvedHiddenControlsForIndex(i);
    }

    await this._updateTransferQueueAvailability({ refresh: true });


    this._showEntityOptions = true;
    this.requestUpdate();
    this.updateComplete.then(() => {
      const strip = this.renderRoot?.querySelector('.entity-options-chips-strip');
      if (strip) {
        strip.scrollLeft = 0;
      }
    });
  }

  // Deprecated: _triggerMoreInfo is replaced by _openMoreInfo for clarity.


  // Grouping Helper Methods 
  _openGrouping() {
    this._showEntityOptions = true;  // ensure the overlay is visible
    this._showGrouping = true;       // show grouping sheet immediately
    // Remember the actual group master for the current selection
    const currentId = this.currentEntityId;
    let masterId = currentId;
    if (currentId) {
      const groups = this.groupedSortedEntityIds || [];
      const group = groups.find(g => g.includes(currentId));
      if (group && group.length) {
        const actual = this._getActualGroupMaster(group);
        if (actual) {
          masterId = actual;
        }
      }
    }
    if (!masterId && this.entityIds && this.entityIds.length) {
      masterId = this.entityIds[0];
    }
    this._lastGroupingMasterId = masterId;
    this.requestUpdate();
  }

  // Remote Controls Overlay Helper Methods
  _hasRemoteControlSupport() {
    const idx = this._selectedIndex;
    const obj = (this.entityObjs || [])[idx];

    if (obj?.remote_entity === false) return false;

    return !!this._getRemoteControlEntity(true);
  }

  _getRemoteControlEntity(strict = true) {
    const idx = this._selectedIndex;
    const obj = (this.entityObjs || [])[idx];

    if (obj?.remote_entity) {
      const resolved = this._resolveEntity(obj.remote_entity, null, idx, 'remote') || resolveStringTemplateSync(this.hass, obj.remote_entity, this._getTemplateContext());
      if (resolved && typeof resolved === "string" && resolved.trim() !== "") return resolved.trim();
    }

    const currentId = this.currentEntityId;
    if (!currentId) return null;

    if (currentId.startsWith("remote.")) return currentId;

    if (currentId.startsWith("media_player.")) {
      const name = currentId.replace("media_player.", "");
      const candidate = `remote.${name}`;
      if (this.hass?.states?.[candidate]) {
        return candidate;
      }
    }

    return strict ? null : currentId;
  }

  _sendRemoteCommand(command) {
    const targetEntity = this._getRemoteControlEntity();
    if (!targetEntity) return;

    sendRemoteCommand(this.hass, targetEntity, command);
  }

  _openRemoteControl() {
    this._showEntityOptions = true;
    this._showRemoteControl = true;
    this._showGrouping = false;
    this._showSourceList = false;
    this._showTransferQueue = false;
    this._showSearchInSheet = false;
    this._showResolvedEntities = false;
    this.requestUpdate();
  }

  _closeRemoteControl() {
    if (this._cardType === "remote_control") return;
    this._showRemoteControl = false;
    this.requestUpdate();
  }

  _toggleFullScreen() {
    this._fullScreenOverride = !this._isFullScreen;
    this._updateHostAttributes();
    this.requestUpdate();
  }

  _enterFullScreen() {
    this._fullScreenOverride = true;
    this._updateHostAttributes();
    this.requestUpdate();
  }

  _exitFullScreen() {
    this._fullScreenOverride = false;
    this._updateHostAttributes();
    this.requestUpdate();
  }

  _handleKeyDown(e) {
    if (e.key === "Escape" && this._isFullScreen) {
      if (this._showEntityOptions) {
        this._closeEntityOptions();
        return;
      }
      if (this._showSearchInSheet) {
        this._hideSearchSheetInOptions();
        return;
      }
      this._exitFullScreen();
    }
  }

  _getHiddenRemoteButtons() {
    const idx = this._selectedIndex;
    const obj = (this.entityObjs || [])[idx];
    let raw = obj?.hide_remote_buttons ?? this.config.hide_remote_buttons;

    if (typeof raw === "string" && (raw.includes("{{") || raw.includes("{%") || raw.includes("[[["))) {
      raw = resolveStringTemplateSync(this.hass, raw, this._getTemplateContext());
    }

    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw.replace(/'/g, '"'));
      } catch (e) {
        raw = raw.split(",").map(s => s.trim()).filter(s => s !== "");
      }
    }
    return Array.isArray(raw) ? raw : [];
  }

  _getHiddenMenuOptions(idx = this._selectedIndex) {
    const obj = (this.entityObjs || [])[idx];
    let raw = obj?.hidden_menu_options ?? obj?.hide_menu_options ?? this.config?.hidden_menu_options ?? this.config?.hide_menu_options;

    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw.replace(/'/g, '"'));
      } catch (e) {
        raw = raw.split(",").map(s => s.trim()).filter(s => s !== "");
      }
    }
    return Array.isArray(raw) ? raw : [];
  }

  _isMenuOptionHidden(optionKey, idx = this._selectedIndex) {
    if (!optionKey) return false;
    const hidden = this._getHiddenMenuOptions(idx);
    if (!hidden || hidden.length === 0) return false;
    const normKey = String(optionKey).toLowerCase().replace(/[-\s]+/g, "_");
    const canonicalTarget = CANONICAL_MENU_OPTION_MAP[normKey] || normKey;
    return hidden.some((opt) => {
      if (typeof opt !== "string") return false;
      const normOpt = opt.toLowerCase().replace(/[-\s]+/g, "_");
      const canonicalOpt = CANONICAL_MENU_OPTION_MAP[normOpt] || normOpt;
      return canonicalTarget === canonicalOpt;
    });
  }

  _isMenuActionHidden(action, idx = this._selectedIndex) {
    if (!action) return false;
    const label = this._getActionLabel ? this._getActionLabel(action) : "";
    const candidates = [action.id, action.name, action.action, label].filter(Boolean);
    return candidates.some(cand => this._isMenuOptionHidden(cand, idx));
  }

  _renderRemoteControlSheet() {
    return renderRemoteControlSheet.call(this);
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
    if (this._cardType === "group_players") return;
    this._showGrouping = false;
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    // No requestUpdate here; overlay close will handle it.
  }
  async _toggleGroup(targetId) {
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;
    if (!masterObj) return;

    const masterGroupId = await this._resolveGroupingEntityId(masterObj, masterId);
    if (!masterGroupId) return;

    const targetObj = this._findEntityObjByAnyId(targetId) || this.entityObjs.find(e => e.entity_id === targetId);
    if (!targetObj) return;

    const targetGroupId = await this._resolveGroupingEntityId(targetObj, targetId);
    if (!targetGroupId) return;

    const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
    const members = Array.isArray(masterState?.attributes?.group_members)
      ? masterState.attributes.group_members
      : [];
    const grouped = members.includes(targetGroupId);

    // If unjoining the active master:
    if (targetId === masterId || targetGroupId === masterGroupId) {
      const remainingMembers = members.filter(m => m !== masterGroupId);
      const hasMaTransferService = Boolean(this.hass?.services?.music_assistant?.transfer_queue);

      const activeMaState = this._getMusicAssistantState?.();
      const sourceMaId =
        (activeMaState &&
          this._looksLikeMusicAssistantState?.(activeMaState) &&
          activeMaState.entity_id) ||
        this._getActualResolvedMaEntityForState?.(masterIdx) ||
        masterGroupId;
      const sourceState = this.hass?.states?.[sourceMaId] || masterState;
      const isSourceMa = this._queueController?.isTargetMusicAssistant
        ? this._queueController.isTargetMusicAssistant({
            maEntityId: sourceMaId,
            entityId: masterId,
            mainEntityId: masterId,
          })
        : Boolean(
            (sourceState && this._looksLikeMusicAssistantState?.(sourceState)) ||
            isMusicAssistantEntity(sourceState)
          );

      // Only unjoin master if multiple members are playing and transfer_queue is supported
      if (remainingMembers.length === 0 || !hasMaTransferService || !isSourceMa) {
        return;
      }

      // Elect successor from remaining members
      const successorGroupId = remainingMembers[0];
      const successorEntityId = this.entityIds.find(eId => {
        const gId = this._getGroupingEntityIdByEntityId(eId);
        return gId === successorGroupId;
      }) || successorGroupId;
      const successorIdx = this.entityIds.indexOf(successorEntityId);
      const successorMaId =
        (successorIdx >= 0 ? this._getActualResolvedMaEntityForState?.(successorIdx) : null) ||
        successorGroupId;
      const successorName = this.getChipName(successorEntityId);

      const otherMembers = remainingMembers.slice(1);
      const hasOtherMembers = otherMembers.length > 0;

      const targetPayload = {
        index: successorIdx,
        entityId: successorEntityId,
        maEntityId: successorMaId,
        name: successorName,
        pendingMessage: (
          localize("card.grouping.transferring_coordinator") ||
          "Transferring playback to {player}..."
        ).replace("{player}", successorName),
        deferSuccess: hasOtherMembers,
      };

      await this._transferQueueTo(targetPayload);

      // If transfer succeeded, keep other members grouped with the new master
      if (this._transferQueueStatus?.type !== "error") {
        if (hasOtherMembers) {
          this._transferQueueStatus = {
            type: "pending",
            message: (
              localize("card.grouping.regrouping") ||
              "Regrouping speakers with {player}..."
            ).replace("{player}", successorName),
          };
          if (this.triggerRender) {
            this.triggerRender();
          } else {
            this.requestUpdate?.();
          }
          try {
            await joinPlayers(this.hass, successorGroupId, otherMembers);
            this._transferQueueStatus = {
              type: "success",
              message: (
                localize("card.grouping.transfer_success") ||
                "Queue sent to {player}."
              ).replace("{player}", successorName),
            };
            this._queueController?.scheduleTransferQueueAutoClose?.(2000);
          } catch (err) {
            this._transferQueueStatus = {
              type: "error",
              message: err?.message || "Failed to regroup speakers.",
            };
            this._queueController?.scheduleTransferQueueAutoClose?.(4000);
          }
        }
        this._lastGroupingMasterId = successorEntityId;
        if (this.triggerRender) {
          this.triggerRender();
        } else {
          this.requestUpdate?.();
        }
      }
      return;
    }

    if (grouped) {
      await unjoinPlayer(this.hass, targetGroupId);
    } else {
      await joinPlayers(this.hass, masterGroupId, [targetGroupId]);
    }
    this._lastGroupingMasterId = masterId || targetId;
    if (this.triggerRender) {
      this.triggerRender();
    } else {
      this.requestUpdate?.();
    }
  }


  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor");
  }
  static getStubConfig(hass, entities) {
    return {
      entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2),
      disable_mass_queue: false,
    };
  }

  // Group all supported entities to current master
  async _groupAll() {
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;
    if (!masterObj) return;

    const masterGroupId = await this._resolveGroupingEntityId(masterObj, masterId);
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._isGroupCapable(masterState)) return;

    // Get all other entities that support grouping and are not already grouped with master
    const alreadyGrouped = Array.isArray(masterState.attributes?.group_members)
      ? masterState.attributes.group_members
      : [];

    // Build list of resolved MA entities to join
    const toJoin = [];
    for (const id of this.entityIds) {
      if (id === masterId) continue;

      const obj = this.entityObjs.find(e => e.entity_id === id);
      if (!obj) continue;

      const resolvedGroupId = await this._resolveGroupingEntityId(obj, id);
      if (!resolvedGroupId) continue;

      const st = this.hass.states[resolvedGroupId];
      if (this._isGroupCapable(st) && !alreadyGrouped.includes(resolvedGroupId)) {
        toJoin.push(resolvedGroupId);
      }
    }
    if (toJoin.length > 0) {
      await joinPlayers(this.hass, masterGroupId, toJoin);
    }
    // After grouping, keep the master set if still valid
    this._lastGroupingMasterId = masterId || this.currentEntityId;
    // Remain in grouping sheet
  }

  // Ungroup all members from specified master (or current master if not provided)
  async _ungroupAll(targetMasterId = null) {
    const masterId = targetMasterId || this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;

    const masterGroupId =
      (masterObj && (await this._resolveGroupingEntityId(masterObj, masterId))) ||
      this._getGroupingEntityIdByEntityId(masterId) ||
      masterId;
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._isGroupCapable(masterState)) return;

    const members = Array.isArray(masterState.attributes?.group_members)
      ? masterState.attributes.group_members
      : [];
    // Only unjoin follower members (exclude the coordinator itself to avoid invalid coordinator unjoin errors)
    const toUnjoin = members.filter(id => {
      if (id === masterGroupId) return false;
      const st = this.hass.states[id];
      return this._isGroupCapable(st);
    });
    // Unjoin each follower individually
    for (const id of toUnjoin) {
      await unjoinPlayer(this.hass, id);
    }
    // After ungrouping, keep the master set if still valid (may now be solo)
    if (!targetMasterId || targetMasterId === this.currentEntityId) {
      this._lastGroupingMasterId = masterId || this.currentEntityId;
    }
    if (this.triggerRender) {
      this.triggerRender();
    } else {
      this.requestUpdate?.();
    }
    // Remain in grouping sheet
  }

  // Synchronize all group member volumes to match the master
  _syncGroupVolume() {
    const masterId = this._getGroupingMasterId();
    if (!masterId) return;

    const masterIdx = this.entityIds.indexOf(masterId);
    if (masterIdx === -1) return;

    const masterGroupId = this._getGroupingEntityId(masterIdx);
    const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;

    if (!masterState || !this._isGroupCapable(masterState)) return;

    // Get master volume logic matching the renderer
    const masterVolEntity = this._getVolumeEntity(masterIdx) || masterGroupId;
    const masterVolState = this.hass.states[masterVolEntity];
    const masterVol = Number(masterVolState?.attributes?.volume_level);

    if (isNaN(masterVol)) return;

    const members = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];

    const groupingIdToIdx = new Map();
    this.entityObjs.forEach((obj, i) => {
      groupingIdToIdx.set(this._getGroupingEntityId(i), i);
    });

    for (const memberGroupId of members) {
      if (memberGroupId === masterGroupId) continue;

      const foundIdx = groupingIdToIdx.get(memberGroupId);

      if (foundIdx !== undefined) {
        const targetVolEntity = this._getVolumeEntity(foundIdx) || memberGroupId;
        setVolume(this.hass, targetVolEntity, masterVol);
      } else {
        // Fallback: if we can't find a configured entity, just try setting volume on the group member ID acting as an entity
        setVolume(this.hass, memberGroupId, masterVol);
      }
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
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  // Set the active entity override on demand for the current chip
  _setActiveEntityForCurrentChip(entityId) {
    const idx = this._selectedIndex;
    if (idx === undefined || idx < 0) return;

    if (!this._manualActiveEntityByChip) {
      this._manualActiveEntityByChip = {};
    }
    this._manualActiveEntityByChip[idx] = entityId;
    this._lastActiveEntityIdByChip[idx] = entityId;
    this._lastResolvedEntityIdByChip[idx] = entityId;

    // Reset playback linger for this chip
    if (this._playbackLingerByIdx?.[idx]) {
      delete this._playbackLingerByIdx[idx];
    }

    // Invalidate cached active playback entity
    this._cachedActivePlaybackEntityId = undefined;
    this._cachedActivePlaybackEntityKey = undefined;

    // Sync any sync_selected_entity actions with new active entity
    this._updateSelectedEntityHelper();

    this.requestUpdate();
  }

  // Read helper and select matching entity chip via select_entity actions
  _handleSelectEntityFromHelper() {
    if (!this.hass || !this.config?.actions) return;

    if (!this._lastSelectEntityValues) {
      this._lastSelectEntityValues = new Map();
    }

    const selectActions = this.config.actions.filter(
      a => a.action === "select_entity" && a.sync_entity_helper
    );

    if (selectActions.length === 0) return;

    for (const action of selectActions) {
      const helperId = action.sync_entity_helper;
      const syncType = action.sync_entity_type || "yamp_entity";
      const helperValue = this.hass.states[helperId]?.state;

      if (!helperValue || helperValue === "unknown" || helperValue === "unavailable") continue;

      // Dedup: skip if we already processed this exact value
      const cacheKey = `${helperId}-${syncType}`;
      if (this._lastSelectEntityValues.get(cacheKey) === helperValue) continue;
      this._lastSelectEntityValues.set(cacheKey, helperValue);

      // Find the matching entity index
      let matchIdx = -1;
      for (let i = 0; i < this.entityIds.length; i++) {
        let candidateId;
        if (syncType === "yamp_main_entity") {
          candidateId = this.entityIds[i];
        } else if (syncType === "yamp_playback_entity") {
          candidateId = this._getActivePlaybackEntityId(i);
        } else {
          // yamp_entity: MA entity if configured, otherwise main entity
          candidateId = this._getActualResolvedMaEntityForState(i) || this.entityIds[i];
        }
        if (candidateId === helperValue) {
          matchIdx = i;
          break;
        }
      }

      if (matchIdx >= 0 && matchIdx !== this._selectedIndex) {
        this._onChipClick(matchIdx);
      }
    }
  }

  // Sync selected entity to configured helpers via actions
  _updateSelectedEntityHelper() {
    if (!this.hass || !this.config?.actions) return;

    const idx = this._selectedIndex;
    if (idx === undefined || idx === null || !this.entityObjs[idx]) return;

    // Use a map to track last synced values per helper and sync type
    if (!this._lastSyncedActionValues) {
      this._lastSyncedActionValues = new Map();
    }

    // Find all sync_selected_entity actions
    const syncActions = this.config.actions.filter(
      a => a.action === "sync_selected_entity" && a.sync_entity_helper
    );

    if (syncActions.length === 0) return;

    for (const action of syncActions) {
      const helperId = action.sync_entity_helper;
      const syncType = action.sync_entity_type || "yamp_entity";

      let targetId;
      if (syncType === "yamp_main_entity") {
        targetId = this.entityIds[idx];
      } else if (syncType === "yamp_playback_entity") {
        targetId = this._getActivePlaybackEntityId(idx);
      } else {
        // yamp_entity (default): MA entity if configured, otherwise main entity
        targetId = this._getActualResolvedMaEntityForState(idx) || this.entityIds[idx];
      }

      if (!targetId) continue;

      // Check if we already synced this value for this helper/action combination
      const cacheKey = `${helperId}-${syncType}`;
      if (this._lastSyncedActionValues.get(cacheKey) === targetId) continue;

      // Check if the current state of the helper is already correct to avoid redundant calls
      const currentState = this.hass.states[helperId]?.state;
      if (currentState !== targetId) {
        this.hass.callService("input_text", "set_value", {
          entity_id: helperId,
          value: targetId
        });
      }
      this._lastSyncedActionValues.set(cacheKey, targetId);
    }
  }

}

customElements.define(
  "yet-another-media-player",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (YetAnotherMediaPlayerCard))
);
