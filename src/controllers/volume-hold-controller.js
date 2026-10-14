/**
 * Reactive controller for the press-and-hold volume overlay used in stepper mode.
 * Hold the stepper → full-card overlay → drag vertically to set volume.
 */
import { SUPPORT_VOLUME_MUTE } from "../constants.js";

/** @typedef {import("../types.d.ts").YetAnotherMediaPlayerCard} YetAnotherMediaPlayerCard */

export const HOLD_DELAY_MS = 400;
export const MOVE_TOLERANCE_PX = 10;
export const COMMIT_INTERVAL_MS = 150;
export const MIN_RANGE_PX = 150;
export const RELEASE_LINGER_MS = 550;

/**
 * Computes the volume for a relative vertical drag. Up (smaller Y) = louder.
 * @param {number} startValue 0..1
 * @param {number} startY
 * @param {number} currentY
 * @param {number} rangePx pixels for a full 0→1 sweep
 * @returns {number} clamped 0..1, rounded to 0.01
 */
export function computeHoldVolume(startValue, startY, currentY, rangePx) {
  const range = rangePx > 0 ? rangePx : MIN_RANGE_PX;
  const raw = (Number(startValue) || 0) + (startY - currentY) / range;
  const clamped = Math.max(0, Math.min(1, raw));
  return Math.round(clamped * 100) / 100;
}

/**
 * Icon for a volume percentage (0..100). Same thresholds as the existing overlay/volume row.
 * @param {number} percent
 * @param {boolean} [muted=false]
 * @returns {string}
 */
export function getVolumeIconForPercent(percent, muted = false) {
  if (muted || percent === 0) return "mdi:volume-off";
  if (percent < 20) return "mdi:volume-low";
  if (percent < 50) return "mdi:volume-medium";
  return "mdi:volume-high";
}

export class VolumeHoldController {
  /** @param {YetAnotherMediaPlayerCard} host */
  constructor(host) {
    /** @type {YetAnotherMediaPlayerCard} */
    this.host = host;
    if (host && typeof host.addController === "function") {
      host.addController(this);
    }

    /** @type {boolean} Overlay visible and tracking the finger */
    this.active = false;
    /** @type {boolean} Overlay fading out after release */
    this.releasing = false;
    /** @type {number} Current drag value 0..1 */
    this.value = 0;

    /** @type {number | null} */
    this._pointerId = null;
    /** @type {HTMLElement | null} */
    this._element = null;
    /** @type {number} */
    this._startX = 0;
    /** @type {number} */
    this._startY = 0;
    /** @type {number} */
    this._lastY = 0;
    /** @type {number} */
    this._startValue = 0;
    /** @type {number} */
    this._rangePx = MIN_RANGE_PX;
    /** @type {number | null} */
    this._lastSent = null;
    /** @type {number} */
    this._lastCommitAt = 0;
    /** @type {boolean} */
    this._unmuteHandled = false;

    /** @type {any} */
    this._holdTimer = null;
    /** @type {any} */
    this._commitTimer = null;
    /** @type {any} */
    this._releaseTimer = null;
    /** @type {boolean} */
    this._suppressClick = false;
    /** @type {any} */
    this._suppressClickTimer = null;

    this.onPointerDown = (/** @type {PointerEvent} */ e) => {
      if (!e.isPrimary) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (this._pointerId !== null) return;
      const isMenu = !!(
        this.host?._showEntityOptions ||
        /** @type {HTMLElement} */ (e.currentTarget)?.classList?.contains(
          "persistent-volume-stepper"
        )
      );
      if (!this.host?._canUseVolumeHold?.(isMenu)) return;

      this._clearSuppressClick();
      if (this.releasing) {
        if (this._releaseTimer) {
          clearTimeout(this._releaseTimer);
          this._releaseTimer = null;
        }
        this.releasing = false;
      }

      this._pointerId = e.pointerId;
      this._element = /** @type {HTMLElement} */ (e.currentTarget);
      this._startX = e.clientX;
      this._startY = e.clientY;
      this._lastY = e.clientY;

      if (this._holdTimer) clearTimeout(this._holdTimer);
      this._holdTimer = setTimeout(() => this._activate(), HOLD_DELAY_MS);
    };

    this.onPointerMove = (/** @type {PointerEvent} */ e) => {
      if (this._pointerId === null || e.pointerId !== this._pointerId) return;
      this._lastY = e.clientY;

      if (!this.active && this._holdTimer) {
        const dx = e.clientX - this._startX;
        const dy = e.clientY - this._startY;
        if (Math.hypot(dx, dy) > MOVE_TOLERANCE_PX) {
          if (this._holdTimer) {
            clearTimeout(this._holdTimer);
            this._holdTimer = null;
          }
          this._reset();
        }
        return;
      }

      if (this.active) {
        if (e.cancelable) {
          e.preventDefault();
        }
        const v = computeHoldVolume(this._startValue, this._startY, e.clientY, this._rangePx);
        if (v !== this.value) {
          this.value = v;
          this._maybeUnmute();
          this._scheduleCommit();
          this.host?.requestUpdate?.();
        }
      }
    };

    this.onPointerUp = (/** @type {PointerEvent} */ e) => this._end(e);
    this.onPointerCancel = (/** @type {PointerEvent} */ e) => this._end(e);
    this.onLostPointerCapture = (/** @type {PointerEvent} */ e) => this._end(e);

    this.onContextMenu = (/** @type {Event} */ e) => {
      if (this._pointerId !== null || this.active) {
        e.preventDefault();
      }
    };

    /** @type {{ capture: boolean, handleEvent: (e: Event) => void }} */
    this.clickCapture = {
      capture: true,
      handleEvent: (/** @type {Event} */ e) => {
        if (!this._suppressClick) return;
        e.stopPropagation();
        e.preventDefault();
        this._clearSuppressClick();
      },
    };
  }

  _reset() {
    this._pointerId = null;
    this._element = null;
    this._startX = 0;
    this._startY = 0;
    this._lastY = 0;
    this._startValue = 0;
    this._rangePx = MIN_RANGE_PX;
    this._lastSent = null;
    this._lastCommitAt = 0;
    this._unmuteHandled = false;

    if (this._holdTimer) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
    if (this._commitTimer) {
      clearTimeout(this._commitTimer);
      this._commitTimer = null;
    }
  }

  _clearSuppressClick() {
    this._suppressClick = false;
    if (this._suppressClickTimer) {
      clearTimeout(this._suppressClickTimer);
      this._suppressClickTimer = null;
    }
  }

  _activate() {
    this._holdTimer = null;
    const isMenu = !!(
      this.host?._showEntityOptions ||
      this._element?.classList?.contains("persistent-volume-stepper")
    );
    if (!this.host?._canUseVolumeHold?.(isMenu)) {
      this._reset();
      return;
    }

    const st = this.host.currentVolumeStateObj;
    this._startValue = Number(st?.attributes?.volume_level ?? 0);
    this.value = Math.round(this._startValue * 100) / 100;
    this._startY = this._lastY;

    const cardEl = this.host.renderRoot?.querySelector?.("ha-card");
    const rectHeight = cardEl?.getBoundingClientRect?.().height || 0;
    this._rangePx = Math.max(MIN_RANGE_PX, rectHeight);

    this.host._groupBaseVolume = this._startValue;
    this.host._volumeDraggingEntity = "hold";
    if (this.host._volumeOverlayActive) {
      this.host._dismissVolumeOverlay?.();
    }

    try {
      if (this._pointerId !== null) {
        this._element?.setPointerCapture?.(this._pointerId);
      }
    } catch {
      // Ignore pointer capture failures
    }

    this._suppressClick = true;
    this.active = true;
    this.host?.requestUpdate?.();
  }

  _scheduleCommit() {
    const now = Date.now();
    if (now - this._lastCommitAt >= COMMIT_INTERVAL_MS) {
      this._commit();
    } else if (!this._commitTimer) {
      const wait = COMMIT_INTERVAL_MS - (now - this._lastCommitAt);
      this._commitTimer = setTimeout(() => this._commit(), wait);
    }
  }

  _commit() {
    if (this._commitTimer) {
      clearTimeout(this._commitTimer);
      this._commitTimer = null;
    }
    if (this.value !== this._lastSent) {
      this.host?._applyVolumeLevel?.(this.value);
      this._lastSent = this.value;
      this._lastCommitAt = Date.now();
    }
  }

  _maybeUnmute() {
    if (this._unmuteHandled) return;
    this._unmuteHandled = true;

    const stateObj = this.host?.currentVolumeStateObj;
    if (
      stateObj?.attributes?.is_volume_muted === true &&
      this.host?._supportsFeature?.(stateObj, SUPPORT_VOLUME_MUTE)
    ) {
      this.host._onMuteToggle?.();
    }
  }

  _end(/** @type {PointerEvent} */ e) {
    if (this._pointerId === null || e.pointerId !== this._pointerId) return;

    if (!this.active) {
      this._reset();
      return;
    }

    this._commit();

    if (this.host) {
      this.host._groupBaseVolume = null;
      this.host._volumeDraggingEntity = null;
      this.host._suppressVolumeOverlay?.();
    }

    try {
      if (this._pointerId !== null && this._element?.hasPointerCapture?.(this._pointerId)) {
        this._element.releasePointerCapture(this._pointerId);
      }
    } catch {
      // Ignore release capture errors
    }

    this.active = false;
    this.releasing = true;

    if (this._releaseTimer) clearTimeout(this._releaseTimer);
    this._releaseTimer = setTimeout(() => {
      this.releasing = false;
      this._releaseTimer = null;
      this.host?.requestUpdate?.();
    }, RELEASE_LINGER_MS);

    if (this._suppressClickTimer) clearTimeout(this._suppressClickTimer);
    this._suppressClickTimer = setTimeout(() => this._clearSuppressClick(), 350);

    this._reset();
    this.host?.requestUpdate?.();
  }

  cancel() {
    if (this._holdTimer) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
    if (this._commitTimer) {
      clearTimeout(this._commitTimer);
      this._commitTimer = null;
    }
    if (this._releaseTimer) {
      clearTimeout(this._releaseTimer);
      this._releaseTimer = null;
    }
    this._clearSuppressClick();

    if (this.host && this.host._volumeDraggingEntity === "hold") {
      this.host._volumeDraggingEntity = null;
      this.host._groupBaseVolume = null;
    }

    this.active = false;
    this.releasing = false;
    this._reset();
    this.host?.requestUpdate?.();
  }

  hostDisconnected() {
    this.cancel();
  }
}
