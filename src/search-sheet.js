// import { LitElement, html, css, nothing } from "lit";
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
 * @param {string} [opts.error] - Optional error message.
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
  error,
}) {
  if (!open) return nothing;
  return html`
    <div class="search-sheet">
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
                  <button class="search-sheet-play" @click=${() => onPlay(item)}>
                    ▶
                  </button>
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
  const fallbackResults = await fallbackToMediaPlayerSearch(hass, entityId, query, mediaType);
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
async function fallbackToMediaPlayerSearch(hass, entityId, query, mediaType) {
  const fallbackData = {
    entity_id: entityId,
    search_query: query,
  };
  
  if (mediaType && mediaType !== 'all') {
    fallbackData.media_content_type = mediaType;
  }
  
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