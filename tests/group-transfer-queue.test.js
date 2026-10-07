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
          v.values &&
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
      tooltip: "",
    });

    let transferredTarget = null;
    card._transferQueueTo = (payload) => {
      transferredTarget = payload;
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
      transferredTarget = null;
      try {
        fn();
        if (
          transferredTarget &&
          transferredTarget.entityId === "media_player.living_room" &&
          transferredTarget.name.includes("Living Room")
        ) {
          break;
        }
      } catch (_e) {
        // ignore other handlers
      }
    }

    assert.ok(
      transferredTarget,
      "Expected transferQueueTo to be called when invoking transfer handler"
    );
    assert.strictEqual(transferredTarget.entityId, "media_player.living_room");
    assert.ok(transferredTarget.name.includes("Living Room"));
  });
});
