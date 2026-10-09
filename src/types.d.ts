/**
 * TypeScript definitions for Yet Another Media Player (YAMP)
 *
 * Provides type contracts and schemas for Home Assistant entities,
 * YAMP card configuration, per-player configuration, template contexts,
 * and Music Assistant data structures.
 */

export interface HassServiceTarget {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
}

export interface HassEntityAttributeBase {
  friendly_name?: string;
  icon?: string;
  entity_picture?: string;
  supported_features?: number;
  [key: string]: any;
}

export interface MediaPlayerEntityAttributes extends HassEntityAttributeBase {
  media_title?: string;
  media_artist?: string;
  media_album_name?: string;
  media_album_artist?: string;
  media_track?: number;
  media_series_title?: string;
  media_season?: string | number;
  media_episode?: string | number;
  media_channel?: string;
  media_playlist?: string;
  media_content_id?: string;
  media_content_type?: string;
  media_duration?: number;
  media_position?: number;
  media_position_updated_at?: string;
  app_name?: string;
  app_id?: string;
  entity_picture_local?: string;
  is_volume_muted?: boolean;
  volume_level?: number;
  sound_mode?: string;
  sound_mode_list?: string[];
  source?: string;
  source_list?: string[];
  shuffle?: boolean;
  repeat?: "off" | "one" | "all" | string;
  group_members?: string[];
  mass_player_type?: string;
  mass_queue_id?: string;
  active_queue?: string;
}

export interface HassEntity {
  entity_id: string;
  state:
    "playing" | "paused" | "idle" | "off" | "on" | "unavailable" | "unknown" | "buffering" | string;
  attributes: MediaPlayerEntityAttributes & Record<string, any>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id?: string | null;
    user_id?: string | null;
  };
}

export interface DeviceRegistryEntry {
  id: string;
  config_entry_id?: string | null;
  config_subentry_id?: string | null;
  config_entries?: string[];
  parent_device_id?: string | null;
  area_id?: string | null;
  name?: string | null;
  name_by_user?: string | null;
  disabled_by?: string | null;
  labels?: string[];
  identifiers?: [string, string][];
  [key: string]: any;
}

export interface EntityRegistryEntry {
  id: string;
  entity_id: string;
  platform?: string;
  config_entry_id?: string | null;
  device_id?: string | null;
  area_id?: string | null;
  disabled_by?: string | null;
  hidden_by?: string | null;
  [key: string]: any;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  services: Record<string, Record<string, any>>;
  entities?: Record<string, EntityRegistryEntry>;
  devices?: Record<string, DeviceRegistryEntry>;
  user: {
    id: string;
    name: string;
    is_admin: boolean;
    is_owner: boolean;
  };
  language: string;
  selectedLanguage?: string | null;
  locale: {
    language: string;
    number_format?: string;
    time_format?: string;
    date_format?: string;
    first_weekday?: number;
  };
  themes: {
    default_theme: string;
    default_dark_theme?: string | null;
    themes: Record<string, Record<string, any>>;
    darkMode?: boolean;
  };
  selectedTheme?: string | null;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
    target?: HassServiceTarget
  ): Promise<any>;
  callWS<T = any>(msg: Record<string, any>): Promise<T>;
  connection: {
    subscribeMessage<T = any>(
      callback: (msg: T) => void,
      params: Record<string, any>
    ): Promise<() => Promise<void>>;
    subscribeEvents<T = any>(
      callback: (event: T) => void,
      eventType?: string
    ): Promise<() => Promise<void> | void>;
    sendMessagePromise<T = any>(message: Record<string, any>): Promise<T>;
    [key: string]: any;
  };
  localize(key: string, ...args: any[]): string;
  formatEntityName?: (
    stateObj: HassEntity,
    name?:
      | { type: "entity" | "device" | "parent_device" | "area" | "floor" }
      | { type: "text"; text: string }
      | Array<
          | { type: "entity" | "device" | "parent_device" | "area" | "floor" }
          | { type: "text"; text: string }
        >
  ) => string | undefined;
}

export interface ArtworkObject {
  url?: string | null;
  sizePercentage?: number | null;
  objectFit?: string | null;
  objectPosition?: string | null;
}

export interface ArtworkOverrideRule {
  match_key?: string;
  match_value?: string;
  url?: string;
  [key: string]: any;
}

export interface ActionConfig {
  action?:
    | "call-service"
    | "navigate"
    | "url"
    | "more-info"
    | "toggle"
    | "none"
    | "custom"
    | "toggle_lyrics"
    | "remote_control"
    | "prev_entity"
    | "next_entity"
    | "select_entity"
    | "sync_selected_entity"
    | "toggle_media_session"
    | "toggle_lock_screen_controls"
    | "full_screen"
    | "toggle_full_screen"
    | string;
  service?: string;
  service_data?: Record<string, any>;
  data?: Record<string, any>;
  target?: HassServiceTarget;
  navigation_path?: string;
  url_path?: string;
  icon?: string;
  name?: string;
  label?: string;
  placement?:
    | "chip"
    | "menu"
    | "hidden"
    | "replace_search"
    | "replace_power"
    | "replace_mute"
    | "replace_favorite"
    | string;
  in_menu?: boolean | "hidden" | string;
  alignment?: "left" | "right";
  hide_inactive?: boolean;
}

export interface CustomChipConfig {
  icon?: string;
  name?: string;
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  badge?: string;
  badge_color?: string;
  color?: string;
}

export interface ShortcutConfig {
  icon?: string;
  name?: string;
  action?: ActionConfig;
  service?: string;
  service_data?: Record<string, any>;
}

export interface YampEntityConfig {
  entity: string;
  entity_id?: string;
  name?: string;
  icon?: string;
  artwork_override?: string | ArtworkOverrideRule[];
  hide_controls?: string[] | string;
  prefer_ma_metadata?: string;
  custom_actions?: ActionConfig[];
  custom_chips?: CustomChipConfig[];
  shortcuts?: ShortcutConfig[];
  show_idle_artwork_when_not_playing?: boolean;
  volume_mode?: "slider" | "stepper" | "buttons" | "none";
  volume_step?: number;
  control_layout?: "classic" | "modern" | "stacked";
  progress_bar_height?: number;
  lyrics?: boolean | string;
  hidden_controls?: string[] | string;
  hidden_filter_chips?: string[];
  hide_remote_buttons?: string[] | string;
  hidden_menu_options?: string[] | string;
  hide_menu_options?: string[] | string;
}

export type YampEntityEntry = string | YampEntityConfig;

export interface YampCardConfig {
  type: "custom:yet-another-media-player";
  hidden_menu_options?: string[] | string;
  hide_menu_options?: string[] | string;
  template?: string;
  entities: YampEntityEntry[];
  card_height?: string;
  appearance?:
    "automatic" | "glassmorphism" | "minimal" | "flat" | "transparent" | "custom" | string;
  card_type?: "standard" | "search" | "group_players" | "speakers_and_groups" | string;
  control_layout?: "classic" | "modern" | "stacked" | string;
  volume_mode?: "slider" | "stepper" | "buttons" | "none" | string;
  volume_step?: number;
  hold_to_pin?: boolean;
  show_chip_row?: "always" | "in_menu" | "in_menu_on_idle" | "never" | "auto" | string;
  idle_timeout_ms?: number;
  idle_screen?: "default" | "artwork" | "blank" | "collapsed" | "transparent" | string;
  idle_image?: string;
  background_image?: string;
  font_color?: string;
  background_position?: "top center" | "center center" | "bottom center" | string;
  background_fit?: "cover" | "contain" | "fill" | "scale-down" | "none" | string;
  media_artwork_overrides?: ArtworkOverrideRule[];
  artwork_position?: "top center" | "center center" | "bottom center" | string;
  artwork_object_fit?:
    | "cover"
    | "contain"
    | "fill"
    | "scale-down"
    | "none"
    | "scaled-contain"
    | "scaled-contain-alternate"
    | "no_artwork"
    | string;
  extend_artwork?: boolean;
  blurred_artwork?: boolean;
  hide_collapsed_artwork?: boolean;
  disable_artwork_gradient?: boolean;
  match_theme?: boolean;
  search_view?: "card" | "list" | string;
  search_card_columns?: number;
  search_results_sort?: "play_count_desc" | "name_asc" | "recent" | string;
  default_search_filter?: "all" | "tracks" | "artists" | "albums" | "playlists" | "radio" | string;
  default_search_favorites?: boolean;
  pin_search_headers?: boolean;
  progress_bar_height?: number;
  display_timestamps?: boolean;
  adaptive_controls?: boolean;
  adaptive_text?: boolean;
  details_alignment?: "left" | "center" | "right" | string;
  keep_filters_on_search?: boolean;
  dismiss_search_on_play?: boolean;
  disable_autofocus?: boolean;
  show_volume_overlay?: boolean;
  always_show_quick_group?: boolean;
  always_collapsed?: boolean;
  hide_menu_player?: boolean;
  hide_active_entity_label?: boolean;
  hide_active_entity_label_on_idle?: boolean;
  swap_pause_for_stop?: boolean;
  show_album?: boolean;
  lyrics_background_fade?: number | string;
  lock_screen_controls?: boolean | string;
  full_screen?: boolean | string;
  [key: string]: any;
}

export interface TemplateContext {
  is_playing: boolean;
  is_idle: boolean;
  is_paused?: boolean;
  is_off?: boolean;
  is_search?: boolean;
  is_grouping?: boolean;
  is_speakers_and_groups?: boolean;
  is_group_players?: boolean;
  is_source?: boolean;
  is_lyrics?: boolean;
  is_options?: boolean;
  is_transfer_queue?: boolean;
  is_any_menu_open?: boolean;
  is_fullscreen?: boolean;
  is_full_screen?: boolean;
  is_dark_mode: boolean;
  is_mobile: boolean;
  is_music_assistant: boolean;
  is_music: boolean;
  entity?: string;
  current: HassEntity | string | null;
  current_entity?: HassEntity | null;
  activeEntity?: string;
  selectedIndex?: number;
  hass?: HomeAssistant;
  config?: YampCardConfig;
}

export interface MusicAssistantItem {
  item_id?: string | number;
  provider?: string;
  name: string;
  artist?: string;
  album?: string;
  uri?: string;
  media_type?: "track" | "artist" | "album" | "playlist" | "radio" | string;
  image?: string;
  favorite?: boolean;
  duration?: number;
  [key: string]: any;
}

export interface LyricsLine {
  time: number | null;
  text: string;
  isInstrumental?: boolean;
}

export function getEntityName(
  hass?: HomeAssistant | null,
  stateOrEntityId?: HassEntity | string | null
): string;

export interface TemplateResolveCacheEntry<T = string> {
  id?: string;
  value?: T;
  ts: number;
}

export interface TemplateValueEntry<T = string> {
  template: string;
  resolved: T | null;
}

export declare class TemplateController {
  constructor(host: any);
  host: any;
  templateSubscriptions: Record<string, Function | symbol>;
  activeSubscriptionTokens: Record<string, symbol>;
  compiledJsTemplates: Record<string, Function>;
  maTemplateValues: Record<string | number, TemplateValueEntry>;
  maResolveCache: Record<number, TemplateResolveCacheEntry>;
  volTemplateValues: Record<string | number, TemplateValueEntry>;
  volResolveCache: Record<number, TemplateResolveCacheEntry>;
  remoteTemplateValues: Record<string | number, TemplateValueEntry>;
  remoteResolveCache: Record<number, TemplateResolveCacheEntry>;
  hiddenControlsTemplateValues: Record<string | number, TemplateValueEntry<any>>;
  hiddenControlsResolveCache: Record<number, TemplateResolveCacheEntry<any>>;
  actionInMenuTemplateValues: Record<string | number, TemplateValueEntry>;
  actionInMenuResolveCache: Record<number, TemplateResolveCacheEntry>;
  alwaysCollapsedTemplateValue: Record<string, TemplateValueEntry>;
  alwaysCollapsedResolveCache: Record<string, TemplateResolveCacheEntry<string | boolean>>;
  controlLayoutTemplateValue: Record<string, TemplateValueEntry>;
  controlLayoutResolveCache: Record<string, TemplateResolveCacheEntry>;
  cardHeightTemplateValue: Record<string, TemplateValueEntry>;
  cardHeightResolveCache: Record<string, TemplateResolveCacheEntry<string | number>>;
  lyricsBackgroundFadeTemplateValue: Record<string, TemplateValueEntry>;
  lyricsBackgroundFadeResolveCache: Record<string, TemplateResolveCacheEntry<string | number>>;
  lockScreenControlsTemplateValue: Record<string, TemplateValueEntry>;
  lockScreenControlsResolveCache: Record<string, TemplateResolveCacheEntry<string | boolean>>;
  fullScreenTemplateValue: Record<string, TemplateValueEntry>;
  fullScreenResolveCache: Record<string, TemplateResolveCacheEntry<string | boolean>>;
  contextKeyMap: Record<string, string>;
  hostConnected(): void;
  hostDisconnected(): void;
  subscribeToTemplate(idx: number | string, type: string, templateString: string): void;
  unsubscribeFromTemplate(idx: number | string, type: string): void;
  unsubscribeAll(): void;
  evaluateJsTemplate(templateStr: string): any;
  ensureResolvedTemplateForIndex(
    idx: number,
    typeKey: string,
    rawValue: any,
    options?: { allowObject?: boolean; cacheStaticString?: boolean },
    customCacheObj?: Record<string | number, any> | null,
    customTemplateValsObj?: Record<string | number, any> | null
  ): Promise<void>;
  ensureResolvedMaForIndex(idx: number): Promise<void>;
  ensureResolvedVolForIndex(idx: number): Promise<void>;
  ensureResolvedRemoteForIndex(idx: number): Promise<void>;
  ensureResolvedHiddenControlsForIndex(idx: number): Promise<void>;
  syncTemplateSubscriptions(type: string, currentContext: string, rawConfigData: any): void;
  syncEntityTemplateSubscriptions(
    typeKey: string,
    currentContext: string,
    customEntityObjs?: any[]
  ): void;
  resolveEntity(
    entityTemplate?: string | null,
    fallbackEntityId?: string | null,
    idx?: number,
    cacheType?: string
  ): string | null;
  resolveTemplateAtActionTime(templateString: string, fallbackEntityId?: string): Promise<string>;
}

export declare function cleanTrackMetadata(text?: any): string;

export declare function getActiveLyricIndex(
  lyrics: LyricsLine[] | null | undefined,
  position: number,
  preRoll?: number,
  mode?: string
): number;

export declare class LyricsController {
  constructor(host: any);
  host: any;
  lyrics: LyricsLine[];
  loading: boolean;
  error: boolean;
  active: boolean;
  cache: Map<string, LyricsLine[]>;
  lastTrackId: string | null;
  lastArtist: string | null;
  lastTitle: string | null;
  lastEntityId: string | null;
  fetchTimeout: any;
  currentFetchToken: symbol | null;
  fetchingCacheKey: string | null;
  get fetching(): boolean;
  set fetching(val: boolean);
  hostConnected(): void;
  hostDisconnected(): void;
  toggle(forceState?: boolean): boolean;
  checkTrackLyrics(): void;
  fetchLyrics(): Promise<void>;
  getMassLyrics(activeState: any, fetchToken: symbol): Promise<LyricsLine[]>;
  getLrclibLyrics(
    artist?: string | null,
    title?: string | null,
    album?: string | null,
    duration?: number | null,
    fetchToken?: symbol
  ): Promise<LyricsLine[]>;
}

export declare const MAX_ASPECT_RATIO_CACHE_SIZE: number;

export declare class ArtworkController {
  host: YetAnotherMediaPlayerCard;
  aspectRatioCache: Record<string, number | null>;
  artworkOverrideIndexMap: WeakMap<object, number> | null;
  artworkOverrideTemplateCache: Record<string, { value: string | null; resolving: boolean }>;
  lastArtworkUrl: string | null;
  constructor(host: YetAnotherMediaPlayerCard);
  hostConnected(): void;
  hostDisconnected(): void;
  resetCaches(): void;
  ensureArtworkOverrideIndexMap(): void;
  _setAspectRatio(url: string, ratio: number | null): void;
  getArtworkOverrideCacheKey(override: any, type?: string, stateObj?: HassEntity | null): string;
  getResolvedArtworkOverrideSource(
    override: any,
    sourceValue: string,
    type?: string,
    stateObj?: HassEntity | null
  ): string | null;
  getCollapsedArtworkStyle(): string;
  getArtworkUrl(
    state?: HassEntity | null,
    forceIdleImage?: boolean,
    ignoreIdleImage?: boolean
  ): ArtworkObject | null;
  resolveSelectedArtwork(options: any): ArtworkObject | null;
  getBackgroundSizeForFit(fit?: string): string;
  isExternalImageUrl(url?: string): boolean;
  extractDominantColor(imgUrl: string): Promise<string>;
  updateArtworkAspectRatios(): void;
  calculateAspectRatio(url?: string): void;
  normalizeImageSourceValue(value: any): string;
  resolveImageUrlFromInput(input: string): string | null;
  updateHostArtworkStyles(
    host: HTMLElement,
    playbackStateObj?: HassEntity | null,
    forceIdleImage?: boolean
  ): void;
  getMaxCollapsedArtworkWidth(cardWidth: number): number;
  compileArtworkOverrides(overrides?: any): any[];
}

export function getMaxCollapsedArtworkWidth(cardWidth: number): number;
export function getBackgroundSizeForFit(fit?: string): string;
export function isExternalImageUrl(url?: string): boolean;
export function normalizeImageSourceValue(value: any): string;
export function resolveImageUrlFromInput(input: string, hass?: any): string | null;
export function compileArtworkOverrides(overrides?: any): any[];

export declare class QueueController {
  host: YetAnotherMediaPlayerCard;
  massQueueAvailable: boolean;
  hasMassQueueIntegration: boolean | null;
  checkingMassQueueIntegration: boolean;
  queueOperationPromise: Promise<void>;
  queueOpsTotal: number;
  queueOpsCompleted: number;
  queueOpsTimeout: any;
  queueRefreshTimer: any;
  queueEventSubscription: any;
  showTransferQueue: boolean;
  transferQueuePendingTarget: string | null;
  transferQueueStatus: { type: string; message: string } | null;
  hasTransferQueueForCurrent: boolean;
  transferQueueAutoCloseTimer: any;
  constructor(host: YetAnotherMediaPlayerCard);
  hostConnected(): void;
  hostDisconnected(): void;
  isMassQueueIntegrationAvailable(hass?: HomeAssistant): Promise<boolean>;
  getUpcomingQueue(hass?: HomeAssistant, entityId?: string, limit?: number): Promise<any>;
  getUpcomingQueueWithMassQueue(
    hass?: HomeAssistant,
    entityId?: string,
    limit?: number
  ): Promise<any>;
  getUpcomingQueueOriginal(hass?: HomeAssistant, entityId?: string, limit?: number): Promise<any>;
  getRecommendations(
    hass?: HomeAssistant,
    entityId?: string,
    mediaType?: string | null,
    limit?: number
  ): Promise<any>;
  fetchMassQueueTracks(uri: string, serviceName: string): Promise<any[] | null>;
  setSearchResultsFromMassQueue(tracks: any[], queryName: string): void;
  enqueueQueueOperation(operationFn: () => Promise<void>): void;
  moveQueueItemUp(queueItemId: string): Promise<void>;
  moveQueueItemDown(queueItemId: string): Promise<void>;
  moveQueueItemNext(queueItemId: string): Promise<void>;
  removeQueueItem(queueItemId: string): Promise<void>;
  onQueueItemMoved(e: { detail: { oldIndex: number; newIndex: number } }): Promise<void>;
  moveQueueItemInUI(queueItemId: string, direction: string): void;
  moveQueueItemInUIByIndex(oldIndex: number, newIndex: number): void;
  advanceQueueInUI(queueItemId?: string | null, isManual?: boolean): void;
  removeQueueItemFromUI(queueItemId: string): void;
  showQueueError(message: string): void;
  refreshQueue(options?: { delayMs?: number }): void;
  subscribeToQueueUpdates(): Promise<void>;
  unsubscribeFromQueueUpdates(): void;
  hasQueueInState(maState: any): boolean;
  getTransferQueueTargets(): any[];
  updateTransferQueueAvailability(options?: { refresh?: boolean }): Promise<boolean>;
  canShowTransferQueueOption(): boolean;
  openTransferQueue(): void;
  closeTransferQueue(): void;
  isTargetMusicAssistant(target?: any): boolean;
  transferQueueTo(target: any): Promise<void>;
  buildTransferQueuePayload(sourceId: string, targetId: string): Record<string, string>;
  isMusicAssistantEntity(): boolean;
  queueMediaFromSearch(item: any): Promise<void>;
}

export function checkMassQueueServices(services: any): boolean;
export function calculateQueueMovePlan(
  oldIndex: number,
  newIndex: number
): { strategy: string; steps: Array<{ service: string }> };
export function transformMassQueueItems(
  queueItems: any[],
  currentTrackId?: string | null,
  limitAfter?: number
): any[];
export function transformQueueNextItem(queueData: any): any[];
export function normalizeRecommendations(
  payload: any,
  entityId?: string,
  mediaType?: string | null,
  maxItems?: number
): any[];
export function buildTransferQueuePayload(
  sourceId: string,
  targetId: string,
  serviceMeta?: any
): Record<string, string>;
export function hasQueueInState(maState: any, cachedUpcoming?: any[] | null): boolean;

export function mediaPlay(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function mediaPause(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function mediaPlayPause(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function mediaStop(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function mediaNextTrack(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function mediaPreviousTrack(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function mediaSeek(
  hass?: HomeAssistant,
  entityId?: string,
  seekPosition?: number
): Promise<any>;
export function setShuffle(hass?: HomeAssistant, entityId?: string, shuffle?: any): Promise<any>;
export function setRepeat(hass?: HomeAssistant, entityId?: string, repeat?: string): Promise<any>;
export function selectSource(
  hass?: HomeAssistant,
  entityId?: string,
  source?: string
): Promise<any>;
export function selectSoundMode(
  hass?: HomeAssistant,
  entityId?: string,
  soundMode?: string
): Promise<any>;
export function playMedia(
  hass?: HomeAssistant,
  entityId?: string,
  mediaContentId?: string,
  mediaContentType?: string,
  enqueue?: string
): Promise<any>;
export function turnOn(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function turnOff(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function togglePower(
  hass?: HomeAssistant,
  entityId?: string,
  currentState?: string
): Promise<any>;
export function mediaToggle(hass?: HomeAssistant, entityId?: string): Promise<any>;
export function setVolume(
  hass?: HomeAssistant,
  entityId?: string,
  volumeLevel?: number | string
): Promise<any>;
export function stepVolume(
  hass?: HomeAssistant,
  entityId?: string,
  currentVolume?: number | string,
  step?: number | string
): Promise<any>;
export function setMute(hass?: HomeAssistant, entityId?: string, isVolumeMuted?: any): Promise<any>;
export function sendRemoteCommand(
  hass?: HomeAssistant,
  entityId?: string,
  command?: string | string[]
): Promise<any>;
export function sendRemoteVolumeStep(
  hass?: HomeAssistant,
  entityId?: string,
  direction?: number
): Promise<any>;
export function joinPlayers(
  hass?: HomeAssistant,
  masterEntityId?: string,
  groupMembers?: string | string[]
): Promise<any>;
export function unjoinPlayer(hass?: HomeAssistant, entityId?: string): Promise<any>;

export interface GroupPlayerState {
  isGroupable: boolean;
  isBusy: boolean;
  busyLabel: string;
  grouped: boolean;
  isPrimary?: boolean;
  disabled?: boolean;
  entityToCheck?: string | null;
  tooltip?: string;
}

export interface YetAnotherMediaPlayerCard {
  hass?: HomeAssistant;
  entityIds?: string[];
  currentEntityId?: string;
  config?: YampCardConfig;
  _config?: YampCardConfig;
  templateController?: TemplateController;
  lyricsController?: LyricsController;
  artworkController?: ArtworkController;
  _artworkController?: ArtworkController;
  queueController?: QueueController;
  _queueController?: QueueController;
  _isFullScreen?: boolean;
  _fullScreenOverride?: boolean | null;
  _toggleFullScreen?: () => void;
  _enterFullScreen?: () => void;
  _exitFullScreen?: () => void;
  _cachedEntityIds?: string[] | null;
  _cachedEntityObjs?: any[] | null;
  _actionHelperEntities?: string[] | null;
  _jsTemplateEntities?: string[] | null;
  _handleVisibilityChangeBound?: () => void;
  _getHiddenMenuOptions?: (idx?: number) => string[];
  _isMenuOptionHidden?: (optionKey: string, idx?: number) => boolean;
  _isMenuActionHidden?: (action: any, idx?: number) => boolean;
  _getGroupPlayerState?: (
    targetId: string,
    activeId?: string | null,
    activeGroupKey?: string | null,
    masterState?: any,
    myGroupKey?: string | null
  ) => GroupPlayerState;
  shouldUpdate?: (changedProps: Map<string | number | symbol, unknown>) => boolean;
  requestUpdate?: (name?: PropertyKey, oldValue?: unknown) => Promise<unknown>;
  [key: string]: any;
}

export interface YetAnotherMediaPlayerEditor {
  hass?: HomeAssistant;
  _config?: YampCardConfig;
  _yamlConfig?: any;
  _actionEditorIndex?: number | null;
  _entityEditorIndex?: number | null;
  _actionMode?: string | null;
  _addAction?: () => void;
  _onEditAction?: (index: number) => void;
  _onBackFromActionEditor?: () => void;
  requestUpdate?: (name?: PropertyKey, oldValue?: unknown) => Promise<unknown>;
  [key: string]: any;
}

declare global {
  const __VERSION__: string;
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
      getEntitySuggestion?: (hass?: any, entityId?: any) => any;
      [key: string]: any;
    }>;
  }
}
