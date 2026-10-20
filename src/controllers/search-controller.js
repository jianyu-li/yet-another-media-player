/**
 * Reactive Lit controller managing media search execution, filters, sorting,
 * hierarchical browsing, and search playback for Yet Another Media Player (YAMP).
 *
 * Implements the Lit ReactiveController interface to cleanly decouple search state,
 * progressive results streaming, header scroll dynamics, and Music Assistant integration.
 */

import {
  searchMedia,
  playSearchedMedia,
  getFavorites,
  getRecentlyPlayed,
  getMassQueueConfigEntryId,
  getMusicAssistantConfigEntryId,
  ALLOWED_MEDIA_TYPES,
  transformMusicAssistantItem,
  isAiRadioAvailable,
  playAiRadioStation,
  isShow,
} from "../search-sheet.js";
import { mediaNextTrack } from "../services/ha-media-services.js";
import {
  getSearchResultClickTitle,
  isInsecureHttpUrlOnHttps,
  getCachedSecureThumbnail,
  resolveSecureThumbnailUrl,
} from "../yamp-utils.js";
import { checkMassQueueServices } from "./queue-controller.js";
import { localize } from "../localize/localize.js";

/**
 * @typedef {import("../types.d.ts").HassEntity} HassEntity
 * @typedef {import("../types.d.ts").HomeAssistant} HomeAssistant
 * @typedef {import("../types.d.ts").YetAnotherMediaPlayerCard} YetAnotherMediaPlayerCard
 */

export const PLAYLIST_FETCH_LIMIT = 500;
export const SUCCESS_MESSAGE_TIMEOUT_MS = 3000;

/**
 * Maps legacy search sort settings to standard Music Assistant order_by keys.
 * @param {string | null | undefined} mode
 * @returns {string}
 */
export function mapLegacySortOption(mode) {
  if (!mode) return "default";
  const legacyMap = {
    title_asc: "name",
    title_desc: "name_desc",
    artist_asc: "artist_name",
    artist_desc: "artist_name_desc",
  };
  return legacyMap[mode] || mode;
}

/**
 * Checks if a given sort mode supports bidirectional toggling.
 * @param {string | null | undefined} mode
 * @returns {boolean}
 */
export function isSortableSearchMode(mode) {
  if (!mode || mode === "default" || mode === "random" || mode === "random_play_count") {
    return false;
  }
  return true;
}

/**
 * Gets the inverted direction variant for a sortable search mode.
 * @param {string | null | undefined} mode
 * @returns {string | null}
 */
export function getOppositeSearchSortMode(mode) {
  if (!mode || !isSortableSearchMode(mode)) return null;
  if (mode.endsWith("_desc")) {
    return mode.replace(/_desc$/, "");
  }
  return `${mode}_desc`;
}

/**
 * Sorts or shuffles search results based on the requested sort mode.
 * @param {any[] | null | undefined} results
 * @param {string} [sortMode]
 * @param {boolean} [skipSort]
 * @returns {any[]}
 */
export function sortSearchResultsList(results, sortMode = "default", skipSort = false) {
  if (skipSort) {
    return Array.isArray(results) ? [...results] : [];
  }
  const list = Array.isArray(results) ? [...results] : [];
  if (sortMode === "random") {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }
  return list;
}

/**
 * Filters search results in real time when navigating within a hierarchy level.
 * @param {any[] | null | undefined} results
 * @param {Array<{ type?: string, name?: string }> | null | undefined} [hierarchy]
 * @param {string} [query]
 * @returns {any[]}
 */
export function filterHierarchySearchResults(results, hierarchy = null, query = "") {
  const list = Array.isArray(results) ? results : [];
  const isInHierarchy =
    Array.isArray(hierarchy) &&
    hierarchy.some((h) => h?.type === "album" || h?.type === "playlist" || h?.type === "artist");
  if (isInHierarchy && typeof query === "string" && query.trim() !== "") {
    const q = query.trim().toLowerCase();
    return list.filter((item) => {
      const title = (item.title || item.name || "").toLowerCase();
      const artist = (item.artist || "").toLowerCase();
      return title.includes(q) || artist.includes(q);
    });
  }
  return list;
}

/**
 * Matches a target name/artist against Music Assistant search result items to find the best URI.
 * @param {any[] | null | undefined} items
 * @param {string} mediaType
 * @param {string} name
 * @param {string} [artist]
 * @returns {string | null}
 */
export function matchResolvedMediaUri(items, mediaType, name, artist = "") {
  if (!Array.isArray(items) || items.length === 0 || !name) return null;
  const normName = name.trim().toLowerCase();
  const normArtist = (artist || "").trim().toLowerCase();

  if (mediaType === "album") {
    const matchBoth = items.find((a) => {
      const aName = (a.name || "").toLowerCase();
      const aArtistMatch = normArtist
        ? a.artists?.some((ar) => {
            const arName = (ar.name || "").toLowerCase();
            return arName.includes(normArtist) || normArtist.includes(arName);
          })
        : true;
      return (
        (aName === normName || aName.includes(normName) || normName.includes(aName)) && aArtistMatch
      );
    });
    if (matchBoth?.uri) return matchBoth.uri;
  }

  const exactMatch = items.find((it) => (it.name || "").toLowerCase() === normName);
  if (exactMatch?.uri) return exactMatch.uri;

  const matchName = items.find((it) => {
    const itName = (it.name || "").toLowerCase();
    return itName === normName || itName.includes(normName) || normName.includes(itName);
  });
  if (matchName?.uri) return matchName.uri;

  return items[0]?.uri || null;
}

/**
 * Normalizes a Home Assistant BrowseMedia child item into YAMP's search result item shape.
 * @param {any} child
 * @param {{ fallbackArtist?: string | null, fallbackAlbum?: string | null }} [context]
 * @returns {any}
 */
export function normalizeBrowseMediaChild(
  child,
  { fallbackArtist = null, fallbackAlbum = null } = {}
) {
  if (!child || typeof child !== "object") return child;
  const mediaClass = child.media_class || child.media_content_type || "";
  const isBrowsable =
    typeof child.is_browsable === "boolean"
      ? child.is_browsable
      : typeof child.can_expand === "boolean"
        ? child.can_expand
        : mediaClass === "artist" || mediaClass === "album" || mediaClass === "playlist";

  let title = child.title ?? child.name ?? "";
  let artist = child.artist ?? "";
  const album = child.album ?? fallbackAlbum ?? undefined;

  if (!artist && typeof title === "string" && title.includes(" - ")) {
    const sepIdx = title.indexOf(" - ");
    const parsedArtist = title.slice(0, sepIdx).trim();
    const parsedTitle = title.slice(sepIdx + 3).trim();
    if (parsedArtist && parsedTitle) {
      artist = parsedArtist;
      title = parsedTitle;
    }
  }
  if (!artist && fallbackArtist) {
    artist = fallbackArtist;
  }

  return {
    ...child,
    title,
    ...(artist ? { artist } : {}),
    ...(album ? { album } : {}),
    is_browsable: isBrowsable,
  };
}

/**
 * Creates a state snapshot map for monitored media players.
 * @param {Record<string, any> | undefined} states
 * @param {string[] | null | undefined} entityIds
 * @returns {Record<string, { state: string | null, mediaId: string | null, mediaTitle: string | null }>}
 */
export function snapshotPlaybackStateMap(states, entityIds) {
  /** @type {Record<string, { state: string | null; mediaId: string | null; mediaTitle: string | null }>} */
  const snapshot = {};
  if (!Array.isArray(entityIds)) return snapshot;
  entityIds.forEach((id) => {
    const stateObj = id && states ? states[id] : null;
    snapshot[id] = {
      state: stateObj?.state ?? null,
      mediaId: stateObj?.attributes?.media_content_id ?? null,
      mediaTitle: stateObj?.attributes?.media_title ?? null,
    };
  });
  return snapshot;
}

/**
 * Checks if a playback state transition or media change occurred compared to an earlier snapshot.
 * @param {Record<string, { state: string | null, mediaId: string | null, mediaTitle: string | null }>} snapshot
 * @param {Record<string, any> | undefined} states
 * @param {string[] | null | undefined} entityIds
 * @param {(stateObj: any) => boolean} isEntityPlayingFn
 * @param {{ requireMediaChange?: boolean }} [options]
 * @returns {boolean}
 */
export function hasPlaybackStateChanged(
  snapshot,
  states,
  entityIds,
  isEntityPlayingFn,
  { requireMediaChange = false } = {}
) {
  if (!Array.isArray(entityIds) || !states) return false;
  for (const id of entityIds) {
    if (!id) continue;
    const stateObj = states[id];
    if (!stateObj) continue;
    const previous = snapshot[id] || { state: null, mediaId: null, mediaTitle: null };
    const wasPlaying = previous.state === "playing";
    const currentMediaId = stateObj.attributes?.media_content_id ?? null;
    const currentTitle = stateObj.attributes?.media_title ?? null;
    const mediaChanged =
      (currentMediaId && currentMediaId !== previous.mediaId) ||
      (currentTitle && currentTitle !== previous.mediaTitle) ||
      (!previous.mediaId && currentMediaId) ||
      (!previous.mediaTitle && currentTitle);

    if (mediaChanged) {
      return true;
    }

    if (!requireMediaChange && !wasPlaying && isEntityPlayingFn?.(stateObj)) {
      return true;
    }
  }
  return false;
}

export class SearchController {
  /**
   * @param {any} host
   */
  constructor(host) {
    /** @type {any} */
    this.host = host;

    if (host && typeof host.addController === "function") {
      host.addController(this);
    }
  }

  /**
   * Lit lifecycle hook: connectedCallback
   */
  hostConnected() {}

  /**
   * Lit lifecycle hook: disconnectedCallback
   */
  hostDisconnected() {
    if (this.host?._searchHeaderTransitionTimer) {
      clearTimeout(this.host._searchHeaderTransitionTimer);
      this.host._searchHeaderTransitionTimer = null;
    }
    if (this.host?._searchTimeoutHandle && !this.host._searchLoading) {
      clearTimeout(this.host._searchTimeoutHandle);
      this.host._searchTimeoutHandle = null;
    }
    if (this.host?._successToastHandle) {
      clearTimeout(this.host._successToastHandle);
      this.host._successToastHandle = null;
    }
    this.removeSearchSwipeHandlers();
  }

  /**
   * Attach horizontal swipe on the search-results area to cycle media-class filters.
   */
  attachSearchSwipe() {
    if (this.host?._searchSwipeAttached) return;
    const area = this.host?.renderRoot?.querySelector(".entity-options-search-results");
    if (!area) return;

    if (this.host?._searchHierarchy?.length > 0) {
      return;
    }

    this.host._searchSwipeAttached = true;
    const threshold = 40;

    const touchstartHandler = (e) => {
      if (e.touches.length === 1) {
        this.host._swipeStartX = e.touches[0].clientX;
      }
    };

    const touchendHandler = (e) => {
      if (this.host._swipeStartX === null) return;
      const endX = (e.changedTouches && e.changedTouches[0].clientX) || null;
      if (endX === null) {
        this.host._swipeStartX = null;
        return;
      }
      const dx = endX - this.host._swipeStartX;
      if (Math.abs(dx) > threshold) {
        const allClasses = new Set();
        Object.values(this.host._searchResultsByType || {}).forEach((results) => {
          results.forEach((item) => {
            if (item.media_class) allClasses.add(item.media_class);
          });
        });
        const currEntityObj = this.host.entityObjs?.[this.host._selectedIndex] || null;
        const hiddenSet = new Set(currEntityObj?.hidden_filter_chips || []);
        const classes = Array.from(allClasses).filter((c) => !hiddenSet.has(c));
        const filterOrder = ["all", ...classes];
        const currIdx = filterOrder.indexOf(this.host._searchMediaClassFilter || "all");
        const dir = dx < 0 ? 1 : -1;
        const nextIdx = (currIdx + dir + filterOrder.length) % filterOrder.length;
        const nextFilter = filterOrder[nextIdx];
        this.doSearch(nextFilter === "all" ? null : nextFilter);
      }
      this.host._swipeStartX = null;
    };

    area.addEventListener("touchstart", touchstartHandler, { passive: true });
    area.addEventListener("touchend", touchendHandler, { passive: true });

    area._searchSwipeHandlers = {
      touchstart: touchstartHandler,
      touchend: touchendHandler,
    };
  }

  /**
   * Removes search swipe handlers from DOM.
   */
  removeSearchSwipeHandlers() {
    const area = this.host?.renderRoot?.querySelector(".entity-options-search-results");
    if (area && area._searchSwipeHandlers) {
      const handlers = area._searchSwipeHandlers;
      area.removeEventListener("touchstart", handlers.touchstart);
      area.removeEventListener("touchend", handlers.touchend);
      delete area._searchSwipeHandlers;
      if (this.host) {
        this.host._searchSwipeAttached = false;
      }
    }
  }

  /**
   * Resolves insecure http:// thumbnails to data URIs over HTTPS when mass_queue is available and not disabled.
   * If mass_queue is absent or disabled, insecure http:// thumbnails are safely left as-is because
   * isValidArtworkUrl will prevent them from rendering into <img src> and causing mixed-content warnings.
   * @param {any[]} [results]
   * @returns {Promise<void>}
   */
  async resolveInsecureResultThumbnails(results) {
    if (!Array.isArray(results) || results.length === 0) return;
    if (typeof window === "undefined" || window.location?.protocol !== "https:") return;

    const isMassQueueDisabled = this.host?.config?.disable_mass_queue === true;
    const hasMassQueueService = checkMassQueueServices(this.host?.hass?.services);
    const canFetchViaMassQueue =
      !isMassQueueDisabled && hasMassQueueService && Boolean(this.host?.hass?.callWS);

    let needsImmediateUpdate = false;
    const toFetch = [];

    for (const item of results) {
      if (!item || !item.thumbnail || typeof item.thumbnail !== "string") continue;
      if (!isInsecureHttpUrlOnHttps(item.thumbnail)) continue;

      const cached = getCachedSecureThumbnail(item.thumbnail);
      if (cached) {
        item.thumbnail = cached;
        needsImmediateUpdate = true;
      } else if (canFetchViaMassQueue) {
        toFetch.push(item);
      }
    }

    if (needsImmediateUpdate) {
      this.host?.requestUpdate?.();
    }

    if (toFetch.length === 0) return;

    const promises = toFetch.map(async (item) => {
      const rawUrl = item.thumbnail;
      try {
        const secureUrl = await resolveSecureThumbnailUrl(this.host.hass, rawUrl);
        if (secureUrl && item.thumbnail === rawUrl) {
          item.thumbnail = secureUrl;
          return true;
        }
      } catch (_e) {
        // Fallback remains clean placeholder icon
      }
      return false;
    });

    const resultsUpdated = await Promise.all(promises);
    if (resultsUpdated.some(Boolean)) {
      this.host?.requestUpdate?.();
    }
  }

  getMockItemFromCurrentTrack() {
    const stateObj =
      this.host?.currentActivePlaybackStateObj ||
      this.host?.currentPlaybackStateObj ||
      this.host?.currentStateObj;
    if (!stateObj || !stateObj.attributes || !stateObj.attributes.media_title) return null;

    return {
      title: stateObj.attributes.media_title,
      media_title: stateObj.attributes.media_title,
      media_content_id: stateObj.attributes.media_content_id || stateObj.attributes.media_title,
      media_artist: stateObj.attributes.media_artist || "",
      media_content_type: "track",
      media_type: "track",
    };
  }

  isCurrentlyPlayingRadio() {
    const stateObj =
      this.host?.currentActivePlaybackStateObj ||
      this.host?.currentPlaybackStateObj ||
      this.host?.currentStateObj;
    if (!stateObj?.attributes) return false;
    const ct = (stateObj.attributes.media_content_type || "").toLowerCase();
    const cid = (stateObj.attributes.media_content_id || "").toLowerCase();
    return ct === "radio" || cid.startsWith("library://radio/");
  }

  handlePlaySimilar() {
    const mockItem = this.getMockItemFromCurrentTrack();
    if (!mockItem) return;

    this.host._showMediaTitleOptions = false;
    this.host._radioModeActive = true;

    this.playMediaFromSearch(mockItem);
  }

  async handleAddCurrentToPlaylist() {
    const mockItem = this.getMockItemFromCurrentTrack();
    if (!mockItem) return;

    this.host._showMediaTitleOptions = false;
    this.host._showEntityOptions = true;
    this.host._showSearchInSheet = true;
    this.host._dismissMenuAfterPlaylistAdd = true;

    if (this.isCurrentlyPlayingRadio()) {
      const searchTerm = mockItem.title;
      this.host._addToPlaylistTarget = null;
      this.host._searchHierarchy.push({
        type: "select_track_for_playlist",
        name: localize("search.select_track_for_playlist", {
          "{track}": mockItem.title,
          "{artist}": mockItem.media_artist,
        }),
        query: this.host._searchQuery,
        filter: this.host._searchMediaClassFilter,
      });
      this.host._searchBreadcrumb = localize("search.select_track_for_playlist", {
        "{track}": mockItem.title,
        "{artist}": mockItem.media_artist,
      });
      this.host._searchQuery = searchTerm;
      this.host._currentSearchQuery = searchTerm;
      this.host._searchMediaClassFilter = "track";
      this.resetSearchContext();
      this.removeSearchSwipeHandlers();
      await this.doSearch("track", {
        clearFilters: true,
        artist: mockItem.media_artist,
      });
      return;
    }

    this.performSearchOptionAction(mockItem, "add_to_playlist");
  }

  async searchArtistFromNowPlaying() {
    const artist =
      (
        this.host?.currentActivePlaybackStateObj ||
        this.host?.currentPlaybackStateObj ||
        this.host?.currentStateObj
      )?.attributes?.media_artist || "";
    if (!artist) return;

    this.host._openedSearchFromNowPlaying = true;
    this.host._showEntityOptions = true;
    this.host._showSearchInSheet = true;
    this.host._searchInputAutoFocused = false;

    this.host._searchError = "";
    this.host._searchResults = [];
    this.host._searchQuery = "";
    this.host._searchAttempted = false;
    this.host._searchResultsByType = {};
    this.host._currentSearchQuery = "";
    this.host._searchHierarchy = [];
    this.host._searchBreadcrumb = "";
    this.host._usingMusicAssistant = false;
    this.host._favoritesFilterActive = false;
    this.host._recentlyPlayedFilterActive = false;
    this.host._upcomingFilterActive = false;
    this.host._recommendationsFilterActive = false;
    this.host._initialFavoritesLoaded = false;
    this.host._lastSearchUsedServerFavorites = false;

    this.host.requestUpdate();

    /** @type {string | null} */
    let artistUri = null;
    if (this.host?._isMusicAssistantEntity?.()) {
      try {
        const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
        const searchEntityId = await this.host._resolveTemplateAtActionTime(
          searchEntityIdTemplate,
          this.host.currentEntityId
        );
        artistUri = await this.resolveArtistUri(artist, searchEntityId);
      } catch (e) {
        console.warn("yamp: error resolving artist URI:", e);
      }
    }

    this.searchArtistAlbums(artist, artistUri).catch((error) => {
      console.error("yamp: artist quick-search failed:", error);
    });
  }

  /**
   * Resolve a media URI (album or artist) from Music Assistant
   * @param {"album"|"artist"|"playlist"|string} mediaType
   * @param {string} name
   * @param {Record<string, any>} extraParams
   * @param {string} entityId
   * @returns {Promise<string|null>}
   */
  async resolveMediaUri(mediaType, name, extraParams = {}, entityId) {
    if (!name || !this.host?.hass) return null;
    try {
      const configEntryId = await getMusicAssistantConfigEntryId(this.host.hass, entityId);
      if (!configEntryId) return null;

      const serviceData = {
        name,
        media_type: [mediaType],
        ...(configEntryId && configEntryId !== "auto" ? { config_entry_id: configEntryId } : {}),
        ...extraParams,
      };

      const msg = {
        type: "call_service",
        domain: "music_assistant",
        service: "search",
        service_data: serviceData,
        return_response: true,
      };

      const res = await this.host.hass.connection.sendMessagePromise(msg);
      const items = res?.response?.[`${mediaType}s`] || [];
      return matchResolvedMediaUri(items, mediaType, name, extraParams.artist);
    } catch (e) {
      console.warn(`yamp: Failed to resolve ${mediaType} URI:`, e);
      return null;
    }
  }

  resolveAlbumUri(albumName, artistName, entityId) {
    return this.resolveMediaUri(
      "album",
      albumName,
      artistName ? { artist: artistName } : {},
      entityId
    );
  }

  resolveArtistUri(artistName, entityId) {
    return this.resolveMediaUri("artist", artistName, {}, entityId);
  }

  resolvePlaylistUri(playlistName, entityId) {
    return this.resolveMediaUri("playlist", playlistName, {}, entityId);
  }

  async searchAlbumFromNowPlaying() {
    const activeObj =
      this.host?.currentActivePlaybackStateObj ||
      this.host?.currentPlaybackStateObj ||
      this.host?.currentStateObj;
    const album = activeObj?.attributes?.media_album_name || "";
    const artist = activeObj?.attributes?.media_artist || "";
    if (!album) return;

    this.host._openedSearchFromNowPlaying = true;
    this.host._showEntityOptions = true;
    this.host._showSearchInSheet = true;
    this.host._searchInputAutoFocused = false;

    this.host._searchError = "";
    this.host._searchResults = [];
    this.host._searchQuery = "";
    this.host._searchAttempted = false;
    this.host._searchResultsByType = {};
    this.host._currentSearchQuery = "";
    this.host._searchHierarchy = [];
    this.host._searchBreadcrumb = "";
    this.host._usingMusicAssistant = false;
    this.host._favoritesFilterActive = false;
    this.host._recentlyPlayedFilterActive = false;
    this.host._upcomingFilterActive = false;
    this.host._recommendationsFilterActive = false;
    this.host._initialFavoritesLoaded = false;
    this.host._lastSearchUsedServerFavorites = false;

    this.host.requestUpdate();

    /** @type {string | null} */
    let albumUri = null;
    if (this.host?._isMusicAssistantEntity?.()) {
      try {
        const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
        const searchEntityId = await this.host._resolveTemplateAtActionTime(
          searchEntityIdTemplate,
          this.host.currentEntityId
        );
        albumUri = await this.resolveAlbumUri(album, artist, searchEntityId);
      } catch (e) {
        console.warn("yamp: error resolving album URI:", e);
      }
    }

    this.searchAlbumTracks(album, artist, albumUri).catch((error) => {
      console.error("yamp: album quick-search failed:", error);
    });
  }

  showSearchSheetInOptions(mode = "default") {
    this.host._showSearchInSheet = true;
    this.host._searchHeadersRetracted = false;
    this.host._searchHeaderOffset = 0;
    this.host._searchHeaderNaturalHeight = 0;
    this.host._lastSearchResultsScrollTop = 0;
    this.host._searchInputAutoFocused = false;
    this.host._searchError = "";
    this.host._searchResults = [];
    this.host._searchQuery = "";
    this.host._searchAttempted = false;
    this.host._searchResultsByType = {};
    this.host._currentSearchQuery = "";
    this.host._searchHierarchy = [];
    this.host._searchBreadcrumb = "";
    this.host._usingMusicAssistant = false;
    this.host._favoritesFilterActive = this.host.config?.default_search_favorites === true;
    this.host._recentlyPlayedFilterActive = false;
    this.host._upcomingFilterActive = false;
    this.host._recommendationsFilterActive = false;
    this.host._initialFavoritesLoaded = false;
    void this.checkAiRadioAvailability();

    this.host.requestUpdate();

    setTimeout(() => {
      let promise;
      switch (mode) {
        case "recently-played":
          promise = this.toggleRecentlyPlayedFilter(true);
          break;
        case "next-up":
          promise = this.toggleUpcomingFilter(true);
          break;
        case "recommendations":
          promise = this.toggleRecommendationsFilter(true);
          break;
        default: {
          const defaultFilter =
            this.host.config?.default_search_filter === "all"
              ? null
              : this.host.config?.default_search_filter;
          promise = this.doSearch(defaultFilter);
          break;
        }
      }
      if (promise?.catch) {
        promise.catch((err) => {
          console.error("yamp: search initialization failed:", err);
        });
      }
    }, 100);

    if (!this.host._disableSearchAutofocus) {
      const focusDelay = this.host._alwaysCollapsed && this.host._expandOnSearch ? 300 : 200;
      setTimeout(() => {
        const inp = this.host.renderRoot?.querySelector("#search-input-box");
        if (inp) {
          inp.focus();
        } else {
          setTimeout(() => {
            const retryInp = this.host.renderRoot?.querySelector("#search-input-box");
            if (retryInp) {
              retryInp.focus();
            }
          }, 200);
        }
      }, focusDelay);
    }
  }

  openQuickSearchOverlay(mode = "default") {
    this.host._quickMenuInvoke = true;
    this.host._showEntityOptions = true;
    this.showSearchSheetInOptions(mode);
    setTimeout(() => {
      this.host._notifyResize?.();
    }, 0);
  }

  hideSearchSheetInOptions() {
    if (this.host._cardType === "search" || this.host._cardType === "up_next") return;
    this.host._openedSearchFromNowPlaying = false;
    this.host._showSearchInSheet = false;
    this.host._searchHeadersRetracted = false;
    this.host._searchHeaderOffset = 0;
    this.host._searchHeaderNaturalHeight = 0;
    this.host._lastSearchResultsScrollTop = 0;
    this.host._searchError = "";
    this.host._searchResults = [];
    this.host._searchQuery = "";
    this.host._searchDisplaySortOverride = null;
    this.host._searchInputAutoFocused = false;
    this.host._searchLoading = false;
    this.host._searchAttempted = false;
    this.host._searchResultsByType = {};
    this.host._currentSearchQuery = "";
    this.host._searchHierarchy = [];
    this.host._searchBreadcrumb = "";
    this.host._addToPlaylistTarget = null;
    this.host._dismissMenuAfterPlaylistAdd = false;
    this.host._recommendationsFilterActive = false;
    this.host._lastSearchUsedServerFavorites = false;
    if (this.host._quickMenuInvoke) {
      this.host._showEntityOptions = false;
      this.host._quickMenuInvoke = false;
    }
    this.host.requestUpdate();
    setTimeout(() => {
      this.host._notifyResize?.();
    }, 0);
  }

  closeMenuIfOpen() {
    if (this.host?._queueActionsMenuOpenId) {
      this.host._closeQueueActionsMenu?.();
    }
  }

  sortSearchResults(results, sortModeOverride = null) {
    const skipSort =
      !!this.host?._upcomingFilterActive ||
      !!this.host?._recentlyPlayedFilterActive ||
      !!this.host?._recommendationsFilterActive;
    const sortMode = sortModeOverride ?? this.getConfiguredSearchResultsSortMode();
    return sortSearchResultsList(results, sortMode, skipSort);
  }

  getConfiguredSearchResultsSortMode() {
    const configured = this.host?.config?.search_results_sort;
    const mode = typeof configured === "string" ? configured : "default";
    return this.mapLegacySortOption(mode);
  }

  mapLegacySortOption(mode) {
    return mapLegacySortOption(mode);
  }

  isSortableSearchMode(mode) {
    return isSortableSearchMode(mode);
  }

  getOppositeSearchSortMode(mode) {
    return getOppositeSearchSortMode(mode);
  }

  shouldShowSearchSortToggle() {
    if (
      this.host?._upcomingFilterActive ||
      this.host?._recentlyPlayedFilterActive ||
      this.host?._recommendationsFilterActive
    ) {
      return false;
    }
    return this.isSortableSearchMode(this.getConfiguredSearchResultsSortMode());
  }

  toggleSearchResultsSortDirection() {
    if (!this.shouldShowSearchSortToggle()) {
      this.host._searchDisplaySortOverride = null;
      return;
    }
    const configured = this.getConfiguredSearchResultsSortMode();
    const alternate = this.getOppositeSearchSortMode(configured);
    if (!alternate) {
      this.host._searchDisplaySortOverride = null;
      return;
    }
    if (this.host._searchDisplaySortOverride === alternate) {
      this.host._searchDisplaySortOverride = null;
    } else {
      this.host._searchDisplaySortOverride = alternate;
    }
    this.host._searchResultsByType = {};
    this.doSearch(
      this.host._searchMediaClassFilter === "all" ? null : this.host._searchMediaClassFilter,
      { orderBy: this.getActiveSearchDisplaySortMode() }
    );
    this.host.requestUpdate();
  }

  getActiveSearchDisplaySortMode() {
    if (
      this.host?._upcomingFilterActive ||
      this.host?._recentlyPlayedFilterActive ||
      this.host?._recommendationsFilterActive
    ) {
      return "default";
    }
    if (!this.shouldShowSearchSortToggle()) {
      return this.getConfiguredSearchResultsSortMode();
    }
    const override = this.host?._searchDisplaySortOverride;
    if (override && this.isSortableSearchMode(override)) {
      return override;
    }
    return this.getConfiguredSearchResultsSortMode();
  }

  getSearchSortToggleIcon() {
    const mode = this.getActiveSearchDisplaySortMode();
    if (!this.isSortableSearchMode(mode)) {
      return "mdi:sort-variant";
    }
    return mode.endsWith("_desc") ? "mdi:sort-descending" : "mdi:sort-ascending";
  }

  getSearchSortToggleTitle() {
    const mode = this.getActiveSearchDisplaySortMode();
    if (!this.isSortableSearchMode(mode)) {
      return "Toggle search result order";
    }
    const isDesc = mode.endsWith("_desc");
    const baseName = isDesc ? mode.replace(/_desc$/, "") : mode;
    const label = baseName.replace(/_/g, " ");
    return `Sort by ${label} ${isDesc ? "descending" : "ascending"}`;
  }

  getDisplaySearchResults() {
    return filterHierarchySearchResults(
      this.host?._searchResults,
      this.host?._searchHierarchy,
      this.host?._searchQuery
    );
  }

  getSearchResultsLimit() {
    const raw = Number(this.host?.config?.search_results_limit);
    if (Number.isFinite(raw)) {
      if (raw === 0) {
        return 0;
      }
      return Math.min(Math.max(raw, 1), 1000);
    }
    return 20;
  }

  getSearchResultsCount() {
    return this.getDisplaySearchResults().length;
  }

  shouldShowSearchResultsCount() {
    if (
      this.host?._isNarrowViewport ||
      !this.host?._usingMusicAssistant ||
      this.host?._searchLoading
    ) {
      return false;
    }
    const count = this.getSearchResultsCount();
    if (count > 0) {
      return true;
    }
    return (
      !!this.host?._searchAttempted ||
      !!this.host?._initialFavoritesLoaded ||
      !!this.host?._favoritesFilterActive ||
      !!this.host?._recentlyPlayedFilterActive ||
      !!this.host?._upcomingFilterActive ||
      !!this.host?._recommendationsFilterActive
    );
  }

  getSearchResultsCountLabel() {
    const count = this.getSearchResultsCount();
    const key = count === 1 ? "search.result" : "search.results";
    return `${count} ${localize(key)}`;
  }

  /**
   * Executes a media search across Music Assistant or Home Assistant entities.
   * @param {string | null} [mediaType]
   * @param {Record<string, any>} [searchParams]
   * @returns {Promise<void>}
   */
  async doSearch(mediaType = null, searchParams = {}) {
    if (!this.host) return;
    this.host._searchAttempted = true;
    this.closeMenuIfOpen();
    this.setSearchHeadersRetracted(false);
    this.host._lastSearchResultsScrollTop = 0;
    this.host._searchMediaClassFilter = mediaType && mediaType !== "favorites" ? mediaType : "all";

    const isFavorites = !!(
      searchParams.favorites ||
      ((this.host._favoritesFilterActive ||
        this.host._initialFavoritesLoaded ||
        this.host._lastSearchUsedServerFavorites) &&
        !searchParams.clearFilters)
    );

    if (isFavorites) {
      this.host._favoritesFilterActive = true;
    }

    const isRecentlyPlayed = !!(
      searchParams.isRecentlyPlayed ||
      (this.host._recentlyPlayedFilterActive && !searchParams.clearFilters)
    );
    const isUpcoming = !!(
      searchParams.isUpcoming ||
      (this.host._upcomingFilterActive && !searchParams.clearFilters)
    );
    const isRecommendations = !!(
      searchParams.isRecommendations ||
      (this.host._recommendationsFilterActive && !searchParams.clearFilters)
    );

    if (this.host._currentSearchQuery !== this.host._searchQuery) {
      this.host._searchResultsByType = {};
      this.host._currentSearchQuery = this.host._searchQuery;
    }

    const sortMode = this.getActiveSearchDisplaySortMode();
    const cacheKey = `${mediaType || "all"}${isFavorites ? "_favorites" : ""}${
      isRecentlyPlayed ? "_recently_played" : ""
    }${isUpcoming ? "_upcoming" : ""}${
      isRecommendations ? "_recommendations" : ""
    }_sort_${sortMode}`;
    const forceFetch = !!searchParams.force;

    if (this.host._searchResultsByType[cacheKey] && !forceFetch) {
      if (this.host._searchTimeoutHandle) {
        clearTimeout(this.host._searchTimeoutHandle);
        this.host._searchTimeoutHandle = null;
      }
      this.host._latestSearchToken = 0;
      this.host._searchResults = this.sortSearchResults(this.host._searchResultsByType[cacheKey]);
      this.resolveInsecureResultThumbnails(this.host._searchResults);
      this.host._searchLoading = false;
      this.host._searchError = "";
      this.host.requestUpdate();
      return;
    }

    const isSilent = !!searchParams.silent;
    if (!isSilent) {
      this.host._searchLoading = true;
      this.host._searchError = "";
      this.host._searchResults = [];
      this.host.requestUpdate();
    }
    const searchToken = searchParams.token || Date.now();
    this.host._latestSearchToken = searchToken;
    const progressiveUpdate = (chunk) =>
      this.handleProgressiveSearchResults(chunk, cacheKey, searchToken);
    if (this.host._searchTimeoutHandle) {
      clearTimeout(this.host._searchTimeoutHandle);
    }
    this.host._searchTimeoutHandle = window.setTimeout(
      () => {
        if (this.host._latestSearchToken === searchToken && this.host._searchLoading) {
          this.host._searchLoading = false;
          this.host._searchError = "Search timed out. Try again.";
          this.host.requestUpdate();
        }
      },
      this.host.config?.search_timeout_ms ? Number(this.host.config.search_timeout_ms) : 15000
    );

    try {
      const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
      const searchEntityId = await this.host._resolveTemplateAtActionTime(
        searchEntityIdTemplate,
        this.host.currentEntityId
      );

      let searchResponse;

      if (
        this.host._addToPlaylistTarget &&
        mediaType === "playlist" &&
        this.host._massQueueAvailable
      ) {
        this.host._initialFavoritesLoaded = false;
        try {
          const mqConfigEntryId = await getMassQueueConfigEntryId(this.host.hass, searchEntityId);
          if (mqConfigEntryId) {
            /** @type {Record<string, any>} */
            const apiData = { limit: PLAYLIST_FETCH_LIMIT };
            if (this.host._searchQuery && this.host._searchQuery.trim().length > 0) {
              apiData.search = this.host._searchQuery.trim();
            }
            const orderBy = this.getActiveSearchDisplaySortMode();
            if (orderBy && orderBy !== "default") {
              apiData.order_by = orderBy;
            }

            const message = {
              type: "call_service",
              domain: "mass_queue",
              service: "send_command",
              service_data: {
                ...(mqConfigEntryId && mqConfigEntryId !== "auto"
                  ? { config_entry_id: mqConfigEntryId }
                  : {}),
                command: "music/playlists/library_items",
                data: apiData,
              },
              return_response: true,
            };

            const res = await this.host.hass.connection.sendMessagePromise(message);
            let rawPlaylists = [];

            if (Array.isArray(res?.response)) {
              rawPlaylists = res.response;
            } else if (Array.isArray(res?.response?.response)) {
              rawPlaylists = res.response.response;
            } else if (Array.isArray(res?.response?.items)) {
              rawPlaylists = res.response.items;
            } else if (Array.isArray(res?.response?.results)) {
              rawPlaylists = res.response.results;
            }

            if (Array.isArray(rawPlaylists)) {
              const displayLimit = this.getSearchResultsLimit() || 30;
              const mappedPlaylists = rawPlaylists
                .filter((p) => p.is_editable === true)
                .map((p) => transformMusicAssistantItem(p))
                .filter(Boolean)
                .slice(0, displayLimit);

              searchResponse = { results: mappedPlaylists, usedMusicAssistant: true };
            }
          }
        } catch (e) {
          console.warn("yamp: error fetching direct native playlists for add-to-target logic", e);
        }

        if (!searchResponse) {
          searchResponse = { results: [], usedMusicAssistant: true };
        }
        this.host._lastSearchUsedServerFavorites = false;
      } else if (isRecentlyPlayed) {
        this.host._initialFavoritesLoaded = false;
        searchResponse = await getRecentlyPlayed(
          this.host.hass,
          searchEntityId,
          mediaType,
          this.getSearchResultsLimit(),
          { onChunk: progressiveUpdate }
        );
        this.host._lastSearchUsedServerFavorites = false;
      } else if (isUpcoming) {
        this.host._initialFavoritesLoaded = false;
        const upcomingLimit = Math.min(250, this.getSearchResultsLimit());
        searchResponse = await this.host._getUpcomingQueue(
          this.host.hass,
          searchEntityId,
          upcomingLimit
        );
        this.host._lastSearchUsedServerFavorites = false;
      } else if (isRecommendations) {
        this.host._initialFavoritesLoaded = false;
        searchResponse = await this.host._getRecommendations(
          this.host.hass,
          searchEntityId,
          mediaType,
          this.getSearchResultsLimit()
        );
        this.host._lastSearchUsedServerFavorites = false;
      } else if (isFavorites) {
        this.host._initialFavoritesLoaded = false;
        const orderBy = this.getActiveSearchDisplaySortMode();
        searchResponse = await searchMedia(
          this.host.hass,
          searchEntityId,
          this.host._searchQuery,
          mediaType,
          {
            ...searchParams,
            favorites: true,
            orderBy: orderBy !== "default" ? orderBy : undefined,
          },
          this.getSearchResultsLimit()
        );
        this.host._lastSearchUsedServerFavorites = true;
      } else if (
        (!this.host._searchQuery || this.host._searchQuery.trim() === "") &&
        !isFavorites &&
        !isRecentlyPlayed &&
        (mediaType === "all" || !mediaType)
      ) {
        const orderBy = this.getActiveSearchDisplaySortMode();
        searchResponse = await getFavorites(
          this.host.hass,
          searchEntityId,
          mediaType === "favorites" ? null : mediaType,
          this.getSearchResultsLimit(),
          { onChunk: progressiveUpdate, orderBy: orderBy !== "default" ? orderBy : undefined }
        );
        if (!this.host._searchQuery || this.host._searchQuery.trim() === "") {
          this.host._initialFavoritesLoaded = true;
        }
        this.host._lastSearchUsedServerFavorites = true;
      } else {
        this.host._initialFavoritesLoaded = false;
        const orderBy = this.getActiveSearchDisplaySortMode();
        searchResponse = await searchMedia(
          this.host.hass,
          searchEntityId,
          this.host._searchQuery,
          mediaType,
          { ...searchParams, orderBy: orderBy !== "default" ? orderBy : undefined },
          this.getSearchResultsLimit()
        );
        this.host._lastSearchUsedServerFavorites = false;
      }

      let arr = searchResponse.results || [];
      this.host._usingMusicAssistant = searchResponse.usedMusicAssistant || false;

      const isNewSearch = this.host._currentSearchQuery !== this.host._searchQuery;
      if (isNewSearch) {
        this.host._favoritesFilterActive = false;
        this.host._recentlyPlayedFilterActive = false;
        this.host._upcomingFilterActive = false;
        this.host._recommendationsFilterActive = false;
        this.host._initialFavoritesLoaded = false;
      }

      let normalizedResults = Array.isArray(arr) ? arr : [];
      if (this.host._latestSearchToken !== searchToken) {
        return;
      }

      if (
        (isRecentlyPlayed || isUpcoming || isRecommendations) &&
        this.host._searchQuery &&
        this.host._searchQuery.trim() !== ""
      ) {
        const query = this.host._searchQuery.trim().toLowerCase();
        normalizedResults = normalizedResults.filter((item) => {
          const title = (item.title || "").toLowerCase();
          const artist = (item.artist || "").toLowerCase();
          const album = (item.album || "").toLowerCase();
          return title.includes(query) || artist.includes(query) || album.includes(query);
        });
      }

      if (
        !isNewSearch &&
        this.host._favoritesFilterActive &&
        !this.host._lastSearchUsedServerFavorites
      ) {
        normalizedResults = await this.applyLocalFavoritesFilter(normalizedResults);
        if (this.host._latestSearchToken !== searchToken) {
          return;
        }
      }

      this.host._searchResultsByType[cacheKey] = normalizedResults;
      this.host._searchResults = this.sortSearchResults(normalizedResults);
      this.resolveInsecureResultThumbnails(this.host._searchResults);

      const rows = Array.isArray(this.host._searchResults) ? this.host._searchResults.length : 0;
      this.host._searchTotalRows = Math.max(15, rows);
    } catch (e) {
      this.host._searchError =
        e && typeof e === "object" && "message" in e ? String(e.message) : "Unknown error";
      this.host._searchResults = [];
      this.host._searchTotalRows = 0;
    }
    if (this.host._latestSearchToken === searchToken && this.host._searchTimeoutHandle) {
      clearTimeout(this.host._searchTimeoutHandle);
      this.host._searchTimeoutHandle = null;
    }
    if (this.host._latestSearchToken === searchToken) {
      this.host._latestSearchToken = 0;
    }
    this.host._searchLoading = false;
    this.host.requestUpdate();
    setTimeout(() => this.host._notifyResize?.(), 0);
  }

  async playCurrentCollection() {
    if (this.host._searchHierarchy.length === 0) return;
    const currentLevel = this.host._searchHierarchy[this.host._searchHierarchy.length - 1];
    if (!currentLevel || !currentLevel.uri) {
      this.host._searchError = localize("search.play_collection_error");
      this.host.requestUpdate();
      return;
    }

    const item = {
      media_content_id: currentLevel.uri,
      media_content_type: currentLevel.type,
    };

    await this.playMediaFromSearch(item);
  }

  handleSearchSubmit() {
    if (
      this.host._searchHierarchy.some(
        (h) => h.type === "album" || h.type === "playlist" || h.type === "artist"
      )
    ) {
      return;
    }
    const keepFilters = this.host._keepFiltersOnSearch;
    if (!keepFilters) {
      this.host._favoritesFilterActive = false;
      this.host._recentlyPlayedFilterActive = false;
      this.host._upcomingFilterActive = false;
      this.host._recommendationsFilterActive = false;
    }
    const clearFilters = !keepFilters;
    this.doSearch(
      this.host._searchMediaClassFilter === "all" ? null : this.host._searchMediaClassFilter,
      { clearFilters }
    );
  }

  handleProgressiveSearchResults(chunk, cacheKey, searchToken) {
    if (!Array.isArray(chunk) || !chunk.length) {
      return;
    }
    if (this.host._latestSearchToken !== searchToken) {
      return;
    }
    const mergedResults = (this.host._searchResultsByType[cacheKey] || []).concat(chunk);
    this.host._searchResultsByType[cacheKey] = mergedResults;
    this.host._searchResults = this.sortSearchResults(mergedResults);
    this.resolveInsecureResultThumbnails(chunk);
    const rows = Array.isArray(mergedResults) ? mergedResults.length : 0;
    this.host._searchTotalRows = Math.max(15, rows);
    this.host.requestUpdate();
  }

  getVisibleSearchFilterClasses() {
    const currEntityObj = this.host?.entityObjs?.[this.host._selectedIndex] || null;
    const hiddenSet = new Set(currEntityObj?.hidden_filter_chips || []);

    const list = [...ALLOWED_MEDIA_TYPES];
    if (this.host?._aiRadioShowsAvailable) {
      list.push("shows");
    }
    return list.filter((c) => !hiddenSet.has(c));
  }

  async playMediaFromSearch(item, event) {
    if (this.host?._isDragging) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      return;
    }
    const targetEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
    const targetEntityId = await this.host._resolveTemplateAtActionTime(
      targetEntityIdTemplate,
      this.host.currentEntityId
    );
    this.host._mediaSessionManager?.startPlaybackGesture(targetEntityId);
    this.host._searchError = "";

    this.host._loadingSearchRowMenuId = item?.media_content_id || null;
    this.host.requestUpdate();

    let playbackStarted;
    try {
      playbackStarted = await this.performSearchPlayback(item, targetEntityId);
    } finally {
      this.host._loadingSearchRowMenuId = null;
      this.host.requestUpdate();
    }

    if (!playbackStarted) {
      this.host._searchError = "Unable to start playback. Please try again.";
      this.host.requestUpdate();
      return;
    }

    const { shouldDismiss, shouldReset } = this.host._getSearchDismissBehavior();

    if (shouldDismiss) {
      if (this.host._showSearchInSheet) {
        this.host._closeEntityOptions();
        this.host._showSearchInSheet = false;
      }
      this.hideSearchSheetInOptions();
    } else if (shouldReset) {
      this.showSearchSheetInOptions();
    } else {
      this.host.requestUpdate();
    }
  }

  async performSearchPlayback(item, targetEntityId) {
    if (
      item.queue_item_id &&
      this.host._upcomingFilterActive &&
      this.host._isMusicAssistantEntity?.() &&
      this.host._massQueueAvailable
    ) {
      try {
        const maState = this.host._getMusicAssistantState();
        const maEntityId = maState?.entity_id;

        if (maEntityId) {
          await this.host.hass.callService("mass_queue", "play_queue_item", {
            entity: maEntityId,
            queue_item_id: item.queue_item_id,
          });
          this.host._advanceQueueInUI(item.queue_item_id, true);
          return true;
        }
      } catch (error) {
        console.error("yamp: Error playing queue item:", error);
        await mediaNextTrack(this.host.hass, targetEntityId);
        return true;
      }
    }

    if (!targetEntityId) {
      return false;
    }

    if (isShow(item)) {
      const monitorIds = this.collectPlaybackMonitorIds(targetEntityId);
      const snapshot = this.snapshotPlaybackState(monitorIds);
      const attempt = await this.invokePlayMedia(targetEntityId, item);
      if (!attempt) {
        return false;
      }
      const wasPlaying = monitorIds.some((id) => snapshot[id]?.state === "playing");
      await this.waitForPlaybackChange(snapshot, monitorIds, 25000, {
        requireMediaChange: wasPlaying,
      });
      return true;
    }

    const monitorIds = this.collectPlaybackMonitorIds(targetEntityId);
    const firstSnapshot = this.snapshotPlaybackState(monitorIds);
    const firstAttempt = await this.invokePlayMedia(targetEntityId, item);
    if (!firstAttempt) {
      return false;
    }
    const firstWasPlaying = monitorIds.some((id) => firstSnapshot[id]?.state === "playing");
    const firstChangeDetected = await this.waitForPlaybackChange(firstSnapshot, monitorIds, 2500, {
      requireMediaChange: firstWasPlaying,
    });
    if (firstChangeDetected) {
      return true;
    }

    const retrySnapshot = this.snapshotPlaybackState(monitorIds);
    const retryAttempt = await this.invokePlayMedia(targetEntityId, item);
    if (!retryAttempt) {
      return false;
    }
    const retryWasPlaying = monitorIds.some((id) => retrySnapshot[id]?.state === "playing");
    return await this.waitForPlaybackChange(retrySnapshot, monitorIds, 2500, {
      requireMediaChange: retryWasPlaying,
    });
  }

  collectPlaybackMonitorIds(targetEntityId) {
    const ids = new Set();
    if (targetEntityId) ids.add(targetEntityId);
    const playbackEntity = this.host?._getPlaybackEntityId?.(this.host._selectedIndex);
    if (playbackEntity) ids.add(playbackEntity);
    const mainEntity = this.host?.currentEntityId;
    if (mainEntity) ids.add(mainEntity);
    const maEntity = this.host?._getActualResolvedMaEntityForState?.(this.host._selectedIndex);
    if (maEntity) ids.add(maEntity);
    return Array.from(ids).filter(Boolean);
  }

  snapshotPlaybackState(entityIds) {
    return snapshotPlaybackStateMap(this.host?.hass?.states, entityIds);
  }

  async waitForPlaybackChange(
    snapshot,
    entityIds,
    timeout = 2500,
    { requireMediaChange = false } = {}
  ) {
    if (!Array.isArray(entityIds) || entityIds.length === 0) {
      return true;
    }
    const start = Date.now();
    const isPlayingFn = (stateObj) =>
      this.host?._isEntityPlaying ? this.host._isEntityPlaying(stateObj) : false;

    while (Date.now() - start < timeout) {
      await (this.host?._delay ? this.host._delay(150) : this.delay(150));
      if (
        hasPlaybackStateChanged(snapshot, this.host?.hass?.states, entityIds, isPlayingFn, {
          requireMediaChange,
        })
      ) {
        return true;
      }
    }
    return false;
  }

  async performSearchOptionAction(item, mode) {
    if (mode === "add_to_playlist") {
      this.host._addToPlaylistTarget = item;
      this.host._searchHierarchy.push({
        type: "select_playlist",
        name: localize("search.add_to_playlist"),
        query: this.host._searchQuery,
        filter: this.host._searchMediaClassFilter,
      });
      this.host._searchBreadcrumb = localize("search.select_playlist").replace(
        "{track}",
        item.title
      );
      this.host._searchQuery = "";
      this.host._currentSearchQuery = "";
      this.host._searchMediaClassFilter = "playlist";
      this.resetSearchContext();
      this.removeSearchSwipeHandlers();
      await this.doSearch("playlist", { clearFilters: true });
      return;
    }

    const targetEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
    const targetEntityId = await this.host._resolveTemplateAtActionTime(
      targetEntityIdTemplate,
      this.host.currentEntityId
    );

    try {
      const playParams = {
        entity_id: targetEntityId,
        media_id: item.media_content_id,
        media_type: item.media_content_type,
        enqueue: mode,
      };
      if (this.host._radioModeActive) {
        playParams.radio_mode = true;
      }

      await this.host.hass.callService("music_assistant", "play_media", playParams);
      this.invalidateUpcomingCache();

      if (mode === "replace") {
        const { shouldDismiss, shouldReset } = this.host._getSearchDismissBehavior();
        if (shouldDismiss) {
          this.host._closeEntityOptions();
        } else if (shouldReset) {
          this.showSearchSheetInOptions();
        }
        this.host._activeSearchRowMenuId = null;
      } else {
        this.host._successSearchRowMenuId = item.media_content_id;
        this.host.requestUpdate();

        const shouldDismissMenu =
          this.host._dismissMenuAfterPlaylistAdd && mode === "add_to_playlist";

        setTimeout(() => {
          this.host._successSearchRowMenuId = null;
          this.host._activeSearchRowMenuId = null;

          if (shouldDismissMenu) {
            this.host._closeEntityOptions();
            this.host._dismissMenuAfterPlaylistAdd = false;
          }

          this.host.requestUpdate();
        }, 2000);
      }
    } catch (e) {
      console.error("Failed to perform search option action:", e);
      this.host._searchError = "Action failed: " + (e instanceof Error ? e.message : String(e));
      this.host.requestUpdate();
    }
  }

  async invokePlayMedia(targetEntityId, item) {
    try {
      this.host._mediaSessionManager?.startPlaybackGesture(targetEntityId);
      if (isShow(item)) {
        await playAiRadioStation(this.host.hass, targetEntityId, item.station_id || item.item_id);
      } else if (this.host._radioModeActive) {
        await this.host.hass.callService("music_assistant", "play_media", {
          entity_id: targetEntityId,
          media_id: item.media_content_id,
          media_type: item.media_content_type,
          radio_mode: true,
        });
      } else {
        await playSearchedMedia(this.host.hass, targetEntityId, item);
      }
      return true;
    } catch (error) {
      console.error("yamp: Error starting playback from search:", error);
      return false;
    }
  }

  delay(ms) {
    return new Promise((resolve) => {
      const timerHost = typeof window !== "undefined" ? window : globalThis;
      timerHost.setTimeout(resolve, ms);
    });
  }

  /**
   * Loads albums for an artist via browse_media or search.
   * @param {string | null} artistUri
   * @param {string} artistName
   * @returns {Promise<void>}
   */
  async loadArtistAlbums(artistUri, artistName) {
    if (artistUri && this.host?._isMusicAssistantEntity?.()) {
      try {
        const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
        const searchEntityId = await this.host._resolveTemplateAtActionTime(
          searchEntityIdTemplate,
          this.host.currentEntityId
        );

        const browseMsg = {
          type: "call_service",
          domain: "media_player",
          service: "browse_media",
          service_data: {
            entity_id: searchEntityId,
            media_content_id: artistUri,
            media_content_type: "artist",
          },
          return_response: true,
        };

        const browseRes = await this.host.hass.connection.sendMessagePromise(browseMsg);
        const browseResult =
          browseRes?.response?.[searchEntityId]?.result || browseRes?.result || {};
        const children = browseResult.children || [];
        const albums = children
          .filter((c) => c.media_class === "album" || c.media_content_type === "album")
          .map((c) => normalizeBrowseMediaChild(c, { fallbackArtist: artistName }));

        if (albums.length > 0) {
          this.host._searchQuery = "";
          this.host._searchResults = this.sortSearchResults(albums);
          this.resolveInsecureResultThumbnails(this.host._searchResults);
          this.host._searchTotalRows = Math.max(15, albums.length);
          this.host._searchAttempted = true;
          this.host._searchLoading = false;
          this.host.requestUpdate();
          return;
        }
      } catch (_e) {
        // Fall back to search
      }
    }

    await this.doSearch("album", { artist: artistName, clearFilters: true });
  }

  /**
   * Search and navigate directly to artist albums hierarchy.
   * @param {string} artistName
   * @param {string | null} [artistUri]
   * @returns {Promise<void>}
   */
  async searchArtistAlbums(artistName, artistUri = null) {
    this.host._searchHierarchy.push({
      type: "artist",
      name: artistName,
      query: this.host._searchQuery,
      uri: artistUri,
      filter: this.host._searchMediaClassFilter,
    });
    this.host._searchBreadcrumb = `Albums by ${artistName}`;
    this.host._searchResultsByType = {};
    this.host._currentSearchQuery = "";
    this.host._searchMediaClassFilter = "album";

    this.host._searchResults = [];
    this.host._searchLoading = true;
    this.host._searchQuery = "";
    this.host.requestUpdate();

    this.host._favoritesFilterActive = false;
    this.host._recentlyPlayedFilterActive = false;
    this.host._upcomingFilterActive = false;
    this.host._initialFavoritesLoaded = false;

    this.removeSearchSwipeHandlers();
    await this.loadArtistAlbums(artistUri, artistName);
  }

  goBackInSearch() {
    if (this.host._dismissMenuAfterPlaylistAdd) {
      this.host._closeEntityOptions();
      this.host._dismissMenuAfterPlaylistAdd = false;
      return;
    }

    if (this.host._searchHierarchy.length === 0) return;

    this.host._searchResults = [];
    this.host._searchLoading = true;
    this.host.requestUpdate();

    const previousLevel = this.host._searchHierarchy.pop();
    if (
      previousLevel.type === "select_playlist" ||
      previousLevel.type === "select_track_for_playlist"
    ) {
      this.host._addToPlaylistTarget = null;
    }

    this.host._searchQuery = previousLevel.query;
    this.host._currentSearchQuery = previousLevel.query;
    this.host._searchResultsByType = {};
    this.host._searchMediaClassFilter = previousLevel.filter || "all";

    if (this.host._searchHierarchy.length === 0) {
      if (this.host._openedSearchFromNowPlaying) {
        this.host._openedSearchFromNowPlaying = false;
        this.host._closeEntityOptions();
        return;
      }
      this.host._searchBreadcrumb = "";
      this.doSearch(
        this.host._searchMediaClassFilter === "all" ? null : this.host._searchMediaClassFilter
      );
    } else {
      const currentLevel = this.host._searchHierarchy[this.host._searchHierarchy.length - 1];
      if (currentLevel.type === "artist") {
        this.host._searchBreadcrumb = `Albums by ${currentLevel.name}`;
        this.host._searchMediaClassFilter = "album";
        if (currentLevel.uri && this.host?._isMusicAssistantEntity?.()) {
          this.host._searchQuery = "";
          this.host._currentSearchQuery = "";
          this.host._searchResults = [];
          this.host._searchLoading = true;
          this.host.requestUpdate();
          this.loadArtistAlbums(currentLevel.uri, currentLevel.name).then(() => {
            this.scrollToTop();
          });
          return;
        }
        this.doSearch("album", { artist: currentLevel.name });
      } else if (currentLevel.type === "album") {
        this.host._searchBreadcrumb = `Tracks from ${currentLevel.name}`;
        this.host._searchMediaClassFilter = "track";
        const artistLevel = this.host._searchHierarchy.find((level) => level.type === "artist");
        const artistName = artistLevel ? artistLevel.name : null;
        if (currentLevel.uri && this.host?._isMusicAssistantEntity?.()) {
          this.host._searchQuery = "";
          this.host._currentSearchQuery = "";
          this.host._searchResults = [];
          this.host._searchLoading = true;
          this.host.requestUpdate();
          this.loadAlbumTracks(currentLevel.uri, currentLevel.name, artistName).then(() => {
            this.scrollToTop();
          });
          return;
        }
        const searchParams = { album: currentLevel.name };
        if (artistName) {
          searchParams.artist = artistName;
        }
        this.doSearch("track", searchParams);
      } else if (currentLevel.type === "playlist") {
        this.host._searchBreadcrumb = `Tracks from ${currentLevel.name}`;
        this.host._searchMediaClassFilter = "track";
        if (currentLevel.uri && this.host?._isMusicAssistantEntity?.()) {
          this.host._searchQuery = "";
          this.host._currentSearchQuery = "";
          this.host._searchResults = [];
          this.host._searchLoading = true;
          this.host.requestUpdate();
          this.loadPlaylistTracks(currentLevel.uri, currentLevel.name).then(() => {
            this.scrollToTop();
          });
          return;
        }
        this.doSearch("track");
      }
    }
  }

  scrollToTop() {
    const results = this.host?.shadowRoot?.querySelector(".search-sheet-results");
    if (results) results.scrollTop = 0;
    this.updateSearchHeaderPosition(0, true);
    this.host._lastSearchResultsScrollTop = 0;
  }

  getSearchHeaderHeight() {
    const panel = this.host?.shadowRoot?.querySelector(".search-header-panel");
    if (!panel) return this.host?._searchHeaderNaturalHeight || 120;
    const height = panel.offsetHeight;
    if (height > 0) {
      this.host._searchHeaderNaturalHeight = height;
      return height;
    }
    return this.host?._searchHeaderNaturalHeight || 120;
  }

  updateSearchHeaderPosition(offset, animated = false) {
    const headerHeight = this.getSearchHeaderHeight();
    const clampedOffset = Math.max(0, Math.min(headerHeight, offset));
    this.host._searchHeaderOffset = clampedOffset;
    const isRetracted = clampedOffset >= headerHeight && headerHeight > 0;
    this.host._searchHeadersRetracted = isRetracted;

    const panel = this.host?.shadowRoot?.querySelector(".search-header-panel");
    if (!panel) return;

    if (animated) {
      panel.classList.add("smooth-transition");
      clearTimeout(this.host._searchHeaderTransitionTimer);
      this.host._searchHeaderTransitionTimer = setTimeout(() => {
        panel.classList.remove("smooth-transition");
      }, 280);
    } else {
      panel.classList.remove("smooth-transition");
    }

    panel.classList.toggle("retracted", isRetracted);
    panel.style.marginTop = clampedOffset > 0 ? `-${clampedOffset}px` : "0px";

    const progress = headerHeight > 0 ? clampedOffset / headerHeight : 0;
    const opacity = Math.max(0, Math.min(1, 1 - progress));
    panel.style.opacity = clampedOffset > 0 ? opacity.toFixed(3) : "";

    if (isRetracted) {
      panel.style.pointerEvents = "none";
      const input = panel.querySelector("#search-input-box");
      if (input && document.activeElement === input) {
        input.blur();
      }
    } else {
      panel.style.pointerEvents = "";
    }
  }

  getSearchResultsElement() {
    if (
      !this.host?._cachedSearchResultsElement ||
      !this.host._cachedSearchResultsElement.isConnected
    ) {
      this.host._cachedSearchResultsElement = this.host?.shadowRoot?.querySelector(
        ".virtualized-results-wrapper, .queue-results-wrapper, .search-sheet-results, .entity-options-search-results"
      );
    }
    return this.host?._cachedSearchResultsElement;
  }

  applySearchHeaderDelta(delta) {
    if (this.host?.config?.pin_search_headers === true) return;
    const headerHeight = this.getSearchHeaderHeight();
    if (headerHeight <= 0) return;

    const currentOffset = this.host?._searchHeaderOffset || 0;
    const newOffset = Math.max(0, Math.min(headerHeight, currentOffset + delta));
    if (newOffset !== currentOffset) {
      this.updateSearchHeaderPosition(newOffset, false);
    }
  }

  setSearchHeadersRetracted(retracted, animated = true) {
    const headerHeight = this.getSearchHeaderHeight();
    const targetOffset = retracted ? headerHeight : 0;
    this.updateSearchHeaderPosition(targetOffset, animated);
  }

  handleSearchResultsScroll(e, pinSearchHeaders) {
    if (
      pinSearchHeaders ||
      this.host?.config?.pin_search_headers === true ||
      this.host?._isDragging
    )
      return;
    const el = e.currentTarget || e.target;
    if (!el) return;

    const currentScrollTop = el.scrollTop;
    const lastScrollTop = this.host._lastSearchResultsScrollTop ?? currentScrollTop;
    const delta = currentScrollTop - lastScrollTop;
    this.host._lastSearchResultsScrollTop = currentScrollTop;

    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    if (maxScroll <= 0) {
      if ((this.host._searchHeaderOffset || 0) !== 0) {
        this.updateSearchHeaderPosition(0, false);
      }
      return;
    }

    if (currentScrollTop <= 0) {
      this.updateSearchHeaderPosition(0, false);
      return;
    }

    if (currentScrollTop >= maxScroll - 6) {
      return;
    }

    if (delta === 0) return;

    if (this.host?._applySearchHeaderDelta) {
      this.host._applySearchHeaderDelta(delta);
    } else {
      this.applySearchHeaderDelta(delta);
    }
  }

  handleFilterChipsWheel(e) {
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY) && e.deltaX !== 0) {
      e.stopPropagation();
    }
  }

  handleHeaderWheel(e, pinSearchHeaders) {
    const chipRow =
      e.target?.closest?.(".search-filter-chips") ||
      e.composedPath?.().find?.((el) => el?.classList?.contains?.("search-filter-chips"));

    if (chipRow && Math.abs(e.deltaX) >= Math.abs(e.deltaY) && e.deltaX !== 0) {
      e.stopPropagation();
      return;
    }

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      return;
    }

    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (pinSearchHeaders || this.host?.config?.pin_search_headers === true) {
      const results = this.host?._getSearchResultsElement
        ? this.host._getSearchResultsElement()
        : this.getSearchResultsElement();
      if (results) {
        results.scrollTop += e.deltaY;
      }
      return;
    }
    if (this.host?._applySearchHeaderDelta) {
      this.host._applySearchHeaderDelta(e.deltaY);
    } else {
      this.applySearchHeaderDelta(e.deltaY);
    }
  }

  handleHeaderTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      this.host._headerTouchStartY = e.touches[0].clientY;
      this.host._headerTouchStartX = e.touches[0].clientX;
    }
  }

  handleHeaderTouchMove(e, pinSearchHeaders) {
    if (
      pinSearchHeaders ||
      this.host?.config?.pin_search_headers === true ||
      this.host?._headerTouchStartY == null
    )
      return;
    if (!e.touches || e.touches.length !== 1) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - this.host._headerTouchStartY;
    const deltaX = currentX - this.host._headerTouchStartX;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (e.cancelable) e.preventDefault();
      if (this.host?._applySearchHeaderDelta) {
        this.host._applySearchHeaderDelta(-deltaY);
      } else {
        this.applySearchHeaderDelta(-deltaY);
      }
      this.host._headerTouchStartY = currentY;
      this.host._headerTouchStartX = currentX;
    }
  }

  handleHeaderTouchEnd() {
    if (this.host) {
      this.host._headerTouchStartY = null;
      this.host._headerTouchStartX = null;
    }
  }

  handleSearchContainerWheel(e, pinSearchHeaders) {
    if (pinSearchHeaders || this.host?.config?.pin_search_headers === true) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const headerHeight = this.getSearchHeaderHeight();
    const currentOffset = this.host?._searchHeaderOffset || 0;
    if (e.deltaY < 0) {
      const results = this.host?._getSearchResultsElement
        ? this.host._getSearchResultsElement()
        : this.getSearchResultsElement();
      if (!results || results.scrollTop <= 5) {
        if (e.cancelable) e.preventDefault();
        if (this.host?._applySearchHeaderDelta) {
          this.host._applySearchHeaderDelta(e.deltaY);
        } else {
          this.applySearchHeaderDelta(e.deltaY);
        }
      }
    } else if (e.deltaY > 0 && currentOffset < headerHeight) {
      if (e.cancelable) e.preventDefault();
      if (this.host?._applySearchHeaderDelta) {
        this.host._applySearchHeaderDelta(e.deltaY);
      } else {
        this.applySearchHeaderDelta(e.deltaY);
      }
    }
  }

  handleSearchResultsWheel(e, pinSearchHeaders) {
    if (pinSearchHeaders || this.host?.config?.pin_search_headers === true) return;
    const el = e.currentTarget || e.target;
    const scrollTop = el ? el.scrollTop : 0;
    if (e.deltaY < 0 && scrollTop <= 5) {
      if ((this.host?._searchHeaderOffset || 0) > 0 && e.cancelable) {
        e.preventDefault();
      }
      if (this.host?._applySearchHeaderDelta) {
        this.host._applySearchHeaderDelta(e.deltaY);
      } else {
        this.applySearchHeaderDelta(e.deltaY);
      }
    }
  }

  handleResultsTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      this.host._resultsTouchStartY = e.touches[0].clientY;
      this.host._resultsTouchStartX = e.touches[0].clientX;
    }
  }

  handleResultsTouchMove(e, pinSearchHeaders) {
    if (
      pinSearchHeaders ||
      this.host?.config?.pin_search_headers === true ||
      this.host?._resultsTouchStartY == null
    )
      return;
    if (!e.touches || e.touches.length !== 1) return;
    const el = e.currentTarget;
    const scrollTop = el ? el.scrollTop : 0;
    const deltaY = e.touches[0].clientY - this.host._resultsTouchStartY;
    const deltaX = e.touches[0].clientX - this.host._resultsTouchStartX;

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0 && scrollTop <= 5) {
      if ((this.host?._searchHeaderOffset || 0) > 0 && e.cancelable) {
        e.preventDefault();
      }
      if (this.host?._applySearchHeaderDelta) {
        this.host._applySearchHeaderDelta(-deltaY);
      } else {
        this.applySearchHeaderDelta(-deltaY);
      }
      this.host._resultsTouchStartY = e.touches[0].clientY;
      this.host._resultsTouchStartX = e.touches[0].clientX;
    }
  }

  handleResultsTouchEnd() {
    if (this.host) {
      this.host._resultsTouchStartY = null;
      this.host._resultsTouchStartX = null;
    }
  }

  isClickableSearchResult(item) {
    if (!item) return false;
    if (this.host?._addToPlaylistTarget) return true;
    const currentHierarchyLevel =
      this.host?._searchHierarchy?.[this.host._searchHierarchy.length - 1];
    if (currentHierarchyLevel?.type === "select_track_for_playlist") return true;

    return !!item.is_browsable;
  }

  getSearchResultClickTitle(item) {
    if (!this.isClickableSearchResult(item)) return "";

    if (this.host?._addToPlaylistTarget && item.media_class === "playlist") {
      return localize("search.add_to_playlist");
    }

    const currentHierarchy = this.host?._searchHierarchy?.[this.host._searchHierarchy.length - 1];
    if (
      currentHierarchy?.type === "select_track_for_playlist" &&
      (item.media_class === "track" || item.media_content_type === "track")
    ) {
      const mockItem = this.getMockItemFromCurrentTrack();
      return localize("search.select_track_for_playlist", {
        "{track}": mockItem?.title || "",
        "{artist}": mockItem?.media_artist || "",
      });
    }

    return getSearchResultClickTitle(item);
  }

  invalidateUpcomingCache() {
    if (this.host?._upcomingFilterActive) {
      // In strictly optimistic mode, local UI is already updated.
    } else {
      const classFilter = this.host?._searchMediaClassFilter || "all";
      const cacheKey = `${classFilter}_upcoming_sort_default`;
      if (this.host?._searchResultsByType) {
        delete this.host._searchResultsByType[cacheKey];
      }
      this.host?.requestUpdate?.();
    }
  }

  toggleRadioMode() {
    this.host._radioModeActive = !this.host._radioModeActive;
    this.host.requestUpdate();
  }

  async toggleFavoritesFilter() {
    const wasActive = this.host._favoritesFilterActive || this.host._initialFavoritesLoaded;
    this.host._favoritesFilterActive = !wasActive;

    if (this.host._favoritesFilterActive) {
      this.host._recentlyPlayedFilterActive = false;
      this.host._upcomingFilterActive = false;
      this.host._recommendationsFilterActive = false;
    }

    if (this.host._favoritesFilterActive) {
      const currentMediaType = this.host._searchMediaClassFilter;
      try {
        await this.doSearch(currentMediaType, { favorites: true });
      } catch (error) {
        console.error("yamp: Error searching favorites:", error);
      }
    } else {
      const currentMediaType = this.host._searchMediaClassFilter;
      this.host._lastSearchUsedServerFavorites = false;
      this.host._initialFavoritesLoaded = false;
      await this.doSearch(currentMediaType, { clearFilters: true });
    }
  }

  /**
   * Toggles or sets the recently played filter state.
   * @param {boolean | null} [forceState]
   * @returns {Promise<void>}
   */
  async toggleRecentlyPlayedFilter(forceState = null) {
    const targetState =
      typeof forceState === "boolean" ? forceState : !this.host._recentlyPlayedFilterActive;
    this.host._recentlyPlayedFilterActive = targetState;

    if (this.host._recentlyPlayedFilterActive) {
      this.host._favoritesFilterActive = false;
      this.host._upcomingFilterActive = false;
      this.host._recommendationsFilterActive = false;
      this.host._initialFavoritesLoaded = false;
    }

    if (this.host._recentlyPlayedFilterActive) {
      this.host._searchQuery = "";
      try {
        const currentMediaType = this.host._searchMediaClassFilter || "all";
        const targetFilter =
          this.host._keepFiltersOnSearch && currentMediaType !== "favorites"
            ? currentMediaType
            : "all";
        await this.doSearch(targetFilter, { isRecentlyPlayed: true, clearFilters: true });
      } catch (error) {
        console.error("yamp: Error in _doSearch for recently played:", error);
      }
    } else {
      if (this.host._searchQuery && this.host._searchQuery.trim() !== "") {
        const currentMediaType = this.host._searchMediaClassFilter;
        await this.doSearch(currentMediaType);
      } else {
        const currentMediaType = this.host._searchMediaClassFilter || "all";
        if (this.restoreSearchResultsFromCache(currentMediaType)) {
          // Restored from cache
        } else if (this.host._keepFiltersOnSearch && currentMediaType !== "all") {
          await this.doSearch(currentMediaType);
        } else {
          await this.doSearch("favorites");
        }
      }
    }
  }

  /**
   * Toggles or sets the upcoming queue filter state.
   * @param {boolean | null} [forceState]
   * @returns {Promise<void>}
   */
  async toggleUpcomingFilter(forceState = null) {
    if (!this.host?.hass) return;

    if (forceState !== null) {
      this.host._upcomingFilterActive = forceState;
    } else {
      this.host._upcomingFilterActive = !this.host._upcomingFilterActive;
    }

    if (this.host._upcomingFilterActive) {
      this.host._favoritesFilterActive = false;
      this.host._recentlyPlayedFilterActive = false;
      this.host._recommendationsFilterActive = false;
      this.host._initialFavoritesLoaded = false;
    }

    if (this.host._upcomingFilterActive) {
      this.host._searchQuery = "";
      const cacheKey = `${this.host._searchMediaClassFilter || "all"}_upcoming_sort_default`;
      delete this.host._searchResultsByType[cacheKey];
      await this.host._subscribeToQueueUpdates?.();
      try {
        const currentMediaType = this.host._searchMediaClassFilter || "all";
        const targetFilter =
          this.host._keepFiltersOnSearch && currentMediaType !== "favorites"
            ? currentMediaType
            : "all";
        await this.doSearch(targetFilter, { isUpcoming: true, clearFilters: true });
      } catch (error) {
        console.error("yamp: Error in _doSearch for upcoming queue:", error);
      }
    } else {
      this.host._unsubscribeFromQueueUpdates?.();
      if (this.host._searchQuery && this.host._searchQuery.trim() !== "") {
        const currentMediaType = this.host._searchMediaClassFilter;
        await this.doSearch(currentMediaType);
      } else {
        const currentMediaType = this.host._searchMediaClassFilter || "all";
        if (this.restoreSearchResultsFromCache(currentMediaType)) {
          // Restored from cache
        } else if (this.host._keepFiltersOnSearch && currentMediaType !== "all") {
          await this.doSearch(currentMediaType);
        } else {
          await this.doSearch("favorites");
        }
      }
    }
  }

  /**
   * Toggles or sets the recommendations filter state.
   * @param {boolean | null} [forceState]
   * @returns {Promise<void>}
   */
  async toggleRecommendationsFilter(forceState = null) {
    const targetState =
      typeof forceState === "boolean" ? forceState : !this.host._recommendationsFilterActive;
    this.host._recommendationsFilterActive = targetState;

    if (this.host._recommendationsFilterActive) {
      this.host._favoritesFilterActive = false;
      this.host._recentlyPlayedFilterActive = false;
      this.host._upcomingFilterActive = false;
      this.host._initialFavoritesLoaded = false;
      this.host._searchQuery = "";

      try {
        const hasMassQueue = await this.host._isMassQueueIntegrationAvailable(this.host.hass);
        this.host._hasMassQueueIntegration = hasMassQueue;
        this.host._massQueueAvailable = hasMassQueue;

        if (!hasMassQueue) {
          this.host._recommendationsFilterActive = false;
          this.host._searchError = "Recommendations require the Music Assistant queue integration.";
          this.host.requestUpdate();
          return;
        }

        const targetFilter =
          this.host._keepFiltersOnSearch &&
          this.host._searchMediaClassFilter &&
          this.host._searchMediaClassFilter !== "favorites"
            ? this.host._searchMediaClassFilter
            : "all";

        await this.doSearch(targetFilter, { isRecommendations: true, clearFilters: true });
      } catch (error) {
        console.error("yamp: Error in _doSearch for recommendations:", error);
        this.host._searchError = "Unable to load recommendations.";
        this.host._recommendationsFilterActive = false;
        this.host.requestUpdate();
      }
    } else {
      if (this.host._searchQuery && this.host._searchQuery.trim() !== "") {
        const currentMediaType = this.host._searchMediaClassFilter;
        await this.doSearch(currentMediaType);
      } else {
        const currentMediaType = this.host._searchMediaClassFilter || "all";
        if (this.restoreSearchResultsFromCache(currentMediaType)) {
          // Restored from cache
        } else if (this.host._keepFiltersOnSearch && currentMediaType !== "all") {
          await this.doSearch(currentMediaType);
        } else {
          await this.doSearch("favorites");
        }
      }
    }
  }

  restoreSearchResultsFromCache(currentMediaType) {
    const sortMode = this.getActiveSearchDisplaySortMode();
    const cacheKey = `${currentMediaType}_sort_${sortMode}`;
    if (
      this.host._searchResultsByType[cacheKey] ||
      this.host._searchResultsByType[currentMediaType]
    ) {
      this.host._searchResults = this.sortSearchResults(
        this.host._searchResultsByType[cacheKey] || this.host._searchResultsByType[currentMediaType]
      );
      this.resolveInsecureResultThumbnails(this.host._searchResults);
      this.host.requestUpdate();
      return true;
    }
    return false;
  }

  async checkAiRadioAvailability() {
    if (!this.host?.hass) return;
    try {
      const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
      const searchEntityId = await this.host._resolveTemplateAtActionTime(
        searchEntityIdTemplate,
        this.host.currentEntityId
      );
      const available = await isAiRadioAvailable(this.host.hass, searchEntityId);
      if (this.host._aiRadioShowsAvailable !== available) {
        this.host._aiRadioShowsAvailable = available;
        this.host.requestUpdate();
      }
    } catch {
      this.host._aiRadioShowsAvailable = false;
    }
  }

  async applyLocalFavoritesFilter(results = []) {
    if (!this.host._favoritesFilterActive) return results;

    const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
    const searchEntityId = await this.host._resolveTemplateAtActionTime(
      searchEntityIdTemplate,
      this.host.currentEntityId
    );

    try {
      const favoritesResponse = await getFavorites(
        this.host.hass,
        searchEntityId,
        this.host._searchMediaClassFilter,
        this.getSearchResultsLimit()
      );
      const favorites = favoritesResponse.results || [];
      const favoriteUris = new Set(favorites.map((fav) => fav.media_content_id));
      return results.filter((item) => favoriteUris.has(item.media_content_id));
    } catch (_error) {
      return results;
    }
  }

  async handleSearchResultClick(item, event) {
    if (this.host?._isDragging) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      return;
    }
    if (!this.isClickableSearchResult(item)) return;

    const currentHierarchyLevel = this.host._searchHierarchy[this.host._searchHierarchy.length - 1];
    if (
      currentHierarchyLevel?.type === "select_track_for_playlist" &&
      (item.media_class === "track" || item.media_content_type === "track")
    ) {
      this.performSearchOptionAction(item, "add_to_playlist");
      return;
    }

    if (this.host._addToPlaylistTarget && item.media_class === "playlist") {
      this.host._loadingSearchRowMenuId = item.media_content_id;
      this.host.requestUpdate();

      try {
        const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
        const searchEntityId = await this.host._resolveTemplateAtActionTime(
          searchEntityIdTemplate,
          this.host.currentEntityId
        );
        const mqConfigEntryId = await getMassQueueConfigEntryId(this.host.hass, searchEntityId);
        if (mqConfigEntryId) {
          const playlistId = item.item_id || item.media_content_id?.split("/").pop();
          const servicePayload = {
            command: "music/playlists/add_playlist_tracks",
            data: {
              db_playlist_id: playlistId,
              uris: [this.host._addToPlaylistTarget.media_content_id],
            },
          };
          if (mqConfigEntryId && mqConfigEntryId !== "auto") {
            servicePayload.config_entry_id = mqConfigEntryId;
          }
          await this.host.hass.callService("mass_queue", "send_command", servicePayload);
          this.showSearchSuccessToast(item.media_content_id, "playlist");
        }
      } catch (e) {
        console.error("Failed to add to playlist:", e);
        this.host._errorSearchRowMenuId = item.media_content_id;
        this.host.requestUpdate();
        setTimeout(() => {
          this.host._errorSearchRowMenuId = null;
          this.host.requestUpdate();
        }, 3000);
      } finally {
        this.host._loadingSearchRowMenuId = null;
        this.host.requestUpdate();
      }
      this.host._addToPlaylistTarget = null;
      setTimeout(() => {
        if (this.host._dismissMenuAfterPlaylistAdd) {
          this.host._closeEntityOptions();
          this.host._dismissMenuAfterPlaylistAdd = false;
        } else {
          this.goBackInSearch();
        }
      }, SUCCESS_MESSAGE_TIMEOUT_MS);
      return;
    }

    if (item.media_class === "artist") {
      await this.searchArtistAlbums(item.title, item.media_content_id);
    } else if (item.media_class === "album") {
      let artistName = null;
      if (
        this.host._searchHierarchy.length > 0 &&
        this.host._searchHierarchy[this.host._searchHierarchy.length - 1].type === "artist"
      ) {
        artistName = this.host._searchHierarchy[this.host._searchHierarchy.length - 1].name;
      } else if (item.artist) {
        artistName = item.artist;
      }
      await this.searchAlbumTracks(item.title, artistName, item.media_content_id);
    } else if (item.media_class === "track") {
      if (item.album) {
        await this.searchAlbumTracks(item.album, item.artist, item.album_uri);
      }
    } else if (item.media_class === "playlist") {
      let playlistUri = item.media_content_id || item.uri || null;
      if (!playlistUri && this.host?._isMusicAssistantEntity?.()) {
        try {
          const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
          const searchEntityId = await this.host._resolveTemplateAtActionTime(
            searchEntityIdTemplate,
            this.host.currentEntityId
          );
          playlistUri = await this.resolvePlaylistUri(item.title, searchEntityId);
        } catch (e) {
          console.warn("yamp: error resolving playlist URI:", e);
        }
      }
      await this.searchPlaylistTracks(item.title, playlistUri);
    }
  }

  /**
   * Fetches album tracks via mass_queue or browse_media.
   * @param {string | null} albumUri
   * @param {string} albumName
   * @param {string | null} [artistName]
   * @returns {Promise<void>}
   */
  async loadAlbumTracks(albumUri, albumName, artistName = null) {
    if (albumUri && (await this.host._isMassQueueIntegrationAvailable?.(this.host.hass))) {
      const mqTracks = await this.host._fetchMassQueueTracks?.(albumUri, "get_album_tracks");
      if (mqTracks && mqTracks.length > 0) {
        this.host._setSearchResultsFromMassQueue?.(mqTracks, "");
        return;
      }
    }

    if (albumUri && this.host?._isMusicAssistantEntity?.()) {
      try {
        const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
        const searchEntityId = await this.host._resolveTemplateAtActionTime(
          searchEntityIdTemplate,
          this.host.currentEntityId
        );

        const browseMsg = {
          type: "call_service",
          domain: "media_player",
          service: "browse_media",
          service_data: {
            entity_id: searchEntityId,
            media_content_id: albumUri,
            media_content_type: "album",
          },
          return_response: true,
        };

        const browseRes = await this.host.hass.connection.sendMessagePromise(browseMsg);
        const browseResult =
          browseRes?.response?.[searchEntityId]?.result || browseRes?.result || {};
        const tracks = (browseResult.children || []).map((c) =>
          normalizeBrowseMediaChild(c, { fallbackArtist: artistName, fallbackAlbum: albumName })
        );

        if (tracks.length > 0) {
          this.host._searchQuery = "";
          this.host._searchResults = this.sortSearchResults(tracks);
          this.resolveInsecureResultThumbnails(this.host._searchResults);
          this.host._searchTotalRows = Math.max(15, tracks.length);
          this.host._searchAttempted = true;
          this.host._searchLoading = false;
          this.host.requestUpdate();
          return;
        }
      } catch (e) {
        console.error("yamp: Failed to browse album tracks:", e);
      }
    }

    this.host._searchQuery = "";
    this.host._favoritesFilterActive = false;
    this.host._recentlyPlayedFilterActive = false;
    this.host._initialFavoritesLoaded = false;

    const searchParams = { album: albumName, clearFilters: true };
    if (artistName) {
      searchParams.artist = artistName;
    }
    await this.doSearch("track", searchParams);
  }

  /**
   * Pushes album to search hierarchy and loads tracks.
   * @param {string} albumName
   * @param {string | null} [artistName]
   * @param {string | null} [albumUri]
   * @returns {Promise<void>}
   */
  async searchAlbumTracks(albumName, artistName, albumUri = null) {
    this.host._searchHierarchy.push({
      type: "album",
      name: albumName,
      query: this.host._searchQuery,
      uri: albumUri,
      filter: this.host._searchMediaClassFilter,
    });
    this.host._searchBreadcrumb = `Tracks from ${albumName}`;
    this.host._searchResultsByType = {};
    this.host._currentSearchQuery = "";
    this.host._searchMediaClassFilter = "track";

    this.host._searchResults = [];
    this.host._searchLoading = true;
    this.host._searchQuery = "";
    this.host.requestUpdate();

    this.removeSearchSwipeHandlers();
    await this.loadAlbumTracks(albumUri, albumName, artistName);
  }

  /**
   * Loads tracks for a playlist via mass_queue or browse_media.
   * @param {string | null} playlistUri
   * @param {string} playlistName
   * @returns {Promise<boolean>}
   */
  async loadPlaylistTracks(playlistUri, playlistName) {
    if (playlistUri && (await this.host._isMassQueueIntegrationAvailable?.(this.host.hass))) {
      const mqTracks = await this.host._fetchMassQueueTracks?.(playlistUri, "get_playlist_tracks");
      if (mqTracks && mqTracks.length > 0) {
        this.host._setSearchResultsFromMassQueue?.(mqTracks, "");
        return true;
      }
    }

    if (playlistUri && this.host?._isMusicAssistantEntity?.()) {
      try {
        const searchEntityIdTemplate = this.host._getSearchEntityId(this.host._selectedIndex);
        const searchEntityId = await this.host._resolveTemplateAtActionTime(
          searchEntityIdTemplate,
          this.host.currentEntityId
        );

        const browseMsg = {
          type: "call_service",
          domain: "media_player",
          service: "browse_media",
          service_data: {
            entity_id: searchEntityId,
            media_content_id: playlistUri,
            media_content_type: "playlist",
          },
          return_response: true,
        };

        const browseRes = await this.host.hass.connection.sendMessagePromise(browseMsg);
        const browseResult =
          browseRes?.response?.[searchEntityId]?.result || browseRes?.result || {};
        const tracks = (browseResult.children || []).map((c) => normalizeBrowseMediaChild(c));

        if (tracks.length > 0) {
          this.host._searchQuery = "";
          this.host._searchResults = this.sortSearchResults(tracks);
          this.resolveInsecureResultThumbnails(this.host._searchResults);
          this.host._searchTotalRows = Math.max(15, tracks.length);
          this.host._searchAttempted = true;
          this.host._searchLoading = false;
          this.host.requestUpdate();
          return true;
        }
      } catch (e) {
        console.error("yamp: Failed to browse playlist tracks:", e);
      }
    }

    this.host._searchQuery = "";
    this.host._searchResults = [];
    this.host._searchAttempted = true;
    this.host._searchLoading = false;
    this.host.requestUpdate();
    return false;
  }

  /**
   * Pushes playlist to search hierarchy and loads tracks.
   * @param {string} playlistName
   * @param {string | null} playlistUri
   * @returns {Promise<void>}
   */
  async searchPlaylistTracks(playlistName, playlistUri) {
    this.host._searchHierarchy.push({
      type: "playlist",
      name: playlistName,
      query: this.host._searchQuery,
      uri: playlistUri,
      filter: this.host._searchMediaClassFilter,
    });
    this.host._searchBreadcrumb = `Tracks from ${playlistName}`;
    this.host._searchResultsByType = {};
    this.host._currentSearchQuery = "";
    this.host._searchMediaClassFilter = "track";

    this.host._searchResults = [];
    this.host._searchLoading = true;
    this.host._searchQuery = "";
    this.host.requestUpdate();

    this.removeSearchSwipeHandlers();
    await this.loadPlaylistTracks(playlistUri, playlistName);
  }

  resetSearchContext() {
    this.host._searchResultsByType = {};
    this.host._favoritesFilterActive = false;
    this.host._recentlyPlayedFilterActive = false;
    this.host._upcomingFilterActive = false;
    this.host._recommendationsFilterActive = false;
    this.host._initialFavoritesLoaded = false;
    this.host._loadingSearchRowMenuId = null;
    this.host._errorSearchRowMenuId = null;
  }

  /**
   * Shows success toast feedback for queue or playlist actions.
   * @param {string | null} [menuId]
   * @param {string | null} [type]
   * @returns {void}
   */
  showSearchSuccessToast(menuId = null, type = null) {
    this.host._showQueueSuccessMessage = true;
    if (menuId) this.host._successSearchRowMenuId = menuId;
    if (type) this.host._successSearchRowType = type;
    this.host.requestUpdate();

    if (this.host._successToastHandle) {
      clearTimeout(this.host._successToastHandle);
    }

    this.host._successToastHandle = setTimeout(() => {
      this.host._showQueueSuccessMessage = false;
      this.host._successSearchRowMenuId = null;
      this.host._successSearchRowType = null;
      this.host._successToastHandle = null;
      this.host.requestUpdate();
    }, SUCCESS_MESSAGE_TIMEOUT_MS);
  }
}
