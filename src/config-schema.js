/**
 * Configuration schema and defaults for Yet Another Media Player (YAMP)
 *
 * Single source of truth for all card-level and entity-level configuration options,
 * default values, preset templates, and validation/normalization helpers.
 */

export const DEFAULT_PROGRESS_BAR_HEIGHT = 6;
export const DEFAULT_IDLE_TIMEOUT_MS = 60000;
export const DEFAULT_VOLUME_STEP = 0.05;

/**
 * Predefined card configuration presets
 */
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

/**
 * Card-level default values
 */
export const CARD_CONFIG_DEFAULTS = Object.freeze({
  template: "custom",
  appearance: "automatic",
  card_type: "standard",
  control_layout: "classic",
  volume_mode: "slider",
  volume_step: DEFAULT_VOLUME_STEP,
  hold_to_pin: false,
  show_chip_row: "always",
  idle_timeout_ms: DEFAULT_IDLE_TIMEOUT_MS,
  idle_screen: "default",
  artwork_object_fit: "cover",
  extend_artwork: false,
  blurred_artwork: false,
  hide_collapsed_artwork: false,
  match_theme: false,
  search_view: "card",
  search_card_columns: 2,
  search_results_sort: "play_count_desc",
  default_search_filter: "all",
  default_search_favorites: false,
  pin_search_headers: false,
  progress_bar_height: DEFAULT_PROGRESS_BAR_HEIGHT,
  display_timestamps: false,
  adaptive_controls: false,
  adaptive_text: false,
  details_alignment: "left",
  keep_filters_on_search: false,
  dismiss_search_on_play: false,
  disable_autofocus: false,
  show_volume_overlay: false,
  always_show_quick_group: false,
  always_collapsed: false,
  hide_menu_player: false,
  hide_active_entity_label: false,
  hide_active_entity_label_on_idle: false,
  swap_pause_for_stop: false,
});

/**
 * Entity-level default values
 */
export const ENTITY_CONFIG_DEFAULTS = Object.freeze({
  name: "",
  icon: "",
  prefer_ma_metadata: "",
  show_idle_artwork_when_not_playing: false,
  volume_mode: "slider",
  volume_step: DEFAULT_VOLUME_STEP,
  control_layout: "classic",
  progress_bar_height: DEFAULT_PROGRESS_BAR_HEIGHT,
});

/**
 * Set of configuration field names that support Jinja and JS templates
 */
export const TEMPLATE_SUPPORTED_FIELDS = Object.freeze(
  new Set([
    "card_height",
    "artwork_override",
    "name",
    "icon",
    "action_in_menu",
    "hide_controls",
    "lyrics",
    "title",
    "subtitle",
    "idle_artwork",
  ])
);

/**
 * Check if a configuration key supports templating
 * @param {string} fieldName
 * @returns {boolean}
 */
export function isFieldTemplateSupported(fieldName) {
  return TEMPLATE_SUPPORTED_FIELDS.has(fieldName);
}

/**
 * Get defaults for a specific template preset
 * @param {string} [templateName]
 * @returns {Record<string, any>}
 */
export function getTemplatePresetDefaults(templateName = "custom") {
  return TEMPLATE_CONFIGS[templateName] || {};
}

/**
 * Normalize and apply template presets & defaults to a raw card config
 * @param {Record<string, any>} rawConfig
 * @returns {Record<string, any>}
 */
export function normalizeCardConfig(rawConfig = {}) {
  const templateName = rawConfig.template || "custom";
  const templateBase = getTemplatePresetDefaults(templateName);
  return {
    ...CARD_CONFIG_DEFAULTS,
    ...templateBase,
    ...rawConfig,
  };
}

/**
 * Normalize an entity config entry (converts string ID to object with defaults)
 * @param {string | Record<string, any>} entry
 * @returns {Record<string, any>}
 */
export function normalizeEntityConfig(entry) {
  if (typeof entry === "string") {
    return {
      entity: entry,
      ...ENTITY_CONFIG_DEFAULTS,
    };
  }
  return {
    ...ENTITY_CONFIG_DEFAULTS,
    ...entry,
  };
}
