import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

const g = /** @type {any} */ (globalThis);
g.window = globalThis;
if (!g.customElements) {
  g.customElements = { define() {} };
}
class MockHTMLElement {
  constructor() {
    this.renderRoot = { querySelector: () => null, querySelectorAll: () => [] };
  }
  attachShadow() {
    return this.renderRoot;
  }
  dispatchEvent() {
    return true;
  }
  addEventListener() {}
  removeEventListener() {}
}
g.HTMLElement = MockHTMLElement;
g.__VERSION__ = "1.0.0-test";

const { YetAnotherMediaPlayerCard } = await import("../src/yet-another-media-player.js");

describe("disable_autofocus on card_type: search and dedicated_search", () => {
  /** @type {any} */
  let card;
  /** @type {number} */
  let focusCalls;
  /** @type {number} */
  let openCalls;

  /**
   * Advances fake timers in discrete steps so t=0, initial 200ms, and +200ms retry timers all fire.
   * @param {any} clock
   */
  function advanceFocusTimers(clock) {
    clock.tick(1);
    clock.tick(250);
    clock.tick(250);
  }

  function cleanupCard() {
    card?._searchController?.hostDisconnected?.();
    card?._idleController?.hostDisconnected?.();
    card = null;
  }

  function setupCard() {
    cleanupCard();
    focusCalls = 0;
    openCalls = 0;
    const instance = /** @type {any} */ (new YetAnotherMediaPlayerCard());
    instance.renderRoot = {
      querySelector: (/** @type {string} */ selector) =>
        selector === "#search-input-box" ? { focus: () => focusCalls++ } : null,
      querySelectorAll: () => [],
    };
    const origOpen = instance._showSearchSheetInOptions.bind(instance);
    instance._showSearchSheetInOptions = (/** @type {any} */ mode) => {
      openCalls++;
      return origOpen(mode);
    };
    instance._searchController.doSearch = async () => {};
    instance._searchController.checkAiRadioAvailability = async () => {};
    card = instance;
    return instance;
  }

  beforeEach(() => {
    card = null;
  });

  afterEach(cleanupCard);

  it("never calls focus() for card_type: search with disable_autofocus: true or template: dedicated_search", (t) => {
    const clock = t.mock.timers;
    clock.enable({ apis: ["setTimeout"] });

    for (const cfg of [
      {
        entities: [{ entity_id: "media_player.upstairs_speakers" }],
        card_type: "search",
        disable_autofocus: true,
      },
      { entities: ["media_player.upstairs_speakers"], template: "dedicated_search" },
    ]) {
      const c = setupCard();
      c.setConfig(cfg);
      assert.strictEqual(c._disableSearchAutofocus, true);
      assert.strictEqual(c._showSearchInSheet, true);
      advanceFocusTimers(clock);
      assert.strictEqual(focusCalls, 0);
      assert.strictEqual(c._searchInputAutoFocused, false);
    }
  });

  it("calls focus() once and avoids duplicate search init when disable_autofocus is false or omitted", (t) => {
    const clock = t.mock.timers;
    clock.enable({ apis: ["setTimeout"] });

    for (const disableFlag of [false, undefined]) {
      const c = setupCard();
      c.setConfig({
        entities: ["media_player.upstairs_speakers"],
        card_type: "search",
        ...(disableFlag !== undefined ? { disable_autofocus: disableFlag } : {}),
      });
      assert.strictEqual(c._disableSearchAutofocus, false);
      advanceFocusTimers(clock);
      assert.strictEqual(openCalls, 1);
      assert.strictEqual(focusCalls, 1);
      assert.strictEqual(c._searchInputAutoFocused, true);
    }
  });

  it("cancels pending focus timer when reconfigured to disable_autofocus: true before timer fires", (t) => {
    const clock = t.mock.timers;
    clock.enable({ apis: ["setTimeout"] });

    const c = setupCard();
    c.setConfig({
      entities: ["media_player.upstairs_speakers"],
      card_type: "search",
      disable_autofocus: false,
    });

    clock.tick(1);
    clock.tick(100);
    assert.strictEqual(focusCalls, 0);

    c.setConfig({
      entities: ["media_player.upstairs_speakers"],
      card_type: "search",
      disable_autofocus: true,
    });
    advanceFocusTimers(clock);

    assert.strictEqual(c._disableSearchAutofocus, true);
    assert.strictEqual(focusCalls, 0);
    assert.strictEqual(c._searchInputAutoFocused, false);
  });

  it("delegates updated() autofocus via SearchController and respects disable_autofocus", (t) => {
    const clock = t.mock.timers;
    clock.enable({ apis: ["setTimeout"] });

    const disabledCard = setupCard();
    disabledCard.setConfig({
      entities: ["media_player.upstairs_speakers"],
      disable_autofocus: true,
    });
    disabledCard._showSearchInSheet = true;
    disabledCard.updated(new Map());
    advanceFocusTimers(clock);
    assert.strictEqual(focusCalls, 0);

    const enabledCard = setupCard();
    enabledCard.setConfig({
      entities: ["media_player.upstairs_speakers"],
      disable_autofocus: false,
    });
    enabledCard._showSearchInSheet = true;
    enabledCard.updated(new Map());
    advanceFocusTimers(clock);
    assert.strictEqual(focusCalls, 1);
    assert.strictEqual(enabledCard._searchInputAutoFocused, true);
  });
});
