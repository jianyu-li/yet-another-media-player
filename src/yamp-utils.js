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
  if (typeof val === "string" && val.trim() !== "") {
    return val;
  }
  return null;
}

/**
 * Safely resolves the display name for an entity or state object, adhering to
 * Home Assistant's formatEntityName helper when available, falling back
 * to friendly_name or entity_id.
 *
 * @param {import("./types").HomeAssistant|null|undefined} hass - The Home Assistant instance
 * @param {import("./types").HassEntity|string|null|undefined} stateOrEntityId - Entity state object or entity ID
 * @returns {string} Formatted entity name
 */
export function getEntityName(hass, stateOrEntityId) {
  if (!stateOrEntityId) return "";
  const stateObj =
    typeof stateOrEntityId === "string" ? hass?.states?.[stateOrEntityId] : stateOrEntityId;

  if (!stateObj) {
    return typeof stateOrEntityId === "string" ? stateOrEntityId : "";
  }

  if (typeof hass?.formatEntityName === "function") {
    try {
      const formatted = hass.formatEntityName(stateObj);
      if (formatted) return formatted;
    } catch {
      // Gracefully fall back if unsupported arguments or error
    }
  }

  return stateObj.attributes?.friendly_name || stateObj.entity_id || "";
}

/**
 * Resolve a Jinja or JS template string at runtime
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {string} fallbackEntityId - Fallback entity ID if template resolution fails
 * @param {Record<string, any>} [context] - Optional context variables to inject into the template
 * @returns {Promise<string>} Resolved entity ID
 */
export async function resolveTemplateAtActionTime(
  hass,
  templateString,
  fallbackEntityId,
  context = {}
) {
  if (!templateString || typeof templateString !== "string") return fallbackEntityId;

  if (templateString.trim().startsWith("[[[") && templateString.trim().endsWith("]]]")) {
    try {
      const res = evaluateJsTemplate(templateString, /** @type {any} */ (hass), context);
      const out = (res ?? "").toString().trim();
      if (out && /^([a-z_]+)\.[A-Za-z0-9_]+$/.test(out)) return out;
      return fallbackEntityId;
    } catch {
      return fallbackEntityId;
    }
  }

  // Not a template — return as-is
  if (!templateString.includes("{{") && !templateString.includes("{%")) {
    return templateString;
  }

  try {
    const res = await hass.callApi("POST", "template", { template: templateString });
    const out = (res || "").toString().trim();
    // Basic validation: must look like an entity_id
    if (out && /^([a-z_]+)\.[A-Za-z0-9_]+$/.test(out)) return out;
    return fallbackEntityId;
  } catch (error) {
    return fallbackEntityId; // Fallback to main entity
  }
}

/**
 * Resolve a generic Jinja or JS template string at runtime (no entity validation)
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {Object} context - Optional context variables to inject into the template
 * @returns {Promise<string>} Resolved string
 */
export async function resolveStringTemplate(hass, templateString, context = {}) {
  if (!templateString || typeof templateString !== "string") return templateString;

  let decoded = templateString;
  if (/%7B%7B|%7B%25|%5B%5B%5B/i.test(decoded)) {
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {
      // Ignore decode error
    }
  }

  if (decoded.trim().startsWith("[[[") && decoded.trim().endsWith("]]]")) {
    const res = evaluateJsTemplate(decoded, /** @type {any} */ (hass), context);
    return res !== undefined && res !== null ? String(res).trim() : "";
  }

  // Not a template — return as-is
  if (!decoded.includes("{{") && !decoded.includes("{%")) {
    return decoded;
  }

  // Inject context variables
  let finalTemplate = decoded;
  if (context && Object.keys(context).length > 0) {
    const setStatements = Object.entries(context)
      .map(([key, value]) => `{% set ${key} = ${JSON.stringify(value)} %}`)
      .join(" ");
    finalTemplate = `${setStatements} ${decoded}`;
  }

  try {
    const res = await hass.callApi("POST", "template", { template: finalTemplate });
    return (res || "").toString().trim();
  } catch (error) {
    console.warn("yamp: Error resolving template:", templateString, error);
    return templateString; // Return original string on error
  }
}

/**
 * Attempt to resolve a simple Jinja or JS template string synchronously to bypass mobile WebView popup blockers.
 * Supports basic {{ state_attr(entity, attr) }}, {{ states(entity) }} and {{ variable }} patterns.
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {Object} context - Optional context variables to inject into the template
 * @returns {string|null} Resolved string, or null if it cannot be resolved synchronously
 */
export function resolveStringTemplateSync(hass, templateString, context = {}) {
  if (!templateString || typeof templateString !== "string") return templateString;

  let decoded = templateString;
  if (/%7B%7B|%7B%25|%5B%5B%5B/i.test(decoded)) {
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {
      // Ignore
    }
  }

  if (decoded.trim().startsWith("[[[") && decoded.trim().endsWith("]]]")) {
    const res = evaluateJsTemplate(decoded, /** @type {any} */ (hass), context);
    return res !== undefined && res !== null ? String(res).trim() : null;
  }

  if (!decoded.includes("{{") && !decoded.includes("{%")) {
    return decoded;
  }

  let result = decoded;
  let success = true;

  result = result.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, expression) => {
    let expr = expression.trim();

    // Check for urlencode filter
    let useUrlEncode = false;
    if (expr.endsWith("| urlencode")) {
      useUrlEncode = true;
      expr = expr.replace(/\|\s*urlencode$/, "").trim();
    } else if (expr.endsWith("|urlencode")) {
      useUrlEncode = true;
      expr = expr.replace(/\|urlencode$/, "").trim();
    }

    // 1. Check for state_attr(...)
    let stateAttrMatch = expr.match(
      /^state_attr\(\s*(['"]?)([\w.]+)\1\s*,\s*(['"]?)([\w_]+)\3\s*\)$/
    );
    if (stateAttrMatch) {
      let entityArg = stateAttrMatch[2];
      let entityId =
        context[entityArg] !== undefined && !stateAttrMatch[1] ? context[entityArg] : entityArg;
      let attrName = stateAttrMatch[4];

      const state = hass?.states?.[entityId];
      if (state && state.attributes && state.attributes[attrName] !== undefined) {
        let val = String(state.attributes[attrName]);
        return useUrlEncode ? encodeURIComponent(val) : val;
      }
      return "";
    }

    // 2. Check for states(...) with optional equality check
    let statesMatch = expr.match(
      /^states\(\s*(['"]?)([\w.]+)\1\s*\)(?:\s*(==|!=)\s*(['"])(.*?)\4)?$/
    );
    if (statesMatch) {
      let entityArg = statesMatch[2];
      let entityId =
        context[entityArg] !== undefined && !statesMatch[1] ? context[entityArg] : entityArg;
      let operator = statesMatch[3];
      let compareVal = statesMatch[5];

      const state = hass?.states?.[entityId];
      let val = "unknown";
      if (state && state.state !== undefined) {
        val = String(state.state);
      }

      if (operator) {
        let isMatch = operator === "==" ? val === compareVal : val !== compareVal;
        let boolStr = isMatch ? "true" : "false";
        return useUrlEncode ? encodeURIComponent(boolStr) : boolStr;
      }

      return useUrlEncode ? encodeURIComponent(val) : val;
    }

    // 2.5 Check for is_state(...)
    let isStateMatch = expr.match(/^is_state\(\s*(['"]?)([\w.]+)\1\s*,\s*(['"])(.*?)\3\s*\)$/);
    if (isStateMatch) {
      let entityArg = isStateMatch[2];
      let entityId =
        context[entityArg] !== undefined && !isStateMatch[1] ? context[entityArg] : entityArg;
      let compareVal = isStateMatch[4];

      const state = hass?.states?.[entityId];
      let val = "unknown";
      if (state && state.state !== undefined) {
        val = String(state.state);
      }
      let boolStr = val === compareVal ? "true" : "false";
      return useUrlEncode ? encodeURIComponent(boolStr) : boolStr;
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

  if (!success || result.includes("{%")) {
    return null;
  }

  return result;
}

/**
 * Evaluates a client-side JavaScript template string enclosed within [[[ ... ]]].
 *
 * @param {string} templateStr - The template string to evaluate.
 * @param {import('./types.d.ts').HomeAssistant} hass - Home Assistant object.
 * @param {Record<string, any>} [context] - Context variables (e.g. from _getTemplateContext()).
 * @param {Record<string, any>} [compiledCache] - Optional cache dictionary for compiled functions.
 * @returns {any} Evaluated result, or undefined on error / when hass is not available, or original input if not a JS template.
 */
export function evaluateJsTemplate(templateStr, hass, context = {}, compiledCache = {}) {
  if (typeof templateStr !== "string") return templateStr;

  const trimmed = templateStr.trim();
  if (!trimmed.startsWith("[[[") || !trimmed.endsWith("]]]")) {
    return templateStr;
  }

  // Extract the JS code block
  const code = trimmed.substring(3, trimmed.length - 3).trim();

  try {
    if (!hass) return undefined;

    const states = hass.states;
    const user = hass.user;
    const is_state = (entity, state) => states?.[entity]?.state === state;
    const state_attr = (entity, attr) => states?.[entity]?.attributes?.[attr];

    // Compile and execute in context
    if (!compiledCache[code]) {
      const body = code.includes("return") ? code : `return (${code});`;
      compiledCache[code] = new Function(
        "hass",
        "states",
        "user",
        "is_state",
        "state_attr",
        "context",
        "current",
        "is_idle",
        "is_playing",
        "is_search",
        "is_grouping",
        "is_players",
        "is_group_players",
        "is_source",
        "is_lyrics",
        "is_options",
        "is_transfer_queue",
        "is_any_menu_open",
        "is_fullscreen",
        "is_full_screen",
        "is_dark_mode",
        "is_mobile",
        "is_music_assistant",
        "is_music",
        body
      );
    }
    return compiledCache[code](
      hass,
      states,
      user,
      is_state,
      state_attr,
      context,
      context?.current,
      context?.is_idle,
      context?.is_playing,
      context?.is_search,
      context?.is_grouping,
      context?.is_players ?? context?.is_grouping,
      context?.is_group_players ?? context?.is_grouping,
      context?.is_source,
      context?.is_lyrics,
      context?.is_options,
      context?.is_transfer_queue ?? context?.is_grouping,
      context?.is_any_menu_open,
      context?.is_fullscreen ?? context?.is_full_screen,
      context?.is_full_screen ?? context?.is_fullscreen,
      context?.is_dark_mode,
      context?.is_mobile,
      context?.is_music_assistant,
      context?.is_music
    );
  } catch (err) {
    console.warn("yamp: failed to evaluate JS template:", templateStr, err);
    return undefined;
  }
}

// WeakMap cache keyed by hass.entities to avoid recomputing for identical registry snapshots
const associatedButtonsRegistryCache = new WeakMap();

/**
 * Probe deterministic favorite button candidate entity IDs directly on hass.states
 * without enumerating all keys on hass.states.
 * @param {Object} hass - Home Assistant object
 * @param {string} maSuffix - Lowercase object_id suffix of the media player entity
 * @param {Record<string, any>|null} [reg] - Optional entity registry map
 * @returns {Array} Matching button descriptors
 */
function probeDirectButtonCandidates(hass, maSuffix, reg = null) {
  if (!maSuffix) return [];
  const directCandidates = [
    `button.${maSuffix}_favorite_current_song`,
    `button.${maSuffix}_favorite`,
    `button.${maSuffix}_preset_favorite`,
  ];
  const matches = [];
  for (const candidateId of directCandidates) {
    if (reg?.[candidateId]?.disabled_by) continue;
    const state = hass.states[candidateId];
    if (state?.attributes) {
      const buttonDisplayName = getEntityName(hass, state) || candidateId;
      matches.push({
        entity_id: candidateId,
        friendly_name: buttonDisplayName,
        device_class: state.attributes.device_class,
        reason: "entity_id_match",
      });
    }
  }
  return matches;
}

/**
 * Find button entities associated with a Music Assistant or media player entity
 * @param {Object} hass - Home Assistant object
 * @param {string} maEntityId - Music Assistant entity ID
 * @returns {Array} Array of associated button entities
 */
export function findAssociatedButtonEntities(hass, maEntityId) {
  if (!hass?.states || !maEntityId) return [];

  const maEntity = hass.states[maEntityId];
  if (!maEntity) return [];

  const maSuffix = maEntityId.includes(".") ? maEntityId.split(".")[1].toLowerCase() : "";
  const reg = hass.entities;
  if (reg && typeof reg === "object") {
    let cacheForRegistry = associatedButtonsRegistryCache.get(reg);
    if (cacheForRegistry?.has(maEntityId)) {
      return cacheForRegistry.get(maEntityId);
    }

    let hasRegistryEntries = false;
    for (const _k in reg) {
      hasRegistryEntries = true;
      break;
    }

    if (hasRegistryEntries) {
      if (!cacheForRegistry) {
        cacheForRegistry = new Map();
        associatedButtonsRegistryCache.set(reg, cacheForRegistry);
      }

      const sameDeviceButtons = [];
      const entityIdMatchButtons = [];
      const nameMatchButtons = [];
      let skippedMissingState = false;

      const maDeviceId = reg[maEntityId]?.device_id || maEntity.attributes?.device_id || null;
      const maDisplayName = getEntityName(hass, maEntity) || maEntityId;
      const maDisplayNameLower = maDisplayName.toLowerCase();

      for (const entityId in reg) {
        if (!entityId.startsWith("button.")) continue;

        const regEntry = reg[entityId];
        if (regEntry?.disabled_by) continue;
        const buttonDeviceId = regEntry?.device_id;

        // 1. Same device matching (most reliable & precise)
        if (maDeviceId && buttonDeviceId && buttonDeviceId === maDeviceId) {
          const state = hass.states[entityId];
          if (!state) {
            skippedMissingState = true;
            continue;
          }
          const buttonDisplayName = getEntityName(hass, state) || regEntry?.name || entityId;
          sameDeviceButtons.push({
            entity_id: entityId,
            friendly_name: buttonDisplayName,
            device_class: state.attributes?.device_class || regEntry?.device_class,
            reason: "same_device",
          });
          continue;
        }

        // 2. Entity ID match (e.g., button.amzn_echo_show_5_favorite for media_player.amzn_echo_show_5)
        if (maSuffix && entityId.toLowerCase().includes(maSuffix)) {
          const state = hass.states[entityId];
          if (!state) {
            skippedMissingState = true;
            continue;
          }
          const buttonDisplayName = getEntityName(hass, state) || regEntry?.name || entityId;
          entityIdMatchButtons.push({
            entity_id: entityId,
            friendly_name: buttonDisplayName,
            device_class: state.attributes?.device_class || regEntry?.device_class,
            reason: "entity_id_match",
          });
          continue;
        }

        // 3. Name similarity match
        if (regEntry?.name) {
          const customNameLower = regEntry.name.toLowerCase();
          if (
            !customNameLower.includes(maDisplayNameLower) &&
            !maDisplayNameLower.includes(customNameLower)
          ) {
            continue;
          }
        }
        const state = hass.states[entityId];
        if (!state) continue;
        const buttonDisplayName =
          getEntityName(hass, state) || regEntry?.name || regEntry?.original_name || "";
        if (buttonDisplayName) {
          const btnNameLower = buttonDisplayName.toLowerCase();
          if (
            btnNameLower.includes(maDisplayNameLower) ||
            maDisplayNameLower.includes(btnNameLower)
          ) {
            nameMatchButtons.push({
              entity_id: entityId,
              friendly_name: buttonDisplayName,
              device_class: state.attributes?.device_class || regEntry?.device_class,
              reason: "name_similarity",
            });
          }
        }
      }

      let buttonEntities = [...sameDeviceButtons, ...entityIdMatchButtons, ...nameMatchButtons];
      if (buttonEntities.length === 0) {
        buttonEntities = probeDirectButtonCandidates(hass, maSuffix, reg);
      }

      if (buttonEntities.length > 0 || !skippedMissingState) {
        cacheForRegistry.set(maEntityId, buttonEntities);
      } else {
        Object.defineProperty(buttonEntities, "_incomplete", { value: true });
      }
      return buttonEntities;
    }
  }

  // Fallback when hass.entities is not available (e.g. test environments without registry)
  // First probe deterministic button candidate IDs directly on hass.states to avoid enumerating keys
  const directMatches = probeDirectButtonCandidates(hass, maSuffix);
  if (directMatches.length > 0) {
    return directMatches;
  }

  // Final fallback: scan hass.states
  const buttonEntities = [];
  const maDeviceId = maEntity.attributes?.device_id;
  const maDisplayName = getEntityName(hass, maEntity) || maEntityId;
  const maDisplayNameLower = maDisplayName.toLowerCase();

  for (const [entityId, state] of Object.entries(hass.states)) {
    if (entityId.startsWith("button.") && state?.attributes) {
      const buttonDeviceId = state.attributes.device_id;
      const buttonDisplayName = getEntityName(hass, state) || entityId;

      if (maDeviceId && buttonDeviceId === maDeviceId) {
        buttonEntities.push({
          entity_id: entityId,
          friendly_name: buttonDisplayName,
          device_class: state.attributes.device_class,
          reason: "same_device",
        });
      } else if (maSuffix && entityId.toLowerCase().includes(maSuffix)) {
        buttonEntities.push({
          entity_id: entityId,
          friendly_name: buttonDisplayName,
          device_class: state.attributes.device_class,
          reason: "entity_id_match",
        });
      } else if (
        buttonDisplayName.toLowerCase().includes(maDisplayNameLower) ||
        maDisplayNameLower.includes(buttonDisplayName.toLowerCase())
      ) {
        buttonEntities.push({
          entity_id: entityId,
          friendly_name: buttonDisplayName,
          device_class: state.attributes.device_class,
          reason: "name_similarity",
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
  const hasMaAttributes =
    state.attributes &&
    (state.attributes.media_content_id ||
      state.attributes.media_content_type ||
      state.attributes.media_album_name ||
      state.attributes.media_artist ||
      state.attributes.media_title);

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
    state.attributes.app_id === "music_assistant" ||
    state.attributes.mass_player_type !== undefined ||
    Boolean(state.attributes.mass_player_id) ||
    Boolean(state.attributes.active_queue)
  );
}

/**
 * Get search result click title for an item
 * @param {Object} item - Search result item
 * @returns {string} Title to display
 */
export function getSearchResultClickTitle(item) {
  if (!item) return "";

  // Normalize properties
  const mediaType = item.media_type || item.media_class || item.media_content_type;
  const title = item.name || item.title || item.media_title || "Unknown Title";

  // Handle artist normalization
  const firstArtist = item.artists?.[0];
  const artist =
    item.artist ||
    firstArtist?.name ||
    (typeof firstArtist === "string" ? firstArtist : undefined) ||
    item.media_artist ||
    "Unknown Artist";

  // For tracks, show "Browse tracks from [Album]"
  if (mediaType === "track") {
    const albumName = item.album || item.media_album_name;
    if (albumName) {
      return localize("search.browse_album", "{album}", albumName);
    }
    return `${title} - ${artist}`;
  }

  // For albums, show "Album Name - Artist"
  if (mediaType === "album") {
    return localize("search.browse_album", "{album}", title);
  }

  // For artists, just show the name
  if (mediaType === "artist") {
    return title;
  }

  // For playlists, show "Browse tracks from [Playlist]"
  if (mediaType === "playlist") {
    return localize("search.browse_playlist", "{playlist}", title) || title;
  }

  // Default fallback
  return title;
}

/**
 * Find and resolve artwork override from overrides list.
 * @param {Object} state - Home Assistant state object
 * @param {Array} overrides - Media artwork overrides configuration
 * @param {Function} [resolveOverrideSource] - Callback for template override resolution
 * @param {Object} [options] - Additional options like aspectRatioCache
 * @returns {Object|null} Resolved artwork override details, or null if none resolved
 */
function _findArtworkOverride(state, overrides, resolveOverrideSource, options = {}) {
  if (!overrides || !Array.isArray(overrides) || !overrides.length) return null;

  const attrs = state?.attributes || {};
  const entityId = state?.entity_id;

  if (options.isIdleImageActive) {
    // When idle image is active, match idle_image overrides only (specific entity_id first, then general)
    const idleOverride = overrides.find(
      (item) =>
        (item?.idle_image === true ||
          item?.idle_image_url !== undefined ||
          item?.match_type === "idle_image") &&
        (!item?.entity_id || item.entity_id === entityId || item.entity_id === "*")
    );
    if (idleOverride) {
      const overrideSource = idleOverride.idle_image_url || idleOverride.image_url || null;
      let resolvedOverride = null;
      if (overrideSource) {
        resolvedOverride =
          typeof resolveOverrideSource === "function"
            ? resolveOverrideSource(idleOverride, overrideSource, "idle", state)
            : overrideSource;
      }
      return {
        url: resolvedOverride,
        sizePercentage: idleOverride?.size_percentage,
        objectFit: idleOverride?.object_fit ?? null,
        objectPosition: idleOverride?.object_position ?? null,
      };
    }
    return null;
  }

  const findSpecificMatch = () =>
    overrides.find((override) => {
      // Don't match idle_image rules when not in idle image mode
      if (override?.idle_image === true || override?.match_type === "idle_image") return false;

      return ARTWORK_OVERRIDE_MATCH_KEYS.some((key) => {
        const expected = override[key];
        if (expected === undefined || expected === null || expected === "") return false;

        if (key === "aspect_ratio") {
          const originalArtworkUrl =
            getValidArtworkAttr(attrs, "entity_picture_local") ||
            getValidArtworkAttr(attrs, "entity_picture") ||
            getValidArtworkAttr(attrs, "album_art") ||
            null;
          // Normalize url since cache keys might be normalized, but here we might just have the raw string.
          // In yet-another-media-player.js we normalized it. But let's check exact match.
          // Actually, we can check the cache directly.
          if (!originalArtworkUrl) return false;
          // Remove wrapping quotes/url() for cache lookup to match what _getArtworkUrl does
          let cacheKey = originalArtworkUrl.trim();
          const quoted =
            (cacheKey.startsWith("'") && cacheKey.endsWith("'")) ||
            (cacheKey.startsWith('"') && cacheKey.endsWith('"'));
          if (quoted && cacheKey.length >= 2) cacheKey = cacheKey.slice(1, -1).trim();
          const urlMatch = cacheKey.match(/^url\((.*)\)$/i);
          if (urlMatch && urlMatch[1] !== undefined) {
            cacheKey = urlMatch[1].trim();
            if (
              (cacheKey.startsWith("'") && cacheKey.endsWith("'")) ||
              (cacheKey.startsWith('"') && cacheKey.endsWith('"'))
            ) {
              cacheKey = cacheKey.slice(1, -1).trim();
            }
          }

          const actualRatio = options.aspectRatioCache
            ? options.aspectRatioCache[cacheKey]
            : undefined;
          if (actualRatio === undefined || actualRatio === null) return false;

          let targetRatio = parseFloat(expected);
          if (typeof expected === "string" && expected.includes(":")) {
            const parts = expected.split(":");
            if (
              parts.length === 2 &&
              !isNaN(Number(parts[0])) &&
              !isNaN(Number(parts[1])) &&
              parseFloat(parts[1]) !== 0
            ) {
              targetRatio = parseFloat(parts[0]) / parseFloat(parts[1]);
            }
          }

          if (isNaN(targetRatio)) return false;
          // Allow 0.1 tolerance (e.g., 16:9 is 1.77, 16:10 is 1.6 - if users aren't exact, or pixel rounding)
          return Math.abs(actualRatio - targetRatio) <= 0.1;
        }

        const value =
          key === "entity_id" ? entityId : key === "entity_state" ? state?.state : attrs[key];
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
                const regexPattern = cleanExpected
                  .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                  .replace(/\\\*/g, ".*");
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
      });
    });

  const hasExistingArtwork =
    getValidArtworkAttr(attrs, "entity_picture_local") ||
    getValidArtworkAttr(attrs, "entity_picture") ||
    getValidArtworkAttr(attrs, "album_art");

  let override = findSpecificMatch();
  let overrideSource = null;
  let overrideType = "image";

  if (override?.image_url) {
    overrideSource = override.image_url;
  } else if (override?.missing_art_url && !hasExistingArtwork) {
    overrideSource = override.missing_art_url;
    overrideType = "missing";
  } else if (override && hasExistingArtwork) {
    overrideSource =
      getValidArtworkAttr(attrs, "entity_picture_local") ||
      getValidArtworkAttr(attrs, "entity_picture") ||
      getValidArtworkAttr(attrs, "album_art");
  }

  if (!override && !hasExistingArtwork) {
    const missingOverride = overrides.find((item) => item?.missing_art_url);
    if (missingOverride?.missing_art_url) {
      override = missingOverride;
      overrideSource = missingOverride.missing_art_url;
      overrideType = "missing";
    }
  }

  if (override) {
    let resolvedOverride = null;
    if (overrideSource) {
      resolvedOverride =
        typeof resolveOverrideSource === "function"
          ? resolveOverrideSource(override, overrideSource, overrideType, state)
          : overrideSource;
    }

    return {
      url: resolvedOverride,
      sizePercentage: override?.size_percentage,
      objectFit: override?.object_fit ?? null,
      objectPosition: override?.object_position ?? null,
    };
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
 * @param {Record<string, number>} [options.aspectRatioCache] - Cache of aspect ratios
 * @param {boolean} [options.isIdleImageActive] - Whether an idle image is actively displayed
 * @returns {Object} { url: string|null, sizePercentage: number|null, objectFit: string|null }
 */
export function getArtworkUrl(
  state,
  {
    hostname = "",
    overrides = [],
    fallbackArtwork = null,
    artworkObjectFit = null,
    resolveOverrideSource = null,
    aspectRatioCache = {},
    isIdleImageActive = false,
  } = {}
) {
  if (!state || !state.attributes) return null;

  const attrs = state.attributes;

  let artworkUrl = null;
  let sizePercentage = null;
  let objectFit = null;

  if (artworkObjectFit === "no_artwork") {
    return { url: null, sizePercentage: null, objectFit: "no_artwork" };
  }

  // Check for media artwork overrides first
  const resolvedOverride = _findArtworkOverride(state, overrides, resolveOverrideSource, {
    aspectRatioCache: aspectRatioCache || {},
    isIdleImageActive,
  });
  let objectPosition = null;

  if (resolvedOverride) {
    artworkUrl = resolvedOverride.url;
    sizePercentage = resolvedOverride.sizePercentage;
    objectFit = resolvedOverride.objectFit;
    objectPosition = resolvedOverride.objectPosition;
  }

  // If no override found, use standard artwork (only when not in idle image mode)
  if (!artworkUrl && !isIdleImageActive) {
    artworkUrl =
      getValidArtworkAttr(attrs, "entity_picture_local") ||
      getValidArtworkAttr(attrs, "entity_picture") ||
      getValidArtworkAttr(attrs, "album_art") ||
      null;
  }

  // If still no artwork, check for configured fallback artwork (only when not in idle image mode)
  if (!artworkUrl && fallbackArtwork && !isIdleImageActive) {
    if (fallbackArtwork === "smart") {
      const isTV =
        attrs.media_title === "TV" ||
        attrs.media_channel ||
        attrs.app_id === "tv" ||
        attrs.app_id === "androidtv";
      if (isTV) {
        artworkUrl =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvcj4KPHJlY3QgeD0iNjgiIHk9IjEyMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHJlY3QgeD0iODAiIHk9IjEzMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==";
      } else {
        artworkUrl =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI5OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=";
      }
    } else if (typeof fallbackArtwork === "string") {
      artworkUrl = fallbackArtwork;
    }
  }

  artworkUrl = applyHostnameToUrl(artworkUrl, hostname);

  return { url: artworkUrl, sizePercentage, objectFit, objectPosition };
}

/**
 * Applies a hostname prefix to a relative URL.
 * @param {string} url - The artwork URL
 * @param {string} hostname - The hostname to prepend
 * @returns {string|null} The modified URL or null if invalid
 */
export function applyHostnameToUrl(url, hostname) {
  let finalUrl = url;

  // Apply hostname prefix if configured and artwork URL is relative
  if (finalUrl && hostname && !/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("data:")) {
    const cleanHost = hostname.endsWith("/") ? hostname.slice(0, -1) : hostname;
    const cleanUrl = finalUrl.startsWith("/") ? finalUrl : `/${finalUrl}`;
    finalUrl = cleanHost + cleanUrl;
  }

  // Validate artwork URL to prevent proxy errors (e.g. containing undefined/null)
  if (finalUrl && !isValidArtworkUrl(finalUrl)) {
    return null;
  }

  return finalUrl;
}

const secureThumbnailCache = new Map();
const inFlightThumbnailRequests = new Map();
const MAX_SECURE_THUMBNAIL_CACHE_SIZE = 500;

/**
 * Checks if a URL is an insecure http:// URL while running in an https: browser context.
 * Returns false in SSR/Node environments (when window is undefined) or when window.location.protocol is not "https:".
 * @param {string | null | undefined} [url]
 * @returns {boolean}
 */
export function isInsecureHttpUrlOnHttps(url) {
  if (!url || typeof url !== "string") return false;
  if (typeof window === "undefined" || window.location?.protocol !== "https:") {
    return false;
  }
  return /^http:\/\//i.test(url.trim());
}

/**
 * Retrieves a cached base64/secure data URI for a given thumbnail URL if available.
 * Refreshes the entry's position in the LRU cache on hit.
 * @param {string | null | undefined} [url]
 * @returns {string | null}
 */
export function getCachedSecureThumbnail(url) {
  if (!url || typeof url !== "string") return null;
  const cached = secureThumbnailCache.get(url);
  if (cached) {
    // Refresh LRU order on hit
    secureThumbnailCache.delete(url);
    secureThumbnailCache.set(url, cached);
    return cached;
  }
  return null;
}

/**
 * Clears or modifies the secure thumbnail cache (primarily for testing).
 * @param {string} [url]
 */
export function clearSecureThumbnailCache(url) {
  if (url) {
    secureThumbnailCache.delete(url);
    inFlightThumbnailRequests.delete(url);
  } else {
    secureThumbnailCache.clear();
    inFlightThumbnailRequests.clear();
  }
}

/**
 * Asynchronously resolves an insecure http:// thumbnail URL to a data:image;base64 URI
 * using the mass_queue/download_and_encode_image WebSocket command if available.
 * Caches resolved images in memory with an LRU cap.
 *
 * @param {any} hass - Home Assistant connection object with callWS
 * @param {string | null | undefined} [url] - Insecure artwork URL
 * @returns {Promise<string | null>} Base64 data URI or null if resolution fails
 */
export async function resolveSecureThumbnailUrl(hass, url) {
  if (!url || typeof url !== "string" || !hass?.callWS) {
    return null;
  }

  // If already cached, return immediately and refresh LRU order
  const cached = getCachedSecureThumbnail(url);
  if (cached) {
    return cached;
  }

  // Deduplicate concurrent in-flight requests for the same URL
  if (inFlightThumbnailRequests.has(url)) {
    return inFlightThumbnailRequests.get(url);
  }

  // Normalize /imageproxy/ URLs: change size=0 to size=256 to avoid downloading massive raw images
  let fetchUrl = url;
  if (fetchUrl.includes("/imageproxy/") && /[?&]size=0\b/.test(fetchUrl)) {
    fetchUrl = fetchUrl.replace(/([?&]size=)0\b/, "$1256");
  }

  const fetchPromise = (async () => {
    try {
      const response = await hass.callWS({
        type: "mass_queue/download_and_encode_image",
        url: fetchUrl,
      });

      if (response?.image && typeof response.image === "string") {
        if (secureThumbnailCache.size >= MAX_SECURE_THUMBNAIL_CACHE_SIZE) {
          const oldestKey = secureThumbnailCache.keys().next().value;
          secureThumbnailCache.delete(oldestKey);
        }
        secureThumbnailCache.set(url, response.image);
        return response.image;
      }
      return null;
    } catch (_error) {
      return null;
    } finally {
      inFlightThumbnailRequests.delete(url);
    }
  })();

  inFlightThumbnailRequests.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Validate artwork URL to prevent proxy errors
 * @param {string | null | undefined} [url] - Artwork URL to validate
 * @returns {boolean} True if valid
 */
export function isValidArtworkUrl(url) {
  if (!url || typeof url !== "string") return false;

  // Check for obviously invalid URLs
  if (url.includes("undefined") || url.includes("null") || url.trim() === "") return false;

  // Reject insecure HTTP URLs on HTTPS pages to prevent browser Mixed Content warnings
  if (isInsecureHttpUrlOnHttps(url)) return false;

  // Skip validation for data URLs and base64 images
  if (url.startsWith("data:")) return true;

  // Skip validation for localhost and relative URLs
  if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) return true;

  // Check for valid URL format
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getActionPlacement(action, index) {
  if (action?.placement !== undefined) {
    return action.placement;
  }
  // Legacy fallback
  if (typeof action?.in_menu === "string") return action.in_menu;
  if (action?.in_menu === "hidden") return "hidden";
  if (action?.in_menu === true) return "menu";
  return "chip";
}

/**
 * Checks if a given media title is a generic placeholder (such as "AirPlay", the entity's friendly name,
 * or the active app name) rather than genuine track/media metadata.
 *
 * @param {string|null|undefined} title - The media title to test
 * @param {string|null|undefined} [friendlyName] - The entity's friendly name
 * @param {string|null|undefined} [appName] - The active application name (e.g. "Infuse", "YouTube")
 * @returns {boolean} True if the title is considered a placeholder
 */
export function isPlaceholderMediaTitle(title, friendlyName, appName) {
  if (!title || typeof title !== "string") return true;
  const trimmed = title.trim().toLowerCase();
  if (trimmed === "" || trimmed === "airplay") return true;
  if (
    friendlyName &&
    typeof friendlyName === "string" &&
    trimmed === friendlyName.trim().toLowerCase()
  ) {
    return true;
  }
  if (appName && typeof appName === "string" && trimmed === appName.trim().toLowerCase()) {
    return true;
  }
  return false;
}

/**
 * Determines whether two paired media player entities are playing the same media/content.
 * Used when both the main entity and its paired Music Assistant entity are reporting playing state,
 * allowing the card to prioritize the main entity (e.g. Apple TV outputting audio to a HomePod).
 *
 * @param {import("./types").HassEntity|null|undefined} mainState - Main entity state object
 * @param {import("./types").HassEntity|null|undefined} maState - Music Assistant entity state object
 * @returns {boolean} True if both entities are determined to be playing the same media
 */
export function areEntitiesPlayingSameMedia(mainState, maState) {
  if (!mainState || !maState) return false;

  const mainAttrs = mainState.attributes || {};
  const maAttrs = maState.attributes || {};

  const mainTitle =
    typeof mainAttrs.media_title === "string" ? mainAttrs.media_title.trim().toLowerCase() : "";
  const maTitle =
    typeof maAttrs.media_title === "string" ? maAttrs.media_title.trim().toLowerCase() : "";

  // 1. Both entities have media_title and they match (case-insensitive)
  if (mainTitle && maTitle && mainTitle === maTitle) {
    return true;
  }

  // 2. Both entities have matching media_content_id
  const mainContentId = mainAttrs.media_content_id;
  const maContentId = maAttrs.media_content_id;
  if (mainContentId && maContentId && mainContentId === maContentId) {
    return true;
  }

  // 3. AirPlay receiver / sender indicators
  const mainName =
    typeof mainAttrs.friendly_name === "string" ? mainAttrs.friendly_name.trim().toLowerCase() : "";
  const maName =
    typeof maAttrs.friendly_name === "string" ? maAttrs.friendly_name.trim().toLowerCase() : "";
  const mainApp =
    typeof mainAttrs.app_name === "string" ? mainAttrs.app_name.trim().toLowerCase() : "";
  const maApp = typeof maAttrs.app_name === "string" ? maAttrs.app_name.trim().toLowerCase() : "";
  const mainAppId =
    typeof mainAttrs.app_id === "string" ? mainAttrs.app_id.trim().toLowerCase() : "";
  const maAppId = typeof maAttrs.app_id === "string" ? maAttrs.app_id.trim().toLowerCase() : "";
  const mainSource =
    typeof mainAttrs.source === "string" ? mainAttrs.source.trim().toLowerCase() : "";
  const maSource = typeof maAttrs.source === "string" ? maAttrs.source.trim().toLowerCase() : "";

  // Helper to test if a string signifies an AirPlay daemon or receiver
  const isAirPlayIndicator = (val) =>
    typeof val === "string" && (val === "airplay" || val.includes("tvairplay"));

  if (
    isAirPlayIndicator(maTitle) ||
    isAirPlayIndicator(maApp) ||
    isAirPlayIndicator(maSource) ||
    isAirPlayIndicator(maAppId)
  ) {
    return true;
  }
  if (
    isAirPlayIndicator(mainTitle) ||
    isAirPlayIndicator(mainApp) ||
    isAirPlayIndicator(mainSource) ||
    isAirPlayIndicator(mainAppId)
  ) {
    return true;
  }

  // 3b. App match: main entity app matches paired entity title, source, or app
  // (Common when Apple TV routes audio to HomePod/AirPlay: HomePod title or source is the tvOS app name like "Infuse" or "Disney+")
  if (mainApp && (maTitle === mainApp || maSource === mainApp || maApp === mainApp)) {
    return true;
  }
  if (maApp && (mainTitle === maApp || mainSource === maApp)) {
    return true;
  }
  if (mainAppId && maTitle && (mainAppId === maTitle || mainAppId.endsWith("." + maTitle))) {
    return true;
  }
  if (mainAppId && maSource && (mainAppId === maSource || mainAppId.endsWith("." + maSource))) {
    return true;
  }

  // 4. Cross-reference: one entity's title or source is the other's friendly_name
  if (mainName && (maTitle === mainName || maSource === mainName)) {
    return true;
  }
  if (maName && (mainTitle === maName || mainSource === maName)) {
    return true;
  }

  // 5. Main entity is playing with a title, but MA entity has no title
  // (Common when Apple TV AirPlays video/app audio to HomePod, which lacks track metadata)
  if (mainTitle && !maTitle) {
    return true;
  }

  // 6. Neither entity has a media_title (e.g. system sounds, video games, live streams)
  if (!mainTitle && !maTitle) {
    return true;
  }

  return false;
}

/**
 * @typedef {Object} ArtworkObject
 * @property {string|null} [url]
 * @property {number|null} [sizePercentage]
 * @property {string|null} [objectFit]
 * @property {string|null} [objectPosition]
 */

/**
 * Resolves artwork among metadata, playback, and main sources with intelligent fallbacks.
 * Prevents stale artwork from leaking when track titles mismatch.
 *
 * @param {Object} options
 * @param {ArtworkObject|null} [options.metadataArtwork] - Artwork object from the metadata entity.
 * @param {ArtworkObject|null} [options.playbackArtwork] - Artwork object from the playback control entity.
 * @param {ArtworkObject|null} [options.mainArtwork] - Artwork object from the main entity.
 * @param {string|null} [options.displayTitle] - The currently displayed track title.
 * @param {import("./types").HassEntity|null} [options.playbackStateObj] - State of playback entity.
 * @param {import("./types").HassEntity|null} [options.mainState] - State of main entity.
 * @param {boolean} [options.isPlayingSameMedia=false] - Whether entities are playing the same media.
 * @returns {ArtworkObject|null} Resolved artwork object or null.
 */
export function resolveSelectedArtwork({
  metadataArtwork = null,
  playbackArtwork = null,
  mainArtwork = null,
  displayTitle = null,
  playbackStateObj = null,
  mainState = null,
  isPlayingSameMedia = false,
}) {
  let selectedArt = metadataArtwork?.url ? metadataArtwork : null;

  const matchesTitle = (titleA, titleB) =>
    typeof titleA === "string" &&
    typeof titleB === "string" &&
    titleA.trim().toLowerCase() === titleB.trim().toLowerCase();

  // If a track title is actively displayed and metadata artwork is missing,
  // allow fallback to playback/main entity ONLY if they match the displayed title or are verified to play the same media.
  if (displayTitle && !selectedArt) {
    if (
      playbackArtwork?.url &&
      (matchesTitle(playbackStateObj?.attributes?.media_title, displayTitle) || isPlayingSameMedia)
    ) {
      selectedArt = playbackArtwork;
    } else if (
      mainArtwork?.url &&
      (matchesTitle(mainState?.attributes?.media_title, displayTitle) || isPlayingSameMedia)
    ) {
      selectedArt = mainArtwork;
    }
  }

  // When no display title is present (e.g. system sounds, gaming, idle), fall back to any available artwork.
  if (!displayTitle && !selectedArt) {
    if (playbackArtwork?.url) {
      selectedArt = playbackArtwork;
    } else if (mainArtwork?.url) {
      selectedArt = mainArtwork;
    } else {
      selectedArt = playbackArtwork || mainArtwork || null;
    }
  }

  return selectedArt || (metadataArtwork?.url ? metadataArtwork : null);
}

const _globRegexCache = new Map();

function getCachedGlobRegex(globStr) {
  let re = _globRegexCache.get(globStr);
  if (!re) {
    const escaped = globStr
      .split("*")
      .map((s) => s.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&"))
      .join(".*");
    re = new RegExp("^" + escaped + "$");
    if (_globRegexCache.size > 200) {
      _globRegexCache.clear();
    }
    _globRegexCache.set(globStr, re);
  }
  return re;
}

/**
 * Test whether an entity ID or its friendly name matches any pattern in a list of glob patterns or exact IDs.
 * Supports '*' wildcard, case-insensitive, and matches against entityId and friendlyName.
 * @param {string} entityId
 * @param {string[] | string} [patterns]
 * @param {string} [friendlyName=""]
 * @returns {boolean}
 */
export function matchesEntityPattern(entityId, patterns, friendlyName = "") {
  if (!entityId || !patterns) return false;
  const list = Array.isArray(patterns)
    ? patterns
    : typeof patterns === "string"
      ? patterns.split(",").map((s) => s.trim())
      : [];
  if (list.length === 0) return false;

  const targetId = entityId.trim().toLowerCase();
  const targetName = (friendlyName || "").trim().toLowerCase();

  for (const raw of list) {
    if (!raw || typeof raw !== "string") continue;
    const p = raw.trim().toLowerCase();
    if (!p) continue;

    // 1. Direct equality against entity ID or friendly name
    if (p === targetId || (targetName && p === targetName)) return true;

    const pNoDomain = p.startsWith("media_player.") ? p.slice("media_player.".length) : p;

    if (targetName && pNoDomain && pNoDomain === targetName) return true;

    // 2. Wildcard glob matching
    if (p.includes("*")) {
      try {
        const re = getCachedGlobRegex(p);
        // Test entity ID
        if (re.test(targetId)) return true;

        // Test friendly name
        if (targetName) {
          if (re.test(targetName)) return true;
          if (pNoDomain && getCachedGlobRegex(pNoDomain).test(targetName)) return true;
          // If the pattern has a wildcard (e.g. media_player.*frame or *frame*),
          // also match if the friendly name contains the token (e.g. "Bedroom Frame TV" contains "frame")
          if (pNoDomain && pNoDomain.includes("*")) {
            const token = pNoDomain.replace(/\*/g, "").trim();
            if (token && targetName.includes(token)) return true;
          }
        }
      } catch {
        // Ignore invalid regex
      }
    } else {
      // 3. Keyword / substring match when pattern has no domain or wildcards (e.g. "frame")
      if (!p.includes(".")) {
        if (targetId.includes(p)) return true;
        if (targetName && targetName.includes(p)) return true;
      }
    }
  }
  return false;
}

/**
 * Find playing media_player entities that are not covered on the card and not excluded.
 * Implements MA duplicate deduplication: if an MA player and its physical counterpart
 * are playing the exact same track title + artist, only the MA entity is returned.
 * @param {Record<string, any>} states - hass.states object
 * @param {Set<string> | string[]} coveredIds - IDs already configured, resolved, or grouped
 * @param {string[] | string} [excludePatterns] - IDs or wildcard patterns to exclude
 * @returns {string[]} Array of playing entity IDs
 */
export function findPlayingUnconfiguredPlayers(states, coveredIds, excludePatterns) {
  if (!states || typeof states !== "object") return [];
  const coveredSet = coveredIds instanceof Set ? coveredIds : new Set(coveredIds || []);

  const candidates = [];
  for (const [id, st] of Object.entries(states)) {
    if (!id.startsWith("media_player.")) continue;
    if (coveredSet.has(id)) continue;
    if (!st || st.state !== "playing") continue;
    if (matchesEntityPattern(id, excludePatterns, st.attributes?.friendly_name)) continue;
    candidates.push({ id, st });
  }

  if (candidates.length === 0) return [];

  // Check if any candidate duplicates an already covered playing entity
  const coveredPlayingTracks = [];
  for (const id of coveredSet) {
    const st = states[id];
    if (st && st.state === "playing") {
      const title = (st.attributes?.media_title || "").trim().toLowerCase();
      const artist = (st.attributes?.media_artist || "").trim().toLowerCase();
      if (title && artist) {
        coveredPlayingTracks.push({
          id,
          title,
          artist,
          isMa: isMusicAssistantEntity(st),
        });
      }
    }
  }

  const filtered = [];
  for (const c of candidates) {
    const title = (c.st.attributes?.media_title || "").trim().toLowerCase();
    const artist = (c.st.attributes?.media_artist || "").trim().toLowerCase();

    if (title && artist && coveredPlayingTracks.length > 0) {
      const match = coveredPlayingTracks.find((cp) => cp.title === title && cp.artist === artist);
      if (match) {
        continue;
      }
    }
    filtered.push(c);
  }

  // Deduplicate between candidates themselves by title + artist
  const groups = new Map();
  const result = [];

  for (const c of filtered) {
    const title = (c.st.attributes?.media_title || "").trim().toLowerCase();
    const artist = (c.st.attributes?.media_artist || "").trim().toLowerCase();
    if (!title || !artist) {
      result.push(c.id);
      continue;
    }
    const key = `${title}:::${artist}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(c);
  }

  for (const [, group] of groups.entries()) {
    if (group.length === 1) {
      result.push(group[0].id);
      continue;
    }
    const maItem = group.find((c) => isMusicAssistantEntity(c.st));
    const nonMaItem = group.find((c) => !isMusicAssistantEntity(c.st));
    if (maItem && nonMaItem) {
      result.push(maItem.id);
      for (const item of group) {
        if (item !== maItem && item !== nonMaItem && isMusicAssistantEntity(item.st)) {
          result.push(item.id);
        }
      }
    } else {
      for (const item of group) {
        result.push(item.id);
      }
    }
  }

  return result;
}

/**
 * Search media_player entities across Home Assistant states.
 * @param {Record<string, any>} states
 * @param {string} query
 * @param {Set<string> | string[]} coveredIds
 * @param {string[] | string} [excludePatterns]
 * @param {number} [limit=8]
 * @returns {Array<{ id: string, name: string, state: string, icon: string, isPlaying: boolean }>}
 */
export function searchMediaPlayers(states, query, coveredIds, excludePatterns, limit = 8) {
  if (!states || typeof states !== "object") return [];
  const coveredSet = coveredIds instanceof Set ? coveredIds : new Set(coveredIds || []);
  const q = (query || "").trim().toLowerCase();

  const results = [];
  for (const [id, st] of Object.entries(states)) {
    if (!id.startsWith("media_player.")) continue;
    if (coveredSet.has(id)) continue;
    if (!st || st.state === "unavailable" || st.state === "unknown") continue;

    const friendlyName = st.attributes?.friendly_name || id;
    if (matchesEntityPattern(id, excludePatterns, friendlyName)) continue;
    const nameLower = friendlyName.toLowerCase();
    const idLower = id.toLowerCase();

    if (q) {
      if (!nameLower.includes(q) && !idLower.includes(q)) continue;
    }

    results.push({
      id,
      name: friendlyName,
      state: st.state,
      icon: st.attributes?.icon || "mdi:cast",
      isPlaying: st.state === "playing",
    });
  }

  results.sort((a, b) => {
    if (a.isPlaying !== b.isPlaying) return a.isPlaying ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return results.slice(0, limit);
}
