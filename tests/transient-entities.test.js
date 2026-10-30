import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  matchesEntityPattern,
  findPlayingUnconfiguredPlayers,
  searchMediaPlayers,
} from "../src/yamp-utils.js";

describe("Transient Entities Logic", () => {
  describe("matchesEntityPattern", () => {
    it("handles exact matches and case insensitivity", () => {
      assert.strictEqual(
        matchesEntityPattern("media_player.living_room_tv", ["media_player.living_room_tv"]),
        true
      );
      assert.strictEqual(
        matchesEntityPattern("media_player.Living_Room_TV", ["media_player.living_room_tv"]),
        true
      );
      assert.strictEqual(
        matchesEntityPattern("media_player.bedroom_speaker", ["media_player.living_room_tv"]),
        false
      );
    });

    it("handles wildcards", () => {
      assert.strictEqual(
        matchesEntityPattern("media_player.living_room_tv", ["media_player.*_tv"]),
        true
      );
      assert.strictEqual(
        matchesEntityPattern("media_player.bedroom_tv", ["media_player.*_tv"]),
        true
      );
      assert.strictEqual(
        matchesEntityPattern("media_player.bedroom_speaker", ["media_player.*_tv"]),
        false
      );
      assert.strictEqual(matchesEntityPattern("media_player.sonos_kitchen", ["*sonos*"]), true);
    });

    it("handles comma-separated strings or empty patterns", () => {
      assert.strictEqual(
        matchesEntityPattern("media_player.tv", "media_player.radio, media_player.tv"),
        true
      );
      assert.strictEqual(matchesEntityPattern("media_player.tv", []), false);
      assert.strictEqual(matchesEntityPattern("media_player.tv", null), false);
    });

    it("handles friendly_name matching with wildcards and domains", () => {
      // User case: media_player.*frame excluding Bedroom Frame TV and Guest Room Frame
      assert.strictEqual(
        matchesEntityPattern(
          "media_player.bedroom_tv",
          ["media_player.*frame"],
          "Bedroom Frame TV"
        ),
        true
      );
      assert.strictEqual(
        matchesEntityPattern(
          "media_player.guest_room_tv_2",
          ["media_player.*frame"],
          "Guest Room Frame"
        ),
        true
      );
      // Keyword matching
      assert.strictEqual(
        matchesEntityPattern("media_player.bedroom_tv", ["frame"], "Bedroom Frame TV"),
        true
      );
      // Non-matching
      assert.strictEqual(
        matchesEntityPattern(
          "media_player.kitchen_speaker",
          ["media_player.*frame"],
          "Kitchen Sonos"
        ),
        false
      );
    });
  });

  describe("findPlayingUnconfiguredPlayers", () => {
    const states = {
      "media_player.configured_one": {
        state: "playing",
        attributes: { media_title: "Song A", media_artist: "Artist A" },
      },
      "media_player.tv_bedroom": {
        state: "playing",
        attributes: {
          friendly_name: "Bedroom TV",
          media_title: "Movie X",
          media_artist: "Director Y",
        },
      },
      "media_player.kitchen_physical": {
        state: "playing",
        attributes: { media_title: "Track 1", media_artist: "Band 1" },
      },
      "media_player.kitchen_mass": {
        state: "playing",
        attributes: {
          app_id: "music_assistant",
          mass_player_type: "player",
          media_title: "Track 1",
          media_artist: "Band 1",
        },
      },
      "media_player.patio_idle": {
        state: "idle",
        attributes: { friendly_name: "Patio" },
      },
      "media_player.office_excluded": {
        state: "playing",
        attributes: { friendly_name: "Office Speaker", media_title: "Radio", media_artist: "Host" },
      },
    };

    it("finds playing players not in coveredSet", () => {
      const covered = new Set(["media_player.configured_one"]);
      const found = findPlayingUnconfiguredPlayers(states, covered, ["media_player.*_excluded"]);

      assert.ok(found.includes("media_player.tv_bedroom"));
      assert.ok(!found.includes("media_player.configured_one"));
      assert.ok(!found.includes("media_player.patio_idle"));
      assert.ok(!found.includes("media_player.office_excluded"));
    });

    it("deduplicates physical player when Music Assistant twin is playing same track", () => {
      const covered = new Set(["media_player.configured_one"]);
      const found = findPlayingUnconfiguredPlayers(states, covered, []);

      // Between kitchen_physical and kitchen_mass, prefer kitchen_mass
      assert.ok(found.includes("media_player.kitchen_mass"));
      assert.ok(!found.includes("media_player.kitchen_physical"));
    });

    it("suppresses twin if already covered player is playing same track", () => {
      const covered = new Set(["media_player.configured_one"]);
      const extraStates = {
        ...states,
        "media_player.configured_one_physical": {
          state: "playing",
          attributes: { media_title: "Song A", media_artist: "Artist A" },
        },
      };
      const found = findPlayingUnconfiguredPlayers(extraStates, covered, []);
      assert.ok(!found.includes("media_player.configured_one_physical"));
    });
  });

  describe("searchMediaPlayers", () => {
    const states = {
      "media_player.configured_speaker": {
        state: "playing",
        attributes: { friendly_name: "Configured Speaker" },
      },
      "media_player.living_room_tv": {
        state: "off",
        attributes: { friendly_name: "Living Room TV", icon: "mdi:television" },
      },
      "media_player.bedroom_speaker": {
        state: "playing",
        attributes: { friendly_name: "Bedroom Speaker" },
      },
      "media_player.office_excluded": {
        state: "playing",
        attributes: { friendly_name: "Office TV" },
      },
      "media_player.broken": {
        state: "unavailable",
        attributes: { friendly_name: "Broken Device" },
      },
    };

    it("filters covered, unavailable, and excluded players", () => {
      const results = searchMediaPlayers(states, "", new Set(["media_player.configured_speaker"]), [
        "media_player.office_*",
      ]);

      const ids = results.map((r) => r.id);
      assert.ok(ids.includes("media_player.living_room_tv"));
      assert.ok(ids.includes("media_player.bedroom_speaker"));
      assert.ok(!ids.includes("media_player.configured_speaker"));
      assert.ok(!ids.includes("media_player.broken"));
      assert.ok(!ids.includes("media_player.office_excluded"));
    });

    it("sorts playing entities first and matches query", () => {
      const results = searchMediaPlayers(states, "tv", [], []);
      assert.strictEqual(results.length, 2);
      // Office TV is playing so it comes before Living Room TV which is off
      assert.strictEqual(results[0].id, "media_player.office_excluded");
      assert.strictEqual(results[1].id, "media_player.living_room_tv");
    });

    it("excludes entities whose friendly_name matches wildcard patterns like media_player.*frame", () => {
      const frameStates = {
        "media_player.bedroom_tv": {
          state: "on",
          attributes: { friendly_name: "Bedroom Frame TV" },
        },
        "media_player.guest_room_tv_2": {
          state: "on",
          attributes: { friendly_name: "Guest Room Frame" },
        },
        "media_player.living_room_tv": {
          state: "on",
          attributes: { friendly_name: "Living Room TV" },
        },
      };

      const results = searchMediaPlayers(frameStates, "frame", [], ["media_player.*frame"]);
      // Both Frame TVs should be excluded by the pattern media_player.*frame
      assert.strictEqual(results.length, 0);

      // Without exclusion, searching "frame" returns both
      const unfiltered = searchMediaPlayers(frameStates, "frame", [], []);
      assert.strictEqual(unfiltered.length, 2);
    });
  });

  describe("Session Entity Active Selection", async () => {
    // Setup mock browser globals if needed
    const g = /** @type {any} */ (globalThis);
    if (!g.window) g.window = globalThis;
    if (!g.customElements) g.customElements = { define() {} };
    if (!g.HTMLElement) {
      class MockHTMLElement {
        attachShadow() {
          return {};
        }
      }
      g.HTMLElement = MockHTMLElement;
    }
    if (!g.__VERSION__) g.__VERSION__ = "1.0.0-test";

    const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");

    it("makes the added session player the active entity by default and triggers selection feedback", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room", "media_player.kitchen"],
      });
      card.hass = {
        states: {
          "media_player.living_room": { entity_id: "media_player.living_room", state: "idle" },
          "media_player.kitchen": { entity_id: "media_player.kitchen", state: "idle" },
          "media_player.office": { entity_id: "media_player.office", state: "playing" },
        },
      };

      assert.strictEqual(card.currentEntityId, "media_player.living_room");
      assert.strictEqual(card._selectedIndex, 0);

      // Add unconfigured player to session
      card._addSessionEntity("media_player.office");

      // Newly added player must now be the active entity
      assert.strictEqual(card.currentEntityId, "media_player.office");
      assert.strictEqual(card._selectedIndex, 2);
      assert.strictEqual(card._justSelectedGroupingEntityId, "media_player.office");
    });

    it("does not change active entity when makeActive is explicitly false or when promoting auto player", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room"],
      });
      card.hass = {
        states: {
          "media_player.living_room": { entity_id: "media_player.living_room", state: "idle" },
          "media_player.patio": { entity_id: "media_player.patio", state: "idle" },
          "media_player.garage": { entity_id: "media_player.garage", state: "idle" },
        },
      };

      // Add patio with makeActive = false
      card._addSessionEntity("media_player.patio", false);
      assert.strictEqual(card.currentEntityId, "media_player.living_room");
      assert.strictEqual(card._selectedIndex, 0);

      // Auto-add garage and promote
      card._setTransientEntities({ auto: ["media_player.garage"] });
      assert.strictEqual(card.currentEntityId, "media_player.living_room");

      card._promoteAutoToSession("media_player.garage");
      assert.strictEqual(card.currentEntityId, "media_player.living_room");
      assert.strictEqual(card._selectedIndex, 0);
    });
  });
});
