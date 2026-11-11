import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { localize } from "../src/localize/localize.js";
import { getArtworkUrl, resolveSelectedArtwork } from "../src/yamp-utils.js";

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
    dispatchEvent(_event) {
      return true;
    }
  }
  g.HTMLElement = MockHTMLElement;
}
if (!g.HTMLElement.prototype.dispatchEvent) {
  g.HTMLElement.prototype.dispatchEvent = function (_event) {
    return true;
  };
}
if (!g.window.Image) {
  g.window.Image = class MockImage {};
}
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerEditor } = await import("../src/yamp-editor.js");

describe("Artwork Overrides - Missing Artwork & Localization", () => {
  describe("Localization Keys", () => {
    it("resolves editor.subtitles.missing_art_match correctly in English", () => {
      const text = localize("editor.subtitles.missing_art_match");
      assert.strictEqual(text, "Applies when the selected media provides no artwork.");
    });

    it("resolves editor.subtitles.idle_image_match correctly in English", () => {
      const text = localize("editor.subtitles.idle_image_match");
      assert.strictEqual(text, "Applies when the player is idle and an idle image is displaying.");
    });
  });

  describe("Editor Serialization & Normalization", () => {
    let editor;
    let dispatchedConfig = null;

    beforeEach(() => {
      dispatchedConfig = null;
      editor = new YetAnotherMediaPlayerEditor();
      editor.dispatchEvent = (event) => {
        if (event.type === "config-changed") {
          dispatchedConfig = event.detail.config;
        }
        return true;
      };
      editor.setConfig({
        entities: ["media_player.living_room"],
      });
    });

    it("serializes missing_art override with object_fit no_artwork even when fallback URL is empty", () => {
      editor._artworkOverrides = [
        {
          match_type: "missing_art",
          match_value: "",
          image_url: "",
          size_percentage: undefined,
          object_fit: "no_artwork",
          object_position: "default",
        },
      ];

      editor._writeArtworkOverrides(editor._artworkOverrides);

      assert.ok(dispatchedConfig, "config-changed event should be dispatched");
      assert.ok(
        Array.isArray(dispatchedConfig.media_artwork_overrides),
        "media_artwork_overrides should be defined"
      );
      assert.strictEqual(dispatchedConfig.media_artwork_overrides.length, 1);
      assert.deepEqual(dispatchedConfig.media_artwork_overrides[0], {
        missing_art: true,
        object_fit: "no_artwork",
      });
    });

    it("serializes missing_art override with fallback URL when provided", () => {
      editor._artworkOverrides = [
        {
          match_type: "missing_art",
          match_value: "",
          image_url: "https://example.com/fallback.png",
          size_percentage: 90,
          object_fit: "contain",
          object_position: "center center",
        },
      ];

      editor._writeArtworkOverrides(editor._artworkOverrides);

      assert.ok(dispatchedConfig, "config-changed event should be dispatched");
      assert.deepEqual(dispatchedConfig.media_artwork_overrides[0], {
        missing_art: true,
        missing_art_url: "https://example.com/fallback.png",
        size_percentage: 90,
        object_fit: "contain",
        object_position: "center center",
      });
    });

    it("normalizes both new and legacy missing_art configurations into editor structure", () => {
      const normalizedNew = editor._normalizeArtworkOverrides([
        {
          missing_art: true,
          object_fit: "no_artwork",
        },
      ]);
      assert.deepEqual(normalizedNew, [
        {
          match_type: "missing_art",
          match_value: "",
          image_url: "",
          size_percentage: undefined,
          object_fit: "no_artwork",
          object_position: undefined,
        },
      ]);

      const normalizedLegacy = editor._normalizeArtworkOverrides([
        {
          missing_art_url: "https://example.com/legacy.png",
          size_percentage: 80,
        },
      ]);
      assert.deepEqual(normalizedLegacy, [
        {
          match_type: "missing_art",
          match_value: "",
          image_url: "https://example.com/legacy.png",
          size_percentage: 80,
          object_fit: undefined,
          object_position: undefined,
        },
      ]);
    });
  });

  describe("Runtime Artwork URL Resolution", () => {
    it("returns null URL and no_artwork objectFit for entity with no artwork matching missing_art override", () => {
      const stateWithoutArtwork = {
        entity_id: "media_player.radio",
        state: "playing",
        attributes: {
          media_title: "Radio Station Without Artwork",
        },
      };

      const result = getArtworkUrl(stateWithoutArtwork, {
        overrides: [
          {
            missing_art: true,
            object_fit: "no_artwork",
          },
        ],
        fallbackArtwork: "smart",
      });

      assert.ok(result, "getArtworkUrl should return a result object");
      assert.strictEqual(result.url, null, "url should be null when object_fit is no_artwork");
      assert.strictEqual(result.objectFit, "no_artwork", "objectFit should be no_artwork");
    });

    it("preserves actual media artwork when artwork is present even if missing_art override is configured", () => {
      const stateWithArtwork = {
        entity_id: "media_player.radio",
        state: "playing",
        attributes: {
          media_title: "Song With Cover",
          entity_picture: "http://example.com/cover.jpg",
        },
      };

      const result = getArtworkUrl(stateWithArtwork, {
        overrides: [
          {
            missing_art: true,
            object_fit: "no_artwork",
          },
        ],
      });

      assert.ok(result);
      assert.strictEqual(result.url, "http://example.com/cover.jpg");
      assert.notStrictEqual(result.objectFit, "no_artwork");
    });

    it("returns fallback URL when missing_art override provides missing_art_url", () => {
      const stateWithoutArtwork = {
        entity_id: "media_player.radio",
        state: "playing",
        attributes: {
          media_title: "No Artwork Track",
        },
      };

      const result = getArtworkUrl(stateWithoutArtwork, {
        overrides: [
          {
            missing_art: true,
            missing_art_url: "http://example.com/custom-fallback.jpg",
            object_fit: "contain",
          },
        ],
      });

      assert.ok(result);
      assert.strictEqual(result.url, "http://example.com/custom-fallback.jpg");
      assert.strictEqual(result.objectFit, "contain");
    });

    it("respects entity_id scoping on missing_art overrides", () => {
      const kitchenPlayer = {
        entity_id: "media_player.kitchen",
        state: "playing",
        attributes: {
          media_title: "Track without art",
        },
      };
      const livingRoomPlayer = {
        entity_id: "media_player.living_room",
        state: "playing",
        attributes: {
          media_title: "Track without art",
        },
      };

      const overrides = [
        {
          missing_art: true,
          entity_id: "media_player.kitchen",
          object_fit: "no_artwork",
        },
      ];

      const kitchenResult = getArtworkUrl(kitchenPlayer, { overrides });
      const livingRoomResult = getArtworkUrl(livingRoomPlayer, { overrides });

      assert.strictEqual(kitchenResult?.objectFit, "no_artwork");
      assert.strictEqual(livingRoomResult?.objectFit, null);
    });
  });

  describe("resolveSelectedArtwork with no_artwork Overrides", () => {
    it("selects metadataArtwork when objectFit is no_artwork and does not fall back to playback artwork with URL", () => {
      const metaArt = {
        url: null,
        objectFit: "no_artwork",
        sizePercentage: null,
        objectPosition: "top center",
      };
      const playArt = {
        url: "http://example.com/playback_cover.jpg",
        objectFit: "cover",
      };

      const result = resolveSelectedArtwork({
        metadataArtwork: metaArt,
        playbackArtwork: playArt,
        mainArtwork: playArt,
        displayTitle: "Track",
        playbackStateObj: /** @type {any} */ ({
          entity_id: "media_player.speaker",
          state: "playing",
          attributes: { media_title: "Track" },
        }),
      });

      assert.strictEqual(result, metaArt, "Should retain metadataArtwork with no_artwork");
      assert.strictEqual(result?.objectFit, "no_artwork");
      assert.strictEqual(result?.url, null);
    });
  });
});
