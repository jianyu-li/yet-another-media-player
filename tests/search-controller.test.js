import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  SearchController,
  mapLegacySortOption,
  isSortableSearchMode,
  getOppositeSearchSortMode,
  sortSearchResultsList,
  filterHierarchySearchResults,
  matchResolvedMediaUri,
  snapshotPlaybackStateMap,
  hasPlaybackStateChanged,
} from "../src/controllers/search-controller.js";

describe("SearchController & Pure Search Helpers", () => {
  describe("mapLegacySortOption", () => {
    it("maps legacy title options to name options", () => {
      assert.strictEqual(mapLegacySortOption("title_asc"), "name");
      assert.strictEqual(mapLegacySortOption("title_desc"), "name_desc");
    });

    it("maps legacy artist options to artist_name options", () => {
      assert.strictEqual(mapLegacySortOption("artist_asc"), "artist_name");
      assert.strictEqual(mapLegacySortOption("artist_desc"), "artist_name_desc");
    });

    it("passes through standard sort modes untouched", () => {
      assert.strictEqual(mapLegacySortOption("name"), "name");
      assert.strictEqual(mapLegacySortOption("recent"), "recent");
      assert.strictEqual(mapLegacySortOption("custom_mode"), "custom_mode");
    });

    it("falls back to 'default' for falsy values", () => {
      assert.strictEqual(mapLegacySortOption(null), "default");
      assert.strictEqual(mapLegacySortOption(undefined), "default");
      assert.strictEqual(mapLegacySortOption(""), "default");
    });
  });

  describe("isSortableSearchMode", () => {
    it("returns true for modes supporting sorting and toggling", () => {
      assert.strictEqual(isSortableSearchMode("name"), true);
      assert.strictEqual(isSortableSearchMode("recent"), true);
      assert.strictEqual(isSortableSearchMode("track"), true);
    });

    it("returns false for non-sortable modes", () => {
      assert.strictEqual(isSortableSearchMode("default"), false);
      assert.strictEqual(isSortableSearchMode("random"), false);
      assert.strictEqual(isSortableSearchMode("random_play_count"), false);
      assert.strictEqual(isSortableSearchMode(null), false);
      assert.strictEqual(isSortableSearchMode(undefined), false);
    });
  });

  describe("getOppositeSearchSortMode", () => {
    it("toggles between ascending and descending variants", () => {
      assert.strictEqual(getOppositeSearchSortMode("name"), "name_desc");
      assert.strictEqual(getOppositeSearchSortMode("name_desc"), "name");
      assert.strictEqual(getOppositeSearchSortMode("recent"), "recent_desc");
      assert.strictEqual(getOppositeSearchSortMode("recent_desc"), "recent");
    });

    it("returns null for non-sortable modes", () => {
      assert.strictEqual(getOppositeSearchSortMode("default"), null);
      assert.strictEqual(getOppositeSearchSortMode(null), null);
    });
  });

  describe("sortSearchResultsList", () => {
    it("returns empty array for non-array inputs", () => {
      assert.deepStrictEqual(sortSearchResultsList(null), []);
      assert.deepStrictEqual(sortSearchResultsList(undefined), []);
    });

    it("returns copy of array when skipSort is true", () => {
      const items = [{ title: "Zebra" }, { title: "Apple" }];
      const result = sortSearchResultsList(items, "default", true);
      assert.strictEqual(result.length, 2);
      assert.notStrictEqual(result, items);
    });

    it("shuffles array when sortMode is 'random'", () => {
      const items = Array.from({ length: 20 }, (_, i) => ({ id: i }));
      const result = sortSearchResultsList(items, "random");
      assert.strictEqual(result.length, 20);
    });
  });

  describe("filterHierarchySearchResults", () => {
    it("returns results as-is if hierarchy is empty or query is empty", () => {
      const results = [{ title: "Song A" }];
      assert.deepStrictEqual(filterHierarchySearchResults(results, [], "query"), results);
      assert.deepStrictEqual(
        filterHierarchySearchResults(results, [{ type: "artist" }], ""),
        results
      );
    });

    it("filters results by query matching title or artist within hierarchy", () => {
      const results = [
        { title: "Comfortably Numb", artist: "Pink Floyd" },
        { title: "Time", artist: "Pink Floyd" },
        { title: "Kashmir", artist: "Led Zeppelin" },
      ];
      const hierarchy = [{ type: "artist", name: "Pink Floyd" }];
      const filtered = filterHierarchySearchResults(results, hierarchy, "comfort");
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0].title, "Comfortably Numb");

      const filteredByArtist = filterHierarchySearchResults(results, hierarchy, "zeppelin");
      assert.strictEqual(filteredByArtist.length, 1);
      assert.strictEqual(filteredByArtist[0].title, "Kashmir");
    });
  });

  describe("matchResolvedMediaUri", () => {
    it("matches album by name and artist if mediaType is album", () => {
      const albums = [
        { name: "The Wall", artists: [{ name: "Pink Floyd" }], uri: "spotify:album:wall" },
        { name: "The Wall", artists: [{ name: "Other" }], uri: "spotify:album:other" },
      ];
      const match = matchResolvedMediaUri(albums, "album", "The Wall", "Pink Floyd");
      assert.strictEqual(match, "spotify:album:wall");
    });

    it("matches exact name when available", () => {
      const items = [
        { name: "Best of Rock", uri: "library://playlist/1" },
        { name: "Rock", uri: "library://playlist/2" },
      ];
      const match = matchResolvedMediaUri(items, "playlist", "Rock");
      assert.strictEqual(match, "library://playlist/2");
    });

    it("returns null for non-array or empty inputs", () => {
      assert.strictEqual(matchResolvedMediaUri(null, "track", "Test"), null);
      assert.strictEqual(matchResolvedMediaUri([], "track", "Test"), null);
      assert.strictEqual(matchResolvedMediaUri([{ name: "Test" }], "track", ""), null);
    });
  });

  describe("snapshotPlaybackStateMap", () => {
    it("returns empty object for non-array entityIds", () => {
      assert.deepStrictEqual(snapshotPlaybackStateMap({}, null), {});
      assert.deepStrictEqual(snapshotPlaybackStateMap({}, undefined), {});
    });

    it("captures playback state, mediaId, and mediaTitle from state dictionary", () => {
      const states = {
        "media_player.living_room": {
          state: "playing",
          attributes: {
            media_content_id: "track_001",
            media_title: "Bohemian Rhapsody",
          },
        },
        "media_player.bedroom": {
          state: "paused",
          attributes: {},
        },
      };

      const snapshot = snapshotPlaybackStateMap(states, [
        "media_player.living_room",
        "media_player.bedroom",
        "media_player.missing",
      ]);

      assert.deepStrictEqual(snapshot["media_player.living_room"], {
        state: "playing",
        mediaId: "track_001",
        mediaTitle: "Bohemian Rhapsody",
      });
      assert.deepStrictEqual(snapshot["media_player.bedroom"], {
        state: "paused",
        mediaId: null,
        mediaTitle: null,
      });
      assert.deepStrictEqual(snapshot["media_player.missing"], {
        state: null,
        mediaId: null,
        mediaTitle: null,
      });
    });
  });

  describe("hasPlaybackStateChanged", () => {
    it("detects media change when mediaId or mediaTitle differs", () => {
      const snapshot = {
        "media_player.test": { state: "playing", mediaId: "track_1", mediaTitle: "Title 1" },
      };
      const states = {
        "media_player.test": {
          state: "playing",
          attributes: { media_content_id: "track_2", media_title: "Title 2" },
        },
      };

      assert.strictEqual(
        hasPlaybackStateChanged(snapshot, states, ["media_player.test"], () => false, {
          requireMediaChange: true,
        }),
        true
      );
    });

    it("detects state transition to playing when requireMediaChange is false", () => {
      const snapshot = {
        "media_player.test": { state: "idle", mediaId: null, mediaTitle: null },
      };
      const states = {
        "media_player.test": {
          state: "playing",
          attributes: {},
        },
      };

      assert.strictEqual(
        hasPlaybackStateChanged(
          snapshot,
          states,
          ["media_player.test"],
          (s) => s.state === "playing",
          {
            requireMediaChange: false,
          }
        ),
        true
      );
    });

    it("returns false when state and media are unchanged", () => {
      const snapshot = {
        "media_player.test": { state: "playing", mediaId: "track_1", mediaTitle: "Title 1" },
      };
      const states = {
        "media_player.test": {
          state: "playing",
          attributes: { media_content_id: "track_1", media_title: "Title 1" },
        },
      };

      assert.strictEqual(
        hasPlaybackStateChanged(snapshot, states, ["media_player.test"], () => true, {
          requireMediaChange: true,
        }),
        false
      );
    });
  });

  describe("SearchController Lifecycle & Instance Methods", () => {
    let mockCard;
    let controller;

    beforeEach(() => {
      mockCard = {
        hass: {
          states: {
            "media_player.main": {
              state: "idle",
              attributes: { friendly_name: "Main Player" },
            },
          },
        },
        config: {},
        entityObjs: [{ entity_id: "media_player.main", hidden_filter_chips: ["radio"] }],
        _selectedIndex: 0,
        currentEntityId: "media_player.main",
        _aiRadioShowsAvailable: false,
        _radioModeActive: false,
        _searchMediaClassFilter: "all",
        _searchResultsByType: { all: [{ title: "Item 1" }] },
        _searchResults: [],
        _favoritesFilterActive: true,
        _recentlyPlayedFilterActive: true,
        _upcomingFilterActive: true,
        _recommendationsFilterActive: true,
        _initialFavoritesLoaded: true,
        _loadingSearchRowMenuId: "row_1",
        _errorSearchRowMenuId: "row_2",
        _getPlaybackEntityId: () => "media_player.main",
        _getActualResolvedMaEntityForState: () => null,
        requestUpdate: () => {},
      };
      controller = new SearchController(/** @type {any} */ (mockCard));
    });

    it("attaches to host on instantiation", () => {
      assert.strictEqual(controller.host, mockCard);
    });

    it("getVisibleSearchFilterClasses filters hidden chips and respects AI Radio availability", () => {
      const classesWithoutRadio = controller.getVisibleSearchFilterClasses();
      assert.strictEqual(classesWithoutRadio.includes("radio"), false);
      assert.strictEqual(classesWithoutRadio.includes("shows"), false);

      mockCard._aiRadioShowsAvailable = true;
      const classesWithRadio = controller.getVisibleSearchFilterClasses();
      assert.strictEqual(classesWithRadio.includes("shows"), true);
    });

    it("toggleRadioMode toggles host._radioModeActive", () => {
      assert.strictEqual(mockCard._radioModeActive, false);
      controller.toggleRadioMode();
      assert.strictEqual(mockCard._radioModeActive, true);
      controller.toggleRadioMode();
      assert.strictEqual(mockCard._radioModeActive, false);
    });

    it("resetSearchContext clears caches, filter flags, and loading IDs", () => {
      controller.resetSearchContext();
      assert.deepStrictEqual(mockCard._searchResultsByType, {});
      assert.strictEqual(mockCard._favoritesFilterActive, false);
      assert.strictEqual(mockCard._recentlyPlayedFilterActive, false);
      assert.strictEqual(mockCard._upcomingFilterActive, false);
      assert.strictEqual(mockCard._recommendationsFilterActive, false);
      assert.strictEqual(mockCard._initialFavoritesLoaded, false);
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
      assert.strictEqual(mockCard._errorSearchRowMenuId, null);
    });

    it("collectPlaybackMonitorIds returns unique, filtered playback entity IDs", () => {
      const ids = controller.collectPlaybackMonitorIds("media_player.target");
      assert.ok(ids.includes("media_player.target"));
      assert.ok(ids.includes("media_player.main"));
    });

    it("hostDisconnected cleans up timers without error", () => {
      mockCard._searchHeaderTransitionTimer = 123;
      mockCard._searchTimeoutHandle = 456;
      mockCard._successToastHandle = 789;
      mockCard._searchLoading = false;

      controller.hostDisconnected();
      assert.strictEqual(mockCard._searchHeaderTransitionTimer, null);
      assert.strictEqual(mockCard._searchTimeoutHandle, null);
      assert.strictEqual(mockCard._successToastHandle, null);
    });
  });
});
