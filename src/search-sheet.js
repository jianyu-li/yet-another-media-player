// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { LitElement, html, css, nothing } from "lit";
import { isMusicAssistantEntity } from "./yamp-utils.js";
import { localize } from "./localize/localize.js";


const playOptions = [
  { mode: 'replace', icon: 'mdi:playlist-remove', label: localize('search.replace') },
  { mode: 'next', icon: 'mdi:playlist-play', label: localize('search.play_next') },
  { mode: 'replace_next', icon: 'mdi:playlist-music', label: localize('search.replace_play') },
  { mode: 'add', icon: 'mdi:playlist-plus', label: localize('search.add_queue') },
];

const resolveLimitValue = (limit, { cap, floor } = {}) => {
  const numericLimit = Number(limit);
  if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
    return undefined;
  }
  let value = numericLimit;
  if (typeof floor === "number") {
    value = Math.max(floor, value);
  }
  if (typeof cap === "number") {
    value = Math.min(cap, value);
  }
  return value;
};

const MUSIC_ASSISTANT_CONFIG_TTL_MS = 30000;
let cachedMusicAssistantEntryId = null;
let cachedMusicAssistantEntryTs = 0;

export async function getMusicAssistantConfigEntryId(hass) {
  const now = Date.now();
  if (cachedMusicAssistantEntryId && now - cachedMusicAssistantEntryTs < MUSIC_ASSISTANT_CONFIG_TTL_MS) {
    return cachedMusicAssistantEntryId;
  }
  try {
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    const maEntry = entries.find(entry => entry.domain === "music_assistant" && entry.state === "loaded");
    cachedMusicAssistantEntryId = maEntry?.entry_id || null;
    cachedMusicAssistantEntryTs = now;
    return cachedMusicAssistantEntryId;
  } catch (error) {
    console.error("yamp: Failed to resolve Music Assistant config entry", error);
    cachedMusicAssistantEntryId = null;
    cachedMusicAssistantEntryTs = now;
    return null;
  }
}

let cachedMassQueueEntryId = null;
let cachedMassQueueEntryTs = 0;

export async function getMassQueueConfigEntryId(hass) {
  const now = Date.now();
  if (cachedMassQueueEntryId && now - cachedMassQueueEntryTs < MUSIC_ASSISTANT_CONFIG_TTL_MS) {
    return cachedMassQueueEntryId;
  }
  try {
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    const mqEntry = entries.find(entry => entry.domain === "mass_queue" && entry.state === "loaded");
    cachedMassQueueEntryId = mqEntry?.entry_id || null;
    cachedMassQueueEntryTs = now;
    return cachedMassQueueEntryId;
  } catch (error) {
    console.error("yamp: Failed to resolve mass_queue config entry", error);
    cachedMassQueueEntryId = null;
    cachedMassQueueEntryTs = now;
    return null;
  }
}

function transformMusicAssistantItem(item) {
  if (!item) return null;
  return {
    title: item.name,
    media_content_id: item.uri,
    media_content_type: item.media_type,
    media_class: item.media_type,
    thumbnail: item.image,
    ...(item.artists && { artist: item.artists.map(a => a.name).join(', ') }),
    ...(item.album && { album: item.album.name }),
    is_browsable: item.media_type === 'artist' || item.media_type === 'album'
  };
}

/**
 * Renders the search sheet UI for media search.
 *
 * @param {Object} opts
 * @param {boolean} opts.open - Whether the search sheet is visible.
 * @param {string} opts.query - Current search query value.
 * @param {Function} opts.onQueryInput - Handler for query input change.
 * @param {Function} opts.onSearch - Handler for search action.
 * @param {Function} opts.onClose - Handler for closing the sheet.
 * @param {boolean} opts.loading - Loading state for search.
 * @param {Array} opts.results - Search result items (array of media items).
 * @param {Function} opts.onPlay - Handler to play a media item.
 * @param {Function} opts.onQueue - Handler to add a media item to queue.
 * @param {string} [opts.error] - Optional error message.
 * @param {boolean} [opts.showQueueSuccess] - Whether to show queue success message.
 * @param {boolean} [opts.matchTheme] - Whether to match the theme of the parent.
 * @param {boolean} [opts.disableAutofocus] - Whether to disable search input autofocus.
 */
export function renderSearchResultActions({
  item,
  onPlay,
  onOptionsToggle,
  upcomingFilterActive = false,
  isMusicAssistant = false,
  massQueueAvailable = false,
  searchView = 'list',
  isInline = false,
  onMoveUp,
  onMoveDown,
  onMoveNext,
  onRemove,
}) {
  const isQueueItem = !!(upcomingFilterActive && item.queue_item_id && isMusicAssistant && massQueueAvailable);

  const containerClass = isInline ? 'entity-options-search-buttons' : (searchView === 'card' ? 'card-overlay-buttons' : 'search-sheet-buttons');
  const playClass = isInline ? 'entity-options-search-play' : (searchView === 'card' ? 'search-sheet-play icon-only' : 'search-sheet-play');
  const queueClass = isInline ? 'entity-options-search-queue' : (searchView === 'card' ? 'search-sheet-queue icon-only' : 'search-sheet-queue');

  return html`
    <div class="${containerClass}">
      ${isQueueItem && isInline ? html`
        <div class="queue-controls">
          <button class="queue-btn queue-btn-up" @click=${() => onMoveUp(item)} title="${localize('search.move_up')}">
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-down" @click=${() => onMoveDown(item)} title="${localize('search.move_down')}">
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-next" @click=${() => onMoveNext(item)} title="${localize('search.move_next')}">
            <ha-icon icon="mdi:playlist-play"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-remove" @click=${() => onRemove(item)} title="${localize('search.remove')}">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      ` : nothing}
      <button class="${playClass}" 
              @click=${() => onPlay(item)} 
              title="${localize('common.play_now')}">
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
      ${!isQueueItem ? html`
        <button class="${queueClass}" 
                @click=${(e) => { e.preventDefault(); e.stopPropagation(); onOptionsToggle(item); }} 
                title="${localize('common.more_options')}">
          <ha-icon icon="mdi:dots-vertical"></ha-icon>
        </button>
      ` : nothing}
    </div>
  `;
}

export function renderSearchResultSlideOut({
  item,
  activeSearchRowMenuId,
  successSearchRowMenuId,
  onPlayOption,
  onOptionsToggle,
  searchView = 'list',
  isQueueItem = false,
  onMoveUp,
  onMoveDown,
  onMoveNext,
  onRemove,
}) {
  const isActive = activeSearchRowMenuId != null && item.media_content_id != null && activeSearchRowMenuId === item.media_content_id;
  const isSuccess = successSearchRowMenuId === item.media_content_id;

  return html`
    <div class="search-row-slide-out ${isActive ? 'active' : ''}">
      ${isQueueItem && searchView === 'card' ? html`
        <button class="slide-out-button" @click=${() => { onMoveUp(item); onOptionsToggle(null); }} title="${localize('search.move_up')}">
          ${localize('search.move_up')}
        </button>
        <button class="slide-out-button" @click=${() => { onMoveDown(item); onOptionsToggle(null); }} title="${localize('search.move_down')}">
          ${localize('search.move_down')}
        </button>
        <button class="slide-out-button" @click=${() => { onMoveNext(item); onOptionsToggle(null); }} title="${localize('search.move_next')}">
          ${localize('search.move_next')}
        </button>
        <button class="slide-out-button" @click=${() => { onRemove(item); onOptionsToggle(null); }} title="${localize('search.remove')}">
          ${localize('search.remove')}
        </button>
      ` : html`
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'replace')} title="${localize('search.labels.replace')}">
          ${searchView === 'card' ? nothing : html`<ha-icon icon="mdi:playlist-remove"></ha-icon>`}${localize('search.labels.replace')}
        </button>
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'next')} title="${localize('search.labels.next')}">
          ${searchView === 'card' ? nothing : html`<ha-icon icon="mdi:playlist-play"></ha-icon>`}${localize('search.labels.next')}
        </button>
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'replace_next')} title="${localize('search.labels.replace_next')}">
          ${searchView === 'card' ? nothing : html`<ha-icon icon="mdi:playlist-music"></ha-icon>`}${localize('search.labels.replace_next')}
        </button>
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'add')} title="${localize('search.labels.add')}">
          ${searchView === 'card' ? nothing : html`<ha-icon icon="mdi:playlist-plus"></ha-icon>`}${localize('search.labels.add')}
        </button>
      `}
      <div class="slide-out-close" @click=${(e) => { e.stopPropagation(); onOptionsToggle(null); }}>
        <ha-icon icon="mdi:close"></ha-icon>
      </div>

      ${isSuccess ? html`
        <div class="search-row-success-overlay">
          <span>✅</span>
          <span>${localize('search.added')}</span>
        </div>
      ` : nothing}
    </div>
  `;
}

export function renderSearchSheet({
  open,
  query,
  onQueryInput,
  onSearch,
  onClose,
  loading,
  results,
  onPlay,
  onQueue,
  error,
  showQueueSuccess,
  matchTheme = false, // Add matchTheme parameter
  upcomingFilterActive = false, // Add upcoming filter parameter
  disableAutofocus = false,
  activeSearchRowMenuId,
  successSearchRowMenuId,
  onOptionsToggle,
  onPlayOption,
  onResultClick,
  searchView = 'list',
  searchCardColumns = 4,
  massQueueAvailable = false,
  onMoveUp,
  onMoveDown,
  onMoveNext,
  onRemove,
}) {
  if (!open) return nothing;
  return html`
    <div class="search-sheet" data-match-theme="${matchTheme}" data-card-view="${searchView === 'card'}">
      <div class="search-sheet-header">
        <input
          type="text"
          .value=${query || ""}
          @input=${onQueryInput}
          placeholder="${localize('editor.placeholders.search')}"
          ?autofocus=${!disableAutofocus}
        />
        <button @click=${onSearch} ?disabled=${loading || !query}>${localize('common.search')}</button>
        <button @click=${onClose} title="${localize('search.close')}">✕</button>
      </div>
      ${loading ? html`<div class="search-sheet-loading">${localize('common.loading')}</div>` : nothing}
      ${error ? html`<div class="search-sheet-error">${error}</div>` : nothing}
      <div class="search-sheet-results ${searchView === 'card' ? 'search-results-card-view' : 'list-view'}">
        ${(results || []).length === 0 && !loading
      ? html`<div class="search-sheet-empty">${localize('common.no_results')}</div>`
      : (results || []).map(
        (item) => {
          const isMA = isMusicAssistantEntity(item.media_content_id);
          // For now we assume massQueue functionality is available if it's MA 
          // (matching simplified search-sheet logic)
          return html`
                <div class="search-sheet-result ${searchView === 'card' ? 'search-result-card' : ''}">
                  <div class="search-sheet-thumb-container" 
                       data-clickable="${searchView === 'card'}"
                       @click=${searchView === 'card' ? () => onPlay(item) : null}>
                    ${item.thumbnail && !String(item.thumbnail).includes('imageproxy') ? html`
                      <img
                        class="search-sheet-thumb"
                        src=${item.thumbnail}
                        alt=${item.title}
                        onerror="this.style.display='none'"
                      />
                    ` : html`
                      <div class="search-sheet-thumb-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `}
                    ${searchView === 'card' ? renderSearchResultActions({
            item,
            onPlay,
            onOptionsToggle,
            upcomingFilterActive,
            isMusicAssistant: isMA,
            massQueueAvailable,
            searchView: 'card',
            onMoveUp,
            onMoveDown,
            onMoveNext,
            onRemove,
          }) : nothing}
                  </div>
                  <div class="search-sheet-info">
                    <span 
                      class="search-sheet-title ${item.is_browsable ? 'browsable' : ''}" 
                      @click=${() => item.is_browsable && onResultClick && onResultClick(item)}
                    >
                      ${item.title}
                    </span>
                    ${item.artist ? html`
                      <span 
                        class="search-sheet-subtitle ${item.is_browsable ? 'browsable' : ''}" 
                        @click=${() => item.is_browsable && onResultClick && onResultClick(item)}
                      >
                        ${item.artist}
                      </span>
                    ` : nothing}
                    ${searchView === 'card' ? html`
                      <div class="card-menu-button" @click=${(e) => { e.preventDefault(); e.stopPropagation(); onOptionsToggle(item); }}>
                        <ha-icon icon="mdi:dots-vertical"></ha-icon>
                      </div>
                    ` : nothing}
                  </div>
                  ${searchView !== 'card' ? renderSearchResultActions({
            item,
            onPlay,
            onOptionsToggle,
            upcomingFilterActive,
            isMusicAssistant: isMA,
            massQueueAvailable,
            searchView: 'list',
            isInline: true,
            onMoveUp,
            onMoveDown,
            onMoveNext,
            onRemove,
          }) : nothing}
                  
                  ${renderSearchResultSlideOut({
            item,
            activeSearchRowMenuId,
            successSearchRowMenuId,
            onPlayOption,
            onOptionsToggle,
            searchView,
            isQueueItem: isMA && item.queue_item_id && upcomingFilterActive && massQueueAvailable,
            onMoveUp,
            onMoveDown,
            onMoveNext,
            onRemove,
          })}
                </div>
              `;
        }
      )}
      </div>
    </div>
  `;
}

export function renderSearchOptionsOverlay({ item, onClose, onPlayOption }) {
  if (!item) return nothing;

  return html`
    <div class="entity-options-overlay entity-options-overlay-opening" @click=${onClose}>
      <div class="entity-options-container entity-options-sheet-opening" @click=${(e) => e.stopPropagation()}>
        <div class="entity-options-sheet">
          <div class="entity-options-title">${item.title}</div>
          
          ${playOptions.map(option => html`
            <button class="entity-options-item menu-action-item" @click=${() => onPlayOption(item, option.mode)}>
              <ha-icon class="menu-action-icon" .icon=${option.icon}></ha-icon>
              <span class="menu-action-label">${option.label}</span>
            </button>
          `)}
          
          <div class="entity-options-divider"></div>
          
          <button class="entity-options-item close-item" @click=${onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
}

// Service helpers to keep search-related logic colocated with the search UI module
export async function searchMedia(hass, entityId, query, mediaType = null, searchParams = {}, searchResultsLimit = 20) {
  const configEntryId = await getMusicAssistantConfigEntryId(hass);
  // Try Music Assistant search if we have a config entry
  if (configEntryId) {
    try {


      // If favorites are requested, use Music Assistant get_library with favorite + search
      if (searchParams.favorites) {
        const mediaTypes = (mediaType && mediaType !== 'all')
          ? [mediaType]
          : ['artist', 'album', 'track', 'playlist', 'radio', 'audiobook', 'podcast'];
        const flatResultsFav = [];
        await Promise.all(
          mediaTypes.map(async (mt) => {
            const message = {
              type: "call_service",
              domain: "music_assistant",
              service: "get_library",
              service_data: {
                config_entry_id: configEntryId,
                media_type: mt,
                favorite: true,
                search: query,
              },
              return_response: true,
            };
            const favoritesLimit = resolveLimitValue(searchResultsLimit);
            if (favoritesLimit !== undefined) {
              message.service_data.limit = favoritesLimit;
            }
            if (searchParams.orderBy && searchParams.orderBy !== 'default') {
              message.service_data.order_by = searchParams.orderBy;
            }
            const favRes = await hass.connection.sendMessagePromise(message);
            const favResponse = favRes?.response;
            const items = favResponse?.items || [];
            items.forEach(item => {
              const transformedItem = transformMusicAssistantItem(item);
              if (transformedItem) {
                flatResultsFav.push(transformedItem);
              }
            });
          })
        );
        return { results: flatResultsFav, usedMusicAssistant: true };
      }

      // If query is empty and we have a specific media type (not 'all'), treat as browsing the library
      if ((!query || query.trim() === '') && mediaType && mediaType !== 'all' && !searchParams.favorites) {
        // Validate media type strictly
        const allowedMediaTypes = ['artist', 'album', 'track', 'playlist', 'radio', 'audiobook', 'podcast'];
        if (!allowedMediaTypes.includes(mediaType)) {
          console.warn(`yamp: Unsupported media type for browsing: ${mediaType}. Skipping get_library call.`);
          return { results: [], usedMusicAssistant: true };
        }

        const message = {
          type: "call_service",
          domain: "music_assistant",
          service: "get_library",
          service_data: {
            config_entry_id: configEntryId,
            media_type: mediaType
            // favorite param omitted to get ALL items
          },
          return_response: true,
        };

        const limit = resolveLimitValue(searchResultsLimit);
        if (limit !== undefined) {
          message.service_data.limit = limit;
        }
        if (searchParams.orderBy && searchParams.orderBy !== 'default') {
          message.service_data.order_by = searchParams.orderBy;
        }

        const res = await hass.connection.sendMessagePromise(message);
        const response = res?.response;
        const items = response?.items || [];

        const browseResults = [];
        items.forEach(item => {
          const transformedItem = transformMusicAssistantItem(item);
          if (transformedItem) {
            browseResults.push(transformedItem);
          }
        });

        return { results: browseResults, usedMusicAssistant: true };
      }

      const serviceData = {
        name: query,
        config_entry_id: configEntryId,
      };
      const searchLimit = resolveLimitValue(
        searchResultsLimit,
        { cap: mediaType === "all" ? 8 : undefined }
      );
      if (searchLimit !== undefined) {
        serviceData.limit = searchLimit; // Use configurable limit for filtered searches
      }

      // Add media_type if specified and not "all"
      if (mediaType && mediaType !== 'all') {
        serviceData.media_type = mediaType;
      }

      // Add search parameters for hierarchical search
      if (searchParams.artist) {
        serviceData.artist = searchParams.artist;
      }
      if (searchParams.album) {
        serviceData.album = searchParams.album;
      }




      const msg = {
        type: "call_service",
        domain: "music_assistant",
        service: "search",
        service_data: serviceData,
        return_response: true,
      };

      const res = await hass.connection.sendMessagePromise(msg);


      const response = res?.response;
      if (response) {


        // Convert grouped results to flat array and transform to expected format
        const flatResults = [];
        Object.entries(response).forEach(([mediaType, items]) => {
          if (Array.isArray(items)) {

            items.forEach(item => {
              const transformedItem = transformMusicAssistantItem(item);
              if (transformedItem) {
                flatResults.push(transformedItem);
              }
            });
          }
        });


        return { results: flatResults, usedMusicAssistant: true };
      }


    } catch (error) {
      console.error('yamp: Error in searchMedia:', error);
    }
  }

  // Fallback to media_player search
  const fallbackResults = await fallbackToMediaPlayerSearch(hass, entityId, query, mediaType, searchParams);
  return { results: fallbackResults, usedMusicAssistant: false };
}

// Get favorites from Music Assistant
export async function getRecentlyPlayed(hass, entityId, mediaType = null, searchResultsLimit = 20, options = {}) {
  const configEntryId = await getMusicAssistantConfigEntryId(hass);
  if (!configEntryId) {
    return { results: [], usedMusicAssistant: false };
  }
  const onChunk = typeof options.onChunk === "function" ? options.onChunk : null;
  const fetchMediaType = async (mt, limitArgs = {}) => {
    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: {
        config_entry_id: configEntryId,
        media_type: mt,
        order_by: "last_played_desc",
      },
      return_response: true,
    };
    const appliedLimit = resolveLimitValue(searchResultsLimit, limitArgs);
    if (appliedLimit !== undefined) {
      message.service_data.limit = appliedLimit;
    }
    const response = await hass.connection.sendMessagePromise(message);
    const items = response?.response?.items || [];
    return items
      .map(transformMusicAssistantItem)
      .filter(Boolean);
  };

  try {
    if (mediaType === 'all') {
      const mediaTypes = ['track', 'album', 'artist', 'playlist'];
      const allResults = [];
      await Promise.all(
        mediaTypes.map(async (mt) => {
          const chunk = await fetchMediaType(mt, { cap: 5 });
          if (chunk.length) {
            allResults.push(...chunk);
            if (onChunk) {
              onChunk(chunk, mt);
            }
          }
        })
      );
      return { results: allResults, usedMusicAssistant: true };
    }

    const chunk = await fetchMediaType(mediaType || 'track');
    if (chunk.length && onChunk) {
      onChunk(chunk, mediaType || 'track');
    }
    return { results: chunk, usedMusicAssistant: true };
  } catch (error) {
    console.error('yamp: Error getting recently played from Music Assistant:', error);
    return { results: [], usedMusicAssistant: false };
  }
}

export async function getFavorites(hass, entityId, mediaType = null, searchResultsLimit = 20, options = {}) {
  const configEntryId = await getMusicAssistantConfigEntryId(hass);
  if (!configEntryId) {
    return { results: [], usedMusicAssistant: false };
  }

  const onChunk = typeof options.onChunk === "function" ? options.onChunk : null;
  const fetchFavoritesForType = async (type) => {
    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: {
        config_entry_id: configEntryId,
        media_type: type,
        favorite: true,
      },
      return_response: true,
    };
    const favoritesLimit = resolveLimitValue(
      searchResultsLimit,
      { cap: type === "all" ? 8 : undefined }
    );
    if (favoritesLimit !== undefined) {
      message.service_data.limit = favoritesLimit;
    }
    if (options.orderBy && options.orderBy !== 'default') {
      message.service_data.order_by = options.orderBy;
    }
    try {
      const res = await hass.connection.sendMessagePromise(message);
      const response = res?.response;
      const items = response?.items || [];
      return items
        .map(transformMusicAssistantItem)
        .filter(Boolean);
    } catch (error) {
      console.error('yamp: Error loading favorites for type', type, error);
      return [];
    }
  };

  try {
    if (mediaType && mediaType !== 'all') {
      const chunk = await fetchFavoritesForType(mediaType);
      if (chunk.length && onChunk) {
        onChunk(chunk, mediaType);
      }
      return { results: chunk, usedMusicAssistant: true };
    }

    const mediaTypes = ['artist', 'album', 'track', 'playlist', 'radio', 'podcast', 'audiobook'];
    const flatResults = [];
    await Promise.all(
      mediaTypes.map(async (type) => {
        const chunk = await fetchFavoritesForType(type);
        if (chunk.length) {
          flatResults.push(...chunk);
          if (onChunk) {
            onChunk(chunk, type);
          }
        }
      })
    );

    return { results: flatResults, usedMusicAssistant: true };
  } catch (error) {
    console.error('yamp: Error loading favorites', error);
    return { results: [], usedMusicAssistant: false };
  }
}

// Fallback function for media_player search
async function fallbackToMediaPlayerSearch(hass, entityId, query, mediaType, searchParams = {}) {
  const fallbackData = {
    entity_id: entityId,
    search_query: query,
  };

  if (mediaType && mediaType !== 'all') {
    fallbackData.media_content_type = mediaType;
  }

  // Note: Standard media_player search doesn't support advanced filtering
  // This would need to be handled by filtering results after the search

  const fallbackMsg = {
    type: "call_service",
    domain: "media_player",
    service: "search_media",
    service_data: fallbackData,
    return_response: true,
  };

  const fallbackRes = await hass.connection.sendMessagePromise(fallbackMsg);
  const results = fallbackRes?.response?.[entityId]?.result || fallbackRes?.result || [];


  return results;
}

export function playSearchedMedia(hass, entityId, item) {
  return hass.callService("media_player", "play_media", {
    entity_id: entityId,
    media_content_type: item.media_content_type,
    media_content_id: item.media_content_id,
  });
}

// Check if a track is favorited in Music Assistant
export async function isTrackFavorited(hass, mediaContentId, entityId = null, trackName = null, artistName = null, searchResultsLimit = 100) {
  if (!mediaContentId) {
    return false;
  }

  try {
    const configEntryId = await getMusicAssistantConfigEntryId(hass);
    if (!configEntryId) {
      return false;
    }

    // Use the provided entityId or try to find a Music Assistant entity
    let targetEntityId = entityId;
    if (!targetEntityId) {
      // Try to find a Music Assistant entity
      const states = Object.values(hass.states);
      const maEntity = states.find(state =>
        isMusicAssistantEntity(state) &&
        state.entity_id.startsWith('media_player.')
      );
      if (maEntity) {
        targetEntityId = maEntity.entity_id;
      } else {
        return false;
      }
    }

    // First try: Direct MA search by title/artist and inspect item's own favorite flag
    if (trackName || artistName) {
      try {
        const serviceData = {
          name: trackName || artistName,
          config_entry_id: configEntryId,
          media_type: 'track',
        };
        const searchLimit = resolveLimitValue(searchResultsLimit);
        if (searchLimit !== undefined) {
          serviceData.limit = searchLimit;
        }
        if (artistName) {
          serviceData.artist = artistName;
        }
        const searchMsg = {
          type: 'call_service',
          domain: 'music_assistant',
          service: 'search',
          service_data: serviceData,
          return_response: true,
        };
        const searchRes = await hass.connection.sendMessagePromise(searchMsg);
        const searchResponse = searchRes?.response;
        let searchItems = [];
        if (Array.isArray(searchResponse)) {
          searchItems = searchResponse;
        } else if (searchResponse && typeof searchResponse === 'object') {
          Object.values(searchResponse).forEach((val) => {
            if (Array.isArray(val)) {
              searchItems.push(...val);
            }
          });
        }
        if (searchItems.length) {
          const idPart = (mediaContentId.split('/').pop() || '').trim();
          const byUri = searchItems.find((it) => it?.uri === mediaContentId);
          const byId = !byUri && /^\d+$/.test(idPart)
            ? searchItems.find((it) => typeof it?.uri === 'string' && it.uri.endsWith(`/${idPart}`))
            : null;
          const foundItem = byUri || byId || null;
          if (foundItem && typeof foundItem.favorite === 'boolean') {
            return !!foundItem.favorite;
          }
        }
      } catch (e) {
        // Continue to next strategies
      }

      // Second try: Precise search with track name only (faster and simpler)
      if (trackName) {
        try {
          const message = {
            type: "call_service",
            domain: "music_assistant",
            service: "get_library",
            service_data: {
              config_entry_id: configEntryId,
              media_type: "track",
              favorite: true,
              search: trackName.trim(),
            },
            return_response: true,
          };
          const trackSearchLimit = resolveLimitValue(searchResultsLimit);
          if (trackSearchLimit !== undefined) {
            message.service_data.limit = trackSearchLimit; // Use configurable limit
          }
          const response = await hass.connection.sendMessagePromise(message);
          const favoriteTracks = response?.response?.items || [];
          if (favoriteTracks.some(track => track.uri === mediaContentId)) {
            return true;
          }
        } catch (e) {
          // Continue to fallback
        }
      }
    }

    // Fallback: Just get first 100 favorites (much faster than pagination)
    try {
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_library",
        service_data: {
          config_entry_id: configEntryId,
          media_type: "track",
          favorite: true,
        },
        return_response: true,
      };
      const fallbackLimit = resolveLimitValue(searchResultsLimit, { floor: 100 });
      if (fallbackLimit !== undefined) {
        message.service_data.limit = fallbackLimit; // Check at least 100 favorites for better matching
      }
      const response = await hass.connection.sendMessagePromise(message);
      const favoriteTracks = response?.response?.items || [];
      return favoriteTracks.some(t => t.uri === mediaContentId);
    } catch (getLibraryError) {
      // Fallback to false if get_library fails
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Get playlist tracks - similar to how the sonos card gets queue contents
