import en from "./languages/en.js";
import de from "./languages/de.js";
import es from "./languages/es.js";
import fr from "./languages/fr.js";
import it from "./languages/it.js";
import nl from "./languages/nl.js";
import pt from "./languages/pt.js";
import sk from "./languages/sk.js";
import sl from "./languages/sl.js";

const languages = {
  en,
  de,
  es,
  fr,
  it,
  nl,
  pt,
  sk,
  sl,
};

let activeHassLanguage = null;

export function setHassLanguage(lang) {
  if (typeof lang === "string" && lang.trim() !== "") {
    activeHassLanguage = lang.trim();
  } else {
    activeHassLanguage = null;
  }
}

function getBrowserLanguage() {
  if (typeof navigator === "undefined") return "";
  if (Array.isArray(navigator.languages)) {
    for (const l of navigator.languages) {
      if (!l || typeof l !== "string") continue;
      const normalized = l.replace(/['"]+/g, "").replace("-", "_");
      const base = normalized.split("_")[0];
      if (languages[normalized] || languages[base]) {
        return normalized;
      }
    }
  }
  return (Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || "";
}

export function getActiveLanguage() {
  const haElement =
    typeof document !== "undefined" ? document.querySelector("home-assistant") : null;
  const haHass = haElement?.hass;

  const rawLang = (
    (typeof localStorage !== "undefined" && localStorage.getItem("selectedLanguage")) ||
    haHass?.selectedLanguage ||
    haHass?.language ||
    haHass?.locale?.language ||
    activeHassLanguage ||
    getBrowserLanguage() ||
    "en"
  )
    .replace(/['"]+/g, "")
    .replace("-", "_");

  return languages[rawLang] ? rawLang : rawLang.split("_")[0];
}

export function localize(string, search = "", replace = "") {
  const lang = getActiveLanguage();

  let translated;
  const parts = string.split(".");

  const traverse = (obj, path) => {
    try {
      return path.reduce((o, i) => (o && o[i] !== undefined ? o[i] : undefined), obj);
    } catch (e) {
      return undefined;
    }
  };

  translated = traverse(languages[lang], parts);
  if (translated === undefined && lang !== "en") {
    translated = traverse(languages["en"], parts);
  }
  if (translated === undefined) {
    translated = string;
  }

  if (typeof translated !== "string") {
    translated = string;
  }

  if (typeof search === "object" && search !== null) {
    for (const [s, r] of Object.entries(search)) {
      translated = translated.replaceAll(s, r);
    }
  } else if (search !== "" && replace !== "") {
    translated = translated.replaceAll(search, replace);
  }
  return translated;
}
