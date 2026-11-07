import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import {
  IdleController,
  parseIdleTimeoutMs,
  getSearchDismissBehavior,
} from "../src/controllers/idle-controller.js";

/**
 * Creates a flexible mock host object fulfilling YetAnotherMediaPlayerCard expectations.
 * @param {Record<string, any>} [overrides]
 * @returns {any}
 */
function createMockHost(overrides = {}) {
  const host = {
    controllers: /** @type {any[]} */ ([]),
    addController(c) {
      this.controllers.push(c);
    },
    requestUpdate: mock.fn(),
    config: {
      idle_timeout_ms: 60000,
      dismiss_search_on_play: true,
    },
    hass: {
      states: {
        "media_player.kitchen": {
          entity_id: "media_player.kitchen",
          state: "idle",
          attributes: { friendly_name: "Kitchen" },
        },
        "media_player.living_room": {
          entity_id: "media_player.living_room",
          state: "idle",
          attributes: { friendly_name: "Living Room" },
        },
      },
    },
    entityIds: ["media_player.kitchen", "media_player.living_room"],
    _selectedIndex: 0,
    _pinnedIndex: null,
    _manualSelect: false,
    _manualSelectPlayingSet: null,
    _cardType: "standard",
    _idleScreen: "default",
    _showEntityOptions: false,
    _showGrouping: false,
    _showSourceList: false,
    _showTransferQueue: false,
    _showResolvedEntities: false,
    _showRemoteControl: false,
    _cardHeightTemplate: null,
    _cardHeightTemplateNeedsResolve: false,
    _playbackLingerByIdx: {},
    _autoEntities: [],
    isAnyMenuOpen: false,
    sortedEntityIds: ["media_player.kitchen", "media_player.living_room"],
    groupedSortedEntityIds: [["media_player.kitchen"], ["media_player.living_room"]],
    _showSearchSheetInOptions: mock.fn(),
    _hideSearchSheetInOptions: mock.fn(),
    _doSearch: mock.fn(async () => {}),
    _setTransientEntities: mock.fn(),
    _isEntityPlaying: mock.fn((state) => state?.state === "playing"),
    _isCurrentEntityPlaying: mock.fn(() => false),
    _isAutoSelectDisabled: mock.fn(() => false),
    _getEntityForPurpose: mock.fn((idx) => host.entityIds[idx]),
    _getActualGroupMaster: mock.fn((group) => group[0]),
    ...overrides,
  };
  return host;
}

describe("IdleController & Pure Idle Helpers", () => {
  describe("parseIdleTimeoutMs", () => {
    it("returns default value (60000) for undefined, null, or empty string", () => {
      assert.strictEqual(parseIdleTimeoutMs(undefined), 60000);
      assert.strictEqual(parseIdleTimeoutMs(null), 60000);
      assert.strictEqual(parseIdleTimeoutMs(""), 60000);
    });

    it("returns custom default value when provided for undefined, null, or empty string", () => {
      assert.strictEqual(parseIdleTimeoutMs(undefined, 30000), 30000);
      assert.strictEqual(parseIdleTimeoutMs(null, 15000), 15000);
      assert.strictEqual(parseIdleTimeoutMs("", 45000), 45000);
    });

    it("returns 0 when explicitly passed 0 or '0'", () => {
      assert.strictEqual(parseIdleTimeoutMs(0), 0);
      assert.strictEqual(parseIdleTimeoutMs("0"), 0);
    });

    it("returns parsed positive numbers and numeric strings", () => {
      assert.strictEqual(parseIdleTimeoutMs(10000), 10000);
      assert.strictEqual(parseIdleTimeoutMs("25000"), 25000);
      assert.strictEqual(parseIdleTimeoutMs(1.5), 1.5);
    });

    it("clamps negative numbers to 0 via Math.max(0, parsed)", () => {
      assert.strictEqual(parseIdleTimeoutMs(-500), 0);
      assert.strictEqual(parseIdleTimeoutMs("-12000"), 0);
    });

    it("returns defaultValue for NaN and non-numeric strings", () => {
      assert.strictEqual(parseIdleTimeoutMs("invalid"), 60000);
      assert.strictEqual(parseIdleTimeoutMs("abc", 20000), 20000);
      assert.strictEqual(parseIdleTimeoutMs(NaN), 60000);
      assert.strictEqual(parseIdleTimeoutMs({}, 10000), 10000);
    });
  });

  describe("getSearchDismissBehavior", () => {
    it("returns dismiss: true, reset: false for standard card when dismiss_search_on_play is true or omitted", () => {
      const omitted = getSearchDismissBehavior({}, "standard");
      assert.deepStrictEqual(omitted, { shouldDismiss: true, shouldReset: false });

      const explicitTrue = getSearchDismissBehavior({ dismiss_search_on_play: true }, "standard");
      assert.deepStrictEqual(explicitTrue, { shouldDismiss: true, shouldReset: false });

      const undefinedCardType = getSearchDismissBehavior({ dismiss_search_on_play: true });
      assert.deepStrictEqual(undefinedCardType, { shouldDismiss: true, shouldReset: false });
    });

    it("returns dismiss: false, reset: false when dismiss_search_on_play is false on standard card", () => {
      const result = getSearchDismissBehavior({ dismiss_search_on_play: false }, "standard");
      assert.deepStrictEqual(result, { shouldDismiss: false, shouldReset: false });
    });

    it("returns dismiss: false, reset: true for search card mode when dismiss_search_on_play is true or omitted", () => {
      const omitted = getSearchDismissBehavior({}, "search");
      assert.deepStrictEqual(omitted, { shouldDismiss: false, shouldReset: true });

      const explicitTrue = getSearchDismissBehavior({ dismiss_search_on_play: true }, "search");
      assert.deepStrictEqual(explicitTrue, { shouldDismiss: false, shouldReset: true });
    });

    it("returns dismiss: false, reset: false for search card mode when dismiss_search_on_play is false", () => {
      const result = getSearchDismissBehavior({ dismiss_search_on_play: false }, "search");
      assert.deepStrictEqual(result, { shouldDismiss: false, shouldReset: false });
    });

    it("handles null or undefined config safely", () => {
      assert.deepStrictEqual(getSearchDismissBehavior(null, "standard"), {
        shouldDismiss: true,
        shouldReset: false,
      });
      assert.deepStrictEqual(getSearchDismissBehavior(undefined, "search"), {
        shouldDismiss: false,
        shouldReset: true,
      });
    });
  });

  describe("IdleController Lifecycle & Construction", () => {
    it("registers controller with host via addController during construction", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));

      assert.strictEqual(controller.host, mockHost);
      assert.strictEqual(mockHost.controllers.includes(controller), true);
    });

    it("adopts pre-assigned own properties from host when available", () => {
      const existingTimeout = setTimeout(() => {}, 10000);
      try {
        const mockHost = createMockHost({
          _isIdle: true,
          _idleTimeout: existingTimeout,
          _idleTimeoutMs: 12000,
          _idleScreenApplied: true,
          _hasSeenPlayback: true,
        });

        const controller = new IdleController(/** @type {any} */ (mockHost));
        assert.strictEqual(controller.isIdle, true);
        assert.strictEqual(controller.idleTimeout, existingTimeout);
        assert.strictEqual(controller.idleTimeoutMs, 12000);
        assert.strictEqual(controller.idleScreenApplied, true);
        assert.strictEqual(controller.hasSeenPlayback, true);
      } finally {
        clearTimeout(existingTimeout);
      }
    });

    it("falls back to safe default values when host lacks own properties", () => {
      const emptyHost = {
        addController() {},
      };
      const controller = new IdleController(/** @type {any} */ (emptyHost));

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.idleTimeoutMs, 60000);
      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(controller.hasSeenPlayback, false);
      assert.strictEqual(controller.initialCheckTimer, null);
    });

    it("handles null or undefined host gracefully without throwing", () => {
      assert.doesNotThrow(() => {
        const controllerNull = new IdleController(null);
        assert.strictEqual(controllerNull.host, null);
        assert.strictEqual(controllerNull.isIdle, false);
      });

      assert.doesNotThrow(() => {
        const controllerUndef = new IdleController(undefined);
        assert.strictEqual(controllerUndef.host, undefined);
        assert.strictEqual(controllerUndef.isIdle, false);
      });
    });

    it("executes hostConnected without throwing", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      assert.doesNotThrow(() => controller.hostConnected());
    });

    it("clears idle timeout and initial check timer on hostDisconnected", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.idleTimeout = setTimeout(() => {}, 60000);
      controller.initialCheckTimer = setTimeout(() => {}, 10000);

      controller.hostDisconnected();

      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.initialCheckTimer, null);
    });

    it("clears idle timeout via clearIdleTimeout safely", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.idleTimeout = setTimeout(() => {}, 60000);
      controller.clearIdleTimeout();
      assert.strictEqual(controller.idleTimeout, null);

      // Safe to call again when already null
      assert.doesNotThrow(() => controller.clearIdleTimeout());
      assert.strictEqual(controller.idleTimeout, null);
    });
  });

  describe("setConfig", () => {
    it("updates idleTimeoutMs from configuration", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.setConfig({ idle_timeout_ms: 30000 });
      assert.strictEqual(controller.idleTimeoutMs, 30000);

      controller.setConfig({});
      assert.strictEqual(controller.idleTimeoutMs, 60000);
    });

    it("wakes card, clears timeout, and requests update when idleTimeoutMs is set to 0 and card is idle", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = true;
      controller.idleScreenApplied = true;
      controller.idleTimeout = setTimeout(() => {}, 10000);

      controller.setConfig({ idle_timeout_ms: 0 });

      assert.strictEqual(controller.idleTimeoutMs, 0);
      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length >= 1, true);
    });

    it("clears pending timeout when idleTimeoutMs is set to 0 but does not wake if already not idle", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = false;
      controller.idleTimeout = setTimeout(() => {}, 10000);

      controller.setConfig({ idle_timeout_ms: 0 });

      assert.strictEqual(controller.idleTimeoutMs, 0);
      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 0);
    });

    it("retains idle state if positive timeout is set while card is idle", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = true;

      controller.setConfig({ idle_timeout_ms: 45000 });
      assert.strictEqual(controller.idleTimeoutMs, 45000);
      assert.strictEqual(controller.isIdle, true);
    });
  });

  describe("setIdleState", () => {
    it("forces target to false if idleTimeoutMs is 0 even when passed true", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleTimeoutMs = 0;
      controller.isIdle = false;

      controller.setIdleState(true);
      assert.strictEqual(controller.isIdle, false);
    });

    it("sets isIdle to true when idleTimeoutMs > 0", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleTimeoutMs = 60000;
      controller.isIdle = false;

      controller.setIdleState(true);
      assert.strictEqual(controller.isIdle, true);
    });

    it("returns early and does not mutate host when new state matches current state", () => {
      const mockHost = createMockHost({
        _cardHeightTemplate: "[[[ return '100px'; ]]]",
        _cardHeightTemplateNeedsResolve: false,
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = false;

      controller.setIdleState(false);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost._cardHeightTemplateNeedsResolve, false);
    });

    it("flags cardHeightTemplateNeedsResolve when cardHeightTemplate is defined and idle state changes", () => {
      const mockHost = createMockHost({
        _cardHeightTemplate: "[[[ return is_idle ? '50px' : '200px'; ]]]",
        _cardHeightTemplateNeedsResolve: false,
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = false;

      controller.setIdleState(true);
      assert.strictEqual(controller.isIdle, true);
      assert.strictEqual(mockHost._cardHeightTemplateNeedsResolve, true);

      // Transition back to active
      mockHost._cardHeightTemplateNeedsResolve = false;
      controller.setIdleState(false);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost._cardHeightTemplateNeedsResolve, true);
    });

    it("does not set cardHeightTemplateNeedsResolve if cardHeightTemplate is undefined", () => {
      const mockHost = createMockHost({
        _cardHeightTemplate: null,
        _cardHeightTemplateNeedsResolve: false,
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.setIdleState(true);

      assert.strictEqual(controller.isIdle, true);
      assert.strictEqual(mockHost._cardHeightTemplateNeedsResolve, false);
    });
  });

  describe("applyIdleScreen & resetIdleScreen", () => {
    it("skips applyIdleScreen when cardType is group_players", () => {
      const mockHost = createMockHost({
        _cardType: "group_players",
        _idleScreen: "search",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.applyIdleScreen();
      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 0);
    });

    it("skips applyIdleScreen if already applied", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleScreenApplied = true;

      controller.applyIdleScreen();
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 0);
    });

    it("opens search sheet in options with 'default' when idleScreen is 'search'", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
        _showGrouping: true,
        _showSourceList: true,
        _showTransferQueue: true,
        _showResolvedEntities: true,
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.applyIdleScreen();

      assert.strictEqual(controller.idleScreenApplied, true);
      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(mockHost._showGrouping, false);
      assert.strictEqual(mockHost._showSourceList, false);
      assert.strictEqual(mockHost._showTransferQueue, false);
      assert.strictEqual(mockHost._showResolvedEntities, false);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls[0].arguments[0], "default");
    });

    it("opens search sheet in options with 'recently-played' when idleScreen is 'search-recently-played'", () => {
      const mockHost = createMockHost({
        _idleScreen: "search-recently-played",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.applyIdleScreen();

      assert.strictEqual(controller.idleScreenApplied, true);
      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(
        mockHost._showSearchSheetInOptions.mock.calls[0].arguments[0],
        "recently-played"
      );
    });

    it("opens search sheet in options with 'next-up' when idleScreen is 'search-next-up'", () => {
      const mockHost = createMockHost({
        _idleScreen: "search-next-up",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.applyIdleScreen();

      assert.strictEqual(controller.idleScreenApplied, true);
      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls[0].arguments[0], "next-up");
    });

    it("does not apply idle screen for default or unknown modes", () => {
      const mockHost = createMockHost({
        _idleScreen: "default",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.applyIdleScreen();
      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 0);

      mockHost._idleScreen = "unknown-mode";
      controller.applyIdleScreen();
      assert.strictEqual(controller.idleScreenApplied, false);
    });

    it("handles null host safely in applyIdleScreen", () => {
      const controller = new IdleController(null);
      assert.doesNotThrow(() => controller.applyIdleScreen());
      assert.strictEqual(controller.idleScreenApplied, false);
    });

    it("resetIdleScreen returns early if not currently applied", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleScreenApplied = false;

      controller.resetIdleScreen();
      assert.strictEqual(mockHost._hideSearchSheetInOptions.mock.calls.length, 0);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 0);
    });

    it("resetIdleScreen hides search and options sheet when shouldDismiss is true", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
        _showEntityOptions: true,
        _cardType: "standard",
        config: { dismiss_search_on_play: true },
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleScreenApplied = true;

      controller.resetIdleScreen();

      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost._hideSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost._showEntityOptions, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("resetIdleScreen resets search sheet when shouldReset is true in search mode", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
        _showEntityOptions: true,
        _cardType: "search",
        config: { dismiss_search_on_play: true },
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleScreenApplied = true;

      controller.resetIdleScreen();

      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost._hideSearchSheetInOptions.mock.calls.length, 0);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("resetIdleScreen clears idleScreenApplied but preserves view when dismiss_search_on_play is false", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
        _showEntityOptions: true,
        _cardType: "standard",
        config: { dismiss_search_on_play: false },
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleScreenApplied = true;

      controller.resetIdleScreen();

      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost._hideSearchSheetInOptions.mock.calls.length, 0);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 0);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 0);
      assert.strictEqual(mockHost._showEntityOptions, true);
    });

    it("resetIdleScreen handles non-search idle screen modes", () => {
      const mockHost = createMockHost({
        _idleScreen: "default",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleScreenApplied = true;

      controller.resetIdleScreen();

      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("delegates to getSearchDismissBehavior helper", () => {
      const mockHost = createMockHost({
        _cardType: "search",
        config: { dismiss_search_on_play: true },
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      const behavior = controller.getSearchDismissBehavior();
      assert.deepStrictEqual(behavior, { shouldDismiss: false, shouldReset: true });
    });
  });

  describe("scheduleInitialIdleCheck", () => {
    it("handles dedicated search mode by auto-opening search sheet and remaining awake", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _cardType: "search",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      assert.notStrictEqual(controller.initialCheckTimer, null);

      clock.tick(1);

      assert.strictEqual(controller.initialCheckTimer, null);
      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("handles dedicated up_next mode by auto-opening search sheet filtered to next-up", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _cardType: "up_next",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls[0].arguments[0], "next-up");
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("handles dedicated remote_control mode by opening remote overlay", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _cardType: "remote_control",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(mockHost._showRemoteControl, true);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("handles dedicated group_players mode by opening grouping overlay", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _cardType: "group_players",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(mockHost._showGrouping, true);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("goes idle immediately on load when nothing is playing, no linger, and idleTimeoutMs > 0", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _selectedIndex: 0,
        _cardType: "standard",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleTimeoutMs = 60000;

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(controller.isIdle, true);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("does not go idle on initial load when idleTimeoutMs is 0", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleTimeoutMs = 0;

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 0);
    });

    it("does not go idle when there is an active playback linger", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _selectedIndex: 0,
        _playbackLingerByIdx: {
          0: { until: Date.now() + 60000 },
        },
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 0);
    });

    it("does not go idle when the current entity is playing", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _selectedIndex: 0,
        _isEntityPlaying: mock.fn((state) => state?.entity_id === "media_player.kitchen"),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 0);
    });

    it("does not go idle when an unrestricted entity is playing elsewhere", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _selectedIndex: 0,
        _isEntityPlaying: mock.fn((state) => state?.entity_id === "media_player.living_room"),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 0);
    });

    it("goes idle if current entity is playing but auto-select is disabled and not manualSelect", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _selectedIndex: 0,
        _manualSelect: false,
        _isAutoSelectDisabled: mock.fn((idx) => idx === 0),
        _isEntityPlaying: mock.fn((state) => state?.entity_id === "media_player.kitchen"),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(controller.isIdle, true);
    });

    it("does not go idle if current entity is playing with auto-select disabled when manualSelect is true", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost({
        _selectedIndex: 0,
        _manualSelect: true,
        _isAutoSelectDisabled: mock.fn((idx) => idx === 0),
        _isEntityPlaying: mock.fn((state) => state?.entity_id === "media_player.kitchen"),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      clock.tick(1);

      assert.strictEqual(controller.isIdle, false);
    });

    it("safely exits if host is null when timer runs", (t) => {
      const clock = t.mock.timers;
      clock.enable({ apis: ["setTimeout"] });

      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.scheduleInitialIdleCheck();
      controller.host = null;
      assert.doesNotThrow(() => clock.tick(1));
    });
  });

  describe("updateIdleState", () => {
    it("handles cardType group_players by clearing timeout and opening grouping view", () => {
      const mockHost = createMockHost({
        _cardType: "group_players",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleTimeout = setTimeout(() => {}, 10000);
      controller.isIdle = true;

      controller.updateIdleState();

      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(mockHost._showGrouping, true);
    });

    it("wakes up immediately from idle when an unrestricted player is playing", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
        _isEntityPlaying: mock.fn((state) => state?.entity_id === "media_player.living_room"),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = true;
      controller.idleScreenApplied = true;
      controller.idleTimeout = setTimeout(() => {}, 10000);

      controller.updateIdleState();

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.hasSeenPlayback, true);
      assert.strictEqual(controller.idleScreenApplied, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length >= 1, true);
    });

    it("stays awake immediately when current player is playing", () => {
      const mockHost = createMockHost({
        _isCurrentEntityPlaying: mock.fn(() => true),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = true;
      controller.isIdle = false;
      controller.idleTimeout = setTimeout(() => {}, 10000);

      controller.updateIdleState();

      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, false);
    });

    it("defers idle transition when user is browsing menus (isAnyMenuOpen is true)", () => {
      const mockHost = createMockHost({
        isAnyMenuOpen: true,
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = true;
      controller.isIdle = false;
      controller.idleTimeout = setTimeout(() => {}, 10000);

      controller.updateIdleState();

      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, false);
    });

    it("initial load with nothing playing goes idle immediately if idleTimeoutMs > 0", () => {
      const mockHost = createMockHost({
        _idleScreen: "search",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = false;
      controller.isIdle = false;
      controller.idleTimeoutMs = 60000;

      controller.updateIdleState();

      assert.strictEqual(controller.isIdle, true);
      assert.strictEqual(controller.idleScreenApplied, true);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("initial load with nothing playing wakes if idleTimeoutMs is 0 and currently idle", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = false;
      controller.isIdle = true;
      controller.idleTimeoutMs = 0;

      controller.updateIdleState();

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("bypasses grace period on tab change when switched away from playing disabled entity", () => {
      const mockHost = createMockHost({
        _selectedIndex: 1,
        _manualSelect: true,
        _pinnedIndex: null,
        _idleScreen: "search",
        _isAutoSelectDisabled: mock.fn(() => true),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = true;
      controller.isIdle = false;
      controller.idleTimeoutMs = 60000;

      const changedProps = new Map([["_selectedIndex", 0]]);
      controller.updateIdleState(changedProps);

      assert.strictEqual(controller.isIdle, true);
      assert.strictEqual(mockHost._manualSelect, false);
      assert.strictEqual(mockHost._manualSelectPlayingSet, null);
      assert.strictEqual(controller.idleScreenApplied, true);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("starts fresh idle timeout on tab change when another player is playing", () => {
      const mockHost = createMockHost({
        _selectedIndex: 1,
        _isEntityPlaying: mock.fn((state) => state?.entity_id === "media_player.kitchen"),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = true;
      controller.isIdle = false;
      controller.idleTimeoutMs = 30000;

      const changedProps = new Map([["_selectedIndex", 0]]);
      controller.updateIdleState(changedProps);

      assert.strictEqual(controller.isIdle, false);
      assert.notStrictEqual(controller.idleTimeout, null);
      controller.clearIdleTimeout();
    });

    it("starts grace period timer when current playback stops without tab change", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = true;
      controller.isIdle = false;
      controller.idleTimeoutMs = 60000;
      controller.idleTimeout = null;

      controller.updateIdleState(new Map());

      assert.strictEqual(controller.isIdle, false);
      assert.notStrictEqual(controller.idleTimeout, null);
      controller.clearIdleTimeout();
    });

    it("does not restart grace period timer if one is already pending", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = true;
      controller.isIdle = false;
      controller.idleTimeoutMs = 60000;

      const existingTimeout = setTimeout(() => {}, 50000);
      controller.idleTimeout = existingTimeout;

      controller.updateIdleState(new Map());

      assert.strictEqual(controller.idleTimeout, existingTimeout);
      clearTimeout(existingTimeout);
    });

    it("resets idle state if idleTimeoutMs is 0 and card is currently marked idle", () => {
      const mockHost = createMockHost();
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.hasSeenPlayback = true;
      controller.isIdle = true;
      controller.idleTimeoutMs = 0;

      controller.updateIdleState(new Map());

      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });
  });

  describe("handleIdleTimeoutCallback", () => {
    it("handles cardType group_players on timeout callback", () => {
      const mockHost = createMockHost({
        _cardType: "group_players",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleTimeout = setTimeout(() => {}, 10000);
      controller.isIdle = true;

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost._showEntityOptions, true);
      assert.strictEqual(mockHost._showGrouping, true);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("resets drill-down search hierarchy in search cardType instead of going idle", () => {
      const mockHost = createMockHost({
        _cardType: "search",
        _searchHierarchy: [{ level: "artist" }, { level: "album" }],
        _searchBreadcrumb: "Artist > Album",
        _searchResultsByType: { tracks: [1, 2] },
        config: { default_search_filter: "artists" },
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.idleTimeout = setTimeout(() => {}, 10000);

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(controller.idleTimeout, null);
      assert.deepStrictEqual(mockHost._searchHierarchy, []);
      assert.strictEqual(mockHost._searchBreadcrumb, "");
      assert.deepStrictEqual(mockHost._searchResultsByType, {});
      assert.strictEqual(mockHost._doSearch.mock.calls.length, 1);
      assert.strictEqual(mockHost._doSearch.mock.calls[0].arguments[0], "artists");
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
      assert.strictEqual(controller.isIdle, false);
    });

    it("resets search hierarchy in up_next mode with default 'all' passing null filter", () => {
      const mockHost = createMockHost({
        _cardType: "up_next",
        _searchHierarchy: [{ level: "playlist" }],
        config: { default_search_filter: "all" },
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(mockHost._doSearch.mock.calls.length, 1);
      assert.strictEqual(mockHost._doSearch.mock.calls[0].arguments[0], null);
    });

    it("clears manualSelect when not pinned (_pinnedIndex === null)", () => {
      const mockHost = createMockHost({
        _pinnedIndex: null,
        _manualSelect: true,
        _manualSelectPlayingSet: new Set(["media_player.kitchen"]),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(mockHost._manualSelect, false);
      assert.strictEqual(mockHost._manualSelectPlayingSet, null);
    });

    it("retains manualSelect when pinned (_pinnedIndex !== null)", () => {
      const mockHost = createMockHost({
        _pinnedIndex: 0,
        _manualSelect: true,
        _manualSelectPlayingSet: new Set(["media_player.kitchen"]),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(mockHost._manualSelect, true);
      assert.notStrictEqual(mockHost._manualSelectPlayingSet, null);
    });

    it("switches to playing entity and does not go idle when another entity is playing", () => {
      const mockHost = createMockHost({
        _selectedIndex: 0,
        sortedEntityIds: ["media_player.living_room", "media_player.kitchen"],
        groupedSortedEntityIds: [["media_player.living_room"], ["media_player.kitchen"]],
        _isEntityPlaying: mock.fn((state) => state?.entity_id === "media_player.living_room"),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = false;

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, false);
      assert.strictEqual(mockHost._selectedIndex, 1);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });

    it("switches to actual group master when candidate group has multiple entities", () => {
      const mockHost = createMockHost({
        _selectedIndex: 0,
        sortedEntityIds: ["media_player.follower", "media_player.master"],
        groupedSortedEntityIds: [["media_player.follower", "media_player.master"]],
        entityIds: ["media_player.unrelated", "media_player.follower", "media_player.master"],
        hass: {
          states: {
            "media_player.unrelated": { entity_id: "media_player.unrelated", state: "idle" },
            "media_player.follower": { entity_id: "media_player.follower", state: "playing" },
            "media_player.master": { entity_id: "media_player.master", state: "playing" },
          },
        },
        _getActualGroupMaster: mock.fn(() => "media_player.master"),
        _isEntityPlaying: mock.fn(() => true),
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(mockHost._selectedIndex, 2);
      assert.strictEqual(mockHost._getActualGroupMaster.mock.calls.length, 1);
      assert.strictEqual(controller.isIdle, false);
    });

    it("clears auto entities, sets idle state to true, and applies idle screen when nothing is playing", () => {
      const mockHost = createMockHost({
        _autoEntities: [{ entity_id: "media_player.guest" }],
        _idleScreen: "search",
      });
      const controller = new IdleController(/** @type {any} */ (mockHost));
      controller.isIdle = false;
      controller.idleTimeout = setTimeout(() => {}, 10000);

      controller.handleIdleTimeoutCallback();

      assert.strictEqual(controller.idleTimeout, null);
      assert.strictEqual(controller.isIdle, true);
      assert.strictEqual(mockHost._setTransientEntities.mock.calls.length, 1);
      assert.deepStrictEqual(mockHost._setTransientEntities.mock.calls[0].arguments[0], {
        auto: [],
      });
      assert.strictEqual(controller.idleScreenApplied, true);
      assert.strictEqual(mockHost._showSearchSheetInOptions.mock.calls.length, 1);
      assert.strictEqual(mockHost.requestUpdate.mock.calls.length, 1);
    });
  });
});
