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

describe("Idle Timeout Paused Entity Linger Behavior", () => {
  /** @type {any} */
  let card;

  const APPLE_TV_ID = "media_player.living_room_apple_tv";
  const HOMEPOD_ID = "media_player.living_room_homepod_left";

  beforeEach(() => {
    card = new YetAnotherMediaPlayerCard();
    card._selectedIndex = 0;
    card.setConfig({
      entities: [
        {
          entity_id: APPLE_TV_ID,
          name: "Living Room",
          music_assistant_entity: HOMEPOD_ID,
        },
      ],
      idle_timeout_ms: 60000,
    });
    card.hass = {
      states: {
        [APPLE_TV_ID]: {
          entity_id: APPLE_TV_ID,
          state: "idle",
          attributes: {
            friendly_name: "Living Room Apple TV",
          },
        },
        [HOMEPOD_ID]: {
          entity_id: HOMEPOD_ID,
          state: "idle",
          attributes: {
            friendly_name: "Living Room HomePod",
          },
        },
      },
      callService: () => {},
    };
  });

  describe("1. Pausing Apple TV with AirPlay HomePod playing same media", () => {
    it("lingers on Apple TV and prevents switching to paired HomePod on pause", () => {
      // Both states start as "playing" with the same media title (AirPlay scenario)
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "playing",
            attributes: {
              friendly_name: "Living Room Apple TV",
              media_title: "Forky Asks a Question",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "playing",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Forky Asks a Question",
            },
          },
        },
      };

      card.render();

      // Apple TV is the active playback entity while playing
      assert.equal(
        card._getActivePlaybackEntityForIndex(0),
        APPLE_TV_ID,
        "Apple TV should be active playback entity while playing same media"
      );
      assert.equal(
        card._getActivePlaybackEntityId(0),
        APPLE_TV_ID,
        "Apple TV should be active playback entity ID while playing same media"
      );

      // Both entities transition to "paused"
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room Apple TV",
              media_title: "Forky Asks a Question",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Forky Asks a Question",
            },
          },
        },
      };

      card.render();

      // Verify linger is set to Apple TV
      assert.equal(
        card._playbackLingerByIdx?.[0]?.entityId,
        APPLE_TV_ID,
        "Linger entity ID should be Apple TV when both entities pause playing same media"
      );

      // Verify active playback entity remains Apple TV
      assert.equal(
        card._getActivePlaybackEntityForIndex(0),
        APPLE_TV_ID,
        "_getActivePlaybackEntityForIndex(0) should return Apple TV"
      );
      assert.equal(
        card._getActivePlaybackEntityId(0),
        APPLE_TV_ID,
        "_getActivePlaybackEntityId(0) should return Apple TV"
      );

      // Verify active entity does NOT switch to HomePod
      assert.notEqual(
        card._getActivePlaybackEntityForIndex(0),
        HOMEPOD_ID,
        "Active entity must not switch to HomePod when Apple TV pauses"
      );
      assert.notEqual(
        card._getActivePlaybackEntityId(0),
        HOMEPOD_ID,
        "Active entity ID must not switch to HomePod when Apple TV pauses"
      );
    });
  });

  describe("2. Pausing Apple TV without prior UI control interaction (_lastPlayingEntityIdByChip null)", () => {
    it("sets linger on Apple TV upon external pause even without prior UI control click", () => {
      // Ensure no UI control interaction was recorded
      card._lastPlayingEntityIdByChip = null;

      // Apple TV is playing
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "playing",
            attributes: {
              friendly_name: "Living Room Apple TV",
              media_title: "Forky Asks a Question",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "playing",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Forky Asks a Question",
            },
          },
        },
      };

      card.render();

      assert.equal(card._getActivePlaybackEntityForIndex(0), APPLE_TV_ID);

      // External pause occurs (e.g., physical remote pressed)
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room Apple TV",
              media_title: "Forky Asks a Question",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Forky Asks a Question",
            },
          },
        },
      };

      card.render();

      // External pause must still set linger on Apple TV
      assert.equal(
        card._playbackLingerByIdx?.[0]?.entityId,
        APPLE_TV_ID,
        "External pause must set linger on Apple TV even when _lastPlayingEntityIdByChip is null"
      );
      assert.equal(
        card._getActivePlaybackEntityForIndex(0),
        APPLE_TV_ID,
        "Active playback entity should be Apple TV"
      );
      assert.equal(
        card._getActivePlaybackEntityId(0),
        APPLE_TV_ID,
        "Active playback entity ID should be Apple TV"
      );
    });
  });

  describe("3. Pausing standalone MA entity", () => {
    it("sets linger to HomePod when standalone music playback pauses", () => {
      // HomePod is playing standalone music while Apple TV is off
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "off",
            attributes: {
              friendly_name: "Living Room Apple TV",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "playing",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Bohemian Rhapsody",
              media_artist: "Queen",
            },
          },
        },
      };

      card.render();

      assert.equal(
        card._getActivePlaybackEntityForIndex(0),
        HOMEPOD_ID,
        "HomePod should be active playback entity when playing standalone"
      );
      assert.equal(
        card._getActivePlaybackEntityId(0),
        HOMEPOD_ID,
        "HomePod should be active playback entity ID when playing standalone"
      );

      // HomePod pauses
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "off",
            attributes: {
              friendly_name: "Living Room Apple TV",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Bohemian Rhapsody",
              media_artist: "Queen",
            },
          },
        },
      };

      card.render();

      // Verify linger is set to HomePod
      assert.equal(
        card._playbackLingerByIdx?.[0]?.entityId,
        HOMEPOD_ID,
        "Linger should be set to HomePod when standalone playback pauses"
      );
      assert.equal(
        card._getActivePlaybackEntityForIndex(0),
        HOMEPOD_ID,
        "Active playback entity should remain HomePod during linger"
      );
      assert.equal(
        card._getActivePlaybackEntityId(0),
        HOMEPOD_ID,
        "Active playback entity ID should remain HomePod during linger"
      );
    });
  });

  describe("4. Resuming playback clears linger", () => {
    it("clears Apple TV linger when HomePod starts playing separate music", () => {
      // Setup Apple TV lingering
      const until = Date.now() + 60000;
      card._playbackLingerByIdx = {
        0: { entityId: APPLE_TV_ID, until },
      };
      card._lastResolvedEntityIdByChip = { 0: APPLE_TV_ID };
      card._lastActiveEntityIdByChip = { 0: APPLE_TV_ID };
      card._lastMainState = "paused";
      card._lastMaState = "paused";

      // HomePod starts playing separate music
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room Apple TV",
              media_title: "Forky Asks a Question",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "playing",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Creep",
              media_artist: "Radiohead",
            },
          },
        },
      };

      card.render();

      // Linger should be cleared or no longer point to Apple TV
      assert.ok(
        !card._playbackLingerByIdx?.[0] || card._playbackLingerByIdx[0].entityId !== APPLE_TV_ID,
        "Apple TV linger should be cleared when HomePod resumes separate playback"
      );

      // HomePod becomes active
      assert.equal(
        card._getActivePlaybackEntityForIndex(0),
        HOMEPOD_ID,
        "HomePod should become active playback entity"
      );
      assert.equal(
        card._getActivePlaybackEntityId(0),
        HOMEPOD_ID,
        "HomePod should become active playback entity ID"
      );
    });

    it("clears HomePod linger when Apple TV starts playing", () => {
      // Setup HomePod lingering
      const until = Date.now() + 60000;
      card._playbackLingerByIdx = {
        0: { entityId: HOMEPOD_ID, until },
      };
      card._lastResolvedEntityIdByChip = { 0: HOMEPOD_ID };
      card._lastActiveEntityIdByChip = { 0: HOMEPOD_ID };
      card._lastMainState = "idle";
      card._lastMaState = "paused";

      // Apple TV starts playing
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "playing",
            attributes: {
              friendly_name: "Living Room Apple TV",
              media_title: "Inception",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room HomePod",
              media_title: "Creep",
            },
          },
        },
      };

      card.render();

      // Linger should be cleared or no longer point to HomePod
      assert.ok(
        !card._playbackLingerByIdx?.[0] || card._playbackLingerByIdx[0].entityId !== HOMEPOD_ID,
        "HomePod linger should be cleared when Apple TV starts playback"
      );

      // Apple TV becomes active
      assert.equal(
        card._getActivePlaybackEntityForIndex(0),
        APPLE_TV_ID,
        "Apple TV should become active playback entity"
      );
      assert.equal(
        card._getActivePlaybackEntityId(0),
        APPLE_TV_ID,
        "Apple TV should become active playback entity ID"
      );
    });
  });

  describe("5. Linger expiration", () => {
    it("clears expired linger when Date.now() > until and falls back to standard rules", () => {
      // Setup expired linger
      const expiredUntil = Date.now() - 1000;
      card._playbackLingerByIdx = {
        0: { entityId: APPLE_TV_ID, until: expiredUntil },
      };
      card._lastResolvedEntityIdByChip = { 0: APPLE_TV_ID };
      card._lastActiveEntityIdByChip = { 0: APPLE_TV_ID };

      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room Apple TV",
            },
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "paused",
            attributes: {
              friendly_name: "Living Room HomePod",
            },
          },
        },
      };

      // Call active playback entity resolution
      const resolved = card._getActivePlaybackEntityForIndex(0);

      // Expired linger must be deleted from _playbackLingerByIdx
      assert.equal(
        card._playbackLingerByIdx?.[0],
        undefined,
        "Expired linger must be pruned from _playbackLingerByIdx"
      );

      // Resolution should return sticky or fallback entity (Apple TV in this case because it was last resolved and paused)
      assert.ok(
        resolved === APPLE_TV_ID || resolved === HOMEPOD_ID,
        "Resolved entity should be a valid entity"
      );
    });

    it("respects configured idle_timeout_ms for linger duration", () => {
      card.config.idle_timeout_ms = 45000;
      card._idleTimeoutMs = 45000;

      // Standalone HomePod playback
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "off",
            attributes: {},
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "playing",
            attributes: {
              media_title: "Song",
            },
          },
        },
      };
      card.render();

      const beforePause = Date.now();

      // HomePod pauses
      card.hass = {
        ...card.hass,
        states: {
          [APPLE_TV_ID]: {
            entity_id: APPLE_TV_ID,
            state: "off",
            attributes: {},
          },
          [HOMEPOD_ID]: {
            entity_id: HOMEPOD_ID,
            state: "paused",
            attributes: {
              media_title: "Song",
            },
          },
        },
      };
      card.render();

      const linger = card._playbackLingerByIdx?.[0];
      assert.ok(linger, "Linger entry should exist");
      const remainingMs = linger.until - beforePause;
      assert.ok(
        remainingMs >= 44500 && remainingMs <= 46000,
        `Linger duration should match idle_timeout_ms (45000ms), got ${remainingMs}ms`
      );
    });
  });
});
