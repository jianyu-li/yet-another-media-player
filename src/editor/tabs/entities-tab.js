import { html, nothing } from "lit";
import { localize } from "../../localize/localize.js";
import { isMusicAssistantEntity } from "../../yamp-utils.js";
import { VOLUME_MODE_SELECTOR, VOLUME_STEP_SELECTOR } from "../constants.js";

/**
 * Render the Entities tab in the YAMP card editor.
 * @this {import("../../types.d.ts").YetAnotherMediaPlayerEditor}
 */
export function renderEntitiesTab() {
  if (!this._config) return html``;
  const getEntId = (e) => (typeof e === "string" ? e : e?.entity || e?.entity_id || "");
  let entities = [...(this._config.entities ?? [])];
  if (entities.length === 0 || getEntId(entities[entities.length - 1])) {
    entities.push({ entity: "" });
  }
  return html`
    <div class="entity-group">
      <div class="entity-group-header section-header">
        <div class="entity-group-title section-title">
          ${localize("editor.sections.entities.title")}
        </div>
        <div class="section-description">${localize("editor.sections.entities.description")}</div>
      </div>
      <div class="form-row">
        <yamp-sortable @item-moved=${(e) => this._onEntityMoved(e)}>
          <div class="sortable-container">
            ${entities.map(
              (ent, idx) => html`
                <div
                  class="entity-row-inner ${idx < entities.length - 1 ? "sortable-item" : ""}"
                  data-index="${idx}"
                >
                  <div class="handle ${idx === entities.length - 1 ? "handle-disabled" : ""}">
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </div>
                  <div class="grow-children">
                    <ha-generic-picker
                      class="full-width"
                      style="display: block; width: 100%;"
                      .hass=${this.hass}
                      .value=${getEntId(ent)}
                      .label=${localize("common.media_player")}
                      .valueRenderer=${(v) => this._entityValueRenderer(v)}
                      .rowRenderer=${(item) => this._entityRowRenderer(item)}
                      .getItems=${this._getEntityItems(
                        ["media_player"],
                        idx === entities.length - 1 && !getEntId(ent)
                          ? (this._config.entities?.map(getEntId) ?? [])
                          : []
                      )}
                      @value-changed=${(e) => this._onEntityChanged(idx, e.detail.value)}
                      allow-custom-value
                    ></ha-generic-picker>
                  </div>
                  <div class="entity-row-actions">
                    <ha-icon
                      class="icon-button ${!getEntId(ent) ? "icon-button-disabled" : ""}"
                      icon="mdi:pencil"
                      title="${localize("common.edit_entity")}"
                      @click=${() => this._onEditEntity(idx)}
                    ></ha-icon>
                  </div>
                </div>
              `
            )}
          </div>
        </yamp-sortable>
      </div>
    </div>
  `;
}

/**
 * Render the single Entity sub-editor.
 * @this {import("../../types.d.ts").YetAnotherMediaPlayerEditor}
 * @param {any} entity
 * @param {number} idx
 * @param {boolean} isSearch
 */
export function renderEntityEditor(entity, idx = this._entityEditorIndex, isSearch = false) {
  if (typeof entity === "string") {
    entity = { entity_id: entity };
  }
  const canSyncPower =
    entity?.volume_entity &&
    entity.volume_entity !== entity.entity_id &&
    !(entity?.follow_active_volume ?? false);

  return html`
        ${
          isSearch
            ? html`
                <div
                  class="entity-group-header section-header"
                  style="padding-top: 16px; border-top: 1px solid var(--divider-color);"
                >
                  <div
                    class="entity-group-title section-title"
                    style="color: var(--custom-accent, var(--accent-color, #ff9800));"
                  >
                    ${entity?.name || this._entityValueRenderer(entity?.entity_id) || "Entity"}
                    (${entity?.entity_id || "No ID"})
                  </div>
                </div>
              `
            : html`
                <div class="entity-editor-header">
                  <ha-icon
                    class="icon-button"
                    icon="mdi:chevron-left"
                    title="${localize("common.back")}"
                    @click=${this._onBackFromEntityEditor}
                  >
                  </ha-icon>
                  <div class="entity-editor-title">${localize("editor.titles.edit_entity")}</div>
                </div>
              `
        }

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ entity: { domain: "media_player" } }}
            .value=${entity?.entity_id ?? ""}
          
            disabled
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            class="full-width"
            .selector=${{ text: {} }}
            label="${localize("editor.fields.name")}"
            .value=${entity?.name ?? ""}
            @value-changed=${(e) => this._updateEntityProperty("name", e.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row" data-search-keys="hidden_controls previous play_pause stop next shuffle repeat favorite power">
          <div class="editor-field-wrapper">
            ${
              this._isTemplateMode("hidden_controls", entity?.hidden_controls)
                ? html`
                    <div class="grow-children">
                      <div
                        class=${
                          this._yamlError &&
                          typeof entity?.hidden_controls === "string" &&
                          entity.hidden_controls.trim() !== ""
                            ? "code-editor-wrapper error"
                            : "code-editor-wrapper"
                        }
                        style="width: 100%;"
                      >
                        <span class="form-label">${localize("editor.fields.hidden_controls")}</span>
                        <ha-code-editor
                          lint
                          id="hidden-controls-template-editor"
                          label="${localize("editor.fields.hidden_controls")}"
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          .value=${typeof entity?.hidden_controls === "string" ? entity.hidden_controls : ""}
                          @value-changed=${(e) => this._updateEntityProperty("hidden_controls", e.detail.value)}
                        ></ha-code-editor>
                        <div class="help-text">${localize("editor.subtitles.hide_controls")}</div>
                      </div>
                    </div>
                  `
                : html`
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
                            { value: "power", label: "Power" },
                          ],
                        },
                      }}
                      .value=${(() => {
                        let val = entity?.hidden_controls;
                        if (typeof val === "string") {
                          try {
                            val = JSON.parse(val.replace(/'/g, '"'));
                          } catch (e) {
                            val = val
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s !== "");
                          }
                        }
                        return Array.isArray(val) ? val : [];
                      })()}
                      label="${localize("editor.fields.hidden_controls")}"
                      helper="${localize("editor.subtitles.hide_controls")}"
                      @value-changed=${(e) => this._updateEntityProperty("hidden_controls", e.detail.value)}
                    ></ha-selector>
                  `
            }
            ${this._renderTemplateToggle("hidden_controls", entity?.hidden_controls, (v) => this._updateEntityProperty("hidden_controls", v))}
          </div>
        </div>

        <div class="form-row" data-search-keys="hide_remote_buttons back menu home power">
          <div class="editor-field-wrapper">
            ${
              this._isTemplateMode("hide_remote_buttons", entity?.hide_remote_buttons)
                ? html`
                    <div class="grow-children">
                      <div
                        class=${
                          this._yamlError &&
                          typeof entity?.hide_remote_buttons === "string" &&
                          entity.hide_remote_buttons.trim() !== ""
                            ? "code-editor-wrapper error"
                            : "code-editor-wrapper"
                        }
                        style="width: 100%;"
                      >
                        <span class="form-label"
                          >${localize("editor.fields.hide_remote_buttons")}</span
                        >
                        <ha-code-editor
                          lint
                          id="hidden-remote-buttons-template-editor"
                          label="${localize("editor.fields.hide_remote_buttons")}"
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          .value=${typeof entity?.hide_remote_buttons === "string" ? entity.hide_remote_buttons : ""}
                          @value-changed=${(e) => this._updateEntityProperty("hide_remote_buttons", e.detail.value)}
                        ></ha-code-editor>
                        <div class="help-text">
                          ${localize("editor.subtitles.hide_remote_buttons")}
                        </div>
                      </div>
                    </div>
                  `
                : html`
                    <ha-selector
                      .hass=${this.hass}
                      .selector=${{
                        select: {
                          mode: "dropdown",
                          multiple: true,
                          options: [
                            { value: "back", label: "Back" },
                            { value: "menu", label: "Menu" },
                            { value: "home", label: "Home" },
                            { value: "power", label: "Power" },
                          ],
                        },
                      }}
                      .value=${(() => {
                        let val = entity?.hide_remote_buttons;
                        if (typeof val === "string") {
                          try {
                            val = JSON.parse(val.replace(/'/g, '"'));
                          } catch (e) {
                            val = val
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s !== "");
                          }
                        }
                        return Array.isArray(val) ? val : [];
                      })()}
                      label="${localize("editor.fields.hide_remote_buttons")}"
                      helper="${localize("editor.subtitles.hide_remote_buttons")}"
                      @value-changed=${(e) => this._updateEntityProperty("hide_remote_buttons", e.detail.value)}
                    ></ha-selector>
                  `
            }
            ${this._renderTemplateToggle("hide_remote_buttons", entity?.hide_remote_buttons, (v) => this._updateEntityProperty("hide_remote_buttons", v))}
          </div>
        </div>

        ${(() => {
          const standardOptions = [
            { value: "more_info", label: localize("card.menu.more_info") || "More Info" },
            { value: "search", label: localize("common.search") || "Search" },
            { value: "source", label: localize("card.menu.source") || "Source" },
            {
              value: "group_players",
              label:
                localize("card.menu.speakers_and_groups") ||
                localize("card.menu.group_players") ||
                "Speakers & Groups",
            },
            {
              value: "remote_controls",
              label: localize("card.menu.remote_controls") || "Remote Control",
            },
            { value: "lyrics", label: localize("card.sections.lyrics") || "Lyrics" },
            {
              value: "full_screen",
              label: localize("card.menu.full_screen") || "Full Screen",
            },
          ];

          const configuredActions = [
            ...(this._config?.actions || []),
            ...(entity?.custom_actions || []),
          ];

          const customActionOptions = configuredActions
            .filter(
              (a) =>
                a && (a.placement === "menu" || a.in_menu === true || a.id || a.name || a.label)
            )
            .map((a) => {
              const val = a.id || a.name || a.label || a.service || "custom_action";
              const label = a.name || a.label || a.id || a.service || "Custom Action";
              return {
                value: val,
                label: `${label} (${localize("editor.fields.menu_item") || "Menu Item"})`,
              };
            });

          const existingValues = (() => {
            let val = entity?.hidden_menu_options ?? entity?.hide_menu_options;
            if (typeof val === "string") {
              try {
                val = JSON.parse(val.replace(/'/g, '"'));
              } catch (e) {
                val = val
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s !== "");
              }
            }
            return Array.isArray(val) ? val : [];
          })();

          const knownValues = new Set([
            ...standardOptions.map((o) => o.value),
            ...customActionOptions.map((o) => o.value),
          ]);
          const extraOptions = existingValues
            .filter((v) => !knownValues.has(v))
            .map((v) => ({ value: v, label: v }));

          const allMenuOptions = [
            ...standardOptions,
            ...customActionOptions.filter(
              (ca, i, self) => self.findIndex((o) => o.value === ca.value) === i
            ),
            ...extraOptions,
          ];

          return html`
            <div
              class="form-row"
              data-search-keys="hidden_menu_options hide_menu_options more_info search source transfer_queue group_players remote_controls lyrics full_screen menu options"
            >
              <ha-selector
                .hass=${this.hass}
                .selector=${{
                  select: {
                    mode: "dropdown",
                    multiple: true,
                    custom_value: true,
                    options: allMenuOptions,
                  },
                }}
                .value=${existingValues}
                label="${localize("editor.fields.hidden_menu_options")}"
                helper="${localize("editor.subtitles.hide_menu_options")}"
                @value-changed=${(e) =>
                  this._updateEntityProperty("hidden_menu_options", e.detail.value)}
              ></ha-selector>
            </div>
          `;
        })()}

 

        <div class="form-row">
          <div class="editor-field-wrapper">
            ${
              this._isTemplateMode("music_assistant_entity", entity?.music_assistant_entity)
                ? html`
                  <div class="grow-children">
                    <div class=${
                      this._yamlError && (entity?.music_assistant_entity ?? "").trim() !== ""
                        ? "code-editor-wrapper error"
                        : "code-editor-wrapper"
                    } style="width: 100%;">
                      <span class="form-label">${localize("editor.fields.ma_template")}</span>
                      <ha-code-editor lint
                        id="ma-template-editor"
                        label="${localize("editor.fields.ma_template")}"
                        .hass=${this.hass}
                        mode="jinja2"
                        autocomplete-entities
                        .value=${entity?.music_assistant_entity ?? ""}
                        @value-changed=${(e) => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
                      ></ha-code-editor>
                      <div class="help-text">
                        <ha-icon icon="mdi:information-outline"></ha-icon>
                        ${localize("editor.subtitles.jinja_template_hint")}
                        <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_select.kitchen_stream_source','Music Stream 1') %}
  media_player.picore_house
{% else %}
  media_player.ma_wiim_mini
{% endif %}</pre>
                       </pre>
                      </div>
                    </div>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle("music_assistant_entity", entity?.music_assistant_entity, (v) => this._updateEntityProperty("music_assistant_entity", v))}
                  </div>
                `
                : html`
                    <div class="grow-children">
                      <ha-generic-picker
                        .hass=${this.hass}
                        .value=${
                          this._isEntityId(entity?.music_assistant_entity)
                            ? entity.music_assistant_entity
                            : ""
                        }
                        .label=${localize("editor.fields.ma_entity")}
                        .valueRenderer=${(v) => this._entityValueRenderer(v)}
                        .rowRenderer=${(item) => this._entityRowRenderer(item)}
                        .getItems=${this._getEntityItems(["media_player"])}
                        @value-changed=${(e) =>
                          this._updateEntityProperty("music_assistant_entity", e.detail.value)}
                        allow-custom-value
                      ></ha-generic-picker>
                    </div>
                    <div class="field-actions">
                      ${this._renderTemplateToggle(
                        "music_assistant_entity",
                        entity?.music_assistant_entity,
                        (v) => this._updateEntityProperty("music_assistant_entity", v)
                      )}
                    </div>
                  `
            }
          </div>
        </div>
        ${(() => {
          if (this._isTemplateMode("music_assistant_entity", entity?.music_assistant_entity)) {
            return nothing;
          }
          const mainId = entity?.entity_id;
          const mainState = mainId ? this.hass?.states?.[mainId] : undefined;
          const mainIsMA = mainState ? isMusicAssistantEntity(mainState) : false;
          const rawMa = entity?.music_assistant_entity;
          const isTemplate = this._looksLikeTemplate?.(rawMa);
          const maId = typeof rawMa === "string" && !isTemplate ? rawMa : undefined;
          const maState = maId ? this.hass?.states?.[maId] : undefined;
          const maIsMA = maState ? isMusicAssistantEntity(maState) : false;
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
                      { value: "episode", label: "Episode" },
                      { value: "shows", label: "Shows" },
                    ],
                  },
                }}
                .value=${
                  Array.isArray(entity?.hidden_filter_chips) ? entity.hidden_filter_chips : []
                }
                label="${localize("editor.fields.hidden_chips")}"
                helper="${localize("editor.subtitles.hide_search_chips")}"
                @value-changed=${(e) =>
                  this._updateEntityProperty("hidden_filter_chips", e.detail.value)}
              ></ha-selector>
            </div>
          `;
        })()}

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="prefer-ma-metadata-toggle"
              .checked=${entity?.prefer_ma_metadata ?? false}
              .disabled=${!entity?.music_assistant_entity || entity.music_assistant_entity.trim() === ""}
              @change=${(e) => this._updateEntityProperty("prefer_ma_metadata", e.target.checked)}
            ></ha-switch>
            <label for="prefer-ma-metadata-toggle">${localize("editor.labels.prefer_ma_metadata")}</label>
          </div>
          <div class="config-subtitle">${localize("editor.subtitles.prefer_ma_metadata")}</div>
        </div>

        <div class="form-row">
          <ha-switch
            id="disable-auto-select-toggle"
            .checked=${entity?.disable_auto_select ?? false}
            @change=${(e) => this._updateEntityProperty("disable_auto_select", e.target.checked)}
          ></ha-switch>
          <label for="disable-auto-select-toggle">${localize("editor.labels.disable_auto_select")}</label>
          <div class="config-subtitle">${localize("editor.subtitles.disable_auto_select")}</div>
        </div>

        <div class="form-row">
          <ha-switch
            id="group-volume-toggle"
            .checked=${entity?.group_volume ?? true}
            .disabled=${!entity?.music_assistant_entity}
            @change=${(e) => this._updateEntityProperty("group_volume", e.target.checked)}
          ></ha-switch>
          <label for="group-volume-toggle">Group Volume</label>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="follow-active-toggle"
              .checked=${entity?.follow_active_volume ?? false}
              @change=${(e) => this._updateEntityProperty("follow_active_volume", e.target.checked)}
            ></ha-switch>
            <label for="follow-active-toggle">${localize("editor.labels.follow_active_entity")}</label>
          </div>
        </div>

        ${
          !(entity?.follow_active_volume ?? false)
            ? html`
                <div class="form-row">
                  <div class="editor-field-wrapper">
                    ${
                      this._isTemplateMode("volume_entity", entity?.volume_entity)
                        ? html`
                            <div class="grow-children">
                              <div
                                class=${
                                  this._yamlError && (entity?.volume_entity ?? "").trim() !== ""
                                    ? "code-editor-wrapper error"
                                    : "code-editor-wrapper"
                                }
                                style="width: 100%;"
                              >
                                <span class="form-label"
                                  >${localize("editor.fields.vol_template")}</span
                                >
                                <ha-code-editor
                                  lint
                                  id="vol-template-editor"
                                  label="${localize("editor.fields.vol_template")}"
                                  .hass=${this.hass}
                                  mode="jinja2"
                                  autocomplete-entities
                                  .value=${entity?.volume_entity ?? ""}
                                  @value-changed=${(e) =>
                                    this._updateEntityProperty("volume_entity", e.detail.value)}
                                ></ha-code-editor>
                                <div class="help-text">
                                  <ha-icon icon="mdi:information-outline"></ha-icon>
                                  ${localize("editor.subtitles.jinja_template_vol_hint")}
                                  <pre style="margin:6px 0; white-space:pre-wrap;">
{% if is_state('input_boolean.tv_volume','on') %}
  remote.soundbar
{% else %}
  media_player.office_homepod
{% endif %}</pre>
                                </div>
                              </div>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle(
                                "volume_entity",
                                entity?.volume_entity,
                                (v) => {
                                  const updates = { volume_entity: v };
                                  if (!v) {
                                    updates.sync_power = false;
                                  }
                                  this._updateEntityProperties(updates);
                                }
                              )}
                            </div>
                          `
                        : html`
                            <div class="grow-children">
                              <ha-generic-picker
                                .hass=${this.hass}
                                .value=${
                                  this._isEntityId(entity?.volume_entity)
                                    ? entity.volume_entity
                                    : (entity?.entity_id ?? "")
                                }
                                .label=${localize("editor.fields.vol_entity")}
                                .valueRenderer=${(v) => this._entityValueRenderer(v)}
                                .rowRenderer=${(item) => this._entityRowRenderer(item)}
                                .getItems=${this._getEntityItems(["media_player", "remote"])}
                                @value-changed=${(e) => {
                                  const value = e.detail.value;
                                  const updates = { volume_entity: value };

                                  if (!value || value === entity.entity_id) {
                                    // sync_power is meaningless in these cases
                                    updates.sync_power = false;
                                  }
                                  this._updateEntityProperties(updates);
                                }}
                                allow-custom-value
                              ></ha-generic-picker>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle(
                                "volume_entity",
                                entity?.volume_entity,
                                (v) => {
                                  const updates = { volume_entity: v };
                                  if (!v) {
                                    updates.sync_power = false;
                                  }
                                  this._updateEntityProperties(updates);
                                }
                              )}
                            </div>
                          `
                    }
                  </div>
                </div>
              `
            : nothing
        }

        ${
          entity
            ? html`
                <div class="form-row" data-search-keys="remote_entity">
                  <div class="editor-field-wrapper">
                    ${
                      this._isTemplateMode("remote_entity", entity?.remote_entity)
                        ? html`
                            <div class="grow-children">
                              <div
                                class=${
                                  this._yamlError && (entity?.remote_entity ?? "").trim() !== ""
                                    ? "code-editor-wrapper error"
                                    : "code-editor-wrapper"
                                }
                                style="width: 100%;"
                              >
                                <span class="form-label"
                                  >${localize("editor.fields.remote_template")}</span
                                >
                                <ha-code-editor
                                  lint
                                  id="remote-template-editor"
                                  label="${localize("editor.fields.remote_template")}"
                                  .hass=${this.hass}
                                  mode="jinja2"
                                  autocomplete-entities
                                  .value=${typeof entity?.remote_entity === "string" ? entity.remote_entity : ""}
                                  @value-changed=${(e) =>
                                    this._updateEntityProperty("remote_entity", e.detail.value)}
                                ></ha-code-editor>
                                <div class="help-text">
                                  <ha-icon icon="mdi:information-outline"></ha-icon>
                                  ${localize("editor.subtitles.jinja_template_remote_hint")}
                                  <pre style="margin:6px 0; white-space:pre-wrap;">
{% if is_state('input_boolean.living_room_tv','on') %}
  remote.living_room_tv
{% else %}
  remote.bedroom_tv
{% endif %}</pre>
                                </div>
                              </div>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle(
                                "remote_entity",
                                entity?.remote_entity,
                                (v) => this._updateEntityProperty("remote_entity", v)
                              )}
                            </div>
                          `
                        : html`
                            <div class="grow-children">
                              <ha-generic-picker
                                .hass=${this.hass}
                                .value=${
                                  this._isEntityId(entity?.remote_entity)
                                    ? entity.remote_entity
                                    : ""
                                }
                                .label=${localize("editor.fields.remote_entity")}
                                .valueRenderer=${(v) => this._entityValueRenderer(v)}
                                .rowRenderer=${(item) => this._entityRowRenderer(item)}
                                .getItems=${this._getEntityItems(["remote"])}
                                @value-changed=${(e) =>
                                  this._updateEntityProperty(
                                    "remote_entity",
                                    e.detail.value || undefined
                                  )}
                                allow-custom-value
                              ></ha-generic-picker>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle(
                                "remote_entity",
                                entity?.remote_entity,
                                (v) => this._updateEntityProperty("remote_entity", v)
                              )}
                            </div>
                          `
                    }
                  </div>
                </div>
              `
            : nothing
        }

        ${html`
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="sync-power-toggle"
                .checked=${entity?.sync_power ?? false}
                .disabled=${!canSyncPower}
                @change=${(e) => this._updateEntityProperty("sync_power", e.target.checked)}
              ></ha-switch>
              <label for="sync-power-toggle">Sync Power</label>
            </div>
          </div>
        `}
        ${html`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${VOLUME_MODE_SELECTOR}
                .value=${entity?.entity_volume_mode ?? this._config.volume_mode ?? "slider"}
                label="${localize("editor.fields.volume_mode")}"
                @value-changed=${(e) => {
                  const val = e.detail.value;
                  const updates = { entity_volume_mode: val || undefined };
                  if (val !== "stepper") {
                    updates.entity_volume_step = undefined;
                  }
                  this._updateEntityProperties(updates);
                }}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button ${!entity?.entity_volume_mode ? "icon-button-disabled" : ""}"
              icon="mdi:restore"
              title="${localize("common.reset_default")}"
              @click=${() => {
                this._updateEntityProperties({
                  entity_volume_mode: undefined,
                  entity_volume_step: undefined,
                });
              }}
            ></ha-icon>
          </div>
          ${html`
            <div class="form-row form-row-multi-column">
              <div class="grow-children">
                <ha-selector
                  .hass=${this.hass}
                  .selector=${VOLUME_STEP_SELECTOR}
                  .value=${entity?.entity_volume_step ?? this._config.volume_step ?? 0.05}
                  .disabled=${(entity?.entity_volume_mode ?? this._config.volume_mode ?? "slider") !== "stepper"}
                  label="${localize("editor.fields.vol_step")}"
                  @value-changed=${(e) => this._updateEntityProperty("entity_volume_step", e.detail.value)}
                ></ha-selector>
              </div>
              <ha-icon
                class="icon-button ${entity?.entity_volume_step === undefined ? "icon-button-disabled" : ""}"
                icon="mdi:restore"
                title="${localize("common.reset_default")}"
                @click=${() => this._updateEntityProperty("entity_volume_step", undefined)}
              ></ha-icon>
            </div>
          `}
        `}

        ${
          entity?.follow_active_volume
            ? html`
                <div class="help-text">
                  <ha-icon icon="mdi:information-outline"></ha-icon>
                  ${localize("editor.subtitles.follow_active_entity")}
                  <br /><br />
                </div>
              `
            : nothing
        }
        </div>
      `;
}
