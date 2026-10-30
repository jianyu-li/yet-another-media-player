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
  }
  g.HTMLElement = MockHTMLElement;
}
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");
const { renderMainMenu } = await import("../src/sheets/options-sheet.js");
const { localize } = await import("../src/localize/localize.js");

describe("Menu Item Labels", () => {
  let card;

  beforeEach(() => {
    card = new YetAnotherMediaPlayerCard();
    card._selectedIndex = 0;
    card.hass = {
      states: {
        "media_player.living_room": {
          entity_id: "media_player.living_room",
          state: "playing",
          attributes: {
            friendly_name: "Living Room Speaker",
            supported_features: 524288,
          },
        },
      },
    };
  });

  it("has correct English localization for menu items", () => {
    assert.equal(localize("card.menu.remote_controls"), "Remote");
    assert.equal(localize("card.menu.remote_control"), "Remote");
    assert.equal(localize("card.menu.show_lyrics"), "Lyrics");
    assert.equal(localize("card.menu.hide_lyrics"), "Hide Lyrics");
  });

  it("renders Remote and Lyrics in menu when lyrics inactive", () => {
    card.setConfig({
      type: "custom:yet-another-media-player",
      entities: ["media_player.living_room"],
    });
    card._hasRemoteControlSupport = () => true;
    card._renderGroupingMenuOption = () => null;
    card._lyricsActive = false;

    const templateResult = renderMainMenu.call(card, [], [], false);
    assert.ok(templateResult !== null && typeof templateResult === "object");

    // Extract child template results that represent menu items
    const childTemplates = templateResult.values.filter(
      (v) => v && typeof v === "object" && Array.isArray(v.values)
    );
    const labels = childTemplates.map((t) => t.values[1]);

    assert.ok(labels.includes("Remote"), "Menu should contain 'Remote'");
    assert.ok(labels.includes("Lyrics"), "Menu should contain 'Lyrics'");
    assert.ok(!labels.includes("Remote Control"), "Menu should not contain 'Remote Control'");
    assert.ok(!labels.includes("Show Lyrics"), "Menu should not contain 'Show Lyrics'");
  });

  it("renders Hide Lyrics in menu when lyrics active", () => {
    card.setConfig({
      type: "custom:yet-another-media-player",
      entities: ["media_player.living_room"],
    });
    card._hasRemoteControlSupport = () => true;
    card._renderGroupingMenuOption = () => null;
    card._lyricsActive = true;

    const templateResult = renderMainMenu.call(card, [], [], false);
    assert.ok(templateResult !== null && typeof templateResult === "object");

    const childTemplates = templateResult.values.filter(
      (v) => v && typeof v === "object" && Array.isArray(v.values)
    );
    const labels = childTemplates.map((t) => t.values[1]);

    assert.ok(labels.includes("Remote"), "Menu should contain 'Remote'");
    assert.ok(labels.includes("Hide Lyrics"), "Menu should contain 'Hide Lyrics'");
    assert.ok(!labels.includes("Lyrics"), "Menu should not contain 'Lyrics' when active");
  });
});
