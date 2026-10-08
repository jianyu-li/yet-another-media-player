import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  QueueController,
  checkMassQueueServices,
  calculateQueueMovePlan,
  transformMassQueueItems,
  transformQueueNextItem,
  normalizeRecommendations,
  buildTransferQueuePayload,
  hasQueueInState,
} from "../src/controllers/queue-controller.js";

describe("QueueController & Pure Queue Helpers", () => {
  describe("checkMassQueueServices", () => {
    it("returns false for falsy or empty inputs", () => {
      assert.strictEqual(checkMassQueueServices(null), false);
      assert.strictEqual(checkMassQueueServices(undefined), false);
      assert.strictEqual(checkMassQueueServices(false), false);
      assert.strictEqual(checkMassQueueServices([]), false);
      assert.strictEqual(checkMassQueueServices({}), false);
    });

    it("identifies mass_queue in array of service objects", () => {
      const services = [{ domain: "media_player" }, { domain: "mass_queue" }, { domain: "light" }];
      assert.strictEqual(checkMassQueueServices(services), true);

      const withoutMass = [{ domain: "media_player" }, { domain: "light" }];
      assert.strictEqual(checkMassQueueServices(withoutMass), false);
    });

    it("identifies mass_queue in dictionary of services", () => {
      const services = {
        media_player: {},
        mass_queue: { get_queue_items: {} },
      };
      assert.strictEqual(checkMassQueueServices(services), true);

      const withoutMass = { media_player: {}, light: {} };
      assert.strictEqual(checkMassQueueServices(withoutMass), false);
    });
  });

  describe("calculateQueueMovePlan", () => {
    it("returns strategy none and empty steps when indices are equal", () => {
      const plan = calculateQueueMovePlan(3, 3);
      assert.strictEqual(plan.strategy, "none");
      assert.deepStrictEqual(plan.steps, []);
    });

    it("plans direct upward moves when moving up", () => {
      const plan = calculateQueueMovePlan(3, 1);
      assert.strictEqual(plan.strategy, "direct");
      assert.strictEqual(plan.steps.length, 2);
      assert.deepStrictEqual(plan.steps, [
        { service: "move_queue_item_up" },
        { service: "move_queue_item_up" },
      ]);
    });

    it("plans direct downward moves when costDirect <= costViaNext", () => {
      // 0 to 1: costDirect = 1, costViaNext = 1 + 1 = 2 -> direct
      const plan = calculateQueueMovePlan(0, 1);
      assert.strictEqual(plan.strategy, "direct");
      assert.strictEqual(plan.steps.length, 1);
      assert.deepStrictEqual(plan.steps, [{ service: "move_queue_item_down" }]);
    });

    it("plans strategy next when costViaNext < costDirect", () => {
      // 5 to 1: costDirect = 4, costViaNext = 1 + 1 = 2 -> next (faster: 1 move next + 1 move down)
      const plan = calculateQueueMovePlan(5, 1);
      assert.strictEqual(plan.strategy, "next");
      assert.strictEqual(plan.steps.length, 2);
      assert.deepStrictEqual(plan.steps, [
        { service: "move_queue_item_next" },
        { service: "move_queue_item_down" },
      ]);
    });
  });

  describe("transformMassQueueItems", () => {
    it("returns empty array for invalid inputs", () => {
      assert.deepStrictEqual(transformMassQueueItems(null), []);
      assert.deepStrictEqual(transformMassQueueItems(undefined), []);
      assert.deepStrictEqual(transformMassQueueItems([]), []);
    });

    it("finds active track by active boolean and extracts upcoming items", () => {
      const queueItems = [
        { queue_item_id: "q0", name: "Played Track 1" },
        { queue_item_id: "q1", active: true, name: "Current Playing Track" },
        { queue_item_id: "q2", name: "Upcoming Track 1", artist: "Artist A", duration: 180 },
        { queue_item_id: "q3", name: "Upcoming Track 2", artist: "Artist B", duration: 210 },
      ];

      const results = transformMassQueueItems(queueItems);
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].queue_item_id, "q2");
      assert.strictEqual(results[0].title, "Upcoming Track 1");
      assert.strictEqual(results[0].artist, "Artist A");
      assert.strictEqual(results[0].duration, 180);
      assert.strictEqual(results[0].position, 1);

      assert.strictEqual(results[1].queue_item_id, "q3");
      assert.strictEqual(results[1].position, 2);
    });

    it("finds active track by state playing", () => {
      const queueItems = [
        { queue_item_id: "q0", state: "playing", name: "Current" },
        { queue_item_id: "q1", name: "Next" },
      ];
      const results = transformMassQueueItems(queueItems);
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].queue_item_id, "q1");
    });

    it("matches active track by currentTrackId fallback", () => {
      const queueItems = [
        { media_content_id: "track_123", name: "Current" },
        { media_content_id: "track_456", name: "Upcoming" },
      ];
      const results = transformMassQueueItems(queueItems, "track_123");
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].media_content_id, "track_456");
    });

    it("honors limitAfter slice parameter", () => {
      const queueItems = [
        { active: true, name: "Current" },
        { queue_item_id: "q1", name: "Up 1" },
        { queue_item_id: "q2", name: "Up 2" },
        { queue_item_id: "q3", name: "Up 3" },
      ];
      const results = transformMassQueueItems(queueItems, null, 2);
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].queue_item_id, "q1");
      assert.strictEqual(results[1].queue_item_id, "q2");
    });
  });

  describe("transformQueueNextItem", () => {
    it("returns empty array when queueData has no next_item", () => {
      assert.deepStrictEqual(transformQueueNextItem(null), []);
      assert.deepStrictEqual(transformQueueNextItem({}), []);
    });

    it("transforms next_item correctly into standardized item", () => {
      const queueData = {
        next_item: {
          queue_item_id: "next_01",
          name: "Next Song",
          duration: 200,
          media_item: {
            uri: "spotify:track:123",
            name: "Next Song",
            album: { name: "Album X" },
            artists: [{ name: "Artist Y" }],
            image: "https://example.com/art.jpg",
          },
        },
      };

      const results = transformQueueNextItem(queueData);
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].title, "Next Song");
      assert.strictEqual(results[0].artist, "Artist Y");
      assert.strictEqual(results[0].album, "Album X");
      assert.strictEqual(results[0].thumbnail, "https://example.com/art.jpg");
      assert.strictEqual(results[0].position, 1);
      assert.strictEqual(results[0].queue_item_id, "next_01");
    });
  });

  describe("normalizeRecommendations", () => {
    it("normalizes array of recommendation groups and items", () => {
      const payload = [
        {
          name: "Daily Mix 1",
          items: [
            {
              uri: "spotify:track:abc",
              name: "Song A",
              media_type: "track",
              image: "https://example.com/a.jpg",
              provider: "spotify",
            },
            {
              uri: "spotify:track:def",
              name: "Song B",
              media_type: "song",
              image: "https://example.com/b.jpg",
              provider: "spotify",
            },
          ],
        },
      ];

      const results = normalizeRecommendations(payload);
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].title, "Song A");
      assert.strictEqual(results[0].media_class, "track");
      assert.strictEqual(results[0].artist, "Track • Daily Mix 1");
      assert.strictEqual(results[0].thumbnail, "https://example.com/a.jpg");

      assert.strictEqual(results[1].title, "Song B");
      assert.strictEqual(results[1].media_class, "track");
    });

    it("filters by requested mediaType and honors maxItems", () => {
      const payload = {
        "media_player.kitchen": [
          {
            name: "Radio Stations",
            items: [
              { uri: "tunein:1", name: "Station 1", media_type: "station" },
              { uri: "track:2", name: "Track 2", media_type: "track" },
            ],
          },
        ],
      };

      const radioResults = normalizeRecommendations(payload, "media_player.kitchen", "radio", 10);
      assert.strictEqual(radioResults.length, 1);
      assert.strictEqual(radioResults[0].title, "Station 1");
      assert.strictEqual(radioResults[0].media_class, "radio");

      const limitedResults = normalizeRecommendations(payload, "media_player.kitchen", null, 1);
      assert.strictEqual(limitedResults.length, 1);
    });
  });

  describe("buildTransferQueuePayload", () => {
    it("uses metadata fields when available", () => {
      const serviceMeta = {
        fields: {
          source_player: {},
          target_player: {},
        },
      };

      const payload = buildTransferQueuePayload(
        "media_player.living_room",
        "media_player.bedroom",
        serviceMeta
      );
      assert.deepStrictEqual(payload, {
        source_player: "media_player.living_room",
        target_player: "media_player.bedroom",
      });
    });

    it("falls back to candidate keys when metadata fields are missing", () => {
      const payload = buildTransferQueuePayload("media_player.living_room", "media_player.bedroom");
      assert.strictEqual(payload.source_player, "media_player.living_room");
      assert.strictEqual(payload.entity_id, "media_player.bedroom");
    });
  });

  describe("hasQueueInState", () => {
    it("returns false for null or empty attributes", () => {
      assert.strictEqual(hasQueueInState(null), false);
      assert.strictEqual(hasQueueInState({ attributes: {} }), false);
    });

    it("detects queue when array attributes contain items", () => {
      assert.strictEqual(hasQueueInState({ attributes: { queue_items: ["item1"] } }), true);
      assert.strictEqual(hasQueueInState({ attributes: { queue: [{ id: 1 }] } }), true);
      assert.strictEqual(hasQueueInState({ attributes: { queue_items: [] } }), false);
    });

    it("detects queue when numeric count attributes > 0", () => {
      assert.strictEqual(hasQueueInState({ attributes: { queue_length: 5 } }), true);
      assert.strictEqual(hasQueueInState({ attributes: { queue_remaining: 2 } }), true);
      assert.strictEqual(hasQueueInState({ attributes: { queue_length: 0 } }), false);
    });

    it("detects queue from next_item or media_content_id", () => {
      assert.strictEqual(hasQueueInState({ attributes: { next_item: { name: "Song" } } }), true);
      assert.strictEqual(
        hasQueueInState({ attributes: { media_content_id: "spotify:track:1" } }),
        true
      );
    });

    it("falls back to cachedUpcoming array if present", () => {
      assert.strictEqual(hasQueueInState({ attributes: {} }, [{ queue_item_id: "q1" }]), true);
    });
  });

  describe("QueueController Class & Host Integration", () => {
    let mockHost;
    let controller;
    let serviceCalls;

    beforeEach(() => {
      serviceCalls = [];
      mockHost = {
        config: {
          disable_mass_queue: false,
        },
        hass: {
          states: {
            "media_player.kitchen": {
              entity_id: "media_player.kitchen",
              state: "playing",
              attributes: {
                app_id: "music_assistant",
                media_content_id: "track_current",
              },
            },
            "media_player.bedroom": {
              entity_id: "media_player.bedroom",
              state: "idle",
              attributes: {
                mass_player_id: "player_bed",
              },
            },
          },
          services: {
            music_assistant: {
              transfer_queue: {
                fields: { source_player: {}, target_player: {} },
              },
            },
            mass_queue: {
              get_queue_items: {},
              move_queue_item_up: {},
              move_queue_item_down: {},
              move_queue_item_next: {},
              remove_queue_item: {},
            },
          },
          callWS: async () => ({
            mass_queue: {},
            music_assistant: {},
          }),
          connection: {
            sendMessagePromise: async (msg) => {
              if (msg.service === "get_queue_items") {
                return {
                  response: {
                    "media_player.kitchen": [
                      { queue_item_id: "q1", active: true, name: "Playing" },
                      { queue_item_id: "q2", name: "Upcoming 1" },
                      { queue_item_id: "q3", name: "Upcoming 2" },
                    ],
                  },
                };
              }
              if (msg.service === "get_recommendations") {
                return {
                  response: [
                    {
                      name: "Recs",
                      items: [{ uri: "spotify:1", name: "Track Rec" }],
                    },
                  ],
                };
              }
              return { response: {} };
            },
            subscribeEvents: async () => () => {},
          },
          callService: async (domain, service, data) => {
            serviceCalls.push({ domain, service, data });
          },
        },
        _selectedIndex: 0,
        entityIds: ["media_player.kitchen", "media_player.bedroom"],
        entityObjs: [
          { entity_id: "media_player.kitchen", name: "Kitchen" },
          { entity_id: "media_player.bedroom", name: "Bedroom" },
        ],
        _searchResultsByType: {
          all_upcoming_sort_default: [
            { queue_item_id: "q2", title: "Upcoming 1", position: 1 },
            { queue_item_id: "q3", title: "Upcoming 2", position: 2 },
          ],
        },
        _searchResults: [],
        _searchMediaClassFilter: "all",
        _upcomingFilterActive: true,
        controllers: [],
        addController(c) {
          this.controllers.push(c);
        },
        _showGrouping: false,
        _showEntityOptions: false,
        _openGrouping() {
          this._showEntityOptions = true;
          this._showGrouping = true;
        },
        _closeGrouping() {
          this._showGrouping = false;
        },
        requestUpdate() {},
        _invalidateUpcomingCache() {},
        _getMusicAssistantState() {
          return this.hass.states["media_player.kitchen"];
        },
        _looksLikeMusicAssistantState(state) {
          return Boolean(
            state?.attributes?.app_id === "music_assistant" || state?.attributes?.mass_player_id
          );
        },
        _getActualResolvedMaEntityForState(idx) {
          return this.entityIds[idx];
        },
        _getDisplaySearchResults() {
          return this._searchResultsByType.all_upcoming_sort_default;
        },
      };

      controller = new QueueController(/** @type {any} */ (mockHost));
    });

    it("registers itself with host during construction", () => {
      assert.strictEqual(mockHost.controllers.includes(controller), true);
      assert.strictEqual(controller.host, mockHost);
    });

    it("checks mass_queue availability", async () => {
      const available = await controller.isMassQueueIntegrationAvailable();
      assert.strictEqual(available, true);

      mockHost.config.disable_mass_queue = true;
      const disabled = await controller.isMassQueueIntegrationAvailable();
      assert.strictEqual(disabled, false);
    });

    it("fetches upcoming queue with mass_queue", async () => {
      const queue = await controller.getUpcomingQueue(mockHost.hass, "media_player.kitchen", 10);
      assert.strictEqual(queue.usedMusicAssistant, true);
      assert.strictEqual(queue.results.length, 2);
      assert.strictEqual(queue.results[0].queue_item_id, "q2");
    });

    it("fetches recommendations with mass_queue", async () => {
      const recs = await controller.getRecommendations(mockHost.hass, "media_player.kitchen");
      assert.strictEqual(recs.usedMusicAssistant, true);
      assert.strictEqual(recs.results.length, 1);
      assert.strictEqual(recs.results[0].title, "Track Rec");
    });

    it("executes queue operations sequentially and updates progress counters", async () => {
      await controller.moveQueueItemUp("q3");
      await controller.queueOperationPromise;

      assert.strictEqual(serviceCalls.length, 1);
      assert.strictEqual(serviceCalls[0].domain, "mass_queue");
      assert.strictEqual(serviceCalls[0].service, "move_queue_item_up");
      assert.strictEqual(serviceCalls[0].data.queue_item_id, "q3");
    });

    it("handles drag-and-drop onQueueItemMoved", async () => {
      await controller.onQueueItemMoved({
        detail: { oldIndex: 1, newIndex: 0 },
      });
      await controller.queueOperationPromise;

      assert.strictEqual(serviceCalls.length, 1);
      assert.strictEqual(serviceCalls[0].service, "move_queue_item_up");
    });

    it("updates queue in UI optimistically", () => {
      controller.moveQueueItemInUI("q3", "up");
      assert.strictEqual(
        mockHost._searchResultsByType.all_upcoming_sort_default[0].queue_item_id,
        "q3"
      );
      assert.strictEqual(
        mockHost._searchResultsByType.all_upcoming_sort_default[1].queue_item_id,
        "q2"
      );

      controller.advanceQueueInUI();
      assert.strictEqual(mockHost._searchResultsByType.all_upcoming_sort_default.length, 1);
      assert.strictEqual(
        mockHost._searchResultsByType.all_upcoming_sort_default[0].queue_item_id,
        "q2"
      );

      controller.removeQueueItemFromUI("q2");
      assert.strictEqual(mockHost._searchResultsByType.all_upcoming_sort_default.length, 0);
    });

    it("manages transfer queue targets, modal open/close, and service execution", async () => {
      const targets = controller.getTransferQueueTargets();
      assert.strictEqual(targets.length, 1);
      assert.strictEqual(targets[0].entityId, "media_player.bedroom");

      controller.openTransferQueue();
      assert.strictEqual(mockHost._showGrouping, true);
      assert.strictEqual(mockHost._showEntityOptions, true);

      await controller.transferQueueTo(targets[0]);
      assert.strictEqual(
        serviceCalls.some((c) => c.service === "transfer_queue"),
        true
      );
      assert.strictEqual(controller.transferQueueStatus?.type, "success");

      controller.closeTransferQueue();
      assert.strictEqual(mockHost._showGrouping, false);
    });

    it("identifies whether target is a Music Assistant player via isTargetMusicAssistant", () => {
      assert.strictEqual(
        controller.isTargetMusicAssistant({ maEntityId: "media_player.bedroom" }),
        true
      );
      assert.strictEqual(
        controller.isTargetMusicAssistant({ entityId: "media_player.non_existent" }),
        false
      );
      assert.strictEqual(controller.isTargetMusicAssistant(null), false);
    });

    it("handles transfer queue auto-close timer and dismissal from grouping sheet", async () => {
      let dismissed = false;
      mockHost._showEntityOptions = true;
      mockHost._showGrouping = true;
      mockHost._cardType = "standard";
      mockHost._dismissWithAnimation = () => {
        dismissed = true;
      };

      const target = {
        index: 1,
        entityId: "media_player.bedroom",
        maEntityId: "media_player.bedroom",
        name: "Bedroom",
      };

      await controller.transferQueueTo(target);
      assert.strictEqual(controller.transferQueueStatus?.type, "success");
      assert.ok(controller.transferQueueAutoCloseTimer);

      clearTimeout(controller.transferQueueAutoCloseTimer);
      controller.transferQueueStatus = null;
      if (
        mockHost._showEntityOptions &&
        (controller.showTransferQueue ||
          (mockHost._showGrouping && mockHost._cardType !== "group_players"))
      ) {
        mockHost._dismissWithAnimation();
      }
      assert.strictEqual(dismissed, true);
      assert.strictEqual(controller.transferQueueStatus, null);
    });

    it("does not dismiss with animation when cardType is group_players", async () => {
      let dismissed = false;
      mockHost._showEntityOptions = true;
      mockHost._showGrouping = true;
      mockHost._cardType = "group_players";
      mockHost._dismissWithAnimation = () => {
        dismissed = true;
      };

      const target = {
        index: 1,
        entityId: "media_player.bedroom",
        maEntityId: "media_player.bedroom",
        name: "Bedroom",
      };

      await controller.transferQueueTo(target);
      assert.strictEqual(controller.transferQueueStatus?.type, "success");
      assert.ok(controller.transferQueueAutoCloseTimer);

      clearTimeout(controller.transferQueueAutoCloseTimer);
      controller.transferQueueStatus = null;
      if (
        mockHost._showEntityOptions &&
        (controller.showTransferQueue ||
          (mockHost._showGrouping && mockHost._cardType !== "group_players"))
      ) {
        mockHost._dismissWithAnimation();
      }
      assert.strictEqual(dismissed, false);
      assert.strictEqual(controller.transferQueueStatus, null);
    });

    it("does not dismiss with animation when cardType is speakers_and_groups", async () => {
      let dismissed = false;
      mockHost._showEntityOptions = true;
      mockHost._showGrouping = true;
      mockHost._cardType = "speakers_and_groups";
      mockHost._dismissWithAnimation = () => {
        dismissed = true;
      };

      const target = {
        index: 1,
        entityId: "media_player.bedroom",
        maEntityId: "media_player.bedroom",
        name: "Bedroom",
      };

      await controller.transferQueueTo(target);
      assert.strictEqual(controller.transferQueueStatus?.type, "success");
      assert.ok(controller.transferQueueAutoCloseTimer);

      clearTimeout(controller.transferQueueAutoCloseTimer);
      controller.transferQueueStatus = null;
      if (
        mockHost._showEntityOptions &&
        (controller.showTransferQueue ||
          (mockHost._showGrouping &&
            mockHost._cardType !== "group_players" &&
            mockHost._cardType !== "speakers_and_groups"))
      ) {
        mockHost._dismissWithAnimation();
      }
      assert.strictEqual(dismissed, false);
      assert.strictEqual(controller.transferQueueStatus, null);
    });

    it("cleans up subscriptions and timers on hostDisconnected", () => {
      controller.queueRefreshTimer = setTimeout(() => {}, 10000);
      controller.queueOpsTimeout = setTimeout(() => {}, 10000);
      controller.transferQueueAutoCloseTimer = setTimeout(() => {}, 10000);
      let unsubscribed = false;
      controller.queueEventSubscription = () => {
        unsubscribed = true;
      };

      controller.hostDisconnected();
      assert.strictEqual(controller.queueRefreshTimer, null);
      assert.strictEqual(controller.queueOpsTimeout, null);
      assert.strictEqual(controller.transferQueueAutoCloseTimer, null);
      assert.strictEqual(unsubscribed, true);
    });
  });
});
