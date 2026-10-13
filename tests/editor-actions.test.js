import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

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
