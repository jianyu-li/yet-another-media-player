import { LitElement, html, nothing } from "lit";
import { editorStyles } from "./styles/editor.js";
import { localize, setHassLanguage } from "./localize/localize.js";

import { SUPPORT_GROUPING, TEMPLATE_CONFIGS } from "./constants.js";
import { getActionPlacement, getEntityName } from "./yamp-utils.js";
import "./yamp-sortable.js";

import { renderArtworkTab } from "./editor/tabs/artwork-tab.js";
import { renderEntitiesTab, renderEntityEditor } from "./editor/tabs/entities-tab.js";
import { renderBehaviorTab } from "./editor/tabs/behavior-tab.js";
import { renderVisualTab } from "./editor/tabs/look-and-feel-tab.js";
import { renderActionsTab, renderActionEditor } from "./editor/tabs/actions-tab.js";
import { ADAPTIVE_TEXT_SELECTOR_VALUES } from "./editor/constants.js";

export class YetAnotherMediaPlayerEditor extends LitElement {
  static properties = {
    hass: {},
    _config: {},
    _yamlConfig: {},
    _activeTab: { type: String },
    _entityEditorIndex: { type: Number },
    _actionEditorIndex: { type: Number },
    _actionMode: { type: String },
    _templateModes: { type: Object },
    _serviceItems: { type: Array },
    _searchTerm: { type: String },
    _useBackgroundImageUrl: { type: Boolean },
    _useIdleImageUrl: { type: Boolean },
  };

  constructor() {
    super();
    /** @type {import("./types.d.ts").HomeAssistant | undefined} */
    this.hass = undefined;
    /** @type {import("./types.d.ts").YampCardConfig | undefined} */
    this._config = undefined;
    /** @type {any} */
    this._yamlConfig = {};
    /** @type {Record<string, any>} */
    this._preTemplateConfig = {};
    /** @type {Record<string, boolean>} */
    this._templateModes = {};
    /** @type {any[]} */
    this._serviceItems = [];
    /** @type {string} */
    this._searchTerm = "";
    /** @type {string | undefined} */
    this._actionMode = undefined;
    this._activeTab = "entities";
    this._entityEditorIndex = null;
    this._actionEditorIndex = null;
    this._tempEntityIndex = null;
    this._tempActionIndex = null;
    this._isInternalUpdate = false;

    this._yamlDraft = undefined;
    this._yamlError = null;
    this._artworkOverrides = [];
    /** @type {boolean | undefined} */
    this._useBackgroundImageUrl = undefined;
    /** @type {boolean | undefined} */
    this._useIdleImageUrl = undefined;
  }

  firstUpdated() {
    this._serviceItems = this._getServiceItems();
    this.addEventListener("value-changed", (e) => this._captureEditorIndex(e), true);
    this.addEventListener("change", (e) => this._captureEditorIndex(e), true);
    this.addEventListener("click", (e) => this._captureEditorIndex(e), true);
  }

  _captureEditorIndex(e) {
    const path = e.composedPath();
    const entityGroup = path.find((el) => el.classList?.contains?.("entity-group"));
    if (entityGroup) {
      const idx = Number(entityGroup.getAttribute("data-index"));
      if (Number.isInteger(idx)) {
        this._tempEntityIndex = idx;
        return;
      }
    }
    this._tempEntityIndex = null;

    const actionGroup = path.find((el) => el.classList?.contains?.("action-group"));
    if (actionGroup) {
      const idx = Number(actionGroup.getAttribute("data-index"));
      if (Number.isInteger(idx)) {
        this._tempActionIndex = idx;
        return;
      }
    }
    this._tempActionIndex = null;
  }

  shouldUpdate(changedProperties) {
    if (
      changedProperties.has("_config") ||
      changedProperties.has("_yamlConfig") ||
      changedProperties.has("_activeTab") ||
      changedProperties.has("_entityEditorIndex") ||
      changedProperties.has("_actionEditorIndex") ||
      changedProperties.has("_actionMode") ||
      changedProperties.has("_templateModes") ||
      changedProperties.has("_serviceItems") ||
      changedProperties.has("_searchTerm")
    ) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass");
      if (!oldHass) {
        return true;
      }

      const oldLang = oldHass.selectedLanguage || oldHass.language || oldHass.locale?.language;
      const newLang =
        this.hass?.selectedLanguage || this.hass?.language || this.hass?.locale?.language;
      if (oldLang !== newLang) {
        return true;
      }

      if (oldHass.services !== this.hass?.services) {
        return true;
      }

      if (oldHass.themes !== this.hass?.themes) {
        return true;
      }

      return false;
    }

    return true;
  }

  updated(changedProperties) {
    if (changedProperties.has("hass")) {
      const currentLang =
        this.hass?.selectedLanguage || this.hass?.language || this.hass?.locale?.language;
      if (currentLang) {
        setHassLanguage(currentLang);
      }
      const oldHass = changedProperties.get("hass");
      if (this.hass?.services !== oldHass?.services) {
        this._serviceItems = this._getServiceItems();
      }
      this._fetchAspectRatios();
    }

    if (changedProperties.has("_searchTerm") || this._searchTerm) {
      this._applySearchFilter();
    }
  }

  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }

  _isGroupCapable(stateObj) {
    if (!stateObj) return false;
    if (this._supportsFeature(stateObj, SUPPORT_GROUPING)) return true;
    return Array.isArray(stateObj.attributes?.group_members);
  }

  _normalizeArtworkOverrides(overrides) {
    if (!Array.isArray(overrides)) return [];
    const matchKeys = [
      "media_title",
      "media_artist",
      "media_album_name",
      "media_content_id",
      "media_channel",
      "app_name",
      "media_content_type",
      "entity_id",
      "aspect_ratio",
    ];

    return overrides.map((item) => {
      if (!item || typeof item !== "object") {
        return {
          match_type: "media_title",
          match_value: "",
          image_url: "",
          size_percentage: undefined,
          object_fit: undefined,
        };
      }

      const sizePercentage = item.size_percentage;

      if (item.missing_art_url !== undefined) {
        return {
          match_type: "missing_art",
          match_value: "",
          image_url: item.missing_art_url ?? "",
          size_percentage: sizePercentage,
          object_fit: item.object_fit,
          object_position: item.object_position,
        };
      }

      if (item.idle_image === true || item.idle_image_url !== undefined) {
        return {
          match_type: "idle_image",
          match_value: "",
          image_url: item.idle_image_url ?? item.image_url ?? "",
          size_percentage: sizePercentage,
          object_fit: item.object_fit,
          object_position: item.object_position,
        };
      }

      let matchType = "media_title";
      let matchValue = "";

      for (const key of matchKeys) {
        if (item[key] !== undefined) {
          matchType = key;
          matchValue = item[key] ?? "";
          break;
        }
        const legacyKey = `${key}_equals`;
        if (item[legacyKey] !== undefined) {
          matchType = key;
          matchValue = item[legacyKey] ?? "";
          break;
        }
      }

      return {
        match_type: matchType,
        match_value: matchValue ?? "",
        image_url: item.image_url ?? "",
        size_percentage: sizePercentage,
        object_fit: item.object_fit,
        object_position: item.object_position,
      };
    });
  }

  _serializeArtworkOverride(rule) {
    if (!rule) return null;
    const image = (rule.image_url ?? "").trim();
    const objectFit = rule.object_fit === "default" ? undefined : rule.object_fit;

    if (rule.match_type === "missing_art") {
      if (!image) return null;
      return {
        missing_art_url: image,
        ...(rule.size_percentage !== undefined
          ? { size_percentage: Number(rule.size_percentage) }
          : {}),
        ...(objectFit !== undefined ? { object_fit: objectFit } : {}),
        ...(rule.object_position !== undefined && rule.object_position !== "default"
          ? { object_position: rule.object_position }
          : {}),
      };
    }

    if (rule.match_type === "idle_image") {
      return {
        idle_image: true,
        ...(image ? { idle_image_url: image } : {}),
        ...(rule.size_percentage !== undefined
          ? { size_percentage: Number(rule.size_percentage) }
          : {}),
        ...(objectFit !== undefined ? { object_fit: objectFit } : {}),
        ...(rule.object_position !== undefined && rule.object_position !== "default"
          ? { object_position: rule.object_position }
          : {}),
      };
    }
    const value = (rule.match_value ?? "").trim();
    if (!value) return null;

    return {
      ...(image ? { image_url: image } : {}),
      [rule.match_type]: value,
      ...(rule.size_percentage !== undefined
        ? { size_percentage: Number(rule.size_percentage) }
        : {}),
      ...(objectFit !== undefined ? { object_fit: objectFit } : {}),
      ...(rule.object_position !== undefined && rule.object_position !== "default"
        ? { object_position: rule.object_position }
        : {}),
    };
  }

  _writeArtworkOverrides(list) {
    this._artworkOverrides = list;
    const serialized = list
      .map((rule) => this._serializeArtworkOverride(rule))
      .filter((item) => item);
    this._updateConfig("media_artwork_overrides", serialized.length ? serialized : undefined);
  }

  _getServiceItems() {
    if (!this.hass?.services) return [];
    return Object.entries(this.hass.services).flatMap(([domain, services]) =>
      Object.keys(services).map((svc) => ({
        label: `${domain}.${svc}`,
        value: `${domain}.${svc}`,
      }))
    );
  }

  // Helper functions for ha-generic-picker (entity selection)
  _getEntityItems(domains = [], excludeEntities = []) {
    const domainKey = domains.join(",");
    const excludeKey = excludeEntities.join(",");
    const states = this.hass?.states;
    const statesCount = states ? Object.keys(states).length : 0;
    const cacheKey = `${domainKey}|${excludeKey}|${statesCount}`;

    if (this._entityItemsCacheKey === cacheKey && this._cachedEntityItemsFn) {
      return this._cachedEntityItemsFn;
    }

    const itemsFn = () => {
      if (!this.hass?.states) return [];
      return Object.keys(this.hass.states)
        .filter((entityId) => {
          const domain = entityId.split(".")[0];
          if (domains.length && !domains.includes(domain)) return false;
          if (excludeEntities.includes(entityId)) return false;
          return true;
        })
        .map((entityId) => {
          const stateObj = this.hass.states[entityId];
          return {
            id: entityId,
            primary: getEntityName(this.hass, stateObj || entityId),
            secondary: entityId,
          };
        });
    };

    if (domains.length <= 1 && excludeEntities.length === 0) {
      this._entityItemsCacheKey = cacheKey;
      this._cachedEntityItemsFn = itemsFn;
    }

    return itemsFn;
  }

  _entityValueRenderer(entityId) {
    if (!entityId) return "";
    const stateObj = this.hass?.states?.[entityId];
    return getEntityName(this.hass, stateObj || entityId);
  }

  _entityRowRenderer(item) {
    return html`
      <ha-list-item twoline graphic="icon">
        <ha-state-icon
          slot="graphic"
          .hass=${this.hass}
          .stateObj=${this.hass?.states?.[item.id]}
        ></ha-state-icon>
        <span>${item.primary}</span>
        <span slot="secondary">${item.secondary}</span>
      </ha-list-item>
    `;
  }

  _getAdaptiveTextTargetsValue() {
    if (Array.isArray(this._config?.adaptive_text_targets)) {
      return this._config.adaptive_text_targets.filter((value) =>
        ADAPTIVE_TEXT_SELECTOR_VALUES.includes(value)
      );
    }
    return this._config?.adaptive_text === true ? [...ADAPTIVE_TEXT_SELECTOR_VALUES] : [];
  }

  _onAdaptiveTextTargetsChanged(value) {
    const list = Array.isArray(value)
      ? value.filter((item) => ADAPTIVE_TEXT_SELECTOR_VALUES.includes(item))
      : [];
    this._updateConfig("adaptive_text_targets", list);
  }

  _looksLikeTemplate(val) {
    if (typeof val !== "string") return false;
    const s = val.trim();
    return s.includes("{{") || s.includes("{%") || (s.startsWith("[[[") && s.endsWith("]]]"));
  }

  _isTemplateValue(val) {
    return this._looksLikeTemplate(val);
  }

  _isTemplateMode(key, currentValue) {
    if (this._templateModes?.[key] !== undefined) {
      return this._templateModes[key];
    }
    return this._looksLikeTemplate(currentValue);
  }

  _toggleTemplateMode(key, currentValue, updateCallback) {
    const isCurrentlyTemplate = this._isTemplateMode(key, currentValue);
    const nextMode = !isCurrentlyTemplate;
    this._templateModes = {
      ...this._templateModes,
      [key]: nextMode,
    };
    if (!nextMode && this._looksLikeTemplate(currentValue)) {
      updateCallback(undefined);
    } else {
      this.requestUpdate();
    }
  }

  _renderTemplateToggle(key, currentValue, updateCallback, disabled = false) {
    const isTemplate = this._isTemplateMode(key, currentValue);
    return html`
      <ha-icon
        class="icon-button-small icon-button-toggle ${isTemplate ? "active" : ""} ${
          disabled ? "icon-button-disabled" : ""
        }"
        icon="mdi:code-braces"
        title="${localize("editor.labels.toggle_template_mode")}"
        @click=${() => {
          if (!disabled) {
            this._toggleTemplateMode(key, currentValue, updateCallback);
          }
        }}
      ></ha-icon>
    `;
  }

  _isEntityId(val) {
    return typeof val === "string" && /^[a-z_]+\.[a-zA-Z0-9_]+$/.test(val.trim());
  }

  _toHexColor(val) {
    if (!val || typeof val !== "string") return "#ffffff";
    const trimmed = val.trim().toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(trimmed)) return trimmed;
    if (/^#[0-9a-f]{3}$/.test(trimmed)) {
      return "#" + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3];
    }
    const colorMap = {
      black: "#000000",
      white: "#ffffff",
      red: "#ff0000",
      green: "#008000",
      blue: "#0000ff",
      yellow: "#ffff00",
      cyan: "#00ffff",
      magenta: "#ff00ff",
      orange: "#ffa500",
      gray: "#808080",
      grey: "#808080",
    };
    if (colorMap[trimmed]) return colorMap[trimmed];
    const rgbMatch = trimmed.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgbMatch) {
      const r = Math.min(255, parseInt(rgbMatch[1], 10)).toString(16).padStart(2, "0");
      const g = Math.min(255, parseInt(rgbMatch[2], 10)).toString(16).padStart(2, "0");
      const b = Math.min(255, parseInt(rgbMatch[3], 10)).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    return "#ffffff";
  }

  setConfig(config) {
    this._yamlConfig = { ...config };
    const rawEntities = config.entities ?? [];
    const normalizedEntities = rawEntities.map((e) =>
      typeof e === "string" ? { entity_id: e } : e
    );

    const templateName = config.template || "custom";
    const templateBase = TEMPLATE_CONFIGS[templateName] || {};

    this._config = {
      ...templateBase,
      ...config,
      entities: normalizedEntities,
    };
    if (this._isInternalUpdate) {
      this._isInternalUpdate = false;
    }

    // Validate sub-editor indices against new config to avoid orphaned sub-editors
    const actionsCount = Array.isArray(this._config.actions) ? this._config.actions.length : 0;
    if (
      this._actionEditorIndex !== null &&
      (this._actionEditorIndex < 0 || this._actionEditorIndex >= actionsCount)
    ) {
      this._actionEditorIndex = null;
      this._actionMode = null;
    }

    const entitiesCount = Array.isArray(this._config.entities) ? this._config.entities.length : 0;
    if (
      this._entityEditorIndex !== null &&
      (this._entityEditorIndex < 0 || this._entityEditorIndex >= entitiesCount)
    ) {
      this._entityEditorIndex = null;
    }

    this._artworkOverrides = this._normalizeArtworkOverrides(config.media_artwork_overrides);
    this._fetchAspectRatios();
  }

  _fetchAspectRatios() {
    if (!this.hass || !this._config) return;

    const needsRatios = (this._artworkOverrides || []).some(
      (rule) => rule.match_type === "aspect_ratio"
    );
    if (!needsRatios) return;

    let entities = [];
    if (this._config.entity) entities.push(this._config.entity);
    if (this._config.entities && Array.isArray(this._config.entities)) {
      entities = [
        ...entities,
        ...this._config.entities.map((e) => (typeof e === "string" ? e : e.entity || e.entity_id)),
      ];
    }
    entities = [...new Set(entities)].filter((e) => e);

    if (!this._entityRatios) this._entityRatios = {};

    entities.forEach((entityId) => {
      if (this._entityRatios[entityId] !== undefined) return;
      const state = this.hass.states[entityId];
      if (!state) return;

      const attrs = state.attributes || {};
      const url = attrs.entity_picture_local || attrs.entity_picture || attrs.album_art;
      if (!url) return;

      let trimmed = url.trim();
      if (
        (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
      ) {
        trimmed = trimmed.slice(1, -1).trim();
      }
      const urlMatch = trimmed.match(/^url\((.*)\)$/i);
      if (urlMatch && urlMatch[1]) {
        trimmed = urlMatch[1].trim();
        if (
          (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
          (trimmed.startsWith('"') && trimmed.endsWith('"'))
        ) {
          trimmed = trimmed.slice(1, -1).trim();
        }
      }

      this._entityRatios[entityId] = "loading";
      const img = new window.Image();
      img.src = trimmed;
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          this._entityRatios[entityId] = (img.naturalWidth / img.naturalHeight).toFixed(2);
          this.requestUpdate();
        } else {
          this._entityRatios[entityId] = null;
        }
      };
      img.onerror = () => {
        this._entityRatios[entityId] = null;
      };
    });
  }

  _formatRatio(ratio) {
    if (!ratio || ratio === "loading") return "";
    const r = parseFloat(ratio);
    if (isNaN(r)) return ` (${ratio})`;
    if (Math.abs(r - 1.77) <= 0.05 || Math.abs(r - 1.78) <= 0.05) return " (16:9)";
    if (Math.abs(r - 1.33) <= 0.05) return " (4:3)";
    if (Math.abs(r - 1.0) <= 0.05) return " (1:1)";
    if (Math.abs(r - 2.33) <= 0.05 || Math.abs(r - 2.35) <= 0.05) return " (21:9)";
    return ` (${ratio})`;
  }

  _updateConfig(key, value) {
    if (key === "template") {
      this._changeTemplate(value);
      return;
    }

    const newYaml = { ...this._yamlConfig, [key]: value };
    this._yamlConfig = newYaml;

    const newConfig = { ...this._config, [key]: value };
    this._config = newConfig;
    this._isInternalUpdate = true;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newYaml },
        bubbles: true,
        composed: true,
      })
    );
  }

  _changeTemplate(templateName) {
    this._actionEditorIndex = null;
    this._entityEditorIndex = null;
    this._actionMode = null;
    let newYaml = { ...this._yamlConfig };

    // Save snapshot if moving away from custom
    if (templateName !== "custom" && (!newYaml.template || newYaml.template === "custom")) {
      this._preTemplateConfig = { ...newYaml };
    }

    if (templateName === "custom") {
      if (this._preTemplateConfig) {
        newYaml = { ...this._preTemplateConfig, ...newYaml, template: "custom" };
      } else {
        newYaml.template = "custom";
      }
    } else {
      const templateBase = TEMPLATE_CONFIGS[templateName] || {};
      // Delete keys that the template provides so they don't override the template
      for (const k of Object.keys(templateBase)) {
        delete newYaml[k];
      }
      newYaml.template = templateName;
    }

    this._yamlConfig = newYaml;

    // Compute the new merged UI config
    const activeTemplateBase = TEMPLATE_CONFIGS[templateName] || {};
    this._config = {
      ...activeTemplateBase,
      ...newYaml,
      entities: this._config.entities, // preserve normalized entities
    };

    this._isInternalUpdate = true;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newYaml },
        bubbles: true,
        composed: true,
      })
    );
  }

  _addArtworkOverride() {
    const list = [...(this._artworkOverrides ?? [])];
    list.push({
      match_type: "media_title",
      match_value: "",
      image_url: "",
      size_percentage: undefined,
      object_fit: undefined,
    });
    this._writeArtworkOverrides(list);
  }

  _removeArtworkOverride(index) {
    const list = [...(this._artworkOverrides ?? [])];
    if (index < 0 || index >= list.length) return;
    list.splice(index, 1);
    this._writeArtworkOverrides(list);
  }

  _onArtworkMatchTypeChange(index, newType) {
    if (!newType) return;
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    const updated = { ...list[index], match_type: newType };
    if (newType === "missing_art" || newType === "idle_image") {
      updated.match_value = "";
    }
    list[index] = updated;
    this._writeArtworkOverrides(list);
  }

  _setCurrentAspectRatioForMatch(index, entityId) {
    if (!this._config || !this.hass) return;

    // Fallback to first configured entity if none provided
    if (!entityId) {
      entityId =
        this._config.entity ||
        (this._config.entities &&
          (typeof this._config.entities[0] === "string"
            ? this._config.entities[0]
            : this._config.entities[0]?.entity || this._config.entities[0]?.entity_id));
    }

    if (!entityId || !this.hass.states[entityId]) return;

    const state = this.hass.states[entityId];
    const attrs = state.attributes || {};
    const url = attrs.entity_picture_local || attrs.entity_picture || attrs.album_art;
    if (!url) return;

    let trimmed = url.trim();
    if (
      (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    const urlMatch = trimmed.match(/^url\((.*)\)$/i);
    if (urlMatch && urlMatch[1]) {
      trimmed = urlMatch[1].trim();
      if (
        (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
      ) {
        trimmed = trimmed.slice(1, -1).trim();
      }
    }

    const img = new window.Image();
    img.src = trimmed;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        const ratio = (img.naturalWidth / img.naturalHeight).toFixed(2);
        this._onArtworkMatchValueChange(index, ratio);
      }
    };
  }

  _onArtworkMatchValueChange(index, value) {
    const list = [...(this._artworkOverrides || [])];
    list[index] = { ...list[index], match_value: value };
    this._writeArtworkOverrides(list);
  }

  _onArtworkImageUrlChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    list[index] = { ...list[index], image_url: value };
    this._writeArtworkOverrides(list);
  }

  _onArtworkSizePercentageChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    if (value === "") {
      list[index] = { ...list[index], size_percentage: undefined };
    } else {
      const num = Number(value);
      if (Number.isFinite(num)) {
        list[index] = { ...list[index], size_percentage: num };
      } else {
        return; // Ignore invalid numeric input
      }
    }
    this._writeArtworkOverrides(list);
  }

  _onArtworkObjectFitChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    const finalValue = value === "default" ? undefined : value;
    list[index] = { ...list[index], object_fit: finalValue };
    this._writeArtworkOverrides(list);
  }

  _onArtworkMoved(e) {
    const { oldIndex, newIndex } = e.detail ?? {};
    const list = [...(this._artworkOverrides ?? [])];
    if (oldIndex === undefined || newIndex === undefined) return;
    if (oldIndex < 0 || newIndex < 0 || oldIndex >= list.length || newIndex >= list.length) return;
    const [moved] = list.splice(oldIndex, 1);
    list.splice(newIndex, 0, moved);
    this._writeArtworkOverrides(list);
  }

  _updateEntityProperty(key, value) {
    this._updateEntityProperties({ [key]: value });
  }

  _updateEntityProperties(properties) {
    const entities = [...(this._config.entities ?? [])];
    const idx = this._tempEntityIndex !== null ? this._tempEntityIndex : this._entityEditorIndex;
    if (entities[idx]) {
      const existing =
        typeof entities[idx] === "string" ? { entity: entities[idx] } : entities[idx];
      entities[idx] = { ...existing, ...properties };
      this._updateConfig("entities", entities);
    }
  }

  _updateActionProperty(key, value) {
    this._updateActionProperties({ [key]: value });
  }

  _updateActionProperties(properties) {
    const actions = [...(this._config.actions ?? [])];
    const idx = this._tempActionIndex !== null ? this._tempActionIndex : this._actionEditorIndex;
    if (actions[idx]) {
      // Enforce single trigger per gesture (Tap, Hold, Double Tap)
      if (properties.card_trigger && properties.card_trigger !== "none") {
        actions.forEach((act, i) => {
          if (i !== idx && act.card_trigger === properties.card_trigger) {
            actions[i] = { ...act, card_trigger: "none" };
          }
        });
      }

      const newAction = { ...actions[idx], ...properties };

      // If we're setting in_menu, remove the placement property
      if ("in_menu" in properties) {
        delete newAction.placement;
      }

      // If we're setting placement, remove the legacy in_menu property
      if ("placement" in properties) {
        delete newAction.in_menu;
      }

      actions[idx] = newAction;
      this._updateConfig("actions", actions);
    }
  }

  _deriveActionMode(action) {
    if (!action) return "service";
    if (action.action === "prev_entity") return "prev_entity";
    if (action.action === "next_entity") return "next_entity";
    if (action.action === "select_entity") return "select_entity";
    if (action.action === "sync_selected_entity" || action.sync_entity_helper)
      return "sync_selected_entity";
    if (typeof action.menu_item === "string" && action.menu_item.trim() !== "") return "menu";
    const navPath = typeof action.navigation_path === "string" ? action.navigation_path.trim() : "";
    if (action.action === "navigate" || navPath) return "navigate";
    if (action.action === "toggle_lyrics") return "toggle_lyrics";
    if (action.action === "remote_control") return "remote_control";
    if (action.action === "toggle_media_session" || action.action === "toggle_lock_screen_controls")
      return "toggle_media_session";
    if (action.action === "full_screen" || action.action === "toggle_full_screen")
      return "full_screen";
    return "service";
  }

  static styles = editorStyles;

  render() {
    if (!this._config) return html``;
    if (this.hass) {
      const currentLang =
        this.hass?.selectedLanguage || this.hass?.language || this.hass?.locale?.language;
      if (currentLang) {
        setHassLanguage(currentLang);
      }
    }

    const currentTemplate = this._yamlConfig.template || "custom";

    // When editing an entity/action, keep tabs visible but show editor content
    const editingEntity = this._entityEditorIndex !== null;
    const editingAction = this._actionEditorIndex !== null;

    return html`
      <div class="config-section" style="margin-top: 0; margin-bottom: 12px;">
        <div
          class="form-row"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;"
        >
          <div>
            <ha-selector
              .hass=${this.hass}
              label=${localize("editor.template_label")}
              .selector=${{
                select: {
                  mode: "dropdown",
                  options: Object.keys(TEMPLATE_CONFIGS).map((key) => ({
                    value: key,
                    label: localize(`editor.templates.${key}.label`),
                  })),
                },
              }}
              .value=${currentTemplate}
              @value-changed=${(e) => this._updateConfig("template", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle small" style="margin-top: 8px;">
              ${localize(`editor.templates.${currentTemplate}.description`)}
            </div>
          </div>
          <div style="position: relative;">
            <ha-selector
              .required=${false}
              .hass=${this.hass}
              .selector=${{ text: { type: "search" } }}
              .value=${this._searchTerm || ""}
              @value-changed=${(e) => {
                this._searchTerm = e.detail.value;
              }}
              label="${localize("editor.search_placeholder") || "Search configuration options..."}"
            ></ha-selector>
            ${
              this._searchTerm
                ? html`
                    <ha-icon
                      icon="mdi:close"
                      @click=${() => {
                        this._searchTerm = "";
                      }}
                      style="position: absolute; right: 12px; top: 28px; transform: translateY(-50%); cursor: pointer; color: var(--secondary-text-color);"
                    ></ha-icon>
                  `
                : nothing
            }
          </div>
        </div>
      </div>
      ${
        this._searchTerm && !editingEntity && !editingAction
          ? this._renderActiveTab()
          : html`
              ${
                this._searchTerm
                  ? nothing
                  : html`
                      <div class="tabs">
                        ${["entities", "behavior", "look_and_feel", "artwork", "actions"].map(
                          (key) => {
                            const name = localize(`editor.tabs.${key}`);
                            return html`
                              <button
                                class="tab"
                                ${this._activeTab === key ? "selected" : ""}
                                @click=${() => {
                                  this._activeTab = key;
                                  // Exit any sub-editor when switching tabs
                                  this._entityEditorIndex = null;
                                  this._actionEditorIndex = null;
                                  this._useTemplate = null;
                                  this._useVolTemplate = null;
                                }}
                                ?selected=${this._activeTab === key}
                              >
                                ${name}
                              </button>
                            `;
                          }
                        )}
                      </div>
                    `
              }
              <div class="tab-content">
                ${
                  editingEntity
                    ? this._renderEntityEditor(this._config.entities?.[this._entityEditorIndex])
                    : editingAction
                      ? this._renderActionEditor(this._config.actions?.[this._actionEditorIndex])
                      : this._renderActiveTab()
                }
              </div>
            `
      }
    `;
  }

  _renderArtworkTab() {
    return renderArtworkTab.call(this);
  }

  _applySearchFilter() {
    if (!this.shadowRoot) return;
    const rawTerm = (this._searchTerm || "").toLowerCase().trim();
    const term = rawTerm.replace(/[_ ]/g, "");

    const container = this.shadowRoot.querySelector(".search-results, .tab-content");
    if (!container) return;

    const isSubEditor = this._entityEditorIndex !== null || this._actionEditorIndex !== null;

    const ENTITY_SUB_EDITOR_KEYS = [
      "name",
      "hidden controls",
      "music assistant entity",
      "ma entity",
      "ma template",
      "hidden search filter chips",
      "hidden chips",
      "prefer music assistant metadata",
      "prefer ma metadata",
      "disable auto select",
      "group volume",
      "volume entity follows active entity",
      "volume entity",
      "sync power",
    ];

    const ACTION_SUB_EDITOR_KEYS = [
      "name",
      "icon",
      "in menu",
      "card trigger",
      "action type",
      "menu item",
      "navigation path",
      "navigation new tab",
      "sync entity helper",
      "sync entity type",
      "service",
      "script variable",
    ];

    const filterRow = (row) => {
      let text = row.textContent.toLowerCase();

      // If we are in the main editor and filtering entity/action rows,
      // also match if the search term matches any option inside their sub-editors
      if (!isSubEditor) {
        if (row.classList.contains("entity-row-inner")) {
          const hasSubEditorMatch = ENTITY_SUB_EDITOR_KEYS.some((key) =>
            key.replace(/[_ ]/g, "").includes(term)
          );
          if (hasSubEditorMatch) {
            row.style.display = "";
            return true;
          }
        } else if (row.classList.contains("action-row-inner")) {
          const hasSubEditorMatch = ACTION_SUB_EDITOR_KEYS.some((key) =>
            key.replace(/[_ ]/g, "").includes(term)
          );
          if (hasSubEditorMatch) {
            row.style.display = "";
            return true;
          }
        }
      }

      // Include the config property name itself in the searchable text
      // (e.g., 'idle_timeout_ms' -> 'idle timeout ms')
      const searchKeys = row.getAttribute("data-search-keys");
      if (searchKeys) {
        text += " " + searchKeys.toLowerCase().replace(/_/g, " ");
      }

      // Dynamically include dropdown/selector options if present
      const selectors = row.querySelectorAll("ha-selector");
      selectors.forEach((sel) => {
        const options = sel.selector?.select?.options;
        if (Array.isArray(options) && options.length <= 15) {
          options.forEach((opt) => {
            if (opt.label) text += " " + String(opt.label).toLowerCase();
            if (opt.value) text += " " + String(opt.value).toLowerCase();
          });
        }
      });

      // Also grab text from label attributes of nested components
      const labeledElements = row.querySelectorAll("[label]");
      labeledElements.forEach((el) => {
        const label = el.getAttribute("label");
        if (label) text += " " + String(label).toLowerCase();
      });

      const match = text.replace(/[_ ]/g, "").includes(term);
      row.style.display = match ? "" : "none";
      return match;
    };

    if (isSubEditor) {
      // Sub-editor: rows are flat, filter them directly
      const rows = container.querySelectorAll(
        ".form-row, .artwork-row, .entity-row-inner, .action-row-inner"
      );
      rows.forEach(filterRow);
    } else {
      // Main tabs search: filter sections and their nested rows
      const sections = container.querySelectorAll(".config-section, .entity-group, .action-group");
      sections.forEach((section) => {
        let sectionHasMatch = false;
        const rows = section.querySelectorAll(
          ".form-row, .artwork-row, .entity-row-inner, .action-row-inner"
        );
        rows.forEach((row) => {
          if (filterRow(row)) {
            sectionHasMatch = true;
          }
        });
        /** @type {HTMLElement} */ (section).style.display = sectionHasMatch ? "" : "none";
      });
    }
  }

  _renderActiveTab() {
    if (this._searchTerm) {
      const entities = this._config?.entities ?? [];
      const actions = this._config?.actions ?? [];

      return html`
        <div class="search-results is-searching" style="padding-top: 4px;">
          ${this._renderBehaviorTab()} ${this._renderVisualTab()} ${this._renderArtworkTab()}
          ${entities.map(
            (ent, idx) => html`
              <div class="entity-group" data-index="${idx}">
                ${this._renderEntityEditor(ent, idx, true)}
              </div>
            `
          )}
          ${actions.map(
            (act, idx) => html`
              <div class="action-group config-section" data-index="${idx}">
                ${this._renderActionEditor(act, idx, true)}
              </div>
            `
          )}
        </div>
      `;
    }

    switch (this._activeTab) {
      case "entities":
        return this._renderEntitiesTab();
      case "behavior":
        return this._renderBehaviorTab();
      case "look_and_feel":
        return this._renderVisualTab();
      case "artwork":
        return this._renderArtworkTab();
      case "actions":
        return this._renderActionsTab();
      default:
        return this._renderEntitiesTab();
    }
  }

  _renderEntitiesTab() {
    return renderEntitiesTab.call(this);
  }

  _renderBehaviorTab() {
    return renderBehaviorTab.call(this);
  }

  _renderVisualTab() {
    return renderVisualTab.call(this);
  }

  _renderActionsTab() {
    return renderActionsTab.call(this);
  }

  _renderEntityEditor(entity, idx = this._entityEditorIndex, isSearch = false) {
    return renderEntityEditor.call(this, entity, idx, isSearch);
  }

  _renderActionEditor(action, idx = this._actionEditorIndex, isSearch = false) {
    return renderActionEditor.call(this, action, idx, isSearch);
  }

  _onEntityChanged(index, newValue) {
    const original = this._config.entities ?? [];
    const updated = [...original];

    if (!newValue) {
      // Remove empty row
      updated.splice(index, 1);
    } else {
      const existing =
        typeof updated[index] === "string" ? { entity: updated[index] } : updated[index];
      updated[index] = { ...existing, entity: newValue, entity_id: newValue };
    }

    // Always strip blank row before writing to config
    const cleaned = updated.filter((e) => {
      const id = typeof e === "string" ? e : e?.entity || e?.entity_id;
      return id && id.trim() !== "";
    });

    this._updateConfig("entities", cleaned);
  }

  _onActionChanged(index, newValue) {
    const original = this._config.actions ?? [];
    const updated = [...original];

    updated[index] = { ...updated[index], name: newValue };

    this._updateConfig("actions", updated);
  }

  _getActionHelperText(act) {
    const placement = getActionPlacement(act);
    const trigger = act?.card_trigger;
    let placementText = "";
    if (placement === "menu") placementText = " \u2022 In Menu";
    else if (placement === "hidden") {
      if (act?.action !== "sync_selected_entity" && act?.action !== "select_entity") {
        if (!trigger || trigger === "none") {
          placementText = ` \u2022 ${localize("editor.placements.hidden")} (${localize("editor.placements.not_triggerable")})`;
        } else {
          placementText = ` \u2022 ${localize("editor.placements.hidden")}`;
        }
      }
    } else if (placement === "replace_search")
      placementText = ` \u2022 ${localize("editor.placements.replace_search")}`;
    else if (placement === "replace_power")
      placementText = ` \u2022 ${localize("editor.placements.replace_power")}`;
    else if (placement === "replace_mute")
      placementText = ` \u2022 ${localize("editor.placements.replace_mute")}`;
    else if (placement === "replace_favorite")
      placementText = ` \u2022 ${localize("editor.placements.replace_favorite")}`;
    let triggerText = "";
    if (trigger && trigger !== "none") {
      triggerText = ` \u2022 Trigger: ${localize(`editor.triggers.${trigger}`)}`;
    }

    if (act?.action === "select_entity") {
      return `${localize("editor.action_helpers.select_entity")} ${act.sync_entity_helper || localize("editor.action_helpers.select_helper")}${placementText}${triggerText}`;
    }
    if (act?.action === "sync_selected_entity") {
      return `${localize("editor.action_helpers.sync_selected_entity")} ${act.sync_entity_helper || localize("editor.action_helpers.select_helper")}${placementText}${triggerText}`;
    }
    if (act?.action === "prev_entity") {
      return `${localize("editor.action_types.prev_entity") || "Previous Entity Chip"}${placementText}${triggerText}`;
    }
    if (act?.action === "next_entity") {
      return `${localize("editor.action_types.next_entity") || "Next Entity Chip"}${placementText}${triggerText}`;
    }
    if (act?.action === "toggle_lyrics") {
      return `${localize("editor.action_types.toggle_lyrics") || "Toggle Lyrics Overlay"}${placementText}${triggerText}`;
    }
    if (act?.action === "remote_control") {
      return `${localize("editor.action_types.remote_control") || "Open Remote Controls Overlay"}${placementText}${triggerText}`;
    }
    if (act?.action === "toggle_media_session" || act?.action === "toggle_lock_screen_controls") {
      return `${localize("editor.action_types.toggle_media_session") || "Toggle Media Session Controls (Experimental)"}${placementText}${triggerText}`;
    }
    if (act?.menu_item) {
      return `Open Menu Item: ${act.menu_item}${placementText}${triggerText}`;
    }
    if (act?.service) {
      return `Call Service: ${act.service}${placementText}${triggerText}`;
    }
    if (act?.navigation_path || act?.action === "navigate") {
      const newTab = act?.navigation_new_tab ? " (New Tab)" : "";
      return `Navigate to ${act.navigation_path || "(missing path)"}${newTab}${placementText}${triggerText}`;
    }
    return placementText || triggerText
      ? `Not Configured${placementText}${triggerText}`
      : "Not Configured";
  }

  _onEditEntity(index) {
    this._entityEditorIndex = index;
    this._templateModes = {};
  }

  _addAction() {
    const actions = [...(this._config?.actions ?? [])];
    const newAction = { service: "" };
    actions.push(newAction);
    const newIndex = actions.length - 1;
    this._actionEditorIndex = newIndex;
    this._actionMode = "service";
    this._templateModes = {};
    this._yamlDraft = undefined;
    this._yamlError = null;
    this._updateConfig("actions", actions);
  }

  _onEditAction(index) {
    this._actionEditorIndex = index;
    this._templateModes = {};
    this._yamlDraft = undefined;
    this._yamlError = null;
    const action = this._config.actions?.[index];
    this._actionMode = this._deriveActionMode(action);
    // If mode is service and no service is set yet, initialize to empty string
    // so the Service Data editor renders immediately
    if (this._actionMode === "service" && typeof action?.service !== "string") {
      this._updateActionProperty("service", "");
    }
  }

  _onBackFromEntityEditor() {
    this._entityEditorIndex = null;
    this._templateModes = {};
  }

  _onBackFromActionEditor() {
    this._actionEditorIndex = null;
    this._actionMode = null;
    this._templateModes = {};
  }

  _onEntityMoved(event) {
    const { oldIndex, newIndex } = event.detail;

    // Don't allow moving the last blank entity
    const entities = [...this._config.entities];
    if (oldIndex >= entities.length || newIndex >= entities.length) {
      return;
    }

    const [moved] = entities.splice(oldIndex, 1);
    entities.splice(newIndex, 0, moved);

    this._updateConfig("entities", entities);
  }

  _onActionMoved(event) {
    const { oldIndex, newIndex } = event.detail;
    const actions = [...this._config.actions];

    if (oldIndex >= actions.length || newIndex >= actions.length) {
      return;
    }

    const [moved] = actions.splice(oldIndex, 1);
    actions.splice(newIndex, 0, moved);

    this._updateConfig("actions", actions);
  }

  _removeAction(index) {
    const actions = [...(this._config.actions ?? [])];
    if (index < 0 || index >= actions.length) return;

    actions.splice(index, 1);
    if (this._actionEditorIndex !== null) {
      if (this._actionEditorIndex === index) {
        this._actionEditorIndex = null;
        this._actionMode = null;
      } else if (this._actionEditorIndex > index) {
        this._actionEditorIndex -= 1;
      }
    }
    this._updateConfig("actions", actions);
  }

  _toggleActionInMenu(index) {
    const actions = [...(this._config.actions ?? [])];
    if (!actions[index]) return;
    const current = !!actions[index].in_menu;
    const newAction = { ...actions[index], in_menu: !current };
    delete newAction.placement;
    actions[index] = newAction;
    this._updateConfig("actions", actions);
  }

  _onToggleChanged(e) {
    const newConfig = {
      ...this._config,
      always_collapsed: e.target.checked,
    };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }

  _looksLikeUrlOrPath(value) {
    if (!value) return false;
    return (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/") ||
      value.includes(".jpg") ||
      value.includes(".jpeg") ||
      value.includes(".png") ||
      value.includes(".gif") ||
      value.includes(".webp")
    );
  }
}

customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);
