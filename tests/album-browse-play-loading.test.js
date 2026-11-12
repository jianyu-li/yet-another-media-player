import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { SearchController } from "../src/controllers/search-controller.js";
import { QueueController } from "../src/controllers/queue-controller.js";

describe("Album & Playlist Collection Play Loading & URI Resolution", () => {
  describe("SearchController: playCurrentCollection", () => {
    let mockCard;
    let controller;
    let playMediaCalls;
    let resolveAlbumCalls;
    let resolvePlaylistCalls;

    beforeEach(() => {
      playMediaCalls = [];
      resolveAlbumCalls = [];
      resolvePlaylistCalls = [];

      mockCard = {
        _searchHierarchy: [],
        _loadingSearchRowMenuId: null,
        _searchError: "",
        _selectedIndex: 0,
        currentEntityId: "media_player.kitchen",
        _getSearchEntityId: () => "media_player.kitchen",
        _resolveTemplateAtActionTime: async (template, entityId) => template || entityId,
        _isMusicAssistantEntity: () => true,
        requestUpdate: () => {},
        _searchController: null,
      };

      controller = new SearchController(/** @type {any} */ (mockCard));
      mockCard._searchController = controller;

      // Mock playMediaFromSearch and URI resolvers
      controller.playMediaFromSearch = async (item) => {
        playMediaCalls.push({
          item,
          loadingIdDuringCall: mockCard._loadingSearchRowMenuId,
        });
      };

      controller.resolveAlbumUri = async (albumName, artistName, entityId) => {
        resolveAlbumCalls.push({ albumName, artistName, entityId });
        return `mass:album:${albumName.toLowerCase().replace(/\s+/g, "_")}`;
      };

      controller.resolvePlaylistUri = async (playlistName, entityId) => {
        resolvePlaylistCalls.push({ playlistName, entityId });
        return `mass:playlist:${playlistName.toLowerCase().replace(/\s+/g, "_")}`;
      };
    });

    it("returns early without modifying loading state when search hierarchy is empty or null", async () => {
      mockCard._searchHierarchy = [];
      await controller.playCurrentCollection();
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
      assert.strictEqual(playMediaCalls.length, 0);

      mockCard._searchHierarchy = null;
      await controller.playCurrentCollection();
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
      assert.strictEqual(playMediaCalls.length, 0);
    });

    it("plays collection directly when currentLevel.uri is present, setting and clearing loading ID", async () => {
      const albumLevel = {
        name: "Abbey Road",
        uri: "spotify://album/123",
        type: "album",
      };
      mockCard._searchHierarchy = [albumLevel];

      await controller.playCurrentCollection();

      assert.strictEqual(playMediaCalls.length, 1);
      assert.deepStrictEqual(playMediaCalls[0].item, {
        media_content_id: "spotify://album/123",
        media_content_type: "album",
      });
      // Verified that loading ID was set to URI during playMediaFromSearch
      assert.strictEqual(playMediaCalls[0].loadingIdDuringCall, "spotify://album/123");
      // Verified loading ID was reset to null after completion
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
      assert.strictEqual(resolveAlbumCalls.length, 0);
      assert.strictEqual(resolvePlaylistCalls.length, 0);
    });

    it("resolves album URI via resolveAlbumUri when URI is missing and entity is Music Assistant", async () => {
      const albumLevel = {
        name: "The Dark Side of the Moon",
        type: "album",
      };
      mockCard._searchHierarchy = [albumLevel];

      await controller.playCurrentCollection();

      // Verified resolveAlbumUri called with collection name and search entity ID
      assert.strictEqual(resolveAlbumCalls.length, 1);
      assert.strictEqual(resolveAlbumCalls[0].albumName, "The Dark Side of the Moon");
      assert.strictEqual(resolveAlbumCalls[0].artistName, null);
      assert.strictEqual(resolveAlbumCalls[0].entityId, "media_player.kitchen");

      // Verified URI was populated onto currentLevel
      assert.strictEqual(albumLevel.uri, "mass:album:the_dark_side_of_the_moon");

      // Verified playback was initiated with resolved URI
      assert.strictEqual(playMediaCalls.length, 1);
      assert.deepStrictEqual(playMediaCalls[0].item, {
        media_content_id: "mass:album:the_dark_side_of_the_moon",
        media_content_type: "album",
      });
      // Initial loading token was currentLevel.name before URI was resolved
      assert.strictEqual(playMediaCalls[0].loadingIdDuringCall, "The Dark Side of the Moon");
      // Loading token is cleared afterwards
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
    });

    it("resolves playlist URI via resolvePlaylistUri when URI is missing and entity is Music Assistant", async () => {
      const playlistLevel = {
        name: "Chill Vibes",
        type: "playlist",
      };
      mockCard._searchHierarchy = [playlistLevel];

      await controller.playCurrentCollection();

      assert.strictEqual(resolvePlaylistCalls.length, 1);
      assert.strictEqual(resolvePlaylistCalls[0].playlistName, "Chill Vibes");
      assert.strictEqual(resolvePlaylistCalls[0].entityId, "media_player.kitchen");

      assert.strictEqual(playlistLevel.uri, "mass:playlist:chill_vibes");
      assert.strictEqual(playMediaCalls.length, 1);
      assert.deepStrictEqual(playMediaCalls[0].item, {
        media_content_id: "mass:playlist:chill_vibes",
        media_content_type: "playlist",
      });
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
    });

    it("sets _searchError and resets loading ID to null when URI resolution returns null", async () => {
      const albumLevel = {
        name: "Nonexistent Album",
        type: "album",
      };
      mockCard._searchHierarchy = [albumLevel];
      controller.resolveAlbumUri = async () => null;

      await controller.playCurrentCollection();

      assert.strictEqual(playMediaCalls.length, 0);
      assert.ok(mockCard._searchError.length > 0);
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
    });

    it("sets _searchError and resets loading ID to null when URI resolution throws an error", async () => {
      const albumLevel = {
        name: "Failing Album",
        type: "album",
      };
      mockCard._searchHierarchy = [albumLevel];
      controller.resolveAlbumUri = async () => {
        throw new Error("Network timeout");
      };

      const origWarn = console.warn;
      console.warn = () => {};
      try {
        await controller.playCurrentCollection();
      } finally {
        console.warn = origWarn;
      }

      assert.strictEqual(playMediaCalls.length, 0);
      assert.ok(mockCard._searchError.length > 0);
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
    });

    it("sets _searchError and resets loading ID when entity is not Music Assistant and URI is absent", async () => {
      mockCard._isMusicAssistantEntity = () => false;
      const albumLevel = {
        name: "Standard Player Album",
        type: "album",
      };
      mockCard._searchHierarchy = [albumLevel];

      await controller.playCurrentCollection();

      assert.strictEqual(resolveAlbumCalls.length, 0);
      assert.strictEqual(playMediaCalls.length, 0);
      assert.ok(mockCard._searchError.length > 0);
      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
    });

    it("clears loading ID in finally block even when playMediaFromSearch rejects", async () => {
      const albumLevel = {
        name: "Error Album",
        uri: "spotify://album/err",
        type: "album",
      };
      mockCard._searchHierarchy = [albumLevel];
      controller.playMediaFromSearch = async () => {
        throw new Error("Playback failed");
      };

      await assert.rejects(async () => {
        await controller.playCurrentCollection();
      }, /Playback failed/);

      assert.strictEqual(mockCard._loadingSearchRowMenuId, null);
    });
  });

  describe("QueueController: setSearchResultsFromMassQueue", () => {
    let mockCard;
    let queueController;
    let resolvedThumbnails;

    beforeEach(() => {
      resolvedThumbnails = null;
      mockCard = {
        _searchResults: [],
        _searchQuery: "",
        _searchTotalRows: 0,
        _searchAttempted: false,
        _searchLoading: true,
        _searchController: {
          resolveInsecureResultThumbnails: (results) => {
            resolvedThumbnails = results;
          },
        },
        requestUpdate: () => {},
      };
      queueController = new QueueController(/** @type {any} */ (mockCard));
    });

    it("returns safely when host is undefined", () => {
      const orphanController = new QueueController(/** @type {any} */ (null));
      orphanController.setSearchResultsFromMassQueue([{ media_title: "Song" }], "query");
      // Should not throw
    });

    it("maps media_content_id to track.uri when media_content_id is missing or empty", () => {
      const tracks = [
        {
          uri: "mass:track:123",
          media_title: "Track with URI only",
          media_artist: "Artist A",
          media_album_name: "Album A",
        },
        {
          media_content_id: "mass:track:456",
          uri: "mass:track:fallback",
          media_title: "Track with media_content_id",
        },
      ];

      queueController.setSearchResultsFromMassQueue(tracks, "My Album Tracks");

      assert.strictEqual(mockCard._searchResults.length, 2);
      assert.strictEqual(mockCard._searchResults[0].media_content_id, "mass:track:123");
      assert.strictEqual(mockCard._searchResults[1].media_content_id, "mass:track:456");
    });

    it("correctly falls back through media_title -> title -> name -> 'Unknown Track'", () => {
      const tracks = [
        { uri: "t1", media_title: "From media_title" },
        { uri: "t2", title: "From title" },
        { uri: "t3", name: "From name" },
        { uri: "t4" }, // none provided
      ];

      queueController.setSearchResultsFromMassQueue(tracks, "Title Fallbacks");

      assert.strictEqual(mockCard._searchResults[0].title, "From media_title");
      assert.strictEqual(mockCard._searchResults[1].title, "From title");
      assert.strictEqual(mockCard._searchResults[2].title, "From name");
      assert.strictEqual(mockCard._searchResults[3].title, "Unknown Track");
    });

    it("correctly falls back through media_artist -> artist -> empty string", () => {
      const tracks = [
        { uri: "t1", media_artist: "Artist From media_artist" },
        { uri: "t2", artist: "Artist From artist" },
        { uri: "t3" }, // none provided
      ];

      queueController.setSearchResultsFromMassQueue(tracks, "Artist Fallbacks");

      assert.strictEqual(mockCard._searchResults[0].artist, "Artist From media_artist");
      assert.strictEqual(mockCard._searchResults[1].artist, "Artist From artist");
      assert.strictEqual(mockCard._searchResults[2].artist, "");
    });

    it("correctly falls back through media_album_name -> album -> empty string", () => {
      const tracks = [
        { uri: "t1", media_album_name: "Album From media_album_name" },
        { uri: "t2", album: "Album From album" },
        { uri: "t3" }, // none provided
      ];

      queueController.setSearchResultsFromMassQueue(tracks, "Album Fallbacks");

      assert.strictEqual(mockCard._searchResults[0].album, "Album From media_album_name");
      assert.strictEqual(mockCard._searchResults[1].album, "Album From album");
      assert.strictEqual(mockCard._searchResults[2].album, "");
    });

    it("correctly falls back through media_content_type and media_class", () => {
      const tracks = [
        { uri: "t1", media_content_type: "podcast", media_class: "episode" },
        { uri: "t2", media_type: "audiobook" },
        { uri: "t3" }, // defaults
      ];

      queueController.setSearchResultsFromMassQueue(tracks, "Type Fallbacks");

      assert.strictEqual(mockCard._searchResults[0].media_content_type, "podcast");
      assert.strictEqual(mockCard._searchResults[0].media_class, "episode");

      assert.strictEqual(mockCard._searchResults[1].media_content_type, "audiobook");
      assert.strictEqual(mockCard._searchResults[1].media_class, "track");

      assert.strictEqual(mockCard._searchResults[2].media_content_type, "track");
      assert.strictEqual(mockCard._searchResults[2].media_class, "track");
    });

    it("correctly falls back through thumbnail sources", () => {
      const tracks = [
        {
          uri: "t1",
          local_image_encoded: "data:image/jpeg;base64,123",
          media_image: "http://example.com/art.jpg",
        },
        { uri: "t2", media_image: "http://example.com/art2.jpg" },
        { uri: "t3", image: "http://example.com/art3.jpg" },
        { uri: "t4" }, // no image
      ];

      queueController.setSearchResultsFromMassQueue(tracks, "Thumbnail Fallbacks");

      assert.strictEqual(mockCard._searchResults[0].thumbnail, "data:image/jpeg;base64,123");
      assert.strictEqual(mockCard._searchResults[1].thumbnail, "http://example.com/art2.jpg");
      assert.strictEqual(mockCard._searchResults[2].thumbnail, "http://example.com/art3.jpg");
      assert.strictEqual(mockCard._searchResults[3].thumbnail, null);
    });

    it("updates host search query, total rows, attempted, loading flags, and triggers thumbnail resolution", () => {
      const tracks = Array.from({ length: 25 }, (_, i) => ({
        uri: `track_${i}`,
        title: `Song ${i}`,
      }));

      queueController.setSearchResultsFromMassQueue(tracks, "Search 25 Songs");

      assert.strictEqual(mockCard._searchQuery, "Search 25 Songs");
      assert.strictEqual(mockCard._searchTotalRows, 25);
      assert.strictEqual(mockCard._searchAttempted, true);
      assert.strictEqual(mockCard._searchLoading, false);
      assert.strictEqual(resolvedThumbnails, mockCard._searchResults);
    });

    it("ensures _searchTotalRows is at least 15 for short result lists", () => {
      const tracks = [{ uri: "single", title: "Single Song" }];

      queueController.setSearchResultsFromMassQueue(tracks, "Short List");

      assert.strictEqual(mockCard._searchTotalRows, 15);
    });
  });

  describe("Breadcrumb Loading Condition Logic", () => {
    /**
     * Evaluates the breadcrumb collection loading condition as implemented in options-search-sheet.js.
     * @param {string | null | undefined} loadingSearchRowMenuId
     * @param {{ uri?: string, name?: string } | null | undefined} currentLevel
     * @returns {boolean}
     */
    function isCollectionLoading(loadingSearchRowMenuId, currentLevel) {
      return Boolean(
        loadingSearchRowMenuId != null &&
        currentLevel &&
        ((currentLevel.uri && loadingSearchRowMenuId === currentLevel.uri) ||
          (currentLevel.name && loadingSearchRowMenuId === currentLevel.name))
      );
    }

    it("evaluates to false when loadingSearchRowMenuId is null or undefined (idle)", () => {
      const levelWithUri = { uri: "spotify://album/123", name: "Album" };
      assert.strictEqual(isCollectionLoading(null, levelWithUri), false);
      assert.strictEqual(isCollectionLoading(undefined, levelWithUri), false);
    });

    it("evaluates to false when currentLevel is null or undefined", () => {
      assert.strictEqual(isCollectionLoading("spotify://album/123", null), false);
      assert.strictEqual(isCollectionLoading("spotify://album/123", undefined), false);
    });

    it("evaluates to true when loadingSearchRowMenuId matches currentLevel.uri", () => {
      const level = { uri: "spotify://album/123", name: "Abbey Road" };
      assert.strictEqual(isCollectionLoading("spotify://album/123", level), true);
    });

    it("evaluates to true when loadingSearchRowMenuId matches currentLevel.name (e.g. URI initially missing)", () => {
      const levelWithoutUri = { name: "Abbey Road" };
      assert.strictEqual(isCollectionLoading("Abbey Road", levelWithoutUri), true);

      const levelWithEmptyUri = { uri: "", name: "Abbey Road" };
      assert.strictEqual(isCollectionLoading("Abbey Road", levelWithEmptyUri), true);
    });

    it("evaluates to false when loadingSearchRowMenuId represents another row item or unrelated collection", () => {
      const level = { uri: "spotify://album/123", name: "Abbey Road" };
      // Another track in the search list is loading
      assert.strictEqual(isCollectionLoading("spotify://track/999", level), false);
      // Another album name is loading
      assert.strictEqual(isCollectionLoading("Let It Be", level), false);
    });

    it("evaluates to true when loadingSearchRowMenuId matches name even if uri differs from token before resolution", () => {
      // During playCurrentCollection, collectionToken starts as currentLevel.name when uri is absent
      const level = { name: "Dark Side", uri: "mass:album:dark_side" };
      assert.strictEqual(isCollectionLoading("Dark Side", level), true);
      assert.strictEqual(isCollectionLoading("mass:album:dark_side", level), true);
    });
  });
});
