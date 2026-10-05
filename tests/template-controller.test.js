import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TemplateController } from "../src/controllers/template-controller.js";

/**
 * Creates a mock card host with necessary controller methods and context.
 * @param {Record<string, any>} [overrides]
 * @returns {any}
 */
const createMockHost = (overrides = {}) => {
  const host = {
    controllers: [],
    updateCount: 0,
    addController(ctrl) {
      this.controllers.push(ctrl);
    },
    requestUpdate() {
      this.updateCount++;
    },
    hass: {
      states: {
        "media_player.living_room": {
          entity_id: "media_player.living_room",
          state: "playing",
          attributes: {
            friendly_name: "Living Room Speaker",
            media_title: "Bohemian Rhapsody",
            volume_level: 0.7,
          },
        },
        "media_player.kitchen": {
          entity_id: "media_player.kitchen",
          state: "idle",
          attributes: {
            friendly_name: "Kitchen Echo",
            volume_level: 0.4,
          },
        },
      },
      connection: {
        lastSubscribedTemplate: null,
        subscribeMessageCallback: null,
        unsubCallCount: 0,
        async subscribeMessage(callback, params) {
          this.lastSubscribedTemplate = params.template;
          this.subscribeMessageCallback = callback;
          return () => {
            this.unsubCallCount++;
          };
        },
      },
    },
    entityObjs: [
      {
        entity_id: "media_player.living_room",
        music_assistant_entity: "{{ 'media_player.living_room_ma' }}",
        volume_entity: "media_player.living_room_amp",
        remote_entity: "[[[ return 'remote.living_room'; ]]]",
        hidden_controls: ["shuffle"],
      },
      {
        entity_id: "media_player.kitchen",
        music_assistant_entity: "media_player.kitchen_ma",
        volume_entity: "[[[ return 'media_player.kitchen'; ]]]",
        follow_active_volume: true,
      },
    ],
    _getTemplateContext() {
      return {
        entity: "media_player.living_room",
        current: "media_player.living_room",
        is_playing: true,
        is_idle: false,
        is_dark_mode: true,
        is_mobile: false,
      };
    },
    ...overrides,
  };
  return host;
};

describe("TemplateController (Reactive Lit Controller)", () => {
  it("registers controller with host and initializes cache structures", () => {
    const host = createMockHost();
    const ctrl = new TemplateController(host);

    assert.equal(host.controllers.includes(ctrl), true);
    assert.deepEqual(ctrl.templateSubscriptions, {});
    assert.deepEqual(ctrl.maResolveCache, {});
    assert.deepEqual(ctrl.volResolveCache, {});
    assert.deepEqual(ctrl.remoteResolveCache, {});
    assert.deepEqual(ctrl.alwaysCollapsedResolveCache, {});
    assert.deepEqual(ctrl.fullScreenResolveCache, {});
  });

  it("evaluates client-side JS templates synchronously", () => {
    const host = createMockHost();
    const ctrl = new TemplateController(host);

    const result = ctrl.evaluateJsTemplate(
      "[[[ return hass.states['media_player.living_room'].state; ]]]"
    );
    assert.equal(result, "playing");

    const numericResult = ctrl.evaluateJsTemplate("[[[ return 40 + 2; ]]]");
    assert.equal(numericResult, 42);
  });

  it("subscribes to Jinja templates and updates caches on message callback", async () => {
    const host = createMockHost();
    const ctrl = new TemplateController(host);

    ctrl.subscribeToTemplate(0, "ma", "{{ 'media_player.living_room_ma' }}");

    assert.ok(host.hass.connection.lastSubscribedTemplate.includes("media_player.living_room_ma"));
    assert.equal(typeof host.hass.connection.subscribeMessageCallback, "function");

    // Simulate Home Assistant sending back the rendered template result
    host.hass.connection.subscribeMessageCallback({
      result: "media_player.living_room_ma",
    });

    assert.equal(ctrl.maResolveCache[0]?.id, "media_player.living_room_ma");
    assert.equal(host.updateCount, 1);
  });

  it("unsubscribes cleanly and handles hostDisconnected lifecycle", async () => {
    const host = createMockHost();
    const ctrl = new TemplateController(host);

    ctrl.subscribeToTemplate(0, "ma", "{{ 'media_player.living_room_ma' }}");
    // Allow promise tick to store unsub function
    await Promise.resolve();

    assert.equal(Object.keys(ctrl.templateSubscriptions).length, 1);

    ctrl.hostDisconnected();

    assert.equal(Object.keys(ctrl.templateSubscriptions).length, 0);
    assert.equal(host.hass.connection.unsubCallCount, 1);
  });

  it("resolves static and templated entities via ensureResolved* methods", async () => {
    const host = createMockHost();
    const ctrl = new TemplateController(host);

    // Static volume entity on entity 0
    await ctrl.ensureResolvedTemplateForIndex(
      0,
      "vol",
      host.entityObjs[0].volume_entity,
      { cacheStaticString: true },
      ctrl.volResolveCache,
      ctrl.volTemplateValues
    );
    assert.equal(ctrl.volResolveCache[0]?.id, "media_player.living_room_amp");

    // JS template remote entity on entity 0
    await ctrl.ensureResolvedRemoteForIndex(0);
    assert.equal(ctrl.remoteResolveCache[0]?.id, "remote.living_room");

    // Follow active volume entity on entity 1 should delete cache
    await ctrl.ensureResolvedVolForIndex(1);
    assert.equal(ctrl.volResolveCache[1], undefined);
  });

  it("resolves entity with fallback via resolveEntity", () => {
    const host = createMockHost();
    const ctrl = new TemplateController(host);

    ctrl.maResolveCache[0] = { id: "media_player.resolved_ma", ts: Date.now() };

    // When template syntax is present, returns cached value
    const resolvedFromCache = ctrl.resolveEntity(
      "{{ template }}",
      "media_player.fallback",
      0,
      "ma"
    );
    assert.equal(resolvedFromCache, "media_player.resolved_ma");

    // When template cache is missing, returns fallback
    const resolvedFallback = ctrl.resolveEntity("{{ template }}", "media_player.fallback", 1, "ma");
    assert.equal(resolvedFallback, "media_player.fallback");

    // When static string without template markers, returns static string
    const staticResult = ctrl.resolveEntity(
      "media_player.static_speaker",
      "media_player.fallback",
      0,
      "ma"
    );
    assert.equal(staticResult, "media_player.static_speaker");
  });

  it("syncs UI template subscriptions for always_collapsed, control_layout, and full_screen", () => {
    const host = createMockHost();
    const ctrl = new TemplateController(host);

    const contextStr = JSON.stringify(host._getTemplateContext());

    // JS template for always_collapsed
    ctrl.syncTemplateSubscriptions("always_collapsed", contextStr, "[[[ return is_playing; ]]]");
    assert.equal(ctrl.alwaysCollapsedResolveCache["card"]?.value, true);

    // Static value cleans up cache
    ctrl.syncTemplateSubscriptions("always_collapsed", contextStr, false);
    assert.equal(ctrl.alwaysCollapsedResolveCache["card"], undefined);

    // JS template for full_screen
    ctrl.syncTemplateSubscriptions("full_screen", contextStr, "[[[ return is_playing; ]]]");
    assert.equal(ctrl.fullScreenResolveCache["card"]?.value, true);

    // Jinja template subscription for full_screen
    ctrl.subscribeToTemplate(
      "card",
      "full_screen",
      "{{ is_state('input_boolean.fullscreen', 'on') }}"
    );
    assert.ok(host.hass.connection.lastSubscribedTemplate.includes("input_boolean.fullscreen"));
    host.hass.connection.subscribeMessageCallback({
      result: "true",
    });
    assert.equal(ctrl.fullScreenResolveCache["card"]?.value, "true");

    // Static value cleans up cache
    ctrl.syncTemplateSubscriptions("full_screen", contextStr, false);
    assert.equal(ctrl.fullScreenResolveCache["card"], undefined);
  });
});
