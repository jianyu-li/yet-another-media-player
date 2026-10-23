import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Localization Parity Test", () => {
  it("ensures all 10 language dictionaries have 100% key parity with en.js", async () => {
    const enMod = await import("../src/localize/languages/en.js");
    const en = enMod.default;

    /**
     * @param {Record<string, any>} obj
     * @param {string} [prefix]
     * @returns {string[]}
     */
    const getKeys = (obj, prefix = "") =>
      Object.keys(obj).flatMap((k) =>
        typeof obj[k] === "object" && obj[k] !== null
          ? getKeys(obj[k], prefix ? `${prefix}.${k}` : k)
          : [prefix ? `${prefix}.${k}` : k]
      );

    const enKeys = new Set(getKeys(en));
    assert.ok(enKeys.size > 0, "en.js should have defined localization keys");

    const languages = ["de", "es", "fr", "it", "nl", "pt", "sk", "sl", "sr", "sr-Latn"];

    for (const lang of languages) {
      const mod = await import(`../src/localize/languages/${lang}.js`);
      const langKeys = new Set(getKeys(mod.default));
      const missing = [...enKeys].filter((k) => !langKeys.has(k));

      assert.strictEqual(
        missing.length,
        0,
        `${lang}.js is missing ${missing.length} keys from en.js: ${missing.join(", ")}`
      );
    }
  });
});
