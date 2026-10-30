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

describe("Search Filter Chips & Header Wheel Scroll", () => {
  let card;

  beforeEach(() => {
    card = new YetAnotherMediaPlayerCard();
    card.config = {};
  });

  function createMockWheelEvent({ deltaX = 0, deltaY = 0, cancelable = true, target = null } = {}) {
    let defaultPrevented = false;
    let propagationStopped = false;

    return {
      deltaX,
      deltaY,
      cancelable,
      target: target || {
        closest: () => null,
      },
      preventDefault() {
        defaultPrevented = true;
      },
      stopPropagation() {
        propagationStopped = true;
      },
      get defaultPrevented() {
        return defaultPrevented;
      },
      get propagationStopped() {
        return propagationStopped;
      },
    };
  }

  describe("_handleFilterChipsWheel", () => {
    it("stops propagation on horizontal trackpad swipe without preventing default", () => {
      const event = createMockWheelEvent({ deltaX: 25, deltaY: 0 });
      card._handleFilterChipsWheel(event);

      assert.equal(event.propagationStopped, true);
      assert.equal(event.defaultPrevented, false);
    });

    it("stops propagation on diagonal horizontal trackpad swipe without preventing default", () => {
      const event = createMockWheelEvent({ deltaX: -20, deltaY: 5 });
      card._handleFilterChipsWheel(event);

      assert.equal(event.propagationStopped, true);
      assert.equal(event.defaultPrevented, false);
    });

    it("does not stop propagation on vertical trackpad swipe over filter chips", () => {
      const event = createMockWheelEvent({ deltaX: 0, deltaY: 30 });
      card._handleFilterChipsWheel(event);

      assert.equal(event.propagationStopped, false);
      assert.equal(event.defaultPrevented, false);
    });
  });

  describe("_handleHeaderWheel", () => {
    it("allows native horizontal scroll when target is inside filter chips", () => {
      const mockChipRow = { classList: { contains: (c) => c === "search-filter-chips" } };
      const event = createMockWheelEvent({
        deltaX: 30,
        deltaY: 2,
        target: {
          closest: (selector) => (selector === ".search-filter-chips" ? mockChipRow : null),
        },
      });

      let deltaApplied = false;
      card._applySearchHeaderDelta = () => {
        deltaApplied = true;
      };

      card._handleHeaderWheel(event, false);

      assert.equal(event.propagationStopped, true);
      assert.equal(event.defaultPrevented, false);
      assert.equal(deltaApplied, false);
    });

    it("bypasses vertical header handling on horizontal swipe across header", () => {
      const event = createMockWheelEvent({ deltaX: 40, deltaY: 0 });
      let deltaApplied = false;
      card._applySearchHeaderDelta = () => {
        deltaApplied = true;
      };

      card._handleHeaderWheel(event, false);

      assert.equal(event.defaultPrevented, false);
      assert.equal(deltaApplied, false);
    });

    it("applies header delta on vertical swipe when headers are unpinned", () => {
      const event = createMockWheelEvent({ deltaX: 0, deltaY: 25 });
      let appliedDelta = null;
      card._applySearchHeaderDelta = (delta) => {
        appliedDelta = delta;
      };

      card._handleHeaderWheel(event, false);

      assert.equal(event.defaultPrevented, true);
      assert.equal(event.propagationStopped, true);
      assert.equal(appliedDelta, 25);
    });

    it("scrolls search results on vertical swipe when headers are pinned", () => {
      const event = createMockWheelEvent({ deltaX: 0, deltaY: 15 });
      const mockResults = { scrollTop: 50 };
      card._getSearchResultsElement = () => mockResults;

      card._handleHeaderWheel(event, true);

      assert.equal(event.defaultPrevented, true);
      assert.equal(event.propagationStopped, true);
      assert.equal(mockResults.scrollTop, 65);
    });
  });

  describe("_handleSearchContainerWheel", () => {
    it("ignores horizontal trackpad swipes", () => {
      const event = createMockWheelEvent({ deltaX: 35, deltaY: 2 });
      let deltaApplied = false;
      card._applySearchHeaderDelta = () => {
        deltaApplied = true;
      };

      card._handleSearchContainerWheel(event, false);

      assert.equal(event.defaultPrevented, false);
      assert.equal(deltaApplied, false);
    });
  });
});
