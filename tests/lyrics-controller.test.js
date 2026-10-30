import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import {
  LyricsController,
  cleanTrackMetadata,
  getActiveLyricIndex,
  MAX_LYRICS_CACHE_SIZE,
} from "../src/controllers/lyrics-controller.js";

describe("LyricsController & Lyric Helpers", () => {
  describe("cleanTrackMetadata", () => {
    it("handles null, undefined, or non-string inputs safely", () => {
      assert.strictEqual(cleanTrackMetadata(null), "");
      assert.strictEqual(cleanTrackMetadata(undefined), "");
      assert.strictEqual(cleanTrackMetadata(""), "");
      assert.strictEqual(cleanTrackMetadata(123), "");
      assert.strictEqual(cleanTrackMetadata({}), "");
    });

    it("strips feat. and with annotations", () => {
      assert.strictEqual(cleanTrackMetadata("Song Title (feat. Artist B)"), "Song Title");
      assert.strictEqual(cleanTrackMetadata("Song Title (with Artist C)"), "Song Title");
    });

    it("strips brackets and parentheses annotations", () => {
      assert.strictEqual(cleanTrackMetadata("Song Title [Live in Tokyo]"), "Song Title");
      assert.strictEqual(cleanTrackMetadata("Song Title (Deluxe Edition)"), "Song Title");
    });

    it("strips remaster and single suffixes", () => {
      assert.strictEqual(cleanTrackMetadata("Song Title - 2024 Remaster"), "Song Title");
      assert.strictEqual(cleanTrackMetadata("Song Title - Remastered 2021"), "Song Title");
      assert.strictEqual(cleanTrackMetadata("Song Title - Single Version"), "Song Title");
    });

    it("splits on dash for extra info suffix", () => {
      assert.strictEqual(cleanTrackMetadata("Bohemian Rhapsody - Radio Edit"), "Bohemian Rhapsody");
    });

    it("preserves clean titles untouched", () => {
      assert.strictEqual(cleanTrackMetadata("Hotel California"), "Hotel California");
    });
  });

  describe("getActiveLyricIndex", () => {
    const sampleLyrics = [
      { time: 10, text: "First line" },
      { time: 20, text: "Second line" },
      { time: 30, text: "Third line" },
      { time: 40, text: "Fourth line" },
    ];

    it("returns -1 for empty, null, or undefined lyrics", () => {
      assert.strictEqual(getActiveLyricIndex(null, 15), -1);
      assert.strictEqual(getActiveLyricIndex(undefined, 15), -1);
      assert.strictEqual(getActiveLyricIndex([], 15), -1);
    });

    it("returns 0 for single instrumental track lyric", () => {
      const instrumental = [{ time: 0, text: "Instrumental Track", isInstrumental: true }];
      assert.strictEqual(getActiveLyricIndex(instrumental, 0), 0);
      assert.strictEqual(getActiveLyricIndex(instrumental, 50), 0);
    });

    it("returns -1 when mode is 'text'", () => {
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 25, 0, "text"), -1);
    });

    it("returns -1 for unsynced plain-text lyrics (time is null)", () => {
      const unsynced = [
        { time: null, text: "Line 1" },
        { time: null, text: "Line 2" },
      ];
      assert.strictEqual(getActiveLyricIndex(unsynced, 25), -1);
    });

    it("identifies current active line based on playback position", () => {
      // Position before first line
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 5), -1);
      // Exactly on first line
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 10), 0);
      // Between first and second line
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 15), 0);
      // Exactly on second line
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 20), 1);
      // Between second and third line
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 25), 1);
      // Past the last line
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 50), 3);
    });

    it("applies preRoll offset correctly", () => {
      // At position 8s with 3s preRoll, adjusted pos is 11s -> should match line 0 (starts at 10s)
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 8, 3), 0);
      // At position 18s with 2.5s preRoll, adjusted pos is 20.5s -> should match line 1 (starts at 20s)
      assert.strictEqual(getActiveLyricIndex(sampleLyrics, 18, 2.5), 1);
    });
  });

  describe("LyricsController (Lit Reactive Controller)", () => {
    let mockHost;

    beforeEach(() => {
      mockHost = {
        addController: mock.fn(),
        requestUpdate: mock.fn(),
        dispatchEvent: mock.fn(),
        config: { lyrics_source: "lrclib" },
        hass: {
          user: { is_admin: true },
          connection: {
            sendMessagePromise: mock.fn(),
          },
        },
        _lyricsActive: false,
        _massLyrics: [],
        _fetchingLyrics: false,
        _lyricsError: false,
        metadataStateObj: {
          attributes: {
            media_artist: "Queen",
            media_title: "Bohemian Rhapsody",
            media_album_name: "A Night at the Opera",
            media_duration: 354,
            media_content_id: "spotify://track/123",
          },
        },
      };
    });

    it("registers with host element and initializes default state", () => {
      const controller = new LyricsController(mockHost);
      assert.strictEqual(mockHost.addController.mock.callCount(), 1);
      assert.strictEqual(controller.active, false);
      assert.strictEqual(controller.loading, false);
      assert.strictEqual(controller.error, false);
      assert.deepStrictEqual(controller.lyrics, []);
      assert.strictEqual(controller.cache.size, 0);
      assert.strictEqual(controller.fetching, false);
    });

    it("toggles active state and syncs with host", () => {
      const controller = new LyricsController(mockHost);
      assert.strictEqual(controller.active, false);

      const active1 = controller.toggle();
      assert.strictEqual(active1, true);
      assert.strictEqual(controller.active, true);
      assert.strictEqual(mockHost._lyricsActive, true);
      assert.strictEqual(mockHost.requestUpdate.mock.callCount(), 1);

      const active2 = controller.toggle();
      assert.strictEqual(active2, false);
      assert.strictEqual(controller.active, false);
      assert.strictEqual(mockHost._lyricsActive, false);

      // Force explicit state
      controller.toggle(true);
      assert.strictEqual(controller.active, true);
    });

    it("stores and evicts cache entries according to MAX_LYRICS_CACHE_SIZE", () => {
      const controller = new LyricsController(mockHost);

      // Add entries up to limit
      for (let i = 0; i < MAX_LYRICS_CACHE_SIZE; i++) {
        controller.cache.set(`track_${i}:artist:title`, [{ time: 0, text: `Lyric ${i}` }]);
      }
      assert.strictEqual(controller.cache.size, MAX_LYRICS_CACHE_SIZE);

      // Verify first key
      const firstKey = controller.cache.keys().next().value;
      assert.strictEqual(firstKey, "track_0:artist:title");

      // Adding one more when reaching limit evicts the oldest key
      const oldestKey = controller.cache.keys().next().value;
      controller.cache.delete(oldestKey);
      controller.cache.set("new_track:artist:title", [{ time: 0, text: "New" }]);

      assert.strictEqual(controller.cache.size, MAX_LYRICS_CACHE_SIZE);
      assert.strictEqual(controller.cache.has("track_0:artist:title"), false);
      assert.strictEqual(controller.cache.has("new_track:artist:title"), true);
    });

    it("retrieves lyrics from cache directly on fetchLyrics()", async () => {
      const controller = new LyricsController(mockHost);
      controller.active = true;
      mockHost._lyricsActive = true;

      const cacheKey = "spotify://track/123:Queen:Bohemian Rhapsody";
      const cachedLyrics = [{ time: 10, text: "Mama, just killed a man" }];
      controller.cache.set(cacheKey, cachedLyrics);

      await controller.fetchLyrics();

      assert.deepStrictEqual(controller.lyrics, cachedLyrics);
      assert.strictEqual(controller.loading, false);
      assert.strictEqual(mockHost._fetchingLyrics, false);
      assert.deepStrictEqual(mockHost._massLyrics, cachedLyrics);
    });

    it("handles hostDisconnected by clearing timers and fetch tokens", () => {
      const controller = new LyricsController(mockHost);
      controller.fetchTimeout = setTimeout(() => {}, 10000);
      controller.currentFetchToken = Symbol();
      controller.fetchingCacheKey = "test_key";

      controller.hostDisconnected();

      assert.strictEqual(controller.fetchTimeout, null);
      assert.strictEqual(controller.currentFetchToken, null);
      assert.strictEqual(controller.fetchingCacheKey, null);
    });

    it("detects metadata changes in checkTrackLyrics and schedules debounced fetch", (context) => {
      const clock = context.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const controller = new LyricsController(mockHost);
      controller.active = true;
      mockHost._lyricsActive = true;

      controller.checkTrackLyrics();

      assert.strictEqual(controller.loading, true);
      assert.strictEqual(mockHost._fetchingLyrics, true);
      assert.notStrictEqual(controller.fetchTimeout, null);
      assert.strictEqual(controller.lastTrackId, "spotify://track/123");
      assert.strictEqual(controller.lastArtist, "Queen");
      assert.strictEqual(controller.lastTitle, "Bohemian Rhapsody");

      // Advance clock to trigger debounced fetch
      clock.tick(500);
      assert.strictEqual(controller.fetchTimeout, null);
    });

    it("resets lyrics when metadata is removed in checkTrackLyrics", () => {
      const controller = new LyricsController(mockHost);
      controller.active = true;
      mockHost._lyricsActive = true;
      controller.lastTrackId = "previous_track";
      controller.lyrics = [{ time: 0, text: "Old lyric" }];
      mockHost._massLyrics = controller.lyrics;

      // Metadata cleared
      mockHost.metadataStateObj = null;
      mockHost.currentActivePlaybackStateObj = null;
      mockHost.currentPlaybackStateObj = null;
      mockHost.currentStateObj = null;

      controller.checkTrackLyrics();

      assert.strictEqual(controller.lastTrackId, null);
      assert.deepStrictEqual(controller.lyrics, []);
      assert.strictEqual(controller.loading, false);
      assert.strictEqual(controller.error, false);
      assert.deepStrictEqual(mockHost._massLyrics, []);
      assert.strictEqual(mockHost._fetchingLyrics, false);
    });

    it("fetches synced lyrics via getLrclibLyrics with global fetch mock", async () => {
      const controller = new LyricsController(mockHost);
      const originalFetch = globalThis.fetch;

      const mockLrcResponse = {
        id: 12345,
        trackName: "Bohemian Rhapsody",
        artistName: "Queen",
        syncedLyrics: "[00:02.00] Mama, just killed a man\n[00:05.00] Put a gun against his head",
      };

      globalThis.fetch = /** @type {any} */ (
        async () => ({
          ok: true,
          status: 200,
          json: async () => mockLrcResponse,
        })
      );

      try {
        const lyrics = await controller.getLrclibLyrics(
          "Queen",
          "Bohemian Rhapsody",
          "A Night at the Opera",
          354
        );

        assert.strictEqual(lyrics.length, 2);
        assert.strictEqual(lyrics[0].time, 2);
        assert.strictEqual(lyrics[0].text, "Mama, just killed a man");
        assert.strictEqual(lyrics[1].time, 5);
        assert.strictEqual(lyrics[1].text, "Put a gun against his head");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("falls back to search when exact get returns 404 in getLrclibLyrics", async () => {
      const controller = new LyricsController(mockHost);
      const originalFetch = globalThis.fetch;

      const searchResults = [
        {
          id: 54321,
          trackName: "Bohemian Rhapsody",
          artistName: "Queen",
          syncedLyrics: "[00:03.00] Mama, life had just begun",
        },
      ];

      globalThis.fetch = /** @type {any} */ (
        async (url) => {
          if (url.includes("/api/get")) {
            return { ok: false, status: 404 };
          }
          if (url.includes("/api/search")) {
            return {
              ok: true,
              status: 200,
              json: async () => searchResults,
            };
          }
          return { ok: false, status: 500 };
        }
      );

      try {
        const lyrics = await controller.getLrclibLyrics("Queen", "Bohemian Rhapsody");
        assert.strictEqual(lyrics.length, 1);
        assert.strictEqual(lyrics[0].time, 3);
        assert.strictEqual(lyrics[0].text, "Mama, life had just begun");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("handles instrumental track responses in getLrclibLyrics", async () => {
      const controller = new LyricsController(mockHost);
      const originalFetch = globalThis.fetch;

      globalThis.fetch = /** @type {any} */ (
        async () => ({
          ok: true,
          status: 200,
          json: async () => ({ instrumental: true }),
        })
      );

      try {
        const lyrics = await controller.getLrclibLyrics("Artist", "Instrumental Song");
        assert.strictEqual(lyrics.length, 1);
        assert.strictEqual(lyrics[0].isInstrumental, true);
        assert.strictEqual(lyrics[0].time, 0);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});
