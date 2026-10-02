import { baseCardStyles } from "./styles/base-card.js";
import { chipStyles } from "./styles/chips.js";
import { controlsStyles } from "./styles/controls.js";
import { volumeProgressStyles } from "./styles/volume-progress.js";
import { menusSheetsStyles } from "./styles/menus-sheets.js";
import { searchSheetStyles } from "./styles/search-sheet.js";

export { Z_LAYERS } from "./styles/shared.js";
export { baseCardStyles } from "./styles/base-card.js";
export { chipStyles } from "./styles/chips.js";
export { controlsStyles } from "./styles/controls.js";
export { volumeProgressStyles } from "./styles/volume-progress.js";
export { menusSheetsStyles } from "./styles/menus-sheets.js";
export { searchSheetStyles } from "./styles/search-sheet.js";
export { lyricsStyles } from "./styles/lyrics.js";
export { editorStyles } from "./styles/editor.js";

/**
 * Composite CSS stylesheet group for Yet Another Media Player.
 * Lit natively accepts CSSResultGroup (arrays of CSSResult).
 */
export const yampCardStyles = [
  baseCardStyles,
  chipStyles,
  controlsStyles,
  volumeProgressStyles,
  menusSheetsStyles,
  searchSheetStyles,
];
