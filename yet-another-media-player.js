/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = window,
  e$2 = t$1.ShadowRoot && (void 0 === t$1.ShadyCSS || t$1.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
  s$3 = Symbol(),
  n$4 = new WeakMap();
let o$3 = class o {
  constructor(t, e, n) {
    if (this._$cssResult$ = true, n !== s$3) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (e$2 && void 0 === t) {
      const e = void 0 !== s && 1 === s.length;
      e && (t = n$4.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && n$4.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const r$2 = t => new o$3("string" == typeof t ? t : t + "", void 0, s$3),
  i$1 = function (t) {
    for (var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      e[_key - 1] = arguments[_key];
    }
    const n = 1 === t.length ? t[0] : e.reduce((e, s, n) => e + (t => {
      if (true === t._$cssResult$) return t.cssText;
      if ("number" == typeof t) return t;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s) + t[n + 1], t[0]);
    return new o$3(n, t, s$3);
  },
  S$1 = (s, n) => {
    e$2 ? s.adoptedStyleSheets = n.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet) : n.forEach(e => {
      const n = document.createElement("style"),
        o = t$1.litNonce;
      void 0 !== o && n.setAttribute("nonce", o), n.textContent = e.cssText, s.appendChild(n);
    });
  },
  c$1 = e$2 ? t => t : t => t instanceof CSSStyleSheet ? (t => {
    let e = "";
    for (const s of t.cssRules) e += s.cssText;
    return r$2(e);
  })(t) : t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var s$2;
const e$1 = window,
  r$1 = e$1.trustedTypes,
  h$1 = r$1 ? r$1.emptyScript : "",
  o$2 = e$1.reactiveElementPolyfillSupport,
  n$3 = {
    toAttribute(t, i) {
      switch (i) {
        case Boolean:
          t = t ? h$1 : null;
          break;
        case Object:
        case Array:
          t = null == t ? t : JSON.stringify(t);
      }
      return t;
    },
    fromAttribute(t, i) {
      let s = t;
      switch (i) {
        case Boolean:
          s = null !== t;
          break;
        case Number:
          s = null === t ? null : Number(t);
          break;
        case Object:
        case Array:
          try {
            s = JSON.parse(t);
          } catch (t) {
            s = null;
          }
      }
      return s;
    }
  },
  a$1 = (t, i) => i !== t && (i == i || t == t),
  l$2 = {
    attribute: true,
    type: String,
    converter: n$3,
    reflect: false,
    hasChanged: a$1
  },
  d$1 = "finalized";
let u$1 = class u extends HTMLElement {
  constructor() {
    super(), this._$Ei = new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this._$Eu();
  }
  static addInitializer(t) {
    var i;
    this.finalize(), (null !== (i = this.h) && void 0 !== i ? i : this.h = []).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach((i, s) => {
      const e = this._$Ep(s, i);
      void 0 !== e && (this._$Ev.set(e, s), t.push(e));
    }), t;
  }
  static createProperty(t) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : l$2;
    if (i.state && (i.attribute = false), this.finalize(), this.elementProperties.set(t, i), !i.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const s = "symbol" == typeof t ? Symbol() : "__" + t,
        e = this.getPropertyDescriptor(t, s, i);
      void 0 !== e && Object.defineProperty(this.prototype, t, e);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    return {
      get() {
        return this[i];
      },
      set(e) {
        const r = this[t];
        this[i] = e, this.requestUpdate(t, r, s);
      },
      configurable: true,
      enumerable: true
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || l$2;
  }
  static finalize() {
    if (this.hasOwnProperty(d$1)) return false;
    this[d$1] = true;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), void 0 !== t.h && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = new Map(), this.hasOwnProperty("properties")) {
      const t = this.properties,
        i = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i) {
    const s = [];
    if (Array.isArray(i)) {
      const e = new Set(i.flat(1 / 0).reverse());
      for (const i of e) s.unshift(c$1(i));
    } else void 0 !== i && s.push(c$1(i));
    return s;
  }
  static _$Ep(t, i) {
    const s = i.attribute;
    return false === s ? void 0 : "string" == typeof s ? s : "string" == typeof t ? t.toLowerCase() : void 0;
  }
  _$Eu() {
    var t;
    this._$E_ = new Promise(t => this.enableUpdating = t), this._$AL = new Map(), this._$Eg(), this.requestUpdate(), null === (t = this.constructor.h) || void 0 === t || t.forEach(t => t(this));
  }
  addController(t) {
    var i, s;
    (null !== (i = this._$ES) && void 0 !== i ? i : this._$ES = []).push(t), void 0 !== this.renderRoot && this.isConnected && (null === (s = t.hostConnected) || void 0 === s || s.call(t));
  }
  removeController(t) {
    var i;
    null === (i = this._$ES) || void 0 === i || i.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, i) => {
      this.hasOwnProperty(i) && (this._$Ei.set(i, this[i]), delete this[i]);
    });
  }
  createRenderRoot() {
    var t;
    const s = null !== (t = this.shadowRoot) && void 0 !== t ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(s, this.constructor.elementStyles), s;
  }
  connectedCallback() {
    var t;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t = this._$ES) || void 0 === t || t.forEach(t => {
      var i;
      return null === (i = t.hostConnected) || void 0 === i ? void 0 : i.call(t);
    });
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    var t;
    null === (t = this._$ES) || void 0 === t || t.forEach(t => {
      var i;
      return null === (i = t.hostDisconnected) || void 0 === i ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$EO(t, i) {
    let s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : l$2;
    var e;
    const r = this.constructor._$Ep(t, s);
    if (void 0 !== r && true === s.reflect) {
      const h = (void 0 !== (null === (e = s.converter) || void 0 === e ? void 0 : e.toAttribute) ? s.converter : n$3).toAttribute(i, s.type);
      this._$El = t, null == h ? this.removeAttribute(r) : this.setAttribute(r, h), this._$El = null;
    }
  }
  _$AK(t, i) {
    var s;
    const e = this.constructor,
      r = e._$Ev.get(t);
    if (void 0 !== r && this._$El !== r) {
      const t = e.getPropertyOptions(r),
        h = "function" == typeof t.converter ? {
          fromAttribute: t.converter
        } : void 0 !== (null === (s = t.converter) || void 0 === s ? void 0 : s.fromAttribute) ? t.converter : n$3;
      this._$El = r, this[r] = h.fromAttribute(i, t.type), this._$El = null;
    }
  }
  requestUpdate(t, i, s) {
    let e = true;
    void 0 !== t && (((s = s || this.constructor.getPropertyOptions(t)).hasChanged || a$1)(this[t], i) ? (this._$AL.has(t) || this._$AL.set(t, i), true === s.reflect && this._$El !== t && (void 0 === this._$EC && (this._$EC = new Map()), this._$EC.set(t, s))) : e = false), !this.isUpdatePending && e && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
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
    var t;
    if (!this.isUpdatePending) return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t, i) => this[i] = t), this._$Ei = void 0);
    let i = false;
    const s = this._$AL;
    try {
      i = this.shouldUpdate(s), i ? (this.willUpdate(s), null === (t = this._$ES) || void 0 === t || t.forEach(t => {
        var i;
        return null === (i = t.hostUpdate) || void 0 === i ? void 0 : i.call(t);
      }), this.update(s)) : this._$Ek();
    } catch (t) {
      throw i = false, this._$Ek(), t;
    }
    i && this._$AE(s);
  }
  willUpdate(t) {}
  _$AE(t) {
    var i;
    null === (i = this._$ES) || void 0 === i || i.forEach(t => {
      var i;
      return null === (i = t.hostUpdated) || void 0 === i ? void 0 : i.call(t);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t)), this.updated(t);
  }
  _$Ek() {
    this._$AL = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return true;
  }
  update(t) {
    void 0 !== this._$EC && (this._$EC.forEach((t, i) => this._$EO(i, this[i], t)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {}
  firstUpdated(t) {}
};
u$1[d$1] = true, u$1.elementProperties = new Map(), u$1.elementStyles = [], u$1.shadowRootOptions = {
  mode: "open"
}, null == o$2 || o$2({
  ReactiveElement: u$1
}), (null !== (s$2 = e$1.reactiveElementVersions) && void 0 !== s$2 ? s$2 : e$1.reactiveElementVersions = []).push("1.6.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;
const i = window,
  s$1 = i.trustedTypes,
  e = s$1 ? s$1.createPolicy("lit-html", {
    createHTML: t => t
  }) : void 0,
  o$1 = "$lit$",
  n$2 = `lit$${(Math.random() + "").slice(9)}$`,
  l$1 = "?" + n$2,
  h = `<${l$1}>`,
  r = document,
  u = () => r.createComment(""),
  d = t => null === t || "object" != typeof t && "function" != typeof t,
  c = Array.isArray,
  v = t => c(t) || "function" == typeof (null == t ? void 0 : t[Symbol.iterator]),
  a = "[ \t\n\f\r]",
  f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  _ = /-->/g,
  m = />/g,
  p = RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
  g = /'/g,
  $ = /"/g,
  y = /^(?:script|style|textarea|title)$/i,
  w = t => function (i) {
    for (var _len = arguments.length, s = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      s[_key - 1] = arguments[_key];
    }
    return {
      _$litType$: t,
      strings: i,
      values: s
    };
  },
  x = w(1),
  T = Symbol.for("lit-noChange"),
  A = Symbol.for("lit-nothing"),
  E = new WeakMap(),
  C = r.createTreeWalker(r, 129, null, false);
function P(t, i) {
  if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e ? e.createHTML(i) : i;
}
const V = (t, i) => {
  const s = t.length - 1,
    e = [];
  let l,
    r = 2 === i ? "<svg>" : "",
    u = f;
  for (let i = 0; i < s; i++) {
    const s = t[i];
    let d,
      c,
      v = -1,
      a = 0;
    for (; a < s.length && (u.lastIndex = a, c = u.exec(s), null !== c);) a = u.lastIndex, u === f ? "!--" === c[1] ? u = _ : void 0 !== c[1] ? u = m : void 0 !== c[2] ? (y.test(c[2]) && (l = RegExp("</" + c[2], "g")), u = p) : void 0 !== c[3] && (u = p) : u === p ? ">" === c[0] ? (u = null != l ? l : f, v = -1) : void 0 === c[1] ? v = -2 : (v = u.lastIndex - c[2].length, d = c[1], u = void 0 === c[3] ? p : '"' === c[3] ? $ : g) : u === $ || u === g ? u = p : u === _ || u === m ? u = f : (u = p, l = void 0);
    const w = u === p && t[i + 1].startsWith("/>") ? " " : "";
    r += u === f ? s + h : v >= 0 ? (e.push(d), s.slice(0, v) + o$1 + s.slice(v) + n$2 + w) : s + n$2 + (-2 === v ? (e.push(void 0), i) : w);
  }
  return [P(t, r + (t[s] || "<?>") + (2 === i ? "</svg>" : "")), e];
};
class N {
  constructor(_ref, e) {
    let {
      strings: t,
      _$litType$: i
    } = _ref;
    let h;
    this.parts = [];
    let r = 0,
      d = 0;
    const c = t.length - 1,
      v = this.parts,
      [a, f] = V(t, i);
    if (this.el = N.createElement(a, e), C.currentNode = this.el.content, 2 === i) {
      const t = this.el.content,
        i = t.firstChild;
      i.remove(), t.append(...i.childNodes);
    }
    for (; null !== (h = C.nextNode()) && v.length < c;) {
      if (1 === h.nodeType) {
        if (h.hasAttributes()) {
          const t = [];
          for (const i of h.getAttributeNames()) if (i.endsWith(o$1) || i.startsWith(n$2)) {
            const s = f[d++];
            if (t.push(i), void 0 !== s) {
              const t = h.getAttribute(s.toLowerCase() + o$1).split(n$2),
                i = /([.?@])?(.*)/.exec(s);
              v.push({
                type: 1,
                index: r,
                name: i[2],
                strings: t,
                ctor: "." === i[1] ? H : "?" === i[1] ? L : "@" === i[1] ? z : k
              });
            } else v.push({
              type: 6,
              index: r
            });
          }
          for (const i of t) h.removeAttribute(i);
        }
        if (y.test(h.tagName)) {
          const t = h.textContent.split(n$2),
            i = t.length - 1;
          if (i > 0) {
            h.textContent = s$1 ? s$1.emptyScript : "";
            for (let s = 0; s < i; s++) h.append(t[s], u()), C.nextNode(), v.push({
              type: 2,
              index: ++r
            });
            h.append(t[i], u());
          }
        }
      } else if (8 === h.nodeType) if (h.data === l$1) v.push({
        type: 2,
        index: r
      });else {
        let t = -1;
        for (; -1 !== (t = h.data.indexOf(n$2, t + 1));) v.push({
          type: 7,
          index: r
        }), t += n$2.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const s = r.createElement("template");
    return s.innerHTML = t, s;
  }
}
function S(t, i) {
  let s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : t;
  let e = arguments.length > 3 ? arguments[3] : undefined;
  var o, n, l, h;
  if (i === T) return i;
  let r = void 0 !== e ? null === (o = s._$Co) || void 0 === o ? void 0 : o[e] : s._$Cl;
  const u = d(i) ? void 0 : i._$litDirective$;
  return (null == r ? void 0 : r.constructor) !== u && (null === (n = null == r ? void 0 : r._$AO) || void 0 === n || n.call(r, false), void 0 === u ? r = void 0 : (r = new u(t), r._$AT(t, s, e)), void 0 !== e ? (null !== (l = (h = s)._$Co) && void 0 !== l ? l : h._$Co = [])[e] = r : s._$Cl = r), void 0 !== r && (i = S(t, r._$AS(t, i.values), r, e)), i;
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
    var i;
    const {
        el: {
          content: s
        },
        parts: e
      } = this._$AD,
      o = (null !== (i = null == t ? void 0 : t.creationScope) && void 0 !== i ? i : r).importNode(s, true);
    C.currentNode = o;
    let n = C.nextNode(),
      l = 0,
      h = 0,
      u = e[0];
    for (; void 0 !== u;) {
      if (l === u.index) {
        let i;
        2 === u.type ? i = new R(n, n.nextSibling, this, t) : 1 === u.type ? i = new u.ctor(n, u.name, u.strings, this, t) : 6 === u.type && (i = new Z(n, this, t)), this._$AV.push(i), u = e[++h];
      }
      l !== (null == u ? void 0 : u.index) && (n = C.nextNode(), l++);
    }
    return C.currentNode = r, o;
  }
  v(t) {
    let i = 0;
    for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class R {
  constructor(t, i, s, e) {
    var o;
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cp = null === (o = null == e ? void 0 : e.isConnected) || void 0 === o || o;
  }
  get _$AU() {
    var t, i;
    return null !== (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== i ? i : this._$Cp;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return void 0 !== i && 11 === (null == t ? void 0 : t.nodeType) && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
    t = S(this, t, i), d(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== T && this._(t) : void 0 !== t._$litType$ ? this.g(t) : void 0 !== t.nodeType ? this.$(t) : v(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== A && d(this._$AH) ? this._$AA.nextSibling.data = t : this.$(r.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var i;
    const {
        values: s,
        _$litType$: e
      } = t,
      o = "number" == typeof e ? this._$AC(t) : (void 0 === e.el && (e.el = N.createElement(P(e.h, e.h[0]), this.options)), e);
    if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === o) this._$AH.v(s);else {
      const t = new M(o, this),
        i = t.u(this.options);
      t.v(s), this.$(i), this._$AH = t;
    }
  }
  _$AC(t) {
    let i = E.get(t.strings);
    return void 0 === i && E.set(t.strings, i = new N(t)), i;
  }
  T(t) {
    c(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s,
      e = 0;
    for (const o of t) e === i.length ? i.push(s = new R(this.k(u()), this.k(u()), this, this.options)) : s = i[e], s._$AI(o), e++;
    e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
  }
  _$AR() {
    let t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._$AA.nextSibling;
    let i = arguments.length > 1 ? arguments[1] : undefined;
    var s;
    for (null === (s = this._$AP) || void 0 === s || s.call(this, false, true, i); t && t !== this._$AB;) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var i;
    void 0 === this._$AM && (this._$Cp = t, null === (i = this._$AP) || void 0 === i || i.call(this, t));
  }
}
class k {
  constructor(t, i, s, e, o) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = o, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
    let s = arguments.length > 2 ? arguments[2] : undefined;
    let e = arguments.length > 3 ? arguments[3] : undefined;
    const o = this.strings;
    let n = false;
    if (void 0 === o) t = S(this, t, i, 0), n = !d(t) || t !== this._$AH && t !== T, n && (this._$AH = t);else {
      const e = t;
      let l, h;
      for (t = o[0], l = 0; l < o.length - 1; l++) h = S(this, e[s + l], i, l), h === T && (h = this._$AH[l]), n || (n = !d(h) || h !== this._$AH[l]), h === A ? t = A : t !== A && (t += (null != h ? h : "") + o[l + 1]), this._$AH[l] = h;
    }
    n && !e && this.j(t);
  }
  j(t) {
    t === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === A ? void 0 : t;
  }
}
const I = s$1 ? s$1.emptyScript : "";
class L extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
  }
}
class z extends k {
  constructor(t, i, s, e, o) {
    super(t, i, s, e, o), this.type = 5;
  }
  _$AI(t) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
    var s;
    if ((t = null !== (s = S(this, t, i, 0)) && void 0 !== s ? s : A) === T) return;
    const e = this._$AH,
      o = t === A && e !== A || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive,
      n = t !== A && (e === A || o);
    o && this.element.removeEventListener(this.name, this, e), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i, s;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s = null === (i = this.options) || void 0 === i ? void 0 : i.host) && void 0 !== s ? s : this.element, t) : this._$AH.handleEvent(t);
  }
}
class Z {
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
const B = i.litHtmlPolyfillSupport;
null == B || B(N, R), (null !== (t = i.litHtmlVersions) && void 0 !== t ? t : i.litHtmlVersions = []).push("2.8.0");
const D = (t, i, s) => {
  var e, o;
  const n = null !== (e = null == s ? void 0 : s.renderBefore) && void 0 !== e ? e : i;
  let l = n._$litPart$;
  if (void 0 === l) {
    const t = null !== (o = null == s ? void 0 : s.renderBefore) && void 0 !== o ? o : null;
    n._$litPart$ = l = new R(i.insertBefore(u(), t), t, void 0, null != s ? s : {});
  }
  return l._$AI(t), l;
};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var l, o;
class s extends u$1 {
  constructor() {
    super(...arguments), this.renderOptions = {
      host: this
    }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const i = super.createRenderRoot();
    return null !== (t = (e = this.renderOptions).renderBefore) && void 0 !== t || (e.renderBefore = i.firstChild), i;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = D(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(true);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(false);
  }
  render() {
    return T;
  }
}
s.finalized = true, s._$litElement$ = true, null === (l = globalThis.litElementHydrateSupport) || void 0 === l || l.call(globalThis, {
  LitElement: s
});
const n$1 = globalThis.litElementPolyfillSupport;
null == n$1 || n$1({
  LitElement: s
});
(null !== (o = globalThis.litElementVersions) && void 0 !== o ? o : globalThis.litElementVersions = []).push("3.3.3");

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var n;
null != (null === (n = window.HTMLSlotElement) || void 0 === n ? void 0 : n.prototype.assignedElements) ? (o, n) => o.assignedElements(n) : (o, n) => o.assignedNodes(n).filter(o => o.nodeType === Node.ELEMENT_NODE);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'. See https://lit.dev/msg/deprecated-import-path for more information.");

const SUPPORT_PREVIOUS_TRACK = 16;
const SUPPORT_NEXT_TRACK = 32;
const SUPPORT_TURN_OFF = 256;
const SUPPORT_SHUFFLE = 4096;
const SUPPORT_REPEAT_SET = 262144;
window.customCards = window.customCards || [];
window.customCards.push({
  type: "yet-another-media-player",
  name: "Yet Another Media Player",
  description: "A multi-entity, feature-rich media card for Home Assistant."
});
class YetAnotherMediaPlayerCard extends s {
  _supportsFeature(stateObj, featureBit) {
    if (!stateObj || typeof stateObj.attributes.supported_features !== "number") return false;
    return (stateObj.attributes.supported_features & featureBit) !== 0;
  }
  get sortedEntityIds() {
    return [...this.entityIds].sort((a, b) => {
      const tA = this._playTimestamps[a] || 0;
      const tB = this._playTimestamps[b] || 0;
      return tB - tA;
    });
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
    }
  };
  static styles = (() => i$1`
    :host {
      --custom-accent: var(--accent-color, #ff9800);
    }
    :host([data-match-theme="false"]) {
      --custom-accent: #ff9800;
    }
  .card-artwork-spacer {
    width: 100%;
    height: 180px; 
    pointer-events: none;
  }
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-size: cover;
    background-position: center;
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
    gap: 6px;
    padding: 2px 0;
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
    border-radius: 8px;                  /* Squarer corners */
    padding: 12px 20px;                  /* Taller chip, wider text space */
    background: var(--chip-action-bg, #222); /* Contrasting bg (override in theme if you want) */
    color: var(--primary-text-color, #fff);
    font-weight: 600;                    /* Bolder */
    font-size: 1.1em;
    cursor: pointer;
    border: 2px solid var(--custom-accent); /* Subtle border */
    margin-top: 2px;                     /* Space above */
    margin-bottom: 4px;                  /* Space below */
    outline: none;
    opacity: 0.95;
    transition: background 0.2s, opacity 0.2s;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-block;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10); /* Slight shadow */
  }
  .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    opacity: 1;
  }

  .chip {
    display: flex;           /* Flexbox for vertical centering */
    align-items: center;     /* Vertically center content */
    border-radius: 24px;
    padding: 6px 20px 6px 8px;
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
    .chip[playing] {
      padding-right: 26px;
    }
      .chip[selected] {
        background: var(--custom-accent);
        color: #fff;
        opacity: 1;
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
    .progress-bar-container {
      padding-left: 24px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    .title {
      font-size: 1.1em;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
      padding: 0 16px 12px 16px;
      justify-content: space-between;
    }
    .vol-slider {
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: rgba(255,255,255,0.22);
      border-radius: 3px;
      outline: none;
      box-shadow: 0 0 6px 1px rgba(0,0,0,0.32), 0 0 1px 1px rgba(255,255,255,0.13);
      flex: 1 1 auto;
      min-width: 80px;
      max-width: none;
      margin-right: 12px;
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
      .chip[selected] {
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
        background: #e0e0e0;
        color: #222;
      }
      .action-chip:active {
        background: var(--accent-color, #1976d2);
        color: #fff;
      }
      /* Keep source menu text white when expanded (matches controls) */
      .card-lower-content:not(.collapsed) .source-menu-btn,
      .card-lower-content:not(.collapsed) .source-selected {
        color: #fff !important;
      }
      /* Only for collapsed cards: override details/title color */
      .card-lower-content.collapsed .details .title,
      .card-lower-content.collapsed .title {
        color: #222 !important;
      }
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
  .card-lower-content-bg {
    position: relative;
    width: 100%;
    min-height: 320px;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
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
  .card-lower-content.collapsed .artist {
    opacity: 0;
    pointer-events: none;
  }
  .card-lower-content.collapsed .card-artwork-spacer {
    opacity: 0;
    pointer-events: none;
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
  `)();
  constructor() {
    super();
    this._selectedIndex = 0;
    this._lastPlaying = null;
    this._manualSelect = false;
    this._playTimestamps = {};
    this._showSourceMenu = false;
    this._shouldDropdownOpenUp = false;
    // Progress bar timer
    this._progressTimer = null;
    this._progressValue = null;
    this._lastProgressEntityId = null;
    this._pinnedIndex = null;
    // Accent color property for custom accent (updated in setConfig)
    this._customAccent = "#ff9800";
    // For outside click detection on source dropdown
    this._sourceDropdownOutsideHandler = null;
    this._isActuallyCollapsed = false;
    // On initial load, collapse immediately if nothing is playing
    setTimeout(() => {
      if (this.hass && this.entityIds && this.entityIds.length > 0) {
        const stateObj = this.hass.states[this.entityIds[this._selectedIndex]];
        if (stateObj && stateObj.state !== "playing") {
          this._isActuallyCollapsed = true;
          this.requestUpdate();
        }
      }
    }, 0);
    this._collapseTimeout = null;
  }
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("You must define at least one media_player entity.");
    }
    this.config = config;
    this._selectedIndex = 0;
    this._lastPlaying = null;
    // Update custom accent property
    // match_theme is YAML-only. If provided as true, use theme accent color; if false or undefined, use default accent.
    if (this.config.match_theme === true) {
      // Try to get CSS var --accent-color
      const cssAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
      this._customAccent = cssAccent || "#ff9800";
    } else {
      this._customAccent = "#ff9800";
    }
    // Update data-match-theme attribute on the host (YAML-only)
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    // collapse_on_idle config option (default to false)
    this._collapseOnIdle = !!config.collapse_on_idle;
    // always_collapsed config option (default to false)
    this._alwaysCollapsed = !!config.always_collapsed;
  }
  get entityObjs() {
    return this.config.entities.map(e => typeof e === "string" ? {
      entity_id: e,
      name: ""
    } : {
      entity_id: e.entity_id,
      name: e.name || ""
    });
  }
  get entityIds() {
    return this.entityObjs.map(e => e.entity_id);
  }
  getChipName(entity_id) {
    const obj = this.entityObjs.find(e => e.entity_id === entity_id);
    if (obj && obj.name) return obj.name;
    const state = this.hass.states[entity_id];
    return (state === null || state === void 0 ? void 0 : state.attributes.friendly_name) || entity_id;
  }
  get currentEntityId() {
    return this.entityIds[this._selectedIndex];
  }
  get currentStateObj() {
    if (!this.hass || !this.currentEntityId) return null;
    return this.hass.states[this.currentEntityId];
  }
  updated(changedProps) {
    var _super$updated;
    if (this.hass && this.entityIds) {
      // Update play timestamps for entities that are playing
      this.entityIds.forEach(id => {
        const state = this.hass.states[id];
        if (state && state.state === "playing") {
          this._playTimestamps[id] = Date.now();
        }
      });

      // Only auto-switch if not manually pinned
      if (!this._manualSelect) {
        // Find the most recently playing entity
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

    // Progress bar timer logic
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

    // Collapse debounce logic for collapse_on_idle
    if (this._collapseOnIdle) {
      const stateObj = this.currentStateObj;
      if (stateObj && stateObj.state === "playing") {
        // If playing, cancel any collapse timeout and expand immediately
        if (this._collapseTimeout) clearTimeout(this._collapseTimeout);
        this._collapseTimeout = null;
        if (this._isActuallyCollapsed) {
          this._isActuallyCollapsed = false;
          this.requestUpdate();
        }
      } else {
        // Only debounce collapse if card isn't already collapsed (chip switch or initial load already handled it)
        if (!this._isActuallyCollapsed && !this._collapseTimeout) {
          this._collapseTimeout = setTimeout(() => {
            this._isActuallyCollapsed = true;
            this._collapseTimeout = null;
            this.requestUpdate();
          }, 2000); // 2 seconds debounce for normal idle
        }
        // If the card is already collapsed (e.g. due to chip switch), do nothing—skip debounce
      }
    }
  }
  _toggleSourceMenu() {
    this._showSourceMenu = !this._showSourceMenu;
    if (this._showSourceMenu) {
      this._manualSelect = true;
      setTimeout(() => {
        this._shouldDropdownOpenUp = true;
        this.requestUpdate();
        // Add outside click/touch handler after dropdown is rendered
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
      // If click/tap is not inside dropdown or button, close
      // evt.composedPath() includes shadow DOM path
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
    this._showSourceMenu = false;
    this.hass.callService("media_player", "select_source", {
      entity_id: entity,
      source: src
    });
  }
  _onPinClick(e) {
    e.stopPropagation();
    this._manualSelect = false;
    this._pinnedIndex = null;
  }
  _onChipClick(idx) {
    this._selectedIndex = idx;
    this._manualSelect = true;
    this._pinnedIndex = idx;
    clearTimeout(this._manualSelectTimeout);
    // Collapse logic on chip switch
    const stateObj = this.hass.states[this.entityIds[idx]];
    if (stateObj && stateObj.state !== "playing") {
      this._isActuallyCollapsed = true;
    } else {
      this._isActuallyCollapsed = false;
    }
    this.requestUpdate();
  }
  _onActionChipClick(idx) {
    const action = this.config.actions[idx];
    if (!action) return;
    const [domain, service] = action.service.split(".");

    // Clone the service data
    let data = {
      ...(action.service_data || {})
    };

    // Replace entity_id "current" (or similar placeholder) with currentEntityId
    if (data.entity_id === "current" || data.entity_id === "$current" || data.entity_id === "this" || !data.entity_id // Optionally default if omitted
    ) {
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
        this.hass.callService("media_player", "turn_off", {
          entity_id: entity
        });
        break;
    }
  }
  _onVolumeChange(e) {
    const entity = this.currentEntityId;
    if (!entity) return;
    const vol = Number(e.target.value);
    this.hass.callService("media_player", "volume_set", {
      entity_id: entity,
      volume_level: vol
    });
  }
  _onVolumeStep(direction) {
    const entity = this.currentEntityId;
    if (!entity) return;
    const stateObj = this.currentStateObj;
    if (!stateObj) return;
    let current = Number(stateObj.attributes.volume_level || 0);
    current += direction * 0.05;
    current = Math.max(0, Math.min(1, current));
    this.hass.callService("media_player", "volume_set", {
      entity_id: entity,
      volume_level: current
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
    if (!this.hass || !this.config) return A;
    // Set data-match-theme attribute on the host (YAML-only)
    if (this.shadowRoot && this.shadowRoot.host) {
      this.shadowRoot.host.setAttribute("data-match-theme", String(this.config.match_theme === true));
    }
    const stateObj = this.currentStateObj;
    if (!stateObj) return x`<div class="details">Entity not found.</div>`;

    // Calculate shuffle/repeat state only AFTER confirming stateObj exists
    const shuffleActive = !!stateObj.attributes.shuffle;
    const repeatActive = stateObj.attributes.repeat && stateObj.attributes.repeat !== "off";

    // Artwork
    const isPlaying = stateObj.state === "playing";
    const isRealArtwork = isPlaying && (stateObj.attributes.entity_picture || stateObj.attributes.album_art);
    isRealArtwork ? stateObj.attributes.entity_picture || stateObj.attributes.album_art : null;
    // Details
    const title = isPlaying ? stateObj.attributes.media_title || "" : "";
    const artist = isPlaying ? stateObj.attributes.media_artist || stateObj.attributes.media_series_title || "" : "";
    let pos = stateObj.attributes.media_position || 0;
    const duration = stateObj.attributes.media_duration || 0;
    if (stateObj.state === "playing") {
      const updatedAt = stateObj.attributes.media_position_updated_at ? Date.parse(stateObj.attributes.media_position_updated_at) : Date.parse(stateObj.last_changed);
      const elapsed = (Date.now() - updatedAt) / 1000;
      pos += elapsed;
    }
    const progress = duration ? Math.min(1, pos / duration) : 0;

    // Volume
    const vol = Number(stateObj.attributes.volume_level || 0);
    const showSlider = this.config.volume_mode !== "stepper";

    // Collapse artwork/details on idle if configured and/or always_collapsed
    const collapsed = this._alwaysCollapsed ? true : this._collapseOnIdle ? this._isActuallyCollapsed : false;
    // Use null if not playing or no artwork available
    const artworkUrl = stateObj && stateObj.state === "playing" && (stateObj.attributes.entity_picture || stateObj.attributes.album_art) ? stateObj.attributes.entity_picture || stateObj.attributes.album_art : null;
    return x`
        <div style="position:relative;">
          <div style="position:relative; z-index:2;"
            data-match-theme="${String(this.config.match_theme === true)}"
          >
            <div class="chip-row">
              ${this.sortedEntityIds.map(id => {
      const state = this.hass.states[id];
      const isPlaying = state && state.state === "playing";
      // miniArt: show if playing and has entity_picture or album_art
      let miniArt = null;
      if (isPlaying && (state !== null && state !== void 0 && state.attributes.entity_picture || state !== null && state !== void 0 && state.attributes.album_art)) {
        miniArt = state.attributes.entity_picture || state.attributes.album_art;
      }
      // entityIcon: icon attribute or fallback
      const entityIcon = (state === null || state === void 0 ? void 0 : state.attributes.icon) || "mdi:cast";
      return x`
                  <button
                    class="chip"
                    ?selected=${this.currentEntityId === id}
                    ?playing=${isPlaying}
                    @click=${() => this._onChipClick(this.entityIds.indexOf(id))}
                    @mousedown=${e => {
        var _this$_handleChipTouc;
        return (_this$_handleChipTouc = this._handleChipTouchStart) === null || _this$_handleChipTouc === void 0 ? void 0 : _this$_handleChipTouc.call(this, e, id);
      }}
                    @mouseup=${e => {
        var _this$_handleChipTouc2;
        return (_this$_handleChipTouc2 = this._handleChipTouchEnd) === null || _this$_handleChipTouc2 === void 0 ? void 0 : _this$_handleChipTouc2.call(this, e, id);
      }}
                    @touchstart=${e => {
        var _this$_handleChipTouc3;
        return (_this$_handleChipTouc3 = this._handleChipTouchStart) === null || _this$_handleChipTouc3 === void 0 ? void 0 : _this$_handleChipTouc3.call(this, e, id);
      }}
                    @touchend=${e => {
        var _this$_handleChipTouc4;
        return (_this$_handleChipTouc4 = this._handleChipTouchEnd) === null || _this$_handleChipTouc4 === void 0 ? void 0 : _this$_handleChipTouc4.call(this, e, id);
      }}
                  >
                    <span class="chip-icon">
                      ${miniArt ? x`<img class="chip-mini-art" src="${miniArt}" alt="artwork" />` : x`<ha-icon icon="${entityIcon}" style="font-size: 28px;"></ha-icon>`}
                    </span>
                    ${this.getChipName(id)}
                    ${this._manualSelect && this._pinnedIndex === this.entityIds.indexOf(id) ? x`
                          <button class="chip-pin" title="Unpin and resume auto-switch" @click=${e => this._onPinClick(e)}>
                            <ha-icon icon="mdi:pin"></ha-icon>
                          </button>
                        ` : A}
                  </button>
                `;
    })}
            </div>
            ${this.config.actions && this.config.actions.length ? x`
                  <div class="action-chip-row">
                    ${this.config.actions.map((a, idx) => x`
                        <button class="action-chip" @click=${() => this._onActionChipClick(idx)}>
                          ${a.icon ? x`<ha-icon icon="${a.icon}" style="font-size: 22px; margin-right: ${a.name ? '8px' : '0'};"></ha-icon>` : A}
                          ${a.name || ""}
                        </button>
                      `)}
                  </div>
                ` : A}
            <div class="card-lower-content-bg"
              style="
                background-image: ${collapsed ? "none" : artworkUrl ? `url('${artworkUrl}')` : "none"};
                min-height: ${collapsed ? "0px" : "320px"};
                background-size: cover;
                background-position: top center;
                background-repeat: no-repeat;
                transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s;
              "
            >
              <div class="card-lower-fade"></div>
              <div class="card-lower-content${collapsed ? ' collapsed transitioning' : ' transitioning'}">
                ${!collapsed ? x`<div class="card-artwork-spacer"></div>` : A}
                ${!collapsed && !artworkUrl ? x`
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
                ` : A}
                <div class="details">
                  <div class="title">
                    ${isPlaying ? title : ""}
                  </div>
                  ${!collapsed ? x`
                        <div class="artist">
                          ${isPlaying ? artist : ""}
                        </div>
                      ` : x`
                        <div class="artist"></div>
                      `}
                </div>
                ${isPlaying && duration && !collapsed ? x`
                      <div class="progress-bar-container">
                        <div
                          class="progress-bar"
                          @click=${e => this._onProgressBarClick(e)}
                          title="Seek"
                        >
                          <div class="progress-inner" style="width: ${progress * 100}%;"></div>
                        </div>
                      </div>
                    ` : x`
                      <div class="progress-bar-container">
                        <div class="progress-bar" style="visibility:hidden"></div>
                      </div>
                    `}
                <div class="controls-row">
                  ${this._supportsFeature(stateObj, SUPPORT_PREVIOUS_TRACK) ? x`
                    <button class="button" @click=${() => this._onControlClick("prev")} title="Previous">
                      <ha-icon icon="mdi:skip-previous"></ha-icon>
                    </button>
                  ` : A}
                  <button class="button" @click=${() => this._onControlClick("play_pause")} title="Play/Pause">
                    <ha-icon icon=${stateObj.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
                  </button>
                  ${this._supportsFeature(stateObj, SUPPORT_NEXT_TRACK) ? x`
                    <button class="button" @click=${() => this._onControlClick("next")} title="Next">
                      <ha-icon icon="mdi:skip-next"></ha-icon>
                    </button>
                  ` : A}
                  ${this._supportsFeature(stateObj, SUPPORT_SHUFFLE) ? x`
                    <button class="button${shuffleActive ? ' active' : ''}" @click=${() => this._onControlClick("shuffle")} title="Shuffle">
                      <ha-icon icon="mdi:shuffle"></ha-icon>
                    </button>
                  ` : A}
                  ${this._supportsFeature(stateObj, SUPPORT_REPEAT_SET) ? x`
                    <button class="button${repeatActive ? ' active' : ''}" @click=${() => this._onControlClick("repeat")} title="Repeat">
                      <ha-icon icon=${stateObj.attributes.repeat === "one" ? "mdi:repeat-once" : "mdi:repeat"}></ha-icon>
                    </button>
                  ` : A}
                  ${this._supportsFeature(stateObj, SUPPORT_TURN_OFF) ? x`
                    <button class="button" @click=${() => this._onControlClick("power")} title="Power">
                      <ha-icon icon="mdi:power"></ha-icon>
                    </button>
                  ` : A}
                </div>
                <div class="volume-row${Array.isArray(stateObj.attributes.source_list) && stateObj.attributes.source_list.length > 0 ? ' has-source' : ''}">
                  ${showSlider ? x`
                        <input
                          class="vol-slider"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          .value=${vol}
                          @input=${e => this._onVolumeChange(e)}
                          title="Volume"
                        />
                      ` : x`
                        <div class="vol-stepper">
                          <button class="button" @click=${() => this._onVolumeStep(-1)} title="Vol Down">–</button>
                          <span>${Math.round(vol * 100)}%</span>
                          <button class="button" @click=${() => this._onVolumeStep(1)} title="Vol Up">+</button>
                        </div>
                      `}
                  ${Array.isArray(stateObj.attributes.source_list) && stateObj.attributes.source_list.length > 0 && !collapsed ? x`
                    <div class="source-menu">
                      <button class="source-menu-btn" @click=${() => this._toggleSourceMenu()}>
                        <span class="source-selected">
                          ${stateObj.attributes.source || "Source"}
                        </span>
                        <ha-icon icon="mdi:chevron-down"></ha-icon>
                      </button>
                      ${this._showSourceMenu ? x`
                        <div class="source-dropdown${this._shouldDropdownOpenUp ? ' up' : ''}">
                          ${stateObj.attributes.source_list.map(src => x`
                            <div class="source-option" @click=${() => this._selectSource(src)}>${src}</div>
                          `)}
                        </div>
                      ` : A}
                    </div>
                  ` : A}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  }
  disconnectedCallback() {
    var _super$disconnectedCa;
    (_super$disconnectedCa = super.disconnectedCallback) === null || _super$disconnectedCa === void 0 || _super$disconnectedCa.call(this);
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    // Collapse debounce cleanup for collapse_on_idle
    if (this._collapseTimeout) {
      clearTimeout(this._collapseTimeout);
      this._collapseTimeout = null;
    }
    this._removeSourceDropdownOutsideHandler();
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
}
class YetAnotherMediaPlayerEditor extends s {
  static properties = {
    hass: {},
    lovelace: {},
    config: {}
  };
  setConfig(config) {
    this.config = {
      ...config
    };
  }
  get _schema() {
    return [{
      name: "entities",
      selector: {
        entity: {
          multiple: true,
          domain: "media_player"
        }
      }
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
      }
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
      name: "actions",
      selector: {
        array: {
          item_selector: {
            object: {
              name: {
                selector: {
                  text: {}
                }
              },
              service: {
                selector: {
                  text: {}
                }
              },
              service_data: {
                selector: {
                  object: {}
                }
              }
            }
          }
        }
      }
    }];
  }
  render() {
    if (!this.config) return x``;
    const configForEditor = {
      ...this.config,
      entities: (this.config.entities || []).filter(e => typeof e === "string")
      // match_theme is YAML-only: do not expose in editor config
    };
    return x`
      <ha-form
        .hass=${this.hass}
        .data=${configForEditor}
        .schema=${this._schema}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  _valueChanged(ev) {
    const config = ev.detail.value;
    this.config = config;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: {
        config
      }
    }));
  }
}
customElements.define("yet-another-media-player-editor", YetAnotherMediaPlayerEditor);
customElements.define("yet-another-media-player", YetAnotherMediaPlayerCard);
