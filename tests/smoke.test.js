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
});
