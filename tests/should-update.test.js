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

    it("retains session entities when card is reconfigured with additional entities in setConfig", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.kitchen"] });
      card._addSessionEntity("media_player.patio");

      const key = card._getSessionStorageKey();
      assert.strictEqual(key, "yamp_session_players_media_player.kitchen");
      assert.ok(mockStore.has(key));

      // User reconfigures card by adding a secondary entity in the editor
      card.setConfig({
        entities: [{ entity: "media_player.kitchen" }, { entity: "media_player.bedroom" }],
      });
      // Storage key must remain stable based on primary entity!
      assert.strictEqual(card._getSessionStorageKey(), key);
      // patio must be preserved in sessionEntities and storage!
      assert.ok(card._sessionEntities.includes("media_player.patio"));
      const parsed = JSON.parse(mockStore.get(key));
      assert.deepStrictEqual(parsed.entities, ["media_player.patio"]);
    });

    it("isolates storage between multiple cards on the same dashboard", () => {
      const cardKitchen = new YetAnotherMediaPlayerCard();
      cardKitchen.setConfig({ entities: ["media_player.kitchen"] });
      cardKitchen._addSessionEntity("media_player.patio");

      const cardLivingRoom = new YetAnotherMediaPlayerCard();
      cardLivingRoom.setConfig({ entities: ["media_player.living_room"] });

      // Each card has its own isolated key
      assert.strictEqual(
        cardKitchen._getSessionStorageKey(),
        "yamp_session_players_media_player.kitchen"
      );
      assert.strictEqual(
        cardLivingRoom._getSessionStorageKey(),
        "yamp_session_players_media_player.living_room"
      );

      // Living room card mounting or reconfiguring does not wipe kitchen card's session entity
      cardLivingRoom.setConfig({ entities: ["media_player.living_room", "media_player.den"] });
      assert.ok(mockStore.has("yamp_session_players_media_player.kitchen"));
      const kitchenData = JSON.parse(mockStore.get("yamp_session_players_media_player.kitchen"));
      assert.deepStrictEqual(kitchenData.entities, ["media_player.patio"]);
    });

    it("migrates session data when primary entity is reordered on the card", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.kitchen", "media_player.patio"] });
      card._addSessionEntity("media_player.den");
      assert.ok(mockStore.has("yamp_session_players_media_player.kitchen"));

      // User reorders entities so patio is first
      card.setConfig({ entities: ["media_player.patio", "media_player.kitchen"] });
      assert.strictEqual(card._getSessionStorageKey(), "yamp_session_players_media_player.patio");
      assert.ok(mockStore.has("yamp_session_players_media_player.patio"));
      assert.strictEqual(mockStore.has("yamp_session_players_media_player.kitchen"), false);
      assert.ok(card._sessionEntities.includes("media_player.den"));
    });

    it("graduates session entity to permanent configured entity when added to config.entities", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.kitchen"] });
      card._addSessionEntity("media_player.patio");
      assert.ok(card._sessionEntities.includes("media_player.patio"));

      // User permanently adds patio to card config
      card.setConfig({
        entities: ["media_player.kitchen", "media_player.patio"],
      });
      // patio is now a permanent configured entity, so it graduates out of sessionEntities
      assert.strictEqual(card._sessionEntities.includes("media_player.patio"), false);
      const key = card._getSessionStorageKey();
      assert.strictEqual(mockStore.get(key), undefined);
    });

    it("migrates legacy default session storage key to the primary entity key", () => {
      // Simulate an existing legacy key from a previous session
      const legacyKey = "yamp_session_players_default";
      mockStore.set(
        legacyKey,
        JSON.stringify({
          entities: ["media_player.patio"],
          updatedAt: Date.now(),
        })
      );

      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.kitchen"] });

      const stableKey = card._getSessionStorageKey();
      assert.strictEqual(stableKey, "yamp_session_players_media_player.kitchen");
      assert.ok(card._sessionEntities.includes("media_player.patio"));
      assert.ok(mockStore.has(stableKey));
      assert.strictEqual(
        mockStore.has(legacyKey),
        false,
        "Legacy key should be migrated and removed"
      );
    });

    it("does not mutate or delete localStorage when running as editor preview", () => {
      const stableKey = "yamp_session_players_media_player.kitchen";
      mockStore.set(
        stableKey,
        JSON.stringify({
          entities: ["media_player.patio"],
          updatedAt: Date.now(),
        })
      );

      const previewCard = new YetAnotherMediaPlayerCard();
      previewCard.preview = true; // Editor preview flag
      assert.strictEqual(previewCard._isEditorPreview, true);

      // setConfig on preview card should NOT delete or overwrite existing storage
      previewCard.setConfig({
        entities: ["media_player.kitchen"],
      });
      assert.ok(mockStore.has(stableKey));

      // _saveStoredSessionEntities should be a no-op in preview
      previewCard._saveStoredSessionEntities([]);
      assert.ok(mockStore.has(stableKey), "Storage should not be cleared by preview");
    });

    it("uses isolated storage keys when card_id is configured", () => {
      const cardA = new YetAnotherMediaPlayerCard();
      cardA.setConfig({
        card_id: "living_room_card",
        entities: ["media_player.living_room"],
      });
      assert.strictEqual(cardA._getSessionStorageKey(), "yamp_session_players_living_room_card");

      const cardB = new YetAnotherMediaPlayerCard();
      cardB.setConfig({
        entities: ["media_player.kitchen"],
      });
      assert.strictEqual(
        cardB._getSessionStorageKey(),
        "yamp_session_players_media_player.kitchen"
      );
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

  describe("Favorite Button Discovery & Caching", () => {
    it("caches favorite button entity on card instance and avoids redundant lookups", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({
        entities: ["media_player.living_room"],
      });

      card.hass = {
        states: {
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "playing",
            attributes: { friendly_name: "Living Room" },
          },
          "button.living_room_favorite": {
            entity_id: "button.living_room_favorite",
            state: "2026-10-18T12:00:00Z",
            attributes: { friendly_name: "Favorite" },
          },
        },
        entities: {
          "media_player.living_room": { device_id: "dev_lr" },
          "button.living_room_favorite": { device_id: "dev_lr" },
        },
      };

      let discoveryCallCount = 0;
      const originalFind = card._findAssociatedButtonEntities;
      card._findAssociatedButtonEntities = function (id) {
        discoveryCallCount++;
        return originalFind.call(this, id);
      };

      const firstCall = card._getFavoriteButtonEntity();
      assert.strictEqual(firstCall, "button.living_room_favorite");
      assert.strictEqual(discoveryCallCount, 1);

      // Second call should return from _favoriteButtonCache without running discovery
      const secondCall = card._getFavoriteButtonEntity();
      assert.strictEqual(secondCall, "button.living_room_favorite");
      assert.strictEqual(discoveryCallCount, 1);
      assert.strictEqual(
        card._favoriteButtonCache.get("media_player.living_room"),
        "button.living_room_favorite"
      );
    });

    it("clears favorite button cache when hass.entities reference changes", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.living_room"] });

      const initialEntities = {
        "media_player.living_room": { device_id: "dev_1" },
        "button.living_room_favorite": { device_id: "dev_1" },
      };

      card.hass = {
        states: {
          "media_player.living_room": { entity_id: "media_player.living_room", attributes: {} },
          "button.living_room_favorite": {
            entity_id: "button.living_room_favorite",
            attributes: {},
          },
          "button.new_favorite": { entity_id: "button.new_favorite", attributes: {} },
        },
        entities: initialEntities,
      };

      card._getFavoriteButtonEntity();
      assert.strictEqual(card._favoriteButtonCache.size, 1);

      // Simulating entity registry change (new reference)
      card.hass = {
        ...card.hass,
        entities: {
          "media_player.living_room": { device_id: "dev_2" },
          "button.new_favorite": { device_id: "dev_2" },
        },
      };

      const result = card._getFavoriteButtonEntity();
      assert.strictEqual(result, "button.new_favorite");
    });

    it("clears favorite button cache on setConfig", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({ entities: ["media_player.living_room"] });
      card._favoriteButtonCache = new Map([["media_player.living_room", "button.favorite"]]);

      card.setConfig({ entities: ["media_player.bedroom"] });
      assert.strictEqual(card._favoriteButtonCache.size, 0);
    });
  });
});
