import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PROGRESS_BAR_HEIGHT,
  DEFAULT_IDLE_TIMEOUT_MS,
  DEFAULT_VOLUME_STEP,
  DEFAULT_LYRICS_BACKGROUND_FADE,
  CARD_CONFIG_DEFAULTS,
  ENTITY_CONFIG_DEFAULTS,
  TEMPLATE_CONFIGS,
  TEMPLATE_SUPPORTED_FIELDS,
  isFieldTemplateSupported,
  getTemplatePresetDefaults,
  normalizeCardConfig,
  normalizeEntityConfig,
} from "../src/config-schema.js";

describe("config-schema", () => {
  describe("Numeric Defaults & Constants", () => {
    it("exports expected standard constant values", () => {
      assert.equal(DEFAULT_PROGRESS_BAR_HEIGHT, 6);
      assert.equal(DEFAULT_IDLE_TIMEOUT_MS, 60000);
      assert.equal(DEFAULT_VOLUME_STEP, 0.05);
      assert.equal(DEFAULT_LYRICS_BACKGROUND_FADE, 75);
    });
  });

  describe("CARD_CONFIG_DEFAULTS", () => {
    it("is frozen to prevent accidental mutation", () => {
      assert.equal(Object.isFrozen(CARD_CONFIG_DEFAULTS), true);
    });

    it("defines baseline card-level configuration values", () => {
      assert.equal(CARD_CONFIG_DEFAULTS.template, "custom");
      assert.equal(CARD_CONFIG_DEFAULTS.appearance, "automatic");
      assert.equal(CARD_CONFIG_DEFAULTS.card_type, "standard");
      assert.equal(CARD_CONFIG_DEFAULTS.control_layout, "classic");
      assert.equal(CARD_CONFIG_DEFAULTS.volume_mode, "slider");
      assert.equal(CARD_CONFIG_DEFAULTS.volume_step, 0.05);
      assert.equal(CARD_CONFIG_DEFAULTS.progress_bar_height, 6);
      assert.equal(CARD_CONFIG_DEFAULTS.hold_to_pin, false);
      assert.equal(CARD_CONFIG_DEFAULTS.match_theme, false);
      assert.equal(CARD_CONFIG_DEFAULTS.show_album, true);
      assert.equal(CARD_CONFIG_DEFAULTS.full_screen, false);
    });
  });

  describe("ENTITY_CONFIG_DEFAULTS", () => {
    it("is frozen to prevent accidental mutation", () => {
      assert.equal(Object.isFrozen(ENTITY_CONFIG_DEFAULTS), true);
    });

    it("defines baseline entity-level configuration values", () => {
      assert.equal(ENTITY_CONFIG_DEFAULTS.name, "");
      assert.equal(ENTITY_CONFIG_DEFAULTS.icon, "");
      assert.equal(ENTITY_CONFIG_DEFAULTS.show_idle_artwork_when_not_playing, false);
      assert.equal(ENTITY_CONFIG_DEFAULTS.volume_mode, "slider");
      assert.equal(ENTITY_CONFIG_DEFAULTS.volume_step, 0.05);
      assert.equal(ENTITY_CONFIG_DEFAULTS.control_layout, "classic");
      assert.equal(ENTITY_CONFIG_DEFAULTS.progress_bar_height, 6);
    });
  });

  describe("TEMPLATE_CONFIGS (Presets)", () => {
    it("is frozen to prevent accidental mutation", () => {
      assert.equal(Object.isFrozen(TEMPLATE_CONFIGS), true);
    });

    it("includes all defined presets with expected properties", () => {
      const presets = [
        "custom",
        "large_modern",
        "crisp_clean",
        "minimal_mini",
        "normal_mini",
        "dedicated_search",
        "dedicated_grouping",
        "quick_and_easy",
        "huge_yamp",
      ];
      presets.forEach((preset) => {
        assert.ok(preset in TEMPLATE_CONFIGS, `Missing preset: ${preset}`);
      });

      // Verify specific preset traits
      assert.deepEqual(TEMPLATE_CONFIGS.custom, {});
      assert.equal(TEMPLATE_CONFIGS.large_modern.control_layout, "modern");
      assert.equal(TEMPLATE_CONFIGS.crisp_clean.volume_mode, "stepper");
      assert.equal(TEMPLATE_CONFIGS.minimal_mini.always_collapsed, true);
      assert.equal(TEMPLATE_CONFIGS.dedicated_search.card_type, "search");
      assert.equal(TEMPLATE_CONFIGS.dedicated_grouping.card_type, "group_players");
      assert.equal(TEMPLATE_CONFIGS.quick_and_easy.always_show_quick_group, true);
      assert.equal(TEMPLATE_CONFIGS.huge_yamp.progress_bar_height, 48);
    });

    it("automatically validates all configured presets in TEMPLATE_CONFIGS without manual test updates", () => {
      const presetKeys = Object.keys(TEMPLATE_CONFIGS);
      assert.ok(presetKeys.length >= 9, "Expected at least 9 presets configured");

      for (const presetName of presetKeys) {
        const preset = TEMPLATE_CONFIGS[presetName];
        assert.ok(
          typeof preset === "object" && preset !== null,
          `Preset '${presetName}' must be a non-null object`
        );

        // Verify getTemplatePresetDefaults returns this preset
        const defaults = getTemplatePresetDefaults(presetName);
        assert.deepEqual(defaults, preset, `getTemplatePresetDefaults failed for '${presetName}'`);

        // Verify normalizeCardConfig cleanly merges this preset without throwing
        const normalized = normalizeCardConfig({ template: presetName });
        assert.equal(normalized.template, presetName);

        // Verify every key defined in the preset is cascaded into the normalized config
        for (const [k, v] of Object.entries(preset)) {
          assert.deepEqual(
            normalized[k],
            v,
            `Normalized config should contain preset property '${k}' for '${presetName}'`
          );
        }
      }
    });
  });

  describe("TEMPLATE_SUPPORTED_FIELDS & isFieldTemplateSupported", () => {
    it("is a frozen Set containing all valid templated fields", () => {
      assert.ok(TEMPLATE_SUPPORTED_FIELDS instanceof Set);
      assert.equal(Object.isFrozen(TEMPLATE_SUPPORTED_FIELDS), true);
      const expectedFields = [
        "card_height",
        "artwork_override",
        "name",
        "icon",
        "action_in_menu",
        "placement",
        "hide_controls",
        "lyrics",
        "title",
        "subtitle",
        "idle_artwork",
        "idle_image",
        "background_image",
        "font_color",
        "lyrics_background_fade",
        "lock_screen_controls",
        "full_screen",
      ];
      expectedFields.forEach((field) => {
        assert.ok(TEMPLATE_SUPPORTED_FIELDS.has(field), `Field should support templates: ${field}`);
      });
    });

    it("automatically validates that every field in TEMPLATE_SUPPORTED_FIELDS returns true from isFieldTemplateSupported", () => {
      assert.ok(TEMPLATE_SUPPORTED_FIELDS.size >= 16);
      for (const field of TEMPLATE_SUPPORTED_FIELDS) {
        assert.equal(
          isFieldTemplateSupported(field),
          true,
          `Expected isFieldTemplateSupported('${field}') to return true`
        );
      }
    });

    it("correctly identifies template-supported and non-supported fields", () => {
      assert.equal(isFieldTemplateSupported("card_height"), true);
      assert.equal(isFieldTemplateSupported("icon"), true);
      assert.equal(isFieldTemplateSupported("lyrics"), true);
      assert.equal(isFieldTemplateSupported("idle_image"), true);
      assert.equal(isFieldTemplateSupported("volume_step"), false);
      assert.equal(isFieldTemplateSupported("entities"), false);
      assert.equal(isFieldTemplateSupported("template"), false);
      assert.equal(isFieldTemplateSupported("hidden_menu_options"), false);
      assert.equal(isFieldTemplateSupported("hide_menu_options"), false);
    });

    it("returns false for invalid, null, or empty field names", () => {
      assert.equal(isFieldTemplateSupported(""), false);
      assert.equal(isFieldTemplateSupported(/** @type {any} */ (null)), false);
      assert.equal(isFieldTemplateSupported(/** @type {any} */ (undefined)), false);
      assert.equal(isFieldTemplateSupported(/** @type {any} */ (123)), false);
    });
  });

  describe("getTemplatePresetDefaults", () => {
    it("returns the preset object for known templates", () => {
      const largeModern = getTemplatePresetDefaults("large_modern");
      assert.equal(largeModern.control_layout, "modern");
      assert.equal(largeModern.progress_bar_height, 16);
    });

    it("returns an empty object for custom, undefined, or unknown templates", () => {
      assert.deepEqual(getTemplatePresetDefaults("custom"), {});
      assert.deepEqual(getTemplatePresetDefaults("non_existent_preset"), {});
      assert.deepEqual(getTemplatePresetDefaults(), {});
    });
  });

  describe("normalizeCardConfig", () => {
    it("applies CARD_CONFIG_DEFAULTS when given an empty object or undefined", () => {
      const normalized = normalizeCardConfig();
      assert.equal(normalized.template, "custom");
      assert.equal(normalized.volume_mode, "slider");
      assert.equal(normalized.control_layout, "classic");
      assert.equal(normalized.progress_bar_height, 6);
    });

    it("correctly cascades defaults -> preset defaults -> user rawConfig", () => {
      const raw = {
        template: "large_modern",
        progress_bar_height: 24, // user overrides large_modern's 16
        custom_user_key: "preserved",
      };
      const normalized = normalizeCardConfig(raw);

      // Baseline defaults that weren't overridden
      assert.equal(normalized.volume_mode, "slider");

      // Preset defaults from large_modern
      assert.equal(normalized.control_layout, "modern");
      assert.equal(normalized.adaptive_controls, true);

      // User override taking precedence
      assert.equal(normalized.progress_bar_height, 24);
      assert.equal(normalized.custom_user_key, "preserved");
    });
  });

  describe("normalizeEntityConfig", () => {
    it("converts a string entity ID to an object populated with ENTITY_CONFIG_DEFAULTS", () => {
      const normalized = normalizeEntityConfig("media_player.living_room");
      assert.equal(normalized.entity, "media_player.living_room");
      assert.equal(normalized.volume_mode, "slider");
      assert.equal(normalized.volume_step, 0.05);
      assert.equal(normalized.control_layout, "classic");
      assert.equal(normalized.progress_bar_height, 6);
      assert.equal(normalized.show_idle_artwork_when_not_playing, false);
    });

    it("applies defaults to an object entry while preserving user overrides", () => {
      const rawEntry = {
        entity: "media_player.patio",
        name: "Patio Speaker",
        volume_step: 0.1,
      };
      const normalized = normalizeEntityConfig(rawEntry);
      assert.equal(normalized.entity, "media_player.patio");
      assert.equal(normalized.name, "Patio Speaker");
      assert.equal(normalized.volume_step, 0.1);
      // Defaults filled in
      assert.equal(normalized.volume_mode, "slider");
      assert.equal(normalized.control_layout, "classic");
    });
  });
});
