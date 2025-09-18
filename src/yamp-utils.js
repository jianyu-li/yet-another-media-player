// Utility functions for Yet Another Media Player

/**
 * Resolve a Jinja template string at runtime
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {string} fallbackEntityId - Fallback entity ID if template resolution fails
 * @returns {Promise<string>} Resolved entity ID
 */
export async function resolveTemplateAtActionTime(hass, templateString, fallbackEntityId) {
  if (!templateString || typeof templateString !== 'string') return fallbackEntityId;

  // Not a template — return as-is
  if (!templateString.includes('{{') && !templateString.includes('{%')) {
    return templateString;
  }

  try {
    const res = await hass.callApi('POST', 'template', { template: templateString });
    const out = (res || '').toString().trim();
    // Basic validation: must look like an entity_id
    if (out && /^([a-z_]+)\.[A-Za-z0-9_]+$/.test(out)) return out;
    return fallbackEntityId;
  } catch (error) {
    return fallbackEntityId; // Fallback to main entity
  }
}

/**
 * Find button entities associated with a Music Assistant entity
 * @param {Object} hass - Home Assistant object
 * @param {string} maEntityId - Music Assistant entity ID
 * @returns {Array} Array of associated button entities
 */
export function findAssociatedButtonEntities(hass, maEntityId) {
  if (!hass?.states || !maEntityId) return [];
  
  const buttonEntities = [];
  const maEntity = hass.states[maEntityId];
  if (!maEntity) return [];
  
  // Look for button entities that might be associated with this MA entity
  // Common patterns: device_id matching, friendly_name similarity, or device_class
  const maDeviceId = maEntity.attributes?.device_id;
  const maFriendlyName = maEntity.attributes?.friendly_name || maEntityId;
  
  // Search through all button entities
  for (const [entityId, state] of Object.entries(hass.states)) {
    if (entityId.startsWith('button.') && state.attributes) {
      const buttonDeviceId = state.attributes.device_id;
      const buttonFriendlyName = state.attributes.friendly_name || entityId;
      
      // Check if this button is associated with the same device
      if (maDeviceId && buttonDeviceId === maDeviceId) {
        buttonEntities.push({
          entity_id: entityId,
          friendly_name: buttonFriendlyName,
          device_class: state.attributes.device_class,
          reason: 'same_device'
        });
      }
      // Check for name similarity (e.g., "HomePod Favorite" button for "HomePod" MA entity)
      else if (buttonFriendlyName.toLowerCase().includes(maFriendlyName.toLowerCase()) ||
               maFriendlyName.toLowerCase().includes(buttonFriendlyName.toLowerCase())) {
        buttonEntities.push({
          entity_id: entityId,
          friendly_name: buttonFriendlyName,
          device_class: state.attributes.device_class,
          reason: 'name_similarity'
        });
      }
    }
  }
  
  return buttonEntities;
}

/**
 * Get Music Assistant state for a given entity
 * @param {Object} hass - Home Assistant object
 * @param {string} entityId - Entity ID to get MA state for
 * @returns {Object|null} Music Assistant state object or null
 */
export function getMusicAssistantState(hass, entityId) {
  if (!hass?.states || !entityId) return null;
  
  const state = hass.states[entityId];
  if (!state) return null;
  
  // Check if this entity has Music Assistant attributes
  const hasMaAttributes = state.attributes && (
    state.attributes.media_content_id ||
    state.attributes.media_content_type ||
    state.attributes.media_album_name ||
    state.attributes.media_artist ||
    state.attributes.media_title
  );
  
  return hasMaAttributes ? state : null;
}

/**
 * Get search result click title for an item
 * @param {Object} item - Search result item
 * @returns {string} Title to display
 */
export function getSearchResultClickTitle(item) {
  if (!item) return '';
  
  // For tracks, show "Track Name - Artist"
  if (item.media_type === 'track') {
    const title = item.name || item.media_title || 'Unknown Track';
    const artist = item.artists?.[0] || item.media_artist || 'Unknown Artist';
    return `${title} - ${artist}`;
  }
  
  // For albums, show "Album Name - Artist"
  if (item.media_type === 'album') {
    const title = item.name || item.media_album_name || 'Unknown Album';
    const artist = item.artists?.[0] || item.media_artist || 'Unknown Artist';
    return `${title} - ${artist}`;
  }
  
  // For artists, just show the name
  if (item.media_type === 'artist') {
    return item.name || 'Unknown Artist';
  }
  
  // For playlists, show the name
  if (item.media_type === 'playlist') {
    return item.name || 'Unknown Playlist';
  }
  
  // Default fallback
  return item.name || item.media_title || 'Unknown';
}