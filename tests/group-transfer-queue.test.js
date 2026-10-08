import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Setup mock browser globals before importing Lit component
const g = /** @type {any} */ (globalThis);
g.window = globalThis;
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

const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");
const { renderGroupingSheet } = await import("../src/sheets/device-group-sheet.js");

describe("Group Players Menu - Transfer Queue Button", () => {
  /** @type {any} */
  let card;

  beforeEach(() => {
    card = new YetAnotherMediaPlayerCard();
    card._selectedIndex = 0;
    card.setConfig({
      type: "custom:yet-another-media-player",
      entities: ["media_player.living_room", "media_player.kitchen", "media_player.bedroom"],
    });
    card.hass = {
      states: {
        "media_player.living_room": {
          entity_id: "media_player.living_room",
          state: "playing",
          attributes: {
            friendly_name: "Living Room",
            group_members: ["media_player.living_room", "media_player.kitchen"],
            supported_features: 512,
            app_id: "music_assistant",
          },
        },
        "media_player.kitchen": {
          entity_id: "media_player.kitchen",
          state: "playing",
          attributes: {
            friendly_name: "Kitchen",
            supported_features: 512,
            app_id: "music_assistant",
          },
        },
        "media_player.bedroom": {
          entity_id: "media_player.bedroom",
          state: "idle",
          attributes: {
            friendly_name: "Bedroom",
            supported_features: 512,
            app_id: "music_assistant",
          },
        },
      },
      services: {
        music_assistant: {
          transfer_queue: {},
        },
      },
    };
    card._isGroupCapable = () => true;
    card._getGroupingMasterId = () => "media_player.living_room";
    card._getGroupingEntityId = (idx) => card.entityIds[idx];
    card._getGroupKey = (id) => id;
    card._getGroupPlayerState = (id) => ({
      isGroupable: true,
      entityToCheck: id,
      isBusy: false,
      busyLabel: "",
      grouped: false,
      isPrimary: false,
      disabled: false,
      tooltip: "",
    });
    card.getChipName = (id) => card.hass.states[id]?.attributes?.friendly_name || id;
    card._getVolumeEntity = () => null;
    card._hasTransferQueueForCurrent = true;
    card._getActualResolvedMaEntityForState = (idx) => card.entityIds[idx];
  });

  function extractTemplateHtml(val) {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.map(extractTemplateHtml).join("");
    if (val.strings && Array.isArray(val.values)) {
      let result = "";
      val.strings.forEach((str, i) => {
        result += str;
        if (i < val.values.length) {
          result += extractTemplateHtml(val.values[i]);
        }
      });
      return result;
    }
    return "";
  }

  it("renders group-transfer-btn in list mode when MA transfer_queue is supported", () => {
    Object.defineProperty(card, "_isGridMode", { value: false, configurable: true });
    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    const htmlContent = extractTemplateHtml(template);
    assert.ok(
      htmlContent.includes("group-transfer-btn"),
      "Template should contain group-transfer-btn class"
    );
  });

  it("renders spaced out vol-stepper aligned with sliders when volume entity is a remote", () => {
    Object.defineProperty(card, "_isGridMode", { value: false, configurable: true });
    card._getVolumeEntity = (idx) => (idx === 2 ? "remote.bedroom_remote" : null);
    card.hass.states["remote.bedroom_remote"] = {
      entity_id: "remote.bedroom_remote",
      state: "on",
      attributes: { volume_level: 0 },
    };

    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    const htmlContent = extractTemplateHtml(template);
    assert.ok(htmlContent.includes("vol-stepper"), "Template should contain vol-stepper class");
    assert.ok(
      htmlContent.includes("justify-content:space-between"),
      "vol-stepper should have justify-content:space-between to space out minus and plus"
    );
    assert.ok(
      htmlContent.includes("flex:1"),
      "vol-stepper should have flex:1 to match slider container width"
    );
  });

  it("renders grid-menu-transfer-btn in grid mode when MA transfer_queue is supported", () => {
    Object.defineProperty(card, "_isGridMode", { value: true, configurable: true });
    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    const htmlContent = extractTemplateHtml(template);
    assert.ok(
      htmlContent.includes("grid-menu-transfer-btn"),
      "Template should contain grid-menu-transfer-btn class in grid mode"
    );
  });

  it("omits transfer buttons when music_assistant.transfer_queue service is not present", () => {
    card.hass.services = {};
    Object.defineProperty(card, "_isGridMode", { value: false, configurable: true });
    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    const htmlContent = extractTemplateHtml(template);
    assert.strictEqual(
      htmlContent.includes("group-transfer-btn"),
      false,
      "Template should not contain group-transfer-btn when service is missing"
    );
  });

  it("renders status banner when _transferQueueStatus is set", () => {
    card._transferQueueStatus = {
      type: "success",
      message: "Queue sent to Living Room Group.",
    };
    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    // Check that status message is in the values or rendered output
    assert.ok(
      template.values.some(
        (v) =>
          v &&
          typeof v === "object" &&
          "values" in v &&
          Array.isArray(v.values) &&
          v.values.includes("Queue sent to Living Room Group.")
      ) || JSON.stringify(template.values).includes("Queue sent to Living Room Group.")
    );
  });

  it("enables transfer button and routes to group master when target belongs to an external group", () => {
    // Current entity is bedroom (solo)
    card._selectedIndex = 2; // media_player.bedroom
    Object.defineProperty(card, "currentEntityId", {
      get: () => "media_player.bedroom",
      configurable: true,
    });
    card._getGroupingMasterId = () => "media_player.bedroom";

    // Living Room and Kitchen are grouped together in their own group
    card.hass.states["media_player.living_room"].attributes.group_members = [
      "media_player.living_room",
      "media_player.kitchen",
    ];
    card.hass.states["media_player.kitchen"].attributes.group_members = [
      "media_player.living_room",
      "media_player.kitchen",
    ];
    card.hass.states["media_player.bedroom"].attributes.group_members = ["media_player.bedroom"];

    card._getGroupKey = (id) => {
      if (id === "media_player.kitchen") return "media_player.living_room";
      return id;
    };

    // Both Living Room and Kitchen are considered busy for grouping with Bedroom
    card._getGroupPlayerState = (id) => ({
      isGroupable: true,
      entityToCheck: id,
      isBusy: id !== "media_player.bedroom",
      busyLabel: id !== "media_player.bedroom" ? "Unavailable" : "",
      grouped: false,
      isPrimary: id === "media_player.bedroom",
      disabled: id !== "media_player.bedroom",
      tooltip: "",
    });

    const transferState = {
      /** @type {any} */
      target: null,
    };
    card._transferQueueTo = (payload) => {
      transferState.target = payload;
    };

    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    // Find click handlers in template values that correspond to transferQueueTo
    // We can simulate clicking the transfer button on kitchen row
    // In template.values, search for functions that call _transferQueueTo
    const clickFns = [];
    function findFunctions(obj) {
      if (!obj) return;
      if (typeof obj === "function") {
        clickFns.push(obj);
      } else if (Array.isArray(obj)) {
        obj.forEach(findFunctions);
      } else if (typeof obj === "object" && obj.values) {
        findFunctions(obj.values);
      }
    }
    findFunctions(template.values);

    // Call each function and check if _transferQueueTo was invoked with living_room as target
    for (const fn of clickFns) {
      transferState.target = null;
      try {
        fn();
        if (
          transferState.target &&
          transferState.target.entityId === "media_player.living_room" &&
          transferState.target.name.includes("Living Room")
        ) {
          break;
        }
      } catch (_e) {
        // ignore other handlers
      }
    }

    assert.ok(
      transferState.target,
      "Expected transferQueueTo to be called when invoking transfer handler"
    );
    assert.strictEqual(transferState.target.entityId, "media_player.living_room");
    assert.ok(transferState.target.name.includes("Living Room"));
  });

  it("greys out both transfer and group toggle buttons when an entity is unavailable", () => {
    // Living room is current
    card._selectedIndex = 0;
    Object.defineProperty(card, "currentEntityId", {
      get: () => "media_player.living_room",
      configurable: true,
    });
    card._getGroupingMasterId = () => "media_player.living_room";

    // Bedroom is unavailable
    card.hass.states["media_player.bedroom"] = {
      entity_id: "media_player.bedroom",
      state: "unavailable",
      attributes: {
        friendly_name: "Bedroom",
      },
    };

    let transferredCalled = false;
    card._transferQueueTo = () => {
      transferredCalled = true;
    };

    let toggledCalled = false;
    card._toggleGroup = () => {
      toggledCalled = true;
    };

    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    // Extract rendered HTML and verify disabled states are present
    const htmlContent = extractTemplateHtml(template);
    assert.ok(htmlContent.includes("Player is unavailable") || htmlContent.includes("Unavailable"));

    // Find the row for bedroom
    // Find click functions specifically within bedroom's template result
    function findBedroomRow(obj) {
      if (!obj) return null;
      if (typeof obj === "object" && obj.strings && Array.isArray(obj.values)) {
        if (obj.values.some((v) => typeof v === "string" && v.includes("Bedroom"))) {
          return obj;
        }
      }
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const res = findBedroomRow(item);
          if (res) return res;
        }
      } else if (typeof obj === "object" && obj.values) {
        return findBedroomRow(obj.values);
      }
      return null;
    }
    /** @type {any} */
    const bedroomTemplate = findBedroomRow(template.values);

    assert.ok(bedroomTemplate, "Expected to find template row for Bedroom");

    const bedroomClickFns = [];
    function findFunctions(obj) {
      if (!obj) return;
      if (typeof obj === "function") {
        bedroomClickFns.push(obj);
      } else if (Array.isArray(obj)) {
        obj.forEach(findFunctions);
      } else if (typeof obj === "object" && obj.values) {
        findFunctions(obj.values);
      }
    }
    findFunctions(bedroomTemplate.values);

    for (const fn of bedroomClickFns) {
      try {
        fn();
      } catch (_e) {
        // ignore
      }
    }

    // Bedroom transfer queue should not have executed because it is disabled
    assert.strictEqual(
      transferredCalled,
      false,
      "transferQueueTo should not be invoked for unavailable player"
    );
    assert.strictEqual(
      toggledCalled,
      false,
      "toggleGroup should not be invoked for unavailable player"
    );
  });

  it("resolves to main entity when main entity is MA player and music_assistant_entity is non-MA", () => {
    card.setConfig({
      type: "custom:yet-another-media-player",
      entities: [
        {
          entity_id: "media_player.kitchen_homepod_2",
          name: "Kitchen",
          music_assistant_entity: "media_player.kitchen_homepod",
        },
        {
          entity_id: "media_player.white_echo_8",
          name: "Office",
        },
      ],
    });
    card.hass = {
      states: {
        "media_player.kitchen_homepod_2": {
          entity_id: "media_player.kitchen_homepod_2",
          state: "playing",
          attributes: {
            app_id: "music_assistant",
            mass_player_type: "player",
            active_queue: "queue_123",
            group_members: [],
          },
        },
        "media_player.kitchen_homepod": {
          entity_id: "media_player.kitchen_homepod",
          state: "playing",
          attributes: {
            app_id: "com.apple.tvairplayd",
          },
        },
        "media_player.white_echo_8": {
          entity_id: "media_player.white_echo_8",
          state: "idle",
          attributes: {
            app_id: "music_assistant",
            mass_player_type: "player",
            active_queue: "queue_456",
            group_members: [],
          },
        },
      },
    };

    // Test _getActualResolvedMaEntityForState directly
    assert.strictEqual(
      card._getActualResolvedMaEntityForState(0),
      "media_player.kitchen_homepod_2",
      "Should resolve to kitchen_homepod_2 because it is the actual MA entity"
    );
    assert.strictEqual(
      card._getActualResolvedMaEntityForState(1),
      "media_player.white_echo_8",
      "Should resolve to white_echo_8"
    );

    // Test _getGroupingEntityId directly
    assert.strictEqual(
      card._getGroupingEntityId(0),
      "media_player.kitchen_homepod_2",
      "Should resolve grouping entity to kitchen_homepod_2 because kitchen_homepod is not group capable"
    );
  });

  it("correctly routes sourceMaId in transferQueueTo when main entity is the active MA player", async () => {
    card.setConfig({
      type: "custom:yet-another-media-player",
      entities: [
        {
          entity_id: "media_player.kitchen_homepod_2",
          name: "Kitchen",
          music_assistant_entity: "media_player.kitchen_homepod",
        },
        {
          entity_id: "media_player.white_echo_8",
          name: "Office",
        },
      ],
    });
    let serviceCalled = false;
    /** @type {any} */
    let servicePayload = null;
    card.hass = {
      states: {
        "media_player.kitchen_homepod_2": {
          entity_id: "media_player.kitchen_homepod_2",
          state: "playing",
          attributes: {
            app_id: "music_assistant",
            mass_player_type: "player",
            active_queue: "queue_123",
          },
        },
        "media_player.kitchen_homepod": {
          entity_id: "media_player.kitchen_homepod",
          state: "playing",
          attributes: {
            app_id: "com.apple.tvairplayd",
          },
        },
        "media_player.white_echo_8": {
          entity_id: "media_player.white_echo_8",
          state: "idle",
          attributes: {
            app_id: "music_assistant",
            mass_player_type: "player",
            active_queue: "queue_456",
          },
        },
      },
      services: {
        music_assistant: {
          transfer_queue: {
            fields: {
              source_player: {},
            },
          },
        },
      },
      callService: async (domain, service, data) => {
        serviceCalled = true;
        servicePayload = data;
        return { success: true };
      },
    };

    card._selectedIndex = 0;
    const target = {
      index: 1,
      entityId: "media_player.white_echo_8",
      maEntityId: "media_player.white_echo_8",
      name: "Office",
    };

    await card._queueController.transferQueueTo(target);

    assert.strictEqual(serviceCalled, true, "transfer_queue service should be called");
    assert.ok(servicePayload, "servicePayload should not be null");
    assert.strictEqual(
      servicePayload?.source_player,
      "media_player.kitchen_homepod_2",
      "source_player must be kitchen_homepod_2 (the MA player), not kitchen_homepod"
    );
    assert.strictEqual(
      servicePayload?.entity_id,
      "media_player.white_echo_8",
      "target player entity_id must be white_echo_8"
    );
  });

  it("disables transfer button and labels non-MA entity as Standalone when not groupable", () => {
    card.setConfig({
      type: "custom:yet-another-media-player",
      entities: [
        {
          entity_id: "media_player.white_echo_8",
          name: "Office",
        },
        {
          entity_id: "media_player.playstation_5_2",
          name: "PlayStation 5",
        },
      ],
    });
    card.hass = {
      states: {
        "media_player.white_echo_8": {
          entity_id: "media_player.white_echo_8",
          state: "playing",
          attributes: {
            app_id: "music_assistant",
            mass_player_type: "player",
            active_queue: "queue_456",
            group_members: [],
          },
        },
        "media_player.playstation_5_2": {
          entity_id: "media_player.playstation_5_2",
          state: "off",
          attributes: {
            device_class: "receiver",
            friendly_name: "PlayStation 5",
            supported_features: 0,
          },
        },
      },
      services: {
        music_assistant: {
          transfer_queue: {},
        },
      },
    };

    card._selectedIndex = 0; // Office is selected/active
    card._hasTransferQueueForCurrent = true;
    card._isGroupCapable = (st) => Array.isArray(st?.attributes?.group_members);
    card._getGroupingMasterId = () => "media_player.white_echo_8";
    card._getGroupPlayerState = (id) => ({
      isGroupable: id === "media_player.white_echo_8",
      entityToCheck: id,
      isBusy: false,
      busyLabel: "",
      grouped: false,
      isPrimary: id === "media_player.white_echo_8",
      disabled: false,
      tooltip: "",
    });

    const template = renderGroupingSheet.call(card);
    assert.ok(template);

    // Verify PlayStation row rendered with Standalone and disabled transfer button
    function extractTemplateHtml(val) {
      if (!val) return "";
      if (typeof val === "string") return val;
      if (Array.isArray(val)) return val.map(extractTemplateHtml).join("");
      if (val.strings && Array.isArray(val.values)) {
        let result = "";
        val.strings.forEach((str, i) => {
          result += str;
          if (i < val.values.length) {
            result += extractTemplateHtml(val.values[i]);
          }
        });
        return result;
      }
      return "";
    }

    const htmlContent = extractTemplateHtml(template);
    assert.ok(htmlContent.includes("PlayStation 5"), "Should render PlayStation 5 row");
    assert.ok(
      htmlContent.includes("Standalone"),
      "Should display Standalone label for non-MA, non-groupable entity"
    );
    assert.ok(
      htmlContent.includes("Music Assistant player required"),
      "Should have tooltip explaining Music Assistant player required"
    );
  });

  describe("Dedicated Group Players Mode Locking and Navigation", () => {
    it("locks to grouping menu with template: speakers_and_groups", () => {
      const dedicatedCard = new YetAnotherMediaPlayerCard();
      dedicatedCard.setConfig({
        type: "custom:yet-another-media-player",
        template: "speakers_and_groups",
        entities: ["media_player.kitchen", "media_player.office"],
      });

      assert.equal(dedicatedCard._cardType, "group_players");
      assert.equal(dedicatedCard._showEntityOptions, true);
      assert.equal(dedicatedCard._showGrouping, true);
      assert.equal(dedicatedCard._isIdle, false);
    });

    it("locks to grouping menu with template: group_players", () => {
      const dedicatedCard = new YetAnotherMediaPlayerCard();
      dedicatedCard.setConfig({
        type: "custom:yet-another-media-player",
        template: "group_players",
        entities: ["media_player.kitchen", "media_player.office"],
      });

      assert.equal(dedicatedCard._cardType, "group_players");
      assert.equal(dedicatedCard._showEntityOptions, true);
      assert.equal(dedicatedCard._showGrouping, true);
      assert.equal(dedicatedCard._isIdle, false);
    });

    it("preserves backward compatibility with template: dedicated_grouping", () => {
      const dedicatedCard = new YetAnotherMediaPlayerCard();
      dedicatedCard.setConfig({
        type: "custom:yet-another-media-player",
        template: "dedicated_grouping",
        entities: ["media_player.kitchen", "media_player.office"],
      });

      assert.equal(dedicatedCard._cardType, "group_players");
      assert.equal(dedicatedCard._showEntityOptions, true);
      assert.equal(dedicatedCard._showGrouping, true);
      assert.equal(dedicatedCard._isIdle, false);
    });

    it("locks to grouping menu with card_type: speakers_and_groups", () => {
      const dedicatedCard = new YetAnotherMediaPlayerCard();
      dedicatedCard.setConfig({
        type: "custom:yet-another-media-player",
        card_type: "speakers_and_groups",
        entities: ["media_player.kitchen", "media_player.office"],
      });

      assert.equal(dedicatedCard._cardType, "group_players");
      assert.equal(dedicatedCard._showEntityOptions, true);
      assert.equal(dedicatedCard._showGrouping, true);
      assert.equal(dedicatedCard._isIdle, false);
    });

    it("prevents closing grouping menu via _closeGrouping or _closeEntityOptions", () => {
      const dedicatedCard = new YetAnotherMediaPlayerCard();
      dedicatedCard.setConfig({
        type: "custom:yet-another-media-player",
        template: "speakers_and_groups",
        entities: ["media_player.kitchen", "media_player.office"],
      });

      dedicatedCard._closeGrouping();
      assert.equal(dedicatedCard._showGrouping, true);
      assert.equal(dedicatedCard._showEntityOptions, true);

      dedicatedCard._closeEntityOptions();
      assert.equal(dedicatedCard._showGrouping, true);
      assert.equal(dedicatedCard._showEntityOptions, true);

      dedicatedCard._dismissWithAnimation();
      assert.equal(dedicatedCard._showGrouping, true);
      assert.equal(dedicatedCard._showEntityOptions, true);
    });

    it("bypasses idle timeout and maintains grouping view in group_players mode", () => {
      const dedicatedCard = new YetAnotherMediaPlayerCard();
      dedicatedCard.setConfig({
        type: "custom:yet-another-media-player",
        template: "speakers_and_groups",
        entities: ["media_player.kitchen", "media_player.office"],
      });

      dedicatedCard._updateIdleState();
      assert.equal(dedicatedCard._isIdle, false);
      assert.equal(dedicatedCard._showGrouping, true);

      dedicatedCard._handleIdleTimeoutCallback();
      assert.equal(dedicatedCard._isIdle, false);
      assert.equal(dedicatedCard._showGrouping, true);
    });
  });

  describe("Seamless Master Unjoin & Coordinator Handoff", () => {
    /** @type {any} */
    let testCard;
    let servicesCalled;

    beforeEach(() => {
      testCard = new YetAnotherMediaPlayerCard();
      servicesCalled = [];
      testCard.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room", "media_player.kitchen", "media_player.bedroom"],
      });
      testCard.hass = {
        states: {
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "playing",
            attributes: {
              friendly_name: "Living Room",
              group_members: [
                "media_player.living_room",
                "media_player.kitchen",
                "media_player.bedroom",
              ],
              supported_features: 512,
              app_id: "music_assistant",
            },
          },
          "media_player.kitchen": {
            entity_id: "media_player.kitchen",
            state: "playing",
            attributes: {
              friendly_name: "Kitchen",
              group_members: [
                "media_player.living_room",
                "media_player.kitchen",
                "media_player.bedroom",
              ],
              supported_features: 512,
              app_id: "music_assistant",
            },
          },
          "media_player.bedroom": {
            entity_id: "media_player.bedroom",
            state: "playing",
            attributes: {
              friendly_name: "Bedroom",
              group_members: [
                "media_player.living_room",
                "media_player.kitchen",
                "media_player.bedroom",
              ],
              supported_features: 512,
              app_id: "music_assistant",
            },
          },
        },
        services: {
          music_assistant: {
            transfer_queue: {},
          },
          media_player: {
            join: {},
            unjoin: {},
          },
        },
        callService: async (domain, service, data) => {
          servicesCalled.push({ domain, service, data });
          return { success: true };
        },
      };
      testCard._selectedIndex = 0;
      testCard._getGroupingMasterId = () => "media_player.living_room";
      testCard._getGroupingEntityId = (idx) => testCard.entityIds[idx];
      testCard._getGroupKey = (id) => id;
      testCard._hasTransferQueueForCurrent = true;
      testCard._getActualResolvedMaEntityForState = (idx) => testCard.entityIds[idx];
      testCard._isGroupCapable = () => true;
      testCard.getChipName = (id) => testCard.hass.states[id]?.attributes?.friendly_name || id;
    });

    it("unjoins master by transferring queue to successor, unjoining master, and joining remaining members", async () => {
      /** @type {any} */
      let transferPayload = null;
      testCard._transferQueueTo = async (payload) => {
        transferPayload = payload;
        testCard._transferQueueStatus = { type: "success" };
      };

      await testCard._toggleGroup("media_player.living_room");

      // Verify queue was transferred to Kitchen (the first follower)
      assert.ok(transferPayload, "transferQueueTo should be called");
      assert.strictEqual(transferPayload.entityId, "media_player.kitchen");

      // Verify former master coordinator was not unjoined via service call (not supported / unnecessary)
      const unjoinCalls = servicesCalled.filter(
        (s) => s.domain === "media_player" && s.service === "unjoin"
      );
      assert.strictEqual(unjoinCalls.length, 0, "Former coordinator should not have unjoin called");

      // Verify remaining member (Bedroom) was joined to new master (Kitchen)
      const joinCalls = servicesCalled.filter(
        (s) => s.domain === "media_player" && s.service === "join"
      );
      assert.strictEqual(joinCalls.length, 1);
      assert.strictEqual(joinCalls[0].data.entity_id, "media_player.kitchen");
      assert.deepStrictEqual(joinCalls[0].data.group_members, ["media_player.bedroom"]);

      // Verify new master is tracked
      assert.strictEqual(testCard._lastGroupingMasterId, "media_player.kitchen");
    });

    it("does not unjoin master when music_assistant.transfer_queue service is unavailable (native HA/Sonos fallback)", async () => {
      delete testCard.hass.services.music_assistant.transfer_queue;
      let transferCalled = false;
      testCard._transferQueueTo = async () => {
        transferCalled = true;
      };

      await testCard._toggleGroup("media_player.living_room");

      assert.strictEqual(transferCalled, false, "Should not transfer queue without service");
      const unjoinCalls = servicesCalled.filter(
        (s) => s.domain === "media_player" && s.service === "unjoin"
      );
      assert.strictEqual(unjoinCalls.length, 0, "Should not unjoin master without transfer_queue");
    });

    it("does not unjoin master when only one speaker is playing (sole player)", async () => {
      testCard.hass.states["media_player.living_room"].attributes.group_members = [
        "media_player.living_room",
      ];
      let transferCalled = false;
      testCard._transferQueueTo = async () => {
        transferCalled = true;
      };

      await testCard._toggleGroup("media_player.living_room");

      assert.strictEqual(transferCalled, false, "Should not transfer queue when sole player");
      assert.strictEqual(servicesCalled.length, 0, "No services should be called");
    });

    it("_ungroupAll unjoins followers only and excludes the master coordinator", async () => {
      await testCard._ungroupAll();
      const unjoinCalls = servicesCalled.filter(
        (s) => s.domain === "media_player" && s.service === "unjoin"
      );
      assert.strictEqual(unjoinCalls.length, 2);
      assert.deepStrictEqual(
        unjoinCalls.map((c) => c.data.entity_id),
        ["media_player.kitchen", "media_player.bedroom"]
      );
    });

    it("greys out button for sole playing player and enables join for other players", () => {
      testCard.hass.states["media_player.living_room"].attributes.group_members = [
        "media_player.living_room",
      ];
      Object.defineProperty(testCard, "_isGridMode", { value: false, configurable: true });

      const template = renderGroupingSheet.call(testCard);
      assert.ok(template);
      const htmlContent = extractTemplateHtml(template);

      // Living Room toggle button should be disabled
      assert.ok(htmlContent.includes("opacity: 0.35"));
    });

    it("removes Master vs Joined distinction in multi-speaker group state labels", () => {
      Object.defineProperty(testCard, "_isGridMode", { value: false, configurable: true });

      const template = renderGroupingSheet.call(testCard);
      assert.ok(template);
      const htmlContent = extractTemplateHtml(template);

      // State label should say "Joined", not "Master"
      assert.strictEqual(htmlContent.includes("Master"), false, "Should not render Master label");
      assert.ok(htmlContent.includes("Joined"), "Should render Joined label");
    });

    it("uses mdi:speaker-multiple in grid mode without mdi:star", () => {
      Object.defineProperty(testCard, "_isGridMode", { value: true, configurable: true });

      const template = renderGroupingSheet.call(testCard);
      assert.ok(template);
      const htmlContent = extractTemplateHtml(template);

      assert.strictEqual(htmlContent.includes("mdi:star"), false, "Should not render mdi:star");
      assert.ok(
        htmlContent.includes("mdi:speaker-multiple"),
        "Should render mdi:speaker-multiple for grouped players"
      );
    });

    it("computes disabled and seamless unjoin states in _getGroupPlayerState", () => {
      // Living Room (master) with Kitchen in group
      const masterState = testCard.hass.states["media_player.living_room"];
      const stateLiving = testCard._getGroupPlayerState(
        "media_player.living_room",
        "media_player.living_room",
        "media_player.living_room",
        masterState,
        "media_player.living_room"
      );
      assert.strictEqual(stateLiving.disabled, false, "Master can unjoin when grouped with MA");
      assert.strictEqual(stateLiving.grouped, true, "Master is active in group");

      // Now test solo player
      masterState.attributes.group_members = ["media_player.living_room"];
      const stateSolo = testCard._getGroupPlayerState(
        "media_player.living_room",
        "media_player.living_room",
        "media_player.living_room",
        masterState,
        "media_player.living_room"
      );
      assert.strictEqual(stateSolo.disabled, true, "Sole player button must be disabled");
    });

    it("resolves group-capable main entity when candidate music_assistant_entity lacks group support", async () => {
      const card = new YetAnotherMediaPlayerCard();
      const calls = [];
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: [
          { entity_id: "media_player.white_echo_8", name: "Office" },
          {
            entity_id: "media_player.kitchen_homepod_2",
            name: "Kitchen",
            music_assistant_entity: "media_player.kitchen_homepod",
          },
        ],
      });
      card.hass = {
        states: {
          "media_player.white_echo_8": {
            entity_id: "media_player.white_echo_8",
            state: "idle",
            attributes: {
              friendly_name: "White Echo 8",
              group_members: [],
              supported_features: 8320575,
              app_id: "music_assistant",
            },
          },
          "media_player.kitchen_homepod_2": {
            entity_id: "media_player.kitchen_homepod_2",
            state: "idle",
            attributes: {
              friendly_name: "Kitchen Homepod",
              group_members: [],
              supported_features: 8320575,
              app_id: "music_assistant",
            },
          },
          "media_player.kitchen_homepod": {
            entity_id: "media_player.kitchen_homepod",
            state: "idle",
            attributes: {
              friendly_name: "Kitchen Homepod Apple TV",
              supported_features: 448439, // No group support
            },
          },
        },
        services: {
          music_assistant: { transfer_queue: {} },
          media_player: { join: {}, unjoin: {} },
        },
        callService: (domain, service, data) => {
          calls.push({ domain, service, data });
          return Promise.resolve();
        },
      };

      // Office is active master
      assert.strictEqual(card._getGroupingMasterId(), "media_player.white_echo_8");

      // Verify _resolveGroupingEntityId returns media_player.kitchen_homepod_2 (not kitchen_homepod)
      const kitchenObj = card.entityObjs?.[1];
      const resolved = card._resolveGroupingEntityId(kitchenObj, "media_player.kitchen_homepod_2");
      assert.strictEqual(resolved, "media_player.kitchen_homepod_2");

      // Clicking toggle on Kitchen from Office should call join with kitchen_homepod_2
      await card._toggleGroup("media_player.kitchen_homepod_2");
      assert.strictEqual(calls.length, 1);
      assert.strictEqual(calls[0].domain, "media_player");
      assert.strictEqual(calls[0].service, "join");
      assert.strictEqual(calls[0].data.entity_id, "media_player.white_echo_8");
      assert.deepStrictEqual(calls[0].data.group_members, ["media_player.kitchen_homepod_2"]);
    });

    describe("Grouped Players Visual Card Containers", () => {
      it("renders grouped-players-card enclosing grouped players with header and badge in list mode", () => {
        Object.defineProperty(testCard, "_isGridMode", { value: false, configurable: true });
        // Living Room & Kitchen are grouped together, Bedroom is standalone
        testCard.hass.states["media_player.living_room"].attributes.group_members = [
          "media_player.living_room",
          "media_player.kitchen",
        ];
        testCard.hass.states["media_player.kitchen"].attributes.group_members = [
          "media_player.living_room",
          "media_player.kitchen",
        ];
        testCard.hass.states["media_player.bedroom"].attributes.group_members = [];

        testCard._getGroupKey = (id) =>
          id === "media_player.kitchen" ? "media_player.living_room" : id;

        const template = renderGroupingSheet.call(testCard);
        assert.ok(template);
        const htmlContent = extractTemplateHtml(template);

        assert.ok(
          htmlContent.includes("grouped-players-card"),
          "Should render grouped-players-card container"
        );
        assert.ok(
          htmlContent.includes("is-current-group"),
          "Active group should have is-current-group class"
        );
        assert.ok(htmlContent.includes("grouped-card-header"), "Should render grouped-card-header");
        assert.ok(
          htmlContent.includes("Living Room Group"),
          "Should render group label based on master entity name"
        );
        assert.ok(
          htmlContent.includes("grouped-card-badge"),
          "Should render badge for current group"
        );
      });

      it("renders grid-group-card enclosing grouped players in grid mode", () => {
        Object.defineProperty(testCard, "_isGridMode", { value: true, configurable: true });
        testCard.hass.states["media_player.living_room"].attributes.group_members = [
          "media_player.living_room",
          "media_player.kitchen",
        ];
        testCard.hass.states["media_player.kitchen"].attributes.group_members = [
          "media_player.living_room",
          "media_player.kitchen",
        ];
        testCard.hass.states["media_player.bedroom"].attributes.group_members = [];

        testCard._getGroupKey = (id) =>
          id === "media_player.kitchen" ? "media_player.living_room" : id;

        const template = renderGroupingSheet.call(testCard);
        assert.ok(template);
        const htmlContent = extractTemplateHtml(template);

        assert.ok(
          htmlContent.includes("grid-group-card"),
          "Should render grid-group-card container in grid mode"
        );
        assert.ok(
          htmlContent.includes("grid-group-card-items"),
          "Should render grid-group-card-items subgrid"
        );
        assert.ok(
          htmlContent.includes("grid-menu-items"),
          "Should render grid-menu-items for standalone players"
        );
      });

      it("does not render grouped card boxes when no players are grouped", () => {
        Object.defineProperty(testCard, "_isGridMode", { value: false, configurable: true });
        testCard.hass.states["media_player.living_room"].attributes.group_members = [
          "media_player.living_room",
        ];
        testCard.hass.states["media_player.kitchen"].attributes.group_members = [];
        testCard.hass.states["media_player.bedroom"].attributes.group_members = [];

        testCard._getGroupKey = (id) => id;

        const template = renderGroupingSheet.call(testCard);
        assert.ok(template);
        const htmlContent = extractTemplateHtml(template);

        assert.strictEqual(
          htmlContent.includes("grouped-players-card"),
          false,
          "Should not render grouped-players-card when all players are solo"
        );
        assert.strictEqual(
          htmlContent.includes("grid-group-card"),
          false,
          "Should not render grid-group-card when all players are solo"
        );
        assert.strictEqual(
          htmlContent.includes("grouped-card-header"),
          false,
          "Should not render grouped-card-header when all players are solo"
        );
      });

      it("renders multiple distinct group card boxes when multiple groups exist in the house", () => {
        const multiCard = new YetAnotherMediaPlayerCard();
        multiCard.setConfig({
          type: "custom:yet-another-media-player",
          entities: [
            "media_player.living_room",
            "media_player.kitchen",
            "media_player.bedroom",
            "media_player.office",
          ],
        });
        multiCard._selectedIndex = 0; // Living Room is current
        multiCard.hass = {
          states: {
            "media_player.living_room": {
              entity_id: "media_player.living_room",
              state: "playing",
              attributes: {
                friendly_name: "Living Room",
                group_members: ["media_player.living_room", "media_player.kitchen"],
                supported_features: 512,
                app_id: "music_assistant",
              },
            },
            "media_player.kitchen": {
              entity_id: "media_player.kitchen",
              state: "playing",
              attributes: {
                friendly_name: "Kitchen",
                supported_features: 512,
                app_id: "music_assistant",
              },
            },
            "media_player.bedroom": {
              entity_id: "media_player.bedroom",
              state: "playing",
              attributes: {
                friendly_name: "Bedroom",
                group_members: ["media_player.bedroom", "media_player.office"],
                supported_features: 512,
                app_id: "music_assistant",
              },
            },
            "media_player.office": {
              entity_id: "media_player.office",
              state: "playing",
              attributes: {
                friendly_name: "Office",
                supported_features: 512,
                app_id: "music_assistant",
              },
            },
          },
          services: {
            music_assistant: { transfer_queue: {} },
          },
        };
        multiCard._isGroupCapable = () => true;
        multiCard._getGroupingMasterId = () => "media_player.living_room";
        multiCard._getGroupingEntityId = (idx) => multiCard.entityIds[idx];
        multiCard._getGroupKey = (id) => {
          if (id === "media_player.kitchen") return "media_player.living_room";
          if (id === "media_player.office") return "media_player.bedroom";
          return id;
        };
        multiCard._getGroupPlayerState = (id) => ({
          isGroupable: true,
          entityToCheck: id,
          isBusy: id === "media_player.bedroom" || id === "media_player.office",
          busyLabel: id === "media_player.bedroom" || id === "media_player.office" ? "Joined" : "",
          grouped: id === "media_player.kitchen" || id === "media_player.living_room",
          isPrimary: id === "media_player.living_room",
          disabled: false,
          tooltip: "",
        });
        multiCard.getChipName = (id) => multiCard.hass.states[id]?.attributes?.friendly_name || id;
        multiCard._getVolumeEntity = () => null;
        multiCard._hasTransferQueueForCurrent = true;
        multiCard._getActualResolvedMaEntityForState = (idx) => multiCard.entityIds[idx];
        Object.defineProperty(multiCard, "_isGridMode", { value: false, configurable: true });

        const template = renderGroupingSheet.call(multiCard);
        assert.ok(template);
        const htmlContent = extractTemplateHtml(template);

        // Verify both group cards are rendered
        assert.ok(
          htmlContent.includes("Living Room Group"),
          "Should render Living Room Group card"
        );
        assert.ok(htmlContent.includes("Bedroom Group"), "Should render Bedroom Group card");

        // Verify Living Room Group has is-current-group while Bedroom Group does not
        const livingRoomGroupIdx = htmlContent.indexOf("Living Room Group");
        const bedroomGroupIdx = htmlContent.indexOf("Bedroom Group");
        assert.ok(
          livingRoomGroupIdx < bedroomGroupIdx,
          "Active group (Living Room Group) should be rendered before Bedroom Group"
        );
      });
    });
  });
});
