/**
 * Reactive Lit controller managing media artwork resolution, aspect ratios,
 * artwork overrides, and host artwork CSS styles for Yet Another Media Player (YAMP).
 *
 * Implements the Lit ReactiveController interface to cleanly manage aspect ratio
 * calculation caches, dynamic override template resolution, and host CSS properties.
 */

import {
  getArtworkUrl,
  isValidArtworkUrl,
  getValidArtworkAttr,
  resolveSelectedArtwork,
  resolveStringTemplate,
} from "../yamp-utils.js";
import { countMainControls } from "../controls-row.js";
import { ARTWORK_OVERRIDE_MATCH_KEYS } from "../constants.js";

/**
 * @typedef {import("../types.d.ts").HassEntity} HassEntity
 * @typedef {import("../types.d.ts").ArtworkObject} ArtworkObject
 * @typedef {import("../types.d.ts").YetAnotherMediaPlayerCard} YetAnotherMediaPlayerCard
 */

/**
 * Calculates the maximum width for collapsed artwork based on available card width.
 * @param {number} cardWidth
 * @returns {number}
 */
export function getMaxCollapsedArtworkWidth(cardWidth) {
  const safeMaxWidth = cardWidth > 0 ? Math.max(64, cardWidth - 220) : 102;
  return Math.min(safeMaxWidth, 160);
}

/**
 * Maps an object-fit value to the appropriate CSS background-size property value.
 * @param {string} [fit]
 * @returns {string}
 */
export function getBackgroundSizeForFit(fit) {
  switch (fit) {
    case "contain":
      return "contain";
    case "fill":
      return "100% 100%";
    case "scale-down":
      return "contain";
    case "none":
      return "auto";
    case "scaled-contain":
    case "scaled-contain-alternate":
      return "80%";
    case "cover":
    default:
      return "cover";
  }
}

/**
 * Checks if an image URL points to an external origin (not the current Home Assistant instance).
 * @param {string} [url]
 * @returns {boolean}
 */
export function isExternalImageUrl(url) {
  return (
    typeof url === "string" &&
    /^https?:\/\//i.test(url) &&
    typeof window !== "undefined" &&
    Boolean(window.location?.origin) &&
    !url.startsWith(window.location.origin)
  );
}

/**
 * Strips outer quotes and url() wrappers from image source values.
 * @param {any} value
 * @returns {string}
 */
export function normalizeImageSourceValue(value) {
  if (!value || typeof value !== "string") return "";
  let trimmed = value.trim();
  if (!trimmed) return "";
  const quoted =
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'));
  if (quoted && trimmed.length >= 2) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  const urlMatch = trimmed.match(/^url\((.*)\)$/i);
  if (urlMatch && urlMatch[1] !== undefined) {
    let inner = urlMatch[1].trim();
    if (
      (inner.startsWith("'") && inner.endsWith("'")) ||
      (inner.startsWith('"') && inner.endsWith('"'))
    ) {
      inner = inner.slice(1, -1).trim();
    }
    return inner;
  }
  return trimmed;
}

/**
 * Resolves an image URL from an input string, which may be an entity ID or direct URL.
 * @param {string} input
 * @param {any} hass
 * @returns {string|null}
 */
export function resolveImageUrlFromInput(input, hass) {
  const normalized = normalizeImageSourceValue(input);
  if (!normalized || !hass) return null;
  if (hass.states?.[normalized]) {
    const stateObj = hass.states[normalized];
    return (
      stateObj.attributes?.entity_picture_local ||
      stateObj.attributes?.entity_picture ||
      (stateObj.state &&
      typeof stateObj.state === "string" &&
      (stateObj.state.startsWith("http") || stateObj.state.startsWith("/"))
        ? stateObj.state
        : null)
    );
  }
  if (normalized.startsWith("http") || normalized.startsWith("/")) {
    return normalized;
  }
  return null;
}

/**
 * Pre-compiles wildcard regex patterns for media artwork overrides.
 * @param {any} [overrides]
 * @returns {any[]}
 */
export function compileArtworkOverrides(overrides) {
  if (!Array.isArray(overrides)) return [];
  const copied = overrides.map((o) => ({ ...o }));
  copied.forEach((override) => {
    if (!override || typeof override !== "object") return;
    override.__cachedRegexes = {};
    ARTWORK_OVERRIDE_MATCH_KEYS.forEach((key) => {
      const pattern = override[key];
      if (typeof pattern === "string" && pattern.includes("*") && pattern !== "*") {
        try {
          const regexPattern = pattern
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\\\*/g, ".*");
          override.__cachedRegexes[key] = new RegExp(`^${regexPattern}$`, "i");
        } catch (_e) {
          // Ignore regex compilation error
        }
      }
    });
  });
  return copied;
}

export const MAX_ASPECT_RATIO_CACHE_SIZE = 50;

export class ArtworkController {
  /**
   * @param {YetAnotherMediaPlayerCard} host
   */
  constructor(host) {
    /** @type {YetAnotherMediaPlayerCard} */
    this.host = host;

    if (host && typeof host.addController === "function") {
      host.addController(this);
    }

    /** @type {Record<string, number | null>} */
    this.aspectRatioCache = {};

    /** @type {WeakMap<object, number> | null} */
    this.artworkOverrideIndexMap = null;

    /** @type {Record<string, { value: string | null, resolving: boolean }>} */
    this.artworkOverrideTemplateCache = {};

    /** @type {string | null} */
    this.lastArtworkUrl = null;
  }

  /**
   * Lit lifecycle hook: called when the host element connects to the DOM.
   */
  hostConnected() {}

  /**
   * Lit lifecycle hook: called when the host element disconnects from the DOM.
   */
  hostDisconnected() {
    this.aspectRatioCache = {};
    this.artworkOverrideTemplateCache = {};
    this.artworkOverrideIndexMap = null;
  }

  /**
   * Clears internal template caches and WeakMap indices on configuration reload.
   */
  resetCaches() {
    this.artworkOverrideIndexMap = null;
    this.artworkOverrideTemplateCache = {};
  }

  /**
   * Lazily initializes the WeakMap index map for configured media artwork overrides.
   */
  ensureArtworkOverrideIndexMap() {
    if (this.artworkOverrideIndexMap) return;
    this.artworkOverrideIndexMap = new WeakMap();
    const overrides = Array.isArray(this.host?.config?.media_artwork_overrides)
      ? this.host.config.media_artwork_overrides
      : [];
    overrides.forEach((item, idx) => {
      if (item && typeof item === "object") {
        this.artworkOverrideIndexMap.set(item, idx);
      }
    });
  }

  /**
   * Generates a stable cache key for a media artwork override template.
   * @param {any} override
   * @param {string} [type]
   * @param {HassEntity|null} [stateObj]
   * @returns {string}
   */
  getArtworkOverrideCacheKey(override, type = "image", stateObj = null) {
    this.ensureArtworkOverrideIndexMap();

    const mediaTitle = stateObj?.attributes?.media_title || "";
    const mediaArtist = stateObj?.attributes?.media_artist || "";
    const stateKey = `${mediaTitle}:${mediaArtist}`;

    const idx = override && this.artworkOverrideIndexMap?.get(override);
    const prefix = typeof idx === "number" ? idx : "generic";

    return `${prefix}:${type}:${stateKey}`;
  }

  /**
   * Resolves a media artwork override template or static source URL.
   * Supports both Jinja2 server-side evaluation and client-side JavaScript templates.
   * @param {any} override
   * @param {string} sourceValue
   * @param {string} [type]
   * @param {HassEntity|null} [stateObj]
   * @returns {string|null}
   */
  getResolvedArtworkOverrideSource(override, sourceValue, type = "image", stateObj = null) {
    if (!sourceValue || typeof sourceValue !== "string") return null;
    const normalizedInput = normalizeImageSourceValue(sourceValue);
    if (!normalizedInput) return null;
    const isJsTemplate = typeof sourceValue === "string" && sourceValue.trim().startsWith("[[[");
    const isJinjaTemplate =
      typeof sourceValue === "string" && (sourceValue.includes("{{") || sourceValue.includes("{%"));
    if (!isJsTemplate && !isJinjaTemplate) return normalizedInput;

    if (isJsTemplate) {
      const evaluated = this.host?._evaluateJsTemplate?.(sourceValue);
      return normalizeImageSourceValue(evaluated);
    }

    if (!this.artworkOverrideTemplateCache) {
      this.artworkOverrideTemplateCache = {};
    }
    const key = this.getArtworkOverrideCacheKey(override, type, stateObj);
    if (!this.artworkOverrideTemplateCache[key]) {
      this.artworkOverrideTemplateCache[key] = { value: null, resolving: false };
    }
    const entry = this.artworkOverrideTemplateCache[key];
    if (entry.value) return entry.value;
    if (!entry.resolving && this.host?.hass) {
      entry.resolving = true;
      const context = this.host._getTemplateContext?.() ?? {};
      resolveStringTemplate(this.host.hass, sourceValue, context)
        .then((res) => {
          entry.value = normalizeImageSourceValue((res ?? "").toString());
        })
        .catch(() => {
          entry.value = "";
        })
        .finally(() => {
          entry.resolving = false;
          this.host.triggerRender?.() || this.host.requestUpdate?.();
        });
    }
    return entry.value;
  }

  /**
   * Returns inline styling for collapsed artwork based on mobile viewport and active control count.
   * @returns {string}
   */
  getCollapsedArtworkStyle() {
    if (this.host?._alwaysCollapsed) {
      const showFavorite =
        Boolean(this.host._getFavoriteButtonEntity?.()) &&
        !this.host._getHiddenControlsForCurrentEntity?.()?.favorite;
      const controls = countMainControls(
        this.host.currentActivePlaybackStateObj,
        (s, f) => this.host._supportsFeature?.(s, f) ?? false,
        showFavorite,
        this.host._getHiddenControlsForCurrentEntity?.() ?? {},
        true,
        this.host._controlLayout
      );
      if (controls > 6) {
        if (this.host._isMobile) {
          return "width: 60px; height: 60px; object-fit: var(--yamp-artwork-fit, cover); border-radius: 8px;";
        }
      }
    }
    return "";
  }

  /**
   * Resolves artwork URL and presentation properties from an entity state object.
   * @param {HassEntity|null} state
   * @param {boolean} [forceIdleImage]
   * @param {boolean} [ignoreIdleImage]
   * @returns {ArtworkObject|null}
   */
  getArtworkUrl(state, forceIdleImage = false, ignoreIdleImage = false) {
    const isIdleImageActive =
      !ignoreIdleImage &&
      (this.host?._isIdle || forceIdleImage) &&
      Boolean(this.host?.config?.idle_image);
    const res = getArtworkUrl(state, {
      hostname: this.host?.config?.artwork_hostname || "",
      overrides: Array.isArray(this.host?.config?.media_artwork_overrides)
        ? this.host.config.media_artwork_overrides
        : [],
      fallbackArtwork: this.host?.config?.fallback_artwork,
      artworkObjectFit: this.host?._artworkObjectFit,
      aspectRatioCache: this.aspectRatioCache,
      isIdleImageActive,
      resolveOverrideSource: (override, sourceValue, type, stateObj) =>
        this.getResolvedArtworkOverrideSource(override, sourceValue, type, stateObj),
    });

    if (!res) return null;

    let { url, sizePercentage, objectFit, objectPosition } = res;

    if (url && !isValidArtworkUrl(url)) {
      url = null;
    }

    if (!objectFit) {
      objectFit = this.host?._artworkObjectFit;
    }

    if (!objectPosition) {
      objectPosition = this.host?.config?.artwork_position || "top center";
    }

    return { url, sizePercentage, objectFit, objectPosition };
  }

  /**
   * Resolves artwork among metadata, playback, and main sources with intelligent fallbacks.
   * @param {any} options
   * @returns {ArtworkObject|null}
   */
  resolveSelectedArtwork(options) {
    return resolveSelectedArtwork(options);
  }

  /**
   * Maps an object-fit value to the appropriate CSS background-size property value.
   * @param {string} [fit]
   * @returns {string}
   */
  getBackgroundSizeForFit(fit) {
    return getBackgroundSizeForFit(fit);
  }

  /**
   * Checks if an image URL points to an external origin.
   * @param {string} [url]
   * @returns {boolean}
   */
  isExternalImageUrl(url) {
    return isExternalImageUrl(url);
  }

  /**
   * Asynchronously extracts a dominant color sample from an image.
   * @param {string} imgUrl
   * @returns {Promise<string>}
   */
  async extractDominantColor(imgUrl) {
    return new Promise((resolve) => {
      if (!imgUrl || typeof imgUrl !== "string") {
        resolve("#888");
        return;
      }
      if (typeof window === "undefined" || !window.Image) {
        resolve("#888");
        return;
      }
      const img = new window.Image();
      if (this.isExternalImageUrl(imgUrl)) {
        img.crossOrigin = "Anonymous";
      }
      img.src = imgUrl;
      img.onload = function () {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("#888");
            return;
          }
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          resolve(`rgb(${r},${g},${b})`);
        } catch (_e) {
          resolve("#888");
        }
      };
      img.onerror = function () {
        resolve("#888");
      };
    });
  }

  /**
   * Iterates through active configured entities to preload and calculate aspect ratios for artwork.
   */
  updateArtworkAspectRatios() {
    if (!this.host?.hass) return;
    (this.host.entityIds || []).forEach((entityId) => {
      const state = this.host.hass.states[entityId];
      if (state?.attributes) {
        const attrs = state.attributes;
        const baseArtworkUrl =
          getValidArtworkAttr(attrs, "entity_picture_local") ||
          getValidArtworkAttr(attrs, "entity_picture") ||
          getValidArtworkAttr(attrs, "album_art");

        if (baseArtworkUrl) {
          this.calculateAspectRatio(normalizeImageSourceValue(baseArtworkUrl));
        }
      }
    });
  }

  /**
   * Sets an aspect ratio in the cache, enforcing an LRU cap.
   * @param {string} url
   * @param {number | null} ratio
   */
  _setAspectRatio(url, ratio) {
    const keys = Object.keys(this.aspectRatioCache);
    if (
      keys.length >= MAX_ASPECT_RATIO_CACHE_SIZE &&
      !Object.prototype.hasOwnProperty.call(this.aspectRatioCache, url)
    ) {
      delete this.aspectRatioCache[keys[0]];
    }
    this.aspectRatioCache[url] = ratio;
  }

  /**
   * Calculates and caches the aspect ratio (width / height) of an image URL.
   * @param {string} [url]
   */
  calculateAspectRatio(url) {
    if (!url || typeof url !== "string") return;
    if (this.aspectRatioCache[url] !== undefined) return;

    this._setAspectRatio(url, null);
    if (typeof window === "undefined" || !window.Image) return;

    const img = new window.Image();
    if (this.isExternalImageUrl(url)) {
      img.crossOrigin = "Anonymous";
    }
    img.src = url;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        this._setAspectRatio(url, img.naturalWidth / img.naturalHeight);
        this.host?.triggerRender?.() || this.host?.requestUpdate?.();
      }
      img.onload = null;
      img.onerror = null;
    };
    img.onerror = () => {
      this._setAspectRatio(url, null);
      img.onload = null;
      img.onerror = null;
    };
  }

  /**
   * Normalizes an image source string.
   * @param {any} value
   * @returns {string}
   */
  normalizeImageSourceValue(value) {
    return normalizeImageSourceValue(value);
  }

  /**
   * Resolves an image URL from an input string, which may be an entity ID or direct URL.
   * @param {string} input
   * @returns {string|null}
   */
  resolveImageUrlFromInput(input) {
    return resolveImageUrlFromInput(input, this.host?.hass);
  }

  /**
   * Updates host element CSS custom properties for artwork sizing, fit, and alignment.
   * @param {HTMLElement} host
   * @param {HassEntity|null} playbackStateObj
   * @param {boolean} [forceIdleImage]
   */
  updateHostArtworkStyles(host, playbackStateObj, forceIdleImage = false) {
    if (!host || !host.style) return;
    const metadataStateObj = this.host?.metadataStateObj;
    const metadataArtwork = this.getArtworkUrl(metadataStateObj, forceIdleImage);
    const playbackArtwork = this.getArtworkUrl(playbackStateObj, forceIdleImage);
    const mainState = this.host?.currentStateObj;
    const mainArtwork = this.getArtworkUrl(mainState, forceIdleImage);

    const displayTitle =
      metadataStateObj?.attributes?.media_title ||
      playbackStateObj?.attributes?.media_title ||
      mainState?.attributes?.media_title;

    const selectedArt = this.resolveSelectedArtwork({
      metadataArtwork,
      playbackArtwork,
      mainArtwork,
      displayTitle,
      playbackStateObj,
      mainState,
    });

    let artworkObjectFit = this.host?._artworkObjectFit;
    if (selectedArt?.objectFit) {
      artworkObjectFit = selectedArt.objectFit;
    }

    const activeArtworkFit = artworkObjectFit || "cover";
    const backgroundSize = this.getBackgroundSizeForFit(activeArtworkFit);
    host.style.setProperty("--yamp-artwork-fit", activeArtworkFit);
    host.style.setProperty("--yamp-artwork-bg-size", backgroundSize);
    if (selectedArt?.objectPosition) {
      host.style.setProperty("--yamp-artwork-position", selectedArt.objectPosition);
    } else if (this.host?.config?.artwork_position) {
      host.style.setProperty("--yamp-artwork-position", this.host.config.artwork_position);
    } else {
      host.style.setProperty("--yamp-artwork-position", "top center");
    }
  }

  /**
   * Returns the maximum collapsed artwork width.
   * @param {number} cardWidth
   * @returns {number}
   */
  getMaxCollapsedArtworkWidth(cardWidth) {
    return getMaxCollapsedArtworkWidth(cardWidth);
  }

  /**
   * Compiles wildcard regexes for media artwork overrides.
   * @param {any} [overrides]
   * @returns {any[]}
   */
  compileArtworkOverrides(overrides) {
    return compileArtworkOverrides(overrides);
  }
}
