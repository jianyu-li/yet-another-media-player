import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import {
  isShow,
  isRadio,
  getSearchResultSubtitle,
  isAiRadioAvailable,
  _resetAiRadioCache,
  getAiRadioShows,
  playAiRadioStation,
  playSearchedMedia,
  searchMedia,
} from "../src/search-sheet.js";

describe("Music Assistant AI Radio Shows Search & Playback", () => {
  let mockHass;
  let serviceCalls;
  let wsMessages;

  beforeEach(() => {
    _resetAiRadioCache();
    serviceCalls = [];
    wsMessages = [];

    mockHass = {
      services: {
        music_assistant: {},
        mass_queue: {
          send_command: {},
        },
      },
      states: {
        "media_player.test_speaker": {
          entity_id: "media_player.test_speaker",
          state: "idle",
          attributes: {
            friendly_name: "Test Speaker",
            mass_player_id: "player_xyz123",
          },
        },
      },
      entities: {
        "media_player.test_speaker": {
          entity_id: "media_player.test_speaker",
          platform: "music_assistant",
          config_entry_id: "ma_entry_123",
        },
      },
      user: { is_admin: false },
      callService: mock.fn(async (domain, service, data) => {
        serviceCalls.push({ domain, service, data });
        return { success: true };
      }),
      connection: {
        sendMessagePromise: mock.fn(async (message) => {
          wsMessages.push(message);

          if (message.type === "config_entries/get") {
            return [{ entry_id: "mq_entry_456" }];
          }

          if (message.type === "mass_queue/get_info") {
            return { player_id: "player_resolved_789" };
          }

          if (message.type === "call_service" && message.domain === "mass_queue") {
            const cmd = message.service_data?.command;
            if (cmd === "ai_radio/stations/list") {
              return {
                response: [
                  {
                    id: "music_nerd_favorite_songs",
                    name: "Music nerd — Favorite Songs",
                    source_playlist_id: "547",
                    source_playlist_provider: "library",
                    default_player_id: "",
                    max_duration_minutes: 0,
                    shuffle_source_tracks: true,
                    host_id: "music_nerd",
                  },
                  {
                    id: "morning_coffee_show",
                    name: "Morning Coffee Show",
                    source_playlist_id: "102",
                    source_playlist_provider: "library",
                    default_player_id: "",
                    max_duration_minutes: 30,
                    shuffle_source_tracks: false,
                    host_id: "morning_show",
                  },
                ],
              };
            }
            if (cmd === "ai_radio/hosts/list") {
              return {
                response: [
                  { id: "music_nerd", name: "Music nerd" },
                  { id: "morning_show", name: "Morning show" },
                ],
              };
            }
            if (cmd === "ai_radio/start") {
              return { success: true };
            }
          }

          if (message.type === "call_service" && message.domain === "music_assistant") {
            return {
              response: {
                tracks: [
                  {
                    name: "Bohemian Rhapsody",
                    uri: "spotify://track/123",
                    media_type: "track",
                    item_id: "123",
                    artists: [{ name: "Queen" }],
                  },
                ],
              },
            };
          }

          return {};
        }),
      },
    };
  });

  describe("isShow type helper", () => {
    it("returns true for show media_class or media_content_type", () => {
      assert.strictEqual(isShow({ media_class: "show" }), true);
      assert.strictEqual(isShow({ media_content_type: "show" }), true);
      assert.strictEqual(isShow({ is_ai_radio: true }), true);
    });

    it("returns false for non-show items and invalid input", () => {
      assert.strictEqual(isShow(null), false);
      assert.strictEqual(isShow(undefined), false);
      assert.strictEqual(isShow({ media_class: "track" }), false);
      assert.strictEqual(isShow({ media_class: "radio" }), false);
    });
  });

  describe("getSearchResultSubtitle", () => {
    it("returns host name or custom subtitle for AI radio show", () => {
      const showItem = {
        title: "Music nerd — Favorite Songs",
        media_class: "show",
        is_ai_radio: true,
        artist: "Host: Music nerd",
        subtitle: "Host: Music nerd",
      };
      assert.strictEqual(getSearchResultSubtitle(showItem), "Host: Music nerd");
    });

    it("falls back to item.artist or Show if subtitle is not preset", () => {
      const showItem = {
        title: "Test Show",
        media_class: "show",
        is_ai_radio: true,
        artist: "Host: Test",
      };
      assert.strictEqual(getSearchResultSubtitle(showItem), "Host: Test");
    });
  });

  describe("isAiRadioAvailable", () => {
    it("returns true when mass_queue service and ai_radio stations list succeed", async () => {
      const available = await isAiRadioAvailable(mockHass, "media_player.test_speaker");
      assert.strictEqual(available, true);
    });

    it("returns false if mass_queue service is missing", async () => {
      const hassNoMq = { ...mockHass, services: {} };
      const available = await isAiRadioAvailable(hassNoMq, "media_player.test_speaker");
      assert.strictEqual(available, false);
    });
  });

  describe("getAiRadioShows", () => {
    it("retrieves and transforms AI radio stations with mapped host names", async () => {
      const shows = await getAiRadioShows(mockHass, "media_player.test_speaker");
      assert.strictEqual(shows.length, 2);

      const firstShow = shows[0];
      assert.strictEqual(firstShow.title, "Music nerd — Favorite Songs");
      assert.strictEqual(
        firstShow.media_content_id,
        "ai_radio://station/music_nerd_favorite_songs"
      );
      assert.strictEqual(firstShow.media_content_type, "show");
      assert.strictEqual(firstShow.media_class, "show");
      assert.strictEqual(firstShow.station_id, "music_nerd_favorite_songs");
      assert.strictEqual(firstShow.is_ai_radio, true);
      assert.strictEqual(firstShow.artist, "Host: Music nerd");
      assert.strictEqual(firstShow.subtitle, "Host: Music nerd");
    });

    it("filters shows by search query against title and host", async () => {
      const filteredByTitle = await getAiRadioShows(
        mockHass,
        "media_player.test_speaker",
        "Morning"
      );
      assert.strictEqual(filteredByTitle.length, 1);
      assert.strictEqual(filteredByTitle[0].title, "Morning Coffee Show");

      const filteredByHost = await getAiRadioShows(
        mockHass,
        "media_player.test_speaker",
        "Music nerd"
      );
      assert.strictEqual(filteredByHost.length, 1);
      assert.strictEqual(filteredByHost[0].title, "Music nerd — Favorite Songs");

      const noMatches = await getAiRadioShows(
        mockHass,
        "media_player.test_speaker",
        "NonExistentQuery"
      );
      assert.strictEqual(noMatches.length, 0);
    });
  });

  describe("playAiRadioStation", () => {
    it("calls mass_queue send_command with ai_radio/start and resolved player_id_override", async () => {
      const success = await playAiRadioStation(
        mockHass,
        "media_player.test_speaker",
        "music_nerd_favorite_songs"
      );
      assert.strictEqual(success, true);
      assert.strictEqual(serviceCalls.length, 1);
      const call = serviceCalls[0];
      assert.strictEqual(call.domain, "mass_queue");
      assert.strictEqual(call.service, "send_command");
      assert.strictEqual(call.data.command, "ai_radio/start");
      assert.strictEqual(call.data.data.station_id, "music_nerd_favorite_songs");
      assert.strictEqual(call.data.data.player_id_override, "player_xyz123");
    });

    it("resolves player_id via mass_queue/get_info if entity lacks mass_player_id attribute", async () => {
      mockHass.states["media_player.no_mass_attr"] = {
        entity_id: "media_player.no_mass_attr",
        state: "idle",
        attributes: {},
      };
      const success = await playAiRadioStation(
        mockHass,
        "media_player.no_mass_attr",
        "morning_coffee_show"
      );
      assert.strictEqual(success, true);
      assert.strictEqual(serviceCalls.length, 1);
      assert.strictEqual(serviceCalls[0].data.data.player_id_override, "player_resolved_789");
    });
  });

  describe("playSearchedMedia delegation", () => {
    it("delegates to playAiRadioStation when item is an AI radio show", async () => {
      const showItem = {
        title: "Music nerd — Favorite Songs",
        station_id: "music_nerd_favorite_songs",
        media_class: "show",
        is_ai_radio: true,
      };
      await playSearchedMedia(mockHass, "media_player.test_speaker", showItem);
      assert.strictEqual(serviceCalls.length, 1);
      assert.strictEqual(serviceCalls[0].domain, "mass_queue");
      assert.strictEqual(serviceCalls[0].data.command, "ai_radio/start");
    });
  });

  describe("searchMedia integration", () => {
    it("returns AI radio shows when mediaType is 'shows'", async () => {
      const res = await searchMedia(mockHass, "media_player.test_speaker", "", "shows");
      assert.strictEqual(res.usedMusicAssistant, true);
      assert.strictEqual(res.results.length, 2);
      assert.strictEqual(res.results[0].title, "Music nerd — Favorite Songs");
    });

    it("appends matching AI radio shows when mediaType is 'all' with non-empty query", async () => {
      const res = await searchMedia(mockHass, "media_player.test_speaker", "Music nerd", "all");
      assert.strictEqual(res.usedMusicAssistant, true);
      const show = res.results.find((r) => r.is_ai_radio);
      assert.ok(show);
      assert.strictEqual(show.title, "Music nerd — Favorite Songs");
    });
  });
});
