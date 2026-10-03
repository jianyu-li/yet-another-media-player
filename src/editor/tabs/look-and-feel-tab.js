import { html } from "lit";
import { localize } from "../../localize/localize.js";
import { DEFAULT_LYRICS_BACKGROUND_FADE } from "../../constants.js";
import {
  VOLUME_MODE_SELECTOR,
  VOLUME_STEP_SELECTOR,
  LYRICS_BACKGROUND_FADE_SELECTOR,
  getAdaptiveTextSelectorOptions,
} from "../constants.js";

/**
 * Render the Look & Feel (Visual) tab in the YAMP card editor.
 * @this {import("../../types.d.ts").YetAnotherMediaPlayerEditor}
 */
export function renderVisualTab() {
  return html`
    <div class="config-section">
      <div class="section-header">
        <div class="section-title">
          ${localize("editor.sections.look_and_feel.theme_layout.title")}
        </div>
        <div class="section-description">
          ${localize("editor.sections.look_and_feel.theme_layout.description")}
        </div>
      </div>

      <div
        data-search-keys="match_theme alternate_progress_bar"
        class="form-row form-row-multi-column"
      >
        <div>
          <ha-switch
            id="match-theme-toggle"
            .checked=${this._config.match_theme ?? false}
            @change=${(e) => this._updateConfig("match_theme", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.match_theme")}</span>
        </div>
        <div>
          <ha-switch
            id="alternate-progress-bar-toggle"
            .checked=${this._config.alternate_progress_bar ?? false}
            @change=${(e) => this._updateConfig("alternate_progress_bar", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.alt_progress")}</span>
        </div>
      </div>
      <div class="form-row form-row-multi-column">
        <div class="grow-children">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              number: { min: 2, max: 48, step: 2, unit_of_measurement: "px", mode: "box" },
            }}
            .value=${this._config.progress_bar_height ?? 6}
            label="${localize("editor.labels.progress_bar_height")}"
            @value-changed=${(e) => this._updateConfig("progress_bar_height", e.detail.value)}
          ></ha-selector>
        </div>
        <ha-icon
          class="icon-button"
          icon="mdi:restore"
          title="${localize("common.reset_default")}"
          @click=${() => this._updateConfig("progress_bar_height", 6)}
        ></ha-icon>
      </div>
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "automatic", label: localize("editor.appearance_options.automatic") },
                { value: "light", label: localize("editor.appearance_options.light") },
                { value: "dark", label: localize("editor.appearance_options.dark") },
              ],
            },
          }}
          .value=${this._config.appearance ?? "automatic"}
          label="${localize("editor.fields.appearance")}"
          @value-changed=${(e) => this._updateConfig("appearance", e.detail.value)}
        ></ha-selector>
      </div>

      <div class="form-row" data-search-keys="font_color font color appearance text_color">
        <div class="editor-field-wrapper">
          ${
            this._isTemplateMode("font_color", this._config.font_color)
              ? html`
                  <div class="grow-children" style="flex-direction: column;">
                    <span class="form-label">${localize("editor.fields.font_color_entity")}</span>
                    <ha-code-editor
                      lint
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      label="${localize("editor.fields.font_color")}"
                      .value=${this._config.font_color ?? ""}
                      @value-changed=${(e) => this._updateConfig("font_color", e.detail.value)}
                    ></ha-code-editor>
                  </div>
                `
              : html`
                  <div
                    class="grow-children"
                    style="display: flex; align-items: flex-start; gap: 12px;"
                  >
                    <div
                      style="position: relative; width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid var(--divider-color, rgba(255,255,255,0.2)); flex: 0 0 36px; cursor: pointer; margin-top: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"
                      title="${localize("editor.fields.font_color")}"
                    >
                      <input
                        type="color"
                        .value=${this._toHexColor(this._config.font_color)}
                        @input=${(e) => this._updateConfig("font_color", e.target.value)}
                        style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; cursor: pointer; border: none; padding: 0; background: transparent;"
                      />
                    </div>
                    <ha-selector
                      .hass=${this.hass}
                      class="full-width"
                      style="flex: 1;"
                      .selector=${{ text: {} }}
                      .value=${this._config.font_color ?? ""}
                      label="${localize("editor.fields.font_color")}"
                      helper="${localize("editor.subtitles.font_color_helper") || "e.g., #ffffff, rgba(255, 255, 255, 0.9), white"}"
                      @value-changed=${(e) => this._updateConfig("font_color", e.detail.value)}
                    ></ha-selector>
                  </div>
                `
          }
          <div class="field-actions">
            ${this._renderTemplateToggle("font_color", this._config.font_color, (v) =>
              this._updateConfig("font_color", v)
            )}
            <ha-icon
              class="icon-button-small ${!this._config.font_color ? "icon-button-disabled" : ""}"
              icon="mdi:restore"
              title="${localize("common.reset_default")}"
              @click=${() => this._updateConfig("font_color", undefined)}
            ></ha-icon>
          </div>
        </div>
      </div>

      <div
        data-search-keys="alternate_progress_bar always_collapsed display_timestamps"
        class="form-row form-row-multi-column"
      >
        <div
          title=${
            this._config.alternate_progress_bar ||
            (!this._isTemplateValue(this._config.always_collapsed) && this._config.always_collapsed)
              ? localize("editor.subtitles.not_available_alt_collapsed")
              : ""
          }
        >
          <ha-switch
            id="display-timestamps-toggle"
            .checked=${this._config.display_timestamps ?? false}
            @change=${(e) => this._updateConfig("display_timestamps", e.target.checked)}
            .disabled=${this._config.alternate_progress_bar || (!this._isTemplateValue(this._config.always_collapsed) && this._config.always_collapsed)}
          ></ha-switch>
          <span>${localize("editor.labels.display_timestamps")}</span>
        </div>
      </div>
      <div class="form-row">
        <div class="editor-field-wrapper">
          ${
            this._isTemplateMode("card_height", this._config.card_height)
              ? html`
                  <div class="grow-children" style="flex-direction: column;">
                    <span class="form-label">${localize("editor.fields.card_height")}</span>
                    <ha-code-editor
                      lint
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      label="${localize("editor.fields.card_height")}"
                      .value=${
                        this._config.card_height !== undefined && this._config.card_height !== null
                          ? String(this._config.card_height)
                          : ""
                      }
                      @value-changed=${(e) => this._updateConfig("card_height", e.detail.value)}
                    ></ha-code-editor>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle("card_height", this._config.card_height, (v) =>
                      this._updateConfig("card_height", v)
                    )}
                    <ha-icon
                      class="icon-button-small"
                      icon="mdi:restore"
                      title="${localize("common.reset_default")}"
                      @click=${() => this._updateConfig("card_height", undefined)}
                    ></ha-icon>
                  </div>
                `
              : html`
                  <div class="grow-children">
                    <ha-selector
                      .hass=${this.hass}
                      class="full-width"
                      .selector=${{ number: { min: 0, max: 2000, mode: "box" } }}
                      label="${localize("editor.fields.card_height")}"
                      .value=${this._config.card_height ?? ""}
                      helper="${localize("editor.subtitles.card_height_full")}"
                      @value-changed=${(e) => {
                        const raw = e.detail.value;
                        if (raw === "" || raw === undefined) {
                          this._updateConfig("card_height", undefined);
                          return;
                        }
                        const parsed = Number(raw);
                        this._updateConfig(
                          "card_height",
                          Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
                        );
                      }}
                    ></ha-selector>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle("card_height", this._config.card_height, (v) =>
                      this._updateConfig("card_height", v)
                    )}
                    <ha-icon
                      class="icon-button-small"
                      icon="mdi:restore"
                      title="${localize("common.reset_default")}"
                      @click=${() => this._updateConfig("card_height", undefined)}
                    ></ha-icon>
                  </div>
                `
          }
        </div>
      </div>
      <div
        class="form-row"
        data-search-keys="lyrics_background_fade lyrics background fade overlay"
        style="${!this._isTemplateValue(this._config.always_collapsed) && this._config.always_collapsed === true ? "opacity: 0.5;" : ""}"
        title="${
          !this._isTemplateValue(this._config.always_collapsed) &&
          this._config.always_collapsed === true
            ? localize("editor.subtitles.not_available_collapsed")
            : ""
        }"
      >
        ${
          this._isTemplateMode("lyrics_background_fade", this._config.lyrics_background_fade)
            ? html`
                <div class="editor-field-wrapper">
                  <div class="grow-children" style="flex-direction: column;">
                    <span class="form-label"
                      >${localize("editor.labels.lyrics_background_fade")}</span
                    >
                    <ha-code-editor
                      lint
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      label="${localize("editor.labels.lyrics_background_fade")}"
                      .value=${
                        this._config.lyrics_background_fade !== undefined &&
                        this._config.lyrics_background_fade !== null
                          ? String(this._config.lyrics_background_fade)
                          : ""
                      }
                      @value-changed=${(e) =>
                        this._updateConfig("lyrics_background_fade", e.detail.value)}
                    ></ha-code-editor>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle(
                      "lyrics_background_fade",
                      this._config.lyrics_background_fade,
                      (v) => this._updateConfig("lyrics_background_fade", v)
                    )}
                    <ha-icon
                      class="icon-button-small"
                      icon="mdi:restore"
                      title="${localize("common.reset_default")}"
                      @click=${() =>
                        this._updateConfig(
                          "lyrics_background_fade",
                          DEFAULT_LYRICS_BACKGROUND_FADE
                        )}
                    ></ha-icon>
                  </div>
                </div>
              `
            : html`
                <span class="form-label">${localize("editor.labels.lyrics_background_fade")}</span>
                <div class="editor-field-wrapper">
                  <div class="grow-children">
                    <ha-selector
                      .hass=${this.hass}
                      class="full-width"
                      .selector=${LYRICS_BACKGROUND_FADE_SELECTOR}
                      helper="${localize("editor.subtitles.lyrics_background_fade")}"
                      .value=${this._config.lyrics_background_fade ?? DEFAULT_LYRICS_BACKGROUND_FADE}
                      .disabled=${!this._isTemplateValue(this._config.always_collapsed) && this._config.always_collapsed === true}
                      @value-changed=${(e) => {
                        const raw = e.detail.value;
                        if (raw === "" || raw === undefined) {
                          this._updateConfig(
                            "lyrics_background_fade",
                            DEFAULT_LYRICS_BACKGROUND_FADE
                          );
                          return;
                        }
                        const parsed = Number(raw);
                        this._updateConfig(
                          "lyrics_background_fade",
                          Number.isFinite(parsed) ? parsed : DEFAULT_LYRICS_BACKGROUND_FADE
                        );
                      }}
                    ></ha-selector>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle(
                      "lyrics_background_fade",
                      this._config.lyrics_background_fade,
                      (v) => this._updateConfig("lyrics_background_fade", v)
                    )}
                    <ha-icon
                      class="icon-button-small"
                      icon="mdi:restore"
                      title="${localize("common.reset_default")}"
                      @click=${() =>
                        this._updateConfig(
                          "lyrics_background_fade",
                          DEFAULT_LYRICS_BACKGROUND_FADE
                        )}
                    ></ha-icon>
                  </div>
                </div>
              `
        }
      </div>
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "list", label: localize("editor.search_view_options.list") },
                { value: "card", label: localize("editor.search_view_options.card") },
                {
                  value: "card_minimal",
                  label: localize("editor.search_view_options.card_minimal"),
                },
              ],
            },
          }}
          .value=${this._config.search_view ?? "list"}
          label="${localize("editor.fields.search_view")}"
          helper="${localize("editor.subtitles.search_view")}"
          @value-changed=${(e) => this._updateConfig("search_view", e.detail.value)}
        ></ha-selector>
      </div>
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{ number: { min: 1, max: 12, step: 1, mode: "box" } }}
          .value=${this._config.search_card_columns ?? 4}
          .disabled=${this._config.search_view !== "card" && this._config.search_view !== "card_minimal"}
          label="${localize("editor.fields.search_card_columns")}"
          helper="${localize("editor.subtitles.search_card_columns")}"
          @value-changed=${(e) => this._updateConfig("search_card_columns", e.detail.value)}
        ></ha-selector>
      </div>
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                {
                  value: "drag_handle",
                  label: localize("editor.queue_controls_style_options.drag_handle"),
                },
                {
                  value: "icons",
                  label: localize("editor.queue_controls_style_options.icons"),
                },
              ],
            },
          }}
          .value=${this._config.queue_controls_style ?? "drag_handle"}
          label="${localize("editor.fields.queue_controls_style")}"
          helper="${localize("editor.subtitles.queue_controls_style")}"
          @value-changed=${(e) => this._updateConfig("queue_controls_style", e.detail.value)}
        ></ha-selector>
      </div>
    </div>

    <div class="config-section">
      <div class="section-header">
        <div class="section-title">
          ${localize("editor.sections.look_and_feel.controls_typography.title")}
        </div>
        <div class="section-description">
          ${localize("editor.sections.look_and_feel.controls_typography.description")}
        </div>
      </div>
      <div class="form-row" data-search-keys="control_layout classic modern">
        <div class="editor-field-wrapper">
          ${
            this._isTemplateMode("control_layout", this._config.control_layout)
              ? html`
                  <div class="grow-children" style="flex-direction: column;">
                    <span class="form-label">${localize("editor.fields.control_layout")}</span>
                    <ha-code-editor
                      lint
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      label="${localize("editor.fields.control_layout")}"
                      .value=${this._config.control_layout ?? ""}
                      @value-changed=${(e) => this._updateConfig("control_layout", e.detail.value)}
                    ></ha-code-editor>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle(
                      "control_layout",
                      this._config.control_layout,
                      (v) => this._updateConfig("control_layout", v)
                    )}
                  </div>
                `
              : html`
                  <div class="grow-children">
                    <ha-selector
                      .hass=${this.hass}
                      class="full-width"
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
                      label="${localize("editor.fields.control_layout")}"
                      helper="${localize("editor.subtitles.control_layout_full")}"
                      @value-changed=${(e) => this._updateConfig("control_layout", e.detail.value)}
                    ></ha-selector>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle(
                      "control_layout",
                      this._config.control_layout,
                      (v) => this._updateConfig("control_layout", v)
                    )}
                  </div>
                `
          }
        </div>
      </div>
      <div
        class="form-row"
        style="${this._isTemplateValue(this._config.control_layout) || (this._config.control_layout ?? "classic") === "modern" ? "" : "opacity: 0.5;"}"
        title="${
          this._isTemplateValue(this._config.control_layout) ||
          (this._config.control_layout ?? "classic") === "modern"
            ? ""
            : localize("editor.subtitles.only_available_modern")
        }"
        }
      >
        <div>
          <ha-switch
            .checked=${this._config.swap_pause_for_stop ?? false}
            @change=${(e) => this._updateConfig("swap_pause_for_stop", e.target.checked)}
            .disabled=${!this._isTemplateValue(this._config.control_layout) && (this._config.control_layout ?? "classic") !== "modern"}
          ></ha-switch>
          <span>${localize("editor.labels.swap_pause_stop")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.swap_pause_stop")}</div>
      </div>
      <div class="form-row">
        <div>
          <ha-switch
            id="adaptive-controls-toggle"
            .checked=${this._config.adaptive_controls ?? false}
            @change=${(e) => this._updateConfig("adaptive_controls", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.adaptive_controls")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.adaptive_controls")}</div>
      </div>
      <div class="form-row">
        <div>
          <ha-switch
            id="show-album-toggle"
            .checked=${this._config.show_album ?? true}
            @change=${(e) => this._updateConfig("show_album", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.show_album")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.show_album")}</div>
      </div>
      ${
        this._isTemplateMode("lock_screen_controls", this._config.lock_screen_controls)
          ? html`
              <div
                class="form-row"
                data-search-keys="lock_screen_controls media_session lock screen ios controls experimental"
              >
                <div class="editor-field-wrapper">
                  <div class="grow-children" style="flex-direction: column;">
                    <span class="form-label"
                      >${localize("editor.labels.lock_screen_controls")}</span
                    >
                    <ha-code-editor
                      lint
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      label="${localize("editor.labels.lock_screen_controls")}"
                      .value=${
                        typeof this._config.lock_screen_controls === "string"
                          ? this._config.lock_screen_controls
                          : ""
                      }
                      @value-changed=${(e) =>
                        this._updateConfig("lock_screen_controls", e.detail.value)}
                    ></ha-code-editor>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle(
                      "lock_screen_controls",
                      this._config.lock_screen_controls,
                      (v) => this._updateConfig("lock_screen_controls", v)
                    )}
                  </div>
                </div>
                <div class="config-subtitle">
                  ${localize("editor.subtitles.lock_screen_controls")}
                </div>
              </div>
            `
          : html`
              <div
                class="form-row"
                data-search-keys="lock_screen_controls media_session lock screen ios controls experimental"
              >
                <div style="display: flex; align-items: center; gap: 8px;">
                  <ha-switch
                    id="lock-screen-controls-toggle"
                    .checked=${this._config.lock_screen_controls === true}
                    @change=${(e) => this._updateConfig("lock_screen_controls", e.target.checked)}
                  ></ha-switch>
                  <span>${localize("editor.labels.lock_screen_controls")}</span>
                  ${this._renderTemplateToggle(
                    "lock_screen_controls",
                    this._config.lock_screen_controls,
                    (v) => this._updateConfig("lock_screen_controls", v)
                  )}
                </div>
                <div class="config-subtitle">
                  ${localize("editor.subtitles.lock_screen_controls")}
                </div>
              </div>
            `
      }
      <div class="form-row">
        <div>
          <ha-switch
            id="hide-active-entity-label-toggle"
            .checked=${this._config.hide_active_entity_label ?? false}
            @change=${(e) => this._updateConfig("hide_active_entity_label", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.hide_active_entity")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.hide_menu_player")}</div>
      </div>
      <div class="form-row">
        <div>
          <ha-switch
            id="hide-active-entity-label-on-idle-toggle"
            .checked=${this._config.hide_active_entity_label_on_idle ?? false}
            @change=${(e) =>
              this._updateConfig("hide_active_entity_label_on_idle", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.hide_active_entity_on_idle")}</span>
        </div>
        <div class="config-subtitle">
          ${localize("editor.subtitles.hide_active_entity_on_idle")}
        </div>
      </div>
      <div class="form-row">
        <div class="full-width">
          <span class="form-label">${localize("editor.labels.adaptive_text_elements")}</span>
          <div class="config-subtitle">${localize("editor.subtitles.adaptive_text")}</div>
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              select: {
                multiple: true,
                options: getAdaptiveTextSelectorOptions(),
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
              mode: "dropdown",
              options: [
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
                { value: "none", label: "None" },
              ],
            },
          }}
          .value=${this._config.details_alignment ?? "left"}
          label="${localize("editor.fields.details_alignment")}"
          @value-changed=${(e) => this._updateConfig("details_alignment", e.detail.value)}
        ></ha-selector>
      </div>
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${VOLUME_MODE_SELECTOR}
          .value=${this._config.volume_mode ?? "slider"}
          label="${localize("editor.fields.volume_mode")}"
          @value-changed=${(e) => this._updateConfig("volume_mode", e.detail.value)}
        ></ha-selector>
      </div>
      ${html`
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${VOLUME_STEP_SELECTOR}
              .value=${this._config.volume_step ?? 0.05}
              .disabled=${this._config.volume_mode !== "stepper"}
              label="${localize("editor.fields.vol_step")}"
              @value-changed=${(e) => this._updateConfig("volume_step", e.detail.value)}
            ></ha-selector>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="${localize("common.reset_default")}"
            @click=${() => this._updateConfig("volume_step", 0.05)}
          ></ha-icon>
        </div>
      `}
    </div>

    <div class="config-section">
      <div class="section-header">
        <div class="section-title">
          ${localize("editor.sections.look_and_feel.collapsed_idle.title")}
        </div>
        <div class="section-description">
          ${localize("editor.sections.look_and_feel.collapsed_idle.description")}
        </div>
      </div>

      <div
        data-search-keys="collapse_on_idle always_collapsed hide_menu_player pin_search_headers expand_on_search"
        class="form-row form-row-multi-column"
      >
        <div>
          <ha-switch
            id="collapse-on-idle-toggle"
            .checked=${this._config.collapse_on_idle ?? false}
            @change=${(e) => this._updateConfig("collapse_on_idle", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.collapse_on_idle")}</span>
        </div>
        <div
          style="${this._isTemplateValue(this._config.always_collapsed) || !this._config.always_collapsed ? "" : "opacity: 0.5;"}"
          title="${
            this._isTemplateValue(this._config.always_collapsed) || !this._config.always_collapsed
              ? ""
              : localize("editor.subtitles.not_available_collapsed")
          }"
        >
          <ha-switch
            id="hide-menu-player-toggle"
            .checked=${this._config.hide_menu_player ?? false}
            @change=${(e) => this._updateConfig("hide_menu_player", e.target.checked)}
            .disabled=${
              (!this._isTemplateValue(this._config.always_collapsed) &&
                !!this._config.always_collapsed) ||
              (this._config.always_collapsed === true &&
                this._config.pin_search_headers === true &&
                this._config.expand_on_search === true)
            }
          ></ha-switch>
          <span>${localize("editor.labels.hide_menu_player_toggle")}</span>
        </div>
      </div>
      ${
        this._isTemplateMode("always_collapsed", this._config.always_collapsed)
          ? html`
              <div class="form-row">
                <div class="editor-field-wrapper">
                  <div class="grow-children" style="flex-direction: column;">
                    <span class="form-label">${localize("editor.labels.always_collapsed")}</span>
                    <ha-code-editor
                      lint
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      label="${localize("editor.labels.always_collapsed")}"
                      .value=${
                        this._config.always_collapsed !== undefined &&
                        this._config.always_collapsed !== null
                          ? String(this._config.always_collapsed)
                          : ""
                      }
                      @value-changed=${(e) =>
                        this._updateConfig("always_collapsed", e.detail.value)}
                    ></ha-code-editor>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle(
                      "always_collapsed",
                      this._config.always_collapsed,
                      (v) => this._updateConfig("always_collapsed", v)
                    )}
                  </div>
                </div>
              </div>
            `
          : html`
              <div
                data-search-keys="always_collapsed expand_on_search"
                class="form-row form-row-multi-column"
              >
                <div style="display: flex; align-items: center; gap: 8px;">
                  <ha-switch
                    id="always-collapsed-toggle"
                    .checked=${this._config.always_collapsed === true}
                    @change=${(e) => this._updateConfig("always_collapsed", e.target.checked)}
                  ></ha-switch>
                  <span>${localize("editor.labels.always_collapsed")}</span>
                  ${this._renderTemplateToggle(
                    "always_collapsed",
                    this._config.always_collapsed,
                    (v) => this._updateConfig("always_collapsed", v)
                  )}
                </div>
                <div
                  style="${this._config.always_collapsed ? "" : "opacity: 0.5;"}"
                  title="${
                    this._config.always_collapsed
                      ? ""
                      : localize("editor.subtitles.only_available_collapsed")
                  }"
                >
                  <ha-switch
                    id="expand-on-search-toggle"
                    .checked=${this._config.expand_on_search ?? false}
                    @change=${(e) => this._updateConfig("expand_on_search", e.target.checked)}
                    .disabled=${!this._config.always_collapsed}
                  ></ha-switch>
                  <span>${localize("editor.labels.expand_on_search")}</span>
                </div>
              </div>
            `
      }
      <div class="form-row">
        <div class="config-subtitle">${localize("editor.subtitles.collapse_expand")}</div>
      </div>
      <div
        data-search-keys="disable_mini_menu"
        class="form-row"
        style="${this._config.always_collapsed === true && !this._config.expand_on_search ? "" : "opacity: 0.5;"}"
        title="${
          this._config.always_collapsed === true && !this._config.expand_on_search
            ? ""
            : localize("editor.subtitles.only_available_mini_menu")
        }"
      >
        <div style="display: flex; align-items: center; gap: 8px;">
          <ha-switch
            id="disable-mini-menu-toggle"
            .checked=${this._config.disable_mini_menu === true}
            @change=${(e) => this._updateConfig("disable_mini_menu", e.target.checked)}
            .disabled=${!(this._config.always_collapsed === true && !this._config.expand_on_search)}
          ></ha-switch>
          <span>${localize("editor.labels.disable_mini_menu")}</span>
        </div>
      </div>
      <div class="form-row">
        <div class="config-subtitle">${localize("editor.subtitles.disable_mini_menu")}</div>
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
                { value: "search-next-up", label: "Next Up" },
              ],
            },
          }}
          .value=${this._config.idle_screen ?? "default"}
          label="${localize("editor.fields.idle_screen")}"
          @value-changed=${(e) => this._updateConfig("idle_screen", e.detail.value)}
        ></ha-selector>
        <div class="config-subtitle">${localize("editor.subtitles.idle_screen")}</div>
      </div>
    </div>
  `;
}
