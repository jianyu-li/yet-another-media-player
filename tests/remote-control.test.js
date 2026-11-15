import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Setup mock browser globals before importing Lit component
const g = /** @type {any} */ (globalThis);
g.window = globalThis;
g.customElements = { define() {} };
class MockHTMLElement {
  attachShadow() {
    return {};
  }
}
g.HTMLElement = MockHTMLElement;
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");
const { resolveRemoteCommand } = await import("../src/yamp-utils.js");
const { ANDROIDTV_REMOTE_COMMAND_MAP } = await import("../src/constants.js");

describe("Remote Control Overlay & Methods", () => {
  let card;
  let serviceCalls;

  beforeEach(() => {
    card = new YetAnotherMediaPlayerCard();
    card._selectedIndex = 0;
    serviceCalls = [];

    card.hass = {
      states: {
        "media_player.living_room_tv": {
          entity_id: "media_player.living_room_tv",
          state: "on",
          attributes: {
            friendly_name: "Living Room TV",
          },
        },
        "remote.living_room_tv": {
          entity_id: "remote.living_room_tv",
          state: "on",
          attributes: {
            friendly_name: "Living Room TV Remote",
          },
        },
        "media_player.bedroom_speaker": {
          entity_id: "media_player.bedroom_speaker",
          state: "idle",
          attributes: {
            friendly_name: "Bedroom Speaker",
          },
        },
        "remote.custom_remote": {
          entity_id: "remote.custom_remote",
          state: "on",
          attributes: {
            friendly_name: "Custom Remote",
          },
        },
      },
      callService: (domain, service, data) => {
        serviceCalls.push({ domain, service, data });
      },
    };

    card.config = {
      entities: [
        {
          entity_id: "media_player.living_room_tv",
        },
      ],
    };
  });

  describe("_getRemoteControlEntity", () => {
    it("auto-discovers remote.<name> when media_player.<name> has matching remote", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.living_room_tv" }],
      };
      assert.equal(card._getRemoteControlEntity(), "remote.living_room_tv");
    });

    it("returns explicit remote_entity when configured on the entity object", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.bedroom_speaker",
            remote_entity: "remote.custom_remote",
          },
        ],
      };
      assert.equal(card._getRemoteControlEntity(), "remote.custom_remote");
    });

    it("returns the entity itself when currentEntityId starts with remote.", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "remote.custom_remote" }],
      };
      assert.equal(card._getRemoteControlEntity(), "remote.custom_remote");
    });

    it("returns null in strict mode when no remote entity is available", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.bedroom_speaker" }],
      };
      assert.equal(card._getRemoteControlEntity(), null);
      assert.equal(card._getRemoteControlEntity(true), null);
    });

    it("returns fallback currentId only when strict is explicitly false", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.bedroom_speaker" }],
      };
      assert.equal(card._getRemoteControlEntity(false), "media_player.bedroom_speaker");
    });
  });

  describe("_hasRemoteControlSupport", () => {
    it("returns true when candidate remote exists in hass.states", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.living_room_tv" }],
      };
      assert.equal(card._hasRemoteControlSupport(), true);
    });

    it("returns true when remote_entity is explicitly configured", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.bedroom_speaker",
            remote_entity: "remote.custom_remote",
          },
        ],
      };
      assert.equal(card._hasRemoteControlSupport(), true);
    });

    it("returns false when remote_entity is explicitly false", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_entity: false,
          },
        ],
      };
      assert.equal(card._hasRemoteControlSupport(), false);
    });

    it("returns false when entity has no associated remote", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.bedroom_speaker" }],
      };
      assert.equal(card._hasRemoteControlSupport(), false);
    });
  });

  describe("_sendRemoteCommand", () => {
    it("calls remote.send_command with the discovered remote entity", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.living_room_tv" }],
      };

      card._sendRemoteCommand("up");

      assert.equal(serviceCalls.length, 1);
      assert.deepEqual(serviceCalls[0], {
        domain: "remote",
        service: "send_command",
        data: {
          entity_id: "remote.living_room_tv",
          command: "up",
        },
      });
    });

    it("safely does nothing if no remote entity is available", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.bedroom_speaker" }],
      };

      card._sendRemoteCommand("select");

      assert.equal(serviceCalls.length, 0);
    });

    it("maps navigation commands to DPAD keycodes for androidtv_remote entities", () => {
      card._selectedIndex = 0;
      card.hass.entities = {
        "remote.living_room_tv": {
          entity_id: "remote.living_room_tv",
          platform: "androidtv_remote",
        },
      };
      card.config = {
        entities: [{ entity_id: "media_player.living_room_tv" }],
      };

      const testCases = [
        { input: "up", expected: "DPAD_UP" },
        { input: "down", expected: "DPAD_DOWN" },
        { input: "left", expected: "DPAD_LEFT" },
        { input: "right", expected: "DPAD_RIGHT" },
        { input: "select", expected: "DPAD_CENTER" },
        { input: "back", expected: "BACK" },
        { input: "home", expected: "HOME" },
        { input: "menu", expected: "MENU" },
      ];

      for (const { input, expected } of testCases) {
        serviceCalls = [];
        card._sendRemoteCommand(input);
        assert.equal(serviceCalls.length, 1);
        assert.deepEqual(serviceCalls[0], {
          domain: "remote",
          service: "send_command",
          data: {
            entity_id: "remote.living_room_tv",
            command: expected,
          },
        });
      }
    });

    it("maps commands for androidtv_remote when platform is declared on entity config", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_platform: "androidtv_remote",
          },
        ],
      };

      card._sendRemoteCommand("up");
      assert.equal(serviceCalls.length, 1);
      assert.equal(serviceCalls[0].data.command, "DPAD_UP");
    });

    it("allows custom remote_commands overrides on entity config", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_commands: {
              up: "CUSTOM_UP",
              select: "CUSTOM_SELECT",
            },
          },
        ],
      };

      card._sendRemoteCommand("up");
      card._sendRemoteCommand("select");
      card._sendRemoteCommand("down");

      assert.equal(serviceCalls.length, 3);
      assert.equal(serviceCalls[0].data.command, "CUSTOM_UP");
      assert.equal(serviceCalls[1].data.command, "CUSTOM_SELECT");
      assert.equal(serviceCalls[2].data.command, "down");
    });

    it("allows custom remote_commands overrides on card config", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.living_room_tv" }],
        remote_commands: {
          home: "CUSTOM_HOME",
        },
      };

      card._sendRemoteCommand("home");
      assert.equal(serviceCalls.length, 1);
      assert.equal(serviceCalls[0].data.command, "CUSTOM_HOME");
    });

    it("resolves JS templates for remote_platform", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_platform: "[[[ return 'androidtv_remote'; ]]]",
          },
        ],
      };
      card._sendRemoteCommand("up");
      assert.equal(serviceCalls.length, 1);
      assert.equal(serviceCalls[0].data.command, "DPAD_UP");
    });

    it("resolves sync Jinja2 templates for remote_platform", () => {
      card._selectedIndex = 0;
      card.hass.states["input_text.remote_plat"] = {
        entity_id: "input_text.remote_plat",
        state: "androidtv_remote",
        attributes: {},
      };
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_platform: "{{ states('input_text.remote_plat') }}",
          },
        ],
      };
      card._sendRemoteCommand("select");
      assert.equal(serviceCalls.length, 1);
      assert.equal(serviceCalls[0].data.command, "DPAD_CENTER");
    });

    it("resolves JS object templates in remote_commands", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_commands: "[[[ return { up: 'JS_OBJ_UP' }; ]]]",
          },
        ],
      };
      card._sendRemoteCommand("up");
      assert.equal(serviceCalls.length, 1);
      assert.equal(serviceCalls[0].data.command, "JS_OBJ_UP");
    });

    it("resolves per-key templates in remote_commands", () => {
      card._selectedIndex = 0;
      card.hass.states["input_text.select_cmd"] = {
        entity_id: "input_text.select_cmd",
        state: "KEY_OK",
        attributes: {},
      };
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_commands: {
              up: "[[[ return 'PER_KEY_JS_UP'; ]]]",
              select: "{{ states('input_text.select_cmd') }}",
            },
          },
        ],
      };
      card._sendRemoteCommand("up");
      card._sendRemoteCommand("select");
      assert.equal(serviceCalls.length, 2);
      assert.equal(serviceCalls[0].data.command, "PER_KEY_JS_UP");
      assert.equal(serviceCalls[1].data.command, "KEY_OK");
    });

    it("resolves complex async Jinja2 templates for remote_platform and remote_commands", async () => {
      card._selectedIndex = 0;
      card.hass.callApi = async (_method, _path, payload) => {
        if (payload.template.includes("androidtv_remote")) return "androidtv_remote";
        if (payload.template.includes("ASYNC_BACK")) return "ASYNC_BACK";
        return "";
      };

      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            remote_platform: "{% if true %}androidtv_remote{% endif %}",
            remote_commands: {
              back: "{% if true %}ASYNC_BACK{% endif %}",
            },
          },
        ],
      };

      card._sendRemoteCommand("up");
      await new Promise((r) => setTimeout(r, 0));
      assert.equal(serviceCalls.length, 1);
      assert.equal(serviceCalls[0].data.command, "DPAD_UP");

      serviceCalls = [];
      card._sendRemoteCommand("back");
      await new Promise((r) => setTimeout(r, 0));
      assert.equal(serviceCalls.length, 1);
      assert.equal(serviceCalls[0].data.command, "ASYNC_BACK");
    });
  });

  describe("resolveRemoteCommand pure function", () => {
    it("exports ANDROIDTV_REMOTE_COMMAND_MAP with expected DPAD values", () => {
      assert.equal(ANDROIDTV_REMOTE_COMMAND_MAP.up, "DPAD_UP");
      assert.equal(ANDROIDTV_REMOTE_COMMAND_MAP.down, "DPAD_DOWN");
      assert.equal(ANDROIDTV_REMOTE_COMMAND_MAP.left, "DPAD_LEFT");
      assert.equal(ANDROIDTV_REMOTE_COMMAND_MAP.right, "DPAD_RIGHT");
      assert.equal(ANDROIDTV_REMOTE_COMMAND_MAP.select, "DPAD_CENTER");
    });

    it("returns command unchanged when no platform or overrides match", () => {
      assert.equal(resolveRemoteCommand("up"), "up");
      assert.equal(resolveRemoteCommand("select", "remote.apple_tv"), "select");
    });

    it("maps all standard commands for androidtv_remote", () => {
      assert.equal(
        resolveRemoteCommand("up", "remote.tv", null, { platform: "androidtv_remote" }),
        "DPAD_UP"
      );
      assert.equal(
        resolveRemoteCommand("down", "remote.tv", null, { platform: "androidtv_remote" }),
        "DPAD_DOWN"
      );
      assert.equal(
        resolveRemoteCommand("left", "remote.tv", null, { platform: "androidtv_remote" }),
        "DPAD_LEFT"
      );
      assert.equal(
        resolveRemoteCommand("right", "remote.tv", null, { platform: "androidtv_remote" }),
        "DPAD_RIGHT"
      );
      assert.equal(
        resolveRemoteCommand("select", "remote.tv", null, { platform: "androidtv_remote" }),
        "DPAD_CENTER"
      );
      assert.equal(
        resolveRemoteCommand("back", "remote.tv", null, { platform: "androidtv_remote" }),
        "BACK"
      );
      assert.equal(
        resolveRemoteCommand("home", "remote.tv", null, { platform: "androidtv_remote" }),
        "HOME"
      );
      assert.equal(
        resolveRemoteCommand("menu", "remote.tv", null, { platform: "androidtv_remote" }),
        "MENU"
      );
    });

    it("prioritizes custom command overrides over platform defaults", () => {
      const res = resolveRemoteCommand("up", "remote.tv", null, {
        platform: "androidtv_remote",
        customCommands: { up: "CUSTOM_OVERRIDE" },
      });
      assert.equal(res, "CUSTOM_OVERRIDE");
    });

    it("handles JSON string custom commands gracefully", () => {
      const res = resolveRemoteCommand("select", "remote.tv", null, {
        customCommands: '{"select": "CONFIRM"}',
      });
      assert.equal(res, "CONFIRM");

      const resWithApostrophe = resolveRemoteCommand("menu", "remote.tv", null, {
        customCommands: '{"menu": "TV\'s Menu"}',
      });
      assert.equal(resWithApostrophe, "TV's Menu");
    });

    it("falls back to currentEntityId platform in hass.entities and normalizes platform string", () => {
      const mockHass = {
        entities: {
          "media_player.salon": {
            entity_id: "media_player.salon",
            platform: "androidtv_remote",
          },
        },
      };
      assert.equal(
        resolveRemoteCommand("up", "remote.missing_from_registry", mockHass, {
          currentEntityId: "media_player.salon",
        }),
        "DPAD_UP"
      );
      assert.equal(
        resolveRemoteCommand("left", "remote.tv", null, {
          platform: " AndroidTV_Remote ",
        }),
        "DPAD_LEFT"
      );
    });
  });

  describe("_getHiddenRemoteButtons", () => {
    it("parses array of hidden buttons from entity configuration", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [
          {
            entity_id: "media_player.living_room_tv",
            hide_remote_buttons: ["power", "home"],
          },
        ],
      };
      assert.deepEqual(card._getHiddenRemoteButtons(), ["power", "home"]);
    });

    it("parses comma-separated string from card config", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.living_room_tv" }],
        hide_remote_buttons: "power, menu",
      };
      assert.deepEqual(card._getHiddenRemoteButtons(), ["power", "menu"]);
    });

    it("returns empty array by default", () => {
      card._selectedIndex = 0;
      card.config = {
        entities: [{ entity_id: "media_player.living_room_tv" }],
      };
      assert.deepEqual(card._getHiddenRemoteButtons(), []);
    });
  });
});
