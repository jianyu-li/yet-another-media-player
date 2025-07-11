
import { LitElement, html, css, nothing } from "lit";

import { renderChip, renderGroupChip } from "./chip-row.js";
import { renderActionChipRow } from "./action-chip-row.js";
import { renderControlsRow } from "./controls-row.js";
import { renderVolumeRow } from "./volume-row.js";
import { renderProgressBar } from "./progress-bar.js";
import { yampCardStyles } from "./yamp-card-styles.js";

// Supported feature flags
const SUPPORT_PAUSE = 1;
const SUPPORT_SEEK = 2;
const SUPPORT_VOLUME_SET = 4;
const SUPPORT_VOLUME_MUTE = 8;
const SUPPORT_PREVIOUS_TRACK = 16;
const SUPPORT_NEXT_TRACK = 32;
const SUPPORT_TURN_ON = 128;
const SUPPORT_TURN_OFF = 256;
const SUPPORT_PLAY_MEDIA = 512;
const SUPPORT_STOP = 4096;
const SUPPORT_PLAY = 16384;
const SUPPORT_SHUFFLE = 32768;
const SUPPORT_GROUPING = 524288;  
const SUPPORT_REPEAT_SET = 262144;

window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "YAMP is a multi-entity media card with custom actions"
});

class YetAnotherMediaPlayerCard extends LitElement {
  _pressTimer = null;
  _handleChipPointerDown(idx) {
    if (!this._holdToPin) return;
    this._pressTimer = setTimeout(() => {
      this._pinChip(idx);
    }, 650);
  }
  _handleChipPointerUp() {
    if (!this._holdToPin) return;
    if (this._pressTimer) clearTimeout(this._pressTimer);
    this._pressTimer = null;
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
    const controls = this._countMainControls(stateObj);
    // Limit Stop visibility on compact layouts.
    return minWide || controls <= 5;
  }

  _countMainControls(stateObj) {
    let count = 0;
    if (this._supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK)) count++;
    count++;
    if (this._supportsFeature(stateObj, SUPPORT_NEXT_TRACK)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_SHUFFLE)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_REPEAT_SET)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_TURN_OFF) ||
        this._supportsFeature(stateObj, SUPPORT_TURN_ON)) count++;
    return count;
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
    // Collapse on load if nothing is playing
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        if (stateObj && stateObj.state !== "playing") {
          this._isIdle = true;
          this.requestUpdate();
        }
      }
    }, 0);
    // Store previous collapsed state
    this._prevCollapsed = null;
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
    // Alternate progress‑bar mode
    this._alternateProgressBar = !!config.alternate_progress_bar;
    // Do not mutate config.force_chip_row here.
  }

  get entityObjs() {
    return this.config.entities.map(e =>
      typeof e === "string"
        ? { entity_id: e, name: "" }
        : {
            entity_id: e.entity_id,
            name: e.name || "",
            volume_entity: e.volume_entity,
            sync_power: !!e.sync_power
          }
    );
  }


  // Return volume entity for given index (use override if set)
  _getVolumeEntity(idx) {
    const obj = this.entityObjs[idx];
    return (obj && obj.volume_entity) ? obj.volume_entity : obj.entity_id;
  }

  // Return grouping key
  _getGroupKey(id) {
    const st = this.hass?.states?.[id];
    if (!st) return id;
    const members = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members
      : [];
    if (!members.length) return id;
    const all = [id, ...members].sort();
    return all[0];
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
    return group.find(id => {
      const st = this.hass.states[id];
      if (!st) return false;
      const members = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];
      // Master should include all other group members in the group
      return group.every(otherId => otherId === id || members.includes(otherId));
    }) || group[0];
  }

  get currentEntityId() {
    return this.entityIds[this._selectedIndex];
  }

  get currentStateObj() {
    if (!this.hass || !this.currentEntityId) return null;
    return this.hass.states[this.currentEntityId];
  }

  get currentVolumeStateObj() {
    const obj = this.entityObjs[this._selectedIndex];
    const entityId = obj?.volume_entity || obj?.entity_id;
    return entityId ? this.hass.states[entityId] : null;
  }

  updated(changedProps) {
    if (this.hass && this.entityIds) {
      // Update timestamps for playing entities
      this.entityIds.forEach(id => {
        const state = this.hass.states[id];
        if (state && state.state === "playing") {
          this._playTimestamps[id] = Date.now();
        }
      });

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
    }

    // Restart progress timer
    super.updated?.(changedProps);

    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    const stateObj = this.currentStateObj;
    if (stateObj && stateObj.state === "playing" && stateObj.attributes.media_duration) {
      this._progressTimer = setInterval(() => {
        this.requestUpdate();
      }, 500);
    }

    // Update idle state after all other state checks
    this._updateIdleState();

    // Notify HA if collapsed state changes
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
    
  }  

  _onChipClick(idx) {
    this._selectedIndex = idx;
    this._manualSelect = true;
    if (!this._holdToPin) {
      this._pinnedIndex = idx;
    }
    clearTimeout(this._manualSelectTimeout);
    this.requestUpdate();
  }

  _pinChip(idx) {
    this._pinnedIndex = idx;
    this._manualSelect = true;
    this.requestUpdate();
  }

  _onActionChipClick(idx) {
    const action = this.config.actions[idx];
    if (!action) return;
    const [domain, service] = action.service.split(".");

    // Clone the service data
    let data = { ...(action.service_data || {}) };

    // For script calls **and** `script_variable: true`, inject `yamp_entity` and omit `entity_id` to avoid invalid IDs.
    if (domain === "script" && action.script_variable === true) {
      const currentId = this.currentEntityId;

      // Remove any placeholder entity_id the user might have supplied
      if (
        data.entity_id === "current" ||
        data.entity_id === "$current" ||
        data.entity_id === "this"
      ) {
        delete data.entity_id;
      }

      data.yamp_entity = currentId;
    } else if (
      !(domain === "script" && action.script_variable === true) &&
      (
        data.entity_id === "current" ||
        data.entity_id === "$current" ||
        data.entity_id === "this" ||
        !data.entity_id // Optionally default if omitted
      )
    ) {
      data.entity_id = this.currentEntityId;
    }

    this.hass.callService(domain, service, data);
  }

  _onControlClick(action) {
    const entity = this.currentEntityId;
    if (!entity) return;
    const stateObj = this.currentStateObj;
    switch (action) {
      case "play_pause":
        this.hass.callService("media_player", "media_play_pause", { entity_id: entity });
        break;
      case "next":
        this.hass.callService("media_player", "media_next_track", { entity_id: entity });
        break;
      case "prev":
        this.hass.callService("media_player", "media_previous_track", { entity_id: entity });
        break;
      case "stop":
        this.hass.callService("media_player", "media_stop", { entity_id: entity });
        break;
      case "shuffle": {
        // Toggle shuffle based on current state
        const curr = !!stateObj.attributes.shuffle;
        this.hass.callService("media_player", "shuffle_set", { entity_id: entity, shuffle: !curr });
        break;
      }
      case "repeat": {
        // Cycle: off → all → one → off
        let curr = stateObj.attributes.repeat || "off";
        let next;
        if (curr === "off") next = "all";
        else if (curr === "all") next = "one";
        else next = "off";
        this.hass.callService("media_player", "repeat_set", { entity_id: entity, repeat: next });
        break;
      }
      case "power": {
        // Toggle between turn_on and turn_off based on current state
        const svc = stateObj.state === "off" ? "turn_on" : "turn_off";
        this.hass.callService("media_player", svc, { entity_id: entity });

        // Also toggle volume_entity if sync_power is enabled for this entity
        const obj = this.entityObjs[this._selectedIndex];
        if (
          obj &&
          obj.sync_power &&
          obj.volume_entity &&
          obj.volume_entity !== obj.entity_id
        ) {
          this.hass.callService("media_player", svc, { entity_id: obj.volume_entity });
        }
        break;
      }
    }
  }

  _onVolumeChange(e) {
    const idx = this._selectedIndex;
    const mainEntity = this.entityObjs[idx].entity_id;
    const state = this.hass.states[mainEntity];
    const newVol = Number(e.target.value);

    // If grouped, apply delta to each group member
    if (Array.isArray(state?.attributes?.group_members) && state.attributes.group_members.length) {
      // Get current group volumes
      const targets = [mainEntity, ...state.attributes.group_members];
      // Use base volume for delta calculation (defaults to previous if missing)
      const base = typeof this._groupBaseVolume === "number"
        ? this._groupBaseVolume
        : Number(this.currentVolumeStateObj?.attributes.volume_level || 0);
      const delta = newVol - base;

      for (const t of targets) {
        const obj = this.entityObjs.find(e => e.entity_id === t);
        const volTarget = (obj && obj.volume_entity) ? obj.volume_entity : t;
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + delta;
        v = Math.max(0, Math.min(1, v)); // Clamp to [0,1]
        this.hass.callService("media_player", "volume_set", { entity_id: volTarget, volume_level: v });
      }
      // Update base for continuous dragging
      this._groupBaseVolume = newVol;
    } else {
      // Not grouped, set directly
      this.hass.callService("media_player", "volume_set", { entity_id: this._getVolumeEntity(idx), volume_level: newVol });
    }
  }

    _onVolumeStep(direction) {
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

      const mainEntity = this.entityObjs[idx].entity_id;
      const state = this.hass.states[mainEntity];

      if (Array.isArray(state?.attributes?.group_members) && state.attributes.group_members.length) {
        // Grouped: apply group gain step
        const targets = [mainEntity, ...state.attributes.group_members];
        // Fixed step size
        const step = 0.05 * direction;
        for (const t of targets) {
          const obj = this.entityObjs.find(e => e.entity_id === t);
          const volTarget = (obj && obj.volume_entity) ? obj.volume_entity : t;
          const st = this.hass.states[volTarget];
          if (!st) continue;
          let v = Number(st.attributes.volume_level || 0) + step;
          v = Math.max(0, Math.min(1, v));
          this.hass.callService("media_player", "volume_set", { entity_id: volTarget, volume_level: v });
        }
      } else {
        // Not grouped, set directly
        let current = Number(stateObj.attributes.volume_level || 0);
        current += direction * 0.05;
        current = Math.max(0, Math.min(1, current));
        this.hass.callService("media_player", "volume_set", { entity_id: entity, volume_level: current });
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
    }
    _onGroupVolumeStep(volumeEntity, direction) {
      this.hass.callService("remote", "send_command", {
        entity_id: volumeEntity,
        command: direction > 0 ? "volume_up" : "volume_down"
      });
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

  _onProgressBarClick(e) {
    const entity = this.currentEntityId;
    const stateObj = this.currentStateObj;
    if (!entity || !stateObj) return;
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

    this.hass.callService("media_player", "media_seek", { entity_id: entity, seek_position: seekTime });
  }

    render() {
      if (!this.hass || !this.config) return nothing;
      
      if (this.shadowRoot && this.shadowRoot.host) {
        this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      }
      
      const showChipRow = this.config.show_chip_row || "auto";
      const stateObj = this.currentStateObj;
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

      // Calculate shuffle/repeat state only AFTER confirming stateObj exists
      const shuffleActive = !!stateObj.attributes.shuffle;
      const repeatActive = stateObj.attributes.repeat && stateObj.attributes.repeat !== "off";

      // Artwork and idle logic
      const isPlaying = !this._isIdle && stateObj.state === "playing";
      const isRealArtwork = !this._isIdle && isPlaying && (stateObj.attributes.entity_picture || stateObj.attributes.album_art);
      const art = isRealArtwork
        ? (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        : null;
      // Details
      const title = isPlaying ? (stateObj.attributes.media_title || "") : "";
      const artist = isPlaying
        ? (
            stateObj.attributes.media_artist ||
            stateObj.attributes.media_series_title ||
            stateObj.attributes.app_name ||
            ""
          )
        : "";
      let pos = stateObj.attributes.media_position || 0;
      const duration = stateObj.attributes.media_duration || 0;
      if (isPlaying) {
        const updatedAt = stateObj.attributes.media_position_updated_at
          ? Date.parse(stateObj.attributes.media_position_updated_at)
          : Date.parse(stateObj.last_changed);
        const elapsed = (Date.now() - updatedAt) / 1000;
        pos += elapsed;
      }
      const progress = duration ? Math.min(1, pos / duration) : 0;

      // Volume entity determination
      const idx = this._selectedIndex;
      const entity = this._getVolumeEntity(idx);
      const isRemoteVolumeEntity = entity && entity.startsWith && entity.startsWith("remote.");

      // Volume
      const vol = Number(this.currentVolumeStateObj?.attributes.volume_level || 0);
      const showSlider = this.config.volume_mode !== "stepper";

      // Collapse artwork/details on idle if configured and/or always_collapsed
      const collapsed = this._alwaysCollapsed
        ? true
        : (this._collapseOnIdle ? this._isIdle : false);
      // Use null if idle or no artwork available
      const artworkUrl = !this._isIdle && stateObj && (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        ? (stateObj.attributes.entity_picture || stateObj.attributes.album_art)
        : null;

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
            class="${dimIdleFrame ? 'dim-idle' : ''}"
          >
            ${(this.entityObjs.length > 1 || showChipRow === "always") ? html`
                <div class="chip-row">
                  ${this.groupedSortedEntityIds.map(group => {
                    if (group.length > 1) {
                      const id = this._getActualGroupMaster(group);
                      const idx = this.entityIds.indexOf(id);
                      const state = this.hass?.states?.[id];
                      // For group chips, art is always null, but update isPlaying logic for selected chip
                      const isPlaying = this.currentEntityId === id
                        ? !this._isIdle
                        : state?.state === "playing";
                      return renderGroupChip({
                        idx,
                        selected: this.currentEntityId === id,
                        groupName: this.getChipName(id),
                        art: null, // group chips show count or icon, not artwork
                        icon: "mdi:group", 
                        pinned: this._pinnedIndex === idx,
                        holdToPin: this._holdToPin,
                        onChipClick: (idx) => {
                          this._onChipClick(idx);
                          this._openGrouping();          // open the grouped‑players bottom sheet
                        },
                        onPinClick: (idx, e) => { e.stopPropagation(); this._onPinClick(e); },
                        onPointerDown: (e) => this._handleChipPointerDown(idx),
                        onPointerUp: (e) => this._handleChipPointerUp()
                      });
                    } else {
                      const id = group[0];
                      const idx = this.entityIds.indexOf(id);
                      const state = this.hass?.states?.[id];
                      const isPlaying = this.currentEntityId === id
                        ? !this._isIdle
                        : state?.state === "playing";
                      const art = this.currentEntityId === id
                        ? (!this._isIdle && (state?.attributes?.entity_picture || state?.attributes?.album_art))
                        : (state?.state === "playing" && (state?.attributes?.entity_picture || state?.attributes?.album_art));
                      const icon = state?.attributes?.icon || "mdi:cast";
                      return renderChip({
                        idx,
                        selected: this.currentEntityId === id,
                        playing: isPlaying,
                        name: this.getChipName(id),
                        art,
                        icon,
                        pinned: this._pinnedIndex === idx,
                        holdToPin: this._holdToPin,
                        onChipClick: (idx) => this._onChipClick(idx),
                        onPinClick: (idx, e) => { e.stopPropagation(); this._onPinClick(e); },
                        onPointerDown: (e) => this._handleChipPointerDown(idx),
                        onPointerUp: (e) => this._handleChipPointerUp()
                      });
                    }
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
                  min-height: ${collapsed ? "0px" : "320px"};
                  background-size: cover;
                  background-position: top center;
                  background-repeat: no-repeat;
                  filter: ${collapsed && artworkUrl ? "blur(18px) brightness(0.7) saturate(1.15)" : "none"};
                  transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s;
                "
              ></div>
              ${!dimIdleFrame ? html`<div class="card-lower-fade"></div>` : nothing}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}">
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
                  ${isPlaying && artist ? html`<div class="artist">${artist}</div>` : nothing}
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
                ${!dimIdleFrame ? html`
                ${renderControlsRow({
                  stateObj,
                  showStop: this._shouldShowStopButton(stateObj),
                  shuffleActive,
                  repeatActive,
                  onControlClick: (action) => this._onControlClick(action),
                  supportsFeature: (state, feature) => this._supportsFeature(state, feature)
                })}
                ${renderVolumeRow({
                  isRemoteVolumeEntity,
                  showSlider,
                  vol,
                  onVolumeDragStart: (e) => this._onVolumeDragStart(e),
                  onVolumeDragEnd: (e) => this._onVolumeDragEnd(e),
                  onVolumeChange: (e) => this._onVolumeChange(e),
                  onVolumeStep: (dir) => this._onVolumeStep(dir),
                  moreInfoMenu: html`
                    <div class="more-info-menu">
                      <button class="more-info-btn" @click=${() => this._openEntityOptions()}>
                        <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                      </button>
                    </div>
                  `,
                })}
                ` : nothing}
                ${dimIdleFrame ? html`
                  <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: 10;">
                    <button class="more-info-btn" @click=${() => this._openEntityOptions()}>
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
              ${(!this._showGrouping && !this._showSourceList) ? html`
                <button class="entity-options-item" @click=${() => { this._openMoreInfo(); this._showEntityOptions = false; this.requestUpdate(); }}>More Info</button>
                ${Array.isArray(this.currentStateObj?.attributes?.source_list) && this.currentStateObj.attributes.source_list.length > 0 ? html`
                  <button class="entity-options-item" @click=${() => this._openSourceList()}>Source</button>
                ` : nothing}
                ${
                  (() => {
                    const totalEntities = this.entityIds.length;
                    const groupableCount = this.entityIds.reduce((acc, id) => {
                      const st = this.hass.states[id];
                      return acc + (this._supportsFeature(st, SUPPORT_GROUPING) ? 1 : 0);
                    }, 0);
                    if (
                      totalEntities > 1 &&
                      groupableCount > 1 &&
                      this._supportsFeature(this.currentStateObj, SUPPORT_GROUPING)
                    ) {
                      return html`
                        <button class="entity-options-item" @click=${() => this._openGrouping()}>Group Players</button>
                      `;
                    }
                    return nothing;
                  })()
                }
                <button class="entity-options-item" @click=${() => this._closeEntityOptions()}>Close</button>
              ` : this._showGrouping ? html`
                <button class="entity-options-item" @click=${() => this._closeGrouping()} style="margin-bottom:14px;">← Back</button>
                ${
                  (() => {
                    const masterState = this.hass.states[this.currentEntityId];
                    const groupedAny = Array.isArray(masterState?.attributes?.group_members) && masterState.attributes.group_members.length > 0;
                    return html`
                      <div style="display:flex;align-items:center;justify-content:space-between;font-weight:600;margin-bottom:0;">
                        ${groupedAny ? html`
                          <button class="group-all-btn"
                            @click=${() => this._syncGroupVolume()}
                            style="color:#fff; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 16px 2px 0;">
                            Sync Volume
                          </button>
                        ` : html`<span></span>`}
                        <button class="group-all-btn"
                          @click=${() => groupedAny ? this._ungroupAll() : this._groupAll()}
                          style="color:#d22; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 0 2px 8px;">
                          ${groupedAny ? "Ungroup All" : "Group All"}
                        </button>
                      </div>
                    `;
                  })()
                }
                <hr style="margin:8px 0 2px 0;opacity:0.19;border:0;border-top:1px solid #fff;" />
                ${
                  (() => {
                    // --- Begin new group player rows logic ---
                    const masterId = this.currentEntityId;
                    const sortedIds = [masterId, ...this.entityIds.filter(id => id !== masterId)];
                    return sortedIds.map(id => {
                      const st = this.hass.states[id];
                      if (!this._supportsFeature(st, SUPPORT_GROUPING)) return nothing;
                      const name = this.getChipName(id);
                      const masterState = this.hass.states[masterId];
                      const grouped =
                        id === masterId
                          ? true
                          : (
                            Array.isArray(masterState.attributes.group_members) &&
                            masterState.attributes.group_members.includes(id)
                          );
                      const obj = this.entityObjs.find(e => e.entity_id === id);
                      const volumeEntity = (obj && obj.volume_entity) ? obj.volume_entity : id;
                      const volumeState = this.hass.states[volumeEntity];
                      const isRemoteVol = volumeEntity.startsWith && volumeEntity.startsWith("remote.");
                      const volVal = Number(volumeState?.attributes?.volume_level || 0);
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
                            id === masterId
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
                    });
                    // --- End new group player rows logic ---
                  })()
                }
              ` : html`
                <button class="entity-options-item" @click=${() => this._closeSourceList()} style="margin-bottom:14px;">← Back</button>
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
        </ha-card>
      `;
    }
    
    _updateIdleState() {
      const stateObj = this.currentStateObj;
      // Only start idle timer if not playing
      if (stateObj && stateObj.state === "playing") {
        // Became active, clear timer and set not idle
        if (this._idleTimeout) clearTimeout(this._idleTimeout);
        this._idleTimeout = null;
        if (this._isIdle) {
          this._isIdle = false;
          this.requestUpdate();
        }
      } else {
        // Only set timer if not already idle and not already waiting
        if (!this._isIdle && !this._idleTimeout) {
          this._idleTimeout = setTimeout(() => {
            this._isIdle = true;
            this._idleTimeout = null;
            this.requestUpdate();
          }, 60000); // 1 minute
        }
      }
    }

    // Home assistant layout options
    getGridOptions() {
    // Use the same logic as in render() to know if the card is collapsed.
    const collapsed = this._alwaysCollapsed
      ? true
      : (this._collapseOnIdle ? this._isIdle : false);

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
                { value: "never", label: "Never" }
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
          name: "alternate_progress_bar",
          selector: {
            boolean: {}
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

    row.addEventListener('mousedown', (e) => {
      isDown = true;
      row._dragged = false;
      row.classList.add('grab-scroll-active');
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
      e.preventDefault();
    });
    row.addEventListener('mouseleave', () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    });
    row.addEventListener('mouseup', () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    });
    row.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startX);
      // Mark as dragged if moved > 5px
      if (Math.abs(walk) > 5) {
        row._dragged = true;
      }
      e.preventDefault();
      row.scrollLeft = scrollLeft - walk;
    });
    // Suppress click after drag
    row.addEventListener('click', (e) => {
      if (row._dragged) {
        e.stopPropagation();
        e.preventDefault();
        row._dragged = false;
      }
    }, true);
    row._grabScrollAttached = true;
  }

  _addVerticalGrabScroll(selector) {
    const col = this.renderRoot.querySelector(selector);
    if (!col || col._grabScrollAttached) return;
    let isDown = false;
    let startY, scrollTop;
    col.addEventListener('mousedown', (e) => {
      isDown = true;
      col._dragged = false;
      col.classList.add('grab-scroll-active');
      startY = e.pageY - col.getBoundingClientRect().top;
      scrollTop = col.scrollTop;
      e.preventDefault();
    });
    col.addEventListener('mouseleave', () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    });
    col.addEventListener('mouseup', () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    });
    col.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const y = e.pageY - col.getBoundingClientRect().top;
      const walk = (y - startY);
      if (Math.abs(walk) > 5) col._dragged = true;
      e.preventDefault();
      col.scrollTop = scrollTop - walk;
    });
    // Suppress clicks after drag
    col.addEventListener('click', (e) => {
      if (col._dragged) {
        e.stopPropagation();
        e.preventDefault();
        col._dragged = false;
      }
    }, true);
    col._grabScrollAttached = true;
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
    this._removeSourceDropdownOutsideHandler();
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

  _openEntityOptions() {
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
    const masterId = this.currentEntityId;
    if (!masterId || !targetId) return;

    const masterState = this.hass.states[masterId];
    const grouped =
      Array.isArray(masterState?.attributes.group_members) &&
      masterState.attributes.group_members.includes(targetId);

    if (grouped) {
      // Unjoin the target from the group
      await this.hass.callService("media_player", "unjoin", {
        entity_id: targetId,
      });
    } else {
      // Join the target player to the master's group
      await this.hass.callService("media_player", "join", {
        entity_id: masterId,          // call on the master
        group_members: [targetId],    // player(s) to add
      });
    }
    // Keep sheet open for more grouping actions
  }


  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor");
  }
  static getStubConfig(hass, entities) {
    return { entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2) };
  }

  // Group all supported entities to current master
  async _groupAll() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;

    // Get all other entities that support grouping and are not already grouped with master
    const alreadyGrouped = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];
    const toJoin = this.entityIds
      .filter(id => id !== masterId)
      .filter(id => {
        const st = this.hass.states[id];
        return this._supportsFeature(st, SUPPORT_GROUPING) && !alreadyGrouped.includes(id);
      });
    if (toJoin.length > 0) {
      await this.hass.callService("media_player", "join", {
        entity_id: masterId,
        group_members: toJoin,
      });
    }
    // After grouping, keep the master set if still valid
    this._lastGroupingMasterId = masterId;
    // Remain in grouping sheet
  }

  // Ungroup all members from current master
  async _ungroupAll() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
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
    this._lastGroupingMasterId = masterId;
    // Remain in grouping sheet
  }

  // Synchronize all group member volumes to match the master
  async _syncGroupVolume() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;
    const masterObj = this.entityObjs.find(e => e.entity_id === masterId);
    const masterVolumeEntity = (masterObj && masterObj.volume_entity) ? masterObj.volume_entity : masterId;
    const masterVolumeState = this.hass.states[masterVolumeEntity];
    if (!masterVolumeState) return;
    const masterVol = Number(masterVolumeState.attributes.volume_level || 0);
    const members = Array.isArray(masterState.attributes.group_members)
      ? masterState.attributes.group_members
      : [];
    for (const id of members) {
      const obj = this.entityObjs.find(e => e.entity_id === id);
      const volumeEntity = (obj && obj.volume_entity) ? obj.volume_entity : id;
      await this.hass.callService("media_player", "volume_set", {
        entity_id: volumeEntity,
        volume_level: masterVol
      });
    }
  }
}

class YetAnotherMediaPlayerEditor extends LitElement {
  static properties = {
    hass: {},
    lovelace: {},
    config: {},
  };

  setConfig(config) {
    this.config = { ...config };
  }

  get _schema() {
    return [
      {
        name: "entities",
        selector: {
          entity: {
            multiple: true,
            domain: "media_player"
          }
        }
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
        }
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
        selector: { boolean: {} },
        required: false
      },
      {
        name: "always_collapsed",
        selector: { boolean: {} },
        required: false
      },
      {
        name: "alternate_progress_bar",
        selector: { boolean: {} },
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
        name: "show_chip_row",
        selector: {
          select: {
            options: [
              { value: "auto", label: "Auto (hide with one entity)" },
              { value: "always", label: "Always show" }
            ]
          }
        },
        required: false
      },
      // Add idle_image entity picker after progress bar options
      {
        name: "idle_image",
        selector: {
          entity: { domain: ["camera", "image"] },
        },
        required: false,
      },
      {
        name: "actions",
        selector: {
          array: {
            item_selector: {
              object: {
                name: { selector: { text: {} } },
                service: { selector: { text: {} } },
                service_data: { selector: { object: {} } }
              }
            }
          }
        }
      }
    ];
  }

  render() {
    if (!this.config) return html``;
    // Display friendly names or entity_ids for all entities/objects
    const entitiesForEditor = (this.config.entities || []).map(e => {
      if (typeof e === "string") {
        const state = this.hass?.states?.[e];
        return state?.attributes?.friendly_name || e;
      }
      if (e && typeof e === "object" && e.entity_id) {
        const state = this.hass?.states?.[e.entity_id];
        return state?.attributes?.friendly_name || e.entity_id;
      }
      return "(invalid entity)";
    });
    // Show list above the form
    const configForEditor = {
      ...this.config,
      entities: this.config.entities
      
    };
    return html`
      <div>
        <ul style="list-style:none; padding:0; margin-bottom:16px;">
          ${entitiesForEditor.map(name => html`<li style="padding:2px 0;">${name}</li>`)}
        </ul>
        <ha-form
          .hass=${this.hass}
          .data=${configForEditor}
          .schema=${this._schema}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `;
  }

  _valueChanged(ev) {
    const config = ev.detail.value;
    this.config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config } }));
  }
}
customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);
customElements.define("yet-another-media-player", YetAnotherMediaPlayerCard);