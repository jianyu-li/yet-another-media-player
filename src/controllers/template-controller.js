/**
 * Reactive Lit controller managing template subscriptions, client-side JS template evaluation,
 * and multi-entity template resolution caching for Yet Another Media Player (YAMP).
 *
 * Implements the Lit ReactiveController interface to automatically manage Home Assistant
 * WebSocket template subscriptions, prevent connection leaks upon card detachment,
 * and debounce in-flight render_template WebSocket events.
 */

import {
  evaluateJsTemplate,
  resolveTemplateAtActionTime,
  getActionPlacement,
} from "../yamp-utils.js";

/**
 * @typedef {import("../types.d.ts").HassEntity} HassEntity
 * @typedef {import("../types.d.ts").TemplateContext} TemplateContext
 * @typedef {import("../types.d.ts").YetAnotherMediaPlayerCard} YetAnotherMediaPlayerCard
 */

export class TemplateController {
  /**
   * @param {YetAnotherMediaPlayerCard} host
   */
  constructor(host) {
    /** @type {YetAnotherMediaPlayerCard} */
    this.host = host;

    if (host && typeof host.addController === "function") {
      host.addController(this);
    }

    /** @type {Record<string, Function | Symbol>} */
    this.templateSubscriptions = {};
    /** @type {Record<string, Symbol>} */
    this.activeSubscriptionTokens = {};
    /** @type {Record<string, Function>} */
    this.compiledJsTemplates = {};

    /** @type {Record<string | number, { template: string, resolved: string | null }>} */
    this.maTemplateValues = {};
    /** @type {Record<number, { id: string, ts: number }>} */
    this.maResolveCache = {};

    /** @type {Record<string | number, { template: string, resolved: string | null }>} */
    this.volTemplateValues = {};
    /** @type {Record<number, { id: string, ts: number }>} */
    this.volResolveCache = {};

    /** @type {Record<string | number, { template: string, resolved: string | null }>} */
    this.remoteTemplateValues = {};
    /** @type {Record<number, { id: string, ts: number }>} */
    this.remoteResolveCache = {};

    /** @type {Record<string | number, { template: string, resolved: any }>} */
    this.hiddenControlsTemplateValues = {};
    /** @type {Record<number, { value: any, ts: number }>} */
    this.hiddenControlsResolveCache = {};

    /** @type {Record<string | number, { template: string, resolved: string | null }>} */
    this.actionInMenuTemplateValues = {};
    /** @type {Record<number, { value: string, ts: number }>} */
    this.actionInMenuResolveCache = {};

    /** @type {Record<string, { template: string, resolved: string | null }>} */
    this.alwaysCollapsedTemplateValue = {};
    /** @type {Record<string, { value: string | boolean, ts: number }>} */
    this.alwaysCollapsedResolveCache = {};

    /** @type {Record<string, { template: string, resolved: string | null }>} */
    this.controlLayoutTemplateValue = {};
    /** @type {Record<string, { value: string, ts: number }>} */
    this.controlLayoutResolveCache = {};

    /** @type {Record<string, { template: string, resolved: string | null }>} */
    this.cardHeightTemplateValue = {};
    /** @type {Record<string, { value: string | number, ts: number }>} */
    this.cardHeightResolveCache = {};

    /** @type {Record<string, { template: string, resolved: string | null }>} */
    this.lyricsBackgroundFadeTemplateValue = {};
    /** @type {Record<string, { value: string | number, ts: number }>} */
    this.lyricsBackgroundFadeResolveCache = {};

    /** @type {Record<string, { template: string, resolved: string | null }>} */
    this.lockScreenControlsTemplateValue = {};
    /** @type {Record<string, { value: string | boolean, ts: number }>} */
    this.lockScreenControlsResolveCache = {};

    /** @type {Record<string, string>} */
    this.contextKeyMap = {};
  }

  /**
   * Lit lifecycle hook: called when the host element connects to the DOM.
   */
  hostConnected() {
    // Subscriptions are re-synced during the host update lifecycle.
  }

  /**
   * Lit lifecycle hook: called when the host element disconnects from the DOM.
   * Automatically terminates all active WebSocket render_template subscriptions.
   */
  hostDisconnected() {
    this.unsubscribeAll();
  }

  /**
   * Returns the internal cache and template values stores for a given template type.
   * @param {string} type
   * @returns {{ templateVals: Record<string | number, any>, cache: Record<string | number, any> } | null}
   */
  _getCacheAndVals(type) {
    if (type === "ma") {
      return { templateVals: this.maTemplateValues, cache: this.maResolveCache };
    }
    if (type === "vol") {
      return { templateVals: this.volTemplateValues, cache: this.volResolveCache };
    }
    if (type === "remote") {
      return { templateVals: this.remoteTemplateValues, cache: this.remoteResolveCache };
    }
    if (type === "action_in_menu") {
      return {
        templateVals: this.actionInMenuTemplateValues,
        cache: this.actionInMenuResolveCache,
      };
    }
    if (type === "always_collapsed") {
      return {
        templateVals: this.alwaysCollapsedTemplateValue,
        cache: this.alwaysCollapsedResolveCache,
      };
    }
    if (type === "hidden_controls") {
      return {
        templateVals: this.hiddenControlsTemplateValues,
        cache: this.hiddenControlsResolveCache,
      };
    }
    if (type === "control_layout") {
      return {
        templateVals: this.controlLayoutTemplateValue,
        cache: this.controlLayoutResolveCache,
      };
    }
    if (type === "card_height") {
      return { templateVals: this.cardHeightTemplateValue, cache: this.cardHeightResolveCache };
    }
    if (type === "lyrics_background_fade") {
      return {
        templateVals: this.lyricsBackgroundFadeTemplateValue,
        cache: this.lyricsBackgroundFadeResolveCache,
      };
    }
    if (type === "lock_screen_controls") {
      return {
        templateVals: this.lockScreenControlsTemplateValue,
        cache: this.lockScreenControlsResolveCache,
      };
    }
    return null;
  }

  /**
   * Subscribes to a Home Assistant Jinja template and updates properties reactively.
   * @param {number | string} idx
   * @param {string} type
   * @param {string} templateString
   */
  subscribeToTemplate(idx, type, templateString) {
    const hass = this.host?.hass;
    if (!hass || !hass.connection) return;

    const subKey = `${idx}_${type}`;
    const stores = this._getCacheAndVals(type);
    if (!stores) return;

    const { templateVals, cache } = stores;
    const currentCache = templateVals[idx];

    // Check if there's already an active subscription for this exact template
    if (this.templateSubscriptions[subKey] && currentCache?.template === templateString) {
      return;
    }

    // Unsubscribe from old template if it changed
    this.unsubscribeFromTemplate(idx, type);

    // Save current template to state
    templateVals[idx] = { template: templateString, resolved: null };

    // Generate a unique token for this subscription request to prevent race conditions
    const subToken = Symbol("subToken");
    this.activeSubscriptionTokens[subKey] = subToken;
    this.templateSubscriptions[subKey] = subToken;

    try {
      const context =
        typeof this.host._getTemplateContext === "function" ? this.host._getTemplateContext() : {};
      const setStatements = Object.entries(context)
        .map(([key, value]) => `{% set ${key} = ${JSON.stringify(value)} %}`)
        .join(" ");
      const finalTemplate = `${setStatements} ${templateString}`;

      hass.connection
        .subscribeMessage(
          (msg) => {
            // If unsubscribed or started a new subscription since, ignore message
            if (this.activeSubscriptionTokens[subKey] !== subToken) {
              return;
            }

            const resolved = (msg.result || "").toString().trim();
            let isValid = false;

            if (type === "ma" || type === "vol" || type === "remote") {
              isValid = Boolean(resolved && /^([a-z0-9_]+)\.[a-zA-Z0-9_]+$/.test(resolved));
            } else if (
              type === "action_in_menu" ||
              type === "always_collapsed" ||
              type === "control_layout" ||
              type === "card_height" ||
              type === "lyrics_background_fade" ||
              type === "lock_screen_controls" ||
              type === "hidden_controls"
            ) {
              isValid = true; // Any string result is valid
            }

            let shouldUpdate = false;

            if (templateVals[idx]) {
              templateVals[idx].resolved = isValid ? resolved : null;
            }

            if (type === "ma" || type === "vol" || type === "remote") {
              const currentCached = cache[idx]?.id;
              if (isValid && currentCached !== resolved) {
                cache[idx] = { id: resolved, ts: Date.now() };
                shouldUpdate = true;
              }
            } else if (
              type === "action_in_menu" ||
              type === "always_collapsed" ||
              type === "control_layout" ||
              type === "card_height" ||
              type === "lyrics_background_fade" ||
              type === "lock_screen_controls" ||
              type === "hidden_controls"
            ) {
              const currentCached = cache[idx]?.value;
              if (isValid && currentCached !== resolved) {
                cache[idx] = { value: resolved, ts: Date.now() };
                shouldUpdate = true;
              }
            }

            if (shouldUpdate) {
              this.host.requestUpdate();
            }
          },
          {
            type: "render_template",
            template: finalTemplate,
          }
        )
        .then((unsub) => {
          // If cancelled while subscribing, call unsub immediately to avoid resource leak
          if (this.activeSubscriptionTokens[subKey] !== subToken) {
            try {
              if (typeof unsub === "function") unsub();
            } catch (e) {
              /* ignore */
            }
          } else {
            this.templateSubscriptions[subKey] = unsub;
          }
        });
    } catch (err) {
      console.warn("yamp: failed to subscribe to template:", err);
    }
  }

  /**
   * Unsubscribes an active template subscription.
   * @param {number | string} idx
   * @param {string} type
   */
  unsubscribeFromTemplate(idx, type) {
    const subKey = `${idx}_${type}`;
    const unsub = this.templateSubscriptions[subKey];
    if (unsub) {
      if (typeof unsub === "function") {
        try {
          unsub();
        } catch (e) {
          /* ignore */
        }
      }
      delete this.templateSubscriptions[subKey];
      delete this.activeSubscriptionTokens[subKey];
    }
  }

  /**
   * Terminates and cleans up all active WebSocket template subscriptions.
   */
  unsubscribeAll() {
    Object.values(this.templateSubscriptions).forEach((unsub) => {
      try {
        if (typeof unsub === "function") unsub();
      } catch (e) {
        console.warn("yamp: Error during template unsubscription:", e);
      }
    });
    this.templateSubscriptions = {};
    this.activeSubscriptionTokens = {};
  }

  /**
   * Evaluates a client-side JavaScript template enclosed in [[[ ... ]]].
   * @param {string} templateStr
   * @returns {any}
   */
  evaluateJsTemplate(templateStr) {
    return evaluateJsTemplate(
      templateStr,
      this.host?.hass,
      typeof this.host?._getTemplateContext === "function" ? this.host._getTemplateContext() : {},
      this.compiledJsTemplates
    );
  }

  /**
   * Synchronizes and resolves a template or static value for a chip index.
   * @param {number} idx
   * @param {string} typeKey
   * @param {any} rawValue
   * @param {{ allowObject?: boolean, cacheStaticString?: boolean }} [options={}]
   * @param {Record<string | number, any> | null} [customCacheObj=null]
   * @param {Record<string | number, any> | null} [customTemplateValsObj=null]
   */
  async ensureResolvedTemplateForIndex(
    idx,
    typeKey,
    rawValue,
    options = {},
    customCacheObj = null,
    customTemplateValsObj = null
  ) {
    const { allowObject = false, cacheStaticString = false } = options;
    const stores = this._getCacheAndVals(typeKey);
    const cacheObj = customCacheObj || stores?.cache;
    const templateValsObj = customTemplateValsObj || stores?.templateVals;

    if (!cacheObj || !templateValsObj) return;

    if (
      !rawValue ||
      (typeof rawValue !== "string" && !(allowObject && typeof rawValue === "object"))
    ) {
      delete cacheObj[idx];
      this.unsubscribeFromTemplate(idx, typeKey);
      if (templateValsObj[idx]) delete templateValsObj[idx];
      return;
    }

    if (typeof rawValue === "string") {
      const isJsTemplate = rawValue.trim().startsWith("[[[");
      if (isJsTemplate) {
        this.unsubscribeFromTemplate(idx, typeKey);
        if (templateValsObj[idx]) delete templateValsObj[idx];

        const resolvedValue = this.evaluateJsTemplate(rawValue);
        const currentCached = allowObject ? cacheObj[idx]?.value : cacheObj[idx]?.id;

        let changed;
        if (typeof resolvedValue === "object" && resolvedValue !== null) {
          changed = JSON.stringify(currentCached) !== JSON.stringify(resolvedValue);
        } else if (Number.isNaN(resolvedValue) && Number.isNaN(currentCached)) {
          changed = false;
        } else {
          changed = currentCached !== resolvedValue;
        }

        if (changed) {
          if (allowObject) {
            cacheObj[idx] = { value: resolvedValue, ts: Date.now() };
          } else {
            cacheObj[idx] = { id: resolvedValue, ts: Date.now() };
          }
          this.host.requestUpdate();
        }
        return;
      }

      const looksTemplate = rawValue.includes("{{") || rawValue.includes("{%");
      if (!looksTemplate) {
        this.unsubscribeFromTemplate(idx, typeKey);
        if (templateValsObj[idx]) delete templateValsObj[idx];

        if (cacheStaticString) {
          cacheObj[idx] = { id: rawValue, ts: Date.now() };
        } else {
          delete cacheObj[idx];
        }
        return;
      }

      // Setup subscription for reactivity
      this.subscribeToTemplate(idx, typeKey, rawValue);
    } else if (allowObject && typeof rawValue === "object") {
      delete cacheObj[idx];
      this.unsubscribeFromTemplate(idx, typeKey);
      if (templateValsObj[idx]) delete templateValsObj[idx];
    }
  }

  /**
   * Resolves and caches the MA entity for a given chip index.
   * @param {number} idx
   */
  async ensureResolvedMaForIndex(idx) {
    const obj = this.host.entityObjs?.[idx];
    if (!obj) return;
    return this.ensureResolvedTemplateForIndex(
      idx,
      "ma",
      obj.music_assistant_entity,
      { cacheStaticString: true },
      this.maResolveCache,
      this.maTemplateValues
    );
  }

  /**
   * Resolves and caches the Volume entity for a given chip index.
   * @param {number} idx
   */
  async ensureResolvedVolForIndex(idx) {
    const obj = this.host.entityObjs?.[idx];
    if (!obj) return;

    if (obj.follow_active_volume) {
      delete this.volResolveCache[idx];
      this.unsubscribeFromTemplate(idx, "vol");
      if (this.volTemplateValues[idx]) delete this.volTemplateValues[idx];
      return;
    }

    return this.ensureResolvedTemplateForIndex(
      idx,
      "vol",
      obj.volume_entity,
      { cacheStaticString: true },
      this.volResolveCache,
      this.volTemplateValues
    );
  }

  /**
   * Resolves and caches the Remote entity for a given chip index.
   * @param {number} idx
   */
  async ensureResolvedRemoteForIndex(idx) {
    const obj = this.host.entityObjs?.[idx];
    if (!obj) return;
    return this.ensureResolvedTemplateForIndex(
      idx,
      "remote",
      obj.remote_entity,
      { cacheStaticString: true },
      this.remoteResolveCache,
      this.remoteTemplateValues
    );
  }

  /**
   * Resolves and caches the hidden_controls array for a given chip index.
   * @param {number} idx
   */
  async ensureResolvedHiddenControlsForIndex(idx) {
    const obj = this.host.entityObjs?.[idx];
    if (!obj) return;
    return this.ensureResolvedTemplateForIndex(
      idx,
      "hidden_controls",
      obj.hidden_controls,
      { allowObject: true },
      this.hiddenControlsResolveCache,
      this.hiddenControlsTemplateValues
    );
  }

  /**
   * Unified helper for resolving and subscribing to UI templates.
   * @param {string} type
   * @param {string} currentContext
   * @param {any} rawConfigData
   */
  syncTemplateSubscriptions(type, currentContext, rawConfigData) {
    if (!this.host?.hass) return;

    const stores = this._getCacheAndVals(type);
    if (!stores) return;

    const { templateVals, cache } = stores;
    const isContextChanged = this.contextKeyMap[type] !== currentContext;
    if (isContextChanged) {
      this.contextKeyMap[type] = currentContext;
    }

    const processItem = (idx, raw) => {
      const hasJsTemplate = typeof raw === "string" && raw.trim().startsWith("[[[");
      if (hasJsTemplate) {
        this.unsubscribeFromTemplate(idx, type);
        const resolvedValue = this.evaluateJsTemplate(raw);

        const currentValue = cache[idx]?.value;
        let isChanged;
        if (typeof resolvedValue === "object" && resolvedValue !== null) {
          isChanged = JSON.stringify(currentValue) !== JSON.stringify(resolvedValue);
        } else if (Number.isNaN(resolvedValue) && Number.isNaN(currentValue)) {
          isChanged = false;
        } else {
          isChanged = currentValue !== resolvedValue;
        }

        if (isChanged) {
          cache[idx] = { value: resolvedValue, ts: Date.now() };
          this.host.requestUpdate();
        }
      } else if (typeof raw === "string" && (raw.includes("{{") || raw.includes("{%"))) {
        if (isContextChanged) {
          this.unsubscribeFromTemplate(idx, type);
          if (templateVals[idx]) delete templateVals[idx];
          if (cache[idx]) delete cache[idx];
        }
        this.subscribeToTemplate(idx, type, raw);
      } else {
        this.unsubscribeFromTemplate(idx, type);
        if (templateVals[idx]) delete templateVals[idx];
        delete cache[idx];
      }
    };

    if (
      type === "always_collapsed" ||
      type === "control_layout" ||
      type === "card_height" ||
      type === "lyrics_background_fade" ||
      type === "lock_screen_controls"
    ) {
      processItem("card", rawConfigData);
    } else if (type === "action_in_menu") {
      const actions = rawConfigData || [];
      actions.forEach((act, idx) => processItem(idx, getActionPlacement(act, idx)));

      let checkIdx = actions.length;
      while (
        this.templateSubscriptions[`${checkIdx}_${type}`] ||
        templateVals[checkIdx] ||
        cache[checkIdx]
      ) {
        this.unsubscribeFromTemplate(checkIdx, type);
        delete templateVals[checkIdx];
        delete cache[checkIdx];
        checkIdx++;
      }
    }
  }

  /**
   * Synchronizes entity template subscriptions across all chips.
   * @param {string} typeKey
   * @param {string} currentContext
   * @param {any[]} [customEntityObjs]
   */
  syncEntityTemplateSubscriptions(typeKey, currentContext, customEntityObjs) {
    const entityObjs = customEntityObjs || this.host?.entityObjs;
    if (!this.host?.hass || !entityObjs) return;

    const contextKey = `entity_${typeKey}`;
    const isContextChanged = this.contextKeyMap[contextKey] !== currentContext;
    if (!isContextChanged) return;

    this.contextKeyMap[contextKey] = currentContext;

    entityObjs.forEach((_, idx) => {
      if (this.templateSubscriptions[`${idx}_${typeKey}`]) {
        this.unsubscribeFromTemplate(idx, typeKey);
      }

      if (typeKey === "ma") {
        this.ensureResolvedMaForIndex(idx);
      } else if (typeKey === "vol") {
        this.ensureResolvedVolForIndex(idx);
      } else if (typeKey === "remote") {
        this.ensureResolvedRemoteForIndex(idx);
      } else if (typeKey === "hidden_controls") {
        this.ensureResolvedHiddenControlsForIndex(idx);
      }
    });
  }

  /**
   * Helper to resolve template entities with fallback.
   * @param {string} entityTemplate
   * @param {string} fallbackEntityId
   * @param {number} idx
   * @param {string} [cacheType='ma']
   * @returns {string | null}
   */
  resolveEntity(entityTemplate, fallbackEntityId, idx, cacheType = "ma") {
    if (!entityTemplate) return null;

    if (
      typeof entityTemplate === "string" &&
      (entityTemplate.includes("{{") ||
        entityTemplate.includes("{%") ||
        entityTemplate.trim().startsWith("[[["))
    ) {
      const cache =
        cacheType === "vol"
          ? this.volResolveCache
          : cacheType === "remote"
            ? this.remoteResolveCache
            : this.maResolveCache;
      const cached = cache?.[idx]?.id;
      return cached || fallbackEntityId;
    }

    return entityTemplate;
  }

  /**
   * Resolves template at action time with fallback to main entity.
   * @param {string} templateString
   * @param {string} fallbackEntityId
   * @returns {Promise<string>}
   */
  async resolveTemplateAtActionTime(templateString, fallbackEntityId) {
    return resolveTemplateAtActionTime(this.host?.hass, templateString, fallbackEntityId);
  }
}
