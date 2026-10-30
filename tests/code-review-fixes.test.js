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

import { TEMPLATE_SUPPORTED_FIELDS, isFieldTemplateSupported } from "../src/config-schema.js";
import { TemplateController } from "../src/controllers/template-controller.js";

const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");
const { renderMainMenu } = await import("../src/sheets/options-sheet.js");
const { localize } = await import("../src/localize/localize.js");

describe("2026.11.0 Code Review Fixes", () => {
  describe("TEMPLATE_SUPPORTED_FIELDS in config-schema", () => {
    it("is frozen to prevent accidental modification", () => {
      assert.equal(Object.isFrozen(TEMPLATE_SUPPORTED_FIELDS), true);
    });

    it("includes always_collapsed, control_layout, music_assistant_entity, volume_entity, and remote_entity", () => {
      const requiredFields = [
        "always_collapsed",
        "control_layout",
        "music_assistant_entity",
        "volume_entity",
        "remote_entity",
      ];

      for (const field of requiredFields) {
        assert.ok(
          TEMPLATE_SUPPORTED_FIELDS.has(field),
          `TEMPLATE_SUPPORTED_FIELDS should contain "${field}"`
        );
        assert.equal(
          isFieldTemplateSupported(field),
          true,
          `isFieldTemplateSupported("${field}") should return true`
        );
      }
    });

    it("returns false for unsupported fields", () => {
      assert.equal(isFieldTemplateSupported("unsupported_field"), false);
      assert.equal(isFieldTemplateSupported("card_type"), false);
      assert.equal(isFieldTemplateSupported("entity_id"), false);
    });
  });

  describe("TemplateController.prototype.resolveTemplateAtActionTime", () => {
    const jsTemplate =
      "[[[ return current === 'media_player.kitchen' ? 'media_player.ma_kitchen' : 'media_player.other'; ]]]";
    const fallbackEntityId = "media_player.fallback";

    /**
     * @param {Record<string, any>} [context]
     * @returns {any}
     */
    const createMockHost = (context = {}) => ({
      addController() {},
      hass: { states: {} },
      _getTemplateContext() {
        return context;
      },
    });

    it("evaluates JS template using context from host._getTemplateContext() when 3rd param omitted", async () => {
      const hostKitchen = /** @type {any} */ (createMockHost({ current: "media_player.kitchen" }));
      const ctrlKitchen = new TemplateController(hostKitchen);

      const resolvedKitchen = await ctrlKitchen.resolveTemplateAtActionTime(
        jsTemplate,
        fallbackEntityId
      );
      assert.equal(resolvedKitchen, "media_player.ma_kitchen");

      const hostOther = /** @type {any} */ (
        createMockHost({ current: "media_player.living_room" })
      );
      const ctrlOther = new TemplateController(hostOther);

      const resolvedOther = await ctrlOther.resolveTemplateAtActionTime(
        jsTemplate,
        fallbackEntityId
      );
      assert.equal(resolvedOther, "media_player.other");
    });

    it("forwards explicit context 3rd parameter overriding host._getTemplateContext()", async () => {
      // Host returns living_room by default
      const host = /** @type {any} */ (createMockHost({ current: "media_player.living_room" }));
      const ctrl = new TemplateController(host);

      // Explicitly passing kitchen context should evaluate to kitchen MA entity
      const resolvedExplicitKitchen = await ctrl.resolveTemplateAtActionTime(
        jsTemplate,
        fallbackEntityId,
        { current: "media_player.kitchen" }
      );
      assert.equal(resolvedExplicitKitchen, "media_player.ma_kitchen");

      // Explicitly passing bedroom context should evaluate to other
      const resolvedExplicitOther = await ctrl.resolveTemplateAtActionTime(
        jsTemplate,
        fallbackEntityId,
        { current: "media_player.bedroom" }
      );
      assert.equal(resolvedExplicitOther, "media_player.other");
    });

    it("returns fallback entity when client-side JS template throws or produces invalid entity", async () => {
      const host = /** @type {any} */ (createMockHost({}));
      const ctrl = new TemplateController(host);

      const origWarn = console.warn;
      console.warn = () => {};
      try {
        const throwingTemplate = "[[[ return nonExistentVariable.foo; ]]]";
        const resolvedFallback = await ctrl.resolveTemplateAtActionTime(
          throwingTemplate,
          fallbackEntityId
        );
        assert.equal(resolvedFallback, fallbackEntityId);
      } finally {
        console.warn = origWarn;
      }

      const invalidEntityTemplate = "[[[ return 'invalid_without_domain'; ]]]";
      const resolvedInvalid = await ctrl.resolveTemplateAtActionTime(
        invalidEntityTemplate,
        fallbackEntityId
      );
      assert.equal(resolvedInvalid, fallbackEntityId);
    });
  });

  describe("Full-screen menu item alias support in YetAnotherMediaPlayerCard", () => {
    let card;

    beforeEach(() => {
      card = /** @type {any} */ (new YetAnotherMediaPlayerCard());
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room"],
      });
      card.hass = {
        states: {
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "playing",
            attributes: {},
          },
        },
      };
    });

    describe("_getActionLabel", () => {
      it("supports full_screen, fullscreen, and full-screen when not in full-screen mode", () => {
        card._fullScreenOverride = false;
        const expectedLabel = localize("card.menu.full_screen");

        assert.equal(card._getActionLabel({ menu_item: "full_screen" }), expectedLabel);
        assert.equal(card._getActionLabel({ menu_item: "fullscreen" }), expectedLabel);
        assert.equal(card._getActionLabel({ menu_item: "full-screen" }), expectedLabel);
      });

      it("supports full_screen, fullscreen, and full-screen when in full-screen mode", () => {
        card._fullScreenOverride = true;
        const expectedLabel = localize("card.menu.exit_full_screen");

        assert.equal(card._getActionLabel({ menu_item: "full_screen" }), expectedLabel);
        assert.equal(card._getActionLabel({ menu_item: "fullscreen" }), expectedLabel);
        assert.equal(card._getActionLabel({ menu_item: "full-screen" }), expectedLabel);
      });

      it("returns empty string for icon-only action with menu_item", () => {
        assert.equal(
          card._getActionLabel({ menu_item: "full_screen", icon: "mdi:fullscreen" }),
          ""
        );
        assert.equal(card._getActionLabel({ menu_item: "fullscreen", icon: "mdi:fullscreen" }), "");
        assert.equal(
          card._getActionLabel({ menu_item: "full-screen", icon: "mdi:fullscreen" }),
          ""
        );
      });
    });

    describe("_handleAction", () => {
      it("handles menu_item: 'full_screen' by toggling full screen and requesting update", async () => {
        let toggleCount = 0;
        let updateCount = 0;
        card._toggleFullScreen = () => {
          toggleCount++;
        };
        card.requestUpdate = () => {
          updateCount++;
        };
        card._showEntityOptions = true;
        card._quickMenuInvoke = false;

        await card._handleAction({ menu_item: "full_screen" });

        assert.equal(toggleCount, 1);
        assert.equal(updateCount, 1);
        assert.equal(card._showEntityOptions, false);
        assert.equal(card._quickMenuInvoke, true);
      });

      it("handles menu_item: 'fullscreen' by toggling full screen and requesting update", async () => {
        let toggleCount = 0;
        let updateCount = 0;
        card._toggleFullScreen = () => {
          toggleCount++;
        };
        card.requestUpdate = () => {
          updateCount++;
        };
        card._showEntityOptions = true;
        card._quickMenuInvoke = false;

        await card._handleAction({ menu_item: "fullscreen" });

        assert.equal(toggleCount, 1);
        assert.equal(updateCount, 1);
        assert.equal(card._showEntityOptions, false);
        assert.equal(card._quickMenuInvoke, true);
      });

      it("handles menu_item: 'full-screen' with identical behavior for parity", async () => {
        let toggleCount = 0;
        let updateCount = 0;
        card._toggleFullScreen = () => {
          toggleCount++;
        };
        card.requestUpdate = () => {
          updateCount++;
        };
        card._showEntityOptions = true;
        card._quickMenuInvoke = false;

        await card._handleAction({ menu_item: "full-screen" });

        assert.equal(toggleCount, 1);
        assert.equal(updateCount, 1);
        assert.equal(card._showEntityOptions, false);
        assert.equal(card._quickMenuInvoke, true);
      });
    });
  });

  describe("Options Sheet Lyrics Button Handler (renderMainMenu)", () => {
    let card;

    beforeEach(() => {
      card = /** @type {any} */ (new YetAnotherMediaPlayerCard());
      card._selectedIndex = 0;
      card.setConfig({
        type: "custom:yet-another-media-player",
        entities: ["media_player.living_room"],
        always_collapsed: false,
      });
      card.hass = {
        states: {
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "playing",
            attributes: {},
          },
        },
      };
      card._hasRemoteControlSupport = () => false;
      card._renderGroupingMenuOption = () => null;
      card._isMenuOptionHidden = () => false;
      card._lyricsActive = false;
    });

    /**
     * Helper to find the lyrics button click handler from renderMainMenu output.
     * @param {any} templateResult
     * @returns {(() => void) | undefined}
     */
    const extractLyricsClickHandler = (templateResult) => {
      const childTemplates = templateResult.values.filter(
        (v) => v && typeof v === "object" && Array.isArray(v.values)
      );
      const lyricsLabel = localize("card.menu.show_lyrics");
      const hideLyricsLabel = localize("card.menu.hide_lyrics");

      const lyricsTemplate = childTemplates.find(
        (t) => t.values.includes(lyricsLabel) || t.values.includes(hideLyricsLabel)
      );
      if (!lyricsTemplate) return undefined;
      return lyricsTemplate.values.find((v) => typeof v === "function");
    };

    it("invokes this._lyricsController.toggle() and this._dismissWithAnimation() when clicked in standard mode", () => {
      let toggleCalled = false;
      let dismissCalled = false;

      Object.defineProperty(card, "_isGridMode", { value: false, configurable: true });
      card._lyricsController = {
        toggle: () => {
          toggleCalled = true;
        },
      };
      card._dismissWithAnimation = () => {
        dismissCalled = true;
      };

      const templateResult = renderMainMenu.call(card, [], [], false);
      const clickHandler = extractLyricsClickHandler(templateResult);

      assert.ok(clickHandler, "Lyrics click handler should be rendered");
      clickHandler();

      assert.equal(toggleCalled, true, "this._lyricsController.toggle() must be called");
      assert.equal(dismissCalled, true, "this._dismissWithAnimation() must be called");
    });

    it("invokes this._lyricsController.toggle() and this._dismissWithAnimation() when clicked in grid mode", () => {
      let toggleCalled = false;
      let dismissCalled = false;

      Object.defineProperty(card, "_isGridMode", { value: true, configurable: true });
      card._lyricsController = {
        toggle: () => {
          toggleCalled = true;
        },
      };
      card._dismissWithAnimation = () => {
        dismissCalled = true;
      };

      const templateResult = renderMainMenu.call(card, [], [], false);
      const clickHandler = extractLyricsClickHandler(templateResult);

      assert.ok(clickHandler, "Lyrics click handler should be rendered in grid mode");
      clickHandler();

      assert.equal(
        toggleCalled,
        true,
        "this._lyricsController.toggle() must be called in grid mode"
      );
      assert.equal(dismissCalled, true, "this._dismissWithAnimation() must be called in grid mode");
    });

    it("falls back gracefully when _lyricsController is missing, updating state and dismissing", () => {
      let fetchLyricsCalled = false;
      let dismissCalled = false;

      Object.defineProperty(card, "_isGridMode", { value: false, configurable: true });
      card._lyricsController = null;
      card._lyricsActive = false;
      card._fetchLyrics = () => {
        fetchLyricsCalled = true;
      };
      card._dismissWithAnimation = () => {
        dismissCalled = true;
      };

      const templateResult = renderMainMenu.call(card, [], [], false);
      const clickHandler = extractLyricsClickHandler(templateResult);

      assert.ok(clickHandler, "Lyrics click handler should be rendered");
      clickHandler();

      assert.equal(card._lyricsActive, true, "Fallback should toggle _lyricsActive to true");
      assert.equal(
        fetchLyricsCalled,
        true,
        "Fallback should call _fetchLyrics when becoming active"
      );
      assert.equal(dismissCalled, true, "Fallback should call _dismissWithAnimation()");
    });
  });
});
