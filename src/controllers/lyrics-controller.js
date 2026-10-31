/* global __VERSION__ */
/**
 * Reactive Lit controller managing lyrics retrieval, caching, LRCLIB / Music Assistant
 * source dispatching, and active lyric line tracking for Yet Another Media Player (YAMP).
 *
 * Implements the Lit ReactiveController interface to automatically manage fetch timeouts,
 * prevent race conditions between track changes, and provide unified lyric parsing & caching.
 */

import { parseLrc } from "../lyrics-parser.js";
import { localize } from "../localize/localize.js";
import { getMassQueueConfigEntryId } from "../search-sheet.js";
import { isInsecureHttpUrlOnHttps } from "../yamp-utils.js";

/**
 * @typedef {import("../types.d.ts").HassEntity} HassEntity
 * @typedef {import("../types.d.ts").LyricsLine} LyricsLine
 * @typedef {import("../types.d.ts").YetAnotherMediaPlayerCard} YetAnotherMediaPlayerCard
 */

export const MAX_LYRICS_CACHE_SIZE = 30;

/** @type {Map<string, LyricsLine[]>} */
export const sharedLyricsCache = new Map();

/**
 * Clears shared lyrics cache map (primarily for unit test isolation).
 * @returns {void}
 */
export function clearSharedLyricsCacheForTests() {
  sharedLyricsCache.clear();
}

/** @type {Map<string, Promise<LyricsLine[]>>} */
export const inFlightLrclibRequests = new Map();

/**
 * Clears in-flight LRCLIB requests map (primarily for unit test isolation).
 * @returns {void}
 */
export function clearInFlightLrclibRequestsForTests() {
  inFlightLrclibRequests.clear();
}

/**
 * Normalizes custom or default LRCLIB base API URL.
 * @param {string | null | undefined} [configUrl]
 * @returns {string}
 */
export function getLrclibBaseUrl(configUrl) {
  let url = (configUrl || "").trim().replace(/\/+$/, "");
  if (!url) return "https://lrclib.net/api";
  url = url.replace(/\/(get|search)$/, "");
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
}

/**
 * Cleans metadata string (removes (feat. ...), [Single], - 2024 Remaster, etc.)
 * @param {any} [text]
 * @returns {string}
 */
export function cleanTrackMetadata(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .split(" - ")[0] // Often "Track Name - Extra Info"
    .replace(/\(feat\..*?\)/gi, "")
    .replace(/\(with.*?\)/gi, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/- \d{4} Remaster.*/gi, "")
    .replace(/- Remastered.*/gi, "")
    .replace(/- Single.*/gi, "")
    .trim();
}

/**
 * Calculates the index of the currently active lyric line given playback position and pre-roll offset.
 * @param {LyricsLine[] | null | undefined} lyrics
 * @param {number} position
 * @param {number} [preRoll]
 * @param {string} [mode]
 * @returns {number}
 */
export function getActiveLyricIndex(lyrics, position, preRoll = 0, mode = "default") {
  if (!lyrics || lyrics.length === 0) return -1;

  if (lyrics.length === 1 && Boolean(lyrics[0].isInstrumental)) {
    return 0;
  }

  if (mode === "text") return -1;

  const isUnsynced = !lyrics.some((l) => l.time !== null);
  if (isUnsynced) return -1;

  let newActiveIndex = -1;
  const adjustedPos = position + preRoll;

  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time !== null && lyrics[i].time <= adjustedPos) {
      newActiveIndex = i;
    } else if (lyrics[i].time !== null && lyrics[i].time > adjustedPos) {
      break;
    }
  }

  return newActiveIndex;
}

export class LyricsController {
  /**
   * @param {YetAnotherMediaPlayerCard} host
   * @param {Map<string, LyricsLine[]>} [cache]
   */
  constructor(host, cache = sharedLyricsCache) {
    /** @type {YetAnotherMediaPlayerCard} */
    this.host = host;

    if (host && typeof host.addController === "function") {
      host.addController(this);
    }

    /** @type {LyricsLine[]} */
    this.lyrics = [];
    /** @type {boolean} */
    this.loading = false;
    /** @type {boolean} */
    this.error = false;
    /** @type {boolean} */
    this.active = false;

    /** @type {Map<string, LyricsLine[]>} */
    this.cache = cache;

    /** @type {string | null} */
    this.lastTrackId = null;
    /** @type {string | null} */
    this.lastArtist = null;
    /** @type {string | null} */
    this.lastTitle = null;
    /** @type {string | null} */
    this.lastEntityId = null;

    /** @type {any} */
    this.fetchTimeout = null;
    /** @type {symbol | null} */
    this.currentFetchToken = null;
    /** @type {string | null} */
    this.fetchingCacheKey = null;
  }

  get fetching() {
    return this.loading;
  }

  set fetching(val) {
    this.loading = val;
  }

  hostConnected() {}

  hostDisconnected() {
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
      this.fetchTimeout = null;
    }
    this.currentFetchToken = null;
    this.fetchingCacheKey = null;
  }

  /**
   * Toggles the active lyrics view state.
   * @param {boolean} [forceState]
   * @returns {boolean}
   */
  toggle(forceState) {
    const next =
      forceState !== undefined ? Boolean(forceState) : !(this.active || this.host?._lyricsActive);
    this.active = next;
    if (this.host) {
      this.host._lyricsActive = next;
      this.host.triggerRender?.() || this.host.requestUpdate?.();
    }
    return this.active;
  }

  /**
   * Evaluates current active media metadata and schedules or clears lyrics retrieval.
   */
  checkTrackLyrics() {
    const isLyricsActive = this.active || this.host?._lyricsActive;
    if (!isLyricsActive) return;

    const host = this.host;
    const activeState =
      host?.metadataStateObj ||
      host?.currentActivePlaybackStateObj ||
      host?.currentPlaybackStateObj ||
      host?.currentStateObj;
    const trackId = activeState?.attributes?.media_content_id || null;
    const artist = activeState?.attributes?.media_artist || null;
    const title = activeState?.attributes?.media_title || null;
    const activeEntityId = host?.currentActivePlaybackEntityId || host?.currentEntityId || null;

    const hasMetadata = Boolean(trackId || artist || title);
    const metadataChanged =
      trackId !== this.lastTrackId ||
      artist !== this.lastArtist ||
      title !== this.lastTitle ||
      activeEntityId !== this.lastEntityId;

    if (hasMetadata && metadataChanged && !host?._isIdle && !host?.isAnyMenuOpen) {
      this.lastTrackId = trackId;
      this.lastArtist = artist;
      this.lastTitle = title;
      this.lastEntityId = activeEntityId;
      if (host) {
        host._lastLyricsTrackId = trackId;
        host._lastLyricsArtist = artist;
        host._lastLyricsTitle = title;
        host._lastLyricsEntityId = activeEntityId;
      }

      this.loading = true;
      this.error = false;
      if (host) {
        host._fetchingLyrics = true;
        host._lyricsError = false;
      }

      if (this.fetchTimeout) clearTimeout(this.fetchTimeout);
      this.fetchTimeout = setTimeout(() => {
        this.fetchLyrics();
        this.fetchTimeout = null;
        if (host) host._lyricsFetchTimeout = null;
      }, 500);
      if (host) host._lyricsFetchTimeout = this.fetchTimeout;
    } else if (!hasMetadata && metadataChanged) {
      this.lastTrackId = null;
      this.lastArtist = null;
      this.lastTitle = null;
      this.lastEntityId = activeEntityId;
      if (host) {
        host._lastLyricsTrackId = null;
        host._lastLyricsArtist = null;
        host._lastLyricsTitle = null;
        host._lastLyricsEntityId = activeEntityId;
      }

      if (this.fetchTimeout) clearTimeout(this.fetchTimeout);
      this.fetchTimeout = null;
      if (host) host._lyricsFetchTimeout = null;

      this.lyrics = [];
      this.loading = false;
      this.error = false;
      if (host) {
        host._massLyrics = [];
        host._fetchingLyrics = false;
        host._lyricsError = false;
        host.requestUpdate();
      }
    }
  }

  /**
   * Checks if active state represents radio or streaming broadcast playback.
   * @param {HassEntity | null | undefined} [activeState]
   * @returns {boolean}
   */
  isCurrentlyPlayingRadio(activeState) {
    if (
      typeof this.host?._isCurrentlyPlayingRadio === "function" &&
      this.host._isCurrentlyPlayingRadio()
    ) {
      return true;
    }
    if (this.host?._searchController?.isCurrentlyPlayingRadio?.()) {
      return true;
    }
    if (!activeState?.attributes) return false;
    const attrs = activeState.attributes;
    const ct = (attrs.media_content_type || "").toLowerCase();
    const cid = (attrs.media_content_id || "").toLowerCase();
    return (
      ct === "radio" ||
      ct === "channel" ||
      cid.startsWith("library://radio/") ||
      cid.startsWith("radiobrowser://") ||
      cid.startsWith("tunein:") ||
      cid.startsWith("radioparadise:") ||
      attrs.mass_item_type === "radio"
    );
  }

  /**
   * Universal lyrics fetcher supporting Music Assistant and LRCLIB sources.
   */
  async fetchLyrics() {
    const host = this.host;
    const isLyricsActive = this.active || host?._lyricsActive;
    if (!isLyricsActive || host?._isIdle || host?.isAnyMenuOpen) {
      this.loading = false;
      if (host) {
        host._fetchingLyrics = false;
        host.requestUpdate();
      }
      return;
    }

    this.error = false;
    if (host) host._lyricsError = false;

    let configSource = host?.config?.lyrics_source || "mass_lrclib";

    const isAdmin = host?.hass?.user?.is_admin === true;
    if (!isAdmin && configSource !== "lrclib") {
      if (configSource === "mass") {
        console.warn(`YAMP: ${localize("lyrics.admin_only_mass")}`);

        if (typeof host?.dispatchEvent === "function") {
          const event = new CustomEvent("hass-notification", {
            bubbles: true,
            composed: true,
            detail: { message: localize("lyrics.admin_only_mass") },
          });
          host.dispatchEvent(event);
        }

        this.loading = false;
        this.error = true;
        if (host) {
          host._fetchingLyrics = false;
          host._lyricsError = true;
          host.requestUpdate();
        }
        return;
      } else {
        configSource = "lrclib";
      }
    }

    const activeState =
      host?.metadataStateObj ||
      host?.currentActivePlaybackStateObj ||
      host?.currentPlaybackStateObj ||
      host?.currentStateObj;
    if (!activeState) {
      this.lyrics = [];
      if (host) {
        host._massLyrics = [];
        host.requestUpdate();
      }
      return;
    }

    const artist = activeState.attributes?.media_artist;
    const title = activeState.attributes?.media_title;
    const album = activeState.attributes?.media_album_name;
    const duration = activeState.attributes?.media_duration;
    const trackId = activeState.attributes?.media_content_id;

    const isRadio = this.isCurrentlyPlayingRadio(activeState);
    const effectiveAlbum = isRadio ? "" : album;
    const effectiveDuration = isRadio ? null : duration;

    // 1. Check Internal Cache
    const cacheKey = trackId
      ? `${trackId}:${artist}:${title}`
      : `${artist}:${title}${effectiveAlbum ? `:${effectiveAlbum}` : ""}`;

    if (this.loading && this.fetchingCacheKey === cacheKey) return;

    if (this.cache.has(cacheKey)) {
      const cachedLyrics = this.cache.get(cacheKey);
      if (cachedLyrics !== undefined) {
        this.cache.delete(cacheKey);
        this.cache.set(cacheKey, cachedLyrics);

        this.lyrics = cachedLyrics;
        this.loading = false;
        if (host) {
          host._massLyrics = cachedLyrics;
          host._fetchingLyrics = false;
          host.requestUpdate();
        }
        return;
      }
    }

    const fetchToken = Symbol("lyricsFetchToken");
    this.currentFetchToken = fetchToken;
    if (host) host._currentFetchToken = fetchToken;

    this.loading = true;
    this.fetchingCacheKey = cacheKey;
    this.lyrics = [];
    if (host) {
      host._fetchingLyrics = true;
      host._fetchingCacheKey = cacheKey;
      host._massLyrics = [];
      host.requestUpdate();
    }

    let lyrics;

    try {
      if (configSource === "mass") {
        lyrics = await this.getMassLyrics(activeState, fetchToken);
      } else if (configSource === "lrclib") {
        lyrics = await this.getLrclibLyrics(
          artist,
          title,
          effectiveAlbum,
          effectiveDuration,
          fetchToken
        );
      } else {
        const massPromise = this.getMassLyrics(activeState, fetchToken);
        const lrclibPromise = this.getLrclibLyrics(
          artist,
          title,
          effectiveAlbum,
          effectiveDuration,
          fetchToken
        );

        const isMassPreferred = configSource === "mass_lrclib";

        const handleInterim = async (promise, name) => {
          const res = await promise;
          if (this.currentFetchToken !== fetchToken) return null;
          if (res && res.length > 0) {
            const isPreferred =
              (name === "mass" && isMassPreferred) || (name === "lrclib" && !isMassPreferred);
            if (!this.lyrics || this.lyrics.length === 0 || isPreferred) {
              this.lyrics = res || [];
              this.loading = false;
              if (host) {
                host._massLyrics = res || [];
                host._fetchingLyrics = false;
                host.requestUpdate();
              }
            }
          }
          return res;
        };

        const [massResults, lrclibResults] = await Promise.all([
          handleInterim(massPromise, "mass"),
          handleInterim(lrclibPromise, "lrclib"),
        ]);

        if (this.currentFetchToken !== fetchToken) return;

        if (isMassPreferred) {
          lyrics = massResults && massResults.length > 0 ? massResults : lrclibResults;
        } else {
          lyrics = lrclibResults && lrclibResults.length > 0 ? lrclibResults : massResults;
        }
      }

      if (this.currentFetchToken === fetchToken) {
        this.lyrics = lyrics || [];
        if (Array.isArray(lyrics)) {
          if (this.cache.size >= MAX_LYRICS_CACHE_SIZE) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey !== undefined) {
              this.cache.delete(oldestKey);
            }
          }
          this.cache.set(cacheKey, lyrics);
        } else if (lyrics === null) {
          this.error = true;
        }
        this.loading = false;
        this.fetchingCacheKey = null;
        if (host) {
          host._massLyrics = this.lyrics;
          host._fetchingLyrics = false;
          host._fetchingCacheKey = null;
          host._lyricsError = this.error;
          host.requestUpdate();
        }
      }
    } catch (e) {
      if (this.currentFetchToken === fetchToken) {
        console.error("YAMP: Failed to fetch lyrics:", e);
        this.error = true;
        this.loading = false;
        this.fetchingCacheKey = null;
        if (host) {
          host._lyricsError = true;
          host._fetchingLyrics = false;
          host._fetchingCacheKey = null;
          host.requestUpdate();
        }
      }
    }
  }

  /**
   * Internal helper to fetch lyrics from Music Assistant.
   * @param {HassEntity} activeState
   * @param {symbol} fetchToken
   * @returns {Promise<LyricsLine[]>}
   */
  async getMassLyrics(activeState, fetchToken) {
    const host = this.host;
    if (!host || !host.hass) return [];

    if (host._hasMassQueueIntegration === false) return [];

    if (!host._massQueueAvailable) {
      if (typeof host._isMassQueueIntegrationAvailable === "function") {
        host._massQueueAvailable = await host._isMassQueueIntegrationAvailable(host.hass);
      }
      host._hasMassQueueIntegration = host._massQueueAvailable;
      if (!host._massQueueAvailable) return [];
      if (this.currentFetchToken !== fetchToken) return [];
    }

    try {
      const searchEntityIdTemplate =
        typeof host._getSearchEntityId === "function"
          ? host._getSearchEntityId(host._selectedIndex)
          : "";
      const searchEntityId =
        typeof host._resolveTemplateAtActionTime === "function"
          ? await host._resolveTemplateAtActionTime(searchEntityIdTemplate, host.currentEntityId)
          : host.currentEntityId;

      const mqConfigEntryId = await getMassQueueConfigEntryId(host.hass, searchEntityId);
      if (!mqConfigEntryId) return [];

      const trackUri = activeState?.attributes?.media_content_id;
      if (!trackUri || !trackUri.includes("://")) return [];

      const trackMsg = {
        type: "call_service",
        domain: "mass_queue",
        service: "send_command",
        service_data: {
          command: "music/item_by_uri",
          data: { uri: trackUri },
          ...(mqConfigEntryId &&
            mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
        },
        return_response: true,
      };

      const trackRes = await host.hass.connection.sendMessagePromise(trackMsg);
      if (this.currentFetchToken !== fetchToken) return [];

      const validTrack = trackRes?.response?.response || trackRes?.response || trackRes?.result;
      if (!validTrack) return [];

      const lyricsMsg = {
        type: "call_service",
        domain: "mass_queue",
        service: "send_command",
        service_data: {
          command: "metadata/get_track_lyrics",
          data: { track: validTrack },
          ...(mqConfigEntryId &&
            mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
        },
        return_response: true,
      };

      const lyricsRes = await host.hass.connection.sendMessagePromise(lyricsMsg);
      if (this.currentFetchToken !== fetchToken) return [];

      const lyricsArray = lyricsRes?.response?.response || lyricsRes?.response || lyricsRes?.result;
      if (lyricsArray) {
        let lrcString = "";
        if (Array.isArray(lyricsArray)) {
          lrcString = lyricsArray[1] || lyricsArray[0] || "";
        } else if (typeof lyricsArray === "string") {
          lrcString = lyricsArray;
        } else if (typeof lyricsArray === "object") {
          if (lyricsArray.instrumental) {
            return [
              {
                time: 0,
                text: localize("lyrics.instrumental") || "Instrumental Track",
                isInstrumental: true,
              },
            ];
          }
          lrcString = lyricsArray.lyrics || lyricsArray.text || "";
        }
        return lrcString ? parseLrc(lrcString) : [];
      }
    } catch (e) {
      console.warn("YAMP: MA Lyrics fetch failed:", e);
    }
    return [];
  }

  /**
   * Internal helper to fetch lyrics from LRCLIB.
   * @param {string | null | undefined} artist
   * @param {string | null | undefined} title
   * @param {string | null | undefined} [album]
   * @param {number | null | undefined} [duration]
   * @param {symbol} [fetchToken]
   * @returns {Promise<LyricsLine[]>}
   */
  async getLrclibLyrics(artist, title, album, duration, fetchToken) {
    if (!artist || !title) return [];

    const cleanArtist = cleanTrackMetadata(artist);
    const cleanTitle = cleanTrackMetadata(title);
    const cleanAlbum = album ? cleanTrackMetadata(album) : "";

    const version = typeof __VERSION__ !== "undefined" ? __VERSION__ : "dev";

    try {
      let rawUrl = this.host?.config?.lrclib_url;
      if (
        typeof this.host?._resolveTemplateAtActionTime === "function" &&
        rawUrl &&
        (rawUrl.includes("{{") || rawUrl.includes("{%") || rawUrl.includes("[[["))
      ) {
        rawUrl = await this.host._resolveTemplateAtActionTime(rawUrl, this.host.currentEntityId);
        if (fetchToken && this.currentFetchToken !== fetchToken) return [];
      }

      const baseUrl = getLrclibBaseUrl(rawUrl);
      if (isInsecureHttpUrlOnHttps(baseUrl)) {
        console.warn(
          "YAMP: Insecure HTTP LRCLIB URL in HTTPS dashboard context may be blocked by browser mixed-content policy:",
          baseUrl
        );
      }

      const dedupKey = `${baseUrl}:${cleanArtist}:${cleanTitle}:${cleanAlbum}:${duration ? Math.round(duration) : ""}`;

      if (inFlightLrclibRequests.has(dedupKey)) {
        const existingPromise = inFlightLrclibRequests.get(dedupKey);
        if (existingPromise && /** @type {any} */ (existingPromise)._fetchFn === globalThis.fetch) {
          const results = await existingPromise;
          if (fetchToken && this.currentFetchToken !== fetchToken) return [];
          return results || [];
        } else {
          inFlightLrclibRequests.delete(dedupKey);
        }
      }

      /** @type {Promise<LyricsLine[]>} */
      const requestPromise = (async () => {
        const headers = {
          "Lrclib-Client": `yet-another-media-player/${version} (https://github.com/jianyu-li/yet-another-media-player)`,
        };

        /**
         * Fetches URL with retry for transient 503 and 429 status codes.
         * @param {string} targetUrl
         * @returns {Promise<Response | null>}
         */
        const fetchWithRetry = async (targetUrl) => {
          let response = await fetch(targetUrl, { headers });
          if (fetchToken && this.currentFetchToken !== fetchToken) return null;

          if (response.status === 503 || response.status === 429) {
            let delayMs = 1000;
            /** @type {string | null | undefined} */
            let retryHeader = null;
            if (typeof response.headers?.get === "function") {
              retryHeader = response.headers.get("Retry-After");
            } else if (response.headers && typeof response.headers === "object") {
              retryHeader =
                /** @type {any} */ (response.headers)["Retry-After"] ||
                /** @type {any} */ (response.headers)["retry-after"];
            }

            if (retryHeader) {
              const parsedSec = parseInt(retryHeader, 10);
              if (!Number.isNaN(parsedSec) && parsedSec >= 0) {
                delayMs = parsedSec * 1000;
              }
            }
            delayMs = Math.min(3000, Math.max(500, delayMs));
            delayMs += Math.floor(Math.random() * 250);

            if (fetchToken && this.currentFetchToken !== fetchToken) return null;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            if (fetchToken && this.currentFetchToken !== fetchToken) return null;

            response = await fetch(targetUrl, { headers });
            if (fetchToken && this.currentFetchToken !== fetchToken) return null;
          }

          if (!response.ok && response.status !== 404) {
            throw new Error(`LRCLIB error: ${response.status}`);
          }

          return response;
        };

        let url = `${baseUrl}/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
        if (cleanAlbum) url += `&album_name=${encodeURIComponent(cleanAlbum)}`;
        if (duration) url += `&duration=${Math.round(duration)}`;

        const response = await fetchWithRetry(url);
        if (fetchToken && this.currentFetchToken !== fetchToken) return [];
        if (!response) return [];

        /** @type {any} */
        let data = null;
        if (response.ok) {
          data = await response.json();
        } else {
          const searchUrl = `${baseUrl}/search?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
          const searchRes = await fetchWithRetry(searchUrl);
          if (fetchToken && this.currentFetchToken !== fetchToken) return [];
          if (!searchRes) return [];

          if (searchRes.ok) {
            const results = await searchRes.json();
            if (results && results.length > 0) {
              data = results[0];
            }
          }
        }

        if (data) {
          if (data.instrumental) {
            return [
              {
                time: 0,
                text: localize("lyrics.instrumental") || "Instrumental Track",
                isInstrumental: true,
              },
            ];
          }
          const lrcString = data.syncedLyrics || data.plainLyrics || "";
          return lrcString ? parseLrc(lrcString) : [];
        }

        return [];
      })();

      /** @type {any} */ (requestPromise)._fetchFn = globalThis.fetch;
      inFlightLrclibRequests.set(dedupKey, requestPromise);
      try {
        const results = await requestPromise;
        if (fetchToken && this.currentFetchToken !== fetchToken) return [];
        return results || [];
      } finally {
        inFlightLrclibRequests.delete(dedupKey);
      }
    } catch (e) {
      console.warn("YAMP: LRCLIB Lyrics fetch failed:", e);
    }
    return [];
  }
}
