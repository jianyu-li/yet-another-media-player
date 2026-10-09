import { html, nothing } from "lit";
import { isMusicAssistantEntity, applyHostnameToUrl } from "./yamp-utils.js";
import { localize } from "./localize/localize.js";
import { playMedia } from "./services/ha-media-services.js";

const getPlayOptions = () => [
  { mode: "replace", icon: "mdi:playlist-remove", label: localize("search.replace") },
  { mode: "next", icon: "mdi:playlist-play", label: localize("search.play_next") },
  { mode: "replace_next", icon: "mdi:playlist-music", label: localize("search.replace_play") },
  { mode: "add", icon: "mdi:playlist-plus", label: localize("search.add_queue") },
  { mode: "add_to_playlist", icon: "mdi:plus", label: localize("search.add_to_playlist") },
];

export const ALLOWED_MEDIA_TYPES = [
  "artist",
  "album",
  "track",
  "playlist",
  "radio",
  "podcast",
  "audiobook",
];

export function isTrack(item) {
  return item && (item.media_class === "track" || item.media_content_type === "track");
}

export function isRadio(item) {
  return item && (item.media_class === "radio" || item.media_content_type === "radio");
}

export function isShow(item) {
  return Boolean(
    item &&
    (item.media_class === "show" || item.media_content_type === "show" || item.is_ai_radio === true)
  );
}

export function isCardView(searchView) {
  return searchView === "card" || searchView === "card_minimal";
}

export function getSearchResultSubtitle(
  item,
  {
    searchMediaClassFilter = "all",
    recentlyPlayedFilterActive = false,
    upcomingFilterActive = false,
    recommendationsFilterActive = false,
  } = {}
) {
  if (item?.subtitle) {
    return item.subtitle;
  }
  if (isShow(item)) {
    return item.artist || localize("search.filters.show") || "Show";
  }
  const isTrackItem = isTrack(item);
  const isTrackOrAlbum = searchMediaClassFilter === "track" || searchMediaClassFilter === "album";

  if (isTrackItem && item.artist && item.album) {
    return `${item.artist} - ${item.album}`;
  }
  if (
    (isTrackOrAlbum ||
      recentlyPlayedFilterActive ||
      upcomingFilterActive ||
      recommendationsFilterActive) &&
    item.artist
  ) {
    return item.artist;
  }
  return item.media_class
    ? item.media_class.charAt(0).toUpperCase() + item.media_class.slice(1)
    : "";
}

/**
 * @param {any} limit
 * @param {{ cap?: number, floor?: number }} [options]
 */
const resolveLimitValue = (limit, { cap, floor } = {}) => {
  const numericLimit = Number(limit);
  if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
    return undefined;
  }
  let value = numericLimit;
  if (typeof floor === "number") {
    value = Math.max(floor, value);
  }
  if (typeof cap === "number") {
    value = Math.min(cap, value);
  }
  return value;
};

const MUSIC_ASSISTANT_CONFIG_TTL_MS = 30000;
let cachedMusicAssistantEntryId = null;
let cachedMusicAssistantEntryTs = 0;

export function _getDeviceConfigEntryId(device, allDevices = null) {
  if (!device || typeof device !== "object") return null;
  if (typeof device.config_entry_id === "string" && device.config_entry_id.length > 0) {
    return device.config_entry_id;
  }
  if (Array.isArray(device.config_entries) && device.config_entries.length > 0) {
    return device.config_entries[0];
  }
  if (device.parent_device_id && allDevices && allDevices[device.parent_device_id]) {
    const parent = allDevices[device.parent_device_id];
    return _getDeviceConfigEntryId(parent, null);
  }
  return null;
}

export function _resolveIntegrationId(hass, targetEntityId, platforms) {
  let resolvedId = null;
  if (hass?.entities && typeof hass.entities === "object") {
    const resolveFromEntity = (entity) => {
      if (!entity) return null;
      if (entity.config_entry_id) return entity.config_entry_id;
      if (entity.device_id && hass.devices && hass.devices[entity.device_id]) {
        return _getDeviceConfigEntryId(hass.devices[entity.device_id], hass.devices);
      }
      return null;
    };

    if (targetEntityId && hass.entities[targetEntityId]) {
      const targetEntity = hass.entities[targetEntityId];
      if (targetEntity && platforms.includes(targetEntity.platform)) {
        resolvedId = resolveFromEntity(targetEntity);
      }
    }
    if (!resolvedId) {
      const entities = Object.values(hass.entities);
      const entity = entities.find((e) => e && platforms.includes(e.platform));
      if (entity) {
        resolvedId = resolveFromEntity(entity);
      }
    }
  }
  return resolvedId;
}

export async function getMusicAssistantConfigEntryId(hass, targetEntityId = null) {
  if (!hass) return null;
  const now = Date.now();
  if (
    cachedMusicAssistantEntryId &&
    now - cachedMusicAssistantEntryTs < MUSIC_ASSISTANT_CONFIG_TTL_MS
  ) {
    return cachedMusicAssistantEntryId;
  }
  try {
    const services = hass.services || {};
    const hasMaService = Boolean(services.music_assistant);
    if (!hasMaService) {
      cachedMusicAssistantEntryId = null;
      cachedMusicAssistantEntryTs = now;
      return null;
    }

    const resolvedId = _resolveIntegrationId(hass, targetEntityId, ["music_assistant", "mass"]);

    cachedMusicAssistantEntryId = resolvedId || "auto";
    cachedMusicAssistantEntryTs = now;
    return cachedMusicAssistantEntryId;
  } catch (error) {
    cachedMusicAssistantEntryId = null;
    cachedMusicAssistantEntryTs = now;
    return null;
  }
}

let cachedMassQueueEntryId = null;
let cachedMassQueueEntryTs = 0;

export async function getMassQueueConfigEntryId(hass, targetEntityId = null) {
  if (!hass) return null;
  const now = Date.now();
  if (cachedMassQueueEntryId && now - cachedMassQueueEntryTs < MUSIC_ASSISTANT_CONFIG_TTL_MS) {
    return cachedMassQueueEntryId;
  }
  try {
    const services = hass.services || {};
    const hasMqService = Boolean(services.mass_queue);
    if (!hasMqService) {
      cachedMassQueueEntryId = null;
      cachedMassQueueEntryTs = now;
      return null;
    }

    if (hass.user && hass.user.is_admin) {
      try {
        const configEntries = await hass.connection.sendMessagePromise({
          type: "config_entries/get",
          domain: "mass_queue",
        });
        if (configEntries && configEntries.length > 0) {
          cachedMassQueueEntryId = configEntries[0].entry_id;
          cachedMassQueueEntryTs = now;
          return cachedMassQueueEntryId;
        }
      } catch (e) {
        // Ignored: WebSocket call failed
      }
    }

    const resolvedId = _resolveIntegrationId(hass, null, ["mass_queue"]);

    cachedMassQueueEntryId = resolvedId || "auto";
    cachedMassQueueEntryTs = now;
    return cachedMassQueueEntryId;
  } catch (error) {
    cachedMassQueueEntryId = null;
    cachedMassQueueEntryTs = now;
    return null;
  }
}

let cachedAiRadioAvailable = null;
let cachedAiRadioAvailableTs = 0;
const AI_RADIO_TTL_MS = 30000;

export function _resetAiRadioCache() {
  cachedAiRadioAvailable = null;
  cachedAiRadioAvailableTs = 0;
}

export async function isAiRadioAvailable(hass, entityId = null) {
  if (!hass) return false;
  const services = hass.services || {};
  if (!services.mass_queue) {
    return false;
  }
  const now = Date.now();
  if (cachedAiRadioAvailable !== null && now - cachedAiRadioAvailableTs < AI_RADIO_TTL_MS) {
    return cachedAiRadioAvailable;
  }
  try {
    const mqConfigEntryId = await getMassQueueConfigEntryId(hass, entityId);
    if (!mqConfigEntryId) {
      cachedAiRadioAvailable = false;
      cachedAiRadioAvailableTs = now;
      return false;
    }
    const message = {
      type: "call_service",
      domain: "mass_queue",
      service: "send_command",
      service_data: {
        command: "ai_radio/stations/list",
        ...(mqConfigEntryId && mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
      },
      return_response: true,
    };
    const res = await hass.connection.sendMessagePromise(message);
    const stations = res?.response?.response || res?.response || res?.result;
    cachedAiRadioAvailable = Array.isArray(stations);
    cachedAiRadioAvailableTs = now;
    return cachedAiRadioAvailable;
  } catch {
    cachedAiRadioAvailable = false;
    cachedAiRadioAvailableTs = now;
    return false;
  }
}

export async function getAiRadioShows(hass, entityId = null, query = "") {
  if (!hass) return [];
  const mqConfigEntryId = await getMassQueueConfigEntryId(hass, entityId);
  if (!mqConfigEntryId) return [];

  try {
    const [stationsRes, hostsRes] = await Promise.all([
      hass.connection
        .sendMessagePromise({
          type: "call_service",
          domain: "mass_queue",
          service: "send_command",
          service_data: {
            command: "ai_radio/stations/list",
            ...(mqConfigEntryId &&
              mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
          },
          return_response: true,
        })
        .catch(() => null),
      hass.connection
        .sendMessagePromise({
          type: "call_service",
          domain: "mass_queue",
          service: "send_command",
          service_data: {
            command: "ai_radio/hosts/list",
            ...(mqConfigEntryId &&
              mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
          },
          return_response: true,
        })
        .catch(() => null),
    ]);

    const rawStations =
      stationsRes?.response?.response || stationsRes?.response || stationsRes?.result;
    const rawHosts = hostsRes?.response?.response || hostsRes?.response || hostsRes?.result;

    if (!Array.isArray(rawStations)) return [];

    const hostMap = new Map();
    if (Array.isArray(rawHosts)) {
      for (const host of rawHosts) {
        if (host && host.id) {
          hostMap.set(host.id, host.name || host.id);
        }
      }
    }

    const shows = rawStations.map((station) => {
      const hostName = station.host_id ? hostMap.get(station.host_id) || station.host_id : "";
      const subtitle = hostName ? `Host: ${hostName}` : "AI Radio Show";
      return {
        title: station.name,
        media_content_id: `ai_radio://station/${station.id}`,
        media_content_type: "show",
        media_class: "show",
        station_id: station.id,
        item_id: station.id,
        is_ai_radio: true,
        artist: hostName ? `Host: ${hostName}` : "AI Radio",
        subtitle,
        thumbnail: null,
        is_browsable: false,
        is_editable: false,
      };
    });

    if (query && query.trim() !== "") {
      const q = query.trim().toLowerCase();
      return shows.filter((s) => {
        const titleMatch = s.title && s.title.toLowerCase().includes(q);
        const hostMatch = s.artist && s.artist.toLowerCase().includes(q);
        return titleMatch || hostMatch;
      });
    }

    return shows;
  } catch (error) {
    console.error("yamp: Error getting AI radio shows:", error);
    return [];
  }
}

export async function playAiRadioStation(hass, entityId, stationId) {
  if (!hass || !stationId) return false;
  try {
    const mqConfigEntryId = await getMassQueueConfigEntryId(hass, entityId);
    let playerId = hass.states?.[entityId]?.attributes?.mass_player_id || null;

    if (!playerId && entityId) {
      try {
        const info = await hass.connection.sendMessagePromise({
          type: "mass_queue/get_info",
          entity_id: entityId,
        });
        playerId = info?.player_id || info?.result?.player_id || null;
      } catch {
        // Fallback: playerId remains null
      }
    }

    const commandPayload = {
      station_id: stationId,
    };
    if (playerId) {
      commandPayload.player_id_override = playerId;
    }

    const serviceData = {
      command: "ai_radio/start",
      data: commandPayload,
      ...(mqConfigEntryId && mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
    };

    if (hass.callService) {
      await hass.callService("mass_queue", "send_command", serviceData);
    } else {
      await hass.connection.sendMessagePromise({
        type: "call_service",
        domain: "mass_queue",
        service: "send_command",
        service_data: serviceData,
      });
    }
    return true;
  } catch (error) {
    console.error("yamp: Error playing AI radio station:", error);
    return false;
  }
}

export function transformMusicAssistantItem(item) {
  if (!item) return null;
  return {
    title: item.name,
    media_content_id: item.uri,
    media_content_type: item.media_type,
    media_class: item.media_type,
    item_id: item.item_id,
    thumbnail: item.image,
    ...(item.artists && { artist: item.artists.map((a) => a.name).join(", ") }),
    ...(item.album && { album: item.album.name, album_uri: item.album.uri }),
    is_browsable:
      item.media_type === "artist" ||
      item.media_type === "album" ||
      item.media_type === "playlist" ||
      item.media_type === "track",
    is_editable: item.is_editable === true,
  };
}

/**
 * Renders action buttons for a single search result item.
 * @param {Object} opts
 * @param {any} opts.item
 * @param {Function} [opts.onPlay]
 * @param {Function} [opts.onOptionsToggle]
 * @param {boolean} [opts.upcomingFilterActive]
 * @param {boolean} [opts.isMusicAssistant]
 * @param {boolean} [opts.massQueueAvailable]
 * @param {string} [opts.searchView]
 * @param {boolean} [opts.isInline]
 * @param {string} [opts.queueControlsStyle]
 * @param {Function} [opts.onMoveUp]
 * @param {Function} [opts.onMoveDown]
 * @param {Function} [opts.onMoveNext]
 * @param {Function} [opts.onRemove]
 * @param {boolean} [opts.minimal]
 * @param {boolean} [opts.hideActions]
 * @param {string|null} [opts.loadingSearchRowMenuId]
 */
export function renderSearchResultActions({
  item,
  onPlay,
  onOptionsToggle,
  upcomingFilterActive = false,
  isMusicAssistant = false,
  massQueueAvailable = false,
  searchView = "list",
  isInline = false,
  queueControlsStyle = "drag_handle",
  onMoveUp,
  onMoveDown,
  onMoveNext,
  onRemove,
  minimal = false,
  hideActions = false,
  loadingSearchRowMenuId = null,
}) {
  if (hideActions) return nothing;
  const isQueueItem = !!(
    upcomingFilterActive &&
    item.queue_item_id &&
    isMusicAssistant &&
    massQueueAvailable
  );

  const isCard = isCardView(searchView);
  const containerClass = isInline
    ? "entity-options-search-buttons"
    : isCard
      ? "card-overlay-buttons"
      : "search-sheet-buttons";
  const playClass = isInline
    ? "entity-options-search-play"
    : isCard
      ? "search-sheet-play icon-only"
      : "search-sheet-play";
  const queueClass = isInline
    ? "entity-options-search-queue"
    : isCard
      ? "search-sheet-queue icon-only"
      : "search-sheet-queue";

  const isLoading =
    loadingSearchRowMenuId != null &&
    item?.media_content_id != null &&
    loadingSearchRowMenuId === item.media_content_id;

  return html`
    <div class="${containerClass}">
      ${
        isQueueItem && isInline
          ? html`
              <div class="queue-controls">
                ${
                  queueControlsStyle === "drag_handle"
                    ? html`
                        <div
                          class="queue-btn queue-drag-handle"
                          title="${localize("search.drag_to_reorder")}"
                        >
                          <ha-icon icon="mdi:drag"></ha-icon>
                        </div>
                      `
                    : html`
                        <button
                          class="queue-btn queue-btn-up"
                          @click=${(e) => {
                            e.stopPropagation();
                            onMoveUp(item);
                          }}
                          title="${localize("search.move_up")}"
                        >
                          <ha-icon icon="mdi:chevron-up"></ha-icon>
                        </button>
                        <button
                          class="queue-btn queue-btn-down"
                          @click=${(e) => {
                            e.stopPropagation();
                            onMoveDown(item);
                          }}
                          title="${localize("search.move_down")}"
                        >
                          <ha-icon icon="mdi:chevron-down"></ha-icon>
                        </button>
                        <button
                          class="queue-btn queue-btn-next"
                          @click=${(e) => {
                            e.stopPropagation();
                            onMoveNext(item);
                          }}
                          title="${localize("search.move_next")}"
                        >
                          <ha-icon icon="mdi:playlist-play"></ha-icon>
                        </button>
                      `
                }
                <button
                  class="queue-btn queue-btn-remove"
                  @click=${(e) => {
                    e.stopPropagation();
                    onRemove(item);
                  }}
                  title="${localize("search.remove")}"
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `
          : nothing
      }
      <button
        class="${playClass}"
        @click=${(e) => {
          e.stopPropagation();
          if (!isLoading) {
            onPlay(item);
          }
        }}
        ?disabled=${isLoading}
        title="${localize("search.play_item", "{item}", item.title)}"
      >
        <ha-icon
          icon="${isLoading ? "mdi:loading" : "mdi:play"}"
          class="${isLoading ? "spin" : ""}"
        ></ha-icon>
      </button>
      ${
        !isQueueItem && !isRadio(item) && !isShow(item) && !minimal
          ? html`
              <button
                class="${queueClass}"
                @click=${(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOptionsToggle(item);
                }}
                title="${localize("common.more_options")}"
              >
                <ha-icon icon="mdi:dots-vertical"></ha-icon>
              </button>
            `
          : nothing
      }
    </div>
  `;
}

export function renderSearchResultSlideOut({
  item,
  activeSearchRowMenuId,
  onPlayOption,
  onOptionsToggle,
  searchView = "list",
  isQueueItem = false,
  massQueueAvailable = false,
  onMoveUp,
  onMoveDown,
  onMoveNext,
  onRemove,
  hideActions = false,
}) {
  if (hideActions) return nothing;
  const isActive =
    activeSearchRowMenuId != null &&
    item.media_content_id != null &&
    activeSearchRowMenuId === item.media_content_id;

  const isCard = isCardView(searchView);

  return html`
    <div class="search-row-slide-out ${isActive ? "active" : ""}">
      ${
        isQueueItem && isCard
          ? html`
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onMoveUp(item);
                  onOptionsToggle(null);
                }}
                title="${localize("search.move_up")}"
              >
                ${localize("search.move_up")}
              </button>
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onMoveDown(item);
                  onOptionsToggle(null);
                }}
                title="${localize("search.move_down")}"
              >
                ${localize("search.move_down")}
              </button>
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onMoveNext(item);
                  onOptionsToggle(null);
                }}
                title="${localize("search.move_next")}"
              >
                ${localize("search.move_next")}
              </button>
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onRemove(item);
                  onOptionsToggle(null);
                }}
                title="${localize("search.remove")}"
              >
                ${localize("search.remove")}
              </button>
            `
          : html`
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onPlayOption(item, "replace");
                }}
                title="${localize("search.labels.replace")}"
              >
                ${isCard ? nothing : html`<ha-icon icon="mdi:playlist-remove"></ha-icon>`}${localize(
                  "search.labels.replace"
                )}
              </button>
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onPlayOption(item, "next");
                }}
                title="${localize("search.labels.next")}"
              >
                ${isCard ? nothing : html`<ha-icon icon="mdi:playlist-play"></ha-icon>`}${localize(
                  "search.labels.next"
                )}
              </button>
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onPlayOption(item, "replace_next");
                }}
                title="${localize("search.labels.replace_next")}"
              >
                ${isCard ? nothing : html`<ha-icon icon="mdi:playlist-music"></ha-icon>`}${localize(
                  "search.labels.replace_next"
                )}
              </button>
              <button
                class="slide-out-button"
                @click=${(e) => {
                  e.stopPropagation();
                  onPlayOption(item, "add");
                }}
                title="${localize("search.labels.add")}"
              >
                ${isCard ? nothing : html`<ha-icon icon="mdi:playlist-plus"></ha-icon>`}${localize(
                  "search.labels.add"
                )}
              </button>
              ${
                isTrack(item) && massQueueAvailable
                  ? html`
                      <button
                        class="slide-out-button"
                        @click=${(e) => {
                          e.stopPropagation();
                          onPlayOption(item, "add_to_playlist");
                        }}
                        title="${localize("search.labels.add_to_playlist")}"
                      >
                        ${isCard ? nothing : html`<ha-icon icon="mdi:plus"></ha-icon>`}${localize(
                          "search.labels.add_to_playlist"
                        )}
                      </button>
                    `
                  : nothing
              }
            `
      }
      <div
        class="slide-out-close"
        @click=${(e) => {
          e.stopPropagation();
          onOptionsToggle(null);
        }}
      >
        <ha-icon icon="mdi:close"></ha-icon>
      </div>
    </div>
  `;
}

/**
 * Renders a single search result item row or card.
 * @param {Object} opts
 * @param {any} [opts.item]
 * @param {boolean} [opts.isCard]
 * @param {boolean} [opts.isMinimal]
 * @param {boolean} [opts.isGridMode]
 * @param {string|null} [opts.activeSearchRowMenuId]
 * @param {string|null} [opts.loadingSearchRowMenuId]
 * @param {string|null} [opts.errorSearchRowMenuId]
 * @param {string|null} [opts.successSearchRowMenuId]
 * @param {string|null} [opts.successSearchRowType]
 * @param {boolean} [opts.isSelectionFlow]
 * @param {boolean} [opts.massQueueAvailable]
 * @param {boolean} [opts.upcomingFilterActive]
 * @param {boolean} [opts.recentlyPlayedFilterActive]
 * @param {boolean} [opts.recommendationsFilterActive]
 * @param {string} [opts.searchMediaClassFilter]
 * @param {string} [opts.queueControlsStyle]
 * @param {Function} [opts.onPlay]
 * @param {Function} [opts.onResultClick]
 * @param {Function} [opts.onOptionsToggle]
 * @param {Function} [opts.onPlayOption]
 * @param {Function} [opts.onMoveUp]
 * @param {Function} [opts.onMoveDown]
 * @param {Function} [opts.onMoveNext]
 * @param {Function} [opts.onRemove]
 * @param {boolean} [opts.isMusicAssistant]
 * @param {Function} [opts.isValidArtwork]
 * @param {Function} [opts.getClickTitle]
 * @param {string} [opts.artworkHostname]
 */
export function renderSearchResultItem({
  item,
  isCard,
  isMinimal,
  isGridMode,
  activeSearchRowMenuId,
  loadingSearchRowMenuId,
  errorSearchRowMenuId,
  successSearchRowMenuId,
  successSearchRowType,
  isSelectionFlow,
  massQueueAvailable,
  upcomingFilterActive,
  recentlyPlayedFilterActive = false,
  recommendationsFilterActive = false,
  searchMediaClassFilter = "all",
  queueControlsStyle = "drag_handle",
  onPlay,
  onResultClick,
  onOptionsToggle,
  onPlayOption,
  onMoveUp,
  onMoveDown,
  onMoveNext,
  onRemove,
  isMusicAssistant = false,
  isValidArtwork = (url) => !!url,
  getClickTitle = (item) => "",
  artworkHostname = "",
}) {
  if (!item) {
    return html`<div class="yamp-search-result placeholder"></div>`;
  }

  const isMA = isMusicAssistant;
  const isClickable = !!item.is_browsable || isSelectionFlow;
  const searchViewType = isCard ? (isMinimal ? "card_minimal" : "card") : "list";
  const isActive =
    activeSearchRowMenuId != null &&
    item.media_content_id != null &&
    activeSearchRowMenuId === item.media_content_id;
  const hideActions = isSelectionFlow;

  if (isGridMode) {
    const isLoading =
      loadingSearchRowMenuId != null &&
      item.media_content_id != null &&
      loadingSearchRowMenuId === item.media_content_id;

    return html`
      <button
        class="entity-options-item menu-action-item search-result-grid-mode ${
          upcomingFilterActive && massQueueAvailable && queueControlsStyle === "drag_handle"
            ? "queue-drag-handle"
            : "nodrag no-drag ignore-drag"
        } ${item._justMoved ? "just-moved" : ""} ${isActive ? "menu-active" : ""}"
        @click=${(e) => {
          if (isLoading) return;
          if (!isSelectionFlow) {
            onPlay?.(item, e);
          } else {
            onResultClick?.(item, e);
          }
        }}
        ?disabled=${isLoading}
        title=${getClickTitle(item) || item.title}
      >
        ${
          item.thumbnail && isValidArtwork(item.thumbnail)
            ? html`
                <img
                  class="yamp-search-result-thumb"
                  src=${applyHostnameToUrl(item.thumbnail, artworkHostname)}
                  alt=${item.title}
                  onerror="this.style.display='none'"
                />
              `
            : html`
                <div class="yamp-search-result-thumb-placeholder">
                  <ha-icon
                    icon="${isShow(item) ? "mdi:radio-tower" : isRadio(item) ? "mdi:radio" : "mdi:music"}"
                  ></ha-icon>
                </div>
              `
        }
        <span class="menu-action-label">${item.title}</span>
        ${
          isSelectionFlow && isLoading
            ? html`
                <div class="search-row-loading-overlay">
                  <ha-icon icon="mdi:loading" class="spin"></ha-icon>
                  <span>${localize("common.loading")}</span>
                </div>
              `
            : nothing
        }
      </button>
    `;
  }

  return html`
    <div
      class="yamp-search-result nodrag no-drag ignore-drag ${
        isCard ? "search-result-card" : ""
      } ${isMinimal ? "minimal" : ""} ${item._justMoved ? "just-moved" : ""} ${
        isActive ? "menu-active" : ""
      } ${isClickable ? "clickable" : ""}"
      @click=${(e) => {
        if (
          loadingSearchRowMenuId != null &&
          item.media_content_id != null &&
          loadingSearchRowMenuId === item.media_content_id
        ) {
          return;
        }
        if (isSelectionFlow || (!isCard && isClickable)) {
          onResultClick?.(item, e);
        } else {
          onPlay?.(item, e);
        }
      }}
    >
      <div class="search-sheet-thumb-container" data-clickable="${isCard}">
        ${
          item.thumbnail && isValidArtwork(item.thumbnail)
            ? html`
                <img
                  class="yamp-search-result-thumb"
                  src=${applyHostnameToUrl(item.thumbnail, artworkHostname)}
                  alt=${item.title}
                  onerror="this.style.display='none'"
                />
              `
            : html`
                <div class="yamp-search-result-thumb-placeholder">
                  <ha-icon
                    icon="${isShow(item) ? "mdi:radio-tower" : isRadio(item) ? "mdi:radio" : "mdi:music"}"
                  ></ha-icon>
                </div>
              `
        }
        ${
          isCard
            ? renderSearchResultActions({
                item,
                onPlay,
                onOptionsToggle,
                upcomingFilterActive: !!upcomingFilterActive,
                isMusicAssistant: isMA,
                massQueueAvailable,
                searchView: searchViewType,
                queueControlsStyle,
                onMoveUp,
                onMoveDown,
                onMoveNext,
                onRemove,
                minimal: isMinimal,
                hideActions,
                loadingSearchRowMenuId,
              })
            : nothing
        }
      </div>

      ${
        !isMinimal
          ? html`
              <div class="yamp-search-result-info">
                <span
                  class="yamp-search-result-title ${isClickable ? "clickable-search-result" : ""}"
                  @click=${(e) => {
                    if (isClickable || isSelectionFlow) {
                      e.stopPropagation();
                      onResultClick && onResultClick(item, e);
                    }
                  }}
                  title=${getClickTitle(item)}
                >
                  ${item.title}
                </span>
                <span
                  class="yamp-search-result-subtitle ${isClickable ? "clickable-search-result" : ""}"
                  @click=${(e) => {
                    if (isClickable || isSelectionFlow) {
                      e.stopPropagation();
                      onResultClick && onResultClick(item, e);
                    }
                  }}
                >
                  ${getSearchResultSubtitle(item, {
                    searchMediaClassFilter,
                    recentlyPlayedFilterActive,
                    upcomingFilterActive,
                    recommendationsFilterActive,
                  })}
                </span>
                ${
                  isCard && !isRadio(item) && !isShow(item) && !hideActions
                    ? html`
                        <div
                          class="card-menu-button ${
                            upcomingFilterActive &&
                            massQueueAvailable &&
                            queueControlsStyle === "drag_handle"
                              ? "queue-drag-handle"
                              : ""
                          }"
                          @click=${(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOptionsToggle(item);
                          }}
                        >
                          <ha-icon icon="mdi:dots-vertical"></ha-icon>
                        </div>
                      `
                    : nothing
                }
              </div>
            `
          : nothing
      }
      ${
        !isCard
          ? renderSearchResultActions({
              item,
              onPlay,
              onOptionsToggle,
              upcomingFilterActive: !!upcomingFilterActive,
              isMusicAssistant: isMA,
              massQueueAvailable,
              searchView: searchViewType,
              isInline: true,
              queueControlsStyle,
              onMoveUp,
              onMoveDown,
              onMoveNext,
              onRemove,
              hideActions,
              loadingSearchRowMenuId,
            })
          : nothing
      }
      ${renderSearchResultSlideOut({
        item,
        activeSearchRowMenuId,
        onPlayOption,
        onOptionsToggle,
        searchView: searchViewType,
        isQueueItem: isMA && item.queue_item_id && upcomingFilterActive && massQueueAvailable,
        massQueueAvailable,
        onMoveUp,
        onMoveDown,
        onMoveNext,
        onRemove,
        hideActions,
      })}
      ${
        isSelectionFlow &&
        loadingSearchRowMenuId != null &&
        item.media_content_id != null &&
        loadingSearchRowMenuId === item.media_content_id
          ? html`
              <div class="search-row-loading-overlay">
                <ha-icon icon="mdi:loading" class="spin"></ha-icon>
                <span>${localize("common.loading")}</span>
              </div>
            `
          : nothing
      }
      ${
        errorSearchRowMenuId != null &&
        item.media_content_id != null &&
        errorSearchRowMenuId === item.media_content_id
          ? html`
              <div class="search-row-error-overlay">
                <ha-icon icon="mdi:alert-circle" class="error-icon"></ha-icon>
                <span>${localize("common.error") || "Error"}</span>
              </div>
            `
          : nothing
      }
      ${
        successSearchRowMenuId != null &&
        item.media_content_id != null &&
        successSearchRowMenuId === item.media_content_id
          ? html`
              <div class="search-row-success-overlay">
                <span>✅</span>
                <span
                  >${
                    successSearchRowType === "playlist"
                      ? localize("search.added_to_playlist")
                      : localize("search.added")
                  }</span
                >
              </div>
            `
          : nothing
      }
    </div>
  `;
}

export function renderSearchOptionsOverlay({
  item,
  onClose,
  onPlayOption,
  massQueueAvailable = false,
}) {
  if (!item) return nothing;

  return html`
    <div class="entity-options-overlay entity-options-overlay-opening" @click=${onClose}>
      <div
        class="entity-options-container entity-options-sheet-opening"
        @click=${(e) => e.stopPropagation()}
      >
        <div class="entity-options-sheet">
          <div class="entity-options-title">${item.title}</div>

          ${getPlayOptions()
            .filter((option) => {
              if (option.mode === "add_to_playlist") {
                return isTrack(item) && massQueueAvailable;
              }
              return true;
            })
            .map(
              (option) => html`
                <button
                  class="entity-options-item menu-action-item"
                  @click=${() => onPlayOption(item, option.mode)}
                >
                  <ha-icon class="menu-action-icon" .icon=${option.icon}></ha-icon>
                  <span class="menu-action-label">${option.label}</span>
                </button>
              `
            )}

          <div class="entity-options-divider"></div>

          <button class="entity-options-item close-item" @click=${onClose}>
            ${localize("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Service helpers to keep search-related logic colocated with the search UI module
export async function searchMedia(
  hass,
  entityId,
  query,
  mediaType = null,
  searchParams = {},
  searchResultsLimit = 20
) {
  if (mediaType === "shows") {
    const shows = await getAiRadioShows(hass, entityId, query);
    return { results: shows, usedMusicAssistant: true };
  }

  const configEntryId = await getMusicAssistantConfigEntryId(hass, entityId);
  // Try Music Assistant search if we have a config entry
  if (configEntryId) {
    try {
      // If favorites are requested, use Music Assistant get_library with favorite + search
      if (searchParams.favorites) {
        const mediaTypes = mediaType && mediaType !== "all" ? [mediaType] : ALLOWED_MEDIA_TYPES;
        const flatResultsFav = [];
        await Promise.all(
          mediaTypes.map(async (mt) => {
            try {
              const message = {
                type: "call_service",
                domain: "music_assistant",
                service: "get_library",
                service_data: /** @type {Record<string, any>} */ ({
                  ...(configEntryId &&
                    configEntryId !== "auto" && { config_entry_id: configEntryId }),
                  media_type: mt,
                  favorite: true,
                  search: query,
                }),
                return_response: true,
              };
              const favoritesLimit = resolveLimitValue(searchResultsLimit);
              if (favoritesLimit !== undefined) {
                message.service_data.limit = favoritesLimit;
              }
              if (searchParams.orderBy && searchParams.orderBy !== "default") {
                message.service_data.order_by = searchParams.orderBy;
              }
              const favRes = await hass.connection.sendMessagePromise(message);
              const favResponse = favRes?.response;
              const items = favResponse?.items || [];
              items.forEach((item) => {
                const transformedItem = transformMusicAssistantItem(item);
                if (transformedItem) {
                  flatResultsFav.push(transformedItem);
                }
              });
            } catch (error) {
              console.error("yamp: Error searching favorites for type", mt, error);
            }
          })
        );
        return { results: flatResultsFav, usedMusicAssistant: true };
      }

      // If query is empty and we have a specific media type (not 'all'), treat as browsing the library
      if (
        (!query || query.trim() === "") &&
        mediaType &&
        mediaType !== "all" &&
        !searchParams.favorites &&
        !searchParams.album &&
        !searchParams.artist
      ) {
        // Validate media type strictly
        if (!ALLOWED_MEDIA_TYPES.includes(mediaType)) {
          console.warn(
            `yamp: Unsupported media type for browsing: ${mediaType}. Skipping get_library call.`
          );
          return { results: [], usedMusicAssistant: true };
        }

        try {
          const message = {
            type: "call_service",
            domain: "music_assistant",
            service: "get_library",
            service_data: /** @type {Record<string, any>} */ ({
              ...(configEntryId && configEntryId !== "auto" && { config_entry_id: configEntryId }),
              media_type: mediaType,
              // favorite param omitted to get ALL items
            }),
            return_response: true,
          };

          const limit = resolveLimitValue(searchResultsLimit);
          if (limit !== undefined) {
            message.service_data.limit = limit;
          }
          if (searchParams.orderBy && searchParams.orderBy !== "default") {
            message.service_data.order_by = searchParams.orderBy;
          }

          const res = await hass.connection.sendMessagePromise(message);
          const response = res?.response;
          const items = response?.items || [];

          const browseResults = [];
          items.forEach((item) => {
            const transformedItem = transformMusicAssistantItem(item);
            if (transformedItem) {
              browseResults.push(transformedItem);
            }
          });

          return { results: browseResults, usedMusicAssistant: true };
        } catch (error) {
          console.error("yamp: Error browsing library for type", mediaType, error);
          return { results: [], usedMusicAssistant: true };
        }
      }

      const searchQuery =
        query && query.trim() !== ""
          ? query
          : searchParams.album || (mediaType === "album" ? "" : searchParams.artist || "");
      const serviceData = /** @type {Record<string, any>} */ ({
        name: searchQuery,
        ...(configEntryId && configEntryId !== "auto" && { config_entry_id: configEntryId }),
      });
      const searchLimit = resolveLimitValue(searchResultsLimit, {
        cap: mediaType === "all" ? 8 : undefined,
      });
      if (searchLimit !== undefined) {
        serviceData.limit = searchLimit; // Use configurable limit for filtered searches
      }

      // Add media_type if specified and not "all"
      if (mediaType && mediaType !== "all") {
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
            items.forEach((item) => {
              const transformedItem = transformMusicAssistantItem(item);
              if (transformedItem) {
                flatResults.push(transformedItem);
              }
            });
          }
        });

        if (mediaType === "all" && query && query.trim() !== "" && !searchParams.favorites) {
          try {
            const shows = await getAiRadioShows(hass, entityId, query);
            if (shows && shows.length > 0) {
              flatResults.push(...shows);
            }
          } catch {
            // Non-critical: continue without shows
          }
        }

        return { results: flatResults, usedMusicAssistant: true };
      }
    } catch (error) {
      console.error("yamp: Error in searchMedia:", error);
    }
  }

  // Fallback to media_player search
  const fallbackResults = await fallbackToMediaPlayerSearch(
    hass,
    entityId,
    query,
    mediaType,
    searchParams
  );
  return { results: fallbackResults, usedMusicAssistant: false };
}

// Get favorites from Music Assistant
export async function getRecentlyPlayed(
  hass,
  entityId,
  mediaType = null,
  searchResultsLimit = 20,
  options = {}
) {
  const configEntryId = await getMusicAssistantConfigEntryId(hass, entityId);
  if (!configEntryId) {
    return { results: [], usedMusicAssistant: false };
  }
  const onChunk = typeof options.onChunk === "function" ? options.onChunk : null;
  const fetchMediaType = async (mt, limitArgs = {}) => {
    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: /** @type {Record<string, any>} */ ({
        ...(configEntryId && configEntryId !== "auto" && { config_entry_id: configEntryId }),
        media_type: mt,
        order_by: "last_played_desc",
      }),
      return_response: true,
    };
    const appliedLimit = resolveLimitValue(searchResultsLimit, limitArgs);
    if (appliedLimit !== undefined) {
      message.service_data.limit = appliedLimit;
    }
    const response = await hass.connection.sendMessagePromise(message);
    const items = response?.response?.items || [];
    return items.map(transformMusicAssistantItem).filter(Boolean);
  };

  try {
    if (mediaType === "all") {
      const allResults = [];
      await Promise.all(
        ALLOWED_MEDIA_TYPES.map(async (mt) => {
          const chunk = await fetchMediaType(mt, { cap: 5 });
          if (chunk.length) {
            allResults.push(...chunk);
            if (onChunk) {
              onChunk(chunk, mt);
            }
          }
        })
      );
      return { results: allResults, usedMusicAssistant: true };
    }

    const chunk = await fetchMediaType(mediaType || "track");
    if (chunk.length && onChunk) {
      onChunk(chunk, mediaType || "track");
    }
    return { results: chunk, usedMusicAssistant: true };
  } catch (error) {
    console.error("yamp: Error getting recently played from Music Assistant:", error);
    return { results: [], usedMusicAssistant: false };
  }
}

export async function getFavorites(
  hass,
  entityId,
  mediaType = null,
  searchResultsLimit = 20,
  options = {}
) {
  const configEntryId = await getMusicAssistantConfigEntryId(hass, entityId);
  if (!configEntryId) {
    return { results: [], usedMusicAssistant: false };
  }

  const onChunk = typeof options.onChunk === "function" ? options.onChunk : null;
  const fetchFavoritesForType = async (type) => {
    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: /** @type {Record<string, any>} */ ({
        ...(configEntryId && configEntryId !== "auto" && { config_entry_id: configEntryId }),
        media_type: type,
        favorite: true,
      }),
      return_response: true,
    };
    const favoritesLimit = resolveLimitValue(searchResultsLimit, {
      cap: type === "all" ? 8 : undefined,
    });
    if (favoritesLimit !== undefined) {
      message.service_data.limit = favoritesLimit;
    }
    if (options.orderBy && options.orderBy !== "default") {
      message.service_data.order_by = options.orderBy;
    }
    try {
      const res = await hass.connection.sendMessagePromise(message);
      const response = res?.response;
      const items = response?.items || [];
      return items.map(transformMusicAssistantItem).filter(Boolean);
    } catch (error) {
      console.error("yamp: Error loading favorites for type", type, error);
      return [];
    }
  };

  try {
    if (mediaType && mediaType !== "all") {
      const chunk = await fetchFavoritesForType(mediaType);
      if (chunk.length && onChunk) {
        onChunk(chunk, mediaType);
      }
      return { results: chunk, usedMusicAssistant: true };
    }

    const flatResults = [];
    await Promise.all(
      ALLOWED_MEDIA_TYPES.map(async (type) => {
        const chunk = await fetchFavoritesForType(type);
        if (chunk.length) {
          flatResults.push(...chunk);
          if (onChunk) {
            onChunk(chunk, type);
          }
        }
      })
    );

    return { results: flatResults, usedMusicAssistant: true };
  } catch (error) {
    console.error("yamp: Error loading favorites", error);
    return { results: [], usedMusicAssistant: false };
  }
}

// Fallback function for media_player search
async function fallbackToMediaPlayerSearch(hass, entityId, query, mediaType, searchParams = {}) {
  const searchQuery =
    query && query.trim() !== "" ? query : searchParams.album || searchParams.artist || "";
  const fallbackData = {
    entity_id: entityId,
    search_query: searchQuery,
  };

  if (mediaType && mediaType !== "all") {
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
  if (
    item &&
    (item.is_ai_radio || item.media_content_type === "show" || item.media_class === "show")
  ) {
    return playAiRadioStation(hass, entityId, item.station_id || item.item_id);
  }
  return playMedia(hass, entityId, item.media_content_id, item.media_content_type);
}

// Check if a track is favorited in Music Assistant
export async function isTrackFavorited(
  hass,
  mediaContentId,
  entityId = null,
  trackName = null,
  artistName = null,
  searchResultsLimit = 20
) {
  if (!mediaContentId) {
    return false;
  }

  try {
    const configEntryId = await getMusicAssistantConfigEntryId(hass, entityId);
    if (!configEntryId) {
      return false;
    }

    // Use the provided entityId or try to find a Music Assistant entity
    let targetEntityId = entityId;
    if (!targetEntityId) {
      const states = Object.values(hass.states);
      const maEntity = states.find(
        (state) => isMusicAssistantEntity(state) && state.entity_id.startsWith("media_player.")
      );
      if (maEntity) {
        targetEntityId = maEntity.entity_id;
      } else {
        return false;
      }
    }

    // Strategy 1: Direct targeted item lookup by URI via mass_queue integration (O(1) local DB lookup)
    const mqConfigEntryId = await getMassQueueConfigEntryId(hass, targetEntityId);
    if (mqConfigEntryId && mediaContentId.includes("://")) {
      try {
        const trackMsg = {
          type: "call_service",
          domain: "mass_queue",
          service: "send_command",
          service_data: {
            command: "music/item_by_uri",
            data: { uri: mediaContentId },
            ...(mqConfigEntryId &&
              mqConfigEntryId !== "auto" && { config_entry_id: mqConfigEntryId }),
          },
          return_response: true,
        };
        const trackRes = await hass.connection.sendMessagePromise(trackMsg);
        const item = trackRes?.response?.response || trackRes?.response || trackRes?.result;
        if (item && typeof item === "object") {
          const fav =
            typeof item.favorite === "boolean"
              ? item.favorite
              : typeof item.is_favorite === "boolean"
                ? item.is_favorite
                : null;
          if (fav !== null) {
            return fav;
          }
        }
      } catch (e) {
        // Continue to fallback if mass_queue command fails
      }
    }

    // Strategy 2: Targeted query to MA local library database (no external API calls)
    if (trackName || mediaContentId) {
      try {
        const message = {
          type: "call_service",
          domain: "music_assistant",
          service: "get_library",
          service_data: /** @type {Record<string, any>} */ ({
            ...(configEntryId && configEntryId !== "auto" && { config_entry_id: configEntryId }),
            media_type: "track",
            favorite: true,
            ...(trackName && { search: trackName.trim() }),
          }),
          return_response: true,
        };
        const appliedLimit = resolveLimitValue(searchResultsLimit, { cap: 10 });
        if (appliedLimit !== undefined) {
          message.service_data.limit = appliedLimit;
        }

        const response = await hass.connection.sendMessagePromise(message);
        const favoriteTracks = response?.response?.items || response?.response || [];
        if (Array.isArray(favoriteTracks)) {
          const idPart = (mediaContentId.split("/").pop() || "").trim();
          return favoriteTracks.some(
            (track) =>
              track.uri === mediaContentId ||
              (track.item_id && mediaContentId.endsWith(`/${track.item_id}`)) ||
              (idPart && track.uri && track.uri.endsWith(`/${idPart}`))
          );
        }
      } catch (e) {
        // Ignore error
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}
