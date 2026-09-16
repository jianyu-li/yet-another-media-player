/**
 * Lock Screen & Browser Media Session Manager for Yet Another Media Player (YAMP)
 *
 * Utilizes the Web Media Session API (navigator.mediaSession) and an in-memory inaudible
 * audio loop to keep iOS / Android / Desktop lock screen and Control Center media controls
 * active when backgrounding or locking the device.
 */

import { getEntityName } from "./yamp-utils.js";

let cachedInaudibleWavUrl = null;

/**
 * Generates an in-memory 8000Hz 16-bit mono WAV Blob.
 * Generates a 30-second continuous inaudible 16Hz sine wave at -62dB (amplitude 24).
 * At 8000Hz, 16Hz has exactly 500 samples per period, meaning 30 seconds contains
 * exactly 480 full cycles with zero phase discontinuity at the loop boundary.
 * Continuous non-zero PCM samples prevent iOS CoreAudio silence detection from powering
 * down audio hardware or terminating background audio execution.
 * @returns {string} Blob URL for the audio
 */
function getInaudibleWavUrl() {
  if (cachedInaudibleWavUrl) {
    return cachedInaudibleWavUrl;
  }

  const sampleRate = 8000;
  const duration = 30; // seconds
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * duration;
  const dataSize = numSamples * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF chunk descriptor
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");

  // fmt subchunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
  view.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Continuous 16 Hz sine wave at ~ -62dB (amplitude 24 out of 32767)
    // 8000 / 16 = exactly 500 samples per period, guaranteeing seamless loop boundary
    const sample = Math.round(Math.sin((2 * Math.PI * 16 * i) / sampleRate) * 24);
    view.setInt16(offset, sample, true);
    offset += 2;
  }

  try {
    const blob = new Blob([buffer], { type: "audio/wav" });
    cachedInaudibleWavUrl = URL.createObjectURL(blob);
  } catch (_e) {
    // Fallback if Blob / createObjectURL is restricted
    cachedInaudibleWavUrl = "";
  }

  return cachedInaudibleWavUrl;
}

/**
 * Resolves any relative Home Assistant asset URL to a fully-qualified absolute URL
 * @param {string} url
 * @returns {string}
 */
function toAbsoluteUrl(url) {
  if (!url) return "";
  const str = typeof url === "string" ? url : url?.url;
  if (!str || typeof str !== "string") return "";
  try {
    return new URL(str, window.location.href).href;
  } catch (_e) {
    return str;
  }
}

// Module-level active coordinator to prevent multiple YAMP cards from colliding
let currentActiveManager = null;

export class YampMediaSessionManager {
  /**
   * @param {any} card YAMP card element reference
   */
  constructor(card) {
    this.card = card;
    this._audio = null;
    this._isAudioPlaying = false;
    this._isInternalPause = false;
    this._hasStartedPlaying = false;
    this._autoplayBlocked = false;
    this._wasInterrupted = false;
    this._unlocked = false;
    this._lastMetadata = null;
    this._pauseDebounceTimer = null;
    this._lastSeekPos = null;
    this._lastSeekTimeout = null;
    this._internalPauseTimer = null;
    this._isApplePlatform =
      typeof navigator !== "undefined" &&
      /iPhone|iPod|iPad|Macintosh|MacIntel/i.test(navigator.userAgent);

    this._lastReportedState = null;
    this._wasEvicted = false;
    this._hasUserInteraction = false;
    this._lastTrackKey = null;
    this._lastPlaybackState = null;
    this._unlockListenersAttached = false;

    /** @type {((state: 'ready'|'connecting'|null) => void)|null} */
    this.onReadyChange = null;

    this._onUserInteractionUnlock = this._onUserInteractionUnlock.bind(this);
    this._onAudioTimeUpdate = this._onAudioTimeUpdate.bind(this);
    this._onAudioPlaying = this._onAudioPlaying.bind(this);
    this._onAudioPause = this._onAudioPause.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);

    if (!this.card?._isEditorPreview) {
      this._attachUnlockListeners();
    }
  }

  get isSupported() {
    return typeof navigator !== "undefined" && "mediaSession" in navigator;
  }

  get isReady() {
    return !!(
      this._isAudioPlaying &&
      this._audio &&
      !this._audio.paused &&
      !this._wasInterrupted &&
      this._hasStartedPlaying
    );
  }

  get lockScreenState() {
    if (!this.isSupported) return null;
    if (!this._isAudioPlaying || this._wasInterrupted) return null;
    return this.isReady ? "ready" : "connecting";
  }

  _notifyStateChange() {
    const newState = this.lockScreenState;
    if (this._lastReportedState !== newState) {
      this._lastReportedState = newState;
      this.onReadyChange?.(newState);
    }
  }

  _initAudio() {
    if (this.card?._isEditorPreview) return;
    if (this._audio) {
      if (!this._audio.parentNode && typeof document !== "undefined" && document.body) {
        try {
          document.body.appendChild(this._audio);
        } catch (_e) {
          // Ignore append error
        }
      }
      return;
    }

    const audioUrl = getInaudibleWavUrl();
    if (!audioUrl) return;

    this._audio = document.createElement("audio");
    this._audio.src = audioUrl;
    this._audio.loop = true;
    this._audio.preload = "auto";
    // Keep offscreen without display:none so iOS WebKit preserves background audio
    this._audio.setAttribute(
      "style",
      "position:fixed;width:0;height:0;opacity:0;pointer-events:none;bottom:0;right:0;"
    );
    this._audio.setAttribute("playsinline", "");
    this._audio.setAttribute("webkit-playsinline", "");

    this._audio.addEventListener("timeupdate", this._onAudioTimeUpdate);
    this._audio.addEventListener("playing", this._onAudioPlaying);
    this._audio.addEventListener("pause", this._onAudioPause);

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this._onVisibilityChange);
    }

    // Always append directly to document.body outside of LitElement rendering lifecycle
    if (typeof document !== "undefined" && document.body) {
      try {
        document.body.appendChild(this._audio);
      } catch (_e) {
        // Ignore append error
      }
    }
  }

  _onAudioTimeUpdate() {
    // Loop cleanly before EOF (at 28s out of 30s) to prevent browser from firing
    // 'ended' or 'pause' events at the buffer boundary which disconnects mediaSession
    if (this._audio && this._audio.currentTime >= 28.0) {
      this._isInternalPause = true;
      try {
        this._audio.currentTime = 1.0;
      } catch (_e) {
        // Ignore seek error
      }
      if (this._internalPauseTimer) clearTimeout(this._internalPauseTimer);
      this._internalPauseTimer = setTimeout(() => {
        this._internalPauseTimer = null;
        this._isInternalPause = false;
      }, 500);
    }
  }

  _onAudioPlaying() {
    if (!this._isAudioPlaying) {
      if (this._audio) {
        this._isInternalPause = true;
        this._audio.pause();
      }
      return;
    }
    this._hasStartedPlaying = true;
    this._autoplayBlocked = false;
    this._wasInterrupted = false;
    this._notifyStateChange();
  }

  _onAudioPause() {
    if (this._wasEvicted || this._isInternalPause || (this._audio && this._audio.seeking)) {
      this._isInternalPause = false;
      return;
    }
    // If audio has not successfully started playing yet (e.g. autoplay blocked on page load),
    // or if audio is not supposed to be playing (e.g. HA is paused/idle),
    // do not treat this initial pause as an external interruption!
    if (!this._isAudioPlaying || !this._hasStartedPlaying) {
      return;
    }
    // External interruption: another app (Spotify, YouTube, Facebook, phone call, Siri)
    // stole audio focus. Disconnect YAMP from phone media session to yield audio focus
    // without sending a pause command to Home Assistant!
    this._wasInterrupted = true;
    this._hasStartedPlaying = false;
    if (this._pauseDebounceTimer) {
      clearTimeout(this._pauseDebounceTimer);
      this._pauseDebounceTimer = null;
    }
    this.reset();
  }

  _onVisibilityChange() {
    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      this._autoplayBlocked = false;
      if (this._wasInterrupted) {
        this._wasInterrupted = false;
        setTimeout(() => {
          this.card?.requestUpdate?.();
        }, 0);
      }
    }
  }

  /**
   * Resets interruption / eviction flags when the user explicitly interacts with this card.
   */
  resumeFromUserGesture() {
    if (this.card?._isEditorPreview) return;
    this._wasInterrupted = false;
    this._autoplayBlocked = false;
    this._wasEvicted = false;
    this._hasUserInteraction = true;
    this._attachUnlockListeners();
  }

  _onUserInteractionUnlock() {
    if (this.card?._isEditorPreview) return;
    this._unlocked = true;
    this._autoplayBlocked = false;
    // Only attempt to start audio if THIS manager is supposed to be playing.
    if (this._isAudioPlaying && this._audio && this._audio.paused) {
      // STEALING GUARD: In a multi-card dashboard, multiple instances might receive
      // a global user interaction unlock event simultaneously. We prevent this inactive
      // manager from starting its audio element if another active manager is already
      // playing, avoiding a 'ping-pong' eviction loop between instances.
      if (
        currentActiveManager &&
        currentActiveManager !== this &&
        currentActiveManager._isAudioPlaying
      ) {
        return;
      }
      this._initAudio();
      const playPromise = this._audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this._hasStartedPlaying = true;
            this._autoplayBlocked = false;
            this._notifyStateChange();
            this._detachUnlockListeners();
          })
          .catch(() => {});
      }
    }
  }

  _attachUnlockListeners() {
    if (this.card?._isEditorPreview) return;
    if (typeof window === "undefined" || this._unlockListenersAttached) return;
    const unlockEvents = ["pointerdown", "mousedown", "click", "touchstart", "touchend", "keydown"];
    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, this._onUserInteractionUnlock, { capture: true, passive: true });
    });
    this._unlockListenersAttached = true;
  }

  _detachUnlockListeners() {
    if (typeof window === "undefined" || !this._unlockListenersAttached) return;
    const unlockEvents = ["pointerdown", "mousedown", "click", "touchstart", "touchend", "keydown"];
    unlockEvents.forEach((evt) => {
      window.removeEventListener(evt, this._onUserInteractionUnlock, { capture: true });
    });
    this._unlockListenersAttached = false;
  }

  _startAudio() {
    if (this.card?._isEditorPreview) return;
    this._initAudio();
    if (!this._audio) return;

    if (this._isAudioPlaying && !this._audio.paused) {
      return;
    }

    // If autoplay was already blocked and we are awaiting user touch, don't keep calling play() on every update
    if (this._autoplayBlocked) {
      this._attachUnlockListeners();
      return;
    }

    this._isAudioPlaying = true;
    this._notifyStateChange();
    const playPromise = this._audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this._hasStartedPlaying = true;
          this._autoplayBlocked = false;
          this._notifyStateChange();
          this._detachUnlockListeners();
        })
        .catch((_err) => {
          // Autoplay blocked: wait for user interaction unlock
          this._autoplayBlocked = true;
          this._hasStartedPlaying = false;
          this._attachUnlockListeners();
          this._notifyStateChange();
        });
    }
  }

  _pauseAudio(silent = false) {
    if (!this._isAudioPlaying && (!this._audio || this._audio.paused)) {
      return;
    }
    this._isAudioPlaying = false;
    this._hasStartedPlaying = false;
    if (this._audio) {
      this._isInternalPause = true;
      this._audio.pause();
    }
    if (!silent) {
      this._notifyStateChange();
    }
  }

  /**
   * Directly initiates audio playback from a user gesture (e.g. tapping play/pause, next, prev, preset).
   * Synchronously invokes this._audio.play() in the user gesture call stack to bypass browser autoplay restrictions.
   * @param {string} [targetEntityId]
   */
  startPlaybackGesture(targetEntityId) {
    if (!this.isSupported || !this.card?._isMediaSessionEnabled) return;
    this.resumeFromUserGesture();
    this._initAudio();
    if (!this._audio) return;

    if (currentActiveManager && currentActiveManager !== this) {
      currentActiveManager._wasEvicted = true;
      currentActiveManager.reset(true /* silent */);
    }
    currentActiveManager = this;
    this._wasEvicted = false;
    this._isAudioPlaying = true;
    this._notifyStateChange();

    const playPromise = this._audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this._hasStartedPlaying = true;
          this._autoplayBlocked = false;
          this._notifyStateChange();
          this._detachUnlockListeners();
        })
        .catch((_err) => {
          this._autoplayBlocked = true;
          this._hasStartedPlaying = false;
          this._attachUnlockListeners();
          this._notifyStateChange();
        });
    }

    if (targetEntityId) {
      this._registerActionHandlers(targetEntityId);
    }
  }

  _registerActionHandlers(targetEntityId) {
    if (!this.isSupported) return;

    const session = navigator.mediaSession;

    session.setActionHandler("play", () => {
      this.resumeFromUserGesture();
      this.card._onControlClick?.("play_pause");
    });

    session.setActionHandler("pause", () => {
      // If external audio interruption occurred or audio is paused externally, ignore
      if (this._wasInterrupted || (this._audio && this._audio.paused && !this._isInternalPause)) {
        return;
      }
      if (this._pauseDebounceTimer) clearTimeout(this._pauseDebounceTimer);
      this._pauseDebounceTimer = setTimeout(() => {
        if (this._wasInterrupted || (this._audio && this._audio.paused && !this._isInternalPause)) {
          this._pauseDebounceTimer = null;
          return;
        }
        this.card._onControlClick?.("play_pause");
        this._pauseDebounceTimer = null;
      }, 350);
    });

    session.setActionHandler("nexttrack", () => {
      this.resumeFromUserGesture();
      this.card._onControlClick?.("next");
    });

    session.setActionHandler("previoustrack", () => {
      this.resumeFromUserGesture();
      this.card._onControlClick?.("prev");
    });

    session.setActionHandler("seekto", (details) => {
      if (details.seekTime != null && targetEntityId) {
        this.card.hass?.callService("media_player", "media_seek", {
          entity_id: targetEntityId,
          seek_position: Math.round(details.seekTime),
        });
      }
    });

    // Seek forward/backward: intentionally omitted on iOS/Mac because registering them
    // replaces the Previous/Next track buttons with 15s skip buttons on Apple's lock screen.
    if (!this._isApplePlatform) {
      session.setActionHandler("seekforward", (details) => {
        const offset = details.seekOffset || 10;
        this._handleRelativeSeek(targetEntityId, offset);
      });
      session.setActionHandler("seekbackward", (details) => {
        const offset = details.seekOffset || 10;
        this._handleRelativeSeek(targetEntityId, -offset);
      });
    }
  }

  _handleRelativeSeek(targetEntityId, offset) {
    if (!targetEntityId) return;
    const stateObj = this.card.hass?.states?.[targetEntityId];
    if (!stateObj?.attributes) return;

    const duration = stateObj.attributes.media_duration;
    let currentPos = this._lastSeekPos;
    if (currentPos == null) {
      currentPos = stateObj.attributes.media_position || 0;
      if (stateObj.state === "playing" && stateObj.attributes.media_position_updated_at) {
        const updatedMs = new Date(stateObj.attributes.media_position_updated_at).getTime();
        currentPos += Math.max(0, (Date.now() - updatedMs) / 1000);
      }
    }

    let target = Math.max(0, currentPos + offset);
    if (duration != null && duration > 0) {
      target = Math.min(duration, target);
    }
    const finalSeek = Math.round(target);
    this._lastSeekPos = finalSeek;

    if (this._lastSeekTimeout) clearTimeout(this._lastSeekTimeout);
    this._lastSeekTimeout = setTimeout(() => {
      this._lastSeekPos = null;
      this._lastSeekTimeout = null;
    }, 2000);

    this.card.hass?.callService("media_player", "media_seek", {
      entity_id: targetEntityId,
      seek_position: finalSeek,
    });
  }

  /**
   * Updates the Media Session metadata, position state, and audio loop.
   * Call this from the card's updated() lifecycle.
   *
   * @param {Object} options
   * @param {boolean} options.enabled Whether lock_screen_controls is enabled in config
   * @param {any} options.stateObj The active playback state object
   * @param {string|null} options.targetEntityId The active entity ID for actions
   * @param {string|null} [options.title] Optional override title from rich metadata
   * @param {string|null} [options.artist] Optional override artist from rich metadata
   * @param {string|null} [options.album] Optional override album from rich metadata
   */
  update({ enabled, stateObj, targetEntityId, artworkUrl, title, artist, album }) {
    if (!this.isSupported || this.card?._isEditorPreview) return;

    if (!enabled || !stateObj) {
      if (currentActiveManager === this) {
        this.reset();
      }
      return;
    }

    // If a new track or entity starts playing, automatically clear any prior interruption
    // only when the document is visible to prevent background track changes from stealing focus
    const currentEntityOrTrackKey = `${targetEntityId}|${stateObj.attributes?.media_title || ""}|${stateObj.attributes?.media_artist || ""}`;
    if (this._lastTrackKey !== currentEntityOrTrackKey) {
      this._lastTrackKey = currentEntityOrTrackKey;
      if (typeof document !== "undefined" && !document.hidden) {
        this._wasInterrupted = false;
        this._wasEvicted = false;
      }
    }

    const state = stateObj.state;
    const isPlaying = state === "playing";
    const isPaused = state === "paused";

    // If playback transitions from not playing (paused/idle/off) to playing:
    if (
      isPlaying &&
      (this._lastPlaybackState === "paused" ||
        this._lastPlaybackState === "idle" ||
        this._lastPlaybackState === "off")
    ) {
      this._wasInterrupted = false;
      this._wasEvicted = false;
      this._autoplayBlocked = false;
    }
    this._lastPlaybackState = state;

    // If an external interruption occurred, stay disconnected until the user interacts with YAMP,
    // returns to the app, toggles controls, or track changes while visible.
    if (this._wasInterrupted) {
      return;
    }

    // If active and playing/paused, claim active manager
    if (isPlaying || isPaused) {
      if (currentActiveManager && currentActiveManager !== this) {
        // If current active manager is playing and this manager is only paused, do not steal
        if (currentActiveManager._isAudioPlaying && isPaused && !isPlaying) {
          return;
        }
        // If current active manager is already actively playing and this manager is also playing without explicit interaction,
        // do not steal to prevent multi-card ping-pong loops on shared dashboards
        if (currentActiveManager._isAudioPlaying && isPlaying && !this._hasUserInteraction) {
          return;
        }
        // If this manager was previously evicted by another manager, don't steal back
        // unless user interacted with this card or this manager just transitioned to playing
        if (this._wasEvicted && !this._hasUserInteraction && !isPlaying) {
          return;
        }
        currentActiveManager._wasEvicted = true;
        currentActiveManager.reset(true /* silent */);
      }
      this._wasEvicted = false;
      this._hasUserInteraction = false;
      currentActiveManager = this;
    } else {
      if (currentActiveManager === this) {
        this.reset();
      }
      return;
    }

    // Manage silent audio playback
    if (isPlaying) {
      this._startAudio();
      navigator.mediaSession.playbackState = "playing";
    } else if (isPaused) {
      this._pauseAudio();
      navigator.mediaSession.playbackState = "paused";
    } else {
      this._pauseAudio();
      navigator.mediaSession.playbackState = "none";
    }

    // Register or update action handlers
    this._registerActionHandlers(targetEntityId);

    // Update track metadata
    const resolvedTitle =
      title ||
      stateObj.attributes?.media_title ||
      getEntityName(this.card?.hass, stateObj) ||
      "Media";
    const resolvedArtist = artist || stateObj.attributes?.media_artist || "";
    const resolvedAlbum = album || stateObj.attributes?.media_album_name || "";
    const rawArtwork =
      (typeof artworkUrl === "string" ? artworkUrl : artworkUrl?.url) ||
      stateObj.attributes?.entity_picture ||
      "";
    const absoluteArtwork = toAbsoluteUrl(rawArtwork);

    const metaKey = `${resolvedTitle}|${resolvedArtist}|${resolvedAlbum}|${absoluteArtwork}`;
    if (this._lastMetadata !== metaKey) {
      this._lastMetadata = metaKey;
      const artwork = absoluteArtwork
        ? [
            { src: absoluteArtwork, sizes: "96x96" },
            { src: absoluteArtwork, sizes: "128x128" },
            { src: absoluteArtwork, sizes: "192x192" },
            { src: absoluteArtwork, sizes: "256x256" },
            { src: absoluteArtwork, sizes: "384x384" },
            { src: absoluteArtwork, sizes: "512x512" },
            { src: absoluteArtwork },
          ]
        : [];

      if (typeof MediaMetadata !== "undefined") {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: resolvedTitle,
            artist: resolvedArtist,
            album: resolvedAlbum,
            artwork,
          });
        } catch (_e) {
          // Fallback or ignore metadata constructor error
        }
      }
    }

    // Update position state for seek bar
    const duration = stateObj.attributes?.media_duration;
    if (duration != null && duration > 0) {
      let position = stateObj.attributes?.media_position || 0;
      if (isPlaying && stateObj.attributes?.media_position_updated_at) {
        const updatedMs = new Date(stateObj.attributes.media_position_updated_at).getTime();
        position += Math.max(0, (Date.now() - updatedMs) / 1000);
      }
      position = Math.min(position, duration);

      if (typeof navigator.mediaSession.setPositionState === "function") {
        try {
          navigator.mediaSession.setPositionState({
            duration: Math.max(1, Math.round(duration)),
            playbackRate: 1.0,
            position: Math.max(0, Math.min(Math.round(position), Math.round(duration))),
          });
        } catch (_e) {
          // Ignore unsupported setPositionState
        }
      }
    } else {
      if (typeof navigator.mediaSession.setPositionState === "function") {
        try {
          navigator.mediaSession.setPositionState();
        } catch (_e) {
          // Ignore unsupported setPositionState
        }
      }
    }
  }

  /**
   * Resets the system Media Session and pauses background audio.
   * @param {boolean} [silent=false] If true, skips notifying card of state change to prevent re-render loops.
   */
  reset(silent = false) {
    const wasActive = currentActiveManager === this;
    if (wasActive) {
      currentActiveManager = null;
    }

    this._pauseAudio(silent);

    if (this.isSupported && wasActive) {
      const session = navigator.mediaSession;
      try {
        session.metadata = null;
        session.playbackState = "none";
        if (typeof session.setPositionState === "function") {
          session.setPositionState();
        }
      } catch (_e) {
        // Ignore reset error
      }

      const actions = [
        "play",
        "pause",
        "nexttrack",
        "previoustrack",
        "seekto",
        "seekforward",
        "seekbackward",
      ];
      actions.forEach((action) => {
        try {
          session.setActionHandler(action, null);
        } catch (_e) {
          // Ignore action handler clear error
        }
      });
    }

    this._lastMetadata = null;
    this._lastPlaybackState = null;
    if (this._pauseDebounceTimer) {
      clearTimeout(this._pauseDebounceTimer);
      this._pauseDebounceTimer = null;
    }
    if (this._lastSeekTimeout) {
      clearTimeout(this._lastSeekTimeout);
      this._lastSeekTimeout = null;
      this._lastSeekPos = null;
    }
    if (this._internalPauseTimer) {
      clearTimeout(this._internalPauseTimer);
      this._internalPauseTimer = null;
    }
    if (!silent) {
      this._notifyStateChange();
    }
  }

  /**
   * Re-attaches event listeners after the card reconnects to the DOM.
   * Lighter than creating a new manager — preserves audio element and state.
   */
  attach() {
    if (this.card?._isEditorPreview) return;
    this._attachUnlockListeners();
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this._onVisibilityChange);
    }
  }

  /**
   * Detaches event listeners when the card disconnects from the DOM.
   * Preserves the audio element for potential reconnection via attach().
   */
  detach() {
    this.reset();
    this._detachUnlockListeners();
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this._onVisibilityChange);
    }
  }

  /**
   * Completely tears down the manager and removes the audio element.
   * Use detach() for temporary disconnections; use destroy() for permanent removal.
   */
  destroy() {
    this.detach();
    if (this._audio) {
      this._audio.removeEventListener("timeupdate", this._onAudioTimeUpdate);
      this._audio.removeEventListener("playing", this._onAudioPlaying);
      this._audio.removeEventListener("pause", this._onAudioPause);
      if (this._audio.parentNode) {
        this._audio.parentNode.removeChild(this._audio);
      }
      this._audio = null;
    }
  }
}
