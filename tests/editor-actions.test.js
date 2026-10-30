import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { nothing } from "lit";

// Setup mock browser globals before importing Lit component
const g = /** @type {any} */ (globalThis);
g.window = globalThis;
if (!g.customElements) {
  g.customElements = { define() {} };
}
if (!g.HTMLElement) {
  class MockHTMLElement {
    attachShadow() {
      return {};
    }
    dispatchEvent(_event) {
      return true;
    }
  }
  g.HTMLElement = MockHTMLElement;
}
if (!g.HTMLElement.prototype.dispatchEvent) {
  g.HTMLElement.prototype.dispatchEvent = function (_event) {
    return true;
  };
}
if (!g.window.Image) {
  g.window.Image = class MockImage {};
}
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerEditor } = await import("../src/yamp-editor.js");
const { localize } = await import("../src/localize/localize.js");

describe("YetAnotherMediaPlayerEditor - Action Navigation and Management", () => {
  let editor;

  beforeEach(() => {
    editor = new YetAnotherMediaPlayerEditor();
    editor.dispatchEvent = () => true;
    editor.setConfig({
      entities: ["media_player.living_room"],
      actions: [
        {
          name: "Play Living Room",
          service: "media_player.media_play",
        },
      ],
    });
  });

  it("adds a new action and navigates directly into its configuration", () => {
    let dispatchedConfig = null;
    editor.dispatchEvent = (event) => {
      if (event.type === "config-changed") {
        dispatchedConfig = event.detail.config;
      }
      return true;
    };

    assert.equal(editor._actionEditorIndex, null);
    assert.equal(editor._config.actions.length, 1);

    editor._addAction();

    // Check editor sub-editor navigation state
    assert.equal(editor._actionEditorIndex, 1);
    assert.equal(editor._actionMode, "service");
    assert.equal(editor._config.actions.length, 2);
    assert.deepEqual(editor._config.actions[1], { service: "" });

    // Verify config-changed event was dispatched
    assert.ok(dispatchedConfig);
    assert.equal(dispatchedConfig.actions.length, 2);
    assert.deepEqual(dispatchedConfig.actions[1], { service: "" });
  });

  it("preserves action editor index across multiple setConfig invocations from Home Assistant", () => {
    editor._addAction();
    assert.equal(editor._actionEditorIndex, 1);

    const updatedConfig = {
      ...editor._yamlConfig,
    };

    // First setConfig call from HA
    editor.setConfig(updatedConfig);
    assert.equal(editor._actionEditorIndex, 1);

    // Second setConfig call from HA (e.g. from dialog container)
    editor.setConfig(updatedConfig);
    assert.equal(editor._actionEditorIndex, 1);

    // Third setConfig call (simulating preview or debounce)
    editor.setConfig(updatedConfig);
    assert.equal(editor._actionEditorIndex, 1);
  });

  it("clears actionEditorIndex if the action was removed in an external config update", () => {
    editor._addAction();
    assert.equal(editor._actionEditorIndex, 1);

    // External config update where actions were removed or truncated
    editor.setConfig({
      entities: ["media_player.living_room"],
      actions: [],
    });

    assert.equal(editor._actionEditorIndex, null);
    assert.equal(editor._actionMode, null);
  });

  it("clears actionEditorIndex if actions array is omitted externally", () => {
    editor._addAction();
    assert.equal(editor._actionEditorIndex, 1);

    editor.setConfig({
      entities: ["media_player.living_room"],
    });

    assert.equal(editor._actionEditorIndex, null);
    assert.equal(editor._actionMode, null);
  });

  it("updates actionEditorIndex when an earlier action is removed via _removeAction", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      actions: [
        { name: "Action 0", service: "s0" },
        { name: "Action 1", service: "s1" },
        { name: "Action 2", service: "s2" },
      ],
    });

    editor._onEditAction(2);
    assert.equal(editor._actionEditorIndex, 2);

    // Removing action 0 shifts action 2 to index 1
    editor._removeAction(0);
    assert.equal(editor._actionEditorIndex, 1);
  });

  it("resets actionEditorIndex when the currently edited action is removed via _removeAction", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      actions: [
        { name: "Action 0", service: "s0" },
        { name: "Action 1", service: "s1" },
      ],
    });

    editor._onEditAction(1);
    assert.equal(editor._actionEditorIndex, 1);

    editor._removeAction(1);
    assert.equal(editor._actionEditorIndex, null);
    assert.equal(editor._actionMode, null);
  });

  it("backs out to configured actions list when _onBackFromActionEditor is called", () => {
    editor._addAction();
    assert.equal(editor._actionEditorIndex, 1);
    assert.equal(editor._actionMode, "service");

    editor._onBackFromActionEditor();
    assert.equal(editor._actionEditorIndex, null);
    assert.equal(editor._actionMode, null);
  });

  it("resets sub-editor state when changing template preset", () => {
    editor._addAction();
    assert.equal(editor._actionEditorIndex, 1);

    editor._changeTemplate("minimal");
    assert.equal(editor._actionEditorIndex, null);
    assert.equal(editor._actionMode, null);
  });
});

describe("YetAnotherMediaPlayerEditor - Entity Row Rendering", () => {
  let editor;

  function flattenTemplate(tpl) {
    if (!tpl) return "";
    if (typeof tpl === "string") return tpl;
    if (Array.isArray(tpl)) return tpl.map(flattenTemplate).join("");
    if (tpl.strings && Array.isArray(tpl.values)) {
      let out = "";
      tpl.strings.forEach((str, i) => {
        out += str;
        if (i < tpl.values.length) {
          out += flattenTemplate(tpl.values[i]);
        }
      });
      return out;
    }
    return String(tpl);
  }

  beforeEach(() => {
    editor = new YetAnotherMediaPlayerEditor();
    editor.hass = {
      states: {
        "media_player.living_room": {
          entity_id: "media_player.living_room",
          attributes: { friendly_name: "Living Room Speaker" },
        },
      },
    };
  });

  it("renders ha-combo-box-item with headline and supporting-text for modern Home Assistant", () => {
    const item = {
      id: "media_player.living_room",
      primary: "Living Room Speaker",
      secondary: "media_player.living_room",
    };
    const result = editor._entityRowRenderer(item);
    assert.ok(result);
    const htmlString = flattenTemplate(result);
    assert.ok(htmlString.includes("<ha-combo-box-item>"));
    assert.ok(htmlString.includes('slot="headline"'));
    assert.ok(htmlString.includes('slot="supporting-text"'));
    assert.ok(htmlString.includes('slot="start"'));
  });

  it("renders icon_path on ha-svg-icon for custom items", () => {
    const item = {
      id: "media_player.custom",
      primary: "Add custom item",
      secondary: "media_player.custom",
      icon_path: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
    };
    const result = editor._entityRowRenderer(item);
    assert.ok(result);
    const htmlString = flattenTemplate(result);
    assert.ok(htmlString.includes("<ha-svg-icon"));
    assert.ok(htmlString.includes('slot="start"'));
  });

  it("falls back to ha-list-item when ha-list-item is defined and ha-combo-box-item is not", () => {
    const origGet = customElements.get;
    customElements.get = /** @type {any} */ (
      (name) => (name === "ha-list-item" ? class MockListItem extends HTMLElement {} : undefined)
    );
    try {
      const item = {
        id: "media_player.living_room",
        primary: "Living Room Speaker",
        secondary: "media_player.living_room",
      };
      const result = editor._entityRowRenderer(item);
      assert.ok(result);
      const htmlString = flattenTemplate(result);
      assert.ok(htmlString.includes("<ha-list-item"));
      assert.ok(htmlString.includes('slot="graphic"'));
      assert.ok(htmlString.includes('slot="secondary"'));
    } finally {
      customElements.get = origGet;
    }
  });
});

describe("YetAnotherMediaPlayerEditor - Template Preset Population & Overrides", () => {
  let editor;

  beforeEach(() => {
    editor = new YetAnotherMediaPlayerEditor();
    editor.dispatchEvent = () => true;
  });

  it("populates adaptive_text_targets in _config without polluting _yamlConfig when using large_modern preset", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      template: "large_modern",
    });

    assert.deepEqual(editor._config.adaptive_text_targets, [
      "details",
      "menu",
      "action_chips",
      "lyrics",
    ]);
    assert.deepEqual(editor._getAdaptiveTextTargetsValue(), [
      "details",
      "menu",
      "action_chips",
      "lyrics",
    ]);
    assert.equal(editor._yamlConfig.adaptive_text_targets, undefined);
  });

  it("allows user to uncheck lyrics and stores override in _yamlConfig", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      template: "large_modern",
    });

    /** @type {any} */
    let lastDispatchedConfig = null;
    editor.dispatchEvent = (event) => {
      if (event.type === "config-changed") {
        lastDispatchedConfig = /** @type {CustomEvent} */ (event).detail?.config;
      }
      return true;
    };

    editor._onAdaptiveTextTargetsChanged(["details", "menu", "action_chips"]);

    assert.deepEqual(editor._yamlConfig.adaptive_text_targets, ["details", "menu", "action_chips"]);
    assert.deepEqual(editor._getAdaptiveTextTargetsValue(), ["details", "menu", "action_chips"]);
    assert.deepEqual(editor._config.adaptive_text_targets, ["details", "menu", "action_chips"]);
    assert.ok(lastDispatchedConfig);
    assert.deepEqual(lastDispatchedConfig.adaptive_text_targets, [
      "details",
      "menu",
      "action_chips",
    ]);
  });

  it("allows user to uncheck all items and stores empty array in _yamlConfig", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      template: "large_modern",
    });

    /** @type {any} */
    let lastDispatchedConfig = null;
    editor.dispatchEvent = (event) => {
      if (event.type === "config-changed") {
        lastDispatchedConfig = /** @type {CustomEvent} */ (event).detail?.config;
      }
      return true;
    };

    editor._onAdaptiveTextTargetsChanged([]);

    assert.deepEqual(editor._yamlConfig.adaptive_text_targets, []);
    assert.deepEqual(editor._getAdaptiveTextTargetsValue(), []);
    assert.deepEqual(editor._config.adaptive_text_targets, []);
    assert.ok(lastDispatchedConfig);
    assert.deepEqual(lastDispatchedConfig.adaptive_text_targets, []);
  });

  it("does not dispatch config-changed or pollute _yamlConfig when adaptive_text_targets matches preset default", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      template: "large_modern",
    });

    let dispatchCalled = false;
    editor.dispatchEvent = () => {
      dispatchCalled = true;
      return true;
    };

    editor._onAdaptiveTextTargetsChanged(["details", "menu", "action_chips", "lyrics"]);

    assert.equal(dispatchCalled, false);
    assert.equal(editor._yamlConfig.adaptive_text_targets, undefined);
  });

  it("clears prior manual adaptive_text_targets override when changing template to large_modern", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      template: "crisp_clean",
      adaptive_text_targets: [],
    });

    assert.deepEqual(editor._yamlConfig.adaptive_text_targets, []);

    editor._changeTemplate("large_modern");

    assert.equal(editor._yamlConfig.adaptive_text_targets, undefined);
    assert.deepEqual(editor._getAdaptiveTextTargetsValue(), [
      "details",
      "menu",
      "action_chips",
      "lyrics",
    ]);
    assert.deepEqual(editor._config.adaptive_text_targets, [
      "details",
      "menu",
      "action_chips",
      "lyrics",
    ]);
  });

  it("restores preset default value when resetting property with undefined via _updateConfig", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      template: "large_modern",
      progress_bar_height: 24,
    });

    assert.equal(editor._yamlConfig.progress_bar_height, 24);
    assert.equal(editor._config.progress_bar_height, 24);

    editor._updateConfig("progress_bar_height", undefined);

    assert.equal(editor._yamlConfig.progress_bar_height, undefined);
    assert.equal("progress_bar_height" in editor._yamlConfig, false);
    assert.equal(editor._config.progress_bar_height, 16);
  });

  it("overrides crisp_clean artwork_object_fit preset default with user selection", () => {
    editor.setConfig({
      entities: ["media_player.living_room"],
      template: "crisp_clean",
    });

    assert.equal(editor._config.artwork_object_fit, "scaled-contain-alternate");
    assert.equal(editor._yamlConfig.artwork_object_fit, undefined);

    editor._updateConfig("artwork_object_fit", "cover");

    assert.equal(editor._yamlConfig.artwork_object_fit, "cover");
    assert.equal(editor._config.artwork_object_fit, "cover");
  });
});

describe("YetAnotherMediaPlayerEditor - Template Indicators and Reset", () => {
  let editor;

  beforeEach(() => {
    editor = new YetAnotherMediaPlayerEditor();
    editor.dispatchEvent = () => true;
  });

  describe("_getEffectiveTemplate", () => {
    it("returns custom when template is undefined or explicitly custom", () => {
      editor.setConfig({ entities: ["media_player.living_room"] });
      assert.equal(editor._getEffectiveTemplate(), "custom");

      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "custom",
      });
      assert.equal(editor._getEffectiveTemplate(), "custom");
    });

    it("returns large_modern when template is large_modern", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      assert.equal(editor._getEffectiveTemplate(), "large_modern");
    });

    it("normalizes alias names to dedicated_grouping", () => {
      const aliases = [
        "group_players",
        "players",
        "dedicated_players",
        "dedicated_grouping",
        "transfer_queue",
        "dedicated_transfer_queue",
      ];
      for (const alias of aliases) {
        editor.setConfig({
          entities: ["media_player.living_room"],
          template: alias,
        });
        assert.equal(
          editor._getEffectiveTemplate(),
          "dedicated_grouping",
          `Expected alias ${alias} to normalize to dedicated_grouping`
        );
      }
    });
  });

  describe("_isTemplateAdjusted", () => {
    it("returns false for all keys when template is custom", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "custom",
      });
      assert.equal(editor._isTemplateAdjusted("control_layout"), false);
      assert.equal(editor._isTemplateAdjusted("adaptive_text_targets"), false);
      assert.equal(editor._isTemplateAdjusted("adaptive_text"), false);
      assert.equal(editor._isTemplateAdjusted("artwork_object_fit"), false);
      assert.equal(editor._isTemplateAdjusted("progress_bar_height"), false);
      assert.equal(editor._isTemplateAdjusted("match_theme"), false);
      assert.equal(editor._isTemplateAdjusted("idle_timeout_ms"), false);
      assert.equal(editor._isTemplateAdjusted("volume_mode"), false);
    });

    it("returns true for template-provided keys under large_modern", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      assert.equal(editor._isTemplateAdjusted("adaptive_text_targets"), true);
      assert.equal(editor._isTemplateAdjusted("adaptive_text"), true);
      assert.equal(editor._isTemplateAdjusted("control_layout"), true);
      assert.equal(editor._isTemplateAdjusted("artwork_object_fit"), true);
      assert.equal(editor._isTemplateAdjusted("progress_bar_height"), true);
      assert.equal(editor._isTemplateAdjusted("match_theme"), true);
    });

    it("returns false for keys not modified by large_modern preset", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      assert.equal(editor._isTemplateAdjusted("idle_timeout_ms"), false);
      assert.equal(editor._isTemplateAdjusted("volume_mode"), false);
    });
  });

  describe("_isTemplateOverridden", () => {
    it("returns false when key is provided by large_modern and yamlConfig has no override", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      assert.equal(editor._isTemplateOverridden("control_layout"), false);
      assert.equal(editor._isTemplateOverridden("progress_bar_height"), false);
      assert.equal(editor._isTemplateOverridden("artwork_object_fit"), false);
      assert.equal(editor._isTemplateOverridden("adaptive_text_targets"), false);
    });

    it("returns true when yamlConfig overrides a template value", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        control_layout: "classic",
      });
      assert.equal(editor._isTemplateOverridden("control_layout"), true);
    });

    it("returns true for adaptive_text_targets when either adaptive_text_targets or adaptive_text is defined in yamlConfig", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        adaptive_text_targets: ["details"],
      });
      assert.equal(editor._isTemplateOverridden("adaptive_text_targets"), true);
      assert.equal(editor._isTemplateOverridden("adaptive_text"), true);

      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        adaptive_text: false,
      });
      assert.equal(editor._isTemplateOverridden("adaptive_text_targets"), true);
      assert.equal(editor._isTemplateOverridden("adaptive_text"), true);
    });

    it("returns false when key is not adjusted by template", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        idle_timeout_ms: 120000,
      });
      assert.equal(editor._isTemplateOverridden("idle_timeout_ms"), false);
    });
  });

  describe("_resetToTemplate", () => {
    it("deletes scalar key from yamlConfig and restores effective config to template preset default", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        progress_bar_height: 32,
      });

      assert.equal(editor._isTemplateOverridden("progress_bar_height"), true);
      assert.equal(editor._yamlConfig.progress_bar_height, 32);
      assert.equal(editor._config.progress_bar_height, 32);

      let dispatchedConfig = null;
      editor.dispatchEvent = (event) => {
        if (event.type === "config-changed") {
          dispatchedConfig = event.detail.config;
        }
        return true;
      };

      editor._resetToTemplate("progress_bar_height");

      assert.equal(editor._yamlConfig.progress_bar_height, undefined);
      assert.equal("progress_bar_height" in editor._yamlConfig, false);
      assert.equal(editor._config.progress_bar_height, 16);
      assert.equal(editor._isTemplateOverridden("progress_bar_height"), false);
      assert.ok(dispatchedConfig);
      assert.equal("progress_bar_height" in dispatchedConfig, false);
    });

    it("resets adaptive_text_targets by deleting both adaptive_text and adaptive_text_targets from yamlConfig", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        adaptive_text_targets: ["details"],
        adaptive_text: false,
      });

      assert.equal(editor._isTemplateOverridden("adaptive_text_targets"), true);

      let dispatchedConfig = null;
      editor.dispatchEvent = (event) => {
        if (event.type === "config-changed") {
          dispatchedConfig = event.detail.config;
        }
        return true;
      };

      editor._resetToTemplate("adaptive_text_targets");

      assert.equal(editor._yamlConfig.adaptive_text_targets, undefined);
      assert.equal(editor._yamlConfig.adaptive_text, undefined);
      assert.equal("adaptive_text_targets" in editor._yamlConfig, false);
      assert.equal("adaptive_text" in editor._yamlConfig, false);
      assert.deepEqual(editor._config.adaptive_text_targets, [
        "details",
        "menu",
        "action_chips",
        "lyrics",
      ]);
      assert.equal(editor._isTemplateOverridden("adaptive_text_targets"), false);
      assert.ok(dispatchedConfig);
      assert.equal("adaptive_text_targets" in dispatchedConfig, false);
      assert.equal("adaptive_text" in dispatchedConfig, false);
    });

    it("resets adaptive_text by deleting both adaptive_text and adaptive_text_targets from yamlConfig", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        adaptive_text_targets: ["details"],
        adaptive_text: false,
      });

      editor._resetToTemplate("adaptive_text");

      assert.equal(editor._yamlConfig.adaptive_text_targets, undefined);
      assert.equal(editor._yamlConfig.adaptive_text, undefined);
      assert.equal("adaptive_text_targets" in editor._yamlConfig, false);
      assert.equal("adaptive_text" in editor._yamlConfig, false);
      assert.deepEqual(editor._config.adaptive_text_targets, [
        "details",
        "menu",
        "action_chips",
        "lyrics",
      ]);
    });
  });

  describe("_renderTemplateIndicator and _renderTemplateDropdownIndicator", () => {
    it("returns nothing when template is custom", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "custom",
      });
      assert.equal(editor._renderTemplateIndicator("control_layout"), nothing);
      assert.equal(editor._renderTemplateDropdownIndicator("custom"), nothing);
    });

    it("returns nothing for keys not adjusted by template", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      assert.equal(editor._renderTemplateIndicator("idle_timeout_ms"), nothing);
    });

    it("returns active template indicator for template-adjusted key", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      const result = editor._renderTemplateIndicator("control_layout");
      assert.notEqual(result, nothing);
      assert.ok(result);
    });

    it("returns overridden template indicator with click handler when key is overridden", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
        control_layout: "classic",
      });
      const result = editor._renderTemplateIndicator("control_layout");
      assert.notEqual(result, nothing);
      assert.ok(result);

      if (result && Array.isArray(result.values)) {
        const clickHandler = result.values.find((v) => typeof v === "function");
        if (clickHandler) {
          clickHandler(new Event("click"));
          assert.equal(editor._yamlConfig.control_layout, undefined);
          assert.equal(editor._config.control_layout, "modern");
        }
      }
    });

    it("returns dropdown indicator for active template and nothing for custom", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      const activeResult = editor._renderTemplateDropdownIndicator("large_modern");
      assert.notEqual(activeResult, nothing);
      assert.ok(activeResult);

      const customResult = editor._renderTemplateDropdownIndicator("custom");
      assert.equal(customResult, nothing);
    });
  });
});

describe("YetAnotherMediaPlayerEditor - Template Filter Mode", () => {
  let editor;

  beforeEach(() => {
    editor = new YetAnotherMediaPlayerEditor();
    editor.dispatchEvent = () => true;
  });

  describe("_filterByTemplate initialization", () => {
    it("starts as false", () => {
      assert.equal(editor._filterByTemplate, false);
    });
  });

  describe("_toggleTemplateFilter()", () => {
    it("toggles _filterByTemplate to true when template is large_modern and back to false when called again", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      assert.equal(editor._filterByTemplate, false);

      editor._toggleTemplateFilter();
      assert.equal(editor._filterByTemplate, true);

      editor._toggleTemplateFilter();
      assert.equal(editor._filterByTemplate, false);
    });

    it("remains false and does not toggle when template is custom", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "custom",
      });
      assert.equal(editor._filterByTemplate, false);

      editor._toggleTemplateFilter();
      assert.equal(editor._filterByTemplate, false);
    });
  });

  describe("_changeTemplate('custom')", () => {
    it("automatically resets _filterByTemplate to false if it was true when switching to custom", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      editor._toggleTemplateFilter();
      assert.equal(editor._filterByTemplate, true);

      editor._changeTemplate("custom");
      assert.equal(editor._filterByTemplate, false);
    });
  });

  describe("_renderTemplateDropdownIndicator(templateName)", () => {
    it("renders indicator with class filter-active and localized tooltip when _filterByTemplate is true", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      editor._filterByTemplate = true;

      const result = editor._renderTemplateDropdownIndicator("large_modern");
      assert.notEqual(result, nothing);
      assert.ok(result);

      // Verify class includes filter-active
      const classValue = result.values[0];
      assert.equal(classValue, "filter-active");

      // Verify localized tooltip matches editor.template_filter_tooltip_on
      const tooltip = result.values[1];
      const expectedTooltip = localize("editor.template_filter_tooltip_on", {
        "{template}": "Big Ol' Modern YAMP",
      });
      assert.equal(tooltip, expectedTooltip);

      // Verify clicking the dropdown indicator invokes _toggleTemplateFilter()
      const clickHandler = result.values.find((v) => typeof v === "function");
      assert.ok(clickHandler);
      clickHandler();
      assert.equal(editor._filterByTemplate, false);
    });

    it("renders indicator with class active and localized tooltip when _filterByTemplate is false", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      editor._filterByTemplate = false;

      const result = editor._renderTemplateDropdownIndicator("large_modern");
      assert.notEqual(result, nothing);
      assert.ok(result);

      // Verify class includes active and not filter-active
      const classValue = result.values[0];
      assert.equal(classValue, "");
      assert.ok(result.strings[0].includes("active"));

      // Verify localized tooltip matches editor.template_filter_tooltip_off
      const tooltip = result.values[1];
      const expectedTooltip = localize("editor.template_filter_tooltip_off", {
        "{template}": "Big Ol' Modern YAMP",
      });
      assert.equal(tooltip, expectedTooltip);

      // Verify clicking the dropdown indicator invokes _toggleTemplateFilter()
      const clickHandler = result.values.find((v) => typeof v === "function");
      assert.ok(clickHandler);
      clickHandler();
      assert.equal(editor._filterByTemplate, true);
    });
  });

  describe("Row filtering verification (_applySearchFilter logic)", () => {
    /**
     * @param {string} tagName
     * @param {string[]} classNames
     * @param {any[]} children
     * @param {Record<string, string>} attributes
     */
    function createMockElement(tagName = "div", classNames = [], children = [], attributes = {}) {
      const classes = new Set(classNames);
      /** @type {any} */
      const element = {
        tagName: tagName.toUpperCase(),
        children,
        style: { display: "" },
        textContent: "",
        classList: {
          contains: (c) => classes.has(c),
          add: (c) => classes.add(c),
          remove: (c) => classes.delete(c),
        },
        getAttribute: (name) => attributes[name] || null,
        querySelector: (selector) => {
          return element.querySelectorAll(selector)[0] || null;
        },
        querySelectorAll: (selector) => {
          const results = [];
          const match = (el) => {
            const selList = selector.split(",").map((s) => s.trim());
            for (const sel of selList) {
              if (sel.startsWith(".")) {
                const cls = sel.slice(1);
                if (el.classList?.contains(cls)) return true;
              }
            }
            return false;
          };
          const traverse = (node) => {
            if (!node.children) return;
            for (const child of node.children) {
              if (match(child)) results.push(child);
              traverse(child);
            }
          };
          traverse(element);
          return results;
        },
      };
      return element;
    }

    /**
     * @param {any} targetEditor
     * @param {any} container
     */
    function setMockShadowRoot(targetEditor, container) {
      Object.defineProperty(targetEditor, "shadowRoot", {
        value: {
          querySelector: (sel) => {
            if (sel.includes("tab-content") || sel.includes("search-results")) return container;
            return null;
          },
        },
        configurable: true,
        writable: true,
      });
    }

    it("displays rows with .template-indicator and hides rows without when _filterByTemplate = true", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });

      const indicatorEl = createMockElement("ha-icon", ["template-indicator"]);
      const rowWithIndicator = createMockElement("div", ["form-row"], [indicatorEl]);
      const rowWithoutIndicator = createMockElement("div", ["form-row"], []);
      const section = createMockElement(
        "div",
        ["config-section"],
        [rowWithIndicator, rowWithoutIndicator]
      );
      const tabContent = createMockElement("div", ["tab-content"], [section]);

      setMockShadowRoot(editor, tabContent);

      editor._filterByTemplate = true;
      editor._applySearchFilter();

      assert.equal(rowWithIndicator.style.display, "");
      assert.equal(rowWithoutIndicator.style.display, "none");
      assert.equal(section.style.display, "");
    });

    it("displays all rows when _filterByTemplate = false", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });

      const indicatorEl = createMockElement("ha-icon", ["template-indicator"]);
      const rowWithIndicator = createMockElement("div", ["form-row"], [indicatorEl]);
      const rowWithoutIndicator = createMockElement("div", ["form-row"], []);
      rowWithoutIndicator.style.display = "none";
      const section = createMockElement(
        "div",
        ["config-section"],
        [rowWithIndicator, rowWithoutIndicator]
      );
      const tabContent = createMockElement("div", ["tab-content"], [section]);

      setMockShadowRoot(editor, tabContent);

      editor._filterByTemplate = false;
      editor._applySearchFilter();

      assert.equal(rowWithIndicator.style.display, "");
      assert.equal(rowWithoutIndicator.style.display, "");
      assert.equal(section.style.display, "");
    });

    it("correctly filters sub-editor flat rows when _filterByTemplate is toggled", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });
      editor._entityEditorIndex = 0;

      const indicatorEl = createMockElement("ha-icon", ["template-indicator"]);
      const rowWithIndicator = createMockElement("div", ["form-row"], [indicatorEl]);
      const rowWithoutIndicator = createMockElement("div", ["form-row"], []);
      const tabContent = createMockElement(
        "div",
        ["tab-content"],
        [rowWithIndicator, rowWithoutIndicator]
      );

      setMockShadowRoot(editor, tabContent);

      editor._filterByTemplate = true;
      editor._applySearchFilter();

      assert.equal(rowWithIndicator.style.display, "");
      assert.equal(rowWithoutIndicator.style.display, "none");

      editor._filterByTemplate = false;
      editor._applySearchFilter();

      assert.equal(rowWithIndicator.style.display, "");
      assert.equal(rowWithoutIndicator.style.display, "");
    });

    it("correctly filters multi-column rows according to child template indicators", () => {
      editor.setConfig({
        entities: ["media_player.living_room"],
        template: "large_modern",
      });

      const indicatorEl = createMockElement("ha-icon", ["template-indicator"]);
      const col1WithIndicator = createMockElement("div", [], [indicatorEl]);
      const col2WithoutIndicator = createMockElement("div", [], []);
      const multiColRow = createMockElement(
        "div",
        ["form-row", "form-row-multi-column"],
        [col1WithIndicator, col2WithoutIndicator]
      );
      const section = createMockElement("div", ["config-section"], [multiColRow]);
      const tabContent = createMockElement("div", ["tab-content"], [section]);

      setMockShadowRoot(editor, tabContent);

      editor._filterByTemplate = true;
      editor._applySearchFilter();

      assert.equal(col1WithIndicator.style.display, "");
      assert.equal(col2WithoutIndicator.style.display, "none");
      assert.equal(multiColRow.style.display, "");

      editor._filterByTemplate = false;
      editor._applySearchFilter();

      assert.equal(col1WithIndicator.style.display, "");
      assert.equal(col2WithoutIndicator.style.display, "");
      assert.equal(multiColRow.style.display, "");
    });
  });
});
