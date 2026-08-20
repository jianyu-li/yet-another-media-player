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

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  services: Record<string, Record<string, any>>;
  user: {
    id: string;
    name: string;
    is_admin: boolean;
    is_owner: boolean;
  };
  language: string;
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
    sendMessagePromise<T = any>(message: Record<string, any>): Promise<T>;
  };
  localize(key: string, ...args: any[]): string;
}

export interface ArtworkOverrideRule {
  match_key?: string;
  match_value?: string;
  url?: string;
  [key: string]: any;
}

export interface ActionConfig {
  action?:
    "call-service" | "navigate" | "url" | "more-info" | "toggle" | "none" | "custom" | string;
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
}

export type YampEntityEntry = string | YampEntityConfig;

export interface YampCardConfig {
  type: "custom:yet-another-media-player";
  template?: string;
  entities: YampEntityEntry[];
  card_height?: string;
  appearance?:
    "automatic" | "glassmorphism" | "minimal" | "flat" | "transparent" | "custom" | string;
  card_type?: "standard" | "search" | "group_players" | string;
  control_layout?: "classic" | "modern" | "stacked" | string;
  volume_mode?: "slider" | "stepper" | "buttons" | "none" | string;
  volume_step?: number;
  hold_to_pin?: boolean;
  show_chip_row?: "always" | "in_menu" | "in_menu_on_idle" | "never" | "auto" | string;
  idle_timeout_ms?: number;
  idle_screen?: "default" | "artwork" | "blank" | "collapsed" | "transparent" | string;
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
  [key: string]: any;
}

export interface TemplateContext {
  is_playing: boolean;
  is_idle: boolean;
  is_paused: boolean;
  is_off: boolean;
  current: HassEntity | null;
  current_entity: HassEntity | null;
  activeEntity: string;
  selectedIndex: number;
  hass: HomeAssistant;
  config: YampCardConfig;
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
  time: number;
  text: string;
}
