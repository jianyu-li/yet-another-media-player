import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

// Setup mock browser globals before importing Lit component
const g = /** @type {any} */ (globalThis);
if (!g.window) {
  g.window = globalThis;
}
/** @type {EventTarget} */
let windowEventTarget = new EventTarget();

g.window.addEventListener = (
  /** @type {string} */ type,
  /** @type {EventListenerOrEventListenerObject} */ listener,
  /** @type {boolean | AddEventListenerOptions} */ options
) => windowEventTarget.addEventListener(type, listener, options);

g.window.removeEventListener = (
  /** @type {string} */ type,
  /** @type {EventListenerOrEventListenerObject} */ listener,
  /** @type {boolean | EventListenerOptions} */ options
) => windowEventTarget.removeEventListener(type, listener, options);

g.window.dispatchEvent = (/** @type {Event} */ event) => windowEventTarget.dispatchEvent(event);

if (!g.customElements) {
  g.customElements = { define() {} };
}
if (!g.HTMLElement) {
  class MockHTMLElement {
    constructor() {
      /** @type {Map<string, string>} */
      this._attrs = new Map();
    }
    attachShadow() {
      return {};
    }
    dispatchEvent() {
      return true;
    }
    get renderRoot() {
      return { querySelector: () => null, querySelectorAll: () => [] };
    }
    /**
     * @param {string} name
     * @param {string} val
     */
    setAttribute(name, val) {
      this._attrs.set(name, String(val));
    }
    /** @param {string} name */
    getAttribute(name) {
      return this._attrs.get(name) ?? null;
    }
    /** @param {string} name */
    hasAttribute(name) {
      return this._attrs.has(name);
    }
    /** @param {string} name */
    removeAttribute(name) {
      this._attrs.delete(name);
    }
  }
  g.HTMLElement = MockHTMLElement;
}
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerCard, _resetKioskSatelliteCacheForTests } =
  await import("../src/yet-another-media-player.js");
const { TemplateController } = await import("../src/controllers/template-controller.js");

/**
 * Helper to create a mock Home Assistant object with configurable soundbar source.
 * @param {Record<string, any>} [overrides]
 * @returns {any}
 */
const createMockHass = (overrides = {}) => {
  /** @type {Array<{ callback: (msg: any) => void, params: any, unsubCount: number }>} */
  const subscriptions = [];
  return {
    states: {
      "media_player.living_room": {
        entity_id: "media_player.living_room",
        state: "idle",
        attributes: {
          friendly_name: "Living Room",
          source: "Music",
        },
      },
      "media_player.soundbar": {
        entity_id: "media_player.soundbar",
        state: "playing",
        attributes: {
          friendly_name: "Soundbar",
          source: "Television",
        },
      },
      "media_player.kitchen": {
        entity_id: "media_player.kitchen",
        state: "idle",
        attributes: {
          friendly_name: "Kitchen",
        },
      },
    },
    connection: {
      subscriptions,
      /**
       * @param {(msg: any) => void} callback
       * @param {any} params
       */
      async subscribeMessage(callback, params) {
        const entry = { callback, params, unsubCount: 0 };
        subscriptions.push(entry);
        return () => {
          entry.unsubCount++;
        };
      },
    },
    callService: () => {},
    ...overrides,
  };
};

/**
 * Creates a mock TemplateController host with separate _effectiveEntities (raw)
 * and entityObjs (resolved) arrays to verify raw config reads.
 * @param {Record<string, any>} [overrides]
 * @returns {any}
 */
const createMockTemplateHost = (overrides = {}) => {
  const hass = createMockHass();
  return {
    controllers: [],
    updateCount: 0,
    renderCount: 0,
    _selectedIndex: 0,
    addController(/** @type {any} */ ctrl) {
      this.controllers.push(ctrl);
    },
    requestUpdate() {
      this.updateCount++;
    },
    triggerRender() {
      this.renderCount++;
      return true;
    },
    hass,
    entityIds: ["media_player.living_room", "media_player.soundbar"],
    _effectiveEntities: [
      {
        entity_id: "media_player.living_room",
      },
      {
        entity_id: "media_player.soundbar",
        disable_auto_select: "{{ state_attr('media_player.soundbar', 'source') == 'Television' }}",
      },
    ],
    entityObjs: [
      {
        entity_id: "media_player.living_room",
        disable_auto_select: false,
      },
      {
        entity_id: "media_player.soundbar",
        // Already-resolved boolean on entityObjs must NOT be read by ensureResolvedDisableAutoSelectForIndex
        disable_auto_select: false,
      },
    ],
    _getTemplateContext() {
      return {
        entity: "media_player.living_room",
        current: "media_player.living_room",
        is_idle: false,
        is_playing: true,
        is_dark_mode: true,
        is_mobile: false,
      };
    },
    ...overrides,
  };
};

describe("disable_auto_select template support", () => {
  beforeEach(() => {
    windowEventTarget = new EventTarget();
    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
  });

  afterEach(() => {
    delete g.window.kioskSatellite;
    _resetKioskSatelliteCacheForTests();
  });

  describe("Static boolean and omitted disable_auto_select", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card.hass = createMockHass();
      card.config = {
        entities: [
          "media_player.living_room",
          { entity_id: "media_player.soundbar", disable_auto_select: true },
          { entity_id: "media_player.kitchen", disable_auto_select: false },
          { entity: "media_player.bedroom" },
        ],
      };
    });

    it("returns false for string entity entry", () => {
      assert.equal(card._isAutoSelectDisabled(0), false);
      assert.equal(card.entityObjs[0].disable_auto_select, false);
    });

    it("returns true for static disable_auto_select: true", () => {
      assert.equal(card._isAutoSelectDisabled(1), true);
      assert.equal(card.entityObjs[1].disable_auto_select, true);
    });

    it("returns false for static disable_auto_select: false", () => {
      assert.equal(card._isAutoSelectDisabled(2), false);
      assert.equal(card.entityObjs[2].disable_auto_select, false);
    });

    it("returns false when disable_auto_select is omitted on an entity object", () => {
      assert.equal(card._isAutoSelectDisabled(3), false);
      assert.equal(card.entityObjs[3].disable_auto_select, false);
    });
  });

  describe("Client-side JavaScript templates [[[ ... ]]]", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card.hass = createMockHass();
    });

    it("evaluates states[entity]?.attributes?.source synchronously for chip index 1 even when _selectedIndex is 0", () => {
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "[[[ return states[entity]?.attributes?.source === 'Television'; ]]]",
          },
        ],
      };

      // Chip 0 is selected ("media_player.living_room", source="Music")
      // Chip 1 is "media_player.soundbar" with source="Television"
      assert.equal(card._selectedIndex, 0);
      assert.equal(card._isAutoSelectDisabled(0), false);
      assert.equal(card._isAutoSelectDisabled(1), true);
      assert.equal(card.entityObjs[1].disable_auto_select, true);

      // Change soundbar source from Television -> Spotify
      card.hass = {
        ...card.hass,
        states: {
          ...card.hass.states,
          "media_player.soundbar": {
            ...card.hass.states["media_player.soundbar"],
            attributes: {
              ...card.hass.states["media_player.soundbar"].attributes,
              source: "Spotify",
            },
          },
        },
      };
      card._cachedEntityObjs = null;

      assert.equal(card._isAutoSelectDisabled(1), false);
      assert.equal(card.entityObjs[1].disable_auto_select, false);
    });

    it("evaluates state_attr(entity, 'source') synchronously for chip index 1 while _selectedIndex is 0", () => {
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select: "[[[ return state_attr(entity, 'source') === 'Television'; ]]]",
          },
        ],
      };

      assert.equal(card._isAutoSelectDisabled(1), true);

      card.hass.states["media_player.soundbar"].attributes.source = "Spotify";
      assert.equal(card._isAutoSelectDisabled(1), false);
    });

    it("evaluates explicit entity lookup states['media_player.soundbar'].attributes.source and shorthand expressions", () => {
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "[[[ return states['media_player.soundbar']?.attributes?.source === 'Television'; ]]]",
          },
          {
            entity_id: "media_player.kitchen",
            disable_auto_select:
              "[[[ states['media_player.soundbar']?.attributes?.source === 'Television' ]]]",
          },
        ],
      };

      assert.equal(card._isAutoSelectDisabled(1), true);
      assert.equal(card._isAutoSelectDisabled(2), true);

      card.hass.states["media_player.soundbar"].attributes.source = "Spotify";
      assert.equal(card._isAutoSelectDisabled(1), false);
      assert.equal(card._isAutoSelectDisabled(2), false);
    });

    it("handles null/unavailable/missing hass or attributes gracefully without throwing", () => {
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "[[[ return states[entity]?.attributes?.source === 'Television'; ]]]",
          },
        ],
      };

      card.hass.states["media_player.soundbar"] = {
        entity_id: "media_player.soundbar",
        state: "unavailable",
        attributes: {},
      };
      assert.equal(card._isAutoSelectDisabled(1), false);

      delete card.hass.states["media_player.soundbar"];
      assert.equal(card._isAutoSelectDisabled(1), false);

      card.hass = null;
      assert.equal(card._isAutoSelectDisabled(1), false);
    });
  });

  describe("Jinja2 templates, TemplateController caching & boolean coercion", () => {
    it("initializes disableAutoSelectResolveCache and subscribes via TemplateController", async () => {
      const host = createMockTemplateHost();
      const ctrl = new TemplateController(/** @type {any} */ (host));

      assert.deepEqual(ctrl.disableAutoSelectResolveCache, {});

      const template = "{{ state_attr('media_player.soundbar', 'source') == 'Television' }}";
      ctrl.subscribeToTemplate(1, "disable_auto_select", template);
      await Promise.resolve();

      assert.equal(host.hass.connection.subscriptions.length, 1);
      const sub = host.hass.connection.subscriptions[0];
      assert.equal(sub.params.type, "render_template");
      assert.ok(sub.params.template.includes(template));

      sub.callback({ result: "true" });
      assert.equal(ctrl.disableAutoSelectResolveCache[1]?.value, "true");
      assert.equal(host.renderCount + host.updateCount > 0, true);

      sub.callback({ result: "false" });
      assert.equal(ctrl.disableAutoSelectResolveCache[1]?.value, "false");

      ctrl.hostDisconnected();
      assert.equal(sub.unsubCount, 1);
      assert.deepEqual(ctrl.templateSubscriptions, {});
    });

    it("coerces Jinja2 resolved truthy and falsy strings on YetAnotherMediaPlayerCard", () => {
      const card = /** @type {any} */ (new YetAnotherMediaPlayerCard());
      card._selectedIndex = 0;
      card.hass = createMockHass();
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "{{ state_attr('media_player.soundbar', 'source') == 'Television' }}",
          },
        ],
      };

      // Unresolved cache defaults to false
      assert.equal(card._isAutoSelectDisabled(1), false);

      const truthyValues = ["true", "True", " TRUE ", "1", "on", "ON", "yes", "Yes", true];
      for (const val of truthyValues) {
        card._disableAutoSelectResolveCache[1] = { value: val, ts: Date.now() };
        card._cachedEntityObjs = null;
        assert.equal(
          card._isAutoSelectDisabled(1),
          true,
          `Expected ${JSON.stringify(val)} to coerce to true`
        );
        assert.equal(
          card.entityObjs[1].disable_auto_select,
          true,
          `Expected entityObjs[1].disable_auto_select to be true for ${JSON.stringify(val)}`
        );
      }

      const falsyValues = ["false", "False", "0", "off", "no", "", "   ", null, undefined, false];
      for (const val of falsyValues) {
        card._disableAutoSelectResolveCache[1] = { value: val, ts: Date.now() };
        card._cachedEntityObjs = null;
        assert.equal(
          card._isAutoSelectDisabled(1),
          false,
          `Expected ${JSON.stringify(val)} to coerce to false`
        );
        assert.equal(
          card.entityObjs[1].disable_auto_select,
          false,
          `Expected entityObjs[1].disable_auto_select to be false for ${JSON.stringify(val)}`
        );
      }
    });

    it("injects the chip's own entity into context when subscribing for chip index 1 while _selectedIndex is 0", async () => {
      const card = /** @type {any} */ (new YetAnotherMediaPlayerCard());
      card._selectedIndex = 0;
      card.hass = createMockHass();
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select: "{{ state_attr(entity, 'source') == 'Television' }}",
          },
        ],
      };

      await card._templateController.ensureResolvedDisableAutoSelectForIndex(1);
      await Promise.resolve();

      assert.equal(card.hass.connection.subscriptions.length, 1);
      const subscribedTemplate = card.hass.connection.subscriptions[0].params.template;
      assert.ok(
        subscribedTemplate.includes('{% set entity = "media_player.soundbar" %}'),
        `Expected subscribed template to bind entity to chip 1 ("media_player.soundbar"), got: ${subscribedTemplate}`
      );
      assert.equal(
        subscribedTemplate.includes('{% set entity = "media_player.living_room" %}'),
        false,
        "Expected subscribed template NOT to bind entity to selected chip 0"
      );

      // Simulate HA pushing result
      card.hass.connection.subscriptions[0].callback({ result: "True" });
      assert.equal(card._isAutoSelectDisabled(1), true);

      card.hass.connection.subscriptions[0].callback({ result: "False" });
      assert.equal(card._isAutoSelectDisabled(1), false);
    });
  });

  describe("ensureResolvedDisableAutoSelectForIndex reads raw config from _effectiveEntities", () => {
    it("reads Jinja2 template from _effectiveEntities[idx] even when entityObjs[idx].disable_auto_select is boolean false", async () => {
      const host = createMockTemplateHost({
        _effectiveEntities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "{{ state_attr('media_player.soundbar', 'source') == 'Television' }}",
          },
        ],
        entityObjs: [
          { entity_id: "media_player.living_room", disable_auto_select: false },
          { entity_id: "media_player.soundbar", disable_auto_select: false },
        ],
      });
      const ctrl = new TemplateController(/** @type {any} */ (host));

      await ctrl.ensureResolvedDisableAutoSelectForIndex(1);
      await Promise.resolve();

      assert.equal(
        host.hass.connection.subscriptions.length,
        1,
        "Should subscribe to Jinja2 template read from _effectiveEntities[1]"
      );

      host.hass.connection.subscriptions[0].callback({ result: "yes" });
      assert.equal(ctrl.disableAutoSelectResolveCache[1]?.value, "yes");
    });

    it("reads JS template from _effectiveEntities[idx] with chip entity context even when entityObjs[idx].disable_auto_select is boolean false", async () => {
      const host = createMockTemplateHost({
        _selectedIndex: 0,
        _effectiveEntities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "[[[ return states[entity]?.attributes?.source === 'Television'; ]]]",
          },
        ],
        entityObjs: [
          { entity_id: "media_player.living_room", disable_auto_select: false },
          { entity_id: "media_player.soundbar", disable_auto_select: false },
        ],
      });
      const ctrl = new TemplateController(/** @type {any} */ (host));

      await ctrl.ensureResolvedDisableAutoSelectForIndex(1);

      assert.equal(host.hass.connection.subscriptions.length, 0);
      assert.equal(ctrl.disableAutoSelectResolveCache[1]?.value, true);

      // Change source on soundbar and re-resolve
      host.hass.states["media_player.soundbar"].attributes.source = "Spotify";
      await ctrl.ensureResolvedDisableAutoSelectForIndex(1);
      assert.equal(ctrl.disableAutoSelectResolveCache[1]?.value, false);
    });

    it("clears cache and unsubscribes when _effectiveEntities[idx] has static boolean or string entry", async () => {
      const host = createMockTemplateHost();
      const ctrl = new TemplateController(/** @type {any} */ (host));

      await ctrl.ensureResolvedDisableAutoSelectForIndex(1);
      await Promise.resolve();
      assert.equal(host.hass.connection.subscriptions.length, 1);

      host.hass.connection.subscriptions[0].callback({ result: "true" });
      assert.equal(ctrl.disableAutoSelectResolveCache[1]?.value, "true");

      // Switch raw config to static string entry
      host._effectiveEntities[1] = "media_player.soundbar";
      await ctrl.ensureResolvedDisableAutoSelectForIndex(1);

      assert.equal(host.hass.connection.subscriptions[0].unsubCount, 1);
      assert.equal(ctrl.disableAutoSelectResolveCache[1], undefined);
    });

    it("syncs disable_auto_select subscriptions across entities during card updated()", async () => {
      const card = /** @type {any} */ (new YetAnotherMediaPlayerCard());
      card._selectedIndex = 0;
      card.hass = createMockHass();
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "{{ state_attr('media_player.soundbar', 'source') == 'Television' }}",
          },
        ],
      };

      // Settle initial lifecycle update
      card.updated(new Map(/** @type {Array<[string, any]>} */ ([["hass", null]])));
      card.updated(new Map());
      await Promise.resolve();

      const activeSubs = card.hass.connection.subscriptions.filter(
        (/** @type {any} */ s) => s.unsubCount === 0
      );
      assert.equal(activeSubs.length, 1);
      const sub = activeSubs[0];
      assert.ok(sub.params.template.includes("state_attr('media_player.soundbar', 'source')"));

      sub.callback({ result: "1" });
      assert.equal(card._isAutoSelectDisabled(1), true);

      sub.callback({ result: "0" });
      assert.equal(card._isAutoSelectDisabled(1), false);
    });
  });

  describe("sortedEntityIds sorting with templated disable_auto_select", () => {
    /** @type {any} */
    let card;

    beforeEach(() => {
      card = new YetAnotherMediaPlayerCard();
      card._selectedIndex = 0;
      card.hass = createMockHass();
      card._playTimestamps = {
        "media_player.living_room": 1000,
        "media_player.soundbar": 5000,
        "media_player.kitchen": 2000,
      };
    });

    it("zeros timestamp and sorts entity to end when JS template resolves true, and restores play-timestamp order when false", () => {
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "[[[ return states[entity]?.attributes?.source === 'Television'; ]]]",
          },
          "media_player.kitchen",
        ],
      };

      // Soundbar has source="Television" -> disabled -> sorts to end despite highest timestamp (5000)
      assert.deepEqual(card.sortedEntityIds, [
        "media_player.kitchen",
        "media_player.living_room",
        "media_player.soundbar",
      ]);

      // Soundbar switches to Spotify -> template resolves false -> sorts first by timestamp (5000)
      card.hass.states["media_player.soundbar"].attributes.source = "Spotify";
      assert.deepEqual(card.sortedEntityIds, [
        "media_player.soundbar",
        "media_player.kitchen",
        "media_player.living_room",
      ]);
    });

    it("zeros timestamp and sorts entity to end when Jinja2 template cache resolves true, and restores order when false", () => {
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "{{ state_attr('media_player.soundbar', 'source') == 'Television' }}",
          },
          "media_player.kitchen",
        ],
      };

      // Before Jinja2 resolves -> defaults to false -> soundbar sorts first (5000)
      assert.deepEqual(card.sortedEntityIds, [
        "media_player.soundbar",
        "media_player.kitchen",
        "media_player.living_room",
      ]);

      // Jinja2 resolves truthy -> soundbar sorts to end
      card._disableAutoSelectResolveCache[1] = { value: "on", ts: Date.now() };
      assert.deepEqual(card.sortedEntityIds, [
        "media_player.kitchen",
        "media_player.living_room",
        "media_player.soundbar",
      ]);

      // Jinja2 resolves falsy -> soundbar sorts first again
      card._disableAutoSelectResolveCache[1] = { value: "", ts: Date.now() };
      assert.deepEqual(card.sortedEntityIds, [
        "media_player.soundbar",
        "media_player.kitchen",
        "media_player.living_room",
      ]);
    });

    it("sorts groupedSortedEntityIds to end when group member template resolves true", () => {
      card.config = {
        entities: [
          "media_player.living_room",
          {
            entity_id: "media_player.soundbar",
            disable_auto_select:
              "[[[ return states[entity]?.attributes?.source === 'Television'; ]]]",
          },
        ],
      };

      assert.deepEqual(card.groupedSortedEntityIds, [
        ["media_player.living_room"],
        ["media_player.soundbar"],
      ]);

      card.hass.states["media_player.soundbar"].attributes.source = "Spotify";
      assert.deepEqual(card.groupedSortedEntityIds, [
        ["media_player.soundbar"],
        ["media_player.living_room"],
      ]);
    });
  });
});
