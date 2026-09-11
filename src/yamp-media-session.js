/**
 * Lock Screen & Browser Media Session Manager for Yet Another Media Player (YAMP)
 *
 * Utilizes the Web Media Session API (navigator.mediaSession) and an in-memory inaudible
 * audio loop to keep iOS / Android / Desktop lock screen and Control Center media controls
 * active when backgrounding or locking the device.
 */

let cachedInaudibleWavUrl = null;

/**
 * Generates an in-memory 8000Hz 16-bit mono WAV Blob.
 * The first 1 second contains an inaudible 15Hz tone at -60dB (amplitude 32)
 * to register active audio playback with iOS AVAudioSession / CoreAudio, followed
 * by 4 seconds of digital silence.
 * @returns {string} Blob URL for the audio
 */
function getInaudibleWavUrl() {
  if (cachedInaudibleWavUrl) {
    return cachedInaudibleWavUrl;
  }

  const sampleRate = 8000;
  const duration = 5; // seconds
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
    let sample = 0;
    // 1st second: 15 Hz sine wave at ~ -60dB (amplitude 32 out of 32767)
    if (i < sampleRate) {
      sample = Math.round(Math.sin((2 * Math.PI * 15 * i) / sampleRate) * 32);
    }
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
    this._unlocked = false;
    this._lastMetadata = null;
    this._pauseDebounceTimer = null;
    this._lastSeekPos = null;
    this._lastSeekTimeout = null;
    this._isApplePlatform =
      typeof navigator !== "undefined" &&
      /iPhone|iPod|iPad|Macintosh|MacIntel/i.test(navigator.userAgent);

    this._onUserInteractionUnlock = this._onUserInteractionUnlock.bind(this);
    this._onAudioTimeUpdate = this._onAudioTimeUpdate.bind(this);
  }

  get isSupported() {
    return typeof navigator !== "undefined" && "mediaSession" in navigator;
  }

  _initAudio() {
    if (this._audio) return;

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

    // Loop handler: jump back to silent portion (1.5s) before end (4.5s)
    // to ensure the 15Hz trigger tone only plays once upon starting
    this._audio.addEventListener("timeupdate", this._onAudioTimeUpdate);

    // Append to card shadow root or document body
    try {
      (this.card.shadowRoot || document.body).appendChild(this._audio);
    } catch (_e) {
      document.body.appendChild(this._audio);
    }

    this._attachUnlockListeners();
  }

  _onAudioTimeUpdate() {
    if (this._audio && this._audio.currentTime >= 4.5) {
      this._audio.currentTime = 1.5;
    }
  }

  _onUserInteractionUnlock() {
    this._unlocked = true;
    if (typeof window !== "undefined") {
      const unlockEvents = ["touchstart", "touchend", "click", "keydown"];
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, this._onUserInteractionUnlock, { capture: true });
      });
    }
    // If we are currently supposed to be playing, attempt to resume
    if (this._isAudioPlaying && this._audio && this._audio.paused) {
      this._audio.play().catch(() => {});
    }
  }

  _attachUnlockListeners() {
    if (this._unlocked || typeof window === "undefined") return;
    const unlockEvents = ["touchstart", "touchend", "click", "keydown"];
    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, this._onUserInteractionUnlock, { capture: true, passive: true });
    });
  }

  _startAudio() {
    this._initAudio();
    if (!this._audio) return;

    this._isAudioPlaying = true;
    const playPromise = this._audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((_err) => {
        // Autoplay blocked: wait for user interaction unlock
        this._attachUnlockListeners();
      });
    }
  }

  _pauseAudio() {
    this._isAudioPlaying = false;
    if (this._audio) {
      this._audio.pause();
      this._audio.currentTime = 1.5;
    }
  }

  _registerActionHandlers(targetEntityId) {
    if (!this.isSupported) return;

    const session = navigator.mediaSession;

    session.setActionHandler("play", () => {
      this.card._onControlClick?.("play_pause");
    });

    session.setActionHandler("pause", () => {
      if (this._pauseDebounceTimer) clearTimeout(this._pauseDebounceTimer);
      this._pauseDebounceTimer = setTimeout(() => {
        this.card._onControlClick?.("play_pause");
        this._pauseDebounceTimer = null;
      }, 200);
    });

    session.setActionHandler("nexttrack", () => {
      this.card._onControlClick?.("next");
    });

    session.setActionHandler("previoustrack", () => {
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
    if (!this.isSupported) return;

    if (!enabled || !stateObj) {
      if (currentActiveManager === this) {
        this.reset();
      }
      return;
    }

    const state = stateObj.state;
    const isPlaying = state === "playing";
    const isPaused = state === "paused";

    // If active and playing/paused, claim active manager
    if (isPlaying || isPaused) {
      if (currentActiveManager && currentActiveManager !== this) {
        currentActiveManager.reset();
      }
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
      title || stateObj.attributes?.media_title || stateObj.attributes?.friendly_name || "Media";
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
          // Fallback for browsers with non-standard MediaMetadata constructors
        }
      }
    }

    // Update position state for timeline scrub bar on lock screen
    const duration = stateObj.attributes?.media_duration;
    if (typeof navigator.mediaSession.setPositionState === "function") {
      if (typeof duration === "number" && Number.isFinite(duration) && duration > 0) {
        let position = stateObj.attributes?.media_position || 0;
        if (isPlaying && stateObj.attributes?.media_position_updated_at) {
          const updatedMs = new Date(stateObj.attributes.media_position_updated_at).getTime();
          position += Math.max(0, (Date.now() - updatedMs) / 1000);
        }
        position = Math.min(duration, Math.max(0, position));

        try {
          navigator.mediaSession.setPositionState({
            duration: Math.max(1, Math.round(duration)),
            playbackRate: 1.0,
            position: Math.round(position),
          });
        } catch (_e) {
          // Ignore invalid position/duration error
        }
      } else {
        try {
          navigator.mediaSession.setPositionState();
        } catch (_e) {
          // Ignore unsupported setPositionState
        }
      }
    }
  }

  /**
   * Resets the system Media Session and pauses background audio
   */
  reset() {
    if (currentActiveManager === this) {
      currentActiveManager = null;
    }

    this._pauseAudio();

    if (this.isSupported) {
      const session = navigator.mediaSession;
      session.metadata = null;
      session.playbackState = "none";
      if (typeof session.setPositionState === "function") {
        try {
          session.setPositionState();
        } catch (_e) {
          // Ignore clear error
        }
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
          // Ignore action unregister error
        }
      });
    }

    this._lastMetadata = null;
    if (this._pauseDebounceTimer) {
      clearTimeout(this._pauseDebounceTimer);
      this._pauseDebounceTimer = null;
    }
  }

  /**
   * Completely tears down the manager and removes the audio element
   */
  destroy() {
    this.reset();
    if (typeof window !== "undefined") {
      const unlockEvents = ["touchstart", "touchend", "click", "keydown"];
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, this._onUserInteractionUnlock, { capture: true });
      });
    }
    if (this._audio) {
      this._audio.removeEventListener("timeupdate", this._onAudioTimeUpdate);
      if (this._audio.parentNode) {
        this._audio.parentNode.removeChild(this._audio);
      }
      this._audio = null;
    }
  }
}
