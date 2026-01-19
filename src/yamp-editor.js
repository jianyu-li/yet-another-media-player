// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';
import { LitElement, html, css, nothing } from "lit";
import yaml from 'js-yaml';
import { localize } from "./localize/localize.js";


import { SUPPORT_GROUPING } from "./constants.js";
import { isMusicAssistantEntity } from "./yamp-utils.js";
import "./yamp-sortable.js";

const ADAPTIVE_TEXT_SELECTOR_OPTIONS = Object.freeze([
  { value: "details", label: localize('card.sections.details') },
  { value: "menu", label: localize('card.sections.menu') },
  { value: "action_chips", label: localize('card.sections.action_chips') },
]);
const ADAPTIVE_TEXT_SELECTOR_VALUES = ADAPTIVE_TEXT_SELECTOR_OPTIONS.map((opt) => opt.value);

export class YetAnotherMediaPlayerEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _activeTab: { type: String },
      _entityEditorIndex: { type: Number },
      _actionEditorIndex: { type: Number },
      _actionMode: { type: String },
      _useTemplate: { type: Boolean },
      _useVolTemplate: { type: Boolean },
      _serviceItems: { type: Array }
    };
  }

  constructor() {
    super();
    this._activeTab = "entities";
    this._entityEditorIndex = null;
    this._actionEditorIndex = null;

    this._yamlDraft = "";
    this._parsedYaml = null;
    this._yamlError = false;
    this._serviceItems = [];
    this._useTemplate = null; // auto-detect per entity on open
    this._useVolTemplate = null; // auto-detect per entity on open
    this._artworkOverrides = [];
  }

  firstUpdated() {
    this._serviceItems = this._getServiceItems();
  }

  updated(changedProperties) {
    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass");
      if (this.hass?.services !== oldHass?.services) {
        this._serviceItems = this._getServiceItems();
      }
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
      };
    });
  }

  _serializeArtworkOverride(rule) {
    if (!rule) return null;
    const image = (rule.image_url ?? "").trim();
    if (!image) return null;

    const objectFit = rule.object_fit === "default" ? undefined : rule.object_fit;

    if (rule.match_type === "missing_art") {
      return {
        missing_art_url: image,
        ...(rule.size_percentage !== undefined ? { size_percentage: Number(rule.size_percentage) } : {}),
        ...(objectFit !== undefined ? { object_fit: objectFit } : {}),
      };
    }

    const value = (rule.match_value ?? "").trim();
    if (!value) return null;

    return {
      image_url: image,
      [rule.match_type]: value,
      ...(rule.size_percentage !== undefined ? { size_percentage: Number(rule.size_percentage) } : {}),
      ...(objectFit !== undefined ? { object_fit: objectFit } : {}),
    };
  }

  _writeArtworkOverrides(list) {
    this._artworkOverrides = list;
    const serialized = list
      .map((rule) => this._serializeArtworkOverride(rule))
      .filter((item) => item);
    this._updateConfig(
      "media_artwork_overrides",
      serialized.length ? serialized : undefined
    );
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
    return () => {
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
            primary: stateObj?.attributes?.friendly_name || entityId,
            secondary: entityId,
          };
        });
    };
  }

  _entityValueRenderer(entityId) {
    if (!entityId) return "";
    const stateObj = this.hass?.states?.[entityId];
    return stateObj?.attributes?.friendly_name || entityId;
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
    return this._config?.adaptive_text === true
      ? [...ADAPTIVE_TEXT_SELECTOR_VALUES]
      : [];
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
    return s.includes("{{") || s.includes("{%");
  }

  _isEntityId(val) {
    return typeof val === "string" && /^[a-z_]+\.[a-zA-Z0-9_]+$/.test(val.trim());
  }

  setConfig(config) {
    const rawEntities = config.entities ?? [];
    const normalizedEntities = rawEntities.map((e) =>
      typeof e === "string" ? { entity_id: e } : e
    );

    this._config = {
      ...config,
      entities: normalizedEntities,
    };
    this._artworkOverrides = this._normalizeArtworkOverrides(config.media_artwork_overrides);
  }

  _updateConfig(key, value) {
    const newConfig = { ...this._config, [key]: value };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
  }

  _addArtworkOverride() {
    const list = [...(this._artworkOverrides ?? [])];
    list.push({ match_type: "media_title", match_value: "", image_url: "", size_percentage: undefined, object_fit: undefined });
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
    if (newType === "missing_art") {
      updated.match_value = "";
    }
    list[index] = updated;
    this._writeArtworkOverrides(list);
  }

  _onArtworkMatchValueChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
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
    const entities = [...(this._config.entities ?? [])];
    const idx = this._entityEditorIndex;
    if (entities[idx]) {
      entities[idx] = { ...entities[idx], [key]: value };
      this._updateConfig("entities", entities);
    }
  }


  _updateActionProperty(key, value) {
    const actions = [...(this._config.actions ?? [])];
    const idx = this._actionEditorIndex;
    if (actions[idx]) {
      actions[idx] = { ...actions[idx], [key]: value };
      this._updateConfig("actions", actions);
    }
  }

  _deriveActionMode(action) {
    if (!action) return "service";
    if (action.action === "sync_selected_entity" || action.sync_entity_helper) return "sync_selected_entity";
    if (typeof action.menu_item === "string" && action.menu_item.trim() !== "") return "menu";
    const navPath = typeof action.navigation_path === "string" ? action.navigation_path.trim() : "";
    if (action.action === "navigate" || navPath) return "navigate";
    return "service";
  }

  static get styles() {
    return css`
        .form-row {
          padding: 12px 16px;
          gap: 8px;
        }
        .tabs {
          display: flex;
          gap: 4px;
          padding: 8px 8px 0 8px;
          border-bottom: 1px solid var(--divider-color, #444);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabs::-webkit-scrollbar {
          display: none;
        }
        .tab {
          background: transparent;
          border: none;
          color: var(--primary-text-color, #fff);
          cursor: pointer;
          padding: 9px 14px;
          border-radius: 8px 8px 0 0;
          font-weight: 500;
          opacity: 0.85;
          border-bottom: 3px solid transparent;
          transition: color var(--transition, 0.2s), background var(--transition, 0.2s), opacity var(--transition, 0.2s), border-color var(--transition, 0.2s);
          font-size: 1.06em;
          flex: 0 0 auto;
        }
        
        
        .tab:hover {
          opacity: 1;
          color: var(--custom-accent, var(--accent-color, #ff9800));
          background: rgba(255,255,255,0.06);
        }
        .tab[selected] {
          background: rgba(255,255,255,0.10);
          color: var(--primary-text-color, #fff);
          opacity: 1;
          border-bottom-color: var(--custom-accent, var(--accent-color, #ff9800));
          box-shadow: 0 2px 0 0 var(--custom-accent, var(--accent-color, #ff9800)) inset;
        }
        .tab:focus-visible {
          outline: 2px solid var(--custom-accent, var(--accent-color, #ff9800));
          outline-offset: 2px;
        }
        .tab-content {
          padding-top: 4px;
        }
        /* add to rows with multiple elements to align the elements horizontally */
        .form-row-multi-column {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .form-row-multi-column > div {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
        }
        .form-row-multi-column > div.number-input-with-note {
          flex-direction: column;
          align-items: stretch;
          gap: 4px;
        }
        .config-subtitle.warning {
          color: var(--error-color, #f44336);
          font-style: normal;
          margin-top: 6px;
        }
        #search-limit-reset {
          align-self: flex-start;
          margin-top: 6px;
        }
        .config-subtitle {
          font-size: 0.85em;
          color: var(--secondary-text-color, #888);
          margin-top: 4px;
          line-height: 1.3;
          font-style: italic;
        }
        .form-label {
          display: block;
          font-weight: 600;
          font-size: 0.95em;
          color: var(--primary-text-color, #fff);
          margin-bottom: 2px;
        }
        .form-row-compact {
          padding-top: 4px;
          padding-bottom: 4px;
        }
        /* reduced padding for entity selection subrows */
        .entity-row {
          padding: 6px;
        }
        /* visually isolate grouped controls */
        .config-section,
        .entity-group,
        .action-group {
          background: var(--yamp-section-bg, var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.02))));
          border: 1px solid var(--yamp-section-border, var(--divider-color, rgba(255,255,255,0.1)));
          border-radius: var(--yamp-section-radius, 12px);
          margin: 16px 0;
          overflow: hidden;
        }
        .config-section:first-of-type,
        .entity-group:first-of-type,
        .action-group:first-of-type {
          margin-top: 8px;
        }
        .config-section .form-row + .form-row,
        .entity-group .form-row + .form-row,
        .action-group .form-row + .form-row {
          border-top: 1px solid var(--yamp-section-divider, rgba(255,255,255,0.06));
        }
        .section-header,
        .entity-group-header,
        .action-group-header {
          display: block;
          padding: 12px 16px 0 16px;
          width: 100%;
        }
        .section-title,
        .entity-group-title,
        .action-group-title {
          font-size: var(--yamp-section-title-size, 1em);
          font-weight: var(--yamp-section-title-weight, 600);
        }
        .section-description {
          display: block;
          align-self: stretch;
          font-size: var(--yamp-section-description-size, 0.9em);
          color: var(--yamp-section-description-color, var(--secondary-text-color, #888));
          margin-top: 2px;
          line-height: 1.4;
          width: 100%;
          box-sizing: border-box;
          padding-right: 24px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        /* wraps the entity selector and edit button */
        .entity-row-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        /* wraps the action icon, name textbox and edit button */
        .action-row-inner {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        .action-row-inner > ha-icon {
          margin-right: 5px;
          margin-top: 0px;
        }
        /* allow children to fill all available space */
        .grow-children {
          flex: 1;
          display: flex;
        }
        .grow-children > * {
          flex: 1;
          min-width: 0;
        }
        .entity-editor-header, .action-editor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
        }
        .entity-editor-title, .action-editor-title {
          font-weight: 500;
          font-size: 1.1em;
          line-height: 1;
        }
        .action-icon-placeholder {
          width: 29px; 
          height: 24px; 
          display: inline-block;
        }
        .full-width {
          width: 100%;
        }
        .entity-group-header,
        .action-group-header {
          width: 100%;
        }
        .entity-group-actions,
        .action-group-actions {
          display: flex;
          align-items: center;
        }
        entity-row-actions {
          display: flex;
          align-items: center;
        }
        .action-row-actions {
          display: flex;
          align-items: flex-start;
        }
        .handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          cursor: grab;
          color: var(--secondary-text-color);
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .handle:hover {
          opacity: 1;
        }
        .handle:active {
          cursor: grabbing;
        }
        .handle-disabled {
          opacity: 0.3;
          cursor: default;
          pointer-events: none;
        }
        .handle-disabled:hover {
          opacity: 0.3;
        }
        .action-icon {
          align-self: flex-start;
          padding-top: 16px;
        }
        .action-handle {
          align-self: flex-start;
          padding-top: 18px;
        }
        .action-row-actions {
          padding-top: 2px;
        }
        .service-data-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 4px;
        }
        .service-data-editor-title {
          font-weight: 500;
        }
        .service-data-editor-actions {
          display: flex;
          gap: 8px;
        }
        .code-editor-wrapper.error {
          border: 1px solid color: var(--error-color, red);
          border-radius: 4px;
          padding: 1px;
        }
        .yaml-error-message {
          color: var(--error-color, red);
          font-size: 14px;
          margin: 6px;
          white-space: pre-wrap;
          font-family: Consolas, Menlo, Monaco, monospace;
          line-height: 1.4;
        }
        .help-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 0.9em;
        }
        .help-table th,
        .help-table td {
          border: 1px solid var(--divider-color, #444);
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        .help-table thead {
          background: var(--card-background-color, #222);
          font-weight: bold;
        }
        .help-title {
          font-weight: bold;
          margin-top: 16px;
          font-size: 1em;
        }
        code {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 4px;
          border-radius: 4px;
        }
        .help-text pre {
          margin: 8px 0 0 0;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.92em;
          white-space: pre-wrap;
        } 
        .icon-button {
          display: inline-flex;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
          align-self: center;
          align-items: center;
          padding: 12px;
        }
        .icon-button-compact {
          padding: 6px;
        }
        .icon-button:hover {
          color: var(--primary-color, #2196f3);
        }
        .icon-button-disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        .icon-button-toggle {
          opacity: 0.8;
        }
        .icon-button-toggle.active {
          color: var(--custom-accent, var(--accent-color, #ff9800));
          opacity: 1;
        }
        .help-text {
          padding: 12px 25px;
        }
        .add-action-button-wrapper {
          display: flex;
          justify-content: center;
        }
        .artwork-row .artwork-fields {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .config-subtitle.small {
          font-size: 0.9em;
          opacity: 0.75;
          margin: 2px 0 0 0;
        }
      `;
  }

  render() {
    if (!this._config) return html``;

    // When editing an entity/action, keep tabs visible but show editor content
    const editingEntity = this._entityEditorIndex !== null;
    const editingAction = this._actionEditorIndex !== null;

    return html`
        <div class="tabs">
          ${["entities", "behavior", "look_and_feel", "artwork", "actions"].map((key) => {
      const name = localize(`editor.tabs.${key}`);
      return html`
              <button
                class="tab" ${this._activeTab === key ? 'selected' : ''}
                @click=${() => {
          this._activeTab = key;
          // Exit any sub-editor when switching tabs
          this._entityEditorIndex = null;
          this._actionEditorIndex = null;
          this._useTemplate = null;
          this._useVolTemplate = null;
        }}
                ?selected=${this._activeTab === key}
              >${name}</button>
            `;
    })}
        </div>
        <div class="tab-content">
          ${editingEntity
        ? this._renderEntityEditor(this._config.entities?.[this._entityEditorIndex])
        : editingAction
          ? this._renderActionEditor(this._config.actions?.[this._actionEditorIndex])
          : this._renderActiveTab()}
        </div>
      `;
  }

  _renderArtworkTab() {
    const overrides = [...(this._artworkOverrides ?? [])];
    const matchOptions = [
      { value: "media_title", label: "Media Title" },
      { value: "media_artist", label: "Media Artist" },
      { value: "media_album_name", label: "Album Name" },
      { value: "media_content_id", label: "Content ID" },
      { value: "media_channel", label: "Channel" },
      { value: "app_name", label: "App Name" },
      { value: "media_content_type", label: "Content Type" },
      { value: "entity_id", label: "Entity ID" },
      { value: "missing_art", label: "Missing Artwork" },
    ];

    return html`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.artwork.general.title')}</div>
            <div class="section-description">${localize('editor.sections.artwork.general.description')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${localize('editor.fields.artwork_fit')}"
                .selector=${{
        select: {
          mode: "dropdown",
          options: [
            { value: "cover", label: "Cover (default)" },
            { value: "contain", label: "Contain" },
            { value: "fill", label: "Fill" },
            { value: "scale-down", label: "Scale Down" },
            { value: "none", label: "None" }
          ]
        }
      }}
                .value=${this._config.artwork_object_fit ?? "cover"}
                @value-changed=${(e) => {
        const value = e.detail.value;
        this._updateConfig("artwork_object_fit", value === "cover" ? undefined : value);
      }}
              ></ha-selector>
            </div>
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${localize('editor.fields.artwork_position')}"
                .selector=${{
        select: {
          mode: "dropdown",
          options: [
            { value: "top center", label: "Top (default)" },
            { value: "center center", label: "Center" },
            { value: "bottom center", label: "Bottom" }
          ]
        }
      }}
                .value=${this._config.artwork_position ?? "top center"}
                @value-changed=${(e) => {
        const value = e.detail.value;
        this._updateConfig("artwork_position", value === "top center" ? undefined : value);
      }}
              ></ha-selector>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="extend-artwork-toggle"
                .checked=${this._config.extend_artwork === true}
                @change=${(e) => this._updateConfig("extend_artwork", e.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="extend-artwork-toggle" style="font-weight: 500;">${localize('editor.subtitles.artwork_extend_label')}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${localize('editor.subtitles.artwork_extend')}</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${localize('editor.fields.artwork_hostname')}"
              .value=${this._config.artwork_hostname ?? ""}
              @input=${(e) => this._updateConfig("artwork_hostname", e.target.value)}
              helper="e.g. http://192.168.1.50:8123"
              .helperPersistent=${true}
            ></ha-textfield>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.artwork.idle.title')}</div>
            <div class="section-description">${localize('editor.sections.artwork.idle.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="idle-image-url-toggle"
                .checked=${this._useIdleImageUrl ?? this._looksLikeUrlOrPath(this._config.idle_image)}
                @change=${(e) => {
        this._useIdleImageUrl = e.target.checked;
        if (e.target.checked) {
          this._updateConfig("idle_image", "");
        } else {
          this._updateConfig("idle_image", "");
        }
      }}
              ></ha-switch>
              <label for="idle-image-url-toggle">${localize('editor.labels.use_url_path')}</label>
            </div>
            <div style="flex: 2;">
              ${this._useIdleImageUrl ? html`
                <ha-textfield
                  class="full-width"
                  placeholder="e.g., https://example.com/image.jpg or /local/custom/image.jpg"
                  .value=${this._config.idle_image ?? ""}
                  @input=${(e) => this._updateConfig("idle_image", e.target.value)}
                  helper="${localize('editor.subtitles.image_url_helper')}"
                  .helperPersistent=${true}
                ></ha-textfield>
              ` : html`
                <ha-generic-picker
                  class="full-width"
                  .hass=${this.hass}
                  .value=${this._config.idle_image ?? ""}
                  .label=${localize('editor.fields.idle_image_entity')}
                  .valueRenderer=${(v) => this._entityValueRenderer(v)}
                  .rowRenderer=${(item) => this._entityRowRenderer(item)}
                  .getItems=${this._getEntityItems(["camera", "image"])}
                  @value-changed=${(e) => this._updateConfig("idle_image", e.detail.value)}
                  allow-custom-value
                ></ha-generic-picker>
              `}
            </div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.artwork.overrides.title')}</div>
            <div class="section-description">${localize('editor.sections.artwork.overrides.description')}</div>
          </div>
          <yamp-sortable @item-moved=${(e) => this._onArtworkMoved(e)}>
            <div class="sortable-container">
              ${overrides.length
        ? overrides.map((rule, idx) => html`
                    <div class="action-row-inner sortable-item artwork-row">
                      <div class="handle action-handle">
                        <ha-icon icon="mdi:drag"></ha-icon>
                      </div>
                      <div class="artwork-fields">
                        <ha-selector
                          .hass=${this.hass}
                          label="${localize('editor.fields.match_field')}"
                          .selector=${{ select: { mode: "dropdown", options: matchOptions } }}
                          .value=${rule.match_type ?? "media_title"}
                          @value-changed=${(e) => this._onArtworkMatchTypeChange(idx, e.detail.value)}
                        ></ha-selector>
                        ${rule.match_type === "missing_art"
            ? html`
                                <div class="config-subtitle small">
                                  Applies when the selected media provides no artwork.
                                </div>
                              `
            : rule.match_type === "entity_id"
              ? html`
                                  <ha-generic-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .value=${rule.match_value ?? ""}
                                    .label=${localize('editor.fields.match_entity')}
                                    .valueRenderer=${(v) => this._entityValueRenderer(v)}
                                    .rowRenderer=${(item) => this._entityRowRenderer(item)}
                                    .getItems=${this._getEntityItems(["media_player"])}
                                    @value-changed=${(e) =>
                  this._onArtworkMatchValueChange(idx, e.detail.value)}
                                    allow-custom-value
                                  ></ha-generic-picker>
                                `
              : html`
                                  <ha-textfield
                                    class="full-width"
                                    label="${localize('editor.fields.match_value')}"
                                    .value=${rule.match_value ?? ""}
                                    @input=${(e) => this._onArtworkMatchValueChange(idx, e.target.value)}
                                  ></ha-textfield>
                                `
          }
                        <ha-textfield
                          class="full-width"
                          label=${rule.match_type === "missing_art" ? localize('editor.fields.fallback_image_url') : localize('editor.fields.image_url')}
                          .value=${rule.image_url ?? ""}
                          @input=${(e) => this._onArtworkImageUrlChange(idx, e.target.value)}
                        ></ha-textfield>
                        <div class="form-row-multi-column" style="gap:12px; flex-wrap:wrap; align-items:flex-start;">
                          <div class="grow-children" style="flex:1;">
                            <ha-textfield
                              class="full-width"
                              label="${localize('editor.fields.size_percent')}"
                              type="number"
                              min="1"
                              max="100"
                              .value=${rule.size_percentage ?? ""}
                              @input=${(e) => this._onArtworkSizePercentageChange(idx, e.target.value)}
                            ></ha-textfield>
                          </div>
                          <div class="grow-children" style="flex:1.5;">
                            <ha-selector
                              .hass=${this.hass}
                              label="${localize('editor.fields.object_fit')}"
                              .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "default", label: "Default" },
                { value: "cover", label: "Cover" },
                { value: "contain", label: "Contain" },
                { value: "fill", label: "Fill" },
                { value: "scale-down", label: "Scale Down" },
                { value: "none", label: "None" }
              ]
            }
          }}
                              .value=${rule.object_fit || "default"}
                              @value-changed=${(e) => this._onArtworkObjectFitChange(idx, e.detail.value)}
                            ></ha-selector>
                          </div>
                        </div>
                      </div>
                      <div class="action-row-actions">
                        <ha-icon
                          class="icon-button"
                          icon="mdi:trash-can"
                          title="Delete Override"
                          @click=${() => this._removeArtworkOverride(idx)}
                        ></ha-icon>
                      </div>
                    </div>
                  `)
        : html`<div class="config-subtitle" style="padding:12px 0;text-align:center;">${localize('editor.subtitles.no_artwork_overrides')}</div>`}
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="${localize('editor.titles.add_artwork_override')}"
              @click=${this._addArtworkOverride}
            ></ha-icon>
          </div>
        </div>
        </div>

      `;
  }

  _renderActiveTab() {
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
    if (!this._config) return html``;
    let entities = [...(this._config.entities ?? [])];
    if (entities.length === 0 || entities[entities.length - 1].entity_id) {
      entities.push({ entity_id: "" });
    }
    return html`
        <div class="entity-group">
          <div class="entity-group-header section-header">
            <div class="entity-group-title section-title">${localize('editor.sections.entities.title')}</div>
            <div class="section-description">${localize('editor.sections.entities.description')}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${(e) => this._onEntityMoved(e)}>
              <div class="sortable-container">
                ${entities.map((ent, idx) => html`
                  <div class="entity-row-inner ${idx < entities.length - 1 ? 'sortable-item' : ''}" data-index="${idx}">
                    <div class="handle ${idx === entities.length - 1 ? 'handle-disabled' : ''}">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    <div class="grow-children">
                      <ha-generic-picker
                        class="full-width"
                        style="display: block; width: 100%;"
                        .hass=${this.hass}
                        .value=${ent.entity_id || ""}
                        .label=${localize('common.media_player')}
                        .valueRenderer=${(v) => this._entityValueRenderer(v)}
                        .rowRenderer=${(item) => this._entityRowRenderer(item)}
                        .getItems=${this._getEntityItems(
      ["media_player"],
      (idx === entities.length - 1 && !ent.entity_id)
        ? (this._config.entities?.map(e => e.entity_id) ?? [])
        : []
    )}
                        @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                        allow-custom-value
                      ></ha-generic-picker>
                    </div>
                    <div class="entity-row-actions">
                      <ha-icon
                        class="icon-button ${!ent.entity_id ? "icon-button-disabled" : ""}"
                        icon="mdi:pencil"
                        title="${localize('common.edit_entity')}"
                        @click=${() => this._onEditEntity(idx)}
                      ></ha-icon>
                    </div>
                  </div>
                `)}
              </div>
            </yamp-sortable>
          </div>
        </div>
      `;
  }

  _renderBehaviorTab() {
    const searchLimitWarningActive = Number(this._config.search_results_limit) > 100;
    return html`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.behavior.idle_chips.title')}</div>
            <div class="section-description">${localize('editor.sections.behavior.idle_chips.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{
        number: { min: 0, step: 1000, unit_of_measurement: "ms", mode: "box" }
      }}
                .value=${this._config.idle_timeout_ms ?? 60000}
                label="${localize('editor.fields.idle_timeout')}"
                @value-changed=${(e) => this._updateConfig("idle_timeout_ms", e.detail.value)}
              ></ha-selector>
              <div class="config-subtitle">${localize('editor.subtitles.idle_timeout')}</div>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${localize('common.reset_default')}"
              @click=${() => this._updateConfig("idle_timeout_ms", 60000)}
            ></ha-icon>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
        select: {
          mode: "dropdown", options: [
            { value: "auto", label: "Auto" },
            { value: "always", label: "Always" },
            { value: "in_menu", label: "In Menu" }
          ]
        }
      }}
              .value=${this._config.show_chip_row ?? "auto"}
              label="${localize('editor.fields.show_chip_row')}"
              @value-changed=${(e) => this._updateConfig("show_chip_row", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.show_chip_row')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dim-chips-on-idle-toggle"
                .checked=${this._config.dim_chips_on_idle ?? true}
                @change=${(e) => this._updateConfig("dim_chips_on_idle", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.dim_chips')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.dim_chips')}</div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.behavior.interactions_search.title')}</div>
            <div class="section-description">${localize('editor.sections.behavior.interactions_search.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="hold-to-pin-toggle"
                .checked=${this._config.hold_to_pin ?? false}
                @change=${(e) => this._updateConfig("hold_to_pin", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.hold_to_pin')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.hold_to_pin')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.disable_autofocus ?? false}
                @change=${(e) => this._updateConfig("disable_autofocus", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.disable_autofocus')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.disable_autofocus')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.keep_filters_on_search ?? false}
                @change=${(e) => this._updateConfig("keep_filters_on_search", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.keep_filters')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.search_within_filter')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dismiss-search-on-play-toggle"
                .checked=${this._config.dismiss_search_on_play ?? true}
                @change=${(e) => this._updateConfig("dismiss_search_on_play", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.dismiss_on_play')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.close_search_on_play')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div style="${(this._config.entities?.length === 1 && this._config.always_collapsed === true && this._config.expand_on_search !== true) ? "opacity: 0.5;" : ""}"
              title="${(this._config.entities?.length === 1 && this._config.always_collapsed === true && this._config.expand_on_search !== true) ? "Not available with one entity in Always Collapsed mode unless Expand on Search is enabled" : ""}">
              <ha-switch
                id="pin-search-headers-toggle"
                .checked=${this._config.pin_search_headers ?? false}
                @change=${(e) => this._updateConfig("pin_search_headers", e.target.checked)}
                .disabled=${(this._config.entities?.length === 1 && this._config.always_collapsed === true && this._config.expand_on_search !== true)}
              ></ha-switch>
              <span>${localize('editor.labels.pin_headers')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.pin_search_headers')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="disable-mass-queue-toggle"
                .checked=${this._config.disable_mass_queue ?? false}
                @change=${(e) => this._updateConfig("disable_mass_queue", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.disable_mass')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.disable_mass')}</div>
          </div>
            <div class="form-row form-row-multi-column">
              <div class="grow-children number-input-with-note">
                <ha-selector-number
                  .selector=${{ number: { min: 0, max: 1000, step: 1, mode: "box" } }}
                  .value=${this._config.search_results_limit ?? 20}
                  label="${localize('editor.fields.search_limit')}"
                  helper="${localize('editor.subtitles.search_limit_full')}"
                  @value-changed=${(e) => this._updateConfig("search_results_limit", e.detail.value)}
                ></ha-selector-number>
                ${searchLimitWarningActive ? html`
                  <div class="config-subtitle warning">
                    Warning: requesting higher results can cause performance issues.
                  </div>
                ` : nothing}
            </div>
            <ha-icon
              class="icon-button"
              id="search-limit-reset"
              icon="mdi:restore"
              title="${localize('common.reset_default')}"
              @click=${() => this._updateConfig("search_results_limit", 20)}
            ></ha-icon>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
        select: {
          mode: "dropdown", options: [
            { value: "default", label: "Default" },
            { value: "title_asc", label: "Title Ascending" },
            { value: "title_desc", label: "Title Descending" },
            { value: "artist_asc", label: "Artist Ascending" },
            { value: "artist_desc", label: "Artist Descending" },
          ]
        }
      }}
              .value=${this._config.search_results_sort ?? "default"}
              label="${localize('editor.fields.result_sorting')}"
              helper="${localize('editor.subtitles.result_sorting_full')}"
              @value-changed=${(e) => this._updateConfig("search_results_sort", e.detail.value)}
            ></ha-selector>
          </div>
        </div>
      `;
  }

  _renderVisualTab() {
    const renderVolumeStep = this._config.volume_mode === "stepper"
      ? html`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{ number: { min: 0.01, max: 1, step: 0.01, unit_of_measurement: "", mode: "box" } }}
                .value=${this._config.volume_step ?? 0.05}
                label="${localize('editor.fields.vol_step')}"
                @value-changed=${(e) => this._updateConfig("volume_step", e.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${localize('common.reset_default')}"
              @click=${() => this._updateConfig("volume_step", 0.05)}
            ></ha-icon>
          </div>
        `
      : nothing;

    return html`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.look_and_feel.theme_layout.title')}</div>
            <div class="section-description">${localize('editor.sections.look_and_feel.theme_layout.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="match-theme-toggle"
                .checked=${this._config.match_theme ?? false}
                @change=${(e) => this._updateConfig("match_theme", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.match_theme')}</span>
            </div>
            <div>
              <ha-switch
                id="alternate-progress-bar-toggle"
                .checked=${this._config.alternate_progress_bar ?? false}
                @change=${(e) => this._updateConfig("alternate_progress_bar", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.alt_progress')}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div title=${(this._config.alternate_progress_bar || this._config.always_collapsed) ? localize('editor.subtitles.not_available_alt_collapsed') : ""}>
              <ha-switch
                id="display-timestamps-toggle"
                .checked=${this._config.display_timestamps ?? false}
                @change=${(e) => this._updateConfig("display_timestamps", e.target.checked)}
                .disabled=${this._config.alternate_progress_bar || this._config.always_collapsed}
              ></ha-switch>
              <span>${localize('editor.labels.display_timestamps')}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-textfield
                class="full-width"
                type="number"
                min="0"
                label="${localize('editor.fields.card_height')}"
                .value=${this._config.card_height ?? ""}
                helper="${localize('editor.subtitles.card_height_full')}"
                .helperPersistent=${true}
                @input=${(e) => {
        const raw = e.target.value;
        if (raw === "") {
          this._updateConfig("card_height", undefined);
          return;
        }
        const parsed = Number(raw);
        this._updateConfig("card_height", Number.isFinite(parsed) && parsed > 0 ? parsed : undefined);
      }}
              ></ha-textfield>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${localize('common.reset_default')}"
              @click=${() => this._updateConfig("card_height", undefined)}
            ></ha-icon>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.look_and_feel.controls_typography.title')}</div>
            <div class="section-description">${localize('editor.sections.look_and_feel.controls_typography.description')}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
        select: {
          mode: "dropdown",
          options: [
            { value: "classic", label: "Classic" },
            { value: "modern", label: "Modern" },
          ],
        },
      }}
              .value=${this._config.control_layout ?? "classic"}
              label="${localize('editor.fields.control_layout')}"
              helper="${localize('editor.subtitles.control_layout_full')}"
              @value-changed=${(e) => this._updateConfig("control_layout", e.detail.value)}
            ></ha-selector>
          </div>
          <div class="form-row"
            style="${(this._config.control_layout ?? "classic") === "modern" ? "" : "opacity: 0.5;"}"
            title="${(this._config.control_layout ?? "classic") === "modern" ? "" : localize('editor.subtitles.only_available_modern')}"}>
            <div>
              <ha-switch
                .checked=${this._config.swap_pause_for_stop ?? false}
                @change=${(e) => this._updateConfig("swap_pause_for_stop", e.target.checked)}
                .disabled=${(this._config.control_layout ?? "classic") !== "modern"}
              ></ha-switch>
              <span>${localize('editor.labels.swap_pause_stop')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.swap_pause_stop')}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="adaptive-controls-toggle"
                .checked=${this._config.adaptive_controls ?? false}
                @change=${(e) => this._updateConfig("adaptive_controls", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.adaptive_controls')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.adaptive_controls')}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="hide-active-entity-label-toggle"
                .checked=${this._config.hide_active_entity_label ?? false}
                @change=${(e) => this._updateConfig("hide_active_entity_label", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.hide_active_entity')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.hide_menu_player')}</div>
          </div>
        <div class="form-row">
          <div class="full-width">
            <span class="form-label">${localize('editor.labels.adaptive_text_elements')}</span>
            <div class="config-subtitle">${localize('editor.subtitles.adaptive_text')}</div>
            <ha-selector
              .hass=${this.hass}
              .selector=${{
        select: {
          multiple: true,
          options: ADAPTIVE_TEXT_SELECTOR_OPTIONS,
        },
      }}
              .value=${this._getAdaptiveTextTargetsValue()}
              @value-changed=${(e) => this._onAdaptiveTextTargetsChanged(e.detail.value)}
            ></ha-selector>
          </div>
        </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
        select: {
          mode: "dropdown", options: [
            { value: "slider", label: "Slider" },
            { value: "stepper", label: "Stepper" },
            { value: "hidden", label: "Hidden" },
          ]
        }
      }}
              .value=${this._config.volume_mode ?? "slider"}
              label="${localize('editor.fields.volume_mode')}"
              @value-changed=${(e) => this._updateConfig("volume_mode", e.detail.value)}
            ></ha-selector>
          </div>
          ${renderVolumeStep}
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.look_and_feel.collapsed_idle.title')}</div>
            <div class="section-description">${localize('editor.sections.look_and_feel.collapsed_idle.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="collapse-on-idle-toggle"
                .checked=${this._config.collapse_on_idle ?? false}
                @change=${(e) => this._updateConfig("collapse_on_idle", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.collapse_on_idle')}</span>
            </div>
            <div style="${!this._config.always_collapsed ? "" : "opacity: 0.5;"}"
              title="${!this._config.always_collapsed ? "" : localize('editor.subtitles.not_available_collapsed')}">
              <ha-switch
                id="hide-menu-player-toggle"
                .checked=${this._config.hide_menu_player ?? false}
                @change=${(e) => this._updateConfig("hide_menu_player", e.target.checked)}
                .disabled=${!!this._config.always_collapsed || (this._config.always_collapsed === true && this._config.pin_search_headers === true && this._config.expand_on_search === true)}
              ></ha-switch>
              <span>${localize('editor.labels.hide_menu_player_toggle')}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="always-collapsed-toggle"
                .checked=${this._config.always_collapsed ?? false}
                @change=${(e) => this._updateConfig("always_collapsed", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.always_collapsed')}</span>
            </div>
            <div style="${this._config.always_collapsed ? "" : "opacity: 0.5;"}"
              title="${this._config.always_collapsed ? "" : localize('editor.subtitles.only_available_collapsed')}">
              <ha-switch
                id="expand-on-search-toggle"
                .checked=${this._config.expand_on_search ?? false}
                @change=${(e) => this._updateConfig("expand_on_search", e.target.checked)}
                .disabled=${!this._config.always_collapsed}
              ></ha-switch>
              <span>${localize('editor.labels.expand_on_search')}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="config-subtitle">${localize('editor.subtitles.collapse_expand')}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
        select: {
          mode: "dropdown",
          options: [
            { value: "default", label: "Default" },
            { value: "search", label: "Search" },
            { value: "search-recently-played", label: "Recently Played" },
            { value: "search-next-up", label: "Next Up" }
          ]
        }
      }}
              .value=${this._config.idle_screen ?? "default"}
              label="${localize('editor.fields.idle_screen')}"
              @value-changed=${(e) => this._updateConfig("idle_screen", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.idle_screen')}</div>
          </div>
        </div>

      `;
  }

  _renderActionsTab() {
    let actions = [...(this._config.actions ?? [])];
    return html`
        <div class="action-group config-section">
          <div class="action-group-header section-header">
            <div class="action-group-title section-title">${localize('editor.sections.actions.title')}</div>
            <div class="section-description">${localize('editor.sections.actions.description')}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${(e) => this._onActionMoved(e)}>
              <div class="sortable-container">
                ${actions.map((act, idx) => html`
                  <div class="action-row-inner sortable-item">
                    <div class="handle action-handle">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    ${act?.icon ? html`
                      <ha-icon class="action-icon" icon="${act?.icon}"></ha-icon>
                    ` : html`<span class="action-icon-placeholder"></span>`}
                    <div class="grow-children">
                      <ha-textfield
                        placeholder="(Icon Only)"
                        .value=${act?.name ?? ""}
                        .helper=${(() => {
        const inMenu = act?.in_menu ? " \u2022 In Menu" : "";
        if (act?.action === "sync_selected_entity") {
          return `${localize('editor.action_helpers.sync_selected_entity')} ${act.sync_entity_helper || localize('editor.action_helpers.select_helper')}`;
        }
        if (act?.menu_item) {
          return `Open Menu Item: ${act.menu_item}${inMenu}`;
        }
        if (act?.service) {
          return `Call Service: ${act.service}${inMenu}`;
        }
        if (act?.navigation_path || act?.action === "navigate") {
          const newTab = act?.navigation_new_tab ? " (New Tab)" : "";
          return `Navigate to ${act.navigation_path || "(missing path)"}${newTab}${inMenu}`;
        }
        return act?.in_menu ? `Not Configured${inMenu}` : "Not Configured";
      })()}
                        .helperPersistent=${true}
                        @input=${a => this._onActionChanged(idx, a.target.value)}
                      ></ha-textfield>
                    </div>
                    <div class="action-row-actions">
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:pencil"
                        title="${localize('common.edit_action')}"
                        @click=${() => this._onEditAction(idx)}
                      ></ha-icon>
                      ${act?.action !== "sync_selected_entity" ? html`
                      <ha-icon
                        class="icon-button icon-button-compact icon-button-toggle ${act?.in_menu ? "active" : ""}"
                        icon="${act?.in_menu ? "mdi:menu" : "mdi:view-grid-outline"}"
                        title="${act?.in_menu ? localize('editor.fields.move_to_main') : localize('editor.fields.move_to_menu')}"
                        role="button"
                        aria-label="${act?.in_menu ? localize('editor.fields.move_to_main') : localize('editor.fields.move_to_menu')}"
                        @click=${() => this._toggleActionInMenu(idx)}
                      ></ha-icon>
                      ` : nothing}
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:trash-can"
                        title="${localize('editor.fields.delete_action')}"
                        @click=${() => this._removeAction(idx)}
                      ></ha-icon>
                    </div>
                  </div>
                `)}
              </div>
            </yamp-sortable>
          </div>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="Add Action"
              @click=${() => {
        const newActions = [...(this._config.actions ?? []), {}];
        const newIndex = newActions.length - 1;
        this._updateConfig("actions", newActions);
        this._onEditAction(newIndex);
      }}
            ></ha-icon>
          </div>
        </div>
      `;
  }

  _renderEntityEditor(entity) {

    const stateObj = this.hass?.states?.[entity?.entity_id];
    const showGroupVolume = this._isGroupCapable(stateObj);

    return html`
        <div class="entity-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromEntityEditor}>
          </ha-icon>
          <div class="entity-editor-title">${localize('editor.titles.edit_entity')}</div>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ entity: { domain: "media_player" } }}
            .value=${entity?.entity_id ?? ""}
          
            disabled
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="${localize('editor.fields.name')}"
            .value=${entity?.name ?? ""}
            @input=${(e) => this._updateEntityProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
        select: {
          mode: "dropdown",
          multiple: true,
          options: [
            { value: "previous", label: "Previous Track" },
            { value: "play_pause", label: "Play/Pause" },
            { value: "stop", label: "Stop" },
            { value: "next", label: "Next Track" },
            { value: "shuffle", label: "Shuffle" },
            { value: "repeat", label: "Repeat" },
            { value: "favorite", label: "Favorite" },
            { value: "power", label: "Power" }
          ]
        }
      }}
            .value=${Array.isArray(entity?.hidden_controls) ? entity.hidden_controls : []}
            .required=${false}
            .invalid=${false}
            label="${localize('editor.fields.hidden_controls')}"
            helper="${localize('editor.subtitles.hide_controls')}"
            @value-changed=${(e) => this._updateEntityProperty("hidden_controls", e.detail.value)}
          ></ha-selector>
        </div>

 

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="ma-template-toggle"
              .checked=${this._useTemplate ?? this._looksLikeTemplate(entity?.music_assistant_entity)}
              @change=${(e) => {
        this._useTemplate = e.target.checked;
      }}
            ></ha-switch>
            <label for="ma-template-toggle">${localize('editor.labels.use_ma_template')}</label>
          </div>
        </div>

        ${(this._useTemplate ?? this._looksLikeTemplate(entity?.music_assistant_entity))
        ? html`
      <div class="form-row">
        <div class=${this._yamlError && (entity?.music_assistant_entity ?? "").trim() !== ""
            ? "code-editor-wrapper error"
            : "code-editor-wrapper"}>
          <ha-code-editor
            id="ma-template-editor"
            label="${localize('editor.fields.ma_template')}"
            .hass=${this.hass}
            mode="jinja2"
            autocomplete-entities
            .value=${entity?.music_assistant_entity ?? ""}
            @value-changed=${(e) => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
          ></ha-code-editor>
          <div class="help-text">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            ${localize('editor.subtitles.jinja_template_hint')}
            <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_select.kitchen_stream_source','Music Stream 1') %}
  media_player.picore_house
{% else %}
  media_player.ma_wiim_mini
{% endif %}</pre>
           </pre>
          </div>
        </div>
      </div>
    `
        : html`
      <div class="form-row">
        <ha-generic-picker
          .hass=${this.hass}
          .value=${this._isEntityId(entity?.music_assistant_entity) ? entity.music_assistant_entity : ""}
          .label=${localize('editor.fields.ma_entity')}
          .valueRenderer=${(v) => this._entityValueRenderer(v)}
          .rowRenderer=${(item) => this._entityRowRenderer(item)}
          .getItems=${this._getEntityItems(["media_player"])}
          @value-changed=${(e) => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
          allow-custom-value
        ></ha-generic-picker>
      </div>
      ${(() => {
            const mainId = entity?.entity_id;
            const mainState = mainId ? this.hass?.states?.[mainId] : undefined;
            const mainIsMA = mainState ? isMusicAssistantEntity(mainState) : false;
            const rawMa = entity?.music_assistant_entity;
            const isTemplate = this._looksLikeTemplate?.(rawMa);
            const maId = (typeof rawMa === 'string' && !isTemplate) ? rawMa : undefined;
            const maState = maId ? this.hass?.states?.[maId] : undefined;
            const maIsMA = maState ? isMusicAssistantEntity(maState) : false;
            // Only show under the dropdown (non-template path)
            const showHiddenFilterChips = mainIsMA || maIsMA;
            if (!showHiddenFilterChips) return nothing;
            return html`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
                select: {
                  mode: "dropdown",
                  multiple: true,
                  options: [
                    { value: "artist", label: "Artist" },
                    { value: "album", label: "Album" },
                    { value: "track", label: "Track" },
                    { value: "playlist", label: "Playlist" },
                    { value: "radio", label: "Radio" },
                    { value: "podcast", label: "Podcast" },
                    { value: "episode", label: "Episode" }
                  ]
                }
              }}
              .value=${Array.isArray(entity?.hidden_filter_chips) ? entity.hidden_filter_chips : []}
              .required=${false}
              .invalid=${false}
              label="${localize('editor.fields.hidden_chips')}"
              helper="${localize('editor.subtitles.hide_search_chips')}"
              @value-changed=${(e) => this._updateEntityProperty("hidden_filter_chips", e.detail.value)}
            ></ha-selector>
          </div>
        `;
          })()}
    `}

 

        ${showGroupVolume ? html`
          <div class="form-row">
            <ha-switch
              id="group-volume-toggle"
              .checked=${entity?.group_volume ?? true}
              @change=${(e) =>
          this._updateEntityProperty("group_volume", e.target.checked)}
            ></ha-switch>
            <label for="group-volume-toggle">Group Volume</label>
          </div>
        ` : nothing}

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="follow-active-toggle"
              .checked=${entity?.follow_active_volume ?? false}
              @change=${(e) =>
        this._updateEntityProperty("follow_active_volume", e.target.checked)}
            ></ha-switch>
            <label for="follow-active-toggle">${localize('editor.labels.follow_active_entity')}</label>
          </div>
          ${!(entity?.follow_active_volume ?? false) ? html`
            <div>
              <ha-switch
                id="vol-template-toggle"
                .checked=${this._useVolTemplate ?? this._looksLikeTemplate(entity?.volume_entity)}
                @change=${(e) => {
          this._useVolTemplate = e.target.checked;
        }}
              ></ha-switch>
              <label for="vol-template-toggle">${localize('editor.labels.use_vol_template')}</label>
            </div>
          ` : nothing}
        </div>

        ${!(entity?.follow_active_volume ?? false) ? html`
          ${(this._useVolTemplate ?? this._looksLikeTemplate(entity?.volume_entity))
          ? html`
                <div class="form-row">
                  <div class=${this._yamlError && (entity?.volume_entity ?? "").trim() !== ""
              ? "code-editor-wrapper error"
              : "code-editor-wrapper"}>
                    <ha-code-editor
                      id="vol-template-editor"
                      label="${localize('editor.fields.vol_template')}"
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      .value=${entity?.volume_entity ?? ""}
                      @value-changed=${(e) => this._updateEntityProperty("volume_entity", e.detail.value)}
                    ></ha-code-editor>
                    <div class="help-text">
                      <ha-icon icon="mdi:information-outline"></ha-icon>
                      ${localize('editor.subtitles.jinja_template_vol_hint')}
                      <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_boolean.tv_volume','on') %}
  remote.soundbar
{% else %}
  media_player.office_homepod
{% endif %}</pre>
                    </div>
                  </div>
                </div>
              `
          : html`
                <div class="form-row">
                  <ha-generic-picker
                    .hass=${this.hass}
                    .value=${this._isEntityId(entity?.volume_entity) ? entity.volume_entity : (entity?.entity_id ?? "")}
                    .label=${localize('editor.fields.vol_entity')}
                    .valueRenderer=${(v) => this._entityValueRenderer(v)}
                    .rowRenderer=${(item) => this._entityRowRenderer(item)}
                    .getItems=${this._getEntityItems(["media_player", "remote"])}
                    @value-changed=${(e) => {
              const value = e.detail.value;
              this._updateEntityProperty("volume_entity", value);

              if (!value || value === entity.entity_id) {
                // sync_power is meaningless in these cases
                this._updateEntityProperty("sync_power", false);
              }
            }}
                    allow-custom-value
                  ></ha-generic-picker>
                </div>
              `}
        ` : nothing}

        ${entity?.volume_entity && entity.volume_entity !== entity.entity_id && !(entity?.follow_active_volume ?? false)

        ? html`
              <div class="form-row form-row-multi-column">
                <div>
                  <ha-switch
                    id="sync-power-toggle"
                    .checked=${entity?.sync_power ?? false}
                    @change=${(e) =>
            this._updateEntityProperty("sync_power", e.target.checked)}
                  ></ha-switch>
                  <label for="sync-power-toggle">Sync Power</label>
                </div>
              </div>
            `
        : nothing}

        ${entity?.follow_active_volume ? html`
            <div class="help-text">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              ${localize('editor.subtitles.follow_active_entity')}
              <br><br>
            </div>
        ` : nothing}
        </div>
      `;
  }

  _renderActionEditor(action) {

    const actionMode = this._actionMode ?? this._deriveActionMode(action);

    return html`
        <div class="action-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromActionEditor}>
          </ha-icon>
          <div class="action-editor-title">${localize('editor.titles.edit_action')}</div>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="${localize('editor.fields.name')}"
            placeholder="(Icon Only)"
            .value=${action?.name ?? ""}
            @input=${(e) => this._updateActionProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="${localize('editor.fields.icon')}"
            .hass=${this.hass}
            .value=${action?.icon ?? ""}
            @value-changed=${(e) =>
        this._updateActionProperty("icon", e.detail.value)}
          ></ha-icon-picker>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="${localize('editor.fields.action_type')}"
            .selector=${{
        select: {
          mode: "dropdown",
          options: [
            { value: "menu", label: localize('editor.action_types.menu') },
            { value: "service", label: localize('editor.action_types.service') },
            { value: "navigate", label: localize('editor.action_types.navigate') },
            { value: "sync_selected_entity", label: localize('editor.action_types.sync_selected_entity') }
          ]
        }
      }}
            .value=${this._actionMode ?? this._deriveActionMode(action)}
            @value-changed=${(e) => {
        const mode = e.detail.value;
        this._actionMode = mode;
        if (mode === "service") {
          this._updateActionProperty("menu_item", undefined);
          this._updateActionProperty("navigation_path", undefined);
          this._updateActionProperty("navigation_new_tab", undefined);
          this._updateActionProperty("action", undefined);
          // Initialize service to empty string so Service Data editor renders immediately
          if (!this._config.actions?.[this._actionEditorIndex]?.service) {
            this._updateActionProperty("service", "");
          }
        } else if (mode === "menu") {
          this._updateActionProperty("service", undefined);
          this._updateActionProperty("service_data", undefined);
          this._updateActionProperty("script_variable", undefined);
          this._updateActionProperty("navigation_path", undefined);
          this._updateActionProperty("navigation_new_tab", undefined);
          this._updateActionProperty("action", undefined);
        } else if (mode === "navigate") {
          this._updateActionProperty("menu_item", undefined);
          this._updateActionProperty("service", undefined);
          this._updateActionProperty("service_data", undefined);
          this._updateActionProperty("script_variable", undefined);
          this._updateActionProperty("action", "navigate");
          if (!action?.navigation_path) {
            this._updateActionProperty("navigation_path", "");
          }
        } else if (mode === "sync_selected_entity") {
          this._updateActionProperty("menu_item", undefined);
          this._updateActionProperty("service", undefined);
          this._updateActionProperty("service_data", undefined);
          this._updateActionProperty("script_variable", undefined);
          this._updateActionProperty("navigation_path", undefined);
          this._updateActionProperty("navigation_new_tab", undefined);
          this._updateActionProperty("action", "sync_selected_entity");
          if (!action?.sync_entity_type) {
            this._updateActionProperty("sync_entity_type", "yamp_entity");
          }
        }
      }}
          ></ha-selector>
        </div>
        
        ${actionMode === "menu" ? html`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${localize('editor.fields.menu_item')}"
              .selector=${{
          select: {
            mode: "dropdown",
            options: [
              { value: "", label: "" },
              { value: "search", label: "Search" },
              { value: "search-recently-played", label: "Recently Played" },
              { value: "search-next-up", label: "Next Up" },
              { value: "source", label: "Source" },
              { value: "more-info", label: "More Info" },
              { value: "group-players", label: "Group Players" },
              { value: "transfer-queue", label: "Transfer Queue" }
            ]
          }
        }}
              .value=${action?.menu_item ?? ""}
              @value-changed=${(e) =>
          this._updateActionProperty("menu_item", e.detail.value || undefined)}
            ></ha-selector>
          </div>
        ` : nothing} 
        ${actionMode === "navigate" ? html`
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${localize('editor.fields.nav_path')}"
              placeholder="/lovelace/music or #popup"
              .value=${action?.navigation_path ?? ""}
              @input=${(e) => {
          this._updateActionProperty("navigation_path", e.target.value);
          this._updateActionProperty("action", "navigate");
        }}
            ></ha-textfield>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="navigation-new-tab-toggle"
                .checked=${action?.navigation_new_tab ?? false}
                @change=${(e) => this._updateActionProperty("navigation_new_tab", e.target.checked)}
              ></ha-switch>
              <label for="navigation-new-tab-toggle">Open External URLs in New Tab</label>
            </div>
          </div>
          <div class="form-row">
            <div class="config-subtitle">Supports dashboard paths, URLs, and anchors (e.g., <code>/lovelace/music</code> or <code>#pop-up-menu</code>).</div>
          </div>
        ` : nothing}
        ${actionMode === "sync_selected_entity" ? html`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{ entity: { domain: "input_text" } }}
              .value=${action?.sync_entity_helper ?? ""}
              label="${localize('editor.fields.selected_entity_helper')}"
              @value-changed=${(e) => this._updateActionProperty("sync_entity_helper", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.selected_entity_helper')}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${localize('editor.fields.sync_entity_type')}"
              .selector=${{
          select: {
            mode: "dropdown",
            options: [
              { value: "yamp_entity", label: localize('editor.sync_entity_options.yamp_entity') },
              { value: "yamp_main_entity", label: localize('editor.sync_entity_options.yamp_main_entity') },
              { value: "yamp_playback_entity", label: localize('editor.sync_entity_options.yamp_playback_entity') }
            ]
          }
        }}
              .value=${action?.sync_entity_type ?? "yamp_entity"}
              @value-changed=${(e) => this._updateActionProperty("sync_entity_type", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.sync_entity_type')}</div>
          </div>
        ` : nothing}
        ${actionMode === 'service' ? html`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
          select: {
            mode: "dropdown",
            filterable: true,
            options: this._serviceItems || []
          }
        }}
              .value=${action.service ?? ""}
              label="${localize('editor.fields.service')}"
              .required=${true}
              @value-changed=${(e) => this._updateActionProperty("service", e.detail.value)}
            ></ha-selector>
          </div>

          ${typeof action.service === "string" && action.service.startsWith("script.") ? html`
            <div class="form-row form-row-multi-column">
              <div>
                <ha-switch
                  id="script-variable-toggle"
                  .checked=${action?.script_variable ?? false}
                  @change=${(e) =>
            this._updateActionProperty("script_variable", e.target.checked)}
                ></ha-switch>
                <span>${localize('editor.labels.script_var')}</span>
              </div>
            </div>
          ` : nothing}

          ${typeof action.service === "string" ? html`
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>

              ${localize('editor.subtitles.entity_current_hint')}

            </div>
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>
            ${localize('editor.subtitles.service_data_note')}
            </div>
            <div class="form-row">
              <div class="service-data-editor-header">
                <div class="service-data-editor-title">${localize('editor.titles.service_data')}</div>
                <div class="service-data-editor-actions">
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:content-save"
                    title="${localize('editor.fields.save_service_data')}"
                    @click=${this._saveYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:backup-restore"
                    title="${localize('editor.fields.revert_service_data')}"
                    @click=${this._revertYamlEditor}
                  ></ha-icon>
                  <ha-icon

                    class="icon-button ${this._yamlError || this._yamlDraftUsesCurrentEntity() || !action?.service
            ? "icon-button-disabled" : ""}"

                    icon="mdi:play-circle-outline"
                    title="${localize('editor.fields.test_action')}"
                    @click=${this._testServiceCall}
                  ></ha-icon>              
                </div>
            </div>
            <div class=${this._yamlError && this._yamlDraft.trim() !== ""
            ? "code-editor-wrapper error"
            : "code-editor-wrapper"}>
              <ha-code-editor
                id="service-data-editor"
                label="${localize('editor.fields.service_data')}"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                mode="yaml"
                .value=${action?.service_data ? yaml.dump(action.service_data) : ""}
                @value-changed=${(e) => {
            /* the yaml will be parsed in real time to detect errors, but we will defer 
              updating the config until the save button above the editor is clicked.
            */
            this._yamlDraft = e.detail.value;
            this._yamlModified = true;
            try {
              const parsed = yaml.load(this._yamlDraft);
              if (parsed && typeof parsed === "object") {
                this._yamlError = null;
              } else {
                this._yamlError = "Invalid YAML";
              }
            } catch (err) {
              this._yamlError = err.message;
            }
          }}
              ></ha-code-editor>
              ${this._yamlError && this._yamlDraft.trim() !== ""
            ? html`<div class="yaml-error-message">${this._yamlError}</div>`
            : nothing}
            </div>
          ` : nothing}
        ` : nothing}
      </div>`
  }

  _onEntityChanged(index, newValue) {
    const original = this._config.entities ?? [];
    const updated = [...original];

    if (!newValue) {
      // Remove empty row
      updated.splice(index, 1);
    } else {
      updated[index] = { ...updated[index], entity_id: newValue };
    }

    // Always strip blank row before writing to config
    const cleaned = updated.filter((e) => e.entity_id && e.entity_id.trim() !== "");

    this._updateConfig("entities", cleaned);
  }

  _onActionChanged(index, newValue) {
    const original = this._config.actions ?? [];
    const updated = [...original];

    updated[index] = { ...updated[index], name: newValue };

    this._updateConfig("actions", updated);
  }

  _onEditEntity(index) {
    this._entityEditorIndex = index;
    const ent = this._config.entities?.[index];
    const mae = ent?.music_assistant_entity;
    this._useTemplate = this._looksLikeTemplate(mae) ? true : false;
    const vol = ent?.volume_entity;
    this._useVolTemplate = this._looksLikeTemplate(vol) ? true : false;
  }

  _onEditAction(index) {
    this._actionEditorIndex = index;
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
    this._useTemplate = null; // re-detect next open
    this._useVolTemplate = null; // re-detect next open
  }

  _onBackFromActionEditor() {
    this._actionEditorIndex = null;
    this._actionMode = null;
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
    this._updateConfig("actions", actions);
  }

  _toggleActionInMenu(index) {
    const actions = [...(this._config.actions ?? [])];
    if (!actions[index]) return;
    const current = !!actions[index].in_menu;
    actions[index] = { ...actions[index], in_menu: !current };
    this._updateConfig("actions", actions);
  }

  _saveYamlEditor() {
    try {
      const parsed = yaml.load(this._yamlDraft);

      if (!parsed || typeof parsed !== "object") {
        this._yamlError = "YAML is not a valid object.";
        return;
      }

      this._updateActionProperty("service_data", parsed);
      this._yamlDraft = yaml.dump(parsed);
      this._yamlError = null;
      this._parsedYaml = parsed;
    } catch (err) {
      this._yamlError = err.message;
    }
  }

  _revertYamlEditor() {
    const editor = this.shadowRoot.querySelector("#service-data-editor");
    const currentAction = this._config.actions?.[this._actionEditorIndex];

    if (!editor || !currentAction) return;

    const yamlText = currentAction.service_data ? yaml.dump(currentAction.service_data) : "";
    editor.value = yamlText;

    this._yamlDraft = yamlText;
    this._yamlError = null;
    this._yamlModified = false;
  }


  _yamlDraftUsesCurrentEntity() {
    if (!this._yamlDraft) return false;
    const regex = /^\s*entity_id\s*:\s*current\s*$/m;
    let result = regex.test(this._yamlDraft);
    return result;
  }


  async _testServiceCall() {
    if (this._yamlError || !this._yamlDraft?.trim()) {
      return;
    }

    let serviceData;
    try {
      serviceData = yaml.load(this._yamlDraft);
      if (typeof serviceData !== "object" || serviceData === null) {
        console.error("yamp: Service data must be a valid object.");
        return;
      }
    } catch (e) {
      this._yamlError = e.message;
      return;
    }

    const action = this._config.actions?.[this._actionEditorIndex];
    const service = action?.service;
    if (!service || !this.hass) {
      return;
    }

    const [domain, serviceName] = service.split(".");
    if (!domain || !serviceName) {
      return;
    }

    try {
      await this.hass.callService(domain, serviceName, serviceData);
    } catch (err) {
      console.error("yamp: Failed to call service:", err);
    }
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
    return value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('/') ||
      value.includes('.jpg') ||
      value.includes('.jpeg') ||
      value.includes('.png') ||
      value.includes('.gif') ||
      value.includes('.webp');
  }
}

customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);

