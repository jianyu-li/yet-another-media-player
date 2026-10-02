import { html, nothing } from "lit";
import { localize } from "../../localize/localize.js";
import { getEntityName } from "../../yamp-utils.js";

/**
 * Render the Artwork tab in the YAMP card editor.
 * @this {import("../../yamp-editor.js").YetAnotherMediaPlayerEditor}
 */
export function renderArtworkTab() {
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
    { value: "aspect_ratio", label: "Aspect Ratio" },
    { value: "missing_art", label: "Missing Artwork" },
    { value: "idle_image", label: localize("editor.fields.idle_image") || "Idle Image" },
  ];

  return html`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize("editor.sections.artwork.general.title")}</div>
            <div class="section-description">${localize("editor.sections.artwork.general.description")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${localize("editor.fields.artwork_fit")}"
                .selector=${{
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "cover", label: localize("editor.artwork_fit.cover") },
                      { value: "contain", label: localize("editor.artwork_fit.contain") },
                      { value: "fill", label: localize("editor.artwork_fit.fill") },
                      { value: "scale-down", label: localize("editor.artwork_fit.scale-down") },
                      {
                        value: "scaled-contain",
                        label: localize("editor.artwork_fit.scaled-contain"),
                      },
                      {
                        value: "scaled-contain-alternate",
                        label: localize("editor.artwork_fit.scaled-contain-alternate"),
                      },
                      { value: "none", label: localize("editor.artwork_fit.none") },
                      { value: "no_artwork", label: localize("editor.fields.no_artwork_option") },
                    ],
                  },
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
                label="${localize("editor.fields.artwork_position")}"
                .selector=${{
                  select: {
                    mode: "dropdown",
                    options: [
                      {
                        value: "top center",
                        label: (localize("editor.artwork_position.top") || "Top") + " (default)",
                      },
                      {
                        value: "center center",
                        label: localize("editor.artwork_position.center") || "Center",
                      },
                      {
                        value: "bottom center",
                        label: localize("editor.artwork_position.bottom") || "Bottom",
                      },
                    ],
                  },
                }}
                .value=${this._config.artwork_position ?? "top center"}
                @value-changed=${(e) => {
                  const value = e.detail.value;
                  this._updateConfig(
                    "artwork_position",
                    value === "top center" ? undefined : value
                  );
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
                <label for="extend-artwork-toggle" style="font-weight: 500;">${localize("editor.subtitles.artwork_extend_label")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${localize("editor.subtitles.artwork_extend")}</div>
              </div>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="blurred-artwork-toggle"
                .checked=${this._config.blurred_artwork === true || (this._config.blurred_artwork !== false && (this._config.always_collapsed === true || this._config.artwork_object_fit === "scaled-contain"))}
                @change=${(e) => this._updateConfig("blurred_artwork", e.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="blurred-artwork-toggle" style="font-weight: 500;">${localize("editor.labels.blurred_artwork")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${localize("editor.subtitles.blurred_artwork")}</div>
              </div>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="hide-collapsed-artwork-toggle"
                .checked=${this._config.hide_collapsed_artwork === true}
                @change=${(e) => this._updateConfig("hide_collapsed_artwork", e.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="hide-collapsed-artwork-toggle" style="font-weight: 500;">${localize("editor.labels.hide_collapsed_artwork")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${localize("editor.subtitles.hide_collapsed_artwork")}</div>
              </div>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="disable-artwork-gradient-toggle"
                .checked=${this._config.disable_artwork_gradient === true}
                @change=${(e) => this._updateConfig("disable_artwork_gradient", e.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="disable-artwork-gradient-toggle" style="font-weight: 500;">${localize("editor.labels.disable_artwork_gradient")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${localize("editor.subtitles.disable_artwork_gradient")}</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              class="full-width"
              label="${localize("editor.fields.artwork_hostname")}"
              .selector=${{ text: {} }}
              .value=${this._config.artwork_hostname ?? ""}
              @value-changed=${(e) => this._updateConfig("artwork_hostname", e.detail.value)}
              helper="e.g. http://192.168.1.50:8123"
            ></ha-selector>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize("editor.sections.artwork.background.title")}</div>
            <div class="section-description">${localize("editor.sections.artwork.background.description")}</div>
          </div>
          ${
            this._isTemplateMode("background_image", this._config.background_image)
              ? html`
                  <div class="form-row">
                    <div class="editor-field-wrapper">
                      <div class="grow-children" style="flex-direction: column;">
                        <span class="form-label"
                          >${localize("editor.fields.background_image_entity")}</span
                        >
                        <ha-code-editor
                          lint
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          label="${localize("editor.sections.artwork.background.title")}"
                          .value=${this._config.background_image ?? ""}
                          @value-changed=${(e) => this._updateConfig("background_image", e.detail.value)}
                        ></ha-code-editor>
                      </div>
                      <div class="field-actions">
                        ${this._renderTemplateToggle(
                          "background_image",
                          this._config.background_image,
                          (v) => this._updateConfig("background_image", v)
                        )}
                      </div>
                    </div>
                  </div>
                `
              : html`
                  <div class="form-row form-row-multi-column">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                      <ha-switch
                        id="background-image-url-toggle"
                        .checked=${
                          this._useBackgroundImageUrl ??
                          this._looksLikeUrlOrPath(this._config.background_image)
                        }
                        @change=${(e) => {
                          this._useBackgroundImageUrl = e.target.checked;
                          this._updateConfig("background_image", "");
                        }}
                      ></ha-switch>
                      <label for="background-image-url-toggle"
                        >${localize("editor.labels.use_url_path")}</label
                      >
                    </div>
                    <div style="flex: 2; display: flex; align-items: center; gap: 8px;">
                      <div class="editor-field-wrapper">
                        <div class="grow-children">
                          ${
                            (this._useBackgroundImageUrl ??
                            this._looksLikeUrlOrPath(this._config.background_image))
                              ? html`
                                  <ha-selector
                                    .hass=${this.hass}
                                    class="full-width"
                                    .selector=${{ text: {} }}
                                    .value=${this._config.background_image ?? ""}
                                    @value-changed=${(e) =>
                                      this._updateConfig("background_image", e.detail.value)}
                                    .label=${localize("editor.fields.image_url")}
                                    placeholder="https://... or /local/..."
                                    helper="${localize("editor.subtitles.image_url_helper")}"
                                  ></ha-selector>
                                `
                              : html`
                                  <ha-generic-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .value=${this._config.background_image ?? ""}
                                    .label=${localize("editor.fields.background_image_entity")}
                                    .valueRenderer=${(v) => this._entityValueRenderer(v)}
                                    .rowRenderer=${(item) => this._entityRowRenderer(item)}
                                    .getItems=${this._getEntityItems(["camera", "image"])}
                                    @value-changed=${(e) =>
                                      this._updateConfig("background_image", e.detail.value)}
                                    allow-custom-value
                                  ></ha-generic-picker>
                                `
                          }
                        </div>
                        <div class="field-actions">
                          ${this._renderTemplateToggle(
                            "background_image",
                            this._config.background_image,
                            (v) => this._updateConfig("background_image", v)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                `
          }
          <div class="form-row form-row-multi-column" style="${!this._config.background_image ? "opacity: 0.4; pointer-events: none;" : ""}">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${localize("editor.fields.background_fit")}"
                .disabled=${!this._config.background_image}
                .selector=${{
                  select: {
                    mode: "dropdown",
                    options: [
                      {
                        value: "cover",
                        label: (localize("editor.background_fit.cover") || "Cover") + " (default)",
                      },
                      {
                        value: "contain",
                        label: localize("editor.background_fit.contain") || "Contain",
                      },
                      { value: "fill", label: localize("editor.background_fit.fill") || "Fill" },
                      {
                        value: "scale-down",
                        label: localize("editor.background_fit.scale-down") || "Scale Down",
                      },
                      { value: "none", label: localize("editor.background_fit.none") || "None" },
                    ],
                  },
                }}
                .value=${this._config.background_fit ?? "cover"}
                @value-changed=${(e) => {
                  const value = e.detail.value;
                  this._updateConfig("background_fit", value === "cover" ? undefined : value);
                }}
              ></ha-selector>
            </div>
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${localize("editor.fields.background_position")}"
                .disabled=${!this._config.background_image}
                .selector=${{
                  select: {
                    mode: "dropdown",
                    options: [
                      {
                        value: "center center",
                        label:
                          (localize("editor.background_position.center") || "Center") +
                          " (default)",
                      },
                      {
                        value: "top center",
                        label: localize("editor.background_position.top") || "Top",
                      },
                      {
                        value: "bottom center",
                        label: localize("editor.background_position.bottom") || "Bottom",
                      },
                      {
                        value: "center left",
                        label: localize("editor.background_position.center left") || "Center Left",
                      },
                      {
                        value: "center right",
                        label:
                          localize("editor.background_position.center right") || "Center Right",
                      },
                      {
                        value: "top left",
                        label: localize("editor.background_position.top left") || "Top Left",
                      },
                      {
                        value: "top right",
                        label: localize("editor.background_position.top right") || "Top Right",
                      },
                      {
                        value: "bottom left",
                        label: localize("editor.background_position.bottom left") || "Bottom Left",
                      },
                      {
                        value: "bottom right",
                        label:
                          localize("editor.background_position.bottom right") || "Bottom Right",
                      },
                    ],
                  },
                }}
                .value=${this._config.background_position ?? "center center"}
                @value-changed=${(e) => {
                  const value = e.detail.value;
                  this._updateConfig(
                    "background_position",
                    value === "center center" ? undefined : value
                  );
                }}
              ></ha-selector>
            </div>
          </div>


        </div>
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize("editor.sections.artwork.idle.title")}</div>
            <div class="section-description">${localize("editor.sections.artwork.idle.description")}</div>
          </div>
          ${
            this._isTemplateMode("idle_image", this._config.idle_image)
              ? html`
                  <div class="form-row">
                    <div class="editor-field-wrapper">
                      <div class="grow-children" style="flex-direction: column;">
                        <span class="form-label"
                          >${localize("editor.fields.idle_image_entity")}</span
                        >
                        <ha-code-editor
                          lint
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          label="${localize("editor.sections.artwork.idle.title")}"
                          .value=${this._config.idle_image ?? ""}
                          @value-changed=${(e) => this._updateConfig("idle_image", e.detail.value)}
                        ></ha-code-editor>
                      </div>
                      <div class="field-actions">
                        ${this._renderTemplateToggle("idle_image", this._config.idle_image, (v) =>
                          this._updateConfig("idle_image", v)
                        )}
                      </div>
                    </div>
                  </div>
                `
              : html`
                  <div class="form-row form-row-multi-column">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                      <ha-switch
                        id="idle-image-url-toggle"
                        .checked=${
                          this._useIdleImageUrl ?? this._looksLikeUrlOrPath(this._config.idle_image)
                        }
                        @change=${(e) => {
                          this._useIdleImageUrl = e.target.checked;
                          this._updateConfig("idle_image", "");
                        }}
                      ></ha-switch>
                      <label for="idle-image-url-toggle"
                        >${localize("editor.labels.use_url_path")}</label
                      >
                    </div>
                    <div style="flex: 2; display: flex; align-items: center; gap: 8px;">
                      <div class="editor-field-wrapper">
                        <div class="grow-children">
                          ${
                            this._useIdleImageUrl
                              ? html`
                                  <ha-selector
                                    .hass=${this.hass}
                                    class="full-width"
                                    .selector=${{ text: {} }}
                                    .value=${this._config.idle_image ?? ""}
                                    @value-changed=${(e) =>
                                      this._updateConfig("idle_image", e.detail.value)}
                                    .label=${localize("editor.fields.image_url")}
                                    placeholder="https://... or /local/..."
                                    helper="${localize("editor.subtitles.image_url_helper")}"
                                  ></ha-selector>
                                `
                              : html`
                                  <ha-generic-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .value=${this._config.idle_image ?? ""}
                                    .label=${localize("editor.fields.idle_image_entity")}
                                    .valueRenderer=${(v) => this._entityValueRenderer(v)}
                                    .rowRenderer=${(item) => this._entityRowRenderer(item)}
                                    .getItems=${this._getEntityItems(["camera", "image"])}
                                    @value-changed=${(e) =>
                                      this._updateConfig("idle_image", e.detail.value)}
                                    allow-custom-value
                                  ></ha-generic-picker>
                                `
                          }
                        </div>
                        <div class="field-actions">
                          ${this._renderTemplateToggle("idle_image", this._config.idle_image, (v) =>
                            this._updateConfig("idle_image", v)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                `
          }
          <div class="form-row form-row-multi-column" style="${!this._config.idle_image ? "opacity: 0.4; pointer-events: none;" : ""}">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="show-idle-artwork-toggle"
                .checked=${this._config.show_idle_artwork_when_not_playing === true}
                .disabled=${!this._config.idle_image}
                @change=${(e) => this._updateConfig("show_idle_artwork_when_not_playing", e.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="show-idle-artwork-toggle" style="font-weight: 500;">${localize("editor.labels.show_idle_artwork_when_not_playing")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${localize("editor.subtitles.show_idle_artwork_when_not_playing")}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize("editor.sections.artwork.overrides.title")}</div>
            <div class="section-description">${localize("editor.sections.artwork.overrides.description")}</div>
          </div>
          <yamp-sortable @item-moved=${(e) => this._onArtworkMoved(e)}>
            <div class="sortable-container">
              ${
                overrides.length
                  ? overrides.map(
                      (rule, idx) => html`
                        <div class="action-row-inner sortable-item artwork-row">
                          <div class="handle action-handle">
                            <ha-icon icon="mdi:drag"></ha-icon>
                          </div>
                          <div class="artwork-fields">
                            <ha-selector
                              .hass=${this.hass}
                              class="full-width"
                              label="${localize("editor.fields.match_field")}"
                              .required=${true}
                              .selector=${{ select: { mode: "dropdown", options: matchOptions } }}
                              .value=${rule.match_type ?? "media_title"}
                              @value-changed=${(e) =>
                                this._onArtworkMatchTypeChange(idx, e.detail.value)}
                            ></ha-selector>
                            ${
                              rule.match_type === "missing_art"
                                ? html`
                                    <div class="config-subtitle small">
                                      ${localize("editor.descriptions.missing_art_match")}
                                    </div>
                                  `
                                : rule.match_type === "idle_image"
                                  ? html`
                                      <div class="config-subtitle small">
                                        ${localize("editor.descriptions.idle_image_match")}
                                      </div>
                                    `
                                  : rule.match_type === "entity_id"
                                    ? html`
                                        <ha-generic-picker
                                          class="full-width"
                                          .hass=${this.hass}
                                          .value=${rule.match_value ?? ""}
                                          .label=${localize("editor.fields.match_entity")}
                                          .required=${true}
                                          .valueRenderer=${(v) => this._entityValueRenderer(v)}
                                          .rowRenderer=${(item) => this._entityRowRenderer(item)}
                                          .getItems=${this._getEntityItems(["media_player"])}
                                          @value-changed=${(e) =>
                                            this._onArtworkMatchValueChange(idx, e.detail.value)}
                                          allow-custom-value
                                        ></ha-generic-picker>
                                      `
                                    : rule.match_type === "aspect_ratio"
                                      ? html`
                                          <div
                                            style="display: flex; flex-direction: column; width: 100%;"
                                          >
                                            ${(() => {
                                              const entities = [];
                                              if (this._config?.entity)
                                                entities.push(this._config.entity);
                                              if (
                                                this._config?.entities &&
                                                Array.isArray(this._config.entities)
                                              ) {
                                                for (const e of this._config.entities) {
                                                  const id =
                                                    typeof e === "string"
                                                      ? e
                                                      : e.entity || e.entity_id;
                                                  if (id && !entities.includes(id))
                                                    entities.push(id);
                                                }
                                              }
                                              if (entities.length > 1) {
                                                return html`
                                                  <select
                                                    style="width: 100%; padding: 8px 16px; border-radius: 4px; border: 1px solid var(--divider-color, #ccc); background: var(--mdc-text-field-fill-color, var(--secondary-background-color, rgba(127,127,127,0.05))); color: var(--primary-text-color, #000); font-family: inherit; font-size: 14px; margin-bottom: 8px; outline: none;"
                                                    @change=${(e) => {
                                                      const selectedEntity = e.target.value;
                                                      if (selectedEntity) {
                                                        this._setCurrentAspectRatioForMatch(
                                                          idx,
                                                          selectedEntity
                                                        );
                                                        e.target.selectedIndex = 0;
                                                      }
                                                    }}
                                                  >
                                                    <option value="" disabled selected>
                                                      Get current ratio from...
                                                    </option>
                                                    ${entities.map((entId) => {
                                                      const stateObj = this.hass.states[entId];
                                                      const hasPic =
                                                        stateObj?.attributes?.entity_picture ||
                                                        stateObj?.attributes
                                                          ?.entity_picture_local ||
                                                        stateObj?.attributes?.album_art;
                                                      const name = getEntityName(
                                                        this.hass,
                                                        stateObj || entId
                                                      );
                                                      const ratio =
                                                        this._entityRatios &&
                                                        this._entityRatios[entId];
                                                      const ratioText = this._formatRatio(ratio);
                                                      return html`<option
                                                        value="${entId}"
                                                        ?disabled=${!hasPic}
                                                      >
                                                        ${name}${ratioText}
                                                      </option>`;
                                                    })}
                                                  </select>
                                                `;
                                              }
                                              return nothing;
                                            })()}
                                            <div style="display: flex; width: 100%;">
                                              <ha-selector
                                                .hass=${this.hass}
                                                style="flex: 1;"
                                                .selector=${{ text: {} }}
                                                label="${localize("editor.fields.match_value")}"
                                                .required=${true}
                                                .value=${rule.match_value ?? ""}
                                                @value-changed=${(e) => this._onArtworkMatchValueChange(idx, e.detail.value)}
                                              ></ha-selector>
                                              ${(() => {
                                                const entities = [];
                                                if (this._config?.entity)
                                                  entities.push(this._config.entity);
                                                if (
                                                  this._config?.entities &&
                                                  Array.isArray(this._config.entities)
                                                ) {
                                                  for (const e of this._config.entities) {
                                                    const id =
                                                      typeof e === "string"
                                                        ? e
                                                        : e.entity || e.entity_id;
                                                    if (id && !entities.includes(id))
                                                      entities.push(id);
                                                  }
                                                }
                                                if (entities.length <= 1) {
                                                  return html`
                                                    <ha-icon-button
                                                      style="margin-left: 8px;"
                                                      title="get current"
                                                      @click=${() => this._setCurrentAspectRatioForMatch(idx)}
                                                    >
                                                      <ha-icon icon="mdi:target"></ha-icon>
                                                    </ha-icon-button>
                                                  `;
                                                }
                                                return nothing;
                                              })()}
                                            </div>
                                          </div>
                                        `
                                      : html`
                                          <ha-selector
                                            .hass=${this.hass}
                                            class="full-width"
                                            .selector=${{ text: {} }}
                                            label="${localize("editor.fields.match_value")}"
                                            .required=${true}
                                            .value=${rule.match_value ?? ""}
                                            @value-changed=${(e) =>
                                              this._onArtworkMatchValueChange(idx, e.detail.value)}
                                          ></ha-selector>
                                        `
                            }
                            ${
                              rule.match_type === "idle_image"
                                ? nothing
                                : html`
                                    <div class="editor-field-wrapper">
                                      ${
                                        this._isTemplateMode(
                                          `artwork_image_url_${idx}`,
                                          rule.image_url
                                        )
                                          ? html`
                                              <div
                                                class="grow-children"
                                                style="flex-direction: column;"
                                              >
                                                <span class="form-label"
                                                  >${rule.match_type === "missing_art" ? localize("editor.fields.fallback_image_url") : localize("editor.fields.image_url").replaceAll("*", "")}</span
                                                >
                                                <ha-code-editor
                                                  lint
                                                  .hass=${this.hass}
                                                  mode="jinja2"
                                                  autocomplete-entities
                                                  label=${
                                                    rule.match_type === "missing_art"
                                                      ? localize("editor.fields.fallback_image_url")
                                                      : localize("editor.fields.image_url")
                                                  }
                                                  .value=${rule.image_url ?? ""}
                                                  @value-changed=${(e) =>
                                                    this._onArtworkImageUrlChange(
                                                      idx,
                                                      e.detail.value
                                                    )}
                                                ></ha-code-editor>
                                              </div>
                                              <div class="field-actions">
                                                ${this._renderTemplateToggle(
                                                  `artwork_image_url_${idx}`,
                                                  rule.image_url,
                                                  (v) => this._onArtworkImageUrlChange(idx, v)
                                                )}
                                              </div>
                                            `
                                          : html`
                                              <div class="grow-children">
                                                <ha-selector
                                                  .hass=${this.hass}
                                                  class="full-width"
                                                  .selector=${{ text: {} }}
                                                  label=${
                                                    rule.match_type === "missing_art"
                                                      ? localize("editor.fields.fallback_image_url")
                                                      : localize("editor.fields.image_url")
                                                  }
                                                  .required=${false}
                                                  .value=${rule.image_url ?? ""}
                                                  @value-changed=${(e) =>
                                                    this._onArtworkImageUrlChange(
                                                      idx,
                                                      e.detail.value
                                                    )}
                                                ></ha-selector>
                                              </div>
                                              <div class="field-actions">
                                                ${this._renderTemplateToggle(
                                                  `artwork_image_url_${idx}`,
                                                  rule.image_url,
                                                  (v) => this._onArtworkImageUrlChange(idx, v)
                                                )}
                                              </div>
                                            `
                                      }
                                    </div>
                                  `
                            }
                            <div class="form-row-multi-column" style="align-items:flex-start;">
                              <div class="grow-children" style="flex:1; min-width: 100px;">
                                <ha-selector
                                  .hass=${this.hass}
                                  class="full-width"
                                  label="${localize("editor.fields.size_percent")}"
                                  .required=${false}
                                  .selector=${{ number: { min: 1, max: 100, mode: "box" } }}
                                  .value=${rule.size_percentage ?? ""}
                                  @value-changed=${(e) =>
                                    this._onArtworkSizePercentageChange(idx, e.detail.value)}
                                ></ha-selector>
                              </div>
                              <div class="grow-children" style="flex:1.5; min-width: 120px;">
                                <ha-selector
                                  .hass=${this.hass}
                                  class="full-width"
                                  label="${localize("editor.fields.object_fit")}"
                                  .required=${false}
                                  .selector=${{
                                    select: {
                                      mode: "dropdown",
                                      options: [
                                        {
                                          value: "default",
                                          label: localize("editor.artwork_fit.default"),
                                        },
                                        {
                                          value: "cover",
                                          label: localize("editor.artwork_fit.cover"),
                                        },
                                        {
                                          value: "contain",
                                          label: localize("editor.artwork_fit.contain"),
                                        },
                                        {
                                          value: "fill",
                                          label: localize("editor.artwork_fit.fill"),
                                        },
                                        {
                                          value: "scale-down",
                                          label: localize("editor.artwork_fit.scale-down"),
                                        },
                                        {
                                          value: "scaled-contain",
                                          label: localize("editor.artwork_fit.scaled-contain"),
                                        },
                                        {
                                          value: "scaled-contain-alternate",
                                          label: localize(
                                            "editor.artwork_fit.scaled-contain-alternate"
                                          ),
                                        },
                                        {
                                          value: "none",
                                          label: localize("editor.artwork_fit.none"),
                                        },
                                        {
                                          value: "no_artwork",
                                          label: localize("editor.fields.no_artwork_option"),
                                        },
                                      ],
                                    },
                                  }}
                                  .value=${rule.object_fit || "default"}
                                  @value-changed=${(e) =>
                                    this._onArtworkObjectFitChange(idx, e.detail.value)}
                                ></ha-selector>
                              </div>
                              <div class="grow-children" style="flex:1.5; min-width: 120px;">
                                <ha-selector
                                  .hass=${this.hass}
                                  class="full-width"
                                  label="${localize("editor.fields.artwork_position")}"
                                  .required=${false}
                                  .selector=${{
                                    select: {
                                      mode: "dropdown",
                                      options: [
                                        {
                                          value: "default",
                                          label:
                                            localize("editor.artwork_position.default") || "Global",
                                        },
                                        {
                                          value: "top center",
                                          label: localize("editor.artwork_position.top") || "Top",
                                        },
                                        {
                                          value: "center center",
                                          label:
                                            localize("editor.artwork_position.center") || "Center",
                                        },
                                        {
                                          value: "bottom center",
                                          label:
                                            localize("editor.artwork_position.bottom") || "Bottom",
                                        },
                                      ],
                                    },
                                  }}
                                  .value=${rule.object_position || "default"}
                                  @value-changed=${(e) => {
                                    const newList = [...this._artworkOverrides];
                                    newList[idx] = {
                                      ...newList[idx],
                                      object_position: e.detail.value,
                                    };
                                    this._writeArtworkOverrides(newList);
                                  }}
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
                      `
                    )
                  : html`<div class="config-subtitle" style="padding:12px 0;text-align:center;">
                      ${localize("editor.subtitles.no_artwork_overrides")}
                    </div>`
              }
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="${localize("editor.titles.add_artwork_override")}"
              @click=${this._addArtworkOverride}
            ></ha-icon>
          </div>
        </div>
        </div>

      `;
}
