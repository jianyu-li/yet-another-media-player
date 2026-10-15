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

  describe("Session & Pinned Entities Persistence (localStorage)", () => {
    let mockStore;

    beforeEach(() => {
      mockStore = new Map();
      globalThis.localStorage = /** @type {any} */ ({
        getItem: (key) => mockStore.get(key) || null,
        setItem: (key, val) => mockStore.set(key, String(val)),
        removeItem: (key) => mockStore.delete(key),
        clear: () => mockStore.clear(),
        get length() {
          return mockStore.size;
        },
        key: (i) => Array.from(mockStore.keys())[i] || null,
      });
    });

    it("persists promoted session entity to localStorage and restores it after page reload even when paused", () => {
      const cardA = new YetAnotherMediaPlayerCard();
      cardA.setConfig({
        entities: ["media_player.main_speaker"],
      });
      cardA.hass = {
        states: {
          "media_player.main_speaker": {
            entity_id: "media_player.main_speaker",
            state: "idle",
            attributes: {},
          },
          "media_player.bedroom_tv": {
            entity_id: "media_player.bedroom_tv",
            state: "playing",
            attributes: { friendly_name: "Bedroom TV" },
          },
        },
      };

      // Auto-entity is discovered or added, then user pins it in the players menu
      cardA._promoteAutoToSession("media_player.bedroom_tv");
      assert.ok(cardA._sessionEntities.includes("media_player.bedroom_tv"));

      const key = cardA._getSessionStorageKey();
      assert.ok(mockStore.has(key));
      const parsed = JSON.parse(mockStore.get(key));
      assert.deepStrictEqual(parsed.entities, ["media_player.bedroom_tv"]);

      // Now user pauses playback and refreshes browser (fresh card instance constructed)
      const reloadedCard = new YetAnotherMediaPlayerCard();
      reloadedCard.setConfig({
        entities: ["media_player.main_speaker"],
      });
      reloadedCard.hass = {
        states: {
          "media_player.main_speaker": {
            entity_id: "media_player.main_speaker",
            state: "idle",
            attributes: {},
          },
          "media_player.bedroom_tv": {
            entity_id: "media_player.bedroom_tv",
            state: "paused", // PAUSED playback
            attributes: { friendly_name: "Bedroom TV" },
          },
        },
      };

      // Restored from localStorage on setConfig
      assert.ok(reloadedCard._sessionEntities.includes("media_player.bedroom_tv"));
      assert.ok(reloadedCard.entityIds.includes("media_player.bedroom_tv"));

      const bedroomObj = reloadedCard.entityObjs.find(
        (e) => e.entity_id === "media_player.bedroom_tv"
      );
      assert.strictEqual(bedroomObj?.transient, "session");
    });

    it("removes entity from localStorage when dismissed via _removeSessionEntity", () => {
      const cardA = new YetAnotherMediaPlayerCard();
      cardA.setConfig({
        entities: ["media_player.main_speaker"],
      });
      cardA._addSessionEntity("media_player.bedroom_tv");
      assert.ok(cardA._sessionEntities.includes("media_player.bedroom_tv"));

      // User dismisses entity via close button
      cardA._removeSessionEntity("media_player.bedroom_tv");
      assert.strictEqual(cardA._sessionEntities.length, 0);

      const key = cardA._getSessionStorageKey();
      assert.strictEqual(mockStore.get(key), undefined);
    });

    it("promotes auto entity to session and persists to localStorage on chip long-press pin", () => {
      const cardA = new YetAnotherMediaPlayerCard();
      cardA.setConfig({
        entities: ["media_player.main_speaker"],
        hold_to_pin: true,
      });
      cardA.hass = {
        states: {
          "media_player.main_speaker": {
            entity_id: "media_player.main_speaker",
            state: "idle",
            attributes: {},
          },
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "playing",
            attributes: {},
          },
        },
      };

      cardA._setTransientEntities({ auto: ["media_player.living_room"] });
      const idx = cardA.entityIds.indexOf("media_player.living_room");
      assert.ok(idx >= 0);

      cardA._pinChip(idx);
      assert.ok(cardA._sessionEntities.includes("media_player.living_room"));
      assert.strictEqual(cardA._pinnedIndex, idx);

      const key = cardA._getSessionStorageKey();
      assert.ok(mockStore.has(key));
    });

    it("prunes orphaned or expired storage keys older than 7 days", () => {
      const cardA = new YetAnotherMediaPlayerCard();
      cardA.setConfig({ entities: ["media_player.active_card"] });

      // Simulate an old orphaned key from a removed card (8 days old)
      const oldKey = "yamp_session_players_media_player.deleted_card";
      mockStore.set(
        oldKey,
        JSON.stringify({
          entities: ["media_player.some_player"],
          updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
        })
      );

      // Simulate an active recent key (1 hour old)
      const activeKey = "yamp_session_players_media_player.recent_card";
      mockStore.set(
        activeKey,
        JSON.stringify({
          entities: ["media_player.other_player"],
          updatedAt: Date.now() - 3600 * 1000,
        })
      );

      cardA._pruneOrphanStorageKeys();

      assert.strictEqual(mockStore.has(oldKey), false, "Old orphaned card key should be pruned");
      assert.strictEqual(mockStore.has(activeKey), true, "Recent key should be retained");
    });

    it("migrates session entities and removes old storage key when card entities change in setConfig", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.kitchen"] });
      card._addSessionEntity("media_player.patio");

      const oldKey = "yamp_session_players_media_player.kitchen";
      assert.ok(mockStore.has(oldKey));

      // User reconfigures card with different entities
      card.setConfig({ entities: ["media_player.bedroom"] });
      assert.strictEqual(
        mockStore.has(oldKey),
        false,
        "Old key should be deleted upon reconfiguration"
      );

      const newKey = "yamp_session_players_media_player.bedroom";
      assert.ok(mockStore.has(newKey), "New key should be created with migrated session entities");
      assert.deepStrictEqual(card._sessionEntities, ["media_player.patio"]);
    });

    it("prunes session entities that no longer exist in hass.states", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.kitchen"] });
      card._setTransientEntities({
        session: ["media_player.deleted_entity", "media_player.existing_entity"],
      });

      card.hass = {
        states: {
          "media_player.kitchen": { state: "idle" },
          "media_player.existing_entity": { state: "playing" },
        },
      };

      card._pruneMissingSessionEntities();
      assert.deepStrictEqual(card._sessionEntities, ["media_player.existing_entity"]);
    });
  });
});
