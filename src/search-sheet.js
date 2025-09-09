// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { LitElement, html, css, nothing } from "lit";

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
                  <img
                    class="search-sheet-thumb"
                    src=${item.thumbnail}
                    alt=${item.title}
                  />
                  <span class="search-sheet-title">${item.title}</span>
                  <div class="search-sheet-buttons">
                    <button class="search-sheet-play" @click=${() => onPlay(item)} title="Play Now">
                      ▶
                    </button>
                    <button class="search-sheet-queue" @click=${(e) => { e.preventDefault(); e.stopPropagation(); onQueue(item); }} title="Add to Queue">
                      <ha-icon icon="mdi:playlist-play"></ha-icon>
                    </button>
                  </div>
                </div>
              `
            )}
      </div>
    </div>
  `;
}

// Service helpers to keep search-related logic colocated with the search UI module
export async function searchMedia(hass, entityId, query, mediaType = null, searchParams = {}) {

  
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
                limit: mt === 'all' ? 8 : 20,
              },
              return_response: true,
            };
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
        limit: mediaType === "all" ? 8 : 20, // Use 20 limit for filtered searches
      };
      
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

    }
  } else {

  }
  
  // Fallback to media_player search
  const fallbackResults = await fallbackToMediaPlayerSearch(hass, entityId, query, mediaType, searchParams);
  return { results: fallbackResults, usedMusicAssistant: false };
}

// Get favorites from Music Assistant
export async function getFavorites(hass, entityId, mediaType = null) {

  
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
          limit: mediaType === "all" ? 8 : 20,
        },
        return_response: true,
      };
      

      
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
export async function isTrackFavorited(hass, mediaContentId, entityId = null, trackName = null, artistName = null) {
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
          limit: 20,
          media_type: 'track',
        };
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
              limit: 20, // Back to 20 results since we're less specific
            },
            return_response: true,
          };
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
          limit: 100, // Just check first 100 favorites
        },
        return_response: true,
      };
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
export async function getPlaylistTracks(hass, entityId, playlistId) {
  try {
  
    
    // Try to get playlist tracks using Music Assistant service
    const msg = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: {
        media_type: "track",
        search: playlistId,
        limit: 100
      },
      return_response: true,
    };
    
    const res = await hass.connection.sendMessagePromise(msg);
    
    
    const result = res?.response || res?.result || {};
    return result.items || [];
  } catch (error) {
    
    
    // Fallback: try to browse the playlist
    try {
      const browseMsg = {
        type: "call_service",
        domain: "media_player",
        service: "browse_media",
        service_data: {
          entity_id: entityId,
          media_content_id: playlistId,
        },
        return_response: true,
      };
      
      const browseRes = await hass.connection.sendMessagePromise(browseMsg);

      
      const browseResult = browseRes?.response?.[entityId]?.result || browseRes?.result || {};
      return browseResult.children || [];
    } catch (browseError) {

      return [];
    }
  }
}