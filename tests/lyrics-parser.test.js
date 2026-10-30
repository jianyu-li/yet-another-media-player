import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseLrc } from "../src/lyrics-parser.js";

describe("lyrics-parser (parseLrc)", () => {
  describe("Invalid & Empty Inputs", () => {
    it("returns an empty array for null or undefined input", () => {
      assert.deepEqual(parseLrc(/** @type {any} */ (null)), []);
      assert.deepEqual(parseLrc(/** @type {any} */ (undefined)), []);
    });

    it("returns an empty array for non-string input types", () => {
      assert.deepEqual(parseLrc(/** @type {any} */ (123)), []);
      assert.deepEqual(parseLrc(/** @type {any} */ ({})), []);
      assert.deepEqual(parseLrc(/** @type {any} */ ([])), []);
      assert.deepEqual(parseLrc(/** @type {any} */ (true)), []);
    });

    it("returns an empty array for empty or whitespace-only strings", () => {
      assert.deepEqual(parseLrc(""), []);
      assert.deepEqual(parseLrc("   \n\t  \r\n   "), []);
    });
  });

  describe("Timestamp Parsing & Fraction Precision", () => {
    it("parses standard [mm:ss.xx] 2-digit fractions correctly", () => {
      const lrc = "[00:03.45] First lyric line";
      const result = parseLrc(lrc);
      assert.equal(result.length, 1);
      assert.equal(result[0].time, 3.45);
      assert.equal(result[0].text, "First lyric line");
    });

    it("parses standard [mm:ss.xxx] 3-digit millisecond fractions correctly", () => {
      const lrc = "[00:05.500] Second lyric line";
      const result = parseLrc(lrc);
      assert.equal(result.length, 1);
      assert.equal(result[0].time, 5.5);
      assert.equal(result[0].text, "Second lyric line");
    });

    it("supports colon separator for fractions [mm:ss:xx]", () => {
      const lrc = "[00:04:34] Colon fraction lyric";
      const result = parseLrc(lrc);
      assert.equal(result.length, 1);
      assert.equal(result[0].time, 4.34);
      assert.equal(result[0].text, "Colon fraction lyric");
    });

    it("parses minutes conversion and accommodates intro gap for >= 10s", () => {
      const lrc = "[01:23.45] Minute offset lyric";
      const result = parseLrc(lrc);
      assert.equal(result.length, 2);
      assert.deepEqual(result[0], { time: 0, text: "", isInstrumental: true });
      assert.equal(result[1].time, 83.45);
      assert.equal(result[1].text, "Minute offset lyric");
    });

    it("handles large minute numbers without error", () => {
      const lrc = "[75:10.00] Extended track line";
      const result = parseLrc(lrc);
      // Gap from 0 to 4510s >= 10s triggers intro instrumental break
      assert.equal(result.length, 2);
      assert.deepEqual(result[0], { time: 0, text: "", isInstrumental: true });
      assert.equal(result[1].time, 4510);
      assert.equal(result[1].text, "Extended track line");
    });

    it("falls back to unsynced if seconds exceed 59 (strict regex [0-5]\\d)", () => {
      const lrc = "[01:65.00] Invalid seconds";
      const result = parseLrc(lrc);
      assert.equal(result.length, 1);
      assert.equal(result[0].time, null);
      assert.equal(result[0].text, "[01:65.00] Invalid seconds");
    });
  });

  describe("Repeated Time Tags (Multiple Timestamps Per Line)", () => {
    it("expands multiple timestamps on a single line into separate sorted lines", () => {
      const lrc = "[00:04.00][00:08.00] Repeated chorus hook";
      const result = parseLrc(lrc);
      assert.equal(result.length, 2);
      assert.equal(result[0].time, 4);
      assert.equal(result[0].text, "Repeated chorus hook");
      assert.equal(result[1].time, 8);
      assert.equal(result[1].text, "Repeated chorus hook");
    });
  });

  describe("Metadata Tags", () => {
    it("ignores and filters standard LRC metadata tags", () => {
      const lrc = `
        [ti:Song Title]
        [ar:Artist Name]
        [al:Album Name]
        [by:Lyricist]
        [offset:+500]
        [00:02.00] Real lyric line
      `;
      const result = parseLrc(lrc);
      assert.equal(result.length, 1);
      assert.equal(result[0].time, 2);
      assert.equal(result[0].text, "Real lyric line");
    });

    it("returns empty array if LRC consists exclusively of metadata tags", () => {
      const lrc = `
        [ti:No Lyrics Available]
        [ar:Various]
        [length:03:30]
      `;
      assert.deepEqual(parseLrc(lrc), []);
    });
  });

  describe("Chronological Sorting", () => {
    it("sorts out-of-order timestamps chronologically", () => {
      const lrc = `
        [00:08.00] Third line
        [00:02.00] First line
        [00:05.00] Second line
      `;
      const result = parseLrc(lrc);
      assert.equal(result.length, 3);
      assert.equal(result[0].text, "First line");
      assert.equal(result[0].time, 2);
      assert.equal(result[1].text, "Second line");
      assert.equal(result[1].time, 5);
      assert.equal(result[2].text, "Third line");
      assert.equal(result[2].time, 8);
    });
  });

  describe("Unsynced / Plain-Text Lyrics", () => {
    it("treats plain-text lines as unsynced lyrics with time: null", () => {
      const lrc = `
        Just plain text lyrics
        Without any timestamps
        Flowing line by line
      `;
      const result = parseLrc(lrc);
      assert.equal(result.length, 3);
      assert.deepEqual(result, [
        { time: null, text: "Just plain text lyrics" },
        { time: null, text: "Without any timestamps" },
        { time: null, text: "Flowing line by line" },
      ]);
    });

    it("places unsynced trailing lines after timed lines", () => {
      const lrc = `
        [00:02.00] Timed line 1
        [00:06.00] Timed line 2
        Unsynced outro note
      `;
      const result = parseLrc(lrc);
      assert.equal(result.length, 3);
      assert.equal(result[0].time, 2);
      assert.equal(result[1].time, 6);
      assert.equal(result[2].time, null);
      assert.equal(result[2].text, "Unsynced outro note");
    });
  });

  describe("Instrumental Indicators", () => {
    it("detects standalone bracketed instrumental indicators", () => {
      assert.deepEqual(parseLrc("[instrumental]"), [
        { time: 0, text: "Instrumental Track", isInstrumental: true },
      ]);
      assert.deepEqual(parseLrc("[Instrumental Track]"), [
        { time: 0, text: "Instrumental Track", isInstrumental: true },
      ]);
    });

    it("detects standalone parenthesized instrumental indicators", () => {
      assert.deepEqual(parseLrc("(instrumental)"), [
        { time: 0, text: "Instrumental Track", isInstrumental: true },
      ]);
      assert.deepEqual(parseLrc("(Instrumental Track)"), [
        { time: 0, text: "Instrumental Track", isInstrumental: true },
      ]);
    });
  });

  describe("Instrumental Gap Breaks Insertion", () => {
    it("inserts an intro instrumental break if first lyric starts at >= 10.0s", () => {
      const lrc = "[00:15.00] First lyric after long intro";
      const result = parseLrc(lrc);
      assert.equal(result.length, 2);
      assert.deepEqual(result[0], { time: 0, text: "", isInstrumental: true });
      assert.equal(result[1].time, 15);
      assert.equal(result[1].text, "First lyric after long intro");
    });

    it("does not insert intro instrumental break if first lyric starts at < 10.0s", () => {
      const lrc = "[00:05.00] Quick intro line";
      const result = parseLrc(lrc);
      assert.equal(result.length, 1);
      assert.equal(result[0].time, 5);
      assert.equal(result[0].text, "Quick intro line");
    });

    it("inserts mid-track instrumental breaks for gaps >= 10.0s (placed at +3s for large gaps)", () => {
      const lrc = `
        [00:02.00] First verse line
        [00:22.00] Line after 20 second solo
      `;
      const result = parseLrc(lrc);
      assert.equal(result.length, 3);
      assert.equal(result[0].time, 2);
      assert.equal(result[0].text, "First verse line");
      // Gap is 20s (>= 6s modifier), so instrumental break is at 2 + 3 = 5s
      assert.deepEqual(result[1], { time: 5, text: "", isInstrumental: true });
      assert.equal(result[2].time, 22);
      assert.equal(result[2].text, "Line after 20 second solo");
    });

    it("does not insert instrumental break when gap between lines is < 10.0s", () => {
      const lrc = `
        [00:02.00] Line 1
        [00:09.00] Line 2 (7s gap)
      `;
      const result = parseLrc(lrc);
      assert.equal(result.length, 2);
      assert.equal(result[0].time, 2);
      assert.equal(result[1].time, 9);
    });
  });

  describe("Silence / Empty Timestamp Lines", () => {
    it("filters out timed lines with empty text", () => {
      const lrc = `
        [00:02.00] Line 1
        [00:05.00]
        [00:07.00]   
        [00:09.00] Line 2
      `;
      const result = parseLrc(lrc);
      assert.equal(result.length, 2);
      assert.equal(result[0].time, 2);
      assert.equal(result[0].text, "Line 1");
      assert.equal(result[1].time, 9);
      assert.equal(result[1].text, "Line 2");
    });
  });
});
