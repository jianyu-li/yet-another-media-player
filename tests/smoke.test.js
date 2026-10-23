import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { menusSheetsStyles } from "../src/styles/menus-sheets.js";

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
});
