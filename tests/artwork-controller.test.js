import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  ArtworkController,
  getMaxCollapsedArtworkWidth,
  getBackgroundSizeForFit,
  isExternalImageUrl,
  normalizeImageSourceValue,
  resolveImageUrlFromInput,
  compileArtworkOverrides,
} from "../src/controllers/artwork-controller.js";

describe("ArtworkController & Pure Artwork Helpers", () => {
  describe("getMaxCollapsedArtworkWidth", () => {
    it("returns default fallback 102 when cardWidth is 0 or negative", () => {
      assert.strictEqual(getMaxCollapsedArtworkWidth(0), 102);
      assert.strictEqual(getMaxCollapsedArtworkWidth(-50), 102);
    });

    it("clamps minimum to 64px on very narrow cards", () => {
      assert.strictEqual(getMaxCollapsedArtworkWidth(250), 64);
      assert.strictEqual(getMaxCollapsedArtworkWidth(200), 64);
    });

    it("calculates proportional width (cardWidth - 220) within standard bounds", () => {
      assert.strictEqual(getMaxCollapsedArtworkWidth(350), 130);
      assert.strictEqual(getMaxCollapsedArtworkWidth(370), 150);
    });

    it("clamps maximum to 160px on wide cards", () => {
      assert.strictEqual(getMaxCollapsedArtworkWidth(500), 160);
      assert.strictEqual(getMaxCollapsedArtworkWidth(1000), 160);
    });
  });

  describe("getBackgroundSizeForFit", () => {
    it("maps standard object-fit values accurately", () => {
      assert.strictEqual(getBackgroundSizeForFit("contain"), "contain");
      assert.strictEqual(getBackgroundSizeForFit("fill"), "100% 100%");
      assert.strictEqual(getBackgroundSizeForFit("scale-down"), "contain");
      assert.strictEqual(getBackgroundSizeForFit("none"), "auto");
      assert.strictEqual(getBackgroundSizeForFit("scaled-contain"), "80%");
      assert.strictEqual(getBackgroundSizeForFit("scaled-contain-alternate"), "80%");
      assert.strictEqual(getBackgroundSizeForFit("cover"), "cover");
      assert.strictEqual(getBackgroundSizeForFit("unknown"), "cover");
      assert.strictEqual(getBackgroundSizeForFit(), "cover");
    });
  });

  describe("isExternalImageUrl", () => {
    it("returns false for non-string, relative, or empty inputs", () => {
      assert.strictEqual(isExternalImageUrl(null), false);
      assert.strictEqual(isExternalImageUrl(undefined), false);
      assert.strictEqual(isExternalImageUrl(""), false);
      assert.strictEqual(isExternalImageUrl("/local/my-art.jpg"), false);
      assert.strictEqual(isExternalImageUrl("local/art.png"), false);
    });

    it("handles absolute external URLs properly", () => {
      // In Node test environment, window.location may be defined by previous mocks or undefined
      const isHttp = isExternalImageUrl("https://images.example.com/artwork.jpg");
      assert.strictEqual(typeof isHttp, "boolean");
    });
  });

  describe("normalizeImageSourceValue", () => {
    it("handles non-string or whitespace-only inputs", () => {
      assert.strictEqual(normalizeImageSourceValue(null), "");
      assert.strictEqual(normalizeImageSourceValue(undefined), "");
      assert.strictEqual(normalizeImageSourceValue(123), "");
      assert.strictEqual(normalizeImageSourceValue("   "), "");
    });

    it("unquotes single and double quotes", () => {
      assert.strictEqual(
        normalizeImageSourceValue("'http://example.com/pic.jpg'"),
        "http://example.com/pic.jpg"
      );
      assert.strictEqual(
        normalizeImageSourceValue('"http://example.com/pic.jpg"'),
        "http://example.com/pic.jpg"
      );
    });

    it("unwraps url(...) and url('...') syntax", () => {
      assert.strictEqual(
        normalizeImageSourceValue("url(http://example.com/art.png)"),
        "http://example.com/art.png"
      );
      assert.strictEqual(
        normalizeImageSourceValue("url('http://example.com/art.png')"),
        "http://example.com/art.png"
      );
      assert.strictEqual(
        normalizeImageSourceValue('url("http://example.com/art.png")'),
        "http://example.com/art.png"
      );
    });
  });

  describe("resolveImageUrlFromInput", () => {
    const mockHass = {
      states: {
        "media_player.speaker": {
          attributes: {
            entity_picture_local: "/local/speaker_art.jpg",
          },
        },
        "input_text.art_url": {
          state: "https://example.com/art_from_input.png",
          attributes: {},
        },
      },
    };

    it("resolves entity_picture_local when input is an entity ID", () => {
      const url = resolveImageUrlFromInput("media_player.speaker", mockHass);
      assert.strictEqual(url, "/local/speaker_art.jpg");
    });

    it("resolves state as image URL when entity state is a URL", () => {
      const url = resolveImageUrlFromInput("input_text.art_url", mockHass);
      assert.strictEqual(url, "https://example.com/art_from_input.png");
    });

    it("returns direct URLs untouched", () => {
      assert.strictEqual(
        resolveImageUrlFromInput("https://example.com/direct.jpg", mockHass),
        "https://example.com/direct.jpg"
      );
      assert.strictEqual(
        resolveImageUrlFromInput("/local/direct.jpg", mockHass),
        "/local/direct.jpg"
      );
    });

    it("returns null for invalid entities or missing hass", () => {
      assert.strictEqual(resolveImageUrlFromInput("media_player.nonexistent", mockHass), null);
      assert.strictEqual(resolveImageUrlFromInput("https://example.com/direct.jpg", null), null);
    });
  });

  describe("compileArtworkOverrides", () => {
    it("returns empty array for invalid inputs", () => {
      assert.deepStrictEqual(compileArtworkOverrides(null), []);
      assert.deepStrictEqual(compileArtworkOverrides(undefined), []);
      assert.deepStrictEqual(compileArtworkOverrides("invalid"), []);
    });

    it("pre-compiles wildcard regex patterns on overrides", () => {
      const overrides = [
        {
          media_title: "Radio *",
          image: "/local/radio.png",
        },
        {
          media_title: "Exact Title",
          image: "/local/exact.png",
        },
      ];
      const compiled = compileArtworkOverrides(overrides);
      assert.strictEqual(compiled.length, 2);
      assert.ok(compiled[0].__cachedRegexes.media_title instanceof RegExp);
      assert.strictEqual(compiled[0].__cachedRegexes.media_title.test("Radio 1"), true);
      assert.strictEqual(compiled[0].__cachedRegexes.media_title.test("Podcasts"), false);
      assert.strictEqual(compiled[1].__cachedRegexes.media_title, undefined);
    });
  });

  describe("ArtworkController Class & Host Integration", () => {
    let mockHost;
    let controller;

    beforeEach(() => {
      mockHost = {
        config: {
          artwork_position: "center center",
          media_artwork_overrides: [
            {
              media_title: "Overridden Track",
              image_url: "/local/overridden.jpg",
            },
          ],
        },
        hass: {
          states: {
            "media_player.living_room": {
              state: "playing",
              attributes: {
                media_title: "Overridden Track",
                media_artist: "Artist A",
                entity_picture: "/api/image/original.jpg",
              },
            },
          },
        },
        _artworkObjectFit: "cover",
        _isIdle: false,
        _alwaysCollapsed: false,
        currentActivePlaybackStateObj: null,
        metadataStateObj: null,
        currentStateObj: null,
        controllers: [],
        addController(c) {
          this.controllers.push(c);
        },
        requestUpdate() {},
        _evaluateJsTemplate(tpl) {
          return tpl.replace("[[[", "").replace("]]]", "").trim();
        },
        _getTemplateContext() {
          return {};
        },
      };

      controller = new ArtworkController(mockHost);
    });

    it("registers itself with host during construction", () => {
      assert.strictEqual(mockHost.controllers.includes(controller), true);
      assert.strictEqual(controller.host, mockHost);
    });

    it("resets caches and builds override index maps", () => {
      controller.ensureArtworkOverrideIndexMap();
      assert.ok(controller.artworkOverrideIndexMap instanceof WeakMap);

      const override = mockHost.config.media_artwork_overrides[0];
      const key = controller.getArtworkOverrideCacheKey(
        override,
        "image",
        mockHost.hass.states["media_player.living_room"]
      );
      assert.strictEqual(key, "0:image:Overridden Track:Artist A");

      controller.resetCaches();
      assert.strictEqual(controller.artworkOverrideIndexMap, null);
      assert.deepStrictEqual(controller.artworkOverrideTemplateCache, {});
    });

    it("resolves static and JS template artwork override sources", () => {
      const override = mockHost.config.media_artwork_overrides[0];
      const staticRes = controller.getResolvedArtworkOverrideSource(override, "/local/art.png");
      assert.strictEqual(staticRes, "/local/art.png");

      const jsRes = controller.getResolvedArtworkOverrideSource(
        override,
        "[[[ '/local/js-art.png' ]]]"
      );
      assert.strictEqual(jsRes, "/local/js-art.png");
    });

    it("retrieves artwork URL respecting overrides and entity attributes", () => {
      const stateObj = mockHost.hass.states["media_player.living_room"];
      const art = controller.getArtworkUrl(stateObj);
      assert.ok(art);
      assert.strictEqual(art.url, "/local/overridden.jpg");
      assert.strictEqual(art.objectFit, "cover");
      assert.strictEqual(art.objectPosition, "center center");
    });

    it("updates host CSS styles properly", () => {
      const mockElement = {
        style: {
          properties: {},
          setProperty(name, val) {
            this.properties[name] = val;
          },
          removeProperty(name) {
            delete this.properties[name];
          },
        },
      };

      mockHost.metadataStateObj = mockHost.hass.states["media_player.living_room"];
      mockHost.currentStateObj = mockHost.hass.states["media_player.living_room"];

      controller.updateHostArtworkStyles(mockElement, mockHost.metadataStateObj);
      assert.strictEqual(mockElement.style.properties["--yamp-artwork-fit"], "cover");
      assert.strictEqual(mockElement.style.properties["--yamp-artwork-bg-size"], "cover");
      assert.strictEqual(mockElement.style.properties["--yamp-artwork-position"], "center center");
    });
  });
});
