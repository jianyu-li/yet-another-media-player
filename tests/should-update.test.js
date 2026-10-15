import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Setup mock browser globals before importing Lit component
const g = /** @type {any} */ (globalThis);
g.window = globalThis;
g.customElements = { define() {} };
class MockHTMLElement {
  attachShadow() {
    return {};
  }
}
g.HTMLElement = MockHTMLElement;
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");

describe("Low-End Device Reactivity & shouldUpdate Optimizations", () => {
  let card;

  beforeEach(() => {
    if (globalThis.document) {
      delete globalThis.document;
    }
    card = new YetAnotherMediaPlayerCard();
    card.setConfig({
      entities: [
        {
          entity_id: "media_player.living_room",
          name: "Living Room",
          music_assistant_entity: "media_player.living_room_ma",
        },
        {
          entity_id: "media_player.bedroom",
          name: "Bedroom",
        },
      ],
      actions: [
        {
          action: "sync_selected_entity",
          entity: "input_select.active_player",
        },
      ],
      full_screen: "[[[ return is_state('input_boolean.theater_mode', 'on'); ]]]",
    });

    card.hass = {
      themes: { theme: "default" },
      darkMode: false,
      language: "en",
      selectedLanguage: null,
      locale: { language: "en" },
      states: {
        "media_player.living_room": {
          entity_id: "media_player.living_room",
          state: "playing",
          attributes: { media_title: "Song 1", group_members: ["media_player.living_room"] },
        },
        "media_player.bedroom": {
          entity_id: "media_player.bedroom",
          state: "idle",
          attributes: {},
        },
        "media_player.living_room_ma": {
          entity_id: "media_player.living_room_ma",
          state: "playing",
          attributes: {},
        },
        "input_select.active_player": {
          entity_id: "input_select.active_player",
          state: "media_player.living_room",
          attributes: {},
        },
        "input_boolean.theater_mode": {
          entity_id: "input_boolean.theater_mode",
          state: "off",
          attributes: {},
        },
        "sensor.temperature": {
          entity_id: "sensor.temperature",
          state: "72",
          attributes: {},
        },
        "light.kitchen": {
          entity_id: "light.kitchen",
          state: "off",
          attributes: {},
        },
      },
    };
  });

  describe("Selective re-rendering (shouldUpdate)", () => {
    it("returns false when unrelated entity state updates", () => {
      const oldHass = card.hass;
      const newHass = {
        ...oldHass,
        states: {
          ...oldHass.states,
          "sensor.temperature": {
            entity_id: "sensor.temperature",
            state: "73",
            attributes: {},
          },
          "light.kitchen": {
            entity_id: "light.kitchen",
            state: "on",
            attributes: {},
          },
        },
      };

      card.hass = newHass;
      const changedProps = new Map([["hass", oldHass]]);
      assert.strictEqual(card.shouldUpdate(changedProps), false);
    });

    it("returns true when a configured media player entity state updates", () => {
      const oldHass = card.hass;
      const newHass = {
        ...oldHass,
        states: {
          ...oldHass.states,
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "paused",
            attributes: { media_title: "Song 1" },
          },
        },
      };

      card.hass = newHass;
      const changedProps = new Map([["hass", oldHass]]);
      assert.strictEqual(card.shouldUpdate(changedProps), true);
    });

    it("returns true when a companion resolved entity (e.g. MA entity) state updates", () => {
      const oldHass = card.hass;
      card._maResolveCache = {
        0: { value: "media_player.living_room_ma", ts: Date.now() },
      };
      const newHass = {
        ...oldHass,
        states: {
          ...oldHass.states,
          "media_player.living_room_ma": {
            entity_id: "media_player.living_room_ma",
            state: "paused",
            attributes: {},
          },
        },
      };

      card.hass = newHass;
      const changedProps = new Map([["hass", oldHass]]);
      assert.strictEqual(card.shouldUpdate(changedProps), true);
    });

    it("returns true when an action helper entity state updates", () => {
      const oldHass = card.hass;
      const newHass = {
        ...oldHass,
        states: {
          ...oldHass.states,
          "input_select.active_player": {
            entity_id: "input_select.active_player",
            state: "media_player.bedroom",
            attributes: {},
          },
        },
      };

      card.hass = newHass;
      const changedProps = new Map([["hass", oldHass]]);
      assert.strictEqual(card.shouldUpdate(changedProps), true);
    });

    it("returns true when a JS template referenced entity state updates", () => {
      const oldHass = card.hass;
      const newHass = {
        ...oldHass,
        states: {
          ...oldHass.states,
          "input_boolean.theater_mode": {
            entity_id: "input_boolean.theater_mode",
            state: "on",
            attributes: {},
          },
        },
      };

      card.hass = newHass;
      const changedProps = new Map([["hass", oldHass]]);
      assert.strictEqual(card.shouldUpdate(changedProps), true);
    });

    it("returns true when global theme, dark mode, or language changes", () => {
      const oldHass = card.hass;
      const newHass = { ...oldHass, darkMode: true };

      card.hass = newHass;
      const changedProps = new Map([["hass", oldHass]]);
      assert.strictEqual(card.shouldUpdate(changedProps), true);
    });

    it("returns true when internal reactive properties change", () => {
      const changedProps = new Map([["_selectedIndex", 0]]);
      assert.strictEqual(card.shouldUpdate(changedProps), true);
    });

    it("returns false when document.hidden is true", () => {
      globalThis.document = /** @type {any} */ ({ hidden: true });
      const oldHass = card.hass;
      const newHass = {
        ...oldHass,
        states: {
          ...oldHass.states,
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "paused",
            attributes: {},
          },
        },
      };

      card.hass = newHass;
      const changedProps = new Map([["hass", oldHass]]);
      assert.strictEqual(card.shouldUpdate(changedProps), false);
      delete globalThis.document;
    });
  });

  describe("Getter Memoization (entityIds and entityObjs)", () => {
    it("returns the exact same array reference across multiple entityIds calls", () => {
      const first = card.entityIds;
      const second = card.entityIds;
      assert.strictEqual(first, second);
      assert.deepStrictEqual(first, ["media_player.living_room", "media_player.bedroom"]);
    });

    it("returns the exact same array reference across multiple entityObjs calls", () => {
      const first = card.entityObjs;
      const second = card.entityObjs;
      assert.strictEqual(first, second);
      assert.strictEqual(first.length, 2);
    });

    it("invalidates cached arrays when setConfig is called", () => {
      const initialIds = card.entityIds;
      card.setConfig({
        entities: ["media_player.new_entity"],
      });
      const newIds = card.entityIds;
      assert.notStrictEqual(initialIds, newIds);
      assert.deepStrictEqual(newIds, ["media_player.new_entity"]);
    });
  });

  describe("Page Load & Visibility Auto-Discovery", () => {
    it("discovers already playing entities on initial update (page load)", () => {
      const loadCard = new YetAnotherMediaPlayerCard();
      loadCard.setConfig({
        entities: ["media_player.configured_one"],
        auto_add_playing_entities: true,
      });
      loadCard.hass = {
        states: {
          "media_player.configured_one": {
            entity_id: "media_player.configured_one",
            state: "idle",
            attributes: {},
          },
          "media_player.already_playing": {
            entity_id: "media_player.already_playing",
            state: "playing",
            attributes: { friendly_name: "Kitchen Sonos", media_title: "Track 1" },
          },
        },
      };

      // Initial update cycle before render
      loadCard.willUpdate(new Map([["hass", undefined]]));
      assert.ok(loadCard._autoEntities.includes("media_player.already_playing"));
      assert.ok(loadCard.entityIds.includes("media_player.already_playing"));
    });

    it("runs discovery when tab visibility returns from hidden", () => {
      const visCard = new YetAnotherMediaPlayerCard();
      visCard.setConfig({
        entities: ["media_player.configured_one"],
        auto_add_playing_entities: true,
      });
      visCard.hass = {
        states: {
          "media_player.configured_one": {
            entity_id: "media_player.configured_one",
            state: "idle",
            attributes: {},
          },
          "media_player.background_playing": {
            entity_id: "media_player.background_playing",
            state: "playing",
            attributes: { friendly_name: "Patio Speaker" },
          },
        },
      };

      globalThis.document = /** @type {any} */ ({ hidden: false });
      visCard._handleVisibilityChange();
      assert.ok(visCard._autoEntities.includes("media_player.background_playing"));
      delete globalThis.document;
    });
  });
});
