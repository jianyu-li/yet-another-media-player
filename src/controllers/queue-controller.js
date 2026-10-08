/**
 * Reactive Lit controller managing Music Assistant queue operations,
 * queue fetching, reordering, virtualized list state, and queue transfer for Yet Another Media Player (YAMP).
 *
 * Implements the Lit ReactiveController interface to cleanly manage queue updates,
 * background subscriptions, sequential operation locks, and transfer queue dialog state.
 */

import { isMusicAssistantEntity, getEntityName } from "../yamp-utils.js";
import { playMedia } from "../services/ha-media-services.js";
import { getMassQueueConfigEntryId } from "../search-sheet.js";
import { localize } from "../localize/localize.js";

/**
 * @typedef {import("../types.d.ts").HassEntity} HassEntity
 * @typedef {import("../types.d.ts").HomeAssistant} HomeAssistant
 * @typedef {import("../types.d.ts").YetAnotherMediaPlayerCard} YetAnotherMediaPlayerCard
 */

/**
 * Checks whether the mass_queue domain exists in Home Assistant services.
 * @param {any} services
 * @returns {boolean}
 */
export function checkMassQueueServices(services) {
  if (!services) return false;
  if (Array.isArray(services)) {
    return services.some((service) => service.domain === "mass_queue");
  } else if (typeof services === "object") {
    return (
      Object.prototype.hasOwnProperty.call(services, "mass_queue") ||
      Object.keys(services).some((key) => key === "mass_queue")
    );
  }
  return false;
}

/**
 * Calculates optimal queue move plan between oldIndex and newIndex.
 * Strategy A: sequential move_queue_item_up or move_queue_item_down.
 * Strategy B: move_queue_item_next to position 0, then move_queue_item_down to destination.
 * @param {number} oldIndex
 * @param {number} newIndex
 * @returns {{ strategy: string, steps: Array<{ service: string }> }}
 */
export function calculateQueueMovePlan(oldIndex, newIndex) {
  if (oldIndex === newIndex) {
    return { strategy: "none", steps: [] };
  }
  const costDirect = Math.abs(newIndex - oldIndex);
  const costViaNext = 1 + newIndex;

  if (costViaNext < costDirect) {
    const steps = [{ service: "move_queue_item_next" }];
    for (let i = 0; i < newIndex; i++) {
      steps.push({ service: "move_queue_item_down" });
    }
    return { strategy: "next", steps };
  } else {
    const serviceName = newIndex < oldIndex ? "move_queue_item_up" : "move_queue_item_down";
    const steps = [];
    for (let i = 0; i < costDirect; i++) {
      steps.push({ service: serviceName });
    }
    return { strategy: "direct", steps };
  }
}

/**
 * Transforms raw mass_queue items into standardized YAMP track objects,
 * identifying the active track and slicing upcoming items.
 * @param {any[]} queueItems
 * @param {string|null} [currentTrackId]
 * @param {number} [limitAfter]
 * @returns {any[]}
 */
export function transformMassQueueItems(queueItems, currentTrackId = null, limitAfter = 250) {
  if (!Array.isArray(queueItems)) {
    return [];
  }

  // Find active item index
  let currentTrackIndex = queueItems.findIndex(
    (item) => item.active === true || item.state === "playing"
  );

  // Fallback to Home Assistant's media_content_id (slower sync but reliable)
  if (currentTrackIndex === -1 && currentTrackId) {
    currentTrackIndex = queueItems.findIndex(
      (item) => item.media_content_id === currentTrackId || item.queue_item_id === currentTrackId
    );
  }

  // Default to 0 if all else fails
  if (currentTrackIndex === -1 && queueItems.length > 0) {
    currentTrackIndex = 0;
  }

  // Get upcoming items (items after the current track)
  const upcomingItems =
    currentTrackIndex >= 0 ? queueItems.slice(currentTrackIndex + 1) : queueItems;

  const itemsToRender = limitAfter > 0 ? upcomingItems.slice(0, limitAfter) : upcomingItems;
  return itemsToRender.map((item, index) => ({
    media_content_id: item.media_content_id || item.queue_item_id || `queue_${index}`,
    media_content_type: "track",
    media_class: "track",
    title: item.media_title || item.name || "Unknown Track",
    artist: item.media_artist || item.artist || "Unknown Artist",
    album: item.media_album_name || item.album || "Unknown Album",
    thumbnail: item.media_image || item.image || null,
    duration: item.duration || null,
    position: index + 1,
    queue_item_id: item.queue_item_id || null,
  }));
}

/**
 * Transforms single next_item from music_assistant.get_queue into standardized YAMP track object.
 * @param {any} queueData
 * @returns {any[]}
 */
export function transformQueueNextItem(queueData) {
  if (!queueData?.next_item) {
    return [];
  }
  const item = queueData.next_item;
  return [
    {
      media_content_id: item.media_item?.uri || "queue_next",
      media_content_type: item.media_item?.media_type || "track",
      media_class: "track",
      title: item.name || item.media_item?.name || "Unknown Track",
      artist: item.media_item?.artists?.[0]?.name || "Unknown Artist",
      album: item.media_item?.album?.name || "Unknown Album",
      thumbnail: item.media_item?.image || null,
      duration: item.duration || null,
      position: 1,
      queue_item_id: item.queue_item_id || null,
    },
  ];
}

/**
 * Normalizes recommendations response payload into standardized YAMP search/recommendation items.
 * @param {any} payload
 * @param {string} [entityId]
 * @param {string|null} [mediaType]
 * @param {number} [maxItems]
 * @returns {any[]}
 */
export function normalizeRecommendations(
  payload,
  entityId = "",
  mediaType = null,
  maxItems = Infinity
) {
  let groups = [];
  if (Array.isArray(payload)) {
    groups = payload;
  } else if (payload && typeof payload === "object") {
    if (entityId && Array.isArray(payload[entityId])) {
      groups = payload[entityId];
    } else {
      const values = Object.values(payload);
      values.forEach((val) => {
        if (Array.isArray(val)) {
          groups.push(...val);
        } else if (val && typeof val === "object") {
          groups.push(val);
        }
      });
    }
    if (groups.length === 0 && Array.isArray(payload.items)) {
      groups = payload.items;
    }
  }

  const normalizeMediaClass = (value) => {
    if (!value || typeof value !== "string") return "track";
    const type = value.toLowerCase();
    switch (type) {
      case "song":
      case "music":
        return "track";
      case "podcast_episode":
      case "episode":
        return "podcast";
      case "station":
        return "radio";
      case "directory":
      case "folder":
        return "playlist";
      default:
        return type;
    }
  };

  const formatLabel = (value) => {
    if (!value) return "";
    return value
      .toString()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  };

  const requestedClass = mediaType && mediaType !== "all" ? normalizeMediaClass(mediaType) : null;

  const results = [];
  let collected = 0;
  const limitToUse = maxItems > 0 ? maxItems : Infinity;

  for (const group of groups) {
    if (collected >= limitToUse) break;
    const groupName = group?.name || group?.sort_name || "";
    const groupImage =
      typeof group?.image === "string" && group.image.trim() !== "" ? group.image : null;
    const groupItems =
      Array.isArray(group?.items) && group.items.length > 0 ? group.items : [group];

    for (const item of groupItems) {
      if (collected >= limitToUse) break;
      const mediaContentId = item?.uri || item?.item_id;
      if (!mediaContentId) continue;

      const itemImage =
        typeof item?.image === "string" && item.image.trim() !== "" ? item.image : null;
      const rawType = item?.media_type || group?.media_type || "music";
      const normalizedClass = normalizeMediaClass(rawType);
      if (requestedClass && normalizedClass !== requestedClass) {
        continue;
      }
      const typeLabel = formatLabel(rawType) || formatLabel(normalizedClass);
      const providerLabel = formatLabel(item?.provider || group?.provider);
      const subtitleParts = typeLabel ? [typeLabel] : [];
      if (groupName) {
        subtitleParts.push(groupName);
      } else if (providerLabel) {
        subtitleParts.push(providerLabel);
      }

      results.push({
        media_content_id: mediaContentId,
        media_content_type: rawType || normalizedClass,
        media_class: normalizedClass,
        title: item?.name || item?.sort_name || groupName || "Recommendation",
        artist: subtitleParts.join(" • "),
        thumbnail: itemImage || groupImage || null,
        provider: item?.provider || group?.provider || null,
      });
      collected += 1;
    }
  }

  return results;
}

/**
 * Builds transfer queue service call payload supporting various Home Assistant schema iterations.
 * @param {string} sourceId
 * @param {string} targetId
 * @param {any} [serviceMeta]
 * @returns {Record<string, string>}
 */
export function buildTransferQueuePayload(sourceId, targetId, serviceMeta = null) {
  const fields = serviceMeta?.fields || {};
  /** @type {Record<string, string>} */
  const payload = {};
  const assignField = (/** @type {string[]} */ candidateKeys, /** @type {string} */ value) => {
    for (const key of candidateKeys) {
      if (fields[key] !== undefined) {
        payload[key] = value;
        return true;
      }
    }
    return false;
  };

  const sourceAssigned = assignField(
    ["source_player", "source_player_id", "player_id", "source"],
    sourceId
  );

  const targetAssigned = assignField(
    ["target_player", "target_player_id", "target", "entity_id"],
    targetId
  );

  if (!sourceAssigned) {
    const fallbackKey = targetAssigned ? "source_player" : "entity_id";
    payload[fallbackKey] = sourceId;
  }

  if (!targetAssigned) {
    if (payload.entity_id === sourceId) {
      payload.entity_id = targetId;
      payload.source_player = sourceId;
    } else if (payload.source_player === sourceId) {
      payload.entity_id = targetId;
    } else {
      payload.entity_id = targetId;
    }
  }

  return payload;
}

/**
 * Inspects state attributes to determine if a Music Assistant entity has an active queue.
 * @param {any} maState
 * @param {any[]} [cachedUpcoming]
 * @returns {boolean}
 */
export function hasQueueInState(maState, cachedUpcoming = null) {
  if (!maState) return false;
  const attrs = maState.attributes || {};

  const arrayKeys = ["queue_items", "queue", "media_queue", "mass_queue_items"];
  for (const key of arrayKeys) {
    const value = attrs[key];
    if (Array.isArray(value) && value.length > 0) return true;
  }

  const numericKeys = [
    "queue_length",
    "queue_size",
    "queue_total_items",
    "queue_pending",
    "queue_remaining",
    "items_in_queue",
  ];
  for (const key of numericKeys) {
    const value = attrs[key];
    if (typeof value === "number" && value > 0) return true;
  }

  if (attrs.next_item || attrs.current_queue_item || attrs.queue_item_id) {
    return true;
  }

  if (attrs.media_content_id) {
    return true;
  }

  if (Array.isArray(cachedUpcoming) && cachedUpcoming.length > 0) {
    return true;
  }

  return false;
}

export class QueueController {
  /**
   * @param {YetAnotherMediaPlayerCard} host
   */
  constructor(host) {
    /** @type {YetAnotherMediaPlayerCard} */
    this.host = host;

    if (host && typeof host.addController === "function") {
      host.addController(this);
    }

    /** @type {boolean} */
    this.massQueueAvailable = false;

    /** @type {boolean | null} */
    this.hasMassQueueIntegration = null;

    /** @type {boolean} */
    this.checkingMassQueueIntegration = false;

    /** @type {Promise<void>} */
    this.queueOperationPromise = Promise.resolve();

    /** @type {number} */
    this.queueOpsTotal = 0;

    /** @type {number} */
    this.queueOpsCompleted = 0;

    /** @type {any} */
    this.queueOpsTimeout = null;

    /** @type {any} */
    this.queueRefreshTimer = null;

    /** @type {any} */
    this.queueEventSubscription = null;

    /** @type {boolean} */
    this.showTransferQueue = false;

    /** @type {string | null} */
    this.transferQueuePendingTarget = null;

    /** @type {{ type: string, message: string } | null} */
    this.transferQueueStatus = null;

    /** @type {boolean} */
    this.hasTransferQueueForCurrent = false;

    /** @type {any} */
    this.transferQueueAutoCloseTimer = null;
  }

  /**
   * Lit lifecycle hook: called when the host element connects to the DOM.
   */
  hostConnected() {}

  /**
   * Lit lifecycle hook: called when the host element disconnects from the DOM.
   */
  hostDisconnected() {
    if (this.queueRefreshTimer) {
      clearTimeout(this.queueRefreshTimer);
      this.queueRefreshTimer = null;
    }
    this.unsubscribeFromQueueUpdates();
    if (this.queueOpsTimeout) {
      clearTimeout(this.queueOpsTimeout);
      this.queueOpsTimeout = null;
    }
    if (this.transferQueueAutoCloseTimer) {
      clearTimeout(this.transferQueueAutoCloseTimer);
      this.transferQueueAutoCloseTimer = null;
    }
  }

  /**
   * Checks if the mass_queue integration is available in Home Assistant.
   * @param {HomeAssistant} [hass]
   * @returns {Promise<boolean>}
   */
  async isMassQueueIntegrationAvailable(hass) {
    const currentHass = hass || this.host?.hass;
    if (this.host?.config?.disable_mass_queue === true) {
      return false;
    }
    try {
      const services = await currentHass.callWS({
        type: "get_services",
      });
      return checkMassQueueServices(services);
    } catch (_error) {
      return false;
    }
  }

  /**
   * Retrieves upcoming queue items from Music Assistant.
   * @param {HomeAssistant} [hass]
   * @param {string} [entityId]
   * @param {number} [limit]
   * @returns {Promise<any>}
   */
  async getUpcomingQueue(hass, entityId, limit = 250) {
    const currentHass = hass || this.host?.hass;
    try {
      const hasMassQueue = await this.isMassQueueIntegrationAvailable(currentHass);
      this.massQueueAvailable = hasMassQueue;
      this.hasMassQueueIntegration = hasMassQueue;

      if (hasMassQueue) {
        try {
          const massQueueResult = await this.getUpcomingQueueWithMassQueue(
            currentHass,
            entityId,
            limit
          );

          if (!massQueueResult.results || massQueueResult.results.length === 0) {
            this.massQueueAvailable = false;
            return await this.getUpcomingQueueOriginal(currentHass, entityId, limit);
          }

          return massQueueResult;
        } catch (_error) {
          this.massQueueAvailable = false;
          return await this.getUpcomingQueueOriginal(currentHass, entityId, limit);
        }
      }

      return await this.getUpcomingQueueOriginal(currentHass, entityId, limit);
    } catch (error) {
      console.error("yamp: Error getting upcoming queue:", error);
      this.massQueueAvailable = false;
      return { results: [], usedMusicAssistant: false };
    }
  }

  /**
   * Retrieves queue items via the mass_queue integration.
   * @param {HomeAssistant} [hass]
   * @param {string} [entityId]
   * @param {number} [limit]
   * @returns {Promise<any>}
   */
  async getUpcomingQueueWithMassQueue(hass, entityId, limit = 250) {
    const currentHass = hass || this.host?.hass;
    try {
      const playerState = currentHass?.states?.[entityId];
      const currentTrackId = playerState?.attributes?.media_content_id;

      const limitAfter = Number.isFinite(limit) && limit > 0 ? limit : 250;
      const message = {
        type: "call_service",
        domain: "mass_queue",
        service: "get_queue_items",
        service_data: {
          entity: entityId,
          limit_before: 5,
          limit_after: limitAfter,
          limit: limitAfter + 6,
        },
        return_response: true,
      };

      const response = await currentHass.connection.sendMessagePromise(message);
      const queueItems = response?.response?.[entityId];

      if (!Array.isArray(queueItems)) {
        throw new Error("Invalid response from mass_queue");
      }

      const results = transformMassQueueItems(queueItems, currentTrackId, limitAfter);

      return {
        results,
        usedMusicAssistant: true,
        total: results.length,
        source: "mass_queue",
      };
    } catch (error) {
      console.error("yamp: mass_queue service call failed:", error);
      throw error;
    }
  }

  /**
   * Fallback queue fetcher using standard music_assistant.get_queue.
   * @param {HomeAssistant} [hass]
   * @param {string} [entityId]
   * @param {number} [_limit]
   * @returns {Promise<any>}
   */
  async getUpcomingQueueOriginal(hass, entityId, _limit = 20) {
    const currentHass = hass || this.host?.hass;
    try {
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_queue",
        service_data: {
          entity_id: entityId,
        },
        return_response: true,
      };

      const response = await currentHass.connection.sendMessagePromise(message);
      const queueData = response?.response?.[entityId];

      if (!queueData) {
        return { results: [], usedMusicAssistant: true };
      }

      const results = transformQueueNextItem(queueData);

      return {
        results,
        usedMusicAssistant: true,
        total: results.length,
        source: "music_assistant",
      };
    } catch (error) {
      console.error("yamp: Error in original queue method:", error);
      throw error;
    }
  }

  /**
   * Retrieves music recommendations via mass_queue.get_recommendations.
   * @param {HomeAssistant} [hass]
   * @param {string} [entityId]
   * @param {string|null} [mediaType]
   * @param {number} [limit]
   * @returns {Promise<any>}
   */
  async getRecommendations(hass, entityId, mediaType = null, limit = 20) {
    const currentHass = hass || this.host?.hass;
    try {
      const hasMassQueue = await this.isMassQueueIntegrationAvailable(currentHass);
      this.hasMassQueueIntegration = hasMassQueue;
      this.massQueueAvailable = hasMassQueue;

      if (!hasMassQueue) {
        throw new Error("mass_queue integration unavailable");
      }

      const limitToUse = Math.max(limit || 0, this.host?._getSearchResultsLimit?.() || 0);
      const message = {
        type: "call_service",
        domain: "mass_queue",
        service: "get_recommendations",
        service_data: {
          entity: entityId,
        },
        return_response: true,
      };

      const response = await currentHass.connection.sendMessagePromise(message);
      const payload = response?.response;
      const results = normalizeRecommendations(payload, entityId, mediaType, limitToUse);

      return {
        results,
        usedMusicAssistant: true,
        source: "mass_queue",
      };
    } catch (error) {
      console.error("yamp: Error getting recommendations from mass_queue:", error);
      throw error;
    }
  }

  /**
   * Fetches tracks from mass_queue for playlists or albums.
   * @param {string} uri
   * @param {string} serviceName
   * @returns {Promise<any[]|null>}
   */
  async fetchMassQueueTracks(uri, serviceName) {
    try {
      const currentHass = this.host?.hass;
      const hasMassQueue = await this.isMassQueueIntegrationAvailable(currentHass);
      if (!hasMassQueue) return null;

      const configEntryId = await getMassQueueConfigEntryId(currentHass);
      let tracks = [];

      if (configEntryId && uri) {
        try {
          const message = {
            type: "call_service",
            domain: "mass_queue",
            service: serviceName,
            service_data: {
              ...(configEntryId && configEntryId !== "auto" && { config_entry_id: configEntryId }),
              uri: uri,
            },
            return_response: true,
          };
          const responseData = await currentHass.connection.sendMessagePromise(message);
          if (responseData?.response?.tracks) {
            tracks = responseData.response.tracks;
          }
        } catch (firstError) {
          console.warn(
            `yamp: mass_queue.${serviceName} failed with config_entry_id, trying fallback with entity_id`,
            firstError
          );
          const maState = this.host?._getMusicAssistantState?.();
          const maEntityId = maState?.entity_id;

          if (maEntityId) {
            try {
              const messageFallback = {
                type: "call_service",
                domain: "mass_queue",
                service: serviceName,
                service_data: {
                  entity: maEntityId,
                  uri: uri,
                },
                return_response: true,
              };
              const responseDataFallback =
                await currentHass.connection.sendMessagePromise(messageFallback);
              if (responseDataFallback?.response?.tracks) {
                tracks = responseDataFallback.response.tracks;
              }
            } catch (fallbackError) {
              console.warn(
                `yamp: mass_queue.${serviceName} fallback with entity_id also failed.`,
                fallbackError
              );
              throw firstError;
            }
          } else {
            throw firstError;
          }
        }
      }
      return tracks;
    } catch (e) {
      console.error(`yamp: Error fetching ${serviceName} via mass_queue:`, e);
      return null;
    }
  }

  /**
   * Sets search results from fetched mass_queue tracks.
   * @param {any[]} tracks
   * @param {string} queryName
   */
  setSearchResultsFromMassQueue(tracks, queryName) {
    if (!this.host) return;
    this.host._searchResults = tracks.map((track) => ({
      media_content_id: track.media_content_id,
      media_content_type: "track",
      media_class: "track",
      title: track.media_title,
      artist: track.media_artist,
      album: track.media_album_name,
      thumbnail: track.media_image,
      duration: track.duration,
      is_browsable: false,
      favorite: track.favorite,
    }));
    this.host._searchQuery = queryName;
    this.host._searchTotalRows = Math.max(15, tracks.length);
    this.host._searchAttempted = true;
    this.host._searchLoading = false;
    this.host.triggerRender?.() || this.host.requestUpdate?.();
  }

  /**
   * Enqueues an asynchronous queue reordering or modification operation sequentially.
   * @param {() => Promise<void>} operationFn
   */
  enqueueQueueOperation(operationFn) {
    if (this.queueOpsTotal === this.queueOpsCompleted) {
      this.queueOpsTotal = 0;
      this.queueOpsCompleted = 0;
    }
    this.queueOpsTotal++;
    this.host?.requestUpdate?.();

    if (this.queueOpsTimeout) {
      clearTimeout(this.queueOpsTimeout);
      this.queueOpsTimeout = null;
    }

    this.queueOperationPromise = this.queueOperationPromise.then(async () => {
      try {
        await operationFn();
        this.host?._invalidateUpcomingCache?.();
      } catch (error) {
        console.error("yamp: Queue operation failed:", error);
        this.refreshQueue();
      } finally {
        this.queueOpsCompleted++;
        this.host?.requestUpdate?.();

        if (this.queueOpsCompleted === this.queueOpsTotal) {
          if (this.queueOpsTimeout) clearTimeout(this.queueOpsTimeout);
          this.queueOpsTimeout = setTimeout(() => {
            if (this.queueOpsCompleted === this.queueOpsTotal) {
              this.queueOpsTotal = 0;
              this.queueOpsCompleted = 0;
              this.queueOpsTimeout = null;
              this.host?.requestUpdate?.();
            }
          }, 1500);
        }
      }
    });
  }

  /**
   * Moves a queue item one step upward.
   * @param {string} queueItemId
   */
  async moveQueueItemUp(queueItemId) {
    try {
      const maState = this.host?._getMusicAssistantState?.();
      const maEntityId = maState?.entity_id;
      if (!maEntityId) {
        throw new Error("No Music Assistant entity found");
      }

      this.moveQueueItemInUI(queueItemId, "up");

      this.enqueueQueueOperation(async () => {
        await this.host?.hass?.callService("mass_queue", "move_queue_item_up", {
          entity: maEntityId,
          queue_item_id: queueItemId,
        });
      });
    } catch (_error) {
      this.refreshQueue();
    }
  }

  /**
   * Moves a queue item one step downward.
   * @param {string} queueItemId
   */
  async moveQueueItemDown(queueItemId) {
    try {
      const maState = this.host?._getMusicAssistantState?.();
      const maEntityId = maState?.entity_id;
      if (!maEntityId) {
        throw new Error("No Music Assistant entity found");
      }

      this.moveQueueItemInUI(queueItemId, "down");

      this.enqueueQueueOperation(async () => {
        await this.host?.hass?.callService("mass_queue", "move_queue_item_down", {
          entity: maEntityId,
          queue_item_id: queueItemId,
        });
      });
    } catch (_error) {
      this.refreshQueue();
    }
  }

  /**
   * Moves a queue item to the next position (index 0).
   * @param {string} queueItemId
   */
  async moveQueueItemNext(queueItemId) {
    try {
      const maState = this.host?._getMusicAssistantState?.();
      const maEntityId = maState?.entity_id;
      if (!maEntityId) {
        throw new Error("No Music Assistant entity found");
      }

      this.moveQueueItemInUI(queueItemId, "next");

      this.enqueueQueueOperation(async () => {
        await this.host?.hass?.callService("mass_queue", "move_queue_item_next", {
          entity: maEntityId,
          queue_item_id: queueItemId,
        });
      });
    } catch (_error) {
      this.refreshQueue();
    }
  }

  /**
   * Removes a queue item from the Music Assistant queue.
   * @param {string} queueItemId
   */
  async removeQueueItem(queueItemId) {
    try {
      const maState = this.host?._getMusicAssistantState?.();
      const maEntityId = maState?.entity_id;
      if (!maEntityId) {
        throw new Error("No Music Assistant entity found");
      }

      this.removeQueueItemFromUI(queueItemId);

      this.enqueueQueueOperation(async () => {
        await this.host?.hass?.callService("mass_queue", "remove_queue_item", {
          entity: maEntityId,
          queue_item_id: queueItemId,
        });
      });
    } catch (_error) {
      this.refreshQueue();
    }
  }

  /**
   * Handles reordering after a drag-and-drop movement in the UI.
   * @param {{ detail: { oldIndex: number, newIndex: number } }} e
   */
  async onQueueItemMoved(e) {
    const { oldIndex, newIndex } = e.detail || {};
    if (oldIndex === newIndex) return;

    const currentResults = this.host?._getDisplaySearchResults?.();
    if (
      !currentResults ||
      oldIndex < 0 ||
      oldIndex >= currentResults.length ||
      newIndex < 0 ||
      newIndex >= currentResults.length
    ) {
      return;
    }

    const draggedItem = currentResults[oldIndex];
    const queueItemId = draggedItem?.queue_item_id;
    if (!queueItemId) {
      console.error("yamp: No queue_item_id found on dragged item", draggedItem);
      return;
    }

    try {
      const maState = this.host?._getMusicAssistantState?.();
      const maEntityId = maState?.entity_id;
      if (!maEntityId) {
        throw new Error("No Music Assistant entity found");
      }

      this.moveQueueItemInUIByIndex(oldIndex, newIndex);

      this.enqueueQueueOperation(async () => {
        const plan = calculateQueueMovePlan(oldIndex, newIndex);
        for (const step of plan.steps) {
          await this.host?.hass?.callService("mass_queue", step.service, {
            entity: maEntityId,
            queue_item_id: queueItemId,
          });
        }
      });
    } catch (error) {
      console.error("yamp: Failed to move queue item via drag and drop:", error);
      this.refreshQueue();
    }
  }

  /**
   * Updates queue items in UI immediately for direction-based shifts.
   * @param {string} queueItemId
   * @param {string} direction - 'up' | 'down' | 'next'
   */
  moveQueueItemInUI(queueItemId, direction) {
    const cacheKey = `${this.host?._searchMediaClassFilter || "all"}_upcoming_sort_default`;
    const currentResults = this.host?._searchResultsByType?.[cacheKey];
    if (!Array.isArray(currentResults)) return;

    const itemIndex = currentResults.findIndex((item) => item.queue_item_id === queueItemId);
    if (itemIndex === -1) return;

    let newIndex;
    switch (direction) {
      case "up":
        newIndex = Math.max(0, itemIndex - 1);
        break;
      case "down":
        newIndex = Math.min(currentResults.length - 1, itemIndex + 1);
        break;
      case "next":
        newIndex = 0;
        break;
      default:
        return;
    }
    this.moveQueueItemInUIByIndex(itemIndex, newIndex);
  }

  /**
   * Updates queue items in UI immediately by index repositioning.
   * @param {number} oldIndex
   * @param {number} newIndex
   */
  moveQueueItemInUIByIndex(oldIndex, newIndex) {
    const cacheKey = `${this.host?._searchMediaClassFilter || "all"}_upcoming_sort_default`;
    const currentResults = this.host?._searchResultsByType?.[cacheKey];
    if (!Array.isArray(currentResults)) return;
    if (
      oldIndex < 0 ||
      oldIndex >= currentResults.length ||
      newIndex < 0 ||
      newIndex >= currentResults.length
    ) {
      return;
    }

    const movedItem = currentResults.splice(oldIndex, 1)[0];
    currentResults.splice(newIndex, 0, movedItem);

    if (this.host) {
      this.host._searchResults = [...currentResults];
    }

    currentResults.forEach((item, index) => {
      item.position = index + 1;
    });

    movedItem._justMoved = true;
    setTimeout(() => {
      delete movedItem._justMoved;
      this.host?.requestUpdate?.();
    }, 1000);

    if (this.host) {
      this.host._latestSearchToken = Date.now();
      this.host.triggerRender?.() || this.host.requestUpdate?.();
    }
  }

  /**
   * Advances the queue in UI immediately (e.g. on track skip).
   * @param {string|null} [queueItemId]
   * @param {boolean} [isManual]
   */
  advanceQueueInUI(queueItemId = null, isManual = false) {
    if (!this.host?._upcomingFilterActive) return;

    if (isManual && this.host) {
      this.host._latestManualShiftTime = Date.now();
    }

    const cacheKey = `${this.host?._searchMediaClassFilter || "all"}_upcoming_sort_default`;
    let currentResults = this.host?._searchResultsByType?.[cacheKey];

    if (!Array.isArray(currentResults) || currentResults.length === 0) {
      return;
    }

    if (queueItemId) {
      const itemIndex = currentResults.findIndex((it) => it.queue_item_id === queueItemId);
      if (itemIndex >= 0) {
        currentResults = currentResults.slice(itemIndex + 1);
      }
    } else {
      currentResults = currentResults.slice(1);
    }

    if (this.host) {
      if (this.host._searchResultsByType) {
        this.host._searchResultsByType[cacheKey] = currentResults;
      }
      this.host._searchResults = currentResults;
      this.host._latestSearchToken = Date.now();
      this.host.triggerRender?.() || this.host.requestUpdate?.();
    }
  }

  /**
   * Removes queue item from UI immediately.
   * @param {string} queueItemId
   */
  removeQueueItemFromUI(queueItemId) {
    const cacheKey = `${this.host?._searchMediaClassFilter || "all"}_upcoming_sort_default`;
    const currentResults = this.host?._searchResultsByType?.[cacheKey];
    if (!Array.isArray(currentResults)) return;

    const updatedResults = currentResults.filter((item) => item.queue_item_id !== queueItemId);
    if (this.host) {
      if (this.host._searchResultsByType) {
        this.host._searchResultsByType[cacheKey] = updatedResults;
      }
      this.host._searchResults = updatedResults;
      this.host.triggerRender?.() || this.host.requestUpdate?.();
    }
  }

  /**
   * Logs queue operation errors.
   * @param {string} message
   */
  showQueueError(message) {
    console.error("yamp: Queue operation failed:", message);
  }

  /**
   * Refreshes the upcoming queue display with debouncing.
   * @param {{ delayMs?: number }} [options]
   */
  refreshQueue({ delayMs = 50 } = {}) {
    if (this.host?._upcomingFilterActive) {
      if (this.queueRefreshTimer) {
        clearTimeout(this.queueRefreshTimer);
      }

      this.queueRefreshTimer = setTimeout(() => {
        this.queueRefreshTimer = null;
        if (!this.host?._upcomingFilterActive) return;

        const searchToken = Date.now();
        if (this.host) {
          this.host._latestSearchToken = searchToken;
          this.host
            ._doSearch("all", {
              isUpcoming: true,
              clearFilters: true,
              silent: true,
              force: true,
              token: searchToken,
            })
            ?.catch?.((error) => {
              console.error("yamp: Error refreshing queue:", error);
            });
        }
      }, delayMs);
    }
  }

  /**
   * Subscribes to Music Assistant queue update events via WebSocket.
   */
  async subscribeToQueueUpdates() {
    if (this.queueEventSubscription || !this.host?.hass?.connection) return;

    try {
      this.queueEventSubscription = await this.host.hass.connection.subscribeEvents((event) => {
        const eventData = event.data;
        if (eventData?.type === "queue_updated") {
          // NO-OP: In strictly optimistic mode, we ignore background updates
          // while the sheet is open to prevent flicker. Heartbeat handles sync.
        }
      }, "mass_queue");
    } catch (error) {
      console.error("yamp: Failed to subscribe to queue updates:", error);
    }
  }

  /**
   * Unsubscribes from Music Assistant queue update events.
   */
  unsubscribeFromQueueUpdates() {
    if (this.queueEventSubscription) {
      this.queueEventSubscription();
      this.queueEventSubscription = null;
    }
  }

  /**
   * Checks if a Music Assistant state object contains queue data.
   * @param {any} maState
   * @returns {boolean}
   */
  hasQueueInState(maState) {
    const cacheKey = `${this.host?._searchMediaClassFilter || "all"}_upcoming_sort_default`;
    const cachedUpcoming = this.host?._searchResultsByType?.[cacheKey];
    return hasQueueInState(maState, cachedUpcoming);
  }

  /**
   * Returns available transfer queue targets from configured entities.
   * @returns {any[]}
   */
  getTransferQueueTargets() {
    if (!this.host?.hass?.services?.music_assistant?.transfer_queue) return [];
    const currentIdx = this.host._selectedIndex;
    if (currentIdx === null || currentIdx === undefined || currentIdx < 0) return [];

    const activeMaState = this.host._getMusicAssistantState?.();
    const sourceMaId =
      (activeMaState &&
        this.host._looksLikeMusicAssistantState?.(activeMaState) &&
        activeMaState.entity_id) ||
      this.host._getActualResolvedMaEntityForState(currentIdx);
    if (!sourceMaId) return [];

    const seen = new Set([sourceMaId]);
    const targets = [];
    const entityObjs = this.host.entityObjs || [];

    for (let idx = 0; idx < entityObjs.length; idx++) {
      const obj = entityObjs[idx];
      if (!obj) continue;

      const maEntityId = this.host._getActualResolvedMaEntityForState(idx);
      if (!maEntityId || seen.has(maEntityId)) continue;

      const maState = this.host.hass?.states?.[maEntityId];
      const mainState = this.host.hass?.states?.[obj.entity_id];
      if (
        !this.host._looksLikeMusicAssistantState(maState) &&
        !this.host._looksLikeMusicAssistantState(mainState)
      ) {
        continue;
      }

      seen.add(maEntityId);

      const displayState = maState || mainState;
      const configuredName = obj?.name;
      const displayName =
        configuredName ||
        getEntityName(this.host.hass, mainState) ||
        getEntityName(this.host.hass, maState) ||
        obj.entity_id;

      targets.push({
        index: idx,
        entityId: obj.entity_id,
        maEntityId,
        name: displayName,
        subtitle: maEntityId !== obj.entity_id ? maEntityId : obj.entity_id,
        state: displayState?.state,
        icon: displayState?.attributes?.icon || "mdi:music",
      });
    }

    return targets;
  }

  /**
   * Updates transfer queue availability status and triggers UI re-render if altered.
   * @param {{ refresh?: boolean }} [options]
   * @returns {Promise<boolean>}
   */
  async updateTransferQueueAvailability({ refresh = false } = {}) {
    const maState = this.host?._getMusicAssistantState?.();
    const looksLikeMa = this.host?._looksLikeMusicAssistantState?.(maState);

    if (!maState || !looksLikeMa) {
      if (this.hasTransferQueueForCurrent) {
        this.hasTransferQueueForCurrent = false;
        this.host?.requestUpdate?.();
      }
      return false;
    }

    let hasQueue = this.hasQueueInState(maState);

    if (!hasQueue && refresh && this.host?.hass) {
      const entityId =
        (maState && this.host._looksLikeMusicAssistantState?.(maState) && maState.entity_id) ||
        this.host._getActualResolvedMaEntityForState?.(this.host._selectedIndex);
      if (entityId) {
        try {
          const queueInfo = await this.getUpcomingQueue(this.host.hass, entityId, 2);
          if (Array.isArray(queueInfo?.results) && queueInfo.results.length > 0) {
            hasQueue = true;
          } else if (
            this.host._isEntityPlaying?.(maState) ||
            maState.state === "paused" ||
            maState.attributes?.media_content_id
          ) {
            hasQueue = true;
          }
        } catch (_error) {
          // Ignore errors; fall back to heuristic result
        }
      }
    }

    if (this.hasTransferQueueForCurrent !== hasQueue) {
      this.hasTransferQueueForCurrent = hasQueue;
      this.host?.requestUpdate?.();
    }

    return hasQueue;
  }

  /**
   * Checks whether the transfer queue option should be shown in options menu.
   * @returns {boolean}
   */
  canShowTransferQueueOption() {
    if (!this.hasTransferQueueForCurrent) return false;
    return this.getTransferQueueTargets().length > 0;
  }

  /**
   * Opens the transfer queue sheet overlay (routes to consolidated Speakers & Groups sheet).
   */
  openTransferQueue() {
    if (!this.host) return;
    this.showTransferQueue = false;
    this.host._openGrouping?.();
  }

  /**
   * Closes the transfer queue sheet overlay.
   */
  closeTransferQueue() {
    this.showTransferQueue = false;
    this.host?._closeGrouping?.();
  }

  /**
   * Check if a target player or target entity states represent a Music Assistant player.
   * @param {{ maEntityId?: string, entityId?: string, mainEntityId?: string } | null | undefined} target
   * @returns {boolean}
   */
  isTargetMusicAssistant(target) {
    if (!target || !this.host?.hass?.states) return false;
    const states = this.host.hass.states;
    const maState = target.maEntityId ? states[target.maEntityId] : null;
    const entityState = target.entityId ? states[target.entityId] : null;
    const mainState = target.mainEntityId ? states[target.mainEntityId] : null;
    return Boolean(
      (maState &&
        (this.host._looksLikeMusicAssistantState?.(maState) || isMusicAssistantEntity(maState))) ||
      (entityState &&
        (this.host._looksLikeMusicAssistantState?.(entityState) ||
          isMusicAssistantEntity(entityState))) ||
      (mainState &&
        (this.host._looksLikeMusicAssistantState?.(mainState) || isMusicAssistantEntity(mainState)))
    );
  }

  /**
   * Transfers current Music Assistant queue to a target player.
   * @param {any} target
   */
  async transferQueueTo(target) {
    if (!target || !this.host) return;

    const activeMaState = this.host._getMusicAssistantState?.();
    const sourceMaId =
      (activeMaState &&
        this.host._looksLikeMusicAssistantState?.(activeMaState) &&
        activeMaState.entity_id) ||
      this.host._getActualResolvedMaEntityForState?.(this.host._selectedIndex);
    if (!sourceMaId) return;

    const isTargetMa = this.isTargetMusicAssistant(target);
    if (!isTargetMa) {
      this.transferQueueStatus = {
        type: "error",
        message: localize("card.grouping.transfer_not_ma") || "Music Assistant player required",
      };
      this.host.triggerRender?.() || this.host.requestUpdate?.();
      return;
    }

    this.transferQueuePendingTarget = target.maEntityId;
    this.transferQueueStatus = null;
    this.host.triggerRender?.() || this.host.requestUpdate?.();

    try {
      const payload = this.buildTransferQueuePayload(sourceMaId, target.maEntityId);
      await this.host.hass.callService("music_assistant", "transfer_queue", payload);
      this.transferQueueStatus = {
        type: "success",
        message: `Queue sent to ${target.name}.`,
      };
      const targetIdx =
        typeof target.index === "number"
          ? target.index
          : this.host.entityIds?.indexOf(target.entityId);
      if (targetIdx !== undefined && targetIdx !== null && targetIdx >= 0) {
        const pinnedIdx = this.host._pinnedIndex;
        if (pinnedIdx === null || pinnedIdx === targetIdx) {
          this.host._selectedIndex = targetIdx;
          this.host._manualSelect = true;
          this.host._manualSelectPlayingSet = null;
          if (pinnedIdx === targetIdx) {
            this.host._pinnedIndex = targetIdx;
          }
          const lingerEntity = target.maEntityId || this.host.entityObjs?.[targetIdx]?.entity_id;
          if (lingerEntity) {
            if (!this.host._playbackLingerByIdx) this.host._playbackLingerByIdx = {};
            this.host._playbackLingerByIdx[targetIdx] = {
              entityId: lingerEntity,
              until: Date.now() + 5000,
            };
            if (!this.host._lastPlayingEntityIdByChip) this.host._lastPlayingEntityIdByChip = {};
            this.host._lastPlayingEntityIdByChip[targetIdx] = lingerEntity;
          }
          this.host._ensureResolvedMaForIndex?.(targetIdx);
          this.host._ensureResolvedVolForIndex?.(targetIdx);
          this.host._ensureResolvedHiddenControlsForIndex?.(targetIdx);
        }
      }
      await this.updateTransferQueueAvailability({ refresh: true });
      if (this.transferQueueAutoCloseTimer) {
        clearTimeout(this.transferQueueAutoCloseTimer);
      }
      this.transferQueueAutoCloseTimer = setTimeout(() => {
        this.transferQueueAutoCloseTimer = null;
        this.transferQueueStatus = null;
        if (
          this.host?._showEntityOptions &&
          (this.showTransferQueue ||
            (this.host._showGrouping &&
              this.host._cardType !== "group_players" &&
              this.host._cardType !== "speakers_and_groups"))
        ) {
          this.host._dismissWithAnimation?.();
        } else {
          this.host?.triggerRender?.() || this.host?.requestUpdate?.();
        }
      }, 2000);
    } catch (error) {
      console.error("yamp: Error transferring queue:", error);
      this.transferQueueStatus = {
        type: "error",
        message: error?.message || "Failed to transfer queue.",
      };
      if (this.transferQueueAutoCloseTimer) {
        clearTimeout(this.transferQueueAutoCloseTimer);
        this.transferQueueAutoCloseTimer = null;
      }
      this.transferQueueAutoCloseTimer = setTimeout(() => {
        this.transferQueueAutoCloseTimer = null;
        this.transferQueueStatus = null;
        this.host?.triggerRender?.() || this.host?.requestUpdate?.();
      }, 4000);
    } finally {
      this.transferQueuePendingTarget = null;
      this.host.triggerRender?.() || this.host.requestUpdate?.();
    }
  }

  /**
   * Helper to build transfer queue payload using the host's service metadata.
   * @param {string} sourceId
   * @param {string} targetId
   * @returns {Record<string, string>}
   */
  buildTransferQueuePayload(sourceId, targetId) {
    const serviceMeta = this.host?.hass?.services?.music_assistant?.transfer_queue;
    return buildTransferQueuePayload(sourceId, targetId, serviceMeta);
  }

  /**
   * Determines if the active entity or current chip is a Music Assistant entity.
   * @returns {boolean}
   */
  isMusicAssistantEntity() {
    const host = this.host;
    if (!host) return false;
    const activeState = host.currentActivePlaybackStateObj || host.currentStateObj;
    if (host._looksLikeMusicAssistantState?.(activeState)) return true;

    const maState = host._getMusicAssistantState?.();
    if (!maState) return false;

    const cacheKey = `${host._searchMediaClassFilter || "all"}_upcoming_sort_default`;
    const cachedItems = host._searchResultsByType?.[cacheKey];
    const hasMassAttributes =
      isMusicAssistantEntity(maState) ||
      maState.attributes?.mass_player_id ||
      maState.attributes?.active_queue ||
      (host._upcomingFilterActive && cachedItems?.some((item) => item.queue_item_id));

    return Boolean(hasMassAttributes);
  }

  /**
   * Queues an item from search into Music Assistant.
   * @param {any} item
   */
  async queueMediaFromSearch(item) {
    const host = this.host;
    if (!host) return;
    const targetEntityIdTemplate = host._getSearchEntityId?.(host._selectedIndex);
    const targetEntityId = await host._resolveTemplateAtActionTime?.(
      targetEntityIdTemplate,
      host.currentEntityId
    );
    if (host._radioModeActive) {
      host.hass?.callService("music_assistant", "play_media", {
        entity_id: targetEntityId,
        media_id: item.media_content_id,
        media_type: item.media_content_type,
        enqueue: "add",
        radio_mode: true,
      });
    } else {
      playMedia(host.hass, targetEntityId, item.media_content_id, item.media_content_type, "next");
    }

    host._invalidateUpcomingCache?.();
    host._showSearchSuccessToast?.();
  }
}
