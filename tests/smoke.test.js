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
});
