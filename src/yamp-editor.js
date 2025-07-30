import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import { LitElement, html, css, nothing } from "lit";

import {SUPPORT_GROUPING} from "./constants.js";
  
class YetAnotherMediaPlayerEditor extends LitElement {
    static get properties() {
      return {
        hass: {},
        _config: {},
        _entityEditorIndex: { type: Number },
        _entityMoveMode: { type: Boolean },
      };
    }
  
    constructor() {
      super();
      this._entityEditorIndex = null;
      this._entityMoveMode = false;
    }
  
    _supportsFeature(stateObj, featureBit) {
      if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
      return (stateObj.attributes.supported_features & featureBit) !== 0;
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
    }c
  
    _updateEntityProperty(key, value) {
      const entities = [...(this._config.entities ?? [])];
      const idx = this._entityEditorIndex;
      if (entities[idx]) {
        entities[idx] = { ...entities[idx], [key]: value };
        this._updateConfig("entities", entities);
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
        /* visually isolate the list of entity controls */
        .entity-group {
          background: var(--card-background-color, #f7f7f7);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }
        /* wraps the entity selector and edit button */
        .entity-row-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        /* allow a selector to fill all available space when combined with other elements */
        .selector-grow {
          flex: 1;
          display: flex;
        }
        .selector-grow ha-selector, .selector-grow ha-entity-picker {
          width: 100%;
        } 
        .entity-editor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
        }
        .entity-editor-title {
          font-weight: 500;
          font-size: 1.1em;
          line-height: 1;
          margin-top: 7px; /* tweak to align with icon */
        }
        .full-width {
          width: 100%;
        }
        .entity-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0px 6px;
        }
        .entity-group-title {
          font-weight: 500;
        }
        .entity-group-actions {
          display: flex;
          align-items: center;
        }
        .entity-group-actions ha-icon, .entity-row-actions ha-icon {
          position: relative;
          top: -3px;
        } 
      `;
    }
  
    render() {
      if (!this._config) return html``;
    
      if (this._entityEditorIndex !== null) {
        const entity = this._config.entities?.[this._entityEditorIndex];
        return this._renderEntityEditor(entity);

      }
    
      return this._renderMainEditor();
    }
  
    _renderMainEditor() {
      if (!this._config) return html``;
  
      let entities = [...(this._config.entities ?? [])];
  
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
              <mwc-icon-button
                @mousedown=${(e) => e.preventDefault()}
                @click=${(e) => {
                  this._toggleEntityMoveMode();
                  e.currentTarget.blur();
                }}
                title=${this._entityMoveMode ? "Back to Edit Mode" : "Enable Move Mode"}
              >
                <ha-icon icon=${this._entityMoveMode ? "mdi:pencil" : "mdi:swap-vertical"}></ha-icon>
              </mwc-icon-button>
            </div>
          </div>
          ${entities.map((ent, idx) => html`
            <div class="entity-row-inner">
              <div class="selector-grow">
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
                  <mwc-icon-button
                    .disabled=${!ent.entity_id}
                    title="Edit Entity Settings"
                    @click=${() => this._onEditEntity(idx)}
                  >
                    <ha-icon icon="mdi:pencil"></ha-icon>
                  </mwc-icon-button>
                ` : html`
                  <mwc-icon-button
                    .disabled=${idx === 0 || idx === entities.length - 1}
                    @mousedown=${(e) => e.preventDefault()}
                    @click=${(e) => {
                      this._moveEntity(idx, -1);
                      e.currentTarget.blur();
                    }}
                    title="Move Up"
                  >
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    .disabled=${idx >= entities.length - 2}
                    @mousedown=${(e) => e.preventDefault()}
                    @click=${(e) => {
                      this._moveEntity(idx, 1);
                      e.currentTarget.blur();
                    }}
                    title="Move Down"
                  >
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </mwc-icon-button>
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

        <div class="form-row">
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
          <div class="form-row">
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
      `;
    }
  

    _renderEntityEditor(entity) {

      const stateObj = this.hass?.states?.[entity?.entity_id];
      const showGroupVolume = this._supportsFeature(stateObj, SUPPORT_GROUPING); 
  
      return html`
        <div class="entity-editor-header">
          <mwc-icon-button @click=${this._onBackFromEntityEditor} title="Back">
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </mwc-icon-button>
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
  
    _onEditEntity(index) {
      this._entityEditorIndex = index;
    }
  
    _onBackFromEntityEditor() {
      this._entityEditorIndex = null;
    }

    _toggleEntityMoveMode() {
      this._entityMoveMode = !this._entityMoveMode;
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

    _onToggleChanged(e) {
      const newConfig = {
        ...this._config,
        always_collapsed: e.target.checked,
      };
      this._config = newConfig;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
    }
  }

  customElements.define("yet-another-media-player-editor-beta", YetAnotherMediaPlayerEditor);
  export { YetAnotherMediaPlayerEditor };