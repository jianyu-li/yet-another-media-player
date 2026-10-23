import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { menusSheetsStyles } from "../src/styles/menus-sheets.js";
import { baseCardStyles } from "../src/styles/base-card.js";

describe("Test Harness Verification", () => {
  it("executes basic assertions successfully", () => {
    assert.equal(1 + 1, 2);
  });

  it("defaults in-menu-active-label color to light grey rather than pure white", () => {
    const cssText = menusSheetsStyles.cssText;
    assert.ok(
      cssText.includes(".in-menu-active-label"),
      "Should contain .in-menu-active-label style rule"
    );
    assert.ok(
      cssText.includes("#aaa"),
      "in-menu-active-label should include #aaa light grey fallback"
    );
  });

  it("does not include unused .grouped-card-badge selector in menus-sheets styles", () => {
    const cssText = menusSheetsStyles.cssText;
    assert.strictEqual(
      cssText.includes(".grouped-card-badge"),
      false,
      "Should not contain unused .grouped-card-badge rule"
    );
  });

  it("does not apply backdrop-filter to entity-options-overlay to prevent hover compositing artifacts", () => {
    const cssText = menusSheetsStyles.cssText;
    assert.strictEqual(
      cssText.includes(".entity-options-overlay") &&
        cssText.includes("backdrop-filter") &&
        !cssText.includes("remote-dpad-cross")
        ? false
        : true,
      true
    );
    // Explicit regex test for .entity-options-overlay block
    const match = cssText.match(/\.entity-options-overlay\s*\{([^}]+)\}/);
    assert.ok(match, "Should contain .entity-options-overlay rule");
    assert.strictEqual(
      match[1].includes("backdrop-filter"),
      false,
      ".entity-options-overlay must not include backdrop-filter"
    );
  });

  it("retains border-radius: 10px on entity-options-item", () => {
    const cssText = menusSheetsStyles.cssText;
    assert.ok(cssText.includes(".entity-options-item"), "Should contain .entity-options-item rule");
    assert.ok(
      cssText.includes("border-radius: 10px;"),
      "Should retain border-radius: 10px on entity-options-item"
    );
  });

  it("uses --yamp-background-fade in baseCardStyles for theme-aware overlay fade", () => {
    const cssText = baseCardStyles.cssText;
    assert.ok(
      cssText.includes("--yamp-background-fade"),
      "baseCardStyles should utilize --yamp-background-fade in --yamp-overlay-bg definitions"
    );
    assert.ok(
      cssText.includes('.yamp-card-inner[data-options-active="true"] .card-lower-fade'),
      "baseCardStyles should hide card-lower-fade when data-options-active is true"
    );
    assert.ok(
      cssText.includes('.yamp-card-inner[data-options-active="true"] .full-bleed-artwork-fade'),
      "baseCardStyles should hide full-bleed-artwork-fade when data-options-active is true"
    );
  });

  it("references --yamp-background-fade in .entity-options-overlay fallback background", () => {
    const cssText = menusSheetsStyles.cssText;
    const match = cssText.match(/\.entity-options-overlay\s*\{([^}]+)\}/);
    assert.ok(match, "Should contain .entity-options-overlay rule");
    assert.ok(
      match[1].includes("--yamp-background-fade"),
      ".entity-options-overlay background must reference --yamp-background-fade"
    );
  });
});
