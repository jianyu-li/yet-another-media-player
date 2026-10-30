/**
 * Home Assistant Media Player and Remote service dispatcher.
 * Pure, isolated service layer for executing Home Assistant service calls.
 *
 * @module services/ha-media-services
 */

/**
 * @typedef {import("../types.d.ts").HomeAssistant} HomeAssistant
 */

/**
 * Sends a media_play service call to a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function mediaPlay(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "media_play", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.media_play on ${entityId}:`, err);
  }
}

/**
 * Sends a media_pause service call to a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function mediaPause(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "media_pause", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.media_pause on ${entityId}:`, err);
  }
}

/**
 * Sends a media_play_pause service call to a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function mediaPlayPause(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "media_play_pause", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.media_play_pause on ${entityId}:`, err);
  }
}

/**
 * Sends a media_stop service call to a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function mediaStop(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "media_stop", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.media_stop on ${entityId}:`, err);
  }
}

/**
 * Sends a media_next_track service call to a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function mediaNextTrack(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "media_next_track", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.media_next_track on ${entityId}:`, err);
  }
}

/**
 * Sends a media_previous_track service call to a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function mediaPreviousTrack(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "media_previous_track", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.media_previous_track on ${entityId}:`, err);
  }
}

/**
 * Seeks to a specific timestamp in seconds on a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {number} seekPosition - Target position in seconds
 * @returns {Promise<any>}
 */
export async function mediaSeek(hass, entityId, seekPosition) {
  if (!hass?.callService || !entityId) return;
  const pos = Math.max(0, Math.floor(Number(seekPosition) || 0));
  try {
    return await hass.callService("media_player", "media_seek", {
      entity_id: entityId,
      seek_position: pos,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.media_seek on ${entityId}:`, err);
  }
}

/**
 * Sets shuffle mode on a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {boolean|any} shuffle - True to enable shuffle, false to disable
 * @returns {Promise<any>}
 */
export async function setShuffle(hass, entityId, shuffle) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "shuffle_set", {
      entity_id: entityId,
      shuffle: Boolean(shuffle),
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.shuffle_set on ${entityId}:`, err);
  }
}

/**
 * Sets repeat mode on a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {string} repeat - Repeat mode: 'off' | 'all' | 'one'
 * @returns {Promise<any>}
 */
export async function setRepeat(hass, entityId, repeat) {
  if (!hass?.callService || !entityId) return;
  const mode = repeat === "all" || repeat === "one" ? repeat : "off";
  try {
    return await hass.callService("media_player", "repeat_set", {
      entity_id: entityId,
      repeat: mode,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.repeat_set on ${entityId}:`, err);
  }
}

/**
 * Selects an input source for a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {string} source - Source name to select
 * @returns {Promise<any>}
 */
export async function selectSource(hass, entityId, source) {
  if (!hass?.callService || !entityId || !source) return;
  try {
    return await hass.callService("media_player", "select_source", {
      entity_id: entityId,
      source: String(source),
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.select_source on ${entityId}:`, err);
  }
}

/**
 * Selects a sound mode for a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {string} soundMode - Sound mode to select
 * @returns {Promise<any>}
 */
export async function selectSoundMode(hass, entityId, soundMode) {
  if (!hass?.callService || !entityId || !soundMode) return;
  try {
    return await hass.callService("media_player", "select_sound_mode", {
      entity_id: entityId,
      sound_mode: String(soundMode),
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.select_sound_mode on ${entityId}:`, err);
  }
}

/**
 * Plays media content on a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {string} mediaContentId - Content identifier or URI
 * @param {string} mediaContentType - Content type (e.g. music, playlist, track)
 * @param {string} [enqueue] - Optional enqueue mode ('play', 'next', 'add', 'replace')
 * @returns {Promise<any>}
 */
export async function playMedia(hass, entityId, mediaContentId, mediaContentType, enqueue) {
  if (!hass?.callService || !entityId) return;
  const payload = {
    entity_id: entityId,
    media_content_id: mediaContentId,
    media_content_type: mediaContentType,
  };
  if (enqueue) {
    payload.enqueue = enqueue;
  }
  try {
    return await hass.callService("media_player", "play_media", payload);
  } catch (err) {
    console.error(`YAMP: Error calling media_player.play_media on ${entityId}:`, err);
  }
}

/**
 * Turns on a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function turnOn(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "turn_on", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.turn_on on ${entityId}:`, err);
  }
}

/**
 * Turns off a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function turnOff(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "turn_off", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.turn_off on ${entityId}:`, err);
  }
}

/**
 * Toggles power on a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {string} [currentState] - Optional current state string ('off', 'idle', 'playing', etc.)
 * @returns {Promise<any>}
 */
export async function togglePower(hass, entityId, currentState) {
  if (!hass?.callService || !entityId) return;
  const service = currentState === "off" ? "turn_on" : "turn_off";
  try {
    return await hass.callService("media_player", service, {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.${service} on ${entityId}:`, err);
  }
}

/**
 * Toggles media player state (media_player.toggle).
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @returns {Promise<any>}
 */
export async function mediaToggle(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "toggle", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.toggle on ${entityId}:`, err);
  }
}

/**
 * Sets volume level for a media player entity.
 * Clamps volume between 0 and 1, rounded to 4 decimal places.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {number|string} volumeLevel - Target volume level (0.0 to 1.0)
 * @returns {Promise<any>}
 */
export async function setVolume(hass, entityId, volumeLevel) {
  if (!hass?.callService || !entityId) return;
  const num = Number(volumeLevel);
  if (isNaN(num)) return;
  const clamped = Math.max(0, Math.min(1, num));
  const rounded = Math.round(clamped * 10000) / 10000;
  try {
    return await hass.callService("media_player", "volume_set", {
      entity_id: entityId,
      volume_level: rounded,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.volume_set on ${entityId}:`, err);
  }
}

/**
 * Adjusts volume level by a delta step.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {number|string} currentVolume - Current volume level (0.0 to 1.0)
 * @param {number|string} step - Volume delta to add (positive or negative)
 * @returns {Promise<any>}
 */
export async function stepVolume(hass, entityId, currentVolume, step) {
  const current = Number(currentVolume) || 0;
  const numStep = Number(step) || 0;
  return setVolume(hass, entityId, current + numStep);
}

/**
 * Sets mute state for a media player entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID
 * @param {boolean|any} isVolumeMuted - True to mute, false to unmute
 * @returns {Promise<any>}
 */
export async function setMute(hass, entityId, isVolumeMuted) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "volume_mute", {
      entity_id: entityId,
      is_volume_muted: Boolean(isVolumeMuted),
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.volume_mute on ${entityId}:`, err);
  }
}

/**
 * Sends an arbitrary command to a remote entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target remote entity ID
 * @param {string|string[]} command - Remote command(s) to send
 * @returns {Promise<any>}
 */
export async function sendRemoteCommand(hass, entityId, command) {
  if (!hass?.callService || !entityId || !command) return;
  try {
    return await hass.callService("remote", "send_command", {
      entity_id: entityId,
      command,
    });
  } catch (err) {
    console.error(`YAMP: Error calling remote.send_command on ${entityId}:`, err);
  }
}

/**
 * Sends a volume step command ('volume_up' or 'volume_down') to a remote entity.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target remote entity ID
 * @param {number} direction - Positive for up (> 0), negative/zero for down
 * @returns {Promise<any>}
 */
export async function sendRemoteVolumeStep(hass, entityId, direction) {
  if (!hass?.callService || !entityId) return;
  const command = direction > 0 ? "volume_up" : "volume_down";
  try {
    return await hass.callService("remote", "send_command", {
      entity_id: entityId,
      command,
    });
  } catch (err) {
    console.error(`YAMP: Error calling remote.send_command on ${entityId}:`, err);
  }
}

/**
 * Joins one or more media player entities to a master player.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} masterEntityId - Master entity ID to join to
 * @param {string|string[]} groupMembers - Entity ID or array of entity IDs to join
 * @returns {Promise<any>}
 */
export async function joinPlayers(hass, masterEntityId, groupMembers) {
  if (!hass?.callService || !masterEntityId) return;
  const rawMembers = Array.isArray(groupMembers) ? groupMembers : [groupMembers];
  const members = rawMembers.filter(Boolean);
  if (members.length === 0) return;
  try {
    return await hass.callService("media_player", "join", {
      entity_id: masterEntityId,
      group_members: members,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.join on ${masterEntityId}:`, err);
  }
}

/**
 * Unjoins a media player entity from its group.
 *
 * @param {HomeAssistant|any} hass - Home Assistant instance
 * @param {string} entityId - Target entity ID to unjoin
 * @returns {Promise<any>}
 */
export async function unjoinPlayer(hass, entityId) {
  if (!hass?.callService || !entityId) return;
  try {
    return await hass.callService("media_player", "unjoin", {
      entity_id: entityId,
    });
  } catch (err) {
    console.error(`YAMP: Error calling media_player.unjoin on ${entityId}:`, err);
  }
}
