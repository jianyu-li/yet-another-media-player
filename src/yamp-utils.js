// Utility functions for Yet Another Media Player (YAMP)

/**
 * Get a valid artwork attribute value (non-empty string with content)
 * @param {Object} attrs - Entity attributes object
 * @param {string} key - Attribute key to check
 * @returns {string|null} The attribute value if valid, null otherwise
 */
export function getValidArtworkAttr(attrs, key) {
  const val = attrs?.[key];
  // Must be a non-empty string with actual content
  if (typeof val === 'string' && val.trim() !== '') {
    return val;
  }
  return null;
}

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
 * Resolve a generic Jinja template string at runtime (no entity validation)
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {Object} context - Optional context variables to inject into the template
 * @returns {Promise<string>} Resolved string
 */
export async function resolveStringTemplate(hass, templateString, context = {}) {
  if (!templateString || typeof templateString !== 'string') return templateString;

  // Not a template — return as-is
  if (!templateString.includes('{{') && !templateString.includes('{%')) {
    // Check for URL-encoded templates (%7B%7B or %7B%25)
    if (/%7B%7B|%7B%25/i.test(templateString)) {
      try {
        templateString = decodeURIComponent(templateString);
      } catch (e) {
        // Ignore decode error
      }
    }

    // Re-check after decoding
    if (!templateString.includes('{{') && !templateString.includes('{%')) {
      return templateString;
    }
  }

  // Inject context variables
  let finalTemplate = templateString;
  if (context && Object.keys(context).length > 0) {
    const setStatements = Object.entries(context)
      .map(([key, value]) => `{% set ${key} = ${JSON.stringify(value)} %}`)
      .join(' ');
    finalTemplate = `${setStatements} ${templateString}`;
  }

  try {
    const res = await hass.callApi('POST', 'template', { template: finalTemplate });
    return (res || '').toString().trim();
  } catch (error) {
    console.warn('yamp: Error resolving template:', templateString, error);
    return templateString; // Return original string on error
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
 * Check if an entity state belongs to a Music Assistant player
 * @param {Object} state - Home Assistant state object
 * @returns {boolean} True if it's a Music Assistant player
 */
export function isMusicAssistantEntity(state) {
  if (!state || !state.attributes) return false;
  return (
    state.attributes.app_id === 'music_assistant' ||
    state.attributes.mass_player_type !== undefined
  );
}

/**
 * Get search result click title for an item
 * @param {Object} item - Search result item
 * @returns {string} Title to display
 */
export function getSearchResultClickTitle(item) {
  if (!item) return '';

  // Normalize properties
  const mediaType = item.media_type || item.media_class || item.media_content_type;
  const title = item.name || item.title || item.media_title || 'Unknown Title';

  // Handle artist normalization
  const firstArtist = item.artists?.[0];
  const artist =
    item.artist ||
    firstArtist?.name ||
    (typeof firstArtist === 'string' ? firstArtist : undefined) ||
    item.media_artist ||
    'Unknown Artist';

  // For tracks, show "Track Name - Artist"
  if (mediaType === 'track') {
    return `${title} - ${artist}`;
  }

  // For albums, show "Album Name - Artist"
  if (mediaType === 'album') {
    return `${title} - ${artist}`;
  }

  // For artists, just show the name
  if (mediaType === 'artist') {
    return title;
  }

  // For playlists, show the name
  if (mediaType === 'playlist') {
    return title;
  }

  // Default fallback
  return title;
}