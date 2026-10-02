import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveSelectedArtwork } from "../src/yamp-utils.js";

/**
 * Helper to build a mock HassEntity.
 * @param {Record<string, any>} [partial]
 * @returns {import("../src/types.d.ts").HassEntity}
 */
const mockEntity = (partial = {}) =>
  /** @type {any} */ ({
    entity_id: "media_player.test",
    state: "playing",
    attributes: {},
    last_changed: "",
    last_updated: "",
    context: { id: "1", parent_id: null, user_id: null },
    ...partial,
  });

describe("artwork-fallback (resolveSelectedArtwork)", () => {
  describe("Metadata Artwork Priority", () => {
    it("always selects metadata artwork when a valid URL is present", () => {
      const metaArt = {
        url: "http://example.com/meta.jpg",
        objectFit: "contain",
        sizePercentage: 100,
        objectPosition: "center",
      };
      const playArt = { url: "http://example.com/play.jpg" };
      const mainArt = { url: "http://example.com/main.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: metaArt,
        playbackArtwork: playArt,
        mainArtwork: mainArt,
        displayTitle: "Song A",
        playbackStateObj: mockEntity({ attributes: { media_title: "Song A" } }),
        mainState: mockEntity({ attributes: { media_title: "Song A" } }),
      });

      assert.deepEqual(result, metaArt);
    });

    it("prioritizes metadata artwork even when playback and main entities report different media", () => {
      const metaArt = { url: "http://example.com/meta.jpg" };
      const playArt = { url: "http://example.com/play.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: metaArt,
        playbackArtwork: playArt,
        displayTitle: "Active Metadata Song",
        playbackStateObj: mockEntity({ attributes: { media_title: "Other Song" } }),
        isPlayingSameMedia: false,
      });

      assert.deepEqual(result, metaArt);
    });
  });

  describe("Matching Title Fallback", () => {
    it("falls back to playback artwork when metadata artwork is missing and titles match", () => {
      const playArt = {
        url: "http://example.com/playback.jpg",
        objectFit: "cover",
      };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: playArt,
        displayTitle: "Bohemian Rhapsody",
        playbackStateObj: mockEntity({ attributes: { media_title: "Bohemian Rhapsody" } }),
      });

      assert.deepEqual(result, playArt);
    });

    it("matches titles case-insensitively and ignores leading/trailing whitespace", () => {
      const playArt = { url: "http://example.com/playback.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: { url: null },
        playbackArtwork: playArt,
        displayTitle: "Hotel California",
        playbackStateObj: mockEntity({ attributes: { media_title: "  hotel california  " } }),
      });

      assert.deepEqual(result, playArt);
    });

    it("falls back to main entity artwork if playback entity has no artwork but main entity matches title", () => {
      const mainArt = { url: "http://example.com/main.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: null,
        mainArtwork: mainArt,
        displayTitle: "Imagine",
        mainState: mockEntity({ attributes: { media_title: "Imagine" } }),
      });

      assert.deepEqual(result, mainArt);
    });
  });

  describe("Same Media (AirPlay / Paired Audio) Fallback", () => {
    it("allows fallback to playback artwork when isPlayingSameMedia is true, even if titles differ", () => {
      const playArt = { url: "http://example.com/airplay-source.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: playArt,
        displayTitle: "Living Room Apple TV", // Metadata shows receiver device name
        playbackStateObj: mockEntity({ attributes: { media_title: "Actual Music Track" } }),
        isPlayingSameMedia: true,
      });

      assert.deepEqual(result, playArt);
    });

    it("allows fallback to main entity artwork when isPlayingSameMedia is true and playback artwork is missing", () => {
      const mainArt = { url: "http://example.com/main-paired.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: null,
        mainArtwork: mainArt,
        displayTitle: "YouTube Stream",
        mainState: mockEntity({ attributes: { media_title: "AirPlay" } }),
        isPlayingSameMedia: true,
      });

      assert.deepEqual(result, mainArt);
    });
  });

  describe("Critical Stale Artwork Leak Blocker", () => {
    it("strictly blocks playback artwork when displayTitle is present but playback title mismatches", () => {
      const stalePlayArt = { url: "http://example.com/stale-yesterday-song.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: stalePlayArt,
        displayTitle: "Song A",
        playbackStateObj: mockEntity({ attributes: { media_title: "Song B" } }),
        isPlayingSameMedia: false,
      });

      // Crucial: Must NOT return stale artwork for Song B while displaying Song A!
      assert.equal(result, null);
    });

    it("strictly blocks main entity artwork when displayTitle is present but main title mismatches", () => {
      const staleMainArt = { url: "http://example.com/stale-old-album.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: null,
        mainArtwork: staleMainArt,
        displayTitle: "New Current Track",
        mainState: mockEntity({ attributes: { media_title: "Old Previous Track" } }),
        isPlayingSameMedia: false,
      });

      assert.equal(result, null);
    });

    it("strictly blocks stale artwork when metadata entity has empty string url", () => {
      const stalePlayArt = { url: "http://example.com/stale.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: { url: "" },
        playbackArtwork: stalePlayArt,
        displayTitle: "Active Playing Track",
        playbackStateObj: mockEntity({ attributes: { media_title: "Completely Different Track" } }),
        isPlayingSameMedia: false,
      });

      assert.equal(result, null);
    });
  });

  describe("No Display Title Fallback (System Sounds, Gaming, Idle)", () => {
    it("falls back to playback artwork when displayTitle is null", () => {
      const playArt = { url: "http://example.com/system-audio.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: playArt,
        displayTitle: null,
        playbackStateObj: mockEntity({ attributes: {} }),
      });

      assert.deepEqual(result, playArt);
    });

    it("falls back to main artwork when displayTitle is empty string and playback artwork is missing", () => {
      const mainArt = { url: "http://example.com/game-artwork.jpg" };

      const result = resolveSelectedArtwork({
        metadataArtwork: null,
        playbackArtwork: null,
        mainArtwork: mainArt,
        displayTitle: "",
      });

      assert.deepEqual(result, mainArt);
    });

    it("returns null when no artwork is available anywhere", () => {
      assert.equal(resolveSelectedArtwork({}), null);
      assert.equal(
        resolveSelectedArtwork({
          metadataArtwork: null,
          playbackArtwork: null,
          mainArtwork: null,
          displayTitle: "No Artwork Track",
        }),
        null
      );
    });
  });
});
