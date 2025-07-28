import { LitElement, nothing, html } from 'https://unpkg.com/lit-element@3.3.3/lit-element.js?module';

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis,
  e$2 = t$1.ShadowRoot && (void 0 === t$1.ShadyCSS || t$1.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
  s$2 = Symbol(),
  o$3 = new WeakMap();
let n$2 = class n {
  constructor(t, e, o) {
    if (this._$cssResult$ = true, o !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (e$2 && void 0 === t) {
      const e = void 0 !== s && 1 === s.length;
      e && (t = o$3.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$3.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const r$2 = t => new n$2("string" == typeof t ? t : t + "", void 0, s$2),
  i$3 = function (t) {
    for (var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      e[_key - 1] = arguments[_key];
    }
    const o = 1 === t.length ? t[0] : e.reduce((e, s, o) => e + (t => {
      if (true === t._$cssResult$) return t.cssText;
      if ("number" == typeof t) return t;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s) + t[o + 1], t[0]);
    return new n$2(o, t, s$2);
  },
  S$1 = (s, o) => {
    if (e$2) s.adoptedStyleSheets = o.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet);else for (const e of o) {
      const o = document.createElement("style"),
        n = t$1.litNonce;
      void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
    }
  },
  c$2 = e$2 ? t => t : t => t instanceof CSSStyleSheet ? (t => {
    let e = "";
    for (const s of t.cssRules) e += s.cssText;
    return r$2(e);
  })(t) : t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const {
    is: i$2,
    defineProperty: e$1,
    getOwnPropertyDescriptor: h$1,
    getOwnPropertyNames: r$1,
    getOwnPropertySymbols: o$2,
    getPrototypeOf: n$1
  } = Object,
  a$1 = globalThis,
  c$1 = a$1.trustedTypes,
  l$1 = c$1 ? c$1.emptyScript : "",
  p$1 = a$1.reactiveElementPolyfillSupport,
  d$1 = (t, s) => t,
  u$1 = {
    toAttribute(t, s) {
      switch (s) {
        case Boolean:
          t = t ? l$1 : null;
          break;
        case Object:
        case Array:
          t = null == t ? t : JSON.stringify(t);
      }
      return t;
    },
    fromAttribute(t, s) {
      let i = t;
      switch (s) {
        case Boolean:
          i = null !== t;
          break;
        case Number:
          i = null === t ? null : Number(t);
          break;
        case Object:
        case Array:
          try {
            i = JSON.parse(t);
          } catch (t) {
            i = null;
          }
      }
      return i;
    }
  },
  f$1 = (t, s) => !i$2(t, s),
  b = {
    attribute: true,
    type: String,
    converter: u$1,
    reflect: false,
    useDefault: false,
    hasChanged: f$1
  };
Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= new WeakMap();
let y$1 = class y extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t) {
    let s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : b;
    if (s.state && (s.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = true), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(),
        h = this.getPropertyDescriptor(t, i, s);
      void 0 !== h && e$1(this.prototype, t, h);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const {
      get: e,
      set: r
    } = h$1(this.prototype, t) ?? {
      get() {
        return this[s];
      },
      set(t) {
        this[s] = t;
      }
    };
    return {
      get: e,
      set(s) {
        const h = e === null || e === void 0 ? void 0 : e.call(this);
        r !== null && r !== void 0 && r.call(this, s), this.requestUpdate(t, h, i);
      },
      configurable: true,
      enumerable: true
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t = n$1(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t = this.properties,
        s = [...r$1(t), ...o$2(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const t = this[Symbol.metadata];
    if (null !== t) {
      const s = litPropertyMetadata.get(t);
      if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
    }
    this._$Eh = new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      void 0 !== i && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s) {
    const i = [];
    if (Array.isArray(s)) {
      const e = new Set(s.flat(1 / 0).reverse());
      for (const s of e) i.unshift(c$2(s));
    } else void 0 !== s && i.push(c$2(s));
    return i;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return false === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _this$constructor$l;
    this._$ES = new Promise(t => this.enableUpdating = t), this._$AL = new Map(), this._$E_(), this.requestUpdate(), (_this$constructor$l = this.constructor.l) === null || _this$constructor$l === void 0 ? void 0 : _this$constructor$l.forEach(t => t(this));
  }
  addController(t) {
    var _t$hostConnected;
    (this._$EO ??= new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && ((_t$hostConnected = t.hostConnected) === null || _t$hostConnected === void 0 ? void 0 : _t$hostConnected.call(t));
  }
  removeController(t) {
    var _this$_$EO;
    (_this$_$EO = this._$EO) === null || _this$_$EO === void 0 || _this$_$EO.delete(t);
  }
  _$E_() {
    const t = new Map(),
      s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var _this$_$EO2;
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), (_this$_$EO2 = this._$EO) === null || _this$_$EO2 === void 0 ? void 0 : _this$_$EO2.forEach(t => {
      var _t$hostConnected2;
      return (_t$hostConnected2 = t.hostConnected) === null || _t$hostConnected2 === void 0 ? void 0 : _t$hostConnected2.call(t);
    });
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    var _this$_$EO3;
    (_this$_$EO3 = this._$EO) === null || _this$_$EO3 === void 0 || _this$_$EO3.forEach(t => {
      var _t$hostDisconnected;
      return (_t$hostDisconnected = t.hostDisconnected) === null || _t$hostDisconnected === void 0 ? void 0 : _t$hostDisconnected.call(t);
    });
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    const i = this.constructor.elementProperties.get(t),
      e = this.constructor._$Eu(t, i);
    if (void 0 !== e && true === i.reflect) {
      var _i$converter;
      const h = (void 0 !== ((_i$converter = i.converter) === null || _i$converter === void 0 ? void 0 : _i$converter.toAttribute) ? i.converter : u$1).toAttribute(s, i.type);
      this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor,
      e = i._$Eh.get(t);
    if (void 0 !== e && this._$Em !== e) {
      var _t$converter, _this$_$Ej;
      const t = i.getPropertyOptions(e),
        h = "function" == typeof t.converter ? {
          fromAttribute: t.converter
        } : void 0 !== ((_t$converter = t.converter) === null || _t$converter === void 0 ? void 0 : _t$converter.fromAttribute) ? t.converter : u$1;
      this._$Em = e, this[e] = h.fromAttribute(s, t.type) ?? ((_this$_$Ej = this._$Ej) === null || _this$_$Ej === void 0 ? void 0 : _this$_$Ej.get(e)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t, s, i) {
    if (void 0 !== t) {
      var _this$_$Ej2;
      const e = this.constructor,
        h = this[t];
      if (i ??= e.getPropertyOptions(t), !((i.hasChanged ?? f$1)(h, s) || i.useDefault && i.reflect && h === ((_this$_$Ej2 = this._$Ej) === null || _this$_$Ej2 === void 0 ? void 0 : _this$_$Ej2.get(t)) && !this.hasAttribute(e._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t, s, _ref, r) {
    let {
      useDefault: i,
      reflect: e,
      wrapped: h
    } = _ref;
    i && !(this._$Ej ??= new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), true !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), true === e && this._$Em !== t && (this._$Eq ??= new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const t = this.scheduleUpdate();
    return null != t && (await t), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t, s] of this._$Ep) this[t] = s;
        this._$Ep = void 0;
      }
      const t = this.constructor.elementProperties;
      if (t.size > 0) for (const [s, i] of t) {
        const {
            wrapped: t
          } = i,
          e = this[s];
        true !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
      }
    }
    let t = false;
    const s = this._$AL;
    try {
      var _this$_$EO4;
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), (_this$_$EO4 = this._$EO) !== null && _this$_$EO4 !== void 0 && _this$_$EO4.forEach(t => {
        var _t$hostUpdate;
        return (_t$hostUpdate = t.hostUpdate) === null || _t$hostUpdate === void 0 ? void 0 : _t$hostUpdate.call(t);
      }), this.update(s)) : this._$EM();
    } catch (s) {
      throw t = false, this._$EM(), s;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {}
  _$AE(t) {
    var _this$_$EO5;
    (_this$_$EO5 = this._$EO) !== null && _this$_$EO5 !== void 0 && _this$_$EO5.forEach(t => {
      var _t$hostUpdated;
      return (_t$hostUpdated = t.hostUpdated) === null || _t$hostUpdated === void 0 ? void 0 : _t$hostUpdated.call(t);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return true;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach(t => this._$ET(t, this[t])), this._$EM();
  }
  updated(t) {}
  firstUpdated(t) {}
};
y$1.elementStyles = [], y$1.shadowRootOptions = {
  mode: "open"
}, y$1[d$1("elementProperties")] = new Map(), y$1[d$1("finalized")] = new Map(), p$1 !== null && p$1 !== void 0 && p$1({
  ReactiveElement: y$1
}), (a$1.reactiveElementVersions ??= []).push("2.1.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = globalThis,
  i$1 = t.trustedTypes,
  s$1 = i$1 ? i$1.createPolicy("lit-html", {
    createHTML: t => t
  }) : void 0,
  e = "$lit$",
  h = `lit$${Math.random().toFixed(9).slice(2)}$`,
  o$1 = "?" + h,
  n = `<${o$1}>`,
  r = document,
  l = () => r.createComment(""),
  c = t => null === t || "object" != typeof t && "function" != typeof t,
  a = Array.isArray,
  u = t => a(t) || "function" == typeof (t === null || t === void 0 ? void 0 : t[Symbol.iterator]),
  d = "[ \t\n\f\r]",
  f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  v = /-->/g,
  _ = />/g,
  m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
  p = /'/g,
  g = /"/g,
  $ = /^(?:script|style|textarea|title)$/i,
  y = t => function (i) {
    for (var _len = arguments.length, s = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      s[_key - 1] = arguments[_key];
    }
    return {
      _$litType$: t,
      strings: i,
      values: s
    };
  },
  x = y(1),
  T = Symbol.for("lit-noChange"),
  E = Symbol.for("lit-nothing"),
  A = new WeakMap(),
  C = r.createTreeWalker(r, 129);
function P(t, i) {
  if (!a(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$1 ? s$1.createHTML(i) : i;
}
const V = (t, i) => {
  const s = t.length - 1,
    o = [];
  let r,
    l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "",
    c = f;
  for (let i = 0; i < s; i++) {
    const s = t[i];
    let a,
      u,
      d = -1,
      y = 0;
    for (; y < s.length && (c.lastIndex = y, u = c.exec(s), null !== u);) y = c.lastIndex, c === f ? "!--" === u[1] ? c = v : void 0 !== u[1] ? c = _ : void 0 !== u[2] ? ($.test(u[2]) && (r = RegExp("</" + u[2], "g")), c = m) : void 0 !== u[3] && (c = m) : c === m ? ">" === u[0] ? (c = r ?? f, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? m : '"' === u[3] ? g : p) : c === g || c === p ? c = m : c === v || c === _ ? c = f : (c = m, r = void 0);
    const x = c === m && t[i + 1].startsWith("/>") ? " " : "";
    l += c === f ? s + n : d >= 0 ? (o.push(a), s.slice(0, d) + e + s.slice(d) + h + x) : s + h + (-2 === d ? i : x);
  }
  return [P(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), o];
};
class N {
  constructor(_ref, n) {
    let {
      strings: t,
      _$litType$: s
    } = _ref;
    let r;
    this.parts = [];
    let c = 0,
      a = 0;
    const u = t.length - 1,
      d = this.parts,
      [f, v] = V(t, s);
    if (this.el = N.createElement(f, n), C.currentNode = this.el.content, 2 === s || 3 === s) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (r = C.nextNode()) && d.length < u;) {
      if (1 === r.nodeType) {
        if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(e)) {
          const i = v[a++],
            s = r.getAttribute(t).split(h),
            e = /([.?@])?(.*)/.exec(i);
          d.push({
            type: 1,
            index: c,
            name: e[2],
            strings: s,
            ctor: "." === e[1] ? H : "?" === e[1] ? I : "@" === e[1] ? L : k
          }), r.removeAttribute(t);
        } else t.startsWith(h) && (d.push({
          type: 6,
          index: c
        }), r.removeAttribute(t));
        if ($.test(r.tagName)) {
          const t = r.textContent.split(h),
            s = t.length - 1;
          if (s > 0) {
            r.textContent = i$1 ? i$1.emptyScript : "";
            for (let i = 0; i < s; i++) r.append(t[i], l()), C.nextNode(), d.push({
              type: 2,
              index: ++c
            });
            r.append(t[s], l());
          }
        }
      } else if (8 === r.nodeType) if (r.data === o$1) d.push({
        type: 2,
        index: c
      });else {
        let t = -1;
        for (; -1 !== (t = r.data.indexOf(h, t + 1));) d.push({
          type: 7,
          index: c
        }), t += h.length - 1;
      }
      c++;
    }
  }
  static createElement(t, i) {
    const s = r.createElement("template");
    return s.innerHTML = t, s;
  }
}
function S(t, i) {
  var _s$_$Co, _h, _h2, _h2$_$AO;
  let s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : t;
  let e = arguments.length > 3 ? arguments[3] : undefined;
  if (i === T) return i;
  let h = void 0 !== e ? (_s$_$Co = s._$Co) === null || _s$_$Co === void 0 ? void 0 : _s$_$Co[e] : s._$Cl;
  const o = c(i) ? void 0 : i._$litDirective$;
  return ((_h = h) === null || _h === void 0 ? void 0 : _h.constructor) !== o && ((_h2 = h) !== null && _h2 !== void 0 && (_h2$_$AO = _h2._$AO) !== null && _h2$_$AO !== void 0 && _h2$_$AO.call(_h2, false), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = S(t, h._$AS(t, i.values), h, e)), i;
}
class M {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const {
        el: {
          content: i
        },
        parts: s
      } = this._$AD,
      e = ((t === null || t === void 0 ? void 0 : t.creationScope) ?? r).importNode(i, true);
    C.currentNode = e;
    let h = C.nextNode(),
      o = 0,
      n = 0,
      l = s[0];
    for (; void 0 !== l;) {
      var _l;
      if (o === l.index) {
        let i;
        2 === l.type ? i = new R(h, h.nextSibling, this, t) : 1 === l.type ? i = new l.ctor(h, l.name, l.strings, this, t) : 6 === l.type && (i = new z(h, this, t)), this._$AV.push(i), l = s[++n];
      }
      o !== ((_l = l) === null || _l === void 0 ? void 0 : _l.index) && (h = C.nextNode(), o++);
    }
    return C.currentNode = r, e;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class R {
  get _$AU() {
    var _this$_$AM;
    return ((_this$_$AM = this._$AM) === null || _this$_$AM === void 0 ? void 0 : _this$_$AM._$AU) ?? this._$Cv;
  }
  constructor(t, i, s, e) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = (e === null || e === void 0 ? void 0 : e.isConnected) ?? true;
  }
  get parentNode() {
    var _t;
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return void 0 !== i && 11 === ((_t = t) === null || _t === void 0 ? void 0 : _t.nodeType) && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
    t = S(this, t, i), c(t) ? t === E || null == t || "" === t ? (this._$AH !== E && this._$AR(), this._$AH = E) : t !== this._$AH && t !== T && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : u(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t : this.T(r.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var _this$_$AH;
    const {
        values: i,
        _$litType$: s
      } = t,
      e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = N.createElement(P(s.h, s.h[0]), this.options)), s);
    if (((_this$_$AH = this._$AH) === null || _this$_$AH === void 0 ? void 0 : _this$_$AH._$AD) === e) this._$AH.p(i);else {
      const t = new M(e, this),
        s = t.u(this.options);
      t.p(i), this.T(s), this._$AH = t;
    }
  }
  _$AC(t) {
    let i = A.get(t.strings);
    return void 0 === i && A.set(t.strings, i = new N(t)), i;
  }
  k(t) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s,
      e = 0;
    for (const h of t) e === i.length ? i.push(s = new R(this.O(l()), this.O(l()), this, this.options)) : s = i[e], s._$AI(h), e++;
    e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
  }
  _$AR() {
    let t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._$AA.nextSibling;
    let i = arguments.length > 1 ? arguments[1] : undefined;
    for ((_this$_$AP = this._$AP) === null || _this$_$AP === void 0 ? void 0 : _this$_$AP.call(this, false, true, i); t && t !== this._$AB;) {
      var _this$_$AP;
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var _this$_$AP2;
    void 0 === this._$AM && (this._$Cv = t, (_this$_$AP2 = this._$AP) === null || _this$_$AP2 === void 0 ? void 0 : _this$_$AP2.call(this, t));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, e, h) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = E;
  }
  _$AI(t) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
    let s = arguments.length > 2 ? arguments[2] : undefined;
    let e = arguments.length > 3 ? arguments[3] : undefined;
    const h = this.strings;
    let o = false;
    if (void 0 === h) t = S(this, t, i, 0), o = !c(t) || t !== this._$AH && t !== T, o && (this._$AH = t);else {
      const e = t;
      let n, r;
      for (t = h[0], n = 0; n < h.length - 1; n++) r = S(this, e[s + n], i, n), r === T && (r = this._$AH[n]), o ||= !c(r) || r !== this._$AH[n], r === E ? t = E : t !== E && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
    }
    o && !e && this.j(t);
  }
  j(t) {
    t === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === E ? void 0 : t;
  }
}
class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== E);
  }
}
class L extends k {
  constructor(t, i, s, e, h) {
    super(t, i, s, e, h), this.type = 5;
  }
  _$AI(t) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
    if ((t = S(this, t, i, 0) ?? E) === T) return;
    const s = this._$AH,
      e = t === E && s !== E || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive,
      h = t !== E && (s === E || e);
    e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var _this$options;
    "function" == typeof this._$AH ? this._$AH.call(((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class z {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const j = t.litHtmlPolyfillSupport;
j !== null && j !== void 0 && j(N, R), (t.litHtmlVersions ??= []).push("3.3.0");
const B = (t, i, s) => {
  const e = (s === null || s === void 0 ? void 0 : s.renderBefore) ?? i;
  let h = e._$litPart$;
  if (void 0 === h) {
    const t = (s === null || s === void 0 ? void 0 : s.renderBefore) ?? null;
    e._$litPart$ = h = new R(i.insertBefore(l(), t), t, void 0, s ?? {});
  }
  return h._$AI(t), h;
};

var _s$litElementHydrateS;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = {
      host: this
    }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = B(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _this$_$Do;
    super.connectedCallback(), (_this$_$Do = this._$Do) === null || _this$_$Do === void 0 ? void 0 : _this$_$Do.setConnected(true);
  }
  disconnectedCallback() {
    var _this$_$Do2;
    super.disconnectedCallback(), (_this$_$Do2 = this._$Do) === null || _this$_$Do2 === void 0 ? void 0 : _this$_$Do2.setConnected(false);
  }
  render() {
    return T;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_s$litElementHydrateS = s.litElementHydrateSupport) === null || _s$litElementHydrateS === void 0 ? void 0 : _s$litElementHydrateS.call(s, {
  LitElement: i
});
const o = s.litElementPolyfillSupport;
o === null || o === void 0 || o({
  LitElement: i
});
(s.litElementVersions ??= []).push("4.2.0");

// Helper to render a single chip
function renderChip(_ref) {
  let {
    idx,
    selected,
    playing,
    name,
    art,
    icon,
    pinned,
    onChipClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp
  } = _ref;
  return x`
    <button class="chip"
            ?selected=${selected}
            ?playing=${playing}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;">
      <span class="chip-icon">
        ${art ? x`<img class="chip-mini-art" src="${art}" />` : x`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${name}
      </span>
      ${pinned ? x`
            <span class="chip-pin-inside" @click=${e => {
    e.stopPropagation();
    onPinClick(idx, e);
  }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          ` : x`<span class="chip-pin-spacer"></span>`}
    </button>
  `;
}

// Helper to render a group chip (simplified)
function renderGroupChip(_ref2) {
  let {
    idx,
    selected,
    groupName,
    icon,
    pinned,
    onChipClick,
    onIconClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp
  } = _ref2;
  return x`
    <button class="chip group"
            ?selected=${selected}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}>
      <span class="chip-icon">
        ${x`<ha-icon
                      .icon=${icon}
                      style="font-size:28px;"
                      @click=${e => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick(idx, e);
    } else {
      onChipClick(idx);
    }
  }}
                    ></ha-icon>`}
      </span>
      <span class="chip-label">${groupName}</span>
      ${pinned ? x`
            <span class="chip-pin-inside" @click=${e => {
    e.stopPropagation();
    onPinClick(idx, e);
  }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          ` : x`<span class="chip-pin-spacer"></span>`}
    </button>
  `;
}

// Pin/hold logic helpers (timer, etc)
function createHoldToPinHandler(_ref3) {
  let {
    onPin,
    holdTime = 600,
    moveThreshold = 8
  } = _ref3;
  let holdTimer = null;
  let startX = null;
  let startY = null;
  let moved = false;
  return {
    pointerDown: (e, idx) => {
      startX = e.clientX;
      startY = e.clientY;
      moved = false;
      holdTimer = setTimeout(() => {
        if (!moved) {
          onPin(idx, e);
        }
      }, holdTime);
    },
    pointerMove: (e, idx) => {
      if (holdTimer && startX !== null && startY !== null) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > moveThreshold || dy > moveThreshold) {
          moved = true;
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      }
    },
    pointerUp: (e, idx) => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      startX = null;
      startY = null;
      moved = false;
    }
  };
}

function renderActionChipRow(_ref) {
  let {
    actions,
    onActionChipClick
  } = _ref;
  if (!(actions !== null && actions !== void 0 && actions.length)) return E;
  return x`
    <div class="action-chip-row">
      ${actions.map((a, idx) => x`
          <button class="action-chip" @click=${() => onActionChipClick(idx)}>
            ${a.icon ? x`<ha-icon .icon=${a.icon} style="font-size: 22px; margin-right: ${a.name ? '8px' : '0'};"></ha-icon>` : E}
            ${a.name || ""}
          </button>
        `)}
    </div>
  `;
}

function renderControlsRow(_ref) {
  let {
    stateObj,
    showStop,
    shuffleActive,
    repeatActive,
    onControlClick,
    supportsFeature
  } = _ref;
  if (!stateObj) return E;
  const SUPPORT_PAUSE = 1;
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_SHUFFLE = 32768;
  const SUPPORT_REPEAT_SET = 262144;
  const SUPPORT_TURN_ON = 128;
  const SUPPORT_TURN_OFF = 256;
  const SUPPORT_PLAY = 16384;
  return x`
    <div class="controls-row">
      ${supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK) ? x`
        <button class="button" @click=${() => onControlClick("prev")} title="Previous">
          <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
        </button>
      ` : E}
      ${supportsFeature(stateObj, SUPPORT_PAUSE) || supportsFeature(stateObj, SUPPORT_PLAY) ? x`
        <button class="button" @click=${() => onControlClick("play_pause")} title="Play/Pause">
          <ha-icon .icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
        </button>
      ` : E}
      ${showStop ? x`
        <button class="button" @click=${() => onControlClick("stop")} title="Stop">
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
      ` : E}
      ${supportsFeature(stateObj, SUPPORT_NEXT_TRACK) ? x`
        <button class="button" @click=${() => onControlClick("next")} title="Next">
          <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
        </button>
      ` : E}
      ${supportsFeature(stateObj, SUPPORT_SHUFFLE) ? x`
        <button class="button${shuffleActive ? ' active' : ''}" @click=${() => onControlClick("shuffle")} title="Shuffle">
          <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
        </button>
      ` : E}
      ${supportsFeature(stateObj, SUPPORT_REPEAT_SET) ? x`
        <button class="button${repeatActive ? ' active' : ''}" @click=${() => onControlClick("repeat")} title="Repeat">
          <ha-icon .icon=${stateObj.attributes.repeat === "one" ? "mdi:repeat-once" : "mdi:repeat"}></ha-icon>
        </button>
      ` : E}
      ${supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON) ? x`
            <button
              class="button${stateObj.state !== "off" ? " active" : ""}"
              @click=${() => onControlClick("power")}
              title="Power"
            >
              <ha-icon .icon=${"mdi:power"}></ha-icon>
            </button>
          ` : E}
    </div>
  `;
}

function renderVolumeRow(_ref) {
  let {
    isRemoteVolumeEntity,
    showSlider,
    vol,
    onVolumeDragStart,
    onVolumeDragEnd,
    onVolumeChange,
    onVolumeStep,
    moreInfoMenu
  } = _ref;
  return x`
    <div class="volume-row">
      ${isRemoteVolumeEntity ? x`
            <div class="vol-stepper">
              <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
              <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
            </div>
          ` : showSlider ? x`
            <input
              class="vol-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              .value=${vol}
              @mousedown=${onVolumeDragStart}
              @touchstart=${onVolumeDragStart}
              @change=${onVolumeChange}
              @mouseup=${onVolumeDragEnd}
              @touchend=${onVolumeDragEnd}
              title="Volume"
            />
          ` : x`
            <div class="vol-stepper">
              <button class="button" @click=${() => onVolumeStep(-1)} title="Vol Down">–</button>
              <span>${Math.round(vol * 100)}%</span>
              <button class="button" @click=${() => onVolumeStep(1)} title="Vol Up">+</button>
            </div>
          `}
      ${moreInfoMenu}
    </div>
  `;
}

function renderProgressBar(_ref) {
  let {
    progress,
    seekEnabled,
    onSeek,
    collapsed,
    accent,
    height = 6,
    style = ""
  } = _ref;
  // Use `accent` for color, fallback to default if not set
  const barColor = accent || "var(--custom-accent, #ff9800)";
  // Collapsed bar is typically smaller and positioned differently
  if (collapsed) {
    return x`
      <div
        class="collapsed-progress-bar"
        style="width: ${progress * 100}%; background: ${barColor}; height: 4px; ${style}"
      ></div>
    `;
  }
  return x`
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        style="height:${height}px; background:rgba(255,255,255,0.22); ${style}"
        @click=${seekEnabled ? onSeek : null}
        title=${seekEnabled ? "Seek" : ""}
      >
        <div
          class="progress-inner"
          style="width: ${progress * 100}%; background: ${barColor}; height:${height}px;"
        ></div>
      </div>
    </div>
  `;
}

const yampCardStyles = i$3`
  .dim-idle .details,
  .dim-idle .controls-row,
  .dim-idle .volume-row,
  .dim-idle .chip-row,
  .dim-idle .action-chip-row {
    opacity: 0.28 !important;
    transition: opacity 0.5s;
  }
  .more-info-menu {
    display: flex;
    align-items: center;
    margin-right: 0px;
  }
  .more-info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    padding: 0;
    margin: 0 4px;
    background: none;
    border: none;
    color: var(--primary-text-color, #fff);
    font: inherit;
    cursor: pointer;
    outline: none;
  }
  .more-info-btn ha-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    width: 28px;
    height: 28px;
    line-height: 1;
    vertical-align: middle;
    position: relative;
    margin: 0;
    margin-bottom: 2px;
    color: #fff !important;
  }
    :host {
      --custom-accent: var(--accent-color, #ff9800);
    }
    :host([data-match-theme="false"]) {
      --custom-accent: #ff9800;
    }
  .card-artwork-spacer {
    width: 100%;
    flex: 1 1 0;          /* grow *and* shrink with the card height */
    height: auto;         /* let the browser compute height */
    min-height: 180px;        /* allow the spacer to collapse on tiny cards */
   
    pointer-events: none;
  }
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
  }
  .media-bg-dim {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1;
    pointer-events: none;
  }
  .source-menu {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0;
    margin: 0;
  }
  .source-menu-btn {
    background: none;
    border: none;
    color: var(--primary-text-color, #fff);
    font: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1px;
    padding: 2px 10px;
    font-size: 1em;
    outline: none;
  }
  .source-selected {
    min-width: 64px;
    font-weight: 500;
    padding-right: 4px;
    text-align: left;
  }
  .source-dropdown {
    position: absolute;
    top: 32px;
    right: 0;
    left: auto;
    background: var(--card-background-color, #222);
    color: var(--primary-text-color, #fff);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.13);
    min-width: 110px;
    z-index: 11;
    margin-top: 2px;
    border: 1px solid #444;
    overflow: hidden;
    max-height: 220px;
    overflow-y: auto;
  }

  .source-dropdown.up {
    top: auto;
    bottom: 38px;
    border-radius: 8px 8px 8px 8px;
  }  

  .source-option {
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.13s;
    white-space: nowrap;
  }
  .source-option:hover, .source-option:focus {
    background: var(--accent-color, #1976d2);
    color: #fff;
  }

    :host {
      display: block;
      border-radius: 16px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
      background: var(--card-background-color, #222);
      color: var(--primary-text-color, #fff);
      transition: background 0.2s;
      overflow: hidden;
    }

    ha-card.yamp-card {
      display: block;
      border-radius: 16px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
      background: var(--card-background-color, #222);
      color: var(--primary-text-color, #fff);
      transition: background 0.2s;
      overflow: hidden;
    }

    .source-row {
      display: flex;
      align-items: center;
      padding: 0 16px 8px 16px;
      margin-top: 8px;
    }
    .source-select {
      font-size: 1em;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      background: var(--card-background-color, #222);
      color: var(--primary-text-color, #fff);
      outline: none;
      margin-top: 2px;
    }

  .chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 8px;
    background: #fff;
    border-radius: 50%;
    overflow: hidden;
    padding: 0; /* Remove padding */
  }
  .chip:not([selected]):not([playing]) .chip-icon {
    background: transparent !important;
  }
  .chip:not([selected]) .chip-icon ha-icon {
    color: var(--custom-accent) !important; /* Orange for unselected chips */
  }
  .chip[selected]:not([playing]) .chip-icon {
    background: transparent !important;
  }
  .chip[selected]:not([playing]) .chip-icon ha-icon {
    color: #fff !important;
  }
  .chip-icon ha-icon {
    width: 100%;
    height: 100%;
    font-size: 28px !important;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
  .chip-mini-art {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    display: block;
  }
  .chip-row.grab-scroll-active,
  .action-chip-row.grab-scroll-active {
    cursor: grabbing !important;
  }
  .chip-row,
  .action-chip-row {
    cursor: grab;
  }
  .chip-row {
    display: flex;
    gap: 8px; 
    padding: 8px 12px 0 12px;
    margin-bottom: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: none;
    scrollbar-color: var(--accent-color, #1976d2) #222;
    -webkit-overflow-scrolling: touch; /* Enables momentum scrolling on iOS */
    touch-action: pan-x; /* Hint for horizontal pan/swipe on some browsers */
    max-width: 100vw;
  }
  .chip-row::-webkit-scrollbar {
    display: none;
  }
  .chip-row::-webkit-scrollbar-thumb {
    background: var(--accent-color, #1976d2);
    border-radius: 6px;
  }
  .chip-row::-webkit-scrollbar-track {
    background: #222;
  }

  .action-chip-row {
    display: flex;
    gap: 8px;
    padding: 2px 12px 0 12px;
    margin-bottom: 8px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
  }
  .action-chip-row::-webkit-scrollbar {
    display: none;
  }
  .action-chip {
    background: var(--card-background-color, #222);
    opacity: 1;
    border-radius: 8px;
    color: var(--primary-text-color, #fff);
    box-shadow: none !important;
    text-shadow: none !important;
    border: none;
    outline: none;
    padding: 4px 12px;
    font-weight: 500;
    font-size: 0.95em;
    cursor: pointer;
    margin: 4px 0;
    transition: background 0.2s ease, transform 0.1s ease;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  :host([data-match-theme="true"]) .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  :host([data-match-theme="false"]) .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  :host([data-match-theme="true"]) .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: none !important;
    text-shadow: none !important;
  }
  :host([data-match-theme="false"]) .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: none !important;
    text-shadow: none !important;
  }

  .chip {
    display: flex;           /* Flexbox for vertical centering */
    align-items: center;     /* Vertically center content */
    border-radius: 24px;
    padding: 6px 6px 6px 8px;
    background: var(--chip-background, #333);
    color: var(--primary-text-color, #fff);
    cursor: pointer;
    font-weight: 500;
    opacity: 0.85;
    border: none;
    outline: none;
    transition: background 0.2s, opacity 0.2s;
    flex: 0 0 auto;
    white-space: nowrap;
    position: relative;
  }
  .chip:hover {
    background: var(--custom-accent);
    color: #fff;
  }
  .chip:hover .chip-icon ha-icon {
    color: #fff !important;
  }
  .chip-pin {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #fff;
    border-radius: 50%;
    padding: 2px;
    z-index: 2;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--custom-accent);
    box-shadow: 0 1px 5px rgba(0,0,0,0.11);
    cursor: pointer;
    transition: box-shadow 0.18s;
  }
  .chip-pin:hover {
    box-shadow: 0 2px 12px rgba(33,33,33,0.17);
  }
  .chip-pin ha-icon {
    color: var(--custom-accent);
    font-size: 16px;
    background: transparent;
    border-radius: 50%;
    margin: 0;
    padding: 0;
  }
  .chip-pin-inside {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    background: transparent;
    border-radius: 50%;
    padding: 2px;
    cursor: pointer;
  }
  .chip-pin-inside ha-icon {
    color: var(--custom-accent, #ff9800);
    font-size: 17px;
    margin: 0;
  }
  .chip[selected] .chip-pin-inside ha-icon {
    color: #fff !important;  /* White pin icon for selected (orange) chips */
  }
  .chip-pin:hover ha-icon,
  .chip-pin-inside:hover ha-icon {
    color: #fff !important;
  }
  /* When the user hovers the chip, force the pin icon white */
  .chip:hover .chip-pin ha-icon,
  .chip:hover .chip-pin-inside ha-icon {
    color: #fff !important;
  }    
  .chip-pin-spacer {
    display: flex;
    width: 24px;
    min-width: 24px;
    height: 1px;
  }
    .chip[playing] {
      padding-right: 6px;
    }
      .chip[selected] {
        background: var(--custom-accent);
        color: #fff;
        opacity: 1;
      }
  /* Grouped master chip shows a count instead of artwork/icon */
  .chip-icon.group-icon {
    background: var(--custom-accent);
    color: #fff !important;
    position: relative;
  }
  .group-count {
    font-weight: 700;
    font-size: 0.9em;
    line-height: 28px; /* matches .chip-icon width */
    text-align: center;
    width: 100%;
    color: inherit;
  }
    .media-artwork-bg {
      position: relative;
      width: 100%;
      aspect-ratio: 1.75/1;
      overflow: hidden;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: top center;
    }

    .artwork {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      background: #222;
      
    }
    .details {
      padding: 0 16px 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
      min-height: 48px;
    }
    /* 
    .details .title {
      padding-top: 8px;
    }
    */
    .progress-bar-container {
      padding-left: 24px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    /*
    .title {
      font-size: 1.1em;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    */

    .details .title,
    .title { 
      font-size: 1.1em;
      font-weight: 600;
      line-height: 1.2;
      white-space: normal !important;
      word-break: break-word;
      overflow: visible;
      text-overflow: unset;
      display: block;
      padding-top: 8px;
    }
    .artist {
      font-size: 1em;
      font-weight: 400;
      color: var(--secondary-text-color, #aaa);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #fff !important;
    }
    .controls-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 4px 16px;
    }
    .button {
      background: none;
      border: none;
      color: inherit;
      font-size: 1.5em;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .button:active {
      background: rgba(0,0,0,0.10);
    }
    .button.active ha-icon,
    .button.active {
      color: var(--custom-accent) !important;
    }
    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
      margin: 8px 0;
      cursor: pointer;
      position: relative;
      box-shadow: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
    }
    .progress-inner {
      height: 100%;
      background: var(--custom-accent);
      border-radius: 3px 0 0 3px;
      box-shadow: 0 0 8px 2px rgba(0,0,0,0.24);
    }
    .volume-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px 12px 25px;
      justify-content: space-between;
    }
    .vol-slider {
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: hsla(0, 0.00%, 100.00%, 0.22);
      border-radius: 3px;
      outline: none;
      box-shadow: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
      flex: 1 1 auto;
      min-width: 80px;
      max-width: none;
      margin-right: 12px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .volume-row .source-menu {
      flex: 0 0 auto;
    }

    /* Webkit browsers (Chrome, Safari, Edge) */
    .vol-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--custom-accent);
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      border: 2px solid #fff;
    }
    /* Firefox */
    .vol-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--custom-accent);
      cursor: pointer;
      border: 2px solid #fff;
    }
    .vol-slider::-moz-range-track {
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
    }
    /* IE and Edge (legacy) */
    .vol-slider::-ms-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--custom-accent);
      cursor: pointer;
      border: 2px solid #fff;
    }
    .vol-slider::-ms-fill-lower,
    .vol-slider::-ms-fill-upper {
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
    }

    /* Make .vol-slider thumbs easier to grab on touch devices without changing their visual appearance */
    @media (pointer: coarse) {
      .vol-slider::-webkit-slider-thumb {
        box-shadow: 0 0 0 18px rgba(0,0,0,0);
      }
      .vol-slider::-moz-range-thumb {
        box-shadow: 0 0 0 18px rgba(0,0,0,0);
      }
      .vol-slider::-ms-thumb {
        box-shadow: 0 0 0 18px rgba(0,0,0,0);
      }
    }
    /* .volume-row .source-menu block moved and replaced above for consistency */
    .vol-stepper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .vol-stepper .button {
      min-width: 36px;
      min-height: 36px;
      font-size: 1.5em;
      padding: 6px 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }    

    /* Consolidated Light Mode Styles */
    @media (prefers-color-scheme: light) {
      :host {
        background: var(--card-background-color, #fff);
      }
      .chip {
        background: #f0f0f0;
        color: #222;
      }
      :host([data-match-theme="true"]) .chip[selected] {
        background: var(--accent-color, #1976d2);
        color: #fff;
      }
      .artwork {
        background: #eee;
      }
      .progress-bar {
        background: #eee;
      }
      .source-menu-btn {
        color: #222;
      }
      .source-dropdown {
        background: #fff;
        color: #222;
        border: 1px solid #bbb;
      }
      .source-option {
        color: #222 !important;
        background: #fff !important;
        transition: background 0.13s, color 0.13s;
      }
      .source-option:hover,
      .source-option:focus {
        background: var(--custom-accent) !important;
        color: #222 !important;
      }
      .source-select {
        background: #fff;
        color: #222;
        border: 1px solid #aaa;
      }
      .action-chip {
        background: var(--card-background-color, #fff);
        opacity: 1;
        border-radius: 8px;
        color: var(--primary-text-color, #222);
        box-shadow: none !important;
        text-shadow: none !important;
        border: none;
        outline: none;
      }
      .action-chip:active {
        background: var(--accent-color, #1976d2);
        color: #fff;
        opacity: 1;
        transform: scale(0.98);
        box-shadow: none !important;
        text-shadow: none !important;
      }
      /* Keep source menu text white when expanded (matches controls) */
      .card-lower-content:not(.collapsed) .source-menu-btn,
      .card-lower-content:not(.collapsed) .source-selected {
        color: #fff !important;
      }
      /* Only for collapsed cards: override details/title color */
      /* .card-lower-content.collapsed .details .title,
      .card-lower-content.collapsed .title {
        color: #222 !important;
      } */
    }
    .artwork-dim-overlay {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, 
    rgba(0,0,0,0.0) 0%,
    rgba(0,0,0,0.40) 55%,
    rgba(0,0,0,0.70) 100%);
    z-index: 2;
  }    
  .card-lower-content-container {
    position: relative;
    width: 100%;
    min-height: auto; /* allow vertical auto‑resize */
    height: 100%;     /* stretch to fill grid-assigned rows */
    display: flex;    /* enables spacer to grow */
    flex: 1 1 auto;
    flex-direction: column;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
  }
  .card-lower-content-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
  }
  .card-lower-fade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.92) 100%
    );
  }
  .card-lower-content {
    position: relative;
    z-index: 2;
  }
  .card-lower-content.transitioning .details,
  .card-lower-content.transitioning .card-artwork-spacer {
    transition: opacity 0.3s;
  }
  /* Show details (title) when collapsed (but hide artist/artwork spacer) */
  .card-lower-content.collapsed .details {
    opacity: 1;
    pointer-events: auto;
  }
  .card-lower-content.collapsed .details {
    margin-right: 120px;  /* Reserve space for floating album artwork */
    transition: margin 0.2s;
  }
  @media (max-width: 420px) {
    .card-lower-content.collapsed .details {
      margin-right: 74px; /* Reserve space for floating art on small screens */
    }
  }
  .card-lower-content.collapsed .card-artwork-spacer {
    opacity: 0;
    pointer-events: none;
  }

  /* Stretch the lower content to fill the card so flex‑grown elements
     like .card-artwork-spacer can expand and consume extra vertical space */
  .card-lower-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

    /* Force white text for important UI elements */
    .details,
    .title,
    .artist,
    .controls-row,
    .button,
    .vol-stepper span {
      color: #fff !important;
    }
  .media-artwork-placeholder ha-icon {
    width: 104px !important;
    height: 104px !important;
    min-width: 104px !important;
    min-height: 104px !important;
    max-width: 104px !important;
    max-height: 104px !important;
    display: block;
  }
  .media-artwork-placeholder ha-icon svg {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }
  .card-lower-content.collapsed .collapsed-artwork-container {
    position: absolute;
    top: 10px;
    right: 18px;
    width: 110px;
    height: calc(100% - 120px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 5;
    background: transparent !important;
    pointer-events: none;
    box-shadow: none !important;
    padding: 0;
    transition: background 0.4s;
  }
  .card-lower-content.collapsed .collapsed-artwork {
    width: 98px !important;
    height: 98px !important;
    border-radius: 14px !important;
    object-fit: cover !important;
    background: transparent !important;
    box-shadow: 0 1px 6px rgba(0,0,0,0.22);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 2px;
  }
  .card-lower-content.collapsed .controls-row {
    max-width: calc(100% - 120px); /* Leaves room for floating artwork + margin */
    margin-right: 110px;            /* Visually lines up with artwork edge */
  }
  .card-lower-content-bg {
    height: 100% !important;
  }
  
  @media (max-width: 420px) {
    .card-lower-content.collapsed .controls-row {
      max-width: 100% !important;
      margin-right: 0 !important;
    }
    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 70px !important;
      height: 70px !important;
      right: 10px !important;
    }
    .card-lower-content.collapsed .collapsed-artwork {
      width: 62px !important;
      height: 62px !important;
    }
  }

  .collapsed-progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background: var(--custom-accent, #ff9800);
    border-radius: 0 0 12px 12px;
    z-index: 99;
    transition: width 0.2s linear;
    pointer-events: none;
  }
  /* Options overlay is card-contained, not fixed to viewport */
  .entity-options-overlay {
    position: absolute; /* Now relative to the card, not the page */
    left: 0; right: 0; top: 0; bottom: 0;
    z-index: 30;
    background: rgba(15,18,30,0.70); /* Increased darkening for clarity */
    display: flex;
    align-items: flex-end;
    justify-content: center;
    /* No blur/backdrop, just a hint of background */
  }
  /* Options sheet is scrollable and clipped to card, not the page */
  .entity-options-sheet {
    background: none;
    border-radius: 16px 16px 0 0;
    box-shadow: none;
    width: 98%;
    max-width: 430px;
    margin-bottom: 1.5%;
    padding: 18px 8px 8px 8px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    /* Sheet max-height is now relative to the card, so scrolling stays inside */
    max-height: 85%;
    min-height: 90px;
    overflow-y: auto !important;
    overflow-x: hidden;
    overscroll-behavior: contain;
  }
  .entity-options-sheet {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge Legacy */
  }
  .entity-options-sheet::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  .entity-options-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 18px;
    text-align: center;
    color: #fff;
    background: none;
    text-shadow: 0 2px 8px #0009;
  }
  .entity-options-item {
    background: none;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 500;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color 0.13s, text-shadow 0.13s;
    text-align: center;
    text-shadow: 0 2px 8px #0009;
  }

  .entity-options-item:hover {
    color: var(--custom-accent, #ff9800) !important;
    text-shadow: none !important;
    background: none;
  }

  /* Source index letter button accessibility and hover styling */
  .source-index-letter:focus {
    background: rgba(255,255,255,0.11);
    outline: 1px solid #ff9800;
  }

  /* Floating source index and source list overlay styles (updated) */
  .entity-options-sheet.source-list-sheet {
    position: relative;
    overflow: visible !important;
  }
  .source-list-scroll {
    overflow-y: auto;
    max-height: 340px;
    scrollbar-width: none;           /* Firefox: hide scrollbar */
  }
  .source-list-scroll::-webkit-scrollbar {
    display: none !important;        /* Chrome/Safari/Edge: hide scrollbar */
  }
  .floating-source-index.grab-scroll-active,
  .floating-source-index.grab-scroll-active * {
    cursor: grabbing !important;
  }
  .floating-source-index {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    pointer-events: auto;          /* was none – allow wheel capture */
    overscroll-behavior: contain;  /* stop wheel bubbling */
    z-index: 10;
    padding: 12px 8px 8px 0;
    overflow-y: auto;
    max-height: 100%;
    min-width: 32px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge */
    cursor: grab;
  }
  .floating-source-index::-webkit-scrollbar {
    display: none !important; /* Chrome, Safari, Opera */
  }
  .floating-source-index .source-index-letter {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.08em;
    cursor: pointer;
    margin: 2px 0;
    padding: 2px 2px;
    pointer-events: auto;
    outline: none;
    transition: color 0.13s, background 0.13s, transform 0.16s cubic-bezier(.35,1.8,.4,1.04);
    transform: scale(1);
    z-index: 1;
    min-height: 32px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: 3;
  }
  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: 2;
  }
  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.10);
    z-index: 1;
  }
  .floating-source-index .source-index-letter::after {
    display: none !important;
  }
  .floating-source-index .source-index-letter:hover,
  .floating-source-index .source-index-letter:focus {
    color: #fff;
  }

  .group-toggle-btn {
    background: none;
    border: 1px solid currentColor;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15em;
    line-height: 1;
    margin-right: 10px;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
    overflow: hidden;
  }
  .group-toggle-btn span,
  .group-toggle-btn .group-toggle-fix {
    position: relative;
    left: 0.5px;
  }
  .group-toggle-btn:hover {
    background: rgba(255,255,255,0.1);
  }

  /* Invisible master button to keep layout aligned */
  .group-toggle-transparent {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    color: transparent !important;
    pointer-events: none !important;
  }
  .group-toggle-transparent:hover {
    background: none !important;   /* suppress hover tint */
  }

  /* Force white text/icons in the grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: #fff !important;
  }

  /* Ensure the + / – toggle icon and border are white */
  .group-toggle-btn {
    color: #fff !important;
    border-color: #fff !important;
  }
  .group-toggle-btn:hover {
    background: rgba(255,255,255,0.15);
  }
  .entity-options-search {
    padding: 2px 0 4px 0;
  }
  .entity-options-search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px !important;
    margin-top: 2px;
  }
  .entity-options-search-result {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0 9px 0;
    border-bottom: 1px solid #2227;
    font-size: 1.10em;
    color: var(--primary-text-color, #fff);
    background: none;
  }
  .entity-options-search-result:last-child {
    border-bottom: none;
  }
  .entity-options-search-thumb {
    height: 38px;
    width: 38px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 1px 5px rgba(0,0,0,0.16);
    margin-right: 12px;
  }
  .entity-options-search-play {
    min-width: 34px;
    font-size: 1.13em;
    border: none;
    background: var(--custom-accent, #ff9800);
    color: #fff !important;
    border-radius: 10px;
    padding: 6px 10px 6px 10px;
    margin-left: 7px;
    cursor: pointer;
    box-shadow: 0 1px 5px rgba(0,0,0,0.13);
    transition: background 0.2s, color 0.2s;
    text-shadow: 0 2px 8px #0008;
  }
  .entity-options-search-play:hover,
  .entity-options-search-play:focus {
    background: #fff;
    color: var(--custom-accent, #ff9800) !important;
  }
  .entity-options-search-input {
    border: 1px solid #333;
    border-radius: 8px;
    background: var(--card-background-color, #222);
    color: var(--primary-text-color, #fff);
    font-size: 1.12em;
    outline: none;
    transition: border 0.13s;
    margin-right: 7px;
    /* padding removed/overridden below for options sheet */
    box-sizing: border-box;
  }
  .entity-options-search-row .entity-options-search-input {
    padding: 4px 10px;
    height: 32px; 
    min-height: 32px;
    line-height: 1.18;
    box-sizing: border-box;
    border: 1.5px solid var(--custom-accent, #ff9800) !important;
    background: #232323 !important;
    color: #fff !important;
    transition: border 0.13s, background 0.13s;
    outline: none !important;
  }
  .entity-options-search-input:focus {
    border: 1.5px solid var(--custom-accent, #ff9800) !important;
    background: #232323 !important;
    color: #fff !important;
    outline: none !important;
  }
  .entity-options-search-loading,
  .entity-options-search-error,
  .entity-options-search-empty {
    padding: 8px 6px 8px 6px;
    font-size: 1.09em;
    opacity: 0.90;
    color: var(--primary-text-color, #fff);
    background: none;
    text-align: left;
  }
  .entity-options-search-error {
    color: #e44747 !important;
    font-weight: 500;
  }
  .entity-options-search-empty {
    color: #999 !important;
    font-style: italic;
  }
  .entity-options-search-row .entity-options-item {
    height: 32px;
    min-height: 32px;
    box-sizing: border-box;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.12em;
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Style for search filter chips */
  .search-filter-chips .chip {
    color: #fff !important;
  }
  .search-filter-chips .chip[selected],
  .search-filter-chips .chip[style*="background: var(--customAccent"],
  .search-filter-chips .chip[style*="background: var(--custom-accent"] {
    color: #111 !important;
  }


.entity-options-sheet .search-filter-chips .chip:not([selected]) {
  color: #fff !important;
}
.entity-options-sheet .search-filter-chips .chip[selected] {
  color: #111 !important;
}
  
.entity-options-sheet .search-filter-chips .chip {
  text-align: center !important;
  justify-content: center !important;
}

.entity-options-sheet .entity-options-search-results {
  min-height: 210px;   
  /* Remove max-height and overflow-y */
}


  /* Highlight search filter chips on hover in options sheet */
.entity-options-sheet .search-filter-chips .chip:hover {
  background: var(--custom-accent, #ff9800) !important;
  color: #111 !important;
}

.entity-options-sheet .search-filter-chips .chip:hover {
  opacity: 1 !important;
}
/* --- Make the search header fixed and results flex --- */
.entity-options-sheet .entity-options-search {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.entity-options-sheet .entity-options-search-row,
.entity-options-sheet .search-filter-chips {
  flex: 0 0 auto;          /* never grow/shrink */
}

.entity-options-sheet .entity-options-search-results {
  flex: 1 1 auto;          /* take remaining space */
  /* keeps earlier min-height */
}
/* Invisible placeholder rows (keep height, hide divider) */
/* Placeholder rows keep layout height even when invisible */
.entity-options-search-result.placeholder {
  visibility: hidden;                              /* hide contents */
  border-bottom: 1px solid transparent !important; /* divider invisible */
  min-height: 46px;                                /* match real row height */
  box-sizing: border-box;
}
;

/* Artist text becomes clickable when it can open a search */
.clickable-artist {
  cursor: pointer;
}
.clickable-artist:hover {
  text-decoration: underline;
}`;

/**
 * Renders the search sheet UI for media search.
 *
 * @param {Object} opts
 * @param {boolean} opts.open - Whether the search sheet is visible.
 * @param {string} opts.query - Current search query value.
 * @param {Function} opts.onQueryInput - Handler for query input change.
 * @param {Function} opts.onSearch - Handler for search action.
 * @param {Function} opts.onClose - Handler for closing the sheet.
 * @param {boolean} opts.loading - Loading state for search.
 * @param {Array} opts.results - Search result items (array of media items).
 * @param {Function} opts.onPlay - Handler to play a media item.
 * @param {string} [opts.error] - Optional error message.
 */
function renderSearchSheet(_ref) {
  let {
    open,
    query,
    onQueryInput,
    onSearch,
    onClose,
    loading,
    results,
    onPlay,
    error
  } = _ref;
  if (!open) return E;
  return x`
    <div class="search-sheet">
      <div class="search-sheet-header">
        <input
          type="text"
          .value=${query || ""}
          @input=${onQueryInput}
          placeholder="Search music..."
          autofocus
        />
        <button @click=${onSearch} ?disabled=${loading || !query}>Search</button>
        <button @click=${onClose} title="Close Search">✕</button>
      </div>
      ${loading ? x`<div class="search-sheet-loading">Loading...</div>` : E}
      ${error ? x`<div class="search-sheet-error">${error}</div>` : E}
      <div class="search-sheet-results">
        ${(results || []).length === 0 && !loading ? x`<div class="search-sheet-empty">No results.</div>` : (results || []).map(item => x`
                <div class="search-sheet-result">
                  <img
                    class="search-sheet-thumb"
                    src=${item.thumbnail}
                    alt=${item.title}
                  />
                  <span class="search-sheet-title">${item.title}</span>
                  <button class="search-sheet-play" @click=${() => onPlay(item)}>
                    ▶
                  </button>
                </div>
              `)}
      </div>
    </div>
  `;
}

// Supported feature flags
const SUPPORT_PREVIOUS_TRACK = 16;
const SUPPORT_NEXT_TRACK = 32;
const SUPPORT_TURN_ON = 128;
const SUPPORT_TURN_OFF = 256;
const SUPPORT_STOP = 4096;
const SUPPORT_SHUFFLE = 32768;
const SUPPORT_GROUPING = 524288;
const SUPPORT_REPEAT_SET = 262144;

// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
class YetAnotherMediaPlayerEditor extends i {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _entityEditorIndex: {
        type: Number
      }
    };
  }
  constructor() {
    super();
    this._entityEditorIndex = null;
  }
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }
  setConfig(config) {
    const rawEntities = config.entities ?? [];
    const normalizedEntities = rawEntities.map(e => typeof e === "string" ? {
      entity_id: e
    } : e);
    this._config = {
      ...config,
      entities: normalizedEntities
    };
  }
  _updateConfig(key, value) {
    const newConfig = {
      ...this._config,
      [key]: value
    };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: {
        config: newConfig
      },
      bubbles: true,
      composed: true
    }));
  }
  c;
  _updateEntityProperty(key, value) {
    const entities = [...(this._config.entities ?? [])];
    const idx = this._entityEditorIndex;
    if (entities[idx]) {
      entities[idx] = {
        ...entities[idx],
        [key]: value
      };
      this._updateConfig("entities", entities);
    }
  }
  static get styles() {
    return i$3`
        .form-row {
          padding: 12px 16px;
          gap: 8px;
        }
        /* add to rows with multiple elements to align the elements horizontally */
        .form-row-multi-column {
          display: flex;
          /*gap: 12px;*/
        }
        .form-row-multi-column > div {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* reduced padding for entity selection subrows */
        .entity-row {
          padding: 6px;
        }
        /* visually isolate the list of entity controls */
        .entity-group {
          background: var(--card-background-color, #f7f7f7);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }
        /* wraps the entity selector and edit button */
        .entity-row-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        /* allow a selector to fill all available space when combined with other elements */
        .selector-grow {
          flex: 1;
          display: flex;
        }
        .selector-grow ha-selector, .selector-grow ha-entity-picker {
          width: 100%;
        } 
        .entity-editor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
        }
        .entity-editor-title {
          font-weight: 500;
          font-size: 1.1em;

          line-height: 1;
          margin-top: 7px; /* tweak to align with icon */

        }
        .full-width {
          width: 100%;
        } 
      `;
  }
  render() {
    if (!this._config) return x``;
    if (this._entityEditorIndex !== null) {
      var _this$_config$entitie;
      const entity = (_this$_config$entitie = this._config.entities) === null || _this$_config$entitie === void 0 ? void 0 : _this$_config$entitie[this._entityEditorIndex];
      return this._renderEntityEditor(entity);
    }
    return this._renderMainEditor();
  }
  _renderMainEditor() {
    if (!this._config) return x``;
    let entities = [...(this._config.entities ?? [])];

    // Append a blank row only for rendering (not saved)
    if (entities.length === 0 || entities[entities.length - 1].entity_id) {
      entities.push({
        entity_id: ""
      });
    }
    return x`
        <div class="form-row entity-group">
          Entities*
          ${entities.map((ent, idx) => {
      var _this$_config$entitie2;
      return x`
            <div class="entity-row-inner">
              <div class="selector-grow">
                ${
      /* ha-entity-picker will show "[Object object]" for entities with extra properties,
         so we'll get around that by using ha-selector. However ha-selector always renders 
         as a required field for some reason. This is confusing for the last entity picker, 
         used to add a new entity, which is always blank and not required. So for the last
         last entity only, we'll use ha-entity-picker. This entity will never have extra
         properties, because as soon as it's populated, a new blank entity is added below it
      */
      idx === entities.length - 1 && !ent.entity_id ? x`
                      <ha-entity-picker
                        .hass=${this.hass}
                        .value=${ent.entity_id}
                        .includeDomains=${["media_player"]}

                        .excludeEntities=${((_this$_config$entitie2 = this._config.entities) === null || _this$_config$entitie2 === void 0 ? void 0 : _this$_config$entitie2.map(e => e.entity_id)) ?? []}

                        clearable
                        @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                      ></ha-entity-picker>
                    ` : x`
                      <ha-selector
                        .hass=${this.hass}
                        .selector=${{
        entity: {
          domain: "media_player"
        }
      }}
                        .value=${ent.entity_id}

                        clearable
                        @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                      ></ha-selector>
                    `}
              </div>
              <mwc-icon-button
                .disabled=${!ent.entity_id}
                title="Edit Entity Settings"
                @click=${() => this._onEditEntity(idx)}
              >
                <ha-icon icon="mdi:pencil"></ha-icon>
              </mwc-icon-button>
            </div>
          `;
    })}
        </div>
  
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="match-theme-toggle"
              .checked=${this._config.match_theme ?? false}
              @change=${e => this._updateConfig("match_theme", e.target.checked)}
            ></ha-switch>
            <span>Match Theme</span>
          </div>
          <div>
            <ha-switch
              id="alternate-progress-bar-toggle"
              .checked=${this._config.alternate_progress_bar ?? false}
              @change=${e => this._updateConfig("alternate_progress_bar", e.target.checked)}
            ></ha-switch>
            <span>Alternate Progress Bar</span>
          </div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="collapsed-on-idle-toggle"
              .checked=${this._config.collapsed_on_idle ?? false}
              @change=${e => this._updateConfig("collapsed_on_idle", e.target.checked)}
            ></ha-switch>
            <span>Collapse on Idle</span>
          </div>
          <div>
            <ha-switch
              id="always-collapsed-toggle"
              .checked=${this._config.always_collapsed ?? false}
              @change=${e => this._updateConfig("always_collapsed", e.target.checked)}
            ></ha-switch>
            <span>Always Collapsed</span>
          </div>
        </div>
   
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "slider",
          label: "Slider"
        }, {
          value: "stepper",
          label: "Stepper"
        }]
      }
    }}
            .value=${this._config.volume_mode ?? "slider"}
            label="Volume Mode"
            @value-changed=${e => this._updateConfig("volume_mode", e.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "auto",
          label: "Auto"
        }, {
          value: "always",
          label: "Always"
        }]
      }
    }}
            .value=${this._config.show_chip_row ?? "auto"}
            label="Show Chip Row"
            @value-changed=${e => this._updateConfig("show_chip_row", e.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="hold-to-pin-toggle"
              .checked=${this._config.hold_to_pin ?? false}
              @change=${e => this._updateConfig("hold_to_pin", e.target.checked)}
            ></ha-switch>
            <span>Hold to Pin</span>
          </div>
        </div>   
        <div class="form-row">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.idle_image ?? ""}
             .includeDomains=${["camera", "image"]}
            label="Idle Image Entity"
            clearable
            @value-changed=${e => this._updateConfig("idle_image", e.detail.value)}
          ></ha-entity-picker>
        </div>
      `;
  }
  _renderEntityEditor(entity) {
    var _this$hass;
    const stateObj = (_this$hass = this.hass) === null || _this$hass === void 0 || (_this$hass = _this$hass.states) === null || _this$hass === void 0 ? void 0 : _this$hass[entity === null || entity === void 0 ? void 0 : entity.entity_id];
    const showGroupVolume = this._supportsFeature(stateObj, SUPPORT_GROUPING);
    return x`
        <div class="entity-editor-header">
          <mwc-icon-button @click=${this._onBackFromEntityEditor} title="Back">
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </mwc-icon-button>
          <div class="entity-editor-title">Edit Entity</div>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
      entity: {
        domain: "media_player"
      }
    }}
            .value=${(entity === null || entity === void 0 ? void 0 : entity.entity_id) ?? ""}
          
            disabled
          ></ha-selector>
        </div>


        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="Name"
            .value=${(entity === null || entity === void 0 ? void 0 : entity.name) ?? ""}
            @input=${e => this._updateEntityProperty("name", e.target.value)}
          ></ha-textfield>
        </div>


        ${showGroupVolume ? x`
          <div class="form-row">
            <ha-switch
              id="group-volume-toggle"
              .checked=${(entity === null || entity === void 0 ? void 0 : entity.group_volume) ?? true}
              @change=${e => this._updateEntityProperty("group_volume", e.target.checked)}
            ></ha-switch>
            <label for="group-volume-toggle">Group Volume</label>
          </div>
        ` : E}

        <div class="form-row">

          <ha-entity-picker
            .hass=${this.hass}
            .value=${(entity === null || entity === void 0 ? void 0 : entity.volume_entity) ?? (entity === null || entity === void 0 ? void 0 : entity.entity_id) ?? ""}

            .includeDomains=${["media_player"]}
            label="Volume Entity"
            clearable
            @value-changed=${e => {
      const value = e.detail.value;
      this._updateEntityProperty("volume_entity", value);
      if (!value || value === entity.entity_id) {
        // sync_power is meaningless in these cases

        this._updateEntityProperty("sync_power", false);
      }
    }}
          ></ha-entity-picker>
        </div>


        ${entity !== null && entity !== void 0 && entity.volume_entity && entity.volume_entity !== entity.entity_id ? x`
              <div class="form-row form-row-multi-column">
                <div>
                  <ha-switch
                    id="sync-power-toggle"
                    .checked=${(entity === null || entity === void 0 ? void 0 : entity.sync_power) ?? false}
                    @change=${e => this._updateEntityProperty("sync_power", e.target.checked)}
                  ></ha-switch>
                  <label for="sync-power-toggle">Sync Power</label>
                </div>
              </div>
            ` : E}
        </div>
      `;
  }
  _onEntityChanged(index, newValue) {
    const original = this._config.entities ?? [];
    const updated = [...original];
    if (!newValue) {
      // Remove empty row
      updated.splice(index, 1);
    } else {
      updated[index] = {
        ...updated[index],
        entity_id: newValue
      };
    }

    // Always strip blank row before writing to config
    const cleaned = updated.filter(e => e.entity_id && e.entity_id.trim() !== "");
    this._updateConfig("entities", cleaned);
  }
  _onEditEntity(index) {
    this._entityEditorIndex = index;
  }
  _onBackFromEntityEditor() {
    this._entityEditorIndex = null;
  }
  _onToggleChanged(e) {
    const newConfig = {
      ...this._config,
      always_collapsed: e.target.checked
    };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: {
        config: newConfig
      }
    }));
  }
}
customElements.define("yet-another-media-player-editor-beta", YetAnotherMediaPlayerEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "YAMP is a multi-entity media card with custom actions"
});
class YetAnotherMediaPlayerCard extends LitElement {
  _handleChipPointerDown(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerDown(e, idx);
    }
  }
  _handleChipPointerMove(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerMove(e, idx);
    }
  }
  _handleChipPointerUp(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerUp(e, idx);
    }
  }
  _hoveredSourceLetterIndex = null;
  // Stores the last grouping master id for group chip selection
  _lastGroupingMasterId = null;
  _debouncedVolumeTimer = null;
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }

  // Scroll to first source option starting with the given letter
  _scrollToSourceLetter(letter) {
    // Find the options sheet (source list) in the shadow DOM
    const menu = this.renderRoot.querySelector('.entity-options-sheet');
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('.entity-options-item'));
    const item = items.find(el => (el.textContent || "").trim().toUpperCase().startsWith(letter));
    if (item) item.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  // Show Stop button if supported and layout allows.
  _shouldShowStopButton(stateObj) {
    var _this$renderRoot;
    if (!this._supportsFeature(stateObj, SUPPORT_STOP)) return false;
    // Show if wide layout or few controls.
    const row = (_this$renderRoot = this.renderRoot) === null || _this$renderRoot === void 0 ? void 0 : _this$renderRoot.querySelector('.controls-row');
    if (!row) return true; // Default to show if can't measure
    const minWide = row.offsetWidth > 480;
    const controls = this._countMainControls(stateObj);
    // Limit Stop visibility on compact layouts.
    return minWide || controls <= 5;
  }
  _countMainControls(stateObj) {
    let count = 0;
    if (this._supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK)) count++;
    count++;
    if (this._supportsFeature(stateObj, SUPPORT_NEXT_TRACK)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_SHUFFLE)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_REPEAT_SET)) count++;
    if (this._supportsFeature(stateObj, SUPPORT_TURN_OFF) || this._supportsFeature(stateObj, SUPPORT_TURN_ON)) count++;
    return count;
  }
  get sortedEntityIds() {
    return [...this.entityIds].sort((a, b) => {
      const tA = this._playTimestamps[a] || 0;
      const tB = this._playTimestamps[b] || 0;
      return tB - tA;
    });
  }

  // Return array of groups, ordered by most recent play
  get groupedSortedEntityIds() {
    if (!this.entityIds || !Array.isArray(this.entityIds)) return [];
    const map = {};
    for (const id of this.entityIds) {
      const key = this._getGroupKey(id);
      if (!map[key]) map[key] = {
        ids: [],
        ts: 0
      };
      map[key].ids.push(id);
      map[key].ts = Math.max(map[key].ts, this._playTimestamps[id] || 0);
    }
    return Object.values(map).sort((a, b) => b.ts - a.ts) // sort groups by recency
    .map(g => g.ids.sort()); // sort ids alphabetically inside each group
  }
  static properties = {
    hass: {},
    config: {},
    _selectedIndex: {
      state: true
    },
    _lastPlaying: {
      state: true
    },
    _shouldDropdownOpenUp: {
      state: true
    },
    _pinnedIndex: {
      state: true
    },
    _showSourceList: {
      state: true
    },
    _holdToPin: {
      state: true
    }
  };
  static styles = (() => yampCardStyles)();
  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._playTimestamps = {};
    this._showSourceMenu = false;
    this._shouldDropdownOpenUp = false;
    this._collapsedArtDominantColor = "#444";
    this._lastArtworkUrl = null;
    // Timer for progress updates
    this._progressTimer = null;
    this._progressValue = null;
    this._lastProgressEntityId = null;
    this._pinnedIndex = null;
    // Accent color, updated in setConfig
    this._customAccent = "#ff9800";
    // Outside click handler for source dropdown
    this._sourceDropdownOutsideHandler = null;
    this._isIdle = false;
    this._idleTimeout = null;
    // Overlay state for entity options
    this._showEntityOptions = false;
    // Overlay state for grouping sheet
    this._showGrouping = false;
    // Overlay state for source list sheet
    this._showSourceList = false;
    // Alternate progress‑bar mode
    this._alternateProgressBar = false;
    // Group base volume for group gain logic
    this._groupBaseVolume = null;
    // Search sheet state variables
    this._searchOpen = false;
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchResults = [];
    this._searchError = "";
    this._searchTotalRows = 15; // minimum 15 rows for layout padding
    // Show search-in-sheet flag for entity options sheet
    this._showSearchInSheet = false;
    // Collapse on load if nothing is playing
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        if (stateObj && stateObj.state !== "playing") {
          this._isIdle = true;
          this.requestUpdate();
        }
      }
    }, 0);
    // Store previous collapsed state
    this._prevCollapsed = null;
    // Search attempted flag for search-in-sheet
    this._searchAttempted = false;
    // Media class filter for search results
    this._searchMediaClassFilter = "all";
    // Track last search chip classes for filter chip row scroll
    this._lastSearchChipClasses = "";
    // --- swipe‑to‑filter helpers ---
    this._swipeStartX = null;
    this._searchSwipeAttached = false;
    // Snapshot of entities that were playing when manual‑select started.
    this._manualSelectPlayingSet = null;
  } // ← closes constructor

  /**
   * Attach horizontal swipe on the search‑results area to cycle media‑class filters.
   */
  _attachSearchSwipe() {
    if (this._searchSwipeAttached) return;
    const area = this.renderRoot.querySelector('.entity-options-search-results');
    if (!area) return;
    this._searchSwipeAttached = true;
    const threshold = 40; // px needed to trigger change

    area.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        this._swipeStartX = e.touches[0].clientX;
      }
    }, {
      passive: true
    });
    area.addEventListener('touchend', e => {
      if (this._swipeStartX === null) return;
      const endX = e.changedTouches && e.changedTouches[0].clientX || null;
      if (endX === null) {
        this._swipeStartX = null;
        return;
      }
      const dx = endX - this._swipeStartX;
      if (Math.abs(dx) > threshold) {
        const classes = Array.from(new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean)));
        const filterOrder = ['all', ...classes];
        const currIdx = filterOrder.indexOf(this._searchMediaClassFilter || 'all');
        const dir = dx < 0 ? 1 : -1; // swipe left -> next, right -> prev
        let nextIdx = (currIdx + dir + filterOrder.length) % filterOrder.length;
        this._searchMediaClassFilter = filterOrder[nextIdx];
        this.requestUpdate();
      }
      this._swipeStartX = null;
    }, {
      passive: true
    });
  }

  /**
   * Open the search sheet pre‑filled with the current track’s artist and
   * launch the search immediately (only when media_artist is present).
   */
  _searchArtistFromNowPlaying() {
    var _this$currentStateObj;
    const artist = ((_this$currentStateObj = this.currentStateObj) === null || _this$currentStateObj === void 0 || (_this$currentStateObj = _this$currentStateObj.attributes) === null || _this$currentStateObj === void 0 ? void 0 : _this$currentStateObj.media_artist) || "";
    if (!artist) return; // nothing to search

    // Open overlay + search sheet
    this._showEntityOptions = true;
    this._showSearchInSheet = true;

    // Prefill search state
    this._searchQuery = artist;
    this._searchError = "";
    this._searchAttempted = false;
    this._searchLoading = false;

    // Render, then run search
    this.requestUpdate();
    this.updateComplete.then(() => this._doSearch());
  }
  // Show search sheet inside entity options
  _showSearchSheetInOptions() {
    this._showSearchInSheet = true;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchAttempted = false;
    this.requestUpdate();
  }
  _hideSearchSheetInOptions() {
    this._showSearchInSheet = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchAttempted = false;
    this.requestUpdate();
  }
  // Search sheet methods
  _searchOpenSheet() {
    this._searchOpen = true;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this.requestUpdate();
  }
  _searchCloseSheet() {
    this._searchOpen = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchLoading = false;
    this.requestUpdate();
  }
  async _doSearch() {
    this._searchAttempted = true;
    if (!this._searchQuery) return;
    this._searchLoading = true;
    this._searchError = "";
    this._searchResults = [];
    this.requestUpdate();
    try {
      var _res$response;
      const msg = {
        type: "call_service",
        domain: "media_player",
        service: "search_media",
        service_data: {
          entity_id: this.currentEntityId,
          search_query: this._searchQuery
        },
        return_response: true
      };
      const res = await this.hass.connection.sendMessagePromise(msg);
      const arr = (res === null || res === void 0 || (_res$response = res.response) === null || _res$response === void 0 || (_res$response = _res$response[this.currentEntityId]) === null || _res$response === void 0 ? void 0 : _res$response.result) || (res === null || res === void 0 ? void 0 : res.result) || [];
      this._searchResults = Array.isArray(arr) ? arr : [];
      // remember how many rows exist in the full (“All”) set, but keep at least 15 for layout
      const rows = Array.isArray(this._searchResults) ? this._searchResults.length : 0;
      this._searchTotalRows = Math.max(15, rows); // keep at least 15
    } catch (e) {
      this._searchError = e && e.message || "Unknown error";
      this._searchResults = [];
      this._searchTotalRows = 0;
    }
    this._searchLoading = false;
    this.requestUpdate();
  }
  _playMediaFromSearch(item) {
    this.hass.callService("media_player", "play_media", {
      entity_id: this.currentEntityId,
      media_content_type: item.media_content_type,
      media_content_id: item.media_content_id
    });
    // If searching from the bottom sheet, close the entity options overlay.
    if (this._showSearchInSheet) {
      this._closeEntityOptions();
      this._showSearchInSheet = false;
    }
    this._searchCloseSheet();
  }

  // Notify Home Assistant to recalculate layout
  _notifyResize() {
    this.dispatchEvent(new Event("iron-resize", {
      bubbles: true,
      composed: true
    }));
  }

  // Extract dominant color from image
  async _extractDominantColor(imgUrl) {
    return new Promise(resolve => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        resolve(`rgb(${r},${g},${b})`);
      };
      img.onerror = function () {
        resolve("#888");
      };
    });
  }
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = config;
    this._holdToPin = !!config.hold_to_pin;
    if (this._holdToPin) {
      this._holdHandler = createHoldToPinHandler({
        onPin: idx => this._pinChip(idx),
        holdTime: 650,
        moveThreshold: 8
      });
    } else {
      this._holdHandler = null;
    }
    this._selectedIndex = 0;
    this._lastPlaying = null;
    // Set accent color

    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    // Collapse card when idle
    this._collapseOnIdle = !!config.collapse_on_idle;
    // Force always-collapsed view
    this._alwaysCollapsed = !!config.always_collapsed;
    // Alternate progress‑bar mode
    this._alternateProgressBar = !!config.alternate_progress_bar;
    // Do not mutate config.force_chip_row here.
  }

  // Returns array of entity config objects, including group_volume if present in user config.
  get entityObjs() {
    return this.config.entities.map(e => {
      const entity_id = typeof e === "string" ? e : e.entity_id;
      const name = typeof e === "string" ? "" : e.name || "";
      const volume_entity = typeof e === "string" ? undefined : e.volume_entity;
      const sync_power = typeof e === "string" ? false : !!e.sync_power;
      let group_volume;
      if (typeof e === "object" && typeof e.group_volume !== "undefined") {
        group_volume = e.group_volume;
      } else {
        var _this$hass;
        // Determine group_volume default
        const state = (_this$hass = this.hass) === null || _this$hass === void 0 || (_this$hass = _this$hass.states) === null || _this$hass === void 0 ? void 0 : _this$hass[entity_id];
        if (state && Array.isArray(state.attributes.group_members) && state.attributes.group_members.length > 0) {
          // Are any group members in entityIds?
          const otherMembers = state.attributes.group_members.filter(id => id !== entity_id);
          // Use raw config.entities to avoid circular dependency in this.entityIds
          const configEntityIds = this.config.entities.map(en => typeof en === "string" ? en : en.entity_id);
          const visibleMembers = otherMembers.filter(id => configEntityIds.includes(id));
          group_volume = visibleMembers.length > 0;
        }
      }
      return {
        entity_id,
        name,
        volume_entity,
        sync_power,
        ...(typeof group_volume !== "undefined" ? {
          group_volume
        } : {})
      };
    });
  }

  // Return volume entity for given index (use override if set)
  _getVolumeEntity(idx) {
    const obj = this.entityObjs[idx];
    return obj && obj.volume_entity ? obj.volume_entity : obj.entity_id;
  }

  // Return grouping key
  _getGroupKey(id) {
    var _this$hass2;
    const st = (_this$hass2 = this.hass) === null || _this$hass2 === void 0 || (_this$hass2 = _this$hass2.states) === null || _this$hass2 === void 0 ? void 0 : _this$hass2[id];
    if (!st) return id;
    const members = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];
    if (!members.length) return id;
    const all = [id, ...members].sort();
    return all[0];
  }
  get entityIds() {
    return this.entityObjs.map(e => e.entity_id);
  }

  // Return display name for a chip/entity
  getChipName(entity_id) {
    const obj = this.entityObjs.find(e => e.entity_id === entity_id);
    if (obj && obj.name) return obj.name;
    const state = this.hass.states[entity_id];
    return (state === null || state === void 0 ? void 0 : state.attributes.friendly_name) || entity_id;
  }

  // Return group master (includes all others in group_members)
  _getActualGroupMaster(group) {
    if (!this.hass || !group || group.length < 2) return group[0];
    // If _lastGroupingMasterId is present in this group, prefer it as master
    if (this._lastGroupingMasterId && group.includes(this._lastGroupingMasterId)) {
      return this._lastGroupingMasterId;
    }
    return group.find(id => {
      const st = this.hass.states[id];
      if (!st) return false;
      const members = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];
      // Master should include all other group members in the group
      return group.every(otherId => otherId === id || members.includes(otherId));
    }) || group[0];
  }
  get currentEntityId() {
    return this.entityIds[this._selectedIndex];
  }
  get currentStateObj() {
    if (!this.hass || !this.currentEntityId) return null;
    return this.hass.states[this.currentEntityId];
  }
  get currentVolumeStateObj() {
    const obj = this.entityObjs[this._selectedIndex];
    const entityId = (obj === null || obj === void 0 ? void 0 : obj.volume_entity) || (obj === null || obj === void 0 ? void 0 : obj.entity_id);
    return entityId ? this.hass.states[entityId] : null;
  }
  updated(changedProps) {
    var _super$updated;
    if (this.hass && this.entityIds) {
      // Update timestamps for playing entities
      this.entityIds.forEach(id => {
        const state = this.hass.states[id];
        if (state && state.state === "playing") {
          this._playTimestamps[id] = Date.now();
        }
      });

      // If manual‑select is active (no pin) and a *new* entity begins playing,
      // clear manual mode so auto‑switching resumes.
      if (this._manualSelect && this._pinnedIndex === null && this._manualSelectPlayingSet) {
        // Remove any entities from the snapshot that are no longer playing.
        for (const id of [...this._manualSelectPlayingSet]) {
          const stSnap = this.hass.states[id];
          if (!(stSnap && stSnap.state === "playing")) {
            this._manualSelectPlayingSet.delete(id);
          }
        }
        for (const id of this.entityIds) {
          const st = this.hass.states[id];
          if (st && st.state === "playing" && !this._manualSelectPlayingSet.has(id)) {
            this._manualSelect = false;
            this._manualSelectPlayingSet = null;
            break;
          }
        }
      }

      // Auto-switch unless manually pinned
      if (!this._manualSelect) {
        // Switch to most recent if applicable
        const sortedIds = this.sortedEntityIds;
        if (sortedIds.length > 0) {
          const mostRecentId = sortedIds[0];
          const mostRecentState = this.hass.states[mostRecentId];
          if (mostRecentState && mostRecentState.state === "playing" && this.entityIds[this._selectedIndex] !== mostRecentId) {
            this._selectedIndex = this.entityIds.indexOf(mostRecentId);
          }
        }
      }
    }

    // Restart progress timer
    (_super$updated = super.updated) === null || _super$updated === void 0 || _super$updated.call(this, changedProps);
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    const stateObj = this.currentStateObj;
    if (stateObj && stateObj.state === "playing" && stateObj.attributes.media_duration) {
      this._progressTimer = setInterval(() => {
        this.requestUpdate();
      }, 500);
    }

    // Update idle state after all other state checks
    this._updateIdleState();

    // Notify HA if collapsed state changes
    const collapsedNow = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    if (this._prevCollapsed !== collapsedNow) {
      this._prevCollapsed = collapsedNow;
      // Trigger layout update
      this._notifyResize();
    }

    // Add grab scroll to chip rows after update/render
    this._addGrabScroll('.chip-row');
    this._addGrabScroll('.action-chip-row');
    this._addVerticalGrabScroll('.floating-source-index');

    // Autofocus the in-sheet search box when opening the search in entity options
    if (this._showSearchInSheet) {
      setTimeout(() => {
        const inp = this.renderRoot.querySelector('#search-input-box');
        if (inp) inp.focus();
        // Only scroll filter chip row to start if the set of chips has changed
        const classes = Array.from(new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean)));
        const classStr = classes.join(",");
        if (this._lastSearchChipClasses !== classStr) {
          const chipRow = this.renderRoot.querySelector('.search-filter-chips');
          if (chipRow) chipRow.scrollLeft = 0;
          // Reset scroll only when the result set (and chip classes) actually changes
          const overlayEl = this.renderRoot.querySelector('.entity-options-overlay');
          if (overlayEl) overlayEl.scrollTop = 0;
          const sheetEl = this.renderRoot.querySelector('.entity-options-sheet');
          if (sheetEl) sheetEl.scrollTop = 0;
          this._lastSearchChipClasses = classStr;
        }
        // Responsive alignment for search filter chips: center if no overflow, flex-start if overflow
        const chipRowEl = this.renderRoot.querySelector('#search-filter-chip-row');
        if (chipRowEl) {
          if (chipRowEl.scrollWidth > chipRowEl.clientWidth + 2) {
            chipRowEl.style.justifyContent = 'flex-start';
          } else {
            chipRowEl.style.justifyContent = 'center';
          }
        }
        // attach swipe gesture once
        this._attachSearchSwipe();
      }, 0);
    }
    // When the source‑list sheet opens, make sure the overlay scrolls to the top
    if (this._showSourceList) {
      setTimeout(() => {
        const overlayEl = this.renderRoot.querySelector('.entity-options-overlay');
        if (overlayEl) overlayEl.scrollTop = 0;
      }, 0);
    }
  }
  _toggleSourceMenu() {
    this._showSourceMenu = !this._showSourceMenu;
    if (this._showSourceMenu) {
      this._manualSelect = true;
      setTimeout(() => {
        this._shouldDropdownOpenUp = true;
        this.requestUpdate();
        // Setup outside click handler
        this._addSourceDropdownOutsideHandler();
      }, 0);
    } else {
      this._manualSelect = false;
      this._removeSourceDropdownOutsideHandler();
    }
  }
  _addSourceDropdownOutsideHandler() {
    if (this._sourceDropdownOutsideHandler) return;
    // Use arrow fn to preserve 'this'
    this._sourceDropdownOutsideHandler = evt => {
      // Find dropdown and button in shadow DOM
      const dropdown = this.renderRoot.querySelector('.source-dropdown');
      const btn = this.renderRoot.querySelector('.source-menu-btn');
      // If click/tap is not inside dropdown or button, close, evt.composedPath() includes shadow DOM path
      const path = evt.composedPath ? evt.composedPath() : [];
      if (dropdown && path.includes(dropdown) || btn && path.includes(btn)) {
        return;
      }
      // Otherwise, close the dropdown and remove handler
      this._showSourceMenu = false;
      this._manualSelect = false;
      this._removeSourceDropdownOutsideHandler();
      this.requestUpdate();
    };
    window.addEventListener('mousedown', this._sourceDropdownOutsideHandler, true);
    window.addEventListener('touchstart', this._sourceDropdownOutsideHandler, true);
  }
  _removeSourceDropdownOutsideHandler() {
    if (!this._sourceDropdownOutsideHandler) return;
    window.removeEventListener('mousedown', this._sourceDropdownOutsideHandler, true);
    window.removeEventListener('touchstart', this._sourceDropdownOutsideHandler, true);
    this._sourceDropdownOutsideHandler = null;
  }
  _selectSource(src) {
    const entity = this.currentEntityId;
    if (!entity || !src) return;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source: src
    });
    // Close the source list sheet after selection
    this._closeEntityOptions();
  }
  _onPinClick(e) {
    e.stopPropagation();
    this._manualSelect = false;
    this._pinnedIndex = null;
    this._manualSelectPlayingSet = null;
  }
  _onChipClick(idx) {
    // Ignore the synthetic click that fires immediately after a long‑press pin.
    if (this._holdToPin && this._justPinned) {
      this._justPinned = false;
      return;
    }

    // Select the tapped chip.
    this._selectedIndex = idx;
    clearTimeout(this._manualSelectTimeout);
    if (this._holdToPin) {
      if (this._pinnedIndex !== null) {
        // A chip is already pinned – keep manual mode active.
        this._manualSelect = true;
      } else {
        // No chip is pinned. Pause auto‑switching until any *new* player starts.
        this._manualSelect = true;
        // Take a snapshot of who is currently playing.
        this._manualSelectPlayingSet = new Set();
        for (const id of this.entityIds) {
          var _this$hass3;
          const st = (_this$hass3 = this.hass) === null || _this$hass3 === void 0 || (_this$hass3 = _this$hass3.states) === null || _this$hass3 === void 0 ? void 0 : _this$hass3[id];
          if (st && st.state === "playing") {
            this._manualSelectPlayingSet.add(id);
          }
        }
      }
      // Never change _pinnedIndex on a simple tap in hold_to_pin mode.
    } else {
      // --- default MODE ---
      this._manualSelect = true;
      this._pinnedIndex = idx;
    }
    this.requestUpdate();
  }
  _pinChip(idx) {
    // Mark that this chip was just pinned via long‑press so the
    // click event that follows the pointer‑up can be ignored.
    this._justPinned = true;

    // Cancel any pending auto‑switch re‑enable timer.
    clearTimeout(this._manualSelectTimeout);
    // Clear the manual‑select snapshot; a long‑press establishes a pin.
    this._manualSelectPlayingSet = null;
    this._pinnedIndex = idx;
    this._manualSelect = true;
    this.requestUpdate();
  }
  _onActionChipClick(idx) {
    const action = this.config.actions[idx];
    if (!action) return;
    if (action.menu_item) {
      switch (action.menu_item) {
        case "more-info":
          this._openMoreInfo();
          this._showEntityOptions = false;
          this.requestUpdate();
          break;
        case "group-players":
          this._showEntityOptions = true;
          this._showGrouping = true;
          this.requestUpdate();
          break;
        case "search":
          this._showEntityOptions = true;
          this._showSearchInSheet = true;
          this._searchError = "";
          this._searchResults = [];
          this._searchQuery = "";
          this._searchAttempted = false;
          this.requestUpdate();
          break;
        case "source":
          this._showEntityOptions = true;
          this._showSourceList = true;
          this._showGrouping = false;
          this.requestUpdate();
          break;
      }
      return;
    }
    if (!action.service) return;
    const [domain, service] = action.service.split(".");
    let data = {
      ...(action.service_data || {})
    };
    if (domain === "script" && action.script_variable === true) {
      const currentId = this.currentEntityId;
      if (data.entity_id === "current" || data.entity_id === "$current" || data.entity_id === "this") {
        delete data.entity_id;
      }
      data.yamp_entity = currentId;
    } else if (!(domain === "script" && action.script_variable === true) && (data.entity_id === "current" || data.entity_id === "$current" || data.entity_id === "this" || !data.entity_id)) {
      data.entity_id = this.currentEntityId;
    }
    this.hass.callService(domain, service, data);
  }
  _onControlClick(action) {
    const entity = this.currentEntityId;
    if (!entity) return;
    const stateObj = this.currentStateObj;
    switch (action) {
      case "play_pause":
        this.hass.callService("media_player", "media_play_pause", {
          entity_id: entity
        });
        break;
      case "next":
        this.hass.callService("media_player", "media_next_track", {
          entity_id: entity
        });
        break;
      case "prev":
        this.hass.callService("media_player", "media_previous_track", {
          entity_id: entity
        });
        break;
      case "stop":
        this.hass.callService("media_player", "media_stop", {
          entity_id: entity
        });
        break;
      case "shuffle":
        {
          // Toggle shuffle based on current state
          const curr = !!stateObj.attributes.shuffle;
          this.hass.callService("media_player", "shuffle_set", {
            entity_id: entity,
            shuffle: !curr
          });
          break;
        }
      case "repeat":
        {
          // Cycle: off → all → one → off
          let curr = stateObj.attributes.repeat || "off";
          let next;
          if (curr === "off") next = "all";else if (curr === "all") next = "one";else next = "off";
          this.hass.callService("media_player", "repeat_set", {
            entity_id: entity,
            repeat: next
          });
          break;
        }
      case "power":
        {
          // Toggle between turn_on and turn_off based on current state
          const svc = stateObj.state === "off" ? "turn_on" : "turn_off";
          this.hass.callService("media_player", svc, {
            entity_id: entity
          });

          // Also toggle volume_entity if sync_power is enabled for this entity
          const obj = this.entityObjs[this._selectedIndex];
          if (obj && obj.sync_power && obj.volume_entity && obj.volume_entity !== obj.entity_id) {
            this.hass.callService("media_player", svc, {
              entity_id: obj.volume_entity
            });
          }
          break;
        }
    }
  }

  /**
   * Handles volume change events.
   * With group_volume: false, always sets only the single volume entity, never the group.
   * With group_volume: true/undefined, applies group logic.
   * Includes debug logs to verify logic.
   */
  _onVolumeChange(e) {
    var _state$attributes;
    const idx = this._selectedIndex;
    const mainEntity = this.entityObjs[idx].entity_id;
    const state = this.hass.states[mainEntity];
    const newVol = Number(e.target.value);
    const obj = this.entityObjs[idx];

    // Always use group_volume directly from obj
    const groupVolume = typeof obj.group_volume === "boolean" ? obj.group_volume : true;
    if (!groupVolume) {
      this.hass.callService("media_player", "volume_set", {
        entity_id: this._getVolumeEntity(idx),
        volume_level: newVol
      });
      return;
    }

    // Group volume logic: ONLY runs if group_volume is true/undefined
    if (Array.isArray(state === null || state === void 0 || (_state$attributes = state.attributes) === null || _state$attributes === void 0 ? void 0 : _state$attributes.group_members) && state.attributes.group_members.length) {
      var _this$currentVolumeSt;
      const targets = [mainEntity, ...state.attributes.group_members];
      const base = typeof this._groupBaseVolume === "number" ? this._groupBaseVolume : Number(((_this$currentVolumeSt = this.currentVolumeStateObj) === null || _this$currentVolumeSt === void 0 ? void 0 : _this$currentVolumeSt.attributes.volume_level) || 0);
      const delta = newVol - base;
      for (const t of targets) {
        const obj = this.entityObjs.find(e => e.entity_id === t);
        const volTarget = obj && obj.volume_entity ? obj.volume_entity : t;
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + delta;
        v = Math.max(0, Math.min(1, v));
        this.hass.callService("media_player", "volume_set", {
          entity_id: volTarget,
          volume_level: v
        });
      }
      this._groupBaseVolume = newVol;
    } else {
      this.hass.callService("media_player", "volume_set", {
        entity_id: this._getVolumeEntity(idx),
        volume_level: newVol
      });
    }
  }
  _onVolumeStep(direction) {
    var _state$attributes2;
    const idx = this._selectedIndex;
    const entity = this._getVolumeEntity(idx);
    if (!entity) return;
    const isRemoteVolumeEntity = entity.startsWith && entity.startsWith("remote.");
    const stateObj = this.currentVolumeStateObj;
    if (!stateObj) return;
    if (isRemoteVolumeEntity) {
      this.hass.callService("remote", "send_command", {
        entity_id: entity,
        command: direction > 0 ? "volume_up" : "volume_down"
      });
      return;
    }
    const mainEntity = this.entityObjs[idx].entity_id;
    const state = this.hass.states[mainEntity];
    if (Array.isArray(state === null || state === void 0 || (_state$attributes2 = state.attributes) === null || _state$attributes2 === void 0 ? void 0 : _state$attributes2.group_members) && state.attributes.group_members.length) {
      // Grouped: apply group gain step
      const targets = [mainEntity, ...state.attributes.group_members];
      // Fixed step size
      const step = 0.05 * direction;
      for (const t of targets) {
        const obj = this.entityObjs.find(e => e.entity_id === t);
        const volTarget = obj && obj.volume_entity ? obj.volume_entity : t;
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + step;
        v = Math.max(0, Math.min(1, v));
        this.hass.callService("media_player", "volume_set", {
          entity_id: volTarget,
          volume_level: v
        });
      }
    } else {
      // Not grouped, set directly
      let current = Number(stateObj.attributes.volume_level || 0);
      current += direction * 0.05;
      current = Math.max(0, Math.min(1, current));
      this.hass.callService("media_player", "volume_set", {
        entity_id: entity,
        volume_level: current
      });
    }
  }
  _onVolumeDragStart(e) {
    // Store base group volume at drag start
    if (!this.hass) return;
    const state = this.currentVolumeStateObj;
    this._groupBaseVolume = state ? Number(state.attributes.volume_level || 0) : 0;
  }
  _onVolumeDragEnd(e) {
    this._groupBaseVolume = null;
  }
  _onGroupVolumeChange(entityId, volumeEntity, e) {
    const vol = Number(e.target.value);
    this.hass.callService("media_player", "volume_set", {
      entity_id: volumeEntity,
      volume_level: vol
    });
  }
  _onGroupVolumeStep(volumeEntity, direction) {
    this.hass.callService("remote", "send_command", {
      entity_id: volumeEntity,
      command: direction > 0 ? "volume_up" : "volume_down"
    });
  }
  _onSourceChange(e) {
    const entity = this.currentEntityId;
    const source = e.target.value;
    if (!entity || !source) return;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source
    });
  }
  _openMoreInfo() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: {
        entityId: this.currentEntityId
      },
      bubbles: true,
      composed: true
    }));
  }
  _onProgressBarClick(e) {
    const entity = this.currentEntityId;
    const stateObj = this.currentStateObj;
    if (!entity || !stateObj) return;
    const duration = stateObj.attributes.media_duration;
    if (!duration) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = Math.floor(percent * duration);
    if (stateObj.state === "playing") {
      // Optimistically update local progress position for smooth UI
      stateObj.attributes.media_position = seekTime;
      stateObj.attributes.media_position_updated_at = new Date().toISOString();
      this.requestUpdate();
    }
    this.hass.callService("media_player", "media_seek", {
      entity_id: entity,
      seek_position: seekTime
    });
  }
  render() {
    var _this$currentVolumeSt2, _this$currentStateObj2;
    if (!this.hass || !this.config) return nothing;
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    const showChipRow = this.config.show_chip_row || "auto";
    const stateObj = this.currentStateObj;
    if (!stateObj) return html`<div class="details">Entity not found.</div>`;

    // Collect unique, sorted first letters of source names
    const sourceList = stateObj.attributes.source_list || [];
    const sourceLetters = Array.from(new Set(sourceList.map(s => s && s[0] ? s[0].toUpperCase() : ""))).filter(l => l && /^[A-Z]$/.test(l)).sort();

    // Idle image "picture frame" mode when idle
    let idleImageUrl = null;
    if (this.config.idle_image && this._isIdle && this.hass.states[this.config.idle_image]) {
      const sensorState = this.hass.states[this.config.idle_image];
      idleImageUrl = sensorState.attributes.entity_picture || (sensorState.state && sensorState.state.startsWith("http") ? sensorState.state : null);
    }
    const dimIdleFrame = !!idleImageUrl;

    // Calculate shuffle/repeat state only AFTER confirming stateObj exists
    const shuffleActive = !!stateObj.attributes.shuffle;
    const repeatActive = stateObj.attributes.repeat && stateObj.attributes.repeat !== "off";

    // Artwork and idle logic
    const isPlaying = !this._isIdle && stateObj.state === "playing";
    const isRealArtwork = !this._isIdle && isPlaying && (stateObj.attributes.entity_picture || stateObj.attributes.album_art);
    isRealArtwork ? stateObj.attributes.entity_picture || stateObj.attributes.album_art : null;
    // Details
    const title = isPlaying ? stateObj.attributes.media_title || "" : "";
    const artist = isPlaying ? stateObj.attributes.media_artist || stateObj.attributes.media_series_title || stateObj.attributes.app_name || "" : "";
    let pos = stateObj.attributes.media_position || 0;
    const duration = stateObj.attributes.media_duration || 0;
    if (isPlaying) {
      const updatedAt = stateObj.attributes.media_position_updated_at ? Date.parse(stateObj.attributes.media_position_updated_at) : Date.parse(stateObj.last_changed);
      const elapsed = (Date.now() - updatedAt) / 1000;
      pos += elapsed;
    }
    const progress = duration ? Math.min(1, pos / duration) : 0;

    // Volume entity determination
    const idx = this._selectedIndex;
    const entity = this._getVolumeEntity(idx);
    const isRemoteVolumeEntity = entity && entity.startsWith && entity.startsWith("remote.");

    // Volume
    const vol = Number(((_this$currentVolumeSt2 = this.currentVolumeStateObj) === null || _this$currentVolumeSt2 === void 0 ? void 0 : _this$currentVolumeSt2.attributes.volume_level) || 0);
    const showSlider = this.config.volume_mode !== "stepper";

    // Collapse artwork/details on idle if configured and/or always_collapsed
    const collapsed = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    // Use null if idle or no artwork available
    const artworkUrl = !this._isIdle && stateObj && (stateObj.attributes.entity_picture || stateObj.attributes.album_art) ? stateObj.attributes.entity_picture || stateObj.attributes.album_art : null;

    // Dominant color extraction for collapsed artwork
    if (collapsed && artworkUrl && artworkUrl !== this._lastArtworkUrl) {
      this._extractDominantColor(artworkUrl).then(color => {
        this._collapsedArtDominantColor = color;
        this.requestUpdate();
      });
      this._lastArtworkUrl = artworkUrl;
    }
    return html`
        <ha-card class="yamp-card" style="position:relative;">
          <div
            style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column;"
            data-match-theme="${String(this.config.match_theme === true)}"
            class="${dimIdleFrame ? 'dim-idle' : ''}"
          >
            ${this.entityObjs.length > 1 || showChipRow === "always" ? html`
                <div class="chip-row">
                  ${this.groupedSortedEntityIds.map(group => {
      if (group.length > 1) {
        var _this$hass4;
        const id = this._getActualGroupMaster(group);
        const idx = this.entityIds.indexOf(id);
        const state = (_this$hass4 = this.hass) === null || _this$hass4 === void 0 || (_this$hass4 = _this$hass4.states) === null || _this$hass4 === void 0 ? void 0 : _this$hass4[id];
        // For group chips, art is always null, but update isPlaying logic for selected chip
        this.currentEntityId === id ? !this._isIdle : (state === null || state === void 0 ? void 0 : state.state) === "playing";
        return renderGroupChip({
          idx,
          selected: this.currentEntityId === id,
          groupName: this.getChipName(id),
          // group chips show count or icon, not artwork
          icon: "mdi:group",
          pinned: this._pinnedIndex === idx,
          holdToPin: this._holdToPin,
          onChipClick: idx => this._onChipClick(idx),
          onIconClick: (idx, e) => {
            e.stopPropagation();
            this._onChipClick(idx); // Optional: select as well
            this._openGrouping();
          },
          onPinClick: (idx, e) => {
            e.stopPropagation();
            this._onPinClick(e);
          },
          onPointerDown: e => this._handleChipPointerDown(e, idx),
          onPointerMove: e => this._handleChipPointerMove(e, idx),
          onPointerUp: e => this._handleChipPointerUp(e, idx)
        });
      } else {
        var _this$hass5, _state$attributes3, _state$attributes4, _state$attributes5, _state$attributes6, _state$attributes7;
        const id = group[0];
        const idx = this.entityIds.indexOf(id);
        const state = (_this$hass5 = this.hass) === null || _this$hass5 === void 0 || (_this$hass5 = _this$hass5.states) === null || _this$hass5 === void 0 ? void 0 : _this$hass5[id];
        const isPlaying = this.currentEntityId === id ? !this._isIdle : (state === null || state === void 0 ? void 0 : state.state) === "playing";
        const art = this.currentEntityId === id ? !this._isIdle && ((state === null || state === void 0 || (_state$attributes3 = state.attributes) === null || _state$attributes3 === void 0 ? void 0 : _state$attributes3.entity_picture) || (state === null || state === void 0 || (_state$attributes4 = state.attributes) === null || _state$attributes4 === void 0 ? void 0 : _state$attributes4.album_art)) : (state === null || state === void 0 ? void 0 : state.state) === "playing" && ((state === null || state === void 0 || (_state$attributes5 = state.attributes) === null || _state$attributes5 === void 0 ? void 0 : _state$attributes5.entity_picture) || (state === null || state === void 0 || (_state$attributes6 = state.attributes) === null || _state$attributes6 === void 0 ? void 0 : _state$attributes6.album_art));
        const icon = (state === null || state === void 0 || (_state$attributes7 = state.attributes) === null || _state$attributes7 === void 0 ? void 0 : _state$attributes7.icon) || "mdi:cast";
        return renderChip({
          idx,
          selected: this.currentEntityId === id,
          playing: isPlaying,
          name: this.getChipName(id),
          art,
          icon,
          pinned: this._pinnedIndex === idx,
          holdToPin: this._holdToPin,
          onChipClick: idx => this._onChipClick(idx),
          onPinClick: (idx, e) => {
            e.stopPropagation();
            this._onPinClick(e);
          },
          onPointerDown: e => this._handleChipPointerDown(e, idx),
          onPointerMove: e => this._handleChipPointerMove(e, idx),
          onPointerUp: e => this._handleChipPointerUp(e, idx)
        });
      }
    })}
                </div>
            ` : nothing}
            ${renderActionChipRow({
      actions: this.config.actions,
      onActionChipClick: idx => this._onActionChipClick(idx)
    })}
            <div class="card-lower-content-container">
              <div class="card-lower-content-bg"
                style="
                  background-image: ${idleImageUrl ? `url('${idleImageUrl}')` : artworkUrl ? `url('${artworkUrl}')` : "none"};
                  min-height: ${collapsed ? "0px" : "320px"};
                  background-size: cover;
                  background-position: top center;
                  background-repeat: no-repeat;
                  filter: ${collapsed && artworkUrl ? "blur(18px) brightness(0.7) saturate(1.15)" : "none"};
                  transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s;
                "
              ></div>
              ${!dimIdleFrame ? html`<div class="card-lower-fade"></div>` : nothing}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}">
                ${collapsed && artworkUrl ? html`
                  <div class="collapsed-artwork-container"
                       style="background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%);">
                    <img class="collapsed-artwork" src="${artworkUrl}" />
                  </div>
                ` : nothing}
                ${!collapsed ? html`<div class="card-artwork-spacer"></div>` : nothing}
                ${!collapsed && !artworkUrl && !idleImageUrl ? html`
                  <div class="media-artwork-placeholder"
                    style="
                      position: absolute;
                      left: 50%; top: 36px;
                      transform: translateX(-50%);
                      width: 184px; height: 184px;
                      display: flex; align-items: center; justify-content: center;
                      background: none;
                      z-index: 2;">
                    <svg width="184" height="184" viewBox="0 0 184 184"
                      style="display:block;opacity:0.85;${this.config.match_theme === true ? 'color:#fff;' : `color:${this._customAccent};`}"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"/>
                      <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"/>
                      <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"/>
                      <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"/>
                    </svg>
                  </div>
                ` : nothing}
                <div class="details">
                  <div class="title">
                    ${isPlaying ? title : ""}
                  </div>
                  ${isPlaying && artist ? html`
                    <div
                      class="artist ${stateObj.attributes.media_artist ? 'clickable-artist' : ''}"
                      @click=${() => {
      if (stateObj.attributes.media_artist) this._searchArtistFromNowPlaying();
    }}
                      title=${stateObj.attributes.media_artist ? "Search for this artist" : ""}
                    >${artist}</div>
                  ` : nothing}
                </div>
                ${!collapsed && !this._alternateProgressBar ? isPlaying && duration ? renderProgressBar({
      progress,
      seekEnabled: true,
      onSeek: e => this._onProgressBarClick(e),
      collapsed: false,
      accent: this._customAccent
    }) : renderProgressBar({
      progress: 0,
      seekEnabled: false,
      collapsed: false,
      accent: this._customAccent,
      style: "visibility:hidden"
    }) : nothing}
                ${(collapsed || this._alternateProgressBar) && isPlaying && duration ? renderProgressBar({
      progress,
      collapsed: true,
      accent: this._customAccent
    }) : nothing}
                ${!dimIdleFrame ? html`
                ${renderControlsRow({
      stateObj,
      showStop: this._shouldShowStopButton(stateObj),
      shuffleActive,
      repeatActive,
      onControlClick: action => this._onControlClick(action),
      supportsFeature: (state, feature) => this._supportsFeature(state, feature)
    })}
                ${renderVolumeRow({
      isRemoteVolumeEntity,
      showSlider,
      vol,
      onVolumeDragStart: e => this._onVolumeDragStart(e),
      onVolumeDragEnd: e => this._onVolumeDragEnd(e),
      onVolumeChange: e => this._onVolumeChange(e),
      onVolumeStep: dir => this._onVolumeStep(dir),
      moreInfoMenu: html`
                    <div class="more-info-menu">
                      <button class="more-info-btn" @click=${() => this._openEntityOptions()}>
                        <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                      </button>
                    </div>
                  `
    })}
                ` : nothing}
                ${dimIdleFrame ? html`
                  <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: 10;">
                    <button class="more-info-btn" @click=${() => this._openEntityOptions()}>
                      <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                    </button>
                  </div>
                ` : nothing}
              </div>
            </div>
          </div>
          ${this._showEntityOptions ? html`
          <div class="entity-options-overlay" @click=${e => this._closeEntityOptions(e)}>
            <div class="entity-options-sheet" @click=${e => e.stopPropagation()}>
              ${!this._showGrouping && !this._showSourceList && !this._showSearchInSheet ? html`
                <div class="entity-options-menu" style="display:flex; flex-direction:column; margin-top:auto; margin-bottom:20px;">
                  <button class="entity-options-item" @click=${() => {
      this._openMoreInfo();
      this._showEntityOptions = false;
      this.requestUpdate();
    }}>More Info</button>
                  <button class="entity-options-item" @click=${() => {
      this._showSearchSheetInOptions();
    }}>Search</button>
                  ${Array.isArray((_this$currentStateObj2 = this.currentStateObj) === null || _this$currentStateObj2 === void 0 || (_this$currentStateObj2 = _this$currentStateObj2.attributes) === null || _this$currentStateObj2 === void 0 ? void 0 : _this$currentStateObj2.source_list) && this.currentStateObj.attributes.source_list.length > 0 ? html`
                      <button class="entity-options-item" @click=${() => this._openSourceList()}>Source</button>
                    ` : nothing}
                  ${(() => {
      const totalEntities = this.entityIds.length;
      const groupableCount = this.entityIds.reduce((acc, id) => {
        const st = this.hass.states[id];
        return acc + (this._supportsFeature(st, SUPPORT_GROUPING) ? 1 : 0);
      }, 0);
      if (totalEntities > 1 && groupableCount > 1 && this._supportsFeature(this.currentStateObj, SUPPORT_GROUPING)) {
        return html`
                          <button class="entity-options-item" @click=${() => this._openGrouping()}>Group Players</button>
                        `;
      }
      return nothing;
    })()}
                  <button class="entity-options-item" @click=${() => this._closeEntityOptions()}>Close</button>
                </div>
              ` : this._showSearchInSheet ? html`
                <div class="entity-options-search" style="margin-top:12px;">
                  <div class="entity-options-search-row">
                      <input
                        type="text"
                        id="search-input-box"
                        autofocus
                        class="entity-options-search-input"
                        .value=${this._searchQuery}
                        @input=${e => {
      this._searchQuery = e.target.value;
      this.requestUpdate();
    }}
                        @keydown=${e => {
      if (e.key === "Enter") {
        e.preventDefault();
        this._doSearch();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this._hideSearchSheetInOptions();
      }
    }}
                        placeholder="Search music..."
                        style="flex:1; min-width:0; font-size:1.1em;"
                      />
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._doSearch()}
                      ?disabled=${this._searchLoading || !this._searchQuery}>
                      Search
                    </button>
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._hideSearchSheetInOptions()}>
                      Cancel
                    </button>
                  </div>
                  <!-- FILTER CHIPS -->
                  ${(() => {
      const classes = Array.from(new Set((this._searchResults || []).map(i => i.media_class).filter(Boolean)));
      const filter = this._searchMediaClassFilter || "all";
      if (classes.length < 2) return nothing;
      return html`
                      <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center;">
                        <button
                          class="chip"
                          style="
                            width: 72px;
                            background: ${filter === 'all' ? this._customAccent : '#282828'};
                            opacity: ${filter === 'all' ? '1' : '0.8'};
                            font-weight: ${filter === 'all' ? 'bold' : 'normal'};
                          "
                          ?selected=${filter === 'all'}
                          @click=${() => {
        this._searchMediaClassFilter = "all";
        this.requestUpdate();
      }}
                        >All</button>
                        ${classes.map(c => html`
                          <button
                            class="chip"
                            style="
                              width: 72px;
                              background: ${filter === c ? this._customAccent : '#282828'};
                              opacity: ${filter === c ? '1' : '0.8'};
                              font-weight: ${filter === c ? 'bold' : 'normal'};
                            "
                            ?selected=${filter === c}
                            @click=${() => {
        this._searchMediaClassFilter = c;
        this.requestUpdate();
      }}
                          >
                            ${c.charAt(0).toUpperCase() + c.slice(1)}
                          </button>
                        `)}
                      </div>
                    `;
    })()}
                  ${this._searchLoading ? html`<div class="entity-options-search-loading">Loading...</div>` : nothing}
                  ${this._searchError ? html`<div class="entity-options-search-error">${this._searchError}</div>` : nothing}
                  <div class="entity-options-search-results">
                    ${(() => {
      const filter = this._searchMediaClassFilter || "all";
      const allResults = this._searchResults || [];
      const filteredResults = filter === "all" ? allResults : allResults.filter(item => item.media_class === filter);
      // Build padded array so row‑count stays constant
      const totalRows = Math.max(15, this._searchTotalRows || allResults.length);
      const paddedResults = [...filteredResults, ...Array.from({
        length: Math.max(0, totalRows - filteredResults.length)
      }, () => null)];
      // Always render paddedResults, even before first search
      return this._searchAttempted && filteredResults.length === 0 && !this._searchLoading ? html`<div class="entity-options-search-empty">No results.</div>` : paddedResults.map(item => item ? html`
                            <!-- EXISTING non‑placeholder row markup -->
                            <div class="entity-options-search-result">
                              <img
                                class="entity-options-search-thumb"
                                src=${item.thumbnail}
                                alt=${item.title}
                                style="height:38px;width:38px;object-fit:cover;border-radius:5px;margin-right:12px;"
                              />
                              <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
                                <span>${item.title}</span>
                                <span style="font-size:0.86em; color:#bbb; line-height:1.16; margin-top:2px;">
                                  ${item.media_class ? item.media_class.charAt(0).toUpperCase() + item.media_class.slice(1) : ""}
                                </span>
                              </div>
                              <button class="entity-options-search-play" @click=${() => this._playMediaFromSearch(item)}>
                                ▶
                              </button>
                            </div>
                          ` : html`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `);
    })()}
                  </div>
                </div>
              ` : this._showGrouping ? html`
                <button class="entity-options-item" @click=${() => this._closeGrouping()} style="margin-bottom:14px;">← Back</button>
                ${(_masterState$attribut => {
      const masterState = this.hass.states[this.currentEntityId];
      const groupedAny = Array.isArray(masterState === null || masterState === void 0 || (_masterState$attribut = masterState.attributes) === null || _masterState$attribut === void 0 ? void 0 : _masterState$attribut.group_members) && masterState.attributes.group_members.length > 0;
      return html`
                      <div style="display:flex;align-items:center;justify-content:space-between;font-weight:600;margin-bottom:0;">
                        ${groupedAny ? html`
                          <button class="group-all-btn"
                            @click=${() => this._syncGroupVolume()}
                            style="color:#fff; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 16px 2px 0;">
                            Sync Volume
                          </button>
                        ` : html`<span></span>`}
                        <button class="group-all-btn"
                          @click=${() => groupedAny ? this._ungroupAll() : this._groupAll()}
                          style="color:#d22; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 0 2px 8px;">
                          ${groupedAny ? "Ungroup All" : "Group All"}
                        </button>
                      </div>
                    `;
    })()}
                <hr style="margin:8px 0 2px 0;opacity:0.19;border:0;border-top:1px solid #fff;" />
                ${(() => {
      // --- Begin new group player rows logic, wrapped in scrollable container ---
      const masterId = this.currentEntityId;
      const sortedIds = [masterId, ...this.entityIds.filter(id => id !== masterId)];
      return html`
                      <div class="group-list-scroll" style="overflow-y: auto; max-height: 340px;">
                        ${sortedIds.map(id => {
        var _volumeState$attribut;
        const st = this.hass.states[id];
        if (!this._supportsFeature(st, SUPPORT_GROUPING)) return nothing;
        const name = this.getChipName(id);
        const masterState = this.hass.states[masterId];
        const grouped = id === masterId ? true : Array.isArray(masterState.attributes.group_members) && masterState.attributes.group_members.includes(id);
        const obj = this.entityObjs.find(e => e.entity_id === id);
        const volumeEntity = obj && obj.volume_entity ? obj.volume_entity : id;
        const volumeState = this.hass.states[volumeEntity];
        const isRemoteVol = volumeEntity.startsWith && volumeEntity.startsWith("remote.");
        const volVal = Number((volumeState === null || volumeState === void 0 || (_volumeState$attribut = volumeState.attributes) === null || _volumeState$attribut === void 0 ? void 0 : _volumeState$attribut.volume_level) || 0);
        return html`
                            <div style="
                              display: flex;
                              align-items: center;
                              padding: 6px 4px;
                            ">
                              <span style="
                                display:inline-block;
                                width: 140px;
                                min-width: 100px;
                                max-width: 160px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                              ">${name}</span>
                              <div style="flex:1;display:flex;align-items:center;gap:9px;margin:0 10px;">
                                ${isRemoteVol ? html`
                                        <div class="vol-stepper">
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, -1)} title="Vol Down">–</button>
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, 1)} title="Vol Up">+</button>
                                        </div>
                                      ` : html`
                                        <input
                                          class="vol-slider"
                                          type="range"
                                          min="0"
                                          max="1"
                                          step="0.01"
                                          .value=${volVal}
                                          @change=${e => this._onGroupVolumeChange(id, volumeEntity, e)}
                                          title="Volume"
                                          style="width:100%;max-width:260px;"
                                        />
                                      `}
                                <span style="min-width:34px;display:inline-block;text-align:right;">${typeof volVal === "number" ? Math.round(volVal * 100) + "%" : "--"}</span>
                              </div>
                              ${id === masterId ? html`
                                      <button class="group-toggle-btn group-toggle-transparent"
                                              disabled
                                              aria-label="Master"
                                              style="margin-left:14px;"></button>
                                    ` : html`
                                      <button class="group-toggle-btn"
                                              @click=${() => this._toggleGroup(id)}
                                              title=${grouped ? "Unjoin" : "Join"}
                                              style="margin-left:14px;">
                                        <span class="group-toggle-fix">${grouped ? "–" : "+"}</span>
                                      </button>
                                    `}
                            </div>
                          `;
      })}
                      </div>
                    `;
      // --- End new group player rows logic ---
    })()}
              ` : html`
                <button class="entity-options-item" @click=${() => this._closeSourceList()} style="margin-bottom:14px;">← Back</button>
                <div class="entity-options-sheet source-list-sheet" style="position:relative;">
                  <div class="source-list-scroll" style="overflow-y:auto;max-height:340px;">
                    ${sourceList.map(src => html`
                      <div class="entity-options-item" data-source-name="${src}" @click=${() => this._selectSource(src)}>${src}</div>
                    `)}
                  </div>
                </div>
                <div class="floating-source-index">
                  ${sourceLetters.map((letter, i) => {
      const hovered = this._hoveredSourceLetterIndex;
      let scale = "";
      if (hovered !== null && hovered !== undefined) {
        const dist = Math.abs(hovered - i);
        if (dist === 0) scale = "max";else if (dist === 1) scale = "large";else if (dist === 2) scale = "med";
      }
      return html`
                      <button
                        class="source-index-letter"
                        data-scale=${scale}
                        @mouseenter=${() => {
        this._hoveredSourceLetterIndex = i;
        this.requestUpdate();
      }}
                        @mouseleave=${() => {
        this._hoveredSourceLetterIndex = null;
        this.requestUpdate();
      }}
                        @click=${() => this._scrollToSourceLetter(letter)}
                      >
                        ${letter}
                      </button>
                    `;
    })}
                </div>
              `}
            </div>
          </div>
        ` : nothing}
          ${this._searchOpen ? renderSearchSheet({
      open: this._searchOpen,
      query: this._searchQuery,
      loading: this._searchLoading,
      results: this._searchResults,
      error: this._searchError,
      onClose: () => this._searchCloseSheet(),
      onQueryInput: e => {
        this._searchQuery = e.target.value;
        this.requestUpdate();
      },
      onSearch: () => this._doSearch(),
      onPlay: item => this._playMediaFromSearch(item)
    }) : nothing}
        </ha-card>
      `;
  }
  _updateIdleState() {
    const stateObj = this.currentStateObj;
    // Only start idle timer if not playing
    if (stateObj && stateObj.state === "playing") {
      // Became active, clear timer and set not idle
      if (this._idleTimeout) clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
      if (this._isIdle) {
        this._isIdle = false;
        this.requestUpdate();
      }
    } else {
      // Only set timer if not already idle and not already waiting
      if (!this._isIdle && !this._idleTimeout) {
        this._idleTimeout = setTimeout(() => {
          this._isIdle = true;
          this._idleTimeout = null;
          this.requestUpdate();
        }, 60000); // 1 minute
      }
    }
  }

  // Home assistant layout options
  getGridOptions() {
    // Use the same logic as in render() to know if the card is collapsed.
    const collapsed = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    const minRows = collapsed ? 2 : 4;
    return {
      min_rows: minRows,
      // Keep the default full‑width behaviour explicit.
      columns: 12
    };
  }

  // Configuration editor schema for Home Assistant UI editors
  static get _schema() {
    return [{
      name: "entities",
      selector: {
        entity: {
          multiple: true,
          domain: "media_player"
        }
      },
      required: true
    }, {
      name: "show_chip_row",
      selector: {
        select: {
          options: [{
            value: "auto",
            label: "Auto"
          }, {
            value: "always",
            label: "Always"
          }]
        }
      },
      required: false
    }, {
      name: "hold_to_pin",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "idle_image",
      selector: {
        entity: {
          domain: "",
          multiple: false
        }
      },
      required: false
    }, {
      name: "match_theme",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "collapse_on_idle",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "always_collapsed",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "alternate_progress_bar",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "volume_mode",
      selector: {
        select: {
          options: [{
            value: "slider",
            label: "Slider"
          }, {
            value: "stepper",
            label: "Stepper"
          }]
        }
      },
      required: false
    }, {
      name: "actions",
      selector: {
        object: {}
      },
      required: false
    }];
  }
  firstUpdated() {
    var _super$firstUpdated;
    (_super$firstUpdated = super.firstUpdated) === null || _super$firstUpdated === void 0 || _super$firstUpdated.call(this);
    // Trap scroll events inside floating index so they don't scroll the page
    const index = this.renderRoot.querySelector('.floating-source-index');
    if (index) {
      index.addEventListener('wheel', function (e) {
        const {
          scrollTop,
          scrollHeight,
          clientHeight
        } = index;
        const delta = e.deltaY;
        if (delta < 0 && scrollTop === 0 || delta > 0 && scrollTop + clientHeight >= scrollHeight) {
          e.preventDefault();
          e.stopPropagation();
        }
        // Otherwise, allow scroll
      }, {
        passive: false
      });
    }
  }
  _addGrabScroll(selector) {
    const row = this.renderRoot.querySelector(selector);
    if (!row || row._grabScrollAttached) return;
    let isDown = false;
    let startX, scrollLeft;
    // Track drag state to suppress clicks

    row.addEventListener('mousedown', e => {
      isDown = true;
      row._dragged = false;
      row.classList.add('grab-scroll-active');
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
      e.preventDefault();
    });
    row.addEventListener('mouseleave', () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    });
    row.addEventListener('mouseup', () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    });
    row.addEventListener('mousemove', e => {
      if (!isDown) return;
      const x = e.pageX - row.offsetLeft;
      const walk = x - startX;
      // Mark as dragged if moved > 5px
      if (Math.abs(walk) > 5) {
        row._dragged = true;
      }
      e.preventDefault();
      row.scrollLeft = scrollLeft - walk;
    });
    // Suppress click after drag
    row.addEventListener('click', e => {
      if (row._dragged) {
        e.stopPropagation();
        e.preventDefault();
        row._dragged = false;
      }
    }, true);
    row._grabScrollAttached = true;
  }
  _addVerticalGrabScroll(selector) {
    const col = this.renderRoot.querySelector(selector);
    if (!col || col._grabScrollAttached) return;
    let isDown = false;
    let startY, scrollTop;
    col.addEventListener('mousedown', e => {
      isDown = true;
      col._dragged = false;
      col.classList.add('grab-scroll-active');
      startY = e.pageY - col.getBoundingClientRect().top;
      scrollTop = col.scrollTop;
      e.preventDefault();
    });
    col.addEventListener('mouseleave', () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    });
    col.addEventListener('mouseup', () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    });
    col.addEventListener('mousemove', e => {
      if (!isDown) return;
      const y = e.pageY - col.getBoundingClientRect().top;
      const walk = y - startY;
      if (Math.abs(walk) > 5) col._dragged = true;
      e.preventDefault();
      col.scrollTop = scrollTop - walk;
    });
    // Suppress clicks after drag
    col.addEventListener('click', e => {
      if (col._dragged) {
        e.stopPropagation();
        e.preventDefault();
        col._dragged = false;
      }
    }, true);
    col._grabScrollAttached = true;
  }
  disconnectedCallback() {
    var _super$disconnectedCa;
    if (this._idleTimeout) {
      clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
    }
    (_super$disconnectedCa = super.disconnectedCallback) === null || _super$disconnectedCa === void 0 || _super$disconnectedCa.call(this);
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    if (this._debouncedVolumeTimer) {
      clearTimeout(this._debouncedVolumeTimer);
      this._debouncedVolumeTimer = null;
    }
    this._removeSourceDropdownOutsideHandler();
  }
  // Entity options overlay handlers
  _closeEntityOptions() {
    if (this._showGrouping) {
      // Close the grouping sheet and the overlay
      this._showGrouping = false;
      this._showEntityOptions = false;
      // Auto-select the chip for the group just created (same as _closeGrouping logic)
      const groups = this.groupedSortedEntityIds;
      const curId = this.currentEntityId;
      const group = groups.find(g => g.includes(curId));
      if (group && group.length > 1) {
        const master = this._getActualGroupMaster(group);
        const idx = this.entityIds.indexOf(master);
        if (idx >= 0) this._selectedIndex = idx;
      }
      this.requestUpdate();
    } else {
      this._showEntityOptions = false;
      this._showGrouping = false;
      this._showSourceList = false;
      this.requestUpdate();
    }
  }
  _openEntityOptions() {
    this._showEntityOptions = true;
    this.requestUpdate();
  }

  // Deprecated: _triggerMoreInfo is replaced by _openMoreInfo for clarity.

  // Grouping Helper Methods 
  _openGrouping() {
    this._showEntityOptions = true; // ensure the overlay is visible
    this._showGrouping = true; // show grouping sheet immediately
    // Remember the current entity as the last grouping master
    this._lastGroupingMasterId = this.currentEntityId;
    this.requestUpdate();
  }

  // Source List Helper Methods
  _openSourceList() {
    this._showEntityOptions = true;
    this._showSourceList = true;
    this._showGrouping = false;
    this.requestUpdate();
  }
  _closeSourceList() {
    this._showSourceList = false;
    this.requestUpdate();
  }
  _closeGrouping() {
    this._showGrouping = false;
    // After closing, try to keep the master chip selected if still valid
    const groups = this.groupedSortedEntityIds;
    let masterId = this._lastGroupingMasterId;
    // Find the group that contains the last grouping master, if any
    const group = groups.find(g => masterId && g.includes(masterId));
    if (group && group.length > 1) {
      const master = this._getActualGroupMaster(group);
      const idx = this.entityIds.indexOf(master);
      if (idx >= 0) this._selectedIndex = idx;
    }
    // No requestUpdate here; overlay close will handle it.
  }
  async _toggleGroup(targetId) {
    const masterId = this.currentEntityId;
    if (!masterId || !targetId) return;
    const masterState = this.hass.states[masterId];
    const grouped = Array.isArray(masterState === null || masterState === void 0 ? void 0 : masterState.attributes.group_members) && masterState.attributes.group_members.includes(targetId);
    if (grouped) {
      // Unjoin the target from the group
      await this.hass.callService("media_player", "unjoin", {
        entity_id: targetId
      });
    } else {
      // Join the target player to the master's group
      await this.hass.callService("media_player", "join", {
        entity_id: masterId,
        // call on the master
        group_members: [targetId] // player(s) to add
      });
    }
    // Keep sheet open for more grouping actions
  }

  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor");
  }
  static getStubConfig(hass, entities) {
    return {
      entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2)
    };
  }

  // Group all supported entities to current master
  async _groupAll() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;

    // Get all other entities that support grouping and are not already grouped with master
    const alreadyGrouped = Array.isArray(masterState.attributes.group_members) ? masterState.attributes.group_members : [];
    const toJoin = this.entityIds.filter(id => id !== masterId).filter(id => {
      const st = this.hass.states[id];
      return this._supportsFeature(st, SUPPORT_GROUPING) && !alreadyGrouped.includes(id);
    });
    if (toJoin.length > 0) {
      await this.hass.callService("media_player", "join", {
        entity_id: masterId,
        group_members: toJoin
      });
    }
    // After grouping, keep the master set if still valid
    this._lastGroupingMasterId = masterId;
    // Remain in grouping sheet
  }

  // Ungroup all members from current master
  async _ungroupAll() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;
    const members = Array.isArray(masterState.attributes.group_members) ? masterState.attributes.group_members : [];
    // Only unjoin those that support grouping
    const toUnjoin = members.filter(id => {
      const st = this.hass.states[id];
      return this._supportsFeature(st, SUPPORT_GROUPING);
    });
    // Unjoin each member individually
    for (const id of toUnjoin) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: id
      });
    }
    // After ungrouping, keep the master set if still valid (may now be solo)
    this._lastGroupingMasterId = masterId;
    // Remain in grouping sheet
  }

  // Synchronize all group member volumes to match the master
  async _syncGroupVolume() {
    const masterId = this.currentEntityId;
    if (!masterId) return;
    const masterState = this.hass.states[masterId];
    if (!this._supportsFeature(masterState, SUPPORT_GROUPING)) return;
    const masterObj = this.entityObjs.find(e => e.entity_id === masterId);
    const masterVolumeEntity = masterObj && masterObj.volume_entity ? masterObj.volume_entity : masterId;
    const masterVolumeState = this.hass.states[masterVolumeEntity];
    if (!masterVolumeState) return;
    const masterVol = Number(masterVolumeState.attributes.volume_level || 0);
    const members = Array.isArray(masterState.attributes.group_members) ? masterState.attributes.group_members : [];
    for (const id of members) {
      const obj = this.entityObjs.find(e => e.entity_id === id);
      const volumeEntity = obj && obj.volume_entity ? obj.volume_entity : id;
      await this.hass.callService("media_player", "volume_set", {
        entity_id: volumeEntity,
        volume_level: masterVol
      });
    }
  }
}
customElements.define("yet-another-media-player", YetAnotherMediaPlayerCard);
