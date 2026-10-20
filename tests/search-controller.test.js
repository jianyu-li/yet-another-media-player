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
  normalizeBrowseMediaChild,
  snapshotPlaybackStateMap,
  hasPlaybackStateChanged,
} from "../src/controllers/search-controller.js";
import { clearSecureThumbnailCache } from "../src/yamp-utils.js";

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

  describe("normalizeBrowseMediaChild", () => {
    it("returns null or primitives untouched for non-object inputs", () => {
      assert.strictEqual(normalizeBrowseMediaChild(null), null);
      assert.strictEqual(normalizeBrowseMediaChild(undefined), undefined);
      assert.strictEqual(normalizeBrowseMediaChild("string"), "string");
      assert.strictEqual(normalizeBrowseMediaChild(123), 123);
      assert.strictEqual(normalizeBrowseMediaChild(true), true);
    });

    it("maps can_expand to is_browsable", () => {
      const expandable = normalizeBrowseMediaChild({
        title: "Test Album",
        can_expand: true,
      });
      assert.strictEqual(expandable.is_browsable, true);
      assert.strictEqual(expandable.can_expand, true);

      const nonExpandable = normalizeBrowseMediaChild({
        title: "Test Track",
        can_expand: false,
      });
      assert.strictEqual(nonExpandable.is_browsable, false);
      assert.strictEqual(nonExpandable.can_expand, false);
    });

    it("preserves explicit boolean is_browsable over can_expand", () => {
      const explicitTrue = normalizeBrowseMediaChild({
        title: "Item",
        is_browsable: true,
        can_expand: false,
      });
      assert.strictEqual(explicitTrue.is_browsable, true);

      const explicitFalse = normalizeBrowseMediaChild({
        title: "Item",
        is_browsable: false,
        can_expand: true,
      });
      assert.strictEqual(explicitFalse.is_browsable, false);
    });

    it("infers is_browsable based on media_class or media_content_type when neither is_browsable nor can_expand is boolean", () => {
      assert.strictEqual(
        normalizeBrowseMediaChild({ title: "Album", media_class: "album" }).is_browsable,
        true
      );
      assert.strictEqual(
        normalizeBrowseMediaChild({ title: "Artist", media_class: "artist" }).is_browsable,
        true
      );
      assert.strictEqual(
        normalizeBrowseMediaChild({ title: "Playlist", media_class: "playlist" }).is_browsable,
        true
      );
      assert.strictEqual(
        normalizeBrowseMediaChild({ title: "Track", media_class: "track" }).is_browsable,
        false
      );

      assert.strictEqual(
        normalizeBrowseMediaChild({ title: "Album", media_content_type: "album" }).is_browsable,
        true
      );
      assert.strictEqual(
        normalizeBrowseMediaChild({ title: "Track", media_content_type: "track" }).is_browsable,
        false
      );
    });

    it("parses 'Artist Name - Track Title' from title when child.artist is not already set", () => {
      const item = normalizeBrowseMediaChild({
        title: "Mac DeMarco - Chamber of Reflection",
        media_class: "track",
      });
      assert.strictEqual(item.artist, "Mac DeMarco");
      assert.strictEqual(item.title, "Chamber of Reflection");
    });

    it("preserves existing artist without parsing title if child.artist is already set", () => {
      const item = normalizeBrowseMediaChild({
        title: "Mac DeMarco - Chamber of Reflection",
        artist: "Explicit Artist",
        media_class: "track",
      });
      assert.strictEqual(item.artist, "Explicit Artist");
      assert.strictEqual(item.title, "Mac DeMarco - Chamber of Reflection");
    });

    it("leaves title untouched if it does not contain ' - ' separator", () => {
      const item = normalizeBrowseMediaChild({
        title: "Chamber of Reflection",
        media_class: "track",
      });
      assert.strictEqual(item.title, "Chamber of Reflection");
      assert.strictEqual(item.artist, undefined);
    });

    it("applies fallbackArtist and fallbackAlbum when missing on child item", () => {
      const item = normalizeBrowseMediaChild(
        { title: "My Old Man", media_class: "track" },
        { fallbackArtist: "Mac DeMarco", fallbackAlbum: "This Old Dog" }
      );
      assert.strictEqual(item.artist, "Mac DeMarco");
      assert.strictEqual(item.album, "This Old Dog");
      assert.strictEqual(item.title, "My Old Man");
    });

    it("does not override existing artist and album with fallbacks", () => {
      const item = normalizeBrowseMediaChild(
        {
          title: "My Old Man",
          artist: "Original Artist",
          album: "Original Album",
          media_class: "track",
        },
        { fallbackArtist: "Fallback Artist", fallbackAlbum: "Fallback Album" }
      );
      assert.strictEqual(item.artist, "Original Artist");
      assert.strictEqual(item.album, "Original Album");
    });

    it("prefers parsed title artist over fallbackArtist", () => {
      const item = normalizeBrowseMediaChild(
        { title: "Mac DeMarco - My Old Man", media_class: "track" },
        { fallbackArtist: "Fallback Artist", fallbackAlbum: "This Old Dog" }
      );
      assert.strictEqual(item.artist, "Mac DeMarco");
      assert.strictEqual(item.title, "My Old Man");
      assert.strictEqual(item.album, "This Old Dog");
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
    /** @type {any} */
    let mockCard;
    /** @type {any} */
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

    describe("resolveInsecureResultThumbnails", () => {
      it("does not call mass_queue when on http protocol", async () => {
        const origWindow = globalThis.window;
        try {
          globalThis.window = /** @type {any} */ ({ location: { protocol: "http:" } });
          let calledWS = false;
          mockCard.hass.callWS = async () => {
            calledWS = true;
            return { image: "data:...", success: true };
          };
          const results = [{ thumbnail: "http://192.168.6.90:8095/imageproxy/1?size=0" }];
          await controller.resolveInsecureResultThumbnails(results);
          assert.strictEqual(calledWS, false);
          assert.strictEqual(results[0].thumbnail, "http://192.168.6.90:8095/imageproxy/1?size=0");
        } finally {
          globalThis.window = origWindow;
        }
      });

      it("does not call mass_queue when disable_mass_queue is true in card config", async () => {
        const origWindow = globalThis.window;
        try {
          globalThis.window = /** @type {any} */ ({ location: { protocol: "https:" } });
          let calledWS = false;
          mockCard.config = { disable_mass_queue: true };
          mockCard.hass = {
            services: { mass_queue: {} },
            callWS: async () => {
              calledWS = true;
              return { image: "data:...", success: true };
            },
          };
          const results = [{ thumbnail: "http://192.168.6.90:8095/imageproxy/1?size=0" }];
          await controller.resolveInsecureResultThumbnails(results);
          assert.strictEqual(calledWS, false);
          assert.strictEqual(results[0].thumbnail, "http://192.168.6.90:8095/imageproxy/1?size=0");
        } finally {
          globalThis.window = origWindow;
        }
      });

      it("does not call mass_queue when mass_queue service is not installed", async () => {
        const origWindow = globalThis.window;
        try {
          globalThis.window = /** @type {any} */ ({ location: { protocol: "https:" } });
          let calledWS = false;
          mockCard.config = {};
          mockCard.hass = {
            services: {}, // No mass_queue
            callWS: async () => {
              calledWS = true;
              return { image: "data:...", success: true };
            },
          };
          const results = [{ thumbnail: "http://192.168.6.90:8095/imageproxy/1?size=0" }];
          await controller.resolveInsecureResultThumbnails(results);
          assert.strictEqual(calledWS, false);
          assert.strictEqual(results[0].thumbnail, "http://192.168.6.90:8095/imageproxy/1?size=0");
        } finally {
          globalThis.window = origWindow;
        }
      });

      it("resolves and swaps thumbnail to data: URI when mass_queue is available and enabled", async () => {
        clearSecureThumbnailCache();
        const origWindow = globalThis.window;
        try {
          globalThis.window = /** @type {any} */ ({ location: { protocol: "https:" } });
          let updated = false;
          mockCard.config = {};
          mockCard.requestUpdate = () => {
            updated = true;
          };
          mockCard.hass = {
            services: { mass_queue: {} },
            callWS: async (msg) => {
              if (msg.type === "mass_queue/download_and_encode_image") {
                return { image: "data:image/jpeg;base64,RESOLVED_BASE64", success: true };
              }
              return null;
            },
          };
          const results = [
            { thumbnail: "http://192.168.6.90:8095/imageproxy/test1?size=0" },
            { thumbnail: "https://example.com/already_secure.jpg" },
          ];
          await controller.resolveInsecureResultThumbnails(results);
          assert.strictEqual(results[0].thumbnail, "data:image/jpeg;base64,RESOLVED_BASE64");
          assert.strictEqual(results[1].thumbnail, "https://example.com/already_secure.jpg");
          assert.strictEqual(updated, true);
        } finally {
          globalThis.window = origWindow;
          clearSecureThumbnailCache();
        }
      });
    });

    describe("Hierarchical browse_media calls (Issue #559)", () => {
      /** @type {any[]} */
      let sentMessages;

      beforeEach(() => {
        sentMessages = [];
        mockCard._searchHierarchy = [];
        mockCard._isMusicAssistantEntity = () => true;
        mockCard._isMassQueueIntegrationAvailable = async () => false;
        mockCard._getSearchEntityId = () => "media_player.mass_player";
        mockCard._resolveTemplateAtActionTime = async (/** @type {any} */ t) => t;
        mockCard.doSearch = async () => {};
        mockCard.scrollToTop = () => {};
        mockCard.requestUpdate = () => {};

        mockCard.hass = {
          states: mockCard.hass?.states || {},
          connection: {
            sendMessagePromise: async (/** @type {any} */ msg) => {
              sentMessages.push(msg);
              if (msg.service_data?.media_content_type === "album") {
                return {
                  response: {
                    "media_player.mass_player": {
                      result: {
                        children: [
                          {
                            title: "Mac DeMarco - My Old Man",
                            media_content_id: "library://track/101",
                            media_content_type: "track",
                            media_class: "track",
                            can_expand: false,
                          },
                          {
                            title: "Mac DeMarco - This Old Dog",
                            media_content_id: "library://track/102",
                            media_content_type: "track",
                            media_class: "track",
                            can_expand: false,
                          },
                        ],
                      },
                    },
                  },
                };
              }
              if (msg.service_data?.media_content_type === "artist") {
                return {
                  response: {
                    "media_player.mass_player": {
                      result: {
                        children: [
                          {
                            title: "This Old Dog",
                            media_content_id: "library://album/1750",
                            media_content_type: "album",
                            media_class: "album",
                            can_expand: true,
                          },
                          {
                            title: "Salad Days",
                            media_content_id: "library://album/1751",
                            media_content_type: "album",
                            media_class: "album",
                            can_expand: true,
                          },
                        ],
                      },
                    },
                  },
                };
              }
              if (msg.service_data?.media_content_type === "playlist") {
                return {
                  response: {
                    "media_player.mass_player": {
                      result: {
                        children: [
                          {
                            title: "Fleetwood Mac - Dreams",
                            media_content_id: "library://track/501",
                            media_content_type: "track",
                            media_class: "track",
                            can_expand: false,
                          },
                        ],
                      },
                    },
                  },
                };
              }
              return { result: { children: [] } };
            },
          },
        };
      });

      it("loadAlbumTracks sends media_content_type: 'album' and populates normalized tracks", async () => {
        mockCard.config = { disable_mass_queue: true };

        await controller.loadAlbumTracks("library://album/1750", "This Old Dog", "Mac DeMarco");

        assert.strictEqual(sentMessages.length, 1);
        const msg = sentMessages[0];
        assert.strictEqual(msg.domain, "media_player");
        assert.strictEqual(msg.service, "browse_media");
        assert.strictEqual(msg.service_data.entity_id, "media_player.mass_player");
        assert.strictEqual(msg.service_data.media_content_id, "library://album/1750");
        assert.strictEqual(msg.service_data.media_content_type, "album");

        assert.strictEqual(mockCard._searchResults.length, 2);
        const track1 = mockCard._searchResults[0];
        assert.strictEqual(track1.title, "My Old Man");
        assert.strictEqual(track1.artist, "Mac DeMarco");
        assert.strictEqual(track1.album, "This Old Dog");
        assert.strictEqual(track1.is_browsable, false);

        const track2 = mockCard._searchResults[1];
        assert.strictEqual(track2.title, "This Old Dog");
        assert.strictEqual(track2.artist, "Mac DeMarco");
        assert.strictEqual(track2.album, "This Old Dog");
        assert.strictEqual(track2.is_browsable, false);
      });

      it("searchArtistAlbums sends media_content_type: 'artist' and populates clickable browsable albums", async () => {
        await controller.searchArtistAlbums("Mac DeMarco", "library://artist/42");

        assert.strictEqual(sentMessages.length, 1);
        const msg = sentMessages[0];
        assert.strictEqual(msg.domain, "media_player");
        assert.strictEqual(msg.service, "browse_media");
        assert.strictEqual(msg.service_data.entity_id, "media_player.mass_player");
        assert.strictEqual(msg.service_data.media_content_id, "library://artist/42");
        assert.strictEqual(msg.service_data.media_content_type, "artist");

        assert.strictEqual(mockCard._searchBreadcrumb, "Albums by Mac DeMarco");
        assert.strictEqual(mockCard._searchHierarchy.length, 1);
        assert.strictEqual(mockCard._searchHierarchy[0].type, "artist");
        assert.strictEqual(mockCard._searchHierarchy[0].name, "Mac DeMarco");
        assert.strictEqual(mockCard._searchHierarchy[0].uri, "library://artist/42");

        assert.strictEqual(mockCard._searchResults.length, 2);
        const album1 = mockCard._searchResults[0];
        assert.strictEqual(album1.title, "This Old Dog");
        assert.strictEqual(album1.artist, "Mac DeMarco");
        assert.strictEqual(album1.is_browsable, true);
        assert.strictEqual(controller.isClickableSearchResult(album1), true);

        const album2 = mockCard._searchResults[1];
        assert.strictEqual(album2.title, "Salad Days");
        assert.strictEqual(album2.artist, "Mac DeMarco");
        assert.strictEqual(album2.is_browsable, true);
        assert.strictEqual(controller.isClickableSearchResult(album2), true);
      });

      it("loadArtistAlbums directly browses artist albums with fallback artist and is_browsable", async () => {
        await controller.loadArtistAlbums("library://artist/42", "Mac DeMarco");

        assert.strictEqual(sentMessages.length, 1);
        const msg = sentMessages[0];
        assert.strictEqual(msg.service_data.media_content_id, "library://artist/42");
        assert.strictEqual(msg.service_data.media_content_type, "artist");

        assert.strictEqual(mockCard._searchResults.length, 2);
        assert.strictEqual(mockCard._searchResults[0].artist, "Mac DeMarco");
        assert.strictEqual(mockCard._searchResults[0].is_browsable, true);
      });

      it("loadPlaylistTracks sends media_content_type: 'playlist' and normalizes playlist tracks", async () => {
        const result = await controller.loadPlaylistTracks("library://playlist/99", "Road Trip");

        assert.strictEqual(result, true);
        assert.strictEqual(sentMessages.length, 1);
        const msg = sentMessages[0];
        assert.strictEqual(msg.domain, "media_player");
        assert.strictEqual(msg.service, "browse_media");
        assert.strictEqual(msg.service_data.entity_id, "media_player.mass_player");
        assert.strictEqual(msg.service_data.media_content_id, "library://playlist/99");
        assert.strictEqual(msg.service_data.media_content_type, "playlist");

        assert.strictEqual(mockCard._searchResults.length, 1);
        const track = mockCard._searchResults[0];
        assert.strictEqual(track.title, "Dreams");
        assert.strictEqual(track.artist, "Fleetwood Mac");
        assert.strictEqual(track.is_browsable, false);
      });

      it("goBackInSearch navigates back from album level to artist level reloading artist albums", async () => {
        mockCard._searchHierarchy = [
          {
            type: "artist",
            name: "Mac DeMarco",
            uri: "library://artist/42",
            query: "",
            filter: "album",
          },
          {
            type: "album",
            name: "This Old Dog",
            uri: "library://album/1750",
            query: "",
            filter: "track",
          },
        ];

        controller.goBackInSearch();

        await new Promise((r) => setTimeout(r, 10));

        assert.strictEqual(mockCard._searchHierarchy.length, 1);
        assert.strictEqual(mockCard._searchHierarchy[0].type, "artist");
        assert.strictEqual(mockCard._searchBreadcrumb, "Albums by Mac DeMarco");
        assert.strictEqual(mockCard._searchMediaClassFilter, "album");

        assert.strictEqual(sentMessages.length, 1);
        assert.strictEqual(sentMessages[0].service_data.media_content_id, "library://artist/42");
        assert.strictEqual(sentMessages[0].service_data.media_content_type, "artist");
        assert.strictEqual(mockCard._searchResults.length, 2);
      });

      it("goBackInSearch resets breadcrumb and re-runs search when popping the last hierarchy level", () => {
        let doSearchCalled = false;
        let searchMediaClass = null;
        controller.doSearch = async (mediaClass) => {
          doSearchCalled = true;
          searchMediaClass = mediaClass;
        };

        mockCard._searchHierarchy = [
          {
            type: "artist",
            name: "Mac DeMarco",
            uri: "library://artist/42",
            query: "demarco",
            filter: "artist",
          },
        ];

        controller.goBackInSearch();

        assert.strictEqual(mockCard._searchHierarchy.length, 0);
        assert.strictEqual(mockCard._searchBreadcrumb, "");
        assert.strictEqual(mockCard._searchQuery, "demarco");
        assert.strictEqual(doSearchCalled, true);
        assert.strictEqual(searchMediaClass, "artist");
      });
    });
  });
});
