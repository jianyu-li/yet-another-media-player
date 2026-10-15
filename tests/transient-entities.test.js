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
  });
});
