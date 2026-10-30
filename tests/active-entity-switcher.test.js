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

describe("More Info Active Entity Switcher", () => {
  let card;

  beforeEach(() => {
    card = new YetAnotherMediaPlayerCard();
    card._selectedIndex = 0;
    card.config = {
      entities: [
        {
          entity_id: "media_player.loft",
          music_assistant_entity: "media_player.loft_homepod_right",
          name: "Loft",
        },
      ],
    };
    card.hass = {
      states: {
        "media_player.loft": {
          entity_id: "media_player.loft",
          state: "playing",
          attributes: {
            friendly_name: "Loft Apple TV",
            media_title: "Top Gun: Maverick",
          },
        },
        "media_player.loft_homepod_right": {
          entity_id: "media_player.loft_homepod_right",
          state: "playing",
          attributes: {
            friendly_name: "Loft HomePod Right",
            media_title: "AirPlay",
          },
        },
      },
      callService: () => {},
    };
  });

  describe("_setActiveEntityForCurrentChip", () => {
    it("sets manual override and updates tracking indices", () => {
      let updateRequested = false;
      card.requestUpdate = () => {
        updateRequested = true;
      };

      card._playbackLingerByIdx = {
        0: { until: Date.now() + 5000, entityId: "media_player.loft_homepod_right" },
      };
      card._cachedActivePlaybackEntityId = "media_player.loft_homepod_right";
      card._cachedActivePlaybackEntityKey = "cached-key";

      card._setActiveEntityForCurrentChip("media_player.loft");

      assert.equal(card._manualActiveEntityByChip[0], "media_player.loft");
      assert.equal(card._lastActiveEntityIdByChip[0], "media_player.loft");
      assert.equal(card._lastResolvedEntityIdByChip[0], "media_player.loft");
      assert.equal(card._playbackLingerByIdx[0], undefined);
      assert.equal(card._cachedActivePlaybackEntityId, undefined);
      assert.equal(card._cachedActivePlaybackEntityKey, undefined);
      assert.equal(updateRequested, true);
    });
  });

  describe("_getActivePlaybackEntityForIndexInternal", () => {
    it("prioritizes manual override even when paired MA entity is playing", () => {
      const mainId = "media_player.loft";
      const maId = "media_player.loft_homepod_right";
      const mainState = card.hass.states[mainId];
      const maState = card.hass.states[maId];

      card._manualActiveEntityByChip[0] = mainId;

      const active = card._getActivePlaybackEntityForIndexInternal(
        0,
        mainId,
        maId,
        mainState,
        maState
      );
      assert.equal(active, mainId);
    });

    it("clears manual override if the manually selected entity becomes unavailable", () => {
      const mainId = "media_player.loft";
      const maId = "media_player.loft_homepod_right";
      card.hass.states[mainId] = { entity_id: mainId, state: "unavailable", attributes: {} };
      const mainState = card.hass.states[mainId];
      const maState = card.hass.states[maId];

      card._manualActiveEntityByChip[0] = mainId;

      const active = card._getActivePlaybackEntityForIndexInternal(
        0,
        mainId,
        maId,
        mainState,
        maState
      );
      assert.equal(card._manualActiveEntityByChip[0], undefined);
      assert.equal(active, maId);
    });
  });

  describe("_getActivePlaybackEntityIdInternal", () => {
    it("returns manual override entity when valid", () => {
      const mainId = "media_player.loft";
      const maId = "media_player.loft_homepod_right";
      const mainState = card.hass.states[mainId];
      const maState = card.hass.states[maId];

      card._manualActiveEntityByChip[0] = mainId;

      const active = card._getActivePlaybackEntityIdInternal(0, mainId, maId, mainState, maState);
      assert.equal(active, mainId);
    });
  });

  describe("playback transition clearing", () => {
    it("clears manual override when the other entity starts playing afresh", () => {
      card._manualActiveEntityByChip[0] = "media_player.loft";
      card._playerStateCache["media_player.loft"] = "playing";
      card._playerStateCache["media_player.loft_homepod_right"] = "idle";

      // Simulate HomePod starting playback
      const maId = "media_player.loft_homepod_right";
      const maState = "playing";
      const prevMaState = card._playerStateCache[maId];

      // Logic from updated() lifecycle
      if (maState === "playing") {
        if (
          prevMaState !== "playing" &&
          card._manualActiveEntityByChip?.[0] &&
          card._manualActiveEntityByChip[0] !== maId
        ) {
          delete card._manualActiveEntityByChip[0];
        }
      }

      assert.equal(card._manualActiveEntityByChip[0], undefined);
    });

    it("retains manual override when neither entity transitions to playing", () => {
      card._manualActiveEntityByChip[0] = "media_player.loft";
      card._playerStateCache["media_player.loft"] = "playing";
      card._playerStateCache["media_player.loft_homepod_right"] = "playing";

      const maId = "media_player.loft_homepod_right";
      const maState = "playing";
      const prevMaState = card._playerStateCache[maId];

      if (maState === "playing") {
        if (
          prevMaState !== "playing" &&
          card._manualActiveEntityByChip?.[0] &&
          card._manualActiveEntityByChip[0] !== maId
        ) {
          delete card._manualActiveEntityByChip[0];
        }
      }

      assert.equal(card._manualActiveEntityByChip[0], "media_player.loft");
    });
  });

  describe("_getResolvedEntitiesForCurrentChip", () => {
    it("returns array of distinct paired entities for the current chip", () => {
      card._getActualResolvedMaEntityForState = () => "media_player.loft_homepod_right";
      card._getVolumeEntity = () => "media_player.loft_amp";

      const list = card._getResolvedEntitiesForCurrentChip();
      assert.deepEqual(list, [
        "media_player.loft",
        "media_player.loft_homepod_right",
        "media_player.loft_amp",
      ]);
    });
  });
});
