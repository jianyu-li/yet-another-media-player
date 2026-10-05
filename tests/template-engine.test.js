import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateJsTemplate, resolveStringTemplateSync } from "../src/yamp-utils.js";

/**
 * Helper to build a mock HomeAssistant object with custom states and user.
 * @param {Record<string, any>} [partial]
 * @returns {import("../src/types.d.ts").HomeAssistant}
 */
const createMockHass = (partial = {}) =>
  /** @type {any} */ ({
    states: {
      "media_player.living_room": {
        entity_id: "media_player.living_room",
        state: "playing",
        attributes: {
          friendly_name: "Living Room Speaker",
          media_title: "Bohemian Rhapsody",
          media_artist: "Queen",
          volume_level: 0.65,
        },
      },
      "media_player.bedroom": {
        entity_id: "media_player.bedroom",
        state: "idle",
        attributes: {
          friendly_name: "Bedroom Echo",
          volume_level: 0.3,
        },
      },
    },
    user: { id: "user_123", name: "Admin", is_owner: true },
    language: "en",
    locale: { language: "en" },
    ...partial,
  });

/**
 * Helper to build a standard template context.
 * @param {Record<string, any>} [partial]
 * @returns {Record<string, any>}
 */
const createMockContext = (partial = {}) => {
  const fs =
    partial.is_full_screen !== undefined
      ? partial.is_full_screen
      : partial.is_fullscreen !== undefined
        ? partial.is_fullscreen
        : false;
  return {
    entity: "media_player.living_room",
    current: "media_player.living_room",
    is_idle: false,
    is_playing: true,
    is_search: false,
    is_grouping: false,
    is_source: false,
    is_lyrics: false,
    is_options: false,
    is_transfer_queue: false,
    is_any_menu_open: false,
    is_fullscreen: fs,
    is_full_screen: fs,
    is_dark_mode: true,
    is_mobile: false,
    is_music_assistant: true,
    is_music: true,
    ...partial,
    ...(partial.is_full_screen !== undefined && partial.is_fullscreen === undefined
      ? { is_fullscreen: partial.is_full_screen }
      : {}),
    ...(partial.is_fullscreen !== undefined && partial.is_full_screen === undefined
      ? { is_full_screen: partial.is_fullscreen }
      : {}),
  };
};

describe("template-engine", () => {
  describe("evaluateJsTemplate (Client-side JavaScript sandbox)", () => {
    describe("Syntax Variations & Value Returns", () => {
      it("returns non-template strings as-is", () => {
        const hass = createMockHass();
        assert.equal(evaluateJsTemplate("Living Room", hass), "Living Room");
        assert.equal(evaluateJsTemplate("mdi:speaker", hass), "mdi:speaker");
        assert.equal(
          evaluateJsTemplate("https://example.com/art.jpg", hass),
          "https://example.com/art.jpg"
        );
        assert.equal(evaluateJsTemplate("", hass), "");
      });

      it("returns non-string values as-is", () => {
        const hass = createMockHass();
        assert.equal(evaluateJsTemplate(/** @type {any} */ (123), hass), 123);
        assert.equal(evaluateJsTemplate(/** @type {any} */ (true), hass), true);
        assert.equal(evaluateJsTemplate(/** @type {any} */ (null), hass), null);
        assert.equal(evaluateJsTemplate(/** @type {any} */ (undefined), hass), undefined);
      });

      it("evaluates shorthand single-expression templates without explicit return", () => {
        const hass = createMockHass();
        const resBool = evaluateJsTemplate(
          "[[[ states['media_player.living_room'].state === 'playing' ]]]",
          hass
        );
        assert.equal(resBool, true);

        const resMath = evaluateJsTemplate("[[[ 10 + 25 ]]]", hass);
        assert.equal(resMath, 35);

        const resString = evaluateJsTemplate(
          "[[[ states['media_player.living_room'].attributes.friendly_name.toUpperCase() ]]]",
          hass
        );
        assert.equal(resString, "LIVING ROOM SPEAKER");
      });

      it("evaluates multi-statement templates with explicit return", () => {
        const hass = createMockHass();
        const template = `[[[
          const state = states['media_player.living_room']?.state;
          const artist = state_attr('media_player.living_room', 'media_artist');
          return \`\${artist} is \${state}\`;
        ]]]`;
        const res = evaluateJsTemplate(template, hass);
        assert.equal(res, "Queen is playing");
      });

      it("supports returning complex types: objects, arrays, null, booleans, and numbers", () => {
        const hass = createMockHass();
        assert.deepEqual(evaluateJsTemplate("[[[ ({ active: true, count: 42 }) ]]]", hass), {
          active: true,
          count: 42,
        });
        assert.deepEqual(evaluateJsTemplate("[[[ ['pop', 'rock', 'jazz'] ]]]", hass), [
          "pop",
          "rock",
          "jazz",
        ]);
        assert.equal(evaluateJsTemplate("[[[ null ]]]", hass), null);
        assert.equal(evaluateJsTemplate("[[[ false ]]]", hass), false);
        assert.equal(evaluateJsTemplate("[[[ 0 ]]]", hass), 0);
      });

      it("returns undefined if hass is null or undefined", () => {
        assert.equal(
          evaluateJsTemplate("[[[ states['media_player.living_room'].state ]]]", null),
          undefined
        );
        assert.equal(
          evaluateJsTemplate("[[[ states['media_player.living_room'].state ]]]", undefined),
          undefined
        );
      });
    });

    describe("Context Variables & Helper Functions", () => {
      it("exposes hass, states, user, and helper functions is_state and state_attr", () => {
        const hass = createMockHass();
        const context = createMockContext();

        assert.equal(
          evaluateJsTemplate(
            "[[[ is_state('media_player.living_room', 'playing') ]]]",
            hass,
            context
          ),
          true
        );
        assert.equal(
          evaluateJsTemplate("[[[ is_state('media_player.living_room', 'idle') ]]]", hass, context),
          false
        );
        assert.equal(
          evaluateJsTemplate(
            "[[[ state_attr('media_player.living_room', 'media_title') ]]]",
            hass,
            context
          ),
          "Bohemian Rhapsody"
        );
        assert.equal(evaluateJsTemplate("[[[ user.name ]]]", hass, context), "Admin");
        assert.equal(evaluateJsTemplate("[[[ user.is_owner ]]]", hass, context), true);
      });

      it("exposes all template context variables directly and inside context object", () => {
        const hass = createMockHass();
        const context = createMockContext({
          is_dark_mode: true,
          is_mobile: false,
          is_music_assistant: true,
          is_playing: true,
          is_idle: false,
          is_fullscreen: true,
          is_full_screen: true,
          current: "media_player.living_room",
        });

        assert.equal(evaluateJsTemplate("[[[ is_dark_mode ]]]", hass, context), true);
        assert.equal(evaluateJsTemplate("[[[ is_mobile ]]]", hass, context), false);
        assert.equal(evaluateJsTemplate("[[[ is_music_assistant ]]]", hass, context), true);
        assert.equal(evaluateJsTemplate("[[[ is_playing ]]]", hass, context), true);
        assert.equal(evaluateJsTemplate("[[[ is_idle ]]]", hass, context), false);
        assert.equal(evaluateJsTemplate("[[[ is_fullscreen ]]]", hass, context), true);
        assert.equal(evaluateJsTemplate("[[[ is_full_screen ]]]", hass, context), true);
        assert.equal(
          evaluateJsTemplate("[[[ current ]]]", hass, context),
          "media_player.living_room"
        );
        assert.equal(
          evaluateJsTemplate("[[[ context.entity ]]]", hass, context),
          "media_player.living_room"
        );
      });
    });

    describe("Error Handling & Containment", () => {
      it("catches syntax errors safely, returns undefined, and does not throw", () => {
        const hass = createMockHass();
        const origWarn = console.warn;
        console.warn = () => {};
        try {
          const result = evaluateJsTemplate("[[[ if (broken syntax ]]]", hass);
          assert.equal(result, undefined);
        } finally {
          console.warn = origWarn;
        }
      });

      it("catches runtime errors safely, returns undefined, and does not throw", () => {
        const hass = createMockHass();
        const origWarn = console.warn;
        console.warn = () => {};
        try {
          const result = evaluateJsTemplate("[[[ nonExistentVariable.foo.bar ]]]", hass);
          assert.equal(result, undefined);
        } finally {
          console.warn = origWarn;
        }
      });

      it("catches explicit thrown errors safely and returns undefined", () => {
        const hass = createMockHass();
        const origWarn = console.warn;
        console.warn = () => {};
        try {
          const result = evaluateJsTemplate(
            "[[[ return (() => { throw new Error('forced failure'); })(); ]]]",
            hass
          );
          assert.equal(result, undefined);
        } finally {
          console.warn = origWarn;
        }
      });
    });

    describe("Compilation Caching", () => {
      it("reuses compiled function from compiledCache across multiple calls", () => {
        const hass = createMockHass();
        /** @type {Record<string, any>} */
        const cache = {};
        const template = "[[[ 2 * 3 ]]]";

        const res1 = evaluateJsTemplate(template, hass, createMockContext(), cache);
        assert.equal(res1, 6);
        assert.equal(Object.keys(cache).length, 1);
        const originalFn = cache["2 * 3"];
        assert.equal(typeof originalFn, "function");

        const res2 = evaluateJsTemplate(template, hass, createMockContext(), cache);
        assert.equal(res2, 6);
        // Verify the function in cache is the exact same instance
        assert.equal(cache["2 * 3"], originalFn);
      });

      it("re-evaluates with updated state using the cached compiled function", () => {
        const hass = createMockHass();
        /** @type {Record<string, any>} */
        const cache = {};
        const template = "[[[ state_attr('media_player.living_room', 'volume_level') ]]]";

        const res1 = evaluateJsTemplate(template, hass, createMockContext(), cache);
        assert.equal(res1, 0.65);

        // Update state in hass
        hass.states["media_player.living_room"].attributes.volume_level = 0.8;

        const res2 = evaluateJsTemplate(template, hass, createMockContext(), cache);
        assert.equal(res2, 0.8);
      });
    });
  });

  describe("resolveStringTemplateSync (Synchronous Jinja Resolution)", () => {
    it("returns non-template strings as-is", () => {
      const hass = createMockHass();
      assert.equal(resolveStringTemplateSync(hass, "Standard Track Title"), "Standard Track Title");
      assert.equal(resolveStringTemplateSync(hass, "mdi:play"), "mdi:play");
      assert.equal(resolveStringTemplateSync(hass, ""), "");
      assert.equal(resolveStringTemplateSync(hass, null), null);
    });

    it("resolves state_attr expressions", () => {
      const hass = createMockHass();
      const res = resolveStringTemplateSync(
        hass,
        "{{ state_attr('media_player.living_room', 'media_title') }}"
      );
      assert.equal(res, "Bohemian Rhapsody");
    });

    it("resolves state_attr with dynamic entity reference from context", () => {
      const hass = createMockHass();
      const context = { current: "media_player.living_room" };
      const res = resolveStringTemplateSync(
        hass,
        "{{ state_attr(current, 'media_artist') }}",
        context
      );
      assert.equal(res, "Queen");
    });

    it("resolves states() expressions", () => {
      const hass = createMockHass();
      const res = resolveStringTemplateSync(hass, "{{ states('media_player.living_room') }}");
      assert.equal(res, "playing");
    });

    it("resolves states() equality checks to boolean strings", () => {
      const hass = createMockHass();
      assert.equal(
        resolveStringTemplateSync(hass, "{{ states('media_player.living_room') == 'playing' }}"),
        "true"
      );
      assert.equal(
        resolveStringTemplateSync(hass, "{{ states('media_player.living_room') == 'idle' }}"),
        "false"
      );
      assert.equal(
        resolveStringTemplateSync(hass, "{{ states('media_player.living_room') != 'idle' }}"),
        "true"
      );
    });

    it("resolves is_state() expressions to boolean strings", () => {
      const hass = createMockHass();
      assert.equal(
        resolveStringTemplateSync(hass, "{{ is_state('media_player.living_room', 'playing') }}"),
        "true"
      );
      assert.equal(
        resolveStringTemplateSync(hass, "{{ is_state('media_player.living_room', 'paused') }}"),
        "false"
      );
    });

    it("resolves direct context variable substitution", () => {
      const hass = createMockHass();
      const context = { current: "media_player.living_room", is_playing: true };
      assert.equal(
        resolveStringTemplateSync(hass, "{{ current }}", context),
        "media_player.living_room"
      );
      assert.equal(resolveStringTemplateSync(hass, "{{ is_playing }}", context), "true");
    });

    it("applies | urlencode filter to resolved values", () => {
      const hass = createMockHass({
        states: {
          "media_player.living_room": {
            entity_id: "media_player.living_room",
            state: "playing",
            attributes: {
              media_title: "AC/DC - Back In Black & More",
            },
          },
        },
      });

      const res = resolveStringTemplateSync(
        hass,
        "{{ state_attr('media_player.living_room', 'media_title') | urlencode }}"
      );
      assert.equal(res, encodeURIComponent("AC/DC - Back In Black & More"));
    });

    it("handles URL-encoded Jinja braces %7B%7B and %7D%7D", () => {
      const hass = createMockHass();
      const encoded = "%7B%7B%20states('media_player.living_room')%20%7D%7D";
      assert.equal(resolveStringTemplateSync(hass, encoded), "playing");
    });

    it("returns null for complex Jinja blocks ({% ... %}) so they fall back to WebSocket", () => {
      const hass = createMockHass();
      const complex =
        "{% if is_state('media_player.living_room', 'playing') %}Play{% else %}Pause{% endif %}";
      assert.equal(resolveStringTemplateSync(hass, complex), null);
    });
  });
});
