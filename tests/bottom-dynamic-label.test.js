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

describe("Consolidated Bottom Dynamic Label", () => {
  let card;

  beforeEach(() => {
    card = new YetAnotherMediaPlayerCard();
    card._selectedIndex = 0;
    card.config = {
      entities: [
        {
          entity_id: "media_player.office",
          name: "Office",
        },
      ],
      hide_active_entity_label: false,
      hide_active_entity_label_on_idle: false,
      hide_reorder_progress: false,
      hide_menu_player: false,
    };
    card.hass = {
      states: {
        "media_player.office": {
          entity_id: "media_player.office",
          state: "playing",
          attributes: {
            friendly_name: "Office Speaker",
          },
        },
      },
      callService: () => {},
    };
    card._isIdle = false;
    card._lyricsActive = false;
    card._fetchingLyrics = false;
    card._queueOpsTotal = 0;
    card._queueOpsCompleted = 0;
    card._showEntityOptions = false;
  });

  it("returns active entity label when chips are in menu during playback", () => {
    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });
    assert.deepEqual(label, {
      text: "Office",
      type: "entity",
    });
  });

  it("prioritizes finding lyrics over active entity label without overlap", () => {
    card._lyricsActive = true;
    card._fetchingLyrics = true;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.ok(label);
    assert.equal(label.type, "lyrics-finding");
    assert.equal(label.text, "Finding Lyrics...");
  });

  it("reverts to active entity label once lyrics finish fetching", () => {
    card._lyricsActive = true;
    card._fetchingLyrics = false;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.deepEqual(label, {
      text: "Office",
      type: "entity",
    });
  });

  it("prioritizes queue re-ordering progress over lyrics finding and entity label", () => {
    card._lyricsActive = true;
    card._fetchingLyrics = true;
    card._queueOpsTotal = 5;
    card._queueOpsCompleted = 2;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.deepEqual(label, {
      text: "Re-ordering 2 / 5",
      type: "queue-progress",
    });
  });

  it("falls back to finding lyrics when queue operations finish", () => {
    card._lyricsActive = true;
    card._fetchingLyrics = true;
    card._queueOpsTotal = 0;
    card._queueOpsCompleted = 0;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.equal(label?.type, "lyrics-finding");
  });

  it("returns null when entity options sheet is open", () => {
    card._showEntityOptions = true;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.equal(label, null);
  });

  it("returns null when chips are inline and no transient operations are active", () => {
    const label = card._getBottomDynamicLabel({
      showChipsInMenu: false,
      activeChipName: "Office",
    });

    assert.equal(label, null);
  });

  it("displays finding lyrics even when chips are inline (showChipsInMenu: false)", () => {
    card._lyricsActive = true;
    card._fetchingLyrics = true;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: false,
      activeChipName: "Office",
    });

    assert.deepEqual(label, {
      text: "Finding Lyrics...",
      type: "lyrics-finding",
    });
  });

  it("returns null when hide_active_entity_label is configured true and no transient ops are active", () => {
    card._hideActiveEntityLabel = true;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.equal(label, null);
  });

  it("hides entity label on idle when hide_active_entity_label_on_idle is true", () => {
    card._isIdle = true;
    card._hideActiveEntityLabelOnIdle = true;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.equal(label, null);
  });

  it("shows entity label on idle when hide_active_entity_label_on_idle is false", () => {
    card._isIdle = true;
    card._hideActiveEntityLabelOnIdle = false;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.deepEqual(label, {
      text: "Office",
      type: "entity",
    });
  });

  it("does not show finding lyrics when player is idle", () => {
    card._isIdle = true;
    card._lyricsActive = true;
    card._fetchingLyrics = true;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: false,
      activeChipName: "Office",
    });

    assert.equal(label, null);
  });

  it("respects hide_reorder_progress config setting", () => {
    card.config.hide_reorder_progress = true;
    card._queueOpsTotal = 3;
    card._queueOpsCompleted = 1;

    const label = card._getBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.equal(label?.type, "entity");
    assert.equal(label?.text, "Office");
  });

  it("renders a single bottom dynamic label template with expected classes and attributes", () => {
    const template = card._renderBottomDynamicLabel({
      showChipsInMenu: true,
      activeChipName: "Office",
    });

    assert.ok(template);
    assert.equal(typeof template, "object");
    assert.ok(template.strings.some((s) => s.includes("bottom-dynamic-label")));
    assert.ok(template.strings.some((s) => s.includes("in-menu-active-label")));
    assert.ok(template.strings.some((s) => s.includes('data-label-type="')));
  });
});
