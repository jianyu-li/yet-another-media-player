import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import {
  mediaPlay,
  mediaPause,
  mediaPlayPause,
  mediaStop,
  mediaNextTrack,
  mediaPreviousTrack,
  mediaSeek,
  setShuffle,
  setRepeat,
  selectSource,
  selectSoundMode,
  playMedia,
  turnOn,
  turnOff,
  togglePower,
  mediaToggle,
  setVolume,
  stepVolume,
  setMute,
  sendRemoteCommand,
  sendRemoteVolumeStep,
  joinPlayers,
  unjoinPlayer,
} from "../src/services/ha-media-services.js";

describe("HA Media Services Dispatcher (ha-media-services)", () => {
  let mockHass;
  let serviceCalls;

  beforeEach(() => {
    serviceCalls = [];
    mockHass = {
      callService: mock.fn(async (domain, service, data) => {
        serviceCalls.push({ domain, service, data });
        return { success: true };
      }),
    };
  });

  describe("Null, undefined, and invalid input safety", () => {
    it("gracefully handles missing hass or callService", async () => {
      assert.strictEqual(await mediaPlay(null, "media_player.test"), undefined);
      assert.strictEqual(await mediaPlay({}, "media_player.test"), undefined);
      assert.strictEqual(await setVolume(null, "media_player.test", 0.5), undefined);
      assert.strictEqual(
        await joinPlayers(null, "media_player.master", ["media_player.sub"]),
        undefined
      );
    });

    it("gracefully handles missing entityId", async () => {
      assert.strictEqual(await mediaPlay(mockHass, null), undefined);
      assert.strictEqual(await mediaPause(mockHass, ""), undefined);
      assert.strictEqual(await setVolume(mockHass, "", 0.5), undefined);
      assert.strictEqual(await sendRemoteCommand(mockHass, "", "enter"), undefined);
      assert.strictEqual(serviceCalls.length, 0);
    });
  });

  describe("Transport Controls", () => {
    it("dispatches media_play", async () => {
      await mediaPlay(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_play",
        data: { entity_id: "media_player.living_room" },
      });
    });

    it("dispatches media_pause", async () => {
      await mediaPause(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_pause",
        data: { entity_id: "media_player.living_room" },
      });
    });

    it("dispatches media_play_pause", async () => {
      await mediaPlayPause(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_play_pause",
        data: { entity_id: "media_player.living_room" },
      });
    });

    it("dispatches media_stop", async () => {
      await mediaStop(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_stop",
        data: { entity_id: "media_player.living_room" },
      });
    });

    it("dispatches media_next_track", async () => {
      await mediaNextTrack(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_next_track",
        data: { entity_id: "media_player.living_room" },
      });
    });

    it("dispatches media_previous_track", async () => {
      await mediaPreviousTrack(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "media_previous_track",
        data: { entity_id: "media_player.living_room" },
      });
    });

    it("dispatches media_seek with floored, non-negative integer position", async () => {
      await mediaSeek(mockHass, "media_player.living_room", 45.8);
      await mediaSeek(mockHass, "media_player.living_room", -10);
      assert.strictEqual(serviceCalls.length, 2);
      assert.deepStrictEqual(serviceCalls[0].data, {
        entity_id: "media_player.living_room",
        seek_position: 45,
      });
      assert.deepStrictEqual(serviceCalls[1].data, {
        entity_id: "media_player.living_room",
        seek_position: 0,
      });
    });
  });

  describe("Playback Modes & Source", () => {
    it("dispatches shuffle_set with boolean coercion", async () => {
      await setShuffle(mockHass, "media_player.living_room", true);
      await setShuffle(mockHass, "media_player.living_room", 0);
      assert.strictEqual(serviceCalls.length, 2);
      assert.deepStrictEqual(serviceCalls[0].data, {
        entity_id: "media_player.living_room",
        shuffle: true,
      });
      assert.deepStrictEqual(serviceCalls[1].data, {
        entity_id: "media_player.living_room",
        shuffle: false,
      });
    });

    it("dispatches repeat_set with validated mode", async () => {
      await setRepeat(mockHass, "media_player.living_room", "all");
      await setRepeat(mockHass, "media_player.living_room", "one");
      await setRepeat(mockHass, "media_player.living_room", "invalid_mode");
      assert.strictEqual(serviceCalls.length, 3);
      assert.strictEqual(serviceCalls[0].data.repeat, "all");
      assert.strictEqual(serviceCalls[1].data.repeat, "one");
      assert.strictEqual(serviceCalls[2].data.repeat, "off");
    });

    it("dispatches select_source", async () => {
      await selectSource(mockHass, "media_player.living_room", "TV Audio");
      await selectSource(mockHass, "media_player.living_room", "");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "select_source",
        data: {
          entity_id: "media_player.living_room",
          source: "TV Audio",
        },
      });
    });

    it("dispatches select_sound_mode", async () => {
      await selectSoundMode(mockHass, "media_player.living_room", "Stereo");
      await selectSoundMode(mockHass, "media_player.living_room", "");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "select_sound_mode",
        data: {
          entity_id: "media_player.living_room",
          sound_mode: "Stereo",
        },
      });
    });

    it("dispatches play_media with and without enqueue option", async () => {
      await playMedia(mockHass, "media_player.living_room", "spotify:track:123", "music");
      await playMedia(mockHass, "media_player.living_room", "spotify:track:456", "music", "next");
      assert.strictEqual(serviceCalls.length, 2);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "play_media",
        data: {
          entity_id: "media_player.living_room",
          media_content_id: "spotify:track:123",
          media_content_type: "music",
        },
      });
      assert.deepStrictEqual(serviceCalls[1], {
        domain: "media_player",
        service: "play_media",
        data: {
          entity_id: "media_player.living_room",
          media_content_id: "spotify:track:456",
          media_content_type: "music",
          enqueue: "next",
        },
      });
    });
  });

  describe("Power Controls", () => {
    it("dispatches turn_on and turn_off", async () => {
      await turnOn(mockHass, "media_player.living_room");
      await turnOff(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 2);
      assert.strictEqual(serviceCalls[0].service, "turn_on");
      assert.strictEqual(serviceCalls[1].service, "turn_off");
    });

    it("dispatches togglePower based on currentState", async () => {
      await togglePower(mockHass, "media_player.living_room", "off");
      await togglePower(mockHass, "media_player.living_room", "playing");
      await togglePower(mockHass, "media_player.living_room", "idle");
      assert.strictEqual(serviceCalls.length, 3);
      assert.strictEqual(serviceCalls[0].service, "turn_on");
      assert.strictEqual(serviceCalls[1].service, "turn_off");
      assert.strictEqual(serviceCalls[2].service, "turn_off");
    });

    it("dispatches mediaToggle (toggle service)", async () => {
      await mediaToggle(mockHass, "media_player.living_room");
      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "toggle",
        data: { entity_id: "media_player.living_room" },
      });
    });
  });

  describe("Volume & Mute Controls", () => {
    it("sets volume clamped between 0 and 1 rounded to 4 decimals", async () => {
      await setVolume(mockHass, "media_player.living_room", 0.3333333);
      await setVolume(mockHass, "media_player.living_room", 1.5);
      await setVolume(mockHass, "media_player.living_room", -0.2);
      await setVolume(mockHass, "media_player.living_room", "not-a-number");

      assert.strictEqual(serviceCalls.length, 3);
      assert.strictEqual(serviceCalls[0].data.volume_level, 0.3333);
      assert.strictEqual(serviceCalls[1].data.volume_level, 1);
      assert.strictEqual(serviceCalls[2].data.volume_level, 0);
    });

    it("steps volume relative to current volume", async () => {
      await stepVolume(mockHass, "media_player.living_room", 0.4, 0.05);
      await stepVolume(mockHass, "media_player.living_room", 0.02, -0.05);

      assert.strictEqual(serviceCalls.length, 2);
      assert.strictEqual(serviceCalls[0].data.volume_level, 0.45);
      assert.strictEqual(serviceCalls[1].data.volume_level, 0);
    });

    it("sets mute state with boolean coercion", async () => {
      await setMute(mockHass, "media_player.living_room", true);
      await setMute(mockHass, "media_player.living_room", 0);

      assert.strictEqual(serviceCalls.length, 2);
      assert.deepStrictEqual(serviceCalls[0].data, {
        entity_id: "media_player.living_room",
        is_volume_muted: true,
      });
      assert.deepStrictEqual(serviceCalls[1].data, {
        entity_id: "media_player.living_room",
        is_volume_muted: false,
      });
    });
  });

  describe("Remote Controls", () => {
    it("sends remote commands", async () => {
      await sendRemoteCommand(mockHass, "remote.living_room", "play");
      await sendRemoteCommand(mockHass, "remote.living_room", ["vol_up", "vol_up"]);
      await sendRemoteCommand(mockHass, "remote.living_room", null);

      assert.strictEqual(serviceCalls.length, 2);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "remote",
        service: "send_command",
        data: {
          entity_id: "remote.living_room",
          command: "play",
        },
      });
      assert.deepStrictEqual(serviceCalls[1].data.command, ["vol_up", "vol_up"]);
    });

    it("sends remote volume steps (volume_up vs volume_down)", async () => {
      await sendRemoteVolumeStep(mockHass, "remote.living_room", 1);
      await sendRemoteVolumeStep(mockHass, "remote.living_room", -1);

      assert.strictEqual(serviceCalls.length, 2);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "remote",
        service: "send_command",
        data: {
          entity_id: "remote.living_room",
          command: "volume_up",
        },
      });
      assert.deepStrictEqual(serviceCalls[1], {
        domain: "remote",
        service: "send_command",
        data: {
          entity_id: "remote.living_room",
          command: "volume_down",
        },
      });
    });
  });

  describe("Speaker Grouping", () => {
    it("joins group members array to master", async () => {
      await joinPlayers(mockHass, "media_player.master", [
        "media_player.kitchen",
        "media_player.bedroom",
      ]);

      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "join",
        data: {
          entity_id: "media_player.master",
          group_members: ["media_player.kitchen", "media_player.bedroom"],
        },
      });
    });

    it("wraps single entity string into group_members array", async () => {
      await joinPlayers(mockHass, "media_player.master", "media_player.kitchen");

      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0].data, {
        entity_id: "media_player.master",
        group_members: ["media_player.kitchen"],
      });
    });

    it("ignores empty or falsy group members", async () => {
      await joinPlayers(mockHass, "media_player.master", []);
      await joinPlayers(mockHass, "media_player.master", [null, ""]);

      assert.strictEqual(serviceCalls.length, 0);
    });

    it("unjoins player from group", async () => {
      await unjoinPlayer(mockHass, "media_player.kitchen");

      assert.strictEqual(serviceCalls.length, 1);
      assert.deepStrictEqual(serviceCalls[0], {
        domain: "media_player",
        service: "unjoin",
        data: {
          entity_id: "media_player.kitchen",
        },
      });
    });
  });

  describe("Error containment and logging", () => {
    it("catches and logs errors without throwing uncaught exceptions", async () => {
      const failingHass = {
        callService: mock.fn(async () => {
          throw new Error("Service call failed");
        }),
      };

      const originalConsoleError = console.error;
      const loggedErrors = [];
      console.error = (...args) => loggedErrors.push(args.join(" "));

      try {
        const result = await mediaPlay(failingHass, "media_player.bad_entity");
        assert.strictEqual(result, undefined);
        assert.strictEqual(loggedErrors.length, 1);
        assert.match(loggedErrors[0], /Error calling media_player\.media_play/);
      } finally {
        console.error = originalConsoleError;
      }
    });
  });
});
