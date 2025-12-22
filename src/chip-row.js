// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { html, nothing } from "lit";

// Get artwork URL from entity state, supporting entity_picture_local for Music Assistant
function getArtworkUrl(state, hostname = '', overrides = [], fallbackArtwork = null) {
  if (!state || !state.attributes) return null;

  const attrs = state.attributes;
  const entityId = state.entity_id;
  const appId = attrs.app_id;

  let artworkUrl = null;
  let sizePercentage = null;

  // Check for media artwork overrides first
  if (overrides && Array.isArray(overrides) && overrides.length) {
    const getOverrideValue = (override, key) => {
      if (!override) return undefined;
      return override[key];
    };

    const matchers = [
      ["media_title", "media_title"],
      ["media_artist", "media_artist"],
      ["media_album_name", "media_album_name"],
      ["media_content_id", "media_content_id"],
      ["media_channel", "media_channel"],
      ["app_name", "app_name"],
      ["media_content_type", "media_content_type"],
      ["entity_id", "entity_id"],
      ["entity_state", "entity_state"],
    ];

    const findSpecificMatch = () =>
      overrides.find((override) =>
        matchers.some(([attrKey, overrideKey]) => {
          const expected = getOverrideValue(override, overrideKey);
          if (expected === undefined) return false;
          const value = attrKey === "entity_id"
            ? entityId
            : attrKey === "entity_state"
              ? state?.state
              : attrs[attrKey];
          return value === expected;
        })
      );

    let override = findSpecificMatch();

    if (!override) {
      const hasArtwork = attrs.entity_picture_local || attrs.entity_picture || attrs.album_art;
      if (!hasArtwork) {
        override = overrides.find((item) => item?.missing_art_url);
        if (override?.missing_art_url) {
          override = { ...override, image_url: override.missing_art_url };
        }
      }
    }

    if (override?.image_url) {
      artworkUrl = override.image_url;
      sizePercentage = override?.size_percentage;
    }
  }

  // If no override found, use standard artwork
  if (!artworkUrl) {
    // Always check entity_picture_local first, then entity_picture
    artworkUrl = attrs.entity_picture_local || attrs.entity_picture || attrs.album_art || null;
  }

  // If still no artwork, check for configured fallback artwork
  if (!artworkUrl && fallbackArtwork) {
    // Check if it's a smart fallback (TV vs Music)
    if (fallbackArtwork === 'smart') {
      // Use TV icon for TV content, music icon for everything else
      const isTV = attrs.media_title === 'TV' || attrs.media_channel ||
        attrs.app_id === 'tv' || attrs.app_id === 'androidtv';
      if (isTV) {
        // TV icon
        artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI2OCIgeT0iMTIwIiB3aWR0aD0iNDgiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI4MCIgeT0iMTMwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8L3N2Zz4K';
      } else {
        // Music icon (equalizer bars)
        artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=';
      }
    } else if (typeof fallbackArtwork === 'string') {
      // Direct URL or base64 image
      artworkUrl = fallbackArtwork;
    }
  }

  // Apply hostname prefix if configured and artwork URL is relative
  if (artworkUrl && hostname && !artworkUrl.startsWith('http')) {
    artworkUrl = hostname + artworkUrl;
  }

  return { url: artworkUrl, sizePercentage };
}

// Helper to render a single chip
export function renderChip({
  idx,
  selected,
  playing,
  name,
  art,
  icon,
  pinned,
  holdToPin,
  maActive,
  onChipClick,
  onIconClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  objectFit,
}) {
  const artStyle = objectFit ? `object-fit: ${objectFit};` : "";
  return html`
    <button class="chip"
            ?selected=${selected}
            ?playing=${playing}
            ?ma-active=${maActive}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;">
      <span class="chip-icon">
        ${art
      ? html`<img class="chip-mini-art" src="${art}" style="${artStyle}" onerror="this.style.display='none'" />`
      : html`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${name}
      </span>
      ${pinned
      ? html`
            <span class="chip-pin-inside" @click=${e => { e.stopPropagation(); onPinClick(idx, e); }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `
      : html`<span class="chip-pin-spacer"></span>`
    }
    </button>
  `;
}

// Helper to render a group chip: same as chip but with label (with count), no badge/icon for group, just art/icon and label.
export function renderGroupChip({
  idx,
  selected,
  groupName,
  art,
  icon,
  pinned,
  holdToPin,
  maActive,
  onChipClick,
  onIconClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  objectFit,
}) {
  const artStyle = objectFit ? `object-fit: ${objectFit};` : "";
  return html`
    <button class="chip group"
            ?selected=${selected}
            ?ma-active=${maActive}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;">
      <span class="chip-icon"
            style="cursor:pointer;"
            @click=${e => {
      e.stopPropagation();
      if (onIconClick) {
        onIconClick(idx, e);
      }
    }}>
        ${art
      ? html`<img class="chip-mini-art"
                      src="${art}"
                      style="cursor:pointer;${artStyle}"
                      onerror="this.style.display='none'"
                      @click=${e => {
          e.stopPropagation();
          if (onIconClick) {
            onIconClick(idx, e);
          }
        }}/>`

      : html`<ha-icon .icon=${icon}
                          style="font-size:28px;cursor:pointer;"
                          @click=${e => {
          e.stopPropagation();
          if (onIconClick) {
            onIconClick(idx, e);
          }
        }}></ha-icon>`
    }
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${groupName}
      </span>
      ${pinned
      ? html`
            <span class="chip-pin-inside" @click=${e => { e.stopPropagation(); onPinClick(idx, e); }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `
      : html`<span class="chip-pin-spacer"></span>`
    }
    </button>
  `;
}

// Pin/hold logic helpers (timer, etc)
export function createHoldToPinHandler({ onPin, onHoldEnd, holdTime = 600, moveThreshold = 8 }) {
  let holdTimer = null;
  let startX = null;
  let startY = null;
  let moved = false;
  return {
    pointerDown: (e, idx) => {
      startX = e.clientX;
      startY = e.clientY;
      moved = false;
      holdTimer = setTimeout(() => {
        if (!moved) {
          onPin(idx, e);
          onHoldEnd && onHoldEnd(idx);
        }
      }, holdTime);
    },
    pointerMove: (e, idx) => {
      if (holdTimer && startX !== null && startY !== null) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > moveThreshold || dy > moveThreshold) {
          moved = true;
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      }
    },
    pointerUp: (e, idx) => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      startX = null;
      startY = null;
      moved = false;
    }
  };
}
// Central chip row renderer
export function renderChipRow({
  groupedSortedEntityIds,
  entityIds,
  selectedEntityId,
  pinnedIndex,
  holdToPin,
  getChipName,
  getActualGroupMaster,
  getIsChipPlaying,
  getChipArt,
  getIsMaActive,
  isIdle,
  hass,
  artworkHostname = '',
  mediaArtworkOverrides = [],
  fallbackArtwork = null,
  onChipClick,
  onIconClick,
  onPinClick,
  onPointerDown,
  onPointerMove,
  onPointerUp
}) {
  if (!groupedSortedEntityIds || !groupedSortedEntityIds.length) return nothing;

  return html`
    ${groupedSortedEntityIds.map((group) => {
    // If it's a group (more than one entity)
    if (group.length > 1) {
      const id = getActualGroupMaster(group);
      const idx = entityIds.indexOf(id);
      const state = hass?.states?.[id];
      const artObj = (typeof getChipArt === "function")
        ? getChipArt(id)
        : getArtworkUrl(state, artworkHostname, mediaArtworkOverrides, fallbackArtwork);
      const art = artObj?.url;
      const objectFit = artObj?.objectFit;

      const icon = state?.attributes?.icon || "mdi:cast";
      const isMaActive = (typeof getIsMaActive === "function") ? getIsMaActive(id) : false;
      return renderGroupChip({
        idx,
        selected: selectedEntityId === id,
        groupName: getChipName(id) + (group.length > 1 ? ` [${group.length}]` : ""),
        art,
        icon,
        pinned: pinnedIndex === idx,
        holdToPin,
        maActive: isMaActive,
        onChipClick,
        onIconClick,
        onPinClick,
        onPointerDown: (e) => onPointerDown(e, idx),
        onPointerMove: (e) => onPointerMove(e, idx),
        onPointerUp: (e) => onPointerUp(e, idx),
        objectFit,
      });
    } else {
      // Single chip
      const id = group[0];
      const idx = entityIds.indexOf(id);
      const state = hass?.states?.[id];
      const isChipPlaying = (typeof getIsChipPlaying === "function")
        ? getIsChipPlaying(id, selectedEntityId === id)
        : (state?.state === "playing");
      const artObj = (typeof getChipArt === "function")
        ? getChipArt(id)
        : getArtworkUrl(state, artworkHostname, mediaArtworkOverrides, fallbackArtwork);
      const artSource = artObj?.url;
      const objectFit = artObj?.objectFit;

      const art = selectedEntityId === id ? (!isIdle && artSource) : (isChipPlaying && artSource);
      const icon = state?.attributes?.icon || "mdi:cast";
      const isMaActive = (typeof getIsMaActive === "function") ? getIsMaActive(id) : false;
      return renderChip({
        idx,
        selected: selectedEntityId === id,
        playing: isChipPlaying,
        name: getChipName(id),
        art,
        icon,
        pinned: pinnedIndex === idx,
        holdToPin,
        maActive: isMaActive,
        onChipClick,
        onPinClick,
        onPointerDown: (e) => onPointerDown(e, idx),
        onPointerMove: (e) => onPointerMove(e, idx),
        onPointerUp: (e) => onPointerUp(e, idx),
        objectFit,
      });
    }
  })}
  `;
}
