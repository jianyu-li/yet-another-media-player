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
  "aspect_ratio",
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

export {
  DEFAULT_PROGRESS_BAR_HEIGHT,
  DEFAULT_IDLE_TIMEOUT_MS,
  DEFAULT_VOLUME_STEP,
  TEMPLATE_CONFIGS,
  CARD_CONFIG_DEFAULTS,
  ENTITY_CONFIG_DEFAULTS,
  TEMPLATE_SUPPORTED_FIELDS,
  isFieldTemplateSupported,
  getTemplatePresetDefaults,
  normalizeCardConfig,
  normalizeEntityConfig,
} from "./config-schema.js";
