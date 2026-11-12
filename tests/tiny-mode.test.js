import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";

// Setup mock browser globals before importing Lit component
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
    attachShadow() {
      return {};
    }
  }
  g.HTMLElement = MockHTMLElement;
}
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerCard, _resetKioskSatelliteCacheForTests } =
  await import("../src/yet-another-media-player.js");
const { normalizeCollapsedMode } = await import("../src/config-schema.js");
const { IdleController } = await import("../src/controllers/idle-controller.js");

describe("Tiny Mode & 3-Mode Collapsed State", () => {
  beforeEach(() => {
    windowEventTarget = new EventTarget();
    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
  });

  afterEach(() => {
    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
  });

  describe("normalizeCollapsedMode edge cases", () => {
    it("handles booleans cleanly", () => {
      assert.equal(normalizeCollapsedMode(true), "mini");
      assert.equal(normalizeCollapsedMode(false), "standard");
    });

    it("handles null, undefined, empty, or whitespace-only inputs", () => {
      assert.equal(normalizeCollapsedMode(null), "standard");
      assert.equal(normalizeCollapsedMode(undefined), "standard");
      assert.equal(normalizeCollapsedMode(""), "standard");
      assert.equal(normalizeCollapsedMode("   "), "standard");
    });

    it("normalizes standard synonyms and aliases case-insensitively", () => {
      assert.equal(normalizeCollapsedMode("standard"), "standard");
      assert.equal(normalizeCollapsedMode("Standard"), "standard");
      assert.equal(normalizeCollapsedMode("STANDARD"), "standard");
      assert.equal(normalizeCollapsedMode("default"), "standard");
      assert.equal(normalizeCollapsedMode("false"), "standard");
      assert.equal(normalizeCollapsedMode("0"), "standard");
      assert.equal(normalizeCollapsedMode("off"), "standard");
      assert.equal(normalizeCollapsedMode("no"), "standard");
    });

    it("normalizes mini synonyms and aliases case-insensitively", () => {
      assert.equal(normalizeCollapsedMode("mini"), "mini");
      assert.equal(normalizeCollapsedMode("Mini"), "mini");
      assert.equal(normalizeCollapsedMode("MINI"), "mini");
      assert.equal(normalizeCollapsedMode("collapsed"), "mini");
      assert.equal(normalizeCollapsedMode("COLLAPSED"), "mini");
      assert.equal(normalizeCollapsedMode("true"), "mini");
      assert.equal(normalizeCollapsedMode("1"), "mini");
      assert.equal(normalizeCollapsedMode("on"), "mini");
      assert.equal(normalizeCollapsedMode("yes"), "mini");
    });

    it("normalizes tiny synonyms and aliases case-insensitively", () => {
      assert.equal(normalizeCollapsedMode("tiny"), "tiny");
      assert.equal(normalizeCollapsedMode("Tiny"), "tiny");
      assert.equal(normalizeCollapsedMode("TINY"), "tiny");
      assert.equal(normalizeCollapsedMode("tiny_player"), "tiny");
      assert.equal(normalizeCollapsedMode("tiny-player"), "tiny");
      assert.equal(normalizeCollapsedMode("TINY_PLAYER"), "tiny");
      assert.equal(normalizeCollapsedMode("Tiny-Player"), "tiny");
    });

    it("falls back to standard for unknown strings and arbitrary types", () => {
      assert.equal(normalizeCollapsedMode("expanded"), "standard");
      assert.equal(normalizeCollapsedMode("huge"), "standard");
      assert.equal(normalizeCollapsedMode(/** @type {any} */ (100)), "standard");
      assert.equal(normalizeCollapsedMode(/** @type {any} */ ({})), "standard");
      assert.equal(normalizeCollapsedMode(/** @type {any} */ ([])), "standard");
    });
  });

  describe("YetAnotherMediaPlayerCard Getters (_collapsedMode, _isTinyMode, _alwaysCollapsed, _cardType)", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card.hass = {
        states: {
          "media_player.kitchen": {
            entity_id: "media_player.kitchen",
            state: "idle",
            attributes: { friendly_name: "Kitchen" },
          },
          "media_player.patio": {
            entity_id: "media_player.patio",
            state: "idle",
            attributes: { friendly_name: "Patio" },
          },
        },
        callService: mock.fn(),
      };
      card.config = {
        entities: [{ entity: "media_player.kitchen" }, { entity: "media_player.patio" }],
      };
    });

    it("evaluates always_collapsed: false as standard mode", () => {
      card.config = { ...card.config, always_collapsed: false };
      assert.equal(card._collapsedMode, "standard");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, false);
    });

    it("evaluates always_collapsed: true as mini mode", () => {
      card.config = { ...card.config, always_collapsed: true };
      assert.equal(card._collapsedMode, "mini");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, true);
    });

    it("evaluates always_collapsed: 'mini' as mini mode", () => {
      card.config = { ...card.config, always_collapsed: "mini" };
      assert.equal(card._collapsedMode, "mini");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, true);
    });

    it("evaluates always_collapsed: 'tiny' as tiny mode", () => {
      card.config = { ...card.config, always_collapsed: "tiny" };
      assert.equal(card._collapsedMode, "tiny");
      assert.equal(card._isTinyMode, true);
      assert.equal(card._alwaysCollapsed, true);
    });

    it("forces tiny mode when card_type is tiny or alias even if always_collapsed is standard", () => {
      const aliases = ["tiny", "tiny_player", "tiny-player"];
      for (const alias of aliases) {
        card.config = {
          ...card.config,
          card_type: alias,
          always_collapsed: "standard",
        };
        assert.equal(card._cardType, "tiny", `Expected _cardType to be tiny for ${alias}`);
        assert.equal(
          card._collapsedMode,
          "tiny",
          `Expected _collapsedMode to be tiny for ${alias}`
        );
        assert.equal(card._isTinyMode, true, `Expected _isTinyMode to be true for ${alias}`);
        assert.equal(
          card._alwaysCollapsed,
          true,
          `Expected _alwaysCollapsed to be true for ${alias}`
        );
      }
    });

    it("forces tiny mode when template is tiny even if always_collapsed is standard", () => {
      card.config = {
        ...card.config,
        template: "tiny",
        always_collapsed: "standard",
      };
      assert.equal(card._cardType, "tiny");
      assert.equal(card._collapsedMode, "tiny");
      assert.equal(card._isTinyMode, true);
      assert.equal(card._alwaysCollapsed, true);
    });

    it("overrides _collapsedMode back to standard when _isFullScreen is true", () => {
      card.config = {
        ...card.config,
        card_type: "tiny",
        always_collapsed: "tiny",
      };
      assert.equal(card._collapsedMode, "tiny");
      assert.equal(card._isTinyMode, true);

      // Trigger full screen override
      card._fullScreenOverride = true;
      assert.equal(card._collapsedMode, "standard");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, false);

      card._fullScreenOverride = false;
      assert.equal(card._collapsedMode, "tiny");
      assert.equal(card._isTinyMode, true);
      assert.equal(card._alwaysCollapsed, true);
    });

    it("resolves Jinja2 template via _alwaysCollapsedResolveCache", () => {
      card.config = {
        ...card.config,
        always_collapsed: "{{ 'tiny' if is_state('sun.sun', 'above_horizon') else 'mini' }}",
      };

      // Before cache is populated, falls back to standard
      card._alwaysCollapsedResolveCache = {};
      assert.equal(card._collapsedMode, "standard");

      // Cache resolves to "tiny"
      card._alwaysCollapsedResolveCache = { card: { value: "tiny" } };
      assert.equal(card._collapsedMode, "tiny");
      assert.equal(card._isTinyMode, true);
      assert.equal(card._alwaysCollapsed, true);

      // Cache resolves to "mini"
      card._alwaysCollapsedResolveCache = { card: { value: "mini" } };
      assert.equal(card._collapsedMode, "mini");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, true);

      // Cache resolves to "standard"
      card._alwaysCollapsedResolveCache = { card: { value: "standard" } };
      assert.equal(card._collapsedMode, "standard");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, false);

      // Cache resolves to boolean true
      card._alwaysCollapsedResolveCache = { card: { value: true } };
      assert.equal(card._collapsedMode, "mini");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, true);

      // Cache resolves to boolean false
      card._alwaysCollapsedResolveCache = { card: { value: false } };
      assert.equal(card._collapsedMode, "standard");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, false);
    });

    it("resolves client-side JS template [[[ ... ]]] dynamically", () => {
      card.config = {
        ...card.config,
        always_collapsed:
          "[[[ return states['media_player.kitchen'].state === 'playing' ? 'tiny' : 'mini'; ]]]",
      };
      card._alwaysCollapsedResolveCache = undefined;

      // Currently kitchen is idle -> returns "mini"
      assert.equal(card._collapsedMode, "mini");
      assert.equal(card._isTinyMode, false);
      assert.equal(card._alwaysCollapsed, true);

      // Update kitchen to playing -> returns "tiny"
      card.hass.states["media_player.kitchen"] = {
        entity_id: "media_player.kitchen",
        state: "playing",
        attributes: {},
      };
      assert.equal(card._collapsedMode, "tiny");
      assert.equal(card._isTinyMode, true);
      assert.equal(card._alwaysCollapsed, true);

      // Returns boolean true -> "mini"
      card.config = {
        ...card.config,
        always_collapsed: "[[[ return true; ]]]",
      };
      assert.equal(card._collapsedMode, "mini");

      // Returns boolean false -> "standard"
      card.config = {
        ...card.config,
        always_collapsed: "[[[ return false; ]]]",
      };
      assert.equal(card._collapsedMode, "standard");
    });
  });

  describe("getGridOptions()", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card.hass = {
        states: {
          "media_player.kitchen": {
            entity_id: "media_player.kitchen",
            state: "idle",
            attributes: {},
          },
        },
      };
    });

    it("returns { min_rows: 1, columns: 12 } when _isTinyMode is true", () => {
      card.config = {
        entities: ["media_player.kitchen"],
        card_type: "tiny",
      };
      assert.equal(card._isTinyMode, true);
      assert.deepEqual(card.getGridOptions(), {
        min_rows: 1,
        columns: 12,
      });

      card.config = {
        entities: ["media_player.kitchen"],
        always_collapsed: "tiny",
      };
      assert.equal(card._isTinyMode, true);
      assert.deepEqual(card.getGridOptions(), {
        min_rows: 1,
        columns: 12,
      });
    });

    it("returns standard/mini grid options when _isTinyMode is false", () => {
      card.config = {
        entities: ["media_player.kitchen"],
        always_collapsed: "mini",
      };
      assert.equal(card._isTinyMode, false);
      const opts = card.getGridOptions();
      assert.notDeepEqual(opts, { min_rows: 1, columns: 12 });
    });
  });

  describe("setConfig overlay & menu flag clearing in tiny mode", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
    });

    it("clears menu and overlay flags when card_type is tiny", () => {
      card._showEntityOptions = true;
      card._showGrouping = true;
      card._showRemoteControl = true;
      card._showSearchInSheet = true;
      card._lyricsActive = true;
      card._tinyChipOverlayOpen = true;

      card.setConfig({
        card_type: "tiny",
        entities: ["media_player.kitchen"],
      });

      assert.equal(card._showEntityOptions, false);
      assert.equal(card._showGrouping, false);
      assert.equal(card._showRemoteControl, false);
      assert.equal(card._showSearchInSheet, false);
      assert.equal(card._lyricsActive, false);
      assert.equal(card._tinyChipOverlayOpen, false);
    });
  });

  describe("_openEntityOptions() in _isTinyMode", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card.hass = {
        states: {
          "media_player.kitchen": {
            entity_id: "media_player.kitchen",
            state: "idle",
            attributes: {},
          },
          "media_player.patio": { entity_id: "media_player.patio", state: "idle", attributes: {} },
        },
        callService: mock.fn(),
      };
    });

    it("does not open options menu or chip overlay with a single configured entity", async () => {
      card.setConfig({
        card_type: "tiny",
        entities: ["media_player.kitchen"],
      });

      assert.equal(card.entityObjs.length, 1);
      assert.equal(card._isTinyMode, true);

      await card._openEntityOptions();

      assert.equal(card._showEntityOptions, false);
      assert.equal(card._tinyChipOverlayOpen, false);
      assert.equal(card.isAnyMenuOpen, false);
    });

    it("toggles _tinyChipOverlayOpen and updates isAnyMenuOpen with multiple entities", async () => {
      card.setConfig({
        card_type: "tiny",
        entities: ["media_player.kitchen", "media_player.patio"],
      });

      assert.equal(card.entityObjs.length, 2);
      assert.equal(card._isTinyMode, true);
      assert.equal(card._tinyChipOverlayOpen, false);
      assert.equal(card.isAnyMenuOpen, false);

      // First open -> toggles chip overlay ON
      await card._openEntityOptions();
      assert.equal(card._tinyChipOverlayOpen, true);
      assert.equal(card._showEntityOptions, false);
      assert.equal(card.isAnyMenuOpen, true);

      // Second open -> toggles chip overlay OFF
      await card._openEntityOptions();
      assert.equal(card._tinyChipOverlayOpen, false);
      assert.equal(card._showEntityOptions, false);
      assert.equal(card.isAnyMenuOpen, false);
    });
  });

  describe("_onChipClick and auto-dismissal of tiny chip overlay", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
      card.hass = {
        states: {
          "media_player.kitchen": {
            entity_id: "media_player.kitchen",
            state: "idle",
            attributes: {},
          },
          "media_player.patio": { entity_id: "media_player.patio", state: "idle", attributes: {} },
        },
        callService: mock.fn(),
      };
      card.setConfig({
        card_type: "tiny",
        entities: ["media_player.kitchen", "media_player.patio"],
      });
      card._selectedIndex = 0;
    });

    it("switches entity and auto-dismisses tiny chip overlay when a chip is clicked", async () => {
      await card._openEntityOptions();
      assert.equal(card._tinyChipOverlayOpen, true);
      assert.equal(card._selectedIndex, 0);

      card._onChipClick(1);

      assert.equal(card._selectedIndex, 1);
      assert.equal(card._tinyChipOverlayOpen, false);
      assert.equal(card.isAnyMenuOpen, false);
    });

    it("ignores and clears stale sheet/menu flags when runtime template resolves to tiny", () => {
      const card2 = /** @type {any} */ (new YetAnotherMediaPlayerCard());
      const oldHass = {
        themes: {},
        darkMode: true,
        language: "en",
        selectedLanguage: "en",
        locale: {},
        states: {
          "media_player.kitchen": {
            entity_id: "media_player.kitchen",
            state: "idle",
            attributes: {},
          },
          "sensor.unrelated": { entity_id: "sensor.unrelated", state: "1", attributes: {} },
        },
        callService: mock.fn(),
      };
      card2.hass = oldHass;
      card2.setConfig({
        always_collapsed: "{{ states('input_select.mode') }}",
        entities: ["media_player.kitchen"],
      });
      // Template currently resolves to standard -> menu open
      card2._alwaysCollapsedResolveCache = { card: { value: "standard" } };
      card2._showEntityOptions = true;
      card2._showSearchInSheet = true;
      card2._lyricsActive = true;
      assert.equal(card2._isTinyMode, false);
      assert.equal(card2.isAnyMenuOpen, true);

      // Runtime template switches to tiny
      card2._alwaysCollapsedResolveCache = { card: { value: "tiny" } };
      assert.equal(card2._isTinyMode, true);
      assert.equal(card2.isAnyMenuOpen, false);

      // shouldUpdate ignores unrelated hass state changes when tiny overlay is closed
      card2.hass = {
        ...oldHass,
        states: {
          ...oldHass.states,
          "sensor.unrelated": { entity_id: "sensor.unrelated", state: "2", attributes: {} },
        },
      };
      assert.equal(card2.shouldUpdate(new Map([["hass", oldHass]])), false);

      // _clearMenuFlagsForTinyMode clears stale menu flags in state
      card2._clearMenuFlagsForTinyMode();
      assert.equal(card2._showEntityOptions, false);
      assert.equal(card2._showSearchInSheet, false);
      assert.equal(card2._lyricsActive, false);
    });
  });

  describe("IdleController integration with Tiny mode", () => {
    /**
     * @param {Record<string, any>} [overrides]
     * @returns {any}
     */
    function createMockHost(overrides = {}) {
      return {
        controllers: [],
        addController(c) {
          this.controllers.push(c);
        },
        requestUpdate: mock.fn(),
        config: {
          idle_timeout_ms: 60000,
          idle_screen: "search",
        },
        hass: {
          states: {
            "media_player.kitchen": {
              entity_id: "media_player.kitchen",
              state: "idle",
              attributes: {},
            },
          },
        },
        entityIds: ["media_player.kitchen"],
        _selectedIndex: 0,
        _cardType: "standard",
        _idleScreen: "search",
        _isTinyMode: false,
        _showSearchSheetInOptions: mock.fn(),
        _showEntityOptions: false,
        _showGrouping: false,
        _isEntityPlaying: mock.fn(() => false),
        _isCurrentEntityPlaying: mock.fn(() => false),
        _getEntityForPurpose: mock.fn((idx) => "media_player.kitchen"),
        ...overrides,
      };
    }

    it("does nothing in applyIdleScreen when host._isTinyMode is true", () => {
      const host = createMockHost({
        _isTinyMode: true,
      });
      const controller = new IdleController(host);

      assert.equal(controller.idleScreenApplied, false);
      controller.applyIdleScreen();

      assert.equal(controller.idleScreenApplied, false);
      assert.equal(host._showSearchSheetInOptions.mock.calls.length, 0);
    });

    it("does nothing in applyIdleScreen when host._cardType is 'tiny'", () => {
      const host = createMockHost({
        _cardType: "tiny",
      });
      const controller = new IdleController(host);

      assert.equal(controller.idleScreenApplied, false);
      controller.applyIdleScreen();

      assert.equal(controller.idleScreenApplied, false);
      assert.equal(host._showSearchSheetInOptions.mock.calls.length, 0);
    });

    it("applies idle screen normally when not in tiny mode", () => {
      const host = createMockHost({
        _isTinyMode: false,
        _cardType: "standard",
      });
      const controller = new IdleController(host);

      assert.equal(controller.idleScreenApplied, false);
      controller.applyIdleScreen();

      assert.equal(controller.idleScreenApplied, true);
      assert.equal(host._showSearchSheetInOptions.mock.calls.length, 1);
    });
  });
});
