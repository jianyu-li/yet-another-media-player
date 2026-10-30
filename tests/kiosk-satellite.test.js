import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";

// Setup mock browser globals before importing Lit component
const g = /** @type {any} */ (globalThis);
g.window = globalThis;
if (!g.customElements) {
  g.customElements = { define() {} };
}
if (!g.HTMLElement) {
  class MockHTMLElement {
    constructor() {
      this.renderRoot = {
        querySelector: () => null,
        querySelectorAll: () => [],
      };
    }
    attachShadow() {
      return this.renderRoot;
    }
    dispatchEvent() {
      return true;
    }
    addEventListener() {}
    removeEventListener() {}
  }
  g.HTMLElement = MockHTMLElement;
}
g.__VERSION__ = "1.0.0-test";

import {
  isKioskSatellite,
  getMediaPlayerEntityIds,
  findPlayingUnconfiguredPlayers,
  searchMediaPlayers,
  evaluateJsTemplate,
  resolveStringTemplateSync,
} from "../src/yamp-utils.js";

const { YetAnotherMediaPlayerCard, _resetKioskSatelliteCacheForTests } =
  await import("../src/yet-another-media-player.js");

describe("Kiosk Satellite Optimizations & Runtime Integrations", () => {
  /** @type {EventTarget} */
  let windowEventTarget;
  /** @type {any} */
  let locationAssignMock;

  beforeEach(() => {
    windowEventTarget = new EventTarget();
    locationAssignMock = mock.fn();

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

    g.window.location = {
      assign: locationAssignMock,
      hash: "",
    };

    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
  });

  afterEach(() => {
    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
  });

  describe("1. isKioskSatellite() Detection", () => {
    it("returns false when window.kioskSatellite is undefined or null", () => {
      delete g.window.kioskSatellite;
      assert.equal(isKioskSatellite(), false);

      g.window.kioskSatellite = null;
      assert.equal(isKioskSatellite(), false);
    });

    it("returns false when window.kioskSatellite has a non-matching platform or missing platform", () => {
      g.window.kioskSatellite = {};
      assert.equal(isKioskSatellite(), false);

      g.window.kioskSatellite = { platform: "browser" };
      assert.equal(isKioskSatellite(), false);

      g.window.kioskSatellite = { platform: "fullykiosk" };
      assert.equal(isKioskSatellite(), false);
    });

    it("returns true when window.kioskSatellite platform is 'kiosksatellite'", () => {
      g.window.kioskSatellite = { platform: "kiosksatellite" };
      assert.equal(isKioskSatellite(), true);
    });
  });

  describe("2. Entity Discovery without hass.states key enumeration", () => {
    /** @type {Record<string, any>} */
    const rawStates = {
      "media_player.kitchen": {
        entity_id: "media_player.kitchen",
        state: "playing",
        attributes: {
          friendly_name: "Kitchen Speaker",
          media_title: "Song A",
          media_artist: "Artist A",
        },
      },
      "media_player.living_room": {
        entity_id: "media_player.living_room",
        state: "paused",
        attributes: {
          friendly_name: "Living Room Speaker",
        },
      },
      "media_player.disabled_speaker": {
        entity_id: "media_player.disabled_speaker",
        state: "playing",
        attributes: {
          friendly_name: "Disabled Speaker",
        },
      },
      "sensor.temp": {
        entity_id: "sensor.temp",
        state: "21",
        attributes: {
          friendly_name: "Kitchen Temperature",
        },
      },
    };

    /** @type {Record<string, any>} */
    const entitiesRegistry = {
      "media_player.kitchen": {
        entity_id: "media_player.kitchen",
        disabled_by: null,
      },
      "media_player.living_room": {
        entity_id: "media_player.living_room",
        disabled_by: null,
      },
      "media_player.disabled_speaker": {
        entity_id: "media_player.disabled_speaker",
        disabled_by: "user",
      },
      "sensor.temp": {
        entity_id: "sensor.temp",
        disabled_by: null,
      },
    };

    /** @type {Record<string, any>} */
    let proxiedStates;

    beforeEach(() => {
      proxiedStates = new Proxy(rawStates, {
        ownKeys() {
          throw new Error("hass.states enumeration forbidden on Kiosk Satellite");
        },
        getOwnPropertyDescriptor(target, prop) {
          return Reflect.getOwnPropertyDescriptor(target, prop);
        },
      });
    });

    it("verifies the Proxy trap throws when ownKeys is enumerated directly", () => {
      assert.throws(
        () => Object.keys(proxiedStates),
        /hass\.states enumeration forbidden on Kiosk Satellite/
      );
    });

    it("getMediaPlayerEntityIds returns active media players from registry without enumerating proxiedStates", () => {
      const ids = getMediaPlayerEntityIds(proxiedStates, entitiesRegistry);
      assert.deepEqual(ids, ["media_player.kitchen", "media_player.living_room"]);
    });

    it("getMediaPlayerEntityIds falls back to Object.keys(states) when entitiesRegistry is null or empty", () => {
      const idsFromNull = getMediaPlayerEntityIds(rawStates, null);
      assert.deepEqual(idsFromNull, [
        "media_player.kitchen",
        "media_player.living_room",
        "media_player.disabled_speaker",
      ]);

      const idsFromEmpty = getMediaPlayerEntityIds(rawStates, {});
      assert.deepEqual(idsFromEmpty, [
        "media_player.kitchen",
        "media_player.living_room",
        "media_player.disabled_speaker",
      ]);
    });

    it("getMediaPlayerEntityIds returns empty array without enumerating proxiedStates when registry has non-media entities but no media players", () => {
      const nonMediaRegistry = {
        "sensor.temp": { entity_id: "sensor.temp", disabled_by: null },
        "light.kitchen": { entity_id: "light.kitchen", disabled_by: null },
      };
      const ids = getMediaPlayerEntityIds(proxiedStates, nonMediaRegistry);
      assert.deepEqual(ids, []);
    });

    it("findPlayingUnconfiguredPlayers discovers playing entities without enumerating proxiedStates", () => {
      const covered = ["media_player.living_room"];
      const playing = findPlayingUnconfiguredPlayers(proxiedStates, covered, [], entitiesRegistry);
      assert.deepEqual(playing, ["media_player.kitchen"]);
    });

    it("searchMediaPlayers filters and sorts candidates without enumerating proxiedStates", () => {
      const covered = ["media_player.living_room"];
      const results = searchMediaPlayers(
        proxiedStates,
        "kitchen",
        covered,
        [],
        8,
        entitiesRegistry
      );
      assert.equal(results.length, 1);
      assert.equal(results[0].id, "media_player.kitchen");
      assert.equal(results[0].name, "Kitchen Speaker");
      assert.equal(results[0].isPlaying, true);
    });

    it("_discoverAutoEntities updates auto entities without enumerating proxiedStates", () => {
      const setTransientEntitiesMock = mock.fn();
      const mockCard = {
        hass: {
          states: proxiedStates,
          entities: entitiesRegistry,
        },
        config: {
          auto_add_exclude: [],
        },
        _autoEntities: [],
        _getCoveredEntityIds: () => new Set(["media_player.living_room"]),
        _setTransientEntities: setTransientEntitiesMock,
      };

      const oldHass = {
        states: {
          "media_player.kitchen": {
            ...rawStates["media_player.kitchen"],
            state: "idle",
          },
          "media_player.living_room": rawStates["media_player.living_room"],
        },
      };

      const changed = YetAnotherMediaPlayerCard.prototype._discoverAutoEntities.call(
        /** @type {any} */ (mockCard),
        oldHass
      );

      assert.equal(changed, true);
      assert.equal(setTransientEntitiesMock.mock.calls.length, 1);
      assert.deepEqual(setTransientEntitiesMock.mock.calls[0].arguments[0], {
        auto: ["media_player.kitchen"],
      });
    });
  });

  describe("3. Template Context & Dual-Engine Evaluation (is_kiosk and kiosk_name)", () => {
    it("exposes is_kiosk and kiosk_name in _getTemplateContext()", () => {
      g.window.kioskSatellite = { platform: "kiosksatellite" };

      const mockCard = {
        currentEntityId: "media_player.kitchen",
        currentActivePlaybackEntityId: "media_player.kitchen",
        _isIdle: false,
        _isCurrentEntityPlaying: () => true,
        _showSearchInSheet: false,
        _showGrouping: false,
        _showSourceList: false,
        _showSourceMenu: false,
        _lyricsActive: false,
        _showEntityOptions: false,
        _showTransferQueue: false,
        isAnyMenuOpen: false,
        _isFullScreen: false,
        _isMobile: false,
        _isMusicAssistantEntity: () => false,
        _isMusicContentType: () => true,
        _kioskDeviceName: "Kitchen Echo 8",
        hass: { themes: { darkMode: true } },
      };

      const context = YetAnotherMediaPlayerCard.prototype._getTemplateContext.call(
        /** @type {any} */ (mockCard)
      );

      assert.equal(context.is_kiosk, true);
      assert.equal(context.kiosk_name, "Kitchen Echo 8");
    });

    it("evaluates is_kiosk and kiosk_name in client-side JavaScript templates", () => {
      const mockHass = /** @type {any} */ ({ states: {} });
      const kioskContext = {
        is_kiosk: true,
        kiosk_name: "Living Room Echo",
      };
      const browserContext = {
        is_kiosk: false,
        kiosk_name: "",
      };

      const jsTemplate = "[[[ return is_kiosk ? `Kiosk: ${kiosk_name}` : 'Browser Device'; ]]]";

      assert.equal(
        evaluateJsTemplate(jsTemplate, mockHass, kioskContext),
        "Kiosk: Living Room Echo"
      );
      assert.equal(evaluateJsTemplate(jsTemplate, mockHass, browserContext), "Browser Device");
    });

    it("evaluates kiosk_name and is_kiosk in synchronous Jinja2 templates via resolveStringTemplateSync", () => {
      const mockHass = /** @type {any} */ ({ states: {} });
      const context = {
        is_kiosk: true,
        kiosk_name: "Bedroom Echo",
      };

      assert.equal(
        resolveStringTemplateSync(mockHass, "{{ kiosk_name }}", context),
        "Bedroom Echo"
      );
      assert.equal(resolveStringTemplateSync(mockHass, "{{ is_kiosk }}", context), "true");
    });

    it("evaluates JS templates synchronously through resolveStringTemplateSync", () => {
      const mockHass = /** @type {any} */ ({ states: {} });
      const context = {
        is_kiosk: true,
        kiosk_name: "Office Satellite",
      };

      const template = "[[[ return is_kiosk ? kiosk_name : 'fallback'; ]]]";
      assert.equal(resolveStringTemplateSync(mockHass, template, context), "Office Satellite");
    });
  });

  describe("4. Custom Scheme Navigation (ks:// and app://)", () => {
    it("navigates ks:// and app:// URLs directly via window.location.assign without hass-navigate event", () => {
      const dispatchEventMock = mock.fn(() => true);
      const hassNavigateMock = mock.fn();
      const mockCard = {
        dispatchEvent: dispatchEventMock,
        hass: {
          navigate: hassNavigateMock,
        },
      };

      // 1. ks:// scheme
      YetAnotherMediaPlayerCard.prototype._handleNavigate.call(
        /** @type {any} */ (mockCard),
        "ks://music-library"
      );
      assert.equal(locationAssignMock.mock.calls.length, 1);
      assert.equal(locationAssignMock.mock.calls[0].arguments[0], "ks://music-library");
      assert.equal(dispatchEventMock.mock.calls.length, 0);
      assert.equal(hassNavigateMock.mock.calls.length, 0);

      // 2. app:// scheme
      YetAnotherMediaPlayerCard.prototype._handleNavigate.call(
        /** @type {any} */ (mockCard),
        "app://com.spotify.music"
      );
      assert.equal(locationAssignMock.mock.calls.length, 2);
      assert.equal(locationAssignMock.mock.calls[1].arguments[0], "app://com.spotify.music");
      assert.equal(dispatchEventMock.mock.calls.length, 0);
      assert.equal(hassNavigateMock.mock.calls.length, 0);

      // 3. Case-insensitive scheme match
      YetAnotherMediaPlayerCard.prototype._handleNavigate.call(
        /** @type {any} */ (mockCard),
        "KS://quick-actions"
      );
      assert.equal(locationAssignMock.mock.calls.length, 3);
      assert.equal(locationAssignMock.mock.calls[2].arguments[0], "KS://quick-actions");
    });

    it("dispatches hass-navigate event for standard internal paths", () => {
      const dispatchEventMock = mock.fn((/** @type {Event} */ _e) => true);
      const hassNavigateMock = mock.fn();
      const mockCard = {
        dispatchEvent: dispatchEventMock,
        hass: {
          navigate: hassNavigateMock,
        },
      };

      YetAnotherMediaPlayerCard.prototype._handleNavigate.call(
        /** @type {any} */ (mockCard),
        "/lovelace/media"
      );

      assert.equal(dispatchEventMock.mock.calls.length, 1);
      const dispatchedEvent = /** @type {CustomEvent} */ (
        dispatchEventMock.mock.calls[0].arguments[0]
      );
      assert.equal(dispatchedEvent.type, "hass-navigate");
      assert.equal(dispatchedEvent.detail.path, "/lovelace/media");
      assert.equal(hassNavigateMock.mock.calls.length, 1);
      assert.equal(hassNavigateMock.mock.calls[0].arguments[0], "/lovelace/media");
      assert.equal(locationAssignMock.mock.calls.length, 0);
    });

    it("ignores empty or whitespace paths gracefully", () => {
      const dispatchEventMock = mock.fn();
      const mockCard = {
        dispatchEvent: dispatchEventMock,
      };

      YetAnotherMediaPlayerCard.prototype._handleNavigate.call(/** @type {any} */ (mockCard), "");
      YetAnotherMediaPlayerCard.prototype._handleNavigate.call(
        /** @type {any} */ (mockCard),
        "   "
      );
      assert.equal(locationAssignMock.mock.calls.length, 0);
      assert.equal(dispatchEventMock.mock.calls.length, 0);
    });
  });

  describe("5. Media Session Loop Suppression (_isMediaSessionEnabled)", () => {
    it("returns false in editor preview mode regardless of settings", () => {
      const card = new YetAnotherMediaPlayerCard();
      card._isEditorPreviewCached = true;
      card._mediaSessionOverride = true;
      card.config = { lock_screen_controls: true };

      assert.equal(card._isMediaSessionEnabled, false);
    });

    it("returns false on Kiosk Satellite even when lock_screen_controls is true", () => {
      g.window.kioskSatellite = { platform: "kiosksatellite" };

      const card = new YetAnotherMediaPlayerCard();
      card._isEditorPreviewCached = false;
      card._mediaSessionOverride = null;
      card.config = { lock_screen_controls: true };

      assert.equal(card._isMediaSessionEnabled, false);
    });

    it("returns true on Kiosk Satellite when explicit mediaSessionOverride is enabled", () => {
      g.window.kioskSatellite = { platform: "kiosksatellite" };

      const card = new YetAnotherMediaPlayerCard();
      card._isEditorPreviewCached = false;
      card._mediaSessionOverride = true;
      card.config = { lock_screen_controls: false };

      assert.equal(card._isMediaSessionEnabled, true);
    });

    it("returns true in standard browser when lock_screen_controls is true", () => {
      delete g.window.kioskSatellite;

      const card = new YetAnotherMediaPlayerCard();
      card._isEditorPreviewCached = false;
      card._mediaSessionOverride = null;
      card.config = { lock_screen_controls: true };

      assert.equal(card._isMediaSessionEnabled, true);
    });

    it("returns false in standard browser when lock_screen_controls is false", () => {
      delete g.window.kioskSatellite;

      const card = new YetAnotherMediaPlayerCard();
      card._isEditorPreviewCached = false;
      card._mediaSessionOverride = null;
      card.config = { lock_screen_controls: false };

      assert.equal(card._isMediaSessionEnabled, false);
    });
  });

  describe("6. Kiosk Satellite Lifecycle, Obscured Timer Pause & Interaction Bracketing", () => {
    it("_initKioskSatellite does nothing when not running on Kiosk Satellite", () => {
      delete g.window.kioskSatellite;

      const card = new YetAnotherMediaPlayerCard();
      card._initKioskSatellite();

      assert.equal(card._kioskListenersAttached, false);
      assert.equal(card._kioskObscured, false);
      assert.equal(card._kioskInteractionActive, false);
    });

    it("_initKioskSatellite queries device info, caches name, probes initial state, and attaches listeners", async () => {
      const getDeviceInfoMock = mock.fn(async () => ({ name: "Black Echo 5" }));
      const getKioskStateMock = mock.fn(() => ({ screenOn: false }));

      g.window.kioskSatellite = {
        platform: "kiosksatellite",
        getDeviceInfo: getDeviceInfoMock,
        getKioskState: getKioskStateMock,
      };

      const card = new YetAnotherMediaPlayerCard();
      card.requestUpdate = mock.fn();

      card._initKioskSatellite();

      // Verify state was probed synchronously and set obscured
      assert.equal(getKioskStateMock.mock.calls.length, 1);
      assert.equal(card._kioskObscured, true);
      assert.equal(card._kioskListenersAttached, true);

      // Await device info promise resolution
      await new Promise((r) => setTimeout(r, 10));

      assert.equal(getDeviceInfoMock.mock.calls.length, 1);
      assert.equal(card._kioskDeviceName, "Black Echo 5");
      assert.ok(card.requestUpdate.mock.calls.length >= 1);

      // Verify a second card instance reuses the cached device name synchronously
      const card2 = new YetAnotherMediaPlayerCard();
      card2._initKioskSatellite();
      assert.equal(card2._kioskDeviceName, "Black Echo 5");
      assert.equal(getDeviceInfoMock.mock.calls.length, 1); // No second query

      // Cleanup
      card._cleanupKioskSatellite();
      card2._cleanupKioskSatellite();
    });

    it("_applyKioskState correctly evaluates screen, screensaver, camera, and media player states", () => {
      const card = new YetAnotherMediaPlayerCard();

      // Screen turned off
      card._applyKioskState({ screenOn: false });
      assert.equal(card._kioskObscured, true);

      // Screen on, screensaver active but dimmed (non-opaque)
      card._applyKioskState({
        screenOn: true,
        screensaver: { active: true, view: "dim" },
      });
      assert.equal(card._kioskObscured, false);

      // Screensaver active and opaque (e.g., clock/slideshow)
      card._applyKioskState({
        screenOn: true,
        screensaver: { active: true, view: "clock" },
      });
      assert.equal(card._kioskObscured, true);

      // Camera view active
      card._applyKioskState({
        screenOn: true,
        screensaver: { active: false },
        cameraView: true,
      });
      assert.equal(card._kioskObscured, true);

      // Native now playing screen shown
      card._applyKioskState({
        screenOn: true,
        screensaver: { active: false },
        cameraView: false,
        mediaPlayer: { nowPlayingShown: true },
      });
      assert.equal(card._kioskObscured, true);

      // Normal visible state
      card._applyKioskState({
        screenOn: true,
        screensaver: { active: false },
        cameraView: false,
        mediaPlayer: { nowPlayingShown: false },
      });
      assert.equal(card._kioskObscured, false);
    });

    it("_setKioskObscured clears progress timer when obscured and calls requestUpdate when unobscured", () => {
      const card = new YetAnotherMediaPlayerCard();
      card.requestUpdate = mock.fn();

      // Set a running timer handle
      const dummyTimer = setInterval(() => {}, 10000);
      card._progressTimer = dummyTimer;

      // Obscuring clears timer
      card._setKioskObscured(true);
      assert.equal(card._kioskObscured, true);
      assert.equal(card._progressTimer, null);

      // Subsequent identical call is a no-op
      card._setKioskObscured(true);
      assert.equal(card.requestUpdate.mock.calls.length, 0);

      // Unobscuring triggers requestUpdate
      card._setKioskObscured(false);
      assert.equal(card._kioskObscured, false);
      assert.equal(card.requestUpdate.mock.calls.length, 1);
    });

    it("listens to window kiosksatellite events when initialized", () => {
      g.window.kioskSatellite = { platform: "kiosksatellite" };

      const card = new YetAnotherMediaPlayerCard();
      card.requestUpdate = mock.fn();
      card._initKioskSatellite();

      // Screen off event
      g.window.dispatchEvent(new CustomEvent("kiosksatellite:screenoff"));
      assert.equal(card._kioskObscured, true);

      // Screen on event
      g.window.dispatchEvent(new CustomEvent("kiosksatellite:screenon"));
      assert.equal(card._kioskObscured, false);

      // Screensaver start event
      g.window.dispatchEvent(new CustomEvent("kiosksatellite:screensaverstart"));
      assert.equal(card._kioskObscured, true);

      // Screensaver stop event
      g.window.dispatchEvent(new CustomEvent("kiosksatellite:screensaverstop"));
      assert.equal(card._kioskObscured, false);

      // Kiosk state event
      g.window.dispatchEvent(
        new CustomEvent("kiosksatellite:kiosk-state", {
          detail: { cameraView: true },
        })
      );
      assert.equal(card._kioskObscured, true);

      card._cleanupKioskSatellite();
    });

    it("_syncKioskInteractionHold brackets interaction using setInteractionActive or pauseScreensaver", () => {
      const setInteractionActiveMock = mock.fn();
      g.window.kioskSatellite = {
        platform: "kiosksatellite",
        setInteractionActive: setInteractionActiveMock,
      };

      const card = new YetAnotherMediaPlayerCard();
      card._isEditorPreviewCached = false;

      // 1. Menu open -> holds screensaver
      card._showEntityOptions = true;
      card._fullScreenOverride = false;
      card._syncKioskInteractionHold();

      assert.equal(card._kioskInteractionActive, true);
      assert.equal(setInteractionActiveMock.mock.calls.length, 1);
      assert.equal(setInteractionActiveMock.mock.calls[0].arguments[0], true);
      assert.equal(setInteractionActiveMock.mock.calls[0].arguments[1], "yamp");

      // 2. Fullscreen open while menu closes -> maintains hold without re-calling
      card._showEntityOptions = false;
      card._fullScreenOverride = true;
      card._syncKioskInteractionHold();

      assert.equal(card._kioskInteractionActive, true);
      assert.equal(setInteractionActiveMock.mock.calls.length, 1);

      // 3. All menus closed -> releases hold
      card._fullScreenOverride = false;
      card._syncKioskInteractionHold();

      assert.equal(card._kioskInteractionActive, false);
      assert.equal(setInteractionActiveMock.mock.calls.length, 2);
      assert.equal(setInteractionActiveMock.mock.calls[1].arguments[0], false);
      assert.equal(setInteractionActiveMock.mock.calls[1].arguments[1], "yamp");

      // 4. Fallback to pauseScreensaver if setInteractionActive is not present
      const pauseScreensaverMock = mock.fn();
      g.window.kioskSatellite = {
        platform: "kiosksatellite",
        pauseScreensaver: pauseScreensaverMock,
      };

      card._showEntityOptions = true;
      card._syncKioskInteractionHold();

      assert.equal(card._kioskInteractionActive, true);
      assert.equal(pauseScreensaverMock.mock.calls.length, 1);
      assert.equal(pauseScreensaverMock.mock.calls[0].arguments[0], true);

      card._showEntityOptions = false;
      card._syncKioskInteractionHold();
      assert.equal(pauseScreensaverMock.mock.calls.length, 2);
      assert.equal(pauseScreensaverMock.mock.calls[1].arguments[0], false);
    });

    it("_cleanupKioskSatellite removes listeners and releases active interaction hold", () => {
      const setInteractionActiveMock = mock.fn();
      g.window.kioskSatellite = {
        platform: "kiosksatellite",
        setInteractionActive: setInteractionActiveMock,
      };

      const card = new YetAnotherMediaPlayerCard();
      card._isEditorPreviewCached = false;
      card._initKioskSatellite();

      card._showEntityOptions = true;
      card._syncKioskInteractionHold();
      assert.equal(card._kioskInteractionActive, true);

      // Disconnect / cleanup
      card._cleanupKioskSatellite();

      assert.equal(card._kioskListenersAttached, false);
      assert.equal(card._kioskInteractionActive, false);
      assert.equal(setInteractionActiveMock.mock.calls.length, 2);
      assert.equal(setInteractionActiveMock.mock.calls[1].arguments[0], false);
      assert.equal(setInteractionActiveMock.mock.calls[1].arguments[1], "yamp");

      // Window events should no longer affect obscured state
      g.window.dispatchEvent(new CustomEvent("kiosksatellite:screenoff"));
      assert.equal(card._kioskObscured, false);
    });
  });
});
