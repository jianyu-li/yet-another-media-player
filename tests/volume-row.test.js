import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { html, nothing } from "lit";
import { renderVolumeRow } from "../src/volume-row.js";

/**
 * Recursively serializes a Lit TemplateResult into a plain HTML string.
 * @param {any} tpl
 * @returns {string}
 */
function renderToString(tpl) {
  if (tpl === nothing || tpl === null || tpl === undefined) return "";
  if (typeof tpl === "string" || typeof tpl === "number" || typeof tpl === "boolean") {
    return String(tpl);
  }
  if (typeof tpl === "symbol") return "";
  if (Array.isArray(tpl)) {
    return tpl.map(renderToString).join("");
  }
  if (tpl && typeof tpl === "object" && tpl.strings && Array.isArray(tpl.values)) {
    let out = "";
    tpl.strings.forEach((str, i) => {
      out += str;
      if (i < tpl.values.length) {
        out += renderToString(tpl.values[i]);
      }
    });
    return out;
  }
  return "";
}

/**
 * Helper to inspect and parse key DOM fragments and attributes from renderVolumeRow.
 * @param {any} tpl
 */
function parseVolumeRow(tpl) {
  const htmlStr = renderToString(tpl);

  // Parse root volume-row attributes
  const rowMatch = htmlStr.match(/<div\s+class="volume-row([^"]*)"\s+style="([^"]*)"/);
  const rowClasses = rowMatch ? rowMatch[1].trim() : "";
  const rowStyle = rowMatch ? rowMatch[2].trim() : "";
  const isRowCollapsed = rowStyle.includes("display: none !important;");

  // Parse volume-left inner HTML
  const leftMatch = htmlStr.match(
    /<div class="volume-left">([\s\S]*?)<\/div>\s*<div\s+class="volume-center"/
  );
  const leftHtml = leftMatch ? leftMatch[1] : "";

  // The mute slot container is the div with display: flex; align-items: center; justify-content: center;
  const muteContainerMatch = leftHtml.match(
    /<div\s+style="([^"]*display:\s*flex[^"]*)"\s*>([\s\S]*?)<\/div>\s*$/
  );
  const muteStyle = muteContainerMatch ? muteContainerMatch[1] : "";
  const muteContent = muteContainerMatch ? muteContainerMatch[2].trim() : "";
  const isMuteHidden =
    muteStyle.includes("visibility:hidden") ||
    muteStyle.includes("visibility: hidden") ||
    muteStyle.includes("opacity:0");

  // Parse volume-center
  const centerMatch = htmlStr.match(
    /<div\s+class="volume-center"\s+style="([^"]*)"\s*>([\s\S]*?)<\/div>\s*<div class="volume-right">/
  );
  const centerStyle = centerMatch ? centerMatch[1] : "";
  const centerContent = centerMatch ? centerMatch[2].trim() : "";
  const isCenterHidden =
    centerStyle.includes("visibility:hidden") ||
    centerStyle.includes("visibility: hidden") ||
    centerStyle.includes("opacity:0");

  // Parse volume-right
  const rightMatch = htmlStr.match(/<div class="volume-right">([\s\S]*?)<\/div>\s*<\/div>\s*$/);
  const rightContent = rightMatch ? rightMatch[1].trim() : "";

  return {
    html: htmlStr,
    rowClasses,
    rowStyle,
    isRowCollapsed,
    leftHtml,
    muteStyle,
    muteContent,
    isMuteHidden,
    centerStyle,
    centerContent,
    isCenterHidden,
    rightContent,
  };
}

/**
 * Deep search to find all function values bound inside a Lit TemplateResult.
 * @param {any} val
 * @returns {Function[]}
 */
function findFunctions(val) {
  /** @type {Function[]} */
  const fns = [];
  if (typeof val === "function") {
    fns.push(val);
  } else if (Array.isArray(val)) {
    for (const item of val) {
      fns.push(...findFunctions(item));
    }
  } else if (val && typeof val === "object" && Array.isArray(val.values)) {
    for (const item of val.values) {
      fns.push(...findFunctions(item));
    }
  }
  return fns;
}

describe("renderVolumeRow - Volume Mode Hidden (hideVolume: true)", () => {
  it("keeps custom muteSlotTemplate action visible while hiding volume-center and avoiding collapse", () => {
    const customSlot = html`<button class="custom-mute-btn">Custom Action</button>`;
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        muteSlotTemplate: customSlot,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    // Mute container must NOT contain hidden styles
    assert.equal(
      parsed.isMuteHidden,
      false,
      "Container wrapping muteSlotTemplate must not be hidden"
    );
    assert.ok(
      !parsed.muteStyle.includes("visibility:hidden; opacity:0; pointer-events:none;"),
      "Mute container style must not contain visibility:hidden"
    );
    assert.ok(
      parsed.muteContent.includes("custom-mute-btn"),
      "Mute container should render custom-mute-btn"
    );

    // Volume-center MUST be hidden
    assert.equal(parsed.isCenterHidden, true, "Volume-center must be hidden when hideVolume: true");
    assert.ok(
      parsed.centerStyle.includes("visibility:hidden; opacity:0; pointer-events:none;"),
      "Volume-center must contain visibility:hidden; opacity:0; pointer-events:none;"
    );

    // When collapseRow is omitted, row does not collapse because hasMuteAction is true
    assert.equal(
      parsed.isRowCollapsed,
      false,
      "volume-row should NOT collapse when muteSlotTemplate is provided"
    );
    assert.ok(
      !parsed.rowStyle.includes("display: none !important;"),
      "volume-row style should not contain display: none !important;"
    );
  });

  it("hides mute container and collapses row when hideVolume: true and muteSlotTemplate: nothing", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    // Mute container MUST be hidden
    assert.equal(
      parsed.isMuteHidden,
      true,
      "Container wrapping mute button must be hidden when muteSlotTemplate is nothing"
    );
    assert.ok(
      parsed.muteStyle.includes("visibility:hidden; opacity:0; pointer-events:none;"),
      "Mute container style must contain visibility:hidden; opacity:0; pointer-events:none;"
    );
    // Default mute button is still in the DOM structure (styled hidden)
    assert.ok(
      parsed.muteContent.includes("volume-icon-btn"),
      "Default volume-icon-btn is preserved in DOM"
    );

    // Volume-center MUST be hidden
    assert.equal(parsed.isCenterHidden, true, "Volume-center must be hidden when hideVolume: true");
    assert.ok(
      parsed.centerStyle.includes("visibility:hidden; opacity:0; pointer-events:none;"),
      "Volume-center must contain visibility:hidden; opacity:0; pointer-events:none;"
    );

    // Row MUST collapse when collapseRow is omitted and no leading control, right placeholder, or moreInfoMenu
    assert.equal(
      parsed.isRowCollapsed,
      true,
      "volume-row should collapse when hideVolume: true and no actions exist"
    );
    assert.ok(
      parsed.rowStyle.includes("display: none !important;"),
      "volume-row style must contain display: none !important;"
    );
  });

  it("treats null or undefined muteSlotTemplate as no mute action (hidden container and collapsed row)", () => {
    for (const emptySlot of [null, undefined]) {
      const tpl = renderVolumeRow(
        /** @type {any} */ ({
          hideVolume: true,
          muteSlotTemplate: emptySlot,
          moreInfoMenu: nothing,
        })
      );
      const parsed = parseVolumeRow(tpl);

      assert.equal(
        parsed.isMuteHidden,
        true,
        `Mute container must be hidden when muteSlotTemplate is ${emptySlot}`
      );
      assert.equal(
        parsed.isCenterHidden,
        true,
        `Volume-center must be hidden when muteSlotTemplate is ${emptySlot}`
      );
      assert.equal(
        parsed.isRowCollapsed,
        true,
        `Row should collapse when muteSlotTemplate is ${emptySlot}`
      );
    }
  });

  it("supports string and plain text custom mute actions", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        muteSlotTemplate: "TextAction",
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.equal(parsed.isMuteHidden, false, "Container should be visible for string action");
    assert.ok(parsed.muteContent.includes("TextAction"), "Container should render string action");
    assert.equal(parsed.isRowCollapsed, false, "Row should not collapse with string action");
  });
});

describe("renderVolumeRow - Standard Volume Mode (hideVolume: false)", () => {
  it("renders custom muteSlotTemplate with visible container and visible volume-center", () => {
    const customSlot = html`<div class="eq-control-btn">EQ</div>`;
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: false,
        muteSlotTemplate: customSlot,
        moreInfoMenu: nothing,
        vol: 0.5,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.equal(parsed.isMuteHidden, false, "Mute container must be visible");
    assert.ok(parsed.muteContent.includes("eq-control-btn"), "Renders custom eq button");
    assert.equal(parsed.isCenterHidden, false, "Volume center must be visible");
    assert.equal(parsed.isRowCollapsed, false, "Volume row must not collapse");
  });

  it("renders default mute button with visible container and visible volume-center", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: false,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
        vol: 0.7,
        supportsMute: true,
        isMuted: false,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.equal(parsed.isMuteHidden, false, "Mute container must be visible");
    assert.ok(
      parsed.muteContent.includes("volume-icon-btn"),
      "Default volume-icon-btn should be rendered"
    );
    assert.equal(parsed.isCenterHidden, false, "Volume center must be visible");
    assert.equal(parsed.isRowCollapsed, false, "Volume row must not collapse");
  });
});

describe("renderVolumeRow - Remote Volume Entity (isRemoteVolumeEntity: true)", () => {
  it("renders custom muteSlotTemplate visibly even when isRemoteVolumeEntity: true", () => {
    const customSlot = html`<button class="custom-mute-btn">Remote Mute</button>`;
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        isRemoteVolumeEntity: true,
        hideVolume: false,
        muteSlotTemplate: customSlot,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.equal(
      parsed.isMuteHidden,
      false,
      "Mute container must be visible when custom action is provided"
    );
    assert.ok(
      parsed.muteContent.includes("custom-mute-btn"),
      "Custom mute slot template is rendered"
    );
    assert.ok(
      parsed.centerContent.includes('class="vol-label">vol<'),
      "Volume center renders remote stepper with vol label"
    );
  });

  it("hides mute container when isRemoteVolumeEntity: true and muteSlotTemplate: nothing", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        isRemoteVolumeEntity: true,
        hideVolume: false,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.equal(
      parsed.isMuteHidden,
      true,
      "Mute container must be hidden for remote entity without custom action"
    );
    assert.ok(
      parsed.muteStyle.includes("visibility:hidden; opacity:0; pointer-events:none;"),
      "Mute container contains visibility:hidden; opacity:0; pointer-events:none;"
    );
    assert.ok(
      parsed.centerContent.includes('class="vol-label">vol<'),
      "Volume center renders remote stepper with vol label"
    );
  });

  it("never enables slider mode on remote volume entities even if showSlider: true", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        isRemoteVolumeEntity: true,
        showSlider: true,
        hideVolume: false,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.ok(!parsed.rowClasses.includes("has-slider"), "has-slider class should not be present");
    assert.ok(
      !parsed.centerContent.includes("volume-slider-container"),
      "Slider container must not be rendered"
    );
    assert.ok(
      parsed.centerContent.includes("vol-stepper-container"),
      "Remote stepper container must be rendered"
    );
  });
});

describe("renderVolumeRow - Volume Row Collapse Logic", () => {
  it("explicit collapseRow: true always forces display: none !important;", () => {
    // Case A: normal volume mode with active mute action
    const tplA = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: false,
        collapseRow: true,
        muteSlotTemplate: html`<button>Mute</button>`,
        moreInfoMenu: html`<div>menu</div>`,
      })
    );
    assert.equal(parseVolumeRow(tplA).isRowCollapsed, true);

    // Case B: hidden volume mode with active mute action
    const tplB = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        collapseRow: true,
        muteSlotTemplate: html`<button>Mute</button>`,
        moreInfoMenu: nothing,
      })
    );
    assert.equal(parseVolumeRow(tplB).isRowCollapsed, true);
  });

  it("explicit collapseRow: false always prevents display: none !important;", () => {
    // Even when hideVolume: true and no actions or slots exist
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        collapseRow: false,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
        leadingControlTemplate: nothing,
        showRightPlaceholder: false,
      })
    );
    assert.equal(parseVolumeRow(tpl).isRowCollapsed, false);
  });

  it("automatic collapse: remains visible if moreInfoMenu is present", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        muteSlotTemplate: nothing,
        moreInfoMenu: html`<div class="more-info-menu">Menu</div>`,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.equal(
      parsed.isRowCollapsed,
      false,
      "Row should not collapse when moreInfoMenu is present"
    );
    assert.ok(parsed.rightContent.includes("more-info-menu"));
  });

  it("automatic collapse: remains visible if leadingControlTemplate is present", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
        leadingControlTemplate: html`<button class="custom-leading">Leading</button>`,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.equal(
      parsed.isRowCollapsed,
      false,
      "Row should not collapse when leadingControlTemplate is present"
    );
    assert.ok(parsed.leftHtml.includes("custom-leading"));
  });

  it("automatic collapse: remains visible if showRightPlaceholder: true", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
        showRightPlaceholder: true,
        rightSlotTemplate: html`<span class="right-action">Right</span>`,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.equal(
      parsed.isRowCollapsed,
      false,
      "Row should not collapse when showRightPlaceholder is true"
    );
    assert.ok(parsed.rightContent.includes("volume-placeholder"));
    assert.ok(parsed.rightContent.includes("right-action"));
  });

  it("automatic collapse: remains visible if muteSlotTemplate is present", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: true,
        muteSlotTemplate: html`<button class="custom-mute">Mute</button>`,
        moreInfoMenu: nothing,
        leadingControlTemplate: nothing,
        showRightPlaceholder: false,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.equal(
      parsed.isRowCollapsed,
      false,
      "Row should not collapse when muteSlotTemplate is present"
    );
  });

  it("automatic collapse: never collapses when hideVolume: false", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        hideVolume: false,
        muteSlotTemplate: nothing,
        moreInfoMenu: nothing,
        leadingControlTemplate: nothing,
        showRightPlaceholder: false,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.equal(parsed.isRowCollapsed, false, "Row should not collapse when hideVolume is false");
  });
});

describe("renderVolumeRow - Center Controls Layout (Slider vs Stepper)", () => {
  it("renders volume slider when showSlider: true", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        showSlider: true,
        vol: 0.65,
        dragVol: 0.65,
        isDragging: false,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.ok(
      parsed.rowClasses.includes("has-slider"),
      "Row must have has-slider class when showSlider: true"
    );
    assert.ok(
      parsed.centerContent.includes("volume-slider-container"),
      "Center contains volume-slider-container"
    );
    assert.ok(parsed.centerContent.includes('type="range"'), "Center contains range input");
    assert.ok(
      parsed.centerContent.includes('step="0.01"'),
      "Slider contains step attribute of 0.01"
    );
    assert.ok(
      parsed.centerContent.includes("volume-percentage-indicator"),
      "Contains volume-percentage-indicator"
    );
    assert.ok(
      !parsed.centerContent.includes("volume-percentage-indicator visible"),
      "Indicator is not visible when isDragging is false"
    );
  });

  it("displays percentage indicator as visible when isDragging: true", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        showSlider: true,
        vol: 0.42,
        dragVol: 0.42,
        isDragging: true,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.ok(
      parsed.centerContent.includes("volume-percentage-indicator visible"),
      "Indicator has visible class when dragging"
    );
    assert.ok(
      parsed.centerContent.includes("42%"),
      "Indicator displays rounded drag volume percentage"
    );
    assert.ok(
      parsed.centerContent.includes("left: calc(33px + 0.42 * (100% - 66px))"),
      "Indicator position correctly computed"
    );
  });

  it("renders stepper controls when showSlider: false", () => {
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        showSlider: false,
        vol: 0.55,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);

    assert.ok(
      !parsed.rowClasses.includes("has-slider"),
      "Row must not have has-slider class when showSlider: false"
    );
    assert.ok(
      parsed.centerContent.includes("vol-stepper-container"),
      "Center contains vol-stepper-container"
    );
    assert.ok(
      parsed.centerContent.includes('<span class="vol-value">55%</span>'),
      "Stepper displays formatted percentage"
    );
    assert.ok(parsed.centerContent.includes("–"), "Stepper contains decrement symbol");
    assert.ok(parsed.centerContent.includes("+"), "Stepper contains increment symbol");
  });

  it("adds vol-stepper-holdable class when holdHandlers are provided", () => {
    const mockHoldHandlers = {
      onPointerDown: () => {},
      onPointerMove: () => {},
      onPointerUp: () => {},
      onPointerCancel: () => {},
      onLostPointerCapture: () => {},
      onContextMenu: () => {},
      clickCapture: () => {},
    };
    const tplWithHandlers = renderVolumeRow(
      /** @type {any} */ ({
        showSlider: false,
        vol: 0.3,
        holdHandlers: mockHoldHandlers,
        moreInfoMenu: nothing,
      })
    );
    assert.ok(
      parseVolumeRow(tplWithHandlers).centerContent.includes("vol-stepper-holdable"),
      "Stepper has vol-stepper-holdable class when handlers provided"
    );

    const tplWithoutHandlers = renderVolumeRow(
      /** @type {any} */ ({
        showSlider: false,
        vol: 0.3,
        holdHandlers: null,
        moreInfoMenu: nothing,
      })
    );
    assert.ok(
      !parseVolumeRow(tplWithoutHandlers).centerContent.includes("vol-stepper-holdable"),
      "Stepper lacks vol-stepper-holdable class when handlers null"
    );
  });
});

describe("renderVolumeRow - Mute Button Icon & State Determination", () => {
  it("determines volume icon based on volume level and mute state when supportsMute: true", () => {
    // Muted -> mdi:volume-off, Unmute title
    const tplMuted = renderVolumeRow(
      /** @type {any} */ ({
        supportsMute: true,
        isMuted: true,
        vol: 0.8,
        moreInfoMenu: nothing,
      })
    );
    const parsedMuted = parseVolumeRow(tplMuted);
    assert.ok(parsedMuted.muteContent.includes("icon=mdi:volume-off"));
    assert.ok(parsedMuted.muteContent.includes("title=Unmute"));

    // Unmuted, vol = 0 -> mdi:volume-off, Mute title
    const tplZero = renderVolumeRow(
      /** @type {any} */ ({
        supportsMute: true,
        isMuted: false,
        vol: 0,
        moreInfoMenu: nothing,
      })
    );
    const parsedZero = parseVolumeRow(tplZero);
    assert.ok(parsedZero.muteContent.includes("icon=mdi:volume-off"));
    assert.ok(parsedZero.muteContent.includes("title=Mute"));

    // Unmuted, vol < 0.2 -> mdi:volume-low, Mute title
    const tplLow = renderVolumeRow(
      /** @type {any} */ ({
        supportsMute: true,
        isMuted: false,
        vol: 0.15,
        moreInfoMenu: nothing,
      })
    );
    const parsedLow = parseVolumeRow(tplLow);
    assert.ok(parsedLow.muteContent.includes("icon=mdi:volume-low"));
    assert.ok(parsedLow.muteContent.includes("title=Mute"));

    // Unmuted, 0.2 <= vol < 0.5 -> mdi:volume-medium, Mute title
    const tplMed = renderVolumeRow(
      /** @type {any} */ ({
        supportsMute: true,
        isMuted: false,
        vol: 0.35,
        moreInfoMenu: nothing,
      })
    );
    const parsedMed = parseVolumeRow(tplMed);
    assert.ok(parsedMed.muteContent.includes("icon=mdi:volume-medium"));
    assert.ok(parsedMed.muteContent.includes("title=Mute"));

    // Unmuted, vol >= 0.5 -> mdi:volume-high, Mute title
    const tplHigh = renderVolumeRow(
      /** @type {any} */ ({
        supportsMute: true,
        isMuted: false,
        vol: 0.75,
        moreInfoMenu: nothing,
      })
    );
    const parsedHigh = parseVolumeRow(tplHigh);
    assert.ok(parsedHigh.muteContent.includes("icon=mdi:volume-high"));
    assert.ok(parsedHigh.muteContent.includes("title=Mute"));
  });

  it("determines volume icon based on volume level when supportsMute: false", () => {
    // When supportsMute: false and vol: 0 -> effectiveMuted is true -> title Unmute
    const tplZero = renderVolumeRow(
      /** @type {any} */ ({
        supportsMute: false,
        isMuted: false,
        vol: 0,
        moreInfoMenu: nothing,
      })
    );
    const parsedZero = parseVolumeRow(tplZero);
    assert.ok(parsedZero.muteContent.includes("icon=mdi:volume-off"));
    assert.ok(parsedZero.muteContent.includes("title=Unmute"));

    // When supportsMute: false and vol: 0.4 -> title Mute
    const tplMed = renderVolumeRow(
      /** @type {any} */ ({
        supportsMute: false,
        isMuted: false,
        vol: 0.4,
        moreInfoMenu: nothing,
      })
    );
    const parsedMed = parseVolumeRow(tplMed);
    assert.ok(parsedMed.muteContent.includes("icon=mdi:volume-medium"));
    assert.ok(parsedMed.muteContent.includes("title=Mute"));
  });
});

describe("renderVolumeRow - Leading and Right Slots & Placeholders", () => {
  it("renders leadingControlTemplate when provided", () => {
    const leadingSlot = html`<div class="leading-source-picker">Source</div>`;
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        leadingControlTemplate: leadingSlot,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.ok(
      parsed.leftHtml.includes("leading-source-picker"),
      "Leading control template rendered in volume-left"
    );
  });

  it("renders reserveLeadingControlSpace placeholder when leadingControlTemplate is nothing", () => {
    const tplWithPlaceholder = renderVolumeRow(
      /** @type {any} */ ({
        leadingControlTemplate: nothing,
        reserveLeadingControlSpace: true,
        moreInfoMenu: nothing,
      })
    );
    const parsedWith = parseVolumeRow(tplWithPlaceholder);
    assert.ok(
      parsedWith.leftHtml.includes("volume-leading-placeholder"),
      "Placeholder rendered when reserveLeadingControlSpace is true"
    );

    const tplWithoutPlaceholder = renderVolumeRow(
      /** @type {any} */ ({
        leadingControlTemplate: nothing,
        reserveLeadingControlSpace: false,
        moreInfoMenu: nothing,
      })
    );
    const parsedWithout = parseVolumeRow(tplWithoutPlaceholder);
    assert.ok(
      !parsedWithout.leftHtml.includes("volume-leading-placeholder"),
      "Placeholder not rendered when reserveLeadingControlSpace is false"
    );
  });

  it("renders rightSlotTemplate inside volume-placeholder when showRightPlaceholder: true", () => {
    const rightSlot = html`<div class="custom-right-btn">Options</div>`;
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        showRightPlaceholder: true,
        rightSlotTemplate: rightSlot,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.ok(
      parsed.rightContent.includes("volume-placeholder"),
      "volume-placeholder is rendered in volume-right"
    );
    assert.ok(
      parsed.rightContent.includes("custom-right-btn"),
      "rightSlotTemplate is rendered inside volume-placeholder"
    );
  });

  it("omits rightSlotTemplate placeholder when showRightPlaceholder: false", () => {
    const rightSlot = html`<div class="custom-right-btn">Options</div>`;
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        showRightPlaceholder: false,
        rightSlotTemplate: rightSlot,
        moreInfoMenu: nothing,
      })
    );
    const parsed = parseVolumeRow(tpl);
    assert.ok(
      !parsed.rightContent.includes("volume-placeholder"),
      "volume-placeholder is omitted when showRightPlaceholder is false"
    );
  });
});

describe("renderVolumeRow - Event Handler Bindings", () => {
  it("binds onMuteToggle to default mute button click", () => {
    let clicked = false;
    const onMuteToggle = () => {
      clicked = true;
    };
    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        onMuteToggle,
        moreInfoMenu: nothing,
      })
    );

    const fns = findFunctions(tpl);
    assert.ok(fns.includes(onMuteToggle), "onMuteToggle must be passed in template values");
    onMuteToggle();
    assert.equal(clicked, true);
  });

  it("binds onVolumeStep callbacks to decrement and increment buttons", () => {
    /** @type {number[]} */
    const steps = [];
    const onVolumeStep = (/** @type {number} */ dir) => {
      steps.push(dir);
    };

    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        showSlider: false,
        onVolumeStep,
        moreInfoMenu: nothing,
      })
    );

    const fns = findFunctions(tpl);
    // Find the wrapper functions that call onVolumeStep(-1) and onVolumeStep(1)
    for (const fn of fns) {
      if (fn.length === 0) {
        fn();
      }
    }
    assert.ok(steps.includes(-1), "Should have triggered decrement step (-1)");
    assert.ok(steps.includes(1), "Should have triggered increment step (1)");
  });

  it("binds slider drag and input event handlers", () => {
    let dragStart = false;
    let dragEnd = false;
    let inputFired = false;
    let changeFired = false;

    const onVolumeDragStart = () => {
      dragStart = true;
    };
    const onVolumeDragEnd = () => {
      dragEnd = true;
    };
    const onVolumeInput = () => {
      inputFired = true;
    };
    const onVolumeChange = () => {
      changeFired = true;
    };

    const tpl = renderVolumeRow(
      /** @type {any} */ ({
        showSlider: true,
        onVolumeDragStart,
        onVolumeDragEnd,
        onVolumeInput,
        onVolumeChange,
        moreInfoMenu: nothing,
      })
    );

    const fns = findFunctions(tpl);
    assert.ok(fns.includes(onVolumeDragStart), "onVolumeDragStart bound");
    assert.ok(fns.includes(onVolumeDragEnd), "onVolumeDragEnd bound");
    assert.ok(fns.includes(onVolumeInput), "onVolumeInput bound");
    assert.ok(fns.includes(onVolumeChange), "onVolumeChange bound");

    onVolumeDragStart();
    onVolumeDragEnd();
    onVolumeInput();
    onVolumeChange();
    assert.equal(dragStart && dragEnd && inputFired && changeFired, true);
  });
});
