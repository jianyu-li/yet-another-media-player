// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { LitElement, html, css, nothing } from "lit";

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
 */
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
}) {
  if (!open) return nothing;
  return html`
    <div class="search-sheet" data-match-theme="${matchTheme}">
      <div class="search-sheet-header">
        <input
          type="text"
          .value=${query || ""}
          @input=${onQueryInput}
          placeholder="Search music..."
          autofocus
        />
        <button @click=${onSearch} ?disabled=${loading || !query}>Search</button>
        <button @click=${onClose} title="Close Search">✕</button>
      </div>
      ${loading ? html`<div class="search-sheet-loading">Loading...</div>` : nothing}
      ${error ? html`<div class="search-sheet-error">${error}</div>` : nothing}
      ${showQueueSuccess ? html`<div class="search-sheet-success">✅ Added to queue!</div>` : nothing}
      <div class="search-sheet-results">
        ${(results || []).length === 0 && !loading
          ? html`<div class="search-sheet-empty">No results.</div>`
          : (results || []).map(
              (item) => html`
                <div class="search-sheet-result">
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
                  <span class="search-sheet-title">${item.title}</span>
                  ${item.artist ? html`
                    <span class="search-sheet-subtitle" style="display:block;color:var(--secondary-text-color,#888);font-size:0.9em;margin-top:2px;">
                      ${item.artist}
                    </span>
                  ` : nothing}
                  <div class="search-sheet-buttons">
                    <button class="search-sheet-play" @click=${() => onPlay(item)} title="Play Now">
                      ▶
                    </button>
                    ${!(upcomingFilterActive && item.queue_item_id) ? html`
                      <button class="search-sheet-queue" @click=${(e) => { e.preventDefault(); e.stopPropagation(); onQueue(item); }} title="Add to Queue">
                        <ha-icon icon="mdi:playlist-play"></ha-icon>
                      </button>
                    ` : nothing}
                  </div>
                </div>
              `
            )}
      </div>
    </div>
  `;
}

// Service helpers to keep search-related logic colocated with the search UI module
export async function searchMedia(hass, entityId, query, mediaType = null, searchParams = {}, searchResultsLimit = 20) {

  
  // Try to get Music Assistant config entry ID
  let configEntryId = null;
  try {
  
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    const maEntries = entries.filter(entry => entry.domain === "music_assistant");
    const entry = maEntries.find(entry => entry.state === "loaded");
    if (entry) {
      configEntryId = entry.entry_id;
    
    }
  } catch (error) {
  
  }
  
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
            const favRes = await hass.connection.sendMessagePromise(message);
            const favResponse = favRes?.response;
            const items = favResponse?.items || [];
            items.forEach(item => {
              const transformedItem = {
                title: item.name,
                media_content_id: item.uri,
                media_content_type: item.media_type,
                media_class: item.media_type,
                thumbnail: item.image,
                ...(item.artists && { artist: item.artists.map(a => a.name).join(', ') }),
                ...(item.album && { album: item.album.name })
              };
              flatResultsFav.push(transformedItem);
            });
          })
        );
        return { results: flatResultsFav, usedMusicAssistant: true };
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
              // Transform Music Assistant format to media_player format
              const transformedItem = {
                title: item.name,
                media_content_id: item.uri,
                media_content_type: item.media_type,
                media_class: item.media_type,
                thumbnail: item.image,
                // Add artist info if available
                ...(item.artists && { artist: item.artists.map(a => a.name).join(', ') }),
                // Add album info if available
                ...(item.album && { album: item.album.name })
              };
              flatResults.push(transformedItem);
            });
          }
        });
        

        return { results: flatResults, usedMusicAssistant: true };
      }
      

    } catch (error) {
      console.error('yamp: Error in searchMedia:', error);
    }
  } else {

  }
  
  // Fallback to media_player search
  const fallbackResults = await fallbackToMediaPlayerSearch(hass, entityId, query, mediaType, searchParams);
  return { results: fallbackResults, usedMusicAssistant: false };
}

// Get favorites from Music Assistant
export async function getRecentlyPlayed(hass, entityId, mediaType = null, searchResultsLimit = 20) {
  
  // Try to get Music Assistant config entry ID
  let configEntryId = null;
  try {
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    const maEntries = entries.filter(entry => entry.domain === "music_assistant");
    const entry = maEntries.find(entry => entry.state === "loaded");
    if (entry) {
      configEntryId = entry.entry_id;
    }
  } catch (error) {
    console.error('yamp: Error getting Music Assistant config entry:', error);
  }
  
  if (!configEntryId) {
    return { results: [], usedMusicAssistant: false };
  }
  
  try {
    // Handle "all" media type by getting multiple types and combining
    if (mediaType === 'all') {
      const mediaTypes = ['track', 'album', 'artist', 'playlist'];
      const allResults = [];
      
      await Promise.all(
        mediaTypes.map(async (mt) => {
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
          const recentLimit = resolveLimitValue(searchResultsLimit, { cap: 5 });
          if (recentLimit !== undefined) {
            message.service_data.limit = recentLimit; // Limit each type to avoid too many results
          }
          
          const response = await hass.connection.sendMessagePromise(message);
          const items = response?.response?.items || [];
          allResults.push(...items);
        })
      );
      
      // Transform Music Assistant format to media_player format
      const transformedResults = allResults.map(item => ({
        title: item.name,
        media_content_id: item.uri,
        media_content_type: item.media_type,
        media_class: item.media_type,
        thumbnail: item.image,
        // Add artist info if available
        ...(item.artists && { artist: item.artists.map(a => a.name).join(', ') }),
        // Add album info if available
        ...(item.album && { album: item.album.name })
      }));
      return { results: transformedResults || [], usedMusicAssistant: true };
    } else {
      // Single media type
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_library",
        service_data: {
          config_entry_id: configEntryId,
          media_type: mediaType || "track",
          order_by: "last_played_desc",
        },
        return_response: true,
      };
      const recentSingleLimit = resolveLimitValue(searchResultsLimit);
      if (recentSingleLimit !== undefined) {
        message.service_data.limit = recentSingleLimit;
      }
      
      const response = await hass.connection.sendMessagePromise(message);
      const items = response?.response?.items || [];
      
      // Transform Music Assistant format to media_player format
      const transformedResults = items.map(item => ({
        title: item.name,
        media_content_id: item.uri,
        media_content_type: item.media_type,
        media_class: item.media_type,
        thumbnail: item.image,
        // Add artist info if available
        ...(item.artists && { artist: item.artists.map(a => a.name).join(', ') }),
        // Add album info if available
        ...(item.album && { album: item.album.name })
      }));
      return { results: transformedResults || [], usedMusicAssistant: true };
    }
  } catch (error) {
    console.error('yamp: Error getting recently played from Music Assistant:', error);
    return { results: [], usedMusicAssistant: false };
  }
}

export async function getFavorites(hass, entityId, mediaType = null, searchResultsLimit = 20) {

  
  // Try to get Music Assistant config entry ID
  let configEntryId = null;
  try {
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    
    const maEntries = entries.filter(entry => entry.domain === "music_assistant");
    
    const entry = maEntries.find(entry => entry.state === "loaded");
    if (entry) {
      configEntryId = entry.entry_id;
    } else {
      // No loaded Music Assistant entry found
    }
  } catch (error) {

    return [];
  }
  
  if (!configEntryId) {

    return [];
  }
  
  try {
    const newResults = {
      artists: [],
      albums: [],
      tracks: [],
      playlists: [],
      radio: [],
      podcasts: [],
      audiobooks: [],
    };
    
    const mediaTypeResponseKeyMap = {
      artist: "artists",
      album: "albums", 
      track: "tracks",
      playlist: "playlists",
      radio: "radio",
      audiobook: "audiobooks",
      podcast: "podcasts",
    };
    
      const getResult = async (mediaType) => {
        const message = {
          type: "call_service",
          domain: "music_assistant",
          service: "get_library",
          service_data: {
            config_entry_id: configEntryId,
            media_type: mediaType,
            favorite: true,
          },
          return_response: true,
        };
        const favoritesLimit = resolveLimitValue(
          searchResultsLimit,
          { cap: mediaType === "all" ? 8 : undefined }
        );
        if (favoritesLimit !== undefined) {
          message.service_data.limit = favoritesLimit;
        }
      

      
      try {
        const res = await hass.connection.sendMessagePromise(message);

        
        const response = res?.response;
        if (response?.items) {
  
          return response.items;
        } else {

        }
        return [];
      } catch (e) {

        return [];
      }
    };
    
    if (mediaType && mediaType !== 'all') {
      // Get specific media type favorites
      const items = await getResult(mediaType);
      const responseKey = mediaTypeResponseKeyMap[mediaType];
      if (responseKey) {
        newResults[responseKey] = items;
      }
    } else {
      // Get all favorites
      const mediaTypes = Object.keys(mediaTypeResponseKeyMap);
      await Promise.all(
        mediaTypes.map(async (mediaType) => {
          const items = await getResult(mediaType);
          const responseKey = mediaTypeResponseKeyMap[mediaType];
          if (responseKey) {
            newResults[responseKey] = items;
          }
        })
      );
    }
    
    // Convert grouped results to flat array and transform to expected format
    const flatResults = [];
    Object.entries(newResults).forEach(([mediaType, items]) => {
      if (Array.isArray(items)) {
  
        items.forEach(item => {
          // Transform Music Assistant format to media_player format
          const transformedItem = {
            title: item.name,
            media_content_id: item.uri,
            media_content_type: item.media_type,
            media_class: item.media_type,
            thumbnail: item.image,
            // Add artist info if available
            ...(item.artists && { artist: item.artists.map(a => a.name).join(', ') }),
            // Add album info if available
            ...(item.album && { album: item.album.name })
          };
          flatResults.push(transformedItem);
        });
      }
    });
    

    return { results: flatResults, usedMusicAssistant: true };
    
     } catch (error) {
 
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
    // Get Music Assistant config entry ID
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    const maEntries = entries.filter(entry => entry.domain === "music_assistant");
    const entry = maEntries.find(entry => entry.state === "loaded");
    
    if (!entry) {
      return false;
    }

    const configEntryId = entry.entry_id;

    // Use the provided entityId or try to find a Music Assistant entity
    let targetEntityId = entityId;
    if (!targetEntityId) {
      // Try to find a Music Assistant entity
      const states = Object.values(hass.states);
      const maEntity = states.find(state => 
        state.attributes?.app_id === 'music_assistant' && 
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
