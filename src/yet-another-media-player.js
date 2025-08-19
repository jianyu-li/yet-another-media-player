import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import { LitElement, html, css, nothing } from "lit";

import { renderChip, renderGroupChip, createHoldToPinHandler, renderChipRow } from "./chip-row.js";
import { renderActionChipRow } from "./action-chip-row.js";
import { renderControlsRow, countMainControls } from "./controls-row.js";
import { renderVolumeRow } from "./volume-row.js";
import { renderProgressBar } from "./progress-bar.js";
import { yampCardStyles } from "./yamp-card-styles.js";
import { renderSearchSheet, searchMedia, playSearchedMedia } from "./search-sheet.js";
import { YetAnotherMediaPlayerEditor } from "./yamp-editor.js";

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


window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player-beta",
  name: "Yet Another Media Player-beta",
  description: "YAMP is a multi-entity media card with custom actions",
  preview: true
});

class YetAnotherMediaPlayerCard extends LitElement {
  _handleChipPointerDown(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerDown(e, idx);
    }
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
  _debouncedVolumeTimer = null;
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
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
    const controls = countMainControls(stateObj, (s, f) => this._supportsFeature(s, f));
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
    const map = {};
    for (const id of this.entityIds) {
      const key = this._getGroupKey(id);
      if (!map[key]) map[key] = { ids: [], ts: 0 };
      map[key].ids.push(id);
      map[key].ts = Math.max(map[key].ts, this._playTimestamps[id] || 0);
    }
    return Object.values(map)
      .sort((a, b) => b.ts - a.ts)   // sort groups by recency
      .map(g => g.ids.sort());       // sort ids alphabetically inside each group
  }
  static properties = {
    hass: {},
    config: {},
    _selectedIndex: { state: true },
    _lastPlaying: { state: true },
    _shouldDropdownOpenUp: { state: true },
    _pinnedIndex: { state: true },
    _showSourceList: { state: true },
    _holdToPin: { state: true }
  };

  static styles = yampCardStyles;

  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._playTimestamps = {};
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
    // Alternate progress‑bar mode
    this._alternateProgressBar = false;
    // Group base volume for group gain logic
    this._groupBaseVolume = null;
    // Search sheet state variables
    this._searchOpen = false;
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchResults = [];
    this._searchError = "";
    this._searchTotalRows = 15;  // minimum 15 rows for layout padding
    // Per-chip linger map to keep MA entity selected briefly after pause
    this._playbackLingerByIdx = {};
    // Show search-in-sheet flag for entity options sheet
    this._showSearchInSheet = false;
    this._showResolvedEntities = false;
    // Collapse on load if nothing is playing (but respect linger state)
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        // Don't go idle if there's an active linger
        const hasActiveLinger = this._playbackLingerByIdx?.[this._selectedIndex] && 
                               this._playbackLingerByIdx[this._selectedIndex].until > Date.now();
        if (stateObj && stateObj.state !== "playing" && !hasActiveLinger) {
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

  // Resolve template at action time with fallback to main entity (async)
  async _resolveTemplateAtActionTime(templateString, fallbackEntityId) {
    if (!templateString || typeof templateString !== 'string') return fallbackEntityId;

    // Not a template — return as-is
    if (!templateString.includes('{{') && !templateString.includes('{%')) {
      return templateString;
    }

    try {
      const res = await this.hass.callApi('POST', 'template', { template: templateString });
      const out = (res || '').toString().trim();
      // Basic validation: must look like an entity_id
      if (out && /^([a-z_]+)\.[A-Za-z0-9_]+$/.test(out)) return out;
      return fallbackEntityId;
    } catch (error) {
      console.warn('Failed to resolve template:', error);
      return fallbackEntityId; // Fallback to main entity
    }
  }

  /**
   * Attach horizontal swipe on the search‑results area to cycle media‑class filters.
   */
  _attachSearchSwipe() {
    if (this._searchSwipeAttached) return;
    const area = this.renderRoot.querySelector('.entity-options-search-results');
    if (!area) return;
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
        const classes = Array.from(
          new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean))
        );
        const filterOrder = ['all', ...classes];
        const currIdx = filterOrder.indexOf(this._searchMediaClassFilter || 'all');
        const dir = dx < 0 ? 1 : -1;   // swipe left -> next, right -> prev
        let nextIdx = (currIdx + dir + filterOrder.length) % filterOrder.length;
        this._searchMediaClassFilter = filterOrder[nextIdx];
        this.requestUpdate();
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

    // Prefill search state
    this._searchQuery        = artist;
    this._searchError        = "";
    this._searchAttempted    = false;
    this._searchLoading      = false;

    // Render, then run search
    this.requestUpdate();
    this.updateComplete.then(() => this._doSearch());
  }
  // Show search sheet inside entity options
  _showSearchSheetInOptions() {
    this._showSearchInSheet = true;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchAttempted = false;
    this.requestUpdate();
    
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
  _hideSearchSheetInOptions() {
    this._showSearchInSheet = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchAttempted = false;
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
    this._searchLoading = false;
    this.requestUpdate();
  }
  async _doSearch() {
    this._searchAttempted = true;
    if (!this._searchQuery) return;
    this._searchLoading = true;
    this._searchError = "";
    this._searchResults = [];
    this.requestUpdate();
    try {
      const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
      const arr = await searchMedia(this.hass, searchEntityId, this._searchQuery);
      this._searchResults = Array.isArray(arr) ? arr : [];
      // remember how many rows exist in the full ("All") set, but keep at least 15 for layout
      const rows = Array.isArray(this._searchResults) ? this._searchResults.length : 0;
      this._searchTotalRows = Math.max(15, rows);   // keep at least 15
    } catch (e) {
      this._searchError = (e && e.message) || "Unknown error";
      this._searchResults = [];
      this._searchTotalRows = 0;
    }
    this._searchLoading = false;
    this.requestUpdate();
  }
  async _playMediaFromSearch(item) {
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    playSearchedMedia(this.hass, targetEntityId, item);
    // If searching from the bottom sheet, close the entity options overlay.
    if (this._showSearchInSheet) {
      this._closeEntityOptions();
      this._showSearchInSheet = false;
    }
    this._searchCloseSheet();
  }


   // Notify Home Assistant to recalculate layout
  _notifyResize() {
    this.dispatchEvent(new Event("iron-resize", { bubbles: true, composed: true }));
  }

  // Extract dominant color from image
  async _extractDominantColor(imgUrl) {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;
      img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        resolve(`rgb(${r},${g},${b})`);
      };
      img.onerror = function() { resolve("#888"); };
    });
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = config;
    this._holdToPin = !!config.hold_to_pin;
    if (this._holdToPin) {
      this._holdHandler = createHoldToPinHandler({
        onPin: (idx) => this._pinChip(idx),
        onHoldEnd: () => {},
        holdTime: 650,
        moveThreshold: 8
      });
    } else {
      this._holdHandler = null;
    }
    this._selectedIndex = 0;
    this._lastPlaying = null;
    // Set accent color
    
    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    // Collapse card when idle
    this._collapseOnIdle = !!config.collapse_on_idle;
    // Force always-collapsed view
    this._alwaysCollapsed = !!config.always_collapsed;
    // Expand on search option (only available when always_collapsed is true)
    this._expandOnSearch = !!config.expand_on_search;
    // Alternate progress‑bar mode
    this._alternateProgressBar = !!config.alternate_progress_bar;
    // Set idle timeout ms
    this._idleTimeoutMs = typeof config.idle_timeout_ms === "number" ? config.idle_timeout_ms : 60000;
    this._volumeStep = typeof config.volume_step === "number" ? config.volume_step : 0.05;
    // Do not mutate config.force_chip_row here.
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
        const mainIsMA = mainState?.attributes?.supported_features && 
                        (mainState.attributes.supported_features & SUPPORT_GROUPING) !== 0;
        
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
      if (mainState?.state === "playing" && this._lastPlayingEntityIdByChip?.[idx] === mainId) {
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
    if (maState?.state === "playing") return maId;
    if (mainState?.state === "playing") return mainId;
    

    
    // When neither is playing, check if one was recently controlled for this specific chip
    const lastPlayingForChip = this._lastPlayingEntityIdByChip?.[idx];
    if (lastPlayingForChip === maId) return maId;
    if (lastPlayingForChip === mainId) return mainId;
    
    // Default to main entity for consistency
    return mainId;
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
  _getActivePlaybackEntityId() {
    const mainId = this.currentEntityId;
    // Use actual resolved MA entity for active playback detection (can be unconfigured)
    const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    const maState = maId ? this.hass?.states?.[maId] : null;
    
    if (maId === mainId) return mainId;
    
    // Prioritize the entity that is actually playing
    if (mainState?.state === "playing") return mainId;
    if (maState?.state === "playing") return maId;
    
    // When neither is playing, prefer the main entity for consistency
    return mainId;
  }

  // Get the active playback entity for a specific entity index (for follow_active_volume)
  _getActivePlaybackEntityIdForIndex(idx) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    
    const mainId = obj.entity_id;
    // Use actual resolved MA entity for active playback detection (can be unconfigured)
    const maId = this._getActualResolvedMaEntityForState(idx);
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    const maState = maId ? this.hass?.states?.[maId] : null;
    
    if (maId === mainId) return mainId;
    
    // Prioritize the entity that is actually playing
    if (mainState?.state === "playing") return mainId;
    if (maState?.state === "playing") return maId;
    
    // When neither is playing, prefer the main entity for consistency
    return mainId;
  }
  _getGroupingEntityIdByIndex(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj?.entity_id;
    
    // Check if it's a template
    if (typeof obj.music_assistant_entity === 'string' && 
        (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
      // Do not return template strings in non-async paths; fall back to main entity
      return obj.entity_id;
    }
    
    return obj.music_assistant_entity;
  }
  _getGroupingEntityIdByEntityId(entityId) {
    const obj = this.entityObjs.find(o => o.entity_id === entityId);
    if (!obj) return entityId;
    const mae = obj.music_assistant_entity;
    if (typeof mae === 'string' && (mae.includes('{{') || mae.includes('{%'))) {
      return obj.entity_id; // avoid template strings in sync paths
    }
    return mae || obj.entity_id;
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
      console.warn('Failed to resolve music_assistant_entity template:', error);
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
    // Translate raw group member ids (likely MA ids) back to configured entity ids
    const membersConfigured = this.entityIds.filter(otherId => {
      if (otherId === id) return false;
      const otherGroupingId = this._getGroupingEntityIdByEntityId(otherId);
      return membersRaw.includes(otherGroupingId);
    });
    if (!membersConfigured.length) return id;
    const allConfigured = [id, ...membersConfigured].sort();
    return allConfigured[0];
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
    if (!this.hass || !group || group.length < 2) return group[0];
    // If _lastGroupingMasterId is present in this group, prefer it as master
    if (this._lastGroupingMasterId && group.includes(this._lastGroupingMasterId)) {
      return this._lastGroupingMasterId;
    }
    // Evaluate mastery using grouping entities, but return configured entity id
    const candidate = group.find(id => {
      const groupingId = this._getGroupingEntityIdByEntityId(id);
      const st = this.hass.states[groupingId];
      if (!st) return false;
      const members = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];
      return group.every(otherId => {
        if (otherId === id) return true;
        const otherGroupingId = this._getGroupingEntityIdByEntityId(otherId);
        return members.includes(otherGroupingId);
      });
    });
    return candidate || group[0];
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
    return this._getActivePlaybackEntityId();
  }

  get currentActivePlaybackStateObj() {
    const id = this.currentActivePlaybackEntityId;
    return id ? this.hass?.states?.[id] : null;
  }

  get currentVolumeStateObj() {
    const entityId = this._getVolumeEntity(this._selectedIndex);
    return entityId ? this.hass.states[entityId] : null;
  }

  updated(changedProps) {
    if (this.hass && this.entityIds) {
      // Update timestamps for playing entities
      this.entityIds.forEach((id, idx) => {
        const activeEntityId = this._getEntityForPurpose(idx, 'sorting');
        if (activeEntityId) {
          const activeState = this.hass.states[activeEntityId];
          if (activeState && activeState.state === "playing") {
            this._playTimestamps[id] = Date.now();
          }
        }
      });

      // If manual‑select is active (no pin) and a *new* entity begins playing,
      // clear manual mode so auto‑switching resumes.
      if (this._manualSelect && this._pinnedIndex === null && this._manualSelectPlayingSet) {
        // Remove any entities from the snapshot that are no longer playing.
        for (const id of [...this._manualSelectPlayingSet]) {
          const stSnap = this.hass.states[id];
          if (!(stSnap && stSnap.state === "playing")) {
            this._manualSelectPlayingSet.delete(id);
          }
        }
        for (const id of this.entityIds) {
          const st = this.hass.states[id];
          if (st && st.state === "playing" && !this._manualSelectPlayingSet.has(id)) {
            this._manualSelect = false;
            this._manualSelectPlayingSet = null;
            break;
          }
        }
      }

      // Auto-switch unless manually pinned
      if (!this._manualSelect) {
        // Switch to most recent if applicable
        const sortedIds = this.sortedEntityIds;
        if (sortedIds.length > 0) {
          const mostRecentId = sortedIds[0];
          const mostRecentState = this.hass.states[mostRecentId];
          if (
            mostRecentState &&
            mostRecentState.state === "playing" &&
            this.entityIds[this._selectedIndex] !== mostRecentId
          ) {
            this._selectedIndex = this.entityIds.indexOf(mostRecentId);
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
    if (playbackState && playbackState.state === "playing" && playbackState.attributes.media_duration) {
      this._progressTimer = setInterval(() => {
        this.requestUpdate();
      }, 500);
    }

    // Update idle state after all other state checks
    this._updateIdleState();

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
    this._addVerticalGrabScroll('.floating-source-index');

    // Autofocus the in-sheet search box when opening the search in entity options
    if (this._showSearchInSheet) {
      // Use a longer delay when expand on search is enabled to allow for card expansion
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
        // Only scroll filter chip row to start if the set of chips has changed
        const classes = Array.from(
          new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean))
        );
        const classStr = classes.join(",");
        if (this._lastSearchChipClasses !== classStr) {
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
        this._attachSearchSwipe();
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
          if (st && st.state === "playing") {
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
          this._showEntityOptions = true;
          this._showSearchInSheet = true;
          this._searchError = "";
          this._searchResults = [];
          this._searchQuery = "";
          this._searchAttempted = false;
          this.requestUpdate();
          
          // Force layout update for expand on search
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
        default:
          // Do nothing for unknown menu_item
          break;
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
    this.hass.callService(domain, service, data);
  }

  async _onControlClick(action) {
    // Use the unified entity resolution system for control actions
    const targetEntity = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    if (!targetEntity) return;
    
    const stateObj = this.hass?.states?.[targetEntity] || this.currentStateObj;
    

    
    switch (action) {
      case "play_pause":
        if (stateObj?.state === "playing") {
          this.hass.callService("media_player", "media_pause", { entity_id: targetEntity });
          // When pausing, set the last playing entity to the one we just paused (per-chip)
          if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
          this._lastPlayingEntityIdByChip[this._selectedIndex] = targetEntity;
          // Lock controls to this entity during the paused window
          this._controlFocusEntityId = targetEntity;
          // Optimistic toggle to reduce flicker
          this._optimisticPlayback = { entity_id: targetEntity, state: "paused", ts: Date.now() };
          this.requestUpdate();
          setTimeout(() => { this._optimisticPlayback = null; this.requestUpdate(); }, 1200);
        } else {
          this.hass.callService("media_player", "media_play", { entity_id: targetEntity });
          // On resume, lock to the target entity immediately (per-chip)
          if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
          this._lastPlayingEntityIdByChip[this._selectedIndex] = targetEntity;
          // Maintain focus lock until an entity reports playing
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
    }
  }

  /**
   * Handles volume change events.
   * With group_volume: false, always sets only the single volume entity, never the group.
   * With group_volume: true/undefined, applies group logic.
   */
  async _onVolumeChange(e) {
    const idx = this._selectedIndex;
    const groupingEntityTemplate = this._getGroupingEntityIdByIndex(idx);
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
                console.warn('Failed to resolve template for volume change:', error);
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

      const groupingEntityTemplate = this._getGroupingEntityIdByIndex(idx);
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
                  console.warn('Failed to resolve template for volume step:', error);
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

    const groupingEntityTemplate = this._getGroupingEntityIdByIndex(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];

    if (Array.isArray(state?.attributes?.group_members) && state.attributes.group_members.length) {
      // Grouped: apply mute to all group members
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [mainEntity, ...state.attributes.group_members];
      
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
                console.warn('Failed to resolve template for mute toggle:', error);
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
    // For seeking, we want to target the entity that is actually playing
    const mainId = this.currentEntityId;
    const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const mainState = mainId ? this.hass?.states?.[mainId] : null;
    const maState = maId ? this.hass?.states?.[maId] : null;
    
    let targetEntity;
    if (this._controlFocusEntityId && (this._controlFocusEntityId === maId || this._controlFocusEntityId === mainId)) {
      targetEntity = this._controlFocusEntityId;
    } else if (maState?.state === "playing") {
      targetEntity = maId;
    } else if (mainState?.state === "playing") {
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
    if (!targetEntity || !stateObj) return;
    const duration = stateObj.attributes.media_duration;
    if (!duration) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = Math.floor(percent * duration);

    if (stateObj.state === "playing") {
      // Optimistically update local progress position for smooth UI
      stateObj.attributes.media_position = seekTime;
      stateObj.attributes.media_position_updated_at = new Date().toISOString();
      this.requestUpdate();
    }

    this.hass.callService("media_player", "media_seek", { entity_id: targetEntity, seek_position: seekTime });
  }

    render() {
      if (!this.hass || !this.config) return nothing;
      
      if (this.shadowRoot && this.shadowRoot.host) {
        this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      }
      
      const showChipRow = this.config.show_chip_row || "auto";
      const stateObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
      if (!stateObj) return html`<div class="details">Entity not found.</div>`;

      // Collect unique, sorted first letters of source names
      const sourceList = stateObj.attributes.source_list || [];
      const sourceLetters = Array.from(new Set(sourceList.map(s => (s && s[0] ? s[0].toUpperCase() : ""))))
        .filter(l => l && /^[A-Z]$/.test(l))
        .sort();

      // Idle image "picture frame" mode when idle
      let idleImageUrl = null;
      if (
        this.config.idle_image &&
        this._isIdle &&
        this.hass.states[this.config.idle_image]
      ) {
        const sensorState = this.hass.states[this.config.idle_image];
        idleImageUrl =
          sensorState.attributes.entity_picture ||
          (sensorState.state && sensorState.state.startsWith("http") ? sensorState.state : null);
      }
      const dimIdleFrame = !!idleImageUrl;
      const hideControlsNow = this._isIdle;
      const shouldDimIdle = dimIdleFrame && this._isIdle;

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
        

      // If MA just transitioned from playing -> not playing, start a linger window (30s)
      if (prevMa === "playing" && this._lastMaState !== "playing") {
        this._playbackLingerByIdx[idx] = {
          entityId: actualResolvedMaId,
          until: Date.now() + 30000,
        };
        
      }
              // Also set linger when MA entity is paused (regardless of previous state) to ensure UI stays on MA

        // Set linger when MA entity transitions to paused OR when main entity transitions to paused and was last controlled
        const shouldSetLinger = (prevMa === "playing" && this._lastMaState === "paused" && this._lastPlayingEntityIdByChip?.[idx] === actualResolvedMaId) ||
                               (prevMain === "playing" && this._lastMainState === "paused" && this._lastPlayingEntityIdByChip?.[idx] === mainStateForPlayback?.entity_id);
        
        if (shouldSetLinger) {
          // Use the last controlled entity for the linger (main entity if main was controlled, MA entity if MA was controlled)
          const lingerEntityId = this._lastPlayingEntityIdByChip[idx];
          this._playbackLingerByIdx[idx] = {
            entityId: lingerEntityId, // Use cached MA entity or last controlled entity
            until: Date.now() + 30000,
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
      const shuffleActive = !!finalPlaybackStateObj.attributes.shuffle;
      const repeatActive = finalPlaybackStateObj.attributes.repeat && finalPlaybackStateObj.attributes.repeat !== "off";

      // Artwork and idle logic
      const isPlaying = !this._isIdle && effState === "playing";
      // Artwork keeps using the visible main entity's artwork when available; fallback to playback entity if main has none
      const mainState = this.currentStateObj;
      const isRealArtwork = !this._isIdle && isPlaying && (
        (mainState && (mainState.attributes.entity_picture || mainState.attributes.album_art)) ||
        (playbackStateObj && (playbackStateObj.attributes.entity_picture || playbackStateObj.attributes.album_art))
      );
      const art = isRealArtwork
        ? ((mainState && (mainState.attributes.entity_picture || mainState.attributes.album_art))
            || (playbackStateObj && (playbackStateObj.attributes.entity_picture || playbackStateObj.attributes.album_art)))
        : null;
      // Details
      const title = isPlaying ? ((finalPlaybackStateObj.attributes.media_title || mainState?.attributes?.media_title || "")) : "";
      const artist = isPlaying
        ? (
            finalPlaybackStateObj.attributes.media_artist ||
            finalPlaybackStateObj.attributes.media_series_title ||
            finalPlaybackStateObj.attributes.app_name ||
            mainState?.attributes?.media_artist ||
            mainState?.attributes?.media_series_title ||
            mainState?.attributes?.app_name ||
            ""
          )
        : "";
      let pos = finalPlaybackStateObj.attributes.media_position || 0;
      const duration = finalPlaybackStateObj.attributes.media_duration || 0;
      if (isPlaying) {
        const updatedAt = finalPlaybackStateObj.attributes.media_position_updated_at
          ? Date.parse(finalPlaybackStateObj.attributes.media_position_updated_at)
          : Date.parse(finalPlaybackStateObj.last_changed);
        const elapsed = (Date.now() - updatedAt) / 1000;
        pos += elapsed;
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
      // Use null if idle or no artwork available
      let artworkUrl = null;
      if (!this._isIdle) {
        const getArt = (st) => st && (st.attributes.entity_picture || st.attributes.album_art);
        // Use the unified entity resolution system for artwork
        artworkUrl = getArt(playbackStateObj) || getArt(mainState) || null;
      }

      // Dominant color extraction for collapsed artwork
      if (collapsed && artworkUrl && artworkUrl !== this._lastArtworkUrl) {
        this._extractDominantColor(artworkUrl).then(color => {
          this._collapsedArtDominantColor = color;
          this.requestUpdate();
        });
        this._lastArtworkUrl = artworkUrl;
      }

      return html`
        <ha-card class="yamp-card" style="position:relative;">
          <div
            style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column;"
            data-match-theme="${String(this.config.match_theme === true)}"
            class="${shouldDimIdle ? 'dim-idle' : ''}"
          >
            ${(this.entityObjs.length > 1 || showChipRow === "always") ? html`
                <div class="chip-row">
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
                      
                      // Use the unified entity resolution system
                      const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
                      const playbackState = this.hass?.states?.[playbackEntityId];
                      const anyPlaying = playbackState?.state === "playing";
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
                      return playbackState?.attributes?.entity_picture || 
                             playbackState?.attributes?.album_art || 
                             mainState?.attributes?.entity_picture || 
                             mainState?.attributes?.album_art || null;
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
                             playbackState?.state === "playing";
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
                    onPointerUp: (e, idx) => this._handleChipPointerUp(e, idx)
                  })}
                </div>
            ` : nothing}
            ${renderActionChipRow({
              actions: this.config.actions,
              onActionChipClick: (idx) => this._onActionChipClick(idx)
            })}
            <div class="card-lower-content-container">
              <div class="card-lower-content-bg"
                style="
                  background-image: ${
                    idleImageUrl
                      ? `url('${idleImageUrl}')`
                      : artworkUrl
                        ? `url('${artworkUrl}')`
                        : "none"
                  };
                  min-height: ${collapsed ? (hideControlsNow ? "120px" : "0px") : "320px"};
                  background-size: cover;
                  background-position: top center;
                  background-repeat: no-repeat;
                  filter: ${collapsed && artworkUrl ? "blur(18px) brightness(0.7) saturate(1.15)" : "none"};
                  transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s;
                "
              ></div>
              ${!dimIdleFrame ? html`<div class="card-lower-fade"></div>` : nothing}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}" style="${collapsed && hideControlsNow ? 'min-height: 120px;' : ''}">
                ${collapsed && artworkUrl ? html`
                  <div class="collapsed-artwork-container"
                       style="background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%);">
                    <img class="collapsed-artwork" src="${artworkUrl}" />
                  </div>
                ` : nothing}
                ${!collapsed
                  ? html`<div class="card-artwork-spacer"></div>`
                  : nothing
                }
                ${(!collapsed && !artworkUrl && !idleImageUrl) ? html`
                  <div class="media-artwork-placeholder"
                    style="
                      position: absolute;
                      left: 50%; top: 36px;
                      transform: translateX(-50%);
                      width: 184px; height: 184px;
                      display: flex; align-items: center; justify-content: center;
                      background: none;
                      z-index: 2;">
                    <svg width="184" height="184" viewBox="0 0 184 184"
                      style="display:block;opacity:0.85;${this.config.match_theme === true ? 'color:#fff;' : `color:${this._customAccent};`}"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"/>
                      <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"/>
                      <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"/>
                      <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"/>
                    </svg>
                  </div>
                ` : nothing}
                <div class="details">
                  <div class="title">
                    ${isPlaying ? title : ""}
                  </div>
                  ${isPlaying && artist ? html`
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
                          accent: this._customAccent
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
                      accent: this._customAccent
                    })
                  : nothing
                }
                ${!hideControlsNow ? html`
                ${renderControlsRow({
                  stateObj: playbackStateObj,
                  showStop: this._shouldShowStopButton(playbackStateObj),
                  shuffleActive,
                  repeatActive,
                  onControlClick: (action) => this._onControlClick(action),
                  supportsFeature: (state, feature) => this._supportsFeature(state, feature)
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
                  moreInfoMenu: html`
                    <div class="more-info-menu">
                      <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                        <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                      </button>
                    </div>
                  `,
                })}
                ` : nothing}
                ${hideControlsNow ? html`
                  <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: 10;">
                    <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                      <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                    </button>
                  </div>
                ` : nothing}
              </div>
            </div>
          </div>
          ${this._showEntityOptions ? html`
          <div class="entity-options-overlay" @click=${(e) => this._closeEntityOptions(e)}>
            <div class="entity-options-sheet" @click=${e => e.stopPropagation()}>
              ${(!this._showGrouping && !this._showSourceList && !this._showSearchInSheet && !this._showResolvedEntities) ? html`
                <div class="entity-options-menu" style="display:flex; flex-direction:column; margin-top:auto; margin-bottom:20px;">
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
                  ${Array.isArray(this.currentStateObj?.attributes?.source_list) &&
                    this.currentStateObj.attributes.source_list.length > 0 ? html`
                      <button class="entity-options-item" @click=${() => this._openSourceList()}>Source</button>
                    ` : nothing}
                  ${
                    (() => {
                      const totalEntities = this.entityIds.length;
                      const groupableCount = this.entityIds.reduce((acc, id) => {
                        const obj = this.entityObjs.find(e => e.entity_id === id);
                        if (!obj) return acc;
                        
                        // Use cached resolved entity for feature checking
                        const idx = this.entityIds.indexOf(id);
                        const cached = this._maResolveCache?.[idx]?.id;
                        let actualGroupId;
                        
                        if (obj.music_assistant_entity) {
                          if (typeof obj.music_assistant_entity === 'string' && 
                              (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
                            // For templates, use cached resolved entity
                            actualGroupId = cached || obj.entity_id;
                          } else {
                            actualGroupId = obj.music_assistant_entity;
                          }
                        } else {
                          actualGroupId = obj.entity_id;
                        }
                        
                        const st = this.hass.states[actualGroupId];
                        return acc + (this._supportsFeature(st, SUPPORT_GROUPING) ? 1 : 0);
                      }, 0);
                      
                      // Check current entity's grouping support
                      const currObj = this.entityObjs[this._selectedIndex];
                      let currGroupId;
                      if (currObj?.music_assistant_entity) {
                        if (typeof currObj.music_assistant_entity === 'string' && 
                            (currObj.music_assistant_entity.includes('{{') || currObj.music_assistant_entity.includes('{%'))) {
                          // For templates, use cached resolved entity
                          const cached = this._maResolveCache?.[this._selectedIndex]?.id;
                          currGroupId = cached || currObj.entity_id;
                        } else {
                          currGroupId = currObj.music_assistant_entity;
                        }
                      } else {
                        currGroupId = currObj?.entity_id;
                      }
                      
                      const currGroupState = this.hass.states[currGroupId];
                      if (
                        totalEntities > 1 &&
                        groupableCount > 1 &&
                        this._supportsFeature(currGroupState, SUPPORT_GROUPING)
                      ) {
                        return html`
                          <button class="entity-options-item" @click=${() => this._openGrouping()}>Group Players</button>
                        `;
                      }
                      return nothing;
                    })()
                  }
                  <button class="entity-options-item" @click=${() => this._closeEntityOptions()}>Close</button>
                </div>
              ` : this._showResolvedEntities ? html`
                <button class="entity-options-item" @click=${() => {
                  this._showResolvedEntities = false;
                  this.requestUpdate();
                }} style="margin-bottom:14px;">&larr; Back</button>
                <div class="entity-options-resolved-entities" style="margin-top:12px;">
                  <div class="entity-options-title">Select Entity for More Info</div>
                  <div class="entity-options-resolved-entities-list">
                    ${this._getResolvedEntitiesForCurrentChip().map(entityId => {
                      const state = this.hass?.states?.[entityId];
                      const name = state?.attributes?.friendly_name || entityId;
                      const icon = state?.attributes?.icon || "mdi:help-circle";
                      
                      // Determine the role of this entity
                      const idx = this._selectedIndex;
                      const obj = this.entityObjs[idx];
                      let role = "Main Entity";
                      
                      if (obj) {
                        const maEntity = this._getActualResolvedMaEntityForState(idx);
                        const volEntity = this._getVolumeEntity(idx);
                        
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
                            <div>${name}</div>
                            <div style="font-size: 0.85em; opacity: 0.7;">${role}</div>
                          </div>
                        </button>
                      `;
                    })}
                  </div>
                </div>
              ` : this._showSearchInSheet ? html`
                <div class="entity-options-search" style="margin-top:12px;">
                  <div class="entity-options-search-row">
                      <input
                        type="text"
                        id="search-input-box"
                        autofocus
                        class="entity-options-search-input"
                        .value=${this._searchQuery}
                        @input=${e => { this._searchQuery = e.target.value; this.requestUpdate(); }}
                        @keydown=${e => {
                          if (e.key === "Enter") { e.preventDefault(); this._doSearch(); }
                          else if (e.key === "Escape") { e.preventDefault(); this._hideSearchSheetInOptions(); }
                        }}
                        placeholder="Search music..."
                        style="flex:1; min-width:0; font-size:1.1em;"
                      />
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._doSearch()}
                      ?disabled=${this._searchLoading || !this._searchQuery}>
                      Search
                    </button>
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._hideSearchSheetInOptions()}>
                      Cancel
                    </button>
                  </div>
                  <!-- FILTER CHIPS -->
                  ${(() => {
                    const classes = Array.from(new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean)));
                    const filter = this._searchMediaClassFilter || "all";
                    if (classes.length < 2) return nothing;
                    return html`
                      <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center;">
                        <button
                          class="chip"
                          style="
                            width: 72px;
                            background: ${filter === 'all' ? this._customAccent : '#282828'};
                            opacity: ${filter === 'all' ? '1' : '0.8'};
                            font-weight: ${filter === 'all' ? 'bold' : 'normal'};
                          "
                          ?selected=${filter === 'all'}
                          @click=${() => { this._searchMediaClassFilter = "all"; this.requestUpdate(); }}
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
                            @click=${() => { this._searchMediaClassFilter = c; this.requestUpdate(); }}
                          >
                            ${c.charAt(0).toUpperCase() + c.slice(1)}
                          </button>
                        `)}
                      </div>
                    `;
                  })()}
                  ${this._searchLoading ? html`<div class="entity-options-search-loading">Loading...</div>` : nothing}
                  ${this._searchError ? html`<div class="entity-options-search-error">${this._searchError}</div>` : nothing}
                  <div class="entity-options-search-results">
                    ${(() => {
                      const filter     = this._searchMediaClassFilter || "all";
                      const allResults = this._searchResults || [];
                      const filteredResults = filter === "all"
                        ? allResults
                        : allResults.filter(item => item.media_class === filter);
                      // Build padded array so row‑count stays constant
                      const totalRows = Math.max(15, this._searchTotalRows || allResults.length);
                      const paddedResults = [
                        ...filteredResults,
                        ...Array.from({ length: Math.max(0, totalRows - filteredResults.length) }, () => null)
                      ];
                      // Always render paddedResults, even before first search
                      return (this._searchAttempted && filteredResults.length === 0 && !this._searchLoading)
                        ? html`<div class="entity-options-search-empty">No results.</div>`
                        : paddedResults.map(item => item ? html`
                            <!-- EXISTING non‑placeholder row markup -->
                            <div class="entity-options-search-result">
                              <img
                                class="entity-options-search-thumb"
                                src=${item.thumbnail}
                                alt=${item.title}
                                style="height:38px;width:38px;object-fit:cover;border-radius:5px;margin-right:12px;"
                              />
                              <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
                                <span>${item.title}</span>
                                <span style="font-size:0.86em; color:#bbb; line-height:1.16; margin-top:2px;">
                                  ${item.media_class
                                    ? (item.media_class.charAt(0).toUpperCase() + item.media_class.slice(1))
                                    : ""}
                                </span>
                              </div>
                              <button class="entity-options-search-play" @click=${() => this._playMediaFromSearch(item)}>
                                ▶
                              </button>
                            </div>
                          ` : html`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `);
                    })()}
                  </div>
                </div>
              ` : this._showGrouping ? html`
                <button class="entity-options-item" @click=${() => this._closeGrouping()} style="margin-bottom:14px;">&larr; Back</button>
                ${
                  (() => {
                    const masterGroupId = this._getGroupingEntityIdByIndex(this._selectedIndex);
                    const masterState = this.hass.states[masterGroupId];
                    const groupedAny = Array.isArray(masterState?.attributes?.group_members) && masterState.attributes.group_members.length > 0;
                    return html`
                      <div style="display:flex;align-items:center;justify-content:space-between;font-weight:600;margin-bottom:0;">
                        ${groupedAny ? html`
                          <button class="entity-options-item"
                            @click=${() => this._syncGroupVolume()}
                            style="color:#fff; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 16px 2px 0;">
                            Sync Volume
                          </button>
                        ` : html`<span></span>`}
                        <button class="entity-options-item"
                          @click=${() => groupedAny ? this._ungroupAll() : this._groupAll()}
                          style="color:#fff; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 0 2px 8px;">
                          ${groupedAny ? "Ungroup All" : "Group All"}
                        </button>
                      </div>
                    `;
                  })()
                }
                <hr style="margin:8px 0 2px 0;opacity:0.19;border:0;border-top:1px solid #fff;" />
                ${
                  (() => {
                    // --- Begin new group player rows logic, wrapped in scrollable container ---
                    const masterId = this.currentEntityId;
                    
                    // Build list of entities to show in group players menu
                    // Prioritize Music Assistant entities when available, fall back to main entities only if they support grouping
                    const groupPlayerIds = [];
                    
                    for (const id of this.entityIds) {
                      const obj = this.entityObjs.find(e => e.entity_id === id);
                      if (!obj) continue;
                      
                      let entityToCheck = null;
                      let entityName = null;
                      
                      // First, check if there's a Music Assistant entity configured
                      if (obj.music_assistant_entity) {
                        let maEntityId;
                        if (typeof obj.music_assistant_entity === 'string' && 
                            (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
                          // For templates, use the cached resolved entity
                          const idx = this.entityIds.indexOf(id);
                          const cached = this._maResolveCache?.[idx]?.id;
                          maEntityId = cached || obj.entity_id;
                        } else {
                          maEntityId = obj.music_assistant_entity;
                        }
                        
                        const maState = this.hass.states[maEntityId];
                        if (maState && this._supportsFeature(maState, SUPPORT_GROUPING)) {
                          entityToCheck = maEntityId;
                          entityName = id; // Use main entity name for display
                        }
                      }
                      
                      // If no MA entity supports grouping, check main entity
                      if (!entityToCheck) {
                        const mainState = this.hass.states[id];
                        if (mainState && this._supportsFeature(mainState, SUPPORT_GROUPING)) {
                          entityToCheck = id;
                          entityName = id;
                        }
                      }
                      
                      // Add to list if we found a valid grouping entity
                      if (entityToCheck && entityName) {
                        groupPlayerIds.push({ id: entityName, groupId: entityToCheck });
                      }
                    }
                    
                    // Sort with master first
                    const masterFirst = groupPlayerIds.find(item => item.id === masterId);
                    const others = groupPlayerIds.filter(item => item.id !== masterId);
                    const sortedGroupIds = masterFirst ? [masterFirst, ...others] : groupPlayerIds;
                    
                    return html`
                      <div class="group-list-scroll" style="overflow-y: auto; max-height: 340px;">
                        ${sortedGroupIds.map(item => {
                          const id = item.id;
                          const actualGroupId = item.groupId;
                          const obj = this.entityObjs.find(e => e.entity_id === id);
                          if (!obj) return nothing;
                          const name = this.getChipName(id);
                          
                          // Get the master's resolved MA entity for proper comparison
                          const masterObj = this.entityObjs[this._selectedIndex];
                          let masterGroupId;
                          if (masterObj?.music_assistant_entity) {
                            if (typeof masterObj.music_assistant_entity === 'string' && 
                                (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
                              // For templates, use cached resolved entity
                              const cached = this._maResolveCache?.[this._selectedIndex]?.id;
                              masterGroupId = cached || masterObj.entity_id;
                            } else {
                              masterGroupId = masterObj.music_assistant_entity;
                            }
                          } else {
                            masterGroupId = masterObj?.entity_id;
                          }
                          
                          const masterState = this.hass.states[masterGroupId];
                          const grouped =
                            actualGroupId === masterGroupId
                              ? true
                              : (
                                Array.isArray(masterState.attributes.group_members) &&
                                masterState.attributes.group_members.includes(actualGroupId)
                              );
                          // Use unified entity resolution for grouping menu
                          const entityIdx = this.entityIds.indexOf(id);
                          const volumeEntity = this._getEntityForPurpose(entityIdx, 'grouping_control');
                          // For group players menu, use the same entity for both control and display
                          const displayEntity = volumeEntity;
                          const displayVolumeState = this.hass.states[displayEntity];
                          
                          const isRemoteVol = displayEntity.startsWith && displayEntity.startsWith("remote.");
                          const volVal = Number(displayVolumeState?.attributes?.volume_level || 0);
                          return html`
                            <div style="
                              display: flex;
                              align-items: center;
                              padding: 6px 4px;
                            ">
                              <span style="
                                display:inline-block;
                                width: 140px;
                                min-width: 100px;
                                max-width: 160px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                              ">${name}</span>
                              <div style="flex:1;display:flex;align-items:center;gap:9px;margin:0 10px;">
                                ${
                                  isRemoteVol
                                    ? html`
                                        <div class="vol-stepper">
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, -1)} title="Vol Down">–</button>
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, 1)} title="Vol Up">+</button>
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
                                          @change=${e => this._onGroupVolumeChange(id, volumeEntity, e)}
                                          title="Volume"
                                          style="width:100%;max-width:260px;"
                                        />
                                      `
                                }
                                <span style="min-width:34px;display:inline-block;text-align:right;">${typeof volVal === "number" ? Math.round(volVal * 100) + "%" : "--"}</span>
                              </div>
                              ${
                                actualGroupId === masterGroupId
                                  ? html`
                                      <button class="group-toggle-btn group-toggle-transparent"
                                              disabled
                                              aria-label="Master"
                                              style="margin-left:14px;"></button>
                                    `
                                  : html`
                                      <button class="group-toggle-btn"
                                              @click=${() => this._toggleGroup(id)}
                                              title=${grouped ? "Unjoin" : "Join"}
                                              style="margin-left:14px;">
                                        <span class="group-toggle-fix">${grouped ? "–" : "+"}</span>
                                      </button>
                                    `
                              }
                            </div>
                          `;
                        })}
                      </div>
                    `;
                    // --- End new group player rows logic ---
                  })()
                }
              ` : html`
                <button class="entity-options-item" @click=${() => this._closeSourceList()} style="margin-bottom:14px;">&larr; Back</button>
                <div class="entity-options-sheet source-list-sheet" style="position:relative;">
                  <div class="source-list-scroll" style="overflow-y:auto;max-height:340px;">
                    ${sourceList.map(src => html`
                      <div class="entity-options-item" data-source-name="${src}" @click=${() => this._selectSource(src)}>${src}</div>
                    `)}
                  </div>
                </div>
                <div class="floating-source-index">
                  ${sourceLetters.map((letter, i) => {
                    const hovered = this._hoveredSourceLetterIndex;
                    let scale = "";
                    if (hovered !== null && hovered !== undefined) {
                      const dist = Math.abs(hovered - i);
                      if (dist === 0) scale = "max";
                      else if (dist === 1) scale = "large";
                      else if (dist === 2) scale = "med";
                    }
                    return html`
                      <button
                        class="source-index-letter"
                        data-scale=${scale}
                        @mouseenter=${() => { this._hoveredSourceLetterIndex = i; this.requestUpdate(); }}
                        @mouseleave=${() => { this._hoveredSourceLetterIndex = null; this.requestUpdate(); }}
                        @click=${() => this._scrollToSourceLetter(letter)}
                      >
                        ${letter}
                      </button>
                    `;
                  })}
                </div>
              `}
            </div>
          </div>
        ` : nothing}
          ${this._searchOpen
            ? renderSearchSheet({
                open: this._searchOpen,
                query: this._searchQuery,
                loading: this._searchLoading,
                results: this._searchResults,
                error: this._searchError,
                onClose: () => this._searchCloseSheet(),
                onQueryInput: e => {
                  this._searchQuery = e.target.value;
                  this.requestUpdate();
                },
                onSearch: () => this._doSearch(),
                onPlay: item => this._playMediaFromSearch(item),
              })
            : nothing}
        </ha-card>
      `;
    }
    
    _updateIdleState() {
      // Check if ANY relevant entity (main or MA) is playing
      const mainState = this.currentStateObj;
      // Use actual resolved MA entity for state detection (can be unconfigured)
      const actualMaId = this._getActualResolvedMaEntityForState(this._selectedIndex);
      const actualMaState = actualMaId ? this.hass?.states?.[actualMaId] : null;
      const isAnyPlaying = (mainState?.state === "playing") || (actualMaState?.state === "playing");
      
      if (isAnyPlaying) {
        // Became active, clear timer and set not idle
        if (this._idleTimeout) clearTimeout(this._idleTimeout);
        this._idleTimeout = null;
        if (this._isIdle) {
          this._isIdle = false;
          this.requestUpdate();
        }
      } else {
        // Only set timer if not already idle and not already waiting, and idle_timeout_ms > 0
        // Also check if there's an active linger - don't go idle if there's a linger
        const hasActiveLinger = this._playbackLingerByIdx?.[this._selectedIndex] && 
                               this._playbackLingerByIdx[this._selectedIndex].until > Date.now();
        if (!this._isIdle && !this._idleTimeout && this._idleTimeoutMs > 0 && !hasActiveLinger) {
          this._idleTimeout = setTimeout(() => {
            this._isIdle = true;
            this._idleTimeout = null;
            this.requestUpdate();
          }, this._idleTimeoutMs);
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
                { value: "always", label: "Always" }
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
        }
      ];
    }

  firstUpdated() {
    super.firstUpdated?.();
    // Trap scroll events inside floating index so they don't scroll the page
    const index = this.renderRoot.querySelector('.floating-source-index');
    if (index) {
      index.addEventListener('wheel', function(e) {
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


    this._removeSourceDropdownOutsideHandler();
    this._removeGrabScrollHandlers();
    this._removeSearchSwipeHandlers();
    // Clear tracking properties
    this._lastPlayingEntityId = null;
    this._controlFocusEntityId = null;
  }
  // Entity options overlay handlers
  _closeEntityOptions() {
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
      this.requestUpdate();
    }
  }

  async _openEntityOptions() {
    // Resolve all templates before opening the menu so feature checking works correctly
    for (let i = 0; i < this.entityObjs.length; i++) {
      await this._ensureResolvedMaForIndex(i);
    }
    this._showEntityOptions = true;
    this.requestUpdate();
  }

  // Deprecated: _triggerMoreInfo is replaced by _openMoreInfo for clarity.


  // Grouping Helper Methods 
  _openGrouping() {
    this._showEntityOptions = true;  // ensure the overlay is visible
    this._showGrouping = true;       // show grouping sheet immediately
    // Remember the current entity as the last grouping master
    this._lastGroupingMasterId = this.currentEntityId;
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
    // After closing, try to keep the master chip selected if still valid
    const groups = this.groupedSortedEntityIds;
    let masterId = this._lastGroupingMasterId;
    // Find the group that contains the last grouping master, if any
    const group = groups.find(g => masterId && g.includes(masterId));
    if (group && group.length > 1) {
      const master = this._getActualGroupMaster(group);
      const idx = this.entityIds.indexOf(master);
      if (idx >= 0) this._selectedIndex = idx;
    }
    // No requestUpdate here; overlay close will handle it.
  }
  async _toggleGroup(targetId) {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && 
          (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }
    
    // Get the target entity's resolved MA entity for grouping
    const targetObj = this.entityObjs.find(e => e.entity_id === targetId);
    if (!targetObj) return;
    
    let targetGroupId;
    if (targetObj.music_assistant_entity) {
      if (typeof targetObj.music_assistant_entity === 'string' && 
          (targetObj.music_assistant_entity.includes('{{') || targetObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        targetGroupId = await this._resolveTemplateAtActionTime(targetObj.music_assistant_entity, targetId);
      } else {
        targetGroupId = targetObj.music_assistant_entity;
      }
    } else {
      targetGroupId = targetId;
    }
    
    if (!masterGroupId || !targetGroupId) return;

    const masterState = this.hass.states[masterGroupId];
    const grouped =
      Array.isArray(masterState?.attributes.group_members) &&
      masterState.attributes.group_members.includes(targetGroupId);

    if (grouped) {
      // Unjoin the target from the group
      await this.hass.callService("media_player", "unjoin", {
        entity_id: targetGroupId,
      });
    } else {
      // Join the target player to the master's group
      await this.hass.callService("media_player", "join", {
        entity_id: masterGroupId,          // call on the master
        group_members: [targetGroupId],    // player(s) to add
      });
    }
    // Keep sheet open for more grouping actions
  }


  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor-beta");
  }
  static getStubConfig(hass, entities) {
    return { entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2) };
  }

  // Group all supported entities to current master
  async _groupAll() {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && 
          (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;

    // Get all other entities that support grouping and are not already grouped with master
    const alreadyGrouped = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];
    
    // Build list of resolved MA entities to join
    const toJoin = [];
    for (const id of this.entityIds) {
      if (id === this.currentEntityId) continue;
      
      const obj = this.entityObjs.find(e => e.entity_id === id);
      if (!obj) continue;
      
      let resolvedGroupId;
      if (obj.music_assistant_entity) {
        if (typeof obj.music_assistant_entity === 'string' && 
            (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
          // For templates, resolve at action time
          resolvedGroupId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, id);
        } else {
          resolvedGroupId = obj.music_assistant_entity;
        }
      } else {
        resolvedGroupId = id;
      }
      
      const st = this.hass.states[resolvedGroupId];
      if (this._supportsFeature(st, SUPPORT_GROUPING) && !alreadyGrouped.includes(resolvedGroupId)) {
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
    this._lastGroupingMasterId = this.currentEntityId;
    // Remain in grouping sheet
  }

  // Ungroup all members from current master
  async _ungroupAll() {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && 
          (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;

    const members = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];
    // Only unjoin those that support grouping
    const toUnjoin = members.filter(id => {
      const st = this.hass.states[id];
      return this._supportsFeature(st, SUPPORT_GROUPING);
    });
    // Unjoin each member individually
    for (const id of toUnjoin) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: id,
      });
    }
    // After ungrouping, keep the master set if still valid (may now be solo)
    this._lastGroupingMasterId = this.currentEntityId;
    // Remain in grouping sheet
  }

  // Synchronize all group member volumes to match the master
  async _syncGroupVolume() {
    // Get the master entity's resolved MA entity for grouping
    const masterObj = this.entityObjs[this._selectedIndex];
    if (!masterObj) return;
    
    let masterGroupId;
    if (masterObj.music_assistant_entity) {
      if (typeof masterObj.music_assistant_entity === 'string' && 
          (masterObj.music_assistant_entity.includes('{{') || masterObj.music_assistant_entity.includes('{%'))) {
        // For templates, resolve at action time
        masterGroupId = await this._resolveTemplateAtActionTime(masterObj.music_assistant_entity, this.currentEntityId);
      } else {
        masterGroupId = masterObj.music_assistant_entity;
      }
    } else {
      masterGroupId = this.currentEntityId;
    }
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;
    // For sync volume, use the same entity that's being used for grouping (the MA entity) to get the master volume
    const masterVolumeEntity = masterGroupId;
    const masterVolumeState = masterVolumeEntity ? this.hass.states[masterVolumeEntity] : null;
    if (!masterVolumeState) return;
    const masterVol = Number(masterVolumeState.attributes.volume_level || 0);
    const members = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];
    
    for (const groupedId of members) {
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
              console.warn('Failed to resolve template for sync volume:', error);
              resolvedGroupingId = obj.entity_id;
            }
          } else {
            resolvedGroupingId = obj.music_assistant_entity;
          }
        } else {
          resolvedGroupingId = obj.entity_id;
        }
        
        if (resolvedGroupingId === groupedId) {
          foundObj = obj;
          break;
        }
      }
      
      if (!foundObj) continue;
      
      // For sync volume, use the same entity that's being used for grouping (the MA entity)
      const volumeEntity = groupedId;
      
      await this.hass.callService("media_player", "volume_set", {
        entity_id: volumeEntity,
        volume_level: masterVol
      });
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

customElements.define("yet-another-media-player-beta", YetAnotherMediaPlayerCard);