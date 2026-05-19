// Utility functions for Yet Another Media Player (YAMP)
import { localize } from "./localize/localize.js";
import { ARTWORK_OVERRIDE_MATCH_KEYS } from "./constants.js";

// WeakMap cache for compiled override regexes to avoid mutating config objects
const overrideRegexCache = new WeakMap();

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
 * Attempt to resolve a simple Jinja template string synchronously to bypass mobile WebView popup blockers.
 * Supports basic {{ state_attr(entity, attr) }}, {{ states(entity) }} and {{ variable }} patterns.
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {Object} context - Optional context variables to inject into the template
 * @returns {string|null} Resolved string, or null if it cannot be resolved synchronously
 */
export function resolveStringTemplateSync(hass, templateString, context = {}) {
  if (!templateString || typeof templateString !== 'string') return templateString;

  let decoded = templateString;
  if (/%7B%7B|%7B%25/i.test(decoded)) {
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {
      // Ignore
    }
  }

  if (!decoded.includes('{{') && !decoded.includes('{%')) {
    return decoded;
  }

  let result = decoded;
  let success = true;

  result = result.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, expression) => {
    let expr = expression.trim();

    // Check for urlencode filter
    let useUrlEncode = false;
    if (expr.endsWith('| urlencode')) {
      useUrlEncode = true;
      expr = expr.replace(/\|\s*urlencode$/, '').trim();
    } else if (expr.endsWith('|urlencode')) {
      useUrlEncode = true;
      expr = expr.replace(/\|urlencode$/, '').trim();
    }

    // 1. Check for state_attr(...)
    let stateAttrMatch = expr.match(/^state_attr\(\s*(['"]?)([\w.]+)\1\s*,\s*(['"]?)([\w_]+)\3\s*\)$/);
    if (stateAttrMatch) {
      let entityArg = stateAttrMatch[2];
      let entityId = (context[entityArg] !== undefined && !stateAttrMatch[1]) ? context[entityArg] : entityArg;
      let attrName = stateAttrMatch[4];

      const state = hass?.states?.[entityId];
      if (state && state.attributes && state.attributes[attrName] !== undefined) {
        let val = String(state.attributes[attrName]);
        return useUrlEncode ? encodeURIComponent(val) : val;
      }
      return '';
    }

    // 2. Check for states(...)
    let statesMatch = expr.match(/^states\(\s*(['"]?)([\w.]+)\1\s*\)$/);
    if (statesMatch) {
      let entityArg = statesMatch[2];
      let entityId = (context[entityArg] !== undefined && !statesMatch[1]) ? context[entityArg] : entityArg;

      const state = hass?.states?.[entityId];
      if (state && state.state !== undefined) {
        let val = String(state.state);
        return useUrlEncode ? encodeURIComponent(val) : val;
      }
      return '';
    }

    // 3. direct context variable matching
    if (/^[\w_]+$/.test(expr) && context[expr] !== undefined) {
      let val = String(context[expr]);
      return useUrlEncode ? encodeURIComponent(val) : val;
    }

    // If it's something complex we can't parse synchronously
    success = false;
    return match;
  });

  if (!success || result.includes('{%')) {
    return null;
  }

  return result;
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

  // For tracks, show "Browse tracks from [Album]"
  if (mediaType === 'track') {
    const albumName = item.album || item.media_album_name;
    if (albumName) {
      return localize('search.browse_album', '{album}', albumName);
    }
    return `${title} - ${artist}`;
  }

  // For albums, show "Album Name - Artist"
  if (mediaType === 'album') {
    return localize('search.browse_album', '{album}', title);
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

/**
 * Find and resolve artwork override from overrides list.
 * @param {Object} state - Home Assistant state object
 * @param {Array} overrides - Media artwork overrides configuration
 * @param {Function} [resolveOverrideSource] - Callback for template override resolution
 * @returns {Object|null} Resolved artwork override details, or null if none resolved
 */
function _findArtworkOverride(state, overrides, resolveOverrideSource) {
  if (!overrides || !Array.isArray(overrides) || !overrides.length) return null;

  const attrs = state.attributes;
  const entityId = state.entity_id;

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
        let cached = overrideRegexCache.get(override);
        if (!cached) {
          cached = {};
          overrideRegexCache.set(override, cached);
        }

        let regex = cached[key];
        if (regex === undefined) {
          if (typeof expected === "string" && expected.includes("*") && expected !== "*") {
            try {
              // Collapse consecutive asterisks to prevent ReDoS (e.g. **** -> *)
              const cleanExpected = expected.replace(/\*+/g, "*");
              // Limit maximum active wildcards to 5 to protect regex matching complexity
              const asteriskCount = (cleanExpected.match(/\*/g) || []).length;
              if (asteriskCount <= 5) {
                const regexPattern = cleanExpected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*");
                regex = new RegExp(`^${regexPattern}$`, "i");
                cached[key] = regex;
              } else {
                cached[key] = null;
                regex = null;
              }
            } catch (e) {
              cached[key] = null; // Cache compilation failure
              regex = null;
            }
          } else {
            cached[key] = null;
            regex = null;
          }
        }

        if (regex) {
          return regex.test(String(value || ""));
        }
        return value === expected;
      })
    );

  const hasExistingArtwork = getValidArtworkAttr(attrs, 'entity_picture_local') ||
    getValidArtworkAttr(attrs, 'entity_picture') ||
    getValidArtworkAttr(attrs, 'album_art');

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
    const resolvedOverride = typeof resolveOverrideSource === "function"
      ? resolveOverrideSource(override, overrideSource, overrideType, state)
      : overrideSource;
    if (resolvedOverride) {
      return {
        url: resolvedOverride,
        sizePercentage: override?.size_percentage,
        objectFit: override?.object_fit ?? null
      };
    }
  }

  return null;
}

/**
 * Get artwork URL from entity state, supporting entity_picture_local and overrides.
 * Consolidates wildcard/regex overrides, fallback SVGs, and hostname prefixes.
 *
 * @param {Object} state - Home Assistant state object
 * @param {Object} [options] - Configuration options
 * @param {string} [options.hostname] - Hostname prefix for relative URLs
 * @param {Array} [options.overrides] - Media artwork overrides configuration
 * @param {string} [options.fallbackArtwork] - Fallback artwork strategy ('smart' or direct URL)
 * @param {string} [options.artworkObjectFit] - Fit strategy; if "no_artwork", returns null URL
 * @param {Function} [options.resolveOverrideSource] - Callback for template override resolution
 * @returns {Object} { url: string|null, sizePercentage: number|null, objectFit: string|null }
 */
export function getArtworkUrl(state, {
  hostname = "",
  overrides = [],
  fallbackArtwork = null,
  artworkObjectFit = null,
  resolveOverrideSource = null
} = {}) {
  if (!state || !state.attributes) return null;

  const attrs = state.attributes;

  let artworkUrl = null;
  let sizePercentage = null;
  let objectFit = null;

  if (artworkObjectFit === "no_artwork") {
    return { url: null, sizePercentage: null, objectFit: "no_artwork" };
  }

  // Check for media artwork overrides first
  const resolvedOverride = _findArtworkOverride(state, overrides, resolveOverrideSource);
  if (resolvedOverride) {
    artworkUrl = resolvedOverride.url;
    sizePercentage = resolvedOverride.sizePercentage;
    objectFit = resolvedOverride.objectFit;
  }

  // If no override found, use standard artwork
  if (!artworkUrl) {
    artworkUrl = getValidArtworkAttr(attrs, 'entity_picture_local') ||
      getValidArtworkAttr(attrs, 'entity_picture') ||
      getValidArtworkAttr(attrs, 'album_art') ||
      null;
  }

  // If still no artwork, check for configured fallback artwork
  if (!artworkUrl && fallbackArtwork) {
    if (fallbackArtwork === 'smart') {
      const isTV = attrs.media_title === 'TV' || attrs.media_channel ||
        attrs.app_id === 'tv' || attrs.app_id === 'androidtv';
      if (isTV) {
        artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvcj4KPHJlY3QgeD0iNjgiIHk9IjEyMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHJlY3QgeD0iODAiIHk9IjEzMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==';
      } else {
        artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI5OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=';
      }
    } else if (typeof fallbackArtwork === 'string') {
      artworkUrl = fallbackArtwork;
    }
  }

  // Apply hostname prefix if configured and artwork URL is relative
  if (artworkUrl && hostname && !/^https?:\/\//i.test(artworkUrl) && !artworkUrl.startsWith('data:')) {
    const cleanHost = hostname.endsWith('/') ? hostname.slice(0, -1) : hostname;
    const cleanUrl = artworkUrl.startsWith('/') ? artworkUrl : `/${artworkUrl}`;
    artworkUrl = cleanHost + cleanUrl;
  }

  return { url: artworkUrl, sizePercentage, objectFit };
}