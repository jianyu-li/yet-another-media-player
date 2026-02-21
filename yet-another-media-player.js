/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = globalThis,
  e$4 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
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
    if (e$4 && void 0 === t) {
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
  i$5 = function (t) {
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
    if (e$4) s.adoptedStyleSheets = o.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet);else for (const e of o) {
      const o = document.createElement("style"),
        n = t$2.litNonce;
      void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
    }
  },
  c$2 = e$4 ? t => t : t => t instanceof CSSStyleSheet ? (t => {
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
    is: i$4,
    defineProperty: e$3,
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
  f$1 = (t, s) => !i$4(t, s),
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
      void 0 !== h && e$3(this.prototype, t, h);
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
const t$1 = globalThis,
  i$3 = t$1.trustedTypes,
  s$1 = i$3 ? i$3.createPolicy("lit-html", {
    createHTML: t => t
  }) : void 0,
  e$2 = "$lit$",
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
    l += c === f ? s + n : d >= 0 ? (o.push(a), s.slice(0, d) + e$2 + s.slice(d) + h + x) : s + h + (-2 === d ? i : x);
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
        if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(e$2)) {
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
            r.textContent = i$3 ? i$3.emptyScript : "";
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
const j = t$1.litHtmlPolyfillSupport;
j !== null && j !== void 0 && j(N, R), (t$1.litHtmlVersions ??= []).push("3.3.0");
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
let i$2 = class i extends y$1 {
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
i$2._$litElement$ = true, i$2["finalized"] = true, (_s$litElementHydrateS = s.litElementHydrateSupport) === null || _s$litElementHydrateS === void 0 ? void 0 : _s$litElementHydrateS.call(s, {
  LitElement: i$2
});
const o = s.litElementPolyfillSupport;
o === null || o === void 0 || o({
  LitElement: i$2
});
(s.litElementVersions ??= []).push("4.2.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = {
    ATTRIBUTE: 1},
  e$1 = t => function () {
    for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
      e[_key] = arguments[_key];
    }
    return {
      _$litDirective$: t,
      values: e
    };
  };
let i$1 = class i {
  constructor(t) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e = e$1(class extends i$1 {
  constructor(t$1) {
    var _t$strings;
    if (super(t$1), t$1.type !== t.ATTRIBUTE || "class" !== t$1.name || ((_t$strings = t$1.strings) === null || _t$strings === void 0 ? void 0 : _t$strings.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return " " + Object.keys(t).filter(s => t[s]).join(" ") + " ";
  }
  update(s, _ref) {
    let [i] = _ref;
    if (void 0 === this.st) {
      this.st = new Set(), void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter(t => "" !== t)));
      for (const t in i) {
        var _this$nt;
        i[t] && !((_this$nt = this.nt) !== null && _this$nt !== void 0 && _this$nt.has(t)) && this.st.add(t);
      }
      return this.render(i);
    }
    const r = s.element.classList;
    for (const t of this.st) t in i || (r.remove(t), this.st.delete(t));
    for (const t in i) {
      var _this$nt2;
      const s = !!i[t];
      s === this.st.has(t) || ((_this$nt2 = this.nt) === null || _this$nt2 === void 0 ? void 0 : _this$nt2.has(t)) || (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
    }
    return T;
  }
});

// Utility functions for Yet Another Media Player (YAMP)

/**
 * Get a valid artwork attribute value (non-empty string with content)
 * @param {Object} attrs - Entity attributes object
 * @param {string} key - Attribute key to check
 * @returns {string|null} The attribute value if valid, null otherwise
 */
function getValidArtworkAttr(attrs, key) {
  const val = attrs === null || attrs === void 0 ? void 0 : attrs[key];
  // Must be a non-empty string with actual content
  if (typeof val === 'string' && val.trim() !== '') {
    return val;
  }
  return null;
}

/**
 * Resolve a Jinja template string at runtime
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {string} fallbackEntityId - Fallback entity ID if template resolution fails
 * @returns {Promise<string>} Resolved entity ID
 */
async function resolveTemplateAtActionTime(hass, templateString, fallbackEntityId) {
  if (!templateString || typeof templateString !== 'string') return fallbackEntityId;

  // Not a template — return as-is
  if (!templateString.includes('{{') && !templateString.includes('{%')) {
    return templateString;
  }
  try {
    const res = await hass.callApi('POST', 'template', {
      template: templateString
    });
    const out = (res || '').toString().trim();
    // Basic validation: must look like an entity_id
    if (out && /^([a-z_]+)\.[A-Za-z0-9_]+$/.test(out)) return out;
    return fallbackEntityId;
  } catch (error) {
    return fallbackEntityId; // Fallback to main entity
  }
}

/**
 * Resolve a generic Jinja template string at runtime (no entity validation)
 * @param {Object} hass - Home Assistant object
 * @param {string} templateString - The template string to resolve
 * @param {Object} context - Optional context variables to inject into the template
 * @returns {Promise<string>} Resolved string
 */
async function resolveStringTemplate(hass, templateString) {
  let context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!templateString || typeof templateString !== 'string') return templateString;

  // Not a template — return as-is
  if (!templateString.includes('{{') && !templateString.includes('{%')) {
    // Check for URL-encoded templates (%7B%7B or %7B%25)
    if (/%7B%7B|%7B%25/i.test(templateString)) {
      try {
        templateString = decodeURIComponent(templateString);
      } catch (e) {
        // Ignore decode error
      }
    }

    // Re-check after decoding
    if (!templateString.includes('{{') && !templateString.includes('{%')) {
      return templateString;
    }
  }

  // Inject context variables
  let finalTemplate = templateString;
  if (context && Object.keys(context).length > 0) {
    const setStatements = Object.entries(context).map(_ref => {
      let [key, value] = _ref;
      return `{% set ${key} = ${JSON.stringify(value)} %}`;
    }).join(' ');
    finalTemplate = `${setStatements} ${templateString}`;
  }
  try {
    const res = await hass.callApi('POST', 'template', {
      template: finalTemplate
    });
    return (res || '').toString().trim();
  } catch (error) {
    console.warn('yamp: Error resolving template:', templateString, error);
    return templateString; // Return original string on error
  }
}

/**
 * Find button entities associated with a Music Assistant entity
 * @param {Object} hass - Home Assistant object
 * @param {string} maEntityId - Music Assistant entity ID
 * @returns {Array} Array of associated button entities
 */
function findAssociatedButtonEntities(hass, maEntityId) {
  var _maEntity$attributes, _maEntity$attributes2;
  if (!(hass !== null && hass !== void 0 && hass.states) || !maEntityId) return [];
  const buttonEntities = [];
  const maEntity = hass.states[maEntityId];
  if (!maEntity) return [];

  // Look for button entities that might be associated with this MA entity
  // Common patterns: device_id matching, friendly_name similarity, or device_class
  const maDeviceId = (_maEntity$attributes = maEntity.attributes) === null || _maEntity$attributes === void 0 ? void 0 : _maEntity$attributes.device_id;
  const maFriendlyName = ((_maEntity$attributes2 = maEntity.attributes) === null || _maEntity$attributes2 === void 0 ? void 0 : _maEntity$attributes2.friendly_name) || maEntityId;

  // Search through all button entities
  for (const [entityId, state] of Object.entries(hass.states)) {
    if (entityId.startsWith('button.') && state.attributes) {
      const buttonDeviceId = state.attributes.device_id;
      const buttonFriendlyName = state.attributes.friendly_name || entityId;

      // Check if this button is associated with the same device
      if (maDeviceId && buttonDeviceId === maDeviceId) {
        buttonEntities.push({
          entity_id: entityId,
          friendly_name: buttonFriendlyName,
          device_class: state.attributes.device_class,
          reason: 'same_device'
        });
      }
      // Check for name similarity (e.g., "HomePod Favorite" button for "HomePod" MA entity)
      else if (buttonFriendlyName.toLowerCase().includes(maFriendlyName.toLowerCase()) || maFriendlyName.toLowerCase().includes(buttonFriendlyName.toLowerCase())) {
        buttonEntities.push({
          entity_id: entityId,
          friendly_name: buttonFriendlyName,
          device_class: state.attributes.device_class,
          reason: 'name_similarity'
        });
      }
    }
  }
  return buttonEntities;
}

/**
 * Get Music Assistant state for a given entity
 * @param {Object} hass - Home Assistant object
 * @param {string} entityId - Entity ID to get MA state for
 * @returns {Object|null} Music Assistant state object or null
 */
function getMusicAssistantState(hass, entityId) {
  if (!(hass !== null && hass !== void 0 && hass.states) || !entityId) return null;
  const state = hass.states[entityId];
  if (!state) return null;

  // Check if this entity has Music Assistant attributes
  const hasMaAttributes = state.attributes && (state.attributes.media_content_id || state.attributes.media_content_type || state.attributes.media_album_name || state.attributes.media_artist || state.attributes.media_title);
  return hasMaAttributes ? state : null;
}

/**
 * Check if an entity state belongs to a Music Assistant player
 * @param {Object} state - Home Assistant state object
 * @returns {boolean} True if it's a Music Assistant player
 */
function isMusicAssistantEntity(state) {
  if (!state || !state.attributes) return false;
  return state.attributes.app_id === 'music_assistant' || state.attributes.mass_player_type !== undefined;
}

/**
 * Get search result click title for an item
 * @param {Object} item - Search result item
 * @returns {string} Title to display
 */
function getSearchResultClickTitle(item) {
  var _item$artists;
  if (!item) return '';

  // Normalize properties
  const mediaType = item.media_type || item.media_class || item.media_content_type;
  const title = item.name || item.title || item.media_title || 'Unknown Title';

  // Handle artist normalization
  const firstArtist = (_item$artists = item.artists) === null || _item$artists === void 0 ? void 0 : _item$artists[0];
  const artist = item.artist || (firstArtist === null || firstArtist === void 0 ? void 0 : firstArtist.name) || (typeof firstArtist === 'string' ? firstArtist : undefined) || item.media_artist || 'Unknown Artist';

  // For tracks, show "Track Name - Artist"
  if (mediaType === 'track') {
    return `${title} - ${artist}`;
  }

  // For albums, show "Album Name - Artist"
  if (mediaType === 'album') {
    return `${title} - ${artist}`;
  }

  // For artists, just show the name
  if (mediaType === 'artist') {
    return title;
  }

  // For playlists, show the name
  if (mediaType === 'playlist') {
    return title;
  }

  // Default fallback
  return title;
}

// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";

// Get artwork URL from entity state, supporting entity_picture_local for Music Assistant
function getArtworkUrl(state) {
  let hostname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let overrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let fallbackArtwork = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  if (!state || !state.attributes) return null;
  const attrs = state.attributes;
  const entityId = state.entity_id;
  attrs.app_id;
  let artworkUrl = null;
  let sizePercentage = null;

  // Check for media artwork overrides first
  if (overrides && Array.isArray(overrides) && overrides.length) {
    var _override2;
    const getOverrideValue = (override, key) => {
      if (!override) return undefined;
      return override[key];
    };
    const matchers = [["media_title", "media_title"], ["media_artist", "media_artist"], ["media_album_name", "media_album_name"], ["media_content_id", "media_content_id"], ["media_channel", "media_channel"], ["app_name", "app_name"], ["media_content_type", "media_content_type"], ["entity_id", "entity_id"], ["entity_state", "entity_state"]];
    const findSpecificMatch = () => overrides.find(override => matchers.some(_ref => {
      let [attrKey, overrideKey] = _ref;
      const expected = getOverrideValue(override, overrideKey);
      if (expected === undefined) return false;
      const value = attrKey === "entity_id" ? entityId : attrKey === "entity_state" ? state === null || state === void 0 ? void 0 : state.state : attrs[attrKey];
      return value === expected;
    }));
    let override = findSpecificMatch();
    if (!override) {
      // Use helper to properly check for valid artwork attributes
      const hasArtwork = getValidArtworkAttr(attrs, 'entity_picture_local') || getValidArtworkAttr(attrs, 'entity_picture') || getValidArtworkAttr(attrs, 'album_art');
      if (!hasArtwork) {
        var _override;
        override = overrides.find(item => item === null || item === void 0 ? void 0 : item.missing_art_url);
        if ((_override = override) !== null && _override !== void 0 && _override.missing_art_url) {
          override = {
            ...override,
            image_url: override.missing_art_url
          };
        }
      }
    }
    if ((_override2 = override) !== null && _override2 !== void 0 && _override2.image_url) {
      var _override3;
      artworkUrl = override.image_url;
      sizePercentage = (_override3 = override) === null || _override3 === void 0 ? void 0 : _override3.size_percentage;
    }
  }

  // If no override found, use standard artwork
  // Use helper to properly check for valid artwork attributes and fallback correctly
  if (!artworkUrl) {
    artworkUrl = getValidArtworkAttr(attrs, 'entity_picture_local') || getValidArtworkAttr(attrs, 'entity_picture') || getValidArtworkAttr(attrs, 'album_art') || null;
  }

  // If still no artwork, check for configured fallback artwork
  if (!artworkUrl && fallbackArtwork) {
    // Check if it's a smart fallback (TV vs Music)
    if (fallbackArtwork === 'smart') {
      // Use TV icon for TV content, music icon for everything else
      const isTV = attrs.media_title === 'TV' || attrs.media_channel || attrs.app_id === 'tv' || attrs.app_id === 'androidtv';
      if (isTV) {
        // TV icon
        artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI2OCIgeT0iMTIwIiB3aWR0aD0iNDgiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI4MCIgeT0iMTMwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8L3N2Zz4K';
      } else {
        // Music icon (equalizer bars)
        artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=';
      }
    } else if (typeof fallbackArtwork === 'string') {
      // Direct URL or base64 image
      artworkUrl = fallbackArtwork;
    }
  }

  // Apply hostname prefix if configured and artwork URL is relative
  if (artworkUrl && hostname && !artworkUrl.startsWith('http')) {
    artworkUrl = hostname + artworkUrl;
  }
  return {
    url: artworkUrl,
    sizePercentage
  };
}

// Helper to render a single chip
function renderChip(_ref2) {
  let {
    idx,
    selected,
    playing,
    name,
    art,
    icon,
    pinned,
    holdToPin,
    maActive,
    onChipClick,
    onIconClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    objectFit,
    quickGroupingState,
    onQuickGroupClick,
    onDoubleClick
  } = _ref2;
  const artStyle = objectFit ? `object-fit: ${objectFit};` : "";
  return x`
    <button class="chip"
            ?selected=${selected}
            ?playing=${playing}
            ?ma-active=${maActive}
            @dblclick=${onDoubleClick}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
      <span class="chip-icon">
        ${art ? x`<img class="chip-mini-art" src="${art}" style="${artStyle}" onerror="this.style.display='none'" />` : x`<ha-icon .icon=${icon} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${name}
      </span>
      ${playing ? x`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          ` : E}
      ${pinned ? x`
            <span class="chip-pin-inside" @click=${e => {
    e.stopPropagation();
    onPinClick(idx, e);
  }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          ` : x`<span class="chip-pin-spacer"></span>`}
      ${quickGroupingState && quickGroupingState.isGroupable ? x`
            <span class="chip-quick-group" @click=${e => {
    e.stopPropagation();
    if (onQuickGroupClick && !quickGroupingState.isBusy && !quickGroupingState.isPrimary) onQuickGroupClick(idx, e);
  }} title=${quickGroupingState.isPrimary ? "Primary" : quickGroupingState.isBusy ? "Unavailable" : quickGroupingState.grouped ? "Unjoin" : "Join"} style="${quickGroupingState.isPrimary ? 'cursor:default;opacity:0.7;' : quickGroupingState.isBusy ? 'opacity:0.5;cursor:not-allowed;' : ''}">
              <ha-icon .icon=${quickGroupingState.isPrimary ? "mdi:star-circle-outline" : quickGroupingState.grouped ? "mdi:minus" : "mdi:plus"}></ha-icon>
            </span>
          ` : E}
    </button>
  `;
}

// Helper to render a group chip: same as chip but with label (with count), no badge/icon for group, just art/icon and label.
function renderGroupChip(_ref3) {
  let {
    idx,
    selected,
    playing,
    groupName,
    art,
    icon,
    pinned,
    holdToPin,
    maActive,
    onChipClick,
    onIconClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    objectFit,
    quickGroupingState,
    onQuickGroupClick,
    onDoubleClick
  } = _ref3;
  const artStyle = objectFit ? `object-fit: ${objectFit};` : "";
  return x`
    <button class="chip group"
            ?selected=${selected}
            ?ma-active=${maActive}
            @dblclick=${onDoubleClick}
            @click=${() => onChipClick(idx)}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @pointerleave=${onPointerUp}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
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
                      style="cursor:pointer;${artStyle}"
                      onerror="this.style.display='none'"
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
      ${playing ? x`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          ` : E}
      ${pinned ? x`
            <span class="chip-pin-inside" @click=${e => {
    e.stopPropagation();
    onPinClick(idx, e);
  }} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          ` : x`<span class="chip-pin-spacer"></span>`}
      ${quickGroupingState && quickGroupingState.isGroupable ? x`
            <span class="chip-quick-group" @click=${e => {
    e.stopPropagation();
    if (onQuickGroupClick && !quickGroupingState.isBusy && !quickGroupingState.isPrimary) onQuickGroupClick(idx, e);
  }} title=${quickGroupingState.isPrimary ? "Primary" : quickGroupingState.isBusy ? "Unavailable" : quickGroupingState.grouped ? "Unjoin" : "Join"} style="${quickGroupingState.isPrimary ? 'cursor:default;opacity:0.7;' : quickGroupingState.isBusy ? 'opacity:0.5;cursor:not-allowed;' : ''}">
              <ha-icon .icon=${quickGroupingState.isPrimary ? "mdi:star-circle-outline" : quickGroupingState.grouped ? "mdi:minus" : "mdi:plus"}></ha-icon>
            </span>
          ` : E}
    </button>
  `;
}

// Pin/hold logic helpers (timer, etc)
function createHoldToPinHandler(_ref4) {
  let {
    onPin,
    holdTime = 600,
    moveThreshold = 8
  } = _ref4;
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
function renderChipRow(_ref5) {
  let {
    groupedSortedEntityIds,
    entityIds,
    selectedEntityId,
    pinnedIndex,
    holdToPin,
    getChipName,
    getActualGroupMaster,
    getIsChipPlaying,
    getChipArt,
    getIsMaActive,
    isIdle,
    hass,
    artworkHostname = '',
    mediaArtworkOverrides = [],
    fallbackArtwork = null,
    onChipClick,
    onIconClick,
    onPointerClick,
    onPinClick,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    quickGroupingMode,
    getQuickGroupingState,
    onQuickGroupClick,
    onDoubleClick
  } = _ref5;
  if (!groupedSortedEntityIds || !groupedSortedEntityIds.length) return E;
  return x`
    ${groupedSortedEntityIds.map(group => {
    // If it's a group (more than one entity)
    if (group.length > 1) {
      var _hass$states, _state$attributes;
      const id = getActualGroupMaster(group);
      const idx = entityIds.indexOf(id);
      const state = hass === null || hass === void 0 || (_hass$states = hass.states) === null || _hass$states === void 0 ? void 0 : _hass$states[id];
      const isChipPlaying = typeof getIsChipPlaying === "function" ? getIsChipPlaying(id, selectedEntityId === id) : (state === null || state === void 0 ? void 0 : state.state) === "playing";
      const artObj = typeof getChipArt === "function" ? getChipArt(id) : getArtworkUrl(state, artworkHostname, mediaArtworkOverrides, fallbackArtwork);
      const art = artObj === null || artObj === void 0 ? void 0 : artObj.url;
      const objectFit = artObj === null || artObj === void 0 ? void 0 : artObj.objectFit;
      const icon = (state === null || state === void 0 || (_state$attributes = state.attributes) === null || _state$attributes === void 0 ? void 0 : _state$attributes.icon) || "mdi:cast";
      const isMaActive = typeof getIsMaActive === "function" ? getIsMaActive(id) : false;
      return renderGroupChip({
        idx,
        selected: selectedEntityId === id,
        playing: isChipPlaying,
        groupName: getChipName(id) + (group.length > 1 ? ` [${group.length}]` : ""),
        art,
        icon,
        pinned: pinnedIndex === idx,
        holdToPin,
        maActive: isMaActive,
        onChipClick,
        onIconClick,
        onPinClick,
        onPointerDown: e => onPointerDown(e, idx),
        onPointerMove: e => onPointerMove(e, idx),
        onPointerUp: e => onPointerUp(e, idx),
        objectFit,
        quickGroupingState: quickGroupingMode && typeof getQuickGroupingState === "function" ? getQuickGroupingState(id) : null,
        onQuickGroupClick,
        onDoubleClick
      });
    } else {
      var _hass$states2, _state$attributes2;
      // Single chip
      const id = group[0];
      const idx = entityIds.indexOf(id);
      const state = hass === null || hass === void 0 || (_hass$states2 = hass.states) === null || _hass$states2 === void 0 ? void 0 : _hass$states2[id];
      const isChipPlaying = typeof getIsChipPlaying === "function" ? getIsChipPlaying(id, selectedEntityId === id) : (state === null || state === void 0 ? void 0 : state.state) === "playing";
      const artObj = typeof getChipArt === "function" ? getChipArt(id) : getArtworkUrl(state, artworkHostname, mediaArtworkOverrides, fallbackArtwork);
      const artSource = artObj === null || artObj === void 0 ? void 0 : artObj.url;
      const objectFit = artObj === null || artObj === void 0 ? void 0 : artObj.objectFit;
      const art = selectedEntityId === id ? !isIdle && artSource : isChipPlaying && artSource;
      const icon = (state === null || state === void 0 || (_state$attributes2 = state.attributes) === null || _state$attributes2 === void 0 ? void 0 : _state$attributes2.icon) || "mdi:cast";
      const isMaActive = typeof getIsMaActive === "function" ? getIsMaActive(id) : false;
      return renderChip({
        idx,
        selected: selectedEntityId === id,
        playing: isChipPlaying,
        name: getChipName(id),
        art,
        icon,
        pinned: pinnedIndex === idx,
        holdToPin,
        maActive: isMaActive,
        onChipClick,
        onPinClick,
        onPointerDown: e => onPointerDown(e, idx),
        onPointerMove: e => onPointerMove(e, idx),
        onPointerUp: e => onPointerUp(e, idx),
        objectFit,
        quickGroupingState: quickGroupingMode && typeof getQuickGroupingState === "function" ? getQuickGroupingState(id) : null,
        onQuickGroupClick,
        onDoubleClick
      });
    }
  })}
  `;
}

// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
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

var en = {
  "common": {
    "not_found": "Entity not found.",
    "search": "Search",
    "power": "Power",
    "favorite": "Favorite",
    "loading": "Loading...",
    "no_results": "No results.",
    "close": "Close",
    "vol_up": "Volume Up",
    "vol_down": "Volume Down",
    "media_player": "Media Player",
    "edit_entity": "Edit Entity Settings",
    "edit_action": "Edit Action Settings",
    "mute": "Mute",
    "unmute": "Unmute",
    "seek": "Seek",
    "volume": "Volume",
    "play_now": "Play Now",
    "more_options": "More Options",
    "unavailable": "Unavailable",
    "back": "Back",
    "cancel": "Cancel",
    "reset_default": "Reset to default"
  },
  "editor": {
    "tabs": {
      "entities": "Entities",
      "behavior": "Behavior",
      "look_and_feel": "Look and Feel",
      "artwork": "Artwork",
      "actions": "Actions"
    },
    "placeholders": {
      "search": "Search music..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "General Settings",
          "description": "Global controls for how artwork is displayed and retrieved."
        },
        "idle": {
          "title": "Idle Artwork",
          "description": "Show a static image or entity snapshot whenever nothing is playing."
        },
        "overrides": {
          "title": "Artwork Overrides",
          "description": "Overrides are evaluated from top to bottom. Drag to reorder."
        }
      },
      "entities": {
        "title": "Entities*",
        "description": "Add the media players you want to control. Drag entities to reorder the chip row."
      },
      "behavior": {
        "idle_chips": {
          "title": "Idle & Chips",
          "description": "Choose when the card goes idle and how entity chips behave."
        },
        "interactions_search": {
          "title": "Interactions & Search",
          "description": "Fine-tune how entities are pinned and how many results show at once."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Theme & Layout",
          "description": "Match dashboard styling and control the overall footprint."
        },
        "controls_typography": {
          "title": "Controls & Typography",
          "description": "Tune button sizing, entity labels, and adaptive text."
        },
        "collapsed_idle": {
          "title": "Collapsed & Idle States",
          "description": "Control when the card collapses and which views show while idle."
        }
      },
      "actions": {
        "title": "Actions",
        "description": "Build the action chips that appear in the card or its menu. Drag to reorder, click the pencil to configure each action."
      }
    },
    "subtitles": {
      "idle_timeout": "Time in milliseconds before the card enters idle mode. Set to 0 to disable idle behavior.",
      "show_chip_row": "\"Auto\" hides the chip row when only one entity is configured. \"In Menu\" moves the chips into the menu overlay. \"In Menu on Idle\" shows chips inline when active but moves them to the menu when idle.",
      "dim_chips": "When the card enters idle mode with an image, dim the entity and action chips for a cleaner look.",
      "hold_to_pin": "Long press on entity chips instead of short press to pin them, preventing auto-switching during playback.",
      "disable_autofocus": "Keep the search box from stealing focus so on-screen keyboards stay hidden.",
      "search_within_filter": "Enable this to search within the current active filter (Favorites, Recently Played, etc) instead of clearing it.",
      "close_search_on_play": "Automatically close the search screen when a track is played.",
      "pin_search_headers": "Keep search input and filters fixed at the top while scrolling results.",
      "hide_search_headers_on_idle": "Hide search input and filters when the player is idle.",
      "disable_mass": "Disable the optional Mass Queue integration even if it is installed.",
      "swap_pause_stop": "Replace the pause button with stop while using the modern layout.",
      "adaptive_controls": "Let the playback buttons grow or shrink to fit the available space.",
      "hide_menu_player": "When chips live in the menu, hide the entity label at the bottom of the card.",
      "adaptive_text": "Choose which text groups should scale with available space (leave empty to disable adaptive text).",
      "collapse_expand": "Always Collapsed creates mini player mode. Expand on Search temporarily expands when searching.",
      "idle_screen": "Choose which screen to display automatically when the card becomes idle.",
      "hide_controls": "Select which controls to hide for this entity (all are shown by default)",
      "hide_search_chips": "Hide specific search filter chips for this entity",
      "follow_active_entity": "When enabled, the volume entity will automatically follow the active playback entity. Note: This overrides the selected volume entity.",
      "search_limit_full": "Maximum number of search results to display (1-1000, default: 20)",
      "default_search_filter_full": "Choose which filter is active by default when the search screen opens.",
      "result_sorting_full": "Choose how results are ordered.",
      "card_height_full": "Leave blank for automatic height",
      "control_layout_full": "Choose between the legacy evenly sized controls or the modern Home Assistant layout.",
      "artwork_extend": "Let the artwork background continue underneath the chip and action rows.",
      "artwork_extend_label": "Extend artwork",
      "no_artwork_overrides": "No artwork overrides configured. Use the plus button below to add one.",
      "entity_current_hint": "Use 'entity_id: current' to target the card's currently selected media player entity. Note: The 'Test Action' button will be disabled when using this feature.",
      "service_data_note": "Changes to the service data below are not committed to the config until the 'Save Service Data' button is clicked!",
      "jinja_template_hint": "Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:",
      "jinja_template_vol_hint": "Enter a Jinja template that resolves to an entity_id (e.g. media_player.office_homepod or remote.soundbar). Example switching volume entity based on a boolean:",
      "not_available_alt_collapsed": "Not available with Alternate Progress Bar or Always Collapsed mode",
      "not_available_collapsed": "Not available when Always Collapsed is enabled",
      "only_available_collapsed": "Only available when Always Collapsed is enabled",
      "only_available_modern": "Only available with Modern layout",
      "image_url_helper": "Enter a direct URL to an image or a local file path",
      "selected_entity_helper": "Input text helper that will be updated with the currently selected media player entity ID.",
      "sync_entity_type": "Choose which entity ID to sync to the helper (defaults to Music Assistant entity if configured).",
      "disable_auto_select": "Prevent this entity's chip from automatically being selected when it starts playing.",
      "search_view": "Choose between a standard list or a card-based grid for search results.",
      "search_card_columns": "Specify how many columns to use in the card view. Artwork will scale automatically."
    },
    "titles": {
      "edit_entity": "Edit Entity",
      "edit_action": "Edit Action",
      "service_data": "Service Data",
      "add_artwork_override": "Add Artwork Override"
    },
    "labels": {
      "dim_chips": "Dim Chips on Idle",
      "hold_to_pin": "Hold to Pin",
      "disable_autofocus": "Disable Search Autofocus",
      "keep_filters": "Keep Filters on Search",
      "dismiss_on_play": "Dismiss search on play",
      "pin_headers": "Pin search headers",
      "hide_search_headers_on_idle": "Hide search headers on idle",
      "default_search_filter": "Default Search Filter",
      "disable_mass": "Disable Mass Queue",
      "match_theme": "Match Theme",
      "alt_progress": "Alternate Progress Bar",
      "display_timestamps": "Display Timestamps",
      "swap_pause_stop": "Swap Pause with Stop",
      "adaptive_controls": "Adaptive Control Size",
      "hide_active_entity": "Hide Active Entity Label",
      "collapse_on_idle": "Collapse on Idle",
      "hide_menu_player_toggle": "Hide Menu Player",
      "always_collapsed": "Always Collapsed",
      "expand_on_search": "Expand on Search",
      "script_var": "Script Variable (yamp_entity)",
      "use_ma_template": "Use template for Music Assistant Entity",
      "use_vol_template": "Use template for Volume Entity",
      "follow_active_entity": "Volume Entity Follows Active Entity",
      "use_url_path": "Use URL or Path",
      "adaptive_text_elements": "Adaptive Text Size Elements",
      "disable_auto_select": "Disable Auto-Select"
    },
    "fields": {
      "artwork_fit": "Artwork Fit",
      "artwork_position": "Artwork Position",
      "artwork_hostname": "Artwork Hostname",
      "match_field": "Match Field",
      "match_value": "Match Value",
      "size_percent": "Size (%)",
      "object_fit": "Object Fit",
      "idle_timeout": "Idle Timeout (ms)",
      "show_chip_row": "Show Chip Row",
      "search_limit": "Search Results Limit",
      "result_sorting": "Result Sorting",
      "vol_step": "Volume Step (0.05 = 5%)",
      "card_height": "Card Height (px)",
      "control_layout": "Control Layout",
      "save_service_data": "Save Service Data",
      "image_url": "Image URL",
      "fallback_image_url": "Fallback Image URL",
      "move_to_main": "Move action to main chips",
      "move_to_menu": "Move action into menu",
      "delete_action": "Delete Action",
      "revert_service_data": "Revert to Saved Service Data",
      "test_action": "Test Action",
      "volume_mode": "Volume Mode",
      "idle_screen": "Idle Screen",
      "name": "Name",
      "hidden_controls": "Hidden Controls",
      "ma_template": "Music Assistant Entity Template (Jinja)",
      "hidden_chips": "Hidden Search Filter Chips",
      "vol_template": "Volume Entity Template (Jinja)",
      "icon": "Icon",
      "action_type": "Action Type",
      "menu_item": "Menu Item",
      "nav_path": "Navigation Path",
      "service": "Service",
      "service_data": "Service Data",
      "idle_image_entity": "Idle Image Entity",
      "match_entity": "Match Entity",
      "ma_entity": "Music Assistant Entity",
      "vol_entity": "Volume Entity",
      "selected_entity_helper": "Selected Entity Helper",
      "sync_entity_type": "Sync Entity Type",
      "placement": "Placement",
      "card_trigger": "Card Trigger",
      "search_view": "Search Result View",
      "search_card_columns": "Card Columns"
    },
    "action_types": {
      "menu": "Open a Card Menu Item",
      "service": "Call a Service",
      "navigate": "Navigate",
      "sync_selected_entity": "Sync Selected Entity"
    },
    "action_helpers": {
      "sync_selected_entity": "Sync Selected Entity →",
      "select_helper": "(select helper)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Music Assistant Entity if configured)",
      "yamp_main_entity": "yamp_main_entity (Main Media Player Entity)",
      "yamp_playback_entity": "yamp_playback_entity (Current Active Playback Entity)"
    },
    "placements": {
      "chip": "Action Chip",
      "menu": "In Menu",
      "hidden": "Hidden (Artwork Tap)",
      "not_triggerable": "Not Triggerable"
    },
    "triggers": {
      "none": "None",
      "tap": "Tap",
      "hold": "Hold",
      "double_tap": "Double Tap",
      "swipe_left": "Swipe Left",
      "swipe_right": "Swipe Right"
    },
    "search_view_options": {
      "list": "List",
      "card": "Card"
    }
  },
  "card": {
    "sections": {
      "details": "Now Playing Details",
      "menu": "Menu & Search Sheets",
      "action_chips": "Action Chips"
    },
    "media_controls": {
      "shuffle": "Shuffle",
      "previous": "Previous",
      "play_pause": "Play/Pause",
      "stop": "Stop",
      "next": "Next",
      "repeat": "Repeat"
    },
    "menu": {
      "more_info": "More Info",
      "search": "Search",
      "source": "Source",
      "transfer_queue": "Transfer Queue",
      "group_players": "Group Players",
      "select_entity": "Select Entity for More Info",
      "transfer_to": "Transfer Queue To",
      "no_players": "No other Music Assistant players available."
    },
    "grouping": {
      "title": "Group Players",
      "sync_volume": "Sync Volume",
      "group_all": "Group All",
      "ungroup_all": "Ungroup All",
      "unavailable": "Player is unavailable",
      "no_players": "No other group-capable players available.",
      "master": "Master",
      "joined": "Joined",
      "available": "Available",
      "current": "Current"
    }
  },
  "search": {
    "favorites": "Favorites",
    "recently_played": "Recently Played",
    "next_up": "Next Up",
    "recommendations": "Recommendations",
    "radio_mode": "Radio Mode",
    "close": "Close Search",
    "no_results": "No results.",
    "play_next": "Play next",
    "replace_play": "Replace existing queue and play now",
    "replace": "Replace queue",
    "add_queue": "Add to the end of the queue",
    "move_up": "Move Up",
    "move_down": "Move Down",
    "move_next": "Move to Next",
    "remove": "Remove from Queue",
    "added": "Added to queue!",
    "labels": {
      "replace": "Replace",
      "next": "Next",
      "replace_next": "Replace Next",
      "add": "Add"
    },
    "results": "results",
    "result": "result",
    "filters": {
      "all": "All",
      "artist": "Artist",
      "album": "Album",
      "track": "Track",
      "playlist": "Playlist",
      "radio": "Radio",
      "music": "Music",
      "station": "Station",
      "podcast": "Podcast",
      "audiobook": "Audiobook"
    },
    "search_artist": "Search for this artist"
  }
};

var de = {
  "common": {
    "not_found": "Entität nicht gefunden.",
    "search": "Suchen",
    "power": "Ein/Aus",
    "favorite": "Favorit",
    "loading": "Laden...",
    "no_results": "Keine Ergebnisse.",
    "close": "Schließen",
    "vol_up": "Lauter",
    "vol_down": "Leiser",
    "media_player": "Mediaplayer",
    "edit_entity": "Entitätseinstellungen bearbeiten",
    "edit_action": "Aktionseinstellungen bearbeiten",
    "mute": "Stumm",
    "unmute": "Stummschaltung aufheben",
    "seek": "Suchen",
    "volume": "Lautstärke",
    "play_now": "Jetzt abspielen",
    "more_options": "Weitere Optionen",
    "unavailable": "Nicht verfügbar",
    "back": "Zurück",
    "cancel": "Abbrechen",
    "reset_default": "Auf Standard zurücksetzen"
  },
  "editor": {
    "tabs": {
      "entities": "Entitäten",
      "behavior": "Verhalten",
      "look_and_feel": "Design",
      "artwork": "Artwork",
      "actions": "Aktionen"
    },
    "placeholders": {
      "search": "Musik suchen..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Allgemeine Einstellungen",
          "description": "Globale Steuerung der Artwork-Anzeige und -Abrufung."
        },
        "idle": {
          "title": "Artwork im Leerlauf",
          "description": "Zeigt ein statisches Bild oder einen Entitäts-Schnappschuss an, wenn nichts abgespielt wird."
        },
        "overrides": {
          "title": "Artwork-Überschreibungen",
          "description": "Überschreibungen werden von oben nach unten ausgewertet. Zum Neusortieren ziehen."
        }
      },
      "entities": {
        "title": "Entitäten*",
        "description": "Fügen Sie die zu steuernden Mediaplayer hinzu. Entitäten ziehen, um sie neu anzuordnen."
      },
      "behavior": {
        "idle_chips": {
          "title": "Leerlauf & Chips",
          "description": "Wählen Sie, wann die Karte in den Leerlauf wechselt und wie sich Entitäts-Chips verhalten."
        },
        "interactions_search": {
          "title": "Interaktionen & Suche",
          "description": "Feineinstellung des Anpinnens von Entitäten und der Anzahl der Suchergebnisse."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Theme & Layout",
          "description": "Anpassung an das Dashboard-Styling und Kontrolle des Platzbedarfs."
        },
        "controls_typography": {
          "title": "Steuerung & Typografie",
          "description": "Anpassung von Schaltflächengröße, Entitäts-Labels und adaptivem Text."
        },
        "collapsed_idle": {
          "title": "Eingeklappte & Leerlaufzustände",
          "description": "Steuerung der Karteneinklappung und der Ansichten im Leerlauf."
        }
      },
      "actions": {
        "title": "Aktionen",
        "description": "Erstellen Sie Aktions-Chips für die Karte oder das Menü. Ziehen zum Sortieren, Stift zum Konfigurieren anklicken."
      }
    },
    "subtitles": {
      "idle_timeout": "Zeit in Millisekunden vor dem Wechsel in den Leerlaufmodus. 0 zum Deaktivieren.",
      "show_chip_row": "\"Auto\" blendet die Chip-Leiste bei nur einer Entität aus. \"Im Menü\" verschiebt sie ins Menü. \"Im Menü bei Inaktivität\" zeigt Chips inline wenn aktiv, verschiebt sie aber ins Menü bei Inaktivität.",
      "dim_chips": "Entitäts- und Aktions-Chips im Leerlauf mit Bild abdunkeln für einen sauberen Look.",
      "hold_to_pin": "Langes Drücken statt kurzem Drücken zum Anpinnen, um automatisches Umschalten zu verhindern.",
      "disable_autofocus": "Suchfeld-Autofokus deaktivieren, damit Bildschirmtastaturen ausgeblendet bleiben.",
      "search_within_filter": "Innerhalb des aktiven Filters suchen (Favoriten, etc.), anstatt ihn zu löschen.",
      "close_search_on_play": "Suchbildschirm beim Abspielen automatisch schließen.",
      "pin_search_headers": "Sucheingabe und Filter beim Scrollen oben fixieren.",
      "hide_search_headers_on_idle": "Sucheingabe und Filter im Leerlauf ausblenden.",
      "disable_mass": "Optionale Mass Queue Integration deaktivieren, auch wenn sie installiert ist.",
      "swap_pause_stop": "Pause-Taste durch Stop-Taste im modernen Layout ersetzen.",
      "adaptive_controls": "Wiedergabetasten an verfügbaren Platz anpassen.",
      "hide_menu_player": "Entitäts-Label unten ausblenden, wenn Chips im Menü sind.",
      "adaptive_text": "Textgruppen wählen, die mit dem Platz skalieren (leer lassen zum Deaktivieren).",
      "collapse_expand": "Immer eingeklappt aktiviert den Mini-Player-Modus. Bei Suche ausklappen aktiviert ihn temporär.",
      "idle_screen": "Wählen Sie, welcher Bildschirm im Leerlauf automatisch angezeigt wird.",
      "hide_controls": "Wählen Sie Steuerelemente aus, die für diese Entität ausgeblendet werden sollen.",
      "hide_search_chips": "Bestimmte Suchfilter-Chips für diese Entität ausblenden.",
      "follow_active_entity": "Lautstärke-Entität folgt automatisch der aktiven Wiedergabe-Entität.",
      "search_limit_full": "Maximale Anzahl an Suchergebnissen (1-1000, Standard: 20).",
      "default_search_filter_full": "Wählen Sie den Filter, der beim Öffnen der Suche standardmäßig aktiv ist.",
      "result_sorting_full": "Sortierung der Suchergebnisse wählen. Standard behält die Quellreihenfolge bei.",
      "card_height_full": "Leer lassen für automatische Höhe.",
      "control_layout_full": "Wählen Sie zwischen manuellem oder modernem Home Assistant Layout.",
      "artwork_extend": "Artwork-Hintergrund unter die Chip- und Aktionsleisten erweitern.",
      "artwork_extend_label": "Artwork erweitern",
      "no_artwork_overrides": "Keine Artwork-Überschreibungen konfiguriert.",
      "entity_current_hint": "'entity_id: current' verwenden, um den aktuell ausgewählten Mediaplayer anzusteuern.",
      "service_data_note": "Änderungen an den Servicedaten werden erst beim Klicken auf 'Servicedaten speichern' übernommen!",
      "jinja_template_hint": "Jinja-Template eingeben, das eine entity_id ergibt.",
      "jinja_template_vol_hint": "Jinja-Template eingeben, das eine Lautstärke-entity_id ergibt.",
      "not_available_alt_collapsed": "Nicht verfügbar mit alternativem Fortschrittsbalken oder im Modus 'Immer eingeklappt'.",
      "not_available_collapsed": "Nicht verfügbar, wenn 'Immer eingeklappt' aktiviert ist.",
      "only_available_collapsed": "Nur verfügbar, wenn 'Immer eingeklappt' aktiviert ist.",
      "only_available_modern": "Nur verfügbar im modernen Layout.",
      "image_url_helper": "Direkte Bild-URL oder lokalen Dateipfad eingeben.",
      "selected_entity_helper": "Input-Text-Helper, der mit der aktuell ausgewählten Mediaplayer-Entitäts-ID aktualisiert wird.",
      "sync_entity_type": "Wählen Sie, welche Entitäts-ID mit dem Helper synchronisiert werden soll (Standard: Music Assistant Entität, falls konfiguriert).",
      "disable_auto_select": "Verhindert, dass der Chip dieser Entität automatisch ausgewählt wird, wenn die Wiedergabe startet.",
      "search_view": "Wählen Sie zwischen einer Standardliste oder einem kartenbasierten Raster für Suchergebnisse.",
      "search_card_columns": "Geben Sie an, wie viele Spalten in der Kartenansicht verwendet werden sollen. Das Artwork wird automatisch skaliert."
    },
    "titles": {
      "edit_entity": "Entität bearbeiten",
      "edit_action": "Aktion bearbeiten",
      "service_data": "Servicedaten",
      "add_artwork_override": "Artwork-Überschreibung hinzufügen"
    },
    "labels": {
      "dim_chips": "Chips im Leerlauf abdunkeln",
      "hold_to_pin": "Gedrückt halten zum Anpinnen",
      "disable_autofocus": "Such-Autofocus deaktivieren",
      "keep_filters": "Filter bei Suche beibehalten",
      "dismiss_on_play": "Suche beim Abspielen beenden",
      "default_search_filter": "Standard-Suchfilter",
      "pin_headers": "Such-Header fixieren",
      "hide_search_headers_on_idle": "Such-Header im Leerlauf ausblenden",
      "disable_mass": "Mass Queue deaktivieren",
      "match_theme": "Theme anpassen",
      "alt_progress": "Alternativer Fortschrittsbalken",
      "display_timestamps": "Zeitstempel anzeigen",
      "swap_pause_stop": "Pause durch Stop ersetzen",
      "adaptive_controls": "Adaptive Tastengröße",
      "hide_active_entity": "Aktives Entitäts-Label ausblenden",
      "collapse_on_idle": "Bei Leerlauf einklappen",
      "hide_menu_player_toggle": "Menü-Player ausblenden",
      "always_collapsed": "Immer eingeklappt",
      "expand_on_search": "Bei Suche ausklappen",
      "script_var": "Skript-Variable (yamp_entity)",
      "use_ma_template": "Template für Music Assistant Entität verwenden",
      "use_vol_template": "Template für Lautstärke-Entität verwenden",
      "follow_active_entity": "Lautstärke folgt aktiver Entität",
      "use_url_path": "URL oder Pfad verwenden",
      "adaptive_text_elements": "Elemente für adaptive Textgröße",
      "disable_auto_select": "Auto-Auswahl deaktivieren"
    },
    "fields": {
      "artwork_fit": "Artwork-Anpassung",
      "artwork_position": "Artwork-Position",
      "artwork_hostname": "Artwork-Hostname",
      "match_field": "Match-Feld",
      "match_value": "Match-Wert",
      "size_percent": "Größe (%)",
      "object_fit": "Object-Fit",
      "idle_timeout": "Leerlauf-Timeout (ms)",
      "show_chip_row": "Chip-Leiste anzeigen",
      "search_limit": "Suchlimit",
      "result_sorting": "Ergebnissortierung",
      "vol_step": "Lautstärke-Schritt (0.05 = 5%)",
      "card_height": "Kartenhöhe (px)",
      "control_layout": "Steuerungs-Layout",
      "save_service_data": "Servicedaten speichern",
      "image_url": "Bild-URL",
      "fallback_image_url": "Fallback Bild-URL",
      "move_to_main": "Aktion in Haupt-Chips verschieben",
      "move_to_menu": "Aktion ins Menü verschieben",
      "delete_action": "Aktion löschen",
      "revert_service_data": "Auf gespeicherte Servicedaten zurücksetzen",
      "test_action": "Aktion testen",
      "volume_mode": "Lautstärke-Modus",
      "idle_screen": "Leerlauf-Bildschirm",
      "name": "Name",
      "hidden_controls": "Ausgeblendete Steuerungen",
      "ma_template": "Music Assistant Entitäts-Template (Jinja)",
      "hidden_chips": "Ausgeblendete Suchfilter-Chips",
      "vol_template": "Lautstärke-Entitäts-Template (Jinja)",
      "icon": "Icon",
      "action_type": "Aktionstyp",
      "menu_item": "Menüpunkt",
      "nav_path": "Navigationspfad",
      "service": "Dienst",
      "service_data": "Servicedaten",
      "idle_image_entity": "Leerlauf-Bild-Entität",
      "match_entity": "Match-Entität",
      "ma_entity": "Music Assistant Entität",
      "vol_entity": "Lautstärke-Entität",
      "selected_entity_helper": "Ausgewählter Entitäts-Helper",
      "sync_entity_type": "Synchronisierungs-Entitätstyp",
      "placement": "Platzierung",
      "card_trigger": "Karten-Trigger",
      "search_view": "Suchergebnis-Ansicht",
      "search_card_columns": "Kartenspalten"
    },
    "action_types": {
      "menu": "Kartenmenüpunkt öffnen",
      "service": "Dienst aufrufen",
      "navigate": "Navigieren",
      "sync_selected_entity": "Ausgewählte Entität synchronisieren"
    },
    "action_helpers": {
      "sync_selected_entity": "Entität synchronisieren →",
      "select_helper": "(Helper auswählen)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Music Assistant Entität, falls konfiguriert)",
      "yamp_main_entity": "yamp_main_entity (Haupt-Mediaplayer-Entität)",
      "yamp_playback_entity": "yamp_playback_entity (Aktuelle aktive Wiedergabe-Entität)"
    },
    "placements": {
      "chip": "Aktions-Chip",
      "menu": "Im Menü",
      "hidden": "Ausgeblendet (Artwork-Tippen)",
      "not_triggerable": "Nicht triggerbar"
    },
    "triggers": {
      "none": "Keiner",
      "tap": "Tippen",
      "hold": "Halten",
      "double_tap": "Doppeltippen",
      "swipe_left": "Nach links wischen",
      "swipe_right": "Nach rechts wischen"
    },
    "search_view_options": {
      "list": "Liste",
      "card": "Karte"
    }
  },
  "card": {
    "sections": {
      "details": "Details zur Wiedergabe",
      "menu": "Menü & Suchblätter",
      "action_chips": "Aktions-Chips"
    },
    "media_controls": {
      "shuffle": "Zufall",
      "previous": "Zurück",
      "play_pause": "Play/Pause",
      "stop": "Stop",
      "next": "Weiter",
      "repeat": "Wiederholen"
    },
    "menu": {
      "more_info": "Mehr Info",
      "search": "Suche",
      "source": "Quelle",
      "transfer_queue": "Warteschlange übertragen",
      "group_players": "Player gruppieren",
      "select_entity": "Entität für mehr Info wählen",
      "transfer_to": "Warteschlange übertragen zu",
      "no_players": "Keine anderen Music Assistant Player verfügbar."
    },
    "grouping": {
      "title": "Player gruppieren",
      "sync_volume": "Lautstärke synchronisieren",
      "group_all": "Alle gruppieren",
      "ungroup_all": "Alle trennen",
      "unavailable": "Player ist nicht verfügbar",
      "no_players": "Keine anderen gruppierungsfähigen Player verfügbar.",
      "master": "Master",
      "joined": "Verbunden",
      "available": "Verfügbar",
      "current": "Aktuell"
    }
  },
  "search": {
    "favorites": "Favoriten",
    "recently_played": "Zuletzt gehört",
    "next_up": "Als Nächstes",
    "recommendations": "Empfehlungen",
    "radio_mode": "Radiomodus",
    "close": "Suche schließen",
    "no_results": "Keine Ergebnisse.",
    "play_next": "Als Nächstes spielen",
    "replace_play": "Warteschlange ersetzen und jetzt spielen",
    "replace": "Warteschlange ersetzen",
    "add_queue": "Am Ende der Warteschlange hinzufügen",
    "move_up": "Nach oben",
    "move_down": "Nach unten",
    "move_next": "Als Nächstes verschieben",
    "remove": "Aus Warteschlange entfernen",
    "added": "Zur Warteschlange hinzugefügt!",
    "labels": {
      "replace": "Ersetzen",
      "next": "Weiter",
      "replace_next": "Weiter ersetzen",
      "add": "Hinzufügen"
    },
    "results": "Ergebnisse",
    "result": "Ergebnis",
    "filters": {
      "all": "Alle",
      "artist": "Künstler",
      "album": "Album",
      "track": "Titel",
      "playlist": "Playlist",
      "radio": "Radio",
      "music": "Musik",
      "station": "Station",
      "podcast": "Podcast",
      "audiobook": "Hörbuch"
    },
    "search_artist": "Nach diesem Künstler suchen"
  }
};

var es = {
  "common": {
    "not_found": "Entidad no encontrada.",
    "search": "Buscar",
    "power": "Encender/Apagar",
    "favorite": "Favorito",
    "loading": "Cargando...",
    "no_results": "Sin resultados.",
    "close": "Cerrar",
    "vol_up": "Subir volumen",
    "vol_down": "Bajar volumen",
    "media_player": "Reproductor multimedia",
    "edit_entity": "Editar ajustes de entidad",
    "edit_action": "Editar ajustes de acción",
    "mute": "Silenciar",
    "unmute": "Activar sonido",
    "seek": "Buscar",
    "volume": "Volumen",
    "play_now": "Reproducir ahora",
    "more_options": "Más opciones",
    "unavailable": "No disponible",
    "back": "Atrás",
    "cancel": "Cancelar",
    "reset_default": "Restablecer valores"
  },
  "editor": {
    "tabs": {
      "entities": "Entidades",
      "behavior": "Comportamiento",
      "look_and_feel": "Apariencia",
      "artwork": "Portada",
      "actions": "Acciones"
    },
    "placeholders": {
      "search": "Buscar música..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Ajustes generales",
          "description": "Controles globales para la portada."
        },
        "idle": {
          "title": "Portada en reposo",
          "description": "Mostrar imagen estática cuando nada se reproduce."
        },
        "overrides": {
          "title": "Reemplazos de portada",
          "description": "Los reemplazos se evalúan de arriba a abajo. Arrastre para reordenar."
        }
      },
      "entities": {
        "title": "Entidades*",
        "description": "Añada los reproductores multimedia. Arrastre para reordenar."
      },
      "behavior": {
        "idle_chips": {
          "title": "Reposo y chips",
          "description": "Elija cuándo pasa a reposo y el comportamiento de los chips."
        },
        "interactions_search": {
          "title": "Interacciones y búsqueda",
          "description": "Ajuste el fijado de entidades y límite de resultados."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Tema y diseño",
          "description": "Combine con el estilo de su dashboard."
        },
        "controls_typography": {
          "title": "Controles y tipografía",
          "description": "Ajuste tamaño de botones y etiquetas."
        },
        "collapsed_idle": {
          "title": "Estados de reposo y contraído",
          "description": "Controle el contraído de la tarjeta."
        }
      },
      "actions": {
        "title": "Acciones",
        "description": "Cree chips de acción. Arrastre para reordenar, pulse el lápiz para configurar."
      }
    },
    "subtitles": {
      "idle_timeout": "Tiempo antes de reposo (ms). 0 para desactivar.",
      "show_chip_row": "\"Auto\" oculta la fila si solo hay una entidad. \"En menú\" mueve los chips. \"En menú en reposo\" muestra los chips en línea cuando está activo pero los mueve al menú cuando está en reposo.",
      "dim_chips": "Atenuar los chips en reposo para un aspecto más limpio.",
      "hold_to_pin": "Mantener pulsado para fijar en vez de pulsación corta.",
      "disable_autofocus": "Evitar que la búsqueda tome el foco automáticamente.",
      "search_within_filter": "Buscar dentro del filtro activo (Favoritos, etc.).",
      "close_search_on_play": "Cerrar búsqueda al reproducir.",
      "pin_search_headers": "Fijar encabezados de búsqueda al hacer scroll.",
      "hide_search_headers_on_idle": "Ocultar encabezados de búsqueda en inactividad.",
      "disable_mass": "Desactivar integración con Mass Queue.",
      "swap_pause_stop": "Cambiar pausa por stop en diseño moderno.",
      "adaptive_controls": "Permitir que los botones se adapten al espacio.",
      "hide_menu_player": "Ocultar nombre de entidad cuando está en el menú.",
      "adaptive_text": "Elegir qué textos se adaptan al espacio.",
      "collapse_expand": "Siempre contraído activa el modo mini. Expandir al buscar expande temporalmente.",
      "idle_screen": "Elegir pantalla a mostrar en reposo.",
      "hide_controls": "Seleccionar controles a ocultar.",
      "hide_search_chips": "Ocultar chips de filtro de búsqueda.",
      "follow_active_entity": "La entidad de volumen seguirá a la activa.",
      "search_limit_full": "Máximo de resultados (1-1000, defecto: 20).",
      "default_search_filter_full": "Elige qué filtro está activo por defecto cuando se abre la pantalla de búsqueda.",
      "result_sorting_full": "Elegir orden de resultados.",
      "card_height_full": "Dejar vacío para altura automática.",
      "control_layout_full": "Elegir entre diseño antiguo o moderno.",
      "artwork_extend": "Extender portada bajo los chips.",
      "artwork_extend_label": "Extender portada",
      "no_artwork_overrides": "Sin reemplazos de portada configurados.",
      "entity_current_hint": "Use 'entity_id: current' para el reproductor actual.",
      "service_data_note": "Los cambios se guardan al pulsar 'Guardar'.",
      "jinja_template_hint": "Plantilla Jinja para entity_id.",
      "jinja_template_vol_hint": "Plantilla para entidad de volumen.",
      "not_available_alt_collapsed": "No disponible en modo contraído.",
      "not_available_collapsed": "No disponible si está contraído.",
      "only_available_collapsed": "Solo disponible si está contraído.",
      "only_available_modern": "Solo disponible con diseño Moderno.",
      "image_url_helper": "Ingrese una URL directa a una imagen o una ruta de archivo local",
      "selected_entity_helper": "Helper de texto de entrada que se actualizará con el ID de la entidad del reproductor de medios seleccionado actualmente.",
      "sync_entity_type": "Elija qué ID de entidad sincronizar con el helper (por defecto la entidad de Music Assistant si está configurada).",
      "disable_auto_select": "Evita que el chip de esta entidad se seleccione automáticamente cuando comienza la reproducción.",
      "search_view": "Elegir entre una lista estándar o una cuadrícula de tarjetas para los resultados de la búsqueda.",
      "search_card_columns": "Especifica cuántas columnas usar en la vista de tarjetas. El artwork se adaptará automáticamente."
    },
    "titles": {
      "edit_entity": "Editar entidad",
      "edit_action": "Editar acción",
      "service_data": "Datos del servicio",
      "add_artwork_override": "Añadir reemplazo"
    },
    "labels": {
      "dim_chips": "Atenuar chips en reposo",
      "hold_to_pin": "Mantener para fijar",
      "disable_autofocus": "Desactivar autofoco",
      "keep_filters": "Mantener filtros",
      "dismiss_on_play": "Cerrar al reproducir",
      "default_search_filter": "Filtro de búsqueda predeterminado",
      "pin_headers": "Fijar encabezados",
      "hide_search_headers_on_idle": "Ocultar encabezados en inactividad",
      "disable_mass": "Desactivar Mass Queue",
      "match_theme": "Seguir tema",
      "alt_progress": "Barra de progreso alternativa",
      "display_timestamps": "Mostrar sellos de tiempo",
      "swap_pause_stop": "Cambiar Pausa por Stop",
      "adaptive_controls": "Tamaño adaptativo",
      "hide_active_entity": "Ocultar nombre de entidad activa",
      "collapse_on_idle": "Contraer en reposo",
      "hide_menu_player_toggle": "Ocultar reproductor del menú",
      "always_collapsed": "Siempre contraído",
      "expand_on_search": "Expandir al buscar",
      "script_var": "Variable script (yamp_entity)",
      "use_ma_template": "Usar plantilla MA",
      "use_vol_template": "Usar plantilla Volumen",
      "follow_active_entity": "Volumen sigue a entidad activa",
      "use_url_path": "Usar URL o ruta",
      "adaptive_text_elements": "Elementos de texto adaptativo",
      "disable_auto_select": "Desactivar selección automática"
    },
    "fields": {
      "artwork_fit": "Ajuste",
      "artwork_position": "Posición",
      "artwork_hostname": "Host",
      "match_field": "Campo",
      "match_value": "Valor",
      "size_percent": "Tamaño (%)",
      "object_fit": "Object Fit",
      "idle_timeout": "Reposo (ms)",
      "show_chip_row": "Mostrar chips",
      "search_limit": "Límite de búsqueda",
      "result_sorting": "Orden",
      "vol_step": "Paso de volumen",
      "card_height": "Altura (px)",
      "control_layout": "Diseño",
      "save_service_data": "Guardar",
      "image_url": "URL imagen",
      "fallback_image_url": "URL de respaldo",
      "move_to_main": "Mover a chips principales",
      "move_to_menu": "Mover al menú",
      "delete_action": "Borrar acción",
      "revert_service_data": "Deshacer cambios",
      "test_action": "Probar acción",
      "volume_mode": "Modo volumen",
      "idle_screen": "Pantalla reposo",
      "name": "Nombre",
      "hidden_controls": "Controles ocultos",
      "ma_template": "Plantilla MA (Jinja)",
      "hidden_chips": "Chips ocultos",
      "vol_template": "Plantilla Volumen (Jinja)",
      "icon": "Icono",
      "action_type": "Tipo de acción",
      "menu_item": "Elemento de menú",
      "nav_path": "Ruta",
      "service": "Servicio",
      "service_data": "Datos",
      "idle_image_entity": "Entidad imagen reposo",
      "match_entity": "Entidad",
      "ma_entity": "Entidad de Music Assistant",
      "vol_entity": "Entidad de volumen",
      "selected_entity_helper": "Helper de entidad seleccionada",
      "sync_entity_type": "Tipo de entidad a sincronizar",
      "placement": "Colocación",
      "card_trigger": "Activador de la tarjeta",
      "search_view": "Vista de resultados de búsqueda",
      "search_card_columns": "Columnas de tarjetas"
    },
    "action_types": {
      "menu": "Abrir un elemento del menú",
      "service": "Llamar a un servicio",
      "navigate": "Navegar",
      "sync_selected_entity": "Sincronizar entidad seleccionada"
    },
    "action_helpers": {
      "sync_selected_entity": "Sincronizar entidad seleccionada →",
      "select_helper": "(seleccionar helper)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Entidad de Music Assistant si está configurada)",
      "yamp_main_entity": "yamp_main_entity (Entidad principal del reproductor)",
      "yamp_playback_entity": "yamp_playback_entity (Entidad de reproducción activa actual)"
    },
    "placements": {
      "chip": "Chip de acción",
      "menu": "En el menú",
      "hidden": "Oculto (Toque en el arte)",
      "not_triggerable": "No activable"
    },
    "triggers": {
      "none": "Ninguno",
      "tap": "Toque",
      "hold": "Mantener",
      "double_tap": "Doble toque",
      "swipe_left": "Deslizar a la izquierda",
      "swipe_right": "Deslizar a la derecha"
    },
    "search_view_options": {
      "list": "Lista",
      "card": "Tarjeta"
    }
  },
  "card": {
    "sections": {
      "details": "Detalles de reproducción",
      "menu": "Menú y Búsqueda",
      "action_chips": "Chips de acción"
    },
    "media_controls": {
      "shuffle": "Aleatorio",
      "previous": "Anterior",
      "play_pause": "Reproducir/Pausa",
      "stop": "Detener",
      "next": "Siguiente",
      "repeat": "Repetir"
    },
    "menu": {
      "more_info": "Más info",
      "search": "Buscar",
      "source": "Fuente",
      "transfer_queue": "Transferir cola",
      "group_players": "Agrupar",
      "select_entity": "Seleccionar",
      "transfer_to": "Transferir a",
      "no_players": "Sin reproductores MA."
    },
    "grouping": {
      "title": "Agrupar",
      "sync_volume": "Sincronizar volumen",
      "group_all": "Agrupar todos",
      "ungroup_all": "Desagrupar todos",
      "unavailable": "No disponible",
      "no_players": "No agrupable.",
      "master": "Maestro",
      "joined": "Unido",
      "available": "Disponible",
      "current": "Actual"
    }
  },
  "search": {
    "favorites": "Favoritos",
    "recently_played": "Reciente",
    "next_up": "A continuación",
    "recommendations": "Recomendaciones",
    "radio_mode": "Modo Radio",
    "close": "Cerrar",
    "no_results": "Sin resultados.",
    "play_next": "Reprod. siguiente",
    "replace_play": "Reemplazar y reproducir",
    "replace": "Reemplazar cola",
    "add_queue": "Añadir al final",
    "move_up": "Subir",
    "move_down": "Bajar",
    "move_next": "Pasar a siguiente",
    "remove": "Quitar de cola",
    "added": "¡Añadido!",
    "labels": {
      "replace": "Remplazar",
      "next": "Siguiente",
      "replace_next": "Rempl. Sig.",
      "add": "Añadir"
    },
    "results": "resultados",
    "result": "resultado",
    "filters": {
      "all": "Todo",
      "artist": "Artista",
      "album": "Álbum",
      "track": "Canción",
      "playlist": "Lista",
      "radio": "Radio",
      "music": "Música",
      "station": "Emisora",
      "podcast": "Pódcast",
      "audiobook": "Audiolibro"
    },
    "search_artist": "Buscar este artista"
  }
};

var fr = {
  "common": {
    "not_found": "Entité non trouvée.",
    "search": "Rechercher",
    "power": "Alimentation",
    "favorite": "Favori",
    "loading": "Chargement...",
    "no_results": "Aucun résultat.",
    "close": "Fermer",
    "vol_up": "Monter le volume",
    "vol_down": "Baisser le volume",
    "media_player": "Lecteur Multimédia",
    "edit_entity": "Modifier les paramètres de l'entité",
    "edit_action": "Modifier les paramètres de l'action",
    "mute": "Muet",
    "unmute": "Rétablir le son",
    "seek": "Rechercher",
    "volume": "Volume",
    "play_now": "Lire maintenant",
    "more_options": "Plus d'options",
    "unavailable": "Indisponible",
    "back": "Retour",
    "cancel": "Annuler",
    "reset_default": "Réinitialiser"
  },
  "editor": {
    "tabs": {
      "entities": "Entités",
      "behavior": "Comportement",
      "look_and_feel": "Apparence",
      "artwork": "Illustrations",
      "actions": "Actions"
    },
    "placeholders": {
      "search": "Rechercher de la musique..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Paramètres Généraux",
          "description": "Contrôles globaux pour l'affichage des illustrations."
        },
        "idle": {
          "title": "Illustration au Repos",
          "description": "Afficher une image statique lorsque rien n'est en lecture."
        },
        "overrides": {
          "title": "Remplacements d'Illustrations",
          "description": "Les remplacements sont évalués de haut en bas. Glissez pour réordonner."
        }
      },
      "entities": {
        "title": "Entités*",
        "description": "Ajoutez les lecteurs multimédias que vous souhaitez contrôler. Glissez pour réordonner."
      },
      "behavior": {
        "idle_chips": {
          "title": "Veille & Jetons",
          "description": "Choisissez quand la carte passe en mode veille et comment les jetons se comportent."
        },
        "interactions_search": {
          "title": "Interactions & Recherche",
          "description": "Affinez la façon dont les entités sont épinglées et le nombre de résultats."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Thème & Mise en page",
          "description": "Adaptez au style de votre tableau de bord et contrôlez l'empreinte globale."
        },
        "controls_typography": {
          "title": "Commandes & Typographie",
          "description": "Ajustez la taille des boutons, les étiquettes et le texte adaptatif."
        },
        "collapsed_idle": {
          "title": "États Réduits & Veille",
          "description": "Contrôlez quand la carte se réduit et quelles vues s'affichent en veille."
        }
      },
      "actions": {
        "title": "Actions",
        "description": "Créez les jetons d'action. Glissez pour réordonner, cliquez sur le crayon pour configurer."
      }
    },
    "subtitles": {
      "idle_timeout": "Temps en millisecondes avant la mise en veille. 0 pour désactiver.",
      "show_chip_row": "\"Auto\" masque la barre de jetons si une seule entité est configurée. \"Dans le Menu\" déplace les jetons. \"Dans le menu au repos\" affiche les jetons en ligne lorsque actif mais les déplace dans le menu au repos.",
      "dim_chips": "Assombrir les jetons en mode veille pour un look plus épuré.",
      "hold_to_pin": "Appui long pour épingler au lieu d'un appui court.",
      "disable_autofocus": "Empêcher la recherche de prendre le focus automatiquement.",
      "search_within_filter": "Rechercher dans le filtre actif actuel (Favoris, etc.).",
      "close_search_on_play": "Fermer automatiquement la recherche à la lecture.",
      "pin_search_headers": "Garder la recherche et les filtres fixes en haut.",
      "hide_search_headers_on_idle": "Masquer la recherche et les filtres en mode veille.",
      "disable_mass": "Désactiver l'intégration Mass Queue.",
      "swap_pause_stop": "Remplacer le bouton pause par stop en mode moderne.",
      "adaptive_controls": "Laisser les boutons s'adapter à l'espace disponible.",
      "hide_menu_player": "Masquer l'étiquette de l'entité en bas quand les jetons sont dans le menu.",
      "adaptive_text": "Choisir quels textes doivent s'adapter à l'espace.",
      "collapse_expand": "Toujours réduit crée un mini lecteur. Agrandir à la Recherche agrandit temporairement.",
      "idle_screen": "Choisir l'écran à afficher automatiquement en veille.",
      "hide_controls": "Sélectionner les commandes à masquer pour cette entité.",
      "hide_search_chips": "Masquer des jetons de filtrage spécifiques.",
      "follow_active_entity": "L'entité de volume suivra automatiquement l'entité active.",
      "search_limit_full": "Nombre maximum de résultats (1-1000, défaut: 20).",
      "default_search_filter_full": "Choisissez quel filtre est actif par défaut à l'ouverture de la recherche.",
      "result_sorting_full": "Choisir l'ordre des résultats. Par défaut conserve l'ordre source.",
      "card_height_full": "Laisser vide pour une hauteur automatique.",
      "control_layout_full": "Choisir entre l'ancienne mise en page ou la moderne.",
      "artwork_extend": "Étendre l'illustration sous les lignes de jetons.",
      "artwork_extend_label": "Étendre l'illustration",
      "no_artwork_overrides": "Aucun remplacement d'illustration configuré.",
      "entity_current_hint": "Utilisez 'entity_id: current' pour cibler le lecteur actuel.",
      "service_data_note": "Les changements ne sont enregistrés qu'en cliquant sur 'Enregistrer'.",
      "jinja_template_hint": "Entrez un modèle Jinja qui renvoie un entity_id.",
      "jinja_template_vol_hint": "Modèle pour l'entité de volume.",
      "not_available_alt_collapsed": "Non disponible en mode 'Toujours réduit'.",
      "not_available_collapsed": "Non disponible si 'Toujours réduit' est activé.",
      "only_available_collapsed": "Uniquement disponible si 'Toujours réduit' est activé.",
      "only_available_modern": "Uniquement disponible avec la mise en page Moderne.",
      "image_url_helper": "Entrez une URL directe vers une image ou un chemin de fichier local",
      "selected_entity_helper": "Helper de texte d'entrée qui sera mis à jour avec l'ID de l'entité du lecteur multimédia actuellement sélectionné.",
      "sync_entity_type": "Choisissez quel ID d'entité synchroniser avec le helper (par défaut l'entité Music Assistant si configurée).",
      "disable_auto_select": "Empêche le jeton de cette entité d'être automatiquement sélectionné au début de la lecture.",
      "search_view": "Choisissez entre une liste standard ou une grille de cartes pour les résultats de recherche.",
      "search_card_columns": "Spécifiez le nombre de colonnes à utiliser dans la vue carte. L'illustration s'adaptera automatiquement."
    },
    "titles": {
      "edit_entity": "Modifier l'entité",
      "edit_action": "Modifier l'action",
      "service_data": "Données du service",
      "add_artwork_override": "Ajouter un remplacement"
    },
    "labels": {
      "dim_chips": "Assombrir les jetons en veille",
      "hold_to_pin": "Maintenir pour épingler",
      "disable_autofocus": "Désactiver l'autofocus",
      "keep_filters": "Garder les filtres",
      "dismiss_on_play": "Fermer en lecture",
      "default_search_filter": "Filtre de recherche par défaut",
      "pin_headers": "Épingler les en-têtes",
      "hide_search_headers_on_idle": "Masquer les en-têtes en veille",
      "disable_mass": "Désactiver Mass Queue",
      "match_theme": "Suivre le thème",
      "alt_progress": "Barre de progression alternative",
      "display_timestamps": "Afficher les horodatages",
      "swap_pause_stop": "Remplacer Pause par Stop",
      "adaptive_controls": "Taille adaptative",
      "hide_active_entity": "Masquer l'étiquette active",
      "collapse_on_idle": "Réduire en veille",
      "hide_menu_player_toggle": "Masquer le lecteur menu",
      "always_collapsed": "Toujours réduit",
      "expand_on_search": "Agrandir en recherche",
      "script_var": "Variable script (yamp_entity)",
      "use_ma_template": "Utiliser modèle MA",
      "use_vol_template": "Utiliser modèle Volume",
      "follow_active_entity": "Le volume suit l'entité active",
      "use_url_path": "Utiliser URL ou chemin",
      "adaptive_text_elements": "Éléments de texte adaptatif",
      "disable_auto_select": "Désactiver la sélection automatique"
    },
    "fields": {
      "artwork_fit": "Ajustement",
      "artwork_position": "Position",
      "artwork_hostname": "Hôte",
      "match_field": "Champ de correspondance",
      "match_value": "Valeur de correspondance",
      "size_percent": "Taille (%)",
      "object_fit": "Object Fit",
      "idle_timeout": "Veille (ms)",
      "show_chip_row": "Afficher les jetons",
      "search_limit": "Limite de résultats",
      "result_sorting": "Tri des résultats",
      "vol_step": "Pas du volume",
      "card_height": "Hauteur (px)",
      "control_layout": "Mise en page",
      "save_service_data": "Enregistrer",
      "image_url": "URL image",
      "fallback_image_url": "URL de secours",
      "move_to_main": "Mettre dans les jetons principaux",
      "move_to_menu": "Mettre dans le menu",
      "delete_action": "Supprimer l'action",
      "revert_service_data": "Annuler les changements",
      "test_action": "Tester l'action",
      "volume_mode": "Mode volume",
      "idle_screen": "Écran de veille",
      "name": "Nom",
      "hidden_controls": "Commandes masquées",
      "ma_template": "Modèle MA (Jinja)",
      "hidden_chips": "Jetons masqués",
      "vol_template": "Modèle Volume (Jinja)",
      "icon": "Icône",
      "action_type": "Type d'action",
      "menu_item": "Élément du menu",
      "nav_path": "Chemin navigation",
      "service": "Service",
      "service_data": "Données",
      "idle_image_entity": "Entité image veille",
      "match_entity": "Entité de correspondance",
      "ma_entity": "Entité Music Assistant",
      "vol_entity": "Entité de volume",
      "selected_entity_helper": "Helper d'entité sélectionnée",
      "sync_entity_type": "Type d'entité à synchroniser",
      "placement": "Placement",
      "card_trigger": "Déclencheur de carte",
      "search_view": "Vue des résultats de recherche",
      "search_card_columns": "Colonnes de cartes"
    },
    "action_types": {
      "menu": "Ouvrir un élément de menu",
      "service": "Appeler un service",
      "navigate": "Naviguer",
      "sync_selected_entity": "Synchroniser l'entité sélectionnée"
    },
    "action_helpers": {
      "sync_selected_entity": "Synchroniser l'entité sélectionnée →",
      "select_helper": "(sélectionner helper)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Entité Music Assistant si configurée)",
      "yamp_main_entity": "yamp_main_entity (Entité principale du lecteur)",
      "yamp_playback_entity": "yamp_playback_entity (Entité de lecture active actuelle)"
    },
    "placements": {
      "chip": "Puce d'action",
      "menu": "Dans le menu",
      "hidden": "Masqué (Appui sur l'image)",
      "not_triggerable": "Non déclenchable"
    },
    "triggers": {
      "none": "Aucun",
      "tap": "Appui",
      "hold": "Maintenir",
      "double_tap": "Double appui",
      "swipe_left": "Glisser vers la gauche",
      "swipe_right": "Glisser vers la droite"
    },
    "search_view_options": {
      "list": "Liste",
      "card": "Carte"
    }
  },
  "card": {
    "sections": {
      "details": "Détails lecture",
      "menu": "Menu & Recherche",
      "action_chips": "Jetons d'action"
    },
    "media_controls": {
      "shuffle": "Aléatoire",
      "previous": "Précédent",
      "play_pause": "Lecture/Pause",
      "stop": "Arrêt",
      "next": "Suivant",
      "repeat": "Répéter"
    },
    "menu": {
      "more_info": "Plus d'infos",
      "search": "Rechercher",
      "source": "Source",
      "transfer_queue": "Transférer la file",
      "group_players": "Grouper les lecteurs",
      "select_entity": "Choisir pour plus d'infos",
      "transfer_to": "Transférer vers",
      "no_players": "Aucun lecteur MA disponible."
    },
    "grouping": {
      "title": "Grouper les lecteurs",
      "sync_volume": "Synchroniser volume",
      "group_all": "Grouper tout",
      "ungroup_all": "Dégrouper tout",
      "unavailable": "Lecteur indisponible",
      "no_players": "Aucun lecteur groupable.",
      "master": "Maître",
      "joined": "Lié",
      "available": "Disponible",
      "current": "Actuel"
    }
  },
  "search": {
    "favorites": "Favoris",
    "recently_played": "Récemment lus",
    "next_up": "À suivre",
    "recommendations": "Recommandations",
    "radio_mode": "Mode Radio",
    "close": "Fermer la recherche",
    "no_results": "Aucun résultat.",
    "play_next": "Lire après",
    "replace_play": "Remplacer et lire",
    "replace": "Remplacer file",
    "add_queue": "Ajouter à la fin",
    "move_up": "Monter",
    "move_down": "Descendre",
    "move_next": "Passer au suivant",
    "remove": "Retirer de la file",
    "added": "Ajouté à la file !",
    "labels": {
      "replace": "Remplacer",
      "next": "Suivant",
      "replace_next": "Rempl. Suivant",
      "add": "Ajouter"
    },
    "results": "résultats",
    "result": "résultat",
    "filters": {
      "all": "Tout",
      "artist": "Artiste",
      "album": "Album",
      "track": "Titre",
      "playlist": "Playlist",
      "radio": "Radio",
      "music": "Musique",
      "station": "Station",
      "podcast": "Podcast",
      "audiobook": "Livre audio"
    },
    "search_artist": "Chercher cet artiste"
  }
};

var it = {
  "common": {
    "not_found": "Entità non trovata.",
    "search": "Cerca",
    "power": "Accensione",
    "favorite": "Preferito",
    "loading": "Caricamento...",
    "no_results": "Nessun risultato.",
    "close": "Chiudi",
    "vol_up": "Volume su",
    "vol_down": "Volume giù",
    "media_player": "Lettore multimediale",
    "edit_entity": "Modifica impostazioni entità",
    "edit_action": "Modifica impostazioni azione",
    "mute": "Muto",
    "unmute": "Riattiva audio",
    "seek": "Cerca",
    "volume": "Volume",
    "play_now": "Riproduci ora",
    "more_options": "Altre opzioni",
    "unavailable": "Non disponibile",
    "back": "Indietro",
    "cancel": "Annulla",
    "reset_default": "Ripristina predefiniti"
  },
  "editor": {
    "tabs": {
      "entities": "Entità",
      "behavior": "Comportamento",
      "look_and_feel": "Aspetto",
      "artwork": "Copertina",
      "actions": "Azioni"
    },
    "placeholders": {
      "search": "Cerca musica..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Impostazioni generali",
          "description": "Controlli globali per la copertina."
        },
        "idle": {
          "title": "Copertina in riposo",
          "description": "Mostra un'immagine statica quando non c'è riproduzione."
        },
        "overrides": {
          "title": "Override copertina",
          "description": "Gli override sono valutati dall'alto in basso."
        }
      },
      "entities": {
        "title": "Entità*",
        "description": "Aggiungi i lettori da controllare."
      },
      "behavior": {
        "idle_chips": {
          "title": "Riposo e chip",
          "description": "Scegli quando andare in riposo."
        },
        "interactions_search": {
          "title": "Interazioni e ricerca",
          "description": "Ajusta il fissaggio delle entità."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Tema e layout",
          "description": "Adatta allo stile del dashboard."
        },
        "controls_typography": {
          "title": "Controlli e tipografia",
          "description": "Ajusta bottoni e etichette."
        },
        "collapsed_idle": {
          "title": "Stati contratto e riposo",
          "description": "Controlla il contratto della scheda."
        }
      },
      "actions": {
        "title": "Azioni",
        "description": "Crea chip azione."
      }
    },
    "subtitles": {
      "idle_timeout": "Tempo prima del riposo (ms). 0 per disabilitare.",
      "show_chip_row": "\"Auto\" nasconde la riga se c'è una sola entità. \"Nel menu\" sposta i chip nel menu. \"Nel menu in inattività\" mostra i chip in linea quando attivo ma li sposta nel menu quando inattivo.",
      "dim_chips": "Appanna i chip in riposo per un aspetto più pulito.",
      "hold_to_pin": "Tieni premuto per fissare invece di un tocco breve.",
      "disable_autofocus": "Evita che la ricerca prenda il focus automaticamente.",
      "search_within_filter": "Cerca nel filtro attivo (Preferiti, ecc.).",
      "close_search_on_play": "Chiudi ricerca alla riproduzione.",
      "pin_search_headers": "Fissa le intestazioni di ricerca durante lo scorrimento.",
      "hide_search_headers_on_idle": "Nascondi la ricerca e i filtri quando inattivo.",
      "disable_mass": "Disabilita integrazione Mass Queue.",
      "swap_pause_stop": "Sostituisci pausa con stop nel design moderno.",
      "adaptive_controls": "Permetti ai pulsanti di adattarsi allo spazio.",
      "hide_menu_player": "Nascondi nome entità quando è nel menu.",
      "adaptive_text": "Scegli quali testi si adattano allo spazio.",
      "collapse_expand": "Sempre contratto attiva il modo mini. Espandi alla ricerca espande temporaneamente.",
      "idle_screen": "Scegli schermata da mostrare in riposo.",
      "hide_controls": "Seleziona controlli da nascondere.",
      "hide_search_chips": "Nascondi chip di filtro ricerca.",
      "follow_active_entity": "L'entità volume seguirà quella attiva.",
      "search_limit_full": "Massimo risultati (1-1000, default: 20).",
      "default_search_filter_full": "Scegli quale filtro è attivo per impostazione predefinita all'apertura della ricerca.",
      "result_sorting_full": "Scegli ordine risultati.",
      "card_height_full": "Lascia vuoto per altezza automatica.",
      "control_layout_full": "Scegli tra design vecchio o moderno.",
      "artwork_extend": "Estendi copertina sotto i chip.",
      "artwork_extend_label": "Estendi copertina",
      "no_artwork_overrides": "Nessun override copertina configurato.",
      "entity_current_hint": "Usa 'entity_id: current' per il lettore attuale.",
      "service_data_note": "Le modifiche si salvano premendo 'Salva'.",
      "jinja_template_hint": "Modello Jinja per entity_id.",
      "jinja_template_vol_hint": "Modello per entità volume.",
      "not_available_alt_collapsed": "Non disponibile in modo contratto.",
      "not_available_collapsed": "Non disponibile se contratto.",
      "only_available_collapsed": "Solo disponibile se contratto.",
      "only_available_modern": "Solo disponibile con layout Moderno.",
      "image_url_helper": "Inserisci un URL diretto a un'immagine o un percorso file locale",
      "selected_entity_helper": "Helper di testo di input che verrà aggiornato con l'ID dell'entità del lettore multimediale attualmente selezionato.",
      "sync_entity_type": "Scegli quale ID entità sincronizzare con l'helper (predefinito l'entità Music Assistant se configurata).",
      "disable_auto_select": "Evita che il chip di questa entità venga selezionato automaticamente all'inizio della riproduzione.",
      "search_view": "Scegli tra una lista standard o una griglia di schede per i risultati della ricerca.",
      "search_card_columns": "Specifica quante colonne utilizzare nella vista a schede. La copertina si adatterà automaticamente."
    },
    "titles": {
      "edit_entity": "Modifica entità",
      "edit_action": "Modifica azione",
      "service_data": "Dati servizio",
      "add_artwork_override": "Aggiungi override"
    },
    "labels": {
      "dim_chips": "Appanna chip in riposo",
      "hold_to_pin": "Tieni premuto per fissare",
      "disable_autofocus": "Disabilita autofocus",
      "keep_filters": "Mantieni filtri",
      "dismiss_on_play": "Chiudi alla riproduzione",
      "default_search_filter": "Filtro di ricerca predefinito",
      "pin_headers": "Fissa intestazioni",
      "hide_search_headers_on_idle": "Nascondi intestazioni in inattività",
      "disable_mass": "Disabilita Mass Queue",
      "match_theme": "Segui tema",
      "alt_progress": "Barra progresso alternativa",
      "display_timestamps": "Mostra timestamp",
      "swap_pause_stop": "Sostituisci Pausa con Stop",
      "adaptive_controls": "Dimensione adattativa",
      "hide_active_entity": "Nascondi nome entità attiva",
      "collapse_on_idle": "Contrai in riposo",
      "hide_menu_player_toggle": "Nascondi lettore menu",
      "always_collapsed": "Sempre contratto",
      "expand_on_search": "Espandi alla ricerca",
      "script_var": "Variabile script (yamp_entity)",
      "use_ma_template": "Usa modello MA",
      "use_vol_template": "Usa modello Volume",
      "follow_active_entity": "Volume segue entità attiva",
      "use_url_path": "Usa URL o percorso",
      "adaptive_text_elements": "Elementi testo adattativo",
      "disable_auto_select": "Disattiva selezione automatica"
    },
    "fields": {
      "artwork_fit": "Adattamento",
      "artwork_position": "Posizione",
      "artwork_hostname": "Host",
      "match_field": "Campo",
      "match_value": "Valore",
      "size_percent": "Dimensione (%)",
      "object_fit": "Object Fit",
      "idle_timeout": "Riposo (ms)",
      "show_chip_row": "Mostra chip",
      "search_limit": "Limite ricerca",
      "result_sorting": "Ordine",
      "vol_step": "Passo volume",
      "card_height": "Altezza (px)",
      "control_layout": "Design",
      "save_service_data": "Salva",
      "image_url": "URL immagine",
      "fallback_image_url": "URL fallback",
      "move_to_main": "Sposta in chip principali",
      "move_to_menu": "Sposta nel menu",
      "delete_action": "Elimina azione",
      "revert_service_data": "Annulla modifiche",
      "test_action": "Prova azione",
      "volume_mode": "Modo volume",
      "idle_screen": "Schermo riposo",
      "name": "Nome",
      "hidden_controls": "Controlli nascosti",
      "ma_template": "Modello MA (Jinja)",
      "hidden_chips": "Chip nascosti",
      "vol_template": "Modello Volume (Jinja)",
      "icon": "Icona",
      "action_type": "Tipo azione",
      "menu_item": "Elemento menu",
      "nav_path": "Percorso",
      "service": "Servizio",
      "service_data": "Dati",
      "idle_image_entity": "Entità immagine riposo",
      "match_entity": "Entità",
      "ma_entity": "Entità Music Assistant",
      "vol_entity": "Entità di volume",
      "selected_entity_helper": "Helper entità selezionata",
      "sync_entity_type": "Tipo di entità da sincronizzare",
      "placement": "Posizionamento",
      "card_trigger": "Trigger della scheda",
      "search_view": "Vista risultati ricerca",
      "search_card_columns": "Colonne schede"
    },
    "action_types": {
      "menu": "Apri un elemento del menu",
      "service": "Chiama un servizio",
      "navigate": "Naviga",
      "sync_selected_entity": "Sincronizza entità selezionata"
    },
    "action_helpers": {
      "sync_selected_entity": "Sincronizza entità selezionata →",
      "select_helper": "(seleziona helper)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Entità Music Assistant se configurata)",
      "yamp_main_entity": "yamp_main_entity (Entità principale del lettore)",
      "yamp_playback_entity": "yamp_playback_entity (Entità di riproduzione attiva attuale)"
    },
    "placements": {
      "chip": "Chip d'azione",
      "menu": "Nel menu",
      "hidden": "Nascosto (Tocco sull'immagine)",
      "not_triggerable": "Non attivabile"
    },
    "triggers": {
      "none": "Nessuno",
      "tap": "Tocco",
      "hold": "Mantieni",
      "double_tap": "Doppio tocco",
      "swipe_left": "Scorri a sinistra",
      "swipe_right": "Scorri a destra"
    },
    "search_view_options": {
      "list": "Lista",
      "card": "Scheda"
    }
  },
  "card": {
    "sections": {
      "details": "Dettagli riproduzione",
      "menu": "Menu e Ricerca",
      "action_chips": "Chip azione"
    },
    "media_controls": {
      "shuffle": "Casuale",
      "previous": "Precedente",
      "play_pause": "Riproduci/Pausa",
      "stop": "Ferma",
      "next": "Successivo",
      "repeat": "Ripeti"
    },
    "menu": {
      "more_info": "Più info",
      "search": "Cerca",
      "source": "Sorgente",
      "transfer_queue": "Trasferisci coda",
      "group_players": "Raggruppa",
      "select_entity": "Seleziona",
      "transfer_to": "Trasferisci a",
      "no_players": "Senza lettori MA."
    },
    "grouping": {
      "title": "Raggruppa",
      "sync_volume": "Sincronizza volume",
      "group_all": "Raggruppa tutti",
      "ungroup_all": "Separa tutti",
      "unavailable": "Non disponibile",
      "no_players": "Non raggruppabile.",
      "master": "Master",
      "joined": "Unito",
      "available": "Disponibile",
      "current": "Attuale"
    }
  },
  "search": {
    "favorites": "Preferiti",
    "recently_played": "Recenti",
    "next_up": "A seguire",
    "recommendations": "Raccomandazioni",
    "radio_mode": "Modo Radio",
    "close": "Chiudi",
    "no_results": "Nessun risultato.",
    "play_next": "Riprod. successivo",
    "replace_play": "Sostituisci e riproduci",
    "replace": "Sostituisci coda",
    "add_queue": "Aggiungi alla fine",
    "move_up": "Sposta su",
    "move_down": "Sposta giù",
    "move_next": "Passa al successivo",
    "remove": "Rimuovi da coda",
    "added": "Aggiunto!",
    "labels": {
      "replace": "Sostituisci",
      "next": "Successivo",
      "replace_next": "Sost. succ.",
      "add": "Aggiungi"
    },
    "results": "risultati",
    "result": "risultato",
    "filters": {
      "all": "Tutto",
      "artist": "Artista",
      "album": "Album",
      "track": "Brano",
      "playlist": "Playlist",
      "radio": "Radio",
      "music": "Musica",
      "station": "Stazione",
      "podcast": "Podcast",
      "audiobook": "Audiolibro"
    },
    "search_artist": "Cerca questo artista"
  }
};

var nl = {
  "common": {
    "not_found": "Entiteit niet gevonden.",
    "search": "Zoeken",
    "power": "Aan/Uit",
    "favorite": "Favoriet",
    "loading": "Laden...",
    "no_results": "Geen resultaten.",
    "close": "Sluiten",
    "vol_up": "Volume Omhoog",
    "vol_down": "Volume Omlaag",
    "media_player": "Mediaspeler",
    "edit_entity": "Entiteitsinstellingen Bewerken",
    "edit_action": "Actie-instellingen Bewerken",
    "mute": "Dempen",
    "unmute": "Dempen opheffen",
    "seek": "Zoeken",
    "volume": "Volume",
    "play_now": "Nu Spelen",
    "more_options": "Meer Opties",
    "unavailable": "Niet beschikbaar",
    "back": "Terug",
    "cancel": "Annuleren",
    "reset_default": "Herstellen naar standaard"
  },
  "editor": {
    "tabs": {
      "entities": "Entiteiten",
      "behavior": "Gedrag",
      "look_and_feel": "Uiterlijk",
      "artwork": "Artwork",
      "actions": "Acties"
    },
    "placeholders": {
      "search": "Zoek muziek..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Algemene Instellingen",
          "description": "Globale instellingen voor hoe artwork wordt weergegeven en opgehaald."
        },
        "idle": {
          "title": "Artwork bij Inactiviteit",
          "description": "Toon een statische afbeelding of entiteits-snapshot wanneer er niets wordt afgespeeld."
        },
        "overrides": {
          "title": "Artwork Overschrijvingen",
          "description": "Overschrijvingen worden van boven naar beneden geëvalueerd. Sleep om te sorteren."
        }
      },
      "entities": {
        "title": "Entiteiten*",
        "description": "Voeg de mediaspelers toe die je wilt bedienen. Sleep entiteiten om de volgorde te wijzigen."
      },
      "behavior": {
        "idle_chips": {
          "title": "Inactiviteit & Chips",
          "description": "Kies wanneer de kaart inactief wordt en hoe entiteitschips zich gedragen."
        },
        "interactions_search": {
          "title": "Interacties & Zoeken",
          "description": "Verfijn hoe entiteiten worden vastgezet en hoeveel resultaten er tegelijk worden getoond."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Thema & Layout",
          "description": "Stem af op de styling van het dashboard en beheer de totale voetafdruk."
        },
        "controls_typography": {
          "title": "Bediening & Typografie",
          "description": "Pas knopgrootte, entiteitslabels en adaptieve tekst aan."
        },
        "collapsed_idle": {
          "title": "Ingeklapte & Inactieve Staten",
          "description": "Beheer wanneer de kaart inklapt en welke weergaven getoond worden bij inactiviteit."
        }
      },
      "actions": {
        "title": "Acties",
        "description": "Bouw de actiechips die in de kaart of het menu verschijnen. Sleep om te sorteren, klik op het potlood om te configureren."
      }
    },
    "subtitles": {
      "idle_timeout": "Tijd in milliseconden voordat de kaart naar de inactieve modus gaat. Stel in op 0 om inactiviteitsgedrag uit te schakelen.",
      "show_chip_row": "\"Auto\" verbergt de chiprij wanneer er slechts één entiteit is geconfigureerd. \"In Menu\" verplaatst de chips naar het menu-overlay. \"In menu bij inactiviteit\" toont chips inline wanneer actief maar verplaatst ze naar het menu wanneer inactief.",
      "dim_chips": "Wanneer de kaart inactief wordt met een afbeelding, dim dan de entiteits- en actiechips voor een strakker uiterlijk.",
      "hold_to_pin": "Houd entiteitschips lang ingedrukt in plaats van kort om ze vast te zetten, om automatisch schakelen tijdens afspelen te voorkomen.",
      "disable_autofocus": "Voorkom dat het zoekveld de focus steelt, zodat onscreen toetsenborden verborgen blijven.",
      "search_within_filter": "Schakel dit in om te zoeken binnen het huidige actieve filter (Favorieten, Recent Afgespeeld, etc) in plaats van dit te wissen.",
      "close_search_on_play": "Sluit het zoekscherm automatisch wanneer een nummer wordt afgespeeld.",
      "pin_search_headers": "Houd de zoekinvoer en filters bovenaan vast tijdens het scrollen door resultaten.",
      "hide_search_headers_on_idle": "Verberg zoekinvoer en filters wanneer inactief.",
      "disable_mass": "Schakel de optionele Mass Queue integratie uit, zelfs als deze is geïnstalleerd.",
      "swap_pause_stop": "Vervang de pauzeknop door stop bij gebruik van de moderne lay-out.",
      "adaptive_controls": "Laat de afspeelknoppen groeien of krimpen om in de beschikbare ruimte te passen.",
      "hide_menu_player": "Wanneer chips in het menu staan, verberg dan het entiteitslabel onderaan de kaart.",
      "adaptive_text": "Kies welke tekstgroepen moeten schalen met de beschikbare ruimte (laat leeg om adaptieve tekst uit te schakelen).",
      "collapse_expand": "Altijd Ingeklapt creëert de mini-spelermodus. Uitklappen bij Zoeken klapt tijdelijk uit tijdens het zoeken.",
      "idle_screen": "Kies welk scherm automatisch wordt weergegeven wanneer de kaart inactief wordt.",
      "hide_controls": "Selecteer welke knoppen je wilt verbergen voor deze entiteit (standaard worden ze allemaal getoond)",
      "hide_search_chips": "Verberg specifieke zoekfilterchips voor deze entiteit",
      "follow_active_entity": "Indien ingeschakeld, zal de volume-entiteit automatisch de actieve afspeel-entiteit volgen. Let op: dit overschrijft de geselecteerde volume-entiteit.",
      "search_limit_full": "Maximaal aantal zoekresultaten om weer te geven (1-1000, standaard: 20)",
      "default_search_filter_full": "Kies welk filter standaard actief is wanneer het zoekscherm wordt geopend.",
      "result_sorting_full": "Kies hoe zoekresultaten worden gesorteerd. Standaard behoudt de bronvolgorde.",
      "card_height_full": "Laat leeg voor automatische hoogte",
      "control_layout_full": "Kies tussen de oude gelijkmatig verdeelde knoppen of de moderne Home Assistant lay-out.",
      "artwork_extend": "Laat de artwork-achtergrond doorlopen onder de chip- en actierijen.",
      "artwork_extend_label": "Artwork uitbreiden",
      "no_artwork_overrides": "Geen artwork overschrijvingen geconfigureerd. Gebruik de plusknop hieronder om er een toe te voegen.",
      "entity_current_hint": "Gebruik 'entity_id: current' om de momenteel geselecteerde mediaspeler op de kaart te targeten. Let op: de 'Test Actie' knop wordt uitgeschakeld bij gebruik van deze functie.",
      "service_data_note": "Wijzigingen in de servicegegevens hieronder worden pas in de configuratie opgeslagen nadat op de knop 'Servicegegevens Opslaan' is geklikt!",
      "jinja_template_hint": "Voer een Jinja-sjabloon in dat resulteert in een enkele entity_id. Voorbeeld voor het wisselen van MA op basis van een bronselectie:",
      "jinja_template_vol_hint": "Voer een Jinja-sjabloon in dat resulteert in een entity_id (bijv. media_player.kantoor). Voorbeeld voor het wisselen van volume-entiteit op basis van een boolean:",
      "not_available_alt_collapsed": "Niet beschikbaar met Alternatieve Voortgangsbalk of Altijd Ingeklapte modus",
      "not_available_collapsed": "Niet beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",
      "only_available_collapsed": "Alleen beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",
      "only_available_modern": "Alleen beschikbaar met de Moderne lay-out",
      "image_url_helper": "Voer een directe URL naar een afbeelding of een lokaal bestandspad in",
      "selected_entity_helper": "Invoerteksthelper die wordt bijgewerkt met de momenteel geselecteerde media player-entiteits-ID.",
      "sync_entity_type": "Kies welk entiteits-ID moet worden gesynchroniseerd met de helper (standaard Music Assistant-entiteit indien geconfigureerd).",
      "disable_auto_select": "Voorkomt dat de chip van deze entiteit automatisch wordt geselecteerd wanneer deze begint af te spelen.",
      "search_view": "Kies tussen een standaardlijst of een raster van kaarten voor zoekresultaten.",
      "search_card_columns": "Geef aan hoeveel kolommen er gebruikt moeten worden in de kaartweergave. De afbeelding wordt automatisch aangepast."
    },
    "titles": {
      "edit_entity": "Entiteit Bewerken",
      "edit_action": "Actie Bewerken",
      "service_data": "Servicegegevens",
      "add_artwork_override": "Artwork Overschrijving Toevoegen"
    },
    "labels": {
      "dim_chips": "Chips dimmen bij inactiviteit",
      "hold_to_pin": "Ingedrukt houden om vast te zetten",
      "disable_autofocus": "Zoek-autofocus uitschakelen",
      "keep_filters": "Filters behouden bij zoeken",
      "dismiss_on_play": "Zoeken sluiten bij afspelen",
      "default_search_filter": "Standaard zoekfilter",
      "pin_headers": "Zoekkoppen vastzetten",
      "hide_search_headers_on_idle": "Zoekkoppen verbergen bij inactiviteit",
      "disable_mass": "Mass Queue uitschakelen",
      "match_theme": "Thema matchen",
      "alt_progress": "Alternatieve Voortgangsbalk",
      "display_timestamps": "Tijdstempels Weergeven",
      "swap_pause_stop": "Pauze vervangen door Stop",
      "adaptive_controls": "Adaptieve Knoppen Grootte",
      "hide_active_entity": "Label van Actieve Entiteit verbergen",
      "collapse_on_idle": "Inklappen bij inactiviteit",
      "hide_menu_player_toggle": "Menu-speler Verbergen",
      "always_collapsed": "Altijd Ingeklapt",
      "expand_on_search": "Uitklappen bij Zoeken",
      "script_var": "Script Variabele (yamp_entity)",
      "use_ma_template": "Sjabloon gebruiken voor Music Assistant Entiteit",
      "use_vol_template": "Sjabloon gebruiken voor Volume Entiteit",
      "follow_active_entity": "Volume Entiteit volgt Actieve Entiteit",
      "use_url_path": "URL of Pad gebruiken",
      "adaptive_text_elements": "Elementen voor Adaptieve Tekstgrootte",
      "disable_auto_select": "Auto-selectie uitschakelen"
    },
    "fields": {
      "artwork_fit": "Artwork Passend Maken",
      "artwork_position": "Artwork Positie",
      "artwork_hostname": "Artwork Hostnaam",
      "match_field": "Match Veld",
      "match_value": "Match Waarde",
      "size_percent": "Grootte (%)",
      "object_fit": "Object Fit",
      "idle_timeout": "Time-out voor Inactiviteit (ms)",
      "show_chip_row": "Chiprij Tonen",
      "search_limit": "Limiet Zoekresultaten",
      "result_sorting": "Sortering Resultaten",
      "vol_step": "Volume Stap (0.05 = 5%)",
      "card_height": "Kaarthoogte (px)",
      "control_layout": "Knoppen Lay-out",
      "save_service_data": "Servicegegevens Opslaan",
      "image_url": "Afbeelding URL",
      "fallback_image_url": "Fallback Afbeelding URL",
      "move_to_main": "Verplaats actie naar hoofdchips",
      "move_to_menu": "Verplaats actie naar menu",
      "delete_action": "Actie Verwijderen",
      "revert_service_data": "Terugzetten naar Opgeslagen Gegevens",
      "test_action": "Actie Testen",
      "volume_mode": "Volume Modus",
      "idle_screen": "Inactief Scherm",
      "name": "Naam",
      "hidden_controls": "Verborgen Knoppen",
      "ma_template": "Music Assistant Entiteit Sjabloon (Jinja)",
      "hidden_chips": "Verborgen Zoekfilterchips",
      "vol_template": "Volume Entiteit Sjabloon (Jinja)",
      "icon": "Icoon",
      "action_type": "Actietype",
      "menu_item": "Menu-item",
      "nav_path": "Navigatiepad",
      "service": "Service",
      "service_data": "Servicegegevens",
      "idle_image_entity": "Entiteit voor inactieve afbeelding",
      "match_entity": "Match Entiteit",
      "ma_entity": "Music Assistant-entiteit",
      "vol_entity": "Volume-entiteit",
      "selected_entity_helper": "Geselecteerde entiteitshelper",
      "sync_entity_type": "Synchronisatie entiteitstype",
      "placement": "Plaatsing",
      "card_trigger": "Kaart trigger",
      "search_view": "Zoekresultaten weergave",
      "search_card_columns": "Kaart kolommen"
    },
    "action_types": {
      "menu": "Open een kaartmenu-item",
      "service": "Roep een service aan",
      "navigate": "Navigeren",
      "sync_selected_entity": "Synchroniseer geselecteerde entiteit"
    },
    "action_helpers": {
      "sync_selected_entity": "Geselecteerde entiteit synchroniseren →",
      "select_helper": "(selecteer helper)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Music Assistant-entiteit indien geconfigureerd)",
      "yamp_main_entity": "yamp_main_entity (Hoofd media player-entiteit)",
      "yamp_playback_entity": "yamp_playback_entity (Huidige actieve afspeelentiteit)"
    },
    "placements": {
      "chip": "Actiechip",
      "menu": "In menu",
      "hidden": "Verborgen (Artwork-tik)",
      "not_triggerable": "Niet triggerbaar"
    },
    "triggers": {
      "none": "Geen",
      "tap": "Tik",
      "hold": "Vasthouden",
      "double_tap": "Dubbeltik",
      "swipe_left": "Veeg naar links",
      "swipe_right": "Veeg naar rechts"
    },
    "search_view_options": {
      "list": "Lijst",
      "card": "Kaart"
    }
  },
  "card": {
    "sections": {
      "details": "Details van 'Nu Spelen'",
      "menu": "Menu & Zoekschermen",
      "action_chips": "Actie Chips"
    },
    "media_controls": {
      "shuffle": "Shuffle",
      "previous": "Vorige",
      "play_pause": "Afspelen/Pauzeren",
      "stop": "Stop",
      "next": "Volgende",
      "repeat": "Herhalen"
    },
    "menu": {
      "more_info": "Meer Info",
      "search": "Zoeken",
      "source": "Bron",
      "transfer_queue": "Wachtrij Overdragen",
      "group_players": "Spelers Groeperen",
      "select_entity": "Selecteer Entiteit voor Meer Info",
      "transfer_to": "Wachtrij Overdragen Naar",
      "no_players": "Geen andere Music Assistant spelers beschikbaar."
    },
    "grouping": {
      "title": "Spelers Groeperen",
      "sync_volume": "Volume Synchroniseren",
      "group_all": "Alles Groeperen",
      "ungroup_all": "Alles Loskoppelen",
      "unavailable": "Speler is niet beschikbaar",
      "no_players": "Geen andere spelers beschikbaar die kunnen groeperen.",
      "master": "Master",
      "joined": "Gekoppeld",
      "available": "Beschikbaar",
      "current": "Huidig"
    }
  },
  "search": {
    "favorites": "Favorieten",
    "recently_played": "Recent Afgespeeld",
    "next_up": "Volgende",
    "recommendations": "Aanbevelingen",
    "radio_mode": "Radiomodus",
    "close": "Zoeken Sluiten",
    "no_results": "Geen resultaten.",
    "play_next": "Volgende afspelen",
    "replace_play": "Huidige wachtrij vervangen en nu afspelen",
    "replace": "Wachtrij vervangen",
    "add_queue": "Toevoegen aan einde van de wachtrij",
    "move_up": "Omhoog verplaatsen",
    "move_down": "Omlaag verplaatsen",
    "move_next": "Als volgende afspelen",
    "remove": "Verwijderen uit wachtrij",
    "added": "Toegevoegd aan wachtrij!",
    "labels": {
      "replace": "Vervangen",
      "next": "Volgende",
      "replace_next": "Vervang Volgende",
      "add": "Toevoegen"
    },
    "results": "resultaten",
    "result": "resultaat",
    "filters": {
      "all": "Alles",
      "artist": "Artiest",
      "album": "Album",
      "track": "Nummer",
      "playlist": "Afspeellijst",
      "radio": "Radio",
      "music": "Muziek",
      "station": "Zender",
      "podcast": "Podcast",
      "audiobook": "Luisterboek"
    },
    "search_artist": "Zoek naar deze artiest"
  }
};

var pt = {
  "common": {
    "not_found": "Entidade não encontrada.",
    "search": "Procurar",
    "power": "Ligar/Desligar",
    "favorite": "Favorito",
    "loading": "A carregar...",
    "no_results": "Sem resultados.",
    "close": "Fechar",
    "vol_up": "Aumentar volume",
    "vol_down": "Diminuir volume",
    "media_player": "Leitor multimédia",
    "edit_entity": "Editar definições da entidade",
    "edit_action": "Editar definições da ação",
    "mute": "Silenciar",
    "unmute": "Ativar som",
    "seek": "Procurar",
    "volume": "Volume",
    "play_now": "Reproduzir agora",
    "more_options": "Mais opções",
    "unavailable": "Indisponível",
    "back": "Voltar",
    "cancel": "Cancelar",
    "reset_default": "Repor predefinições"
  },
  "editor": {
    "tabs": {
      "entities": "Entidades",
      "behavior": "Comportamento",
      "look_and_feel": "Aspeto",
      "artwork": "Capa",
      "actions": "Ações"
    },
    "placeholders": {
      "search": "Procurar música..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Definições gerais",
          "description": "Controlos globais para a capa."
        },
        "idle": {
          "title": "Capa em repouso",
          "description": "Mostrar imagem estática quando nada toca."
        },
        "overrides": {
          "title": "Substituições de capa",
          "description": "As substituições são avaliadas de cima para baixo."
        }
      },
      "entities": {
        "title": "Entidades*",
        "description": "Adicione os leitores a controlar."
      },
      "behavior": {
        "idle_chips": {
          "title": "Repouso e chips",
          "description": "Escolha quando ir para repouso."
        },
        "interactions_search": {
          "title": "Interações e procura",
          "description": "Ajuste a fixação de entidades."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Tema e design",
          "description": "Combine com o estilo do dashboard."
        },
        "controls_typography": {
          "title": "Controlos e tipografia",
          "description": "Ajuste botões e etiquetas."
        },
        "collapsed_idle": {
          "title": "Estados contraído e repouso",
          "description": "Controle o contraído do cartão."
        }
      },
      "actions": {
        "title": "Ações",
        "description": "Crie chips de ação."
      }
    },
    "subtitles": {
      "idle_timeout": "Tempo antes de repouso (ms). 0 para desativar.",
      "show_chip_row": "\"Auto\" oculta a linha se houver apenas uma entidade. \"No menu\" move os chips. \"No menu em repouso\" mostra os chips em linha quando ativo mas move-os para o menu quando em repouso.",
      "dim_chips": "Escurecer chips em repouso para um aspeto mais limpo.",
      "hold_to_pin": "Manter premido para fixar em vez de toque curto.",
      "disable_autofocus": "Evitar que a procura tome o foco automaticamente.",
      "search_within_filter": "Procurar no filtro ativo (Favoritos, etc.).",
      "close_search_on_play": "Fechar procura ao reproduzir.",
      "pin_search_headers": "Fixar cabeçalhos de procura ao fazer scroll.",
      "hide_search_headers_on_idle": "Ocultar pesquisa e filtros quando inativo.",
      "disable_mass": "Desativar integração Mass Queue.",
      "swap_pause_stop": "Substituir pausa por stop no design moderno.",
      "adaptive_controls": "Permitir que os botões se adaptem ao espaço.",
      "hide_menu_player": "Ocultar nome da entidade quando no menu.",
      "adaptive_text": "Escolher que textos se adaptam ao espaço.",
      "collapse_expand": "Sempre contraído ativa modo mini. Expandir ao procurar expande temporariamente.",
      "idle_screen": "Escolher ecrã a mostrar em repouso.",
      "hide_controls": "Selecionar controlos a ocultar.",
      "hide_search_chips": "Ocultar chips de filtro de procura.",
      "follow_active_entity": "A entidade de volume seguirá a ativa.",
      "search_limit_full": "Máximo de resultados (1-1000, default: 20).",
      "default_search_filter_full": "Escolha qual filtro está ativo por padrão quando a tela de pesquisa é aberta.",
      "result_sorting_full": "Escolher ordem dos resultados.",
      "card_height_full": "Deixar vazio para altura automática.",
      "control_layout_full": "Escolher entre design antigo ou moderno.",
      "artwork_extend": "Estender capa sob os chips.",
      "artwork_extend_label": "Estender capa",
      "no_artwork_overrides": "Sem substituições de capa configuradas.",
      "entity_current_hint": "Use 'entity_id: current' para o leitor atual.",
      "service_data_note": "As alterações são guardadas ao premir 'Guardar'.",
      "jinja_template_hint": "Modelo Jinja para entity_id.",
      "jinja_template_vol_hint": "Modelo para entidade volume.",
      "not_available_alt_collapsed": "Não disponível em modo contraído.",
      "not_available_collapsed": "Não disponível se contraído.",
      "only_available_collapsed": "Apenas disponível se contraído.",
      "only_available_modern": "Apenas disponível com layout Moderno.",
      "image_url_helper": "Insira um URL direto para uma imagem ou um caminho de arquivo local",
      "selected_entity_helper": "Helper de texto de entrada que será atualizado com o ID da entidade do reprodutor de mídia selecionado no momento.",
      "sync_entity_type": "Escolha qual ID de entidade sincronizar com o helper (padrão entidade Music Assistant se configurada).",
      "disable_auto_select": "Impede que o chip desta entidade seja selecionado automaticamente quando a reprodução é iniciada.",
      "search_view": "Escolha entre uma lista padrão ou uma grade de cartões para os resultados da pesquisa.",
      "search_card_columns": "Especifique quantas colunas usar na visualização de cartões. A capa será redimensionada automaticamente."
    },
    "titles": {
      "edit_entity": "Editar entidade",
      "edit_action": "Editar ação",
      "service_data": "Dados do serviço",
      "add_artwork_override": "Adicionar substituição"
    },
    "labels": {
      "dim_chips": "Escurecer chips em repouso",
      "hold_to_pin": "Manter para fixar",
      "disable_autofocus": "Desativar autofoco",
      "keep_filters": "Manter filtros",
      "dismiss_on_play": "Fechar ao reproduzir",
      "default_search_filter": "Filtro de pesquisa padrão",
      "pin_headers": "Fixar cabeçalhos",
      "hide_search_headers_on_idle": "Ocultar cabeçalhos em inatividade",
      "disable_mass": "Desativar Mass Queue",
      "match_theme": "Seguir tema",
      "alt_progress": "Barra de progresso alternativa",
      "display_timestamps": "Mostrar carimbos de tempo",
      "swap_pause_stop": "Substituir Pausa por Stop",
      "adaptive_controls": "Tamanho adaptativo",
      "hide_active_entity": "Ocultar nome da entidade ativa",
      "collapse_on_idle": "Contrair em repouso",
      "hide_menu_player_toggle": "Ocultar leitor do menu",
      "always_collapsed": "Sempre contraído",
      "expand_on_search": "Expandir ao procurar",
      "script_var": "Variável script (yamp_entity)",
      "use_ma_template": "Usar modelo MA",
      "use_vol_template": "Usar modelo Volume",
      "follow_active_entity": "Volume segue a entidade ativa",
      "use_url_path": "Usar URL ou caminho",
      "adaptive_text_elements": "Elementos de texto adaptativo",
      "disable_auto_select": "Desativar seleção automática"
    },
    "fields": {
      "artwork_fit": "Ajuste",
      "artwork_position": "Posição",
      "artwork_hostname": "Host",
      "match_field": "Campo",
      "match_value": "Valor",
      "size_percent": "Tamanho (%)",
      "object_fit": "Object Fit",
      "idle_timeout": "Repouso (ms)",
      "show_chip_row": "Mostrar chips",
      "search_limit": "Limite de procura",
      "result_sorting": "Ordem",
      "vol_step": "Passo de volume",
      "card_height": "Altura (px)",
      "control_layout": "Design",
      "save_service_data": "Guardar",
      "image_url": "URL imagem",
      "fallback_image_url": "URL de reserva",
      "move_to_main": "Mover para chips principais",
      "move_to_menu": "Mover para o menu",
      "delete_action": "Eliminar ação",
      "revert_service_data": "Anular alterações",
      "test_action": "Testar ação",
      "volume_mode": "Modo volume",
      "idle_screen": "Ecrã de repouso",
      "name": "Nome",
      "hidden_controls": "Controlos ocultos",
      "ma_template": "Modelo MA (Jinja)",
      "hidden_chips": "Chips ocultos",
      "vol_template": "Modelo Volume (Jinja)",
      "icon": "Ícone",
      "action_type": "Tipo de ação",
      "menu_item": "Item de menu",
      "nav_path": "Caminho",
      "service": "Serviço",
      "service_data": "Dados",
      "idle_image_entity": "Entidade imagem repouso",
      "match_entity": "Entidade",
      "ma_entity": "Entidade Music Assistant",
      "vol_entity": "Entidade de volume",
      "selected_entity_helper": "Helper de entidade selecionada",
      "sync_entity_type": "Tipo de entidade a sincronizar",
      "placement": "Posicionamento",
      "card_trigger": "Gatilho do cartão",
      "search_view": "Vista de resultados de pesquisa",
      "search_card_columns": "Colunas de cartões"
    },
    "action_types": {
      "menu": "Abrir um item do menu",
      "service": "Chamar um serviço",
      "navigate": "Navegar",
      "sync_selected_entity": "Sincronizar entidade selecionada"
    },
    "action_helpers": {
      "sync_selected_entity": "Sincronizar entidade selecionada →",
      "select_helper": "(selecionar helper)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Entidade Music Assistant se configurada)",
      "yamp_main_entity": "yamp_main_entity (Entidade principal do reprodutor)",
      "yamp_playback_entity": "yamp_playback_entity (Entidade de reprodução ativa atual)"
    },
    "placements": {
      "chip": "Chip de ação",
      "menu": "No menu",
      "hidden": "Oculto (Toque no Artwork)",
      "not_triggerable": "Não acionável"
    },
    "triggers": {
      "none": "Nenhum",
      "tap": "Toque",
      "hold": "Manter premido",
      "double_tap": "Toque duplo",
      "swipe_left": "Deslizar para a esquerda",
      "swipe_right": "Deslizar para a direita"
    },
    "search_view_options": {
      "list": "Lista",
      "card": "Cartão"
    }
  },
  "card": {
    "sections": {
      "details": "Detalhes de reprodução",
      "menu": "Menu e Procura",
      "action_chips": "Chips de ação"
    },
    "media_controls": {
      "shuffle": "Aleatório",
      "previous": "Anterior",
      "play_pause": "Reproduzir/Pausa",
      "stop": "Parar",
      "next": "Seguinte",
      "repeat": "Repetir"
    },
    "menu": {
      "more_info": "Mais info",
      "search": "Procurar",
      "source": "Fonte",
      "transfer_queue": "Transferir fila",
      "group_players": "Agrupar",
      "select_entity": "Selecionar",
      "transfer_to": "Transferir para",
      "no_players": "Sem leitores MA."
    },
    "grouping": {
      "title": "Agrupar",
      "sync_volume": "Sincronizar volume",
      "group_all": "Agrupar todos",
      "ungroup_all": "Separar todos",
      "unavailable": "Indisponível",
      "no_players": "Não agrupável.",
      "master": "Mestre",
      "joined": "Unido",
      "available": "Disponível",
      "current": "Atual"
    }
  },
  "search": {
    "favorites": "Favoritos",
    "recently_played": "Recentes",
    "next_up": "A seguir",
    "recommendations": "Recomendações",
    "radio_mode": "Modo Rádio",
    "close": "Fechar",
    "no_results": "Sem resultados.",
    "play_next": "Reproduzir seguinte",
    "replace_play": "Substituir e reproduzir",
    "replace": "Substituir fila",
    "add_queue": "Adicionar ao fim",
    "move_up": "Subir",
    "move_down": "Descer",
    "move_next": "Passar para seguinte",
    "remove": "Remover da fila",
    "added": "Adicionado!",
    "labels": {
      "replace": "Substituir",
      "next": "Seguinte",
      "replace_next": "Subst. seg.",
      "add": "Adicionar"
    },
    "results": "resultados",
    "result": "resultado",
    "filters": {
      "all": "Tudo",
      "artist": "Artista",
      "album": "Álbum",
      "track": "Faixa",
      "playlist": "Lista",
      "radio": "Rádio",
      "music": "Música",
      "station": "Estação",
      "podcast": "Podcast",
      "audiobook": "Audiolivro"
    },
    "search_artist": "Procurar este artista"
  }
};

var sk = {
  "common": {
    "not_found": "Entita sa nenašla.",
    "search": "Hľadať",
    "power": "Napájanie",
    "favorite": "Obľúbené",
    "loading": "Načítava sa...",
    "no_results": "Žiadne výsledky.",
    "close": "Zatvoriť",
    "vol_up": "Zvýšiť hlasitosť",
    "vol_down": "Znížiť hlasitosť",
    "media_player": "Prehrávač médií",
    "edit_entity": "Upraviť nastavenia entity",
    "edit_action": "Upraviť nastavenia akcie",
    "mute": "Stlmiť",
    "unmute": "Zrušiť stlmenie",
    "seek": "Posunúť",
    "volume": "Hlasitosť",
    "play_now": "Prehrať teraz",
    "more_options": "Viac možností",
    "unavailable": "Nedostupné",
    "back": "Späť",
    "cancel": "Zrušiť",
    "reset_default": "Obnoviť predvolené"
  },
  "editor": {
    "tabs": {
      "entities": "Entity",
      "behavior": "Správanie",
      "look_and_feel": "Vzhľad a dojem",
      "artwork": "Grafika",
      "actions": "Akcie"
    },
    "placeholders": {
      "search": "Hľadať hudbu..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Všeobecné nastavenia",
          "description": "Globálne ovládanie toho, ako sa grafika zobrazuje a získava."
        },
        "idle": {
          "title": "Grafika pri nečinnosti",
          "description": "Zobraziť statický obrázok alebo snímku entity, keď sa nič neprehráva."
        },
        "overrides": {
          "title": "Prepísania grafiky",
          "description": "Prepísania sa vyhodnocujú zhora nadol. Poradie zmeníte potiahnutím."
        }
      },
      "entities": {
        "title": "Entity*",
        "description": "Pridajte prehrávače médií, ktoré chcete ovládať. Potiahnutím entít zmeníte poradie v riadku čipov."
      },
      "behavior": {
        "idle_chips": {
          "title": "Nečinnosť a čipy",
          "description": "Vyberte, kedy karta prejde do nečinnosti a ako sa správajú čipy entít."
        },
        "interactions_search": {
          "title": "Interakcie a hľadanie",
          "description": "Doladenie pripínania entít a počtu zobrazených výsledkov."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Téma a rozloženie",
          "description": "Prispôsobte štýl panelu a ovládajte celkový vzhľad."
        },
        "controls_typography": {
          "title": "Ovládanie a typografia",
          "description": "Nastavenie veľkosti tlačidiel, štítkov entít a adaptívneho textu."
        },
        "collapsed_idle": {
          "title": "Zbalené stavy a nečinnosť",
          "description": "Ovládajte, kedy sa karta zbalí a ktoré zobrazenia sa ukážu počas nečinnosti."
        }
      },
      "actions": {
        "title": "Akcie",
        "description": "Vytvorte akčné čipy, ktoré sa zobrazia na karte alebo v jej menu. Potiahnutím zmeníte poradie, kliknutím na ceruzku akciu nakonfigurujete."
      }
    },
    "subtitles": {
      "idle_timeout": "Čas v milisekundách, kým karta prejde do režimu nečinnosti. Nastavte na 0 pre vypnutie.",
      "show_chip_row": "\"Auto\" skryje riadok čipov, ak je nakonfigurovaná len jedna entita. \"V menu\" presunie čipy do ponuky menu. \"V menu pri nečinnosti\" zobrazí čipy v riadku keď je aktívne, ale presunie ich do menu pri nečinnosti.",
      "dim_chips": "Keď karta prejde do režimu nečinnosti s obrázkom, stlmte čipy entít a akcií pre čistejší vzhľad.",
      "hold_to_pin": "Dlhým stlačením čipov entít ich pripnete, čím zabránite automatickému prepínaniu počas prehrávania.",
      "disable_autofocus": "Zabráni vyhľadávaciemu poľu prebrať zameranie, aby zostali klávesnice na obrazovke skryté.",
      "search_within_filter": "Povoliť vyhľadávanie v rámci aktuálneho aktívneho filtra (Obľúbené, Nedávno prehrávané atď.) namiesto jeho vymazania.",
      "close_search_on_play": "Automaticky zatvoriť obrazovku vyhľadávania po spustení skladby.",
      "pin_search_headers": "Ponechať pole vyhľadávania a filtre pevne navrchu počas posúvania výsledkov.",
      "hide_search_headers_on_idle": "Skryť vyhľadávanie a filtre, keď je prehrávač nečinný.",
      "disable_mass": "Deaktivovať voliteľnú integráciu Mass Queue, aj keď je nainštalovaná.",
      "swap_pause_stop": "Nahradiť tlačidlo pauzy tlačidlom zastavenia pri použití moderného rozloženia.",
      "adaptive_controls": "Umožniť tlačidlám prehrávania meniť veľkosť podľa dostupného priestoru.",
      "hide_menu_player": "Keď sú čipy v menu, skryť názov entity v spodnej časti karty.",
      "adaptive_text": "Vyberte skupiny textu, ktoré sa majú škálovať podľa priestoru (nechajte prázdne pre vypnutie).",
      "collapse_expand": "\"Vždy zbalené\" vytvorí režim mini prehrávača. \"Rozbaliť pri hľadaní\" kartu dočasne rozbalí pri vyhľadávaní.",
      "idle_screen": "Vyberte obrazovku, ktorá sa má automaticky zobraziť v režime nečinnosti.",
      "hide_controls": "Vyberte ovládacie prvky, ktoré chcete pre túto entitu skryť (štandardne sú zobrazené všetky).",
      "hide_search_chips": "Skryť konkrétne čipy filtra vyhľadávania pre túto entitu.",
      "follow_active_entity": "Ak je povolené, entita hlasitosti bude automaticky sledovať aktívny prehrávač. Poznámka: Toto prepíše vybranú entitu hlasitosti.",
      "search_limit_full": "Maximálny počet výsledkov vyhľadávania (1-1000, predvolené: 20).",
      "default_search_filter_full": "Vyberte, ktorý filter bude predvolene aktívny pri otvorení vyhľadávania.",
      "result_sorting_full": "Vyberte spôsob zoradenia výsledkov. Predvolené ponecháva poradie zo zdroja.",
      "card_height_full": "Nechajte prázdne pre automatickú výšku.",
      "control_layout_full": "Vyberte si medzi starším (rovnako veľké prvky) alebo moderným rozložením Home Assistant.",
      "artwork_extend": "Umožniť pozadiu grafiky pokračovať pod riadkami čipov a akcií.",
      "artwork_extend_label": "Rozšíriť grafiku",
      "no_artwork_overrides": "Nie sú nastavené žiadne prepísania grafiky. Pridajte ich pomocou tlačidla plus.",
      "entity_current_hint": "Použite 'entity_id: current' na zacielenie aktuálne vybranej entity na karte. Poznámka: Tlačidlo 'Testovať akciu' bude v tomto prípade neaktívne.",
      "service_data_note": "Zmeny v servisných údajoch sa neuložia, kým nekliknete na tlačidlo 'Uložiť servisné údaje'!",
      "jinja_template_hint": "Zadajte Jinja šablónu, ktorá vráti jedno entity_id. Príklad prepínania MA na základe výberu zdroja:",
      "jinja_template_vol_hint": "Zadajte Jinja šablónu, ktorá vráti entity_id (napr. media_player.obyvacka). Príklad prepínania hlasitosti podľa stavu:",
      "not_available_alt_collapsed": "Nedostupné s alternatívnym indikátorom priebehu alebo v režime Vždy zbalené.",
      "not_available_collapsed": "Nedostupné, keď je zapnuté Vždy zbalené.",
      "only_available_collapsed": "Dostupné len pri zapnutom režime Vždy zbalené.",
      "only_available_modern": "Dostupné len s moderným rozložením.",
      "image_url_helper": "Zadajte priamu URL na obrázok alebo lokálnu cestu k súboru",
      "selected_entity_helper": "Pomocník pre vstupný text, ktorý bude aktualizovaný o ID aktuálne vybranej entity prehrávača médií.",
      "sync_entity_type": "Vyberte, ktoré ID entity sa má synchronizovať s pomocníkom (predvolene entita Music Assistant, ak je nakonfigurovaná).",
      "disable_auto_select": "Zabráni automatickému výberu čipu tejto entity pri spustení prehrávania.",
      "search_view": "Vyberte si medzi štandardným zoznamom alebo mriežkou kariet pre výsledky vyhľadávania.",
      "search_card_columns": "Zadajte, koľko stĺpcov sa má použiť v zobrazení karty. Grafika sa automaticky prispôsobí."
    },
    "titles": {
      "edit_entity": "Upraviť entitu",
      "edit_action": "Upraviť akciu",
      "service_data": "Servisné údaje",
      "add_artwork_override": "Pridať prepísanie grafiky"
    },
    "labels": {
      "dim_chips": "Stlmiť čipy pri nečinnosti",
      "hold_to_pin": "Podržať pre pripnutie",
      "disable_autofocus": "Vypnúť automatické zameranie hľadania",
      "keep_filters": "Zachovať filtre pri hľadaní",
      "dismiss_on_play": "Zavrieť hľadanie po spustení",
      "default_search_filter": "Predvolený filter vyhľadávania",
      "pin_headers": "Pripnúť hlavičky hľadania",
      "hide_search_headers_on_idle": "Skryť hlavičky pri nečinnosti",
      "disable_mass": "Deaktivovať Mass Queue",
      "match_theme": "Podľa témy",
      "alt_progress": "Alternatívny indikátor priebehu",
      "display_timestamps": "Zobraziť časové údaje",
      "swap_pause_stop": "Vymeniť pauzu za stop",
      "adaptive_controls": "Adaptívna veľkosť ovládania",
      "hide_active_entity": "Skryť štítok aktívnej entity",
      "collapse_on_idle": "Zbaliť pri nečinnosti",
      "hide_menu_player_toggle": "Skryť prehrávač v menu",
      "always_collapsed": "Vždy zbalené",
      "expand_on_search": "Rozbaliť pri hľadaní",
      "script_var": "Premenná skriptu (yamp_entity)",
      "use_ma_template": "Použiť šablónu pre Music Assistant",
      "use_vol_template": "Použiť šablónu pre entitu hlasitosti",
      "follow_active_entity": "Hlasitosť sleduje aktívnu entitu",
      "use_url_path": "Použiť URL alebo cestu",
      "adaptive_text_elements": "Prvky s adaptívnou veľkosťou textu",
      "disable_auto_select": "Zakázať automatický výber"
    },
    "fields": {
      "artwork_fit": "Prispôsobenie grafiky",
      "artwork_position": "Pozícia grafiky",
      "artwork_hostname": "Hostname pre grafiku",
      "match_field": "Pole pre zhodu",
      "match_value": "Hodnota pre zhodu",
      "size_percent": "Veľkosť (%)",
      "object_fit": "Prispôsobenie objektu (Fit)",
      "idle_timeout": "Čas nečinnosti (ms)",
      "show_chip_row": "Zobraziť riadok čipov",
      "search_limit": "Limit výsledkov hľadania",
      "result_sorting": "Zoradenie výsledkov",
      "vol_step": "Krok hlasitosti (0.05 = 5%)",
      "card_height": "Výška karty (px)",
      "control_layout": "Rozloženie ovládania",
      "save_service_data": "Uložiť servisné údaje",
      "image_url": "URL obrázka",
      "fallback_image_url": "Záložná URL obrázka",
      "move_to_main": "Presunúť do hlavných čipov",
      "move_to_menu": "Presunúť do menu",
      "delete_action": "Vymazať akciu",
      "revert_service_data": "Vrátiť uložené servisné údaje",
      "test_action": "Testovať akciu",
      "volume_mode": "Režim hlasitosti",
      "idle_screen": "Obrazovka pri nečinnosti",
      "name": "Názov",
      "hidden_controls": "Skryté ovládacie prvky",
      "ma_template": "Jinja šablóna pre Music Assistant",
      "hidden_chips": "Skryté čipy filtrov hľadania",
      "vol_template": "Jinja šablóna pre hlasitosť",
      "icon": "Ikona",
      "action_type": "Typ akcie",
      "menu_item": "Položka menu",
      "nav_path": "Cesta navigácie",
      "service": "Služba",
      "service_data": "Servisné údaje",
      "idle_image_entity": "Entita obrázka pri nečinnosti",
      "match_entity": "Entita pre zhodu",
      "ma_entity": "Entita Music Assistant",
      "vol_entity": "Entita hlasitosti",
      "selected_entity_helper": "Pomocník vybratej entity",
      "sync_entity_type": "Typ entity na synchronizáciu",
      "placement": "Umiestnenie",
      "card_trigger": "Spúšťač karty",
      "search_view": "Zobrazenie výsledkov vyhľadávania",
      "search_card_columns": "Stĺpce karty"
    },
    "action_types": {
      "menu": "Otvoriť položku menu karty",
      "service": "Zavolať službu",
      "navigate": "Navigovať",
      "sync_selected_entity": "Synchronizovať vybranú entitu"
    },
    "action_helpers": {
      "sync_selected_entity": "Synchronizovať vybranú entitu →",
      "select_helper": "(vybrať pomocníka)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (Entita Music Assistant, ak je nakonfigurovaná)",
      "yamp_main_entity": "yamp_main_entity (Hlavná entita prehrávača médií)",
      "yamp_playback_entity": "yamp_playback_entity (Aktuálna aktívna entita prehrávania)"
    },
    "placements": {
      "chip": "Akčný čip",
      "menu": "V menu",
      "hidden": "Skryté (Ťuknutie na grafiku)",
      "not_triggerable": "Nespustiteľné"
    },
    "triggers": {
      "none": "Žiadny",
      "tap": "Ťuknutie",
      "hold": "Podržanie",
      "double_tap": "Dvojité ťuknutie",
      "swipe_left": "Potiahnutie doľava",
      "swipe_right": "Potiahnutie doprava"
    },
    "search_view_options": {
      "list": "Zoznam",
      "card": "Karta"
    }
  },
  "card": {
    "sections": {
      "details": "Detaily prehrávania",
      "menu": "Menu a vyhľadávanie",
      "action_chips": "Akčné čipy"
    },
    "media_controls": {
      "shuffle": "Náhodne",
      "previous": "Predchádzajúce",
      "play_pause": "Prehrať/Pozastaviť",
      "stop": "Zastaviť",
      "next": "Nasledujúce",
      "repeat": "Opakovať"
    },
    "menu": {
      "more_info": "Viac informácií",
      "search": "Hľadať",
      "source": "Zdroj",
      "transfer_queue": "Presunúť frontu",
      "group_players": "Zoskupiť prehrávače",
      "select_entity": "Vyberte entitu pre viac info",
      "transfer_to": "Presunúť frontu do",
      "no_players": "Žiadne iné prehrávače Music Assistant nie sú k dispozícii."
    },
    "grouping": {
      "title": "Zoskupiť prehrávače",
      "sync_volume": "Synchronizovať hlasitosť",
      "group_all": "Zoskupiť všetko",
      "ungroup_all": "Zrušiť zoskupenie všetkého",
      "unavailable": "Prehrávač je nedostupný",
      "no_players": "Žiadne iné prehrávače schopné zoskupenia nie sú k dispozícii.",
      "master": "Hlavný (Master)",
      "joined": "Pripojený",
      "available": "Dostupný",
      "current": "Aktuálny"
    }
  },
  "search": {
    "favorites": "Obľúbené",
    "recently_played": "Nedávno prehrávané",
    "next_up": "Nasledujúce",
    "recommendations": "Odporúčania",
    "radio_mode": "Režim rádio",
    "close": "Zatvoriť vyhľadávanie",
    "no_results": "Žiadne výsledky.",
    "play_next": "Prehrať ako nasledujúce",
    "replace_play": "Nahradiť frontu a prehrať teraz",
    "replace": "Nahradiť frontu",
    "add_queue": "Pridať na koniec fronty",
    "move_up": "Posunúť nahor",
    "move_down": "Posunúť nadol",
    "move_next": "Presunúť na nasledujúce",
    "remove": "Odstrániť z fronty",
    "added": "Pridané do fronty!",
    "labels": {
      "replace": "Nahradiť",
      "next": "Nasledujúce",
      "replace_next": "Nahradiť nasledujúce",
      "add": "Pridať"
    },
    "results": "výsledkov",
    "result": "výsledok",
    "filters": {
      "all": "Všetko",
      "artist": "Interpret",
      "album": "Album",
      "track": "Skladba",
      "playlist": "Playlist",
      "radio": "Rádio",
      "music": "Hudba",
      "station": "Stanica",
      "podcast": "Podcast",
      "audiobook": "Audiokniha"
    },
    "search_artist": "Hľadať tohto interpreta"
  }
};

var sl = {
  "common": {
    "not_found": "Entiteta ni najdena.",
    "search": "Išči",
    "power": "Napajanje",
    "favorite": "Priljubljeno",
    "loading": "Nalaganje...",
    "no_results": "Ni rezultatov.",
    "close": "Zapri",
    "vol_up": "Povečaj glasnost",
    "vol_down": "Zmanjšaj glasnost",
    "media_player": "Predvajalnik predstavnosti",
    "edit_entity": "Uredi nastavitve entitete",
    "edit_action": "Uredi nastavitve dejanja",
    "mute": "Utišaj",
    "unmute": "Vklopi zvok",
    "seek": "Previj",
    "volume": "Glasnost",
    "play_now": "Predvajaj zdaj",
    "more_options": "Več možnosti",
    "unavailable": "Ni na voljo",
    "back": "Nazaj",
    "cancel": "Prekliči",
    "reset_default": "Ponastavi na privzeto"
  },
  "editor": {
    "tabs": {
      "entities": "Entitete",
      "behavior": "Vedenje",
      "look_and_feel": "Videz in občutek",
      "artwork": "Grafika",
      "actions": "Dejanja"
    },
    "placeholders": {
      "search": "Išči glasbo..."
    },
    "sections": {
      "artwork": {
        "general": {
          "title": "Splošne nastavitve",
          "description": "Globalni nadzor nad prikazom in pridobivanjem grafike."
        },
        "idle": {
          "title": "Grafika v mirovanju",
          "description": "Prikaži statično sliko ali posnetek entitete, ko se nič ne predvaja."
        },
        "overrides": {
          "title": "Prepis grafike",
          "description": "Prepisi se ocenjujejo od zgoraj navzdol. Povlecite za spremembo vrstnega reda."
        }
      },
      "entities": {
        "title": "Entitete*",
        "description": "Dodajte predvajalnike, ki jih želite upravljati. Povlecite entitete za spremembo vrstnega reda."
      },
      "behavior": {
        "idle_chips": {
          "title": "Mirovanje in čipi",
          "description": "Izberite, kdaj kartica preide v mirovanje in kako se obnašajo čipi entitet."
        },
        "interactions_search": {
          "title": "Interakcije in iskanje",
          "description": "Nastavite pripenjanje entitet in število prikazanih rezultatov."
        }
      },
      "look_and_feel": {
        "theme_layout": {
          "title": "Tema in postavitev",
          "description": "Ujemanje s slogom nadzorne plošče in nadzor velikosti."
        },
        "controls_typography": {
          "title": "Kontrolniki in tipografija",
          "description": "Prilagodite velikost gumbov, oznake entitet in prilagodljivo besedilo."
        },
        "collapsed_idle": {
          "title": "Strnjeno in mirovanje",
          "description": "Nadzorujte, kdaj se kartica skrči in kaj se prikaže v mirovanju."
        }
      },
      "actions": {
        "title": "Dejanja",
        "description": "Ustvarite čipe dejanj, ki se prikažejo na kartici ali v meniju."
      }
    },
    "subtitles": {
      "idle_timeout": "Čas v milisekundah, preden kartica preide v mirovanje. Nastavite na 0 za izklop.",
      "show_chip_row": "\"Samodejno\" skrije čipe, če je nastavljena ena entiteta. \"V meniju\" jih premakne v meni. \"V meniju med nedejavnostjo\" prikaže čipe v vrstici, ko je aktivna, a jih premakne v meni med nedejavnostjo.",
      "dim_chips": "Ko kartica preide v mirovanje s sliko, se čipi zatemnijo.",
      "hold_to_pin": "Dolgi pritisk za pripenjanje entitet namesto kratkega.",
      "disable_autofocus": "Prepreči samodejni fokus iskalnega polja.",
      "search_within_filter": "Išči znotraj trenutnega filtra.",
      "close_search_on_play": "Samodejno zapri iskanje ob predvajanju.",
      "pin_search_headers": "Pripni iskalno polje in filtre na vrh.",
      "hide_search_headers_on_idle": "Skrij iskalno polje in filtre med mirovanjem.",
      "disable_mass": "Onemogoči integracijo Mass Queue.",
      "swap_pause_stop": "Zamenjaj gumb pavze z gumbom zaustavitve med uporabo moderne postavitve.",
      "adaptive_controls": "Prilagodi velikost gumbov glede na prostor.",
      "hide_menu_player": "Skrij oznako entitete v meniju.",
      "adaptive_text": "Izberi skupine besedila za prilagajanje velikosti.",
      "collapse_expand": "Vedno skrčeno ustvari mini predvajalnik.",
      "idle_screen": "Izberi zaslon, prikazan v mirovanju.",
      "hide_controls": "Izberi kontrolnike za skrivanje.",
      "hide_search_chips": "Skrij določene iskalne filtre.",
      "follow_active_entity": "Entiteta glasnosti sledi aktivni entiteti. Opomba: To prepiše izbrano entiteto za glasnost.",
      "search_limit_full": "Največje število rezultatov (1–1000, privzeto: 20).",
      "default_search_filter_full": "Izberite, kateri filter je privzeto aktiven ob odprtju iskanja.",
      "result_sorting_full": "Izberi razvrščanje rezultatov.",
      "card_height_full": "Pustite prazno za samodejno višino.",
      "control_layout_full": "Izberi med staro in moderno postavitvijo.",
      "artwork_extend": "Razširi ozadje grafike pod čipe.",
      "artwork_extend_label": "Razširi grafiko",
      "no_artwork_overrides": "Ni nastavljenih prepisov grafike.",
      "entity_current_hint": "Uporabi entity_id: current za trenutno izbrano entiteto.",
      "service_data_note": "Spremembe se shranijo šele ob kliku na ikono shrani.",
      "jinja_template_hint": "Vnesite Jinja predlogo, ki vrne en entity_id.",
      "jinja_template_vol_hint": "Vnesite Jinja predlogo za entiteto glasnosti.",
      "not_available_alt_collapsed": "Ni na voljo z alternativno vrstico napredka.",
      "not_available_collapsed": "Ni na voljo v vedno skrčenem načinu.",
      "only_available_collapsed": "Na voljo le v vedno skrčenem načinu.",
      "only_available_modern": "Na voljo le v moderni postavitvi.",
      "image_url_helper": "Vnesite neposredni URL do slike ali lokalno pot do datoteke",
      "selected_entity_helper": "Pomočnik za vnos besedila, ki bo posodobljen z ID-jem trenutno izbranega predvajalnika medijev.",
      "sync_entity_type": "Izberite, kateri ID entitete želite sinhronizirati s pomočnikom (privzeto entiteto Music Assistant, če je nastavljena).",
      "disable_auto_select": "Prepreči samodejno izbiro čipa te entitete ob začetku predvajanja.",
      "search_view": "Izberite med standardnim seznamom ali mrežo kartic za rezultate iskanja.",
      "search_card_columns": "Določite število stolpcev v pogledu kartic. Grafika se bo samodejno prilagodila."
    },
    "titles": {
      "edit_entity": "Uredi entiteto",
      "edit_action": "Uredi dejanje",
      "service_data": "Podatki storitve",
      "add_artwork_override": "Dodaj prepis grafike"
    },
    "labels": {
      "dim_chips": "Zatemni čipe v mirovanju",
      "hold_to_pin": "Drži za pripenjanje",
      "disable_autofocus": "Onemogoči samodejni fokus",
      "keep_filters": "Ohrani filtre",
      "dismiss_on_play": "Zapri iskanje ob predvajanju",
      "default_search_filter": "Privzeti iskalni filter",
      "pin_headers": "Pripni glave iskanja",
      "hide_search_headers_on_idle": "Skrij glave iskanja med mirovanjem",
      "disable_mass": "Onemogoči Mass Queue",
      "match_theme": "Ujemaj temo",
      "alt_progress": "Alternativna vrstica napredka",
      "display_timestamps": "Prikaži časovne oznake",
      "swap_pause_stop": "Zamenjaj pavzo z zaustavitvijo",
      "adaptive_controls": "Prilagodljiva velikost gumbov",
      "hide_active_entity": "Skrij oznako aktivne entitete",
      "collapse_on_idle": "Skrči v mirovanju",
      "hide_menu_player_toggle": "Skrij predvajalnik v meniju",
      "always_collapsed": "Vedno skrčeno",
      "expand_on_search": "Razširi ob iskanju",
      "script_var": "Skriptna spremenljivka",
      "use_ma_template": "Uporabi predlogo za entiteto Music Assistant",
      "use_vol_template": "Uporabi predlogo za glasnost",
      "follow_active_entity": "Glasnost sledi aktivni entiteti",
      "use_url_path": "Uporabi URL ali pot",
      "adaptive_text_elements": "Elementi prilagodljive velikosti besedila",
      "disable_auto_select": "Onemogoči samodejno izbiro"
    },
    "fields": {
      "artwork_fit": "Prileganje grafike",
      "artwork_position": "Položaj grafike",
      "artwork_hostname": "Ime gostitelja grafike",
      "match_field": "Polje ujemanja",
      "match_value": "Vrednost ujemanja",
      "size_percent": "Velikost (%)",
      "object_fit": "Prileganje objekta",
      "idle_timeout": "Čas mirovanja (ms)",
      "show_chip_row": "Prikaži vrstico čipov",
      "search_limit": "Omejitev rezultatov iskanja",
      "result_sorting": "Razvrščanje rezultatov",
      "vol_step": "Korak glasnosti (0.05 = 5 %)",
      "card_height": "Višina kartice (px)",
      "control_layout": "Postavitev kontrolnikov",
      "save_service_data": "Shrani podatke storitve",
      "image_url": "URL slike",
      "fallback_image_url": "Rezervni URL slike",
      "move_to_main": "Premakni dejanje na glavno vrstico",
      "move_to_menu": "Premakni dejanje v meni",
      "delete_action": "Izbriši dejanje",
      "revert_service_data": "Povrni shranjene podatke",
      "test_action": "Preizkusi dejanje",
      "volume_mode": "Način glasnosti",
      "idle_screen": "Zaslon v mirovanju",
      "name": "Ime",
      "hidden_controls": "Skriti kontrolniki",
      "ma_template": "Predloga Music Assistant (Jinja)",
      "hidden_chips": "Skriti iskalni čipi",
      "vol_template": "Predloga entitete glasnosti (Jinja)",
      "icon": "Ikona",
      "action_type": "Vrsta dejanja",
      "menu_item": "Element menija",
      "nav_path": "Navigacijska pot",
      "service": "Storitev",
      "service_data": "Podatki storitve",
      "idle_image_entity": "Entiteta slike v mirovanju",
      "match_entity": "Ujemajoča entiteta",
      "ma_entity": "Entiteta Music Assistant",
      "vol_entity": "Entiteta glasnosti",
      "selected_entity_helper": "Pomočnik izbrane entitete",
      "sync_entity_type": "Vrsta entitete za sinhronizacijo",
      "placement": "Namestitev",
      "card_trigger": "Sprožilec kartice",
      "search_view": "Pogled rezultatov iskanja",
      "search_card_columns": "Stolpci kartic"
    },
    "action_types": {
      "menu": "Odpri element menija kartice",
      "service": "Pokliči storitev",
      "navigate": "Navigiraj",
      "sync_selected_entity": "Sinhroniziraj izbrano entiteto"
    },
    "action_helpers": {
      "sync_selected_entity": "Sinhroniziraj izbrano entiteto →",
      "select_helper": "(izberite pomočnika)"
    },
    "sync_entity_options": {
      "yamp_entity": "yamp_entity (entiteta Music Assistant, če je nastavljena)",
      "yamp_main_entity": "yamp_main_entity (glavna entiteta predvajalnika medijev)",
      "yamp_playback_entity": "yamp_playback_entity (trenutno aktivna entitea predvajanja)"
    },
    "placements": {
      "chip": "Čip dejanja",
      "menu": "V meniju",
      "hidden": "Skrito (dotik grafike)",
      "not_triggerable": "Ni mogoče sprožiti"
    },
    "triggers": {
      "none": "Brez",
      "tap": "Dotik",
      "hold": "Pridržanje",
      "double_tap": "Dvojni dotik",
      "swipe_left": "Podrsaj levo",
      "swipe_right": "Podrsaj desno"
    },
    "search_view_options": {
      "list": "Seznam",
      "card": "Kartica"
    }
  },
  "card": {
    "sections": {
      "details": "Podrobnosti predvajanja",
      "menu": "Meni in iskanje",
      "action_chips": "Čipi dejanj"
    },
    "media_controls": {
      "shuffle": "Naključno",
      "previous": "Prejšnje",
      "play_pause": "Predvajaj/Pavza",
      "stop": "Ustavi",
      "next": "Naslednje",
      "repeat": "Ponovi"
    },
    "menu": {
      "more_info": "Več informacij",
      "search": "Išči",
      "source": "Vir",
      "transfer_queue": "Prenesi čakalno vrsto",
      "group_players": "Združi predvajalnike",
      "select_entity": "Izberi entiteto za več informacij",
      "transfer_to": "Prenesi čakalno vrsto na",
      "no_players": "Ni drugih razpoložljivih predvajalnikov Music Assistant."
    },
    "grouping": {
      "title": "Združi predvajalnike",
      "sync_volume": "Sinhroniziraj glasnost",
      "group_all": "Združi vse",
      "ungroup_all": "Razdruži vse",
      "unavailable": "Predvajalnik ni na voljo",
      "no_players": "Ni drugih predvajalnikov za združevanje.",
      "master": "Glavni",
      "joined": "Pridružen",
      "available": "Na voljo",
      "current": "Trenutni"
    }
  },
  "search": {
    "favorites": "Priljubljeni",
    "recently_played": "Nedavno predvajano",
    "next_up": "Naslednje",
    "recommendations": "Priporočila",
    "radio_mode": "Radijski način",
    "close": "Zapri iskanje",
    "no_results": "Ni rezultatov.",
    "play_next": "Predvajaj naslednje",
    "replace_play": "Zamenjaj čakalno vrsto in predvajaj",
    "replace": "Zamenjaj čakalno vrsto",
    "add_queue": "Dodaj na konec čakalne vrste",
    "move_up": "Premakni gor",
    "move_down": "Premakni dol",
    "move_next": "Premakni na naslednje",
    "remove": "Odstrani iz čakalne vrste",
    "added": "Dodano v čakalno vrsto!",
    "labels": {
      "replace": "Zamenjaj",
      "next": "Naslednje",
      "replace_next": "Zamenjaj naslednje",
      "add": "Dodaj"
    },
    "results": "rezultati",
    "result": "rezultat",
    "filters": {
      "all": "Vse",
      "artist": "Izvajalec",
      "album": "Album",
      "track": "Skladba",
      "playlist": "Seznam predvajanja",
      "radio": "Radio",
      "music": "Glasba",
      "station": "Postaja",
      "podcast": "Podcast",
      "audiobook": "Zvočna knjiga"
    },
    "search_artist": "Išči tega izvajalca"
  }
};

const languages = {
  en,
  de,
  es,
  fr,
  it,
  nl,
  pt,
  sk,
  sl
};
function localize(string) {
  let search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  const rawLang = (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');
  const lang = languages[rawLang] ? rawLang : rawLang.split('_')[0];
  let translated;
  const parts = string.split('.');
  const traverse = (obj, path) => {
    try {
      return path.reduce((o, i) => o && o[i] !== undefined ? o[i] : undefined, obj);
    } catch (e) {
      return undefined;
    }
  };
  translated = traverse(languages[lang], parts);
  if (translated === undefined && lang !== 'en') {
    translated = traverse(languages['en'], parts);
  }
  if (translated === undefined) {
    translated = string;
  }
  if (typeof translated !== 'string') {
    translated = string;
  }
  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}

// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
function renderControlsRow(_ref) {
  let {
    stateObj,
    showStop,
    shuffleActive,
    repeatActive,
    onControlClick,
    supportsFeature,
    showFavorite,
    favoriteActive,
    hiddenControls = {},
    adaptiveControls = false,
    controlLayout = "classic",
    swapPauseForStop = false
  } = _ref;
  if (!stateObj) return E;

  // NOTE: If any new controls are added or removed here, the dropdown options 
  // in src/yamp-editor.js must also be updated to match, and the README.md
  // documentation in the "Available Control Names" section should be updated.

  const SUPPORT_PAUSE = 1;
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_SHUFFLE = 32768;
  const SUPPORT_REPEAT_SET = 262144;
  const SUPPORT_TURN_ON = 128;
  const SUPPORT_TURN_OFF = 256;
  const SUPPORT_PLAY = 16384;
  const normalizedLayout = controlLayout === "modern" ? "modern" : "classic";
  let showPrevious = !hiddenControls.previous && supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK);
  let showPlayPause = !hiddenControls.play_pause && (supportsFeature(stateObj, SUPPORT_PAUSE) || supportsFeature(stateObj, SUPPORT_PLAY));
  const canShowStop = !hiddenControls.stop && showStop;
  let showStopButton = canShowStop;
  let showNext = !hiddenControls.next && supportsFeature(stateObj, SUPPORT_NEXT_TRACK);
  let showShuffleButton = !hiddenControls.shuffle && supportsFeature(stateObj, SUPPORT_SHUFFLE);
  let showRepeatButton = !hiddenControls.repeat && supportsFeature(stateObj, SUPPORT_REPEAT_SET);
  let showFavoriteButton = !hiddenControls.favorite && showFavorite;
  let showPowerButton = !hiddenControls.power && (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON));
  const swapPauseWithStop = normalizedLayout === "modern" && swapPauseForStop && canShowStop;
  const isPlayingState = stateObj.state === "playing";
  const primaryUsesStop = swapPauseWithStop && isPlayingState;
  if (normalizedLayout === "modern") {
    showStopButton = false;
    showFavoriteButton = false;
    showPowerButton = false;
  }
  const controlCount = countMainControls(stateObj, supportsFeature, showFavorite, hiddenControls, showStop, normalizedLayout);
  const baseRowClass = adaptiveControls ? "controls-row adaptive" : "controls-row";
  const rowClass = normalizedLayout === "modern" ? `${baseRowClass} modern` : baseRowClass;
  let rowStyle = adaptiveControls ? `--yamp-control-count:${Math.max(controlCount, 1)};` : E;
  if (adaptiveControls) {
    const sizing = (() => {
      if (controlCount <= 3) {
        return {
          icon: 56,
          minWidth: 78,
          maxWidth: 150,
          minHeight: 78,
          padding: 14,
          gap: 14
        };
      }
      if (controlCount === 4) {
        return {
          icon: 48,
          minWidth: 68,
          maxWidth: 130,
          minHeight: 68,
          padding: 12,
          gap: 12
        };
      }
      if (controlCount === 5) {
        return {
          icon: 42,
          minWidth: 58,
          maxWidth: 110,
          minHeight: 58,
          padding: 10,
          gap: 10
        };
      }
      if (controlCount === 6) {
        return {
          icon: 36,
          minWidth: 50,
          maxWidth: 96,
          minHeight: 52,
          padding: 8,
          gap: 8
        };
      }
      return {
        icon: 32,
        minWidth: 44,
        maxWidth: 88,
        minHeight: 48,
        padding: 6,
        gap: 6
      };
    })();
    rowStyle += [`--yamp-control-gap:${sizing.gap}px`, `--yamp-control-min-width:${sizing.minWidth}px`, `--yamp-control-max-width:${sizing.maxWidth}px`, `--yamp-control-min-height:${sizing.minHeight}px`, `--yamp-control-padding:${sizing.padding}px`, `--yamp-control-icon-size:${sizing.icon}px`].join(";");
  }
  if (normalizedLayout === "modern") {
    return x`
      <div class=${rowClass} style=${rowStyle}>
        <div class="controls-left">
          ${showShuffleButton ? x`
            <button class="modern-button small${shuffleActive ? " active" : ""}" @click=${() => onControlClick("shuffle")} title="${localize('card.media_controls.shuffle')}">
              <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
            </button>
          ` : E}
          ${showPrevious ? x`
            <button class="modern-button medium" @click=${() => onControlClick("prev")} title="${localize('card.media_controls.previous')}">
              <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
            </button>
          ` : E}
        </div>

        <div class="controls-center">
          ${showPlayPause ? x`
            <button
              class="modern-button primary${isPlayingState ? " active" : ""}"
              @click=${() => onControlClick(primaryUsesStop ? "stop" : "play_pause")}
              title="${primaryUsesStop ? localize('card.media_controls.stop') : localize('card.media_controls.play_pause') || "Play/Pause"}"
            >
              <ha-icon .icon=${primaryUsesStop ? "mdi:stop" : isPlayingState ? "mdi:pause" : "mdi:play"}></ha-icon>
            </button>
          ` : E}
        </div>

        <div class="controls-right">
          ${showNext ? x`
            <button class="modern-button medium" @click=${() => onControlClick("next")} title="${localize('card.media_controls.next')}">
              <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
            </button>
          ` : E}
          ${showRepeatButton ? x`
            <button class="modern-button small${repeatActive ? " active" : ""}" @click=${() => onControlClick("repeat")} title="${localize('card.media_controls.repeat')}">
              <ha-icon .icon=${stateObj.attributes.repeat === "one" ? "mdi:repeat-once" : "mdi:repeat"}></ha-icon>
            </button>
          ` : E}
        </div>
      </div>
    `;
  }
  return x`
    <div class=${rowClass} style=${rowStyle}>
      ${showPrevious ? x`
        <button class="button" @click=${() => onControlClick("prev")} title="Previous">
          <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
        </button>
      ` : E}
      ${showPlayPause ? x`
        <button class="button" @click=${() => onControlClick("play_pause")} title="Play/Pause">
          <ha-icon .icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
        </button>
      ` : E}
      ${showStopButton ? x`
        <button class="button" @click=${() => onControlClick("stop")} title="Stop">
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
      ` : E}
      ${showNext ? x`
        <button class="button" @click=${() => onControlClick("next")} title="Next">
          <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
        </button>
      ` : E}
      ${showShuffleButton ? x`
        <button class="button${shuffleActive ? ' active' : ''}" @click=${() => onControlClick("shuffle")} title="Shuffle">
          <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
        </button>
      ` : E}
      ${showRepeatButton ? x`
        <button class="button${repeatActive ? ' active' : ''}" @click=${() => onControlClick("repeat")} title="Repeat">
          <ha-icon .icon=${stateObj.attributes.repeat === "one" ? "mdi:repeat-once" : "mdi:repeat"}></ha-icon>
        </button>
      ` : E}
      ${showFavoriteButton ? x`
        <button class="button${favoriteActive ? ' active' : ''}" @click=${() => onControlClick("favorite")} title="Favorite">
          <ha-icon .icon=${favoriteActive ? "mdi:heart" : "mdi:heart-outline"}></ha-icon>
        </button>
      ` : E}
      ${showPowerButton ? x`
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

// Export a small helper used by the card for layout decisions
function countMainControls(stateObj, supportsFeature) {
  let showFavorite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let hiddenControls = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  let showStop = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let controlLayout = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "classic";
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_SHUFFLE = 32768;
  const SUPPORT_REPEAT_SET = 262144;
  const SUPPORT_TURN_ON = 128;
  const SUPPORT_TURN_OFF = 256;
  const normalizedLayout = controlLayout === "modern" ? "modern" : "classic";
  let count = 0;
  if (!hiddenControls.previous && supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK)) count++;
  if (!hiddenControls.play_pause) count++; // play/pause button always present if row exists
  if (normalizedLayout !== "modern" && !hiddenControls.stop && showStop) count++;
  if (!hiddenControls.next && supportsFeature(stateObj, SUPPORT_NEXT_TRACK)) count++;
  if (!hiddenControls.shuffle && supportsFeature(stateObj, SUPPORT_SHUFFLE)) count++;
  if (!hiddenControls.repeat && supportsFeature(stateObj, SUPPORT_REPEAT_SET)) count++;
  if (normalizedLayout !== "modern" && !hiddenControls.favorite && showFavorite) count++; // favorite button
  if (normalizedLayout !== "modern" && !hiddenControls.power && (supportsFeature(stateObj, SUPPORT_TURN_OFF) || supportsFeature(stateObj, SUPPORT_TURN_ON))) count++;
  return count;
}

// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
function renderVolumeRow(_ref) {
  let {
    isRemoteVolumeEntity,
    showSlider,
    vol,
    isMuted,
    supportsMute,
    onVolumeDragStart,
    onVolumeDragEnd,
    onVolumeChange,
    onVolumeStep,
    onMuteToggle,
    moreInfoMenu,
    leadingControlTemplate = E,
    reserveLeadingControlSpace = false,
    showRightPlaceholder = false,
    rightSlotTemplate = E,
    hideVolume = false
  } = _ref;
  const hasLeadingControl = leadingControlTemplate !== E && leadingControlTemplate !== undefined && leadingControlTemplate !== null;
  // Determine volume icon based on volume level and mute state
  const getVolumeIcon = (volume, muted) => {
    // For entities that don't support mute, consider them muted when volume is 0
    const effectiveMuted = supportsMute ? muted : volume === 0;
    if (effectiveMuted || volume === 0) return "mdi:volume-off";
    if (volume < 0.2) return "mdi:volume-low";
    if (volume < 0.5) return "mdi:volume-medium";
    return "mdi:volume-high";
  };
  return x`
    <div class="volume-row ${showSlider && !isRemoteVolumeEntity ? 'has-slider' : ''}">
      <div class="volume-left">
        ${hasLeadingControl ? leadingControlTemplate : reserveLeadingControlSpace ? x`<div class="volume-leading-placeholder"></div>` : E}
        ${!hideVolume && !isRemoteVolumeEntity ? x`
          <button 
            class="volume-icon-btn" 
            @click=${onMuteToggle} 
            title=${(supportsMute ? isMuted : vol === 0) ? localize('common.unmute') : localize('common.mute')}
          >
            <ha-icon icon=${getVolumeIcon(vol, isMuted)}></ha-icon>
          </button>
        ` : E}
      </div>

      <div class="volume-center">
        ${!hideVolume ? x`
          ${isRemoteVolumeEntity ? x`
              <div class="vol-stepper-container">
                <div class="vol-stepper">
                  <button class="button" @click=${() => onVolumeStep(-1)} title="${localize('common.vol_down')}">–</button>
                  <span class="vol-label">vol</span>
                  <button class="button" @click=${() => onVolumeStep(1)} title="${localize('common.vol_up')}">+</button>
                </div>
              </div>
            ` : showSlider ? x`
                <div class="volume-slider-container">
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
                    title="${localize('common.volume')}"
                  />
                </div>
              ` : x`
              <div class="vol-stepper-container">
                <div class="vol-stepper">
                  <button class="button" @click=${() => onVolumeStep(-1)} title="${localize('common.vol_down')}">–</button>
                  <span class="vol-value">${Math.round(vol * 100)}%</span>
                  <button class="button" @click=${() => onVolumeStep(1)} title="${localize('common.vol_up')}">+</button>
                </div>
              </div>
            `}
        ` : E}
      </div>

      <div class="volume-right">
        ${showRightPlaceholder ? x`
          <div class="volume-placeholder">
            ${rightSlotTemplate || E}
          </div>
        ` : E}
        ${moreInfoMenu}
      </div>
    </div>
  `;
}

// import { html, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
function formatTime(seconds) {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
function renderProgressBar(_ref) {
  let {
    progress,
    seekEnabled,
    onSeek,
    collapsed,
    accent,
    height = 6,
    style = "",
    displayTimestamps = false,
    currentTime = 0,
    duration = 0
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
    <div class="progress-bar-container" style="${style}">
      <div
        class="progress-bar"
        style="height:${height}px; background:rgba(255,255,255,0.22);"
        @click=${seekEnabled ? onSeek : null}
        title=${seekEnabled ? localize('common.seek') : ""}
      >
        <div
          class="progress-inner"
          style="width: ${progress * 100}%; background: ${barColor}; height:${height}px;"
        ></div>
      </div>
      ${displayTimestamps ? x`
        <div class="timestamps-container">
           <span>${formatTime(currentTime)}</span>
           <span>-${formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      ` : E}
    </div>
  `;
}

// import { css } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
const Z_LAYERS = Object.freeze({
  MEDIA_BACKGROUND: 0,
  MEDIA_OVERLAY: 0,
  FLOATING_ELEMENT: 1,
  STICKY_CHIPS: 1,
  ACCENT_FOREGROUND: 1,
  FLOATING_CONTROLS: 1,
  OVERLAY_BASE: 2,
  MODAL_BACKDROP: 2,
  MODAL_TOAST: 2,
  SEARCH_SLIDE_OUT: 1,
  SEARCH_SUCCESS: 1
});
const yampCardStyles = i$5`
  /* CSS Custom Properties for consistency */
  :host {
    --custom-accent: #ff9800;
    --card-bg: var(--card-background-color, #222);
    --primary-text: var(--primary-text-color, #fff);
    --secondary-text: var(--secondary-text-color, #aaa);
    --chip-bg: var(--chip-background, #333);
    --transition-fast: 0.13s;
    --transition-normal: 0.2s;
    --transition-slow: 0.4s;
    --border-radius: 16px;
    --chip-border-radius: 24px;
    --button-border-radius: 8px;
    --shadow-light: 0 2px 8px rgba(0,0,0,0.13);
    --shadow-medium: 0 2px 8px rgba(0,0,0,0.25);
    --shadow-heavy: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
    --yamp-artwork-fit: cover;
    --yamp-text-scale: 1;
    --yamp-text-scale-details: 1;
    --yamp-text-scale-menu: 1;
    --yamp-text-scale-action-chips: 1;
    --yamp-details-scale: var(--yamp-text-scale-details, 1);
    --yamp-details-line-height: 1.2;
    --yamp-details-max-lines: 3;
    --yamp-section-bg: var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.02)));
    --yamp-section-border: var(--divider-color, rgba(255,255,255,0.1));
    --yamp-section-radius: 12px;
    --yamp-section-divider: rgba(255,255,255,0.06);
    --yamp-section-title-size: 1em;
    --yamp-section-title-weight: 600;
    --yamp-section-description-size: 0.9em;
    --yamp-section-description-color: var(--secondary-text-color, #888);
  }

  :host([data-match-theme="false"]) {
    --custom-accent: #ff9800 ;
    
    /* Search sheet default theme variables when match_theme is false */
    --search-overlay-bg: rgba(0, 0, 0, 0.8);
    --search-input-bg: #333;
    --search-input-text: #fff;
    --search-text: #fff;
    --search-error: #ff6b6b;
    --search-success: #4caf50;
    --search-success-bg: rgba(76, 175, 80, 0.95);
    --search-border: rgba(255, 255, 255, 0.1);
    --search-hover-bg: rgba(255, 255, 255, 0.1);
    --search-play-hover: #e68900;
    --search-queue-bg: #4a4a4a;
    --search-queue-border: #666;
    --search-queue-hover: #5a5a5a;
    --search-queue-hover-border: #777;
  }
  
  :host([data-match-theme="true"]) {
    /* Override custom-accent to use theme accent when match_theme is true */
    --custom-accent: var(--accent-color, #ff9800);
    
    /* Search sheet theme-aware variables */
    --search-overlay-bg: var(--ha-card-background, rgba(0, 0, 0, 0.8));
    --search-input-bg: var(--ha-card-background, #333);
    --search-input-text: var(--primary-text-color, #fff);
    --search-text: var(--primary-text-color, #fff);
    --search-error: var(--error-color, #ff6b6b);
    --search-success: var(--success-color, #4caf50);
    --search-success-bg: var(--success-color, rgba(76, 175, 80, 0.95));
    --search-border: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-hover-bg: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-play-hover: var(--accent-color, #e68900);
    --search-queue-bg: var(--ha-card-background, #4a4a4a);
    --search-queue-border: var(--divider-color, #666);
    --search-queue-hover: var(--secondary-background-color, #5a5a5a);
    --search-queue-hover-border: var(--divider-color, #777);
  }

  /* Base card styles - set once, inherit everywhere */
  :host {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: none;
    background: transparent;
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
    clip-path: inset(0 round var(--border-radius));
  }

  ha-card.yamp-card {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: none;
    background: transparent;
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
    font-size: inherit;
    position: relative;
    clip-path: inset(0 round var(--border-radius));
    transform: translateZ(0);
  }

  .yamp-card-inner {
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    container-type: inline-size;
    border-radius: var(--border-radius);
    clip-path: inset(0 round var(--border-radius));
    transform: translateZ(0);
  }

  .full-bleed-artwork-bg {
    position: absolute;
    inset: -50px;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
    transform: translateZ(0);
  }

  .full-bleed-artwork-fade {
    position: absolute;
    inset: -50px;
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.92) 100%
    );
    transform: translateZ(0);
  }

  /* Idle state dimming */
  .dim-idle .details,
  .dim-idle .controls-row,
  .dim-idle .volume-row,
  .dim-idle:not(.no-chip-dim) .chip-row,
  .dim-idle:not(.no-chip-dim) .action-chip-row {
    opacity: 0.28;
    transition: opacity 0.5s;
  }

  /* Improve selected chip readability while idle */
  .dim-idle .chip[selected] {
    color: rgba(255,255,255,0.94);
    text-shadow: 0 0 6px rgba(0,0,0,0.35);
  }

  /* More info menu */
  .more-info-menu {
    display: flex;
    align-items: center;
    margin-right: 0;
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
    margin-top: -6px;
  }

  .more-info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    color: var(--primary-text);
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
    margin: 0 0 2px 0;
    color: #fff;
    transition: color var(--transition-normal, 0.2s);
  }

  .dim-idle .more-info-btn ha-icon {
    color: #9ea2a8;
  }

  .more-info-icon {
    font-size: 1.7em;
    line-height: 1;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-normal, 0.2s);
  }

  .dim-idle .more-info-icon {
    color: #9ea2a8;
  }

  /* Card artwork spacer */
  .card-artwork-spacer {
    width: 100%;
    flex: 1 1 0;
    height: auto;
    min-height: 180px;
    pointer-events: none;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([data-has-custom-height="true"]) .card-artwork-spacer {
    min-height: 0;
  }

  /* Media background */
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
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
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    pointer-events: none;
  }

  /* Source menu */
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
    color: var(--primary-text);
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
    background: var(--card-bg);
    color: var(--primary-text);
    border-radius: var(--button-border-radius);
    box-shadow: var(--shadow-light);
    min-width: 110px;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
    margin-top: 2px;
    border: 1px solid #444;
    overflow: hidden;
    max-height: 220px;
    overflow-y: auto;
  }

  .source-dropdown.up {
    top: auto;
    bottom: 38px;
    border-radius: var(--button-border-radius);
  }

  .source-option {
    padding: 8px 16px;
    cursor: pointer;
    transition: background var(--transition-fast);
    white-space: nowrap;
  }

  .source-option:hover,
  .source-option:focus {
    background: var(--accent-color, #1976d2);
    color: #fff;
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
    border-radius: var(--button-border-radius);
    border: 1px solid #ccc;
    background: var(--card-bg);
    color: var(--primary-text);
    outline: none;
    margin-top: 2px;
  }

  /* Chip styles */
  .chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 8px;
    background: transparent;
    border-radius: 50%;
    overflow: hidden;
    padding: 0;
  }

  .chip[playing] .chip-icon {
    background: #fff;
  }

  .chip-icon ha-icon {
    width: 100%;
    height: 100%;
    font-size: 28px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    color: var(--custom-accent);
  }

  .chip[selected] .chip-icon ha-icon {
    color: #fff;
  }

  .chip[selected][playing] .chip-icon ha-icon {
    color: var(--custom-accent);
  }

  .chip:hover .chip-icon ha-icon {
    color: #fff;
  }

  .chip-mini-art {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: var(--yamp-artwork-fit, cover);
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    display: block;
  }

  /* Chip rows */
  .chip-row.grab-scroll-active,
  .action-chip-row.grab-scroll-active,
  .search-filter-chips.grab-scroll-active {
    cursor: grabbing;
  }

  .chip-row,
  .action-chip-row,
  .search-filter-chips {
    cursor: grab;
  }

  .chip-row {
    display: flex;
    gap: 8px;
    padding: 8px 12px 0 12px;
    margin-bottom: 12px;
    position: relative;
    z-index: ${Z_LAYERS.STICKY_CHIPS};
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: none;
    scrollbar-color: var(--accent-color, #1976d2) #222;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    max-width: 100vw;
    background: transparent;
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
    position: relative;
    z-index: ${Z_LAYERS.STICKY_CHIPS};
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
    font-size: calc(1em * var(--yamp-text-scale-action-chips, 1));
    background: transparent;
  }

  .action-chip-row::-webkit-scrollbar {
    display: none;
  }

  /* Action chips */
  .action-chip {
    background: transparent;
    opacity: 1;
    border-radius: var(--button-border-radius);
    color: var(--primary-text);
    box-shadow: none;
    text-shadow: none;
    border: none;
    outline: none;
    padding: 4px 12px;
    font-weight: 500;
    font-size: 0.95em;
    cursor: pointer;
    margin: 4px 0;
    transition: background var(--transition-normal) ease, transform 0.1s ease;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: none;
    text-shadow: none;
  }

  .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: none;
    text-shadow: none;
  }

  /* Override action chip colors when match_theme is false */
  :host([data-match-theme="false"]) .action-chip:hover,
  :host([data-match-theme="false"]) .action-chip:active {
    background: #ff9800 ;
  }

  /* Main chips */
  .chip {
    display: flex;
    align-items: center;
    border-radius: var(--chip-border-radius);
    padding: 6px 6px 6px 8px;
    background: var(--chip-bg);
    color: var(--primary-text);
    cursor: pointer;
    font-weight: 500;
    opacity: 0.85;
    border: none;
    outline: none;
    transition: background var(--transition-normal), opacity var(--transition-normal);
    flex: 0 0 auto;
    white-space: nowrap;
    position: relative;
  }

  .chip:hover {
    background: var(--custom-accent);
    color: #fff;
  }

  .chip[selected] {
    background: var(--custom-accent);
    color: #fff;
    opacity: 1;
  }

  .chip[playing] {
    padding-right: 6px;
  }

  /* Playing indicator animation - equalizer bars */
  @keyframes chipPlayingBar1 {
    0%, 100% { height: 3px; }
    50% { height: 10px; }
  }
  @keyframes chipPlayingBar2 {
    0%, 100% { height: 5px; }
    50% { height: 12px; }
  }
  @keyframes chipPlayingBar3 {
    0%, 100% { height: 4px; }
    50% { height: 8px; }
  }

  .chip-playing-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    margin-left: 6px;
    height: 14px;
  }

  .chip-playing-indicator .bar {
    width: 3px;
    background: currentColor;
    border-radius: 1px;
  }

  .chip-playing-indicator .bar:nth-child(1) {
    animation: chipPlayingBar1 0.8s ease-in-out 0s infinite;
  }

  .chip-playing-indicator .bar:nth-child(2) {
    animation: chipPlayingBar2 0.6s ease-in-out 0.15s infinite;
  }

  .chip-playing-indicator .bar:nth-child(3) {
    animation: chipPlayingBar3 0.7s ease-in-out 0.3s infinite;
  }

  .chip[playing]:not([selected]) .chip-playing-indicator {
    color: var(--custom-accent);
  }

  .chip[playing][selected] .chip-playing-indicator,
  .chip[playing]:hover .chip-playing-indicator {
    color: #fff;
  }

  /* Chip pin */
  .chip-pin {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #fff;
    border-radius: 50%;
    padding: 2px;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
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
    color: var(--custom-accent);
    font-size: 17px;
    margin: 0;
  }

  .chip[selected] .chip-pin-inside ha-icon {
    color: #fff;
  }

  .chip-pin:hover ha-icon,
  .chip-pin-inside:hover ha-icon,
  .chip-quick-group:hover ha-icon {
    color: #fff;
  }

  .chip:hover .chip-pin ha-icon,
  .chip:hover .chip-pin-inside ha-icon,
  .chip:hover .chip-quick-group ha-icon {
    color: #fff;
  }

  .chip-quick-group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    background: transparent;
    border-radius: 50%;
    padding: 2px;
    cursor: pointer;
  }

  .chip-quick-group ha-icon {
    color: var(--custom-accent);
    font-size: 17px;
    margin: 0;
  }

  .chip[selected] .chip-quick-group ha-icon {
    color: #fff;
  }

  .chip-pin-spacer {
    display: flex;
    width: 24px;
    min-width: 24px;
    height: 1px;
  }

  /* Group icon */
  .chip-icon.group-icon {
    background: var(--custom-accent);
    color: #fff;
    position: relative;
  }

  .group-count {
    font-weight: 700;
    font-size: 0.9em;
    line-height: 28px;
    text-align: center;
    width: 100%;
    color: inherit;
  }

  /* Media artwork */
  .media-artwork-bg {
    position: relative;
    width: 100%;
    aspect-ratio: 1.75/1;
    overflow: hidden;
    background-size: var(--yamp-artwork-bg-size, cover);
    background-repeat: no-repeat;
    background-position: top center;
  }

  .artwork {
    width: 96px;
    height: 96px;
    object-fit: var(--yamp-artwork-fit, cover);
    border-radius: 12px;
    box-shadow: var(--shadow-medium);
    background: #222;
  }

  /* Details section */
  .details {
    padding-top: 0;
    padding-right: calc(16px * var(--yamp-details-scale, 1));
    padding-bottom: calc(12px * var(--yamp-details-scale, 1));
    padding-left: calc(16px * var(--yamp-details-scale, 1));
    display: flex;
    flex-direction: column;
    gap: calc(8px * var(--yamp-details-scale, 1));
    margin-top: calc(8px * var(--yamp-details-scale, 1));
    min-height: calc(48px * var(--yamp-details-scale, 1));
    font-size: calc(1em * var(--yamp-details-scale, 1));
  }

  .details .title {
    font-size: calc(1.1em * var(--yamp-details-scale, 1));
    font-weight: 600;
    line-height: var(--yamp-details-line-height, 1.2);
    white-space: normal;
    word-break: break-word;
    overflow: visible;
    text-overflow: unset;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--yamp-details-max-lines, 3);
    overflow: hidden;
    padding-top: calc(8px * var(--yamp-details-scale, 1));
  }

  .details .artist {
    font-size: calc(1em * var(--yamp-details-scale, 1));
    line-height: var(--yamp-details-line-height, 1.2);
  }

  .title {
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.2;
    white-space: normal;
    word-break: break-word;
    overflow: visible;
    text-overflow: unset;
    display: block;
    padding-top: 8px;
  }

  .artist {
    font-size: 1em;
    font-weight: 400;
    color: var(--secondary-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }

  /* Controls */
  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 4px 16px;
  }

  .controls-row.adaptive {
    justify-content: center;
    gap: var(--yamp-control-gap, 10px);
    flex-wrap: nowrap;
  }

  .controls-row.adaptive .button {
    flex: 1 1 calc(
      (100% - (var(--yamp-control-gap, 10px) * (var(--yamp-control-count, 5) - 1))) /
      var(--yamp-control-count, 5)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--yamp-control-min-width, 48px);
    max-width: var(--yamp-control-max-width, 120px);
    min-height: var(--yamp-control-min-height, 48px);
    padding: var(--yamp-control-padding, 8px);
  }

  .controls-row.adaptive .button ha-icon {
    --mdc-icon-size: var(--yamp-control-icon-size, 36px);
    width: var(--yamp-control-icon-size, 36px);
    height: var(--yamp-control-icon-size, 36px);
    font-size: var(--yamp-control-icon-size, 36px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .controls-row.adaptive .button ha-icon svg,
  .controls-row.adaptive .button ha-icon iron-icon {
    width: 100%;
    height: 100%;
  }

  .controls-row.modern {
    justify-content: center;
    gap: 14px;
    padding: 10px 16px 2px 16px;
    /* Grid layout for robust centering */
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  .controls-row.modern .controls-left {
    grid-column: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;
  }

  .controls-row.modern .controls-center {
    grid-column: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
  }

  .controls-row.modern .controls-right {
    grid-column: 3;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 14px;
  }

  .modern-button {
    background: rgba(255,255,255,0.15);
    border: none;
    color: inherit;
    cursor: pointer;
    border-radius: 999px;
    transition: background var(--transition-normal), transform 0.12s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  }

  .modern-button.small,
  .modern-button.medium,
  .modern-button.primary {
    font-size: inherit;
  }

  .modern-button.small {
    width: 42px;
    height: 42px;
    padding: 0;
  }

  .modern-button.medium {
    width: 50px;
    height: 50px;
    padding: 0;
  }

  .modern-button.primary {
    width: 70px;
    height: 70px;
    font-size: 1.9em;
    background: rgba(255,255,255,0.1);
  }

  .modern-button ha-icon {
    --mdc-icon-size: 24px;
    width: 24px;
    height: 24px;
  }

  .modern-button.medium ha-icon {
    --mdc-icon-size: 28px;
    width: 28px;
    height: 28px;
  }

  .modern-button.primary ha-icon {
    --mdc-icon-size: 36px;
    width: 36px;
    height: 36px;
  }

  .modern-button:hover {
    background: rgba(255,255,255,0.25);
  }

  .modern-button:active {
    transform: scale(0.95);
  }

  .modern-button.active:not(.primary) {
    color: var(--custom-accent);
  }

  .modern-button.primary.active {
    color: inherit;
  }

  /* Tighter spacing for collapsed mode with artwork */
  .card-lower-content.collapsed.has-artwork .controls-row {
    gap: 8px;
    padding: 4px 12px 4px 16px;
  }

  .button {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.5em;
    cursor: pointer;
    padding: 6px;
    border-radius: var(--button-border-radius);
    transition: background var(--transition-normal);
  }

  .button:active {
    background: rgba(0,0,0,0.10);
  }

  .button.active ha-icon,
  .button.active {
    color: var(--custom-accent);
  }

  /* Progress bar */
  .progress-bar-container {
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.22);
    border-radius: 3px;
    margin: 8px 0;
    cursor: pointer;
    position: relative;
    box-shadow: var(--shadow-heavy);
  }

  .progress-inner {
    height: 100%;
    background: var(--custom-accent);
    border-radius: 3px 0 0 3px;
    box-shadow: 0 0 8px 2px rgba(0,0,0,0.24);
  }

  .timestamps-container {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-top: -4px;
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.9);
    padding: 0 2px;
  }

  /* Volume controls */
  .volume-row {
    display: grid;
    grid-template-columns: minmax(min-content, 1fr) auto minmax(min-content, 1fr);
    align-items: center;
    padding: 0 16px 14px 16px;
  }

  /* Remove flex:1 since we are using grid columns */
  .volume-left, 
  .volume-right {
    display: flex;
    align-items: center;
  }

  .volume-left {
    grid-column: 1;
    justify-self: start;
    justify-content: flex-start;
    gap: 8px;
  }

  .volume-right {
    grid-column: 3;
    justify-self: end;
    justify-content: flex-end;
    gap: 8px;
  }

  .volume-center {
    grid-column: 2;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .volume-row.has-slider .volume-left,
  .volume-row.has-slider .volume-right {
    flex: 0 0 auto;
  }

  .volume-row.has-slider {
    grid-template-columns: minmax(min-content, 1fr) 4fr minmax(min-content, 1fr);
  }

  .volume-row.has-slider .volume-center {
    width: 100%;
    justify-self: stretch;
  }

  .volume-controls {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0;
  }

  .search-sheet-play,
  .search-sheet-queue {
    background: none;
    border: none;
    cursor: pointer;
    color: #fff;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .radio-mode-button {
    background: none;
    border: none;
    font-size: 1.25em;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
    margin-right: 8px;
    display: flex;
    align-items: center;
    color: #fff;
  }

  .radio-mode-button.active {
    color: var(--custom-accent, var(--accent-color));
  }

  .volume-icon-btn {
    background: none;
    border: none;
    color: var(--primary-text);
    cursor: pointer;
    padding: 0px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-normal);
    min-width: 36px;
    min-height: 36px;
    margin: 0;
  }

  .volume-icon-btn:hover {
    color: var(--custom-accent);
  }

  .volume-icon-btn ha-icon {
    font-size: 1.2em;
    color: #fff;
  }

  .volume-icon-btn.favorite-volume-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  .volume-leading-placeholder {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  .volume-icon-btn.favorite-volume-btn.active {
    color: var(--custom-accent);
  }

  .volume-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    position: relative;
    padding: 0 24px;
  }

  .volume-slider-icon {
    font-size: 1em;
    color: var(--primary-text);
    opacity: 0.7;
    min-width: 20px;
  }

  .vol-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: hsla(0, 0.00%, 100.00%, 0.22);
    border-radius: 3px;
    outline: none;
    box-shadow: var(--shadow-heavy);
    flex: 1 1 auto;
    min-width: 80px;
    max-width: none;
    margin: 10px 0;
  }

  .volume-row .source-menu {
    flex: 0 0 auto;
  }

  .volume-placeholder {
    width: 36px;
    min-width: 36px;
    min-height: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Volume slider thumbs */
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

  /* Touch device improvements */
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

  .vol-stepper-container {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
  }

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

  .vol-value {
    min-width: 48px;
    display: inline-block;
    text-align: center;
    padding-left: 6px;
  }

  .vol-label {
    width: 42px;
    display: inline-block;
    font-size: 0.85em;
    text-transform: lowercase;
    opacity: 0.9;
  }

  /* Light mode styles */
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
      color: #222;
      background: #fff;
      transition: background var(--transition-fast), color var(--transition-fast);
    }

    .source-option:hover,
    .source-option:focus {
      background: var(--custom-accent);
      color: #222;
    }

    .source-select {
      background: #fff;
      color: #222;
      border: 1px solid #aaa;
    }

    .action-chip {
      background: var(--card-background-color, #fff);
      opacity: 1;
      border-radius: var(--button-border-radius);
      color: var(--primary-text-color, #222);
      box-shadow: none;
      text-shadow: none;
      border: none;
      outline: none;
    }

    .action-chip:active {
      background: var(--accent-color, #1976d2);
      color: #fff;
      opacity: 1;
      transform: scale(0.98);
      box-shadow: none;
      text-shadow: none;
    }

    .card-lower-content:not(.collapsed) .source-menu-btn,
    .card-lower-content:not(.collapsed) .source-selected {
      color: #fff;
    }
  }

  /* Artwork overlay */
  .artwork-dim-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, 
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.70) 100%);
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
  }

  /* Card lower content */
  .card-lower-content-container {
    position: relative;
    width: 100%;
    min-height: auto;
    height: 100%;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    overflow: hidden;
  }

  .card-lower-content-bg {
    position: absolute;
    inset: 0;
    z-index: ${Z_LAYERS.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
    height: 100%;
  }

  .card-lower-fade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.92) 100%
    );
  }

  .card-lower-content {
    position: relative;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-lower-content.transitioning .details,
  .card-lower-content.transitioning .card-artwork-spacer {
    transition: opacity 0.3s;
  }

  .card-lower-content.collapsed .details {
    opacity: 1;
    pointer-events: auto;
    margin-right: var(--yamp-collapsed-details-offset, 120px);
    transition: margin var(--transition-normal);
  }

  @media (max-width: 420px) {
    .card-lower-content.collapsed .details {
      margin-right: var(--yamp-collapsed-details-offset, 74px);
    }
  }

  .card-lower-content.collapsed .card-artwork-spacer {
    opacity: 0;
    pointer-events: none;
  }

  .card-lower-content.collapsed .card-artwork-spacer.show-placeholder {
    opacity: 1;
    pointer-events: auto;
  }

  .collapsed-flex-spacer {
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
  }

  .details,
  .title,
  .artist,
  .controls-row,
  .button,
  .vol-stepper span,
  .vol-label {
    color: #fff;
  }

  .vol-stepper span {
    width: 42px;
    text-align: center;
    display: inline-block;
  }

  .card-lower-content.collapsed .details .title,
  .card-lower-content.collapsed .title {
    font-size: calc(1.1em * var(--yamp-collapsed-title-scale, 1));
    line-height: calc(1.2 * var(--yamp-collapsed-title-scale, 1));
  }

  .card-lower-content.collapsed .artist {
    font-size: calc(1em * var(--yamp-collapsed-artist-scale, 1));
  }
  


  /* Media artwork placeholder */
  .media-artwork-placeholder {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(96px, 50%, 184px);
    aspect-ratio: 1;
    pointer-events: none;
  }

  .media-artwork-placeholder svg {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.85;
  }

  /* Collapsed artwork */
  .card-lower-content.collapsed .collapsed-artwork-container {
    position: absolute;
    top: 16px;
    right: 6px;
    width: 110px;
    height: calc(100% - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
    background: transparent;
    pointer-events: none;
    box-shadow: none;
    padding: 0;
    transition: background var(--transition-slow);
  }

  .card-lower-content.collapsed .collapsed-artwork {
    width: 102px;
    height: 102px;
    border-radius: 16px;
    object-fit: var(--yamp-artwork-fit, cover);
    background: transparent;
    box-shadow: 0 1px 6px rgba(0,0,0,0.22);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 2px;
  }

  .card-lower-content.collapsed.has-artwork .controls-row {
    max-width: calc(100% - var(--yamp-collapsed-controls-offset, 120px)) ;
    margin-right: max(calc(var(--yamp-collapsed-controls-offset, 120px) - 5px), 0px) ;
    width: auto ;
  }

  /* Medium screens */
  @media (max-width: 600px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 115px)) ;
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 115px) - 5px), 0px) ;
      width: auto ;
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 105px;
      right: 4px;
      top: 14px;
    }

    .card-lower-content.collapsed .collapsed-artwork {
      width: 98px;
      height: 98px;
    }
  }

  /* Small screens */
  @media (max-width: 420px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 90px)) ;
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 90px) - 5px), 0px) ;
      width: auto ;
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 90px;
      right: 3px;
      top: 12px;
    }

    .card-lower-content.collapsed .collapsed-artwork {
      width: 84px;
      height: 84px;
    }
  }

  /* Very small screens */
  @media (max-width: 320px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 80px)) ;
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 80px) - 5px), 0px) ;
      width: auto ;
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      width: 80px;
      right: 2px;
      top: 10px;
    }

    .card-lower-content.collapsed .collapsed-artwork {
      width: 74px;
      height: 74px;
    }
  }

  /* Collapsed progress bar */
  .collapsed-progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background: var(--custom-accent);
    border-radius: 0 0 12px 12px;
    z-index: ${Z_LAYERS.ACCENT_FOREGROUND};
    transition: width var(--transition-normal) linear;
    pointer-events: none;
  }

  /* Entity options overlay */
  .entity-options-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: ${Z_LAYERS.OVERLAY_BASE};
    background: var(--ha-entity-menu-overlay, rgba(0,0,0,0.82));
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  /* Opening animations for hamburger menu */
  @keyframes overlayFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes containerSlideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes sheetSlideIn {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .entity-options-overlay-opening {
    animation: overlayFadeIn 0.2s ease-out;
  }

  .entity-options-container-opening {
    animation: containerSlideIn 0.3s ease-out;
  }

  .entity-options-sheet-opening {
    animation: sheetSlideIn 0.25s ease-out 0.05s both;
  }

  /* Closing animations for hamburger menu */
  @keyframes overlayFadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes containerSlideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }

  @keyframes sheetSlideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(10px);
      opacity: 0;
    }
  }

  .entity-options-overlay-closing {
    animation: overlayFadeOut 0.15s ease-in forwards;
    pointer-events: none;
  }

  .entity-options-container-closing {
    animation: containerSlideOut 0.2s ease-in forwards;
  }

  .entity-options-sheet-closing {
    animation: sheetSlideOut 0.15s ease-in 0.05s both forwards;
  }

  .entity-options-container {
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 2% auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-direction: column;
    max-height: calc(96% - 70px);
    min-height: 90px;
    position: relative;
  }

  /* Expand container height when hide_menu_player is enabled (no persistent controls) */
  :host([data-hide-menu-player="true"]) .entity-options-container {
    max-height: 96%;
  }

  /* Expand container height when persistent controls are hidden due to layout constraints */
  :host([data-hide-persistent-controls="true"]) .entity-options-container,
  :host([data-pin-search-headers="true"]) .entity-options-container {
    max-height: 96%;
    scrollbar-width: none;
  }

  .entity-options-container::-webkit-scrollbar {
    display: none;
  }

  /* Persistent Media Controls */
  /* Persistent Media Controls */
  .persistent-media-controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    padding: 14px 22px 18px 22px;
    margin: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0;
    border: none;
    flex-shrink: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: ${Z_LAYERS.FLOATING_CONTROLS};
  }

  /* Hide persistent controls when hide_menu_player is enabled */
  :host([data-hide-menu-player="true"]) .persistent-media-controls {
    display: none;
  }

  /* Hide persistent controls when layout constraints require it */
  :host([data-hide-persistent-controls="true"]) .persistent-media-controls {
    display: none;
  }

  .persistent-controls-artwork {
    grid-column: 1;
    justify-self: start;
    flex-shrink: 0;
  }

  .persistent-artwork {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: var(--yamp-artwork-fit, cover);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .persistent-artwork-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .persistent-artwork-placeholder ha-icon {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
  }

  .persistent-controls-buttons {
    grid-column: 2;
    justify-self: center;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .persistent-volume-stepper {
    grid-column: 3;
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 0px;
  }

  .persistent-volume-stepper .stepper-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 20px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .persistent-volume-stepper .stepper-btn:hover {
    color: var(--custom-accent);
  }

  .persistent-volume-stepper .stepper-btn:active {
    transform: scale(0.92);
  }

  .persistent-volume-stepper .stepper-value {
    font-size: 0.95em;
    opacity: 0.85;
    min-width: 48px;
    text-align: center;
    color: #fff;
    padding-left: 6px;
  }

  .persistent-control-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #fff;
  }

  @container (max-width: 450px) {
    .persistent-volume-stepper {
      margin-right: -12px;
    }
    
    .persistent-volume-stepper .stepper-value {
      min-width: 36px;
      padding-left: 2px;
    }

    .persistent-volume-stepper .stepper-btn {
      width: 32px;
      height: 32px;
      font-size: 18px;
    }
  }

  .persistent-control-btn:hover {
    background: var(--custom-accent);
    border-color: var(--custom-accent);
    transform: scale(1.05);
  }

  .persistent-control-btn:active {
    transform: scale(0.95);
  }

  .persistent-control-btn ha-icon {
    font-size: 16px;
    color: inherit;
  }

  .entity-options-sheet {
    --custom-accent: var(--accent-color, #ff9800);
    background: none;
    border-radius: var(--border-radius);
    box-shadow: none;
    width: 100%;
    padding: 18px 8px 0px 8px;
    padding-top: clamp(12px, 6vh, 18px);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    scrollbar-width: none;
    -ms-overflow-style: none;
    font-size: calc(1em * var(--yamp-text-scale-menu, 1));
    position: relative;
    box-sizing: border-box;
  }

  /* Main menu specific styling - move options down, adapt to card height */
  .entity-options-sheet .entity-options-menu {
    margin-top: 0px;
    margin-bottom: 16px;
  }

  .in-menu-active-label {
    position: absolute;
    left: 50%;
    bottom: 6px;
    transform: translateX(-50%);
    font-size: 0.78em;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.78);
    pointer-events: none;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
  }

  /* When always collapsed is enabled, keep menu at top */
:host([data-always-collapsed="true"]) .entity-options-sheet .entity-options-menu {
  margin-top: 0px;
}

  /* Remove spacing between menu items */
  .entity-options-sheet .entity-options-menu .entity-options-item {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .entity-options-container,
  .entity-options-container-opening {
    position: relative;
  }

  .entity-options-chips-wrapper {
    position: sticky;
    top: 0;
    z-index: ${Z_LAYERS.STICKY_CHIPS};
    padding: 2px 4px 2px 4px;
    background: transparent;
  }

  .entity-options-chips-strip {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;
    overflow-x: auto;
    padding: 2px 8px 2px 8px;
    background: var(--ha-menu-chip-row-background, transparent);
  }

  .entity-options-chips-strip .chip {
    background: var(--chip-bg);
    color: var(--primary-text);
  }

  .entity-options-chips-strip .chip:hover {
    background: var(--custom-accent);
    color: #fff;
  }

  .entity-options-chips-strip .chip[selected] {
    background: var(--custom-accent);
    color: #fff;
  }

  .entity-options-chips-strip::-webkit-scrollbar {
    display: none;
  }

  .entity-options-menu.chips-in-menu {
    margin-top: 4px;
  }

  .entity-options-sheet.chips-mode {
    padding-top: 4px;
  }


  /* Ensure entity-options-sheet honors match_theme for accent color */
  :host([data-match-theme="false"]) .entity-options-sheet {
    --custom-accent: #ff9800 ;
  }
  :host([data-match-theme="true"]) .entity-options-sheet {
    --custom-accent: var(--accent-color, #ff9800) ;
  }

  .entity-options-sheet::-webkit-scrollbar {
    display: none;
  }

  .entity-options-sheet {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  /* Hide scrollbar for group list scroll container */
  .group-list-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .group-list-scroll::-webkit-scrollbar {
    display: none;
  }

  /* Seamless grouping header and scrolling list */
  .entity-options-sheet[data-pin-search-headers="true"] .group-list-header {
    z-index: 1;
    padding-top: 4px;
    margin-top: -4px;
    padding-bottom: 4px;
  }

  .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    margin-bottom: 72px; /* Reserve space for controls */
    padding-bottom: 0;
    scrollbar-width: thin; /* Allow scrollbar if needed */
  }

  .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll::-webkit-scrollbar {
    display: block;
    width: 6px;
  }

  :host([data-hide-persistent-controls="true"]) .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll,
  :host([data-hide-menu-player="true"]) .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll {
    margin-bottom: 12px;
    padding-bottom: 0;
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
    transition: color var(--transition-fast), text-shadow var(--transition-fast);
    text-align: center;
    text-shadow: 0 2px 8px #0009;
  }

  .entity-options-item.menu-action-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
  }

  .entity-options-item.menu-action-item .menu-action-icon {
    color: inherit;
    --mdc-icon-color: currentColor;
    --icon-color: currentColor;
    --paper-item-icon-color: currentColor;
    --ha-icon-color: currentColor;
    fill: currentColor;
  }

  .entity-options-item.menu-action-item .menu-action-label {
    color: inherit;
  }

  .entity-options-item:hover {
    color: var(--custom-accent, #ff9800);
    text-shadow: none;
    background: none;
  }

  .entity-options-item.close-item {
    font-weight: 600;
    margin: 1px 0;
    padding: 4px 0 5px 0;
    display: block;
    width: 100%;
  }

  .entity-options-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.28);
    margin: 1px 0 8px 0;
    width: 100%;
    display: block;
  }

  /* Ensure Group Players header always shows a single divider */
  .grouping-header {
    width: 100%;
  }
  .grouping-header .entity-options-item.close-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.28);
    margin-bottom: 6px;
    padding-bottom: 6px;
  }

  /* Source index */
  .source-index-letter:focus {
    background: rgba(255,255,255,0.11);
    outline: 1px solid #ff9800;
  }

  .source-list-centering-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .source-list-sheet {
    width: 100%;
    position: relative;
    overflow: visible;
  }

  .source-list-scroll {
    overflow-y: auto;
    max-height: 340px;
    scrollbar-width: none;
    width: 100%;
  }

  .source-list-scroll .entity-options-item {
    width: 100%;
  }

  .source-list-scroll::-webkit-scrollbar {
    display: none;
  }

  .floating-source-index.grab-scroll-active,
  .floating-source-index.grab-scroll-active * {
    cursor: grabbing;
  }

  .floating-source-index {
    position: absolute;
    top: 55px;
    bottom: 20px;
    right: 0;
    width: 32px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    pointer-events: auto;
    overscroll-behavior: contain;
    z-index: ${Z_LAYERS.ACCENT_FOREGROUND};
    padding: 0 8px 0 0;
    overflow-y: auto;
    max-height: calc(100% - 75px);
    min-width: 38px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .entity-options-sheet.chips-mode .floating-source-index {
    top: clamp(72px, 15vh, 120px);
    height: calc(100% - clamp(72px, 15vh, 120px));
  }

  .floating-source-index::-webkit-scrollbar {
    display: none;
  }

  .floating-source-index .source-index-letter {
    background: none;
    border: none;
    color: #fff;
    font-size: 0.9em;
    cursor: pointer;
    margin: 1px 0;
    padding: 0;
    pointer-events: auto;
    outline: none;
    transition: color var(--transition-fast), background var(--transition-fast), transform 0.16s cubic-bezier(.35,1.8,.4,1.04);
    transform: scale(1);
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
    min-height: 22px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: ${Z_LAYERS.OVERLAY_BASE};
  }

  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
  }

  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.10);
    z-index: ${Z_LAYERS.MEDIA_OVERLAY};
  }

  .floating-source-index .source-index-letter::after {
    display: none;
  }

  .floating-source-index .source-index-letter:hover,
  .floating-source-index .source-index-letter:focus {
    color: #fff;
  }

  .floating-source-index .source-index-letter[disabled] {
    opacity: 0.25;
    cursor: default;
  }

  /* Group toggle buttons */
  .group-toggle-btn {
    background: none;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    margin-right: 10px;
    cursor: pointer;
    transition: background 0.15s ease;
    color: #fff;
  }

  .group-toggle-btn ha-icon {
    width: 22px;
    height: 22px;
  }

  .group-toggle-transparent {
    background: none;
    border: none;
    box-shadow: none;
    color: transparent;
    pointer-events: none;
  }

  .group-toggle-transparent:hover {
    background: none;
  }

  /* Force white text in grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: #fff;
  }

  /* Search functionality */
  .entity-options-search {
    padding: 0px 10px 80px 10px;
  }

  .entity-options-search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
    margin-top: 2px;
  }

  .entity-options-search-result.menu-active > *:not(.search-row-slide-out) {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .entity-options-search-result {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid #2227;
    font-size: 1.10em;
    color: var(--primary-text);
    background: none;
  }
  .search-row-slide-out {
    position: absolute;
    inset: 0;
    left: 100%;
    background: rgba(0, 0, 0, 0.01) ;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: ${Z_LAYERS.SEARCH_SLIDE_OUT};
    display: flex;
    align-items: center;
    padding: 0 8px;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 15px 0 0 15px;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 4px;
  }

  .search-row-slide-out::-webkit-scrollbar {
    display: none;
  }

  .search-row-slide-out.active {
    left: 0;
  }

  .search-row-success-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    font-weight: 600;
    font-size: 0.95em;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    z-index: ${Z_LAYERS.SEARCH_SUCCESS};
    border-radius: inherit;
    box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
    animation: success-fade-in 0.3s ease;
  }

  .search-row-success-overlay span:first-child {
    font-size: 1.5em;
  }

  @keyframes success-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .slide-out-button {
    flex: 0 0 auto;
    background: transparent;
    border: none;
    color: #fff;
    padding: 6px 10px;
    border-radius: 18px;
    cursor: pointer;
    font-size: 0.88em;
    font-weight: 500;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s, color 0.2s;
  }

  .slide-out-button:hover {
    background: var(--custom-accent);
    color: #fff;
  }

  .slide-out-button ha-icon {
    width: 18px;
    height: 18px;
  }

  .slide-out-close {
    margin-left: auto;
    color: #888;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slide-out-close:hover {
    color: #fff;
  }

  .entity-options-search-result:last-child {
    border-bottom: none;
  }

  .entity-options-search-result.placeholder {
    visibility: hidden;
    border-bottom: 1px solid transparent;
    min-height: 46px;
    box-sizing: border-box;
  }

  .entity-options-search-thumb {
    height: 38px;
    width: 38px;
    border-radius: var(--button-border-radius);
    object-fit: var(--yamp-artwork-fit, cover);
    box-shadow: 0 1px 5px rgba(0,0,0,0.16);
    margin-right: 12px;
  }

  .entity-options-search-buttons {
    display: flex;
    gap: 6px;
    margin-left: 7px;
    align-items: center;
  }

  .entity-options-search-play,
  .entity-options-search-queue {
    min-width: 34px;
    font-size: 1.13em;
    border: none;
    background: transparent;
    color: #fff;
    border-radius: 10px;
    padding: 6px 10px;
    cursor: pointer;
    box-shadow: none;
    transition: background var(--transition-normal), color var(--transition-normal);
    text-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .entity-options-search-play ha-icon,
  .entity-options-search-queue ha-icon {
    width: 16px;
    height: 16px;
    
  
  }

  .entity-options-search-play:hover,
  .entity-options-search-play:focus {
    background: transparent;
    color: var(--custom-accent) !important;
    opacity: 0.8;
  }

  .entity-options-search-queue {
    color: #666;
    padding-right: 20px; /* Add right padding to prevent cutoff on mobile */
  }

  .entity-options-search-queue:hover,
  .entity-options-search-queue:focus {
    background: transparent;
    border: none;
    color: var(--custom-accent);
    opacity: 0.8;
  }

  /* Queue control buttons */
  .queue-controls {
    display: flex;
    gap: 4px;
    padding-right: 8px; /* Add padding to prevent cutoff on mobile */
  }

  .queue-btn {
    min-width: 28px;
    height: 28px;
    font-size: 0.9em;
    border: none;
    background: transparent;
    color: #fff;
    border-radius: 6px;
    padding: 4px;
    cursor: pointer;
    box-shadow: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .queue-btn ha-icon {
    width: 14px;
    height: 14px;
  }

  .queue-btn-up:hover,
  .queue-btn-up:focus {
    background: transparent;
    color: #4caf50;
  }

  .queue-btn-down:hover,
  .queue-btn-down:focus {
    background: transparent;
    color: #4caf50;
  }

  .queue-btn-next:hover,
  .queue-btn-next:focus {
    background: transparent;
    color: var(--custom-accent);
  }

  .queue-btn-remove:hover,
  .queue-btn-remove:focus {
    background: transparent;
    color: #f44336;
  }

  /* Visual feedback for moved queue items */
  .entity-options-search-result.just-moved {
    background: rgba(76, 175, 80, 0.2) ;
    border-left: 3px solid #4caf50 ;
    animation: queueMoveHighlight 1s ease-out;
  }

  @keyframes queueMoveHighlight {
    0% { background: rgba(76, 175, 80, 0.4); transform: scale(1.02); }
    100% { background: rgba(76, 175, 80, 0.2); transform: scale(1); }
  }

  .entity-options-search-input {
    border: 1px solid #333;
    border-radius: var(--button-border-radius);
    background: var(--card-bg);
    color: var(--primary-text);
    font-size: 1.12em;
    outline: none;
    transition: border var(--transition-fast);
    margin-right: 7px;
    box-sizing: border-box;
  }

  .entity-options-search-row .entity-options-search-input {
    padding: 4px 10px;
    height: 32px;
    min-height: 32px;
    line-height: 1.18;
    box-sizing: border-box;
    border: 1.5px solid var(--custom-accent);
    background: #232323;
    color: #fff;
    transition: border var(--transition-fast), background var(--transition-fast);
    outline: none;
  }

  .entity-options-search-input:focus {
    border: 1.5px solid var(--custom-accent);
    background: #232323;
    color: #fff;
    outline: none;
  }

  .entity-options-search-loading,
  .entity-options-search-error,
  .entity-options-search-empty {
    padding: 8px 6px;
    font-size: 1.09em;
    opacity: 0.90;
    color: var(--primary-text);
    background: none;
    text-align: left;
  }

  .entity-options-search-loading {
    color: #fff;
  }

  .entity-options-search-error {
    color: #e44747;
    font-weight: 500;
  }

  .entity-options-search-empty {
    color: #999;
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

  /* Search filter chips */
  .search-filter-chips .chip {
    color: #fff;
  }

  .search-filter-chips .chip[selected],
  .search-filter-chips .chip[style*="background: var(--customAccent"],
  .search-filter-chips .chip[style*="background: var(--custom-accent"] {
    color: #111;
  }

  .entity-options-sheet .search-filter-chips .chip:not([selected]) {
    color: #fff;
  }

  .entity-options-sheet .search-filter-chips .chip[selected] {
    color: #fff;
  }

  .entity-options-sheet .search-filter-chips .chip {
    justify-content: center;
  }

  .entity-options-sheet .search-filter-chips .chip:hover {
    background: var(--custom-accent) !important;
    color: #fff ;
    opacity: 1;
  }

  .entity-options-sheet .entity-options-search-results {
    min-height: 210px;
  }

  /* Search layout */
  .search-results-count {
    margin-left: auto;
    padding-left: 0px;
    padding-right: 15px;
    font-size: 0.85em;
    font-style: italic;
    color: rgba(255, 255, 255, 0.75);
    white-space: nowrap;
    text-align: right;
    flex-shrink: 0;
  }

  .entity-options-sheet .entity-options-search {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-sheet .entity-options-search-row,
  .entity-options-sheet .search-filter-chips,
  .entity-options-sheet .search-sub-filters {
    flex: 0 0 auto;
  }

  .entity-options-sheet[data-pin-search-headers="true"] {
    overflow-y: hidden ;
    display: flex;
    flex-direction: column;
    padding-bottom: 0px ;
  }

  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding-bottom: 0px ;
  }

  /* Unified Header and Scroll Containers for Menu Sheets */
  .entity-options-header {
    flex: 0 0 auto;
    position: relative;
    z-index: 10;
  }

  /* When pinning is active, the header is sticky and seamless */
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-header {
    position: sticky;
    top: 0;
    background: none ;
  }

  /* The scrollable area for all menus */
  .entity-options-scroll {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .entity-options-scroll::-webkit-scrollbar {
    display: none;
  }

  /* Reserved space for persistent media controls when pinning is active */
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-scroll,
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search-results,
  .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll {
    margin-bottom: 80px;
    padding-bottom: 0px ;
    background: none ;
  }

  /* Adjust spacing when persistent controls are hidden */
  :host([data-hide-persistent-controls="true"]) .entity-options-sheet[data-pin-search-headers="true"],
  :host([data-hide-menu-player="true"]) .entity-options-sheet[data-pin-search-headers="true"] {
    padding-bottom: 12px ;
  }

  /* Clean up legacy margin override rules since we now use padding on parent */
  :host([data-hide-persistent-controls="true"]) .entity-options-sheet[data-pin-search-headers="true"] .entity-options-scroll,
  :host([data-hide-persistent-controls="true"]) .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search-results,
  :host([data-hide-persistent-controls="true"]) .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll,
  :host([data-hide-menu-player="true"]) .entity-options-sheet[data-pin-search-headers="true"] .entity-options-scroll,
  :host([data-hide-menu-player="true"]) .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search-results,
  :host([data-hide-menu-player="true"]) .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll {
    margin-bottom: 0px;
  }

  .entity-options-sheet .entity-options-search-results {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
    padding-bottom: 0px;
    /* Hide scrollbars */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  /* Hide scrollbars for Webkit browsers (Chrome, Safari, etc.) */
  .entity-options-sheet .entity-options-search-results::-webkit-scrollbar {
    display: none;
  }

  .entity-options-resolved-entities {
    --custom-accent: var(--accent-color, #ff9800);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-resolved-entities-list {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
    /* Hide scrollbars */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .entity-options-resolved-entities-list::-webkit-scrollbar {
    display: none;
  }

  .entity-options-resolved-entities .entity-options-item {
    background: none;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 500;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast), text-shadow var(--transition-fast);
    text-align: left;
    text-shadow: 0 2px 8px #0009;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .entity-options-resolved-entities .entity-options-item:hover,
  .entity-options-resolved-entities .entity-options-item:focus {
    color: var(--custom-accent) ;
    text-shadow: none ;
    background: none ;
  }

  .entity-options-resolved-entities .entity-options-item:last-child {
    border-bottom: none;
  }

  /* Clickable artist */
  .clickable-artist {
    cursor: pointer;
  }

  .clickable-artist:hover {
    text-decoration: underline;
  }

  /* Clickable search results */
  .clickable-search-result {
    cursor: pointer;
    color: var(--custom-accent);
    transition: color var(--transition-fast);
  }

  .clickable-search-result:hover {
    text-decoration: underline;
    color: #fff;
  }

  /* Search breadcrumb */
  .entity-options-search-breadcrumb {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .entity-options-search-breadcrumb-text {
    font-size: 0.9em;
    color: #fff;
    font-style: italic;
  }

  /* Search sheet styles */
  .search-sheet {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: ${Z_LAYERS.MODAL_BACKDROP};
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .search-sheet-header {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .search-sheet-header input {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #333;
    color: #fff;
    font-size: 16px;
  }

  .search-sheet-header button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: var(--custom-accent);
    color: #fff;
    cursor: pointer;
    font-size: 16px;
  }

  .search-sheet-header button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .search-sheet-loading,
  .search-sheet-error,
  .search-sheet-success,
  .search-sheet-empty {
    text-align: center;
    padding: 40px;
    color: #fff;
    font-size: 18px;
  }

  .search-sheet-error {
    color: #ff6b6b;
  }

  .priority-toast-success {
    color: #fff;
    font-weight: 600;
    background: rgba(76, 175, 80, 0.95);
    border: 2px solid #4caf50;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    font-size: 20px;
    animation: fadeInOut 3s ease-in-out;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: ${Z_LAYERS.MODAL_TOAST};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    min-width: 200px;
    text-align: center;
    pointer-events: none;
  }


  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -60%); }
    10% { opacity: 1; transform: translate(-50%, -50%); }
    90% { opacity: 1; transform: translate(-50%, -50%); }
    100% { opacity: 0; transform: translate(-50%, -40%); }
  }

  .search-sheet-results.search-results-card-view,
  .entity-options-search-results.search-results-card-view,
  .search-sheet[data-card-view="true"] .search-sheet-results {
    display: grid;
    grid-template-columns: repeat(var(--search-card-columns, 4), 1fr);
    gap: 12px;
    padding: 12px;
  }

  .search-sheet-results {
    flex: 1;
    overflow-y: auto;
    /* Hide scrollbars */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .search-sheet-results::-webkit-scrollbar {
    display: none;
  }


  .search-sheet-result {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .search-sheet-result.search-result-card,
  .entity-options-search-result.search-result-card {
    flex-direction: column;
    padding: 8px;
    border-bottom: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    align-items: center;
    gap: 8px;
    height: min-content;
    position: relative;
    overflow: hidden;
  }

  .card-menu-button {
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    z-index: 2;
  }

  .card-menu-button:hover {
    opacity: 1;
  }

  .search-result-card .search-row-slide-out {
    flex-direction: column;
    height: 100%;
    width: 100%;
    top: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: flex-start;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.85);
    padding: 12px 8px;
    border-radius: 12px;
    transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 5;
    box-sizing: border-box;
  }

  .search-result-card .search-row-slide-out.active {
    top: 0;
  }

  .search-result-card .slide-out-button {
    font-size: 0.85em;
    padding: 8px 12px;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    text-align: center;
    margin: 2px 0;
    white-space: normal;
    word-break: break-word;
    flex-shrink: 0;
  }

  .search-result-card .slide-out-close {
    margin: 8px 0 4px 0;
    flex-shrink: 0;
  }

  .search-sheet-result:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .search-sheet-thumb,
  .entity-options-search-thumb,
  .entity-options-search-thumb-placeholder {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: var(--yamp-artwork-fit, cover);
    margin-right: 15px;
  }

  .entity-options-search-thumb,
  .entity-options-search-thumb-placeholder {
    width: 38px;
    height: 38px;
    margin-right: 12px;
  }

  .search-result-card .search-sheet-thumb,
  .search-result-card .entity-options-search-thumb,
  .search-result-card .search-sheet-thumb-placeholder,
  .search-result-card .entity-options-search-thumb-placeholder {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    margin-right: 0;
  }

  .search-sheet-thumb-placeholder {
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-result-card .search-sheet-thumb-placeholder {
    width: 100%;
    aspect-ratio: 1 / 1;
    height: auto;
  }

  .search-sheet-thumb-container {
    position: relative;
    width: auto;
    flex-shrink: 0;
  }

  .search-result-card .search-sheet-thumb-container {
    width: 100%;
  }

  .search-sheet-thumb-container[data-clickable="true"] {
    cursor: pointer;
  }

  .card-overlay-buttons {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 8px;
  }

  .search-sheet-result:hover .card-overlay-buttons {
    opacity: 1;
  }

  .icon-only.search-sheet-play, 
  .icon-only.search-sheet-queue,
  .icon-only.entity-options-search-play,
  .icon-only.entity-options-search-queue {
    background: var(--custom-accent);
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 50%;
  }

  .entity-options-search-thumb,
  .entity-options-search-thumb-placeholder {
    object-fit: var(--yamp-artwork-fit, cover);
    border-radius: 5px;
  }

  .entity-options-search-thumb-placeholder {
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .entity-options-search-thumb-placeholder ha-icon {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
  }

  .search-sheet-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .search-result-card .search-sheet-info {
    text-align: center;
    width: 100%;
    display: block; /* Original card behavior */
  }

  .search-sheet-title {
    flex: 1;
    color: #fff;
    font-size: 16px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search-sheet-subtitle {
    display: block;
    color: var(--secondary-text-color, #888);
    font-size: 0.9em;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entity-options-search-result:not(.search-result-card) .search-sheet-subtitle {
    font-size: 0.86em;
    color: #bbb;
    line-height: 1.16;
  }


  .search-result-card .search-sheet-info {
    text-align: center;
    width: 100%;
  }

  .search-result-card .search-sheet-title {
    text-align: center;
    width: 100%;
    /* 2-line clamping with word-level breaks */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 14px;
    line-height: 1.3;
    min-height: 2.6em; /* Reserve space for 2 lines to keep all cards uniform */
  }

  .search-result-card .search-sheet-subtitle {
    text-align: center;
    width: 100%;
    /* 2-line clamping with word-level breaks */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 0.85em;
    line-height: 1.3;
    min-height: 2.6em; /* Reserve space for 2 lines to keep all cards uniform */
  }

  .search-sheet-title.browsable,
  .search-sheet-subtitle.browsable {
    color: var(--custom-accent) ;
    text-decoration: none;
    cursor: pointer;
  }

  .search-sheet-title.browsable:hover,
  .search-sheet-subtitle.browsable:hover {
    text-decoration: underline;
  }

  .search-sheet-buttons {
    display: flex;
    gap: 8px;
  }

  .search-sheet-play,
  .search-sheet-queue {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: var(--custom-accent);
    color: #fff;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .search-sheet-play ha-icon,
  .search-sheet-queue ha-icon {
    width: 20px;
    height: 20px;
  }

  .search-sheet-play:hover,
  .search-sheet-queue:hover {
    background: #e68900;
  }

  .search-sheet-queue {
    background: #4a4a4a;
    border: 1px solid #666;
  }

  .search-sheet-queue:hover {
    background: #5a5a5a;
    border-color: #777;
  }

  /* Override styles when match_theme is false - force default colors */
  .search-sheet[data-match-theme="false"] {
    background: rgba(0, 0, 0, 0.8) ;
    
    /* Define CSS custom properties directly on the search sheet when match_theme is false */
    --custom-accent: #ff9800 ;
    --search-overlay-bg: rgba(0, 0, 0, 0.8) ;
    --search-input-bg: #333 ;
    --search-input-text: #fff ;
    --search-text: #fff ;
    --search-error: #ff6b6b ;
    --search-success: #4caf50 ;
    --search-success-bg: rgba(76, 175, 80, 0.95) ;
    --search-border: rgba(255, 255, 255, 0.1) ;
    --search-hover-bg: rgba(255, 255, 255, 0.1) ;
    --search-play-hover: #e68900 ;
    --search-queue-bg: #4a4a4a ;
    --search-queue-border: #666 ;
    --search-queue-hover: #5a5a5a ;
    --search-queue-hover-border: #777 ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header input {
    background: #333 ;
    color: #fff ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header button {
    background: #ff9800 ;
    color: #fff ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-loading,
  .search-sheet[data-match-theme="false"] .search-sheet-error,
  .search-sheet[data-match-theme="false"] .search-sheet-success,
  .search-sheet[data-match-theme="false"] .search-sheet-empty {
    color: #fff ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-error {
    color: #ff6b6b ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-success {
    color: #4caf50 ;
    background: rgba(76, 175, 80, 0.95) ;
    border: 2px solid #4caf50 ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-result {
    color: #fff ;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-result:hover {
    background: rgba(255, 255, 255, 0.1) ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-title {
    color: #fff ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play {
    background: var(--custom-accent) ;
    color: #fff ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play:hover {
    background: #e68900 ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-queue {
    background: #4a4a4a ;
    color: #fff ;
    border: 1px solid #666 ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-queue:hover {
    background: #5a5a5a ;
    border-color: #777 ;
  }

  /* Additional overrides for search sheet elements that might inherit theme colors */
  .search-sheet[data-match-theme="false"] .clickable-search-result {
    color: #ff9800 ;
  }

  .search-sheet[data-match-theme="false"] .clickable-search-result:hover {
    color: #fff ;
  }

  /* Override the base clickable-search-result styles when match_theme is false */
  .search-sheet[data-match-theme="false"] .clickable-search-result,
  .search-sheet[data-match-theme="false"] .clickable-search-result:hover {
    color: #ff9800 ;
  }

  .search-sheet[data-match-theme="false"] .clickable-search-result:hover {
    color: #fff ;
  }

  /* Override any other elements that might be using theme variables */
  .search-sheet[data-match-theme="false"] * {
    color: #fff ;
  }

  .search-sheet[data-match-theme="false"] .clickable-search-result {
    color: #ff9800 ;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play,
  .search-sheet[data-match-theme="false"] .search-sheet-queue {
    color: #fff ;
  }

  /* Force all text to be white when match_theme is false */
  .search-sheet[data-match-theme="false"] .search-sheet-title,
  .search-sheet[data-match-theme="false"] .search-sheet-loading,
  .search-sheet[data-match-theme="false"] .search-sheet-empty {
    color: #fff ;
  }

  /* Nuclear option: Override ALL elements that might be using --custom-accent or theme colors */
  .search-sheet[data-match-theme="false"] *[style*="color"] {
    color: #fff ;
  }

  .search-sheet[data-match-theme="false"] *[style*="background"] {
    background: rgba(0, 0, 0, 0.8) ;
  }

  /* Force override any CSS custom properties that might be inherited */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800 ;
    --accent-color: #ff9800 ;
    --primary-color: #ff9800 ;
    --ha-accent-color: #ff9800 ;
  }

  /* Also redefine --custom-accent locally in the search sheet, just like entity-options-resolved-entities does */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800 ;
  }

  /* Also override at the root level when match_theme is false */
  yet-another-media-player[data-match-theme="false"] {
    --custom-accent: #ff9800 ;
    --accent-color: #ff9800 ;
    --primary-color: #ff9800 ;
    --ha-accent-color: #ff9800 ;
  }

  /* Override any elements that might be using CSS custom properties */
  .search-sheet[data-match-theme="false"] .search-sheet-play,
  .search-sheet[data-match-theme="false"] .search-sheet-header button,
  .search-sheet[data-match-theme="false"] *[style*="background: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--primary-color)"] {
    background: #ff9800 ;
    color: #fff ;
  }

  /* Override any elements that might be using CSS custom properties for color */
  .search-sheet[data-match-theme="false"] *[style*="color: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--primary-color)"] {
    color: #ff9800 ;
  }

  /* ============================================
     Card Trigger Gesture Feedback Animations
     ============================================ */

  /* Base container for gesture feedback - positioned relative to tap area */
  .gesture-feedback-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: ${Z_LAYERS.FLOATING_ELEMENT};
  }

  /* Base styles for ripple effect */
  .gesture-ripple {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }

  /* Tap: Quick expanding ripple */
  @keyframes gestureTapRipple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  .gesture-ripple.tap {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
    animation: gestureTapRipple 0.4s ease-out forwards;
  }

  /* Double-tap: Two rapid pulses */
  @keyframes gestureDoubleTapRipple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.5;
    }
    25% {
      transform: translate(-50%, -50%) scale(0.6);
      opacity: 0.3;
    }
    50% {
      transform: translate(-50%, -50%) scale(0.3);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  .gesture-ripple.double_tap {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
    animation: gestureDoubleTapRipple 0.5s ease-out forwards;
  }

  /* Hold: Slower glowing pulse */
  @keyframes gestureHoldPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.2);
      opacity: 0;
      box-shadow: 0 0 0 0 rgba(255,255,255,0.4);
    }
    30% {
      opacity: 0.5;
      box-shadow: 0 0 20px 10px rgba(255,255,255,0.2);
    }
    100% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0;
      box-shadow: 0 0 40px 20px rgba(255,255,255,0);
    }
  }

  .gesture-ripple.hold {
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 70%);
    animation: gestureHoldPulse 0.6s ease-out forwards;
  }

  /* Swipe Left: Arrow sweeping left */
  @keyframes gestureSwipeLeft {
    0% {
      transform: translate(0%, -50%) scaleX(0);
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translate(-100%, -50%) scaleX(1);
      opacity: 0;
    }
  }

  .gesture-ripple.swipe_left {
    width: 120px;
    height: 60px;
    border-radius: 30px;
    background: linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.8) 100%);
    animation: gestureSwipeLeft 0.35s ease-out forwards;
    transform-origin: right center;
  }

  /* Swipe Right: Arrow sweeping right */
  @keyframes gestureSwipeRight {
    0% {
      transform: translate(0%, -50%) scaleX(0);
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translate(100%, -50%) scaleX(1);
      opacity: 0;
    }
  }

  .gesture-ripple.swipe_right {
    width: 120px;
    height: 60px;
    border-radius: 30px;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.8) 100%);
    animation: gestureSwipeRight 0.35s ease-out forwards;
    transform-origin: left center;
  }
`;

// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
const playOptions = [{
  mode: 'replace',
  icon: 'mdi:playlist-remove',
  label: localize('search.replace')
}, {
  mode: 'next',
  icon: 'mdi:playlist-play',
  label: localize('search.play_next')
}, {
  mode: 'replace_next',
  icon: 'mdi:playlist-music',
  label: localize('search.replace_play')
}, {
  mode: 'add',
  icon: 'mdi:playlist-plus',
  label: localize('search.add_queue')
}];
const resolveLimitValue = function (limit) {
  let {
    cap,
    floor
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const numericLimit = Number(limit);
  if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
    return undefined;
  }
  let value = numericLimit;
  if (typeof floor === "number") {
    value = Math.max(floor, value);
  }
  if (typeof cap === "number") {
    value = Math.min(cap, value);
  }
  return value;
};
const MUSIC_ASSISTANT_CONFIG_TTL_MS = 30000;
let cachedMusicAssistantEntryId = null;
let cachedMusicAssistantEntryTs = 0;
async function getMusicAssistantConfigEntryId(hass) {
  const now = Date.now();
  if (cachedMusicAssistantEntryId && now - cachedMusicAssistantEntryTs < MUSIC_ASSISTANT_CONFIG_TTL_MS) {
    return cachedMusicAssistantEntryId;
  }
  try {
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    const maEntry = entries.find(entry => entry.domain === "music_assistant" && entry.state === "loaded");
    cachedMusicAssistantEntryId = (maEntry === null || maEntry === void 0 ? void 0 : maEntry.entry_id) || null;
    cachedMusicAssistantEntryTs = now;
    return cachedMusicAssistantEntryId;
  } catch (error) {
    console.error("yamp: Failed to resolve Music Assistant config entry", error);
    cachedMusicAssistantEntryId = null;
    cachedMusicAssistantEntryTs = now;
    return null;
  }
}
let cachedMassQueueEntryId = null;
let cachedMassQueueEntryTs = 0;
async function getMassQueueConfigEntryId(hass) {
  const now = Date.now();
  if (cachedMassQueueEntryId && now - cachedMassQueueEntryTs < MUSIC_ASSISTANT_CONFIG_TTL_MS) {
    return cachedMassQueueEntryId;
  }
  try {
    const entries = await hass.callApi("GET", "config/config_entries/entry");
    const mqEntry = entries.find(entry => entry.domain === "mass_queue" && entry.state === "loaded");
    cachedMassQueueEntryId = (mqEntry === null || mqEntry === void 0 ? void 0 : mqEntry.entry_id) || null;
    cachedMassQueueEntryTs = now;
    return cachedMassQueueEntryId;
  } catch (error) {
    console.error("yamp: Failed to resolve mass_queue config entry", error);
    cachedMassQueueEntryId = null;
    cachedMassQueueEntryTs = now;
    return null;
  }
}
function transformMusicAssistantItem(item) {
  if (!item) return null;
  return {
    title: item.name,
    media_content_id: item.uri,
    media_content_type: item.media_type,
    media_class: item.media_type,
    thumbnail: item.image,
    ...(item.artists && {
      artist: item.artists.map(a => a.name).join(', ')
    }),
    ...(item.album && {
      album: item.album.name
    }),
    is_browsable: item.media_type === 'artist' || item.media_type === 'album'
  };
}

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
 * @param {Function} opts.onQueue - Handler to add a media item to queue.
 * @param {string} [opts.error] - Optional error message.
 * @param {boolean} [opts.showQueueSuccess] - Whether to show queue success message.
 * @param {boolean} [opts.matchTheme] - Whether to match the theme of the parent.
 * @param {boolean} [opts.disableAutofocus] - Whether to disable search input autofocus.
 */
function renderSearchResultActions(_ref) {
  let {
    item,
    onPlay,
    onOptionsToggle,
    upcomingFilterActive = false,
    isMusicAssistant = false,
    massQueueAvailable = false,
    searchView = 'list',
    isInline = false,
    onMoveUp,
    onMoveDown,
    onMoveNext,
    onRemove
  } = _ref;
  const isQueueItem = !!(upcomingFilterActive && item.queue_item_id && isMusicAssistant && massQueueAvailable);
  const containerClass = isInline ? 'entity-options-search-buttons' : searchView === 'card' ? 'card-overlay-buttons' : 'search-sheet-buttons';
  const playClass = isInline ? 'entity-options-search-play' : searchView === 'card' ? 'search-sheet-play icon-only' : 'search-sheet-play';
  const queueClass = isInline ? 'entity-options-search-queue' : searchView === 'card' ? 'search-sheet-queue icon-only' : 'search-sheet-queue';
  return x`
    <div class="${containerClass}">
      ${isQueueItem && isInline ? x`
        <div class="queue-controls">
          <button class="queue-btn queue-btn-up" @click=${() => onMoveUp(item)} title="${localize('search.move_up')}">
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-down" @click=${() => onMoveDown(item)} title="${localize('search.move_down')}">
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-next" @click=${() => onMoveNext(item)} title="${localize('search.move_next')}">
            <ha-icon icon="mdi:playlist-play"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-remove" @click=${() => onRemove(item)} title="${localize('search.remove')}">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      ` : E}
      <button class="${playClass}" 
              @click=${() => onPlay(item)} 
              title="${localize('common.play_now')}">
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
      ${!isQueueItem ? x`
        <button class="${queueClass}" 
                @click=${e => {
    e.preventDefault();
    e.stopPropagation();
    onOptionsToggle(item);
  }} 
                title="${localize('common.more_options')}">
          <ha-icon icon="mdi:dots-vertical"></ha-icon>
        </button>
      ` : E}
    </div>
  `;
}
function renderSearchResultSlideOut(_ref2) {
  let {
    item,
    activeSearchRowMenuId,
    successSearchRowMenuId,
    onPlayOption,
    onOptionsToggle,
    searchView = 'list',
    isQueueItem = false,
    onMoveUp,
    onMoveDown,
    onMoveNext,
    onRemove
  } = _ref2;
  const isActive = activeSearchRowMenuId != null && item.media_content_id != null && activeSearchRowMenuId === item.media_content_id;
  const isSuccess = successSearchRowMenuId === item.media_content_id;
  return x`
    <div class="search-row-slide-out ${isActive ? 'active' : ''}">
      ${isQueueItem && searchView === 'card' ? x`
        <button class="slide-out-button" @click=${() => {
    onMoveUp(item);
    onOptionsToggle(null);
  }} title="${localize('search.move_up')}">
          ${localize('search.move_up')}
        </button>
        <button class="slide-out-button" @click=${() => {
    onMoveDown(item);
    onOptionsToggle(null);
  }} title="${localize('search.move_down')}">
          ${localize('search.move_down')}
        </button>
        <button class="slide-out-button" @click=${() => {
    onMoveNext(item);
    onOptionsToggle(null);
  }} title="${localize('search.move_next')}">
          ${localize('search.move_next')}
        </button>
        <button class="slide-out-button" @click=${() => {
    onRemove(item);
    onOptionsToggle(null);
  }} title="${localize('search.remove')}">
          ${localize('search.remove')}
        </button>
      ` : x`
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'replace')} title="${localize('search.labels.replace')}">
          ${searchView === 'card' ? E : x`<ha-icon icon="mdi:playlist-remove"></ha-icon>`}${localize('search.labels.replace')}
        </button>
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'next')} title="${localize('search.labels.next')}">
          ${searchView === 'card' ? E : x`<ha-icon icon="mdi:playlist-play"></ha-icon>`}${localize('search.labels.next')}
        </button>
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'replace_next')} title="${localize('search.labels.replace_next')}">
          ${searchView === 'card' ? E : x`<ha-icon icon="mdi:playlist-music"></ha-icon>`}${localize('search.labels.replace_next')}
        </button>
        <button class="slide-out-button" @click=${() => onPlayOption(item, 'add')} title="${localize('search.labels.add')}">
          ${searchView === 'card' ? E : x`<ha-icon icon="mdi:playlist-plus"></ha-icon>`}${localize('search.labels.add')}
        </button>
      `}
      <div class="slide-out-close" @click=${e => {
    e.stopPropagation();
    onOptionsToggle(null);
  }}>
        <ha-icon icon="mdi:close"></ha-icon>
      </div>

      ${isSuccess ? x`
        <div class="search-row-success-overlay">
          <span>✅</span>
          <span>${localize('search.added')}</span>
        </div>
      ` : E}
    </div>
  `;
}
function renderSearchSheet(_ref3) {
  let {
    open,
    query,
    onQueryInput,
    onSearch,
    onClose,
    loading,
    results,
    onPlay,
    onQueue,
    error,
    showQueueSuccess,
    matchTheme = false,
    // Add matchTheme parameter
    upcomingFilterActive = false,
    // Add upcoming filter parameter
    disableAutofocus = false,
    activeSearchRowMenuId,
    successSearchRowMenuId,
    onOptionsToggle,
    onPlayOption,
    onResultClick,
    searchView = 'list',
    searchCardColumns = 4,
    massQueueAvailable = false,
    onMoveUp,
    onMoveDown,
    onMoveNext,
    onRemove
  } = _ref3;
  if (!open) return E;
  return x`
    <div class="search-sheet" data-match-theme="${matchTheme}" data-card-view="${searchView === 'card'}">
      <div class="search-sheet-header">
        <input
          type="text"
          .value=${query || ""}
          @input=${onQueryInput}
          placeholder="${localize('editor.placeholders.search')}"
          ?autofocus=${!disableAutofocus}
        />
        <button @click=${onSearch} ?disabled=${loading || !query}>${localize('common.search')}</button>
        <button @click=${onClose} title="${localize('search.close')}">✕</button>
      </div>
      ${loading ? x`<div class="search-sheet-loading">${localize('common.loading')}</div>` : E}
      ${error ? x`<div class="search-sheet-error">${error}</div>` : E}
      <div class="search-sheet-results ${searchView === 'card' ? 'search-results-card-view' : 'list-view'}">
        ${(results || []).length === 0 && !loading ? x`<div class="search-sheet-empty">${localize('common.no_results')}</div>` : (results || []).map(item => {
    const isMA = isMusicAssistantEntity(item.media_content_id);
    // For now we assume massQueue functionality is available if it's MA 
    // (matching simplified search-sheet logic)
    return x`
                <div class="search-sheet-result ${searchView === 'card' ? 'search-result-card' : ''}">
                  <div class="search-sheet-thumb-container" 
                       data-clickable="${searchView === 'card'}"
                       @click=${searchView === 'card' ? () => onPlay(item) : null}>
                    ${item.thumbnail && !String(item.thumbnail).includes('imageproxy') ? x`
                      <img
                        class="search-sheet-thumb"
                        src=${item.thumbnail}
                        alt=${item.title}
                        onerror="this.style.display='none'"
                      />
                    ` : x`
                      <div class="search-sheet-thumb-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `}
                    ${searchView === 'card' ? renderSearchResultActions({
      item,
      onPlay,
      onOptionsToggle,
      upcomingFilterActive,
      isMusicAssistant: isMA,
      massQueueAvailable,
      searchView: 'card',
      onMoveUp,
      onMoveDown,
      onMoveNext,
      onRemove
    }) : E}
                  </div>
                  <div class="search-sheet-info">
                    <span 
                      class="search-sheet-title ${item.is_browsable ? 'browsable' : ''}" 
                      @click=${() => item.is_browsable && onResultClick && onResultClick(item)}
                    >
                      ${item.title}
                    </span>
                    ${item.artist ? x`
                      <span 
                        class="search-sheet-subtitle ${item.is_browsable ? 'browsable' : ''}" 
                        @click=${() => item.is_browsable && onResultClick && onResultClick(item)}
                      >
                        ${item.artist}
                      </span>
                    ` : E}
                    ${searchView === 'card' ? x`
                      <div class="card-menu-button" @click=${e => {
      e.preventDefault();
      e.stopPropagation();
      onOptionsToggle(item);
    }}>
                        <ha-icon icon="mdi:dots-vertical"></ha-icon>
                      </div>
                    ` : E}
                  </div>
                  ${searchView !== 'card' ? renderSearchResultActions({
      item,
      onPlay,
      onOptionsToggle,
      upcomingFilterActive,
      isMusicAssistant: isMA,
      massQueueAvailable,
      searchView: 'list',
      isInline: true,
      onMoveUp,
      onMoveDown,
      onMoveNext,
      onRemove
    }) : E}
                  
                  ${renderSearchResultSlideOut({
      item,
      activeSearchRowMenuId,
      successSearchRowMenuId,
      onPlayOption,
      onOptionsToggle,
      searchView,
      isQueueItem: isMA && item.queue_item_id && upcomingFilterActive && massQueueAvailable,
      onMoveUp,
      onMoveDown,
      onMoveNext,
      onRemove
    })}
                </div>
              `;
  })}
      </div>
    </div>
  `;
}
function renderSearchOptionsOverlay(_ref4) {
  let {
    item,
    onClose,
    onPlayOption
  } = _ref4;
  if (!item) return E;
  return x`
    <div class="entity-options-overlay entity-options-overlay-opening" @click=${onClose}>
      <div class="entity-options-container entity-options-sheet-opening" @click=${e => e.stopPropagation()}>
        <div class="entity-options-sheet">
          <div class="entity-options-title">${item.title}</div>
          
          ${playOptions.map(option => x`
            <button class="entity-options-item menu-action-item" @click=${() => onPlayOption(item, option.mode)}>
              <ha-icon class="menu-action-icon" .icon=${option.icon}></ha-icon>
              <span class="menu-action-label">${option.label}</span>
            </button>
          `)}
          
          <div class="entity-options-divider"></div>
          
          <button class="entity-options-item close-item" @click=${onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
}

// Service helpers to keep search-related logic colocated with the search UI module
async function searchMedia(hass, entityId, query) {
  let mediaType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  let searchParams = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let searchResultsLimit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
  const configEntryId = await getMusicAssistantConfigEntryId(hass);
  // Try Music Assistant search if we have a config entry
  if (configEntryId) {
    try {
      // If favorites are requested, use Music Assistant get_library with favorite + search
      if (searchParams.favorites) {
        const mediaTypes = mediaType && mediaType !== 'all' ? [mediaType] : ['artist', 'album', 'track', 'playlist', 'radio', 'audiobook', 'podcast'];
        const flatResultsFav = [];
        await Promise.all(mediaTypes.map(async mt => {
          try {
            const message = {
              type: "call_service",
              domain: "music_assistant",
              service: "get_library",
              service_data: {
                config_entry_id: configEntryId,
                media_type: mt,
                favorite: true,
                search: query
              },
              return_response: true
            };
            const favoritesLimit = resolveLimitValue(searchResultsLimit);
            if (favoritesLimit !== undefined) {
              message.service_data.limit = favoritesLimit;
            }
            if (searchParams.orderBy && searchParams.orderBy !== 'default') {
              message.service_data.order_by = searchParams.orderBy;
            }
            const favRes = await hass.connection.sendMessagePromise(message);
            const favResponse = favRes === null || favRes === void 0 ? void 0 : favRes.response;
            const items = (favResponse === null || favResponse === void 0 ? void 0 : favResponse.items) || [];
            items.forEach(item => {
              const transformedItem = transformMusicAssistantItem(item);
              if (transformedItem) {
                flatResultsFav.push(transformedItem);
              }
            });
          } catch (error) {
            console.error('yamp: Error searching favorites for type', mt, error);
          }
        }));
        return {
          results: flatResultsFav,
          usedMusicAssistant: true
        };
      }

      // If query is empty and we have a specific media type (not 'all'), treat as browsing the library
      if ((!query || query.trim() === '') && mediaType && mediaType !== 'all' && !searchParams.favorites) {
        // Validate media type strictly
        const allowedMediaTypes = ['artist', 'album', 'track', 'playlist', 'radio', 'audiobook', 'podcast'];
        if (!allowedMediaTypes.includes(mediaType)) {
          console.warn(`yamp: Unsupported media type for browsing: ${mediaType}. Skipping get_library call.`);
          return {
            results: [],
            usedMusicAssistant: true
          };
        }
        try {
          const message = {
            type: "call_service",
            domain: "music_assistant",
            service: "get_library",
            service_data: {
              config_entry_id: configEntryId,
              media_type: mediaType
              // favorite param omitted to get ALL items
            },
            return_response: true
          };
          const limit = resolveLimitValue(searchResultsLimit);
          if (limit !== undefined) {
            message.service_data.limit = limit;
          }
          if (searchParams.orderBy && searchParams.orderBy !== 'default') {
            message.service_data.order_by = searchParams.orderBy;
          }
          const res = await hass.connection.sendMessagePromise(message);
          const response = res === null || res === void 0 ? void 0 : res.response;
          const items = (response === null || response === void 0 ? void 0 : response.items) || [];
          const browseResults = [];
          items.forEach(item => {
            const transformedItem = transformMusicAssistantItem(item);
            if (transformedItem) {
              browseResults.push(transformedItem);
            }
          });
          return {
            results: browseResults,
            usedMusicAssistant: true
          };
        } catch (error) {
          console.error('yamp: Error browsing library for type', mediaType, error);
          return {
            results: [],
            usedMusicAssistant: true
          };
        }
      }
      const serviceData = {
        name: query,
        config_entry_id: configEntryId
      };
      const searchLimit = resolveLimitValue(searchResultsLimit, {
        cap: mediaType === "all" ? 8 : undefined
      });
      if (searchLimit !== undefined) {
        serviceData.limit = searchLimit; // Use configurable limit for filtered searches
      }

      // Add media_type if specified and not "all"
      if (mediaType && mediaType !== 'all') {
        serviceData.media_type = mediaType;
      }

      // Add search parameters for hierarchical search
      if (searchParams.artist) {
        serviceData.artist = searchParams.artist;
      }
      if (searchParams.album) {
        serviceData.album = searchParams.album;
      }
      const msg = {
        type: "call_service",
        domain: "music_assistant",
        service: "search",
        service_data: serviceData,
        return_response: true
      };
      const res = await hass.connection.sendMessagePromise(msg);
      const response = res === null || res === void 0 ? void 0 : res.response;
      if (response) {
        // Convert grouped results to flat array and transform to expected format
        const flatResults = [];
        Object.entries(response).forEach(_ref5 => {
          let [mediaType, items] = _ref5;
          if (Array.isArray(items)) {
            items.forEach(item => {
              const transformedItem = transformMusicAssistantItem(item);
              if (transformedItem) {
                flatResults.push(transformedItem);
              }
            });
          }
        });
        return {
          results: flatResults,
          usedMusicAssistant: true
        };
      }
    } catch (error) {
      console.error('yamp: Error in searchMedia:', error);
    }
  }

  // Fallback to media_player search
  const fallbackResults = await fallbackToMediaPlayerSearch(hass, entityId, query, mediaType);
  return {
    results: fallbackResults,
    usedMusicAssistant: false
  };
}

// Get favorites from Music Assistant
async function getRecentlyPlayed(hass, entityId) {
  let mediaType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let searchResultsLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
  let options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const configEntryId = await getMusicAssistantConfigEntryId(hass);
  if (!configEntryId) {
    return {
      results: [],
      usedMusicAssistant: false
    };
  }
  const onChunk = typeof options.onChunk === "function" ? options.onChunk : null;
  const fetchMediaType = async function (mt) {
    var _response$response;
    let limitArgs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: {
        config_entry_id: configEntryId,
        media_type: mt,
        order_by: "last_played_desc"
      },
      return_response: true
    };
    const appliedLimit = resolveLimitValue(searchResultsLimit, limitArgs);
    if (appliedLimit !== undefined) {
      message.service_data.limit = appliedLimit;
    }
    const response = await hass.connection.sendMessagePromise(message);
    const items = (response === null || response === void 0 || (_response$response = response.response) === null || _response$response === void 0 ? void 0 : _response$response.items) || [];
    return items.map(transformMusicAssistantItem).filter(Boolean);
  };
  try {
    if (mediaType === 'all') {
      const mediaTypes = ['track', 'album', 'artist', 'playlist'];
      const allResults = [];
      await Promise.all(mediaTypes.map(async mt => {
        const chunk = await fetchMediaType(mt, {
          cap: 5
        });
        if (chunk.length) {
          allResults.push(...chunk);
          if (onChunk) {
            onChunk(chunk, mt);
          }
        }
      }));
      return {
        results: allResults,
        usedMusicAssistant: true
      };
    }
    const chunk = await fetchMediaType(mediaType || 'track');
    if (chunk.length && onChunk) {
      onChunk(chunk, mediaType || 'track');
    }
    return {
      results: chunk,
      usedMusicAssistant: true
    };
  } catch (error) {
    console.error('yamp: Error getting recently played from Music Assistant:', error);
    return {
      results: [],
      usedMusicAssistant: false
    };
  }
}
async function getFavorites(hass, entityId) {
  let mediaType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let searchResultsLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
  let options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const configEntryId = await getMusicAssistantConfigEntryId(hass);
  if (!configEntryId) {
    return {
      results: [],
      usedMusicAssistant: false
    };
  }
  const onChunk = typeof options.onChunk === "function" ? options.onChunk : null;
  const fetchFavoritesForType = async type => {
    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: {
        config_entry_id: configEntryId,
        media_type: type,
        favorite: true
      },
      return_response: true
    };
    const favoritesLimit = resolveLimitValue(searchResultsLimit, {
      cap: type === "all" ? 8 : undefined
    });
    if (favoritesLimit !== undefined) {
      message.service_data.limit = favoritesLimit;
    }
    if (options.orderBy && options.orderBy !== 'default') {
      message.service_data.order_by = options.orderBy;
    }
    try {
      const res = await hass.connection.sendMessagePromise(message);
      const response = res === null || res === void 0 ? void 0 : res.response;
      const items = (response === null || response === void 0 ? void 0 : response.items) || [];
      return items.map(transformMusicAssistantItem).filter(Boolean);
    } catch (error) {
      console.error('yamp: Error loading favorites for type', type, error);
      return [];
    }
  };
  try {
    if (mediaType && mediaType !== 'all') {
      const chunk = await fetchFavoritesForType(mediaType);
      if (chunk.length && onChunk) {
        onChunk(chunk, mediaType);
      }
      return {
        results: chunk,
        usedMusicAssistant: true
      };
    }
    const mediaTypes = ['artist', 'album', 'track', 'playlist', 'radio', 'podcast', 'audiobook'];
    const flatResults = [];
    await Promise.all(mediaTypes.map(async type => {
      const chunk = await fetchFavoritesForType(type);
      if (chunk.length) {
        flatResults.push(...chunk);
        if (onChunk) {
          onChunk(chunk, type);
        }
      }
    }));
    return {
      results: flatResults,
      usedMusicAssistant: true
    };
  } catch (error) {
    console.error('yamp: Error loading favorites', error);
    return {
      results: [],
      usedMusicAssistant: false
    };
  }
}

// Fallback function for media_player search
async function fallbackToMediaPlayerSearch(hass, entityId, query, mediaType) {
  var _fallbackRes$response;
  const fallbackData = {
    entity_id: entityId,
    search_query: query
  };
  if (mediaType && mediaType !== 'all') {
    fallbackData.media_content_type = mediaType;
  }

  // Note: Standard media_player search doesn't support advanced filtering
  // This would need to be handled by filtering results after the search

  const fallbackMsg = {
    type: "call_service",
    domain: "media_player",
    service: "search_media",
    service_data: fallbackData,
    return_response: true
  };
  const fallbackRes = await hass.connection.sendMessagePromise(fallbackMsg);
  const results = (fallbackRes === null || fallbackRes === void 0 || (_fallbackRes$response = fallbackRes.response) === null || _fallbackRes$response === void 0 || (_fallbackRes$response = _fallbackRes$response[entityId]) === null || _fallbackRes$response === void 0 ? void 0 : _fallbackRes$response.result) || (fallbackRes === null || fallbackRes === void 0 ? void 0 : fallbackRes.result) || [];
  return results;
}
function playSearchedMedia(hass, entityId, item) {
  return hass.callService("media_player", "play_media", {
    entity_id: entityId,
    media_content_type: item.media_content_type,
    media_content_id: item.media_content_id
  });
}

// Check if a track is favorited in Music Assistant
async function isTrackFavorited(hass, mediaContentId) {
  let entityId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let trackName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  let artistName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  let searchResultsLimit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 100;
  if (!mediaContentId) {
    return false;
  }
  try {
    const configEntryId = await getMusicAssistantConfigEntryId(hass);
    if (!configEntryId) {
      return false;
    }

    // Use the provided entityId or try to find a Music Assistant entity
    let targetEntityId = entityId;
    if (!targetEntityId) {
      // Try to find a Music Assistant entity
      const states = Object.values(hass.states);
      const maEntity = states.find(state => isMusicAssistantEntity(state) && state.entity_id.startsWith('media_player.'));
      if (maEntity) {
        targetEntityId = maEntity.entity_id;
      } else {
        return false;
      }
    }

    // First try: Direct MA search by title/artist and inspect item's own favorite flag
    if (trackName || artistName) {
      try {
        const serviceData = {
          name: trackName || artistName,
          config_entry_id: configEntryId,
          media_type: 'track'
        };
        const searchLimit = resolveLimitValue(searchResultsLimit);
        if (searchLimit !== undefined) {
          serviceData.limit = searchLimit;
        }
        if (artistName) {
          serviceData.artist = artistName;
        }
        const searchMsg = {
          type: 'call_service',
          domain: 'music_assistant',
          service: 'search',
          service_data: serviceData,
          return_response: true
        };
        const searchRes = await hass.connection.sendMessagePromise(searchMsg);
        const searchResponse = searchRes === null || searchRes === void 0 ? void 0 : searchRes.response;
        let searchItems = [];
        if (Array.isArray(searchResponse)) {
          searchItems = searchResponse;
        } else if (searchResponse && typeof searchResponse === 'object') {
          Object.values(searchResponse).forEach(val => {
            if (Array.isArray(val)) {
              searchItems.push(...val);
            }
          });
        }
        if (searchItems.length) {
          const idPart = (mediaContentId.split('/').pop() || '').trim();
          const byUri = searchItems.find(it => (it === null || it === void 0 ? void 0 : it.uri) === mediaContentId);
          const byId = !byUri && /^\d+$/.test(idPart) ? searchItems.find(it => typeof (it === null || it === void 0 ? void 0 : it.uri) === 'string' && it.uri.endsWith(`/${idPart}`)) : null;
          const foundItem = byUri || byId || null;
          if (foundItem && typeof foundItem.favorite === 'boolean') {
            return !!foundItem.favorite;
          }
        }
      } catch (e) {
        // Continue to next strategies
      }

      // Second try: Precise search with track name only (faster and simpler)
      if (trackName) {
        try {
          var _response$response2;
          const message = {
            type: "call_service",
            domain: "music_assistant",
            service: "get_library",
            service_data: {
              config_entry_id: configEntryId,
              media_type: "track",
              favorite: true,
              search: trackName.trim()
            },
            return_response: true
          };
          const trackSearchLimit = resolveLimitValue(searchResultsLimit);
          if (trackSearchLimit !== undefined) {
            message.service_data.limit = trackSearchLimit; // Use configurable limit
          }
          const response = await hass.connection.sendMessagePromise(message);
          const favoriteTracks = (response === null || response === void 0 || (_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.items) || [];
          if (favoriteTracks.some(track => track.uri === mediaContentId)) {
            return true;
          }
        } catch (e) {
          // Continue to fallback
        }
      }
    }

    // Fallback: Just get first 100 favorites (much faster than pagination)
    try {
      var _response$response3;
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_library",
        service_data: {
          config_entry_id: configEntryId,
          media_type: "track",
          favorite: true
        },
        return_response: true
      };
      const fallbackLimit = resolveLimitValue(searchResultsLimit, {
        floor: 100
      });
      if (fallbackLimit !== undefined) {
        message.service_data.limit = fallbackLimit; // Check at least 100 favorites for better matching
      }
      const response = await hass.connection.sendMessagePromise(message);
      const favoriteTracks = (response === null || response === void 0 || (_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : _response$response3.items) || [];
      return favoriteTracks.some(t => t.uri === mediaContentId);
    } catch (getLibraryError) {
      // Fallback to false if get_library fails
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Get playlist tracks - similar to how the sonos card gets queue contents

/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */
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
function extend$1(target, source) {
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
var extend_1 = extend$1;
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

// set a property of a literal object, while protecting against prototype pollution,
// see https://github.com/nodeca/js-yaml/issues/164 for more details
function setProperty(object, key, value) {
  // used for this specific key only because Object.defineProperty is slow
  if (key === '__proto__') {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: value
    });
  } else {
    object[key] = value;
  }
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
      setProperty(destination, key, source[key]);
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
    setProperty(_result, keyNode, valueNode);
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
const SUPPORT_VOLUME_MUTE = 8;
const SUPPORT_TURN_ON = 128;
const SUPPORT_TURN_OFF = 256;
const SUPPORT_STOP = 4096;
const SUPPORT_GROUPING = 524288;

/**!
 * Sortable 1.15.6
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
var version = "1.15.6";
function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !! /*@__PURE__*/navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var captureMode = {
  capture: false,
  passive: false
};
function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}
function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}
function matches(/**HTMLElement*/el, /**String*/selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}
function closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}
function css(el, prop, val) {
  var style = el && el.style;
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }
      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = '';
  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');
      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
      i = 0,
      n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}

/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode;

    // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect();

          // Set relative to edges of padding box of container
          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
      scaleX = elMatrix && elMatrix.a,
      scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }
  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}

/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
    elSideVal = getRect(el)[elSide];

  /* jshint boss:true */
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
      visible = void 0;
    {
      visible = elSideVal >= parentSideVal;
    }
    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}

/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0,
    i = 0,
    children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}

/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */
function lastChild(el, selector) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }
  return last || null;
}

/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */
function index(el, selector) {
  var index = 0;
  if (!el || !el.parentNode) {
    return -1;
  }

  /* jshint boss:true */
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }
  return index;
}

/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */
function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
    offsetTop = 0,
    winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el),
        scaleX = elMatrix.a,
        scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}

/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
        _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
function getChildContainingRectFromElement(container, options, ghostEl) {
  var rect = {};
  Array.from(container.children).forEach(function (child) {
    var _rect$left, _rect$top, _rect$right, _rect$bottom;
    if (!closest(child, options.draggable, container, false) || child.animated || child === ghostEl) return;
    var childRect = getRect(child);
    rect.left = Math.min((_rect$left = rect.left) !== null && _rect$left !== void 0 ? _rect$left : Infinity, childRect.left);
    rect.top = Math.min((_rect$top = rect.top) !== null && _rect$top !== void 0 ? _rect$top : Infinity, childRect.top);
    rect.right = Math.max((_rect$right = rect.right) !== null && _rect$right !== void 0 ? _rect$right : -Infinity, childRect.right);
    rect.bottom = Math.max((_rect$bottom = rect.bottom) !== null && _rect$bottom !== void 0 ? _rect$bottom : -Infinity, childRect.bottom);
  });
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
var expando = 'Sortable' + new Date().getTime();
function AnimationStateManager() {
  var animationStates = [],
    animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);

        // If animating: compensate for current animation
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }
      var animating = false,
        animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
          target = state.target,
          fromRect = target.fromRect,
          toRect = getRect(target),
          prevFromRect = target.prevFromRect,
          prevToRect = target.prevToRect,
          animatingRect = state.rect,
          targetMatrix = matrix(target, true);
        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) &&
          // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }

        // if fromRect != toRect: animate
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
          scaleX = elMatrix && elMatrix.a,
          scaleY = elMatrix && elMatrix.d,
          translateX = (currentRect.left - toRect.left) / (scaleX || 1),
          translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        this.forRepaintDummy = repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}
var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }
    plugins.forEach(function (p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function () {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return;
      // Fire global events if it exists in this sortable
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable: sortable
        }, evt));
      }

      // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;

      // Add default options from plugin
      _extends(defaults, initialized.defaults);
    });
    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);
      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return;

      // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
    rootEl = _ref.rootEl,
    name = _ref.name,
    targetEl = _ref.targetEl,
    cloneEl = _ref.cloneEl,
    toEl = _ref.toEl,
    fromEl = _ref.fromEl,
    oldIndex = _ref.oldIndex,
    newIndex = _ref.newIndex,
    oldDraggableIndex = _ref.oldDraggableIndex,
    newDraggableIndex = _ref.newDraggableIndex,
    originalEvent = _ref.originalEvent,
    putSortable = _ref.putSortable,
    extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
    options = sortable.options,
    onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  // Support for new CustomEvent feature
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }
  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
var _excluded = ["evt"];
var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    originalEvent = _ref.evt,
    data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}
var dragEl,
  parentEl,
  ghostEl,
  rootEl,
  nextEl,
  lastDownEl,
  cloneEl,
  cloneHidden,
  oldIndex,
  newIndex,
  oldDraggableIndex,
  newDraggableIndex,
  activeGroup,
  putSortable,
  awaitingDragStarted = false,
  ignoreNextClick = false,
  sortables = [],
  tapEvt,
  touchEvt,
  lastDx,
  lastDy,
  tapDistanceLeft,
  tapDistanceTop,
  moved,
  lastTarget,
  lastDirection,
  pastFirstInvertThresh = false,
  isCircumstantialInvert = false,
  targetMoveDistance,
  // For positioning ghost absolutely
  ghostRelativeParent,
  ghostRelativeParentInitialScroll = [],
  // (left, top)

  _silent = false,
  savedInputChecked = [];

/** @const */
var documentExists = typeof document !== 'undefined',
  PositionGhostAbsolutely = IOS,
  CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
  // This will not pass for IE9, because IE9 DnD only works on anchors
  supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
  supportCssPointerEvents = function () {
    if (!documentExists) return;
    // false when <= IE11
    if (IE11OrLess) {
      return false;
    }
    var el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    return el.style.pointerEvents === 'auto';
  }(),
  _detectDirection = function _detectDirection(el, options) {
    var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
    if (elCSS.display === 'flex') {
      return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
    }
    if (elCSS.display === 'grid') {
      return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
    }
    if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
      var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
      return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
    }
    return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
  },
  _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
    var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
    return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
  },
  /**
   * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
   * @param  {Number} x      X position
   * @param  {Number} y      Y position
   * @return {HTMLElement}   Element of the first found nearest Sortable
   */
  _detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
    var ret;
    sortables.some(function (sortable) {
      var threshold = sortable[expando].options.emptyInsertThreshold;
      if (!threshold || lastChild(sortable)) return;
      var rect = getRect(sortable),
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
      if (insideHorizontally && insideVertically) {
        return ret = sortable;
      }
    });
    return ret;
  },
  _prepareGroup = function _prepareGroup(options) {
    function toFn(value, pull) {
      return function (to, from, dragEl, evt) {
        var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
        if (value == null && (pull || sameGroup)) {
          // Default pull value
          // Default pull and put value if same group
          return true;
        } else if (value == null || value === false) {
          return false;
        } else if (pull && value === 'clone') {
          return value;
        } else if (typeof value === 'function') {
          return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
        } else {
          var otherGroup = (pull ? to : from).options.group.name;
          return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
        }
      };
    }
    var group = {};
    var originalGroup = options.group;
    if (!originalGroup || _typeof(originalGroup) != 'object') {
      originalGroup = {
        name: originalGroup
      };
    }
    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;
    options.group = group;
  },
  _hideGhostForTarget = function _hideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, 'display', 'none');
    }
  },
  _unhideGhostForTarget = function _unhideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, 'display', '');
    }
  };

// #1184 fix - Prevent click event on fallback if dragged but item not changed position
if (documentExists && !ChromeForAndroid) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      // Create imitation event
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};

/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el; // root element
  this.options = options = _extends({}, options);

  // Export instance
  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    // Disabled on Safari: #1571; Enabled on Safari IOS: #2244
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && (!Safari || IOS),
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults);

  // Set default options
  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }
  _prepareGroup(options);

  // Bind all private methods
  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  }

  // Setup drag mode
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  }

  // Bind events
  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }
  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }
  sortables.push(this.el);

  // Restore sorting
  options.store && options.store.get && this.sort(options.store.get(this) || []);

  // Add animation state manager
  _extends(this, AnimationStateManager());
}
Sortable.prototype = /** @lends Sortable.prototype */{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(/** Event|TouchEvent */evt) {
    if (!evt.cancelable) return;
    var _this = this,
      el = this.el,
      options = this.options,
      preventOnFilter = options.preventOnFilter,
      type = evt.type,
      touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
      target = (touch || evt).target,
      originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
      filter = options.filter;
    _saveInputCheckedState(el);

    // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    }

    // cancel dnd if original target is content editable
    if (originalTarget.isContentEditable) {
      return;
    }

    // Safari ignores further event handling after mousedown
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    }

    // Get the index of the dragged element within its parent
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);

    // Check filter
    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.preventDefault();
        return; // cancel dnd
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }

    // Prepare `dragstart`
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(/** Event */evt, /** Touch */touch, /** HTMLElement */target) {
    var _this = this,
      el = _this.el,
      options = _this.options,
      ownerDocument = el.ownerDocument,
      dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';
      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }

        // Bind the events: dragstart/dragend
        _this._triggerDragStart(evt, touch);

        // Drag start event
        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        });

        // Chosen item
        toggleClass(dragEl, options.chosenClass, true);
      };

      // Disable "draggable"
      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      if (options.supportPointer) {
        on(ownerDocument, 'pointerup', _this._onDrop);
        // Native D&D triggers pointercancel
        !this.nativeDraggable && on(ownerDocument, 'pointercancel', _this._onDrop);
      } else {
        on(ownerDocument, 'mouseup', _this._onDrop);
        on(ownerDocument, 'touchend', _this._onDrop);
        on(ownerDocument, 'touchcancel', _this._onDrop);
      }

      // Make dragEl draggable (must be before delay for FireFox)
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent('delayStart', this, {
        evt: evt
      });

      // Delay is impossible for native DnD in Edge or IE
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag
        if (options.supportPointer) {
          on(ownerDocument, 'pointerup', _this._disableDelayedDrag);
          on(ownerDocument, 'pointercancel', _this._disableDelayedDrag);
        } else {
          on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
          on(ownerDocument, 'touchend', _this._disableDelayedDrag);
          on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        }
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(/** TouchEvent|PointerEvent **/e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'pointerup', this._disableDelayedDrag);
    off(ownerDocument, 'pointercancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(/** Event */evt, /** Touch */touch) {
    touch = touch || evt.pointerType == 'touch' && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });
      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }
      var options = this.options;

      // Apply effect
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();

      // Drag start event
      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent; // store last element
        }
        /* jshint boss:true */ while (parent = getParentOrHost(parent));
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(/**TouchEvent*/evt) {
    if (tapEvt) {
      var options = this.options,
        fallbackTolerance = options.fallbackTolerance,
        fallbackOffset = options.fallbackOffset,
        touch = evt.touches ? evt.touches[0] : evt,
        ghostMatrix = ghostEl && matrix(ghostEl, true),
        scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
        scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
        relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
        dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
        dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);

      // only set the status to dragging, when we are actually dragging
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
        rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
        options = this.options;

      // Position absolutely
      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);

      // Set transform-origin
      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(/**Event*/evt, /**boolean*/fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent('setupClone', this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }

    // #1143: IFrame support workaround
    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);

    // Set proper drop events
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on(document, 'drop', _this);

      // #1276 fix:
      css(dragEl, 'transform', 'translateZ(0)');
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;
    window.getSelection().removeAllRanges();
    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(/**Event*/evt) {
    var el = this.el,
      target = evt.target,
      dragRect,
      targetRect,
      revert,
      options = this.options,
      group = options.group,
      activeSortable = Sortable.active,
      isOwner = activeGroup === group,
      canSort = options.sort,
      fromSortable = putSortable || activeSortable,
      vertical,
      _this = this,
      completedFired = false;
    if (_silent) return;
    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread2({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    }

    // Capture animation state
    function capture() {
      dragOverEvent('dragOverAnimationCapture');
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }

    // Return invocation when dragEl is inserted (or completed)
    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });
      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }

        // Animation
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }

      // Null lastTarget if it is not inside a previously swapped element
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }

      // no bubbling and not fallback
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);

        // Do not detect for empty insert if already inserted
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }

    // Call when dragEl has been inserted
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;
      if (revert) {
        parentEl = rootEl; // actualization
        capture();
        this._hideClone();
        dragOverEvent('revert');
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // Insert to end of list

        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        }

        // if there is a last element, it is the target
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          if (elLastChild && elLastChild.nextSibling) {
            // the last draggable element is not the last node
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        // Insert to start of list
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
          targetBeforeFirstSwap,
          differentLevel = dragEl.parentNode !== el,
          differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
          side1 = vertical ? 'top' : 'left',
          scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
          scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        }
        // If dragEl is already beside target: Do not insert
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
          after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }

          // Undo chrome's scroll adjustment (has no effect on other browsers)
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode; // actualization

          // must be done before animation
          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'pointercancel', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(/**Event*/evt) {
    var el = this.el,
      options = this.options;

    // Get the index of the dragged element within its parent
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode;

    // Get again after plugin event
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);

    // Unbind events
    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, 'user-select', '');
    }
    css(dragEl, 'transform', '');
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }
        _disableDraggable(dragEl);
        dragEl.style['will-change'] = '';

        // Remove classes
        // ghostClass is added in dragStarted
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);

        // Drag stop event
        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            // Remove event
            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            });

            // drag from one list and drop into another
            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          });

          // Save sorting
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(/**Event*/evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);
        break;
      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
      el,
      children = this.el.children,
      i = 0,
      n = children.length,
      options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {},
      rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];
      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },
  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);
    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    }
    // Remove draggable attributes
    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return;

      // show clone at dragEl or original position
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};
function _globalDragOver(/**Event*/evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
    sortable = fromEl[expando],
    onMoveFn = sortable.options.onMove,
    retVal;
  // Support for new CustomEvent feature
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var firstElRect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right : evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var lastElRect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left : evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
    targetLength = vertical ? targetRect.height : targetRect.width,
    targetS1 = vertical ? targetRect.top : targetRect.left,
    targetS2 = vertical ? targetRect.bottom : targetRect.right,
    invert = false;
  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}

/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
    i = str.length,
    sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn) {
  return setTimeout(fn, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}

// Fixed #973:
if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}

// Export utils
Sortable.utils = {
  on: on,
  off: off,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild,
  expando: expando
};

/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */
Sortable.get = function (element) {
  return element[expando];
};

/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */
Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }
  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};

/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */
Sortable.create = function (el, options) {
  return new Sortable(el, options);
};

// Export
Sortable.version = version;
var autoScrolls = [],
  scrollEl,
  scrollRootEl,
  scrolling = false,
  lastAutoScrollX,
  lastAutoScrollY,
  touchEvt$1,
  pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };

    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX,
        y = (evt.touches ? evt.touches[0] : evt).clientY,
        elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;

      // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);

        // Listener for pointer element change
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          // Detect for pointer elem change, emulating native DnD behaviour
          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
    y = (evt.touches ? evt.touches[0] : evt).clientY,
    sens = options.scrollSensitivity,
    speed = options.scrollSpeed,
    winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
    scrollCustomFn;

  // New scroll root, set scrollEl
  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent,
      rect = getRect(el),
      top = rect.top,
      bottom = rect.bottom,
      left = rect.left,
      right = rect.right,
      width = rect.width,
      height = rect.height,
      canScrollX = void 0,
      canScrollY = void 0,
      scrollWidth = el.scrollWidth,
      scrollHeight = el.scrollHeight,
      elCSS = css(el),
      scrollPosX = el.scrollLeft,
      scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }
    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */
        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);
var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
    putSortable = _ref.putSortable,
    dragEl = _ref.dragEl,
    activeSortable = _ref.activeSortable,
    dispatchSortableEvent = _ref.dispatchSortableEvent,
    hideGhostForTarget = _ref.hideGhostForTarget,
    unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};
function Revert() {}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
      putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable) {
      putSortable.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }
    this.sortable.animateAll();
    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};
_extends(Revert, {
  pluginName: 'revertOnSpill'
});
function Remove() {}
Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
      putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};
_extends(Remove, {
  pluginName: 'removeOnSpill'
});
Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

// import { LitElement, html, css } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import Sortable from "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/+esm";
class YampSortable extends i$2 {
  static get properties() {
    return {
      disabled: {
        type: Boolean
      },
      handleSelector: {
        type: String
      },
      draggableSelector: {
        type: String
      }
    };
  }
  static get styles() {
    return i$5`
      :host {
        display: block;
      }
      .sortable-fallback {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      .sortable-ghost {
        box-shadow: 0 0 0 2px var(--primary-color);
        background: rgba(var(--rgb-primary-color), 0.25);
        border-radius: 4px;
        opacity: 0.4;
      }
      .sortable-drag {
        border-radius: 4px;
        opacity: 1;
        background: var(--card-background-color);
        box-shadow: 0px 4px 8px 3px #00000026;
        cursor: grabbing;
      }
      /* Hide any fallback elements that might appear (mobile fix)*/
      .sortable-fallback,
      .sortable-fallback * {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
  }
  constructor() {
    super();
    this.disabled = false;
    this.handleSelector = ".handle";
    this.draggableSelector = ".sortable-item";
    this._sortable = null;
  }
  createRenderRoot() {
    return this;
  }
  render() {
    return x`
      <slot></slot>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.disabled) {
      this._createSortable();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._destroySortable();
  }
  updated(changedProperties) {
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this._destroySortable();
      } else {
        this._createSortable();
      }
    }
  }
  _createSortable() {
    if (this._sortable) return;
    const container = this.children[0];
    if (!container) return;
    const options = {
      scroll: true,
      forceAutoScrollFallback: true,
      scrollSpeed: 20,
      animation: 150,
      draggable: this.draggableSelector,
      handle: this.handleSelector,
      // Mobile-specific options to fix ghost issues
      fallbackTolerance: 3,
      fallbackOnBody: true,
      fallbackClass: "sortable-fallback",
      // Disable fallback on mobile to prevent ghost issues
      fallback: false,
      onChoose: this._handleChoose.bind(this),
      onStart: this._handleStart.bind(this),
      onEnd: this._handleEnd.bind(this),
      onUpdate: this._handleUpdate.bind(this)
    };
    this._sortable = new Sortable(container, options);
  }
  _handleUpdate(evt) {
    this.dispatchEvent(new CustomEvent("item-moved", {
      detail: {
        oldIndex: evt.oldIndex,
        newIndex: evt.newIndex
      },
      bubbles: true,
      composed: true
    }));
  }
  _handleEnd(evt) {
    // Clean up any remaining ghost elements
    this._cleanupGhostElements();

    // Put back in original location if needed
    if (evt.item.placeholder) {
      evt.item.placeholder.replaceWith(evt.item);
      delete evt.item.placeholder;
    }
  }
  _handleStart(evt) {
    // Ensure proper cleanup on start
    this._cleanupGhostElements();
  }
  _handleChoose(evt) {
    // Create placeholder to maintain layout
    evt.item.placeholder = document.createComment("sort-placeholder");
    evt.item.after(evt.item.placeholder);
  }
  _cleanupGhostElements() {
    // Remove any lingering ghost elements
    const ghostElements = document.querySelectorAll('.sortable-fallback, .sortable-ghost');
    ghostElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
  _destroySortable() {
    if (!this._sortable) return;
    this._sortable.destroy();
    this._sortable = null;
    // Clean up any remaining ghost elements
    this._cleanupGhostElements();
  }
}
customElements.define("yamp-sortable", YampSortable);

// import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';
const ADAPTIVE_TEXT_SELECTOR_OPTIONS = Object.freeze([{
  value: "details",
  label: localize('card.sections.details')
}, {
  value: "menu",
  label: localize('card.sections.menu')
}, {
  value: "action_chips",
  label: localize('card.sections.action_chips')
}]);
const ADAPTIVE_TEXT_SELECTOR_VALUES = ADAPTIVE_TEXT_SELECTOR_OPTIONS.map(opt => opt.value);
class YetAnotherMediaPlayerEditor extends i$2 {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _activeTab: {
        type: String
      },
      _entityEditorIndex: {
        type: Number
      },
      _actionEditorIndex: {
        type: Number
      },
      _actionMode: {
        type: String
      },
      _useTemplate: {
        type: Boolean
      },
      _useVolTemplate: {
        type: Boolean
      },
      _serviceItems: {
        type: Array
      }
    };
  }
  constructor() {
    super();
    this._activeTab = "entities";
    this._entityEditorIndex = null;
    this._actionEditorIndex = null;
    this._yamlDraft = "";
    this._parsedYaml = null;
    this._yamlError = false;
    this._serviceItems = [];
    this._useTemplate = null; // auto-detect per entity on open
    this._useVolTemplate = null; // auto-detect per entity on open
    this._artworkOverrides = [];
  }
  firstUpdated() {
    this._serviceItems = this._getServiceItems();
  }
  updated(changedProperties) {
    if (changedProperties.has("hass")) {
      var _this$hass;
      const oldHass = changedProperties.get("hass");
      if (((_this$hass = this.hass) === null || _this$hass === void 0 ? void 0 : _this$hass.services) !== (oldHass === null || oldHass === void 0 ? void 0 : oldHass.services)) {
        this._serviceItems = this._getServiceItems();
      }
    }
  }
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }
  _isGroupCapable(stateObj) {
    var _stateObj$attributes;
    if (!stateObj) return false;
    if (this._supportsFeature(stateObj, SUPPORT_GROUPING)) return true;
    return Array.isArray((_stateObj$attributes = stateObj.attributes) === null || _stateObj$attributes === void 0 ? void 0 : _stateObj$attributes.group_members);
  }
  _normalizeArtworkOverrides(overrides) {
    if (!Array.isArray(overrides)) return [];
    const matchKeys = ["media_title", "media_artist", "media_album_name", "media_content_id", "media_channel", "app_name", "media_content_type", "entity_id"];
    return overrides.map(item => {
      if (!item || typeof item !== "object") {
        return {
          match_type: "media_title",
          match_value: "",
          image_url: "",
          size_percentage: undefined,
          object_fit: undefined
        };
      }
      const sizePercentage = item.size_percentage;
      if (item.missing_art_url !== undefined) {
        return {
          match_type: "missing_art",
          match_value: "",
          image_url: item.missing_art_url ?? "",
          size_percentage: sizePercentage,
          object_fit: item.object_fit
        };
      }
      let matchType = "media_title";
      let matchValue = "";
      for (const key of matchKeys) {
        if (item[key] !== undefined) {
          matchType = key;
          matchValue = item[key] ?? "";
          break;
        }
        const legacyKey = `${key}_equals`;
        if (item[legacyKey] !== undefined) {
          matchType = key;
          matchValue = item[legacyKey] ?? "";
          break;
        }
      }
      return {
        match_type: matchType,
        match_value: matchValue ?? "",
        image_url: item.image_url ?? "",
        size_percentage: sizePercentage,
        object_fit: item.object_fit
      };
    });
  }
  _serializeArtworkOverride(rule) {
    if (!rule) return null;
    const image = (rule.image_url ?? "").trim();
    if (!image) return null;
    const objectFit = rule.object_fit === "default" ? undefined : rule.object_fit;
    if (rule.match_type === "missing_art") {
      return {
        missing_art_url: image,
        ...(rule.size_percentage !== undefined ? {
          size_percentage: Number(rule.size_percentage)
        } : {}),
        ...(objectFit !== undefined ? {
          object_fit: objectFit
        } : {})
      };
    }
    const value = (rule.match_value ?? "").trim();
    if (!value) return null;
    return {
      image_url: image,
      [rule.match_type]: value,
      ...(rule.size_percentage !== undefined ? {
        size_percentage: Number(rule.size_percentage)
      } : {}),
      ...(objectFit !== undefined ? {
        object_fit: objectFit
      } : {})
    };
  }
  _writeArtworkOverrides(list) {
    this._artworkOverrides = list;
    const serialized = list.map(rule => this._serializeArtworkOverride(rule)).filter(item => item);
    this._updateConfig("media_artwork_overrides", serialized.length ? serialized : undefined);
  }
  _getServiceItems() {
    var _this$hass2;
    if (!((_this$hass2 = this.hass) !== null && _this$hass2 !== void 0 && _this$hass2.services)) return [];
    return Object.entries(this.hass.services).flatMap(_ref => {
      let [domain, services] = _ref;
      return Object.keys(services).map(svc => ({
        label: `${domain}.${svc}`,
        value: `${domain}.${svc}`
      }));
    });
  }

  // Helper functions for ha-generic-picker (entity selection)
  _getEntityItems() {
    let domains = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let excludeEntities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return () => {
      var _this$hass3;
      if (!((_this$hass3 = this.hass) !== null && _this$hass3 !== void 0 && _this$hass3.states)) return [];
      return Object.keys(this.hass.states).filter(entityId => {
        const domain = entityId.split(".")[0];
        if (domains.length && !domains.includes(domain)) return false;
        if (excludeEntities.includes(entityId)) return false;
        return true;
      }).map(entityId => {
        var _stateObj$attributes2;
        const stateObj = this.hass.states[entityId];
        return {
          id: entityId,
          primary: (stateObj === null || stateObj === void 0 || (_stateObj$attributes2 = stateObj.attributes) === null || _stateObj$attributes2 === void 0 ? void 0 : _stateObj$attributes2.friendly_name) || entityId,
          secondary: entityId
        };
      });
    };
  }
  _entityValueRenderer(entityId) {
    var _this$hass4, _stateObj$attributes3;
    if (!entityId) return "";
    const stateObj = (_this$hass4 = this.hass) === null || _this$hass4 === void 0 || (_this$hass4 = _this$hass4.states) === null || _this$hass4 === void 0 ? void 0 : _this$hass4[entityId];
    return (stateObj === null || stateObj === void 0 || (_stateObj$attributes3 = stateObj.attributes) === null || _stateObj$attributes3 === void 0 ? void 0 : _stateObj$attributes3.friendly_name) || entityId;
  }
  _entityRowRenderer(item) {
    var _this$hass5;
    return x`
      <ha-list-item twoline graphic="icon">
        <ha-state-icon
          slot="graphic"
          .hass=${this.hass}
          .stateObj=${(_this$hass5 = this.hass) === null || _this$hass5 === void 0 || (_this$hass5 = _this$hass5.states) === null || _this$hass5 === void 0 ? void 0 : _this$hass5[item.id]}
        ></ha-state-icon>
        <span>${item.primary}</span>
        <span slot="secondary">${item.secondary}</span>
      </ha-list-item>
    `;
  }
  _getAdaptiveTextTargetsValue() {
    var _this$_config, _this$_config2;
    if (Array.isArray((_this$_config = this._config) === null || _this$_config === void 0 ? void 0 : _this$_config.adaptive_text_targets)) {
      return this._config.adaptive_text_targets.filter(value => ADAPTIVE_TEXT_SELECTOR_VALUES.includes(value));
    }
    return ((_this$_config2 = this._config) === null || _this$_config2 === void 0 ? void 0 : _this$_config2.adaptive_text) === true ? [...ADAPTIVE_TEXT_SELECTOR_VALUES] : [];
  }
  _onAdaptiveTextTargetsChanged(value) {
    const list = Array.isArray(value) ? value.filter(item => ADAPTIVE_TEXT_SELECTOR_VALUES.includes(item)) : [];
    this._updateConfig("adaptive_text_targets", list);
  }
  _looksLikeTemplate(val) {
    if (typeof val !== "string") return false;
    const s = val.trim();
    return s.includes("{{") || s.includes("{%");
  }
  _isEntityId(val) {
    return typeof val === "string" && /^[a-z_]+\.[a-zA-Z0-9_]+$/.test(val.trim());
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
    this._artworkOverrides = this._normalizeArtworkOverrides(config.media_artwork_overrides);
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
  _addArtworkOverride() {
    const list = [...(this._artworkOverrides ?? [])];
    list.push({
      match_type: "media_title",
      match_value: "",
      image_url: "",
      size_percentage: undefined,
      object_fit: undefined
    });
    this._writeArtworkOverrides(list);
  }
  _removeArtworkOverride(index) {
    const list = [...(this._artworkOverrides ?? [])];
    if (index < 0 || index >= list.length) return;
    list.splice(index, 1);
    this._writeArtworkOverrides(list);
  }
  _onArtworkMatchTypeChange(index, newType) {
    if (!newType) return;
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    const updated = {
      ...list[index],
      match_type: newType
    };
    if (newType === "missing_art") {
      updated.match_value = "";
    }
    list[index] = updated;
    this._writeArtworkOverrides(list);
  }
  _onArtworkMatchValueChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    list[index] = {
      ...list[index],
      match_value: value
    };
    this._writeArtworkOverrides(list);
  }
  _onArtworkImageUrlChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    list[index] = {
      ...list[index],
      image_url: value
    };
    this._writeArtworkOverrides(list);
  }
  _onArtworkSizePercentageChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    if (value === "") {
      list[index] = {
        ...list[index],
        size_percentage: undefined
      };
    } else {
      const num = Number(value);
      if (Number.isFinite(num)) {
        list[index] = {
          ...list[index],
          size_percentage: num
        };
      } else {
        return; // Ignore invalid numeric input
      }
    }
    this._writeArtworkOverrides(list);
  }
  _onArtworkObjectFitChange(index, value) {
    const list = [...(this._artworkOverrides ?? [])];
    if (!list[index]) return;
    const finalValue = value === "default" ? undefined : value;
    list[index] = {
      ...list[index],
      object_fit: finalValue
    };
    this._writeArtworkOverrides(list);
  }
  _onArtworkMoved(e) {
    const {
      oldIndex,
      newIndex
    } = e.detail ?? {};
    const list = [...(this._artworkOverrides ?? [])];
    if (oldIndex === undefined || newIndex === undefined) return;
    if (oldIndex < 0 || newIndex < 0 || oldIndex >= list.length || newIndex >= list.length) return;
    const [moved] = list.splice(oldIndex, 1);
    list.splice(newIndex, 0, moved);
    this._writeArtworkOverrides(list);
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
      // Enforce single trigger per gesture (Tap, Hold, Double Tap)
      if (key === "card_trigger" && value && value !== "none") {
        actions.forEach((act, i) => {
          if (i !== idx && act.card_trigger === value) {
            actions[i] = {
              ...act,
              card_trigger: "none"
            };
          }
        });
      }
      const newAction = {
        ...actions[idx],
        [key]: value
      };

      // If we're setting in_menu, remove the legacy placement property
      if (key === "in_menu") {
        delete newAction.placement;
      }
      actions[idx] = newAction;
      this._updateConfig("actions", actions);
    }
  }
  _deriveActionMode(action) {
    if (!action) return "service";
    if (action.action === "sync_selected_entity" || action.sync_entity_helper) return "sync_selected_entity";
    if (typeof action.menu_item === "string" && action.menu_item.trim() !== "") return "menu";
    const navPath = typeof action.navigation_path === "string" ? action.navigation_path.trim() : "";
    if (action.action === "navigate" || navPath) return "navigate";
    return "service";
  }
  static get styles() {
    return i$5`
        .form-row {
          padding: 12px 16px;
          gap: 8px;
        }
        .tabs {
          display: flex;
          gap: 4px;
          padding: 8px 8px 0 8px;
          border-bottom: 1px solid var(--divider-color, #444);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabs::-webkit-scrollbar {
          display: none;
        }
        .tab {
          background: transparent;
          border: none;
          color: var(--primary-text-color, #fff);
          cursor: pointer;
          padding: 9px 14px;
          border-radius: 8px 8px 0 0;
          font-weight: 500;
          opacity: 0.85;
          border-bottom: 3px solid transparent;
          transition: color var(--transition, 0.2s), background var(--transition, 0.2s), opacity var(--transition, 0.2s), border-color var(--transition, 0.2s);
          font-size: 1.06em;
          flex: 0 0 auto;
        }
        
        
        .tab:hover {
          opacity: 1;
          color: var(--custom-accent, var(--accent-color, #ff9800));
          background: rgba(255,255,255,0.06);
        }
        .tab[selected] {
          background: rgba(255,255,255,0.10);
          color: var(--primary-text-color, #fff);
          opacity: 1;
          border-bottom-color: var(--custom-accent, var(--accent-color, #ff9800));
          box-shadow: 0 2px 0 0 var(--custom-accent, var(--accent-color, #ff9800)) inset;
        }
        .tab:focus-visible {
          outline: 2px solid var(--custom-accent, var(--accent-color, #ff9800));
          outline-offset: 2px;
        }
        .tab-content {
          padding-top: 4px;
        }
        /* add to rows with multiple elements to align the elements horizontally */
        .form-row-multi-column {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .form-row-multi-column > div {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
        }
        .form-row-multi-column > div.number-input-with-note {
          flex-direction: column;
          align-items: stretch;
          gap: 4px;
        }
        .config-subtitle.warning {
          color: var(--error-color, #f44336);
          font-style: normal;
          margin-top: 6px;
        }
        #search-limit-reset {
          align-self: flex-start;
          margin-top: 6px;
        }
        .config-subtitle {
          font-size: 0.85em;
          color: var(--secondary-text-color, #888);
          margin-top: 4px;
          line-height: 1.3;
          font-style: italic;
        }
        .form-label {
          display: block;
          font-weight: 600;
          font-size: 0.95em;
          color: var(--primary-text-color, #fff);
          margin-bottom: 2px;
        }
        .form-row-compact {
          padding-top: 4px;
          padding-bottom: 4px;
        }
        /* reduced padding for entity selection subrows */
        .entity-row {
          padding: 6px;
        }
        /* visually isolate grouped controls */
        .config-section,
        .entity-group,
        .action-group {
          background: var(--yamp-section-bg, var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.02))));
          border: 1px solid var(--yamp-section-border, var(--divider-color, rgba(255,255,255,0.1)));
          border-radius: var(--yamp-section-radius, 12px);
          margin: 16px 0;
          overflow: hidden;
        }
        .config-section:first-of-type,
        .entity-group:first-of-type,
        .action-group:first-of-type {
          margin-top: 8px;
        }
        .config-section .form-row + .form-row,
        .entity-group .form-row + .form-row,
        .action-group .form-row + .form-row {
          border-top: 1px solid var(--yamp-section-divider, rgba(255,255,255,0.06));
        }
        .section-header,
        .entity-group-header,
        .action-group-header {
          display: block;
          padding: 12px 16px 0 16px;
          width: 100%;
        }
        .section-title,
        .entity-group-title,
        .action-group-title {
          font-size: var(--yamp-section-title-size, 1em);
          font-weight: var(--yamp-section-title-weight, 600);
        }
        .section-description {
          display: block;
          align-self: stretch;
          font-size: var(--yamp-section-description-size, 0.9em);
          color: var(--yamp-section-description-color, var(--secondary-text-color, #888));
          margin-top: 2px;
          line-height: 1.4;
          width: 100%;
          box-sizing: border-box;
          padding-right: 24px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
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
        .entity-group-header,
        .action-group-header {
          width: 100%;
        }
        .entity-group-actions,
        .action-group-actions {
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
        }
        .handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          cursor: grab;
          color: var(--secondary-text-color);
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .handle:hover {
          opacity: 1;
        }
        .handle:active {
          cursor: grabbing;
        }
        .handle-disabled {
          opacity: 0.3;
          cursor: default;
          pointer-events: none;
        }
        .handle-disabled:hover {
          opacity: 0.3;
        }
        .action-icon {
          align-self: flex-start;
          padding-top: 16px;
        }
        .action-handle {
          align-self: flex-start;
          padding-top: 18px;
        }
        .action-row-actions {
          padding-top: 2px;
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
        .help-text pre {
          margin: 8px 0 0 0;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.92em;
          white-space: pre-wrap;
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
        .icon-button-compact {
          padding: 6px;
        }
        .icon-button:hover {
          color: var(--primary-color, #2196f3);
        }
        .icon-button-disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        .icon-button-toggle {
          opacity: 0.8;
        }
        .icon-button-toggle.active {
          color: var(--custom-accent, var(--accent-color, #ff9800));
          opacity: 1;
        }
        .help-text {
          padding: 12px 25px;
        }
        .add-action-button-wrapper {
          display: flex;
          justify-content: center;
        }
        .artwork-row .artwork-fields {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .config-subtitle.small {
          font-size: 0.9em;
          opacity: 0.75;
          margin: 2px 0 0 0;
        }
      `;
  }
  render() {
    var _this$_config$entitie, _this$_config$actions;
    if (!this._config) return x``;

    // When editing an entity/action, keep tabs visible but show editor content
    const editingEntity = this._entityEditorIndex !== null;
    const editingAction = this._actionEditorIndex !== null;
    return x`
        <div class="tabs">
          ${["entities", "behavior", "look_and_feel", "artwork", "actions"].map(key => {
      const name = localize(`editor.tabs.${key}`);
      return x`
              <button
                class="tab" ${this._activeTab === key ? 'selected' : ''}
                @click=${() => {
        this._activeTab = key;
        // Exit any sub-editor when switching tabs
        this._entityEditorIndex = null;
        this._actionEditorIndex = null;
        this._useTemplate = null;
        this._useVolTemplate = null;
      }}
                ?selected=${this._activeTab === key}
              >${name}</button>
            `;
    })}
        </div>
        <div class="tab-content">
          ${editingEntity ? this._renderEntityEditor((_this$_config$entitie = this._config.entities) === null || _this$_config$entitie === void 0 ? void 0 : _this$_config$entitie[this._entityEditorIndex]) : editingAction ? this._renderActionEditor((_this$_config$actions = this._config.actions) === null || _this$_config$actions === void 0 ? void 0 : _this$_config$actions[this._actionEditorIndex]) : this._renderActiveTab()}
        </div>
      `;
  }
  _renderArtworkTab() {
    const overrides = [...(this._artworkOverrides ?? [])];
    const matchOptions = [{
      value: "media_title",
      label: "Media Title"
    }, {
      value: "media_artist",
      label: "Media Artist"
    }, {
      value: "media_album_name",
      label: "Album Name"
    }, {
      value: "media_content_id",
      label: "Content ID"
    }, {
      value: "media_channel",
      label: "Channel"
    }, {
      value: "app_name",
      label: "App Name"
    }, {
      value: "media_content_type",
      label: "Content Type"
    }, {
      value: "entity_id",
      label: "Entity ID"
    }, {
      value: "missing_art",
      label: "Missing Artwork"
    }];
    return x`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.artwork.general.title')}</div>
            <div class="section-description">${localize('editor.sections.artwork.general.description')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${localize('editor.fields.artwork_fit')}"
                .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "cover",
          label: "Cover (default)"
        }, {
          value: "contain",
          label: "Contain"
        }, {
          value: "fill",
          label: "Fill"
        }, {
          value: "scale-down",
          label: "Scale Down"
        }, {
          value: "scaled-contain",
          label: "Scaled Contain"
        }, {
          value: "none",
          label: "None"
        }]
      }
    }}
                .value=${this._config.artwork_object_fit ?? "cover"}
                @value-changed=${e => {
      const value = e.detail.value;
      this._updateConfig("artwork_object_fit", value === "cover" ? undefined : value);
    }}
              ></ha-selector>
            </div>
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${localize('editor.fields.artwork_position')}"
                .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "top center",
          label: "Top (default)"
        }, {
          value: "center center",
          label: "Center"
        }, {
          value: "bottom center",
          label: "Bottom"
        }]
      }
    }}
                .value=${this._config.artwork_position ?? "top center"}
                @value-changed=${e => {
      const value = e.detail.value;
      this._updateConfig("artwork_position", value === "top center" ? undefined : value);
    }}
              ></ha-selector>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="extend-artwork-toggle"
                .checked=${this._config.extend_artwork === true}
                @change=${e => this._updateConfig("extend_artwork", e.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="extend-artwork-toggle" style="font-weight: 500;">${localize('editor.subtitles.artwork_extend_label')}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${localize('editor.subtitles.artwork_extend')}</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${localize('editor.fields.artwork_hostname')}"
              .value=${this._config.artwork_hostname ?? ""}
              @input=${e => this._updateConfig("artwork_hostname", e.target.value)}
              helper="e.g. http://192.168.1.50:8123"
              .helperPersistent=${true}
            ></ha-textfield>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.artwork.idle.title')}</div>
            <div class="section-description">${localize('editor.sections.artwork.idle.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="idle-image-url-toggle"
                .checked=${this._useIdleImageUrl ?? this._looksLikeUrlOrPath(this._config.idle_image)}
                @change=${e => {
      this._useIdleImageUrl = e.target.checked;
      if (e.target.checked) {
        this._updateConfig("idle_image", "");
      } else {
        this._updateConfig("idle_image", "");
      }
    }}
              ></ha-switch>
              <label for="idle-image-url-toggle">${localize('editor.labels.use_url_path')}</label>
            </div>
            <div style="flex: 2;">
              ${this._useIdleImageUrl ? x`
                <ha-textfield
                  class="full-width"
                  placeholder="e.g., https://example.com/image.jpg or /local/custom/image.jpg"
                  .value=${this._config.idle_image ?? ""}
                  @input=${e => this._updateConfig("idle_image", e.target.value)}
                  helper="${localize('editor.subtitles.image_url_helper')}"
                  .helperPersistent=${true}
                ></ha-textfield>
              ` : x`
                <ha-generic-picker
                  class="full-width"
                  .hass=${this.hass}
                  .value=${this._config.idle_image ?? ""}
                  .label=${localize('editor.fields.idle_image_entity')}
                  .valueRenderer=${v => this._entityValueRenderer(v)}
                  .rowRenderer=${item => this._entityRowRenderer(item)}
                  .getItems=${this._getEntityItems(["camera", "image"])}
                  @value-changed=${e => this._updateConfig("idle_image", e.detail.value)}
                  allow-custom-value
                ></ha-generic-picker>
              `}
            </div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.artwork.overrides.title')}</div>
            <div class="section-description">${localize('editor.sections.artwork.overrides.description')}</div>
          </div>
          <yamp-sortable @item-moved=${e => this._onArtworkMoved(e)}>
            <div class="sortable-container">
              ${overrides.length ? overrides.map((rule, idx) => x`
                    <div class="action-row-inner sortable-item artwork-row">
                      <div class="handle action-handle">
                        <ha-icon icon="mdi:drag"></ha-icon>
                      </div>
                      <div class="artwork-fields">
                        <ha-selector
                          .hass=${this.hass}
                          label="${localize('editor.fields.match_field')}"
                          .selector=${{
      select: {
        mode: "dropdown",
        options: matchOptions
      }
    }}
                          .value=${rule.match_type ?? "media_title"}
                          @value-changed=${e => this._onArtworkMatchTypeChange(idx, e.detail.value)}
                        ></ha-selector>
                        ${rule.match_type === "missing_art" ? x`
                                <div class="config-subtitle small">
                                  Applies when the selected media provides no artwork.
                                </div>
                              ` : rule.match_type === "entity_id" ? x`
                                  <ha-generic-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .value=${rule.match_value ?? ""}
                                    .label=${localize('editor.fields.match_entity')}
                                    .valueRenderer=${v => this._entityValueRenderer(v)}
                                    .rowRenderer=${item => this._entityRowRenderer(item)}
                                    .getItems=${this._getEntityItems(["media_player"])}
                                    @value-changed=${e => this._onArtworkMatchValueChange(idx, e.detail.value)}
                                    allow-custom-value
                                  ></ha-generic-picker>
                                ` : x`
                                  <ha-textfield
                                    class="full-width"
                                    label="${localize('editor.fields.match_value')}"
                                    .value=${rule.match_value ?? ""}
                                    @input=${e => this._onArtworkMatchValueChange(idx, e.target.value)}
                                  ></ha-textfield>
                                `}
                        <ha-textfield
                          class="full-width"
                          label=${rule.match_type === "missing_art" ? localize('editor.fields.fallback_image_url') : localize('editor.fields.image_url')}
                          .value=${rule.image_url ?? ""}
                          @input=${e => this._onArtworkImageUrlChange(idx, e.target.value)}
                        ></ha-textfield>
                        <div class="form-row-multi-column" style="gap:12px; flex-wrap:wrap; align-items:flex-start;">
                          <div class="grow-children" style="flex:1;">
                            <ha-textfield
                              class="full-width"
                              label="${localize('editor.fields.size_percent')}"
                              type="number"
                              min="1"
                              max="100"
                              .value=${rule.size_percentage ?? ""}
                              @input=${e => this._onArtworkSizePercentageChange(idx, e.target.value)}
                            ></ha-textfield>
                          </div>
                          <div class="grow-children" style="flex:1.5;">
                            <ha-selector
                              .hass=${this.hass}
                              label="${localize('editor.fields.object_fit')}"
                              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "default",
          label: "Default"
        }, {
          value: "cover",
          label: "Cover"
        }, {
          value: "contain",
          label: "Contain"
        }, {
          value: "fill",
          label: "Fill"
        }, {
          value: "scale-down",
          label: "Scale Down"
        }, {
          value: "scaled-contain",
          label: "Scaled Contain"
        }, {
          value: "none",
          label: "None"
        }]
      }
    }}
                              .value=${rule.object_fit || "default"}
                              @value-changed=${e => this._onArtworkObjectFitChange(idx, e.detail.value)}
                            ></ha-selector>
                          </div>
                        </div>
                      </div>
                      <div class="action-row-actions">
                        <ha-icon
                          class="icon-button"
                          icon="mdi:trash-can"
                          title="Delete Override"
                          @click=${() => this._removeArtworkOverride(idx)}
                        ></ha-icon>
                      </div>
                    </div>
                  `) : x`<div class="config-subtitle" style="padding:12px 0;text-align:center;">${localize('editor.subtitles.no_artwork_overrides')}</div>`}
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="${localize('editor.titles.add_artwork_override')}"
              @click=${this._addArtworkOverride}
            ></ha-icon>
          </div>
        </div>
        </div>

      `;
  }
  _renderActiveTab() {
    switch (this._activeTab) {
      case "entities":
        return this._renderEntitiesTab();
      case "behavior":
        return this._renderBehaviorTab();
      case "look_and_feel":
        return this._renderVisualTab();
      case "artwork":
        return this._renderArtworkTab();
      case "actions":
        return this._renderActionsTab();
      default:
        return this._renderEntitiesTab();
    }
  }
  _renderEntitiesTab() {
    if (!this._config) return x``;
    let entities = [...(this._config.entities ?? [])];
    if (entities.length === 0 || entities[entities.length - 1].entity_id) {
      entities.push({
        entity_id: ""
      });
    }
    return x`
        <div class="entity-group">
          <div class="entity-group-header section-header">
            <div class="entity-group-title section-title">${localize('editor.sections.entities.title')}</div>
            <div class="section-description">${localize('editor.sections.entities.description')}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${e => this._onEntityMoved(e)}>
              <div class="sortable-container">
                ${entities.map((ent, idx) => {
      var _this$_config$entitie2;
      return x`
                  <div class="entity-row-inner ${idx < entities.length - 1 ? 'sortable-item' : ''}" data-index="${idx}">
                    <div class="handle ${idx === entities.length - 1 ? 'handle-disabled' : ''}">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    <div class="grow-children">
                      <ha-generic-picker
                        class="full-width"
                        style="display: block; width: 100%;"
                        .hass=${this.hass}
                        .value=${ent.entity_id || ""}
                        .label=${localize('common.media_player')}
                        .valueRenderer=${v => this._entityValueRenderer(v)}
                        .rowRenderer=${item => this._entityRowRenderer(item)}
                        .getItems=${this._getEntityItems(["media_player"], idx === entities.length - 1 && !ent.entity_id ? ((_this$_config$entitie2 = this._config.entities) === null || _this$_config$entitie2 === void 0 ? void 0 : _this$_config$entitie2.map(e => e.entity_id)) ?? [] : [])}
                        @value-changed=${e => this._onEntityChanged(idx, e.detail.value)}
                        allow-custom-value
                      ></ha-generic-picker>
                    </div>
                    <div class="entity-row-actions">
                      <ha-icon
                        class="icon-button ${!ent.entity_id ? "icon-button-disabled" : ""}"
                        icon="mdi:pencil"
                        title="${localize('common.edit_entity')}"
                        @click=${() => this._onEditEntity(idx)}
                      ></ha-icon>
                    </div>
                  </div>
                `;
    })}
              </div>
            </yamp-sortable>
          </div>
        </div>
      `;
  }
  _renderBehaviorTab() {
    var _this$_config$entitie3, _this$_config$entitie4, _this$_config$entitie5;
    const searchLimitWarningActive = Number(this._config.search_results_limit) > 100;
    return x`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.behavior.idle_chips.title')}</div>
            <div class="section-description">${localize('editor.sections.behavior.idle_chips.description')}</div>
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
                label="${localize('editor.fields.idle_timeout')}"
                @value-changed=${e => this._updateConfig("idle_timeout_ms", e.detail.value)}
              ></ha-selector>
              <div class="config-subtitle">${localize('editor.subtitles.idle_timeout')}</div>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${localize('common.reset_default')}"
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
          value: "auto",
          label: "Auto"
        }, {
          value: "always",
          label: "Always"
        }, {
          value: "in_menu",
          label: "In Menu"
        }, {
          value: "in_menu_on_idle",
          label: "In Menu on Idle"
        }]
      }
    }}
              .value=${this._config.show_chip_row ?? "auto"}
              label="${localize('editor.fields.show_chip_row')}"
              @value-changed=${e => this._updateConfig("show_chip_row", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.show_chip_row')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dim-chips-on-idle-toggle"
                .checked=${this._config.dim_chips_on_idle ?? true}
                @change=${e => this._updateConfig("dim_chips_on_idle", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.dim_chips')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.dim_chips')}</div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.behavior.interactions_search.title')}</div>
            <div class="section-description">${localize('editor.sections.behavior.interactions_search.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="hold-to-pin-toggle"
                .checked=${this._config.hold_to_pin ?? false}
                @change=${e => this._updateConfig("hold_to_pin", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.hold_to_pin')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.hold_to_pin')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.disable_autofocus ?? false}
                @change=${e => this._updateConfig("disable_autofocus", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.disable_autofocus')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.disable_autofocus')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.keep_filters_on_search ?? false}
                @change=${e => this._updateConfig("keep_filters_on_search", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.keep_filters')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.search_within_filter')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dismiss-search-on-play-toggle"
                .checked=${this._config.dismiss_search_on_play ?? true}
                @change=${e => this._updateConfig("dismiss_search_on_play", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.dismiss_on_play')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.close_search_on_play')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div style="${((_this$_config$entitie3 = this._config.entities) === null || _this$_config$entitie3 === void 0 ? void 0 : _this$_config$entitie3.length) === 1 && this._config.always_collapsed === true && this._config.expand_on_search !== true ? "opacity: 0.5;" : ""}"
              title="${((_this$_config$entitie4 = this._config.entities) === null || _this$_config$entitie4 === void 0 ? void 0 : _this$_config$entitie4.length) === 1 && this._config.always_collapsed === true && this._config.expand_on_search !== true ? "Not available with one entity in Always Collapsed mode unless Expand on Search is enabled" : ""}">
              <ha-switch
                id="pin-search-headers-toggle"
                .checked=${this._config.pin_search_headers ?? false}
                @change=${e => this._updateConfig("pin_search_headers", e.target.checked)}
                .disabled=${((_this$_config$entitie5 = this._config.entities) === null || _this$_config$entitie5 === void 0 ? void 0 : _this$_config$entitie5.length) === 1 && this._config.always_collapsed === true && this._config.expand_on_search !== true}
              ></ha-switch>
              <span>${localize('editor.labels.pin_headers')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.pin_search_headers')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="hide-search-headers-on-idle-toggle"
                .checked=${this._config.hide_search_headers_on_idle ?? false}
                @change=${e => this._updateConfig("hide_search_headers_on_idle", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.hide_search_headers_on_idle')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.hide_search_headers_on_idle')}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="disable-mass-queue-toggle"
                .checked=${this._config.disable_mass_queue ?? false}
                @change=${e => this._updateConfig("disable_mass_queue", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.disable_mass')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.disable_mass')}</div>
          </div>
            <div class="form-row form-row-multi-column">
              <div class="grow-children number-input-with-note">
                <ha-selector-number
                  .selector=${{
      number: {
        min: 0,
        max: 1000,
        step: 1,
        mode: "box"
      }
    }}
                  .value=${this._config.search_results_limit ?? 20}
                  label="${localize('editor.fields.search_limit')}"
                  helper="${localize('editor.subtitles.search_limit_full')}"
                  @value-changed=${e => this._updateConfig("search_results_limit", e.detail.value)}
                ></ha-selector-number>
                ${searchLimitWarningActive ? x`
                  <div class="config-subtitle warning">
                    Warning: requesting higher results can cause performance issues.
                  </div>
                ` : E}
            </div>
            <ha-icon
              class="icon-button"
              id="search-limit-reset"
              icon="mdi:restore"
              title="${localize('common.reset_default')}"
              @click=${() => this._updateConfig("search_results_limit", 20)}
            ></ha-icon>
          </div>

          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "all",
          label: localize('search.filters.all')
        }, {
          value: "artist",
          label: localize('search.filters.artist')
        }, {
          value: "album",
          label: localize('search.filters.album')
        }, {
          value: "track",
          label: localize('search.filters.track')
        }, {
          value: "playlist",
          label: localize('search.filters.playlist')
        }, {
          value: "radio",
          label: localize('search.filters.radio')
        }, {
          value: "podcast",
          label: localize('search.filters.podcast')
        }, {
          value: "audiobook",
          label: localize('search.filters.audiobook')
        }]
      }
    }}
              .value=${this._config.default_search_filter ?? "all"}
              label="${localize('editor.labels.default_search_filter')}"
              helper="${localize('editor.subtitles.default_search_filter_full')}"
              @value-changed=${e => this._updateConfig("default_search_filter", e.detail.value)}
            ></ha-selector>
          </div>

          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "default",
          label: "Default"
        }, {
          value: "name",
          label: "Name (A→Z)"
        }, {
          value: "name_desc",
          label: "Name (Z→A)"
        }, {
          value: "sort_name",
          label: "Sort Name (A→Z)"
        }, {
          value: "sort_name_desc",
          label: "Sort Name (Z→A)"
        }, {
          value: "timestamp_added",
          label: "Date Added (Oldest)"
        }, {
          value: "timestamp_added_desc",
          label: "Date Added (Newest)"
        }, {
          value: "last_played",
          label: "Last Played (Oldest)"
        }, {
          value: "last_played_desc",
          label: "Last Played (Recent)"
        }, {
          value: "play_count",
          label: "Play Count (Low→High)"
        }, {
          value: "play_count_desc",
          label: "Play Count (High→Low)"
        }, {
          value: "year",
          label: "Year (Oldest)"
        }, {
          value: "year_desc",
          label: "Year (Newest)"
        }, {
          value: "position",
          label: "Position (Asc)"
        }, {
          value: "position_desc",
          label: "Position (Desc)"
        }, {
          value: "artist_name",
          label: "Artist (A→Z)"
        }, {
          value: "artist_name_desc",
          label: "Artist (Z→A)"
        }, {
          value: "random",
          label: "Random"
        }, {
          value: "random_play_count",
          label: "Random + Least Played"
        }]
      }
    }}
              .value=${this._config.search_results_sort ?? "default"}
              label="${localize('editor.fields.result_sorting')}"
              helper="${localize('editor.subtitles.result_sorting_full')}"
              @value-changed=${e => this._updateConfig("search_results_sort", e.detail.value)}
            ></ha-selector>
          </div>
        </div>
      `;
  }
  _renderVisualTab() {
    const renderVolumeStep = this._config.volume_mode === "stepper" ? x`
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
                label="${localize('editor.fields.vol_step')}"
                @value-changed=${e => this._updateConfig("volume_step", e.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${localize('common.reset_default')}"
              @click=${() => this._updateConfig("volume_step", 0.05)}
            ></ha-icon>
          </div>
        ` : E;
    return x`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.look_and_feel.theme_layout.title')}</div>
            <div class="section-description">${localize('editor.sections.look_and_feel.theme_layout.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="match-theme-toggle"
                .checked=${this._config.match_theme ?? false}
                @change=${e => this._updateConfig("match_theme", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.match_theme')}</span>
            </div>
            <div>
              <ha-switch
                id="alternate-progress-bar-toggle"
                .checked=${this._config.alternate_progress_bar ?? false}
                @change=${e => this._updateConfig("alternate_progress_bar", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.alt_progress')}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div title=${this._config.alternate_progress_bar || this._config.always_collapsed ? localize('editor.subtitles.not_available_alt_collapsed') : ""}>
              <ha-switch
                id="display-timestamps-toggle"
                .checked=${this._config.display_timestamps ?? false}
                @change=${e => this._updateConfig("display_timestamps", e.target.checked)}
                .disabled=${this._config.alternate_progress_bar || this._config.always_collapsed}
              ></ha-switch>
              <span>${localize('editor.labels.display_timestamps')}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-textfield
                class="full-width"
                type="number"
                min="0"
                label="${localize('editor.fields.card_height')}"
                .value=${this._config.card_height ?? ""}
                helper="${localize('editor.subtitles.card_height_full')}"
                .helperPersistent=${true}
                @input=${e => {
      const raw = e.target.value;
      if (raw === "") {
        this._updateConfig("card_height", undefined);
        return;
      }
      const parsed = Number(raw);
      this._updateConfig("card_height", Number.isFinite(parsed) && parsed > 0 ? parsed : undefined);
    }}
              ></ha-textfield>
            </div>
            <ha-icon
                class="icon-button"
                icon="mdi:restore"
                title="${localize('common.reset_default')}"
                @click=${() => this._updateConfig("card_height", undefined)}
              ></ha-icon>
            </div>
            <div class="form-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "list",
          label: localize('editor.search_view_options.list')
        }, {
          value: "card",
          label: localize('editor.search_view_options.card')
        }]
      }
    }}
                .value=${this._config.search_view ?? "list"}
                label="${localize('editor.fields.search_view')}"
                helper="${localize('editor.subtitles.search_view')}"
                @value-changed=${e => this._updateConfig("search_view", e.detail.value)}
              ></ha-selector>
            </div>
            ${this._config.search_view === 'card' ? x`
              <div class="form-row">
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
      number: {
        min: 1,
        max: 12,
        step: 1,
        mode: "box"
      }
    }}
                  .value=${this._config.search_card_columns ?? 4}
                  label="${localize('editor.fields.search_card_columns')}"
                  helper="${localize('editor.subtitles.search_card_columns')}"
                  @value-changed=${e => this._updateConfig("search_card_columns", e.detail.value)}
                ></ha-selector>
              </div>
            ` : E}
          </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.look_and_feel.controls_typography.title')}</div>
            <div class="section-description">${localize('editor.sections.look_and_feel.controls_typography.description')}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "classic",
          label: "Classic"
        }, {
          value: "modern",
          label: "Modern"
        }]
      }
    }}
              .value=${this._config.control_layout ?? "classic"}
              label="${localize('editor.fields.control_layout')}"
              helper="${localize('editor.subtitles.control_layout_full')}"
              @value-changed=${e => this._updateConfig("control_layout", e.detail.value)}
            ></ha-selector>
          </div>
          <div class="form-row"
            style="${(this._config.control_layout ?? "classic") === "modern" ? "" : "opacity: 0.5;"}"
            title="${(this._config.control_layout ?? "classic") === "modern" ? "" : localize('editor.subtitles.only_available_modern')}"}>
            <div>
              <ha-switch
                .checked=${this._config.swap_pause_for_stop ?? false}
                @change=${e => this._updateConfig("swap_pause_for_stop", e.target.checked)}
                .disabled=${(this._config.control_layout ?? "classic") !== "modern"}
              ></ha-switch>
              <span>${localize('editor.labels.swap_pause_stop')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.swap_pause_stop')}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="adaptive-controls-toggle"
                .checked=${this._config.adaptive_controls ?? false}
                @change=${e => this._updateConfig("adaptive_controls", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.adaptive_controls')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.adaptive_controls')}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="hide-active-entity-label-toggle"
                .checked=${this._config.hide_active_entity_label ?? false}
                @change=${e => this._updateConfig("hide_active_entity_label", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.hide_active_entity')}</span>
            </div>
            <div class="config-subtitle">${localize('editor.subtitles.hide_menu_player')}</div>
          </div>
        <div class="form-row">
          <div class="full-width">
            <span class="form-label">${localize('editor.labels.adaptive_text_elements')}</span>
            <div class="config-subtitle">${localize('editor.subtitles.adaptive_text')}</div>
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      select: {
        multiple: true,
        options: ADAPTIVE_TEXT_SELECTOR_OPTIONS
      }
    }}
              .value=${this._getAdaptiveTextTargetsValue()}
              @value-changed=${e => this._onAdaptiveTextTargetsChanged(e.detail.value)}
            ></ha-selector>
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
        }, {
          value: "hidden",
          label: "Hidden"
        }]
      }
    }}
              .value=${this._config.volume_mode ?? "slider"}
              label="${localize('editor.fields.volume_mode')}"
              @value-changed=${e => this._updateConfig("volume_mode", e.detail.value)}
            ></ha-selector>
          </div>
          ${renderVolumeStep}
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${localize('editor.sections.look_and_feel.collapsed_idle.title')}</div>
            <div class="section-description">${localize('editor.sections.look_and_feel.collapsed_idle.description')}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="collapse-on-idle-toggle"
                .checked=${this._config.collapse_on_idle ?? false}
                @change=${e => this._updateConfig("collapse_on_idle", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.collapse_on_idle')}</span>
            </div>
            <div style="${!this._config.always_collapsed ? "" : "opacity: 0.5;"}"
              title="${!this._config.always_collapsed ? "" : localize('editor.subtitles.not_available_collapsed')}">
              <ha-switch
                id="hide-menu-player-toggle"
                .checked=${this._config.hide_menu_player ?? false}
                @change=${e => this._updateConfig("hide_menu_player", e.target.checked)}
                .disabled=${!!this._config.always_collapsed || this._config.always_collapsed === true && this._config.pin_search_headers === true && this._config.expand_on_search === true}
              ></ha-switch>
              <span>${localize('editor.labels.hide_menu_player_toggle')}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="always-collapsed-toggle"
                .checked=${this._config.always_collapsed ?? false}
                @change=${e => this._updateConfig("always_collapsed", e.target.checked)}
              ></ha-switch>
              <span>${localize('editor.labels.always_collapsed')}</span>
            </div>
            <div style="${this._config.always_collapsed ? "" : "opacity: 0.5;"}"
              title="${this._config.always_collapsed ? "" : localize('editor.subtitles.only_available_collapsed')}">
              <ha-switch
                id="expand-on-search-toggle"
                .checked=${this._config.expand_on_search ?? false}
                @change=${e => this._updateConfig("expand_on_search", e.target.checked)}
                .disabled=${!this._config.always_collapsed}
              ></ha-switch>
              <span>${localize('editor.labels.expand_on_search')}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="config-subtitle">${localize('editor.subtitles.collapse_expand')}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "default",
          label: "Default"
        }, {
          value: "search",
          label: "Search"
        }, {
          value: "search-recently-played",
          label: "Recently Played"
        }, {
          value: "search-next-up",
          label: "Next Up"
        }]
      }
    }}
              .value=${this._config.idle_screen ?? "default"}
              label="${localize('editor.fields.idle_screen')}"
              @value-changed=${e => this._updateConfig("idle_screen", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.idle_screen')}</div>
          </div>
        </div>

      `;
  }
  _renderActionsTab() {
    let actions = [...(this._config.actions ?? [])];
    return x`
        <div class="action-group config-section">
          <div class="action-group-header section-header">
            <div class="action-group-title section-title">${localize('editor.sections.actions.title')}</div>
            <div class="section-description">${localize('editor.sections.actions.description')}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${e => this._onActionMoved(e)}>
              <div class="sortable-container">
                ${actions.map((act, idx) => x`
                  <div class="action-row-inner sortable-item">
                    <div class="handle action-handle">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    ${act !== null && act !== void 0 && act.icon ? x`
                      <ha-icon class="action-icon" icon="${act === null || act === void 0 ? void 0 : act.icon}" title="Action Icon"></ha-icon>
                    ` : x`<span class="action-icon-placeholder"></span>`}
                    <div class="grow-children">
                      <ha-textfield
                        placeholder="(Icon Only)"
                        .value=${(act === null || act === void 0 ? void 0 : act.name) ?? ""}
                        .helper=${this._getActionHelperText(act)}
                        .helperPersistent=${true}
                        @input=${a => this._onActionChanged(idx, a.target.value)}
                      ></ha-textfield>
                    </div>
                    <div class="action-row-actions">
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:pencil"
                        title="${localize('common.edit_action')}"
                        @click=${() => this._onEditAction(idx)}
                      ></ha-icon>
                      ${(act === null || act === void 0 ? void 0 : act.action) !== "sync_selected_entity" ? x`
                      <ha-icon
                        class="icon-button icon-button-compact icon-button-toggle ${(act === null || act === void 0 ? void 0 : act.in_menu) === "hidden" ? "icon-button-disabled" : (act === null || act === void 0 ? void 0 : act.in_menu) === true ? "active" : ""}"
                        icon="${(act === null || act === void 0 ? void 0 : act.in_menu) === true ? "mdi:menu" : (act === null || act === void 0 ? void 0 : act.in_menu) === "hidden" ? act !== null && act !== void 0 && act.card_trigger && act.card_trigger !== "none" ? "mdi:image-outline" : "mdi:eye-off-outline" : "mdi:view-grid-outline"}"
                        title="${(() => {
      const placementText = (act === null || act === void 0 ? void 0 : act.in_menu) === "hidden" ? act !== null && act !== void 0 && act.card_trigger && act.card_trigger !== "none" ? localize('editor.placements.hidden') : `${localize('editor.placements.hidden')} (${localize('editor.placements.not_triggerable')})` : act !== null && act !== void 0 && act.in_menu ? localize('editor.fields.move_to_main') : localize('editor.fields.move_to_menu');
      return placementText;
    })()}"
                        role="button"
                        aria-label="${(act === null || act === void 0 ? void 0 : act.in_menu) === true ? localize('editor.fields.move_to_main') : localize('editor.fields.move_to_menu')}"
                        @click=${() => {
      if ((act === null || act === void 0 ? void 0 : act.in_menu) !== "hidden") {
        this._toggleActionInMenu(idx);
      }
    }}
                      ></ha-icon>
                      ` : x`
                      <ha-icon
                        class="icon-button icon-button-compact icon-button-disabled"
                        icon="mdi:eye-off-outline"
                        title="${localize('editor.action_types.sync_selected_entity')}"
                      ></ha-icon>
                      `}
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:trash-can"
                        title="${localize('editor.fields.delete_action')}"
                        @click=${() => this._removeAction(idx)}
                      ></ha-icon>
                    </div>
                  </div>
                `)}
              </div>
            </yamp-sortable>
          </div>
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
    var _this$hass6;
    const stateObj = (_this$hass6 = this.hass) === null || _this$hass6 === void 0 || (_this$hass6 = _this$hass6.states) === null || _this$hass6 === void 0 ? void 0 : _this$hass6[entity === null || entity === void 0 ? void 0 : entity.entity_id];
    const showGroupVolume = this._isGroupCapable(stateObj);
    return x`
        <div class="entity-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            title="${localize('common.back')}"
            @click=${this._onBackFromEntityEditor}>
          </ha-icon>
          <div class="entity-editor-title">${localize('editor.titles.edit_entity')}</div>
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
            label="${localize('editor.fields.name')}"
            .value=${(entity === null || entity === void 0 ? void 0 : entity.name) ?? ""}
            @input=${e => this._updateEntityProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
      select: {
        mode: "dropdown",
        multiple: true,
        options: [{
          value: "previous",
          label: "Previous Track"
        }, {
          value: "play_pause",
          label: "Play/Pause"
        }, {
          value: "stop",
          label: "Stop"
        }, {
          value: "next",
          label: "Next Track"
        }, {
          value: "shuffle",
          label: "Shuffle"
        }, {
          value: "repeat",
          label: "Repeat"
        }, {
          value: "favorite",
          label: "Favorite"
        }, {
          value: "power",
          label: "Power"
        }]
      }
    }}
            .value=${Array.isArray(entity === null || entity === void 0 ? void 0 : entity.hidden_controls) ? entity.hidden_controls : []}
            .required=${false}
            .invalid=${false}
            label="${localize('editor.fields.hidden_controls')}"
            helper="${localize('editor.subtitles.hide_controls')}"
            @value-changed=${e => this._updateEntityProperty("hidden_controls", e.detail.value)}
          ></ha-selector>
        </div>

 

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="ma-template-toggle"
              .checked=${this._useTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity)}
              @change=${e => {
      this._useTemplate = e.target.checked;
    }}
            ></ha-switch>
            <label for="ma-template-toggle">${localize('editor.labels.use_ma_template')}</label>
          </div>
        </div>

        ${this._useTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ? x`
      <div class="form-row">
        <div class=${this._yamlError && ((entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ?? "").trim() !== "" ? "code-editor-wrapper error" : "code-editor-wrapper"}>
          <ha-code-editor
            id="ma-template-editor"
            label="${localize('editor.fields.ma_template')}"
            .hass=${this.hass}
            mode="jinja2"
            autocomplete-entities
            .value=${(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ?? ""}
            @value-changed=${e => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
          ></ha-code-editor>
          <div class="help-text">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            ${localize('editor.subtitles.jinja_template_hint')}
            <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_select.kitchen_stream_source','Music Stream 1') %}
  media_player.picore_house
{% else %}
  media_player.ma_wiim_mini
{% endif %}</pre>
           </pre>
          </div>
        </div>
      </div>
    ` : x`
      <div class="form-row">
        <ha-generic-picker
          .hass=${this.hass}
          .value=${this._isEntityId(entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity) ? entity.music_assistant_entity : ""}
          .label=${localize('editor.fields.ma_entity')}
          .valueRenderer=${v => this._entityValueRenderer(v)}
          .rowRenderer=${item => this._entityRowRenderer(item)}
          .getItems=${this._getEntityItems(["media_player"])}
          @value-changed=${e => this._updateEntityProperty("music_assistant_entity", e.detail.value)}
          allow-custom-value
        ></ha-generic-picker>
      </div>
      ${((_this$hass7, _this$_looksLikeTempl, _this$hass8) => {
      const mainId = entity === null || entity === void 0 ? void 0 : entity.entity_id;
      const mainState = mainId ? (_this$hass7 = this.hass) === null || _this$hass7 === void 0 || (_this$hass7 = _this$hass7.states) === null || _this$hass7 === void 0 ? void 0 : _this$hass7[mainId] : undefined;
      const mainIsMA = mainState ? isMusicAssistantEntity(mainState) : false;
      const rawMa = entity === null || entity === void 0 ? void 0 : entity.music_assistant_entity;
      const isTemplate = (_this$_looksLikeTempl = this._looksLikeTemplate) === null || _this$_looksLikeTempl === void 0 ? void 0 : _this$_looksLikeTempl.call(this, rawMa);
      const maId = typeof rawMa === 'string' && !isTemplate ? rawMa : undefined;
      const maState = maId ? (_this$hass8 = this.hass) === null || _this$hass8 === void 0 || (_this$hass8 = _this$hass8.states) === null || _this$hass8 === void 0 ? void 0 : _this$hass8[maId] : undefined;
      const maIsMA = maState ? isMusicAssistantEntity(maState) : false;
      // Only show under the dropdown (non-template path)
      const showHiddenFilterChips = mainIsMA || maIsMA;
      if (!showHiddenFilterChips) return E;
      return x`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
        select: {
          mode: "dropdown",
          multiple: true,
          options: [{
            value: "artist",
            label: "Artist"
          }, {
            value: "album",
            label: "Album"
          }, {
            value: "track",
            label: "Track"
          }, {
            value: "playlist",
            label: "Playlist"
          }, {
            value: "radio",
            label: "Radio"
          }, {
            value: "podcast",
            label: "Podcast"
          }, {
            value: "episode",
            label: "Episode"
          }]
        }
      }}
              .value=${Array.isArray(entity === null || entity === void 0 ? void 0 : entity.hidden_filter_chips) ? entity.hidden_filter_chips : []}
              .required=${false}
              .invalid=${false}
              label="${localize('editor.fields.hidden_chips')}"
              helper="${localize('editor.subtitles.hide_search_chips')}"
              @value-changed=${e => this._updateEntityProperty("hidden_filter_chips", e.detail.value)}
            ></ha-selector>
          </div>
        `;
    })()}
    `}

        <div class="form-row">
          <ha-switch
            id="disable-auto-select-toggle"
            .checked=${(entity === null || entity === void 0 ? void 0 : entity.disable_auto_select) ?? false}
            @change=${e => this._updateEntityProperty("disable_auto_select", e.target.checked)}
          ></ha-switch>
          <label for="disable-auto-select-toggle">${localize('editor.labels.disable_auto_select')}</label>
          <div class="config-subtitle">${localize('editor.subtitles.disable_auto_select')}</div>
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

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="follow-active-toggle"
              .checked=${(entity === null || entity === void 0 ? void 0 : entity.follow_active_volume) ?? false}
              @change=${e => this._updateEntityProperty("follow_active_volume", e.target.checked)}
            ></ha-switch>
            <label for="follow-active-toggle">${localize('editor.labels.follow_active_entity')}</label>
          </div>
          ${!((entity === null || entity === void 0 ? void 0 : entity.follow_active_volume) ?? false) ? x`
            <div>
              <ha-switch
                id="vol-template-toggle"
                .checked=${this._useVolTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.volume_entity)}
                @change=${e => {
      this._useVolTemplate = e.target.checked;
    }}
              ></ha-switch>
              <label for="vol-template-toggle">${localize('editor.labels.use_vol_template')}</label>
            </div>
          ` : E}
        </div>

        ${!((entity === null || entity === void 0 ? void 0 : entity.follow_active_volume) ?? false) ? x`
          ${this._useVolTemplate ?? this._looksLikeTemplate(entity === null || entity === void 0 ? void 0 : entity.volume_entity) ? x`
                <div class="form-row">
                  <div class=${this._yamlError && ((entity === null || entity === void 0 ? void 0 : entity.volume_entity) ?? "").trim() !== "" ? "code-editor-wrapper error" : "code-editor-wrapper"}>
                    <ha-code-editor
                      id="vol-template-editor"
                      label="${localize('editor.fields.vol_template')}"
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      .value=${(entity === null || entity === void 0 ? void 0 : entity.volume_entity) ?? ""}
                      @value-changed=${e => this._updateEntityProperty("volume_entity", e.detail.value)}
                    ></ha-code-editor>
                    <div class="help-text">
                      <ha-icon icon="mdi:information-outline"></ha-icon>
                      ${localize('editor.subtitles.jinja_template_vol_hint')}
                      <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_boolean.tv_volume','on') %}
  remote.soundbar
{% else %}
  media_player.office_homepod
{% endif %}</pre>
                    </div>
                  </div>
                </div>
              ` : x`
                <div class="form-row">
                  <ha-generic-picker
                    .hass=${this.hass}
                    .value=${this._isEntityId(entity === null || entity === void 0 ? void 0 : entity.volume_entity) ? entity.volume_entity : (entity === null || entity === void 0 ? void 0 : entity.entity_id) ?? ""}
                    .label=${localize('editor.fields.vol_entity')}
                    .valueRenderer=${v => this._entityValueRenderer(v)}
                    .rowRenderer=${item => this._entityRowRenderer(item)}
                    .getItems=${this._getEntityItems(["media_player", "remote"])}
                    @value-changed=${e => {
      const value = e.detail.value;
      this._updateEntityProperty("volume_entity", value);
      if (!value || value === entity.entity_id) {
        // sync_power is meaningless in these cases
        this._updateEntityProperty("sync_power", false);
      }
    }}
                    allow-custom-value
                  ></ha-generic-picker>
                </div>
              `}
        ` : E}

        ${entity !== null && entity !== void 0 && entity.volume_entity && entity.volume_entity !== entity.entity_id && !((entity === null || entity === void 0 ? void 0 : entity.follow_active_volume) ?? false) ? x`
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

        ${entity !== null && entity !== void 0 && entity.follow_active_volume ? x`
            <div class="help-text">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              ${localize('editor.subtitles.follow_active_entity')}
              <br><br>
            </div>
        ` : E}
        </div>
      `;
  }
  _renderActionEditor(action) {
    const actionMode = this._actionMode ?? this._deriveActionMode(action);
    return x`
        <div class="action-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromActionEditor}>
          </ha-icon>
          <div class="action-editor-title">${localize('editor.titles.edit_action')}</div>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="${localize('editor.fields.name')}"
            placeholder="(Icon Only)"
            .value=${(action === null || action === void 0 ? void 0 : action.name) ?? ""}
            @input=${e => this._updateActionProperty("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="${localize('editor.fields.icon')}"
            .hass=${this.hass}
            .value=${(action === null || action === void 0 ? void 0 : action.icon) ?? ""}
            @value-changed=${e => this._updateActionProperty("icon", e.detail.value)}
          ></ha-icon-picker>
        </div>
 
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${localize('editor.fields.placement')}"
              .disabled=${actionMode === "sync_selected_entity"}
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "chip",
          label: localize('editor.placements.chip')
        }, {
          value: "menu",
          label: localize('editor.placements.menu')
        }, {
          value: "hidden",
          label: localize('editor.placements.hidden')
        }]
      }
    }}
              .value=${(action === null || action === void 0 ? void 0 : action.in_menu) === "hidden" ? "hidden" : action !== null && action !== void 0 && action.in_menu ? "menu" : "chip"}
              @value-changed=${e => {
      const val = e.detail.value;
      let inMenu = false;
      if (val === "menu") inMenu = true;else if (val === "hidden") inMenu = "hidden";
      this._updateActionProperty("in_menu", inMenu);
      if (val !== "hidden") {
        this._updateActionProperty("card_trigger", "none");
      }
    }}
            ></ha-selector>
          </div>
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${localize('editor.fields.card_trigger')}"
              .disabled=${actionMode === "sync_selected_entity" || (action === null || action === void 0 ? void 0 : action.in_menu) !== "hidden"}
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "none",
          label: localize('editor.triggers.none')
        }, {
          value: "tap",
          label: localize('editor.triggers.tap')
        }, {
          value: "hold",
          label: localize('editor.triggers.hold')
        }, {
          value: "double_tap",
          label: localize('editor.triggers.double_tap')
        }, {
          value: "swipe_left",
          label: localize('editor.triggers.swipe_left')
        }, {
          value: "swipe_right",
          label: localize('editor.triggers.swipe_right')
        }]
      }
    }}
              .value=${(action === null || action === void 0 ? void 0 : action.card_trigger) || "none"}
              @value-changed=${e => this._updateActionProperty("card_trigger", e.detail.value)}
            ></ha-selector>
          </div>
        </div>
        ${(action === null || action === void 0 ? void 0 : action.in_menu) === "hidden" && (!(action !== null && action !== void 0 && action.card_trigger) || (action === null || action === void 0 ? void 0 : action.card_trigger) === "none") && actionMode !== "sync_selected_entity" ? x`
          <div class="help-text">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${localize('editor.placements.hidden')} (${localize('editor.placements.not_triggerable')})
          </div>
        ` : E}

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="${localize('editor.fields.action_type')}"
            .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "menu",
          label: localize('editor.action_types.menu')
        }, {
          value: "service",
          label: localize('editor.action_types.service')
        }, {
          value: "navigate",
          label: localize('editor.action_types.navigate')
        }, {
          value: "sync_selected_entity",
          label: localize('editor.action_types.sync_selected_entity')
        }]
      }
    }}
            .value=${this._actionMode ?? this._deriveActionMode(action)}
            @value-changed=${e => {
      const mode = e.detail.value;
      this._actionMode = mode;
      if (mode === "service") {
        var _this$_config$actions2;
        this._updateActionProperty("menu_item", undefined);
        this._updateActionProperty("navigation_path", undefined);
        this._updateActionProperty("navigation_new_tab", undefined);
        this._updateActionProperty("action", undefined);
        // Initialize service to empty string so Service Data editor renders immediately
        if (!((_this$_config$actions2 = this._config.actions) !== null && _this$_config$actions2 !== void 0 && (_this$_config$actions2 = _this$_config$actions2[this._actionEditorIndex]) !== null && _this$_config$actions2 !== void 0 && _this$_config$actions2.service)) {
          this._updateActionProperty("service", "");
        }
      } else if (mode === "menu") {
        this._updateActionProperty("service", undefined);
        this._updateActionProperty("service_data", undefined);
        this._updateActionProperty("script_variable", undefined);
        this._updateActionProperty("navigation_path", undefined);
        this._updateActionProperty("navigation_new_tab", undefined);
        this._updateActionProperty("action", undefined);
      } else if (mode === "navigate") {
        this._updateActionProperty("menu_item", undefined);
        this._updateActionProperty("service", undefined);
        this._updateActionProperty("service_data", undefined);
        this._updateActionProperty("script_variable", undefined);
        this._updateActionProperty("action", "navigate");
        if (!(action !== null && action !== void 0 && action.navigation_path)) {
          this._updateActionProperty("navigation_path", "");
        }
      } else if (mode === "sync_selected_entity") {
        this._updateActionProperty("menu_item", undefined);
        this._updateActionProperty("service", undefined);
        this._updateActionProperty("service_data", undefined);
        this._updateActionProperty("script_variable", undefined);
        this._updateActionProperty("navigation_path", undefined);
        this._updateActionProperty("navigation_new_tab", undefined);
        this._updateActionProperty("action", "sync_selected_entity");
        this._updateActionProperty("in_menu", "hidden");
        this._updateActionProperty("card_trigger", "none");
        if (!(action !== null && action !== void 0 && action.sync_entity_type)) {
          this._updateActionProperty("sync_entity_type", "yamp_entity");
        }
      }
    }}
          ></ha-selector>
        </div>

        
        ${actionMode === "menu" ? x`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${localize('editor.fields.menu_item')}"
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
          value: "search-recently-played",
          label: "Recently Played"
        }, {
          value: "search-next-up",
          label: "Next Up"
        }, {
          value: "source",
          label: "Source"
        }, {
          value: "more-info",
          label: "More Info"
        }, {
          value: "group-players",
          label: "Group Players"
        }, {
          value: "transfer-queue",
          label: "Transfer Queue"
        }]
      }
    }}
              .value=${(action === null || action === void 0 ? void 0 : action.menu_item) ?? ""}
              @value-changed=${e => this._updateActionProperty("menu_item", e.detail.value || undefined)}
            ></ha-selector>
          </div>
        ` : E} 
        ${actionMode === "navigate" ? x`
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${localize('editor.fields.nav_path')}"
              placeholder="/lovelace/music or #popup"
              .value=${(action === null || action === void 0 ? void 0 : action.navigation_path) ?? ""}
              @input=${e => {
      this._updateActionProperty("navigation_path", e.target.value);
      this._updateActionProperty("action", "navigate");
    }}
            ></ha-textfield>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="navigation-new-tab-toggle"
                .checked=${(action === null || action === void 0 ? void 0 : action.navigation_new_tab) ?? false}
                @change=${e => this._updateActionProperty("navigation_new_tab", e.target.checked)}
              ></ha-switch>
              <label for="navigation-new-tab-toggle">Open External URLs in New Tab</label>
            </div>
          </div>
          <div class="form-row">
            <div class="config-subtitle">Supports dashboard paths, URLs, and anchors (e.g., <code>/lovelace/music</code> or <code>#pop-up-menu</code>).</div>
          </div>
        ` : E}
        ${actionMode === "sync_selected_entity" ? x`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      entity: {
        domain: "input_text"
      }
    }}
              .value=${(action === null || action === void 0 ? void 0 : action.sync_entity_helper) ?? ""}
              label="${localize('editor.fields.selected_entity_helper')}"
              @value-changed=${e => this._updateActionProperty("sync_entity_helper", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.selected_entity_helper')}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${localize('editor.fields.sync_entity_type')}"
              .selector=${{
      select: {
        mode: "dropdown",
        options: [{
          value: "yamp_entity",
          label: localize('editor.sync_entity_options.yamp_entity')
        }, {
          value: "yamp_main_entity",
          label: localize('editor.sync_entity_options.yamp_main_entity')
        }, {
          value: "yamp_playback_entity",
          label: localize('editor.sync_entity_options.yamp_playback_entity')
        }]
      }
    }}
              .value=${(action === null || action === void 0 ? void 0 : action.sync_entity_type) ?? "yamp_entity"}
              @value-changed=${e => this._updateActionProperty("sync_entity_type", e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${localize('editor.subtitles.sync_entity_type')}</div>
          </div>
        ` : E}
        ${actionMode === 'service' ? x`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{
      select: {
        mode: "dropdown",
        filterable: true,
        options: this._serviceItems || []
      }
    }}
              .value=${action.service ?? ""}
              label="${localize('editor.fields.service')}"
              .required=${true}
              @value-changed=${e => this._updateActionProperty("service", e.detail.value)}
            ></ha-selector>
          </div>

          ${typeof action.service === "string" && action.service.startsWith("script.") ? x`
            <div class="form-row form-row-multi-column">
              <div>
                <ha-switch
                  id="script-variable-toggle"
                  .checked=${(action === null || action === void 0 ? void 0 : action.script_variable) ?? false}
                  @change=${e => this._updateActionProperty("script_variable", e.target.checked)}
                ></ha-switch>
                <span>${localize('editor.labels.script_var')}</span>
              </div>
            </div>
          ` : E}

          ${typeof action.service === "string" ? x`
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>

              ${localize('editor.subtitles.entity_current_hint')}

            </div>
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>
            ${localize('editor.subtitles.service_data_note')}
            </div>
            <div class="form-row">
              <div class="service-data-editor-header">
                <div class="service-data-editor-title">${localize('editor.titles.service_data')}</div>
                <div class="service-data-editor-actions">
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:content-save"
                    title="${localize('editor.fields.save_service_data')}"
                    @click=${this._saveYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${!this._yamlModified ? "icon-button-disabled" : ""}"
                    icon="mdi:backup-restore"
                    title="${localize('editor.fields.revert_service_data')}"
                    @click=${this._revertYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${this._yamlError || this._yamlDraftUsesCurrentEntity() || !(action !== null && action !== void 0 && action.service) ? "icon-button-disabled" : ""}"
                    icon="mdi:play-circle-outline"
                    title="${localize('editor.fields.test_action')}"
                    @click=${this._testServiceCall}
                  ></ha-icon>
              
                </div>
            </div>
            <div class=${this._yamlError && this._yamlDraft.trim() !== "" ? "code-editor-wrapper error" : "code-editor-wrapper"}>
              <ha-code-editor
                id="service-data-editor"
                label="${localize('editor.fields.service_data')}"
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
  _getActionHelperText(act) {
    const inMenuVal = act === null || act === void 0 ? void 0 : act.in_menu;
    const placement = inMenuVal === "hidden" ? "hidden" : inMenuVal === true ? "menu" : "chip";
    const trigger = act === null || act === void 0 ? void 0 : act.card_trigger;
    let placementText = "";
    if (placement === "menu") placementText = " \u2022 In Menu";else if (placement === "hidden") {
      if ((act === null || act === void 0 ? void 0 : act.action) !== "sync_selected_entity") {
        if (!trigger || trigger === "none") {
          placementText = ` \u2022 ${localize('editor.placements.hidden')} (${localize('editor.placements.not_triggerable')})`;
        } else {
          placementText = ` \u2022 ${localize('editor.placements.hidden')}`;
        }
      }
    }
    let triggerText = "";
    if (trigger && trigger !== "none") {
      triggerText = ` \u2022 Trigger: ${localize(`editor.triggers.${trigger}`)}`;
    }
    if ((act === null || act === void 0 ? void 0 : act.action) === "sync_selected_entity") {
      return `${localize('editor.action_helpers.sync_selected_entity')} ${act.sync_entity_helper || localize('editor.action_helpers.select_helper')}${placementText}${triggerText}`;
    }
    if (act !== null && act !== void 0 && act.menu_item) {
      return `Open Menu Item: ${act.menu_item}${placementText}${triggerText}`;
    }
    if (act !== null && act !== void 0 && act.service) {
      return `Call Service: ${act.service}${placementText}${triggerText}`;
    }
    if (act !== null && act !== void 0 && act.navigation_path || (act === null || act === void 0 ? void 0 : act.action) === "navigate") {
      const newTab = act !== null && act !== void 0 && act.navigation_new_tab ? " (New Tab)" : "";
      return `Navigate to ${act.navigation_path || "(missing path)"}${newTab}${placementText}${triggerText}`;
    }
    return placementText || triggerText ? `Not Configured${placementText}${triggerText}` : "Not Configured";
  }
  _onEditEntity(index) {
    var _this$_config$entitie6;
    this._entityEditorIndex = index;
    const ent = (_this$_config$entitie6 = this._config.entities) === null || _this$_config$entitie6 === void 0 ? void 0 : _this$_config$entitie6[index];
    const mae = ent === null || ent === void 0 ? void 0 : ent.music_assistant_entity;
    this._useTemplate = this._looksLikeTemplate(mae) ? true : false;
    const vol = ent === null || ent === void 0 ? void 0 : ent.volume_entity;
    this._useVolTemplate = this._looksLikeTemplate(vol) ? true : false;
  }
  _onEditAction(index) {
    var _this$_config$actions3;
    this._actionEditorIndex = index;
    const action = (_this$_config$actions3 = this._config.actions) === null || _this$_config$actions3 === void 0 ? void 0 : _this$_config$actions3[index];
    this._actionMode = this._deriveActionMode(action);
    // If mode is service and no service is set yet, initialize to empty string
    // so the Service Data editor renders immediately
    if (this._actionMode === "service" && typeof (action === null || action === void 0 ? void 0 : action.service) !== "string") {
      this._updateActionProperty("service", "");
    }
  }
  _onBackFromEntityEditor() {
    this._entityEditorIndex = null;
    this._useTemplate = null; // re-detect next open
    this._useVolTemplate = null; // re-detect next open
  }
  _onBackFromActionEditor() {
    this._actionEditorIndex = null;
    this._actionMode = null;
  }
  _onEntityMoved(event) {
    const {
      oldIndex,
      newIndex
    } = event.detail;

    // Don't allow moving the last blank entity
    const entities = [...this._config.entities];
    if (oldIndex >= entities.length || newIndex >= entities.length) {
      return;
    }
    const [moved] = entities.splice(oldIndex, 1);
    entities.splice(newIndex, 0, moved);
    this._updateConfig("entities", entities);
  }
  _onActionMoved(event) {
    const {
      oldIndex,
      newIndex
    } = event.detail;
    const actions = [...this._config.actions];
    if (oldIndex >= actions.length || newIndex >= actions.length) {
      return;
    }
    const [moved] = actions.splice(oldIndex, 1);
    actions.splice(newIndex, 0, moved);
    this._updateConfig("actions", actions);
  }
  _removeAction(index) {
    const actions = [...(this._config.actions ?? [])];
    if (index < 0 || index >= actions.length) return;
    actions.splice(index, 1);
    this._updateConfig("actions", actions);
  }
  _toggleActionInMenu(index) {
    const actions = [...(this._config.actions ?? [])];
    if (!actions[index]) return;
    const current = !!actions[index].in_menu;
    const newAction = {
      ...actions[index],
      in_menu: !current
    };
    delete newAction.placement;
    actions[index] = newAction;
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
    var _this$_config$actions4;
    const editor = this.shadowRoot.querySelector("#service-data-editor");
    const currentAction = (_this$_config$actions4 = this._config.actions) === null || _this$_config$actions4 === void 0 ? void 0 : _this$_config$actions4[this._actionEditorIndex];
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
    var _this$_yamlDraft, _this$_config$actions5;
    if (this._yamlError || !((_this$_yamlDraft = this._yamlDraft) !== null && _this$_yamlDraft !== void 0 && _this$_yamlDraft.trim())) {
      return;
    }
    let serviceData;
    try {
      serviceData = jsYaml.load(this._yamlDraft);
      if (typeof serviceData !== "object" || serviceData === null) {
        console.error("yamp: Service data must be a valid object.");
        return;
      }
    } catch (e) {
      this._yamlError = e.message;
      return;
    }
    const action = (_this$_config$actions5 = this._config.actions) === null || _this$_config$actions5 === void 0 ? void 0 : _this$_config$actions5[this._actionEditorIndex];
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
      console.error("yamp: Failed to call service:", err);
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
  _looksLikeUrlOrPath(value) {
    if (!value) return false;
    return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/') || value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.includes('.gif') || value.includes('.webp');
  }
}
customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);

const ADAPTIVE_TEXT_TARGETS = Object.freeze(["details", "menu", "action_chips"]);
const DEFAULT_ADAPTIVE_TEXT_TARGETS = Object.freeze([...ADAPTIVE_TEXT_TARGETS]);
const ADAPTIVE_TEXT_VAR_MAP = Object.freeze({
  details: "--yamp-text-scale-details",
  menu: "--yamp-text-scale-menu",
  action_chips: "--yamp-text-scale-action-chips"
});
const ARTWORK_OVERRIDE_MATCH_KEYS = Object.freeze(["media_title", "media_artist", "media_album_name", "media_content_id", "media_channel", "app_name", "media_content_type", "entity_id", "entity_state"]);
const GESTURE_HOLD_TIMEOUT = 500;
const GESTURE_MOVE_THRESHOLD = 15;
const GESTURE_DOUBLE_TAP_MAX_DELAY = 300;
const GESTURE_TAP_DELAY = 300;
const GESTURE_SWIPE_THRESHOLD = 50;
window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "YAMP is a multi-entity media card with custom actions",
  preview: true
});
class YetAnotherMediaPlayerCard extends i$2 {
  _handleChipPointerDown(e, idx) {
    if (this._holdToPin && this._holdHandler) {
      this._holdHandler.pointerDown(e, idx);
    }
  }
  _applyIdleScreen() {
    if (this._idleScreenApplied) return;
    const mode = this._idleScreen || "default";
    switch (mode) {
      case "search":
        this._showEntityOptions = true;
        this._showGrouping = false;
        this._showSourceList = false;
        this._showTransferQueue = false;
        this._showResolvedEntities = false;
        this._showSearchSheetInOptions("default");
        break;
      case "search-recently-played":
        this._showEntityOptions = true;
        this._showGrouping = false;
        this._showSourceList = false;
        this._showTransferQueue = false;
        this._showResolvedEntities = false;
        this._showSearchSheetInOptions("recently-played");
        break;
      case "search-next-up":
        this._showEntityOptions = true;
        this._showGrouping = false;
        this._showSourceList = false;
        this._showTransferQueue = false;
        this._showResolvedEntities = false;
        this._showSearchSheetInOptions("next-up");
        break;
      default:
        return;
    }
    this._idleScreenApplied = true;
  }
  _resetIdleScreen() {
    if (!this._idleScreenApplied) return;
    switch (this._idleScreen) {
      case "search":
      case "search-recently-played":
      case "search-next-up":
        this._hideSearchSheetInOptions();
        this._showEntityOptions = false;
        break;
    }
    this._idleScreenApplied = false;
    this.requestUpdate();
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
  _groupedSortedCache = null;
  _cardTriggers = {
    tap: null,
    hold: null,
    double_tap: null,
    swipe_left: null,
    swipe_right: null
  };
  _lastHassVersion = null;
  _debouncedVolumeTimer = null;
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }
  _isGroupCapable(stateObj) {
    var _stateObj$attributes, _stateObj$attributes2;
    if (!stateObj) return false;
    if (((_stateObj$attributes = stateObj.attributes) === null || _stateObj$attributes === void 0 ? void 0 : _stateObj$attributes.mass_player_type) === 'group') return false;
    if (this._supportsFeature(stateObj, SUPPORT_GROUPING)) return true;
    return Array.isArray((_stateObj$attributes2 = stateObj.attributes) === null || _stateObj$attributes2 === void 0 ? void 0 : _stateObj$attributes2.group_members);
  }

  // Returns true if entity is group-capable AND currently has members
  _isCurrentlyGrouped(stateObj) {
    var _stateObj$attributes3;
    if (!this._isGroupCapable(stateObj)) return false;
    return Array.isArray(stateObj === null || stateObj === void 0 || (_stateObj$attributes3 = stateObj.attributes) === null || _stateObj$attributes3 === void 0 ? void 0 : _stateObj$attributes3.group_members) && stateObj.attributes.group_members.length > 1;
  }

  // Find button entities associated with a Music Assistant entity
  _findAssociatedButtonEntities(maEntityId) {
    return findAssociatedButtonEntities(this.hass, maEntityId);
  }

  // Get the favorite button entity for the current Music Assistant entity
  _getFavoriteButtonEntity() {
    var _this$hass;
    const obj = this.entityObjs[this._selectedIndex];
    if (!obj) return null;

    // Get the active entity (the one currently selected or playing)
    const activeEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
    if (!activeEntityId) return null;

    // Check if the active entity is a Music Assistant entity
    const activeState = (_this$hass = this.hass) === null || _this$hass === void 0 || (_this$hass = _this$hass.states) === null || _this$hass === void 0 ? void 0 : _this$hass[activeEntityId];
    if (!activeState || !isMusicAssistantEntity(activeState)) {
      return null;
    }

    // Active entity is Music Assistant, find its favorite button
    const buttonEntities = this._findAssociatedButtonEntities(activeEntityId);
    const favoriteButton = buttonEntities.find(btn => btn.friendly_name.toLowerCase().includes('favorite') || btn.friendly_name.toLowerCase().includes('like') || btn.device_class === 'favorite' || btn.entity_id.toLowerCase().includes('favorite'));
    return (favoriteButton === null || favoriteButton === void 0 ? void 0 : favoriteButton.entity_id) || null;
  }

  // Get the current Music Assistant state
  _getMusicAssistantState() {
    const activeEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
    if (!activeEntityId) return null;
    return getMusicAssistantState(this.hass, activeEntityId);
  }

  // Check if the currently playing track is favorited
  _isCurrentTrackFavorited() {
    var _maState$attributes, _maState$attributes2;
    const obj = this.entityObjs[this._selectedIndex];
    if (!obj) return false;

    // Get the Music Assistant state (either main entity or configured MA entity)
    const maState = this._getMusicAssistantState();
    if (!maState) return false;

    // Check favorite status
    const mediaContentId = (_maState$attributes = maState.attributes) === null || _maState$attributes === void 0 ? void 0 : _maState$attributes.media_content_id;
    if (!mediaContentId) return false;

    // Check if Music Assistant provides favorite status in entity attributes
    if (typeof ((_maState$attributes2 = maState.attributes) === null || _maState$attributes2 === void 0 ? void 0 : _maState$attributes2.is_favorite) === 'boolean') {
      return maState.attributes.is_favorite;
    }

    // Use cached result if available
    if (this._favoriteStatusCache && this._favoriteStatusCache[mediaContentId] !== undefined) {
      const cached = this._favoriteStatusCache[mediaContentId];
      if (typeof cached === 'object' && cached.isFavorited !== undefined) {
        return cached.isFavorited;
      } else if (typeof cached === 'boolean') {
        return cached;
      }
    }

    // Query Music Assistant for favorite status asynchronously (only if not already checking)
    if (!this._checkingFavorites || this._checkingFavorites !== mediaContentId) {
      this._checkingFavorites = mediaContentId;
      this._checkFavoriteStatusAsync(mediaContentId);
    }

    // Return false initially, will update when async check completes
    return false;
  }

  // Asynchronously check favorite status and cache the result
  async _checkFavoriteStatusAsync(mediaContentId) {
    if (!mediaContentId || !this.hass) {
      return;
    }
    try {
      var _maState$attributes3, _maState$attributes4;
      // Get the current Music Assistant entity ID
      const maState = this._getMusicAssistantState();
      const entityId = maState === null || maState === void 0 ? void 0 : maState.entity_id;
      const trackName = (_maState$attributes3 = maState.attributes) === null || _maState$attributes3 === void 0 ? void 0 : _maState$attributes3.media_title;
      const artistName = (_maState$attributes4 = maState.attributes) === null || _maState$attributes4 === void 0 ? void 0 : _maState$attributes4.media_artist;
      const isFavorited = await isTrackFavorited(this.hass, mediaContentId, entityId, trackName, artistName, 200);

      // Initialize cache if needed
      if (!this._favoriteStatusCache) {
        this._favoriteStatusCache = {};
      }

      // Cache the result
      this._favoriteStatusCache[mediaContentId] = {
        isFavorited
      };

      // Clear the checking flag
      this._checkingFavorites = null;

      // Trigger a re-render to update the heart icon
      this.requestUpdate();
    } catch (error) {
      this._checkingFavorites = null;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this._handleGlobalScroll, {
      passive: true
    });
    window.addEventListener("resize", this._handleViewportResize, {
      passive: true
    });
    this._updateViewportFlags();
    this._updateAdaptiveTextObserverState();
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
    const showFavorite = !!this._getFavoriteButtonEntity() && !this._getHiddenControlsForCurrentEntity().favorite;
    const controls = countMainControls(stateObj, (s, f) => this._supportsFeature(s, f), showFavorite, this._getHiddenControlsForCurrentEntity(), true, this._controlLayout);
    // Limit Stop visibility on compact layouts.
    return minWide || controls <= 5;
  }
  _isAutoSelectDisabled(idx) {
    const conf = this.config.entities[idx];
    return typeof conf === "string" ? false : !!conf.disable_auto_select;
  }
  get sortedEntityIds() {
    const idList = this.entityIds;
    // Map with metadata for O(n log n) sorting
    const meta = idList.map((id, idx) => {
      const ts = this._isAutoSelectDisabled(idx) ? 0 : this._playTimestamps[id] || 0;
      return {
        id,
        idx,
        ts
      };
    });
    return meta.sort((a, b) => {
      if (a.ts === b.ts) return a.idx - b.idx;
      return b.ts - a.ts;
    }).map(m => m.id);
  }

  // Return array of groups, ordered by most recent play
  get groupedSortedEntityIds() {
    const idList = this.entityIds;
    if (!idList || !Array.isArray(idList)) return [];

    // Check if we can use the cache
    if (this._groupedSortedCache && this.hass === this._lastHassVersion) {
      return this._groupedSortedCache;
    }
    const idSet = new Set(idList);
    const map = {};
    for (let i = 0; i < idList.length; i++) {
      const id = idList[i];
      let key = this._getGroupKey(id);
      if (this._quickGroupingMode || !idSet.has(key)) {
        key = id;
      }
      if (!map[key]) map[key] = {
        ids: [],
        ts: 0,
        minIdx: i
      };
      map[key].ids.push(id);
      const effectiveTs = this._isAutoSelectDisabled(i) ? 0 : this._playTimestamps[id] || 0;
      map[key].ts = Math.max(map[key].ts, effectiveTs);
    }
    const result = Object.values(map).sort((a, b) => {
      if (b.ts === a.ts) return a.minIdx - b.minIdx;
      return b.ts - a.ts;
    }) // sort groups by recency
    .map(g => g.ids.sort()); // sort ids alphabetically inside each group

    this._groupedSortedCache = result;
    this._lastHassVersion = this.hass;
    return result;
  }
  static properties = {
    _quickGroupingMode: {
      state: true
    },
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
    },
    _showQueueSuccessMessage: {
      state: true
    },
    _searchActiveOptionsItem: {
      state: true
    },
    _activeSearchRowMenuId: {
      state: true
    },
    _successSearchRowMenuId: {
      state: true
    },
    _radioModeActive: {
      state: true
    },
    _showEntityOptions: {
      state: true
    },
    _showGrouping: {
      state: true
    },
    _showTransferQueue: {
      state: true
    },
    _showResolvedEntities: {
      state: true
    },
    _showSearchInSheet: {
      state: true
    }
  };
  static styles = (() => yampCardStyles)();
  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastSyncedEntityId = null;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._lastActiveEntityId = null;
    this._playTimestamps = {};
    this._lastMediaTitle = null;
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
    // Overlay state for transfer queue sheet
    this._showTransferQueue = false;
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    this._hasTransferQueueForCurrent = false;
    this._transferQueueAutoCloseTimer = null;
    // Alternate progress‑bar mode
    this._alternateProgressBar = false;
    // Group base volume for group gain logic
    this._groupBaseVolume = null;
    // Search sheet state variables
    this._searchOpen = false;
    this._searchQuery = "";
    this._searchLoading = false;
    this._searchResults = [];
    this._searchDisplaySortOverride = null;
    this._searchError = "";
    this._searchTotalRows = 15; // minimum 15 rows for layout padding
    // Cache search results by media type for better performance
    this._searchResultsByType = {}; // { mediaType: results[] }
    // Track the current search query for cache invalidation
    this._currentSearchQuery = "";
    this._latestSearchToken = 0;
    this._searchTimeoutHandle = null;
    this._latestSearchToken = 0;
    this._searchTimeoutHandle = null;
    this._swapPauseForStop = false;
    this._controlLayout = "classic";
    // Search hierarchy tracking
    this._searchHierarchy = []; // Array of {type: 'artist'|'album', name: string, query: string}
    this._searchBreadcrumb = ""; // Display string for current search context
    // Per-chip linger map to keep MA entity selected briefly after pause
    this._playbackLingerByIdx = {};
    // Track the last resolved entity for each chip to provide "sticky" selection and prevent flickers
    this._lastResolvedEntityIdByChip = {};
    // Show search-in-sheet flag for entity options sheet
    this._showSearchInSheet = false;
    this._showResolvedEntities = false;
    // Queue success message
    this._showQueueSuccessMessage = false;
    this._searchActiveOptionsItem = null;
    this._activeSearchRowMenuId = null;
    this._successSearchRowMenuId = null;
    // Search filter toggles
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._recommendationsFilterActive = false;
    this._radioModeActive = false;
    // mass_queue availability tracking
    this._massQueueAvailable = false;
    this._hasMassQueueIntegration = null;
    this._checkingMassQueueIntegration = false;
    // Quick-dismiss mode for action-triggered menu items
    this._quickMenuInvoke = false;
    // Track collapsed layout height for idle mode
    this._collapsedBaselineHeight = 220;
    this._lastRenderedCollapsed = false;
    this._lastRenderedHideControls = false;
    this._artworkObjectFit = "cover";
    this._idleScreen = "default";
    this._idleScreenApplied = false;
    this._hasSeenPlayback = false;
    this._adaptiveText = false;
    this._textResizeObserver = null;
    this._currentTextScale = null;
    this._adaptiveTextTargets = new Set();
    this._idleImageTemplate = null;
    this._idleImageTemplateResult = "";
    this._resolvingIdleImageTemplate = false;
    this._idleImageTemplateNeedsResolve = false;
    this._artworkOverrideTemplateCache = {};
    this._artworkOverrideIndexMap = null;
    this._hideActiveEntityLabel = false;
    this._currentDetailsScale = null;
    this._lastTitleLength = 0;
    this._suspendAdaptiveScaling = false;
    this._pendingAdaptiveScaleUpdate = false;
    this._adaptiveScrollTimer = null;
    this._handleGlobalScroll = this._handleGlobalScroll.bind(this);
    this._handleViewportResize = this._handleViewportResize.bind(this);
    this._isNarrowViewport = false;

    // Collapse on load if nothing is playing (but respect linger state and idle_timeout_ms)
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        var _this$_playbackLinger;
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        // Don't go idle if there's an active linger or if idle_timeout_ms is 0
        const hasActiveLinger = ((_this$_playbackLinger = this._playbackLingerByIdx) === null || _this$_playbackLinger === void 0 ? void 0 : _this$_playbackLinger[this._selectedIndex]) && this._playbackLingerByIdx[this._selectedIndex].until > Date.now();
        const isPlaying = this._isEntityPlaying(stateObj);
        if (stateObj && !isPlaying && !hasActiveLinger && this._idleTimeoutMs > 0) {
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
    this._searchInputAutoFocused = false;
    this._disableSearchAutofocus = false;
    // Optimistic playback state after control clicks
    this._optimisticPlayback = null;
    // Debounce entity switching to prevent rapid state changes
    this._lastPlaybackEntityId = null;
    this._entitySwitchDebounceTimer = null;
    // Track previous states to detect transitions
    this._lastMainState = null;
    this._lastMaState = null;
    // Cache resolved MA entity per index to use during render without switching chips
    this._maResolveCache = {}; // { [idx:number]: { id: string, ts: number } }
    this._maResolveTtlMs = 7000; // refresh every ~7s
    // Manual select timeout for hold-to-pin functionality
    this._manualSelectTimeout = null;
    // Cache resolved Volume entity per index (template or static)
    this._volResolveCache = {}; // { [idx:number]: { id: string, ts: number } }
    this._volResolveTtlMs = 7000; // refresh every ~7s
    // Track the last entity that was playing for better pause/resume behavior
    this._lastPlayingEntityId = null;
    // Control focus lock to prefer most-recently controlled entity in brief paused window
    this._controlFocusEntityId = null;
    // Track the last active entity per chip index for intra-chip persistence
    this._lastActiveEntityIdByChip = {};
    // Cache for detecting entity state transitions (playing -> stopped)
    this._playerStateCache = {};
  }

  // Resolve and cache the MA entity for a given chip index (template or static)
  async _ensureResolvedMaForIndex(idx) {
    var _this$entityObjs;
    const obj = (_this$entityObjs = this.entityObjs) === null || _this$entityObjs === void 0 ? void 0 : _this$entityObjs[idx];
    if (!obj) return;
    const raw = obj.music_assistant_entity;
    if (!raw || typeof raw !== 'string') {
      // Clear cache if no MA or not a string
      delete this._maResolveCache[idx];
      return;
    }
    const looksTemplate = raw.includes('{{') || raw.includes('{%');
    const now = Date.now();
    const cached = this._maResolveCache[idx];
    if (!looksTemplate) {
      // Static MA — always cache for consistency
      this._maResolveCache[idx] = {
        id: raw,
        ts: now
      };
      return;
    }
    // For templates, respect TTL to avoid spamming /api/template
    if (cached && now - cached.ts < this._maResolveTtlMs && cached.id) return;
    try {
      const resolved = await this._resolveTemplateAtActionTime(raw, obj.entity_id);
      if (resolved && typeof resolved === 'string') {
        // Always cache the resolved entity for service calls
        // The rendering logic will handle validation separately
        this._maResolveCache[idx] = {
          id: resolved,
          ts: now
        };
        // Trigger re-render so artwork/state can use the resolved id
        this.requestUpdate();
      }
    } catch (_) {
      // Leave existing cache (if any); do not throw
    }
  }

  // Resolve and cache the Volume entity for a given chip index (template or static)
  async _ensureResolvedVolForIndex(idx) {
    var _this$entityObjs2;
    const obj = (_this$entityObjs2 = this.entityObjs) === null || _this$entityObjs2 === void 0 ? void 0 : _this$entityObjs2[idx];
    if (!obj) return;

    // If follow_active_volume is enabled, we don't need to cache a specific volume entity
    // as it will be determined dynamically based on the active entity
    if (obj.follow_active_volume) {
      delete this._volResolveCache[idx];
      return;
    }
    const raw = obj.volume_entity;
    if (!raw || typeof raw !== 'string') {
      // Clear cache if no volume entity or not a string
      delete this._volResolveCache[idx];
      return;
    }
    const looksTemplate = raw.includes('{{') || raw.includes('{%');
    const now = Date.now();
    const cached = this._volResolveCache[idx];
    if (!looksTemplate) {
      // Static volume entity — always cache for consistency
      this._volResolveCache[idx] = {
        id: raw,
        ts: now
      };
      return;
    }
    // For templates, respect TTL to avoid spamming /api/template
    if (cached && now - cached.ts < this._volResolveTtlMs && cached.id) return;
    try {
      const resolved = await this._resolveTemplateAtActionTime(raw, obj.entity_id);
      if (resolved && typeof resolved === 'string') {
        this._volResolveCache[idx] = {
          id: resolved,
          ts: now
        };
        this.requestUpdate();
      }
    } catch (_) {
      // Leave existing cache (if any); do not throw
    }
  }

  // Get the resolved playback entity id for a chip index, preferring cache
  _getResolvedPlaybackEntityIdSync(idx) {
    return this._getEntityForPurpose(idx, 'playback_control');
  }

  // Get the resolved volume entity id for a chip index, preferring cache
  _getResolvedVolumeEntityIdSync(idx) {
    var _this$_volResolveCach;
    const obj = this.entityObjs[idx];
    if (!obj) return null;

    // If follow_active_volume is enabled, return the active playback entity
    if (obj.follow_active_volume) {
      return this._getActivePlaybackEntityId();
    }
    const cached = (_this$_volResolveCach = this._volResolveCache) === null || _this$_volResolveCach === void 0 || (_this$_volResolveCach = _this$_volResolveCach[idx]) === null || _this$_volResolveCach === void 0 ? void 0 : _this$_volResolveCach.id;
    if (cached && typeof cached === 'string') return cached;
    const raw = obj.volume_entity;
    if (raw && typeof raw === 'string') {
      const looksTemplate = raw.includes('{{') || raw.includes('{%');
      if (!looksTemplate) return raw;
    }
    return obj.entity_id;
  }

  // Get the actual resolved MA entity for state detection (can be unconfigured entities)
  _getActualResolvedMaEntityForState(idx) {
    var _this$_maResolveCache;
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    const cached = (_this$_maResolveCache = this._maResolveCache) === null || _this$_maResolveCache === void 0 || (_this$_maResolveCache = _this$_maResolveCache[idx]) === null || _this$_maResolveCache === void 0 ? void 0 : _this$_maResolveCache.id;
    if (cached && typeof cached === 'string') {
      return cached;
    }

    // No cache - check if we have a static MA entity
    const rawMaEntity = obj.music_assistant_entity;
    if (rawMaEntity && typeof rawMaEntity === 'string' && !rawMaEntity.includes('{{') && !rawMaEntity.includes('{%')) {
      return rawMaEntity;
    }

    // No MA entity or template - use main entity
    return obj.entity_id;
  }
  _isEntityPlaying(stateObj) {
    var _stateObj$state;
    if (!stateObj) return false;
    const s = (_stateObj$state = stateObj.state) === null || _stateObj$state === void 0 ? void 0 : _stateObj$state.toLowerCase();
    return s === "playing" || s === "buffering";
  }

  // Check if the currently selected entity (or its MA equivalent) is playing
  _isCurrentEntityPlaying() {
    var _this$hass2, _this$hass3;
    const mainId = this.currentEntityId;
    const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const mainState = mainId ? (_this$hass2 = this.hass) === null || _this$hass2 === void 0 || (_this$hass2 = _this$hass2.states) === null || _this$hass2 === void 0 ? void 0 : _this$hass2[mainId] : null;
    const maState = maId ? (_this$hass3 = this.hass) === null || _this$hass3 === void 0 || (_this$hass3 = _this$hass3.states) === null || _this$hass3 === void 0 ? void 0 : _this$hass3[maId] : null;
    return this._isEntityPlaying(mainState) || this._isEntityPlaying(maState);
  }

  // Resolve template at action time with fallback to main entity (async)
  async _resolveTemplateAtActionTime(templateString, fallbackEntityId) {
    return resolveTemplateAtActionTime(this.hass, templateString, fallbackEntityId);
  }

  /**
   * Attach horizontal swipe on the search‑results area to cycle media‑class filters.
   */
  _attachSearchSwipe() {
    if (this._searchSwipeAttached) return;
    const area = this.renderRoot.querySelector('.entity-options-search-results');
    if (!area) return;

    // Disable swipe-to-filter when in a hierarchy (artist -> albums -> tracks)
    if (this._searchHierarchy.length > 0) {
      return;
    }
    this._searchSwipeAttached = true;
    const threshold = 40; // px needed to trigger change

    const touchstartHandler = e => {
      if (e.touches.length === 1) {
        this._swipeStartX = e.touches[0].clientX;
      }
    };
    const touchendHandler = e => {
      if (this._swipeStartX === null) return;
      const endX = e.changedTouches && e.changedTouches[0].clientX || null;
      if (endX === null) {
        this._swipeStartX = null;
        return;
      }
      const dx = endX - this._swipeStartX;
      if (Math.abs(dx) > threshold) {
        var _this$entityObjs3;
        // Get all available media classes from cached results
        const allClasses = new Set();
        Object.values(this._searchResultsByType).forEach(results => {
          results.forEach(item => {
            if (item.media_class) allClasses.add(item.media_class);
          });
        });
        const currEntityObj = ((_this$entityObjs3 = this.entityObjs) === null || _this$entityObjs3 === void 0 ? void 0 : _this$entityObjs3[this._selectedIndex]) || null;
        const hiddenSet = new Set((currEntityObj === null || currEntityObj === void 0 ? void 0 : currEntityObj.hidden_filter_chips) || []);
        const classes = Array.from(allClasses).filter(c => !hiddenSet.has(c));
        const filterOrder = ['all', ...classes];
        const currIdx = filterOrder.indexOf(this._searchMediaClassFilter || 'all');
        const dir = dx < 0 ? 1 : -1; // swipe left -> next, right -> prev
        let nextIdx = (currIdx + dir + filterOrder.length) % filterOrder.length;
        const nextFilter = filterOrder[nextIdx];
        this._doSearch(nextFilter === 'all' ? null : nextFilter);
      }
      this._swipeStartX = null;
    };
    area.addEventListener('touchstart', touchstartHandler, {
      passive: true
    });
    area.addEventListener('touchend', touchendHandler, {
      passive: true
    });

    // Store handlers for cleanup
    area._searchSwipeHandlers = {
      touchstart: touchstartHandler,
      touchend: touchendHandler
    };
  }

  /**
   * Open the search sheet pre‑filled with the current track's artist and
   * launch the search immediately (only when media_artist is present).
   */
  _searchArtistFromNowPlaying() {
    var _ref;
    const artist = ((_ref = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj) === null || _ref === void 0 || (_ref = _ref.attributes) === null || _ref === void 0 ? void 0 : _ref.media_artist) || "";
    if (!artist) return; // nothing to search

    // Open overlay + search sheet
    this._showEntityOptions = true;
    this._showSearchInSheet = true;
    this._searchInputAutoFocused = false;

    // Prefill search state
    this._searchQuery = artist;
    this._searchError = "";
    this._searchAttempted = false;
    this._searchLoading = false;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = artist; // Set current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb

    // Clear filter states to ensure accurate artist search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._recommendationsFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Render, then run search
    this.requestUpdate();
    // Kick off search immediately so results populate without requiring user interaction.
    this._doSearch().catch(error => {
      console.error('yamp: artist quick-search failed:', error);
    });
  }
  // Show search sheet inside entity options
  _showSearchSheetInOptions() {
    let mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";
    this._showSearchInSheet = true;
    this._searchInputAutoFocused = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchAttempted = false;
    this._searchResultsByType = {}; // Clear cache when opening new search
    this._currentSearchQuery = ""; // Reset current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb
    this._usingMusicAssistant = false; // Track if we're using Music Assistant search
    this._favoritesFilterActive = false; // Track if favorites filter is active
    this._recentlyPlayedFilterActive = false; // Track if recently played filter is active
    this._upcomingFilterActive = false; // Track if upcoming queue filter is active
    this._recommendationsFilterActive = false; // Track if recommendations filter is active
    this._initialFavoritesLoaded = false; // Track if initial favorites have been loaded
    this.requestUpdate();

    // Trigger selected search mode after sheet opens
    setTimeout(() => {
      var _promise;
      let promise;
      switch (mode) {
        case "recently-played":
          promise = this._toggleRecentlyPlayedFilter(true);
          break;
        case "next-up":
          promise = this._toggleUpcomingFilter(true);
          break;
        case "recommendations":
          promise = this._toggleRecommendationsFilter(true);
          break;
        default:
          {
            const defaultFilter = this.config.default_search_filter === 'all' ? null : this.config.default_search_filter;
            promise = this._doSearch(defaultFilter);
          }
          break;
      }
      if ((_promise = promise) !== null && _promise !== void 0 && _promise.catch) {
        promise.catch(err => {
          console.error("yamp: search initialization failed:", err);
        });
      }
    }, 100);
    if (!this._disableSearchAutofocus) {
      // Handle focus for expand on search
      const focusDelay = this._alwaysCollapsed && this._expandOnSearch ? 300 : 200;
      setTimeout(() => {
        const inp = this.renderRoot.querySelector('#search-input-box');
        if (inp) {
          inp.focus();
        } else {
          // If input not found, try again with a longer delay
          setTimeout(() => {
            const retryInp = this.renderRoot.querySelector('#search-input-box');
            if (retryInp) {
              retryInp.focus();
            }
          }, 200);
        }
      }, focusDelay);
    }
  }
  _openQuickSearchOverlay() {
    let mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";
    this._quickMenuInvoke = true;
    this._showEntityOptions = true;
    this._showSearchSheetInOptions(mode);
    setTimeout(() => {
      this._notifyResize();
    }, 0);
  }
  _handleNavigate(path) {
    var _this$hass4;
    let openInNewTab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (typeof path !== "string") return;
    const target = path.trim();
    if (!target) return;
    const navEvent = new CustomEvent("hass-navigate", {
      detail: {
        path: target
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(navEvent);
    if (navEvent.defaultPrevented) return;
    let handled = false;
    if (target.startsWith("#")) {
      window.location.hash = target;
      handled = true;
    } else if (/^https?:\/\//i.test(target)) {
      if (openInNewTab) {
        window.open(target, "_blank", "noopener,noreferrer");
        return;
      }
      window.location.assign(target);
      handled = true;
    } else if ((_this$hass4 = this.hass) !== null && _this$hass4 !== void 0 && _this$hass4.navigate) {
      this.hass.navigate(target);
      handled = true;
    } else {
      window.history.pushState(null, "", target);
      handled = true;
    }
    if (handled) {
      window.dispatchEvent(new CustomEvent("location-changed", {
        detail: {
          replace: false
        }
      }));
    }
  }
  _hideSearchSheetInOptions() {
    this._showSearchInSheet = false;
    this._searchError = "";
    this._searchResults = [];
    this._searchQuery = "";
    this._searchDisplaySortOverride = null;
    this._searchInputAutoFocused = false;
    this._searchLoading = false;
    this._searchAttempted = false;
    this._searchResultsByType = {}; // Clear cache when closing
    this._currentSearchQuery = ""; // Reset current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb
    this._recommendationsFilterActive = false;
    if (this._quickMenuInvoke) {
      this._showEntityOptions = false;
      this._quickMenuInvoke = false;
    }
    this.requestUpdate();
    // Force layout update for expand on search
    setTimeout(() => {
      this._notifyResize();
    }, 0);
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
    this._searchDisplaySortOverride = null;
    this._searchLoading = false;
    this._searchInputAutoFocused = false;
    this._searchResultsByType = {}; // Clear cache when closing
    this._currentSearchQuery = ""; // Reset current search query
    this._searchHierarchy = []; // Clear search hierarchy
    this._searchBreadcrumb = ""; // Clear breadcrumb
    this._recommendationsFilterActive = false;
    if (this._quickMenuInvoke) {
      this._showEntityOptions = false;
      this._showSearchInSheet = false;
      this._quickMenuInvoke = false;
    }
    this.requestUpdate();
  }
  _closeMenuIfOpen() {
    if (this._queueActionsMenuOpenId) {
      this._closeQueueActionsMenu();
    }
  }
  _sortSearchResults(results) {
    let sortModeOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const sortMode = sortModeOverride ?? this._getConfiguredSearchResultsSortMode();
    const list = Array.isArray(results) ? [...results] : [];
    if (sortMode === "random") {
      // Fisher-Yates shuffle for an unbiased random order
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      return list;
    }

    // All other sorting is handled server-side via order_by parameter
    return list;
  }
  _getConfiguredSearchResultsSortMode() {
    var _this$config;
    const configured = (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.search_results_sort;
    const mode = typeof configured === "string" ? configured : "default";
    return this._mapLegacySortOption(mode);
  }
  _mapLegacySortOption(mode) {
    if (!mode) return "default";
    const legacyMap = {
      "title_asc": "name",
      "title_desc": "name_desc",
      "artist_asc": "artist_name",
      "artist_desc": "artist_name_desc"
    };
    return legacyMap[mode] || mode;
  }
  _isSortableSearchMode(mode) {
    if (!mode || mode === "default" || mode === "random" || mode === "random_play_count") return false;
    return true;
  }
  _getOppositeSearchSortMode(mode) {
    if (!mode || mode === "default" || mode === "random" || mode === "random_play_count") return null;
    // Toggle between asc and desc variants
    if (mode.endsWith("_desc")) {
      return mode.replace(/_desc$/, "");
    }
    return `${mode}_desc`;
  }
  _shouldShowSearchSortToggle() {
    return this._isSortableSearchMode(this._getConfiguredSearchResultsSortMode());
  }
  _toggleSearchResultsSortDirection() {
    if (!this._shouldShowSearchSortToggle()) {
      this._searchDisplaySortOverride = null;
      return;
    }
    const configured = this._getConfiguredSearchResultsSortMode();
    const alternate = this._getOppositeSearchSortMode(configured);
    if (!alternate) {
      this._searchDisplaySortOverride = null;
      return;
    }
    if (this._searchDisplaySortOverride === alternate) {
      this._searchDisplaySortOverride = null;
    } else {
      this._searchDisplaySortOverride = alternate;
    }
    // Clear cached results so _doSearch re-fetches with the new order_by
    this._searchResultsByType = {};
    // Re-trigger search with new sort order
    this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter, {
      orderBy: this._getActiveSearchDisplaySortMode()
    });
    this.requestUpdate();
  }
  _getActiveSearchDisplaySortMode() {
    if (!this._shouldShowSearchSortToggle()) {
      return this._getConfiguredSearchResultsSortMode();
    }
    const override = this._searchDisplaySortOverride;
    if (override && this._isSortableSearchMode(override)) {
      return override;
    }
    return this._getConfiguredSearchResultsSortMode();
  }
  _getSearchSortToggleIcon() {
    const mode = this._getActiveSearchDisplaySortMode();
    if (!this._isSortableSearchMode(mode)) {
      return "mdi:sort-variant";
    }
    return mode.endsWith("_desc") ? "mdi:sort-descending" : "mdi:sort-ascending";
  }
  _getSearchSortToggleTitle() {
    const mode = this._getActiveSearchDisplaySortMode();
    if (!this._isSortableSearchMode(mode)) {
      return "Toggle search result order";
    }
    const isDesc = mode.endsWith("_desc");
    const baseName = isDesc ? mode.replace(/_desc$/, "") : mode;
    const label = baseName.replace(/_/g, " ");
    return `Sort by ${label} ${isDesc ? "descending" : "ascending"}`;
  }
  _getDisplaySearchResults() {
    const baseResults = Array.isArray(this._searchResults) ? this._searchResults : [];
    return baseResults;
  }
  _getSearchResultsLimit() {
    var _this$config2;
    const raw = Number((_this$config2 = this.config) === null || _this$config2 === void 0 ? void 0 : _this$config2.search_results_limit);
    if (Number.isFinite(raw)) {
      if (raw === 0) {
        return 0; // Explicitly disable limit
      }
      return Math.min(Math.max(raw, 1), 1000);
    }
    return 20;
  }
  _getSearchResultsCount() {
    return Array.isArray(this._searchResults) ? this._searchResults.length : 0;
  }
  _shouldShowSearchResultsCount() {
    if (this._isNarrowViewport || !this._usingMusicAssistant || this._searchLoading) {
      return false;
    }
    const count = this._getSearchResultsCount();
    if (count > 0) {
      return true;
    }
    return this._searchAttempted || this._initialFavoritesLoaded || this._favoritesFilterActive || this._recentlyPlayedFilterActive || this._upcomingFilterActive || this._recommendationsFilterActive;
  }
  _getSearchResultsCountLabel() {
    const count = this._getSearchResultsCount();
    const key = count === 1 ? 'search.result' : 'search.results';
    return `${count} ${localize(key)}`;
  }
  async _doSearch() {
    var _this$config3;
    let mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let searchParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this._searchAttempted = true;
    this._closeMenuIfOpen();
    // Set the current filter - but don't use "favorites" as a media type
    this._searchMediaClassFilter = mediaType && mediaType !== 'favorites' ? mediaType : 'all';

    // Respect favorites toggle across chip changes, but allow explicit filter clearing
    // FIX: Include _initialFavoritesLoaded AND _lastSearchUsedServerFavorites to persist implicit favorites state
    const isFavorites = !!(searchParams.favorites || (this._favoritesFilterActive || this._initialFavoritesLoaded || this._lastSearchUsedServerFavorites) && !searchParams.clearFilters);

    // FIX: Explicitly persist the favorites filter state if we determined we are in favorites mode
    if (isFavorites) {
      this._favoritesFilterActive = true;
    }
    const isRecentlyPlayed = !!(searchParams.isRecentlyPlayed || this._recentlyPlayedFilterActive && !searchParams.clearFilters);
    const isUpcoming = !!(searchParams.isUpcoming || this._upcomingFilterActive && !searchParams.clearFilters);
    const isRecommendations = !!(searchParams.isRecommendations || this._recommendationsFilterActive && !searchParams.clearFilters);

    // Check if search query has changed - if so, clear cache
    if (this._currentSearchQuery !== this._searchQuery) {
      this._searchResultsByType = {};
      this._currentSearchQuery = this._searchQuery;
    }

    // Use cached results if available for this media type and search params
    const sortMode = this._getActiveSearchDisplaySortMode();
    const cacheKey = `${mediaType || 'all'}${isFavorites ? '_favorites' : ''}${isRecentlyPlayed ? '_recently_played' : ''}${isUpcoming ? '_upcoming' : ''}${isRecommendations ? '_recommendations' : ''}_sort_${sortMode}`;
    if (this._searchResultsByType[cacheKey]) {
      if (this._searchTimeoutHandle) {
        clearTimeout(this._searchTimeoutHandle);
        this._searchTimeoutHandle = null;
      }
      this._latestSearchToken = 0;
      this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
      this._searchLoading = false;
      this._searchError = "";
      this.requestUpdate();
      return;
    }
    this._searchLoading = true;
    this._searchError = "";
    this._searchResults = [];
    this.requestUpdate();
    const searchToken = Date.now();
    this._latestSearchToken = searchToken;
    const progressiveUpdate = chunk => this._handleProgressiveSearchResults(chunk, cacheKey, searchToken);
    if (this._searchTimeoutHandle) {
      clearTimeout(this._searchTimeoutHandle);
    }
    this._searchTimeoutHandle = window.setTimeout(() => {
      if (this._latestSearchToken === searchToken && this._searchLoading) {
        this._searchLoading = false;
        this._searchError = "Search timed out. Try again.";
        this.requestUpdate();
      }
    }, (_this$config3 = this.config) !== null && _this$config3 !== void 0 && _this$config3.search_timeout_ms ? Number(this.config.search_timeout_ms) : 15000);
    try {
      const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
      let searchResponse;

      // Check for recently played first (highest priority)
      if (isRecentlyPlayed) {
        // Load recently played items
        this._initialFavoritesLoaded = false;
        searchResponse = await getRecentlyPlayed(this.hass, searchEntityId, mediaType, this._getSearchResultsLimit(), {
          onChunk: progressiveUpdate
        });
        this._lastSearchUsedServerFavorites = false;
      } else if (isUpcoming) {
        // Load upcoming queue items
        this._initialFavoritesLoaded = false;
        searchResponse = await this._getUpcomingQueue(this.hass, searchEntityId, this._getSearchResultsLimit());
        this._lastSearchUsedServerFavorites = false;
      } else if (isRecommendations) {
        this._initialFavoritesLoaded = false;
        searchResponse = await this._getRecommendations(this.hass, searchEntityId, mediaType, this._getSearchResultsLimit());
        this._lastSearchUsedServerFavorites = false;
      } else if (isFavorites) {
        // Ask backend (Music Assistant) to filter favorites at source with the current query
        this._initialFavoritesLoaded = false;
        const orderBy = this._getActiveSearchDisplaySortMode();
        searchResponse = await searchMedia(this.hass, searchEntityId, this._searchQuery, mediaType, {
          ...searchParams,
          favorites: true,
          orderBy: orderBy !== 'default' ? orderBy : undefined
        }, this._getSearchResultsLimit());
        this._lastSearchUsedServerFavorites = true;
      } else if ((!this._searchQuery || this._searchQuery.trim() === '') && !isFavorites && !isRecentlyPlayed && (mediaType === 'all' || !mediaType)) {
        const orderBy = this._getActiveSearchDisplaySortMode();
        searchResponse = await getFavorites(this.hass, searchEntityId, mediaType === 'favorites' ? null : mediaType, this._getSearchResultsLimit(), {
          onChunk: progressiveUpdate,
          orderBy: orderBy !== 'default' ? orderBy : undefined
        });
        // Mark that initial favorites have been loaded only if we're in default view
        if (!this._searchQuery || this._searchQuery.trim() === '') {
          this._initialFavoritesLoaded = true;
        }
        this._lastSearchUsedServerFavorites = true;
      } else {
        // Perform search - reset initial favorites flag since this is a user search
        this._initialFavoritesLoaded = false;
        const orderBy = this._getActiveSearchDisplaySortMode();
        searchResponse = await searchMedia(this.hass, searchEntityId, this._searchQuery, mediaType, {
          ...searchParams,
          orderBy: orderBy !== 'default' ? orderBy : undefined
        }, this._getSearchResultsLimit());
        this._lastSearchUsedServerFavorites = false;
      }

      // Client-side filtering for lists that don't support server-side search (Recent, Upcoming, Recommendations)
      if ((isRecentlyPlayed || isUpcoming || isRecommendations) && this._searchQuery && this._searchQuery.trim() !== '') {
        const query = this._searchQuery.trim().toLowerCase();
        if (searchResponse && searchResponse.results) {
          searchResponse.results = searchResponse.results.filter(item => {
            const title = (item.title || "").toLowerCase();
            const artist = (item.artist || "").toLowerCase();
            const album = (item.album || "").toLowerCase();
            return title.includes(query) || artist.includes(query) || album.includes(query);
          });
        }
      }

      // Handle the new response format
      const arr = searchResponse.results || [];
      this._usingMusicAssistant = searchResponse.usedMusicAssistant || false;

      // Initialize/Reset internal states when config changes is a completely new search (not just switching filters)
      const isNewSearch = this._currentSearchQuery !== this._searchQuery;
      if (isNewSearch) {
        this._favoritesFilterActive = false;
        this._recentlyPlayedFilterActive = false;
        this._upcomingFilterActive = false;
        this._recommendationsFilterActive = false;
        this._initialFavoritesLoaded = false;
      }
      const normalizedResults = Array.isArray(arr) ? arr : [];
      this._searchResults = this._sortSearchResults(normalizedResults);

      // Apply local favorites filter ONLY when needed (e.g., switching filter chips with cached results)
      if (!isNewSearch && this._favoritesFilterActive && !this._lastSearchUsedServerFavorites) {
        await this._applyFavoritesFilterIfActive();
      }

      // Cache the results for this media type and search params
      this._searchResultsByType[cacheKey] = normalizedResults;

      // remember how many rows exist in the full ("All") set, but keep at least 15 for layout
      const rows = Array.isArray(this._searchResults) ? this._searchResults.length : 0;
      this._searchTotalRows = Math.max(15, rows); // keep at least 15
    } catch (e) {
      this._searchError = e && e.message || "Unknown error";
      this._searchResults = [];
      this._searchTotalRows = 0;
    }
    if (this._latestSearchToken === searchToken && this._searchTimeoutHandle) {
      clearTimeout(this._searchTimeoutHandle);
      this._searchTimeoutHandle = null;
    }
    if (this._latestSearchToken === searchToken) {
      this._latestSearchToken = 0;
    }
    this._searchLoading = false;
    this.requestUpdate();
  }

  // Handle explicit search submission from UI (Enter key or Search Button)
  _handleSearchSubmit() {
    const keepFilters = this._keepFiltersOnSearch;
    if (!keepFilters) {
      this._favoritesFilterActive = false;
      this._recentlyPlayedFilterActive = false;
      this._upcomingFilterActive = false;
      this._recommendationsFilterActive = false;
    }
    const clearFilters = !keepFilters;
    this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter, {
      clearFilters
    });
  }
  _handleProgressiveSearchResults(chunk, cacheKey, searchToken) {
    if (!Array.isArray(chunk) || !chunk.length) {
      return;
    }
    if (this._latestSearchToken !== searchToken) {
      return;
    }
    const mergedResults = (this._searchResultsByType[cacheKey] || []).concat(chunk);
    this._searchResultsByType[cacheKey] = mergedResults;
    this._searchResults = this._sortSearchResults(mergedResults);
    const rows = Array.isArray(mergedResults) ? mergedResults.length : 0;
    this._searchTotalRows = Math.max(15, rows);
    this.requestUpdate();
  }

  // Derive the list of visible search filter chips based on cached results and entity visibility settings
  _getVisibleSearchFilterClasses() {
    var _this$entityObjs4;
    const classes = new Set();
    const cacheValues = Object.values(this._searchResultsByType || {});
    cacheValues.forEach(results => {
      const items = Array.isArray(results) ? results : Array.isArray(results === null || results === void 0 ? void 0 : results.results) ? results.results : [];
      items.forEach(item => {
        const mediaClass = item === null || item === void 0 ? void 0 : item.media_class;
        if (mediaClass) {
          classes.add(mediaClass);
        }
      });
    });
    const currEntityObj = ((_this$entityObjs4 = this.entityObjs) === null || _this$entityObjs4 === void 0 ? void 0 : _this$entityObjs4[this._selectedIndex]) || null;
    const hiddenSet = new Set((currEntityObj === null || currEntityObj === void 0 ? void 0 : currEntityObj.hidden_filter_chips) || []);
    return Array.from(classes).filter(c => !hiddenSet.has(c));
  }
  async _playMediaFromSearch(item) {
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    this._searchError = "";
    const playbackStarted = await this._performSearchPlayback(item, targetEntityId);
    if (!playbackStarted) {
      this._searchError = "Unable to start playback. Please try again.";
      this.requestUpdate();
      return;
    }

    // Default to true if config option is missing (backward compatibility)
    const shouldDismiss = this.config.dismiss_search_on_play !== false;
    if (shouldDismiss) {
      if (this._showSearchInSheet) {
        this._closeEntityOptions();
        this._showSearchInSheet = false;
      }
      this._searchCloseSheet();
    } else {
      // If staying open, force a repaint to reflect playing state if needed
      this.requestUpdate();
    }
  }
  async _performSearchPlayback(item, targetEntityId) {
    // Check if this is a queue item (has queue_item_id) and we're in the upcoming filter with working mass_queue
    if (item.queue_item_id && this._upcomingFilterActive && this._isMusicAssistantEntity() && this._massQueueAvailable) {
      // For queue items in the "Next Up" filter, play the specific queue item
      try {
        const maState = this._getMusicAssistantState();
        const maEntityId = maState === null || maState === void 0 ? void 0 : maState.entity_id;
        if (maEntityId) {
          // Use mass_queue to play the specific queue item
          await this.hass.callService("mass_queue", "play_queue_item", {
            entity: maEntityId,
            queue_item_id: item.queue_item_id
          });
          this._invalidateUpcomingCache();
          return true;
        }
      } catch (error) {
        console.error('yamp: Error playing queue item:', error);
        // Fallback to next track if service call fails
        await this.hass.callService("media_player", "media_next_track", {
          entity_id: targetEntityId
        });
        return true;
      }
    }
    if (!targetEntityId) {
      return false;
    }

    // For regular search results or fallback mode, use the normal play method with a retry guard.
    const monitorIds = this._collectPlaybackMonitorIds(targetEntityId);
    const firstSnapshot = this._snapshotPlaybackState(monitorIds);
    const firstAttempt = await this._invokePlayMedia(targetEntityId, item);
    if (!firstAttempt) {
      return false;
    }
    const firstChangeDetected = await this._waitForPlaybackChange(firstSnapshot, monitorIds);
    if (firstChangeDetected) {
      return true;
    }

    // Retry once if we didn't observe playback starting yet.
    const retrySnapshot = this._snapshotPlaybackState(monitorIds);
    const retryAttempt = await this._invokePlayMedia(targetEntityId, item);
    if (!retryAttempt) {
      return false;
    }
    return await this._waitForPlaybackChange(retrySnapshot, monitorIds);
  }
  _collectPlaybackMonitorIds(targetEntityId) {
    const ids = new Set();
    if (targetEntityId) ids.add(targetEntityId);
    const playbackEntity = this._getPlaybackEntityId(this._selectedIndex);
    if (playbackEntity) ids.add(playbackEntity);
    const mainEntity = this.currentEntityId;
    if (mainEntity) ids.add(mainEntity);
    const maEntity = this._getActualResolvedMaEntityForState(this._selectedIndex);
    if (maEntity) ids.add(maEntity);
    return Array.from(ids).filter(Boolean);
  }
  _snapshotPlaybackState(entityIds) {
    const snapshot = {};
    if (!Array.isArray(entityIds)) {
      return snapshot;
    }
    entityIds.forEach(id => {
      var _this$hass5, _stateObj$attributes4, _stateObj$attributes5;
      const stateObj = id ? (_this$hass5 = this.hass) === null || _this$hass5 === void 0 || (_this$hass5 = _this$hass5.states) === null || _this$hass5 === void 0 ? void 0 : _this$hass5[id] : null;
      snapshot[id] = {
        state: (stateObj === null || stateObj === void 0 ? void 0 : stateObj.state) ?? null,
        mediaId: (stateObj === null || stateObj === void 0 || (_stateObj$attributes4 = stateObj.attributes) === null || _stateObj$attributes4 === void 0 ? void 0 : _stateObj$attributes4.media_content_id) ?? null,
        mediaTitle: (stateObj === null || stateObj === void 0 || (_stateObj$attributes5 = stateObj.attributes) === null || _stateObj$attributes5 === void 0 ? void 0 : _stateObj$attributes5.media_title) ?? null
      };
    });
    return snapshot;
  }
  async _waitForPlaybackChange(snapshot, entityIds) {
    let timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2500;
    if (!Array.isArray(entityIds) || entityIds.length === 0) {
      return true;
    }
    const start = Date.now();
    while (Date.now() - start < timeout) {
      await this._delay(150);
      for (const id of entityIds) {
        var _this$hass6, _stateObj$attributes6, _stateObj$attributes7;
        if (!id) continue;
        const stateObj = (_this$hass6 = this.hass) === null || _this$hass6 === void 0 || (_this$hass6 = _this$hass6.states) === null || _this$hass6 === void 0 ? void 0 : _this$hass6[id];
        if (!stateObj) continue;
        if (this._isEntityPlaying(stateObj)) {
          return true;
        }
        const previous = snapshot[id] || {};
        const currentMediaId = ((_stateObj$attributes6 = stateObj.attributes) === null || _stateObj$attributes6 === void 0 ? void 0 : _stateObj$attributes6.media_content_id) ?? null;
        const currentTitle = ((_stateObj$attributes7 = stateObj.attributes) === null || _stateObj$attributes7 === void 0 ? void 0 : _stateObj$attributes7.media_title) ?? null;
        if (currentMediaId && currentMediaId !== previous.mediaId) {
          return true;
        }
        if (currentTitle && currentTitle !== previous.mediaTitle) {
          return true;
        }
        if (!previous.mediaId && currentMediaId) {
          return true;
        }
        if (!previous.mediaTitle && currentTitle) {
          return true;
        }
      }
    }
    return false;
  }
  async _performSearchOptionAction(item, mode) {
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    try {
      const playParams = {
        entity_id: targetEntityId,
        media_id: item.media_content_id,
        media_type: item.media_content_type,
        enqueue: mode
      };
      if (this._radioModeActive) {
        playParams.radio_mode = true;
      }
      await this.hass.callService("music_assistant", "play_media", playParams);
      // Invalidate the "Next Up" cache because we've modified the queue
      this._invalidateUpcomingCache();

      // For 'replace' mode, we dismiss according to settings and don't show success overlay
      if (mode === 'replace') {
        const shouldDismiss = this.config.dismiss_search_on_play !== false;
        if (shouldDismiss) {
          this._closeEntityOptions();
        }
        this._activeSearchRowMenuId = null;
      } else {
        // For other modes, show the localized success message overlay within the slide-out
        this._successSearchRowMenuId = item.media_content_id;
        this.requestUpdate();
        setTimeout(() => {
          this._successSearchRowMenuId = null;
          this._activeSearchRowMenuId = null; // Also dismiss the slide-out after message fades
          this.requestUpdate();
        }, 2000);
      }
    } catch (e) {
      console.error("Failed to perform search option action:", e);
      this._searchError = "Action failed: " + e.message;
      this.requestUpdate();
    }
  }
  async _invokePlayMedia(targetEntityId, item) {
    try {
      if (this._radioModeActive) {
        await this.hass.callService("music_assistant", "play_media", {
          entity_id: targetEntityId,
          media_id: item.media_content_id,
          media_type: item.media_content_type,
          radio_mode: true
        });
      } else {
        await playSearchedMedia(this.hass, targetEntityId, item);
      }
      return true;
    } catch (error) {
      console.error("yamp: Error starting playback from search:", error);
      return false;
    }
  }
  _delay(ms) {
    return new Promise(resolve => {
      const timerHost = typeof window !== "undefined" ? window : globalThis;
      timerHost.setTimeout(resolve, ms);
    });
  }
  async _queueMediaFromSearch(item) {
    const targetEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const targetEntityId = await this._resolveTemplateAtActionTime(targetEntityIdTemplate, this.currentEntityId);
    // Use enqueue: next to add to queue
    if (this._radioModeActive) {
      this.hass.callService("music_assistant", "play_media", {
        entity_id: targetEntityId,
        media_id: item.media_content_id,
        media_type: item.media_content_type,
        enqueue: "add",
        radio_mode: true
      });
    } else {
      this.hass.callService("media_player", "play_media", {
        entity_id: targetEntityId,
        media_content_type: item.media_content_type,
        media_content_id: item.media_content_id,
        enqueue: "next"
      });
    }

    // Invalidate the "Next Up" cache
    this._invalidateUpcomingCache();

    // Show success message
    this._showQueueSuccessMessage = true;
    this.requestUpdate();

    // Show message for 3 seconds but keep search sheet open
    setTimeout(() => {
      this._showQueueSuccessMessage = false;
      this.requestUpdate();
    }, 3000);
  }

  // Handle hierarchical search - search for albums by artist
  async _searchArtistAlbums(artistName) {
    this._searchHierarchy.push({
      type: 'artist',
      name: artistName,
      query: this._searchQuery
    });
    this._searchBreadcrumb = `Albums by ${artistName}`;
    this._searchQuery = artistName;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = artistName;
    this._searchMediaClassFilter = 'album';

    // Clear filter states to ensure accurate artist search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._upcomingFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Remove swipe handlers when entering hierarchy
    this._removeSearchSwipeHandlers();

    // Use Music Assistant search with artist name for albums (explicitly clear filters)
    await this._doSearch('album', {
      clearFilters: true
    });
  }

  // Go back in search hierarchy
  _goBackInSearch() {
    if (this._searchHierarchy.length === 0) return;

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this.requestUpdate();
    const previousLevel = this._searchHierarchy.pop();
    this._searchQuery = previousLevel.query;
    this._currentSearchQuery = previousLevel.query;
    this._searchResultsByType = {}; // Clear cache for new search

    if (this._searchHierarchy.length === 0) {
      this._searchBreadcrumb = "";
      this._searchMediaClassFilter = 'all';
      this._doSearch();
    } else {
      const currentLevel = this._searchHierarchy[this._searchHierarchy.length - 1];
      if (currentLevel.type === 'artist') {
        this._searchBreadcrumb = `Albums by ${currentLevel.name}`;
        this._searchMediaClassFilter = 'album';
        this._doSearch('album', {
          artist: currentLevel.name
        });
      } else if (currentLevel.type === 'album') {
        this._searchBreadcrumb = `Tracks from ${currentLevel.name}`;
        this._searchMediaClassFilter = 'track';
        if (currentLevel.uri && this._isMusicAssistantEntity()) {
          this._searchQuery = currentLevel.name;
          this._searchAlbumTracks(currentLevel.name, null, currentLevel.uri);
          return;
        }
        // Fallback search
        const artistLevel = this._searchHierarchy.find(level => level.type === 'artist');
        const searchParams = {
          album: currentLevel.name
        };
        if (artistLevel) {
          searchParams.artist = artistLevel.name;
        }
        this._doSearch('track', searchParams);
      } else if (currentLevel.type === 'playlist') {
        this._searchBreadcrumb = `Tracks in ${currentLevel.name}`;
        this._searchMediaClassFilter = 'track';
        if (currentLevel.uri && this._isMusicAssistantEntity()) {
          this._searchQuery = currentLevel.name;
          this._showPlaylistTracks({
            title: currentLevel.name,
            media_content_id: currentLevel.uri
          });
          return;
        }
        this._doSearch('track');
      }
    }
  }

  // Check if a search result is clickable for hierarchical navigation
  _isClickableSearchResult(item) {
    if (!item) return false;
    return !!item.is_browsable;
  }

  // Handle touch events to prevent accidental clicks during scrolling
  _handleSearchResultTouch(item, event) {
    // Only handle touch events on mobile
    if (!('ontouchstart' in window)) {
      return;
    }
    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    let hasMoved = false;
    const moveThreshold = 10; // pixels

    const handleTouchMove = moveEvent => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = Math.abs(moveTouch.clientX - startX);
      const deltaY = Math.abs(moveTouch.clientY - startY);
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        hasMoved = true;
      }
    };
    const handleTouchEnd = endEvent => {
      // Remove event listeners
      document.removeEventListener('touchmove', handleTouchMove, {
        passive: true
      });
      document.removeEventListener('touchend', handleTouchEnd, {
        passive: true
      });

      // Only trigger click if finger didn't move significantly (not scrolling)
      if (!hasMoved) {
        this._handleSearchResultClick(item);
      }
    };

    // Add event listeners
    document.addEventListener('touchmove', handleTouchMove, {
      passive: true
    });
    document.addEventListener('touchend', handleTouchEnd, {
      passive: true
    });
  }

  // Get the tooltip title for clickable search results
  _getSearchResultClickTitle(item) {
    if (!this._isClickableSearchResult(item)) return "";
    return getSearchResultClickTitle(item);
  }

  // Force-invalidate the "Next Up" results cache
  _invalidateUpcomingCache() {
    const classFilter = this._searchMediaClassFilter || 'all';
    const cacheKey = `${classFilter}_upcoming`;
    if (this._searchResultsByType) {
      delete this._searchResultsByType[cacheKey];
      this.requestUpdate();
    }
  }
  _toggleRadioMode() {
    this._radioModeActive = !this._radioModeActive;
    this.requestUpdate();
  }

  // Toggle favorites filter - use existing _doSearch method with favorites parameter
  async _toggleFavoritesFilter() {
    this._favoritesFilterActive = !this._favoritesFilterActive;

    // Make mutually exclusive with other filters
    if (this._favoritesFilterActive) {
      this._recentlyPlayedFilterActive = false;
      this._upcomingFilterActive = false;
      this._recommendationsFilterActive = false;
    }
    if (this._favoritesFilterActive) {
      // Use the existing _doSearch method with favorites parameter
      // This aligns with how initial favorites loading works
      const currentMediaType = this._searchMediaClassFilter;

      // FIX: Always use the structured search with favorites: true
      // This ensures we respect the current filter (e.g., Radio) and don't pass invalid 'favorites' media type
      try {
        await this._doSearch(currentMediaType, {
          favorites: true
        });
      } catch (error) {
        console.error('yamp: Error searching favorites:', error);
      }
    } else {
      // Favorites filter turned OFF:
      // We must reload the standard items for the current filter.
      const currentMediaType = this._searchMediaClassFilter;

      // FIX: Explicitly clear the persistence flags so _doSearch doesn't immediately re-enable favorites
      this._lastSearchUsedServerFavorites = false;
      this._initialFavoritesLoaded = false;

      // Pass clearFilters: true to ensure we don't pick up any lingering filter states from the isFavorites calculation
      await this._doSearch(currentMediaType, {
        clearFilters: true
      });
    }
  }

  // Toggle recently played filter
  async _toggleRecentlyPlayedFilter() {
    let forceState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    const targetState = typeof forceState === "boolean" ? forceState : !this._recentlyPlayedFilterActive;
    targetState !== this._recentlyPlayedFilterActive;
    this._recentlyPlayedFilterActive = targetState;

    // Make mutually exclusive with other filters
    if (this._recentlyPlayedFilterActive) {
      this._favoritesFilterActive = false;
      this._upcomingFilterActive = false;
      this._recommendationsFilterActive = false;
      this._initialFavoritesLoaded = false; // Clear the initial favorites state
    }
    if (this._recentlyPlayedFilterActive) {
      // Clear search box since it's not used in recently played mode
      this._searchQuery = '';
      // Load recently played items - always use "all" for recently played
      try {
        await this._doSearch('all', {
          isRecentlyPlayed: true,
          clearFilters: true
        });
      } catch (error) {
        console.error('yamp: Error in _doSearch for recently played:', error);
      }
    } else {
      // Restore original search results
      if (this._searchQuery && this._searchQuery.trim() !== '') {
        // Resubmit the original search without recently played filter
        const currentMediaType = this._searchMediaClassFilter;
        await this._doSearch(currentMediaType);
      } else {
        // Restore from cache or load favorites if no search query
        const cacheKey = `${this._searchMediaClassFilter || 'all'}`;
        if (this._searchResultsByType[cacheKey]) {
          this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
          this.requestUpdate();
        } else {
          // No cache, load favorites as default
          await this._doSearch('favorites');
        }
      }
    }
  }

  // Toggle upcoming queue filter
  async _toggleUpcomingFilter() {
    let forceState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    const targetState = typeof forceState === "boolean" ? forceState : !this._upcomingFilterActive;
    targetState !== this._upcomingFilterActive;
    this._upcomingFilterActive = targetState;

    // Make mutually exclusive with other filters
    if (this._upcomingFilterActive) {
      this._favoritesFilterActive = false;
      this._recentlyPlayedFilterActive = false;
      this._recommendationsFilterActive = false;
      this._initialFavoritesLoaded = false; // Clear the initial favorites state
    }
    if (this._upcomingFilterActive) {
      // Clear search box since it's not used in upcoming mode
      this._searchQuery = '';
      // Clear cache to force fresh fetch
      const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
      delete this._searchResultsByType[cacheKey];
      // Subscribe to queue update events
      await this._subscribeToQueueUpdates();
      // Load upcoming queue items - always use "all" for upcoming
      try {
        await this._doSearch('all', {
          isUpcoming: true,
          clearFilters: true
        });
      } catch (error) {
        console.error('yamp: Error in _doSearch for upcoming queue:', error);
      }
    } else {
      // Unsubscribe from queue update events
      this._unsubscribeFromQueueUpdates();
      // Restore original search results
      if (this._searchQuery && this._searchQuery.trim() !== '') {
        // Resubmit the original search without upcoming filter
        const currentMediaType = this._searchMediaClassFilter;
        await this._doSearch(currentMediaType);
      } else {
        // Restore from cache or load favorites if no search query
        const cacheKey = `${this._searchMediaClassFilter || 'all'}`;
        if (this._searchResultsByType[cacheKey]) {
          this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
          this.requestUpdate();
        } else {
          // No cache, load favorites as default
          await this._doSearch('favorites');
        }
      }
    }
  }

  // Toggle recommendations filter (mass_queue)
  async _toggleRecommendationsFilter() {
    let forceState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    const targetState = typeof forceState === "boolean" ? forceState : !this._recommendationsFilterActive;
    targetState !== this._recommendationsFilterActive;
    this._recommendationsFilterActive = targetState;
    if (this._recommendationsFilterActive) {
      this._favoritesFilterActive = false;
      this._recentlyPlayedFilterActive = false;
      this._upcomingFilterActive = false;
      this._initialFavoritesLoaded = false;
      this._searchQuery = '';
      try {
        const hasMassQueue = await this._isMassQueueIntegrationAvailable(this.hass);
        this._hasMassQueueIntegration = hasMassQueue;
        this._massQueueAvailable = hasMassQueue;
        if (!hasMassQueue) {
          this._recommendationsFilterActive = false;
          this._searchError = "Recommendations require the Music Assistant queue integration.";
          this.requestUpdate();
          return;
        }
        await this._doSearch('all', {
          isRecommendations: true,
          clearFilters: true
        });
      } catch (error) {
        console.error('yamp: Error in _doSearch for recommendations:', error);
        this._searchError = "Unable to load recommendations.";
        this._recommendationsFilterActive = false;
        this.requestUpdate();
      }
    } else {
      if (this._searchQuery && this._searchQuery.trim() !== '') {
        const currentMediaType = this._searchMediaClassFilter;
        await this._doSearch(currentMediaType);
      } else {
        const cacheKey = `${this._searchMediaClassFilter || 'all'}`;
        if (this._searchResultsByType[cacheKey]) {
          this._searchResults = this._sortSearchResults(this._searchResultsByType[cacheKey]);
          this.requestUpdate();
        } else {
          await this._doSearch('favorites');
        }
      }
    }
  }

  // Get next track from Music Assistant (limited by Music Assistant API)
  async _getUpcomingQueue(hass, entityId) {
    let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    try {
      // Always check for mass_queue integration (don't cache this)
      const hasMassQueue = await this._isMassQueueIntegrationAvailable(hass);

      // Cache the result for UI rendering
      this._massQueueAvailable = hasMassQueue;
      this._hasMassQueueIntegration = hasMassQueue;
      if (hasMassQueue) {
        try {
          const massQueueResult = await this._getUpcomingQueueWithMassQueue(hass, entityId, limit);

          // If mass_queue returns 0 results, fall back to original method
          if (!massQueueResult.results || massQueueResult.results.length === 0) {
            this._massQueueAvailable = false; // Hide queue management buttons
            return await this._getUpcomingQueueOriginal(hass, entityId, limit);
          }
          return massQueueResult;
        } catch (error) {
          this._massQueueAvailable = false; // Hide queue management buttons
          return await this._getUpcomingQueueOriginal(hass, entityId, limit);
        }
      }

      // Fallback to the original method
      return await this._getUpcomingQueueOriginal(hass, entityId, limit);
    } catch (error) {
      console.error('yamp: Error getting upcoming queue:', error);
      this._massQueueAvailable = false;
      return {
        results: [],
        usedMusicAssistant: false
      };
    }
  }

  // Get recommendations using mass_queue integration
  async _getRecommendations(hass, entityId) {
    let mediaType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
    try {
      const hasMassQueue = await this._isMassQueueIntegrationAvailable(hass);
      this._hasMassQueueIntegration = hasMassQueue;
      this._massQueueAvailable = hasMassQueue;
      if (!hasMassQueue) {
        throw new Error('mass_queue integration unavailable');
      }
      const limitToUse = Math.max(limit || 0, this._getSearchResultsLimit());
      const message = {
        type: "call_service",
        domain: "mass_queue",
        service: "get_recommendations",
        service_data: {
          entity: entityId
        },
        return_response: true
      };
      const response = await hass.connection.sendMessagePromise(message);
      const payload = response === null || response === void 0 ? void 0 : response.response;
      let groups = [];
      if (Array.isArray(payload)) {
        groups = payload;
      } else if (payload && typeof payload === "object") {
        if (Array.isArray(payload[entityId])) {
          groups = payload[entityId];
        } else {
          const values = Object.values(payload);
          values.forEach(val => {
            if (Array.isArray(val)) {
              groups.push(...val);
            } else if (val && typeof val === "object") {
              groups.push(val);
            }
          });
        }
        if (groups.length === 0 && Array.isArray(payload.items)) {
          groups = payload.items;
        }
      }
      const normalizeMediaClass = value => {
        if (!value || typeof value !== "string") return "track";
        const type = value.toLowerCase();
        switch (type) {
          case "song":
          case "music":
            return "track";
          case "podcast_episode":
          case "episode":
            return "podcast";
          case "station":
            return "radio";
          case "directory":
          case "folder":
            return "playlist";
          default:
            return type;
        }
      };
      const formatLabel = value => {
        if (!value) return "";
        return value.toString().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, ch => ch.toUpperCase());
      };
      const requestedClass = mediaType && mediaType !== "all" ? normalizeMediaClass(mediaType) : null;
      const results = [];
      let collected = 0;
      const maxItems = limitToUse > 0 ? limitToUse : Infinity;
      for (const group of groups) {
        if (collected >= maxItems) break;
        const groupName = (group === null || group === void 0 ? void 0 : group.name) || (group === null || group === void 0 ? void 0 : group.sort_name) || "";
        const groupImage = typeof (group === null || group === void 0 ? void 0 : group.image) === "string" && group.image.trim() !== "" ? group.image : null;
        const groupItems = Array.isArray(group === null || group === void 0 ? void 0 : group.items) && group.items.length > 0 ? group.items : [group];
        for (const item of groupItems) {
          if (collected >= maxItems) break;
          const mediaContentId = (item === null || item === void 0 ? void 0 : item.uri) || (item === null || item === void 0 ? void 0 : item.item_id);
          if (!mediaContentId) continue;
          const itemImage = typeof (item === null || item === void 0 ? void 0 : item.image) === "string" && item.image.trim() !== "" ? item.image : null;
          const rawType = (item === null || item === void 0 ? void 0 : item.media_type) || (group === null || group === void 0 ? void 0 : group.media_type) || "music";
          const normalizedClass = normalizeMediaClass(rawType);
          if (requestedClass && normalizedClass !== requestedClass) {
            continue;
          }
          const typeLabel = formatLabel(rawType) || formatLabel(normalizedClass);
          const providerLabel = formatLabel((item === null || item === void 0 ? void 0 : item.provider) || (group === null || group === void 0 ? void 0 : group.provider));
          const subtitleParts = typeLabel ? [typeLabel] : [];
          if (groupName) {
            subtitleParts.push(groupName);
          } else if (providerLabel) {
            subtitleParts.push(providerLabel);
          }
          results.push({
            media_content_id: mediaContentId,
            media_content_type: rawType || normalizedClass,
            media_class: normalizedClass,
            title: (item === null || item === void 0 ? void 0 : item.name) || (item === null || item === void 0 ? void 0 : item.sort_name) || groupName || "Recommendation",
            artist: subtitleParts.join(" • "),
            thumbnail: itemImage || groupImage || null,
            provider: (item === null || item === void 0 ? void 0 : item.provider) || (group === null || group === void 0 ? void 0 : group.provider) || null
          });
          collected += 1;
        }
      }
      return {
        results,
        usedMusicAssistant: true,
        source: 'mass_queue'
      };
    } catch (error) {
      console.error('yamp: Error getting recommendations from mass_queue:', error);
      throw error;
    }
  }

  // Check if mass_queue integration is available and enabled
  async _isMassQueueIntegrationAvailable(hass) {
    if (this.config.disable_mass_queue === true) {
      return false;
    }
    try {
      // First check if the mass_queue domain is available in services
      const services = await hass.callWS({
        type: "get_services"
      });
      let hasServices = false;
      // Handle different response formats
      if (Array.isArray(services)) {
        hasServices = services.some(service => service.domain === "mass_queue");
      } else if (services && typeof services === 'object') {
        // Check if mass_queue exists as a key in the services object
        hasServices = services.hasOwnProperty("mass_queue") || Object.keys(services).some(key => key === "mass_queue");
      }
      if (!hasServices) {
        return false;
      }

      // If services are available, assume integration is working
      // The companion card works, so this should be sufficient
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get queue using mass_queue integration
  async _getUpcomingQueueWithMassQueue(hass, entityId) {
    let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    try {
      var _playerState$attribut, _response$response;
      // Get the currently playing track's media_content_id
      const playerState = hass.states[entityId];
      const currentTrackId = playerState === null || playerState === void 0 || (_playerState$attribut = playerState.attributes) === null || _playerState$attribut === void 0 ? void 0 : _playerState$attribut.media_content_id;

      // Use limit_before and limit_after like the companion card does
      // limit_before: 5 means get 5 items before the current track (to include current track)
      // limit_after: limit means get up to 'limit' upcoming items
      const message = {
        type: "call_service",
        domain: "mass_queue",
        service: "get_queue_items",
        service_data: {
          entity: entityId,
          limit_before: 5 // Get items before current track to include current track
        },
        return_response: true
      };
      const configLimit = this._getSearchResultsLimit();
      const normalizedLimit = Number.isFinite(limit) ? limit : configLimit;
      const limitAfter = Math.max(normalizedLimit || 0, configLimit || 0);
      if (limitAfter > 0) {
        message.service_data.limit_after = limitAfter; // Use config search_results_limit
      }
      const response = await hass.connection.sendMessagePromise(message);
      const queueItems = response === null || response === void 0 || (_response$response = response.response) === null || _response$response === void 0 ? void 0 : _response$response[entityId];
      if (!Array.isArray(queueItems)) {
        throw new Error('Invalid response from mass_queue');
      }

      // Find the currently playing track's index in the queue
      const currentTrackIndex = queueItems.findIndex(item => item.media_content_id === currentTrackId);

      // Get upcoming items (items after the current track)
      const upcomingItems = currentTrackIndex >= 0 ? queueItems.slice(currentTrackIndex + 1) : queueItems;

      // Process the upcoming items like the companion card does
      const itemsToRender = normalizedLimit > 0 ? upcomingItems.slice(0, normalizedLimit) : upcomingItems;
      const results = itemsToRender.map((item, index) => ({
        media_content_id: item.media_content_id || `queue_${index}`,
        media_content_type: 'track',
        media_class: 'track',
        title: item.media_title || 'Unknown Track',
        artist: item.media_artist || 'Unknown Artist',
        album: item.media_album_name || 'Unknown Album',
        thumbnail: item.media_image || null,
        duration: null,
        position: index + 1,
        queue_item_id: item.queue_item_id || null
      }));
      return {
        results,
        usedMusicAssistant: true,
        total: results.length,
        source: 'mass_queue'
      };
    } catch (error) {
      console.error('yamp: mass_queue service call failed:', error);
      throw error;
    }
  }

  // Queue reordering methods
  async _moveQueueItemUp(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState === null || maState === void 0 ? void 0 : maState.entity_id;
      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately (like companion card does)
      this._moveQueueItemInUI(queueItemId, 'up');

      // Then call the service
      await this.hass.callService("mass_queue", "move_queue_item_up", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }
  async _moveQueueItemDown(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState === null || maState === void 0 ? void 0 : maState.entity_id;
      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately
      this._moveQueueItemInUI(queueItemId, 'down');

      // Then call the service
      await this.hass.callService("mass_queue", "move_queue_item_down", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }
  async _moveQueueItemNext(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState === null || maState === void 0 ? void 0 : maState.entity_id;
      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately
      this._moveQueueItemInUI(queueItemId, 'next');

      // Then call the service
      await this.hass.callService("mass_queue", "move_queue_item_next", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }
  async _removeQueueItem(queueItemId) {
    try {
      // Get the Music Assistant entity for the current chip
      const maState = this._getMusicAssistantState();
      const maEntityId = maState === null || maState === void 0 ? void 0 : maState.entity_id;
      if (!maEntityId) {
        throw new Error('No Music Assistant entity found');
      }

      // Update UI immediately
      this._removeQueueItemFromUI(queueItemId);

      // Then call the service
      await this.hass.callService("mass_queue", "remove_queue_item", {
        entity: maEntityId,
        queue_item_id: queueItemId
      });
      this._invalidateUpcomingCache();
    } catch (error) {
      // Revert UI change on error
      this._refreshQueue();
    }
  }

  // Show queue error message
  _showQueueError(message) {
    // For now, just log the error. In the future, we could show a toast notification
    console.error('yamp: Queue operation failed:', message);
    // You could implement a toast notification here if desired
  }

  // Update queue items in UI immediately (like companion card does)
  _moveQueueItemInUI(queueItemId, direction) {
    const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
    const currentResults = this._searchResultsByType[cacheKey];
    if (!currentResults || !Array.isArray(currentResults.results)) {
      return;
    }
    const itemIndex = currentResults.results.findIndex(item => item.queue_item_id === queueItemId);
    if (itemIndex === -1) return;
    let newIndex;
    switch (direction) {
      case 'up':
        newIndex = Math.max(0, itemIndex - 1);
        break;
      case 'down':
        newIndex = Math.min(currentResults.results.length - 1, itemIndex + 1);
        break;
      case 'next':
        newIndex = 0; // Move to next position (first in upcoming queue)
        break;
      default:
        return;
    }

    // Get the item being moved
    currentResults.results[itemIndex];

    // Move item in array (like companion card's moveQueueItem)
    const movedItem = currentResults.results.splice(itemIndex, 1)[0];
    currentResults.results.splice(newIndex, 0, movedItem);

    // Update position numbers for visual feedback
    currentResults.results.forEach((item, index) => {
      item.position = index + 1;
    });

    // Add visual feedback - temporarily highlight the moved item
    movedItem._justMoved = true;
    setTimeout(() => {
      delete movedItem._justMoved;
      this.requestUpdate();
    }, 1000);

    // Trigger UI update
    this.requestUpdate();
  }

  // Remove queue item from UI immediately
  _removeQueueItemFromUI(queueItemId) {
    const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
    const currentResults = this._searchResultsByType[cacheKey];
    if (!currentResults || !Array.isArray(currentResults.results)) {
      return;
    }

    // Remove item from array
    currentResults.results = currentResults.results.filter(item => item.queue_item_id !== queueItemId);

    // Trigger UI update
    this.requestUpdate();
  }

  // Check if current entity is a Music Assistant entity
  _isMusicAssistantEntity() {
    var _maState$attributes5, _maState$attributes6, _this$_searchResultsB;
    // Get the Music Assistant state for the current chip
    const maState = this._getMusicAssistantState();
    if (!maState) return false;

    // Check if the Music Assistant entity has the right attributes
    const hasMassAttributes = isMusicAssistantEntity(maState) || ((_maState$attributes5 = maState.attributes) === null || _maState$attributes5 === void 0 ? void 0 : _maState$attributes5.mass_player_id) || ((_maState$attributes6 = maState.attributes) === null || _maState$attributes6 === void 0 ? void 0 : _maState$attributes6.active_queue) ||
    // If we're in upcoming mode and getting queue items, assume it's MA
    this._upcomingFilterActive && ((_this$_searchResultsB = this._searchResultsByType[`${this._searchMediaClassFilter || 'all'}_upcoming`]) === null || _this$_searchResultsB === void 0 || (_this$_searchResultsB = _this$_searchResultsB.results) === null || _this$_searchResultsB === void 0 ? void 0 : _this$_searchResultsB.some(item => item.queue_item_id));
    return hasMassAttributes;
  }
  _looksLikeMusicAssistantState(state) {
    var _state$attributes, _state$attributes2;
    if (!state) return false;
    return isMusicAssistantEntity(state) || !!((_state$attributes = state.attributes) !== null && _state$attributes !== void 0 && _state$attributes.mass_player_id) || !!((_state$attributes2 = state.attributes) !== null && _state$attributes2 !== void 0 && _state$attributes2.active_queue);
  }
  _getTransferQueueTargets() {
    var _this$hass7;
    if (!((_this$hass7 = this.hass) !== null && _this$hass7 !== void 0 && (_this$hass7 = _this$hass7.services) !== null && _this$hass7 !== void 0 && (_this$hass7 = _this$hass7.music_assistant) !== null && _this$hass7 !== void 0 && _this$hass7.transfer_queue)) return [];
    const currentIdx = this._selectedIndex;
    if (currentIdx === null || currentIdx === undefined || currentIdx < 0) return [];
    const sourceMaId = this._getActualResolvedMaEntityForState(currentIdx);
    if (!sourceMaId) return [];
    const seen = new Set([sourceMaId]);
    const targets = [];
    for (let idx = 0; idx < this.entityObjs.length; idx++) {
      var _this$hass8, _this$hass9, _mainState$attributes, _maState$attributes7, _displayState$attribu;
      const obj = this.entityObjs[idx];
      if (!obj) continue;
      const maEntityId = this._getActualResolvedMaEntityForState(idx);
      if (!maEntityId || seen.has(maEntityId)) continue;
      const maState = (_this$hass8 = this.hass) === null || _this$hass8 === void 0 || (_this$hass8 = _this$hass8.states) === null || _this$hass8 === void 0 ? void 0 : _this$hass8[maEntityId];
      const mainState = (_this$hass9 = this.hass) === null || _this$hass9 === void 0 || (_this$hass9 = _this$hass9.states) === null || _this$hass9 === void 0 ? void 0 : _this$hass9[obj.entity_id];
      if (!this._looksLikeMusicAssistantState(maState) && !this._looksLikeMusicAssistantState(mainState)) {
        continue;
      }
      seen.add(maEntityId);
      const displayState = maState || mainState;
      const configuredName = obj === null || obj === void 0 ? void 0 : obj.name;
      const displayName = configuredName || (mainState === null || mainState === void 0 || (_mainState$attributes = mainState.attributes) === null || _mainState$attributes === void 0 ? void 0 : _mainState$attributes.friendly_name) || (maState === null || maState === void 0 || (_maState$attributes7 = maState.attributes) === null || _maState$attributes7 === void 0 ? void 0 : _maState$attributes7.friendly_name) || obj.entity_id;
      targets.push({
        index: idx,
        entityId: obj.entity_id,
        maEntityId,
        name: displayName,
        subtitle: maEntityId !== obj.entity_id ? maEntityId : obj.entity_id,
        state: displayState === null || displayState === void 0 ? void 0 : displayState.state,
        icon: (displayState === null || displayState === void 0 || (_displayState$attribu = displayState.attributes) === null || _displayState$attribu === void 0 ? void 0 : _displayState$attribu.icon) || "mdi:music"
      });
    }
    return targets;
  }
  _hasQueueInState(maState) {
    var _this$_searchResultsB2;
    if (!maState) return false;
    const attrs = maState.attributes || {};
    const arrayKeys = ["queue_items", "queue", "media_queue", "mass_queue_items"];
    for (const key of arrayKeys) {
      const value = attrs[key];
      if (Array.isArray(value) && value.length > 0) return true;
    }
    const numericKeys = ["queue_length", "queue_size", "queue_total_items", "queue_pending", "queue_remaining", "items_in_queue"];
    for (const key of numericKeys) {
      const value = attrs[key];
      if (typeof value === "number" && value > 0) return true;
    }
    if (attrs.next_item || attrs.current_queue_item || attrs.queue_item_id) {
      return true;
    }
    if (attrs.media_content_id) {
      return true;
    }

    // Fall back to cached upcoming results if we've loaded them
    const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
    const cached = (_this$_searchResultsB2 = this._searchResultsByType) === null || _this$_searchResultsB2 === void 0 ? void 0 : _this$_searchResultsB2[cacheKey];
    if (cached && Array.isArray(cached.results) && cached.results.length > 0) {
      return true;
    }
    return false;
  }
  async _updateTransferQueueAvailability() {
    let {
      refresh = false
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const maState = this._getMusicAssistantState();
    const looksLikeMa = this._looksLikeMusicAssistantState(maState);
    if (!maState || !looksLikeMa) {
      if (this._hasTransferQueueForCurrent) {
        this._hasTransferQueueForCurrent = false;
        this.requestUpdate();
      }
      return false;
    }
    let hasQueue = this._hasQueueInState(maState);
    if (!hasQueue && refresh && this.hass) {
      const entityId = this._getActualResolvedMaEntityForState(this._selectedIndex);
      if (entityId) {
        try {
          var _maState$attributes8;
          const queueInfo = await this._getUpcomingQueue(this.hass, entityId, 2);
          if (Array.isArray(queueInfo === null || queueInfo === void 0 ? void 0 : queueInfo.results) && queueInfo.results.length > 0) {
            hasQueue = true;
          } else if (this._isEntityPlaying(maState) || maState.state === "paused" || (_maState$attributes8 = maState.attributes) !== null && _maState$attributes8 !== void 0 && _maState$attributes8.media_content_id) {
            hasQueue = true;
          }
        } catch (error) {
          // Ignore errors; fall back to heuristic result
        }
      }
    }
    if (this._hasTransferQueueForCurrent !== hasQueue) {
      this._hasTransferQueueForCurrent = hasQueue;
      this.requestUpdate();
    }
    return hasQueue;
  }
  _canShowTransferQueueOption() {
    if (!this._hasTransferQueueForCurrent) return false;
    return this._getTransferQueueTargets().length > 0;
  }
  _openTransferQueue() {
    this._showEntityOptions = true;
    this._showTransferQueue = true;
    this._showGrouping = false;
    this._showSourceList = false;
    this._showSearchInSheet = false;
    this._showResolvedEntities = false;
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }
    this.requestUpdate();
  }
  _closeTransferQueue() {
    this._showTransferQueue = false;
    this._transferQueuePendingTarget = null;
    this._transferQueueStatus = null;
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }
    this.requestUpdate();
  }
  async _transferQueueTo(target) {
    if (!target) return;
    const sourceMaId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    if (!sourceMaId) return;
    this._transferQueuePendingTarget = target.maEntityId;
    this._transferQueueStatus = null;
    this.requestUpdate();
    try {
      const payload = this._buildTransferQueuePayload(sourceMaId, target.maEntityId);
      await this.hass.callService("music_assistant", "transfer_queue", payload);
      this._transferQueueStatus = {
        type: "success",
        message: `Queue sent to ${target.name}.`
      };
      const targetIdx = typeof target.index === "number" ? target.index : this.entityIds.indexOf(target.entityId);
      if (targetIdx !== undefined && targetIdx !== null && targetIdx >= 0) {
        const pinnedIdx = this._pinnedIndex;
        if (pinnedIdx === null || pinnedIdx === targetIdx) {
          var _this$entityObjs$targ;
          this._selectedIndex = targetIdx;
          this._manualSelect = true;
          this._manualSelectPlayingSet = null;
          if (pinnedIdx === targetIdx) {
            this._pinnedIndex = targetIdx;
          }
          const lingerEntity = target.maEntityId || ((_this$entityObjs$targ = this.entityObjs[targetIdx]) === null || _this$entityObjs$targ === void 0 ? void 0 : _this$entityObjs$targ.entity_id);
          if (lingerEntity) {
            if (!this._playbackLingerByIdx) this._playbackLingerByIdx = {};
            this._playbackLingerByIdx[targetIdx] = {
              entityId: lingerEntity,
              until: Date.now() + 5000
            };
            if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
            this._lastPlayingEntityIdByChip[targetIdx] = lingerEntity;
          }
          this._ensureResolvedMaForIndex(targetIdx);
          this._ensureResolvedVolForIndex(targetIdx);
        }
      }
      await this._updateTransferQueueAvailability({
        refresh: true
      });
      if (this._transferQueueAutoCloseTimer) {
        clearTimeout(this._transferQueueAutoCloseTimer);
      }
      this._transferQueueAutoCloseTimer = setTimeout(() => {
        this._transferQueueAutoCloseTimer = null;
        if (this._showEntityOptions && this._showTransferQueue) {
          this._dismissWithAnimation();
        }
      }, 2000);
    } catch (error) {
      console.error("yamp: Error transferring queue:", error);
      this._transferQueueStatus = {
        type: "error",
        message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to transfer queue."
      };
      if (this._transferQueueAutoCloseTimer) {
        clearTimeout(this._transferQueueAutoCloseTimer);
        this._transferQueueAutoCloseTimer = null;
      }
    } finally {
      this._transferQueuePendingTarget = null;
      this.requestUpdate();
    }
  }
  _buildTransferQueuePayload(sourceId, targetId) {
    var _this$hass0;
    const serviceMeta = (_this$hass0 = this.hass) === null || _this$hass0 === void 0 || (_this$hass0 = _this$hass0.services) === null || _this$hass0 === void 0 || (_this$hass0 = _this$hass0.music_assistant) === null || _this$hass0 === void 0 ? void 0 : _this$hass0.transfer_queue;
    const fields = (serviceMeta === null || serviceMeta === void 0 ? void 0 : serviceMeta.fields) || {};
    const payload = {};
    const assignField = (candidateKeys, value) => {
      for (const key of candidateKeys) {
        if (fields[key] !== undefined) {
          payload[key] = value;
          return true;
        }
      }
      return false;
    };

    // Prefer explicit source fields, fall back to legacy names if metadata missing
    const sourceAssigned = assignField(["source_player", "source_player_id", "player_id", "source"], sourceId);
    const targetAssigned = assignField(["target_player", "target_player_id", "target", "entity_id"], targetId);
    if (!sourceAssigned) {
      // Avoid clobbering target assignment when metadata is missing
      const fallbackKey = targetAssigned ? "source_player" : "entity_id";
      payload[fallbackKey] = sourceId;
    }
    if (!targetAssigned) {
      // If entity_id already used for source, use a more specific key
      if (payload.entity_id === sourceId) {
        payload.entity_id = targetId;
        payload.source_player = sourceId;
      } else if (payload.source_player === sourceId) {
        payload.entity_id = targetId;
      } else {
        payload.entity_id = targetId;
      }
    }
    return payload;
  }

  // Refresh the queue display
  _refreshQueue() {
    if (this._upcomingFilterActive) {
      // Clear cache to force fresh fetch
      const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
      delete this._searchResultsByType[cacheKey];
      // Reload upcoming queue items
      this._doSearch('all', {
        isUpcoming: true
      }).catch(error => {
        console.error('yamp: Error refreshing queue:', error);
      });
    }
  }

  // Subscribe to queue update events (like companion card)
  async _subscribeToQueueUpdates() {
    if (this._queueEventSubscription) return; // Already subscribed

    try {
      this._queueEventSubscription = await this.hass.connection.subscribeEvents(event => {
        const eventData = event.data;
        if (eventData.type === "queue_updated") {
          // Refresh queue when it's updated
          this._refreshQueue();
        }
      }, "mass_queue");
    } catch (error) {
      console.error('yamp: Failed to subscribe to queue updates:', error);
    }
  }

  // Unsubscribe from queue update events
  _unsubscribeFromQueueUpdates() {
    if (this._queueEventSubscription) {
      this._queueEventSubscription();
      this._queueEventSubscription = null;
    }
  }

  // Original method for getting queue (fallback)
  async _getUpcomingQueueOriginal(hass, entityId) {
    try {
      var _response$response2;
      // Get the queue metadata first to get the queue_id
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_queue",
        service_data: {
          entity_id: entityId
        },
        return_response: true
      };
      const response = await hass.connection.sendMessagePromise(message);
      const queueData = response === null || response === void 0 || (_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2[entityId];
      if (!queueData) {
        return {
          results: [],
          usedMusicAssistant: true
        };
      }

      // Build results array from the queue data structure
      const results = [];
      if (!queueData) {
        return {
          results: [],
          usedMusicAssistant: true
        };
      }

      // Fallback to just the next item
      if (queueData.next_item) {
        var _item$media_item, _item$media_item2, _item$media_item3, _item$media_item4, _item$media_item5, _item$media_item6;
        const item = queueData.next_item;
        results.push({
          media_content_id: ((_item$media_item = item.media_item) === null || _item$media_item === void 0 ? void 0 : _item$media_item.uri) || `queue_next`,
          media_content_type: ((_item$media_item2 = item.media_item) === null || _item$media_item2 === void 0 ? void 0 : _item$media_item2.media_type) || 'track',
          media_class: 'track',
          title: item.name || ((_item$media_item3 = item.media_item) === null || _item$media_item3 === void 0 ? void 0 : _item$media_item3.name) || 'Unknown Track',
          artist: ((_item$media_item4 = item.media_item) === null || _item$media_item4 === void 0 || (_item$media_item4 = _item$media_item4.artists) === null || _item$media_item4 === void 0 || (_item$media_item4 = _item$media_item4[0]) === null || _item$media_item4 === void 0 ? void 0 : _item$media_item4.name) || 'Unknown Artist',
          album: ((_item$media_item5 = item.media_item) === null || _item$media_item5 === void 0 || (_item$media_item5 = _item$media_item5.album) === null || _item$media_item5 === void 0 ? void 0 : _item$media_item5.name) || 'Unknown Album',
          thumbnail: ((_item$media_item6 = item.media_item) === null || _item$media_item6 === void 0 ? void 0 : _item$media_item6.image) || null,
          duration: item.duration || null,
          position: 1,
          // Next item
          queue_item_id: item.queue_item_id || null
        });
      }
      return {
        results,
        usedMusicAssistant: true,
        total: results.length,
        source: 'music_assistant'
      };
    } catch (error) {
      console.error('yamp: Error in original queue method:', error);
      throw error;
    }
  }

  // Apply favorites filter to current results (called when switching filter chips)
  async _applyFavoritesFilterIfActive() {
    if (!this._favoritesFilterActive) return;
    const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
    const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
    try {
      const favoritesResponse = await getFavorites(this.hass, searchEntityId, this._searchMediaClassFilter, this._getSearchResultsLimit());
      const favorites = favoritesResponse.results || [];

      // Create a set of favorite URIs for quick lookup
      const favoriteUris = new Set(favorites.map(fav => fav.media_content_id));

      // Filter current results to only show favorites
      const currentResults = this._searchResults || [];
      this._searchResults = this._sortSearchResults(currentResults.filter(item => favoriteUris.has(item.media_content_id)));
    } catch (error) {
      // If favorites loading fails, just show current results
    }
  }

  // Handle clicks on search result titles
  async _handleSearchResultClick(item, event) {
    if (!this._isClickableSearchResult(item)) return;

    // If this is a touch device and we have a touch event, ignore the click
    // (touch events are handled by _handleSearchResultTouch)
    if ('ontouchstart' in window && event && event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) {
      return;
    }
    if (item.media_class === 'artist') {
      await this._searchArtistAlbums(item.title);
    } else if (item.media_class === 'album') {
      // Get artist name from hierarchy if we're viewing artist albums, or from item metadata if available
      let artistName = null;
      if (this._searchHierarchy.length > 0 && this._searchHierarchy[this._searchHierarchy.length - 1].type === 'artist') {
        artistName = this._searchHierarchy[this._searchHierarchy.length - 1].name;
      } else if (item.artist) {
        artistName = item.artist;
      }
      await this._searchAlbumTracks(item.title, artistName, item.media_content_id);
    }
  }

  // Handle hierarchical search - search for tracks by album
  async _searchAlbumTracks(albumName, artistName) {
    let albumUri = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    this._searchHierarchy.push({
      type: 'album',
      name: albumName,
      query: this._searchQuery,
      uri: albumUri
    });
    this._searchBreadcrumb = `Tracks from ${albumName}`;
    this._searchResultsByType = {}; // Clear cache for new search
    this._currentSearchQuery = albumName;
    this._searchMediaClassFilter = 'track';

    // Immediate loading state
    this._searchResults = [];
    this._searchLoading = true;
    this.requestUpdate();

    // Priority 1: Use mass_queue integration if available (preferred for Music Assistant)
    try {
      const hasMassQueue = await this._isMassQueueIntegrationAvailable(this.hass);
      if (hasMassQueue) {
        const configEntryId = await getMassQueueConfigEntryId(this.hass);
        let tracks = [];

        // Strategy A: User provided syntax (config_entry_id)
        if (configEntryId && albumUri) {
          try {
            var _responseData$respons;
            const message = {
              type: "call_service",
              domain: "mass_queue",
              service: "get_album_tracks",
              service_data: {
                config_entry_id: configEntryId,
                uri: albumUri
              },
              return_response: true
            };
            const responseData = await this.hass.connection.sendMessagePromise(message);
            if (responseData !== null && responseData !== void 0 && (_responseData$respons = responseData.response) !== null && _responseData$respons !== void 0 && _responseData$respons.tracks) {
              tracks = responseData.response.tracks;
            }
          } catch (firstError) {
            console.warn("yamp: mass_queue.get_album_tracks failed with config_entry_id, trying fallback with entity_id", firstError);

            // Strategy B: Fallback using entity (like get_queue_items)
            const maState = this._getMusicAssistantState();
            const maEntityId = maState === null || maState === void 0 ? void 0 : maState.entity_id;
            if (maEntityId) {
              var _responseDataFallback;
              const messageFallback = {
                type: "call_service",
                domain: "mass_queue",
                service: "get_album_tracks",
                service_data: {
                  entity: maEntityId,
                  uri: albumUri
                },
                return_response: true
              };
              const responseDataFallback = await this.hass.connection.sendMessagePromise(messageFallback);
              if (responseDataFallback !== null && responseDataFallback !== void 0 && (_responseDataFallback = responseDataFallback.response) !== null && _responseDataFallback !== void 0 && _responseDataFallback.tracks) {
                tracks = responseDataFallback.response.tracks;
              }
            } else {
              throw firstError;
            }
          }
        }
        if (tracks.length > 0) {
          this._searchResults = tracks.map(track => ({
            media_content_id: track.media_content_id,
            media_content_type: 'track',
            media_class: 'track',
            title: track.media_title,
            artist: track.media_artist,
            album: track.media_album_name,
            thumbnail: track.media_image,
            duration: track.duration,
            is_browsable: false,
            favorite: track.favorite
          }));
          this._searchQuery = albumName;
          this._searchTotalRows = Math.max(15, tracks.length);
          this._searchLoading = false;
          this.requestUpdate();
          return;
        }
      }
    } catch (e) {
      console.error("yamp: Error fetching album tracks via mass_queue:", e);
      // Fallback to other methods
    }

    // Priority 2: Use browse_media (fallback for non-mass_queue MA or other integration)
    if (albumUri && this._isMusicAssistantEntity()) {
      try {
        var _browseRes$response;
        const searchEntityIdTemplate = this._getSearchEntityId(this._selectedIndex);
        const searchEntityId = await this._resolveTemplateAtActionTime(searchEntityIdTemplate, this.currentEntityId);
        const browseMsg = {
          type: "call_service",
          domain: "media_player",
          service: "browse_media",
          service_data: {
            entity_id: searchEntityId,
            media_content_id: albumUri
          },
          return_response: true
        };
        const browseRes = await this.hass.connection.sendMessagePromise(browseMsg);
        const browseResult = (browseRes === null || browseRes === void 0 || (_browseRes$response = browseRes.response) === null || _browseRes$response === void 0 || (_browseRes$response = _browseRes$response[searchEntityId]) === null || _browseRes$response === void 0 ? void 0 : _browseRes$response.result) || (browseRes === null || browseRes === void 0 ? void 0 : browseRes.result) || {};
        const tracks = browseResult.children || [];
        if (tracks.length > 0) {
          this._searchQuery = albumName;
          this._searchResults = this._sortSearchResults(tracks);
          this._searchTotalRows = Math.max(15, tracks.length);
          this._searchLoading = false;
          this.requestUpdate();
          return;
        }
      } catch (e) {
        console.error("yamp: Failed to browse album tracks:", e);
      }
    }

    // Fallback to search-based navigation
    let searchQuery = albumName;
    if (artistName) {
      searchQuery = `${artistName} ${albumName}`;
    }
    this._searchQuery = searchQuery;

    // Clear filter states to ensure accurate album search results
    this._favoritesFilterActive = false;
    this._recentlyPlayedFilterActive = false;
    this._initialFavoritesLoaded = false;

    // Pass artist and album as search parameters for more precise results
    const searchParams = {
      album: albumName,
      clearFilters: true
    };
    if (artistName) {
      searchParams.artist = artistName;
    }

    // Remove swipe handlers when entering hierarchy
    this._removeSearchSwipeHandlers();

    // Use Music Assistant search with specific parameters for tracks
    await this._doSearch('track', searchParams);
  }

  // Notify Home Assistant to recalculate layout
  _notifyResize() {
    this.dispatchEvent(new Event("iron-resize", {
      bubbles: true,
      composed: true
    }));
  }
  _setupAdaptiveTextObserver() {
    if (!this._adaptiveText || this._textResizeObserver || typeof ResizeObserver === "undefined" || !this.isConnected) {
      return;
    }
    this._textResizeObserver = new ResizeObserver(() => this._updateAdaptiveTextScale());
    this._textResizeObserver.observe(this);
    this._updateAdaptiveTextScale();
  }
  _teardownAdaptiveTextObserver() {
    if (this._textResizeObserver) {
      this._textResizeObserver.disconnect();
      this._textResizeObserver = null;
    }
    this._currentTextScale = null;
    this._setAdaptiveTextVars(1, new Set());
  }
  _setAdaptiveTextVars(scale, overrideTargets, detailsScale) {
    if (!this.style) return;
    const targetSet = overrideTargets || this._adaptiveTextTargets;
    const safeScale = Number.isFinite(scale) ? scale : 1;
    const scaleString = safeScale.toFixed(2);
    this.style.setProperty("--yamp-text-scale", scaleString);
    for (const [target, varName] of Object.entries(ADAPTIVE_TEXT_VAR_MAP)) {
      const isActive = !!(targetSet !== null && targetSet !== void 0 && targetSet.has(target));
      this.style.setProperty(varName, isActive ? scaleString : "1");
    }
    const detailActive = !!(targetSet !== null && targetSet !== void 0 && targetSet.has("details"));
    const safeDetailsScale = Number.isFinite(detailsScale) ? detailsScale : safeScale;
    const detailScaleString = detailActive ? safeDetailsScale.toFixed(2) : "1";
    const detailLineHeight = detailActive ? this._calculateDetailsLineHeight(safeDetailsScale) : 1.2;
    this.style.setProperty("--yamp-details-scale", detailScaleString);
    this.style.setProperty("--yamp-details-line-height", detailLineHeight.toFixed(2));
    const detailMaxLines = detailActive ? safeDetailsScale >= 2 ? 3 : safeDetailsScale >= 1.3 ? 2 : 1 : 3;
    this.style.setProperty("--yamp-details-max-lines", detailMaxLines.toString());
  }
  _updateAdaptiveTextObserverState() {
    if (this._adaptiveText && this.isConnected) {
      this._setupAdaptiveTextObserver();
    } else {
      this._teardownAdaptiveTextObserver();
    }
  }
  _handleGlobalScroll() {
    if (!this._adaptiveText) return;
    this._suspendAdaptiveScaling = true;
    this._pendingAdaptiveScaleUpdate = true;
    clearTimeout(this._adaptiveScrollTimer);
    this._adaptiveScrollTimer = setTimeout(() => {
      this._suspendAdaptiveScaling = false;
      if (this._pendingAdaptiveScaleUpdate) {
        this._pendingAdaptiveScaleUpdate = false;
        this._updateAdaptiveTextScale(true);
      }
    }, 400);
  }
  _handleViewportResize() {
    this._updateViewportFlags();
  }
  _updateViewportFlags() {
    var _document$documentEle;
    if (typeof window === "undefined") return;
    const docWidth = typeof document !== "undefined" ? (_document$documentEle = document.documentElement) === null || _document$documentEle === void 0 ? void 0 : _document$documentEle.clientWidth : 0;
    const viewportWidth = window.innerWidth || docWidth || 0;
    const isNarrow = viewportWidth > 0 ? viewportWidth <= 520 : this._isNarrowViewport;
    if (isNarrow !== this._isNarrowViewport) {
      this._isNarrowViewport = isNarrow;
      this.requestUpdate();
    }
  }
  _updateAdaptiveTextScale() {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!this._adaptiveText) return;
    if (this._suspendAdaptiveScaling && !force) {
      this._pendingAdaptiveScaleUpdate = true;
      return;
    }
    const rect = this.getBoundingClientRect();
    const width = (rect === null || rect === void 0 ? void 0 : rect.width) || 0;
    if (!width) return;
    const baselineHeight = this._getAdaptiveBaselineHeight(this._lastRenderedCollapsed || false);
    const height = baselineHeight || (rect === null || rect === void 0 ? void 0 : rect.height) || width;
    const widthFactor = width / 360;
    const heightFactor = height / 360;
    const blended = widthFactor * 0.8 + heightFactor * 0.2;
    const scale = Math.max(0.85, Math.min(1.4, blended));
    const detailScale = this._calculateDetailsScale(width, height, scale, this._lastTitleLength || 0);
    const textScaleChanged = this._currentTextScale === null || Math.abs(this._currentTextScale - scale) > 0.01;
    const detailScaleChanged = this._currentDetailsScale === null || Math.abs(this._currentDetailsScale - detailScale) > 0.02;
    if (textScaleChanged || detailScaleChanged) {
      this._currentTextScale = scale;
      this._currentDetailsScale = detailScale;
      this._setAdaptiveTextVars(scale, undefined, detailScale);
    }
  }
  _calculateDetailsScale(width, height) {
    let fallbackScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    const targetSet = this._adaptiveTextTargets;
    if (!(targetSet !== null && targetSet !== void 0 && targetSet.has("details"))) return 1;
    const widthFactor = Math.min(Math.max(1, width / 360), 3.2);
    const heightFactor = Math.max(1, Math.min(height / 330, 2.4));
    const dominant = Math.max(widthFactor * 0.7 + heightFactor * 0.3, heightFactor);
    const maxScale = Math.min(3.25, 1 + (heightFactor - 1) * 1.35);
    const requested = Math.max(fallbackScale, dominant * 1.18);
    const baseScale = Math.max(1, Math.min(requested, maxScale));
    const titleLength = this._lastTitleLength || 0;
    const lengthClamp = titleLength > 0 ? Math.max(0.62, Math.min(1, 30 / Math.min(titleLength, 72))) : 1;
    return 1 + (baseScale - 1) * lengthClamp;
  }
  _calculateDetailsLineHeight(scale) {
    const clampedScale = Math.max(1, Math.min(scale, 2.6));
    const extra = Math.max(0, clampedScale - 1);
    // Allow line-height to rise gently from 1.2 to 1.55
    return Math.min(1.55, 1.2 + extra * 0.35);
  }
  _getAdaptiveBaselineHeight() {
    var _this$config4;
    let collapsed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const raw = (_this$config4 = this.config) === null || _this$config4 === void 0 ? void 0 : _this$config4.card_height;
    if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
      return raw;
    }
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed) {
        const parsed = Number(trimmed);
        if (Number.isFinite(parsed) && parsed > 0) {
          return parsed;
        }
      }
    }
    if (collapsed || this._alwaysCollapsed) {
      return this._collapsedBaselineHeight || 220;
    }
    return 350;
  }
  async _resolveIdleImageTemplate() {
    if (!this._idleImageTemplate || this._resolvingIdleImageTemplate || !this.hass) return;
    this._resolvingIdleImageTemplate = true;
    try {
      const result = await this.hass.callApi('POST', 'template', {
        template: this._idleImageTemplate
      });
      this._idleImageTemplateResult = (result ?? "").toString().trim();
    } catch (error) {
      this._idleImageTemplateResult = "";
    } finally {
      this._resolvingIdleImageTemplate = false;
      this._idleImageTemplateNeedsResolve = false;
      this.requestUpdate();
    }
  }
  _ensureArtworkOverrideIndexMap() {
    var _this$config5;
    if (this._artworkOverrideIndexMap) return;
    this._artworkOverrideIndexMap = new WeakMap();
    const overrides = Array.isArray((_this$config5 = this.config) === null || _this$config5 === void 0 ? void 0 : _this$config5.media_artwork_overrides) ? this.config.media_artwork_overrides : [];
    overrides.forEach((item, idx) => {
      if (item && typeof item === "object") {
        this._artworkOverrideIndexMap.set(item, idx);
      }
    });
  }
  _getArtworkOverrideCacheKey(override) {
    var _stateObj$attributes8, _stateObj$attributes9, _this$_artworkOverrid;
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "image";
    let stateObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    this._ensureArtworkOverrideIndexMap();

    // Include media title and artist in the key if available to ensure
    // templates are re-evaluated when the track changes.
    const mediaTitle = (stateObj === null || stateObj === void 0 || (_stateObj$attributes8 = stateObj.attributes) === null || _stateObj$attributes8 === void 0 ? void 0 : _stateObj$attributes8.media_title) || "";
    const mediaArtist = (stateObj === null || stateObj === void 0 || (_stateObj$attributes9 = stateObj.attributes) === null || _stateObj$attributes9 === void 0 ? void 0 : _stateObj$attributes9.media_artist) || "";
    const stateKey = `${mediaTitle}:${mediaArtist}`;
    const idx = override && ((_this$_artworkOverrid = this._artworkOverrideIndexMap) === null || _this$_artworkOverrid === void 0 ? void 0 : _this$_artworkOverrid.get(override));
    const prefix = typeof idx === "number" ? idx : "generic";
    return `${prefix}:${type}:${stateKey}`;
  }
  _getResolvedArtworkOverrideSource(override, sourceValue) {
    let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "image";
    let stateObj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    if (!sourceValue || typeof sourceValue !== "string") return null;
    const normalizedInput = this._normalizeImageSourceValue(sourceValue);
    if (!normalizedInput) return null;
    const isTemplate = sourceValue.includes("{{") || sourceValue.includes("{%");
    if (!isTemplate) return normalizedInput;
    if (!this._artworkOverrideTemplateCache) {
      this._artworkOverrideTemplateCache = {};
    }
    const key = this._getArtworkOverrideCacheKey(override, type, stateObj);
    if (!this._artworkOverrideTemplateCache[key]) {
      this._artworkOverrideTemplateCache[key] = {
        value: null,
        resolving: false
      };
    }
    const entry = this._artworkOverrideTemplateCache[key];
    if (entry.value) return entry.value;
    if (!entry.resolving && this.hass) {
      entry.resolving = true;
      this.hass.callApi('POST', 'template', {
        template: sourceValue
      }).then(res => {
        entry.value = this._normalizeImageSourceValue((res ?? "").toString());
      }).catch(() => {
        entry.value = "";
      }).finally(() => {
        entry.resolving = false;
        this.requestUpdate();
      });
    }
    return entry.value;
  }

  // Get style for collapsed artwork based on mobile and control count
  _getCollapsedArtworkStyle() {
    if (this._alwaysCollapsed) {
      const showFavorite = !!this._getFavoriteButtonEntity() && !this._getHiddenControlsForCurrentEntity().favorite;
      const controls = countMainControls(this.currentActivePlaybackStateObj, (s, f) => this._supportsFeature(s, f), showFavorite, this._getHiddenControlsForCurrentEntity(), true, this._controlLayout);
      if (controls > 6) {
        // Check if we're on a mobile screen (width <= 768px is typical mobile breakpoint)
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          // Make artwork smaller on mobile when there are many controls
          return "width: 60px; height: 60px; object-fit: var(--yamp-artwork-fit, cover); border-radius: 8px;";
        }
      }
    }
    return ""; // Default style (no additional styling)
  }

  // Get artwork URL from entity state, supporting entity_picture_local for Music Assistant
  _getArtworkUrl(state) {
    var _this$config6, _this$config7;
    if (!state || !state.attributes) return null;
    const attrs = state.attributes;
    const entityId = state.entity_id;
    attrs.app_id;
    const prefix = ((_this$config6 = this.config) === null || _this$config6 === void 0 ? void 0 : _this$config6.artwork_hostname) || '';
    let artworkUrl = null;
    let sizePercentage = null;
    let objectFit = null;

    // Check for media artwork overrides first
    const overrides = Array.isArray((_this$config7 = this.config) === null || _this$config7 === void 0 ? void 0 : _this$config7.media_artwork_overrides) ? this.config.media_artwork_overrides : null;
    if (overrides && overrides.length) {
      var _override, _override2;
      const findSpecificMatch = () => overrides.find(override => ARTWORK_OVERRIDE_MATCH_KEYS.some(key => {
        var _override$__cachedReg;
        const expected = override[key];
        if (expected === undefined) return false;
        const value = key === "entity_id" ? entityId : key === "entity_state" ? state === null || state === void 0 ? void 0 : state.state : attrs[key];
        if (expected === "*") return true;
        if ((_override$__cachedReg = override.__cachedRegexes) !== null && _override$__cachedReg !== void 0 && _override$__cachedReg[key]) {
          return override.__cachedRegexes[key].test(String(value || ""));
        }
        return value === expected;
      }));

      // Use helper to properly check for valid artwork attributes
      const hasExistingArtwork = getValidArtworkAttr(attrs, 'entity_picture_local') || getValidArtworkAttr(attrs, 'entity_picture') || getValidArtworkAttr(attrs, 'album_art');
      let override = findSpecificMatch();
      let overrideSource = null;
      let overrideType = "image";
      if ((_override = override) !== null && _override !== void 0 && _override.image_url) {
        overrideSource = override.image_url;
      } else if ((_override2 = override) !== null && _override2 !== void 0 && _override2.missing_art_url && !hasExistingArtwork) {
        overrideSource = override.missing_art_url;
        overrideType = "missing";
      }
      if (!override && !hasExistingArtwork) {
        const missingOverride = overrides.find(item => item === null || item === void 0 ? void 0 : item.missing_art_url);
        if (missingOverride !== null && missingOverride !== void 0 && missingOverride.missing_art_url) {
          override = missingOverride;
          overrideSource = missingOverride.missing_art_url;
          overrideType = "missing";
        }
      }
      if (override && overrideSource) {
        const resolvedOverride = this._getResolvedArtworkOverrideSource(override, overrideSource, overrideType, state);
        if (resolvedOverride) {
          var _override3, _override4;
          artworkUrl = resolvedOverride;
          sizePercentage = (_override3 = override) === null || _override3 === void 0 ? void 0 : _override3.size_percentage;
          objectFit = ((_override4 = override) === null || _override4 === void 0 ? void 0 : _override4.object_fit) ?? null;
        }
      }
    }

    // If no override found, use standard artwork
    // Use helper to properly check for valid artwork attributes and fallback correctly
    if (!artworkUrl) {
      artworkUrl = getValidArtworkAttr(attrs, 'entity_picture_local') || getValidArtworkAttr(attrs, 'entity_picture') || getValidArtworkAttr(attrs, 'album_art') || null;
    }

    // If still no artwork, check for configured fallback artwork
    if (!artworkUrl) {
      var _this$config8;
      const fallbackArtwork = (_this$config8 = this.config) === null || _this$config8 === void 0 ? void 0 : _this$config8.fallback_artwork;
      if (fallbackArtwork) {
        // Check if it's a smart fallback (TV vs Music)
        if (fallbackArtwork === 'smart') {
          // Use TV icon for TV content, music icon for everything else
          const isTV = attrs.media_title === 'TV' || attrs.media_channel || attrs.app_id === 'tv' || attrs.app_id === 'androidtv';
          if (isTV) {
            // TV icon
            artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvcj4KPHJlY3QgeD0iNjgiIHk9IjEyMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHJlY3QgeD0iODAiIHk9IjEzMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==';
          } else {
            // Music icon (equalizer bars)
            artworkUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=';
          }
        } else if (typeof fallbackArtwork === 'string') {
          // Direct URL or base64 image
          artworkUrl = fallbackArtwork;
        }
        if (artworkUrl) {
          objectFit = this._artworkObjectFit;
        }
      }
    }

    // Apply hostname prefix if configured and artwork URL is relative
    if (artworkUrl && prefix && !artworkUrl.startsWith('http') && !artworkUrl.startsWith('data:')) {
      // Ensure prefix doesn't result in double slashes if artworkUrl starts with /
      const cleanPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
      const cleanUrl = artworkUrl.startsWith('/') ? artworkUrl : `/${artworkUrl}`;
      artworkUrl = cleanPrefix + cleanUrl;
    }

    // Validate artwork URL to prevent proxy errors
    if (artworkUrl && !this._isValidArtworkUrl(artworkUrl)) {
      artworkUrl = null;
    }
    if (!objectFit) {
      objectFit = this._artworkObjectFit;
    }
    return {
      url: artworkUrl,
      sizePercentage,
      objectFit
    };
  }
  _getBackgroundSizeForFit(fit) {
    switch (fit) {
      case "contain":
        return "contain";
      case "fill":
        return "100% 100%";
      case "scale-down":
        return "contain";
      case "none":
        return "auto";
      case "scaled-contain":
        return "80%";
      case "cover":
      default:
        return "cover";
    }
  }

  // Validate artwork URL to prevent proxy errors
  _isValidArtworkUrl(url) {
    if (!url || typeof url !== 'string') return false;

    // Skip validation for data URLs and base64 images
    if (url.startsWith('data:')) return true;

    // Skip validation for localhost and relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return true;

    // Check for obviously invalid URLs
    if (url.includes('undefined') || url.includes('null') || url.trim() === '') return false;

    // Check for valid URL format
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
  _normalizeAdaptiveTextTargets(config) {
    if (Array.isArray(config === null || config === void 0 ? void 0 : config.adaptive_text_targets)) {
      return config.adaptive_text_targets.map(item => typeof item === "string" ? item.trim().toLowerCase() : "").filter(item => ADAPTIVE_TEXT_TARGETS.includes(item));
    }
    if ((config === null || config === void 0 ? void 0 : config.adaptive_text) === true) {
      return [...DEFAULT_ADAPTIVE_TEXT_TARGETS];
    }
    return [];
  }
  _normalizeImageSourceValue(value) {
    if (!value || typeof value !== "string") return "";
    let trimmed = value.trim();
    if (!trimmed) return "";
    const quoted = trimmed.startsWith("'") && trimmed.endsWith("'") || trimmed.startsWith('"') && trimmed.endsWith('"');
    if (quoted && trimmed.length >= 2) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    const urlMatch = trimmed.match(/^url\((.*)\)$/i);
    if (urlMatch && urlMatch[1] !== undefined) {
      let inner = urlMatch[1].trim();
      if (inner.startsWith("'") && inner.endsWith("'") || inner.startsWith('"') && inner.endsWith('"')) {
        inner = inner.slice(1, -1).trim();
      }
      return inner;
    }
    return trimmed;
  }
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = {
      ...config
    };
    const layoutPref = typeof config.control_layout === "string" ? config.control_layout.toLowerCase() : "classic";
    this._controlLayout = layoutPref === "modern" ? "modern" : "classic";
    this._swapPauseForStop = config.swap_pause_for_stop === true;
    this._holdToPin = !!config.hold_to_pin;
    this._disableSearchAutofocus = config.disable_autofocus === true;
    if (this._holdToPin) {
      this._holdHandler = createHoldToPinHandler({
        onPin: idx => this._pinChip(idx),
        holdTime: 650,
        moveThreshold: 8
      });
    }
    const newSelectedIndex = this._selectedIndex || 0;
    this._selectedIndex = newSelectedIndex < this.entityIds.length ? newSelectedIndex : 0;
    this._lastPlaying = null;
    this._lastActiveEntityId = null;
    // Set accent color

    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    const allowedFits = new Set(["cover", "contain", "fill", "scale-down", "none", "scaled-contain"]);
    this._artworkObjectFit = allowedFits.has(config.artwork_object_fit) ? config.artwork_object_fit : "cover";
    this._extendArtwork = config.extend_artwork === true;
    this._idleScreen = config.idle_screen || "default";
    this._idleScreenApplied = false;
    this._hasSeenPlayback = false;
    if (this._isIdle) {
      this._applyIdleScreen();
    }
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      this.shadowRoot.host.setAttribute("data-always-collapsed", String(this.config.always_collapsed === true));
      const forceHideMenuPlayer = this.config.always_collapsed === true && this.config.pin_search_headers === true && this.config.expand_on_search === true;
      this.shadowRoot.host.setAttribute("data-hide-menu-player", String(this.config.hide_menu_player === true || forceHideMenuPlayer));
      this.shadowRoot.host.setAttribute("data-extend-artwork", String(this._extendArtwork));
    }
    // Collapse card when idle
    this._collapseOnIdle = !!config.collapse_on_idle;
    // Force always-collapsed view
    this._alwaysCollapsed = !!config.always_collapsed;
    // Expand on search option (only available when always_collapsed is true)
    this._expandOnSearch = !!config.expand_on_search;
    // Alternate progress‑bar mode
    this._alternateProgressBar = !!config.alternate_progress_bar;
    // Display timestamps on progress bar
    this._displayTimestamps = !!config.display_timestamps;
    // Keep search filters on submit
    this._keepFiltersOnSearch = !!config.keep_filters_on_search;
    // Allow main controls to grow with available space
    this._adaptiveControls = config.adaptive_controls === true;
    // Allow typography to scale with available space
    const adaptiveTextTargets = this._normalizeAdaptiveTextTargets(config);
    this._adaptiveTextTargets = new Set(adaptiveTextTargets);
    this._adaptiveText = this._adaptiveTextTargets.size > 0;
    this._currentDetailsScale = null;
    this._updateAdaptiveTextObserverState();
    if (this._adaptiveText) {
      const initialScale = this._currentTextScale ?? 1;
      const initialDetailsScale = this._currentDetailsScale ?? 1;
      this._setAdaptiveTextVars(initialScale, undefined, initialDetailsScale);
      this._updateAdaptiveTextScale();
    } else {
      this._setAdaptiveTextVars(1, new Set(), 1);
    }
    this._hideActiveEntityLabel = config.hide_active_entity_label === true;
    this._artworkOverrideTemplateCache = {};
    this._artworkOverrideIndexMap = null;

    // Pre-compile wildcard regexes for artwork overrides
    if (Array.isArray(config.media_artwork_overrides)) {
      // Create a copy of the overrides array and objects to avoid "not extensible" errors
      // with Home Assistant's frozen config objects.
      this.config.media_artwork_overrides = config.media_artwork_overrides.map(o => ({
        ...o
      }));
      this.config.media_artwork_overrides.forEach(override => {
        if (!override || typeof override !== "object") return;
        override.__cachedRegexes = {};
        ARTWORK_OVERRIDE_MATCH_KEYS.forEach(key => {
          const pattern = override[key];
          if (typeof pattern === "string" && pattern.includes("*") && pattern !== "*") {
            try {
              const regexPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*");
              override.__cachedRegexes[key] = new RegExp(`^${regexPattern}$`, "i");
            } catch (e) {
              console.warn("yamp: Failed to compile artwork override regex for", key, pattern);
            }
          }
        });
      });
    }
    // Handle idle image templates
    if (typeof config.idle_image === "string" && (config.idle_image.includes("{{") || config.idle_image.includes("{%"))) {
      this._idleImageTemplate = config.idle_image;
      this._idleImageTemplateResult = "";
      this._idleImageTemplateNeedsResolve = true;
    } else {
      this._idleImageTemplate = null;
      this._idleImageTemplateResult = "";
      this._idleImageTemplateNeedsResolve = false;
    }
    // Set idle timeout ms
    this._idleTimeoutMs = typeof config.idle_timeout_ms === "number" ? config.idle_timeout_ms : 60000;
    if (this._idleTimeoutMs === 0) {
      if (this._idleTimeout) {
        clearTimeout(this._idleTimeout);
        this._idleTimeout = null;
      }
      if (this._isIdle) {
        this._isIdle = false;
        this._resetIdleScreen();
        this.requestUpdate();
      }
    }
    this._volumeStep = typeof config.volume_step === "number" ? config.volume_step : 0.05;
  }

  // Returns array of entity config objects, including group_volume if present in user config.
  get entityObjs() {
    return this.config.entities.map((e, index) => {
      const entity_id = typeof e === "string" ? e : e.entity_id;
      const name = typeof e === "string" ? "" : e.name || "";
      const volume_entity = typeof e === "string" ? undefined : e.volume_entity;
      const music_assistant_entity = typeof e === "string" ? undefined : e.music_assistant_entity;
      const sync_power = typeof e === "string" ? false : !!e.sync_power;
      const follow_active_volume = typeof e === "string" ? false : !!e.follow_active_volume;
      const hidden_controls = typeof e === "string" ? undefined : e.hidden_controls;
      let group_volume;
      if (typeof e === "object" && typeof e.group_volume !== "undefined") {
        group_volume = e.group_volume;
      } else {
        var _this$hass1;
        // Determine group_volume default
        const state = (_this$hass1 = this.hass) === null || _this$hass1 === void 0 || (_this$hass1 = _this$hass1.states) === null || _this$hass1 === void 0 ? void 0 : _this$hass1[entity_id];
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
        music_assistant_entity,
        sync_power,
        follow_active_volume,
        hidden_controls,
        hidden_filter_chips: typeof e === "string" ? undefined : e.hidden_filter_chips,
        disable_auto_select: this._isAutoSelectDisabled(index),
        ...(typeof group_volume !== "undefined" ? {
          group_volume
        } : {})
      };
    });
  }

  // Unified entity resolution system
  _getEntityForPurpose(idx, purpose) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    switch (purpose) {
      case 'volume_control':
        // For volume control: follow active entity if enabled, otherwise use volume_entity or main entity
        if (obj.follow_active_volume) {
          return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
        }
        return this._resolveEntity(obj.volume_entity, obj.entity_id, idx) || obj.entity_id;
      case 'volume_display':
        // For volume display: show active entity if follow_active_volume enabled, otherwise show control entity
        if (obj.follow_active_volume) {
          return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
        }
        return this._resolveEntity(obj.volume_entity, obj.entity_id, idx) || obj.entity_id;
      case 'grouping_control':
        // For grouping menu: use MA entity (main entity if it's MA, or configured MA entity)
        // Check if main entity is a Music Assistant entity by checking if it supports grouping
        const mainState = this.hass.states[obj.entity_id];
        const mainIsMA = this._isGroupCapable(mainState);
        if (mainIsMA) {
          return obj.entity_id;
        }
        return this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx) || obj.entity_id;
      case 'playback_control':
        // For playback controls: use the entity that is actually playing
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
      case 'sorting':
        // For chip sorting: use active playback entity (MA entity if playing, otherwise main entity)
        return this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
      default:
        return obj.entity_id;
    }
  }

  // Helper to resolve template entities
  _resolveEntity(entityTemplate, fallbackEntityId, idx) {
    if (!entityTemplate) return null;
    if (typeof entityTemplate === 'string' && (entityTemplate.includes('{{') || entityTemplate.includes('{%'))) {
      var _this$_maResolveCache2;
      // For templates, use cached resolved entity
      const cached = (_this$_maResolveCache2 = this._maResolveCache) === null || _this$_maResolveCache2 === void 0 || (_this$_maResolveCache2 = _this$_maResolveCache2[idx]) === null || _this$_maResolveCache2 === void 0 ? void 0 : _this$_maResolveCache2.id;
      return cached || fallbackEntityId;
    }
    return entityTemplate;
  }

  // Get active playback entity for a specific index
  _getActivePlaybackEntityForIndex(idx) {
    var _this$hass10, _this$hass11;
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    const mainId = obj.entity_id;
    const maId = this._resolveEntity(obj.music_assistant_entity, obj.entity_id, idx);
    const mainState = mainId ? (_this$hass10 = this.hass) === null || _this$hass10 === void 0 || (_this$hass10 = _this$hass10.states) === null || _this$hass10 === void 0 ? void 0 : _this$hass10[mainId] : null;
    const maState = maId ? (_this$hass11 = this.hass) === null || _this$hass11 === void 0 || (_this$hass11 = _this$hass11.states) === null || _this$hass11 === void 0 ? void 0 : _this$hass11[maId] : null;
    if (maId === mainId) return mainId;
    return this._getActivePlaybackEntityForIndexInternal(idx, mainId, maId, mainState, maState);
  }

  // Internal method to avoid recursion
  _getActivePlaybackEntityForIndexInternal(idx, mainId, maId, mainState, maState) {
    var _this$_playbackLinger2, _this$_lastPlayingEnt2;
    const lastResolved = this._lastResolvedEntityIdByChip[idx];

    // Helper to return and track
    const resolve = id => {
      this._lastResolvedEntityIdByChip[idx] = id;
      return id;
    };

    // Check for linger first - if we recently paused MA, stay on MA unless main entity is playing
    const linger = (_this$_playbackLinger2 = this._playbackLingerByIdx) === null || _this$_playbackLinger2 === void 0 ? void 0 : _this$_playbackLinger2[idx];
    const now = Date.now();
    if (linger && linger.until > now) {
      var _this$_lastPlayingEnt;
      // If main entity is playing AND was recently controlled, prioritize it over linger
      if (this._isEntityPlaying(mainState) && ((_this$_lastPlayingEnt = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt === void 0 ? void 0 : _this$_lastPlayingEnt[idx]) === mainId) {
        return resolve(mainId);
      }
      return resolve(linger.entityId);
    }
    // Clear expired linger
    if (linger && linger.until <= now) {
      delete this._playbackLingerByIdx[idx];
    }

    // Prioritize the entity that is actually playing
    const maPlaying = this._isEntityPlaying(maState);
    const mainPlaying = this._isEntityPlaying(mainState);

    // If both are playing, be sticky
    if (maPlaying && mainPlaying) {
      if (lastResolved === mainId) return resolve(mainId);
      if (lastResolved === maId) return resolve(maId);
      return resolve(maId); // Default to MA
    }
    if (maPlaying) return resolve(maId);
    if (mainPlaying) return resolve(mainId);

    // When neither is playing, check if one was recently controlled for this specific chip
    const lastPlayingForChip = (_this$_lastPlayingEnt2 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt2 === void 0 ? void 0 : _this$_lastPlayingEnt2[idx];
    if (lastPlayingForChip === maId) return resolve(maId);
    if (lastPlayingForChip === mainId) return resolve(mainId);

    // Default to Music Assistant entity if configured, otherwise main entity
    // Stickiness Fix: Prefer staying on whichever entity we were already showing if it's still "active"
    if (maId && maId !== mainId) {
      const maVisible = maId === lastResolved;
      const mainVisible = mainId === lastResolved;

      // If we were showing main and it's still "active" (on, paused, or has metadata), stick with it
      if (mainVisible && mainState && mainState.state !== "off" && mainState.state !== "unavailable") {
        return resolve(mainId);
      }

      // If we were showing MA and it's still "active", stick with it
      if (maVisible && maState && maState.state !== "off" && maState.state !== "unavailable") {
        return resolve(maId);
      }

      // Default to MA if both are candidate or no stickiness applies
      return resolve(maId);
    } else {
      return resolve(mainId);
    }
  }

  // Legacy methods for backward compatibility
  _getVolumeEntity(idx) {
    return this._getEntityForPurpose(idx, 'volume_control');
  }
  _getVolumeEntityForGrouping(idx) {
    return this._getEntityForPurpose(idx, 'grouping_control');
  }

  // Prefer Music Assistant entity for search/grouping if configured
  _getSearchEntityId(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj === null || obj === void 0 ? void 0 : obj.entity_id;

    // Check if it's a template
    if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
      // For templates, resolve at action time - return template string for now
      return obj.music_assistant_entity;
    }
    return obj.music_assistant_entity;
  }
  // Prefer Music Assistant entity for playback controls (play/pause/seek/etc.) if configured
  _getPlaybackEntityId(idx) {
    return this._getEntityForPurpose(idx, 'playback_control');
  }
  // Choose the active playback target dynamically: prefer the entity that is currently playing
  _getActivePlaybackEntityId() {
    var _this$entityObjs5, _this$hass12, _this$hass13;
    let idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._selectedIndex;
    const obj = (_this$entityObjs5 = this.entityObjs) === null || _this$entityObjs5 === void 0 ? void 0 : _this$entityObjs5[idx];
    if (!obj) return null;
    const mainId = obj.entity_id;
    const maId = this._getActualResolvedMaEntityForState(idx);
    const mainState = mainId ? (_this$hass12 = this.hass) === null || _this$hass12 === void 0 || (_this$hass12 = _this$hass12.states) === null || _this$hass12 === void 0 ? void 0 : _this$hass12[mainId] : null;
    const maState = maId ? (_this$hass13 = this.hass) === null || _this$hass13 === void 0 || (_this$hass13 = _this$hass13.states) === null || _this$hass13 === void 0 ? void 0 : _this$hass13[maId] : null;
    return this._getActivePlaybackEntityIdInternal(idx, mainId, maId, mainState, maState);
  }
  _getActivePlaybackEntityIdInternal(idx, mainId, maId, mainState, maState) {
    var _this$_playTimestamps, _this$_playTimestamps2, _this$_lastActiveEnti;
    if (maId === mainId) return mainId;
    const now = Date.now();
    const maPlayTime = ((_this$_playTimestamps = this._playTimestamps) === null || _this$_playTimestamps === void 0 ? void 0 : _this$_playTimestamps[maId]) || 0;
    const mainPlayTime = ((_this$_playTimestamps2 = this._playTimestamps) === null || _this$_playTimestamps2 === void 0 ? void 0 : _this$_playTimestamps2[mainId]) || 0;

    // A conflict occurs if one entity is playing but the other STOPPED recently (< 5s).
    // Transition detection: check if state changed from "playing" since last updated() run.
    const maWasPlayingUntilNow = this._playerStateCache[maId] === "playing" && (maState === null || maState === void 0 ? void 0 : maState.state) !== "playing";
    const mainWasPlayingUntilNow = this._playerStateCache[mainId] === "playing" && (mainState === null || mainState === void 0 ? void 0 : mainState.state) !== "playing";
    const maWasRecent = maWasPlayingUntilNow || now - maPlayTime < 5000;
    const mainWasRecent = mainWasPlayingUntilNow || now - mainPlayTime < 5000;

    // Prioritize the Music Assistant entity when it's playing
    if (this._isEntityPlaying(maState)) {
      this._lastActiveEntityIdByChip[idx] = maId;
      return maId;
    }

    // Debounce: Stay on MA if it stopped recently, even if Main is playing.
    if (maWasRecent && (maState === null || maState === void 0 ? void 0 : maState.state) !== "playing") {
      return maId;
    }

    // Prioritize the main entity when it's playing
    if (this._isEntityPlaying(mainState)) {
      this._lastActiveEntityIdByChip[idx] = mainId;
      return mainId;
    }

    // Debounce: Stay on Main if it stopped recently, even if MA is playing.
    if (mainWasRecent && (mainState === null || mainState === void 0 ? void 0 : mainState.state) !== "playing") {
      return mainId;
    }

    // Persistence: If no one is playing, stay on the last active entity for this chip indefinitely.
    const lastActiveForChip = (_this$_lastActiveEnti = this._lastActiveEntityIdByChip) === null || _this$_lastActiveEnti === void 0 ? void 0 : _this$_lastActiveEnti[idx];
    if (lastActiveForChip && (lastActiveForChip === maId || lastActiveForChip === mainId)) {
      return lastActiveForChip;
    }

    // Absolute fallback: music assistant entity if configured, otherwise main.
    return maId && maId !== mainId ? maId : mainId;
  }

  // Get hidden controls configuration for the current entity
  _getHiddenControlsForCurrentEntity() {
    const currentEntityObj = this.entityObjs[this._selectedIndex];
    if (!(currentEntityObj !== null && currentEntityObj !== void 0 && currentEntityObj.hidden_controls)) {
      return {};
    }

    // Convert array format to object format for compatibility
    const hiddenControls = {};
    if (Array.isArray(currentEntityObj.hidden_controls)) {
      currentEntityObj.hidden_controls.forEach(control => {
        hiddenControls[control] = true;
      });
    } else if (typeof currentEntityObj.hidden_controls === 'object') {
      // Handle object format as well
      Object.assign(hiddenControls, currentEntityObj.hidden_controls);
    }
    return hiddenControls;
  }

  // Get the active playback entity for a specific entity index (for follow_active_volume)
  _getActivePlaybackEntityIdForIndex(idx) {
    return this._getActivePlaybackEntityId(idx);
  }
  _getGroupingEntityId(idx) {
    const obj = this.entityObjs[idx];
    if (!obj) return null;
    if (obj.music_assistant_entity) {
      if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
        var _this$_maResolveCache3;
        const cached = (_this$_maResolveCache3 = this._maResolveCache) === null || _this$_maResolveCache3 === void 0 || (_this$_maResolveCache3 = _this$_maResolveCache3[idx]) === null || _this$_maResolveCache3 === void 0 ? void 0 : _this$_maResolveCache3.id;
        return cached || obj.entity_id;
      }
      return obj.music_assistant_entity;
    }
    return obj.entity_id;
  }
  _getGroupingEntityIdByEntityId(entityId) {
    const idx = this.entityIds.indexOf(entityId);
    if (idx < 0) return entityId;
    return this._getGroupingEntityId(idx);
  }
  _findEntityObjByAnyId(anyId) {
    return this.entityObjs.find(o => o.entity_id === anyId || o.music_assistant_entity === anyId) || null;
  }

  // Resolve Jinja template for music_assistant_entity with fallback to main entity
  _resolveMusicAssistantEntity(idx) {
    const obj = this.entityObjs[idx];
    if (!obj || !obj.music_assistant_entity) return obj === null || obj === void 0 ? void 0 : obj.entity_id;
    try {
      // Check if it's a template (contains Jinja syntax)
      if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
        // For now, return the template string - it will be resolved at action time
        // This allows dynamic switching based on criteria
        return obj.music_assistant_entity;
      }

      // Not a template, return as-is
      return obj.music_assistant_entity;
    } catch (error) {
      return obj.entity_id; // Fallback to main entity
    }
  }

  // Return grouping key
  _getGroupKey(id) {
    var _this$hass14, _this$hass15;
    // Use the grouping entity (e.g., Music Assistant) for membership
    const groupingId = this._getGroupingEntityIdByEntityId(id);
    const st = (_this$hass14 = this.hass) === null || _this$hass14 === void 0 || (_this$hass14 = _this$hass14.states) === null || _this$hass14 === void 0 ? void 0 : _this$hass14[groupingId];
    if (!st) return id;

    // If this entity isn't group capable (or is a preset group), treat it as its own group
    if (!this._isGroupCapable(st)) {
      return id;
    }
    const membersRaw = Array.isArray(st.attributes.group_members) ? st.attributes.group_members : [];

    // If no group members or just itself, it's not grouped
    if (membersRaw.length <= 1) return id;

    // First member is the master
    const masterGroupingId = membersRaw[0];

    // Check if the master is group capable (if it's a preset group, it won't be)
    const masterState = (_this$hass15 = this.hass) === null || _this$hass15 === void 0 || (_this$hass15 = _this$hass15.states) === null || _this$hass15 === void 0 ? void 0 : _this$hass15[masterGroupingId];
    if (!this._isGroupCapable(masterState)) {
      return id;
    }

    // Find configured entity corresponding to this master grouping ID
    const masterEntityId = this.entityIds.find(eId => {
      const gId = this._getGroupingEntityIdByEntityId(eId);
      return gId === masterGroupingId;
    });

    // If master is not in our config, return the raw grouping ID so we know it's external/different
    return masterEntityId || masterGroupingId;
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
    if (!group || !group.length) return null;
    if (!this.hass || group.length === 1) return group[0];
    // If _lastGroupingMasterId is present in this group, prefer it as master
    if (this._lastGroupingMasterId && group.includes(this._lastGroupingMasterId)) {
      return this._lastGroupingMasterId;
    }
    // Build candidate list with resolved grouping entity states
    const candidates = group.map(id => {
      const groupingId = this._getGroupingEntityIdByEntityId(id);
      const state = groupingId ? this.hass.states[groupingId] : null;
      return state ? {
        id,
        groupingId,
        state
      } : null;
    }).filter(Boolean);
    if (!candidates.length) {
      return group[0];
    }

    // User requested simplification: First item in group_members is the master.
    // Try to find a valid group definition from any of the candidates
    for (const candidate of candidates) {
      var _candidate$state;
      const members = (_candidate$state = candidate.state) === null || _candidate$state === void 0 || (_candidate$state = _candidate$state.attributes) === null || _candidate$state === void 0 ? void 0 : _candidate$state.group_members;
      if (Array.isArray(members) && members.length > 0) {
        const masterGroupingId = members[0];
        // Find the entity in our candidates that matches this master grouping ID
        const master = candidates.find(c => c.groupingId === masterGroupingId);
        if (master) {
          return master.id;
        }
      }
    }

    // Last resort, fall back to first entry (keeps legacy behaviour)
    return group[0];
  }
  _getGroupingMasterId() {
    if (!this.entityIds || !this.entityIds.length) return null;
    const groups = this.groupedSortedEntityIds || [];
    const currentId = this.currentEntityId || this.entityIds[0];
    let preferred = currentId;
    if (this._lastGroupingMasterId && this.entityIds.includes(this._lastGroupingMasterId)) {
      const lastGroup = groups.find(g => g.includes(this._lastGroupingMasterId));
      // Only stick to the last group if the *current* entity is actually part of it.
      // Otherwise, we've switched context to a different entity (e.g. ungrouped one).
      if (lastGroup && lastGroup.length > 1 && lastGroup.includes(currentId)) {
        preferred = this._lastGroupingMasterId;
      }
    }
    const group = preferred ? groups.find(g => g.includes(preferred)) : null;
    if (group && group.length > 1) {
      const actual = this._getActualGroupMaster(group);
      if (actual && this.entityIds.includes(actual)) {
        return actual;
      }
    }
    return preferred;
  }
  _getGroupingMasterIndex() {
    const masterId = this._getGroupingMasterId();
    return masterId ? this.entityIds.indexOf(masterId) : -1;
  }
  _getGroupingMasterObj() {
    const idx = this._getGroupingMasterIndex();
    return idx >= 0 ? this.entityObjs[idx] : null;
  }
  _resolveGroupingEntityId(obj, fallbackEntityId) {
    if (!(obj !== null && obj !== void 0 && obj.music_assistant_entity)) return fallbackEntityId;
    if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
      var _this$_maResolveCache4;
      const idx = this.entityIds.indexOf(fallbackEntityId);
      const cached = (_this$_maResolveCache4 = this._maResolveCache) === null || _this$_maResolveCache4 === void 0 || (_this$_maResolveCache4 = _this$_maResolveCache4[idx]) === null || _this$_maResolveCache4 === void 0 ? void 0 : _this$_maResolveCache4.id;
      return cached || fallbackEntityId;
    }
    return obj.music_assistant_entity;
  }
  get currentEntityId() {
    return this.entityIds[this._selectedIndex];
  }
  get currentStateObj() {
    if (!this.hass || !this.currentEntityId) return null;
    return this.hass.states[this.currentEntityId];
  }
  get currentPlaybackEntityId() {
    return this._getPlaybackEntityId(this._selectedIndex);
  }
  get currentPlaybackStateObj() {
    // Use cached resolved MA ID instead of raw template string
    const resolvedMaId = this._getResolvedPlaybackEntityIdSync(this._selectedIndex);
    if (!this.hass || !resolvedMaId) {
      // Fall back to main entity if no resolved MA ID
      return this.currentStateObj;
    }
    return this.hass.states[resolvedMaId];
  }
  get currentActivePlaybackEntityId() {
    var _this$hass16, _this$hass17;
    // Cache the result to prevent continuous re-calling during renders
    // Only recalculate if the cache is invalid or if key state has changed
    const cacheKey = `${this._selectedIndex}-${(_this$hass16 = this.hass) === null || _this$hass16 === void 0 || (_this$hass16 = _this$hass16.states) === null || _this$hass16 === void 0 || (_this$hass16 = _this$hass16[this.currentEntityId]) === null || _this$hass16 === void 0 ? void 0 : _this$hass16.state}-${(_this$hass17 = this.hass) === null || _this$hass17 === void 0 || (_this$hass17 = _this$hass17.states) === null || _this$hass17 === void 0 || (_this$hass17 = _this$hass17[this._getSearchEntityId(this._selectedIndex)]) === null || _this$hass17 === void 0 ? void 0 : _this$hass17.state}`;
    if (this._cachedActivePlaybackEntityId === undefined || this._cachedActivePlaybackEntityKey !== cacheKey) {
      this._cachedActivePlaybackEntityId = this._getActivePlaybackEntityId(this._selectedIndex);
      this._cachedActivePlaybackEntityKey = cacheKey;
    }
    return this._cachedActivePlaybackEntityId;
  }
  get currentActivePlaybackStateObj() {
    var _this$hass18;
    const id = this.currentActivePlaybackEntityId;
    return id ? (_this$hass18 = this.hass) === null || _this$hass18 === void 0 || (_this$hass18 = _this$hass18.states) === null || _this$hass18 === void 0 ? void 0 : _this$hass18[id] : null;
  }
  get currentVolumeStateObj() {
    const entityId = this._getVolumeEntity(this._selectedIndex);
    return entityId ? this.hass.states[entityId] : null;
  }
  get isAnyMenuOpen() {
    return this._showEntityOptions || this._showGrouping || this._showSourceList || this._showTransferQueue || this._searchOpen || this._showSourceMenu || !!this._searchActiveOptionsItem || !!this._activeSearchRowMenuId || !!this._queueActionsMenuOpenId;
  }
  _renderMainMenu(sourceList, menuOnlyActions, showChipsInMenu) {
    return x`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${() => this._closeEntityOptions()}>
          ${localize('common.close')}
        </button>
        <div class="entity-options-divider"></div>
      </div>
      <div class="entity-options-menu ${showChipsInMenu ? 'chips-in-menu' : ''} entity-options-scroll" style="display:flex; flex-direction:column;">
        <button class="entity-options-item" @click=${() => {
      const resolvedEntities = this._getResolvedEntitiesForCurrentChip();
      if (resolvedEntities.length === 1) {
        this._openMoreInfoForEntity(resolvedEntities[0]);
        this._showEntityOptions = false;
      } else {
        this._showResolvedEntities = true;
      }
      this.requestUpdate();
    }}>${localize('card.menu.more_info')}</button>
        <button class="entity-options-item" @click=${() => {
      this._showSearchSheetInOptions();
    }}>${localize('common.search')}</button>

        ${Array.isArray(sourceList) && sourceList.length > 0 ? x`
          <button class="entity-options-item" @click=${() => this._openSourceList()}>${localize('card.menu.source')}</button>
        ` : E}
        
        ${this._canShowTransferQueueOption() ? x`
          <button class="entity-options-item" @click=${() => this._openTransferQueue()}>${localize('card.menu.transfer_queue')}</button>
        ` : E}
        
        ${this._renderGroupingMenuOption()}
        
        ${menuOnlyActions.length ? x`
          ${menuOnlyActions.map(_ref2 => {
      let {
        action,
        idx
      } = _ref2;
      const label = this._getActionLabel(action);
      return x`
              <button
                class="entity-options-item menu-action-item"
                @click=${() => this._onMenuActionClick(idx)}
              >
                ${action.icon ? x`
                  <ha-icon
                    class="menu-action-icon"
                    .icon=${action.icon}
                  ></ha-icon>
                ` : E}
                ${label ? x`<span class="menu-action-label">${label}</span>` : E}
              </button>
            `;
    })}
        ` : E}
      </div>
    `;
  }
  _renderInlineChipRow(showChipsInline, chipsHiddenInline) {
    var _this$config9, _this$config0, _this$config1;
    if (!showChipsInline) return E;
    return x`
      <div class="chip-row" style="${chipsHiddenInline ? "visibility: hidden; pointer-events: none;" : ""}">
        ${renderChipRow({
      groupedSortedEntityIds: this.groupedSortedEntityIds,
      entityIds: this.entityIds,
      selectedEntityId: this.currentEntityId,
      pinnedIndex: this._pinnedIndex,
      holdToPin: this._holdToPin,
      getChipName: id => this.getChipName(id),
      getActualGroupMaster: group => this._getActualGroupMaster(group),
      artworkHostname: ((_this$config9 = this.config) === null || _this$config9 === void 0 ? void 0 : _this$config9.artwork_hostname) || '',
      mediaArtworkOverrides: ((_this$config0 = this.config) === null || _this$config0 === void 0 ? void 0 : _this$config0.media_artwork_overrides) || [],
      fallbackArtwork: ((_this$config1 = this.config) === null || _this$config1 === void 0 ? void 0 : _this$config1.fallback_artwork) || null,
      getIsChipPlaying: (id, isSelected) => {
        var _this$hass19;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return false;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass19 = this.hass) === null || _this$hass19 === void 0 || (_this$hass19 = _this$hass19.states) === null || _this$hass19 === void 0 ? void 0 : _this$hass19[playbackEntityId];
        // Return actual playing state - animation should only show when truly playing
        return this._isEntityPlaying(playbackState);
      },
      getChipArt: id => {
        var _this$hass20, _this$hass21;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return null;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass20 = this.hass) === null || _this$hass20 === void 0 || (_this$hass20 = _this$hass20.states) === null || _this$hass20 === void 0 ? void 0 : _this$hass20[playbackEntityId];
        const mainState = (_this$hass21 = this.hass) === null || _this$hass21 === void 0 || (_this$hass21 = _this$hass21.states) === null || _this$hass21 === void 0 ? void 0 : _this$hass21[mainId];

        // Prefer playback entity artwork, fallback to main entity
        const playbackArtwork = this._getArtworkUrl(playbackState);
        const mainArtwork = this._getArtworkUrl(mainState);
        return playbackArtwork || mainArtwork;
      },
      getIsMaActive: id => {
        var _this$hass22;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return false;

        // Check if there's a configured MA entity
        const entityObj = this.entityObjs[idx];
        if (!(entityObj !== null && entityObj !== void 0 && entityObj.music_assistant_entity)) return false;

        // Use the unified entity resolution system
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass22 = this.hass) === null || _this$hass22 === void 0 || (_this$hass22 = _this$hass22.states) === null || _this$hass22 === void 0 ? void 0 : _this$hass22[playbackEntityId];

        // Check if the playback entity is the MA entity and is playing
        return playbackEntityId === this._resolveEntity(entityObj.music_assistant_entity, entityObj.entity_id, idx) && this._isEntityPlaying(playbackState);
      },
      isIdle: this._isIdle,
      hass: this.hass,
      onChipClick: idx => {
        this._onChipClick(idx);
      },
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
      onPointerUp: (e, idx) => this._handleChipPointerUp(e, idx),
      quickGroupingMode: this._quickGroupingMode,
      getQuickGroupingState: id => {
        const masterId = this.currentEntityId;
        const masterIdx = this.entityIds.indexOf(masterId);
        const masterGroupId = masterIdx >= 0 ? this._getGroupingEntityId(masterIdx) : masterId;
        const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
        const myGroupKey = this._getGroupKey(this.currentEntityId);
        return this._getGroupPlayerState(id, masterId, null, masterState, myGroupKey);
      },
      onQuickGroupClick: (idx, e) => {
        const id = this.entityIds[idx];
        if (id) {
          this._toggleGroup(id);
        }
      },
      onDoubleClick: e => {
        e.stopPropagation();
        this._quickGroupingMode = !this._quickGroupingMode;
        this.requestUpdate();
      }
    })}
      </div>
    `;
  }
  _renderInlineActionRow(rowActions) {
    if (!rowActions || !rowActions.length) return E;
    return x`
      <div style="${this._showEntityOptions ? 'visibility: hidden; pointer-events: none;' : ''}">
        ${renderActionChipRow({
      actions: rowActions.map(_ref3 => {
        let {
          action
        } = _ref3;
        return action;
      }),
      onActionChipClick: idx => {
        const target = rowActions[idx];
        if (!target) return;
        this._onActionChipClick(target.idx);
      }
    })}
      </div>
    `;
  }
  _renderGroupingMenuOption() {
    const totalEntities = this.entityIds.length;
    if (totalEntities <= 1) return E;
    const groupableCount = this.entityIds.reduce((acc, id, idx) => {
      const actualGroupId = this._getGroupingEntityId(idx);
      const st = this.hass.states[actualGroupId];
      return acc + (this._isGroupCapable(st) ? 1 : 0);
    }, 0);
    const currGroupId = this._getGroupingEntityId(this._selectedIndex);
    const currGroupState = this.hass.states[currGroupId];

    // Check if the current entity is a follower (unavailable for acting as a new group master)
    const currentId = this.currentEntityId;
    const groupKey = this._getGroupKey(currentId);
    const isFollower = groupKey !== currentId;
    if (groupableCount > 1 && this._isGroupCapable(currGroupState) && !isFollower) {
      return x`
        <button class="entity-options-item" @click=${() => this._openGrouping()}>${localize('card.menu.group_players')}</button>
      `;
    }
    return E;
  }

  // Determine the grouping state of a player ID relative to an active ID
  _getGroupPlayerState(targetId, activeId, activeGroupKey, masterState, myGroupKey) {
    var _masterState$attribut;
    const targetIdx = this.entityIds.indexOf(targetId);
    if (targetIdx < 0) return {
      isGroupable: false,
      isBusy: false,
      busyLabel: "",
      grouped: false
    };
    const entityToCheck = this._getGroupingEntityId(targetIdx);
    const st = this.hass.states[entityToCheck];
    if (!st || !this._isGroupCapable(st)) {
      return {
        isGroupable: false,
        isBusy: false,
        busyLabel: "",
        grouped: false
      };
    }
    const playerGroupKey = this._getGroupKey(targetId);
    let isBusy = false;
    let busyLabel = "";

    // Busy if joined to a DIFFERENT group
    if (playerGroupKey !== targetId && playerGroupKey !== myGroupKey) {
      isBusy = true;
      busyLabel = localize('common.unavailable');
    }
    // Or if it IS a master of a different group
    else if (playerGroupKey === targetId && playerGroupKey !== myGroupKey) {
      var _st$attributes;
      if (((_st$attributes = st.attributes) === null || _st$attributes === void 0 || (_st$attributes = _st$attributes.group_members) === null || _st$attributes === void 0 ? void 0 : _st$attributes.length) > 1) {
        isBusy = true;
        busyLabel = localize('common.unavailable');
      }
    }
    const filteredMembers = Array.isArray(masterState === null || masterState === void 0 || (_masterState$attribut = masterState.attributes) === null || _masterState$attribut === void 0 ? void 0 : _masterState$attribut.group_members) ? masterState.attributes.group_members : [];
    const grouped = filteredMembers.includes(entityToCheck);
    const isPrimary = targetId === myGroupKey;
    return {
      isGroupable: true,
      isBusy,
      busyLabel,
      grouped,
      isPrimary,
      entityToCheck
    };
  }
  _renderGroupingSheet() {
    var _masterState$attribut2;
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterGroupId = masterIdx >= 0 ? this._getGroupingEntityId(masterIdx) : masterId;
    const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
    const groupedAny = Array.isArray(masterState === null || masterState === void 0 || (_masterState$attribut2 = masterState.attributes) === null || _masterState$attribut2 === void 0 ? void 0 : _masterState$attribut2.group_members) && masterState.attributes.group_members.length > 1;
    const groupPlayerIds = [];
    this.entityIds.indexOf(this.currentEntityId);
    const myGroupKey = this._getGroupKey(this.currentEntityId);
    this.entityIds.forEach(id => {
      const state = this._getGroupPlayerState(id, this.currentEntityId, null, masterState, myGroupKey);
      if (state.isGroupable) {
        groupPlayerIds.push({
          id: id,
          groupId: state.entityToCheck,
          isBusy: state.isBusy,
          busyLabel: state.busyLabel
        });
      }
    });
    const activeId = this.currentEntityId;
    const activeIdx = this.entityIds.indexOf(activeId);
    const activeGroupId = activeIdx >= 0 ? this._getGroupingEntityId(activeIdx) : null;
    const activeState = activeGroupId ? this.hass.states[activeGroupId] : null;
    const activeIsGroupCapable = activeState ? this._isGroupCapable(activeState) : false;

    // Check if active entity is itself a follower (isBusy)
    const activeGroupKey = this._getGroupKey(activeId);
    const activeIsBusy = activeGroupKey !== activeId;
    if (!groupedAny && (!activeIsGroupCapable || activeIsBusy)) {
      return x`
        <div class="entity-options-header">
          <button class="entity-options-item close-item" @click=${() => {
        if (this._quickMenuInvoke) {
          this._dismissWithAnimation();
        } else {
          this._closeGrouping();
        }
      }}>
            ${localize('common.back')}
          </button>
          <div class="entity-options-divider"></div>
        </div>
        <div class="entity-options-title" style="margin-bottom:8px;">${localize('card.grouping.title')}</div>
        <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
          ${activeIsBusy ? localize('card.grouping.unavailable') : localize('card.grouping.no_players')}
        </div>
      `;
    }
    const sortedGroupIds = [...groupPlayerIds].sort((a, b) => {
      if (groupedAny) {
        if (a.id === masterId) return -1;
        if (b.id === masterId) return 1;
      } else {
        if (a.id === activeId) return -1;
        if (b.id === activeId) return 1;
      }
      if (a.isBusy === b.isBusy) return 0;
      return a.isBusy ? 1 : -1;
    });
    return x`
      <div class="grouping-header group-list-header">
        <button class="entity-options-item close-item" @click=${() => {
      if (this._quickMenuInvoke) {
        this._dismissWithAnimation();
      } else {
        this._closeGrouping();
      }
    }}>
          ${localize('common.back')}
        </button>
      </div>
      <div class="entity-options-title" style="margin-bottom:8px; margin-top:8px;">${localize('card.grouping.title')}</div>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        ${groupedAny ? x`
          <button class="entity-options-item"
            @click=${() => this._syncGroupVolume()}
            style="flex:0 0 auto; min-width:140px; text-align:center;">
            ${localize('card.grouping.sync_volume')}
          </button>
        ` : E}
        <button class="entity-options-item"
          @click=${() => groupedAny ? this._ungroupAll() : this._groupAll()}
          style="flex:0 0 auto; min-width:140px; text-align:center; margin-left:auto;">
          ${groupedAny ? localize('card.grouping.ungroup_all') : localize('card.grouping.group_all')}
        </button>
      </div>
      <div class="group-list-scroll">
        ${sortedGroupIds.length === 0 ? x`
          <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
            ${localize('card.grouping.no_players')}
          </div>
        ` : sortedGroupIds.map(item => {
      var _masterState$attribut3, _displayVolumeState$a;
      const id = item.id;
      const actualGroupId = item.groupId;
      const filteredMembers = Array.isArray(masterState === null || masterState === void 0 || (_masterState$attribut3 = masterState.attributes) === null || _masterState$attribut3 === void 0 ? void 0 : _masterState$attribut3.group_members) ? masterState.attributes.group_members : [];
      const grouped = filteredMembers.includes(actualGroupId);
      const name = this.getChipName(id);
      const isBusy = item.isBusy;
      const busyLabel = item.busyLabel;
      const entityIdx = this.entityIds.indexOf(id);
      const volumeEntity = this._getVolumeEntityForGrouping(entityIdx);
      const displayEntity = volumeEntity || actualGroupId;
      const displayVolumeState = this.hass.states[displayEntity];
      const isRemoteVol = (displayEntity === null || displayEntity === void 0 ? void 0 : displayEntity.startsWith) && displayEntity.startsWith("remote.");
      const volVal = Number((displayVolumeState === null || displayVolumeState === void 0 || (_displayVolumeState$a = displayVolumeState.attributes) === null || _displayVolumeState$a === void 0 ? void 0 : _displayVolumeState$a.volume_level) || 0);
      const isPrimaryRow = id === masterId;
      const showToggleButton = !isPrimaryRow;
      const isCurrent = id === activeId;
      let stateLabel = groupedAny ? isPrimaryRow ? localize('card.grouping.master') : grouped ? localize('card.grouping.joined') : localize('card.grouping.available') : isCurrent ? localize('card.grouping.current') : localize('card.grouping.available');
      if (isBusy) {
        stateLabel = busyLabel || "Unavailable";
      }
      return x`
            <div class="entity-options-item group-player-row" style="
              display:flex;
              align-items:center;
              gap:6px;
              padding:4px 8px;
              margin-bottom:1px;
              ${isBusy ? "opacity: 0.5;" : ""}
            ">
              <div style="flex:1; min-width:120px;">
                <div style="font-weight:600; text-align:left;">${name}</div>
                <div style="font-size:0.8em; opacity:0.7; text-align:left;">${stateLabel}</div>
              </div>
              <div style="flex:1.8;display:flex;align-items:center;gap:4px;margin:0 6px; min-width:160px;">
                ${isRemoteVol ? x`
                    <div class="vol-stepper" style="display:flex;align-items:center;gap:4px;">
                      <button @click=${() => this._onGroupVolumeStep(displayEntity, -1)} title="Vol Down" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:minus"></ha-icon>
                      </button>
                      <button @click=${() => this._onGroupVolumeStep(displayEntity, 1)} title="Vol Up" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:plus"></ha-icon>
                      </button>
                    </div>
                  ` : x`
                    <input
                      class="vol-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      .value=${volVal}
                      @change=${e => this._onGroupVolumeChange(id, displayEntity, e)}
                      title="Volume"
                      style="width:100%;max-width:260px;"
                    />
                  `}
                <span style="min-width:36px;display:inline-block;text-align:right;">${typeof volVal === "number" ? Math.round(volVal * 100) + "%" : "--"}</span>
              </div>
              ${showToggleButton ? x`
                    <button class="group-toggle-btn"
                            @click=${() => !isBusy && this._toggleGroup(id)}
                            title=${isBusy ? "Player is unavailable" : grouped ? "Unjoin" : "Join"}
                            style="margin-left:4px; ${isBusy ? "cursor: not-allowed; opacity: 0.5;" : ""}">
                      <ha-icon icon=${grouped ? "mdi:minus-circle-outline" : "mdi:plus-circle-outline"}></ha-icon>
                    </button>
                  ` : x`<span style="margin-left:4px;margin-right:10px;width:32px;display:inline-block;"></span>`}
            </div>
          `;
    })}
      </div>
    `;
  }
  _renderTransferQueueSheet() {
    const targets = this._getTransferQueueTargets();
    return x`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${() => {
      if (this._quickMenuInvoke) {
        this._dismissWithAnimation();
      } else {
        this._closeTransferQueue();
      }
    }}>
          ${localize('common.back')}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-title" style="margin-bottom:12px;">${localize('card.menu.transfer_to')}</div>
      </div>
      <div class="entity-options-scroll">
        ${!targets.length ? x`
          <div style="padding: 12px; opacity: 0.75;">${localize('card.menu.no_players')}</div>
        ` : x`
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${targets.map(target => x`
              <button
                class="entity-options-item"
                ?disabled=${this._transferQueuePendingTarget === target.maEntityId}
                @click=${() => this._transferQueueTo(target)}
                style="display:flex;align-items:center;justify-content:flex-start;gap:12px;${this._transferQueuePendingTarget === target.maEntityId ? 'opacity:0.6;' : ''}">
                <ha-icon .icon=${target.icon} style="margin-right:4px;"></ha-icon>
                <div style="display:flex;flex-direction:column;align-items:flex-start;">
                  <div>${target.name}</div>
                  <div style="font-size:0.82em;opacity:0.7;">${target.subtitle}</div>
                </div>
                ${target.state ? x`<div style="margin-left:auto;font-size:0.82em;opacity:0.7;text-transform:capitalize;">${target.state}</div>` : E}
              </button>
            `)}
          </div>
        `}
        ${this._transferQueueStatus ? x`
          <div style="
            margin-top: 14px;
            padding: 10px 12px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            background: ${this._transferQueueStatus.type === 'error' ? 'rgba(244, 67, 54, 0.18)' : 'rgba(76, 175, 80, 0.18)'};
            color: ${this._transferQueueStatus.type === 'error' ? '#ff8a80' : '#8bc34a'};
          ">
            ${this._transferQueueStatus.message}
          </div>
        ` : E}
      </div>
    `;
  }
  _renderResolvedEntitiesSheet() {
    return x`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${() => {
      this._showResolvedEntities = false;
      this.requestUpdate();
    }}>
          ${localize('common.back')}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-resolved-entities" style="margin-top:12px;">
          <div class="entity-options-title">${localize('card.menu.select_entity')}</div>
          <div class="entity-options-resolved-entities-list">
            ${this._getResolvedEntitiesForCurrentChip().map(entityId => {
      var _this$hass23, _state$attributes3, _state$attributes4;
      const state = (_this$hass23 = this.hass) === null || _this$hass23 === void 0 || (_this$hass23 = _this$hass23.states) === null || _this$hass23 === void 0 ? void 0 : _this$hass23[entityId];
      const name = (state === null || state === void 0 || (_state$attributes3 = state.attributes) === null || _state$attributes3 === void 0 ? void 0 : _state$attributes3.friendly_name) || entityId;
      const icon = (state === null || state === void 0 || (_state$attributes4 = state.attributes) === null || _state$attributes4 === void 0 ? void 0 : _state$attributes4.icon) || "mdi:help-circle";
      const idx = this._selectedIndex;
      const obj = this.entityObjs[idx];
      let role = "Main Entity";
      let isActive = false;
      if (obj) {
        const maEntity = this._getActualResolvedMaEntityForState(idx);
        const volEntity = this._getVolumeEntity(idx);
        const activeEntity = this._getActivePlaybackEntityForIndex(idx) || obj.entity_id;
        isActive = activeEntity === entityId;
        if (entityId === maEntity && maEntity !== obj.entity_id) {
          role = "Music Assistant Entity";
        } else if (entityId === volEntity && volEntity !== obj.entity_id && volEntity !== maEntity) {
          role = "Volume Entity";
        }
      }
      return x`
                <button class="entity-options-item" @click=${() => {
        this._openMoreInfoForEntity(entityId);
        this._showEntityOptions = false;
        this._showResolvedEntities = false;
        this.requestUpdate();
      }}>
                  <ha-icon .icon=${icon} style="margin-right: 8px;"></ha-icon>
                  <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <div>${isActive ? `${name} (Active)` : name}</div>
                    <div style="font-size: 0.85em; opacity: 0.7;">${role}</div>
                  </div>
                </button>
              `;
    })}
          </div>
        </div>
      </div>
    `;
  }
  updated(changedProps) {
    var _super$updated;
    if (this._idleImageTemplate && changedProps.has("hass")) {
      this._idleImageTemplateNeedsResolve = true;
    }
    if (changedProps.has("_selectedIndex") || changedProps.has("hass")) {
      void this._updateTransferQueueAvailability({
        refresh: false
      });
    }
    if (this.hass && this._hasMassQueueIntegration === null && !this._checkingMassQueueIntegration) {
      this._checkingMassQueueIntegration = true;
      this._isMassQueueIntegrationAvailable(this.hass).then(hasIntegration => {
        this._hasMassQueueIntegration = hasIntegration;
        if (hasIntegration) {
          this._massQueueAvailable = this._massQueueAvailable || hasIntegration;
        }
      }).catch(() => {
        this._hasMassQueueIntegration = false;
      }).finally(() => {
        this._checkingMassQueueIntegration = false;
        this.requestUpdate();
      });
    }
    if (this.hass && this.entityIds) {
      // Check if currently playing track has changed and refresh "Next Up" if active
      if (this._upcomingFilterActive) {
        const currentPlaybackEntity = this.currentActivePlaybackEntityId;
        if (currentPlaybackEntity) {
          var _currentState$attribu;
          const currentState = this.hass.states[currentPlaybackEntity];
          const currentMediaTitle = currentState === null || currentState === void 0 || (_currentState$attribu = currentState.attributes) === null || _currentState$attribu === void 0 ? void 0 : _currentState$attribu.media_title;
          if (currentMediaTitle && currentMediaTitle !== this._lastMediaTitle) {
            this._lastMediaTitle = currentMediaTitle;
            // Show loading state immediately
            this._searchLoading = true;
            this.requestUpdate();
            // Clear cache and refresh with 4 second delay
            const cacheKey = `${this._searchMediaClassFilter || 'all'}_upcoming`;
            delete this._searchResultsByType[cacheKey];
            setTimeout(() => {
              this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter);
            }, 4000);
          }
        }
      }

      // Robust state tracking and timestamp updates
      const now = Date.now();
      for (let idx = 0; idx < this.entityIds.length; idx++) {
        var _this$hass$states$mai, _this$hass$states$act;
        const id = this.entityIds[idx];
        const obj = this.entityObjs[idx];
        if (!obj) continue;
        const mainId = obj.entity_id;
        const maId = this._getActualResolvedMaEntityForState(idx);

        // Track main player state
        const mainState = (_this$hass$states$mai = this.hass.states[mainId]) === null || _this$hass$states$mai === void 0 ? void 0 : _this$hass$states$mai.state;
        const prevMainState = this._playerStateCache[mainId];
        if (mainState === "playing") {
          this._playTimestamps[mainId] = now;
          this._lastActiveEntityIdByChip[idx] = mainId;
        } else if (prevMainState === "playing" && mainState !== "playing") {
          this._playTimestamps[mainId] = now;
        }
        this._playerStateCache[mainId] = mainState;

        // Track Music Assistant player state if different
        if (maId && maId !== mainId) {
          var _this$hass$states$maI;
          const maState = (_this$hass$states$maI = this.hass.states[maId]) === null || _this$hass$states$maI === void 0 ? void 0 : _this$hass$states$maI.state;
          const prevMaState = this._playerStateCache[maId];
          if (maState === "playing") {
            this._playTimestamps[maId] = now;
            this._lastActiveEntityIdByChip[idx] = maId;
          } else if (prevMaState === "playing" && maState !== "playing") {
            this._playTimestamps[maId] = now;
          }
          this._playerStateCache[maId] = maState;
        }

        // Also maintain chip-level timestamp for sorting
        const activeEntityId = this._getEntityForPurpose(idx, 'sorting');
        if (activeEntityId && ((_this$hass$states$act = this.hass.states[activeEntityId]) === null || _this$hass$states$act === void 0 ? void 0 : _this$hass$states$act.state) === "playing") {
          this._playTimestamps[id] = now;
        }
      }

      // If manual‑select is active (no pin) and a *new* entity begins playing,
      // clear manual mode so auto‑switching resumes.
      if (this._manualSelect && this._pinnedIndex === null && this._manualSelectPlayingSet) {
        // Remove any entities from the snapshot that are no longer playing.
        for (const id of [...this._manualSelectPlayingSet]) {
          const stSnap = this.hass.states[id];
          if (!this._isEntityPlaying(stSnap)) {
            this._manualSelectPlayingSet.delete(id);
          }
        }
        for (const id of this.entityIds) {
          const st = this.hass.states[id];
          if (this._isEntityPlaying(st) && !this._manualSelectPlayingSet.has(id)) {
            this._manualSelect = false;
            this._manualSelectPlayingSet = null;
            break;
          }
        }
      }

      // Auto-switch unless manually pinned or a menu is open
      // Update idle state before checking for auto-switch
      // This ensures we respect the idle timeout if the current entity just stopped
      this._updateIdleState();
      if (!this._manualSelect && !this.isAnyMenuOpen) {
        // Switch to most recent if applicable
        const sortedIds = this.sortedEntityIds;
        if (sortedIds.length > 0) {
          var _this$entityObjs$most;
          let mostRecentId = sortedIds[0];
          // If the most recent entity is part of a group, prefer the actual master
          const candidateGroup = mostRecentId ? (this.groupedSortedEntityIds || []).find(g => g.includes(mostRecentId)) : null;
          if (candidateGroup && candidateGroup.length > 1) {
            const groupMaster = this._getActualGroupMaster(candidateGroup);
            if (groupMaster) {
              mostRecentId = groupMaster;
            }
          }
          const mostRecentIdx = this.entityIds.indexOf(mostRecentId);
          const mostRecentActiveEntity = mostRecentIdx >= 0 ? this._getEntityForPurpose(mostRecentIdx, 'sorting') : null;
          const mostRecentActiveState = mostRecentActiveEntity ? this.hass.states[mostRecentActiveEntity] : null;
          const isCurrentPlaying = this._isCurrentEntityPlaying();
          if (this._isEntityPlaying(mostRecentActiveState) && this.entityIds[this._selectedIndex] !== mostRecentId && (!this._idleTimeout || !this._hasSeenPlayback) && !isCurrentPlaying && !((_this$entityObjs$most = this.entityObjs[mostRecentIdx]) !== null && _this$entityObjs$most !== void 0 && _this$entityObjs$most.disable_auto_select)) {
            this._selectedIndex = mostRecentIdx;
          }
        }
      }
      // Ensure grouped selections always point at the actual master
      const selectedId = this.entityIds[this._selectedIndex];
      const selectedGroup = selectedId ? (this.groupedSortedEntityIds || []).find(g => g.includes(selectedId)) : null;
      if (selectedGroup && selectedGroup.length > 1) {
        const actualMaster = this._getActualGroupMaster(selectedGroup);
        if (actualMaster && actualMaster !== selectedId) {
          var _this$entityObjs$mast;
          const masterIdx = this.entityIds.indexOf(actualMaster);
          if (masterIdx >= 0 && !((_this$entityObjs$mast = this.entityObjs[masterIdx]) !== null && _this$entityObjs$mast !== void 0 && _this$entityObjs$mast.disable_auto_select)) {
            this._selectedIndex = masterIdx;
            this._lastGroupingMasterId = actualMaster;
          }
        }
      }
      // Warm the resolved MA/Volume caches for the selected chip
      this._ensureResolvedMaForIndex(this._selectedIndex);
      this._ensureResolvedVolForIndex(this._selectedIndex);

      // Sync selected entity to helper if configured
      this._updateSelectedEntityHelper();
    }

    // Restart progress timer
    (_super$updated = super.updated) === null || _super$updated === void 0 || _super$updated.call(this, changedProps);
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    const playbackState = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    if (this._isEntityPlaying(playbackState) && playbackState.attributes.media_duration) {
      this._progressTimer = setInterval(() => {
        this.requestUpdate();
      }, 500);
    }

    // Update idle state after all other state checks

    // Notify HA if collapsed state changes
    // If expand on search is enabled and search is open, force expanded state
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
      const collapsedNow = false;
      if (this._prevCollapsed !== collapsedNow) {
        this._prevCollapsed = collapsedNow;
        // Trigger layout update
        this._notifyResize();
      }
      return;
    }

    // Otherwise use normal collapse logic
    const collapsedNow = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    if (this._prevCollapsed !== collapsedNow) {
      this._prevCollapsed = collapsedNow;
      // Trigger layout update
      this._notifyResize();
    }

    // Add grab scroll to chip rows after update/render
    this._addGrabScroll('.chip-row');
    this._addGrabScroll('.action-chip-row');
    this._addGrabScroll('.search-filter-chips');
    this._addVerticalGrabScroll('.floating-source-index');
    if (this._lastRenderedCollapsed && !this._lastRenderedHideControls) {
      var _this$renderRoot2;
      const contentEl = (_this$renderRoot2 = this.renderRoot) === null || _this$renderRoot2 === void 0 ? void 0 : _this$renderRoot2.querySelector('.card-lower-content');
      if (contentEl) {
        const measured = contentEl.offsetHeight;
        if (measured && measured > 0) {
          var _this$config10;
          const customHeight = Number((_this$config10 = this.config) === null || _this$config10 === void 0 ? void 0 : _this$config10.card_height);
          const hasCustomCardHeight = Number.isFinite(customHeight) && customHeight > 0;
          if (!hasCustomCardHeight) {
            this._collapsedBaselineHeight = measured;
          } else if (!this._collapsedBaselineHeight || measured < this._collapsedBaselineHeight - 1) {
            // Allow the baseline to shrink but never grow when a custom height is applied
            this._collapsedBaselineHeight = measured;
          }
        }
      }
    }

    // Autofocus the in-sheet search box when opening the search in entity options
    if (this._showSearchInSheet) {
      // Use a longer delay when expand on search is enabled to allow for card expansion
      this._alwaysCollapsed && this._expandOnSearch ? 300 : 200;
      setTimeout(() => {
        const focusSearchInput = () => {
          const inputEl = this.renderRoot.querySelector('#search-input-box');
          if (inputEl) {
            inputEl.focus();
            this._searchInputAutoFocused = true;
            return true;
          }
          return false;
        };
        if (!this._disableSearchAutofocus && !this._searchInputAutoFocused) {
          const focusedNow = focusSearchInput();
          if (!focusedNow) {
            // If input not found yet, try again with a longer delay
            setTimeout(() => {
              if (this._showSearchInSheet && !this._disableSearchAutofocus && !this._searchInputAutoFocused) {
                focusSearchInput();
              }
            }, 200);
          }
        }
        // Only scroll filter chip row to start if the set of chips has changed
        const classes = this._getVisibleSearchFilterClasses();
        const classStr = classes.join(",");
        const shouldResetChipScroll = (!this._searchLoading || classStr) && this._lastSearchChipClasses !== classStr;
        if (shouldResetChipScroll) {
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
        // this._attachSearchSwipe(); // Disabled on mobile due to false positives
      }, 200);
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
    // Reset last active entity when switching chips
    this._lastActiveEntityId = null;
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
          var _this$hass24;
          const st = (_this$hass24 = this.hass) === null || _this$hass24 === void 0 || (_this$hass24 = _this$hass24.states) === null || _this$hass24 === void 0 ? void 0 : _this$hass24[id];
          if (this._isEntityPlaying(st)) {
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
  async _onActionChipClick(idx) {
    const action = this.config.actions[idx];
    if (!action) return;
    await this._handleAction(action);
  }
  async _handleAction(action) {
    if (!action) return;
    if (action.menu_item) {
      // Enable quick-dismiss mode for menu_item actions
      this._quickMenuInvoke = true;
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
          this._openQuickSearchOverlay();
          break;
        case "search-recently-played":
          this._showEntityOptions = true;
          this._showSearchSheetInOptions("recently-played");
          setTimeout(() => {
            this._notifyResize();
          }, 0);
          break;
        case "search-next-up":
          this._showEntityOptions = true;
          this._showSearchSheetInOptions("next-up");
          setTimeout(() => {
            this._notifyResize();
          }, 0);
          break;
        case "source":
          this._showEntityOptions = true;
          this._showSourceList = true;
          this._showGrouping = false;
          this.requestUpdate();
          break;
        case "transfer-queue":
          this._showEntityOptions = true;
          this._openTransferQueue();
          break;
      }
      return;
    }
    if (typeof action.navigation_path === "string" && action.navigation_path.trim() !== "" || action.action === "navigate") {
      let path = (typeof action.navigation_path === "string" ? action.navigation_path : action.path || "").trim();

      // Create context for template resolution
      const context = {
        current: this.currentActivePlaybackEntityId || this.currentEntityId || ''
      };
      path = await resolveStringTemplate(this.hass, path, context);
      const openInNewTab = action.navigation_new_tab === true;
      this._handleNavigate(path, openInNewTab);
      return;
    }
    if (!action.service) return;
    const [domain, service] = action.service.split(".");
    let data = {
      ...(action.service_data || {})
    };
    if (domain === "script" && action.script_variable === true) {
      const currentMainId = this.currentEntityId;
      const currentMaIdTemplate = this._getSearchEntityId(this._selectedIndex);
      const currentMaId = await this._resolveTemplateAtActionTime(currentMaIdTemplate, currentMainId);
      const currentPlaybackIdTemplate = this.currentActivePlaybackEntityId || this._getPlaybackEntityId(this._selectedIndex);
      const currentPlaybackId = await this._resolveTemplateAtActionTime(currentPlaybackIdTemplate, currentMainId);
      if (data.entity_id === "current" || data.entity_id === "$current" || data.entity_id === "this") {
        delete data.entity_id;
      }
      // Prefer MA entity when available for script consumers
      data.yamp_entity = currentMaId || currentMainId;
      // Also expose main and active playback for advanced scripts
      data.yamp_main_entity = currentMainId;
      data.yamp_playback_entity = currentPlaybackId;
    } else if (!(domain === "script" && action.script_variable === true) && (data.entity_id === "current" || data.entity_id === "$current" || data.entity_id === "this" || !data.entity_id)) {
      // Resolve 'current' placeholder differently by domain
      if (domain === "music_assistant") {
        const maTemplate = this._getSearchEntityId(this._selectedIndex);
        data.entity_id = await this._resolveTemplateAtActionTime(maTemplate, this.currentEntityId);
      } else if (domain === "media_player") {
        const playbackTemplate = this.currentActivePlaybackEntityId || this._getPlaybackEntityId(this._selectedIndex);
        data.entity_id = await this._resolveTemplateAtActionTime(playbackTemplate, this.currentEntityId);
      } else {
        data.entity_id = this.currentEntityId;
      }
    }
    this.hass.callService(domain, service, data);
  }
  _onTapAreaPointerDown(e) {
    var _this$_cardTriggers;
    if (this.isAnyMenuOpen) return;

    // Check if we clicked on something interactive
    const path = e.composedPath();
    const isInteractive = path.some(el => el.tagName === 'BUTTON' || el.tagName === 'HA-ICON' || el.tagName === 'INPUT' || el.classList && el.classList.contains('clickable-artist') || el.classList && el.classList.contains('details'));
    if (isInteractive) return;
    this._gestureActive = true;
    this._gestureStartTime = Date.now();
    this._gestureStartX = e.clientX;
    this._gestureStartY = e.clientY;
    this._gestureHoldTriggered = false;

    // Store the target tap area for positioning feedback
    this._gestureTapArea = e.currentTarget;
    if ((_this$_cardTriggers = this._cardTriggers) !== null && _this$_cardTriggers !== void 0 && _this$_cardTriggers.hold) {
      this._gestureHoldTimer = setTimeout(() => {
        if (this._gestureActive) {
          this._gestureHoldTriggered = true;
          this._showGestureFeedback('hold', this._gestureStartX, this._gestureStartY);
          this._handleAction(this._cardTriggers.hold);
        }
      }, GESTURE_HOLD_TIMEOUT);
    }
  }
  _onTapAreaPointerMove(e) {
    if (!this._gestureActive) return;
    const diffX = Math.abs(e.clientX - this._gestureStartX);
    const diffY = Math.abs(e.clientY - this._gestureStartY);
    // Cancel hold timer on any significant movement, but keep gesture active for swipe detection
    if (diffX > GESTURE_MOVE_THRESHOLD || diffY > GESTURE_MOVE_THRESHOLD) {
      clearTimeout(this._gestureHoldTimer);
    }
  }
  _onTapAreaPointerUp(e) {
    if (!this._gestureActive) return;
    this._gestureActive = false;
    clearTimeout(this._gestureHoldTimer);
    if (this._gestureHoldTriggered) return;

    // Reject taps that were actually holds (long presses)
    if (Date.now() - this._gestureStartTime > GESTURE_HOLD_TIMEOUT) return;

    // Calculate movement
    const diffX = e.clientX - this._gestureStartX;
    const diffY = e.clientY - this._gestureStartY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    // Check for swipe gestures (horizontal movement > threshold, vertical movement < threshold)
    if (absDiffX >= GESTURE_SWIPE_THRESHOLD && absDiffY < GESTURE_SWIPE_THRESHOLD) {
      var _this$_cardTriggers2, _this$_cardTriggers3;
      clearTimeout(this._tapTimer);
      const tapX = e.clientX;
      const tapY = e.clientY;
      if (diffX < 0 && (_this$_cardTriggers2 = this._cardTriggers) !== null && _this$_cardTriggers2 !== void 0 && _this$_cardTriggers2.swipe_left) {
        // Swipe Left
        this._showGestureFeedback('swipe_left', tapX, tapY);
        this._handleAction(this._cardTriggers.swipe_left);
        return;
      } else if (diffX > 0 && (_this$_cardTriggers3 = this._cardTriggers) !== null && _this$_cardTriggers3 !== void 0 && _this$_cardTriggers3.swipe_right) {
        // Swipe Right
        this._showGestureFeedback('swipe_right', tapX, tapY);
        this._handleAction(this._cardTriggers.swipe_right);
        return;
      }
    }

    // Movement threshold check for tap gestures
    if (absDiffX > GESTURE_MOVE_THRESHOLD || absDiffY > GESTURE_MOVE_THRESHOLD) return;
    const now = Date.now();
    const timeSinceLastTap = now - (this._lastTapTime || 0);
    this._lastTapTime = now;

    // Store position for delayed tap feedback
    const tapX = e.clientX;
    const tapY = e.clientY;
    if (timeSinceLastTap < GESTURE_DOUBLE_TAP_MAX_DELAY) {
      var _this$_cardTriggers4;
      // Double Tap
      clearTimeout(this._tapTimer);
      if ((_this$_cardTriggers4 = this._cardTriggers) !== null && _this$_cardTriggers4 !== void 0 && _this$_cardTriggers4.double_tap) {
        this._showGestureFeedback('double_tap', tapX, tapY);
        this._handleAction(this._cardTriggers.double_tap);
      }
    } else {
      // Tap (delayed to see if it's a double tap)
      this._tapTimer = setTimeout(() => {
        var _this$_cardTriggers5;
        if ((_this$_cardTriggers5 = this._cardTriggers) !== null && _this$_cardTriggers5 !== void 0 && _this$_cardTriggers5.tap) {
          this._showGestureFeedback('tap', tapX, tapY);
          this._handleAction(this._cardTriggers.tap);
        }
      }, GESTURE_TAP_DELAY);
    }
  }

  /**
   * Show visual feedback for card trigger gestures
   * @param {string} type - 'tap' | 'double_tap' | 'hold' | 'swipe_left' | 'swipe_right'
   * @param {number} clientX - Client X coordinate of the gesture
   * @param {number} clientY - Client Y coordinate of the gesture
   */
  _showGestureFeedback(type, clientX, clientY) {
    var _this$shadowRoot, _this$shadowRoot2;
    // Find the gesture feedback container in the shadow DOM
    const tapArea = this._gestureTapArea || ((_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.querySelector('.card-artwork-spacer')) || ((_this$shadowRoot2 = this.shadowRoot) === null || _this$shadowRoot2 === void 0 ? void 0 : _this$shadowRoot2.querySelector('.collapsed-artwork-container'));
    if (!tapArea) return;

    // Get the bounding rect of the tap area to calculate relative position
    const rect = tapArea.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = `gesture-ripple ${type}`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Find or create the feedback container
    let container = tapArea.querySelector('.gesture-feedback-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'gesture-feedback-container';
      tapArea.appendChild(container);
    }

    // Remove the ripple when the animation ends
    ripple.addEventListener('animationend', () => ripple.remove());
    container.appendChild(ripple);
  }
  _onMenuActionClick(idx) {
    var _this$config$actions;
    const action = (_this$config$actions = this.config.actions) === null || _this$config$actions === void 0 ? void 0 : _this$config$actions[idx];
    if (!action) return;
    if (!action.menu_item) {
      this._quickMenuInvoke = true;
    }
    this._onActionChipClick(idx);
    if (!action.menu_item) {
      this._dismissWithAnimation();
    }
  }
  _getActionLabel(action) {
    if (!action) return "";
    const hasName = typeof action.name === "string" && action.name.trim() !== "";
    if (hasName) return action.name.trim();
    const iconOnly = !!action.icon;
    if (action.menu_item) {
      if (iconOnly) return "";
      const menuLabels = {
        "search": "Search",
        "search-recently-played": "Recently Played",
        "search-next-up": "Next Up",
        "source": "Source",
        "more-info": "More Info",
        "group-players": "Group Players",
        "transfer-queue": "Transfer Queue"
      };
      return menuLabels[action.menu_item] ?? action.menu_item;
    }
    if (typeof action.navigation_path === "string" && action.navigation_path.trim() !== "" || action.action === "navigate") {
      return iconOnly ? "" : "Navigate";
    }
    if (action.service) return iconOnly ? "" : action.service;
    return iconOnly ? "" : "Action";
  }
  async _onControlClick(action) {
    var _this$hass25;
    // Use the unified entity resolution system for control actions
    const targetEntity = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    if (!targetEntity) return;
    const stateObj = ((_this$hass25 = this.hass) === null || _this$hass25 === void 0 || (_this$hass25 = _this$hass25.states) === null || _this$hass25 === void 0 ? void 0 : _this$hass25[targetEntity]) || this.currentStateObj;
    switch (action) {
      case "play_pause":
        if (this._isEntityPlaying(stateObj)) {
          this.hass.callService("media_player", "media_pause", {
            entity_id: targetEntity
          });
          // When pausing, set the last playing entity to the one we just paused (per-chip)
          if (!this._lastPlayingEntityIdByChip) this._lastPlayingEntityIdByChip = {};
          this._lastPlayingEntityIdByChip[this._selectedIndex] = targetEntity;
          // Track when we paused to prevent immediate clearing due to state delay
          if (!this._pauseTimestamps) this._pauseTimestamps = {};
          this._pauseTimestamps[this._selectedIndex] = Date.now();
          // Lock controls to this entity during the paused window
          this._controlFocusEntityId = targetEntity;
          // Optimistic toggle to reduce flicker
          this._optimisticPlayback = {
            entity_id: targetEntity,
            state: "paused",
            ts: Date.now()
          };
          this.requestUpdate();
          setTimeout(() => {
            this._optimisticPlayback = null;
            this.requestUpdate();
          }, 1200);
        } else {
          this.hass.callService("media_player", "media_play", {
            entity_id: targetEntity
          });
          // On resume, clear the paused entity tracking since we're now playing
          if (this._lastPlayingEntityIdByChip) {
            delete this._lastPlayingEntityIdByChip[this._selectedIndex];
          }
          if (this._pauseTimestamps) {
            delete this._pauseTimestamps[this._selectedIndex];
          }
          // Lock to the target entity immediately (per-chip)
          this._controlFocusEntityId = targetEntity;
          // Optimistic toggle to reduce flicker
          this._optimisticPlayback = {
            entity_id: targetEntity,
            state: "playing",
            ts: Date.now()
          };
          this.requestUpdate();
          setTimeout(() => {
            this._optimisticPlayback = null;
            this.requestUpdate();
          }, 1200);
        }
        break;
      case "next":
        this.hass.callService("media_player", "media_next_track", {
          entity_id: targetEntity
        });
        break;
      case "prev":
        this.hass.callService("media_player", "media_previous_track", {
          entity_id: targetEntity
        });
        break;
      case "stop":
        this.hass.callService("media_player", "media_stop", {
          entity_id: targetEntity
        });
        if (stateObj) {
          // Set optimistic state for the entity we're actually controlling
          const targetEntityId = targetEntity;
          this._optimisticPlayback = {
            entity_id: targetEntityId,
            state: "idle",
            ts: Date.now()
          };
          // Don't clear debounce on action - let it handle state transitions naturally
          this.requestUpdate();
          setTimeout(() => {
            this._optimisticPlayback = null;
            this.requestUpdate();
          }, 1200);
        }
        break;
      case "shuffle":
        {
          // Toggle shuffle based on current state
          const curr = !!stateObj.attributes.shuffle;
          this.hass.callService("media_player", "shuffle_set", {
            entity_id: targetEntity,
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
            entity_id: targetEntity,
            repeat: next
          });
          break;
        }
      case "power":
        {
          var _this$hass26;
          // Toggle main entity power (physical power behavior)
          const mainId = this.currentEntityId;
          const mainState = ((_this$hass26 = this.hass) === null || _this$hass26 === void 0 || (_this$hass26 = _this$hass26.states) === null || _this$hass26 === void 0 ? void 0 : _this$hass26[mainId]) || stateObj;
          const svc = (mainState === null || mainState === void 0 ? void 0 : mainState.state) === "off" ? "turn_on" : "turn_off";
          this.hass.callService("media_player", svc, {
            entity_id: mainId
          });

          // Also toggle volume_entity if sync_power is enabled for this entity
          const obj = this.entityObjs[this._selectedIndex];
          if (obj && obj.sync_power) {
            const volEntityId = this._getVolumeEntity(this._selectedIndex);
            if (volEntityId && volEntityId !== obj.entity_id) {
              this.hass.callService("media_player", svc, {
                entity_id: volEntityId
              });
            }
          }
          break;
        }
      case "favorite":
        {
          var _this$hass27, _maState$attributes9;
          // Press the associated favorite button entity OR unfavorite if already favorited
          const favoriteButtonEntity = this._getFavoriteButtonEntity();
          const maState = (_this$hass27 = this.hass) === null || _this$hass27 === void 0 || (_this$hass27 = _this$hass27.states) === null || _this$hass27 === void 0 ? void 0 : _this$hass27[targetEntity];
          const mediaContentId = maState === null || maState === void 0 || (_maState$attributes9 = maState.attributes) === null || _maState$attributes9 === void 0 ? void 0 : _maState$attributes9.media_content_id;

          // Check if track is already favorited
          const isCurrentlyFavorited = this._isCurrentTrackFavorited();

          // Check if mass_queue is available for unfavorite functionality
          const hasMassQueue = await this._isMassQueueIntegrationAvailable(this.hass);
          if (isCurrentlyFavorited && hasMassQueue) {
            var _this$_getMusicAssist;
            // Unfavorite using mass_queue
            const maEntityId = (_this$_getMusicAssist = this._getMusicAssistantState()) === null || _this$_getMusicAssist === void 0 ? void 0 : _this$_getMusicAssist.entity_id;
            if (maEntityId) {
              try {
                const message = {
                  type: "call_service",
                  domain: "mass_queue",
                  service: "unfavorite_current_item",
                  service_data: {
                    entity: maEntityId
                  }
                };
                await this.hass.connection.sendMessagePromise(message);

                // Update cache to reflect unfavorited state
                if (mediaContentId) {
                  if (!this._favoriteStatusCache) {
                    this._favoriteStatusCache = {};
                  }
                  this._favoriteStatusCache[mediaContentId] = {
                    isFavorited: false
                  };
                }

                // Clear favorites cache
                if (this._searchResultsByType) {
                  Object.keys(this._searchResultsByType).forEach(key => {
                    if (key.includes('_favorites') || key === 'favorites') {
                      delete this._searchResultsByType[key];
                    }
                  });
                }
                this._checkingFavorites = null;
                this.requestUpdate();
              } catch (error) {
                console.error("yamp: Failed to unfavorite current item:", error);
              }
            }
          } else if (favoriteButtonEntity) {
            // Favorite using button.press (original behavior)
            this.hass.callService("button", "press", {
              entity_id: favoriteButtonEntity
            });

            // Immediately mark as favorited when button is pressed
            if (mediaContentId) {
              // Initialize cache if needed
              if (!this._favoriteStatusCache) {
                this._favoriteStatusCache = {};
              }

              // Immediately set as favorited
              this._favoriteStatusCache[mediaContentId] = {
                isFavorited: true
              };

              // Clear the checking flag
              this._checkingFavorites = null;

              // Clear search results cache to ensure favorites filter reflects changes
              if (this._searchResultsByType) {
                // Clear favorites-related cache entries
                Object.keys(this._searchResultsByType).forEach(key => {
                  if (key.includes('_favorites') || key === 'favorites') {
                    delete this._searchResultsByType[key];
                  }
                });
              }

              // Trigger immediate re-render to update UI
              this.requestUpdate();
            }
          }
          break;
        }
    }
  }

  /**
   * Handles volume change events.
   * With group_volume: false, always sets only the single volume entity, never the group.
   * With group_volume: true/undefined, applies group logic.
   */
  async _onVolumeChange(e) {
    const idx = this._selectedIndex;
    const groupingEntityTemplate = this._getGroupingEntityId(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];
    const newVol = Number(e.target.value);
    const obj = this.entityObjs[idx];

    // Always use group_volume directly from obj
    const groupVolume = typeof obj.group_volume === "boolean" ? obj.group_volume : true;
    if (!groupVolume || this._quickGroupingMode) {
      this.hass.callService("media_player", "volume_set", {
        entity_id: this._getVolumeEntity(idx),
        volume_level: newVol
      });
      return;
    }

    // Group volume logic: ONLY runs if group_volume is true/undefined
    // AND it's a group-capable entity (preset groups are excluded via _isGroupCapable)
    if (this._isCurrentlyGrouped(state)) {
      var _this$currentVolumeSt;
      // Get the main entity and all grouped members (deduplicated)
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [...new Set([mainEntity, ...state.attributes.group_members])];
      const base = typeof this._groupBaseVolume === "number" ? this._groupBaseVolume : Number(((_this$currentVolumeSt = this.currentVolumeStateObj) === null || _this$currentVolumeSt === void 0 ? void 0 : _this$currentVolumeSt.attributes.volume_level) || 0);
      const delta = newVol - base;
      for (const t of targets) {
        for (const obj of this.entityObjs) {
          let resolvedGroupingId;
          if (obj.music_assistant_entity) {
            if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
              // For templates, resolve at action time
              try {
                resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
              } catch (error) {
                resolvedGroupingId = obj.entity_id;
              }
            } else {
              resolvedGroupingId = obj.music_assistant_entity;
            }
          } else {
            resolvedGroupingId = obj.entity_id;
          }
          if (resolvedGroupingId === t) {
            break;
          }
        }

        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + delta;
        v = Math.max(0, Math.min(1, v));
        // Round to 4 decimal places to prevent floating point precision errors
        v = Math.round(v * 10000) / 10000;
        this.hass.callService("media_player", "volume_set", {
          entity_id: volTarget,
          volume_level: v
        });
      }
      this._groupBaseVolume = newVol;
    } else {
      const volumeEntity = this._getVolumeEntity(idx);
      this.hass.callService("media_player", "volume_set", {
        entity_id: volumeEntity,
        volume_level: newVol
      });
    }
  }
  async _onVolumeStep(direction) {
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
    const groupingEntityTemplate = this._getGroupingEntityId(idx);
    const groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
    const state = this.hass.states[groupingEntity];
    if (this._isCurrentlyGrouped(state)) {
      // Grouped: apply group gain step (deduplicated targets)
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [...new Set([mainEntity, ...state.attributes.group_members])];
      // Use configurable step size
      const step = this._volumeStep * direction;
      for (const t of targets) {
        for (const obj of this.entityObjs) {
          let resolvedGroupingId;
          if (obj.music_assistant_entity) {
            if (typeof obj.music_assistant_entity === 'string' && (obj.music_assistant_entity.includes('{{') || obj.music_assistant_entity.includes('{%'))) {
              // For templates, resolve at action time
              try {
                resolvedGroupingId = await this._resolveTemplateAtActionTime(obj.music_assistant_entity, obj.entity_id);
              } catch (error) {
                resolvedGroupingId = obj.entity_id;
              }
            } else {
              resolvedGroupingId = obj.music_assistant_entity;
            }
          } else {
            resolvedGroupingId = obj.entity_id;
          }
          if (resolvedGroupingId === t) {
            break;
          }
        }

        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const st = this.hass.states[volTarget];
        if (!st) continue;
        let v = Number(st.attributes.volume_level || 0) + step;
        v = Math.max(0, Math.min(1, v));
        // Round to 4 decimal places to prevent floating point precision errors
        v = Math.round(v * 10000) / 10000;
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
      // Round to 4 decimal places to prevent floating point precision errors
      current = Math.round(current * 10000) / 10000;
      this.hass.callService("media_player", "volume_set", {
        entity_id: entity,
        volume_level: current
      });
    }
  }
  async _onMuteToggle() {
    const idx = this._selectedIndex;
    const entity = this._getVolumeEntity(idx);
    if (!entity) return;
    const isRemoteVolumeEntity = entity.startsWith && entity.startsWith("remote.");
    const stateObj = this.currentVolumeStateObj;
    if (!stateObj) return;
    const isMuted = stateObj.attributes.is_volume_muted ?? false;
    const currentVolume = stateObj.attributes.volume_level ?? 0;
    if (isRemoteVolumeEntity) {
      // For remote entities, we can't easily toggle mute, so just set volume to 0 or restore
      if (isMuted) {
        // Restore to a reasonable volume if was muted
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0.5
        });
      } else {
        // Mute by setting volume to 0
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0
        });
      }
      return;
    }

    // Check if mute is supported
    const supportsMute = this._supportsFeature(stateObj, SUPPORT_VOLUME_MUTE);
    if (!supportsMute) {
      // If mute is not supported, implement mute by setting volume to 0 and storing previous volume
      if (currentVolume > 0) {
        // Store current volume and mute
        this._previousVolume = currentVolume;
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: 0
        });
      } else {
        // Restore previous volume
        const restoreVolume = this._previousVolume ?? 0.5;
        this.hass.callService("media_player", "volume_set", {
          entity_id: entity,
          volume_level: restoreVolume
        });
        this._previousVolume = null;
      }
      return;
    }
    let groupingEntityTemplate, groupingEntity, state;
    try {
      groupingEntityTemplate = this._getGroupingEntityId(idx);
      groupingEntity = await this._resolveTemplateAtActionTime(groupingEntityTemplate, this.currentEntityId);
      state = this.hass.states[groupingEntity];
    } catch (error) {
      console.error('yamp: Error in grouping detection:', error);
    }
    if (this._isCurrentlyGrouped(state)) {
      // Grouped: apply mute to all group members (deduplicated)
      const mainEntity = this.entityObjs[idx].entity_id;
      const targets = [...new Set([mainEntity, ...state.attributes.group_members])];
      for (const t of targets) {
        // For grouped volume changes, use the same entity that's being used for grouping (the MA entity)
        const volTarget = t; // Use the grouping entity directly
        const targetState = this.hass.states[volTarget];
        const targetSupportsMute = targetState ? this._supportsFeature(targetState, SUPPORT_VOLUME_MUTE) : false;
        if (targetSupportsMute) {
          this.hass.callService("media_player", "volume_mute", {
            entity_id: volTarget,
            is_volume_muted: !isMuted
          });
        } else {
          var _targetState$attribut;
          // For entities that don't support mute, set volume to 0 or restore
          const targetVolume = (targetState === null || targetState === void 0 || (_targetState$attribut = targetState.attributes) === null || _targetState$attribut === void 0 ? void 0 : _targetState$attribut.volume_level) ?? 0;
          if (targetVolume > 0) {
            // Store current volume and mute (simplified - in a real implementation you'd want to store per entity)
            this.hass.callService("media_player", "volume_set", {
              entity_id: volTarget,
              volume_level: 0
            });
          } else {
            // Restore to a reasonable volume
            this.hass.callService("media_player", "volume_set", {
              entity_id: volTarget,
              volume_level: 0.5
            });
          }
        }
      }
    } else {
      // Not grouped, toggle mute directly
      this.hass.callService("media_player", "volume_mute", {
        entity_id: entity,
        is_volume_muted: !isMuted
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
    this.requestUpdate();
  }
  _onGroupVolumeStep(volumeEntity, direction) {
    this.hass.callService("remote", "send_command", {
      entity_id: volumeEntity,
      command: direction > 0 ? "volume_up" : "volume_down"
    });
    this.requestUpdate();
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
  async _onProgressBarClick(e) {
    try {
      var _this$hass28, _this$hass29, _this$hass30;
      e.stopPropagation();
      // For seeking, we want to target the entity that is actually playing
      const mainId = this.currentEntityId;
      const maId = this._getActualResolvedMaEntityForState(this._selectedIndex);
      const mainState = mainId ? (_this$hass28 = this.hass) === null || _this$hass28 === void 0 || (_this$hass28 = _this$hass28.states) === null || _this$hass28 === void 0 ? void 0 : _this$hass28[mainId] : null;
      const maState = maId ? (_this$hass29 = this.hass) === null || _this$hass29 === void 0 || (_this$hass29 = _this$hass29.states) === null || _this$hass29 === void 0 ? void 0 : _this$hass29[maId] : null;
      let targetEntity;
      if (this._controlFocusEntityId && (this._controlFocusEntityId === maId || this._controlFocusEntityId === mainId)) {
        targetEntity = this._controlFocusEntityId;
      } else if (this._isEntityPlaying(maState)) {
        targetEntity = maId;
      } else if (this._isEntityPlaying(mainState)) {
        targetEntity = mainId;
      } else {
        var _this$_lastPlayingEnt3;
        // When neither is playing, prefer the last playing entity for better resume behavior
        const lastPlayingForChip = (_this$_lastPlayingEnt3 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt3 === void 0 ? void 0 : _this$_lastPlayingEnt3[this._selectedIndex];
        if (lastPlayingForChip && (lastPlayingForChip === maId || lastPlayingForChip === mainId)) {
          targetEntity = lastPlayingForChip;
        } else {
          // Fallback to the configured playback entity
          const entityTemplate = this._getPlaybackEntityId(this._selectedIndex);
          targetEntity = await this._resolveTemplateAtActionTime(entityTemplate, this.currentEntityId);
        }
      }
      const stateObj = ((_this$hass30 = this.hass) === null || _this$hass30 === void 0 || (_this$hass30 = _this$hass30.states) === null || _this$hass30 === void 0 ? void 0 : _this$hass30[targetEntity]) || this.currentStateObj;
      if (!targetEntity || !stateObj || !stateObj.attributes) {
        console.warn("YAMP: Cannot seek - invalid target or state", targetEntity, stateObj);
        return;
      }
      const duration = stateObj.attributes.media_duration;
      if (!duration) return;
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const seekTime = Math.floor(percent * duration);

      // Optimistically update local progress position via offset strategy

      // Optimistically update local progress position via Simulated Playback
      // We ignore backend position entirely and simulate playback from the seek point
      this._seekAnchor = {
        position: seekTime,
        timestamp: Date.now(),
        trackId: stateObj.attributes.media_content_id || stateObj.attributes.media_title
      };
      // Lock convergence check for 2 seconds to avoid accidental sync with lagging backend
      this._seekConvergenceLock = Date.now() + 2000;
      this._seekOffset = null; // Clear old offset if any

      // Force immediate update
      this.requestUpdate();
      this.hass.callService("media_player", "media_seek", {
        entity_id: targetEntity,
        seek_position: seekTime
      });
    } catch (err) {
      console.error("YAMP: Error in _onProgressBarClick", err);
    }
  }
  render() {
    var _this$_optimisticPlay, _this$hass31, _this$_lastPlayingEnt4, _this$_lastPlayingEnt5, _this$_playbackLinger3, _this$config$entities, _this$_lastPlayingEnt6, _this$_maResolveCache5, _this$_playbackLinger4, _this$hass32, _finalPlaybackStateOb, _finalPlaybackStateOb2, _finalPlaybackStateOb3, _displaySource$attrib, _displaySource$attrib2, _displaySource$attrib3, _displaySource$attrib4, _displaySource$attrib5, _displaySource$attrib6, _displaySource$attrib8, _displaySource$attrib9, _this$currentVolumeSt2, _this$shadowRoot3, _this$currentVolumeSt3, _this$config13, _this$config14, _this$config15, _this$config16;
    if (!this.hass || !this.config) return E;
    const customCardHeightInput = this.config.card_height;
    const customCardHeight = typeof customCardHeightInput === "string" ? customCardHeightInput : Number(customCardHeightInput);
    const isValidCardHeightNumber = typeof customCardHeight === "number" && Number.isFinite(customCardHeight) && customCardHeight > 0;
    const hasCustomCardHeight = isValidCardHeightNumber || typeof customCardHeight === "string" && customCardHeight.trim() !== "";
    const collapsedBaselineHeight = this._collapsedBaselineHeight || 220;
    const hasSingleEntity = this.entityObjs.length === 1;
    const isMinHeight = hasSingleEntity && this.config.always_collapsed === true && this.config.expand_on_search !== true;
    const effectivePinHeaders = this.config.pin_search_headers === true && !isMinHeight;
    const showSearchHeaders = !(this.config.hide_search_headers_on_idle === true && this._isIdle);
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
      this.shadowRoot.host.setAttribute("data-always-collapsed", String(this.config.always_collapsed === true));
      const forceHideMenuPlayer = this.config.always_collapsed === true && this.config.pin_search_headers === true && this.config.expand_on_search === true;
      this.shadowRoot.host.setAttribute("data-hide-menu-player", String(this.config.hide_menu_player === true || forceHideMenuPlayer));
      this.shadowRoot.host.setAttribute("data-extend-artwork", String(this.config.extend_artwork === true));
      this.shadowRoot.host.setAttribute("data-control-layout", this._controlLayout);
      this.shadowRoot.host.setAttribute("data-pin-search-headers", String(effectivePinHeaders));
      if (hasCustomCardHeight) {
        this.shadowRoot.host.setAttribute("data-has-custom-height", "true");
      } else {
        this.shadowRoot.host.removeAttribute("data-has-custom-height");
      }
    }
    const showChipRow = this.config.show_chip_row || "auto";
    const hasMultipleEntities = this.entityObjs.length > 1;
    // Show chips in menu if explicitly set to in_menu, or if in_menu_on_idle and currently idle
    const showChipsInMenu = (showChipRow === "in_menu" || showChipRow === "in_menu_on_idle" && this._isIdle) && hasMultipleEntities;
    // Always render chip row for in_menu_on_idle to preserve height, but hide visually when idle
    const showChipsInline = showChipRow !== "in_menu" && (hasMultipleEntities || showChipRow === "always");
    // Hide chips visually (but keep space) when in_menu_on_idle mode is active and card is idle
    const chipsHiddenInline = showChipRow === "in_menu_on_idle" && this._isIdle && hasMultipleEntities;
    // Always reserve space in menu for chips when in_menu_on_idle, even when playing (to prevent menu jump)
    const reserveChipSpaceInMenu = showChipRow === "in_menu_on_idle" && hasMultipleEntities;
    const decoratedActions = (this.config.actions ?? []).map((action, idx) => ({
      action,
      idx
    }));
    // Filter out sync_selected_entity actions entirely - they don't render as chips
    const visibleActions = decoratedActions.filter(_ref4 => {
      let {
        action
      } = _ref4;
      return (action === null || action === void 0 ? void 0 : action.action) !== "sync_selected_entity";
    });

    // Action placement logic
    const getPlacement = act => {
      if (act !== null && act !== void 0 && act.placement) return act.placement;
      if ((act === null || act === void 0 ? void 0 : act.in_menu) === "hidden") return "hidden";
      return (act === null || act === void 0 ? void 0 : act.in_menu) === true ? "menu" : "chip";
    };
    const rowActions = visibleActions.filter(_ref5 => {
      let {
        action
      } = _ref5;
      return getPlacement(action) === "chip";
    });
    const menuOnlyActions = visibleActions.filter(_ref6 => {
      let {
        action
      } = _ref6;
      return getPlacement(action) === "menu";
    });

    // Gesture trigger logic
    const tapAction = visibleActions.find(_ref7 => {
      let {
        action
      } = _ref7;
      return (action === null || action === void 0 ? void 0 : action.card_trigger) === "tap";
    });
    const holdAction = visibleActions.find(_ref8 => {
      let {
        action
      } = _ref8;
      return (action === null || action === void 0 ? void 0 : action.card_trigger) === "hold";
    });
    const doubleTapAction = visibleActions.find(_ref9 => {
      let {
        action
      } = _ref9;
      return (action === null || action === void 0 ? void 0 : action.card_trigger) === "double_tap";
    });
    const swipeLeftAction = visibleActions.find(_ref0 => {
      let {
        action
      } = _ref0;
      return (action === null || action === void 0 ? void 0 : action.card_trigger) === "swipe_left";
    });
    const swipeRightAction = visibleActions.find(_ref1 => {
      let {
        action
      } = _ref1;
      return (action === null || action === void 0 ? void 0 : action.card_trigger) === "swipe_right";
    });
    this._cardTriggers = {
      tap: tapAction === null || tapAction === void 0 ? void 0 : tapAction.action,
      hold: holdAction === null || holdAction === void 0 ? void 0 : holdAction.action,
      double_tap: doubleTapAction === null || doubleTapAction === void 0 ? void 0 : doubleTapAction.action,
      swipe_left: swipeLeftAction === null || swipeLeftAction === void 0 ? void 0 : swipeLeftAction.action,
      swipe_right: swipeRightAction === null || swipeRightAction === void 0 ? void 0 : swipeRightAction.action
    };
    const stateObj = this.currentActivePlaybackStateObj || this.currentPlaybackStateObj || this.currentStateObj;
    const activeChipName = this.getChipName(this.currentEntityId);
    if (!stateObj) return x`<div class="details">${localize('common.not_found')}</div>`;
    const currentHiddenControls = this._getHiddenControlsForCurrentEntity();
    const showFavoriteButton = !!this._getFavoriteButtonEntity() && !currentHiddenControls.favorite;
    const favoriteActive = this._isCurrentTrackFavorited();
    const powerSupported = !currentHiddenControls.power && (this._supportsFeature(stateObj, SUPPORT_TURN_OFF) || this._supportsFeature(stateObj, SUPPORT_TURN_ON));
    const showModernPowerButton = this._controlLayout === "modern" && powerSupported;
    const showModernFavoriteButton = this._controlLayout === "modern" && showFavoriteButton;
    let leadingVolumeControl = E;
    if (showModernPowerButton) {
      leadingVolumeControl = x`
          <button
            class="volume-icon-btn favorite-volume-btn${(stateObj === null || stateObj === void 0 ? void 0 : stateObj.state) !== "off" ? " active" : ""}"
            @click=${() => this._onControlClick("power")}
            title="${localize('common.power')}"
          >
            <ha-icon .icon=${"mdi:power"}></ha-icon>
          </button>
        `;
    } else if (this._controlLayout === "modern") {
      leadingVolumeControl = x`
          <button
            class="volume-icon-btn favorite-volume-btn"
            @click=${() => this._openQuickSearchOverlay()}
            title="${localize('common.search')}"
          >
            <ha-icon .icon=${"mdi:magnify"}></ha-icon>
          </button>
        `;
    }
    const rightSlotTemplate = showModernFavoriteButton ? x`
        <button
          class="volume-icon-btn favorite-volume-btn${favoriteActive ? " active" : ""}"
          @click=${() => this._onControlClick("favorite")}
          title="${localize('common.favorite')}"
        >
          <ha-icon
            style=${favoriteActive ? "color: var(--custom-accent);" : E}
            .icon=${favoriteActive ? "mdi:heart" : "mdi:heart-outline"}
          ></ha-icon>
        </button>
      ` : E;

    // Collect unique, sorted first letters of source names
    const sourceList = stateObj.attributes.source_list || [];
    const availableSourceFirstLetters = new Set(sourceList.map(s => s && s[0] ? s[0].toUpperCase() : ""));
    const sourceLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    if (this._idleImageTemplate && this._idleImageTemplateNeedsResolve && !this._resolvingIdleImageTemplate && this._isIdle) {
      void this._resolveIdleImageTemplate();
    }
    // Idle image "picture frame" mode when idle
    const rawIdleImageInput = this._idleImageTemplate ? this._idleImageTemplateResult : this.config.idle_image;
    const normalizedIdleImageInput = this._normalizeImageSourceValue(rawIdleImageInput);
    let idleImageUrl = null;
    if (normalizedIdleImageInput && this._isIdle) {
      // Check if it's an entity ID
      if (this.hass.states[normalizedIdleImageInput]) {
        const sensorState = this.hass.states[normalizedIdleImageInput];
        idleImageUrl = sensorState.attributes.entity_picture_local || sensorState.attributes.entity_picture || (sensorState.state && sensorState.startsWith("http") ? sensorState.state : null);
      }
      // Check if it's a direct URL or file path
      else if (normalizedIdleImageInput.startsWith("http") || normalizedIdleImageInput.startsWith("/")) {
        idleImageUrl = normalizedIdleImageInput;
      }
    }
    const dimIdleFrame = !!idleImageUrl;
    const hideControlsNow = this._isIdle;
    const shouldDimIdle = this._isIdle;
    // Calculate useInsetArtwork early for artworkFullBleed unification
    // Note: collapsed and _alwaysCollapsed will be defined/checked later, so we can't use them here.
    // We'll set useInsetArtwork again later with full collapsed context for rendering.
    const preCalcInsetArtwork = this._artworkObjectFit === "scaled-contain";
    // Extend artwork when configured, when chips are hidden inline (in_menu_on_idle + idle), or when using scaled-contain
    const artworkFullBleed = this.config.extend_artwork === true || chipsHiddenInline || preCalcInsetArtwork;

    // Calculate shuffle/repeat state from the active playback entity when available
    const mainStateForPlayback = this.currentStateObj;
    this.currentPlaybackStateObj;
    ((_this$_optimisticPlay = this._optimisticPlayback) === null || _this$_optimisticPlay === void 0 ? void 0 : _this$_optimisticPlay.entity_id) || null;

    // --- Fix 2: priority rule for entity selection ---
    // Keep the currently‑selected entity (even if paused)
    // unless some other entity is *playing*.
    // Use cached resolved MA ID instead of raw template string
    this._getResolvedPlaybackEntityIdSync(this._selectedIndex);
    // Also get the actual resolved MA entity for state detection (can be unconfigured)
    const actualResolvedMaId = this._getActualResolvedMaEntityForState(this._selectedIndex);
    const actualMaState = actualResolvedMaId ? (_this$hass31 = this.hass) === null || _this$hass31 === void 0 || (_this$hass31 = _this$hass31.states) === null || _this$hass31 === void 0 ? void 0 : _this$hass31[actualResolvedMaId] : null;

    // Update state tracking for optimistic playback and set/clear MA linger window
    const prevMain = this._lastMainState;
    const prevMa = this._lastMaState;
    this._lastMainState = mainStateForPlayback === null || mainStateForPlayback === void 0 ? void 0 : mainStateForPlayback.state;
    this._lastMaState = actualMaState === null || actualMaState === void 0 ? void 0 : actualMaState.state;
    const idx = this._selectedIndex;

    // If MA just transitioned from playing -> not playing, start a linger window (permanent until something else plays)
    if (prevMa === "playing" && this._lastMaState !== "playing") {
      var _this$config11;
      const ttl = Math.max(Number(this._idleTimeoutMs || ((_this$config11 = this.config) === null || _this$config11 === void 0 ? void 0 : _this$config11.idle_timeout_ms) || 60000), 500);
      this._playbackLingerByIdx[idx] = {
        entityId: actualResolvedMaId,
        until: Date.now() + ttl
      };
    }
    // Also set linger when MA entity is paused (regardless of previous state) to ensure UI stays on MA

    // Set linger when MA entity transitions to paused OR when main entity transitions to paused and was last controlled
    const shouldSetLinger = prevMa === "playing" && this._lastMaState === "paused" && ((_this$_lastPlayingEnt4 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt4 === void 0 ? void 0 : _this$_lastPlayingEnt4[idx]) === actualResolvedMaId || prevMain === "playing" && this._lastMainState === "paused" && ((_this$_lastPlayingEnt5 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt5 === void 0 ? void 0 : _this$_lastPlayingEnt5[idx]) === (mainStateForPlayback === null || mainStateForPlayback === void 0 ? void 0 : mainStateForPlayback.entity_id);
    if (shouldSetLinger) {
      var _this$config12;
      // Use the last controlled entity for the linger (main entity if main was controlled, MA entity if MA was controlled)
      const lingerEntityId = this._lastPlayingEntityIdByChip[idx];
      const ttl = Math.max(Number(this._idleTimeoutMs || ((_this$config12 = this.config) === null || _this$config12 === void 0 ? void 0 : _this$config12.idle_timeout_ms) || 60000), 500);
      this._playbackLingerByIdx[idx] = {
        entityId: lingerEntityId,
        // Use cached MA entity or last controlled entity
        until: Date.now() + ttl
      };
    }
    // If MA resumed playing, clear linger
    if (this._lastMaState === "playing" && (_this$_playbackLinger3 = this._playbackLingerByIdx) !== null && _this$_playbackLinger3 !== void 0 && _this$_playbackLinger3[idx]) {
      delete this._playbackLingerByIdx[idx];
    }
    // Only clear linger if main entity is playing AND MA entity is not the last controlled entity
    const maEntityId = (_this$config$entities = this.config.entities[idx]) === null || _this$config$entities === void 0 ? void 0 : _this$config$entities.music_assistant_entity;
    const currentResolvedMaId = this._getEntityForPurpose(idx, 'ma_resolve');
    const lastControlled = (_this$_lastPlayingEnt6 = this._lastPlayingEntityIdByChip) === null || _this$_lastPlayingEnt6 === void 0 ? void 0 : _this$_lastPlayingEnt6[idx];
    const cachedResolvedMaId = (_this$_maResolveCache5 = this._maResolveCache) === null || _this$_maResolveCache5 === void 0 || (_this$_maResolveCache5 = _this$_maResolveCache5[idx]) === null || _this$_maResolveCache5 === void 0 ? void 0 : _this$_maResolveCache5.id;
    const isLastControlledMa = !!(lastControlled && (lastControlled === cachedResolvedMaId || lastControlled === currentResolvedMaId || lastControlled === maEntityId || lastControlled === actualResolvedMaId));
    if (this._lastMainState === "playing" && (_this$_playbackLinger4 = this._playbackLingerByIdx) !== null && _this$_playbackLinger4 !== void 0 && _this$_playbackLinger4[idx] && !isLastControlledMa) {
      delete this._playbackLingerByIdx[idx];
    }

    // Use the unified entity resolution system for playback state
    const playbackEntityId = this._getEntityForPurpose(this._selectedIndex, 'playback_control');
    const playbackStateObj = (_this$hass32 = this.hass) === null || _this$hass32 === void 0 || (_this$hass32 = _this$hass32.states) === null || _this$hass32 === void 0 ? void 0 : _this$hass32[playbackEntityId];

    // Use the unified entity resolution system for playback state
    const finalPlaybackStateObj = playbackStateObj;

    // Keep finalEntityId for backward compatibility with existing code
    const finalEntityId = playbackEntityId;
    // Blend in optimistic playback state if present
    finalPlaybackStateObj === null || finalPlaybackStateObj === void 0 ? void 0 : finalPlaybackStateObj.state;
    if (this._optimisticPlayback) {
      // Only apply optimistic state if it matches the current playback entity
      const optimisticEntityId = this._optimisticPlayback.entity_id;
      const currentEntityId = finalEntityId;
      if (optimisticEntityId === currentEntityId) {
        this._optimisticPlayback.state;
      }
    }
    const shuffleActive = !!(finalPlaybackStateObj !== null && finalPlaybackStateObj !== void 0 && (_finalPlaybackStateOb = finalPlaybackStateObj.attributes) !== null && _finalPlaybackStateOb !== void 0 && _finalPlaybackStateOb.shuffle);
    const repeatActive = (finalPlaybackStateObj === null || finalPlaybackStateObj === void 0 || (_finalPlaybackStateOb2 = finalPlaybackStateObj.attributes) === null || _finalPlaybackStateOb2 === void 0 ? void 0 : _finalPlaybackStateOb2.repeat) && (finalPlaybackStateObj === null || finalPlaybackStateObj === void 0 || (_finalPlaybackStateOb3 = finalPlaybackStateObj.attributes) === null || _finalPlaybackStateOb3 === void 0 ? void 0 : _finalPlaybackStateOb3.repeat) !== "off";

    // Artwork and idle logic
    // When idle_timeout_ms=0, always show content regardless of idle state
    const isPlaying = this._idleTimeoutMs === 0 ? this._isEntityPlaying(playbackStateObj) : !this._isIdle && this._isEntityPlaying(playbackStateObj);
    // Artwork keeps using the visible main entity's artwork when available; fallback to playback entity if main has none
    const mainState = this.currentStateObj;
    const mainArtwork = this._getArtworkUrl(mainState);
    const playbackArtwork = this._getArtworkUrl(playbackStateObj);
    const isRealArtwork = this._idleTimeoutMs === 0 ? isPlaying && ((mainArtwork === null || mainArtwork === void 0 ? void 0 : mainArtwork.url) || (playbackArtwork === null || playbackArtwork === void 0 ? void 0 : playbackArtwork.url)) : !this._isIdle && isPlaying && ((mainArtwork === null || mainArtwork === void 0 ? void 0 : mainArtwork.url) || (playbackArtwork === null || playbackArtwork === void 0 ? void 0 : playbackArtwork.url));
    isRealArtwork ? (mainArtwork === null || mainArtwork === void 0 ? void 0 : mainArtwork.url) || (playbackArtwork === null || playbackArtwork === void 0 ? void 0 : playbackArtwork.url) : null;
    // Details
    // When idle_timeout_ms=0, always show title/artist if available, regardless of playing state
    const shouldShowDetails = this._idleTimeoutMs === 0 ? true : isPlaying;
    // For display-only fields, fall back to mainState when playback state is unavailable
    const displaySource = finalPlaybackStateObj || mainState;
    const title = shouldShowDetails ? (displaySource === null || displaySource === void 0 || (_displaySource$attrib = displaySource.attributes) === null || _displaySource$attrib === void 0 ? void 0 : _displaySource$attrib.media_title) || "" : "";
    const artist = shouldShowDetails ? (displaySource === null || displaySource === void 0 || (_displaySource$attrib2 = displaySource.attributes) === null || _displaySource$attrib2 === void 0 ? void 0 : _displaySource$attrib2.media_artist) || (displaySource === null || displaySource === void 0 || (_displaySource$attrib3 = displaySource.attributes) === null || _displaySource$attrib3 === void 0 ? void 0 : _displaySource$attrib3.media_series_title) || (displaySource === null || displaySource === void 0 || (_displaySource$attrib4 = displaySource.attributes) === null || _displaySource$attrib4 === void 0 ? void 0 : _displaySource$attrib4.app_name) || "" : "";
    this._lastTitleLength = title ? title.length : 0;
    if (this._adaptiveText) {
      this._updateAdaptiveTextScale(true);
    }
    let pos = (displaySource === null || displaySource === void 0 || (_displaySource$attrib5 = displaySource.attributes) === null || _displaySource$attrib5 === void 0 ? void 0 : _displaySource$attrib5.media_position) || 0;
    const duration = (displaySource === null || displaySource === void 0 || (_displaySource$attrib6 = displaySource.attributes) === null || _displaySource$attrib6 === void 0 ? void 0 : _displaySource$attrib6.media_duration) || 0;

    // Calculate raw backend position
    let rawBackendPos = pos;
    if (isPlaying && displaySource) {
      var _displaySource$attrib7;
      const updatedAt = (_displaySource$attrib7 = displaySource.attributes) !== null && _displaySource$attrib7 !== void 0 && _displaySource$attrib7.media_position_updated_at ? Date.parse(displaySource.attributes.media_position_updated_at) : displaySource.last_changed ? Date.parse(displaySource.last_changed) : Date.now();
      const elapsed = (Date.now() - updatedAt) / 1000;
      rawBackendPos += elapsed;
    }

    // Apply persistent seek simulation if valid
    const currentTrackId = (displaySource === null || displaySource === void 0 || (_displaySource$attrib8 = displaySource.attributes) === null || _displaySource$attrib8 === void 0 ? void 0 : _displaySource$attrib8.media_content_id) || (displaySource === null || displaySource === void 0 || (_displaySource$attrib9 = displaySource.attributes) === null || _displaySource$attrib9 === void 0 ? void 0 : _displaySource$attrib9.media_title);
    const now = Date.now();
    if (this._seekAnchor && this._seekAnchor.trackId === currentTrackId) {
      // Calculated simulated position
      let simulatedPos = this._seekAnchor.position;
      if (isPlaying) {
        simulatedPos += (now - this._seekAnchor.timestamp) / 1000;
      }

      // Check for convergence
      const lockedOut = this._seekConvergenceLock && now < this._seekConvergenceLock;
      const diff = Math.abs(rawBackendPos - simulatedPos);

      // If backend is close to simulated pos, we are synced
      if (!lockedOut && diff < 2) {
        // Backend caught up! Clear anchor.
        this._seekAnchor = null;
        this._seekConvergenceLock = null;
        pos = rawBackendPos;
      } else {
        // Use simulated pos
        pos = simulatedPos;
      }
    } else {
      // No anchor or track changed
      this._seekAnchor = null;
      this._seekConvergenceLock = null;
      pos = rawBackendPos;
    }
    const progress = duration ? Math.min(1, pos / duration) : 0;

    // Volume entity determination
    const entity = this._getVolumeEntity(idx);
    const isRemoteVolumeEntity = entity && entity.startsWith && entity.startsWith("remote.");

    // Volume
    const vol = Number(((_this$currentVolumeSt2 = this.currentVolumeStateObj) === null || _this$currentVolumeSt2 === void 0 ? void 0 : _this$currentVolumeSt2.attributes.volume_level) || 0);
    const showSlider = this.config.volume_mode !== "stepper";

    // Collapse artwork/details on idle if configured and/or always_collapsed
    // If expand on search is enabled and search is open, force expanded state
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
      collapsed = false;
    } else {
      collapsed = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    }
    const collapsedExtraSpace = collapsed && this._alwaysCollapsed && hasCustomCardHeight ? Math.max(0, customCardHeight - collapsedBaselineHeight) : 0;
    const chipRowReserve = collapsed && showChipsInline ? 48 : 0;
    const actionRowReserve = collapsed && rowActions.length > 0 ? 40 : 0;
    const reservedTopSpace = chipRowReserve + actionRowReserve;
    const baseDetailsMinHeight = 48;
    const effectiveExtraSpace = Math.max(0, collapsedExtraSpace - reservedTopSpace);
    const collapsedArtworkSize = collapsedExtraSpace > 0 ? Math.min(240, 102 + effectiveExtraSpace * 0.75) : 102;
    const detailGrowth = effectiveExtraSpace > 0 ? Math.min(effectiveExtraSpace * 0.45, 96) : 0;
    const collapsedDetailsMinHeight = effectiveExtraSpace > 0 ? Math.round(baseDetailsMinHeight + detailGrowth) : baseDetailsMinHeight;
    const detailsMinHeight = collapsed ? collapsedDetailsMinHeight : baseDetailsMinHeight;
    const controlSpacerSize = effectiveExtraSpace > 0 ? Math.max(0, effectiveExtraSpace - detailGrowth) : 0;
    let showCollapsedPlaceholder = false;
    const expandedHeightBaseline = 350;
    const resolvedCollapsedHeight = collapsed ? hasCustomCardHeight ? customCardHeight : this._collapsedBaselineHeight || 220 : expandedHeightBaseline;
    const meetsPersistentHeight = resolvedCollapsedHeight >= expandedHeightBaseline;
    const shouldShowPersistentControls = this.config.hide_menu_player === true ? false : !collapsed || meetsPersistentHeight;
    const releaseControlsRow = controlSpacerSize >= 48;
    const collapsedDetailsOffset = collapsedExtraSpace > 0 ? Math.max(100, Math.round(collapsedArtworkSize + 24 + Math.min(40, collapsedExtraSpace * 0.12))) : null;
    const collapsedControlsOffset = releaseControlsRow ? 0 : collapsedDetailsOffset ?? 0;
    let cardWidth = this.offsetWidth || (((_this$shadowRoot3 = this.shadowRoot) === null || _this$shadowRoot3 === void 0 || (_this$shadowRoot3 = _this$shadowRoot3.host) === null || _this$shadowRoot3 === void 0 ? void 0 : _this$shadowRoot3.offsetWidth) ?? 0);
    const widthScale = cardWidth > 380 ? Math.min(1.6, 1 + (cardWidth - 380) / 520) : 1;
    const heightScale = collapsedExtraSpace > 0 ? Math.min(1.45, 1 + effectiveExtraSpace / 180) : 1;
    const titleScale = heightScale > 1 || widthScale > 1 ? Math.min(1.6, Math.max(heightScale, widthScale)) : 1;
    const artistScale = Math.min(1.5, Math.max(heightScale * 0.92, widthScale * 0.92));
    if (this.shadowRoot && this.shadowRoot.host) {
      if (collapsedExtraSpace > 0) {
        if (collapsedDetailsOffset != null) {
          this.shadowRoot.host.style.setProperty('--yamp-collapsed-details-offset', `${collapsedDetailsOffset}px`);
        }
        this.shadowRoot.host.style.setProperty('--yamp-collapsed-controls-offset', `${collapsedControlsOffset}px`);
        this.shadowRoot.host.style.setProperty('--yamp-collapsed-title-scale', titleScale.toFixed(3));
        this.shadowRoot.host.style.setProperty('--yamp-collapsed-artist-scale', artistScale.toFixed(3));
      }
      this.shadowRoot.host.style.setProperty('--yamp-collapsed-title-scale', titleScale.toFixed(3));
      this.shadowRoot.host.style.setProperty('--yamp-collapsed-artist-scale', artistScale.toFixed(3));
      if (!(collapsedExtraSpace > 0 && hasCustomCardHeight)) {
        this.shadowRoot.host.style.removeProperty('--yamp-collapsed-controls-offset');
        this.shadowRoot.host.style.removeProperty('--yamp-collapsed-details-offset');
      }
      if (shouldShowPersistentControls) {
        this.shadowRoot.host.removeAttribute('data-hide-persistent-controls');
      } else {
        this.shadowRoot.host.setAttribute('data-hide-persistent-controls', 'true');
      }
    }
    // Use null if idle or no artwork available
    let artworkUrl = null;
    let artworkSizePercentage = null;
    let artworkObjectFit = this._artworkObjectFit;
    if (!this._isIdle) {
      // Use the unified entity resolution system for artwork
      const playbackArtwork = this._getArtworkUrl(playbackStateObj);
      const mainArtwork = this._getArtworkUrl(mainState);
      const artwork = playbackArtwork !== null && playbackArtwork !== void 0 && playbackArtwork.url ? playbackArtwork : mainArtwork;
      artworkUrl = (artwork === null || artwork === void 0 ? void 0 : artwork.url) || null;
      artworkSizePercentage = artwork === null || artwork === void 0 ? void 0 : artwork.sizePercentage;
      if (artwork !== null && artwork !== void 0 && artwork.objectFit) {
        artworkObjectFit = artwork.objectFit;
      }
    }
    showCollapsedPlaceholder = collapsed && !artworkUrl && !idleImageUrl && effectiveExtraSpace >= 40;

    // Dominant color extraction for collapsed artwork
    if (collapsed && artworkUrl && artworkUrl !== this._lastArtworkUrl) {
      this._extractDominantColor(artworkUrl).then(color => {
        this._collapsedArtDominantColor = color;
        this.requestUpdate();
      });
      this._lastArtworkUrl = artworkUrl;
    }
    const idleMinHeight = hideControlsNow ? collapsed ? this._collapsedBaselineHeight || 220 : 325 : null;
    this._lastRenderedCollapsed = collapsed;
    this._lastRenderedHideControls = hideControlsNow;
    const activeArtworkFit = artworkObjectFit || this._artworkObjectFit;
    const useInsetArtwork = activeArtworkFit === "scaled-contain" && !collapsed && !this._alwaysCollapsed;
    // Add top padding to artwork spacer when scaled-contain and chips are not shown inline
    const needsArtworkTopPadding = activeArtworkFit === "scaled-contain" && (showChipRow === "in_menu" || hasSingleEntity && showChipRow !== "always");
    const fitBehavior = this._getBackgroundSizeForFit(activeArtworkFit);
    let backgroundSize = fitBehavior;
    if (artworkSizePercentage) {
      backgroundSize = `${artworkSizePercentage}%`;
    }
    const backgroundImageValue = idleImageUrl ? `url('${idleImageUrl}')` : artworkUrl ? `url('${artworkUrl}')` : "none";
    const hasBackgroundImage = backgroundImageValue !== "none";
    const backgroundFilter = artworkUrl && (collapsed || useInsetArtwork) ? "blur(18px) brightness(0.7) saturate(1.15)" : "none";
    const sharedBackgroundStyle = [`background-image: ${backgroundImageValue}`, `background-size: ${useInsetArtwork ? "cover" : backgroundSize}`, `background-position: ${this.config.artwork_position || "top center"}`, "background-repeat: no-repeat", `filter: ${backgroundFilter}`].join('; ');
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.style.setProperty('--yamp-artwork-fit', activeArtworkFit);
      this.shadowRoot.host.style.setProperty('--yamp-artwork-bg-size', backgroundSize);
    }
    return x`
        <ha-card class="yamp-card" style=${hasCustomCardHeight && (!collapsed || this._alwaysCollapsed) ? `height:${customCardHeight}px;` : E}>
          <div
            data-match-theme="${String(this.config.match_theme === true)}"
            class=${e({
      "yamp-card-inner": true,
      "dim-idle": shouldDimIdle,
      "no-chip-dim": this.config.dim_chips_on_idle === false
    })}
          >
            ${artworkFullBleed && hasBackgroundImage ? x`
              <div class="full-bleed-artwork-bg" style="${sharedBackgroundStyle}"></div>
              ${!dimIdleFrame ? x`<div class="full-bleed-artwork-fade"></div>` : E}
            ` : E}
            ${chipsHiddenInline ? x`${this._renderInlineActionRow(rowActions)}${this._renderInlineChipRow(showChipsInline, chipsHiddenInline)}` : x`${this._renderInlineChipRow(showChipsInline, chipsHiddenInline)}${this._renderInlineActionRow(rowActions)}`}
            <div class="card-lower-content-container" style="${idleMinHeight ? `min-height:${idleMinHeight}px;` : ''}">
              <div class="card-lower-content-bg"
                style="${(() => {
      const styles = [];
      if (!(artworkFullBleed && hasBackgroundImage)) {
        styles.push(sharedBackgroundStyle);
      } else {
        styles.push('background-image: none', 'filter: none');
      }
      styles.push(`min-height: ${collapsed ? hideControlsNow ? `${this._collapsedBaselineHeight || 220}px` : '0px' : hideControlsNow ? '350px' : '350px'}`);
      styles.push('transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s');
      return styles.join('; ');
    })()}"
              ></div>
              ${!dimIdleFrame ? x`<div class="card-lower-fade"></div>` : E}
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}${collapsed && artworkUrl ? ' has-artwork' : ''}" style="${(() => {
      if (!hideControlsNow) return '';
      return collapsed ? `min-height: ${this._collapsedBaselineHeight || 220}px;` : 'min-height: 350px;';
    })()}">
                ${collapsed && artworkUrl && this._isValidArtworkUrl(artworkUrl) ? x`
                  <div
                    class="collapsed-artwork-container"
                    @pointerdown=${e => this._onTapAreaPointerDown(e)}
                    @pointermove=${e => this._onTapAreaPointerMove(e)}
                    @pointerup=${e => this._onTapAreaPointerUp(e)}
                    @pointercancel=${() => {
      this._gestureActive = false;
      clearTimeout(this._gestureHoldTimer);
    }}
                    style="${[`background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%)`, collapsedExtraSpace > 0 ? `width:${Math.round(collapsedArtworkSize + 8)}px` : '', this._cardTriggers.tap || this._cardTriggers.hold || this._cardTriggers.double_tap || this._cardTriggers.swipe_left || this._cardTriggers.swipe_right ? 'cursor:pointer; pointer-events:auto;' : ''].filter(Boolean).join('; ')}"
                  >
                    <img
                      class="collapsed-artwork"
                      src="${artworkUrl}" 
                      style="${[this._getCollapsedArtworkStyle(), collapsedExtraSpace > 0 ? `width:${Math.round(collapsedArtworkSize)}px; height:${Math.round(collapsedArtworkSize)}px;` : ''].filter(Boolean).join(' ')}" 
                      onload="this.style.display='block'"
                      onerror="this.style.display='none'" />
                  </div>
                ` : E}
                ${showCollapsedPlaceholder || !collapsed ? x`
                  <div class="card-artwork-spacer${showCollapsedPlaceholder ? ' show-placeholder' : ''}"
                    @pointerdown=${e => this._onTapAreaPointerDown(e)}
                    @pointermove=${e => this._onTapAreaPointerMove(e)}
                    @pointerup=${e => this._onTapAreaPointerUp(e)}
                    @pointercancel=${() => {
      this._gestureActive = false;
      clearTimeout(this._gestureHoldTimer);
    }}
                    style="${this._cardTriggers.tap || this._cardTriggers.hold || this._cardTriggers.double_tap || this._cardTriggers.swipe_left || this._cardTriggers.swipe_right ? 'cursor:pointer; pointer-events:auto;' : ''}"
                  >
                    ${useInsetArtwork && artworkUrl ? x`
                      <div style="position: absolute; ${needsArtworkTopPadding ? 'top: 20px; right: 0; bottom: 0; left: 0;' : 'inset: 0;'} display: flex; align-items: center; justify-content: center; pointer-events: none;">
                        <img 
                          src="${artworkUrl}" 
                          style="max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: none;" 
                        />
                      </div>
                    ` : E}
                    ${!useInsetArtwork && !artworkUrl && !idleImageUrl ? x`
                      <div class="media-artwork-placeholder">
                        <svg
                          viewBox="0 0 184 184"
                          style="${this.config.match_theme === true ? 'color:#fff;' : `color:${this._customAccent};`}"
                          xmlns="http://www.w3.org/2000/svg">
                          <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"></rect>
                          <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"></rect>
                          <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"></rect>
                          <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"></rect>
                        </svg>
                      </div>
                    ` : E}
                  </div>
                ` : E}
                <div class="details" style="${(() => {
      const detailStyleParts = [];
      if (this._showEntityOptions) detailStyleParts.push('visibility:hidden');
      detailStyleParts.push(`min-height:${detailsMinHeight}px`);
      if (!shouldShowDetails) detailStyleParts.push('opacity:0');
      return detailStyleParts.join(';');
    })()}">
                  <div class="title">
                    ${shouldShowDetails && title ? title : x`&nbsp;`}
                  </div>
                  <div
                      class="artist ${shouldShowDetails && stateObj.attributes.media_artist ? 'clickable-artist' : ''}"
                      @click=${() => {
      if (shouldShowDetails && stateObj.attributes.media_artist) this._searchArtistFromNowPlaying();
    }}
                      title=${shouldShowDetails && stateObj.attributes.media_artist ? localize('search.search_artist') : ""}
                    >${shouldShowDetails && artist ? artist : x`&nbsp;`}</div>
                </div>
                ${!collapsed && !this._alternateProgressBar ? isPlaying && duration ? renderProgressBar({
      progress,
      seekEnabled: true,
      onSeek: e => this._onProgressBarClick(e),
      collapsed: false,
      accent: this._customAccent,
      style: this._showEntityOptions ? "visibility:hidden" : "",
      displayTimestamps: this._displayTimestamps,
      currentTime: pos,
      duration: duration
    }) : renderProgressBar({
      progress: 0,
      seekEnabled: false,
      collapsed: false,
      accent: this._customAccent,
      style: "visibility:hidden",
      displayTimestamps: this._displayTimestamps,
      currentTime: 0,
      duration: 0
    }) : E}
                ${collapsed || this._alternateProgressBar ? isPlaying && duration ? renderProgressBar({
      progress,
      collapsed: true,
      accent: this._customAccent,
      style: this._showEntityOptions ? "visibility:hidden" : ""
    }) : renderProgressBar({
      progress: 0,
      collapsed: true,
      accent: this._customAccent,
      style: "visibility:hidden"
    }) : E}
                ${!hideControlsNow && controlSpacerSize > 0 ? x`
                  <div class="collapsed-flex-spacer" style="flex: 1 0 ${Math.round(controlSpacerSize)}px;"></div>
                ` : E}
                <div style="${hideControlsNow || this._showEntityOptions ? 'visibility:hidden; pointer-events:none;' : ''}">
                    ${renderControlsRow({
      stateObj: playbackStateObj,
      showStop: this._shouldShowStopButton(playbackStateObj),
      shuffleActive,
      repeatActive,
      onControlClick: action => this._onControlClick(action),
      supportsFeature: (state, feature) => this._supportsFeature(state, feature),
      showFavorite: showFavoriteButton,
      favoriteActive,
      hiddenControls: currentHiddenControls,
      adaptiveControls: this._adaptiveControls,
      controlLayout: this._controlLayout,
      swapPauseForStop: this._controlLayout === "modern" && this._swapPauseForStop
    })}

                    ${renderVolumeRow({
      isRemoteVolumeEntity,
      showSlider,
      vol,
      isMuted: ((_this$currentVolumeSt3 = this.currentVolumeStateObj) === null || _this$currentVolumeSt3 === void 0 || (_this$currentVolumeSt3 = _this$currentVolumeSt3.attributes) === null || _this$currentVolumeSt3 === void 0 ? void 0 : _this$currentVolumeSt3.is_volume_muted) ?? false,
      supportsMute: this.currentVolumeStateObj ? this._supportsFeature(this.currentVolumeStateObj, SUPPORT_VOLUME_MUTE) : false,
      onVolumeDragStart: e => this._onVolumeDragStart(e),
      onVolumeDragEnd: e => this._onVolumeDragEnd(e),
      onVolumeChange: e => this._onVolumeChange(e),
      onVolumeStep: dir => this._onVolumeStep(dir),
      onMuteToggle: () => this._onMuteToggle(),
      leadingControlTemplate: leadingVolumeControl,
      reserveLeadingControlSpace: this._controlLayout === "modern",
      showRightPlaceholder: this._controlLayout === "modern",
      rightSlotTemplate,
      hideVolume: this.config.volume_mode === "hidden",
      moreInfoMenu: x`
                        <div class="more-info-menu">
                          <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                            <span class="more-info-icon">&#9776;</span>
                          </button>
                        </div>
                      `
    })}
                  </div>
            ${hideControlsNow && !this._showEntityOptions ? x`
              <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: ${Z_LAYERS.FLOATING_ELEMENT};">
                <button class="more-info-btn" @click=${async () => await this._openEntityOptions()}>
                  <span class="more-info-icon">&#9776;</span>
                </button>
              </div>
            ` : E}
            ${showChipsInMenu && !this._showEntityOptions && !this._hideActiveEntityLabel ? x`
              <div class="in-menu-active-label">${activeChipName}</div>
            ` : E}
          </div>
        </div>

      ${this._showEntityOptions ? x`
      <div class="entity-options-overlay entity-options-overlay-opening" @click=${e => this._closeEntityOptions(e)}>
        <div class="entity-options-container entity-options-container-opening">
          <div class="entity-options-sheet${showChipsInMenu || reserveChipSpaceInMenu ? ' chips-mode' : ''} entity-options-sheet-opening" 
               @click=${e => e.stopPropagation()}
               data-pin-search-headers="${effectivePinHeaders}">
            ${showChipsInMenu || reserveChipSpaceInMenu ? x`
                <div class="entity-options-chips-wrapper" style="${reserveChipSpaceInMenu && !showChipsInMenu ? 'visibility:hidden;pointer-events:none;' : ''}" @click=${e => e.stopPropagation()}>
                <div class="chip-row entity-options-chips-strip">
                  ${renderChipRow({
      groupedSortedEntityIds: this.groupedSortedEntityIds,
      entityIds: this.entityIds,
      selectedEntityId: this.currentEntityId,
      pinnedIndex: this._pinnedIndex,
      holdToPin: this._holdToPin,
      getChipName: id => this.getChipName(id),
      getActualGroupMaster: group => this._getActualGroupMaster(group),
      getIsChipPlaying: (id, isSelected) => {
        var _this$hass33;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return false;
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass33 = this.hass) === null || _this$hass33 === void 0 || (_this$hass33 = _this$hass33.states) === null || _this$hass33 === void 0 ? void 0 : _this$hass33[playbackEntityId];
        // Return actual playing state - animation should only show when truly playing
        return this._isEntityPlaying(playbackState);
      },
      getChipArt: id => {
        var _this$hass34, _this$hass35;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return null;
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass34 = this.hass) === null || _this$hass34 === void 0 || (_this$hass34 = _this$hass34.states) === null || _this$hass34 === void 0 ? void 0 : _this$hass34[playbackEntityId];
        const mainState = (_this$hass35 = this.hass) === null || _this$hass35 === void 0 || (_this$hass35 = _this$hass35.states) === null || _this$hass35 === void 0 ? void 0 : _this$hass35[mainId];
        const playbackArtwork = this._getArtworkUrl(playbackState);
        const mainArtwork = this._getArtworkUrl(mainState);
        return playbackArtwork || mainArtwork;
      },
      getIsMaActive: id => {
        var _this$hass36;
        const obj = this._findEntityObjByAnyId(id);
        const mainId = (obj === null || obj === void 0 ? void 0 : obj.entity_id) || id;
        const idx = this.entityIds.indexOf(mainId);
        if (idx < 0) return false;
        const entityObj = this.entityObjs[idx];
        if (!(entityObj !== null && entityObj !== void 0 && entityObj.music_assistant_entity)) return false;
        const playbackEntityId = this._getEntityForPurpose(idx, 'playback_control');
        const playbackState = (_this$hass36 = this.hass) === null || _this$hass36 === void 0 || (_this$hass36 = _this$hass36.states) === null || _this$hass36 === void 0 ? void 0 : _this$hass36[playbackEntityId];
        return playbackEntityId === this._resolveEntity(entityObj.music_assistant_entity, entityObj.entity_id, idx) && this._isEntityPlaying(playbackState);
      },
      isIdle: this._isIdle,
      hass: this.hass,
      artworkHostname: ((_this$config13 = this.config) === null || _this$config13 === void 0 ? void 0 : _this$config13.artwork_hostname) || '',
      mediaArtworkOverrides: ((_this$config14 = this.config) === null || _this$config14 === void 0 ? void 0 : _this$config14.media_artwork_overrides) || [],
      fallbackArtwork: ((_this$config15 = this.config) === null || _this$config15 === void 0 ? void 0 : _this$config15.fallback_artwork) || null,
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
              </div>
            ` : E}
              ${!this._showGrouping && !this._showSourceList && !this._showSearchInSheet && !this._showResolvedEntities && !this._showTransferQueue ? this._renderMainMenu(sourceList, menuOnlyActions, showChipsInMenu) : this._showGrouping ? this._renderGroupingSheet() : this._showTransferQueue ? this._renderTransferQueueSheet() : this._showResolvedEntities ? this._renderResolvedEntitiesSheet() : this._showSearchInSheet ? x`
              <div class="entity-options-search" style = "margin-top:12px;" >
                ${this._searchHierarchy.length > 0 ? x`
                    <button class="entity-options-item close-item" @click=${() => {
      if (this._quickMenuInvoke) {
        this._dismissWithAnimation();
      } else {
        this._goBackInSearch();
      }
    }}>
                      Back
                    </button>
                    <div class="entity-options-divider"></div>
                  ` : E}
                  ${showSearchHeaders && this._searchBreadcrumb ? x`
                    <div class="entity-options-search-breadcrumb">
                      <div class="entity-options-search-breadcrumb-text">${this._searchBreadcrumb}</div>
                    </div>
                  ` : showSearchHeaders ? x`<div class="entity-options-search-skeleton"></div>` : E}
                  ${showSearchHeaders ? x`
                  <div class="entity-options-search-row">
                      <input
                        type="text"
                        id="search-input-box"
                        ?autofocus=${!this._disableSearchAutofocus}
                        class="entity-options-search-input"
                        .value=${this._searchQuery}
                        @input=${e => {
      this._searchQuery = e.target.value;
      this.requestUpdate();
    }}
                        @keydown=${e => {
      if (e.key === "Enter") {
        e.preventDefault();
        this._handleSearchSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this._hideSearchSheetInOptions();
      }
    }}
                        placeholder="${localize('editor.placeholders.search')}"
                        style="flex:1; min-width:0; font-size:1.1em;"
                      />
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => this._handleSearchSubmit()}
                      ?disabled=${this._searchLoading}>
                      ${localize('common.search')}
                    </button>
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${() => {
      if (this._quickMenuInvoke) {
        this._dismissWithAnimation();
      } else {
        this._hideSearchSheetInOptions();
      }
    }}>
              ${localize('common.cancel')}
                    </button>
                  </div>
                  ` : E}
                  <!--FILTER CHIPS-->
               ${showSearchHeaders ? (() => {
      const classes = this._getVisibleSearchFilterClasses();
      const filter = this._searchMediaClassFilter || "all";

      // Don't show filter chips when in a hierarchy (artist -> albums -> tracks)
      if (this._searchHierarchy.length > 0) return E;

      // Show filter chips if we have multiple classes OR if we're using Music Assistant (for Favorites)
      if (classes.length < 2 && !this._usingMusicAssistant) return E;
      return x`
                      <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center; align-items: center;">
                        <button
                          class="chip"
                          style="
                            width: 72px;
                            background: ${filter === 'all' ? this._customAccent : '#282828'};
                            opacity: ${filter === 'all' ? '1' : '0.8'};
                            font-weight: ${filter === 'all' ? 'bold' : 'normal'};
                          "
                          ?selected=${filter === 'all'}
                          @click=${() => this._doSearch()}
                        >${localize('search.filters.all')}</button>
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
                            @click=${() => this._doSearch(c)}
                          >
                            ${localize(`search.filters.${c}`)}
                          </button>
                        `)}
                      </div>
                    `;
    })() : E}
                  ${showSearchHeaders && this._searchLoading ? x`<div class="entity-options-search-loading">${localize('common.loading')}</div>` : E}
                  ${showSearchHeaders && this._searchError ? x`<div class="entity-options-search-error">${this._searchError}</div>` : E}
                  
                  ${showSearchHeaders && this._usingMusicAssistant && !this._searchLoading ? x`
                    <div class="search-sub-filters" style="display: flex; align-items: center; margin-bottom: 2px; margin-top: 4px; padding-left: 3px; width: 100%; gap: 8px;">
                      <div style="display: flex; align-items: center; flex-wrap: wrap; flex: 1; min-width: 0;">
                        <button
                          class="button${this._initialFavoritesLoaded || this._favoritesFilterActive ? ' active' : ''}"
                          style="
                            background: none;
                            border: none;
                            font-size: 1.2em;
                            cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                            padding: 4px 8px;
                            border-radius: 50%;
                            transition: all 0.2s ease;
                            margin-right: 8px;
                            display: flex;
                            align-items: center;
                            opacity: ${this._searchAttempted ? '1' : '0.5'};
                          "
                          @click=${this._searchAttempted ? () => {
      this._toggleFavoritesFilter();
    } : () => {}}
                          title="${localize('search.favorites')}"
                        >
                                                  <ha-icon .icon=${this._initialFavoritesLoaded || this._favoritesFilterActive ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'}></ha-icon>
                          ${this._initialFavoritesLoaded || this._favoritesFilterActive ? x`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                              ${localize('search.favorites')}
                            </span>
                          ` : E}
                      </button>
                      <button
                          class="button${this._recentlyPlayedFilterActive ? ' active' : ''}"
                          style="
                            background: none;
                            border: none;
                            font-size: 1.2em;
                            cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                            padding: 4px 8px;
                            border-radius: 50%;
                            transition: all 0.2s ease;
                            margin-right: 8px;
                            display: flex;
                            align-items: center;
                            opacity: ${this._searchAttempted ? '1' : '0.5'};
                          "
                          @click=${this._searchAttempted ? () => {
      this._toggleRecentlyPlayedFilter();
    } : () => {}}
                          title="${localize('search.recently_played')}"
                        >
                          <ha-icon .icon=${this._recentlyPlayedFilterActive ? 'mdi:clock' : 'mdi:clock-outline'}></ha-icon>
                          ${this._recentlyPlayedFilterActive ? x`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                              ${localize('search.recently_played')}
                            </span>
                          ` : E}
                      </button>
                      ${this._isMusicAssistantEntity() ? x`
                        <button
                            class="button${this._upcomingFilterActive ? ' active' : ''}"
                            style="
                              background: none;
                              border: none;
                              font-size: 1.2em;
                              cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                              padding: 4px 8px;
                              border-radius: 50%;
                              transition: all 0.2s ease;
                              margin-right: 8px;
                              display: flex;
                              align-items: center;
                              opacity: ${this._searchAttempted ? '1' : '0.5'};
                            "
                            @click=${this._searchAttempted ? () => {
      this._toggleUpcomingFilter();
    } : () => {}}
                            title="${localize('search.next_up')}"
                          >
                            <ha-icon .icon=${this._upcomingFilterActive ? 'mdi:playlist-music' : 'mdi:playlist-music-outline'}></ha-icon>
                            ${this._upcomingFilterActive ? x`
                              <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                                ${localize('search.next_up')}
                              </span>
                            ` : E}
                        </button>
                        ${this._hasMassQueueIntegration ? x`
                          <button
                              class="button${this._recommendationsFilterActive ? ' active' : ''}"
                              style="
                                background: none;
                                border: none;
                                font-size: 1.2em;
                                cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                                padding: 4px 8px;
                                border-radius: 50%;
                                transition: all 0.2s ease;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                opacity: ${this._searchAttempted ? '1' : '0.5'};
                              "
                              @click=${this._searchAttempted ? () => {
      this._toggleRecommendationsFilter();
    } : () => {}}
                              title="${localize('search.recommendations')}"
                            >
                              <ha-icon .icon=${this._recommendationsFilterActive ? 'mdi:thumb-up' : 'mdi:thumb-up-outline'}></ha-icon>
                              ${this._recommendationsFilterActive ? x`
                                <span style="margin-left:6px;font-size:0.81em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                                  ${localize('search.recommendations')}
                                </span>
                              ` : E}
                          </button>
                        ` : E}
                      ` : E}
                      <button
                          class="radio-mode-button${this._radioModeActive ? ' active' : ''}"
                          @click=${() => this._toggleRadioMode()}
                          title="Radio Mode"
                        >
                          <ha-icon .icon=${this._radioModeActive ? 'mdi:radio' : 'mdi:radio-off'}></ha-icon>
                      </button>
                      ${this._shouldShowSearchSortToggle() ? x`
                        <button
                          class="button"
                          style="
                            background: none;
                            border: none;
                            font-size: 1.2em;
                            cursor: ${this._searchAttempted ? 'pointer' : 'default'};
                            padding: 4px 8px;
                            border-radius: 50%;
                            transition: all 0.2s ease;
                            margin-right: 8px;
                            display: flex;
                            align-items: center;
                            opacity: ${this._searchAttempted ? '1' : '0.5'};
                          "
                          @click=${this._searchAttempted ? () => this._toggleSearchResultsSortDirection() : () => {}}
                          title=${this._getSearchSortToggleTitle()}
                        >
                          <ha-icon .icon=${this._getSearchSortToggleIcon()}></ha-icon>
                        </button>
                      ` : E}
                      ${this._shouldShowSearchResultsCount() ? x`
                        <span class="search-results-count">
                          ${this._getSearchResultsCountLabel()}
                        </span>
                      ` : E}
                    </div>
                  ` : E}

            <div class="entity-options-search-results ${this.config.search_view === 'card' ? 'search-results-card-view' : 'list-view'}" 
                 style="${this.config.search_view === 'card' ? `--search-card-columns: ${this.config.search_card_columns || 4};` : ''}">
              ${(() => {
      this._searchMediaClassFilter || "all";
      const currentResults = this._getDisplaySearchResults();
      // Build padded array so row‑count stays constant
      const totalRows = Math.max(15, this._searchTotalRows || currentResults.length);
      const paddedResults = [...currentResults, ...Array.from({
        length: Math.max(0, totalRows - currentResults.length)
      }, () => null)];
      // Always render paddedResults, even before first search
      return this._searchAttempted && currentResults.length === 0 && !this._searchLoading ? x`<div class="entity-options-search-empty" style="color: white;">No results.</div>` : paddedResults.map(item => item ? x`
                            <!-- EXISTING non‑placeholder row markup -->
                            <div class="entity-options-search-result ${this.config.search_view === 'card' ? 'search-result-card' : ''} ${item._justMoved ? 'just-moved' : ''} ${item.media_content_id != null && this._activeSearchRowMenuId === item.media_content_id ? 'menu-active' : ''}">
                               <div class="search-sheet-thumb-container"
                                    data-clickable="${this.config.search_view === 'card'}"
                                    @click=${this.config.search_view === 'card' ? () => this._playMediaFromSearch(item) : null}>
                                ${item.thumbnail && this._isValidArtworkUrl(item.thumbnail) && !String(item.thumbnail).includes('imageproxy') ? x`
                                   <img
                                     class="entity-options-search-thumb"
                                     src=${item.thumbnail}
                                     alt=${item.title}
                                     onerror="this.style.display='none'"
                                   />
                                ` : x`
                                   <div class="entity-options-search-thumb-placeholder">
                                     <ha-icon icon="mdi:music"></ha-icon>
                                   </div>
                                `}
                                ${this.config.search_view === 'card' ? renderSearchResultActions({
        item,
        onPlay: it => this._playMediaFromSearch(it),
        onOptionsToggle: it => {
          this._activeSearchRowMenuId = (it === null || it === void 0 ? void 0 : it.media_content_id) || null;
          this.requestUpdate();
        },
        upcomingFilterActive: !!this._upcomingFilterActive,
        isMusicAssistant: this._isMusicAssistantEntity(),
        massQueueAvailable: this._massQueueAvailable,
        searchView: 'card'
      }) : E}
                               </div>
                               <div class="search-sheet-info">
                                <span class="${this._isClickableSearchResult(item) ? 'clickable-search-result' : ''} ${this.config.search_view === 'card' ? 'search-sheet-title' : ''}"
                                      @touchstart=${e => this._handleSearchResultTouch(item, e)}
                                      @click=${() => this._handleSearchResultClick(item)}
                                      title=${this._getSearchResultClickTitle(item)}>
                                  ${item.title}
                                </span>
                                 <span class="search-sheet-subtitle">
                                  ${(() => {
        // Prefer artist when available for tracks/albums and special filters
        const isTrackOrAlbum = this._searchMediaClassFilter === 'track' || this._searchMediaClassFilter === 'album';
        const isRecentlyPlayed = !!this._recentlyPlayedFilterActive;
        const isUpcoming = !!this._upcomingFilterActive;
        const isRecommendations = !!this._recommendationsFilterActive;
        if ((isTrackOrAlbum || isRecentlyPlayed || isUpcoming || isRecommendations) && item.artist) {
          return item.artist;
        }
        // Otherwise show media class as before
        return item.media_class ? item.media_class.charAt(0).toUpperCase() + item.media_class.slice(1) : "";
      })()}
                                </span>
                                ${this.config.search_view === 'card' ? x`
                                  <div class="card-menu-button" @click=${e => {
        e.preventDefault();
        e.stopPropagation();
        this._activeSearchRowMenuId = item.media_content_id;
        this.requestUpdate();
      }}>
                                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                                  </div>
                                ` : E}
                              </div>
                              ${this.config.search_view !== 'card' ? renderSearchResultActions({
        item,
        onPlay: it => this._playMediaFromSearch(it),
        onOptionsToggle: it => {
          this._activeSearchRowMenuId = (it === null || it === void 0 ? void 0 : it.media_content_id) || null;
          this.requestUpdate();
        },
        upcomingFilterActive: !!this._upcomingFilterActive,
        isMusicAssistant: this._isMusicAssistantEntity(),
        massQueueAvailable: this._massQueueAvailable,
        searchView: 'list',
        isInline: true,
        onMoveUp: it => this._moveQueueItemUp(it.queue_item_id),
        onMoveDown: it => this._moveQueueItemDown(it.queue_item_id),
        onMoveNext: it => this._moveQueueItemNext(it.queue_item_id),
        onRemove: it => this._removeQueueItem(it.queue_item_id)
      }) : E}

                                ${renderSearchResultSlideOut({
        item,
        activeSearchRowMenuId: this._activeSearchRowMenuId,
        successSearchRowMenuId: this._successSearchRowMenuId,
        onPlayOption: (it, mode) => this._performSearchOptionAction(it, mode),
        onOptionsToggle: it => {
          this._activeSearchRowMenuId = (it === null || it === void 0 ? void 0 : it.media_content_id) || null;
          this.requestUpdate();
        },
        searchView: this.config.search_view,
        isQueueItem: this._isMusicAssistantEntity() && item.queue_item_id && !!this._upcomingFilterActive && this._massQueueAvailable,
        onMoveUp: it => this._moveQueueItemUp(it.queue_item_id),
        onMoveDown: it => this._moveQueueItemDown(it.queue_item_id),
        onMoveNext: it => this._moveQueueItemNext(it.queue_item_id),
        onRemove: it => this._removeQueueItem(it.queue_item_id)
      })}
                            </div>
                          ` : x`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `);
    })()}
            </div>
                  </div>
                </div>
              ` : this._showGrouping ? this._renderGroupingSheet() : x`
                <div class="entity-options-header">
                  <button class="entity-options-item close-item" @click=${() => {
      if (this._quickMenuInvoke) {
        this._dismissWithAnimation();
      } else {
        this._closeSourceList();
      }
    }}>
                    ${localize('common.back')}
                  </button>
                  <div class="entity-options-divider"></div>
                </div>
                <div class="entity-options-scroll source-list-centering-wrapper">
                  <div class="source-list-sheet">
                    <div class="source-list-scroll">
                      ${sourceList.map(src => x`
                        <div class="entity-options-item" data-source-name="${src}" @click=${() => this._selectSource(src)}>${src}</div>
                      `)}
                    </div>
                  </div>
                </div>
                <div class="floating-source-index">
                  ${sourceLetters.map((letter, i) => {
      const isAvailable = availableSourceFirstLetters.has(letter);
      const hovered = this._hoveredSourceLetterIndex;
      let scale = "";
      if (isAvailable && hovered !== null && hovered !== undefined) {
        const dist = Math.abs(hovered - i);
        if (dist === 0) scale = "max";else if (dist === 1) scale = "large";else if (dist === 2) scale = "med";
      }
      return x`
                      <button
                        class="source-index-letter"
                        ?disabled=${!isAvailable}
                        data-scale=${scale}
                        @mouseenter=${isAvailable ? () => {
        this._hoveredSourceLetterIndex = i;
        this.requestUpdate();
      } : E}
                        @mouseleave=${() => {
        this._hoveredSourceLetterIndex = null;
        this.requestUpdate();
      }}
                        @click=${isAvailable ? () => this._scrollToSourceLetter(letter) : E}
                      >
                        ${letter}
                      </button>
                    `;
    })}
                </div>
`}
              </div>
            </div>
            <!-- Persistent Media Controls Section - Outside Scrollable Area -->
            ${shouldShowPersistentControls ? x`
              <div class="persistent-media-controls" @click=${e => e.stopPropagation()}>
                <div class="persistent-controls-artwork">
                  ${(() => {
      // Use the same entity resolution as the main card
      const playbackStateObj = this.currentPlaybackStateObj;
      const mainState = this.currentStateObj;
      const artwork = this._getArtworkUrl(playbackStateObj) || this._getArtworkUrl(mainState);
      return artwork !== null && artwork !== void 0 && artwork.url && this._isValidArtworkUrl(artwork.url) ? x`
                      <img src="${artwork.url}" alt="Album Art" class="persistent-artwork" onerror="this.style.display='none'">
                    ` : x`
                      <div class="persistent-artwork-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `;
    })()}
                </div>
                <div class="persistent-controls-buttons">
                  <button class="persistent-control-btn" @click=${() => this._onControlClick("prev")} title="${localize('card.media_controls.previous')}">
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${() => this._onControlClick("play_pause")} title="${localize('card.media_controls.play_pause')}">
                    <ha-icon icon=${this._isEntityPlaying(this.currentPlaybackStateObj) ? "mdi:pause" : "mdi:play"}></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${() => this._onControlClick("next")} title="${localize('card.media_controls.next')}">
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </button>
                </div>
                ${(_volumeState$attribut => {
      const idx = this._selectedIndex;
      const volumeEntity = this._getVolumeEntity(idx);
      if (!volumeEntity) return E;
      const isRemote = volumeEntity.startsWith && volumeEntity.startsWith("remote.");
      const volumeState = this.currentVolumeStateObj;
      const volumeLevel = Number((volumeState === null || volumeState === void 0 || (_volumeState$attribut = volumeState.attributes) === null || _volumeState$attribut === void 0 ? void 0 : _volumeState$attribut.volume_level) ?? 0);
      const percentLabel = !isRemote ? `${Math.round((volumeLevel || 0) * 100)}%` : null;
      if (this.config.volume_mode === "hidden") return E;
      return x`
                    <div class="persistent-volume-stepper">
                      <button class="stepper-btn" @click=${() => this._onVolumeStep(-1)} title="${localize('common.vol_down')}">–</button>
                      ${percentLabel ? x`<span class="stepper-value">${percentLabel}</span>` : E}
                      <button class="stepper-btn" @click=${() => this._onVolumeStep(1)} title="${localize('common.vol_up')}">+</button>
                    </div>
                  `;
    })()}
              </div>
            ` : E}
          </div>
        ` : E}
          ${this._searchActiveOptionsItem ? renderSearchOptionsOverlay({
      item: this._searchActiveOptionsItem,
      onClose: () => {
        this._searchActiveOptionsItem = null;
        this.requestUpdate();
      },
      onPlayOption: (item, mode) => this._performSearchOptionAction(item, mode)
    }) : E}
          ${this._searchOpen ? renderSearchSheet({
      open: this._searchOpen,
      query: this._searchQuery,
      loading: this._searchLoading,
      results: this._getDisplaySearchResults(),
      error: this._searchError,
      matchTheme: (_this$config16 = this.config) === null || _this$config16 === void 0 ? void 0 : _this$config16.match_theme,
      // Add matchTheme parameter
      onClose: () => this._searchCloseSheet(),
      onQueryInput: e => {
        this._searchQuery = e.target.value;
        this.requestUpdate();
      },
      onSearch: () => {
        // Clear recently played filter when user initiates search
        this._recentlyPlayedFilterActive = false;
        this._upcomingFilterActive = false;
        this._recommendationsFilterActive = false;
        this._doSearch(this._searchMediaClassFilter === 'all' ? null : this._searchMediaClassFilter);
      },
      onPlay: item => this._playMediaFromSearch(item),
      onQueue: item => this._queueMediaFromSearch(item),
      onPlayOption: (item, mode) => this._performSearchOptionAction(item, mode),
      onResultClick: item => this._handleSearchResultClick(item),
      activeSearchRowMenuId: this._activeSearchRowMenuId,
      successSearchRowMenuId: this._successSearchRowMenuId,
      onOptionsToggle: item => {
        this._activeSearchRowMenuId = item ? item.media_content_id : null;
        this.requestUpdate();
      },
      upcomingFilterActive: this._upcomingFilterActive,
      disableAutofocus: this._disableSearchAutofocus,
      searchView: this.config.search_view || 'list',
      searchCardColumns: this.config.search_card_columns || 4,
      massQueueAvailable: this._massQueueAvailable,
      onMoveUp: it => this._moveQueueItemUp(it.queue_item_id),
      onMoveDown: it => this._moveQueueItemDown(it.queue_item_id),
      onMoveNext: it => this._moveQueueItemNext(it.queue_item_id),
      onRemove: it => this._removeQueueItem(it.queue_item_id)
    }) : E}
          </div>
    </ha-card>
  `;
  }
  _updateIdleState() {
    // Consider both main and Music Assistant entities so we can wake from idle
    // even if the active selection is frozen while idle.
    const isAnyUnrestrictedPlaying = this.entityIds.some((id, idx) => {
      if (this._isAutoSelectDisabled(idx)) return false;
      const activeId = this._getEntityForPurpose(idx, 'sorting');
      return this._isEntityPlaying(this.hass.states[activeId]);
    });
    const isCurrentPlaying = this._isCurrentEntityPlaying();

    // Condition to wake up or stay active immediately:
    // Only wake up (from idle or initial load) if an UNRESTRICTED player is active.
    // If already active, we only stay active immediately if the CURRENT player is playing.
    // Otherwise, we allow the idle timer to run (even if others are playing) so that
    // the manual select state can eventually be cleared, allowing an auto-switch.
    let shouldBeActiveImmediately = false;
    if (this._isIdle || !this._hasSeenPlayback) {
      shouldBeActiveImmediately = isAnyUnrestrictedPlaying;
    } else {
      shouldBeActiveImmediately = isCurrentPlaying;
    }
    if (shouldBeActiveImmediately) {
      // Became active, clear timer and set not idle
      if (this._idleTimeout) clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
      this._hasSeenPlayback = true;
      if (this._isIdle) {
        this._isIdle = false;
        this._resetIdleScreen();
        this.requestUpdate();
      }
    } else {
      // Current is not playing, or nothing is playing.
      if (!this._hasSeenPlayback) {
        // Initial load with nothing playing - go idle immediately
        if (this._idleTimeoutMs > 0) {
          if (!this._isIdle) {
            this._isIdle = true;
            this._idleScreenApplied = false;
            this._applyIdleScreen();
            this.requestUpdate();
          }
        } else if (this._isIdle) {
          this._isIdle = false;
          this._resetIdleScreen();
          this.requestUpdate();
        }
        return;
      }

      // Check for grace period: something is playing somewhere, but not the current choice.
      // Or nothing is playing at all. In both cases, we wait for the timeout.
      if (!this._isIdle && !this._idleTimeout && this._idleTimeoutMs > 0) {
        this._idleTimeout = setTimeout(() => {
          this._isIdle = true;
          this._idleTimeout = null;
          this._idleScreenApplied = false;

          // If not explicitly pinned, clear manual select on idle timeout
          // so we can switch to other playing entities if needed
          if (this._pinnedIndex === null) {
            this._manualSelect = false;
            this._manualSelectPlayingSet = null;
          }
          this._applyIdleScreen();
          this.requestUpdate();
        }, this._idleTimeoutMs);
      }

      // If idle_timeout_ms is 0, ensure we're never idle
      if (this._idleTimeoutMs === 0 && this._isIdle) {
        this._isIdle = false;
        this._resetIdleScreen();
        this.requestUpdate();
      }
    }
  }

  // Home assistant layout options
  getGridOptions() {
    // Use the same logic as in render() to know if the card is collapsed.
    let collapsed;
    if (this._alwaysCollapsed && this._expandOnSearch && (this._searchOpen || this._showSearchInSheet)) {
      collapsed = false;
    } else {
      collapsed = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isIdle : false;
    }
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
          }, {
            value: "in_menu",
            label: "In Menu"
          }, {
            value: "in_menu_on_idle",
            label: "In Menu on Idle"
          }]
        }
      },
      required: false
    }, {
      name: "idle_screen",
      selector: {
        select: {
          options: [{
            value: "default",
            label: "Default"
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
          }, {
            value: "transfer-queue",
            label: "Transfer Queue"
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
      name: "disable_autofocus",
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
      name: "expand_on_search",
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
    }, {
      name: "dim_chips_on_idle",
      selector: {
        boolean: {}
      },
      required: false
    }, {
      name: "pin_search_headers",
      selector: {
        boolean: {}
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

    const mousedownHandler = e => {
      isDown = true;
      row._dragged = false;
      row.classList.add('grab-scroll-active');
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
      e.preventDefault();
    };
    const mouseleaveHandler = () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    };
    const mouseupHandler = () => {
      isDown = false;
      row.classList.remove('grab-scroll-active');
    };
    const mousemoveHandler = e => {
      if (!isDown) return;
      const x = e.pageX - row.offsetLeft;
      const walk = x - startX;
      // Mark as dragged if moved > 5px
      if (Math.abs(walk) > 5) {
        row._dragged = true;
      }
      e.preventDefault();
      row.scrollLeft = scrollLeft - walk;
    };
    const clickHandler = e => {
      if (row._dragged) {
        e.stopPropagation();
        e.preventDefault();
        row._dragged = false;
      }
    };
    row.addEventListener('mousedown', mousedownHandler);
    row.addEventListener('mouseleave', mouseleaveHandler);
    row.addEventListener('mouseup', mouseupHandler);
    row.addEventListener('mousemove', mousemoveHandler);
    row.addEventListener('click', clickHandler, true);

    // Store handlers for cleanup
    row._grabScrollHandlers = {
      mousedown: mousedownHandler,
      mouseleave: mouseleaveHandler,
      mouseup: mouseupHandler,
      mousemove: mousemoveHandler,
      click: clickHandler
    };
    row._grabScrollAttached = true;
  }
  _addVerticalGrabScroll(selector) {
    const col = this.renderRoot.querySelector(selector);
    if (!col || col._grabScrollAttached) return;
    let isDown = false;
    let startY, scrollTop;
    const mousedownHandler = e => {
      isDown = true;
      col._dragged = false;
      col.classList.add('grab-scroll-active');
      startY = e.pageY - col.getBoundingClientRect().top;
      scrollTop = col.scrollTop;
      e.preventDefault();
    };
    const mouseleaveHandler = () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    };
    const mouseupHandler = () => {
      isDown = false;
      col.classList.remove('grab-scroll-active');
    };
    const mousemoveHandler = e => {
      if (!isDown) return;
      const y = e.pageY - col.getBoundingClientRect().top;
      const walk = y - startY;
      if (Math.abs(walk) > 5) col._dragged = true;
      e.preventDefault();
      col.scrollTop = scrollTop - walk;
    };
    const clickHandler = e => {
      if (col._dragged) {
        e.stopPropagation();
        e.preventDefault();
        col._dragged = false;
      }
    };
    col.addEventListener('mousedown', mousedownHandler);
    col.addEventListener('mouseleave', mouseleaveHandler);
    col.addEventListener('mouseup', mouseupHandler);
    col.addEventListener('mousemove', mousemoveHandler);
    col.addEventListener('click', clickHandler, true);

    // Store handlers for cleanup
    col._grabScrollHandlers = {
      mousedown: mousedownHandler,
      mouseleave: mouseleaveHandler,
      mouseup: mouseupHandler,
      mousemove: mousemoveHandler,
      click: clickHandler
    };
    col._grabScrollAttached = true;
  }
  _removeGrabScrollHandlers() {
    // Remove grab scroll handlers from all elements
    const elements = this.renderRoot.querySelectorAll('[data-grab-scroll]');
    elements.forEach(el => {
      if (el._grabScrollHandlers) {
        const handlers = el._grabScrollHandlers;
        el.removeEventListener('mousedown', handlers.mousedown);
        el.removeEventListener('mouseleave', handlers.mouseleave);
        el.removeEventListener('mouseup', handlers.mouseup);
        el.removeEventListener('mousemove', handlers.mousemove);
        el.removeEventListener('click', handlers.click, true);
        delete el._grabScrollHandlers;
        el._grabScrollAttached = false;
      }
    });
  }
  _removeSearchSwipeHandlers() {
    // Remove search swipe handlers
    const area = this.renderRoot.querySelector('.entity-options-search-results');
    if (area && area._searchSwipeHandlers) {
      const handlers = area._searchSwipeHandlers;
      area.removeEventListener('touchstart', handlers.touchstart);
      area.removeEventListener('touchend', handlers.touchend);
      delete area._searchSwipeHandlers;
      this._searchSwipeAttached = false;
    }
  }
  disconnectedCallback() {
    var _super$disconnectedCa;
    if (this._idleTimeout) {
      clearTimeout(this._idleTimeout);
      this._idleTimeout = null;
    }
    // Unsubscribe from queue update events
    this._unsubscribeFromQueueUpdates();
    (_super$disconnectedCa = super.disconnectedCallback) === null || _super$disconnectedCa === void 0 || _super$disconnectedCa.call(this);
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    if (this._debouncedVolumeTimer) {
      clearTimeout(this._debouncedVolumeTimer);
      this._debouncedVolumeTimer = null;
    }
    if (this._manualSelectTimeout) {
      clearTimeout(this._manualSelectTimeout);
      this._manualSelectTimeout = null;
    }
    if (this._searchTimeoutHandle) {
      clearTimeout(this._searchTimeoutHandle);
      this._searchTimeoutHandle = null;
    }
    this._latestSearchToken = 0;
    this._removeSourceDropdownOutsideHandler();
    this._removeGrabScrollHandlers();
    this._removeSearchSwipeHandlers();
    window.removeEventListener("scroll", this._handleGlobalScroll);
    window.removeEventListener("resize", this._handleViewportResize);
    if (this._adaptiveScrollTimer) {
      clearTimeout(this._adaptiveScrollTimer);
      this._adaptiveScrollTimer = null;
    }
    // Clear tracking properties
    this._lastPlayingEntityId = null;
    this._controlFocusEntityId = null;
    this._teardownAdaptiveTextObserver();
  }
  // Helper method to apply closing animations
  _applyClosingAnimations() {
    const overlay = this.renderRoot.querySelector('.entity-options-overlay');
    const container = this.renderRoot.querySelector('.entity-options-container');
    const sheet = this.renderRoot.querySelector('.entity-options-sheet');
    if (overlay) {
      overlay.classList.remove('entity-options-overlay-opening');
      overlay.classList.add('entity-options-overlay-closing');
    }
    if (container) {
      container.classList.remove('entity-options-container-opening');
      container.classList.add('entity-options-container-closing');
    }
    if (sheet) {
      sheet.classList.remove('entity-options-sheet-opening');
      sheet.classList.add('entity-options-sheet-closing');
    }
  }

  // Helper method for immediate dismissals with animation
  _dismissWithAnimation() {
    this._applyClosingAnimations();
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }
    setTimeout(() => {
      this._showEntityOptions = false;
      this._showGrouping = false;
      this._showSourceList = false;
      this._showSearchInSheet = false;
      this._showResolvedEntities = false;
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
      this._quickMenuInvoke = false;
      this.requestUpdate();
    }, 200);
  }

  // Entity options overlay handlers
  _closeEntityOptions() {
    // Apply closing animations
    this._applyClosingAnimations();
    if (this._transferQueueAutoCloseTimer) {
      clearTimeout(this._transferQueueAutoCloseTimer);
      this._transferQueueAutoCloseTimer = null;
    }

    // Wait for animation to complete before hiding
    setTimeout(() => {
      this._showTransferQueue = false;
      this._transferQueuePendingTarget = null;
      this._transferQueueStatus = null;
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
        this._showSearchInSheet = false;
        this._showResolvedEntities = false;
        this._searchInputAutoFocused = false;
        this.requestUpdate();
      }
      // Clear quick menu flag on any overlay close
      this._quickMenuInvoke = false;
    }, 200); // Match the longest animation duration
  }
  async _openEntityOptions() {
    // Resolve all templates before opening the menu so feature checking works correctly
    for (let i = 0; i < this.entityObjs.length; i++) {
      await this._ensureResolvedMaForIndex(i);
    }
    await this._updateTransferQueueAvailability({
      refresh: true
    });
    this._showEntityOptions = true;
    this.requestUpdate();
    this.updateComplete.then(() => {
      var _this$renderRoot3;
      const strip = (_this$renderRoot3 = this.renderRoot) === null || _this$renderRoot3 === void 0 ? void 0 : _this$renderRoot3.querySelector('.entity-options-chips-strip');
      if (strip) {
        strip.scrollLeft = 0;
      }
    });
  }

  // Deprecated: _triggerMoreInfo is replaced by _openMoreInfo for clarity.

  // Grouping Helper Methods 
  _openGrouping() {
    this._showEntityOptions = true; // ensure the overlay is visible
    this._showGrouping = true; // show grouping sheet immediately
    // Remember the actual group master for the current selection
    const currentId = this.currentEntityId;
    let masterId = currentId;
    if (currentId) {
      const groups = this.groupedSortedEntityIds || [];
      const group = groups.find(g => g.includes(currentId));
      if (group && group.length) {
        const actual = this._getActualGroupMaster(group);
        if (actual) {
          masterId = actual;
        }
      }
    }
    if (!masterId && this.entityIds && this.entityIds.length) {
      masterId = this.entityIds[0];
    }
    this._lastGroupingMasterId = masterId;
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
    // No requestUpdate here; overlay close will handle it.
  }
  async _toggleGroup(targetId) {
    var _masterState$attribut4;
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;
    if (!masterObj) return;
    const masterGroupId = await this._resolveGroupingEntityId(masterObj, masterId);
    if (!masterGroupId) return;
    const targetObj = this.entityObjs.find(e => e.entity_id === targetId);
    if (!targetObj) return;
    const targetGroupId = await this._resolveGroupingEntityId(targetObj, targetId);
    if (!targetGroupId) return;
    const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
    const grouped = Array.isArray(masterState === null || masterState === void 0 || (_masterState$attribut4 = masterState.attributes) === null || _masterState$attribut4 === void 0 ? void 0 : _masterState$attribut4.group_members) && masterState.attributes.group_members.includes(targetGroupId);
    if (grouped) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: targetGroupId
      });
    } else {
      await this.hass.callService("media_player", "join", {
        entity_id: masterGroupId,
        group_members: [targetGroupId]
      });
    }
    this._lastGroupingMasterId = masterId || targetId;
  }

  // Card editor support 
  static getConfigElement() {
    return document.createElement("yet-another-media-player-editor");
  }
  static getStubConfig(hass, entities) {
    return {
      entities: (entities || []).filter(e => e.startsWith("media_player.")).slice(0, 2),
      disable_mass_queue: false
    };
  }

  // Group all supported entities to current master
  async _groupAll() {
    var _masterState$attribut5;
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;
    if (!masterObj) return;
    const masterGroupId = await this._resolveGroupingEntityId(masterObj, masterId);
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._isGroupCapable(masterState)) return;

    // Get all other entities that support grouping and are not already grouped with master
    const alreadyGrouped = Array.isArray((_masterState$attribut5 = masterState.attributes) === null || _masterState$attribut5 === void 0 ? void 0 : _masterState$attribut5.group_members) ? masterState.attributes.group_members : [];

    // Build list of resolved MA entities to join
    const toJoin = [];
    for (const id of this.entityIds) {
      if (id === masterId) continue;
      const obj = this.entityObjs.find(e => e.entity_id === id);
      if (!obj) continue;
      const resolvedGroupId = await this._resolveGroupingEntityId(obj, id);
      if (!resolvedGroupId) continue;
      const st = this.hass.states[resolvedGroupId];
      if (this._isGroupCapable(st) && !alreadyGrouped.includes(resolvedGroupId)) {
        toJoin.push(resolvedGroupId);
      }
    }
    if (toJoin.length > 0) {
      await this.hass.callService("media_player", "join", {
        entity_id: masterGroupId,
        group_members: toJoin
      });
    }
    // After grouping, keep the master set if still valid
    this._lastGroupingMasterId = masterId || this.currentEntityId;
    // Remain in grouping sheet
  }

  // Ungroup all members from current master
  async _ungroupAll() {
    var _masterState$attribut6;
    const masterId = this._getGroupingMasterId();
    const masterIdx = masterId ? this.entityIds.indexOf(masterId) : -1;
    const masterObj = masterIdx >= 0 ? this.entityObjs[masterIdx] : null;
    if (!masterObj) return;
    const masterGroupId = await this._resolveGroupingEntityId(masterObj, masterId);
    if (!masterGroupId) return;
    const masterState = this.hass.states[masterGroupId];
    if (!this._isGroupCapable(masterState)) return;
    const members = Array.isArray((_masterState$attribut6 = masterState.attributes) === null || _masterState$attribut6 === void 0 ? void 0 : _masterState$attribut6.group_members) ? masterState.attributes.group_members : [];
    // Only unjoin those that support grouping
    const toUnjoin = members.filter(id => {
      const st = this.hass.states[id];
      return this._isGroupCapable(st);
    });
    // Unjoin each member individually
    for (const id of toUnjoin) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: id
      });
    }
    // After ungrouping, keep the master set if still valid (may now be solo)
    this._lastGroupingMasterId = masterId || this.currentEntityId;
    // Remain in grouping sheet
  }

  // Synchronize all group member volumes to match the master
  _syncGroupVolume() {
    var _masterVolState$attri;
    const masterId = this._getGroupingMasterId();
    if (!masterId) return;
    const masterIdx = this.entityIds.indexOf(masterId);
    if (masterIdx === -1) return;
    const masterGroupId = this._getGroupingEntityId(masterIdx);
    const masterState = masterGroupId ? this.hass.states[masterGroupId] : null;
    if (!masterState || !this._isGroupCapable(masterState)) return;

    // Get master volume logic matching the renderer
    const masterVolEntity = this._getVolumeEntityForGrouping(masterIdx) || masterGroupId;
    const masterVolState = this.hass.states[masterVolEntity];
    const masterVol = Number(masterVolState === null || masterVolState === void 0 || (_masterVolState$attri = masterVolState.attributes) === null || _masterVolState$attri === void 0 ? void 0 : _masterVolState$attri.volume_level);
    if (isNaN(masterVol)) return;
    const members = Array.isArray(masterState.attributes.group_members) ? masterState.attributes.group_members : [];
    const groupingIdToIdx = new Map();
    this.entityObjs.forEach((obj, i) => {
      groupingIdToIdx.set(this._getGroupingEntityId(i), i);
    });
    for (const memberGroupId of members) {
      if (memberGroupId === masterGroupId) continue;
      const foundIdx = groupingIdToIdx.get(memberGroupId);
      if (foundIdx !== undefined) {
        const targetVolEntity = this._getVolumeEntityForGrouping(foundIdx) || memberGroupId;
        this.hass.callService("media_player", "volume_set", {
          entity_id: targetVolEntity,
          volume_level: masterVol
        });
      } else {
        // Fallback: if we can't find a configured entity, just try setting volume on the group member ID acting as an entity
        this.hass.callService("media_player", "volume_set", {
          entity_id: memberGroupId,
          volume_level: masterVol
        });
      }
    }
  }

  // Get all resolved entities for the current chip (main, MA, volume)
  _getResolvedEntitiesForCurrentChip() {
    const entities = new Set();
    const idx = this._selectedIndex;
    const obj = this.entityObjs[idx];
    if (!obj) return [];

    // Add main entity
    entities.add(obj.entity_id);

    // Add resolved MA entity if different from main
    const maEntity = this._getActualResolvedMaEntityForState(idx);
    if (maEntity && maEntity !== obj.entity_id) {
      entities.add(maEntity);
    }

    // Add resolved volume entity if different from main and MA
    const volEntity = this._getVolumeEntity(idx);
    if (volEntity && volEntity !== obj.entity_id && volEntity !== maEntity) {
      entities.add(volEntity);
    }
    return Array.from(entities);
  }

  // Open more-info for a specific entity
  _openMoreInfoForEntity(entityId) {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: {
        entityId
      },
      bubbles: true,
      composed: true
    }));
  }

  // Sync selected entity to configured helpers via actions
  _updateSelectedEntityHelper() {
    var _this$config17;
    if (!this.hass || !((_this$config17 = this.config) !== null && _this$config17 !== void 0 && _this$config17.actions)) return;
    const idx = this._selectedIndex;
    if (idx === undefined || idx === null || !this.entityObjs[idx]) return;

    // Use a map to track last synced values per helper and sync type
    if (!this._lastSyncedActionValues) {
      this._lastSyncedActionValues = new Map();
    }

    // Find all sync_selected_entity actions
    const syncActions = this.config.actions.filter(a => a.action === "sync_selected_entity" && a.sync_entity_helper);
    if (syncActions.length === 0) return;
    for (const action of syncActions) {
      var _this$hass$states$hel;
      const helperId = action.sync_entity_helper;
      const syncType = action.sync_entity_type || "yamp_entity";
      let targetId;
      if (syncType === "yamp_main_entity") {
        targetId = this.entityIds[idx];
      } else if (syncType === "yamp_playback_entity") {
        targetId = this._getActivePlaybackEntityId(idx);
      } else {
        // yamp_entity (default): MA entity if configured, otherwise main entity
        targetId = this._getActualResolvedMaEntityForState(idx) || this.entityIds[idx];
      }
      if (!targetId) continue;

      // Check if we already synced this value for this helper/action combination
      const cacheKey = `${helperId}-${syncType}`;
      if (this._lastSyncedActionValues.get(cacheKey) === targetId) continue;

      // Check if the current state of the helper is already correct to avoid redundant calls
      const currentState = (_this$hass$states$hel = this.hass.states[helperId]) === null || _this$hass$states$hel === void 0 ? void 0 : _this$hass$states$hel.state;
      if (currentState !== targetId) {
        this.hass.callService("input_text", "set_value", {
          entity_id: helperId,
          value: targetId
        });
      }
      this._lastSyncedActionValues.set(cacheKey, targetId);
    }
  }
}
customElements.define("yet-another-media-player", YetAnotherMediaPlayerCard);
