// Supported feature flags
export const SUPPORT_PAUSE = 1;
export const SUPPORT_SEEK = 2;
export const SUPPORT_VOLUME_SET = 4;
export const SUPPORT_VOLUME_MUTE = 8;
export const SUPPORT_PREVIOUS_TRACK = 16;
export const SUPPORT_NEXT_TRACK = 32;
export const SUPPORT_TURN_ON = 128;
export const SUPPORT_TURN_OFF = 256;
export const SUPPORT_PLAY_MEDIA = 512;
export const SUPPORT_STOP = 4096;
export const SUPPORT_PLAY = 16384;
export const SUPPORT_SHUFFLE = 32768;
export const SUPPORT_GROUPING = 524288;
export const SUPPORT_REPEAT_SET = 262144;

export const ARTWORK_OVERRIDE_MATCH_KEYS = Object.freeze([
  "media_title",
  "media_artist",
  "media_album_name",
  "media_content_id",
  "media_channel",
  "app_name",
  "media_content_type",
  "entity_id",
  "entity_state"
]);

export const DEFAULT_PROGRESS_BAR_HEIGHT = 6;

export const TEMPLATE_CONFIGS = Object.freeze({
  custom: {},
  large_modern: {
    match_theme: true,
    appearance: "automatic",
    control_layout: "modern",
    adaptive_controls: true,
    adaptive_text: true,
    artwork_object_fit: "cover",
    extend_artwork: true,
    show_chip_row: "in_menu_on_idle",
    hold_to_pin: true
  },
  crisp_clean: {
    match_theme: true,
    appearance: "automatic",
    artwork_object_fit: "scaled-contain-alternate",
    control_layout: "modern",
    adaptive_controls: true,
    hold_to_pin: true
  },
  minimal_mini: {
    match_theme: true,
    appearance: "automatic",
    always_collapsed: true,
    show_chip_row: "in_menu",
    details_alignment: "left",
    hold_to_pin: true
  },
  auto_compact: {
    match_theme: true,
    appearance: "automatic",
    collapse_on_idle: true,
    show_chip_row: "in_menu_on_idle",
    hold_to_pin: true
  },
  music_explorer: {
    match_theme: true,
    appearance: "automatic",
    idle_screen: "search",
    hide_search_headers_on_idle: true,
    search_view: "card",
    search_card_columns: 4,
    hold_to_pin: true
  },
  dedicated_search: {
    match_theme: true,
    appearance: "automatic",
    card_type: "search",
    search_view: "card",
    hide_menu_player: false,
    hold_to_pin: true
  },
  quick_and_easy: {
    match_theme: true,
    appearance: "automatic",
    always_show_quick_group: true,
    show_chip_row: "always",
    dismiss_search_on_play: true,
    show_volume_overlay: true,
    hold_to_pin: true
  },
  huge_yamp: {
    match_theme: true,
    appearance: "automatic",
    control_layout: "modern",
    adaptive_controls: true,
    adaptive_text: true,
    progress_bar_height: 48,
    display_timestamps: true,
    artwork_object_fit: "cover",
    extend_artwork: true,
    search_view: "card",
    search_card_columns: 2,
    show_volume_overlay: true
  }
});
