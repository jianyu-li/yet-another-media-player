// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';
import { LitElement, html, css, nothing } from "lit";
import yaml from 'js-yaml';

import {SUPPORT_GROUPING} from "./constants.js";
import "./yamp-sortable.js";
  
class YetAnotherMediaPlayerEditor extends LitElement {
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
      };
    }
  
    constructor() {
      super();
      this._activeTab = "Entities";
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
          };
        }

        const sizePercentage = item.size_percentage;

        if (item.missing_art_url !== undefined) {
          return {
            match_type: "missing_art",
            match_value: "",
            image_url: item.missing_art_url ?? "",
            size_percentage: sizePercentage,
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
        };
      });
    }

    _serializeArtworkOverride(rule) {
      if (!rule) return null;
      const image = (rule.image_url ?? "").trim();
      if (!image) return null;

      if (rule.match_type === "missing_art") {
        return {
          missing_art_url: image,
          ...(rule.size_percentage !== undefined ? { size_percentage: rule.size_percentage } : {}),
        };
      }

      const value = (rule.match_value ?? "").trim();
      if (!value) return null;

      return {
        image_url: image,
        [rule.match_type]: value,
        ...(rule.size_percentage !== undefined ? { size_percentage: rule.size_percentage } : {}),
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
      list.push({ match_type: "media_title", match_value: "", image_url: "", size_percentage: undefined });
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
          /*gap: 12px;*/
        }
        .form-row-multi-column > div {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .config-subtitle {
          font-size: 0.85em;
          color: var(--secondary-text-color, #888);
          margin-top: 4px;
          line-height: 1.3;
          font-style: italic;
        }
        /* reduced padding for entity selection subrows */
        .entity-row {
          padding: 6px;
        }
        /* visually isolate grouped controls */
        .entity-group, .action-group {
          background: var(--card-background-color, #f7f7f7);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 16px;
          margin-top: 16px;
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
        .entity-group-header, .action-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0px 6px;
        }
        .entity-group-title, action-group-title {
          font-weight: 500;
        }
        .entity-group-actions, action-group-actions {
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
        .icon-button:hover {
          color: var(--primary-color, #2196f3);
        }
        .icon-button-disabled {
          opacity: 0.4;
          pointer-events: none;
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
          ${["Entities","Behavior","Look and Feel","Artwork","Actions"].map((name) => html`
            <button
              class="tab" ${this._activeTab === name ? 'selected' : ''}
              @click=${() => { 
                this._activeTab = name; 
                // Exit any sub-editor when switching tabs
                this._entityEditorIndex = null;
                this._actionEditorIndex = null;
                this._useTemplate = null;
                this._useVolTemplate = null;
              }}
              ?selected=${this._activeTab === name}
            >${name}</button>
          `)}
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
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="Artwork Fit"
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
        </div>
        <div class="form-row">
          <div class="config-subtitle">
            Controls how artwork scales across the card (main art, chips, overrides). Choose a different fit if images appear cropped or stretched.
          </div>
        </div>

        <div class="form-row action-group">
          <div class="action-group-header">
            <div class="action-group-title">Artwork Overrides</div>
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
                          label="Match Field"
                          .selector=${{ select: { mode: "dropdown", options: matchOptions } }}
                          .value=${rule.match_type ?? "media_title"}
                          @value-changed=${(e) => this._onArtworkMatchTypeChange(idx, e.detail.value)}
                        ></ha-selector>
                        ${
                          rule.match_type === "missing_art"
                            ? html`
                                <div class="config-subtitle small">
                                  Applies when the selected media provides no artwork.
                                </div>
                              `
                            : rule.match_type === "entity_id"
                              ? html`
                                  <ha-entity-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .includeDomains=${["media_player"]}
                                    .value=${rule.match_value ?? ""}
                                    @value-changed=${(e) =>
                                      this._onArtworkMatchValueChange(idx, e.detail.value)}
                                  ></ha-entity-picker>
                                `
                              : html`
                                  <ha-textfield
                                    class="full-width"
                                    label="Match Value"
                                    .value=${rule.match_value ?? ""}
                                    @input=${(e) => this._onArtworkMatchValueChange(idx, e.target.value)}
                                  ></ha-textfield>
                                `
                        }
                        <ha-textfield
                          class="full-width"
                          label=${rule.match_type === "missing_art" ? "Fallback Image URL" : "Image URL"}
                          .value=${rule.image_url ?? ""}
                          @input=${(e) => this._onArtworkImageUrlChange(idx, e.target.value)}
                        ></ha-textfield>
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
                : html`<div class="config-subtitle" style="padding:12px 0;">No artwork overrides configured. Use the plus button below to add one.</div>`}
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="Add Artwork Override"
              @click=${this._addArtworkOverride}
            ></ha-icon>
          </div>
        </div>
        <div class="form-row">
          <div class="config-subtitle">
            Overrides are evaluated from top to bottom. Drag to reorder. Changes save automatically.
          </div>
        </div>

      `;
    }

    _renderActiveTab() {
      switch (this._activeTab) {
        case "Entities":
          return this._renderEntitiesTab();
        case "Behavior":
          return this._renderBehaviorTab();
        case "Look and Feel":
          return this._renderVisualTab();
        case "Artwork":
          return this._renderArtworkTab();
        case "Actions":
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
        <div class="form-row entity-group">
          <div class="entity-group-header">
            <div class="entity-group-title">Entities*</div>
          </div>
          <yamp-sortable @item-moved=${(e) => this._onEntityMoved(e)}>
            <div class="sortable-container">
              ${entities.map((ent, idx) => html`
                <div class="entity-row-inner ${idx < entities.length - 1 ? 'sortable-item' : ''}" data-index="${idx}">
                  <div class="handle ${idx === entities.length - 1 ? 'handle-disabled' : ''}">
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </div>
                  <div class="grow-children">
                    ${idx === entities.length - 1 && !ent.entity_id
                      ? html`
                          <ha-entity-picker
                            .hass=${this.hass}
                            .value=${ent.entity_id}
                            .includeDomains=${["media_player"]}
                            .excludeEntities=${this._config.entities?.map(e => e.entity_id) ?? []}
                            clearable
                            @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                          ></ha-entity-picker>
                        `
                      : html`
                          <ha-selector
                            .hass=${this.hass}
                            .selector=${{ entity: { domain: "media_player" } }}
                            .value=${ent.entity_id}
                            clearable
                            @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                          ></ha-selector>
                        `}
                  </div>
                  <div class="entity-row-actions">
                    <ha-icon
                      class="icon-button ${!ent.entity_id ? "icon-button-disabled" : ""}"
                      icon="mdi:pencil"
                      title="Edit Entity Settings"
                      @click=${() => this._onEditEntity(idx)}
                    ></ha-icon>
                  </div>
                </div>
              `)}
            </div>
          </yamp-sortable>
        </div>
      `;
    }

    _renderBehaviorTab() {
      return html`
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
                number: { min: 0, step: 1000, unit_of_measurement: "ms", mode: "box" }
              }}
              .value=${this._config.idle_timeout_ms ?? 60000}
              label="Idle Timeout (ms)"
              @value-changed=${(e) => this._updateConfig("idle_timeout_ms", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">Time in milliseconds before the card enters idle mode. Set to 0 to disable idle behavior.</div>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="Reset to default"
            @click=${() => this._updateConfig("idle_timeout_ms", 60000)}
          ></ha-icon>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              select: { mode: "dropdown", options: [
                { value: "auto", label: "Auto" },
                { value: "always", label: "Always" },
                { value: "in_menu", label: "In Menu" }
              ]}
            }}
            .value=${this._config.show_chip_row ?? "auto"}
            label="Show Chip Row"
            @value-changed=${(e) => this._updateConfig("show_chip_row", e.detail.value)}
          ></ha-selector>
          <div class="config-subtitle">"Auto" hides the chip row when only one entity is configured. "In Menu" moves the chips into the menu overlay.</div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="hold-to-pin-toggle"
              .checked=${this._config.hold_to_pin ?? false}
              @change=${(e) => this._updateConfig("hold_to_pin", e.target.checked)}
            ></ha-switch>
            <span>Hold to Pin</span>
          </div>
          <div class="config-subtitle">Long press on entity chips instead of short press to pin them, preventing auto-switching during playback.</div>
        </div>

        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector-number
              .selector=${{ number: { min: 1, max: 100, step: 1, mode: "box" } }}
              .value=${this._config.search_results_limit ?? 20}
              label="Search Results Limit"
              helper="Maximum number of search results to display (1-100, default: 20)"
              @value-changed=${(e) => this._updateConfig("search_results_limit", e.detail.value)}
            ></ha-selector-number>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="Reset to default"
            @click=${() => this._updateConfig("search_results_limit", 20)}
          ></ha-icon>
        </div>

      `;
    }

    _renderVisualTab() {
      return html`
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="match-theme-toggle"
              .checked=${this._config.match_theme ?? false}
              @change=${(e) => this._updateConfig("match_theme", e.target.checked)}
            ></ha-switch>
            <span>Match Theme</span>
          </div>
          <div>
            <ha-switch
              id="alternate-progress-bar-toggle"
              .checked=${this._config.alternate_progress_bar ?? false}
              @change=${(e) => this._updateConfig("alternate_progress_bar", e.target.checked)}
            ></ha-switch>
            <span>Alternate Progress Bar</span>
          </div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="collapse-on-idle-toggle"
              .checked=${this._config.collapse_on_idle ?? false}
              @change=${(e) => this._updateConfig("collapse_on_idle", e.target.checked)}
            ></ha-switch>
            <span>Collapse on Idle</span>
          </div>
          ${!this._config.always_collapsed ? html`
            <div>
              <ha-switch
                id="hide-menu-player-toggle"
                .checked=${this._config.hide_menu_player ?? false}
                @change=${(e) => this._updateConfig("hide_menu_player", e.target.checked)}
              ></ha-switch>
              <span>Hide Menu Player</span>
            </div>
          ` : nothing}
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="always-collapsed-toggle"
              .checked=${this._config.always_collapsed ?? false}
              @change=${(e) => this._updateConfig("always_collapsed", e.target.checked)}
            ></ha-switch>
            <span>Always Collapsed</span>
          </div>
          ${this._config.always_collapsed ? html`
            <div>
              <ha-switch
                id="expand-on-search-toggle"
                .checked=${this._config.expand_on_search ?? false}
                @change=${(e) => this._updateConfig("expand_on_search", e.target.checked)}
              ></ha-switch>
              <span>Expand on Search</span>
            </div>
          ` : nothing}
        </div>
        <div class="form-row">
          <div class="config-subtitle">Always Collapsed creates mini player mode. Expand on Search temporarily expands when searching.</div>
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
            label="Idle Screen"
            @value-changed=${(e) => this._updateConfig("idle_screen", e.detail.value)}
          ></ha-selector>
          <div class="config-subtitle">Choose which screen to display automatically when the card becomes idle.</div>
        </div>

        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-textfield
              class="full-width"
              type="number"
              min="0"
              label="Card Height (px)"
              .value=${this._config.card_height ?? ""}
              helper="Leave blank for automatic height"
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
            title="Reset to default"
            @click=${() => this._updateConfig("card_height", undefined)}
          ></ha-icon>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ select: { mode: "dropdown", options: [
              { value: "slider", label: "Slider" },
              { value: "stepper", label: "Stepper" },
            ]}}}
            .value=${this._config.volume_mode ?? "slider"}
            label="Volume Mode"
            @value-changed=${(e) => this._updateConfig("volume_mode", e.detail.value)}
          ></ha-selector>
        </div>
        ${this._config.volume_mode === "stepper" ? html`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{ number: { min: 0.01, max: 1, step: 0.01, unit_of_measurement: "", mode: "box" } }}
                .value=${this._config.volume_step ?? 0.05}
                label="Volume Step (0.05 = 5%)"
                @value-changed=${(e) => this._updateConfig("volume_step", e.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="Reset to default"
              @click=${() => this._updateConfig("volume_step", 0.05)}
            ></ha-icon>
          </div>
        ` : nothing}

        <div class="form-row">
          <label style="margin-bottom: 8px;">Idle Image</label>
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
            <label for="idle-image-url-toggle">Use URL or Path</label>
          </div>
          <div style="flex: 2;">
            ${this._useIdleImageUrl ? html`
              <ha-textfield
                class="full-width"
                placeholder="e.g., https://example.com/image.jpg or /local/custom/image.jpg"
                .value=${this._config.idle_image ?? ""}
                @input=${(e) => this._updateConfig("idle_image", e.target.value)}
                helper="Enter a direct URL to an image or a local file path"
                .helperPersistent=${true}
              ></ha-textfield>
            ` : html`
              <ha-entity-picker
                class="full-width"
                .hass=${this.hass}
                .value=${this._config.idle_image ?? ""}
                .includeDomains=${["camera", "image"]}
                clearable
                @value-changed=${(e) => this._updateConfig("idle_image", e.detail.value)}
              ></ha-entity-picker>
            `}
          </div>
        </div>
      `;
    }

    _renderActionsTab() {
      let actions = [...(this._config.actions ?? [])];
      return html`
        <div class="form-row action-group">
          <div class="action-group-header">
            <div class="action-group-title">Actions</div>
          </div>
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
                      class="icon-button"
                      icon="mdi:pencil"
                      title="Edit Action Settings"
                      @click=${() => this._onEditAction(idx)}
                    ></ha-icon>
                    <ha-icon
                      class="icon-button"
                      icon="mdi:trash-can"
                      title="Delete Action"
                      @click=${() => this._removeAction(idx)}
                    ></ha-icon>
                  </div>
                </div>
              `)}
            </div>
          </yamp-sortable>
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
          <div class="entity-editor-title">Edit Entity</div>
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
            label="Name"
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
            label="Hidden Controls"
            helper="Select which controls to hide for this entity (all are shown by default)"
            @value-changed=${(e) => this._updateEntityProperty("hidden_controls", e.detail.value)}
          ></ha-selector>
        </div>

        ${ (this._useTemplate ?? this._looksLikeTemplate(entity?.music_assistant_entity))
  ? html`
      <div class="form-row">
        <div class=${this._yamlError && (entity?.music_assistant_entity ?? "").trim() !== "" 
          ? "code-editor-wrapper error" 
          : "code-editor-wrapper"}>
          <ha-code-editor
            id="ma-template-editor"
            label="Music Assistant Entity Template (Jinja)"
            .hass=${this.hass}
            mode="jinja2"
            autocomplete-entities
            .value=${entity?.music_assistant_entity ?? ""}
            @value-changed=${(e) => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
          ></ha-code-editor>
          <div class="help-text">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:
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
  : nothing}

 

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="ma-template-toggle"
              .checked=${this._useTemplate ?? this._looksLikeTemplate(entity?.music_assistant_entity)}
              @change=${(e) => {
                this._useTemplate = e.target.checked;
              }}
            ></ha-switch>
            <label for="ma-template-toggle">Use template for Music Assistant Entity</label>
          </div>
        </div>

        ${ (this._useTemplate ?? this._looksLikeTemplate(entity?.music_assistant_entity))
  ? html`
      <div class="form-row">
        <div class=${this._yamlError && (entity?.music_assistant_entity ?? "").trim() !== "" 
          ? "code-editor-wrapper error" 
          : "code-editor-wrapper"}>
          <ha-code-editor
            id="ma-template-editor"
            label="Music Assistant Entity Template (Jinja)"
            .hass=${this.hass}
            mode="jinja2"
            autocomplete-entities
            .value=${entity?.music_assistant_entity ?? ""}
            @value-changed=${(e) => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
          ></ha-code-editor>
          <div class="help-text">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:
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
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._isEntityId(entity?.music_assistant_entity) ? entity.music_assistant_entity : ""}
          .includeDomains=${["media_player"]}
          label="Music Assistant Entity (optional)"
          helper="Pick a Music Assistant player for search."
          clearable
          @value-changed=${(e) => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
        ></ha-entity-picker>
      </div>
      ${(() => {
        const mainId = entity?.entity_id;
        const mainState = mainId ? this.hass?.states?.[mainId] : undefined;
        const mainIsMA = !!(mainState && mainState.attributes?.app_id === 'music_assistant');
        const rawMa = entity?.music_assistant_entity;
        const isTemplate = this._looksLikeTemplate?.(rawMa);
        const maId = (typeof rawMa === 'string' && !isTemplate) ? rawMa : undefined;
        const maState = maId ? this.hass?.states?.[maId] : undefined;
        const maIsMA = !!(maState && maState.attributes?.app_id === 'music_assistant');
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
              label="Hidden Search Filter Chips"
              helper="Hide specific search filter chips for this entity"
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
            <label for="follow-active-toggle">Volume Entity Follows Active Entity</label>
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
              <label for="vol-template-toggle">Use template for Volume Entity</label>
            </div>
          ` : nothing}
        </div>

        ${ !(entity?.follow_active_volume ?? false) ? html`
          ${ (this._useVolTemplate ?? this._looksLikeTemplate(entity?.volume_entity))
            ? html`
                <div class="form-row">
                  <div class=${this._yamlError && (entity?.volume_entity ?? "").trim() !== "" 
                    ? "code-editor-wrapper error" 
                    : "code-editor-wrapper"}>
                    <ha-code-editor
                      id="vol-template-editor"
                      label="Volume Entity Template (Jinja)"
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      .value=${entity?.volume_entity ?? ""}
                      @value-changed=${(e) => this._updateEntityProperty("volume_entity", e.detail.value)}
                    ></ha-code-editor>
                    <div class="help-text">
                      <ha-icon icon="mdi:information-outline"></ha-icon>
                      Enter a Jinja template that resolves to an entity_id (e.g. <code>media_player.office_homepod</code> or <code>remote.soundbar</code>).
                      Example switching volume entity based on a boolean:
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
                  <ha-entity-picker
                    .hass=${this.hass}
                    .value=${this._isEntityId(entity?.volume_entity) ? entity.volume_entity : (entity?.entity_id ?? "")}
                    .includeDomains=${["media_player","remote"]}
                    label="Volume Entity"
                    clearable
                    @value-changed=${(e) => {
                      const value = e.detail.value;
                      this._updateEntityProperty("volume_entity", value);

                      if (!value || value === entity.entity_id) {
                        // sync_power is meaningless in these cases
                        this._updateEntityProperty("sync_power", false);
                      }
                    }}
                  ></ha-entity-picker>
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
          <div class="form-row">
            <div class="help-text">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              When enabled, the volume entity will automatically follow the active playback entity. Note: This overrides the selected volume entity.
              <br><br>
             
            </div>
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
          <div class="action-editor-title">Edit Action</div>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="Name"
            placeholder="(Icon Only)"
            .value=${action?.name ?? ""}
            @input=${(e) => this._updateActionProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="Icon"
            .hass=${this.hass}
            .value=${action?.icon ?? ""}
            @value-changed=${(e) =>
              this._updateActionProperty("icon", e.detail.value)}
          ></ha-icon-picker>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="in-menu-toggle"
              .checked=${action?.in_menu ?? false}
              @change=${(e) =>
                this._updateActionProperty("in_menu", e.target.checked)}
            ></ha-switch>
            <label for="in-menu-toggle">In Menu</label>
          </div>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="Action Type"
            .selector=${{
              select: {
                mode: "dropdown",
                options: [
                  { value: "menu", label: "Open a Card Menu Item" },
                  { value: "service", label: "Call a Service" },
                  { value: "navigate", label: "Navigate" }
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
              }
            }}
          ></ha-selector>
        </div>
        
        ${actionMode === "menu" ? html`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="Menu Item"
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
              label="Navigation Path"
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
        ${actionMode === 'service' ? html`
          <div class="form-row">
            <ha-combo-box
              label="Service"
              .hass=${this.hass}
              .value=${action.service ?? ""}
              .items=${this._serviceItems ?? []}
              item-value-path="value"
              item-label-path="label"
              required
              @value-changed=${(e) => this._updateActionProperty("service", e.detail.value)}
            ></ha-combo-box>
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
                <span>Script Variable (yamp_entity)</span>
              </div>
            </div>
          ` : nothing}

          ${action.service ? html`
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>

              Use <code>entity_id: current</code> to target the card's currently selected
              media player entity. The <ha-icon icon="mdi:play-circle-outline"></ha-icon> button
              below does not work if you use this feature.

            </div>
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>
            Changes to the service data below are not committed to the config until 
            <ha-icon icon="mdi:content-save"></ha-icon> is clicked!
            </div>
            <div class="form-row">
              <div class="service-data-editor-header">
                <div class="service-data-editor-title">Service Data</div>
                <div class="service-data-editor-actions">
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled": ""}"
                    icon="mdi:content-save"
                    title="Save Service Data"
                    @click=${this._saveYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled": ""}"
                    icon="mdi:backup-restore"
                    title="Revert to Saved Service Data"
                    @click=${this._revertYamlEditor}
                  ></ha-icon>
                  <ha-icon

                    class="icon-button ${this._yamlError || this._yamlDraftUsesCurrentEntity() || !action?.service 
                      ? "icon-button-disabled": ""}"

                    icon="mdi:play-circle-outline"
                    title="Test Action"
                    @click=${this._testServiceCall}
                  ></ha-icon>              
                </div>
            </div>
            <div class=${this._yamlError && this._yamlDraft.trim() !== "" 
              ? "code-editor-wrapper error" 
              : "code-editor-wrapper"}>
              <ha-code-editor
                id="service-data-editor"
                label="Service Data"
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
    
      const yamlText = currentAction.service_data ? yaml.dump(currentAction.service_data): "";
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
  export { YetAnotherMediaPlayerEditor };
  
