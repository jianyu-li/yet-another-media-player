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
const { renderMainMenu, renderGroupingMenuOption } = await import("../src/sheets/options-sheet.js");

describe("Entity-Specific Hidden Menu Options", () => {
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
            supported_features: 524288, // SUPPORT_GROUPING
          },
        },
        "media_player.kitchen": {
          entity_id: "media_player.kitchen",
          state: "idle",
          attributes: {
            friendly_name: "Kitchen Speaker",
            supported_features: 524288,
          },
        },
      },
    };
  });

  describe("_getHiddenMenuOptions", () => {
    it("returns an empty array when no hidden options are configured", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room", "media_player.kitchen"],
      });
      assert.deepEqual(card._getHiddenMenuOptions(0), []);
      assert.deepEqual(card._getHiddenMenuOptions(1), []);
    });

    it("reads entity-level hidden_menu_options array", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: ["more_info", "search", "source"],
          },
          {
            entity: "media_player.kitchen",
            hidden_menu_options: ["lyrics", "full_screen"],
          },
        ],
      });
      assert.deepEqual(card._getHiddenMenuOptions(0), ["more_info", "search", "source"]);
      assert.deepEqual(card._getHiddenMenuOptions(1), ["lyrics", "full_screen"]);
    });

    it("parses comma-separated strings in entity-level hidden_menu_options", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: "more_info, search, source",
          },
        ],
      });
      assert.deepEqual(card._getHiddenMenuOptions(0), ["more_info", "search", "source"]);
    });

    it("supports the hide_menu_options alias on entities", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hide_menu_options: ["transfer_queue", "group_players"],
          },
        ],
      });
      assert.deepEqual(card._getHiddenMenuOptions(0), ["transfer_queue", "group_players"]);
    });

    it("falls back to card-level hidden_menu_options when not set on entity", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        hidden_menu_options: ["remote_controls", "lyrics"],
        entities: [
          "media_player.living_room",
          {
            entity: "media_player.kitchen",
            hidden_menu_options: ["search"],
          },
        ],
      });
      // Entity 0 inherits card-level
      assert.deepEqual(card._getHiddenMenuOptions(0), ["remote_controls", "lyrics"]);
      // Entity 1 overrides with its own
      assert.deepEqual(card._getHiddenMenuOptions(1), ["search"]);
    });

    it("falls back to card-level hide_menu_options alias", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        hide_menu_options: ["full_screen"],
        entities: ["media_player.living_room"],
      });
      assert.deepEqual(card._getHiddenMenuOptions(0), ["full_screen"]);
    });
  });

  describe("_isMenuOptionHidden", () => {
    it("correctly identifies hidden and visible options for selected entity", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: ["more_info", "search", "source"],
          },
          {
            entity: "media_player.kitchen",
            hidden_menu_options: ["remote_controls"],
          },
        ],
      });

      card._selectedIndex = 0;
      assert.equal(card._isMenuOptionHidden("more_info"), true);
      assert.equal(card._isMenuOptionHidden("search"), true);
      assert.equal(card._isMenuOptionHidden("source"), true);
      assert.equal(card._isMenuOptionHidden("transfer_queue"), false);
      assert.equal(card._isMenuOptionHidden("group_players"), false);
      assert.equal(card._isMenuOptionHidden("remote_controls"), false);
      assert.equal(card._isMenuOptionHidden("lyrics"), false);
      assert.equal(card._isMenuOptionHidden("full_screen"), false);

      // Switch to kitchen (index 1)
      card._selectedIndex = 1;
      assert.equal(card._isMenuOptionHidden("more_info"), false);
      assert.equal(card._isMenuOptionHidden("search"), false);
      assert.equal(card._isMenuOptionHidden("remote_controls"), true);
    });

    it("normalizes keys and supports canonical aliases", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: [
              "more info",
              "queue",
              "grouping",
              "remote",
              "show_lyrics",
              "fullscreen",
            ],
          },
        ],
      });

      card._selectedIndex = 0;
      // Target keys should all match despite naming variations
      assert.equal(card._isMenuOptionHidden("more_info"), true);
      assert.equal(card._isMenuOptionHidden("moreinfo"), true);
      assert.equal(card._isMenuOptionHidden("transfer_queue"), true);
      assert.equal(card._isMenuOptionHidden("group_players"), true);
      assert.equal(card._isMenuOptionHidden("group"), true);
      assert.equal(card._isMenuOptionHidden("remote_controls"), true);
      assert.equal(card._isMenuOptionHidden("remote_control"), true);
      assert.equal(card._isMenuOptionHidden("lyrics"), true);
      assert.equal(card._isMenuOptionHidden("full_screen"), true);
    });

    it("returns false for undefined, null, or unknown options", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: ["more_info"],
          },
        ],
      });
      assert.equal(card._isMenuOptionHidden(null), false);
      assert.equal(card._isMenuOptionHidden(""), false);
      assert.equal(card._isMenuOptionHidden("unknown_menu_item"), false);
    });
  });

  describe("_isMenuActionHidden", () => {
    it("hides custom menu action matching by id, name, or action key", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: ["custom_party_mode"],
          },
        ],
      });

      card._selectedIndex = 0;
      assert.equal(card._isMenuActionHidden({ id: "custom_party_mode" }), true);
      assert.equal(card._isMenuActionHidden({ name: "custom_party_mode" }), true);
      assert.equal(card._isMenuActionHidden({ id: "other_action" }), false);
      assert.equal(card._isMenuActionHidden(null), false);
    });
  });

  describe("renderGroupingMenuOption with hidden_menu_options", () => {
    it("returns nothing when group_players is hidden", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: ["group_players"],
          },
          {
            entity: "media_player.kitchen",
          },
        ],
      });
      card._selectedIndex = 0;
      const res = renderGroupingMenuOption.call(card, false);
      // Lit's `nothing` symbol
      assert.equal(typeof res, "symbol");
    });

    it("renders grouping button when group_players is not hidden", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room", "media_player.kitchen"],
      });
      card._selectedIndex = 0;
      card._isGroupCapable = () => true;
      card._getGroupingEntityId = (idx) =>
        idx === 0 ? "media_player.living_room" : "media_player.kitchen";
      card._getGroupKey = (id) => id;

      const res = renderGroupingMenuOption.call(card, false);
      assert.notEqual(typeof res, "symbol");
      assert.ok(res !== null && typeof res === "object");
    });
  });

  describe("renderMainMenu with hidden_menu_options", () => {
    it("renders all items when hidden_menu_options is empty", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room"],
      });
      card._canShowTransferQueueOption = () => true;
      card._hasRemoteControlSupport = () => true;
      card._renderGroupingMenuOption = () => null;

      const templateResult = renderMainMenu.call(card, ["HDMI 1"], [], false);
      assert.ok(templateResult !== null && typeof templateResult === "object");
      // When menuOnlyActions is empty, exactly 1 `nothing` symbol is produced for that slot.
      // All menu items themselves are rendered (no nothing symbols from menu items).
      const nothingSymbols = templateResult.values.filter((v) => typeof v === "symbol");
      assert.equal(nothingSymbols.length, 1);
    });

    it("hides more_info, search, and source when configured in hidden_menu_options", () => {
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          {
            entity: "media_player.living_room",
            hidden_menu_options: ["more_info", "search", "source"],
          },
        ],
      });
      card._canShowTransferQueueOption = () => true;
      card._hasRemoteControlSupport = () => true;
      card._renderGroupingMenuOption = () => null;

      const templateResult = renderMainMenu.call(card, ["HDMI 1"], [], false);
      assert.ok(templateResult !== null && typeof templateResult === "object");
      // more_info, search, and source slots should contain the Lit `nothing` symbol, plus 1 for empty menuOnlyActions
      const nothingSymbols = templateResult.values.filter((v) => typeof v === "symbol");
      assert.equal(nothingSymbols.length, 4);
    });
  });
});
