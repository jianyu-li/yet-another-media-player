import { html } from "lit";
import { localize } from "../../localize/localize.js";

/**
 * Render the Behavior tab in the YAMP card editor.
 * @this {import("../../yamp-editor.js").YetAnotherMediaPlayerEditor}
 */
export function renderBehaviorTab() {
  return html`
    <div class="config-section">
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "default", label: localize("editor.card_type_options.default") },
                { value: "search", label: localize("editor.card_type_options.search") },
                {
                  value: "group_players",
                  label: localize("editor.card_type_options.group_players"),
                },
                { value: "up_next", label: localize("editor.card_type_options.up_next") },
                {
                  value: "remote_control",
                  label: localize("editor.card_type_options.remote_control"),
                },
              ],
            },
          }}
          .value=${this._config.card_type ?? "default"}
          label="${localize("editor.fields.card_type")}"
          @value-changed=${(e) => this._updateConfig("card_type", e.detail.value)}
        ></ha-selector>
        <div class="config-subtitle">${localize("editor.subtitles.card_type")}</div>
      </div>
    </div>

    <div class="config-section">
      <div class="section-header">
        <div class="section-title">${localize("editor.sections.behavior.idle_chips.title")}</div>
        <div class="section-description">
          ${localize("editor.sections.behavior.idle_chips.description")}
        </div>
      </div>
      <div class="form-row form-row-multi-column">
        <div class="grow-children">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              number: { min: 0, step: 1000, unit_of_measurement: "ms", mode: "box" },
            }}
            .value=${this._config.idle_timeout_ms ?? 60000}
            label="${localize("editor.fields.idle_timeout")}"
            @value-changed=${(e) => this._updateConfig("idle_timeout_ms", e.detail.value)}
          ></ha-selector>
          <div class="config-subtitle">${localize("editor.subtitles.idle_timeout")}</div>
        </div>
        <ha-icon
          class="icon-button"
          icon="mdi:restore"
          title="${localize("common.reset_default")}"
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
                { value: "auto", label: "Auto" },
                { value: "always", label: "Always" },
                { value: "in_menu", label: "In Menu" },
                { value: "in_menu_on_idle", label: "In Menu on Idle" },
              ],
            },
          }}
          .value=${this._config.show_chip_row ?? "auto"}
          label="${localize("editor.fields.show_chip_row")}"
          @value-changed=${(e) => this._updateConfig("show_chip_row", e.detail.value)}
        ></ha-selector>
        <div class="config-subtitle">${localize("editor.subtitles.show_chip_row")}</div>
      </div>
      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="dim-chips-on-idle-toggle"
            .checked=${this._config.dim_chips_on_idle ?? true}
            @change=${(e) => this._updateConfig("dim_chips_on_idle", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.dim_chips")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.dim_chips")}</div>
      </div>
    </div>

    <div class="config-section">
      <div class="section-header">
        <div class="section-title">
          ${localize("editor.sections.behavior.interactions_search.title")}
        </div>
        <div class="section-description">
          ${localize("editor.sections.behavior.interactions_search.description")}
        </div>
      </div>
      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="always-show-quick-group-toggle"
            .checked=${this._config.always_show_quick_group ?? false}
            @change=${(e) => this._updateConfig("always_show_quick_group", e.target.checked)}
          ></ha-switch>
          <label for="always-show-quick-group-toggle"
            >${localize("editor.labels.always_show_group")}</label
          >
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.always_show_group")}</div>
      </div>
      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="hold-to-pin-toggle"
            .checked=${this._config.hold_to_pin ?? false}
            @change=${(e) => this._updateConfig("hold_to_pin", e.target.checked)}
          ></ha-switch>
          <label for="hold-to-pin-toggle">${localize("editor.labels.hold_to_pin")}</label>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.hold_to_pin")}</div>
      </div>
      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="show-volume-overlay-toggle"
            .checked=${this._config.show_volume_overlay ?? false}
            @change=${(e) => this._updateConfig("show_volume_overlay", e.target.checked)}
          ></ha-switch>
          <label for="show-volume-overlay-toggle"
            >${localize("editor.labels.show_volume_overlay")}</label
          >
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.show_volume_overlay")}</div>
      </div>
      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            .checked=${this._config.disable_autofocus ?? false}
            @change=${(e) => this._updateConfig("disable_autofocus", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.disable_autofocus")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.disable_autofocus")}</div>
      </div>
      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="default-search-favorites-toggle"
            .checked=${this._config.default_search_favorites ?? false}
            @change=${(e) => this._updateConfig("default_search_favorites", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.default_search_favorites")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.default_search_favorites")}</div>
      </div>

      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            .checked=${this._config.keep_filters_on_search ?? false}
            @change=${(e) => this._updateConfig("keep_filters_on_search", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.keep_filters")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.search_within_filter")}</div>
      </div>

      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="dismiss-search-on-play-toggle"
            .checked=${this._config.dismiss_search_on_play ?? true}
            @change=${(e) => this._updateConfig("dismiss_search_on_play", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.dismiss_on_play")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.close_search_on_play")}</div>
      </div>

      <div
        data-search-keys="always_collapsed expand_on_search pin_search_headers"
        class="form-row form-row-multi-column"
      >
        <div
          style="${
            this._config.entities?.length === 1 &&
            this._config.always_collapsed === true &&
            this._config.expand_on_search !== true
              ? "opacity: 0.5;"
              : ""
          }"
          title="${
            this._config.entities?.length === 1 &&
            this._config.always_collapsed === true &&
            this._config.expand_on_search !== true
              ? "Not available with one entity in Always Collapsed mode unless Expand on Search is enabled"
              : ""
          }"
        >
          <ha-switch
            id="pin-search-headers-toggle"
            .checked=${this._config.pin_search_headers ?? false}
            @change=${(e) => this._updateConfig("pin_search_headers", e.target.checked)}
            .disabled=${
              this._config.entities?.length === 1 &&
              this._config.always_collapsed === true &&
              this._config.expand_on_search !== true
            }
          ></ha-switch>
          <span>${localize("editor.labels.pin_headers")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.pin_search_headers")}</div>
      </div>

      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="hide-search-headers-on-idle-toggle"
            .checked=${this._config.hide_search_headers_on_idle ?? false}
            @change=${(e) => this._updateConfig("hide_search_headers_on_idle", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.hide_search_headers_on_idle")}</span>
        </div>
        <div class="config-subtitle">
          ${localize("editor.subtitles.hide_search_headers_on_idle")}
        </div>
      </div>

      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="disable-mass-queue-toggle"
            .checked=${this._config.disable_mass_queue ?? false}
            @change=${(e) => this._updateConfig("disable_mass_queue", e.target.checked)}
          ></ha-switch>
          <span>${localize("editor.labels.disable_mass")}</span>
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.disable_mass")}</div>
      </div>
      <div data-search-keys="hide_reorder_progress" class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="hide-reorder-progress-toggle"
            .checked=${this._config.hide_reorder_progress ?? false}
            @change=${(e) => this._updateConfig("hide_reorder_progress", e.target.checked)}
          ></ha-switch>
          <label for="hide-reorder-progress-toggle"
            >${localize("editor.labels.hide_reorder_progress_toggle")}</label
          >
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.hide_reorder_progress")}</div>
      </div>

      <div data-search-keys="search_results_limit" class="form-row form-row-multi-column">
        <div class="grow-children number-input-with-note">
          <ha-selector
            .selector=${{ number: { min: 0, max: 1000, step: 1, mode: "box" } }}
            .value=${this._config.search_results_limit ?? 20}
            label="${localize("editor.fields.search_limit")}"
            helper="${localize("editor.subtitles.search_limit_full")}"
            @value-changed=${(e) => this._updateConfig("search_results_limit", e.detail.value)}
          ></ha-selector>
        </div>
        <ha-icon
          class="icon-button"
          id="search-limit-reset"
          icon="mdi:restore"
          title="${localize("common.reset_default")}"
          @click=${() => this._updateConfig("search_results_limit", 20)}
        ></ha-icon>
      </div>

      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "all", label: localize("search.filters.all") },
                { value: "artist", label: localize("search.filters.artist") },
                { value: "album", label: localize("search.filters.album") },
                { value: "track", label: localize("search.filters.track") },
                { value: "playlist", label: localize("search.filters.playlist") },
                { value: "radio", label: localize("search.filters.radio") },
                { value: "podcast", label: localize("search.filters.podcast") },
                { value: "audiobook", label: localize("search.filters.audiobook") },
              ],
            },
          }}
          .value=${this._config.default_search_filter ?? "all"}
          label="${localize("editor.labels.default_search_filter")}"
          helper="${localize("editor.subtitles.default_search_filter_full")}"
          @value-changed=${(e) => this._updateConfig("default_search_filter", e.detail.value)}
        ></ha-selector>
      </div>

      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "default", label: "Default" },
                { value: "name", label: "Name (A→Z)" },
                { value: "name_desc", label: "Name (Z→A)" },
                { value: "sort_name", label: "Sort Name (A→Z)" },
                { value: "sort_name_desc", label: "Sort Name (Z→A)" },
                { value: "timestamp_added", label: "Date Added (Oldest)" },
                { value: "timestamp_added_desc", label: "Date Added (Newest)" },
                { value: "last_played", label: "Last Played (Oldest)" },
                { value: "last_played_desc", label: "Last Played (Recent)" },
                { value: "play_count", label: "Play Count (Low→High)" },
                { value: "play_count_desc", label: "Play Count (High→Low)" },
                { value: "year", label: "Year (Oldest)" },
                { value: "year_desc", label: "Year (Newest)" },
                { value: "position", label: "Position (Asc)" },
                { value: "position_desc", label: "Position (Desc)" },
                { value: "artist_name", label: "Artist (A→Z)" },
                { value: "artist_name_desc", label: "Artist (Z→A)" },
                { value: "random", label: "Random" },
                { value: "random_play_count", label: "Random + Least Played" },
              ],
            },
          }}
          .value=${this._config.search_results_sort ?? "default"}
          label="${localize("editor.fields.result_sorting")}"
          helper="${localize("editor.subtitles.result_sorting_full")}"
          @value-changed=${(e) => this._updateConfig("search_results_sort", e.detail.value)}
        ></ha-selector>
      </div>
    </div>

    <div class="config-section">
      <div class="section-header">
        <div class="section-title">${localize("editor.sections.behavior.lyrics.title")}</div>
        <div class="section-description">
          ${localize("editor.sections.behavior.lyrics.description")}
        </div>
      </div>
      <div class="form-row form-row-multi-column">
        <div>
          <ha-switch
            id="always-show-lyrics-toggle"
            .checked=${this._config.always_show_lyrics ?? false}
            @change=${(e) => this._updateConfig("always_show_lyrics", e.target.checked)}
          ></ha-switch>
          <label for="always-show-lyrics-toggle"
            >${localize("editor.labels.always_show_lyrics")}</label
          >
        </div>
        <div class="config-subtitle">${localize("editor.subtitles.always_show_lyrics")}</div>
      </div>
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "default", label: localize("lyrics_modes.default") },
                { value: "scroll", label: localize("lyrics_modes.scroll") },
                { value: "text", label: localize("lyrics_modes.text") },
              ],
            },
          }}
          .value=${this._config.lyrics_mode ?? "default"}
          label="${localize("editor.labels.lyrics_mode")}"
          @value-changed=${(e) => this._updateConfig("lyrics_mode", e.detail.value)}
        ></ha-selector>
        <ha-selector
          .hass=${this.hass}
          .selector=${{
            select: {
              mode: "dropdown",
              options: [
                { value: "mass_lrclib", label: localize("lyrics_sources.mass_lrclib") },
                { value: "mass", label: localize("lyrics_sources.mass") },
                { value: "lrclib", label: localize("lyrics_sources.lrclib") },
                { value: "lrclib_mass", label: localize("lyrics_sources.lrclib_mass") },
              ],
            },
          }}
          .value=${this._config.lyrics_source ?? "mass_lrclib"}
          label="${localize("editor.labels.lyrics_source")}"
          @value-changed=${(e) => this._updateConfig("lyrics_source", e.detail.value)}
        ></ha-selector>
        <div class="config-subtitle">${localize("editor.subtitles.lyrics_source")}</div>
      </div>
      <div class="form-row form-row-multi-column">
        <div class="grow-children">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              number: { min: -5, max: 5, step: 0.1, unit_of_measurement: "s", mode: "box" },
            }}
            .value=${this._config.lyrics_pre_roll ?? 0}
            label="${localize("editor.labels.lyrics_pre_roll")}"
            helper="${localize("editor.subtitles.lyrics_pre_roll")}"
            @value-changed=${(e) => this._updateConfig("lyrics_pre_roll", e.detail.value)}
          ></ha-selector>
        </div>
        <ha-icon
          class="icon-button"
          icon="mdi:restore"
          title="${localize("common.reset_default")}"
          @click=${() => this._updateConfig("lyrics_pre_roll", 0)}
        ></ha-icon>
      </div>
    </div>
  `;
}
