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
  "entity_state",
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
    hold_to_pin: true,
    pin_search_headers: true,
    progress_bar_height: 16,
    search_view: "card",
    search_card_columns: 3,
    display_timestamps: true,
    details_alignment: "left",
  },
  crisp_clean: {
    match_theme: true,
    volume_mode: "stepper",
    hold_to_pin: true,
    volume_step: 0.05,
    show_chip_row: "in_menu",
    extend_artwork: true,
    search_results_sort: "play_count_desc",
    control_layout: "modern",
    dismiss_search_on_play: true,
    keep_filters_on_search: false,
    display_timestamps: true,
    search_view: "list",
    default_search_filter: "all",
    default_search_favorites: true,
    appearance: "automatic",
    details_alignment: "center",
    artwork_object_fit: "scaled-contain-alternate",
    progress_bar_height: 2,
  },
  minimal_mini: {
    match_theme: true,
    appearance: "automatic",
    always_collapsed: true,
    show_chip_row: "in_menu",
    details_alignment: "left",
    hold_to_pin: true,
    progress_bar_height: 2,
    volume_mode: "stepper",
    extend_artwork: true,
    blurred_artwork: true,
    hide_collapsed_artwork: true,
  },
  normal_mini: {
    match_theme: true,
    appearance: "automatic",
    always_collapsed: true,
    show_chip_row: "auto",
    details_alignment: "left",
    hold_to_pin: true,
    progress_bar_height: 2,
    volume_mode: "slider",
    extend_artwork: true,
    blurred_artwork: true,
  },
  dedicated_search: {
    match_theme: true,
    appearance: "automatic",
    card_type: "search",
    search_view: "card",
    hide_menu_player: true,
    hold_to_pin: true,
    show_chip_row: "in_menu",
    disable_autofocus: true,
  },
  dedicated_grouping: {
    match_theme: true,
    appearance: "automatic",
    card_type: "group_players",
    hide_menu_player: true,
    show_chip_row: "in_menu",
  },
  quick_and_easy: {
    match_theme: true,
    appearance: "automatic",
    always_show_quick_group: true,
    show_chip_row: "always",
    dismiss_search_on_play: true,
    extend_artwork: true,
    show_volume_overlay: true,
    hold_to_pin: true,
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
    show_volume_overlay: true,
  },
});
