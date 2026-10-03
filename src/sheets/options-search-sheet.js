import { html, nothing } from "lit";
import { virtualize } from "@lit-labs/virtualizer/virtualize.js";
import { localize } from "../localize/localize.js";
import { renderSearchResultItem } from "../search-sheet.js";
import { isValidArtworkUrl } from "../yamp-utils.js";
import { yampGrid } from "../yamp-grid-layout.js";

/**
 * Render the sub-filters bar within options search (favorites, recents, queue, radio, sort).
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 * @param {boolean} showSearchHeaders
 */
export function renderSearchSubFilters(showSearchHeaders) {
  if (!showSearchHeaders || !this._usingMusicAssistant || this._searchLoading) return nothing;

  return html`
    <div
      class="search-sub-filters"
      style="display: flex; align-items: center; margin-bottom: 2px; margin-top: 4px; padding-left: 3px; width: 100%; gap: 8px;"
    >
      <div style="display: flex; align-items: center; flex-wrap: wrap; flex: 1; min-width: 0;">
        ${
          this._cardType !== "up_next"
            ? html`
                <button
                  class="button${
                    this._initialFavoritesLoaded || this._favoritesFilterActive ? " active" : ""
                  }"
                  style="
              border: none;
              font-size: 1.2em;
              cursor: ${this._searchAttempted ? "pointer" : "default"};
              padding: 4px 8px;
              border-radius: 50%;
              transition: all 0.2s ease;
              margin-right: 8px;
              display: flex;
              align-items: center;
              opacity: ${this._searchAttempted ? "1" : "0.5"};
            "
                  @click=${
                    this._searchAttempted
                      ? () => {
                          this._toggleFavoritesFilter();
                        }
                      : () => {}
                  }
                  title="${localize("search.favorites")}"
                >
                  <ha-icon
                    .icon=${
                      this._initialFavoritesLoaded || this._favoritesFilterActive
                        ? "mdi:cards-heart"
                        : "mdi:cards-heart-outline"
                    }
                  ></ha-icon>
                  ${
                    this._initialFavoritesLoaded || this._favoritesFilterActive
                      ? html`
                          <span
                            style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;"
                          >
                            ${localize("search.favorites")}
                          </span>
                        `
                      : nothing
                  }
                </button>
                <button
                  class="button${this._recentlyPlayedFilterActive ? " active" : ""}"
                  style="
              border: none;
              font-size: 1.2em;
              cursor: ${this._searchAttempted ? "pointer" : "default"};
              padding: 4px 8px;
              border-radius: 50%;
              transition: all 0.2s ease;
              margin-right: 8px;
              display: flex;
              align-items: center;
              opacity: ${this._searchAttempted ? "1" : "0.5"};
            "
                  @click=${
                    this._searchAttempted
                      ? () => {
                          this._toggleRecentlyPlayedFilter();
                        }
                      : () => {}
                  }
                  title="${localize("search.recently_played")}"
                >
                  <ha-icon
                    .icon=${this._recentlyPlayedFilterActive ? "mdi:clock" : "mdi:clock-outline"}
                  ></ha-icon>
                  ${
                    this._recentlyPlayedFilterActive
                      ? html`
                          <span
                            style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;"
                          >
                            ${localize("search.recently_played")}
                          </span>
                        `
                      : nothing
                  }
                </button>
                ${
                  this._isMusicAssistantEntity()
                    ? html`
                        <button
                          class="button${this._upcomingFilterActive ? " active" : ""}"
                          style="
                border: none;
                font-size: 1.2em;
                cursor: ${this._searchAttempted ? "pointer" : "default"};
                padding: 4px 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
                margin-right: 8px;
                display: flex;
                align-items: center;
                opacity: ${this._searchAttempted ? "1" : "0.5"};
              "
                          @click=${
                            this._searchAttempted
                              ? () => {
                                  this._toggleUpcomingFilter();
                                }
                              : () => {}
                          }
                          title="${localize("search.next_up")}"
                        >
                          <ha-icon
                            .icon=${
                              this._upcomingFilterActive
                                ? "mdi:playlist-music"
                                : "mdi:playlist-music-outline"
                            }
                          ></ha-icon>
                          ${
                            this._upcomingFilterActive
                              ? html`
                                  <span
                                    style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;"
                                  >
                                    ${localize("search.next_up")}
                                  </span>
                                `
                              : nothing
                          }
                        </button>
                        ${
                          this._hasMassQueueIntegration
                            ? html`
                                <button
                                  class="button${this._recommendationsFilterActive ? " active" : ""}"
                                  style="
                  border: none;
                  font-size: 1.2em;
                  cursor: ${this._searchAttempted ? "pointer" : "default"};
                  padding: 4px 8px;
                  border-radius: 50%;
                  transition: all 0.2s ease;
                  margin-right: 8px;
                  display: flex;
                  align-items: center;
                  opacity: ${this._searchAttempted ? "1" : "0.5"};
                "
                                  @click=${
                                    this._searchAttempted
                                      ? () => {
                                          this._toggleRecommendationsFilter();
                                        }
                                      : () => {}
                                  }
                                  title="${localize("search.recommendations")}"
                                >
                                  <ha-icon
                                    .icon=${
                                      this._recommendationsFilterActive
                                        ? "mdi:creation"
                                        : "mdi:creation-outline"
                                    }
                                  ></ha-icon>
                                  ${
                                    this._recommendationsFilterActive
                                      ? html`
                                          <span
                                            style="margin-left:6px;font-size:0.81em;font-weight:600;white-space:nowrap;"
                                          >
                                            ${localize("search.recommendations")}
                                          </span>
                                        `
                                      : nothing
                                  }
                                </button>
                              `
                            : nothing
                        }
                      `
                    : nothing
                }
                <button
                  class="radio-mode-button${this._radioModeActive ? " active" : ""}"
                  @click=${() => this._toggleRadioMode()}
                  title="${localize("search.radio_mode")}"
                >
                  <ha-icon .icon=${this._radioModeActive ? "mdi:radio" : "mdi:radio-off"}></ha-icon>
                </button>
                ${
                  this._shouldShowSearchSortToggle()
                    ? html`
                        <button
                          class="button"
                          style="
                border: none;
                font-size: 1.2em;
                cursor: ${this._searchAttempted ? "pointer" : "default"};
                padding: 4px 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
                margin-right: 8px;
                display: flex;
                align-items: center;
                opacity: ${this._searchAttempted ? "1" : "0.5"};
              "
                          @click=${
                            this._searchAttempted
                              ? () => this._toggleSearchResultsSortDirection()
                              : () => {}
                          }
                          title=${this._getSearchSortToggleTitle()}
                        >
                          <ha-icon .icon=${this._getSearchSortToggleIcon()}></ha-icon>
                        </button>
                      `
                    : nothing
                }
              `
            : nothing
        }
        ${
          this._shouldShowSearchResultsCount()
            ? html`
                <span
                  class="search-results-count"
                  style="${
                    this._cardType === "up_next" ? "padding-top: 15px; display: inline-block;" : ""
                  }"
                >
                  ${this._getSearchResultsCountLabel()}
                </span>
              `
            : nothing
        }
      </div>
    </div>
  `;
}

/**
 * Render the embedded search UI within the options sheet.
 * @this {import("../types.d.ts").YetAnotherMediaPlayerCard}
 * @param {boolean} showSearchHeaders
 * @param {boolean} [pinSearchHeaders=false]
 */
export function renderSearchInOptions(showSearchHeaders, pinSearchHeaders = false) {
  const isPinned = pinSearchHeaders || this.config?.pin_search_headers === true;
  const currentOffset = !isPinned ? this._searchHeaderOffset || 0 : 0;
  const headerHeight = this._searchHeaderNaturalHeight || 120;
  const progress = headerHeight > 0 ? currentOffset / headerHeight : 0;
  const opacity = Math.max(0, Math.min(1, 1 - progress));
  const isRetracted =
    !isPinned &&
    (this._searchHeadersRetracted || (currentOffset >= headerHeight && headerHeight > 0));
  const panelStyle =
    !isPinned && currentOffset > 0
      ? `margin-top: -${currentOffset}px; opacity: ${opacity.toFixed(3)};${isRetracted ? " pointer-events: none;" : ""}`
      : "";
  return html`
    <div
      class="entity-options-search"
      @wheel=${(e) => this._handleSearchContainerWheel(e, pinSearchHeaders)}
      style="margin-top:${this._cardType === "up_next" ? "0" : "12px"};"
    >
      <div
        class="search-header-panel ${isRetracted ? "retracted" : ""}"
        style="${panelStyle}"
        @wheel=${(e) => this._handleHeaderWheel(e, pinSearchHeaders)}
        @touchstart=${(e) => this._handleHeaderTouchStart(e)}
        @touchmove=${(e) => this._handleHeaderTouchMove(e, pinSearchHeaders)}
        @touchend=${() => this._handleHeaderTouchEnd()}
      >
        ${
          this._searchHierarchy.length > 0
            ? html`
                <button
                  class="entity-options-item close-item"
                  @click=${() => this._goBackInSearch()}
                >
                  ${localize("common.back")}
                </button>
                <div class="entity-options-divider"></div>
              `
            : nothing
        }
        ${
          this._searchBreadcrumb
            ? html`
                <div class="entity-options-search-breadcrumb">
                  <div class="entity-options-search-breadcrumb-text">${this._searchBreadcrumb}</div>
                  ${
                    !this._isSelectionFlow
                      ? html`
                          <button
                            class="entity-options-search-breadcrumb-play"
                            @click=${() => this._playCurrentCollection()}
                            title="${localize("search.play_collection")}"
                          >
                            <ha-icon icon="mdi:play"></ha-icon>
                          </button>
                        `
                      : nothing
                  }
                </div>
              `
            : showSearchHeaders && this._cardType !== "up_next"
              ? html`<div class="entity-options-search-skeleton"></div>`
              : nothing
        }
        ${
          showSearchHeaders && this._cardType !== "up_next"
            ? html`
                <div class="entity-options-search-row">
                  <div class="search-input-wrapper">
                    <input
                      type="text"
                      id="search-input-box"
                      ?autofocus=${!this._disableSearchAutofocus}
                      class="entity-options-search-input"
                      .value=${this._searchQuery}
                      @focus=${() => {
                        if ((this._searchHeaderOffset || 0) > 0) {
                          this._updateSearchHeaderPosition(0, true);
                        }
                      }}
                      @input=${(e) => {
                        this._searchQuery = e.target.value;
                        this.requestUpdate();
                      }}
                      @keydown=${(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          this._handleSearchSubmit();
                        } else if (e.key === "Escape") {
                          e.preventDefault();
                          this._hideSearchSheetInOptions();
                        }
                      }}
                      placeholder="${localize("editor.placeholders.search")}"
                    />
                    ${
                      this._searchQuery
                        ? html`
                            <button
                              class="search-input-clear"
                              @click=${() => {
                                if (this._searchHierarchy.length > 0) {
                                  this._searchQuery = "";
                                  this.requestUpdate();
                                } else {
                                  this._showSearchSheetInOptions();
                                }
                              }}
                              title="${localize("common.clear")}"
                            >
                              <ha-icon icon="mdi:close"></ha-icon>
                            </button>
                          `
                        : nothing
                    }
                  </div>
                  <button
                    class="entity-options-item icon-only"
                    style="min-width:48px; padding: 0;"
                    @click=${() => this._handleSearchSubmit()}
                    title="${localize("common.search")}"
                    aria-label="${localize("common.search")}"
                    ?disabled=${this._searchLoading}
                  >
                    <ha-icon icon="mdi:magnify"></ha-icon>
                  </button>
                  ${
                    this._cardType !== "search" && this._cardType !== "up_next"
                      ? html`
                          <button
                            class="entity-options-item icon-only"
                            style="min-width:48px; padding: 0;"
                            title="${localize("common.cancel")}"
                            aria-label="${localize("common.cancel")}"
                            @click=${() => {
                              if (this._quickMenuInvoke) {
                                this._dismissWithAnimation();
                              } else {
                                this._hideSearchSheetInOptions();
                              }
                            }}
                          >
                            <ha-icon icon="mdi:close"></ha-icon>
                          </button>
                        `
                      : nothing
                  }
                </div>
              `
            : nothing
        }
        <!--FILTER CHIPS-->
        ${
          showSearchHeaders && this._cardType !== "up_next"
            ? (() => {
                const classes = this._getVisibleSearchFilterClasses();
                const filter = this._searchMediaClassFilter || "all";

                if (this._searchHierarchy.length > 0) return nothing;
                if (classes.length < 2 && !this._usingMusicAssistant) return nothing;

                return html`
                  <div
                    class="chip-row search-filter-chips"
                    id="search-filter-chip-row"
                    style="margin-bottom:4px; justify-content: center; align-items: center;"
                  >
                    <button
                      class="chip"
                      ?selected=${filter === "all"}
                      @click=${() => this._doSearch()}
                    >
                      ${localize("search.filters.all")}
                    </button>
                    ${classes.map(
                      (c) => html`
                        <button
                          class="chip"
                          ?selected=${filter === c}
                          @click=${() => this._doSearch(c)}
                        >
                          ${localize(`search.filters.${c}`)}
                        </button>
                      `
                    )}
                  </div>
                `;
              })()
            : nothing
        }
        ${
          this._searchLoading
            ? html`<div class="entity-options-search-loading">${localize("common.loading")}</div>`
            : nothing
        }
        ${
          this._searchError
            ? html`<div class="entity-options-search-error">${this._searchError}</div>`
            : nothing
        }
        ${this._renderSearchSubFilters(showSearchHeaders)}
      </div>

      ${(() => {
        const isQueueDragAndDrop = this._upcomingFilterActive && this._massQueueAvailable;
        const currentResults = this._getDisplaySearchResults();
        const isCard =
          this.config.search_view === "card" || this.config.search_view === "card_minimal";
        const isMinimal = this.config.search_view === "card_minimal";
        const isGridMode = this._isGridMode;

        const renderItemFn = (item) =>
          renderSearchResultItem({
            item,
            isCard,
            isMinimal,
            isGridMode,
            activeSearchRowMenuId: this._activeSearchRowMenuId,
            loadingSearchRowMenuId: this._loadingSearchRowMenuId,
            errorSearchRowMenuId: this._errorSearchRowMenuId,
            successSearchRowMenuId: this._successSearchRowMenuId,
            successSearchRowType: this._successSearchRowType,
            isSelectionFlow: this._isSelectionFlow,
            massQueueAvailable: this._massQueueAvailable,
            upcomingFilterActive: !!this._upcomingFilterActive,
            recentlyPlayedFilterActive: !!this._recentlyPlayedFilterActive,
            recommendationsFilterActive: !!this._recommendationsFilterActive,
            searchMediaClassFilter: this._searchMediaClassFilter,
            queueControlsStyle: this.config.queue_controls_style || "drag_handle",
            onPlay: (it, e) => this._playMediaFromSearch(it, e),
            onResultClick: (it, e) => this._handleSearchResultClick(it, e),
            onOptionsToggle: (it) => {
              this._activeSearchRowMenuId = it?.media_content_id || null;
              this.requestUpdate();
            },
            onPlayOption: (it, mode) => this._performSearchOptionAction(it, mode),
            onMoveUp: (it) => this._moveQueueItemUp(it.queue_item_id),
            onMoveDown: (it) => this._moveQueueItemDown(it.queue_item_id),
            onMoveNext: (it) => this._moveQueueItemNext(it.queue_item_id),
            onRemove: (it) => this._removeQueueItem(it.queue_item_id),
            isMusicAssistant: this._isMusicAssistantEntity(),
            isValidArtwork: (url) => isValidArtworkUrl(url),
            getClickTitle: (it) => this._getSearchResultClickTitle(it),
            artworkHostname: this.config?.artwork_hostname || "",
          });

        if (this._searchAttempted && currentResults.length === 0 && !this._searchLoading) {
          return html`
            <div
              class="${
                this._showSearchInSheet ? "search-sheet-results" : "entity-options-search-results"
              }"
              @wheel=${(e) => this._handleSearchResultsWheel(e, pinSearchHeaders)}
              @touchstart=${(e) => this._handleResultsTouchStart(e)}
              @touchmove=${(e) => this._handleResultsTouchMove(e, pinSearchHeaders)}
              @touchend=${() => this._handleResultsTouchEnd()}
            >
              <div class="entity-options-search-empty">${localize("common.no_results")}</div>
            </div>
          `;
        }

        if (isQueueDragAndDrop) {
          return html`
            <div
              class="${
                this._showSearchInSheet ? "search-sheet-results" : "entity-options-search-results"
              } queue-results-wrapper ${isGridMode ? "grid-mode" : ""}"
              @scroll=${(e) => this._handleSearchResultsScroll(e, pinSearchHeaders)}
              @wheel=${(e) => this._handleSearchResultsWheel(e, pinSearchHeaders)}
              @touchstart=${(e) => this._handleResultsTouchStart(e)}
              @touchmove=${(e) => this._handleResultsTouchMove(e, pinSearchHeaders)}
              @touchend=${() => this._handleResultsTouchEnd()}
              style="${
                this.config.search_view === "card" ||
                this.config.search_view === "card_minimal" ||
                isGridMode
                  ? `--search-card-columns: ${isGridMode ? 5 /* MINI_GRID_COLUMNS */ : this.config.search_card_columns || 4};`
                  : ""
              }"
            >
              <div
                class="queue-sortable-container ${
                  isCard || isGridMode ? "is-card-layout" : ""
                } ${isGridMode ? "grid-mode" : ""}"
                @pointerdown=${(e) => this._onQueueDragStart(e)}
              >
                ${currentResults.map(
                  (item, idx) => html`
                    <div class="queue-drag-wrapper" data-queue-idx="${idx}">
                      ${renderItemFn(item)}
                    </div>
                  `
                )}
              </div>
            </div>
          `;
        }

        if (
          !this._cachedSearchGridLayout ||
          this._cachedSearchGridLayoutColumns !==
            (isGridMode ? 5 /* MINI_GRID_COLUMNS */ : this.config.search_card_columns || 4) ||
          this._cachedSearchGridLayoutIsMinimal !== isMinimal ||
          this._cachedSearchGridLayoutIsGridMode !== isGridMode
        ) {
          const columns = isGridMode
            ? 5 /* MINI_GRID_COLUMNS */
            : this.config.search_card_columns || 4;
          this._cachedSearchGridLayoutColumns = columns;
          this._cachedSearchGridLayoutIsMinimal = isMinimal;
          this._cachedSearchGridLayoutIsGridMode = isGridMode;
          this._cachedSearchGridLayout = yampGrid({
            columns: columns,
            gap: isGridMode ? "0px" : "12px",
            padding: isGridMode ? "0px" : "12px",
            itemSize: isGridMode
              ? { width: 70, height: 85 }
              : isMinimal
                ? { width: 150, height: 150 }
                : { width: 150, height: 244 },
          });
        }

        return html`
          <div
            class="${
              this._showSearchInSheet ? "search-sheet-results" : "entity-options-search-results"
            } virtualized-results-wrapper ${isGridMode ? "grid-mode" : ""}"
            @scroll=${(e) => this._handleSearchResultsScroll(e, pinSearchHeaders)}
            @wheel=${(e) => this._handleSearchResultsWheel(e, pinSearchHeaders)}
            @touchstart=${(e) => this._handleResultsTouchStart(e)}
            @touchmove=${(e) => this._handleResultsTouchMove(e, pinSearchHeaders)}
            @touchend=${() => this._handleResultsTouchEnd()}
            style="${
              this.config.search_view === "card" ||
              this.config.search_view === "card_minimal" ||
              isGridMode
                ? `--search-card-columns: ${isGridMode ? 5 /* MINI_GRID_COLUMNS */ : this.config.search_card_columns || 4};`
                : ""
            }"
          >
            ${
              isCard || isGridMode
                ? virtualize({
                    items: currentResults,
                    renderItem: renderItemFn,
                    layout: this._cachedSearchGridLayout,
                    scroller: true,
                  })
                : virtualize({ items: currentResults, renderItem: renderItemFn, scroller: true })
            }
          </div>
        `;
      })()}
    </div>
  `;
}
