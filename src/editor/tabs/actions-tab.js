import { html, nothing } from "lit";
import * as yaml from "js-yaml";
import { localize } from "../../localize/localize.js";
import { getActionPlacement } from "../../yamp-utils.js";

/**
 * Render the Actions tab in the YAMP card editor.
 * @this {import("../../types.d.ts").YetAnotherMediaPlayerEditor}
 */
export function renderActionsTab() {
  let actions = [...(this._config.actions ?? [])];
  return html`
    <div class="action-group config-section">
      <div class="action-group-header section-header">
        <div class="action-group-title section-title">
          ${localize("editor.sections.actions.title")}
        </div>
        <div class="section-description">${localize("editor.sections.actions.description")}</div>
      </div>
      <div class="form-row">
        <yamp-sortable @item-moved=${(e) => this._onActionMoved(e)}>
          <div class="sortable-container">
            ${actions.map(
              (act, idx) => html`
                <div class="action-row-inner sortable-item">
                  <div class="handle action-handle">
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </div>
                  ${
                    act?.icon
                      ? html`
                          <ha-icon
                            class="action-icon"
                            icon="${act?.icon}"
                            title="Action Icon"
                          ></ha-icon>
                        `
                      : html`<span class="action-icon-placeholder"></span>`
                  }
                  <div class="grow-children">
                    <ha-selector
                      .hass=${this.hass}
                      .selector=${{ text: {} }}
                      label="(Icon Only)"
                      .value=${act?.name ?? ""}
                      .helper=${this._getActionHelperText(act)}
                      @value-changed=${(a) => this._onActionChanged(idx, a.detail.value)}
                    ></ha-selector>
                  </div>
                  <div class="action-row-actions">
                    <ha-icon
                      class="icon-button icon-button-compact"
                      icon="mdi:pencil"
                      title="${localize("common.edit_action")}"
                      @click=${() => this._onEditAction(idx)}
                    ></ha-icon>
                    ${
                      act?.action !== "sync_selected_entity" && act?.action !== "select_entity"
                        ? html`
                            <ha-icon
                              class="icon-button icon-button-compact icon-button-toggle ${(() => {
                                const p =
                                  act?.placement !== undefined ? act.placement : act?.in_menu;
                                if (p === "hidden") return "icon-button-disabled";
                                if (p === "menu" || p === true) return "active";
                                if (
                                  p === "replace_search" ||
                                  p === "replace_power" ||
                                  p === "replace_mute" ||
                                  p === "replace_favorite"
                                )
                                  return "active";
                                return "";
                              })()}"
                              icon="${(() => {
                                const p =
                                  act?.placement !== undefined ? act.placement : act?.in_menu;
                                if (p === "menu" || p === true) return "mdi:menu";
                                if (p === "hidden")
                                  return act?.card_trigger && act.card_trigger !== "none"
                                    ? "mdi:image-outline"
                                    : "mdi:eye-off-outline";
                                if (
                                  p === "replace_search" ||
                                  p === "replace_power" ||
                                  p === "replace_mute" ||
                                  p === "replace_favorite"
                                )
                                  return "mdi:dock-bottom";
                                return "mdi:view-grid-outline";
                              })()}"
                              title="${(() => {
                                const p =
                                  act?.placement !== undefined ? act.placement : act?.in_menu;
                                if (p === "hidden")
                                  return act?.card_trigger && act.card_trigger !== "none"
                                    ? localize("editor.placements.hidden")
                                    : `${localize("editor.placements.hidden")} (${localize("editor.placements.not_triggerable")})`;
                                if (
                                  p === "replace_search" ||
                                  p === "replace_power" ||
                                  p === "replace_mute" ||
                                  p === "replace_favorite"
                                )
                                  return localize(`editor.placements.${p}`);
                                return p === "menu" || p === true
                                  ? localize("editor.fields.move_to_main")
                                  : localize("editor.fields.move_to_menu");
                              })()}"
                              role="button"
                              aria-label="${(() => {
                                const p =
                                  act?.placement !== undefined ? act.placement : act?.in_menu;
                                if (
                                  p === "replace_search" ||
                                  p === "replace_power" ||
                                  p === "replace_mute" ||
                                  p === "replace_favorite"
                                )
                                  return localize(`editor.placements.${p}`);
                                return p === "menu" || p === true
                                  ? localize("editor.fields.move_to_main")
                                  : localize("editor.fields.move_to_menu");
                              })()}"
                              @click=${() => {
                                const p =
                                  act?.placement !== undefined ? act.placement : act?.in_menu;
                                if (
                                  p !== "hidden" &&
                                  p !== "replace_search" &&
                                  p !== "replace_power" &&
                                  p !== "replace_mute" &&
                                  p !== "replace_favorite"
                                ) {
                                  this._toggleActionInMenu(idx);
                                }
                              }}
                            ></ha-icon>
                          `
                        : html`
                            <ha-icon
                              class="icon-button icon-button-compact icon-button-disabled"
                              icon="mdi:eye-off-outline"
                              title="${localize(`editor.action_types.${act?.action}`)}"
                            ></ha-icon>
                          `
                    }
                    <ha-icon
                      class="icon-button icon-button-compact"
                      icon="mdi:trash-can"
                      title="${localize("editor.fields.delete_action")}"
                      @click=${() => this._removeAction(idx)}
                    ></ha-icon>
                  </div>
                </div>
              `
            )}
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

/**
 * Render the single Action sub-editor.
 * @this {import("../../types.d.ts").YetAnotherMediaPlayerEditor}
 * @param {any} action
 * @param {number} idx
 * @param {boolean} isSearch
 */
export function renderActionEditor(action, idx = this._actionEditorIndex, isSearch = false) {
  const actionMode = this._actionMode ?? this._deriveActionMode(action);
  const effectivePlacement = getActionPlacement(action, idx);
  return html`
        ${
          isSearch
            ? html`
                <div
                  class="action-group-header section-header"
                  style="padding-top: 16px; border-top: 1px solid var(--divider-color);"
                >
                  <div
                    class="action-group-title section-title"
                    style="color: var(--custom-accent, var(--accent-color, #ff9800));"
                  >
                    Action: ${action?.name || `Action #${idx + 1}`}
                  </div>
                </div>
              `
            : html`
                <div class="action-editor-header">
                  <ha-icon
                    class="icon-button"
                    icon="mdi:chevron-left"
                    @click=${this._onBackFromActionEditor}
                  >
                  </ha-icon>
                  <div class="action-editor-title">${localize("editor.titles.edit_action")}</div>
                </div>
              `
        }

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            class="full-width"
            .selector=${{ text: {} }}
            label="${localize("editor.fields.name")} (Icon Only)"
            .value=${action?.name ?? ""}
            @value-changed=${(e) => this._updateActionProperty("name", e.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="${localize("editor.fields.icon")}"
            .hass=${this.hass}
            .value=${action?.icon ?? ""}
            @value-changed=${(e) => this._updateActionProperty("icon", e.detail.value)}
          ></ha-icon-picker>
        </div>
 
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <div class="editor-field-wrapper">
              ${
                this._isTemplateMode("placement", effectivePlacement)
                  ? html`
                      <div class="grow-children" style="flex-direction: column;">
                        <span class="form-label">${localize("editor.fields.placement")}</span>
                        <ha-code-editor
                          lint
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          label="${localize("editor.fields.placement")}"
                          .value=${
                            typeof action?.placement === "string"
                              ? action.placement
                              : typeof action?.in_menu === "string"
                                ? action.in_menu
                                : typeof effectivePlacement === "string"
                                  ? effectivePlacement
                                  : ""
                          }
                          @value-changed=${(e) =>
                            this._updateActionProperty("placement", e.detail.value)}
                        ></ha-code-editor>
                      </div>
                      <div class="field-actions">
                        ${this._renderTemplateToggle(
                          "placement",
                          effectivePlacement,
                          (v) => {
                            const updates = { placement: v };
                            if (v !== "hidden") {
                              updates.card_trigger = "none";
                            }
                            this._updateActionProperties(updates);
                          },
                          actionMode === "sync_selected_entity" || actionMode === "select_entity"
                        )}
                      </div>
                    `
                  : html`
                      <div class="grow-children">
                        <ha-selector
                          .hass=${this.hass}
                          label="${localize("editor.fields.placement")}"
                          .disabled=${
                            actionMode === "sync_selected_entity" || actionMode === "select_entity"
                          }
                          .selector=${{
                            select: {
                              mode: "dropdown",
                              options: [
                                { value: "chip", label: localize("editor.placements.chip") },
                                { value: "menu", label: localize("editor.placements.menu") },
                                { value: "hidden", label: localize("editor.placements.hidden") },
                                {
                                  value: "replace_search",
                                  label: localize("editor.placements.replace_search"),
                                },
                                {
                                  value: "replace_power",
                                  label: localize("editor.placements.replace_power"),
                                },
                                {
                                  value: "replace_mute",
                                  label: localize("editor.placements.replace_mute"),
                                },
                                {
                                  value: "replace_favorite",
                                  label: localize("editor.placements.replace_favorite"),
                                },
                              ],
                            },
                          }}
                          .value=${effectivePlacement}
                          @value-changed=${(e) => {
                            const val = e.detail.value;
                            const updates = { placement: val };
                            if (val !== "hidden") {
                              updates.card_trigger = "none";
                            }
                            this._updateActionProperties(updates);
                          }}
                        ></ha-selector>
                      </div>
                      <div class="field-actions">
                        ${this._renderTemplateToggle(
                          "placement",
                          effectivePlacement,
                          (v) => {
                            const updates = { placement: v };
                            if (v !== "hidden") {
                              updates.card_trigger = "none";
                            }
                            this._updateActionProperties(updates);
                          },
                          actionMode === "sync_selected_entity" || actionMode === "select_entity"
                        )}
                      </div>
                    `
              }
            </div>
          </div>
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${localize("editor.fields.card_trigger")}"
              .disabled=${actionMode === "sync_selected_entity" || actionMode === "select_entity" || (!this._isTemplateValue(effectivePlacement) && effectivePlacement !== "hidden")}
              .selector=${{
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "none", label: localize("editor.triggers.none") },
                    { value: "tap", label: localize("editor.triggers.tap") },
                    { value: "hold", label: localize("editor.triggers.hold") },
                    { value: "double_tap", label: localize("editor.triggers.double_tap") },
                    { value: "swipe_left", label: localize("editor.triggers.swipe_left") },
                    { value: "swipe_right", label: localize("editor.triggers.swipe_right") },
                  ],
                },
              }}
              .value=${action?.card_trigger || "none"}
              @value-changed=${(e) => this._updateActionProperty("card_trigger", e.detail.value)}
            ></ha-selector>
          </div>
        </div>
        ${
          effectivePlacement === "hidden" &&
          (!action?.card_trigger || action?.card_trigger === "none") &&
          actionMode !== "sync_selected_entity" &&
          actionMode !== "select_entity"
            ? html`
                <div class="help-text">
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  ${localize("editor.placements.hidden")}
                  (${localize("editor.placements.not_triggerable")})
                </div>
              `
            : nothing
        }

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="${localize("editor.fields.action_type")}"
            .selector=${{
              select: {
                mode: "dropdown",
                options: [
                  { value: "menu", label: localize("editor.action_types.menu") },
                  { value: "service", label: localize("editor.action_types.service") },
                  { value: "navigate", label: localize("editor.action_types.navigate") },
                  {
                    value: "sync_selected_entity",
                    label: localize("editor.action_types.sync_selected_entity"),
                  },
                  { value: "select_entity", label: localize("editor.action_types.select_entity") },
                  {
                    value: "prev_entity",
                    label: localize("editor.action_types.prev_entity") || "Previous Entity Chip",
                  },
                  {
                    value: "next_entity",
                    label: localize("editor.action_types.next_entity") || "Next Entity Chip",
                  },
                  {
                    value: "toggle_lyrics",
                    label: localize("editor.action_types.toggle_lyrics") || "Toggle Lyrics Overlay",
                  },
                  {
                    value: "remote_control",
                    label:
                      localize("editor.action_types.remote_control") ||
                      "Open Remote Controls Overlay",
                  },
                  {
                    value: "toggle_media_session",
                    label:
                      localize("editor.action_types.toggle_media_session") ||
                      "Toggle Media Session Controls (Experimental)",
                  },
                  {
                    value: "full_screen",
                    label:
                      localize("editor.action_types.full_screen") || "Toggle Full Screen Overlay",
                  },
                ],
              },
            }}
            .value=${this._actionMode ?? this._deriveActionMode(action)}
            @value-changed=${(e) => {
              const mode = e.detail.value;
              this._actionMode = mode;
              if (mode === "service") {
                const updates = {
                  menu_item: undefined,
                  navigation_path: undefined,
                  navigation_new_tab: undefined,
                  action: undefined,
                };
                if (!this._config.actions?.[this._actionEditorIndex]?.service) {
                  updates.service = "";
                }
                this._updateActionProperties(updates);
              } else if (mode === "menu") {
                this._updateActionProperties({
                  service: undefined,
                  service_data: undefined,
                  script_variable: undefined,
                  navigation_path: undefined,
                  navigation_new_tab: undefined,
                  action: undefined,
                });
              } else if (mode === "navigate") {
                const updates = {
                  menu_item: undefined,
                  service: undefined,
                  service_data: undefined,
                  script_variable: undefined,
                  action: "navigate",
                };
                if (!action?.navigation_path) {
                  updates.navigation_path = "";
                }
                this._updateActionProperties(updates);
              } else if (mode === "sync_selected_entity") {
                const updates = {
                  menu_item: undefined,
                  service: undefined,
                  service_data: undefined,
                  script_variable: undefined,
                  navigation_path: undefined,
                  navigation_new_tab: undefined,
                  action: "sync_selected_entity",
                  in_menu: "hidden",
                  card_trigger: "none",
                };
                if (!action?.sync_entity_type) {
                  updates.sync_entity_type = "yamp_entity";
                }
                this._updateActionProperties(updates);
              } else if (mode === "select_entity") {
                const updates = {
                  menu_item: undefined,
                  service: undefined,
                  service_data: undefined,
                  script_variable: undefined,
                  navigation_path: undefined,
                  navigation_new_tab: undefined,
                  action: "select_entity",
                  in_menu: "hidden",
                  card_trigger: "none",
                };
                if (!action?.sync_entity_type) {
                  updates.sync_entity_type = "yamp_entity";
                }
                this._updateActionProperties(updates);
              } else if (mode === "prev_entity" || mode === "next_entity") {
                this._updateActionProperties({
                  menu_item: undefined,
                  service: undefined,
                  service_data: undefined,
                  script_variable: undefined,
                  navigation_path: undefined,
                  navigation_new_tab: undefined,
                  action: mode,
                });
              } else if (
                mode === "toggle_lyrics" ||
                mode === "remote_control" ||
                mode === "toggle_media_session" ||
                mode === "full_screen"
              ) {
                this._updateActionProperties({
                  menu_item: undefined,
                  service: undefined,
                  service_data: undefined,
                  script_variable: undefined,
                  navigation_path: undefined,
                  navigation_new_tab: undefined,
                  action: mode,
                });
              }
            }}
          ></ha-selector>
        </div>

        
        ${
          actionMode === "toggle_media_session"
            ? html`
                <div class="form-row">
                  <div class="config-subtitle">
                    ${
                      localize("editor.subtitles.toggle_media_session") ||
                      "Note: Lock screen and media session controls are experimental."
                    }
                  </div>
                </div>
              `
            : nothing
        }
        ${
          actionMode === "menu"
            ? html`
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    label="${localize("editor.fields.menu_item")}"
                    .selector=${{
                      select: {
                        mode: "dropdown",
                        options: [
                          { value: "", label: "" },
                          { value: "search", label: localize("card.menu.search") },
                          {
                            value: "search-recently-played",
                            label: localize("search.recently_played"),
                          },
                          { value: "search-next-up", label: localize("search.next_up") },
                          { value: "source", label: localize("card.menu.source") },
                          { value: "more-info", label: localize("card.menu.more_info") },
                          { value: "group-players", label: localize("card.menu.group_players") },
                          { value: "transfer-queue", label: localize("card.menu.transfer_queue") },
                          { value: "main-menu", label: localize("card.menu.main_menu") },
                          { value: "full-screen", label: localize("card.menu.full_screen") },
                        ],
                      },
                    }}
                    .value=${action?.menu_item ?? ""}
                    @value-changed=${(e) =>
                      this._updateActionProperty("menu_item", e.detail.value || undefined)}
                  ></ha-selector>
                </div>
              `
            : nothing
        } 
        ${
          actionMode === "navigate"
            ? html`
                <div class="form-row">
                  <div class="editor-field-wrapper">
                    ${
                      this._isTemplateMode("navigation_path", action?.navigation_path)
                        ? html`
                            <div class="grow-children" style="flex-direction: column;">
                              <span class="form-label">${localize("editor.fields.nav_path")}</span>
                              <ha-code-editor
                                lint
                                .hass=${this.hass}
                                mode="jinja2"
                                autocomplete-entities
                                label="${localize("editor.fields.nav_path")}"
                                .value=${action?.navigation_path ?? ""}
                                @value-changed=${(e) => {
                                  this._updateActionProperties({
                                    navigation_path: e.detail.value,
                                    action: "navigate",
                                  });
                                }}
                              ></ha-code-editor>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle(
                                "navigation_path",
                                action?.navigation_path,
                                (v) => {
                                  this._updateActionProperties({
                                    navigation_path: v,
                                    action: "navigate",
                                  });
                                }
                              )}
                            </div>
                          `
                        : html`
                            <div class="grow-children">
                              <ha-selector
                                .hass=${this.hass}
                                class="full-width"
                                .selector=${{ text: {} }}
                                label="${localize(
                                  "editor.fields.nav_path"
                                )} (/lovelace/music or #popup)"
                                .value=${action?.navigation_path ?? ""}
                                @value-changed=${(e) => {
                                  this._updateActionProperties({
                                    navigation_path: e.detail.value,
                                    action: "navigate",
                                  });
                                }}
                              ></ha-selector>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle(
                                "navigation_path",
                                action?.navigation_path,
                                (v) => {
                                  this._updateActionProperties({
                                    navigation_path: v,
                                    action: "navigate",
                                  });
                                }
                              )}
                            </div>
                          `
                    }
                  </div>
                </div>
                <div class="form-row form-row-multi-column">
                  <div>
                    <ha-switch
                      id="navigation-new-tab-toggle"
                      .checked=${action?.navigation_new_tab ?? false}
                      @change=${(e) =>
                        this._updateActionProperty("navigation_new_tab", e.target.checked)}
                    ></ha-switch>
                    <label for="navigation-new-tab-toggle">Open External URLs in New Tab</label>
                  </div>
                </div>
                <div class="form-row">
                  <div class="config-subtitle">
                    Supports dashboard paths, URLs, and anchors (e.g.,
                    <code>/lovelace/music</code> or <code>#pop-up-menu</code>).
                  </div>
                </div>
              `
            : nothing
        }
        ${
          actionMode === "sync_selected_entity" || actionMode === "select_entity"
            ? html`
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{ entity: { domain: "input_text" } }}
                    .value=${action?.sync_entity_helper ?? ""}
                    label="${localize("editor.fields.selected_entity_helper")}"
                    @value-changed=${(e) =>
                      this._updateActionProperty("sync_entity_helper", e.detail.value)}
                  ></ha-selector>
                  <div class="config-subtitle">
                    ${
                      actionMode === "select_entity"
                        ? localize("editor.subtitles.select_entity_helper")
                        : localize("editor.subtitles.selected_entity_helper")
                    }
                  </div>
                </div>
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    label="${localize("editor.fields.sync_entity_type")}"
                    .selector=${{
                      select: {
                        mode: "dropdown",
                        options: [
                          {
                            value: "yamp_entity",
                            label: localize("editor.sync_entity_options.yamp_entity"),
                          },
                          {
                            value: "yamp_main_entity",
                            label: localize("editor.sync_entity_options.yamp_main_entity"),
                          },
                          {
                            value: "yamp_playback_entity",
                            label: localize("editor.sync_entity_options.yamp_playback_entity"),
                          },
                        ],
                      },
                    }}
                    .value=${action?.sync_entity_type ?? "yamp_entity"}
                    @value-changed=${(e) =>
                      this._updateActionProperty("sync_entity_type", e.detail.value)}
                  ></ha-selector>
                  <div class="config-subtitle">
                    ${localize("editor.subtitles.sync_entity_type")}
                  </div>
                </div>
              `
            : nothing
        }
        ${
          actionMode === "service"
            ? html`
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{
                      select: {
                        mode: "dropdown",
                        custom_value: true,
                        options: this._serviceItems || [],
                      },
                    }}
                    .value=${action.service ?? ""}
                    label="${localize("editor.fields.service")}"
                    @value-changed=${(e) => this._updateActionProperty("service", e.detail.value)}
                  ></ha-selector>
                </div>

                ${
                  typeof action.service === "string" && action.service.startsWith("script.")
                    ? html`
                        <div
                          data-search-keys="script_variable"
                          class="form-row form-row-multi-column"
                        >
                          <div>
                            <ha-switch
                              id="script-variable-toggle"
                              .checked=${action?.script_variable ?? false}
                              @change=${(e) =>
                                this._updateActionProperty("script_variable", e.target.checked)}
                            ></ha-switch>
                            <span>${localize("editor.labels.script_var")}</span>
                          </div>
                        </div>
                      `
                    : nothing
                }
                ${
                  typeof action.service === "string"
                    ? html`
                        <div class="help-text">
                          <ha-icon icon="mdi:information-outline"></ha-icon>

                          ${localize("editor.subtitles.entity_current_hint")}
                        </div>
                        <div class="form-row">
                          <div
                            class=${
                              this._yamlError && this._yamlDraft?.trim() !== ""
                                ? "code-editor-wrapper error"
                                : "code-editor-wrapper"
                            }
                          >
                            <span class="form-label"
                              >${localize("editor.fields.service_data")}</span
                            >
                            <ha-code-editor
                              lint
                              id="service-data-editor"
                              label="${localize("editor.fields.service_data")}"
                              autocomplete-entities
                              autocomplete-icons
                              .hass=${this.hass}
                              mode="yaml"
                              .value=${this._yamlDraft !== undefined ? this._yamlDraft : action?.service_data ? yaml.dump(action.service_data) : ""}
                              @value-changed=${(e) => {
                                if (this._yamlDraft === e.detail.value) return;
                                this._yamlDraft = e.detail.value;
                                try {
                                  if (this._yamlDraft.trim() === "") {
                                    this._yamlError = null;
                                    this._updateActionProperty("service_data", {});
                                  } else {
                                    const parsed = yaml.load(this._yamlDraft);
                                    if (parsed && typeof parsed === "object") {
                                      this._yamlError = null;
                                      this._updateActionProperty("service_data", parsed);
                                    } else {
                                      this._yamlError = "Invalid YAML";
                                    }
                                  }
                                } catch (err) {
                                  this._yamlError = err.message;
                                }
                              }}
                            ></ha-code-editor>
                            ${
                              this._yamlError && this._yamlDraft?.trim() !== ""
                                ? html`<div class="yaml-error-message">${this._yamlError}</div>`
                                : nothing
                            }
                          </div>
                        </div>
                      `
                    : nothing
                }
              `
            : nothing
        }
      </div>`;
}
