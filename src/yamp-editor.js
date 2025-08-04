// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import { LitElement, html, css, nothing } from "lit";
// import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';
import yaml from 'js-yaml';

import {SUPPORT_GROUPING} from "./constants.js";
  
class YetAnotherMediaPlayerEditor extends LitElement {
    static get properties() {
      return {
        hass: {},
        _config: {},
        _entityEditorIndex: { type: Number },
        _actionEditorIndex: { type: Number },
        _entityMoveMode: { type: Boolean },
        _actionMoveMode: { type: Boolean },
        _actionMode: { type: String },
      };
    }
  
    constructor() {
      super();
      this._entityEditorIndex = null;
      this._actionEditorIndex = null;
      this._entityMoveMode = false;
      this._actionMoveMode = false;

      this._yamlDraft = "";
      this._parsedYaml = null;
      this._yamlError = false;
      this._serviceItems = [];
    }

    firstUpdated() {
      this._serviceItems = this._getServiceItems();
    }
  
    _supportsFeature(stateObj, featureBit) {
      if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
      return (stateObj.attributes.supported_features & featureBit) !== 0;
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

    setConfig(config) {
      const rawEntities = config.entities ?? [];
      const normalizedEntities = rawEntities.map((e) =>
        typeof e === "string" ? { entity_id: e } : e
      );
    
      this._config = {
        ...config,
        entities: normalizedEntities,
      };
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
  
    static get styles() {
      return css`
        .form-row {
          padding: 12px 16px;
          gap: 8px;
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
          padding-top: 3px;
        }
        .action-icon {
          align-self: flex-start;
          padding-top: 16px;
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
      `;
    }
  
    render() {
      if (!this._config) return html``;
    
      if (this._entityEditorIndex !== null) {
        const entity = this._config.entities?.[this._entityEditorIndex];
        return this._renderEntityEditor(entity);
      } else if (this._actionEditorIndex !== null) {
        const action = this._config.actions?.[this._actionEditorIndex];
        return this._renderActionEditor(action);
      }
    
      return this._renderMainEditor();
    }
  
    _renderMainEditor() {
      if (!this._config) return html``;
  
      let entities = [...(this._config.entities ?? [])];
      let actions = [...(this._config.actions ?? [])];
  
      // Append a blank row only for rendering (not saved)
      if (entities.length === 0 || entities[entities.length - 1].entity_id) {
        entities.push({ entity_id: "" });
      }
   
      return html`
        <div class="form-row entity-group">
          <div class="entity-group-header">
            <div class="entity-group-title">
              Entities*
            </div>
            <div class="entity-group-actions">
              <ha-icon
                class="icon-button"
                icon=${this._entityMoveMode ? "mdi:pencil" : "mdi:swap-vertical"}
                title=${this._entityMoveMode ? "Back to Edit Mode" : "Enable Move Mode"}
                @mousedown=${(e) => e.preventDefault()}
                @click=${() => this._toggleEntityMoveMode()}
              ></ha-icon>
            </div>
          </div>
          ${entities.map((ent, idx) => html`
            <div class="entity-row-inner">
              <div class="grow-children">
                ${ 
                /* ha-entity-picker will show "[Object object]" for entities with extra properties,
                   so we'll get around that by using ha-selector. However ha-selector always renders 
                   as a required field for some reason. This is confusing for the last entity picker, 
                   used to add a new entity, which is always blank and not required. So for the last
                   last entity only, we'll use ha-entity-picker. This entity will never have extra
                   properties, because as soon as it's populated, a new blank entity is added below it
                */
                idx === entities.length - 1 && !ent.entity_id
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
                    `
              }
              </div>
              <div class="entity-row-actions">
                ${!this._entityMoveMode ? html`
                <ha-icon
                  class="icon-button ${!ent.entity_id ? "icon-button-disabled" : ""}"
                  icon="mdi:pencil"
                  title="Edit Entity Settings"
                  @click=${() => this._onEditEntity(idx)}
                ></ha-icon>
                ` : html`
                  <ha-icon
                    class="icon-button ${idx === 0 || idx === entities.length - 1 ? "icon-button-disabled" : ""}"
                    icon="mdi:arrow-up"
                    title="Move Up"
                    @mousedown=${(e) => e.preventDefault()}
                    @click=${(e) => this._moveEntity(idx, -1)}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${idx >= entities.length - 2 ? "icon-button-disabled" : ""}"
                    icon="mdi:arrow-down"
                    title="Move Down"
                    @mousedown=${(e) => e.preventDefault()}
                    @click=${(e) => this._moveEntity(idx, 1)}
                  ></ha-icon>
                `}
              </div>
            </div>
          `)}
        </div>
  
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
              id="collapsed-on-idle-toggle"
              .checked=${this._config.collapsed_on_idle ?? false}
              @change=${(e) => this._updateConfig("collapsed_on_idle", e.target.checked)}
            ></ha-switch>
            <span>Collapse on Idle</span>
          </div>
          <div>
            <ha-switch
              id="always-collapsed-toggle"
              .checked=${this._config.always_collapsed ?? false}
              @change=${(e) => this._updateConfig("always_collapsed", e.target.checked)}
            ></ha-switch>
            <span>Always Collapsed</span>
          </div>
        </div>

        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
                number: {
                  min: 0,
                  step: 1000,
                  unit_of_measurement: "ms",
                  mode: "box"
                }
              }}
              .value=${this._config.idle_timeout_ms ?? 60000}
              label="Idle Timeout (ms)"
              @value-changed=${(e) => this._updateConfig("idle_timeout_ms", e.detail.value)}
            ></ha-selector>
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
              select: {
                mode: "dropdown",
                options: [
                  { value: "slider", label: "Slider" },
                  { value: "stepper", label: "Stepper" },
                ],
              },
            }}
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
                .selector=${{
                  number: {
                    min: 0.01,
                    max: 1,
                    step: 0.01,
                    unit_of_measurement: "",
                    mode: "box"
                  }
                }}
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
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              select: {
                mode: "dropdown",
                options: [
                  { value: "auto", label: "Auto" },
                  { value: "always", label: "Always" }                ],
              },
            }}
            .value=${this._config.show_chip_row ?? "auto"}
            label="Show Chip Row"
            @value-changed=${(e) => this._updateConfig("show_chip_row", e.detail.value)}
          ></ha-selector>
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
        </div>   
        <div class="form-row">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.idle_image ?? ""}
             .includeDomains=${["camera", "image"]}
            label="Idle Image Entity"
            clearable
            @value-changed=${(e) => this._updateConfig("idle_image", e.detail.value)}
          ></ha-entity-picker>
        </div>

         <div class="form-row action-group">
          <div class="action-group-header">
            <div class="action-group-title">
              Actions
            </div>
            <div class="action-group-actions">
              <ha-icon
                class="icon-button"
                icon=${this._actionMoveMode ? "mdi:pencil" : "mdi:swap-vertical"}
                title=${this._actionMoveMode ? "Back to Edit Mode" : "Enable Move Mode"}
                @mousedown=${(e) => e.preventDefault()}
                @click=${(e) => {
                  this._toggleActionMoveMode();
                  e.currentTarget.blur();
                }}
              ></ha-icon>
            </div>
          </div>
          ${actions.map((act, idx) => html`
            <div class="action-row-inner">
              ${act?.icon ? html`
                <ha-icon 
                class="action-icon"
                icon="${act?.icon}"></ha-icon>
              ` : html`
                <span class="action-icon-placeholder"></span>
              `
              }
              <div class="grow-children">
                <ha-textfield
                  placeholder="(Icon Only)"
                  .value=${act?.name ?? ""}
                  helper="${
                    act?.menu_item
                    ? `Open Menu Item: ${act?.menu_item}`
                    : act?.service 
                    ? `Call Service: ${act?.service}`
                    : `Not Configured`
                  }"
                  .helperPersistent=${true}
                  @input=${a => this._onActionChanged(idx, a.target.value)}
                ></ha-textfield>
              </div>
              <div class="action-row-actions">
               ${!this._actionMoveMode ? html`
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
              ` : html`
                <ha-icon
                  class="icon-button ${idx === 0 ? "icon-button-disabled" : ""}"
                  icon="mdi:arrow-up"
                  title="Move Up"
                  @mousedown=${(e) => e.preventDefault()}
                  @click=${(e) => {
                    this._moveAction(idx, -1);
                    e.currentTarget.blur();
                  }}
                ></ha-icon>
                <ha-icon
                  class="icon-button ${idx >= actions.length - 1 ? "icon-button-disabled" : ""}"
                  icon="mdi:arrow-down"
                  title="Move Down"
                  @mousedown=${(e) => e.preventDefault()}
                  @click=${(e) => {
                    this._moveAction(idx, 1);
                    e.currentTarget.blur();
                  }}
                ></ha-icon>
                `}
              </div>
            </div>
          `)}
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
      const showGroupVolume = this._supportsFeature(stateObj, SUPPORT_GROUPING); 
  
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

        <div class="form-row">

          <ha-entity-picker
            .hass=${this.hass}
            .value=${entity?.volume_entity ?? entity?.entity_id ?? ""}
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

        ${entity?.volume_entity && entity.volume_entity !== entity.entity_id

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
        </div>
      `;
    }

    _renderActionEditor(action) {

      const actionMode = this._actionMode ?? (action?.menu_item?.trim() ? "menu" : "service");

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

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="Action Type"
            .selector=${{
              select: {
                mode: "dropdown",
                options: [
                  { value: "menu", label: "Open a Card Menu Item" },
                  { value: "service", label: "Call a Service" }
                ]
              }
            }}
            .value=${this._actionMode ?? (action?.menu_item?.trim() ? "menu" : "service")}
            @value-changed=${(e) => {
              const mode = e.detail.value;
              this._actionMode = mode;
              if (mode === "service") {
                this._updateActionProperty("menu_item", undefined);
              } else if (mode === "menu") {
                this._updateActionProperty("service", undefined);
                this._updateActionProperty("service_data", undefined);
                this._updateActionProperty("script_variable", undefined);
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
                    { value: "source", label: "Source" },
                    { value: "more-info", label: "More Info" },
                    { value: "group-players", label: "Group Players" }
                  ]
                }
              }}
              .value=${action?.menu_item ?? ""}
              @value-changed=${(e) =>
                this._updateActionProperty("menu_item", e.detail.value || undefined)}
            ></ha-selector>
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
              Use <code>entity_id: current</code> to target the card's 
              currently selected media player entity.
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
                    class="icon-button ${this._yamlError || !action?.service ? "icon-button-disabled": ""}"
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
    }
  
    _onEditAction(index) {
      this._actionEditorIndex = index;
      const action = this._config.actions?.[index];
      this._actionMode = action?.menu_item ? "menu" : "service";
    }

    _onBackFromEntityEditor() {
      this._entityEditorIndex = null;
    }
  
    _onBackFromActionEditor() {
      this._actionEditorIndex = null;
    }

    _toggleEntityMoveMode() {
      this._entityMoveMode = !this._entityMoveMode;
    }

    _toggleActionMoveMode() {
      this._actionMoveMode = !this._actionMoveMode;
    }

    _moveEntity(idx, offset) {
      const entities = [...this._config.entities];
      const newIndex = idx + offset;
    
      if (newIndex < 0 || newIndex >= entities.length) {
        return;
      }
    
      const [moved] = entities.splice(idx, 1);
      entities.splice(newIndex, 0, moved);
    
      this._updateConfig("entities", entities);
    }
    
    _moveAction(idx, offset) {
      const actions = [...this._config.actions];
      const newIndex = idx + offset;
    
      if (newIndex < 0 || newIndex >= actions.length) {
        return;
      }
    
      const [moved] = actions.splice(idx, 1);
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

    async _testServiceCall() {
      if (this._yamlError || !this._yamlDraft?.trim()) {
        return;
      }
    
      let serviceData;
      try {
        serviceData = yaml.load(this._yamlDraft);
        if (typeof serviceData !== "object" || serviceData === null) {
          console.error("Service data must be a valid object.");
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
        console.error("Failed to call service:", err);
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
  }

  customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);
  export { YetAnotherMediaPlayerEditor };
  