import { LitElement, html, css, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";

import { renderChip, renderGroupChip, createHoldToPinHandler, renderChipRow } from "./chip-row.js";
import { renderActionChipRow } from "./action-chip-row.js";
import { renderControlsRow, countMainControls } from "./controls-row.js";
import { renderVolumeRow } from "./volume-row.js";
import { renderProgressBar } from "./progress-bar.js";
import { yampCardStyles, Z_LAYERS } from "./yamp-card-styles.js";
import { renderSearchSheet, renderSearchOptionsOverlay, searchMedia, playSearchedMedia, getFavorites, getRecentlyPlayed, isTrackFavorited, getMusicAssistantConfigEntryId, getMassQueueConfigEntryId } from "./search-sheet.js";
import { YetAnotherMediaPlayerEditor } from "./yamp-editor.js";
import {
  resolveTemplateAtActionTime,
  findAssociatedButtonEntities,
  getMusicAssistantState,
  getSearchResultClickTitle,
  isMusicAssistantEntity
} from "./yamp-utils.js";

import {
  SUPPORT_PAUSE,
  SUPPORT_SEEK,
  SUPPORT_VOLUME_SET,
  SUPPORT_VOLUME_MUTE,
  SUPPORT_PREVIOUS_TRACK,
  SUPPORT_NEXT_TRACK,
  SUPPORT_TURN_ON,
  SUPPORT_TURN_OFF,
  SUPPORT_PLAY_MEDIA,
  SUPPORT_STOP,
  SUPPORT_PLAY,
  SUPPORT_SHUFFLE,
  SUPPORT_GROUPING,
  SUPPORT_REPEAT_SET
} from "./constants.js";

const ADAPTIVE_TEXT_TARGETS = Object.freeze(["details", "menu", "action_chips"]);
const DEFAULT_ADAPTIVE_TEXT_TARGETS = Object.freeze([...ADAPTIVE_TEXT_TARGETS]);
const ADAPTIVE_TEXT_VAR_MAP = Object.freeze({
  details: "--yamp-text-scale-details",
  menu: "--yamp-text-scale-menu",
  action_chips: "--yamp-text-scale-action-chips"
});

const ARTWORK_OVERRIDE_MATCH_KEYS = Object.freeze([
  "media_title", "media_artist", "media_album_name",
  "media_content_id", "media_channel", "app_name",
  "media_content_type", "entity_id", "entity_state"
]);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "YAMP is a multi-entity media card with custom actions",
  preview: true
});

class YetAnotherMediaPlayerCard extends LitElement {

  _handleChipPointerDown(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerDown(e, idx);
    }
  }

  _applyIdleScreen() {
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

  _resetIdleScreen() {
    if (!this._idleScreenApplied) return;
    switch (this._idleScreen) {
      case "search":
      case "search-recently-played":
      case "search-next-up":
        this._hideSearchSheetInOptions();
        this._showEntityOptions = false;
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
  }
  _hoveredSourceLetterIndex = null;
  // Stores the last grouping master id for group chip selection
  _lastGroupingMasterId = null;
  _groupedSortedCache = null;
  _lastHassVersion = null;
  _debouncedVolumeTimer = null;
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }

  _isGroupCapable(stateObj) {
    if (!stateObj) return false;
    if (this._supportsFeature(stateObj, SUPPORT_GROUPING)) return true;
    return Array.isArray(stateObj.attributes?.group_members);
  }

  // Find button entities associated with a Music Assistant entity
  _findAssociatedButtonEntities(maEntityId) {
    return findAssociatedButtonEntities(this.hass, maEntityId);
  }

  // Get the favorite button entity for the current Music Assistant entity
  _getFavoriteButtonEntity() {
    const obj = this.entityObjs[this._selectedIndex];
    if (!obj) return null;

    // Get the active entity (the one currently selected or playing)
    const activeEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
    if (!activeEntityId) return null;

    // Check if the active entity is a Music Assistant entity
    const activeState = this.hass?.states?.[activeEntityId];
    if (!activeState || !isMusicAssistantEntity(activeState)) {
      return null;
    }

    // Active entity is Music Assistant, find its favorite button
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


      const isFavorited = await isTrackFavorited(this.hass, mediaContentId, entityId, trackName, artistName, 200);

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
    window.addEventListener("scroll", this._handleGlobalScroll, { passive: true });
    window.addEventListener("resize", this._handleViewportResize, { passive: true });
    this._updateViewportFlags();
    this._updateAdaptiveTextObserverState();
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
  get sortedEntityIds() {
    return [...this.entityIds].sort((a, b) => {
      const tA = this._playTimestamps[a] || 0;
      const tB = this._playTimestamps[b] || 0;
      return tB - tA;
    });
  }

  // Return array of groups, ordered by most recent play
  get groupedSortedEntityIds() {
    if (!this.entityIds || !Array.isArray(this.entityIds)) return [];

    // Check if we can use the cache
    if (this._groupedSortedCache && this.hass === this._lastHassVersion) {
      return this._groupedSortedCache;
    }

    const map = {};
    for (const id of this.entityIds) {
      let key = this._getGroupKey(id);
      // If the group master is not in our configured entities, do not group them visually.
      // treating them as separate chips avoids showing a false "master" (e.g. Kitchen leading Loft when Office is real master)
      if (!this.entityIds.includes(key)) {
        key = id;
      }

      if (!map[key]) map[key] = { ids: [], ts: 0 };
      map[key].ids.push(id);
      map[key].ts = Math.max(map[key].ts, this._playTimestamps[id] || 0);
    }
    const result = Object.values(map)
      .sort((a, b) => b.ts - a.ts)   // sort groups by recency
      .map(g => g.ids.sort());       // sort ids alphabetically inside each group

    this._groupedSortedCache = result;
    this._lastHassVersion = this.hass;
    return result;
  }
  static properties = {
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
    _successSearchRowMenuId: { state: true },
    _radioModeActive: { state: true },
    _showEntityOptions: { state: true },
    _showGrouping: { state: true },
    _showTransferQueue: { state: true },
    _showResolvedEntities: { state: true },
    _showSearchInSheet: { state: true }
  };

  static styles = yampCardStyles;

  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._lastActiveEntityId = null;
    this._playTimestamps = {};
    this._lastMediaTitle = null;
    this._showSourceMenu = false;
    this._shouldDropdownOpenUp = false;
    this._collapsedArtDominantColor = "#444";
    this._lastArtworkUrl = null;
    // Timer for progress updates
    this._progressTimer = null;
    this._progressValue = null;
    this._lastProgressEntityId = null;
    this._pinnedIndex = null;
    // Accent color, updated in setConfig
    this._customAccent = "#ff9800";
    // Outside click handler for source dropdown
    this._sourceDropdownOutsideHandler = null;
    this._isIdle = false;
    this._idleTimeout = null;
    // Overlay state for entity options
    this._showEntityOptions = false;
    // Overlay state for grouping sheet
    this._showGrouping = false;
    // Overlay state for source list sheet
    this._showSourceList = false;
    // Overlay state for transfer queue sheet
    this._showTransferQueue = false;
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    this._hasTransferQueueForCurrent = false;
    this._transferQueueAutoCloseTimer = null;
    // Alternate progress‑bar mode
    this._alternateProgressBar = false;
    // Group base volume for group gain logic
    this._groupBaseVolume = null;
    // Search sheet state variables
    this._searchOpen = false;
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
    this._searchTimeoutHandle = null;
    this._latestSearchToken = 0;
    this._searchTimeoutHandle = null;
    this._swapPauseForStop = false;
    this._controlLayout = "classic";
    // Search hierarchy tracking
    this._searchHierarchy = []; // Array of {type: 'artist'|'album', name: string, query: string}
    this._searchBreadcrumb = ""; // Display string for current search context
    // Per-chip linger map to keep MA entity selected briefly after pause
    this._playbackLingerByIdx = {};
    // Show search-in-sheet flag for entity options sheet
    this._showSearchInSheet = false;
    this._showResolvedEntities = false;
    // Queue success message
    this._showQueueSuccessMessage = false;
    this._searchActiveOptionsItem = null;
    this._activeSearchRowMenuId = null;
    this._successSearchRowMenuId = null;
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
    // Quick-dismiss mode for action-triggered menu items
    this._quickMenuInvoke = false;
    // Track collapsed layout height for idle mode
    this._collapsedBaselineHeight = 220;
    this._lastRenderedCollapsed = false;
    this._lastRenderedHideControls = false;
    this._artworkObjectFit = "cover";
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
    this._artworkOverrideTemplateCache = {};
    this._artworkOverrideIndexMap = null;
    this._hideActiveEntityLabel = false;
    this._currentDetailsScale = null;
    this._lastTitleLength = 0;
    this._suspendAdaptiveScaling = false;
    this._pendingAdaptiveScaleUpdate = false;
    this._adaptiveScrollTimer = null;
    this._handleGlobalScroll = this._handleGlobalScroll.bind(this);
    this._handleViewportResize = this._handleViewportResize.bind(this);
    this._isNarrowViewport = false;

    // Collapse on load if nothing is playing (but respect linger state and idle_timeout_ms)
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        // Don't go idle if there's an active linger or if idle_timeout_ms is 0
        const hasActiveLinger = this._playbackLingerByIdx?.[this._selectedIndex] &&
          this._playbackLingerByIdx[this._selectedIndex].until > Date.now();
        const isPlaying = this._isEntityPlaying(stateObj);
        if (stateObj && !isPlaying && !hasActiveLinger && this._idleTimeoutMs > 0) {
          this._isIdle = true;
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
    // Cache resolved MA entity per index to use during render without switching chips
    this._maResolveCache = {}; // { [idx:number]: { id: string, ts: number } }
    this._maResolveTtlMs = 7000; // refresh every ~7s
    // Manual select timeout for hold-to-pin functionality
    this._manualSelectTimeout = null;
    // Cache resolved Volume entity per index (template or static)
    this._volResolveCache = {}; // { [idx:number]: { id: string, ts: number } }
    this._volResolveTtlMs = 7000; // refresh every ~7s
    // Track the last entity that was playing for better pause/resume behavior
    this._lastPlayingEntityId = null;
    // Control focus lock to prefer most-recently controlled entity in brief paused window
    this._controlFocusEntityId = null;
    // Track the last active entity per chip index for intra-chip persistence
    this._lastActiveEntityIdByChip = {};
    // Cache for detecting entity state transitions (playing -> stopped)
    this._playerStateCache = {};
  }

  // Resolve and cache the MA entity for a given chip index (template or static)
  async _ensureResolvedMaForIndex(idx) {
    const obj = this.entityObjs?.[idx];
    if (!obj) return;
    const raw = obj.music_assistant_entity;
    if (!raw || typeof raw !== 'string') {
      // Clear cache if no MA or not a string
      delete this._maResolveCache[idx];
      return;
    }
    const looksTemplate = raw.includes('{{') || raw.includes('{%');
    const now = Date.now();
    const cached = this._maResolveCache[idx];
    if (!looksTemplate) {
      // Static MA — always cache for consistency
      this._maResolveCache[idx] = { id: raw, ts: now };
      return;
    }
    // For templates, respect TTL to avoid spamming /api/template
    if (cached && (now - cached.ts) < this._maResolveTtlMs && cached.id) return;
    try {
      const resolved = await this._resolveTemplateAtActionTime(raw, obj.entity_id);
      if (resolved && typeof resolved === 'string') {
        // Always cache the resolved entity for service calls
        // The rendering logic will handle validation separately
        this._maResolveCache[idx] = { id: resolved, ts: now };
        // Trigger re-render so artwork/state can use the resolved id
        this.requestUpdate();
      }
    } catch (_) {
      // Leave existing cache (if any); do not throw
    }
  }

  // Resolve and cache the Volume entity for a given chip index (template or static)
  async _ensureResolvedVolForIndex(idx) {
    const obj = this.entityObjs?.[idx];
    if (!obj) return;

    // If follow_active_volume is enabled, we don't need to cache a specific volume entity
    // as it will be determined dynamically based on the active entity
    if (obj.follow_active_volume) {
      delete this._volResolveCache[idx];
      return;
    }

    const raw = obj.volume_entity;
    if (!raw || typeof raw !== 'string') {
      // Clear cache if no volume entity or not a string
      delete this._volResolveCache[idx];
      return;
    }
    const looksTemplate = raw.includes('{{') || raw.includes('{%');
    const now = Date.now();
    const cached = this._volResolveCache[idx];
    if (!looksTemplate) {
      // Static volume entity — always cache for consistency
      this._volResolveCache[idx] = { id: raw, ts: now };
      return;
    }
    // For templates, respect TTL to avoid spamming /api/template
    if (cached && (now - cached.ts) < this._volResolveTtlMs && cached.id) return;
    try {
      const resolved = await this._resolveTemplateAtActionTime(raw, obj.entity_id);
      if (resolved && typeof resolved === 'string') {
        this._volResolveCache[idx] = { id: resolved, ts: now };
        this.requestUpdate();
      }
    } catch (_) {
      // Leave existing cache (if any); do not throw
    }
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
      const looksTemplate = raw.includes('{{') || raw.includes('{%');
      if (!looksTemplate) return raw;
    }
    return obj.entity_id;
  }

  // Get the actual resolved MA entity for state detection (can be unconfigured entities)
  _getActualResolvedMaEntityForState(idx) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;

    const cached = this._maResolveCache?.[idx]?.id;
    if (cached && typeof cached === 'string') {
      return cached;
    }

    // No cache - check if we have a static MA entity
    const rawMaEntity = obj.music_assistant_entity;
    if (rawMaEntity && typeof rawMaEntity === 'string' &&
      !rawMaEntity.includes('{{') && !rawMaEntity.includes('{%')) {
      return rawMaEntity;
    }

    // No MA entity or template - use main entity
    return obj.entity_id;
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

  /**
   * Open the search sheet pre‑filled with the current track's artist and
   * launch the search immediately (only when media_artist is present).
   */
  _searchArtistFromNowPlaying() {
    const artist = (this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj)?.attributes?.media_artist || "";
    if (!artist) return;                // nothing to search

    // Open overlay + search sheet
    this._showEntityOptions = true;
    this._showSearchInSheet = true;
    this._searchInputAutoFocused = false;

    // Prefill search state
    this._searchQuery = artist;
    this._searchError = "";
    this._searchAttempted = false;
    this._searchLoading = false;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = artist; // Set current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb

    // Clear filter states to ensure accurate artist search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._recommendationsFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Render, then run search
    this.requestUpdate();
    // Kick off search immediately so results populate without requiring user interaction.
    this._doSearch().catch((error) => {
      console.error('yamp: artist quick-search failed:', error);
    });
  }
  // Show search sheet inside entity options
  _showSearchSheetInOptions(mode = "default") {
    this._showSearchInSheet = true;
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
    this._favoritesFilterActive = false; // Track if favorites filter is active
    this._recentlyPlayedFilterActive = false; // Track if recently played filter is active
    this._upcomingFilterActive = false; // Track if upcoming queue filter is active
    this._recommendationsFilterActive = false; // Track if recommendations filter is active
    this._initialFavoritesLoaded = false; // Track if initial favorites have been loaded
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
          promise = this._doSearch();
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
    if (typeof path !== "string") return;
    const target = path.trim();
    if (!target) return;

    const navEvent = new CustomEvent("hass-navigate", {
      detail: { path: target },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(navEvent);

    if (navEvent.defaultPrevented) return;

    let handled = false;
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
    this._showSearchInSheet = false;
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
    this._recommendationsFilterActive = false;
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
  _searchOpenSheet() {
    this._searchOpen = true;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this.requestUpdate();
  }
  _searchCloseSheet() {
    this._searchOpen = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchDisplaySortOverride = null;
    this._searchLoading = false;
    this._searchInputAutoFocused = false;
    this._searchResultsByType = {}; // Clear cache when closing
    this._currentSearchQuery = ""; // Reset current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb
    this._recommendationsFilterActive = false;
    if (this._quickMenuInvoke) {
      this._showEntityOptions = false;
      this._showSearchInSheet = false;
      this._quickMenuInvoke = false;
    }
    this.requestUpdate();
  }

  _closeMenuIfOpen() {
    if (this._queueActionsMenuOpenId) {
      this._closeQueueActionsMenu();
    }
  }

  _sortSearchResults(results, sortModeOverride = null) {
    const sortMode = sortModeOverride ?? this.config?.search_results_sort ?? "default";
    const list = Array.isArray(results) ? [...results] : [];

    if (sortMode === "default") {
      return list;
    }

    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    const normalize = (val) => (typeof val === "string" ? val : (val ?? "").toString());
    const getTitle = (item) => normalize(item?.title ?? item?.name ?? "");
    const getArtist = (item) => normalize(item?.artist ?? item?.artist_name ?? "");

    const compareWithFallback = (primaryGetter, secondaryGetter, direction = 1) => (a, b) => {
      const primaryA = primaryGetter(a);
      const primaryB = primaryGetter(b);

      if (!primaryA && !primaryB) {
        const secondaryA = secondaryGetter(a);
        const secondaryB = secondaryGetter(b);
        return direction * collator.compare(secondaryA, secondaryB);
      }
      if (!primaryA) return 1;
      if (!primaryB) return -1;

      const primaryCompare = collator.compare(primaryA, primaryB);
      if (primaryCompare !== 0) {
        return direction * primaryCompare;
      }

      const secondaryA = secondaryGetter(a);
      const secondaryB = secondaryGetter(b);
      return direction * collator.compare(secondaryA, secondaryB);
    };

    switch (sortMode) {
      case "title_asc":
        return list.sort(compareWithFallback(getTitle, getArtist, 1));
      case "title_desc":
        return list.sort(compareWithFallback(getTitle, getArtist, -1));
      case "artist_asc":
        return list.sort(compareWithFallback(getArtist, getTitle, 1));
      case "artist_desc":
        return list.sort(compareWithFallback(getArtist, getTitle, -1));
      default:
        return list;
    }
  }

  _getConfiguredSearchResultsSortMode() {
    const configured = this.config?.search_results_sort;
    return typeof configured === "string" ? configured : "default";
  }

  _isSortableSearchMode(mode) {
    return typeof mode === "string" && /^(title|artist)_(asc|desc)$/.test(mode);
  }

  _getOppositeSearchSortMode(mode) {
    const match = /^(title|artist)_(asc|desc)$/.exec(mode || "");
    if (!match) {
      return null;
    }
    const [, field, direction] = match;
    const oppositeDirection = direction === "asc" ? "desc" : "asc";
    return `${field}_${oppositeDirection}`;
  }

  _shouldShowSearchSortToggle() {
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
    this.requestUpdate();
  }

  _getActiveSearchDisplaySortMode() {
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
    const [, direction] = mode.split("_");
    return direction === "asc" ? "mdi:sort-alphabetical-ascending" : "mdi:sort-alphabetical-descending";
  }

  _getSearchSortToggleTitle() {
    const mode = this._getActiveSearchDisplaySortMode();
    if (!this._isSortableSearchMode(mode)) {
      return "Toggle search result order";
    }
    const [field, direction] = mode.split("_");
    const labelField = field === "artist" ? "artist" : "title";
    const labelDirection = direction === "asc" ? "ascending" : "descending";
    return `Sort ${labelField} ${labelDirection}`;
  }

  _getDisplaySearchResults() {
    const baseResults = Array.isArray(this._searchResults) ? this._searchResults : [];
    if (!this._shouldShowSearchSortToggle()) {
      return baseResults;
    }
    const configured = this._getConfiguredSearchResultsSortMode();
    const activeMode = this._getActiveSearchDisplaySortMode();
    if (!this._isSortableSearchMode(activeMode) || activeMode === configured) {
      return baseResults;
    }
    return this._sortSearchResults(baseResults, activeMode);
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
    return Array.isArray(this._searchResults) ? this._searchResults.length : 0;
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
    const noun = count === 1 ? "result" : "results";
    return `${count} ${noun}`;
  }








  async _doSearch(mediaType = null, searchParams = {}) {
    this._searchAttempted = true;
    this._closeMenuIfOpen();
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
    const cacheKey = `${mediaType || 'all'}${isFavorites ? '_favorites' : ''}${isRecentlyPlayed ? '_recently_played' : ''}${isUpcoming ? '_upcoming' : ''}${isRecommendations ? '_recommendations' : ''}`;
    if (this._searchResultsByType[cacheKey]) {
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

    this._searchLoading = true;
    this._searchError = "";
    this._searchResults = [];
    this.requestUpdate();
    const searchToken = Date.now();
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

      // Check for recently played first (highest priority)
      if (isRecentlyPlayed) {
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
        searchResponse = await this._getUpcomingQueue(this.hass, searchEntityId, this._getSearchResultsLimit());
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
        searchResponse = await searchMedia(
          this.hass,
          searchEntityId,
          this._searchQuery,
          mediaType,
          { ...searchParams, favorites: true },
          this._getSearchResultsLimit()
        );
        this._lastSearchUsedServerFavorites = true;
      } else if ((!this._searchQuery || this._searchQuery.trim() === '') && !isFavorites && !isRecentlyPlayed && (mediaType === 'all' || !mediaType)) {
        searchResponse = await getFavorites(
          this.hass,
          searchEntityId,
          mediaType === 'favorites' ? null : mediaType,
          this._getSearchResultsLimit(),
          { onChunk: progressiveUpdate }
        );
        // Mark that initial favorites have been loaded only if we're in default view
        if (!this._searchQuery || this._searchQuery.trim() === '') {
          this._initialFavoritesLoaded = true;
        }
        this._lastSearchUsedServerFavorites = true;
      } else {
        // Perform search - reset initial favorites flag since this is a user search
        this._initialFavoritesLoaded = false;
        searchResponse = await searchMedia(this.hass, searchEntityId, this._searchQuery, mediaType, searchParams, this._getSearchResultsLimit());
        this._lastSearchUsedServerFavorites = false;
      }

      // Client-side filtering for lists that don't support server-side search (Recent, Upcoming, Recommendations)
      if ((isRecentlyPlayed || isUpcoming || isRecommendations) && this._searchQuery && this._searchQuery.trim() !== '') {
        const query = this._searchQuery.trim().toLowerCase();
        if (searchResponse && searchResponse.results) {
          searchResponse.results = searchResponse.results.filter(item => {
            const title = (item.title || "").toLowerCase();
            const artist = (item.artist || "").toLowerCase();
            const album = (item.album || "").toLowerCase();
            return title.includes(query) || artist.includes(query) || album.includes(query);
          });
        }
      }

      // Handle the new response format
      const arr = searchResponse.results || [];
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

      const normalizedResults = Array.isArray(arr) ? arr : [];
      this._searchResults = this._sortSearchResults(normalizedResults);

      // Apply local favorites filter ONLY when needed (e.g., switching filter chips with cached results)
      if (!isNewSearch && this._favoritesFilterActive && !this._lastSearchUsedServerFavorites) {
        await this._applyFavoritesFilterIfActive();
      }

      // Cache the results for this media type and search params
      this._searchResultsByType[cacheKey] = normalizedResults;

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
  }

  // Handle explicit search submission from UI (Enter key or Search Button)
  _handleSearchSubmit() {
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
    const classes = new Set();
    const cacheValues = Object.values(this._searchResultsByType || {});
    cacheValues.forEach(results => {
      const items = Array.isArray(results)
        ? results
        : Array.isArray(results?.results)
          ? results.results
          : [];
      items.forEach(item => {
        const mediaClass = item?.media_class;
        if (mediaClass) {
          classes.add(mediaClass);
        }
      });
    });

    const currEntityObj = this.entityObjs?.[this._selectedIndex] || null;
    const hiddenSet = new Set(currEntityObj?.hidden_filter_chips || []);
    return Array.from(classes).filter(c => !hiddenSet.has(c));
  }

  async _playMediaFromSearch(item) {
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    this._searchError = "";
    const playbackStarted = await this._performSearchPlayback(item, targetEntityId);

    if (!playbackStarted) {
      this._searchError = "Unable to start playback. Please try again.";
      this.requestUpdate();
      return;
    }

    // Default to true if config option is missing (backward compatibility)
    const shouldDismiss = this.config.dismiss_search_on_play !== false;

    if (shouldDismiss) {
      if (this._showSearchInSheet) {
        this._closeEntityOptions();
        this._showSearchInSheet = false;
      }
      this._searchCloseSheet();
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
          this._invalidateUpcomingCache();
          return true;
        }
      } catch (error) {
        console.error('yamp: Error playing queue item:', error);
        // Fallback to next track if service call fails
        await this.hass.callService("media_player", "media_next_track", {
          entity_id: targetEntityId
        });
        return true;
      }
    }

    if (!targetEntityId) {
      return false;
    }

    // For regular search results or fallback mode, use the normal play method with a retry guard.
    const monitorIds = this._collectPlaybackMonitorIds(targetEntityId);
    const firstSnapshot = this._snapshotPlaybackState(monitorIds);
    const firstAttempt = await this._invokePlayMedia(targetEntityId, item);
    if (!firstAttempt) {
      return false;
    }
    const firstChangeDetected = await this._waitForPlaybackChange(firstSnapshot, monitorIds);
    if (firstChangeDetected) {
      return true;
    }

    // Retry once if we didn't observe playback starting yet.
    const retrySnapshot = this._snapshotPlaybackState(monitorIds);
    const retryAttempt = await this._invokePlayMedia(targetEntityId, item);
    if (!retryAttempt) {
      return false;
    }
    return await this._waitForPlaybackChange(retrySnapshot, monitorIds);
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

  async _waitForPlaybackChange(snapshot, entityIds, timeout = 2500) {
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
        if (this._isEntityPlaying(stateObj)) {
          return true;
        }
        const previous = snapshot[id] || {};
        const currentMediaId = stateObj.attributes?.media_content_id ?? null;
        const currentTitle = stateObj.attributes?.media_title ?? null;
        if (currentMediaId && currentMediaId !== previous.mediaId) {
          return true;
        }
        if (currentTitle && currentTitle !== previous.mediaTitle) {
          return true;
        }
        if (!previous.mediaId && currentMediaId) {
          return true;
        }
        if (!previous.mediaTitle && currentTitle) {
          return true;
        }
      }
    }
    return false;
  }

  async _performSearchOptionAction(item, mode) {
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
        const shouldDismiss = this.config.dismiss_search_on_play !== false;
        if (shouldDismiss) {
          this._closeEntityOptions();
        }
        this._activeSearchRowMenuId = null;
      } else {
        // For other modes, show the localized success message overlay within the slide-out
        this._successSearchRowMenuId = item.media_content_id;
        this.requestUpdate();
        setTimeout(() => {
          this._successSearchRowMenuId = null;
          this._activeSearchRowMenuId = null; // Also dismiss the slide-out after message fades
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
      if (this._radioModeActive) {
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
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    // Use enqueue: next to add to queue
    if (this._radioModeActive) {
      this.hass.callService("music_assistant", "play_media", {
        entity_id: targetEntityId,
        media_id: item.media_content_id,
        media_type: item.media_content_type,
        enqueue: "add",
        radio_mode: true
      });
    } else {
      this.hass.callService("media_player", "play_media", {
        entity_id: targetEntityId,
        media_content_type: item.media_content_type,
        media_content_id: item.media_content_id,
        enqueue: "next"
      });
    }

    // Invalidate the "Next Up" cache
    this._invalidateUpcomingCache();

    // Show success message
    this._showQueueSuccessMessage = true;
    this.requestUpdate();

    // Show message for 3 seconds but keep search sheet open
    setTimeout(() => {
      this._showQueueSuccessMessage = false;
      this.requestUpdate();
    }, 3000);
  }

  // Handle hierarchical search - search for albums by artist
  async _searchArtistAlbums(artistName) {
    this._searchHierarchy.push({ type: 'artist', name: artistName, query: this._searchQuery });
    this._searchBreadcrumb = `Albums by ${artistName}`;
    this._searchQuery = artistName;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = artistName;
    this._searchMediaClassFilter = 'album';

    // Clear filter states to ensure accurate artist search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Remove swipe handlers when entering hierarchy
    this._removeSearchSwipeHandlers();

    // Use Music Assistant search with artist name for albums (explicitly clear filters)
    await this._doSearch('album', { clearFilters: true });
  }


  // Go back in search hierarchy
  _goBackInSearch() {
    if (this._searchHierarchy.length === 0) return;

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this.requestUpdate();

    const previousLevel = this._searchHierarchy.pop();
    this._searchQuery = previousLevel.query;
    this._currentSearchQuery = previousLevel.query;
    this._searchResultsByType = {}; // Clear cache for new search

    if (this._searchHierarchy.length === 0) {
      this._searchBreadcrumb = "";
      this._searchMediaClassFilter = 'all';
      this._doSearch();
    } else {
      const currentLevel = this._searchHierarchy[this._searchHierarchy.length - 1];
      if (currentLevel.type === 'artist') {
        this._searchBreadcrumb = `Albums by ${currentLevel.name}`;
        this._searchMediaClassFilter = 'album';
        this._doSearch('album', { artist: currentLevel.name });
      } else if (currentLevel.type === 'album') {
        this._searchBreadcrumb = `Tracks from ${currentLevel.name}`;
        this._searchMediaClassFilter = 'track';
        if (currentLevel.uri && this._isMusicAssistantEntity()) {
          this._searchQuery = currentLevel.name;
          this._searchAlbumTracks(currentLevel.name, null, currentLevel.uri);
          return;
        }
        // Fallback search
        const artistLevel = this._searchHierarchy.find(level => level.type === 'artist');
        const searchParams = { album: currentLevel.name };
        if (artistLevel) {
          searchParams.artist = artistLevel.name;
        }
        this._doSearch('track', searchParams);
      } else if (currentLevel.type === 'playlist') {
        this._searchBreadcrumb = `Tracks in ${currentLevel.name}`;
        this._searchMediaClassFilter = 'track';
        if (currentLevel.uri && this._isMusicAssistantEntity()) {
          this._searchQuery = currentLevel.name;
          this._showPlaylistTracks({ title: currentLevel.name, media_content_id: currentLevel.uri });
          return;
        }
        this._doSearch('track');
      }
    }
  }

  // Check if a search result is clickable for hierarchical navigation
  _isClickableSearchResult(item) {
    if (!item) return false;
    return !!item.is_browsable;
  }

  // Handle touch events to prevent accidental clicks during scrolling
  _handleSearchResultTouch(item, event) {
    // Only handle touch events on mobile
    if (!('ontouchstart' in window)) {
      return;
    }

    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    let hasMoved = false;
    const moveThreshold = 10; // pixels

    const handleTouchMove = (moveEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = Math.abs(moveTouch.clientX - startX);
      const deltaY = Math.abs(moveTouch.clientY - startY);

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        hasMoved = true;
      }
    };

    const handleTouchEnd = (endEvent) => {
      // Remove event listeners
      document.removeEventListener('touchmove', handleTouchMove, { passive: true });
      document.removeEventListener('touchend', handleTouchEnd, { passive: true });

      // Only trigger click if finger didn't move significantly (not scrolling)
      if (!hasMoved) {
        this._handleSearchResultClick(item);
      }
    };

    // Add event listeners
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  }



  // Get the tooltip title for clickable search results
  _getSearchResultClickTitle(item) {
    if (!this._isClickableSearchResult(item)) return "";

    return getSearchResultClickTitle(item);
  }

  // Force-invalidate the "Next Up" results cache
  _invalidateUpcomingCache() {
    const classFilter = this._searchMediaClassFilter || 'all';
    const cacheKey = `${classFilter}_upcoming`;
    if (this._searchResultsByType) {
      delete this._searchResultsByType[cacheKey];
      this.requestUpdate();
    }
  }

  _toggleRadioMode() {
    this._radioModeActive = !this._radioModeActive;
    this.requestUpdate();
  }

  // Toggle favorites filter - use existing _doSearch method with favorites parameter
  async _toggleFavoritesFilter() {
    this._favoritesFilterActive = !this._favoritesFilterActive;

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
    const isStateChanging = targetState !== this._recentlyPlayedFilterActive;
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
      // Load recently played items - always use "all" for recently played
      try {
        await this._doSearch('all', { isRecentlyPlayed: true, clearFilters: true });
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
        const cacheKey = `${this._searchMediaClassFilter || 'all'}`;
        if (this._searchResultsByType[cacheKey]) {
          this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
          this.requestUpdate();
        } else {
          // No cache, load favorites as default
          await this._doSearch('favorites');
        }
      }
    }
  }

  // Toggle upcoming queue filter
  async _toggleUpcomingFilter(forceState = null) {
    const targetState = typeof forceState === "boolean"
      ? forceState
      : !this._upcomingFilterActive;
    const isStateChanging = targetState !== this._upcomingFilterActive;
    this._upcomingFilterActive = targetState;

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
      const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
      delete this._searchResultsByType[cacheKey];
      // Subscribe to queue update events
      await this._subscribeToQueueUpdates();
      // Load upcoming queue items - always use "all" for upcoming
      try {
        await this._doSearch('all', { isUpcoming: true, clearFilters: true });
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
        const cacheKey = `${this._searchMediaClassFilter || 'all'}`;
        if (this._searchResultsByType[cacheKey]) {
          this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
          this.requestUpdate();
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
    const isStateChanging = targetState !== this._recommendationsFilterActive;
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

        await this._doSearch('all', { isRecommendations: true, clearFilters: true });
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
        const cacheKey = `${this._searchMediaClassFilter || 'all'}`;
        if (this._searchResultsByType[cacheKey]) {
          this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
          this.requestUpdate();
        } else {
          await this._doSearch('favorites');
        }
      }
    }
  }

  // Get next track from Music Assistant (limited by Music Assistant API)
  async _getUpcomingQueue(hass, entityId, limit = 20) {
    try {
      // Always check for mass_queue integration (don't cache this)
      const hasMassQueue = await this._isMassQueueIntegrationAvailable(hass);

      // Cache the result for UI rendering
      this._massQueueAvailable = hasMassQueue;
      this._hasMassQueueIntegration = hasMassQueue;

      if (hasMassQueue) {
        try {
          const massQueueResult = await this._getUpcomingQueueWithMassQueue(hass, entityId, limit);

          // If mass_queue returns 0 results, fall back to original method
          if (!massQueueResult.results || massQueueResult.results.length === 0) {
            this._massQueueAvailable = false; // Hide queue management buttons
            return await this._getUpcomingQueueOriginal(hass, entityId, limit);
          }

          return massQueueResult;
        } catch (error) {
          this._massQueueAvailable = false; // Hide queue management buttons
          return await this._getUpcomingQueueOriginal(hass, entityId, limit);
        }
      }

      // Fallback to the original method
      return await this._getUpcomingQueueOriginal(hass, entityId, limit);
    } catch (error) {
      console.error('yamp: Error getting upcoming queue:', error);
      this._massQueueAvailable = false;
      return { results: [], usedMusicAssistant: false };
    }
  }

  // Get recommendations using mass_queue integration
  async _getRecommendations(hass, entityId, mediaType = null, limit = 20) {
    try {
      const hasMassQueue = await this._isMassQueueIntegrationAvailable(hass);
      this._hasMassQueueIntegration = hasMassQueue;
      this._massQueueAvailable = hasMassQueue;

      if (!hasMassQueue) {
        throw new Error('mass_queue integration unavailable');
      }

      const limitToUse = Math.max(limit || 0, this._getSearchResultsLimit());
      const message = {
        type: "call_service",
        domain: "mass_queue",
        service: "get_recommendations",
        service_data: {
          entity: entityId
        },
        return_response: true,
      };

      const response = await hass.connection.sendMessagePromise(message);
      const payload = response?.response;

      let groups = [];
      if (Array.isArray(payload)) {
        groups = payload;
      } else if (payload && typeof payload === "object") {
        if (Array.isArray(payload[entityId])) {
          groups = payload[entityId];
        } else {
          const values = Object.values(payload);
          values.forEach(val => {
            if (Array.isArray(val)) {
              groups.push(...val);
            } else if (val && typeof val === "object") {
              groups.push(val);
            }
          });
        }
        if (groups.length === 0 && Array.isArray(payload.items)) {
          groups = payload.items;
        }
      }

      const normalizeMediaClass = (value) => {
        if (!value || typeof value !== "string") return "track";
        const type = value.toLowerCase();
        switch (type) {
          case "song":
          case "music":
            return "track";
          case "podcast_episode":
          case "episode":
            return "podcast";
          case "station":
            return "radio";
          case "directory":
          case "folder":
            return "playlist";
          default:
            return type;
        }
      };
      const formatLabel = (value) => {
        if (!value) return "";
        return value
          .toString()
          .replace(/[_-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/\b\w/g, ch => ch.toUpperCase());
      };

      const requestedClass = mediaType && mediaType !== "all"
        ? normalizeMediaClass(mediaType)
        : null;

      const results = [];
      let collected = 0;
      const maxItems = limitToUse > 0 ? limitToUse : Infinity;
      for (const group of groups) {
        if (collected >= maxItems) break;
        const groupName = group?.name || group?.sort_name || "";
        const groupImage = typeof group?.image === "string" && group.image.trim() !== "" ? group.image : null;
        const groupItems = (Array.isArray(group?.items) && group.items.length > 0)
          ? group.items
          : [group];

        for (const item of groupItems) {
          if (collected >= maxItems) break;
          const mediaContentId = item?.uri || item?.item_id;
          if (!mediaContentId) continue;

          const itemImage = typeof item?.image === "string" && item.image.trim() !== "" ? item.image : null;
          const rawType = item?.media_type || group?.media_type || "music";
          const normalizedClass = normalizeMediaClass(rawType);
          if (requestedClass && normalizedClass !== requestedClass) {
            continue;
          }
          const typeLabel = formatLabel(rawType) || formatLabel(normalizedClass);
          const providerLabel = formatLabel(item?.provider || group?.provider);
          const subtitleParts = typeLabel ? [typeLabel] : [];
          if (groupName) {
            subtitleParts.push(groupName);
          } else if (providerLabel) {
            subtitleParts.push(providerLabel);
          }

          results.push({
            media_content_id: mediaContentId,
            media_content_type: rawType || normalizedClass,
            media_class: normalizedClass,
            title: item?.name || item?.sort_name || groupName || "Recommendation",
            artist: subtitleParts.join(" • "),
            thumbnail: itemImage || groupImage || null,
            provider: item?.provider || group?.provider || null
          });
          collected += 1;
        }
      }

      return {
        results,
        usedMusicAssistant: true,
        source: 'mass_queue'
      };
    } catch (error) {
      console.error('yamp: Error getting recommendations from mass_queue:', error);
      throw error;
    }
  }

  // Check if mass_queue integration is available and enabled
  async _isMassQueueIntegrationAvailable(hass) {
    if (this.config.disable_mass_queue === true) {
      return false;
    }
    try {
      // First check if the mass_queue domain is available in services
      const services = await hass.callWS({
        type: "get_services"
      });

      let hasServices = false;
      // Handle different response formats
      if (Array.isArray(services)) {
        hasServices = services.some(service => service.domain === "mass_queue");
      } else if (services && typeof services === 'object') {
        // Check if mass_queue exists as a key in the services object
        hasServices = services.hasOwnProperty("mass_queue") || Object.keys(services).some(key => key === "mass_queue");
      }

      if (!hasServices) {
        return false;
      }

      // If services are available, assume integration is working
      // The companion card works, so this should be sufficient
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get queue using mass_queue integration
  async _getUpcomingQueueWithMassQueue(hass, entityId, limit = 20) {
    try {
      // Get the currently playing track's media_content_id
      const playerState = hass.states[entityId];
      const currentTrackId = playerState?.attributes?.media_content_id;

      // Use limit_before and limit_after like the companion card does
      // limit_before: 5 means get 5 items before the current track (to include current track)
      // limit_after: limit means get up to 'limit' upcoming items
      const message = {
        type: "call_service",
        domain: "mass_queue",
        service: "get_queue_items",
        service_data: {
          entity: entityId,
          limit_before: 5  // Get items before current track to include current track
        },
        return_response: true,
      };
      const configLimit = this._getSearchResultsLimit();
      const normalizedLimit = Number.isFinite(limit) ? limit : configLimit;
      const limitAfter = Math.max(normalizedLimit || 0, configLimit || 0);
      if (limitAfter > 0) {
        message.service_data.limit_after = limitAfter;  // Use config search_results_limit
      }

      const response = await hass.connection.sendMessagePromise(message);
      const queueItems = response?.response?.[entityId];

      if (!Array.isArray(queueItems)) {
        throw new Error('Invalid response from mass_queue');
      }

      // Find the currently playing track's index in the queue
      const currentTrackIndex = queueItems.findIndex(item => item.media_content_id === currentTrackId);

      // Get upcoming items (items after the current track)
      const upcomingItems = currentTrackIndex >= 0 ? queueItems.slice(currentTrackIndex + 1) : queueItems;

      // Process the upcoming items like the companion card does
      const itemsToRender = normalizedLimit > 0
        ? upcomingItems.slice(0, normalizedLimit)
        : upcomingItems;
      const results = itemsToRender.map((item, index) => ({
        media_content_id: item.media_content_id || `queue_${index}`,
        media_content_type: 'track',
        media_class: 'track',
        title: item.media_title || 'Unknown Track',
        artist: item.media_artist || 'Unknown Artist',
        album: item.media_album_name || 'Unknown Album',
        thumbnail: item.media_image || null,
        duration: null,
        position: index + 1,
        queue_item_id: item.queue_item_id || null
      }));


      return {
        results,
        usedMusicAssistant: true,
        total: results.length,
        source: 'mass_queue'
      };
    } catch (error) {
      console.error('yamp: mass_queue service call failed:', error);
      throw error;
    }
  }

  // Queue reordering methods
  async _moveQueueItemUp(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState?.entity_id;

      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately (like companion card does)
      this._moveQueueItemInUI(queueItemId, 'up');

      // Then call the service
      await this.hass.callService("mass_queue", "move_queue_item_up", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }

  async _moveQueueItemDown(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState?.entity_id;

      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately
      this._moveQueueItemInUI(queueItemId, 'down');

      // Then call the service
      await this.hass.callService("mass_queue", "move_queue_item_down", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }

  async _moveQueueItemNext(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState?.entity_id;

      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately
      this._moveQueueItemInUI(queueItemId, 'next');

      // Then call the service
      await this.hass.callService("mass_queue", "move_queue_item_next", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }

  async _removeQueueItem(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState?.entity_id;

      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately
      this._removeQueueItemFromUI(queueItemId);

      // Then call the service
      await this.hass.callService("mass_queue", "remove_queue_item", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }

  // Show queue error message
  _showQueueError(message) {
    // For now, just log the error. In the future, we could show a toast notification
    console.error('yamp: Queue operation failed:', message);
    // You could implement a toast notification here if desired
  }

  // Update queue items in UI immediately (like companion card does)
  _moveQueueItemInUI(queueItemId, direction) {
    const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
    const currentResults = this._searchResultsByType[cacheKey];

    if (!currentResults || !Array.isArray(currentResults.results)) {
      return;
    }

    const itemIndex = currentResults.results.findIndex(item => item.queue_item_id === queueItemId);
    if (itemIndex === -1) return;

    let newIndex;
    switch (direction) {
      case 'up':
        newIndex = Math.max(0, itemIndex - 1);
        break;
      case 'down':
        newIndex = Math.min(currentResults.results.length - 1, itemIndex + 1);
        break;
      case 'next':
        newIndex = 0; // Move to next position (first in upcoming queue)
        break;
      default:
        return;
    }

    // Get the item being moved
    const item = currentResults.results[itemIndex];

    // Move item in array (like companion card's moveQueueItem)
    const movedItem = currentResults.results.splice(itemIndex, 1)[0];
    currentResults.results.splice(newIndex, 0, movedItem);

    // Update position numbers for visual feedback
    currentResults.results.forEach((item, index) => {
      item.position = index + 1;
    });

    // Add visual feedback - temporarily highlight the moved item
    movedItem._justMoved = true;
    setTimeout(() => {
      delete movedItem._justMoved;
      this.requestUpdate();
    }, 1000);

    // Trigger UI update
    this.requestUpdate();

  }

  // Remove queue item from UI immediately
  _removeQueueItemFromUI(queueItemId) {
    const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
    const currentResults = this._searchResultsByType[cacheKey];

    if (!currentResults || !Array.isArray(currentResults.results)) {
      return;
    }

    // Remove item from array
    currentResults.results = currentResults.results.filter(item => item.queue_item_id !== queueItemId);

    // Trigger UI update
    this.requestUpdate();
  }

  // Check if current entity is a Music Assistant entity
  _isMusicAssistantEntity() {
    // Get the Music Assistant state for the current chip
    const maState = this._getMusicAssistantState();
    if (!maState) return false;

    // Check if the Music Assistant entity has the right attributes
    const hasMassAttributes = isMusicAssistantEntity(maState) ||
      maState.attributes?.mass_player_id ||
      maState.attributes?.active_queue ||
      // If we're in upcoming mode and getting queue items, assume it's MA
      (this._upcomingFilterActive && this._searchResultsByType[`${this._searchMediaClassFilter || 'all'}_upcoming`]?.results?.some(item => item.queue_item_id));

    return hasMassAttributes;
  }

  _looksLikeMusicAssistantState(state) {
    if (!state) return false;
    return isMusicAssistantEntity(state) ||
      !!state.attributes?.mass_player_id ||
      !!state.attributes?.active_queue;
  }

  _getTransferQueueTargets() {
    if (!this.hass?.services?.music_assistant?.transfer_queue) return [];
    const currentIdx = this._selectedIndex;
    if (currentIdx === null || currentIdx === undefined || currentIdx < 0) return [];

    const sourceMaId = this._getActualResolvedMaEntityForState(currentIdx);
    if (!sourceMaId) return [];

    const seen = new Set([sourceMaId]);
    const targets = [];

    for (let idx = 0; idx < this.entityObjs.length; idx++) {
      const obj = this.entityObjs[idx];
      if (!obj) continue;

      const maEntityId = this._getActualResolvedMaEntityForState(idx);
      if (!maEntityId || seen.has(maEntityId)) continue;

      const maState = this.hass?.states?.[maEntityId];
      const mainState = this.hass?.states?.[obj.entity_id];
      if (!this._looksLikeMusicAssistantState(maState) && !this._looksLikeMusicAssistantState(mainState)) {
        continue;
      }

      seen.add(maEntityId);

      const displayState = maState || mainState;
      const configuredName = obj?.name;
      const displayName = configuredName ||
        mainState?.attributes?.friendly_name ||
        maState?.attributes?.friendly_name ||
        obj.entity_id;

      targets.push({
        index: idx,
        entityId: obj.entity_id,
        maEntityId,
        name: displayName,
        subtitle: maEntityId !== obj.entity_id ? maEntityId : obj.entity_id,
        state: displayState?.state,
        icon: displayState?.attributes?.icon || "mdi:music",
      });
    }

    return targets;
  }

  _hasQueueInState(maState) {
    if (!maState) return false;
    const attrs = maState.attributes || {};

    const arrayKeys = ["queue_items", "queue", "media_queue", "mass_queue_items"];
    for (const key of arrayKeys) {
      const value = attrs[key];
      if (Array.isArray(value) && value.length > 0) return true;
    }

    const numericKeys = ["queue_length", "queue_size", "queue_total_items", "queue_pending", "queue_remaining", "items_in_queue"];
    for (const key of numericKeys) {
      const value = attrs[key];
      if (typeof value === "number" && value > 0) return true;
    }

    if (attrs.next_item || attrs.current_queue_item || attrs.queue_item_id) {
      return true;
    }

    if (attrs.media_content_id) {
      return true;
    }

    // Fall back to cached upcoming results if we've loaded them
    const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
    const cached = this._searchResultsByType?.[cacheKey];
    if (cached && Array.isArray(cached.results) && cached.results.length > 0) {
      return true;
    }

    return false;
  }

  async _updateTransferQueueAvailability({ refresh = false } = {}) {
    const maState = this._getMusicAssistantState();
    const looksLikeMa = this._looksLikeMusicAssistantState(maState);

    if (!maState || !looksLikeMa) {
      if (this._hasTransferQueueForCurrent) {
        this._hasTransferQueueForCurrent = false;
        this.requestUpdate();
      }
      return false;
    }

    let hasQueue = this._hasQueueInState(maState);

    if (!hasQueue && refresh && this.hass) {
      const entityId = this._getActualResolvedMaEntityForState(this._selectedIndex);
      if (entityId) {
        try {
          const queueInfo = await this._getUpcomingQueue(this.hass, entityId, 2);
          if (Array.isArray(queueInfo?.results) && queueInfo.results.length > 0) {
            hasQueue = true;
          } else if (this._isEntityPlaying(maState) || maState.state === "paused" || maState.attributes?.media_content_id) {
            hasQueue = true;
          }
        } catch (error) {
          // Ignore errors; fall back to heuristic result
        }
      }
    }

    if (this._hasTransferQueueForCurrent !== hasQueue) {
      this._hasTransferQueueForCurrent = hasQueue;
      this.requestUpdate();
    }

    return hasQueue;
  }

  _canShowTransferQueueOption() {
    if (!this._hasTransferQueueForCurrent) return false;
    return this._getTransferQueueTargets().length > 0;
  }

  _openTransferQueue() {
    this._showEntityOptions = true;
    this._showTransferQueue = true;
    this._showGrouping = false;
    this._showSourceList = false;
    this._showSearchInSheet = false;
    this._showResolvedEntities = false;
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }
    this.requestUpdate();
  }

  _closeTransferQueue() {
    this._showTransferQueue = false;
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }
    this.requestUpdate();
  }

  async _transferQueueTo(target) {
    if (!target) return;

    const sourceMaId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    if (!sourceMaId) return;

    this._transferQueuePendingTarget = target.maEntityId;
    this._transferQueueStatus = null;
    this.requestUpdate();

    try {
      const payload = this._buildTransferQueuePayload(sourceMaId, target.maEntityId);
      await this.hass.callService("music_assistant", "transfer_queue", payload);
      this._transferQueueStatus = {
        type: "success",
        message: `Queue sent to ${target.name}.`
      };
      const targetIdx = typeof target.index === "number" ? target.index : this.entityIds.indexOf(target.entityId);
      if (targetIdx !== undefined && targetIdx !== null && targetIdx >= 0) {
        const pinnedIdx = this._pinnedIndex;
        if (pinnedIdx === null || pinnedIdx === targetIdx) {
          this._selectedIndex = targetIdx;
          this._manualSelect = true;
          this._manualSelectPlayingSet = null;
          if (pinnedIdx === targetIdx) {
            this._pinnedIndex = targetIdx;
          }
          const lingerEntity = target.maEntityId || this.entityObjs[targetIdx]?.entity_id;
          if (lingerEntity) {
            if (!this._playbackLingerByIdx) this._playbackLingerByIdx = {};
            this._playbackLingerByIdx[targetIdx] = {
              entityId: lingerEntity,
              until: Date.now() + 5000
            };
            if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
            this._lastPlayingEntityIdByChip[targetIdx] = lingerEntity;
          }
          this._ensureResolvedMaForIndex(targetIdx);
          this._ensureResolvedVolForIndex(targetIdx);
        }
      }
      await this._updateTransferQueueAvailability({ refresh: true });
      if (this._transferQueueAutoCloseTimer) {
        clearTimeout(this._transferQueueAutoCloseTimer);
      }
      this._transferQueueAutoCloseTimer = setTimeout(() => {
        this._transferQueueAutoCloseTimer = null;
        if (this._showEntityOptions && this._showTransferQueue) {
          this._dismissWithAnimation();
        }
      }, 2000);
    } catch (error) {
      console.error("yamp: Error transferring queue:", error);
      this._transferQueueStatus = {
        type: "error",
        message: error?.message || "Failed to transfer queue."
      };
      if (this._transferQueueAutoCloseTimer) {
        clearTimeout(this._transferQueueAutoCloseTimer);
        this._transferQueueAutoCloseTimer = null;
      }
    } finally {
      this._transferQueuePendingTarget = null;
      this.requestUpdate();
    }
  }

  _buildTransferQueuePayload(sourceId, targetId) {
    const serviceMeta = this.hass?.services?.music_assistant?.transfer_queue;
    const fields = serviceMeta?.fields || {};
    const payload = {};
    const assignField = (candidateKeys, value) => {
      for (const key of candidateKeys) {
        if (fields[key] !== undefined) {
          payload[key] = value;
          return true;
        }
      }
      return false;
    };

    // Prefer explicit source fields, fall back to legacy names if metadata missing
    const sourceAssigned = assignField(
      ["source_player", "source_player_id", "player_id", "source"],
      sourceId
    );

    const targetAssigned = assignField(
      ["target_player", "target_player_id", "target", "entity_id"],
      targetId
    );

    if (!sourceAssigned) {
      // Avoid clobbering target assignment when metadata is missing
      const fallbackKey = targetAssigned ? "source_player" : "entity_id";
      payload[fallbackKey] = sourceId;
    }

    if (!targetAssigned) {
      // If entity_id already used for source, use a more specific key
      if (payload.entity_id === sourceId) {
        payload.entity_id = targetId;
        payload.source_player = sourceId;
      } else if (payload.source_player === sourceId) {
        payload.entity_id = targetId;
      } else {
        payload.entity_id = targetId;
      }
    }

    return payload;
  }

  // Refresh the queue display
  _refreshQueue() {
    if (this._upcomingFilterActive) {
      // Clear cache to force fresh fetch
      const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
      delete this._searchResultsByType[cacheKey];
      // Reload upcoming queue items
      this._doSearch('all', { isUpcoming: true }).catch(error => {
        console.error('yamp: Error refreshing queue:', error);
      });
    }
  }

  // Subscribe to queue update events (like companion card)
  async _subscribeToQueueUpdates() {
    if (this._queueEventSubscription) return; // Already subscribed

    try {
      this._queueEventSubscription = await this.hass.connection.subscribeEvents((event) => {
        const eventData = event.data;
        if (eventData.type === "queue_updated") {
          // Refresh queue when it's updated
          this._refreshQueue();
        }
      }, "mass_queue");
    } catch (error) {
      console.error('yamp: Failed to subscribe to queue updates:', error);
    }
  }

  // Unsubscribe from queue update events
  _unsubscribeFromQueueUpdates() {
    if (this._queueEventSubscription) {
      this._queueEventSubscription();
      this._queueEventSubscription = null;
    }
  }

  // Original method for getting queue (fallback)
  async _getUpcomingQueueOriginal(hass, entityId, limit = 20) {
    try {
      // Get the queue metadata first to get the queue_id
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_queue",
        service_data: {
          entity_id: entityId
        },
        return_response: true,
      };

      const response = await hass.connection.sendMessagePromise(message);

      const queueData = response?.response?.[entityId];

      if (!queueData) {
        return { results: [], usedMusicAssistant: true };
      }

      // Build results array from the queue data structure
      const results = [];

      if (!queueData) {
        return { results: [], usedMusicAssistant: true };
      }

      // Fallback to just the next item
      if (queueData.next_item) {
        const item = queueData.next_item;
        results.push({
          media_content_id: item.media_item?.uri || `queue_next`,
          media_content_type: item.media_item?.media_type || 'track',
          media_class: 'track',
          title: item.name || item.media_item?.name || 'Unknown Track',
          artist: item.media_item?.artists?.[0]?.name || 'Unknown Artist',
          album: item.media_item?.album?.name || 'Unknown Album',
          thumbnail: item.media_item?.image || null,
          duration: item.duration || null,
          position: 1, // Next item
          queue_item_id: item.queue_item_id || null
        });
      }

      return {
        results,
        usedMusicAssistant: true,
        total: results.length,
        source: 'music_assistant'
      };
    } catch (error) {
      console.error('yamp: Error in original queue method:', error);
      throw error;
    }
  }

  // Apply favorites filter to current results (called when switching filter chips)
  async _applyFavoritesFilterIfActive() {
    if (!this._favoritesFilterActive) return;

    const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);

    try {
      const favoritesResponse = await getFavorites(this.hass, searchEntityId, this._searchMediaClassFilter, this._getSearchResultsLimit());
      const favorites = favoritesResponse.results || [];

      // Create a set of favorite URIs for quick lookup
      const favoriteUris = new Set(favorites.map(fav => fav.media_content_id));

      // Filter current results to only show favorites
      const currentResults = this._searchResults || [];
      this._searchResults = this._sortSearchResults(currentResults.filter(item => favoriteUris.has(item.media_content_id)));
    } catch (error) {
      // If favorites loading fails, just show current results
    }
  }

  // Handle clicks on search result titles
  async _handleSearchResultClick(item, event) {
    if (!this._isClickableSearchResult(item)) return;

    // If this is a touch device and we have a touch event, ignore the click
    // (touch events are handled by _handleSearchResultTouch)
    if ('ontouchstart' in window && event && event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) {
      return;
    }

    if (item.media_class === 'artist') {
      await this._searchArtistAlbums(item.title);
    } else if (item.media_class === 'album') {
      // Get artist name from hierarchy if we're viewing artist albums, or from item metadata if available
      let artistName = null;
      if (this._searchHierarchy.length > 0 && this._searchHierarchy[this._searchHierarchy.length - 1].type === 'artist') {
        artistName = this._searchHierarchy[this._searchHierarchy.length - 1].name;
      } else if (item.artist) {
        artistName = item.artist;
      }
      await this._searchAlbumTracks(item.title, artistName, item.media_content_id);
    }
  }

  // Handle hierarchical search - search for tracks by album
  async _searchAlbumTracks(albumName, artistName, albumUri = null) {
    this._searchHierarchy.push({ type: 'album', name: albumName, query: this._searchQuery, uri: albumUri });
    this._searchBreadcrumb = `Tracks from ${albumName}`;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = albumName;
    this._searchMediaClassFilter = 'track';

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this.requestUpdate();

    // Priority 1: Use mass_queue integration if available (preferred for Music Assistant)
    try {
      const hasMassQueue = await this._isMassQueueIntegrationAvailable(this.hass);
      if (hasMassQueue) {
        const configEntryId = await getMassQueueConfigEntryId(this.hass);
        let tracks = [];

        // Strategy A: User provided syntax (config_entry_id)
        if (configEntryId && albumUri) {
          try {
            console.log("yamp: Attempting mass_queue.get_album_tracks with config_entry_id", { configEntryId, uri: albumUri });
            const message = {
              type: "call_service",
              domain: "mass_queue",
              service: "get_album_tracks",
              service_data: {
                config_entry_id: configEntryId,
                uri: albumUri
              },
              return_response: true,
            };
            const responseData = await this.hass.connection.sendMessagePromise(message);
            if (responseData?.response?.tracks) {
              tracks = responseData.response.tracks;
            }
          } catch (firstError) {
            console.warn("yamp: mass_queue.get_album_tracks failed with config_entry_id, trying fallback with entity_id", firstError);

            // Strategy B: Fallback using entity (like get_queue_items)
            const maState = this._getMusicAssistantState();
            const maEntityId = maState?.entity_id;

            if (maEntityId) {
              const messageFallback = {
                type: "call_service",
                domain: "mass_queue",
                service: "get_album_tracks",
                service_data: {
                  entity: maEntityId,
                  uri: albumUri
                },
                return_response: true,
              };
              const responseDataFallback = await this.hass.connection.sendMessagePromise(messageFallback);
              if (responseDataFallback?.response?.tracks) {
                tracks = responseDataFallback.response.tracks;
              }
            } else {
              throw firstError;
            }
          }
        }

        if (tracks.length > 0) {
          this._searchResults = tracks.map(track => ({
            media_content_id: track.media_content_id,
            media_content_type: 'track',
            media_class: 'track',
            title: track.media_title,
            artist: track.media_artist,
            album: track.media_album_name,
            thumbnail: track.media_image,
            duration: track.duration,
            is_browsable: false,
            favorite: track.favorite
          }));

          this._searchQuery = albumName;
          this._searchTotalRows = Math.max(15, tracks.length);
          this._searchLoading = false;
          this.requestUpdate();
          return;
        }
      }
    } catch (e) {
      console.error("yamp: Error fetching album tracks via mass_queue:", e);
      // Fallback to other methods
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
          this._searchQuery = albumName;
          this._searchResults = this._sortSearchResults(tracks);
          this._searchTotalRows = Math.max(15, tracks.length);
          this._searchLoading = false;
          this.requestUpdate();
          return;
        }
      } catch (e) {
        console.error("yamp: Failed to browse album tracks:", e);
      }
    }

    // Fallback to search-based navigation
    let searchQuery = albumName;
    if (artistName) {
      searchQuery = `${artistName} ${albumName}`;
    }
    this._searchQuery = searchQuery;

    // Clear filter states to ensure accurate album search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Pass artist and album as search parameters for more precise results
    const searchParams = { album: albumName, clearFilters: true };
    if (artistName) {
      searchParams.artist = artistName;
    }

    // Remove swipe handlers when entering hierarchy
    this._removeSearchSwipeHandlers();

    // Use Music Assistant search with specific parameters for tracks
    await this._doSearch('track', searchParams);
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
    this._textResizeObserver.observe(this);
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
    const detailMaxLines = detailActive ? (safeDetailsScale >= 2 ? 3 : safeDetailsScale >= 1.3 ? 2 : 1) : 3;
    this.style.setProperty("--yamp-details-max-lines", detailMaxLines.toString());
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
    if (isNarrow !== this._isNarrowViewport) {
      this._isNarrowViewport = isNarrow;
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
    const height = baselineHeight || rect?.height || width;
    const widthFactor = width / 360;
    const heightFactor = height / 360;
    const blended = (widthFactor * 0.8) + (heightFactor * 0.2);
    const scale = Math.max(0.85, Math.min(1.4, blended));
    const detailScale = this._calculateDetailsScale(width, height, scale, this._lastTitleLength || 0);
    const textScaleChanged = this._currentTextScale === null || Math.abs(this._currentTextScale - scale) > 0.01;
    const detailScaleChanged = this._currentDetailsScale === null || Math.abs(this._currentDetailsScale - detailScale) > 0.02;
    if (textScaleChanged || detailScaleChanged) {
      this._currentTextScale = scale;
      this._currentDetailsScale = detailScale;
      this._setAdaptiveTextVars(scale, undefined, detailScale);
    }
  }

  _calculateDetailsScale(width, height, fallbackScale = 1) {
    const targetSet = this._adaptiveTextTargets;
    if (!targetSet?.has("details")) return 1;
    const widthFactor = Math.min(Math.max(1, width / 360), 3.2);
    const heightFactor = Math.max(1, Math.min(height / 330, 2.4));
    const dominant = Math.max(widthFactor * 0.7 + heightFactor * 0.3, heightFactor);
    const maxScale = Math.min(3.25, 1 + (heightFactor - 1) * 1.35);
    const requested = Math.max(fallbackScale, dominant * 1.18);
    const baseScale = Math.max(1, Math.min(requested, maxScale));
    const titleLength = this._lastTitleLength || 0;
    const lengthClamp = titleLength > 0
      ? Math.max(0.62, Math.min(1, 30 / Math.min(titleLength, 72)))
      : 1;
    return 1 + (baseScale - 1) * lengthClamp;
  }

  _calculateDetailsLineHeight(scale) {
    const clampedScale = Math.max(1, Math.min(scale, 2.6));
    const extra = Math.max(0, clampedScale - 1);
    // Allow line-height to rise gently from 1.2 to 1.55
    return Math.min(1.55, 1.2 + (extra * 0.35));
  }

  _getAdaptiveBaselineHeight(collapsed = false) {
    const raw = this.config?.card_height;
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
      const result = await this.hass.callApi('POST', 'template', { template: this._idleImageTemplate });
      this._idleImageTemplateResult = (result ?? "").toString().trim();
    } catch (error) {
      this._idleImageTemplateResult = "";
    } finally {
      this._resolvingIdleImageTemplate = false;
      this._idleImageTemplateNeedsResolve = false;
      this.requestUpdate();
    }
  }

  _ensureArtworkOverrideIndexMap() {
    if (this._artworkOverrideIndexMap) return;
    this._artworkOverrideIndexMap = new WeakMap();
    const overrides = Array.isArray(this.config?.media_artwork_overrides)
      ? this.config.media_artwork_overrides
      : [];
    overrides.forEach((item, idx) => {
      if (item && typeof item === "object") {
        this._artworkOverrideIndexMap.set(item, idx);
      }
    });
  }

  _getArtworkOverrideCacheKey(override, type = "image", stateObj = null) {
    this._ensureArtworkOverrideIndexMap();

    // Include media title and artist in the key if available to ensure
    // templates are re-evaluated when the track changes.
    const mediaTitle = stateObj?.attributes?.media_title || "";
    const mediaArtist = stateObj?.attributes?.media_artist || "";
    const stateKey = `${mediaTitle}:${mediaArtist}`;

    const idx = override && this._artworkOverrideIndexMap?.get(override);
    const prefix = typeof idx === "number" ? idx : "generic";

    return `${prefix}:${type}:${stateKey}`;
  }

  _getResolvedArtworkOverrideSource(override, sourceValue, type = "image", stateObj = null) {
    if (!sourceValue || typeof sourceValue !== "string") return null;
    const normalizedInput = this._normalizeImageSourceValue(sourceValue);
    if (!normalizedInput) return null;
    const isTemplate = sourceValue.includes("{{") || sourceValue.includes("{%");
    if (!isTemplate) return normalizedInput;

    if (!this._artworkOverrideTemplateCache) {
      this._artworkOverrideTemplateCache = {};
    }
    const key = this._getArtworkOverrideCacheKey(override, type, stateObj);
    if (!this._artworkOverrideTemplateCache[key]) {
      this._artworkOverrideTemplateCache[key] = { value: null, resolving: false };
    }
    const entry = this._artworkOverrideTemplateCache[key];
    if (entry.value) return entry.value;
    if (!entry.resolving && this.hass) {
      entry.resolving = true;
      this.hass.callApi('POST', 'template', { template: sourceValue })
        .then((res) => {
          entry.value = this._normalizeImageSourceValue((res ?? "").toString());
        })
        .catch(() => {
          entry.value = "";
        })
        .finally(() => {
          entry.resolving = false;
          this.requestUpdate();
        });
    }
    return entry.value;
  }

  // Get style for collapsed artwork based on mobile and control count
  _getCollapsedArtworkStyle() {
    if (this._alwaysCollapsed) {
      const showFavorite = !!this._getFavoriteButtonEntity() && !this._getHiddenControlsForCurrentEntity().favorite;
      const controls = countMainControls(
        this.currentActivePlaybackStateObj,
        (s, f) => this._supportsFeature(s, f),
        showFavorite,
        this._getHiddenControlsForCurrentEntity(),
        true,
        this._controlLayout
      );
      if (controls > 6) {
        // Check if we're on a mobile screen (width <= 768px is typical mobile breakpoint)
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          // Make artwork smaller on mobile when there are many controls
          return "width: 60px; height: 60px; object-fit: var(--yamp-artwork-fit, cover); border-radius: 8px;";
        }
      }
    }
    return ""; // Default style (no additional styling)
  }

  // Get artwork URL from entity state, supporting entity_picture_local for Music Assistant
  _getArtworkUrl(state) {
    if (!state || !state.attributes) return null;

    const attrs = state.attributes;
    const entityId = state.entity_id;
    const appId = attrs.app_id;
    const prefix = this.config?.artwork_hostname || '';

    let artworkUrl = null;
    let sizePercentage = null;
    let objectFit = null;

    // Check for media artwork overrides first
    const overrides = Array.isArray(this.config?.media_artwork_overrides)
      ? this.config.media_artwork_overrides
      : null;
    if (overrides && overrides.length) {
      const findSpecificMatch = () =>
        overrides.find((override) =>
          ARTWORK_OVERRIDE_MATCH_KEYS.some((key) => {
            const expected = override[key];
            if (expected === undefined) return false;
            const value = key === "entity_id"
              ? entityId
              : key === "entity_state"
                ? state?.state
                : attrs[key];
            if (expected === "*") return true;
            if (override.__cachedRegexes?.[key]) {
              return override.__cachedRegexes[key].test(String(value || ""));
            }
            return value === expected;
          })
        );

      const hasExistingArtwork = attrs.entity_picture_local || attrs.entity_picture || attrs.album_art;
      let override = findSpecificMatch();
      let overrideSource = null;
      let overrideType = "image";

      if (override?.image_url) {
        overrideSource = override.image_url;
      } else if (override?.missing_art_url && !hasExistingArtwork) {
        overrideSource = override.missing_art_url;
        overrideType = "missing";
      }

      if (!override && !hasExistingArtwork) {
        const missingOverride = overrides.find((item) => item?.missing_art_url);
        if (missingOverride?.missing_art_url) {
          override = missingOverride;
          overrideSource = missingOverride.missing_art_url;
          overrideType = "missing";
        }
      }

      if (override && overrideSource) {
        const resolvedOverride = this._getResolvedArtworkOverrideSource(override, overrideSource, overrideType, state);
        if (resolvedOverride) {
          artworkUrl = resolvedOverride;
          sizePercentage = override?.size_percentage;
          objectFit = override?.object_fit ?? null;
        }
      }
    }

    // If no override found, use standard artwork
    if (!artworkUrl) {
      // Always check entity_picture_local first, then entity_picture
      artworkUrl = attrs.entity_picture_local || attrs.entity_picture || attrs.album_art || null;
    }

    // If still no artwork, check for configured fallback artwork
    if (!artworkUrl) {
      const fallbackArtwork = this.config?.fallback_artwork;
      if (fallbackArtwork) {
        // Check if it's a smart fallback (TV vs Music)
        if (fallbackArtwork === 'smart') {
          // Use TV icon for TV content, music icon for everything else
          const isTV = attrs.media_title === 'TV' || attrs.media_channel ||
            attrs.app_id === 'tv' || attrs.app_id === 'androidtv';
          if (isTV) {
            // TV icon
            artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvcj4KPHJlY3QgeD0iNjgiIHk9IjEyMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHJlY3QgeD0iODAiIHk9IjEzMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==';
          } else {
            // Music icon (equalizer bars)
            artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=';
          }
        } else if (typeof fallbackArtwork === 'string') {
          // Direct URL or base64 image
          artworkUrl = fallbackArtwork;
        }

        if (artworkUrl) {
          objectFit = this._artworkObjectFit;
        }
      }
    }

    // Apply hostname prefix if configured and artwork URL is relative
    if (artworkUrl && prefix && !artworkUrl.startsWith('http') && !artworkUrl.startsWith('data:')) {
      // Ensure prefix doesn't result in double slashes if artworkUrl starts with /
      const cleanPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
      const cleanUrl = artworkUrl.startsWith('/') ? artworkUrl : `/${artworkUrl}`;
      artworkUrl = cleanPrefix + cleanUrl;
    }

    // Validate artwork URL to prevent proxy errors
    if (artworkUrl && !this._isValidArtworkUrl(artworkUrl)) {
      artworkUrl = null;
    }

    if (!objectFit) {
      objectFit = this._artworkObjectFit;
    }

    return { url: artworkUrl, sizePercentage, objectFit };
  }

  _getBackgroundSizeForFit(fit) {
    switch (fit) {
      case "contain":
        return "contain";
      case "fill":
        return "100% 100%";
      case "scale-down":
        return "contain";
      case "none":
        return "auto";
      case "cover":
      default:
        return "cover";
    }
  }

  // Validate artwork URL to prevent proxy errors
  _isValidArtworkUrl(url) {
    if (!url || typeof url !== 'string') return false;

    // Skip validation for data URLs and base64 images
    if (url.startsWith('data:')) return true;

    // Skip validation for localhost and relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return true;

    // Check for obviously invalid URLs
    if (url.includes('undefined') || url.includes('null') || url.trim() === '') return false;

    // Check for valid URL format
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Extract dominant color from image
  async _extractDominantColor(imgUrl) {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        resolve(`rgb(${r},${g},${b})`);
      };
      img.onerror = function () { resolve("#888"); };
    });
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
    if (!value || typeof value !== "string") return "";
    let trimmed = value.trim();
    if (!trimmed) return "";
    const quoted = (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'));
    if (quoted && trimmed.length >= 2) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    const urlMatch = trimmed.match(/^url\((.*)\)$/i);
    if (urlMatch && urlMatch[1] !== undefined) {
      let inner = urlMatch[1].trim();
      if ((inner.startsWith("'") && inner.endsWith("'")) || (inner.startsWith('"') && inner.endsWith('"'))) {
        inner = inner.slice(1, -1).trim();
      }
      return inner;
    }
    return trimmed;
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = { ...config };
    const layoutPref = typeof config.control_layout === "string" ? config.control_layout.toLowerCase() : "classic";
    this._controlLayout = layoutPref === "modern" ? "modern" : "classic";
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
    // Set accent color

    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    const allowedFits = new Set(["cover", "contain", "fill", "scale-down", "none"]);
    this._artworkObjectFit = allowedFits.has(config.artwork_object_fit)
      ? config.artwork_object_fit
      : "cover";
    this._extendArtwork = config.extend_artwork === true;
    this._idleScreen = config.idle_screen || "default";
    this._idleScreenApplied = false;
    this._hasSeenPlayback = false;
    if (this._isIdle) {
      this._applyIdleScreen();
    }

    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      this.shadowRoot.host.setAttribute("data-always-collapsed", String(this.config.always_collapsed === true));
      const forceHideMenuPlayer = this.config.always_collapsed === true && this.config.pin_search_headers === true && this.config.expand_on_search === true;
      this.shadowRoot.host.setAttribute("data-hide-menu-player", String(this.config.hide_menu_player === true || forceHideMenuPlayer));
      this.shadowRoot.host.setAttribute("data-extend-artwork", String(this._extendArtwork));
    }
    // Collapse card when idle
    this._collapseOnIdle = !!config.collapse_on_idle;
    // Force always-collapsed view
    this._alwaysCollapsed = !!config.always_collapsed;
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
    if (this._adaptiveText) {
      const initialScale = this._currentTextScale ?? 1;
      const initialDetailsScale = this._currentDetailsScale ?? 1;
      this._setAdaptiveTextVars(initialScale, undefined, initialDetailsScale);
      this._updateAdaptiveTextScale();
    } else {
      this._setAdaptiveTextVars(1, new Set(), 1);
    }
    this._hideActiveEntityLabel = config.hide_active_entity_label === true;
    this._artworkOverrideTemplateCache = {};
    this._artworkOverrideIndexMap = null;

    // Pre-compile wildcard regexes for artwork overrides
    if (Array.isArray(config.media_artwork_overrides)) {
      // Create a copy of the overrides array and objects to avoid "not extensible" errors
      // with Home Assistant's frozen config objects.
      this.config.media_artwork_overrides = config.media_artwork_overrides.map(o => ({ ...o }));

      this.config.media_artwork_overrides.forEach(override => {
        if (!override || typeof override !== "object") return;
        override.__cachedRegexes = {};
        ARTWORK_OVERRIDE_MATCH_KEYS.forEach(key => {
          const pattern = override[key];
          if (typeof pattern === "string" && pattern.includes("*") && pattern !== "*") {
            try {
              const regexPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*");
              override.__cachedRegexes[key] = new RegExp(`^${regexPattern}$`, "i");
            } catch (e) {
              console.warn("yamp: Failed to compile artwork override regex for", key, pattern);
            }
          }
        });
      });
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
    // Set idle timeout ms
    this._idleTimeoutMs = typeof config.idle_timeout_ms === "number" ? config.idle_timeout_ms : 60000;
    if (this._idleTimeoutMs === 0) {
      if (this._idleTimeout) {
        clearTimeout(this._idleTimeout);
        this._idleTimeout = null;
      }
      if (this._isIdle) {
        this._isIdle = false;
        this._resetIdleScreen();
        this.requestUpdate();
      }
    }
    this._volumeStep = typeof config.volume_step === "number" ? config.volume_step : 0.05;
  }

  // Returns array of entity config objects, including group_volume if present in user config.
  get entityObjs() {
    return this.config.entities.map(e => {
      const entity_id = typeof e === "string" ? e : e.entity_id;
      const name = typeof e === "string" ? "" : (e.name || "");
      const volume_entity = typeof e === "string" ? undefined : e.volume_entity;
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
          // Use raw config.entities to avoid circular dependency in this.entityIds
          const configEntityIds = this.config.entities.map(en =>
            typeof en === "string" ? en : en.entity_id
          );
          const visibleMembers = otherMembers.filter(id => configEntityIds.includes(id));
          group_volume = visibleMembers.length > 0;
        }
      }

      return {
        entity_id,
        name,
        volume_entity,
        music_assistant_entity,
        sync_power,
        follow_active_volume,
        hidden_controls,
        hidden_filter_chips: typeof e === "string" ? undefined : e.hidden_filter_chips,
        ...(typeof group_volume !== "undefined" ? { group_volume } : {})
      };
    });
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
        return this._resolveEntity(obj.volume_entity, obj.entity_id, idx) || obj.entity_id;

      case 'volume_display':
        // For volume display: show active entity if follow_active_volume enabled, otherwise show control entity
        if (obj.follow_active_volume) {
          return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
        }
        return this._resolveEntity(obj.volume_entity, obj.entity_id, idx) || obj.entity_id;

      case 'grouping_control':
        // For grouping menu: use MA entity (main entity if it's MA, or configured MA entity)
        // Check if main entity is a Music Assistant entity by checking if it supports grouping
        const mainState = this.hass.states[obj.entity_id];
        const mainIsMA = this._isGroupCapable(mainState);

        if (mainIsMA) {
          return obj.entity_id;
        }
        return this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx) || obj.entity_id;

      case 'playback_control':
        // For playback controls: use the entity that is actually playing
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;

      case 'sorting':
        // For chip sorting: use active playback entity (MA entity if playing, otherwise main entity)
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;

      default:
        return obj.entity_id;
    }
  }

  // Helper to resolve template entities
  _resolveEntity(entityTemplate, fallbackEntityId, idx) {
    if (!entityTemplate) return null;

    if (typeof entityTemplate === 'string' && (entityTemplate.includes('{{') || entityTemplate.includes('{%'))) {
      // For templates, use cached resolved entity
      const cached = this._maResolveCache?.[idx]?.id;
      return cached || fallbackEntityId;
    }

    return entityTemplate;
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
    // Check for linger first - if we recently paused MA, stay on MA unless main entity is playing
    const linger = this._playbackLingerByIdx?.[idx];
    const now = Date.now();
    if (linger && linger.until > now) {
      // If main entity is playing AND was recently controlled, prioritize it over linger
      if (this._isEntityPlaying(mainState) && this._lastPlayingEntityIdByChip?.[idx] === mainId) {
        return mainId;
      }
      // Return the entity that the linger is actually for
      return linger.entityId;
    }
    // Clear expired linger
    if (linger && linger.until <= now) {
      delete this._playbackLingerByIdx[idx];
    }

    // Prioritize the entity that is actually playing
    // When both are playing, prefer MA entity for better control
    if (this._isEntityPlaying(maState)) return maId;
    if (this._isEntityPlaying(mainState)) return mainId;



    // When neither is playing, check if one was recently controlled for this specific chip
    const lastPlayingForChip = this._lastPlayingEntityIdByChip?.[idx];
    if (lastPlayingForChip === maId) return maId;
    if (lastPlayingForChip === mainId) return mainId;

    // Default to Music Assistant entity if configured, otherwise main entity
    if (maId && maId !== mainId) {
      return maId;
    } else {
      return mainId;
    }
  }

  // Legacy methods for backward compatibility
  _getVolumeEntity(idx) {
    return this._getEntityForPurpose(idx, 'volume_control');
  }

  _getVolumeEntityForGrouping(idx) {
    return this._getEntityForPurpose(idx, 'grouping_control');
  }

  // Prefer Music Assistant entity for search/grouping if configured
  _getSearchEntityId(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj?.entity_id;

    // Check if it's a template
    if (typeof obj.music_assistant_entity === 'string' &&
      (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
      // For templates, resolve at action time - return template string for now
      return obj.music_assistant_entity;
    }

    return obj.music_assistant_entity;
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

    // Prioritize the Music Assistant entity when it's playing
    if (this._isEntityPlaying(maState)) {
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

    if (!currentEntityObj?.hidden_controls) {
      return {};
    }

    // Convert array format to object format for compatibility
    const hiddenControls = {};
    if (Array.isArray(currentEntityObj.hidden_controls)) {
      currentEntityObj.hidden_controls.forEach(control => {
        hiddenControls[control] = true;
      });
    } else if (typeof currentEntityObj.hidden_controls === 'object') {
      // Handle object format as well
      Object.assign(hiddenControls, currentEntityObj.hidden_controls);
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
    if (obj.music_assistant_entity) {
      if (typeof obj.music_assistant_entity === 'string' &&
        (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
        const cached = this._maResolveCache?.[idx]?.id;
        return cached || obj.entity_id;
      }
      return obj.music_assistant_entity;
    }
    return obj.entity_id;
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

    const membersRaw = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members
      : [];

    // If no group members or just itself, it's not grouped
    if (membersRaw.length <= 1) return id;

    // First member is the master
    const masterGroupingId = membersRaw[0];

    // Find configured entity corresponding to this master grouping ID
    const masterEntityId = this.entityIds.find(eId => {
      const gId = this._getGroupingEntityIdByEntityId(eId);
      return gId === masterGroupingId;
    });

    // If master is not in our config, return the raw grouping ID so we know it's external/different
    return masterEntityId || masterGroupingId;
  }

  get entityIds() {
    return this.entityObjs.map(e => e.entity_id);
  }

  // Return display name for a chip/entity
  getChipName(entity_id) {
    const obj = this.entityObjs.find(e => e.entity_id === entity_id);
    if (obj && obj.name) return obj.name;
    const state = this.hass.states[entity_id];
    return state?.attributes.friendly_name || entity_id;
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

  _resolveGroupingEntityId(obj, fallbackEntityId) {
    if (!obj?.music_assistant_entity) return fallbackEntityId;
    if (typeof obj.music_assistant_entity === 'string' &&
      (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
      const idx = this.entityIds.indexOf(fallbackEntityId);
      const cached = this._maResolveCache?.[idx]?.id;
      return cached || fallbackEntityId;
    }
    return obj.music_assistant_entity;
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
    const cacheKey = `${this._selectedIndex}-${this.hass?.states?.[this.currentEntityId]?.state}-${this.hass?.states?.[this._getSearchEntityId(this._selectedIndex)]?.state}`;

    if (this._cachedActivePlaybackEntityId === undefined || this._cachedActivePlaybackEntityKey !== cacheKey) {
      this._cachedActivePlaybackEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
      this._cachedActivePlaybackEntityKey = cacheKey;
    }
    return this._cachedActivePlaybackEntityId;
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
      this._searchOpen ||
      this._showSourceMenu ||
      !!this._searchActiveOptionsItem ||
      !!this._activeSearchRowMenuId ||
      !!this._queueActionsMenuOpenId
    );
  }

  _renderMainMenu(sourceList, menuOnlyActions, showChipsInMenu) {
    return html`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${() => this._closeEntityOptions()}>
          Close
        </button>
        <div class="entity-options-divider"></div>
      </div>
      <div class="entity-options-menu ${showChipsInMenu ? 'chips-in-menu' : ''} entity-options-scroll" style="display:flex; flex-direction:column;">
        <button class="entity-options-item" @click=${() => {
        const resolvedEntities = this._getResolvedEntitiesForCurrentChip();
        if (resolvedEntities.length === 1) {
          this._openMoreInfoForEntity(resolvedEntities[0]);
          this._showEntityOptions = false;
        } else {
          this._showResolvedEntities = true;
        }
        this.requestUpdate();
      }}>More Info</button>
        <button class="entity-options-item" @click=${() => { this._showSearchSheetInOptions(); }}>Search</button>

        ${Array.isArray(sourceList) && sourceList.length > 0 ? html`
          <button class="entity-options-item" @click=${() => this._openSourceList()}>Source</button>
        ` : nothing}
        
        ${this._canShowTransferQueueOption() ? html`
          <button class="entity-options-item" @click=${() => this._openTransferQueue()}>Transfer Queue</button>
        ` : nothing}
        
        ${this._renderGroupingMenuOption()}
        
        ${menuOnlyActions.length ? html`
          ${menuOnlyActions.map(({ action, idx }) => {
        const label = this._getActionLabel(action);
        return html`
              <button
                class="entity-options-item menu-action-item"
                @click=${() => this._onMenuActionClick(idx)}
              >
                ${action.icon ? html`
                  <ha-icon
                    class="menu-action-icon"
                    .icon=${action.icon}
                  ></ha-icon>
                ` : nothing}
                ${label ? html`<span class="menu-action-label">${label}</span>` : nothing}
              </button>
            `;
      })}
        ` : nothing}
      </div>
    `;
  }

  _renderGroupingMenuOption() {
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
      return html`
        <button class="entity-options-item" @click=${() => this._openGrouping()}>Group Players</button>
      `;
    }
    return nothing;
  }

  _renderGroupingSheet() {
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterGroupId = masterIdx >= 0 ? this._getGroupingEntityId(masterIdx) : masterId;
    const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
    const groupedAny = Array.isArray(masterState?.attributes?.group_members) && masterState.attributes.group_members.length > 1;

    const groupPlayerIds = [];
    const currentEntityIdx = this.entityIds.indexOf(this.currentEntityId);
    const myGroupKey = this._getGroupKey(this.currentEntityId);

    this.entityIds.forEach((id, idx) => {
      const entityToCheck = this._getGroupingEntityId(idx);
      const st = this.hass.states[entityToCheck];

      if (st && this._isGroupCapable(st)) {
        const playerGroupKey = this._getGroupKey(id);
        let isBusy = false;
        let busyLabel = "";

        // Busy if joined to a DIFFERENT group
        if (playerGroupKey !== id && playerGroupKey !== myGroupKey) {
          isBusy = true;
          busyLabel = "Unavailable";
        }
        // Or if it IS a master of a different group
        else if (playerGroupKey === id && playerGroupKey !== myGroupKey) {
          if (st.attributes?.group_members?.length > 1) {
            isBusy = true;
            busyLabel = "Unavailable";
          }
        }

        groupPlayerIds.push({
          id: id,
          groupId: entityToCheck,
          isBusy,
          busyLabel
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
          <button class="entity-options-item close-item" @click=${() => { if (this._quickMenuInvoke) { this._dismissWithAnimation(); } else { this._closeGrouping(); } }}>
            Back
          </button>
          <div class="entity-options-divider"></div>
        </div>
        <div class="entity-options-title" style="margin-bottom:8px;">Group Players</div>
        <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
          ${activeIsBusy ? "Player is unavailable" : "No group-capable players available."}
        </div>
      `;
    }

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
      <div class="grouping-header group-list-header">
        <button class="entity-options-item close-item" @click=${() => { if (this._quickMenuInvoke) { this._dismissWithAnimation(); } else { this._closeGrouping(); } }}>
          Back
        </button>
      </div>
      <div class="entity-options-title" style="margin-bottom:8px; margin-top:8px;">Group Players</div>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        ${groupedAny ? html`
          <button class="entity-options-item"
            @click=${() => this._syncGroupVolume()}
            style="flex:0 0 auto; min-width:140px; text-align:center;">
            Sync Volume
          </button>
        ` : nothing}
        <button class="entity-options-item"
          @click=${() => groupedAny ? this._ungroupAll() : this._groupAll()}
          style="flex:0 0 auto; min-width:140px; text-align:center; margin-left:auto;">
          ${groupedAny ? "Ungroup All" : "Group All"}
        </button>
      </div>
      <div class="group-list-scroll">
        ${sortedGroupIds.length === 0 ? html`
          <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
            No other group-capable players available.
          </div>
        ` : sortedGroupIds.map(item => {
      const id = item.id;
      const actualGroupId = item.groupId;
      const filteredMembers = Array.isArray(masterState?.attributes?.group_members) ? masterState.attributes.group_members : [];
      const grouped = filteredMembers.includes(actualGroupId);
      const name = this.getChipName(id);
      const isBusy = item.isBusy;
      const busyLabel = item.busyLabel;

      const entityIdx = this.entityIds.indexOf(id);
      const volumeEntity = this._getVolumeEntityForGrouping(entityIdx);
      const displayEntity = volumeEntity || actualGroupId;
      const displayVolumeState = this.hass.states[displayEntity];

      const isRemoteVol = displayEntity?.startsWith && displayEntity.startsWith("remote.");
      const volVal = Number(displayVolumeState?.attributes?.volume_level || 0);
      const isPrimaryRow = id === masterId;
      const showToggleButton = !isPrimaryRow;
      const isCurrent = id === activeId;

      let stateLabel = groupedAny
        ? (isPrimaryRow ? "Master" : (grouped ? "Joined" : "Available"))
        : (isCurrent ? "Current" : "Available");

      if (isBusy) {
        stateLabel = busyLabel || "Unavailable";
      }

      return html`
            <div class="entity-options-item group-player-row" style="
              display:flex;
              align-items:center;
              gap:6px;
              padding:4px 8px;
              margin-bottom:1px;
              ${isBusy ? "opacity: 0.5;" : ""}
            ">
              <div style="flex:1; min-width:120px;">
                <div style="font-weight:600; text-align:left;">${name}</div>
                <div style="font-size:0.8em; opacity:0.7; text-align:left;">${stateLabel}</div>
              </div>
              <div style="flex:1.8;display:flex;align-items:center;gap:4px;margin:0 6px; min-width:160px;">
                ${isRemoteVol
          ? html`
                    <div class="vol-stepper" style="display:flex;align-items:center;gap:4px;">
                      <button @click=${() => this._onGroupVolumeStep(displayEntity, -1)} title="Vol Down" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:minus"></ha-icon>
                      </button>
                      <button @click=${() => this._onGroupVolumeStep(displayEntity, 1)} title="Vol Up" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:plus"></ha-icon>
                      </button>
                    </div>
                  `
          : html`
                    <input
                      class="vol-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      .value=${volVal}
                      @change=${e => this._onGroupVolumeChange(id, displayEntity, e)}
                      title="Volume"
                      style="width:100%;max-width:260px;"
                    />
                  `
        }
                <span style="min-width:36px;display:inline-block;text-align:right;">${typeof volVal === "number" ? Math.round(volVal * 100) + "%" : "--"}</span>
              </div>
              ${showToggleButton
          ? html`
                    <button class="group-toggle-btn"
                            @click=${() => !isBusy && this._toggleGroup(id)}
                            title=${isBusy ? "Player is unavailable" : (grouped ? "Unjoin" : "Join")}
                            style="margin-left:4px; ${isBusy ? "cursor: not-allowed; opacity: 0.5;" : ""}">
                      <ha-icon icon=${grouped ? "mdi:minus-circle-outline" : "mdi:plus-circle-outline"}></ha-icon>
                    </button>
                  `
          : html`<span style="margin-left:4px;margin-right:10px;width:32px;display:inline-block;"></span>`
        }
            </div>
          `;
    })}
      </div>
    `;
  }

  _renderTransferQueueSheet() {
    const targets = this._getTransferQueueTargets();
    return html`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${() => { if (this._quickMenuInvoke) { this._dismissWithAnimation(); } else { this._closeTransferQueue(); } }}>
          Back
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-title" style="margin-bottom:12px;">Transfer Queue To</div>
      </div>
      <div class="entity-options-scroll">
        ${!targets.length ? html`
          <div style="padding: 12px; opacity: 0.75;">No other Music Assistant players available.</div>
        ` : html`
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${targets.map(target => html`
              <button
                class="entity-options-item"
                ?disabled=${this._transferQueuePendingTarget === target.maEntityId}
                @click=${() => this._transferQueueTo(target)}
                style="display:flex;align-items:center;justify-content:flex-start;gap:12px;${this._transferQueuePendingTarget === target.maEntityId ? 'opacity:0.6;' : ''}">
                <ha-icon .icon=${target.icon} style="margin-right:4px;"></ha-icon>
                <div style="display:flex;flex-direction:column;align-items:flex-start;">
                  <div>${target.name}</div>
                  <div style="font-size:0.82em;opacity:0.7;">${target.subtitle}</div>
                </div>
                ${target.state ? html`<div style="margin-left:auto;font-size:0.82em;opacity:0.7;text-transform:capitalize;">${target.state}</div>` : nothing}
              </button>
            `)}
          </div>
        `}
        ${this._transferQueueStatus ? html`
          <div style="
            margin-top: 14px;
            padding: 10px 12px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            background: ${this._transferQueueStatus.type === 'error' ? 'rgba(244, 67, 54, 0.18)' : 'rgba(76, 175, 80, 0.18)'};
            color: ${this._transferQueueStatus.type === 'error' ? '#ff8a80' : '#8bc34a'};
          ">
            ${this._transferQueueStatus.message}
          </div>
        ` : nothing}
      </div>
    `;
  }

  _renderResolvedEntitiesSheet() {
    return html`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${() => {
        this._showResolvedEntities = false;
        this.requestUpdate();
      }}>
          Back
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-resolved-entities" style="margin-top:12px;">
          <div class="entity-options-title">Select Entity for More Info</div>
          <div class="entity-options-resolved-entities-list">
            ${this._getResolvedEntitiesForCurrentChip().map(entityId => {
        const state = this.hass?.states?.[entityId];
        const name = state?.attributes?.friendly_name || entityId;
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
          } else if (entityId === volEntity && volEntity !== obj.entity_id && volEntity !== maEntity) {
            role = "Volume Entity";
          }
        }

        return html`
                <button class="entity-options-item" @click=${() => {
            this._openMoreInfoForEntity(entityId);
            this._showEntityOptions = false;
            this._showResolvedEntities = false;
            this.requestUpdate();
          }}>
                  <ha-icon .icon=${icon} style="margin-right: 8px;"></ha-icon>
                  <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <div>${isActive ? `${name} (Active)` : name}</div>
                    <div style="font-size: 0.85em; opacity: 0.7;">${role}</div>
                  </div>
                </button>
              `;
      })}
          </div>
        </div>
      </div>
    `;
  }

  updated(changedProps) {
    if (this._idleImageTemplate && changedProps.has("hass")) {
      this._idleImageTemplateNeedsResolve = true;
    }
    if (changedProps.has("_selectedIndex") || changedProps.has("hass")) {
      void this._updateTransferQueueAvailability({ refresh: false });
    }

    if (this.hass && this._hasMassQueueIntegration === null && !this._checkingMassQueueIntegration) {
      this._checkingMassQueueIntegration = true;
      this._isMassQueueIntegrationAvailable(this.hass)
        .then(hasIntegration => {
          this._hasMassQueueIntegration = hasIntegration;
          if (hasIntegration) {
            this._massQueueAvailable = this._massQueueAvailable || hasIntegration;
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
        const currentPlaybackEntity = this.currentActivePlaybackEntityId;
        if (currentPlaybackEntity) {
          const currentState = this.hass.states[currentPlaybackEntity];
          const currentMediaTitle = currentState?.attributes?.media_title;
          if (currentMediaTitle && currentMediaTitle !== this._lastMediaTitle) {
            this._lastMediaTitle = currentMediaTitle;
            // Show loading state immediately
            this._searchLoading = true;
            this.requestUpdate();
            // Clear cache and refresh with 4 second delay
            const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
            delete this._searchResultsByType[cacheKey];
            setTimeout(() => {
              this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter);
            }, 4000);
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
          this._lastActiveEntityIdByChip[idx] = mainId;
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
            this._lastActiveEntityIdByChip[idx] = maId;
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
      this._updateIdleState();

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

          if (
            this._isEntityPlaying(mostRecentActiveState) &&
            this.entityIds[this._selectedIndex] !== mostRecentId &&
            (!this._idleTimeout || !this._hasSeenPlayback) &&
            !isCurrentPlaying
          ) {
            this._selectedIndex = this.entityIds.indexOf(mostRecentId);
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
          if (masterIdx >= 0) {
            this._selectedIndex = masterIdx;
            this._lastGroupingMasterId = actualMaster;
          }
        }
      }
      // Warm the resolved MA/Volume caches for the selected chip
      this._ensureResolvedMaForIndex(this._selectedIndex);
      this._ensureResolvedVolForIndex(this._selectedIndex);
    }

    // Restart progress timer
    super.updated?.(changedProps);

    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    const playbackState = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (this._isEntityPlaying(playbackState) && playbackState.attributes.media_duration) {
      this._progressTimer = setInterval(() => {
        this.requestUpdate();
      }, 500);
    }

    // Update idle state after all other state checks


    // Notify HA if collapsed state changes
    // If expand on search is enabled and search is open, force expanded state
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
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
          const customHeight = Number(this.config?.card_height);
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
      }, 200);
    }
    // When the source‑list sheet opens, make sure the overlay scrolls to the top
    if (this._showSourceList) {
      setTimeout(() => {
        const overlayEl = this.renderRoot.querySelector('.entity-options-overlay');
        if (overlayEl) overlayEl.scrollTop = 0;
      }, 0);
    }
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
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source: src
    });
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
    // Ignore the synthetic click that fires immediately after a long‑press pin.
    if (this._holdToPin && this._justPinned) {
      this._justPinned = false;
      return;
    }

    // Select the tapped chip.
    this._selectedIndex = idx;
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
          this._showEntityOptions = true;
          this._showGrouping = true;
          this.requestUpdate();
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
        case "transfer-queue":
          this._showEntityOptions = true;
          this._openTransferQueue();
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
      const path = (typeof action.navigation_path === "string" ? action.navigation_path : action.path || "").trim();
      const openInNewTab = action.navigation_new_tab === true;
      this._handleNavigate(path, openInNewTab);
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
    this.hass.callService(domain, service, data);
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
        "search": "Search",
        "search-recently-played": "Recently Played",
        "search-next-up": "Next Up",
        "source": "Source",
        "more-info": "More Info",
        "group-players": "Group Players",
        "transfer-queue": "Transfer Queue",
      };
      return menuLabels[action.menu_item] ?? action.menu_item;
    }
    if (
      (typeof action.navigation_path === "string" && action.navigation_path.trim() !== "") ||
      action.action === "navigate"
    ) {
      return iconOnly ? "" : "Navigate";
    }
    if (action.service) return iconOnly ? "" : action.service;
    return iconOnly ? "" : "Action";
  }

  async _onControlClick(action) {
    // Use the unified entity resolution system for control actions
    const targetEntity = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    if (!targetEntity) return;

    const stateObj = this.hass?.states?.[targetEntity] || this.currentStateObj;



    switch (action) {
      case "play_pause":
        if (this._isEntityPlaying(stateObj)) {
          this.hass.callService("media_player", "media_pause", { entity_id: targetEntity });
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
          this.hass.callService("media_player", "media_play", { entity_id: targetEntity });
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
        this.hass.callService("media_player", "media_next_track", { entity_id: targetEntity });
        break;
      case "prev":
        this.hass.callService("media_player", "media_previous_track", { entity_id: targetEntity });
        break;
      case "stop":
        this.hass.callService("media_player", "media_stop", { entity_id: targetEntity });
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
        this.hass.callService("media_player", "shuffle_set", { entity_id: targetEntity, shuffle: !curr });
        break;
      }
      case "repeat": {
        // Cycle: off → all → one → off
        let curr = stateObj.attributes.repeat || "off";
        let next;
        if (curr === "off") next = "all";
        else if (curr === "all") next = "one";
        else next = "off";
        this.hass.callService("media_player", "repeat_set", { entity_id: targetEntity, repeat: next });
        break;
      }
      case "power": {
        // Toggle main entity power (physical power behavior)
        const mainId = this.currentEntityId;
        const mainState = this.hass?.states?.[mainId] || stateObj;
        const svc = mainState?.state === "off" ? "turn_on" : "turn_off";
        this.hass.callService("media_player", svc, { entity_id: mainId });

        // Also toggle volume_entity if sync_power is enabled for this entity
        const obj = this.entityObjs[this._selectedIndex];
        if (obj && obj.sync_power) {
          const volEntityId = this._getVolumeEntity(this._selectedIndex);
          if (volEntityId && volEntityId !== obj.entity_id) {
            this.hass.callService("media_player", svc, { entity_id: volEntityId });
          }
        }
        break;
      }
      case "favorite": {
        // Press the associated favorite button entity
        const favoriteButtonEntity = this._getFavoriteButtonEntity();
        if (favoriteButtonEntity) {
          this.hass.callService("button", "press", { entity_id: favoriteButtonEntity });

          // Immediately mark as favorited when button is pressed
          const maState = this.hass?.states?.[targetEntity];
          if (maState?.attributes?.media_content_id) {
            // Initialize cache if needed
            if (!this._favoriteStatusCache) {
              this._favoriteStatusCache = {};
            }

            // Immediately set as favorited
            this._favoriteStatusCache[maState.attributes.media_content_id] = {
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
  async _onVolumeChange(e) {
    const idx = this._selectedIndex;
    const groupingEntityTemplate = this._getGroupingEntityId(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];
    const newVol = Number(e.target.value);
    const obj = this.entityObjs[idx];

    // Always use group_volume directly from obj
    const groupVolume = (typeof obj.group_volume === "boolean") ? obj.group_volume : true;

    if (!groupVolume) {
      this.hass.callService("media_player", "volume_set", {
        entity_id: this._getVolumeEntity(idx),
        volume_level: newVol
      });
      return;
    }

    // Group volume logic: ONLY runs if group_volume is true/undefined
    if (Array.isArray(state?.attributes?.group_members) && state.attributes.group_members.length) {
      // Get the main entity and all grouped members
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [mainEntity, ...state.attributes.group_members];
      const base = typeof this._groupBaseVolume === "number"
        ? this._groupBaseVolume
        : Number(this.currentVolumeStateObj?.attributes.volume_level || 0);
      const delta = newVol - base;

      for (const t of targets) {
        // Find the configured entity that has this grouping entity
        let foundObj = null;
        for (const obj of this.entityObjs) {
          let resolvedGroupingId;
          if (obj.music_assistant_entity) {
            if (typeof obj.music_assistant_entity === 'string' &&
              (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
              // For templates, resolve at action time
              try {
                resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
              } catch (error) {
                resolvedGroupingId = obj.entity_id;
              }
            } else {
              resolvedGroupingId = obj.music_assistant_entity;
            }
          } else {
            resolvedGroupingId = obj.entity_id;
          }

          if (resolvedGroupingId === t) {
            foundObj = obj;
            break;
          }
        }

        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + delta;
        v = Math.max(0, Math.min(1, v));
        this.hass.callService("media_player", "volume_set", { entity_id: volTarget, volume_level: v });
      }
      this._groupBaseVolume = newVol;
    } else {
      const volumeEntity = this._getVolumeEntity(idx);
      this.hass.callService("media_player", "volume_set", { entity_id: volumeEntity, volume_level: newVol });
    }
  }

  async _onVolumeStep(direction) {
    const idx = this._selectedIndex;
    const entity = this._getVolumeEntity(idx);
    if (!entity) return;
    const isRemoteVolumeEntity = entity.startsWith && entity.startsWith("remote.");
    const stateObj = this.currentVolumeStateObj;
    if (!stateObj) return;

    if (isRemoteVolumeEntity) {
      this.hass.callService("remote", "send_command", {
        entity_id: entity,
        command: direction > 0 ? "volume_up" : "volume_down"
      });
      return;
    }

    const groupingEntityTemplate = this._getGroupingEntityId(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];

    if (Array.isArray(state?.attributes?.group_members) && state.attributes.group_members.length) {
      // Grouped: apply group gain step
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [mainEntity, ...state.attributes.group_members];
      // Use configurable step size
      const step = this._volumeStep * direction;
      for (const t of targets) {
        // Find the configured entity that has this grouping entity
        let foundObj = null;
        for (const obj of this.entityObjs) {
          let resolvedGroupingId;
          if (obj.music_assistant_entity) {
            if (typeof obj.music_assistant_entity === 'string' &&
              (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
              // For templates, resolve at action time
              try {
                resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
              } catch (error) {
                resolvedGroupingId = obj.entity_id;
              }
            } else {
              resolvedGroupingId = obj.music_assistant_entity;
            }
          } else {
            resolvedGroupingId = obj.entity_id;
          }

          if (resolvedGroupingId === t) {
            foundObj = obj;
            break;
          }
        }

        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + step;
        v = Math.max(0, Math.min(1, v));
        this.hass.callService("media_player", "volume_set", { entity_id: volTarget, volume_level: v });
      }
    } else {
      // Not grouped, set directly
      let current = Number(stateObj.attributes.volume_level || 0);
      current += this._volumeStep * direction;
      current = Math.max(0, Math.min(1, current));
      this.hass.callService("media_player", "volume_set", { entity_id: entity, volume_level: current });
    }
  }

  async _onMuteToggle() {
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
      if (isMuted) {
        // Restore to a reasonable volume if was muted
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0.5
        });
      } else {
        // Mute by setting volume to 0
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0
        });
      }
      return;
    }

    // Check if mute is supported
    const supportsMute = this._supportsFeature(stateObj, SUPPORT_VOLUME_MUTE);

    if (!supportsMute) {
      // If mute is not supported, implement mute by setting volume to 0 and storing previous volume
      if (currentVolume > 0) {
        // Store current volume and mute
        this._previousVolume = currentVolume;
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0
        });
      } else {
        // Restore previous volume
        const restoreVolume = this._previousVolume ?? 0.5;
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: restoreVolume
        });
        this._previousVolume = null;
      }
      return;
    }

    let groupingEntityTemplate, groupingEntity, state;
    try {
      groupingEntityTemplate = this._getGroupingEntityId(idx);
      groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
      state = this.hass.states[groupingEntity];
    } catch (error) {
      console.error('yamp: Error in grouping detection:', error);
    }

    if (Array.isArray(state?.attributes?.group_members) && state.attributes.group_members.length) {
      // Grouped: apply mute to all group members
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [mainEntity, ...state.attributes.group_members];



      for (const t of targets) {
        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const targetState = this.hass.states[volTarget];
        const targetSupportsMute = targetState ? this._supportsFeature(targetState, SUPPORT_VOLUME_MUTE) : false;

        if (targetSupportsMute) {
          this.hass.callService("media_player", "volume_mute", {
            entity_id: volTarget,
            is_volume_muted: !isMuted
          });
        } else {
          // For entities that don't support mute, set volume to 0 or restore
          const targetVolume = targetState?.attributes?.volume_level ?? 0;
          if (targetVolume > 0) {
            // Store current volume and mute (simplified - in a real implementation you'd want to store per entity)
            this.hass.callService("media_player", "volume_set", {
              entity_id: volTarget,
              volume_level: 0
            });
          } else {
            // Restore to a reasonable volume
            this.hass.callService("media_player", "volume_set", {
              entity_id: volTarget,
              volume_level: 0.5
            });
          }
        }
      }
    } else {
      // Not grouped, toggle mute directly
      this.hass.callService("media_player", "volume_mute", {
        entity_id: entity,
        is_volume_muted: !isMuted
      });
    }
  }

  _onVolumeDragStart(e) {
    // Store base group volume at drag start
    if (!this.hass) return;
    const state = this.currentVolumeStateObj;
    this._groupBaseVolume = state ? Number(state.attributes.volume_level || 0) : 0;
  }
  _onVolumeDragEnd(e) {
    this._groupBaseVolume = null;
  }

  _onGroupVolumeChange(entityId, volumeEntity, e) {
    const vol = Number(e.target.value);
    this.hass.callService("media_player", "volume_set", { entity_id: volumeEntity, volume_level: vol });
    this.requestUpdate();
  }
  _onGroupVolumeStep(volumeEntity, direction) {
    this.hass.callService("remote", "send_command", {
      entity_id: volumeEntity,
      command: direction > 0 ? "volume_up" : "volume_down"
    });
    this.requestUpdate();
  }

  _onSourceChange(e) {
    const entity = this.currentEntityId;
    const source = e.target.value;
    if (!entity || !source) return;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source
    });
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

      this.hass.callService("media_player", "media_seek", { entity_id: targetEntity, seek_position: seekTime });
    } catch (err) {
      console.error("YAMP: Error in _onProgressBarClick", err);
    }
  }

  render() {
    if (!this.hass || !this.config) return nothing;



    const customCardHeightInput = this.config.card_height;
    const customCardHeight = typeof customCardHeightInput === "string"
      ? customCardHeightInput
      : Number(customCardHeightInput);
    const isValidCardHeightNumber = typeof customCardHeight === "number" && Number.isFinite(customCardHeight) && customCardHeight > 0;
    const hasCustomCardHeight = isValidCardHeightNumber || (typeof customCardHeight === "string" && customCardHeight.trim() !== "");
    const collapsedBaselineHeight = this._collapsedBaselineHeight || 220;

    const hasSingleEntity = this.entityObjs.length === 1;
    const isMinHeight = hasSingleEntity && this.config.always_collapsed === true && this.config.expand_on_search !== true;
    const effectivePinHeaders = this.config.pin_search_headers === true && !isMinHeight;

    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      this.shadowRoot.host.setAttribute("data-always-collapsed", String(this.config.always_collapsed === true));
      const forceHideMenuPlayer = this.config.always_collapsed === true && this.config.pin_search_headers === true && this.config.expand_on_search === true;
      this.shadowRoot.host.setAttribute("data-hide-menu-player", String(this.config.hide_menu_player === true || forceHideMenuPlayer));
      this.shadowRoot.host.setAttribute("data-extend-artwork", String(this.config.extend_artwork === true));
      this.shadowRoot.host.setAttribute("data-control-layout", this._controlLayout);
      this.shadowRoot.host.setAttribute("data-pin-search-headers", String(effectivePinHeaders));
      if (hasCustomCardHeight) {
        this.shadowRoot.host.setAttribute("data-has-custom-height", "true");
      } else {
        this.shadowRoot.host.removeAttribute("data-has-custom-height");
      }
    }

    const showChipRow = this.config.show_chip_row || "auto";
    const hasMultipleEntities = this.entityObjs.length > 1;
    const showChipsInMenu = showChipRow === "in_menu" && hasMultipleEntities;
    const showChipsInline = !showChipsInMenu && (hasMultipleEntities || showChipRow === "always");
    const decoratedActions = (this.config.actions ?? []).map((action, idx) => ({ action, idx }));
    const rowActions = decoratedActions.filter(({ action }) => !action?.in_menu);
    const menuOnlyActions = decoratedActions.filter(({ action }) => action?.in_menu);
    const activeChipName = showChipsInMenu ? this.getChipName(this.currentEntityId) : null;
    const stateObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (!stateObj) return html`<div class="details">Entity not found.</div>`;

    const currentHiddenControls = this._getHiddenControlsForCurrentEntity();
    const showFavoriteButton = !!this._getFavoriteButtonEntity() && !currentHiddenControls.favorite;
    const favoriteActive = this._isCurrentTrackFavorited();
    const powerSupported = !currentHiddenControls.power && (this._supportsFeature(stateObj, SUPPORT_TURN_OFF) || this._supportsFeature(stateObj, SUPPORT_TURN_ON));
    const showModernPowerButton = this._controlLayout === "modern" && powerSupported;
    const showModernFavoriteButton = this._controlLayout === "modern" && showFavoriteButton;
    let leadingVolumeControl = nothing;
    if (showModernPowerButton) {
      leadingVolumeControl = html`
          <button
            class="volume-icon-btn favorite-volume-btn${stateObj?.state !== "off" ? " active" : ""}"
            @click=${() => this._onControlClick("power")}
            title="Power"
          >
            <ha-icon .icon=${"mdi:power"}></ha-icon>
          </button>
        `;
    } else if (this._controlLayout === "modern") {
      leadingVolumeControl = html`
          <button
            class="volume-icon-btn favorite-volume-btn"
            @click=${() => this._openQuickSearchOverlay()}
            title="Search"
          >
            <ha-icon .icon=${"mdi:magnify"}></ha-icon>
          </button>
        `;
    }
    const rightSlotTemplate = showModernFavoriteButton ? html`
        <button
          class="volume-icon-btn favorite-volume-btn${favoriteActive ? " active" : ""}"
          @click=${() => this._onControlClick("favorite")}
          title="Favorite"
        >
          <ha-icon
            style=${favoriteActive ? "color: var(--custom-accent);" : nothing}
            .icon=${favoriteActive ? "mdi:heart" : "mdi:heart-outline"}
          ></ha-icon>
        </button>
      ` : nothing;

    // Collect unique, sorted first letters of source names
    const sourceList = stateObj.attributes.source_list || [];
    const availableSourceFirstLetters = new Set(sourceList.map(s => (s && s[0] ? s[0].toUpperCase() : "")));
    const sourceLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    if (this._idleImageTemplate && this._idleImageTemplateNeedsResolve && !this._resolvingIdleImageTemplate && this._isIdle) {
      void this._resolveIdleImageTemplate();
    }
    // Idle image "picture frame" mode when idle
    const rawIdleImageInput = this._idleImageTemplate
      ? this._idleImageTemplateResult
      : this.config.idle_image;
    const normalizedIdleImageInput = this._normalizeImageSourceValue(rawIdleImageInput);
    let idleImageUrl = null;
    if (normalizedIdleImageInput && this._isIdle) {
      // Check if it's an entity ID
      if (this.hass.states[normalizedIdleImageInput]) {
        const sensorState = this.hass.states[normalizedIdleImageInput];
        idleImageUrl =
          sensorState.attributes.entity_picture_local ||
          sensorState.attributes.entity_picture ||
          (sensorState.state && sensorState.startsWith("http") ? sensorState.state : null);
      }
      // Check if it's a direct URL or file path
      else if (normalizedIdleImageInput.startsWith("http") || normalizedIdleImageInput.startsWith("/")) {
        idleImageUrl = normalizedIdleImageInput;
      }
    }
    const dimIdleFrame = !!idleImageUrl;
    const hideControlsNow = this._isIdle;
    const shouldDimIdle = dimIdleFrame && this._isIdle;
    const artworkFullBleed = this.config.extend_artwork === true;

    // Calculate shuffle/repeat state from the active playback entity when available
    const mainStateForPlayback = this.currentStateObj;
    const maStateForPlayback = this.currentPlaybackStateObj;
    const optimisticEntityId = this._optimisticPlayback?.entity_id || null;

    // --- Fix 2: priority rule for entity selection ---
    // Keep the currently‑selected entity (even if paused)
    // unless some other entity is *playing*.
    // Use cached resolved MA ID instead of raw template string
    const resolvedMaId = this._getResolvedPlaybackEntityIdSync(this._selectedIndex);
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
    const playbackEntityId = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    const playbackStateObj = this.hass?.states?.[playbackEntityId];

    // Use the unified entity resolution system for playback state
    const finalPlaybackStateObj = playbackStateObj;

    // Keep finalEntityId for backward compatibility with existing code
    const finalEntityId = playbackEntityId;
    // Blend in optimistic playback state if present
    let effState = finalPlaybackStateObj?.state;
    if (this._optimisticPlayback) {
      // Only apply optimistic state if it matches the current playback entity
      const optimisticEntityId = this._optimisticPlayback.entity_id;
      const currentEntityId = finalEntityId;
      if (optimisticEntityId === currentEntityId) {
        effState = this._optimisticPlayback.state;
      }
    }
    const shuffleActive = !!finalPlaybackStateObj?.attributes?.shuffle;
    const repeatActive = finalPlaybackStateObj?.attributes?.repeat && finalPlaybackStateObj?.attributes?.repeat !== "off";

    // Artwork and idle logic
    // When idle_timeout_ms=0, always show content regardless of idle state
    const isPlaying = this._idleTimeoutMs === 0 ? this._isEntityPlaying(playbackStateObj) : (!this._isIdle && this._isEntityPlaying(playbackStateObj));
    // Artwork keeps using the visible main entity's artwork when available; fallback to playback entity if main has none
    const mainState = this.currentStateObj;
    const mainArtwork = this._getArtworkUrl(mainState);
    const playbackArtwork = this._getArtworkUrl(playbackStateObj);
    const isRealArtwork = this._idleTimeoutMs === 0 ? (isPlaying && (mainArtwork?.url || playbackArtwork?.url)) : (!this._isIdle && isPlaying && (mainArtwork?.url || playbackArtwork?.url));
    const art = isRealArtwork ? (mainArtwork?.url || playbackArtwork?.url) : null;
    // Details
    // When idle_timeout_ms=0, always show title/artist if available, regardless of playing state
    const shouldShowDetails = this._idleTimeoutMs === 0 ? true : isPlaying;
    // For display-only fields, fall back to mainState when playback state is unavailable
    const displaySource = finalPlaybackStateObj || mainState;
    const title = shouldShowDetails ? ((displaySource?.attributes?.media_title || "")) : "";
    const artist = shouldShowDetails
      ? (
        displaySource?.attributes?.media_artist ||
        displaySource?.attributes?.media_series_title ||
        displaySource?.attributes?.app_name ||
        ""
      )
      : "";
    this._lastTitleLength = title ? title.length : 0;
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
    const showSlider = this.config.volume_mode !== "stepper";

    // Collapse artwork/details on idle if configured and/or always_collapsed
    // If expand on search is enabled and search is open, force expanded state
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
      collapsed = false;
    } else {
      collapsed = this._alwaysCollapsed
        ? true
        : (this._collapseOnIdle ? this._isIdle : false);
    }
    const collapsedExtraSpace = collapsed && this._alwaysCollapsed && hasCustomCardHeight
      ? Math.max(0, customCardHeight - collapsedBaselineHeight)
      : 0;
    const chipRowReserve = collapsed && showChipsInline ? 48 : 0;
    const actionRowReserve = collapsed && rowActions.length > 0 ? 40 : 0;
    const reservedTopSpace = chipRowReserve + actionRowReserve;
    const baseDetailsMinHeight = 48;
    const effectiveExtraSpace = Math.max(0, collapsedExtraSpace - reservedTopSpace);
    const collapsedArtworkSize = collapsedExtraSpace > 0
      ? Math.min(240, 102 + effectiveExtraSpace * 0.75)
      : 102;
    const detailGrowth = effectiveExtraSpace > 0
      ? Math.min(effectiveExtraSpace * 0.45, 96)
      : 0;
    const collapsedDetailsMinHeight = effectiveExtraSpace > 0
      ? Math.round(baseDetailsMinHeight + detailGrowth)
      : baseDetailsMinHeight;
    const detailsMinHeight = collapsed ? collapsedDetailsMinHeight : baseDetailsMinHeight;
    const controlSpacerSize = effectiveExtraSpace > 0
      ? Math.max(0, effectiveExtraSpace - detailGrowth)
      : 0;
    let showCollapsedPlaceholder = false;
    const expandedHeightBaseline = 350;
    const resolvedCollapsedHeight = collapsed
      ? (hasCustomCardHeight ? customCardHeight : (this._collapsedBaselineHeight || 220))
      : expandedHeightBaseline;
    const meetsPersistentHeight = resolvedCollapsedHeight >= expandedHeightBaseline;
    const shouldShowPersistentControls = this.config.hide_menu_player === true
      ? false
      : (!collapsed || meetsPersistentHeight);
    const releaseControlsRow = controlSpacerSize >= 48;
    const collapsedDetailsOffset = collapsedExtraSpace > 0
      ? Math.max(100, Math.round(collapsedArtworkSize + 24 + Math.min(40, collapsedExtraSpace * 0.12)))
      : null;
    const collapsedControlsOffset = releaseControlsRow ? 0 : (collapsedDetailsOffset ?? 0);
    let cardWidth = this.offsetWidth || (this.shadowRoot?.host?.offsetWidth ?? 0);
    const widthScale = cardWidth > 380 ? Math.min(1.6, 1 + (cardWidth - 380) / 520) : 1;
    const heightScale = collapsedExtraSpace > 0
      ? Math.min(1.45, 1 + effectiveExtraSpace / 180)
      : 1;
    const titleScale = heightScale > 1 || widthScale > 1
      ? Math.min(1.6, Math.max(heightScale, widthScale))
      : 1;
    const artistScale = Math.min(1.5, Math.max(heightScale * 0.92, widthScale * 0.92));

    if (this.shadowRoot && this.shadowRoot.host) {
      if (collapsedExtraSpace > 0) {
        if (collapsedDetailsOffset != null) {
          this.shadowRoot.host.style.setProperty('--yamp-collapsed-details-offset', `${collapsedDetailsOffset}px`);
        }
        this.shadowRoot.host.style.setProperty('--yamp-collapsed-controls-offset', `${collapsedControlsOffset}px`);
        this.shadowRoot.host.style.setProperty('--yamp-collapsed-title-scale', titleScale.toFixed(3));
        this.shadowRoot.host.style.setProperty('--yamp-collapsed-artist-scale', artistScale.toFixed(3));
      }
      this.shadowRoot.host.style.setProperty('--yamp-collapsed-title-scale', titleScale.toFixed(3));
      this.shadowRoot.host.style.setProperty('--yamp-collapsed-artist-scale', artistScale.toFixed(3));
      if (!(collapsedExtraSpace > 0 && hasCustomCardHeight)) {
        this.shadowRoot.host.style.removeProperty('--yamp-collapsed-controls-offset');
        this.shadowRoot.host.style.removeProperty('--yamp-collapsed-details-offset');
      }
      if (shouldShowPersistentControls) {
        this.shadowRoot.host.removeAttribute('data-hide-persistent-controls');
      } else {
        this.shadowRoot.host.setAttribute('data-hide-persistent-controls', 'true');
      }
    }
    // Use null if idle or no artwork available
    let artworkUrl = null;
    let artworkSizePercentage = null;
    let artworkObjectFit = this._artworkObjectFit;
    if (!this._isIdle) {
      // Use the unified entity resolution system for artwork
      const playbackArtwork = this._getArtworkUrl(playbackStateObj);
      const mainArtwork = this._getArtworkUrl(mainState);
      const artwork = (playbackArtwork?.url) ? playbackArtwork : mainArtwork;
      artworkUrl = artwork?.url || null;
      artworkSizePercentage = artwork?.sizePercentage;
      if (artwork?.objectFit) {
        artworkObjectFit = artwork.objectFit;
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
      ? (collapsed ? (this._collapsedBaselineHeight || 220) : 325)
      : null;

    this._lastRenderedCollapsed = collapsed;
    this._lastRenderedHideControls = hideControlsNow;

    const activeArtworkFit = artworkObjectFit || this._artworkObjectFit;
    const fitBehavior = this._getBackgroundSizeForFit(activeArtworkFit);
    let backgroundSize = fitBehavior;

    if (artworkSizePercentage) {
      backgroundSize = `${artworkSizePercentage}%`;
    }

    const backgroundImageValue = idleImageUrl
      ? `url('${idleImageUrl}')`
      : artworkUrl
        ? `url('${artworkUrl}')`
        : "none";
    const hasBackgroundImage = backgroundImageValue !== "none";
    const backgroundFilter = (collapsed && artworkUrl)
      ? "blur(18px) brightness(0.7) saturate(1.15)"
      : "none";
    const sharedBackgroundStyle = [
      `background-image: ${backgroundImageValue}`,
      `background-size: ${backgroundSize}`,
      `background-position: ${this.config.artwork_position || "top center"}`,
      "background-repeat: no-repeat",
      `filter: ${backgroundFilter}`
    ].join('; ');

    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.style.setProperty('--yamp-artwork-fit', activeArtworkFit);
      this.shadowRoot.host.style.setProperty('--yamp-artwork-bg-size', backgroundSize);
    }

    return html`
        <ha-card class="yamp-card" style=${(hasCustomCardHeight && (!collapsed || this._alwaysCollapsed)) ? `height:${customCardHeight}px;` : nothing}>
          <div
            data-match-theme="${String(this.config.match_theme === true)}"
            class=${classMap({
      "yamp-card-inner": true,
      "dim-idle": shouldDimIdle,
      "no-chip-dim": this.config.dim_chips_on_idle === false
    })}
          >
            ${artworkFullBleed && hasBackgroundImage ? html`
              <div class="full-bleed-artwork-bg" style="${sharedBackgroundStyle}"></div>
              ${!dimIdleFrame ? html`<div class="full-bleed-artwork-fade"></div>` : nothing}
            ` : nothing}
            ${showChipsInline ? html`
                <div class="chip-row">
                  ${renderChipRow({
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
        const obj = this._findEntityObjByAnyId(id);
        const mainId = obj?.entity_id || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return isSelected ? !this._isIdle : false;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = this.hass?.states?.[playbackEntityId];
        const anyPlaying = this._isEntityPlaying(playbackState);
        return isSelected ? !this._isIdle : anyPlaying;
      },
      getChipArt: (id) => {
        const obj = this._findEntityObjByAnyId(id);
        const mainId = obj?.entity_id || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return null;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = this.hass?.states?.[playbackEntityId];
        const mainState = this.hass?.states?.[mainId];

        // Prefer playback entity artwork, fallback to main entity
        const playbackArtwork = this._getArtworkUrl(playbackState);
        const mainArtwork = this._getArtworkUrl(mainState);
        return playbackArtwork || mainArtwork;
      },
      getIsMaActive: (id) => {
        const obj = this._findEntityObjByAnyId(id);
        const mainId = obj?.entity_id || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return false;

        // Check if there's a configured MA entity
        const entityObj = this.entityObjs[idx];
        if (!entityObj?.music_assistant_entity) return false;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = this.hass?.states?.[playbackEntityId];

        // Check if the playback entity is the MA entity and is playing
        return playbackEntityId === this._resolveEntity(entityObj.music_assistant_entity, entityObj.entity_id, idx) &&
          this._isEntityPlaying(playbackState);
      },
      isIdle: this._isIdle,
      hass: this.hass,
      onChipClick: (idx) => {
        this._onChipClick(idx);
      },
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
      onPointerUp: (e, idx) => this._handleChipPointerUp(e, idx)
    })}
                </div>
            ` : nothing}
            ${renderActionChipRow({
      actions: rowActions.map(({ action }) => action),
      onActionChipClick: (idx) => {
        const target = rowActions[idx];
        if (!target) return;
        this._onActionChipClick(target.idx);
      }
    })}
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
          : (hideControlsNow ? '350px' : '350px')}`);
        styles.push('transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s');
        return styles.join('; ');
      })()}"
              ></div>
              ${!dimIdleFrame ? html`<div class="card-lower-fade"></div>` : nothing}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}${collapsed && artworkUrl ? ' has-artwork' : ''}" style="${(() => {
        if (!hideControlsNow) return '';
        return collapsed
          ? `min-height: ${this._collapsedBaselineHeight || 220}px;`
          : 'min-height: 350px;';
      })()}">
                ${collapsed && artworkUrl && this._isValidArtworkUrl(artworkUrl) ? html`
                  <div
                    class="collapsed-artwork-container"
                    style="${[
          `background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%)`,
          collapsedExtraSpace > 0 ? `width:${Math.round(collapsedArtworkSize + 8)}px` : ''
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
                ${(showCollapsedPlaceholder || !collapsed) ? html`
                  <div class="card-artwork-spacer${showCollapsedPlaceholder ? ' show-placeholder' : ''}">
                    ${(!artworkUrl && !idleImageUrl) ? html`
                      <div class="media-artwork-placeholder">
                        <svg
                          viewBox="0 0 184 184"
                          style="${this.config.match_theme === true ? 'color:#fff;' : `color:${this._customAccent};`}"
                          xmlns="http://www.w3.org/2000/svg">
                          <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"></rect>
                          <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"></rect>
                          <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"></rect>
                          <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"></rect>
                        </svg>
                      </div>
                    ` : nothing}
                  </div>
                ` : nothing}
                <div class="details" style="${(() => {
        const detailStyleParts = [];
        if (this._showEntityOptions) detailStyleParts.push('visibility:hidden');
        detailStyleParts.push(`min-height:${detailsMinHeight}px`);
        if (!shouldShowDetails) detailStyleParts.push('opacity:0');
        return detailStyleParts.join(';');
      })()}">
                  <div class="title">
                    ${shouldShowDetails ? title : ""}
                  </div>
                  ${shouldShowDetails && artist ? html`
                    <div
                      class="artist ${stateObj.attributes.media_artist ? 'clickable-artist' : ''}"
                      @click=${() => {
          if (stateObj.attributes.media_artist) this._searchArtistFromNowPlaying();
        }}
                      title=${stateObj.attributes.media_artist ? "Search for this artist" : ""}
                    >${artist}</div>
                  ` : nothing}
                </div>
                ${(!collapsed && !this._alternateProgressBar)
        ? (isPlaying && duration
          ? renderProgressBar({
            progress,
            seekEnabled: true,
            onSeek: (e) => this._onProgressBarClick(e),
            collapsed: false,
            accent: this._customAccent,
            style: this._showEntityOptions ? "visibility:hidden" : "",
            displayTimestamps: this._displayTimestamps,
            currentTime: pos,
            duration: duration
          })
          : renderProgressBar({
            progress: 0,
            seekEnabled: false,
            collapsed: false,
            accent: this._customAccent,
            style: "visibility:hidden"
          })
        )
        : nothing
      }
                ${(collapsed || this._alternateProgressBar) && isPlaying && duration
        ? renderProgressBar({
          progress,
          collapsed: true,
          accent: this._customAccent,
          style: this._showEntityOptions ? "visibility:hidden" : ""
        })
        : nothing
      }
                ${(!hideControlsNow && controlSpacerSize > 0) ? html`
                  <div class="collapsed-flex-spacer" style="flex: 1 0 ${Math.round(controlSpacerSize)}px;"></div>
                ` : nothing}
                ${!hideControlsNow ? html`
                  <div style="${this._showEntityOptions ? 'visibility:hidden' : ''}">
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
      })}

                    ${renderVolumeRow({
        isRemoteVolumeEntity,
        showSlider,
        vol,
        isMuted: this.currentVolumeStateObj?.attributes?.is_volume_muted ?? false,
        supportsMute: this.currentVolumeStateObj ? this._supportsFeature(this.currentVolumeStateObj, SUPPORT_VOLUME_MUTE) : false,
        onVolumeDragStart: (e) => this._onVolumeDragStart(e),
        onVolumeDragEnd: (e) => this._onVolumeDragEnd(e),
        onVolumeChange: (e) => this._onVolumeChange(e),
        onVolumeStep: (dir) => this._onVolumeStep(dir),
        onMuteToggle: () => this._onMuteToggle(),
        leadingControlTemplate: leadingVolumeControl,
        reserveLeadingControlSpace: this._controlLayout === "modern",
        showRightPlaceholder: this._controlLayout === "modern",
        rightSlotTemplate,
        hideVolume: this.config.volume_mode === "hidden",
        moreInfoMenu: html`
                        <div class="more-info-menu">
                          <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                            <span class="more-info-icon">&#9776;</span>
                          </button>
                        </div>
                      `,
      })}
                  </div>
                ` : nothing}
            ${(hideControlsNow && !this._showEntityOptions) ? html`
              <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: ${Z_LAYERS.FLOATING_ELEMENT};">
                <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                  <span class="more-info-icon">&#9776;</span>
                </button>
              </div>
            ` : nothing}
            ${showChipsInMenu && !this._showEntityOptions && !this._hideActiveEntityLabel ? html`
              <div class="in-menu-active-label">${activeChipName}</div>
            ` : nothing}
          </div>
        </div>

      ${this._showEntityOptions ? html`
      <div class="entity-options-overlay entity-options-overlay-opening" @click=${(e) => this._closeEntityOptions(e)}>
        <div class="entity-options-container entity-options-container-opening">
          <div class="entity-options-sheet${showChipsInMenu ? ' chips-mode' : ''} entity-options-sheet-opening" 
               @click=${e => e.stopPropagation()}
               data-pin-search-headers="${effectivePinHeaders}">
            ${showChipsInMenu ? html`
                <div class="entity-options-chips-wrapper" @click=${(e) => e.stopPropagation()}>
                <div class="chip-row entity-options-chips-strip">
                  ${renderChipRow({
        groupedSortedEntityIds: this.groupedSortedEntityIds,
        entityIds: this.entityIds,
        selectedEntityId: this.currentEntityId,
        pinnedIndex: this._pinnedIndex,
        holdToPin: this._holdToPin,
        getChipName: (id) => this.getChipName(id),
        getActualGroupMaster: (group) => this._getActualGroupMaster(group),
        getIsChipPlaying: (id, isSelected) => {
          const obj = this._findEntityObjByAnyId(id);
          const mainId = obj?.entity_id || id;
          const idx = this.entityIds.indexOf(mainId);
          if (idx < 0) return isSelected ? !this._isIdle : false;
          const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
          const playbackState = this.hass?.states?.[playbackEntityId];
          const anyPlaying = this._isEntityPlaying(playbackState);
          return isSelected ? !this._isIdle : anyPlaying;
        },
        getChipArt: (id) => {
          const obj = this._findEntityObjByAnyId(id);
          const mainId = obj?.entity_id || id;
          const idx = this.entityIds.indexOf(mainId);
          if (idx < 0) return null;
          const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
          const playbackState = this.hass?.states?.[playbackEntityId];
          const mainState = this.hass?.states?.[mainId];
          const playbackArtwork = this._getArtworkUrl(playbackState);
          const mainArtwork = this._getArtworkUrl(mainState);
          return playbackArtwork || mainArtwork;
        },
        getIsMaActive: (id) => {
          const obj = this._findEntityObjByAnyId(id);
          const mainId = obj?.entity_id || id;
          const idx = this.entityIds.indexOf(mainId);
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
        artworkHostname: this.config?.artwork_hostname || '',
        mediaArtworkOverrides: this.config?.media_artwork_overrides || [],
        fallbackArtwork: this.config?.fallback_artwork || null,
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
      })}
                </div>
              </div>
            ` : nothing}
              ${(!this._showGrouping && !this._showSourceList && !this._showSearchInSheet && !this._showResolvedEntities && !this._showTransferQueue) ? this._renderMainMenu(sourceList, menuOnlyActions, showChipsInMenu) :
          this._showGrouping ? this._renderGroupingSheet() :
            this._showTransferQueue ? this._renderTransferQueueSheet() :
              this._showResolvedEntities ? this._renderResolvedEntitiesSheet() :
                this._showSearchInSheet ? html`
              <div class="entity-options-search" style = "margin-top:12px;" >
                ${this._searchHierarchy.length > 0 ? html`
                    <button class="entity-options-item close-item" @click=${() => { if (this._quickMenuInvoke) { this._dismissWithAnimation(); } else { this._goBackInSearch(); } }}>
                      Back
                    </button>
                    <div class="entity-options-divider"></div>
                  ` : nothing
                  }
                  ${this._searchBreadcrumb ? html`
                    <div class="entity-options-search-breadcrumb">
                      <div class="entity-options-search-breadcrumb-text">${this._searchBreadcrumb}</div>
                    </div>
                  ` : html`<div class="entity-options-search-skeleton"></div>`
                  }
                  <div class="entity-options-search-row">
                      <input
                        type="text"
                        id="search-input-box"
                        ?autofocus=${!this._disableSearchAutofocus}
                        class="entity-options-search-input"
                        .value=${this._searchQuery}
                        @input=${e => { this._searchQuery = e.target.value; this.requestUpdate(); }}
                        @keydown=${e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      this._handleSearchSubmit();
                    }
                    else if (e.key === "Escape") { e.preventDefault(); this._hideSearchSheetInOptions(); }
                  }}
                        placeholder="Search music..."
                        style="flex:1; min-width:0; font-size:1.1em;"
                      />
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._handleSearchSubmit()}
                      ?disabled=${this._searchLoading}>
                      Search
                    </button>
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => { if (this._quickMenuInvoke) { this._dismissWithAnimation(); } else { this._hideSearchSheetInOptions(); } }}>
              Cancel
                    </button>
                  </div>
                  <!--FILTER CHIPS-->
              ${(() => {
                    const classes = this._getVisibleSearchFilterClasses();
                    const filter = this._searchMediaClassFilter || "all";

                    // Don't show filter chips when in a hierarchy (artist -> albums -> tracks)
                    if (this._searchHierarchy.length > 0) return nothing;

                    // Show filter chips if we have multiple classes OR if we're using Music Assistant (for Favorites)
                    if (classes.length < 2 && !this._usingMusicAssistant) return nothing;

                    return html`
                      <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center; align-items: center;">
                        <button
                          class="chip"
                          style="
                            width: 72px;
                            background: ${filter === 'all' ? this._customAccent : '#282828'};
                            opacity: ${filter === 'all' ? '1' : '0.8'};
                            font-weight: ${filter === 'all' ? 'bold' : 'normal'};
                          "
                          ?selected=${filter === 'all'}
                          @click=${() => this._doSearch()}
                        >All</button>
                        ${classes.map(c => html`
                          <button
                            class="chip"
                            style="
                              width: 72px;
                              background: ${filter === c ? this._customAccent : '#282828'};
                              opacity: ${filter === c ? '1' : '0.8'};
                              font-weight: ${filter === c ? 'bold' : 'normal'};
                            "
                            ?selected=${filter === c}
                            @click=${() => this._doSearch(c)}
                          >
                            ${c.charAt(0).toUpperCase() + c.slice(1)}
                          </button>
                        `)}
                      </div>
                    `;
                  })()
                  }
                  ${this._searchLoading ? html`<div class="entity-options-search-loading">Loading...</div>` : nothing}
                  ${this._searchError ? html`<div class="entity-options-search-error">${this._searchError}</div>` : nothing}
                  
                  ${this._usingMusicAssistant && !this._searchLoading ? html`
                    <div class="search-sub-filters" style="display: flex; align-items: center; margin-bottom: 2px; margin-top: 4px; padding-left: 3px; width: 100%; gap: 8px;">
                      <div style="display: flex; align-items: center; flex-wrap: wrap; flex: 1; min-width: 0;">
                        <button
                          class="button${this._initialFavoritesLoaded || this._favoritesFilterActive ? ' active' : ''}"
                          style="
                            background: none;
                            border: none;
                            font-size: 1.2em;
                            cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                            padding: 4px 8px;
                            border-radius: 50%;
                            transition: all 0.2s ease;
                            margin-right: 8px;
                            display: flex;
                            align-items: center;
                            opacity: ${this._searchAttempted ? '1' : '0.5'};
                          "
                          @click=${this._searchAttempted ? () => {
                      this._toggleFavoritesFilter();
                    } : () => { }}
                          title="Favorites"
                        >
                                                  <ha-icon .icon=${this._initialFavoritesLoaded || this._favoritesFilterActive ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'}></ha-icon>
                          ${this._initialFavoritesLoaded || this._favoritesFilterActive ? html`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                              Favorites
                            </span>
                          ` : nothing}
                      </button>
                      <button
                          class="button${this._recentlyPlayedFilterActive ? ' active' : ''}"
                          style="
                            background: none;
                            border: none;
                            font-size: 1.2em;
                            cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                            padding: 4px 8px;
                            border-radius: 50%;
                            transition: all 0.2s ease;
                            margin-right: 8px;
                            display: flex;
                            align-items: center;
                            opacity: ${this._searchAttempted ? '1' : '0.5'};
                          "
                          @click=${this._searchAttempted ? () => {
                      this._toggleRecentlyPlayedFilter();
                    } : () => { }}
                          title="Recently Played"
                        >
                          <ha-icon .icon=${this._recentlyPlayedFilterActive ? 'mdi:clock' : 'mdi:clock-outline'}></ha-icon>
                          ${this._recentlyPlayedFilterActive ? html`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                              Recently Played
                            </span>
                          ` : nothing}
                      </button>
                      ${this._isMusicAssistantEntity() ? html`
                        <button
                            class="button${this._upcomingFilterActive ? ' active' : ''}"
                            style="
                              background: none;
                              border: none;
                              font-size: 1.2em;
                              cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                              padding: 4px 8px;
                              border-radius: 50%;
                              transition: all 0.2s ease;
                              margin-right: 8px;
                              display: flex;
                              align-items: center;
                              opacity: ${this._searchAttempted ? '1' : '0.5'};
                            "
                            @click=${this._searchAttempted ? () => {
                        this._toggleUpcomingFilter();
                      } : () => { }}
                            title="Next Up"
                          >
                            <ha-icon .icon=${this._upcomingFilterActive ? 'mdi:playlist-music' : 'mdi:playlist-music-outline'}></ha-icon>
                            ${this._upcomingFilterActive ? html`
                              <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                                Next Up
                              </span>
                            ` : nothing}
                        </button>
                        ${this._hasMassQueueIntegration ? html`
                          <button
                              class="button${this._recommendationsFilterActive ? ' active' : ''}"
                              style="
                                background: none;
                                border: none;
                                font-size: 1.2em;
                                cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                                padding: 4px 8px;
                                border-radius: 50%;
                                transition: all 0.2s ease;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                opacity: ${this._searchAttempted ? '1' : '0.5'};
                              "
                              @click=${this._searchAttempted ? () => {
                          this._toggleRecommendationsFilter();
                        } : () => { }}
                              title="Recommendations"
                            >
                              <ha-icon .icon=${this._recommendationsFilterActive ? 'mdi:lightbulb-on' : 'mdi:lightbulb-on-outline'}></ha-icon>
                              ${this._recommendationsFilterActive ? html`
                                <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                                  Recommendations
                                </span>
                              ` : nothing}
                          </button>
                        ` : nothing}
                      ` : nothing}
                      <button
                          class="radio-mode-button${this._radioModeActive ? ' active' : ''}"
                          @click=${() => this._toggleRadioMode()}
                          title="Radio Mode"
                        >
                          <ha-icon .icon=${this._radioModeActive ? 'mdi:radio' : 'mdi:radio-off'}></ha-icon>
                      </button>
                      ${this._shouldShowSearchSortToggle() ? html`
                        <button
                          class="button"
                          style="
                            background: none;
                            border: none;
                            font-size: 1.2em;
                            cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                            padding: 4px 8px;
                            border-radius: 50%;
                            transition: all 0.2s ease;
                            margin-right: 8px;
                            display: flex;
                            align-items: center;
                            opacity: ${this._searchAttempted ? '1' : '0.5'};
                          "
                          @click=${this._searchAttempted ? () => this._toggleSearchResultsSortDirection() : () => { }}
                          title=${this._getSearchSortToggleTitle()}
                        >
                          <ha-icon .icon=${this._getSearchSortToggleIcon()}></ha-icon>
                        </button>
                      ` : nothing}
                      ${this._shouldShowSearchResultsCount() ? html`
                        <span class="search-results-count">
                          ${this._getSearchResultsCountLabel()}
                        </span>
                      ` : nothing}
                    </div>
                  ` : nothing
                  }

            <div class="entity-options-search-results">
              ${(() => {
                    const filter = this._searchMediaClassFilter || "all";
                    const currentResults = this._getDisplaySearchResults();
                    // Build padded array so row‑count stays constant
                    const totalRows = Math.max(15, this._searchTotalRows || currentResults.length);
                    const paddedResults = [
                      ...currentResults,
                      ...Array.from({ length: Math.max(0, totalRows - currentResults.length) }, () => null)
                    ];
                    // Always render paddedResults, even before first search
                    return (this._searchAttempted && currentResults.length === 0 && !this._searchLoading)
                      ? html`<div class="entity-options-search-empty" style="color: white;">No results.</div>`
                      : paddedResults.map(item => item ? html`
                            <!-- EXISTING non‑placeholder row markup -->
                            <div class="entity-options-search-result ${item._justMoved ? 'just-moved' : ''} ${item.media_content_id != null && this._activeSearchRowMenuId === item.media_content_id ? 'menu-active' : ''}">
                              ${item.thumbnail && this._isValidArtworkUrl(item.thumbnail) && !String(item.thumbnail).includes('imageproxy') ? html`
                                <img
                                  class="entity-options-search-thumb"
                                  src=${item.thumbnail}
                                  alt=${item.title}
                                  style="height:38px;width:38px;object-fit:var(--yamp-artwork-fit, cover);border-radius:5px;margin-right:12px;"
                                  onerror="this.style.display='none'"
                                />
                              ` : html`
                                <div class="entity-options-search-thumb-placeholder" 
                                     style="height:38px;width:38px;border-radius:5px;margin-right:12px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;">
                                  <ha-icon icon="mdi:music" style="color:rgba(255,255,255,0.6);font-size:16px;"></ha-icon>
                                </div>
                              `}
                              <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
                                <span class="${this._isClickableSearchResult(item) ? 'clickable-search-result' : ''}"
                                      @touchstart=${(e) => this._handleSearchResultTouch(item, e)}
                                      @click=${() => this._handleSearchResultClick(item)}
                                      title=${this._getSearchResultClickTitle(item)}>
                                  ${item.title}
                                </span>
                                <span style="font-size:0.86em; color:#bbb; line-height:1.16; margin-top:2px;">
                                  ${(() => {
                          // Prefer artist when available for tracks/albums and special filters
                          const isTrackOrAlbum = (this._searchMediaClassFilter === 'track' || this._searchMediaClassFilter === 'album');
                          const isRecentlyPlayed = !!this._recentlyPlayedFilterActive;
                          const isUpcoming = !!this._upcomingFilterActive;
                          const isRecommendations = !!this._recommendationsFilterActive;
                          if ((isTrackOrAlbum || isRecentlyPlayed || isUpcoming || isRecommendations) && item.artist) {
                            return item.artist;
                          }
                          // Otherwise show media class as before
                          return item.media_class
                            ? (item.media_class.charAt(0).toUpperCase() + item.media_class.slice(1))
                            : "";
                        })()}
                                </span>
                              </div>
                                <div class="entity-options-search-buttons">
                              <button class="entity-options-search-play" @click=${() => this._playMediaFromSearch(item)} title="Play Now">
                                    <ha-icon icon="mdi:play"></ha-icon>
                                  </button>
                                  ${!(this._upcomingFilterActive && item.queue_item_id && this._isMusicAssistantEntity() && this._massQueueAvailable) ? html`
                                    <button class="entity-options-search-queue" @click=${(e) => { e.preventDefault(); e.stopPropagation(); this._activeSearchRowMenuId = item.media_content_id; this.requestUpdate(); }} title="More Options">
                                      <ha-icon icon="mdi:dots-vertical"></ha-icon>
                                    </button>
                                  ` : html`
                                    <!-- Queue reordering buttons for upcoming items (only for Music Assistant entities with working mass_queue) -->
                                    ${this._upcomingFilterActive && item.queue_item_id && this._isMusicAssistantEntity() && this._massQueueAvailable ? html`
                                      <div class="queue-controls">
                                        <button class="queue-btn queue-btn-up" @click=${(e) => { e.preventDefault(); e.stopPropagation(); this._moveQueueItemUp(item.queue_item_id); }} title="Move Up">
                                          <ha-icon icon="mdi:arrow-up"></ha-icon>
                                        </button>
                                        <button class="queue-btn queue-btn-down" @click=${(e) => { e.preventDefault(); e.stopPropagation(); this._moveQueueItemDown(item.queue_item_id); }} title="Move Down">
                                          <ha-icon icon="mdi:arrow-down"></ha-icon>
                                        </button>
                                        <button class="queue-btn queue-btn-next" @click=${(e) => { e.preventDefault(); e.stopPropagation(); this._moveQueueItemNext(item.queue_item_id); }} title="Move to Next">
                                          <ha-icon icon="mdi:format-vertical-align-top"></ha-icon>
                                        </button>
                                        <button class="queue-btn queue-btn-remove" @click=${(e) => { e.preventDefault(); e.stopPropagation(); this._removeQueueItem(item.queue_item_id); }} title="Remove from Queue">
                                          <ha-icon icon="mdi:close"></ha-icon>
                                        </button>
                                      </div>
                                    ` : html`
                                      <button class="entity-options-search-queue" @click=${(e) => { e.preventDefault(); e.stopPropagation(); this._activeSearchRowMenuId = item.media_content_id; this.requestUpdate(); }} title="More Options">
                                        <ha-icon icon="mdi:dots-vertical"></ha-icon>
                                      </button>
                                    `}
                                  `}
                                </div>
                                <!-- SLIDE-OUT MENU -->
                                <div class="search-row-slide-out ${this._activeSearchRowMenuId === item.media_content_id ? 'active' : ''}">
                                  <button class="slide-out-button" @click=${() => this._performSearchOptionAction(item, 'replace')} title="Replace existing queue and play now">
                                    <ha-icon icon="mdi:playlist-remove"></ha-icon> Replace
                                  </button>
                                  <button class="slide-out-button" @click=${() => this._performSearchOptionAction(item, 'next')} title="Play next">
                                    <ha-icon icon="mdi:playlist-play"></ha-icon> Next
                                  </button>
                                  <button class="slide-out-button" @click=${() => this._performSearchOptionAction(item, 'replace_next')} title="Replace queue">
                                    <ha-icon icon="mdi:playlist-music"></ha-icon> Replace Next
                                  </button>
                                  <button class="slide-out-button" @click=${() => this._performSearchOptionAction(item, 'add')} title="Add to the end of the queue">
                                    <ha-icon icon="mdi:playlist-plus"></ha-icon> Add
                                  </button>
                                  <div class="slide-out-close" @click=${(e) => { e.stopPropagation(); this._activeSearchRowMenuId = null; this.requestUpdate(); }}>
                                    <ha-icon icon="mdi:close"></ha-icon>
                                  </div>

                                  ${this._successSearchRowMenuId === item.media_content_id ? html`
                                    <div class="search-row-success-overlay">
                                      ✅ Added to queue!
                                    </div>
                                  ` : nothing}
                                </div>
                            </div>
                          ` : html`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `);
                  })()}
            </div>
                  </div>
                </div>
              ` : this._showGrouping ? this._renderGroupingSheet() : html`
                <div class="entity-options-header">
                  <button class="entity-options-item close-item" @click=${() => { if (this._quickMenuInvoke) { this._dismissWithAnimation(); } else { this._closeSourceList(); } }}>
                    Back
                  </button>
                  <div class="entity-options-divider"></div>
                </div>
                <div class="entity-options-scroll source-list-centering-wrapper">
                  <div class="source-list-sheet">
                    <div class="source-list-scroll">
                      ${sourceList.map(src => html`
                        <div class="entity-options-item" data-source-name="${src}" @click=${() => this._selectSource(src)}>${src}</div>
                      `)}
                    </div>
                  </div>
                </div>
                <div class="floating-source-index">
                  ${sourceLetters.map((letter, i) => {
                    const isAvailable = availableSourceFirstLetters.has(letter);
                    const hovered = this._hoveredSourceLetterIndex;
                    let scale = "";
                    if (isAvailable && hovered !== null && hovered !== undefined) {
                      const dist = Math.abs(hovered - i);
                      if (dist === 0) scale = "max";
                      else if (dist === 1) scale = "large";
                      else if (dist === 2) scale = "med";
                    }
                    return html`
                      <button
                        class="source-index-letter"
                        ?disabled=${!isAvailable}
                        data-scale=${scale}
                        @mouseenter=${isAvailable ? () => { this._hoveredSourceLetterIndex = i; this.requestUpdate(); } : nothing}
                        @mouseleave=${() => { this._hoveredSourceLetterIndex = null; this.requestUpdate(); }}
                        @click=${isAvailable ? () => this._scrollToSourceLetter(letter) : nothing}
                      >
                        ${letter}
                      </button>
                    `;
                  })}
                </div>
`}
              </div>
            </div>
            <!-- Persistent Media Controls Section - Outside Scrollable Area -->
            ${shouldShowPersistentControls ? html`
              <div class="persistent-media-controls" @click=${e => e.stopPropagation()}>
                <div class="persistent-controls-artwork">
                  ${(() => {
            // Use the same entity resolution as the main card
            const playbackStateObj = this.currentPlaybackStateObj;
            const mainState = this.currentStateObj;
            const artwork = this._getArtworkUrl(playbackStateObj) || this._getArtworkUrl(mainState);
            return artwork?.url && this._isValidArtworkUrl(artwork.url) ? html`
                      <img src="${artwork.url}" alt="Album Art" class="persistent-artwork" onerror="this.style.display='none'">
                    ` : html`
                      <div class="persistent-artwork-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `;
          })()}
                </div>
                <div class="persistent-controls-buttons">
                  <button class="persistent-control-btn" @click=${() => this._onControlClick("prev")} title="Previous">
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${() => this._onControlClick("play_pause")} title="Play/Pause">
                    <ha-icon icon=${this._isEntityPlaying(this.currentPlaybackStateObj) ? "mdi:pause" : "mdi:play"}></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${() => this._onControlClick("next")} title="Next">
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </button>
                </div>
                ${(() => {
            const idx = this._selectedIndex;
            const volumeEntity = this._getVolumeEntity(idx);
            if (!volumeEntity) return nothing;

            const isRemote = volumeEntity.startsWith && volumeEntity.startsWith("remote.");
            const volumeState = this.currentVolumeStateObj;
            const volumeLevel = Number(volumeState?.attributes?.volume_level ?? 0);
            const percentLabel = !isRemote ? `${Math.round((volumeLevel || 0) * 100)}%` : null;

            if (this.config.volume_mode === "hidden") return nothing;

            return html`
                    <div class="persistent-volume-stepper">
                      <button class="stepper-btn" @click=${() => this._onVolumeStep(-1)} title="Volume Down">–</button>
                      ${percentLabel ? html`<span class="stepper-value">${percentLabel}</span>` : nothing}
                      <button class="stepper-btn" @click=${() => this._onVolumeStep(1)} title="Volume Up">+</button>
                    </div>
                  `;
          })()}
              </div>
            ` : nothing}
          </div>
        ` : nothing
      }
          ${this._searchActiveOptionsItem ? renderSearchOptionsOverlay({
        item: this._searchActiveOptionsItem,
        onClose: () => {
          this._searchActiveOptionsItem = null;
          this.requestUpdate();
        },
        onPlayOption: (item, mode) => this._performSearchOptionAction(item, mode)
      }) : nothing
      }
          ${this._searchOpen
        ? renderSearchSheet({
          open: this._searchOpen,
          query: this._searchQuery,
          loading: this._searchLoading,
          results: this._getDisplaySearchResults(),
          error: this._searchError,
          matchTheme: this.config?.match_theme, // Add matchTheme parameter
          onClose: () => this._searchCloseSheet(),
          onQueryInput: e => {
            this._searchQuery = e.target.value;
            this.requestUpdate();
          },
          onSearch: () => {
            // Clear recently played filter when user initiates search
            this._recentlyPlayedFilterActive = false;
            this._upcomingFilterActive = false;
            this._recommendationsFilterActive = false;
            this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter);
          },
          onPlay: item => this._playMediaFromSearch(item),
          onQueue: item => this._queueMediaFromSearch(item),
          onPlayOption: (item, mode) => this._performSearchOptionAction(item, mode),
          onResultClick: (item) => this._handleSearchResultClick(item),
          activeSearchRowMenuId: this._activeSearchRowMenuId,
          successSearchRowMenuId: this._successSearchRowMenuId,
          onOptionsToggle: (item) => {
            this._activeSearchRowMenuId = item ? item.media_content_id : null;
            this.requestUpdate();
          },
          upcomingFilterActive: this._upcomingFilterActive,
          disableAutofocus: this._disableSearchAutofocus,
        })
        : nothing
      }
          </div>
    </ha-card>
  `;
  }

  _updateIdleState() {
    // Consider both main and Music Assistant entities so we can wake from idle
    // even if the active selection is frozen while idle.
    const isAnyPlaying = this.entityIds.some((id, idx) => {
      const activeId = this._getEntityForPurpose(idx, 'sorting');
      return this._isEntityPlaying(this.hass.states[activeId]);
    });

    const isCurrentPlaying = this._isCurrentEntityPlaying();

    // Condition to wake up or stay active immediately:
    // 1. The current selection is playing
    // 2. Something is playing and we are currently idle (wake up)
    // 3. Something is playing and we haven't seen playback yet (initial load)
    const shouldBeActiveImmediately = isCurrentPlaying || (isAnyPlaying && (this._isIdle || !this._hasSeenPlayback));

    if (shouldBeActiveImmediately) {
      // Became active, clear timer and set not idle
      if (this._idleTimeout) clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
      this._hasSeenPlayback = true;
      if (this._isIdle) {
        this._isIdle = false;
        this._resetIdleScreen();
        this.requestUpdate();
      }
    } else {
      // Current is not playing, or nothing is playing.
      if (!this._hasSeenPlayback) {
        // Initial load with nothing playing - go idle immediately
        if (this._idleTimeoutMs > 0) {
          if (!this._isIdle) {
            this._isIdle = true;
            this._idleScreenApplied = false;
            this._applyIdleScreen();
            this.requestUpdate();
          }
        } else if (this._isIdle) {
          this._isIdle = false;
          this._resetIdleScreen();
          this.requestUpdate();
        }
        return;
      }

      // Check for grace period: something is playing somewhere, but not the current choice.
      // Or nothing is playing at all. In both cases, we wait for the timeout.
      if (!this._isIdle && !this._idleTimeout && this._idleTimeoutMs > 0) {
        this._idleTimeout = setTimeout(() => {
          this._isIdle = true;
          this._idleTimeout = null;
          this._idleScreenApplied = false;

          // If not explicitly pinned, clear manual select on idle timeout
          // so we can switch to other playing entities if needed
          if (this._pinnedIndex === null) {
            this._manualSelect = false;
            this._manualSelectPlayingSet = null;
          }

          this._applyIdleScreen();
          this.requestUpdate();
        }, this._idleTimeoutMs);
      }

      // If idle_timeout_ms is 0, ensure we're never idle
      if (this._idleTimeoutMs === 0 && this._isIdle) {
        this._isIdle = false;
        this._resetIdleScreen();
        this.requestUpdate();
      }
    }
  }

  // Home assistant layout options
  getGridOptions() {
    // Use the same logic as in render() to know if the card is collapsed.
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
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
              { value: "in_menu", label: "In Menu" }
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
              { value: "group-players", label: "Group Players" },
              { value: "transfer-queue", label: "Transfer Queue" }
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
    const elements = this.renderRoot.querySelectorAll('[data-grab-scroll]');
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
    if (this._idleTimeout) {
      clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
    }
    // Unsubscribe from queue update events
    this._unsubscribeFromQueueUpdates();
    super.disconnectedCallback?.();
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    if (this._debouncedVolumeTimer) {
      clearTimeout(this._debouncedVolumeTimer);
      this._debouncedVolumeTimer = null;
    }

    if (this._manualSelectTimeout) {
      clearTimeout(this._manualSelectTimeout);
      this._manualSelectTimeout = null;
    }
    if (this._searchTimeoutHandle) {
      clearTimeout(this._searchTimeoutHandle);
      this._searchTimeoutHandle = null;
    }
    this._latestSearchToken = 0;

    this._removeSourceDropdownOutsideHandler();
    this._removeGrabScrollHandlers();
    this._removeSearchSwipeHandlers();
    window.removeEventListener("scroll", this._handleGlobalScroll);
    window.removeEventListener("resize", this._handleViewportResize);
    if (this._adaptiveScrollTimer) {
      clearTimeout(this._adaptiveScrollTimer);
      this._adaptiveScrollTimer = null;
    }
    // Clear tracking properties
    this._lastPlayingEntityId = null;
    this._controlFocusEntityId = null;
    this._teardownAdaptiveTextObserver();
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
  _closeEntityOptions() {
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
        this._searchInputAutoFocused = false;
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
    this._showGrouping = false;
    // No requestUpdate here; overlay close will handle it.
  }
  async _toggleGroup(targetId) {
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;
    if (!masterObj) return;

    const masterGroupId = await this._resolveGroupingEntityId(masterObj, masterId);
    if (!masterGroupId) return;

    const targetObj = this.entityObjs.find(e => e.entity_id === targetId);
    if (!targetObj) return;

    const targetGroupId = await this._resolveGroupingEntityId(targetObj, targetId);
    if (!targetGroupId) return;

    const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
    const grouped =
      Array.isArray(masterState?.attributes?.group_members) &&
      masterState.attributes.group_members.includes(targetGroupId);

    if (grouped) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: targetGroupId,
      });
    } else {
      await this.hass.callService("media_player", "join", {
        entity_id: masterGroupId,
        group_members: [targetGroupId],
      });
    }
    this._lastGroupingMasterId = masterId || targetId;
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
      await this.hass.callService("media_player", "join", {
        entity_id: masterGroupId,
        group_members: toJoin,
      });
    }
    // After grouping, keep the master set if still valid
    this._lastGroupingMasterId = masterId || this.currentEntityId;
    // Remain in grouping sheet
  }

  // Ungroup all members from current master
  async _ungroupAll() {
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;
    if (!masterObj) return;

    const masterGroupId = await this._resolveGroupingEntityId(masterObj, masterId);
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._isGroupCapable(masterState)) return;

    const members = Array.isArray(masterState.attributes?.group_members)
      ? masterState.attributes.group_members
      : [];
    // Only unjoin those that support grouping
    const toUnjoin = members.filter(id => {
      const st = this.hass.states[id];
      return this._isGroupCapable(st);
    });
    // Unjoin each member individually
    for (const id of toUnjoin) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: id,
      });
    }
    // After ungrouping, keep the master set if still valid (may now be solo)
    this._lastGroupingMasterId = masterId || this.currentEntityId;
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
    const masterVolEntity = this._getVolumeEntityForGrouping(masterIdx) || masterGroupId;
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
        const targetVolEntity = this._getVolumeEntityForGrouping(foundIdx) || memberGroupId;
        this.hass.callService("media_player", "volume_set", {
          entity_id: targetVolEntity,
          volume_level: masterVol
        });
      } else {
        // Fallback: if we can't find a configured entity, just try setting volume on the group member ID acting as an entity
        this.hass.callService("media_player", "volume_set", {
          entity_id: memberGroupId,
          volume_level: masterVol
        });
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

  _openMoreInfo() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: this.currentEntityId },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define("yet-another-media-player", YetAnotherMediaPlayerCard);
