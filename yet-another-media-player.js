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
  i$4 = function (t) {
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
    is: i$3,
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
  f$1 = (t, s) => !i$3(t, s),
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
  i$2 = t.trustedTypes,
  s$1 = i$2 ? i$2.createPolicy("lit-html", {
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
            r.textContent = i$2 ? i$2.emptyScript : "";
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
let i$1 = class i extends y$1 {
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
};
i$1._$litElement$ = true, i$1["finalized"] = true, (_s$litElementHydrateS = s.litElementHydrateSupport) === null || _s$litElementHydrateS === void 0 ? void 0 : _s$litElementHydrateS.call(s, {
  LitElement: i$1
});
const o = s.litElementPolyfillSupport;
o === null || o === void 0 || o({
  LitElement: i$1
});
(s.litElementVersions ??= []).push("4.2.0");

// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";

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

// Helper to render a group chip: same as chip but with label (with count), no badge/icon for group, just art/icon and label.
function renderGroupChip(_ref2) {
  let {
    idx,
    selected,
    groupName,
    art,
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
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;">
      <span class="chip-icon"
            style="cursor:pointer;"
            @click=${e => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick(idx, e);
    }
  }}>
        ${art ? x`<img class="chip-mini-art"
                      src="${art}"
                      style="cursor:pointer;"
                      @click=${e => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick(idx, e);
    }
  }}/>` : x`<ha-icon .icon=${icon}
                          style="font-size:28px;cursor:pointer;"
                          @click=${e => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick(idx, e);
    }
  }}></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${groupName}
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
// Central chip row renderer
function renderChipRow(_ref4) {
  let {
    groupedSortedEntityIds,
    entityIds,
    selectedEntityId,
    pinnedIndex,
    holdToPin,
    getChipName,
    getActualGroupMaster,
    isIdle,
    hass,
    onChipClick,
    onIconClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp
  } = _ref4;
  if (!groupedSortedEntityIds || !groupedSortedEntityIds.length) return E;
  return x`
    ${groupedSortedEntityIds.map(group => {
    // If it's a group (more than one entity)
    if (group.length > 1) {
      var _hass$states, _state$attributes, _state$attributes2, _state$attributes3;
      const id = getActualGroupMaster(group);
      const idx = entityIds.indexOf(id);
      const state = hass === null || hass === void 0 || (_hass$states = hass.states) === null || _hass$states === void 0 ? void 0 : _hass$states[id];
      const art = (state === null || state === void 0 || (_state$attributes = state.attributes) === null || _state$attributes === void 0 ? void 0 : _state$attributes.entity_picture) || (state === null || state === void 0 || (_state$attributes2 = state.attributes) === null || _state$attributes2 === void 0 ? void 0 : _state$attributes2.album_art) || null;
      const icon = (state === null || state === void 0 || (_state$attributes3 = state.attributes) === null || _state$attributes3 === void 0 ? void 0 : _state$attributes3.icon) || "mdi:cast";
      return renderGroupChip({
        idx,
        selected: selectedEntityId === id,
        groupName: getChipName(id) + (group.length > 1 ? ` [${group.length}]` : ""),
        art,
        icon,
        pinned: pinnedIndex === idx,
        onChipClick,
        onIconClick,
        onPinClick,
        onPointerDown: e => onPointerDown(e, idx),
        onPointerMove: e => onPointerMove(e, idx),
        onPointerUp: e => onPointerUp(e, idx)
      });
    } else {
      var _hass$states2, _state$attributes4, _state$attributes5, _state$attributes6, _state$attributes7, _state$attributes8;
      // Single chip
      const id = group[0];
      const idx = entityIds.indexOf(id);
      const state = hass === null || hass === void 0 || (_hass$states2 = hass.states) === null || _hass$states2 === void 0 ? void 0 : _hass$states2[id];
      const isChipPlaying = selectedEntityId === id ? !isIdle : (state === null || state === void 0 ? void 0 : state.state) === "playing";
      const art = selectedEntityId === id ? !isIdle && ((state === null || state === void 0 || (_state$attributes4 = state.attributes) === null || _state$attributes4 === void 0 ? void 0 : _state$attributes4.entity_picture) || (state === null || state === void 0 || (_state$attributes5 = state.attributes) === null || _state$attributes5 === void 0 ? void 0 : _state$attributes5.album_art)) : (state === null || state === void 0 ? void 0 : state.state) === "playing" && ((state === null || state === void 0 || (_state$attributes6 = state.attributes) === null || _state$attributes6 === void 0 ? void 0 : _state$attributes6.entity_picture) || (state === null || state === void 0 || (_state$attributes7 = state.attributes) === null || _state$attributes7 === void 0 ? void 0 : _state$attributes7.album_art));
      const icon = (state === null || state === void 0 || (_state$attributes8 = state.attributes) === null || _state$attributes8 === void 0 ? void 0 : _state$attributes8.icon) || "mdi:cast";
      return renderChip({
        idx,
        selected: selectedEntityId === id,
        playing: isChipPlaying,
        name: getChipName(id),
        art,
        icon,
        pinned: pinnedIndex === idx,
        onChipClick,
        onPinClick,
        onPointerDown: e => onPointerDown(e, idx),
        onPointerMove: e => onPointerMove(e, idx),
        onPointerUp: e => onPointerUp(e, idx)
      });
    }
  })}
  `;
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

const yampCardStyles = i$4`
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

/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
function isNothing(subject) {
  return typeof subject === 'undefined' || subject === null;
}
function isObject(subject) {
  return typeof subject === 'object' && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = '',
    cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};

// YAML error class. http://stackoverflow.com/questions/8458984

function formatError(exception, compact) {
  var where = '',
    message = exception.reason || '(unknown reason)';
  if (!exception.mark) return message;
  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }
  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';
  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }
  return message + ' ' + where;
}
function YAMLException$1(reason, mark) {
  // Super constructor
  Error.call(this);
  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = new Error().stack || '';
  }
}

// Inherit from Error
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};
var exception = YAMLException$1;

// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}
function padStart(string, max) {
  return common.repeat(' ', max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== 'number') options.indent = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter !== 'number') options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = '',
    i,
    line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
    result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + ' | ' + line.str + '\n' + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + ' | ' + line.str + '\n';
  result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
    result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + ' | ' + line.str + '\n';
  }
  return result.replace(/\n$/, '');
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = ['kind', 'multi', 'resolve', 'construct', 'instanceOf', 'predicate', 'represent', 'representName', 'defaultStyle', 'styleAliases'];
var YAML_NODE_KINDS = ['scalar', 'sequence', 'mapping'];
function compileStyleAliases(map) {
  var result = {};
  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options = options; // keep original options in case user wants to extend this type later
  this.tag = tag;
  this.kind = options['kind'] || null;
  this.resolve = options['resolve'] || function () {
    return true;
  };
  this.construct = options['construct'] || function (data) {
    return data;
  };
  this.instanceOf = options['instanceOf'] || null;
  this.predicate = options['predicate'] || null;
  this.represent = options['represent'] || null;
  this.representName = options['representName'] || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.multi = options['multi'] || false;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;

/*eslint-disable max-len*/

function compileList(schema, name) {
  var result = [];
  schema[name].forEach(function (currentType) {
    var newIndex = result.length;
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap(/* lists... */
) {
  var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    },
    index,
    length;
  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    // Schema.extend(type)
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception('Schema.extend argument should be a Type, [ Type ], ' + 'or a schema definition ({ implicit: [...], explicit: [...] })');
  }
  implicit.forEach(function (type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
    if (type$1.loadKind && type$1.loadKind !== 'scalar') {
      throw new exception('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
    if (type$1.multi) {
      throw new exception('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });
  explicit.forEach(function (type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) {
    return data !== null ? data : '';
  }
});
var seq = new type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) {
    return data !== null ? data : [];
  }
});
var map = new type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [str, seq, map]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === '~' || max === 4 && (data === 'null' || data === 'Null' || data === 'NULL');
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () {
      return '~';
    },
    lowercase: function () {
      return 'null';
    },
    uppercase: function () {
      return 'NULL';
    },
    camelcase: function () {
      return 'Null';
    },
    empty: function () {
      return '';
    }
  },
  defaultStyle: 'lowercase'
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === 'true' || data === 'True' || data === 'TRUE') || max === 5 && (data === 'false' || data === 'False' || data === 'FALSE');
}
function constructYamlBoolean(data) {
  return data === 'true' || data === 'True' || data === 'TRUE';
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}
var bool = new type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) {
      return object ? 'true' : 'false';
    },
    uppercase: function (object) {
      return object ? 'TRUE' : 'FALSE';
    },
    camelcase: function (object) {
      return object ? 'True' : 'False';
    }
  },
  defaultStyle: 'lowercase'
});
function isHexCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */ || 0x41 /* A */ <= c && c <= 0x46 /* F */ || 0x61 /* a */ <= c && c <= 0x66 /* f */;
}
function isOctCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x37 /* 7 */;
}
function isDecCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length,
    index = 0,
    hasDigits = false,
    ch;
  if (!max) return false;
  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }
  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
    if (ch === 'x') {
      // base 16
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
    if (ch === 'o') {
      // base 8
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data,
    sign = 1,
    ch;
  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }
  ch = value[0];
  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === '0') return 0;
  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && object % 1 === 0 && !common.isNegativeZero(object);
}
var int = new type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function (obj) {
      return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1);
    },
    octal: function (obj) {
      return obj >= 0 ? '0o' + obj.toString(8) : '-0o' + obj.toString(8).slice(1);
    },
    decimal: function (obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function (obj) {
      return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() : '-0x' + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary: [2, 'bin'],
    octal: [8, 'oct'],
    decimal: [10, 'dec'],
    hexadecimal: [16, 'hex']
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
// 2.5e4, 2.5 and integers
'^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
// .2e4, .2
// special case, seems not from spec
'|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
// .inf
'|[-+]?\\.(?:inf|Inf|INF)' +
// .nan
'|\\.(?:nan|NaN|NAN))$');
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) ||
  // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === '_') {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, '').toLowerCase();
  sign = value[0] === '-' ? -1 : 1;
  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === '.inf') {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case 'lowercase':
        return '.nan';
      case 'uppercase':
        return '.NAN';
      case 'camelcase':
        return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '.inf';
      case 'uppercase':
        return '.INF';
      case 'camelcase':
        return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '-.inf';
      case 'uppercase':
        return '-.INF';
      case 'camelcase':
        return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }
  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});
var json = failsafe.extend({
  implicit: [_null, bool, int, float]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' +
// [1] year
'-([0-9][0-9])' +
// [2] month
'-([0-9][0-9])$'); // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' +
// [1] year
'-([0-9][0-9]?)' +
// [2] month
'-([0-9][0-9]?)' +
// [3] day
'(?:[Tt]|[ \\t]+)' +
// ...
'([0-9][0-9]?)' +
// [4] hour
':([0-9][0-9])' +
// [5] minute
':([0-9][0-9])' +
// [6] second
'(?:\\.([0-9]*))?' +
// [7] fraction
'(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' +
// [8] tz [9] tz_sign [10] tz_hour
'(?::([0-9][0-9]))?))?$'); // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match,
    year,
    month,
    day,
    hour,
    minute,
    second,
    fraction = 0,
    delta = null,
    tz_hour,
    tz_minute,
    date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +match[1];
  month = +match[2] - 1; // JS month starts with 0
  day = +match[3];
  if (!match[4]) {
    // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}
var timestamp = new type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}
var merge = new type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

/*eslint-disable no-bitwise*/

// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code,
    idx,
    bitlen = 0,
    max = data.length,
    map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;
    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx,
    tailbits,
    input = data.replace(/[\r\n=]/g, ''),
    // remove CR/LF & padding to simplify scan
    max = input.length,
    map = BASE64_MAP,
    bits = 0,
    result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 0xFF);
      result.push(bits >> 8 & 0xFF);
      result.push(bits & 0xFF);
    }
    bits = bits << 6 | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 0xFF);
    result.push(bits >> 8 & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 0xFF);
    result.push(bits >> 2 & 0xFF);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 0xFF);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object /*, style*/) {
  var result = '',
    bits = 0,
    idx,
    tail,
    max = object.length,
    map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map[bits >> 18 & 0x3F];
      result += map[bits >> 12 & 0x3F];
      result += map[bits >> 6 & 0x3F];
      result += map[bits & 0x3F];
    }
    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;
  if (tail === 0) {
    result += map[bits >> 18 & 0x3F];
    result += map[bits >> 12 & 0x3F];
    result += map[bits >> 6 & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[bits >> 10 & 0x3F];
    result += map[bits >> 4 & 0x3F];
    result += map[bits << 2 & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[bits >> 2 & 0x3F];
    result += map[bits << 4 & 0x3F];
    result += map[64];
    result += map[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === '[object Uint8Array]';
}
var binary = new type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [],
    index,
    length,
    pair,
    pairKey,
    pairHasKey,
    object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== '[object Object]') return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index,
    length,
    pair,
    keys,
    result,
    object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== '[object Object]') return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index,
    length,
    pair,
    keys,
    result,
    object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key,
    object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [timestamp, merge],
  explicit: [binary, omap, pairs, set]
});

/*eslint-disable max-len,no-use-before-define*/

var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 0x0A /* LF */ || c === 0x0D /* CR */;
}
function is_WHITE_SPACE(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */;
}
function is_WS_OR_EOL(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */ || c === 0x0A /* LF */ || c === 0x0D /* CR */;
}
function is_FLOW_INDICATOR(c) {
  return c === 0x2C /* , */ || c === 0x5B /* [ */ || c === 0x5D /* ] */ || c === 0x7B /* { */ || c === 0x7D /* } */;
}
function fromHexCode(c) {
  var lc;
  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;
  if (0x61 /* a */ <= lc && lc <= 0x66 /* f */) {
    return lc - 0x61 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 0x78 /* x */) {
    return 2;
  }
  if (c === 0x75 /* u */) {
    return 4;
  }
  if (c === 0x55 /* U */) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return c === 0x30 /* 0 */ ? '\x00' : c === 0x61 /* a */ ? '\x07' : c === 0x62 /* b */ ? '\x08' : c === 0x74 /* t */ ? '\x09' : c === 0x09 /* Tab */ ? '\x09' : c === 0x6E /* n */ ? '\x0A' : c === 0x76 /* v */ ? '\x0B' : c === 0x66 /* f */ ? '\x0C' : c === 0x72 /* r */ ? '\x0D' : c === 0x65 /* e */ ? '\x1B' : c === 0x20 /* Space */ ? ' ' : c === 0x22 /* " */ ? '\x22' : c === 0x2F /* / */ ? '/' : c === 0x5C /* \ */ ? '\x5C' : c === 0x4E /* N */ ? '\x85' : c === 0x5F /* _ */ ? '\xA0' : c === 0x4C /* L */ ? '\u2028' : c === 0x50 /* P */ ? '\u2029' : '';
}
function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode((c - 0x010000 >> 10) + 0xD800, (c - 0x010000 & 0x03FF) + 0xDC00);
}
var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function State$1(input, options) {
  this.input = input;
  this.filename = options['filename'] || null;
  this.schema = options['schema'] || _default;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy = options['legacy'] || false;
  this.json = options['json'] || false;
  this.listener = options['listener'] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;
  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }
    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 || 0x20 <= _character && _character <= 0x10FFFF)) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }
      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x0A /* LF */) {
    state.position++;
  } else if (ch === 0x0D /* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A /* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
    ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09 /* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 0x23 /* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A /* LF */ && ch !== 0x0D /* CR */ && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 0x20 /* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position,
    ch;
  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D /* - */ || ch === 0x2E /* . */) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
    following,
    captureStart,
    captureEnd,
    hasPendingContent,
    _line,
    _lineStart,
    _lineIndent,
    _kind = state.kind,
    _result = state.result,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 0x23 /* # */ || ch === 0x26 /* & */ || ch === 0x2A /* * */ || ch === 0x21 /* ! */ || ch === 0x7C /* | */ || ch === 0x3E /* > */ || ch === 0x27 /* ' */ || ch === 0x22 /* " */ || ch === 0x25 /* % */ || ch === 0x40 /* @ */ || ch === 0x60 /* ` */) {
    return false;
  }
  if (ch === 0x3F /* ? */ || ch === 0x2D /* - */) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 0x3A /* : */) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 0x23 /* # */) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x27 /* ' */) {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27 /* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 0x27 /* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x22 /* " */) {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22 /* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 0x5C /* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, 'unknown escape sequence');
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true,
    _line,
    _lineStart,
    _pos,
    _tag = state.tag,
    _result,
    _anchor = state.anchor,
    following,
    terminator,
    isPair,
    isExplicitPair,
    isMapping,
    overridableKeys = Object.create(null),
    keyNode,
    keyTag,
    valueNode,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x5B /* [ */) {
    terminator = 0x5D; /* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B /* { */) {
    terminator = 0x7D; /* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C /* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 0x3F /* ? */) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 0x3A /* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 0x2C /* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, 'unexpected end of the stream within a flow collection');
}
function readBlockScalar(state, nodeIndent) {
  var captureStart,
    folding,
    chomping = CHOMPING_CLIP,
    didReadContent = false,
    detectedIndent = false,
    textIndent = nodeIndent,
    emptyLines = 0,
    atMoreIndented = false,
    tmp,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x7C /* | */) {
    folding = false;
  } else if (ch === 0x3E /* > */) {
    folding = true;
  } else {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 0x2B /* + */ || ch === 0x2D /* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 0x2B /* + */ ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 0x23 /* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20 /* Space */) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {
      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {
      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

        // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

        // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) {
          // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

        // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

      // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = [],
    following,
    detected = false,
    ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }
    if (ch !== 0x2D /* - */) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
    allowCompact,
    _line,
    _keyLine,
    _keyLineStart,
    _keyPos,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = {},
    overridableKeys = Object.create(null),
    keyTag = null,
    keyNode = null,
    valueNode = null,
    atExplicitKey = false,
    detected = false,
    ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F /* ? */ || ch === 0x3A /* : */) && is_WS_OR_EOL(following)) {
      if (ch === 0x3F /* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }
      state.position += 1;
      ch = following;

      //
      // Implicit notation case. Flow-style node as the key first, then ":", and the value.
      //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 0x3A /* : */) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }
      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position,
    isVerbatim = false,
    isNamed = false,
    tagHandle,
    tagName,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x21 /* ! */) return false;
  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 0x3C /* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 0x21 /* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = '!';
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 0x3E /* > */);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 0x21 /* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;
  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x26 /* & */) return false;
  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x2A /* * */) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
    allowBlockScalars,
    allowBlockCollections,
    indentStatus = 1,
    // 1: this>parent, 0: this=parent, -1: this<parent
    atNewLine = false,
    hasContent = false,
    typeIndex,
    typeQuantity,
    typeList,
    type,
    flowIndent,
    blockIndent;
  if (state.listener !== null) {
    state.listener('open', state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = '?';
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];
      if (type.resolve(state.result)) {
        // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }
    if (!type.resolve(state.result, state.tag)) {
      // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position,
    _position,
    directiveName,
    directiveArgs,
    hasDirectives = false,
    ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 0x25 /* % */) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 0x23 /* # */) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2D /* - */ && state.input.charCodeAt(state.position + 1) === 0x2D /* - */ && state.input.charCodeAt(state.position + 2) === 0x2D /* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 0x2E /* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A /* LF */ && input.charCodeAt(input.length - 1) !== 0x0D /* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf('\0');
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';
  while (state.input.charCodeAt(state.position) === 0x20 /* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== 'function') {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception('expected a single document in the stream, but found more');
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};

/*eslint-disable no-use-before-define*/

var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 0xFEFF;
var CHAR_TAB = 0x09; /* Tab */
var CHAR_LINE_FEED = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN = 0x0D; /* CR */
var CHAR_SPACE = 0x20; /* Space */
var CHAR_EXCLAMATION = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE = 0x22; /* " */
var CHAR_SHARP = 0x23; /* # */
var CHAR_PERCENT = 0x25; /* % */
var CHAR_AMPERSAND = 0x26; /* & */
var CHAR_SINGLE_QUOTE = 0x27; /* ' */
var CHAR_ASTERISK = 0x2A; /* * */
var CHAR_COMMA = 0x2C; /* , */
var CHAR_MINUS = 0x2D; /* - */
var CHAR_COLON = 0x3A; /* : */
var CHAR_EQUALS = 0x3D; /* = */
var CHAR_GREATER_THAN = 0x3E; /* > */
var CHAR_QUESTION = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET = 0x7B; /* { */
var CHAR_VERTICAL_LINE = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0x00] = '\\0';
ESCAPE_SEQUENCES[0x07] = '\\a';
ESCAPE_SEQUENCES[0x08] = '\\b';
ESCAPE_SEQUENCES[0x09] = '\\t';
ESCAPE_SEQUENCES[0x0A] = '\\n';
ESCAPE_SEQUENCES[0x0B] = '\\v';
ESCAPE_SEQUENCES[0x0C] = '\\f';
ESCAPE_SEQUENCES[0x0D] = '\\r';
ESCAPE_SEQUENCES[0x1B] = '\\e';
ESCAPE_SEQUENCES[0x22] = '\\"';
ESCAPE_SEQUENCES[0x5C] = '\\\\';
ESCAPE_SEQUENCES[0x85] = '\\N';
ESCAPE_SEQUENCES[0xA0] = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';
var DEPRECATED_BOOLEANS_SYNTAX = ['y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON', 'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;
  if (map === null) return {};
  result = {};
  keys = Object.keys(map);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);
    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];
    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new exception('code point within a string may not be greater than 0xFFFFFFFF');
  }
  return '\\' + handle + common.repeat('0', length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1,
  QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options['schema'] || _default;
  this.indent = Math.max(1, options['indent'] || 2);
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid = options['skipInvalid'] || false;
  this.flowLevel = common.isNothing(options['flowLevel']) ? -1 : options['flowLevel'];
  this.styleMap = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys = options['sortKeys'] || false;
  this.lineWidth = options['lineWidth'] || 80;
  this.noRefs = options['noRefs'] || false;
  this.noCompatMode = options['noCompatMode'] || false;
  this.condenseFlow = options['condenseFlow'] || false;
  this.quotingType = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options['forceQuotes'] || false;
  this.replacer = typeof options['replacer'] === 'function' ? options['replacer'] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = '';
  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
    position = 0,
    next = -1,
    result = '',
    line,
    length = string.length;
  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== '\n') result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}
function testImplicitResolving(state, str) {
  var index, length, type;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];
    if (type.resolve(str)) {
      return true;
    }
  }
  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return 0x00020 <= c && c <= 0x00007E || 0x000A1 <= c && c <= 0x00D7FF && c !== 0x2028 && c !== 0x2029 || 0x0E000 <= c && c <= 0x00FFFD && c !== CHAR_BOM || 0x10000 <= c && c <= 0x10FFFF;
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM
  // - b-char
  && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
  // ns-plain-safe
  inblock ?
  // c = flow-in
  cIsNsCharOrWhitespace : cIsNsCharOrWhitespace
  // - c-flow-indicator
  && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET

  // ns-plain-char
  ) && c !== CHAR_SHARP // false on '#'
  && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
  || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP // change to true on '[^ ]#'
  || prev === CHAR_COLON && cIsNsChar; // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET
  // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
  && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE
  // | “%” | “@” | “`”)
  && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos),
    second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1,
  STYLE_SINGLE = 2,
  STYLE_LITERAL = 3,
  STYLE_FOLDED = 4,
  STYLE_DOUBLE = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
          // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
    // No block styles in flow mode.
    || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }
    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception('impossible error: invalid scalar style');
    }
  }();
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip = string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : clip ? '' : '-';
  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1],
      line = match[2];
    moreIndented = line[0] === ' ';
    result += prefix + (!prevMoreIndented && !moreIndented && line !== '' ? '\n' : '') + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0,
    end,
    curr = 0,
    next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while (match = breakRe.exec(line)) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = curr > start ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1; // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = '',
    _tag = state.tag,
    index,
    length,
    value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) || typeof value === 'undefined' && writeNode(state, level, null, false, false)) {
      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = '[' + _result + ']';
}
function writeBlockSequence(state, level, object, compact) {
  var _result = '',
    _tag = state.tag,
    index,
    length,
    value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === 'undefined' && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}
function writeFlowMapping(state, level, object) {
  var _result = '',
    _tag = state.tag,
    objectKeyList = Object.keys(object),
    index,
    length,
    objectKey,
    objectValue,
    pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }
    if (state.dump.length > 1024) pairBuffer += '? ';
    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');
    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }
    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = '{' + _result + '}';
}
function writeBlockMapping(state, level, object, compact) {
  var _result = '',
    _tag = state.tag,
    objectKeyList = Object.keys(object),
    index,
    length,
    objectKey,
    objectValue,
    explicitPair,
    pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new exception('sortKeys must be a boolean or a function');
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';
    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }
    explicitPair = state.tag !== null && state.tag !== '?' || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }
    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];
    if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === 'object' && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }
      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;
        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new exception('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type === '[object Object]' || type === '[object Array]',
    duplicateIndex,
    duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== '?' || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception('unacceptable kind of an object to dump ' + type);
    }
    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(state.tag[0] === '!' ? state.tag.slice(1) : state.tag).replace(/!/g, '%21');
      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }
      state.dump = tagStr + ' ' + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [],
    duplicatesIndexes = [],
    index,
    length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({
      '': value
    }, '', value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';
  return '';
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' + 'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;

// Re-export all types in case user wants to create custom schema
var types = {
  binary: binary,
  float: float,
  map: map,
  null: _null,
  pairs: pairs,
  set: set,
  timestamp: timestamp,
  bool: bool,
  int: int,
  merge: merge,
  omap: omap,
  seq: seq,
  str: str
};

// Removed functions from JS-YAML 3.0.x
var safeLoad = renamed('safeLoad', 'load');
var safeLoadAll = renamed('safeLoadAll', 'loadAll');
var safeDump = renamed('safeDump', 'dump');
var jsYaml = {
  Type: Type,
  Schema: Schema,
  FAILSAFE_SCHEMA: FAILSAFE_SCHEMA,
  JSON_SCHEMA: JSON_SCHEMA,
  CORE_SCHEMA: CORE_SCHEMA,
  DEFAULT_SCHEMA: DEFAULT_SCHEMA,
  load: load,
  loadAll: loadAll,
  dump: dump,
  YAMLException: YAMLException,
  types: types,
  safeLoad: safeLoad,
  safeLoadAll: safeLoadAll,
  safeDump: safeDump
};

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
class YetAnotherMediaPlayerEditor extends i$1 {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _entityEditorIndex: {
        type: Number
      },
      _actionEditorIndex: {
        type: Number
      },
      _entityMoveMode: {
        type: Boolean
      },
      _actionMoveMode: {
        type: Boolean
      },
      _actionMode: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this._entityEditorIndex = null;
    this._actionEditorIndex = null;
    this._entityMoveMode = false;
    this._actionMoveMode = false;
    this._yamlDraft = "";
    this._parsedYaml = null;
    this._yamlError = false;
    this._serviceItems = [];
  }
  firstUpdated() {
    this._serviceItems = this._getServiceItems();
  }
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }
  _getServiceItems() {
    var _this$hass;
    if (!((_this$hass = this.hass) !== null && _this$hass !== void 0 && _this$hass.services)) return [];
    return Object.entries(this.hass.services).flatMap(_ref => {
      let [domain, services] = _ref;
      return Object.keys(services).map(svc => ({
        label: `${domain}.${svc}`,
        value: `${domain}.${svc}`
      }));
    });
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
  _updateActionProperty(key, value) {
    const actions = [...(this._config.actions ?? [])];
    const idx = this._actionEditorIndex;
    if (actions[idx]) {
      actions[idx] = {
        ...actions[idx],
        [key]: value
      };
      this._updateConfig("actions", actions);
    }
  }
  static get styles() {
    return i$4`
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
        /* visually isolate grouped controls */
        .entity-group, .action-group {
          background: var(--card-background-color, #f7f7f7);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 16px;
          margin-top: 16px;
        }
        /* wraps the entity selector and edit button */
        .entity-row-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        /* wraps the action icon, name textbox and edit button */
        .action-row-inner {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px;
          margin: 0px;
        }
        .action-row-inner > ha-icon {
          margin-right: 5px;
          margin-top: 0px;
        }
        /* allow children to fill all available space */
        .grow-children {
          flex: 1;
          display: flex;
        }
        .grow-children > * {
          flex: 1;
          min-width: 0;
        }
        .entity-editor-header, .action-editor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
        }
        .entity-editor-title, .action-editor-title {
          font-weight: 500;
          font-size: 1.1em;
          line-height: 1;
        }
        .action-icon-placeholder {
          width: 29px; 
          height: 24px; 
          display: inline-block;
        }
        .full-width {
          width: 100%;
        }
        .entity-group-header, .action-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0px 6px;
        }
        .entity-group-title, action-group-title {
          font-weight: 500;
        }
        .entity-group-actions, action-group-actions {
          display: flex;
          align-items: center;
        }
        entity-row-actions {
          display: flex;
          align-items: center;
        }
        .action-row-actions {
          display: flex;
          align-items: flex-start;
          padding-top: 3px;
        }
        .action-icon {
          align-self: flex-start;
          padding-top: 16px;
        }
        .service-data-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 4px;
        }
        .service-data-editor-title {
          font-weight: 500;
        }
        .service-data-editor-actions {
          display: flex;
          gap: 8px;
        }
        .code-editor-wrapper.error {
          border: 1px solid color: var(--error-color, red);
          border-radius: 4px;
          padding: 1px;
        }
        .yaml-error-message {
          color: var(--error-color, red);
          font-size: 14px;
          margin: 6px;
          white-space: pre-wrap;
          font-family: Consolas, Menlo, Monaco, monospace;
          line-height: 1.4;
        }
        .help-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 0.9em;
        }
        .help-table th,
        .help-table td {
          border: 1px solid var(--divider-color, #444);
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        .help-table thead {
          background: var(--card-background-color, #222);
          font-weight: bold;
        }
        .help-title {
          font-weight: bold;
          margin-top: 16px;
          font-size: 1em;
        }
        code {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 4px;
          border-radius: 4px;
        } 
        .icon-button {
          display: inline-flex;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
          align-self: center;
          align-items: center;
          padding: 12px;
        }
        .icon-button:hover {
          color: var(--primary-color, #2196f3);
        }
        .icon-button-disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        .help-text {
          padding: 12px 25px;
        }
        .add-action-button-wrapper {
          display: flex;
          justify-content: center;
        }
      `;
  }
  render() {
    if (!this._config) return x``;
    if (this._entityEditorIndex !== null) {
      var _this$_config$entitie;
      const entity = (_this$_config$entitie = this._config.entities) === null || _this$_config$entitie === void 0 ? void 0 : _this$_config$entitie[this._entityEditorIndex];
      return this._renderEntityEditor(entity);
    } else if (this._actionEditorIndex !== null) {
      var _this$_config$actions;
      const action = (_this$_config$actions = this._config.actions) === null || _this$_config$actions === void 0 ? void 0 : _this$_config$actions[this._actionEditorIndex];
      return this._renderActionEditor(action);
    }
    return this._renderMainEditor();
  }
  _renderMainEditor() {
    if (!this._config) return x``;
    let entities = [...(this._config.entities ?? [])];
    let actions = [...(this._config.actions ?? [])];

    // Append a blank row only for rendering (not saved)
    if (entities.length === 0 || entities[entities.length - 1].entity_id) {
      entities.push({
        entity_id: ""
      });
    }
    return x`
        <div class="form-row entity-group">
          <div class="entity-group-header">
            <div class="entity-group-title">
              Entities*
            </div>
            <div class="entity-group-actions">
              <ha-icon
                class="icon-button"
                icon=${this._entityMoveMode ? "mdi:pencil" : "mdi:swap-vertical"}
                title=${this._entityMoveMode ? "Back to Edit Mode" : "Enable Move Mode"}
                @mousedown=${e => e.preventDefault()}
                @click=${() => this._toggleEntityMoveMode()}
              ></ha-icon>
            </div>
          </div>
          ${entities.map((ent, idx) => {
      var _this$_config$entitie2;
      return x`
            <div class="entity-row-inner">
              <div class="grow-children">
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
              <div class="entity-row-actions">
                ${!this._entityMoveMode ? x`
                <ha-icon
                  class="icon-button ${!ent.entity_id ? "icon-button-disabled" : ""}"
                  icon="mdi:pencil"
                  title="Edit Entity Settings"
                  @click=${() => this._onEditEntity(idx)}
                ></ha-icon>
                ` : x`
                  <ha-icon
                    class="icon-button ${idx === 0 || idx === entities.length - 1 ? "icon-button-disabled" : ""}"
                    icon="mdi:arrow-up"
                    title="Move Up"
                    @mousedown=${e => e.preventDefault()}
                    @click=${e => this._moveEntity(idx, -1)}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${idx >= entities.length - 2 ? "icon-button-disabled" : ""}"
                    icon="mdi:arrow-down"
                    title="Move Down"
                    @mousedown=${e => e.preventDefault()}
                    @click=${e => this._moveEntity(idx, 1)}
                  ></ha-icon>
                `}
              </div>
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

        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      number: {
        min: 0,
        step: 1000,
        unit_of_measurement: "ms",
        mode: "box"
      }
    }}
              .value=${this._config.idle_timeout_ms ?? 60000}
              label="Idle Timeout (ms)"
              @value-changed=${e => this._updateConfig("idle_timeout_ms", e.detail.value)}
            ></ha-selector>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="Reset to default"
            @click=${() => this._updateConfig("idle_timeout_ms", 60000)}
          ></ha-icon>
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
        ${this._config.volume_mode === "stepper" ? x`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{
      number: {
        min: 0.01,
        max: 1,
        step: 0.01,
        unit_of_measurement: "",
        mode: "box"
      }
    }}
                .value=${this._config.volume_step ?? 0.05}
                label="Volume Step (0.05 = 5%)"
                @value-changed=${e => this._updateConfig("volume_step", e.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="Reset to default"
              @click=${() => this._updateConfig("volume_step", 0.05)}
            ></ha-icon>
          </div>
        ` : E}

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

         <div class="form-row action-group">
          <div class="action-group-header">
            <div class="action-group-title">
              Actions
            </div>
            <div class="action-group-actions">
              <ha-icon
                class="icon-button"
                icon=${this._actionMoveMode ? "mdi:pencil" : "mdi:swap-vertical"}
                title=${this._actionMoveMode ? "Back to Edit Mode" : "Enable Move Mode"}
                @mousedown=${e => e.preventDefault()}
                @click=${e => {
      this._toggleActionMoveMode();
      e.currentTarget.blur();
    }}
              ></ha-icon>
            </div>
          </div>
          ${actions.map((act, idx) => x`
            <div class="action-row-inner">
              ${act !== null && act !== void 0 && act.icon ? x`
                <ha-icon 
                class="action-icon"
                icon="${act === null || act === void 0 ? void 0 : act.icon}"></ha-icon>
              ` : x`
                <span class="action-icon-placeholder"></span>
              `}
              <div class="grow-children">
                <ha-textfield
                  placeholder="(Icon Only)"
                  .value=${(act === null || act === void 0 ? void 0 : act.name) ?? ""}
                  helper="${act !== null && act !== void 0 && act.menu_item ? `Open Menu Item: ${act === null || act === void 0 ? void 0 : act.menu_item}` : act !== null && act !== void 0 && act.service ? `Call Service: ${act === null || act === void 0 ? void 0 : act.service}` : `Not Configured`}"
                  .helperPersistent=${true}
                  @input=${a => this._onActionChanged(idx, a.target.value)}
                ></ha-textfield>
              </div>
              <div class="action-row-actions">
               ${!this._actionMoveMode ? x`
                <ha-icon
                  class="icon-button"
                  icon="mdi:pencil"
                  title="Edit Action Settings"
                  @click=${() => this._onEditAction(idx)}
                ></ha-icon>
                <ha-icon
                  class="icon-button"
                  icon="mdi:trash-can"
                  title="Delete Action"
                  @click=${() => this._removeAction(idx)}
                ></ha-icon>
              ` : x`
                <ha-icon
                  class="icon-button ${idx === 0 ? "icon-button-disabled" : ""}"
                  icon="mdi:arrow-up"
                  title="Move Up"
                  @mousedown=${e => e.preventDefault()}
                  @click=${e => {
      this._moveAction(idx, -1);
      e.currentTarget.blur();
    }}
                ></ha-icon>
                <ha-icon
                  class="icon-button ${idx >= actions.length - 1 ? "icon-button-disabled" : ""}"
                  icon="mdi:arrow-down"
                  title="Move Down"
                  @mousedown=${e => e.preventDefault()}
                  @click=${e => {
      this._moveAction(idx, 1);
      e.currentTarget.blur();
    }}
                ></ha-icon>
                `}
              </div>
            </div>
          `)}
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="Add Action"
              @click=${() => {
      const newActions = [...(this._config.actions ?? []), {}];
      const newIndex = newActions.length - 1;
      this._updateConfig("actions", newActions);
      this._onEditAction(newIndex);
    }}
            ></ha-icon>
          </div>
        </div>

      `;
  }
  _renderEntityEditor(entity) {
    var _this$hass2;
    const stateObj = (_this$hass2 = this.hass) === null || _this$hass2 === void 0 || (_this$hass2 = _this$hass2.states) === null || _this$hass2 === void 0 ? void 0 : _this$hass2[entity === null || entity === void 0 ? void 0 : entity.entity_id];
    const showGroupVolume = this._supportsFeature(stateObj, SUPPORT_GROUPING);
    return x`
        <div class="entity-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromEntityEditor}>
          </ha-icon>
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
            .includeDomains=${["media_player", "remote"]}
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
  _renderActionEditor(action) {
    var _action$menu_item, _action$menu_item2;
    const actionMode = this._actionMode ?? (action !== null && action !== void 0 && (_action$menu_item = action.menu_item) !== null && _action$menu_item !== void 0 && _action$menu_item.trim() ? "menu" : "service");
    return x`
        <div class="action-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromActionEditor}>
          </ha-icon>
          <div class="action-editor-title">Edit Action</div>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="Name"
            placeholder="(Icon Only)"
            .value=${(action === null || action === void 0 ? void 0 : action.name) ?? ""}
            @input=${e => this._updateActionProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="Icon"
            .hass=${this.hass}
            .value=${(action === null || action === void 0 ? void 0 : action.icon) ?? ""}
            @value-changed=${e => this._updateActionProperty("icon", e.detail.value)}
          ></ha-icon-picker>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="Action Type"
            .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "menu",
          label: "Open a Card Menu Item"
        }, {
          value: "service",
          label: "Call a Service"
        }]
      }
    }}
            .value=${this._actionMode ?? (action !== null && action !== void 0 && (_action$menu_item2 = action.menu_item) !== null && _action$menu_item2 !== void 0 && _action$menu_item2.trim() ? "menu" : "service")}
            @value-changed=${e => {
      const mode = e.detail.value;
      this._actionMode = mode;
      if (mode === "service") {
        this._updateActionProperty("menu_item", undefined);
      } else if (mode === "menu") {
        this._updateActionProperty("service", undefined);
        this._updateActionProperty("service_data", undefined);
        this._updateActionProperty("script_variable", undefined);
      }
    }}
          ></ha-selector>
        </div>
        
        ${actionMode === "menu" ? x`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="Menu Item"
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "",
          label: ""
        }, {
          value: "search",
          label: "Search"
        }, {
          value: "source",
          label: "Source"
        }, {
          value: "more-info",
          label: "More Info"
        }, {
          value: "group-players",
          label: "Group Players"
        }]
      }
    }}
              .value=${(action === null || action === void 0 ? void 0 : action.menu_item) ?? ""}
              @value-changed=${e => this._updateActionProperty("menu_item", e.detail.value || undefined)}
            ></ha-selector>
          </div>
        ` : E} 
        ${actionMode === 'service' ? x`
          <div class="form-row">
            <ha-combo-box
              label="Service"
              .hass=${this.hass}
              .value=${action.service ?? ""}
              .items=${this._serviceItems ?? []}
              item-value-path="value"
              item-label-path="label"
              required
              @value-changed=${e => this._updateActionProperty("service", e.detail.value)}
            ></ha-combo-box>
          </div>

          ${typeof action.service === "string" && action.service.startsWith("script.") ? x`
            <div class="form-row form-row-multi-column">
              <div>
                <ha-switch
                  id="script-variable-toggle"
                  .checked=${(action === null || action === void 0 ? void 0 : action.script_variable) ?? false}
                  @change=${e => this._updateActionProperty("script_variable", e.target.checked)}
                ></ha-switch>
                <span>Script Variable (yamp_entity)</span>
              </div>
            </div>
          ` : E}

          ${action.service ? x`
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>

              Use <code>entity_id: current</code> to target the card's currently selected
              media player entity. The <ha-icon icon="mdi:play-circle-outline"></ha-icon> button
              below does not work if you use this feature.

            </div>
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>
            Changes to the service data below are not committed to the config until 
            <ha-icon icon="mdi:content-save"></ha-icon> is clicked!
            </div>
            <div class="form-row">
              <div class="service-data-editor-header">
                <div class="service-data-editor-title">Service Data</div>
                <div class="service-data-editor-actions">
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:content-save"
                    title="Save Service Data"
                    @click=${this._saveYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:backup-restore"
                    title="Revert to Saved Service Data"
                    @click=${this._revertYamlEditor}
                  ></ha-icon>
                  <ha-icon

                    class="icon-button ${this._yamlError || this._yamlDraftUsesCurrentEntity() || !(action !== null && action !== void 0 && action.service) ? "icon-button-disabled" : ""}"

                    icon="mdi:play-circle-outline"
                    title="Test Action"
                    @click=${this._testServiceCall}
                  ></ha-icon>              
                </div>
            </div>
            <div class=${this._yamlError && this._yamlDraft.trim() !== "" ? "code-editor-wrapper error" : "code-editor-wrapper"}>
              <ha-code-editor
                id="service-data-editor"
                label="Service Data"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                mode="yaml"
                .value=${action !== null && action !== void 0 && action.service_data ? jsYaml.dump(action.service_data) : ""}
                @value-changed=${e => {
      /* the yaml will be parsed in real time to detect errors, but we will defer 
        updating the config until the save button above the editor is clicked.
      */
      this._yamlDraft = e.detail.value;
      this._yamlModified = true;
      try {
        const parsed = jsYaml.load(this._yamlDraft);
        if (parsed && typeof parsed === "object") {
          this._yamlError = null;
        } else {
          this._yamlError = "Invalid YAML";
        }
      } catch (err) {
        this._yamlError = err.message;
      }
    }}
              ></ha-code-editor>
              ${this._yamlError && this._yamlDraft.trim() !== "" ? x`<div class="yaml-error-message">${this._yamlError}</div>` : E}
            </div>
          ` : E}
        ` : E}
      </div>`;
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
  _onActionChanged(index, newValue) {
    const original = this._config.actions ?? [];
    const updated = [...original];
    updated[index] = {
      ...updated[index],
      name: newValue
    };
    this._updateConfig("actions", updated);
  }
  _onEditEntity(index) {
    this._entityEditorIndex = index;
  }
  _onEditAction(index) {
    var _this$_config$actions2;
    this._actionEditorIndex = index;
    const action = (_this$_config$actions2 = this._config.actions) === null || _this$_config$actions2 === void 0 ? void 0 : _this$_config$actions2[index];
    this._actionMode = action !== null && action !== void 0 && action.menu_item ? "menu" : "service";
  }
  _onBackFromEntityEditor() {
    this._entityEditorIndex = null;
  }
  _onBackFromActionEditor() {
    this._actionEditorIndex = null;
  }
  _toggleEntityMoveMode() {
    this._entityMoveMode = !this._entityMoveMode;
  }
  _toggleActionMoveMode() {
    this._actionMoveMode = !this._actionMoveMode;
  }
  _moveEntity(idx, offset) {
    const entities = [...this._config.entities];
    const newIndex = idx + offset;
    if (newIndex < 0 || newIndex >= entities.length) {
      return;
    }
    const [moved] = entities.splice(idx, 1);
    entities.splice(newIndex, 0, moved);
    this._updateConfig("entities", entities);
  }
  _moveAction(idx, offset) {
    const actions = [...this._config.actions];
    const newIndex = idx + offset;
    if (newIndex < 0 || newIndex >= actions.length) {
      return;
    }
    const [moved] = actions.splice(idx, 1);
    actions.splice(newIndex, 0, moved);
    this._updateConfig("actions", actions);
  }
  _removeAction(index) {
    const actions = [...(this._config.actions ?? [])];
    if (index < 0 || index >= actions.length) return;
    actions.splice(index, 1);
    this._updateConfig("actions", actions);
  }
  _saveYamlEditor() {
    try {
      const parsed = jsYaml.load(this._yamlDraft);
      if (!parsed || typeof parsed !== "object") {
        this._yamlError = "YAML is not a valid object.";
        return;
      }
      this._updateActionProperty("service_data", parsed);
      this._yamlDraft = jsYaml.dump(parsed);
      this._yamlError = null;
      this._parsedYaml = parsed;
    } catch (err) {
      this._yamlError = err.message;
    }
  }
  _revertYamlEditor() {
    var _this$_config$actions3;
    const editor = this.shadowRoot.querySelector("#service-data-editor");
    const currentAction = (_this$_config$actions3 = this._config.actions) === null || _this$_config$actions3 === void 0 ? void 0 : _this$_config$actions3[this._actionEditorIndex];
    if (!editor || !currentAction) return;
    const yamlText = currentAction.service_data ? jsYaml.dump(currentAction.service_data) : "";
    editor.value = yamlText;
    this._yamlDraft = yamlText;
    this._yamlError = null;
    this._yamlModified = false;
  }
  _yamlDraftUsesCurrentEntity() {
    if (!this._yamlDraft) return false;
    const regex = /^\s*entity_id\s*:\s*current\s*$/m;
    let result = regex.test(this._yamlDraft);
    return result;
  }
  async _testServiceCall() {
    var _this$_yamlDraft, _this$_config$actions4;
    if (this._yamlError || !((_this$_yamlDraft = this._yamlDraft) !== null && _this$_yamlDraft !== void 0 && _this$_yamlDraft.trim())) {
      return;
    }
    let serviceData;
    try {
      serviceData = jsYaml.load(this._yamlDraft);
      if (typeof serviceData !== "object" || serviceData === null) {
        console.error("Service data must be a valid object.");
        return;
      }
    } catch (e) {
      this._yamlError = e.message;
      return;
    }
    const action = (_this$_config$actions4 = this._config.actions) === null || _this$_config$actions4 === void 0 ? void 0 : _this$_config$actions4[this._actionEditorIndex];
    const service = action === null || action === void 0 ? void 0 : action.service;
    if (!service || !this.hass) {
      return;
    }
    const [domain, serviceName] = service.split(".");
    if (!domain || !serviceName) {
      return;
    }
    try {
      await this.hass.callService(domain, serviceName, serviceData);
    } catch (err) {
      console.error("Failed to call service:", err);
    }
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
customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);

// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "YAMP is a multi-entity media card with custom actions",
  preview: true
});
class YetAnotherMediaPlayerCard extends i$1 {
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
    this._idleTimeoutMs = 60000;
    this._volumeStep = 0.05;
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
    // Set idle timeout ms
    this._idleTimeoutMs = typeof config.idle_timeout_ms === "number" ? config.idle_timeout_ms : 60000;
    this._volumeStep = typeof config.volume_step === "number" ? config.volume_step : 0.05;
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
      // Use configurable step size
      const step = this._volumeStep * direction;
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
      current += this._volumeStep * direction;
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
    if (!this.hass || !this.config) return E;
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    const showChipRow = this.config.show_chip_row || "auto";
    const stateObj = this.currentStateObj;
    if (!stateObj) return x`<div class="details">Entity not found.</div>`;

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
    return x`
        <ha-card class="yamp-card" style="position:relative;">
          <div
            style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column;"
            data-match-theme="${String(this.config.match_theme === true)}"
            class="${dimIdleFrame ? 'dim-idle' : ''}"
          >
            ${this.entityObjs.length > 1 || showChipRow === "always" ? x`
                <div class="chip-row">
                  ${renderChipRow({
      groupedSortedEntityIds: this.groupedSortedEntityIds,
      entityIds: this.entityIds,
      selectedEntityId: this.currentEntityId,
      pinnedIndex: this._pinnedIndex,
      holdToPin: this._holdToPin,
      getChipName: id => this.getChipName(id),
      getActualGroupMaster: group => this._getActualGroupMaster(group),
      isIdle: this._isIdle,
      hass: this.hass,
      onChipClick: idx => this._onChipClick(idx),
      onIconClick: (idx, e) => {
        const entityId = this.entityIds[idx];
        const group = this.groupedSortedEntityIds.find(g => g.includes(entityId));
        if (group && group.length > 1) {
          this._selectedIndex = idx;
          this._showEntityOptions = true;
          this._showGrouping = true;
          this.requestUpdate();
        }
      },
      onPinClick: (idx, e) => {
        e.stopPropagation();
        this._onPinClick(e);
      },
      onPointerDown: (e, idx) => this._handleChipPointerDown(e, idx),
      onPointerMove: (e, idx) => this._handleChipPointerMove(e, idx),
      onPointerUp: (e, idx) => this._handleChipPointerUp(e, idx)
    })}
                </div>
            ` : E}
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
              ${!dimIdleFrame ? x`<div class="card-lower-fade"></div>` : E}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}">
                ${collapsed && artworkUrl ? x`
                  <div class="collapsed-artwork-container"
                       style="background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%);">
                    <img class="collapsed-artwork" src="${artworkUrl}" />
                  </div>
                ` : E}
                ${!collapsed ? x`<div class="card-artwork-spacer"></div>` : E}
                ${!collapsed && !artworkUrl && !idleImageUrl ? x`
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
                ` : E}
                <div class="details">
                  <div class="title">
                    ${isPlaying ? title : ""}
                  </div>
                  ${isPlaying && artist ? x`
                    <div
                      class="artist ${stateObj.attributes.media_artist ? 'clickable-artist' : ''}"
                      @click=${() => {
      if (stateObj.attributes.media_artist) this._searchArtistFromNowPlaying();
    }}
                      title=${stateObj.attributes.media_artist ? "Search for this artist" : ""}
                    >${artist}</div>
                  ` : E}
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
    }) : E}
                ${(collapsed || this._alternateProgressBar) && isPlaying && duration ? renderProgressBar({
      progress,
      collapsed: true,
      accent: this._customAccent
    }) : E}
                ${!dimIdleFrame ? x`
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
      moreInfoMenu: x`
                    <div class="more-info-menu">
                      <button class="more-info-btn" @click=${() => this._openEntityOptions()}>
                        <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                      </button>
                    </div>
                  `
    })}
                ` : E}
                ${dimIdleFrame ? x`
                  <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: 10;">
                    <button class="more-info-btn" @click=${() => this._openEntityOptions()}>
                      <span style="font-size: 1.7em; line-height: 1; color: #fff; display: flex; align-items: center; justify-content: center;">&#9776;</span>
                    </button>
                  </div>
                ` : E}
              </div>
            </div>
          </div>
          ${this._showEntityOptions ? x`
          <div class="entity-options-overlay" @click=${e => this._closeEntityOptions(e)}>
            <div class="entity-options-sheet" @click=${e => e.stopPropagation()}>
              ${!this._showGrouping && !this._showSourceList && !this._showSearchInSheet ? x`
                <div class="entity-options-menu" style="display:flex; flex-direction:column; margin-top:auto; margin-bottom:20px;">
                  <button class="entity-options-item" @click=${() => {
      this._openMoreInfo();
      this._showEntityOptions = false;
      this.requestUpdate();
    }}>More Info</button>
                  <button class="entity-options-item" @click=${() => {
      this._showSearchSheetInOptions();
    }}>Search</button>
                  ${Array.isArray((_this$currentStateObj2 = this.currentStateObj) === null || _this$currentStateObj2 === void 0 || (_this$currentStateObj2 = _this$currentStateObj2.attributes) === null || _this$currentStateObj2 === void 0 ? void 0 : _this$currentStateObj2.source_list) && this.currentStateObj.attributes.source_list.length > 0 ? x`
                      <button class="entity-options-item" @click=${() => this._openSourceList()}>Source</button>
                    ` : E}
                  ${(() => {
      const totalEntities = this.entityIds.length;
      const groupableCount = this.entityIds.reduce((acc, id) => {
        const st = this.hass.states[id];
        return acc + (this._supportsFeature(st, SUPPORT_GROUPING) ? 1 : 0);
      }, 0);
      if (totalEntities > 1 && groupableCount > 1 && this._supportsFeature(this.currentStateObj, SUPPORT_GROUPING)) {
        return x`
                          <button class="entity-options-item" @click=${() => this._openGrouping()}>Group Players</button>
                        `;
      }
      return E;
    })()}
                  <button class="entity-options-item" @click=${() => this._closeEntityOptions()}>Close</button>
                </div>
              ` : this._showSearchInSheet ? x`
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
      if (classes.length < 2) return E;
      return x`
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
                        ${classes.map(c => x`
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
                  ${this._searchLoading ? x`<div class="entity-options-search-loading">Loading...</div>` : E}
                  ${this._searchError ? x`<div class="entity-options-search-error">${this._searchError}</div>` : E}
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
      return this._searchAttempted && filteredResults.length === 0 && !this._searchLoading ? x`<div class="entity-options-search-empty">No results.</div>` : paddedResults.map(item => item ? x`
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
                          ` : x`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `);
    })()}
                  </div>
                </div>
              ` : this._showGrouping ? x`
                <button class="entity-options-item" @click=${() => this._closeGrouping()} style="margin-bottom:14px;">← Back</button>
                ${(_masterState$attribut => {
      const masterState = this.hass.states[this.currentEntityId];
      const groupedAny = Array.isArray(masterState === null || masterState === void 0 || (_masterState$attribut = masterState.attributes) === null || _masterState$attribut === void 0 ? void 0 : _masterState$attribut.group_members) && masterState.attributes.group_members.length > 0;
      return x`
                      <div style="display:flex;align-items:center;justify-content:space-between;font-weight:600;margin-bottom:0;">
                        ${groupedAny ? x`
                          <button class="group-all-btn"
                            @click=${() => this._syncGroupVolume()}
                            style="color:#fff; background:none; border:none; font-size:1.03em; cursor:pointer; padding:0 16px 2px 0;">
                            Sync Volume
                          </button>
                        ` : x`<span></span>`}
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
      return x`
                      <div class="group-list-scroll" style="overflow-y: auto; max-height: 340px;">
                        ${sortedIds.map(id => {
        var _volumeState$attribut;
        const st = this.hass.states[id];
        if (!this._supportsFeature(st, SUPPORT_GROUPING)) return E;
        const name = this.getChipName(id);
        const masterState = this.hass.states[masterId];
        const grouped = id === masterId ? true : Array.isArray(masterState.attributes.group_members) && masterState.attributes.group_members.includes(id);
        const obj = this.entityObjs.find(e => e.entity_id === id);
        const volumeEntity = obj && obj.volume_entity ? obj.volume_entity : id;
        const volumeState = this.hass.states[volumeEntity];
        const isRemoteVol = volumeEntity.startsWith && volumeEntity.startsWith("remote.");
        const volVal = Number((volumeState === null || volumeState === void 0 || (_volumeState$attribut = volumeState.attributes) === null || _volumeState$attribut === void 0 ? void 0 : _volumeState$attribut.volume_level) || 0);
        return x`
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
                                ${isRemoteVol ? x`
                                        <div class="vol-stepper">
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, -1)} title="Vol Down">–</button>
                                          <button class="button" @click=${() => this._onGroupVolumeStep(volumeEntity, 1)} title="Vol Up">+</button>
                                        </div>
                                      ` : x`
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
                              ${id === masterId ? x`
                                      <button class="group-toggle-btn group-toggle-transparent"
                                              disabled
                                              aria-label="Master"
                                              style="margin-left:14px;"></button>
                                    ` : x`
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
              ` : x`
                <button class="entity-options-item" @click=${() => this._closeSourceList()} style="margin-bottom:14px;">← Back</button>
                <div class="entity-options-sheet source-list-sheet" style="position:relative;">
                  <div class="source-list-scroll" style="overflow-y:auto;max-height:340px;">
                    ${sourceList.map(src => x`
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
      return x`
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
        ` : E}
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
    }) : E}
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
      // Only set timer if not already idle and not already waiting, and idle_timeout_ms > 0
      if (!this._isIdle && !this._idleTimeout && this._idleTimeoutMs > 0) {
        this._idleTimeout = setTimeout(() => {
          this._isIdle = true;
          this._idleTimeout = null;
          this.requestUpdate();
        }, this._idleTimeoutMs);
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
      name: "idle_timeout_ms",
      selector: {
        number: {
          min: 0,
          step: 1000,
          unit_of_measurement: "ms",
          mode: "box"
        }
      },
      required: false
    }, {
      name: "volume_step",
      selector: {
        number: {
          min: 0.01,
          max: 1,
          step: 0.01,
          unit_of_measurement: "",
          mode: "box"
        }
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
