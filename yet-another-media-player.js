var hl=Object.defineProperty;var pl=(i,e,t)=>e in i?hl(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var ce=(i,e,t)=>pl(i,typeof e!="symbol"?e+"":e,t);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ji=globalThis,Ma=ji.ShadowRoot&&(ji.ShadyCSS===void 0||ji.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pa=Symbol(),_r=new WeakMap;let mr=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==Pa)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Ma&&e===void 0){const a=t!==void 0&&t.length===1;a&&(e=_r.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&_r.set(t,e))}return e}toString(){return this.cssText}};const _l=i=>new mr(typeof i=="string"?i:i+"",void 0,Pa),Me=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((a,s,r)=>a+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[r+1],i[0]);return new mr(t,i,Pa)},ml=(i,e)=>{if(Ma)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const a=document.createElement("style"),s=ji.litNonce;s!==void 0&&a.setAttribute("nonce",s),a.textContent=t.cssText,i.appendChild(a)}},gr=Ma?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return _l(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gl,defineProperty:fl,getOwnPropertyDescriptor:yl,getOwnPropertyNames:vl,getOwnPropertySymbols:bl,getPrototypeOf:xl}=Object,Di=globalThis,fr=Di.trustedTypes,wl=fr?fr.emptyScript:"",kl=Di.reactiveElementPolyfillSupport,Xt=(i,e)=>i,za={toAttribute(i,e){switch(e){case Boolean:i=i?wl:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},yr=(i,e)=>!gl(i,e),vr={attribute:!0,type:String,converter:za,reflect:!1,useDefault:!1,hasChanged:yr};Symbol.metadata??=Symbol("metadata"),Di.litPropertyMetadata??=new WeakMap;let kt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=vr){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,t);s!==void 0&&fl(this.prototype,e,s)}}static getPropertyDescriptor(e,t,a){const{get:s,set:r}=yl(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){const o=s?.call(this);r?.call(this,n),this.requestUpdate(e,o,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??vr}static _$Ei(){if(this.hasOwnProperty(Xt("elementProperties")))return;const e=xl(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Xt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Xt("properties"))){const t=this.properties,a=[...vl(t),...bl(t)];for(const s of a)this.createProperty(s,t[s])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[a,s]of t)this.elementProperties.set(a,s)}this._$Eh=new Map;for(const[t,a]of this.elementProperties){const s=this._$Eu(t,a);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const s of a)t.unshift(gr(s))}else e!==void 0&&t.push(gr(e));return t}static _$Eu(e,t){const a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ml(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(s!==void 0&&a.reflect===!0){const r=(a.converter?.toAttribute!==void 0?a.converter:za).toAttribute(t,a.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const a=this.constructor,s=a._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const r=a.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:za;this._$Em=s;const o=n.fromAttribute(t,r.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,a,s=!1,r){if(e!==void 0){const n=this.constructor;if(s===!1&&(r=this[e]),a??=n.getPropertyOptions(e),!((a.hasChanged??yr)(r,t)||a.useDefault&&a.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:s,wrapped:r},n){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[s,r]of a){const{wrapped:n}=r,o=this[s];n!==!0||this._$AL.has(s)||o===void 0||this.C(s,void 0,r,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};kt.elementStyles=[],kt.shadowRootOptions={mode:"open"},kt[Xt("elementProperties")]=new Map,kt[Xt("finalized")]=new Map,kl?.({ReactiveElement:kt}),(Di.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ja=globalThis,br=i=>i,Fi=ja.trustedTypes,xr=Fi?Fi.createPolicy("lit-html",{createHTML:i=>i}):void 0,wr="$lit$",We=`lit$${Math.random().toFixed(9).slice(2)}$`,kr="?"+We,El=`<${kr}>`,nt=document,ei=()=>nt.createComment(""),ti=i=>i===null||typeof i!="object"&&typeof i!="function",Da=Array.isArray,Sl=i=>Da(i)||typeof i?.[Symbol.iterator]=="function",Fa=`[ 	
\f\r]`,ii=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Er=/-->/g,Sr=/>/g,ot=RegExp(`>|${Fa}(?:([^\\s"'>=/]+)(${Fa}*=${Fa}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ar=/'/g,$r=/"/g,Cr=/^(?:script|style|textarea|title)$/i,Al=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),g=Al(1),qe=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ir=new WeakMap,lt=nt.createTreeWalker(nt,129);function Tr(i,e){if(!Da(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return xr!==void 0?xr.createHTML(e):e}const $l=(i,e)=>{const t=i.length-1,a=[];let s,r=e===2?"<svg>":e===3?"<math>":"",n=ii;for(let o=0;o<t;o++){const l=i[o];let c,d,h=-1,p=0;for(;p<l.length&&(n.lastIndex=p,d=n.exec(l),d!==null);)p=n.lastIndex,n===ii?d[1]==="!--"?n=Er:d[1]!==void 0?n=Sr:d[2]!==void 0?(Cr.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=ot):d[3]!==void 0&&(n=ot):n===ot?d[0]===">"?(n=s??ii,h=-1):d[1]===void 0?h=-2:(h=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?ot:d[3]==='"'?$r:Ar):n===$r||n===Ar?n=ot:n===Er||n===Sr?n=ii:(n=ot,s=void 0);const _=n===ot&&i[o+1].startsWith("/>")?" ":"";r+=n===ii?l+El:h>=0?(a.push(c),l.slice(0,h)+wr+l.slice(h)+We+_):l+We+(h===-2?o:_)}return[Tr(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};let Ra=class jo{constructor({strings:e,_$litType$:t},a){let s;this.parts=[];let r=0,n=0;const o=e.length-1,l=this.parts,[c,d]=$l(e,t);if(this.el=jo.createElement(c,a),lt.currentNode=this.el.content,t===2||t===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=lt.nextNode())!==null&&l.length<o;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(wr)){const p=d[n++],_=s.getAttribute(h).split(We),m=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:m[2],strings:_,ctor:m[1]==="."?Il:m[1]==="?"?Tl:m[1]==="@"?Ml:Ri}),s.removeAttribute(h)}else h.startsWith(We)&&(l.push({type:6,index:r}),s.removeAttribute(h));if(Cr.test(s.tagName)){const h=s.textContent.split(We),p=h.length-1;if(p>0){s.textContent=Fi?Fi.emptyScript:"";for(let _=0;_<p;_++)s.append(h[_],ei()),lt.nextNode(),l.push({type:2,index:++r});s.append(h[p],ei())}}}else if(s.nodeType===8)if(s.data===kr)l.push({type:2,index:r});else{let h=-1;for(;(h=s.data.indexOf(We,h+1))!==-1;)l.push({type:7,index:r}),h+=We.length-1}r++}}static createElement(e,t){const a=nt.createElement("template");return a.innerHTML=e,a}};function Et(i,e,t=i,a){if(e===qe)return e;let s=a!==void 0?t._$Co?.[a]:t._$Cl;const r=ti(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(i),s._$AT(i,t,a)),a!==void 0?(t._$Co??=[])[a]=s:t._$Cl=s),s!==void 0&&(e=Et(i,s._$AS(i,e.values),s,a)),e}let Cl=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,s=(e?.creationScope??nt).importNode(t,!0);lt.currentNode=s;let r=lt.nextNode(),n=0,o=0,l=a[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Ht(r,r.nextSibling,this,e):l.type===1?c=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(c=new Pl(r,this,e)),this._$AV.push(c),l=a[++o]}n!==l?.index&&(r=lt.nextNode(),n++)}return lt.currentNode=nt,s}p(e){let t=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}};class Ht{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,s){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Et(this,e,t),ti(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==qe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Sl(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&ti(this._$AH)?this._$AA.nextSibling.data=e:this.T(nt.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,s=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=Ra.createElement(Tr(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===s)this._$AH.p(t);else{const r=new Cl(s,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=Ir.get(e.strings);return t===void 0&&Ir.set(e.strings,t=new Ra(e)),t}k(e){Da(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,s=0;for(const r of e)s===t.length?t.push(a=new Ht(this.O(ei()),this.O(ei()),this,this.options)):a=t[s],a._$AI(r),s++;s<t.length&&(this._$AR(a&&a._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const a=br(e).nextSibling;br(e).remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class Ri{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,s,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=v}_$AI(e,t=this,a,s){const r=this.strings;let n=!1;if(r===void 0)e=Et(this,e,t,0),n=!ti(e)||e!==this._$AH&&e!==qe,n&&(this._$AH=e);else{const o=e;let l,c;for(e=r[0],l=0;l<r.length-1;l++)c=Et(this,o[a+l],t,l),c===qe&&(c=this._$AH[l]),n||=!ti(c)||c!==this._$AH[l],c===v?e=v:e!==v&&(e+=(c??"")+r[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}let Il=class extends Ri{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},Tl=class extends Ri{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}};class Ml extends Ri{constructor(e,t,a,s,r){super(e,t,a,s,r),this.type=5}_$AI(e,t=this){if((e=Et(this,e,t,0)??v)===qe)return;const a=this._$AH,s=e===v&&a!==v||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,r=e!==v&&(a===v||s);s&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Pl{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){Et(this,e)}}const zl={I:Ht},jl=ja.litHtmlPolyfillSupport;jl?.(Ra,Ht),(ja.litHtmlVersions??=[]).push("3.3.3");const Dl=(i,e,t)=>{const a=t?.renderBefore??e;let s=a._$litPart$;if(s===void 0){const r=t?.renderBefore??null;a._$litPart$=s=new Ht(e.insertBefore(ei(),r),r,void 0,t??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oa=globalThis;let Ye=class extends kt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Dl(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return qe}};Ye._$litElement$=!0,Ye.finalized=!0,Oa.litElementHydrateSupport?.({LitElement:Ye});const Fl=Oa.litElementPolyfillSupport;Fl?.({LitElement:Ye}),(Oa.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oi={ATTRIBUTE:1,CHILD:2},La=i=>(...e)=>({_$litDirective$:i,values:e});let qa=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,a){this._$Ct=e,this._$AM=t,this._$Ci=a}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mr=La(class extends qa{constructor(i){if(super(i),i.type!==Oi.ATTRIBUTE||i.name!=="class"||i.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter(e=>i[e]).join(" ")+" "}update(i,[e]){if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter(a=>a!=="")));for(const a in e)e[a]&&!this.nt?.has(a)&&this.st.add(a);return this.render(e)}const t=i.element.classList;for(const a of this.st)a in e||(t.remove(a),this.st.delete(a));for(const a in e){const s=!!e[a];s===this.st.has(a)||this.nt?.has(a)||(s?(t.add(a),this.st.add(a)):(t.remove(a),this.st.delete(a)))}return qe}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Rl}=zl,Pr=i=>i,Ol=i=>i.strings===void 0,zr=()=>document.createComment(""),ai=(i,e,t)=>{const a=i._$AA.parentNode,s=e===void 0?i._$AB:e._$AA;if(t===void 0){const r=a.insertBefore(zr(),s),n=a.insertBefore(zr(),s);t=new Rl(r,n,i,i.options)}else{const r=t._$AB.nextSibling,n=t._$AM,o=n!==i;if(o){let l;t._$AQ?.(i),t._$AM=i,t._$AP!==void 0&&(l=i._$AU)!==n._$AU&&t._$AP(l)}if(r!==s||o){let l=t._$AA;for(;l!==r;){const c=Pr(l).nextSibling;Pr(a).insertBefore(l,s),l=c}}}return t},ct=(i,e,t=i)=>(i._$AI(e,t),i),Ll={},ql=(i,e=Ll)=>i._$AH=e,Nl=i=>i._$AH,Na=i=>{i._$AR(),i._$AA.remove()};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const si=(i,e)=>{const t=i._$AN;if(t===void 0)return!1;for(const a of t)a._$AO?.(e,!1),si(a,e);return!0},Li=i=>{let e,t;do{if((e=i._$AM)===void 0)break;t=e._$AN,t.delete(i),i=e}while(t?.size===0)},jr=i=>{for(let e;e=i._$AM;i=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(i))break;t.add(i),Bl(e)}};function Vl(i){this._$AN!==void 0?(Li(this),this._$AM=i,jr(this)):this._$AM=i}function Ul(i,e=!1,t=0){const a=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(e)if(Array.isArray(a))for(let r=t;r<a.length;r++)si(a[r],!1),Li(a[r]);else a!=null&&(si(a,!1),Li(a));else si(this,i)}const Bl=i=>{i.type==Oi.CHILD&&(i._$AP??=Ul,i._$AQ??=Vl)};class Hl extends qa{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,a){super._$AT(e,t,a),jr(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(si(this,e),Li(this))}setValue(e){if(Ol(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dr=(i,e,t)=>{const a=new Map;for(let s=e;s<=t;s++)a.set(i[s],s);return a},Gl=La(class extends qa{constructor(i){if(super(i),i.type!==Oi.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,e,t){let a;t===void 0?t=e:e!==void 0&&(a=e);const s=[],r=[];let n=0;for(const o of i)s[n]=a?a(o,n):n,r[n]=t(o,n),n++;return{values:r,keys:s}}render(i,e,t){return this.dt(i,e,t).values}update(i,[e,t,a]){const s=Nl(i),{values:r,keys:n}=this.dt(e,t,a);if(!Array.isArray(s))return this.ut=n,r;const o=this.ut??=[],l=[];let c,d,h=0,p=s.length-1,_=0,m=r.length-1;for(;h<=p&&_<=m;)if(s[h]===null)h++;else if(s[p]===null)p--;else if(o[h]===n[_])l[_]=ct(s[h],r[_]),h++,_++;else if(o[p]===n[m])l[m]=ct(s[p],r[m]),p--,m--;else if(o[h]===n[m])l[m]=ct(s[h],r[m]),ai(i,l[m+1],s[h]),h++,m--;else if(o[p]===n[_])l[_]=ct(s[p],r[_]),ai(i,s[h],s[p]),p--,_++;else if(c===void 0&&(c=Dr(n,_,m),d=Dr(o,h,p)),c.has(o[h]))if(c.has(o[p])){const f=d.get(n[_]),y=f!==void 0?s[f]:null;if(y===null){const b=ai(i,s[h]);ct(b,r[_]),l[_]=b}else l[_]=ct(y,r[_]),ai(i,s[h],y),s[f]=null;_++}else Na(s[p]),p--;else Na(s[h]),h++;for(;_<=m;){const f=ai(i,l[m+1]);ct(f,r[_]),l[_++]=f}for(;h<=p;){const f=s[h++];f!==null&&Na(f)}return this.ut=n,ql(i,l),qe}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ba extends Event{constructor(e){super(ba.eventName,{bubbles:!1}),this.first=e.first,this.last=e.last}}ba.eventName="rangeChanged";class xa extends Event{constructor(e){super(xa.eventName,{bubbles:!1}),this.first=e.first,this.last=e.last}}xa.eventName="visibilityChanged";class wa extends Event{constructor(){super(wa.eventName,{bubbles:!1})}}wa.eventName="unpinned";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Ql{constructor(e){this._element=null;const t=e??window;this._node=t,e&&(this._element=e)}get element(){return this._element||document.scrollingElement||document.documentElement}get scrollTop(){return this.element.scrollTop||window.scrollY}get scrollLeft(){return this.element.scrollLeft||window.scrollX}get scrollHeight(){return this.element.scrollHeight}get scrollWidth(){return this.element.scrollWidth}get viewportHeight(){return this._element?this._element.getBoundingClientRect().height:window.innerHeight}get viewportWidth(){return this._element?this._element.getBoundingClientRect().width:window.innerWidth}get maxScrollTop(){return this.scrollHeight-this.viewportHeight}get maxScrollLeft(){return this.scrollWidth-this.viewportWidth}}class Wl extends Ql{constructor(e,t){super(t),this._clients=new Set,this._retarget=null,this._end=null,this.__destination=null,this.correctingScrollError=!1,this._checkForArrival=this._checkForArrival.bind(this),this._updateManagedScrollTo=this._updateManagedScrollTo.bind(this),this.scrollTo=this.scrollTo.bind(this),this.scrollBy=this.scrollBy.bind(this);const a=this._node;this._originalScrollTo=a.scrollTo,this._originalScrollBy=a.scrollBy,this._originalScroll=a.scroll,this._attach(e)}get _destination(){return this.__destination}get scrolling(){return this._destination!==null}scrollTo(e,t){const a=typeof e=="number"&&typeof t=="number"?{left:e,top:t}:e;this._scrollTo(a)}scrollBy(e,t){const a=typeof e=="number"&&typeof t=="number"?{left:e,top:t}:e;a.top!==void 0&&(a.top+=this.scrollTop),a.left!==void 0&&(a.left+=this.scrollLeft),this._scrollTo(a)}_nativeScrollTo(e){this._originalScrollTo.bind(this._element||window)(e)}_scrollTo(e,t=null,a=null){this._end!==null&&this._end(),e.behavior==="smooth"?(this._setDestination(e),this._retarget=t,this._end=a):this._resetScrollState(),this._nativeScrollTo(e)}_setDestination(e){let{top:t,left:a}=e;return t=t===void 0?void 0:Math.max(0,Math.min(t,this.maxScrollTop)),a=a===void 0?void 0:Math.max(0,Math.min(a,this.maxScrollLeft)),this._destination!==null&&a===this._destination.left&&t===this._destination.top?!1:(this.__destination={top:t,left:a,behavior:"smooth"},!0)}_resetScrollState(){this.__destination=null,this._retarget=null,this._end=null}_updateManagedScrollTo(e){this._destination&&this._setDestination(e)&&this._nativeScrollTo(this._destination)}managedScrollTo(e,t,a){return this._scrollTo(e,t,a),this._updateManagedScrollTo}correctScrollError(e){this.correctingScrollError=!0,requestAnimationFrame(()=>requestAnimationFrame(()=>this.correctingScrollError=!1)),this._nativeScrollTo(e),this._retarget&&this._setDestination(this._retarget()),this._destination&&this._nativeScrollTo(this._destination)}_checkForArrival(){if(this._destination!==null){const{scrollTop:e,scrollLeft:t}=this;let{top:a,left:s}=this._destination;a=Math.min(a||0,this.maxScrollTop),s=Math.min(s||0,this.maxScrollLeft);const r=Math.abs(a-e),n=Math.abs(s-t);r<1&&n<1&&(this._end&&this._end(),this._resetScrollState())}}detach(e){return this._clients.delete(e),this._clients.size===0&&(this._node.scrollTo=this._originalScrollTo,this._node.scrollBy=this._originalScrollBy,this._node.scroll=this._originalScroll,this._node.removeEventListener("scroll",this._checkForArrival)),null}_attach(e){this._clients.add(e),this._clients.size===1&&(this._node.scrollTo=this.scrollTo,this._node.scrollBy=this.scrollBy,this._node.scroll=this.scrollTo,this._node.addEventListener("scroll",this._checkForArrival))}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Fr=typeof window<"u"?window.ResizeObserver:void 0;const Yl=Symbol("virtualizerRef"),qi="virtualizer-sizer";let Rr;class Kl{constructor(e){if(this._benchmarkStart=null,this._layout=null,this._clippingAncestors=[],this._scrollSize=null,this._scrollError=null,this._childrenPos=null,this._childMeasurements=null,this._toBeMeasured=new Map,this._rangeChanged=!0,this._itemsChanged=!0,this._visibilityChanged=!0,this._scrollerController=null,this._isScroller=!1,this._sizer=null,this._hostElementRO=null,this._childrenRO=null,this._mutationObserver=null,this._scrollEventListeners=[],this._scrollEventListenerOptions={passive:!0},this._loadListener=this._childLoaded.bind(this),this._scrollIntoViewTarget=null,this._updateScrollIntoViewCoordinates=null,this._items=[],this._first=-1,this._last=-1,this._firstVisible=-1,this._lastVisible=-1,this._scheduled=new WeakSet,this._measureCallback=null,this._measureChildOverride=null,this._layoutCompletePromise=null,this._layoutCompleteResolver=null,this._layoutCompleteRejecter=null,this._pendingLayoutComplete=null,this._layoutInitialized=null,this._connected=!1,!e)throw new Error("Virtualizer constructor requires a configuration object");if(e.hostElement)this._init(e);else throw new Error('Virtualizer configuration requires the "hostElement" property')}set items(e){Array.isArray(e)&&e!==this._items&&(this._itemsChanged=!0,this._items=e,this._schedule(this._updateLayout))}_init(e){this._isScroller=!!e.scroller,this._initHostElement(e);const t=e.layout||{};this._layoutInitialized=this._initLayout(t)}_initObservers(){this._mutationObserver=new MutationObserver(this._finishDOMUpdate.bind(this)),this._hostElementRO=new Fr(()=>this._hostElementSizeChanged()),this._childrenRO=new Fr(this._childrenSizeChanged.bind(this))}_initHostElement(e){const t=this._hostElement=e.hostElement;this._applyVirtualizerStyles(),t[Yl]=this}connected(){this._initObservers();const e=this._isScroller;this._clippingAncestors=Xl(this._hostElement,e),this._scrollerController=new Wl(this,this._clippingAncestors[0]),this._schedule(this._updateLayout),this._observeAndListen(),this._connected=!0}_observeAndListen(){this._mutationObserver.observe(this._hostElement,{childList:!0}),this._hostElementRO.observe(this._hostElement),this._scrollEventListeners.push(window),window.addEventListener("scroll",this,this._scrollEventListenerOptions),this._clippingAncestors.forEach(e=>{e.addEventListener("scroll",this,this._scrollEventListenerOptions),this._scrollEventListeners.push(e),this._hostElementRO.observe(e)}),this._hostElementRO.observe(this._scrollerController.element),this._children.forEach(e=>this._childrenRO.observe(e)),this._scrollEventListeners.forEach(e=>e.addEventListener("scroll",this,this._scrollEventListenerOptions))}disconnected(){this._scrollEventListeners.forEach(e=>e.removeEventListener("scroll",this,this._scrollEventListenerOptions)),this._scrollEventListeners=[],this._clippingAncestors=[],this._scrollerController?.detach(this),this._scrollerController=null,this._mutationObserver?.disconnect(),this._mutationObserver=null,this._hostElementRO?.disconnect(),this._hostElementRO=null,this._childrenRO?.disconnect(),this._childrenRO=null,this._rejectLayoutCompletePromise("disconnected"),this._connected=!1}_applyVirtualizerStyles(){const t=this._hostElement.style;t.display=t.display||"block",t.position=t.position||"relative",t.contain=t.contain||"size layout",this._isScroller&&(t.overflow=t.overflow||"auto",t.minHeight=t.minHeight||"150px")}_getSizer(){const e=this._hostElement;if(!this._sizer){let t=e.querySelector(`[${qi}]`);t||(t=document.createElement("div"),t.setAttribute(qi,""),e.appendChild(t)),Object.assign(t.style,{position:"absolute",margin:"-2px 0 0 0",padding:0,visibility:"hidden",fontSize:"2px"}),t.textContent="&nbsp;",t.setAttribute(qi,""),this._sizer=t}return this._sizer}async updateLayoutConfig(e){await this._layoutInitialized;const t=e.type||Rr;if(typeof t=="function"&&this._layout instanceof t){const a={...e};return delete a.type,this._layout.config=a,!0}return!1}async _initLayout(e){let t,a;if(typeof e.type=="function"){a=e.type;const s={...e};delete s.type,t=s}else t=e;a===void 0&&(Rr=a=(await Promise.resolve().then(function(){return _p})).FlowLayout),this._layout=new a(s=>this._handleLayoutMessage(s),t),this._layout.measureChildren&&typeof this._layout.updateItemSizes=="function"&&(typeof this._layout.measureChildren=="function"&&(this._measureChildOverride=this._layout.measureChildren),this._measureCallback=this._layout.updateItemSizes.bind(this._layout)),this._layout.listenForChildLoadEvents&&this._hostElement.addEventListener("load",this._loadListener,!0),this._schedule(this._updateLayout)}startBenchmarking(){this._benchmarkStart===null&&(this._benchmarkStart=window.performance.now())}stopBenchmarking(){if(this._benchmarkStart!==null){const e=window.performance.now(),t=e-this._benchmarkStart,s=performance.getEntriesByName("uv-virtualizing","measure").filter(r=>r.startTime>=this._benchmarkStart&&r.startTime<e).reduce((r,n)=>r+n.duration,0);return this._benchmarkStart=null,{timeElapsed:t,virtualizationTime:s}}return null}_measureChildren(){const e={},t=this._children,a=this._measureChildOverride||this._measureChild;for(let s=0;s<t.length;s++){const r=t[s],n=this._first+s;(this._itemsChanged||this._toBeMeasured.has(r))&&(e[n]=a.call(this,r,this._items[n]))}this._childMeasurements=e,this._schedule(this._updateLayout),this._toBeMeasured.clear()}_measureChild(e){const{width:t,height:a}=e.getBoundingClientRect();return Object.assign({width:t,height:a},Zl(e))}async _schedule(e){this._scheduled.has(e)||(this._scheduled.add(e),await Promise.resolve(),this._scheduled.delete(e),e.call(this))}async _updateDOM(e){this._scrollSize=e.scrollSize,this._adjustRange(e.range),this._childrenPos=e.childPositions,this._scrollError=e.scrollError||null;const{_rangeChanged:t,_itemsChanged:a}=this;this._visibilityChanged&&(this._notifyVisibility(),this._visibilityChanged=!1),(t||a)&&(this._notifyRange(),this._rangeChanged=!1),this._finishDOMUpdate()}_finishDOMUpdate(){this._connected&&(this._children.forEach(e=>this._childrenRO.observe(e)),this._checkScrollIntoViewTarget(this._childrenPos),this._positionChildren(this._childrenPos),this._sizeHostElement(this._scrollSize),this._correctScrollError(),this._benchmarkStart&&"mark"in window.performance&&window.performance.mark("uv-end"))}_updateLayout(){this._layout&&this._connected&&(this._layout.items=this._items,this._updateView(),this._childMeasurements!==null&&(this._measureCallback&&this._measureCallback(this._childMeasurements),this._childMeasurements=null),this._layout.reflowIfNeeded(),this._benchmarkStart&&"mark"in window.performance&&window.performance.mark("uv-end"))}_handleScrollEvent(){if(this._benchmarkStart&&"mark"in window.performance){try{window.performance.measure("uv-virtualizing","uv-start","uv-end")}catch(e){console.warn("Error measuring performance data: ",e)}window.performance.mark("uv-start")}this._scrollerController.correctingScrollError===!1&&this._layout?.unpin(),this._schedule(this._updateLayout)}handleEvent(e){e.type==="scroll"?(e.currentTarget===window||this._clippingAncestors.includes(e.currentTarget))&&this._handleScrollEvent():console.warn("event not handled",e)}_handleLayoutMessage(e){e.type==="stateChanged"?this._updateDOM(e):e.type==="visibilityChanged"?(this._firstVisible=e.firstVisible,this._lastVisible=e.lastVisible,this._notifyVisibility()):e.type==="unpinned"&&this._hostElement.dispatchEvent(new wa)}get _children(){const e=[];let t=this._hostElement.firstElementChild;for(;t;)t.hasAttribute(qi)||e.push(t),t=t.nextElementSibling;return e}_updateView(){const e=this._hostElement,t=this._scrollerController?.element,a=this._layout;if(e&&t&&a){let s,r,n,o;const l=e.getBoundingClientRect();s=0,r=0,n=window.innerHeight,o=window.innerWidth;const c=this._clippingAncestors.map(b=>b.getBoundingClientRect());c.unshift(l);for(const b of c)s=Math.max(s,b.top),r=Math.max(r,b.left),n=Math.min(n,b.bottom),o=Math.min(o,b.right);const d=t.getBoundingClientRect(),h={left:l.left-d.left,top:l.top-d.top},p={width:t.scrollWidth,height:t.scrollHeight},_=s-l.top+e.scrollTop,m=r-l.left+e.scrollLeft,f=Math.max(0,n-s),y=Math.max(0,o-r);a.viewportSize={width:y,height:f},a.viewportScroll={top:_,left:m},a.totalScrollSize=p,a.offsetWithinScroller=h}}_sizeHostElement(e){const a=e&&e.width!==null?Math.min(82e5,e.width):0,s=e&&e.height!==null?Math.min(82e5,e.height):0;if(this._isScroller)this._getSizer().style.transform=`translate(${a}px, ${s}px)`;else{const r=this._hostElement.style;r.minWidth=a?`${a}px`:"100%",r.minHeight=s?`${s}px`:"100%"}}_positionChildren(e){e&&e.forEach(({top:t,left:a,width:s,height:r,xOffset:n,yOffset:o},l)=>{const c=this._children[l-this._first];c&&(c.style.position="absolute",c.style.boxSizing="border-box",c.style.transform=`translate(${a}px, ${t}px)`,s!==void 0&&(c.style.width=s+"px"),r!==void 0&&(c.style.height=r+"px"),c.style.left=n===void 0?null:n+"px",c.style.top=o===void 0?null:o+"px")})}async _adjustRange(e){const{_first:t,_last:a,_firstVisible:s,_lastVisible:r}=this;this._first=e.first,this._last=e.last,this._firstVisible=e.firstVisible,this._lastVisible=e.lastVisible,this._rangeChanged=this._rangeChanged||this._first!==t||this._last!==a,this._visibilityChanged=this._visibilityChanged||this._firstVisible!==s||this._lastVisible!==r}_correctScrollError(){if(this._scrollError){const{scrollTop:e,scrollLeft:t}=this._scrollerController,{top:a,left:s}=this._scrollError;this._scrollError=null,this._scrollerController.correctScrollError({top:e-a,left:t-s})}}element(e){return e===1/0&&(e=this._items.length-1),this._items?.[e]===void 0?void 0:{scrollIntoView:(t={})=>this._scrollElementIntoView({...t,index:e})}}_scrollElementIntoView(e){if(e.index>=this._first&&e.index<=this._last)this._children[e.index-this._first].scrollIntoView(e);else if(e.index=Math.min(e.index,this._items.length-1),e.behavior==="smooth"){const t=this._layout.getScrollIntoViewCoordinates(e),{behavior:a}=e;this._updateScrollIntoViewCoordinates=this._scrollerController.managedScrollTo(Object.assign(t,{behavior:a}),()=>this._layout.getScrollIntoViewCoordinates(e),()=>this._scrollIntoViewTarget=null),this._scrollIntoViewTarget=e}else this._layout.pin=e}_checkScrollIntoViewTarget(e){const{index:t}=this._scrollIntoViewTarget||{};t&&e?.has(t)&&this._updateScrollIntoViewCoordinates(this._layout.getScrollIntoViewCoordinates(this._scrollIntoViewTarget))}_notifyRange(){this._hostElement.dispatchEvent(new ba({first:this._first,last:this._last}))}_notifyVisibility(){this._hostElement.dispatchEvent(new xa({first:this._firstVisible,last:this._lastVisible}))}get layoutComplete(){return this._layoutCompletePromise||(this._layoutCompletePromise=new Promise((e,t)=>{this._layoutCompleteResolver=e,this._layoutCompleteRejecter=t})),this._layoutCompletePromise}_rejectLayoutCompletePromise(e){this._layoutCompleteRejecter!==null&&this._layoutCompleteRejecter(e),this._resetLayoutCompleteState()}_scheduleLayoutComplete(){this._layoutCompletePromise&&this._pendingLayoutComplete===null&&(this._pendingLayoutComplete=requestAnimationFrame(()=>requestAnimationFrame(()=>this._resolveLayoutCompletePromise())))}_resolveLayoutCompletePromise(){this._layoutCompleteResolver!==null&&this._layoutCompleteResolver(),this._resetLayoutCompleteState()}_resetLayoutCompleteState(){this._layoutCompletePromise=null,this._layoutCompleteResolver=null,this._layoutCompleteRejecter=null,this._pendingLayoutComplete=null}_hostElementSizeChanged(){this._schedule(this._updateLayout)}_childLoaded(){}_childrenSizeChanged(e){if(this._layout?.measureChildren){for(const t of e)this._toBeMeasured.set(t.target,t.contentRect);this._measureChildren()}this._scheduleLayoutComplete(),this._itemsChanged=!1,this._rangeChanged=!1}}function Zl(i){const e=window.getComputedStyle(i);return{marginTop:Ni(e.marginTop),marginRight:Ni(e.marginRight),marginBottom:Ni(e.marginBottom),marginLeft:Ni(e.marginLeft)}}function Ni(i){const e=i?parseFloat(i):NaN;return Number.isNaN(e)?0:e}function Or(i){if(i.assignedSlot!==null)return i.assignedSlot;if(i.parentElement!==null)return i.parentElement;const e=i.parentNode;return e&&e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host||null}function Jl(i,e=!1){const t=[];let a=e?i:Or(i);for(;a!==null;)t.push(a),a=Or(a);return t}function Xl(i,e=!1){let t=!1;return Jl(i,e).filter(a=>{if(t)return!1;const s=getComputedStyle(a);return t=s.position==="fixed",s.overflow!=="visible"})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ec=i=>i,tc=(i,e)=>g`${e}: ${JSON.stringify(i,null,2)}`;class ic extends Hl{constructor(e){if(super(e),this._virtualizer=null,this._first=0,this._last=-1,this._renderItem=(t,a)=>tc(t,a+this._first),this._keyFunction=(t,a)=>ec(t,a+this._first),this._items=[],e.type!==Oi.CHILD)throw new Error("The virtualize directive can only be used in child expressions")}render(e){e&&this._setFunctions(e);const t=[];if(this._first>=0&&this._last>=this._first)for(let a=this._first;a<=this._last;a++)t.push(this._items[a]);return Gl(t,this._keyFunction,this._renderItem)}update(e,[t]){this._setFunctions(t);const a=this._items!==t.items;return this._items=t.items||[],this._virtualizer?this._updateVirtualizerConfig(e,t):this._initialize(e,t),a?qe:this.render()}async _updateVirtualizerConfig(e,t){if(!await this._virtualizer.updateLayoutConfig(t.layout||{})){const s=e.parentNode;this._makeVirtualizer(s,t)}this._virtualizer.items=this._items}_setFunctions(e){const{renderItem:t,keyFunction:a}=e;t&&(this._renderItem=(s,r)=>t(s,r+this._first)),a&&(this._keyFunction=(s,r)=>a(s,r+this._first))}_makeVirtualizer(e,t){this._virtualizer&&this._virtualizer.disconnected();const{layout:a,scroller:s,items:r}=t;this._virtualizer=new Kl({hostElement:e,layout:a,scroller:s}),this._virtualizer.items=r,this._virtualizer.connected()}_initialize(e,t){const a=e.parentNode;a&&a.nodeType===1&&(a.addEventListener("rangeChanged",s=>{this._first=s.first,this._last=s.last,this.setValue(this.render())}),this._makeVirtualizer(a,t))}disconnected(){this._virtualizer?.disconnected()}reconnected(){this._virtualizer?.connected()}}const Lr=La(ic);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function St(i){return i==="horizontal"?"width":"height"}function qr(i){return i==="horizontal"?"height":"width"}class Nr{_getDefaultConfig(){return{direction:"vertical"}}constructor(e,t){this._latestCoords={left:0,top:0},this._direction=null,this._viewportSize={width:0,height:0},this.totalScrollSize={width:0,height:0},this.offsetWithinScroller={left:0,top:0},this._pendingReflow=!1,this._pendingLayoutUpdate=!1,this._pin=null,this._firstVisible=0,this._lastVisible=0,this._physicalMin=0,this._physicalMax=0,this._first=-1,this._last=-1,this._sizeDim="height",this._secondarySizeDim="width",this._positionDim="top",this._secondaryPositionDim="left",this._scrollPosition=0,this._scrollError=0,this._items=[],this._scrollSize=1,this._overhang=1e3,this._hostSink=e,Promise.resolve().then(()=>this.config=t||this._getDefaultConfig())}set config(e){Object.assign(this,Object.assign({},this._getDefaultConfig(),e))}get config(){return{direction:this.direction}}get items(){return this._items}set items(e){this._setItems(e)}_setItems(e){e!==this._items&&(this._items=e,this._scheduleReflow())}get direction(){return this._direction}set direction(e){e=e==="horizontal"?e:"vertical",e!==this._direction&&(this._direction=e,this._sizeDim=e==="horizontal"?"width":"height",this._secondarySizeDim=e==="horizontal"?"height":"width",this._positionDim=e==="horizontal"?"left":"top",this._secondaryPositionDim=e==="horizontal"?"top":"left",this._triggerReflow())}get viewportSize(){return this._viewportSize}set viewportSize(e){const{_viewDim1:t,_viewDim2:a}=this;Object.assign(this._viewportSize,e),a!==this._viewDim2?this._scheduleLayoutUpdate():t!==this._viewDim1&&this._checkThresholds()}get viewportScroll(){return this._latestCoords}set viewportScroll(e){Object.assign(this._latestCoords,e);const t=this._scrollPosition;this._scrollPosition=this._latestCoords[this._positionDim],Math.abs(t-this._scrollPosition)>=1&&this._checkThresholds()}reflowIfNeeded(e=!1){(e||this._pendingReflow)&&(this._pendingReflow=!1,this._reflow())}set pin(e){this._pin=e,this._triggerReflow()}get pin(){if(this._pin!==null){const{index:e,block:t}=this._pin;return{index:Math.max(0,Math.min(e,this.items.length-1)),block:t}}return null}_clampScrollPosition(e){return Math.max(-this.offsetWithinScroller[this._positionDim],Math.min(e,this.totalScrollSize[St(this.direction)]-this._viewDim1))}unpin(){this._pin!==null&&(this._sendUnpinnedMessage(),this._pin=null)}_updateLayout(){}get _viewDim1(){return this._viewportSize[this._sizeDim]}get _viewDim2(){return this._viewportSize[this._secondarySizeDim]}_scheduleReflow(){this._pendingReflow=!0}_scheduleLayoutUpdate(){this._pendingLayoutUpdate=!0,this._scheduleReflow()}_triggerReflow(){this._scheduleLayoutUpdate(),Promise.resolve().then(()=>this.reflowIfNeeded())}_reflow(){this._pendingLayoutUpdate&&(this._updateLayout(),this._pendingLayoutUpdate=!1),this._updateScrollSize(),this._setPositionFromPin(),this._getActiveItems(),this._updateVisibleIndices(),this._sendStateChangedMessage()}_setPositionFromPin(){if(this.pin!==null){const e=this._scrollPosition,{index:t,block:a}=this.pin;this._scrollPosition=this._calculateScrollIntoViewPosition({index:t,block:a||"start"})-this.offsetWithinScroller[this._positionDim],this._scrollError=e-this._scrollPosition}}_calculateScrollIntoViewPosition(e){const{block:t}=e,a=Math.min(this.items.length,Math.max(0,e.index)),s=this._getItemPosition(a)[this._positionDim];let r=s;if(t!=="start"){const n=this._getItemSize(a)[this._sizeDim];if(t==="center")r=s-.5*this._viewDim1+.5*n;else{const o=s-this._viewDim1+n;if(t==="end")r=o;else{const l=this._scrollPosition;r=Math.abs(l-s)<Math.abs(l-o)?s:o}}}return r+=this.offsetWithinScroller[this._positionDim],this._clampScrollPosition(r)}getScrollIntoViewCoordinates(e){return{[this._positionDim]:this._calculateScrollIntoViewPosition(e)}}_sendUnpinnedMessage(){this._hostSink({type:"unpinned"})}_sendVisibilityChangedMessage(){this._hostSink({type:"visibilityChanged",firstVisible:this._firstVisible,lastVisible:this._lastVisible})}_sendStateChangedMessage(){const e=new Map;if(this._first!==-1&&this._last!==-1)for(let a=this._first;a<=this._last;a++)e.set(a,this._getItemPosition(a));const t={type:"stateChanged",scrollSize:{[this._sizeDim]:this._scrollSize,[this._secondarySizeDim]:null},range:{first:this._first,last:this._last,firstVisible:this._firstVisible,lastVisible:this._lastVisible},childPositions:e};this._scrollError&&(t.scrollError={[this._positionDim]:this._scrollError,[this._secondaryPositionDim]:0},this._scrollError=0),this._hostSink(t)}get _num(){return this._first===-1||this._last===-1?0:this._last-this._first+1}_checkThresholds(){if(this._viewDim1===0&&this._num>0||this._pin!==null)this._scheduleReflow();else{const e=Math.max(0,this._scrollPosition-this._overhang),t=Math.min(this._scrollSize,this._scrollPosition+this._viewDim1+this._overhang);this._physicalMin>e||this._physicalMax<t?this._scheduleReflow():this._updateVisibleIndices({emit:!0})}}_updateVisibleIndices(e){if(this._first===-1||this._last===-1)return;let t=this._first;for(;t<this._last&&Math.round(this._getItemPosition(t)[this._positionDim]+this._getItemSize(t)[this._sizeDim])<=Math.round(this._scrollPosition);)t++;let a=this._last;for(;a>this._first&&Math.round(this._getItemPosition(a)[this._positionDim])>=Math.round(this._scrollPosition+this._viewDim1);)a--;(t!==this._firstVisible||a!==this._lastVisible)&&(this._firstVisible=t,this._lastVisible=a,e&&e.emit&&this._sendVisibilityChangedMessage())}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ac(i){return i==="match-gap"?1/0:parseInt(i)}function sc(i){return i==="auto"?1/0:parseInt(i)}function rc(i){return i==="horizontal"?"column":"row"}function Vr(i){return i==="horizontal"?"row":"column"}function nc(i){return i==="horizontal"?["left","right"]:["top","bottom"]}function oc(i){return i==="horizontal"?["top","bottom"]:["left","right"]}class lc extends Nr{constructor(){super(...arguments),this._itemSize={},this._gaps={},this._padding={}}_getDefaultConfig(){return Object.assign({},super._getDefaultConfig(),{itemSize:{width:"300px",height:"300px"},gap:"8px",padding:"match-gap"})}get _gap(){return this._gaps.row}get _idealSize(){return this._itemSize[St(this.direction)]}get _idealSize1(){return this._itemSize[St(this.direction)]}get _idealSize2(){return this._itemSize[qr(this.direction)]}get _gap1(){return this._gaps[rc(this.direction)]}get _gap2(){return this._gaps[Vr(this.direction)]}get _padding1(){const e=this._padding,[t,a]=nc(this.direction);return[e[t],e[a]]}get _padding2(){const e=this._padding,[t,a]=oc(this.direction);return[e[t],e[a]]}set itemSize(e){const t=this._itemSize;typeof e=="string"&&(e={width:e,height:e});const a=parseInt(e.width),s=parseInt(e.height);a!==t.width&&(t.width=a,this._triggerReflow()),s!==t.height&&(t.height=s,this._triggerReflow())}set gap(e){this._setGap(e)}_setGap(e){const t=e.split(" ").map(s=>sc(s)),a=this._gaps;t[0]!==a.row&&(a.row=t[0],this._triggerReflow()),t[1]===void 0?t[0]!==a.column&&(a.column=t[0],this._triggerReflow()):t[1]!==a.column&&(a.column=t[1],this._triggerReflow())}set padding(e){const t=this._padding,a=e.split(" ").map(s=>ac(s));a.length===1?(t.top=t.right=t.bottom=t.left=a[0],this._triggerReflow()):a.length===2?(t.top=t.bottom=a[0],t.right=t.left=a[1],this._triggerReflow()):a.length===3?(t.top=a[0],t.right=t.left=a[1],t.bottom=a[2],this._triggerReflow()):a.length===4&&(["top","right","bottom","left"].forEach((s,r)=>t[s]=a[r]),this._triggerReflow())}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class cc extends lc{constructor(){super(...arguments),this._metrics=null,this.flex=null,this.justify=null}_getDefaultConfig(){return Object.assign({},super._getDefaultConfig(),{flex:!1,justify:"start"})}set gap(e){super._setGap(e)}_updateLayout(){const e=this.justify,[t,a]=this._padding1,[s,r]=this._padding2;["_gap1","_gap2"].forEach(c=>{const d=this[c];if(d===1/0&&!["space-between","space-around","space-evenly"].includes(e))throw new Error("grid layout: gap can only be set to 'auto' when justify is set to 'space-between', 'space-around' or 'space-evenly'");if(d===1/0&&c==="_gap2")throw new Error(`grid layout: ${Vr(this.direction)}-gap cannot be set to 'auto' when direction is set to ${this.direction}`)});const n=this.flex||["start","center","end"].includes(e),o={rolumns:-1,itemSize1:-1,itemSize2:-1,gap1:this._gap1===1/0?-1:this._gap1,gap2:n?this._gap2:0,padding1:{start:t===1/0?this._gap1:t,end:a===1/0?this._gap1:a},padding2:n?{start:s===1/0?this._gap2:s,end:r===1/0?this._gap2:r}:{start:0,end:0},positions:[]},l=this._viewDim2-o.padding2.start-o.padding2.end;if(l<=0)o.rolumns=0;else{const c=n?o.gap2:0;let d=0,h=0;if(l>=this._idealSize2&&(d=Math.floor((l-this._idealSize2)/(this._idealSize2+c))+1,h=d*this._idealSize2+(d-1)*c),this.flex)switch((l-h)/(this._idealSize2+c)>=.5&&(d=d+1),o.rolumns=d,o.itemSize2=Math.round((l-c*(d-1))/d),this.flex===!0?"area":this.flex.preserve){case"aspect-ratio":o.itemSize1=Math.round(this._idealSize1/this._idealSize2*o.itemSize2);break;case St(this.direction):o.itemSize1=Math.round(this._idealSize1);break;default:o.itemSize1=Math.round(this._idealSize1*this._idealSize2/o.itemSize2)}else o.itemSize1=this._idealSize1,o.itemSize2=this._idealSize2,o.rolumns=d;let p;if(n){const _=o.rolumns*o.itemSize2+(o.rolumns-1)*o.gap2;p=this.flex||e==="start"?o.padding2.start:e==="end"?this._viewDim2-o.padding2.end-_:Math.round(this._viewDim2/2-_/2)}else{const _=l-o.rolumns*o.itemSize2;e==="space-between"?(o.gap2=Math.round(_/(o.rolumns-1)),p=0):e==="space-around"?(o.gap2=Math.round(_/o.rolumns),p=Math.round(o.gap2/2)):(o.gap2=Math.round(_/(o.rolumns+1)),p=o.gap2),this._gap1===1/0&&(o.gap1=o.gap2,t===1/0&&(o.padding1.start=p),a===1/0&&(o.padding1.end=p))}for(let _=0;_<o.rolumns;_++)o.positions.push(p),p+=o.itemSize2+o.gap2}this._metrics=o}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class dc extends cc{get _delta(){return this._metrics.itemSize1+this._metrics.gap1}_getItemSize(e){return{[this._sizeDim]:this._metrics.itemSize1,[this._secondarySizeDim]:this._metrics.itemSize2}}_getActiveItems(){const e=this._metrics,{rolumns:t}=e;if(t===0)this._first=-1,this._last=-1,this._physicalMin=0,this._physicalMax=0;else{const{padding1:a}=e,s=Math.max(0,this._scrollPosition-this._overhang),r=Math.min(this._scrollSize,this._scrollPosition+this._viewDim1+this._overhang),n=Math.max(0,Math.floor((s-a.start)/this._delta)),o=Math.max(0,Math.ceil((r-a.start)/this._delta));this._first=n*t,this._last=Math.min(o*t-1,this.items.length-1),this._physicalMin=a.start+this._delta*n,this._physicalMax=a.start+this._delta*o}}_getItemPosition(e){const{rolumns:t,padding1:a,positions:s,itemSize1:r,itemSize2:n}=this._metrics;return{[this._positionDim]:a.start+Math.floor(e/t)*this._delta,[this._secondaryPositionDim]:s[e%t],[St(this.direction)]:r,[qr(this.direction)]:n}}_updateScrollSize(){const{rolumns:e,gap1:t,padding1:a,itemSize1:s}=this._metrics;let r=1;if(e>0){const n=Math.ceil(this.items.length/e);r=a.start+n*s+(n-1)*t+a.end}this._scrollSize=r}}class uc extends dc{constructor(e,t){super(e,t),this._columns=t?.columns||4,this.flex={preserve:"aspect-ratio"},this.justify="start";const a=t?.itemSize?.width||150,s=t?.itemSize?.height||195,r=parseInt(a)||150,n=parseInt(s)||195;this._aspectRatio=n/r,this._extraHeight=n-r}set columns(e){e!==this._columns&&(this._columns=e,this._triggerReflow())}get columns(){return this._columns}set itemSize(e){if(super.itemSize=e,e){const t=parseInt(e.width)||150,a=parseInt(e.height)||195;this._aspectRatio=a/t,this._extraHeight=a-t}}_updateLayout(){const e=this.justify,[t,a]=this._padding2,s=this.flex||["start","center","end"].includes(e),r=t===1/0?this._gap2:t,n=a===1/0?this._gap2:a,o=this._viewDim2-r-n;if(o>0){const l=s?this._gap2:0,c=(o-(this._columns-1)*l)/this._columns;if(this.direction!=="horizontal"){const d=Math.max(10,Math.floor(c));this._itemSize.width=d,this._itemSize.height=Math.max(10,Math.floor(d+this._extraHeight))}else{const d=Math.max(10,Math.floor(c));this._itemSize.height=d,this._itemSize.width=Math.max(10,Math.floor(d-this._extraHeight))}}super._updateLayout()}}const hc=i=>Object.assign({type:uc},i);var pc={common:{not_found:"Entity not found.",search:"Search",power:"Power",favorite:"Favorite",loading:"Loading...",no_results:"No results.",close:"Close",vol_up:"Volume Up",vol_down:"Volume Down",media_player:"Media Player",edit_entity:"Edit Entity Settings",edit_action:"Edit Action Settings",mute:"Mute",unmute:"Unmute",seek:"Seek",volume:"Volume",play_now:"Play Now",more_options:"More Options",unavailable:"Unavailable",back:"Back",cancel:"Cancel",reset_default:"Reset to default",unpin:"Unpin",clear:"Clear",album_art:"Album Art"},editor:{tabs:{entities:"Entities",behavior:"Behavior",look_and_feel:"Look and Feel",artwork:"Artwork",actions:"Actions"},search_placeholder:"Search configuration options...",template_label:"Card Template",templates:{custom:{label:"Custom (Original Config)",description:"Your original, fully customized configuration."},large_modern:{label:"Big Ol' Modern YAMP",description:"A slightly larger modern design with adaptive controls."},crisp_clean:{label:"Clean",description:"A clean layout with scaled artwork and modern controls."},minimal_mini:{label:"MINImal",description:"A compact card with no artwork."},normal_mini:{label:"Mini Mode",description:"The standard compact card."},quick_and_easy:{label:"No Time To Explain",description:"Used for speed with persistent chip rows and quick grouping."},dedicated_search:{label:"All About That Search",description:"A standalone search card without the main media player."},dedicated_grouping:{label:"Group Therapy",description:"A standalone player grouping card. Requires multiple entities configured."},huge_yamp:{label:"That's a Huge YAMP!",description:"Maximized controls, large text, and a massive progress bar for across room viewing."}},placeholders:{search:"Search music..."},sections:{artwork:{general:{title:"General Settings",description:"Global controls for how artwork is displayed and retrieved."},idle:{title:"Idle Artwork",description:"Show a static image or entity snapshot whenever nothing is playing."},overrides:{title:"Artwork Overrides",description:"Overrides are evaluated from top to bottom. Drag to reorder."}},entities:{title:"Entities*",description:"Add the media players you want to control. Drag entities to reorder the chip row."},behavior:{idle_chips:{title:"Idle & Chips",description:"Choose when the card goes idle and how entity chips behave."},interactions_search:{title:"Interactions & Search",description:"Fine-tune how entities are pinned and how many results show at once."},lyrics:{title:"Lyrics",description:"Configure how lyrics are displayed and when they appear."}},look_and_feel:{theme_layout:{title:"Theme & Layout",description:"Match dashboard styling and control the overall footprint."},controls_typography:{title:"Controls & Typography",description:"Tune button sizing, entity labels, and adaptive text."},collapsed_idle:{title:"Collapsed & Idle States",description:"Control when the card collapses and which views show while idle."}},actions:{title:"Actions",description:"Build the action chips that appear in the card or its menu. Drag to reorder, click the pencil to configure each action."}},subtitles:{idle_timeout:"Time in milliseconds before the card enters idle mode. Set to 0 to disable idle behavior.",show_chip_row:'"Auto" hides the chip row when only one entity is configured. "In Menu" moves the chips into the menu overlay. "In Menu on Idle" shows chips inline when active but moves them to the menu when idle.',dim_chips:"When the card enters idle mode with an image, dim the entity and action chips for a cleaner look.",hold_to_pin:"Long press on entity chips instead of short press to pin them, preventing auto-switching during playback.",always_show_group:"Quick grouping controls (+/-/star) will be visible by default on page load. You can still toggle it manually via double-tap.",disable_autofocus:"Keep the search box from stealing focus so on-screen keyboards stay hidden.",search_within_filter:"Enable this to search within the current active filter (Favorites, Recently Played, etc) instead of clearing it.",close_search_on_play:"Automatically close the search screen when a track is played.",pin_search_headers:"Keep search input and filters fixed at the top while scrolling results.",hide_search_headers_on_idle:"Hide search input and filters when the player is idle.",disable_mass:"Disable the optional Mass Queue integration even if it is installed.",swap_pause_stop:"Replace the pause button with stop while using the modern layout.",adaptive_controls:"Let the playback buttons grow or shrink to fit the available space.",hide_menu_player:"When chips live in the menu, hide the entity label at the bottom of the card.",hide_reorder_progress:"Hide the floating queue re-ordering progress indicator at the bottom.",adaptive_text:"Choose which text groups should scale with available space (leave empty to disable adaptive text).",collapse_expand:"Always Collapsed creates mini player mode. Expand on Search temporarily expands when searching.",idle_screen:"Choose which screen to display automatically when the card becomes idle.",hide_controls:"Select buttons to hide from the persistent playback controls row.",hide_remote_buttons:"Select buttons to hide from the Remote Control overlay.",hide_search_chips:"Hide specific search filter chips for this entity",hide_active_entity_on_idle:"Hide the entity label at the bottom of the card only when the player is idle.",follow_active_entity:"When enabled, the volume entity will automatically follow the active playback entity. Note: This overrides the selected volume entity.",search_limit_full:"Maximum number of search results to display (default: 20)",default_search_filter_full:"Choose which filter is active by default when the search screen opens.",default_search_favorites:"Start search with favorites active",result_sorting_full:"Choose how results are ordered.",card_height_full:"Leave blank for automatic height",control_layout_full:"Choose between the legacy evenly sized controls or the modern Home Assistant layout.",artwork_extend:"Let the artwork background continue underneath the chip and action rows.",artwork_extend_label:"Extend artwork",no_artwork_overrides:"No artwork overrides configured. Use the plus button below to add one.",missing_art_match:"Applies when the selected media provides no artwork.",idle_image_match:"Applies when the player is idle and an idle image is displaying.",entity_current_hint:"Use 'entity_id: current' to target the card's currently selected media player entity.",jinja_template_hint:"Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:",jinja_template_vol_hint:"Enter a Jinja template that resolves to an entity_id (e.g. media_player.office_homepod or remote.soundbar). Example switching volume entity based on a boolean:",not_available_alt_collapsed:"Not available with Alternate Progress Bar or Always Collapsed mode",not_available_collapsed:"Not available when Always Collapsed is enabled",only_available_collapsed:"Only available when Always Collapsed is enabled",only_available_modern:"Only available with Modern layout",image_url_helper:"Enter a direct URL to an image or a local file path",selected_entity_helper:"Input text helper that will be updated with the currently selected media player entity ID.",select_entity_helper:"Input text helper to read the entity ID from. The card will automatically select the matching chip.",sync_entity_type:"Choose which entity ID to sync to the helper (defaults to Music Assistant entity if configured).",disable_auto_select:"Prevent this entity's chip from automatically being selected when it starts playing.",search_view:"Choose between a standard list or a card-based grid for search results.",search_card_columns:"Specify how many columns to use in the card view. Artwork will scale automatically.",card_type:"Choose the card mode. 'Default' is the standard media player. 'Dedicated Search' makes the card a permanent search interface.",queue_controls_style:"Choose between a drag handle or classic movement buttons for the queue.",always_show_lyrics:"Automatically open the lyrics view when the page is refreshed.",lyrics_source:"Music Assistant requires the mass_queue integration to fetch lyrics from its internal metadata engine.",lyrics_pre_roll:"Shift the lyrics highlight timing. Positive values speed it up, negative values slow it down (default: 0).",blurred_artwork:"Always blur the background artwork",hide_collapsed_artwork:"Hide the smaller artwork on the right when the card is collapsed",show_idle_artwork_when_not_playing:"When enabled, selecting a chip that is not currently playing will display the configured idle image instead of the active playback artwork.",prefer_ma_metadata:"Always use the paired Music Assistant entity for track title, artist, and artwork, even if the primary entity is playing.",show_volume_overlay:"Briefly display a large volume indicator over the artwork when the volume level changes."},titles:{edit_entity:"Edit Entity",edit_action:"Edit Action",service_data:"Service Data",add_artwork_override:"Add Artwork Override"},labels:{toggle_template_mode:"Toggle Template Mode",dim_chips:"Dim Chips on Idle",hold_to_pin:"Hold to Pin",always_show_group:"Quick Group by Default",disable_autofocus:"Disable Search Autofocus",keep_filters:"Keep Filters on Search",dismiss_on_play:"Dismiss search on play",pin_headers:"Pin search headers",hide_search_headers_on_idle:"Hide search headers on idle",default_search_filter:"Default Search Filter",default_search_favorites:"Default to Favorites Filter",disable_mass:"Disable Mass Queue",match_theme:"Match Theme",alt_progress:"Alternate Progress Bar",progress_bar_height:"Progress Bar Height",display_timestamps:"Display Timestamps",swap_pause_stop:"Swap Pause with Stop",adaptive_controls:"Adaptive Control Size",hide_active_entity:"Hide Active Entity Label",hide_active_entity_on_idle:"Hide Active Entity Label on Idle",collapse_on_idle:"Collapse on Idle",hide_menu_player_toggle:"Hide Menu Player",hide_reorder_progress_toggle:"Hide Re-ordering Progress",always_collapsed:"Always Collapsed",expand_on_search:"Expand on Search",script_var:"Script Variable (yamp_entity)",use_ma_template:"Use template for Music Assistant Entity",use_vol_template:"Use template for Volume Entity",follow_active_entity:"Volume Entity Follows Active Entity",use_url_path:"Use URL or Path",adaptive_text_elements:"Adaptive Text Size Elements",disable_auto_select:"Disable Auto-Select",always_show_lyrics:"Always Show Lyrics",lyrics_mode:"Lyrics Mode",lyrics_source:"Lyrics Source",lyrics_pre_roll:"Lyrics Pre-Roll (seconds)",blurred_artwork:"Blurred Artwork",hide_collapsed_artwork:"Hide Collapsed Artwork",show_idle_artwork_when_not_playing:"Show Idle Image When Not Playing",prefer_ma_metadata:"Prefer Music Assistant Metadata",show_volume_overlay:"Show Volume Overlay"},fields:{artwork_fit:"Artwork Fit",artwork_position:"Artwork Position",artwork_hostname:"Artwork Hostname",match_field:"Match Type",match_value:"Match Value",size_percent:"Size (%)",object_fit:"Object Fit",idle_timeout:"Idle Timeout (ms)",show_chip_row:"Show Chip Row",search_limit:"Search Results Limit",result_sorting:"Result Sorting",vol_step:"Volume Step (0.05 = 5%)",card_height:"Card Height (px)",control_layout:"Control Layout",idle_image:"Idle Image",image_url:"Image URL",fallback_image_url:"Fallback Image URL",move_to_main:"Move action to main chips",move_to_menu:"Move action into menu",delete_action:"Delete Action",volume_mode:"Volume Mode",idle_screen:"Idle Screen",name:"Name",hidden_controls:"Hidden Controls",hide_remote_buttons:"Hidden Remote Buttons",ma_template:"Music Assistant Entity Template (Jinja)",hidden_chips:"Hidden Search Filter Chips",vol_template:"Volume Entity Template (Jinja)",icon:"Icon",action_type:"Action Type",menu_item:"Menu Item",nav_path:"Navigation Path",service:"Service",service_data:"Service Data",idle_image_entity:"Idle Image Entity",match_entity:"Match Entity",ma_entity:"Music Assistant Entity",vol_entity:"Volume Entity",selected_entity_helper:"Selected Entity Helper",sync_entity_type:"Sync Entity Type",placement:"Placement",card_trigger:"Card Trigger",search_view:"Search Result View",search_card_columns:"Card Columns",card_type:"Card Type",queue_controls_style:"Queue Controls Style",appearance:"Appearance",no_artwork_option:"No Artwork",details_alignment:"Details Alignment"},action_types:{menu:"Open a Card Menu Item",service:"Call a Service",navigate:"Navigate",prev_entity:"Previous Entity Chip",next_entity:"Next Entity Chip",sync_selected_entity:"Sync Selected Entity",select_entity:"Select Entity from Helper",toggle_lyrics:"Toggle Lyrics Overlay",remote_control:"Open Remote Controls Overlay"},action_helpers:{sync_selected_entity:"Sync Selected Entity \u2192",select_entity:"Select Entity \u2190",select_helper:"(select helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant Entity if configured)",yamp_main_entity:"yamp_main_entity (Main Media Player Entity)",yamp_playback_entity:"yamp_playback_entity (Current Active Playback Entity)"},placements:{chip:"Action Chip",menu:"In Menu",hidden:"Hidden (Artwork Tap)",not_triggerable:"Not Triggerable"},triggers:{none:"None",tap:"Tap",hold:"Hold",double_tap:"Double Tap",swipe_left:"Swipe Left",swipe_right:"Swipe Right"},search_view_options:{list:"List",card:"Card",card_minimal:"Minimal Card"},card_type_options:{default:"Default",search:"Search",group_players:"Group Players",up_next:"Up Next",remote_control:"Remote Control"},queue_controls_style_options:{drag_handle:"Drag Handle",icons:"Movement Buttons"},appearance_options:{automatic:"Automatic",light:"Light",dark:"Dark"},artwork_fit:{default:"Global",cover:"Cover",contain:"Contain",fill:"Fill","scale-down":"Scale Down","scaled-contain":"Scaled Contain","scaled-contain-alternate":"Scaled Contain Alternate",none:"None"},artwork_position:{default:"Global",top:"Top",center:"Center",bottom:"Bottom"}},card:{sections:{details:"Now Playing Details",menu:"Menu & Search Sheets",action_chips:"Action Chips"},media_controls:{shuffle:"Shuffle",previous:"Previous",play_pause:"Play/Pause",stop:"Stop",next:"Next",repeat:"Repeat"},menu:{more_info:"More Info",search:"Search",source:"Source",remote_controls:"Remote Control",show_lyrics:"Show Lyrics",hide_lyrics:"Hide Lyrics",transfer_queue:"Transfer Queue",main_menu:"Main Menu",group_players:"Group Players",select_entity:"Select Entity for More Info",transfer_to:"Transfer Queue To",no_players:"No other Music Assistant players available."},remote:{title:"Remote Control",up:"Up",down:"Down",left:"Left",right:"Right",select:"Select",back:"Back",menu:"Menu",home:"Home",power:"Power"},grouping:{title:"Group Players",sync_volume:"Sync Volume",group_all:"Group All",ungroup_all:"Ungroup All",unavailable:"Player is unavailable",no_players:"No other group-capable players available.",master:"Master",joined:"Joined",available:"Available",current:"Current",unjoin_from:"Unjoin from {master}",join_with:"Join with {master}"}},search:{favorites:"Favorites",recently_played:"Recently Played",next_up:"Next Up",recommendations:"Recommendations",radio_mode:"Radio Mode",show_track_options:"Show track options",play_similar:"Play similar songs",close:"Close Search",no_results:"No results.",play_next:"Play next",replace_play:"Replace existing queue and play now",replace:"Replace queue",add_queue:"Add to the end of the queue",move_up:"Move Up",move_down:"Move Down",move_next:"Move to Next",remove:"Remove from Queue",drag_to_reorder:"Drag to reorder",added:"Added to queue!",added_to_playlist:"Added to playlist!",select_playlist:"Select Playlist for '{track}'",add_to_playlist:"Add to playlist",select_track_for_playlist:"Select the track to add for '{track}' by {artist}",labels:{replace:"Replace",next:"Next",replace_next:"Replace Next",add:"Add",add_to_playlist:"Add to Playlist"},results:"results",result:"result",filters:{all:"All",artist:"Artist",album:"Album",track:"Track",playlist:"Playlist",radio:"Radio",music:"Music",station:"Station",podcast:"Podcast",audiobook:"Audiobook"},search_artist:"Search for this artist",browse_album:"Browse tracks from {album}",play_collection:"Play this collection",play_collection_error:"Unable to play this collection directly",play_item:"Play {item}"},lyrics:{finding:"Finding Lyrics...",none_found:"No lyrics found",not_available:"Lyrics not available",instrumental:"Instrumental Track"},lyrics_sources:{mass_lrclib:"Music Assistant (Fallback to LRCLIB)",mass:"Music Assistant Only",lrclib:"LRCLIB Only",lrclib_mass:"LRCLIB (Fallback to Music Assistant)"},lyrics_modes:{default:"Default (Highlight & Scroll)",scroll:"Scroll Only",text:"Text Only"}},_c={common:{not_found:"Entit\xE4t nicht gefunden.",search:"Suchen",power:"Ein/Aus",favorite:"Favorit",loading:"Laden...",no_results:"Keine Ergebnisse.",close:"Schlie\xDFen",vol_up:"Lauter",vol_down:"Leiser",media_player:"Mediaplayer",edit_entity:"Entit\xE4tseinstellungen bearbeiten",edit_action:"Aktionseinstellungen bearbeiten",mute:"Stumm",unmute:"Stummschaltung aufheben",seek:"Suchen",volume:"Lautst\xE4rke",play_now:"Jetzt abspielen",more_options:"Weitere Optionen",unavailable:"Nicht verf\xFCgbar",back:"Zur\xFCck",cancel:"Abbrechen",reset_default:"Auf Standard zur\xFCcksetzen",unpin:"Entpinnen",clear:"L\xF6schen",album_art:"Album-Artwork"},editor:{tabs:{entities:"Entit\xE4ten",behavior:"Verhalten",look_and_feel:"Design",artwork:"Artwork",actions:"Aktionen"},search_placeholder:"Konfigurationsoptionen suchen...",placeholders:{search:"Musik suchen..."},templates:{minimal_mini:{label:"MINImal",description:"Eine kompakte Karte ohne Artwork."},normal_mini:{label:"Mini Mode",description:"Die Standard-Kompaktkarte."}},sections:{artwork:{general:{title:"Allgemeine Einstellungen",description:"Globale Steuerung der Artwork-Anzeige und -Abrufung."},idle:{title:"Artwork im Leerlauf",description:"Zeigt ein statisches Bild oder einen Entit\xE4ts-Schnappschuss an, wenn nichts abgespielt wird."},overrides:{title:"Artwork-\xDCberschreibungen",description:"\xDCberschreibungen werden von oben nach unten ausgewertet. Zum Neusortieren ziehen."}},entities:{title:"Entit\xE4ten*",description:"F\xFCgen Sie die zu steuernden Mediaplayer hinzu. Entit\xE4ten ziehen, um sie neu anzuordnen."},behavior:{idle_chips:{title:"Leerlauf & Chips",description:"W\xE4hlen Sie, wann die Karte in den Leerlauf wechselt und wie sich Entit\xE4ts-Chips verhalten."},interactions_search:{title:"Interaktionen & Suche",description:"Feineinstellung des Anpinnens von Entit\xE4ten und der Anzahl der Suchergebnisse."},lyrics:{title:"Liedtexte",description:"Konfigurieren Sie, wie Liedtexte angezeigt werden und wann sie erscheinen."}},look_and_feel:{theme_layout:{title:"Theme & Layout",description:"Anpassung an das Dashboard-Styling und Kontrolle des Platzbedarfs."},controls_typography:{title:"Steuerung & Typografie",description:"Anpassung von Schaltfl\xE4chengr\xF6\xDFe, Entit\xE4ts-Labels und adaptivem Text."},collapsed_idle:{title:"Eingeklappte & Leerlaufzust\xE4nde",description:"Steuerung der Karteneinklappung und der Ansichten im Leerlauf."}},actions:{title:"Aktionen",description:"Erstellen Sie Aktions-Chips f\xFCr die Karte oder das Men\xFC. Ziehen zum Sortieren, Stift zum Konfigurieren anklicken."}},subtitles:{idle_timeout:"Zeit in Millisekunden vor dem Wechsel in den Leerlaufmodus. 0 zum Deaktivieren.",show_chip_row:'"Auto" blendet die Chip-Leiste bei nur einer Entit\xE4t aus. "Im Men\xFC" verschiebt sie ins Men\xFC. "Im Men\xFC bei Inaktivit\xE4t" zeigt Chips inline wenn aktiv, verschiebt sie aber ins Men\xFC bei Inaktivit\xE4t.',dim_chips:"Entit\xE4ts- und Aktions-Chips im Leerlauf mit Bild abdunkeln f\xFCr einen sauberen Look.",hold_to_pin:"Langes Dr\xFCcken statt kurzem Dr\xFCcken zum Anpinnen, um automatisches Umschalten zu verhindern.",always_show_group:"Schnellgruppierungs-Steuerelemente (+/-/Stern) sind standardm\xE4\xDFig beim Laden der Seite sichtbar. Sie k\xF6nnen sie weiterhin manuell per Doppeltipp umschalten.",disable_autofocus:"Suchfeld-Autofokus deaktivieren, damit Bildschirmtastaturen ausgeblendet bleiben.",search_within_filter:"Innerhalb des aktiven Filters suchen (Favoriten, etc.), anstatt ihn zu l\xF6schen.",close_search_on_play:"Suchbildschirm beim Abspielen automatisch schlie\xDFen.",pin_search_headers:"Sucheingabe und Filter beim Scrollen oben fixieren.",hide_search_headers_on_idle:"Sucheingabe und Filter im Leerlauf ausblenden.",disable_mass:"Optionale Mass Queue Integration deaktivieren, auch wenn sie installiert ist.",swap_pause_stop:"Pause-Taste durch Stop-Taste im modernen Layout ersetzen.",adaptive_controls:"Wiedergabetasten an verf\xFCgbaren Platz anpassen.",hide_menu_player:"Entit\xE4ts-Label unten ausblenden, wenn Chips im Men\xFC sind.",hide_reorder_progress:"Die schwebende Fortschrittsanzeige f\xFCr die Warteschlangen-Neusortierung unten ausblenden.",adaptive_text:"Textgruppen w\xE4hlen, die mit dem Platz skalieren (leer lassen zum Deaktivieren).",collapse_expand:"Immer eingeklappt aktiviert den Mini-Player-Modus. Bei Suche ausklappen aktiviert ihn tempor\xE4r.",idle_screen:"W\xE4hlen Sie, welcher Bildschirm im Leerlauf automatisch angezeigt wird.",hide_controls:"W\xE4hlen Sie Steuerelemente aus, die f\xFCr diese Entit\xE4t ausgeblendet werden sollen.",hide_search_chips:"Bestimmte Suchfilter-Chips f\xFCr diese Entit\xE4t ausblenden.",hide_active_entity_on_idle:"Blendet die Entit\xE4tsbeschriftung am unteren Rand der Karte nur aus, wenn der Player im Leerlauf ist.",follow_active_entity:"Lautst\xE4rke-Entit\xE4t folgt automatisch der aktiven Wiedergabe-Entit\xE4t.",search_limit_full:"Maximale Anzahl an Suchergebnissen (Standard: 20).",default_search_filter_full:"W\xE4hlen Sie den Filter, der beim \xD6ffnen der Suche standardm\xE4\xDFig aktiv ist.",default_search_favorites:"Suche mit aktiven Favoriten starten",result_sorting_full:"Sortierung der Suchergebnisse w\xE4hlen. Standard beh\xE4lt die Quellreihenfolge bei.",card_height_full:"Leer lassen f\xFCr automatische H\xF6he.",control_layout_full:"W\xE4hlen Sie zwischen manuellem oder modernem Home Assistant Layout.",artwork_extend:"Artwork-Hintergrund unter die Chip- und Aktionsleisten erweitern.",artwork_extend_label:"Artwork erweitern",no_artwork_overrides:"Keine Artwork-\xDCberschreibungen konfiguriert.",missing_art_match:"Wird angewendet, wenn die ausgew\xE4hlten Medien kein Cover haben.",idle_image_match:"Wird angewendet, wenn der Player inaktiv ist und ein Ruhebild angezeigt wird.",entity_current_hint:"'entity_id: current' verwenden, um den aktuell ausgew\xE4hlten Mediaplayer anzusteuern.",jinja_template_hint:"Jinja-Template eingeben, das eine entity_id ergibt.",jinja_template_vol_hint:"Jinja-Template eingeben, das eine Lautst\xE4rke-entity_id ergibt.",not_available_alt_collapsed:"Nicht verf\xFCgbar mit alternativem Fortschrittsbalken oder im Modus 'Immer eingeklappt'.",not_available_collapsed:"Nicht verf\xFCgbar, wenn 'Immer eingeklappt' aktiviert ist.",only_available_collapsed:"Nur verf\xFCgbar, wenn 'Immer eingeklappt' aktiviert ist.",only_available_modern:"Nur verf\xFCgbar im modernen Layout.",image_url_helper:"Direkte Bild-URL oder lokalen Dateipfad eingeben.",selected_entity_helper:"Input-Text-Helper, der mit der aktuell ausgew\xE4hlten Mediaplayer-Entit\xE4ts-ID aktualisiert wird.",select_entity_helper:"Input-Text-Helper, aus dem die Entit\xE4ts-ID gelesen wird. Die Karte w\xE4hlt automatisch den passenden Chip aus.",sync_entity_type:"W\xE4hlen Sie, welche Entit\xE4ts-ID mit dem Helper synchronisiert werden soll (Standard: Music Assistant Entit\xE4t, falls konfiguriert).",disable_auto_select:"Verhindert, dass der Chip dieser Entit\xE4t automatisch ausgew\xE4hlt wird, wenn die Wiedergabe startet.",search_view:"W\xE4hlen Sie zwischen einer Standardliste oder einem kartenbasierten Raster f\xFCr Suchergebnisse.",search_card_columns:"Geben Sie an, wie viele Spalten in der Kartenansicht verwendet werden sollen. Das Artwork wird automatisch skaliert.",card_type:"W\xE4hlen Sie den Kartenmodus. 'Standard' ist der normale Mediaplayer. 'Dedizierte Suche' macht die Karte zu einer permanenten Suchoberfl\xE4che.",always_show_lyrics:"Liedtextansicht bei Seitenaktualisierung automatisch \xF6ffnen.",lyrics_source:"Music Assistant ben\xF6tigt die mass_queue-Integration, um Liedtexte von seiner internen Metadaten-Engine abzurufen.",lyrics_pre_roll:"Passen Sie das Timing der Songtext-Hervorhebung an. Positive Werte beschleunigen sie, negative verz\xF6gern sie (Standard: 0).",blurred_artwork:"Hintergrundbild immer weichzeichnen",hide_collapsed_artwork:"Das kleine Artwork auf der rechten Seite ausblenden, wenn die Karte eingeklappt ist",show_idle_artwork_when_not_playing:"Wenn aktiviert, wird beim Ausw\xE4hlen eines Chips, auf dem derzeit nichts abgespielt wird, das konfigurierte Ruhebild anstelle des aktiven Wiedergabe-Artworks angezeigt.",prefer_ma_metadata:"Verwenden Sie immer die gekoppelte Music Assistant-Entit\xE4t f\xFCr Titel, K\xFCnstler und Artwork, auch wenn die prim\xE4re Entit\xE4t gerade spielt.",show_volume_overlay:"Zeige kurz eine gro\xDFe Lautst\xE4rkeanzeige \xFCber dem Cover an, wenn sich die Lautst\xE4rke \xE4ndert.",queue_controls_style:"W\xE4hlen Sie, ob ein Ziehgriff oder einzelne Bewegungstasten f\xFCr Warteschlangenelemente angezeigt werden sollen."},titles:{edit_entity:"Entit\xE4t bearbeiten",edit_action:"Aktion bearbeiten",service_data:"Servicedaten",add_artwork_override:"Artwork-\xDCberschreibung hinzuf\xFCgen"},labels:{toggle_template_mode:"Vorlagenmodus umschalten",dim_chips:"Chips im Leerlauf abdunkeln",hold_to_pin:"Gedr\xFCckt halten zum Anpinnen",always_show_group:"Schnellgruppierung standardm\xE4\xDFig aktivieren",disable_autofocus:"Such-Autofocus deaktivieren",keep_filters:"Filter bei Suche beibehalten",dismiss_on_play:"Suche beim Abspielen beenden",pin_headers:"Such-Header fixieren",hide_search_headers_on_idle:"Such-Header im Leerlauf ausblenden",default_search_filter:"Standard-Suchfilter",default_search_favorites:"Standardm\xE4\xDFig Favoritenfilter verwenden",disable_mass:"Mass Queue deaktivieren",match_theme:"Theme anpassen",alt_progress:"Alternativer Fortschrittsbalken",progress_bar_height:"Fortschrittsbalkenh\xF6he",display_timestamps:"Zeitstempel anzeigen",swap_pause_stop:"Pause durch Stop ersetzen",adaptive_controls:"Adaptive Tastengr\xF6\xDFe",hide_active_entity:"Aktives Entit\xE4ts-Label ausblenden",hide_active_entity_on_idle:"Aktive Entit\xE4tsbeschriftung im Leerlauf ausblenden",collapse_on_idle:"Bei Leerlauf einklappen",hide_menu_player_toggle:"Men\xFC-Player ausblenden",hide_reorder_progress_toggle:"Neusortierungs-Fortschritt ausblenden",always_collapsed:"Immer eingeklappt",expand_on_search:"Bei Suche ausklappen",script_var:"Skript-Variable (yamp_entity)",use_ma_template:"Template f\xFCr Music Assistant Entit\xE4t verwenden",use_vol_template:"Template f\xFCr Lautst\xE4rke-Entit\xE4t verwenden",follow_active_entity:"Lautst\xE4rke folgt aktiver Entit\xE4t",use_url_path:"URL oder Pfad verwenden",adaptive_text_elements:"Elemente f\xFCr adaptive Textgr\xF6\xDFe",disable_auto_select:"Auto-Auswahl deaktivieren",always_show_lyrics:"Liedtexte immer anzeigen",lyrics_mode:"Liedtext-Modus",lyrics_source:"Liedtext-Quelle",lyrics_pre_roll:"Liedtext Pre-Roll (Sekunden)",blurred_artwork:"Verschwommenes Artwork",hide_collapsed_artwork:"Verkleinertes Artwork ausblenden",show_idle_artwork_when_not_playing:"Ruhebild anzeigen, wenn nicht abgespielt wird",prefer_ma_metadata:"Music Assistant Metadaten bevorzugen",show_volume_overlay:"Lautst\xE4rke-Overlay anzeigen"},fields:{artwork_fit:"Artwork-Anpassung",artwork_position:"Artwork-Position",artwork_hostname:"Artwork-Hostname",match_field:"Match-Feld",match_value:"Match-Wert",size_percent:"Gr\xF6\xDFe (%)",object_fit:"Object-Fit",idle_timeout:"Leerlauf-Timeout (ms)",show_chip_row:"Chip-Leiste anzeigen",search_limit:"Suchlimit",result_sorting:"Ergebnissortierung",vol_step:"Lautst\xE4rke-Schritt (0.05 = 5%)",card_height:"Kartenh\xF6he (px)",control_layout:"Steuerungs-Layout",idle_image:"Ruhebild",image_url:"Bild-URL",fallback_image_url:"Fallback Bild-URL",move_to_main:"Aktion in Haupt-Chips verschieben",move_to_menu:"Aktion ins Men\xFC verschieben",delete_action:"Aktion l\xF6schen",volume_mode:"Lautst\xE4rke-Modus",idle_screen:"Leerlauf-Bildschirm",name:"Name",hidden_controls:"Ausgeblendete Steuerungen",hide_remote_buttons:"Ausgeblendete Fernbedienungstasten",ma_template:"Music Assistant Entit\xE4ts-Template (Jinja)",hidden_chips:"Ausgeblendete Suchfilter-Chips",vol_template:"Lautst\xE4rke-Entit\xE4ts-Template (Jinja)",icon:"Icon",action_type:"Aktionstyp",menu_item:"Men\xFCpunkt",nav_path:"Navigationspfad",service:"Dienst",service_data:"Servicedaten",idle_image_entity:"Leerlauf-Bild-Entit\xE4t",match_entity:"Match-Entit\xE4t",ma_entity:"Music Assistant Entit\xE4t",vol_entity:"Lautst\xE4rke-Entit\xE4t",selected_entity_helper:"Ausgew\xE4hlter Entit\xE4ts-Helper",sync_entity_type:"Synchronisierungs-Entit\xE4tstyp",placement:"Platzierung",card_trigger:"Karten-Trigger",search_view:"Suchergebnis-Ansicht",search_card_columns:"Spaltenanzahl",card_type:"Kartentyp",appearance:"Erscheinungsbild",no_artwork_option:"Kein Artwork",details_alignment:"Detail-Ausrichtung",queue_controls_style:"Warteschlangen-Steuerungsstil"},action_types:{menu:"Kartenmen\xFCpunkt \xF6ffnen",service:"Dienst aufrufen",navigate:"Navigieren",prev_entity:"Vorheriger Entit\xE4ts-Chip",next_entity:"N\xE4chster Entit\xE4ts-Chip",sync_selected_entity:"Ausgew\xE4hlte Entit\xE4t synchronisieren",select_entity:"Entit\xE4t aus Helper ausw\xE4hlen",toggle_lyrics:"Liedtext-Overlay ein-/ausschalten",remote_control:"Fernbedienungs-Overlay \xF6ffnen"},action_helpers:{sync_selected_entity:"Entit\xE4t synchronisieren \u2192",select_entity:"Entit\xE4t ausw\xE4hlen \u2190",select_helper:"(Helper ausw\xE4hlen)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant Entit\xE4t, falls konfiguriert)",yamp_main_entity:"yamp_main_entity (Haupt-Mediaplayer-Entit\xE4t)",yamp_playback_entity:"yamp_playback_entity (Aktuelle aktive Wiedergabe-Entit\xE4t)"},placements:{chip:"Aktions-Chip",menu:"Im Men\xFC",hidden:"Ausgeblendet (Artwork-Tippen)",not_triggerable:"Nicht triggerbar"},triggers:{none:"Keiner",tap:"Tippen",hold:"Halten",double_tap:"Doppeltippen",swipe_left:"Nach links wischen",swipe_right:"Nach rechts wischen"},search_view_options:{list:"Liste",card:"Karte",card_minimal:"Minimal-Karte"},queue_controls_style_options:{drag_handle:"Ziehgriff",icons:"Bewegungstasten"},card_type_options:{default:"Standard",search:"Suche",group_players:"Player gruppieren",up_next:"Als N\xE4chstes",remote_control:"Fernbedienung"},appearance_options:{automatic:"Automatisch",light:"Hell",dark:"Dunkel"},artwork_fit:{default:"Global",cover:"Cover (Standard)",contain:"Einpassen",fill:"F\xFCllen","scale-down":"Verkleinern","scaled-contain":"Skaliertes Einpassen","scaled-contain-alternate":"Skaliertes Einpassen (Alternativ)",none:"Keine"},artwork_position:{default:"Global",top:"Oben",center:"Mitte",bottom:"Unten"}},card:{sections:{details:"Details zur Wiedergabe",menu:"Men\xFC & Suchbl\xE4tter",action_chips:"Aktions-Chips"},media_controls:{shuffle:"Zufall",previous:"Zur\xFCck",play_pause:"Play/Pause",stop:"Stop",next:"Weiter",repeat:"Wiederholen"},menu:{more_info:"Mehr Info",search:"Suche",source:"Quelle",remote_controls:"Fernbedienung",show_lyrics:"Songtext anzeigen",hide_lyrics:"Songtext ausblenden",transfer_queue:"Warteschlange \xFCbertragen",main_menu:"Hauptmen\xFC",group_players:"Player gruppieren",up_next:"Als N\xE4chstes",remote_control:"Fernbedienung",select_entity:"Entit\xE4t f\xFCr mehr Info w\xE4hlen",transfer_to:"Warteschlange \xFCbertragen zu",no_players:"Keine anderen Music Assistant Player verf\xFCgbar."},remote:{title:"Fernbedienung",up:"Nach oben",down:"Nach unten",left:"Nach links",right:"Nach rechts",select:"Ausw\xE4hlen",back:"Zur\xFCck",menu:"Men\xFC",home:"Startseite",power:"Ein/Aus"},grouping:{title:"Player gruppieren",sync_volume:"Lautst\xE4rke synchronisieren",group_all:"Alle gruppieren",ungroup_all:"Alle trennen",unavailable:"Player ist nicht verf\xFCgbar",no_players:"Keine anderen gruppierungsf\xE4higen Player verf\xFCgbar.",master:"Master",joined:"Verbunden",available:"Verf\xFCgbar",current:"Aktuell",unjoin_from:"Von {master} trennen",join_with:"Mit {master} gruppieren"}},search:{favorites:"Favoriten",recently_played:"Zuletzt geh\xF6rt",next_up:"Als N\xE4chstes",recommendations:"Empfehlungen",radio_mode:"Radiomodus",show_track_options:"Titeloptionen anzeigen",play_similar:"\xC4hnliche Lieder abspielen",close:"Suche schlie\xDFen",no_results:"Keine Ergebnisse.",play_next:"Als N\xE4chstes spielen",replace_play:"Warteschlange ersetzen und jetzt spielen",replace:"Warteschlange ersetzen",add_queue:"Am Ende der Warteschlange hinzuf\xFCgen",move_up:"Nach oben",move_down:"Nach unten",move_next:"Als N\xE4chstes verschieben",remove:"Aus Warteschlange entfernen",drag_to_reorder:"Ziehen zum Sortieren",added:"Zur Warteschlange hinzugef\xFCgt!",added_to_playlist:"Zur Playlist hinzugef\xFCgt!",select_playlist:"Playlist f\xFCr '{track}' ausw\xE4hlen",add_to_playlist:"Zur Playlist hinzuf\xFCgen",select_track_for_playlist:"Titel zum Hinzuf\xFCgen f\xFCr '{track}' von {artist} ausw\xE4hlen",labels:{replace:"Ersetzen",next:"Weiter",replace_next:"Weiter ersetzen",add:"Hinzuf\xFCgen",add_to_playlist:"Zur Playlist hinzuf\xFCgen"},results:"Ergebnisse",result:"Ergebnis",filters:{all:"Alle",artist:"K\xFCnstler",album:"Album",track:"Titel",playlist:"Playlist",radio:"Radio",music:"Musik",station:"Station",podcast:"Podcast",audiobook:"H\xF6rbuch"},search_artist:"Nach diesem K\xFCnstler suchen",browse_album:"Albentitel von {album} durchsuchen",play_collection:"Diese Sammlung abspielen",play_collection_error:"Diese Sammlung kann nicht direkt abgespielt werden",play_item:"{item} abspielen"},lyrics:{finding:"Suche Songtext...",none_found:"Kein Songtext gefunden",not_available:"Songtext nicht verf\xFCgbar",instrumental:"Instrumental-Titel"},lyrics_sources:{mass_lrclib:"Music Assistant (Fallback zu LRCLIB)",mass:"Nur Music Assistant",lrclib:"Nur LRCLIB",lrclib_mass:"LRCLIB (Fallback zu Music Assistant)"},lyrics_modes:{default:"Standard (Hervorheben & Scrollen)",scroll:"Nur Scrollen",text:"Nur Text"}},mc={common:{not_found:"Entidad no encontrada.",search:"Buscar",power:"Encender/Apagar",favorite:"Favorito",loading:"Cargando...",no_results:"Sin resultados.",close:"Cerrar",vol_up:"Subir volumen",vol_down:"Bajar volumen",media_player:"Reproductor multimedia",edit_entity:"Editar ajustes de entidad",edit_action:"Editar ajustes de acci\xF3n",mute:"Silenciar",unmute:"Activar sonido",seek:"Buscar",volume:"Volumen",play_now:"Reproducir ahora",more_options:"M\xE1s opciones",unavailable:"No disponible",back:"Atr\xE1s",cancel:"Cancelar",reset_default:"Restablecer valores",unpin:"Desanclar",clear:"Limpiar",album_art:"Portada del \xE1lbum"},editor:{tabs:{entities:"Entidades",behavior:"Comportamiento",look_and_feel:"Apariencia",artwork:"Portada",actions:"Acciones"},search_placeholder:"Buscar opciones de configuraci\xF3n...",placeholders:{search:"Buscar m\xFAsica..."},templates:{minimal_mini:{label:"MINImal",description:"Una tarjeta compacta sin car\xE1tula."},normal_mini:{label:"Mini Mode",description:"La tarjeta compacta est\xE1ndar."}},sections:{artwork:{general:{title:"Ajustes generales",description:"Controles globales para la portada."},idle:{title:"Portada en reposo",description:"Mostrar imagen est\xE1tica cuando nada se reproduce."},overrides:{title:"Reemplazos de portada",description:"Los reemplazos se eval\xFAan de arriba a abajo. Arrastre para reordenar."}},entities:{title:"Entidades*",description:"A\xF1ada los reproductores multimedia. Arrastre para reordenar."},behavior:{idle_chips:{title:"Reposo y chips",description:"Elija cu\xE1ndo pasa a reposo y el comportamiento de los chips."},interactions_search:{title:"Interacciones y b\xFAsqueda",description:"Ajuste el fijado de entidades y l\xEDmite de resultados."},lyrics:{title:"Letras",description:"Configure c\xF3mo se muestran las letras y cu\xE1ndo aparecen."}},look_and_feel:{theme_layout:{title:"Tema y dise\xF1o",description:"Combine con el estilo de su dashboard."},controls_typography:{title:"Controles y tipograf\xEDa",description:"Ajuste tama\xF1o de botones y etiquetas."},collapsed_idle:{title:"Estados de reposo y contra\xEDdo",description:"Controle el contra\xEDdo de la tarjeta."}},actions:{title:"Acciones",description:"Cree chips de acci\xF3n. Arrastre para reordenar, pulse el l\xE1piz para configurar."}},subtitles:{idle_timeout:"Tiempo antes de reposo (ms). 0 para desactivar.",show_chip_row:'"Auto" oculta la fila si solo hay una entidad. "En men\xFA" mueve los chips. "En men\xFA en reposo" muestra los chips en l\xEDnea cuando est\xE1 activo pero los mueve al men\xFA cuando est\xE1 en reposo.',dim_chips:"Atenuar los chips en reposo para un aspecto m\xE1s limpio.",hold_to_pin:"Mantener pulsado para fijar en vez de pulsaci\xF3n corta.",always_show_group:"Los controles de agrupaci\xF3n r\xE1pida (+/-/estrella) estar\xE1n visibles por defecto al cargar la p\xE1gina. Todav\xEDa puedes cambiarlos manualmente mediante doble pulsaci\xF3n.",disable_autofocus:"Evitar que la b\xFAsqueda tome el foco autom\xE1ticamente.",search_within_filter:"Buscar dentro del filtro activo (Favoritos, etc.).",close_search_on_play:"Cerrar b\xFAsqueda al reproducir.",pin_search_headers:"Fijar encabezados de b\xFAsqueda al hacer scroll.",hide_search_headers_on_idle:"Ocultar encabezados de b\xFAsqueda en inactividad.",disable_mass:"Desactivar integraci\xF3n con Mass Queue.",swap_pause_stop:"Cambiar pausa por stop en dise\xF1o moderno.",adaptive_controls:"Permitir que los botones se adapten al espacio.",hide_menu_player:"Ocultar nombre de entidad cuando est\xE1 en el men\xFA.",hide_reorder_progress:"Ocultar el indicador flotante de progreso de reordenaci\xF3n de la cola en la parte inferior.",adaptive_text:"Elegir qu\xE9 textos se adaptan al espacio.",collapse_expand:"Siempre contra\xEDdo activa el modo mini. Expandir al buscar expande temporalmente.",idle_screen:"Elegir pantalla a mostrar en reposo.",hide_controls:"Seleccionar controles a ocultar.",hide_remote_buttons:"Seleccione botones para ocultar de la superposici\xF3n del mando a distancia.",hide_search_chips:"Ocultar chips de filtro de b\xFAsqueda.",hide_active_entity_on_idle:"Oculta la etiqueta de la entidad en la parte inferior de la tarjeta solo cuando el reproductor est\xE1 inactivo.",follow_active_entity:"La entidad de volumen seguir\xE1 a la activa.",search_limit_full:"M\xE1ximo de resultados (defecto: 20).",default_search_filter_full:"Elige qu\xE9 filtro est\xE1 activo por defecto cuando se abre la pantalla de b\xFAsqueda.",default_search_favorites:"Iniciar b\xFAsqueda con favoritos activos",result_sorting_full:"Elegir orden de resultados.",card_height_full:"Dejar vac\xEDo para altura autom\xE1tica.",control_layout_full:"Elegir entre dise\xF1o antiguo o moderno.",artwork_extend:"Extender portada bajo los chips.",artwork_extend_label:"Extender portada",no_artwork_overrides:"Sin reemplazos de portada configurados.",missing_art_match:"Se aplica cuando el medio seleccionado no proporciona car\xE1tula.",idle_image_match:"Se aplica cuando el reproductor est\xE1 inactivo y se muestra una imagen de reposo.",entity_current_hint:"Use 'entity_id: current' para el reproductor actual.",jinja_template_hint:"Plantilla Jinja para entity_id.",jinja_template_vol_hint:"Plantilla para entidad de volumen.",not_available_alt_collapsed:"No disponible en modo contra\xEDdo.",not_available_collapsed:"No disponible si est\xE1 contra\xEDdo.",only_available_collapsed:"Solo disponible si est\xE1 contra\xEDdo.",only_available_modern:"Solo disponible con dise\xF1o Moderno.",image_url_helper:"Ingrese una URL directa a una imagen o una ruta de archivo local",selected_entity_helper:"Helper de texto de entrada que se actualizar\xE1 con el ID de la entidad del reproductor de medios seleccionado actualmente.",select_entity_helper:"Helper de texto de entrada del que leer el ID de la entidad. La tarjeta seleccionar\xE1 autom\xE1ticamente el chip correspondiente.",sync_entity_type:"Elija qu\xE9 ID de entidad sincronizar con el helper (por defecto la entidad de Music Assistant si est\xE1 configurada).",disable_auto_select:"Evita que el chip de esta entidad se seleccione autom\xE1ticamente cuando comienza la reproducci\xF3n.",search_view:"Elegir entre una lista est\xE1ndar o una cuadr\xEDcula de tarjetas para los resultados de la b\xFAsqueda.",search_card_columns:"Especifica cu\xE1ntas columnas usar en la vista de tarjetas. El artwork se adaptar\xE1 autom\xE1ticamente.",card_type:"Elija el modo de tarjeta. 'Por defecto' es el reproductor de medios est\xE1ndar. 'B\xFAsqueda dedicada' convierte la tarjeta en una interfaz de b\xFAsqueda permanente.",always_show_lyrics:"Abrir autom\xE1ticamente la vista de letras al actualizar la p\xE1gina.",lyrics_source:"Music Assistant requiere la integraci\xF3n de mass_queue para obtener las letras de su motor de metadatos interno.",lyrics_pre_roll:"Ajusta el tiempo de resaltado de la letra. Los valores positivos lo aceleran, los negativos lo retrasan (por defecto: 0).",blurred_artwork:"Difuminar siempre la imagen de fondo",hide_collapsed_artwork:"Ocultar la imagen peque\xF1a a la derecha cuando la tarjeta est\xE9 contra\xEDda",show_idle_artwork_when_not_playing:"Cuando est\xE1 habilitado, al seleccionar una ficha que no se est\xE1 reproduciendo actualmente, se mostrar\xE1 la imagen de inactividad configurada en lugar de la car\xE1tula de reproducci\xF3n activa.",prefer_ma_metadata:"Utilizar siempre la entidad de Music Assistant emparejada para el t\xEDtulo de la pista, el artista y el arte, incluso si la entidad primaria est\xE1 reproduciendo.",show_volume_overlay:"Muestra brevemente un indicador de volumen grande sobre la car\xE1tula cuando cambia el nivel de volumen.",queue_controls_style:"Elige si mostrar un tirador de arrastre o botones de movimento individuales para los elementos de la cola."},titles:{edit_entity:"Editar entidad",edit_action:"Editar acci\xF3n",service_data:"Datos del servicio",add_artwork_override:"A\xF1adir reemplazo"},labels:{toggle_template_mode:"Alternar modo de plantilla",dim_chips:"Atenuar chips en reposo",hold_to_pin:"Mantener para fijar",always_show_group:"Grupo r\xE1pido por defecto",disable_autofocus:"Desactivar autofoco",keep_filters:"Mantener filtros",dismiss_on_play:"Cerrar al reproducir",pin_headers:"Fijar encabezados",hide_search_headers_on_idle:"Ocultar encabezados en inactividad",default_search_filter:"Filtro de b\xFAsqueda predeterminado",default_search_favorites:"Filtro de favoritos por defecto",disable_mass:"Desactivar Mass Queue",match_theme:"Seguir tema",alt_progress:"Barra de progreso alternativa",progress_bar_height:"Altura de la barra de progreso",display_timestamps:"Mostrar sellos de tiempo",swap_pause_stop:"Cambiar Pausa por Stop",adaptive_controls:"Tama\xF1o adaptativo",hide_active_entity:"Ocultar nombre de entidad activa",hide_active_entity_on_idle:"Ocultar etiqueta de entidad activa al estar inactivo",collapse_on_idle:"Contraer en reposo",hide_menu_player_toggle:"Ocultar reproductor del men\xFA",hide_reorder_progress_toggle:"Ocultar progreso de reordenaci\xF3n",always_collapsed:"Siempre contra\xEDdo",expand_on_search:"Expandir al buscar",script_var:"Variable script (yamp_entity)",use_ma_template:"Usar plantilla MA",use_vol_template:"Usar plantilla Volumen",follow_active_entity:"Volumen sigue a entidad activa",use_url_path:"Usar URL o ruta",adaptive_text_elements:"Elementos para tama\xF1o de texto adaptativo",disable_auto_select:"Desactivar selecci\xF3n autom\xE1tica",always_show_lyrics:"Mostrar siempre las letras",lyrics_mode:"Modo de letras",lyrics_source:"Fuente de letras",lyrics_pre_roll:"Anticipo de letra (segundos)",blurred_artwork:"Imagen difuminada",hide_collapsed_artwork:"Ocultar imagen reducida",show_idle_artwork_when_not_playing:"Mostrar imagen de inactividad cuando no se reproduce",prefer_ma_metadata:"Preferir metadatos de Music Assistant",show_volume_overlay:"Mostrar superposici\xF3n de volumen"},fields:{artwork_fit:"Ajuste",artwork_position:"Posici\xF3n",artwork_hostname:"Host",match_field:"Campo",match_value:"Valor",size_percent:"Tama\xF1o (%)",object_fit:"Object Fit",idle_timeout:"Reposo (ms)",show_chip_row:"Mostrar chips",search_limit:"L\xEDmite de b\xFAsqueda",result_sorting:"Orden",vol_step:"Paso de volumen",card_height:"Altura (px)",control_layout:"Dise\xF1o",idle_image:"Imagen de reposo",image_url:"URL imagen",fallback_image_url:"URL de respaldo",move_to_main:"Mover a chips principales",move_to_menu:"Mover al men\xFA",delete_action:"Borrar acci\xF3n",volume_mode:"Modo volumen",idle_screen:"Pantalla reposo",name:"Nombre",hidden_controls:"Controles ocultos",hide_remote_buttons:"Botones del mando a distancia ocultos",ma_template:"Plantilla MA (Jinja)",hidden_chips:"Chips ocultos",vol_template:"Plantilla Volumen (Jinja)",icon:"Icono",action_type:"Tipo de acci\xF3n",menu_item:"Elemento de men\xFA",nav_path:"Ruta",service:"Servicio",service_data:"Datos",idle_image_entity:"Entidad imagen reposo",match_entity:"Entidad",ma_entity:"Entidad de Music Assistant",vol_entity:"Entidad de volumen",selected_entity_helper:"Helper de entidad seleccionada",sync_entity_type:"Tipo de entidad a sincronizar",placement:"Colocaci\xF3n",card_trigger:"Activador de la tarjeta",search_view:"Vista de resultados de b\xFAsqueda",search_card_columns:"Columnas de tarjetas",card_type:"Tipo de tarjeta",appearance:"Apariencia",no_artwork_option:"Sin imagen",details_alignment:"Alineaci\xF3n de detalles",queue_controls_style:"Estilo de controles de cola"},action_types:{menu:"Abrir un elemento del men\xFA",service:"Llamar a un servicio",navigate:"Navegar",prev_entity:"Chip de entidad anterior",next_entity:"Chip de entidad siguiente",sync_selected_entity:"Sincronizar entidad seleccionada",select_entity:"Seleccionar entidad desde helper",toggle_lyrics:"Alternar superposici\xF3n de letras",remote_control:"Abrir superposici\xF3n de mando a distancia"},action_helpers:{sync_selected_entity:"Sincronizar entidad seleccionada \u2192",select_entity:"Seleccionar entidad \u2190",select_helper:"(seleccionar helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entidad de Music Assistant si est\xE1 configurada)",yamp_main_entity:"yamp_main_entity (Entidad principal del reproductor)",yamp_playback_entity:"yamp_playback_entity (Entidad de reproducci\xF3n activa actual)"},placements:{chip:"Chip de acci\xF3n",menu:"En el men\xFA",hidden:"Oculto (Toque en el arte)",not_triggerable:"No activable"},triggers:{none:"Ninguno",tap:"Toque",hold:"Mantener",double_tap:"Doble toque",swipe_left:"Deslizar a la izquierda",swipe_right:"Deslizar a la derecha"},search_view_options:{list:"Lista",card:"Tarjeta",card_minimal:"Tarjeta reducida"},queue_controls_style_options:{drag_handle:"Tirador de arrastre",icons:"Botones de movimiento"},card_type_options:{default:"Por defecto",search:"Buscar",group_players:"Agrupar",up_next:"A continuaci\xF3n",remote_control:"Control remoto"},appearance_options:{automatic:"Autom\xE1tico",light:"Claro",dark:"Oscuro"},artwork_fit:{default:"Global",cover:"Portada (por defecto)",contain:"Contener",fill:"Rellenar","scale-down":"Reducir","scaled-contain":"Contenido escalado","scaled-contain-alternate":"Contenido escalado alternativo",none:"Ninguno"},artwork_position:{default:"Global",top:"Arriba",center:"Centro",bottom:"Abajo"}},card:{sections:{details:"Detalles de reproducci\xF3n",menu:"Men\xFA y B\xFAsqueda",action_chips:"Chips de acci\xF3n"},media_controls:{shuffle:"Aleatorio",previous:"Anterior",play_pause:"Reproducir/Pausa",stop:"Detener",next:"Siguiente",repeat:"Repetir"},menu:{more_info:"M\xE1s info",search:"Buscar",source:"Fuente",remote_controls:"Mando a distancia",show_lyrics:"Mostrar letra",hide_lyrics:"Ocultar letra",transfer_queue:"Transferir cola",main_menu:"Men\xFA Principal",group_players:"Agrupar",up_next:"A continuaci\xF3n",remote_control:"Control remoto",select_entity:"Seleccionar",transfer_to:"Transferir a",no_players:"Sin reproductores MA."},remote:{title:"Mando a distancia",up:"Arriba",down:"Abajo",left:"Izquierda",right:"Derecha",select:"Seleccionar",back:"Atr\xE1s",menu:"Men\xFA",home:"Inicio",power:"Encendido"},grouping:{title:"Agrupar",sync_volume:"Sincronizar volumen",group_all:"Agrupar todos",ungroup_all:"Desagrupar todos",unavailable:"No disponible",no_players:"No agrupable.",master:"Maestro",joined:"Unido",available:"Disponible",current:"Actual",unjoin_from:"Desvincular de {master}",join_with:"Unirse a {master}"}},search:{favorites:"Favoritos",recently_played:"Reciente",next_up:"A continuaci\xF3n",recommendations:"Recomendaciones",radio_mode:"Modo Radio",show_track_options:"Mostrar opciones de canci\xF3n",play_similar:"Reproducir canciones similares",close:"Cerrar",no_results:"Sin resultados.",play_next:"Reprod. siguiente",replace_play:"Reemplazar y reproducir",replace:"Reemplazar cola",add_queue:"A\xF1adir al final",move_up:"Subir",move_down:"Bajar",move_next:"Pasar a siguiente",remove:"Quitar de cola",drag_to_reorder:"Arrastrar para reordenar",added:"\xA1A\xF1adido!",added_to_playlist:"\xA1A\xF1adido a la lista de reproducci\xF3n!",select_playlist:"Seleccionar lista de reproducci\xF3n para '{track}'",add_to_playlist:"A\xF1adir a la lista de reproducci\xF3n",select_track_for_playlist:"Seleccionar la canci\xF3n a a\xF1adir para '{track}' de {artist}",labels:{replace:"Remplazar",next:"Siguiente",replace_next:"Rempl. Sig.",add:"A\xF1adir",add_to_playlist:"A\xF1adir a la lista de reproducci\xF3n"},results:"resultados",result:"resultado",filters:{all:"Todo",artist:"Artista",album:"\xC1lbum",track:"Canci\xF3n",playlist:"Lista",radio:"Radio",music:"M\xFAsica",station:"Emisora",podcast:"P\xF3dcast",audiobook:"Audiolibro"},search_artist:"Buscar este artista",browse_album:"Explorar pistas de {album}",play_collection:"Reproducir esta colecci\xF3n",play_collection_error:"No se puede reproducir esta colecci\xF3n directamente",play_item:"Reproducir {item}"},lyrics:{finding:"Buscando letra...",none_found:"No se encontr\xF3 letra",not_available:"Letra no disponible",instrumental:"Pista instrumental"},lyrics_sources:{mass_lrclib:"Music Assistant (Respaldo en LRCLIB)",mass:"Solo Music Assistant",lrclib:"Solo LRCLIB",lrclib_mass:"LRCLIB (Respaldo en Music Assistant)"},lyrics_modes:{default:"Predeterminado (Resaltar y desplazarse)",scroll:"Solo desplazarse",text:"Solo texto"}},gc={common:{not_found:"Entit\xE9 non trouv\xE9e.",search:"Rechercher",power:"Alimentation",favorite:"Favori",loading:"Chargement...",no_results:"Aucun r\xE9sultat.",close:"Fermer",vol_up:"Monter le volume",vol_down:"Baisser le volume",media_player:"Lecteur Multim\xE9dia",edit_entity:"Modifier les param\xE8tres de l'entit\xE9",edit_action:"Modifier les param\xE8tres de l'action",mute:"Muet",unmute:"R\xE9tablir le son",seek:"Rechercher",volume:"Volume",play_now:"Lire maintenant",more_options:"Plus d'options",unavailable:"Indisponible",back:"Retour",cancel:"Annuler",reset_default:"R\xE9initialiser",unpin:"D\xE9s\xE9pingler",clear:"Effacer",album_art:"Illustration de l'album"},editor:{tabs:{entities:"Entit\xE9s",behavior:"Comportement",look_and_feel:"Apparence",artwork:"Illustrations",actions:"Actions"},search_placeholder:"Rechercher des options de configuration...",placeholders:{search:"Rechercher de la musique..."},templates:{minimal_mini:{label:"MINImal",description:"Une carte compacte sans pochette."},normal_mini:{label:"Mini Mode",description:"La carte compacte standard."}},sections:{artwork:{general:{title:"Param\xE8tres G\xE9n\xE9raux",description:"Contr\xF4les globaux pour l'affichage des illustrations."},idle:{title:"Illustration au Repos",description:"Afficher une image statique lorsque rien n'est en lecture."},overrides:{title:"Remplacements d'Illustrations",description:"Les remplacements sont \xE9valu\xE9s de haut en bas. Glissez pour r\xE9ordonner."}},entities:{title:"Entit\xE9s*",description:"Ajoutez les lecteurs multim\xE9dias que vous souhaitez contr\xF4ler. Glissez pour r\xE9ordonner."},behavior:{idle_chips:{title:"Veille & Jetons",description:"Choisissez quand la carte passe en mode veille et comment les jetons se comportent."},interactions_search:{title:"Interactions & Recherche",description:"Affinez la fa\xE7on dont les entit\xE9s sont \xE9pingl\xE9es et le nombre de r\xE9sultats."},lyrics:{title:"Paroles",description:"Configurez la fa\xE7on dont les paroles sont affich\xE9es et quand elles apparaissent."}},look_and_feel:{theme_layout:{title:"Th\xE8me & Mise en page",description:"Adaptez au style de votre tableau de bord et contr\xF4lez l'empreinte globale."},controls_typography:{title:"Commandes & Typographie",description:"Ajustez la taille des boutons, les \xE9tiquettes et le texte adaptatif."},collapsed_idle:{title:"\xC9tats R\xE9duits & Veille",description:"Contr\xF4lez quand la carte se r\xE9duit et quelles vues s'affichent en veille."}},actions:{title:"Actions",description:"Cr\xE9ez les jetons d'action. Glissez pour r\xE9ordonner, cliquez sur le crayon pour configurer."}},subtitles:{idle_timeout:"Temps en millisecondes avant la mise en veille. 0 pour d\xE9sactiver.",show_chip_row:'"Auto" masque la barre de jetons si une seule entit\xE9 est configur\xE9e. "Dans le Menu" d\xE9place les jetons. "Dans le menu au repos" affiche les jetons en ligne lorsque actif mais les d\xE9place dans le menu au repos.',dim_chips:"Assombrir les jetons en mode veille pour un look plus \xE9pur\xE9.",hold_to_pin:"Appui long pour \xE9pingler au lieu d'un appui court.",always_show_group:"Les contr\xF4les de groupement rapide (+/-/\xE9toile) seront visibles par d\xE9faut au chargement de la page. Vous pouvez toujours les basculer manuellement via un double appui.",disable_autofocus:"Emp\xEAcher la recherche de prendre le focus automatiquement.",search_within_filter:"Rechercher dans le filtre actif actuel (Favoris, etc.).",close_search_on_play:"Fermer automatiquement la recherche \xE0 la lecture.",pin_search_headers:"Garder la recherche et les filtres fixes en haut.",hide_search_headers_on_idle:"Masquer la recherche et les filtres en mode veille.",disable_mass:"D\xE9sactiver l'int\xE9gration Mass Queue.",swap_pause_stop:"Remplacer le bouton pause par stop en mode moderne.",adaptive_controls:"Laisser les boutons s'adapter \xE0 l'espace disponible.",hide_menu_player:"Masquer l'\xE9tiquette de l'entit\xE9 en bas quand les jetons sont dans le menu.",hide_reorder_progress:"Masquer l'indicateur flottant de progression de r\xE9organisation de la file d'attente en bas.",adaptive_text:"Choisir quels textes doivent s'adapter \xE0 l'espace.",collapse_expand:"Toujours r\xE9duit cr\xE9e un mini lecteur. Agrandir \xE0 la Recherche agrandit temporairement.",idle_screen:"Choisir l'\xE9cran \xE0 afficher automatiquement en veille.",hide_controls:"S\xE9lectionner les commandes \xE0 masquer pour cette entit\xE9.",hide_remote_buttons:"S\xE9lectionnez les boutons \xE0 masquer de la t\xE9l\xE9commande.",hide_search_chips:"Masquer des jetons de filtrage sp\xE9cifiques.",hide_active_entity_on_idle:"Masque l'\xE9tiquette de l'entit\xE9 au bas de la carte uniquement lorsque le lecteur est en veille.",follow_active_entity:"L'entit\xE9 de volume suivra automatiquement l'entit\xE9 active.",search_limit_full:"Nombre maximum de r\xE9sultats (d\xE9faut: 20).",default_search_filter_full:"Choisissez quel filtre est actif par d\xE9faut \xE0 l'ouverture de la recherche.",default_search_favorites:"D\xE9marrer la recherche avec les favoris actifs",result_sorting_full:"Choisir l'ordre des r\xE9sultats. Par d\xE9faut conserve l'ordre source.",card_height_full:"Laisser vide pour une hauteur automatique.",control_layout_full:"Choisir entre l'ancienne mise en page ou la moderne.",artwork_extend:"\xC9tendre l'illustration sous les lignes de jetons.",artwork_extend_label:"\xC9tendre l'illustration",no_artwork_overrides:"Aucun remplacement d'illustration configur\xE9.",missing_art_match:"S'applique lorsque le m\xE9dia s\xE9lectionn\xE9 ne fournit aucune illustration.",idle_image_match:"S'applique lorsque le lecteur est en veille et qu'une image de veille est affich\xE9e.",entity_current_hint:"Utilisez 'entity_id: current' pour cibler le lecteur actuel.",jinja_template_hint:"Entrez un mod\xE8le Jinja qui renvoie un entity_id.",jinja_template_vol_hint:"Mod\xE8le pour l'entit\xE9 de volume.",not_available_alt_collapsed:"Non disponible en mode 'Toujours r\xE9duit'.",not_available_collapsed:"Non disponible si 'Toujours r\xE9duit' est activ\xE9.",only_available_collapsed:"Uniquement disponible si 'Toujours r\xE9duit' est activ\xE9.",only_available_modern:"Uniquement disponible avec la mise en page Moderne.",image_url_helper:"Entrez une URL directe vers une image ou un chemin de fichier local",selected_entity_helper:"Helper de texte d'entr\xE9e qui sera mis \xE0 jour avec l'ID de l'entit\xE9 du lecteur multim\xE9dia actuellement s\xE9lectionn\xE9.",select_entity_helper:"Helper de texte d'entr\xE9e \xE0 partir duquel lire l'ID de l'entit\xE9. La carte s\xE9lectionnera automatiquement le jeton correspondant.",sync_entity_type:"Choisissez quel ID d'entit\xE9 synchroniser avec le helper (par d\xE9faut l'entit\xE9 Music Assistant si configur\xE9e).",disable_auto_select:"Emp\xEAche le jeton de cette entit\xE9 d'\xEAtre automatiquement s\xE9lectionn\xE9 au d\xE9but de la lecture.",search_view:"Choisissez entre une liste standard ou une grille de cartes pour les r\xE9sultats de recherche.",search_card_columns:"Sp\xE9cifiez le nombre de colonnes \xE0 utiliser dans la vue carte. L'illustration s'adaptera automatiquement.",card_type:"Choisissez le mode de la carte. 'Par d\xE9faut' est le lecteur multim\xE9dia standard. 'Recherche d\xE9di\xE9e' fait de la carte une interface de recherche permanente.",always_show_lyrics:"Ouvrir automatiquement la vue des paroles lors du rafra\xEEchissement de la page.",lyrics_source:"Music Assistant n\xE9cessite l'int\xE9gration mass_queue pour r\xE9cup\xE9rer les paroles de son moteur de m\xE9tadonn\xE9es interne.",lyrics_pre_roll:"Ajuste le timing de mise en \xE9vidence des paroles. Les valeurs positives l'acc\xE9l\xE8rent, les n\xE9gatives le ralentissent (par d\xE9faut : 0).",blurred_artwork:"Toujours flouter l'image d'arri\xE8re-plan",hide_collapsed_artwork:"Masquer l'image r\xE9duite sur la droite lorsque la carte est repli\xE9e",show_idle_artwork_when_not_playing:"Lorsqu'il est activ\xE9, la s\xE9lection d'un badge qui n'est pas en cours de lecture affichera l'image d'inactivit\xE9 configur\xE9e \xE0 la place de l'illustration de lecture active.",prefer_ma_metadata:"Toujours utiliser l'entit\xE9 Music Assistant associ\xE9e pour le titre de la piste, l'artiste et l'image, m\xEAme si l'entit\xE9 principale est en cours de lecture.",show_volume_overlay:"Affiche bri\xE8vement un grand indicateur de volume sur l'illustration lorsque le niveau de volume change.",queue_controls_style:"Choisissez d'afficher une poign\xE9e de glissement ou des boutons de d\xE9placement individuels pour les \xE9l\xE9ments de la file d'attente."},titles:{edit_entity:"Modifier l'entit\xE9",edit_action:"Modifier l'action",service_data:"Donn\xE9es du service",add_artwork_override:"Ajouter un remplacement"},labels:{toggle_template_mode:"Basculer le mode mod\xE8le",dim_chips:"Assombrir les jetons en veille",hold_to_pin:"Maintenir pour \xE9pingler",always_show_group:"Groupe rapide par d\xE9faut",disable_autofocus:"D\xE9sactiver l'autofocus",keep_filters:"Garder les filtres",dismiss_on_play:"Fermer en lecture",pin_headers:"\xC9pingler les en-t\xEAtes",hide_search_headers_on_idle:"Masquer les en-t\xEAtes en veille",default_search_filter:"Filtre de recherche par d\xE9faut",default_search_favorites:"Filtre des favoris par d\xE9faut",disable_mass:"D\xE9sactiver Mass Queue",match_theme:"Suivre le th\xE8me",alt_progress:"Barre de progression alternative",progress_bar_height:"Hauteur de la barre de progression",display_timestamps:"Afficher les horodatages",swap_pause_stop:"Remplacer Pause par Stop",adaptive_controls:"Taille adaptative",hide_active_entity:"Masquer l'\xE9tiquette active",hide_active_entity_on_idle:"Masquer l'\xE9tiquette de l'entit\xE9 active en mode veille",collapse_on_idle:"R\xE9duire en veille",hide_menu_player_toggle:"Masquer le lecteur menu",hide_reorder_progress_toggle:"Masquer la progression de r\xE9organisation",always_collapsed:"Toujours r\xE9duit",expand_on_search:"Agrandir en recherche",script_var:"Variable script (yamp_entity)",use_ma_template:"Utiliser mod\xE8le MA",use_vol_template:"Utiliser mod\xE8le Volume",follow_active_entity:"Le volume suit l'entit\xE9 active",use_url_path:"Utiliser URL ou chemin",adaptive_text_elements:"\xC9l\xE9ments de texte adaptatif",disable_auto_select:"D\xE9sactiver la s\xE9lection automatique",always_show_lyrics:"Toujours afficher les paroles",lyrics_mode:"Mode des paroles",lyrics_source:"Source des paroles",lyrics_pre_roll:"Pr\xE9-roll des paroles (secondes)",blurred_artwork:"Image flout\xE9e",hide_collapsed_artwork:"Masquer l'image r\xE9duite",show_idle_artwork_when_not_playing:"Afficher l'image d'inactivit\xE9 si pas de lecture",prefer_ma_metadata:"Pr\xE9f\xE9rer les m\xE9tadonn\xE9es Music Assistant",show_volume_overlay:"Afficher la superposition de volume"},fields:{artwork_fit:"Ajustement",artwork_position:"Position",artwork_hostname:"H\xF4te",match_field:"Champ de correspondance",match_value:"Valeur de correspondance",size_percent:"Taille (%)",object_fit:"Object Fit",idle_timeout:"Veille (ms)",show_chip_row:"Afficher les jetons",search_limit:"Limite de r\xE9sultats",result_sorting:"Tri des r\xE9sultats",vol_step:"Pas du volume",card_height:"Hauteur (px)",control_layout:"Mise en page",idle_image:"Image de veille",image_url:"URL image",fallback_image_url:"URL de secours",move_to_main:"Mettre dans les jetons principaux",move_to_menu:"Mettre dans le menu",delete_action:"Supprimer l'action",volume_mode:"Mode volume",idle_screen:"\xC9cran de veille",name:"Nom",hidden_controls:"Commandes masqu\xE9es",hide_remote_buttons:"Boutons de t\xE9l\xE9commande masqu\xE9s",ma_template:"Mod\xE8le MA (Jinja)",hidden_chips:"Jetons masqu\xE9s",vol_template:"Mod\xE8le Volume (Jinja)",icon:"Ic\xF4ne",action_type:"Type d'action",menu_item:"\xC9l\xE9ment du menu",nav_path:"Chemin navigation",service:"Service",service_data:"Donn\xE9es",idle_image_entity:"Entit\xE9 image veille",match_entity:"Entit\xE9 de correspondance",ma_entity:"Entit\xE9 Music Assistant",vol_entity:"Entit\xE9 de volume",selected_entity_helper:"Helper d'entit\xE9 s\xE9lectionn\xE9e",sync_entity_type:"Type d'entit\xE9 \xE0 synchroniser",placement:"Placement",card_trigger:"D\xE9clencheur de carte",search_view:"Vue des r\xE9sultats de recherche",search_card_columns:"Nombre de colonnes",card_type:"Type de carte",appearance:"Apparence",no_artwork_option:"Pas d'illustration",details_alignment:"Alignement des d\xE9tails",queue_controls_style:"Style des commandes de file d'attente"},action_types:{menu:"Ouvrir un \xE9l\xE9ment de menu",service:"Appeler un service",navigate:"Naviguer",prev_entity:"Puce de l'entit\xE9 pr\xE9c\xE9dente",next_entity:"Puce de l'entit\xE9 suivante",sync_selected_entity:"Synchroniser l'entit\xE9 s\xE9lectionn\xE9e",select_entity:"S\xE9lectionner l'entit\xE9 depuis le helper",toggle_lyrics:"Activer/D\xE9sactiver la superposition des paroles",remote_control:"Ouvrir l'overlay t\xE9l\xE9commande"},action_helpers:{sync_selected_entity:"Synchroniser l'entit\xE9 s\xE9lectionn\xE9e \u2192",select_entity:"S\xE9lectionner l'entit\xE9 \u2190",select_helper:"(s\xE9lectionner helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entit\xE9 Music Assistant si configur\xE9e)",yamp_main_entity:"yamp_main_entity (Entit\xE9 principale du lecteur)",yamp_playback_entity:"yamp_playback_entity (Entit\xE9 de lecture active actuelle)"},placements:{chip:"Puce d'action",menu:"Dans le menu",hidden:"Masqu\xE9 (Appui sur l'image)",not_triggerable:"Non d\xE9clenchable"},triggers:{none:"Aucun",tap:"Appui",hold:"Maintenir",double_tap:"Double appui",swipe_left:"Glisser vers la gauche",swipe_right:"Glisser vers la droite"},search_view_options:{list:"Liste",card:"Carte",card_minimal:"Carte minimale"},queue_controls_style_options:{drag_handle:"Poign\xE9e de glissement",icons:"Boutons de d\xE9placement"},card_type_options:{default:"Par d\xE9faut",search:"Rechercher",group_players:"Grouper les lecteurs",up_next:"\xC0 suivre",remote_control:"T\xE9l\xE9commande"},appearance_options:{automatic:"Automatique",light:"Clair",dark:"Sombre"},artwork_fit:{default:"Global",cover:"Couverture (par d\xE9faut)",contain:"Contenir",fill:"Remplir","scale-down":"R\xE9duire","scaled-contain":"Contenir mis \xE0 l'\xE9chelle","scaled-contain-alternate":"Contenir mis \xE0 l'\xE9chelle alternatif",none:"Aucun"},artwork_position:{default:"Global",top:"Haut",center:"Centre",bottom:"Bas"}},card:{sections:{details:"D\xE9tails lecture",menu:"Menu & Recherche",action_chips:"Jetons d'action"},media_controls:{shuffle:"Al\xE9atoire",previous:"Pr\xE9c\xE9dent",play_pause:"Lecture/Pause",stop:"Arr\xEAt",next:"Suivant",repeat:"R\xE9p\xE9ter"},menu:{more_info:"Plus d'infos",search:"Rechercher",source:"Source",remote_controls:"T\xE9l\xE9commande",show_lyrics:"Afficher les paroles",hide_lyrics:"Masquer les paroles",transfer_queue:"Transf\xE9rer la file",main_menu:"Menu Principal",group_players:"Grouper les lecteurs",up_next:"\xC0 suivre",remote_control:"T\xE9l\xE9commande",select_entity:"Choisir pour plus d'infos",transfer_to:"Transf\xE9rer vers",no_players:"Aucun lecteur MA disponible."},remote:{title:"T\xE9l\xE9commande",up:"Haut",down:"Bas",left:"Gauche",right:"Droite",select:"S\xE9lectionner",back:"Retour",menu:"Menu",home:"Accueil",power:"Alimentation"},grouping:{title:"Grouper les lecteurs",sync_volume:"Synchroniser volume",group_all:"Grouper tout",ungroup_all:"D\xE9grouper tout",unavailable:"Lecteur indisponible",no_players:"Aucun lecteur groupable.",master:"Ma\xEEtre",joined:"Li\xE9",available:"Disponible",current:"Actuel",unjoin_from:"Se d\xE9solidariser de {master}",join_with:"Se joindre \xE0 {master}"}},search:{favorites:"Favoris",recently_played:"R\xE9cemment lus",next_up:"\xC0 suivre",recommendations:"Recommandations",radio_mode:"Mode Radio",show_track_options:"Afficher les options du titre",play_similar:"Lire des chansons similaires",close:"Fermer la recherche",no_results:"Aucun r\xE9sultat.",play_next:"Lire apr\xE8s",replace_play:"Remplacer et lire",replace:"Remplacer file",add_queue:"Ajouter \xE0 la fin",move_up:"Monter",move_down:"Descendre",move_next:"Passer au suivant",remove:"Retirer de la file",drag_to_reorder:"Glisser pour r\xE9organiser",added:"Ajout\xE9 \xE0 la file !",added_to_playlist:"Ajout\xE9 \xE0 la playlist !",select_playlist:"S\xE9lectionner une playlist pour '{track}'",add_to_playlist:"Ajouter \xE0 la playlist",select_track_for_playlist:"S\xE9lectionner le titre \xE0 ajouter pour '{track}' par {artist}",labels:{replace:"Remplacer",next:"Suivant",replace_next:"Rempl. Suivant",add:"Ajouter",add_to_playlist:"Ajouter \xE0 la playlist"},results:"r\xE9sultats",result:"r\xE9sultat",filters:{all:"Tout",artist:"Artiste",album:"Album",track:"Titre",playlist:"Playlist",radio:"Radio",music:"Musique",station:"Station",podcast:"Podcast",audiobook:"Livre audio"},search_artist:"Chercher cet artiste",browse_album:"Parcourir les titres de {album}",play_collection:"Lire cette collection",play_collection_error:"Impossible de lire cette collection directement",play_item:"Lire {item}"},lyrics:{finding:"Recherche des paroles...",none_found:"Aucune parole trouv\xE9e",not_available:"Paroles non disponibles",instrumental:"Piste instrumentale"},lyrics_sources:{mass_lrclib:"Music Assistant (Repli sur LRCLIB)",mass:"Music Assistant uniquement",lrclib:"LRCLIB uniquement",lrclib_mass:"LRCLIB (Repli sur Music Assistant)"},lyrics_modes:{default:"Par d\xE9faut (Surligner et faire d\xE9filer)",scroll:"D\xE9filement uniquement",text:"Texte uniquement"}},fc={common:{not_found:"Entit\xE0 non trovata.",search:"Cerca",power:"Accensione",favorite:"Preferito",loading:"Caricamento...",no_results:"Nessun risultato.",close:"Chiudi",vol_up:"Volume su",vol_down:"Volume gi\xF9",media_player:"Lettore multimediale",edit_entity:"Modifica impostazioni entit\xE0",edit_action:"Modifica impostazioni azione",mute:"Muto",unmute:"Riattiva audio",seek:"Cerca",volume:"Volume",play_now:"Riproduci ora",more_options:"Altre opzioni",unavailable:"Non disponibile",back:"Indietro",cancel:"Annulla",reset_default:"Ripristina predefiniti",unpin:"Rimuovi pin",clear:"Cancella",album_art:"Copertina dell'album"},editor:{tabs:{entities:"Entit\xE0",behavior:"Comportamento",look_and_feel:"Aspetto",artwork:"Copertina",actions:"Azioni"},search_placeholder:"Cerca opzioni di configurazione...",placeholders:{search:"Cerca musica..."},templates:{minimal_mini:{label:"MINImal",description:"Una scheda compatta senza copertina."},normal_mini:{label:"Mini Mode",description:"La scheda compatta standard."}},sections:{artwork:{general:{title:"Impostazioni generali",description:"Controlli globali per la copertina."},idle:{title:"Copertina in riposo",description:"Mostra un'immagine statica quando non c'\xE8 riproduzione."},overrides:{title:"Override copertina",description:"Gli override sono valutati dall'alto in basso."}},entities:{title:"Entit\xE0*",description:"Aggiungi i lettori da controllare."},behavior:{idle_chips:{title:"Riposo e chip",description:"Scegli quando andare in riposo."},interactions_search:{title:"Interazioni e ricerca",description:"Ajusta il fissaggio delle entit\xE0."},lyrics:{title:"Testi",description:"Configura come vengono visualizzati i testi e quando appaiono."}},look_and_feel:{theme_layout:{title:"Tema e layout",description:"Adatta allo stile del dashboard."},controls_typography:{title:"Controlli e tipografia",description:"Ajusta bottoni e etichette."},collapsed_idle:{title:"Stati contratto e riposo",description:"Controlla il contratto della scheda."}},actions:{title:"Azioni",description:"Crea chip azione."}},subtitles:{idle_timeout:"Tempo prima del riposo (ms). 0 per disabilitare.",show_chip_row:`"Auto" nasconde la riga se c'\xE8 una sola entit\xE0. "Nel menu" sposta i chip nel menu. "Nel menu in inattivit\xE0" mostra i chip in linea quando attivo ma li sposta nel menu quando inattivo.`,dim_chips:"Appanna i chip in riposo per un aspetto pi\xF9 pulito.",hold_to_pin:"Tieni premuto per fissare invece di un tocco breve.",always_show_group:"I controlli di raggruppamento rapido (+/-/stella) saranno visibili per impostazione predefinita al caricamento della pagina. Puoi comunque attivarli manualmente tramite doppio tocco.",disable_autofocus:"Evita che la ricerca prenda il focus automaticamente.",search_within_filter:"Cerca nel filtro attivo (Preferiti, ecc.).",close_search_on_play:"Chiudi ricerca alla riproduzione.",pin_search_headers:"Fissa le intestazioni di ricerca durante lo scorrimento.",hide_search_headers_on_idle:"Nascondi la ricerca e i filtri quando inattivo.",disable_mass:"Disabilita integrazione Mass Queue.",swap_pause_stop:"Sostituisci pausa con stop nel design moderno.",adaptive_controls:"Permetti ai pulsanti di adattarsi allo spazio.",hide_menu_player:"Nascondi nome entit\xE0 quando \xE8 nel menu.",hide_reorder_progress:"Nascondi l'indicatore mobile di avanzamento del riordinamento della coda in basso.",adaptive_text:"Scegli quali testi si adattano allo spazio.",collapse_expand:"Sempre contratto attiva il modo mini. Espandi alla ricerca espande temporaneamente.",idle_screen:"Scegli schermata da mostrare in riposo.",hide_controls:"Seleziona controlli da nascondere.",hide_remote_buttons:"Seleziona i pulsanti da nascondere dal telecomando.",hide_search_chips:"Nascondi chip di filtro ricerca.",hide_active_entity_on_idle:"Nasconde l'etichetta dell'entit\xE0 in fondo alla scheda solo quando il lettore \xE8 inattivo.",follow_active_entity:"L'entit\xE0 volume seguir\xE0 quella attiva.",search_limit_full:"Massimo risultati (default: 20).",default_search_filter_full:"Scegli quale filtro \xE8 attivo per impostazione predefinita all'apertura della ricerca.",default_search_favorites:"Inizia ricerca con preferiti attivi",result_sorting_full:"Scegli ordine risultati.",card_height_full:"Lascia vuoto per altezza automatica.",control_layout_full:"Scegli tra design vecchio o moderno.",artwork_extend:"Estendi copertina sotto i chip.",artwork_extend_label:"Estendi copertina",no_artwork_overrides:"Nessun override copertina configurato.",missing_art_match:"Si applica quando il media selezionato non fornisce alcuna copertina.",idle_image_match:"Si applica quando il lettore \xE8 inattivo e viene visualizzata un'immagine di inattivit\xE0.",entity_current_hint:"Usa 'entity_id: current' per il lettore attuale.",jinja_template_hint:"Modello Jinja per entity_id.",jinja_template_vol_hint:"Modello per entit\xE0 volume.",not_available_alt_collapsed:"Non disponibile in modo contratto.",not_available_collapsed:"Non disponibile se contratto.",only_available_collapsed:"Solo disponibile se contratto.",only_available_modern:"Solo disponibile con layout Moderno.",image_url_helper:"Inserisci un URL diretto a un'immagine o un percorso file locale",selected_entity_helper:"Helper di testo di input che verr\xE0 aggiornato con l'ID dell'entit\xE0 del lettore multimediale attualmente selezionato.",select_entity_helper:"Helper di testo di input da cui leggere l'ID dell'entit\xE0. La scheda selezioner\xE0 automaticamente il chip corrispondente.",sync_entity_type:"Scegli quale ID entit\xE0 sincronizzare con l'helper (predefinito l'entit\xE0 Music Assistant se configurata).",disable_auto_select:"Evita che il chip di questa entit\xE0 venga selezionato automaticamente all'inizio della riproduzione.",search_view:"Scegli tra una lista standard o una griglia di schede per i risultati della ricerca.",search_card_columns:"Specifica quante colonne utilizzare nella vista a schede. La copertina si adatter\xE0 automaticamente.",card_type:"Scegli la modalit\xE0 della scheda. 'Predefinito' \xE8 il lettore multimediale standard. 'Ricerca dedicata' rende la scheda un'interfaccia di ricerca permanente.",always_show_lyrics:"Apri automaticamente la visualizzazione dei testi quando la pagina viene aggiornata.",lyrics_source:"Music Assistant richiede l'integrazione mass_queue per recuperare i testi dal suo motore di metadati interno.",lyrics_pre_roll:"Sposta il tempismo dell'evidenziazione dei testi. I valori positivi lo accelerano, quelli negativi lo ritardano (predefinito: 0).",blurred_artwork:"Sfoca sempre l'immagine di sfondo",hide_collapsed_artwork:"Nascondi l'immagine piccola a destra quando la scheda \xE8 compressa",show_idle_artwork_when_not_playing:"Se abilitato, selezionando un chip che non \xE8 attualmente in riproduzione verr\xE0 mostrata l'immagine inattiva configurata invece della copertina di riproduzione attiva.",prefer_ma_metadata:"Utilizza sempre l'entit\xE0 Music Assistant associata per il titolo del brano, l'artista e l'artwork, anche se l'entit\xE0 principale \xE8 in riproduzione.",show_volume_overlay:"Visualizza brevemente un grande indicatore del volume sopra la copertina quando il livello del volume cambia.",queue_controls_style:"Scegli se mostrare una maniglia di trascinamento o pulsanti di movimento singoli per gli elementi della coda."},titles:{edit_entity:"Modifica entit\xE0",edit_action:"Modifica azione",service_data:"Dati servizio",add_artwork_override:"Aggiungi override"},labels:{toggle_template_mode:"Attiva/disattiva modalit\xE0 modello",dim_chips:"Appanna chip in riposo",hold_to_pin:"Tieni premuto per fissare",always_show_group:"Gruppo rapido predefinito",disable_autofocus:"Disabilita autofocus",keep_filters:"Mantieni filtri",dismiss_on_play:"Chiudi alla riproduzione",pin_headers:"Fissa intestazioni",hide_search_headers_on_idle:"Nascondi intestazioni in inattivit\xE0",default_search_filter:"Filtro di ricerca predefinito",default_search_favorites:"Filtro preferiti predefinito",disable_mass:"Disabilita Mass Queue",match_theme:"Segui tema",alt_progress:"Barra progresso alternativa",progress_bar_height:"Altezza barra di avanzamento",display_timestamps:"Mostra timestamp",swap_pause_stop:"Sostituisci Pausa con Stop",adaptive_controls:"Dimensione adattativa",hide_active_entity:"Nascondi nome entit\xE0 attiva",hide_active_entity_on_idle:"Nascondi etichetta entit\xE0 attiva quando inattivo",collapse_on_idle:"Contrai in riposo",hide_menu_player_toggle:"Nascondi lettore menu",hide_reorder_progress_toggle:"Nascondi avanzamento riordinamento",always_collapsed:"Sempre contratto",expand_on_search:"Espandi alla ricerca",script_var:"Variabile script (yamp_entity)",use_ma_template:"Usa modello MA",use_vol_template:"Usa modello Volume",follow_active_entity:"Volume segue entit\xE0 attiva",use_url_path:"Usa URL o percorso",adaptive_text_elements:"Elementi per dimensione testo adattiva",disable_auto_select:"Disabilita selezione automatica",always_show_lyrics:"Mostra sempre i testi",lyrics_mode:"Modalit\xE0 testi",lyrics_source:"Sorgente testi",lyrics_pre_roll:"Pre-roll testi (secondi)",blurred_artwork:"Immagine sfocata",hide_collapsed_artwork:"Nascondi immagine contratta",show_idle_artwork_when_not_playing:"Mostra immagine inattiva quando non in riproduzione",prefer_ma_metadata:"Preferisci i metadati di Music Assistant",show_volume_overlay:"Mostra overlay volume"},fields:{artwork_fit:"Adattamento",artwork_position:"Posizione",artwork_hostname:"Host",match_field:"Campo",match_value:"Valore",size_percent:"Dimensione (%)",object_fit:"Object Fit",idle_timeout:"Riposo (ms)",show_chip_row:"Mostra chip",search_limit:"Limite ricerca",result_sorting:"Ordine",vol_step:"Passo volume",card_height:"Altezza (px)",control_layout:"Design",idle_image:"Immagine di inattivit\xE0",image_url:"URL immagine",fallback_image_url:"URL fallback",move_to_main:"Sposta in chip principali",move_to_menu:"Sposta nel menu",delete_action:"Elimina azione",volume_mode:"Modo volume",idle_screen:"Schermo riposo",name:"Nome",hidden_controls:"Controlli nascosti",hide_remote_buttons:"Pulsanti del telecomando nascosti",ma_template:"Modello MA (Jinja)",hidden_chips:"Chip nascosti",vol_template:"Modello Volume (Jinja)",icon:"Icona",action_type:"Tipo azione",menu_item:"Elemento menu",nav_path:"Percorso",service:"Servizio",service_data:"Dati",idle_image_entity:"Entit\xE0 immagine riposo",match_entity:"Entit\xE0",ma_entity:"Entit\xE0 Music Assistant",vol_entity:"Entit\xE0 di volume",selected_entity_helper:"Helper entit\xE0 selezionata",sync_entity_type:"Tipo di entit\xE0 da sincronizzare",placement:"Posizionamento",card_trigger:"Trigger della scheda",search_view:"Vista risultati ricerca",search_card_columns:"Colonne schede",card_type:"Tipo di scheda",appearance:"Aspetto",no_artwork_option:"Nessuna copertina",details_alignment:"Allineamento dei dettagli",queue_controls_style:"Stile controlli coda"},action_types:{menu:"Apri un elemento del menu",service:"Chiama un servizio",navigate:"Naviga",prev_entity:"Chip entit\xE0 precedente",next_entity:"Chip entit\xE0 successiva",sync_selected_entity:"Sincronizza entit\xE0 selezionata",select_entity:"Seleziona entit\xE0 da helper",toggle_lyrics:"Attiva/disattiva sovrapposizione testi",remote_control:"Apri sovrapposizione telecomando"},action_helpers:{sync_selected_entity:"Sincronizza entit\xE0 selezionata \u2192",select_entity:"Seleziona entit\xE0 \u2190",select_helper:"(seleziona helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entit\xE0 Music Assistant se configurata)",yamp_main_entity:"yamp_main_entity (Entit\xE0 principale del lettore)",yamp_playback_entity:"yamp_playback_entity (Entit\xE0 di riproduzione attiva attuale)"},placements:{chip:"Chip d'azione",menu:"Nel menu",hidden:"Nascosto (Tocco sull'immagine)",not_triggerable:"Non attivabile"},triggers:{none:"Nessuno",tap:"Tocco",hold:"Mantieni",double_tap:"Doppio tocco",swipe_left:"Scorri a sinistra",swipe_right:"Scorri a destra"},search_view_options:{list:"Lista",card:"Scheda",card_minimal:"Scheda minima"},queue_controls_style_options:{drag_handle:"Maniglia di trascinamento",icons:"Pulsanti di movimento"},card_type_options:{default:"Predefinito",search:"Cerca",group_players:"Raggruppa i lettori",up_next:"In coda",remote_control:"Telecomando"},appearance_options:{automatic:"Automatico",light:"Chiaro",dark:"Scuro"},artwork_fit:{default:"Globale",cover:"Copertina (predefinito)",contain:"Contieni",fill:"Riempi","scale-down":"Ridimensiona","scaled-contain":"Contieni scalato","scaled-contain-alternate":"Contieni scalato alternativo",none:"Nessuno"},artwork_position:{default:"Globale",top:"In alto",center:"Centro",bottom:"In basso"}},card:{sections:{details:"Dettagli riproduzione",menu:"Menu e Ricerca",action_chips:"Chip azione"},media_controls:{shuffle:"Casuale",previous:"Precedente",play_pause:"Riproduci/Pausa",stop:"Ferma",next:"Successivo",repeat:"Ripeti"},menu:{more_info:"Pi\xF9 info",search:"Cerca",source:"Sorgente",remote_controls:"Telecomando",show_lyrics:"Mostra testi",hide_lyrics:"Nascondi testi",transfer_queue:"Trasferisci coda",main_menu:"Menu Principale",group_players:"Raggruppa",up_next:"In coda",remote_control:"Telecomando",select_entity:"Seleziona",transfer_to:"Trasferisci a",no_players:"Senza lettori MA."},remote:{title:"Telecomando",up:"Su",down:"Gi\xF9",left:"Sinistra",right:"Destra",select:"Seleziona",back:"Indietro",menu:"Menu",home:"Home",power:"Accensione"},grouping:{title:"Raggruppa",sync_volume:"Sincronizza volume",group_all:"Raggruppa tutti",ungroup_all:"Separa tutti",unavailable:"Non disponibile",no_players:"Non raggruppabile.",master:"Master",joined:"Unito",available:"Disponibile",current:"Attuale",unjoin_from:"Scollegati da {master}",join_with:"Unisciti a {master}"}},search:{favorites:"Preferiti",recently_played:"Recenti",next_up:"A seguire",recommendations:"Raccomandazioni",radio_mode:"Modo Radio",show_track_options:"Mostra opzioni brano",play_similar:"Riproduci brani simili",close:"Chiudi",no_results:"Nessun risultato.",play_next:"Riprod. successivo",replace_play:"Sostituisci e riproduci",replace:"Sostituisci coda",add_queue:"Aggiungi alla fine",move_up:"Sposta su",move_down:"Sposta gi\xF9",move_next:"Passa al successivo",remove:"Rimuovi da coda",drag_to_reorder:"Trascina per riordinare",added:"Aggiunto!",added_to_playlist:"Aggiunto alla playlist!",select_playlist:"Seleziona playlist per '{track}'",add_to_playlist:"Aggiungi alla playlist",select_track_for_playlist:"Seleziona il brano da aggiungere per '{track}' di {artist}",labels:{replace:"Sostituisci",next:"Successivo",replace_next:"Sost. succ.",add:"Aggiungi",add_to_playlist:"Aggiungi alla playlist"},results:"risultati",result:"risultato",filters:{all:"Tutto",artist:"Artista",album:"Album",track:"Brano",playlist:"Playlist",radio:"Radio",music:"Musica",station:"Stazione",podcast:"Podcast",audiobook:"Audiolibro"},search_artist:"Cerca questo artista",browse_album:"Sfoglia i brani di {album}",play_collection:"Riproduci questa collezione",play_collection_error:"Impossibile riprodurre direttamente questa collezione",play_item:"Riproduci {item}"},lyrics:{finding:"Ricerca testi...",none_found:"Nessun testo trovato",not_available:"Testi non disponibili",instrumental:"Brano strumentale"},lyrics_sources:{mass_lrclib:"Music Assistant (Fallback su LRCLIB)",mass:"Solo Music Assistant",lrclib:"Solo LRCLIB",lrclib_mass:"LRCLIB (Fallback su Music Assistant)"},lyrics_modes:{default:"Predefinito (Evidenzia e scorri)",scroll:"Solo scorrimento",text:"Solo testo"}},yc={common:{not_found:"Entiteit niet gevonden.",search:"Zoeken",power:"Aan/Uit",favorite:"Favoriet",loading:"Laden...",no_results:"Geen resultaten.",close:"Sluiten",vol_up:"Volume Omhoog",vol_down:"Volume Omlaag",media_player:"Mediaspeler",edit_entity:"Entiteitsinstellingen Bewerken",edit_action:"Actie-instellingen Bewerken",mute:"Dempen",unmute:"Dempen opheffen",seek:"Zoeken",volume:"Volume",play_now:"Nu Spelen",more_options:"Meer Opties",unavailable:"Niet beschikbaar",back:"Terug",cancel:"Annuleren",reset_default:"Herstellen naar standaard",unpin:"Losmaken",clear:"Wissen",album_art:"Albumhoes"},editor:{tabs:{entities:"Entiteiten",behavior:"Gedrag",look_and_feel:"Uiterlijk",artwork:"Artwork",actions:"Acties"},search_placeholder:"Configuratieopties zoeken...",placeholders:{search:"Zoek muziek..."},templates:{minimal_mini:{label:"MINImal",description:"Een compacte kaart zonder artwork."},normal_mini:{label:"Mini Mode",description:"De standaard compacte kaart."}},sections:{artwork:{general:{title:"Algemene Instellingen",description:"Globale instellingen voor hoe artwork wordt weergegeven en opgehaald."},idle:{title:"Artwork bij Inactiviteit",description:"Toon een statische afbeelding of entiteits-snapshot wanneer er niets wordt afgespeeld."},overrides:{title:"Artwork Overschrijvingen",description:"Overschrijvingen worden van boven naar beneden ge\xEBvalueerd. Sleep om te sorteren."}},entities:{title:"Entiteiten*",description:"Voeg de mediaspelers toe die je wilt bedienen. Sleep entiteiten om de volgorde te wijzigen."},behavior:{idle_chips:{title:"Inactiviteit & Chips",description:"Kies wanneer de kaart inactief wordt en hoe entiteitschips zich gedragen."},interactions_search:{title:"Interacties & Zoeken",description:"Verfijn hoe entiteiten worden vastgezet en hoeveel resultaten er tegelijk worden getoond."},lyrics:{title:"Songteksten",description:"Configureer hoe songteksten worden weergegeven en wanneer ze verschijnen."}},look_and_feel:{theme_layout:{title:"Thema & Layout",description:"Stem af op de styling van het dashboard en beheer de totale voetafdruk."},controls_typography:{title:"Bediening & Typografie",description:"Pas knopgrootte, entiteitslabels en adaptieve tekst aan."},collapsed_idle:{title:"Ingeklapte & Inactieve Staten",description:"Beheer wanneer de kaart inklapt en welke weergaven getoond worden bij inactiviteit."}},actions:{title:"Acties",description:"Bouw de actiechips die in de kaart of het menu verschijnen. Sleep om te sorteren, klik op het potlood om te configureren."}},subtitles:{idle_timeout:"Tijd in milliseconden voordat de kaart naar de inactieve modus gaat. Stel in op 0 om inactiviteitsgedrag uit te schakelen.",show_chip_row:'"Auto" verbergt de chiprij wanneer er slechts \xE9\xE9n entiteit is geconfigureerd. "In Menu" verplaatst de chips naar het menu-overlay. "In menu bij inactiviteit" toont chips inline wanneer actief maar verplaatst ze naar het menu wanneer inactief.',dim_chips:"Wanneer de kaart inactief wordt met een afbeelding, dim dan de entiteits- en actiechips voor een strakker uiterlijk.",hold_to_pin:"Houd entiteitschips lang ingedrukt in plaats van kort om ze vast te zetten, om automatisch schakelen tijdens afspelen te voorkomen.",always_show_group:"Snelgroeperingsknoppen (+/-/ster) zijn standaard zichtbaar bij het laden van de pagina. Je kunt ze nog steeds handmatig in- of uitschakelen via dubbeltikken.",disable_autofocus:"Voorkom dat het zoekveld de focus steelt, zodat onscreen toetsenborden verborgen blijven.",search_within_filter:"Schakel dit in om te zoeken binnen het huidige actieve filter (Favorieten, Recent Afgespeeld, etc) in plaats van dit te wissen.",close_search_on_play:"Sluit het zoekscherm automatisch wanneer een nummer wordt afgespeeld.",pin_search_headers:"Houd de zoekinvoer en filters bovenaan vast tijdens het scrollen door resultaten.",hide_search_headers_on_idle:"Verberg zoekinvoer en filters wanneer inactief.",disable_mass:"Schakel de optionele Mass Queue integratie uit, zelfs als deze is ge\xEFnstalleerd.",swap_pause_stop:"Vervang de pauzeknop door stop bij gebruik van de moderne lay-out.",adaptive_controls:"Laat de afspeelknoppen groeien of krimpen om in de beschikbare ruimte te passen.",hide_menu_player:"Wanneer chips in het menu staan, verberg dan het entiteitslabel onderaan de kaart.",hide_reorder_progress:"Verberg de zwevende voortgangsindicator voor het opnieuw sorteren van de wachtrij onderaan.",adaptive_text:"Kies welke tekstgroepen moeten schalen met de beschikbare ruimte (laat leeg om adaptieve tekst uit te schakelen).",collapse_expand:"Altijd Ingeklapt cre\xEBert de mini-spelermodus. Uitklappen bij Zoeken klapt tijdelijk uit tijdens het zoeken.",idle_screen:"Kies welk scherm automatisch wordt weergegeven wanneer de kaart inactief wordt.",hide_controls:"Selecteer welke knoppen je wilt verbergen voor deze entiteit (standaard worden ze allemaal getoond)",hide_search_chips:"Verberg specifieke zoekfilterchips voor deze entiteit",hide_active_entity_on_idle:"Verbergt het entiteitslabel onderaan de kaart alleen wanneer de speler inactief is.",follow_active_entity:"Indien ingeschakeld, zal de volume-entiteit automatisch de actieve afspeel-entiteit volgen. Let op: dit overschrijft de geselecteerde volume-entiteit.",search_limit_full:"Maximaal aantal zoekresultaten om weer te geven (standaard: 20)",default_search_filter_full:"Kies welk filter standaard actief is wanneer het zoekscherm wordt geopend.",default_search_favorites:"Start zoekopdracht met favorieten actief",result_sorting_full:"Kies hoe zoekresultaten worden gesorteerd. Standaard behoudt de bronvolgorde.",card_height_full:"Laat leeg voor automatische hoogte",control_layout_full:"Kies tussen de oude gelijkmatig verdeelde knoppen of de moderne Home Assistant lay-out.",artwork_extend:"Laat de artwork-achtergrond doorlopen onder de chip- en actierijen.",artwork_extend_label:"Artwork uitbreiden",no_artwork_overrides:"Geen artwork overschrijvingen geconfigureerd. Gebruik de plusknop hieronder om er een toe te voegen.",missing_art_match:"Is van toepassing wanneer de geselecteerde media geen hoesafbeelding biedt.",idle_image_match:"Is van toepassing wanneer de speler inactief is en er een rustafbeelding wordt weergegeven.",entity_current_hint:"Gebruik 'entity_id: current' om de momenteel geselecteerde mediaspeler op de kaart te targeten.",jinja_template_hint:"Voer een Jinja-sjabloon in dat resulteert in een enkele entity_id. Voorbeeld voor het wisselen van MA op basis van een bronselectie:",jinja_template_vol_hint:"Voer een Jinja-sjabloon in dat resulteert in een entity_id (bijv. media_player.kantoor). Voorbeeld voor het wisselen van volume-entiteit op basis van een boolean:",not_available_alt_collapsed:"Niet beschikbaar met Alternatieve Voortgangsbalk of Altijd Ingeklapte modus",not_available_collapsed:"Niet beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",only_available_collapsed:"Alleen beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",only_available_modern:"Alleen beschikbaar met de Moderne lay-out",image_url_helper:"Voer een directe URL naar een afbeelding of een lokaal bestandspad in",selected_entity_helper:"Invoerteksthelper die wordt bijgewerkt met de momenteel geselecteerde media player-entiteits-ID.",select_entity_helper:"Invoerteksthelper waaruit het entiteits-ID wordt gelezen. De kaart selecteert automatisch de bijbehorende chip.",sync_entity_type:"Kies welk entiteits-ID moet worden gesynchroniseerd met de helper (standaard Music Assistant-entiteit indien geconfigureerd).",disable_auto_select:"Voorkomt dat de chip van deze entiteit automatisch wordt geselecteerd wanneer deze begint af te spelen.",search_view:"Kies tussen een standaardlijst of een raster van kaarten voor zoekresultaten.",search_card_columns:"Geef aan hoeveel kolommen er gebruikt moeten worden in de kaartweergave. De afbeelding wordt automatisch aangepast.",card_type:"Kies de kaartmodus. 'Standaard' is de standaard mediaspeler. 'Speciale zoekopdracht' maakt van de kaart een permanente zoekinterface.",always_show_lyrics:"Open automatisch de songtekstweergave wanneer de pagina wordt vernieuwd.",lyrics_source:"Music Assistant vereist de mass_queue-integratie om songteksten op te halen uit de interne metadata-engine.",lyrics_pre_roll:"Verschuif de timing van de songtekstmarkering. Positieve waarden versnellen het, negatieve waarden vertragen het (standaard: 0).",blurred_artwork:"Achtergrondafbeelding altijd vervagen",hide_collapsed_artwork:"Verberg de kleine afbeelding aan de rechterkant wanneer de kaart is ingeklapt",show_idle_artwork_when_not_playing:"Indien ingeschakeld, zal het selecteren van een chip die momenteel niet wordt afgespeeld de geconfigureerde stand-by afbeelding weergeven in plaats van de actieve afspeel-art.",prefer_ma_metadata:"Gebruik altijd de gekoppelde Music Assistant-entiteit voor de tracktitel, artiest en artwork, zelfs als de primaire entiteit wordt afgespeeld.",show_volume_overlay:"Geef kort een grote volume-indicator weer over het artwork wanneer het volumeniveau verandert.",queue_controls_style:"Kies of u een sleephandgreep of individuele bewegingsknoppen wilt weergeven voor wachtrij-items."},titles:{edit_entity:"Entiteit Bewerken",edit_action:"Actie Bewerken",service_data:"Servicegegevens",add_artwork_override:"Artwork Overschrijving Toevoegen"},labels:{toggle_template_mode:"Sjabloonmodus wisselen",dim_chips:"Chips dimmen bij inactiviteit",hold_to_pin:"Ingedrukt houden om vast te zetten",always_show_group:"Snelgroepering standaard aan",disable_autofocus:"Zoek-autofocus uitschakelen",keep_filters:"Filters behouden bij zoeken",dismiss_on_play:"Zoeken sluiten bij afspelen",pin_headers:"Zoekkoppen vastzetten",hide_search_headers_on_idle:"Zoekkoppen verbergen bij inactiviteit",default_search_filter:"Standaard zoekfilter",default_search_favorites:"Standaard naar favorietenfilter",disable_mass:"Mass Queue uitschakelen",match_theme:"Thema matchen",alt_progress:"Alternatieve Voortgangsbalk",progress_bar_height:"Hoogte voortgangsbalk",display_timestamps:"Tijdstempels Weergeven",swap_pause_stop:"Pauze vervangen door Stop",adaptive_controls:"Adaptieve Knoppen Grootte",hide_active_entity:"Label van Actieve Entiteit verbergen",hide_active_entity_on_idle:"Actieve entiteitslabel verbergen bij inactiviteit",collapse_on_idle:"Inklappen bij inactiviteit",hide_menu_player_toggle:"Menu-speler Verbergen",hide_reorder_progress_toggle:"Wachtrijsortering Verbergen",always_collapsed:"Altijd Ingeklapt",expand_on_search:"Uitklappen bij Zoeken",script_var:"Script Variabele (yamp_entity)",use_ma_template:"Sjabloon gebruiken voor Music Assistant Entiteit",use_vol_template:"Sjabloon gebruiken voor Volume Entiteit",follow_active_entity:"Volume Entiteit volgt Actieve Entiteit",use_url_path:"URL of Pad gebruiken",adaptive_text_elements:"Elementen voor adaptieve tekstgrootte",disable_auto_select:"Automatische selectie uitschakelen",always_show_lyrics:"Toon altijd songteksten",lyrics_mode:"Songtekstmodus",lyrics_source:"Songtekstbron",lyrics_pre_roll:"Songtekst Pre-Roll (seconden)",blurred_artwork:"Vervaagde afbeelding",hide_collapsed_artwork:"Verkleinde afbeelding verbergen",show_idle_artwork_when_not_playing:"Toon stand-by afbeelding wanneer niet afgespeeld",prefer_ma_metadata:"Voorkeur voor Music Assistant-metadata",show_volume_overlay:"Volume-overlay weergeven"},fields:{artwork_fit:"Artwork Passend Maken",artwork_position:"Artwork Positie",artwork_hostname:"Artwork Hostnaam",match_field:"Match Veld",match_value:"Match Waarde",size_percent:"Grootte (%)",object_fit:"Object Fit",idle_timeout:"Time-out voor Inactiviteit (ms)",show_chip_row:"Chiprij Tonen",search_limit:"Limiet Zoekresultaten",result_sorting:"Sortering Resultaten",vol_step:"Volume Stap (0.05 = 5%)",card_height:"Kaarthoogte (px)",control_layout:"Knoppen Lay-out",idle_image:"Rustafbeelding",image_url:"Afbeelding URL",fallback_image_url:"Fallback Afbeelding URL",move_to_main:"Verplaats actie naar hoofdchips",move_to_menu:"Verplaats actie naar menu",delete_action:"Actie Verwijderen",volume_mode:"Volume Modus",idle_screen:"Inactief Scherm",name:"Naam",hidden_controls:"Verborgen Knoppen",hide_remote_buttons:"Verborgen afstandsbediening knoppen",ma_template:"Music Assistant Entiteit Sjabloon (Jinja)",hidden_chips:"Verborgen Zoekfilterchips",vol_template:"Volume Entiteit Sjabloon (Jinja)",icon:"Icoon",action_type:"Actietype",menu_item:"Menu-item",nav_path:"Navigatiepad",service:"Service",service_data:"Servicegegevens",idle_image_entity:"Entiteit voor inactieve afbeelding",match_entity:"Match Entiteit",ma_entity:"Music Assistant-entiteit",vol_entity:"Volume-entiteit",selected_entity_helper:"Geselecteerde entiteitshelper",sync_entity_type:"Synchronisatie entiteitstype",placement:"Plaatsing",card_trigger:"Kaart trigger",search_view:"Zoekresultaten weergave",search_card_columns:"Aantal kolommen",card_type:"Kaarttype",appearance:"Uiterlijk",no_artwork_option:"Geen afbeelding",details_alignment:"Details uitlijning",queue_controls_style:"Wachtrijbesturingsstijl"},action_types:{menu:"Open een kaartmenu-item",service:"Roep een service aan",navigate:"Navigeren",prev_entity:"Vorige entiteit chip",next_entity:"Volgende entiteit chip",sync_selected_entity:"Synchroniseer geselecteerde entiteit",select_entity:"Selecteer entiteit uit helper",toggle_lyrics:"Wisselen tussen songtekst-overlay",remote_control:"Afstandsbediening overlay openen"},action_helpers:{sync_selected_entity:"Geselecteerde entiteit synchroniseren",select_entity:"Entiteit selecteren uit helper",select_helper:"(selecteer helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant-entiteit indien geconfigureerd)",yamp_main_entity:"yamp_main_entity (Hoofd media player-entiteit)",yamp_playback_entity:"yamp_playback_entity (Huidige actieve afspeelentiteit)"},placements:{chip:"Actiechip",menu:"In menu",hidden:"Verborgen (Artwork-tik)",not_triggerable:"Niet triggerbaar"},triggers:{none:"Geen",tap:"Tik",hold:"Vasthouden",double_tap:"Dubbeltik",swipe_left:"Veeg naar links",swipe_right:"Veeg naar rechts"},search_view_options:{list:"Lijst",card:"Kaart",card_minimal:"Minimale kaart"},queue_controls_style_options:{drag_handle:"Sleephandgreep",icons:"Bewegingsknoppen"},card_type_options:{default:"Standaard",search:"Zoeken",group_players:"Spelers groeperen",up_next:"Hierna",remote_control:"Afstandsbediening"},appearance_options:{automatic:"Automatisch",light:"Licht",dark:"Donker"},artwork_fit:{default:"Globaal",cover:"Cover (standaard)",contain:"Bevatten",fill:"Vullen","scale-down":"Verkleinen","scaled-contain":"Geschaalde contain","scaled-contain-alternate":"Geschaalde contain alternatief",none:"Geen"},artwork_position:{default:"Globaal",top:"Boven",center:"Midden",bottom:"Onder"}},card:{sections:{details:"Details van 'Nu Spelen'",menu:"Menu & Zoekschermen",action_chips:"Actie Chips"},media_controls:{shuffle:"Shuffle",previous:"Vorige",play_pause:"Afspelen/Pauzeren",stop:"Stop",next:"Volgende",repeat:"Herhalen"},menu:{more_info:"Meer Info",search:"Zoeken",source:"Bron",remote_controls:"Afstandsbediening",show_lyrics:"Songtekst weergeven",hide_lyrics:"Songtekst verbergen",transfer_queue:"Wachtrij Overdragen",main_menu:"Hoofdmenu",group_players:"Spelers Groeperen",up_next:"Hierna",remote_control:"Afstandsbediening",select_entity:"Selecteer Entiteit voor Meer Info",transfer_to:"Wachtrij Overdragen Naar",no_players:"Geen andere Music Assistant spelers beschikbaar."},remote:{title:"Afstandsbediening",up:"Omhoog",down:"Omlaag",left:"Links",right:"Rechts",select:"Selecteren",back:"Terug",menu:"Menu",home:"Startscherm",power:"AAN/UIT"},grouping:{title:"Spelers Groeperen",sync_volume:"Volume Synchroniseren",group_all:"Alles Groeperen",ungroup_all:"Alles Loskoppelen",unavailable:"Speler is niet beschikbaar",no_players:"Geen andere spelers beschikbaar die kunnen groeperen.",master:"Master",joined:"Gekoppeld",available:"Beschikbaar",current:"Huidig",unjoin_from:"Loskoppelen van {master}",join_with:"Koppelen met {master}"}},search:{favorites:"Favorieten",recently_played:"Recent Afgespeeld",next_up:"Volgende",recommendations:"Aanbevelingen",radio_mode:"Radiomodus",show_track_options:"Nummeropties weergeven",play_similar:"Vergelijkbare nummers afspelen",close:"Zoeken Sluiten",no_results:"Geen resultaten.",play_next:"Volgende afspelen",replace_play:"Huidige wachtrij vervangen en nu afspelen",replace:"Wachtrij vervangen",add_queue:"Toevoegen aan einde van de wachtrij",move_up:"Omhoog verplaatsen",move_down:"Omlaag verplaatsen",move_next:"Als volgende afspelen",remove:"Verwijderen uit wachtrij",drag_to_reorder:"Sleep om te herordenen",added:"Toegevoegd aan wachtrij!",added_to_playlist:"Toegevoegd aan afspeellijst!",select_playlist:"Selecteer afspeellijst voor '{track}'",add_to_playlist:"Toevoegen aan afspeellijst",select_track_for_playlist:"Selecteer het nummer om toe te voegen voor '{track}' van {artist}",labels:{replace:"Vervangen",next:"Volgende",replace_next:"Vervang Volgende",add:"Toevoegen",add_to_playlist:"Toevoegen aan afspeellijst"},results:"resultaten",result:"resultaat",filters:{all:"Alles",artist:"Artiest",album:"Album",track:"Nummer",playlist:"Afspeellijst",radio:"Radio",music:"Muziek",station:"Zender",podcast:"Podcast",audiobook:"Luisterboek"},search_artist:"Zoek naar deze artiest",browse_album:"Tracks van {album} doorzoeken",play_collection:"Speel deze collectie af",play_collection_error:"Kan deze collectie niet direct afspelen",play_item:"{item} afspelen"},lyrics:{finding:"Songteksten zoeken...",none_found:"Geen songteksten gevonden",not_available:"Songtekst niet beschikbaar",instrumental:"Instrumentaal nummer"},lyrics_sources:{mass_lrclib:"Music Assistant (Terugval naar LRCLIB)",mass:"Alleen Music Assistant",lrclib:"Alleen LRCLIB",lrclib_mass:"LRCLIB (Terugval naar Music Assistant)"},lyrics_modes:{default:"Standaard (Markeren & scrollen)",scroll:"Alleen scrollen",text:"Alleen tekst"}},vc={common:{not_found:"Entidade n\xE3o encontrada.",search:"Procurar",power:"Ligar/Desligar",favorite:"Favorito",loading:"A carregar...",no_results:"Sem resultados.",close:"Fechar",vol_up:"Aumentar volume",vol_down:"Diminuir volume",media_player:"Leitor multim\xE9dia",edit_entity:"Editar defini\xE7\xF5es da entidade",edit_action:"Editar defini\xE7\xF5es da a\xE7\xE3o",mute:"Silenciar",unmute:"Ativar som",seek:"Procurar",volume:"Volume",play_now:"Reproduzir agora",more_options:"Mais op\xE7\xF5es",unavailable:"Indispon\xEDvel",back:"Voltar",cancel:"Cancelar",reset_default:"Repor predefini\xE7\xF5es",unpin:"Desafixar",clear:"Limpar",album_art:"Capa do \xE1lbum"},editor:{tabs:{entities:"Entidades",behavior:"Comportamento",look_and_feel:"Aspeto",artwork:"Capa",actions:"A\xE7\xF5es"},search_placeholder:"Pesquisar op\xE7\xF5es de configura\xE7\xE3o...",placeholders:{search:"Procurar m\xFAsica..."},templates:{minimal_mini:{label:"MINImal",description:"Um cart\xE3o compacto sem capa."},normal_mini:{label:"Mini Mode",description:"O cart\xE3o compacto padr\xE3o."}},sections:{artwork:{general:{title:"Defini\xE7\xF5es gerais",description:"Controlos globais para a capa."},idle:{title:"Capa em repouso",description:"Mostrar imagem est\xE1tica quando nada toca."},overrides:{title:"Substitui\xE7\xF5es de capa",description:"As substitui\xE7\xF5es s\xE3o avaliadas de cima para baixo."}},entities:{title:"Entidades*",description:"Adicione os leitores a controlar."},behavior:{idle_chips:{title:"Repouso e chips",description:"Escolha quando ir para repouso."},interactions_search:{title:"Intera\xE7\xF5es e procura",description:"Ajuste a fixa\xE7\xE3o de entidades."},lyrics:{title:"Letras",description:"Configure como as letras s\xE3o exibidas e quando aparecem."}},look_and_feel:{theme_layout:{title:"Tema e design",description:"Combine com o estilo do dashboard."},controls_typography:{title:"Controlos e tipografia",description:"Ajuste bot\xF5es e etiquetas."},collapsed_idle:{title:"Estados contra\xEDdo e repouso",description:"Controle o contra\xEDdo do cart\xE3o."}},actions:{title:"A\xE7\xF5es",description:"Crie chips de a\xE7\xE3o."}},subtitles:{idle_timeout:"Tempo antes de repouso (ms). 0 para desativar.",show_chip_row:'"Auto" oculta a linha se houver apenas uma entidade. "No menu" move os chips. "No menu em repouso" mostra os chips em linha quando ativo mas move-os para o menu quando em repouso.',dim_chips:"Escurecer chips em repouso para um aspeto mais limpo.",hold_to_pin:"Manter premido para fixar em vez de toque curto.",always_show_group:"Os controles de agrupamento r\xE1pido (+/-/estrela) estar\xE3o vis\xEDveis por padr\xE3o ao carregar a p\xE1gina. Voc\xEA ainda pode altern\xE1-los manualmente atrav\xE9s de um toque duplo.",disable_autofocus:"Evitar que a procura tome o foco automaticamente.",search_within_filter:"Procurar no filtro ativo (Favoritos, etc.).",close_search_on_play:"Fechar procura ao reproduzir.",pin_search_headers:"Fixar cabe\xE7alhos de procura ao fazer scroll.",hide_search_headers_on_idle:"Ocultar pesquisa e filtros quando inativo.",disable_mass:"Desativar integra\xE7\xE3o Mass Queue.",swap_pause_stop:"Substituir pausa por stop no design moderno.",adaptive_controls:"Permitir que os bot\xF5es se adaptem ao espa\xE7o.",hide_menu_player:"Ocultar nome da entidade quando no menu.",hide_reorder_progress:"Ocultar o indicador flutuante de progresso de reordena\xE7\xE3o da fila na parte inferior.",adaptive_text:"Escolher que textos se adaptam ao espa\xE7o.",collapse_expand:"Sempre contra\xEDdo ativa modo mini. Expandir ao procurar expande temporariamente.",idle_screen:"Escolher ecr\xE3 a mostrar em repouso.",hide_controls:"Selecionar controlos a ocultar.",hide_remote_buttons:"Selecione bot\xF5es para ocultar do controle remoto.",hide_search_chips:"Ocultar chips de filtro de procura.",hide_active_entity_on_idle:"Oculta a etiqueta da entidade na parte inferior do cart\xE3o apenas quando o reprodutor est\xE1 inativo.",follow_active_entity:"A entidade de volume seguir\xE1 a ativa.",search_limit_full:"M\xE1ximo de resultados (default: 20).",default_search_filter_full:"Escolha qual filtro est\xE1 ativo por padr\xE3o quando a tela de pesquisa \xE9 aberta.",default_search_favorites:"Iniciar pesquisa com favoritos ativos",result_sorting_full:"Escolher ordem dos resultados.",card_height_full:"Deixar vazio para altura autom\xE1tica.",control_layout_full:"Escolher entre design antigo ou moderno.",artwork_extend:"Estender capa sob os chips.",artwork_extend_label:"Estender capa",no_artwork_overrides:"Sem substitui\xE7\xF5es de capa configuradas.",missing_art_match:"Aplica-se quando a m\xEDdia selecionada n\xE3o fornece arte.",idle_image_match:"Aplica-se quando o reprodutor est\xE1 inativo e uma imagem de inatividade est\xE1 sendo exibida.",entity_current_hint:"Use 'entity_id: current' para o leitor atual.",jinja_template_hint:"Modelo Jinja para entity_id.",jinja_template_vol_hint:"Modelo para entidade volume.",not_available_alt_collapsed:"N\xE3o dispon\xEDvel em modo contra\xEDdo.",not_available_collapsed:"N\xE3o dispon\xEDvel se contra\xEDdo.",only_available_collapsed:"Apenas dispon\xEDvel se contra\xEDdo.",only_available_modern:"Apenas dispon\xEDvel com layout Moderno.",image_url_helper:"Insira um URL direto para uma imagem ou um caminho de arquivo local",selected_entity_helper:"Helper de texto de entrada que ser\xE1 atualizado com o ID da entidade do reprodutor de m\xEDdia selecionado no momento.",select_entity_helper:"Helper de texto de entrada do qual ler o ID da entidade. O cart\xE3o selecionar\xE1 automaticamente o chip correspondente.",sync_entity_type:"Escolha qual ID de entidade sincronizar com o helper (padr\xE3o entidade Music Assistant se configurada).",disable_auto_select:"Impede que o chip desta entidade seja selecionado automaticamente quando a reprodu\xE7\xE3o \xE9 iniciada.",search_view:"Escolha entre uma lista padr\xE3o ou uma grade de cart\xF5es para os resultados da pesquisa.",search_card_columns:"Especifique quantas colunas usar na visualiza\xE7\xE3o de cart\xF5es. A capa ser\xE1 redimensionada automaticamente.",card_type:"Escolha o modo do cart\xE3o. 'Padr\xE3o' \xE9 o reprodutor de m\xEDdia padr\xE3o. 'Busca dedicada' torna o cart\xE3o uma interface de busca permanente.",always_show_lyrics:"Abrir automaticamente a visualiza\xE7\xE3o de letras quando a p\xE1gina for atualizada.",lyrics_source:"O Music Assistant requer a integra\xE7\xE3o mass_queue para obter letras do seu motor de metadados interno.",lyrics_pre_roll:"Ajuste o tempo de destaque da letra. Valores positivos aceleram, valores negativos atrasam (padr\xE3o: 0).",blurred_artwork:"Sempre desfocar a imagem de fundo",hide_collapsed_artwork:"Ocultar a imagem pequena \xE0 direita quando o cart\xE3o estiver recolhido",show_idle_artwork_when_not_playing:"Quando ativado, a sele\xE7\xE3o de uma ficha que n\xE3o esteja sendo reproduzida exibir\xE1 a imagem de repouso configurada em vez da imagem de reprodu\xE7\xE3o ativa.",prefer_ma_metadata:"Utilizar sempre a entidade Music Assistant emparelhada para o t\xEDtulo da faixa, artista e arte, mesmo que a entidade prim\xE1ria esteja a ser reproduzida.",show_volume_overlay:"Exibe brevemente um indicador de volume grande sobre a arte quando o n\xEDvel de volume muda.",queue_controls_style:"Escolha se deseja mostrar uma al\xE7a de arrastar ou bot\xF5es de movimento individuais para itens da fila."},titles:{edit_entity:"Editar entidade",edit_action:"Editar a\xE7\xE3o",service_data:"Dados do servi\xE7o",add_artwork_override:"Adicionar substitui\xE7\xE3o"},labels:{toggle_template_mode:"Alternar modo de modelo",dim_chips:"Escurecer chips em repouso",hold_to_pin:"Manter para fixar",always_show_group:"Grupo r\xE1pido por padr\xE3o",disable_autofocus:"Desativar autofoco",keep_filters:"Manter filtros",dismiss_on_play:"Fechar ao reproduzir",pin_headers:"Fixar cabe\xE7alhos",hide_search_headers_on_idle:"Ocultar cabe\xE7alhos em inatividade",default_search_filter:"Filtro de pesquisa padr\xE3o",default_search_favorites:"Filtro de favoritos padr\xE3o",disable_mass:"Desativar Mass Queue",match_theme:"Seguir tema",alt_progress:"Barra de progresso alternativa",progress_bar_height:"Altura da barra de progresso",display_timestamps:"Mostrar carimbos de tempo",swap_pause_stop:"Substituir Pausa por Stop",adaptive_controls:"Tamanho adaptativo",hide_active_entity:"Ocultar nome da entidade ativa",hide_active_entity_on_idle:"Ocultar etiqueta de entidade ativa quando inativo",collapse_on_idle:"Contrair em repouso",hide_menu_player_toggle:"Ocultar leitor do menu",hide_reorder_progress_toggle:"Ocultar progresso de reordena\xE7\xE3o",always_collapsed:"Sempre contra\xEDdo",expand_on_search:"Expandir ao procurar",script_var:"Vari\xE1vel script (yamp_entity)",use_ma_template:"Usar modelo MA",use_vol_template:"Usar modelo Volume",follow_active_entity:"Volume segue a entidade ativa",use_url_path:"Usar URL ou caminho",adaptive_text_elements:"Elementos de texto adaptativo",disable_auto_select:"Desativar sele\xE7\xE3o autom\xE1tica",always_show_lyrics:"Mostrar sempre as letras",lyrics_mode:"Modo de letras",lyrics_source:"Fonte das letras",lyrics_pre_roll:"Antecipa\xE7\xE3o de letra (segundos)",blurred_artwork:"Imagem desfocada",hide_collapsed_artwork:"Ocultar imagem reduzida",show_idle_artwork_when_not_playing:"Mostrar imagem de repouso quando n\xE3o reproduzindo",prefer_ma_metadata:"Preferir metadados do Music Assistant",show_volume_overlay:"Mostrar sobreposi\xE7\xE3o de volume"},fields:{artwork_fit:"Ajuste",artwork_position:"Posi\xE7\xE3o",artwork_hostname:"Host",match_field:"Campo",match_value:"Valor",size_percent:"Tamanho (%)",object_fit:"Object Fit",idle_timeout:"Repouso (ms)",show_chip_row:"Mostrar chips",search_limit:"Limite de procura",result_sorting:"Ordem",vol_step:"Passo de volume",card_height:"Altura (px)",control_layout:"Design",idle_image:"Imagem de inatividade",image_url:"URL imagem",fallback_image_url:"URL de reserva",move_to_main:"Mover para chips principais",move_to_menu:"Mover para o menu",delete_action:"Eliminar a\xE7\xE3o",volume_mode:"Modo volume",idle_screen:"Ecr\xE3 de repouso",name:"Nome",hidden_controls:"Controlos ocultos",hide_remote_buttons:"Bot\xF5es do controle remoto ocultos",ma_template:"Modelo MA (Jinja)",hidden_chips:"Chips ocultos",vol_template:"Modelo Volume (Jinja)",icon:"\xCDcone",action_type:"Tipo de a\xE7\xE3o",menu_item:"Item de menu",nav_path:"Caminho",service:"Servi\xE7o",service_data:"Dados",idle_image_entity:"Entidade imagem repouso",match_entity:"Entidade",ma_entity:"Entidade Music Assistant",vol_entity:"Entidade de volume",selected_entity_helper:"Helper de entidade selecionada",sync_entity_type:"Tipo de entidade a sincronizar",placement:"Posicionamento",card_trigger:"Gatilho do cart\xE3o",search_view:"Vista de resultados de pesquisa",search_card_columns:"Colunas de cart\xF5es",card_type:"Tipo de cart\xE3o",appearance:"Apar\xEAncia",no_artwork_option:"Sem imagem",details_alignment:"Alinhamento de detalhes",queue_controls_style:"Estilo de controles de fila"},action_types:{menu:"Abrir um item do menu",service:"Chamar um servi\xE7o",navigate:"Navegar",prev_entity:"Chip da entidade anterior",next_entity:"Chip da pr\xF3xima entidade",sync_selected_entity:"Sincronizar entidade selecionada",select_entity:"Selecionar entidade do helper",toggle_lyrics:"Alternar sobreposi\xE7\xE3o de letras",remote_control:"Abrir sobreposi\xE7\xE3o do controlo remoto"},action_helpers:{sync_selected_entity:"Sincronizar entidade selecionada \u2192",select_entity:"Selecionar entidade \u2190",select_helper:"(selecionar helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entidade Music Assistant se configurada)",yamp_main_entity:"yamp_main_entity (Entidade principal do reprodutor)",yamp_playback_entity:"yamp_playback_entity (Entidade de reprodu\xE7\xE3o ativa atual)"},placements:{chip:"Chip de a\xE7\xE3o",menu:"No menu",hidden:"Oculto (Toque no Artwork)",not_triggerable:"N\xE3o acion\xE1vel"},triggers:{none:"Nenhum",tap:"Toque",hold:"Manter premido",double_tap:"Toque duplo",swipe_left:"Deslizar para a esquerda",swipe_right:"Deslizar para a direita"},search_view_options:{list:"Lista",card:"Cart\xE3o",card_minimal:"Cart\xE3o minimalista"},queue_controls_style_options:{drag_handle:"Al\xE7a de arrastar",icons:"Bot\xF5es de movimento"},card_type_options:{default:"Padr\xE3o",search:"Procurar",group_players:"Agrupar",up_next:"A seguir",remote_control:"Controle Remoto"},appearance_options:{automatic:"Autom\xE1tico",light:"Claro",dark:"Escuro"},artwork_fit:{default:"Global",cover:"Capa (padr\xE3o)",contain:"Conter",fill:"Preencher","scale-down":"Reduzir","scaled-contain":"Conter dimensionado","scaled-contain-alternate":"Conter dimensionado alternativo",none:"Nenhum"},artwork_position:{default:"Global",top:"Topo",center:"Centro",bottom:"Inferior"}},card:{sections:{details:"Detalhes de reprodu\xE7\xE3o",menu:"Menu e Procura",action_chips:"Chips de a\xE7\xE3o"},media_controls:{shuffle:"Aleat\xF3rio",previous:"Anterior",play_pause:"Reproduzir/Pausa",stop:"Parar",next:"Seguinte",repeat:"Repetir"},menu:{more_info:"Mais info",search:"Procurar",source:"Fonte",remote_controls:"Controlo remoto",show_lyrics:"Mostrar letras",hide_lyrics:"Ocultar letras",transfer_queue:"Transferir fila",main_menu:"Menu Principal",group_players:"Agrupar",up_next:"A seguir",remote_control:"Controle Remoto",select_entity:"Selecionar",transfer_to:"Transferir para",no_players:"Sem leitores MA."},remote:{title:"Controlo remoto",up:"Para cima",down:"Para baixo",left:"Esquerda",right:"Direita",select:"Selecionar",back:"Voltar",menu:"Menu",home:"In\xEDcio",power:"Ligar/Desligar"},grouping:{title:"Agrupar",sync_volume:"Sincronizar volume",group_all:"Agrupar todos",ungroup_all:"Separar todos",unavailable:"Indispon\xEDvel",no_players:"N\xE3o agrup\xE1vel.",master:"Mestre",joined:"Unido",available:"Dispon\xEDvel",current:"Atual",unjoin_from:"Desvincular de {master}",join_with:"Juntar-se a {master}"}},search:{favorites:"Favoritos",recently_played:"Recentes",next_up:"A seguir",recommendations:"Recomenda\xE7\xF5es",radio_mode:"Modo R\xE1dio",show_track_options:"Mostrar op\xE7\xF5es da faixa",play_similar:"Tocar m\xFAsicas semelhantes",close:"Fechar",no_results:"Sem resultados.",play_next:"Reproduzir seguinte",replace_play:"Substituir e reproduzir",replace:"Substituir fila",add_queue:"Adicionar ao fim",move_up:"Subir",move_down:"Descer",move_next:"Passar para seguinte",remove:"Remover da fila",drag_to_reorder:"Arrastar para reordenar",added:"Adicionado!",added_to_playlist:"Adicionado \xE0 playlist!",select_playlist:"Selecionar playlist para '{track}'",add_to_playlist:"Adicionar \xE0 playlist",select_track_for_playlist:"Selecionar a faixa a adicionar para '{track}' de {artist}",labels:{replace:"Substituir",next:"Seguinte",replace_next:"Subst. seg.",add:"Adicionar",add_to_playlist:"Adicionar \xE0 playlist"},results:"resultados",result:"resultado",filters:{all:"Tudo",artist:"Artista",album:"\xC1lbum",track:"Faixa",playlist:"Lista",radio:"R\xE1dio",music:"M\xFAsica",station:"Esta\xE7\xE3o",podcast:"Podcast",audiobook:"Audiolivro"},search_artist:"Procurar este artista",browse_album:"Explorar faixas de {album}",play_collection:"Reproduzir esta cole\xE7\xE3o",play_collection_error:"N\xE3o \xE9 poss\xEDvel reproduzir esta cole\xE7\xE3o diretamente",play_item:"Reproduzir {item}"},lyrics:{finding:"Procurando letra...",none_found:"Nenhuma letra encontrada",not_available:"Letra n\xE3o dispon\xEDvel",instrumental:"Faixa instrumental"},lyrics_sources:{mass_lrclib:"Music Assistant (Alternativa para LRCLIB)",mass:"Apenas Music Assistant",lrclib:"Apenas LRCLIB",lrclib_mass:"LRCLIB (Alternativa para Music Assistant)"},lyrics_modes:{default:"Padr\xE3o (Destacar e rolar)",scroll:"Apenas rolar",text:"Apenas texto"}},bc={common:{not_found:"Entita sa nena\u0161la.",search:"H\u013Eada\u0165",power:"Nap\xE1janie",favorite:"Ob\u013E\xFAben\xE9",loading:"Na\u010D\xEDtava sa...",no_results:"\u017Diadne v\xFDsledky.",close:"Zatvori\u0165",vol_up:"Zv\xFD\u0161i\u0165 hlasitos\u0165",vol_down:"Zn\xED\u017Ei\u0165 hlasitos\u0165",media_player:"Prehr\xE1va\u010D m\xE9di\xED",edit_entity:"Upravi\u0165 nastavenia entity",edit_action:"Upravi\u0165 nastavenia akcie",mute:"Stlmi\u0165",unmute:"Zru\u0161i\u0165 stlmenie",seek:"Posun\xFA\u0165",volume:"Hlasitos\u0165",play_now:"Prehra\u0165 teraz",more_options:"Viac mo\u017Enost\xED",unavailable:"Nedostupn\xE9",back:"Sp\xE4\u0165",cancel:"Zru\u0161i\u0165",reset_default:"Obnovi\u0165 predvolen\xE9",unpin:"Odpn\xFA\u0165",clear:"Vymaza\u0165",album_art:"Grafika albumu"},editor:{tabs:{entities:"Entity",behavior:"Spr\xE1vanie",look_and_feel:"Vzh\u013Ead a dojem",artwork:"Grafika",actions:"Akcie"},search_placeholder:"Vyh\u013Eada\u0165 mo\u017Enosti konfigur\xE1cie...",placeholders:{search:"H\u013Eada\u0165 hudbu..."},templates:{minimal_mini:{label:"MINImal",description:"Kompaktn\xE1 karta bez obalu."},normal_mini:{label:"Mini Mode",description:"\u0160tandardn\xE1 kompaktn\xE1 karta."}},sections:{artwork:{general:{title:"V\u0161eobecn\xE9 nastavenia",description:"Glob\xE1lne ovl\xE1danie toho, ako sa grafika zobrazuje a z\xEDskava."},idle:{title:"Grafika pri ne\u010Dinnosti",description:"Zobrazi\u0165 statick\xFD obr\xE1zok alebo sn\xEDmku entity, ke\u010F sa ni\u010D neprehr\xE1va."},overrides:{title:"Prep\xEDsania grafiky",description:"Prep\xEDsania sa vyhodnocuj\xFA zhora nadol. Poradie zmen\xEDte potiahnut\xEDm."}},entities:{title:"Entity*",description:"Pridajte prehr\xE1va\u010De m\xE9di\xED, ktor\xE9 chcete ovl\xE1da\u0165. Potiahnut\xEDm ent\xEDt zmen\xEDte poradie v riadku \u010Dipov."},behavior:{idle_chips:{title:"Ne\u010Dinnos\u0165 a \u010Dipy",description:"Vyberte, kedy karta prejde do ne\u010Dinnosti a ako sa spr\xE1vaj\xFA \u010Dipy ent\xEDt."},interactions_search:{title:"Interakcie a h\u013Eadanie",description:"Doladenie prip\xEDnania ent\xEDt a po\u010Dtu zobrazen\xFDch v\xFDsledkov."},lyrics:{title:"Texty piesn\xED",description:"Nastavte, ako sa maj\xFA texty piesn\xED zobrazova\u0165 a kedy sa maj\xFA objavi\u0165."}},look_and_feel:{theme_layout:{title:"T\xE9ma a rozlo\u017Eenie",description:"Prisp\xF4sobte \u0161t\xFDl panelu a ovl\xE1dajte celkov\xFD vzh\u013Ead."},controls_typography:{title:"Ovl\xE1danie a typografia",description:"Nastavenie ve\u013Ekosti tla\u010Didiel, \u0161t\xEDtkov ent\xEDt a adapt\xEDvneho textu."},collapsed_idle:{title:"Zbalen\xE9 stavy a ne\u010Dinnos\u0165",description:"Ovl\xE1dajte, kedy sa karta zbal\xED a ktor\xE9 zobrazenia sa uk\xE1\u017Eu po\u010Das ne\u010Dinnosti."}},actions:{title:"Akcie",description:"Vytvorte ak\u010Dn\xE9 \u010Dipy, ktor\xE9 sa zobrazia na karte alebo v jej menu. Potiahnut\xEDm zmen\xEDte poradie, kliknut\xEDm na ceruzku akciu nakonfigurujete."}},subtitles:{idle_timeout:"\u010Cas v milisekund\xE1ch, k\xFDm karta prejde do re\u017Eimu ne\u010Dinnosti. Nastavte na 0 pre vypnutie.",show_chip_row:'"Auto" skryje riadok \u010Dipov, ak je nakonfigurovan\xE1 len jedna entita. "V menu" presunie \u010Dipy do ponuky menu. "V menu pri ne\u010Dinnosti" zobraz\xED \u010Dipy v riadku ke\u010F je akt\xEDvne, ale presunie ich do menu pri ne\u010Dinnosti.',dim_chips:"Ke\u010F karta prejde do re\u017Eimu ne\u010Dinnosti s obr\xE1zkom, stlmte \u010Dipy ent\xEDt a akci\xED pre \u010Distej\u0161\xED vzh\u013Ead.",hold_to_pin:"Dlh\xFDm stla\u010Den\xEDm \u010Dipov ent\xEDt ich pripnete, \u010D\xEDm zabr\xE1nite automatick\xE9mu prep\xEDnaniu po\u010Das prehr\xE1vania.",always_show_group:"Ovl\xE1dacie prvky r\xFDchleho zoskupovania (+/-/hviezdi\u010Dka) bud\xFA predvolene vidite\u013En\xE9 pri na\u010D\xEDtan\xED str\xE1nky. St\xE1le ich m\xF4\u017Eete manu\xE1lne prep\xEDna\u0165 dvojit\xFDm klepnut\xEDm.",disable_autofocus:"Zabr\xE1ni vyh\u013Ead\xE1vaciemu po\u013Eu prebra\u0165 zameranie, aby zostali kl\xE1vesnice na obrazovke skryt\xE9.",search_within_filter:"Povoli\u0165 vyh\u013Ead\xE1vanie v r\xE1mci aktu\xE1lneho akt\xEDvneho filtra (Ob\u013E\xFAben\xE9, Ned\xE1vno prehr\xE1van\xE9 at\u010F.) namiesto jeho vymazania.",close_search_on_play:"Automaticky zatvori\u0165 obrazovku vyh\u013Ead\xE1vania po spusten\xED skladby.",pin_search_headers:"Ponecha\u0165 pole vyh\u013Ead\xE1vania a filtre pevne navrchu po\u010Das pos\xFAvania v\xFDsledkov.",hide_search_headers_on_idle:"Skry\u0165 vyh\u013Ead\xE1vanie a filtre, ke\u010F je prehr\xE1va\u010D ne\u010Dinn\xFD.",disable_mass:"Deaktivova\u0165 volite\u013En\xFA integr\xE1ciu Mass Queue, aj ke\u010F je nain\u0161talovan\xE1.",swap_pause_stop:"Nahradi\u0165 tla\u010Didlo pauzy tla\u010Didlom zastavenia pri pou\u017Eit\xED modern\xE9ho rozlo\u017Eenia.",adaptive_controls:"Umo\u017Eni\u0165 tla\u010Didl\xE1m prehr\xE1vania meni\u0165 ve\u013Ekos\u0165 pod\u013Ea dostupn\xE9ho priestoru.",hide_menu_player:"Ke\u010F s\xFA \u010Dipy v menu, skry\u0165 n\xE1zov entity v spodnej \u010Dasti karty.",hide_reorder_progress:"Skry\u0165 pl\xE1vaj\xFAci indik\xE1tor priebehu preusporiadania frontu v spodnej \u010Dasti.",adaptive_text:"Vyberte skupiny textu, ktor\xE9 sa maj\xFA \u0161k\xE1lova\u0165 pod\u013Ea priestoru (nechajte pr\xE1zdne pre vypnutie).",collapse_expand:'"V\u017Edy zbalen\xE9" vytvor\xED re\u017Eim mini prehr\xE1va\u010Da. "Rozbali\u0165 pri h\u013Eadan\xED" kartu do\u010Dasne rozbal\xED pri vyh\u013Ead\xE1van\xED.',idle_screen:"Vyberte obrazovku, ktor\xE1 sa m\xE1 automaticky zobrazi\u0165 v re\u017Eime ne\u010Dinnosti.",hide_controls:"Vyberte ovl\xE1dacie prvky, ktor\xE9 chcete pre t\xFAto entitu skry\u0165 (\u0161tandardne s\xFA zobrazen\xE9 v\u0161etky).",hide_search_chips:"Skry\u0165 konkr\xE9tne \u010Dipy filtra vyh\u013Ead\xE1vania pre t\xFAto entitu.",hide_active_entity_on_idle:"Skryje \u0161t\xEDtok entity v dolnej \u010Dasti karty iba vtedy, ke\u010F je prehr\xE1va\u010D ne\u010Dinn\xFD.",follow_active_entity:"Ak je povolen\xE9, entita hlasitosti bude automaticky sledova\u0165 akt\xEDvny prehr\xE1va\u010D. Pozn\xE1mka: Toto prep\xED\u0161e vybran\xFA entitu hlasitosti.",search_limit_full:"Maxim\xE1lny po\u010Det v\xFDsledkov vyh\u013Ead\xE1vania (predvolen\xE9: 20).",default_search_filter_full:"Vyberte, ktor\xFD filter bude predvolene akt\xEDvny pri otvoren\xED vyh\u013Ead\xE1vania.",default_search_favorites:"Spusti\u0165 vyh\u013Ead\xE1vanie s akt\xEDvnymi ob\u013E\xFAben\xFDmi",result_sorting_full:"Vyberte sp\xF4sob zoradenia v\xFDsledkov. Predvolen\xE9 ponech\xE1va poradie zo zdroja.",card_height_full:"Nechajte pr\xE1zdne pre automatick\xFA v\xFD\u0161ku.",control_layout_full:"Vyberte si medzi star\u0161\xEDm (rovnako ve\u013Ek\xE9 prvky) alebo modern\xFDm rozlo\u017Een\xEDm Home Assistant.",artwork_extend:"Umo\u017Eni\u0165 pozadiu grafiky pokra\u010Dova\u0165 pod riadkami \u010Dipov a akci\xED.",artwork_extend_label:"Roz\u0161\xEDri\u0165 grafiku",no_artwork_overrides:"Nie s\xFA nastaven\xE9 \u017Eiadne prep\xEDsania grafiky. Pridajte ich pomocou tla\u010Didla plus.",missing_art_match:"Plat\xED, ke\u010F vybrat\xE9 m\xE9di\xE1 neposkytuj\xFA \u017Eiadny obr\xE1zok.",idle_image_match:"Plat\xED, ke\u010F je prehr\xE1va\u010D ne\u010Dinn\xFD a zobrazuje sa obr\xE1zok ne\u010Dinnosti.",entity_current_hint:"Pou\u017Eite 'entity_id: current' na zacielenie aktu\xE1lne vybranej entity na karte.",jinja_template_hint:"Zadajte Jinja \u0161abl\xF3nu, ktor\xE1 vr\xE1ti jedno entity_id. Pr\xEDklad prep\xEDnania MA na z\xE1klade v\xFDberu zdroja:",jinja_template_vol_hint:"Zadajte Jinja \u0161abl\xF3nu, ktor\xE1 vr\xE1ti entity_id (napr. media_player.obyvacka). Pr\xEDklad prep\xEDnania hlasitosti pod\u013Ea stavu:",not_available_alt_collapsed:"Nedostupn\xE9 s alternat\xEDvnym indik\xE1torom priebehu alebo v re\u017Eime V\u017Edy zbalen\xE9.",not_available_collapsed:"Nedostupn\xE9, ke\u010F je zapnut\xE9 V\u017Edy zbalen\xE9.",only_available_collapsed:"Dostupn\xE9 len pri zapnutom re\u017Eime V\u017Edy zbalen\xE9.",only_available_modern:"Dostupn\xE9 len s modern\xFDm rozlo\u017Een\xEDm.",image_url_helper:"Zadajte priamu URL na obr\xE1zok alebo lok\xE1lnu cestu k s\xFAboru",selected_entity_helper:"Pomocn\xEDk pre vstupn\xFD text, ktor\xFD bude aktualizovan\xFD o ID aktu\xE1lne vybranej entity prehr\xE1va\u010Da m\xE9di\xED.",select_entity_helper:"Pomocn\xEDk pre vstupn\xFD text, z ktor\xE9ho sa \u010D\xEDta ID entity. Karta automaticky vyberie zodpovedaj\xFAci \u010Dip.",sync_entity_type:"Vyberte, ktor\xE9 ID entity sa m\xE1 synchronizova\u0165 s pomocn\xEDkom (predvolene entita Music Assistant, ak je nakonfigurovan\xE1).",disable_auto_select:"Zabr\xE1ni automatick\xE9mu v\xFDberu \u010Dipu tejto entity pri spusten\xED prehr\xE1vania.",search_view:"Vyberte si medzi \u0161tandardn\xFDm zoznamom alebo mrie\u017Ekou kariet pre v\xFDsledky vyh\u013Ead\xE1vania.",search_card_columns:"Zadajte, ko\u013Eko st\u013Apcov sa m\xE1 pou\u017Ei\u0165 v zobrazen\xED karty. Grafika sa automaticky prisp\xF4sob\xED.",card_type:"Vyberte re\u017Eim karty. 'Predvolen\xE9' je \u0161tandardn\xFD prehr\xE1va\u010D m\xE9di\xED. 'Vyhraden\xE9 vyh\u013Ead\xE1vanie' urob\xED z karty trval\xE9 rozhranie na vyh\u013Ead\xE1vanie.",always_show_lyrics:"Automaticky otvori\u0165 zobrazenie textov piesn\xED pri obnoven\xED str\xE1nky.",lyrics_source:"Music Assistant vy\u017Eaduje integr\xE1ciu mass_queue na na\u010D\xEDtanie textov z jeho intern\xE9ho metad\xE1tov\xE9ho modulu.",lyrics_pre_roll:"Posunutie na\u010Dasovania zv\xFDraznenia textu piesne. Kladn\xE9 hodnoty ho zr\xFDch\u013Euj\xFA, z\xE1porn\xE9 spoma\u013Euj\xFA (predvolen\xE9: 0).",blurred_artwork:"V\u017Edy rozmaza\u0165 obr\xE1zok na pozad\xED",hide_collapsed_artwork:"Skry\u0165 mal\xFD obr\xE1zok vpravo, ke\u010F je karta zbalen\xE1",show_idle_artwork_when_not_playing:"Ke\u010F je t\xE1to mo\u017Enos\u0165 povolen\xE1, pri v\xFDbere \u010Dipu, na ktorom sa moment\xE1lne ni\u010D neprehr\xE1va, sa namiesto akt\xEDvnej grafiky prehr\xE1vania zobraz\xED nakonfigurovan\xFD obr\xE1zok pri ne\u010Dinnosti.",prefer_ma_metadata:"V\u017Edy pou\u017E\xEDvajte sp\xE1rovan\xFA entitu Music Assistant pre n\xE1zov skladby, interpreta a grafiku, aj ke\u010F sa prehr\xE1va prim\xE1rna entita.",show_volume_overlay:"Pri zmene \xFArovne hlasitosti nakr\xE1tko zobraz\xED ve\u013Ek\xFD ukazovate\u013E hlasitosti cez grafiku albumu.",queue_controls_style:"Vyberte, \u010Di sa m\xE1 pre polo\u017Eky fronty zobrazi\u0165 \xFAchyt na \u0165ahanie alebo jednotliv\xE9 tla\u010Didl\xE1 pohybu."},titles:{edit_entity:"Upravi\u0165 entitu",edit_action:"Upravi\u0165 akciu",service_data:"Servisn\xE9 \xFAdaje",add_artwork_override:"Prida\u0165 prep\xEDsanie grafiky"},labels:{toggle_template_mode:"Prepn\xFA\u0165 re\u017Eim \u0161abl\xF3ny",dim_chips:"Stlmi\u0165 \u010Dipy pri ne\u010Dinnosti",hold_to_pin:"Podr\u017Ea\u0165 pre pripnutie",always_show_group:"R\xFDchle zoskupovanie ako predvolen\xE9",disable_autofocus:"Vypn\xFA\u0165 automatick\xE9 zameranie h\u013Eadania",keep_filters:"Zachova\u0165 filtre pri h\u013Eadan\xED",dismiss_on_play:"Zavrie\u0165 h\u013Eadanie po spusten\xED",pin_headers:"Pripn\xFA\u0165 hlavi\u010Dky h\u013Eadania",hide_search_headers_on_idle:"Skry\u0165 hlavi\u010Dky pri ne\u010Dinnosti",default_search_filter:"Predvolen\xFD filter vyh\u013Ead\xE1vania",default_search_favorites:"Predvolen\xFD filter ob\u013E\xFAben\xFDch",disable_mass:"Deaktivova\u0165 Mass Queue",match_theme:"Pod\u013Ea t\xE9my",alt_progress:"Alternat\xEDvny indik\xE1tor priebehu",progress_bar_height:"V\xFD\u0161ka indik\xE1tora priebehu",display_timestamps:"Zobrazi\u0165 \u010Dasov\xE9 \xFAdaje",swap_pause_stop:"Vymeni\u0165 pauzu za stop",adaptive_controls:"Adapt\xEDvna ve\u013Ekos\u0165 ovl\xE1dania",hide_active_entity:"Skry\u0165 \u0161t\xEDtok akt\xEDvnej entity",hide_active_entity_on_idle:"Skry\u0165 \u0161t\xEDtok akt\xEDvnej entity pri ne\u010Dinnosti",collapse_on_idle:"Zbali\u0165 pri ne\u010Dinnosti",hide_menu_player_toggle:"Skry\u0165 prehr\xE1va\u010D v menu",hide_reorder_progress_toggle:"Skry\u0165 priebeh preusporiadania",always_collapsed:"V\u017Edy zbalen\xE9",expand_on_search:"Rozbali\u0165 pri h\u013Eadan\xED",script_var:"Premenn\xE1 skriptu (yamp_entity)",use_ma_template:"Pou\u017Ei\u0165 \u0161abl\xF3nu pre Music Assistant",use_vol_template:"Pou\u017Ei\u0165 \u0161abl\xF3nu pre entitu hlasitosti",follow_active_entity:"Hlasitos\u0165 sleduje akt\xEDvnu entitu",use_url_path:"Pou\u017Ei\u0165 URL alebo cestu",adaptive_text_elements:"Prvky s adapt\xEDvnou ve\u013Ekos\u0165ou textu",disable_auto_select:"Zak\xE1za\u0165 automatick\xFD v\xFDber",always_show_lyrics:"V\u017Edy zobrazi\u0165 texty piesn\xED",lyrics_mode:"Re\u017Eim textov piesn\xED",lyrics_source:"Zdroj textov",lyrics_pre_roll:"Pre-roll textu piesne (sekundy)",blurred_artwork:"Rozmazan\xFD obr\xE1zok",hide_collapsed_artwork:"Skry\u0165 zmen\u0161en\xFD obr\xE1zok",show_idle_artwork_when_not_playing:"Zobrazi\u0165 obr\xE1zok ne\u010Dinnosti, ke\u010F sa neprehr\xE1va",prefer_ma_metadata:"Uprednostni\u0165 metad\xE1ta z Music Assistant",show_volume_overlay:"Zobrazi\u0165 prekrytie hlasitosti"},fields:{artwork_fit:"Prisp\xF4sobenie grafiky",artwork_position:"Poz\xEDcia grafiky",artwork_hostname:"Hostname pre grafiku",match_field:"Pole pre zhodu",match_value:"Hodnota pre zhodu",size_percent:"Ve\u013Ekos\u0165 (%)",object_fit:"Prisp\xF4sobenie objektu (Fit)",idle_timeout:"\u010Cas ne\u010Dinnosti (ms)",show_chip_row:"Zobrazi\u0165 riadok \u010Dipov",search_limit:"Limit v\xFDsledkov h\u013Eadania",result_sorting:"Zoradenie v\xFDsledkov",vol_step:"Krok hlasitosti (0.05 = 5%)",card_height:"V\xFD\u0161ka karty (px)",control_layout:"Rozlo\u017Eenie ovl\xE1dania",idle_image:"Obr\xE1zok ne\u010Dinnosti",image_url:"URL obr\xE1zka",fallback_image_url:"Z\xE1lo\u017En\xE1 URL obr\xE1zka",move_to_main:"Presun\xFA\u0165 do hlavn\xFDch \u010Dipov",move_to_menu:"Presun\xFA\u0165 do menu",delete_action:"Vymaza\u0165 akciu",volume_mode:"Re\u017Eim hlasitosti",idle_screen:"Obrazovka pri ne\u010Dinnosti",name:"N\xE1zov",hidden_controls:"Skryt\xE9 ovl\xE1dacie prvky",hide_remote_buttons:"Skryt\xE9 tla\u010Didl\xE1 dia\u013Ekov\xE9ho ovl\xE1dania",ma_template:"Jinja \u0161abl\xF3na pre Music Assistant",hidden_chips:"Skryt\xE9 \u010Dipy filtrov h\u013Eadania",vol_template:"Jinja \u0161abl\xF3na pre hlasitos\u0165",icon:"Ikona",action_type:"Typ akcie",menu_item:"Polo\u017Eka menu",nav_path:"Cesta navig\xE1cie",service:"Slu\u017Eba",service_data:"Servisn\xE9 \xFAdaje",idle_image_entity:"Entita obr\xE1zka pri ne\u010Dinnosti",match_entity:"Entita pre zhodu",ma_entity:"Entita Music Assistant",vol_entity:"Entita hlasitosti",selected_entity_helper:"Pomocn\xEDk vybratej entity",sync_entity_type:"Typ entity na synchroniz\xE1ciu",placement:"Umiestnenie",card_trigger:"Sp\xFA\u0161\u0165a\u010D karty",search_view:"Zobrazenie v\xFDsledkov vyh\u013Ead\xE1vania",search_card_columns:"St\u013Apce karty",card_type:"Typ karty",appearance:"Vzh\u013Ead",no_artwork_option:"\u017Diadny obr\xE1zok",details_alignment:"Zarovnanie detailov",queue_controls_style:"\u0160t\xFDl ovl\xE1dac\xEDch prvkov fronty"},action_types:{menu:"Otvori\u0165 polo\u017Eku menu karty",service:"Zavola\u0165 slu\u017Ebu",navigate:"Navigova\u0165",prev_entity:"Predo\u0161l\xFD \u010Dip entity",next_entity:"\u010Eal\u0161\xED \u010Dip entity",sync_selected_entity:"Synchronizova\u0165 vybran\xFA entitu",select_entity:"Vybra\u0165 entitu z pomocn\xEDka",toggle_lyrics:"Prepn\xFA\u0165 prekrytie textov piesn\xED",remote_control:"Otvori\u0165 prekr\xFDvanie dia\u013Ekov\xE9ho ovl\xE1dania"},action_helpers:{sync_selected_entity:"Synchronizova\u0165 vybran\xFA entitu \u2192",select_entity:"Vybra\u0165 entitu \u2190",select_helper:"(vybra\u0165 pomocn\xEDka)"},sync_entity_options:{yamp_entity:"yamp_entity (Entita Music Assistant, ak je nakonfigurovan\xE1)",yamp_main_entity:"yamp_main_entity (Hlavn\xE1 entita prehr\xE1va\u010Da m\xE9di\xED)",yamp_playback_entity:"yamp_playback_entity (Aktu\xE1lna akt\xEDvna entita prehr\xE1vania)"},placements:{chip:"Ak\u010Dn\xFD \u010Dip",menu:"V menu",hidden:"Skryt\xE9 (\u0164uknutie na grafiku)",not_triggerable:"Nespustite\u013En\xE9"},triggers:{none:"\u017Diadny",tap:"\u0164uknutie",hold:"Podr\u017Eanie",double_tap:"Dvojit\xE9 \u0165uknutie",swipe_left:"Potiahnutie do\u013Eava",swipe_right:"Potiahnutie doprava"},search_view_options:{list:"Zoznam",card:"Karta",card_minimal:"Minim\xE1lna karta"},queue_controls_style_options:{drag_handle:"\xDAchyt na \u0165ahanie",icons:"Tla\u010Didl\xE1 pohybu"},card_type_options:{default:"Predvolen\xE9",search:"H\u013Eada\u0165",group_players:"Zoskupi\u0165 prehr\xE1va\u010De",up_next:"Nasleduje",remote_control:"Dia\u013Ekov\xE9 ovl\xE1danie"},appearance_options:{automatic:"Automaticky",light:"Svetl\xFD",dark:"Tmav\xFD"},artwork_fit:{default:"Glob\xE1lne",cover:"Obal (predvolen\xE9)",contain:"Prisp\xF4sobi\u0165",fill:"Vyplni\u0165","scale-down":"Zmen\u0161i\u0165","scaled-contain":"\u0160k\xE1lovan\xE9 prisp\xF4sobenie","scaled-contain-alternate":"\u0160k\xE1lovan\xE9 prisp\xF4sobenie alternat\xEDvne",none:"\u017Diadne"},artwork_position:{default:"Glob\xE1lne",top:"Hore",center:"Stred",bottom:"Dole"}},card:{sections:{details:"Detaily prehr\xE1vania",menu:"Menu a vyh\u013Ead\xE1vanie",action_chips:"Ak\u010Dn\xE9 \u010Dipy"},media_controls:{shuffle:"N\xE1hodne",previous:"Predch\xE1dzaj\xFAce",play_pause:"Prehra\u0165/Pozastavi\u0165",stop:"Zastavi\u0165",next:"Nasleduj\xFAce",repeat:"Opakova\u0165"},menu:{more_info:"Viac inform\xE1ci\xED",search:"H\u013Eada\u0165",source:"Zdroj",remote_controls:"Dia\u013Ekov\xE9 ovl\xE1danie",show_lyrics:"Zobrazi\u0165 text piesne",hide_lyrics:"Skry\u0165 text piesne",transfer_queue:"Presun\xFA\u0165 frontu",main_menu:"Hlavn\xE9 menu",group_players:"Zoskupi\u0165 prehr\xE1va\u010De",up_next:"Nasleduje",remote_control:"Dia\u013Ekov\xE9 ovl\xE1danie",select_entity:"Vyberte entitu pre viac info",transfer_to:"Presun\xFA\u0165 frontu do",no_players:"\u017Diadne in\xE9 prehr\xE1va\u010De Music Assistant nie s\xFA k dispoz\xEDcii."},remote:{title:"Dia\u013Ekov\xE9 ovl\xE1danie",up:"Hore",down:"Dole",left:"Do\u013Eava",right:"Doprava",select:"Vybra\u0165",back:"Sp\xE4\u0165",menu:"Menu",home:"Domov",power:"Nap\xE1janie"},grouping:{title:"Zoskupi\u0165 prehr\xE1va\u010De",sync_volume:"Synchronizova\u0165 hlasitos\u0165",group_all:"Zoskupi\u0165 v\u0161etko",ungroup_all:"Zru\u0161i\u0165 zoskupenie v\u0161etk\xE9ho",unavailable:"Prehr\xE1va\u010D je nedostupn\xFD",no_players:"\u017Diadne in\xE9 prehr\xE1va\u010De schopn\xE9 zoskupenia nie s\xFA k dispoz\xEDcii.",master:"Hlavn\xFD (Master)",joined:"Pripojen\xFD",available:"Dostupn\xFD",current:"Aktu\xE1lny",unjoin_from:"Odpoji\u0165 od {master}",join_with:"Pripoji\u0165 k {master}"}},search:{favorites:"Ob\u013E\xFAben\xE9",recently_played:"Ned\xE1vno prehr\xE1van\xE9",next_up:"Nasleduj\xFAce",recommendations:"Odpor\xFA\u010Dania",radio_mode:"Re\u017Eim r\xE1dio",show_track_options:"Zobrazi\u0165 mo\u017Enosti skladby",play_similar:"Prehra\u0165 podobn\xE9 skladby",close:"Zatvori\u0165 vyh\u013Ead\xE1vanie",no_results:"\u017Diadne v\xFDsledky.",play_next:"Prehra\u0165 ako nasleduj\xFAce",replace_play:"Nahradi\u0165 frontu a prehra\u0165 teraz",replace:"Nahradi\u0165 frontu",add_queue:"Prida\u0165 na koniec fronty",move_up:"Posun\xFA\u0165 nahor",move_down:"Posun\xFA\u0165 nadol",move_next:"Presun\xFA\u0165 na nasleduj\xFAce",remove:"Odstr\xE1ni\u0165 z fronty",drag_to_reorder:"Potiahnite pre zmenu poradia",added:"Pridan\xE9 do fronty!",added_to_playlist:"Pridan\xE9 do playlistu!",select_playlist:"Vybra\u0165 playlist pre '{track}'",add_to_playlist:"Prida\u0165 do playlistu",select_track_for_playlist:"Vybra\u0165 skladbu na pridanie pre '{track}' od {artist}",labels:{replace:"Nahradi\u0165",next:"Nasleduj\xFAce",replace_next:"Nahradi\u0165 nasleduj\xFAce",add:"Prida\u0165",add_to_playlist:"Prida\u0165 do playlistu"},results:"v\xFDsledkov",result:"v\xFDsledok",filters:{all:"V\u0161etko",artist:"Interpret",album:"Album",track:"Skladba",playlist:"Playlist",radio:"R\xE1dio",music:"Hudba",station:"Stanica",podcast:"Podcast",audiobook:"Audiokniha"},search_artist:"H\u013Eada\u0165 tohto interpreta",browse_album:"Preh\u013Ead\xE1va\u0165 skladby z {album}",play_collection:"Prehra\u0165 t\xFAto kolekciu",play_collection_error:"T\xFAto kolekciu nie je mo\u017En\xE9 prehra\u0165 priamo",play_item:"Prehra\u0165 {item}"},lyrics:{finding:"H\u013Eadanie textu piesne...",none_found:"\u017Diadny text piesne sa nena\u0161iel",not_available:"Text piesne nie je k dispoz\xEDcii",instrumental:"In\u0161trument\xE1lna skladba"},lyrics_sources:{mass_lrclib:"Music Assistant (Z\xE1loha na LRCLIB)",mass:"Len Music Assistant",lrclib:"Len LRCLIB",lrclib_mass:"LRCLIB (Z\xE1loha na Music Assistant)"},lyrics_modes:{default:"Predvolen\xE9 (Zv\xFDrazni\u0165 a pos\xFAva\u0165)",scroll:"Len pos\xFAva\u0165",text:"Len text"}},xc={common:{not_found:"Entiteta ni najdena.",search:"I\u0161\u010Di",power:"Napajanje",favorite:"Priljubljeno",loading:"Nalaganje...",no_results:"Ni rezultatov.",close:"Zapri",vol_up:"Pove\u010Daj glasnost",vol_down:"Zmanj\u0161aj glasnost",media_player:"Predvajalnik predstavnosti",edit_entity:"Uredi nastavitve entitete",edit_action:"Uredi nastavitve dejanja",mute:"Uti\u0161aj",unmute:"Vklopi zvok",seek:"Previj",volume:"Glasnost",play_now:"Predvajaj zdaj",more_options:"Ve\u010D mo\u017Enosti",unavailable:"Ni na voljo",back:"Nazaj",cancel:"Prekli\u010Di",reset_default:"Ponastavi na privzeto",unpin:"Odpni",clear:"Po\u010Disti",album_art:"Naslovnica albuma"},editor:{tabs:{entities:"Entitete",behavior:"Vedenje",look_and_feel:"Videz in ob\u010Dutek",artwork:"Grafika",actions:"Dejanja"},search_placeholder:"Iskanje mo\u017Enosti konfiguracije...",placeholders:{search:"I\u0161\u010Di glasbo..."},templates:{minimal_mini:{label:"MINImal",description:"Kompaktna kartica brez naslovnice."},normal_mini:{label:"Mini Mode",description:"Standardna kompaktna kartica."}},sections:{artwork:{general:{title:"Splo\u0161ne nastavitve",description:"Globalni nadzor nad prikazom in pridobivanjem grafike."},idle:{title:"Grafika v mirovanju",description:"Prika\u017Ei stati\u010Dno sliko ali posnetek entitete, ko se ni\u010D ne predvaja."},overrides:{title:"Prepis grafike",description:"Prepisi se ocenjujejo od zgoraj navzdol. Povlecite za spremembo vrstnega reda."}},entities:{title:"Entitete*",description:"Dodajte predvajalnike, ki jih \u017Eelite upravljati. Povlecite entitete za spremembo vrstnega reda."},behavior:{idle_chips:{title:"Mirovanje in \u010Dipi",description:"Izberite, kdaj kartica preide v mirovanje in kako se obna\u0161ajo \u010Dipi entitet."},interactions_search:{title:"Interakcije in iskanje",description:"Nastavite pripenjanje entitet in \u0161tevilo prikazanih rezultatov."},lyrics:{title:"Besedila",description:"Konfigurirajte, kako so besedila prikazana in kdaj se pojavijo."}},look_and_feel:{theme_layout:{title:"Tema in postavitev",description:"Ujemanje s slogom nadzorne plo\u0161\u010De in nadzor velikosti."},controls_typography:{title:"Kontrolniki in tipografija",description:"Prilagodite velikost gumbov, oznake entitet in prilagodljivo besedilo."},collapsed_idle:{title:"Strnjeno in mirovanje",description:"Nadzorujte, kdaj se kartica skr\u010Di in kaj se prika\u017Ee v mirovanju."}},actions:{title:"Dejanja",description:"Ustvarite \u010Dipe dejanj, ki se prika\u017Eejo na kartici ali v meniju."}},subtitles:{idle_timeout:"\u010Cas v milisekundah, preden kartica preide v mirovanje. Nastavite na 0 za izklop.",show_chip_row:'"Samodejno" skrije \u010Dipe, \u010De je nastavljena ena entiteta. "V meniju" jih premakne v meni. "V meniju med nedejavnostjo" prika\u017Ee \u010Dipe v vrstici, ko je aktivna, a jih premakne v meni med nedejavnostjo.',dim_chips:"Ko kartica preide v mirovanje s sliko, se \u010Dipi zatemnijo.",hold_to_pin:"Dolgi pritisk za pripenjanje entitet namesto kratkega.",always_show_group:"Kontrolni elementi za hitro zdru\u017Eevanje (+/-/zvezda) bodo privzeto vidni ob nalaganju strani. \u0160e vedno jih lahko ro\u010Dno preklopite z dvojnim tapom.",disable_autofocus:"Prepre\u010Di samodejni fokus iskalnega polja.",search_within_filter:"I\u0161\u010Di znotraj trenutnega filtra.",close_search_on_play:"Samodejno zapri iskanje ob predvajanju.",pin_search_headers:"Pripni iskalno polje in filtre na vrh.",hide_search_headers_on_idle:"Skrij iskalno polje in filtre med mirovanjem.",disable_mass:"Onemogo\u010Di integracijo Mass Queue.",swap_pause_stop:"Zamenjaj gumb pavze z gumbom zaustavitve med uporabo moderne postavitve.",adaptive_controls:"Prilagodi velikost gumbov glede na prostor.",hide_menu_player:"Skrij oznako entitete v meniju.",hide_reorder_progress:"Skrij lebde\u010Di indikator napredka prerazvr\u0161\u010Danja \u010Dakalne vrste na dnu.",adaptive_text:"Izberi skupine besedila za prilagajanje velikosti.",collapse_expand:"Vedno skr\u010Deno ustvari mini predvajalnik.",idle_screen:"Izberi zaslon, prikazan v mirovanju.",hide_controls:"Izberi kontrolnike za skrivanje.",hide_remote_buttons:"Izberite gumbe za skrivanje na daljinskem upravljalniku.",hide_search_chips:"Skrij dolo\u010Dene iskalne filtre.",hide_active_entity_on_idle:"Skrije oznako entitete na dnu kartice le, ko je predvajalnik v stanju mirovanja.",follow_active_entity:"Entiteta glasnosti sledi aktivni entiteti. Opomba: To prepi\u0161e izbrano entiteto za glasnost.",search_limit_full:"Najve\u010Dje \u0161tevilo rezultatov (privzeto: 20).",default_search_filter_full:"Izberite, kateri filter je privzeto aktiven ob odprtju iskanja.",default_search_favorites:"Za\u010Dni iskanje z aktivnimi priljubljenimi",result_sorting_full:"Izberi razvr\u0161\u010Danje rezultatov.",card_height_full:"Pustite prazno za samodejno vi\u0161ino.",control_layout_full:"Izberi med staro in moderno postavitvijo.",artwork_extend:"Raz\u0161iri ozadje grafike pod \u010Dipe.",artwork_extend_label:"Raz\u0161iri grafiko",no_artwork_overrides:"Ni nastavljenih prepisov grafike.",missing_art_match:"Velja, ko izbrana vsebina nima slike.",idle_image_match:"Velja, ko predvajalnik miruje in se prikazuje slika v mirovanju.",entity_current_hint:"Uporabi entity_id: current za trenutno izbrano entiteto.",jinja_template_hint:"Vnesite Jinja predlogo, ki vrne en entity_id.",jinja_template_vol_hint:"Vnesite Jinja predlogo za entiteto glasnosti.",not_available_alt_collapsed:"Ni na voljo z alternativno vrstico napredka.",not_available_collapsed:"Ni na voljo v vedno skr\u010Denem na\u010Dinu.",only_available_collapsed:"Na voljo le v vedno skr\u010Denem na\u010Dinu.",only_available_modern:"Na voljo le v moderni postavitvi.",image_url_helper:"Vnesite neposredni URL do slike ali lokalno pot do datoteke",selected_entity_helper:"Pomo\u010Dnik za vnos besedila, ki bo posodobljen z ID-jem trenutno izbranega predvajalnika medijev.",select_entity_helper:"Pomo\u010Dnik za vnos besedila, iz katerega se bere ID entitete. Kartica bo samodejno izbrala ustrezni \u010Dip.",sync_entity_type:"Izberite, kateri ID entitete \u017Eelite sinhronizirati s pomo\u010Dnikom (privzeto entiteto Music Assistant, \u010De je nastavljena).",disable_auto_select:"Prepre\u010Di samodejno izbiro \u010Dipa te entitete ob za\u010Detku predvajanja.",search_view:"Izberite med standardnim seznamom ali mre\u017Eo kartic za rezultate iskanja.",search_card_columns:"Dolo\u010Dite \u0161tevilo stolpcev v pogledu kartic. Grafika se bo samodejno prilagodila.",card_type:"Izberite na\u010Din kartice. 'Privzeto' je standardni medijski predvajalnik. 'Namensko iskanje' spremeni kartico v trajen iskalni vmesnik.",always_show_lyrics:"Samodejno odprite pogled besedila, ko se stran osve\u017Ei.",lyrics_source:"Music Assistant zahteva integracijo mass_queue za pridobivanje besedil iz svojega notranjega mehanizma metapodatkov.",lyrics_pre_roll:"Zamaknite \u010Dasovno uskladitev ozna\u010Devanja besedila. Pozitivne vrednosti ga pospe\u0161ijo, negativne pa upo\u010Dasnijo (privzeto: 0).",blurred_artwork:"Vedno zamegli ozadje",hide_collapsed_artwork:"Skrij majhno sliko na desni, ko je kartica strnjena",show_idle_artwork_when_not_playing:"Ko je to omogo\u010Deno, se ob izbiri \u010Dipa, na katerem se trenutno ni\u010D ne predvaja, prika\u017Ee nastavljena slika za nedejavnost namesto aktivne grafike predvajanja.",prefer_ma_metadata:"Za naslov skladbe, izvajalca in grafiko vedno uporabi seznanjeno entiteto Music Assistant, tudi \u010De se predvaja primarna entiteta.",show_volume_overlay:"Ob spremembi glasnosti za kratek \u010Das prika\u017Ee velik indikator glasnosti \u010Dez naslovnico.",queue_controls_style:"Izberite, ali \u017Eelite prikazati ro\u010Daj za vle\u010Denje ali posamezne gumbe za premikanje elementov \u010Dakalne vrste."},titles:{edit_entity:"Uredi entiteto",edit_action:"Uredi dejanje",service_data:"Podatki storitve",add_artwork_override:"Dodaj prepis grafike"},labels:{toggle_template_mode:"Preklopi na\u010Din predloge",dim_chips:"Zatemni \u010Dipe v mirovanju",hold_to_pin:"Dr\u017Ei za pripenjanje",always_show_group:"Hitro zdru\u017Eevanje kot privzeto",disable_autofocus:"Onemogo\u010Di samodejni fokus",keep_filters:"Ohrani filtre",dismiss_on_play:"Zapri iskanje ob predvajanju",pin_headers:"Pripni glave iskanja",hide_search_headers_on_idle:"Skrij glave iskanja med mirovanjem",default_search_filter:"Privzeti iskalni filter",default_search_favorites:"Privzeti filter priljubljenih",disable_mass:"Onemogo\u010Di Mass Queue",match_theme:"Ujemaj temo",alt_progress:"Alternativna vrstica napredka",progress_bar_height:"Vi\u0161ina vrstice napredka",display_timestamps:"Prika\u017Ei \u010Dasovne oznake",swap_pause_stop:"Zamenjaj pavzo z zaustavitvijo",adaptive_controls:"Prilagodljiva velikost gumbov",hide_active_entity:"Skrij oznako aktivne entitete",hide_active_entity_on_idle:"Skrij oznako aktivne entitete ob mirovanju",collapse_on_idle:"Skr\u010Di v mirovanju",hide_menu_player_toggle:"Skrij predvajalnik v meniju",hide_reorder_progress_toggle:"Skrij napredek prerazvr\u0161\u010Danja",always_collapsed:"Vedno skr\u010Deno",expand_on_search:"Raz\u0161iri ob iskanju",script_var:"Skriptna spremenljivka",use_ma_template:"Uporabi predlogo za entiteto Music Assistant",use_vol_template:"Uporabi predlogo za glasnost",follow_active_entity:"Glasnost sledi aktivni entiteti",use_url_path:"Uporabi URL ali pot",adaptive_text_elements:"Elementi za prilagajanje velikosti besedila",disable_auto_select:"Onemogo\u010Di samodejno izbiro",always_show_lyrics:"Vedno prika\u017Ei besedilo",lyrics_mode:"Na\u010Din besedila",lyrics_source:"Vir besedil",lyrics_pre_roll:"Pre-roll besedila (sekunde)",blurred_artwork:"Zamegljena grafika",hide_collapsed_artwork:"Skrij skr\u010Deno grafika",show_idle_artwork_when_not_playing:"Prika\u017Ei sliko za nedejavnost, ko se ne predvaja",prefer_ma_metadata:"Prednost metapodatkom Music Assistant",show_volume_overlay:"Prika\u017Ei prekrivno plo\u0161\u010Do za glasnost"},fields:{artwork_fit:"Prileganje grafike",artwork_position:"Polo\u017Eaj grafike",artwork_hostname:"Ime gostitelja grafike",match_field:"Polje ujemanja",match_value:"Vrednost ujemanja",size_percent:"Velikost (%)",object_fit:"Prileganje objekta",idle_timeout:"\u010Cas mirovanja (ms)",show_chip_row:"Prika\u017Ei vrstico \u010Dipov",search_limit:"Omejitev rezultatov iskanja",result_sorting:"Razvr\u0161\u010Danje rezultatov",vol_step:"Korak glasnosti (0.05 = 5 %)",card_height:"Vi\u0161ina kartice (px)",control_layout:"Postavitev kontrolnikov",idle_image:"Slika v mirovanju",image_url:"URL slike",fallback_image_url:"Rezervni URL slike",move_to_main:"Premakni dejanje na glavno vrstico",move_to_menu:"Premakni dejanje v meni",delete_action:"Izbri\u0161i dejanje",volume_mode:"Na\u010Din glasnosti",idle_screen:"Zaslon v mirovanju",name:"Ime",hidden_controls:"Skriti kontrolniki",hide_remote_buttons:"Skriti gumbi daljinskega upravljalnika",ma_template:"Predloga Music Assistant (Jinja)",hidden_chips:"Skriti iskalni \u010Dipi",vol_template:"Predloga entitete glasnosti (Jinja)",icon:"Ikona",action_type:"Vrsta dejanja",menu_item:"Element menija",nav_path:"Navigacijska pot",service:"Storitev",service_data:"Podatki storitve",idle_image_entity:"Entiteta slike v mirovanju",match_entity:"Ujemajo\u010Da entiteta",ma_entity:"Entiteta Music Assistant",vol_entity:"Entiteta glasnosti",selected_entity_helper:"Pomo\u010Dnik izbrane entitete",sync_entity_type:"Vrsta entitete za sinhronizacijo",placement:"Namestitev",card_trigger:"Spro\u017Eilec kartice",search_view:"Pogled rezultatov iskanja",search_card_columns:"Stolpci kartic",card_type:"Vrsta kartice",appearance:"Videz",no_artwork_option:"Brez grafike",details_alignment:"Poravnava podrobnosti",queue_controls_style:"Slog kontrol \u010Dakalne vrste"},action_types:{menu:"Odpri element menija kartice",service:"Pokli\u010Di storitev",navigate:"Navigiraj",prev_entity:"Prej\u0161nji \u010Dip entitete",next_entity:"Naslednji \u010Dip entitete",sync_selected_entity:"Sinhroniziraj izbrano entiteto",select_entity:"Izberi entiteto iz pomo\u010Dnika",toggle_lyrics:"Preklopi prekrivanje besedila",remote_control:"Odpri prekrivanje daljinskega upravljalnika"},action_helpers:{sync_selected_entity:"Sinhroniziraj izbrano entiteto \u2192",select_entity:"Izberi entiteto \u2190",select_helper:"(izberite pomo\u010Dnika)"},sync_entity_options:{yamp_entity:"yamp_entity (entiteta Music Assistant, \u010De je nastavljena)",yamp_main_entity:"yamp_main_entity (glavna entiteta predvajalnika medijev)",yamp_playback_entity:"yamp_playback_entity (trenutno aktivna entitea predvajanja)"},placements:{chip:"\u010Cip dejanja",menu:"V meniju",hidden:"Skrito (dotik grafike)",not_triggerable:"Ni mogo\u010De spro\u017Eiti"},triggers:{none:"Brez",tap:"Dotik",hold:"Pridr\u017Eanje",double_tap:"Dvojni dotik",swipe_left:"Podrsaj levo",swipe_right:"Podrsaj desno"},search_view_options:{list:"Seznam",card:"Kartica",card_minimal:"Minimalna kartica"},queue_controls_style_options:{drag_handle:"Ro\u010Daj za vle\u010Denje",icons:"Gumbi za premikanje"},card_type_options:{default:"Privzeto",search:"Iskanje",group_players:"Zoskupi predvajalnike",up_next:"Sledi",remote_control:"Daljinski upravljalnik"},appearance_options:{automatic:"Samodejno",light:"Svetlo",dark:"Temno"},artwork_fit:{default:"Globalno",cover:"Ovitek (privzeto)",contain:"Prilagodi",fill:"Zapolni","scale-down":"Pomanj\u0161aj","scaled-contain":"Pomanj\u0161ano prilagodi","scaled-contain-alternate":"Pomanj\u0161ano prilagodi alternativno",none:"Brez"},artwork_position:{default:"Globalno",top:"Zgoraj",center:"Sredina",bottom:"Spodaj"}},card:{sections:{details:"Podrobnosti predvajanja",menu:"Meni in iskanje",action_chips:"\u010Cipi dejanj"},media_controls:{shuffle:"Naklju\u010Dno",previous:"Prej\u0161nje",play_pause:"Predvajaj/Pavza",stop:"Ustavi",next:"Naslednje",repeat:"Ponovi"},menu:{more_info:"Ve\u010D informacij",search:"I\u0161\u010Di",source:"Vir",remote_controls:"Daljinski upravljalnik",show_lyrics:"Poka\u017Ei besedilo",hide_lyrics:"Skrij besedilo",transfer_queue:"Prenesi \u010Dakalno vrsto",main_menu:"Glavni meni",group_players:"Zdru\u017Ei predvajalnike",up_next:"Sledi",remote_control:"Daljinski upravljalnik",select_entity:"Izberi entiteto za ve\u010D informacij",transfer_to:"Prenesi \u010Dakalno vrsto na",no_players:"Ni drugih razpolo\u017Eljivih predvajalnikov Music Assistant."},remote:{title:"Daljinski upravljalnik",up:"Gor",down:"Dol",left:"Levo",right:"Desno",select:"Izberi",back:"Nazaj",menu:"Meni",home:"Domov",power:"Vklop/Izklop"},grouping:{title:"Zdru\u017Ei predvajalnike",sync_volume:"Sinhroniziraj glasnost",group_all:"Zdru\u017Ei vse",ungroup_all:"Razdru\u017Ei vse",unavailable:"Predvajalnik ni na voljo",no_players:"Ni drugih predvajalnikov za zdru\u017Eevanje.",master:"Glavni",joined:"Pridru\u017Een",available:"Na voljo",current:"Trenutni",unjoin_from:"Odslopi od {master}",join_with:"Pridru\u017Ei se {master}"}},search:{favorites:"Priljubljeni",recently_played:"Nedavno predvajano",next_up:"Naslednje",recommendations:"Priporo\u010Dila",radio_mode:"Radijski na\u010Din",show_track_options:"Prika\u017Ei mo\u017Enosti skladbe",play_similar:"Predvajaj podobne pesmi",close:"Zapri iskanje",no_results:"Ni rezultatov.",play_next:"Predvajaj naslednje",replace_play:"Zamenjaj \u010Dakalno vrsto in predvajaj",replace:"Zamenjaj \u010Dakalno vrsto",add_queue:"Dodaj na konec \u010Dakalne vrste",move_up:"Premakni gor",move_down:"Premakni dol",move_next:"Premakni na naslednje",remove:"Odstrani iz \u010Dakalne vrste",drag_to_reorder:"Povlecite za prerazvrstitev",added:"Dodano v \u010Dakalno vrsto!",added_to_playlist:"Dodano na seznam predvajanja!",select_playlist:"Izberite seznam predvajanja za '{track}'",add_to_playlist:"Dodaj na seznam predvajanja",select_track_for_playlist:"Izberite skladbo za dodajanje za '{track}' od {artist}",labels:{replace:"Zamenjaj",next:"Naslednje",replace_next:"Zamenjaj naslednje",add:"Dodaj",add_to_playlist:"Dodaj na seznam predvajanja"},results:"rezultati",result:"rezultat",filters:{all:"Vse",artist:"Izvajalec",album:"Album",track:"Skladba",playlist:"Seznam predvajanja",radio:"Radio",music:"Glasba",station:"Postaja",podcast:"Podcast",audiobook:"Zvo\u010Dna knjiga"},search_artist:"I\u0161\u010Di tega izvajalca",browse_album:"Prebrskaj skladbe iz {album}",play_collection:"Predvajaj to zbirko",play_collection_error:"Te zbirke ni mogo\u010De predvajati neposredno",play_item:"Predvajaj {item}"},lyrics:{finding:"Iskanje besedila...",none_found:"Besedila ni bilo mogo\u010De najti",not_available:"Besedilo ni na voljo",instrumental:"Instrumentalna skladba"},lyrics_sources:{mass_lrclib:"Music Assistant (Rezerva na LRCLIB)",mass:"Samo Music Assistant",lrclib:"Samo LRCLIB",lrclib_mass:"LRCLIB (Rezerva na Music Assistant)"},lyrics_modes:{default:"Privzeto (Ozna\u010Di in pomakni)",scroll:"Samo pomikanje",text:"Samo besedilo"}};const Va={en:pc,de:_c,es:mc,fr:gc,it:fc,nl:yc,pt:vc,sk:bc,sl:xc};function u(i,e="",t=""){const a=(localStorage.getItem("selectedLanguage")||document.querySelector("home-assistant")?.hass?.language||"en").replace(/['"]+/g,"").replace("-","_"),s=Va[a]?a:a.split("_")[0];let r;const n=i.split("."),o=(l,c)=>{try{return c.reduce((d,h)=>d&&d[h]!==void 0?d[h]:void 0,l)}catch{return}};if(r=o(Va[s],n),r===void 0&&s!=="en"&&(r=o(Va.en,n)),r===void 0&&(r=i),typeof r!="string"&&(r=i),typeof e=="object"&&e!==null)for(const[l,c]of Object.entries(e))r=r.replaceAll(l,c);else e!==""&&t!==""&&(r=r.replaceAll(e,t));return r}const Ua=8,Ur=16,Br=32,Ba=128,Ha=256,wc=4096,Hr=32768,Gr=524288,Qr=262144,Wr=Object.freeze(["aspect_ratio","media_title","media_artist","media_album_name","media_content_id","media_channel","app_name","media_content_type","entity_id","entity_state"]),At=6,ri=Object.freeze({custom:{},large_modern:{match_theme:!0,appearance:"automatic",control_layout:"modern",adaptive_controls:!0,adaptive_text:!0,artwork_object_fit:"cover",extend_artwork:!0,show_chip_row:"in_menu_on_idle",hold_to_pin:!0,pin_search_headers:!0,progress_bar_height:16,search_view:"card",search_card_columns:3,display_timestamps:!0,details_alignment:"left"},crisp_clean:{match_theme:!0,volume_mode:"stepper",hold_to_pin:!0,volume_step:.05,show_chip_row:"in_menu",extend_artwork:!0,search_results_sort:"play_count_desc",control_layout:"modern",dismiss_search_on_play:!0,keep_filters_on_search:!1,display_timestamps:!0,search_view:"list",default_search_filter:"all",default_search_favorites:!0,appearance:"automatic",details_alignment:"center",artwork_object_fit:"scaled-contain-alternate",progress_bar_height:2},minimal_mini:{match_theme:!0,appearance:"automatic",always_collapsed:!0,show_chip_row:"in_menu",details_alignment:"left",hold_to_pin:!0,progress_bar_height:2,volume_mode:"stepper",extend_artwork:!0,blurred_artwork:!0,hide_collapsed_artwork:!0},normal_mini:{match_theme:!0,appearance:"automatic",always_collapsed:!0,show_chip_row:"auto",details_alignment:"left",hold_to_pin:!0,progress_bar_height:2,volume_mode:"slider",extend_artwork:!0,blurred_artwork:!0},dedicated_search:{match_theme:!0,appearance:"automatic",card_type:"search",search_view:"card",hide_menu_player:!0,hold_to_pin:!0,show_chip_row:"in_menu",disable_autofocus:!0},dedicated_grouping:{match_theme:!0,appearance:"automatic",card_type:"group_players",hide_menu_player:!0,show_chip_row:"in_menu"},quick_and_easy:{match_theme:!0,appearance:"automatic",always_show_quick_group:!0,show_chip_row:"always",dismiss_search_on_play:!0,extend_artwork:!0,show_volume_overlay:!0,hold_to_pin:!0},huge_yamp:{match_theme:!0,appearance:"automatic",control_layout:"modern",adaptive_controls:!0,adaptive_text:!0,progress_bar_height:48,display_timestamps:!0,artwork_object_fit:"cover",extend_artwork:!0,search_view:"card",search_card_columns:2,show_volume_overlay:!0}}),Yr=new WeakMap;function ge(i,e){const t=i?.[e];return typeof t=="string"&&t.trim()!==""?t:null}async function kc(i,e,t){if(!e||typeof e!="string")return t;if(!e.includes("{{")&&!e.includes("{%"))return e;try{const a=(await i.callApi("POST","template",{template:e})||"").toString().trim();return a&&/^([a-z_]+)\.[A-Za-z0-9_]+$/.test(a)?a:t}catch{return t}}async function Ga(i,e,t={}){if(!e||typeof e!="string")return e;if(!e.includes("{{")&&!e.includes("{%")){if(/%7B%7B|%7B%25/i.test(e))try{e=decodeURIComponent(e)}catch{}if(!e.includes("{{")&&!e.includes("{%"))return e}let a=e;t&&Object.keys(t).length>0&&(a=`${Object.entries(t).map(([s,r])=>`{% set ${s} = ${JSON.stringify(r)} %}`).join(" ")} ${e}`);try{return(await i.callApi("POST","template",{template:a})||"").toString().trim()}catch(s){return console.warn("yamp: Error resolving template:",e,s),e}}function ni(i,e,t={}){if(!e||typeof e!="string")return e;let a=e;if(/%7B%7B|%7B%25/i.test(a))try{a=decodeURIComponent(a)}catch{}if(!a.includes("{{")&&!a.includes("{%"))return a;let s=a,r=!0;return s=s.replace(/\{\{\s*(.*?)\s*\}\}/g,(n,o)=>{let l=o.trim(),c=!1;l.endsWith("| urlencode")?(c=!0,l=l.replace(/\|\s*urlencode$/,"").trim()):l.endsWith("|urlencode")&&(c=!0,l=l.replace(/\|urlencode$/,"").trim());let d=l.match(/^state_attr\(\s*(['"]?)([\w.]+)\1\s*,\s*(['"]?)([\w_]+)\3\s*\)$/);if(d){let _=d[2],m=t[_]!==void 0&&!d[1]?t[_]:_,f=d[4];const y=i?.states?.[m];if(y&&y.attributes&&y.attributes[f]!==void 0){let b=String(y.attributes[f]);return c?encodeURIComponent(b):b}return""}let h=l.match(/^states\(\s*(['"]?)([\w.]+)\1\s*\)(?:\s*(==|!=)\s*(['"])(.*?)\4)?$/);if(h){let _=h[2],m=t[_]!==void 0&&!h[1]?t[_]:_,f=h[3],y=h[5];const b=i?.states?.[m];let k="unknown";if(b&&b.state!==void 0&&(k=String(b.state)),f){let E=(f==="=="?k===y:k!==y)?"true":"false";return c?encodeURIComponent(E):E}return c?encodeURIComponent(k):k}let p=l.match(/^is_state\(\s*(['"]?)([\w.]+)\1\s*,\s*(['"])(.*?)\3\s*\)$/);if(p){let _=p[2],m=t[_]!==void 0&&!p[1]?t[_]:_,f=p[4];const y=i?.states?.[m];let b="unknown";y&&y.state!==void 0&&(b=String(y.state));let k=b===f?"true":"false";return c?encodeURIComponent(k):k}if(/^[\w_]+$/.test(l)&&t[l]!==void 0){let _=String(t[l]);return c?encodeURIComponent(_):_}return r=!1,n}),!r||s.includes("{%")?null:s}function Ec(i,e){if(!i?.states||!e)return[];const t=[],a=i.states[e];if(!a)return[];const s=a.attributes?.device_id,r=a.attributes?.friendly_name||e;for(const[n,o]of Object.entries(i.states))if(n.startsWith("button.")&&o.attributes){const l=o.attributes.device_id,c=o.attributes.friendly_name||n;s&&l===s?t.push({entity_id:n,friendly_name:c,device_class:o.attributes.device_class,reason:"same_device"}):(c.toLowerCase().includes(r.toLowerCase())||r.toLowerCase().includes(c.toLowerCase()))&&t.push({entity_id:n,friendly_name:c,device_class:o.attributes.device_class,reason:"name_similarity"})}return t}function Sc(i,e){if(!i?.states||!e)return null;const t=i.states[e];return t&&t.attributes&&(t.attributes.media_content_id||t.attributes.media_content_type||t.attributes.media_album_name||t.attributes.media_artist||t.attributes.media_title)?t:null}function $t(i){return!i||!i.attributes?!1:i.attributes.app_id==="music_assistant"||i.attributes.mass_player_type!==void 0}function Ac(i){if(!i)return"";const e=i.media_type||i.media_class||i.media_content_type,t=i.name||i.title||i.media_title||"Unknown Title",a=i.artists?.[0],s=i.artist||a?.name||(typeof a=="string"?a:void 0)||i.media_artist||"Unknown Artist";if(e==="track"){const r=i.album||i.media_album_name;return r?u("search.browse_album","{album}",r):`${t} - ${s}`}return e==="album"?u("search.browse_album","{album}",t):t}function $c(i,e,t,a={}){if(!e||!Array.isArray(e)||!e.length)return null;const s=i.attributes,r=i.entity_id,n=()=>e.find(h=>Wr.some(p=>{const _=h[p];if(_==null||_==="")return!1;if(p==="aspect_ratio"){const b=ge(s,"entity_picture_local")||ge(s,"entity_picture")||ge(s,"album_art")||null;if(!b)return!1;let k=b.trim();(k.startsWith("'")&&k.endsWith("'")||k.startsWith('"')&&k.endsWith('"'))&&k.length>=2&&(k=k.slice(1,-1).trim());const E=k.match(/^url\((.*)\)$/i);E&&E[1]!==void 0&&(k=E[1].trim(),(k.startsWith("'")&&k.endsWith("'")||k.startsWith('"')&&k.endsWith('"'))&&(k=k.slice(1,-1).trim()));const w=a.aspectRatioCache?a.aspectRatioCache[k]:void 0;if(w==null)return!1;let P=parseFloat(_);if(typeof _=="string"&&_.includes(":")){const $=_.split(":");$.length===2&&!isNaN($[0])&&!isNaN($[1])&&parseFloat($[1])!==0&&(P=parseFloat($[0])/parseFloat($[1]))}return isNaN(P)?!1:Math.abs(w-P)<=.1}const m=p==="entity_id"?r:p==="entity_state"?i?.state:s[p];if(_==="*")return!0;let f=Yr.get(h);f||(f={},Yr.set(h,f));let y=f[p];if(y===void 0)if(typeof _=="string"&&_.includes("*")&&_!=="*")try{const b=_.replace(/\*+/g,"*");if((b.match(/\*/g)||[]).length<=5){const k=b.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\\\*/g,".*");y=new RegExp(`^${k}$`,"i"),f[p]=y}else f[p]=null,y=null}catch{f[p]=null,y=null}else f[p]=null,y=null;return y?y.test(String(m||"")):m===_})),o=ge(s,"entity_picture_local")||ge(s,"entity_picture")||ge(s,"album_art");let l=n(),c=null,d="image";if(l?.image_url?c=l.image_url:l?.missing_art_url&&!o?(c=l.missing_art_url,d="missing"):l?.idle_image_url&&a.isIdleImageActive?(c=l.idle_image_url,d="idle"):l&&o&&(c=ge(s,"entity_picture_local")||ge(s,"entity_picture")||ge(s,"album_art")),!l&&!o){const h=e.find(p=>p?.missing_art_url);h?.missing_art_url&&(l=h,c=h.missing_art_url,d="missing")}if(!l&&a.isIdleImageActive){const h=e.find(p=>p?.idle_image===!0||p?.idle_image_url!==void 0);h&&(l=h,c=h.idle_image_url||h.image_url,d="idle")}if(l){let h=null;return c&&(h=typeof t=="function"?t(l,c,d,i):c),{url:h,sizePercentage:l?.size_percentage,objectFit:l?.object_fit??null,objectPosition:l?.object_position??null}}return null}function Qa(i,{hostname:e="",overrides:t=[],fallbackArtwork:a=null,artworkObjectFit:s=null,resolveOverrideSource:r=null,aspectRatioCache:n={},isIdleImageActive:o=!1}={}){if(!i||!i.attributes)return null;const l=i.attributes;let c=null,d=null,h=null;if(s==="no_artwork")return{url:null,sizePercentage:null,objectFit:"no_artwork"};const p=$c(i,t,r,{aspectRatioCache:n||{},isIdleImageActive:o});let _=null;return p&&(c=p.url,d=p.sizePercentage,h=p.objectFit,_=p.objectPosition),c||(c=ge(l,"entity_picture_local")||ge(l,"entity_picture")||ge(l,"album_art")||null),!c&&a&&(a==="smart"?l.media_title==="TV"||l.media_channel||l.app_id==="tv"||l.app_id==="androidtv"?c="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvcj4KPHJlY3QgeD0iNjgiIHk9IjEyMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHJlY3QgeD0iODAiIHk9IjEzMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==":c="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI5OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=":typeof a=="string"&&(c=a)),c=Kr(c,e),{url:c,sizePercentage:d,objectFit:h,objectPosition:_}}function Kr(i,e){let t=i;if(t&&e&&!/^https?:\/\//i.test(t)&&!t.startsWith("data:")){const a=e.endsWith("/")?e.slice(0,-1):e,s=t.startsWith("/")?t:`/${t}`;t=a+s}return t&&!oi(t)?null:t}function oi(i){if(!i||typeof i!="string"||i.includes("undefined")||i.includes("null")||i.trim()==="")return!1;if(i.startsWith("data:")||i.startsWith("/")||i.startsWith("./")||i.startsWith("../"))return!0;try{return new URL(i),!0}catch{return!1}}function Cc({idx:i,selected:e,playing:t,name:a,art:s,icon:r,pinned:n,holdToPin:o,maActive:l,onChipClick:c,onIconClick:d,onPinClick:h,onPointerDown:p,onPointerMove:_,onPointerUp:m,objectFit:f,quickGroupingState:y,onQuickGroupClick:b,onDoubleClick:k}){const E=f?`object-fit: ${f};`:"";return g`
    <button
      class="chip"
      ?selected=${e}
      ?playing=${t}
      ?ma-active=${l}
      @dblclick=${k}
      @click=${()=>c(i)}
      @pointerdown=${p}
      @pointermove=${_}
      @pointerup=${m}
      @pointerleave=${m}
      style="display:flex;align-items:center;justify-content:space-between;position:relative;"
    >
      <span class="chip-icon">
        ${s?g`<img
                class="chip-mini-art"
                src="${s}"
                style="${E}"
                onerror="this.style.display='none'"
              />`:g`<ha-icon .icon=${r} style="font-size:28px;"></ha-icon>`}
      </span>
      <span
        class="chip-label"
        style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;"
      >
        ${a}
      </span>
      ${t?g`
              <span class="chip-playing-indicator">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
              </span>
            `:v}
      ${n?g`
              <span
                class="chip-pin-inside"
                @click=${w=>{w.stopPropagation(),h(i,w)}}
                title="${u("common.unpin")}"
              >
                <ha-icon .icon=${"mdi:pin"}></ha-icon>
              </span>
            `:g`<span class="chip-pin-spacer"></span>`}
      ${Zr({idx:i,quickGroupingState:y,onQuickGroupClick:b})}
    </button>
  `}function Ic({idx:i,selected:e,playing:t,groupName:a,art:s,icon:r,pinned:n,holdToPin:o,maActive:l,onChipClick:c,onIconClick:d,onPinClick:h,onPointerDown:p,onPointerMove:_,onPointerUp:m,objectFit:f,quickGroupingState:y,onQuickGroupClick:b,onDoubleClick:k}){const E=f?`object-fit: ${f};`:"";return g`
    <button
      class="chip group"
      ?selected=${e}
      ?ma-active=${l}
      @dblclick=${k}
      @click=${()=>c(i)}
      @pointerdown=${p}
      @pointermove=${_}
      @pointerup=${m}
      @pointerleave=${m}
      style="display:flex;align-items:center;justify-content:space-between;position:relative;"
    >
      <span
        class="chip-icon"
        style="cursor:pointer;"
        @click=${w=>{w.stopPropagation(),d&&d(i,w)}}
      >
        ${s?g`<img
                class="chip-mini-art"
                src="${s}"
                style="cursor:pointer;${E}"
                onerror="this.style.display='none'"
                @click=${w=>{w.stopPropagation(),d&&d(i,w)}}
              />`:g`<ha-icon
                .icon=${r}
                style="font-size:28px;cursor:pointer;"
                @click=${w=>{w.stopPropagation(),d&&d(i,w)}}
              ></ha-icon>`}
      </span>
      <span
        class="chip-label"
        style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;"
      >
        ${a}
      </span>
      ${t?g`
              <span class="chip-playing-indicator">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
              </span>
            `:v}
      ${n?g`
              <span
                class="chip-pin-inside"
                @click=${w=>{w.stopPropagation(),h(i,w)}}
                title="${u("common.unpin")}"
              >
                <ha-icon .icon=${"mdi:pin"}></ha-icon>
              </span>
            `:g`<span class="chip-pin-spacer"></span>`}
      ${Zr({idx:i,quickGroupingState:y,onQuickGroupClick:b})}
    </button>
  `}function Zr({idx:i,quickGroupingState:e,onQuickGroupClick:t}){if(!e||!e.isGroupable)return v;const{isPrimary:a,isBusy:s,grouped:r,tooltip:n}=e;return g`
    <span
      class="chip-quick-group"
      @click=${o=>{o.stopPropagation(),t&&!s&&!a&&t(i,o)}}
      title=${n||(a?"Primary":s?"Unavailable":r?"Unjoin":"Join")}
      style="${a?"cursor:default;opacity:0.7;":s?"opacity:0.5;cursor:not-allowed;":""}"
    >
      <ha-icon .icon=${a?"mdi:star-circle-outline":r?"mdi:minus":"mdi:plus"}></ha-icon>
    </span>
  `}function Tc({onPin:i,onHoldEnd:e,holdTime:t=600,moveThreshold:a=8}){let s=null,r=null,n=null,o=!1;return{pointerDown:(l,c)=>{r=l.clientX,n=l.clientY,o=!1,s=setTimeout(()=>{o||(i(c,l),e&&e(c))},t)},pointerMove:(l,c)=>{if(s&&r!==null&&n!==null){const d=Math.abs(l.clientX-r),h=Math.abs(l.clientY-n);(d>a||h>a)&&(o=!0,clearTimeout(s),s=null)}},pointerUp:(l,c)=>{s&&(clearTimeout(s),s=null),r=null,n=null,o=!1}}}function Jr({groupedSortedEntityIds:i,entityIds:e,selectedEntityId:t,pinnedIndex:a,holdToPin:s,getChipName:r,getActualGroupMaster:n,getIsChipPlaying:o,getChipArt:l,getIsMaActive:c,isIdle:d,hass:h,artworkHostname:p="",mediaArtworkOverrides:_=[],fallbackArtwork:m=null,onChipClick:f,onIconClick:y,onPointerClick:b,onPinClick:k,onPointerDown:E,onPointerMove:w,onPointerUp:P,quickGroupingMode:$,getQuickGroupingState:C,onQuickGroupClick:N,onDoubleClick:j}){return!i||!i.length?v:g`
    ${i.map(F=>{if(F.length>1){const I=n(F),O=e.indexOf(I),R=h?.states?.[I],D=typeof o=="function"?o(I,t===I):R?.state==="playing",ne=typeof l=="function"?l(I):Qa(R,{hostname:p,overrides:_,fallbackArtwork:m}),J=ne?.url,L=ne?.objectFit,oe=R?.attributes?.icon||"mdi:cast",G=typeof c=="function"?c(I):!1;return Ic({idx:O,selected:t===I,playing:D,groupName:r(I)+(F.length>1?` [${F.length}]`:""),art:J,icon:oe,pinned:a===O,holdToPin:s,maActive:G,onChipClick:f,onIconClick:y,onPinClick:k,onPointerDown:W=>E(W,O),onPointerMove:W=>w(W,O),onPointerUp:W=>P(W,O),objectFit:L,quickGroupingState:$&&typeof C=="function"?C(I):null,onQuickGroupClick:N,onDoubleClick:j})}else{const I=F[0],O=e.indexOf(I),R=h?.states?.[I],D=typeof o=="function"?o(I,t===I):R?.state==="playing",ne=typeof l=="function"?l(I):Qa(R,{hostname:p,overrides:_,fallbackArtwork:m}),J=ne?.url,L=ne?.objectFit,oe=t===I?!d&&J:D&&J,G=R?.attributes?.icon||"mdi:cast",W=typeof c=="function"?c(I):!1;return Cc({idx:O,selected:t===I,playing:D,name:r(I),art:oe,icon:G,pinned:a===O,holdToPin:s,maActive:W,onChipClick:f,onPinClick:k,onPointerDown:Y=>E(Y,O),onPointerMove:Y=>w(Y,O),onPointerUp:Y=>P(Y,O),objectFit:L,quickGroupingState:$&&typeof C=="function"?C(I):null,onQuickGroupClick:N,onDoubleClick:j})}})}
  `}function Mc({actions:i,onActionChipClick:e}){return i?.length?g`
    <div class="action-chip-row">
      ${i.map((t,a)=>g`
          <button class="action-chip" @click=${()=>e(a)}>
            ${t.icon?g`<ha-icon
                    .icon=${t.icon}
                    style="font-size: 22px; margin-right: ${t.name?"8px":"0"};"
                  ></ha-icon>`:v}
            ${t.name||""}
          </button>
        `)}
    </div>
  `:v}function Pc({stateObj:i,showStop:e,shuffleActive:t,repeatActive:a,onControlClick:s,supportsFeature:r,showFavorite:n,favoriteActive:o,hiddenControls:l={},adaptiveControls:c=!1,controlLayout:d="classic",swapPauseForStop:h=!1}){if(!i)return v;const p=d==="modern"?"modern":"classic",_=!i||i.state!=="playing";let m=!l.previous&&(r(i,Ur)||_),f=!l.play_pause;const y=!l.stop&&e;let b=y,k=!l.next&&(r(i,Br)||_),E=!l.shuffle&&r(i,Hr),w=!l.repeat&&r(i,Qr),P=!l.favorite&&n,$=!l.power&&(r(i,Ha)||r(i,Ba));const C=p==="modern"&&h&&y,N=i.state==="playing",j=C&&N;p==="modern"&&(b=!1,P=!1,$=!1);const F=Wa(i,r,n,l,e,p),I=c?"controls-row adaptive":"controls-row",O=p==="modern"?`${I} modern`:I;let R=c?`--yamp-control-count:${Math.max(F,1)};`:v;if(c){const D=F<=3?{icon:56,minWidth:78,maxWidth:150,minHeight:78,padding:14,gap:14}:F===4?{icon:48,minWidth:68,maxWidth:130,minHeight:68,padding:12,gap:12}:F===5?{icon:42,minWidth:58,maxWidth:110,minHeight:58,padding:10,gap:10}:F===6?{icon:36,minWidth:50,maxWidth:96,minHeight:52,padding:8,gap:8}:{icon:32,minWidth:44,maxWidth:88,minHeight:48,padding:6,gap:6};R+=[`--yamp-control-gap:${D.gap}px`,`--yamp-control-min-width:${D.minWidth}px`,`--yamp-control-max-width:${D.maxWidth}px`,`--yamp-control-min-height:${D.minHeight}px`,`--yamp-control-padding:${D.padding}px`,`--yamp-control-icon-size:${D.icon}px`].join(";")}return p==="modern"?g`
      <div class=${O} style=${R}>
        <div class="controls-left">
          ${E?g`
                  <button
                    class="modern-button small${t?" active":""}"
                    @click=${()=>s("shuffle")}
                    title="${u("card.media_controls.shuffle")}"
                  >
                    <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
                  </button>
                `:v}
          ${m?g`
                  <button
                    class="modern-button medium"
                    @click=${()=>s("prev")}
                    title="${u("card.media_controls.previous")}"
                  >
                    <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
                  </button>
                `:v}
        </div>

        <div class="controls-center">
          ${f?g`
                  <button
                    class="modern-button primary${N?" active":""}"
                    @click=${()=>s(j?"stop":"play_pause")}
                    title="${j?u("card.media_controls.stop"):u("card.media_controls.play_pause")||"Play/Pause"}"
                  >
                    <ha-icon
                      .icon=${j?"mdi:stop":N?"mdi:pause":"mdi:play"}
                    ></ha-icon>
                  </button>
                `:v}
        </div>

        <div class="controls-right">
          ${k?g`
                  <button
                    class="modern-button medium"
                    @click=${()=>s("next")}
                    title="${u("card.media_controls.next")}"
                  >
                    <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
                  </button>
                `:v}
          ${w?g`
                  <button
                    class="modern-button small${a?" active":""}"
                    @click=${()=>s("repeat")}
                    title="${u("card.media_controls.repeat")}"
                  >
                    <ha-icon
                      .icon=${i.attributes.repeat==="one"?"mdi:repeat-once":"mdi:repeat"}
                    ></ha-icon>
                  </button>
                `:v}
        </div>
      </div>
    `:g`
    <div class=${O} style=${R}>
      ${m?g`
              <button
                class="button"
                @click=${()=>s("prev")}
                title="${u("card.media_controls.previous")}"
              >
                <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
              </button>
            `:v}
      ${f?g`
              <button
                class="button"
                @click=${()=>s("play_pause")}
                title="${u("card.media_controls.play_pause")}"
              >
                <ha-icon .icon=${i.state==="playing"?"mdi:pause":"mdi:play"}></ha-icon>
              </button>
            `:v}
      ${b?g`
              <button
                class="button"
                @click=${()=>s("stop")}
                title="${u("card.media_controls.stop")}"
              >
                <ha-icon .icon=${"mdi:stop"}></ha-icon>
              </button>
            `:v}
      ${k?g`
              <button
                class="button"
                @click=${()=>s("next")}
                title="${u("card.media_controls.next")}"
              >
                <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
              </button>
            `:v}
      ${E?g`
              <button
                class="button${t?" active":""}"
                @click=${()=>s("shuffle")}
                title="${u("card.media_controls.shuffle")}"
              >
                <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
              </button>
            `:v}
      ${w?g`
              <button
                class="button${a?" active":""}"
                @click=${()=>s("repeat")}
                title="${u("card.media_controls.repeat")}"
              >
                <ha-icon
                  .icon=${i.attributes.repeat==="one"?"mdi:repeat-once":"mdi:repeat"}
                ></ha-icon>
              </button>
            `:v}
      ${P?g`
              <button
                class="button${o?" active":""}"
                @click=${()=>s("favorite")}
                title="${u("common.favorite")}"
              >
                <ha-icon .icon=${o?"mdi:heart":"mdi:heart-outline"}></ha-icon>
              </button>
            `:v}
      ${$?g`
              <button
                class="button${i.state!=="off"?" active":""}"
                @click=${()=>s("power")}
                title="${u("common.power")}"
              >
                <ha-icon .icon=${"mdi:power"}></ha-icon>
              </button>
            `:v}
    </div>
  `}function Wa(i,e,t=!1,a={},s=!1,r="classic"){const n=r==="modern"?"modern":"classic",o=!i||i.state==="idle"||i.state==="paused"||i.state==="off"||i.state==="standby"||i.state==="unavailable";let l=0;return!a.previous&&(e(i,Ur)||o)&&l++,a.play_pause||l++,n!=="modern"&&!a.stop&&s&&l++,!a.next&&(e(i,Br)||o)&&l++,!a.shuffle&&e(i,Hr)&&l++,!a.repeat&&e(i,Qr)&&l++,n!=="modern"&&!a.favorite&&t&&l++,n!=="modern"&&!a.power&&(e(i,Ha)||e(i,Ba))&&l++,l}function zc({isRemoteVolumeEntity:i,showSlider:e,vol:t,isMuted:a,supportsMute:s,onVolumeDragStart:r,onVolumeDragEnd:n,onVolumeInput:o,onVolumeChange:l,onVolumeStep:c,onMuteToggle:d,moreInfoMenu:h,leadingControlTemplate:p=v,reserveLeadingControlSpace:_=!1,showRightPlaceholder:m=!1,rightSlotTemplate:f=v,hideVolume:y=!1,collapseRow:b=void 0,isDragging:k=!1,dragVol:E=0}){const w=p!==v&&p!==void 0&&p!==null,P=($,C)=>(s?C:$===0)||$===0?"mdi:volume-off":$<.2?"mdi:volume-low":$<.5?"mdi:volume-medium":"mdi:volume-high";return g`
    <div
      class="volume-row ${e&&!i?"has-slider":""}"
      style="${(typeof b=="boolean"?b:y&&h===v&&!w&&!m)?"display: none !important;":""}"
    >
      <div class="volume-left">
        ${w?p:_?g`<div class="volume-leading-placeholder"></div>`:v}
        <div
          style="${y||i?"visibility:hidden; opacity:0; pointer-events:none;":""}"
        >
          <button
            class="volume-icon-btn"
            @click=${d}
            title=${u((s?a:t===0)?"common.unmute":"common.mute")}
          >
            <ha-icon icon=${P(t,a)}></ha-icon>
          </button>
        </div>
      </div>

      <div
        class="volume-center"
        style="${y?"visibility:hidden; opacity:0; pointer-events:none;":""}"
      >
        ${i?g`
                <div class="vol-stepper-container">
                  <div class="vol-stepper">
                    <button
                      class="button"
                      @click=${()=>c(-1)}
                      title="${u("common.vol_down")}"
                    >
                      –
                    </button>
                    <span class="vol-label">vol</span>
                    <button
                      class="button"
                      @click=${()=>c(1)}
                      title="${u("common.vol_up")}"
                    >
                      +
                    </button>
                  </div>
                </div>
              `:e?g`
                  <div class="volume-slider-container">
                    <div
                      class="volume-percentage-indicator ${k?"visible":""}"
                      style="left: calc(33px + ${E} * (100% - 66px))"
                    >
                      ${Math.round(E*100)}%
                    </div>
                    <input
                      class="vol-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      .value=${t}
                      @mousedown=${r}
                      @touchstart=${r}
                      @input=${o}
                      @change=${l}
                      @mouseup=${n}
                      @touchend=${n}
                      title="${u("common.volume")}"
                    />
                  </div>
                `:g`
                  <div class="vol-stepper-container">
                    <div class="vol-stepper">
                      <button
                        class="button"
                        @click=${()=>c(-1)}
                        title="${u("common.vol_down")}"
                      >
                        –
                      </button>
                      <span class="vol-value">${Math.round(t*100)}%</span>
                      <button
                        class="button"
                        @click=${()=>c(1)}
                        title="${u("common.vol_up")}"
                      >
                        +
                      </button>
                    </div>
                  </div>
                `}
      </div>

      <div class="volume-right">
        ${m?g` <div class="volume-placeholder">${f||v}</div> `:v}
        ${h}
      </div>
    </div>
  `}function Xr(i){if(i==null||isNaN(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60);return`${e}:${t<10?"0":""}${t}`}function Vi({progress:i,seekEnabled:e,onSeek:t,collapsed:a,accent:s,height:r=At,style:n="",displayTimestamps:o=!1,currentTime:l=0,duration:c=0,customHeight:d=At}){const h=s||"var(--custom-accent, #ff9800)",p=a?Math.min(d,Math.max(4,Math.floor(d/2))):d,_=Math.min(6,p/2),m=Math.max(10,Math.min(24,Math.floor(p*.6+6))),f=`--progress-radius: ${_}px; --timestamp-size: ${m}px;`;return a?g`
      <div
        class="collapsed-progress-bar"
        style="width: ${i*100}%; background: ${h}; height: ${p}px; ${f} ${n}"
      ></div>
    `:g`
    <div class="progress-bar-container" style="${f} ${n}">
      <div
        class="progress-bar"
        style="height:${p}px;"
        @click=${e?t:null}
        title=${e?u("common.seek"):""}
      >
        <div
          class="progress-inner"
          style="width: ${i*100}%; background: ${h};"
        ></div>
      </div>
      ${o?g`
              <div class="timestamps-container">
                <span>${Xr(l)}</span>
                <span>-${Xr(Math.max(0,c-l))}</span>
              </div>
            `:v}
    </div>
  `}const B=Object.freeze({MEDIA_BACKGROUND:0,MEDIA_OVERLAY:0,LYRICS_OVERLAY:1,FLOATING_ELEMENT:1,STICKY_CHIPS:1,ACCENT_FOREGROUND:1,FLOATING_CONTROLS:1,OVERLAY_BASE:2,MODAL_BACKDROP:2,MODAL_TOAST:2,SEARCH_SLIDE_OUT:1,SEARCH_SUCCESS:1,VOLUME_OVERLAY:3}),en=Me`linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 10px, black 50px, black calc(100% - 50px), rgba(0,0,0,0.5) calc(100% - 10px), transparent)`,fe=Me`
  scrollbar-width: none;
  -ms-overflow-style: none;
`,Ui=Me`blur(5px)`,tn=Me`blur(10px)`,an=Me`blur(20px)`,Bi=Me`linear-gradient(to bottom, black 0%, black calc(100% - 12px), transparent 100%)`,sn=Me`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`,rn=Me`
  --card-bg: #fff;
  --primary-text: #222;
  --secondary-text: #666;
  --yamp-overlay-bg: rgba(255, 255, 255, 0.95);
  --yamp-overlay-text: #222;
  --yamp-overlay-divider: rgba(0, 0, 0, 0.1);
  --yamp-icon-color: #444;
  --yamp-button-bg: rgba(0, 0, 0, 0.05);
  --yamp-button-border: rgba(0, 0, 0, 0.1);
  --yamp-overlay-text-secondary: rgba(0, 0, 0, 0.6);
  --yamp-chip-bg: rgba(255, 255, 255, 0.8);
  --yamp-chip-text: #222;
  --yamp-chip-border: rgba(0, 0, 0, 0.1);
  --search-card-bg: rgba(0, 0, 0, 0.03);
  --search-text-secondary: #666;
  --search-thumb-placeholder-bg: rgba(0, 0, 0, 0.05);
  --search-thumb-placeholder-icon: rgba(0, 0, 0, 0.4);
  --search-success-text: #222;
  --search-input-bg: rgba(0, 0, 0, 0.05);
  --search-input-text: #222;
`,nn=Me`
  background: var(--card-bg, #fff);
  color: var(--primary-text, #222);
  border: 1px solid var(--yamp-overlay-divider, #bbb);
`,jc=Me`
  /* CSS Custom Properties for consistency */
  :host {
    --custom-accent: #ff9800;
    --card-bg: #222;
    --primary-text: #fff;
    --secondary-text: #aaa;
    --chip-bg: #333;
    --transition-fast: 0.13s;
    --transition-normal: 0.2s;
    --transition-slow: 0.4s;
    --border-radius: 16px;
    --chip-border-radius: 24px;
    --button-border-radius: 8px;
    --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.13);
    --shadow-medium: 0 2px 8px rgba(0, 0, 0, 0.25);
    --shadow-heavy: 0 0 6px 1px rgba(0, 0, 0, 0.32), 0 0 1px 1px rgba(255, 255, 255, 0.13);
    --yamp-artwork-fit: cover;
    --yamp-text-scale: 1;
    --yamp-text-scale-details: 1;
    --yamp-text-scale-menu: 1;
    --yamp-text-scale-action-chips: 1;
    --yamp-details-scale: var(--yamp-text-scale-details, 1);
    --yamp-details-line-height: 1.2;
    --yamp-details-max-lines: 3;
    --yamp-section-bg: rgba(255, 255, 255, 0.02);
    --yamp-section-border: rgba(255, 255, 255, 0.1);
    --yamp-section-radius: 12px;
    --yamp-section-divider: rgba(255, 255, 255, 0.06);
    --yamp-section-title-size: 1em;
    --yamp-section-title-weight: 600;
    --yamp-section-description-size: 0.9em;
    --yamp-section-description-color: #888;

    /* Universal theme-aware variables (default to dark) */
    --yamp-overlay-bg: rgba(0, 0, 0, 0.82);
    --yamp-overlay-text: #fff;
    --yamp-overlay-text-shadow: none;
    --yamp-overlay-divider: rgba(255, 255, 255, 0.2);
    --yamp-icon-color: #fff;
    --yamp-button-bg: rgba(255, 255, 255, 0.1);
    --yamp-button-border: rgba(255, 255, 255, 0.2);
    --yamp-overlay-text-secondary: rgba(255, 255, 255, 0.7);
    --yamp-success-color: #4caf50;
    --yamp-error-color: #f44336;
    --yamp-success-bg-light: rgba(76, 175, 80, 0.2);
    --yamp-success-bg-medium: rgba(76, 175, 80, 0.4);
    --yamp-chip-bg: rgba(255, 255, 255, 0.15);
    --yamp-chip-text: #fff;
    --yamp-chip-selected-bg: var(--custom-accent);
    --yamp-chip-selected-text: #fff;
    --search-text-secondary: #bbb;
    --search-error-bg: rgba(244, 67, 54, 0.8);
    --search-card-bg: rgba(255, 255, 255, 0.05);
    --search-thumb-placeholder-bg: rgba(255, 255, 255, 0.1);
    --search-thumb-placeholder-icon: rgba(255, 255, 255, 0.6);
    --search-success-text: #fff;
  }

  :host([data-match-theme="false"]) {
    --custom-accent: #ff9800;

    /* Search sheet default theme variables when match_theme is false */
    --search-overlay-bg: var(--yamp-overlay-bg);
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
    /* Always override custom-accent to use theme accent when match_theme is true, regardless of light/dark mode */
    --custom-accent: var(
      --accent-color,
      var(
        --primary-color,
        var(--state-media_player-active-color, var(--state-active-color, #ff9800))
      )
    );

    /* Dynamically assign base components to theme variants */
    --card-bg: var(--ha-card-background, var(--card-background-color, #222));
    --primary-text: var(--primary-text-color, #fff);
    --secondary-text: var(--secondary-text-color, #aaa);
    --chip-bg: var(--chip-background, #333);
    --yamp-section-bg: var(
      --ha-card-background,
      var(--card-background-color, rgba(255, 255, 255, 0.02))
    );
    --yamp-section-border: var(--divider-color, rgba(255, 255, 255, 0.1));
    --yamp-section-description-color: var(--secondary-text-color, #888);

    /* Search sheet theme-aware variables - used when match_theme is true to follow HA theme colors dynamically */
    --search-overlay-bg: var(--yamp-overlay-bg);
    --search-input-bg: var(--ha-card-background, var(--secondary-background-color, #333));
    --search-input-text: var(--primary-text-color, #fff);
    --search-text: var(--primary-text-color, #fff);
    --search-error: var(--error-color, #ff6b6b);
    --search-success: var(--success-color, #4caf50);
    --search-success-bg: color-mix(in srgb, var(--success-color, #4caf50) 95%, transparent);
    --search-border: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-hover-bg: var(--divider-color, rgba(255, 255, 255, 0.1));
    --search-play-hover: var(--custom-accent);
    --search-queue-bg: var(--ha-card-background, var(--card-background-color, #4a4a4a));
    --search-queue-border: var(--divider-color, #666);
    --search-queue-hover: var(--secondary-background-color, #5a5a5a);
    --search-queue-hover-border: var(--divider-color, #777);

    /* Universal theme-aware variables mapped to HA theme - used when appearance is automatic */
    --yamp-overlay-bg: color-mix(
      in srgb,
      var(--ha-card-background, var(--card-background-color, #000)),
      transparent 18%
    );
    --yamp-overlay-text: var(--primary-text-color, #fff);
    --yamp-overlay-text-shadow: none;
    --yamp-overlay-divider: var(--divider-color, rgba(255, 255, 255, 0.1));
    --yamp-icon-color: var(--primary-text-color, #fff);
    --yamp-button-bg: color-mix(in srgb, var(--primary-text-color, #fff) 10%, transparent);
    --yamp-button-border: var(--divider-color, rgba(255, 255, 255, 0.2));
    --yamp-overlay-text-secondary: var(--secondary-text-color, #888);
    --yamp-success-color: var(--success-color, #4caf50);
    --yamp-error-color: var(--error-color, #f44336);
    --yamp-success-bg-light: color-mix(in srgb, var(--success-color, #4caf50) 20%, transparent);
    --yamp-success-bg-medium: color-mix(in srgb, var(--success-color, #4caf50) 40%, transparent);
    --yamp-chip-selected-text: #fff;
    --search-text-secondary: var(--secondary-text-color, #aaa);

    /* Mode-aware chip defaults - used when appearance is automatic */
    --yamp-chip-bg: color-mix(
      in srgb,
      var(--primary-text-color, #fff) 8%,
      var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.8)))
    );
    --yamp-chip-text: var(--search-text);
    --yamp-chip-selected-bg: var(--custom-accent);
    --yamp-chip-border: var(--divider-color, rgba(0, 0, 0, 0.1));
    --search-error-bg: color-mix(in srgb, var(--error-color, #f44336) 80%, transparent);
    --search-card-bg: color-mix(
      in srgb,
      var(--primary-text-color, #fff) 4%,
      var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.8)))
    );
    --search-thumb-placeholder-bg: color-mix(
      in srgb,
      var(--primary-text-color, #fff) 10%,
      transparent
    );
    --search-thumb-placeholder-icon: var(--secondary-text-color, rgba(255, 255, 255, 0.6));
    --search-success-text: var(--primary-text-color, #fff);
  }

  /* Base card styles - set once, inherit everywhere */
  :host {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, none);
    background: transparent;
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: visible;
    clip-path: none;
  }

  ha-card.yamp-card {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--ha-card-box-shadow, none);
    background: transparent;
    color: var(--primary-text);
    transition: background var(--transition-normal);
    overflow: hidden;
    font-size: inherit;
    position: relative;
    clip-path: none;
    transform: translateZ(0);
  }

  /* Add side padding only for scaled-contain modes where artwork doesn't fill the card edges */
  ha-card.yamp-card:has(> .yamp-card-inner[data-artwork-fit="scaled-contain"]),
  ha-card.yamp-card:has(> .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"]) {
    background: var(--card-bg);
  }

  .yamp-card-inner {
    position: relative;
    z-index: ${B.FLOATING_ELEMENT};
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
    z-index: ${B.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
    transform: translateZ(0);
  }

  .full-bleed-artwork-fade {
    position: absolute;
    inset: -50px;
    z-index: ${B.MEDIA_OVERLAY};
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      rgba(0, 0, 0, 0.92) 100%
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
    color: rgba(255, 255, 255, 0.94);
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.35);
  }

  /* More info menu */
  .more-info-menu {
    display: flex;
    align-items: center;
    margin-right: -4px;
    margin-top: -5px;
    z-index: ${B.FLOATING_CONTROLS};
  }

  .dim-idle .more-info-menu {
    position: absolute;
    bottom: 14px;
    right: 12px;
    margin-top: 0;
    margin-right: 0;
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
    color: var(--yamp-icon-color, #fff);
    transition: color var(--transition-normal, 0.2s);
  }

  .dim-idle .more-info-btn ha-icon {
    color: #9ea2a8;
  }

  .more-info-icon {
    font-size: 2em;
    line-height: 1;
    color: #fff !important;
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
    min-height: 48px;
  }

  /* Media background */
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: ${B.MEDIA_BACKGROUND};
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
    background: rgba(0, 0, 0, 0.5);
    z-index: ${B.MEDIA_OVERLAY};
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
    z-index: ${B.FLOATING_CONTROLS};
    margin-top: 2px;
    border: 1px solid var(--yamp-overlay-divider);
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

  @media (hover: hover) {
    .source-option:hover,
    .source-option:focus {
      background: var(--custom-accent);
      color: #fff;
    }
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

  @media (hover: hover) {
    .chip:hover .chip-icon ha-icon {
      color: #fff;
    }
  }

  .chip-mini-art {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: var(--yamp-artwork-fit, cover);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
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
    flex-shrink: 0;
  }

  .chip-row {
    display: flex;
    gap: 8px;
    padding: 8px 12px 18px 12px;
    margin-bottom: -6px;
    position: relative;
    z-index: ${B.STICKY_CHIPS};
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    ${fe}
    scrollbar-color: var(--accent-color, #1976d2) #222;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    max-width: 100vw;
    background: transparent;
    -webkit-mask-image: ${Bi};
    mask-image: ${Bi};
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
    padding: 2px 12px 16px 12px;
    margin-bottom: -6px;
    position: relative;
    z-index: ${B.STICKY_CHIPS};
    overflow-x: auto;
    white-space: nowrap;
    ${fe}
    font-size: calc(1em * var(--yamp-text-scale-action-chips, 1));
    background: transparent;
    -webkit-mask-image: ${Bi};
    mask-image: ${Bi};
  }

  /* Action chips */
  .action-chip {
    background: var(--yamp-chip-bg, transparent);
    opacity: 1;
    border-radius: var(--button-border-radius);
    color: var(--yamp-chip-text, var(--primary-text));
    box-shadow: var(
      --chip-box-shadow,
      var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none))
    );
    text-shadow: none;
    border: 1px solid var(--yamp-chip-border, transparent);
    outline: none;
    padding: 4px 12px;
    font-weight: 500;
    font-size: 0.95em;
    cursor: pointer;
    margin: 4px 0;
    transition:
      background var(--transition-normal) ease,
      transform 0.1s ease,
      box-shadow var(--transition-normal) ease;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  @media (hover: hover) {
    .action-chip:hover {
      background: var(--custom-accent);
      color: #fff;
      box-shadow: var(
        --chip-box-shadow,
        var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none))
      );
      text-shadow: none;
    }
  }

  .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: var(
      --chip-box-shadow,
      var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none))
    );
    text-shadow: none;
  }

  /* Override action chip colors when match_theme is false */
  :host([data-match-theme="false"]) .action-chip:active {
    background: #ff9800;
  }
  @media (hover: hover) {
    :host([data-match-theme="false"]) .action-chip:hover {
      background: #ff9800;
    }
  }

  /* Main chips */
  .chip {
    display: flex;
    align-items: center;
    border-radius: var(--chip-border-radius);
    padding: 6px 6px 6px 8px;
    background: var(--yamp-chip-bg);
    color: var(--yamp-chip-text);
    box-shadow: var(
      --chip-box-shadow,
      var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none))
    );
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 500;
    opacity: 1;
    border: 1px solid var(--yamp-chip-border, transparent);
    outline: none;
    transition:
      background var(--transition-normal),
      opacity var(--transition-normal),
      box-shadow var(--transition-normal);
    flex: 0 0 auto;
    white-space: nowrap;
    position: relative;
  }

  @media (hover: hover) {
    .chip:hover {
      background: var(--yamp-chip-selected-bg);
      color: var(--yamp-chip-selected-text);
    }
  }

  .chip[selected] {
    background: var(--yamp-chip-selected-bg);
    color: var(--yamp-chip-selected-text);
    opacity: 1;
  }

  .chip[playing] {
    padding-right: 6px;
  }

  /* Playing indicator animation - equalizer bars */
  @keyframes chipPlayingBar1 {
    0%,
    100% {
      height: 3px;
    }
    50% {
      height: 10px;
    }
  }
  @keyframes chipPlayingBar2 {
    0%,
    100% {
      height: 5px;
    }
    50% {
      height: 12px;
    }
  }
  @keyframes chipPlayingBar3 {
    0%,
    100% {
      height: 4px;
    }
    50% {
      height: 8px;
    }
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

  .chip[playing][selected] .chip-playing-indicator {
    color: #fff;
  }
  @media (hover: hover) {
    .chip[playing]:hover .chip-playing-indicator {
      color: #fff;
    }
  }

  /* Chip pin */
  .chip-pin {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #fff;
    border-radius: 50%;
    padding: 2px;
    z-index: ${B.FLOATING_ELEMENT};
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--custom-accent);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.11);
    cursor: pointer;
    transition: box-shadow 0.18s;
  }

  @media (hover: hover) {
    .chip-pin:hover {
      box-shadow: 0 2px 12px rgba(33, 33, 33, 0.17);
    }
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

  @media (hover: hover) {
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
    width: 10px;
    min-width: 10px;
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
    flex-shrink: 0;
  }

  .details .title {
    font-size: 1.1em;
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
    padding-bottom: calc(4px * var(--yamp-details-scale, 1));
    margin-bottom: calc(-4px * var(--yamp-details-scale, 1));
  }

  .details .artist {
    font-size: 1em;
    line-height: var(--yamp-details-line-height, 1.2);
    padding-bottom: calc(4px * var(--yamp-details-scale, 1));
    margin-bottom: calc(-4px * var(--yamp-details-scale, 1));
  }

  .track-options-row {
    display: flex;
    gap: 16px;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
  }

  .track-options-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    transition:
      opacity 0.2s,
      text-decoration 0.2s;
  }

  .track-options-btn ha-icon {
    --mdc-icon-size: 1.1rem;
    margin-top: -2px;
  }

  .track-options-close ha-icon {
    --mdc-icon-size: 1.3rem;
  }

  @media (hover: hover) {
    .track-options-btn:hover {
      opacity: 0.7;
      text-decoration: underline;
    }
  }

  .track-options-title {
    cursor: pointer;
    transition: text-decoration 0.2s;
  }

  @media (hover: hover) {
    .track-options-title:hover {
      text-decoration: underline;
    }
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

  :host([data-details-alignment="center"]) .details {
    align-items: center;
    text-align: center;
  }

  :host([data-details-alignment="right"]) .details {
    align-items: flex-end;
    text-align: right;
  }

  :host([data-has-custom-height="true"]) .details {
    margin-top: calc(4px * var(--yamp-details-scale, 1));
    padding-bottom: calc(6px * var(--yamp-details-scale, 1));
    gap: calc(4px * var(--yamp-details-scale, 1));
  }

  :host([data-has-custom-height="true"]) .details .title {
    padding-top: calc(4px * var(--yamp-details-scale, 1));
  }

  :host([data-has-custom-height="true"]) .controls-row {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  :host([data-details-alignment="center"]) .track-options-row {
    justify-content: center;
  }

  :host([data-details-alignment="right"]) .track-options-row {
    justify-content: flex-end;
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
    flex: 1 1
      calc(
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
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: inherit;
    cursor: pointer;
    border-radius: 999px;
    transition:
      background var(--transition-normal),
      transform 0.12s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
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
    background: rgba(255, 255, 255, 0.1);
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

  @media (hover: hover) {
    .modern-button:hover {
      background: rgba(255, 255, 255, 0.25);
    }
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
    background: rgba(0, 0, 0, 0.1);
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
    height: 4px;
    background: rgba(255, 255, 255, 0.22);
    border-radius: var(--progress-radius, 2px);
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }

  .progress-inner {
    height: 100%;
    background: var(--custom-accent);
    border-radius: var(--progress-radius, 3px) 0 0 var(--progress-radius, 3px);
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.24);
  }

  .timestamps-container {
    display: flex;
    justify-content: space-between;
    font-size: var(--timestamp-size, 10px);
    margin-top: -1px;
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.9);
    padding: 0 2px;
  }

  /* Volume controls */
  .volume-row {
    display: grid;
    grid-template-columns: minmax(min-content, 1fr) auto minmax(min-content, 1fr);
    align-items: center;
    padding: 10px 16px 14px 16px;
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

  @media (hover: hover) {
    .volume-icon-btn:hover {
      color: var(--custom-accent);
    }
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
    color: rgba(255, 255, 255, 0.7);
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

  .volume-percentage-indicator {
    position: absolute;
    top: -22px;
    background: var(--custom-accent);
    color: var(--yamp-chip-selected-text);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.72em;
    font-weight: 700;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    white-space: nowrap;
    z-index: ${B.FLOATING_CONTROLS};
    transform: translateX(-50%);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .volume-percentage-indicator::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: var(--custom-accent) transparent transparent transparent;
  }

  .volume-percentage-indicator.visible {
    opacity: 1;
  }

  .vol-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: hsla(0, 0%, 100%, 0.22);
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
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
    background: rgba(255, 255, 255, 0.22);
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
    background: rgba(255, 255, 255, 0.22);
    border-radius: 3px;
  }

  /* Touch device improvements */
  @media (pointer: coarse) {
    .vol-slider::-webkit-slider-thumb {
      box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
    }
    .vol-slider::-moz-range-thumb {
      box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
    }
    .vol-slider::-ms-thumb {
      box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
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

  /* Light mode overrides */
  :host([data-appearance="light"]:not([data-match-theme="true"])) {
    ${rn}
  }

  :host([data-appearance="light"]:not([data-match-theme="true"])) .source-dropdown {
    ${nn}
  }

  @media (prefers-color-scheme: light) {
    :host([data-appearance="automatic"]:not([data-match-theme="true"])) {
      ${rn}
    }

    :host([data-appearance="automatic"]:not([data-match-theme="true"])) .source-dropdown {
      ${nn}
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
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: ${B.FLOATING_ELEMENT};
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
    z-index: ${B.MEDIA_BACKGROUND};
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
    z-index: ${B.MEDIA_OVERLAY};
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      rgba(0, 0, 0, 0.92) 100%
    );
  }

  .card-lower-content {
    position: relative;
    z-index: ${B.FLOATING_ELEMENT};
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-lower-content.transitioning .details,
  .card-lower-content.transitioning .card-artwork-spacer {
    transition: opacity 0.3s;
  }

  .card-lower-content.collapsed.has-artwork .details {
    opacity: 1;
    pointer-events: auto;
    margin-right: var(--yamp-collapsed-details-offset, 120px);
    transition: margin var(--transition-normal);
  }

  @media (max-width: 420px) {
    .card-lower-content.collapsed.has-artwork .details {
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

  :host([data-has-custom-height="true"]) .card-lower-content.collapsed {
    justify-content: center;
  }

  :host([data-has-custom-height="true"])
    .card-lower-content.collapsed
    .card-artwork-spacer:not(.show-placeholder) {
    flex: 0 0 0;
    min-height: 0;
  }

  .collapsed-flex-spacer {
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
  }

  .card-lower-content .source-menu-btn,
  .card-lower-content .source-selected,
  .details,
  .title,
  .artist,
  .controls-row,
  .button,
  .vol-stepper span,
  .vol-label {
    color: #fff;
  }

  /* Scaled Contain Alternate mode - use theme colors since background is transparent */
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .details,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .title,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .artist,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .source-menu-btn,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .source-selected,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .controls-row,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .button,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-stepper span,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-label,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .more-info-btn ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .volume-icon-btn,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .volume-icon-btn ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .radio-mode-button,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .volume-slider-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .timestamps-container {
    color: var(--primary-text);
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button {
    background: color-mix(in srgb, var(--primary-text), transparent 85%);
    box-shadow: none; /* Cleaner look on card background */
  }

  /* Hamburger icon (span) uses !important in base styles, so we override it here */
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .more-info-icon {
    color: var(--primary-text) !important;
  }

  /* Ensure active buttons still use the accent color */
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .button.active,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .button.active ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button.active,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button.active ha-icon {
    color: var(--custom-accent);
  }

  /* Hover effects for primary playback controls using chip color variables (background + text) */
  @media (hover: hover) {
    .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .controls-row .button:hover,
    .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button:hover {
      background: var(--yamp-chip-selected-bg);
      color: var(--yamp-chip-selected-text) !important;
      border-radius: var(--button-border-radius, 8px);
    }
  }

  /* Modern button hover specifically needs 999px radius to stay circular */
  @media (hover: hover) {
    .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button:hover {
      border-radius: 999px;
    }
  }

  @media (hover: hover) {
    .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"]
      .controls-row
      .button:hover
      ha-icon,
    .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button:hover ha-icon {
      color: var(--yamp-chip-selected-text) !important;
    }
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .inset-artwork {
    border-radius: var(--ha-card-border-radius, 12px);
    border: var(--ha-card-border-width, 1px) solid
      var(--ha-card-border-color, var(--divider-color, #e0e0e0));
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-slider,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .progress-bar {
    background: color-mix(in srgb, var(--primary-text), transparent 80%);
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-slider::-webkit-slider-thumb {
    border-color: var(--primary-text);
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-slider::-moz-range-thumb {
    border-color: var(--primary-text);
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: ${B.MEDIA_BACKGROUND};
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(96px, 50%, 184px);
    aspect-ratio: 1;
  }

  .media-artwork-placeholder svg {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.85;
    pointer-events: none;
  }

  /* Collapsed artwork */
  .card-lower-content.collapsed .collapsed-artwork-container {
    position: absolute;
    top: 16px;
    right: 6px;
    width: calc(var(--yamp-collapsed-artwork-size, 102px) + 8px);
    height: calc(100% - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: ${B.FLOATING_ELEMENT};
    background: transparent;
    pointer-events: none;
    box-shadow: none;
    padding: 0;
    transition:
      background var(--transition-slow),
      width var(--transition-normal);
  }

  :host([data-has-custom-height="true"])
    .card-lower-content.collapsed
    .collapsed-artwork-container {
    align-items: center;
    top: 0;
    /* Clearance dynamically accounts for controls-row (~44px) + volume-row (~46px) + padding (~10px) */
    height: calc(100% - var(--yamp-collapsed-artwork-clearance, 100px));
  }

  .card-lower-content.collapsed .collapsed-artwork {
    width: var(--yamp-collapsed-artwork-size, 102px);
    height: var(--yamp-collapsed-artwork-size, 102px);
    border-radius: 16px;
    object-fit: var(--yamp-artwork-fit, cover);
    background: transparent;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.22);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 2px;
    transition:
      width var(--transition-normal),
      height var(--transition-normal);
  }

  .card-lower-content.collapsed.has-artwork .controls-row {
    max-width: calc(100% - var(--yamp-collapsed-controls-offset, 120px));
    margin-right: max(calc(var(--yamp-collapsed-controls-offset, 120px) - 5px), 0px);
    width: auto;
  }

  :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
    max-width: calc(100% - var(--yamp-collapsed-controls-offset, 120px));
    margin-right: max(calc(var(--yamp-collapsed-controls-offset, 120px) - 5px), 0px);
  }

  /* Medium screens */
  @media (max-width: 600px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 115px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 115px) - 5px), 0px);
      width: auto;
    }

    :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 115px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 115px) - 5px), 0px);
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      right: 4px;
      top: 14px;
    }
  }

  /* Small screens */
  @media (max-width: 420px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 90px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 90px) - 5px), 0px);
      width: auto;
    }

    :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 90px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 90px) - 5px), 0px);
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      right: 3px;
      top: 12px;
    }
  }

  /* Very small screens */
  @media (max-width: 320px) {
    .card-lower-content.collapsed.has-artwork .controls-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 80px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 80px) - 5px), 0px);
      width: auto;
    }

    :host([data-has-custom-height="true"]) .card-lower-content.collapsed.has-artwork .volume-row {
      max-width: calc(100% - var(--yamp-collapsed-controls-offset, 80px));
      margin-right: max(calc(var(--yamp-collapsed-controls-offset, 80px) - 5px), 0px);
    }

    .card-lower-content.collapsed .collapsed-artwork-container {
      right: 2px;
      top: 10px;
    }
  }

  /* Collapsed progress bar */
  .collapsed-progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background: var(--custom-accent);
    border-radius: var(--progress-radius, 0) var(--progress-radius, 0) 12px 12px;
    z-index: ${B.ACCENT_FOREGROUND};
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
    z-index: ${B.OVERLAY_BASE};
    background: var(--yamp-overlay-bg);
    backdrop-filter: ${Ui};
    -webkit-backdrop-filter: ${Ui};
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
    ${fe}
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
    ${fe}
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
    background: transparent;
    border-radius: 0;
    border: none;
    flex-shrink: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: ${B.FLOATING_CONTROLS};
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

  .artist,
  .vol-label,
  .vol-value {
    color: rgba(255, 255, 255, 0.75);
    font-weight: 400;
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
    color: var(--yamp-overlay-text);
    font-size: 20px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  @media (hover: hover) {
    .persistent-volume-stepper .stepper-btn:hover {
      color: var(--custom-accent);
    }
  }

  .persistent-volume-stepper .stepper-btn:active {
    transform: scale(0.92);
  }

  .persistent-volume-stepper .stepper-value {
    font-size: 0.95em;
    opacity: 0.85;
    min-width: 48px;
    text-align: center;
    color: var(--yamp-overlay-text);
    padding-left: 6px;
  }

  .entity-options-search-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: var(--yamp-button-bg);
    border: 1px solid var(--yamp-button-border);
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
    color: var(--yamp-overlay-text);
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

  @media (hover: hover) {
    .persistent-control-btn:hover {
      background: var(--custom-accent);
      border-color: var(--custom-accent);
      transform: scale(1.05);
    }
  }

  .persistent-control-btn:active {
    transform: scale(0.95);
  }

  .persistent-control-btn ha-icon {
    font-size: 16px;
    color: inherit;
  }

  .entity-options-sheet {
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
    ${fe}
    font-size: calc(1em * var(--yamp-text-scale-menu, 1));
    position: relative;
    box-sizing: border-box;
    color: var(--yamp-overlay-text);
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
    color: #fff;
    opacity: 0.78;
    pointer-events: none;
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
    z-index: ${B.STICKY_CHIPS};
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
    -webkit-mask-image: none;
    mask-image: none;
  }

  .entity-options-chips-strip .chip {
    /* Uses centralized .chip styling */
  }

  .entity-options-menu.chips-in-menu {
    margin-top: 4px;
  }

  .entity-options-sheet.chips-mode {
    padding-top: 4px;
  }

  .entity-options-sheet {
    ${fe}
  }

  /* Hide scrollbar for group list scroll container */
  .group-list-scroll {
    ${fe}
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

  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .group-list-scroll,
  :host([data-hide-menu-player="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .group-list-scroll {
    margin-bottom: 12px;
    padding-bottom: 0;
  }

  .entity-options-title {
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 18px;
    text-align: center;
    color: var(--yamp-overlay-text);
    background: none;
  }

  .entity-options-item {
    background: none;
    color: var(--yamp-overlay-text);
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 400;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast);
    text-align: center;
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

  @media (hover: hover) {
    .entity-options-item:hover {
      color: var(--custom-accent, #ff9800);
      background: none;
    }
  }

  .entity-options-item.close-item {
    font-weight: 500;
    margin: 1px 0;
    margin-top: 12px;
    padding-top: 4px;
    padding-bottom: 5px;
    display: block;
    width: 100%;
  }

  .entity-options-divider {
    height: 1px;
    background: var(--yamp-overlay-divider);
    margin: 1px 0 8px 0;
    width: 100%;
    display: block;
  }

  /* Ensure Group Players header always shows a single divider */
  .grouping-header {
    width: 100%;
  }

  /* Source index */
  .source-index-letter:focus {
    background: rgba(255, 255, 255, 0.11);
    outline: 1px solid var(--custom-accent);
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
    ${fe}
    width: 100%;
  }

  .source-list-scroll .entity-options-item {
    width: 100%;
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
    z-index: ${B.ACCENT_FOREGROUND};
    padding: 0 8px 0 0;
    overflow-y: auto;
    max-height: calc(100% - 75px);
    min-width: 38px;
    ${fe}
  }

  .entity-options-sheet.chips-mode .floating-source-index {
    top: clamp(72px, 15vh, 120px);
    height: calc(100% - clamp(72px, 15vh, 120px));
  }

  .floating-source-index .source-index-letter {
    background: none;
    border: none;
    color: var(--yamp-overlay-text);
    font-size: 0.9em;
    cursor: pointer;
    margin: 1px 0;
    padding: 0;
    pointer-events: auto;
    outline: none;
    transition:
      color var(--transition-fast),
      background var(--transition-fast),
      transform 0.16s cubic-bezier(0.35, 1.8, 0.4, 1.04);
    transform: scale(1);
    z-index: ${B.MEDIA_OVERLAY};
    min-height: 22px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: ${B.OVERLAY_BASE};
  }

  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: ${B.FLOATING_ELEMENT};
  }

  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.1);
    z-index: ${B.MEDIA_OVERLAY};
  }

  .floating-source-index .source-index-letter::after {
    display: none;
  }

  @media (hover: hover) {
    .floating-source-index .source-index-letter:hover,
    .floating-source-index .source-index-letter:focus {
      color: var(--yamp-overlay-text);
    }
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
    color: var(--yamp-overlay-text);
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

  @media (hover: hover) {
    .group-toggle-transparent:hover {
      background: none;
    }
  }

  /* Force theme-aware text in grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: var(--yamp-overlay-text);
  }

  /* Specific override to ensure selected/hovered chips keep their text color regardless of the global sheet rule above */
  .entity-options-sheet .chip[selected],
  .entity-options-sheet .chip[selected] * {
    color: var(--yamp-chip-selected-text) !important;
  }

  @media (hover: hover) {
    .entity-options-sheet .chip:hover,
    .entity-options-sheet .chip:hover * {
      color: var(--yamp-chip-selected-text) !important;
    }
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

  .yamp-search-result.menu-active > *:not(.search-row-slide-out):not([class$="-overlay"]) {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .yamp-search-result {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid var(--search-border);
    font-size: 1.1em;
    color: var(--primary-text);
    background: none;
    width: 100%;
    box-sizing: border-box;
  }
  .search-row-slide-out {
    position: absolute;
    inset: 0;
    left: 100%;
    background: var(--search-overlay-bg);
    backdrop-filter: ${tn};
    -webkit-backdrop-filter: ${tn};
    z-index: ${B.SEARCH_SLIDE_OUT};
    display: flex;
    align-items: center;
    padding: 0 8px;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 15px 0 0 15px;
    overflow-x: auto;
    ${fe}
    gap: 4px;
  }

  .search-row-slide-out.active {
    left: 0;
  }

  .search-row-success-overlay,
  .search-row-loading-overlay,
  .search-row-error-overlay {
    position: absolute;
    inset: 0;
    background: var(--search-overlay-bg);
    backdrop-filter: ${an};
    -webkit-backdrop-filter: ${an};
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--yamp-overlay-text);
    font-weight: 600;
    font-size: 0.95em;
    z-index: ${B.SEARCH_SUCCESS};
    border-radius: inherit;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
    animation: success-fade-in 0.3s ease;
  }

  .search-row-error-overlay {
    background: var(--search-error-bg);
  }

  .search-row-success-overlay span:first-child,
  .search-row-loading-overlay ha-icon,
  .search-row-error-overlay ha-icon {
    font-size: 1.5em;
  }

  .search-row-loading-overlay ha-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes success-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .slide-out-button {
    flex: 0 0 auto;
    background: transparent;
    border: none;
    color: var(--yamp-overlay-text);
    padding: 6px 10px;
    border-radius: 18px;
    cursor: pointer;
    font-size: 0.88em;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Redundant .chip removed - now uses base styling at line 571 */
  .slide-out-button {
    transition:
      background 0.2s,
      color 0.2s;
  }

  @media (hover: hover) {
    .slide-out-button:hover {
      background: var(--custom-accent);
      color: #fff;
    }
  }

  .slide-out-button ha-icon {
    width: 18px;
    height: 18px;
    color: inherit;
    --mdc-icon-color: currentColor;
    --icon-color: currentColor;
    --paper-item-icon-color: currentColor;
    --ha-icon-color: currentColor;
    fill: currentColor;
  }

  .slide-out-close {
    margin-left: auto;
    color: var(--yamp-overlay-text);
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (hover: hover) {
    .slide-out-close:hover {
      color: var(--custom-accent);
    }
  }

  .yamp-search-result:last-child {
    border-bottom: none;
  }

  .yamp-search-result.placeholder {
    visibility: hidden;
    border-bottom: 1px solid transparent;
    min-height: 46px;
    box-sizing: border-box;
  }

  .yamp-search-result-thumb {
    height: 38px;
    width: 38px;
    border-radius: var(--button-border-radius);
    object-fit: var(--yamp-artwork-fit, cover);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.16);
    margin-right: 12px;
  }

  .entity-options-search-buttons {
    display: flex;
    gap: 4px;
    margin-left: 7px;
    align-items: center;
  }

  .entity-options-search-play,
  .entity-options-search-queue,
  .queue-btn {
    min-width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: var(--yamp-overlay-text);
    border-radius: 8px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    box-shadow: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  .entity-options-search-play ha-icon,
  .entity-options-search-queue ha-icon,
  .queue-btn ha-icon {
    width: 24px;
    height: 24px;
    --mdc-icon-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (hover: hover) {
    .entity-options-search-play:hover,
    .entity-options-search-play:focus {
      background: transparent;
      color: var(--custom-accent) !important;
      opacity: 0.8;
    }
  }

  .entity-options-search-queue {
    color: var(--yamp-overlay-text-secondary);
  }

  @media (hover: hover) {
    .entity-options-search-queue:hover,
    .entity-options-search-queue:focus {
      background: transparent;
      border: none;
      color: var(--custom-accent);
      opacity: 0.8;
    }
  }

  /* Queue control buttons */
  .queue-controls {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-right: 0;
  }

  .queue-drag-handle {
    cursor: grab;
    opacity: 0.6;
  }

  .queue-drag-handle:active {
    cursor: grabbing;
  }

  @media (hover: hover) {
    .queue-drag-handle:hover {
      opacity: 1;
      color: var(--custom-accent);
    }
  }

  @media (hover: hover) {
    .queue-btn-up:hover,
    .queue-btn-up:focus {
      background: transparent;
      color: var(--yamp-success-color);
    }
  }

  @media (hover: hover) {
    .queue-btn-down:hover,
    .queue-btn-down:focus {
      background: transparent;
      color: var(--yamp-success-color);
    }
  }

  @media (hover: hover) {
    .queue-btn-next:hover,
    .queue-btn-next:focus {
      background: transparent;
      color: var(--custom-accent);
    }
  }

  @media (hover: hover) {
    .queue-btn-remove:hover,
    .queue-btn-remove:focus {
      background: transparent;
      color: var(--yamp-error-color);
    }
  }

  /* Visual feedback for moved queue items */
  .yamp-search-result.just-moved {
    background: var(--yamp-success-bg-light);
    border-left: 3px solid var(--yamp-success-color);
    animation: queueMoveHighlight 1s ease-out;
  }

  @keyframes queueMoveHighlight {
    0% {
      background: var(--yamp-success-bg-medium);
      transform: scale(1.02);
    }
    100% {
      background: var(--yamp-success-bg-light);
      transform: scale(1);
    }
  }

  .entity-options-search-input {
    border: 1px solid var(--search-border);
    border-radius: var(--button-border-radius);
    background: var(--search-input-bg);
    color: var(--search-input-text);
    font-size: 1.12em;
    outline: none;
    transition: border var(--transition-fast);
    margin-right: 7px;
    box-sizing: border-box;
  }

  .entity-options-search-row .entity-options-search-input {
    padding: 4px 34px 4px 10px; /* Increased right padding for clear button */
    height: 32px;
    min-height: 32px;
    line-height: 1.18;
    box-sizing: border-box;
    border: 1.5px solid var(--custom-accent);
    background: var(--search-input-bg);
    color: var(--search-input-text);
    transition:
      border var(--transition-fast),
      background var(--transition-fast);
    outline: none;
    width: 100%;
  }

  .search-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .search-input-clear {
    position: absolute;
    right: 18px; /* Adjusted to 18px for better balance */
    top: 50%;
    transform: translateY(-68%); /* Adjusted to -68% to fix "too high" issue */
    background: none;
    border: none;
    color: var(--yamp-overlay-text-secondary);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-fast);
    z-index: 2;
  }

  @media (hover: hover) {
    .search-input-clear:hover {
      color: var(--custom-accent);
    }
  }

  .search-input-clear ha-icon {
    width: 16px; /* Slightly smaller icon (was 18px) */
    height: 16px;
  }

  .entity-options-search-input:focus {
    border: 1.5px solid var(--custom-accent);
    background: var(--search-input-bg);
    color: var(--search-input-text);
    outline: none;
  }

  .entity-options-search-loading,
  .entity-options-search-error,
  .entity-options-search-empty {
    padding: 8px 6px;
    font-size: 1.09em;
    opacity: 0.9;
    color: var(--primary-text);
    background: none;
    text-align: left;
  }

  .entity-options-search-loading {
    color: var(--yamp-overlay-text);
  }

  .entity-options-search-error {
    color: var(--yamp-error-color);
    font-weight: 500;
  }

  .entity-options-search-empty {
    color: var(--yamp-overlay-text-secondary);
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
    width: 72px;
    justify-content: center;
  }

  .search-filter-chips .chip[selected] {
    background: var(--yamp-chip-selected-bg) !important;
    color: var(--yamp-chip-selected-text) !important;
    font-weight: bold;
    opacity: 1;
  }

  .entity-options-sheet .search-filter-chips .chip {
    justify-content: center;
  }

  @media (hover: hover) {
    .entity-options-sheet .search-filter-chips .chip:hover {
      background: var(--custom-accent) !important;
      color: var(--yamp-chip-selected-text) !important;
      opacity: 1;
    }
  }

  .entity-options-sheet .entity-options-search-results {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    margin: 12px 0;
    padding-bottom: 0px;
    /* Hide scrollbars */
    ${fe}
  }

  /* Search layout */
  .search-results-count {
    margin-left: auto;
    padding-left: 0px;
    padding-right: 15px;
    font-size: 0.85em;
    font-style: italic;
    color: var(--yamp-overlay-text-secondary);
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

  .search-sub-filters .button {
    background: none;
    transition: all 0.2s ease;
    color: var(--yamp-overlay-text);
  }

  .search-sub-filters .button ha-icon {
    color: var(--yamp-icon-color);
    transition: color 0.2s ease;
  }

  @media (hover: hover) {
    .search-sub-filters .button:hover {
      color: var(--custom-accent) !important;
      opacity: 1 !important;
    }
  }

  .search-sub-filters .button.active {
    color: var(--custom-accent) !important;
    opacity: 1 !important;
  }

  .search-sub-filters .button.active ha-icon {
    color: var(--custom-accent) !important;
  }

  @media (hover: hover) {
    .search-sub-filters .radio-mode-button:hover {
      color: var(--custom-accent);
    }
  }

  .entity-options-sheet[data-pin-search-headers="true"] {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 0px;
  }

  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding-bottom: 0px;
  }

  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-scroll {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Unified Header and Scroll Containers for Menu Sheets */
  .entity-options-header {
    flex: 0 0 auto;
    position: relative;
    z-index: 10;
    padding-top: 12px;
  }

  /* When pinning is active, the header is sticky and seamless */
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-header {
    position: sticky;
    top: 0;
    background: none;
  }

  /* The scrollable area for all menus */
  .entity-options-scroll {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    ${fe}
  }

  /* Reserved space for persistent media controls when pinning is active */
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-scroll,
  .entity-options-sheet[data-pin-search-headers="true"] .entity-options-search,
  .entity-options-sheet[data-pin-search-headers="true"] .group-list-scroll {
    margin-bottom: 80px;
    padding-bottom: 0px;
    background: none;
  }

  /* Adjust spacing when persistent controls are hidden */
  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet[data-pin-search-headers="true"],
  :host([data-hide-menu-player="true"]) .entity-options-sheet[data-pin-search-headers="true"] {
    padding-bottom: 12px;
  }

  /* Clean up legacy margin override rules since we now use padding on parent */
  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .entity-options-scroll,
  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .entity-options-search,
  :host([data-hide-persistent-controls="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .group-list-scroll,
  :host([data-hide-menu-player="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .entity-options-scroll,
  :host([data-hide-menu-player="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .entity-options-search,
  :host([data-hide-menu-player="true"])
    .entity-options-sheet[data-pin-search-headers="true"]
    .group-list-scroll {
    margin-bottom: 0px;
  }
  /* Hide scrollbars for Webkit browsers (Chrome, Safari, etc.) */

  .entity-options-resolved-entities {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .entity-options-resolved-entities-list {
    flex: 1;
    overflow-y: auto;
    margin: 12px 0;
    /* Hide scrollbars */
    ${fe}
  }

  .entity-options-resolved-entities .entity-options-search-input {
    flex: 1;
    background: var(--search-input-bg);
    color: var(--search-input-text);
    border: 1px solid var(--search-border);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 1em;
    outline: none;
  }
  .entity-options-resolved-entities .entity-options-item {
    background: none;
    color: var(--yamp-overlay-text);
    border: none;
    border-radius: 10px;
    font-size: 1.12em;
    font-weight: 400;
    margin: 4px 0;
    padding: 6px 0 8px 0;
    cursor: pointer;
    transition: color var(--transition-fast);
    text-align: left;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media (hover: hover) {
    .entity-options-resolved-entities .entity-options-item:hover,
    .entity-options-resolved-entities .entity-options-item:focus {
      color: var(--custom-accent);
      background: none;
    }
  }

  .entity-options-resolved-entities .entity-options-item:last-child {
    border-bottom: none;
  }

  /* Clickable artist */
  .clickable-artist {
    cursor: pointer;
  }

  @media (hover: hover) {
    .clickable-artist:hover {
      text-decoration: underline;
    }
  }

  /* Clickable search results */
  .clickable-search-result {
    cursor: pointer;
    transition: color var(--transition-fast);
  }

  @media (hover: hover) {
    .clickable-search-result:hover {
      text-decoration: underline;
      color: var(--yamp-overlay-text);
    }
  }

  /* Search breadcrumb */
  .entity-options-search-breadcrumb {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--search-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .entity-options-search-breadcrumb-text {
    font-size: 0.9em;
    color: var(--yamp-overlay-text);
    font-style: italic;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entity-options-search-breadcrumb-play {
    background: none;
    border: none;
    color: var(--custom-accent);
    padding: 0;
    width: 32px;
    height: 32px;
    margin-left: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition:
      background-color 0.2s,
      color 0.2s;
    flex-shrink: 0;
  }

  @media (hover: hover) {
    .entity-options-search-breadcrumb-play:hover {
      background-color: var(--custom-accent);
      color: var(--yamp-overlay-text);
    }
  }

  .entity-options-search-breadcrumb-play ha-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Search sheet styles */
  .search-sheet {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--search-overlay-bg);
    z-index: ${B.MODAL_BACKDROP};
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
    background: var(--search-input-bg);
    color: var(--search-input-text);
    font-size: 16px;
  }

  .search-sheet-header button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: var(--custom-accent);
    color: var(--yamp-overlay-text);
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
    color: var(--yamp-chip-text);
    font-size: 18px;
  }

  .search-sheet-error {
    color: var(--search-error);
  }

  .priority-toast-success {
    color: var(--search-success-text);
    font-weight: 600;
    background: var(--search-success-bg);
    border: 2px solid var(--search-success);
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    font-size: 20px;
    animation: fadeInOut 3s ease-in-out;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: ${B.MODAL_TOAST};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    min-width: 200px;
    text-align: center;
    pointer-events: none;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    10% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    90% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
  }

  .search-sheet-results {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /* Hide scrollbars */
    ${fe}
  }

  .entity-options-sheet:not([data-pin-search-headers="true"]) .search-sheet-results,
  .entity-options-sheet:not([data-pin-search-headers="true"]) .entity-options-search-results {
    overflow-y: visible;
  }

  .queue-sortable-container.is-card-layout {
    display: grid;
    grid-template-columns: repeat(var(--search-card-columns, 4), 1fr);
    gap: 12px;
    padding: 12px;
  }

  .queue-sortable-container.is-card-layout .queue-drag-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .queue-sortable-container.is-card-layout .yamp-search-result.search-result-card {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .yamp-search-result.search-result-card {
    flex-direction: column;
    padding: 8px;
    border-bottom: none;
    border-radius: 12px;
    background: var(--search-card-bg);
    box-shadow: var(
      --chip-box-shadow,
      var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none))
    );
    align-items: center;
    gap: 8px;
    height: min-content;
    position: relative;
    overflow: hidden;
  }

  .search-result-card.minimal {
    background: none !important;
    padding: 0;
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

  @media (hover: hover) {
    .card-menu-button:hover {
      opacity: 1;
    }
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
    background: var(--search-overlay-bg);
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

  @media (hover: hover) {
    .search-sheet-results .yamp-search-result:not(.search-result-card):hover {
      background: var(--search-hover-bg);
    }
  }

  .yamp-search-result-thumb-placeholder {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    object-fit: var(--yamp-artwork-fit, cover);
    margin-right: 12px;
  }

  .search-result-card .yamp-search-result-thumb,
  .search-result-card .yamp-search-result-thumb-placeholder {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    margin-right: 0;
  }

  .yamp-search-result-thumb-placeholder {
    background: var(--search-thumb-placeholder-bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-sheet-thumb-container {
    position: relative;
    width: auto;
    flex-shrink: 0;
    padding-left: 5px;
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
    background: var(--search-overlay-bg);
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 8px;
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

  .yamp-search-result-thumb-placeholder ha-icon {
    color: var(--search-thumb-placeholder-icon);
    font-size: 16px;
  }

  .yamp-search-result-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .search-result-card .yamp-search-result-info {
    text-align: center;
    width: 100%;
    display: block; /* Original card behavior */
  }

  .yamp-search-result-title {
    flex: 1;
    color: var(--primary-text);
    font-size: 0.9em;
    font-weight: 500;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .yamp-search-result-subtitle {
    display: block;
    color: var(--search-text-secondary);
    font-size: 0.9em;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .yamp-search-result:not(.search-result-card) .yamp-search-result-subtitle {
    font-size: 0.86em;
    line-height: 1.16;
  }

  .search-result-card .yamp-search-result-info {
    text-align: center;
    width: 100%;
  }

  .search-result-card .yamp-search-result-title {
    text-align: center;
    width: 100%;
    /* 2-line clamping with word-level breaks */
    ${sn}
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 14px;
    line-height: 1.3;
    min-height: 2.6em; /* Reserve space for 2 lines to keep all cards uniform */
  }

  .search-result-card .yamp-search-result-subtitle {
    text-align: center;
    width: 100%;
    /* 2-line clamping with word-level breaks */
    ${sn}
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 0.85em;
    line-height: 1.3;
    min-height: 2.6em; /* Reserve space for 2 lines to keep all cards uniform */
  }

  .yamp-search-result.clickable {
    cursor: pointer;
  }

  .yamp-search-result-title.clickable-search-result,
  .yamp-search-result-subtitle.clickable-search-result {
    text-decoration: none;
  }

  @media (hover: hover) {
    .yamp-search-result-title.clickable-search-result:hover,
    .yamp-search-result-subtitle.clickable-search-result:hover {
      text-decoration: underline;
    }
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
    color: var(--yamp-overlay-text);
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

  @media (hover: hover) {
    .search-sheet-play:hover,
    .search-sheet-queue:hover {
      background: var(--search-play-hover);
    }
  }

  .search-sheet-queue {
    background: var(--search-queue-bg);
    border: 1px solid var(--search-queue-border);
  }

  @media (hover: hover) {
    .search-sheet-queue:hover {
      background: var(--search-queue-hover);
      border-color: var(--search-queue-hover-border);
    }
  }

  /* Override styles when match_theme is false - force default colors */
  .search-sheet[data-match-theme="false"] {
    background: var(--yamp-overlay-bg);

    /* Define CSS custom properties directly on the search sheet when match_theme is false */
    --search-overlay-bg: var(--yamp-overlay-bg);
    --search-input-bg: #333;
    --search-input-text: #fff;
    --search-text: #fff;
    --search-text-secondary: #bbb;
    --search-error: #ff6b6b;
    --search-error-bg: rgba(244, 67, 54, 0.8);
    --search-success: #4caf50;
    --search-success-text: #fff;
    --search-success-bg: rgba(76, 175, 80, 0.95);
    --search-border: rgba(255, 255, 255, 0.1);
    --search-hover-bg: rgba(255, 255, 255, 0.1);
    --search-play-hover: #e68900;
    --search-queue-bg: #4a4a4a;
    --search-queue-border: #666;
    --search-queue-hover: #5a5a5a;
    --search-queue-hover-border: #777;
    --search-card-bg: rgba(255, 255, 255, 0.05);
    --search-thumb-placeholder-bg: rgba(255, 255, 255, 0.1);
    --search-thumb-placeholder-icon: rgba(255, 255, 255, 0.6);
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header input {
    background: #333;
    color: #fff;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-header button {
    background: #ff9800;
    color: #fff;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-loading,
  .search-sheet[data-match-theme="false"] .search-sheet-error,
  .search-sheet[data-match-theme="false"] .search-sheet-success,
  .search-sheet[data-match-theme="false"] .search-sheet-empty {
    color: #fff;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-error {
    color: #ff6b6b;
  }

  .search-sheet[data-match-theme="false"] .search-sheet-success {
    color: #4caf50;
    background: rgba(76, 175, 80, 0.95);
    border: 2px solid #4caf50;
  }

  .search-sheet[data-match-theme="false"] .yamp-search-result {
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (hover: hover) {
    .search-sheet[data-match-theme="false"] .yamp-search-result:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .search-sheet[data-match-theme="false"] .search-sheet-play {
    background: var(--custom-accent);
    color: #fff;
  }

  .search-sheet-buttons .search-sheet-queue {
    color: var(--yamp-overlay-text);
  }

  .search-sheet[data-match-theme="false"] *[style*="background"] {
    background: rgba(0, 0, 0, 0.8);
  }

  /* Force override any CSS custom properties that might be inherited */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800;
    --accent-color: #ff9800;
    --primary-color: #ff9800;
    --ha-accent-color: #ff9800;
  }

  /* Also redefine --custom-accent locally in the search sheet, just like entity-options-resolved-entities does */
  .search-sheet[data-match-theme="false"] {
    --custom-accent: #ff9800;
  }

  /* Also override at the root level when match_theme is false */
  yet-another-media-player[data-match-theme="false"] {
    --custom-accent: #ff9800;
    --accent-color: #ff9800;
    --primary-color: #ff9800;
    --ha-accent-color: #ff9800;
  }

  /* Override any elements that might be using CSS custom properties */
  .search-sheet[data-match-theme="false"] .search-sheet-play,
  .search-sheet[data-match-theme="false"] .search-sheet-header button,
  .search-sheet[data-match-theme="false"] *[style*="background: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="background: var(--primary-color)"] {
    background: #ff9800;
    color: #fff;
  }

  /* Override any elements that might be using CSS custom properties for color */
  .search-sheet[data-match-theme="false"] *[style*="color: var(--custom-accent)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--accent-color)"],
  .search-sheet[data-match-theme="false"] *[style*="color: var(--primary-color)"] {
    color: #ff9800;
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
    z-index: ${B.FLOATING_ELEMENT};
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
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
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
    background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
    animation: gestureDoubleTapRipple 0.5s ease-out forwards;
  }

  /* Hold: Slower glowing pulse */
  @keyframes gestureHoldPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.2);
      opacity: 0;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    30% {
      opacity: 0.5;
      box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.2);
    }
    100% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0;
      box-shadow: 0 0 40px 20px rgba(255, 255, 255, 0);
    }
  }

  .gesture-ripple.hold {
    width: 100px;
    height: 100px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.2) 40%,
      rgba(255, 255, 255, 0) 70%
    );
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
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.8) 100%
    );
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
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.8) 100%
    );
    animation: gestureSwipeRight 0.35s ease-out forwards;
    transform-origin: left center;
  }
  /* Consolidated scrollbar hiding for Webkit browsers */
  .chip-row::-webkit-scrollbar,
  .action-chip-row::-webkit-scrollbar,
  .entity-options-container::-webkit-scrollbar,
  .entity-options-chips-strip::-webkit-scrollbar,
  .entity-options-sheet::-webkit-scrollbar,
  .group-list-scroll::-webkit-scrollbar,
  .source-list-scroll::-webkit-scrollbar,
  .floating-source-index::-webkit-scrollbar,
  .search-row-slide-out::-webkit-scrollbar,
  .entity-options-scroll::-webkit-scrollbar,
  .entity-options-sheet .entity-options-search-results::-webkit-scrollbar,
  .entity-options-resolved-entities-list::-webkit-scrollbar,
  .search-sheet-results::-webkit-scrollbar,
  .lyrics-scroll-container::-webkit-scrollbar {
    display: none;
  }

  /* Volume Overlay styles */
  .volume-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--volume-overlay-bg, rgba(0, 0, 0, 0.45));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 12px;
    color: var(--volume-overlay-color, #ffffff);
    animation: volume-overlay-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: auto;
    box-sizing: border-box;
    padding: 16px;
    text-align: center;
    position: absolute;
    inset: 0;
    z-index: ${B.VOLUME_OVERLAY};
  }

  .volume-overlay ha-icon {
    --mdc-icon-size: clamp(48px, 12cqw, 96px);
    margin-bottom: clamp(8px, 2cqw, 16px);
    color: var(--custom-accent, var(--accent-color, #ff9800));
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    animation: volume-icon-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .volume-overlay-text {
    font-size: clamp(3.2rem, 15cqw, 7.5rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -1px;
    font-family: var(--yamp-font-family, Roboto, -apple-system, sans-serif);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  @keyframes volume-overlay-in {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes volume-icon-pop {
    0% {
      transform: scale(0.7);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Volume Overlay in Collapsed Mode */
  .collapsed .volume-overlay {
    flex-direction: row;
    gap: 12px;
    padding: 8px 16px;
    background: var(--volume-overlay-collapsed-bg, rgba(0, 0, 0, 0.65));
  }

  .collapsed .volume-overlay ha-icon {
    --mdc-icon-size: clamp(28px, 6cqw, 36px);
    margin-bottom: 0;
  }

  .collapsed .volume-overlay-text {
    font-size: clamp(1.6rem, 8cqw, 2.5rem);
  }
`,Dc=Me`
  :host {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -1px;
    z-index: ${B.LYRICS_OVERLAY};
    overflow: hidden;
    pointer-events: auto;
    backdrop-filter: ${Ui};
    -webkit-backdrop-filter: ${Ui};
    color: var(--yamp-lyrics-color, var(--yamp-overlay-text, #fff));
  }

  :host([data-artwork-fit="scaled-contain-alternate"]) {
    background: var(--yamp-lyrics-bg, var(--yamp-overlay-bg, rgba(0, 0, 0, 0.82)));
  }

  :host(:not([data-artwork-fit="scaled-contain-alternate"])) {
    background: var(--yamp-lyrics-bg, rgba(0, 0, 0, 0.3));
    color: #fff;
    mask-image: var(--yamp-lyrics-mask, ${en});
    -webkit-mask-image: var(--yamp-lyrics-mask, ${en});
  }

  .lyrics-scroll-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 12px;
    padding-right: 12px;
    scroll-behavior: smooth;
    ${fe}
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .scroll-spacer {
    flex: 0 0 50%;
    width: 100%;
    min-height: 50%;
    pointer-events: none;
  }

  .lyric-line {
    font-size: var(--yamp-lyrics-font-size, 1.6rem);
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 24px;
    opacity: 0.3;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    cursor: default;
    pointer-events: none;
    color: inherit;
    width: 100%;
    max-width: 95%;
    filter: blur(1px);
    text-align: center;
  }

  .lyric-line.active {
    opacity: 1;
    filter: blur(0);
    color: var(--yamp-lyrics-active-color, inherit);
    font-size: var(--yamp-lyrics-active-font-size, var(--yamp-lyrics-font-size, 1.6rem));
    text-shadow: var(--yamp-overlay-text-shadow, none);
  }

  .lyric-line.scroll-mode {
    opacity: 1;
    filter: none;
    transform: none;
    margin-bottom: 18px;
  }

  .lyric-line.unsynced {
    font-size: var(--yamp-lyrics-unsynced-font-size, 1.1rem);
    opacity: 0.8;
    margin-bottom: 12px;
    filter: none;
  }

  .lyrics-loading,
  .lyrics-error,
  .lyrics-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
    color: var(
      --yamp-lyrics-status-color,
      var(--yamp-overlay-text-secondary, rgba(255, 255, 255, 0.8))
    );
    background: transparent;
    border-radius: inherit;
  }

  .lyrics-loading ha-circular-progress {
    margin-bottom: 12px;
    --md-sys-color-primary: var(--yamp-overlay-text, white);
  }

  .lyrics-error ha-icon,
  .lyrics-empty ha-icon {
    --mdc-icon-size: 40px;
    margin-bottom: 12px;
    opacity: 0.6;
  }

  /* Compact mode overrides for constrained heights */
  .yamp-card-inner.compact-collapsed .chip-row {
    padding-top: 0;
    padding-bottom: 4px;
  }
  .yamp-card-inner.compact-collapsed .action-chip-row {
    padding-bottom: 0;
    margin-bottom: -12px;
  }
  .yamp-card-inner.compact-collapsed .details {
    padding-left: 12px;
    padding-right: 12px;
    padding-bottom: 2px;
    margin-top: -12px;
    min-height: 0;
    gap: 1px;
  }
  .yamp-card-inner.compact-collapsed .controls-row {
    padding-top: 1px;
    padding-bottom: 1px;
    gap: 4px;
  }
  .yamp-card-inner.compact-collapsed .volume-row {
    padding-bottom: 4px;
  }
  .yamp-card-inner.compact-collapsed .collapsed-artwork-container {
    top: -12px;
  }

  .yamp-card-inner.compact-collapsed .modern-button.primary {
    width: 52px;
    height: 52px;
  }
  .yamp-card-inner.compact-collapsed .modern-button.medium {
    width: 38px;
    height: 38px;
  }
  .yamp-card-inner.compact-collapsed .modern-button.small {
    width: 34px;
    height: 34px;
  }

  .queue-ops-progress {
    background: var(--yamp-chip-bg, rgba(255, 255, 255, 0.15));
    color: var(--search-text-secondary, #666);
    border-radius: 10px;
    padding: 3px 8px;
    font-size: 10.5px;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    animation: queueOpsFadeIn 0.2s ease-out forwards;
  }
  @keyframes queueOpsFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.95;
    }
  }

  /* Drag and drop upcoming queue styles */
  .queue-drag-wrapper {
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
    overflow: visible;
  }

  .queue-drop-indicator {
    display: none;
  }

  .queue-drag-clone {
    border-radius: 12px;
    overflow: hidden;
  }

  /* Positioning is set inline in yamp-queue-drag.js */
  .queue-play-next-dropzone {
    transition:
      background 0.2s ease,
      border 0.2s ease,
      box-shadow 0.2s ease;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  @keyframes dropzoneFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .queue-play-next-dropzone .dropzone-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .queue-play-next-dropzone ha-icon {
    color: var(--custom-accent, var(--accent-color, #ff9800));
  }
`,Fc=i=>class extends i{_findScrollParent(e){let t=e.parentElement;for(;t;){const a=window.getComputedStyle(t)?.overflowY;if(a==="auto"||a==="scroll")return t;!t.parentElement&&t.getRootNode&&t.getRootNode().host?t=t.getRootNode().host:t=t.parentElement}return null}_applyQueueDragVisuals(e,t,a){const s=this.renderRoot.querySelector(".queue-sortable-container");if(!s)return;const r=s.classList.contains("is-card-layout"),n=s.querySelectorAll(".queue-drag-wrapper");for(const o of n){const l=parseInt(o.dataset.queueIdx,10);if(!isNaN(l)){if(l===e){o.style.opacity="0",o.style.pointerEvents="none",r&&(o.style.order=a!==null?a:l);continue}if(r){o.style.transform="";let c=l;a!==null&&(e<a&&l>e&&l<=a?c=l-1:e>a&&l>=a&&l<e&&(c=l+1)),o.style.order=c}else o.style.order="",a===null?o.style.transform="":e<a?l>e&&l<=a?o.style.transform=`translateY(${-t}px)`:o.style.transform="":l>=a&&l<e?o.style.transform=`translateY(${t}px)`:o.style.transform=""}}}_clearQueueDragVisuals(){const e=this.renderRoot.querySelector(".queue-sortable-container");if(!e)return;const t=e.querySelectorAll(".queue-drag-wrapper");for(const a of t)a.style.transform="",a.style.maxHeight="",a.style.overflow="",a.style.margin="",a.style.padding="",a.style.opacity="",a.style.pointerEvents="",a.style.order=""}_onQueueDragStart(e){if((this.config?.queue_controls_style||"drag_handle")==="drag_handle"){if(!e.target.closest||!e.target.closest(".queue-drag-handle"))return}else return;const t=e.target.closest(".queue-drag-wrapper");if(!t)return;const a=parseInt(t.dataset.queueIdx,10);if(isNaN(a))return;this._activeDragCleanup&&this._activeDragCleanup(),e.stopPropagation();const s=e.clientY,r=e.clientX;let n=null,o=!1,l=null,c=0,d=0,h=null,p=0,_=null,m=null,f=null,y=null,b=null,k=!1,E=s,w=r,P=null,$=null,C=0;const N=e.pointerType==="touch"||e.pointerType==="pen",j=N?300:null;let F=0;const I=(G,W)=>{if(!$)return;if(m)if(k){m._isActive||(m._isActive=!0,m.style.background="rgba(76, 175, 80, 0.4)",m.style.borderColor="#4caf50",m.style.borderStyle="solid",y&&(y.style.color="#4caf50"),b&&(b.style.color="#4caf50")),P!==0&&(P=0,this._queueDropTargetIdx=0,this._applyQueueDragVisuals(a,F,0));return}else m._isActive&&(m._isActive=!1,m.style.background="var(--ha-card-background, var(--card-background-color, #1c1c1c))",m.style.borderColor="var(--custom-accent, var(--accent-color, #ff9800))",m.style.borderStyle="dashed",y&&(y.style.color=""),b&&(b.style.color=""));const Y=h?h.scrollTop-C:0;let X=null,ie=1/0;for(const Ge of $){if(Ge.idx===a)continue;const $e=Ge.midY-Y,bt=G-Ge.midX,ze=W-$e,ue=Math.sqrt(bt*bt+ze*ze);ue<ie&&(ie=ue,X=Ge.idx)}X!==null&&X!==P&&(P=X,this._queueDropTargetIdx=X,this._applyQueueDragVisuals(a,F,X))},O=()=>{!o||!h||(p!==0&&(h.scrollTop+=p,I(w,E)),_=requestAnimationFrame(O))},R=()=>{o=!0,this._isDragging=!0,this._queueDragIdx=a,this._queueDropTargetIdx=null,P=null;const G=t.getBoundingClientRect();F=G.height;const W=this.renderRoot.querySelector(".queue-sortable-container");if(W){W.style.setProperty("--queue-drag-item-h",`${G.height}px`),W.style.touchAction="none",h=this._findScrollParent(W),h&&(_=requestAnimationFrame(O),C=h.scrollTop);const X=W.querySelectorAll(".queue-drag-wrapper > .yamp-search-result");$=[];for(const $e of X){const bt=$e.parentElement,ze=parseInt(bt.dataset.queueIdx,10);if(!isNaN(ze)){const ue=$e.getBoundingClientRect();$.push({idx:ze,midX:ue.left+ue.width/2,midY:ue.top+ue.height/2})}}m=document.createElement("div"),m.className="queue-play-next-dropzone",m.innerHTML=`
            <div class="dropzone-content">
              <ha-icon icon="mdi:playlist-play"></ha-icon>
              <span>${u("search.play_next")}</span>
            </div>
          `;const ie=this.getBoundingClientRect(),Ge=Math.max(56,Math.round(ie.height*.1));m.style.cssText=`
            position: fixed;
            top: ${ie.top}px;
            left: ${ie.left}px;
            width: ${ie.width}px;
            height: ${Ge}px;
            z-index: 99998;
            pointer-events: auto;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 2px dashed var(--custom-accent, var(--accent-color, #ff9800));
            border-radius: var(--border-radius, 16px) var(--border-radius, 16px) 0 0;
            opacity: 0.95;
          `,this.renderRoot.appendChild(m),f=m.getBoundingClientRect(),y=m.querySelector(".dropzone-content"),b=m.querySelector("ha-icon")}this._applyQueueDragVisuals(a,F,null);const Y=t.querySelector(".yamp-search-result");if(Y){const X=Y.getBoundingClientRect();c=s-X.top,d=r-X.left,l=Y.cloneNode(!0),l.classList.add("queue-drag-clone"),l.style.cssText=`
            position: fixed;
            left: ${X.left}px;
            top: ${X.top}px;
            width: ${X.width}px;
            height: ${X.height}px;
            z-index: 99999;
            pointer-events: none;
            transform: scale(1.03);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
            background: var(--card-background-color, #1c1c1c);
            border: 1px solid var(--custom-accent, #ff9800);
            border-radius: 12px;
            opacity: 0.95;
            transition: transform 0.1s ease;
            will-change: top;
          `,this.renderRoot.appendChild(l)}};j!==null&&(n=setTimeout(R,j));const D=G=>{if(G.stopPropagation(),!o){const W=Math.abs(G.clientY-s);N?W>10&&(n&&(clearTimeout(n),n=null),oe()):W>5&&R();return}if(G.preventDefault(),E=G.clientY,w=G.clientX,k=!1,f&&E>=f.top&&E<=f.bottom&&w>=f.left&&w<=f.right&&(k=!0),l&&(l.style.top=`${E-c}px`,l.style.left=`${w-d}px`),h)if(k)p=0;else{const W=h.getBoundingClientRect(),Y=E-W.top,X=W.bottom-E,ie=60;Y<ie&&Y>-50?p=-Math.max(2,(ie-Y)*.3):X<ie&&X>-50?p=Math.max(2,(ie-X)*.3):p=0}I(w,E)},ne=G=>{if(G.stopPropagation(),n&&(clearTimeout(n),n=null),o){const W=Date.now();if(this._dragClickCaptureFn&&window.removeEventListener("click",this._dragClickCaptureFn,!0),this._dragClickCaptureTimeout&&clearTimeout(this._dragClickCaptureTimeout),this._dragClickCaptureFn=Y=>{Date.now()-W<200&&(Y.stopPropagation(),Y.preventDefault()),window.removeEventListener("click",this._dragClickCaptureFn,!0),this._dragClickCaptureFn=null},window.addEventListener("click",this._dragClickCaptureFn,!0),this._dragClickCaptureTimeout=setTimeout(()=>{this._dragClickCaptureFn&&(window.removeEventListener("click",this._dragClickCaptureFn,!0),this._dragClickCaptureFn=null)},1e3),this._clearQueueDragVisuals(),P!==null&&P!==a){const Y=P;this._queueDragIdx=null,this._queueDropTargetIdx=null,this._isDragging=!1,this._onQueueItemMoved({detail:{oldIndex:a,newIndex:Y}})}else this._queueDragIdx=null,this._queueDropTargetIdx=null,this._isDragging=!1,this.requestUpdate()}else this._queueDragIdx=null,this._queueDropTargetIdx=null,this._isDragging=!1;oe()},J=G=>{G.stopPropagation(),n&&(clearTimeout(n),n=null),this._clearQueueDragVisuals(),this._queueDragIdx=null,this._queueDropTargetIdx=null,this._isDragging=!1,this.requestUpdate(),oe()},L=G=>{o&&G.preventDefault()},oe=()=>{window.removeEventListener("pointermove",D),window.removeEventListener("pointerup",ne),window.removeEventListener("pointercancel",J),window.removeEventListener("touchmove",L,{passive:!1}),n&&(clearTimeout(n),n=null),_&&(cancelAnimationFrame(_),_=null);const G=this.renderRoot.querySelector(".queue-sortable-container");G&&(G.style.touchAction=""),l&&l.parentNode&&l.remove(),l=null,m&&m.parentNode&&m.remove(),m=null,f=null,y=null,b=null,this._activeDragCleanup=null};this._activeDragCleanup=oe,window.addEventListener("pointermove",D),window.addEventListener("pointerup",ne),window.addEventListener("pointercancel",J),window.addEventListener("touchmove",L,{passive:!1})}};function on(i){if(!i||typeof i!="string")return[];const e=i.split(/\r?\n/),t=[],a=/\[(\d+):([0-5]\d)(?:[.:](\d{2,3}))?\]/g;return e.forEach(s=>{if(s=s.trim(),!s||s.match(/\[[a-zA-Z]+:[^\]]+\]/)&&!s.match(a))return;let r,n=s.replace(a,"").trim();const o=[];for(a.lastIndex=0;(r=a.exec(s))!==null;){const l=parseInt(r[1],10),c=parseInt(r[2],10),d=r[3]?parseInt(r[3],10):0,h=r[3]?r[3].length===3?1e3:100:1e3,p=l*60+c+d/h;o.push(p)}o.length>0?o.forEach(l=>{t.push({time:l,text:n})}):t.push({time:null,text:n})}),t.sort((s,r)=>s.time===null&&r.time===null?0:s.time===null?1:r.time===null?-1:s.time-r.time),t}class Rc extends Ye{static get properties(){return{hass:{type:Object},lyrics:{type:Array},position:{type:Number},loading:{type:Boolean},error:{type:Boolean},activeThemeColor:{type:String},mode:{type:String},preRoll:{type:Number},_activeIndex:{state:!0}}}static get styles(){return Dc}constructor(){super(),this.lyrics=[],this.position=0,this.loading=!1,this.error=!1,this.activeThemeColor="#ffffff",this.mode="default",this.preRoll=0,this._activeIndex=-1,this._isScrolling=!1,this._scrollTimeout=null}disconnectedCallback(){super.disconnectedCallback(),this._scrollTimeout&&(clearTimeout(this._scrollTimeout),this._scrollTimeout=null)}firstUpdated(){this._activeIndex!==-1&&this._scrollToActive("auto")}updated(e){super.updated(e),e.has("lyrics")&&(this._activeIndex=-1,requestAnimationFrame(()=>this._scrollToActive("auto"))),(e.has("position")||e.has("lyrics"))&&this._updateActiveLyric()}_updateActiveLyric(){if(!this.lyrics||this.lyrics.length===0||this.mode==="text"||!this.lyrics.some(a=>a.time!==null))return;let e=-1;const t=this.position+this.preRoll;for(let a=0;a<this.lyrics.length;a++)if(this.lyrics[a].time!==null&&this.lyrics[a].time<=t)e=a;else if(this.lyrics[a].time!==null&&this.lyrics[a].time>t)break;e!==this._activeIndex&&(this._activeIndex=e,e!==-1&&this.updateComplete.then(()=>this._scrollToActive()))}_scrollToActive(e="smooth"){if(this._isScrolling&&e==="smooth")return;const t=this.renderRoot.querySelector(".lyrics-scroll-container"),a=t?.querySelector(".lyric-line.active");if(t&&a){const s=t.clientHeight/2,r=a.offsetTop,n=a.clientHeight,o=r+n/2-s;t.scrollTo({top:o,behavior:e})}}_handleScroll(){this._isScrolling=!0,this._scrollTimeout&&clearTimeout(this._scrollTimeout),this._scrollTimeout=setTimeout(()=>{this._isScrolling=!1,this._scrollToActive()},3e3)}render(){if(this.error)return g`
        <div class="lyrics-error">
          <ha-icon icon="mdi:text-box-remove-outline"></ha-icon>
          <div>${u("lyrics.not_available")}</div>
        </div>
      `;if(this.loading)return g`
        <div class="lyrics-loading">
          <ha-circular-progress active></ha-circular-progress>
          <div>${u("lyrics.finding")}</div>
        </div>
      `;if(!this.lyrics||this.lyrics.length===0)return g`
        <div class="lyrics-empty">
          <ha-icon icon="mdi:text-box-search-outline"></ha-icon>
          <div>${u("lyrics.none_found")}</div>
        </div>
      `;const e=!this.lyrics.some(t=>t.time!==null);return g`
      <div
        class="lyrics-scroll-container"
        @scroll=${this._handleScroll}
        style="--yamp-primary-color: ${this.activeThemeColor}"
      >
        <div class="scroll-spacer"></div>
        ${this.lyrics.map((t,a)=>{const s=a===this._activeIndex,r=this.mode==="text",n=this.mode==="scroll";return g` <div class="${Mr({"lyric-line":!0,active:s&&!e,unsynced:e||r,"scroll-mode":n&&!e})}">${t.text}</div> `})}
        <div class="scroll-spacer"></div>
      </div>
    `}}customElements.define("yamp-lyrics-view",Rc);const Oc=[{mode:"replace",icon:"mdi:playlist-remove",label:u("search.replace")},{mode:"next",icon:"mdi:playlist-play",label:u("search.play_next")},{mode:"replace_next",icon:"mdi:playlist-music",label:u("search.replace_play")},{mode:"add",icon:"mdi:playlist-plus",label:u("search.add_queue")},{mode:"add_to_playlist",icon:"mdi:plus",label:u("search.add_to_playlist")}],li=["artist","album","track","playlist","radio","podcast","audiobook"];function Ya(i){return i&&(i.media_class==="track"||i.media_content_type==="track")}function ln(i){return i&&(i.media_class==="radio"||i.media_content_type==="radio")}function cn(i){return i==="card"||i==="card_minimal"}function Lc(i,{searchMediaClassFilter:e="all",recentlyPlayedFilterActive:t=!1,upcomingFilterActive:a=!1,recommendationsFilterActive:s=!1}={}){const r=Ya(i),n=e==="track"||e==="album";return r&&i.artist&&i.album?`${i.artist} - ${i.album}`:(n||t||a||s)&&i.artist?i.artist:i.media_class?i.media_class.charAt(0).toUpperCase()+i.media_class.slice(1):""}const dt=(i,{cap:e,floor:t}={})=>{const a=Number(i);if(!Number.isFinite(a)||a<=0)return;let s=a;return typeof t=="number"&&(s=Math.max(t,s)),typeof e=="number"&&(s=Math.min(e,s)),s},dn=3e4;let Ct=null,Hi=0;function un(i,e,t){let a=null;if(i.entities&&typeof i.entities=="object"){const s=Object.values(i.entities);if(e&&i.entities[e]&&i.entities[e].device_id){const r=i.entities[e].device_id;i.devices&&i.devices[r]&&i.devices[r].config_entries&&i.devices[r].config_entries.length>0&&(a=i.devices[r].config_entries[0])}if(!a){const r=s.find(n=>n&&t.includes(n.platform));if(r){if(r.config_entry_id)a=r.config_entry_id;else if(r.device_id&&i.devices&&i.devices[r.device_id]){const n=i.devices[r.device_id];n.config_entries&&n.config_entries.length>0&&(a=n.config_entries[0])}}}}return a}async function Gi(i,e=null){if(!i)return null;const t=Date.now();if(Ct&&t-Hi<dn)return Ct;try{return(i.services||{}).music_assistant?(Ct=un(i,e,["music_assistant","mass"])||"auto",Hi=t,Ct):(Ct=null,Hi=t,null)}catch{return Ct=null,Hi=t,null}}let It=null,Qi=0;async function Wi(i,e=null){if(!i)return null;const t=Date.now();if(It&&t-Qi<dn)return It;try{return(i.services||{}).mass_queue?(It=un(i,e,["mass_queue"])||"auto",Qi=t,It):(It=null,Qi=t,null)}catch{return It=null,Qi=t,null}}function Tt(i){return i?{title:i.name,media_content_id:i.uri,media_content_type:i.media_type,media_class:i.media_type,item_id:i.item_id,thumbnail:i.image,...i.artists&&{artist:i.artists.map(e=>e.name).join(", ")},...i.album&&{album:i.album.name,album_uri:i.album.uri},is_browsable:i.media_type==="artist"||i.media_type==="album"||i.media_type==="playlist"||i.media_type==="track",is_editable:i.is_editable===!0}:null}function hn({item:i,onPlay:e,onOptionsToggle:t,upcomingFilterActive:a=!1,isMusicAssistant:s=!1,massQueueAvailable:r=!1,searchView:n="list",isInline:o=!1,queueControlsStyle:l="drag_handle",onMoveUp:c,onMoveDown:d,onMoveNext:h,onRemove:p,minimal:_=!1,hideActions:m=!1}){if(m)return v;const f=!!(a&&i.queue_item_id&&s&&r),y=cn(n),b=o?"entity-options-search-buttons":y?"card-overlay-buttons":"search-sheet-buttons",k=o?"entity-options-search-play":y?"search-sheet-play icon-only":"search-sheet-play",E=o?"entity-options-search-queue":y?"search-sheet-queue icon-only":"search-sheet-queue";return g`
    <div class="${b}">
      ${f&&o?g`
              <div class="queue-controls">
                ${l==="drag_handle"?g`
                        <div
                          class="queue-btn queue-drag-handle"
                          title="${u("search.drag_to_reorder")}"
                        >
                          <ha-icon icon="mdi:drag"></ha-icon>
                        </div>
                      `:g`
                        <button
                          class="queue-btn queue-btn-up"
                          @click=${w=>{w.stopPropagation(),c(i)}}
                          title="${u("search.move_up")}"
                        >
                          <ha-icon icon="mdi:chevron-up"></ha-icon>
                        </button>
                        <button
                          class="queue-btn queue-btn-down"
                          @click=${w=>{w.stopPropagation(),d(i)}}
                          title="${u("search.move_down")}"
                        >
                          <ha-icon icon="mdi:chevron-down"></ha-icon>
                        </button>
                        <button
                          class="queue-btn queue-btn-next"
                          @click=${w=>{w.stopPropagation(),h(i)}}
                          title="${u("search.move_next")}"
                        >
                          <ha-icon icon="mdi:playlist-play"></ha-icon>
                        </button>
                      `}
                <button
                  class="queue-btn queue-btn-remove"
                  @click=${w=>{w.stopPropagation(),p(i)}}
                  title="${u("search.remove")}"
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `:v}
      <button
        class="${k}"
        @click=${w=>{w.stopPropagation(),e(i)}}
        title="${u("search.play_item","{item}",i.title)}"
      >
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
      ${!f&&!ln(i)&&!_?g`
              <button
                class="${E}"
                @click=${w=>{w.preventDefault(),w.stopPropagation(),t(i)}}
                title="${u("common.more_options")}"
              >
                <ha-icon icon="mdi:dots-vertical"></ha-icon>
              </button>
            `:v}
    </div>
  `}function qc({item:i,activeSearchRowMenuId:e,onPlayOption:t,onOptionsToggle:a,searchView:s="list",isQueueItem:r=!1,massQueueAvailable:n=!1,onMoveUp:o,onMoveDown:l,onMoveNext:c,onRemove:d,hideActions:h=!1}){if(h)return v;const p=e!=null&&i.media_content_id!=null&&e===i.media_content_id,_=cn(s);return g`
    <div class="search-row-slide-out ${p?"active":""}">
      ${r&&_?g`
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),o(i),a(null)}}
                title="${u("search.move_up")}"
              >
                ${u("search.move_up")}
              </button>
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),l(i),a(null)}}
                title="${u("search.move_down")}"
              >
                ${u("search.move_down")}
              </button>
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),c(i),a(null)}}
                title="${u("search.move_next")}"
              >
                ${u("search.move_next")}
              </button>
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),d(i),a(null)}}
                title="${u("search.remove")}"
              >
                ${u("search.remove")}
              </button>
            `:g`
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),t(i,"replace")}}
                title="${u("search.labels.replace")}"
              >
                ${_?v:g`<ha-icon icon="mdi:playlist-remove"></ha-icon>`}${u("search.labels.replace")}
              </button>
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),t(i,"next")}}
                title="${u("search.labels.next")}"
              >
                ${_?v:g`<ha-icon icon="mdi:playlist-play"></ha-icon>`}${u("search.labels.next")}
              </button>
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),t(i,"replace_next")}}
                title="${u("search.labels.replace_next")}"
              >
                ${_?v:g`<ha-icon icon="mdi:playlist-music"></ha-icon>`}${u("search.labels.replace_next")}
              </button>
              <button
                class="slide-out-button"
                @click=${m=>{m.stopPropagation(),t(i,"add")}}
                title="${u("search.labels.add")}"
              >
                ${_?v:g`<ha-icon icon="mdi:playlist-plus"></ha-icon>`}${u("search.labels.add")}
              </button>
              ${Ya(i)&&n?g`
                      <button
                        class="slide-out-button"
                        @click=${m=>{m.stopPropagation(),t(i,"add_to_playlist")}}
                        title="${u("search.labels.add_to_playlist")}"
                      >
                        ${_?v:g`<ha-icon icon="mdi:plus"></ha-icon>`}${u("search.labels.add_to_playlist")}
                      </button>
                    `:v}
            `}
      <div
        class="slide-out-close"
        @click=${m=>{m.stopPropagation(),a(null)}}
      >
        <ha-icon icon="mdi:close"></ha-icon>
      </div>
    </div>
  `}function Nc({item:i,isCard:e,isMinimal:t,activeSearchRowMenuId:a,loadingSearchRowMenuId:s,errorSearchRowMenuId:r,successSearchRowMenuId:n,successSearchRowType:o,isSelectionFlow:l,massQueueAvailable:c,upcomingFilterActive:d,recentlyPlayedFilterActive:h=!1,recommendationsFilterActive:p=!1,searchMediaClassFilter:_="all",queueControlsStyle:m="drag_handle",onPlay:f,onResultClick:y,onResultTouch:b,onOptionsToggle:k,onPlayOption:E,onMoveUp:w,onMoveDown:P,onMoveNext:$,onRemove:C,isMusicAssistant:N=!1,isValidArtwork:j=O=>!!O,getClickTitle:F=O=>"",artworkHostname:I=""}){if(!i)return g`<div class="yamp-search-result placeholder"></div>`;const O=N,R=!!i.is_browsable||l,D=e?t?"card_minimal":"card":"list",ne=a!=null&&i.media_content_id!=null&&a===i.media_content_id,J=l;return g`
    <div
      class="yamp-search-result nodrag no-drag ignore-drag ${e?"search-result-card":""} ${t?"minimal":""} ${i._justMoved?"just-moved":""} ${ne?"menu-active":""} ${R?"clickable":""}"
      @click=${L=>{l||!e&&R?y?.(i,L):e&&f?.(i,L)}}
    >
      <div class="search-sheet-thumb-container" data-clickable="${e}">
        ${i.thumbnail&&j(i.thumbnail)?g`
                <img
                  class="yamp-search-result-thumb"
                  src=${Kr(i.thumbnail,I)}
                  alt=${i.title}
                  onerror="this.style.display='none'"
                />
              `:g`
                <div class="yamp-search-result-thumb-placeholder">
                  <ha-icon icon="mdi:music"></ha-icon>
                </div>
              `}
        ${e?hn({item:i,onPlay:f,onOptionsToggle:k,upcomingFilterActive:!!d,isMusicAssistant:O,massQueueAvailable:c,searchView:D,queueControlsStyle:m,onMoveUp:w,onMoveDown:P,onMoveNext:$,onRemove:C,minimal:t,hideActions:J}):v}
      </div>

      ${t?v:g`
              <div class="yamp-search-result-info">
                <span
                  class="yamp-search-result-title ${R?"clickable-search-result":""}"
                  @touchstart=${L=>b&&b(i,L)}
                  @click=${L=>{(R||l)&&(L.stopPropagation(),y&&y(i,L))}}
                  title=${F(i)}
                >
                  ${i.title}
                </span>
                <span
                  class="yamp-search-result-subtitle ${R?"clickable-search-result":""}"
                  @touchstart=${L=>b&&b(i,L)}
                  @click=${L=>{(R||l)&&(L.stopPropagation(),y&&y(i,L))}}
                >
                  ${Lc(i,{searchMediaClassFilter:_,recentlyPlayedFilterActive:h,upcomingFilterActive:d,recommendationsFilterActive:p})}
                </span>
                ${e&&!ln(i)&&!J?g`
                        <div
                          class="card-menu-button ${d&&c&&m==="drag_handle"?"queue-drag-handle":""}"
                          @click=${L=>{L.preventDefault(),L.stopPropagation(),k(i)}}
                        >
                          <ha-icon icon="mdi:dots-vertical"></ha-icon>
                        </div>
                      `:v}
              </div>
            `}
      ${e?v:hn({item:i,onPlay:f,onOptionsToggle:k,upcomingFilterActive:!!d,isMusicAssistant:O,massQueueAvailable:c,searchView:D,isInline:!0,queueControlsStyle:m,onMoveUp:w,onMoveDown:P,onMoveNext:$,onRemove:C,hideActions:J})}
      ${qc({item:i,activeSearchRowMenuId:a,onPlayOption:E,onOptionsToggle:k,searchView:D,isQueueItem:O&&i.queue_item_id&&d&&c,massQueueAvailable:c,onMoveUp:w,onMoveDown:P,onMoveNext:$,onRemove:C,hideActions:J})}
      ${s!=null&&i.media_content_id!=null&&s===i.media_content_id?g`
              <div class="search-row-loading-overlay">
                <ha-icon icon="mdi:loading" class="spin"></ha-icon>
                <span>${u("common.loading")}</span>
              </div>
            `:v}
      ${r!=null&&i.media_content_id!=null&&r===i.media_content_id?g`
              <div class="search-row-error-overlay">
                <ha-icon icon="mdi:alert-circle" class="error-icon"></ha-icon>
                <span>${u("common.error")||"Error"}</span>
              </div>
            `:v}
      ${n!=null&&i.media_content_id!=null&&n===i.media_content_id?g`
              <div class="search-row-success-overlay">
                <span>✅</span>
                <span
                  >${u(o==="playlist"?"search.added_to_playlist":"search.added")}</span
                >
              </div>
            `:v}
    </div>
  `}function Vc({item:i,onClose:e,onPlayOption:t,massQueueAvailable:a=!1}){return i?g`
    <div class="entity-options-overlay entity-options-overlay-opening" @click=${e}>
      <div
        class="entity-options-container entity-options-sheet-opening"
        @click=${s=>s.stopPropagation()}
      >
        <div class="entity-options-sheet">
          <div class="entity-options-title">${i.title}</div>

          ${Oc.filter(s=>s.mode==="add_to_playlist"?Ya(i)&&a:!0).map(s=>g`
                <button
                  class="entity-options-item menu-action-item"
                  @click=${()=>t(i,s.mode)}
                >
                  <ha-icon class="menu-action-icon" .icon=${s.icon}></ha-icon>
                  <span class="menu-action-label">${s.label}</span>
                </button>
              `)}

          <div class="entity-options-divider"></div>

          <button class="entity-options-item close-item" @click=${e}>
            ${u("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  `:v}async function pn(i,e,t,a=null,s={},r=20){const n=await Gi(i,e);if(n)try{if(s.favorites){const h=a&&a!=="all"?[a]:li,p=[];return await Promise.all(h.map(async _=>{try{const m={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{...n&&n!=="auto"&&{config_entry_id:n},media_type:_,favorite:!0,search:t},return_response:!0},f=dt(r);f!==void 0&&(m.service_data.limit=f),s.orderBy&&s.orderBy!=="default"&&(m.service_data.order_by=s.orderBy),((await i.connection.sendMessagePromise(m))?.response?.items||[]).forEach(y=>{const b=Tt(y);b&&p.push(b)})}catch(m){console.error("yamp: Error searching favorites for type",_,m)}})),{results:p,usedMusicAssistant:!0}}if((!t||t.trim()==="")&&a&&a!=="all"&&!s.favorites){if(!li.includes(a))return console.warn(`yamp: Unsupported media type for browsing: ${a}. Skipping get_library call.`),{results:[],usedMusicAssistant:!0};try{const h={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{...n&&n!=="auto"&&{config_entry_id:n},media_type:a},return_response:!0},p=dt(r);p!==void 0&&(h.service_data.limit=p),s.orderBy&&s.orderBy!=="default"&&(h.service_data.order_by=s.orderBy);const _=(await i.connection.sendMessagePromise(h))?.response?.items||[],m=[];return _.forEach(f=>{const y=Tt(f);y&&m.push(y)}),{results:m,usedMusicAssistant:!0}}catch(h){return console.error("yamp: Error browsing library for type",a,h),{results:[],usedMusicAssistant:!0}}}const o={name:t,...n&&n!=="auto"&&{config_entry_id:n}},l=dt(r,{cap:a==="all"?8:void 0});l!==void 0&&(o.limit=l),a&&a!=="all"&&(o.media_type=a),s.artist&&(o.artist=s.artist),s.album&&(o.album=s.album);const c={type:"call_service",domain:"music_assistant",service:"search",service_data:o,return_response:!0},d=(await i.connection.sendMessagePromise(c))?.response;if(d){const h=[];return Object.entries(d).forEach(([p,_])=>{Array.isArray(_)&&_.forEach(m=>{const f=Tt(m);f&&h.push(f)})}),{results:h,usedMusicAssistant:!0}}}catch(o){console.error("yamp: Error in searchMedia:",o)}return{results:await Bc(i,e,t,a,s),usedMusicAssistant:!1}}async function Uc(i,e,t=null,a=20,s={}){const r=await Gi(i,e);if(!r)return{results:[],usedMusicAssistant:!1};const n=typeof s.onChunk=="function"?s.onChunk:null,o=async(l,c={})=>{const d={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{...r&&r!=="auto"&&{config_entry_id:r},media_type:l,order_by:"last_played_desc"},return_response:!0},h=dt(a,c);return h!==void 0&&(d.service_data.limit=h),((await i.connection.sendMessagePromise(d))?.response?.items||[]).map(Tt).filter(Boolean)};try{if(t==="all"){const c=[];return await Promise.all(li.map(async d=>{const h=await o(d,{cap:5});h.length&&(c.push(...h),n&&n(h,d))})),{results:c,usedMusicAssistant:!0}}const l=await o(t||"track");return l.length&&n&&n(l,t||"track"),{results:l,usedMusicAssistant:!0}}catch(l){return console.error("yamp: Error getting recently played from Music Assistant:",l),{results:[],usedMusicAssistant:!1}}}async function _n(i,e,t=null,a=20,s={}){const r=await Gi(i,e);if(!r)return{results:[],usedMusicAssistant:!1};const n=typeof s.onChunk=="function"?s.onChunk:null,o=async l=>{const c={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{...r&&r!=="auto"&&{config_entry_id:r},media_type:l,favorite:!0},return_response:!0},d=dt(a,{cap:l==="all"?8:void 0});d!==void 0&&(c.service_data.limit=d),s.orderBy&&s.orderBy!=="default"&&(c.service_data.order_by=s.orderBy);try{return((await i.connection.sendMessagePromise(c))?.response?.items||[]).map(Tt).filter(Boolean)}catch(h){return console.error("yamp: Error loading favorites for type",l,h),[]}};try{if(t&&t!=="all"){const c=await o(t);return c.length&&n&&n(c,t),{results:c,usedMusicAssistant:!0}}const l=[];return await Promise.all(li.map(async c=>{const d=await o(c);d.length&&(l.push(...d),n&&n(d,c))})),{results:l,usedMusicAssistant:!0}}catch(l){return console.error("yamp: Error loading favorites",l),{results:[],usedMusicAssistant:!1}}}async function Bc(i,e,t,a,s={}){const r={entity_id:e,search_query:t};a&&a!=="all"&&(r.media_content_type=a);const n={type:"call_service",domain:"media_player",service:"search_media",service_data:r,return_response:!0},o=await i.connection.sendMessagePromise(n);return o?.response?.[e]?.result||o?.result||[]}function Hc(i,e,t){return i.callService("media_player","play_media",{entity_id:e,media_content_type:t.media_content_type,media_content_id:t.media_content_id})}async function Gc(i,e,t=null,a=null,s=null,r=100){if(!e)return!1;try{const n=await Gi(i,t);if(!n)return!1;let o=t;if(!o){const l=Object.values(i.states).find(c=>$t(c)&&c.entity_id.startsWith("media_player."));if(l)o=l.entity_id;else return!1}if(a||s){try{const l={name:a||s,...n&&n!=="auto"&&{config_entry_id:n},media_type:"track"},c=dt(r);c!==void 0&&(l.limit=c),s&&(l.artist=s);const d={type:"call_service",domain:"music_assistant",service:"search",service_data:l,return_response:!0},h=(await i.connection.sendMessagePromise(d))?.response;let p=[];if(Array.isArray(h)?p=h:h&&typeof h=="object"&&Object.values(h).forEach(_=>{Array.isArray(_)&&p.push(..._)}),p.length){const _=(e.split("/").pop()||"").trim(),m=p.find(b=>b?.uri===e),f=!m&&/^\d+$/.test(_)?p.find(b=>typeof b?.uri=="string"&&b.uri.endsWith(`/${_}`)):null,y=m||f||null;if(y&&typeof y.favorite=="boolean")return!!y.favorite}}catch{}if(a)try{const l={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{...n&&n!=="auto"&&{config_entry_id:n},media_type:"track",favorite:!0,search:a.trim()},return_response:!0},c=dt(r);if(c!==void 0&&(l.service_data.limit=c),((await i.connection.sendMessagePromise(l))?.response?.items||[]).some(d=>d.uri===e))return!0}catch{}}return!1}catch{return!1}}/*! js-yaml 5.2.2 https://github.com/nodeca/js-yaml @license MIT */var U=Symbol("NOT_RESOLVED"),Ka=Symbol("MERGE_KEY");function pe(i,e){return{tagName:i,nodeKind:"scalar",implicit:e.implicit??!1,matchByTagPrefix:e.matchByTagPrefix??!1,implicitFirstChars:e.implicitFirstChars??null,resolve:e.resolve,identify:e.identify??null,represent:e.represent??(t=>String(t)),representTagName:e.representTagName??null}}function Za(i,e){const t=e.finalize===void 0;return{tagName:i,nodeKind:"sequence",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addItem:e.addItem,finalize:e.finalize??(a=>a),carrierIsResult:t,identify:e.identify??null,represent:e.represent??(a=>a),representTagName:e.representTagName??null}}function Yi(i,e){const t=e.finalize===void 0;return{tagName:i,nodeKind:"mapping",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addPair:e.addPair,has:e.has,keys:e.keys,get:e.get,finalize:e.finalize??(a=>a),carrierIsResult:t,identify:e.identify??null,represent:e.represent??(a=>a),representTagName:e.representTagName??null}}var Qc=pe("tag:yaml.org,2002:str",{resolve:i=>i,identify:i=>typeof i=="string"}),Wc=["","~","null","Null","NULL"],Yc=pe("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:i=>Wc.indexOf(i)!==-1?null:U,identify:i=>i===null,represent:()=>"null"}),Kc=pe("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(i,e)=>i==="null"||e&&i===""?null:U,identify:i=>i===null,represent:()=>"null"}),Zc=["","~","null","Null","NULL"],Jc=pe("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:i=>Zc.indexOf(i)!==-1?null:U,identify:i=>i===null,represent:()=>"null"}),Xc=["true","True","TRUE"],ed=["false","False","FALSE"],td=pe("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:i=>Xc.indexOf(i)!==-1?!0:ed.indexOf(i)!==-1?!1:U,identify:i=>Object.prototype.toString.call(i)==="[object Boolean]",represent:i=>i?"true":"false"}),id=["true"],ad=["false"],sd=pe("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:i=>id.indexOf(i)!==-1?!0:ad.indexOf(i)!==-1?!1:U,identify:i=>Object.prototype.toString.call(i)==="[object Boolean]",represent:i=>i?"true":"false"}),rd=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],nd=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],od=pe("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:i=>rd.indexOf(i)!==-1?!0:nd.indexOf(i)!==-1?!1:U,identify:i=>Object.prototype.toString.call(i)==="[object Boolean]",represent:i=>i?"true":"false"}),ld=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),cd=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");function dd(i){let e=i,t=1;return(e[0]==="-"||e[0]==="+")&&(e[0]==="-"&&(t=-1),e=e.slice(1)),e.startsWith("0b")?t*parseInt(e.slice(2),2):e.startsWith("0o")?t*parseInt(e.slice(2),8):e.startsWith("0x")?t*parseInt(e.slice(2),16):t*parseInt(e,10)}function ud(i,e){if(e){if(!cd.test(i))return U}else if(!ld.test(i))return U;const t=dd(i);return Number.isFinite(t)?t:U}var mn=pe("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:ud,identify:i=>Number.isInteger(i)&&!Object.is(i,-0)&&i.toString(10).indexOf("e")<0,represent:i=>i.toString(10)}),hd=new RegExp("^-?(?:0|[1-9][0-9]*)$"),pd=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");function _d(i){let e=i,t=1;return(e[0]==="-"||e[0]==="+")&&(e[0]==="-"&&(t=-1),e=e.slice(1)),e.startsWith("0b")?t*parseInt(e.slice(2),2):e.startsWith("0o")?t*parseInt(e.slice(2),8):e.startsWith("0x")?t*parseInt(e.slice(2),16):t*parseInt(e,10)}function md(i,e){if(e){if(!pd.test(i))return U}else if(!hd.test(i))return U;const t=_d(i);return Number.isFinite(t)?t:U}var gd=pe("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:md,identify:i=>Number.isInteger(i)&&!Object.is(i,-0)&&i.toString(10).indexOf("e")<0,represent:i=>i.toString(10)}),fd=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");function yd(i){let e=i.replace(/_/g,""),t=1;if((e[0]==="-"||e[0]==="+")&&(e[0]==="-"&&(t=-1),e=e.slice(1)),e.startsWith("0b"))return t*parseInt(e.slice(2),2);if(e.startsWith("0x"))return t*parseInt(e.slice(2),16);if(e.includes(":")){let a=0;for(const s of e.split(":"))a=a*60+Number(s);return t*a}return e!=="0"&&e[0]==="0"?t*parseInt(e,8):t*parseInt(e,10)}function vd(i){if(!fd.test(i))return U;const e=yd(i);return Number.isFinite(e)?e:U}var Ja=pe("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:vd,identify:i=>Number.isInteger(i)&&!Object.is(i,-0)&&i.toString(10).indexOf("e")<0,represent:i=>i.toString(10)}),bd=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),xd=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function wd(i){if(!bd.test(i))return U;let e=i.toLowerCase();const t=e[0]==="-"?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),e===".inf")return t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(e===".nan")return NaN;const a=t*parseFloat(e);return Number.isFinite(a)||xd.test(i)?a:U}function kd(i){if(isNaN(i))return".nan";if(i===Number.POSITIVE_INFINITY)return".inf";if(i===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(i,-0))return"-0.0";const e=i.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}var gn=pe("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:wd,identify:i=>typeof i=="number"&&(!Number.isInteger(i)||Object.is(i,-0)||i.toString(10).indexOf("e")>=0),represent:kd}),Ed=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),Sd=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Ad(i,e){if(e){if(!Sd.test(i))return U;let a=i.toLowerCase();const s=a[0]==="-"?-1:1;if("+-".includes(a[0])&&(a=a.slice(1)),a===".inf")return s===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(a===".nan")return NaN;const r=s*parseFloat(a);return Number.isFinite(r)?r:U}if(!Ed.test(i))return U;const t=Number(i);return Number.isFinite(t)?t:U}function $d(i){if(isNaN(i))return".nan";if(i===Number.POSITIVE_INFINITY)return".inf";if(i===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(i,-0))return"-0.0";const e=i.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}var Cd=pe("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:Ad,identify:i=>typeof i=="number"&&(!Number.isInteger(i)||Object.is(i,-0)||i.toString(10).indexOf("e")>=0),represent:$d}),Id=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Td=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Md(i){if(!Id.test(i))return U;let e=i.toLowerCase().replace(/_/g,"");const t=e[0]==="-"?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),e===".inf")return t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(e===".nan")return NaN;let a=0;if(e.includes(":")){for(const s of e.split(":"))a=a*60+Number(s);a*=t}else a=t*parseFloat(e);return Number.isFinite(a)||Td.test(i)?a:U}function Pd(i){if(isNaN(i))return".nan";if(i===Number.POSITIVE_INFINITY)return".inf";if(i===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(i,-0))return"-0.0";const e=i.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}var Xa=pe("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:Md,identify:i=>typeof i=="number"&&(!Number.isInteger(i)||Object.is(i,-0)||i.toString(10).indexOf("e")>=0),represent:Pd}),zd=pe("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(i,e)=>i==="<<"||e&&i===""?Ka:U}),jd=/^[A-Za-z0-9+/]*={0,2}$/;function Dd(i){const e=i.replace(/\s/g,"");if(e.length%4!==0||!jd.test(e))return U;const t=atob(e),a=new Uint8Array(t.length);for(let s=0;s<t.length;s++)a[s]=t.charCodeAt(s);return a}function Fd(i){let e="";for(let t=0;t<i.length;t++)e+=String.fromCharCode(i[t]);return btoa(e)}var Rd=pe("tag:yaml.org,2002:binary",{resolve:Dd,identify:i=>Object.prototype.toString.call(i)==="[object Uint8Array]",represent:Fd}),Od=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Ld=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function qd(i){let e=Od.exec(i);if(e===null&&(e=Ld.exec(i)),e===null)return U;const t=+e[1],a=+e[2]-1,s=+e[3];if(!e[4]){const d=new Date(Date.UTC(t,a,s));return d.getUTCFullYear()!==t||d.getUTCMonth()!==a||d.getUTCDate()!==s?U:d}const r=+e[4],n=+e[5],o=+e[6];let l=0;if(r>23||n>59||o>59)return U;if(e[7]){let d=e[7].slice(0,3);for(;d.length<3;)d+="0";l=+d}const c=new Date(Date.UTC(t,a,s,r,n,o,l));if(c.getUTCFullYear()!==t||c.getUTCMonth()!==a||c.getUTCDate()!==s)return U;if(e[9]){const d=+e[10],h=+(e[11]||0);if(d>23||h>59)return U;const p=(d*60+h)*6e4;c.setTime(c.getTime()-(e[9]==="-"?-p:p))}return c}var Nd=pe("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:qd,identify:i=>i instanceof Date,represent:i=>i.toISOString()}),Vd=Za("tag:yaml.org,2002:seq",{create:()=>[],addItem:(i,e)=>{i.push(e)},identify:Array.isArray});function Ki(i){if(i===null||typeof i!="object"||Array.isArray(i))return!1;const e=Object.getPrototypeOf(i);return e===null||e===Object.prototype}function es(i,e){const t={};for(const a of e)i[a]!==void 0&&(t[a]=i[a]);return t}var Ud=Za("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(i,e)=>{let t;if(e instanceof Map){if(e.size!==1)return"cannot resolve an ordered map item";t=e.keys().next().value}else if(Ki(e)){const a=Object.keys(e);if(a.length!==1)return"cannot resolve an ordered map item";t=a[0]}else return"cannot resolve an ordered map item";return i.seen.has(t)?"duplicate key in ordered map":(i.seen.add(t),i.list.push(e),"")},finalize:i=>i.list}),Bd=Za("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(i,e)=>{if(e instanceof Map)return e.size!==1?"cannot resolve a pairs item":(i.push(e.entries().next().value),"");if(Object.prototype.toString.call(e)!=="[object Object]")return"cannot resolve a pairs item";const t=e,a=Object.keys(t);return a.length!==1?"cannot resolve a pairs item":(i.push([a[0],t[a[0]]]),"")}}),Hd=Yi("tag:yaml.org,2002:map",{create:()=>({}),identify:Ki,represent:i=>{const e=new Map;for(const t of Object.keys(i))e.set(t,i[t]);return e},addPair:(i,e,t)=>{if(e!==null&&typeof e=="object")return"object-based map does not support complex keys";const a=String(e);return a==="__proto__"?Object.defineProperty(i,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):i[a]=t,""},has:(i,e)=>e!==null&&typeof e=="object"?!1:Object.prototype.hasOwnProperty.call(i,String(e)),keys:i=>Object.keys(i),get:(i,e)=>i[String(e)]}),Gd=Yi("tag:yaml.org,2002:set",{create:()=>new Set,identify:i=>i instanceof Set,represent:i=>{const e=new Map;for(const t of i)e.set(t,null);return e},addPair:(i,e,t)=>t!==null?"cannot resolve a set item":(i.add(e),""),has:(i,e)=>i.has(e),keys:i=>i.keys(),get:()=>null});function Qd(){return{scalar:{},sequence:{},mapping:{}}}function Wd(){return{scalar:[],sequence:[],mapping:[]}}function Yd(i){const e=[];for(const t of i){let a=e.length;for(let s=0;s<e.length;s++){const r=e[s];if(r.nodeKind===t.nodeKind&&r.tagName===t.tagName&&r.matchByTagPrefix===t.matchByTagPrefix){a=s;break}}e[a]=t}return e}var Zi=class Do{constructor(e){ce(this,"tags");ce(this,"implicitScalarTags");ce(this,"implicitScalarByFirstChar");ce(this,"implicitScalarAnyFirstChar");ce(this,"defaultScalarTag");ce(this,"defaultSequenceTag");ce(this,"defaultMappingTag");ce(this,"exact");ce(this,"prefix");const t=Yd(e),a=[],s=Qd(),r=Wd();for(const d of t){if(d.nodeKind==="scalar"&&d.implicit){if(d.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");a.push(d)}switch(d.nodeKind){case"scalar":d.matchByTagPrefix?r.scalar.push(d):s.scalar[d.tagName]=d;break;case"sequence":d.matchByTagPrefix?r.sequence.push(d):s.sequence[d.tagName]=d;break;case"mapping":d.matchByTagPrefix?r.mapping.push(d):s.mapping[d.tagName]=d;break}}const n=a.filter(d=>d.implicitFirstChars===null),o=new Set;for(const d of a)if(d.implicitFirstChars!==null)for(const h of d.implicitFirstChars)o.add(h);const l=new Map;for(const d of o)l.set(d,a.filter(h=>h.implicitFirstChars===null||h.implicitFirstChars.indexOf(d)!==-1));const c=s.scalar["tag:yaml.org,2002:str"];if(!c)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=a,this.implicitScalarByFirstChar=l,this.implicitScalarAnyFirstChar=n,this.defaultScalarTag=c,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=r}withTags(...e){let t=[];for(const a of e)t=t.concat(a);return new Do([...this.tags,...t])}},ts=new Zi([Qc,Vd,Hd]);new Zi([...ts.tags,Kc,sd,gd,Cd]);var Kd=new Zi([...ts.tags,Yc,td,mn,gn]),Zd=new Zi([...ts.tags,Jc,od,Ja,Xa,Nd,zd,Rd,Ud,Bd,Gd]);Yi("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(i,e,t)=>(i.set(e,t),""),has:(i,e)=>i.has(e),keys:i=>i.keys(),get:(i,e)=>i.get(e),identify:i=>i instanceof Map||Ki(i),represent:i=>{if(i instanceof Map)return i;const e=new Map,t=i;for(const a of Object.keys(t))e.set(a,t[a]);return e}});function fn(i){if(Array.isArray(i)){const e=Array.prototype.slice.call(i);for(let t=0;t<e.length;t++){if(Array.isArray(e[t]))return null;typeof e[t]=="object"&&Object.prototype.toString.call(e[t])==="[object Object]"&&(e[t]="[object Object]")}return String(e)}return typeof i=="object"&&Object.prototype.toString.call(i)==="[object Object]"?"[object Object]":String(i)}Yi("tag:yaml.org,2002:map",{create:()=>({}),identify:Ki,represent:i=>{const e=new Map;for(const t of Object.keys(i))e.set(t,i[t]);return e},addPair:(i,e,t)=>{const a=fn(e);return a===null?"nested arrays are not supported inside keys":(a==="__proto__"?Object.defineProperty(i,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):i[a]=t,"")},has:(i,e)=>{const t=fn(e);return t!==null&&Object.prototype.hasOwnProperty.call(i,t)},keys:i=>Object.keys(i),get:(i,e)=>i[String(e)]});var Jd={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function is(i,e,t,a,s){let r="",n="";const o=Math.floor(s/2)-1;return a-e>o&&(r=" ... ",e=a-o+r.length),t-a>o&&(n=" ...",t=a+o-n.length),{str:r+i.slice(e,t).replace(/\t/g,"\u2192")+n,pos:a-e+r.length}}function as(i,e){return" ".repeat(Math.max(e-i.length,0))+i}function Xd(i,e){if(!i.buffer)return null;const t={...Jd,...e},a=/\r?\n|\r|\0/g,s=[0],r=[];let n,o=-1;for(;n=a.exec(i.buffer);)r.push(n.index),s.push(n.index+n[0].length),i.position<=n.index&&o<0&&(o=s.length-2);o<0&&(o=s.length-1);let l="";const c=Math.min(i.line+t.linesAfter,r.length).toString().length,d=t.maxLength-(t.indent+c+3);for(let p=1;p<=t.linesBefore&&!(o-p<0);p++){const _=is(i.buffer,s[o-p],r[o-p],i.position-(s[o]-s[o-p]),d);l=`${" ".repeat(t.indent)}${as((i.line-p+1).toString(),c)} | ${_.str}
${l}`}const h=is(i.buffer,s[o],r[o],i.position,d);l+=`${" ".repeat(t.indent)}${as((i.line+1).toString(),c)} | ${h.str}
`,l+=`${"-".repeat(t.indent+c+3+h.pos)}^
`;for(let p=1;p<=t.linesAfter&&!(o+p>=r.length);p++){const _=is(i.buffer,s[o+p],r[o+p],i.position-(s[o]-s[o+p]),d);l+=`${" ".repeat(t.indent)}${as((i.line+p+1).toString(),c)} | ${_.str}
`}return l.replace(/\n$/,"")}function yn(i,e){let t="";return i.mark?(i.mark.name&&(t+=`in "${i.mark.name}" `),t+=`(${i.mark.line+1}:${i.mark.column+1})`,!e&&i.mark.snippet&&(t+=`

${i.mark.snippet}`),`${i.reason} ${t}`):i.reason}var ci=class extends Error{constructor(e,t){super();ce(this,"reason");ce(this,"mark");this.name="YAMLException",this.reason=e,this.mark=t,this.message=yn(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${yn(this,e)}`}};function Ji(i,e,t,a=""){let s=0,r=0;for(let o=0;o<e;o++){const l=i.charCodeAt(o);l===10?(s++,r=o+1):l===13&&(s++,i.charCodeAt(o+1)===10&&o++,r=o+1)}const n={name:a,buffer:i,position:e,line:s,column:e-r};throw n.snippet=Xd(n),new ci(t,n)}var eu=-1;function vn(i){switch(i){case 48:return"\0";case 97:return"\x07";case 98:return"\b";case 116:return"	";case 9:return"	";case 110:return`
`;case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"\x1B";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"\x85";case 95:return"\xA0";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var bn=new Array(256),xn=new Array(256);for(let i=0;i<256;i++)bn[i]=vn(i)?1:0,xn[i]=vn(i);function tu(i){return i<=65535?String.fromCharCode(i):String.fromCharCode((i-65536>>10)+55296,(i-65536&1023)+56320)}function iu(i){return i>=48&&i<=57?i-48:(i|32)-97+10}function au(i){return i===120?2:i===117?4:8}function Xi(i,e,t){let a=0;for(;e<t;){const s=i.charCodeAt(e);if(s===10)a++,e++;else if(s===13)a++,e++,i.charCodeAt(e)===10&&e++;else if(s===32||s===9)e++;else break}return{position:e,breaks:a}}function ss(i){return i===1?" ":`
`.repeat(i-1)}function su(i,e,t){let a="",s=e,r=e,n=e;for(;s<t;){const o=i.charCodeAt(s);if(o===10||o===13){a+=i.slice(r,n);const l=Xi(i,s,t);a+=ss(l.breaks),s=r=n=l.position}else s++,o!==32&&o!==9&&(n=s)}return a+i.slice(r,n)}function ru(i,e,t){let a="",s=e,r=e,n=e;for(;s<t;){const o=i.charCodeAt(s);if(o===39)a+=i.slice(r,s)+"'",s+=2,r=n=s;else if(o===10||o===13){a+=i.slice(r,n);const l=Xi(i,s,t);a+=ss(l.breaks),s=r=n=l.position}else s++,o!==32&&o!==9&&(n=s)}return a+i.slice(r,t)}function nu(i,e,t){let a="",s=e,r=e,n=e;for(;s<t;){const o=i.charCodeAt(s);if(o===92){a+=i.slice(r,s),s++;const l=i.charCodeAt(s);if(l===10||l===13)s=Xi(i,s,t).position;else if(l<256&&bn[l])a+=xn[l],s++;else{let c=au(l),d=0;for(;c>0;c--){s++;const h=iu(i.charCodeAt(s));d=(d<<4)+h}a+=tu(d),s++}r=n=s}else if(o===10||o===13){a+=i.slice(r,n);const l=Xi(i,s,t);a+=ss(l.breaks),s=r=n=l.position}else s++,o!==32&&o!==9&&(n=s)}return a+i.slice(r,t)}function wn(i,e,t,a,s,r){const n=a<0?0:a,o=i.slice(e,t).replace(/\r\n?/g,`
`),l=o===""?[]:(o.endsWith(`
`)?o.slice(0,-1):o).split(`
`);let c="",d=!1,h=0,p=!1;for(const _ of l){let m=0;for(;m<n&&_.charCodeAt(m)===32;)m++;if(a<0||m>=_.length){h++;continue}const f=_.slice(n),y=f.charCodeAt(0);r?y===32||y===9?(p=!0,c+=`
`.repeat(d?1+h:h)):p?(p=!1,c+=`
`.repeat(h+1)):h===0?d&&(c+=" "):c+=`
`.repeat(h):c+=`
`.repeat(d?1+h:h),c+=f,d=!0,h=0}return s===3?c+=`
`.repeat(d?1+h:h):s!==2&&d&&(c+=`
`),c}function ou(i,e){if(e.valueStart===eu)return"";const{valueStart:t,valueEnd:a}=e;if(e.fast)return i.slice(t,a);switch(e.style){case 2:return ru(i,t,a);case 3:return nu(i,t,a);case 4:return wn(i,t,a,e.indent,e.chomping,!1);case 5:return wn(i,t,a,e.indent,e.chomping,!0);default:return su(i,t,a)}}var lu={"!":"!","!!":"tag:yaml.org,2002:"};function rs(i){return encodeURI(i).replace(/!/g,"%21")}function kn(i,e){if(i.startsWith("!<")&&i.endsWith(">"))return decodeURIComponent(i.slice(2,-1));const t=i.indexOf("!",1),a=t===-1?"!":i.slice(0,t+1),s=e?.[a]??lu[a]??a;return decodeURIComponent(s)+decodeURIComponent(i.slice(a.length))}function En(i){let e=i;return e.charCodeAt(0)===33?(e=e.slice(1),`!${rs(e)}`):e.slice(0,18)==="tag:yaml.org,2002:"?`!!${rs(e.slice(18))}`:`!<${rs(e)}>`}var Mt=-1,ns={filename:"",schema:Kd,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function cu(i){return"tagStart"in i&&i.tagStart!==Mt?i.tagStart:"anchorStart"in i&&i.anchorStart!==Mt?i.anchorStart:"valueStart"in i&&i.valueStart!==Mt?i.valueStart:"start"in i?i.start:0}function Ee(i,e){Ji(i.source,i.position,e,i.filename)}function Sn(i,e,t,a){try{return t.finalize(a)}catch(s){if(s instanceof ci)throw s;Ji(i.source,e,s instanceof Error?s.message:String(s),i.filename)}}function ea(i,e,t){const a=i[t];if(a)return a;for(const s of e)if(t.startsWith(s.tagName))return s}function du(i,e,t,a,s){const r=ea(e,t,a);if(r)return r;Ee(i,`unknown ${s} tag !<${a}>`)}function uu(i,e){const t=ou(i.source,e),a=e.tagStart===Mt?"":i.source.slice(e.tagStart,e.tagEnd),s=i.schema.defaultScalarTag;if(a!==""){if(a==="!")return{value:t,tag:s};const r=kn(a,i.tagHandlers),n=ea(i.schema.exact.scalar,i.schema.prefix.scalar,r);if(n){const l=n.resolve(t,!0,r);return l===U&&Ee(i,`cannot resolve a node with !<${r}> explicit tag`),{value:l,tag:n}}const o=ea(i.schema.exact.mapping,i.schema.prefix.mapping,r)??ea(i.schema.exact.sequence,i.schema.prefix.sequence,r);if(o){t!==""&&Ee(i,`cannot resolve a node with !<${r}> explicit tag`);const l=o.create(r);return{value:o.carrierIsResult?l:Sn(i,i.position,o,l),tag:o}}Ee(i,`unknown scalar tag !<${r}>`)}if(e.style===1){const r=i.schema.implicitScalarByFirstChar.get(t.charAt(0))??i.schema.implicitScalarAnyFirstChar;for(const n of r){const o=n.resolve(t,!1,n.tagName);if(o!==U)return{value:o,tag:n}}}return{value:s.resolve(t,!1,s.tagName),tag:s}}function An(i,e,t,a,s,r){const n=e.tagStart===Mt?"":i.source.slice(e.tagStart,e.tagEnd),o=n===""||n==="!"?s:kn(n,i.tagHandlers);return{tagName:o,tag:du(i,t,a,o,r)}}function $n(i){return i.nodeKind==="mapping"}function Cn(i,e,t,a){for(const s of a.keys(t)){if(i.maxTotalMergeKeys!==-1&&++i.totalMergeKeys>i.maxTotalMergeKeys&&Ee(i,`merge keys exceeded maxTotalMergeKeys (${i.maxTotalMergeKeys})`),e.tag.has(e.value,s))continue;const r=e.tag.addPair(e.value,s,a.get(t,s));r&&Ee(i,r),(e.overridable??=new Set).add(s)}}function hu(i,e,t,a){if(i.position=e.keyPosition,$n(a))Cn(i,e,t,a);else if(a.nodeKind==="sequence"&&Array.isArray(t))for(const s of t)Cn(i,e,s,e.tag);else Ee(i,"cannot merge mappings; the provided source object is unacceptable")}function pu(i,e,t,a,s){if(i.position=e.keyPosition,t===Ka){hu(i,e,a,s);return}!i.json&&e.tag.has(e.value,t)&&!e.overridable?.has(t)&&Ee(i,"duplicated mapping key");const r=e.tag.addPair(e.value,t,a);r&&Ee(i,r),e.overridable?.delete(t)}function os(i,e,t){const a=i.frames[i.frames.length-1];if(a.kind==="document")a.value=e,a.hasValue=!0;else if(a.kind==="sequence"){a.merge&&($n(t)||Ee(i,"cannot merge mappings; the provided source object is unacceptable"));const s=a.tag.addItem(a.value,e,a.index++);s&&Ee(i,s)}else if(a.hasKey){const s=a.key;a.key=void 0,a.hasKey=!1,pu(i,a,s,e,t)}else a.key=e,a.keyPosition=i.position,a.hasKey=!0}function ls(i,e,t,a,s){if(e.anchorStart!==Mt){const r={value:t,tag:a,isValueFinal:s};return i.anchors.set(i.source.slice(e.anchorStart,e.anchorEnd),r),r}return null}function _u(i,e){const t={...ns,...e,events:i,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;t.eventIndex<t.events.length;){const a=t.events[t.eventIndex++];switch(t.position=cu(a),a.type){case 1:t.anchors=new Map,t.aliasCount=0,t.tagHandlers=Object.create(null);for(const s of a.directives)s.kind==="tag"&&(t.tagHandlers[s.handle]=s.prefix);t.frames.push({kind:"document",position:t.position,value:void 0,hasValue:!1});break;case 4:{const{value:s,tag:r}=uu(t,a);ls(t,a,s,r,!0),os(t,s,r);break}case 2:{const s=An(t,a,t.schema.exact.sequence,t.schema.prefix.sequence,"tag:yaml.org,2002:seq","sequence"),r=s.tag.create(s.tagName),n=ls(t,a,r,s.tag,s.tag.carrierIsResult),o=t.frames[t.frames.length-1],l=o!==void 0&&o.kind==="mapping"&&o.hasKey&&o.key===Ka;t.frames.push({kind:"sequence",position:t.position,value:r,tag:s.tag,anchor:n,index:0,merge:l});break}case 3:{const s=An(t,a,t.schema.exact.mapping,t.schema.prefix.mapping,"tag:yaml.org,2002:map","mapping"),r=s.tag.create(s.tagName),n=ls(t,a,r,s.tag,s.tag.carrierIsResult);t.frames.push({kind:"mapping",position:t.position,value:r,tag:s.tag,anchor:n,key:void 0,keyPosition:t.position,hasKey:!1,overridable:null});break}case 5:{t.maxAliases!==-1&&++t.aliasCount>t.maxAliases&&Ee(t,`aliases exceeded maxAliases (${t.maxAliases})`);const s=t.source.slice(a.anchorStart,a.anchorEnd),r=t.anchors.get(s);r||Ee(t,`unidentified alias "${s}"`),r.isValueFinal||Ee(t,`recursive alias "${s}" is not supported for tag ${r.tag.tagName} because it uses finalize()`),os(t,r.value,r.tag);break}case 6:{const s=t.frames.pop();if(s.kind==="document")t.documents.push(s.value);else{const r=s.tag.carrierIsResult?s.value:Sn(t,s.position,s.tag,s.value);s.anchor&&(s.anchor.value=r,s.anchor.isValueFinal=!0),os(t,r,s.tag)}break}}}return t.documents}var H=-1,In=Object.prototype.hasOwnProperty,Pt=1,cs=2,Tn=3,ta=4,mu=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,gu=/[,\[\]{}]/,Mn=/^(?:!|!!|![0-9A-Za-z-]+!)$/,ds=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Pn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,fu=new RegExp(`^(?:${ds})*$`),yu=new RegExp(`^(?:${Pn})+$`),vu=new RegExp(`^(?:!(?:${ds})*|${Pn}(?:${ds})*)$`),us={filename:"",maxDepth:100};function bu(i,e,t){i.events.push({type:1,explicitStart:e,explicitEnd:t,directives:i.directives})}function zn(i,e,t,a,s,r,n){i.events.push({type:2,start:e,anchorStart:t,anchorEnd:a,tagStart:s,tagEnd:r,style:n})}function hs(i,e,t,a,s,r,n){i.events.push({type:3,start:e,anchorStart:t,anchorEnd:a,tagStart:s,tagEnd:r,style:n})}function jn(i,e){i.events.splice(e.eventsLength,0,{type:3,start:e.position,anchorStart:H,anchorEnd:H,tagStart:H,tagEnd:H,style:2})}function zt(i,e,t,a,s,r,n,o,l=1,c=-1,d=!1){i.events.push({type:4,valueStart:e,valueEnd:t,anchorStart:a,anchorEnd:s,tagStart:r,tagEnd:n,style:o,chomping:l,indent:c,fast:d})}function xu(i,e,t){i.events.push({type:5,anchorStart:e,anchorEnd:t})}function jt(i){i.events.push({type:6})}function ye(i){zt(i,H,H,H,H,H,H,1)}function Dn(){return{anchorStart:H,anchorEnd:H,tagStart:H,tagEnd:H}}function di(i){return{position:i.position,line:i.line,lineStart:i.lineStart,lineIndent:i.lineIndent,firstTabInLine:i.firstTabInLine,eventsLength:i.events.length}}function Dt(i,e){i.position=e.position,i.line=e.line,i.lineStart=e.lineStart,i.lineIndent=e.lineIndent,i.firstTabInLine=e.firstTabInLine,i.events.length=e.eventsLength}function A(i,e){Ji(i.input.slice(0,i.length),i.position,e,i.filename)}function de(i){return i===10||i===13}function ut(i){return i===9||i===32}function De(i){return ut(i)||de(i)}function Ne(i){return i===0||De(i)}function ht(i){return i===44||i===91||i===93||i===123||i===125}function wu(i){return i>=48&&i<=57?i-48:-1}function ku(i){if(i>=48&&i<=57)return i-48;const e=i|32;return e>=97&&e<=102?e-97+10:-1}function Eu(i){return i===120?2:i===117?4:i===85?8:0}function Su(i){return i===48||i===97||i===98||i===116||i===9||i===110||i===118||i===102||i===114||i===101||i===32||i===34||i===47||i===92||i===78||i===95||i===76||i===80}function ia(i){i.input.charCodeAt(i.position)===10?i.position++:(i.position++,i.input.charCodeAt(i.position)===10&&i.position++),i.line++,i.lineStart=i.position,i.lineIndent=0,i.firstTabInLine=-1}function ve(i,e){let t=0,a=i.input.charCodeAt(i.position),s=i.position===i.lineStart||De(i.input.charCodeAt(i.position-1));for(;a!==0;){for(;ut(a);)s=!0,a===9&&i.firstTabInLine===-1&&(i.firstTabInLine=i.position),a=i.input.charCodeAt(++i.position);if(e&&s&&a===35)do a=i.input.charCodeAt(++i.position);while(!de(a)&&a!==0);if(!de(a))break;for(ia(i),t++,s=!0,a=i.input.charCodeAt(i.position);a===32;)i.lineIndent++,a=i.input.charCodeAt(++i.position)}return t}function Ke(i,e=i.position){const t=i.input.charCodeAt(e);if((t===45||t===46)&&t===i.input.charCodeAt(e+1)&&t===i.input.charCodeAt(e+2)){const a=i.input.charCodeAt(e+3);return a===0||De(a)}return!1}function Fn(i){let e=i.input.charCodeAt(i.position);for(;e!==0&&!de(e);)e=i.input.charCodeAt(++i.position)}function Rn(i,e,t){mu.test(i.input.slice(e,t))&&A(i,"the stream contains non-printable characters")}function Au(i,e,t){if(i.input.charCodeAt(i.position)!==33)return!1;e.tagStart!==H&&A(i,"duplication of a tag property");const a=i.position;let s=!1,r=!1,n="!",o=i.input.charCodeAt(++i.position);o===60?(s=!0,o=i.input.charCodeAt(++i.position)):o===33&&(r=!0,n="!!",o=i.input.charCodeAt(++i.position));let l=i.position,c;if(s){for(;o!==0&&o!==62;)o=i.input.charCodeAt(++i.position);o!==62&&A(i,"unexpected end of the stream within a verbatim tag"),c=i.input.slice(l,i.position),i.position++}else{for(;o!==0&&!De(o)&&!(t&&ht(o));)o===33&&(r?A(i,"tag suffix cannot contain exclamation marks"):(n=i.input.slice(l-1,i.position+1),Mn.test(n)||A(i,"named tag handle cannot contain such characters"),r=!0,l=i.position+1)),o=i.input.charCodeAt(++i.position);c=i.input.slice(l,i.position),gu.test(c)&&A(i,"tag suffix cannot contain flow indicator characters")}return c&&!(s?fu.test(c):yu.test(c))&&A(i,`tag name cannot contain such characters: ${c}`),!s&&n!=="!"&&n!=="!!"&&!In.call(i.tagHandlers,n)&&A(i,`undeclared tag handle "${n}"`),e.tagStart=a,e.tagEnd=i.position,!0}function $u(i,e){if(i.input.charCodeAt(i.position)!==38)return!1;e.anchorStart!==H&&A(i,"duplication of an anchor property"),i.position++;const t=i.position;for(;i.input.charCodeAt(i.position)!==0&&!De(i.input.charCodeAt(i.position))&&!ht(i.input.charCodeAt(i.position));)i.position++;return i.position===t&&A(i,"name of an anchor node must contain at least one character"),e.anchorStart=t,e.anchorEnd=i.position,!0}function Cu(i,e){if(i.input.charCodeAt(i.position)!==42)return!1;(e.anchorStart!==H||e.tagStart!==H)&&A(i,"alias node should not have any properties"),i.position++;const t=i.position;for(;i.input.charCodeAt(i.position)!==0&&!De(i.input.charCodeAt(i.position))&&!ht(i.input.charCodeAt(i.position));)i.position++;return i.position===t&&A(i,"name of an alias node must contain at least one character"),xu(i,t,i.position),!0}function ps(i,e){ve(i,!1),i.lineIndent<e&&A(i,"deficient indentation")}function Iu(i,e,t){if(i.input.charCodeAt(i.position)!==39)return!1;i.position++;const a=i.position;let s=!0;for(;i.input.charCodeAt(i.position)!==0;){const r=i.input.charCodeAt(i.position);if(r===39){if(i.input.charCodeAt(i.position+1)===39){s=!1,i.position+=2;continue}const n=i.position;return i.position++,zt(i,a,n,t.anchorStart,t.anchorEnd,t.tagStart,t.tagEnd,2,1,-1,s),!0}de(r)?(s=!1,ps(i,e)):i.position===i.lineStart&&Ke(i)?A(i,"unexpected end of the document within a single quoted scalar"):r!==9&&r<32?A(i,"expected valid JSON character"):i.position++}A(i,"unexpected end of the stream within a single quoted scalar")}function Tu(i,e,t){if(i.input.charCodeAt(i.position)!==34)return!1;i.position++;const a=i.position;let s=!0;for(;i.input.charCodeAt(i.position)!==0;){const r=i.input.charCodeAt(i.position);if(r===34){const n=i.position;return i.position++,zt(i,a,n,t.anchorStart,t.anchorEnd,t.tagStart,t.tagEnd,3,1,-1,s),!0}if(r===92){s=!1;const n=i.input.charCodeAt(++i.position);if(de(n))ps(i,e);else if(Su(n))i.position++;else{let o=Eu(n);for(o===0&&A(i,"unknown escape sequence");o-- >0;)i.position++,ku(i.input.charCodeAt(i.position))<0&&A(i,"expected hexadecimal character");i.position++}}else de(r)?(s=!1,ps(i,e)):i.position===i.lineStart&&Ke(i)?A(i,"unexpected end of the document within a double quoted scalar"):r!==9&&r<32?A(i,"expected valid JSON character"):i.position++}A(i,"unexpected end of the stream within a double quoted scalar")}function Mu(i,e,t){const a=i.input.charCodeAt(i.position);let s=1,r=-1,n=!1;if(a!==124&&a!==62)return!1;const o=a===124?4:5;for(i.position++;i.input.charCodeAt(i.position)!==0;){const _=i.input.charCodeAt(i.position),m=wu(_);if(_===43||_===45)s!==1&&A(i,"repeat of a chomping mode identifier"),s=_===43?3:2,i.position++;else if(m>=0)m===0&&A(i,"bad explicit indentation width of a block scalar; it cannot be less than one"),n&&A(i,"repeat of an indentation width identifier"),r=e+m-1,n=!0,i.position++;else break}let l=!1;for(;ut(i.input.charCodeAt(i.position));)l=!0,i.position++;l&&i.input.charCodeAt(i.position)===35&&Fn(i),de(i.input.charCodeAt(i.position))?ia(i):i.input.charCodeAt(i.position)!==0&&A(i,"a line break is expected");let c=n?r:-1,d=0;const h=i.position;let p=i.position;for(;i.input.charCodeAt(i.position)!==0;){const _=i.position;let m=0;for(;i.input.charCodeAt(_+m)===32;)m++;const f=i.input.charCodeAt(_+m);if(f===0){c>=0?m>c&&(p=_+m):m>0&&(p=_+m);break}if(_===i.lineStart&&Ke(i,_))break;if(!n&&c===-1&&de(f)&&(d=Math.max(d,m)),!n&&c===-1&&!de(f)&&(f===9&&m<e&&(i.position=_+m,A(i,"tab characters must not be used in indentation")),m<d&&(i.position=_+m,A(i,"bad indentation of a mapping entry"))),c===-1&&f!==0&&!de(f)&&m<e){i.lineIndent=m,i.position=_+m;break}!n&&f!==0&&!de(f)&&c===-1&&(c=m);const y=c===-1?e+1:c;if(f!==0&&!de(f)&&m<y){i.lineIndent=m,i.position=_+m;break}Fn(i),p=i.position,de(i.input.charCodeAt(i.position))&&(ia(i),p=i.position)}return Rn(i,h,p),zt(i,h,p,t.anchorStart,t.anchorEnd,t.tagStart,t.tagEnd,o,s,c),!0}function Pu(i,e){const t=i.input.charCodeAt(i.position),a=e===Pt;if(t===0||De(t)||t===35||t===38||t===42||t===33||t===124||t===62||t===39||t===34||t===37||t===64||t===96||a&&ht(t))return!1;if(t===63||t===45){const s=i.input.charCodeAt(i.position+1);if(Ne(s)||a&&ht(s))return!1}return!0}function zu(i,e,t,a){if(!Pu(i,t))return!1;const s=i.position;let r=i.position,n=i.input.charCodeAt(i.position);const o=t===Pt;let l=!1;for(;n!==0&&!(i.position===i.lineStart&&Ke(i));){if(n===58){const c=i.input.charCodeAt(i.position+1);if(Ne(c)||o&&ht(c))break}else if(n===35){if(De(i.input.charCodeAt(i.position-1)))break}else{if(o&&ht(n))break;if(de(n)){const c=i.position,d=i.line,h=i.lineStart,p=i.lineIndent;if(ve(i,!1),i.lineIndent>=e){l=!0,n=i.input.charCodeAt(i.position);continue}i.position=c,i.line=d,i.lineStart=h,i.lineIndent=p;break}}ut(n)||(r=i.position+1),n=i.input.charCodeAt(++i.position)}return r===s?!1:(Rn(i,s,r),zt(i,s,r,a.anchorStart,a.anchorEnd,a.tagStart,a.tagEnd,1,1,-1,!l),!0)}function ui(i,e){const t=i.line;ve(i,!0),(i.line>t&&i.lineIndent<e||i.firstTabInLine!==-1&&i.lineIndent<e)&&A(i,"deficient indentation")}function ju(i,e,t){const a=i.input.charCodeAt(i.position),s=a===123,r=i.position;let n=!0;if(a!==91&&a!==123)return!1;const o=s?125:93;for(s?hs(i,r,t.anchorStart,t.anchorEnd,t.tagStart,t.tagEnd,2):zn(i,r,t.anchorStart,t.anchorEnd,t.tagStart,t.tagEnd,2),i.position++;i.input.charCodeAt(i.position)!==0;){ui(i,e);let l=i.input.charCodeAt(i.position);if(l===o)return i.position++,jt(i),!0;n?l===44&&A(i,"expected the node content, but found ','"):A(i,"missed comma between flow collection entries");let c=!1,d=!1;l===63&&De(i.input.charCodeAt(i.position+1))&&(c=d=!0,i.position+=1,ui(i,e));const h=i.line,p=di(i),_=pt(i,e,Pt,!1,!0);ui(i,e),l=i.input.charCodeAt(i.position),(s||d||i.line===h)&&l===58?(c=!0,i.position++,ui(i,e),s||jn(i,p),_||ye(i),pt(i,e,Pt,!1,!0)||ye(i),ui(i,e),s||jt(i)):s&&c?(_||ye(i),ye(i)):s?ye(i):c&&(jn(i,p),_||ye(i),ye(i),jt(i)),l=i.input.charCodeAt(i.position),l===44?(n=!0,i.position++):n=!1}A(i,"unexpected end of the stream within a flow collection")}function On(i,e,t){if(i.firstTabInLine!==-1||i.input.charCodeAt(i.position)!==45||!Ne(i.input.charCodeAt(i.position+1)))return!1;for(zn(i,i.position,t.anchorStart,t.anchorEnd,t.tagStart,t.tagEnd,1);i.input.charCodeAt(i.position)===45&&Ne(i.input.charCodeAt(i.position+1));){i.firstTabInLine!==-1&&(i.position=i.firstTabInLine,A(i,"tab characters must not be used in indentation"));const a=i.line;i.position++;const s=ve(i,!0)>0;if(i.firstTabInLine!==-1&&i.input.charCodeAt(i.position)===45&&Ne(i.input.charCodeAt(i.position+1))&&A(i,"bad indentation of a sequence entry"),s&&i.lineIndent<=e?ye(i):pt(i,e,Tn,!1,!0),ve(i,!0),i.lineIndent<e||i.position>=i.length)break;i.lineIndent>e&&A(i,"bad indentation of a sequence entry"),i.line===a&&i.input.charCodeAt(i.position)===45&&Ne(i.input.charCodeAt(i.position+1))&&A(i,"bad indentation of a sequence entry")}return jt(i),!0}function _s(i,e,t,a){let s=!1,r=!1,n=!1,o=!1;if(i.firstTabInLine!==-1)return!1;let l=i.input.charCodeAt(i.position);for(;l!==0;){!s&&i.firstTabInLine!==-1&&(i.position=i.firstTabInLine,A(i,"tab characters must not be used in indentation"));const c=i.input.charCodeAt(i.position+1),d=i.line;if((l===63||l===58)&&Ne(c))n||(hs(i,i.position,a.anchorStart,a.anchorEnd,a.tagStart,a.tagEnd,1),n=!0),l===63?(s&&ye(i),r=!0,s=!0):(s||(ye(i),r=!0),s=!1),i.position+=1,o=!0;else{s&&(ye(i),s=!1);const h=di(i);if(!pt(i,t,cs,!1,!0))break;if(i.line===d){for(l=i.input.charCodeAt(i.position);ut(l);)l=i.input.charCodeAt(++i.position);if(l===58){if(l=i.input.charCodeAt(++i.position),Ne(l)||A(i,"a whitespace character is expected after the key-value separator within a block mapping"),!n){for(Dt(i,h),hs(i,h.position,a.anchorStart,a.anchorEnd,a.tagStart,a.tagEnd,1),n=!0,pt(i,t,cs,!1,!0),l=i.input.charCodeAt(i.position);ut(l);)l=i.input.charCodeAt(++i.position);i.position++}r=!0,s=!1,o=!1}else if(r)A(i,"expected ':' after a mapping key");else return a.anchorStart!==H||a.tagStart!==H?(Dt(i,h),!1):!0}else if(r)A(i,"can not read a block mapping entry; a multiline key may not be an implicit key");else return a.anchorStart!==H||a.tagStart!==H?(Dt(i,h),!1):!0}if(pt(i,e,ta,!0,o)&&(o=!1),s||o&&(ye(i),o=!1),ve(i,!0),l=i.input.charCodeAt(i.position),(i.line===d||i.lineIndent>e)&&l!==0)A(i,"bad indentation of a mapping entry");else if(i.lineIndent<e)break}return r?(s&&ye(i),n&&jt(i),!0):!1}function pt(i,e,t,a,s,r=!0){i.depth>=i.maxDepth&&A(i,`nesting exceeded maxDepth (${i.maxDepth})`),i.depth++;let n=1,o=!1,l=!1,c=null;const d=Dn();let h=t===ta||t===Tn,p=h;const _=h;if(a&&ve(i,!0)&&(o=!0,i.lineIndent>e?n=1:i.lineIndent===e?n=0:n=-1),i.position===i.lineStart&&Ke(i))return i.depth--,!1;if(n===1)for(;;){const m=i.input.charCodeAt(i.position),f=di(i);if(o&&n!==1&&(m===33||m===38))break;if(o&&_&&(d.tagStart!==H||d.anchorStart!==H)&&(m===33||m===38)){const y=di(i),b=e+1;if(_s(i,i.position-i.lineStart,b,d)&&i.events[y.eventsLength]?.type===3)return i.depth--,!0;Dt(i,y)}if(o&&(m===33&&d.tagStart!==H||m===38&&d.anchorStart!==H)||!Au(i,d,t===Pt)&&!$u(i,d))break;c===null&&(c=f),ve(i,!0)?(o=!0,p=_,i.lineIndent>e?n=1:i.lineIndent===e?n=0:n=-1):p=!1}if(p&&(p=o||s),n===1||t===ta){const m=t===Pt||t===cs?e:e+1,f=i.position-i.lineStart;if(n===1)if(p&&(On(i,f,d)||_s(i,f,m,d))||ju(i,m,d))l=!0;else{const y=i.input.charCodeAt(i.position);if(c!==null&&r&&_&&!p&&y!==124&&y!==62){const b=di(i),k=c.position-c.lineStart;Dt(i,c),_s(i,k,m,Dn())&&i.events[b.eventsLength]?.type===3?l=!0:Dt(i,b)}!l&&(h&&Mu(i,m,d)||Iu(i,m,d)||Tu(i,m,d)||Cu(i,d)||zu(i,m,t,d))&&(l=!0)}else n===0&&(l=p&&On(i,f,d))}return h=h&&!l,!l&&(d.anchorStart!==H||d.tagStart!==H||h)&&(zt(i,H,H,d.anchorStart,d.anchorEnd,d.tagStart,d.tagEnd,1),l=!0),i.depth--,l||d.anchorStart!==H||d.tagStart!==H}function Du(i){if(i.lineIndent>0||i.input.charCodeAt(i.position)!==37)return!1;i.position++;const e=i.position;for(;i.input.charCodeAt(i.position)!==0&&!De(i.input.charCodeAt(i.position));)i.position++;const t=i.input.slice(e,i.position),a=[];for(t.length===0&&A(i,"directive name must not be less than one character in length");i.input.charCodeAt(i.position)!==0&&!de(i.input.charCodeAt(i.position));){for(;ut(i.input.charCodeAt(i.position));)i.position++;if(i.input.charCodeAt(i.position)===35||de(i.input.charCodeAt(i.position))||i.input.charCodeAt(i.position)===0)break;const s=i.position;for(;i.input.charCodeAt(i.position)!==0&&!De(i.input.charCodeAt(i.position));)i.position++;a.push(i.input.slice(s,i.position))}if(de(i.input.charCodeAt(i.position))&&ia(i),t==="YAML"){i.directives.some(r=>r.kind==="yaml")&&A(i,"duplication of %YAML directive"),a.length!==1&&A(i,"YAML directive accepts exactly one argument");const s=/^([0-9]+)\.([0-9]+)$/.exec(a[0]);s===null&&A(i,"ill-formed argument of the YAML directive"),parseInt(s[1],10)!==1&&A(i,"unacceptable YAML version of the document"),i.directives.push({kind:"yaml",version:a[0]})}else if(t==="TAG"){a.length!==2&&A(i,"TAG directive accepts exactly two arguments");const[s,r]=a;Mn.test(s)||A(i,"ill-formed tag handle (first argument) of the TAG directive"),In.call(i.tagHandlers,s)&&A(i,`there is a previously declared suffix for "${s}" tag handle`),vu.test(r)||A(i,"ill-formed tag prefix (second argument) of the TAG directive"),i.tagHandlers[s]=r,i.directives.push({kind:"tag",handle:s,prefix:r})}return!0}function Fu(i){i.directives=[],i.tagHandlers=Object.create(null);let e=!1;for(ve(i,!0);Du(i);)e=!0,ve(i,!0);let t=!1,a=!1,s=!0;if(i.lineIndent===0&&i.input.charCodeAt(i.position)===45&&i.input.charCodeAt(i.position+1)===45&&i.input.charCodeAt(i.position+2)===45&&Ne(i.input.charCodeAt(i.position+3))){t=!0;const o=i.line;i.position+=3,ve(i,!0),s=i.line>o}else e&&A(i,"directives end mark is expected");const r=i.events.length;if(!t&&i.position===i.lineStart&&i.input.charCodeAt(i.position)===46&&Ke(i)){i.position+=3,ve(i,!0);return}if(bu(i,t,!1),pt(i,i.lineIndent-1,ta,!1,s,s)||ye(i),ve(i,!0),i.position===i.lineStart&&Ke(i)&&(a=i.input.charCodeAt(i.position)===46,a)){const o=i.line;i.position+=3,ve(i,!0),i.line===o&&i.position<i.length&&A(i,"end of the stream or a document separator is expected")}const n=i.events[r];n?.type===1&&(n.explicitEnd=a),jt(i),!a&&i.position<i.length&&!(i.position===i.lineStart&&Ke(i))&&A(i,"end of the stream or a document separator is expected")}function Ru(i,e){const t=i.length,a={...us,...e,input:`${i}\0`,length:t,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},s=i.indexOf("\0");for(s!==-1&&Ji(i,s,"null byte is not allowed in input",a.filename),a.input.charCodeAt(a.position)===65279&&a.position++;a.position<a.length&&(ve(a,!0),!(a.position>=a.length));){const r=a.position;Fu(a),a.position===r&&A(a,"can not read a document")}return a.events}var Ou={...us,...ns};function Lu(i,e={}){const t={...Ou,...e},a=String(i),s=Object.keys(us),r=Object.keys(ns);return _u(Ru(a,es(t,s)),{...es(t,r),source:a})}function qu(i,e){const t=Lu(i,e);if(t.length===0)throw new ci("expected a document, but the input is empty");if(t.length===1)return t[0];throw new ci("expected a single document in the stream, but found more")}var aa=class{constructor(){ce(this,"tagged",!1);ce(this,"flow",!1);ce(this,"singleQuoted",!1);ce(this,"doubleQuoted",!1);ce(this,"literal",!1);ce(this,"folded",!1)}},_t=Symbol("INVALID");function Nu(i){const e=new Set([i.defaultScalarTag,i.defaultSequenceTag,i.defaultMappingTag].filter(r=>r!==void 0)),t=i.implicitScalarTags,a=i.tags.filter(r=>!(r.nodeKind==="scalar"&&r.implicit)&&!e.has(r)),s=i.tags.filter(r=>e.has(r));return[...t.map(r=>({tag:r,implicitTag:!0})),...a.map(r=>({tag:r,implicitTag:!1})),...s.map(r=>({tag:r,implicitTag:!0}))]}function Vu(i,e){for(let t=0,a=i.representTypes.length;t<a;t+=1){const{tag:s,implicitTag:r}=i.representTypes[t];if(s.identify&&s.identify(e)){let n;return s.matchByTagPrefix&&s.representTagName?n=s.representTagName(e):n=s.tagName,{tag:s,tagName:n,implicitTag:r}}}return null}function hi(i,e){if(!i.noRefs&&e!==null&&typeof e=="object"){const d=i.refs.get(e);if(d)return d.anchor===void 0&&(d.anchor=`ref_${i.refCounter++}`),{kind:"alias",tag:"",style:new aa,anchor:d.anchor}}const t=Vu(i,e);if(!t){if(e===void 0||i.skipInvalid)return _t;throw new ci(`unacceptable kind of an object to dump ${Object.prototype.toString.call(e)}`)}const{tag:a,tagName:s,implicitTag:r}=t,n=r?s:En(s);if(a.nodeKind==="scalar"){const d=new aa;return d.tagged=!r,{kind:"scalar",tag:n,style:d,value:a.represent(e)}}if(a.nodeKind==="sequence"){const d=a.represent(e),h=new aa;h.tagged=!r;const p={kind:"sequence",tag:n,style:h,items:[]};i.noRefs||i.refs.set(e,p);for(let _=0,m=d.length;_<m;_+=1){let f=hi(i,d[_]);f===_t&&d[_]===void 0&&(f=hi(i,null)),f!==_t&&p.items.push(f)}return p}const o=a.represent(e),l=new aa;l.tagged=!r;const c={kind:"mapping",tag:n,style:l,items:[]};i.noRefs||i.refs.set(e,c);for(const[d,h]of o){const p=hi(i,d);if(p===_t)continue;const _=hi(i,h);_!==_t&&c.items.push({key:p,value:_})}return c}function Uu(i,e,t={}){const a=hi({representTypes:Nu(e),noRefs:t.noRefs??!1,skipInvalid:t.skipInvalid??!1,refs:new Map,refCounter:0},i);return[{contents:a===_t?null:a,directives:[]}]}var Bu=Symbol("visit:break"),Ln=Symbol("visit:skip");function sa(i,e,t){const a=e(i,t);if(a===Bu)return!0;if(a===Ln)return!1;const s=t.depth+1;switch(i.kind){case"sequence":for(const r of i.items)if(sa(r,e,{depth:s,parent:i,isKey:!1}))return!0;break;case"mapping":for(const{key:r,value:n}of i.items)if(sa(r,e,{depth:s,parent:i,isKey:!0})||sa(n,e,{depth:s,parent:i,isKey:!1}))return!0;break}return!1}function Hu(i,e){for(const t of i)if(t.contents&&sa(t.contents,e,{depth:0,parent:null,isKey:!1}))return}var ms=65279,Gu=9,mt=10,qn=13,Qu=32,Wu=33,Nn=34,gs=35,Yu=37,Ku=38,Vn=39,Zu=42,fs=44,ys=45,pi=58,Ju=61,Xu=62,Un=63,eh=64,vs=91,bs=93,th=96,xs=123,ih=124,ws=125,_e={};_e[0]="\\0",_e[7]="\\a",_e[8]="\\b",_e[9]="\\t",_e[10]="\\n",_e[11]="\\v",_e[12]="\\f",_e[13]="\\r",_e[27]="\\e",_e[34]='\\"',_e[92]="\\\\",_e[133]="\\N",_e[160]="\\_",_e[8232]="\\L",_e[8233]="\\P";var ks={indent:2,seqNoIndent:!1,seqInlineFirst:!0,sortKeys:!1,lineWidth:80,flowBracketPadding:!1,flowSkipCommaSpace:!1,flowSkipColonSpace:!1,quoteFlowKeys:!1,quoteStyle:"single",forceQuotes:!1,tagBeforeAnchor:!1};function ah(i){return i.style.tagged?i.tag:En(i.tag)}function sh(i){const e={...ks,...i};return{...e,defaultScalarTagName:e.schema.defaultScalarTag.tagName,implicitResolvers:e.schema.implicitScalarTags}}function rh(i){const e=i.toString(16).toUpperCase(),t=i<=255?"x":"u",a=i<=255?2:4;return`\\${t}${"0".repeat(a-e.length)}${e}`}function Bn(i,e){const t=" ".repeat(e);let a=0,s="";const r=i.length;for(;a<r;){let n;const o=i.indexOf(`
`,a);o===-1?(n=i.slice(a),a=r):(n=i.slice(a,o+1),a=o+1),n.length&&n!==`
`&&(s+=t),s+=n}return s}function Es(i,e){return`
${" ".repeat(i.indent*e)}`}function nh(i,e){const t=i.indent*Math.max(1,e);return{indent:t,blockIndent:e===0?i.indent+1:i.indent,lineWidth:i.lineWidth===-1?-1:Math.max(Math.min(i.lineWidth,40),i.lineWidth-t)}}function Hn(i,e){for(let t=0,a=i.implicitResolvers.length;t<a;t+=1){const s=i.implicitResolvers[t];if(s.resolve(e,!1,s.tagName)!==U)return s.tagName}return i.defaultScalarTagName}function Ft(i){return i===Qu||i===Gu}function oh(i){const e=i.charCodeAt(0);if(e!==ys&&e!==46||i.charCodeAt(1)!==e||i.charCodeAt(2)!==e)return!1;if(i.length===3)return!0;const t=i.charCodeAt(3);return Ft(t)||t===qn||t===mt}function _i(i){return i>=32&&i<=126||i>=161&&i<=55295&&i!==8232&&i!==8233||i>=57344&&i<=65533&&i!==ms||i>=65536&&i<=1114111}function Gn(i){return _i(i)&&i!==ms&&i!==qn&&i!==mt}function Ss(i,e,t){const a=Gn(i),s=a&&!Ft(i);return(t?a:a&&i!==fs&&i!==vs&&i!==bs&&i!==xs&&i!==ws)&&i!==gs&&!(e===pi&&!s)||Gn(e)&&!Ft(e)&&i===gs||e===pi&&s&&(t||i!==fs&&i!==vs&&i!==bs&&i!==xs&&i!==ws)}function lh(i){return _i(i)&&i!==ms&&!Ft(i)&&i!==ys&&i!==Un&&i!==pi&&i!==fs&&i!==vs&&i!==bs&&i!==xs&&i!==ws&&i!==gs&&i!==Ku&&i!==Zu&&i!==Wu&&i!==ih&&i!==Ju&&i!==Xu&&i!==Vn&&i!==Nn&&i!==Yu&&i!==eh&&i!==th}function ch(i,e){const t=Rt(i,0);if(lh(t))return!0;if(i.length>1&&(t===ys||t===Un||t===pi)){const a=Rt(i,1);return!Ft(a)&&Ss(a,t,e)}return!1}function dh(i){return!Ft(i)&&i!==pi}function Rt(i,e){const t=i.charCodeAt(e);let a;return t>=55296&&t<=56319&&e+1<i.length&&(a=i.charCodeAt(e+1),a>=56320&&a<=57343)?(t-55296)*1024+a-56320+65536:t}function Qn(i){return/^\n* /.test(i)}var mi=1,gi=2,As=3,$s=4,Ze=5;function uh(i,e,t,a,s,r){const{blockIndent:n,lineWidth:o}=t;let l,c=0,d=-1,h=!1,p=!1;const _=o!==-1;let m=-1,f=!oh(e)&&ch(e,r)&&dh(Rt(e,e.length-1));if(a||s)for(l=0;l<e.length;c>=65536?l+=2:l++){if(c=Rt(e,l),!_i(c))return Ze;f=f&&Ss(c,d,r),d=c}else{for(l=0;l<e.length;c>=65536?l+=2:l++){if(c=Rt(e,l),c===mt)h=!0,_&&(p=p||l-m-1>o&&e[m+1]!==" ",m=l);else if(!_i(c))return Ze;f=f&&Ss(c,d,r),d=c}p=p||_&&l-m-1>o&&e[m+1]!==" "}return!h&&!p?f&&!s?mi:i.quoteStyle==="double"?Ze:gi:n>9&&Qn(e)?Ze:p?$s:As}function hh(i,e,t){const{indent:a,blockIndent:s,lineWidth:r}=t;switch(e){case mi:return Yn(i,a);case gi:return`'${Yn(i,a).replace(/'/g,"''")}'`;case As:return"|"+Wn(i,s)+Kn(Bn(i,a));case $s:return">"+Wn(i,s)+Kn(Bn(_h(i,r),a));case Ze:return`"${mh(i)}"`}}function ph(i,e,t,a,s){const r=a||!s;if(e.style.singleQuoted)return gi;if(e.style.doubleQuoted)return Ze;if(!r){if(e.style.literal)return As;if(e.style.folded)return $s}const n=e.value;if(n.length===0)return e.style.tagged||Hn(i,n)===e.tag?mi:i.quoteStyle==="double"?Ze:gi;const o=uh(i,n,t,r,i.forceQuotes&&!a,s);return o===mi&&!e.style.tagged&&Hn(i,n)!==e.tag?i.quoteStyle==="double"?Ze:gi:o}function Wn(i,e){const t=Qn(i)?String(e):"",a=i[i.length-1]===`
`;return`${t}${a&&(i[i.length-2]===`
`||i===`
`)?"+":a?"":"-"}
`}function Yn(i,e){let t=i.indexOf(`
`);if(t===-1)return i;const a=" ".repeat(e);let s=i.slice(0,t);const r=/(\n+)([^\n]*)/g;r.lastIndex=t;let n;for(;n=r.exec(i);){const o=n[1].length,l=n[2];s+=`
`.repeat(o+1)+a+l}return s}function Kn(i){return i[i.length-1]===`
`?i.slice(0,-1):i}function _h(i,e){const t=/(\n+)([^\n]*)/g;let a=i.indexOf(`
`);a===-1&&(a=i.length),t.lastIndex=a;let s=Zn(i.slice(0,a),e),r=i[0]===`
`||i[0]===" ",n,o;for(;o=t.exec(i);){const l=o[1],c=o[2];n=c[0]===" ",s+=l+(!r&&!n&&c!==""?`
`:"")+Zn(c,e),r=n}return s}function Zn(i,e){if(i===""||i[0]===" ")return i;const t=/ [^ ]/g;let a,s=0,r,n=0,o=0,l="";for(;a=t.exec(i);)o=a.index,o-s>e&&(r=n>s?n:o,l+=`
${i.slice(s,r)}`,s=r+1),n=o;return l+=`
`,i.length-s>e&&n>s?l+=`${i.slice(s,n)}
${i.slice(n+1)}`:l+=i.slice(s),l.slice(1)}function mh(i){let e="",t=0;for(let a=0;a<i.length;t>=65536?a+=2:a++){t=Rt(i,a);const s=_e[t];if(s){e+=s;continue}if(_i(t)){e+=i[a],t>=65536&&(e+=i[a+1]);continue}e+=rh(t)}return e}function gh(i,e,t){let a="";for(let r=0,n=t.items.length;r<n;r+=1){const o=Ve(i,e,t.items[r],{});a!==""&&(a+=`,${i.flowSkipCommaSpace?"":" "}`),a+=o}const s=i.flowBracketPadding&&a!==""?" ":"";return`[${s}${a}${s}]`}function Jn(i,e,t,a){let s="";for(let r=0,n=t.items.length;r<n;r+=1){const o=Ve(i,e+1,t.items[r],{block:!0,compact:i.seqInlineFirst,isblockseq:!0});(!a||s!=="")&&(s+=Es(i,e)),o===""||mt===o.charCodeAt(0)?s+="-":s+="- ",s+=o}return s}function fh(i,e,t){let a="";const s=Xn(i,t.items);for(const{key:n,value:o}of s){let l="";a!==""&&(l+=`,${i.flowSkipCommaSpace?"":" "}`);const c=Ve(i,e,n,{iskey:!0}),d=c.length>1024;d?l+="? ":i.quoteFlowKeys&&(l+='"');const h=Ve(i,e,o,{}),p=i.flowSkipColonSpace||h===""?"":" ";l+=`${c}${i.quoteFlowKeys&&!d?'"':""}:${p}${h}`,a+=l}const r=i.flowBracketPadding&&a!==""?" ":"";return`{${r}${a}${r}}`}function ra(i){return i.kind==="scalar"?i.value:i}function Xn(i,e){if(!i.sortKeys)return e;const t=e.slice();if(i.sortKeys===!0)t.sort((a,s)=>{const r=ra(a.key),n=ra(s.key);return r<n?-1:r>n?1:0});else{const a=i.sortKeys;t.sort((s,r)=>a(ra(s.key),ra(r.key)))}return t}function yh(i,e,t,a){let s="";const r=Xn(i,t.items);for(let n=0,o=r.length;n<o;n+=1){let l="";(!a||s!=="")&&(l+=Es(i,e));const{key:c,value:d}=r[n],h=(c.kind==="mapping"||c.kind==="sequence")&&!c.style.flow&&c.items.length!==0||c.kind==="scalar"&&(c.style.literal||c.style.folded),p=h?Ve(i,e+1,c,{block:!0,compact:!0,isblockseq:!Cs(i,c,e+1)}):Ve(i,e+1,c,{block:!0,compact:!0,iskey:!0}),_=c.kind==="scalar"&&c.value.indexOf(`
`)!==-1,m=h||_||p.length>1024;m&&(p&&mt===p.charCodeAt(0)?l+="?":l+="? "),l+=p,m&&(l+=Es(i,e));const f=Ve(i,e+1,d,{block:!0,compact:m,isblockseq:m&&!Cs(i,d,e+1)}),y=c.kind==="scalar"&&c.value===""&&p!==""&&p.charCodeAt(p.length-1)!==Vn&&p.charCodeAt(p.length-1)!==Nn,b=!m&&(c.kind==="alias"||y)?" ":"";f===""||mt===f.charCodeAt(0)?l+=`${b}:`:l+=`${b}: `,l+=f,s+=l}return s}function Cs(i,e,t){return e.style.tagged||e.anchor!==void 0||i.indent<2&&t>0}function Ve(i,e,t,a){if(t.kind==="alias")return`*${t.anchor}`;const{block:s=!1,iskey:r=!1,isblockseq:n=!1}=a;let o=a.compact??!1;const l=t.anchor!==void 0;Cs(i,t,e)&&(o=!1);let c,d=t.style.tagged;const h=s&&(t.kind==="mapping"||t.kind==="sequence")&&!t.style.flow&&t.items.length!==0;if(t.kind==="mapping")h?c=yh(i,e,t,o):c=fh(i,e,t);else if(t.kind==="sequence")h?i.seqNoIndent&&!n&&e>0?c=Jn(i,e-1,t,o):c=Jn(i,e,t,o):c=gh(i,e,t);else{const p=nh(i,e),_=ph(i,t,p,r,s);c=hh(t.value,_,p),d=t.style.tagged||_!==mi&&t.tag!==i.defaultScalarTagName}if(h&&o&&e>0&&i.indent>2&&(c=`${" ".repeat(i.indent-2)}${c}`),d||l){const p=[],_=d?ah(t):null,m=l?`&${t.anchor}`:null;i.tagBeforeAnchor?(_!==null&&p.push(_),m!==null&&p.push(m)):(m!==null&&p.push(m),_!==null&&p.push(_));const f=c===""||c.charCodeAt(0)===mt?"":" ";c=`${p.join(" ")}${f}${c}`}return c}function vh(i){return(i.kind==="sequence"||i.kind==="mapping")&&!i.style.flow&&i.items.length!==0&&!i.style.tagged&&i.anchor===void 0}function bh(i){let e=i;for(;(e.kind==="sequence"||e.kind==="mapping")&&!e.style.flow&&e.items.length!==0;)e=e.kind==="sequence"?e.items[e.items.length-1]:e.items[e.items.length-1].value;if(e.kind!=="scalar"||!(e.style.literal||e.style.folded))return!1;const{value:t}=e;return t.endsWith(`

`)||t===`
`}function xh(i){let e="";for(const t of i.directives){if(t.kind==="yaml"){e+=`%YAML ${t.version}
`;continue}const{handle:a,prefix:s}=t;e+=`%TAG ${a} ${s}
`}return e}function wh(i,e){const t=sh(e);let a="",s=!1;for(let r=0;r<i.length;r+=1){const n=i[r],o=xh(n),l=o!=="",c=n.explicitStart||l||r>0&&!s;if(a+=o,n.contents===null)c&&(a+=`---
`);else if(c){const d=Ve(t,0,n.contents,{block:!0,compact:!0}),h=d===""?"":l||vh(n.contents)?`
`:" ";a+=`---${h}${d}
`}else a+=Ve(t,0,n.contents,{block:!0,compact:!0})+`
`;s=n.explicitEnd||n.contents!==null&&bh(n.contents),s&&(a+=`...
`)}return a}var kh=Zd.withTags({...Ja,resolve:(i,e,t)=>{const a=Ja.resolve(i,e,t);return a===U?mn.resolve(i,e,t):a}},{...Xa,resolve:(i,e,t)=>{const a=Xa.resolve(i,e,t);return a===U?gn.resolve(i,e,t):a}}),Eh={...ks,schema:kh,skipInvalid:!1,noRefs:!1,flowLevel:-1,transform:()=>{}};function Sh(i,e={}){const t={...Eh,...e},a=Uu(i,t.schema,{noRefs:t.noRefs,skipInvalid:t.skipInvalid});return t.flowLevel>=0&&Hu(a,(s,r)=>{if(!(r.depth<t.flowLevel))return s.style.flow=!0,Ln}),t.transform(a),wh(a,{...es(t,Object.keys(ks)),schema:t.schema})}/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */function Ah(i,e,t){return(e=Th(e))in i?Object.defineProperty(i,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):i[e]=t,i}function Ue(){return Ue=Object.assign?Object.assign.bind():function(i){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var a in t)({}).hasOwnProperty.call(t,a)&&(i[a]=t[a])}return i},Ue.apply(null,arguments)}function eo(i,e){var t=Object.keys(i);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(i);e&&(a=a.filter(function(s){return Object.getOwnPropertyDescriptor(i,s).enumerable})),t.push.apply(t,a)}return t}function Oe(i){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?eo(Object(t),!0).forEach(function(a){Ah(i,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(i,Object.getOwnPropertyDescriptors(t)):eo(Object(t)).forEach(function(a){Object.defineProperty(i,a,Object.getOwnPropertyDescriptor(t,a))})}return i}function $h(i,e){if(i==null)return{};var t,a,s=Ch(i,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(i);for(a=0;a<r.length;a++)t=r[a],e.indexOf(t)===-1&&{}.propertyIsEnumerable.call(i,t)&&(s[t]=i[t])}return s}function Ch(i,e){if(i==null)return{};var t={};for(var a in i)if({}.hasOwnProperty.call(i,a)){if(e.indexOf(a)!==-1)continue;t[a]=i[a]}return t}function Ih(i,e){if(typeof i!="object"||!i)return i;var t=i[Symbol.toPrimitive];if(t!==void 0){var a=t.call(i,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(i)}function Th(i){var e=Ih(i,"string");return typeof e=="symbol"?e:e+""}function Is(i){"@babel/helpers - typeof";return Is=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Is(i)}var Mh="1.15.7";function Be(i){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(i)}var He=Be(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),fi=Be(/Edge/i),to=Be(/firefox/i),yi=Be(/safari/i)&&!Be(/chrome/i)&&!Be(/android/i),Ts=Be(/iP(ad|od|hone)/i),io=Be(/chrome/i)&&Be(/android/i),ao={capture:!1,passive:!1};function V(i,e,t){i.addEventListener(e,t,!He&&ao)}function q(i,e,t){i.removeEventListener(e,t,!He&&ao)}function na(i,e){if(e){if(e[0]===">"&&(e=e.substring(1)),i)try{if(i.matches)return i.matches(e);if(i.msMatchesSelector)return i.msMatchesSelector(e);if(i.webkitMatchesSelector)return i.webkitMatchesSelector(e)}catch{return!1}return!1}}function so(i){return i.host&&i!==document&&i.host.nodeType&&i.host!==i?i.host:i.parentNode}function Fe(i,e,t,a){if(i){t=t||document;do{if(e!=null&&(e[0]===">"?i.parentNode===t&&na(i,e):na(i,e))||a&&i===t)return i;if(i===t)break}while(i=so(i))}return null}var ro=/\s+/g;function Ie(i,e,t){if(i&&e)if(i.classList)i.classList[t?"add":"remove"](e);else{var a=(" "+i.className+" ").replace(ro," ").replace(" "+e+" "," ");i.className=(a+(t?" "+e:"")).replace(ro," ")}}function T(i,e,t){var a=i&&i.style;if(a){if(t===void 0)return document.defaultView&&document.defaultView.getComputedStyle?t=document.defaultView.getComputedStyle(i,""):i.currentStyle&&(t=i.currentStyle),e===void 0?t:t[e];!(e in a)&&e.indexOf("webkit")===-1&&(e="-webkit-"+e),a[e]=t+(typeof t=="string"?"":"px")}}function Ot(i,e){var t="";if(typeof i=="string")t=i;else do{var a=T(i,"transform");a&&a!=="none"&&(t=a+" "+t)}while(!e&&(i=i.parentNode));var s=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return s&&new s(t)}function no(i,e,t){if(i){var a=i.getElementsByTagName(e),s=0,r=a.length;if(t)for(;s<r;s++)t(a[s],s);return a}return[]}function Le(){var i=document.scrollingElement;return i||document.documentElement}function se(i,e,t,a,s){if(!(!i.getBoundingClientRect&&i!==window)){var r,n,o,l,c,d,h;if(i!==window&&i.parentNode&&i!==Le()?(r=i.getBoundingClientRect(),n=r.top,o=r.left,l=r.bottom,c=r.right,d=r.height,h=r.width):(n=0,o=0,l=window.innerHeight,c=window.innerWidth,d=window.innerHeight,h=window.innerWidth),(e||t)&&i!==window&&(s=s||i.parentNode,!He))do if(s&&s.getBoundingClientRect&&(T(s,"transform")!=="none"||t&&T(s,"position")!=="static")){var p=s.getBoundingClientRect();n-=p.top+parseInt(T(s,"border-top-width")),o-=p.left+parseInt(T(s,"border-left-width")),l=n+r.height,c=o+r.width;break}while(s=s.parentNode);if(a&&i!==window){var _=Ot(s||i),m=_&&_.a,f=_&&_.d;_&&(n/=f,o/=m,h/=m,d/=f,l=n+d,c=o+h)}return{top:n,left:o,bottom:l,right:c,width:h,height:d}}}function oo(i,e,t){for(var a=Je(i,!0),s=se(i)[e];a;){var r=se(a)[t],n=void 0;if(n=s>=r,!n)return a;if(a===Le())break;a=Je(a,!1)}return!1}function Lt(i,e,t,a){for(var s=0,r=0,n=i.children;r<n.length;){if(n[r].style.display!=="none"&&n[r]!==M.ghost&&(a||n[r]!==M.dragged)&&Fe(n[r],t.draggable,i,!1)){if(s===e)return n[r];s++}r++}return null}function Ms(i,e){for(var t=i.lastElementChild;t&&(t===M.ghost||T(t,"display")==="none"||e&&!na(t,e));)t=t.previousElementSibling;return t||null}function Pe(i,e){var t=0;if(!i||!i.parentNode)return-1;for(;i=i.previousElementSibling;)i.nodeName.toUpperCase()!=="TEMPLATE"&&i!==M.clone&&(!e||na(i,e))&&t++;return t}function lo(i){var e=0,t=0,a=Le();if(i)do{var s=Ot(i),r=s.a,n=s.d;e+=i.scrollLeft*r,t+=i.scrollTop*n}while(i!==a&&(i=i.parentNode));return[e,t]}function Ph(i,e){for(var t in i)if(i.hasOwnProperty(t)){for(var a in e)if(e.hasOwnProperty(a)&&e[a]===i[t][a])return Number(t)}return-1}function Je(i,e){if(!i||!i.getBoundingClientRect)return Le();var t=i,a=!1;do if(t.clientWidth<t.scrollWidth||t.clientHeight<t.scrollHeight){var s=T(t);if(t.clientWidth<t.scrollWidth&&(s.overflowX=="auto"||s.overflowX=="scroll")||t.clientHeight<t.scrollHeight&&(s.overflowY=="auto"||s.overflowY=="scroll")){if(!t.getBoundingClientRect||t===document.body)return Le();if(a||e)return t;a=!0}}while(t=t.parentNode);return Le()}function zh(i,e){if(i&&e)for(var t in e)e.hasOwnProperty(t)&&(i[t]=e[t]);return i}function Ps(i,e){return Math.round(i.top)===Math.round(e.top)&&Math.round(i.left)===Math.round(e.left)&&Math.round(i.height)===Math.round(e.height)&&Math.round(i.width)===Math.round(e.width)}var vi;function co(i,e){return function(){if(!vi){var t=arguments,a=this;t.length===1?i.call(a,t[0]):i.apply(a,t),vi=setTimeout(function(){vi=void 0},e)}}}function jh(){clearTimeout(vi),vi=void 0}function uo(i,e,t){i.scrollLeft+=e,i.scrollTop+=t}function ho(i){var e=window.Polymer,t=window.jQuery||window.Zepto;return e&&e.dom?e.dom(i).cloneNode(!0):t?t(i).clone(!0)[0]:i.cloneNode(!0)}function po(i,e,t){var a={};return Array.from(i.children).forEach(function(s){var r,n,o,l;if(!(!Fe(s,e.draggable,i,!1)||s.animated||s===t)){var c=se(s);a.left=Math.min((r=a.left)!==null&&r!==void 0?r:1/0,c.left),a.top=Math.min((n=a.top)!==null&&n!==void 0?n:1/0,c.top),a.right=Math.max((o=a.right)!==null&&o!==void 0?o:-1/0,c.right),a.bottom=Math.max((l=a.bottom)!==null&&l!==void 0?l:-1/0,c.bottom)}}),a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}var Se="Sortable"+new Date().getTime();function Dh(){var i=[],e;return{captureAnimationState:function(){if(i=[],!!this.options.animation){var a=[].slice.call(this.el.children);a.forEach(function(s){if(!(T(s,"display")==="none"||s===M.ghost)){i.push({target:s,rect:se(s)});var r=Oe({},i[i.length-1].rect);if(s.thisAnimationDuration){var n=Ot(s,!0);n&&(r.top-=n.f,r.left-=n.e)}s.fromRect=r}})}},addAnimationState:function(a){i.push(a)},removeAnimationState:function(a){i.splice(Ph(i,{target:a}),1)},animateAll:function(a){var s=this;if(!this.options.animation){clearTimeout(e),typeof a=="function"&&a();return}var r=!1,n=0;i.forEach(function(o){var l=0,c=o.target,d=c.fromRect,h=se(c),p=c.prevFromRect,_=c.prevToRect,m=o.rect,f=Ot(c,!0);f&&(h.top-=f.f,h.left-=f.e),c.toRect=h,c.thisAnimationDuration&&Ps(p,h)&&!Ps(d,h)&&(m.top-h.top)/(m.left-h.left)===(d.top-h.top)/(d.left-h.left)&&(l=Rh(m,p,_,s.options)),Ps(h,d)||(c.prevFromRect=d,c.prevToRect=h,l||(l=s.options.animation),s.animate(c,m,h,l)),l&&(r=!0,n=Math.max(n,l),clearTimeout(c.animationResetTimer),c.animationResetTimer=setTimeout(function(){c.animationTime=0,c.prevFromRect=null,c.fromRect=null,c.prevToRect=null,c.thisAnimationDuration=null},l),c.thisAnimationDuration=l)}),clearTimeout(e),r?e=setTimeout(function(){typeof a=="function"&&a()},n):typeof a=="function"&&a(),i=[]},animate:function(a,s,r,n){if(n){T(a,"transition",""),T(a,"transform","");var o=Ot(this.el),l=o&&o.a,c=o&&o.d,d=(s.left-r.left)/(l||1),h=(s.top-r.top)/(c||1);a.animatingX=!!d,a.animatingY=!!h,T(a,"transform","translate3d("+d+"px,"+h+"px,0)"),this.forRepaintDummy=Fh(a),T(a,"transition","transform "+n+"ms"+(this.options.easing?" "+this.options.easing:"")),T(a,"transform","translate3d(0,0,0)"),typeof a.animated=="number"&&clearTimeout(a.animated),a.animated=setTimeout(function(){T(a,"transition",""),T(a,"transform",""),a.animated=!1,a.animatingX=!1,a.animatingY=!1},n)}}}}function Fh(i){return i.offsetWidth}function Rh(i,e,t,a){return Math.sqrt(Math.pow(e.top-i.top,2)+Math.pow(e.left-i.left,2))/Math.sqrt(Math.pow(e.top-t.top,2)+Math.pow(e.left-t.left,2))*a.animation}var qt=[],zs={initializeByDefault:!0},bi={mount:function(e){for(var t in zs)zs.hasOwnProperty(t)&&!(t in e)&&(e[t]=zs[t]);qt.forEach(function(a){if(a.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),qt.push(e)},pluginEvent:function(e,t,a){var s=this;this.eventCanceled=!1,a.cancel=function(){s.eventCanceled=!0};var r=e+"Global";qt.forEach(function(n){t[n.pluginName]&&(t[n.pluginName][r]&&t[n.pluginName][r](Oe({sortable:t},a)),t.options[n.pluginName]&&t[n.pluginName][e]&&t[n.pluginName][e](Oe({sortable:t},a)))})},initializePlugins:function(e,t,a,s){qt.forEach(function(o){var l=o.pluginName;if(!(!e.options[l]&&!o.initializeByDefault)){var c=new o(e,t,e.options);c.sortable=e,c.options=e.options,e[l]=c,Ue(a,c.defaults)}});for(var r in e.options)if(e.options.hasOwnProperty(r)){var n=this.modifyOption(e,r,e.options[r]);typeof n<"u"&&(e.options[r]=n)}},getEventProperties:function(e,t){var a={};return qt.forEach(function(s){typeof s.eventProperties=="function"&&Ue(a,s.eventProperties.call(t[s.pluginName],e))}),a},modifyOption:function(e,t,a){var s;return qt.forEach(function(r){e[r.pluginName]&&r.optionListeners&&typeof r.optionListeners[t]=="function"&&(s=r.optionListeners[t].call(e[r.pluginName],a))}),s}};function Oh(i){var e=i.sortable,t=i.rootEl,a=i.name,s=i.targetEl,r=i.cloneEl,n=i.toEl,o=i.fromEl,l=i.oldIndex,c=i.newIndex,d=i.oldDraggableIndex,h=i.newDraggableIndex,p=i.originalEvent,_=i.putSortable,m=i.extraEventProperties;if(e=e||t&&t[Se],!!e){var f,y=e.options,b="on"+a.charAt(0).toUpperCase()+a.substr(1);window.CustomEvent&&!He&&!fi?f=new CustomEvent(a,{bubbles:!0,cancelable:!0}):(f=document.createEvent("Event"),f.initEvent(a,!0,!0)),f.to=n||t,f.from=o||t,f.item=s||t,f.clone=r,f.oldIndex=l,f.newIndex=c,f.oldDraggableIndex=d,f.newDraggableIndex=h,f.originalEvent=p,f.pullMode=_?_.lastPutMode:void 0;var k=Oe(Oe({},m),bi.getEventProperties(a,e));for(var E in k)f[E]=k[E];t&&t.dispatchEvent(f),y[b]&&y[b].call(e,f)}}var Lh=["evt"],Ae=function(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},s=a.evt,r=$h(a,Lh);bi.pluginEvent.bind(M)(e,t,Oe({dragEl:S,parentEl:te,ghostEl:z,rootEl:Z,nextEl:gt,lastDownEl:oa,cloneEl:ee,cloneHidden:Xe,dragStarted:wi,putSortable:he,activeSortable:M.active,originalEvent:s,oldIndex:Nt,oldDraggableIndex:xi,newIndex:Te,newDraggableIndex:et,hideGhostForTarget:bo,unhideGhostForTarget:xo,cloneNowHidden:function(){Xe=!0},cloneNowShown:function(){Xe=!1},dispatchSortableEvent:function(o){be({sortable:t,name:o,originalEvent:s})}},r))};function be(i){Oh(Oe({putSortable:he,cloneEl:ee,targetEl:S,rootEl:Z,oldIndex:Nt,oldDraggableIndex:xi,newIndex:Te,newDraggableIndex:et},i))}var S,te,z,Z,gt,oa,ee,Xe,Nt,Te,xi,et,la,he,Vt=!1,ca=!1,da=[],ft,Re,js,Ds,_o,mo,wi,Ut,ki,Ei=!1,ua=!1,ha,me,Fs=[],Rs=!1,pa=[],_a=typeof document<"u",ma=Ts,go=fi||He?"cssFloat":"float",qh=_a&&!io&&!Ts&&"draggable"in document.createElement("div"),fo=(function(){if(_a){if(He)return!1;var i=document.createElement("x");return i.style.cssText="pointer-events:auto",i.style.pointerEvents==="auto"}})(),yo=function(e,t){var a=T(e),s=parseInt(a.width)-parseInt(a.paddingLeft)-parseInt(a.paddingRight)-parseInt(a.borderLeftWidth)-parseInt(a.borderRightWidth),r=Lt(e,0,t),n=Lt(e,1,t),o=r&&T(r),l=n&&T(n),c=o&&parseInt(o.marginLeft)+parseInt(o.marginRight)+se(r).width,d=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+se(n).width;if(a.display==="flex")return a.flexDirection==="column"||a.flexDirection==="column-reverse"?"vertical":"horizontal";if(a.display==="grid")return a.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(r&&o.float&&o.float!=="none"){var h=o.float==="left"?"left":"right";return n&&(l.clear==="both"||l.clear===h)?"vertical":"horizontal"}return r&&(o.display==="block"||o.display==="flex"||o.display==="table"||o.display==="grid"||c>=s&&a[go]==="none"||n&&a[go]==="none"&&c+d>s)?"vertical":"horizontal"},Nh=function(e,t,a){var s=a?e.left:e.top,r=a?e.right:e.bottom,n=a?e.width:e.height,o=a?t.left:t.top,l=a?t.right:t.bottom,c=a?t.width:t.height;return s===o||r===l||s+n/2===o+c/2},Vh=function(e,t){var a;return da.some(function(s){var r=s[Se].options.emptyInsertThreshold;if(!(!r||Ms(s))){var n=se(s),o=e>=n.left-r&&e<=n.right+r,l=t>=n.top-r&&t<=n.bottom+r;if(o&&l)return a=s}}),a},vo=function(e){function t(r,n){return function(o,l,c,d){var h=o.options.group.name&&l.options.group.name&&o.options.group.name===l.options.group.name;if(r==null&&(n||h))return!0;if(r==null||r===!1)return!1;if(n&&r==="clone")return r;if(typeof r=="function")return t(r(o,l,c,d),n)(o,l,c,d);var p=(n?o:l).options.group.name;return r===!0||typeof r=="string"&&r===p||r.join&&r.indexOf(p)>-1}}var a={},s=e.group;(!s||Is(s)!="object")&&(s={name:s}),a.name=s.name,a.checkPull=t(s.pull,!0),a.checkPut=t(s.put),a.revertClone=s.revertClone,e.group=a},bo=function(){!fo&&z&&T(z,"display","none")},xo=function(){!fo&&z&&T(z,"display","")};_a&&!io&&document.addEventListener("click",function(i){if(ca)return i.preventDefault(),i.stopPropagation&&i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),ca=!1,!1},!0);var yt=function(e){if(S){e=e.touches?e.touches[0]:e;var t=Vh(e.clientX,e.clientY);if(t){var a={};for(var s in e)e.hasOwnProperty(s)&&(a[s]=e[s]);a.target=a.rootEl=t,a.preventDefault=void 0,a.stopPropagation=void 0,t[Se]._onDragOver(a)}}},Uh=function(e){S&&S.parentNode[Se]._isOutsideThisEl(e.target)};function M(i,e){if(!(i&&i.nodeType&&i.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(i));this.el=i,this.options=e=Ue({},e),i[Se]=this;var t={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(i.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return yo(i,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(n,o){n.setData("Text",o.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:M.supportPointer!==!1&&"PointerEvent"in window&&(!yi||Ts),emptyInsertThreshold:5};bi.initializePlugins(this,i,t);for(var a in t)!(a in e)&&(e[a]=t[a]);vo(e);for(var s in this)s.charAt(0)==="_"&&typeof this[s]=="function"&&(this[s]=this[s].bind(this));this.nativeDraggable=e.forceFallback?!1:qh,this.nativeDraggable&&(this.options.touchStartThreshold=1),e.supportPointer?V(i,"pointerdown",this._onTapStart):(V(i,"mousedown",this._onTapStart),V(i,"touchstart",this._onTapStart)),this.nativeDraggable&&(V(i,"dragover",this),V(i,"dragenter",this)),da.push(this.el),e.store&&e.store.get&&this.sort(e.store.get(this)||[]),Ue(this,Dh())}M.prototype={constructor:M,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&(Ut=null)},_getDirection:function(e,t){return typeof this.options.direction=="function"?this.options.direction.call(this,e,t,S):this.options.direction},_onTapStart:function(e){if(e.cancelable){var t=this,a=this.el,s=this.options,r=s.preventOnFilter,n=e.type,o=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,l=(o||e).target,c=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,d=s.filter;if(Zh(a),!S&&!(/mousedown|pointerdown/.test(n)&&e.button!==0||s.disabled)&&!c.isContentEditable&&!(!this.nativeDraggable&&yi&&l&&l.tagName.toUpperCase()==="SELECT")&&(l=Fe(l,s.draggable,a,!1),!(l&&l.animated)&&oa!==l)){if(Nt=Pe(l),xi=Pe(l,s.draggable),typeof d=="function"){if(d.call(this,e,l,this)){be({sortable:t,rootEl:c,name:"filter",targetEl:l,toEl:a,fromEl:a}),Ae("filter",t,{evt:e}),r&&e.preventDefault();return}}else if(d&&(d=d.split(",").some(function(h){if(h=Fe(c,h.trim(),a,!1),h)return be({sortable:t,rootEl:h,name:"filter",targetEl:l,fromEl:a,toEl:a}),Ae("filter",t,{evt:e}),!0}),d)){r&&e.preventDefault();return}s.handle&&!Fe(c,s.handle,a,!1)||this._prepareDragStart(e,o,l)}}},_prepareDragStart:function(e,t,a){var s=this,r=s.el,n=s.options,o=r.ownerDocument,l;if(a&&!S&&a.parentNode===r){var c=se(a);if(Z=r,S=a,te=S.parentNode,gt=S.nextSibling,oa=a,la=n.group,M.dragged=S,ft={target:S,clientX:(t||e).clientX,clientY:(t||e).clientY},_o=ft.clientX-c.left,mo=ft.clientY-c.top,this._lastX=(t||e).clientX,this._lastY=(t||e).clientY,S.style["will-change"]="all",l=function(){if(Ae("delayEnded",s,{evt:e}),M.eventCanceled){s._onDrop();return}s._disableDelayedDragEvents(),!to&&s.nativeDraggable&&(S.draggable=!0),s._triggerDragStart(e,t),be({sortable:s,name:"choose",originalEvent:e}),Ie(S,n.chosenClass,!0)},n.ignore.split(",").forEach(function(d){no(S,d.trim(),Os)}),V(o,"dragover",yt),V(o,"mousemove",yt),V(o,"touchmove",yt),n.supportPointer?(V(o,"pointerup",s._onDrop),!this.nativeDraggable&&V(o,"pointercancel",s._onDrop)):(V(o,"mouseup",s._onDrop),V(o,"touchend",s._onDrop),V(o,"touchcancel",s._onDrop)),to&&this.nativeDraggable&&(this.options.touchStartThreshold=4,S.draggable=!0),Ae("delayStart",this,{evt:e}),n.delay&&(!n.delayOnTouchOnly||t)&&(!this.nativeDraggable||!(fi||He))){if(M.eventCanceled){this._onDrop();return}n.supportPointer?(V(o,"pointerup",s._disableDelayedDrag),V(o,"pointercancel",s._disableDelayedDrag)):(V(o,"mouseup",s._disableDelayedDrag),V(o,"touchend",s._disableDelayedDrag),V(o,"touchcancel",s._disableDelayedDrag)),V(o,"mousemove",s._delayedDragTouchMoveHandler),V(o,"touchmove",s._delayedDragTouchMoveHandler),n.supportPointer&&V(o,"pointermove",s._delayedDragTouchMoveHandler),s._dragStartTimer=setTimeout(l,n.delay)}else l()}},_delayedDragTouchMoveHandler:function(e){var t=e.touches?e.touches[0]:e;Math.max(Math.abs(t.clientX-this._lastX),Math.abs(t.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){S&&Os(S),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;q(e,"mouseup",this._disableDelayedDrag),q(e,"touchend",this._disableDelayedDrag),q(e,"touchcancel",this._disableDelayedDrag),q(e,"pointerup",this._disableDelayedDrag),q(e,"pointercancel",this._disableDelayedDrag),q(e,"mousemove",this._delayedDragTouchMoveHandler),q(e,"touchmove",this._delayedDragTouchMoveHandler),q(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,t){t=t||e.pointerType=="touch"&&e,!this.nativeDraggable||t?this.options.supportPointer?V(document,"pointermove",this._onTouchMove):t?V(document,"touchmove",this._onTouchMove):V(document,"mousemove",this._onTouchMove):(V(S,"dragend",this),V(Z,"dragstart",this._onDragStart));try{document.selection?fa(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,t){if(Vt=!1,Z&&S){Ae("dragStarted",this,{evt:t}),this.nativeDraggable&&V(document,"dragover",Uh);var a=this.options;!e&&Ie(S,a.dragClass,!1),Ie(S,a.ghostClass,!0),M.active=this,e&&this._appendGhost(),be({sortable:this,name:"start",originalEvent:t})}else this._nulling()},_emulateDragOver:function(){if(Re){this._lastX=Re.clientX,this._lastY=Re.clientY,bo();for(var e=document.elementFromPoint(Re.clientX,Re.clientY),t=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(Re.clientX,Re.clientY),e!==t);)t=e;if(S.parentNode[Se]._isOutsideThisEl(e),t)do{if(t[Se]){var a=void 0;if(a=t[Se]._onDragOver({clientX:Re.clientX,clientY:Re.clientY,target:e,rootEl:t}),a&&!this.options.dragoverBubble)break}e=t}while(t=so(t));xo()}},_onTouchMove:function(e){if(ft){var t=this.options,a=t.fallbackTolerance,s=t.fallbackOffset,r=e.touches?e.touches[0]:e,n=z&&Ot(z,!0),o=z&&n&&n.a,l=z&&n&&n.d,c=ma&&me&&lo(me),d=(r.clientX-ft.clientX+s.x)/(o||1)+(c?c[0]-Fs[0]:0)/(o||1),h=(r.clientY-ft.clientY+s.y)/(l||1)+(c?c[1]-Fs[1]:0)/(l||1);if(!M.active&&!Vt){if(a&&Math.max(Math.abs(r.clientX-this._lastX),Math.abs(r.clientY-this._lastY))<a)return;this._onDragStart(e,!0)}if(z){n?(n.e+=d-(js||0),n.f+=h-(Ds||0)):n={a:1,b:0,c:0,d:1,e:d,f:h};var p="matrix(".concat(n.a,",").concat(n.b,",").concat(n.c,",").concat(n.d,",").concat(n.e,",").concat(n.f,")");T(z,"webkitTransform",p),T(z,"mozTransform",p),T(z,"msTransform",p),T(z,"transform",p),js=d,Ds=h,Re=r}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!z){var e=this.options.fallbackOnBody?document.body:Z,t=se(S,!0,ma,!0,e),a=this.options;if(ma){for(me=e;T(me,"position")==="static"&&T(me,"transform")==="none"&&me!==document;)me=me.parentNode;me!==document.body&&me!==document.documentElement?(me===document&&(me=Le()),t.top+=me.scrollTop,t.left+=me.scrollLeft):me=Le(),Fs=lo(me)}z=S.cloneNode(!0),Ie(z,a.ghostClass,!1),Ie(z,a.fallbackClass,!0),Ie(z,a.dragClass,!0),T(z,"transition",""),T(z,"transform",""),T(z,"box-sizing","border-box"),T(z,"margin",0),T(z,"top",t.top),T(z,"left",t.left),T(z,"width",t.width),T(z,"height",t.height),T(z,"opacity","0.8"),T(z,"position",ma?"absolute":"fixed"),T(z,"zIndex","100000"),T(z,"pointerEvents","none"),M.ghost=z,e.appendChild(z),T(z,"transform-origin",_o/parseInt(z.style.width)*100+"% "+mo/parseInt(z.style.height)*100+"%")}},_onDragStart:function(e,t){var a=this,s=e.dataTransfer,r=a.options;if(Ae("dragStart",this,{evt:e}),M.eventCanceled){this._onDrop();return}Ae("setupClone",this),M.eventCanceled||(ee=ho(S),ee.removeAttribute("id"),ee.draggable=!1,ee.style["will-change"]="",this._hideClone(),Ie(ee,this.options.chosenClass,!1),M.clone=ee),a.cloneId=fa(function(){Ae("clone",a),!M.eventCanceled&&(a.options.removeCloneOnHide||Z.insertBefore(ee,S),a._hideClone(),be({sortable:a,name:"clone"}))}),!t&&Ie(S,r.dragClass,!0),t?(ca=!0,a._loopId=setInterval(a._emulateDragOver,50)):(q(document,"mouseup",a._onDrop),q(document,"touchend",a._onDrop),q(document,"touchcancel",a._onDrop),s&&(s.effectAllowed="move",r.setData&&r.setData.call(a,s,S)),V(document,"drop",a),T(S,"transform","translateZ(0)")),Vt=!0,a._dragStartId=fa(a._dragStarted.bind(a,t,e)),V(document,"selectstart",a),wi=!0,window.getSelection().removeAllRanges(),yi&&T(document.body,"user-select","none")},_onDragOver:function(e){var t=this.el,a=e.target,s,r,n,o=this.options,l=o.group,c=M.active,d=la===l,h=o.sort,p=he||c,_,m=this,f=!1;if(Rs)return;function y(oe,G){Ae(oe,m,Oe({evt:e,isOwner:d,axis:_?"vertical":"horizontal",revert:n,dragRect:s,targetRect:r,canSort:h,fromSortable:p,target:a,completed:k,onMove:function(Y,X){return ga(Z,t,S,s,Y,se(Y),e,X)},changed:E},G))}function b(){y("dragOverAnimationCapture"),m.captureAnimationState(),m!==p&&p.captureAnimationState()}function k(oe){return y("dragOverCompleted",{insertion:oe}),oe&&(d?c._hideClone():c._showClone(m),m!==p&&(Ie(S,he?he.options.ghostClass:c.options.ghostClass,!1),Ie(S,o.ghostClass,!0)),he!==m&&m!==M.active?he=m:m===M.active&&he&&(he=null),p===m&&(m._ignoreWhileAnimating=a),m.animateAll(function(){y("dragOverAnimationComplete"),m._ignoreWhileAnimating=null}),m!==p&&(p.animateAll(),p._ignoreWhileAnimating=null)),(a===S&&!S.animated||a===t&&!a.animated)&&(Ut=null),!o.dragoverBubble&&!e.rootEl&&a!==document&&(S.parentNode[Se]._isOutsideThisEl(e.target),!oe&&yt(e)),!o.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),f=!0}function E(){Te=Pe(S),et=Pe(S,o.draggable),be({sortable:m,name:"change",toEl:t,newIndex:Te,newDraggableIndex:et,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),a=Fe(a,o.draggable,t,!0),y("dragOver"),M.eventCanceled)return f;if(S.contains(e.target)||a.animated&&a.animatingX&&a.animatingY||m._ignoreWhileAnimating===a)return k(!1);if(ca=!1,c&&!o.disabled&&(d?h||(n=te!==Z):he===this||(this.lastPutMode=la.checkPull(this,c,S,e))&&l.checkPut(this,c,S,e))){if(_=this._getDirection(e,a)==="vertical",s=se(S),y("dragOverValid"),M.eventCanceled)return f;if(n)return te=Z,b(),this._hideClone(),y("revert"),M.eventCanceled||(gt?Z.insertBefore(S,gt):Z.appendChild(S)),k(!0);var w=Ms(t,o.draggable);if(!w||Qh(e,_,this)&&!w.animated){if(w===S)return k(!1);if(w&&t===e.target&&(a=w),a&&(r=se(a)),ga(Z,t,S,s,a,r,e,!!a)!==!1)return b(),w&&w.nextSibling?t.insertBefore(S,w.nextSibling):t.appendChild(S),te=t,E(),k(!0)}else if(w&&Gh(e,_,this)){var P=Lt(t,0,o,!0);if(P===S)return k(!1);if(a=P,r=se(a),ga(Z,t,S,s,a,r,e,!1)!==!1)return b(),t.insertBefore(S,P),te=t,E(),k(!0)}else if(a.parentNode===t){r=se(a);var $=0,C,N=S.parentNode!==t,j=!Nh(S.animated&&S.toRect||s,a.animated&&a.toRect||r,_),F=_?"top":"left",I=oo(a,"top","top")||oo(S,"top","top"),O=I?I.scrollTop:void 0;Ut!==a&&(C=r[F],Ei=!1,ua=!j&&o.invertSwap||N),$=Wh(e,a,r,_,j?1:o.swapThreshold,o.invertedSwapThreshold==null?o.swapThreshold:o.invertedSwapThreshold,ua,Ut===a);var R;if($!==0){var D=Pe(S);do D-=$,R=te.children[D];while(R&&(T(R,"display")==="none"||R===z))}if($===0||R===a)return k(!1);Ut=a,ki=$;var ne=a.nextElementSibling,J=!1;J=$===1;var L=ga(Z,t,S,s,a,r,e,J);if(L!==!1)return(L===1||L===-1)&&(J=L===1),Rs=!0,setTimeout(Hh,30),b(),J&&!ne?t.appendChild(S):a.parentNode.insertBefore(S,J?ne:a),I&&uo(I,0,O-I.scrollTop),te=S.parentNode,C!==void 0&&!ua&&(ha=Math.abs(C-se(a)[F])),E(),k(!0)}if(t.contains(S))return k(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){q(document,"mousemove",this._onTouchMove),q(document,"touchmove",this._onTouchMove),q(document,"pointermove",this._onTouchMove),q(document,"dragover",yt),q(document,"mousemove",yt),q(document,"touchmove",yt)},_offUpEvents:function(){var e=this.el.ownerDocument;q(e,"mouseup",this._onDrop),q(e,"touchend",this._onDrop),q(e,"pointerup",this._onDrop),q(e,"pointercancel",this._onDrop),q(e,"touchcancel",this._onDrop),q(document,"selectstart",this)},_onDrop:function(e){var t=this.el,a=this.options;if(Te=Pe(S),et=Pe(S,a.draggable),Ae("drop",this,{evt:e}),te=S&&S.parentNode,Te=Pe(S),et=Pe(S,a.draggable),M.eventCanceled){this._nulling();return}Vt=!1,ua=!1,Ei=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),Ls(this.cloneId),Ls(this._dragStartId),this.nativeDraggable&&(q(document,"drop",this),q(t,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),yi&&T(document.body,"user-select",""),T(S,"transform",""),e&&(wi&&(e.cancelable&&e.preventDefault(),!a.dropBubble&&e.stopPropagation()),z&&z.parentNode&&z.parentNode.removeChild(z),(Z===te||he&&he.lastPutMode!=="clone")&&ee&&ee.parentNode&&ee.parentNode.removeChild(ee),S&&(this.nativeDraggable&&q(S,"dragend",this),Os(S),S.style["will-change"]="",wi&&!Vt&&Ie(S,he?he.options.ghostClass:this.options.ghostClass,!1),Ie(S,this.options.chosenClass,!1),be({sortable:this,name:"unchoose",toEl:te,newIndex:null,newDraggableIndex:null,originalEvent:e}),Z!==te?(Te>=0&&(be({rootEl:te,name:"add",toEl:te,fromEl:Z,originalEvent:e}),be({sortable:this,name:"remove",toEl:te,originalEvent:e}),be({rootEl:te,name:"sort",toEl:te,fromEl:Z,originalEvent:e}),be({sortable:this,name:"sort",toEl:te,originalEvent:e})),he&&he.save()):Te!==Nt&&Te>=0&&(be({sortable:this,name:"update",toEl:te,originalEvent:e}),be({sortable:this,name:"sort",toEl:te,originalEvent:e})),M.active&&((Te==null||Te===-1)&&(Te=Nt,et=xi),be({sortable:this,name:"end",toEl:te,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){Ae("nulling",this),Z=S=te=z=gt=ee=oa=Xe=ft=Re=wi=Te=et=Nt=xi=Ut=ki=he=la=M.dragged=M.ghost=M.clone=M.active=null;var e=this.el;pa.forEach(function(t){e.contains(t)&&(t.checked=!0)}),pa.length=js=Ds=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":S&&(this._onDragOver(e),Bh(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],t,a=this.el.children,s=0,r=a.length,n=this.options;s<r;s++)t=a[s],Fe(t,n.draggable,this.el,!1)&&e.push(t.getAttribute(n.dataIdAttr)||Kh(t));return e},sort:function(e,t){var a={},s=this.el;this.toArray().forEach(function(r,n){var o=s.children[n];Fe(o,this.options.draggable,s,!1)&&(a[r]=o)},this),t&&this.captureAnimationState(),e.forEach(function(r){a[r]&&(s.removeChild(a[r]),s.appendChild(a[r]))}),t&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,t){return Fe(e,t||this.options.draggable,this.el,!1)},option:function(e,t){var a=this.options;if(t===void 0)return a[e];var s=bi.modifyOption(this,e,t);typeof s<"u"?a[e]=s:a[e]=t,e==="group"&&vo(a)},destroy:function(){Ae("destroy",this);var e=this.el;e[Se]=null,q(e,"mousedown",this._onTapStart),q(e,"touchstart",this._onTapStart),q(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(q(e,"dragover",this),q(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(t){t.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),da.splice(da.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!Xe){if(Ae("hideClone",this),M.eventCanceled)return;T(ee,"display","none"),this.options.removeCloneOnHide&&ee.parentNode&&ee.parentNode.removeChild(ee),Xe=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(Xe){if(Ae("showClone",this),M.eventCanceled)return;S.parentNode==Z&&!this.options.group.revertClone?Z.insertBefore(ee,S):gt?Z.insertBefore(ee,gt):Z.appendChild(ee),this.options.group.revertClone&&this.animate(S,ee),T(ee,"display",""),Xe=!1}}};function Bh(i){i.dataTransfer&&(i.dataTransfer.dropEffect="move"),i.cancelable&&i.preventDefault()}function ga(i,e,t,a,s,r,n,o){var l,c=i[Se],d=c.options.onMove,h;return window.CustomEvent&&!He&&!fi?l=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(l=document.createEvent("Event"),l.initEvent("move",!0,!0)),l.to=e,l.from=i,l.dragged=t,l.draggedRect=a,l.related=s||e,l.relatedRect=r||se(e),l.willInsertAfter=o,l.originalEvent=n,i.dispatchEvent(l),d&&(h=d.call(c,l,n)),h}function Os(i){i.draggable=!1}function Hh(){Rs=!1}function Gh(i,e,t){var a=se(Lt(t.el,0,t.options,!0)),s=po(t.el,t.options,z),r=10;return e?i.clientX<s.left-r||i.clientY<a.top&&i.clientX<a.right:i.clientY<s.top-r||i.clientY<a.bottom&&i.clientX<a.left}function Qh(i,e,t){var a=se(Ms(t.el,t.options.draggable)),s=po(t.el,t.options,z),r=10;return e?i.clientX>s.right+r||i.clientY>a.bottom&&i.clientX>a.left:i.clientY>s.bottom+r||i.clientX>a.right&&i.clientY>a.top}function Wh(i,e,t,a,s,r,n,o){var l=a?i.clientY:i.clientX,c=a?t.height:t.width,d=a?t.top:t.left,h=a?t.bottom:t.right,p=!1;if(!n){if(o&&ha<c*s){if(!Ei&&(ki===1?l>d+c*r/2:l<h-c*r/2)&&(Ei=!0),Ei)p=!0;else if(ki===1?l<d+ha:l>h-ha)return-ki}else if(l>d+c*(1-s)/2&&l<h-c*(1-s)/2)return Yh(e)}return p=p||n,p&&(l<d+c*r/2||l>h-c*r/2)?l>d+c/2?1:-1:0}function Yh(i){return Pe(S)<Pe(i)?1:-1}function Kh(i){for(var e=i.tagName+i.className+i.src+i.href+i.textContent,t=e.length,a=0;t--;)a+=e.charCodeAt(t);return a.toString(36)}function Zh(i){pa.length=0;for(var e=i.getElementsByTagName("input"),t=e.length;t--;){var a=e[t];a.checked&&pa.push(a)}}function fa(i){return setTimeout(i,0)}function Ls(i){return clearTimeout(i)}_a&&V(document,"touchmove",function(i){(M.active||Vt)&&i.cancelable&&i.preventDefault()}),M.utils={on:V,off:q,css:T,find:no,is:function(e,t){return!!Fe(e,t,e,!1)},extend:zh,throttle:co,closest:Fe,toggleClass:Ie,clone:ho,index:Pe,nextTick:fa,cancelNextTick:Ls,detectDirection:yo,getChild:Lt,expando:Se},M.get=function(i){return i[Se]},M.mount=function(){for(var i=arguments.length,e=new Array(i),t=0;t<i;t++)e[t]=arguments[t];e[0].constructor===Array&&(e=e[0]),e.forEach(function(a){if(!a.prototype||!a.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));a.utils&&(M.utils=Oe(Oe({},M.utils),a.utils)),bi.mount(a)})},M.create=function(i,e){return new M(i,e)},M.version=Mh;var re=[],Si,qs,Ns=!1,Vs,Us,ya,Ai;function Jh(){function i(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var e in this)e.charAt(0)==="_"&&typeof this[e]=="function"&&(this[e]=this[e].bind(this))}return i.prototype={dragStarted:function(t){var a=t.originalEvent;this.sortable.nativeDraggable?V(document,"dragover",this._handleAutoScroll):this.options.supportPointer?V(document,"pointermove",this._handleFallbackAutoScroll):a.touches?V(document,"touchmove",this._handleFallbackAutoScroll):V(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(t){var a=t.originalEvent;!this.options.dragOverBubble&&!a.rootEl&&this._handleAutoScroll(a)},drop:function(){this.sortable.nativeDraggable?q(document,"dragover",this._handleAutoScroll):(q(document,"pointermove",this._handleFallbackAutoScroll),q(document,"touchmove",this._handleFallbackAutoScroll),q(document,"mousemove",this._handleFallbackAutoScroll)),wo(),va(),jh()},nulling:function(){ya=qs=Si=Ns=Ai=Vs=Us=null,re.length=0},_handleFallbackAutoScroll:function(t){this._handleAutoScroll(t,!0)},_handleAutoScroll:function(t,a){var s=this,r=(t.touches?t.touches[0]:t).clientX,n=(t.touches?t.touches[0]:t).clientY,o=document.elementFromPoint(r,n);if(ya=t,a||this.options.forceAutoScrollFallback||fi||He||yi){Bs(t,this.options,o,a);var l=Je(o,!0);Ns&&(!Ai||r!==Vs||n!==Us)&&(Ai&&wo(),Ai=setInterval(function(){var c=Je(document.elementFromPoint(r,n),!0);c!==l&&(l=c,va()),Bs(t,s.options,c,a)},10),Vs=r,Us=n)}else{if(!this.options.bubbleScroll||Je(o,!0)===Le()){va();return}Bs(t,this.options,Je(o,!1),!1)}}},Ue(i,{pluginName:"scroll",initializeByDefault:!0})}function va(){re.forEach(function(i){clearInterval(i.pid)}),re=[]}function wo(){clearInterval(Ai)}var Bs=co(function(i,e,t,a){if(e.scroll){var s=(i.touches?i.touches[0]:i).clientX,r=(i.touches?i.touches[0]:i).clientY,n=e.scrollSensitivity,o=e.scrollSpeed,l=Le(),c=!1,d;qs!==t&&(qs=t,va(),Si=e.scroll,d=e.scrollFn,Si===!0&&(Si=Je(t,!0)));var h=0,p=Si;do{var _=p,m=se(_),f=m.top,y=m.bottom,b=m.left,k=m.right,E=m.width,w=m.height,P=void 0,$=void 0,C=_.scrollWidth,N=_.scrollHeight,j=T(_),F=_.scrollLeft,I=_.scrollTop;_===l?(P=E<C&&(j.overflowX==="auto"||j.overflowX==="scroll"||j.overflowX==="visible"),$=w<N&&(j.overflowY==="auto"||j.overflowY==="scroll"||j.overflowY==="visible")):(P=E<C&&(j.overflowX==="auto"||j.overflowX==="scroll"),$=w<N&&(j.overflowY==="auto"||j.overflowY==="scroll"));var O=P&&(Math.abs(k-s)<=n&&F+E<C)-(Math.abs(b-s)<=n&&!!F),R=$&&(Math.abs(y-r)<=n&&I+w<N)-(Math.abs(f-r)<=n&&!!I);if(!re[h])for(var D=0;D<=h;D++)re[D]||(re[D]={});(re[h].vx!=O||re[h].vy!=R||re[h].el!==_)&&(re[h].el=_,re[h].vx=O,re[h].vy=R,clearInterval(re[h].pid),(O!=0||R!=0)&&(c=!0,re[h].pid=setInterval(function(){a&&this.layer===0&&M.active._onTouchMove(ya);var ne=re[this.layer].vy?re[this.layer].vy*o:0,J=re[this.layer].vx?re[this.layer].vx*o:0;typeof d=="function"&&d.call(M.dragged.parentNode[Se],J,ne,i,ya,re[this.layer].el)!=="continue"||uo(re[this.layer].el,J,ne)}.bind({layer:h}),24))),h++}while(e.bubbleScroll&&p!==l&&(p=Je(p,!1)));Ns=c}},30),ko=function(e){var t=e.originalEvent,a=e.putSortable,s=e.dragEl,r=e.activeSortable,n=e.dispatchSortableEvent,o=e.hideGhostForTarget,l=e.unhideGhostForTarget;if(t){var c=a||r;o();var d=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:t,h=document.elementFromPoint(d.clientX,d.clientY);l(),c&&!c.el.contains(h)&&(n("spill"),this.onSpill({dragEl:s,putSortable:a}))}};function Hs(){}Hs.prototype={startIndex:null,dragStart:function(e){var t=e.oldDraggableIndex;this.startIndex=t},onSpill:function(e){var t=e.dragEl,a=e.putSortable;this.sortable.captureAnimationState(),a&&a.captureAnimationState();var s=Lt(this.sortable.el,this.startIndex,this.options);s?this.sortable.el.insertBefore(t,s):this.sortable.el.appendChild(t),this.sortable.animateAll(),a&&a.animateAll()},drop:ko},Ue(Hs,{pluginName:"revertOnSpill"});function Gs(){}Gs.prototype={onSpill:function(e){var t=e.dragEl,a=e.putSortable,s=a||this.sortable;s.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),s.animateAll()},drop:ko},Ue(Gs,{pluginName:"removeOnSpill"}),M.mount(new Jh),M.mount(Gs,Hs);class Xh extends Ye{static get properties(){return{disabled:{type:Boolean},handleSelector:{type:String},draggableSelector:{type:String}}}constructor(){super(),this.disabled=!1,this.handleSelector=".handle",this.draggableSelector=".sortable-item",this._sortable=null}createRenderRoot(){return this}render(){return g` <slot></slot> `}connectedCallback(){super.connectedCallback(),this.disabled||this._createSortable()}disconnectedCallback(){super.disconnectedCallback(),this._destroySortable()}updated(e){e.has("disabled")&&(this.disabled?this._destroySortable():this._createSortable())}_createSortable(){if(this._sortable)return;const e=this.children[0];if(!e)return;const t={scroll:!0,forceAutoScrollFallback:!0,scrollSpeed:20,animation:150,draggable:this.draggableSelector,handle:this.handleSelector||void 0,fallbackTolerance:3,fallbackOnBody:!0,fallbackClass:"sortable-fallback",forceFallback:!0,onChoose:this._handleChoose.bind(this),onStart:this._handleStart.bind(this),onEnd:this._handleEnd.bind(this),onUpdate:this._handleUpdate.bind(this)};this._sortable=new M(e,t),this._stopBubble=a=>{a.target.closest&&a.target.closest("button, ha-icon, ha-svg-icon")||a.stopPropagation()},e.addEventListener("mousedown",this._stopBubble),e.addEventListener("touchstart",this._stopBubble,{passive:!0}),e.addEventListener("pointerdown",this._stopBubble),e.addEventListener("dragstart",this._stopBubble),e.addEventListener("dragend",this._stopBubble),e.addEventListener("drop",this._stopBubble)}_handleUpdate(e){this.dispatchEvent(new CustomEvent("item-moved",{detail:{oldIndex:e.oldIndex,newIndex:e.newIndex},bubbles:!0,composed:!0}))}_handleEnd(e){this._cleanupGhostElements(),e.item.placeholder&&(e.item.placeholder.replaceWith(e.item),delete e.item.placeholder),this.dispatchEvent(new CustomEvent("drag-end",{bubbles:!0,composed:!0}))}_handleStart(e){this._cleanupGhostElements(),this.dispatchEvent(new CustomEvent("drag-start",{bubbles:!0,composed:!0}))}_handleChoose(e){e.item.placeholder=document.createComment("sort-placeholder"),e.item.after(e.item.placeholder)}_cleanupGhostElements(){document.querySelectorAll(".sortable-fallback, .sortable-ghost").forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)})}_destroySortable(){if(!this._sortable)return;this._sortable.destroy(),this._sortable=null;const e=this.children[0];e&&this._stopBubble&&(e.removeEventListener("mousedown",this._stopBubble),e.removeEventListener("touchstart",this._stopBubble),e.removeEventListener("pointerdown",this._stopBubble),e.removeEventListener("dragstart",this._stopBubble),e.removeEventListener("dragend",this._stopBubble),e.removeEventListener("drop",this._stopBubble)),this._cleanupGhostElements()}}customElements.define("yamp-sortable",Xh);const Eo=Object.freeze([{value:"details",label:u("card.sections.details")},{value:"menu",label:u("card.sections.menu")},{value:"action_chips",label:u("card.sections.action_chips")}]),Qs=Eo.map(i=>i.value),So=Object.freeze({select:{mode:"dropdown",options:[{value:"slider",label:"Slider"},{value:"stepper",label:"Stepper"},{value:"hidden",label:"Hidden"}]}}),Ao=Object.freeze({number:{min:.01,max:1,step:.01,unit_of_measurement:"",mode:"box"}});class ep extends Ye{static get properties(){return{hass:{},_config:{},_yamlConfig:{},_activeTab:{type:String},_entityEditorIndex:{type:Number},_actionEditorIndex:{type:Number},_actionMode:{type:String},_templateModes:{type:Object},_serviceItems:{type:Array}}}constructor(){super(),this._activeTab="entities",this._entityEditorIndex=null,this._actionEditorIndex=null,this._tempEntityIndex=null,this._tempActionIndex=null,this._isInternalUpdate=!1,this._yamlDraft=void 0,this._yamlError=null,this._yamlConfig={},this._serviceItems=[],this._templateModes={},this._artworkOverrides=[],this._preTemplateConfig=null}firstUpdated(){this._serviceItems=this._getServiceItems(),this.addEventListener("value-changed",e=>this._captureEditorIndex(e),!0),this.addEventListener("change",e=>this._captureEditorIndex(e),!0),this.addEventListener("click",e=>this._captureEditorIndex(e),!0)}_captureEditorIndex(e){const t=e.composedPath(),a=t.find(r=>r.classList?.contains?.("entity-group"));if(a){const r=Number(a.getAttribute("data-index"));if(Number.isInteger(r)){this._tempEntityIndex=r;return}}this._tempEntityIndex=null;const s=t.find(r=>r.classList?.contains?.("action-group"));if(s){const r=Number(s.getAttribute("data-index"));if(Number.isInteger(r)){this._tempActionIndex=r;return}}this._tempActionIndex=null}updated(e){if(e.has("hass")){const t=e.get("hass");this.hass?.services!==t?.services&&(this._serviceItems=this._getServiceItems()),this._fetchAspectRatios()}(e.has("_searchTerm")||this._searchTerm)&&this._applySearchFilter()}_supportsFeature(e,t){return!e||typeof e.attributes.supported_features!="number"?!1:(e.attributes.supported_features&t)!==0}_isGroupCapable(e){return e?this._supportsFeature(e,Gr)?!0:Array.isArray(e.attributes?.group_members):!1}_normalizeArtworkOverrides(e){if(!Array.isArray(e))return[];const t=["media_title","media_artist","media_album_name","media_content_id","media_channel","app_name","media_content_type","entity_id","aspect_ratio"];return e.map(a=>{if(!a||typeof a!="object")return{match_type:"media_title",match_value:"",image_url:"",size_percentage:void 0,object_fit:void 0};const s=a.size_percentage;if(a.missing_art_url!==void 0)return{match_type:"missing_art",match_value:"",image_url:a.missing_art_url??"",size_percentage:s,object_fit:a.object_fit};if(a.idle_image===!0||a.idle_image_url!==void 0)return{match_type:"idle_image",match_value:"",image_url:a.idle_image_url??a.image_url??"",size_percentage:s,object_fit:a.object_fit};let r="media_title",n="";for(const o of t){if(a[o]!==void 0){r=o,n=a[o]??"";break}const l=`${o}_equals`;if(a[l]!==void 0){r=o,n=a[l]??"";break}}return{match_type:r,match_value:n??"",image_url:a.image_url??"",size_percentage:s,object_fit:a.object_fit,object_position:a.object_position}})}_serializeArtworkOverride(e){if(!e)return null;const t=(e.image_url??"").trim(),a=e.object_fit==="default"?void 0:e.object_fit;if(e.match_type==="missing_art")return t?{missing_art_url:t,...e.size_percentage!==void 0?{size_percentage:Number(e.size_percentage)}:{},...a!==void 0?{object_fit:a}:{},...e.object_position!==void 0&&e.object_position!=="default"?{object_position:e.object_position}:{}}:null;if(e.match_type==="idle_image")return{idle_image:!0,...t?{idle_image_url:t}:{},...e.size_percentage!==void 0?{size_percentage:Number(e.size_percentage)}:{},...a!==void 0?{object_fit:a}:{},...e.object_position!==void 0&&e.object_position!=="default"?{object_position:e.object_position}:{}};const s=(e.match_value??"").trim();return s?{...t?{image_url:t}:{},[e.match_type]:s,...e.size_percentage!==void 0?{size_percentage:Number(e.size_percentage)}:{},...a!==void 0?{object_fit:a}:{},...e.object_position!==void 0&&e.object_position!=="default"?{object_position:e.object_position}:{}}:null}_writeArtworkOverrides(e){this._artworkOverrides=e;const t=e.map(a=>this._serializeArtworkOverride(a)).filter(a=>a);this._updateConfig("media_artwork_overrides",t.length?t:void 0)}_getServiceItems(){return this.hass?.services?Object.entries(this.hass.services).flatMap(([e,t])=>Object.keys(t).map(a=>({label:`${e}.${a}`,value:`${e}.${a}`}))):[]}_getEntityItems(e=[],t=[]){return()=>this.hass?.states?Object.keys(this.hass.states).filter(a=>{const s=a.split(".")[0];return!(e.length&&!e.includes(s)||t.includes(a))}).map(a=>{const s=this.hass.states[a];return{id:a,primary:s?.attributes?.friendly_name||a,secondary:a}}):[]}_entityValueRenderer(e){return e?this.hass?.states?.[e]?.attributes?.friendly_name||e:""}_entityRowRenderer(e){return g`
      <ha-list-item twoline graphic="icon">
        <ha-state-icon
          slot="graphic"
          .hass=${this.hass}
          .stateObj=${this.hass?.states?.[e.id]}
        ></ha-state-icon>
        <span>${e.primary}</span>
        <span slot="secondary">${e.secondary}</span>
      </ha-list-item>
    `}_getAdaptiveTextTargetsValue(){return Array.isArray(this._config?.adaptive_text_targets)?this._config.adaptive_text_targets.filter(e=>Qs.includes(e)):this._config?.adaptive_text===!0?[...Qs]:[]}_onAdaptiveTextTargetsChanged(e){const t=Array.isArray(e)?e.filter(a=>Qs.includes(a)):[];this._updateConfig("adaptive_text_targets",t)}_looksLikeTemplate(e){if(typeof e!="string")return!1;const t=e.trim();return t.includes("{{")||t.includes("{%")||t.startsWith("[[[")&&t.endsWith("]]]")}_isTemplateValue(e){return this._looksLikeTemplate(e)}_isTemplateMode(e,t){return this._templateModes?.[e]!==void 0?this._templateModes[e]:this._looksLikeTemplate(t)}_toggleTemplateMode(e,t,a){const s=!this._isTemplateMode(e,t);this._templateModes={...this._templateModes,[e]:s},!s&&this._looksLikeTemplate(t)?a(void 0):this.requestUpdate()}_renderTemplateToggle(e,t,a,s=!1){const r=this._isTemplateMode(e,t);return g`
      <ha-icon
        class="icon-button-small icon-button-toggle ${r?"active":""} ${s?"icon-button-disabled":""}"
        icon="mdi:code-braces"
        title="${u("editor.labels.toggle_template_mode")}"
        @click=${()=>{s||this._toggleTemplateMode(e,t,a)}}
      ></ha-icon>
    `}_isEntityId(e){return typeof e=="string"&&/^[a-z_]+\.[a-zA-Z0-9_]+$/.test(e.trim())}setConfig(e){this._yamlConfig={...e};const t=(e.entities??[]).map(r=>typeof r=="string"?{entity_id:r}:r),a=e.template||"custom",s=ri[a]||{};this._config={...s,...e,entities:t},this._isInternalUpdate?this._isInternalUpdate=!1:(this._actionEditorIndex=null,this._entityEditorIndex=null),this._artworkOverrides=this._normalizeArtworkOverrides(e.media_artwork_overrides),this._fetchAspectRatios()}_fetchAspectRatios(){if(!this.hass||!this._config||!(this._artworkOverrides||[]).some(t=>t.match_type==="aspect_ratio"))return;let e=[];this._config.entity&&e.push(this._config.entity),this._config.entities&&Array.isArray(this._config.entities)&&(e=[...e,...this._config.entities.map(t=>typeof t=="string"?t:t.entity_id)]),e=[...new Set(e)].filter(t=>t),this._entityRatios||(this._entityRatios={}),e.forEach(t=>{if(this._entityRatios[t]!==void 0)return;const a=this.hass.states[t];if(!a)return;const s=a.attributes||{},r=s.entity_picture_local||s.entity_picture||s.album_art;if(!r)return;let n=r.trim();(n.startsWith("'")&&n.endsWith("'")||n.startsWith('"')&&n.endsWith('"'))&&(n=n.slice(1,-1).trim());const o=n.match(/^url\((.*)\)$/i);o&&o[1]&&(n=o[1].trim(),(n.startsWith("'")&&n.endsWith("'")||n.startsWith('"')&&n.endsWith('"'))&&(n=n.slice(1,-1).trim())),this._entityRatios[t]="loading";const l=new window.Image;l.src=n,l.onload=()=>{l.naturalWidth&&l.naturalHeight?(this._entityRatios[t]=(l.naturalWidth/l.naturalHeight).toFixed(2),this.requestUpdate()):this._entityRatios[t]=null},l.onerror=()=>{this._entityRatios[t]=null}})}_formatRatio(e){if(!e||e==="loading")return"";const t=parseFloat(e);return isNaN(t)?` (${e})`:Math.abs(t-1.77)<=.05||Math.abs(t-1.78)<=.05?" (16:9)":Math.abs(t-1.33)<=.05?" (4:3)":Math.abs(t-1)<=.05?" (1:1)":Math.abs(t-2.33)<=.05||Math.abs(t-2.35)<=.05?" (21:9)":` (${e})`}_updateConfig(e,t){if(e==="template"){this._changeTemplate(t);return}const a={...this._yamlConfig,[e]:t};this._yamlConfig=a;const s={...this._config,[e]:t};this._config=s,this._isInternalUpdate=!0,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a},bubbles:!0,composed:!0}))}_changeTemplate(e){let t={...this._yamlConfig};if(e!=="custom"&&(!t.template||t.template==="custom")&&(this._preTemplateConfig={...t}),e==="custom")this._preTemplateConfig?t={...this._preTemplateConfig,...t,template:"custom"}:t.template="custom";else{const s=ri[e]||{};for(const r of Object.keys(s))delete t[r];t.template=e}this._yamlConfig=t;const a=ri[e]||{};this._config={...a,...t,entities:this._config.entities},this._isInternalUpdate=!0,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_addArtworkOverride(){const e=[...this._artworkOverrides??[]];e.push({match_type:"media_title",match_value:"",image_url:"",size_percentage:void 0,object_fit:void 0}),this._writeArtworkOverrides(e)}_removeArtworkOverride(e){const t=[...this._artworkOverrides??[]];e<0||e>=t.length||(t.splice(e,1),this._writeArtworkOverrides(t))}_onArtworkMatchTypeChange(e,t){if(!t)return;const a=[...this._artworkOverrides??[]];if(!a[e])return;const s={...a[e],match_type:t};(t==="missing_art"||t==="idle_image")&&(s.match_value=""),a[e]=s,this._writeArtworkOverrides(a)}_setCurrentAspectRatioForMatch(e,t){if(!this._config||!this.hass||(t||(t=this._config.entity||this._config.entities&&(this._config.entities[0]?.entity_id||this._config.entities[0])),!t||!this.hass.states[t]))return;const a=this.hass.states[t].attributes||{},s=a.entity_picture_local||a.entity_picture||a.album_art;if(!s)return;let r=s.trim();(r.startsWith("'")&&r.endsWith("'")||r.startsWith('"')&&r.endsWith('"'))&&(r=r.slice(1,-1).trim());const n=r.match(/^url\((.*)\)$/i);n&&n[1]&&(r=n[1].trim(),(r.startsWith("'")&&r.endsWith("'")||r.startsWith('"')&&r.endsWith('"'))&&(r=r.slice(1,-1).trim()));const o=new window.Image;o.src=r,o.onload=()=>{if(o.naturalWidth&&o.naturalHeight){const l=(o.naturalWidth/o.naturalHeight).toFixed(2);this._onArtworkMatchValueChange(e,l)}}}_onArtworkMatchValueChange(e,t){const a=[...this._artworkOverrides||[]];a[e]={...a[e],match_value:t},this._writeArtworkOverrides(a)}_onArtworkImageUrlChange(e,t){const a=[...this._artworkOverrides??[]];a[e]&&(a[e]={...a[e],image_url:t},this._writeArtworkOverrides(a))}_onArtworkSizePercentageChange(e,t){const a=[...this._artworkOverrides??[]];if(a[e]){if(t==="")a[e]={...a[e],size_percentage:void 0};else{const s=Number(t);if(Number.isFinite(s))a[e]={...a[e],size_percentage:s};else return}this._writeArtworkOverrides(a)}}_onArtworkObjectFitChange(e,t){const a=[...this._artworkOverrides??[]];if(!a[e])return;const s=t==="default"?void 0:t;a[e]={...a[e],object_fit:s},this._writeArtworkOverrides(a)}_onArtworkMoved(e){const{oldIndex:t,newIndex:a}=e.detail??{},s=[...this._artworkOverrides??[]];if(t===void 0||a===void 0||t<0||a<0||t>=s.length||a>=s.length)return;const[r]=s.splice(t,1);s.splice(a,0,r),this._writeArtworkOverrides(s)}_updateEntityProperty(e,t){this._updateEntityProperties({[e]:t})}_updateEntityProperties(e){const t=[...this._config.entities??[]],a=this._tempEntityIndex!==null?this._tempEntityIndex:this._entityEditorIndex;t[a]&&(t[a]={...t[a],...e},this._updateConfig("entities",t))}_updateActionProperty(e,t){this._updateActionProperties({[e]:t})}_updateActionProperties(e){const t=[...this._config.actions??[]],a=this._tempActionIndex!==null?this._tempActionIndex:this._actionEditorIndex;if(t[a]){e.card_trigger&&e.card_trigger!=="none"&&t.forEach((r,n)=>{n!==a&&r.card_trigger===e.card_trigger&&(t[n]={...r,card_trigger:"none"})});const s={...t[a],...e};"in_menu"in e&&delete s.placement,t[a]=s,this._updateConfig("actions",t)}}_deriveActionMode(e){if(!e)return"service";if(e.action==="prev_entity")return"prev_entity";if(e.action==="next_entity")return"next_entity";if(e.action==="select_entity")return"select_entity";if(e.action==="sync_selected_entity"||e.sync_entity_helper)return"sync_selected_entity";if(typeof e.menu_item=="string"&&e.menu_item.trim()!=="")return"menu";const t=typeof e.navigation_path=="string"?e.navigation_path.trim():"";return e.action==="navigate"||t?"navigate":e.action==="toggle_lyrics"?"toggle_lyrics":e.action==="remote_control"?"remote_control":"service"}static get styles(){return Me`
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
          padding: 6px 0px 6px 6px;
          margin: 0px -14px 0px 0px;
        }
        /* wraps the action icon, name textbox and edit button */
        .action-row-inner {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 0px 6px 6px;
          margin: 0px -14px 0px 0px;
        }
        .action-row-inner > ha-icon {
          margin-right: 5px;
          margin-top: 0px;
        }
        /* allow children to fill all available space */
        .grow-children {
          flex: 1;
          display: flex;
          min-width: 0;
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
        .entity-row-actions {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .action-row-actions {
          display: flex;
          align-items: flex-start;
          flex-shrink: 0;
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
        .icon-button-compact:last-child {
          padding-right: 10px;
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
        .field-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0px;
          flex-shrink: 0;
          height: 56px;
        }
        .editor-field-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
        }
        .icon-button-small {
          display: inline-flex;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          --mdc-icon-size: 20px;
          width: 28px;
          height: 28px;
          transition: color 0.2s;
        }
        .icon-button-small ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        .icon-button-small:hover {
          color: var(--primary-color, #2196f3);
        }
        .icon-button-small.active {
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
      `}render(){if(!this._config)return g``;const e=this._yamlConfig.template||"custom",t=this._entityEditorIndex!==null,a=this._actionEditorIndex!==null;return g`
      <div class="config-section" style="margin-top: 0; margin-bottom: 12px;">
        <div
          class="form-row"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;"
        >
          <div>
            <ha-selector
              .hass=${this.hass}
              label=${u("editor.template_label")}
              .selector=${{select:{mode:"dropdown",options:Object.keys(ri).map(s=>({value:s,label:u(`editor.templates.${s}.label`)}))}}}
              .value=${e}
              @value-changed=${s=>this._updateConfig("template",s.detail.value)}
            ></ha-selector>
            <div class="config-subtitle small" style="margin-top: 8px;">
              ${u(`editor.templates.${e}.description`)}
            </div>
          </div>
          <div style="position: relative;">
            <ha-selector
              .required=${!1}
              .hass=${this.hass}
              .selector=${{text:{type:"search"}}}
              .value=${this._searchTerm||""}
              @value-changed=${s=>{this._searchTerm=s.detail.value}}
              label="${u("editor.search_placeholder")||"Search configuration options..."}"
            ></ha-selector>
            ${this._searchTerm?g`
                    <ha-icon
                      icon="mdi:close"
                      @click=${()=>{this._searchTerm=""}}
                      style="position: absolute; right: 12px; top: 28px; transform: translateY(-50%); cursor: pointer; color: var(--secondary-text-color);"
                    ></ha-icon>
                  `:v}
          </div>
        </div>
      </div>
      ${this._searchTerm&&!t&&!a?this._renderActiveTab():g`
              ${this._searchTerm?v:g`
                      <div class="tabs">
                        ${["entities","behavior","look_and_feel","artwork","actions"].map(s=>{const r=u(`editor.tabs.${s}`);return g`
                              <button
                                class="tab"
                                ${this._activeTab===s?"selected":""}
                                @click=${()=>{this._activeTab=s,this._entityEditorIndex=null,this._actionEditorIndex=null,this._useTemplate=null,this._useVolTemplate=null}}
                                ?selected=${this._activeTab===s}
                              >
                                ${r}
                              </button>
                            `})}
                      </div>
                    `}
              <div class="tab-content">
                ${t?this._renderEntityEditor(this._config.entities?.[this._entityEditorIndex]):a?this._renderActionEditor(this._config.actions?.[this._actionEditorIndex]):this._renderActiveTab()}
              </div>
            `}
    `}_renderArtworkTab(){const e=[...this._artworkOverrides??[]],t=[{value:"media_title",label:"Media Title"},{value:"media_artist",label:"Media Artist"},{value:"media_album_name",label:"Album Name"},{value:"media_content_id",label:"Content ID"},{value:"media_channel",label:"Channel"},{value:"app_name",label:"App Name"},{value:"media_content_type",label:"Content Type"},{value:"entity_id",label:"Entity ID"},{value:"aspect_ratio",label:"Aspect Ratio"},{value:"missing_art",label:"Missing Artwork"},{value:"idle_image",label:u("editor.fields.idle_image")||"Idle Image"}];return g`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${u("editor.sections.artwork.general.title")}</div>
            <div class="section-description">${u("editor.sections.artwork.general.description")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${u("editor.fields.artwork_fit")}"
                .selector=${{select:{mode:"dropdown",options:[{value:"cover",label:u("editor.artwork_fit.cover")},{value:"contain",label:u("editor.artwork_fit.contain")},{value:"fill",label:u("editor.artwork_fit.fill")},{value:"scale-down",label:u("editor.artwork_fit.scale-down")},{value:"scaled-contain",label:u("editor.artwork_fit.scaled-contain")},{value:"scaled-contain-alternate",label:u("editor.artwork_fit.scaled-contain-alternate")},{value:"none",label:u("editor.artwork_fit.none")},{value:"no_artwork",label:u("editor.fields.no_artwork_option")}]}}}
                .value=${this._config.artwork_object_fit??"cover"}
                @value-changed=${a=>{const s=a.detail.value;this._updateConfig("artwork_object_fit",s==="cover"?void 0:s)}}
              ></ha-selector>
            </div>
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${u("editor.fields.artwork_position")}"
                .selector=${{select:{mode:"dropdown",options:[{value:"top center",label:(u("editor.artwork_position.top")||"Top")+" (default)"},{value:"center center",label:u("editor.artwork_position.center")||"Center"},{value:"bottom center",label:u("editor.artwork_position.bottom")||"Bottom"}]}}}
                .value=${this._config.artwork_position??"top center"}
                @value-changed=${a=>{const s=a.detail.value;this._updateConfig("artwork_position",s==="top center"?void 0:s)}}
              ></ha-selector>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="extend-artwork-toggle"
                .checked=${this._config.extend_artwork===!0}
                @change=${a=>this._updateConfig("extend_artwork",a.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="extend-artwork-toggle" style="font-weight: 500;">${u("editor.subtitles.artwork_extend_label")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${u("editor.subtitles.artwork_extend")}</div>
              </div>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="blurred-artwork-toggle"
                .checked=${this._config.blurred_artwork===!0||this._config.blurred_artwork!==!1&&(this._config.always_collapsed===!0||this._config.artwork_object_fit==="scaled-contain")}
                @change=${a=>this._updateConfig("blurred_artwork",a.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="blurred-artwork-toggle" style="font-weight: 500;">${u("editor.labels.blurred_artwork")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${u("editor.subtitles.blurred_artwork")}</div>
              </div>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="hide-collapsed-artwork-toggle"
                .checked=${this._config.hide_collapsed_artwork===!0}
                @change=${a=>this._updateConfig("hide_collapsed_artwork",a.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="hide-collapsed-artwork-toggle" style="font-weight: 500;">${u("editor.labels.hide_collapsed_artwork")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${u("editor.subtitles.hide_collapsed_artwork")}</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              class="full-width"
              label="${u("editor.fields.artwork_hostname")}"
              .selector=${{text:{}}}
              .value=${this._config.artwork_hostname??""}
              @value-changed=${a=>this._updateConfig("artwork_hostname",a.detail.value)}
              helper="e.g. http://192.168.1.50:8123"
            ></ha-selector>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${u("editor.sections.artwork.idle.title")}</div>
            <div class="section-description">${u("editor.sections.artwork.idle.description")}</div>
          </div>
          ${this._isTemplateMode("idle_image",this._config.idle_image)?g`
                  <div class="form-row">
                    <div class="editor-field-wrapper">
                      <div class="grow-children" style="flex-direction: column;">
                        <span class="form-label"
                          >${u("editor.fields.idle_image_entity")}</span
                        >
                        <ha-code-editor
                          lint
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          label="${u("editor.sections.artwork.idle.title")}"
                          .value=${this._config.idle_image??""}
                          @value-changed=${a=>this._updateConfig("idle_image",a.detail.value)}
                        ></ha-code-editor>
                      </div>
                      <div class="field-actions">
                        ${this._renderTemplateToggle("idle_image",this._config.idle_image,a=>this._updateConfig("idle_image",a))}
                      </div>
                    </div>
                  </div>
                `:g`
                  <div class="form-row form-row-multi-column">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                      <ha-switch
                        id="idle-image-url-toggle"
                        .checked=${this._useIdleImageUrl??this._looksLikeUrlOrPath(this._config.idle_image)}
                        @change=${a=>{this._useIdleImageUrl=a.target.checked,this._updateConfig("idle_image","")}}
                      ></ha-switch>
                      <label for="idle-image-url-toggle"
                        >${u("editor.labels.use_url_path")}</label
                      >
                    </div>
                    <div style="flex: 2; display: flex; align-items: center; gap: 8px;">
                      <div class="editor-field-wrapper">
                        <div class="grow-children">
                          ${this._useIdleImageUrl?g`
                                  <ha-selector
                                    .hass=${this.hass}
                                    class="full-width"
                                    .selector=${{text:{}}}
                                    .value=${this._config.idle_image??""}
                                    @value-changed=${a=>this._updateConfig("idle_image",a.detail.value)}
                                    label="e.g., https://example.com/image.jpg or /local/custom/image.jpg"
                                    helper="${u("editor.subtitles.image_url_helper")}"
                                  ></ha-selector>
                                `:g`
                                  <ha-generic-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .value=${this._config.idle_image??""}
                                    .label=${u("editor.fields.idle_image_entity")}
                                    .valueRenderer=${a=>this._entityValueRenderer(a)}
                                    .rowRenderer=${a=>this._entityRowRenderer(a)}
                                    .getItems=${this._getEntityItems(["camera","image"])}
                                    @value-changed=${a=>this._updateConfig("idle_image",a.detail.value)}
                                    allow-custom-value
                                  ></ha-generic-picker>
                                `}
                        </div>
                        <div class="field-actions">
                          ${this._renderTemplateToggle("idle_image",this._config.idle_image,a=>this._updateConfig("idle_image",a))}
                        </div>
                      </div>
                    </div>
                  </div>
                `}
          <div class="form-row form-row-multi-column" style="${this._config.idle_image?"":"opacity: 0.4; pointer-events: none;"}">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="show-idle-artwork-toggle"
                .checked=${this._config.show_idle_artwork_when_not_playing===!0}
                .disabled=${!this._config.idle_image}
                @change=${a=>this._updateConfig("show_idle_artwork_when_not_playing",a.target.checked)}
              ></ha-switch>
              <div style="display: flex; flex-direction: column;">
                <label for="show-idle-artwork-toggle" style="font-weight: 500;">${u("editor.labels.show_idle_artwork_when_not_playing")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${u("editor.subtitles.show_idle_artwork_when_not_playing")}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${u("editor.sections.artwork.overrides.title")}</div>
            <div class="section-description">${u("editor.sections.artwork.overrides.description")}</div>
          </div>
          <yamp-sortable @item-moved=${a=>this._onArtworkMoved(a)}>
            <div class="sortable-container">
              ${e.length?e.map((a,s)=>g`
                        <div class="action-row-inner sortable-item artwork-row">
                          <div class="handle action-handle">
                            <ha-icon icon="mdi:drag"></ha-icon>
                          </div>
                          <div class="artwork-fields">
                            <ha-selector
                              .hass=${this.hass}
                              label="${u("editor.fields.match_field")}"
                              .required=${!0}
                              .selector=${{select:{mode:"dropdown",options:t}}}
                              .value=${a.match_type??"media_title"}
                              @value-changed=${r=>this._onArtworkMatchTypeChange(s,r.detail.value)}
                            ></ha-selector>
                            ${a.match_type==="missing_art"?g`
                                    <div class="config-subtitle small">
                                      ${u("editor.descriptions.missing_art_match")}
                                    </div>
                                  `:a.match_type==="idle_image"?g`
                                      <div class="config-subtitle small">
                                        ${u("editor.descriptions.idle_image_match")}
                                      </div>
                                    `:a.match_type==="entity_id"?g`
                                        <ha-generic-picker
                                          class="full-width"
                                          .hass=${this.hass}
                                          .value=${a.match_value??""}
                                          .label=${u("editor.fields.match_entity")}
                                          .required=${!0}
                                          .valueRenderer=${r=>this._entityValueRenderer(r)}
                                          .rowRenderer=${r=>this._entityRowRenderer(r)}
                                          .getItems=${this._getEntityItems(["media_player"])}
                                          @value-changed=${r=>this._onArtworkMatchValueChange(s,r.detail.value)}
                                          allow-custom-value
                                        ></ha-generic-picker>
                                      `:a.match_type==="aspect_ratio"?g`
                                          <div
                                            style="display: flex; flex-direction: column; width: 100%;"
                                          >
                                            ${(()=>{const r=[];if(this._config?.entity&&r.push(this._config.entity),this._config?.entities&&Array.isArray(this._config.entities))for(const n of this._config.entities){const o=typeof n=="string"?n:n.entity||n.entity_id;o&&!r.includes(o)&&r.push(o)}return r.length>1?g`
                                                  <select
                                                    style="width: 100%; padding: 8px 16px; border-radius: 4px; border: 1px solid var(--divider-color, #ccc); background: var(--mdc-text-field-fill-color, var(--secondary-background-color, rgba(127,127,127,0.05))); color: var(--primary-text-color, #000); font-family: inherit; font-size: 14px; margin-bottom: 8px; outline: none;"
                                                    @change=${n=>{const o=n.target.value;o&&(this._setCurrentAspectRatioForMatch(s,o),n.target.selectedIndex=0)}}
                                                  >
                                                    <option value="" disabled selected>
                                                      Get current ratio from...
                                                    </option>
                                                    ${r.map(n=>{const o=this.hass.states[n],l=o?.attributes?.entity_picture||o?.attributes?.entity_picture_local||o?.attributes?.album_art,c=o?.attributes?.friendly_name||n,d=this._entityRatios&&this._entityRatios[n],h=this._formatRatio(d);return g`<option
                                                        value="${n}"
                                                        ?disabled=${!l}
                                                      >
                                                        ${c}${h}
                                                      </option>`})}
                                                  </select>
                                                `:v})()}
                                            <div style="display: flex; width: 100%;">
                                              <ha-selector
                                                .hass=${this.hass}
                                                style="flex: 1;"
                                                .selector=${{text:{}}}
                                                label="${u("editor.fields.match_value")}"
                                                .required=${!0}
                                                .value=${a.match_value??""}
                                                @value-changed=${r=>this._onArtworkMatchValueChange(s,r.detail.value)}
                                              ></ha-selector>
                                              ${(()=>{const r=[];if(this._config?.entity&&r.push(this._config.entity),this._config?.entities&&Array.isArray(this._config.entities))for(const n of this._config.entities){const o=typeof n=="string"?n:n.entity||n.entity_id;o&&!r.includes(o)&&r.push(o)}return r.length<=1?g`
                                                    <ha-icon-button
                                                      style="margin-left: 8px;"
                                                      title="get current"
                                                      @click=${()=>this._setCurrentAspectRatioForMatch(s)}
                                                    >
                                                      <ha-icon icon="mdi:target"></ha-icon>
                                                    </ha-icon-button>
                                                  `:v})()}
                                            </div>
                                          </div>
                                        `:g`
                                          <ha-selector
                                            .hass=${this.hass}
                                            class="full-width"
                                            .selector=${{text:{}}}
                                            label="${u("editor.fields.match_value")}"
                                            .required=${!0}
                                            .value=${a.match_value??""}
                                            @value-changed=${r=>this._onArtworkMatchValueChange(s,r.detail.value)}
                                          ></ha-selector>
                                        `}
                            ${a.match_type==="idle_image"?v:g`
                                    <div class="editor-field-wrapper">
                                      ${this._isTemplateMode(`artwork_image_url_${s}`,a.image_url)?g`
                                              <div
                                                class="grow-children"
                                                style="flex-direction: column;"
                                              >
                                                <span class="form-label"
                                                  >${a.match_type==="missing_art"?u("editor.fields.fallback_image_url"):u("editor.fields.image_url").replaceAll("*","")}</span
                                                >
                                                <ha-code-editor
                                                  lint
                                                  .hass=${this.hass}
                                                  mode="jinja2"
                                                  autocomplete-entities
                                                  label=${a.match_type==="missing_art"?u("editor.fields.fallback_image_url"):u("editor.fields.image_url")}
                                                  .value=${a.image_url??""}
                                                  @value-changed=${r=>this._onArtworkImageUrlChange(s,r.detail.value)}
                                                ></ha-code-editor>
                                              </div>
                                              <div class="field-actions">
                                                ${this._renderTemplateToggle(`artwork_image_url_${s}`,a.image_url,r=>this._onArtworkImageUrlChange(s,r))}
                                              </div>
                                            `:g`
                                              <div class="grow-children">
                                                <ha-selector
                                                  .hass=${this.hass}
                                                  class="full-width"
                                                  .selector=${{text:{}}}
                                                  label=${a.match_type==="missing_art"?u("editor.fields.fallback_image_url"):u("editor.fields.image_url")}
                                                  .required=${!1}
                                                  .value=${a.image_url??""}
                                                  @value-changed=${r=>this._onArtworkImageUrlChange(s,r.detail.value)}
                                                ></ha-selector>
                                              </div>
                                              <div class="field-actions">
                                                ${this._renderTemplateToggle(`artwork_image_url_${s}`,a.image_url,r=>this._onArtworkImageUrlChange(s,r))}
                                              </div>
                                            `}
                                    </div>
                                  `}
                            <div
                              class="form-row-multi-column"
                              style="gap:12px; flex-wrap:wrap; align-items:flex-start;"
                            >
                              <div class="grow-children" style="flex:1; min-width: 100px;">
                                <ha-selector
                                  .hass=${this.hass}
                                  class="full-width"
                                  label="${u("editor.fields.size_percent")}"
                                  .required=${!1}
                                  .selector=${{number:{min:1,max:100,mode:"box"}}}
                                  .value=${a.size_percentage??""}
                                  @value-changed=${r=>this._onArtworkSizePercentageChange(s,r.detail.value)}
                                ></ha-selector>
                              </div>
                              <div class="grow-children" style="flex:1.5; min-width: 120px;">
                                <ha-selector
                                  .hass=${this.hass}
                                  label="${u("editor.fields.object_fit")}"
                                  .required=${!1}
                                  .selector=${{select:{mode:"dropdown",options:[{value:"default",label:u("editor.artwork_fit.default")},{value:"cover",label:u("editor.artwork_fit.cover")},{value:"contain",label:u("editor.artwork_fit.contain")},{value:"fill",label:u("editor.artwork_fit.fill")},{value:"scale-down",label:u("editor.artwork_fit.scale-down")},{value:"scaled-contain",label:u("editor.artwork_fit.scaled-contain")},{value:"scaled-contain-alternate",label:u("editor.artwork_fit.scaled-contain-alternate")},{value:"none",label:u("editor.artwork_fit.none")},{value:"no_artwork",label:u("editor.fields.no_artwork_option")}]}}}
                                  .value=${a.object_fit||"default"}
                                  @value-changed=${r=>this._onArtworkObjectFitChange(s,r.detail.value)}
                                ></ha-selector>
                              </div>
                              <div class="grow-children" style="flex:1.5; min-width: 120px;">
                                <ha-selector
                                  .hass=${this.hass}
                                  label="${u("editor.fields.artwork_position")}"
                                  .required=${!1}
                                  .selector=${{select:{mode:"dropdown",options:[{value:"default",label:u("editor.artwork_position.default")||"Global"},{value:"top center",label:u("editor.artwork_position.top")||"Top"},{value:"center center",label:u("editor.artwork_position.center")||"Center"},{value:"bottom center",label:u("editor.artwork_position.bottom")||"Bottom"}]}}}
                                  .value=${a.object_position||"default"}
                                  @value-changed=${r=>{const n=[...this._artworkOverrides];n[s]={...n[s],object_position:r.detail.value},this._writeArtworkOverrides(n)}}
                                ></ha-selector>
                              </div>
                            </div>
                          </div>
                          <div class="action-row-actions">
                            <ha-icon
                              class="icon-button"
                              icon="mdi:trash-can"
                              title="Delete Override"
                              @click=${()=>this._removeArtworkOverride(s)}
                            ></ha-icon>
                          </div>
                        </div>
                      `):g`<div class="config-subtitle" style="padding:12px 0;text-align:center;">
                      ${u("editor.subtitles.no_artwork_overrides")}
                    </div>`}
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="${u("editor.titles.add_artwork_override")}"
              @click=${this._addArtworkOverride}
            ></ha-icon>
          </div>
        </div>
        </div>

      `}_applySearchFilter(){if(!this.shadowRoot)return;const e=(this._searchTerm||"").toLowerCase().trim().replace(/[_ ]/g,""),t=this.shadowRoot.querySelector(".search-results, .tab-content");if(!t)return;const a=this._entityEditorIndex!==null||this._actionEditorIndex!==null,s=["name","hidden controls","music assistant entity","ma entity","ma template","hidden search filter chips","hidden chips","prefer music assistant metadata","prefer ma metadata","disable auto select","group volume","volume entity follows active entity","volume entity","sync power"],r=["name","icon","in menu","card trigger","action type","menu item","navigation path","navigation new tab","sync entity helper","sync entity type","service","script variable"],n=o=>{let l=o.textContent.toLowerCase();if(!a){if(o.classList.contains("entity-row-inner")){if(s.some(h=>h.replace(/[_ ]/g,"").includes(e)))return o.style.display="",!0}else if(o.classList.contains("action-row-inner")&&r.some(h=>h.replace(/[_ ]/g,"").includes(e)))return o.style.display="",!0}const c=o.getAttribute("data-search-keys");c&&(l+=" "+c.toLowerCase().replace(/_/g," ")),o.querySelectorAll("ha-selector").forEach(h=>{const p=h.selector?.select?.options;Array.isArray(p)&&p.length<=15&&p.forEach(_=>{_.label&&(l+=" "+String(_.label).toLowerCase()),_.value&&(l+=" "+String(_.value).toLowerCase())})}),o.querySelectorAll("[label]").forEach(h=>{const p=h.getAttribute("label");p&&(l+=" "+String(p).toLowerCase())});const d=l.replace(/[_ ]/g,"").includes(e);return o.style.display=d?"":"none",d};a?t.querySelectorAll(".form-row, .artwork-row, .entity-row-inner, .action-row-inner").forEach(n):t.querySelectorAll(".config-section, .entity-group, .action-group").forEach(o=>{let l=!1;o.querySelectorAll(".form-row, .artwork-row, .entity-row-inner, .action-row-inner").forEach(c=>{n(c)&&(l=!0)}),o.style.display=l?"":"none"})}_renderActiveTab(){if(this._searchTerm){const e=this._config?.entities??[],t=this._config?.actions??[];return g`
        <div class="search-results is-searching" style="padding-top: 4px;">
          ${this._renderBehaviorTab()} ${this._renderVisualTab()} ${this._renderArtworkTab()}
          ${e.map((a,s)=>g`
              <div class="entity-group" data-index="${s}">
                ${this._renderEntityEditor(a,s,!0)}
              </div>
            `)}
          ${t.map((a,s)=>g`
              <div class="action-group config-section" data-index="${s}">
                ${this._renderActionEditor(a,s,!0)}
              </div>
            `)}
        </div>
      `}switch(this._activeTab){case"entities":return this._renderEntitiesTab();case"behavior":return this._renderBehaviorTab();case"look_and_feel":return this._renderVisualTab();case"artwork":return this._renderArtworkTab();case"actions":return this._renderActionsTab();default:return this._renderEntitiesTab()}}_renderEntitiesTab(){if(!this._config)return g``;let e=[...this._config.entities??[]];return(e.length===0||e[e.length-1].entity_id)&&e.push({entity_id:""}),g`
      <div class="entity-group">
        <div class="entity-group-header section-header">
          <div class="entity-group-title section-title">
            ${u("editor.sections.entities.title")}
          </div>
          <div class="section-description">${u("editor.sections.entities.description")}</div>
        </div>
        <div class="form-row">
          <yamp-sortable @item-moved=${t=>this._onEntityMoved(t)}>
            <div class="sortable-container">
              ${e.map((t,a)=>g`
                  <div
                    class="entity-row-inner ${a<e.length-1?"sortable-item":""}"
                    data-index="${a}"
                  >
                    <div class="handle ${a===e.length-1?"handle-disabled":""}">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    <div class="grow-children">
                      <ha-generic-picker
                        class="full-width"
                        style="display: block; width: 100%;"
                        .hass=${this.hass}
                        .value=${t.entity_id||""}
                        .label=${u("common.media_player")}
                        .valueRenderer=${s=>this._entityValueRenderer(s)}
                        .rowRenderer=${s=>this._entityRowRenderer(s)}
                        .getItems=${this._getEntityItems(["media_player"],a===e.length-1&&!t.entity_id?this._config.entities?.map(s=>s.entity_id)??[]:[])}
                        @value-changed=${s=>this._onEntityChanged(a,s.detail.value)}
                        allow-custom-value
                      ></ha-generic-picker>
                    </div>
                    <div class="entity-row-actions">
                      <ha-icon
                        class="icon-button ${t.entity_id?"":"icon-button-disabled"}"
                        icon="mdi:pencil"
                        title="${u("common.edit_entity")}"
                        @click=${()=>this._onEditEntity(a)}
                      ></ha-icon>
                    </div>
                  </div>
                `)}
            </div>
          </yamp-sortable>
        </div>
      </div>
    `}_renderBehaviorTab(){return g`
      <div class="config-section">
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"default",label:u("editor.card_type_options.default")},{value:"search",label:u("editor.card_type_options.search")},{value:"group_players",label:u("editor.card_type_options.group_players")},{value:"up_next",label:u("editor.card_type_options.up_next")},{value:"remote_control",label:u("editor.card_type_options.remote_control")}]}}}
            .value=${this._config.card_type??"default"}
            label="${u("editor.fields.card_type")}"
            @value-changed=${e=>this._updateConfig("card_type",e.detail.value)}
          ></ha-selector>
          <div class="config-subtitle">${u("editor.subtitles.card_type")}</div>
        </div>
      </div>

      <div class="config-section">
        <div class="section-header">
          <div class="section-title">${u("editor.sections.behavior.idle_chips.title")}</div>
          <div class="section-description">
            ${u("editor.sections.behavior.idle_chips.description")}
          </div>
        </div>
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${{number:{min:0,step:1e3,unit_of_measurement:"ms",mode:"box"}}}
              .value=${this._config.idle_timeout_ms??6e4}
              label="${u("editor.fields.idle_timeout")}"
              @value-changed=${e=>this._updateConfig("idle_timeout_ms",e.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${u("editor.subtitles.idle_timeout")}</div>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="${u("common.reset_default")}"
            @click=${()=>this._updateConfig("idle_timeout_ms",6e4)}
          ></ha-icon>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"auto",label:"Auto"},{value:"always",label:"Always"},{value:"in_menu",label:"In Menu"},{value:"in_menu_on_idle",label:"In Menu on Idle"}]}}}
            .value=${this._config.show_chip_row??"auto"}
            label="${u("editor.fields.show_chip_row")}"
            @value-changed=${e=>this._updateConfig("show_chip_row",e.detail.value)}
          ></ha-selector>
          <div class="config-subtitle">${u("editor.subtitles.show_chip_row")}</div>
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="dim-chips-on-idle-toggle"
              .checked=${this._config.dim_chips_on_idle??!0}
              @change=${e=>this._updateConfig("dim_chips_on_idle",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.dim_chips")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.dim_chips")}</div>
        </div>
      </div>

      <div class="config-section">
        <div class="section-header">
          <div class="section-title">
            ${u("editor.sections.behavior.interactions_search.title")}
          </div>
          <div class="section-description">
            ${u("editor.sections.behavior.interactions_search.description")}
          </div>
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="always-show-quick-group-toggle"
              .checked=${this._config.always_show_quick_group??!1}
              @change=${e=>this._updateConfig("always_show_quick_group",e.target.checked)}
            ></ha-switch>
            <label for="always-show-quick-group-toggle"
              >${u("editor.labels.always_show_group")}</label
            >
          </div>
          <div class="config-subtitle">${u("editor.subtitles.always_show_group")}</div>
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="hold-to-pin-toggle"
              .checked=${this._config.hold_to_pin??!1}
              @change=${e=>this._updateConfig("hold_to_pin",e.target.checked)}
            ></ha-switch>
            <label for="hold-to-pin-toggle">${u("editor.labels.hold_to_pin")}</label>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.hold_to_pin")}</div>
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="show-volume-overlay-toggle"
              .checked=${this._config.show_volume_overlay??!1}
              @change=${e=>this._updateConfig("show_volume_overlay",e.target.checked)}
            ></ha-switch>
            <label for="show-volume-overlay-toggle"
              >${u("editor.labels.show_volume_overlay")}</label
            >
          </div>
          <div class="config-subtitle">${u("editor.subtitles.show_volume_overlay")}</div>
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              .checked=${this._config.disable_autofocus??!1}
              @change=${e=>this._updateConfig("disable_autofocus",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.disable_autofocus")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.disable_autofocus")}</div>
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="default-search-favorites-toggle"
              .checked=${this._config.default_search_favorites??!1}
              @change=${e=>this._updateConfig("default_search_favorites",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.default_search_favorites")}</span>
          </div>
          <div class="config-subtitle">
            ${u("editor.subtitles.default_search_favorites")}
          </div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              .checked=${this._config.keep_filters_on_search??!1}
              @change=${e=>this._updateConfig("keep_filters_on_search",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.keep_filters")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.search_within_filter")}</div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="dismiss-search-on-play-toggle"
              .checked=${this._config.dismiss_search_on_play??!0}
              @change=${e=>this._updateConfig("dismiss_search_on_play",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.dismiss_on_play")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.close_search_on_play")}</div>
        </div>

        <div
          data-search-keys="always_collapsed expand_on_search pin_search_headers"
          class="form-row form-row-multi-column"
        >
          <div
            style="${this._config.entities?.length===1&&this._config.always_collapsed===!0&&this._config.expand_on_search!==!0?"opacity: 0.5;":""}"
            title="${this._config.entities?.length===1&&this._config.always_collapsed===!0&&this._config.expand_on_search!==!0?"Not available with one entity in Always Collapsed mode unless Expand on Search is enabled":""}"
          >
            <ha-switch
              id="pin-search-headers-toggle"
              .checked=${this._config.pin_search_headers??!1}
              @change=${e=>this._updateConfig("pin_search_headers",e.target.checked)}
              .disabled=${this._config.entities?.length===1&&this._config.always_collapsed===!0&&this._config.expand_on_search!==!0}
            ></ha-switch>
            <span>${u("editor.labels.pin_headers")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.pin_search_headers")}</div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="hide-search-headers-on-idle-toggle"
              .checked=${this._config.hide_search_headers_on_idle??!1}
              @change=${e=>this._updateConfig("hide_search_headers_on_idle",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.hide_search_headers_on_idle")}</span>
          </div>
          <div class="config-subtitle">
            ${u("editor.subtitles.hide_search_headers_on_idle")}
          </div>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="disable-mass-queue-toggle"
              .checked=${this._config.disable_mass_queue??!1}
              @change=${e=>this._updateConfig("disable_mass_queue",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.disable_mass")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.disable_mass")}</div>
        </div>
        <div data-search-keys="hide_reorder_progress" class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="hide-reorder-progress-toggle"
              .checked=${this._config.hide_reorder_progress??!1}
              @change=${e=>this._updateConfig("hide_reorder_progress",e.target.checked)}
            ></ha-switch>
            <label for="hide-reorder-progress-toggle"
              >${u("editor.labels.hide_reorder_progress_toggle")}</label
            >
          </div>
          <div class="config-subtitle">${u("editor.subtitles.hide_reorder_progress")}</div>
        </div>

        <div data-search-keys="search_results_limit" class="form-row form-row-multi-column">
          <div class="grow-children number-input-with-note">
            <ha-selector
              .selector=${{number:{min:0,max:1e3,step:1,mode:"box"}}}
              .value=${this._config.search_results_limit??20}
              label="${u("editor.fields.search_limit")}"
              helper="${u("editor.subtitles.search_limit_full")}"
              @value-changed=${e=>this._updateConfig("search_results_limit",e.detail.value)}
            ></ha-selector>
          </div>
          <ha-icon
            class="icon-button"
            id="search-limit-reset"
            icon="mdi:restore"
            title="${u("common.reset_default")}"
            @click=${()=>this._updateConfig("search_results_limit",20)}
          ></ha-icon>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"all",label:u("search.filters.all")},{value:"artist",label:u("search.filters.artist")},{value:"album",label:u("search.filters.album")},{value:"track",label:u("search.filters.track")},{value:"playlist",label:u("search.filters.playlist")},{value:"radio",label:u("search.filters.radio")},{value:"podcast",label:u("search.filters.podcast")},{value:"audiobook",label:u("search.filters.audiobook")}]}}}
            .value=${this._config.default_search_filter??"all"}
            label="${u("editor.labels.default_search_filter")}"
            helper="${u("editor.subtitles.default_search_filter_full")}"
            @value-changed=${e=>this._updateConfig("default_search_filter",e.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"default",label:"Default"},{value:"name",label:"Name (A\u2192Z)"},{value:"name_desc",label:"Name (Z\u2192A)"},{value:"sort_name",label:"Sort Name (A\u2192Z)"},{value:"sort_name_desc",label:"Sort Name (Z\u2192A)"},{value:"timestamp_added",label:"Date Added (Oldest)"},{value:"timestamp_added_desc",label:"Date Added (Newest)"},{value:"last_played",label:"Last Played (Oldest)"},{value:"last_played_desc",label:"Last Played (Recent)"},{value:"play_count",label:"Play Count (Low\u2192High)"},{value:"play_count_desc",label:"Play Count (High\u2192Low)"},{value:"year",label:"Year (Oldest)"},{value:"year_desc",label:"Year (Newest)"},{value:"position",label:"Position (Asc)"},{value:"position_desc",label:"Position (Desc)"},{value:"artist_name",label:"Artist (A\u2192Z)"},{value:"artist_name_desc",label:"Artist (Z\u2192A)"},{value:"random",label:"Random"},{value:"random_play_count",label:"Random + Least Played"}]}}}
            .value=${this._config.search_results_sort??"default"}
            label="${u("editor.fields.result_sorting")}"
            helper="${u("editor.subtitles.result_sorting_full")}"
            @value-changed=${e=>this._updateConfig("search_results_sort",e.detail.value)}
          ></ha-selector>
        </div>
      </div>

      <div class="config-section">
        <div class="section-header">
          <div class="section-title">${u("editor.sections.behavior.lyrics.title")}</div>
          <div class="section-description">
            ${u("editor.sections.behavior.lyrics.description")}
          </div>
        </div>
        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="always-show-lyrics-toggle"
              .checked=${this._config.always_show_lyrics??!1}
              @change=${e=>this._updateConfig("always_show_lyrics",e.target.checked)}
            ></ha-switch>
            <label for="always-show-lyrics-toggle"
              >${u("editor.labels.always_show_lyrics")}</label
            >
          </div>
          <div class="config-subtitle">${u("editor.subtitles.always_show_lyrics")}</div>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"default",label:u("lyrics_modes.default")},{value:"scroll",label:u("lyrics_modes.scroll")},{value:"text",label:u("lyrics_modes.text")}]}}}
            .value=${this._config.lyrics_mode??"default"}
            label="${u("editor.labels.lyrics_mode")}"
            @value-changed=${e=>this._updateConfig("lyrics_mode",e.detail.value)}
          ></ha-selector>
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"mass_lrclib",label:u("lyrics_sources.mass_lrclib")},{value:"mass",label:u("lyrics_sources.mass")},{value:"lrclib",label:u("lyrics_sources.lrclib")},{value:"lrclib_mass",label:u("lyrics_sources.lrclib_mass")}]}}}
            .value=${this._config.lyrics_source??"mass_lrclib"}
            label="${u("editor.labels.lyrics_source")}"
            @value-changed=${e=>this._updateConfig("lyrics_source",e.detail.value)}
          ></ha-selector>
          <div class="config-subtitle">${u("editor.subtitles.lyrics_source")}</div>
        </div>
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${{number:{min:-5,max:5,step:.1,unit_of_measurement:"s",mode:"box"}}}
              .value=${this._config.lyrics_pre_roll??0}
              label="${u("editor.labels.lyrics_pre_roll")}"
              helper="${u("editor.subtitles.lyrics_pre_roll")}"
              @value-changed=${e=>this._updateConfig("lyrics_pre_roll",e.detail.value)}
            ></ha-selector>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="${u("common.reset_default")}"
            @click=${()=>this._updateConfig("lyrics_pre_roll",0)}
          ></ha-icon>
        </div>
      </div>
    `}_renderVisualTab(){return g`
      <div class="config-section">
        <div class="section-header">
          <div class="section-title">
            ${u("editor.sections.look_and_feel.theme_layout.title")}
          </div>
          <div class="section-description">
            ${u("editor.sections.look_and_feel.theme_layout.description")}
          </div>
        </div>

        <div
          data-search-keys="match_theme alternate_progress_bar"
          class="form-row form-row-multi-column"
        >
          <div>
            <ha-switch
              id="match-theme-toggle"
              .checked=${this._config.match_theme??!1}
              @change=${e=>this._updateConfig("match_theme",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.match_theme")}</span>
          </div>
          <div>
            <ha-switch
              id="alternate-progress-bar-toggle"
              .checked=${this._config.alternate_progress_bar??!1}
              @change=${e=>this._updateConfig("alternate_progress_bar",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.alt_progress")}</span>
          </div>
        </div>
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              .selector=${{number:{min:2,max:48,step:2,unit_of_measurement:"px",mode:"box"}}}
              .value=${this._config.progress_bar_height??6}
              label="${u("editor.labels.progress_bar_height")}"
              @value-changed=${e=>this._updateConfig("progress_bar_height",e.detail.value)}
            ></ha-selector>
          </div>
          <ha-icon
            class="icon-button"
            icon="mdi:restore"
            title="${u("common.reset_default")}"
            @click=${()=>this._updateConfig("progress_bar_height",6)}
          ></ha-icon>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"automatic",label:u("editor.appearance_options.automatic")},{value:"light",label:u("editor.appearance_options.light")},{value:"dark",label:u("editor.appearance_options.dark")}]}}}
            .value=${this._config.appearance??"automatic"}
            label="${u("editor.fields.appearance")}"
            @value-changed=${e=>this._updateConfig("appearance",e.detail.value)}
          ></ha-selector>
        </div>

        <div
          data-search-keys="alternate_progress_bar always_collapsed display_timestamps"
          class="form-row form-row-multi-column"
        >
          <div
            title=${this._config.alternate_progress_bar||!this._isTemplateValue(this._config.always_collapsed)&&this._config.always_collapsed?u("editor.subtitles.not_available_alt_collapsed"):""}
          >
            <ha-switch
              id="display-timestamps-toggle"
              .checked=${this._config.display_timestamps??!1}
              @change=${e=>this._updateConfig("display_timestamps",e.target.checked)}
              .disabled=${this._config.alternate_progress_bar||!this._isTemplateValue(this._config.always_collapsed)&&this._config.always_collapsed}
            ></ha-switch>
            <span>${u("editor.labels.display_timestamps")}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="editor-field-wrapper">
            ${this._isTemplateMode("card_height",this._config.card_height)?g`
                    <div class="grow-children" style="flex-direction: column;">
                      <span class="form-label">${u("editor.fields.card_height")}</span>
                      <ha-code-editor
                        lint
                        .hass=${this.hass}
                        mode="jinja2"
                        autocomplete-entities
                        label="${u("editor.fields.card_height")}"
                        .value=${this._config.card_height!==void 0&&this._config.card_height!==null?String(this._config.card_height):""}
                        @value-changed=${e=>this._updateConfig("card_height",e.detail.value)}
                      ></ha-code-editor>
                    </div>
                    <div class="field-actions">
                      ${this._renderTemplateToggle("card_height",this._config.card_height,e=>this._updateConfig("card_height",e))}
                      <ha-icon
                        class="icon-button-small"
                        icon="mdi:restore"
                        title="${u("common.reset_default")}"
                        @click=${()=>this._updateConfig("card_height",void 0)}
                      ></ha-icon>
                    </div>
                  `:g`
                    <div class="grow-children">
                      <ha-selector
                        .hass=${this.hass}
                        class="full-width"
                        .selector=${{number:{min:0,max:2e3,mode:"box"}}}
                        label="${u("editor.fields.card_height")}"
                        .value=${this._config.card_height??""}
                        helper="${u("editor.subtitles.card_height_full")}"
                        @value-changed=${e=>{const t=e.detail.value;if(t===""||t===void 0){this._updateConfig("card_height",void 0);return}const a=Number(t);this._updateConfig("card_height",Number.isFinite(a)&&a>0?a:void 0)}}
                      ></ha-selector>
                    </div>
                    <div class="field-actions">
                      ${this._renderTemplateToggle("card_height",this._config.card_height,e=>this._updateConfig("card_height",e))}
                      <ha-icon
                        class="icon-button-small"
                        icon="mdi:restore"
                        title="${u("common.reset_default")}"
                        @click=${()=>this._updateConfig("card_height",void 0)}
                      ></ha-icon>
                    </div>
                  `}
          </div>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"list",label:u("editor.search_view_options.list")},{value:"card",label:u("editor.search_view_options.card")},{value:"card_minimal",label:u("editor.search_view_options.card_minimal")}]}}}
            .value=${this._config.search_view??"list"}
            label="${u("editor.fields.search_view")}"
            helper="${u("editor.subtitles.search_view")}"
            @value-changed=${e=>this._updateConfig("search_view",e.detail.value)}
          ></ha-selector>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{number:{min:1,max:12,step:1,mode:"box"}}}
            .value=${this._config.search_card_columns??4}
            .disabled=${this._config.search_view!=="card"&&this._config.search_view!=="card_minimal"}
            label="${u("editor.fields.search_card_columns")}"
            helper="${u("editor.subtitles.search_card_columns")}"
            @value-changed=${e=>this._updateConfig("search_card_columns",e.detail.value)}
          ></ha-selector>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"drag_handle",label:u("editor.queue_controls_style_options.drag_handle")},{value:"icons",label:u("editor.queue_controls_style_options.icons")}]}}}
            .value=${this._config.queue_controls_style??"drag_handle"}
            label="${u("editor.fields.queue_controls_style")}"
            helper="${u("editor.subtitles.queue_controls_style")}"
            @value-changed=${e=>this._updateConfig("queue_controls_style",e.detail.value)}
          ></ha-selector>
        </div>
      </div>

      <div class="config-section">
        <div class="section-header">
          <div class="section-title">
            ${u("editor.sections.look_and_feel.controls_typography.title")}
          </div>
          <div class="section-description">
            ${u("editor.sections.look_and_feel.controls_typography.description")}
          </div>
        </div>
        <div class="form-row" data-search-keys="control_layout classic modern">
          <div class="editor-field-wrapper">
            ${this._isTemplateMode("control_layout",this._config.control_layout)?g`
                    <div class="grow-children" style="flex-direction: column;">
                      <span class="form-label">${u("editor.fields.control_layout")}</span>
                      <ha-code-editor
                        lint
                        .hass=${this.hass}
                        mode="jinja2"
                        autocomplete-entities
                        label="${u("editor.fields.control_layout")}"
                        .value=${this._config.control_layout??""}
                        @value-changed=${e=>this._updateConfig("control_layout",e.detail.value)}
                      ></ha-code-editor>
                    </div>
                    <div class="field-actions">
                      ${this._renderTemplateToggle("control_layout",this._config.control_layout,e=>this._updateConfig("control_layout",e))}
                    </div>
                  `:g`
                    <div class="grow-children">
                      <ha-selector
                        .hass=${this.hass}
                        class="full-width"
                        .selector=${{select:{mode:"dropdown",options:[{value:"classic",label:"Classic"},{value:"modern",label:"Modern"}]}}}
                        .value=${this._config.control_layout??"classic"}
                        label="${u("editor.fields.control_layout")}"
                        helper="${u("editor.subtitles.control_layout_full")}"
                        @value-changed=${e=>this._updateConfig("control_layout",e.detail.value)}
                      ></ha-selector>
                    </div>
                    <div class="field-actions">
                      ${this._renderTemplateToggle("control_layout",this._config.control_layout,e=>this._updateConfig("control_layout",e))}
                    </div>
                  `}
          </div>
        </div>
        <div
          class="form-row"
          style="${this._isTemplateValue(this._config.control_layout)||(this._config.control_layout??"classic")==="modern"?"":"opacity: 0.5;"}"
          title="${this._isTemplateValue(this._config.control_layout)||(this._config.control_layout??"classic")==="modern"?"":u("editor.subtitles.only_available_modern")}"
          }
        >
          <div>
            <ha-switch
              .checked=${this._config.swap_pause_for_stop??!1}
              @change=${e=>this._updateConfig("swap_pause_for_stop",e.target.checked)}
              .disabled=${!this._isTemplateValue(this._config.control_layout)&&(this._config.control_layout??"classic")!=="modern"}
            ></ha-switch>
            <span>${u("editor.labels.swap_pause_stop")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.swap_pause_stop")}</div>
        </div>
        <div class="form-row">
          <div>
            <ha-switch
              id="adaptive-controls-toggle"
              .checked=${this._config.adaptive_controls??!1}
              @change=${e=>this._updateConfig("adaptive_controls",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.adaptive_controls")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.adaptive_controls")}</div>
        </div>
        <div class="form-row">
          <div>
            <ha-switch
              id="hide-active-entity-label-toggle"
              .checked=${this._config.hide_active_entity_label??!1}
              @change=${e=>this._updateConfig("hide_active_entity_label",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.hide_active_entity")}</span>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.hide_menu_player")}</div>
        </div>
        <div class="form-row">
          <div>
            <ha-switch
              id="hide-active-entity-label-on-idle-toggle"
              .checked=${this._config.hide_active_entity_label_on_idle??!1}
              @change=${e=>this._updateConfig("hide_active_entity_label_on_idle",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.hide_active_entity_on_idle")}</span>
          </div>
          <div class="config-subtitle">
            ${u("editor.subtitles.hide_active_entity_on_idle")}
          </div>
        </div>
        <div class="form-row">
          <div class="full-width">
            <span class="form-label">${u("editor.labels.adaptive_text_elements")}</span>
            <div class="config-subtitle">${u("editor.subtitles.adaptive_text")}</div>
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{multiple:!0,options:Eo}}}
              .value=${this._getAdaptiveTextTargetsValue()}
              @value-changed=${e=>this._onAdaptiveTextTargetsChanged(e.detail.value)}
            ></ha-selector>
          </div>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"},{value:"none",label:"None"}]}}}
            .value=${this._config.details_alignment??"left"}
            label="${u("editor.fields.details_alignment")}"
            @value-changed=${e=>this._updateConfig("details_alignment",e.detail.value)}
          ></ha-selector>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${So}
            .value=${this._config.volume_mode??"slider"}
            label="${u("editor.fields.volume_mode")}"
            @value-changed=${e=>this._updateConfig("volume_mode",e.detail.value)}
          ></ha-selector>
        </div>
        ${g`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${Ao}
                .value=${this._config.volume_step??.05}
                .disabled=${this._config.volume_mode!=="stepper"}
                label="${u("editor.fields.vol_step")}"
                @value-changed=${e=>this._updateConfig("volume_step",e.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${u("common.reset_default")}"
              @click=${()=>this._updateConfig("volume_step",.05)}
            ></ha-icon>
          </div>
        `}
      </div>

      <div class="config-section">
        <div class="section-header">
          <div class="section-title">
            ${u("editor.sections.look_and_feel.collapsed_idle.title")}
          </div>
          <div class="section-description">
            ${u("editor.sections.look_and_feel.collapsed_idle.description")}
          </div>
        </div>

        <div
          data-search-keys="collapse_on_idle always_collapsed hide_menu_player pin_search_headers expand_on_search"
          class="form-row form-row-multi-column"
        >
          <div>
            <ha-switch
              id="collapse-on-idle-toggle"
              .checked=${this._config.collapse_on_idle??!1}
              @change=${e=>this._updateConfig("collapse_on_idle",e.target.checked)}
            ></ha-switch>
            <span>${u("editor.labels.collapse_on_idle")}</span>
          </div>
          <div
            style="${this._isTemplateValue(this._config.always_collapsed)||!this._config.always_collapsed?"":"opacity: 0.5;"}"
            title="${this._isTemplateValue(this._config.always_collapsed)||!this._config.always_collapsed?"":u("editor.subtitles.not_available_collapsed")}"
          >
            <ha-switch
              id="hide-menu-player-toggle"
              .checked=${this._config.hide_menu_player??!1}
              @change=${e=>this._updateConfig("hide_menu_player",e.target.checked)}
              .disabled=${!this._isTemplateValue(this._config.always_collapsed)&&!!this._config.always_collapsed||this._config.always_collapsed===!0&&this._config.pin_search_headers===!0&&this._config.expand_on_search===!0}
            ></ha-switch>
            <span>${u("editor.labels.hide_menu_player_toggle")}</span>
          </div>
        </div>
        ${this._isTemplateMode("always_collapsed",this._config.always_collapsed)?g`
                <div class="form-row">
                  <div class="editor-field-wrapper">
                    <div class="grow-children" style="flex-direction: column;">
                      <span class="form-label">${u("editor.labels.always_collapsed")}</span>
                      <ha-code-editor
                        lint
                        .hass=${this.hass}
                        mode="jinja2"
                        autocomplete-entities
                        label="${u("editor.labels.always_collapsed")}"
                        .value=${this._config.always_collapsed!==void 0&&this._config.always_collapsed!==null?String(this._config.always_collapsed):""}
                        @value-changed=${e=>this._updateConfig("always_collapsed",e.detail.value)}
                      ></ha-code-editor>
                    </div>
                    <div class="field-actions">
                      ${this._renderTemplateToggle("always_collapsed",this._config.always_collapsed,e=>this._updateConfig("always_collapsed",e))}
                    </div>
                  </div>
                </div>
              `:g`
                <div
                  data-search-keys="always_collapsed expand_on_search"
                  class="form-row form-row-multi-column"
                >
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <ha-switch
                      id="always-collapsed-toggle"
                      .checked=${this._config.always_collapsed===!0}
                      @change=${e=>this._updateConfig("always_collapsed",e.target.checked)}
                    ></ha-switch>
                    <span>${u("editor.labels.always_collapsed")}</span>
                    ${this._renderTemplateToggle("always_collapsed",this._config.always_collapsed,e=>this._updateConfig("always_collapsed",e))}
                  </div>
                  <div
                    style="${this._config.always_collapsed?"":"opacity: 0.5;"}"
                    title="${this._config.always_collapsed?"":u("editor.subtitles.only_available_collapsed")}"
                  >
                    <ha-switch
                      id="expand-on-search-toggle"
                      .checked=${this._config.expand_on_search??!1}
                      @change=${e=>this._updateConfig("expand_on_search",e.target.checked)}
                      .disabled=${!this._config.always_collapsed}
                    ></ha-switch>
                    <span>${u("editor.labels.expand_on_search")}</span>
                  </div>
                </div>
              `}
        <div class="form-row">
          <div class="config-subtitle">${u("editor.subtitles.collapse_expand")}</div>
        </div>
        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:[{value:"default",label:"Default"},{value:"search",label:"Search"},{value:"search-recently-played",label:"Recently Played"},{value:"search-next-up",label:"Next Up"}]}}}
            .value=${this._config.idle_screen??"default"}
            label="${u("editor.fields.idle_screen")}"
            @value-changed=${e=>this._updateConfig("idle_screen",e.detail.value)}
          ></ha-selector>
          <div class="config-subtitle">${u("editor.subtitles.idle_screen")}</div>
        </div>
      </div>
    `}_renderActionsTab(){let e=[...this._config.actions??[]];return g`
      <div class="action-group config-section">
        <div class="action-group-header section-header">
          <div class="action-group-title section-title">
            ${u("editor.sections.actions.title")}
          </div>
          <div class="section-description">${u("editor.sections.actions.description")}</div>
        </div>
        <div class="form-row">
          <yamp-sortable @item-moved=${t=>this._onActionMoved(t)}>
            <div class="sortable-container">
              ${e.map((t,a)=>g`
                  <div class="action-row-inner sortable-item">
                    <div class="handle action-handle">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    ${t?.icon?g`
                            <ha-icon
                              class="action-icon"
                              icon="${t?.icon}"
                              title="Action Icon"
                            ></ha-icon>
                          `:g`<span class="action-icon-placeholder"></span>`}
                    <div class="grow-children">
                      <ha-selector
                        .hass=${this.hass}
                        .selector=${{text:{}}}
                        label="(Icon Only)"
                        .value=${t?.name??""}
                        .helper=${this._getActionHelperText(t)}
                        @value-changed=${s=>this._onActionChanged(a,s.detail.value)}
                      ></ha-selector>
                    </div>
                    <div class="action-row-actions">
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:pencil"
                        title="${u("common.edit_action")}"
                        @click=${()=>this._onEditAction(a)}
                      ></ha-icon>
                      ${t?.action!=="sync_selected_entity"&&t?.action!=="select_entity"?g`
                              <ha-icon
                                class="icon-button icon-button-compact icon-button-toggle ${t?.in_menu==="hidden"?"icon-button-disabled":t?.in_menu===!0?"active":""}"
                                icon="${t?.in_menu===!0?"mdi:menu":t?.in_menu==="hidden"?t?.card_trigger&&t.card_trigger!=="none"?"mdi:image-outline":"mdi:eye-off-outline":"mdi:view-grid-outline"}"
                                title="${t?.in_menu==="hidden"?t?.card_trigger&&t.card_trigger!=="none"?u("editor.placements.hidden"):`${u("editor.placements.hidden")} (${u("editor.placements.not_triggerable")})`:t?.in_menu?u("editor.fields.move_to_main"):u("editor.fields.move_to_menu")}"
                                role="button"
                                aria-label="${t?.in_menu===!0?u("editor.fields.move_to_main"):u("editor.fields.move_to_menu")}"
                                @click=${()=>{t?.in_menu!=="hidden"&&this._toggleActionInMenu(a)}}
                              ></ha-icon>
                            `:g`
                              <ha-icon
                                class="icon-button icon-button-compact icon-button-disabled"
                                icon="mdi:eye-off-outline"
                                title="${u(`editor.action_types.${t?.action}`)}"
                              ></ha-icon>
                            `}
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:trash-can"
                        title="${u("editor.fields.delete_action")}"
                        @click=${()=>this._removeAction(a)}
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
            @click=${()=>{const t=[...this._config.actions??[],{}],a=t.length-1;this._updateConfig("actions",t),this._onEditAction(a)}}
          ></ha-icon>
        </div>
      </div>
    `}_renderEntityEditor(e,t=this._entityEditorIndex,a=!1){typeof e=="string"&&(e={entity_id:e});const s=e?.volume_entity&&e.volume_entity!==e.entity_id&&!(e?.follow_active_volume??!1);return g`
        ${a?g`
                <div
                  class="entity-group-header section-header"
                  style="padding-top: 16px; border-top: 1px solid var(--divider-color);"
                >
                  <div
                    class="entity-group-title section-title"
                    style="color: var(--custom-accent, var(--accent-color, #ff9800));"
                  >
                    ${e?.name||this._entityValueRenderer(e?.entity_id)||"Entity"}
                    (${e?.entity_id||"No ID"})
                  </div>
                </div>
              `:g`
                <div class="entity-editor-header">
                  <ha-icon
                    class="icon-button"
                    icon="mdi:chevron-left"
                    title="${u("common.back")}"
                    @click=${this._onBackFromEntityEditor}
                  >
                  </ha-icon>
                  <div class="entity-editor-title">${u("editor.titles.edit_entity")}</div>
                </div>
              `}

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{entity:{domain:"media_player"}}}
            .value=${e?.entity_id??""}
          
            disabled
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            class="full-width"
            .selector=${{text:{}}}
            label="${u("editor.fields.name")}"
            .value=${e?.name??""}
            @value-changed=${r=>this._updateEntityProperty("name",r.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row" data-search-keys="hidden_controls previous play_pause stop next shuffle repeat favorite power">
          <div class="editor-field-wrapper">
            ${this._isTemplateMode("hidden_controls",e?.hidden_controls)?g`
                    <div class="grow-children">
                      <div
                        class=${this._yamlError&&typeof e?.hidden_controls=="string"&&e.hidden_controls.trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}
                        style="width: 100%;"
                      >
                        <span class="form-label">${u("editor.fields.hidden_controls")}</span>
                        <ha-code-editor
                          lint
                          id="hidden-controls-template-editor"
                          label="${u("editor.fields.hidden_controls")}"
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          .value=${typeof e?.hidden_controls=="string"?e.hidden_controls:""}
                          @value-changed=${r=>this._updateEntityProperty("hidden_controls",r.detail.value)}
                        ></ha-code-editor>
                        <div class="help-text">${u("editor.subtitles.hide_controls")}</div>
                      </div>
                    </div>
                  `:g`
                    <ha-selector
                      .hass=${this.hass}
                      .selector=${{select:{mode:"dropdown",multiple:!0,options:[{value:"previous",label:"Previous Track"},{value:"play_pause",label:"Play/Pause"},{value:"stop",label:"Stop"},{value:"next",label:"Next Track"},{value:"shuffle",label:"Shuffle"},{value:"repeat",label:"Repeat"},{value:"favorite",label:"Favorite"},{value:"power",label:"Power"}]}}}
                      .value=${(()=>{let r=e?.hidden_controls;if(typeof r=="string")try{r=JSON.parse(r.replace(/'/g,'"'))}catch{r=r.split(",").map(n=>n.trim()).filter(n=>n!=="")}return Array.isArray(r)?r:[]})()}
                      label="${u("editor.fields.hidden_controls")}"
                      helper="${u("editor.subtitles.hide_controls")}"
                      @value-changed=${r=>this._updateEntityProperty("hidden_controls",r.detail.value)}
                    ></ha-selector>
                  `}
            ${this._renderTemplateToggle("hidden_controls",e?.hidden_controls,r=>this._updateEntityProperty("hidden_controls",r))}
          </div>
        </div>

        <div class="form-row" data-search-keys="hide_remote_buttons back menu home power">
          <div class="editor-field-wrapper">
            ${this._isTemplateMode("hide_remote_buttons",e?.hide_remote_buttons)?g`
                    <div class="grow-children">
                      <div
                        class=${this._yamlError&&typeof e?.hide_remote_buttons=="string"&&e.hide_remote_buttons.trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}
                        style="width: 100%;"
                      >
                        <span class="form-label"
                          >${u("editor.fields.hide_remote_buttons")}</span
                        >
                        <ha-code-editor
                          lint
                          id="hidden-remote-buttons-template-editor"
                          label="${u("editor.fields.hide_remote_buttons")}"
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          .value=${typeof e?.hide_remote_buttons=="string"?e.hide_remote_buttons:""}
                          @value-changed=${r=>this._updateEntityProperty("hide_remote_buttons",r.detail.value)}
                        ></ha-code-editor>
                        <div class="help-text">
                          ${u("editor.subtitles.hide_remote_buttons")}
                        </div>
                      </div>
                    </div>
                  `:g`
                    <ha-selector
                      .hass=${this.hass}
                      .selector=${{select:{mode:"dropdown",multiple:!0,options:[{value:"back",label:"Back"},{value:"menu",label:"Menu"},{value:"home",label:"Home"},{value:"power",label:"Power"}]}}}
                      .value=${(()=>{let r=e?.hide_remote_buttons;if(typeof r=="string")try{r=JSON.parse(r.replace(/'/g,'"'))}catch{r=r.split(",").map(n=>n.trim()).filter(n=>n!=="")}return Array.isArray(r)?r:[]})()}
                      label="${u("editor.fields.hide_remote_buttons")}"
                      helper="${u("editor.subtitles.hide_remote_buttons")}"
                      @value-changed=${r=>this._updateEntityProperty("hide_remote_buttons",r.detail.value)}
                    ></ha-selector>
                  `}
            ${this._renderTemplateToggle("hide_remote_buttons",e?.hide_remote_buttons,r=>this._updateEntityProperty("hide_remote_buttons",r))}
          </div>
        </div>

 

        <div class="form-row">
          <div class="editor-field-wrapper">
            ${this._isTemplateMode("music_assistant_entity",e?.music_assistant_entity)?g`
                  <div class="grow-children">
                    <div class=${this._yamlError&&(e?.music_assistant_entity??"").trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"} style="width: 100%;">
                      <span class="form-label">${u("editor.fields.ma_template")}</span>
                      <ha-code-editor lint
                        id="ma-template-editor"
                        label="${u("editor.fields.ma_template")}"
                        .hass=${this.hass}
                        mode="jinja2"
                        autocomplete-entities
                        .value=${e?.music_assistant_entity??""}
                        @value-changed=${r=>this._updateEntityProperty("music_assistant_entity",r.detail.value)}
                      ></ha-code-editor>
                      <div class="help-text">
                        <ha-icon icon="mdi:information-outline"></ha-icon>
                        ${u("editor.subtitles.jinja_template_hint")}
                        <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_select.kitchen_stream_source','Music Stream 1') %}
  media_player.picore_house
{% else %}
  media_player.ma_wiim_mini
{% endif %}</pre>
                       </pre>
                      </div>
                    </div>
                  </div>
                  <div class="field-actions">
                    ${this._renderTemplateToggle("music_assistant_entity",e?.music_assistant_entity,r=>this._updateEntityProperty("music_assistant_entity",r))}
                  </div>
                `:g`
                    <div class="grow-children">
                      <ha-generic-picker
                        .hass=${this.hass}
                        .value=${this._isEntityId(e?.music_assistant_entity)?e.music_assistant_entity:""}
                        .label=${u("editor.fields.ma_entity")}
                        .valueRenderer=${r=>this._entityValueRenderer(r)}
                        .rowRenderer=${r=>this._entityRowRenderer(r)}
                        .getItems=${this._getEntityItems(["media_player"])}
                        @value-changed=${r=>this._updateEntityProperty("music_assistant_entity",r.detail.value)}
                        allow-custom-value
                      ></ha-generic-picker>
                    </div>
                    <div class="field-actions">
                      ${this._renderTemplateToggle("music_assistant_entity",e?.music_assistant_entity,r=>this._updateEntityProperty("music_assistant_entity",r))}
                    </div>
                  `}
          </div>
        </div>
        ${(()=>{if(this._isTemplateMode("music_assistant_entity",e?.music_assistant_entity))return v;const r=e?.entity_id,n=r?this.hass?.states?.[r]:void 0,o=n?$t(n):!1,l=e?.music_assistant_entity,c=this._looksLikeTemplate?.(l),d=typeof l=="string"&&!c?l:void 0,h=d?this.hass?.states?.[d]:void 0,p=h?$t(h):!1;return o||p?g`
            <div class="form-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",multiple:!0,options:[{value:"artist",label:"Artist"},{value:"album",label:"Album"},{value:"track",label:"Track"},{value:"playlist",label:"Playlist"},{value:"radio",label:"Radio"},{value:"podcast",label:"Podcast"},{value:"episode",label:"Episode"}]}}}
                .value=${Array.isArray(e?.hidden_filter_chips)?e.hidden_filter_chips:[]}
                label="${u("editor.fields.hidden_chips")}"
                helper="${u("editor.subtitles.hide_search_chips")}"
                @value-changed=${_=>this._updateEntityProperty("hidden_filter_chips",_.detail.value)}
              ></ha-selector>
            </div>
          `:v})()}

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="prefer-ma-metadata-toggle"
              .checked=${e?.prefer_ma_metadata??!1}
              .disabled=${!e?.music_assistant_entity||e.music_assistant_entity.trim()===""}
              @change=${r=>this._updateEntityProperty("prefer_ma_metadata",r.target.checked)}
            ></ha-switch>
            <label for="prefer-ma-metadata-toggle">${u("editor.labels.prefer_ma_metadata")}</label>
          </div>
          <div class="config-subtitle">${u("editor.subtitles.prefer_ma_metadata")}</div>
        </div>

        <div class="form-row">
          <ha-switch
            id="disable-auto-select-toggle"
            .checked=${e?.disable_auto_select??!1}
            @change=${r=>this._updateEntityProperty("disable_auto_select",r.target.checked)}
          ></ha-switch>
          <label for="disable-auto-select-toggle">${u("editor.labels.disable_auto_select")}</label>
          <div class="config-subtitle">${u("editor.subtitles.disable_auto_select")}</div>
        </div>

        <div class="form-row">
          <ha-switch
            id="group-volume-toggle"
            .checked=${e?.group_volume??!0}
            .disabled=${!e?.music_assistant_entity}
            @change=${r=>this._updateEntityProperty("group_volume",r.target.checked)}
          ></ha-switch>
          <label for="group-volume-toggle">Group Volume</label>
        </div>

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="follow-active-toggle"
              .checked=${e?.follow_active_volume??!1}
              @change=${r=>this._updateEntityProperty("follow_active_volume",r.target.checked)}
            ></ha-switch>
            <label for="follow-active-toggle">${u("editor.labels.follow_active_entity")}</label>
          </div>
        </div>

        ${e?.follow_active_volume??!1?v:g`
                <div class="form-row">
                  <div class="editor-field-wrapper">
                    ${this._isTemplateMode("volume_entity",e?.volume_entity)?g`
                            <div class="grow-children">
                              <div
                                class=${this._yamlError&&(e?.volume_entity??"").trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}
                                style="width: 100%;"
                              >
                                <span class="form-label"
                                  >${u("editor.fields.vol_template")}</span
                                >
                                <ha-code-editor
                                  lint
                                  id="vol-template-editor"
                                  label="${u("editor.fields.vol_template")}"
                                  .hass=${this.hass}
                                  mode="jinja2"
                                  autocomplete-entities
                                  .value=${e?.volume_entity??""}
                                  @value-changed=${r=>this._updateEntityProperty("volume_entity",r.detail.value)}
                                ></ha-code-editor>
                                <div class="help-text">
                                  <ha-icon icon="mdi:information-outline"></ha-icon>
                                  ${u("editor.subtitles.jinja_template_vol_hint")}
                                  <pre style="margin:6px 0; white-space:pre-wrap;">
{% if is_state('input_boolean.tv_volume','on') %}
  remote.soundbar
{% else %}
  media_player.office_homepod
{% endif %}</pre>
                                </div>
                              </div>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle("volume_entity",e?.volume_entity,r=>{const n={volume_entity:r};r||(n.sync_power=!1),this._updateEntityProperties(n)})}
                            </div>
                          `:g`
                            <div class="grow-children">
                              <ha-generic-picker
                                .hass=${this.hass}
                                .value=${this._isEntityId(e?.volume_entity)?e.volume_entity:e?.entity_id??""}
                                .label=${u("editor.fields.vol_entity")}
                                .valueRenderer=${r=>this._entityValueRenderer(r)}
                                .rowRenderer=${r=>this._entityRowRenderer(r)}
                                .getItems=${this._getEntityItems(["media_player","remote"])}
                                @value-changed=${r=>{const n=r.detail.value,o={volume_entity:n};(!n||n===e.entity_id)&&(o.sync_power=!1),this._updateEntityProperties(o)}}
                                allow-custom-value
                              ></ha-generic-picker>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle("volume_entity",e?.volume_entity,r=>{const n={volume_entity:r};r||(n.sync_power=!1),this._updateEntityProperties(n)})}
                            </div>
                          `}
                  </div>
                </div>
              `}

        ${g`
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="sync-power-toggle"
                .checked=${e?.sync_power??!1}
                .disabled=${!s}
                @change=${r=>this._updateEntityProperty("sync_power",r.target.checked)}
              ></ha-switch>
              <label for="sync-power-toggle">Sync Power</label>
            </div>
          </div>
        `}
        ${g`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${So}
                .value=${e?.entity_volume_mode??this._config.volume_mode??"slider"}
                label="${u("editor.fields.volume_mode")}"
                @value-changed=${r=>{const n=r.detail.value,o={entity_volume_mode:n||void 0};n!=="stepper"&&(o.entity_volume_step=void 0),this._updateEntityProperties(o)}}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button ${e?.entity_volume_mode?"":"icon-button-disabled"}"
              icon="mdi:restore"
              title="${u("common.reset_default")}"
              @click=${()=>{this._updateEntityProperties({entity_volume_mode:void 0,entity_volume_step:void 0})}}
            ></ha-icon>
          </div>
          ${g`
            <div class="form-row form-row-multi-column">
              <div class="grow-children">
                <ha-selector
                  .hass=${this.hass}
                  .selector=${Ao}
                  .value=${e?.entity_volume_step??this._config.volume_step??.05}
                  .disabled=${(e?.entity_volume_mode??this._config.volume_mode??"slider")!=="stepper"}
                  label="${u("editor.fields.vol_step")}"
                  @value-changed=${r=>this._updateEntityProperty("entity_volume_step",r.detail.value)}
                ></ha-selector>
              </div>
              <ha-icon
                class="icon-button ${e?.entity_volume_step===void 0?"icon-button-disabled":""}"
                icon="mdi:restore"
                title="${u("common.reset_default")}"
                @click=${()=>this._updateEntityProperty("entity_volume_step",void 0)}
              ></ha-icon>
            </div>
          `}
        `}

        ${e?.follow_active_volume?g`
                <div class="help-text">
                  <ha-icon icon="mdi:information-outline"></ha-icon>
                  ${u("editor.subtitles.follow_active_entity")}
                  <br /><br />
                </div>
              `:v}
        </div>
      `}_renderActionEditor(e,t=this._actionEditorIndex,a=!1){const s=this._actionMode??this._deriveActionMode(e);return g`
        ${a?g`
                <div
                  class="action-group-header section-header"
                  style="padding-top: 16px; border-top: 1px solid var(--divider-color);"
                >
                  <div
                    class="action-group-title section-title"
                    style="color: var(--custom-accent, var(--accent-color, #ff9800));"
                  >
                    Action: ${e?.name||`Action #${t+1}`}
                  </div>
                </div>
              `:g`
                <div class="action-editor-header">
                  <ha-icon
                    class="icon-button"
                    icon="mdi:chevron-left"
                    @click=${this._onBackFromActionEditor}
                  >
                  </ha-icon>
                  <div class="action-editor-title">${u("editor.titles.edit_action")}</div>
                </div>
              `}

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            class="full-width"
            .selector=${{text:{}}}
            label="${u("editor.fields.name")} (Icon Only)"
            .value=${e?.name??""}
            @value-changed=${r=>this._updateActionProperty("name",r.detail.value)}
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="${u("editor.fields.icon")}"
            .hass=${this.hass}
            .value=${e?.icon??""}
            @value-changed=${r=>this._updateActionProperty("icon",r.detail.value)}
          ></ha-icon-picker>
        </div>
 
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <div class="editor-field-wrapper">
              ${this._isTemplateMode("in_menu",e?.in_menu)?g`
                      <div class="grow-children" style="flex-direction: column;">
                        <span class="form-label">${u("editor.fields.placement")}</span>
                        <ha-code-editor
                          lint
                          .hass=${this.hass}
                          mode="jinja2"
                          autocomplete-entities
                          label="${u("editor.fields.placement")}"
                          .value=${typeof e?.in_menu=="string"?e.in_menu:String(!!e?.in_menu)}
                          @value-changed=${r=>this._updateActionProperty("in_menu",r.detail.value)}
                        ></ha-code-editor>
                      </div>
                      <div class="field-actions">
                        ${this._renderTemplateToggle("in_menu",e?.in_menu,r=>{const n={in_menu:r};r!=="hidden"&&(n.card_trigger="none"),this._updateActionProperties(n)},s==="sync_selected_entity"||s==="select_entity")}
                      </div>
                    `:g`
                      <div class="grow-children">
                        <ha-selector
                          .hass=${this.hass}
                          label="${u("editor.fields.placement")}"
                          .disabled=${s==="sync_selected_entity"||s==="select_entity"}
                          .selector=${{select:{mode:"dropdown",options:[{value:"chip",label:u("editor.placements.chip")},{value:"menu",label:u("editor.placements.menu")},{value:"hidden",label:u("editor.placements.hidden")}]}}}
                          .value=${e?.in_menu==="hidden"?"hidden":e?.in_menu?"menu":"chip"}
                          @value-changed=${r=>{const n=r.detail.value;let o=!1;n==="menu"?o=!0:n==="hidden"&&(o="hidden");const l={in_menu:o};n!=="hidden"&&(l.card_trigger="none"),this._updateActionProperties(l)}}
                        ></ha-selector>
                      </div>
                      <div class="field-actions">
                        ${this._renderTemplateToggle("in_menu",e?.in_menu,r=>{const n={in_menu:r};r!=="hidden"&&(n.card_trigger="none"),this._updateActionProperties(n)},s==="sync_selected_entity"||s==="select_entity")}
                      </div>
                    `}
            </div>
          </div>
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${u("editor.fields.card_trigger")}"
              .disabled=${s==="sync_selected_entity"||s==="select_entity"||!this._isTemplateValue(e?.in_menu)&&e?.in_menu!=="hidden"}
              .selector=${{select:{mode:"dropdown",options:[{value:"none",label:u("editor.triggers.none")},{value:"tap",label:u("editor.triggers.tap")},{value:"hold",label:u("editor.triggers.hold")},{value:"double_tap",label:u("editor.triggers.double_tap")},{value:"swipe_left",label:u("editor.triggers.swipe_left")},{value:"swipe_right",label:u("editor.triggers.swipe_right")}]}}}
              .value=${e?.card_trigger||"none"}
              @value-changed=${r=>this._updateActionProperty("card_trigger",r.detail.value)}
            ></ha-selector>
          </div>
        </div>
        ${e?.in_menu==="hidden"&&(!e?.card_trigger||e?.card_trigger==="none")&&s!=="sync_selected_entity"&&s!=="select_entity"?g`
                <div class="help-text">
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  ${u("editor.placements.hidden")}
                  (${u("editor.placements.not_triggerable")})
                </div>
              `:v}

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="${u("editor.fields.action_type")}"
            .selector=${{select:{mode:"dropdown",options:[{value:"menu",label:u("editor.action_types.menu")},{value:"service",label:u("editor.action_types.service")},{value:"navigate",label:u("editor.action_types.navigate")},{value:"sync_selected_entity",label:u("editor.action_types.sync_selected_entity")},{value:"select_entity",label:u("editor.action_types.select_entity")},{value:"prev_entity",label:u("editor.action_types.prev_entity")||"Previous Entity Chip"},{value:"next_entity",label:u("editor.action_types.next_entity")||"Next Entity Chip"},{value:"toggle_lyrics",label:u("editor.action_types.toggle_lyrics")||"Toggle Lyrics Overlay"},{value:"remote_control",label:u("editor.action_types.remote_control")||"Open Remote Controls Overlay"}]}}}
            .value=${this._actionMode??this._deriveActionMode(e)}
            @value-changed=${r=>{const n=r.detail.value;if(this._actionMode=n,n==="service"){const o={menu_item:void 0,navigation_path:void 0,navigation_new_tab:void 0,action:void 0};this._config.actions?.[this._actionEditorIndex]?.service||(o.service=""),this._updateActionProperties(o)}else if(n==="menu")this._updateActionProperties({service:void 0,service_data:void 0,script_variable:void 0,navigation_path:void 0,navigation_new_tab:void 0,action:void 0});else if(n==="navigate"){const o={menu_item:void 0,service:void 0,service_data:void 0,script_variable:void 0,action:"navigate"};e?.navigation_path||(o.navigation_path=""),this._updateActionProperties(o)}else if(n==="sync_selected_entity"){const o={menu_item:void 0,service:void 0,service_data:void 0,script_variable:void 0,navigation_path:void 0,navigation_new_tab:void 0,action:"sync_selected_entity",in_menu:"hidden",card_trigger:"none"};e?.sync_entity_type||(o.sync_entity_type="yamp_entity"),this._updateActionProperties(o)}else if(n==="select_entity"){const o={menu_item:void 0,service:void 0,service_data:void 0,script_variable:void 0,navigation_path:void 0,navigation_new_tab:void 0,action:"select_entity",in_menu:"hidden",card_trigger:"none"};e?.sync_entity_type||(o.sync_entity_type="yamp_entity"),this._updateActionProperties(o)}else n==="prev_entity"||n==="next_entity"?this._updateActionProperties({menu_item:void 0,service:void 0,service_data:void 0,script_variable:void 0,navigation_path:void 0,navigation_new_tab:void 0,action:n}):(n==="toggle_lyrics"||n==="remote_control")&&this._updateActionProperties({menu_item:void 0,service:void 0,service_data:void 0,script_variable:void 0,navigation_path:void 0,navigation_new_tab:void 0,action:n})}}
          ></ha-selector>
        </div>

        
        ${s==="menu"?g`
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    label="${u("editor.fields.menu_item")}"
                    .selector=${{select:{mode:"dropdown",options:[{value:"",label:""},{value:"search",label:u("card.menu.search")},{value:"search-recently-played",label:u("search.recently_played")},{value:"search-next-up",label:u("search.next_up")},{value:"source",label:u("card.menu.source")},{value:"more-info",label:u("card.menu.more_info")},{value:"group-players",label:u("card.menu.group_players")},{value:"transfer-queue",label:u("card.menu.transfer_queue")},{value:"main-menu",label:u("card.menu.main_menu")}]}}}
                    .value=${e?.menu_item??""}
                    @value-changed=${r=>this._updateActionProperty("menu_item",r.detail.value||void 0)}
                  ></ha-selector>
                </div>
              `:v} 
        ${s==="navigate"?g`
                <div class="form-row">
                  <div class="editor-field-wrapper">
                    ${this._isTemplateMode("navigation_path",e?.navigation_path)?g`
                            <div class="grow-children" style="flex-direction: column;">
                              <span class="form-label">${u("editor.fields.nav_path")}</span>
                              <ha-code-editor
                                lint
                                .hass=${this.hass}
                                mode="jinja2"
                                autocomplete-entities
                                label="${u("editor.fields.nav_path")}"
                                .value=${e?.navigation_path??""}
                                @value-changed=${r=>{this._updateActionProperties({navigation_path:r.detail.value,action:"navigate"})}}
                              ></ha-code-editor>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle("navigation_path",e?.navigation_path,r=>{this._updateActionProperties({navigation_path:r,action:"navigate"})})}
                            </div>
                          `:g`
                            <div class="grow-children">
                              <ha-selector
                                .hass=${this.hass}
                                class="full-width"
                                .selector=${{text:{}}}
                                label="${u("editor.fields.nav_path")} (/lovelace/music or #popup)"
                                .value=${e?.navigation_path??""}
                                @value-changed=${r=>{this._updateActionProperties({navigation_path:r.detail.value,action:"navigate"})}}
                              ></ha-selector>
                            </div>
                            <div class="field-actions">
                              ${this._renderTemplateToggle("navigation_path",e?.navigation_path,r=>{this._updateActionProperties({navigation_path:r,action:"navigate"})})}
                            </div>
                          `}
                  </div>
                </div>
                <div class="form-row form-row-multi-column">
                  <div>
                    <ha-switch
                      id="navigation-new-tab-toggle"
                      .checked=${e?.navigation_new_tab??!1}
                      @change=${r=>this._updateActionProperty("navigation_new_tab",r.target.checked)}
                    ></ha-switch>
                    <label for="navigation-new-tab-toggle">Open External URLs in New Tab</label>
                  </div>
                </div>
                <div class="form-row">
                  <div class="config-subtitle">
                    Supports dashboard paths, URLs, and anchors (e.g.,
                    <code>/lovelace/music</code> or <code>#pop-up-menu</code>).
                  </div>
                </div>
              `:v}
        ${s==="sync_selected_entity"||s==="select_entity"?g`
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:"input_text"}}}
                    .value=${e?.sync_entity_helper??""}
                    label="${u("editor.fields.selected_entity_helper")}"
                    @value-changed=${r=>this._updateActionProperty("sync_entity_helper",r.detail.value)}
                  ></ha-selector>
                  <div class="config-subtitle">
                    ${u(s==="select_entity"?"editor.subtitles.select_entity_helper":"editor.subtitles.selected_entity_helper")}
                  </div>
                </div>
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    label="${u("editor.fields.sync_entity_type")}"
                    .selector=${{select:{mode:"dropdown",options:[{value:"yamp_entity",label:u("editor.sync_entity_options.yamp_entity")},{value:"yamp_main_entity",label:u("editor.sync_entity_options.yamp_main_entity")},{value:"yamp_playback_entity",label:u("editor.sync_entity_options.yamp_playback_entity")}]}}}
                    .value=${e?.sync_entity_type??"yamp_entity"}
                    @value-changed=${r=>this._updateActionProperty("sync_entity_type",r.detail.value)}
                  ></ha-selector>
                  <div class="config-subtitle">
                    ${u("editor.subtitles.sync_entity_type")}
                  </div>
                </div>
              `:v}
        ${s==="service"?g`
                <div class="form-row">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{select:{mode:"dropdown",custom_value:!0,options:this._serviceItems||[]}}}
                    .value=${e.service??""}
                    label="${u("editor.fields.service")}"
                    @value-changed=${r=>this._updateActionProperty("service",r.detail.value)}
                  ></ha-selector>
                </div>

                ${typeof e.service=="string"&&e.service.startsWith("script.")?g`
                        <div
                          data-search-keys="script_variable"
                          class="form-row form-row-multi-column"
                        >
                          <div>
                            <ha-switch
                              id="script-variable-toggle"
                              .checked=${e?.script_variable??!1}
                              @change=${r=>this._updateActionProperty("script_variable",r.target.checked)}
                            ></ha-switch>
                            <span>${u("editor.labels.script_var")}</span>
                          </div>
                        </div>
                      `:v}
                ${typeof e.service=="string"?g`
                        <div class="help-text">
                          <ha-icon icon="mdi:information-outline"></ha-icon>

                          ${u("editor.subtitles.entity_current_hint")}
                        </div>
                        <div class="form-row">
                          <div
                            class=${this._yamlError&&this._yamlDraft?.trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}
                          >
                            <span class="form-label"
                              >${u("editor.fields.service_data")}</span
                            >
                            <ha-code-editor
                              lint
                              id="service-data-editor"
                              label="${u("editor.fields.service_data")}"
                              autocomplete-entities
                              autocomplete-icons
                              .hass=${this.hass}
                              mode="yaml"
                              .value=${this._yamlDraft!==void 0?this._yamlDraft:e?.service_data?Sh(e.service_data):""}
                              @value-changed=${r=>{if(this._yamlDraft!==r.detail.value){this._yamlDraft=r.detail.value;try{if(this._yamlDraft.trim()==="")this._yamlError=null,this._updateActionProperty("service_data",{});else{const n=qu(this._yamlDraft);n&&typeof n=="object"?(this._yamlError=null,this._updateActionProperty("service_data",n)):this._yamlError="Invalid YAML"}}catch(n){this._yamlError=n.message}}}}
                            ></ha-code-editor>
                            ${this._yamlError&&this._yamlDraft?.trim()!==""?g`<div class="yaml-error-message">${this._yamlError}</div>`:v}
                          </div>
                        </div>
                      `:v}
              `:v}
      </div>`}_onEntityChanged(e,t){const a=[...this._config.entities??[]];t?a[e]={...a[e],entity_id:t}:a.splice(e,1);const s=a.filter(r=>r.entity_id&&r.entity_id.trim()!=="");this._updateConfig("entities",s)}_onActionChanged(e,t){const a=[...this._config.actions??[]];a[e]={...a[e],name:t},this._updateConfig("actions",a)}_getActionHelperText(e){const t=e?.in_menu,a=t==="hidden"?"hidden":t===!0?"menu":"chip",s=e?.card_trigger;let r="";a==="menu"?r=" \u2022 In Menu":a==="hidden"&&e?.action!=="sync_selected_entity"&&e?.action!=="select_entity"&&(!s||s==="none"?r=` \u2022 ${u("editor.placements.hidden")} (${u("editor.placements.not_triggerable")})`:r=` \u2022 ${u("editor.placements.hidden")}`);let n="";if(s&&s!=="none"&&(n=` \u2022 Trigger: ${u(`editor.triggers.${s}`)}`),e?.action==="select_entity")return`${u("editor.action_helpers.select_entity")} ${e.sync_entity_helper||u("editor.action_helpers.select_helper")}${r}${n}`;if(e?.action==="sync_selected_entity")return`${u("editor.action_helpers.sync_selected_entity")} ${e.sync_entity_helper||u("editor.action_helpers.select_helper")}${r}${n}`;if(e?.action==="prev_entity")return`${u("editor.action_types.prev_entity")||"Previous Entity Chip"}${r}${n}`;if(e?.action==="next_entity")return`${u("editor.action_types.next_entity")||"Next Entity Chip"}${r}${n}`;if(e?.menu_item)return`Open Menu Item: ${e.menu_item}${r}${n}`;if(e?.service)return`Call Service: ${e.service}${r}${n}`;if(e?.navigation_path||e?.action==="navigate"){const o=e?.navigation_new_tab?" (New Tab)":"";return`Navigate to ${e.navigation_path||"(missing path)"}${o}${r}${n}`}return r||n?`Not Configured${r}${n}`:"Not Configured"}_onEditEntity(e){this._entityEditorIndex=e,this._templateModes={}}_onEditAction(e){this._actionEditorIndex=e,this._templateModes={},this._yamlDraft=void 0,this._yamlError=null;const t=this._config.actions?.[e];this._actionMode=this._deriveActionMode(t),this._actionMode==="service"&&typeof t?.service!="string"&&this._updateActionProperty("service","")}_onBackFromEntityEditor(){this._entityEditorIndex=null,this._templateModes={}}_onBackFromActionEditor(){this._actionEditorIndex=null,this._actionMode=null,this._templateModes={}}_onEntityMoved(e){const{oldIndex:t,newIndex:a}=e.detail,s=[...this._config.entities];if(t>=s.length||a>=s.length)return;const[r]=s.splice(t,1);s.splice(a,0,r),this._updateConfig("entities",s)}_onActionMoved(e){const{oldIndex:t,newIndex:a}=e.detail,s=[...this._config.actions];if(t>=s.length||a>=s.length)return;const[r]=s.splice(t,1);s.splice(a,0,r),this._updateConfig("actions",s)}_removeAction(e){const t=[...this._config.actions??[]];e<0||e>=t.length||(t.splice(e,1),this._updateConfig("actions",t))}_toggleActionInMenu(e){const t=[...this._config.actions??[]];if(!t[e])return;const a=!!t[e].in_menu,s={...t[e],in_menu:!a};delete s.placement,t[e]=s,this._updateConfig("actions",t)}_onToggleChanged(e){const t={...this._config,always_collapsed:e.target.checked};this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))}_looksLikeUrlOrPath(e){return e?e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")||e.includes(".jpg")||e.includes(".jpeg")||e.includes(".png")||e.includes(".gif")||e.includes(".webp"):!1}}customElements.define("yet-another-media-player-editor",ep);var tp=Object.defineProperty,ip=(i,e,t)=>e in i?tp(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,vt=(i,e,t)=>ip(i,typeof e!="symbol"?e+"":e,t);const ap=500,$o=3e3,sp=30,Co=Object.freeze(["details","menu","action_chips"]),rp=Object.freeze([...Co]),np=Object.freeze({details:"--yamp-text-scale-details",menu:"--yamp-text-scale-menu",action_chips:"--yamp-text-scale-action-chips"}),Io=500,Bt=15,To=300,op=500,lp=300,Mo=50;window.customCards=window.customCards||[],window.customCards.some(i=>i.type==="yet-another-media-player")||window.customCards.push({type:"yet-another-media-player",name:"Yet Another Media Player",description:"YAMP is a multi-entity media card with custom actions",preview:!0,getEntitySuggestion:(i,e)=>e.split(".")[0]!=="media_player"?null:{config:{type:"custom:yet-another-media-player",entities:[e]}}}),console.info("%c YET-ANOTHER-MEDIA-PLAYER %c 2026.9.0-beta.1 ","color: white; background: #ff9800; font-weight: bold; border-radius: 4px 0 0 4px; padding: 1px 5px;","color: #ff9800; background: white; font-weight: bold; border-radius: 0 4px 4px 0; padding: 1px 5px; border: 1px solid #ff9800; border-left: none;");class Ws extends Fc(Ye){constructor(){super(),vt(this,"_lastChipDoubleTapTime",0),vt(this,"_hoveredSourceLetterIndex",null),vt(this,"_lastGroupingMasterId",null),vt(this,"_cardTriggers",{tap:null,hold:null,double_tap:null,swipe_left:null,swipe_right:null}),vt(this,"_debouncedVolumeTimer",null),this._selectedIndex=0,this._lastSyncedEntityId=null,this._lastPlaying=null,this._manualSelect=!1,this._lastActiveEntityId=null,this._playTimestamps={},this._lastMediaTitle=null,this._showSourceMenu=!1,this._shouldDropdownOpenUp=!1,this._collapsedArtDominantColor="#444",this._lastArtworkUrl=null,this._aspectRatioCache={},this._addToPlaylistTarget=null,this._progressTimer=null,this._progressValue=null,this._lastProgressEntityId=null,this._pinnedIndex=null,this._sourceDropdownOutsideHandler=null,this._isIdle=!1,this._idleTimeout=null,this._showEntityOptions=!1,this._showMediaTitleOptions=!1,this._dismissMenuAfterPlaylistAdd=!1,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showRemoteControl=!1,this._cardHeightTemplateValue={},this._cardHeightResolveCache={},this._lastCardHeightContextKey=null,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._hasTransferQueueForCurrent=!1,this._transferQueueAutoCloseTimer=null,this._alternateProgressBar=!1,this._lastSpacerRendered=!0,this._lastVolumeRendered=!0,this._groupBaseVolume=null,this._searchQuery="",this._searchLoading=!1,this._searchResults=[],this._searchDisplaySortOverride=null,this._searchError="",this._searchTotalRows=15,this._searchResultsByType={},this._currentSearchQuery="",this._latestSearchToken=0,this._latestManualShiftTime=0,this._searchTimeoutHandle=null,this._swapPauseForStop=!1,this._controlLayoutTemplateValue={},this._controlLayoutResolveCache={},this._searchHierarchy=[],this._searchBreadcrumb="",this._playbackLingerByIdx={},this._lastResolvedEntityIdByChip={},this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._showQueueSuccessMessage=!1,this._searchActiveOptionsItem=null,this._volumeDraggingEntity=null,this._dragVolume=0,this._activeSearchRowMenuId=null,this._loadingSearchRowMenuId=null,this._errorSearchRowMenuId=null,this._successSearchRowMenuId=null,this._successSearchRowType=null,this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._radioModeActive=!1,this._massQueueAvailable=!1,this._hasMassQueueIntegration=null,this._checkingMassQueueIntegration=!1,this._lyricsCache=new Map,this._quickMenuInvoke=!1,this._collapsedBaselineHeight=220,this._lastRenderedCollapsed=!1,this._lastRenderedHideControls=!1,this._baseArtworkObjectFit="cover",this._idleScreen="default",this._idleScreenApplied=!1,this._hasSeenPlayback=!1,this._adaptiveText=!1,this._textResizeObserver=null,this._currentTextScale=null,this._adaptiveTextTargets=new Set,this._idleImageTemplate=null,this._idleImageTemplateResult="",this._resolvingIdleImageTemplate=!1,this._idleImageTemplateNeedsResolve=!1,this._artworkOverrideTemplateCache={},this._artworkOverrideIndexMap=null,this._hideActiveEntityLabel=!1,this._hideActiveEntityLabelOnIdle=!1,this._currentDetailsScale=null,this._lastTitleLength=0,this._massLyrics=[],this._lastLyricsTrackId=null,this._lastLyricsArtist=null,this._lastLyricsTitle=null,this._lastLyricsEntityId=null,this._lyricsActive=!1,this._fetchingLyrics=!1,this._fetchingCacheKey=null,this._lyricsError=!1,this._suspendAdaptiveScaling=!1,this._pendingAdaptiveScaleUpdate=!1,this._adaptiveScrollTimer=null,this._lyricsFetchTimeout=null,this._handleGlobalScroll=this._handleGlobalScroll.bind(this),this._handleViewportResize=this._handleViewportResize.bind(this),this._isNarrowViewport=!1,setTimeout(()=>{if(this._cardType==="search"){this._showEntityOptions=!0,this._setIdleState(!1),this._showSearchSheetInOptions(),this.requestUpdate();return}if(this._cardType==="up_next"){this._showEntityOptions=!0,this._setIdleState(!1),this._showSearchSheetInOptions("next-up"),this.requestUpdate();return}if(this._cardType==="remote_control"){this._showEntityOptions=!0,this._showRemoteControl=!0,this._setIdleState(!1),this.requestUpdate();return}if(this._cardType==="group_players"){this._showEntityOptions=!0,this._setIdleState(!1),this._showGrouping=!0,this.requestUpdate();return}if(this.hass&&this.entityIds&&this.entityIds.length>0){const e=this.hass.states[this.entityIds[this._selectedIndex]],t=this._playbackLingerByIdx?.[this._selectedIndex]&&this._playbackLingerByIdx[this._selectedIndex].until>Date.now(),a=this.entityIds.some((n,o)=>{if(this._isAutoSelectDisabled(o))return!1;const l=this.hass.states[n];return this._isEntityPlaying(l)}),s=this._isAutoSelectDisabled(this._selectedIndex),r=this._isEntityPlaying(e)&&(!s||this._manualSelect);e&&!r&&!a&&!t&&this._idleTimeoutMs>0&&(this._setIdleState(!0),this.requestUpdate())}},0),this._prevCollapsed=null,this._searchAttempted=!1,this._searchMediaClassFilter="all",this._lastSearchChipClasses="",this._swipeStartX=null,this._searchSwipeAttached=!1,this._manualSelectPlayingSet=null,this._idleTimeoutMs=6e4,this._volumeStep=.05,this._searchInputAutoFocused=!1,this._disableSearchAutofocus=!1,this._optimisticPlayback=null,this._lastPlaybackEntityId=null,this._entitySwitchDebounceTimer=null,this._lastMainState=null,this._lastMaState=null,this._maResolveCache={},this._maResolveTtlMs=7e3,this._manualSelectTimeout=null,this._templateSubscriptions={},this._activeSubscriptionTokens={},this._maTemplateValues={},this._volTemplateValues={},this._actionInMenuTemplateValues={},this._actionInMenuResolveCache={},this._alwaysCollapsedTemplateValue={},this._alwaysCollapsedResolveCache={},this._hiddenControlsTemplateValues={},this._hiddenControlsResolveCache={},this._lastActionEntityId=null,this._volResolveCache={},this._volResolveTtlMs=7e3,this._lastPlayingEntityId=null,this._controlFocusEntityId=null,this._lastActiveEntityIdByChip={},this._playerStateCache={},this._volumeOverlayActive=!1,this._volumeOverlayValue=0,this._volumeOverlayTimer=null,this._internalVolumeSuppressTimer=null,this._lastTrackedVolumeLevel=null,this._lastTrackedVolEntityId=null,this._volumeOverlayMuted=!1,this._internalVolumeChangeFlag=!1,this._showVolumeOverlay=!1,this._queueOperationPromise=Promise.resolve(),this._queueOpsTotal=0,this._queueOpsCompleted=0,this._queueOpsTimeout=null}_handleChipPointerDown(e,t){this._chipGestureStartX=e.clientX,this._chipGestureStartY=e.clientY,this._holdToPin&&this._holdHandler&&this._holdHandler.pointerDown(e,t)}_applyIdleScreen(){if(!this._idleScreenApplied){switch(this._idleScreen||"default"){case"search":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("default");break;case"search-recently-played":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("recently-played");break;case"search-next-up":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("next-up");break;default:return}this._idleScreenApplied=!0}}_getSearchDismissBehavior(){const e=this.config.dismiss_search_on_play!==!1,t=this._cardType==="search";return{shouldDismiss:!t&&e,shouldReset:t&&e}}_resetIdleScreen(){if(!this._idleScreenApplied)return;const{shouldDismiss:e,shouldReset:t}=this._getSearchDismissBehavior();switch(this._idleScreen){case"search":case"search-recently-played":case"search-next-up":if(e)this._hideSearchSheetInOptions(),this._showEntityOptions=!1;else if(t)this._showSearchSheetInOptions();else{this._idleScreenApplied=!1;return}break}this._idleScreenApplied=!1,this.requestUpdate()}_handleChipPointerMove(e,t){this._holdToPin&&this._holdHandler&&this._holdHandler.pointerMove(e,t)}_handleChipPointerUp(e,t){if(this._holdToPin&&this._holdHandler&&this._holdHandler.pointerUp(e,t),e.pointerType!=="touch"&&e.pointerType!=="pen"||e.type!=="pointerup")return;const a=e.clientX-this._chipGestureStartX,s=e.clientY-this._chipGestureStartY,r=Math.abs(a),n=Math.abs(s);if(r>Bt||n>Bt)return;const o=Date.now(),l=o-(this._lastChipTapTime||0);this._lastChipTapTime=o,l<To&&this._lastChipTapIdx===t&&(this._lastChipTapTime=0,this._lastChipDoubleTapTime=o,this._quickGroupingMode=!this._quickGroupingMode,this.requestUpdate()),this._lastChipTapIdx=t}_supportsFeature(e,t){return!e||typeof e.attributes.supported_features!="number"?!1:(e.attributes.supported_features&t)!==0}_isGroupCapable(e){return!e||e.attributes?.mass_player_type==="group"?!1:this._supportsFeature(e,Gr)?!0:Array.isArray(e.attributes?.group_members)}_isCurrentlyGrouped(e){return this._isGroupCapable(e)?Array.isArray(e?.attributes?.group_members)&&e.attributes.group_members.length>1:!1}_findAssociatedButtonEntities(e){return Ec(this.hass,e)}_cleanTrackMetadata(e){return!e||typeof e!="string"?"":e.split(" - ")[0].replace(/\(feat\..*?\)/gi,"").replace(/\(with.*?\)/gi,"").replace(/\[.*?\]/g,"").replace(/\(.*?\)/g,"").replace(/- \d{4} Remaster.*/gi,"").replace(/- Remastered.*/gi,"").replace(/- Single.*/gi,"").trim()}_getFavoriteButtonEntity(){if(!this.entityObjs[this._selectedIndex])return null;const e=this._getActivePlaybackEntityId(this._selectedIndex);if(!e)return null;const t=this.hass?.states?.[e];return!t||!$t(t)?null:this._findAssociatedButtonEntities(e).find(a=>a.friendly_name.toLowerCase().includes("favorite")||a.friendly_name.toLowerCase().includes("like")||a.device_class==="favorite"||a.entity_id.toLowerCase().includes("favorite"))?.entity_id||null}_getMusicAssistantState(){const e=this._getActivePlaybackEntityId(this._selectedIndex);return e?Sc(this.hass,e):null}_isCurrentTrackFavorited(){if(!this.entityObjs[this._selectedIndex])return!1;const e=this._getMusicAssistantState();if(!e)return!1;const t=e.attributes?.media_content_id;if(!t)return!1;if(typeof e.attributes?.is_favorite=="boolean")return e.attributes.is_favorite;if(this._favoriteStatusCache&&this._favoriteStatusCache[t]!==void 0){const a=this._favoriteStatusCache[t];if(typeof a=="object"&&a.isFavorited!==void 0)return a.isFavorited;if(typeof a=="boolean")return a}return(!this._checkingFavorites||this._checkingFavorites!==t)&&(this._checkingFavorites=t,this._checkFavoriteStatusAsync(t)),!1}async _checkFavoriteStatusAsync(e){if(!(!e||!this.hass))try{const t=this._getMusicAssistantState(),a=t?.entity_id,s=t.attributes?.media_title,r=t.attributes?.media_artist,n=await Gc(this.hass,e,a,s,r,200);this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[e]={isFavorited:n},this._checkingFavorites=null,this.requestUpdate()}catch{this._checkingFavorites=null}}connectedCallback(){super.connectedCallback(),window.addEventListener("scroll",this._handleGlobalScroll,{passive:!0}),window.addEventListener("resize",this._handleViewportResize,{passive:!0}),this._updateViewportFlags(),this._updateAdaptiveTextObserverState()}_scrollToSourceLetter(e){const t=this.renderRoot.querySelector(".entity-options-sheet");if(!t)return;const a=Array.from(t.querySelectorAll(".entity-options-item")).find(s=>(s.textContent||"").trim().toUpperCase().startsWith(e));a&&a.scrollIntoView({behavior:"smooth",block:"center"})}_shouldShowStopButton(e){if(!this._supportsFeature(e,wc))return!1;const t=this.renderRoot?.querySelector(".controls-row");if(!t)return!0;const a=t.offsetWidth>480,s=!!this._getFavoriteButtonEntity()&&!this._getHiddenControlsForCurrentEntity().favorite,r=Wa(e,(n,o)=>this._supportsFeature(n,o),s,this._getHiddenControlsForCurrentEntity(),!0,this._controlLayout);return a||r<=5}_isAutoSelectDisabled(e){const t=this.config.entities[e];return typeof t=="string"?!1:!!t.disable_auto_select}get sortedEntityIds(){return this.entityIds.map((e,t)=>{const a=this._isAutoSelectDisabled(t),s=a?0:this._playTimestamps[e]||0;return{id:e,idx:t,ts:s,disabled:a}}).sort((e,t)=>e.disabled!==t.disabled?e.disabled-t.disabled:e.ts===t.ts?e.idx-t.idx:t.ts-e.ts).map(e=>e.id)}get groupedSortedEntityIds(){const e=this.entityIds;if(!e||!Array.isArray(e))return[];const t=new Set(e),a={};for(let s=0;s<e.length;s++){const r=e[s];let n=this._getGroupKey(r);(this._quickGroupingMode||!t.has(n))&&(n=r),a[n]||(a[n]={ids:[],ts:0,minIdx:s,allDisabled:!0}),a[n].ids.push(r);const o=this._isAutoSelectDisabled(s),l=o?0:this._playTimestamps[r]||0;o||(a[n].allDisabled=!1),a[n].ts=Math.max(a[n].ts,l)}return Object.values(a).sort((s,r)=>s.allDisabled!==r.allDisabled?s.allDisabled-r.allDisabled:r.ts===s.ts?s.minIdx-r.minIdx:r.ts-s.ts).map(s=>s.ids.sort())}get _controlLayout(){const e=this.config?.control_layout;let t=e;if(typeof e=="string"&&(e.includes("{{")||e.includes("{%")||e.trim().startsWith("[[["))){const a=this._controlLayoutResolveCache?.card?.value;if(a!=null&&a!=="")t=a;else return"classic"}return(typeof t=="string"?t.trim().toLowerCase():"classic")==="modern"?"modern":"classic"}get _alwaysCollapsed(){const e=this.config?.always_collapsed;if(typeof e=="string"&&(e.includes("{{")||e.includes("{%")||e.trim().startsWith("[[["))){const t=this._alwaysCollapsedResolveCache?.card?.value;if(t!=null&&t!==""){if(typeof t=="boolean")return t;const a=String(t).trim().toLowerCase();return a==="true"||a==="1"||a==="on"||a==="yes"}return!1}return!!e}get _artworkObjectFit(){const e=this._baseArtworkObjectFit||"cover";return e==="scaled-contain-alternate"&&this._alwaysCollapsed?"scaled-contain":e}get _cardType(){return this.config?.card_type||"default"}get _isSpecializedCard(){return this._cardType!=="default"}_subscribeToTemplate(e,t,a){if(!this.hass||!this.hass.connection)return;const s=`${e}_${t}`;let r,n,o;if(t==="ma"?(r=this._maTemplateValues[e],n=this._maTemplateValues,o=this._maResolveCache):t==="vol"?(r=this._volTemplateValues[e],n=this._volTemplateValues,o=this._volResolveCache):t==="action_in_menu"?(r=this._actionInMenuTemplateValues[e],n=this._actionInMenuTemplateValues,o=this._actionInMenuResolveCache):t==="always_collapsed"?(r=this._alwaysCollapsedTemplateValue[e],n=this._alwaysCollapsedTemplateValue,o=this._alwaysCollapsedResolveCache):t==="hidden_controls"?(r=this._hiddenControlsTemplateValues[e],n=this._hiddenControlsTemplateValues,o=this._hiddenControlsResolveCache):t==="control_layout"?(r=this._controlLayoutTemplateValue[e],n=this._controlLayoutTemplateValue,o=this._controlLayoutResolveCache):t==="card_height"&&(r=this._cardHeightTemplateValue[e],n=this._cardHeightTemplateValue,o=this._cardHeightResolveCache),this._templateSubscriptions[s]&&r?.template===a)return;this._unsubscribeFromTemplate(e,t),n[e]={template:a,resolved:null};const l=Symbol("subToken");this._activeSubscriptionTokens[s]=l,this._templateSubscriptions[s]=l;try{const c=this._getTemplateContext(),d=`${Object.entries(c).map(([h,p])=>`{% set ${h} = ${JSON.stringify(p)} %}`).join(" ")} ${a}`;this.hass.connection.subscribeMessage(h=>{if(this._activeSubscriptionTokens[s]!==l)return;const p=(h.result||"").toString().trim();let _=!1;t==="ma"||t==="vol"?_=p&&/^([a-z0-9_]+)\.[a-zA-Z0-9_]+$/.test(p):(t==="action_in_menu"||t==="always_collapsed"||t==="control_layout"||t==="card_height"||t==="hidden_controls")&&(_=!0);let m=!1;if(n[e]&&(n[e].resolved=_?p:null),t==="ma"||t==="vol"){const f=o[e]?.id;_&&f!==p&&(o[e]={id:p,ts:Date.now()},m=!0)}else if(t==="action_in_menu"||t==="always_collapsed"||t==="control_layout"||t==="card_height"||t==="hidden_controls"){const f=o[e]?.value;_&&f!==p&&(o[e]={value:p,ts:Date.now()},m=!0)}m&&this.requestUpdate()},{type:"render_template",template:d}).then(h=>{if(this._activeSubscriptionTokens[s]!==l)try{h()}catch{}else this._templateSubscriptions[s]=h})}catch(c){console.warn("yamp: failed to subscribe to template:",c)}}_unsubscribeFromTemplate(e,t){const a=`${e}_${t}`,s=this._templateSubscriptions[a];if(s){if(typeof s=="function")try{s()}catch{}delete this._templateSubscriptions[a],delete this._activeSubscriptionTokens[a]}}async _ensureResolvedTemplateForIndex(e,t,a,s,r,n={}){const{allowObject:o=!1,cacheStaticString:l=!1}=n;if(!a||typeof a!="string"&&!(o&&typeof a=="object")){delete s[e],this._unsubscribeFromTemplate(e,t),r[e]&&delete r[e];return}if(typeof a=="string"){if(a.trim().startsWith("[[[")){this._unsubscribeFromTemplate(e,t),r[e]&&delete r[e];const c=this._evaluateJsTemplate(a),d=o?s[e]?.value:s[e]?.id;let h;typeof c=="object"&&c!==null?h=JSON.stringify(d)!==JSON.stringify(c):Number.isNaN(c)&&Number.isNaN(d)?h=!1:h=d!==c,h&&(o?s[e]={value:c,ts:Date.now()}:s[e]={id:c,ts:Date.now()},this.requestUpdate());return}if(!(a.includes("{{")||a.includes("{%"))){this._unsubscribeFromTemplate(e,t),r[e]&&delete r[e],l?s[e]={id:a,ts:Date.now()}:delete s[e];return}this._subscribeToTemplate(e,t,a)}else o&&typeof a=="object"&&(delete s[e],this._unsubscribeFromTemplate(e,t),r[e]&&delete r[e])}async _ensureResolvedMaForIndex(e){const t=this.entityObjs?.[e];if(t)return this._ensureResolvedTemplateForIndex(e,"ma",t.music_assistant_entity,this._maResolveCache,this._maTemplateValues,{cacheStaticString:!0})}async _ensureResolvedVolForIndex(e){const t=this.entityObjs?.[e];if(t){if(t.follow_active_volume){delete this._volResolveCache[e],this._unsubscribeFromTemplate(e,"vol"),this._volTemplateValues[e]&&delete this._volTemplateValues[e];return}return this._ensureResolvedTemplateForIndex(e,"vol",t.volume_entity,this._volResolveCache,this._volTemplateValues,{cacheStaticString:!0})}}async _ensureResolvedHiddenControlsForIndex(e){const t=this.entityObjs?.[e];if(t)return this._ensureResolvedTemplateForIndex(e,"hidden_controls",t.hidden_controls,this._hiddenControlsResolveCache,this._hiddenControlsTemplateValues,{allowObject:!0})}_evaluateJsTemplate(e){if(typeof e!="string")return e;const t=e.trim();if(!t.startsWith("[[[")||!t.endsWith("]]]"))return e;const a=t.substring(3,t.length-3).trim();try{const s=this.hass;if(!s)return;const r=s.states,n=s.user,o=(d,h)=>r[d]?.state===h,l=(d,h)=>r[d]?.attributes?.[h],c=this._getTemplateContext();if(this._compiledJsTemplates||(this._compiledJsTemplates={}),!this._compiledJsTemplates[a]){const d=a.includes("return")?a:`return (${a});`;this._compiledJsTemplates[a]=new Function("hass","states","user","is_state","state_attr","current","is_idle","is_playing","is_search","is_grouping","is_source","is_lyrics","is_options","is_transfer_queue","is_any_menu_open",d)}return this._compiledJsTemplates[a](s,r,n,o,l,c.current,c.is_idle,c.is_playing,c.is_search,c.is_grouping,c.is_source,c.is_lyrics,c.is_options,c.is_transfer_queue,c.is_any_menu_open)}catch(s){console.warn("yamp: failed to evaluate JS template:",e,s);return}}_syncTemplateSubscriptions(e,t,a){if(!this.hass)return;let s,r,n;if(e==="always_collapsed")s=this._alwaysCollapsedTemplateValue,r=this._alwaysCollapsedResolveCache,n="_lastAlwaysCollapsedContextKey";else if(e==="action_in_menu")s=this._actionInMenuTemplateValues,r=this._actionInMenuResolveCache,n="_lastActionTemplateContextKey";else if(e==="control_layout")s=this._controlLayoutTemplateValue,r=this._controlLayoutResolveCache,n="_lastControlLayoutContextKey";else if(e==="card_height")s=this._cardHeightTemplateValue,r=this._cardHeightResolveCache,n="_lastCardHeightContextKey";else return;const o=this[n]!==t;o&&(this[n]=t);const l=(c,d)=>{if(typeof d=="string"&&d.trim().startsWith("[[[")){this._unsubscribeFromTemplate(c,e);const h=this._evaluateJsTemplate(d),p=r[c]?.value;let _;typeof h=="object"&&h!==null?_=JSON.stringify(p)!==JSON.stringify(h):Number.isNaN(h)&&Number.isNaN(p)?_=!1:_=p!==h,_&&(r[c]={value:h,ts:Date.now()},this.requestUpdate())}else typeof d=="string"&&(d.includes("{{")||d.includes("{%"))?(o&&(this._unsubscribeFromTemplate(c,e),s[c]&&delete s[c],r[c]&&delete r[c]),this._subscribeToTemplate(c,e,d)):(this._unsubscribeFromTemplate(c,e),s[c]&&delete s[c],delete r[c])};if(e==="always_collapsed"||e==="control_layout"||e==="card_height")l("card",a);else if(e==="action_in_menu"){const c=a||[];c.forEach((h,p)=>l(p,h?.in_menu));let d=c.length;for(;this._templateSubscriptions[`${d}_${e}`]||s[d]||r[d];)this._unsubscribeFromTemplate(d,e),delete s[d],delete r[d],d++}}_syncEntityTemplateSubscriptions(e,t){if(!this.hass||!this.entityObjs)return;const a=`_lastEntity_${e}ContextKey`;this[a]!==t&&(this[a]=t,this.entityObjs.forEach((s,r)=>{this._templateSubscriptions[`${r}_${e}`]&&this._unsubscribeFromTemplate(r,e),e==="ma"?this._ensureResolvedMaForIndex(r):e==="vol"?this._ensureResolvedVolForIndex(r):e==="hidden_controls"&&this._ensureResolvedHiddenControlsForIndex(r)}))}_getResolvedPlaybackEntityIdSync(e){return this._getEntityForPurpose(e,"playback_control")}_getResolvedVolumeEntityIdSync(e){const t=this.entityObjs[e];if(!t)return null;if(t.follow_active_volume)return this._getActivePlaybackEntityId();const a=this._volResolveCache?.[e]?.id;if(a&&typeof a=="string")return a;const s=t.volume_entity;return s&&typeof s=="string"&&!(s.includes("{{")||s.includes("{%")||s.trim().startsWith("[[["))?s:t.entity_id}_getActualResolvedMaEntityForState(e){const t=this.entityObjs[e];if(!t)return null;const a=this._maResolveCache?.[e]?.id;if(a&&typeof a=="string")return a;const s=t.music_assistant_entity;return s&&typeof s=="string"&&!s.includes("{{")&&!s.includes("{%")&&!s.trim().startsWith("[[[")?s:t.entity_id}_isEntityPlaying(e){if(!e)return!1;const t=e.state?.toLowerCase();return t==="playing"||t==="buffering"}_isCurrentEntityPlaying(){const e=this.currentEntityId,t=this._getActualResolvedMaEntityForState(this._selectedIndex),a=e?this.hass?.states?.[e]:null,s=t?this.hass?.states?.[t]:null;return this._isEntityPlaying(a)||this._isEntityPlaying(s)}async _resolveTemplateAtActionTime(e,t){return kc(this.hass,e,t)}_attachSearchSwipe(){if(this._searchSwipeAttached)return;const e=this.renderRoot.querySelector(".entity-options-search-results");if(!e||this._searchHierarchy.length>0)return;this._searchSwipeAttached=!0;const t=40,a=r=>{r.touches.length===1&&(this._swipeStartX=r.touches[0].clientX)},s=r=>{if(this._swipeStartX===null)return;const n=r.changedTouches&&r.changedTouches[0].clientX||null;if(n===null){this._swipeStartX=null;return}const o=n-this._swipeStartX;if(Math.abs(o)>t){const l=new Set;Object.values(this._searchResultsByType).forEach(y=>{y.forEach(b=>{b.media_class&&l.add(b.media_class)})});const c=this.entityObjs?.[this._selectedIndex]||null,d=new Set(c?.hidden_filter_chips||[]),h=["all",...Array.from(l).filter(y=>!d.has(y))],p=h.indexOf(this._searchMediaClassFilter||"all"),_=o<0?1:-1;let m=(p+_+h.length)%h.length;const f=h[m];this._doSearch(f==="all"?null:f)}this._swipeStartX=null};e.addEventListener("touchstart",a,{passive:!0}),e.addEventListener("touchend",s,{passive:!0}),e._searchSwipeHandlers={touchstart:a,touchend:s}}_getMockItemFromCurrentTrack(){const e=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;return!e||!e.attributes||!e.attributes.media_title?null:{title:e.attributes.media_title,media_title:e.attributes.media_title,media_content_id:e.attributes.media_content_id||e.attributes.media_title,media_artist:e.attributes.media_artist||"",media_content_type:"track",media_type:"track"}}_isCurrentlyPlayingRadio(){const e=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;if(!e?.attributes)return!1;const t=(e.attributes.media_content_type||"").toLowerCase(),a=(e.attributes.media_content_id||"").toLowerCase();return t==="radio"||a.startsWith("library://radio/")}_handlePlaySimilar(){const e=this._getMockItemFromCurrentTrack();e&&(this._showMediaTitleOptions=!1,this._radioModeActive=!0,this._playMediaFromSearch(e))}async _handleAddCurrentToPlaylist(){const e=this._getMockItemFromCurrentTrack();if(e){if(this._showMediaTitleOptions=!1,this._showEntityOptions=!0,this._showSearchInSheet=!0,this._dismissMenuAfterPlaylistAdd=!0,this._isCurrentlyPlayingRadio()){const t=e.title;this._addToPlaylistTarget=null,this._searchHierarchy.push({type:"select_track_for_playlist",name:u("search.select_track_for_playlist",{"{track}":e.title,"{artist}":e.media_artist}),query:this._searchQuery,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=u("search.select_track_for_playlist",{"{track}":e.title,"{artist}":e.media_artist}),this._searchQuery=t,this._currentSearchQuery=t,this._searchMediaClassFilter="track",this._resetSearchContext(),this._removeSearchSwipeHandlers(),await this._doSearch("track",{clearFilters:!0,artist:e.media_artist});return}this._performSearchOptionAction(e,"add_to_playlist")}}_searchArtistFromNowPlaying(){const e=(this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj)?.attributes?.media_artist||"";e&&(this._showEntityOptions=!0,this._showSearchInSheet=!0,this._searchInputAutoFocused=!1,this._searchQuery=e,this._searchError="",this._searchAttempted=!1,this._searchLoading=!1,this._searchResultsByType={},this._currentSearchQuery=e,this._searchHierarchy=[],this._searchBreadcrumb="",this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this.requestUpdate(),this._doSearch().catch(t=>{console.error("yamp: artist quick-search failed:",t)}))}_showSearchSheetInOptions(e="default"){if(this._showSearchInSheet=!0,this._searchInputAutoFocused=!1,this._searchError="",this._searchResults=[],this._searchQuery="",this._searchAttempted=!1,this._searchResultsByType={},this._currentSearchQuery="",this._searchHierarchy=[],this._searchBreadcrumb="",this._usingMusicAssistant=!1,this._favoritesFilterActive=this.config.default_search_favorites===!0,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this.requestUpdate(),setTimeout(()=>{let t;switch(e){case"recently-played":t=this._toggleRecentlyPlayedFilter(!0);break;case"next-up":t=this._toggleUpcomingFilter(!0);break;case"recommendations":t=this._toggleRecommendationsFilter(!0);break;default:{const a=this.config.default_search_filter==="all"?null:this.config.default_search_filter;t=this._doSearch(a)}break}t?.catch&&t.catch(a=>{console.error("yamp: search initialization failed:",a)})},100),!this._disableSearchAutofocus){const t=this._alwaysCollapsed&&this._expandOnSearch?300:200;setTimeout(()=>{const a=this.renderRoot.querySelector("#search-input-box");a?a.focus():setTimeout(()=>{const s=this.renderRoot.querySelector("#search-input-box");s&&s.focus()},200)},t)}}_openQuickSearchOverlay(e="default"){this._quickMenuInvoke=!0,this._showEntityOptions=!0,this._showSearchSheetInOptions(e),setTimeout(()=>{this._notifyResize()},0)}_handleNavigate(e,t=!1){if(typeof e!="string"||!e.trim())return;const a=e.trim(),s=new CustomEvent("hass-navigate",{detail:{path:a},bubbles:!0,composed:!0});if(this.dispatchEvent(s),s.defaultPrevented)return;let r;if(a.startsWith("#"))window.location.hash=a,r=!0;else if(/^https?:\/\//i.test(a)){if(t){window.open(a,"_blank","noopener,noreferrer");return}window.location.assign(a),r=!0}else this.hass?.navigate?(this.hass.navigate(a),r=!0):(window.history.pushState(null,"",a),r=!0);r&&window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_hideSearchSheetInOptions(){this._cardType==="search"||this._cardType==="up_next"||(this._showSearchInSheet=!1,this._searchError="",this._searchResults=[],this._searchQuery="",this._searchDisplaySortOverride=null,this._searchInputAutoFocused=!1,this._searchLoading=!1,this._searchAttempted=!1,this._searchResultsByType={},this._currentSearchQuery="",this._searchHierarchy=[],this._searchBreadcrumb="",this._addToPlaylistTarget=null,this._dismissMenuAfterPlaylistAdd=!1,this._recommendationsFilterActive=!1,this._quickMenuInvoke&&(this._showEntityOptions=!1,this._quickMenuInvoke=!1),this.requestUpdate(),setTimeout(()=>{this._notifyResize()},0))}_closeMenuIfOpen(){this._queueActionsMenuOpenId&&this._closeQueueActionsMenu()}_sortSearchResults(e,t=null){if(this._upcomingFilterActive||this._recentlyPlayedFilterActive||this._recommendationsFilterActive)return Array.isArray(e)?[...e]:[];const a=t??this._getConfiguredSearchResultsSortMode(),s=Array.isArray(e)?[...e]:[];if(a==="random"){for(let r=s.length-1;r>0;r--){const n=Math.floor(Math.random()*(r+1));[s[r],s[n]]=[s[n],s[r]]}return s}return s}_getConfiguredSearchResultsSortMode(){const e=this.config?.search_results_sort,t=typeof e=="string"?e:"default";return this._mapLegacySortOption(t)}_mapLegacySortOption(e){return e?{title_asc:"name",title_desc:"name_desc",artist_asc:"artist_name",artist_desc:"artist_name_desc"}[e]||e:"default"}_isSortableSearchMode(e){return!(!e||e==="default"||e==="random"||e==="random_play_count")}_getOppositeSearchSortMode(e){return!e||e==="default"||e==="random"||e==="random_play_count"?null:e.endsWith("_desc")?e.replace(/_desc$/,""):`${e}_desc`}_shouldShowSearchSortToggle(){return this._upcomingFilterActive||this._recentlyPlayedFilterActive||this._recommendationsFilterActive?!1:this._isSortableSearchMode(this._getConfiguredSearchResultsSortMode())}_toggleSearchResultsSortDirection(){if(!this._shouldShowSearchSortToggle()){this._searchDisplaySortOverride=null;return}const e=this._getConfiguredSearchResultsSortMode(),t=this._getOppositeSearchSortMode(e);if(!t){this._searchDisplaySortOverride=null;return}this._searchDisplaySortOverride===t?this._searchDisplaySortOverride=null:this._searchDisplaySortOverride=t,this._searchResultsByType={},this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter,{orderBy:this._getActiveSearchDisplaySortMode()}),this.requestUpdate()}_getActiveSearchDisplaySortMode(){if(this._upcomingFilterActive||this._recentlyPlayedFilterActive||this._recommendationsFilterActive)return"default";if(!this._shouldShowSearchSortToggle())return this._getConfiguredSearchResultsSortMode();const e=this._searchDisplaySortOverride;return e&&this._isSortableSearchMode(e)?e:this._getConfiguredSearchResultsSortMode()}_getSearchSortToggleIcon(){const e=this._getActiveSearchDisplaySortMode();return this._isSortableSearchMode(e)?e.endsWith("_desc")?"mdi:sort-descending":"mdi:sort-ascending":"mdi:sort-variant"}_getSearchSortToggleTitle(){const e=this._getActiveSearchDisplaySortMode();if(!this._isSortableSearchMode(e))return"Toggle search result order";const t=e.endsWith("_desc");return`Sort by ${(t?e.replace(/_desc$/,""):e).replace(/_/g," ")} ${t?"descending":"ascending"}`}_getDisplaySearchResults(){return Array.isArray(this._searchResults)?this._searchResults:[]}_getSearchResultsLimit(){const e=Number(this.config?.search_results_limit);return Number.isFinite(e)?e===0?0:Math.min(Math.max(e,1),1e3):20}_getSearchResultsCount(){return Array.isArray(this._searchResults)?this._searchResults.length:0}_shouldShowSearchResultsCount(){return this._isNarrowViewport||!this._usingMusicAssistant||this._searchLoading?!1:this._getSearchResultsCount()>0?!0:this._searchAttempted||this._initialFavoritesLoaded||this._favoritesFilterActive||this._recentlyPlayedFilterActive||this._upcomingFilterActive||this._recommendationsFilterActive}_getSearchResultsCountLabel(){const e=this._getSearchResultsCount();return`${e} ${u(e===1?"search.result":"search.results")}`}async _doSearch(e=null,t={}){this._searchAttempted=!0,this._closeMenuIfOpen(),this._searchMediaClassFilter=e&&e!=="favorites"?e:"all";const a=!!(t.favorites||(this._favoritesFilterActive||this._initialFavoritesLoaded||this._lastSearchUsedServerFavorites)&&!t.clearFilters);a&&(this._favoritesFilterActive=!0);const s=!!(t.isRecentlyPlayed||this._recentlyPlayedFilterActive&&!t.clearFilters),r=!!(t.isUpcoming||this._upcomingFilterActive&&!t.clearFilters),n=!!(t.isRecommendations||this._recommendationsFilterActive&&!t.clearFilters);this._currentSearchQuery!==this._searchQuery&&(this._searchResultsByType={},this._currentSearchQuery=this._searchQuery);const o=this._getActiveSearchDisplaySortMode(),l=`${e||"all"}${a?"_favorites":""}${s?"_recently_played":""}${r?"_upcoming":""}${n?"_recommendations":""}_sort_${o}`,c=!!t.force;if(this._searchResultsByType[l]&&!c){this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken=0,this._searchResults=this._sortSearchResults(this._searchResultsByType[l]),this._searchLoading=!1,this._searchError="",this.requestUpdate();return}t.silent||(this._searchLoading=!0,this._searchError="",this._searchResults=[],this.requestUpdate());const d=t.token||Date.now();this._latestSearchToken=d;const h=p=>this._handleProgressiveSearchResults(p,l,d);this._searchTimeoutHandle&&clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=window.setTimeout(()=>{this._latestSearchToken===d&&this._searchLoading&&(this._searchLoading=!1,this._searchError="Search timed out. Try again.",this.requestUpdate())},this.config?.search_timeout_ms?Number(this.config.search_timeout_ms):15e3);try{const p=this._getSearchEntityId(this._selectedIndex),_=await this._resolveTemplateAtActionTime(p,this.currentEntityId);let m;if(this._addToPlaylistTarget&&e==="playlist"&&this._massQueueAvailable){this._initialFavoritesLoaded=!1;try{const E=await Wi(this.hass,_);if(E){const w={limit:ap};this._searchQuery&&this._searchQuery.trim().length>0&&(w.search=this._searchQuery.trim());const P=this._getActiveSearchDisplaySortMode();P&&P!=="default"&&(w.order_by=P);const $={type:"call_service",domain:"mass_queue",service:"send_command",service_data:{...E&&E!=="auto"&&{config_entry_id:E},command:"music/playlists/library_items",data:w},return_response:!0},C=await this.hass.connection.sendMessagePromise($);let N=[];if(Array.isArray(C?.response)?N=C.response:Array.isArray(C?.response?.response)?N=C.response.response:Array.isArray(C?.response?.items)?N=C.response.items:Array.isArray(C?.response?.results)&&(N=C.response.results),Array.isArray(N)){const j=this._getSearchResultsLimit()||30;m={results:N.filter(F=>F.is_editable===!0).map(F=>Tt(F)).filter(Boolean).slice(0,j),usedMusicAssistant:!0}}}}catch(E){console.warn("yamp: error fetching direct native playlists for add-to-target logic",E)}m||(m={results:[],usedMusicAssistant:!0}),this._lastSearchUsedServerFavorites=!1}else if(s)this._initialFavoritesLoaded=!1,m=await Uc(this.hass,_,e,this._getSearchResultsLimit(),{onChunk:h}),this._lastSearchUsedServerFavorites=!1;else if(r)this._initialFavoritesLoaded=!1,m=await this._getUpcomingQueue(this.hass,_,this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1;else if(n)this._initialFavoritesLoaded=!1,m=await this._getRecommendations(this.hass,_,e,this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1;else if(a){this._initialFavoritesLoaded=!1;const E=this._getActiveSearchDisplaySortMode();m=await pn(this.hass,_,this._searchQuery,e,{...t,favorites:!0,orderBy:E!=="default"?E:void 0},this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!0}else if((!this._searchQuery||this._searchQuery.trim()==="")&&!a&&!s&&(e==="all"||!e)){const E=this._getActiveSearchDisplaySortMode();m=await _n(this.hass,_,e==="favorites"?null:e,this._getSearchResultsLimit(),{onChunk:h,orderBy:E!=="default"?E:void 0}),(!this._searchQuery||this._searchQuery.trim()==="")&&(this._initialFavoritesLoaded=!0),this._lastSearchUsedServerFavorites=!0}else{this._initialFavoritesLoaded=!1;const E=this._getActiveSearchDisplaySortMode();m=await pn(this.hass,_,this._searchQuery,e,{...t,orderBy:E!=="default"?E:void 0},this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1}let f=m.results||[];this._usingMusicAssistant=m.usedMusicAssistant||!1;const y=this._currentSearchQuery!==this._searchQuery;y&&(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1);let b=Array.isArray(f)?f:[];if(this._latestSearchToken!==d)return;if((s||r||n)&&this._searchQuery&&this._searchQuery.trim()!==""){const E=this._searchQuery.trim().toLowerCase();b=b.filter(w=>{const P=(w.title||"").toLowerCase(),$=(w.artist||"").toLowerCase(),C=(w.album||"").toLowerCase();return P.includes(E)||$.includes(E)||C.includes(E)})}if(!y&&this._favoritesFilterActive&&!this._lastSearchUsedServerFavorites&&(b=await this._applyLocalFavoritesFilter(b),this._latestSearchToken!==d))return;this._searchResultsByType[l]=b,this._searchResults=this._sortSearchResults(b);const k=Array.isArray(this._searchResults)?this._searchResults.length:0;this._searchTotalRows=Math.max(15,k)}catch(p){this._searchError=p&&p.message||"Unknown error",this._searchResults=[],this._searchTotalRows=0}this._latestSearchToken===d&&this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken===d&&(this._latestSearchToken=0),this._searchLoading=!1,this.requestUpdate()}async _playCurrentCollection(){if(this._searchHierarchy.length===0)return;const e=this._searchHierarchy[this._searchHierarchy.length-1];if(!e||!e.uri){this._searchError=u("search.play_collection_error"),this.requestUpdate();return}const t={media_content_id:e.uri,media_content_type:e.type};await this._playMediaFromSearch(t)}_handleSearchSubmit(){const e=this._keepFiltersOnSearch;e||(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1);const t=!e;this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter,{clearFilters:t})}_handleProgressiveSearchResults(e,t,a){if(!Array.isArray(e)||!e.length||this._latestSearchToken!==a)return;const s=(this._searchResultsByType[t]||[]).concat(e);this._searchResultsByType[t]=s,this._searchResults=this._sortSearchResults(s);const r=Array.isArray(s)?s.length:0;this._searchTotalRows=Math.max(15,r),this.requestUpdate()}_getVisibleSearchFilterClasses(){const e=this.entityObjs?.[this._selectedIndex]||null,t=new Set(e?.hidden_filter_chips||[]);return li.filter(a=>!t.has(a))}async _playMediaFromSearch(e,t){if(this._isDragging){t&&(t.stopPropagation(),t.preventDefault());return}const a=this._getSearchEntityId(this._selectedIndex),s=await this._resolveTemplateAtActionTime(a,this.currentEntityId);if(this._searchError="",!await this._performSearchPlayback(e,s)){this._searchError="Unable to start playback. Please try again.",this.requestUpdate();return}const{shouldDismiss:r,shouldReset:n}=this._getSearchDismissBehavior();r?(this._showSearchInSheet&&(this._closeEntityOptions(),this._showSearchInSheet=!1),this._hideSearchSheetInOptions()):n?this._showSearchSheetInOptions():this.requestUpdate()}async _performSearchPlayback(e,t){if(e.queue_item_id&&this._upcomingFilterActive&&this._isMusicAssistantEntity()&&this._massQueueAvailable)try{const n=this._getMusicAssistantState()?.entity_id;if(n)return await this.hass.callService("mass_queue","play_queue_item",{entity:n,queue_item_id:e.queue_item_id}),this._advanceQueueInUI(e.queue_item_id,!0),!0}catch(n){return console.error("yamp: Error playing queue item:",n),await this.hass.callService("media_player","media_next_track",{entity_id:t}),!0}if(!t)return!1;const a=this._collectPlaybackMonitorIds(t),s=this._snapshotPlaybackState(a);if(!await this._invokePlayMedia(t,e))return!1;if(await this._waitForPlaybackChange(s,a))return!0;const r=this._snapshotPlaybackState(a);return await this._invokePlayMedia(t,e)?await this._waitForPlaybackChange(r,a):!1}_collectPlaybackMonitorIds(e){const t=new Set;e&&t.add(e);const a=this._getPlaybackEntityId(this._selectedIndex);a&&t.add(a);const s=this.currentEntityId;s&&t.add(s);const r=this._getActualResolvedMaEntityForState(this._selectedIndex);return r&&t.add(r),Array.from(t).filter(Boolean)}_snapshotPlaybackState(e){const t={};return Array.isArray(e)&&e.forEach(a=>{const s=a?this.hass?.states?.[a]:null;t[a]={state:s?.state??null,mediaId:s?.attributes?.media_content_id??null,mediaTitle:s?.attributes?.media_title??null}}),t}async _waitForPlaybackChange(e,t,a=2500){if(!Array.isArray(t)||t.length===0)return!0;const s=Date.now();for(;Date.now()-s<a;){await this._delay(150);for(const r of t){if(!r)continue;const n=this.hass?.states?.[r];if(!n)continue;if(this._isEntityPlaying(n))return!0;const o=e[r]||{},l=n.attributes?.media_content_id??null,c=n.attributes?.media_title??null;if(l&&l!==o.mediaId||c&&c!==o.mediaTitle||!o.mediaId&&l||!o.mediaTitle&&c)return!0}}return!1}async _performSearchOptionAction(e,t){if(t==="add_to_playlist"){this._addToPlaylistTarget=e,this._searchHierarchy.push({type:"select_playlist",name:u("search.add_to_playlist"),query:this._searchQuery,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=u("search.select_playlist").replace("{track}",e.title),this._searchQuery="",this._currentSearchQuery="",this._searchMediaClassFilter="playlist",this._resetSearchContext(),this._removeSearchSwipeHandlers(),await this._doSearch("playlist",{clearFilters:!0});return}const a=this._getSearchEntityId(this._selectedIndex),s=await this._resolveTemplateAtActionTime(a,this.currentEntityId);try{const r={entity_id:s,media_id:e.media_content_id,media_type:e.media_content_type,enqueue:t};if(this._radioModeActive&&(r.radio_mode=!0),await this.hass.callService("music_assistant","play_media",r),this._invalidateUpcomingCache(),t==="replace"){const{shouldDismiss:n,shouldReset:o}=this._getSearchDismissBehavior();n?this._closeEntityOptions():o&&this._showSearchSheetInOptions(),this._activeSearchRowMenuId=null}else{this._successSearchRowMenuId=e.media_content_id,this.requestUpdate();const n=this._dismissMenuAfterPlaylistAdd&&t==="add_to_playlist";setTimeout(()=>{this._successSearchRowMenuId=null,this._activeSearchRowMenuId=null,n&&(this._closeEntityOptions(),this._dismissMenuAfterPlaylistAdd=!1),this.requestUpdate()},2e3)}}catch(r){console.error("Failed to perform search option action:",r),this._searchError="Action failed: "+r.message,this.requestUpdate()}}async _invokePlayMedia(e,t){try{return this._radioModeActive?await this.hass.callService("music_assistant","play_media",{entity_id:e,media_id:t.media_content_id,media_type:t.media_content_type,radio_mode:!0}):await Hc(this.hass,e,t),!0}catch(a){return console.error("yamp: Error starting playback from search:",a),!1}}_delay(e){return new Promise(t=>{(typeof window<"u"?window:globalThis).setTimeout(t,e)})}async _queueMediaFromSearch(e){const t=this._getSearchEntityId(this._selectedIndex),a=await this._resolveTemplateAtActionTime(t,this.currentEntityId);this._radioModeActive?this.hass.callService("music_assistant","play_media",{entity_id:a,media_id:e.media_content_id,media_type:e.media_content_type,enqueue:"add",radio_mode:!0}):this.hass.callService("media_player","play_media",{entity_id:a,media_content_type:e.media_content_type,media_content_id:e.media_content_id,enqueue:"next"}),this._invalidateUpcomingCache(),this._showSearchSuccessToast()}async _searchArtistAlbums(e,t=null){this._searchHierarchy.push({type:"artist",name:e,query:this._searchQuery,uri:t,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=`Albums by ${e}`,this._searchQuery=e,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="album",this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._initialFavoritesLoaded=!1,this._removeSearchSwipeHandlers(),await this._doSearch("album",{clearFilters:!0})}_goBackInSearch(){if(this._dismissMenuAfterPlaylistAdd){this._closeEntityOptions(),this._dismissMenuAfterPlaylistAdd=!1;return}if(this._searchHierarchy.length===0)return;this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const e=this._searchHierarchy.pop();if((e.type==="select_playlist"||e.type==="select_track_for_playlist")&&(this._addToPlaylistTarget=null),this._searchQuery=e.query,this._currentSearchQuery=e.query,this._searchResultsByType={},this._searchMediaClassFilter=e.filter||"all",this._searchHierarchy.length===0)this._searchBreadcrumb="",this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter);else{const t=this._searchHierarchy[this._searchHierarchy.length-1];if(t.type==="artist")this._searchBreadcrumb=`Albums by ${t.name}`,this._searchMediaClassFilter="album",this._doSearch("album",{artist:t.name});else if(t.type==="album"){if(this._searchBreadcrumb=`Tracks from ${t.name}`,this._searchMediaClassFilter="track",t.uri&&this._isMusicAssistantEntity()){this._searchQuery=t.name,this._searchAlbumTracks(t.name,null,t.uri);return}const a=this._searchHierarchy.find(r=>r.type==="artist"),s={album:t.name};a&&(s.artist=a.name),this._doSearch("track",s)}else if(t.type==="playlist"){if(this._searchBreadcrumb=`Tracks in ${t.name}`,this._searchMediaClassFilter="track",t.uri&&this._isMusicAssistantEntity()){this._searchQuery=t.name,this._currentSearchQuery=t.name,this._searchResults=[],this._searchLoading=!0,this.requestUpdate(),this._fetchMassQueueTracks(t.uri,"get_playlist_tracks").then(a=>{this._searchResultsByType.track=a,this._searchResults=[...a],this._searchLoading=!1,this.requestUpdate(),this._scrollToTop()});return}this._doSearch("track")}}}_isClickableSearchResult(e){return e?this._addToPlaylistTarget||this._searchHierarchy[this._searchHierarchy.length-1]?.type==="select_track_for_playlist"?!0:!!e.is_browsable:!1}_handleSearchResultTouch(e,t){if(!("ontouchstart"in window))return;const a=t.touches[0],s=a.clientX,r=a.clientY;let n=!1;const o=10,l=d=>{const h=d.touches[0],p=Math.abs(h.clientX-s),_=Math.abs(h.clientY-r);(p>o||_>o)&&(n=!0)},c=d=>{document.removeEventListener("touchmove",l,{passive:!0}),document.removeEventListener("touchend",c,{passive:!0}),n||this._handleSearchResultClick(e)};document.addEventListener("touchmove",l,{passive:!0}),document.addEventListener("touchend",c,{passive:!0})}_getSearchResultClickTitle(e){if(!this._isClickableSearchResult(e))return"";if(this._addToPlaylistTarget&&e.media_class==="playlist")return u("search.add_to_playlist");if(this._searchHierarchy[this._searchHierarchy.length-1]?.type==="select_track_for_playlist"&&(e.media_class==="track"||e.media_content_type==="track")){const t=this._getMockItemFromCurrentTrack();return u("search.select_track_for_playlist",{"{track}":t?.title||"","{artist}":t?.media_artist||""})}return Ac(e)}_invalidateUpcomingCache(){if(!this._upcomingFilterActive){const e=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`;this._searchResultsByType&&delete this._searchResultsByType[e],this.requestUpdate()}}_toggleRadioMode(){this._radioModeActive=!this._radioModeActive,this.requestUpdate()}async _toggleFavoritesFilter(){const e=this._favoritesFilterActive||this._initialFavoritesLoaded;if(this._favoritesFilterActive=!e,this._favoritesFilterActive&&(this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1),this._favoritesFilterActive){const t=this._searchMediaClassFilter;try{await this._doSearch(t,{favorites:!0})}catch(a){console.error("yamp: Error searching favorites:",a)}}else{const t=this._searchMediaClassFilter;this._lastSearchUsedServerFavorites=!1,this._initialFavoritesLoaded=!1,await this._doSearch(t,{clearFilters:!0})}}async _toggleRecentlyPlayedFilter(e=null){const t=typeof e=="boolean"?e:!this._recentlyPlayedFilterActive;if(this._recentlyPlayedFilterActive=t,this._recentlyPlayedFilterActive&&(this._favoritesFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1),this._recentlyPlayedFilterActive){this._searchQuery="";try{await this._doSearch("all",{isRecentlyPlayed:!0,clearFilters:!0})}catch(a){console.error("yamp: Error in _doSearch for recently played:",a)}}else if(this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _toggleUpcomingFilter(e=null){const t=typeof e=="boolean"?e:!this._upcomingFilterActive;if(this._upcomingFilterActive=t,this._upcomingFilterActive&&(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1),this._upcomingFilterActive){this._searchQuery="";const a=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`;delete this._searchResultsByType[a],await this._subscribeToQueueUpdates();try{await this._doSearch("all",{isUpcoming:!0,clearFilters:!0})}catch(s){console.error("yamp: Error in _doSearch for upcoming queue:",s)}}else if(this._unsubscribeFromQueueUpdates(),this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _toggleRecommendationsFilter(e=null){const t=typeof e=="boolean"?e:!this._recommendationsFilterActive;if(this._recommendationsFilterActive=t,this._recommendationsFilterActive){this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._initialFavoritesLoaded=!1,this._searchQuery="";try{const a=await this._isMassQueueIntegrationAvailable(this.hass);if(this._hasMassQueueIntegration=a,this._massQueueAvailable=a,!a){this._recommendationsFilterActive=!1,this._searchError="Recommendations require the Music Assistant queue integration.",this.requestUpdate();return}await this._doSearch("all",{isRecommendations:!0,clearFilters:!0})}catch(a){console.error("yamp: Error in _doSearch for recommendations:",a),this._searchError="Unable to load recommendations.",this._recommendationsFilterActive=!1,this.requestUpdate()}}else if(this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _getUpcomingQueue(e,t,a=20){try{const s=await this._isMassQueueIntegrationAvailable(e);if(this._massQueueAvailable=s,this._hasMassQueueIntegration=s,s)try{const r=await this._getUpcomingQueueWithMassQueue(e,t,a);return!r.results||r.results.length===0?(this._massQueueAvailable=!1,await this._getUpcomingQueueOriginal(e,t,a)):r}catch{return this._massQueueAvailable=!1,await this._getUpcomingQueueOriginal(e,t,a)}return await this._getUpcomingQueueOriginal(e,t,a)}catch(s){return console.error("yamp: Error getting upcoming queue:",s),this._massQueueAvailable=!1,{results:[],usedMusicAssistant:!1}}}async _getRecommendations(e,t,a=null,s=20){try{const r=await this._isMassQueueIntegrationAvailable(e);if(this._hasMassQueueIntegration=r,this._massQueueAvailable=r,!r)throw new Error("mass_queue integration unavailable");const n=Math.max(s||0,this._getSearchResultsLimit()),o={type:"call_service",domain:"mass_queue",service:"get_recommendations",service_data:{entity:t},return_response:!0},l=(await e.connection.sendMessagePromise(o))?.response;let c=[];Array.isArray(l)?c=l:l&&typeof l=="object"&&(Array.isArray(l[t])?c=l[t]:Object.values(l).forEach(y=>{Array.isArray(y)?c.push(...y):y&&typeof y=="object"&&c.push(y)}),c.length===0&&Array.isArray(l.items)&&(c=l.items));const d=y=>{if(!y||typeof y!="string")return"track";const b=y.toLowerCase();switch(b){case"song":case"music":return"track";case"podcast_episode":case"episode":return"podcast";case"station":return"radio";case"directory":case"folder":return"playlist";default:return b}},h=y=>y?y.toString().replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/\b\w/g,b=>b.toUpperCase()):"",p=a&&a!=="all"?d(a):null,_=[];let m=0;const f=n>0?n:1/0;for(const y of c){if(m>=f)break;const b=y?.name||y?.sort_name||"",k=typeof y?.image=="string"&&y.image.trim()!==""?y.image:null,E=Array.isArray(y?.items)&&y.items.length>0?y.items:[y];for(const w of E){if(m>=f)break;const P=w?.uri||w?.item_id;if(!P)continue;const $=typeof w?.image=="string"&&w.image.trim()!==""?w.image:null,C=w?.media_type||y?.media_type||"music",N=d(C);if(p&&N!==p)continue;const j=h(C)||h(N),F=h(w?.provider||y?.provider),I=j?[j]:[];b?I.push(b):F&&I.push(F),_.push({media_content_id:P,media_content_type:C||N,media_class:N,title:w?.name||w?.sort_name||b||"Recommendation",artist:I.join(" \u2022 "),thumbnail:$||k||null,provider:w?.provider||y?.provider||null}),m+=1}}return{results:_,usedMusicAssistant:!0,source:"mass_queue"}}catch(r){throw console.error("yamp: Error getting recommendations from mass_queue:",r),r}}async _isMassQueueIntegrationAvailable(e){if(this.config.disable_mass_queue===!0)return!1;try{const t=await e.callWS({type:"get_services"});let a=!1;return Array.isArray(t)?a=t.some(s=>s.domain==="mass_queue"):t&&typeof t=="object"&&(a=Object.prototype.hasOwnProperty.call(t,"mass_queue")||Object.keys(t).some(s=>s==="mass_queue")),!!a}catch{return!1}}async _getUpcomingQueueWithMassQueue(e,t,a=20){try{const s=e.states[t]?.attributes?.media_content_id,r={type:"call_service",domain:"mass_queue",service:"get_queue_items",service_data:{entity:t,limit_before:0},return_response:!0},n=this._getSearchResultsLimit(),o=Number.isFinite(a)?a:n,l=Math.max(o||0,n||0);l>0&&(r.service_data.limit_after=l);const c=(await e.connection.sendMessagePromise(r))?.response?.[t];if(!Array.isArray(c))throw new Error("Invalid response from mass_queue");let d=c.findIndex(_=>_.active===!0||_.state==="playing");d===-1&&s&&(d=c.findIndex(_=>_.media_content_id===s)),d===-1&&c.length>0&&(d=0);const h=d>=0?c.slice(d+1):c,p=(o>0?h.slice(0,o):h).map((_,m)=>({media_content_id:_.media_content_id||`queue_${m}`,media_content_type:"track",media_class:"track",title:_.media_title||"Unknown Track",artist:_.media_artist||"Unknown Artist",album:_.media_album_name||"Unknown Album",thumbnail:_.media_image||null,duration:null,position:m+1,queue_item_id:_.queue_item_id||null}));return{results:p,usedMusicAssistant:!0,total:p.length,source:"mass_queue"}}catch(s){throw console.error("yamp: mass_queue service call failed:",s),s}}_enqueueQueueOperation(e){this._queueOpsTotal===this._queueOpsCompleted&&(this._queueOpsTotal=0,this._queueOpsCompleted=0),this._queueOpsTotal++,this._queueOpsTimeout&&(clearTimeout(this._queueOpsTimeout),this._queueOpsTimeout=null),this._queueOperationPromise=this._queueOperationPromise.then(async()=>{try{await e(),this._invalidateUpcomingCache()}catch(t){console.error("yamp: Queue operation failed:",t),this._refreshQueue()}finally{this._queueOpsCompleted++,this._queueOpsCompleted===this._queueOpsTotal&&(this._queueOpsTimeout&&clearTimeout(this._queueOpsTimeout),this._queueOpsTimeout=setTimeout(()=>{this._queueOpsCompleted===this._queueOpsTotal&&(this._queueOpsTotal=0,this._queueOpsCompleted=0,this._queueOpsTimeout=null)},1500))}})}async _moveQueueItemUp(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"up"),this._enqueueQueueOperation(async()=>{await this.hass.callService("mass_queue","move_queue_item_up",{entity:t,queue_item_id:e})})}catch{this._refreshQueue()}}async _moveQueueItemDown(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"down"),this._enqueueQueueOperation(async()=>{await this.hass.callService("mass_queue","move_queue_item_down",{entity:t,queue_item_id:e})})}catch{this._refreshQueue()}}async _moveQueueItemNext(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"next"),this._enqueueQueueOperation(async()=>{await this.hass.callService("mass_queue","move_queue_item_next",{entity:t,queue_item_id:e})})}catch{this._refreshQueue()}}async _removeQueueItem(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._removeQueueItemFromUI(e),this._enqueueQueueOperation(async()=>{await this.hass.callService("mass_queue","remove_queue_item",{entity:t,queue_item_id:e})})}catch{this._refreshQueue()}}_showQueueError(e){console.error("yamp: Queue operation failed:",e)}_moveQueueItemInUI(e,t){const a=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`,s=this._searchResultsByType[a];if(!Array.isArray(s))return;const r=s.findIndex(o=>o.queue_item_id===e);if(r===-1)return;let n;switch(t){case"up":n=Math.max(0,r-1);break;case"down":n=Math.min(s.length-1,r+1);break;case"next":n=0;break;default:return}this._moveQueueItemInUIByIndex(r,n)}async _onQueueItemMoved(e){const{oldIndex:t,newIndex:a}=e.detail;if(t===a)return;const s=this._getDisplaySearchResults();if(!s||t<0||t>=s.length||a<0||a>=s.length)return;const r=s[t],n=r?.queue_item_id;if(!n){console.error("yamp: No queue_item_id found on dragged item",r);return}try{const o=this._getMusicAssistantState()?.entity_id;if(!o)throw new Error("No Music Assistant entity found");this._moveQueueItemInUIByIndex(t,a),this._enqueueQueueOperation(async()=>{const l=Math.abs(a-t);if(1+a<l){await this.hass.callService("mass_queue","move_queue_item_next",{entity:o,queue_item_id:n});for(let c=0;c<a;c++)await this.hass.callService("mass_queue","move_queue_item_down",{entity:o,queue_item_id:n})}else{const c=a<t?"move_queue_item_up":"move_queue_item_down";for(let d=0;d<l;d++)await this.hass.callService("mass_queue",c,{entity:o,queue_item_id:n})}})}catch(o){console.error("yamp: Failed to move queue item via drag and drop:",o),this._refreshQueue()}}_moveQueueItemInUIByIndex(e,t){const a=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`,s=this._searchResultsByType[a];if(!Array.isArray(s)||e<0||e>=s.length||t<0||t>=s.length)return;const r=s.splice(e,1)[0];s.splice(t,0,r),this._searchResults=[...s],s.forEach((n,o)=>{n.position=o+1}),r._justMoved=!0,setTimeout(()=>{delete r._justMoved,this.requestUpdate()},1e3),this._latestSearchToken=Date.now(),this.requestUpdate()}_advanceQueueInUI(e=null,t=!1){if(!this._upcomingFilterActive)return;t&&(this._latestManualShiftTime=Date.now());const a=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`;let s=this._searchResultsByType[a];if(!(!Array.isArray(s)||s.length===0)){if(e){const r=s.findIndex(n=>n.queue_item_id===e);r>=0&&(s=s.slice(r+1))}else s=s.slice(1);this._searchResultsByType[a]=s,this._searchResults=s,this._latestSearchToken=Date.now(),this.requestUpdate()}}_removeQueueItemFromUI(e){const t=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`,a=this._searchResultsByType[t];if(!Array.isArray(a))return;const s=a.filter(r=>r.queue_item_id!==e);this._searchResultsByType[t]=s,this._searchResults=s,this.requestUpdate()}_isMusicAssistantEntity(){const e=this._getMusicAssistantState();return e?$t(e)||e.attributes?.mass_player_id||e.attributes?.active_queue||this._upcomingFilterActive&&this._searchResultsByType[`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`]?.some(t=>t.queue_item_id):!1}_looksLikeMusicAssistantState(e){return e?$t(e)||!!e.attributes?.mass_player_id||!!e.attributes?.active_queue:!1}_getTransferQueueTargets(){if(!this.hass?.services?.music_assistant?.transfer_queue)return[];const e=this._selectedIndex;if(e==null||e<0)return[];const t=this._getActualResolvedMaEntityForState(e);if(!t)return[];const a=new Set([t]),s=[];for(let r=0;r<this.entityObjs.length;r++){const n=this.entityObjs[r];if(!n)continue;const o=this._getActualResolvedMaEntityForState(r);if(!o||a.has(o))continue;const l=this.hass?.states?.[o],c=this.hass?.states?.[n.entity_id];if(!this._looksLikeMusicAssistantState(l)&&!this._looksLikeMusicAssistantState(c))continue;a.add(o);const d=l||c,h=n?.name||c?.attributes?.friendly_name||l?.attributes?.friendly_name||n.entity_id;s.push({index:r,entityId:n.entity_id,maEntityId:o,name:h,subtitle:o!==n.entity_id?o:n.entity_id,state:d?.state,icon:d?.attributes?.icon||"mdi:music"})}return s}_hasQueueInState(e){if(!e)return!1;const t=e.attributes||{},a=["queue_items","queue","media_queue","mass_queue_items"];for(const o of a){const l=t[o];if(Array.isArray(l)&&l.length>0)return!0}const s=["queue_length","queue_size","queue_total_items","queue_pending","queue_remaining","items_in_queue"];for(const o of s){const l=t[o];if(typeof l=="number"&&l>0)return!0}if(t.next_item||t.current_queue_item||t.queue_item_id||t.media_content_id)return!0;const r=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`,n=this._searchResultsByType?.[r];return!!(Array.isArray(n)&&n.length>0)}async _updateTransferQueueAvailability({refresh:e=!1}={}){const t=this._getMusicAssistantState(),a=this._looksLikeMusicAssistantState(t);if(!t||!a)return this._hasTransferQueueForCurrent&&(this._hasTransferQueueForCurrent=!1,this.requestUpdate()),!1;let s=this._hasQueueInState(t);if(!s&&e&&this.hass){const r=this._getActualResolvedMaEntityForState(this._selectedIndex);if(r)try{const n=await this._getUpcomingQueue(this.hass,r,2);(Array.isArray(n?.results)&&n.results.length>0||this._isEntityPlaying(t)||t.state==="paused"||t.attributes?.media_content_id)&&(s=!0)}catch{}}return this._hasTransferQueueForCurrent!==s&&(this._hasTransferQueueForCurrent=s,this.requestUpdate()),s}_canShowTransferQueueOption(){return this._hasTransferQueueForCurrent?this._getTransferQueueTargets().length>0:!1}_openTransferQueue(){this._showEntityOptions=!0,this._showTransferQueue=!0,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),this.requestUpdate()}_closeTransferQueue(){this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),this.requestUpdate()}async _transferQueueTo(e){if(!e)return;const t=this._getActualResolvedMaEntityForState(this._selectedIndex);if(t){this._transferQueuePendingTarget=e.maEntityId,this._transferQueueStatus=null,this.requestUpdate();try{const a=this._buildTransferQueuePayload(t,e.maEntityId);await this.hass.callService("music_assistant","transfer_queue",a),this._transferQueueStatus={type:"success",message:`Queue sent to ${e.name}.`};const s=typeof e.index=="number"?e.index:this.entityIds.indexOf(e.entityId);if(s!=null&&s>=0){const r=this._pinnedIndex;if(r===null||r===s){this._selectedIndex=s,this._manualSelect=!0,this._manualSelectPlayingSet=null,r===s&&(this._pinnedIndex=s);const n=e.maEntityId||this.entityObjs[s]?.entity_id;n&&(this._playbackLingerByIdx||(this._playbackLingerByIdx={}),this._playbackLingerByIdx[s]={entityId:n,until:Date.now()+5e3},this._lastPlayingEntityIdByChip||(this._lastPlayingEntityIdByChip={}),this._lastPlayingEntityIdByChip[s]=n),this._ensureResolvedMaForIndex(s),this._ensureResolvedVolForIndex(s),this._ensureResolvedHiddenControlsForIndex(s)}}await this._updateTransferQueueAvailability({refresh:!0}),this._transferQueueAutoCloseTimer&&clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=setTimeout(()=>{this._transferQueueAutoCloseTimer=null,this._showEntityOptions&&this._showTransferQueue&&this._dismissWithAnimation()},2e3)}catch(a){console.error("yamp: Error transferring queue:",a),this._transferQueueStatus={type:"error",message:a?.message||"Failed to transfer queue."},this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null)}finally{this._transferQueuePendingTarget=null,this.requestUpdate()}}}_buildTransferQueuePayload(e,t){const a=this.hass?.services?.music_assistant?.transfer_queue?.fields||{},s={},r=(l,c)=>{for(const d of l)if(a[d]!==void 0)return s[d]=c,!0;return!1},n=r(["source_player","source_player_id","player_id","source"],e),o=r(["target_player","target_player_id","target","entity_id"],t);if(!n){const l=o?"source_player":"entity_id";s[l]=e}return o||(s.entity_id===e?(s.entity_id=t,s.source_player=e):(s.source_player,s.entity_id=t)),s}_refreshQueue({delayMs:e=50}={}){this._upcomingFilterActive&&(this._queueRefreshTimer&&clearTimeout(this._queueRefreshTimer),this._queueRefreshTimer=setTimeout(()=>{this._queueRefreshTimer=null;const t=Date.now();this._latestSearchToken=t,this._doSearch("all",{isUpcoming:!0,clearFilters:!0,silent:!0,force:!0,token:t}).catch(a=>{console.error("yamp: Error refreshing queue:",a)})},e))}async _subscribeToQueueUpdates(){if(!this._queueEventSubscription)try{this._queueEventSubscription=await this.hass.connection.subscribeEvents(e=>{e.data.type},"mass_queue")}catch(e){console.error("yamp: Failed to subscribe to queue updates:",e)}}_unsubscribeFromQueueUpdates(){this._queueEventSubscription&&(this._queueEventSubscription(),this._queueEventSubscription=null)}async _getUpcomingQueueOriginal(e,t,a=20){try{const s={type:"call_service",domain:"music_assistant",service:"get_queue",service_data:{entity_id:t},return_response:!0},r=(await e.connection.sendMessagePromise(s))?.response?.[t];if(!r)return{results:[],usedMusicAssistant:!0};const n=[];if(!r)return{results:[],usedMusicAssistant:!0};if(r.next_item){const o=r.next_item;n.push({media_content_id:o.media_item?.uri||"queue_next",media_content_type:o.media_item?.media_type||"track",media_class:"track",title:o.name||o.media_item?.name||"Unknown Track",artist:o.media_item?.artists?.[0]?.name||"Unknown Artist",album:o.media_item?.album?.name||"Unknown Album",thumbnail:o.media_item?.image||null,duration:o.duration||null,position:1,queue_item_id:o.queue_item_id||null})}return{results:n,usedMusicAssistant:!0,total:n.length,source:"music_assistant"}}catch(s){throw console.error("yamp: Error in original queue method:",s),s}}async _applyLocalFavoritesFilter(e=[]){if(!this._favoritesFilterActive)return e;const t=this._getSearchEntityId(this._selectedIndex),a=await this._resolveTemplateAtActionTime(t,this.currentEntityId);try{const s=(await _n(this.hass,a,this._searchMediaClassFilter,this._getSearchResultsLimit())).results||[],r=new Set(s.map(n=>n.media_content_id));return e.filter(n=>r.has(n.media_content_id))}catch{return e}}async _handleSearchResultClick(e,t){if(this._isDragging){t&&(t.stopPropagation(),t.preventDefault());return}if(!(!this._isClickableSearchResult(e)||"ontouchstart"in window&&t&&t.sourceCapabilities&&t.sourceCapabilities.firesTouchEvents)){if(this._searchHierarchy[this._searchHierarchy.length-1]?.type==="select_track_for_playlist"&&(e.media_class==="track"||e.media_content_type==="track")){this._performSearchOptionAction(e,"add_to_playlist");return}if(this._addToPlaylistTarget&&e.media_class==="playlist"){this._loadingSearchRowMenuId=e.media_content_id,this.requestUpdate();try{const a=this._getSearchEntityId(this._selectedIndex),s=await this._resolveTemplateAtActionTime(a,this.currentEntityId),r=await Wi(this.hass,s);if(r){const n={command:"music/playlists/add_playlist_tracks",data:{db_playlist_id:e.item_id||e.media_content_id?.split("/").pop(),uris:[this._addToPlaylistTarget.media_content_id]}};r&&r!=="auto"&&(n.config_entry_id=r),await this.hass.callService("mass_queue","send_command",n),this._showSearchSuccessToast(e.media_content_id,"playlist")}}catch(a){console.error("Failed to add to playlist:",a),this._errorSearchRowMenuId=e.media_content_id,this.requestUpdate(),setTimeout(()=>{this._errorSearchRowMenuId=null,this.requestUpdate()},3e3)}finally{this._loadingSearchRowMenuId=null,this.requestUpdate()}this._addToPlaylistTarget=null,setTimeout(()=>{this._dismissMenuAfterPlaylistAdd?(this._closeEntityOptions(),this._dismissMenuAfterPlaylistAdd=!1):this._goBackInSearch()},$o);return}if(e.media_class==="artist")await this._searchArtistAlbums(e.title,e.media_content_id);else if(e.media_class==="album"){let a=null;this._searchHierarchy.length>0&&this._searchHierarchy[this._searchHierarchy.length-1].type==="artist"?a=this._searchHierarchy[this._searchHierarchy.length-1].name:e.artist&&(a=e.artist),await this._searchAlbumTracks(e.title,a,e.media_content_id)}else e.media_class==="track"?e.album&&await this._searchAlbumTracks(e.album,e.artist,e.album_uri):e.media_class==="playlist"&&await this._searchPlaylistTracks(e.title,e.media_content_id)}}async _searchAlbumTracks(e,t,a=null){this._searchHierarchy.push({type:"album",name:e,query:this._searchQuery,uri:a,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=`Tracks from ${e}`,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="track",this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const s=await this._fetchMassQueueTracks(a,"get_album_tracks");if(s&&s.length>0){this._setSearchResultsFromMassQueue(s,e);return}if(a&&this._isMusicAssistantEntity())try{const o=this._getSearchEntityId(this._selectedIndex),l=await this._resolveTemplateAtActionTime(o,this.currentEntityId),c={type:"call_service",domain:"media_player",service:"browse_media",service_data:{entity_id:l,media_content_id:a},return_response:!0},d=await this.hass.connection.sendMessagePromise(c),h=(d?.response?.[l]?.result||d?.result||{}).children||[];if(h.length>0){this._searchQuery=e,this._searchResults=this._sortSearchResults(h),this._searchTotalRows=Math.max(15,h.length),this._searchLoading=!1,this.requestUpdate();return}}catch(o){console.error("yamp: Failed to browse album tracks:",o)}let r=e;t&&(r=`${t} ${e}`),this._searchQuery=r,this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._initialFavoritesLoaded=!1;const n={album:e,clearFilters:!0};t&&(n.artist=t),this._removeSearchSwipeHandlers(),await this._doSearch("track",n)}async _searchPlaylistTracks(e,t){this._searchHierarchy.push({type:"playlist",name:e,query:this._searchQuery,uri:t,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=`Tracks from ${e}`,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="track",this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const a=await this._fetchMassQueueTracks(t,"get_playlist_tracks");if(a&&a.length>0){this._setSearchResultsFromMassQueue(a,e);return}this._searchQuery=e,this._searchResults=[],this._searchLoading=!1,this.requestUpdate()}async _fetchMassQueueTracks(e,t){try{if(!await this._isMassQueueIntegrationAvailable(this.hass))return null;const a=await Wi(this.hass);let s=[];if(a&&e)try{const r={type:"call_service",domain:"mass_queue",service:t,service_data:{...a&&a!=="auto"&&{config_entry_id:a},uri:e},return_response:!0},n=await this.hass.connection.sendMessagePromise(r);n?.response?.tracks&&(s=n.response.tracks)}catch(r){console.warn(`yamp: mass_queue.${t} failed with config_entry_id, trying fallback with entity_id`,r);const n=this._getMusicAssistantState()?.entity_id;if(n)try{const o={type:"call_service",domain:"mass_queue",service:t,service_data:{entity:n,uri:e},return_response:!0},l=await this.hass.connection.sendMessagePromise(o);l?.response?.tracks&&(s=l.response.tracks)}catch(o){throw console.warn(`yamp: mass_queue.${t} fallback with entity_id also failed.`,o),r}else throw r}return s}catch(a){return console.error(`yamp: Error fetching ${t} via mass_queue:`,a),null}}_setSearchResultsFromMassQueue(e,t){this._searchResults=e.map(a=>({media_content_id:a.media_content_id,media_content_type:"track",media_class:"track",title:a.media_title,artist:a.media_artist,album:a.media_album_name,thumbnail:a.media_image,duration:a.duration,is_browsable:!1,favorite:a.favorite})),this._searchQuery=t,this._searchTotalRows=Math.max(15,e.length),this._searchLoading=!1,this.requestUpdate()}_notifyResize(){this.dispatchEvent(new Event("iron-resize",{bubbles:!0,composed:!0}))}_setupAdaptiveTextObserver(){!this._adaptiveText||this._textResizeObserver||typeof ResizeObserver>"u"||!this.isConnected||(this._textResizeObserver=new ResizeObserver(()=>this._updateAdaptiveTextScale()),this._textResizeObserver.observe(this),this._updateAdaptiveTextScale())}_teardownAdaptiveTextObserver(){this._textResizeObserver&&(this._textResizeObserver.disconnect(),this._textResizeObserver=null),this._currentTextScale=null,this._setAdaptiveTextVars(1,new Set)}_setAdaptiveTextVars(e,t,a){if(!this.style)return;const s=t||this._adaptiveTextTargets,r=Number.isFinite(e)?e:1,n=r.toFixed(2);this.style.setProperty("--yamp-text-scale",n);for(const[p,_]of Object.entries(np)){const m=!!s?.has(p);this.style.setProperty(_,m?n:"1")}const o=!!s?.has("details"),l=Number.isFinite(a)?a:r,c=o?l.toFixed(2):"1",d=o?this._calculateDetailsLineHeight(l):1.2;this.style.setProperty("--yamp-details-scale",c),this.style.setProperty("--yamp-details-line-height",d.toFixed(2));const h=o?l>=2?3:l>=1.3?2:1:3;this.style.setProperty("--yamp-details-max-lines",h.toString())}_updateAdaptiveTextObserverState(){this._adaptiveText&&this.isConnected?this._setupAdaptiveTextObserver():this._teardownAdaptiveTextObserver()}_handleGlobalScroll(){this._adaptiveText&&(this._suspendAdaptiveScaling=!0,this._pendingAdaptiveScaleUpdate=!0,clearTimeout(this._adaptiveScrollTimer),this._adaptiveScrollTimer=setTimeout(()=>{this._suspendAdaptiveScaling=!1,this._pendingAdaptiveScaleUpdate&&(this._pendingAdaptiveScaleUpdate=!1,this._updateAdaptiveTextScale(!0))},400))}_handleViewportResize(){this._updateViewportFlags()}_updateViewportFlags(){if(typeof window>"u")return;const e=typeof document<"u"?document.documentElement?.clientWidth:0,t=window.innerWidth||e||0,a=t>0?t<=520:this._isNarrowViewport;a!==this._isNarrowViewport&&(this._isNarrowViewport=a,this.requestUpdate())}_updateAdaptiveTextScale(e=!1){if(!this._adaptiveText)return;if(this._suspendAdaptiveScaling&&!e){this._pendingAdaptiveScaleUpdate=!0;return}const t=this.getBoundingClientRect(),a=t?.width||0;if(!a)return;const s=this._getAdaptiveBaselineHeight(this._lastRenderedCollapsed||!1),r=t?.height&&t.height>0?t.height:s||a,n=a/360,o=r/360,l=n*.8+o*.2,c=Math.max(.85,Math.min(1.4,l)),d=this._calculateDetailsScale(a,r,c,this._lastTitleLength||0),h=this._currentTextScale===null||Math.abs(this._currentTextScale-c)>.01,p=this._currentDetailsScale===null||Math.abs(this._currentDetailsScale-d)>.02;(h||p)&&(this._currentTextScale=c,this._currentDetailsScale=d,this._setAdaptiveTextVars(c,void 0,d),this.requestUpdate())}_calculateDetailsScale(e,t,a=1){if(!this._adaptiveTextTargets?.has("details"))return 1;const s=e/360,r=Math.min(3.25,Math.max(1,s*.85+.15)),n=this._lastSpacerRendered!==!1,o=this._lastVolumeRendered!==!1;let l=144;if(!this._alternateProgressBar){const f=this.config?.progress_bar_height??16;l+=Number(f)}n&&(l+=48),o&&(l+=72);const c=Math.max(1,1+(t-l)/56),d=Math.min(3.25,c);let h=Math.min(r,d);n||(h=d);const p=this._lastTitleLength||0,_=p>0?Math.max(.62,Math.min(1,30/Math.min(p,72))):1,m=1+(h-1)*_;return Math.max(1,m)}_calculateDetailsLineHeight(e){const t=Math.max(1,Math.min(e,2.6)),a=Math.max(0,t-1);return Math.min(1.55,1.2+a*.35)}_getAdaptiveBaselineHeight(e=!1){const t=this._cardHeightTemplateValue?.card?.template?this._cardHeightResolveCache?.card?.value:this.config?.card_height;if(typeof t=="number"&&Number.isFinite(t)&&t>0)return t;if(typeof t=="string"){const a=t.trim();if(a){const s=Number(a);if(Number.isFinite(s)&&s>0)return s}}return e||this._alwaysCollapsed?this._collapsedBaselineHeight||220:350}async _resolveIdleImageTemplate(){if(!(!this._idleImageTemplate||this._resolvingIdleImageTemplate||!this.hass)){this._resolvingIdleImageTemplate=!0;try{const e=this._getTemplateContext(),t=await Ga(this.hass,this._idleImageTemplate,e);this._idleImageTemplateResult=(t??"").toString().trim()}catch{this._idleImageTemplateResult=""}finally{this._resolvingIdleImageTemplate=!1,this._idleImageTemplateNeedsResolve=!1,this.requestUpdate()}}}_getTemplateContext(){return{entity:this.currentEntityId||"",is_idle:this._isIdle,is_playing:this._isCurrentEntityPlaying(),is_search:this._showSearchInSheet,is_grouping:this._showGrouping,is_source:this._showSourceList||this._showSourceMenu,is_lyrics:this._lyricsActive,is_options:this._showEntityOptions,is_transfer_queue:this._showTransferQueue,is_any_menu_open:this.isAnyMenuOpen,current:this.currentActivePlaybackEntityId||this.currentEntityId||""}}_setIdleState(e){const t=this._idleTimeoutMs===0?!1:e;this._isIdle!==t&&(this._isIdle=t,this._cardHeightTemplate&&(this._cardHeightTemplateNeedsResolve=!0))}_ensureArtworkOverrideIndexMap(){this._artworkOverrideIndexMap||(this._artworkOverrideIndexMap=new WeakMap,(Array.isArray(this.config?.media_artwork_overrides)?this.config.media_artwork_overrides:[]).forEach((e,t)=>{e&&typeof e=="object"&&this._artworkOverrideIndexMap.set(e,t)}))}_getArtworkOverrideCacheKey(e,t="image",a=null){this._ensureArtworkOverrideIndexMap();const s=a?.attributes?.media_title||"",r=a?.attributes?.media_artist||"",n=`${s}:${r}`,o=e&&this._artworkOverrideIndexMap?.get(e);return`${typeof o=="number"?o:"generic"}:${t}:${n}`}_getResolvedArtworkOverrideSource(e,t,a="image",s=null){if(!t||typeof t!="string")return null;const r=this._normalizeImageSourceValue(t);if(!r)return null;const n=typeof t=="string"&&t.trim().startsWith("[[["),o=typeof t=="string"&&(t.includes("{{")||t.includes("{%"));if(!n&&!o)return r;if(n)return this._normalizeImageSourceValue(this._evaluateJsTemplate(t));this._artworkOverrideTemplateCache||(this._artworkOverrideTemplateCache={});const l=this._getArtworkOverrideCacheKey(e,a,s);this._artworkOverrideTemplateCache[l]||(this._artworkOverrideTemplateCache[l]={value:null,resolving:!1});const c=this._artworkOverrideTemplateCache[l];if(c.value)return c.value;if(!c.resolving&&this.hass){c.resolving=!0;const d=this._getTemplateContext();Ga(this.hass,t,d).then(h=>{c.value=this._normalizeImageSourceValue((h??"").toString())}).catch(()=>{c.value=""}).finally(()=>{c.resolving=!1,this.requestUpdate()})}return c.value}_getCollapsedArtworkStyle(){if(this._alwaysCollapsed){const e=!!this._getFavoriteButtonEntity()&&!this._getHiddenControlsForCurrentEntity().favorite;if(Wa(this.currentActivePlaybackStateObj,(t,a)=>this._supportsFeature(t,a),e,this._getHiddenControlsForCurrentEntity(),!0,this._controlLayout)>6&&window.innerWidth<=768)return"width: 60px; height: 60px; object-fit: var(--yamp-artwork-fit, cover); border-radius: 8px;"}return""}_getArtworkUrl(e,t=!1){const a=(this._isIdle||t)&&!!this.config?.idle_image,s=Qa(e,{hostname:this.config?.artwork_hostname||"",overrides:Array.isArray(this.config?.media_artwork_overrides)?this.config.media_artwork_overrides:[],fallbackArtwork:this.config?.fallback_artwork,artworkObjectFit:this._artworkObjectFit,aspectRatioCache:this._aspectRatioCache,isIdleImageActive:a,resolveOverrideSource:(c,d,h,p)=>this._getResolvedArtworkOverrideSource(c,d,h,p)});if(!s)return null;let{url:r,sizePercentage:n,objectFit:o,objectPosition:l}=s;return r&&!oi(r)&&(r=null),o||(o=this._artworkObjectFit),l||(l=this.config?.artwork_position||"top center"),{url:r,sizePercentage:n,objectFit:o,objectPosition:l}}_getBackgroundSizeForFit(e){switch(e){case"contain":return"contain";case"fill":return"100% 100%";case"scale-down":return"contain";case"none":return"auto";case"scaled-contain":case"scaled-contain-alternate":return"80%";default:return"cover"}}_isExternalImageUrl(e){return/^https?:\/\//i.test(e)&&window.location?.origin&&!e.startsWith(window.location.origin)}async _extractDominantColor(e){return new Promise(t=>{if(!e||typeof e!="string"){t("#888");return}const a=new window.Image;this._isExternalImageUrl(e)&&(a.crossOrigin="Anonymous"),a.src=e,a.onload=function(){try{const s=document.createElement("canvas");s.width=1,s.height=1;const r=s.getContext("2d");r.drawImage(a,0,0,1,1);const[n,o,l]=r.getImageData(0,0,1,1).data;t(`rgb(${n},${o},${l})`)}catch{t("#888")}},a.onerror=function(){t("#888")}})}_updateArtworkAspectRatios(){this.hass&&this.entityIds.forEach(e=>{const t=this.hass.states[e];if(t?.attributes){const a=t.attributes,s=ge(a,"entity_picture_local")||ge(a,"entity_picture")||ge(a,"album_art");s&&this._calculateAspectRatio(this._normalizeImageSourceValue(s))}})}_calculateAspectRatio(e){if(!e||typeof e!="string"||this._aspectRatioCache[e]!==void 0)return;this._aspectRatioCache[e]=null;const t=new window.Image;this._isExternalImageUrl(e)&&(t.crossOrigin="Anonymous"),t.src=e,t.onload=()=>{t.naturalWidth&&t.naturalHeight&&(this._aspectRatioCache[e]=t.naturalWidth/t.naturalHeight,this.requestUpdate())},t.onerror=()=>{this._aspectRatioCache[e]=null}}_normalizeAdaptiveTextTargets(e){return Array.isArray(e?.adaptive_text_targets)?e.adaptive_text_targets.map(t=>typeof t=="string"?t.trim().toLowerCase():"").filter(t=>Co.includes(t)):e?.adaptive_text===!0?[...rp]:[]}_normalizeImageSourceValue(e){if(!e||typeof e!="string")return"";let t=e.trim();if(!t)return"";(t.startsWith("'")&&t.endsWith("'")||t.startsWith('"')&&t.endsWith('"'))&&t.length>=2&&(t=t.slice(1,-1).trim());const a=t.match(/^url\((.*)\)$/i);if(a&&a[1]!==void 0){let s=a[1].trim();return(s.startsWith("'")&&s.endsWith("'")||s.startsWith('"')&&s.endsWith('"'))&&(s=s.slice(1,-1).trim()),s}return t}setConfig(e){if(!e.entities||!Array.isArray(e.entities)||e.entities.length===0)throw new Error("You must define at least one media_player entity.");const t=this.config,a=e.template||"custom",s={...ri[a]||{},...e};this.config=s,this._swapPauseForStop=s.swap_pause_for_stop===!0,this._holdToPin=!!s.hold_to_pin,this._disableSearchAutofocus=s.disable_autofocus===!0,this._holdToPin&&(this._holdHandler=Tc({onPin:c=>this._pinChip(c),onHoldEnd:()=>{},holdTime:650,moveThreshold:8}));const r=this._selectedIndex||0;this._selectedIndex=r<this.entityIds.length?r:0,this._lastPlaying=null,this._lastActiveEntityId=null;const n=new Set(["cover","contain","fill","scale-down","none","scaled-contain","scaled-contain-alternate","no_artwork"]);this._baseArtworkObjectFit=n.has(s.artwork_object_fit)?s.artwork_object_fit:"cover",this._extendArtwork=s.extend_artwork===!0,this._idleScreen=s.idle_screen||"default",this._idleScreenApplied=!1,this._hasSeenPlayback=!1,this._appearance=s.appearance||"automatic",this._isIdle&&this._applyIdleScreen(),this._updateHostAttributes(),this._showVolumeOverlay=!!s.show_volume_overlay,this._collapseOnIdle=!!s.collapse_on_idle,this._expandOnSearch=!!s.expand_on_search,this._alternateProgressBar=!!s.alternate_progress_bar,this._displayTimestamps=!!s.display_timestamps,this._keepFiltersOnSearch=!!s.keep_filters_on_search,this._adaptiveControls=s.adaptive_controls===!0;const o=this._normalizeAdaptiveTextTargets(s);if(this._adaptiveTextTargets=new Set(o),this._adaptiveText=this._adaptiveTextTargets.size>0,this._currentDetailsScale=null,this._updateAdaptiveTextObserverState(),s.always_show_quick_group!==t?.always_show_quick_group&&(this._quickGroupingMode=!!s.always_show_quick_group),this._adaptiveText){const c=this._currentTextScale??1,d=this._currentDetailsScale??1;this._setAdaptiveTextVars(c,void 0,d),this._updateAdaptiveTextScale()}else this._setAdaptiveTextVars(1,new Set,1);this._hideActiveEntityLabel=s.hide_active_entity_label===!0,this._hideActiveEntityLabelOnIdle=s.hide_active_entity_label_on_idle===!0,this._artworkOverrideTemplateCache={},this._artworkOverrideIndexMap=null,Array.isArray(s.media_artwork_overrides)&&(this.config.media_artwork_overrides=s.media_artwork_overrides.map(c=>({...c})),this.config.media_artwork_overrides.forEach(c=>{!c||typeof c!="object"||(c.__cachedRegexes={},Wr.forEach(d=>{const h=c[d];if(typeof h=="string"&&h.includes("*")&&h!=="*")try{const p=h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\\\*/g,".*");c.__cachedRegexes[d]=new RegExp(`^${p}$`,"i")}catch{console.warn("yamp: Failed to compile artwork override regex for",d,h)}}))})),typeof s.idle_image=="string"&&(s.idle_image.includes("{{")||s.idle_image.includes("{%"))?(this._idleImageTemplate=s.idle_image,this._idleImageTemplateResult="",this._idleImageTemplateNeedsResolve=!0):(this._idleImageTemplate=null,this._idleImageTemplateResult="",this._idleImageTemplateNeedsResolve=!1);let l=6e4;if(s.idle_timeout_ms!==void 0&&s.idle_timeout_ms!==null&&s.idle_timeout_ms!==""){const c=Number(s.idle_timeout_ms);isNaN(c)||(l=Math.max(0,c))}this._idleTimeoutMs=l,this._idleTimeoutMs===0&&(this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),this._isIdle&&(this._setIdleState(!1),this._resetIdleScreen(),this.requestUpdate())),this._volumeStep=typeof s.volume_step=="number"?s.volume_step:.05,this._volumeMode=s.volume_mode??"slider",s.always_show_lyrics===!0&&(this._lyricsActive=!0)}get entityObjs(){return this.config.entities.map((e,t)=>{const a=typeof e=="string"?e:e.entity_id,s=typeof e=="string"?"":e.name||"",r=typeof e=="string"?void 0:e.volume_entity,n=typeof e=="string"?void 0:e.music_assistant_entity,o=typeof e=="string"?!1:!!e.sync_power,l=typeof e=="string"?!1:!!e.follow_active_volume,c=typeof e=="string"?void 0:e.hidden_controls;let d;if(typeof e=="object"&&typeof e.group_volume<"u")d=e.group_volume;else{const _=this.hass?.states?.[a];if(_&&Array.isArray(_.attributes.group_members)&&_.attributes.group_members.length>0){const m=_.attributes.group_members.filter(y=>y!==a),f=this.config.entities.map(y=>typeof y=="string"?y:y.entity_id);d=m.filter(y=>f.includes(y)).length>0}}const h=typeof e=="string"?void 0:e.entity_volume_mode,p=typeof e=="string"?void 0:e.entity_volume_step;return{entity_id:a,name:s,volume_entity:r,music_assistant_entity:n,sync_power:o,follow_active_volume:l,hidden_controls:c,hidden_filter_chips:typeof e=="string"?void 0:e.hidden_filter_chips,hide_remote_buttons:typeof e=="string"?void 0:e.hide_remote_buttons,disable_auto_select:this._isAutoSelectDisabled(t),prefer_ma_metadata:typeof e=="string"?!1:!!e.prefer_ma_metadata,...typeof d<"u"?{group_volume:d}:{},...h?{entity_volume_mode:h}:{},...typeof p=="number"?{entity_volume_step:p}:{}}})}_getEntityForPurpose(e,t){const a=this.entityObjs[e];if(!a)return null;switch(t){case"volume_control":return a.follow_active_volume?this._getActivePlaybackEntityForIndex(e)||a.entity_id:this._resolveEntity(a.volume_entity,a.entity_id,e,"vol")||a.entity_id;case"playback_control":return this._getActivePlaybackEntityForIndex(e)||a.entity_id;case"sorting":return this._getActivePlaybackEntityForIndex(e)||a.entity_id;case"metadata":return a.prefer_ma_metadata?this._resolveEntity(a.music_assistant_entity,a.entity_id,e)||a.entity_id:this._getActivePlaybackEntityForIndex(e)||a.entity_id;default:return a.entity_id}}_resolveEntity(e,t,a,s="ma"){return e?typeof e=="string"&&(e.includes("{{")||e.includes("{%")||e.trim().startsWith("[[["))?(s==="vol"?this._volResolveCache:this._maResolveCache)?.[a]?.id||t:e:null}_getActivePlaybackEntityForIndex(e){const t=this.entityObjs[e];if(!t)return null;const a=t.entity_id,s=this._resolveEntity(t.music_assistant_entity,t.entity_id,e),r=a?this.hass?.states?.[a]:null,n=s?this.hass?.states?.[s]:null;return s===a?a:this._getActivePlaybackEntityForIndexInternal(e,a,s,r,n)}_getActivePlaybackEntityForIndexInternal(e,t,a,s,r){const n=this._lastResolvedEntityIdByChip[e],o=_=>(this._lastResolvedEntityIdByChip[e]=_,_),l=this._playbackLingerByIdx?.[e],c=Date.now();if(l&&l.until>c){if(this._isEntityPlaying(s)&&this._lastPlayingEntityIdByChip?.[e]===t)return o(t);if(this.hass?.states?.[l.entityId])return o(l.entityId)}l&&l.until<=c&&delete this._playbackLingerByIdx[e];const d=this._isEntityPlaying(r),h=this._isEntityPlaying(s);if(d&&h)return o(n===t?t:a);if(d)return o(a);if(h)return o(t);const p=this._lastPlayingEntityIdByChip?.[e];if(p===a&&r)return o(a);if(p===t)return o(t);if(a&&a!==t){const _=a===n;return t===n&&s&&s.state!=="off"&&s.state!=="unavailable"?o(t):_&&r&&r.state!=="off"&&r.state!=="unavailable"?o(a):o(r?a:t)}else return o(t)}_getVolumeEntity(e){return this._getEntityForPurpose(e,"volume_control")}_getEffectiveVolumeMode(){return this.entityObjs?.[this._selectedIndex]?.entity_volume_mode||this._volumeMode}_getEffectiveVolumeStep(){const e=this.entityObjs?.[this._selectedIndex];return typeof e?.entity_volume_step=="number"?e.entity_volume_step:this._volumeStep}_resolveEntityIdxByGroupingId(e){const t=this.entityObjs;for(let a=0;a<t.length;a++)if(this._resolveMaEntityForObj(t[a],a)===e)return a;return-1}_resolveMaEntityForObj(e,t){return e?this._resolveEntity(e.music_assistant_entity,e.entity_id,t)||e.entity_id:null}_getSearchEntityId(e){const t=this.entityObjs[e];return!t||!t.music_assistant_entity?t?.entity_id:(typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%")||t.music_assistant_entity.trim().startsWith("[[[")),t.music_assistant_entity)}_getPlaybackEntityId(e){return this._getEntityForPurpose(e,"playback_control")}_getActivePlaybackEntityId(e=this._selectedIndex){const t=this.entityObjs?.[e];if(!t)return null;const a=t.entity_id,s=this._getActualResolvedMaEntityForState(e),r=a?this.hass?.states?.[a]:null,n=s?this.hass?.states?.[s]:null;return this._getActivePlaybackEntityIdInternal(e,a,s,r,n)}_getActivePlaybackEntityIdInternal(e,t,a,s,r){if(a===t)return t;const n=Date.now(),o=this._playTimestamps?.[a]||0,l=this._playTimestamps?.[t]||0,c=this._playerStateCache[a]==="playing"&&r?.state!=="playing",d=this._playerStateCache[t]==="playing"&&s?.state!=="playing",h=c||n-o<5e3,p=d||n-l<5e3;if(this._isEntityPlaying(r))return this._lastActiveEntityIdByChip[e]=a,a;if(h&&r?.state!=="playing")return a;if(this._isEntityPlaying(s))return this._lastActiveEntityIdByChip[e]=t,t;if(p&&s?.state!=="playing")return t;const _=this._lastActiveEntityIdByChip?.[e];return _&&(_===a||_===t)?_:a&&a!==t?a:t}_getHiddenControlsForCurrentEntity(){let e=this.entityObjs[this._selectedIndex]?.hidden_controls;const t=this._hiddenControlsResolveCache?.[this._selectedIndex]?.value;if(t!==void 0&&(e=t),!e)return{};if(typeof e=="string")try{e=JSON.parse(e.replace(/'/g,'"'))}catch{e=e.split(",").map(s=>s.trim())}const a={};return Array.isArray(e)?e.forEach(s=>{a[s]=!0}):typeof e=="object"&&Object.assign(a,e),a}_getActivePlaybackEntityIdForIndex(e){return this._getActivePlaybackEntityId(e)}_getGroupingEntityId(e){const t=this.entityObjs[e];return t?t.music_assistant_entity?typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%")||t.music_assistant_entity.trim().startsWith("[[["))?this._maResolveCache?.[e]?.id||t.entity_id:t.music_assistant_entity:t.entity_id:null}_getGroupingEntityIdByEntityId(e){const t=this.entityIds.indexOf(e);return t<0?e:this._getGroupingEntityId(t)}_findEntityObjByAnyId(e){return this.entityObjs.find(t=>t.entity_id===e||t.music_assistant_entity===e)||null}_resolveMusicAssistantEntity(e){const t=this.entityObjs[e];if(!t||!t.music_assistant_entity)return t?.entity_id;try{return typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%")),t.music_assistant_entity}catch{return t.entity_id}}_getGroupKey(e){const t=this._getGroupingEntityIdByEntityId(e),a=this.hass?.states?.[t];if(!a||!this._isGroupCapable(a))return e;const s=Array.isArray(a.attributes.group_members)?a.attributes.group_members:[];if(s.length<=1)return e;const r=s[0],n=this.hass?.states?.[r];return this._isGroupCapable(n)?this.entityIds.find(o=>this._getGroupingEntityIdByEntityId(o)===r)||r:e}get entityIds(){return this.entityObjs.map(e=>e.entity_id)}getChipName(e){const t=this.entityObjs.find(a=>a.entity_id===e);return t&&t.name?t.name:this.hass.states[e]?.attributes.friendly_name||e}_getActualGroupMaster(e){if(!e||!e.length)return null;if(!this.hass||e.length===1)return e[0];if(this._lastGroupingMasterId&&e.includes(this._lastGroupingMasterId))return this._lastGroupingMasterId;const t=e.map(a=>{const s=this._getGroupingEntityIdByEntityId(a),r=s?this.hass.states[s]:null;return r?{id:a,groupingId:s,state:r}:null}).filter(Boolean);if(!t.length)return e[0];for(const a of t){const s=a.state?.attributes?.group_members;if(Array.isArray(s)&&s.length>0){const r=s[0],n=t.find(o=>o.groupingId===r);if(n)return n.id}}return e[0]}_getGroupingMasterId(){if(!this.entityIds||!this.entityIds.length)return null;const e=this.groupedSortedEntityIds||[],t=this.currentEntityId||this.entityIds[0];let a=t;if(this._lastGroupingMasterId&&this.entityIds.includes(this._lastGroupingMasterId)){const r=e.find(n=>n.includes(this._lastGroupingMasterId));r&&r.length>1&&r.includes(t)&&(a=this._lastGroupingMasterId)}const s=a?e.find(r=>r.includes(a)):null;if(s&&s.length>1){const r=this._getActualGroupMaster(s);if(r&&this.entityIds.includes(r))return r}return a}_getGroupingMasterIndex(){const e=this._getGroupingMasterId();return e?this.entityIds.indexOf(e):-1}_getGroupingMasterObj(){const e=this._getGroupingMasterIndex();return e>=0?this.entityObjs[e]:null}_isActiveChipGrouped(e){if(!this.entityIds||e<0||e>=this.entityIds.length)return!1;const t=this.entityIds[e];if(!t)return!1;const a=(this.groupedSortedEntityIds||[]).find(s=>s.includes(t));return!!(a&&a.length>1)}_resolveGroupingEntityId(e,t){if(!e?.music_assistant_entity)return t;if(typeof e.music_assistant_entity=="string"&&(e.music_assistant_entity.includes("{{")||e.music_assistant_entity.includes("{%")||e.music_assistant_entity.trim().startsWith("[[["))){const a=this.entityIds.indexOf(t);return this._maResolveCache?.[a]?.id||t}return e.music_assistant_entity}get currentEntityId(){return this.entityIds[this._selectedIndex]}get currentStateObj(){return!this.hass||!this.currentEntityId?null:this.hass.states[this.currentEntityId]}get currentPlaybackEntityId(){return this._getPlaybackEntityId(this._selectedIndex)}get currentPlaybackStateObj(){const e=this._getResolvedPlaybackEntityIdSync(this._selectedIndex);return!this.hass||!e?this.currentStateObj:this.hass.states[e]}get currentActivePlaybackEntityId(){const e=`${this._selectedIndex}-${this.hass?.states?.[this.currentEntityId]?.state}-${this.hass?.states?.[this._getSearchEntityId(this._selectedIndex)]?.state}`;return(this._cachedActivePlaybackEntityId===void 0||this._cachedActivePlaybackEntityKey!==e)&&(this._cachedActivePlaybackEntityId=this._getActivePlaybackEntityId(this._selectedIndex),this._cachedActivePlaybackEntityKey=e),this._cachedActivePlaybackEntityId}get metadataStateObj(){const e=this._getEntityForPurpose(this._selectedIndex,"metadata");return e?this.hass?.states?.[e]:null}get currentActivePlaybackStateObj(){const e=this.currentActivePlaybackEntityId;return e?this.hass?.states?.[e]:null}get currentVolumeStateObj(){const e=this._getVolumeEntity(this._selectedIndex);return e?this.hass.states[e]:null}get isAnyMenuOpen(){return this._showEntityOptions||this._showGrouping||this._showSourceList||this._showTransferQueue||this._showResolvedEntities||this._showSearchInSheet||this._showSourceMenu||!!this._searchActiveOptionsItem||!!this._activeSearchRowMenuId||!!this._queueActionsMenuOpenId}get _isSelectionFlow(){return!!this._addToPlaylistTarget||!!this._searchHierarchy.some(e=>e.type==="select_track_for_playlist")}_renderMainMenu(e,t,a){return g`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>this._closeEntityOptions()}>
          ${u("common.close")}
        </button>
        <div class="entity-options-divider"></div>
      </div>
      <div class="entity-options-menu ${a?"chips-in-menu":""} entity-options-scroll" style="display:flex; flex-direction:column;">
        <button class="entity-options-item" @click=${()=>{const s=this._getResolvedEntitiesForCurrentChip();s.length===1?(this._openMoreInfoForEntity(s[0]),this._showEntityOptions=!1):this._showResolvedEntities=!0,this.requestUpdate()}}>${u("card.menu.more_info")}</button>
        <button class="entity-options-item" @click=${()=>{this._showSearchSheetInOptions()}}>${u("common.search")}</button>

        ${Array.isArray(e)&&e.length>0?g`
          <button class="entity-options-item" @click=${()=>this._openSourceList()}>${u("card.menu.source")}</button>
        `:v}
        
        ${this._canShowTransferQueueOption()?g`
          <button class="entity-options-item" @click=${()=>this._openTransferQueue()}>${u("card.menu.transfer_queue")}</button>
        `:v}
        
        ${this._renderGroupingMenuOption()}
        
        ${this._hasRemoteControlSupport()?g`
          <button class="entity-options-item" @click=${()=>this._openRemoteControl()}>
            ${u("card.menu.remote_controls")}
          </button>
        `:v}
        
        ${this._alwaysCollapsed?v:g`
          <button class="entity-options-item" @click=${()=>{this._lyricsActive=!this._lyricsActive,this._lyricsActive||(this._lastLyricsTrackId=null,this._lastLyricsEntityId=null,this._lastLyricsArtist=null,this._lastLyricsTitle=null),this._showEntityOptions=!1,this.requestUpdate()}}>${u(this._lyricsActive?"card.menu.hide_lyrics":"card.menu.show_lyrics")}</button>
        `}
        
        
        ${t.length?g`
          ${t.map(({action:s,idx:r})=>{const n=this._getActionLabel(s);return g`
              <button
                class="entity-options-item menu-action-item"
                @click=${()=>this._onMenuActionClick(r)}
              >
                ${s.icon?g`
                  <ha-icon
                    class="menu-action-icon"
                    .icon=${s.icon}
                  ></ha-icon>
                `:v}
                ${n?g`<span class="menu-action-label">${n}</span>`:v}
              </button>
            `})}
        `:v}
      </div>
    `}_getChipRowProps(){return{groupedSortedEntityIds:this.groupedSortedEntityIds,entityIds:this.entityIds,selectedEntityId:this.currentEntityId,pinnedIndex:this._pinnedIndex,holdToPin:this._holdToPin,getChipName:e=>this.getChipName(e),getActualGroupMaster:e=>this._getActualGroupMaster(e),artworkHostname:this.config?.artwork_hostname||"",mediaArtworkOverrides:this.config?.media_artwork_overrides||[],fallbackArtwork:this.config?.fallback_artwork||null,getIsChipPlaying:(e,t)=>{const a=this.entityIds.indexOf(e);if(a<0)return!1;const s=this._getEntityForPurpose(a,"playback_control"),r=this.hass?.states?.[s];return this._isEntityPlaying(r)},getChipArt:e=>{const t=this.entityIds.indexOf(e);if(t<0)return null;const a=this._getEntityForPurpose(t,"metadata"),s=this.hass?.states?.[a],r=this._getEntityForPurpose(t,"playback_control"),n=this.hass?.states?.[r],o=this.hass?.states?.[e],l=this._getArtworkUrl(s),c=this._getArtworkUrl(n),d=this._getArtworkUrl(o),h=(s||n||o)?.attributes?.media_title;let p=l;return h&&(!p||!p.url)&&c?.url&&n?.attributes?.media_title===h&&(p=c),h&&(!p||!p.url)&&d?.url&&o?.attributes?.media_title===h&&(p=d),p||c||d},getIsMaActive:e=>{const t=this.entityIds.indexOf(e);if(t<0)return!1;const a=this.entityObjs[t];if(!a?.music_assistant_entity)return!1;const s=this._getEntityForPurpose(t,"playback_control"),r=this.hass?.states?.[s];return s===this._resolveEntity(a.music_assistant_entity,a.entity_id,t)&&this._isEntityPlaying(r)},isIdle:this._isIdle,hass:this.hass,onChipClick:e=>this._onChipClick(e),onIconClick:(e,t)=>{const a=this.entityIds[e],s=this.groupedSortedEntityIds.find(r=>r.includes(a));s&&s.length>1&&(this._selectedIndex=e,this._showEntityOptions=!0,this._showGrouping=!0,this.requestUpdate())},onPinClick:(e,t)=>{t.stopPropagation(),this._onPinClick(t)},onPointerDown:(e,t)=>this._handleChipPointerDown(e,t),onPointerMove:(e,t)=>this._handleChipPointerMove(e,t),onPointerUp:(e,t)=>this._handleChipPointerUp(e,t),quickGroupingMode:this._quickGroupingMode,getQuickGroupingState:e=>{const t=this.currentEntityId,a=this.entityIds.indexOf(t),s=a>=0?this._getGroupingEntityId(a):t,r=s?this.hass.states[s]:null,n=this._getGroupKey(this.currentEntityId);return this._getGroupPlayerState(e,t,null,r,n)},onQuickGroupClick:(e,t)=>{const a=this.entityIds[e];a&&this._toggleGroup(a)},onDoubleClick:e=>{e.stopPropagation(),!(Date.now()-this._lastChipDoubleTapTime<op)&&(this._quickGroupingMode=!this._quickGroupingMode,this.requestUpdate())}}}_renderInlineChipRow(e,t){return e?g`
      <div class="chip-row" style="${t?"visibility: hidden; pointer-events: none;":""}">
        ${Jr(this._getChipRowProps())}
      </div>
    `:v}_renderInlineActionRow(e){return!e||!e.length?v:g`
      <div style="${this._showEntityOptions?"visibility: hidden; pointer-events: none;":""}">
        ${Mc({actions:e.map(({action:t})=>t),onActionChipClick:t=>{const a=e[t];a&&this._onActionChipClick(a.idx)}})}
      </div>
    `}_renderGroupingMenuOption(){if(this.entityIds.length<=1)return v;const e=this.entityIds.reduce((n,o,l)=>{const c=this._getGroupingEntityId(l),d=this.hass.states[c];return n+(this._isGroupCapable(d)?1:0)},0),t=this._getGroupingEntityId(this._selectedIndex),a=this.hass.states[t],s=this.currentEntityId,r=this._getGroupKey(s)!==s;return e>1&&this._isGroupCapable(a)&&!r?g`
        <button class="entity-options-item" @click=${()=>this._openGrouping()}>${u("card.menu.group_players")}</button>
      `:v}_getGroupPlayerState(e,t,a,s,r){const n=this.entityIds.indexOf(e);if(n<0)return{isGroupable:!1,isBusy:!1,busyLabel:"",grouped:!1};const o=this._getGroupingEntityId(n),l=this.hass.states[o];if(!l||!this._isGroupCapable(l))return{isGroupable:!1,isBusy:!1,busyLabel:"",grouped:!1};const c=this._getGroupKey(e);let d=!1,h="";(c!==e&&c!==r||c===e&&c!==r&&l.attributes?.group_members?.length>1)&&(d=!0,h=u("common.unavailable"));const p=(Array.isArray(s?.attributes?.group_members)?s.attributes.group_members:[]).includes(o),_=e===r,m=this.getChipName(t);let f;return _?f=u("card.grouping.master"):p?(f=u("card.grouping.unjoin_from","{master}",m),f==="card.grouping.unjoin_from"&&(f=`Unjoin from ${m}`)):(f=u("card.grouping.join_with","{master}",m),f==="card.grouping.join_with"&&(f=`Join with ${m}`)),{isGroupable:!0,isBusy:d,busyLabel:h,grouped:p,isPrimary:_,entityToCheck:o,tooltip:f}}_renderGroupingSheet(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this._getGroupingEntityId(t):e,s=a?this.hass.states[a]:null,r=Array.isArray(s?.attributes?.group_members)&&s.attributes.group_members.length>1,n=[],o=this._getGroupKey(this.currentEntityId);this.entityIds.forEach(f=>{const y=this._getGroupPlayerState(f,this.currentEntityId,null,s,o);y.isGroupable&&n.push({id:f,groupId:y.entityToCheck,isBusy:y.isBusy,busyLabel:y.busyLabel})});const l=this.currentEntityId,c=this.entityIds.indexOf(l),d=c>=0?this._getGroupingEntityId(c):null,h=d?this.hass.states[d]:null,p=h?this._isGroupCapable(h):!1,_=this._getGroupKey(l)!==l;if(!r&&(!p||_))return g`
        <div class="entity-options-header">
          ${this._cardType!=="group_players"&&this._cardType!=="remote_control"?g`
            <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeGrouping()}}>
              ${u("common.back")}
            </button>
          `:v}
          <div class="entity-options-divider"></div>
        </div>
        ${v}
        <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
          ${u(_?"card.grouping.unavailable":"card.grouping.no_players")}
        </div>
      `;const m=[...n].sort((f,y)=>{if(r){if(f.id===e)return-1;if(y.id===e)return 1}else{if(f.id===l)return-1;if(y.id===l)return 1}return f.isBusy===y.isBusy?0:f.isBusy?1:-1});return g`
      <div class="entity-options-header grouping-header group-list-header">
        ${this._cardType!=="group_players"&&this._cardType!=="remote_control"?g`
          <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeGrouping()}}>
            ${u("common.back")}
          </button>
        `:v}
        <div class="entity-options-divider"></div>
      </div>
      ${v}
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        ${r?g`
          <button class="entity-options-item"
            @click=${()=>this._syncGroupVolume()}
            style="flex:0 0 auto; min-width:140px; text-align:center;">
            ${u("card.grouping.sync_volume")}
          </button>
        `:v}
        <button class="entity-options-item"
          @click=${()=>r?this._ungroupAll():this._groupAll()}
          style="flex:0 0 auto; min-width:140px; text-align:center; margin-left:auto;">
          ${u(r?"card.grouping.ungroup_all":"card.grouping.group_all")}
        </button>
      </div>
      <div class="group-list-scroll">
        ${m.length===0?g`
          <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
            ${u("card.grouping.no_players")}
          </div>
        `:m.map(f=>{const y=f.id,b=f.groupId,k=(Array.isArray(s?.attributes?.group_members)?s.attributes.group_members:[]).includes(b),E=this.getChipName(y),w=f.isBusy,P=f.busyLabel,$=this.entityIds.indexOf(y),C=this._getVolumeEntity($)||b,N=this.hass.states[C],j=C?.startsWith&&C.startsWith("remote."),F=Number(N?.attributes?.volume_level||0),I=y===e,O=!I;let R=u(r?I?"card.grouping.master":k?"card.grouping.joined":"card.grouping.available":y===l?"card.grouping.current":"card.grouping.available");return w&&(R=P||"Unavailable"),g`
            <div class="entity-options-item group-player-row" style="
              display:flex;
              align-items:center;
              gap:6px;
              padding: 12px 8px 4px 8px;
              margin-bottom: 1px;
              ${w?"opacity: 0.5;":""}
            ">
              <div style="flex:1; min-width:120px;">
                <div style="text-align:left;">${E}</div>
                <div style="font-size:0.8em; opacity:0.7; text-align:left;">${R}</div>
              </div>
              <div style="flex:1.8;display:flex;align-items:center;gap:4px;margin:0 6px; min-width:160px;">
                ${j?g`
                    <div class="vol-stepper" style="display:flex;align-items:center;gap:4px;">
                      <button @click=${()=>this._onGroupVolumeStep(C,-1)} title="${u("common.vol_down")}" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:minus"></ha-icon>
                      </button>
                      <button @click=${()=>this._onGroupVolumeStep(C,1)} title="${u("common.vol_up")}" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:plus"></ha-icon>
                      </button>
                    </div>
                  `:g`
                    <div class="volume-slider-container grouping-vol-slider-container" style="flex:1; padding: 0 4px; position: relative; display: flex; align-items: center;">
                      <div class="volume-percentage-indicator ${this._volumeDraggingEntity===y?"visible":""}" style="left: calc(13px + ${this._dragVolume} * (100% - 26px))">
                        ${Math.round(this._dragVolume*100)}%
                      </div>
                      <input
                        class="vol-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        .value=${F}
                        @mousedown=${D=>this._onVolumeDragStart(D,y)}
                        @touchstart=${D=>this._onVolumeDragStart(D,y)}
                        @input=${D=>this._onVolumeInput(D)}
                        @mouseup=${D=>this._onVolumeDragEnd(D)}
                        @touchend=${D=>this._onVolumeDragEnd(D)}
                        @change=${D=>this._onGroupVolumeChange(y,C,D)}
                        title="${u("common.volume")}"
                        style="width:100%;max-width:260px;"
                      />
                    </div>
                  `}
                <span style="min-width:36px;display:inline-block;text-align:right;">${typeof F=="number"?Math.round(F*100)+"%":"--"}</span>
              </div>
              ${O?g`
                    <button class="group-toggle-btn"
                            @click=${()=>!w&&this._toggleGroup(y)}
                            title=${w?"Player is unavailable":k?"Unjoin":"Join"}
                            style="margin-left:4px; ${w?"cursor: not-allowed; opacity: 0.5;":""}">
                      <ha-icon icon=${k?"mdi:minus-circle-outline":"mdi:plus-circle-outline"}></ha-icon>
                    </button>
                  `:g`<span style="margin-left:4px;margin-right:10px;width:32px;display:inline-block;"></span>`}
            </div>
          `})}
      </div>
    `}_renderTransferQueueSheet(){const e=this._getTransferQueueTargets();return g`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeTransferQueue()}}>
          ${u("common.back")}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-title" style="margin-bottom:12px;">${u("card.menu.transfer_to")}</div>
      </div>
      <div class="entity-options-scroll">
        ${e.length?g`
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${e.map(t=>g`
              <button
                class="entity-options-item"
                ?disabled=${this._transferQueuePendingTarget===t.maEntityId}
                @click=${()=>this._transferQueueTo(t)}
                style="display:flex;align-items:center;justify-content:flex-start;gap:12px;${this._transferQueuePendingTarget===t.maEntityId?"opacity:0.6;":""}">
                <ha-icon .icon=${t.icon} style="margin-right:4px;"></ha-icon>
                <div style="display:flex;flex-direction:column;align-items:flex-start;">
                  <div>${t.name}</div>
                  <div style="font-size:0.82em;opacity:0.7;">${t.subtitle}</div>
                </div>
                ${t.state?g`<div style="margin-left:auto;font-size:0.82em;opacity:0.7;text-transform:capitalize;">${t.state}</div>`:v}
              </button>
            `)}
          </div>
        `:g`
          <div style="padding: 12px; opacity: 0.75;">${u("card.menu.no_players")}</div>
        `}
        ${this._transferQueueStatus?g`
          <div style="
            margin-top: 14px;
            padding: 10px 12px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            background: ${this._transferQueueStatus.type==="error"?"rgba(244, 67, 54, 0.18)":"rgba(76, 175, 80, 0.18)"};
            color: ${this._transferQueueStatus.type==="error"?"#ff8a80":"#8bc34a"};
          ">
            ${this._transferQueueStatus.message}
          </div>
        `:v}
      </div>
    `}_renderResolvedEntitiesSheet(){return g`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>{this._showResolvedEntities=!1,this.requestUpdate()}}>
          ${u("common.back")}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-resolved-entities" style="margin-top:12px;">
          <div class="entity-options-title">${u("card.menu.select_entity")}</div>
          <div class="entity-options-resolved-entities-list">
            ${this._getResolvedEntitiesForCurrentChip().map(e=>{const t=this.hass?.states?.[e],a=t?.attributes?.friendly_name||e,s=t?.attributes?.icon||"mdi:help-circle",r=this._selectedIndex,n=this.entityObjs[r];let o="Main Entity",l=!1;if(n){const c=this._getActualResolvedMaEntityForState(r),d=this._getVolumeEntity(r);l=(this._getActivePlaybackEntityForIndex(r)||n.entity_id)===e,e===c&&c!==n.entity_id?o="Music Assistant Entity":e===d&&d!==n.entity_id&&d!==c&&(o="Volume Entity")}return g`
                <button class="entity-options-item" @click=${()=>{this._openMoreInfoForEntity(e),this._showEntityOptions=!1,this._showResolvedEntities=!1,this.requestUpdate()}}>
                  <ha-icon .icon=${s} style="margin-right: 8px;"></ha-icon>
                  <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <div>${l?`${a} (Active)`:a}</div>
                    <div style="font-size: 0.85em; opacity: 0.7;">${o}</div>
                  </div>
                </button>
              `})}
          </div>
        </div>
      </div>
    `}async _fetchLyrics(){if(!this._lyricsActive||this._isIdle||this.isAnyMenuOpen){this._fetchingLyrics=!1,this.requestUpdate();return}this._lyricsError=!1;const e=this.config.lyrics_source||"mass_lrclib",t=this.metadataStateObj||this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;if(!t){this._massLyrics=[],this.requestUpdate();return}const a=t.attributes.media_artist,s=t.attributes.media_title,r=t.attributes.media_album_name,n=t.attributes.media_duration,o=t.attributes.media_content_id,l=o?`${o}:${a}:${s}`:`${a}:${s}`;if(this._fetchingLyrics&&this._fetchingCacheKey===l)return;if(this._lyricsCache.has(l)){const h=this._lyricsCache.get(l);this._lyricsCache.delete(l),this._lyricsCache.set(l,h),this._massLyrics=h,this._fetchingLyrics=!1,this.requestUpdate();return}const c=Symbol();this._currentFetchToken=c,this._fetchingLyrics=!0,this._fetchingCacheKey=l,this._massLyrics=[],this.requestUpdate();let d;try{if(e==="mass")d=await this._getMassLyrics(t,c);else if(e==="lrclib")d=await this._getLrclibLyrics(a,s,r,n,c);else{const h=this._getMassLyrics(t,c),p=this._getLrclibLyrics(a,s,r,n,c),_=e==="mass_lrclib",m=async(b,k)=>{const E=await b;if(this._currentFetchToken!==c)return null;if(E&&E.length>0){const w=k==="mass"&&_||k==="lrclib"&&!_;(!this._massLyrics||this._massLyrics.length===0||w)&&(this._massLyrics=E||[],this._fetchingLyrics=!1,this.requestUpdate())}return E},[f,y]=await Promise.all([m(h,"mass"),m(p,"lrclib")]);if(this._currentFetchToken!==c)return;_?d=f&&f.length>0?f:y:d=y&&y.length>0?y:f}if(this._currentFetchToken===c){if(this._massLyrics=d||[],d&&d.length>0){if(this._lyricsCache.size>=sp){const h=this._lyricsCache.keys().next().value;this._lyricsCache.delete(h)}this._lyricsCache.set(l,d)}else d===null&&(this._lyricsError=!0);this._fetchingLyrics=!1,this._fetchingCacheKey=null,this.requestUpdate()}}catch(h){this._currentFetchToken===c&&(console.error("YAMP: Failed to fetch lyrics:",h),this._lyricsError=!0,this._fetchingLyrics=!1,this._fetchingCacheKey=null,this.requestUpdate())}}async _getMassLyrics(e,t){if(this._hasMassQueueIntegration===!1)return[];if(!this._massQueueAvailable){if(this._massQueueAvailable=await this._isMassQueueIntegrationAvailable(this.hass),this._hasMassQueueIntegration=this._massQueueAvailable,!this._massQueueAvailable)return[];if(this._currentFetchToken!==t)return[]}try{const a=this._getSearchEntityId(this._selectedIndex),s=await this._resolveTemplateAtActionTime(a,this.currentEntityId),r=await Wi(this.hass,s);if(!r)return[];const n=e.attributes.media_content_id;if(!n||!n.includes("://"))return[];const o={type:"call_service",domain:"mass_queue",service:"send_command",service_data:{command:"music/item_by_uri",data:{uri:n},...r&&r!=="auto"&&{config_entry_id:r}},return_response:!0},l=await this.hass.connection.sendMessagePromise(o);if(this._currentFetchToken!==t)return[];const c=l?.response?.response||l?.response||l?.result;if(!c)return[];const d={type:"call_service",domain:"mass_queue",service:"send_command",service_data:{command:"metadata/get_track_lyrics",data:{track:c},...r&&r!=="auto"&&{config_entry_id:r}},return_response:!0},h=await this.hass.connection.sendMessagePromise(d);if(this._currentFetchToken!==t)return[];const p=h?.response?.response||h?.response||h?.result;if(p){let _="";return Array.isArray(p)?_=p[1]||p[0]||"":typeof p=="string"?_=p:typeof p=="object"&&(_=p.lyrics||p.text||""),_?on(_):[]}}catch(a){console.warn("YAMP: MA Lyrics fetch failed:",a)}return[]}async _getLrclibLyrics(e,t,a,s,r){if(!e||!t)return[];const n=this._cleanTrackMetadata(e),o=this._cleanTrackMetadata(t),l=a?this._cleanTrackMetadata(a):"";try{const c={"User-Agent":"yet-another-media-player/2026.9.0-beta.1 (https://github.com/jianyu-li/yet-another-media-player)"};let d=`https://lrclib.net/api/get?artist_name=${encodeURIComponent(n)}&track_name=${encodeURIComponent(o)}`;l&&(d+=`&album_name=${encodeURIComponent(l)}`),s&&(d+=`&duration=${Math.round(s)}`);let h=await fetch(d,{headers:c});if(this._currentFetchToken!==r)return[];if(!h.ok&&h.status!==404)throw new Error(`LRCLIB error: ${h.status}`);let p=null;if(h.ok)p=await h.json();else{const _=`https://lrclib.net/api/search?artist_name=${encodeURIComponent(n)}&track_name=${encodeURIComponent(o)}`,m=await fetch(_,{headers:c});if(this._currentFetchToken!==r)return[];if(m.ok){const f=await m.json();f&&f.length>0&&(p=f[0])}}if(p){if(p.instrumental)return[{time:null,text:u("lyrics.instrumental")||"Instrumental Track"}];const _=p.syncedLyrics||p.plainLyrics||"";return _?on(_):[]}}catch(c){console.warn("YAMP: LRCLIB Lyrics fetch failed:",c)}return[]}updated(e){this._updateHostAttributes(),this._idleImageTemplate&&e.has("hass")&&(this._idleImageTemplateNeedsResolve=!0);const t=JSON.stringify(this._getTemplateContext());if(this._syncTemplateSubscriptions("action_in_menu",t,this.config?.actions),this._syncTemplateSubscriptions("always_collapsed",t,this.config?.always_collapsed),this._syncTemplateSubscriptions("control_layout",t,this.config?.control_layout),this._syncTemplateSubscriptions("card_height",t,this.config?.card_height),this._syncEntityTemplateSubscriptions("ma",t),this._syncEntityTemplateSubscriptions("vol",t),this._syncEntityTemplateSubscriptions("hidden_controls",t),e.has("_selectedIndex")&&(this._lastMediaTitle=null,this._searchResultsByType={},this._upcomingFilterActive&&(this._searchResults=[],this._refreshQueue({delayMs:50}))),(e.has("_selectedIndex")||e.has("hass"))&&this._updateTransferQueueAvailability({refresh:!1}),(e.has("hass")||e.has("config"))&&this._updateArtworkAspectRatios(),this.hass&&this._hasMassQueueIntegration===null&&!this._checkingMassQueueIntegration&&(this._checkingMassQueueIntegration=!0,this._isMassQueueIntegrationAvailable(this.hass).then(r=>{this._hasMassQueueIntegration=r,r&&(this._massQueueAvailable=this._massQueueAvailable||r)}).catch(()=>{this._hasMassQueueIntegration=!1}).finally(()=>{this._checkingMassQueueIntegration=!1,this.requestUpdate()})),this.hass&&this.entityIds){if(this._upcomingFilterActive){const l=this._getEntityForPurpose(this._selectedIndex,"metadata");if(l){const c=this.hass.states[l]?.attributes?.media_title;if(c&&c!==this._lastMediaTitle){const d=e.has("_selectedIndex");if(this._lastMediaTitle=c,this._upcomingFilterActive&&!d){const h=Date.now();this._latestManualShiftTime&&h-this._latestManualShiftTime<4e3||this._advanceQueueInUI(null,!1),this._refreshQueue({delayMs:2e4})}}}}const r=Date.now();for(let l=0;l<this.entityIds.length;l++){const c=this.entityIds[l],d=this.entityObjs[l];if(!d)continue;const h=d.entity_id,p=this._getActualResolvedMaEntityForState(l),_=this.hass.states[h]?.state,m=this._playerStateCache[h];if(_==="playing"?(this._playTimestamps[h]=r,this._lastActiveEntityIdByChip[l]=h):m==="playing"&&_!=="playing"&&(this._playTimestamps[h]=r),this._playerStateCache[h]=_,p&&p!==h){const y=this.hass.states[p]?.state,b=this._playerStateCache[p];y==="playing"?(this._playTimestamps[p]=r,this._lastActiveEntityIdByChip[l]=p):b==="playing"&&y!=="playing"&&(this._playTimestamps[p]=r),this._playerStateCache[p]=y}const f=this._getEntityForPurpose(l,"sorting");f&&this.hass.states[f]?.state==="playing"&&(this._playTimestamps[c]=r)}if(this._manualSelect&&this._pinnedIndex===null&&this._manualSelectPlayingSet){for(const l of[...this._manualSelectPlayingSet]){const c=this.hass.states[l];this._isEntityPlaying(c)||this._manualSelectPlayingSet.delete(l)}for(const l of this.entityIds){const c=this.hass.states[l];if(this._isEntityPlaying(c)&&!this._manualSelectPlayingSet.has(l)){this._manualSelect=!1,this._manualSelectPlayingSet=null;break}}}if(this._updateIdleState(e),!this._manualSelect&&!this.isAnyMenuOpen){const l=this.sortedEntityIds;if(l.length>0){let c=l[0];const d=c?(this.groupedSortedEntityIds||[]).find(b=>b.includes(c)):null;if(d&&d.length>1){const b=this._getActualGroupMaster(d);b&&(c=b)}const h=this.entityIds.indexOf(c),p=h>=0?this._getEntityForPurpose(h,"sorting"):null,_=p?this.hass.states[p]:null,m=this._isCurrentEntityPlaying(),f=this.entityObjs[this._selectedIndex]?.disable_auto_select,y=m&&!f;(this._isEntityPlaying(_)||f)&&this.entityIds[this._selectedIndex]!==c&&(!this._idleTimeout||!this._hasSeenPlayback)&&!y&&!this.entityObjs[h]?.disable_auto_select&&(this._selectedIndex=h)}}const n=this.entityIds[this._selectedIndex],o=n?(this.groupedSortedEntityIds||[]).find(l=>l.includes(n)):null;if(o&&o.length>1){const l=this._getActualGroupMaster(o);if(l&&l!==n){const c=this.entityIds.indexOf(l);c>=0&&!this.entityObjs[c]?.disable_auto_select&&(this._selectedIndex=c,this._lastGroupingMasterId=l)}}this._ensureResolvedMaForIndex(this._selectedIndex),this._ensureResolvedVolForIndex(this._selectedIndex),this._ensureResolvedHiddenControlsForIndex(this._selectedIndex),this._updateSelectedEntityHelper(),this._handleSelectEntityFromHelper()}if(this._handleVolumeOverlayDetection(e),this._lyricsActive){const r=this.metadataStateObj||this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj,n=r?.attributes?.media_content_id||null,o=r?.attributes?.media_artist||null,l=r?.attributes?.media_title||null,c=this.currentActivePlaybackEntityId||this.currentEntityId||null,d=!!(n||o||l),h=n!==this._lastLyricsTrackId||o!==this._lastLyricsArtist||l!==this._lastLyricsTitle||c!==this._lastLyricsEntityId;d&&h&&!this._isIdle&&!this.isAnyMenuOpen?(this._lastLyricsTrackId=n,this._lastLyricsArtist=o,this._lastLyricsTitle=l,this._lastLyricsEntityId=c,this._fetchingLyrics=!0,this._lyricsError=!1,this._lyricsFetchTimeout&&clearTimeout(this._lyricsFetchTimeout),this._lyricsFetchTimeout=setTimeout(()=>{this._fetchLyrics(),this._lyricsFetchTimeout=null},500)):!d&&h&&(this._lastLyricsTrackId=null,this._lastLyricsArtist=null,this._lastLyricsTitle=null,this._lastLyricsEntityId=c,this._lyricsFetchTimeout&&clearTimeout(this._lyricsFetchTimeout),this._massLyrics=[],this._fetchingLyrics=!1,this._lyricsError=!1,this.requestUpdate())}super.updated?.(e),this._progressTimer&&(clearInterval(this._progressTimer),this._progressTimer=null);const a=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;if(this._isEntityPlaying(a)&&a.attributes.media_duration&&(this._progressTimer=setInterval(()=>{this.requestUpdate()},500)),this._alwaysCollapsed&&this._expandOnSearch&&this._showSearchInSheet){this._prevCollapsed!==!1&&(this._prevCollapsed=!1,this._notifyResize());return}const s=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1;if(this._prevCollapsed!==s&&(this._prevCollapsed=s,this._notifyResize()),this._addGrabScroll(".chip-row"),this._addGrabScroll(".action-chip-row"),this._addGrabScroll(".search-filter-chips"),this._addVerticalGrabScroll(".floating-source-index"),this._lastRenderedCollapsed&&!this._lastRenderedHideControls){const r=this.renderRoot?.querySelector(".card-lower-content");if(r){const n=r.offsetHeight;if(n&&n>0){const o=typeof this.config?.card_height=="string"&&(this.config.card_height.includes("{{")||this.config.card_height.includes("{%")||this.config.card_height.trim().startsWith("[[["))?this._cardHeightResolveCache?.card?.value:this.config?.card_height,l=Number(o);Number.isFinite(l)&&l>0?(!this._collapsedBaselineHeight||n<this._collapsedBaselineHeight-1)&&(this._collapsedBaselineHeight=n):this._collapsedBaselineHeight=n}}}if(this._showSearchInSheet){const r=this._alwaysCollapsed&&this._expandOnSearch?300:200;setTimeout(()=>{const n=()=>{const c=this.renderRoot.querySelector("#search-input-box");return c?(c.focus(),this._searchInputAutoFocused=!0,!0):!1};!this._disableSearchAutofocus&&!this._searchInputAutoFocused&&(n()||setTimeout(()=>{this._showSearchInSheet&&!this._disableSearchAutofocus&&!this._searchInputAutoFocused&&n()},200));const o=this._getVisibleSearchFilterClasses().join(",");if((!this._searchLoading||o)&&this._lastSearchChipClasses!==o){const c=this.renderRoot.querySelector(".search-filter-chips");c&&(c.scrollLeft=0);const d=this.renderRoot.querySelector(".entity-options-overlay");d&&(d.scrollTop=0);const h=this.renderRoot.querySelector(".entity-options-sheet");h&&(h.scrollTop=0),this._lastSearchChipClasses=o}const l=this.renderRoot.querySelector("#search-filter-chip-row");l&&(l.scrollWidth>l.clientWidth+2?l.style.justifyContent="flex-start":l.style.justifyContent="center")},r)}this._showSourceList&&setTimeout(()=>{const r=this.renderRoot.querySelector(".entity-options-overlay");r&&(r.scrollTop=0)},0)}_toggleSourceMenu(){this._showSourceMenu=!this._showSourceMenu,this._showSourceMenu?(this._manualSelect=!0,setTimeout(()=>{this._shouldDropdownOpenUp=!0,this.requestUpdate(),this._addSourceDropdownOutsideHandler()},0)):(this._manualSelect=!1,this._removeSourceDropdownOutsideHandler())}_addSourceDropdownOutsideHandler(){this._sourceDropdownOutsideHandler||(this._sourceDropdownOutsideHandler=e=>{const t=this.renderRoot.querySelector(".source-dropdown"),a=this.renderRoot.querySelector(".source-menu-btn"),s=e.composedPath?e.composedPath():[];t&&s.includes(t)||a&&s.includes(a)||(this._showSourceMenu=!1,this._manualSelect=!1,this._removeSourceDropdownOutsideHandler(),this.requestUpdate())},window.addEventListener("mousedown",this._sourceDropdownOutsideHandler,!0),window.addEventListener("touchstart",this._sourceDropdownOutsideHandler,!0))}_removeSourceDropdownOutsideHandler(){this._sourceDropdownOutsideHandler&&(window.removeEventListener("mousedown",this._sourceDropdownOutsideHandler,!0),window.removeEventListener("touchstart",this._sourceDropdownOutsideHandler,!0),this._sourceDropdownOutsideHandler=null)}_selectSource(e){const t=this.currentEntityId;!t||!e||(this.hass.callService("media_player","select_source",{entity_id:t,source:e}),this._closeEntityOptions())}_onPinClick(e){e.stopPropagation(),this._manualSelect=!1,this._pinnedIndex=null,this._manualSelectPlayingSet=null}_onChipClick(e){if(this._holdToPin&&this._justPinned){this._justPinned=!1;return}if(this._selectedIndex=e,this._isIdle){const t=this.entityIds[e],a=this._getEntityForPurpose(e,"sorting"),s=this.hass?.states?.[a]||this.hass?.states?.[t];this._isEntityPlaying(s)&&(this._setIdleState(!1),this._hasSeenPlayback=!0,this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),this._resetIdleScreen())}if(this._lastActiveEntityId=null,clearTimeout(this._manualSelectTimeout),this._holdToPin)if(this._pinnedIndex!==null)this._manualSelect=!0;else{this._manualSelect=!0,this._manualSelectPlayingSet=new Set;for(const t of this.entityIds){const a=this.hass?.states?.[t];this._isEntityPlaying(a)&&this._manualSelectPlayingSet.add(t)}}else this._manualSelect=!0,this._pinnedIndex=e;this.requestUpdate()}_pinChip(e){this._justPinned=!0,clearTimeout(this._manualSelectTimeout),this._manualSelectPlayingSet=null,this._pinnedIndex=e,this._manualSelect=!0,this.requestUpdate()}async _onActionChipClick(e){const t=this.config.actions[e];t&&await this._handleAction(t)}async _handleAction(e){if(!e)return;if(e.menu_item){switch(this._quickMenuInvoke=!0,e.menu_item){case"more-info":this._openMoreInfo(),this._showEntityOptions=!1,this.requestUpdate();break;case"group-players":this._showEntityOptions=!0,this._showGrouping=!0,this.requestUpdate();break;case"search":this._openQuickSearchOverlay();break;case"search-recently-played":this._showEntityOptions=!0,this._showSearchSheetInOptions("recently-played"),setTimeout(()=>{this._notifyResize()},0);break;case"search-next-up":this._showEntityOptions=!0,this._showSearchSheetInOptions("next-up"),setTimeout(()=>{this._notifyResize()},0);break;case"source":this._showEntityOptions=!0,this._showSourceList=!0,this._showGrouping=!1,this.requestUpdate();break;case"transfer-queue":this._showEntityOptions=!0,this._openTransferQueue();break;case"main-menu":this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._showTransferQueue=!1,await this._openEntityOptions();break}return}if(typeof e.navigation_path=="string"&&e.navigation_path.trim()!==""||e.action==="navigate"){let r=(typeof e.navigation_path=="string"?e.navigation_path:e.path||"").trim();const n=e.navigation_new_tab===!0,o=this._getTemplateContext();let l=null;n&&(l=ni(this.hass,r,o)),l!=null?this._handleNavigate(l,n):(r=await Ga(this.hass,r,o),this._handleNavigate(r,n));return}if(e.action==="toggle_lyrics"){this._lyricsActive=!this._lyricsActive,this.requestUpdate();return}if(e.action==="remote_control"){this._openRemoteControl();return}if(e.action==="prev_entity"||e.action==="next_entity"){const r=this.sortedEntityIds;if(r&&r.length>0){const n=this.entityIds[this._selectedIndex],o=r.indexOf(n);if(o!==-1){let l;if(e.action==="prev_entity"?l=Math.max(0,o-1):l=Math.min(r.length-1,o+1),l!==o){const c=r[l],d=this.entityIds.indexOf(c);d!==-1&&d!==this._selectedIndex&&this._onChipClick(d)}}}return}if(!e.service)return;const[t,a]=e.service.split(".");let s={...e.service_data||{}};if(t==="script"&&e.script_variable===!0){const r=this.currentEntityId,n=this._getSearchEntityId(this._selectedIndex),o=await this._resolveTemplateAtActionTime(n,r),l=this.currentActivePlaybackEntityId||this._getPlaybackEntityId(this._selectedIndex),c=await this._resolveTemplateAtActionTime(l,r);(s.entity_id==="current"||s.entity_id==="$current"||s.entity_id==="this")&&delete s.entity_id,s.yamp_entity=o||r,s.yamp_main_entity=r,s.yamp_playback_entity=c}else if(!(t==="script"&&e.script_variable===!0)&&(s.entity_id==="current"||s.entity_id==="$current"||s.entity_id==="this"||!s.entity_id))if(t==="music_assistant"){const r=this._getSearchEntityId(this._selectedIndex);s.entity_id=await this._resolveTemplateAtActionTime(r,this.currentEntityId)}else if(t==="media_player"){const r=this.currentActivePlaybackEntityId||this._getPlaybackEntityId(this._selectedIndex);s.entity_id=await this._resolveTemplateAtActionTime(r,this.currentEntityId)}else s.entity_id=this.currentEntityId;this.hass.callService(t,a,s)}_onTapAreaPointerDown(e){this.isAnyMenuOpen||e.composedPath().some(t=>t.tagName==="BUTTON"||t.tagName==="HA-ICON"||t.tagName==="INPUT"||t.classList&&t.classList.contains("clickable-artist")||t.classList&&t.classList.contains("details")&&!this._isIdle)||(this._gestureActive=!0,this._gestureStartTime=Date.now(),this._gestureStartX=e.clientX,this._gestureStartY=e.clientY,this._gestureHoldTriggered=!1,this._gestureTapArea=e.currentTarget,this._cardTriggers?.hold&&(this._gestureHoldTimer=setTimeout(()=>{this._gestureActive&&(this._gestureHoldTriggered=!0,this._showGestureFeedback("hold",this._gestureStartX,this._gestureStartY),this._handleAction(this._cardTriggers.hold))},Io)))}_onTapAreaPointerMove(e){if(this.isAnyMenuOpen||!this._gestureActive)return;const t=Math.abs(e.clientX-this._gestureStartX),a=Math.abs(e.clientY-this._gestureStartY);(t>Bt||a>Bt)&&clearTimeout(this._gestureHoldTimer)}_onTapAreaPointerUp(e){if(this.isAnyMenuOpen||!this._gestureActive||(this._gestureActive=!1,clearTimeout(this._gestureHoldTimer),this._gestureHoldTriggered)||Date.now()-this._gestureStartTime>Io)return;const t=e.clientX-this._gestureStartX,a=e.clientY-this._gestureStartY,s=Math.abs(t),r=Math.abs(a);if(s>=Mo&&r<Mo){clearTimeout(this._tapTimer);const d=e.clientX,h=e.clientY;if(t<0&&this._cardTriggers?.swipe_left){this._showGestureFeedback("swipe_left",d,h),this._handleAction(this._cardTriggers.swipe_left);return}else if(t>0&&this._cardTriggers?.swipe_right){this._showGestureFeedback("swipe_right",d,h),this._handleAction(this._cardTriggers.swipe_right);return}}if(s>Bt||r>Bt)return;const n=Date.now(),o=n-(this._lastTapTime||0);this._lastTapTime=n;const l=e.clientX,c=e.clientY;o<To?(clearTimeout(this._tapTimer),this._cardTriggers?.double_tap&&(this._showGestureFeedback("double_tap",l,c),this._handleAction(this._cardTriggers.double_tap))):this._tapTimer=setTimeout(()=>{this._cardTriggers?.tap&&(this._showGestureFeedback("tap",l,c),this._handleAction(this._cardTriggers.tap))},lp)}_onTapAreaPointerCancel(e){this._gestureActive=!1,clearTimeout(this._gestureHoldTimer)}_onIdleTapAreaPointerDown(e){this._isIdle&&this._onTapAreaPointerDown(e)}_onIdleTapAreaPointerMove(e){this._isIdle&&this._onTapAreaPointerMove(e)}_onIdleTapAreaPointerUp(e){this._isIdle&&this._onTapAreaPointerUp(e)}_onIdleTapAreaPointerCancel(e){this._isIdle&&this._onTapAreaPointerCancel(e)}_hasGestureTriggers(){return!!(this._cardTriggers?.tap||this._cardTriggers?.hold||this._cardTriggers?.double_tap||this._cardTriggers?.swipe_left||this._cardTriggers?.swipe_right)}_getGestureStyles(e=!0){return e&&this._hasGestureTriggers()?"cursor:pointer; pointer-events:auto;":""}_showGestureFeedback(e,t,a){const s=this._gestureTapArea||this.shadowRoot?.querySelector(".card-artwork-spacer")||this.shadowRoot?.querySelector(".collapsed-artwork-container")||this.shadowRoot?.querySelector(".media-artwork-placeholder");if(!s)return;const r=s.getBoundingClientRect(),n=t-r.left,o=a-r.top,l=document.createElement("div");l.className=`gesture-ripple ${e}`,l.style.left=`${n}px`,l.style.top=`${o}px`;let c=s.querySelector(".gesture-feedback-container");c||(c=document.createElement("div"),c.className="gesture-feedback-container",s.appendChild(c)),l.addEventListener("animationend",()=>l.remove()),c.appendChild(l)}_onMenuActionClick(e){const t=this.config.actions?.[e];t&&(t.menu_item||(this._quickMenuInvoke=!0),this._onActionChipClick(e),t.menu_item||this._dismissWithAnimation())}_getActionLabel(e){if(!e)return"";if(typeof e.name=="string"&&e.name.trim()!=="")return e.name.trim();const t=!!e.icon;return e.menu_item?t?"":{search:u("card.menu.search"),"search-recently-played":u("search.recently_played"),"search-next-up":u("search.next_up"),source:u("card.menu.source"),"more-info":u("card.menu.more_info"),"group-players":u("card.menu.group_players"),"transfer-queue":u("card.menu.transfer_queue"),"main-menu":u("card.menu.main_menu")}[e.menu_item]??e.menu_item:typeof e.navigation_path=="string"&&e.navigation_path.trim()!==""||e.action==="navigate"?t?"":"Navigate":e.service?t?"":e.service:t?"":"Action"}async _onControlClick(e){const t=this._getEntityForPurpose(this._selectedIndex,"playback_control");if(!t)return;const a=this.hass?.states?.[t]||this.currentStateObj;switch(e){case"play_pause":this._isEntityPlaying(a)?(this.hass.callService("media_player","media_pause",{entity_id:t}),this._lastPlayingEntityIdByChip||(this._lastPlayingEntityIdByChip={}),this._lastPlayingEntityIdByChip[this._selectedIndex]=t,this._pauseTimestamps||(this._pauseTimestamps={}),this._pauseTimestamps[this._selectedIndex]=Date.now(),this._controlFocusEntityId=t,this._optimisticPlayback={entity_id:t,state:"paused",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200)):(this.hass.callService("media_player","media_play",{entity_id:t}),this._lastPlayingEntityIdByChip&&delete this._lastPlayingEntityIdByChip[this._selectedIndex],this._pauseTimestamps&&delete this._pauseTimestamps[this._selectedIndex],this._controlFocusEntityId=t,this._optimisticPlayback={entity_id:t,state:"playing",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200));break;case"next":this._advanceQueueInUI(null,!0),this.hass.callService("media_player","media_next_track",{entity_id:t});break;case"prev":this.hass.callService("media_player","media_previous_track",{entity_id:t});break;case"stop":if(this.hass.callService("media_player","media_stop",{entity_id:t}),a){const s=t;this._optimisticPlayback={entity_id:s,state:"idle",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200)}break;case"shuffle":{const s=!!a.attributes.shuffle;this.hass.callService("media_player","shuffle_set",{entity_id:t,shuffle:!s});break}case"repeat":{let s=a.attributes.repeat||"off",r;s==="off"?r="all":s==="all"?r="one":r="off",this.hass.callService("media_player","repeat_set",{entity_id:t,repeat:r});break}case"power":{const s=this.currentEntityId,r=(this.hass?.states?.[s]||a)?.state==="off"?"turn_on":"turn_off";this.hass.callService("media_player",r,{entity_id:s});const n=this.entityObjs[this._selectedIndex];if(n&&n.sync_power){const o=this._getVolumeEntity(this._selectedIndex);o&&o!==n.entity_id&&this.hass.callService("media_player",r,{entity_id:o})}break}case"favorite":{const s=this._getFavoriteButtonEntity(),r=this.hass?.states?.[t]?.attributes?.media_content_id,n=this._isCurrentTrackFavorited(),o=await this._isMassQueueIntegrationAvailable(this.hass);if(n&&o){const l=this._getMusicAssistantState()?.entity_id;if(l)try{const c={type:"call_service",domain:"mass_queue",service:"unfavorite_current_item",service_data:{entity:l}};await this.hass.connection.sendMessagePromise(c),r&&(this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[r]={isFavorited:!1}),this._searchResultsByType&&Object.keys(this._searchResultsByType).forEach(d=>{(d.includes("_favorites")||d==="favorites")&&delete this._searchResultsByType[d]}),this._checkingFavorites=null,this.requestUpdate()}catch(c){console.error("yamp: Failed to unfavorite current item:",c)}}else s&&(this.hass.callService("button","press",{entity_id:s}),r&&(this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[r]={isFavorited:!0},this._checkingFavorites=null,this._searchResultsByType&&Object.keys(this._searchResultsByType).forEach(l=>{(l.includes("_favorites")||l==="favorites")&&delete this._searchResultsByType[l]}),this.requestUpdate()));break}}}_onVolumeChange(e){this._suppressVolumeOverlay();const t=this._selectedIndex,a=this._getGroupingEntityId(t)||this.currentEntityId,s=this.hass.states[a],r=Number(e.target.value),n=this.entityObjs[t],o=typeof n.group_volume=="boolean"?n.group_volume:!0,l=this._isActiveChipGrouped(t);if(!o||!l){this.hass.callService("media_player","volume_set",{entity_id:this._getVolumeEntity(t),volume_level:r});return}if(this._isCurrentlyGrouped(s)){const c=this.entityObjs[t].entity_id,d=[...new Set([c,...s.attributes.group_members])],h=typeof this._groupBaseVolume=="number"?this._groupBaseVolume:Number(this.currentVolumeStateObj?.attributes.volume_level||0),p=r-h,_=new Set;for(const m of d){const f=this._resolveEntityIdxByGroupingId(m);if(f>=0&&f!==t){const E=this.entityObjs[f];if(E&&E.group_volume===!1)continue}const y=f>=0?this._getVolumeEntity(f):m;if(_.has(y))continue;_.add(y);const b=this.hass.states[y];if(!b)continue;let k=Number(b.attributes.volume_level||0)+p;k=Math.max(0,Math.min(1,k)),k=Math.round(k*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:y,volume_level:k})}this._groupBaseVolume=r}else{const c=this._getVolumeEntity(t);this.hass.callService("media_player","volume_set",{entity_id:c,volume_level:r})}}_onVolumeStep(e){this._suppressVolumeOverlay();const t=this._selectedIndex,a=this._getVolumeEntity(t);if(!a)return;const s=a.startsWith&&a.startsWith("remote."),r=this.currentVolumeStateObj;if(!r)return;if(s){this.hass.callService("remote","send_command",{entity_id:a,command:e>0?"volume_up":"volume_down"});return}const n=this._getGroupingEntityId(t)||this.currentEntityId,o=this.hass.states[n],l=this.entityObjs[t],c=typeof l.group_volume=="boolean"?l.group_volume:!0,d=this._isActiveChipGrouped(t);if(c&&d&&this._isCurrentlyGrouped(o)){const h=this.entityObjs[t].entity_id,p=[...new Set([h,...o.attributes.group_members])],_=this._getEffectiveVolumeStep()*e,m=new Set;for(const f of p){const y=this._resolveEntityIdxByGroupingId(f);if(y>=0&&y!==t){const w=this.entityObjs[y];if(w&&w.group_volume===!1)continue}const b=y>=0?this._getVolumeEntity(y):f;if(m.has(b))continue;m.add(b);const k=this.hass.states[b];if(!k)continue;let E=Number(k.attributes.volume_level||0)+_;E=Math.max(0,Math.min(1,E)),E=Math.round(E*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:b,volume_level:E})}}else{let h=Number(r.attributes.volume_level||0);h+=this._getEffectiveVolumeStep()*e,h=Math.max(0,Math.min(1,h)),h=Math.round(h*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:a,volume_level:h})}}_onMuteToggle(){this._suppressVolumeOverlay();const e=this._selectedIndex,t=this._getVolumeEntity(e);if(!t)return;const a=t.startsWith&&t.startsWith("remote."),s=this.currentVolumeStateObj;if(!s)return;const r=s.attributes.is_volume_muted??!1,n=s.attributes.volume_level??0;if(a){r?this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:.5}):this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:0});return}if(!this._supportsFeature(s,Ua)){if(n>0)this._previousVolume=n,this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:0});else{const p=this._previousVolume??.5;this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:p}),this._previousVolume=null}return}const o=this._getGroupingEntityId(e)||this.currentEntityId,l=this.hass.states[o],c=this.entityObjs[e],d=typeof c.group_volume=="boolean"?c.group_volume:!0,h=this._isActiveChipGrouped(e);if(d&&h&&this._isCurrentlyGrouped(l)){const p=this.entityObjs[e].entity_id,_=[...new Set([p,...l.attributes.group_members])],m=new Set;for(const f of _){const y=this._resolveEntityIdxByGroupingId(f);if(y>=0&&y!==e){const E=this.entityObjs[y];if(E&&E.group_volume===!1)continue}const b=y>=0?this._getVolumeEntity(y):f;if(m.has(b))continue;m.add(b);const k=this.hass.states[b];k&&this._supportsFeature(k,Ua)?this.hass.callService("media_player","volume_mute",{entity_id:b,is_volume_muted:!r}):(k?.attributes?.volume_level??0)>0?this.hass.callService("media_player","volume_set",{entity_id:b,volume_level:0}):this.hass.callService("media_player","volume_set",{entity_id:b,volume_level:.5})}}else this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!r})}_onVolumeDragStart(e,t="main"){if(!this.hass)return;const a=this.currentVolumeStateObj;this._groupBaseVolume=a?Number(a.attributes.volume_level||0):0,this._volumeDraggingEntity=t,this._dragVolume=Number(e.target.value)}_onVolumeDragEnd(e){this._groupBaseVolume=null,this._volumeDraggingEntity=null}_onVolumeInput(e){this._dragVolume=Number(e.target.value)}_handleVolumeOverlayDetection(e){if(this._showVolumeOverlay&&e.has("hass")&&this.hass&&!this.isAnyMenuOpen){const t=this._getVolumeEntity(this._selectedIndex),a=t?this.hass.states[t]:null,s=a?.attributes?.volume_level??null,r=a?.attributes?.is_volume_muted??!1;t!==this._lastTrackedVolEntityId?(this._lastTrackedVolumeLevel=s,this._lastTrackedVolEntityId=t):s!==null&&this._lastTrackedVolumeLevel!==null&&s!==this._lastTrackedVolumeLevel&&!this._internalVolumeChangeFlag&&!this._volumeDraggingEntity&&this._showVolumeOverlayBriefly(s,r),this._lastTrackedVolumeLevel=s}}_showVolumeOverlayBriefly(e,t){this._volumeOverlayValue=Math.round(e*100),this._volumeOverlayMuted=t,this._volumeOverlayActive=!0,this._volumeOverlayTimer&&clearTimeout(this._volumeOverlayTimer),this._volumeOverlayTimer=setTimeout(()=>{this._volumeOverlayActive=!1,this._volumeOverlayTimer=null,this.requestUpdate()},3e3),this.requestUpdate()}_suppressVolumeOverlay(){this._internalVolumeChangeFlag=!0,this._internalVolumeSuppressTimer&&clearTimeout(this._internalVolumeSuppressTimer),this._internalVolumeSuppressTimer=setTimeout(()=>{this._internalVolumeChangeFlag=!1,this._internalVolumeSuppressTimer=null},1500)}_getVolumeOverlayIcon(){return this._volumeOverlayMuted||this._volumeOverlayValue===0?"mdi:volume-off":this._volumeOverlayValue<20?"mdi:volume-low":this._volumeOverlayValue<50?"mdi:volume-medium":"mdi:volume-high"}_dismissVolumeOverlay(){this._volumeOverlayActive=!1,this._volumeOverlayTimer&&(clearTimeout(this._volumeOverlayTimer),this._volumeOverlayTimer=null),this.requestUpdate()}_onGroupVolumeChange(e,t,a){this._suppressVolumeOverlay();const s=Number(a.target.value);this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:s}),this.requestUpdate()}_onGroupVolumeStep(e,t){this._suppressVolumeOverlay(),this.hass.callService("remote","send_command",{entity_id:e,command:t>0?"volume_up":"volume_down"}),this.requestUpdate()}_onSourceChange(e){const t=this.currentEntityId,a=e.target.value;!t||!a||this.hass.callService("media_player","select_source",{entity_id:t,source:a})}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.currentEntityId},bubbles:!0,composed:!0}))}async _onProgressBarClick(e){try{e.stopPropagation();const t=this.currentEntityId,a=this._getActualResolvedMaEntityForState(this._selectedIndex),s=t?this.hass?.states?.[t]:null,r=a?this.hass?.states?.[a]:null;let n;if(this._controlFocusEntityId&&(this._controlFocusEntityId===a||this._controlFocusEntityId===t))n=this._controlFocusEntityId;else if(this._isEntityPlaying(r))n=a;else if(this._isEntityPlaying(s))n=t;else{const p=this._lastPlayingEntityIdByChip?.[this._selectedIndex];if(p&&(p===a||p===t))n=p;else{const _=this._getPlaybackEntityId(this._selectedIndex);n=await this._resolveTemplateAtActionTime(_,this.currentEntityId)}}const o=this.hass?.states?.[n]||this.currentStateObj;if(!n||!o||!o.attributes){console.warn("YAMP: Cannot seek - invalid target or state",n,o);return}const l=o.attributes.media_duration;if(!l)return;const c=e.target.getBoundingClientRect(),d=(e.clientX-c.left)/c.width,h=Math.floor(d*l);this._seekAnchor={position:h,timestamp:Date.now(),trackId:o.attributes.media_content_id||o.attributes.media_title},this._seekConvergenceLock=Date.now()+2e3,this._seekOffset=null,this.requestUpdate(),this.hass.callService("media_player","media_seek",{entity_id:n,seek_position:h})}catch(t){console.error("YAMP: Error in _onProgressBarClick",t)}}_resetSearchContext(){this._searchResultsByType={},this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this._loadingSearchRowMenuId=null,this._errorSearchRowMenuId=null}_showSearchSuccessToast(e=null,t=null){this._showQueueSuccessMessage=!0,e&&(this._successSearchRowMenuId=e),t&&(this._successSearchRowType=t),this.requestUpdate(),this._successToastHandle&&clearTimeout(this._successToastHandle),this._successToastHandle=setTimeout(()=>{this._showQueueSuccessMessage=!1,this._successSearchRowMenuId=null,this._successSearchRowType=null,this._successToastHandle=null,this.requestUpdate()},$o)}render(){if(!this.hass||!this.config)return v;const e=typeof this.config.card_height=="string"&&(this.config.card_height.includes("{{")||this.config.card_height.includes("{%")||this.config.card_height.trim().startsWith("[[["))?this._cardHeightResolveCache?.card?.value:this.config.card_height,t=typeof e=="string"&&e.includes("px")?parseFloat(e):Number(e),a=typeof t=="number"&&Number.isFinite(t)&&t>0||typeof t=="string"&&t.trim()!=="",s=this._collapsedBaselineHeight||220,r=this.entityObjs.length===1,n=r&&this._alwaysCollapsed&&this.config.expand_on_search!==!0,o=this.config.pin_search_headers===!0&&!n,l=!(this.config.hide_search_headers_on_idle===!0&&this._isIdle),c=this.config.show_chip_row||"auto",d=this.entityObjs.length>1,h=(c==="in_menu"||c==="in_menu_on_idle"&&this._isIdle)&&d,p=c!=="in_menu"&&(d||c==="always"),_=c==="in_menu_on_idle"&&this._isIdle&&d,m=c==="in_menu_on_idle"&&d&&!this._showSearchInSheet,f=(this.config.actions??[]).map((x,K)=>({action:x,idx:K})).filter(({action:x})=>x?.action!=="sync_selected_entity"&&x?.action!=="select_entity");let y=null;const b=(x,K)=>{if(x?.placement)return x.placement;let ae=x?.in_menu;if(typeof ae=="string"&&(ae.includes("{{")||ae.includes("{%")||ae.trim().startsWith("[[["))){const Pi=this._actionInMenuResolveCache?.[K]?.value;if(Pi!==void 0)ae=Pi;else{y||(y={...this._getTemplateContext(),state:this.hass?.states[this.currentEntityId]?.state||"unknown",attributes:this.hass?.states[this.currentEntityId]?.attributes||{}});const zi=ni(this.hass,ae,y);zi!==null&&(ae=zi)}}return typeof ae=="string"&&(ae=ae.trim()),ae==="true"&&(ae=!0),ae==="false"&&(ae=!1),ae==="hidden"?"hidden":ae===!0?"menu":"chip"},k=f.filter(({action:x,idx:K})=>b(x,K)==="chip"),E=f.filter(({action:x,idx:K})=>b(x,K)==="menu"),w=f.find(({action:x})=>x?.card_trigger==="tap"),P=f.find(({action:x})=>x?.card_trigger==="hold"),$=f.find(({action:x})=>x?.card_trigger==="double_tap"),C=f.find(({action:x})=>x?.card_trigger==="swipe_left"),N=f.find(({action:x})=>x?.card_trigger==="swipe_right");this._cardTriggers={tap:w?.action,hold:P?.action,double_tap:$?.action,swipe_left:C?.action,swipe_right:N?.action};const j=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj,F=this.getChipName(this.currentEntityId);if(!j)return g`<div class="details">${u("common.not_found")}</div>`;const I=this._getHiddenControlsForCurrentEntity(),O=!!this._getFavoriteButtonEntity()&&!I.favorite,R=this._isCurrentTrackFavorited(),D=!I.power&&(this._supportsFeature(j,Ha)||this._supportsFeature(j,Ba)),ne=this._controlLayout==="modern"&&D,J=this._controlLayout==="modern"&&O;let L=v;ne?L=g`
          <button
            class="volume-icon-btn favorite-volume-btn${j?.state!=="off"?" active":""}"
            @click=${()=>this._onControlClick("power")}
            title="${u("common.power")}"
          >
            <ha-icon .icon=${"mdi:power"}></ha-icon>
          </button>
        `:this._controlLayout==="modern"&&(L=g`
          <button
            class="volume-icon-btn favorite-volume-btn"
            @click=${()=>this._openQuickSearchOverlay()}
            title="${u("common.search")}"
          >
            <ha-icon .icon=${"mdi:magnify"}></ha-icon>
          </button>
        `);const oe=J?g`
        <button
          class="volume-icon-btn favorite-volume-btn${R?" active":""}"
          @click=${()=>this._onControlClick("favorite")}
          title="${u("common.favorite")}"
        >
          <ha-icon
            style=${R?"color: var(--custom-accent);":v}
            .icon=${R?"mdi:heart":"mdi:heart-outline"}
          ></ha-icon>
        </button>
      `:v,G=j.attributes.source_list||[],W=new Set(G.map(x=>x&&x[0]?x[0].toUpperCase():"")),Y="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");this._idleImageTemplate&&this._idleImageTemplateNeedsResolve&&!this._resolvingIdleImageTemplate&&this._isIdle&&this._resolveIdleImageTemplate();const X=typeof this.config.idle_image=="string"&&this.config.idle_image.trim().startsWith("[[[")?this._evaluateJsTemplate(this.config.idle_image):this._idleImageTemplate?this._idleImageTemplateResult:this.config.idle_image,ie=this._normalizeImageSourceValue(X),Ge=this._getEntityForPurpose(this._selectedIndex,"playback_control"),$e=this.hass?.states?.[Ge],bt=this._isEntityPlaying($e),ze=this.config.show_idle_artwork_when_not_playing===!0&&!bt&&ie;let ue=null;if(ie&&(this._isIdle||ze))if(this.hass.states[ie]){const x=this.hass.states[ie];ue=x.attributes.entity_picture_local||x.attributes.entity_picture||(x.state&&x.startsWith("http")?x.state:null)}else(ie.startsWith("http")||ie.startsWith("/"))&&(ue=ie);const Ys=!!ue,tt=this._idleTimeoutMs===0?!1:this._isIdle,Fo=this._idleTimeoutMs===0?!1:this._isIdle,Ro=this._artworkObjectFit==="scaled-contain"||this._artworkObjectFit==="scaled-contain-alternate",ka=this.config.extend_artwork===!0||_||Ro,Ks=this.currentStateObj,Gt=this._getActualResolvedMaEntityForState(this._selectedIndex),Oo=Gt?this.hass?.states?.[Gt]:null,Lo=this._lastMainState,Zs=this._lastMaState;this._lastMainState=Ks?.state,this._lastMaState=Oo?.state;const xe=this._selectedIndex;if(Zs==="playing"&&this._lastMaState!=="playing"){const x=Math.max(Number(this._idleTimeoutMs||this.config?.idle_timeout_ms||6e4),500);this._playbackLingerByIdx[xe]={entityId:Gt,until:Date.now()+x}}if(Zs==="playing"&&this._lastMaState==="paused"&&this._lastPlayingEntityIdByChip?.[xe]===Gt||Lo==="playing"&&this._lastMainState==="paused"&&this._lastPlayingEntityIdByChip?.[xe]===Ks?.entity_id){const x=this._lastPlayingEntityIdByChip[xe],K=Math.max(Number(this._idleTimeoutMs||this.config?.idle_timeout_ms||6e4),500);this._playbackLingerByIdx[xe]={entityId:x,until:Date.now()+K}}this._lastMaState==="playing"&&this._playbackLingerByIdx?.[xe]&&delete this._playbackLingerByIdx[xe];const qo=this.config.entities[xe]?.music_assistant_entity,No=this._getEntityForPurpose(xe,"ma_resolve"),Qt=this._lastPlayingEntityIdByChip?.[xe],Vo=this._maResolveCache?.[xe]?.id,Uo=!!(Qt&&(Qt===Vo||Qt===No||Qt===qo||Qt===Gt));this._lastMainState==="playing"&&this._playbackLingerByIdx?.[xe]&&!Uo&&delete this._playbackLingerByIdx[xe];const it=$e,Bo=!!it?.attributes?.shuffle,Ho=it?.attributes?.repeat&&it?.attributes?.repeat!=="off",Wt=this.metadataStateObj,Yt=this._idleTimeoutMs===0?this._isEntityPlaying($e):!this._isIdle&&this._isEntityPlaying($e),xt=this.currentStateObj,Go=this._getArtworkUrl(Wt,ze),Js=this._getArtworkUrl($e,ze),Xs=this._getArtworkUrl(xt,ze),$i=Wt?.attributes?.media_title||it?.attributes?.media_title||xt?.attributes?.media_title;let we=Go;$i&&(!we||!we.url)&&Js?.url&&$e?.attributes?.media_title===$i&&(we=Js),$i&&(!we||!we.url)&&Xs?.url&&xt?.attributes?.media_title===$i&&(we=Xs);const je=this._idleTimeoutMs===0?!0:Yt,Ce=Wt?.attributes?.media_title?Wt:it?.attributes?.media_title?it:xt?.attributes?.media_title?xt:Wt||it||xt,at=je&&Ce?.attributes?.media_title||"",er=je&&(Ce?.attributes?.media_artist||Ce?.attributes?.media_series_title||Ce?.attributes?.app_name)||"";this._lastTitleLength=at?at.length:0,this._adaptiveText&&this._updateAdaptiveTextScale(!0);let st=Ce?.attributes?.media_position||0;const Kt=Ce?.attributes?.media_duration||0;let Ci=st;if(Yt&&Ce){const x=Ce.attributes?.media_position_updated_at?Date.parse(Ce.attributes.media_position_updated_at):Ce.last_changed?Date.parse(Ce.last_changed):Date.now(),K=(Date.now()-x)/1e3;Ci+=K}const Qo=Ce?.attributes?.media_content_id||Ce?.attributes?.media_title,tr=Date.now();if(this._seekAnchor&&this._seekAnchor.trackId===Qo){let x=this._seekAnchor.position;Yt&&(x+=(tr-this._seekAnchor.timestamp)/1e3);const K=this._seekConvergenceLock&&tr<this._seekConvergenceLock,ae=Math.abs(Ci-x);!K&&ae<2?(this._seekAnchor=null,this._seekConvergenceLock=null,st=Ci):st=x}else this._seekAnchor=null,this._seekConvergenceLock=null,st=Ci;const ir=Kt?Math.min(1,st/Kt):0,Ea=this._getVolumeEntity(xe),Wo=Ea&&Ea.startsWith&&Ea.startsWith("remote."),Yo=Number(this.currentVolumeStateObj?.attributes.volume_level||0),Ko=this._getEffectiveVolumeMode()!=="stepper";let Q;this._alwaysCollapsed&&this._expandOnSearch&&this._showSearchInSheet?Q=!1:Q=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1;const Sa=Q&&this._alwaysCollapsed&&a?t-s:0,Zo=Q&&p?48:0,Jo=Q&&k.length>0?40:0,ar=Zo+Jo,Xo=a?Math.max(100,t-ar):this._collapsedBaselineHeight||220;let ke=Math.round(Xo*.48);this.config.hide_collapsed_artwork===!0&&(ke=0);const el=this.offsetWidth||0;if(a&&ke>0)if(t<230)ke=0;else{const x=this._getMaxCollapsedArtworkWidth(el);ke=Math.max(40,Math.min(x,ke)),t>=320&&(ke=Math.max(102,ke))}else!a&&ke>0&&(ke=102);const Zt=Math.max(-60,Sa-ar),Aa=48,tl=Zt>0?Math.min(Zt*.45,96):0,il=Zt>0?Math.round(Aa+tl):Zt<-20?36:Aa,al=this._adaptiveTextTargets?.has("details")&&this._currentDetailsScale||1,sl=Math.round((Q?il:Aa)*al);let $a;const sr=350,rl=(Q?a?t:this._collapsedBaselineHeight||220:sr)>=sr,rr=this.config.hide_menu_player===!0?!1:!Q||rl,Ca=a&&t<280,Ii=a&&t<320&&!this._alwaysCollapsed,Ia=tt||this._showEntityOptions||Ii;let le=null,Ti=null,Ta=this._artworkObjectFit,Mi;if(!this._isIdle&&!ze){const x=we;le=x?.url||null,Ti=x?.sizePercentage,x?.objectFit&&(Ta=x.objectFit),x?.objectPosition&&(Mi=x.objectPosition)}else we?.objectFit&&(Ta=we.objectFit),we?.objectPosition&&(Mi=we.objectPosition),we?.sizePercentage!==void 0&&(Ti=we.sizePercentage);$a=Q&&!le&&!ue&&Zt>=40,Q&&le&&le!==this._lastArtworkUrl&&(this._extractDominantColor(le).then(x=>{this._collapsedArtDominantColor=x,this.requestUpdate()}),this._lastArtworkUrl=le);const nr=tt?Q?this._collapsedBaselineHeight||220:325:null;this._lastRenderedCollapsed=Q,this._lastRenderedHideControls=tt;const Qe=Ta||this._artworkObjectFit,Jt=Qe==="scaled-contain-alternate",wt=(Qe==="scaled-contain"||Jt)&&!Q&&!this._alwaysCollapsed,nl=wt&&le||!wt&&!le&&!ue||this._lyricsActive&&!this._isIdle,ol=(Qe==="scaled-contain"||Jt)&&(c==="in_menu"||r&&c!=="always");let or=this._getBackgroundSizeForFit(Qe);Ti&&(or=`${Ti}%`);const lr=Qe==="no_artwork"?"none":ue||Jt?ue?`url('${ue}')`:"none":le?`url('${le}')`:"none",cr=lr!=="none",ll=le&&(this.config.blurred_artwork===!0||this.config.blurred_artwork!==!1&&(Q||wt&&Qe==="scaled-contain"))?"blur(18px) brightness(0.7) saturate(1.15)":"none";let rt=(typeof Mi<"u"?Mi:null)||this.config.artwork_position||"top center";ka&&(rt==="top center"||rt==="center top"?rt="center 50px":(rt==="bottom center"||rt==="center bottom")&&(rt="center calc(100% - 50px)"));const dr=[`background-image: ${lr}`,`background-size: ${wt?"cover":or}`,`background-position: ${rt}`,"background-repeat: no-repeat",`filter: ${ll}`].join("; "),ur=tt||this._getEffectiveVolumeMode()==="hidden"||Ii||a&&t<260&&Q,cl=Ia||ur,dl=this._controlLayout==="modern",hr=ur&&!Ii&&!(L!==v&&L!==void 0&&L!==null)&&!dl,ul=this._adaptiveTextTargets?.has("details");return this._lastSpacerRendered=!!($a||!Q&&(!ul||nl)),this._lastVolumeRendered=!hr,g`
        <ha-card class="yamp-card" 
          style=${a&&(!Q||this._alwaysCollapsed)?`height:${t}px;`:v}>
          <div
            data-match-theme="${String(this.config.match_theme===!0)}"
            data-artwork-fit="${Qe}"
            class=${Mr({"yamp-card-inner":!0,"compact-collapsed":Ca&&Q,"dim-idle":Fo,"no-chip-dim":this.config.dim_chips_on_idle===!1,collapsed:Q})}
          >
            ${ka&&cr?g`
              <div class="full-bleed-artwork-bg" style="${dr}"></div>
              ${Ys||Jt||this._isIdle?v:g`<div class="full-bleed-artwork-fade"></div>`}
            `:v}
            ${!wt&&!le&&!ue?g`
              <div class="media-artwork-placeholder"
                @pointerdown=${this._onTapAreaPointerDown}
                @pointermove=${this._onTapAreaPointerMove}
                @pointerup=${this._onTapAreaPointerUp}
                @pointercancel=${this._onTapAreaPointerCancel}
                style="${this._getGestureStyles()}"
              >
                <svg
                  viewBox="0 0 184 184"
                  style="${this.config.match_theme===!0?"color:#fff;":"color: var(--custom-accent, #ff9800);"}"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"></rect>
                  <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"></rect>
                  <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"></rect>
                  <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"></rect>
                </svg>
              </div>
            `:v}
            ${_?g`${this._renderInlineActionRow(k)}${this._renderInlineChipRow(p,_)}`:g`${this._renderInlineChipRow(p,_)}${this._renderInlineActionRow(k)}`}
            ${this._volumeOverlayActive?g`
              <div class="volume-overlay" @click=${()=>this._dismissVolumeOverlay()}>
                <ha-icon icon=${this._getVolumeOverlayIcon()}></ha-icon>
                <span class="volume-overlay-text">${this._volumeOverlayValue}%</span>
              </div>
            `:v}
            <div class="card-lower-content-container" style="${nr?`min-height:${nr}px;`:""}">
              <div class="card-lower-content-bg"
                style="${(()=>{const x=[];return ka&&cr?x.push("background-image: none","filter: none"):x.push(dr),x.push(`min-height: ${Q?tt?`${this._collapsedBaselineHeight||220}px`:"0px":a?`${t}px`:"350px"}`),x.push("transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s"),x.join("; ")})()}"
              ></div>
              ${Ys||Jt||this._isIdle?v:g`<div class="card-lower-fade"></div>`}
              <div class="card-lower-content${Q?" collapsed transitioning":" transitioning"}${Q&&le&&ke>0?" has-artwork":""}" style="${tt?Q?`min-height: ${this._collapsedBaselineHeight||220}px;`:`min-height: ${a?`${t}px`:"350px"};`:""}">
                ${Q&&le&&ke>0&&oi(le)?g`
                  <div
                    class="collapsed-artwork-container"
                    @pointerdown=${this._onTapAreaPointerDown}
                    @pointermove=${this._onTapAreaPointerMove}
                    @pointerup=${this._onTapAreaPointerUp}
                    @pointercancel=${this._onTapAreaPointerCancel}
                    style="${[`background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%)`,Sa>0?`width:${Math.round(ke+8)}px`:"",Ca&&Q?"top: -2px; height: auto !important; overflow: visible !important;":"",this._getGestureStyles()].filter(Boolean).join("; ")}"
                  >
                    <img
                      class="collapsed-artwork"
                      src="${le}" 
                      style="${[this._getCollapsedArtworkStyle(),Sa>0?`width:${Math.round(ke)}px; height:${Math.round(ke)}px;`:""].filter(Boolean).join(" ")}" 
                      onload="this.style.display='block'"
                      onerror="this.style.display='none'" />
                  </div>
                `:v}
                ${this._lastSpacerRendered?g`
                  <div class="card-artwork-spacer${$a?" show-placeholder":""}"
                    @pointerdown=${this._onTapAreaPointerDown}
                    @pointermove=${this._onTapAreaPointerMove}
                    @pointerup=${this._onTapAreaPointerUp}
                    @pointercancel=${this._onTapAreaPointerCancel}
                    style="${this._getGestureStyles()}"
                  >
                    ${wt&&le?g`
                      <div style="position: absolute; ${ol?"top: 20px; right: 0; bottom: 0; left: 0;":"inset: 0;"} display: flex; align-items: center; justify-content: center; pointer-events: none; box-sizing: border-box; padding: 0 5px;">
                        <img 
                          class="inset-artwork"
                          src="${le}" 
                          style="max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: none;" 
                        />
                      </div>
                    `:v}


                    ${this._lyricsActive&&!this._isIdle?g`
                      <yamp-lyrics-view
                        data-artwork-fit="${Qe}"
                        .hass=${this.hass}
                        .lyrics=${this._massLyrics}
                        .position=${st}
                        .loading=${this._fetchingLyrics}
                        .error=${this._lyricsError}
                        .activeThemeColor=${this.config.match_theme===!0?"var(--state-media_player-active-color, var(--primary-color, #ffffff))":"var(--custom-accent, #ffffff)"}
                        .mode=${this._isCurrentlyPlayingRadio()?"text":this.config.lyrics_mode||"default"}
                        .preRoll=${this.config.lyrics_pre_roll??0}
                      ></yamp-lyrics-view>
                    `:v}
                  </div>
                `:v}
                ${this.config.details_alignment!=="none"?g`
                  <div class="details" 
                    @pointerdown=${this._onIdleTapAreaPointerDown}
                    @pointermove=${this._onIdleTapAreaPointerMove}
                    @pointerup=${this._onIdleTapAreaPointerUp}
                    @pointercancel=${this._onIdleTapAreaPointerCancel}
                    style="${Ca&&Q?"margin-top: -12px; padding-bottom: 2px; min-height: 0; gap: 1px;":""} ${(()=>{const x=[];this._showEntityOptions&&(x.push("opacity:0"),x.push("pointer-events:none")),x.push(`min-height:${sl}px`),je||x.push("opacity:0"),this._lastSpacerRendered||(x.push("flex: 1"),x.push("justify-content: flex-end"));const K=this._getGestureStyles(this._isIdle);return K&&!this._showEntityOptions&&x.push(K),x.join(";")})()}">
                    ${this._showMediaTitleOptions?g`
                      <div class="title track-options-row" style="display: flex; gap: 16px; align-items: center; cursor: pointer;">
                        ${this._massQueueAvailable?g`
                          <div class="track-options-btn" @click=${x=>{x.stopPropagation(),this._handleAddCurrentToPlaylist()}} title="${u("search.labels.add_to_playlist")}">
                            <ha-icon icon="mdi:playlist-plus"></ha-icon>
                            <span>${u("search.add_to_playlist")}</span>
                          </div>
                        `:v}
                        <div class="track-options-btn" @click=${x=>{x.stopPropagation(),this._handlePlaySimilar()}} title="${u("search.play_similar")}">
                          <ha-icon icon="mdi:radio"></ha-icon>
                          <span>${u("search.play_similar")}</span>
                        </div>
                        <div class="track-options-btn track-options-close" @click=${x=>{x.stopPropagation(),this._showMediaTitleOptions=!1}} title="${u("common.close")}">
                          <ha-icon icon="mdi:close"></ha-icon>
                        </div>
                      </div>
                    `:g`
                      <div class="title track-options-title" @click=${x=>{je&&at&&(x.stopPropagation(),this._showMediaTitleOptions=!0)}} style="${je&&at?"cursor: pointer;":""}" title="${je&&at?u("search.show_track_options"):""}">
                        ${je&&at?at:g`&nbsp;`}
                      </div>
                    `}
                    <div
                        class="artist ${je&&j.attributes.media_artist?"clickable-artist":""}"
                        @click=${()=>{je&&j.attributes.media_artist&&this._searchArtistFromNowPlaying()}}
                        title=${je&&j.attributes.media_artist?u("search.search_artist"):""}
                      >${je&&er?er:g`&nbsp;`}</div>
                  </div>
                `:v}
                ${!Q&&!this._alternateProgressBar?Vi(Yt&&Kt?{progress:ir,seekEnabled:!0,onSeek:x=>this._onProgressBarClick(x),collapsed:!1,style:this._showEntityOptions?"visibility:hidden; opacity:0":"",displayTimestamps:this._displayTimestamps,currentTime:st,duration:Kt,customHeight:this.config.progress_bar_height??At}:{progress:0,seekEnabled:!1,collapsed:!1,style:"visibility:hidden; opacity:0",displayTimestamps:this._displayTimestamps,currentTime:0,duration:0,customHeight:this.config.progress_bar_height??At}):v}
                ${Q||this._alternateProgressBar?Vi(Yt&&Kt?{progress:ir,collapsed:!0,style:this._showEntityOptions?"visibility:hidden; opacity:0":"",customHeight:this.config.progress_bar_height??At}:{progress:0,collapsed:!0,style:"visibility:hidden; opacity:0",customHeight:this.config.progress_bar_height??At}):v}

                <div style="${tt||this._showEntityOptions?"visibility:hidden; opacity:0; pointer-events:none;":""}">
                    ${Pc({stateObj:$e,showStop:this._shouldShowStopButton($e),shuffleActive:Bo,repeatActive:Ho,onControlClick:x=>this._onControlClick(x),supportsFeature:(x,K)=>this._supportsFeature(x,K),showFavorite:O,favoriteActive:R,hiddenControls:I,adaptiveControls:this._adaptiveControls,controlLayout:this._controlLayout,swapPauseForStop:this._controlLayout==="modern"&&this._swapPauseForStop})}
                </div>
                ${zc({isRemoteVolumeEntity:Wo,showSlider:Ko,vol:Yo,isDragging:this._volumeDraggingEntity==="main",dragVol:this._dragVolume,isMuted:this.currentVolumeStateObj?.attributes?.is_volume_muted??!1,supportsMute:this.currentVolumeStateObj?this._supportsFeature(this.currentVolumeStateObj,Ua):!1,onVolumeDragStart:x=>this._onVolumeDragStart(x),onVolumeDragEnd:x=>this._onVolumeDragEnd(x),onVolumeInput:x=>this._onVolumeInput(x),onVolumeChange:x=>this._onVolumeChange(x),onVolumeStep:x=>this._onVolumeStep(x),onMuteToggle:()=>this._onMuteToggle(),leadingControlTemplate:Ia?L!==v?g`<div style="visibility:hidden; opacity:0; pointer-events:none;">${L}</div>`:v:L,reserveLeadingControlSpace:this._controlLayout==="modern",showRightPlaceholder:this._controlLayout==="modern",rightSlotTemplate:Ia?oe!==v?g`<div style="visibility:hidden; opacity:0; pointer-events:none;">${oe}</div>`:v:oe,hideVolume:cl,collapseRow:hr,moreInfoMenu:!this._showEntityOptions&&!Ii?g`
          <div class="more-info-menu">
            <button class="more-info-btn" @click=${async()=>await this._openEntityOptions()}>
              <span class="more-info-icon">&#9776;</span>
            </button>
          </div>
        `:v})}
            ${h&&!this._hideActiveEntityLabel&&!(this._hideActiveEntityLabelOnIdle&&this._isIdle)?g`
              <div class="in-menu-active-label" style="${this._showEntityOptions?"visibility:hidden; opacity:0; pointer-events:none;":""}">${F}</div>
            `:v}
          </div>
        </div>


      ${this._showEntityOptions?g`
      <div class="entity-options-overlay entity-options-overlay-opening" @click=${x=>this._closeEntityOptions(x)}>
        <div class="entity-options-container entity-options-container-opening">
          <div class="entity-options-sheet${h||m?" chips-mode":""} entity-options-sheet-opening" 
               @click=${x=>x.stopPropagation()}
               data-pin-search-headers="${o}">
            ${h||m?g`
                <div class="entity-options-chips-wrapper" style="${m&&!h?"visibility:hidden;pointer-events:none;":""}" @click=${x=>x.stopPropagation()}>
                <div class="chip-row entity-options-chips-strip">
                  ${Jr(this._getChipRowProps())}
                </div>
              </div>
            `:v}
              ${!this._showGrouping&&!this._showSourceList&&!this._showSearchInSheet&&!this._showResolvedEntities&&!this._showTransferQueue&&!this._showRemoteControl?this._renderMainMenu(G,E,h):this._showRemoteControl?this._renderRemoteControlSheet():this._showGrouping?this._renderGroupingSheet():this._showTransferQueue?this._renderTransferQueueSheet():this._showResolvedEntities?this._renderResolvedEntitiesSheet():this._showSearchInSheet?this._renderSearchInOptions(l,o):this._renderSourceListSheet(G,Y,W)}
              </div>
            </div>
            <!-- Persistent Media Controls Section - Outside Scrollable Area -->
            ${rr?g`
              <div class="persistent-media-controls" @click=${x=>x.stopPropagation()}>
                <div class="persistent-controls-artwork">
                  ${(()=>{const x=we;return x?.url&&oi(x.url)?g`
                      <img src="${x.url}" alt="${u("common.album_art")}" class="persistent-artwork" onerror="this.style.display='none'">
                    `:g`
                      <div class="persistent-artwork-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `})()}
                </div>
                <div class="persistent-controls-buttons" style="position: relative;">
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("prev")} title="${u("card.media_controls.previous")}">
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("play_pause")} title="${u("card.media_controls.play_pause")}">
                    <ha-icon icon=${this._isEntityPlaying(this.currentPlaybackStateObj)?"mdi:pause":"mdi:play"}></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("next")} title="${u("card.media_controls.next")}">
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </button>
                  ${!this.config.hide_reorder_progress&&!this.config.hide_menu_player&&this._queueOpsTotal>0?g`
                    <div class="queue-ops-progress" style="position: absolute !important; bottom: -20px !important; left: 50% !important; transform: translate(-50%, 0) !important; z-index: 1000 !important; width: max-content !important; pointer-events: none !important; color: var(--search-text-secondary) !important;">
                      Re-ordering ${this._queueOpsCompleted} / ${this._queueOpsTotal}
                    </div>
                  `:v}
                </div>
                ${(()=>{const x=this._selectedIndex,K=this._getVolumeEntity(x);if(!K)return v;const ae=K.startsWith&&K.startsWith("remote."),Pi=this.currentVolumeStateObj,zi=Number(Pi?.attributes?.volume_level??0),pr=ae?null:`${Math.round((zi||0)*100)}%`;return this._getEffectiveVolumeMode()==="hidden"?v:g`
                    <div class="persistent-volume-stepper">
                      <button class="stepper-btn" @click=${()=>this._onVolumeStep(-1)} title="${u("common.vol_down")}">–</button>
                      ${pr?g`<span class="stepper-value">${pr}</span>`:v}
                      <button class="stepper-btn" @click=${()=>this._onVolumeStep(1)} title="${u("common.vol_up")}">+</button>
                    </div>
                  `})()}
              </div>
            `:v}
          </div>
        `:v}
          ${this._searchActiveOptionsItem?Vc({item:this._searchActiveOptionsItem,onClose:()=>{this._searchActiveOptionsItem=null,this.requestUpdate()},onPlayOption:(x,K)=>this._performSearchOptionAction(x,K),massQueueAvailable:this._massQueueAvailable}):v}
          ${!rr&&!this.config.hide_reorder_progress&&!this.config.hide_menu_player&&this._queueOpsTotal>0?g`
            <div class="queue-ops-progress" style="position: absolute !important; bottom: 12px !important; left: 50% !important; transform: translate(-50%, 0) !important; z-index: 1000 !important; width: max-content !important; pointer-events: none !important; color: var(--search-text-secondary) !important;">
              Re-ordering ${this._queueOpsCompleted} / ${this._queueOpsTotal}
            </div>
          `:""}
          </div>
    </ha-card>
  `}_getCardHeightMetrics(e){const t=this._cardHeightTemplateValue?.card?.template?this._cardHeightResolveCache?.card?.value:e.card_height,a=typeof t=="string"?parseFloat(t):Number(t),s=typeof a=="number"&&Number.isFinite(a)&&a>0||typeof a=="string"&&a.trim()!=="";return{customCardHeight:a,hasCustomCardHeight:s}}_getMaxCollapsedArtworkWidth(e){const t=e>0?Math.max(64,e-220):102;return Math.min(t,160)}_setHostDataAttributes(e,t,a){const s=this._appearance||"automatic";e.setAttribute("data-match-theme",String(t.match_theme===!0)),e.setAttribute("data-appearance",s),e.setAttribute("data-always-collapsed",String(this._alwaysCollapsed));const r=(this.entityObjs||[]).length>1,n=this._alwaysCollapsed&&!r&&!this._showGrouping;e.setAttribute("data-hide-menu-player",String(t.hide_menu_player===!0||n)),e.setAttribute("data-extend-artwork",String(this._extendArtwork)),e.setAttribute("data-control-layout",this._controlLayout||"classic"),e.setAttribute("data-details-alignment",t.details_alignment||"left");const o=(this.entityObjs||[]).length===1&&this._alwaysCollapsed&&t.expand_on_search!==!0,l=t.pin_search_headers===!0&&!o;e.setAttribute("data-pin-search-headers",String(l)),a?e.setAttribute("data-has-custom-height","true"):e.removeAttribute("data-has-custom-height")}_getPlaybackAndCollapseState(e){const t=this._getEntityForPurpose(this._selectedIndex,"playback_control"),a=this.hass&&this.hass.states&&t?this.hass.states[t]:void 0,s=a?this._isEntityPlaying(a):!1,r=e.idle_image?ni(this.hass,e.idle_image):null,n=e.show_idle_artwork_when_not_playing===!0&&!s&&r,o=this._isCurrentEntityPlaying(),l=this._alwaysCollapsed||this._isIdle&&e.collapse_on_idle===!0&&!o;return{playbackStateObj:a,collapsed:l,forceIdleImage:n}}_updatePersistentControlsVisibility(e,t,a,s,r){const n=(a?r?s:this._collapsedBaselineHeight||220:350)>=350;t.hide_menu_player!==!0&&(!a||n)?e.removeAttribute("data-hide-persistent-controls"):e.setAttribute("data-hide-persistent-controls","true")}_updateHostLayoutStyles(e,t,a,s,r){const n=r&&s<280,o=t.show_chip_row||"auto",l=(this.entityObjs||[]).length>1,c=(o==="in_menu"||o==="in_menu_on_idle"&&this._isIdle)&&l,d=o!=="hidden"&&!c&&l;let h=240,p=0;const _=this.offsetWidth||0;if(a)if(r){const O=this._getMaxCollapsedArtworkWidth(_);p=Math.max(0,Math.min(O,Math.round((s-(n?90:130))*.95)))}else p=this._artworkObjectFit==="no_artwork"?0:64;const m=r?s-h:0,f=Math.max(0,m-(d?58:0)),y=Math.min(90,f*.45),b=(f>0?Math.max(0,f-y):0)>=48,k=this._collapsedBaselineHeight||220,E=r?s-k:0,w=a&&p>0?Math.round(p+(n?12:24)+Math.min(40,Math.max(0,E)*.12)):a&&p===0?0:null,P=b?0:w??0,$=_>380?Math.min(1.6,1+(_-380)/520):1,C=E>0?Math.min(1.45,1+f/180):n?.9:1,N=C>1||$>1?Math.min(1.6,Math.max(C,$)):n?.95:1,j=n?.85:Math.min(1.5,Math.max(C*.92,$*.92)),F=r&&s<320&&!this._alwaysCollapsed,I=this._getEffectiveVolumeMode()==="hidden"||F||r&&s<260&&a&&!this._showEntityOptions?54:100;E!==0||n?(w!=null&&e.style.setProperty("--yamp-collapsed-details-offset",`${w}px`),e.style.setProperty("--yamp-collapsed-controls-offset",`${P}px`),e.style.setProperty("--yamp-collapsed-title-scale",N.toFixed(3)),e.style.setProperty("--yamp-collapsed-artist-scale",j.toFixed(3)),e.style.setProperty("--yamp-collapsed-artwork-size",`${p}px`),e.style.setProperty("--yamp-collapsed-artwork-clearance",`${I}px`)):(e.style.removeProperty("--yamp-collapsed-controls-offset"),e.style.removeProperty("--yamp-collapsed-details-offset"),e.style.removeProperty("--yamp-collapsed-artwork-size"),e.style.removeProperty("--yamp-collapsed-title-scale"),e.style.removeProperty("--yamp-collapsed-artist-scale"),e.style.removeProperty("--yamp-collapsed-artwork-clearance"))}_updateHostArtworkStyles(e,t,a){const s=this.metadataStateObj,r=this._getArtworkUrl(s,a),n=this._getArtworkUrl(t,a),o=this.currentStateObj,l=this._getArtworkUrl(o,a),c=s?.attributes?.media_title||t?.attributes?.media_title||o?.attributes?.media_title;let d=r;c&&(!d||!d.url)&&n?.url&&t?.attributes?.media_title===c&&(d=n),c&&(!d||!d.url)&&l?.url&&o?.attributes?.media_title===c&&(d=l);let h=this._artworkObjectFit;d?.objectFit&&(h=d.objectFit);const p=h||"cover",_=this._getBackgroundSizeForFit(p);e.style.setProperty("--yamp-artwork-fit",p),e.style.setProperty("--yamp-artwork-bg-size",_)}_updateHostAttributes(){if(!this.shadowRoot||!this.shadowRoot.host||!this.hass||!this.config)return;const e=this.shadowRoot.host,t=this.config,{customCardHeight:a,hasCustomCardHeight:s}=this._getCardHeightMetrics(t);this._setHostDataAttributes(e,t,s);const{playbackStateObj:r,collapsed:n,forceIdleImage:o}=this._getPlaybackAndCollapseState(t);this._updatePersistentControlsVisibility(e,t,n,a,s),this._updateHostLayoutStyles(e,t,n,a,s),this._updateHostArtworkStyles(e,r,o)}_renderSearchSubFilters(e){return!e||!this._usingMusicAssistant||this._searchLoading?v:g`
      <div class="search-sub-filters" style="display: flex; align-items: center; margin-bottom: 2px; margin-top: 4px; padding-left: 3px; width: 100%; gap: 8px;">
        <div style="display: flex; align-items: center; flex-wrap: wrap; flex: 1; min-width: 0;">
          ${this._cardType!=="up_next"?g`
          <button
            class="button${this._initialFavoritesLoaded||this._favoritesFilterActive?" active":""}"
            style="
              border: none;
              font-size: 1.2em;
              cursor: ${this._searchAttempted?"pointer":"default"};
              padding: 4px 8px;
              border-radius: 50%;
              transition: all 0.2s ease;
              margin-right: 8px;
              display: flex;
              align-items: center;
              opacity: ${this._searchAttempted?"1":"0.5"};
            "
            @click=${this._searchAttempted?()=>{this._toggleFavoritesFilter()}:()=>{}}
            title="${u("search.favorites")}"
          >
            <ha-icon .icon=${this._initialFavoritesLoaded||this._favoritesFilterActive?"mdi:cards-heart":"mdi:cards-heart-outline"}></ha-icon>
            ${this._initialFavoritesLoaded||this._favoritesFilterActive?g`
              <span style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;">
                ${u("search.favorites")}
              </span>
            `:v}
          </button>
          <button
            class="button${this._recentlyPlayedFilterActive?" active":""}"
            style="
              border: none;
              font-size: 1.2em;
              cursor: ${this._searchAttempted?"pointer":"default"};
              padding: 4px 8px;
              border-radius: 50%;
              transition: all 0.2s ease;
              margin-right: 8px;
              display: flex;
              align-items: center;
              opacity: ${this._searchAttempted?"1":"0.5"};
            "
            @click=${this._searchAttempted?()=>{this._toggleRecentlyPlayedFilter()}:()=>{}}
            title="${u("search.recently_played")}"
          >
            <ha-icon .icon=${this._recentlyPlayedFilterActive?"mdi:clock":"mdi:clock-outline"}></ha-icon>
            ${this._recentlyPlayedFilterActive?g`
              <span style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;">
                ${u("search.recently_played")}
              </span>
            `:v}
          </button>
          ${this._isMusicAssistantEntity()?g`
            <button
              class="button${this._upcomingFilterActive?" active":""}"
              style="
                border: none;
                font-size: 1.2em;
                cursor: ${this._searchAttempted?"pointer":"default"};
                padding: 4px 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
                margin-right: 8px;
                display: flex;
                align-items: center;
                opacity: ${this._searchAttempted?"1":"0.5"};
              "
              @click=${this._searchAttempted?()=>{this._toggleUpcomingFilter()}:()=>{}}
              title="${u("search.next_up")}"
            >
              <ha-icon .icon=${this._upcomingFilterActive?"mdi:playlist-music":"mdi:playlist-music-outline"}></ha-icon>
              ${this._upcomingFilterActive?g`
                <span style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;">
                  ${u("search.next_up")}
                </span>
              `:v}
            </button>
            ${this._hasMassQueueIntegration?g`
              <button
                class="button${this._recommendationsFilterActive?" active":""}"
                style="
                  border: none;
                  font-size: 1.2em;
                  cursor: ${this._searchAttempted?"pointer":"default"};
                  padding: 4px 8px;
                  border-radius: 50%;
                  transition: all 0.2s ease;
                  margin-right: 8px;
                  display: flex;
                  align-items: center;
                  opacity: ${this._searchAttempted?"1":"0.5"};
                "
                @click=${this._searchAttempted?()=>{this._toggleRecommendationsFilter()}:()=>{}}
                title="${u("search.recommendations")}"
              >
                <ha-icon .icon=${this._recommendationsFilterActive?"mdi:creation":"mdi:creation-outline"}></ha-icon>
                ${this._recommendationsFilterActive?g`
                  <span style="margin-left:6px;font-size:0.81em;font-weight:600;white-space:nowrap;">
                    ${u("search.recommendations")}
                  </span>
                `:v}
              </button>
            `:v}
          `:v}
          <button
            class="radio-mode-button${this._radioModeActive?" active":""}"
            @click=${()=>this._toggleRadioMode()}
            title="${u("search.radio_mode")}"
          >
            <ha-icon .icon=${this._radioModeActive?"mdi:radio":"mdi:radio-off"}></ha-icon>
          </button>
          ${this._shouldShowSearchSortToggle()?g`
            <button
              class="button"
              style="
                border: none;
                font-size: 1.2em;
                cursor: ${this._searchAttempted?"pointer":"default"};
                padding: 4px 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
                margin-right: 8px;
                display: flex;
                align-items: center;
                opacity: ${this._searchAttempted?"1":"0.5"};
              "
              @click=${this._searchAttempted?()=>this._toggleSearchResultsSortDirection():()=>{}}
              title=${this._getSearchSortToggleTitle()}
            >
              <ha-icon .icon=${this._getSearchSortToggleIcon()}></ha-icon>
            </button>
          `:v}
          `:v}
          ${this._shouldShowSearchResultsCount()?g`
            <span class="search-results-count" style="${this._cardType==="up_next"?"padding-top: 15px; display: inline-block;":""}">
              ${this._getSearchResultsCountLabel()}
            </span>
          `:v}
        </div>
      </div>
    `}_renderSearchInOptions(e,t=!1){return g`
      <div class="entity-options-search" style="margin-top:${this._cardType==="up_next"?"0":"12px"};">
        ${this._searchHierarchy.length>0?g`
            <button class="entity-options-item close-item" @click=${()=>this._goBackInSearch()}>
              ${u("common.back")}
            </button>
            <div class="entity-options-divider"></div>
          `:v}
        ${this._searchBreadcrumb?g`
            <div class="entity-options-search-breadcrumb">
              <div class="entity-options-search-breadcrumb-text">${this._searchBreadcrumb}</div>
              ${this._isSelectionFlow?v:g`
                <button class="entity-options-search-breadcrumb-play" @click=${()=>this._playCurrentCollection()} title="${u("search.play_collection")}">
                  <ha-icon icon="mdi:play"></ha-icon>
                </button>
              `}
            </div>
          `:e&&this._cardType!=="up_next"?g`<div class="entity-options-search-skeleton"></div>`:v}
        ${e&&this._cardType!=="up_next"?g`
          <div class="entity-options-search-row">
            <div class="search-input-wrapper">
              <input
                type="text"
                id="search-input-box"
                ?autofocus=${!this._disableSearchAutofocus}
                class="entity-options-search-input"
                .value=${this._searchQuery}
                @input=${a=>{this._searchQuery=a.target.value,this.requestUpdate()}}
                @keydown=${a=>{a.key==="Enter"?(a.preventDefault(),this._handleSearchSubmit()):a.key==="Escape"&&(a.preventDefault(),this._hideSearchSheetInOptions())}}
                placeholder="${u("editor.placeholders.search")}"
              />
              ${this._searchQuery?g`
                <button
                  class="search-input-clear"
                  @click=${()=>{this._showSearchSheetInOptions()}}
                  title="${u("common.clear")}">
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              `:v}
            </div>
            <button
              class="entity-options-item icon-only"
              style="min-width:48px; padding: 0;"
              @click=${()=>this._handleSearchSubmit()}
              title="${u("common.search")}"
              aria-label="${u("common.search")}"
              ?disabled=${this._searchLoading}>
              <ha-icon icon="mdi:magnify"></ha-icon>
            </button>
            ${this._cardType!=="search"&&this._cardType!=="up_next"?g`
            <button
              class="entity-options-item icon-only"
              style="min-width:48px; padding: 0;"
              title="${u("common.cancel")}"
              aria-label="${u("common.cancel")}"
              @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._hideSearchSheetInOptions()}}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
            `:v}
          </div>
        `:v}
        <!--FILTER CHIPS-->
        ${e&&this._cardType!=="up_next"?(()=>{const a=this._getVisibleSearchFilterClasses(),s=this._searchMediaClassFilter||"all";return this._searchHierarchy.length>0||a.length<2&&!this._usingMusicAssistant?v:g`
            <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center; align-items: center;">
                <button
                  class="chip"
                  ?selected=${s==="all"}
                  @click=${()=>this._doSearch()}
                >${u("search.filters.all")}</button>
                ${a.map(r=>g`
                  <button
                    class="chip"
                    ?selected=${s===r}
                    @click=${()=>this._doSearch(r)}
                  >
                    ${u(`search.filters.${r}`)}
                  </button>
                `)}
            </div>
          `})():v}
        
        ${this._searchLoading?g`<div class="entity-options-search-loading">${u("common.loading")}</div>`:v}
        ${this._searchError?g`<div class="entity-options-search-error">${this._searchError}</div>`:v}
        
        ${this._renderSearchSubFilters(e)}
 
        <div class="${this._showSearchInSheet?"search-sheet-results":"entity-options-search-results"}" 
             style="${this.config.search_view==="card"||this.config.search_view==="card_minimal"?`--search-card-columns: ${this.config.search_card_columns||4};`:""}">
          ${(()=>{const a=this._getDisplaySearchResults(),s=this.config.search_view==="card"||this.config.search_view==="card_minimal",r=this.config.search_view==="card_minimal",n=Math.max(15,this._searchTotalRows||a.length),o=[...a,...Array.from({length:Math.max(0,n-a.length)},()=>null)],l=c=>Nc({item:c,isCard:s,isMinimal:r,activeSearchRowMenuId:this._activeSearchRowMenuId,loadingSearchRowMenuId:this._loadingSearchRowMenuId,errorSearchRowMenuId:this._errorSearchRowMenuId,successSearchRowMenuId:this._successSearchRowMenuId,successSearchRowType:this._successSearchRowType,isSelectionFlow:this._isSelectionFlow,massQueueAvailable:this._massQueueAvailable,upcomingFilterActive:!!this._upcomingFilterActive,recentlyPlayedFilterActive:!!this._recentlyPlayedFilterActive,recommendationsFilterActive:!!this._recommendationsFilterActive,searchMediaClassFilter:this._searchMediaClassFilter,queueControlsStyle:this.config.queue_controls_style||"drag_handle",onPlay:(d,h)=>this._playMediaFromSearch(d,h),onResultClick:(d,h)=>this._handleSearchResultClick(d,h),onResultTouch:(d,h)=>this._handleSearchResultTouch(d,h),onOptionsToggle:d=>{this._activeSearchRowMenuId=d?.media_content_id||null,this.requestUpdate()},onPlayOption:(d,h)=>this._performSearchOptionAction(d,h),onMoveUp:d=>this._moveQueueItemUp(d.queue_item_id),onMoveDown:d=>this._moveQueueItemDown(d.queue_item_id),onMoveNext:d=>this._moveQueueItemNext(d.queue_item_id),onRemove:d=>this._removeQueueItem(d.queue_item_id),isMusicAssistant:this._isMusicAssistantEntity(),isValidArtwork:d=>oi(d),getClickTitle:d=>this._getSearchResultClickTitle(d),artworkHostname:this.config?.artwork_hostname||""});return this._searchAttempted&&a.length===0&&!this._searchLoading?g`<div class="entity-options-search-empty">${u("common.no_results")}</div>`:this._upcomingFilterActive&&this._massQueueAvailable?g`
            <div class="queue-sortable-container ${s?"is-card-layout":""}"
              @pointerdown=${c=>this._onQueueDragStart(c)}
            >
              ${a.map((c,d)=>g`
                <div class="queue-drag-wrapper" data-queue-idx="${d}">
                  ${l(c)}
                </div>
              `)}
            </div>
          `:((!this._cachedSearchGridLayout||this._cachedSearchGridLayoutColumns!==(this.config.search_card_columns||4)||this._cachedSearchGridLayoutIsMinimal!==r)&&(this._cachedSearchGridLayoutColumns=this.config.search_card_columns||4,this._cachedSearchGridLayoutIsMinimal=r,this._cachedSearchGridLayout=hc({columns:this._cachedSearchGridLayoutColumns,gap:"12px",padding:"12px",itemSize:r?{width:150,height:150}:{width:150,height:244}})),Lr(s?{items:o,renderItem:l,layout:this._cachedSearchGridLayout,scroller:t}:{items:o,renderItem:l,scroller:t}))})()}
        </div>
      </div>
    `}_renderSourceListSheet(e,t,a){return g`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeSourceList()}}>
          ${u("common.back")}
        </button>
        <div class="entity-options-divider"></div>
      </div>
      <div class="entity-options-scroll source-list-centering-wrapper">
        <div class="source-list-sheet">
          <div class="source-list-scroll">
            ${e.map(s=>g`
              <div class="entity-options-item" data-source-name="${s}" @click=${()=>this._selectSource(s)}>${s}</div>
            `)}
          </div>
        </div>
      </div>
      <div class="floating-source-index">
        ${t.map((s,r)=>{const n=a.has(s),o=this._hoveredSourceLetterIndex;let l="";if(n&&o!==null&&o!==void 0){const c=Math.abs(o-r);c===0?l="max":c===1?l="large":c===2&&(l="med")}return g`
            <button
              class="source-index-letter"
              ?disabled=${!n}
              data-scale=${l}
              @mouseenter=${n?()=>{this._hoveredSourceLetterIndex=r,this.requestUpdate()}:v}
              @mouseleave=${()=>{this._hoveredSourceLetterIndex=null,this.requestUpdate()}}
              @click=${n?()=>this._scrollToSourceLetter(s):v}
            >
              ${s}
            </button>
          `})}
      </div>
    `}_updateIdleState(e){if(this.isAnyMenuOpen){this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null);return}const t=this.entityIds.some((o,l)=>{if(this._isAutoSelectDisabled(l))return!1;const c=this._getEntityForPurpose(l,"sorting");return this._isEntityPlaying(this.hass.states[c])}),a=this._isCurrentEntityPlaying(),s=this._isAutoSelectDisabled(this._selectedIndex),r=a&&(!s||this._manualSelect);let n;if(this._isIdle||!this._hasSeenPlayback?n=t:n=r,n)this._idleTimeout&&clearTimeout(this._idleTimeout),this._idleTimeout=null,this._hasSeenPlayback=!0,this._isIdle&&(this._setIdleState(!1),this._resetIdleScreen(),this.requestUpdate());else{if(!this._hasSeenPlayback){this._idleTimeoutMs>0?this._isIdle||(this._setIdleState(!0),this._idleScreenApplied=!1,this._applyIdleScreen(),this.requestUpdate()):this._isIdle&&(this._setIdleState(!1),this._resetIdleScreen(),this.requestUpdate());return}!this._isIdle&&this._idleTimeoutMs>0&&(e&&e.has("_selectedIndex")?(this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),!t&&this._idleTimeoutMs>0?(this._setIdleState(!0),this._idleScreenApplied=!1,this._pinnedIndex===null&&(this._manualSelect=!1,this._manualSelectPlayingSet=null),this._applyIdleScreen(),this.requestUpdate()):this._idleTimeout=setTimeout(()=>{this._handleIdleTimeoutCallback()},this._idleTimeoutMs)):this._idleTimeout||(this._idleTimeout=setTimeout(()=>{this._handleIdleTimeoutCallback()},this._idleTimeoutMs))),this._idleTimeoutMs===0&&this._isIdle&&(this._setIdleState(!1),this._resetIdleScreen(),this.requestUpdate())}}_handleIdleTimeoutCallback(){if(this._cardType==="search"||this._cardType==="up_next"){if(this._idleTimeout=null,this._searchHierarchy.length>0){this._searchHierarchy=[],this._searchBreadcrumb="",this._searchResultsByType={};const t=this.config?.default_search_filter==="all"?null:this.config?.default_search_filter;this._doSearch(t).catch(()=>{}),this.requestUpdate()}return}const e=this.entityIds.some((t,a)=>{if(this._isAutoSelectDisabled(a))return!1;const s=this._getEntityForPurpose(a,"sorting"),r=this.hass?.states?.[s];return r&&this._isEntityPlaying(r)});if(this._idleTimeout=null,this._pinnedIndex===null&&(this._manualSelect=!1,this._manualSelectPlayingSet=null),e){const t=this.sortedEntityIds;if(t.length>0){let a=t[0];const s=a?(this.groupedSortedEntityIds||[]).find(n=>n.includes(a)):null;if(s&&s.length>1){const n=this._getActualGroupMaster(s);n&&(a=n)}const r=this.entityIds.indexOf(a);r>=0&&r!==this._selectedIndex&&(this._selectedIndex=r)}this.requestUpdate();return}this._setIdleState(!0),this._idleScreenApplied=!1,this._applyIdleScreen(),this.requestUpdate()}getGridOptions(){let e;return this._alwaysCollapsed&&this._expandOnSearch&&this._showSearchInSheet?e=!1:e=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1,{min_rows:e?2:4,columns:12}}static get _schema(){return[{name:"entities",selector:{entity:{multiple:!0,domain:"media_player"}},required:!0},{name:"show_chip_row",selector:{select:{options:[{value:"auto",label:"Auto"},{value:"always",label:"Always"},{value:"in_menu",label:"In Menu"},{value:"in_menu_on_idle",label:"In Menu on Idle"}]}},required:!1},{name:"idle_screen",selector:{select:{options:[{value:"default",label:"Default"},{value:"search",label:"Search"},{value:"source",label:"Source"},{value:"more-info",label:"More Info"},{value:"group-players",label:"Group Players"},{value:"transfer-queue",label:"Transfer Queue"}]}},required:!1},{name:"hold_to_pin",selector:{boolean:{}},required:!1},{name:"disable_autofocus",selector:{boolean:{}},required:!1},{name:"idle_image",selector:{entity:{domain:"",multiple:!1}},required:!1},{name:"match_theme",selector:{boolean:{}},required:!1},{name:"collapse_on_idle",selector:{boolean:{}},required:!1},{name:"always_collapsed",selector:{boolean:{}},required:!1},{name:"expand_on_search",selector:{boolean:{}},required:!1},{name:"alternate_progress_bar",selector:{boolean:{}},required:!1},{name:"idle_timeout_ms",selector:{number:{min:0,step:1e3,unit_of_measurement:"ms",mode:"box"}},required:!1},{name:"volume_step",selector:{number:{min:.01,max:1,step:.01,unit_of_measurement:"",mode:"box"}},required:!1},{name:"volume_mode",selector:{select:{options:[{value:"slider",label:"Slider"},{value:"stepper",label:"Stepper"}]}},required:!1},{name:"actions",selector:{object:{}},required:!1},{name:"dim_chips_on_idle",selector:{boolean:{}},required:!1},{name:"pin_search_headers",selector:{boolean:{}},required:!1}]}firstUpdated(){super.firstUpdated?.();const e=this.renderRoot.querySelector(".floating-source-index");e&&e.addEventListener("wheel",function(t){const{scrollTop:a,scrollHeight:s,clientHeight:r}=e,n=t.deltaY;(n<0&&a===0||n>0&&a+r>=s)&&(t.preventDefault(),t.stopPropagation())},{passive:!1})}_addGrabScroll(e){const t=this.renderRoot.querySelector(e);if(!t||t._grabScrollAttached)return;let a=!1,s,r;const n=h=>{a=!0,t._dragged=!1,t.classList.add("grab-scroll-active"),s=h.pageX-t.offsetLeft,r=t.scrollLeft,h.preventDefault()},o=()=>{a=!1,t.classList.remove("grab-scroll-active")},l=()=>{a=!1,t.classList.remove("grab-scroll-active")},c=h=>{if(!a)return;const p=h.pageX-t.offsetLeft-s;Math.abs(p)>5&&(t._dragged=!0),h.preventDefault(),t.scrollLeft=r-p},d=h=>{t._dragged&&(h.stopPropagation(),h.preventDefault(),t._dragged=!1)};t.addEventListener("mousedown",n),t.addEventListener("mouseleave",o),t.addEventListener("mouseup",l),t.addEventListener("mousemove",c),t.addEventListener("click",d,!0),t._grabScrollHandlers={mousedown:n,mouseleave:o,mouseup:l,mousemove:c,click:d},t._grabScrollAttached=!0}_addVerticalGrabScroll(e){const t=this.renderRoot.querySelector(e);if(!t||t._grabScrollAttached)return;let a=!1,s,r;const n=h=>{a=!0,t._dragged=!1,t.classList.add("grab-scroll-active"),s=h.pageY-t.getBoundingClientRect().top,r=t.scrollTop,h.preventDefault()},o=()=>{a=!1,t.classList.remove("grab-scroll-active")},l=()=>{a=!1,t.classList.remove("grab-scroll-active")},c=h=>{if(!a)return;const p=h.pageY-t.getBoundingClientRect().top-s;Math.abs(p)>5&&(t._dragged=!0),h.preventDefault(),t.scrollTop=r-p},d=h=>{t._dragged&&(h.stopPropagation(),h.preventDefault(),t._dragged=!1)};t.addEventListener("mousedown",n),t.addEventListener("mouseleave",o),t.addEventListener("mouseup",l),t.addEventListener("mousemove",c),t.addEventListener("click",d,!0),t._grabScrollHandlers={mousedown:n,mouseleave:o,mouseup:l,mousemove:c,click:d},t._grabScrollAttached=!0}_removeGrabScrollHandlers(){this.renderRoot.querySelectorAll(".chip-row, .action-chip-row, .floating-source-index, .search-filter-chips").forEach(e=>{if(e._grabScrollHandlers){const t=e._grabScrollHandlers;e.removeEventListener("mousedown",t.mousedown),e.removeEventListener("mouseleave",t.mouseleave),e.removeEventListener("mouseup",t.mouseup),e.removeEventListener("mousemove",t.mousemove),e.removeEventListener("click",t.click,!0),delete e._grabScrollHandlers,e._grabScrollAttached=!1}})}_removeSearchSwipeHandlers(){const e=this.renderRoot.querySelector(".entity-options-search-results");if(e&&e._searchSwipeHandlers){const t=e._searchSwipeHandlers;e.removeEventListener("touchstart",t.touchstart),e.removeEventListener("touchend",t.touchend),delete e._searchSwipeHandlers,this._searchSwipeAttached=!1}}disconnectedCallback(){this._activeDragCleanup&&this._activeDragCleanup(),this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),this._dragClickCaptureTimeout&&(clearTimeout(this._dragClickCaptureTimeout),this._dragClickCaptureTimeout=null),this._dragClickCaptureFn&&(window.removeEventListener("click",this._dragClickCaptureFn,!0),this._dragClickCaptureFn=null),this._unsubscribeFromQueueUpdates(),this._lyricsFetchTimeout&&(clearTimeout(this._lyricsFetchTimeout),this._lyricsFetchTimeout=null),super.disconnectedCallback?.(),this._progressTimer&&(clearInterval(this._progressTimer),this._progressTimer=null),this._debouncedVolumeTimer&&(clearTimeout(this._debouncedVolumeTimer),this._debouncedVolumeTimer=null),this._volumeOverlayTimer&&(clearTimeout(this._volumeOverlayTimer),this._volumeOverlayTimer=null),this._internalVolumeSuppressTimer&&(clearTimeout(this._internalVolumeSuppressTimer),this._internalVolumeSuppressTimer=null),this._manualSelectTimeout&&(clearTimeout(this._manualSelectTimeout),this._manualSelectTimeout=null),this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._queueRefreshTimer&&(clearTimeout(this._queueRefreshTimer),this._queueRefreshTimer=null),this._gestureHoldTimer&&(clearTimeout(this._gestureHoldTimer),this._gestureHoldTimer=null),this._tapTimer&&(clearTimeout(this._tapTimer),this._tapTimer=null),this._successToastHandle&&(clearTimeout(this._successToastHandle),this._successToastHandle=null),this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),this._queueOpsTimeout&&(clearTimeout(this._queueOpsTimeout),this._queueOpsTimeout=null),this._latestSearchToken=0,this._removeSourceDropdownOutsideHandler(),this._removeGrabScrollHandlers(),this._removeSearchSwipeHandlers(),window.removeEventListener("scroll",this._handleGlobalScroll),window.removeEventListener("resize",this._handleViewportResize),typeof this._teardownAdaptiveTextObserver=="function"&&this._teardownAdaptiveTextObserver(),Object.values(this._templateSubscriptions).forEach(e=>{try{typeof e=="function"&&e()}catch(t){console.warn("yamp: Error during template unsubscription:",t)}}),this._templateSubscriptions={},this._activeSubscriptionTokens={},this._adaptiveScrollTimer&&(clearTimeout(this._adaptiveScrollTimer),this._adaptiveScrollTimer=null),this._lastPlayingEntityId=null,this._controlFocusEntityId=null}_applyClosingAnimations(){const e=this.renderRoot.querySelector(".entity-options-overlay"),t=this.renderRoot.querySelector(".entity-options-container"),a=this.renderRoot.querySelector(".entity-options-sheet");e&&(e.classList.remove("entity-options-overlay-opening"),e.classList.add("entity-options-overlay-closing")),t&&(t.classList.remove("entity-options-container-opening"),t.classList.add("entity-options-container-closing")),a&&(a.classList.remove("entity-options-sheet-opening"),a.classList.add("entity-options-sheet-closing"))}_dismissWithAnimation(){if(this._cardType==="search"||this._cardType==="up_next"){this._showGrouping=!1,this._showSourceList=!1,this._showResolvedEntities=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._showEntityOptions=!0,this._showSearchInSheet=!0,this._quickMenuInvoke=!1,this.requestUpdate();return}this._applyClosingAnimations(),this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),setTimeout(()=>{this._showEntityOptions=!1,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._quickMenuInvoke=!1,this.requestUpdate()},200)}_closeEntityOptions(e){if(this._isDragging){e&&(e.stopPropagation(),e.preventDefault());return}if(this._cardType==="search"||this._cardType==="up_next"){this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._showResolvedEntities=!1,this.requestUpdate();return}this._applyClosingAnimations(),this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),setTimeout(()=>{if(this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._showGrouping){this._showGrouping=!1,this._showEntityOptions=!1;const t=this.groupedSortedEntityIds,a=this.currentEntityId,s=t.find(r=>r.includes(a));if(s&&s.length>1){const r=this._getActualGroupMaster(s),n=this.entityIds.indexOf(r);n>=0&&(this._selectedIndex=n)}this.requestUpdate()}else this._showEntityOptions=!1,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._cardType!=="remote_control"&&(this._showRemoteControl=!1),this._searchInputAutoFocused=!1,this._searchHierarchy=[],this._searchBreadcrumb="",this._addToPlaylistTarget=null,this.requestUpdate();this._quickMenuInvoke=!1},200)}async _openEntityOptions(){for(let e=0;e<this.entityObjs.length;e++)await this._ensureResolvedMaForIndex(e),await this._ensureResolvedVolForIndex(e),await this._ensureResolvedHiddenControlsForIndex(e);await this._updateTransferQueueAvailability({refresh:!0}),this._showEntityOptions=!0,this.requestUpdate(),this.updateComplete.then(()=>{const e=this.renderRoot?.querySelector(".entity-options-chips-strip");e&&(e.scrollLeft=0)})}_openGrouping(){this._showEntityOptions=!0,this._showGrouping=!0;const e=this.currentEntityId;let t=e;if(e){const a=(this.groupedSortedEntityIds||[]).find(s=>s.includes(e));if(a&&a.length){const s=this._getActualGroupMaster(a);s&&(t=s)}}!t&&this.entityIds&&this.entityIds.length&&(t=this.entityIds[0]),this._lastGroupingMasterId=t,this.requestUpdate()}_hasRemoteControlSupport(){const e=this._selectedIndex,t=(this.entityObjs||[])[e];if(t?.remote_entity===!1)return!1;if(t?.remote_entity)return!0;const a=this.currentEntityId;if(!a)return!1;if(a.startsWith("remote."))return!0;if(a.startsWith("media_player.")){const s=`remote.${a.replace("media_player.","")}`;if(this.hass?.states?.[s])return!0}return!1}_getRemoteControlEntity(){const e=this._selectedIndex,t=(this.entityObjs||[])[e];if(t?.remote_entity){const s=ni(this.hass,t.remote_entity);if(s&&typeof s=="string")return s}const a=this.currentEntityId;if(!a)return null;if(a.startsWith("remote."))return a;if(a.startsWith("media_player.")){const s=`remote.${a.replace("media_player.","")}`;if(this.hass?.states?.[s])return s}return a}_sendRemoteCommand(e){const t=this._getRemoteControlEntity();if(t){if(t.startsWith("remote.")){this.hass.callService("remote","send_command",{entity_id:t,command:e});return}switch(e){case"up":case"down":case"left":case"right":case"select":case"back":case"menu":case"home":this.hass.callService("remote","send_command",{entity_id:t,command:e});break;case"play_pause":this.hass.callService("media_player","media_play_pause",{entity_id:t});break;case"previous":case"rewind":this.hass.callService("media_player","media_previous_track",{entity_id:t});break;case"next":case"fast_forward":this.hass.callService("media_player","media_next_track",{entity_id:t});break;case"volume_up":this.hass.callService("media_player","volume_up",{entity_id:t});break;case"volume_down":this.hass.callService("media_player","volume_down",{entity_id:t});break;case"mute":this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!this.currentVolumeStateObj?.attributes?.is_volume_muted});break;case"power":this.hass.callService("media_player","toggle",{entity_id:t});break;default:this.hass.callService("remote","send_command",{entity_id:t,command:e})}}}_openRemoteControl(){this._showEntityOptions=!0,this._showRemoteControl=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this.requestUpdate()}_closeRemoteControl(){this._cardType!=="remote_control"&&(this._showRemoteControl=!1,this.requestUpdate())}_getHiddenRemoteButtons(){const e=this._selectedIndex;let t=(this.entityObjs||[])[e]?.hide_remote_buttons??this.config.hide_remote_buttons;if(typeof t=="string"&&(t.includes("{{")||t.includes("{%")||t.includes("[[["))&&(t=ni(this.hass,t)),typeof t=="string")try{t=JSON.parse(t.replace(/'/g,'"'))}catch{t=t.split(",").map(a=>a.trim()).filter(a=>a!=="")}return Array.isArray(t)?t:[]}_renderRemoteControlSheet(){const e=this._getHiddenRemoteButtons();return g`
      <style>
        .remote-control-container {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
          padding: 12px 16px 24px 16px !important;
          gap: 16px !important;
          box-sizing: border-box !important;
          width: 100% !important;
          flex: 1 !important;
          margin: 0 auto !important;
        }
        .remote-dpad-wrapper {
          position: relative !important;
          width: 200px !important;
          height: 200px !important;
          flex-shrink: 0 !important;
          margin: 4px auto 12px auto !important;
        }
        .remote-dpad-cross {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 50% !important;
          background: var(--yamp-overlay-divider, rgba(255, 255, 255, 0.08)) !important;
          border: 1px solid var(--yamp-overlay-divider, rgba(255, 255, 255, 0.18)) !important;
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3), 0 6px 18px rgba(0, 0, 0, 0.25) !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
        .dpad-btn {
          appearance: none !important;
          -webkit-appearance: none !important;
          position: absolute !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
          border: none !important;
          color: var(--yamp-overlay-text, var(--primary-text-color, #fff)) !important;
          cursor: pointer !important;
          transition: background 0.15s ease, transform 0.1s ease, color 0.15s ease !important;
          padding: 0 !important;
          margin: 0 !important;
          outline: none !important;
          box-sizing: border-box !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .dpad-btn:not(.dpad-center) {
          -webkit-mask-image: radial-gradient(closest-side circle at 50% 50%, transparent 47%, black 49%) !important;
          mask-image: radial-gradient(closest-side circle at 50% 50%, transparent 47%, black 49%) !important;
        }
        .dpad-btn:hover {
          background: rgba(255, 255, 255, 0.16) !important;
          color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
        }
        .dpad-btn:active {
          background: rgba(255, 255, 255, 0.28) !important;
          transform: scale(0.92) !important;
        }
        .dpad-btn ha-icon {
          --mdc-icon-size: 28px !important;
          pointer-events: none !important;
        }
        .dpad-btn.dpad-up {
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          clip-path: polygon(0 0, 100% 0, 50% 50%) !important;
          align-items: flex-start !important;
          padding-top: 12% !important;
        }
        .dpad-btn.dpad-down {
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          clip-path: polygon(100% 100%, 0 100%, 50% 50%) !important;
          align-items: flex-end !important;
          padding-bottom: 12% !important;
        }
        .dpad-btn.dpad-left {
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          clip-path: polygon(0 100%, 0 0, 50% 50%) !important;
          justify-content: flex-start !important;
          padding-left: 12% !important;
        }
        .dpad-btn.dpad-right {
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          clip-path: polygon(100% 0, 100% 100%, 50% 50%) !important;
          justify-content: flex-end !important;
          padding-right: 12% !important;
        }
        .dpad-btn.dpad-center {
          top: 28% !important;
          left: 28% !important;
          width: 44% !important;
          height: 44% !important;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.12) !important;
          border: 1px solid var(--yamp-overlay-divider, rgba(255, 255, 255, 0.25)) !important;
          font-weight: 600 !important;
          font-size: 0.88rem !important;
          letter-spacing: 0.03em !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3) !important;
          z-index: 3 !important;
        }
        .dpad-btn.dpad-center:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
        }
        .remote-control-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-around !important;
          gap: 12px !important;
          width: 100% !important;
          max-width: 320px !important;
          margin: 0 auto !important;
        }
        .remote-control-btn {
          appearance: none !important;
          -webkit-appearance: none !important;
          display: flex !important;
          flex: 1 !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          height: 48px !important;
          max-width: 72px !important;
          border-radius: 14px !important;
          background: var(--yamp-overlay-divider, rgba(255, 255, 255, 0.08)) !important;
          border: 1px solid var(--yamp-overlay-divider, rgba(255, 255, 255, 0.15)) !important;
          color: var(--yamp-overlay-text, var(--primary-text-color, #fff)) !important;
          cursor: pointer !important;
          transition: all 0.15s ease !important;
          outline: none !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .remote-control-btn:hover {
          background: rgba(255, 255, 255, 0.18) !important;
          border-color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
          color: var(--custom-accent, var(--accent-color, #ff9800)) !important;
          transform: translateY(-1px) !important;
        }
        .remote-control-btn:active {
          transform: scale(0.93) !important;
        }
        .remote-control-btn ha-icon {
          --mdc-icon-size: 22px !important;
          pointer-events: none !important;
        }
      </style>
      ${this._cardType!=="remote_control"?g`
        <div class="entity-options-header">
          <button class="entity-options-item close-item" @click=${()=>this._closeRemoteControl()}>
            ${u("common.back")}
          </button>
        </div>
        <div class="entity-options-divider"></div>
      `:v}
      <div class="entity-options-scroll remote-control-container">
        <!-- D-Pad Directional Pad -->
        <div class="remote-dpad-wrapper">
          <div class="remote-dpad-cross">
            <button class="dpad-btn dpad-up" @click=${()=>this._sendRemoteCommand("up")} title="${u("card.remote.up")}">
              <ha-icon icon="mdi:chevron-up"></ha-icon>
            </button>
            <button class="dpad-btn dpad-down" @click=${()=>this._sendRemoteCommand("down")} title="${u("card.remote.down")}">
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            <button class="dpad-btn dpad-left" @click=${()=>this._sendRemoteCommand("left")} title="${u("card.remote.left")}">
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <button class="dpad-btn dpad-right" @click=${()=>this._sendRemoteCommand("right")} title="${u("card.remote.right")}">
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
            <button class="dpad-btn dpad-center" @click=${()=>this._sendRemoteCommand("select")} title="${u("card.remote.select")}">
              ${u("card.remote.select")}
            </button>
          </div>
        </div>

        <!-- Navigation Row -->
        <div class="remote-control-row">
          ${e.includes("back")?v:g`
            <button class="remote-control-btn" @click=${()=>this._sendRemoteCommand("back")} title="${u("card.remote.back")}">
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
          `}
          ${e.includes("menu")?v:g`
            <button class="remote-control-btn" @click=${()=>this._sendRemoteCommand("menu")} title="${u("card.remote.menu")}">
              <ha-icon icon="mdi:menu"></ha-icon>
            </button>
          `}
          ${e.includes("home")?v:g`
            <button class="remote-control-btn" @click=${()=>this._sendRemoteCommand("home")} title="${u("card.remote.home")}">
              <ha-icon icon="mdi:home"></ha-icon>
            </button>
          `}
          ${e.includes("power")?v:g`
            <button class="remote-control-btn" @click=${()=>this._onControlClick("power")} title="${u("card.remote.power")}">
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
          `}
        </div>
      </div>
    `}_openSourceList(){this._showEntityOptions=!0,this._showSourceList=!0,this._showGrouping=!1,this.requestUpdate()}_closeSourceList(){this._showSourceList=!1,this.requestUpdate()}_closeGrouping(){this._showGrouping=!1}async _toggleGroup(e){const t=this._getGroupingMasterId(),a=t?this.entityIds.indexOf(t):-1,s=a>=0?this.entityObjs[a]:null;if(!s)return;const r=await this._resolveGroupingEntityId(s,t);if(!r)return;const n=this.entityObjs.find(c=>c.entity_id===e);if(!n)return;const o=await this._resolveGroupingEntityId(n,e);if(!o)return;const l=r?this.hass.states[r]:null;Array.isArray(l?.attributes?.group_members)&&l.attributes.group_members.includes(o)?await this.hass.callService("media_player","unjoin",{entity_id:o}):await this.hass.callService("media_player","join",{entity_id:r,group_members:[o]}),this._lastGroupingMasterId=t||e}static getConfigElement(){return document.createElement("yet-another-media-player-editor")}static getStubConfig(e,t){return{entities:(t||[]).filter(a=>a.startsWith("media_player.")).slice(0,2),disable_mass_queue:!1}}async _groupAll(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this.entityObjs[t]:null;if(!a)return;const s=await this._resolveGroupingEntityId(a,e);if(!s)return;const r=this.hass.states[s];if(!this._isGroupCapable(r))return;const n=Array.isArray(r.attributes?.group_members)?r.attributes.group_members:[],o=[];for(const l of this.entityIds){if(l===e)continue;const c=this.entityObjs.find(p=>p.entity_id===l);if(!c)continue;const d=await this._resolveGroupingEntityId(c,l);if(!d)continue;const h=this.hass.states[d];this._isGroupCapable(h)&&!n.includes(d)&&o.push(d)}o.length>0&&await this.hass.callService("media_player","join",{entity_id:s,group_members:o}),this._lastGroupingMasterId=e||this.currentEntityId}async _ungroupAll(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this.entityObjs[t]:null;if(!a)return;const s=await this._resolveGroupingEntityId(a,e);if(!s)return;const r=this.hass.states[s];if(!this._isGroupCapable(r))return;const n=(Array.isArray(r.attributes?.group_members)?r.attributes.group_members:[]).filter(o=>{const l=this.hass.states[o];return this._isGroupCapable(l)});for(const o of n)await this.hass.callService("media_player","unjoin",{entity_id:o});this._lastGroupingMasterId=e||this.currentEntityId}_syncGroupVolume(){const e=this._getGroupingMasterId();if(!e)return;const t=this.entityIds.indexOf(e);if(t===-1)return;const a=this._getGroupingEntityId(t),s=a?this.hass.states[a]:null;if(!s||!this._isGroupCapable(s))return;const r=this._getVolumeEntity(t)||a,n=this.hass.states[r],o=Number(n?.attributes?.volume_level);if(isNaN(o))return;const l=Array.isArray(s.attributes.group_members)?s.attributes.group_members:[],c=new Map;this.entityObjs.forEach((d,h)=>{c.set(this._getGroupingEntityId(h),h)});for(const d of l){if(d===a)continue;const h=c.get(d);if(h!==void 0){const p=this._getVolumeEntity(h)||d;this.hass.callService("media_player","volume_set",{entity_id:p,volume_level:o})}else this.hass.callService("media_player","volume_set",{entity_id:d,volume_level:o})}}_getResolvedEntitiesForCurrentChip(){const e=new Set,t=this._selectedIndex,a=this.entityObjs[t];if(!a)return[];e.add(a.entity_id);const s=this._getActualResolvedMaEntityForState(t);s&&s!==a.entity_id&&e.add(s);const r=this._getVolumeEntity(t);return r&&r!==a.entity_id&&r!==s&&e.add(r),Array.from(e)}_openMoreInfoForEntity(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_handleSelectEntityFromHelper(){if(!this.hass||!this.config?.actions)return;this._lastSelectEntityValues||(this._lastSelectEntityValues=new Map);const e=this.config.actions.filter(t=>t.action==="select_entity"&&t.sync_entity_helper);if(e.length!==0)for(const t of e){const a=t.sync_entity_helper,s=t.sync_entity_type||"yamp_entity",r=this.hass.states[a]?.state;if(!r||r==="unknown"||r==="unavailable")continue;const n=`${a}-${s}`;if(this._lastSelectEntityValues.get(n)===r)continue;this._lastSelectEntityValues.set(n,r);let o=-1;for(let l=0;l<this.entityIds.length;l++){let c;if(s==="yamp_main_entity"?c=this.entityIds[l]:s==="yamp_playback_entity"?c=this._getActivePlaybackEntityId(l):c=this._getActualResolvedMaEntityForState(l)||this.entityIds[l],c===r){o=l;break}}o>=0&&o!==this._selectedIndex&&this._onChipClick(o)}}_updateSelectedEntityHelper(){if(!this.hass||!this.config?.actions)return;const e=this._selectedIndex;if(e==null||!this.entityObjs[e])return;this._lastSyncedActionValues||(this._lastSyncedActionValues=new Map);const t=this.config.actions.filter(a=>a.action==="sync_selected_entity"&&a.sync_entity_helper);if(t.length!==0)for(const a of t){const s=a.sync_entity_helper,r=a.sync_entity_type||"yamp_entity";let n;if(r==="yamp_main_entity"?n=this.entityIds[e]:r==="yamp_playback_entity"?n=this._getActivePlaybackEntityId(e):n=this._getActualResolvedMaEntityForState(e)||this.entityIds[e],!n)continue;const o=`${s}-${r}`;this._lastSyncedActionValues.get(o)!==n&&(this.hass.states[s]?.state!==n&&this.hass.callService("input_text","set_value",{entity_id:s,value:n}),this._lastSyncedActionValues.set(o,n))}}}vt(Ws,"properties",{_aspectRatioCache:{state:!0},_quickGroupingMode:{state:!0},hass:{},config:{},_selectedIndex:{state:!0},_lastPlaying:{state:!0},_shouldDropdownOpenUp:{state:!0},_pinnedIndex:{state:!0},_showSourceList:{state:!0},_holdToPin:{state:!0},_showQueueSuccessMessage:{state:!0},_searchActiveOptionsItem:{state:!0},_activeSearchRowMenuId:{state:!0},_loadingSearchRowMenuId:{state:!0},_errorSearchRowMenuId:{state:!0},_successSearchRowMenuId:{state:!0},_successSearchRowType:{state:!0},_radioModeActive:{state:!0},_showEntityOptions:{state:!0},_showGrouping:{state:!0},_showRemoteControl:{state:!0},_showTransferQueue:{state:!0},_queueOpsTotal:{state:!0},_queueOpsCompleted:{state:!0},_showResolvedEntities:{state:!0},_showSearchInSheet:{state:!0},_addToPlaylistTarget:{state:!0},_showMediaTitleOptions:{state:!0},_dismissMenuAfterPlaylistAdd:{state:!1},_lyricsActive:{state:!0},_massLyrics:{state:!0},_fetchingLyrics:{state:!0},_lyricsError:{state:!0},_lastLyricsTrackId:{state:!0},_lastLyricsEntityId:{state:!0},_showSourceMenu:{state:!0},_volumeDraggingEntity:{state:!0},_dragVolume:{state:!0}}),vt(Ws,"styles",jc),customElements.define("yet-another-media-player",Ws);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Po{constructor(e){this._map=new Map,this._roundAverageSize=!1,this.totalSize=0,e?.roundAverageSize===!0&&(this._roundAverageSize=!0)}set(e,t){const a=this._map.get(e)||0;this._map.set(e,t),this.totalSize+=t-a}get averageSize(){if(this._map.size>0){const e=this.totalSize/this._map.size;return this._roundAverageSize?Math.round(e):e}return 0}getSize(e){return this._map.get(e)}clear(){this._map.clear(),this.totalSize=0}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function zo(i){return i==="horizontal"?"marginLeft":"marginTop"}function cp(i){return i==="horizontal"?"marginRight":"marginBottom"}function dp(i){return i==="horizontal"?"xOffset":"yOffset"}function up(i,e){const t=[i,e].sort();return t[1]<=0?Math.min(...t):t[0]>=0?Math.max(...t):t[0]+t[1]}class hp{constructor(){this._childSizeCache=new Po,this._marginSizeCache=new Po,this._metricsCache=new Map}update(e,t){const a=new Set;Object.keys(e).forEach(s=>{const r=Number(s);this._metricsCache.set(r,e[r]),this._childSizeCache.set(r,e[r][St(t)]),a.add(r),a.add(r+1)});for(const s of a){const r=this._metricsCache.get(s)?.[zo(t)]||0,n=this._metricsCache.get(s-1)?.[cp(t)]||0;this._marginSizeCache.set(s,up(r,n))}}get averageChildSize(){return this._childSizeCache.averageSize}get totalChildSize(){return this._childSizeCache.totalSize}get averageMarginSize(){return this._marginSizeCache.averageSize}get totalMarginSize(){return this._marginSizeCache.totalSize}getLeadingMarginValue(e,t){return this._metricsCache.get(e)?.[zo(t)]||0}getChildSize(e){return this._childSizeCache.getSize(e)}getMarginSize(e){return this._marginSizeCache.getSize(e)}clear(){this._childSizeCache.clear(),this._marginSizeCache.clear(),this._metricsCache.clear()}}class pp extends Nr{constructor(){super(...arguments),this._itemSize={width:100,height:100},this._physicalItems=new Map,this._newPhysicalItems=new Map,this._metricsCache=new hp,this._anchorIdx=null,this._anchorPos=null,this._stable=!0,this._measureChildren=!0,this._estimate=!0}get measureChildren(){return this._measureChildren}updateItemSizes(e){this._metricsCache.update(e,this.direction),this._scheduleReflow()}_getPhysicalItem(e){return this._newPhysicalItems.get(e)??this._physicalItems.get(e)}_getSize(e){return this._getPhysicalItem(e)&&this._metricsCache.getChildSize(e)}_getAverageSize(){return this._metricsCache.averageChildSize||this._itemSize[this._sizeDim]}_estimatePosition(e){const t=this._metricsCache;if(this._first===-1||this._last===-1)return t.averageMarginSize+e*(t.averageMarginSize+this._getAverageSize());if(e<this._first){const a=this._first-e;return this._getPhysicalItem(this._first).pos-(t.getMarginSize(this._first-1)||t.averageMarginSize)-(a*t.averageChildSize+(a-1)*t.averageMarginSize)}else{const a=e-this._last;return this._getPhysicalItem(this._last).pos+(t.getChildSize(this._last)||t.averageChildSize)+(t.getMarginSize(this._last)||t.averageMarginSize)+a*(t.averageChildSize+t.averageMarginSize)}}_getPosition(e){const t=this._getPhysicalItem(e),{averageMarginSize:a}=this._metricsCache;return e===0?this._metricsCache.getMarginSize(0)??a:t?t.pos:this._estimatePosition(e)}_calculateAnchor(e,t){return e<=0?0:t>this._scrollSize-this._viewDim1?this.items.length-1:Math.max(0,Math.min(this.items.length-1,Math.floor((e+t)/2/this._delta)))}_getAnchor(e,t){if(this._physicalItems.size===0)return this._calculateAnchor(e,t);if(this._first<0)return this._calculateAnchor(e,t);if(this._last<0)return this._calculateAnchor(e,t);const a=this._getPhysicalItem(this._first),s=this._getPhysicalItem(this._last),r=a.pos;if(s.pos+this._metricsCache.getChildSize(this._last)<e)return this._calculateAnchor(e,t);if(r>t)return this._calculateAnchor(e,t);let l=this._firstVisible-1,c=-1/0;for(;c<e;)c=this._getPhysicalItem(++l).pos+this._metricsCache.getChildSize(l);return l}_getActiveItems(){this._viewDim1===0||this.items.length===0?this._clearItems():this._getItems()}_clearItems(){this._first=-1,this._last=-1,this._physicalMin=0,this._physicalMax=0;const e=this._newPhysicalItems;this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=e,this._stable=!0}_getItems(){const e=this._newPhysicalItems;this._stable=!0;let t,a;if(this.pin!==null){const{index:c}=this.pin;this._anchorIdx=c,this._anchorPos=this._getPosition(c)}if(t=this._scrollPosition-this._overhang,a=this._scrollPosition+this._viewDim1+this._overhang,a<0||t>this._scrollSize){this._clearItems();return}(this._anchorIdx===null||this._anchorPos===null)&&(this._anchorIdx=this._getAnchor(t,a),this._anchorPos=this._getPosition(this._anchorIdx));let s=this._getSize(this._anchorIdx);s===void 0&&(this._stable=!1,s=this._getAverageSize());const r=this._metricsCache.getMarginSize(this._anchorIdx)??this._metricsCache.averageMarginSize,n=this._metricsCache.getMarginSize(this._anchorIdx+1)??this._metricsCache.averageMarginSize;this._anchorIdx===0&&(this._anchorPos=r),this._anchorIdx===this.items.length-1&&(this._anchorPos=this._scrollSize-n-s);let o=0;for(this._anchorPos+s+n<t&&(o=t-(this._anchorPos+s+n)),this._anchorPos-r>a&&(o=a-(this._anchorPos-r)),o&&(this._scrollPosition-=o,t-=o,a-=o,this._scrollError+=o),e.set(this._anchorIdx,{pos:this._anchorPos,size:s}),this._first=this._last=this._anchorIdx,this._physicalMin=this._anchorPos-r,this._physicalMax=this._anchorPos+s+n;this._physicalMin>t&&this._first>0;){let c=this._getSize(--this._first);c===void 0&&(this._stable=!1,c=this._getAverageSize());let d=this._metricsCache.getMarginSize(this._first);d===void 0&&(this._stable=!1,d=this._metricsCache.averageMarginSize),this._physicalMin-=c;const h=this._physicalMin;if(e.set(this._first,{pos:h,size:c}),this._physicalMin-=d,this._stable===!1&&this._estimate===!1)break}for(;this._physicalMax<a&&this._last<this.items.length-1;){let c=this._getSize(++this._last);c===void 0&&(this._stable=!1,c=this._getAverageSize());let d=this._metricsCache.getMarginSize(this._last);d===void 0&&(this._stable=!1,d=this._metricsCache.averageMarginSize);const h=this._physicalMax;if(e.set(this._last,{pos:h,size:c}),this._physicalMax+=c+d,!this._stable&&!this._estimate)break}const l=this._calculateError();l&&(this._physicalMin-=l,this._physicalMax-=l,this._anchorPos-=l,this._scrollPosition-=l,e.forEach(c=>c.pos-=l),this._scrollError+=l),this._stable&&(this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=e)}_calculateError(){return this._first===0?this._physicalMin:this._physicalMin<=0?this._physicalMin-this._first*this._delta:this._last===this.items.length-1?this._physicalMax-this._scrollSize:this._physicalMax>=this._scrollSize?this._physicalMax-this._scrollSize+(this.items.length-1-this._last)*this._delta:0}_reflow(){const{_first:e,_last:t}=this;super._reflow(),(this._first===-1&&this._last==-1||this._first===e&&this._last===t)&&this._resetReflowState()}_resetReflowState(){this._anchorIdx=null,this._anchorPos=null,this._stable=!0}_updateScrollSize(){const{averageMarginSize:e}=this._metricsCache;this._scrollSize=Math.max(1,this.items.length*(e+this._getAverageSize())+e)}get _delta(){const{averageMarginSize:e}=this._metricsCache;return this._getAverageSize()+e}_getItemPosition(e){return{[this._positionDim]:this._getPosition(e),[this._secondaryPositionDim]:0,[dp(this.direction)]:-(this._metricsCache.getLeadingMarginValue(e,this.direction)??this._metricsCache.averageMarginSize)}}_getItemSize(e){return{[this._sizeDim]:this._getSize(e)||this._getAverageSize(),[this._secondarySizeDim]:this._itemSize[this._secondarySizeDim]}}_viewDim2Changed(){this._metricsCache.clear(),this._scheduleReflow()}}var _p=Object.freeze({__proto__:null,FlowLayout:pp});
