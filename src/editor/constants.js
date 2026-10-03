import { localize } from "../localize/localize.js";

export const getAdaptiveTextSelectorOptions = () => [
  { value: "details", label: localize("card.sections.details") },
  { value: "menu", label: localize("card.sections.menu") },
  { value: "action_chips", label: localize("card.sections.action_chips") },
  { value: "lyrics", label: localize("card.sections.lyrics") },
];

export const ADAPTIVE_TEXT_SELECTOR_VALUES = Object.freeze([
  "details",
  "menu",
  "action_chips",
  "lyrics",
]);

export const VOLUME_MODE_SELECTOR = Object.freeze({
  select: {
    mode: "dropdown",
    options: [
      { value: "slider", label: "Slider" },
      { value: "stepper", label: "Stepper" },
      { value: "hidden", label: "Hidden" },
    ],
  },
});

export const VOLUME_STEP_SELECTOR = Object.freeze({
  number: { min: 0.01, max: 1, step: 0.01, unit_of_measurement: "", mode: "box" },
});

export const LYRICS_BACKGROUND_FADE_SELECTOR = Object.freeze({
  number: { min: 0, max: 100, step: 1, unit_of_measurement: "%", mode: "slider" },
});
