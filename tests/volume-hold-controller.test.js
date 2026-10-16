import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import {
  VolumeHoldController,
  computeHoldVolume,
  getVolumeIconForPercent,
  HOLD_DELAY_MS,
  RELEASE_LINGER_MS,
} from "../src/controllers/volume-hold-controller.js";
import { SUPPORT_VOLUME_MUTE, SUPPORT_VOLUME_SET } from "../src/constants.js";

describe("VolumeHoldController & Helpers", () => {
  describe("computeHoldVolume", () => {
    it("increases volume when dragging up (smaller Y)", () => {
      const vol = computeHoldVolume(0.5, 200, 100, 200);
      assert.strictEqual(vol, 1);
    });

    it("decreases volume when dragging down (larger Y)", () => {
      const vol = computeHoldVolume(0.5, 200, 300, 200);
      assert.strictEqual(vol, 0);
    });

    it("clamps values between 0 and 1", () => {
      assert.strictEqual(computeHoldVolume(0.9, 200, 50, 200), 1);
      assert.strictEqual(computeHoldVolume(0.1, 200, 400, 200), 0);
    });

    it("rounds to nearest 0.01", () => {
      const vol = computeHoldVolume(0.5, 200, 195, 200);
      assert.strictEqual(vol, 0.53);
    });

    it("falls back to MIN_RANGE_PX when range is <= 0", () => {
      const vol = computeHoldVolume(0.5, 200, 150, 0);
      // (200 - 150) / 150 = 50 / 150 = 0.333... -> 0.5 + 0.33 = 0.83
      assert.strictEqual(vol, 0.83);
    });
  });

  describe("getVolumeIconForPercent", () => {
    it("returns volume-off when muted or percent is 0", () => {
      assert.strictEqual(getVolumeIconForPercent(50, true), "mdi:volume-off");
      assert.strictEqual(getVolumeIconForPercent(0, false), "mdi:volume-off");
    });

    it("returns correct icons for percentage thresholds", () => {
      assert.strictEqual(getVolumeIconForPercent(10, false), "mdi:volume-low");
      assert.strictEqual(getVolumeIconForPercent(19, false), "mdi:volume-low");
      assert.strictEqual(getVolumeIconForPercent(20, false), "mdi:volume-medium");
      assert.strictEqual(getVolumeIconForPercent(49, false), "mdi:volume-medium");
      assert.strictEqual(getVolumeIconForPercent(50, false), "mdi:volume-high");
      assert.strictEqual(getVolumeIconForPercent(100, false), "mdi:volume-high");
    });
  });

  describe("VolumeHoldController", () => {
    let host;
    let targetEl;
    let ctrl;

    beforeEach(() => {
      targetEl = {
        _captured: null,
        setPointerCapture(id) {
          this._captured = id;
        },
        hasPointerCapture(id) {
          return this._captured === id;
        },
        releasePointerCapture(id) {
          if (this._captured === id) this._captured = null;
        },
      };

      host = {
        addController: mock.fn(),
        requestUpdate: mock.fn(),
        _canUseVolumeHold: mock.fn(() => true),
        _applyVolumeLevel: mock.fn(),
        _suppressVolumeOverlay: mock.fn(),
        _dismissVolumeOverlay: mock.fn(),
        _onMuteToggle: mock.fn(),
        _supportsFeature: mock.fn(
          (state, feat) => feat === SUPPORT_VOLUME_MUTE || feat === SUPPORT_VOLUME_SET
        ),
        currentVolumeStateObj: {
          attributes: {
            volume_level: 0.4,
            is_volume_muted: false,
          },
        },
        renderRoot: {
          querySelector: mock.fn(() => ({
            getBoundingClientRect: () => ({ height: 200 }),
          })),
        },
        _volumeOverlayActive: false,
        _volumeDraggingEntity: null,
        _groupBaseVolume: null,
      };

      ctrl = new VolumeHoldController(host);
    });

    it("registers itself with the host controller", () => {
      assert.strictEqual(host.addController.mock.calls.length, 1);
    });

    it("does not activate before 400ms delay", () => {
      mock.timers.enable();
      try {
        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 100,
          currentTarget: targetEl,
        });

        assert.strictEqual(ctrl.active, false);
        mock.timers.tick(HOLD_DELAY_MS - 1);
        assert.strictEqual(ctrl.active, false);

        mock.timers.tick(1);
        assert.strictEqual(ctrl.active, true);
        assert.strictEqual(ctrl.value, 0.4);
        assert.strictEqual(host._volumeDraggingEntity, "hold");
        assert.strictEqual(targetEl._captured, 1);
      } finally {
        mock.timers.reset();
      }
    });

    it("cancels hold activation if finger moves beyond 10px before delay", () => {
      mock.timers.enable();
      try {
        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 100,
          currentTarget: targetEl,
        });

        // Move 15px down
        ctrl.onPointerMove({
          pointerId: 1,
          clientX: 50,
          clientY: 115,
        });

        mock.timers.tick(HOLD_DELAY_MS);
        assert.strictEqual(ctrl.active, false);
        assert.strictEqual(host._volumeDraggingEntity, null);
      } finally {
        mock.timers.reset();
      }
    });

    it("tracks drag movement when active, throttles commits, and applies volume", () => {
      mock.timers.enable();
      try {
        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 200,
          currentTarget: targetEl,
        });

        mock.timers.tick(HOLD_DELAY_MS);
        assert.strictEqual(ctrl.active, true);

        // Move up by 100px: range is 200px, so +0.50 -> 0.4 + 0.5 = 0.90
        ctrl.onPointerMove({
          pointerId: 1,
          clientX: 50,
          clientY: 100,
          cancelable: true,
          preventDefault: mock.fn(),
        });

        assert.strictEqual(ctrl.value, 0.9);
        // Leading commit fires immediately
        assert.strictEqual(host._applyVolumeLevel.mock.calls.length, 1);
        assert.strictEqual(host._applyVolumeLevel.mock.calls[0].arguments[0], 0.9);

        // Move again within 150ms window -> 0.95
        ctrl.onPointerMove({
          pointerId: 1,
          clientX: 50,
          clientY: 90,
          cancelable: true,
          preventDefault: mock.fn(),
        });

        assert.strictEqual(ctrl.value, 0.95);
        // Second call should not have fired yet
        assert.strictEqual(host._applyVolumeLevel.mock.calls.length, 1);

        // Advance 150ms -> trailing commit fires
        mock.timers.tick(150);
        assert.strictEqual(host._applyVolumeLevel.mock.calls.length, 2);
        assert.strictEqual(host._applyVolumeLevel.mock.calls[1].arguments[0], 0.95);
      } finally {
        mock.timers.reset();
      }
    });

    it("releases and flushes final value on pointerup", () => {
      mock.timers.enable();
      try {
        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 200,
          currentTarget: targetEl,
        });

        mock.timers.tick(HOLD_DELAY_MS);
        assert.strictEqual(ctrl.active, true);

        // Move up 60px -> 0.4 + 60/200 = 0.70
        ctrl.onPointerMove({
          pointerId: 1,
          clientX: 50,
          clientY: 140,
          cancelable: true,
          preventDefault: mock.fn(),
        });

        // Release pointer
        ctrl.onPointerUp({
          pointerId: 1,
        });

        assert.strictEqual(ctrl.active, false);
        assert.strictEqual(ctrl.releasing, true);
        assert.strictEqual(targetEl._captured, null);
        assert.strictEqual(host._suppressVolumeOverlay.mock.calls.length, 1);

        // Linger duration finishes
        mock.timers.tick(RELEASE_LINGER_MS);
        assert.strictEqual(ctrl.releasing, false);
      } finally {
        mock.timers.reset();
      }
    });

    it("suppresses synthetic click after hold activation, but permits normal clicks", () => {
      mock.timers.enable();
      try {
        // Plain tap (no hold)
        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 100,
          currentTarget: targetEl,
        });
        ctrl.onPointerUp({ pointerId: 1 });

        const normalEvent = {
          stopPropagation: mock.fn(),
          preventDefault: mock.fn(),
        };
        ctrl.clickCapture.handleEvent(normalEvent);
        assert.strictEqual(normalEvent.stopPropagation.mock.calls.length, 0);

        // Press and hold
        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 2,
          clientX: 50,
          clientY: 100,
          currentTarget: targetEl,
        });
        mock.timers.tick(HOLD_DELAY_MS);
        ctrl.onPointerUp({ pointerId: 2 });

        const heldEvent = {
          stopPropagation: mock.fn(),
          preventDefault: mock.fn(),
        };
        ctrl.clickCapture.handleEvent(heldEvent);
        assert.strictEqual(heldEvent.stopPropagation.mock.calls.length, 1);
        assert.strictEqual(heldEvent.preventDefault.mock.calls.length, 1);
      } finally {
        mock.timers.reset();
      }
    });

    it("unmutes on drag if the entity was muted", () => {
      mock.timers.enable();
      try {
        host.currentVolumeStateObj.attributes.is_volume_muted = true;

        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 200,
          currentTarget: targetEl,
        });
        mock.timers.tick(HOLD_DELAY_MS);

        ctrl.onPointerMove({
          pointerId: 1,
          clientX: 50,
          clientY: 180,
          cancelable: true,
          preventDefault: mock.fn(),
        });

        assert.strictEqual(host._onMuteToggle.mock.calls.length, 1);

        // Subsequent drag does not trigger duplicate mute toggle
        ctrl.onPointerMove({
          pointerId: 1,
          clientX: 50,
          clientY: 150,
          cancelable: true,
          preventDefault: mock.fn(),
        });
        assert.strictEqual(host._onMuteToggle.mock.calls.length, 1);
      } finally {
        mock.timers.reset();
      }
    });

    it("ignores pointerdown when _canUseVolumeHold returns false", () => {
      host._canUseVolumeHold = mock.fn(() => false);

      ctrl.onPointerDown({
        isPrimary: true,
        pointerType: "touch",
        pointerId: 1,
        clientX: 50,
        clientY: 100,
        currentTarget: targetEl,
      });

      assert.strictEqual(ctrl._pointerId, null);
    });

    it("activates for track title when target element has track-title-holdable class", () => {
      mock.timers.enable();
      try {
        targetEl.classList = {
          contains(name) {
            return name === "track-title-holdable";
          },
        };

        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 100,
          currentTarget: targetEl,
        });

        assert.strictEqual(host._canUseVolumeHold.mock.calls.length, 1);
        assert.strictEqual(host._canUseVolumeHold.mock.calls[0].arguments[0], false);
        assert.strictEqual(host._canUseVolumeHold.mock.calls[0].arguments[1], true);

        mock.timers.tick(HOLD_DELAY_MS);
        assert.strictEqual(ctrl.active, true);
      } finally {
        mock.timers.reset();
      }
    });

    it("does not activate for track title if _canUseVolumeHold returns false", () => {
      mock.timers.enable();
      try {
        host._canUseVolumeHold = mock.fn((allowMenu, isTitle) => !isTitle);
        targetEl.classList = {
          contains(name) {
            return name === "track-title-holdable";
          },
        };

        ctrl.onPointerDown({
          isPrimary: true,
          pointerType: "touch",
          pointerId: 1,
          clientX: 50,
          clientY: 100,
          currentTarget: targetEl,
        });

        assert.strictEqual(host._canUseVolumeHold.mock.calls.length, 1);
        assert.strictEqual(ctrl._pointerId, null);

        mock.timers.tick(HOLD_DELAY_MS);
        assert.strictEqual(ctrl.active, false);
      } finally {
        mock.timers.reset();
      }
    });
  });

  describe("YetAnotherMediaPlayerCard - Volume Hold Integration", () => {
    let card;

    beforeEach(async () => {
      const g = /** @type {any} */ (globalThis);
      g.window = globalThis;
      if (!g.customElements) g.customElements = { define() {} };
      if (!g.HTMLElement) {
        class MockHTMLElement {
          attachShadow() {
            return {};
          }
        }
        g.HTMLElement = MockHTMLElement;
      }
      g.__VERSION__ = "1.0.0-test";
      const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card.hass = {
        states: {
          "media_player.test": {
            entity_id: "media_player.test",
            state: "playing",
            attributes: {
              volume_level: 0.5,
              supported_features: SUPPORT_VOLUME_SET,
            },
          },
        },
      };
    });

    it("defaults hold_title_for_volume to false", () => {
      card.setConfig({
        entities: ["media_player.test"],
      });
      assert.strictEqual(card._holdTitleForVolume, false);
      assert.strictEqual(card._canUseVolumeHold(false, true), false);
    });

    it("enables hold on track title when hold_title_for_volume is true", () => {
      card.setConfig({
        entities: ["media_player.test"],
        hold_title_for_volume: true,
      });
      assert.strictEqual(card._holdTitleForVolume, true);
      assert.strictEqual(card._canUseVolumeHold(false, true), true);
    });

    it("supports alias hold_track_title_for_volume", () => {
      card.setConfig({
        entities: ["media_player.test"],
        hold_track_title_for_volume: true,
      });
      assert.strictEqual(card._holdTitleForVolume, true);
      assert.strictEqual(card._canUseVolumeHold(false, true), true);
    });

    it("allows title hold even if volume_mode is slider or hidden", () => {
      card.setConfig({
        entities: ["media_player.test"],
        volume_mode: "hidden",
        hold_title_for_volume: true,
      });
      assert.strictEqual(card._canUseVolumeHold(false, true), true);
      assert.strictEqual(card._canUseVolumeHold(false, false), false);
    });

    it("rejects title hold if entity does not support volume set", () => {
      card.hass.states["media_player.test"].attributes.supported_features = 0;
      card.setConfig({
        entities: ["media_player.test"],
        hold_title_for_volume: true,
      });
      assert.strictEqual(card._canUseVolumeHold(false, true), false);
    });

    it("supports per-entity override of hold_title_for_volume", () => {
      card.setConfig({
        entities: [{ entity: "media_player.test", hold_title_for_volume: false }],
        hold_title_for_volume: true,
      });
      assert.strictEqual(card._getEffectiveHoldTitleForVolume(), false);
      assert.strictEqual(card._canUseVolumeHold(false, true), false);
    });
  });
});
