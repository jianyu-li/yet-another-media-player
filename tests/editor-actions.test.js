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
