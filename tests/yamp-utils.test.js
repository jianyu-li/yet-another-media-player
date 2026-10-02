import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatTime } from "../src/progress-bar.js";
import {
  getValidArtworkAttr,
  isValidArtworkUrl,
  applyHostnameToUrl,
  getEntityName,
  isPlaceholderMediaTitle,
  areEntitiesPlayingSameMedia,
  isMusicAssistantEntity,
  getMusicAssistantState,
  getActionPlacement,
} from "../src/yamp-utils.js";
/**
 * Helper to create a partial HassEntity mock.
 * @param {Record<string, any>} [partial]
 * @returns {import("../src/types.d.ts").HassEntity}
 */
const mockEntity = (partial = {}) =>
  /** @type {any} */ ({
    entity_id: "media_player.test",
    state: "idle",
    attributes: {},
    last_changed: "",
    last_updated: "",
    context: { id: "1", parent_id: null, user_id: null },
    ...partial,
  });

/**
 * Helper to create a partial HomeAssistant mock.
 * @param {Record<string, any>} [partial]
 * @returns {import("../src/types.d.ts").HomeAssistant}
 */
const mockHass = (partial = {}) =>
  /** @type {any} */ ({
    states: {},
    services: {},
    user: { id: "1", is_owner: true, name: "Admin" },
    language: "en",
    locale: { language: "en" },
    ...partial,
  });

describe("yamp-utils & progress-bar helpers", () => {
  describe("formatTime", () => {
    it("formats standard durations under 1 hour in m:ss format", () => {
      assert.equal(formatTime(0), "0:00");
      assert.equal(formatTime(9), "0:09");
      assert.equal(formatTime(45), "0:45");
      assert.equal(formatTime(65), "1:05");
      assert.equal(formatTime(599), "9:59");
      assert.equal(formatTime(3599), "59:59");
    });

    it("formats durations of 1 hour or more in h:mm:ss format", () => {
      assert.equal(formatTime(3600), "1:00:00");
      assert.equal(formatTime(3665), "1:01:05");
      assert.equal(formatTime(7325), "2:02:05");
      assert.equal(formatTime(36000), "10:00:00");
    });

    it("forces h:mm:ss format when showHoursOrDuration is boolean true", () => {
      assert.equal(formatTime(0, true), "0:00:00");
      assert.equal(formatTime(45, true), "0:00:45");
      assert.equal(formatTime(125, true), "0:02:05");
    });

    it("forces h:mm:ss format when showHoursOrDuration is >= 3600", () => {
      assert.equal(formatTime(125, 3600), "0:02:05");
      assert.equal(formatTime(125, 7200), "0:02:05");
      // < 3600 does not force hours
      assert.equal(formatTime(125, 1800), "2:05");
    });

    it("handles null, undefined, NaN, and negative values safely", () => {
      assert.equal(formatTime(/** @type {any} */ (null)), "0:00");
      assert.equal(formatTime(/** @type {any} */ (undefined)), "0:00");
      assert.equal(formatTime(/** @type {any} */ (undefined), true), "0:00:00");
      assert.equal(formatTime(NaN), "0:00");
      assert.equal(formatTime(-10), "0:00");
    });
  });

  describe("getValidArtworkAttr", () => {
    it("returns the attribute value when it is a non-empty string", () => {
      const attrs = { entity_picture: "https://example.com/pic.jpg", other: "valid" };
      assert.equal(getValidArtworkAttr(attrs, "entity_picture"), "https://example.com/pic.jpg");
      assert.equal(getValidArtworkAttr(attrs, "other"), "valid");
    });

    it("returns null for empty, whitespace, null, or missing attributes", () => {
      const attrs = { empty: "", whitespace: "   ", nullVal: null, number: 123 };
      assert.equal(getValidArtworkAttr(attrs, "empty"), null);
      assert.equal(getValidArtworkAttr(attrs, "whitespace"), null);
      assert.equal(getValidArtworkAttr(attrs, "nullVal"), null);
      assert.equal(getValidArtworkAttr(attrs, "number"), null);
      assert.equal(getValidArtworkAttr(attrs, "missing"), null);
      assert.equal(getValidArtworkAttr(null, "any"), null);
    });
  });

  describe("isValidArtworkUrl", () => {
    it("validates absolute http and https URLs", () => {
      assert.equal(isValidArtworkUrl("http://example.com/art.png"), true);
      assert.equal(isValidArtworkUrl("https://example.com/path/to/pic.jpg?w=500"), true);
    });

    it("validates relative and local URLs", () => {
      assert.equal(isValidArtworkUrl("/api/media_player_proxy/media_player.kitchen"), true);
      assert.equal(isValidArtworkUrl("./local/image.png"), true);
      assert.equal(isValidArtworkUrl("../image.png"), true);
    });

    it("validates data URLs", () => {
      assert.equal(isValidArtworkUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA"), true);
    });

    it("rejects invalid, null, undefined, or placeholder error URLs", () => {
      assert.equal(isValidArtworkUrl(""), false);
      assert.equal(isValidArtworkUrl("   "), false);
      assert.equal(isValidArtworkUrl(/** @type {any} */ (null)), false);
      assert.equal(isValidArtworkUrl(/** @type {any} */ (undefined)), false);
      assert.equal(isValidArtworkUrl("/api/proxy/undefined/art"), false);
      assert.equal(isValidArtworkUrl("/api/proxy/null/art"), false);
      assert.equal(isValidArtworkUrl("not a url"), false);
    });
  });

  describe("applyHostnameToUrl", () => {
    it("prepends hostname to relative URLs", () => {
      const res = applyHostnameToUrl("/api/image.png", "http://192.168.1.100:8123");
      assert.equal(res, "http://192.168.1.100:8123/api/image.png");
    });

    it("normalizes trailing slash on hostname and leading slash on URL", () => {
      const res1 = applyHostnameToUrl("/api/image.png", "http://192.168.1.100:8123/");
      assert.equal(res1, "http://192.168.1.100:8123/api/image.png");

      const res2 = applyHostnameToUrl("api/image.png", "http://192.168.1.100:8123");
      assert.equal(res2, "http://192.168.1.100:8123/api/image.png");
    });

    it("leaves absolute URLs and data URLs untouched", () => {
      const abs = "https://external.cdn.com/album.jpg";
      assert.equal(applyHostnameToUrl(abs, "http://192.168.1.100:8123"), abs);

      const dataUrl = "data:image/png;base64,abc";
      assert.equal(applyHostnameToUrl(dataUrl, "http://192.168.1.100:8123"), dataUrl);
    });

    it("returns null if the resulting URL contains invalid patterns", () => {
      const bad = "/api/image/undefined/art.png";
      assert.equal(applyHostnameToUrl(bad, "http://192.168.1.100:8123"), null);
    });
  });

  describe("getEntityName", () => {
    it("returns friendly_name if present on the state object", () => {
      const stateObj = mockEntity({
        entity_id: "media_player.living_room",
        attributes: { friendly_name: "Living Room Speaker" },
      });
      assert.equal(getEntityName(null, stateObj), "Living Room Speaker");
    });

    it("falls back to entity_id if friendly_name is missing", () => {
      const stateObj = mockEntity({
        entity_id: "media_player.bedroom",
        attributes: {},
      });
      assert.equal(getEntityName(null, stateObj), "media_player.bedroom");
    });

    it("resolves from hass.states when given a string entity_id", () => {
      const hass = mockHass({
        states: {
          "media_player.office": mockEntity({
            entity_id: "media_player.office",
            attributes: { friendly_name: "Office Echo" },
          }),
        },
      });
      assert.equal(getEntityName(hass, "media_player.office"), "Office Echo");
      assert.equal(getEntityName(hass, "media_player.unknown"), "media_player.unknown");
    });

    it("uses hass.formatEntityName when available", () => {
      const stateObj = mockEntity({
        entity_id: "media_player.patio",
        attributes: { friendly_name: "Patio" },
      });
      const hass = mockHass({
        formatEntityName: (s) => `Formatted ${s.attributes.friendly_name}`,
      });
      assert.equal(getEntityName(hass, stateObj), "Formatted Patio");
    });

    it("returns empty string for null, undefined, or missing entity inputs", () => {
      assert.equal(getEntityName(null, null), "");
      assert.equal(getEntityName(null, undefined), "");
    });
  });

  describe("isPlaceholderMediaTitle", () => {
    it("detects empty, null, or whitespace-only titles as placeholders", () => {
      assert.equal(isPlaceholderMediaTitle(null), true);
      assert.equal(isPlaceholderMediaTitle(undefined), true);
      assert.equal(isPlaceholderMediaTitle(""), true);
      assert.equal(isPlaceholderMediaTitle("   "), true);
    });

    it("detects 'AirPlay' (case-insensitive) as a placeholder title", () => {
      assert.equal(isPlaceholderMediaTitle("AirPlay"), true);
      assert.equal(isPlaceholderMediaTitle("airplay"), true);
      assert.equal(isPlaceholderMediaTitle(" AIRPLAY "), true);
    });

    it("detects title matching entity friendly_name as a placeholder", () => {
      assert.equal(isPlaceholderMediaTitle("Living Room Apple TV", "Living Room Apple TV"), true);
      assert.equal(isPlaceholderMediaTitle("living room apple tv", "Living Room Apple TV"), true);
    });

    it("returns false for genuine track titles", () => {
      assert.equal(isPlaceholderMediaTitle("Bohemian Rhapsody", "Living Room Apple TV"), false);
      assert.equal(isPlaceholderMediaTitle("Hotel California"), false);
    });
  });

  describe("areEntitiesPlayingSameMedia", () => {
    it("returns true when both entities have matching media_title (case-insensitive)", () => {
      const main = mockEntity({ attributes: { media_title: "Bohemian Rhapsody" } });
      const ma = mockEntity({ attributes: { media_title: "bohemian rhapsody" } });
      assert.equal(areEntitiesPlayingSameMedia(main, ma), true);
    });

    it("returns true when both entities have matching media_content_id", () => {
      const main = mockEntity({ attributes: { media_content_id: "spotify:track:123" } });
      const ma = mockEntity({ attributes: { media_content_id: "spotify:track:123" } });
      assert.equal(areEntitiesPlayingSameMedia(main, ma), true);
    });

    it("returns true when AirPlay indicator is present on either entity", () => {
      const main = mockEntity({ attributes: { app_name: "AirPlay" } });
      const ma = mockEntity({ attributes: { media_title: "Some Song" } });
      assert.equal(areEntitiesPlayingSameMedia(main, ma), true);

      const main2 = mockEntity({ attributes: { media_title: "AirPlay" } });
      const ma2 = mockEntity({ attributes: { source: "Default" } });
      assert.equal(areEntitiesPlayingSameMedia(main2, ma2), true);
    });

    it("returns true when one entity's title/source cross-references the other's friendly_name", () => {
      const main = mockEntity({
        attributes: { friendly_name: "Apple TV", media_title: "HomePod" },
      });
      const ma = mockEntity({
        attributes: { friendly_name: "HomePod", media_title: "Track" },
      });
      assert.equal(areEntitiesPlayingSameMedia(main, ma), true);
    });

    it("returns true when main entity has title but paired MA entity has no title (AirPlay audio routing)", () => {
      const main = mockEntity({ attributes: { media_title: "YouTube Video" } });
      const ma = mockEntity({ attributes: { media_title: "" } });
      assert.equal(areEntitiesPlayingSameMedia(main, ma), true);
    });

    it("returns true when neither entity has a media_title (system sounds, gaming)", () => {
      const main = mockEntity({ attributes: {} });
      const ma = mockEntity({ attributes: {} });
      assert.equal(areEntitiesPlayingSameMedia(main, ma), true);
    });

    it("returns false when entities are playing completely different titles without AirPlay", () => {
      const main = mockEntity({ attributes: { media_title: "Song A" } });
      const ma = mockEntity({ attributes: { media_title: "Song B" } });
      assert.equal(areEntitiesPlayingSameMedia(main, ma), false);
    });

    it("returns false if either entity state is missing", () => {
      const main = mockEntity({ attributes: { media_title: "Song A" } });
      assert.equal(areEntitiesPlayingSameMedia(main, null), false);
      assert.equal(areEntitiesPlayingSameMedia(null, main), false);
    });
  });

  describe("isMusicAssistantEntity & getMusicAssistantState", () => {
    it("identifies Music Assistant entities by app_id, mass_player_id, or active_queue", () => {
      assert.equal(
        isMusicAssistantEntity(mockEntity({ attributes: { app_id: "music_assistant" } })),
        true
      );
      assert.equal(
        isMusicAssistantEntity(mockEntity({ attributes: { mass_player_id: "12345" } })),
        true
      );
      assert.equal(
        isMusicAssistantEntity(mockEntity({ attributes: { mass_player_type: "player" } })),
        true
      );
      assert.equal(
        isMusicAssistantEntity(mockEntity({ attributes: { active_queue: "queue_1" } })),
        true
      );
      assert.equal(
        isMusicAssistantEntity(mockEntity({ attributes: { friendly_name: "Standard Speaker" } })),
        false
      );
      assert.equal(isMusicAssistantEntity(null), false);
    });

    it("retrieves Music Assistant state when MA media attributes are present", () => {
      const hass = mockHass({
        states: {
          "media_player.ma_speaker": mockEntity({
            attributes: { media_title: "MA Song", media_artist: "MA Artist" },
          }),
          "media_player.idle_speaker": mockEntity({
            attributes: {},
          }),
        },
      });
      assert.ok(getMusicAssistantState(hass, "media_player.ma_speaker") !== null);
      assert.equal(getMusicAssistantState(hass, "media_player.idle_speaker"), null);
      assert.equal(getMusicAssistantState(hass, "media_player.nonexistent"), null);
      assert.equal(getMusicAssistantState(null, "media_player.ma_speaker"), null);
    });
  });

  describe("getActionPlacement", () => {
    it("returns explicit placement when defined", () => {
      assert.equal(getActionPlacement({ placement: "menu" }, 0), "menu");
      assert.equal(getActionPlacement({ placement: "chip" }, 0), "chip");
      assert.equal(getActionPlacement({ placement: "hidden" }, 0), "hidden");
    });

    it("falls back to legacy in_menu values", () => {
      assert.equal(getActionPlacement({ in_menu: true }, 0), "menu");
      assert.equal(getActionPlacement({ in_menu: "hidden" }, 0), "hidden");
      assert.equal(getActionPlacement({ in_menu: "menu" }, 0), "menu");
      assert.equal(getActionPlacement({ in_menu: false }, 0), "chip");
      assert.equal(getActionPlacement({}, 0), "chip");
    });
  });
});
