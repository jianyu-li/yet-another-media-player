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
