import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { nothing } from "lit";

// Setup mock browser globals before importing Lit component / modules that reference window/HTMLElement
const g = /** @type {any} */ (globalThis);
g.window = globalThis;
/** @type {EventTarget} */
let windowEventTarget = new EventTarget();

g.window.addEventListener = (
  /** @type {string} */ type,
  /** @type {EventListenerOrEventListenerObject} */ listener,
  /** @type {boolean | AddEventListenerOptions} */ options
) => windowEventTarget.addEventListener(type, listener, options);

g.window.removeEventListener = (
  /** @type {string} */ type,
  /** @type {EventListenerOrEventListenerObject} */ listener,
  /** @type {boolean | EventListenerOptions} */ options
) => windowEventTarget.removeEventListener(type, listener, options);

g.window.dispatchEvent = (/** @type {Event} */ event) => windowEventTarget.dispatchEvent(event);

if (!g.customElements) {
  g.customElements = { define() {} };
}
if (!g.HTMLElement) {
  class MockHTMLElement {
    constructor() {
      this._attrs = new Map();
    }
    attachShadow() {
      return {};
    }
    dispatchEvent() {
      return true;
    }
    get renderRoot() {
      return { querySelector: () => null, querySelectorAll: () => [] };
    }
    setAttribute(/** @type {string} */ name, /** @type {string} */ val) {
      this._attrs.set(name, String(val));
    }
    getAttribute(/** @type {string} */ name) {
      return this._attrs.get(name) ?? null;
    }
    hasAttribute(/** @type {string} */ name) {
      return this._attrs.has(name);
    }
    removeAttribute(/** @type {string} */ name) {
      this._attrs.delete(name);
    }
  }
  g.HTMLElement = MockHTMLElement;
}
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerCard, _resetKioskSatelliteCacheForTests } =
  await import("../src/yet-another-media-player.js");
const { isPodcastOrAudiobook } = await import("../src/yamp-utils.js");
const { renderControlsRow, countMainControls } = await import("../src/controls-row.js");
const { SearchController } = await import("../src/controllers/search-controller.js");
const { getMassQueueConfigEntryId } = await import("../src/search-sheet.js");
const {
  SUPPORT_SEEK,
  SUPPORT_PREVIOUS_TRACK,
  SUPPORT_NEXT_TRACK,
  SUPPORT_SHUFFLE,
  SUPPORT_REPEAT_SET,
  SUPPORT_STOP,
  DEFAULT_SKIP_SECONDS,
} = await import("../src/constants.js");

/**
 * Serializes a Lit TemplateResult while capturing bound function references in order.
 * @param {any} tpl
 * @param {Function[]} handlers
 * @returns {string}
 */
function serializeTemplateWithHandlers(tpl, handlers = []) {
  if (tpl === nothing || tpl === null || tpl === undefined) return "";
  if (typeof tpl === "function") {
    const idx = handlers.length;
    handlers.push(tpl);
    return `__FN_${idx}__`;
  }
  if (typeof tpl === "string" || typeof tpl === "number" || typeof tpl === "boolean") {
    return String(tpl);
  }
  if (typeof tpl === "symbol") return "";
  if (Array.isArray(tpl)) {
    return tpl.map((item) => serializeTemplateWithHandlers(item, handlers)).join("");
  }
  if (tpl && typeof tpl === "object" && tpl.strings && Array.isArray(tpl.values)) {
    let out = "";
    tpl.strings.forEach((/** @type {string} */ str, /** @type {number} */ i) => {
      out += str;
      if (i < tpl.values.length) {
        out += serializeTemplateWithHandlers(tpl.values[i], handlers);
      }
    });
    return out;
  }
  return "";
}

/**
 * Parses rendered <button> elements from a serialized template string.
 * @param {string} htmlStr
 * @param {Function[]} handlers
 * @returns {Array<{ className: string, title: string, icon: string, click: Function | null }>}
 */
function parseButtons(htmlStr, handlers) {
  const buttons = [];
  const buttonRegex = /<button\b([\s\S]*?)>([\s\S]*?)<\/button>/g;
  let match;
  while ((match = buttonRegex.exec(htmlStr)) !== null) {
    const attrs = match[1];
    const body = match[2];
    const classMatch = attrs.match(/class="([^"]*)"/);
    const titleMatch = attrs.match(/title="([^"]*)"/);
    const clickMatch = attrs.match(/@click=__FN_(\d+)__/);
    const iconMatch = body.match(/\.icon=([^\s>]+)/);
    const fnIdx = clickMatch ? Number(clickMatch[1]) : -1;
    buttons.push({
      className: classMatch ? classMatch[1].trim() : "",
      title: titleMatch ? titleMatch[1].trim() : "",
      icon: iconMatch ? iconMatch[1].replace(/^"|"$/g, "").trim() : "",
      click: fnIdx >= 0 ? handlers[fnIdx] : null,
    });
  }
  return buttons;
}

/**
 * Extracts a section from rendered modern controls HTML between known section wrappers.
 * @param {string} htmlStr
 * @param {string} sectionClass
 * @returns {string}
 */
function extractSectionHtml(htmlStr, sectionClass) {
  const regex = new RegExp(`<div class="${sectionClass}">([\\s\\S]*?)<\\/div>`);
  const match = htmlStr.match(regex);
  return match ? match[1] : "";
}

describe("mass_queue v0.11.0 Skip & Similar Songs + Non-Admin get_info Fallback", () => {
  /** @type {number} */
  let fakeNow = 1_700_000_000_000;
  /** @type {any} */
  let dateNowMock;

  beforeEach(async () => {
    windowEventTarget = new EventTarget();
    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
    fakeNow += 60_000;
    dateNowMock = mock.method(Date, "now", () => fakeNow);
    await getMassQueueConfigEntryId({ services: {} });
  });

  afterEach(async () => {
    fakeNow += 60_000;
    await getMassQueueConfigEntryId({ services: {} });
    dateNowMock?.mock.restore();
    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
  });

  // =========================================================================
  // 1. isPodcastOrAudiobook
  // =========================================================================
  describe("isPodcastOrAudiobook", () => {
    it("returns true for active states with podcast/podcast_episode/audiobook media_content_type", () => {
      for (const state of ["playing", "paused", "buffering"]) {
        for (const contentType of ["podcast", "podcast_episode", "audiobook", " Podcast "]) {
          assert.equal(
            isPodcastOrAudiobook(
              /** @type {any} */ ({
                state,
                attributes: { media_content_type: contentType },
              })
            ),
            true,
            `Expected true for state=${state}, media_content_type=${contentType}`
          );
        }
      }
    });

    it("returns true for active states with matching mass_item_type", () => {
      for (const massItemType of ["podcast", "podcast_episode", "audiobook", "AUDIOBOOK"]) {
        assert.equal(
          isPodcastOrAudiobook(
            /** @type {any} */ ({
              state: "playing",
              attributes: { media_content_type: "music", mass_item_type: massItemType },
            })
          ),
          true,
          `Expected true for mass_item_type=${massItemType}`
        );
      }
    });

    it("returns true for active states with matching media_content_id URI prefixes", () => {
      const prefixes = [
        "library://podcast/42",
        "library://audiobook/99",
        "podcast://feed/episode-1",
        "audiobook://book-123",
        "spotify:episode:5abcDEF",
        "spotify://episode/5abcDEF",
        "  LIBRARY://PODCAST/1  ",
      ];
      for (const contentId of prefixes) {
        assert.equal(
          isPodcastOrAudiobook(
            /** @type {any} */ ({
              state: "paused",
              attributes: { media_content_id: contentId },
            })
          ),
          true,
          `Expected true for media_content_id=${contentId}`
        );
      }
    });

    it("returns false for inactive or unavailable states even with podcast attributes", () => {
      for (const state of ["idle", "off", "unavailable", "unknown", "standby", ""]) {
        assert.equal(
          isPodcastOrAudiobook(
            /** @type {any} */ ({
              state,
              attributes: {
                media_content_type: "podcast",
                mass_item_type: "audiobook",
                media_content_id: "library://podcast/1",
              },
            })
          ),
          false,
          `Expected false for state=${state}`
        );
      }
    });

    it("returns false for music/track content types and missing or invalid inputs", () => {
      assert.equal(isPodcastOrAudiobook(null), false);
      assert.equal(isPodcastOrAudiobook(undefined), false);
      assert.equal(isPodcastOrAudiobook(/** @type {any} */ ({ state: "playing" })), false);
      assert.equal(
        isPodcastOrAudiobook(
          /** @type {any} */ ({
            state: "playing",
            attributes: {},
          })
        ),
        false
      );
      assert.equal(
        isPodcastOrAudiobook(
          /** @type {any} */ ({
            state: "playing",
            attributes: {
              media_content_type: "music",
              mass_item_type: "track",
              media_content_id: "library://track/123",
            },
          })
        ),
        false
      );
      assert.equal(
        isPodcastOrAudiobook(
          /** @type {any} */ ({
            state: "playing",
            attributes: {
              media_content_type: 123,
              mass_item_type: null,
              media_content_id: { uri: "library://podcast/1" },
            },
          })
        ),
        false
      );
    });
  });

  // =========================================================================
  // 2. renderControlsRow & countMainControls
  // =========================================================================
  describe("renderControlsRow & countMainControls", () => {
    const fullFeatures =
      SUPPORT_PREVIOUS_TRACK |
      SUPPORT_NEXT_TRACK |
      SUPPORT_SHUFFLE |
      SUPPORT_REPEAT_SET |
      SUPPORT_STOP;
    const supportsFeature = (/** @type {any} */ stateObj, /** @type {number} */ bit) =>
      ((stateObj?.attributes?.supported_features || 0) & bit) !== 0;

    const baseStateObj = {
      entity_id: "media_player.podcast",
      state: "playing",
      attributes: {
        supported_features: fullFeatures,
        repeat: "off",
      },
    };

    describe("classic layout with showSkip", () => {
      it("renders skip_back (mdi:rewind-15) and skip_forward (mdi:fast-forward-15) and fires actions", () => {
        const clicks = /** @type {string[]} */ ([]);
        const tpl = renderControlsRow({
          stateObj: baseStateObj,
          supportsFeature,
          onControlClick: (/** @type {string} */ action) => clicks.push(action),
          controlLayout: "classic",
          showSkip: true,
        });

        const handlers = /** @type {Function[]} */ ([]);
        const htmlStr = serializeTemplateWithHandlers(tpl, handlers);
        const buttons = parseButtons(htmlStr, handlers);

        const skipBackBtn = buttons.find((b) => b.icon === "mdi:rewind-15");
        const skipForwardBtn = buttons.find((b) => b.icon === "mdi:fast-forward-15");

        assert.ok(skipBackBtn, "Expected skip_back button with mdi:rewind-15");
        assert.ok(skipForwardBtn, "Expected skip_forward button with mdi:fast-forward-15");
        assert.equal(skipBackBtn.className, "button");
        assert.equal(skipForwardBtn.className, "button");

        skipBackBtn.click?.();
        skipForwardBtn.click?.();
        assert.deepEqual(clicks, ["skip_back", "skip_forward"]);

        // Without showStop: previous, skip_back, play_pause, skip_forward, next, shuffle, repeat = 7
        assert.equal(buttons.length, 7);
        assert.equal(
          countMainControls(baseStateObj, supportsFeature, false, {}, false, "classic", true),
          7
        );
      });

      it("omits skip_back when hiddenControls.skip_back is true and updates countMainControls", () => {
        const tpl = renderControlsRow({
          stateObj: baseStateObj,
          supportsFeature,
          onControlClick: () => {},
          controlLayout: "classic",
          hiddenControls: { skip_back: true },
          showSkip: true,
        });

        const handlers = /** @type {Function[]} */ ([]);
        const htmlStr = serializeTemplateWithHandlers(tpl, handlers);
        const buttons = parseButtons(htmlStr, handlers);

        assert.equal(
          buttons.some((b) => b.icon === "mdi:rewind-15"),
          false
        );
        assert.equal(
          buttons.some((b) => b.icon === "mdi:fast-forward-15"),
          true
        );
        assert.equal(buttons.length, 6);
        assert.equal(
          countMainControls(
            baseStateObj,
            supportsFeature,
            false,
            { skip_back: true },
            false,
            "classic",
            true
          ),
          6
        );
      });

      it("does not render skip buttons when showSkip is false", () => {
        const tpl = renderControlsRow({
          stateObj: baseStateObj,
          supportsFeature,
          onControlClick: () => {},
          controlLayout: "classic",
          showSkip: false,
        });
        const handlers = /** @type {Function[]} */ ([]);
        const buttons = parseButtons(serializeTemplateWithHandlers(tpl, handlers), handlers);
        assert.equal(
          buttons.some((b) => b.icon === "mdi:rewind-15" || b.icon === "mdi:fast-forward-15"),
          false
        );
        assert.equal(
          countMainControls(baseStateObj, supportsFeature, false, {}, false, "classic", false),
          5
        );
      });
    });

    describe("modern layout with showSkip", () => {
      it("replaces shuffle/repeat with previous+skip_back on left and skip_forward+next on right while preserving 5-button footprint", () => {
        const clicks = /** @type {string[]} */ ([]);
        const tpl = renderControlsRow({
          stateObj: baseStateObj,
          supportsFeature,
          onControlClick: (/** @type {string} */ action) => clicks.push(action),
          controlLayout: "modern",
          showSkip: true,
        });

        const handlers = /** @type {Function[]} */ ([]);
        const htmlStr = serializeTemplateWithHandlers(tpl, handlers);

        const leftButtons = parseButtons(extractSectionHtml(htmlStr, "controls-left"), handlers);
        const centerButtons = parseButtons(
          extractSectionHtml(htmlStr, "controls-center"),
          handlers
        );
        const rightButtons = parseButtons(extractSectionHtml(htmlStr, "controls-right"), handlers);

        assert.equal(leftButtons.length, 2);
        assert.equal(leftButtons[0].icon, "mdi:skip-previous");
        assert.equal(leftButtons[0].className, "modern-button small");
        assert.equal(leftButtons[1].icon, "mdi:rewind-15");
        assert.equal(leftButtons[1].className, "modern-button medium");

        assert.equal(centerButtons.length, 1);
        assert.equal(centerButtons[0].className, "modern-button primary active");

        assert.equal(rightButtons.length, 2);
        assert.equal(rightButtons[0].icon, "mdi:fast-forward-15");
        assert.equal(rightButtons[0].className, "modern-button medium");
        assert.equal(rightButtons[1].icon, "mdi:skip-next");
        assert.equal(rightButtons[1].className, "modern-button small");

        // Shuffle and repeat must be absent
        const allButtons = [...leftButtons, ...centerButtons, ...rightButtons];
        assert.equal(
          allButtons.some((b) => b.icon === "mdi:shuffle" || b.icon === "mdi:repeat"),
          false
        );

        leftButtons[0].click?.();
        leftButtons[1].click?.();
        rightButtons[0].click?.();
        rightButtons[1].click?.();
        assert.deepEqual(clicks, ["prev", "skip_back", "skip_forward", "next"]);

        // 5-button footprint preserved
        assert.equal(
          countMainControls(baseStateObj, supportsFeature, false, {}, false, "modern", true),
          5
        );
        assert.equal(
          countMainControls(baseStateObj, supportsFeature, false, {}, false, "modern", false),
          5
        );
      });

      it("restores shuffle/repeat when skip_back/skip_forward are hidden via hiddenControls", () => {
        const tplBothHidden = renderControlsRow({
          stateObj: baseStateObj,
          supportsFeature,
          onControlClick: () => {},
          controlLayout: "modern",
          hiddenControls: { skip_back: true, skip_forward: true },
          showSkip: true,
        });

        const handlers = /** @type {Function[]} */ ([]);
        const htmlBoth = serializeTemplateWithHandlers(tplBothHidden, handlers);
        const leftBoth = parseButtons(extractSectionHtml(htmlBoth, "controls-left"), handlers);
        const rightBoth = parseButtons(extractSectionHtml(htmlBoth, "controls-right"), handlers);

        assert.equal(leftBoth.length, 2);
        assert.equal(leftBoth[0].icon, "mdi:shuffle");
        assert.equal(leftBoth[0].className, "modern-button small");
        assert.equal(leftBoth[1].icon, "mdi:skip-previous");
        assert.equal(leftBoth[1].className, "modern-button medium");

        assert.equal(rightBoth.length, 2);
        assert.equal(rightBoth[0].icon, "mdi:skip-next");
        assert.equal(rightBoth[0].className, "modern-button medium");
        assert.equal(rightBoth[1].icon, "mdi:repeat");
        assert.equal(rightBoth[1].className, "modern-button small");

        assert.equal(
          countMainControls(
            baseStateObj,
            supportsFeature,
            false,
            { skip_back: true, skip_forward: true },
            false,
            "modern",
            true
          ),
          5
        );

        // Asymmetric hide: only skip_back hidden -> left restores shuffle, right keeps skip_forward
        const tplOneHidden = renderControlsRow({
          stateObj: baseStateObj,
          supportsFeature,
          onControlClick: () => {},
          controlLayout: "modern",
          hiddenControls: { skip_back: true },
          showSkip: true,
        });
        const handlersOne = /** @type {Function[]} */ ([]);
        const htmlOne = serializeTemplateWithHandlers(tplOneHidden, handlersOne);
        const leftOne = parseButtons(extractSectionHtml(htmlOne, "controls-left"), handlersOne);
        const rightOne = parseButtons(extractSectionHtml(htmlOne, "controls-right"), handlersOne);

        assert.equal(leftOne[0].icon, "mdi:shuffle");
        assert.equal(leftOne[1].icon, "mdi:skip-previous");
        assert.equal(rightOne[0].icon, "mdi:fast-forward-15");
        assert.equal(rightOne[1].icon, "mdi:skip-next");
        assert.equal(
          countMainControls(
            baseStateObj,
            supportsFeature,
            false,
            { skip_back: true },
            false,
            "modern",
            true
          ),
          5
        );
      });
    });
  });

  // =========================================================================
  // 3. Skip execution (YetAnotherMediaPlayerCard.prototype._onControlClick)
  // =========================================================================
  describe("YetAnotherMediaPlayerCard._onControlClick skip execution", () => {
    /** @type {any} */
    let card;
    /** @type {Array<{ domain: string, service: string, data: any }>} */
    let serviceCalls;

    beforeEach(() => {
      serviceCalls = [];
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card._massQueueAvailable = true;
      card.requestUpdate = () => {};
      card.config = {
        entities: [{ entity: "media_player.ma_podcast" }],
      };
      card.hass = {
        states: {
          "media_player.ma_podcast": {
            entity_id: "media_player.ma_podcast",
            state: "playing",
            attributes: {
              media_content_id: "library://podcast/episode/10",
              media_content_type: "podcast",
              media_title: "Episode 10",
              media_position: 30,
              media_duration: 100,
              supported_features: SUPPORT_SEEK,
            },
          },
        },
        callService: async (
          /** @type {string} */ domain,
          /** @type {string} */ service,
          /** @type {any} */ data
        ) => {
          serviceCalls.push({ domain, service, data });
        },
      };
    });

    it("calls mass_queue.skip with +/-15s when mass_queue is available and MA entity is active, and updates _seekAnchor", async () => {
      await card._onControlClick("skip_forward");

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "mass_queue",
        service: "skip",
        data: {
          entity: "media_player.ma_podcast",
          skip_seconds: DEFAULT_SKIP_SECONDS,
        },
      });
      assert.equal(card._seekAnchor.position, 45);
      assert.equal(card._seekAnchor.trackId, "library://podcast/episode/10");
      assert.equal(card._seekAnchor.timestamp, fakeNow);
      assert.equal(card._seekOffset, null);

      // Subsequent skip_back uses _seekAnchor.position (45 - 15 = 30)
      await card._onControlClick("skip_back");
      assert.equal(serviceCalls.length, 2);
      assert.deepEqual(serviceCalls[1], {
        domain: "mass_queue",
        service: "skip",
        data: {
          entity: "media_player.ma_podcast",
          skip_seconds: -DEFAULT_SKIP_SECONDS,
        },
      });
      assert.equal(card._seekAnchor.position, 30);
    });

    it("clamps optimistic _seekAnchor position within [0, duration]", async () => {
      // Lower bound clamp to 0
      card.hass.states["media_player.ma_podcast"].attributes.media_position = 5;
      await card._onControlClick("skip_back");
      assert.equal(card._seekAnchor.position, 0);

      // Upper bound clamp to duration (100)
      card._seekAnchor = null;
      card.hass.states["media_player.ma_podcast"].attributes.media_position = 95;
      await card._onControlClick("skip_forward");
      assert.equal(card._seekAnchor.position, 100);
    });

    it("accounts for elapsed time since media_position_updated_at when playing", async () => {
      card.hass.states["media_player.ma_podcast"].attributes.media_position = 20;
      card.hass.states["media_player.ma_podcast"].attributes.media_position_updated_at = new Date(
        fakeNow - 5000
      ).toISOString();

      await card._onControlClick("skip_forward");
      // 20 + 5 + 15 = 40
      assert.equal(card._seekAnchor.position, 40);
    });

    it("falls back to media_player.media_seek when disable_mass_queue is true", async () => {
      card.config = {
        ...card.config,
        disable_mass_queue: true,
      };
      await card._onControlClick("skip_forward");

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_seek",
        data: {
          entity_id: "media_player.ma_podcast",
          seek_position: 45,
        },
      });
    });

    it("falls back to media_player.media_seek when _massQueueAvailable is false", async () => {
      card._massQueueAvailable = false;
      await card._onControlClick("skip_back");

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_seek",
        data: {
          entity_id: "media_player.ma_podcast",
          seek_position: 15,
        },
      });
    });

    it("falls back to media_player.media_seek when MA entity is idle while another player is playing", async () => {
      card.config = {
        entities: [
          {
            entity: "media_player.spotify_speaker",
            music_assistant_entity: "media_player.ma_speaker",
          },
        ],
      };
      card.hass.states = {
        "media_player.spotify_speaker": {
          entity_id: "media_player.spotify_speaker",
          state: "playing",
          attributes: {
            media_content_id: "spotify:episode:xyz",
            media_content_type: "podcast",
            media_position: 50,
            media_duration: 300,
            supported_features: SUPPORT_SEEK,
          },
        },
        "media_player.ma_speaker": {
          entity_id: "media_player.ma_speaker",
          state: "idle",
          attributes: {},
        },
      };
      card._getMusicAssistantState = () => card.hass.states["media_player.ma_speaker"];

      await card._onControlClick("skip_forward");

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_seek",
        data: {
          entity_id: "media_player.spotify_speaker",
          seek_position: 65,
        },
      });
    });

    it("falls back to media_player.media_seek when mass_queue.skip rejects", async () => {
      card.hass.callService = async (
        /** @type {string} */ domain,
        /** @type {string} */ service,
        /** @type {any} */ data
      ) => {
        serviceCalls.push({ domain, service, data });
        if (domain === "mass_queue" && service === "skip") {
          throw new Error("mass_queue.skip failed");
        }
      };

      await card._onControlClick("skip_back");

      assert.equal(serviceCalls.length, 2);
      assert.equal(serviceCalls[0].domain, "mass_queue");
      assert.equal(serviceCalls[0].service, "skip");
      assert.deepEqual(serviceCalls[1], {
        domain: "media_player",
        service: "media_seek",
        data: {
          entity_id: "media_player.ma_podcast",
          seek_position: 15,
        },
      });
    });

    it("does not call media_seek on fallback when SUPPORT_SEEK is not supported", async () => {
      card._massQueueAvailable = false;
      card.hass.states["media_player.ma_podcast"].attributes.supported_features = 0;

      await card._onControlClick("skip_forward");

      assert.equal(serviceCalls.length, 0);
      assert.equal(card._seekAnchor.position, 45);
    });

    it("_isPodcastOrAudiobookPlaying and _canSkipPlayback do not treat a paused companion MA entity as active on unrelated music, and return true when playing same media with podcast metadata", () => {
      card.config = {
        entities: [
          {
            entity: "media_player.spotify_speaker",
            music_assistant_entity: "media_player.ma_speaker",
            prefer_ma_metadata: true,
          },
        ],
      };
      const spotifyMusicState = {
        entity_id: "media_player.spotify_speaker",
        state: "playing",
        attributes: {
          media_content_id: "spotify:track:direct_song",
          media_content_type: "music",
          media_title: "Direct Music Song",
          supported_features: 0,
        },
      };
      const pausedMaPodcastState = {
        entity_id: "media_player.ma_speaker",
        state: "paused",
        attributes: {
          media_content_id: "library://podcast/old_ep",
          media_content_type: "podcast",
          media_title: "Old Paused Podcast",
        },
      };
      card.hass.states = {
        "media_player.spotify_speaker": spotifyMusicState,
        "media_player.ma_speaker": pausedMaPodcastState,
      };
      card._getMusicAssistantState = () => pausedMaPodcastState;

      // Unrelated media: _areEntitiesPlayingSameMedia is false
      assert.equal(
        card._areEntitiesPlayingSameMedia(spotifyMusicState, pausedMaPodcastState),
        false
      );
      assert.equal(card._isPodcastOrAudiobookPlaying(spotifyMusicState), false);
      assert.equal(card._canSkipPlayback(spotifyMusicState), false);

      // Same media with podcast metadata on companion MA / metadata entity
      const playingSameMediaState = {
        entity_id: "media_player.spotify_speaker",
        state: "playing",
        attributes: {
          media_content_id: "http://stream.local/ep42.mp3",
          media_content_type: "music",
          media_title: "Tech Podcast Episode 42",
          supported_features: 0,
        },
      };
      const maSamePodcastState = {
        entity_id: "media_player.ma_speaker",
        state: "paused",
        attributes: {
          media_content_id: "library://podcast/ep42",
          media_content_type: "podcast",
          media_title: "Tech Podcast Episode 42",
        },
      };
      card.hass.states = {
        "media_player.spotify_speaker": playingSameMediaState,
        "media_player.ma_speaker": maSamePodcastState,
      };
      card._getMusicAssistantState = () => maSamePodcastState;

      assert.equal(
        card._areEntitiesPlayingSameMedia(playingSameMediaState, maSamePodcastState),
        true
      );
      assert.equal(card._isPodcastOrAudiobookPlaying(playingSameMediaState), true);
      assert.equal(card._canSkipPlayback(playingSameMediaState), true);

      // Also verify when prefer_ma_metadata is false (metadataStateObj === playbackStateObj, falls back to companion maState)
      card.config = {
        entities: [
          {
            entity: "media_player.spotify_speaker",
            music_assistant_entity: "media_player.ma_speaker",
            prefer_ma_metadata: false,
          },
        ],
      };
      assert.equal(card._isPodcastOrAudiobookPlaying(playingSameMediaState), true);
      assert.equal(card._canSkipPlayback(playingSameMediaState), true);
    });

    it("falls back to media_player.media_seek (not mass_queue.skip) when companion maState is paused on unrelated media", async () => {
      card.config = {
        entities: [
          {
            entity: "media_player.spotify_speaker",
            music_assistant_entity: "media_player.ma_speaker",
          },
        ],
      };
      const spotifyPodcastState = {
        entity_id: "media_player.spotify_speaker",
        state: "playing",
        attributes: {
          media_content_id: "spotify:episode:direct_ep",
          media_content_type: "podcast",
          media_title: "Direct Spotify Podcast",
          media_position: 50,
          media_duration: 300,
          supported_features: SUPPORT_SEEK,
        },
      };
      const pausedUnrelatedMaState = {
        entity_id: "media_player.ma_speaker",
        state: "paused",
        attributes: {
          media_content_id: "library://track/unrelated",
          media_content_type: "music",
          media_title: "Unrelated MA Song",
        },
      };
      card.hass.states = {
        "media_player.spotify_speaker": spotifyPodcastState,
        "media_player.ma_speaker": pausedUnrelatedMaState,
      };
      card._getMusicAssistantState = () => pausedUnrelatedMaState;

      assert.equal(
        card._areEntitiesPlayingSameMedia(spotifyPodcastState, pausedUnrelatedMaState),
        false
      );

      await card._onControlClick("skip_forward");

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_seek",
        data: {
          entity_id: "media_player.spotify_speaker",
          seek_position: 65,
        },
      });
    });

    it("aligns _seekAnchor.trackId with metadataStateObj.attributes.media_content_id when metadataStateObj is playing the same media as targetEntity", async () => {
      card.config = {
        entities: [
          {
            entity: "media_player.sonos_speaker",
            music_assistant_entity: "media_player.ma_speaker",
            prefer_ma_metadata: true,
          },
        ],
      };
      const sonosState = {
        entity_id: "media_player.sonos_speaker",
        state: "playing",
        attributes: {
          media_content_id: "http://192.168.1.50:8097/stream/ep12.mp3",
          media_content_type: "music",
          media_title: "Shared Podcast Episode 12",
          media_position: 100,
          media_duration: 600,
          supported_features: SUPPORT_SEEK,
        },
      };
      const maMetadataState = {
        entity_id: "media_player.ma_speaker",
        state: "playing",
        attributes: {
          media_content_id: "library://podcast/episode/12",
          media_content_type: "podcast",
          media_title: "Shared Podcast Episode 12",
        },
      };
      card.hass.states = {
        "media_player.sonos_speaker": sonosState,
        "media_player.ma_speaker": maMetadataState,
      };
      card._getMusicAssistantState = () => maMetadataState;

      assert.equal(card.metadataStateObj?.entity_id, "media_player.ma_speaker");
      assert.equal(card._areEntitiesPlayingSameMedia(sonosState, maMetadataState), true);

      await card._onControlClick("skip_forward");

      assert.equal(card._seekAnchor.trackId, "library://podcast/episode/12");
      assert.equal(card._seekAnchor.position, 115);
      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "mass_queue",
        service: "skip",
        data: {
          entity: "media_player.ma_speaker",
          skip_seconds: DEFAULT_SKIP_SECONDS,
        },
      });
    });
  });

  // =========================================================================
  // 4. SearchController.prototype.handlePlaySimilar
  // =========================================================================
  describe("SearchController.prototype.handlePlaySimilar", () => {
    /** @type {any} */
    let mockHost;
    /** @type {InstanceType<typeof SearchController>} */
    let searchController;
    /** @type {Array<{ domain: string, service: string, data: any }>} */
    let serviceCalls;
    /** @type {number} */
    let refreshQueueCalls;

    beforeEach(() => {
      serviceCalls = [];
      refreshQueueCalls = 0;

      const maState = {
        entity_id: "media_player.ma_kitchen",
        state: "playing",
        attributes: {
          media_content_id: "library://track/100",
          media_content_type: "music",
          media_title: "Current Song",
          media_artist: "Current Artist",
        },
      };

      mockHost = {
        addController() {},
        requestUpdate() {},
        config: {},
        currentEntityId: "media_player.ma_kitchen",
        currentActivePlaybackStateObj: maState,
        currentPlaybackStateObj: maState,
        currentStateObj: maState,
        _selectedIndex: 0,
        _similarTracksStatus: null,
        _showMediaTitleOptions: true,
        _radioModeActive: false,
        _upcomingFilterActive: false,
        _searchMediaClassFilter: "all",
        _searchResultsByType: {
          all_upcoming_sort_default: [{ queue_item_id: "old_1" }],
        },
        _getMusicAssistantState: () => maState,
        _getSearchEntityId: () => "media_player.ma_kitchen",
        _resolveTemplateAtActionTime: async (/** @type {any} */ id) => id,
        _getSearchDismissBehavior: () => ({ shouldDismiss: false, shouldReset: false }),
        _closeEntityOptions() {},
        _queueController: {
          refreshQueue: () => {
            refreshQueueCalls++;
          },
        },
        hass: {
          states: {
            "media_player.ma_kitchen": maState,
          },
          callService: async (
            /** @type {string} */ domain,
            /** @type {string} */ service,
            /** @type {any} */ data
          ) => {
            serviceCalls.push({ domain, service, data });
          },
        },
      };

      searchController = new SearchController(/** @type {any} */ (mockHost));
    });

    afterEach(() => {
      searchController?.clearSimilarStatus();
      searchController?.hostDisconnected();
    });

    it("plays seamless radio via play_media replace_next + radio_mode: true when MA is active with valid trackUri, ignores re-entrant calls while loading, invalidates cache, and transitions status loading -> success", async () => {
      /** @type {(value?: any) => void} */
      let resolvePlayMedia = () => {};
      const pendingPlayMedia = new Promise((resolve) => {
        resolvePlayMedia = resolve;
      });
      mockHost.hass.callService = async (
        /** @type {string} */ domain,
        /** @type {string} */ service,
        /** @type {any} */ data
      ) => {
        serviceCalls.push({ domain, service, data });
        return pendingPlayMedia;
      };

      const promise = searchController.handlePlaySimilar();
      // Immediately transitions to "loading" while awaiting play_media
      assert.equal(mockHost._similarTracksStatus, "loading");
      assert.equal(serviceCalls.length, 1);

      // Re-entrant call while loading is a no-op
      await searchController.handlePlaySimilar();
      assert.equal(serviceCalls.length, 1);

      resolvePlayMedia();
      await promise;

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "music_assistant",
        service: "play_media",
        data: {
          entity_id: "media_player.ma_kitchen",
          media_id: "library://track/100",
          media_type: "track",
          enqueue: "replace_next",
          radio_mode: true,
        },
      });
      assert.equal("artist" in serviceCalls[0].data, false);
      assert.equal(
        "all_upcoming_sort_default" in mockHost._searchResultsByType,
        false,
        "Expected upcoming cache to be invalidated"
      );
      assert.equal(refreshQueueCalls, 0);
      assert.equal(mockHost._similarTracksStatus, "success");
      assert.equal(mockHost._radioModeActive, false);
      assert.ok(searchController._similarStatusTimer !== null);
    });

    it("uses mockItem.media_content_id and artist when !trackUri (e.g. HTTP stream URL on external player while MA is active)", async () => {
      const activeMaState = {
        entity_id: "media_player.ma_kitchen",
        state: "playing",
        attributes: {},
      };
      const externalState = {
        entity_id: "media_player.sonos_kitchen",
        state: "playing",
        attributes: {
          media_content_id: "https://stream.example.com/track.mp3",
          media_content_type: "music",
          media_title: "External Song",
          media_artist: "External Artist",
        },
      };
      mockHost._getMusicAssistantState = () => activeMaState;
      mockHost.currentActivePlaybackStateObj = externalState;
      mockHost.currentPlaybackStateObj = externalState;
      mockHost.currentStateObj = externalState;

      await searchController.handlePlaySimilar();

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "music_assistant",
        service: "play_media",
        data: {
          entity_id: "media_player.ma_kitchen",
          media_id: "https://stream.example.com/track.mp3",
          media_type: "track",
          enqueue: "replace_next",
          radio_mode: true,
          artist: "External Artist",
        },
      });
      assert.equal(mockHost._similarTracksStatus, "success");
      assert.equal(mockHost._radioModeActive, false);
    });

    it("refreshes queue when _upcomingFilterActive is true", async () => {
      mockHost._upcomingFilterActive = true;
      await searchController.handlePlaySimilar();

      assert.equal(refreshQueueCalls, 1);
      assert.equal(mockHost._similarTracksStatus, "success");
    });

    it("clears _similarTracksStatus and closes media title options after 1500ms timer fires", async () => {
      mock.timers.enable({ apis: ["setTimeout"] });
      try {
        await searchController.handlePlaySimilar();
        assert.equal(mockHost._similarTracksStatus, "success");
        assert.equal(mockHost._showMediaTitleOptions, true);

        mock.timers.tick(1500);
        assert.equal(mockHost._similarTracksStatus, null);
        assert.equal(mockHost._showMediaTitleOptions, false);
        assert.equal(searchController._similarStatusTimer, null);
      } finally {
        mock.timers.reset();
      }
    });

    it("falls back to playMediaFromSearch when Music Assistant state is missing (null)", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      const externalState = {
        entity_id: "media_player.sonos_kitchen",
        state: "playing",
        attributes: {
          media_content_id: "https://stream.example.com/track.mp3",
          media_content_type: "music",
          media_title: "External Song",
          media_artist: "External Artist",
        },
      };
      mockHost._getMusicAssistantState = () => null;
      mockHost.currentActivePlaybackStateObj = externalState;
      mockHost.currentPlaybackStateObj = externalState;
      mockHost.currentStateObj = externalState;

      await searchController.handlePlaySimilar();

      assert.equal(serviceCalls.length, 0);
      assert.equal(mockHost._radioModeActive, true);
      assert.equal(mockHost._showMediaTitleOptions, false);
      assert.equal(playSearchSpy.mock.calls.length, 1);
      const calledItem = /** @type {any[]} */ (playSearchSpy.mock.calls[0].arguments)[0];
      assert.equal(calledItem.title, "External Song");
      assert.equal(calledItem.media_artist, "External Artist");
    });

    it("falls back to playMediaFromSearch when Music Assistant state is idle while external player plays", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      const idleMaState = {
        entity_id: "media_player.ma_kitchen",
        state: "idle",
        attributes: {},
      };
      const externalState = {
        entity_id: "media_player.sonos_kitchen",
        state: "playing",
        attributes: {
          media_content_id: "https://stream.example.com/track.mp3",
          media_content_type: "music",
          media_title: "External Song",
          media_artist: "External Artist",
        },
      };
      mockHost._getMusicAssistantState = () => idleMaState;
      mockHost.currentActivePlaybackStateObj = externalState;
      mockHost.currentPlaybackStateObj = externalState;
      mockHost.currentStateObj = externalState;

      await searchController.handlePlaySimilar();

      assert.equal(serviceCalls.length, 0);
      assert.equal(mockHost._radioModeActive, true);
      assert.equal(mockHost._showMediaTitleOptions, false);
      assert.equal(playSearchSpy.mock.calls.length, 1);
    });

    it("falls back to playMediaFromSearch when currently playing radio (isCurrentlyPlayingRadio or library://radio/)", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      mockHost.currentActivePlaybackStateObj.attributes.media_content_type = "radio";

      await searchController.handlePlaySimilar();

      assert.equal(serviceCalls.length, 0);
      assert.equal(mockHost._radioModeActive, true);
      assert.equal(mockHost._showMediaTitleOptions, false);
      assert.equal(playSearchSpy.mock.calls.length, 1);

      // Reset and test library://radio/... URI on maState while playbackState has music content type
      mockHost._radioModeActive = false;
      mockHost._showMediaTitleOptions = true;
      const maRadioState = {
        entity_id: "media_player.ma_kitchen",
        state: "playing",
        attributes: {
          media_content_id: "library://radio/42",
          media_content_type: "music",
          media_title: "Radio Station",
          media_artist: "Station Artist",
        },
      };
      const playbackMusicState = {
        entity_id: "media_player.ma_kitchen",
        state: "playing",
        attributes: {
          media_content_id: "https://stream.example.com/radio",
          media_content_type: "music",
          media_title: "Radio Track",
          media_artist: "Track Artist",
        },
      };
      mockHost._getMusicAssistantState = () => maRadioState;
      mockHost.currentActivePlaybackStateObj = playbackMusicState;
      mockHost.currentPlaybackStateObj = playbackMusicState;
      mockHost.currentStateObj = playbackMusicState;

      await searchController.handlePlaySimilar();

      assert.equal(serviceCalls.length, 0);
      assert.equal(mockHost._radioModeActive, true);
      assert.equal(mockHost._showMediaTitleOptions, false);
      assert.equal(playSearchSpy.mock.calls.length, 2);
    });

    it("falls back to playMediaFromSearch when music_assistant.play_media rejects during replace_next", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      mockHost.hass.callService = async () => {
        throw new Error("play_media failed");
      };

      await searchController.handlePlaySimilar();

      assert.equal(mockHost._similarTracksStatus, null);
      assert.equal(mockHost._radioModeActive, true);
      assert.equal(mockHost._showMediaTitleOptions, false);
      assert.equal(playSearchSpy.mock.calls.length, 1);
    });

    it("falls back to playMediaFromSearch when companion maState is paused on unrelated media (_areEntitiesPlayingSameMedia returns false)", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      const pausedMaState = {
        entity_id: "media_player.ma_kitchen",
        state: "paused",
        attributes: {
          media_content_id: "library://track/unrelated_ma",
          media_content_type: "music",
          media_title: "Old MA Song",
          media_artist: "Old MA Artist",
        },
      };
      const externalState = {
        entity_id: "media_player.sonos_kitchen",
        state: "playing",
        attributes: {
          media_content_id: "https://stream.example.com/external.mp3",
          media_content_type: "music",
          media_title: "External Direct Song",
          media_artist: "External Direct Artist",
        },
      };
      mockHost._getMusicAssistantState = () => pausedMaState;
      mockHost._areEntitiesPlayingSameMedia = () => false;
      mockHost.currentActivePlaybackStateObj = externalState;
      mockHost.currentPlaybackStateObj = externalState;
      mockHost.currentStateObj = externalState;

      await searchController.handlePlaySimilar();

      assert.equal(serviceCalls.length, 0);
      assert.equal(mockHost._radioModeActive, true);
      assert.equal(mockHost._showMediaTitleOptions, false);
      assert.equal(playSearchSpy.mock.calls.length, 1);
      const calledItem = /** @type {any[]} */ (playSearchSpy.mock.calls[0].arguments)[0];
      assert.equal(calledItem.title, "External Direct Song");
      assert.equal(calledItem.media_artist, "External Direct Artist");
    });

    it("cancels in-flight play_media via _similarOpToken when clearSimilarStatus() is called before resolution", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      /** @type {(value?: any) => void} */
      let resolvePlayMedia = () => {};
      const pendingPlayMedia = new Promise((resolve) => {
        resolvePlayMedia = resolve;
      });
      mockHost.hass.callService = async (
        /** @type {string} */ domain,
        /** @type {string} */ service,
        /** @type {any} */ data
      ) => {
        serviceCalls.push({ domain, service, data });
        return pendingPlayMedia;
      };

      const promise = searchController.handlePlaySimilar();
      assert.equal(mockHost._similarTracksStatus, "loading");

      searchController.clearSimilarStatus();
      assert.equal(mockHost._similarTracksStatus, null);

      resolvePlayMedia();
      await promise;

      assert.equal(mockHost._similarTracksStatus, null);
      assert.equal(searchController._similarStatusTimer, null);
      assert.equal(
        "all_upcoming_sort_default" in mockHost._searchResultsByType,
        true,
        "Expected upcoming cache not to be invalidated after cancellation"
      );
      assert.equal(playSearchSpy.mock.calls.length, 0);
      assert.equal(mockHost._radioModeActive, false);
    });

    it("cancels in-flight play_media via _similarOpToken when hostDisconnected() is called before resolution", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      /** @type {(value?: any) => void} */
      let resolvePlayMedia = () => {};
      const pendingPlayMedia = new Promise((resolve) => {
        resolvePlayMedia = resolve;
      });
      mockHost.hass.callService = async (
        /** @type {string} */ domain,
        /** @type {string} */ service,
        /** @type {any} */ data
      ) => {
        serviceCalls.push({ domain, service, data });
        return pendingPlayMedia;
      };

      const promise = searchController.handlePlaySimilar();
      assert.equal(mockHost._similarTracksStatus, "loading");

      searchController.hostDisconnected();

      resolvePlayMedia();
      await promise;

      assert.notEqual(mockHost._similarTracksStatus, "success");
      assert.equal(searchController._similarStatusTimer, null);
      assert.equal(playSearchSpy.mock.calls.length, 0);
      assert.equal(mockHost._radioModeActive, false);
    });

    it("cancels in-flight play_media via _similarOpToken and skips playMediaFromSearch fallback when rejected after clearSimilarStatus() or hostDisconnected()", async () => {
      const playSearchSpy = mock.method(
        searchController,
        "playMediaFromSearch",
        async (/** @type {any} */ _item) => {}
      );
      /** @type {(reason?: any) => void} */
      let rejectPlayMedia = () => {};
      const pendingPlayMedia = new Promise((_resolve, reject) => {
        rejectPlayMedia = reject;
      });
      mockHost.hass.callService = async (
        /** @type {string} */ domain,
        /** @type {string} */ service,
        /** @type {any} */ data
      ) => {
        serviceCalls.push({ domain, service, data });
        return pendingPlayMedia;
      };

      const promise1 = searchController.handlePlaySimilar();
      assert.equal(mockHost._similarTracksStatus, "loading");

      searchController.clearSimilarStatus();
      assert.equal(mockHost._similarTracksStatus, null);

      rejectPlayMedia(new Error("play_media aborted"));
      await promise1;

      assert.equal(mockHost._similarTracksStatus, null);
      assert.equal(searchController._similarStatusTimer, null);
      assert.equal(playSearchSpy.mock.calls.length, 0);
      assert.equal(mockHost._radioModeActive, false);

      // Also verify hostDisconnected() on rejection
      /** @type {(reason?: any) => void} */
      let rejectPlayMedia2 = () => {};
      const pendingPlayMedia2 = new Promise((_resolve, reject) => {
        rejectPlayMedia2 = reject;
      });
      mockHost.hass.callService = async (
        /** @type {string} */ domain,
        /** @type {string} */ service,
        /** @type {any} */ data
      ) => {
        serviceCalls.push({ domain, service, data });
        return pendingPlayMedia2;
      };

      const promise2 = searchController.handlePlaySimilar();
      assert.equal(mockHost._similarTracksStatus, "loading");

      searchController.hostDisconnected();
      rejectPlayMedia2(new Error("play_media disconnected"));
      await promise2;

      assert.notEqual(mockHost._similarTracksStatus, "success");
      assert.equal(searchController._similarStatusTimer, null);
      assert.equal(playSearchSpy.mock.calls.length, 0);
      assert.equal(mockHost._radioModeActive, false);
    });
  });

  // =========================================================================
  // 5. getMassQueueConfigEntryId (including non-admin mass_queue/get_info fallback)
  // =========================================================================
  describe("getMassQueueConfigEntryId", () => {
    it("returns null when hass is null or mass_queue service is missing", async () => {
      assert.equal(await getMassQueueConfigEntryId(null), null);
      assert.equal(await getMassQueueConfigEntryId({ services: {} }), null);
    });

    it("resolves via config_entries/get for admin users", async () => {
      const sent = /** @type {any[]} */ ([]);
      const hass = {
        user: { is_admin: true },
        services: { mass_queue: {} },
        connection: {
          sendMessagePromise: async (/** @type {any} */ msg) => {
            sent.push(msg);
            if (msg.type === "config_entries/get") {
              return [{ entry_id: "admin_mq_entry" }];
            }
            return {};
          },
        },
      };

      const entryId = await getMassQueueConfigEntryId(hass, "media_player.ma_1");
      assert.equal(entryId, "admin_mq_entry");
      assert.equal(sent.length, 1);
      assert.deepEqual(sent[0], { type: "config_entries/get", domain: "mass_queue" });

      // Cached within TTL
      const cached = await getMassQueueConfigEntryId(hass, "media_player.ma_1");
      assert.equal(cached, "admin_mq_entry");
      assert.equal(sent.length, 1);

      // Expires after TTL (> 30000ms)
      fakeNow += 35_000;
      const refreshed = await getMassQueueConfigEntryId(hass, "media_player.ma_1");
      assert.equal(refreshed, "admin_mq_entry");
      assert.equal(sent.length, 2);
    });

    it("resolves via mass_queue/get_info for non-admin users when targetEntityId is provided", async () => {
      const sent = /** @type {any[]} */ ([]);
      const hass = {
        user: { is_admin: false },
        services: { mass_queue: {} },
        entities: {
          "media_player.ma_bedroom": {
            entity_id: "media_player.ma_bedroom",
            platform: "music_assistant",
          },
        },
        connection: {
          sendMessagePromise: async (/** @type {any} */ msg) => {
            sent.push(msg);
            if (msg.type === "mass_queue/get_info") {
              return { entries: { mass_queue: "nonadmin_mq_entry_42" } };
            }
            throw new Error(`Unexpected WS call: ${msg.type}`);
          },
        },
      };

      const entryId = await getMassQueueConfigEntryId(hass, "media_player.ma_bedroom");
      assert.equal(entryId, "nonadmin_mq_entry_42");
      assert.equal(sent.length, 1);
      assert.deepEqual(sent[0], {
        type: "mass_queue/get_info",
        entity_id: "media_player.ma_bedroom",
      });
    });

    it("falls back to 'auto' when non-admin mass_queue/get_info rejects or lacks entry", async () => {
      const sent = /** @type {any[]} */ ([]);
      const hassReject = {
        user: { is_admin: false },
        services: { mass_queue: {} },
        connection: {
          sendMessagePromise: async (/** @type {any} */ msg) => {
            sent.push(msg);
            throw new Error("get_info unsupported");
          },
        },
      };

      const entryId = await getMassQueueConfigEntryId(hassReject, "media_player.ma_bedroom");
      assert.equal(entryId, "auto");
      assert.equal(sent.length, 1);
      assert.equal(sent[0].type, "mass_queue/get_info");

      // Advance past TTL and verify missing entries.mass_queue also returns "auto"
      fakeNow += 35_000;
      const hassEmpty = {
        user: { is_admin: false },
        services: { mass_queue: {} },
        connection: {
          sendMessagePromise: async () => ({ entries: {} }),
        },
      };
      assert.equal(await getMassQueueConfigEntryId(hassEmpty, "media_player.ma_bedroom"), "auto");
    });

    it("falls back to 'auto' for non-admin without calling mass_queue/get_info when targetEntityId is null", async () => {
      const sent = /** @type {any[]} */ ([]);
      const hass = {
        user: { is_admin: false },
        services: { mass_queue: {} },
        connection: {
          sendMessagePromise: async (/** @type {any} */ msg) => {
            sent.push(msg);
            return {};
          },
        },
      };

      const entryId = await getMassQueueConfigEntryId(hass, null);
      assert.equal(entryId, "auto");
      assert.equal(sent.length, 0);
    });
  });
});
