/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ii=globalThis,qi=ii.ShadowRoot&&(ii.ShadyCSS===void 0||ii.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ui=Symbol(),Ja=new WeakMap;let es=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==Ui)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(qi&&e===void 0){const a=t!==void 0&&t.length===1;a&&(e=Ja.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&Ja.set(t,e))}return e}toString(){return this.cssText}};const Tn=i=>new es(typeof i=="string"?i:i+"",void 0,Ui),Bi=(i,...e)=>{const t=i.length===1?i[0]:e.reduce(((a,s,r)=>a+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[r+1]),i[0]);return new es(t,i,Ui)},Mn=(i,e)=>{if(qi)i.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const t of e){const a=document.createElement("style"),s=ii.litNonce;s!==void 0&&a.setAttribute("nonce",s),a.textContent=t.cssText,i.appendChild(a)}},ts=qi?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return Tn(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Fn,defineProperty:Dn,getOwnPropertyDescriptor:jn,getOwnPropertyNames:Pn,getOwnPropertySymbols:On,getPrototypeOf:Rn}=Object,ai=globalThis,is=ai.trustedTypes,zn=is?is.emptyScript:"",Ln=ai.reactiveElementPolyfillSupport,St=(i,e)=>i,Gi={toAttribute(i,e){switch(e){case Boolean:i=i?zn:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},as=(i,e)=>!Fn(i,e),ss={attribute:!0,type:String,converter:Gi,reflect:!1,useDefault:!1,hasChanged:as};Symbol.metadata??=Symbol("metadata"),ai.litPropertyMetadata??=new WeakMap;let ot=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ss){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,t);s!==void 0&&Dn(this.prototype,e,s)}}static getPropertyDescriptor(e,t,a){const{get:s,set:r}=jn(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){const o=s?.call(this);r?.call(this,n),this.requestUpdate(e,o,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ss}static _$Ei(){if(this.hasOwnProperty(St("elementProperties")))return;const e=Rn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(St("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(St("properties"))){const t=this.properties,a=[...Pn(t),...On(t)];for(const s of a)this.createProperty(s,t[s])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[a,s]of t)this.elementProperties.set(a,s)}this._$Eh=new Map;for(const[t,a]of this.elementProperties){const s=this._$Eu(t,a);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const s of a)t.unshift(ts(s))}else e!==void 0&&t.push(ts(e));return t}static _$Eu(e,t){const a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mn(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(s!==void 0&&a.reflect===!0){const r=(a.converter?.toAttribute!==void 0?a.converter:Gi).toAttribute(t,a.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const a=this.constructor,s=a._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const r=a.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Gi;this._$Em=s,this[s]=n.fromAttribute(t,r.type)??this._$Ej?.get(s)??null,this._$Em=null}}requestUpdate(e,t,a){if(e!==void 0){const s=this.constructor,r=this[e];if(a??=s.getPropertyOptions(e),!((a.hasChanged??as)(r,t)||a.useDefault&&a.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:s,wrapped:r},n){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[s,r]of a){const{wrapped:n}=r,o=this[s];n!==!0||this._$AL.has(s)||o===void 0||this.C(s,void 0,r,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((a=>a.hostUpdate?.())),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};ot.elementStyles=[],ot.shadowRootOptions={mode:"open"},ot[St("elementProperties")]=new Map,ot[St("finalized")]=new Map,Ln?.({ReactiveElement:ot}),(ai.reactiveElementVersions??=[]).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hi=globalThis,si=Hi.trustedTypes,rs=si?si.createPolicy("lit-html",{createHTML:i=>i}):void 0,ns="$lit$",ze=`lit$${Math.random().toFixed(9).slice(2)}$`,os="?"+ze,Nn=`<${os}>`,Ze=document,$t=()=>Ze.createComment(""),It=i=>i===null||typeof i!="object"&&typeof i!="function",Vi=Array.isArray,qn=i=>Vi(i)||typeof i?.[Symbol.iterator]=="function",Qi=`[ 	
\f\r]`,Ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ls=/-->/g,cs=/>/g,Ke=RegExp(`>|${Qi}(?:([^\\s"'>=/]+)(${Qi}*=${Qi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ds=/'/g,us=/"/g,hs=/^(?:script|style|textarea|title)$/i,Un=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),m=Un(1),Xe=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ps=new WeakMap,Je=Ze.createTreeWalker(Ze,129);function _s(i,e){if(!Vi(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return rs!==void 0?rs.createHTML(e):e}const Bn=(i,e)=>{const t=i.length-1,a=[];let s,r=e===2?"<svg>":e===3?"<math>":"",n=Ct;for(let o=0;o<t;o++){const l=i[o];let c,u,d=-1,p=0;for(;p<l.length&&(n.lastIndex=p,u=n.exec(l),u!==null);)p=n.lastIndex,n===Ct?u[1]==="!--"?n=ls:u[1]!==void 0?n=cs:u[2]!==void 0?(hs.test(u[2])&&(s=RegExp("</"+u[2],"g")),n=Ke):u[3]!==void 0&&(n=Ke):n===Ke?u[0]===">"?(n=s??Ct,d=-1):u[1]===void 0?d=-2:(d=n.lastIndex-u[2].length,c=u[1],n=u[3]===void 0?Ke:u[3]==='"'?us:ds):n===us||n===ds?n=Ke:n===ls||n===cs?n=Ct:(n=Ke,s=void 0);const _=n===Ke&&i[o+1].startsWith("/>")?" ":"";r+=n===Ct?l+Nn:d>=0?(a.push(c),l.slice(0,d)+ns+l.slice(d)+ze+_):l+ze+(d===-2?o:_)}return[_s(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};class Yt{constructor({strings:e,_$litType$:t},a){let s;this.parts=[];let r=0,n=0;const o=e.length-1,l=this.parts,[c,u]=Bn(e,t);if(this.el=Yt.createElement(c,a),Je.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=Je.nextNode())!==null&&l.length<o;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(ns)){const p=u[n++],_=s.getAttribute(d).split(ze),f=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:f[2],strings:_,ctor:f[1]==="."?Hn:f[1]==="?"?Vn:f[1]==="@"?Qn:ri}),s.removeAttribute(d)}else d.startsWith(ze)&&(l.push({type:6,index:r}),s.removeAttribute(d));if(hs.test(s.tagName)){const d=s.textContent.split(ze),p=d.length-1;if(p>0){s.textContent=si?si.emptyScript:"";for(let _=0;_<p;_++)s.append(d[_],$t()),Je.nextNode(),l.push({type:2,index:++r});s.append(d[p],$t())}}}else if(s.nodeType===8)if(s.data===os)l.push({type:2,index:r});else{let d=-1;for(;(d=s.data.indexOf(ze,d+1))!==-1;)l.push({type:7,index:r}),d+=ze.length-1}r++}}static createElement(e,t){const a=Ze.createElement("template");return a.innerHTML=e,a}}function lt(i,e,t=i,a){if(e===Xe)return e;let s=a!==void 0?t._$Co?.[a]:t._$Cl;const r=It(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(i),s._$AT(i,t,a)),a!==void 0?(t._$Co??=[])[a]=s:t._$Cl=s),s!==void 0&&(e=lt(i,s._$AS(i,e.values),s,a)),e}class Gn{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,s=(e?.creationScope??Ze).importNode(t,!0);Je.currentNode=s;let r=Je.nextNode(),n=0,o=0,l=a[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Zt(r,r.nextSibling,this,e):l.type===1?c=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(c=new Wn(r,this,e)),this._$AV.push(c),l=a[++o]}n!==l?.index&&(r=Je.nextNode(),n++)}return Je.currentNode=Ze,s}p(e){let t=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class Zt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=lt(this,e,t),It(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==Xe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):qn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&It(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ze.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,s=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=Yt.createElement(_s(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===s)this._$AH.p(t);else{const r=new Gn(s,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=ps.get(e.strings);return t===void 0&&ps.set(e.strings,t=new Yt(e)),t}k(e){Vi(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,s=0;for(const r of e)s===t.length?t.push(a=new Zt(this.O($t()),this.O($t()),this,this.options)):a=t[s],a._$AI(r),s++;s<t.length&&(this._$AR(a&&a._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){const a=e.nextSibling;e.remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}let ri=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,s,r){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=b}_$AI(e,t=this,a,s){const r=this.strings;let n=!1;if(r===void 0)e=lt(this,e,t,0),n=!It(e)||e!==this._$AH&&e!==Xe,n&&(this._$AH=e);else{const o=e;let l,c;for(e=r[0],l=0;l<r.length-1;l++)c=lt(this,o[a+l],t,l),c===Xe&&(c=this._$AH[l]),n||=!It(c)||c!==this._$AH[l],c===b?e=b:e!==b&&(e+=(c??"")+r[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}};class Hn extends ri{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}}class Vn extends ri{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}}let Qn=class extends ri{constructor(e,t,a,s,r){super(e,t,a,s,r),this.type=5}_$AI(e,t=this){if((e=lt(this,e,t,0)??b)===Xe)return;const a=this._$AH,s=e===b&&a!==b||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,r=e!==b&&(a===b||s);s&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Wn=class{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){lt(this,e)}};const Yn=Hi.litHtmlPolyfillSupport;Yn?.(Yt,Zt),(Hi.litHtmlVersions??=[]).push("3.3.0");const Zn=(i,e,t)=>{const a=t?.renderBefore??e;let s=a._$litPart$;if(s===void 0){const r=t?.renderBefore??null;a._$litPart$=s=new Zt(e.insertBefore($t(),r),r,void 0,t??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wi=globalThis;let et=class extends ot{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Zn(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Xe}};et._$litElement$=!0,et.finalized=!0,Wi.litElementHydrateSupport?.({LitElement:et});const Kn=Wi.litElementPolyfillSupport;Kn?.({LitElement:et}),(Wi.litElementVersions??=[]).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xn={ATTRIBUTE:1},Jn=i=>(...e)=>({_$litDirective$:i,values:e});let eo=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,a){this._$Ct=e,this._$AM=t,this._$Ci=a}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const to=Jn(class extends eo{constructor(i){if(super(i),i.type!==Xn.ATTRIBUTE||i.name!=="class"||i.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter((e=>i[e])).join(" ")+" "}update(i,[e]){if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter((a=>a!==""))));for(const a in e)e[a]&&!this.nt?.has(a)&&this.st.add(a);return this.render(e)}const t=i.element.classList;for(const a of this.st)a in e||(t.remove(a),this.st.delete(a));for(const a in e){const s=!!e[a];s===this.st.has(a)||this.nt?.has(a)||(s?(t.add(a),this.st.add(a)):(t.remove(a),this.st.delete(a)))}return Xe}});function xe(i,e){const t=i?.[e];return typeof t=="string"&&t.trim()!==""?t:null}async function io(i,e,t){if(!e||typeof e!="string")return t;if(!e.includes("{{")&&!e.includes("{%"))return e;try{const a=(await i.callApi("POST","template",{template:e})||"").toString().trim();return a&&/^([a-z_]+)\.[A-Za-z0-9_]+$/.test(a)?a:t}catch{return t}}async function ao(i,e,t={}){if(!e||typeof e!="string")return e;if(!e.includes("{{")&&!e.includes("{%")){if(/%7B%7B|%7B%25/i.test(e))try{e=decodeURIComponent(e)}catch{}if(!e.includes("{{")&&!e.includes("{%"))return e}let a=e;t&&Object.keys(t).length>0&&(a=`${Object.entries(t).map(([s,r])=>`{% set ${s} = ${JSON.stringify(r)} %}`).join(" ")} ${e}`);try{return(await i.callApi("POST","template",{template:a})||"").toString().trim()}catch(s){return console.warn("yamp: Error resolving template:",e,s),e}}function so(i,e,t={}){if(!e||typeof e!="string")return e;let a=e;if(/%7B%7B|%7B%25/i.test(a))try{a=decodeURIComponent(a)}catch{}if(!a.includes("{{")&&!a.includes("{%"))return a;let s=a,r=!0;return s=s.replace(/\{\{\s*(.*?)\s*\}\}/g,(n,o)=>{let l=o.trim(),c=!1;l.endsWith("| urlencode")?(c=!0,l=l.replace(/\|\s*urlencode$/,"").trim()):l.endsWith("|urlencode")&&(c=!0,l=l.replace(/\|urlencode$/,"").trim());let u=l.match(/^state_attr\(\s*(['"]?)([\w.]+)\1\s*,\s*(['"]?)([\w_]+)\3\s*\)$/);if(u){let p=u[2],_=t[p]!==void 0&&!u[1]?t[p]:p,f=u[4];const g=i?.states?.[_];if(g&&g.attributes&&g.attributes[f]!==void 0){let y=String(g.attributes[f]);return c?encodeURIComponent(y):y}return""}let d=l.match(/^states\(\s*(['"]?)([\w.]+)\1\s*\)$/);if(d){let p=d[2],_=t[p]!==void 0&&!d[1]?t[p]:p;const f=i?.states?.[_];if(f&&f.state!==void 0){let g=String(f.state);return c?encodeURIComponent(g):g}return""}if(/^[\w_]+$/.test(l)&&t[l]!==void 0){let p=String(t[l]);return c?encodeURIComponent(p):p}return r=!1,n}),!r||s.includes("{%")?null:s}function ro(i,e){if(!i?.states||!e)return[];const t=[],a=i.states[e];if(!a)return[];const s=a.attributes?.device_id,r=a.attributes?.friendly_name||e;for(const[n,o]of Object.entries(i.states))if(n.startsWith("button.")&&o.attributes){const l=o.attributes.device_id,c=o.attributes.friendly_name||n;s&&l===s?t.push({entity_id:n,friendly_name:c,device_class:o.attributes.device_class,reason:"same_device"}):(c.toLowerCase().includes(r.toLowerCase())||r.toLowerCase().includes(c.toLowerCase()))&&t.push({entity_id:n,friendly_name:c,device_class:o.attributes.device_class,reason:"name_similarity"})}return t}function no(i,e){if(!i?.states||!e)return null;const t=i.states[e];return t&&t.attributes&&(t.attributes.media_content_id||t.attributes.media_content_type||t.attributes.media_album_name||t.attributes.media_artist||t.attributes.media_title)?t:null}function tt(i){return!i||!i.attributes?!1:i.attributes.app_id==="music_assistant"||i.attributes.mass_player_type!==void 0}function oo(i){if(!i)return"";const e=i.media_type||i.media_class||i.media_content_type,t=i.name||i.title||i.media_title||"Unknown Title",a=i.artists?.[0],s=i.artist||a?.name||(typeof a=="string"?a:void 0)||i.media_artist||"Unknown Artist";return e==="track"?`${t} - ${s}`:e==="album"?`${t} - ${s}`:t}function ms(i,e="",t=[],a=null){if(!i||!i.attributes)return null;const s=i.attributes,r=i.entity_id;s.app_id;let n=null,o=null;if(t&&Array.isArray(t)&&t.length){const l=(d,p)=>{if(d)return d[p]},c=[["media_title","media_title"],["media_artist","media_artist"],["media_album_name","media_album_name"],["media_content_id","media_content_id"],["media_channel","media_channel"],["app_name","app_name"],["media_content_type","media_content_type"],["entity_id","entity_id"],["entity_state","entity_state"]];let u=t.find(d=>c.some(([p,_])=>{const f=l(d,_);return f===void 0?!1:(p==="entity_id"?r:p==="entity_state"?i?.state:s[p])===f}));u||xe(s,"entity_picture_local")||xe(s,"entity_picture")||xe(s,"album_art")||(u=t.find(d=>d?.missing_art_url),u?.missing_art_url&&(u={...u,image_url:u.missing_art_url})),u?.image_url&&(n=u.image_url,o=u?.size_percentage)}return n||(n=xe(s,"entity_picture_local")||xe(s,"entity_picture")||xe(s,"album_art")||null),!n&&a&&(a==="smart"?s.media_title==="TV"||s.media_channel||s.app_id==="tv"||s.app_id==="androidtv"?n="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI2OCIgeT0iMTIwIiB3aWR0aD0iNDgiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI4MCIgeT0iMTMwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8L3N2Zz4K":n="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=":typeof a=="string"&&(n=a)),n&&e&&!n.startsWith("http")&&(n=e+n),{url:n,sizePercentage:o}}function lo({idx:i,selected:e,playing:t,name:a,art:s,icon:r,pinned:n,holdToPin:o,maActive:l,onChipClick:c,onIconClick:u,onPinClick:d,onPointerDown:p,onPointerMove:_,onPointerUp:f,objectFit:g,quickGroupingState:y,onQuickGroupClick:k,onDoubleClick:x}){const M=g?`object-fit: ${g};`:"";return m`
    <button class="chip"
            ?selected=${e}
            ?playing=${t}
            ?ma-active=${l}
            @dblclick=${x}
            @click=${()=>c(i)}
            @pointerdown=${p}
            @pointermove=${_}
            @pointerup=${f}
            @pointerleave=${f}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
      <span class="chip-icon">
        ${s?m`<img class="chip-mini-art" src="${s}" style="${M}" onerror="this.style.display='none'" />`:m`<ha-icon .icon=${r} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${a}
      </span>
      ${t?m`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          `:b}
      ${n?m`
            <span class="chip-pin-inside" @click=${E=>{E.stopPropagation(),d(i,E)}} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `:m`<span class="chip-pin-spacer"></span>`}
      ${fs({idx:i,quickGroupingState:y,onQuickGroupClick:k})}
    </button>
  `}function co({idx:i,selected:e,playing:t,groupName:a,art:s,icon:r,pinned:n,holdToPin:o,maActive:l,onChipClick:c,onIconClick:u,onPinClick:d,onPointerDown:p,onPointerMove:_,onPointerUp:f,objectFit:g,quickGroupingState:y,onQuickGroupClick:k,onDoubleClick:x}){const M=g?`object-fit: ${g};`:"";return m`
    <button class="chip group"
            ?selected=${e}
            ?ma-active=${l}
            @dblclick=${x}
            @click=${()=>c(i)}
            @pointerdown=${p}
            @pointermove=${_}
            @pointerup=${f}
            @pointerleave=${f}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
      <span class="chip-icon"
            style="cursor:pointer;"
            @click=${E=>{E.stopPropagation(),u&&u(i,E)}}>
        ${s?m`<img class="chip-mini-art"
                      src="${s}"
                      style="cursor:pointer;${M}"
                      onerror="this.style.display='none'"
                      @click=${E=>{E.stopPropagation(),u&&u(i,E)}}/>`:m`<ha-icon .icon=${r}
                          style="font-size:28px;cursor:pointer;"
                          @click=${E=>{E.stopPropagation(),u&&u(i,E)}}></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${a}
      </span>
      ${t?m`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          `:b}
      ${n?m`
            <span class="chip-pin-inside" @click=${E=>{E.stopPropagation(),d(i,E)}} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `:m`<span class="chip-pin-spacer"></span>`}
      ${fs({idx:i,quickGroupingState:y,onQuickGroupClick:k})}
    </button>
  `}function fs({idx:i,quickGroupingState:e,onQuickGroupClick:t}){if(!e||!e.isGroupable)return b;const{isPrimary:a,isBusy:s,grouped:r,tooltip:n}=e;return m`
    <span class="chip-quick-group" 
          @click=${o=>{o.stopPropagation(),t&&!s&&!a&&t(i,o)}} 
          title=${n||(a?"Primary":s?"Unavailable":r?"Unjoin":"Join")} 
          style="${a?"cursor:default;opacity:0.7;":s?"opacity:0.5;cursor:not-allowed;":""}">
      <ha-icon .icon=${a?"mdi:star-circle-outline":r?"mdi:minus":"mdi:plus"}></ha-icon>
    </span>
  `}function uo({onPin:i,onHoldEnd:e,holdTime:t=600,moveThreshold:a=8}){let s=null,r=null,n=null,o=!1;return{pointerDown:(l,c)=>{r=l.clientX,n=l.clientY,o=!1,s=setTimeout(()=>{o||(i(c,l),e&&e(c))},t)},pointerMove:(l,c)=>{if(s&&r!==null&&n!==null){const u=Math.abs(l.clientX-r),d=Math.abs(l.clientY-n);(u>a||d>a)&&(o=!0,clearTimeout(s),s=null)}},pointerUp:(l,c)=>{s&&(clearTimeout(s),s=null),r=null,n=null,o=!1}}}function gs({groupedSortedEntityIds:i,entityIds:e,selectedEntityId:t,pinnedIndex:a,holdToPin:s,getChipName:r,getActualGroupMaster:n,getIsChipPlaying:o,getChipArt:l,getIsMaActive:c,isIdle:u,hass:d,artworkHostname:p="",mediaArtworkOverrides:_=[],fallbackArtwork:f=null,onChipClick:g,onIconClick:y,onPointerClick:k,onPinClick:x,onPointerDown:M,onPointerMove:E,onPointerUp:G,quickGroupingMode:U,getQuickGroupingState:O,onQuickGroupClick:z,onDoubleClick:N}){return!i||!i.length?b:m`
    ${i.map(C=>{if(C.length>1){const I=n(C),R=e.indexOf(I),B=d?.states?.[I],te=typeof o=="function"?o(I,t===I):B?.state==="playing",ie=typeof l=="function"?l(I):ms(B,p,_,f),Z=ie?.url,ne=ie?.objectFit,oe=B?.attributes?.icon||"mdi:cast",Ae=typeof c=="function"?c(I):!1;return co({idx:R,selected:t===I,playing:te,groupName:r(I)+(C.length>1?` [${C.length}]`:""),art:Z,icon:oe,pinned:a===R,holdToPin:s,maActive:Ae,onChipClick:g,onIconClick:y,onPinClick:x,onPointerDown:pe=>M(pe,R),onPointerMove:pe=>E(pe,R),onPointerUp:pe=>G(pe,R),objectFit:ne,quickGroupingState:U&&typeof O=="function"?O(I):null,onQuickGroupClick:z,onDoubleClick:N})}else{const I=C[0],R=e.indexOf(I),B=d?.states?.[I],te=typeof o=="function"?o(I,t===I):B?.state==="playing",ie=typeof l=="function"?l(I):ms(B,p,_,f),Z=ie?.url,ne=ie?.objectFit,oe=t===I?!u&&Z:te&&Z,Ae=B?.attributes?.icon||"mdi:cast",pe=typeof c=="function"?c(I):!1;return lo({idx:R,selected:t===I,playing:te,name:r(I),art:oe,icon:Ae,pinned:a===R,holdToPin:s,maActive:pe,onChipClick:g,onPinClick:x,onPointerDown:ae=>M(ae,R),onPointerMove:ae=>E(ae,R),onPointerUp:ae=>G(ae,R),objectFit:ne,quickGroupingState:U&&typeof O=="function"?O(I):null,onQuickGroupClick:z,onDoubleClick:N})}})}
  `}function ho({actions:i,onActionChipClick:e}){return i?.length?m`
    <div class="action-chip-row">
      ${i.map((t,a)=>m`
          <button class="action-chip" @click=${()=>e(a)}>
            ${t.icon?m`<ha-icon .icon=${t.icon} style="font-size: 22px; margin-right: ${t.name?"8px":"0"};"></ha-icon>`:b}
            ${t.name||""}
          </button>
        `)}
    </div>
  `:b}var po={common:{not_found:"Entity not found.",search:"Search",power:"Power",favorite:"Favorite",loading:"Loading...",no_results:"No results.",close:"Close",vol_up:"Volume Up",vol_down:"Volume Down",media_player:"Media Player",edit_entity:"Edit Entity Settings",edit_action:"Edit Action Settings",mute:"Mute",unmute:"Unmute",seek:"Seek",volume:"Volume",play_now:"Play Now",more_options:"More Options",unavailable:"Unavailable",back:"Back",cancel:"Cancel",reset_default:"Reset to default"},editor:{tabs:{entities:"Entities",behavior:"Behavior",look_and_feel:"Look and Feel",artwork:"Artwork",actions:"Actions"},placeholders:{search:"Search music..."},sections:{artwork:{general:{title:"General Settings",description:"Global controls for how artwork is displayed and retrieved."},idle:{title:"Idle Artwork",description:"Show a static image or entity snapshot whenever nothing is playing."},overrides:{title:"Artwork Overrides",description:"Overrides are evaluated from top to bottom. Drag to reorder."}},entities:{title:"Entities*",description:"Add the media players you want to control. Drag entities to reorder the chip row."},behavior:{idle_chips:{title:"Idle & Chips",description:"Choose when the card goes idle and how entity chips behave."},interactions_search:{title:"Interactions & Search",description:"Fine-tune how entities are pinned and how many results show at once."}},look_and_feel:{theme_layout:{title:"Theme & Layout",description:"Match dashboard styling and control the overall footprint."},controls_typography:{title:"Controls & Typography",description:"Tune button sizing, entity labels, and adaptive text."},collapsed_idle:{title:"Collapsed & Idle States",description:"Control when the card collapses and which views show while idle."}},actions:{title:"Actions",description:"Build the action chips that appear in the card or its menu. Drag to reorder, click the pencil to configure each action."}},subtitles:{idle_timeout:"Time in milliseconds before the card enters idle mode. Set to 0 to disable idle behavior.",show_chip_row:'"Auto" hides the chip row when only one entity is configured. "In Menu" moves the chips into the menu overlay. "In Menu on Idle" shows chips inline when active but moves them to the menu when idle.',dim_chips:"When the card enters idle mode with an image, dim the entity and action chips for a cleaner look.",hold_to_pin:"Long press on entity chips instead of short press to pin them, preventing auto-switching during playback.",always_show_group:"Quick grouping controls (+/-/star) will be visible by default on page load. You can still toggle it manually via double-tap.",disable_autofocus:"Keep the search box from stealing focus so on-screen keyboards stay hidden.",search_within_filter:"Enable this to search within the current active filter (Favorites, Recently Played, etc) instead of clearing it.",close_search_on_play:"Automatically close the search screen when a track is played.",pin_search_headers:"Keep search input and filters fixed at the top while scrolling results.",hide_search_headers_on_idle:"Hide search input and filters when the player is idle.",disable_mass:"Disable the optional Mass Queue integration even if it is installed.",swap_pause_stop:"Replace the pause button with stop while using the modern layout.",adaptive_controls:"Let the playback buttons grow or shrink to fit the available space.",hide_menu_player:"When chips live in the menu, hide the entity label at the bottom of the card.",adaptive_text:"Choose which text groups should scale with available space (leave empty to disable adaptive text).",collapse_expand:"Always Collapsed creates mini player mode. Expand on Search temporarily expands when searching.",idle_screen:"Choose which screen to display automatically when the card becomes idle.",hide_controls:"Select which controls to hide for this entity (all are shown by default)",hide_search_chips:"Hide specific search filter chips for this entity",follow_active_entity:"When enabled, the volume entity will automatically follow the active playback entity. Note: This overrides the selected volume entity.",search_limit_full:"Maximum number of search results to display (1-1000, default: 20)",default_search_filter_full:"Choose which filter is active by default when the search screen opens.",result_sorting_full:"Choose how results are ordered.",card_height_full:"Leave blank for automatic height",control_layout_full:"Choose between the legacy evenly sized controls or the modern Home Assistant layout.",artwork_extend:"Let the artwork background continue underneath the chip and action rows.",artwork_extend_label:"Extend artwork",no_artwork_overrides:"No artwork overrides configured. Use the plus button below to add one.",entity_current_hint:"Use 'entity_id: current' to target the card's currently selected media player entity. Note: The 'Test Action' button will be disabled when using this feature.",service_data_note:"Changes to the service data below are not committed to the config until the 'Save Service Data' button is clicked!",jinja_template_hint:"Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:",jinja_template_vol_hint:"Enter a Jinja template that resolves to an entity_id (e.g. media_player.office_homepod or remote.soundbar). Example switching volume entity based on a boolean:",not_available_alt_collapsed:"Not available with Alternate Progress Bar or Always Collapsed mode",not_available_collapsed:"Not available when Always Collapsed is enabled",only_available_collapsed:"Only available when Always Collapsed is enabled",only_available_modern:"Only available with Modern layout",image_url_helper:"Enter a direct URL to an image or a local file path",selected_entity_helper:"Input text helper that will be updated with the currently selected media player entity ID.",sync_entity_type:"Choose which entity ID to sync to the helper (defaults to Music Assistant entity if configured).",disable_auto_select:"Prevent this entity's chip from automatically being selected when it starts playing.",search_view:"Choose between a standard list or a card-based grid for search results.",search_card_columns:"Specify how many columns to use in the card view. Artwork will scale automatically."},titles:{edit_entity:"Edit Entity",edit_action:"Edit Action",service_data:"Service Data",add_artwork_override:"Add Artwork Override"},labels:{dim_chips:"Dim Chips on Idle",hold_to_pin:"Hold to Pin",always_show_group:"Quick Group by Default",disable_autofocus:"Disable Search Autofocus",keep_filters:"Keep Filters on Search",dismiss_on_play:"Dismiss search on play",pin_headers:"Pin search headers",hide_search_headers_on_idle:"Hide search headers on idle",default_search_filter:"Default Search Filter",disable_mass:"Disable Mass Queue",match_theme:"Match Theme",alt_progress:"Alternate Progress Bar",display_timestamps:"Display Timestamps",swap_pause_stop:"Swap Pause with Stop",adaptive_controls:"Adaptive Control Size",hide_active_entity:"Hide Active Entity Label",collapse_on_idle:"Collapse on Idle",hide_menu_player_toggle:"Hide Menu Player",always_collapsed:"Always Collapsed",expand_on_search:"Expand on Search",script_var:"Script Variable (yamp_entity)",use_ma_template:"Use template for Music Assistant Entity",use_vol_template:"Use template for Volume Entity",follow_active_entity:"Volume Entity Follows Active Entity",use_url_path:"Use URL or Path",adaptive_text_elements:"Adaptive Text Size Elements",disable_auto_select:"Disable Auto-Select"},fields:{artwork_fit:"Artwork Fit",artwork_position:"Artwork Position",artwork_hostname:"Artwork Hostname",match_field:"Match Field",match_value:"Match Value",size_percent:"Size (%)",object_fit:"Object Fit",idle_timeout:"Idle Timeout (ms)",show_chip_row:"Show Chip Row",search_limit:"Search Results Limit",result_sorting:"Result Sorting",vol_step:"Volume Step (0.05 = 5%)",card_height:"Card Height (px)",control_layout:"Control Layout",save_service_data:"Save Service Data",image_url:"Image URL",fallback_image_url:"Fallback Image URL",move_to_main:"Move action to main chips",move_to_menu:"Move action into menu",delete_action:"Delete Action",revert_service_data:"Revert to Saved Service Data",test_action:"Test Action",volume_mode:"Volume Mode",idle_screen:"Idle Screen",name:"Name",hidden_controls:"Hidden Controls",ma_template:"Music Assistant Entity Template (Jinja)",hidden_chips:"Hidden Search Filter Chips",vol_template:"Volume Entity Template (Jinja)",icon:"Icon",action_type:"Action Type",menu_item:"Menu Item",nav_path:"Navigation Path",service:"Service",service_data:"Service Data",idle_image_entity:"Idle Image Entity",match_entity:"Match Entity",ma_entity:"Music Assistant Entity",vol_entity:"Volume Entity",selected_entity_helper:"Selected Entity Helper",sync_entity_type:"Sync Entity Type",placement:"Placement",card_trigger:"Card Trigger",search_view:"Search Result View",search_card_columns:"Card Columns"},action_types:{menu:"Open a Card Menu Item",service:"Call a Service",navigate:"Navigate",sync_selected_entity:"Sync Selected Entity"},action_helpers:{sync_selected_entity:"Sync Selected Entity \u2192",select_helper:"(select helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant Entity if configured)",yamp_main_entity:"yamp_main_entity (Main Media Player Entity)",yamp_playback_entity:"yamp_playback_entity (Current Active Playback Entity)"},placements:{chip:"Action Chip",menu:"In Menu",hidden:"Hidden (Artwork Tap)",not_triggerable:"Not Triggerable"},triggers:{none:"None",tap:"Tap",hold:"Hold",double_tap:"Double Tap",swipe_left:"Swipe Left",swipe_right:"Swipe Right"},search_view_options:{list:"List",card:"Card"}},card:{sections:{details:"Now Playing Details",menu:"Menu & Search Sheets",action_chips:"Action Chips"},media_controls:{shuffle:"Shuffle",previous:"Previous",play_pause:"Play/Pause",stop:"Stop",next:"Next",repeat:"Repeat"},menu:{more_info:"More Info",search:"Search",source:"Source",transfer_queue:"Transfer Queue",group_players:"Group Players",select_entity:"Select Entity for More Info",transfer_to:"Transfer Queue To",no_players:"No other Music Assistant players available."},grouping:{title:"Group Players",sync_volume:"Sync Volume",group_all:"Group All",ungroup_all:"Ungroup All",unavailable:"Player is unavailable",no_players:"No other group-capable players available.",master:"Master",joined:"Joined",available:"Available",current:"Current",unjoin_from:"Unjoin from {master}",join_with:"Join with {master}"}},search:{favorites:"Favorites",recently_played:"Recently Played",next_up:"Next Up",recommendations:"Recommendations",radio_mode:"Radio Mode",close:"Close Search",no_results:"No results.",play_next:"Play next",replace_play:"Replace existing queue and play now",replace:"Replace queue",add_queue:"Add to the end of the queue",move_up:"Move Up",move_down:"Move Down",move_next:"Move to Next",remove:"Remove from Queue",added:"Added to queue!",labels:{replace:"Replace",next:"Next",replace_next:"Replace Next",add:"Add"},results:"results",result:"result",filters:{all:"All",artist:"Artist",album:"Album",track:"Track",playlist:"Playlist",radio:"Radio",music:"Music",station:"Station",podcast:"Podcast",audiobook:"Audiobook"},search_artist:"Search for this artist"}},_o={common:{not_found:"Entit\xE4t nicht gefunden.",search:"Suchen",power:"Ein/Aus",favorite:"Favorit",loading:"Laden...",no_results:"Keine Ergebnisse.",close:"Schlie\xDFen",vol_up:"Lauter",vol_down:"Leiser",media_player:"Mediaplayer",edit_entity:"Entit\xE4tseinstellungen bearbeiten",edit_action:"Aktionseinstellungen bearbeiten",mute:"Stumm",unmute:"Stummschaltung aufheben",seek:"Suchen",volume:"Lautst\xE4rke",play_now:"Jetzt abspielen",more_options:"Weitere Optionen",unavailable:"Nicht verf\xFCgbar",back:"Zur\xFCck",cancel:"Abbrechen",reset_default:"Auf Standard zur\xFCcksetzen"},editor:{tabs:{entities:"Entit\xE4ten",behavior:"Verhalten",look_and_feel:"Design",artwork:"Artwork",actions:"Aktionen"},placeholders:{search:"Musik suchen..."},sections:{artwork:{general:{title:"Allgemeine Einstellungen",description:"Globale Steuerung der Artwork-Anzeige und -Abrufung."},idle:{title:"Artwork im Leerlauf",description:"Zeigt ein statisches Bild oder einen Entit\xE4ts-Schnappschuss an, wenn nichts abgespielt wird."},overrides:{title:"Artwork-\xDCberschreibungen",description:"\xDCberschreibungen werden von oben nach unten ausgewertet. Zum Neusortieren ziehen."}},entities:{title:"Entit\xE4ten*",description:"F\xFCgen Sie die zu steuernden Mediaplayer hinzu. Entit\xE4ten ziehen, um sie neu anzuordnen."},behavior:{idle_chips:{title:"Leerlauf & Chips",description:"W\xE4hlen Sie, wann die Karte in den Leerlauf wechselt und wie sich Entit\xE4ts-Chips verhalten."},interactions_search:{title:"Interaktionen & Suche",description:"Feineinstellung des Anpinnens von Entit\xE4ten und der Anzahl der Suchergebnisse."}},look_and_feel:{theme_layout:{title:"Theme & Layout",description:"Anpassung an das Dashboard-Styling und Kontrolle des Platzbedarfs."},controls_typography:{title:"Steuerung & Typografie",description:"Anpassung von Schaltfl\xE4chengr\xF6\xDFe, Entit\xE4ts-Labels und adaptivem Text."},collapsed_idle:{title:"Eingeklappte & Leerlaufzust\xE4nde",description:"Steuerung der Karteneinklappung und der Ansichten im Leerlauf."}},actions:{title:"Aktionen",description:"Erstellen Sie Aktions-Chips f\xFCr die Karte oder das Men\xFC. Ziehen zum Sortieren, Stift zum Konfigurieren anklicken."}},subtitles:{idle_timeout:"Zeit in Millisekunden vor dem Wechsel in den Leerlaufmodus. 0 zum Deaktivieren.",show_chip_row:'"Auto" blendet die Chip-Leiste bei nur einer Entit\xE4t aus. "Im Men\xFC" verschiebt sie ins Men\xFC. "Im Men\xFC bei Inaktivit\xE4t" zeigt Chips inline wenn aktiv, verschiebt sie aber ins Men\xFC bei Inaktivit\xE4t.',dim_chips:"Entit\xE4ts- und Aktions-Chips im Leerlauf mit Bild abdunkeln f\xFCr einen sauberen Look.",hold_to_pin:"Langes Dr\xFCcken statt kurzem Dr\xFCcken zum Anpinnen, um automatisches Umschalten zu verhindern.",always_show_group:"Schnellgruppierungs-Steuerelemente (+/-/Stern) sind standardm\xE4\xDFig beim Laden der Seite sichtbar. Sie k\xF6nnen sie weiterhin manuell per Doppeltipp umschalten.",disable_autofocus:"Suchfeld-Autofokus deaktivieren, damit Bildschirmtastaturen ausgeblendet bleiben.",search_within_filter:"Innerhalb des aktiven Filters suchen (Favoriten, etc.), anstatt ihn zu l\xF6schen.",close_search_on_play:"Suchbildschirm beim Abspielen automatisch schlie\xDFen.",pin_search_headers:"Sucheingabe und Filter beim Scrollen oben fixieren.",hide_search_headers_on_idle:"Sucheingabe und Filter im Leerlauf ausblenden.",disable_mass:"Optionale Mass Queue Integration deaktivieren, auch wenn sie installiert ist.",swap_pause_stop:"Pause-Taste durch Stop-Taste im modernen Layout ersetzen.",adaptive_controls:"Wiedergabetasten an verf\xFCgbaren Platz anpassen.",hide_menu_player:"Entit\xE4ts-Label unten ausblenden, wenn Chips im Men\xFC sind.",adaptive_text:"Textgruppen w\xE4hlen, die mit dem Platz skalieren (leer lassen zum Deaktivieren).",collapse_expand:"Immer eingeklappt aktiviert den Mini-Player-Modus. Bei Suche ausklappen aktiviert ihn tempor\xE4r.",idle_screen:"W\xE4hlen Sie, welcher Bildschirm im Leerlauf automatisch angezeigt wird.",hide_controls:"W\xE4hlen Sie Steuerelemente aus, die f\xFCr diese Entit\xE4t ausgeblendet werden sollen.",hide_search_chips:"Bestimmte Suchfilter-Chips f\xFCr diese Entit\xE4t ausblenden.",follow_active_entity:"Lautst\xE4rke-Entit\xE4t folgt automatisch der aktiven Wiedergabe-Entit\xE4t.",search_limit_full:"Maximale Anzahl an Suchergebnissen (1-1000, Standard: 20).",default_search_filter_full:"W\xE4hlen Sie den Filter, der beim \xD6ffnen der Suche standardm\xE4\xDFig aktiv ist.",result_sorting_full:"Sortierung der Suchergebnisse w\xE4hlen. Standard beh\xE4lt die Quellreihenfolge bei.",card_height_full:"Leer lassen f\xFCr automatische H\xF6he.",control_layout_full:"W\xE4hlen Sie zwischen manuellem oder modernem Home Assistant Layout.",artwork_extend:"Artwork-Hintergrund unter die Chip- und Aktionsleisten erweitern.",artwork_extend_label:"Artwork erweitern",no_artwork_overrides:"Keine Artwork-\xDCberschreibungen konfiguriert.",entity_current_hint:"'entity_id: current' verwenden, um den aktuell ausgew\xE4hlten Mediaplayer anzusteuern.",service_data_note:"\xC4nderungen an den Servicedaten werden erst beim Klicken auf 'Servicedaten speichern' \xFCbernommen!",jinja_template_hint:"Jinja-Template eingeben, das eine entity_id ergibt.",jinja_template_vol_hint:"Jinja-Template eingeben, das eine Lautst\xE4rke-entity_id ergibt.",not_available_alt_collapsed:"Nicht verf\xFCgbar mit alternativem Fortschrittsbalken oder im Modus 'Immer eingeklappt'.",not_available_collapsed:"Nicht verf\xFCgbar, wenn 'Immer eingeklappt' aktiviert ist.",only_available_collapsed:"Nur verf\xFCgbar, wenn 'Immer eingeklappt' aktiviert ist.",only_available_modern:"Nur verf\xFCgbar im modernen Layout.",image_url_helper:"Direkte Bild-URL oder lokalen Dateipfad eingeben.",selected_entity_helper:"Input-Text-Helper, der mit der aktuell ausgew\xE4hlten Mediaplayer-Entit\xE4ts-ID aktualisiert wird.",sync_entity_type:"W\xE4hlen Sie, welche Entit\xE4ts-ID mit dem Helper synchronisiert werden soll (Standard: Music Assistant Entit\xE4t, falls konfiguriert).",disable_auto_select:"Verhindert, dass der Chip dieser Entit\xE4t automatisch ausgew\xE4hlt wird, wenn die Wiedergabe startet.",search_view:"W\xE4hlen Sie zwischen einer Standardliste oder einem kartenbasierten Raster f\xFCr Suchergebnisse.",search_card_columns:"Geben Sie an, wie viele Spalten in der Kartenansicht verwendet werden sollen. Das Artwork wird automatisch skaliert."},titles:{edit_entity:"Entit\xE4t bearbeiten",edit_action:"Aktion bearbeiten",service_data:"Servicedaten",add_artwork_override:"Artwork-\xDCberschreibung hinzuf\xFCgen"},labels:{dim_chips:"Chips im Leerlauf abdunkeln",hold_to_pin:"Gedr\xFCckt halten zum Anpinnen",always_show_group:"Schnellgruppierung standardm\xE4\xDFig aktivieren",disable_autofocus:"Such-Autofocus deaktivieren",keep_filters:"Filter bei Suche beibehalten",dismiss_on_play:"Suche beim Abspielen beenden",default_search_filter:"Standard-Suchfilter",pin_headers:"Such-Header fixieren",hide_search_headers_on_idle:"Such-Header im Leerlauf ausblenden",disable_mass:"Mass Queue deaktivieren",match_theme:"Theme anpassen",alt_progress:"Alternativer Fortschrittsbalken",display_timestamps:"Zeitstempel anzeigen",swap_pause_stop:"Pause durch Stop ersetzen",adaptive_controls:"Adaptive Tastengr\xF6\xDFe",hide_active_entity:"Aktives Entit\xE4ts-Label ausblenden",collapse_on_idle:"Bei Leerlauf einklappen",hide_menu_player_toggle:"Men\xFC-Player ausblenden",always_collapsed:"Immer eingeklappt",expand_on_search:"Bei Suche ausklappen",script_var:"Skript-Variable (yamp_entity)",use_ma_template:"Template f\xFCr Music Assistant Entit\xE4t verwenden",use_vol_template:"Template f\xFCr Lautst\xE4rke-Entit\xE4t verwenden",follow_active_entity:"Lautst\xE4rke folgt aktiver Entit\xE4t",use_url_path:"URL oder Pfad verwenden",adaptive_text_elements:"Elemente f\xFCr adaptive Textgr\xF6\xDFe",disable_auto_select:"Auto-Auswahl deaktivieren"},fields:{artwork_fit:"Artwork-Anpassung",artwork_position:"Artwork-Position",artwork_hostname:"Artwork-Hostname",match_field:"Match-Feld",match_value:"Match-Wert",size_percent:"Gr\xF6\xDFe (%)",object_fit:"Object-Fit",idle_timeout:"Leerlauf-Timeout (ms)",show_chip_row:"Chip-Leiste anzeigen",search_limit:"Suchlimit",result_sorting:"Ergebnissortierung",vol_step:"Lautst\xE4rke-Schritt (0.05 = 5%)",card_height:"Kartenh\xF6he (px)",control_layout:"Steuerungs-Layout",save_service_data:"Servicedaten speichern",image_url:"Bild-URL",fallback_image_url:"Fallback Bild-URL",move_to_main:"Aktion in Haupt-Chips verschieben",move_to_menu:"Aktion ins Men\xFC verschieben",delete_action:"Aktion l\xF6schen",revert_service_data:"Auf gespeicherte Servicedaten zur\xFCcksetzen",test_action:"Aktion testen",volume_mode:"Lautst\xE4rke-Modus",idle_screen:"Leerlauf-Bildschirm",name:"Name",hidden_controls:"Ausgeblendete Steuerungen",ma_template:"Music Assistant Entit\xE4ts-Template (Jinja)",hidden_chips:"Ausgeblendete Suchfilter-Chips",vol_template:"Lautst\xE4rke-Entit\xE4ts-Template (Jinja)",icon:"Icon",action_type:"Aktionstyp",menu_item:"Men\xFCpunkt",nav_path:"Navigationspfad",service:"Dienst",service_data:"Servicedaten",idle_image_entity:"Leerlauf-Bild-Entit\xE4t",match_entity:"Match-Entit\xE4t",ma_entity:"Music Assistant Entit\xE4t",vol_entity:"Lautst\xE4rke-Entit\xE4t",selected_entity_helper:"Ausgew\xE4hlter Entit\xE4ts-Helper",sync_entity_type:"Synchronisierungs-Entit\xE4tstyp",placement:"Platzierung",card_trigger:"Karten-Trigger",search_view:"Suchergebnis-Ansicht",search_card_columns:"Kartenspalten"},action_types:{menu:"Kartenmen\xFCpunkt \xF6ffnen",service:"Dienst aufrufen",navigate:"Navigieren",sync_selected_entity:"Ausgew\xE4hlte Entit\xE4t synchronisieren"},action_helpers:{sync_selected_entity:"Entit\xE4t synchronisieren \u2192",select_helper:"(Helper ausw\xE4hlen)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant Entit\xE4t, falls konfiguriert)",yamp_main_entity:"yamp_main_entity (Haupt-Mediaplayer-Entit\xE4t)",yamp_playback_entity:"yamp_playback_entity (Aktuelle aktive Wiedergabe-Entit\xE4t)"},placements:{chip:"Aktions-Chip",menu:"Im Men\xFC",hidden:"Ausgeblendet (Artwork-Tippen)",not_triggerable:"Nicht triggerbar"},triggers:{none:"Keiner",tap:"Tippen",hold:"Halten",double_tap:"Doppeltippen",swipe_left:"Nach links wischen",swipe_right:"Nach rechts wischen"},search_view_options:{list:"Liste",card:"Karte"}},card:{sections:{details:"Details zur Wiedergabe",menu:"Men\xFC & Suchbl\xE4tter",action_chips:"Aktions-Chips"},media_controls:{shuffle:"Zufall",previous:"Zur\xFCck",play_pause:"Play/Pause",stop:"Stop",next:"Weiter",repeat:"Wiederholen"},menu:{more_info:"Mehr Info",search:"Suche",source:"Quelle",transfer_queue:"Warteschlange \xFCbertragen",group_players:"Player gruppieren",select_entity:"Entit\xE4t f\xFCr mehr Info w\xE4hlen",transfer_to:"Warteschlange \xFCbertragen zu",no_players:"Keine anderen Music Assistant Player verf\xFCgbar."},grouping:{title:"Player gruppieren",sync_volume:"Lautst\xE4rke synchronisieren",group_all:"Alle gruppieren",ungroup_all:"Alle trennen",unavailable:"Player ist nicht verf\xFCgbar",no_players:"Keine anderen gruppierungsf\xE4higen Player verf\xFCgbar.",master:"Master",joined:"Verbunden",available:"Verf\xFCgbar",current:"Aktuell",unjoin_from:"Von {master} trennen",join_with:"Mit {master} gruppieren"}},search:{favorites:"Favoriten",recently_played:"Zuletzt geh\xF6rt",next_up:"Als N\xE4chstes",recommendations:"Empfehlungen",radio_mode:"Radiomodus",close:"Suche schlie\xDFen",no_results:"Keine Ergebnisse.",play_next:"Als N\xE4chstes spielen",replace_play:"Warteschlange ersetzen und jetzt spielen",replace:"Warteschlange ersetzen",add_queue:"Am Ende der Warteschlange hinzuf\xFCgen",move_up:"Nach oben",move_down:"Nach unten",move_next:"Als N\xE4chstes verschieben",remove:"Aus Warteschlange entfernen",added:"Zur Warteschlange hinzugef\xFCgt!",labels:{replace:"Ersetzen",next:"Weiter",replace_next:"Weiter ersetzen",add:"Hinzuf\xFCgen"},results:"Ergebnisse",result:"Ergebnis",filters:{all:"Alle",artist:"K\xFCnstler",album:"Album",track:"Titel",playlist:"Playlist",radio:"Radio",music:"Musik",station:"Station",podcast:"Podcast",audiobook:"H\xF6rbuch"},search_artist:"Nach diesem K\xFCnstler suchen"}},mo={common:{not_found:"Entidad no encontrada.",search:"Buscar",power:"Encender/Apagar",favorite:"Favorito",loading:"Cargando...",no_results:"Sin resultados.",close:"Cerrar",vol_up:"Subir volumen",vol_down:"Bajar volumen",media_player:"Reproductor multimedia",edit_entity:"Editar ajustes de entidad",edit_action:"Editar ajustes de acci\xF3n",mute:"Silenciar",unmute:"Activar sonido",seek:"Buscar",volume:"Volumen",play_now:"Reproducir ahora",more_options:"M\xE1s opciones",unavailable:"No disponible",back:"Atr\xE1s",cancel:"Cancelar",reset_default:"Restablecer valores"},editor:{tabs:{entities:"Entidades",behavior:"Comportamiento",look_and_feel:"Apariencia",artwork:"Portada",actions:"Acciones"},placeholders:{search:"Buscar m\xFAsica..."},sections:{artwork:{general:{title:"Ajustes generales",description:"Controles globales para la portada."},idle:{title:"Portada en reposo",description:"Mostrar imagen est\xE1tica cuando nada se reproduce."},overrides:{title:"Reemplazos de portada",description:"Los reemplazos se eval\xFAan de arriba a abajo. Arrastre para reordenar."}},entities:{title:"Entidades*",description:"A\xF1ada los reproductores multimedia. Arrastre para reordenar."},behavior:{idle_chips:{title:"Reposo y chips",description:"Elija cu\xE1ndo pasa a reposo y el comportamiento de los chips."},interactions_search:{title:"Interacciones y b\xFAsqueda",description:"Ajuste el fijado de entidades y l\xEDmite de resultados."}},look_and_feel:{theme_layout:{title:"Tema y dise\xF1o",description:"Combine con el estilo de su dashboard."},controls_typography:{title:"Controles y tipograf\xEDa",description:"Ajuste tama\xF1o de botones y etiquetas."},collapsed_idle:{title:"Estados de reposo y contra\xEDdo",description:"Controle el contra\xEDdo de la tarjeta."}},actions:{title:"Acciones",description:"Cree chips de acci\xF3n. Arrastre para reordenar, pulse el l\xE1piz para configurar."}},subtitles:{idle_timeout:"Tiempo antes de reposo (ms). 0 para desactivar.",show_chip_row:'"Auto" oculta la fila si solo hay una entidad. "En men\xFA" mueve los chips. "En men\xFA en reposo" muestra los chips en l\xEDnea cuando est\xE1 activo pero los mueve al men\xFA cuando est\xE1 en reposo.',dim_chips:"Atenuar los chips en reposo para un aspecto m\xE1s limpio.",hold_to_pin:"Mantener pulsado para fijar en vez de pulsaci\xF3n corta.",always_show_group:"Los controles de agrupaci\xF3n r\xE1pida (+/-/estrella) estar\xE1n visibles por defecto al cargar la p\xE1gina. Todav\xEDa puedes cambiarlos manualmente mediante doble pulsaci\xF3n.",disable_autofocus:"Evitar que la b\xFAsqueda tome el foco autom\xE1ticamente.",search_within_filter:"Buscar dentro del filtro activo (Favoritos, etc.).",close_search_on_play:"Cerrar b\xFAsqueda al reproducir.",pin_search_headers:"Fijar encabezados de b\xFAsqueda al hacer scroll.",hide_search_headers_on_idle:"Ocultar encabezados de b\xFAsqueda en inactividad.",disable_mass:"Desactivar integraci\xF3n con Mass Queue.",swap_pause_stop:"Cambiar pausa por stop en dise\xF1o moderno.",adaptive_controls:"Permitir que los botones se adapten al espacio.",hide_menu_player:"Ocultar nombre de entidad cuando est\xE1 en el men\xFA.",adaptive_text:"Elegir qu\xE9 textos se adaptan al espacio.",collapse_expand:"Siempre contra\xEDdo activa el modo mini. Expandir al buscar expande temporalmente.",idle_screen:"Elegir pantalla a mostrar en reposo.",hide_controls:"Seleccionar controles a ocultar.",hide_search_chips:"Ocultar chips de filtro de b\xFAsqueda.",follow_active_entity:"La entidad de volumen seguir\xE1 a la activa.",search_limit_full:"M\xE1ximo de resultados (1-1000, defecto: 20).",default_search_filter_full:"Elige qu\xE9 filtro est\xE1 activo por defecto cuando se abre la pantalla de b\xFAsqueda.",result_sorting_full:"Elegir orden de resultados.",card_height_full:"Dejar vac\xEDo para altura autom\xE1tica.",control_layout_full:"Elegir entre dise\xF1o antiguo o moderno.",artwork_extend:"Extender portada bajo los chips.",artwork_extend_label:"Extender portada",no_artwork_overrides:"Sin reemplazos de portada configurados.",entity_current_hint:"Use 'entity_id: current' para el reproductor actual.",service_data_note:"Los cambios se guardan al pulsar 'Guardar'.",jinja_template_hint:"Plantilla Jinja para entity_id.",jinja_template_vol_hint:"Plantilla para entidad de volumen.",not_available_alt_collapsed:"No disponible en modo contra\xEDdo.",not_available_collapsed:"No disponible si est\xE1 contra\xEDdo.",only_available_collapsed:"Solo disponible si est\xE1 contra\xEDdo.",only_available_modern:"Solo disponible con dise\xF1o Moderno.",image_url_helper:"Ingrese una URL directa a una imagen o una ruta de archivo local",selected_entity_helper:"Helper de texto de entrada que se actualizar\xE1 con el ID de la entidad del reproductor de medios seleccionado actualmente.",sync_entity_type:"Elija qu\xE9 ID de entidad sincronizar con el helper (por defecto la entidad de Music Assistant si est\xE1 configurada).",disable_auto_select:"Evita que el chip de esta entidad se seleccione autom\xE1ticamente cuando comienza la reproducci\xF3n.",search_view:"Elegir entre una lista est\xE1ndar o una cuadr\xEDcula de tarjetas para los resultados de la b\xFAsqueda.",search_card_columns:"Especifica cu\xE1ntas columnas usar en la vista de tarjetas. El artwork se adaptar\xE1 autom\xE1ticamente."},titles:{edit_entity:"Editar entidad",edit_action:"Editar acci\xF3n",service_data:"Datos del servicio",add_artwork_override:"A\xF1adir reemplazo"},labels:{dim_chips:"Atenuar chips en reposo",hold_to_pin:"Mantener para fijar",always_show_group:"Grupo r\xE1pido por defecto",disable_autofocus:"Desactivar autofoco",keep_filters:"Mantener filtros",dismiss_on_play:"Cerrar al reproducir",default_search_filter:"Filtro de b\xFAsqueda predeterminado",pin_headers:"Fijar encabezados",hide_search_headers_on_idle:"Ocultar encabezados en inactividad",disable_mass:"Desactivar Mass Queue",match_theme:"Seguir tema",alt_progress:"Barra de progreso alternativa",display_timestamps:"Mostrar sellos de tiempo",swap_pause_stop:"Cambiar Pausa por Stop",adaptive_controls:"Tama\xF1o adaptativo",hide_active_entity:"Ocultar nombre de entidad activa",collapse_on_idle:"Contraer en reposo",hide_menu_player_toggle:"Ocultar reproductor del men\xFA",always_collapsed:"Siempre contra\xEDdo",expand_on_search:"Expandir al buscar",script_var:"Variable script (yamp_entity)",use_ma_template:"Usar plantilla MA",use_vol_template:"Usar plantilla Volumen",follow_active_entity:"Volumen sigue a entidad activa",use_url_path:"Usar URL o ruta",adaptive_text_elements:"Elementos de texto adaptativo",disable_auto_select:"Desactivar selecci\xF3n autom\xE1tica"},fields:{artwork_fit:"Ajuste",artwork_position:"Posici\xF3n",artwork_hostname:"Host",match_field:"Campo",match_value:"Valor",size_percent:"Tama\xF1o (%)",object_fit:"Object Fit",idle_timeout:"Reposo (ms)",show_chip_row:"Mostrar chips",search_limit:"L\xEDmite de b\xFAsqueda",result_sorting:"Orden",vol_step:"Paso de volumen",card_height:"Altura (px)",control_layout:"Dise\xF1o",save_service_data:"Guardar",image_url:"URL imagen",fallback_image_url:"URL de respaldo",move_to_main:"Mover a chips principales",move_to_menu:"Mover al men\xFA",delete_action:"Borrar acci\xF3n",revert_service_data:"Deshacer cambios",test_action:"Probar acci\xF3n",volume_mode:"Modo volumen",idle_screen:"Pantalla reposo",name:"Nombre",hidden_controls:"Controles ocultos",ma_template:"Plantilla MA (Jinja)",hidden_chips:"Chips ocultos",vol_template:"Plantilla Volumen (Jinja)",icon:"Icono",action_type:"Tipo de acci\xF3n",menu_item:"Elemento de men\xFA",nav_path:"Ruta",service:"Servicio",service_data:"Datos",idle_image_entity:"Entidad imagen reposo",match_entity:"Entidad",ma_entity:"Entidad de Music Assistant",vol_entity:"Entidad de volumen",selected_entity_helper:"Helper de entidad seleccionada",sync_entity_type:"Tipo de entidad a sincronizar",placement:"Colocaci\xF3n",card_trigger:"Activador de la tarjeta",search_view:"Vista de resultados de b\xFAsqueda",search_card_columns:"Columnas de tarjetas"},action_types:{menu:"Abrir un elemento del men\xFA",service:"Llamar a un servicio",navigate:"Navegar",sync_selected_entity:"Sincronizar entidad seleccionada"},action_helpers:{sync_selected_entity:"Sincronizar entidad seleccionada \u2192",select_helper:"(seleccionar helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entidad de Music Assistant si est\xE1 configurada)",yamp_main_entity:"yamp_main_entity (Entidad principal del reproductor)",yamp_playback_entity:"yamp_playback_entity (Entidad de reproducci\xF3n activa actual)"},placements:{chip:"Chip de acci\xF3n",menu:"En el men\xFA",hidden:"Oculto (Toque en el arte)",not_triggerable:"No activable"},triggers:{none:"Ninguno",tap:"Toque",hold:"Mantener",double_tap:"Doble toque",swipe_left:"Deslizar a la izquierda",swipe_right:"Deslizar a la derecha"},search_view_options:{list:"Lista",card:"Tarjeta"}},card:{sections:{details:"Detalles de reproducci\xF3n",menu:"Men\xFA y B\xFAsqueda",action_chips:"Chips de acci\xF3n"},media_controls:{shuffle:"Aleatorio",previous:"Anterior",play_pause:"Reproducir/Pausa",stop:"Detener",next:"Siguiente",repeat:"Repetir"},menu:{more_info:"M\xE1s info",search:"Buscar",source:"Fuente",transfer_queue:"Transferir cola",group_players:"Agrupar",select_entity:"Seleccionar",transfer_to:"Transferir a",no_players:"Sin reproductores MA."},grouping:{title:"Agrupar",sync_volume:"Sincronizar volumen",group_all:"Agrupar todos",ungroup_all:"Desagrupar todos",unavailable:"No disponible",no_players:"No agrupable.",master:"Maestro",joined:"Unido",available:"Disponible",current:"Actual",unjoin_from:"Desvincular de {master}",join_with:"Unirse a {master}"}},search:{favorites:"Favoritos",recently_played:"Reciente",next_up:"A continuaci\xF3n",recommendations:"Recomendaciones",radio_mode:"Modo Radio",close:"Cerrar",no_results:"Sin resultados.",play_next:"Reprod. siguiente",replace_play:"Reemplazar y reproducir",replace:"Reemplazar cola",add_queue:"A\xF1adir al final",move_up:"Subir",move_down:"Bajar",move_next:"Pasar a siguiente",remove:"Quitar de cola",added:"\xA1A\xF1adido!",labels:{replace:"Remplazar",next:"Siguiente",replace_next:"Rempl. Sig.",add:"A\xF1adir"},results:"resultados",result:"resultado",filters:{all:"Todo",artist:"Artista",album:"\xC1lbum",track:"Canci\xF3n",playlist:"Lista",radio:"Radio",music:"M\xFAsica",station:"Emisora",podcast:"P\xF3dcast",audiobook:"Audiolibro"},search_artist:"Buscar este artista"}},fo={common:{not_found:"Entit\xE9 non trouv\xE9e.",search:"Rechercher",power:"Alimentation",favorite:"Favori",loading:"Chargement...",no_results:"Aucun r\xE9sultat.",close:"Fermer",vol_up:"Monter le volume",vol_down:"Baisser le volume",media_player:"Lecteur Multim\xE9dia",edit_entity:"Modifier les param\xE8tres de l'entit\xE9",edit_action:"Modifier les param\xE8tres de l'action",mute:"Muet",unmute:"R\xE9tablir le son",seek:"Rechercher",volume:"Volume",play_now:"Lire maintenant",more_options:"Plus d'options",unavailable:"Indisponible",back:"Retour",cancel:"Annuler",reset_default:"R\xE9initialiser"},editor:{tabs:{entities:"Entit\xE9s",behavior:"Comportement",look_and_feel:"Apparence",artwork:"Illustrations",actions:"Actions"},placeholders:{search:"Rechercher de la musique..."},sections:{artwork:{general:{title:"Param\xE8tres G\xE9n\xE9raux",description:"Contr\xF4les globaux pour l'affichage des illustrations."},idle:{title:"Illustration au Repos",description:"Afficher une image statique lorsque rien n'est en lecture."},overrides:{title:"Remplacements d'Illustrations",description:"Les remplacements sont \xE9valu\xE9s de haut en bas. Glissez pour r\xE9ordonner."}},entities:{title:"Entit\xE9s*",description:"Ajoutez les lecteurs multim\xE9dias que vous souhaitez contr\xF4ler. Glissez pour r\xE9ordonner."},behavior:{idle_chips:{title:"Veille & Jetons",description:"Choisissez quand la carte passe en mode veille et comment les jetons se comportent."},interactions_search:{title:"Interactions & Recherche",description:"Affinez la fa\xE7on dont les entit\xE9s sont \xE9pingl\xE9es et le nombre de r\xE9sultats."}},look_and_feel:{theme_layout:{title:"Th\xE8me & Mise en page",description:"Adaptez au style de votre tableau de bord et contr\xF4lez l'empreinte globale."},controls_typography:{title:"Commandes & Typographie",description:"Ajustez la taille des boutons, les \xE9tiquettes et le texte adaptatif."},collapsed_idle:{title:"\xC9tats R\xE9duits & Veille",description:"Contr\xF4lez quand la carte se r\xE9duit et quelles vues s'affichent en veille."}},actions:{title:"Actions",description:"Cr\xE9ez les jetons d'action. Glissez pour r\xE9ordonner, cliquez sur le crayon pour configurer."}},subtitles:{idle_timeout:"Temps en millisecondes avant la mise en veille. 0 pour d\xE9sactiver.",show_chip_row:'"Auto" masque la barre de jetons si une seule entit\xE9 est configur\xE9e. "Dans le Menu" d\xE9place les jetons. "Dans le menu au repos" affiche les jetons en ligne lorsque actif mais les d\xE9place dans le menu au repos.',dim_chips:"Assombrir les jetons en mode veille pour un look plus \xE9pur\xE9.",hold_to_pin:"Appui long pour \xE9pingler au lieu d'un appui court.",always_show_group:"Les contr\xF4les de groupement rapide (+/-/\xE9toile) seront visibles par d\xE9faut au chargement de la page. Vous pouvez toujours les basculer manuellement via un double appui.",disable_autofocus:"Emp\xEAcher la recherche de prendre le focus automatiquement.",search_within_filter:"Rechercher dans le filtre actif actuel (Favoris, etc.).",close_search_on_play:"Fermer automatiquement la recherche \xE0 la lecture.",pin_search_headers:"Garder la recherche et les filtres fixes en haut.",hide_search_headers_on_idle:"Masquer la recherche et les filtres en mode veille.",disable_mass:"D\xE9sactiver l'int\xE9gration Mass Queue.",swap_pause_stop:"Remplacer le bouton pause par stop en mode moderne.",adaptive_controls:"Laisser les boutons s'adapter \xE0 l'espace disponible.",hide_menu_player:"Masquer l'\xE9tiquette de l'entit\xE9 en bas quand les jetons sont dans le menu.",adaptive_text:"Choisir quels textes doivent s'adapter \xE0 l'espace.",collapse_expand:"Toujours r\xE9duit cr\xE9e un mini lecteur. Agrandir \xE0 la Recherche agrandit temporairement.",idle_screen:"Choisir l'\xE9cran \xE0 afficher automatiquement en veille.",hide_controls:"S\xE9lectionner les commandes \xE0 masquer pour cette entit\xE9.",hide_search_chips:"Masquer des jetons de filtrage sp\xE9cifiques.",follow_active_entity:"L'entit\xE9 de volume suivra automatiquement l'entit\xE9 active.",search_limit_full:"Nombre maximum de r\xE9sultats (1-1000, d\xE9faut: 20).",default_search_filter_full:"Choisissez quel filtre est actif par d\xE9faut \xE0 l'ouverture de la recherche.",result_sorting_full:"Choisir l'ordre des r\xE9sultats. Par d\xE9faut conserve l'ordre source.",card_height_full:"Laisser vide pour une hauteur automatique.",control_layout_full:"Choisir entre l'ancienne mise en page ou la moderne.",artwork_extend:"\xC9tendre l'illustration sous les lignes de jetons.",artwork_extend_label:"\xC9tendre l'illustration",no_artwork_overrides:"Aucun remplacement d'illustration configur\xE9.",entity_current_hint:"Utilisez 'entity_id: current' pour cibler le lecteur actuel.",service_data_note:"Les changements ne sont enregistr\xE9s qu'en cliquant sur 'Enregistrer'.",jinja_template_hint:"Entrez un mod\xE8le Jinja qui renvoie un entity_id.",jinja_template_vol_hint:"Mod\xE8le pour l'entit\xE9 de volume.",not_available_alt_collapsed:"Non disponible en mode 'Toujours r\xE9duit'.",not_available_collapsed:"Non disponible si 'Toujours r\xE9duit' est activ\xE9.",only_available_collapsed:"Uniquement disponible si 'Toujours r\xE9duit' est activ\xE9.",only_available_modern:"Uniquement disponible avec la mise en page Moderne.",image_url_helper:"Entrez une URL directe vers une image ou un chemin de fichier local",selected_entity_helper:"Helper de texte d'entr\xE9e qui sera mis \xE0 jour avec l'ID de l'entit\xE9 du lecteur multim\xE9dia actuellement s\xE9lectionn\xE9.",sync_entity_type:"Choisissez quel ID d'entit\xE9 synchroniser avec le helper (par d\xE9faut l'entit\xE9 Music Assistant si configur\xE9e).",disable_auto_select:"Emp\xEAche le jeton de cette entit\xE9 d'\xEAtre automatiquement s\xE9lectionn\xE9 au d\xE9but de la lecture.",search_view:"Choisissez entre une liste standard ou une grille de cartes pour les r\xE9sultats de recherche.",search_card_columns:"Sp\xE9cifiez le nombre de colonnes \xE0 utiliser dans la vue carte. L'illustration s'adaptera automatiquement."},titles:{edit_entity:"Modifier l'entit\xE9",edit_action:"Modifier l'action",service_data:"Donn\xE9es du service",add_artwork_override:"Ajouter un remplacement"},labels:{dim_chips:"Assombrir les jetons en veille",hold_to_pin:"Maintenir pour \xE9pingler",always_show_group:"Groupe rapide par d\xE9faut",disable_autofocus:"D\xE9sactiver l'autofocus",keep_filters:"Garder les filtres",dismiss_on_play:"Fermer en lecture",default_search_filter:"Filtre de recherche par d\xE9faut",pin_headers:"\xC9pingler les en-t\xEAtes",hide_search_headers_on_idle:"Masquer les en-t\xEAtes en veille",disable_mass:"D\xE9sactiver Mass Queue",match_theme:"Suivre le th\xE8me",alt_progress:"Barre de progression alternative",display_timestamps:"Afficher les horodatages",swap_pause_stop:"Remplacer Pause par Stop",adaptive_controls:"Taille adaptative",hide_active_entity:"Masquer l'\xE9tiquette active",collapse_on_idle:"R\xE9duire en veille",hide_menu_player_toggle:"Masquer le lecteur menu",always_collapsed:"Toujours r\xE9duit",expand_on_search:"Agrandir en recherche",script_var:"Variable script (yamp_entity)",use_ma_template:"Utiliser mod\xE8le MA",use_vol_template:"Utiliser mod\xE8le Volume",follow_active_entity:"Le volume suit l'entit\xE9 active",use_url_path:"Utiliser URL ou chemin",adaptive_text_elements:"\xC9l\xE9ments de texte adaptatif",disable_auto_select:"D\xE9sactiver la s\xE9lection automatique"},fields:{artwork_fit:"Ajustement",artwork_position:"Position",artwork_hostname:"H\xF4te",match_field:"Champ de correspondance",match_value:"Valeur de correspondance",size_percent:"Taille (%)",object_fit:"Object Fit",idle_timeout:"Veille (ms)",show_chip_row:"Afficher les jetons",search_limit:"Limite de r\xE9sultats",result_sorting:"Tri des r\xE9sultats",vol_step:"Pas du volume",card_height:"Hauteur (px)",control_layout:"Mise en page",save_service_data:"Enregistrer",image_url:"URL image",fallback_image_url:"URL de secours",move_to_main:"Mettre dans les jetons principaux",move_to_menu:"Mettre dans le menu",delete_action:"Supprimer l'action",revert_service_data:"Annuler les changements",test_action:"Tester l'action",volume_mode:"Mode volume",idle_screen:"\xC9cran de veille",name:"Nom",hidden_controls:"Commandes masqu\xE9es",ma_template:"Mod\xE8le MA (Jinja)",hidden_chips:"Jetons masqu\xE9s",vol_template:"Mod\xE8le Volume (Jinja)",icon:"Ic\xF4ne",action_type:"Type d'action",menu_item:"\xC9l\xE9ment du menu",nav_path:"Chemin navigation",service:"Service",service_data:"Donn\xE9es",idle_image_entity:"Entit\xE9 image veille",match_entity:"Entit\xE9 de correspondance",ma_entity:"Entit\xE9 Music Assistant",vol_entity:"Entit\xE9 de volume",selected_entity_helper:"Helper d'entit\xE9 s\xE9lectionn\xE9e",sync_entity_type:"Type d'entit\xE9 \xE0 synchroniser",placement:"Placement",card_trigger:"D\xE9clencheur de carte",search_view:"Vue des r\xE9sultats de recherche",search_card_columns:"Colonnes de cartes"},action_types:{menu:"Ouvrir un \xE9l\xE9ment de menu",service:"Appeler un service",navigate:"Naviguer",sync_selected_entity:"Synchroniser l'entit\xE9 s\xE9lectionn\xE9e"},action_helpers:{sync_selected_entity:"Synchroniser l'entit\xE9 s\xE9lectionn\xE9e \u2192",select_helper:"(s\xE9lectionner helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entit\xE9 Music Assistant si configur\xE9e)",yamp_main_entity:"yamp_main_entity (Entit\xE9 principale du lecteur)",yamp_playback_entity:"yamp_playback_entity (Entit\xE9 de lecture active actuelle)"},placements:{chip:"Puce d'action",menu:"Dans le menu",hidden:"Masqu\xE9 (Appui sur l'image)",not_triggerable:"Non d\xE9clenchable"},triggers:{none:"Aucun",tap:"Appui",hold:"Maintenir",double_tap:"Double appui",swipe_left:"Glisser vers la gauche",swipe_right:"Glisser vers la droite"},search_view_options:{list:"Liste",card:"Carte"}},card:{sections:{details:"D\xE9tails lecture",menu:"Menu & Recherche",action_chips:"Jetons d'action"},media_controls:{shuffle:"Al\xE9atoire",previous:"Pr\xE9c\xE9dent",play_pause:"Lecture/Pause",stop:"Arr\xEAt",next:"Suivant",repeat:"R\xE9p\xE9ter"},menu:{more_info:"Plus d'infos",search:"Rechercher",source:"Source",transfer_queue:"Transf\xE9rer la file",group_players:"Grouper les lecteurs",select_entity:"Choisir pour plus d'infos",transfer_to:"Transf\xE9rer vers",no_players:"Aucun lecteur MA disponible."},grouping:{title:"Grouper les lecteurs",sync_volume:"Synchroniser volume",group_all:"Grouper tout",ungroup_all:"D\xE9grouper tout",unavailable:"Lecteur indisponible",no_players:"Aucun lecteur groupable.",master:"Ma\xEEtre",joined:"Li\xE9",available:"Disponible",current:"Actuel",unjoin_from:"Se d\xE9solidariser de {master}",join_with:"Se joindre \xE0 {master}"}},search:{favorites:"Favoris",recently_played:"R\xE9cemment lus",next_up:"\xC0 suivre",recommendations:"Recommandations",radio_mode:"Mode Radio",close:"Fermer la recherche",no_results:"Aucun r\xE9sultat.",play_next:"Lire apr\xE8s",replace_play:"Remplacer et lire",replace:"Remplacer file",add_queue:"Ajouter \xE0 la fin",move_up:"Monter",move_down:"Descendre",move_next:"Passer au suivant",remove:"Retirer de la file",added:"Ajout\xE9 \xE0 la file !",labels:{replace:"Remplacer",next:"Suivant",replace_next:"Rempl. Suivant",add:"Ajouter"},results:"r\xE9sultats",result:"r\xE9sultat",filters:{all:"Tout",artist:"Artiste",album:"Album",track:"Titre",playlist:"Playlist",radio:"Radio",music:"Musique",station:"Station",podcast:"Podcast",audiobook:"Livre audio"},search_artist:"Chercher cet artiste"}},go={common:{not_found:"Entit\xE0 non trovata.",search:"Cerca",power:"Accensione",favorite:"Preferito",loading:"Caricamento...",no_results:"Nessun risultato.",close:"Chiudi",vol_up:"Volume su",vol_down:"Volume gi\xF9",media_player:"Lettore multimediale",edit_entity:"Modifica impostazioni entit\xE0",edit_action:"Modifica impostazioni azione",mute:"Muto",unmute:"Riattiva audio",seek:"Cerca",volume:"Volume",play_now:"Riproduci ora",more_options:"Altre opzioni",unavailable:"Non disponibile",back:"Indietro",cancel:"Annulla",reset_default:"Ripristina predefiniti"},editor:{tabs:{entities:"Entit\xE0",behavior:"Comportamento",look_and_feel:"Aspetto",artwork:"Copertina",actions:"Azioni"},placeholders:{search:"Cerca musica..."},sections:{artwork:{general:{title:"Impostazioni generali",description:"Controlli globali per la copertina."},idle:{title:"Copertina in riposo",description:"Mostra un'immagine statica quando non c'\xE8 riproduzione."},overrides:{title:"Override copertina",description:"Gli override sono valutati dall'alto in basso."}},entities:{title:"Entit\xE0*",description:"Aggiungi i lettori da controllare."},behavior:{idle_chips:{title:"Riposo e chip",description:"Scegli quando andare in riposo."},interactions_search:{title:"Interazioni e ricerca",description:"Ajusta il fissaggio delle entit\xE0."}},look_and_feel:{theme_layout:{title:"Tema e layout",description:"Adatta allo stile del dashboard."},controls_typography:{title:"Controlli e tipografia",description:"Ajusta bottoni e etichette."},collapsed_idle:{title:"Stati contratto e riposo",description:"Controlla il contratto della scheda."}},actions:{title:"Azioni",description:"Crea chip azione."}},subtitles:{idle_timeout:"Tempo prima del riposo (ms). 0 per disabilitare.",show_chip_row:`"Auto" nasconde la riga se c'\xE8 una sola entit\xE0. "Nel menu" sposta i chip nel menu. "Nel menu in inattivit\xE0" mostra i chip in linea quando attivo ma li sposta nel menu quando inattivo.`,dim_chips:"Appanna i chip in riposo per un aspetto pi\xF9 pulito.",hold_to_pin:"Tieni premuto per fissare invece di un tocco breve.",always_show_group:"I controlli di raggruppamento rapido (+/-/stella) saranno visibili per impostazione predefinita al caricamento della pagina. Puoi comunque attivarli manualmente tramite doppio tocco.",disable_autofocus:"Evita che la ricerca prenda il focus automaticamente.",search_within_filter:"Cerca nel filtro attivo (Preferiti, ecc.).",close_search_on_play:"Chiudi ricerca alla riproduzione.",pin_search_headers:"Fissa le intestazioni di ricerca durante lo scorrimento.",hide_search_headers_on_idle:"Nascondi la ricerca e i filtri quando inattivo.",disable_mass:"Disabilita integrazione Mass Queue.",swap_pause_stop:"Sostituisci pausa con stop nel design moderno.",adaptive_controls:"Permetti ai pulsanti di adattarsi allo spazio.",hide_menu_player:"Nascondi nome entit\xE0 quando \xE8 nel menu.",adaptive_text:"Scegli quali testi si adattano allo spazio.",collapse_expand:"Sempre contratto attiva il modo mini. Espandi alla ricerca espande temporaneamente.",idle_screen:"Scegli schermata da mostrare in riposo.",hide_controls:"Seleziona controlli da nascondere.",hide_search_chips:"Nascondi chip di filtro ricerca.",follow_active_entity:"L'entit\xE0 volume seguir\xE0 quella attiva.",search_limit_full:"Massimo risultati (1-1000, default: 20).",default_search_filter_full:"Scegli quale filtro \xE8 attivo per impostazione predefinita all'apertura della ricerca.",result_sorting_full:"Scegli ordine risultati.",card_height_full:"Lascia vuoto per altezza automatica.",control_layout_full:"Scegli tra design vecchio o moderno.",artwork_extend:"Estendi copertina sotto i chip.",artwork_extend_label:"Estendi copertina",no_artwork_overrides:"Nessun override copertina configurato.",entity_current_hint:"Usa 'entity_id: current' per il lettore attuale.",service_data_note:"Le modifiche si salvano premendo 'Salva'.",jinja_template_hint:"Modello Jinja per entity_id.",jinja_template_vol_hint:"Modello per entit\xE0 volume.",not_available_alt_collapsed:"Non disponibile in modo contratto.",not_available_collapsed:"Non disponibile se contratto.",only_available_collapsed:"Solo disponibile se contratto.",only_available_modern:"Solo disponibile con layout Moderno.",image_url_helper:"Inserisci un URL diretto a un'immagine o un percorso file locale",selected_entity_helper:"Helper di testo di input che verr\xE0 aggiornato con l'ID dell'entit\xE0 del lettore multimediale attualmente selezionato.",sync_entity_type:"Scegli quale ID entit\xE0 sincronizzare con l'helper (predefinito l'entit\xE0 Music Assistant se configurata).",disable_auto_select:"Evita che il chip di questa entit\xE0 venga selezionato automaticamente all'inizio della riproduzione.",search_view:"Scegli tra una lista standard o una griglia di schede per i risultati della ricerca.",search_card_columns:"Specifica quante colonne utilizzare nella vista a schede. La copertina si adatter\xE0 automaticamente."},titles:{edit_entity:"Modifica entit\xE0",edit_action:"Modifica azione",service_data:"Dati servizio",add_artwork_override:"Aggiungi override"},labels:{dim_chips:"Appanna chip in riposo",hold_to_pin:"Tieni premuto per fissare",always_show_group:"Gruppo rapido predefinito",disable_autofocus:"Disabilita autofocus",keep_filters:"Mantieni filtri",dismiss_on_play:"Chiudi alla riproduzione",default_search_filter:"Filtro di ricerca predefinito",pin_headers:"Fissa intestazioni",hide_search_headers_on_idle:"Nascondi intestazioni in inattivit\xE0",disable_mass:"Disabilita Mass Queue",match_theme:"Segui tema",alt_progress:"Barra progresso alternativa",display_timestamps:"Mostra timestamp",swap_pause_stop:"Sostituisci Pausa con Stop",adaptive_controls:"Dimensione adattativa",hide_active_entity:"Nascondi nome entit\xE0 attiva",collapse_on_idle:"Contrai in riposo",hide_menu_player_toggle:"Nascondi lettore menu",always_collapsed:"Sempre contratto",expand_on_search:"Espandi alla ricerca",script_var:"Variabile script (yamp_entity)",use_ma_template:"Usa modello MA",use_vol_template:"Usa modello Volume",follow_active_entity:"Volume segue entit\xE0 attiva",use_url_path:"Usa URL o percorso",adaptive_text_elements:"Elementi testo adattativo",disable_auto_select:"Disattiva selezione automatica"},fields:{artwork_fit:"Adattamento",artwork_position:"Posizione",artwork_hostname:"Host",match_field:"Campo",match_value:"Valore",size_percent:"Dimensione (%)",object_fit:"Object Fit",idle_timeout:"Riposo (ms)",show_chip_row:"Mostra chip",search_limit:"Limite ricerca",result_sorting:"Ordine",vol_step:"Passo volume",card_height:"Altezza (px)",control_layout:"Design",save_service_data:"Salva",image_url:"URL immagine",fallback_image_url:"URL fallback",move_to_main:"Sposta in chip principali",move_to_menu:"Sposta nel menu",delete_action:"Elimina azione",revert_service_data:"Annulla modifiche",test_action:"Prova azione",volume_mode:"Modo volume",idle_screen:"Schermo riposo",name:"Nome",hidden_controls:"Controlli nascosti",ma_template:"Modello MA (Jinja)",hidden_chips:"Chip nascosti",vol_template:"Modello Volume (Jinja)",icon:"Icona",action_type:"Tipo azione",menu_item:"Elemento menu",nav_path:"Percorso",service:"Servizio",service_data:"Dati",idle_image_entity:"Entit\xE0 immagine riposo",match_entity:"Entit\xE0",ma_entity:"Entit\xE0 Music Assistant",vol_entity:"Entit\xE0 di volume",selected_entity_helper:"Helper entit\xE0 selezionata",sync_entity_type:"Tipo di entit\xE0 da sincronizzare",placement:"Posizionamento",card_trigger:"Trigger della scheda",search_view:"Vista risultati ricerca",search_card_columns:"Colonne schede"},action_types:{menu:"Apri un elemento del menu",service:"Chiama un servizio",navigate:"Naviga",sync_selected_entity:"Sincronizza entit\xE0 selezionata"},action_helpers:{sync_selected_entity:"Sincronizza entit\xE0 selezionata \u2192",select_helper:"(seleziona helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entit\xE0 Music Assistant se configurata)",yamp_main_entity:"yamp_main_entity (Entit\xE0 principale del lettore)",yamp_playback_entity:"yamp_playback_entity (Entit\xE0 di riproduzione attiva attuale)"},placements:{chip:"Chip d'azione",menu:"Nel menu",hidden:"Nascosto (Tocco sull'immagine)",not_triggerable:"Non attivabile"},triggers:{none:"Nessuno",tap:"Tocco",hold:"Mantieni",double_tap:"Doppio tocco",swipe_left:"Scorri a sinistra",swipe_right:"Scorri a destra"},search_view_options:{list:"Lista",card:"Scheda"}},card:{sections:{details:"Dettagli riproduzione",menu:"Menu e Ricerca",action_chips:"Chip azione"},media_controls:{shuffle:"Casuale",previous:"Precedente",play_pause:"Riproduci/Pausa",stop:"Ferma",next:"Successivo",repeat:"Ripeti"},menu:{more_info:"Pi\xF9 info",search:"Cerca",source:"Sorgente",transfer_queue:"Trasferisci coda",group_players:"Raggruppa",select_entity:"Seleziona",transfer_to:"Trasferisci a",no_players:"Senza lettori MA."},grouping:{title:"Raggruppa",sync_volume:"Sincronizza volume",group_all:"Raggruppa tutti",ungroup_all:"Separa tutti",unavailable:"Non disponibile",no_players:"Non raggruppabile.",master:"Master",joined:"Unito",available:"Disponibile",current:"Attuale",unjoin_from:"Scollegati da {master}",join_with:"Unisciti a {master}"}},search:{favorites:"Preferiti",recently_played:"Recenti",next_up:"A seguire",recommendations:"Raccomandazioni",radio_mode:"Modo Radio",close:"Chiudi",no_results:"Nessun risultato.",play_next:"Riprod. successivo",replace_play:"Sostituisci e riproduci",replace:"Sostituisci coda",add_queue:"Aggiungi alla fine",move_up:"Sposta su",move_down:"Sposta gi\xF9",move_next:"Passa al successivo",remove:"Rimuovi da coda",added:"Aggiunto!",labels:{replace:"Sostituisci",next:"Successivo",replace_next:"Sost. succ.",add:"Aggiungi"},results:"risultati",result:"risultato",filters:{all:"Tutto",artist:"Artista",album:"Album",track:"Brano",playlist:"Playlist",radio:"Radio",music:"Musica",station:"Stazione",podcast:"Podcast",audiobook:"Audiolibro"},search_artist:"Cerca questo artista"}},vo={common:{not_found:"Entiteit niet gevonden.",search:"Zoeken",power:"Aan/Uit",favorite:"Favoriet",loading:"Laden...",no_results:"Geen resultaten.",close:"Sluiten",vol_up:"Volume Omhoog",vol_down:"Volume Omlaag",media_player:"Mediaspeler",edit_entity:"Entiteitsinstellingen Bewerken",edit_action:"Actie-instellingen Bewerken",mute:"Dempen",unmute:"Dempen opheffen",seek:"Zoeken",volume:"Volume",play_now:"Nu Spelen",more_options:"Meer Opties",unavailable:"Niet beschikbaar",back:"Terug",cancel:"Annuleren",reset_default:"Herstellen naar standaard"},editor:{tabs:{entities:"Entiteiten",behavior:"Gedrag",look_and_feel:"Uiterlijk",artwork:"Artwork",actions:"Acties"},placeholders:{search:"Zoek muziek..."},sections:{artwork:{general:{title:"Algemene Instellingen",description:"Globale instellingen voor hoe artwork wordt weergegeven en opgehaald."},idle:{title:"Artwork bij Inactiviteit",description:"Toon een statische afbeelding of entiteits-snapshot wanneer er niets wordt afgespeeld."},overrides:{title:"Artwork Overschrijvingen",description:"Overschrijvingen worden van boven naar beneden ge\xEBvalueerd. Sleep om te sorteren."}},entities:{title:"Entiteiten*",description:"Voeg de mediaspelers toe die je wilt bedienen. Sleep entiteiten om de volgorde te wijzigen."},behavior:{idle_chips:{title:"Inactiviteit & Chips",description:"Kies wanneer de kaart inactief wordt en hoe entiteitschips zich gedragen."},interactions_search:{title:"Interacties & Zoeken",description:"Verfijn hoe entiteiten worden vastgezet en hoeveel resultaten er tegelijk worden getoond."}},look_and_feel:{theme_layout:{title:"Thema & Layout",description:"Stem af op de styling van het dashboard en beheer de totale voetafdruk."},controls_typography:{title:"Bediening & Typografie",description:"Pas knopgrootte, entiteitslabels en adaptieve tekst aan."},collapsed_idle:{title:"Ingeklapte & Inactieve Staten",description:"Beheer wanneer de kaart inklapt en welke weergaven getoond worden bij inactiviteit."}},actions:{title:"Acties",description:"Bouw de actiechips die in de kaart of het menu verschijnen. Sleep om te sorteren, klik op het potlood om te configureren."}},subtitles:{idle_timeout:"Tijd in milliseconden voordat de kaart naar de inactieve modus gaat. Stel in op 0 om inactiviteitsgedrag uit te schakelen.",show_chip_row:'"Auto" verbergt de chiprij wanneer er slechts \xE9\xE9n entiteit is geconfigureerd. "In Menu" verplaatst de chips naar het menu-overlay. "In menu bij inactiviteit" toont chips inline wanneer actief maar verplaatst ze naar het menu wanneer inactief.',dim_chips:"Wanneer de kaart inactief wordt met een afbeelding, dim dan de entiteits- en actiechips voor een strakker uiterlijk.",hold_to_pin:"Houd entiteitschips lang ingedrukt in plaats van kort om ze vast te zetten, om automatisch schakelen tijdens afspelen te voorkomen.",always_show_group:"Snelgroeperingsknoppen (+/-/ster) zijn standaard zichtbaar bij het laden van de pagina. Je kunt ze nog steeds handmatig in- of uitschakelen via dubbeltikken.",disable_autofocus:"Voorkom dat het zoekveld de focus steelt, zodat onscreen toetsenborden verborgen blijven.",search_within_filter:"Schakel dit in om te zoeken binnen het huidige actieve filter (Favorieten, Recent Afgespeeld, etc) in plaats van dit te wissen.",close_search_on_play:"Sluit het zoekscherm automatisch wanneer een nummer wordt afgespeeld.",pin_search_headers:"Houd de zoekinvoer en filters bovenaan vast tijdens het scrollen door resultaten.",hide_search_headers_on_idle:"Verberg zoekinvoer en filters wanneer inactief.",disable_mass:"Schakel de optionele Mass Queue integratie uit, zelfs als deze is ge\xEFnstalleerd.",swap_pause_stop:"Vervang de pauzeknop door stop bij gebruik van de moderne lay-out.",adaptive_controls:"Laat de afspeelknoppen groeien of krimpen om in de beschikbare ruimte te passen.",hide_menu_player:"Wanneer chips in het menu staan, verberg dan het entiteitslabel onderaan de kaart.",adaptive_text:"Kies welke tekstgroepen moeten schalen met de beschikbare ruimte (laat leeg om adaptieve tekst uit te schakelen).",collapse_expand:"Altijd Ingeklapt cre\xEBert de mini-spelermodus. Uitklappen bij Zoeken klapt tijdelijk uit tijdens het zoeken.",idle_screen:"Kies welk scherm automatisch wordt weergegeven wanneer de kaart inactief wordt.",hide_controls:"Selecteer welke knoppen je wilt verbergen voor deze entiteit (standaard worden ze allemaal getoond)",hide_search_chips:"Verberg specifieke zoekfilterchips voor deze entiteit",follow_active_entity:"Indien ingeschakeld, zal de volume-entiteit automatisch de actieve afspeel-entiteit volgen. Let op: dit overschrijft de geselecteerde volume-entiteit.",search_limit_full:"Maximaal aantal zoekresultaten om weer te geven (1-1000, standaard: 20)",default_search_filter_full:"Kies welk filter standaard actief is wanneer het zoekscherm wordt geopend.",result_sorting_full:"Kies hoe zoekresultaten worden gesorteerd. Standaard behoudt de bronvolgorde.",card_height_full:"Laat leeg voor automatische hoogte",control_layout_full:"Kies tussen de oude gelijkmatig verdeelde knoppen of de moderne Home Assistant lay-out.",artwork_extend:"Laat de artwork-achtergrond doorlopen onder de chip- en actierijen.",artwork_extend_label:"Artwork uitbreiden",no_artwork_overrides:"Geen artwork overschrijvingen geconfigureerd. Gebruik de plusknop hieronder om er een toe te voegen.",entity_current_hint:"Gebruik 'entity_id: current' om de momenteel geselecteerde mediaspeler op de kaart te targeten. Let op: de 'Test Actie' knop wordt uitgeschakeld bij gebruik van deze functie.",service_data_note:"Wijzigingen in de servicegegevens hieronder worden pas in de configuratie opgeslagen nadat op de knop 'Servicegegevens Opslaan' is geklikt!",jinja_template_hint:"Voer een Jinja-sjabloon in dat resulteert in een enkele entity_id. Voorbeeld voor het wisselen van MA op basis van een bronselectie:",jinja_template_vol_hint:"Voer een Jinja-sjabloon in dat resulteert in een entity_id (bijv. media_player.kantoor). Voorbeeld voor het wisselen van volume-entiteit op basis van een boolean:",not_available_alt_collapsed:"Niet beschikbaar met Alternatieve Voortgangsbalk of Altijd Ingeklapte modus",not_available_collapsed:"Niet beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",only_available_collapsed:"Alleen beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",only_available_modern:"Alleen beschikbaar met de Moderne lay-out",image_url_helper:"Voer een directe URL naar een afbeelding of een lokaal bestandspad in",selected_entity_helper:"Invoerteksthelper die wordt bijgewerkt met de momenteel geselecteerde media player-entiteits-ID.",sync_entity_type:"Kies welk entiteits-ID moet worden gesynchroniseerd met de helper (standaard Music Assistant-entiteit indien geconfigureerd).",disable_auto_select:"Voorkomt dat de chip van deze entiteit automatisch wordt geselecteerd wanneer deze begint af te spelen.",search_view:"Kies tussen een standaardlijst of een raster van kaarten voor zoekresultaten.",search_card_columns:"Geef aan hoeveel kolommen er gebruikt moeten worden in de kaartweergave. De afbeelding wordt automatisch aangepast."},titles:{edit_entity:"Entiteit Bewerken",edit_action:"Actie Bewerken",service_data:"Servicegegevens",add_artwork_override:"Artwork Overschrijving Toevoegen"},labels:{dim_chips:"Chips dimmen bij inactiviteit",hold_to_pin:"Ingedrukt houden om vast te zetten",always_show_group:"Snelgroepering standaard aan",disable_autofocus:"Zoek-autofocus uitschakelen",keep_filters:"Filters behouden bij zoeken",dismiss_on_play:"Zoeken sluiten bij afspelen",default_search_filter:"Standaard zoekfilter",pin_headers:"Zoekkoppen vastzetten",hide_search_headers_on_idle:"Zoekkoppen verbergen bij inactiviteit",disable_mass:"Mass Queue uitschakelen",match_theme:"Thema matchen",alt_progress:"Alternatieve Voortgangsbalk",display_timestamps:"Tijdstempels Weergeven",swap_pause_stop:"Pauze vervangen door Stop",adaptive_controls:"Adaptieve Knoppen Grootte",hide_active_entity:"Label van Actieve Entiteit verbergen",collapse_on_idle:"Inklappen bij inactiviteit",hide_menu_player_toggle:"Menu-speler Verbergen",always_collapsed:"Altijd Ingeklapt",expand_on_search:"Uitklappen bij Zoeken",script_var:"Script Variabele (yamp_entity)",use_ma_template:"Sjabloon gebruiken voor Music Assistant Entiteit",use_vol_template:"Sjabloon gebruiken voor Volume Entiteit",follow_active_entity:"Volume Entiteit volgt Actieve Entiteit",use_url_path:"URL of Pad gebruiken",adaptive_text_elements:"Elementen voor Adaptieve Tekstgrootte",disable_auto_select:"Auto-selectie uitschakelen"},fields:{artwork_fit:"Artwork Passend Maken",artwork_position:"Artwork Positie",artwork_hostname:"Artwork Hostnaam",match_field:"Match Veld",match_value:"Match Waarde",size_percent:"Grootte (%)",object_fit:"Object Fit",idle_timeout:"Time-out voor Inactiviteit (ms)",show_chip_row:"Chiprij Tonen",search_limit:"Limiet Zoekresultaten",result_sorting:"Sortering Resultaten",vol_step:"Volume Stap (0.05 = 5%)",card_height:"Kaarthoogte (px)",control_layout:"Knoppen Lay-out",save_service_data:"Servicegegevens Opslaan",image_url:"Afbeelding URL",fallback_image_url:"Fallback Afbeelding URL",move_to_main:"Verplaats actie naar hoofdchips",move_to_menu:"Verplaats actie naar menu",delete_action:"Actie Verwijderen",revert_service_data:"Terugzetten naar Opgeslagen Gegevens",test_action:"Actie Testen",volume_mode:"Volume Modus",idle_screen:"Inactief Scherm",name:"Naam",hidden_controls:"Verborgen Knoppen",ma_template:"Music Assistant Entiteit Sjabloon (Jinja)",hidden_chips:"Verborgen Zoekfilterchips",vol_template:"Volume Entiteit Sjabloon (Jinja)",icon:"Icoon",action_type:"Actietype",menu_item:"Menu-item",nav_path:"Navigatiepad",service:"Service",service_data:"Servicegegevens",idle_image_entity:"Entiteit voor inactieve afbeelding",match_entity:"Match Entiteit",ma_entity:"Music Assistant-entiteit",vol_entity:"Volume-entiteit",selected_entity_helper:"Geselecteerde entiteitshelper",sync_entity_type:"Synchronisatie entiteitstype",placement:"Plaatsing",card_trigger:"Kaart trigger",search_view:"Zoekresultaten weergave",search_card_columns:"Kaart kolommen"},action_types:{menu:"Open een kaartmenu-item",service:"Roep een service aan",navigate:"Navigeren",sync_selected_entity:"Synchroniseer geselecteerde entiteit"},action_helpers:{sync_selected_entity:"Geselecteerde entiteit synchroniseren \u2192",select_helper:"(selecteer helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant-entiteit indien geconfigureerd)",yamp_main_entity:"yamp_main_entity (Hoofd media player-entiteit)",yamp_playback_entity:"yamp_playback_entity (Huidige actieve afspeelentiteit)"},placements:{chip:"Actiechip",menu:"In menu",hidden:"Verborgen (Artwork-tik)",not_triggerable:"Niet triggerbaar"},triggers:{none:"Geen",tap:"Tik",hold:"Vasthouden",double_tap:"Dubbeltik",swipe_left:"Veeg naar links",swipe_right:"Veeg naar rechts"},search_view_options:{list:"Lijst",card:"Kaart"}},card:{sections:{details:"Details van 'Nu Spelen'",menu:"Menu & Zoekschermen",action_chips:"Actie Chips"},media_controls:{shuffle:"Shuffle",previous:"Vorige",play_pause:"Afspelen/Pauzeren",stop:"Stop",next:"Volgende",repeat:"Herhalen"},menu:{more_info:"Meer Info",search:"Zoeken",source:"Bron",transfer_queue:"Wachtrij Overdragen",group_players:"Spelers Groeperen",select_entity:"Selecteer Entiteit voor Meer Info",transfer_to:"Wachtrij Overdragen Naar",no_players:"Geen andere Music Assistant spelers beschikbaar."},grouping:{title:"Spelers Groeperen",sync_volume:"Volume Synchroniseren",group_all:"Alles Groeperen",ungroup_all:"Alles Loskoppelen",unavailable:"Speler is niet beschikbaar",no_players:"Geen andere spelers beschikbaar die kunnen groeperen.",master:"Master",joined:"Gekoppeld",available:"Beschikbaar",current:"Huidig",unjoin_from:"Loskoppelen van {master}",join_with:"Koppelen met {master}"}},search:{favorites:"Favorieten",recently_played:"Recent Afgespeeld",next_up:"Volgende",recommendations:"Aanbevelingen",radio_mode:"Radiomodus",close:"Zoeken Sluiten",no_results:"Geen resultaten.",play_next:"Volgende afspelen",replace_play:"Huidige wachtrij vervangen en nu afspelen",replace:"Wachtrij vervangen",add_queue:"Toevoegen aan einde van de wachtrij",move_up:"Omhoog verplaatsen",move_down:"Omlaag verplaatsen",move_next:"Als volgende afspelen",remove:"Verwijderen uit wachtrij",added:"Toegevoegd aan wachtrij!",labels:{replace:"Vervangen",next:"Volgende",replace_next:"Vervang Volgende",add:"Toevoegen"},results:"resultaten",result:"resultaat",filters:{all:"Alles",artist:"Artiest",album:"Album",track:"Nummer",playlist:"Afspeellijst",radio:"Radio",music:"Muziek",station:"Zender",podcast:"Podcast",audiobook:"Luisterboek"},search_artist:"Zoek naar deze artiest"}},yo={common:{not_found:"Entidade n\xE3o encontrada.",search:"Procurar",power:"Ligar/Desligar",favorite:"Favorito",loading:"A carregar...",no_results:"Sem resultados.",close:"Fechar",vol_up:"Aumentar volume",vol_down:"Diminuir volume",media_player:"Leitor multim\xE9dia",edit_entity:"Editar defini\xE7\xF5es da entidade",edit_action:"Editar defini\xE7\xF5es da a\xE7\xE3o",mute:"Silenciar",unmute:"Ativar som",seek:"Procurar",volume:"Volume",play_now:"Reproduzir agora",more_options:"Mais op\xE7\xF5es",unavailable:"Indispon\xEDvel",back:"Voltar",cancel:"Cancelar",reset_default:"Repor predefini\xE7\xF5es"},editor:{tabs:{entities:"Entidades",behavior:"Comportamento",look_and_feel:"Aspeto",artwork:"Capa",actions:"A\xE7\xF5es"},placeholders:{search:"Procurar m\xFAsica..."},sections:{artwork:{general:{title:"Defini\xE7\xF5es gerais",description:"Controlos globais para a capa."},idle:{title:"Capa em repouso",description:"Mostrar imagem est\xE1tica quando nada toca."},overrides:{title:"Substitui\xE7\xF5es de capa",description:"As substitui\xE7\xF5es s\xE3o avaliadas de cima para baixo."}},entities:{title:"Entidades*",description:"Adicione os leitores a controlar."},behavior:{idle_chips:{title:"Repouso e chips",description:"Escolha quando ir para repouso."},interactions_search:{title:"Intera\xE7\xF5es e procura",description:"Ajuste a fixa\xE7\xE3o de entidades."}},look_and_feel:{theme_layout:{title:"Tema e design",description:"Combine com o estilo do dashboard."},controls_typography:{title:"Controlos e tipografia",description:"Ajuste bot\xF5es e etiquetas."},collapsed_idle:{title:"Estados contra\xEDdo e repouso",description:"Controle o contra\xEDdo do cart\xE3o."}},actions:{title:"A\xE7\xF5es",description:"Crie chips de a\xE7\xE3o."}},subtitles:{idle_timeout:"Tempo antes de repouso (ms). 0 para desativar.",show_chip_row:'"Auto" oculta a linha se houver apenas uma entidade. "No menu" move os chips. "No menu em repouso" mostra os chips em linha quando ativo mas move-os para o menu quando em repouso.',dim_chips:"Escurecer chips em repouso para um aspeto mais limpo.",hold_to_pin:"Manter premido para fixar em vez de toque curto.",always_show_group:"Os controles de agrupamento r\xE1pido (+/-/estrela) estar\xE3o vis\xEDveis por padr\xE3o ao carregar a p\xE1gina. Voc\xEA ainda pode altern\xE1-los manualmente atrav\xE9s de um toque duplo.",disable_autofocus:"Evitar que a procura tome o foco automaticamente.",search_within_filter:"Procurar no filtro ativo (Favoritos, etc.).",close_search_on_play:"Fechar procura ao reproduzir.",pin_search_headers:"Fixar cabe\xE7alhos de procura ao fazer scroll.",hide_search_headers_on_idle:"Ocultar pesquisa e filtros quando inativo.",disable_mass:"Desativar integra\xE7\xE3o Mass Queue.",swap_pause_stop:"Substituir pausa por stop no design moderno.",adaptive_controls:"Permitir que os bot\xF5es se adaptem ao espa\xE7o.",hide_menu_player:"Ocultar nome da entidade quando no menu.",adaptive_text:"Escolher que textos se adaptam ao espa\xE7o.",collapse_expand:"Sempre contra\xEDdo ativa modo mini. Expandir ao procurar expande temporariamente.",idle_screen:"Escolher ecr\xE3 a mostrar em repouso.",hide_controls:"Selecionar controlos a ocultar.",hide_search_chips:"Ocultar chips de filtro de procura.",follow_active_entity:"A entidade de volume seguir\xE1 a ativa.",search_limit_full:"M\xE1ximo de resultados (1-1000, default: 20).",default_search_filter_full:"Escolha qual filtro est\xE1 ativo por padr\xE3o quando a tela de pesquisa \xE9 aberta.",result_sorting_full:"Escolher ordem dos resultados.",card_height_full:"Deixar vazio para altura autom\xE1tica.",control_layout_full:"Escolher entre design antigo ou moderno.",artwork_extend:"Estender capa sob os chips.",artwork_extend_label:"Estender capa",no_artwork_overrides:"Sem substitui\xE7\xF5es de capa configuradas.",entity_current_hint:"Use 'entity_id: current' para o leitor atual.",service_data_note:"As altera\xE7\xF5es s\xE3o guardadas ao premir 'Guardar'.",jinja_template_hint:"Modelo Jinja para entity_id.",jinja_template_vol_hint:"Modelo para entidade volume.",not_available_alt_collapsed:"N\xE3o dispon\xEDvel em modo contra\xEDdo.",not_available_collapsed:"N\xE3o dispon\xEDvel se contra\xEDdo.",only_available_collapsed:"Apenas dispon\xEDvel se contra\xEDdo.",only_available_modern:"Apenas dispon\xEDvel com layout Moderno.",image_url_helper:"Insira um URL direto para uma imagem ou um caminho de arquivo local",selected_entity_helper:"Helper de texto de entrada que ser\xE1 atualizado com o ID da entidade do reprodutor de m\xEDdia selecionado no momento.",sync_entity_type:"Escolha qual ID de entidade sincronizar com o helper (padr\xE3o entidade Music Assistant se configurada).",disable_auto_select:"Impede que o chip desta entidade seja selecionado automaticamente quando a reprodu\xE7\xE3o \xE9 iniciada.",search_view:"Escolha entre uma lista padr\xE3o ou uma grade de cart\xF5es para os resultados da pesquisa.",search_card_columns:"Especifique quantas colunas usar na visualiza\xE7\xE3o de cart\xF5es. A capa ser\xE1 redimensionada automaticamente."},titles:{edit_entity:"Editar entidade",edit_action:"Editar a\xE7\xE3o",service_data:"Dados do servi\xE7o",add_artwork_override:"Adicionar substitui\xE7\xE3o"},labels:{dim_chips:"Escurecer chips em repouso",hold_to_pin:"Manter para fixar",always_show_group:"Grupo r\xE1pido por padr\xE3o",disable_autofocus:"Desativar autofoco",keep_filters:"Manter filtros",dismiss_on_play:"Fechar ao reproduzir",default_search_filter:"Filtro de pesquisa padr\xE3o",pin_headers:"Fixar cabe\xE7alhos",hide_search_headers_on_idle:"Ocultar cabe\xE7alhos em inatividade",disable_mass:"Desativar Mass Queue",match_theme:"Seguir tema",alt_progress:"Barra de progresso alternativa",display_timestamps:"Mostrar carimbos de tempo",swap_pause_stop:"Substituir Pausa por Stop",adaptive_controls:"Tamanho adaptativo",hide_active_entity:"Ocultar nome da entidade ativa",collapse_on_idle:"Contrair em repouso",hide_menu_player_toggle:"Ocultar leitor do menu",always_collapsed:"Sempre contra\xEDdo",expand_on_search:"Expandir ao procurar",script_var:"Vari\xE1vel script (yamp_entity)",use_ma_template:"Usar modelo MA",use_vol_template:"Usar modelo Volume",follow_active_entity:"Volume segue a entidade ativa",use_url_path:"Usar URL ou caminho",adaptive_text_elements:"Elementos de texto adaptativo",disable_auto_select:"Desativar sele\xE7\xE3o autom\xE1tica"},fields:{artwork_fit:"Ajuste",artwork_position:"Posi\xE7\xE3o",artwork_hostname:"Host",match_field:"Campo",match_value:"Valor",size_percent:"Tamanho (%)",object_fit:"Object Fit",idle_timeout:"Repouso (ms)",show_chip_row:"Mostrar chips",search_limit:"Limite de procura",result_sorting:"Ordem",vol_step:"Passo de volume",card_height:"Altura (px)",control_layout:"Design",save_service_data:"Guardar",image_url:"URL imagem",fallback_image_url:"URL de reserva",move_to_main:"Mover para chips principais",move_to_menu:"Mover para o menu",delete_action:"Eliminar a\xE7\xE3o",revert_service_data:"Anular altera\xE7\xF5es",test_action:"Testar a\xE7\xE3o",volume_mode:"Modo volume",idle_screen:"Ecr\xE3 de repouso",name:"Nome",hidden_controls:"Controlos ocultos",ma_template:"Modelo MA (Jinja)",hidden_chips:"Chips ocultos",vol_template:"Modelo Volume (Jinja)",icon:"\xCDcone",action_type:"Tipo de a\xE7\xE3o",menu_item:"Item de menu",nav_path:"Caminho",service:"Servi\xE7o",service_data:"Dados",idle_image_entity:"Entidade imagem repouso",match_entity:"Entidade",ma_entity:"Entidade Music Assistant",vol_entity:"Entidade de volume",selected_entity_helper:"Helper de entidade selecionada",sync_entity_type:"Tipo de entidade a sincronizar",placement:"Posicionamento",card_trigger:"Gatilho do cart\xE3o",search_view:"Vista de resultados de pesquisa",search_card_columns:"Colunas de cart\xF5es"},action_types:{menu:"Abrir um item do menu",service:"Chamar um servi\xE7o",navigate:"Navegar",sync_selected_entity:"Sincronizar entidade selecionada"},action_helpers:{sync_selected_entity:"Sincronizar entidade selecionada \u2192",select_helper:"(selecionar helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entidade Music Assistant se configurada)",yamp_main_entity:"yamp_main_entity (Entidade principal do reprodutor)",yamp_playback_entity:"yamp_playback_entity (Entidade de reprodu\xE7\xE3o ativa atual)"},placements:{chip:"Chip de a\xE7\xE3o",menu:"No menu",hidden:"Oculto (Toque no Artwork)",not_triggerable:"N\xE3o acion\xE1vel"},triggers:{none:"Nenhum",tap:"Toque",hold:"Manter premido",double_tap:"Toque duplo",swipe_left:"Deslizar para a esquerda",swipe_right:"Deslizar para a direita"},search_view_options:{list:"Lista",card:"Cart\xE3o"}},card:{sections:{details:"Detalhes de reprodu\xE7\xE3o",menu:"Menu e Procura",action_chips:"Chips de a\xE7\xE3o"},media_controls:{shuffle:"Aleat\xF3rio",previous:"Anterior",play_pause:"Reproduzir/Pausa",stop:"Parar",next:"Seguinte",repeat:"Repetir"},menu:{more_info:"Mais info",search:"Procurar",source:"Fonte",transfer_queue:"Transferir fila",group_players:"Agrupar",select_entity:"Selecionar",transfer_to:"Transferir para",no_players:"Sem leitores MA."},grouping:{title:"Agrupar",sync_volume:"Sincronizar volume",group_all:"Agrupar todos",ungroup_all:"Separar todos",unavailable:"Indispon\xEDvel",no_players:"N\xE3o agrup\xE1vel.",master:"Mestre",joined:"Unido",available:"Dispon\xEDvel",current:"Atual",unjoin_from:"Desvincular de {master}",join_with:"Juntar-se a {master}"}},search:{favorites:"Favoritos",recently_played:"Recentes",next_up:"A seguir",recommendations:"Recomenda\xE7\xF5es",radio_mode:"Modo R\xE1dio",close:"Fechar",no_results:"Sem resultados.",play_next:"Reproduzir seguinte",replace_play:"Substituir e reproduzir",replace:"Substituir fila",add_queue:"Adicionar ao fim",move_up:"Subir",move_down:"Descer",move_next:"Passar para seguinte",remove:"Remover da fila",added:"Adicionado!",labels:{replace:"Substituir",next:"Seguinte",replace_next:"Subst. seg.",add:"Adicionar"},results:"resultados",result:"resultado",filters:{all:"Tudo",artist:"Artista",album:"\xC1lbum",track:"Faixa",playlist:"Lista",radio:"R\xE1dio",music:"M\xFAsica",station:"Esta\xE7\xE3o",podcast:"Podcast",audiobook:"Audiolivro"},search_artist:"Procurar este artista"}},bo={common:{not_found:"Entita sa nena\u0161la.",search:"H\u013Eada\u0165",power:"Nap\xE1janie",favorite:"Ob\u013E\xFAben\xE9",loading:"Na\u010D\xEDtava sa...",no_results:"\u017Diadne v\xFDsledky.",close:"Zatvori\u0165",vol_up:"Zv\xFD\u0161i\u0165 hlasitos\u0165",vol_down:"Zn\xED\u017Ei\u0165 hlasitos\u0165",media_player:"Prehr\xE1va\u010D m\xE9di\xED",edit_entity:"Upravi\u0165 nastavenia entity",edit_action:"Upravi\u0165 nastavenia akcie",mute:"Stlmi\u0165",unmute:"Zru\u0161i\u0165 stlmenie",seek:"Posun\xFA\u0165",volume:"Hlasitos\u0165",play_now:"Prehra\u0165 teraz",more_options:"Viac mo\u017Enost\xED",unavailable:"Nedostupn\xE9",back:"Sp\xE4\u0165",cancel:"Zru\u0161i\u0165",reset_default:"Obnovi\u0165 predvolen\xE9"},editor:{tabs:{entities:"Entity",behavior:"Spr\xE1vanie",look_and_feel:"Vzh\u013Ead a dojem",artwork:"Grafika",actions:"Akcie"},placeholders:{search:"H\u013Eada\u0165 hudbu..."},sections:{artwork:{general:{title:"V\u0161eobecn\xE9 nastavenia",description:"Glob\xE1lne ovl\xE1danie toho, ako sa grafika zobrazuje a z\xEDskava."},idle:{title:"Grafika pri ne\u010Dinnosti",description:"Zobrazi\u0165 statick\xFD obr\xE1zok alebo sn\xEDmku entity, ke\u010F sa ni\u010D neprehr\xE1va."},overrides:{title:"Prep\xEDsania grafiky",description:"Prep\xEDsania sa vyhodnocuj\xFA zhora nadol. Poradie zmen\xEDte potiahnut\xEDm."}},entities:{title:"Entity*",description:"Pridajte prehr\xE1va\u010De m\xE9di\xED, ktor\xE9 chcete ovl\xE1da\u0165. Potiahnut\xEDm ent\xEDt zmen\xEDte poradie v riadku \u010Dipov."},behavior:{idle_chips:{title:"Ne\u010Dinnos\u0165 a \u010Dipy",description:"Vyberte, kedy karta prejde do ne\u010Dinnosti a ako sa spr\xE1vaj\xFA \u010Dipy ent\xEDt."},interactions_search:{title:"Interakcie a h\u013Eadanie",description:"Doladenie prip\xEDnania ent\xEDt a po\u010Dtu zobrazen\xFDch v\xFDsledkov."}},look_and_feel:{theme_layout:{title:"T\xE9ma a rozlo\u017Eenie",description:"Prisp\xF4sobte \u0161t\xFDl panelu a ovl\xE1dajte celkov\xFD vzh\u013Ead."},controls_typography:{title:"Ovl\xE1danie a typografia",description:"Nastavenie ve\u013Ekosti tla\u010Didiel, \u0161t\xEDtkov ent\xEDt a adapt\xEDvneho textu."},collapsed_idle:{title:"Zbalen\xE9 stavy a ne\u010Dinnos\u0165",description:"Ovl\xE1dajte, kedy sa karta zbal\xED a ktor\xE9 zobrazenia sa uk\xE1\u017Eu po\u010Das ne\u010Dinnosti."}},actions:{title:"Akcie",description:"Vytvorte ak\u010Dn\xE9 \u010Dipy, ktor\xE9 sa zobrazia na karte alebo v jej menu. Potiahnut\xEDm zmen\xEDte poradie, kliknut\xEDm na ceruzku akciu nakonfigurujete."}},subtitles:{idle_timeout:"\u010Cas v milisekund\xE1ch, k\xFDm karta prejde do re\u017Eimu ne\u010Dinnosti. Nastavte na 0 pre vypnutie.",show_chip_row:'"Auto" skryje riadok \u010Dipov, ak je nakonfigurovan\xE1 len jedna entita. "V menu" presunie \u010Dipy do ponuky menu. "V menu pri ne\u010Dinnosti" zobraz\xED \u010Dipy v riadku ke\u010F je akt\xEDvne, ale presunie ich do menu pri ne\u010Dinnosti.',dim_chips:"Ke\u010F karta prejde do re\u017Eimu ne\u010Dinnosti s obr\xE1zkom, stlmte \u010Dipy ent\xEDt a akci\xED pre \u010Distej\u0161\xED vzh\u013Ead.",hold_to_pin:"Dlh\xFDm stla\u010Den\xEDm \u010Dipov ent\xEDt ich pripnete, \u010D\xEDm zabr\xE1nite automatick\xE9mu prep\xEDnaniu po\u010Das prehr\xE1vania.",always_show_group:"Ovl\xE1dacie prvky r\xFDchleho zoskupovania (+/-/hviezdi\u010Dka) bud\xFA predvolene vidite\u013En\xE9 pri na\u010D\xEDtan\xED str\xE1nky. St\xE1le ich m\xF4\u017Eete manu\xE1lne prep\xEDna\u0165 dvojit\xFDm klepnut\xEDm.",disable_autofocus:"Zabr\xE1ni vyh\u013Ead\xE1vaciemu po\u013Eu prebra\u0165 zameranie, aby zostali kl\xE1vesnice na obrazovke skryt\xE9.",search_within_filter:"Povoli\u0165 vyh\u013Ead\xE1vanie v r\xE1mci aktu\xE1lneho akt\xEDvneho filtra (Ob\u013E\xFAben\xE9, Ned\xE1vno prehr\xE1van\xE9 at\u010F.) namiesto jeho vymazania.",close_search_on_play:"Automaticky zatvori\u0165 obrazovku vyh\u013Ead\xE1vania po spusten\xED skladby.",pin_search_headers:"Ponecha\u0165 pole vyh\u013Ead\xE1vania a filtre pevne navrchu po\u010Das pos\xFAvania v\xFDsledkov.",hide_search_headers_on_idle:"Skry\u0165 vyh\u013Ead\xE1vanie a filtre, ke\u010F je prehr\xE1va\u010D ne\u010Dinn\xFD.",disable_mass:"Deaktivova\u0165 volite\u013En\xFA integr\xE1ciu Mass Queue, aj ke\u010F je nain\u0161talovan\xE1.",swap_pause_stop:"Nahradi\u0165 tla\u010Didlo pauzy tla\u010Didlom zastavenia pri pou\u017Eit\xED modern\xE9ho rozlo\u017Eenia.",adaptive_controls:"Umo\u017Eni\u0165 tla\u010Didl\xE1m prehr\xE1vania meni\u0165 ve\u013Ekos\u0165 pod\u013Ea dostupn\xE9ho priestoru.",hide_menu_player:"Ke\u010F s\xFA \u010Dipy v menu, skry\u0165 n\xE1zov entity v spodnej \u010Dasti karty.",adaptive_text:"Vyberte skupiny textu, ktor\xE9 sa maj\xFA \u0161k\xE1lova\u0165 pod\u013Ea priestoru (nechajte pr\xE1zdne pre vypnutie).",collapse_expand:'"V\u017Edy zbalen\xE9" vytvor\xED re\u017Eim mini prehr\xE1va\u010Da. "Rozbali\u0165 pri h\u013Eadan\xED" kartu do\u010Dasne rozbal\xED pri vyh\u013Ead\xE1van\xED.',idle_screen:"Vyberte obrazovku, ktor\xE1 sa m\xE1 automaticky zobrazi\u0165 v re\u017Eime ne\u010Dinnosti.",hide_controls:"Vyberte ovl\xE1dacie prvky, ktor\xE9 chcete pre t\xFAto entitu skry\u0165 (\u0161tandardne s\xFA zobrazen\xE9 v\u0161etky).",hide_search_chips:"Skry\u0165 konkr\xE9tne \u010Dipy filtra vyh\u013Ead\xE1vania pre t\xFAto entitu.",follow_active_entity:"Ak je povolen\xE9, entita hlasitosti bude automaticky sledova\u0165 akt\xEDvny prehr\xE1va\u010D. Pozn\xE1mka: Toto prep\xED\u0161e vybran\xFA entitu hlasitosti.",search_limit_full:"Maxim\xE1lny po\u010Det v\xFDsledkov vyh\u013Ead\xE1vania (1-1000, predvolen\xE9: 20).",default_search_filter_full:"Vyberte, ktor\xFD filter bude predvolene akt\xEDvny pri otvoren\xED vyh\u013Ead\xE1vania.",result_sorting_full:"Vyberte sp\xF4sob zoradenia v\xFDsledkov. Predvolen\xE9 ponech\xE1va poradie zo zdroja.",card_height_full:"Nechajte pr\xE1zdne pre automatick\xFA v\xFD\u0161ku.",control_layout_full:"Vyberte si medzi star\u0161\xEDm (rovnako ve\u013Ek\xE9 prvky) alebo modern\xFDm rozlo\u017Een\xEDm Home Assistant.",artwork_extend:"Umo\u017Eni\u0165 pozadiu grafiky pokra\u010Dova\u0165 pod riadkami \u010Dipov a akci\xED.",artwork_extend_label:"Roz\u0161\xEDri\u0165 grafiku",no_artwork_overrides:"Nie s\xFA nastaven\xE9 \u017Eiadne prep\xEDsania grafiky. Pridajte ich pomocou tla\u010Didla plus.",entity_current_hint:"Pou\u017Eite 'entity_id: current' na zacielenie aktu\xE1lne vybranej entity na karte. Pozn\xE1mka: Tla\u010Didlo 'Testova\u0165 akciu' bude v tomto pr\xEDpade neakt\xEDvne.",service_data_note:"Zmeny v servisn\xFDch \xFAdajoch sa neulo\u017Eia, k\xFDm nekliknete na tla\u010Didlo 'Ulo\u017Ei\u0165 servisn\xE9 \xFAdaje'!",jinja_template_hint:"Zadajte Jinja \u0161abl\xF3nu, ktor\xE1 vr\xE1ti jedno entity_id. Pr\xEDklad prep\xEDnania MA na z\xE1klade v\xFDberu zdroja:",jinja_template_vol_hint:"Zadajte Jinja \u0161abl\xF3nu, ktor\xE1 vr\xE1ti entity_id (napr. media_player.obyvacka). Pr\xEDklad prep\xEDnania hlasitosti pod\u013Ea stavu:",not_available_alt_collapsed:"Nedostupn\xE9 s alternat\xEDvnym indik\xE1torom priebehu alebo v re\u017Eime V\u017Edy zbalen\xE9.",not_available_collapsed:"Nedostupn\xE9, ke\u010F je zapnut\xE9 V\u017Edy zbalen\xE9.",only_available_collapsed:"Dostupn\xE9 len pri zapnutom re\u017Eime V\u017Edy zbalen\xE9.",only_available_modern:"Dostupn\xE9 len s modern\xFDm rozlo\u017Een\xEDm.",image_url_helper:"Zadajte priamu URL na obr\xE1zok alebo lok\xE1lnu cestu k s\xFAboru",selected_entity_helper:"Pomocn\xEDk pre vstupn\xFD text, ktor\xFD bude aktualizovan\xFD o ID aktu\xE1lne vybranej entity prehr\xE1va\u010Da m\xE9di\xED.",sync_entity_type:"Vyberte, ktor\xE9 ID entity sa m\xE1 synchronizova\u0165 s pomocn\xEDkom (predvolene entita Music Assistant, ak je nakonfigurovan\xE1).",disable_auto_select:"Zabr\xE1ni automatick\xE9mu v\xFDberu \u010Dipu tejto entity pri spusten\xED prehr\xE1vania.",search_view:"Vyberte si medzi \u0161tandardn\xFDm zoznamom alebo mrie\u017Ekou kariet pre v\xFDsledky vyh\u013Ead\xE1vania.",search_card_columns:"Zadajte, ko\u013Eko st\u013Apcov sa m\xE1 pou\u017Ei\u0165 v zobrazen\xED karty. Grafika sa automaticky prisp\xF4sob\xED."},titles:{edit_entity:"Upravi\u0165 entitu",edit_action:"Upravi\u0165 akciu",service_data:"Servisn\xE9 \xFAdaje",add_artwork_override:"Prida\u0165 prep\xEDsanie grafiky"},labels:{dim_chips:"Stlmi\u0165 \u010Dipy pri ne\u010Dinnosti",hold_to_pin:"Podr\u017Ea\u0165 pre pripnutie",always_show_group:"R\xFDchle zoskupovanie ako predvolen\xE9",disable_autofocus:"Vypn\xFA\u0165 automatick\xE9 zameranie h\u013Eadania",keep_filters:"Zachova\u0165 filtre pri h\u013Eadan\xED",dismiss_on_play:"Zavrie\u0165 h\u013Eadanie po spusten\xED",default_search_filter:"Predvolen\xFD filter vyh\u013Ead\xE1vania",pin_headers:"Pripn\xFA\u0165 hlavi\u010Dky h\u013Eadania",hide_search_headers_on_idle:"Skry\u0165 hlavi\u010Dky pri ne\u010Dinnosti",disable_mass:"Deaktivova\u0165 Mass Queue",match_theme:"Pod\u013Ea t\xE9my",alt_progress:"Alternat\xEDvny indik\xE1tor priebehu",display_timestamps:"Zobrazi\u0165 \u010Dasov\xE9 \xFAdaje",swap_pause_stop:"Vymeni\u0165 pauzu za stop",adaptive_controls:"Adapt\xEDvna ve\u013Ekos\u0165 ovl\xE1dania",hide_active_entity:"Skry\u0165 \u0161t\xEDtok akt\xEDvnej entity",collapse_on_idle:"Zbali\u0165 pri ne\u010Dinnosti",hide_menu_player_toggle:"Skry\u0165 prehr\xE1va\u010D v menu",always_collapsed:"V\u017Edy zbalen\xE9",expand_on_search:"Rozbali\u0165 pri h\u013Eadan\xED",script_var:"Premenn\xE1 skriptu (yamp_entity)",use_ma_template:"Pou\u017Ei\u0165 \u0161abl\xF3nu pre Music Assistant",use_vol_template:"Pou\u017Ei\u0165 \u0161abl\xF3nu pre entitu hlasitosti",follow_active_entity:"Hlasitos\u0165 sleduje akt\xEDvnu entitu",use_url_path:"Pou\u017Ei\u0165 URL alebo cestu",adaptive_text_elements:"Prvky s adapt\xEDvnou ve\u013Ekos\u0165ou textu",disable_auto_select:"Zak\xE1za\u0165 automatick\xFD v\xFDber"},fields:{artwork_fit:"Prisp\xF4sobenie grafiky",artwork_position:"Poz\xEDcia grafiky",artwork_hostname:"Hostname pre grafiku",match_field:"Pole pre zhodu",match_value:"Hodnota pre zhodu",size_percent:"Ve\u013Ekos\u0165 (%)",object_fit:"Prisp\xF4sobenie objektu (Fit)",idle_timeout:"\u010Cas ne\u010Dinnosti (ms)",show_chip_row:"Zobrazi\u0165 riadok \u010Dipov",search_limit:"Limit v\xFDsledkov h\u013Eadania",result_sorting:"Zoradenie v\xFDsledkov",vol_step:"Krok hlasitosti (0.05 = 5%)",card_height:"V\xFD\u0161ka karty (px)",control_layout:"Rozlo\u017Eenie ovl\xE1dania",save_service_data:"Ulo\u017Ei\u0165 servisn\xE9 \xFAdaje",image_url:"URL obr\xE1zka",fallback_image_url:"Z\xE1lo\u017En\xE1 URL obr\xE1zka",move_to_main:"Presun\xFA\u0165 do hlavn\xFDch \u010Dipov",move_to_menu:"Presun\xFA\u0165 do menu",delete_action:"Vymaza\u0165 akciu",revert_service_data:"Vr\xE1ti\u0165 ulo\u017Een\xE9 servisn\xE9 \xFAdaje",test_action:"Testova\u0165 akciu",volume_mode:"Re\u017Eim hlasitosti",idle_screen:"Obrazovka pri ne\u010Dinnosti",name:"N\xE1zov",hidden_controls:"Skryt\xE9 ovl\xE1dacie prvky",ma_template:"Jinja \u0161abl\xF3na pre Music Assistant",hidden_chips:"Skryt\xE9 \u010Dipy filtrov h\u013Eadania",vol_template:"Jinja \u0161abl\xF3na pre hlasitos\u0165",icon:"Ikona",action_type:"Typ akcie",menu_item:"Polo\u017Eka menu",nav_path:"Cesta navig\xE1cie",service:"Slu\u017Eba",service_data:"Servisn\xE9 \xFAdaje",idle_image_entity:"Entita obr\xE1zka pri ne\u010Dinnosti",match_entity:"Entita pre zhodu",ma_entity:"Entita Music Assistant",vol_entity:"Entita hlasitosti",selected_entity_helper:"Pomocn\xEDk vybratej entity",sync_entity_type:"Typ entity na synchroniz\xE1ciu",placement:"Umiestnenie",card_trigger:"Sp\xFA\u0161\u0165a\u010D karty",search_view:"Zobrazenie v\xFDsledkov vyh\u013Ead\xE1vania",search_card_columns:"St\u013Apce karty"},action_types:{menu:"Otvori\u0165 polo\u017Eku menu karty",service:"Zavola\u0165 slu\u017Ebu",navigate:"Navigova\u0165",sync_selected_entity:"Synchronizova\u0165 vybran\xFA entitu"},action_helpers:{sync_selected_entity:"Synchronizova\u0165 vybran\xFA entitu \u2192",select_helper:"(vybra\u0165 pomocn\xEDka)"},sync_entity_options:{yamp_entity:"yamp_entity (Entita Music Assistant, ak je nakonfigurovan\xE1)",yamp_main_entity:"yamp_main_entity (Hlavn\xE1 entita prehr\xE1va\u010Da m\xE9di\xED)",yamp_playback_entity:"yamp_playback_entity (Aktu\xE1lna akt\xEDvna entita prehr\xE1vania)"},placements:{chip:"Ak\u010Dn\xFD \u010Dip",menu:"V menu",hidden:"Skryt\xE9 (\u0164uknutie na grafiku)",not_triggerable:"Nespustite\u013En\xE9"},triggers:{none:"\u017Diadny",tap:"\u0164uknutie",hold:"Podr\u017Eanie",double_tap:"Dvojit\xE9 \u0165uknutie",swipe_left:"Potiahnutie do\u013Eava",swipe_right:"Potiahnutie doprava"},search_view_options:{list:"Zoznam",card:"Karta"}},card:{sections:{details:"Detaily prehr\xE1vania",menu:"Menu a vyh\u013Ead\xE1vanie",action_chips:"Ak\u010Dn\xE9 \u010Dipy"},media_controls:{shuffle:"N\xE1hodne",previous:"Predch\xE1dzaj\xFAce",play_pause:"Prehra\u0165/Pozastavi\u0165",stop:"Zastavi\u0165",next:"Nasleduj\xFAce",repeat:"Opakova\u0165"},menu:{more_info:"Viac inform\xE1ci\xED",search:"H\u013Eada\u0165",source:"Zdroj",transfer_queue:"Presun\xFA\u0165 frontu",group_players:"Zoskupi\u0165 prehr\xE1va\u010De",select_entity:"Vyberte entitu pre viac info",transfer_to:"Presun\xFA\u0165 frontu do",no_players:"\u017Diadne in\xE9 prehr\xE1va\u010De Music Assistant nie s\xFA k dispoz\xEDcii."},grouping:{title:"Zoskupi\u0165 prehr\xE1va\u010De",sync_volume:"Synchronizova\u0165 hlasitos\u0165",group_all:"Zoskupi\u0165 v\u0161etko",ungroup_all:"Zru\u0161i\u0165 zoskupenie v\u0161etk\xE9ho",unavailable:"Prehr\xE1va\u010D je nedostupn\xFD",no_players:"\u017Diadne in\xE9 prehr\xE1va\u010De schopn\xE9 zoskupenia nie s\xFA k dispoz\xEDcii.",master:"Hlavn\xFD (Master)",joined:"Pripojen\xFD",available:"Dostupn\xFD",current:"Aktu\xE1lny",unjoin_from:"Odpoji\u0165 od {master}",join_with:"Pripoji\u0165 k {master}"}},search:{favorites:"Ob\u013E\xFAben\xE9",recently_played:"Ned\xE1vno prehr\xE1van\xE9",next_up:"Nasleduj\xFAce",recommendations:"Odpor\xFA\u010Dania",radio_mode:"Re\u017Eim r\xE1dio",close:"Zatvori\u0165 vyh\u013Ead\xE1vanie",no_results:"\u017Diadne v\xFDsledky.",play_next:"Prehra\u0165 ako nasleduj\xFAce",replace_play:"Nahradi\u0165 frontu a prehra\u0165 teraz",replace:"Nahradi\u0165 frontu",add_queue:"Prida\u0165 na koniec fronty",move_up:"Posun\xFA\u0165 nahor",move_down:"Posun\xFA\u0165 nadol",move_next:"Presun\xFA\u0165 na nasleduj\xFAce",remove:"Odstr\xE1ni\u0165 z fronty",added:"Pridan\xE9 do fronty!",labels:{replace:"Nahradi\u0165",next:"Nasleduj\xFAce",replace_next:"Nahradi\u0165 nasleduj\xFAce",add:"Prida\u0165"},results:"v\xFDsledkov",result:"v\xFDsledok",filters:{all:"V\u0161etko",artist:"Interpret",album:"Album",track:"Skladba",playlist:"Playlist",radio:"R\xE1dio",music:"Hudba",station:"Stanica",podcast:"Podcast",audiobook:"Audiokniha"},search_artist:"H\u013Eada\u0165 tohto interpreta"}},xo={common:{not_found:"Entiteta ni najdena.",search:"I\u0161\u010Di",power:"Napajanje",favorite:"Priljubljeno",loading:"Nalaganje...",no_results:"Ni rezultatov.",close:"Zapri",vol_up:"Pove\u010Daj glasnost",vol_down:"Zmanj\u0161aj glasnost",media_player:"Predvajalnik predstavnosti",edit_entity:"Uredi nastavitve entitete",edit_action:"Uredi nastavitve dejanja",mute:"Uti\u0161aj",unmute:"Vklopi zvok",seek:"Previj",volume:"Glasnost",play_now:"Predvajaj zdaj",more_options:"Ve\u010D mo\u017Enosti",unavailable:"Ni na voljo",back:"Nazaj",cancel:"Prekli\u010Di",reset_default:"Ponastavi na privzeto"},editor:{tabs:{entities:"Entitete",behavior:"Vedenje",look_and_feel:"Videz in ob\u010Dutek",artwork:"Grafika",actions:"Dejanja"},placeholders:{search:"I\u0161\u010Di glasbo..."},sections:{artwork:{general:{title:"Splo\u0161ne nastavitve",description:"Globalni nadzor nad prikazom in pridobivanjem grafike."},idle:{title:"Grafika v mirovanju",description:"Prika\u017Ei stati\u010Dno sliko ali posnetek entitete, ko se ni\u010D ne predvaja."},overrides:{title:"Prepis grafike",description:"Prepisi se ocenjujejo od zgoraj navzdol. Povlecite za spremembo vrstnega reda."}},entities:{title:"Entitete*",description:"Dodajte predvajalnike, ki jih \u017Eelite upravljati. Povlecite entitete za spremembo vrstnega reda."},behavior:{idle_chips:{title:"Mirovanje in \u010Dipi",description:"Izberite, kdaj kartica preide v mirovanje in kako se obna\u0161ajo \u010Dipi entitet."},interactions_search:{title:"Interakcije in iskanje",description:"Nastavite pripenjanje entitet in \u0161tevilo prikazanih rezultatov."}},look_and_feel:{theme_layout:{title:"Tema in postavitev",description:"Ujemanje s slogom nadzorne plo\u0161\u010De in nadzor velikosti."},controls_typography:{title:"Kontrolniki in tipografija",description:"Prilagodite velikost gumbov, oznake entitet in prilagodljivo besedilo."},collapsed_idle:{title:"Strnjeno in mirovanje",description:"Nadzorujte, kdaj se kartica skr\u010Di in kaj se prika\u017Ee v mirovanju."}},actions:{title:"Dejanja",description:"Ustvarite \u010Dipe dejanj, ki se prika\u017Eejo na kartici ali v meniju."}},subtitles:{idle_timeout:"\u010Cas v milisekundah, preden kartica preide v mirovanje. Nastavite na 0 za izklop.",show_chip_row:'"Samodejno" skrije \u010Dipe, \u010De je nastavljena ena entiteta. "V meniju" jih premakne v meni. "V meniju med nedejavnostjo" prika\u017Ee \u010Dipe v vrstici, ko je aktivna, a jih premakne v meni med nedejavnostjo.',dim_chips:"Ko kartica preide v mirovanje s sliko, se \u010Dipi zatemnijo.",hold_to_pin:"Dolgi pritisk za pripenjanje entitet namesto kratkega.",always_show_group:"Kontrolni elementi za hitro zdru\u017Eevanje (+/-/zvezda) bodo privzeto vidni ob nalaganju strani. \u0160e vedno jih lahko ro\u010Dno preklopite z dvojnim tapom.",disable_autofocus:"Prepre\u010Di samodejni fokus iskalnega polja.",search_within_filter:"I\u0161\u010Di znotraj trenutnega filtra.",close_search_on_play:"Samodejno zapri iskanje ob predvajanju.",pin_search_headers:"Pripni iskalno polje in filtre na vrh.",hide_search_headers_on_idle:"Skrij iskalno polje in filtre med mirovanjem.",disable_mass:"Onemogo\u010Di integracijo Mass Queue.",swap_pause_stop:"Zamenjaj gumb pavze z gumbom zaustavitve med uporabo moderne postavitve.",adaptive_controls:"Prilagodi velikost gumbov glede na prostor.",hide_menu_player:"Skrij oznako entitete v meniju.",adaptive_text:"Izberi skupine besedila za prilagajanje velikosti.",collapse_expand:"Vedno skr\u010Deno ustvari mini predvajalnik.",idle_screen:"Izberi zaslon, prikazan v mirovanju.",hide_controls:"Izberi kontrolnike za skrivanje.",hide_search_chips:"Skrij dolo\u010Dene iskalne filtre.",follow_active_entity:"Entiteta glasnosti sledi aktivni entiteti. Opomba: To prepi\u0161e izbrano entiteto za glasnost.",search_limit_full:"Najve\u010Dje \u0161tevilo rezultatov (1\u20131000, privzeto: 20).",default_search_filter_full:"Izberite, kateri filter je privzeto aktiven ob odprtju iskanja.",result_sorting_full:"Izberi razvr\u0161\u010Danje rezultatov.",card_height_full:"Pustite prazno za samodejno vi\u0161ino.",control_layout_full:"Izberi med staro in moderno postavitvijo.",artwork_extend:"Raz\u0161iri ozadje grafike pod \u010Dipe.",artwork_extend_label:"Raz\u0161iri grafiko",no_artwork_overrides:"Ni nastavljenih prepisov grafike.",entity_current_hint:"Uporabi entity_id: current za trenutno izbrano entiteto.",service_data_note:"Spremembe se shranijo \u0161ele ob kliku na ikono shrani.",jinja_template_hint:"Vnesite Jinja predlogo, ki vrne en entity_id.",jinja_template_vol_hint:"Vnesite Jinja predlogo za entiteto glasnosti.",not_available_alt_collapsed:"Ni na voljo z alternativno vrstico napredka.",not_available_collapsed:"Ni na voljo v vedno skr\u010Denem na\u010Dinu.",only_available_collapsed:"Na voljo le v vedno skr\u010Denem na\u010Dinu.",only_available_modern:"Na voljo le v moderni postavitvi.",image_url_helper:"Vnesite neposredni URL do slike ali lokalno pot do datoteke",selected_entity_helper:"Pomo\u010Dnik za vnos besedila, ki bo posodobljen z ID-jem trenutno izbranega predvajalnika medijev.",sync_entity_type:"Izberite, kateri ID entitete \u017Eelite sinhronizirati s pomo\u010Dnikom (privzeto entiteto Music Assistant, \u010De je nastavljena).",disable_auto_select:"Prepre\u010Di samodejno izbiro \u010Dipa te entitete ob za\u010Detku predvajanja.",search_view:"Izberite med standardnim seznamom ali mre\u017Eo kartic za rezultate iskanja.",search_card_columns:"Dolo\u010Dite \u0161tevilo stolpcev v pogledu kartic. Grafika se bo samodejno prilagodila."},titles:{edit_entity:"Uredi entiteto",edit_action:"Uredi dejanje",service_data:"Podatki storitve",add_artwork_override:"Dodaj prepis grafike"},labels:{dim_chips:"Zatemni \u010Dipe v mirovanju",hold_to_pin:"Dr\u017Ei za pripenjanje",always_show_group:"Hitro zdru\u017Eevanje kot privzeto",disable_autofocus:"Onemogo\u010Di samodejni fokus",keep_filters:"Ohrani filtre",dismiss_on_play:"Zapri iskanje ob predvajanju",default_search_filter:"Privzeti iskalni filter",pin_headers:"Pripni glave iskanja",hide_search_headers_on_idle:"Skrij glave iskanja med mirovanjem",disable_mass:"Onemogo\u010Di Mass Queue",match_theme:"Ujemaj temo",alt_progress:"Alternativna vrstica napredka",display_timestamps:"Prika\u017Ei \u010Dasovne oznake",swap_pause_stop:"Zamenjaj pavzo z zaustavitvijo",adaptive_controls:"Prilagodljiva velikost gumbov",hide_active_entity:"Skrij oznako aktivne entitete",collapse_on_idle:"Skr\u010Di v mirovanju",hide_menu_player_toggle:"Skrij predvajalnik v meniju",always_collapsed:"Vedno skr\u010Deno",expand_on_search:"Raz\u0161iri ob iskanju",script_var:"Skriptna spremenljivka",use_ma_template:"Uporabi predlogo za entiteto Music Assistant",use_vol_template:"Uporabi predlogo za glasnost",follow_active_entity:"Glasnost sledi aktivni entiteti",use_url_path:"Uporabi URL ali pot",adaptive_text_elements:"Elementi prilagodljive velikosti besedila",disable_auto_select:"Onemogo\u010Di samodejno izbiro"},fields:{artwork_fit:"Prileganje grafike",artwork_position:"Polo\u017Eaj grafike",artwork_hostname:"Ime gostitelja grafike",match_field:"Polje ujemanja",match_value:"Vrednost ujemanja",size_percent:"Velikost (%)",object_fit:"Prileganje objekta",idle_timeout:"\u010Cas mirovanja (ms)",show_chip_row:"Prika\u017Ei vrstico \u010Dipov",search_limit:"Omejitev rezultatov iskanja",result_sorting:"Razvr\u0161\u010Danje rezultatov",vol_step:"Korak glasnosti (0.05 = 5 %)",card_height:"Vi\u0161ina kartice (px)",control_layout:"Postavitev kontrolnikov",save_service_data:"Shrani podatke storitve",image_url:"URL slike",fallback_image_url:"Rezervni URL slike",move_to_main:"Premakni dejanje na glavno vrstico",move_to_menu:"Premakni dejanje v meni",delete_action:"Izbri\u0161i dejanje",revert_service_data:"Povrni shranjene podatke",test_action:"Preizkusi dejanje",volume_mode:"Na\u010Din glasnosti",idle_screen:"Zaslon v mirovanju",name:"Ime",hidden_controls:"Skriti kontrolniki",ma_template:"Predloga Music Assistant (Jinja)",hidden_chips:"Skriti iskalni \u010Dipi",vol_template:"Predloga entitete glasnosti (Jinja)",icon:"Ikona",action_type:"Vrsta dejanja",menu_item:"Element menija",nav_path:"Navigacijska pot",service:"Storitev",service_data:"Podatki storitve",idle_image_entity:"Entiteta slike v mirovanju",match_entity:"Ujemajo\u010Da entiteta",ma_entity:"Entiteta Music Assistant",vol_entity:"Entiteta glasnosti",selected_entity_helper:"Pomo\u010Dnik izbrane entitete",sync_entity_type:"Vrsta entitete za sinhronizacijo",placement:"Namestitev",card_trigger:"Spro\u017Eilec kartice",search_view:"Pogled rezultatov iskanja",search_card_columns:"Stolpci kartic"},action_types:{menu:"Odpri element menija kartice",service:"Pokli\u010Di storitev",navigate:"Navigiraj",sync_selected_entity:"Sinhroniziraj izbrano entiteto"},action_helpers:{sync_selected_entity:"Sinhroniziraj izbrano entiteto \u2192",select_helper:"(izberite pomo\u010Dnika)"},sync_entity_options:{yamp_entity:"yamp_entity (entiteta Music Assistant, \u010De je nastavljena)",yamp_main_entity:"yamp_main_entity (glavna entiteta predvajalnika medijev)",yamp_playback_entity:"yamp_playback_entity (trenutno aktivna entitea predvajanja)"},placements:{chip:"\u010Cip dejanja",menu:"V meniju",hidden:"Skrito (dotik grafike)",not_triggerable:"Ni mogo\u010De spro\u017Eiti"},triggers:{none:"Brez",tap:"Dotik",hold:"Pridr\u017Eanje",double_tap:"Dvojni dotik",swipe_left:"Podrsaj levo",swipe_right:"Podrsaj desno"},search_view_options:{list:"Seznam",card:"Kartica"}},card:{sections:{details:"Podrobnosti predvajanja",menu:"Meni in iskanje",action_chips:"\u010Cipi dejanj"},media_controls:{shuffle:"Naklju\u010Dno",previous:"Prej\u0161nje",play_pause:"Predvajaj/Pavza",stop:"Ustavi",next:"Naslednje",repeat:"Ponovi"},menu:{more_info:"Ve\u010D informacij",search:"I\u0161\u010Di",source:"Vir",transfer_queue:"Prenesi \u010Dakalno vrsto",group_players:"Zdru\u017Ei predvajalnike",select_entity:"Izberi entiteto za ve\u010D informacij",transfer_to:"Prenesi \u010Dakalno vrsto na",no_players:"Ni drugih razpolo\u017Eljivih predvajalnikov Music Assistant."},grouping:{title:"Zdru\u017Ei predvajalnike",sync_volume:"Sinhroniziraj glasnost",group_all:"Zdru\u017Ei vse",ungroup_all:"Razdru\u017Ei vse",unavailable:"Predvajalnik ni na voljo",no_players:"Ni drugih predvajalnikov za zdru\u017Eevanje.",master:"Glavni",joined:"Pridru\u017Een",available:"Na voljo",current:"Trenutni",unjoin_from:"Odslopi od {master}",join_with:"Pridru\u017Ei se {master}"}},search:{favorites:"Priljubljeni",recently_played:"Nedavno predvajano",next_up:"Naslednje",recommendations:"Priporo\u010Dila",radio_mode:"Radijski na\u010Din",close:"Zapri iskanje",no_results:"Ni rezultatov.",play_next:"Predvajaj naslednje",replace_play:"Zamenjaj \u010Dakalno vrsto in predvajaj",replace:"Zamenjaj \u010Dakalno vrsto",add_queue:"Dodaj na konec \u010Dakalne vrste",move_up:"Premakni gor",move_down:"Premakni dol",move_next:"Premakni na naslednje",remove:"Odstrani iz \u010Dakalne vrste",added:"Dodano v \u010Dakalno vrsto!",labels:{replace:"Zamenjaj",next:"Naslednje",replace_next:"Zamenjaj naslednje",add:"Dodaj"},results:"rezultati",result:"rezultat",filters:{all:"Vse",artist:"Izvajalec",album:"Album",track:"Skladba",playlist:"Seznam predvajanja",radio:"Radio",music:"Glasba",station:"Postaja",podcast:"Podcast",audiobook:"Zvo\u010Dna knjiga"},search_artist:"I\u0161\u010Di tega izvajalca"}};const Yi={en:po,de:_o,es:mo,fr:fo,it:go,nl:vo,pt:yo,sk:bo,sl:xo};function h(i,e="",t=""){const a=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_"),s=Yi[a]?a:a.split("_")[0];let r;const n=i.split("."),o=(l,c)=>{try{return c.reduce((u,d)=>u&&u[d]!==void 0?u[d]:void 0,l)}catch{return}};return r=o(Yi[s],n),r===void 0&&s!=="en"&&(r=o(Yi.en,n)),r===void 0&&(r=i),typeof r!="string"&&(r=i),e!==""&&t!==""&&(r=r.replace(e,t)),r}function wo({stateObj:i,showStop:e,shuffleActive:t,repeatActive:a,onControlClick:s,supportsFeature:r,showFavorite:n,favoriteActive:o,hiddenControls:l={},adaptiveControls:c=!1,controlLayout:u="classic",swapPauseForStop:d=!1}){if(!i)return b;const p=1,_=16,f=32,g=32768,y=262144,k=128,x=256,M=16384,E=u==="modern"?"modern":"classic";let G=!l.previous&&r(i,_),U=!l.play_pause&&(r(i,p)||r(i,M));const O=!l.stop&&e;let z=O,N=!l.next&&r(i,f),C=!l.shuffle&&r(i,g),I=!l.repeat&&r(i,y),R=!l.favorite&&n,B=!l.power&&(r(i,x)||r(i,k));const te=E==="modern"&&d&&O,ie=i.state==="playing",Z=te&&ie;E==="modern"&&(z=!1,R=!1,B=!1);const ne=Zi(i,r,n,l,e,E),oe=c?"controls-row adaptive":"controls-row",Ae=E==="modern"?`${oe} modern`:oe;let pe=c?`--yamp-control-count:${Math.max(ne,1)};`:b;if(c){const ae=ne<=3?{icon:56,minWidth:78,maxWidth:150,minHeight:78,padding:14,gap:14}:ne===4?{icon:48,minWidth:68,maxWidth:130,minHeight:68,padding:12,gap:12}:ne===5?{icon:42,minWidth:58,maxWidth:110,minHeight:58,padding:10,gap:10}:ne===6?{icon:36,minWidth:50,maxWidth:96,minHeight:52,padding:8,gap:8}:{icon:32,minWidth:44,maxWidth:88,minHeight:48,padding:6,gap:6};pe+=[`--yamp-control-gap:${ae.gap}px`,`--yamp-control-min-width:${ae.minWidth}px`,`--yamp-control-max-width:${ae.maxWidth}px`,`--yamp-control-min-height:${ae.minHeight}px`,`--yamp-control-padding:${ae.padding}px`,`--yamp-control-icon-size:${ae.icon}px`].join(";")}return E==="modern"?m`
      <div class=${Ae} style=${pe}>
        <div class="controls-left">
          ${C?m`
            <button class="modern-button small${t?" active":""}" @click=${()=>s("shuffle")} title="${h("card.media_controls.shuffle")}">
              <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
            </button>
          `:b}
          ${G?m`
            <button class="modern-button medium" @click=${()=>s("prev")} title="${h("card.media_controls.previous")}">
              <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
            </button>
          `:b}
        </div>

        <div class="controls-center">
          ${U?m`
            <button
              class="modern-button primary${ie?" active":""}"
              @click=${()=>s(Z?"stop":"play_pause")}
              title="${Z?h("card.media_controls.stop"):h("card.media_controls.play_pause")||"Play/Pause"}"
            >
              <ha-icon .icon=${Z?"mdi:stop":ie?"mdi:pause":"mdi:play"}></ha-icon>
            </button>
          `:b}
        </div>

        <div class="controls-right">
          ${N?m`
            <button class="modern-button medium" @click=${()=>s("next")} title="${h("card.media_controls.next")}">
              <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
            </button>
          `:b}
          ${I?m`
            <button class="modern-button small${a?" active":""}" @click=${()=>s("repeat")} title="${h("card.media_controls.repeat")}">
              <ha-icon .icon=${i.attributes.repeat==="one"?"mdi:repeat-once":"mdi:repeat"}></ha-icon>
            </button>
          `:b}
        </div>
      </div>
    `:m`
    <div class=${Ae} style=${pe}>
      ${G?m`
        <button class="button" @click=${()=>s("prev")} title="Previous">
          <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
        </button>
      `:b}
      ${U?m`
        <button class="button" @click=${()=>s("play_pause")} title="Play/Pause">
          <ha-icon .icon=${i.state==="playing"?"mdi:pause":"mdi:play"}></ha-icon>
        </button>
      `:b}
      ${z?m`
        <button class="button" @click=${()=>s("stop")} title="Stop">
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
      `:b}
      ${N?m`
        <button class="button" @click=${()=>s("next")} title="Next">
          <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
        </button>
      `:b}
      ${C?m`
        <button class="button${t?" active":""}" @click=${()=>s("shuffle")} title="Shuffle">
          <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
        </button>
      `:b}
      ${I?m`
        <button class="button${a?" active":""}" @click=${()=>s("repeat")} title="Repeat">
          <ha-icon .icon=${i.attributes.repeat==="one"?"mdi:repeat-once":"mdi:repeat"}></ha-icon>
        </button>
      `:b}
      ${R?m`
        <button class="button${o?" active":""}" @click=${()=>s("favorite")} title="Favorite">
          <ha-icon .icon=${o?"mdi:heart":"mdi:heart-outline"}></ha-icon>
        </button>
      `:b}
      ${B?m`
        <button
          class="button${i.state!=="off"?" active":""}"
          @click=${()=>s("power")}
          title="Power"
        >
          <ha-icon .icon=${"mdi:power"}></ha-icon>
        </button>
      `:b}
    </div>
  `}function Zi(i,e,t=!1,a={},s=!1,r="classic"){const n=r==="modern"?"modern":"classic";let o=0;return!a.previous&&e(i,16)&&o++,a.play_pause||o++,n!=="modern"&&!a.stop&&s&&o++,!a.next&&e(i,32)&&o++,!a.shuffle&&e(i,32768)&&o++,!a.repeat&&e(i,262144)&&o++,n!=="modern"&&!a.favorite&&t&&o++,n!=="modern"&&!a.power&&(e(i,256)||e(i,128))&&o++,o}function ko({isRemoteVolumeEntity:i,showSlider:e,vol:t,isMuted:a,supportsMute:s,onVolumeDragStart:r,onVolumeDragEnd:n,onVolumeChange:o,onVolumeStep:l,onMuteToggle:c,moreInfoMenu:u,leadingControlTemplate:d=b,reserveLeadingControlSpace:p=!1,showRightPlaceholder:_=!1,rightSlotTemplate:f=b,hideVolume:g=!1}){const y=d!==b&&d!==void 0&&d!==null,k=(x,M)=>(s?M:x===0)||x===0?"mdi:volume-off":x<.2?"mdi:volume-low":x<.5?"mdi:volume-medium":"mdi:volume-high";return m`
    <div class="volume-row ${e&&!i?"has-slider":""}">
      <div class="volume-left">
        ${y?d:p?m`<div class="volume-leading-placeholder"></div>`:b}
        ${!g&&!i?m`
          <button 
            class="volume-icon-btn" 
            @click=${c} 
            title=${h((s?a:t===0)?"common.unmute":"common.mute")}
          >
            <ha-icon icon=${k(t,a)}></ha-icon>
          </button>
        `:b}
      </div>

      <div class="volume-center">
        ${g?b:m`
          ${i?m`
              <div class="vol-stepper-container">
                <div class="vol-stepper">
                  <button class="button" @click=${()=>l(-1)} title="${h("common.vol_down")}">–</button>
                  <span class="vol-label">vol</span>
                  <button class="button" @click=${()=>l(1)} title="${h("common.vol_up")}">+</button>
                </div>
              </div>
            `:e?m`
                <div class="volume-slider-container">
                  <input
                    class="vol-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${t}
                    @mousedown=${r}
                    @touchstart=${r}
                    @change=${o}
                    @mouseup=${n}
                    @touchend=${n}
                    title="${h("common.volume")}"
                  />
                </div>
              `:m`
              <div class="vol-stepper-container">
                <div class="vol-stepper">
                  <button class="button" @click=${()=>l(-1)} title="${h("common.vol_down")}">–</button>
                  <span class="vol-value">${Math.round(t*100)}%</span>
                  <button class="button" @click=${()=>l(1)} title="${h("common.vol_up")}">+</button>
                </div>
              </div>
            `}
        `}
      </div>

      <div class="volume-right">
        ${_?m`
          <div class="volume-placeholder">
            ${f||b}
          </div>
        `:b}
        ${u}
      </div>
    </div>
  `}function vs(i){if(i==null||isNaN(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60);return`${e}:${t<10?"0":""}${t}`}function ni({progress:i,seekEnabled:e,onSeek:t,collapsed:a,accent:s,height:r=6,style:n="",displayTimestamps:o=!1,currentTime:l=0,duration:c=0}){const u=s||"var(--custom-accent, #ff9800)";return a?m`
      <div
        class="collapsed-progress-bar"
        style="width: ${i*100}%; background: ${u}; height: 4px; ${n}"
      ></div>
    `:m`
    <div class="progress-bar-container" style="${n}">
      <div
        class="progress-bar"
        style="height:${r}px; background:rgba(255,255,255,0.22);"
        @click=${e?t:null}
        title=${e?h("common.seek"):""}
      >
        <div
          class="progress-inner"
          style="width: ${i*100}%; background: ${u}; height:${r}px;"
        ></div>
      </div>
      ${o?m`
        <div class="timestamps-container">
           <span>${vs(l)}</span>
           <span>-${vs(Math.max(0,c-l))}</span>
        </div>
      `:b}
    </div>
  `}const q=Object.freeze({MEDIA_BACKGROUND:0,MEDIA_OVERLAY:0,FLOATING_ELEMENT:1,STICKY_CHIPS:1,ACCENT_FOREGROUND:1,FLOATING_CONTROLS:1,OVERLAY_BASE:2,MODAL_BACKDROP:2,MODAL_TOAST:2,SEARCH_SLIDE_OUT:1,SEARCH_SUCCESS:1}),Eo=Bi`
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
    z-index: ${q.FLOATING_ELEMENT};
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
    z-index: ${q.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
    transform: translateZ(0);
  }

  .full-bleed-artwork-fade {
    position: absolute;
    inset: -50px;
    z-index: ${q.MEDIA_OVERLAY};
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
    z-index: ${q.FLOATING_CONTROLS};
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
    z-index: ${q.MEDIA_BACKGROUND};
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
    z-index: ${q.MEDIA_OVERLAY};
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
    z-index: ${q.FLOATING_CONTROLS};
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
    z-index: ${q.STICKY_CHIPS};
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
    z-index: ${q.STICKY_CHIPS};
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
    z-index: ${q.FLOATING_ELEMENT};
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
    z-index: ${q.FLOATING_ELEMENT};
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
    z-index: ${q.MEDIA_BACKGROUND};
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
    z-index: ${q.MEDIA_OVERLAY};
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.92) 100%
    );
  }

  .card-lower-content {
    position: relative;
    z-index: ${q.FLOATING_ELEMENT};
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
    z-index: ${q.FLOATING_ELEMENT};
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
    z-index: ${q.ACCENT_FOREGROUND};
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
    z-index: ${q.OVERLAY_BASE};
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
    z-index: ${q.FLOATING_CONTROLS};
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
    z-index: ${q.STICKY_CHIPS};
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
    z-index: ${q.ACCENT_FOREGROUND};
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
    z-index: ${q.MEDIA_OVERLAY};
    min-height: 22px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: ${q.OVERLAY_BASE};
  }

  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: ${q.FLOATING_ELEMENT};
  }

  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.10);
    z-index: ${q.MEDIA_OVERLAY};
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
    z-index: ${q.SEARCH_SLIDE_OUT};
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
    z-index: ${q.SEARCH_SUCCESS};
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
    z-index: ${q.MODAL_BACKDROP};
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
    z-index: ${q.MODAL_TOAST};
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
    z-index: ${q.FLOATING_ELEMENT};
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
`,Ao=[{mode:"replace",icon:"mdi:playlist-remove",label:h("search.replace")},{mode:"next",icon:"mdi:playlist-play",label:h("search.play_next")},{mode:"replace_next",icon:"mdi:playlist-music",label:h("search.replace_play")},{mode:"add",icon:"mdi:playlist-plus",label:h("search.add_queue")}],Tt=["artist","album","track","playlist","radio","podcast","audiobook"],Le=(i,{cap:e,floor:t}={})=>{const a=Number(i);if(!Number.isFinite(a)||a<=0)return;let s=a;return typeof t=="number"&&(s=Math.max(t,s)),typeof e=="number"&&(s=Math.min(e,s)),s},ys=3e4;let Mt=null,Ki=0;async function oi(i){const e=Date.now();if(Mt&&e-Ki<ys)return Mt;try{return Mt=(await i.callApi("GET","config/config_entries/entry")).find(t=>t.domain==="music_assistant"&&t.state==="loaded")?.entry_id||null,Ki=e,Mt}catch(t){return console.error("yamp: Failed to resolve Music Assistant config entry",t),Mt=null,Ki=e,null}}let Ft=null,Xi=0;async function So(i){const e=Date.now();if(Ft&&e-Xi<ys)return Ft;try{return Ft=(await i.callApi("GET","config/config_entries/entry")).find(t=>t.domain==="mass_queue"&&t.state==="loaded")?.entry_id||null,Xi=e,Ft}catch(t){return console.error("yamp: Failed to resolve mass_queue config entry",t),Ft=null,Xi=e,null}}function Dt(i){return i?{title:i.name,media_content_id:i.uri,media_content_type:i.media_type,media_class:i.media_type,thumbnail:i.image,...i.artists&&{artist:i.artists.map(e=>e.name).join(", ")},...i.album&&{album:i.album.name},is_browsable:i.media_type==="artist"||i.media_type==="album"||i.media_type==="playlist"}:null}function li({item:i,onPlay:e,onOptionsToggle:t,upcomingFilterActive:a=!1,isMusicAssistant:s=!1,massQueueAvailable:r=!1,searchView:n="list",isInline:o=!1,onMoveUp:l,onMoveDown:c,onMoveNext:u,onRemove:d}){const p=!!(a&&i.queue_item_id&&s&&r),_=o?"entity-options-search-buttons":n==="card"?"card-overlay-buttons":"search-sheet-buttons",f=o?"entity-options-search-play":n==="card"?"search-sheet-play icon-only":"search-sheet-play",g=o?"entity-options-search-queue":n==="card"?"search-sheet-queue icon-only":"search-sheet-queue";return m`
    <div class="${_}">
      ${p&&o?m`
        <div class="queue-controls">
          <button class="queue-btn queue-btn-up" @click=${()=>l(i)} title="${h("search.move_up")}">
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-down" @click=${()=>c(i)} title="${h("search.move_down")}">
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-next" @click=${()=>u(i)} title="${h("search.move_next")}">
            <ha-icon icon="mdi:playlist-play"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-remove" @click=${()=>d(i)} title="${h("search.remove")}">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      `:b}
      <button class="${f}" 
              @click=${()=>e(i)} 
              title="${h("common.play_now")}">
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
      ${p?b:m`
        <button class="${g}" 
                @click=${y=>{y.preventDefault(),y.stopPropagation(),t(i)}} 
                title="${h("common.more_options")}">
          <ha-icon icon="mdi:dots-vertical"></ha-icon>
        </button>
      `}
    </div>
  `}function bs({item:i,activeSearchRowMenuId:e,successSearchRowMenuId:t,onPlayOption:a,onOptionsToggle:s,searchView:r="list",isQueueItem:n=!1,onMoveUp:o,onMoveDown:l,onMoveNext:c,onRemove:u}){const d=e!=null&&i.media_content_id!=null&&e===i.media_content_id,p=t===i.media_content_id;return m`
    <div class="search-row-slide-out ${d?"active":""}">
      ${n&&r==="card"?m`
        <button class="slide-out-button" @click=${()=>{o(i),s(null)}} title="${h("search.move_up")}">
          ${h("search.move_up")}
        </button>
        <button class="slide-out-button" @click=${()=>{l(i),s(null)}} title="${h("search.move_down")}">
          ${h("search.move_down")}
        </button>
        <button class="slide-out-button" @click=${()=>{c(i),s(null)}} title="${h("search.move_next")}">
          ${h("search.move_next")}
        </button>
        <button class="slide-out-button" @click=${()=>{u(i),s(null)}} title="${h("search.remove")}">
          ${h("search.remove")}
        </button>
      `:m`
        <button class="slide-out-button" @click=${()=>a(i,"replace")} title="${h("search.labels.replace")}">
          ${r==="card"?b:m`<ha-icon icon="mdi:playlist-remove"></ha-icon>`}${h("search.labels.replace")}
        </button>
        <button class="slide-out-button" @click=${()=>a(i,"next")} title="${h("search.labels.next")}">
          ${r==="card"?b:m`<ha-icon icon="mdi:playlist-play"></ha-icon>`}${h("search.labels.next")}
        </button>
        <button class="slide-out-button" @click=${()=>a(i,"replace_next")} title="${h("search.labels.replace_next")}">
          ${r==="card"?b:m`<ha-icon icon="mdi:playlist-music"></ha-icon>`}${h("search.labels.replace_next")}
        </button>
        <button class="slide-out-button" @click=${()=>a(i,"add")} title="${h("search.labels.add")}">
          ${r==="card"?b:m`<ha-icon icon="mdi:playlist-plus"></ha-icon>`}${h("search.labels.add")}
        </button>
      `}
      <div class="slide-out-close" @click=${_=>{_.stopPropagation(),s(null)}}>
        <ha-icon icon="mdi:close"></ha-icon>
      </div>

      ${p?m`
        <div class="search-row-success-overlay">
          <span>✅</span>
          <span>${h("search.added")}</span>
        </div>
      `:b}
    </div>
  `}function $o({open:i,query:e,onQueryInput:t,onSearch:a,onClose:s,loading:r,results:n,onPlay:o,onQueue:l,error:c,showQueueSuccess:u,matchTheme:d=!1,upcomingFilterActive:p=!1,disableAutofocus:_=!1,activeSearchRowMenuId:f,successSearchRowMenuId:g,onOptionsToggle:y,onPlayOption:k,onResultClick:x,searchView:M="list",searchCardColumns:E=4,massQueueAvailable:G=!1,onMoveUp:U,onMoveDown:O,onMoveNext:z,onRemove:N}){return i?m`
    <div class="search-sheet" data-match-theme="${d}" data-card-view="${M==="card"}">
      <div class="search-sheet-header">
        <input
          type="text"
          .value=${e||""}
          @input=${t}
          placeholder="${h("editor.placeholders.search")}"
          ?autofocus=${!_}
        />
        <button @click=${a} ?disabled=${r||!e}>${h("common.search")}</button>
        <button @click=${s} title="${h("search.close")}">✕</button>
      </div>
      ${r?m`<div class="search-sheet-loading">${h("common.loading")}</div>`:b}
      ${c?m`<div class="search-sheet-error">${c}</div>`:b}
      <div class="search-sheet-results ${M==="card"?"search-results-card-view":"list-view"}">
        ${(n||[]).length===0&&!r?m`<div class="search-sheet-empty">${h("common.no_results")}</div>`:(n||[]).map(C=>{const I=tt(C.media_content_id),R=C.is_browsable&&(C.media_class!=="playlist"||G);return m`
                <div class="search-sheet-result ${M==="card"?"search-result-card":""}">
                  <div class="search-sheet-thumb-container" 
                       data-clickable="${M==="card"}"
                       @click=${M==="card"?()=>o(C):null}>
                    ${C.thumbnail&&!String(C.thumbnail).includes("imageproxy")?m`
                      <img
                        class="search-sheet-thumb"
                        src=${C.thumbnail}
                        alt=${C.title}
                        onerror="this.style.display='none'"
                      />
                    `:m`
                      <div class="search-sheet-thumb-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `}
                    ${M==="card"?li({item:C,onPlay:o,onOptionsToggle:y,upcomingFilterActive:p,isMusicAssistant:I,massQueueAvailable:G,searchView:"card",onMoveUp:U,onMoveDown:O,onMoveNext:z,onRemove:N}):b}
                  </div>
                  <div class="search-sheet-info">
                    <span 
                      class="search-sheet-title ${R?"browsable":""}" 
                      @click=${()=>R&&x&&x(C)}
                    >
                      ${C.title}
                    </span>
                    ${C.artist?m`
                      <span 
                        class="search-sheet-subtitle ${R?"browsable":""}" 
                        @click=${()=>R&&x&&x(C)}
                      >
                        ${C.artist}
                      </span>
                    `:b}
                    ${M==="card"?m`
                      <div class="card-menu-button" @click=${B=>{B.preventDefault(),B.stopPropagation(),y(C)}}>
                        <ha-icon icon="mdi:dots-vertical"></ha-icon>
                      </div>
                    `:b}
                  </div>
                  ${M!=="card"?li({item:C,onPlay:o,onOptionsToggle:y,upcomingFilterActive:p,isMusicAssistant:I,massQueueAvailable:G,searchView:"list",isInline:!0,onMoveUp:U,onMoveDown:O,onMoveNext:z,onRemove:N}):b}
                  
                  ${bs({item:C,activeSearchRowMenuId:f,successSearchRowMenuId:g,onPlayOption:k,onOptionsToggle:y,searchView:M,isQueueItem:I&&C.queue_item_id&&p&&G,onMoveUp:U,onMoveDown:O,onMoveNext:z,onRemove:N})}
                </div>
              `})}
      </div>
    </div>
  `:b}function Io({item:i,onClose:e,onPlayOption:t}){return i?m`
    <div class="entity-options-overlay entity-options-overlay-opening" @click=${e}>
      <div class="entity-options-container entity-options-sheet-opening" @click=${a=>a.stopPropagation()}>
        <div class="entity-options-sheet">
          <div class="entity-options-title">${i.title}</div>
          
          ${Ao.map(a=>m`
            <button class="entity-options-item menu-action-item" @click=${()=>t(i,a.mode)}>
              <ha-icon class="menu-action-icon" .icon=${a.icon}></ha-icon>
              <span class="menu-action-label">${a.label}</span>
            </button>
          `)}
          
          <div class="entity-options-divider"></div>
          
          <button class="entity-options-item close-item" @click=${e}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  `:b}async function xs(i,e,t,a=null,s={},r=20){const n=await oi(i);if(n)try{if(s.favorites){const d=a&&a!=="all"?[a]:Tt,p=[];return await Promise.all(d.map(async _=>{try{const f={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:_,favorite:!0,search:t},return_response:!0},g=Le(r);g!==void 0&&(f.service_data.limit=g),s.orderBy&&s.orderBy!=="default"&&(f.service_data.order_by=s.orderBy),((await i.connection.sendMessagePromise(f))?.response?.items||[]).forEach(y=>{const k=Dt(y);k&&p.push(k)})}catch(f){console.error("yamp: Error searching favorites for type",_,f)}})),{results:p,usedMusicAssistant:!0}}if((!t||t.trim()==="")&&a&&a!=="all"&&!s.favorites){if(!Tt.includes(a))return console.warn(`yamp: Unsupported media type for browsing: ${a}. Skipping get_library call.`),{results:[],usedMusicAssistant:!0};try{const d={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:a},return_response:!0},p=Le(r);p!==void 0&&(d.service_data.limit=p),s.orderBy&&s.orderBy!=="default"&&(d.service_data.order_by=s.orderBy);const _=(await i.connection.sendMessagePromise(d))?.response?.items||[],f=[];return _.forEach(g=>{const y=Dt(g);y&&f.push(y)}),{results:f,usedMusicAssistant:!0}}catch(d){return console.error("yamp: Error browsing library for type",a,d),{results:[],usedMusicAssistant:!0}}}const o={name:t,config_entry_id:n},l=Le(r,{cap:a==="all"?8:void 0});l!==void 0&&(o.limit=l),a&&a!=="all"&&(o.media_type=a),s.artist&&(o.artist=s.artist),s.album&&(o.album=s.album);const c={type:"call_service",domain:"music_assistant",service:"search",service_data:o,return_response:!0},u=(await i.connection.sendMessagePromise(c))?.response;if(u){const d=[];return Object.entries(u).forEach(([p,_])=>{Array.isArray(_)&&_.forEach(f=>{const g=Dt(f);g&&d.push(g)})}),{results:d,usedMusicAssistant:!0}}}catch(o){console.error("yamp: Error in searchMedia:",o)}return{results:await To(i,e,t,a,s),usedMusicAssistant:!1}}async function Co(i,e,t=null,a=20,s={}){const r=await oi(i);if(!r)return{results:[],usedMusicAssistant:!1};const n=typeof s.onChunk=="function"?s.onChunk:null,o=async(l,c={})=>{const u={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:r,media_type:l,order_by:"last_played_desc"},return_response:!0},d=Le(a,c);return d!==void 0&&(u.service_data.limit=d),((await i.connection.sendMessagePromise(u))?.response?.items||[]).map(Dt).filter(Boolean)};try{if(t==="all"){const c=[];return await Promise.all(Tt.map(async u=>{const d=await o(u,{cap:5});d.length&&(c.push(...d),n&&n(d,u))})),{results:c,usedMusicAssistant:!0}}const l=await o(t||"track");return l.length&&n&&n(l,t||"track"),{results:l,usedMusicAssistant:!0}}catch(l){return console.error("yamp: Error getting recently played from Music Assistant:",l),{results:[],usedMusicAssistant:!1}}}async function ws(i,e,t=null,a=20,s={}){const r=await oi(i);if(!r)return{results:[],usedMusicAssistant:!1};const n=typeof s.onChunk=="function"?s.onChunk:null,o=async l=>{const c={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:r,media_type:l,favorite:!0},return_response:!0},u=Le(a,{cap:l==="all"?8:void 0});u!==void 0&&(c.service_data.limit=u),s.orderBy&&s.orderBy!=="default"&&(c.service_data.order_by=s.orderBy);try{return((await i.connection.sendMessagePromise(c))?.response?.items||[]).map(Dt).filter(Boolean)}catch(d){return console.error("yamp: Error loading favorites for type",l,d),[]}};try{if(t&&t!=="all"){const c=await o(t);return c.length&&n&&n(c,t),{results:c,usedMusicAssistant:!0}}const l=[];return await Promise.all(Tt.map(async c=>{const u=await o(c);u.length&&(l.push(...u),n&&n(u,c))})),{results:l,usedMusicAssistant:!0}}catch(l){return console.error("yamp: Error loading favorites",l),{results:[],usedMusicAssistant:!1}}}async function To(i,e,t,a,s={}){const r={entity_id:e,search_query:t};a&&a!=="all"&&(r.media_content_type=a);const n={type:"call_service",domain:"media_player",service:"search_media",service_data:r,return_response:!0},o=await i.connection.sendMessagePromise(n);return o?.response?.[e]?.result||o?.result||[]}function Mo(i,e,t){return i.callService("media_player","play_media",{entity_id:e,media_content_type:t.media_content_type,media_content_id:t.media_content_id})}async function Fo(i,e,t=null,a=null,s=null,r=100){if(!e)return!1;try{const n=await oi(i);if(!n)return!1;let o=t;if(!o){const l=Object.values(i.states).find(c=>tt(c)&&c.entity_id.startsWith("media_player."));if(l)o=l.entity_id;else return!1}if(a||s){try{const l={name:a||s,config_entry_id:n,media_type:"track"},c=Le(r);c!==void 0&&(l.limit=c),s&&(l.artist=s);const u={type:"call_service",domain:"music_assistant",service:"search",service_data:l,return_response:!0},d=(await i.connection.sendMessagePromise(u))?.response;let p=[];if(Array.isArray(d)?p=d:d&&typeof d=="object"&&Object.values(d).forEach(_=>{Array.isArray(_)&&p.push(..._)}),p.length){const _=(e.split("/").pop()||"").trim(),f=p.find(k=>k?.uri===e),g=!f&&/^\d+$/.test(_)?p.find(k=>typeof k?.uri=="string"&&k.uri.endsWith(`/${_}`)):null,y=f||g||null;if(y&&typeof y.favorite=="boolean")return!!y.favorite}}catch{}if(a)try{const l={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:"track",favorite:!0,search:a.trim()},return_response:!0},c=Le(r);if(c!==void 0&&(l.service_data.limit=c),((await i.connection.sendMessagePromise(l))?.response?.items||[]).some(u=>u.uri===e))return!0}catch{}}try{const l={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:"track",favorite:!0},return_response:!0},c=Le(r,{floor:100});return c!==void 0&&(l.service_data.limit=c),((await i.connection.sendMessagePromise(l))?.response?.items||[]).some(u=>u.uri===e)}catch{}return!1}catch{return!1}}/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */function ks(i){return typeof i>"u"||i===null}function Do(i){return typeof i=="object"&&i!==null}function jo(i){return Array.isArray(i)?i:ks(i)?[]:[i]}function Po(i,e){var t,a,s,r;if(e)for(r=Object.keys(e),t=0,a=r.length;t<a;t+=1)s=r[t],i[s]=e[s];return i}function Oo(i,e){var t="",a;for(a=0;a<e;a+=1)t+=i;return t}function Ro(i){return i===0&&Number.NEGATIVE_INFINITY===1/i}var zo=ks,Lo=Do,No=jo,qo=Oo,Uo=Ro,Bo=Po,ee={isNothing:zo,isObject:Lo,toArray:No,repeat:qo,isNegativeZero:Uo,extend:Bo};function Es(i,e){var t="",a=i.reason||"(unknown reason)";return i.mark?(i.mark.name&&(t+='in "'+i.mark.name+'" '),t+="("+(i.mark.line+1)+":"+(i.mark.column+1)+")",!e&&i.mark.snippet&&(t+=`

`+i.mark.snippet),a+" "+t):a}function jt(i,e){Error.call(this),this.name="YAMLException",this.reason=i,this.mark=e,this.message=Es(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}jt.prototype=Object.create(Error.prototype),jt.prototype.constructor=jt,jt.prototype.toString=function(e){return this.name+": "+Es(this,e)};var ue=jt;function Ji(i,e,t,a,s){var r="",n="",o=Math.floor(s/2)-1;return a-e>o&&(r=" ... ",e=a-o+r.length),t-a>o&&(n=" ...",t=a+o-n.length),{str:r+i.slice(e,t).replace(/\t/g,"\u2192")+n,pos:a-e+r.length}}function ea(i,e){return ee.repeat(" ",e-i.length)+i}function Go(i,e){if(e=Object.create(e||null),!i.buffer)return null;e.maxLength||(e.maxLength=79),typeof e.indent!="number"&&(e.indent=1),typeof e.linesBefore!="number"&&(e.linesBefore=3),typeof e.linesAfter!="number"&&(e.linesAfter=2);for(var t=/\r?\n|\r|\0/g,a=[0],s=[],r,n=-1;r=t.exec(i.buffer);)s.push(r.index),a.push(r.index+r[0].length),i.position<=r.index&&n<0&&(n=a.length-2);n<0&&(n=a.length-1);var o="",l,c,u=Math.min(i.line+e.linesAfter,s.length).toString().length,d=e.maxLength-(e.indent+u+3);for(l=1;l<=e.linesBefore&&!(n-l<0);l++)c=Ji(i.buffer,a[n-l],s[n-l],i.position-(a[n]-a[n-l]),d),o=ee.repeat(" ",e.indent)+ea((i.line-l+1).toString(),u)+" | "+c.str+`
`+o;for(c=Ji(i.buffer,a[n],s[n],i.position,d),o+=ee.repeat(" ",e.indent)+ea((i.line+1).toString(),u)+" | "+c.str+`
`,o+=ee.repeat("-",e.indent+u+3+c.pos)+`^
`,l=1;l<=e.linesAfter&&!(n+l>=s.length);l++)c=Ji(i.buffer,a[n+l],s[n+l],i.position-(a[n]-a[n+l]),d),o+=ee.repeat(" ",e.indent)+ea((i.line+l+1).toString(),u)+" | "+c.str+`
`;return o.replace(/\n$/,"")}var Ho=Go,Vo=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Qo=["scalar","sequence","mapping"];function Wo(i){var e={};return i!==null&&Object.keys(i).forEach(function(t){i[t].forEach(function(a){e[String(a)]=t})}),e}function Yo(i,e){if(e=e||{},Object.keys(e).forEach(function(t){if(Vo.indexOf(t)===-1)throw new ue('Unknown option "'+t+'" is met in definition of "'+i+'" YAML type.')}),this.options=e,this.tag=i,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(t){return t},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=Wo(e.styleAliases||null),Qo.indexOf(this.kind)===-1)throw new ue('Unknown kind "'+this.kind+'" is specified for "'+i+'" YAML type.')}var se=Yo;function As(i,e){var t=[];return i[e].forEach(function(a){var s=t.length;t.forEach(function(r,n){r.tag===a.tag&&r.kind===a.kind&&r.multi===a.multi&&(s=n)}),t[s]=a}),t}function Zo(){var i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},e,t;function a(s){s.multi?(i.multi[s.kind].push(s),i.multi.fallback.push(s)):i[s.kind][s.tag]=i.fallback[s.tag]=s}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(a);return i}function ta(i){return this.extend(i)}ta.prototype.extend=function(e){var t=[],a=[];if(e instanceof se)a.push(e);else if(Array.isArray(e))a=a.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(a=a.concat(e.explicit));else throw new ue("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(r){if(!(r instanceof se))throw new ue("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(r.loadKind&&r.loadKind!=="scalar")throw new ue("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(r.multi)throw new ue("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),a.forEach(function(r){if(!(r instanceof se))throw new ue("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var s=Object.create(ta.prototype);return s.implicit=(this.implicit||[]).concat(t),s.explicit=(this.explicit||[]).concat(a),s.compiledImplicit=As(s,"implicit"),s.compiledExplicit=As(s,"explicit"),s.compiledTypeMap=Zo(s.compiledImplicit,s.compiledExplicit),s};var Ss=ta,$s=new se("tag:yaml.org,2002:str",{kind:"scalar",construct:function(i){return i!==null?i:""}}),Is=new se("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(i){return i!==null?i:[]}}),Cs=new se("tag:yaml.org,2002:map",{kind:"mapping",construct:function(i){return i!==null?i:{}}}),Ts=new Ss({explicit:[$s,Is,Cs]});function Ko(i){if(i===null)return!0;var e=i.length;return e===1&&i==="~"||e===4&&(i==="null"||i==="Null"||i==="NULL")}function Xo(){return null}function Jo(i){return i===null}var Ms=new se("tag:yaml.org,2002:null",{kind:"scalar",resolve:Ko,construct:Xo,predicate:Jo,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function el(i){if(i===null)return!1;var e=i.length;return e===4&&(i==="true"||i==="True"||i==="TRUE")||e===5&&(i==="false"||i==="False"||i==="FALSE")}function tl(i){return i==="true"||i==="True"||i==="TRUE"}function il(i){return Object.prototype.toString.call(i)==="[object Boolean]"}var Fs=new se("tag:yaml.org,2002:bool",{kind:"scalar",resolve:el,construct:tl,predicate:il,represent:{lowercase:function(i){return i?"true":"false"},uppercase:function(i){return i?"TRUE":"FALSE"},camelcase:function(i){return i?"True":"False"}},defaultStyle:"lowercase"});function al(i){return 48<=i&&i<=57||65<=i&&i<=70||97<=i&&i<=102}function sl(i){return 48<=i&&i<=55}function rl(i){return 48<=i&&i<=57}function nl(i){if(i===null)return!1;var e=i.length,t=0,a=!1,s;if(!e)return!1;if(s=i[t],(s==="-"||s==="+")&&(s=i[++t]),s==="0"){if(t+1===e)return!0;if(s=i[++t],s==="b"){for(t++;t<e;t++)if(s=i[t],s!=="_"){if(s!=="0"&&s!=="1")return!1;a=!0}return a&&s!=="_"}if(s==="x"){for(t++;t<e;t++)if(s=i[t],s!=="_"){if(!al(i.charCodeAt(t)))return!1;a=!0}return a&&s!=="_"}if(s==="o"){for(t++;t<e;t++)if(s=i[t],s!=="_"){if(!sl(i.charCodeAt(t)))return!1;a=!0}return a&&s!=="_"}}if(s==="_")return!1;for(;t<e;t++)if(s=i[t],s!=="_"){if(!rl(i.charCodeAt(t)))return!1;a=!0}return!(!a||s==="_")}function ol(i){var e=i,t=1,a;if(e.indexOf("_")!==-1&&(e=e.replace(/_/g,"")),a=e[0],(a==="-"||a==="+")&&(a==="-"&&(t=-1),e=e.slice(1),a=e[0]),e==="0")return 0;if(a==="0"){if(e[1]==="b")return t*parseInt(e.slice(2),2);if(e[1]==="x")return t*parseInt(e.slice(2),16);if(e[1]==="o")return t*parseInt(e.slice(2),8)}return t*parseInt(e,10)}function ll(i){return Object.prototype.toString.call(i)==="[object Number]"&&i%1===0&&!ee.isNegativeZero(i)}var Ds=new se("tag:yaml.org,2002:int",{kind:"scalar",resolve:nl,construct:ol,predicate:ll,represent:{binary:function(i){return i>=0?"0b"+i.toString(2):"-0b"+i.toString(2).slice(1)},octal:function(i){return i>=0?"0o"+i.toString(8):"-0o"+i.toString(8).slice(1)},decimal:function(i){return i.toString(10)},hexadecimal:function(i){return i>=0?"0x"+i.toString(16).toUpperCase():"-0x"+i.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),cl=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function dl(i){return!(i===null||!cl.test(i)||i[i.length-1]==="_")}function ul(i){var e,t;return e=i.replace(/_/g,"").toLowerCase(),t=e[0]==="-"?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),e===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:e===".nan"?NaN:t*parseFloat(e,10)}var hl=/^[-+]?[0-9]+e/;function pl(i,e){var t;if(isNaN(i))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===i)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===i)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(ee.isNegativeZero(i))return"-0.0";return t=i.toString(10),hl.test(t)?t.replace("e",".e"):t}function _l(i){return Object.prototype.toString.call(i)==="[object Number]"&&(i%1!==0||ee.isNegativeZero(i))}var js=new se("tag:yaml.org,2002:float",{kind:"scalar",resolve:dl,construct:ul,predicate:_l,represent:pl,defaultStyle:"lowercase"}),Ps=Ts.extend({implicit:[Ms,Fs,Ds,js]}),Os=Ps,Rs=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),zs=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ml(i){return i===null?!1:Rs.exec(i)!==null||zs.exec(i)!==null}function fl(i){var e,t,a,s,r,n,o,l=0,c=null,u,d,p;if(e=Rs.exec(i),e===null&&(e=zs.exec(i)),e===null)throw new Error("Date resolve error");if(t=+e[1],a=+e[2]-1,s=+e[3],!e[4])return new Date(Date.UTC(t,a,s));if(r=+e[4],n=+e[5],o=+e[6],e[7]){for(l=e[7].slice(0,3);l.length<3;)l+="0";l=+l}return e[9]&&(u=+e[10],d=+(e[11]||0),c=(u*60+d)*6e4,e[9]==="-"&&(c=-c)),p=new Date(Date.UTC(t,a,s,r,n,o,l)),c&&p.setTime(p.getTime()-c),p}function gl(i){return i.toISOString()}var Ls=new se("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:ml,construct:fl,instanceOf:Date,represent:gl});function vl(i){return i==="<<"||i===null}var Ns=new se("tag:yaml.org,2002:merge",{kind:"scalar",resolve:vl}),ia=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function yl(i){if(i===null)return!1;var e,t,a=0,s=i.length,r=ia;for(t=0;t<s;t++)if(e=r.indexOf(i.charAt(t)),!(e>64)){if(e<0)return!1;a+=6}return a%8===0}function bl(i){var e,t,a=i.replace(/[\r\n=]/g,""),s=a.length,r=ia,n=0,o=[];for(e=0;e<s;e++)e%4===0&&e&&(o.push(n>>16&255),o.push(n>>8&255),o.push(n&255)),n=n<<6|r.indexOf(a.charAt(e));return t=s%4*6,t===0?(o.push(n>>16&255),o.push(n>>8&255),o.push(n&255)):t===18?(o.push(n>>10&255),o.push(n>>2&255)):t===12&&o.push(n>>4&255),new Uint8Array(o)}function xl(i){var e="",t=0,a,s,r=i.length,n=ia;for(a=0;a<r;a++)a%3===0&&a&&(e+=n[t>>18&63],e+=n[t>>12&63],e+=n[t>>6&63],e+=n[t&63]),t=(t<<8)+i[a];return s=r%3,s===0?(e+=n[t>>18&63],e+=n[t>>12&63],e+=n[t>>6&63],e+=n[t&63]):s===2?(e+=n[t>>10&63],e+=n[t>>4&63],e+=n[t<<2&63],e+=n[64]):s===1&&(e+=n[t>>2&63],e+=n[t<<4&63],e+=n[64],e+=n[64]),e}function wl(i){return Object.prototype.toString.call(i)==="[object Uint8Array]"}var qs=new se("tag:yaml.org,2002:binary",{kind:"scalar",resolve:yl,construct:bl,predicate:wl,represent:xl}),kl=Object.prototype.hasOwnProperty,El=Object.prototype.toString;function Al(i){if(i===null)return!0;var e=[],t,a,s,r,n,o=i;for(t=0,a=o.length;t<a;t+=1){if(s=o[t],n=!1,El.call(s)!=="[object Object]")return!1;for(r in s)if(kl.call(s,r))if(!n)n=!0;else return!1;if(!n)return!1;if(e.indexOf(r)===-1)e.push(r);else return!1}return!0}function Sl(i){return i!==null?i:[]}var Us=new se("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Al,construct:Sl}),$l=Object.prototype.toString;function Il(i){if(i===null)return!0;var e,t,a,s,r,n=i;for(r=new Array(n.length),e=0,t=n.length;e<t;e+=1){if(a=n[e],$l.call(a)!=="[object Object]"||(s=Object.keys(a),s.length!==1))return!1;r[e]=[s[0],a[s[0]]]}return!0}function Cl(i){if(i===null)return[];var e,t,a,s,r,n=i;for(r=new Array(n.length),e=0,t=n.length;e<t;e+=1)a=n[e],s=Object.keys(a),r[e]=[s[0],a[s[0]]];return r}var Bs=new se("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Il,construct:Cl}),Tl=Object.prototype.hasOwnProperty;function Ml(i){if(i===null)return!0;var e,t=i;for(e in t)if(Tl.call(t,e)&&t[e]!==null)return!1;return!0}function Fl(i){return i!==null?i:{}}var Gs=new se("tag:yaml.org,2002:set",{kind:"mapping",resolve:Ml,construct:Fl}),aa=Os.extend({implicit:[Ls,Ns],explicit:[qs,Us,Bs,Gs]}),Ne=Object.prototype.hasOwnProperty,ci=1,Hs=2,Vs=3,di=4,sa=1,Dl=2,Qs=3,jl=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Pl=/[\x85\u2028\u2029]/,Ol=/[,\[\]\{\}]/,Ws=/^(?:!|!!|![a-z\-]+!)$/i,Ys=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Zs(i){return Object.prototype.toString.call(i)}function $e(i){return i===10||i===13}function it(i){return i===9||i===32}function me(i){return i===9||i===32||i===10||i===13}function ct(i){return i===44||i===91||i===93||i===123||i===125}function Rl(i){var e;return 48<=i&&i<=57?i-48:(e=i|32,97<=e&&e<=102?e-97+10:-1)}function zl(i){return i===120?2:i===117?4:i===85?8:0}function Ll(i){return 48<=i&&i<=57?i-48:-1}function Ks(i){return i===48?"\0":i===97?"\x07":i===98?"\b":i===116||i===9?"	":i===110?`
`:i===118?"\v":i===102?"\f":i===114?"\r":i===101?"\x1B":i===32?" ":i===34?'"':i===47?"/":i===92?"\\":i===78?"\x85":i===95?"\xA0":i===76?"\u2028":i===80?"\u2029":""}function Nl(i){return i<=65535?String.fromCharCode(i):String.fromCharCode((i-65536>>10)+55296,(i-65536&1023)+56320)}function Xs(i,e,t){e==="__proto__"?Object.defineProperty(i,e,{configurable:!0,enumerable:!0,writable:!0,value:t}):i[e]=t}for(var Js=new Array(256),er=new Array(256),dt=0;dt<256;dt++)Js[dt]=Ks(dt)?1:0,er[dt]=Ks(dt);function ql(i,e){this.input=i,this.filename=e.filename||null,this.schema=e.schema||aa,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=i.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function tr(i,e){var t={name:i.filename,buffer:i.input.slice(0,-1),position:i.position,line:i.line,column:i.position-i.lineStart};return t.snippet=Ho(t),new ue(e,t)}function A(i,e){throw tr(i,e)}function ui(i,e){i.onWarning&&i.onWarning.call(null,tr(i,e))}var ir={YAML:function(e,t,a){var s,r,n;e.version!==null&&A(e,"duplication of %YAML directive"),a.length!==1&&A(e,"YAML directive accepts exactly one argument"),s=/^([0-9]+)\.([0-9]+)$/.exec(a[0]),s===null&&A(e,"ill-formed argument of the YAML directive"),r=parseInt(s[1],10),n=parseInt(s[2],10),r!==1&&A(e,"unacceptable YAML version of the document"),e.version=a[0],e.checkLineBreaks=n<2,n!==1&&n!==2&&ui(e,"unsupported YAML version of the document")},TAG:function(e,t,a){var s,r;a.length!==2&&A(e,"TAG directive accepts exactly two arguments"),s=a[0],r=a[1],Ws.test(s)||A(e,"ill-formed tag handle (first argument) of the TAG directive"),Ne.call(e.tagMap,s)&&A(e,'there is a previously declared suffix for "'+s+'" tag handle'),Ys.test(r)||A(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch{A(e,"tag prefix is malformed: "+r)}e.tagMap[s]=r}};function qe(i,e,t,a){var s,r,n,o;if(e<t){if(o=i.input.slice(e,t),a)for(s=0,r=o.length;s<r;s+=1)n=o.charCodeAt(s),n===9||32<=n&&n<=1114111||A(i,"expected valid JSON character");else jl.test(o)&&A(i,"the stream contains non-printable characters");i.result+=o}}function ar(i,e,t,a){var s,r,n,o;for(ee.isObject(t)||A(i,"cannot merge mappings; the provided source object is unacceptable"),s=Object.keys(t),n=0,o=s.length;n<o;n+=1)r=s[n],Ne.call(e,r)||(Xs(e,r,t[r]),a[r]=!0)}function ut(i,e,t,a,s,r,n,o,l){var c,u;if(Array.isArray(s))for(s=Array.prototype.slice.call(s),c=0,u=s.length;c<u;c+=1)Array.isArray(s[c])&&A(i,"nested arrays are not supported inside keys"),typeof s=="object"&&Zs(s[c])==="[object Object]"&&(s[c]="[object Object]");if(typeof s=="object"&&Zs(s)==="[object Object]"&&(s="[object Object]"),s=String(s),e===null&&(e={}),a==="tag:yaml.org,2002:merge")if(Array.isArray(r))for(c=0,u=r.length;c<u;c+=1)ar(i,e,r[c],t);else ar(i,e,r,t);else!i.json&&!Ne.call(t,s)&&Ne.call(e,s)&&(i.line=n||i.line,i.lineStart=o||i.lineStart,i.position=l||i.position,A(i,"duplicated mapping key")),Xs(e,s,r),delete t[s];return e}function ra(i){var e;e=i.input.charCodeAt(i.position),e===10?i.position++:e===13?(i.position++,i.input.charCodeAt(i.position)===10&&i.position++):A(i,"a line break is expected"),i.line+=1,i.lineStart=i.position,i.firstTabInLine=-1}function K(i,e,t){for(var a=0,s=i.input.charCodeAt(i.position);s!==0;){for(;it(s);)s===9&&i.firstTabInLine===-1&&(i.firstTabInLine=i.position),s=i.input.charCodeAt(++i.position);if(e&&s===35)do s=i.input.charCodeAt(++i.position);while(s!==10&&s!==13&&s!==0);if($e(s))for(ra(i),s=i.input.charCodeAt(i.position),a++,i.lineIndent=0;s===32;)i.lineIndent++,s=i.input.charCodeAt(++i.position);else break}return t!==-1&&a!==0&&i.lineIndent<t&&ui(i,"deficient indentation"),a}function hi(i){var e=i.position,t;return t=i.input.charCodeAt(e),!!((t===45||t===46)&&t===i.input.charCodeAt(e+1)&&t===i.input.charCodeAt(e+2)&&(e+=3,t=i.input.charCodeAt(e),t===0||me(t)))}function na(i,e){e===1?i.result+=" ":e>1&&(i.result+=ee.repeat(`
`,e-1))}function Ul(i,e,t){var a,s,r,n,o,l,c,u,d=i.kind,p=i.result,_;if(_=i.input.charCodeAt(i.position),me(_)||ct(_)||_===35||_===38||_===42||_===33||_===124||_===62||_===39||_===34||_===37||_===64||_===96||(_===63||_===45)&&(s=i.input.charCodeAt(i.position+1),me(s)||t&&ct(s)))return!1;for(i.kind="scalar",i.result="",r=n=i.position,o=!1;_!==0;){if(_===58){if(s=i.input.charCodeAt(i.position+1),me(s)||t&&ct(s))break}else if(_===35){if(a=i.input.charCodeAt(i.position-1),me(a))break}else{if(i.position===i.lineStart&&hi(i)||t&&ct(_))break;if($e(_))if(l=i.line,c=i.lineStart,u=i.lineIndent,K(i,!1,-1),i.lineIndent>=e){o=!0,_=i.input.charCodeAt(i.position);continue}else{i.position=n,i.line=l,i.lineStart=c,i.lineIndent=u;break}}o&&(qe(i,r,n,!1),na(i,i.line-l),r=n=i.position,o=!1),it(_)||(n=i.position+1),_=i.input.charCodeAt(++i.position)}return qe(i,r,n,!1),i.result?!0:(i.kind=d,i.result=p,!1)}function Bl(i,e){var t,a,s;if(t=i.input.charCodeAt(i.position),t!==39)return!1;for(i.kind="scalar",i.result="",i.position++,a=s=i.position;(t=i.input.charCodeAt(i.position))!==0;)if(t===39)if(qe(i,a,i.position,!0),t=i.input.charCodeAt(++i.position),t===39)a=i.position,i.position++,s=i.position;else return!0;else $e(t)?(qe(i,a,s,!0),na(i,K(i,!1,e)),a=s=i.position):i.position===i.lineStart&&hi(i)?A(i,"unexpected end of the document within a single quoted scalar"):(i.position++,s=i.position);A(i,"unexpected end of the stream within a single quoted scalar")}function Gl(i,e){var t,a,s,r,n,o;if(o=i.input.charCodeAt(i.position),o!==34)return!1;for(i.kind="scalar",i.result="",i.position++,t=a=i.position;(o=i.input.charCodeAt(i.position))!==0;){if(o===34)return qe(i,t,i.position,!0),i.position++,!0;if(o===92){if(qe(i,t,i.position,!0),o=i.input.charCodeAt(++i.position),$e(o))K(i,!1,e);else if(o<256&&Js[o])i.result+=er[o],i.position++;else if((n=zl(o))>0){for(s=n,r=0;s>0;s--)o=i.input.charCodeAt(++i.position),(n=Rl(o))>=0?r=(r<<4)+n:A(i,"expected hexadecimal character");i.result+=Nl(r),i.position++}else A(i,"unknown escape sequence");t=a=i.position}else $e(o)?(qe(i,t,a,!0),na(i,K(i,!1,e)),t=a=i.position):i.position===i.lineStart&&hi(i)?A(i,"unexpected end of the document within a double quoted scalar"):(i.position++,a=i.position)}A(i,"unexpected end of the stream within a double quoted scalar")}function Hl(i,e){var t=!0,a,s,r,n=i.tag,o,l=i.anchor,c,u,d,p,_,f=Object.create(null),g,y,k,x;if(x=i.input.charCodeAt(i.position),x===91)u=93,_=!1,o=[];else if(x===123)u=125,_=!0,o={};else return!1;for(i.anchor!==null&&(i.anchorMap[i.anchor]=o),x=i.input.charCodeAt(++i.position);x!==0;){if(K(i,!0,e),x=i.input.charCodeAt(i.position),x===u)return i.position++,i.tag=n,i.anchor=l,i.kind=_?"mapping":"sequence",i.result=o,!0;t?x===44&&A(i,"expected the node content, but found ','"):A(i,"missed comma between flow collection entries"),y=g=k=null,d=p=!1,x===63&&(c=i.input.charCodeAt(i.position+1),me(c)&&(d=p=!0,i.position++,K(i,!0,e))),a=i.line,s=i.lineStart,r=i.position,ht(i,e,ci,!1,!0),y=i.tag,g=i.result,K(i,!0,e),x=i.input.charCodeAt(i.position),(p||i.line===a)&&x===58&&(d=!0,x=i.input.charCodeAt(++i.position),K(i,!0,e),ht(i,e,ci,!1,!0),k=i.result),_?ut(i,o,f,y,g,k,a,s,r):d?o.push(ut(i,null,f,y,g,k,a,s,r)):o.push(g),K(i,!0,e),x=i.input.charCodeAt(i.position),x===44?(t=!0,x=i.input.charCodeAt(++i.position)):t=!1}A(i,"unexpected end of the stream within a flow collection")}function Vl(i,e){var t,a,s=sa,r=!1,n=!1,o=e,l=0,c=!1,u,d;if(d=i.input.charCodeAt(i.position),d===124)a=!1;else if(d===62)a=!0;else return!1;for(i.kind="scalar",i.result="";d!==0;)if(d=i.input.charCodeAt(++i.position),d===43||d===45)sa===s?s=d===43?Qs:Dl:A(i,"repeat of a chomping mode identifier");else if((u=Ll(d))>=0)u===0?A(i,"bad explicit indentation width of a block scalar; it cannot be less than one"):n?A(i,"repeat of an indentation width identifier"):(o=e+u-1,n=!0);else break;if(it(d)){do d=i.input.charCodeAt(++i.position);while(it(d));if(d===35)do d=i.input.charCodeAt(++i.position);while(!$e(d)&&d!==0)}for(;d!==0;){for(ra(i),i.lineIndent=0,d=i.input.charCodeAt(i.position);(!n||i.lineIndent<o)&&d===32;)i.lineIndent++,d=i.input.charCodeAt(++i.position);if(!n&&i.lineIndent>o&&(o=i.lineIndent),$e(d)){l++;continue}if(i.lineIndent<o){s===Qs?i.result+=ee.repeat(`
`,r?1+l:l):s===sa&&r&&(i.result+=`
`);break}for(a?it(d)?(c=!0,i.result+=ee.repeat(`
`,r?1+l:l)):c?(c=!1,i.result+=ee.repeat(`
`,l+1)):l===0?r&&(i.result+=" "):i.result+=ee.repeat(`
`,l):i.result+=ee.repeat(`
`,r?1+l:l),r=!0,n=!0,l=0,t=i.position;!$e(d)&&d!==0;)d=i.input.charCodeAt(++i.position);qe(i,t,i.position,!1)}return!0}function sr(i,e){var t,a=i.tag,s=i.anchor,r=[],n,o=!1,l;if(i.firstTabInLine!==-1)return!1;for(i.anchor!==null&&(i.anchorMap[i.anchor]=r),l=i.input.charCodeAt(i.position);l!==0&&(i.firstTabInLine!==-1&&(i.position=i.firstTabInLine,A(i,"tab characters must not be used in indentation")),!(l!==45||(n=i.input.charCodeAt(i.position+1),!me(n))));){if(o=!0,i.position++,K(i,!0,-1)&&i.lineIndent<=e){r.push(null),l=i.input.charCodeAt(i.position);continue}if(t=i.line,ht(i,e,Vs,!1,!0),r.push(i.result),K(i,!0,-1),l=i.input.charCodeAt(i.position),(i.line===t||i.lineIndent>e)&&l!==0)A(i,"bad indentation of a sequence entry");else if(i.lineIndent<e)break}return o?(i.tag=a,i.anchor=s,i.kind="sequence",i.result=r,!0):!1}function Ql(i,e,t){var a,s,r,n,o,l,c=i.tag,u=i.anchor,d={},p=Object.create(null),_=null,f=null,g=null,y=!1,k=!1,x;if(i.firstTabInLine!==-1)return!1;for(i.anchor!==null&&(i.anchorMap[i.anchor]=d),x=i.input.charCodeAt(i.position);x!==0;){if(!y&&i.firstTabInLine!==-1&&(i.position=i.firstTabInLine,A(i,"tab characters must not be used in indentation")),a=i.input.charCodeAt(i.position+1),r=i.line,(x===63||x===58)&&me(a))x===63?(y&&(ut(i,d,p,_,f,null,n,o,l),_=f=g=null),k=!0,y=!0,s=!0):y?(y=!1,s=!0):A(i,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),i.position+=1,x=a;else{if(n=i.line,o=i.lineStart,l=i.position,!ht(i,t,Hs,!1,!0))break;if(i.line===r){for(x=i.input.charCodeAt(i.position);it(x);)x=i.input.charCodeAt(++i.position);if(x===58)x=i.input.charCodeAt(++i.position),me(x)||A(i,"a whitespace character is expected after the key-value separator within a block mapping"),y&&(ut(i,d,p,_,f,null,n,o,l),_=f=g=null),k=!0,y=!1,s=!1,_=i.tag,f=i.result;else if(k)A(i,"can not read an implicit mapping pair; a colon is missed");else return i.tag=c,i.anchor=u,!0}else if(k)A(i,"can not read a block mapping entry; a multiline key may not be an implicit key");else return i.tag=c,i.anchor=u,!0}if((i.line===r||i.lineIndent>e)&&(y&&(n=i.line,o=i.lineStart,l=i.position),ht(i,e,di,!0,s)&&(y?f=i.result:g=i.result),y||(ut(i,d,p,_,f,g,n,o,l),_=f=g=null),K(i,!0,-1),x=i.input.charCodeAt(i.position)),(i.line===r||i.lineIndent>e)&&x!==0)A(i,"bad indentation of a mapping entry");else if(i.lineIndent<e)break}return y&&ut(i,d,p,_,f,null,n,o,l),k&&(i.tag=c,i.anchor=u,i.kind="mapping",i.result=d),k}function Wl(i){var e,t=!1,a=!1,s,r,n;if(n=i.input.charCodeAt(i.position),n!==33)return!1;if(i.tag!==null&&A(i,"duplication of a tag property"),n=i.input.charCodeAt(++i.position),n===60?(t=!0,n=i.input.charCodeAt(++i.position)):n===33?(a=!0,s="!!",n=i.input.charCodeAt(++i.position)):s="!",e=i.position,t){do n=i.input.charCodeAt(++i.position);while(n!==0&&n!==62);i.position<i.length?(r=i.input.slice(e,i.position),n=i.input.charCodeAt(++i.position)):A(i,"unexpected end of the stream within a verbatim tag")}else{for(;n!==0&&!me(n);)n===33&&(a?A(i,"tag suffix cannot contain exclamation marks"):(s=i.input.slice(e-1,i.position+1),Ws.test(s)||A(i,"named tag handle cannot contain such characters"),a=!0,e=i.position+1)),n=i.input.charCodeAt(++i.position);r=i.input.slice(e,i.position),Ol.test(r)&&A(i,"tag suffix cannot contain flow indicator characters")}r&&!Ys.test(r)&&A(i,"tag name cannot contain such characters: "+r);try{r=decodeURIComponent(r)}catch{A(i,"tag name is malformed: "+r)}return t?i.tag=r:Ne.call(i.tagMap,s)?i.tag=i.tagMap[s]+r:s==="!"?i.tag="!"+r:s==="!!"?i.tag="tag:yaml.org,2002:"+r:A(i,'undeclared tag handle "'+s+'"'),!0}function Yl(i){var e,t;if(t=i.input.charCodeAt(i.position),t!==38)return!1;for(i.anchor!==null&&A(i,"duplication of an anchor property"),t=i.input.charCodeAt(++i.position),e=i.position;t!==0&&!me(t)&&!ct(t);)t=i.input.charCodeAt(++i.position);return i.position===e&&A(i,"name of an anchor node must contain at least one character"),i.anchor=i.input.slice(e,i.position),!0}function Zl(i){var e,t,a;if(a=i.input.charCodeAt(i.position),a!==42)return!1;for(a=i.input.charCodeAt(++i.position),e=i.position;a!==0&&!me(a)&&!ct(a);)a=i.input.charCodeAt(++i.position);return i.position===e&&A(i,"name of an alias node must contain at least one character"),t=i.input.slice(e,i.position),Ne.call(i.anchorMap,t)||A(i,'unidentified alias "'+t+'"'),i.result=i.anchorMap[t],K(i,!0,-1),!0}function ht(i,e,t,a,s){var r,n,o,l=1,c=!1,u=!1,d,p,_,f,g,y;if(i.listener!==null&&i.listener("open",i),i.tag=null,i.anchor=null,i.kind=null,i.result=null,r=n=o=di===t||Vs===t,a&&K(i,!0,-1)&&(c=!0,i.lineIndent>e?l=1:i.lineIndent===e?l=0:i.lineIndent<e&&(l=-1)),l===1)for(;Wl(i)||Yl(i);)K(i,!0,-1)?(c=!0,o=r,i.lineIndent>e?l=1:i.lineIndent===e?l=0:i.lineIndent<e&&(l=-1)):o=!1;if(o&&(o=c||s),(l===1||di===t)&&(ci===t||Hs===t?g=e:g=e+1,y=i.position-i.lineStart,l===1?o&&(sr(i,y)||Ql(i,y,g))||Hl(i,g)?u=!0:(n&&Vl(i,g)||Bl(i,g)||Gl(i,g)?u=!0:Zl(i)?(u=!0,(i.tag!==null||i.anchor!==null)&&A(i,"alias node should not have any properties")):Ul(i,g,ci===t)&&(u=!0,i.tag===null&&(i.tag="?")),i.anchor!==null&&(i.anchorMap[i.anchor]=i.result)):l===0&&(u=o&&sr(i,y))),i.tag===null)i.anchor!==null&&(i.anchorMap[i.anchor]=i.result);else if(i.tag==="?"){for(i.result!==null&&i.kind!=="scalar"&&A(i,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+i.kind+'"'),d=0,p=i.implicitTypes.length;d<p;d+=1)if(f=i.implicitTypes[d],f.resolve(i.result)){i.result=f.construct(i.result),i.tag=f.tag,i.anchor!==null&&(i.anchorMap[i.anchor]=i.result);break}}else if(i.tag!=="!"){if(Ne.call(i.typeMap[i.kind||"fallback"],i.tag))f=i.typeMap[i.kind||"fallback"][i.tag];else for(f=null,_=i.typeMap.multi[i.kind||"fallback"],d=0,p=_.length;d<p;d+=1)if(i.tag.slice(0,_[d].tag.length)===_[d].tag){f=_[d];break}f||A(i,"unknown tag !<"+i.tag+">"),i.result!==null&&f.kind!==i.kind&&A(i,"unacceptable node kind for !<"+i.tag+'> tag; it should be "'+f.kind+'", not "'+i.kind+'"'),f.resolve(i.result,i.tag)?(i.result=f.construct(i.result,i.tag),i.anchor!==null&&(i.anchorMap[i.anchor]=i.result)):A(i,"cannot resolve a node with !<"+i.tag+"> explicit tag")}return i.listener!==null&&i.listener("close",i),i.tag!==null||i.anchor!==null||u}function Kl(i){var e=i.position,t,a,s,r=!1,n;for(i.version=null,i.checkLineBreaks=i.legacy,i.tagMap=Object.create(null),i.anchorMap=Object.create(null);(n=i.input.charCodeAt(i.position))!==0&&(K(i,!0,-1),n=i.input.charCodeAt(i.position),!(i.lineIndent>0||n!==37));){for(r=!0,n=i.input.charCodeAt(++i.position),t=i.position;n!==0&&!me(n);)n=i.input.charCodeAt(++i.position);for(a=i.input.slice(t,i.position),s=[],a.length<1&&A(i,"directive name must not be less than one character in length");n!==0;){for(;it(n);)n=i.input.charCodeAt(++i.position);if(n===35){do n=i.input.charCodeAt(++i.position);while(n!==0&&!$e(n));break}if($e(n))break;for(t=i.position;n!==0&&!me(n);)n=i.input.charCodeAt(++i.position);s.push(i.input.slice(t,i.position))}n!==0&&ra(i),Ne.call(ir,a)?ir[a](i,a,s):ui(i,'unknown document directive "'+a+'"')}if(K(i,!0,-1),i.lineIndent===0&&i.input.charCodeAt(i.position)===45&&i.input.charCodeAt(i.position+1)===45&&i.input.charCodeAt(i.position+2)===45?(i.position+=3,K(i,!0,-1)):r&&A(i,"directives end mark is expected"),ht(i,i.lineIndent-1,di,!1,!0),K(i,!0,-1),i.checkLineBreaks&&Pl.test(i.input.slice(e,i.position))&&ui(i,"non-ASCII line breaks are interpreted as content"),i.documents.push(i.result),i.position===i.lineStart&&hi(i)){i.input.charCodeAt(i.position)===46&&(i.position+=3,K(i,!0,-1));return}if(i.position<i.length-1)A(i,"end of the stream or a document separator is expected");else return}function rr(i,e){i=String(i),e=e||{},i.length!==0&&(i.charCodeAt(i.length-1)!==10&&i.charCodeAt(i.length-1)!==13&&(i+=`
`),i.charCodeAt(0)===65279&&(i=i.slice(1)));var t=new ql(i,e),a=i.indexOf("\0");for(a!==-1&&(t.position=a,A(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)Kl(t);return t.documents}function Xl(i,e,t){e!==null&&typeof e=="object"&&typeof t>"u"&&(t=e,e=null);var a=rr(i,t);if(typeof e!="function")return a;for(var s=0,r=a.length;s<r;s+=1)e(a[s])}function Jl(i,e){var t=rr(i,e);if(t.length!==0){if(t.length===1)return t[0];throw new ue("expected a single document in the stream, but found more")}}var ec=Xl,tc=Jl,nr={loadAll:ec,load:tc},or=Object.prototype.toString,lr=Object.prototype.hasOwnProperty,oa=65279,ic=9,Pt=10,ac=13,sc=32,rc=33,nc=34,la=35,oc=37,lc=38,cc=39,dc=42,cr=44,uc=45,pi=58,hc=61,pc=62,_c=63,mc=64,dr=91,ur=93,fc=96,hr=123,gc=124,pr=125,ce={};ce[0]="\\0",ce[7]="\\a",ce[8]="\\b",ce[9]="\\t",ce[10]="\\n",ce[11]="\\v",ce[12]="\\f",ce[13]="\\r",ce[27]="\\e",ce[34]='\\"',ce[92]="\\\\",ce[133]="\\N",ce[160]="\\_",ce[8232]="\\L",ce[8233]="\\P";var vc=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],yc=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function bc(i,e){var t,a,s,r,n,o,l;if(e===null)return{};for(t={},a=Object.keys(e),s=0,r=a.length;s<r;s+=1)n=a[s],o=String(e[n]),n.slice(0,2)==="!!"&&(n="tag:yaml.org,2002:"+n.slice(2)),l=i.compiledTypeMap.fallback[n],l&&lr.call(l.styleAliases,o)&&(o=l.styleAliases[o]),t[n]=o;return t}function xc(i){var e,t,a;if(e=i.toString(16).toUpperCase(),i<=255)t="x",a=2;else if(i<=65535)t="u",a=4;else if(i<=4294967295)t="U",a=8;else throw new ue("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+t+ee.repeat("0",a-e.length)+e}var wc=1,Ot=2;function kc(i){this.schema=i.schema||aa,this.indent=Math.max(1,i.indent||2),this.noArrayIndent=i.noArrayIndent||!1,this.skipInvalid=i.skipInvalid||!1,this.flowLevel=ee.isNothing(i.flowLevel)?-1:i.flowLevel,this.styleMap=bc(this.schema,i.styles||null),this.sortKeys=i.sortKeys||!1,this.lineWidth=i.lineWidth||80,this.noRefs=i.noRefs||!1,this.noCompatMode=i.noCompatMode||!1,this.condenseFlow=i.condenseFlow||!1,this.quotingType=i.quotingType==='"'?Ot:wc,this.forceQuotes=i.forceQuotes||!1,this.replacer=typeof i.replacer=="function"?i.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function _r(i,e){for(var t=ee.repeat(" ",e),a=0,s=-1,r="",n,o=i.length;a<o;)s=i.indexOf(`
`,a),s===-1?(n=i.slice(a),a=o):(n=i.slice(a,s+1),a=s+1),n.length&&n!==`
`&&(r+=t),r+=n;return r}function ca(i,e){return`
`+ee.repeat(" ",i.indent*e)}function Ec(i,e){var t,a,s;for(t=0,a=i.implicitTypes.length;t<a;t+=1)if(s=i.implicitTypes[t],s.resolve(e))return!0;return!1}function _i(i){return i===sc||i===ic}function Rt(i){return 32<=i&&i<=126||161<=i&&i<=55295&&i!==8232&&i!==8233||57344<=i&&i<=65533&&i!==oa||65536<=i&&i<=1114111}function mr(i){return Rt(i)&&i!==oa&&i!==ac&&i!==Pt}function fr(i,e,t){var a=mr(i),s=a&&!_i(i);return(t?a:a&&i!==cr&&i!==dr&&i!==ur&&i!==hr&&i!==pr)&&i!==la&&!(e===pi&&!s)||mr(e)&&!_i(e)&&i===la||e===pi&&s}function Ac(i){return Rt(i)&&i!==oa&&!_i(i)&&i!==uc&&i!==_c&&i!==pi&&i!==cr&&i!==dr&&i!==ur&&i!==hr&&i!==pr&&i!==la&&i!==lc&&i!==dc&&i!==rc&&i!==gc&&i!==hc&&i!==pc&&i!==cc&&i!==nc&&i!==oc&&i!==mc&&i!==fc}function Sc(i){return!_i(i)&&i!==pi}function zt(i,e){var t=i.charCodeAt(e),a;return t>=55296&&t<=56319&&e+1<i.length&&(a=i.charCodeAt(e+1),a>=56320&&a<=57343)?(t-55296)*1024+a-56320+65536:t}function gr(i){var e=/^\n* /;return e.test(i)}var vr=1,da=2,yr=3,br=4,pt=5;function $c(i,e,t,a,s,r,n,o){var l,c=0,u=null,d=!1,p=!1,_=a!==-1,f=-1,g=Ac(zt(i,0))&&Sc(zt(i,i.length-1));if(e||n)for(l=0;l<i.length;c>=65536?l+=2:l++){if(c=zt(i,l),!Rt(c))return pt;g=g&&fr(c,u,o),u=c}else{for(l=0;l<i.length;c>=65536?l+=2:l++){if(c=zt(i,l),c===Pt)d=!0,_&&(p=p||l-f-1>a&&i[f+1]!==" ",f=l);else if(!Rt(c))return pt;g=g&&fr(c,u,o),u=c}p=p||_&&l-f-1>a&&i[f+1]!==" "}return!d&&!p?g&&!n&&!s(i)?vr:r===Ot?pt:da:t>9&&gr(i)?pt:n?r===Ot?pt:da:p?br:yr}function Ic(i,e,t,a,s){i.dump=(function(){if(e.length===0)return i.quotingType===Ot?'""':"''";if(!i.noCompatMode&&(vc.indexOf(e)!==-1||yc.test(e)))return i.quotingType===Ot?'"'+e+'"':"'"+e+"'";var r=i.indent*Math.max(1,t),n=i.lineWidth===-1?-1:Math.max(Math.min(i.lineWidth,40),i.lineWidth-r),o=a||i.flowLevel>-1&&t>=i.flowLevel;function l(c){return Ec(i,c)}switch($c(e,o,i.indent,n,l,i.quotingType,i.forceQuotes&&!a,s)){case vr:return e;case da:return"'"+e.replace(/'/g,"''")+"'";case yr:return"|"+xr(e,i.indent)+wr(_r(e,r));case br:return">"+xr(e,i.indent)+wr(_r(Cc(e,n),r));case pt:return'"'+Tc(e)+'"';default:throw new ue("impossible error: invalid scalar style")}})()}function xr(i,e){var t=gr(i)?String(e):"",a=i[i.length-1]===`
`,s=a&&(i[i.length-2]===`
`||i===`
`),r=s?"+":a?"":"-";return t+r+`
`}function wr(i){return i[i.length-1]===`
`?i.slice(0,-1):i}function Cc(i,e){for(var t=/(\n+)([^\n]*)/g,a=(function(){var c=i.indexOf(`
`);return c=c!==-1?c:i.length,t.lastIndex=c,kr(i.slice(0,c),e)})(),s=i[0]===`
`||i[0]===" ",r,n;n=t.exec(i);){var o=n[1],l=n[2];r=l[0]===" ",a+=o+(!s&&!r&&l!==""?`
`:"")+kr(l,e),s=r}return a}function kr(i,e){if(i===""||i[0]===" ")return i;for(var t=/ [^ ]/g,a,s=0,r,n=0,o=0,l="";a=t.exec(i);)o=a.index,o-s>e&&(r=n>s?n:o,l+=`
`+i.slice(s,r),s=r+1),n=o;return l+=`
`,i.length-s>e&&n>s?l+=i.slice(s,n)+`
`+i.slice(n+1):l+=i.slice(s),l.slice(1)}function Tc(i){for(var e="",t=0,a,s=0;s<i.length;t>=65536?s+=2:s++)t=zt(i,s),a=ce[t],!a&&Rt(t)?(e+=i[s],t>=65536&&(e+=i[s+1])):e+=a||xc(t);return e}function Mc(i,e,t){var a="",s=i.tag,r,n,o;for(r=0,n=t.length;r<n;r+=1)o=t[r],i.replacer&&(o=i.replacer.call(t,String(r),o)),(Me(i,e,o,!1,!1)||typeof o>"u"&&Me(i,e,null,!1,!1))&&(a!==""&&(a+=","+(i.condenseFlow?"":" ")),a+=i.dump);i.tag=s,i.dump="["+a+"]"}function Er(i,e,t,a){var s="",r=i.tag,n,o,l;for(n=0,o=t.length;n<o;n+=1)l=t[n],i.replacer&&(l=i.replacer.call(t,String(n),l)),(Me(i,e+1,l,!0,!0,!1,!0)||typeof l>"u"&&Me(i,e+1,null,!0,!0,!1,!0))&&((!a||s!=="")&&(s+=ca(i,e)),i.dump&&Pt===i.dump.charCodeAt(0)?s+="-":s+="- ",s+=i.dump);i.tag=r,i.dump=s||"[]"}function Fc(i,e,t){var a="",s=i.tag,r=Object.keys(t),n,o,l,c,u;for(n=0,o=r.length;n<o;n+=1)u="",a!==""&&(u+=", "),i.condenseFlow&&(u+='"'),l=r[n],c=t[l],i.replacer&&(c=i.replacer.call(t,l,c)),Me(i,e,l,!1,!1)&&(i.dump.length>1024&&(u+="? "),u+=i.dump+(i.condenseFlow?'"':"")+":"+(i.condenseFlow?"":" "),Me(i,e,c,!1,!1)&&(u+=i.dump,a+=u));i.tag=s,i.dump="{"+a+"}"}function Dc(i,e,t,a){var s="",r=i.tag,n=Object.keys(t),o,l,c,u,d,p;if(i.sortKeys===!0)n.sort();else if(typeof i.sortKeys=="function")n.sort(i.sortKeys);else if(i.sortKeys)throw new ue("sortKeys must be a boolean or a function");for(o=0,l=n.length;o<l;o+=1)p="",(!a||s!=="")&&(p+=ca(i,e)),c=n[o],u=t[c],i.replacer&&(u=i.replacer.call(t,c,u)),Me(i,e+1,c,!0,!0,!0)&&(d=i.tag!==null&&i.tag!=="?"||i.dump&&i.dump.length>1024,d&&(i.dump&&Pt===i.dump.charCodeAt(0)?p+="?":p+="? "),p+=i.dump,d&&(p+=ca(i,e)),Me(i,e+1,u,!0,d)&&(i.dump&&Pt===i.dump.charCodeAt(0)?p+=":":p+=": ",p+=i.dump,s+=p));i.tag=r,i.dump=s||"{}"}function Ar(i,e,t){var a,s,r,n,o,l;for(s=t?i.explicitTypes:i.implicitTypes,r=0,n=s.length;r<n;r+=1)if(o=s[r],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof e=="object"&&e instanceof o.instanceOf)&&(!o.predicate||o.predicate(e))){if(t?o.multi&&o.representName?i.tag=o.representName(e):i.tag=o.tag:i.tag="?",o.represent){if(l=i.styleMap[o.tag]||o.defaultStyle,or.call(o.represent)==="[object Function]")a=o.represent(e,l);else if(lr.call(o.represent,l))a=o.represent[l](e,l);else throw new ue("!<"+o.tag+'> tag resolver accepts not "'+l+'" style');i.dump=a}return!0}return!1}function Me(i,e,t,a,s,r,n){i.tag=null,i.dump=t,Ar(i,t,!1)||Ar(i,t,!0);var o=or.call(i.dump),l=a,c;a&&(a=i.flowLevel<0||i.flowLevel>e);var u=o==="[object Object]"||o==="[object Array]",d,p;if(u&&(d=i.duplicates.indexOf(t),p=d!==-1),(i.tag!==null&&i.tag!=="?"||p||i.indent!==2&&e>0)&&(s=!1),p&&i.usedDuplicates[d])i.dump="*ref_"+d;else{if(u&&p&&!i.usedDuplicates[d]&&(i.usedDuplicates[d]=!0),o==="[object Object]")a&&Object.keys(i.dump).length!==0?(Dc(i,e,i.dump,s),p&&(i.dump="&ref_"+d+i.dump)):(Fc(i,e,i.dump),p&&(i.dump="&ref_"+d+" "+i.dump));else if(o==="[object Array]")a&&i.dump.length!==0?(i.noArrayIndent&&!n&&e>0?Er(i,e-1,i.dump,s):Er(i,e,i.dump,s),p&&(i.dump="&ref_"+d+i.dump)):(Mc(i,e,i.dump),p&&(i.dump="&ref_"+d+" "+i.dump));else if(o==="[object String]")i.tag!=="?"&&Ic(i,i.dump,e,r,l);else{if(o==="[object Undefined]")return!1;if(i.skipInvalid)return!1;throw new ue("unacceptable kind of an object to dump "+o)}i.tag!==null&&i.tag!=="?"&&(c=encodeURI(i.tag[0]==="!"?i.tag.slice(1):i.tag).replace(/!/g,"%21"),i.tag[0]==="!"?c="!"+c:c.slice(0,18)==="tag:yaml.org,2002:"?c="!!"+c.slice(18):c="!<"+c+">",i.dump=c+" "+i.dump)}return!0}function jc(i,e){var t=[],a=[],s,r;for(ua(i,t,a),s=0,r=a.length;s<r;s+=1)e.duplicates.push(t[a[s]]);e.usedDuplicates=new Array(r)}function ua(i,e,t){var a,s,r;if(i!==null&&typeof i=="object")if(s=e.indexOf(i),s!==-1)t.indexOf(s)===-1&&t.push(s);else if(e.push(i),Array.isArray(i))for(s=0,r=i.length;s<r;s+=1)ua(i[s],e,t);else for(a=Object.keys(i),s=0,r=a.length;s<r;s+=1)ua(i[a[s]],e,t)}function Pc(i,e){e=e||{};var t=new kc(e);t.noRefs||jc(i,t);var a=i;return t.replacer&&(a=t.replacer.call({"":a},"",a)),Me(t,0,a,!0,!0)?t.dump+`
`:""}var Oc=Pc,Rc={dump:Oc};function ha(i,e){return function(){throw new Error("Function yaml."+i+" is removed in js-yaml 4. Use yaml."+e+" instead, which is now safe by default.")}}var zc=se,Lc=Ss,Nc=Ts,qc=Ps,Uc=Os,Bc=aa,Gc=nr.load,Hc=nr.loadAll,Vc=Rc.dump,Qc=ue,Wc={binary:qs,float:js,map:Cs,null:Ms,pairs:Bs,set:Gs,timestamp:Ls,bool:Fs,int:Ds,merge:Ns,omap:Us,seq:Is,str:$s},Yc=ha("safeLoad","load"),Zc=ha("safeLoadAll","loadAll"),Kc=ha("safeDump","dump"),_t={Type:zc,Schema:Lc,FAILSAFE_SCHEMA:Nc,JSON_SCHEMA:qc,CORE_SCHEMA:Uc,DEFAULT_SCHEMA:Bc,load:Gc,loadAll:Hc,dump:Vc,YAMLException:Qc,types:Wc,safeLoad:Yc,safeLoadAll:Zc,safeDump:Kc};const pa=8,Xc=128,Jc=256,ed=4096,Sr=524288;/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */function td(i,e,t){return(e=rd(e))in i?Object.defineProperty(i,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):i[e]=t,i}function Fe(){return Fe=Object.assign?Object.assign.bind():function(i){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var a in t)({}).hasOwnProperty.call(t,a)&&(i[a]=t[a])}return i},Fe.apply(null,arguments)}function $r(i,e){var t=Object.keys(i);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(i);e&&(a=a.filter(function(s){return Object.getOwnPropertyDescriptor(i,s).enumerable})),t.push.apply(t,a)}return t}function Ie(i){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?$r(Object(t),!0).forEach(function(a){td(i,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(i,Object.getOwnPropertyDescriptors(t)):$r(Object(t)).forEach(function(a){Object.defineProperty(i,a,Object.getOwnPropertyDescriptor(t,a))})}return i}function id(i,e){if(i==null)return{};var t,a,s=ad(i,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(i);for(a=0;a<r.length;a++)t=r[a],e.indexOf(t)===-1&&{}.propertyIsEnumerable.call(i,t)&&(s[t]=i[t])}return s}function ad(i,e){if(i==null)return{};var t={};for(var a in i)if({}.hasOwnProperty.call(i,a)){if(e.indexOf(a)!==-1)continue;t[a]=i[a]}return t}function sd(i,e){if(typeof i!="object"||!i)return i;var t=i[Symbol.toPrimitive];if(t!==void 0){var a=t.call(i,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(i)}function rd(i){var e=sd(i,"string");return typeof e=="symbol"?e:e+""}function _a(i){"@babel/helpers - typeof";return _a=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_a(i)}var nd="1.15.7";function De(i){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(i)}var je=De(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Lt=De(/Edge/i),Ir=De(/firefox/i),Nt=De(/safari/i)&&!De(/chrome/i)&&!De(/android/i),ma=De(/iP(ad|od|hone)/i),Cr=De(/chrome/i)&&De(/android/i),Tr={capture:!1,passive:!1};function P(i,e,t){i.addEventListener(e,t,!je&&Tr)}function D(i,e,t){i.removeEventListener(e,t,!je&&Tr)}function mi(i,e){if(e){if(e[0]===">"&&(e=e.substring(1)),i)try{if(i.matches)return i.matches(e);if(i.msMatchesSelector)return i.msMatchesSelector(e);if(i.webkitMatchesSelector)return i.webkitMatchesSelector(e)}catch{return!1}return!1}}function Mr(i){return i.host&&i!==document&&i.host.nodeType&&i.host!==i?i.host:i.parentNode}function ke(i,e,t,a){if(i){t=t||document;do{if(e!=null&&(e[0]===">"?i.parentNode===t&&mi(i,e):mi(i,e))||a&&i===t)return i;if(i===t)break}while(i=Mr(i))}return null}var Fr=/\s+/g;function ye(i,e,t){if(i&&e)if(i.classList)i.classList[t?"add":"remove"](e);else{var a=(" "+i.className+" ").replace(Fr," ").replace(" "+e+" "," ");i.className=(a+(t?" "+e:"")).replace(Fr," ")}}function S(i,e,t){var a=i&&i.style;if(a){if(t===void 0)return document.defaultView&&document.defaultView.getComputedStyle?t=document.defaultView.getComputedStyle(i,""):i.currentStyle&&(t=i.currentStyle),e===void 0?t:t[e];!(e in a)&&e.indexOf("webkit")===-1&&(e="-webkit-"+e),a[e]=t+(typeof t=="string"?"":"px")}}function mt(i,e){var t="";if(typeof i=="string")t=i;else do{var a=S(i,"transform");a&&a!=="none"&&(t=a+" "+t)}while(!e&&(i=i.parentNode));var s=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return s&&new s(t)}function Dr(i,e,t){if(i){var a=i.getElementsByTagName(e),s=0,r=a.length;if(t)for(;s<r;s++)t(a[s],s);return a}return[]}function Ce(){var i=document.scrollingElement;return i||document.documentElement}function X(i,e,t,a,s){if(!(!i.getBoundingClientRect&&i!==window)){var r,n,o,l,c,u,d;if(i!==window&&i.parentNode&&i!==Ce()?(r=i.getBoundingClientRect(),n=r.top,o=r.left,l=r.bottom,c=r.right,u=r.height,d=r.width):(n=0,o=0,l=window.innerHeight,c=window.innerWidth,u=window.innerHeight,d=window.innerWidth),(e||t)&&i!==window&&(s=s||i.parentNode,!je))do if(s&&s.getBoundingClientRect&&(S(s,"transform")!=="none"||t&&S(s,"position")!=="static")){var p=s.getBoundingClientRect();n-=p.top+parseInt(S(s,"border-top-width")),o-=p.left+parseInt(S(s,"border-left-width")),l=n+r.height,c=o+r.width;break}while(s=s.parentNode);if(a&&i!==window){var _=mt(s||i),f=_&&_.a,g=_&&_.d;_&&(n/=g,o/=f,d/=f,u/=g,l=n+u,c=o+d)}return{top:n,left:o,bottom:l,right:c,width:d,height:u}}}function jr(i,e,t){for(var a=Ue(i,!0),s=X(i)[e];a;){var r=X(a)[t],n=void 0;if(n=s>=r,!n)return a;if(a===Ce())break;a=Ue(a,!1)}return!1}function ft(i,e,t,a){for(var s=0,r=0,n=i.children;r<n.length;){if(n[r].style.display!=="none"&&n[r]!==$.ghost&&(a||n[r]!==$.dragged)&&ke(n[r],t.draggable,i,!1)){if(s===e)return n[r];s++}r++}return null}function fa(i,e){for(var t=i.lastElementChild;t&&(t===$.ghost||S(t,"display")==="none"||e&&!mi(t,e));)t=t.previousElementSibling;return t||null}function we(i,e){var t=0;if(!i||!i.parentNode)return-1;for(;i=i.previousElementSibling;)i.nodeName.toUpperCase()!=="TEMPLATE"&&i!==$.clone&&(!e||mi(i,e))&&t++;return t}function Pr(i){var e=0,t=0,a=Ce();if(i)do{var s=mt(i),r=s.a,n=s.d;e+=i.scrollLeft*r,t+=i.scrollTop*n}while(i!==a&&(i=i.parentNode));return[e,t]}function od(i,e){for(var t in i)if(i.hasOwnProperty(t)){for(var a in e)if(e.hasOwnProperty(a)&&e[a]===i[t][a])return Number(t)}return-1}function Ue(i,e){if(!i||!i.getBoundingClientRect)return Ce();var t=i,a=!1;do if(t.clientWidth<t.scrollWidth||t.clientHeight<t.scrollHeight){var s=S(t);if(t.clientWidth<t.scrollWidth&&(s.overflowX=="auto"||s.overflowX=="scroll")||t.clientHeight<t.scrollHeight&&(s.overflowY=="auto"||s.overflowY=="scroll")){if(!t.getBoundingClientRect||t===document.body)return Ce();if(a||e)return t;a=!0}}while(t=t.parentNode);return Ce()}function ld(i,e){if(i&&e)for(var t in e)e.hasOwnProperty(t)&&(i[t]=e[t]);return i}function ga(i,e){return Math.round(i.top)===Math.round(e.top)&&Math.round(i.left)===Math.round(e.left)&&Math.round(i.height)===Math.round(e.height)&&Math.round(i.width)===Math.round(e.width)}var qt;function Or(i,e){return function(){if(!qt){var t=arguments,a=this;t.length===1?i.call(a,t[0]):i.apply(a,t),qt=setTimeout(function(){qt=void 0},e)}}}function cd(){clearTimeout(qt),qt=void 0}function Rr(i,e,t){i.scrollLeft+=e,i.scrollTop+=t}function zr(i){var e=window.Polymer,t=window.jQuery||window.Zepto;return e&&e.dom?e.dom(i).cloneNode(!0):t?t(i).clone(!0)[0]:i.cloneNode(!0)}function Lr(i,e,t){var a={};return Array.from(i.children).forEach(function(s){var r,n,o,l;if(!(!ke(s,e.draggable,i,!1)||s.animated||s===t)){var c=X(s);a.left=Math.min((r=a.left)!==null&&r!==void 0?r:1/0,c.left),a.top=Math.min((n=a.top)!==null&&n!==void 0?n:1/0,c.top),a.right=Math.max((o=a.right)!==null&&o!==void 0?o:-1/0,c.right),a.bottom=Math.max((l=a.bottom)!==null&&l!==void 0?l:-1/0,c.bottom)}}),a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}var fe="Sortable"+new Date().getTime();function dd(){var i=[],e;return{captureAnimationState:function(){if(i=[],!!this.options.animation){var a=[].slice.call(this.el.children);a.forEach(function(s){if(!(S(s,"display")==="none"||s===$.ghost)){i.push({target:s,rect:X(s)});var r=Ie({},i[i.length-1].rect);if(s.thisAnimationDuration){var n=mt(s,!0);n&&(r.top-=n.f,r.left-=n.e)}s.fromRect=r}})}},addAnimationState:function(a){i.push(a)},removeAnimationState:function(a){i.splice(od(i,{target:a}),1)},animateAll:function(a){var s=this;if(!this.options.animation){clearTimeout(e),typeof a=="function"&&a();return}var r=!1,n=0;i.forEach(function(o){var l=0,c=o.target,u=c.fromRect,d=X(c),p=c.prevFromRect,_=c.prevToRect,f=o.rect,g=mt(c,!0);g&&(d.top-=g.f,d.left-=g.e),c.toRect=d,c.thisAnimationDuration&&ga(p,d)&&!ga(u,d)&&(f.top-d.top)/(f.left-d.left)===(u.top-d.top)/(u.left-d.left)&&(l=hd(f,p,_,s.options)),ga(d,u)||(c.prevFromRect=u,c.prevToRect=d,l||(l=s.options.animation),s.animate(c,f,d,l)),l&&(r=!0,n=Math.max(n,l),clearTimeout(c.animationResetTimer),c.animationResetTimer=setTimeout(function(){c.animationTime=0,c.prevFromRect=null,c.fromRect=null,c.prevToRect=null,c.thisAnimationDuration=null},l),c.thisAnimationDuration=l)}),clearTimeout(e),r?e=setTimeout(function(){typeof a=="function"&&a()},n):typeof a=="function"&&a(),i=[]},animate:function(a,s,r,n){if(n){S(a,"transition",""),S(a,"transform","");var o=mt(this.el),l=o&&o.a,c=o&&o.d,u=(s.left-r.left)/(l||1),d=(s.top-r.top)/(c||1);a.animatingX=!!u,a.animatingY=!!d,S(a,"transform","translate3d("+u+"px,"+d+"px,0)"),this.forRepaintDummy=ud(a),S(a,"transition","transform "+n+"ms"+(this.options.easing?" "+this.options.easing:"")),S(a,"transform","translate3d(0,0,0)"),typeof a.animated=="number"&&clearTimeout(a.animated),a.animated=setTimeout(function(){S(a,"transition",""),S(a,"transform",""),a.animated=!1,a.animatingX=!1,a.animatingY=!1},n)}}}}function ud(i){return i.offsetWidth}function hd(i,e,t,a){return Math.sqrt(Math.pow(e.top-i.top,2)+Math.pow(e.left-i.left,2))/Math.sqrt(Math.pow(e.top-t.top,2)+Math.pow(e.left-t.left,2))*a.animation}var gt=[],va={initializeByDefault:!0},Ut={mount:function(e){for(var t in va)va.hasOwnProperty(t)&&!(t in e)&&(e[t]=va[t]);gt.forEach(function(a){if(a.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),gt.push(e)},pluginEvent:function(e,t,a){var s=this;this.eventCanceled=!1,a.cancel=function(){s.eventCanceled=!0};var r=e+"Global";gt.forEach(function(n){t[n.pluginName]&&(t[n.pluginName][r]&&t[n.pluginName][r](Ie({sortable:t},a)),t.options[n.pluginName]&&t[n.pluginName][e]&&t[n.pluginName][e](Ie({sortable:t},a)))})},initializePlugins:function(e,t,a,s){gt.forEach(function(o){var l=o.pluginName;if(!(!e.options[l]&&!o.initializeByDefault)){var c=new o(e,t,e.options);c.sortable=e,c.options=e.options,e[l]=c,Fe(a,c.defaults)}});for(var r in e.options)if(e.options.hasOwnProperty(r)){var n=this.modifyOption(e,r,e.options[r]);typeof n<"u"&&(e.options[r]=n)}},getEventProperties:function(e,t){var a={};return gt.forEach(function(s){typeof s.eventProperties=="function"&&Fe(a,s.eventProperties.call(t[s.pluginName],e))}),a},modifyOption:function(e,t,a){var s;return gt.forEach(function(r){e[r.pluginName]&&r.optionListeners&&typeof r.optionListeners[t]=="function"&&(s=r.optionListeners[t].call(e[r.pluginName],a))}),s}};function pd(i){var e=i.sortable,t=i.rootEl,a=i.name,s=i.targetEl,r=i.cloneEl,n=i.toEl,o=i.fromEl,l=i.oldIndex,c=i.newIndex,u=i.oldDraggableIndex,d=i.newDraggableIndex,p=i.originalEvent,_=i.putSortable,f=i.extraEventProperties;if(e=e||t&&t[fe],!!e){var g,y=e.options,k="on"+a.charAt(0).toUpperCase()+a.substr(1);window.CustomEvent&&!je&&!Lt?g=new CustomEvent(a,{bubbles:!0,cancelable:!0}):(g=document.createEvent("Event"),g.initEvent(a,!0,!0)),g.to=n||t,g.from=o||t,g.item=s||t,g.clone=r,g.oldIndex=l,g.newIndex=c,g.oldDraggableIndex=u,g.newDraggableIndex=d,g.originalEvent=p,g.pullMode=_?_.lastPutMode:void 0;var x=Ie(Ie({},f),Ut.getEventProperties(a,e));for(var M in x)g[M]=x[M];t&&t.dispatchEvent(g),y[k]&&y[k].call(e,g)}}var _d=["evt"],ge=function(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},s=a.evt,r=id(a,_d);Ut.pluginEvent.bind($)(e,t,Ie({dragEl:w,parentEl:Y,ghostEl:T,rootEl:V,nextEl:at,lastDownEl:fi,cloneEl:W,cloneHidden:Be,dragStarted:Gt,putSortable:re,activeSortable:$.active,originalEvent:s,oldIndex:vt,oldDraggableIndex:Bt,newIndex:be,newDraggableIndex:Ge,hideGhostForTarget:Vr,unhideGhostForTarget:Qr,cloneNowHidden:function(){Be=!0},cloneNowShown:function(){Be=!1},dispatchSortableEvent:function(o){he({sortable:t,name:o,originalEvent:s})}},r))};function he(i){pd(Ie({putSortable:re,cloneEl:W,targetEl:w,rootEl:V,oldIndex:vt,oldDraggableIndex:Bt,newIndex:be,newDraggableIndex:Ge},i))}var w,Y,T,V,at,fi,W,Be,vt,be,Bt,Ge,gi,re,yt=!1,vi=!1,yi=[],st,Ee,ya,ba,Nr,qr,Gt,bt,Ht,Vt=!1,bi=!1,xi,de,xa=[],wa=!1,wi=[],ki=typeof document<"u",Ei=ma,Ur=Lt||je?"cssFloat":"float",md=ki&&!Cr&&!ma&&"draggable"in document.createElement("div"),Br=(function(){if(ki){if(je)return!1;var i=document.createElement("x");return i.style.cssText="pointer-events:auto",i.style.pointerEvents==="auto"}})(),Gr=function(e,t){var a=S(e),s=parseInt(a.width)-parseInt(a.paddingLeft)-parseInt(a.paddingRight)-parseInt(a.borderLeftWidth)-parseInt(a.borderRightWidth),r=ft(e,0,t),n=ft(e,1,t),o=r&&S(r),l=n&&S(n),c=o&&parseInt(o.marginLeft)+parseInt(o.marginRight)+X(r).width,u=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+X(n).width;if(a.display==="flex")return a.flexDirection==="column"||a.flexDirection==="column-reverse"?"vertical":"horizontal";if(a.display==="grid")return a.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(r&&o.float&&o.float!=="none"){var d=o.float==="left"?"left":"right";return n&&(l.clear==="both"||l.clear===d)?"vertical":"horizontal"}return r&&(o.display==="block"||o.display==="flex"||o.display==="table"||o.display==="grid"||c>=s&&a[Ur]==="none"||n&&a[Ur]==="none"&&c+u>s)?"vertical":"horizontal"},fd=function(e,t,a){var s=a?e.left:e.top,r=a?e.right:e.bottom,n=a?e.width:e.height,o=a?t.left:t.top,l=a?t.right:t.bottom,c=a?t.width:t.height;return s===o||r===l||s+n/2===o+c/2},gd=function(e,t){var a;return yi.some(function(s){var r=s[fe].options.emptyInsertThreshold;if(!(!r||fa(s))){var n=X(s),o=e>=n.left-r&&e<=n.right+r,l=t>=n.top-r&&t<=n.bottom+r;if(o&&l)return a=s}}),a},Hr=function(e){function t(r,n){return function(o,l,c,u){var d=o.options.group.name&&l.options.group.name&&o.options.group.name===l.options.group.name;if(r==null&&(n||d))return!0;if(r==null||r===!1)return!1;if(n&&r==="clone")return r;if(typeof r=="function")return t(r(o,l,c,u),n)(o,l,c,u);var p=(n?o:l).options.group.name;return r===!0||typeof r=="string"&&r===p||r.join&&r.indexOf(p)>-1}}var a={},s=e.group;(!s||_a(s)!="object")&&(s={name:s}),a.name=s.name,a.checkPull=t(s.pull,!0),a.checkPut=t(s.put),a.revertClone=s.revertClone,e.group=a},Vr=function(){!Br&&T&&S(T,"display","none")},Qr=function(){!Br&&T&&S(T,"display","")};ki&&!Cr&&document.addEventListener("click",function(i){if(vi)return i.preventDefault(),i.stopPropagation&&i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),vi=!1,!1},!0);var rt=function(e){if(w){e=e.touches?e.touches[0]:e;var t=gd(e.clientX,e.clientY);if(t){var a={};for(var s in e)e.hasOwnProperty(s)&&(a[s]=e[s]);a.target=a.rootEl=t,a.preventDefault=void 0,a.stopPropagation=void 0,t[fe]._onDragOver(a)}}},vd=function(e){w&&w.parentNode[fe]._isOutsideThisEl(e.target)};function $(i,e){if(!(i&&i.nodeType&&i.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(i));this.el=i,this.options=e=Fe({},e),i[fe]=this;var t={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(i.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return Gr(i,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(n,o){n.setData("Text",o.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:$.supportPointer!==!1&&"PointerEvent"in window&&(!Nt||ma),emptyInsertThreshold:5};Ut.initializePlugins(this,i,t);for(var a in t)!(a in e)&&(e[a]=t[a]);Hr(e);for(var s in this)s.charAt(0)==="_"&&typeof this[s]=="function"&&(this[s]=this[s].bind(this));this.nativeDraggable=e.forceFallback?!1:md,this.nativeDraggable&&(this.options.touchStartThreshold=1),e.supportPointer?P(i,"pointerdown",this._onTapStart):(P(i,"mousedown",this._onTapStart),P(i,"touchstart",this._onTapStart)),this.nativeDraggable&&(P(i,"dragover",this),P(i,"dragenter",this)),yi.push(this.el),e.store&&e.store.get&&this.sort(e.store.get(this)||[]),Fe(this,dd())}$.prototype={constructor:$,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&(bt=null)},_getDirection:function(e,t){return typeof this.options.direction=="function"?this.options.direction.call(this,e,t,w):this.options.direction},_onTapStart:function(e){if(e.cancelable){var t=this,a=this.el,s=this.options,r=s.preventOnFilter,n=e.type,o=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,l=(o||e).target,c=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,u=s.filter;if(Sd(a),!w&&!(/mousedown|pointerdown/.test(n)&&e.button!==0||s.disabled)&&!c.isContentEditable&&!(!this.nativeDraggable&&Nt&&l&&l.tagName.toUpperCase()==="SELECT")&&(l=ke(l,s.draggable,a,!1),!(l&&l.animated)&&fi!==l)){if(vt=we(l),Bt=we(l,s.draggable),typeof u=="function"){if(u.call(this,e,l,this)){he({sortable:t,rootEl:c,name:"filter",targetEl:l,toEl:a,fromEl:a}),ge("filter",t,{evt:e}),r&&e.preventDefault();return}}else if(u&&(u=u.split(",").some(function(d){if(d=ke(c,d.trim(),a,!1),d)return he({sortable:t,rootEl:d,name:"filter",targetEl:l,fromEl:a,toEl:a}),ge("filter",t,{evt:e}),!0}),u)){r&&e.preventDefault();return}s.handle&&!ke(c,s.handle,a,!1)||this._prepareDragStart(e,o,l)}}},_prepareDragStart:function(e,t,a){var s=this,r=s.el,n=s.options,o=r.ownerDocument,l;if(a&&!w&&a.parentNode===r){var c=X(a);if(V=r,w=a,Y=w.parentNode,at=w.nextSibling,fi=a,gi=n.group,$.dragged=w,st={target:w,clientX:(t||e).clientX,clientY:(t||e).clientY},Nr=st.clientX-c.left,qr=st.clientY-c.top,this._lastX=(t||e).clientX,this._lastY=(t||e).clientY,w.style["will-change"]="all",l=function(){if(ge("delayEnded",s,{evt:e}),$.eventCanceled){s._onDrop();return}s._disableDelayedDragEvents(),!Ir&&s.nativeDraggable&&(w.draggable=!0),s._triggerDragStart(e,t),he({sortable:s,name:"choose",originalEvent:e}),ye(w,n.chosenClass,!0)},n.ignore.split(",").forEach(function(u){Dr(w,u.trim(),ka)}),P(o,"dragover",rt),P(o,"mousemove",rt),P(o,"touchmove",rt),n.supportPointer?(P(o,"pointerup",s._onDrop),!this.nativeDraggable&&P(o,"pointercancel",s._onDrop)):(P(o,"mouseup",s._onDrop),P(o,"touchend",s._onDrop),P(o,"touchcancel",s._onDrop)),Ir&&this.nativeDraggable&&(this.options.touchStartThreshold=4,w.draggable=!0),ge("delayStart",this,{evt:e}),n.delay&&(!n.delayOnTouchOnly||t)&&(!this.nativeDraggable||!(Lt||je))){if($.eventCanceled){this._onDrop();return}n.supportPointer?(P(o,"pointerup",s._disableDelayedDrag),P(o,"pointercancel",s._disableDelayedDrag)):(P(o,"mouseup",s._disableDelayedDrag),P(o,"touchend",s._disableDelayedDrag),P(o,"touchcancel",s._disableDelayedDrag)),P(o,"mousemove",s._delayedDragTouchMoveHandler),P(o,"touchmove",s._delayedDragTouchMoveHandler),n.supportPointer&&P(o,"pointermove",s._delayedDragTouchMoveHandler),s._dragStartTimer=setTimeout(l,n.delay)}else l()}},_delayedDragTouchMoveHandler:function(e){var t=e.touches?e.touches[0]:e;Math.max(Math.abs(t.clientX-this._lastX),Math.abs(t.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){w&&ka(w),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;D(e,"mouseup",this._disableDelayedDrag),D(e,"touchend",this._disableDelayedDrag),D(e,"touchcancel",this._disableDelayedDrag),D(e,"pointerup",this._disableDelayedDrag),D(e,"pointercancel",this._disableDelayedDrag),D(e,"mousemove",this._delayedDragTouchMoveHandler),D(e,"touchmove",this._delayedDragTouchMoveHandler),D(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,t){t=t||e.pointerType=="touch"&&e,!this.nativeDraggable||t?this.options.supportPointer?P(document,"pointermove",this._onTouchMove):t?P(document,"touchmove",this._onTouchMove):P(document,"mousemove",this._onTouchMove):(P(w,"dragend",this),P(V,"dragstart",this._onDragStart));try{document.selection?Si(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,t){if(yt=!1,V&&w){ge("dragStarted",this,{evt:t}),this.nativeDraggable&&P(document,"dragover",vd);var a=this.options;!e&&ye(w,a.dragClass,!1),ye(w,a.ghostClass,!0),$.active=this,e&&this._appendGhost(),he({sortable:this,name:"start",originalEvent:t})}else this._nulling()},_emulateDragOver:function(){if(Ee){this._lastX=Ee.clientX,this._lastY=Ee.clientY,Vr();for(var e=document.elementFromPoint(Ee.clientX,Ee.clientY),t=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(Ee.clientX,Ee.clientY),e!==t);)t=e;if(w.parentNode[fe]._isOutsideThisEl(e),t)do{if(t[fe]){var a=void 0;if(a=t[fe]._onDragOver({clientX:Ee.clientX,clientY:Ee.clientY,target:e,rootEl:t}),a&&!this.options.dragoverBubble)break}e=t}while(t=Mr(t));Qr()}},_onTouchMove:function(e){if(st){var t=this.options,a=t.fallbackTolerance,s=t.fallbackOffset,r=e.touches?e.touches[0]:e,n=T&&mt(T,!0),o=T&&n&&n.a,l=T&&n&&n.d,c=Ei&&de&&Pr(de),u=(r.clientX-st.clientX+s.x)/(o||1)+(c?c[0]-xa[0]:0)/(o||1),d=(r.clientY-st.clientY+s.y)/(l||1)+(c?c[1]-xa[1]:0)/(l||1);if(!$.active&&!yt){if(a&&Math.max(Math.abs(r.clientX-this._lastX),Math.abs(r.clientY-this._lastY))<a)return;this._onDragStart(e,!0)}if(T){n?(n.e+=u-(ya||0),n.f+=d-(ba||0)):n={a:1,b:0,c:0,d:1,e:u,f:d};var p="matrix(".concat(n.a,",").concat(n.b,",").concat(n.c,",").concat(n.d,",").concat(n.e,",").concat(n.f,")");S(T,"webkitTransform",p),S(T,"mozTransform",p),S(T,"msTransform",p),S(T,"transform",p),ya=u,ba=d,Ee=r}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!T){var e=this.options.fallbackOnBody?document.body:V,t=X(w,!0,Ei,!0,e),a=this.options;if(Ei){for(de=e;S(de,"position")==="static"&&S(de,"transform")==="none"&&de!==document;)de=de.parentNode;de!==document.body&&de!==document.documentElement?(de===document&&(de=Ce()),t.top+=de.scrollTop,t.left+=de.scrollLeft):de=Ce(),xa=Pr(de)}T=w.cloneNode(!0),ye(T,a.ghostClass,!1),ye(T,a.fallbackClass,!0),ye(T,a.dragClass,!0),S(T,"transition",""),S(T,"transform",""),S(T,"box-sizing","border-box"),S(T,"margin",0),S(T,"top",t.top),S(T,"left",t.left),S(T,"width",t.width),S(T,"height",t.height),S(T,"opacity","0.8"),S(T,"position",Ei?"absolute":"fixed"),S(T,"zIndex","100000"),S(T,"pointerEvents","none"),$.ghost=T,e.appendChild(T),S(T,"transform-origin",Nr/parseInt(T.style.width)*100+"% "+qr/parseInt(T.style.height)*100+"%")}},_onDragStart:function(e,t){var a=this,s=e.dataTransfer,r=a.options;if(ge("dragStart",this,{evt:e}),$.eventCanceled){this._onDrop();return}ge("setupClone",this),$.eventCanceled||(W=zr(w),W.removeAttribute("id"),W.draggable=!1,W.style["will-change"]="",this._hideClone(),ye(W,this.options.chosenClass,!1),$.clone=W),a.cloneId=Si(function(){ge("clone",a),!$.eventCanceled&&(a.options.removeCloneOnHide||V.insertBefore(W,w),a._hideClone(),he({sortable:a,name:"clone"}))}),!t&&ye(w,r.dragClass,!0),t?(vi=!0,a._loopId=setInterval(a._emulateDragOver,50)):(D(document,"mouseup",a._onDrop),D(document,"touchend",a._onDrop),D(document,"touchcancel",a._onDrop),s&&(s.effectAllowed="move",r.setData&&r.setData.call(a,s,w)),P(document,"drop",a),S(w,"transform","translateZ(0)")),yt=!0,a._dragStartId=Si(a._dragStarted.bind(a,t,e)),P(document,"selectstart",a),Gt=!0,window.getSelection().removeAllRanges(),Nt&&S(document.body,"user-select","none")},_onDragOver:function(e){var t=this.el,a=e.target,s,r,n,o=this.options,l=o.group,c=$.active,u=gi===l,d=o.sort,p=re||c,_,f=this,g=!1;if(wa)return;function y(oe,Ae){ge(oe,f,Ie({evt:e,isOwner:u,axis:_?"vertical":"horizontal",revert:n,dragRect:s,targetRect:r,canSort:d,fromSortable:p,target:a,completed:x,onMove:function(ae,Pe){return Ai(V,t,w,s,ae,X(ae),e,Pe)},changed:M},Ae))}function k(){y("dragOverAnimationCapture"),f.captureAnimationState(),f!==p&&p.captureAnimationState()}function x(oe){return y("dragOverCompleted",{insertion:oe}),oe&&(u?c._hideClone():c._showClone(f),f!==p&&(ye(w,re?re.options.ghostClass:c.options.ghostClass,!1),ye(w,o.ghostClass,!0)),re!==f&&f!==$.active?re=f:f===$.active&&re&&(re=null),p===f&&(f._ignoreWhileAnimating=a),f.animateAll(function(){y("dragOverAnimationComplete"),f._ignoreWhileAnimating=null}),f!==p&&(p.animateAll(),p._ignoreWhileAnimating=null)),(a===w&&!w.animated||a===t&&!a.animated)&&(bt=null),!o.dragoverBubble&&!e.rootEl&&a!==document&&(w.parentNode[fe]._isOutsideThisEl(e.target),!oe&&rt(e)),!o.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),g=!0}function M(){be=we(w),Ge=we(w,o.draggable),he({sortable:f,name:"change",toEl:t,newIndex:be,newDraggableIndex:Ge,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),a=ke(a,o.draggable,t,!0),y("dragOver"),$.eventCanceled)return g;if(w.contains(e.target)||a.animated&&a.animatingX&&a.animatingY||f._ignoreWhileAnimating===a)return x(!1);if(vi=!1,c&&!o.disabled&&(u?d||(n=Y!==V):re===this||(this.lastPutMode=gi.checkPull(this,c,w,e))&&l.checkPut(this,c,w,e))){if(_=this._getDirection(e,a)==="vertical",s=X(w),y("dragOverValid"),$.eventCanceled)return g;if(n)return Y=V,k(),this._hideClone(),y("revert"),$.eventCanceled||(at?V.insertBefore(w,at):V.appendChild(w)),x(!0);var E=fa(t,o.draggable);if(!E||wd(e,_,this)&&!E.animated){if(E===w)return x(!1);if(E&&t===e.target&&(a=E),a&&(r=X(a)),Ai(V,t,w,s,a,r,e,!!a)!==!1)return k(),E&&E.nextSibling?t.insertBefore(w,E.nextSibling):t.appendChild(w),Y=t,M(),x(!0)}else if(E&&xd(e,_,this)){var G=ft(t,0,o,!0);if(G===w)return x(!1);if(a=G,r=X(a),Ai(V,t,w,s,a,r,e,!1)!==!1)return k(),t.insertBefore(w,G),Y=t,M(),x(!0)}else if(a.parentNode===t){r=X(a);var U=0,O,z=w.parentNode!==t,N=!fd(w.animated&&w.toRect||s,a.animated&&a.toRect||r,_),C=_?"top":"left",I=jr(a,"top","top")||jr(w,"top","top"),R=I?I.scrollTop:void 0;bt!==a&&(O=r[C],Vt=!1,bi=!N&&o.invertSwap||z),U=kd(e,a,r,_,N?1:o.swapThreshold,o.invertedSwapThreshold==null?o.swapThreshold:o.invertedSwapThreshold,bi,bt===a);var B;if(U!==0){var te=we(w);do te-=U,B=Y.children[te];while(B&&(S(B,"display")==="none"||B===T))}if(U===0||B===a)return x(!1);bt=a,Ht=U;var ie=a.nextElementSibling,Z=!1;Z=U===1;var ne=Ai(V,t,w,s,a,r,e,Z);if(ne!==!1)return(ne===1||ne===-1)&&(Z=ne===1),wa=!0,setTimeout(bd,30),k(),Z&&!ie?t.appendChild(w):a.parentNode.insertBefore(w,Z?ie:a),I&&Rr(I,0,R-I.scrollTop),Y=w.parentNode,O!==void 0&&!bi&&(xi=Math.abs(O-X(a)[C])),M(),x(!0)}if(t.contains(w))return x(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){D(document,"mousemove",this._onTouchMove),D(document,"touchmove",this._onTouchMove),D(document,"pointermove",this._onTouchMove),D(document,"dragover",rt),D(document,"mousemove",rt),D(document,"touchmove",rt)},_offUpEvents:function(){var e=this.el.ownerDocument;D(e,"mouseup",this._onDrop),D(e,"touchend",this._onDrop),D(e,"pointerup",this._onDrop),D(e,"pointercancel",this._onDrop),D(e,"touchcancel",this._onDrop),D(document,"selectstart",this)},_onDrop:function(e){var t=this.el,a=this.options;if(be=we(w),Ge=we(w,a.draggable),ge("drop",this,{evt:e}),Y=w&&w.parentNode,be=we(w),Ge=we(w,a.draggable),$.eventCanceled){this._nulling();return}yt=!1,bi=!1,Vt=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),Ea(this.cloneId),Ea(this._dragStartId),this.nativeDraggable&&(D(document,"drop",this),D(t,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),Nt&&S(document.body,"user-select",""),S(w,"transform",""),e&&(Gt&&(e.cancelable&&e.preventDefault(),!a.dropBubble&&e.stopPropagation()),T&&T.parentNode&&T.parentNode.removeChild(T),(V===Y||re&&re.lastPutMode!=="clone")&&W&&W.parentNode&&W.parentNode.removeChild(W),w&&(this.nativeDraggable&&D(w,"dragend",this),ka(w),w.style["will-change"]="",Gt&&!yt&&ye(w,re?re.options.ghostClass:this.options.ghostClass,!1),ye(w,this.options.chosenClass,!1),he({sortable:this,name:"unchoose",toEl:Y,newIndex:null,newDraggableIndex:null,originalEvent:e}),V!==Y?(be>=0&&(he({rootEl:Y,name:"add",toEl:Y,fromEl:V,originalEvent:e}),he({sortable:this,name:"remove",toEl:Y,originalEvent:e}),he({rootEl:Y,name:"sort",toEl:Y,fromEl:V,originalEvent:e}),he({sortable:this,name:"sort",toEl:Y,originalEvent:e})),re&&re.save()):be!==vt&&be>=0&&(he({sortable:this,name:"update",toEl:Y,originalEvent:e}),he({sortable:this,name:"sort",toEl:Y,originalEvent:e})),$.active&&((be==null||be===-1)&&(be=vt,Ge=Bt),he({sortable:this,name:"end",toEl:Y,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){ge("nulling",this),V=w=Y=T=at=W=fi=Be=st=Ee=Gt=be=Ge=vt=Bt=bt=Ht=re=gi=$.dragged=$.ghost=$.clone=$.active=null;var e=this.el;wi.forEach(function(t){e.contains(t)&&(t.checked=!0)}),wi.length=ya=ba=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":w&&(this._onDragOver(e),yd(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],t,a=this.el.children,s=0,r=a.length,n=this.options;s<r;s++)t=a[s],ke(t,n.draggable,this.el,!1)&&e.push(t.getAttribute(n.dataIdAttr)||Ad(t));return e},sort:function(e,t){var a={},s=this.el;this.toArray().forEach(function(r,n){var o=s.children[n];ke(o,this.options.draggable,s,!1)&&(a[r]=o)},this),t&&this.captureAnimationState(),e.forEach(function(r){a[r]&&(s.removeChild(a[r]),s.appendChild(a[r]))}),t&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,t){return ke(e,t||this.options.draggable,this.el,!1)},option:function(e,t){var a=this.options;if(t===void 0)return a[e];var s=Ut.modifyOption(this,e,t);typeof s<"u"?a[e]=s:a[e]=t,e==="group"&&Hr(a)},destroy:function(){ge("destroy",this);var e=this.el;e[fe]=null,D(e,"mousedown",this._onTapStart),D(e,"touchstart",this._onTapStart),D(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(D(e,"dragover",this),D(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(t){t.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),yi.splice(yi.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!Be){if(ge("hideClone",this),$.eventCanceled)return;S(W,"display","none"),this.options.removeCloneOnHide&&W.parentNode&&W.parentNode.removeChild(W),Be=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(Be){if(ge("showClone",this),$.eventCanceled)return;w.parentNode==V&&!this.options.group.revertClone?V.insertBefore(W,w):at?V.insertBefore(W,at):V.appendChild(W),this.options.group.revertClone&&this.animate(w,W),S(W,"display",""),Be=!1}}};function yd(i){i.dataTransfer&&(i.dataTransfer.dropEffect="move"),i.cancelable&&i.preventDefault()}function Ai(i,e,t,a,s,r,n,o){var l,c=i[fe],u=c.options.onMove,d;return window.CustomEvent&&!je&&!Lt?l=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(l=document.createEvent("Event"),l.initEvent("move",!0,!0)),l.to=e,l.from=i,l.dragged=t,l.draggedRect=a,l.related=s||e,l.relatedRect=r||X(e),l.willInsertAfter=o,l.originalEvent=n,i.dispatchEvent(l),u&&(d=u.call(c,l,n)),d}function ka(i){i.draggable=!1}function bd(){wa=!1}function xd(i,e,t){var a=X(ft(t.el,0,t.options,!0)),s=Lr(t.el,t.options,T),r=10;return e?i.clientX<s.left-r||i.clientY<a.top&&i.clientX<a.right:i.clientY<s.top-r||i.clientY<a.bottom&&i.clientX<a.left}function wd(i,e,t){var a=X(fa(t.el,t.options.draggable)),s=Lr(t.el,t.options,T),r=10;return e?i.clientX>s.right+r||i.clientY>a.bottom&&i.clientX>a.left:i.clientY>s.bottom+r||i.clientX>a.right&&i.clientY>a.top}function kd(i,e,t,a,s,r,n,o){var l=a?i.clientY:i.clientX,c=a?t.height:t.width,u=a?t.top:t.left,d=a?t.bottom:t.right,p=!1;if(!n){if(o&&xi<c*s){if(!Vt&&(Ht===1?l>u+c*r/2:l<d-c*r/2)&&(Vt=!0),Vt)p=!0;else if(Ht===1?l<u+xi:l>d-xi)return-Ht}else if(l>u+c*(1-s)/2&&l<d-c*(1-s)/2)return Ed(e)}return p=p||n,p&&(l<u+c*r/2||l>d-c*r/2)?l>u+c/2?1:-1:0}function Ed(i){return we(w)<we(i)?1:-1}function Ad(i){for(var e=i.tagName+i.className+i.src+i.href+i.textContent,t=e.length,a=0;t--;)a+=e.charCodeAt(t);return a.toString(36)}function Sd(i){wi.length=0;for(var e=i.getElementsByTagName("input"),t=e.length;t--;){var a=e[t];a.checked&&wi.push(a)}}function Si(i){return setTimeout(i,0)}function Ea(i){return clearTimeout(i)}ki&&P(document,"touchmove",function(i){($.active||yt)&&i.cancelable&&i.preventDefault()}),$.utils={on:P,off:D,css:S,find:Dr,is:function(e,t){return!!ke(e,t,e,!1)},extend:ld,throttle:Or,closest:ke,toggleClass:ye,clone:zr,index:we,nextTick:Si,cancelNextTick:Ea,detectDirection:Gr,getChild:ft,expando:fe},$.get=function(i){return i[fe]},$.mount=function(){for(var i=arguments.length,e=new Array(i),t=0;t<i;t++)e[t]=arguments[t];e[0].constructor===Array&&(e=e[0]),e.forEach(function(a){if(!a.prototype||!a.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));a.utils&&($.utils=Ie(Ie({},$.utils),a.utils)),Ut.mount(a)})},$.create=function(i,e){return new $(i,e)},$.version=nd;var J=[],Qt,Aa,Sa=!1,$a,Ia,$i,Wt;function $d(){function i(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var e in this)e.charAt(0)==="_"&&typeof this[e]=="function"&&(this[e]=this[e].bind(this))}return i.prototype={dragStarted:function(t){var a=t.originalEvent;this.sortable.nativeDraggable?P(document,"dragover",this._handleAutoScroll):this.options.supportPointer?P(document,"pointermove",this._handleFallbackAutoScroll):a.touches?P(document,"touchmove",this._handleFallbackAutoScroll):P(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(t){var a=t.originalEvent;!this.options.dragOverBubble&&!a.rootEl&&this._handleAutoScroll(a)},drop:function(){this.sortable.nativeDraggable?D(document,"dragover",this._handleAutoScroll):(D(document,"pointermove",this._handleFallbackAutoScroll),D(document,"touchmove",this._handleFallbackAutoScroll),D(document,"mousemove",this._handleFallbackAutoScroll)),Wr(),Ii(),cd()},nulling:function(){$i=Aa=Qt=Sa=Wt=$a=Ia=null,J.length=0},_handleFallbackAutoScroll:function(t){this._handleAutoScroll(t,!0)},_handleAutoScroll:function(t,a){var s=this,r=(t.touches?t.touches[0]:t).clientX,n=(t.touches?t.touches[0]:t).clientY,o=document.elementFromPoint(r,n);if($i=t,a||this.options.forceAutoScrollFallback||Lt||je||Nt){Ca(t,this.options,o,a);var l=Ue(o,!0);Sa&&(!Wt||r!==$a||n!==Ia)&&(Wt&&Wr(),Wt=setInterval(function(){var c=Ue(document.elementFromPoint(r,n),!0);c!==l&&(l=c,Ii()),Ca(t,s.options,c,a)},10),$a=r,Ia=n)}else{if(!this.options.bubbleScroll||Ue(o,!0)===Ce()){Ii();return}Ca(t,this.options,Ue(o,!1),!1)}}},Fe(i,{pluginName:"scroll",initializeByDefault:!0})}function Ii(){J.forEach(function(i){clearInterval(i.pid)}),J=[]}function Wr(){clearInterval(Wt)}var Ca=Or(function(i,e,t,a){if(e.scroll){var s=(i.touches?i.touches[0]:i).clientX,r=(i.touches?i.touches[0]:i).clientY,n=e.scrollSensitivity,o=e.scrollSpeed,l=Ce(),c=!1,u;Aa!==t&&(Aa=t,Ii(),Qt=e.scroll,u=e.scrollFn,Qt===!0&&(Qt=Ue(t,!0)));var d=0,p=Qt;do{var _=p,f=X(_),g=f.top,y=f.bottom,k=f.left,x=f.right,M=f.width,E=f.height,G=void 0,U=void 0,O=_.scrollWidth,z=_.scrollHeight,N=S(_),C=_.scrollLeft,I=_.scrollTop;_===l?(G=M<O&&(N.overflowX==="auto"||N.overflowX==="scroll"||N.overflowX==="visible"),U=E<z&&(N.overflowY==="auto"||N.overflowY==="scroll"||N.overflowY==="visible")):(G=M<O&&(N.overflowX==="auto"||N.overflowX==="scroll"),U=E<z&&(N.overflowY==="auto"||N.overflowY==="scroll"));var R=G&&(Math.abs(x-s)<=n&&C+M<O)-(Math.abs(k-s)<=n&&!!C),B=U&&(Math.abs(y-r)<=n&&I+E<z)-(Math.abs(g-r)<=n&&!!I);if(!J[d])for(var te=0;te<=d;te++)J[te]||(J[te]={});(J[d].vx!=R||J[d].vy!=B||J[d].el!==_)&&(J[d].el=_,J[d].vx=R,J[d].vy=B,clearInterval(J[d].pid),(R!=0||B!=0)&&(c=!0,J[d].pid=setInterval(function(){a&&this.layer===0&&$.active._onTouchMove($i);var ie=J[this.layer].vy?J[this.layer].vy*o:0,Z=J[this.layer].vx?J[this.layer].vx*o:0;typeof u=="function"&&u.call($.dragged.parentNode[fe],Z,ie,i,$i,J[this.layer].el)!=="continue"||Rr(J[this.layer].el,Z,ie)}.bind({layer:d}),24))),d++}while(e.bubbleScroll&&p!==l&&(p=Ue(p,!1)));Sa=c}},30),Yr=function(e){var t=e.originalEvent,a=e.putSortable,s=e.dragEl,r=e.activeSortable,n=e.dispatchSortableEvent,o=e.hideGhostForTarget,l=e.unhideGhostForTarget;if(t){var c=a||r;o();var u=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:t,d=document.elementFromPoint(u.clientX,u.clientY);l(),c&&!c.el.contains(d)&&(n("spill"),this.onSpill({dragEl:s,putSortable:a}))}};function Ta(){}Ta.prototype={startIndex:null,dragStart:function(e){var t=e.oldDraggableIndex;this.startIndex=t},onSpill:function(e){var t=e.dragEl,a=e.putSortable;this.sortable.captureAnimationState(),a&&a.captureAnimationState();var s=ft(this.sortable.el,this.startIndex,this.options);s?this.sortable.el.insertBefore(t,s):this.sortable.el.appendChild(t),this.sortable.animateAll(),a&&a.animateAll()},drop:Yr},Fe(Ta,{pluginName:"revertOnSpill"});function Ma(){}Ma.prototype={onSpill:function(e){var t=e.dragEl,a=e.putSortable,s=a||this.sortable;s.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),s.animateAll()},drop:Yr},Fe(Ma,{pluginName:"removeOnSpill"}),$.mount(new $d),$.mount(Ma,Ta);class Id extends et{static get properties(){return{disabled:{type:Boolean},handleSelector:{type:String},draggableSelector:{type:String}}}static get styles(){return Bi`
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
    `}constructor(){super(),this.disabled=!1,this.handleSelector=".handle",this.draggableSelector=".sortable-item",this._sortable=null}createRenderRoot(){return this}render(){return m`
      <slot></slot>
    `}connectedCallback(){super.connectedCallback(),this.disabled||this._createSortable()}disconnectedCallback(){super.disconnectedCallback(),this._destroySortable()}updated(e){e.has("disabled")&&(this.disabled?this._destroySortable():this._createSortable())}_createSortable(){if(this._sortable)return;const e=this.children[0];if(!e)return;const t={scroll:!0,forceAutoScrollFallback:!0,scrollSpeed:20,animation:150,draggable:this.draggableSelector,handle:this.handleSelector,fallbackTolerance:3,fallbackOnBody:!0,fallbackClass:"sortable-fallback",fallback:!1,onChoose:this._handleChoose.bind(this),onStart:this._handleStart.bind(this),onEnd:this._handleEnd.bind(this),onUpdate:this._handleUpdate.bind(this)};this._sortable=new $(e,t)}_handleUpdate(e){this.dispatchEvent(new CustomEvent("item-moved",{detail:{oldIndex:e.oldIndex,newIndex:e.newIndex},bubbles:!0,composed:!0}))}_handleEnd(e){this._cleanupGhostElements(),e.item.placeholder&&(e.item.placeholder.replaceWith(e.item),delete e.item.placeholder)}_handleStart(e){this._cleanupGhostElements()}_handleChoose(e){e.item.placeholder=document.createComment("sort-placeholder"),e.item.after(e.item.placeholder)}_cleanupGhostElements(){document.querySelectorAll(".sortable-fallback, .sortable-ghost").forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)})}_destroySortable(){this._sortable&&(this._sortable.destroy(),this._sortable=null,this._cleanupGhostElements())}}customElements.define("yamp-sortable",Id);const Zr=Object.freeze([{value:"details",label:h("card.sections.details")},{value:"menu",label:h("card.sections.menu")},{value:"action_chips",label:h("card.sections.action_chips")}]),Fa=Zr.map(i=>i.value);class Cd extends et{static get properties(){return{hass:{},_config:{},_activeTab:{type:String},_entityEditorIndex:{type:Number},_actionEditorIndex:{type:Number},_actionMode:{type:String},_useTemplate:{type:Boolean},_useVolTemplate:{type:Boolean},_serviceItems:{type:Array}}}constructor(){super(),this._activeTab="entities",this._entityEditorIndex=null,this._actionEditorIndex=null,this._yamlDraft="",this._parsedYaml=null,this._yamlError=!1,this._serviceItems=[],this._useTemplate=null,this._useVolTemplate=null,this._artworkOverrides=[]}firstUpdated(){this._serviceItems=this._getServiceItems()}updated(e){if(e.has("hass")){const t=e.get("hass");this.hass?.services!==t?.services&&(this._serviceItems=this._getServiceItems())}}_supportsFeature(e,t){return!e||typeof e.attributes.supported_features!="number"?!1:(e.attributes.supported_features&t)!==0}_isGroupCapable(e){return e?this._supportsFeature(e,Sr)?!0:Array.isArray(e.attributes?.group_members):!1}_normalizeArtworkOverrides(e){if(!Array.isArray(e))return[];const t=["media_title","media_artist","media_album_name","media_content_id","media_channel","app_name","media_content_type","entity_id"];return e.map(a=>{if(!a||typeof a!="object")return{match_type:"media_title",match_value:"",image_url:"",size_percentage:void 0,object_fit:void 0};const s=a.size_percentage;if(a.missing_art_url!==void 0)return{match_type:"missing_art",match_value:"",image_url:a.missing_art_url??"",size_percentage:s,object_fit:a.object_fit};let r="media_title",n="";for(const o of t){if(a[o]!==void 0){r=o,n=a[o]??"";break}const l=`${o}_equals`;if(a[l]!==void 0){r=o,n=a[l]??"";break}}return{match_type:r,match_value:n??"",image_url:a.image_url??"",size_percentage:s,object_fit:a.object_fit}})}_serializeArtworkOverride(e){if(!e)return null;const t=(e.image_url??"").trim();if(!t)return null;const a=e.object_fit==="default"?void 0:e.object_fit;if(e.match_type==="missing_art")return{missing_art_url:t,...e.size_percentage!==void 0?{size_percentage:Number(e.size_percentage)}:{},...a!==void 0?{object_fit:a}:{}};const s=(e.match_value??"").trim();return s?{image_url:t,[e.match_type]:s,...e.size_percentage!==void 0?{size_percentage:Number(e.size_percentage)}:{},...a!==void 0?{object_fit:a}:{}}:null}_writeArtworkOverrides(e){this._artworkOverrides=e;const t=e.map(a=>this._serializeArtworkOverride(a)).filter(a=>a);this._updateConfig("media_artwork_overrides",t.length?t:void 0)}_getServiceItems(){return this.hass?.services?Object.entries(this.hass.services).flatMap(([e,t])=>Object.keys(t).map(a=>({label:`${e}.${a}`,value:`${e}.${a}`}))):[]}_getEntityItems(e=[],t=[]){return()=>this.hass?.states?Object.keys(this.hass.states).filter(a=>{const s=a.split(".")[0];return!(e.length&&!e.includes(s)||t.includes(a))}).map(a=>{const s=this.hass.states[a];return{id:a,primary:s?.attributes?.friendly_name||a,secondary:a}}):[]}_entityValueRenderer(e){return e?this.hass?.states?.[e]?.attributes?.friendly_name||e:""}_entityRowRenderer(e){return m`
      <ha-list-item twoline graphic="icon">
        <ha-state-icon
          slot="graphic"
          .hass=${this.hass}
          .stateObj=${this.hass?.states?.[e.id]}
        ></ha-state-icon>
        <span>${e.primary}</span>
        <span slot="secondary">${e.secondary}</span>
      </ha-list-item>
    `}_getAdaptiveTextTargetsValue(){return Array.isArray(this._config?.adaptive_text_targets)?this._config.adaptive_text_targets.filter(e=>Fa.includes(e)):this._config?.adaptive_text===!0?[...Fa]:[]}_onAdaptiveTextTargetsChanged(e){const t=Array.isArray(e)?e.filter(a=>Fa.includes(a)):[];this._updateConfig("adaptive_text_targets",t)}_looksLikeTemplate(e){if(typeof e!="string")return!1;const t=e.trim();return t.includes("{{")||t.includes("{%")}_isEntityId(e){return typeof e=="string"&&/^[a-z_]+\.[a-zA-Z0-9_]+$/.test(e.trim())}setConfig(e){const t=(e.entities??[]).map(a=>typeof a=="string"?{entity_id:a}:a);this._config={...e,entities:t},this._artworkOverrides=this._normalizeArtworkOverrides(e.media_artwork_overrides)}_updateConfig(e,t){const a={...this._config,[e]:t};this._config=a,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a},bubbles:!0,composed:!0}))}_addArtworkOverride(){const e=[...this._artworkOverrides??[]];e.push({match_type:"media_title",match_value:"",image_url:"",size_percentage:void 0,object_fit:void 0}),this._writeArtworkOverrides(e)}_removeArtworkOverride(e){const t=[...this._artworkOverrides??[]];e<0||e>=t.length||(t.splice(e,1),this._writeArtworkOverrides(t))}_onArtworkMatchTypeChange(e,t){if(!t)return;const a=[...this._artworkOverrides??[]];if(!a[e])return;const s={...a[e],match_type:t};t==="missing_art"&&(s.match_value=""),a[e]=s,this._writeArtworkOverrides(a)}_onArtworkMatchValueChange(e,t){const a=[...this._artworkOverrides??[]];a[e]&&(a[e]={...a[e],match_value:t},this._writeArtworkOverrides(a))}_onArtworkImageUrlChange(e,t){const a=[...this._artworkOverrides??[]];a[e]&&(a[e]={...a[e],image_url:t},this._writeArtworkOverrides(a))}_onArtworkSizePercentageChange(e,t){const a=[...this._artworkOverrides??[]];if(a[e]){if(t==="")a[e]={...a[e],size_percentage:void 0};else{const s=Number(t);if(Number.isFinite(s))a[e]={...a[e],size_percentage:s};else return}this._writeArtworkOverrides(a)}}_onArtworkObjectFitChange(e,t){const a=[...this._artworkOverrides??[]];if(!a[e])return;const s=t==="default"?void 0:t;a[e]={...a[e],object_fit:s},this._writeArtworkOverrides(a)}_onArtworkMoved(e){const{oldIndex:t,newIndex:a}=e.detail??{},s=[...this._artworkOverrides??[]];if(t===void 0||a===void 0||t<0||a<0||t>=s.length||a>=s.length)return;const[r]=s.splice(t,1);s.splice(a,0,r),this._writeArtworkOverrides(s)}_updateEntityProperty(e,t){const a=[...this._config.entities??[]],s=this._entityEditorIndex;a[s]&&(a[s]={...a[s],[e]:t},this._updateConfig("entities",a))}_updateActionProperty(e,t){const a=[...this._config.actions??[]],s=this._actionEditorIndex;if(a[s]){e==="card_trigger"&&t&&t!=="none"&&a.forEach((n,o)=>{o!==s&&n.card_trigger===t&&(a[o]={...n,card_trigger:"none"})});const r={...a[s],[e]:t};e==="in_menu"&&delete r.placement,a[s]=r,this._updateConfig("actions",a)}}_deriveActionMode(e){if(!e)return"service";if(e.action==="sync_selected_entity"||e.sync_entity_helper)return"sync_selected_entity";if(typeof e.menu_item=="string"&&e.menu_item.trim()!=="")return"menu";const t=typeof e.navigation_path=="string"?e.navigation_path.trim():"";return e.action==="navigate"||t?"navigate":"service"}static get styles(){return Bi`
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
      `}render(){if(!this._config)return m``;const e=this._entityEditorIndex!==null,t=this._actionEditorIndex!==null;return m`
        <div class="tabs">
          ${["entities","behavior","look_and_feel","artwork","actions"].map(a=>{const s=h(`editor.tabs.${a}`);return m`
              <button
                class="tab" ${this._activeTab===a?"selected":""}
                @click=${()=>{this._activeTab=a,this._entityEditorIndex=null,this._actionEditorIndex=null,this._useTemplate=null,this._useVolTemplate=null}}
                ?selected=${this._activeTab===a}
              >${s}</button>
            `})}
        </div>
        <div class="tab-content">
          ${e?this._renderEntityEditor(this._config.entities?.[this._entityEditorIndex]):t?this._renderActionEditor(this._config.actions?.[this._actionEditorIndex]):this._renderActiveTab()}
        </div>
      `}_renderArtworkTab(){const e=[...this._artworkOverrides??[]],t=[{value:"media_title",label:"Media Title"},{value:"media_artist",label:"Media Artist"},{value:"media_album_name",label:"Album Name"},{value:"media_content_id",label:"Content ID"},{value:"media_channel",label:"Channel"},{value:"app_name",label:"App Name"},{value:"media_content_type",label:"Content Type"},{value:"entity_id",label:"Entity ID"},{value:"missing_art",label:"Missing Artwork"}];return m`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.artwork.general.title")}</div>
            <div class="section-description">${h("editor.sections.artwork.general.description")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${h("editor.fields.artwork_fit")}"
                .selector=${{select:{mode:"dropdown",options:[{value:"cover",label:"Cover (default)"},{value:"contain",label:"Contain"},{value:"fill",label:"Fill"},{value:"scale-down",label:"Scale Down"},{value:"scaled-contain",label:"Scaled Contain"},{value:"none",label:"None"}]}}}
                .value=${this._config.artwork_object_fit??"cover"}
                @value-changed=${a=>{const s=a.detail.value;this._updateConfig("artwork_object_fit",s==="cover"?void 0:s)}}
              ></ha-selector>
            </div>
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${h("editor.fields.artwork_position")}"
                .selector=${{select:{mode:"dropdown",options:[{value:"top center",label:"Top (default)"},{value:"center center",label:"Center"},{value:"bottom center",label:"Bottom"}]}}}
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
                <label for="extend-artwork-toggle" style="font-weight: 500;">${h("editor.subtitles.artwork_extend_label")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${h("editor.subtitles.artwork_extend")}</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${h("editor.fields.artwork_hostname")}"
              .value=${this._config.artwork_hostname??""}
              @input=${a=>this._updateConfig("artwork_hostname",a.target.value)}
              helper="e.g. http://192.168.1.50:8123"
              .helperPersistent=${!0}
            ></ha-textfield>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.artwork.idle.title")}</div>
            <div class="section-description">${h("editor.sections.artwork.idle.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="idle-image-url-toggle"
                .checked=${this._useIdleImageUrl??this._looksLikeUrlOrPath(this._config.idle_image)}
                @change=${a=>{this._useIdleImageUrl=a.target.checked,a.target.checked?this._updateConfig("idle_image",""):this._updateConfig("idle_image","")}}
              ></ha-switch>
              <label for="idle-image-url-toggle">${h("editor.labels.use_url_path")}</label>
            </div>
            <div style="flex: 2;">
              ${this._useIdleImageUrl?m`
                <ha-textfield
                  class="full-width"
                  placeholder="e.g., https://example.com/image.jpg or /local/custom/image.jpg"
                  .value=${this._config.idle_image??""}
                  @input=${a=>this._updateConfig("idle_image",a.target.value)}
                  helper="${h("editor.subtitles.image_url_helper")}"
                  .helperPersistent=${!0}
                ></ha-textfield>
              `:m`
                <ha-generic-picker
                  class="full-width"
                  .hass=${this.hass}
                  .value=${this._config.idle_image??""}
                  .label=${h("editor.fields.idle_image_entity")}
                  .valueRenderer=${a=>this._entityValueRenderer(a)}
                  .rowRenderer=${a=>this._entityRowRenderer(a)}
                  .getItems=${this._getEntityItems(["camera","image"])}
                  @value-changed=${a=>this._updateConfig("idle_image",a.detail.value)}
                  allow-custom-value
                ></ha-generic-picker>
              `}
            </div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.artwork.overrides.title")}</div>
            <div class="section-description">${h("editor.sections.artwork.overrides.description")}</div>
          </div>
          <yamp-sortable @item-moved=${a=>this._onArtworkMoved(a)}>
            <div class="sortable-container">
              ${e.length?e.map((a,s)=>m`
                    <div class="action-row-inner sortable-item artwork-row">
                      <div class="handle action-handle">
                        <ha-icon icon="mdi:drag"></ha-icon>
                      </div>
                      <div class="artwork-fields">
                        <ha-selector
                          .hass=${this.hass}
                          label="${h("editor.fields.match_field")}"
                          .selector=${{select:{mode:"dropdown",options:t}}}
                          .value=${a.match_type??"media_title"}
                          @value-changed=${r=>this._onArtworkMatchTypeChange(s,r.detail.value)}
                        ></ha-selector>
                        ${a.match_type==="missing_art"?m`
                                <div class="config-subtitle small">
                                  Applies when the selected media provides no artwork.
                                </div>
                              `:a.match_type==="entity_id"?m`
                                  <ha-generic-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .value=${a.match_value??""}
                                    .label=${h("editor.fields.match_entity")}
                                    .valueRenderer=${r=>this._entityValueRenderer(r)}
                                    .rowRenderer=${r=>this._entityRowRenderer(r)}
                                    .getItems=${this._getEntityItems(["media_player"])}
                                    @value-changed=${r=>this._onArtworkMatchValueChange(s,r.detail.value)}
                                    allow-custom-value
                                  ></ha-generic-picker>
                                `:m`
                                  <ha-textfield
                                    class="full-width"
                                    label="${h("editor.fields.match_value")}"
                                    .value=${a.match_value??""}
                                    @input=${r=>this._onArtworkMatchValueChange(s,r.target.value)}
                                  ></ha-textfield>
                                `}
                        <ha-textfield
                          class="full-width"
                          label=${a.match_type==="missing_art"?h("editor.fields.fallback_image_url"):h("editor.fields.image_url")}
                          .value=${a.image_url??""}
                          @input=${r=>this._onArtworkImageUrlChange(s,r.target.value)}
                        ></ha-textfield>
                        <div class="form-row-multi-column" style="gap:12px; flex-wrap:wrap; align-items:flex-start;">
                          <div class="grow-children" style="flex:1;">
                            <ha-textfield
                              class="full-width"
                              label="${h("editor.fields.size_percent")}"
                              type="number"
                              min="1"
                              max="100"
                              .value=${a.size_percentage??""}
                              @input=${r=>this._onArtworkSizePercentageChange(s,r.target.value)}
                            ></ha-textfield>
                          </div>
                          <div class="grow-children" style="flex:1.5;">
                            <ha-selector
                              .hass=${this.hass}
                              label="${h("editor.fields.object_fit")}"
                              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:"Default"},{value:"cover",label:"Cover"},{value:"contain",label:"Contain"},{value:"fill",label:"Fill"},{value:"scale-down",label:"Scale Down"},{value:"scaled-contain",label:"Scaled Contain"},{value:"none",label:"None"}]}}}
                              .value=${a.object_fit||"default"}
                              @value-changed=${r=>this._onArtworkObjectFitChange(s,r.detail.value)}
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
                  `):m`<div class="config-subtitle" style="padding:12px 0;text-align:center;">${h("editor.subtitles.no_artwork_overrides")}</div>`}
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="${h("editor.titles.add_artwork_override")}"
              @click=${this._addArtworkOverride}
            ></ha-icon>
          </div>
        </div>
        </div>

      `}_renderActiveTab(){switch(this._activeTab){case"entities":return this._renderEntitiesTab();case"behavior":return this._renderBehaviorTab();case"look_and_feel":return this._renderVisualTab();case"artwork":return this._renderArtworkTab();case"actions":return this._renderActionsTab();default:return this._renderEntitiesTab()}}_renderEntitiesTab(){if(!this._config)return m``;let e=[...this._config.entities??[]];return(e.length===0||e[e.length-1].entity_id)&&e.push({entity_id:""}),m`
        <div class="entity-group">
          <div class="entity-group-header section-header">
            <div class="entity-group-title section-title">${h("editor.sections.entities.title")}</div>
            <div class="section-description">${h("editor.sections.entities.description")}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${t=>this._onEntityMoved(t)}>
              <div class="sortable-container">
                ${e.map((t,a)=>m`
                  <div class="entity-row-inner ${a<e.length-1?"sortable-item":""}" data-index="${a}">
                    <div class="handle ${a===e.length-1?"handle-disabled":""}">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    <div class="grow-children">
                      <ha-generic-picker
                        class="full-width"
                        style="display: block; width: 100%;"
                        .hass=${this.hass}
                        .value=${t.entity_id||""}
                        .label=${h("common.media_player")}
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
                        title="${h("common.edit_entity")}"
                        @click=${()=>this._onEditEntity(a)}
                      ></ha-icon>
                    </div>
                  </div>
                `)}
              </div>
            </yamp-sortable>
          </div>
        </div>
      `}_renderBehaviorTab(){const e=Number(this._config.search_results_limit)>100;return m`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.behavior.idle_chips.title")}</div>
            <div class="section-description">${h("editor.sections.behavior.idle_chips.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{number:{min:0,step:1e3,unit_of_measurement:"ms",mode:"box"}}}
                .value=${this._config.idle_timeout_ms??6e4}
                label="${h("editor.fields.idle_timeout")}"
                @value-changed=${t=>this._updateConfig("idle_timeout_ms",t.detail.value)}
              ></ha-selector>
              <div class="config-subtitle">${h("editor.subtitles.idle_timeout")}</div>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${h("common.reset_default")}"
              @click=${()=>this._updateConfig("idle_timeout_ms",6e4)}
            ></ha-icon>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"auto",label:"Auto"},{value:"always",label:"Always"},{value:"in_menu",label:"In Menu"},{value:"in_menu_on_idle",label:"In Menu on Idle"}]}}}
              .value=${this._config.show_chip_row??"auto"}
              label="${h("editor.fields.show_chip_row")}"
              @value-changed=${t=>this._updateConfig("show_chip_row",t.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${h("editor.subtitles.show_chip_row")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dim-chips-on-idle-toggle"
                .checked=${this._config.dim_chips_on_idle??!0}
                @change=${t=>this._updateConfig("dim_chips_on_idle",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.dim_chips")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.dim_chips")}</div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.behavior.interactions_search.title")}</div>
            <div class="section-description">${h("editor.sections.behavior.interactions_search.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="always-show-quick-group-toggle"
                .checked=${this._config.always_show_quick_group??!1}
                @change=${t=>this._updateConfig("always_show_quick_group",t.target.checked)}
              ></ha-switch>
              <label for="always-show-quick-group-toggle">${h("editor.labels.always_show_group")}</label>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.always_show_group")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="hold-to-pin-toggle"
                .checked=${this._config.hold_to_pin??!1}
                @change=${t=>this._updateConfig("hold_to_pin",t.target.checked)}
              ></ha-switch>
              <label for="hold-to-pin-toggle">${h("editor.labels.hold_to_pin")}</label>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.hold_to_pin")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.disable_autofocus??!1}
                @change=${t=>this._updateConfig("disable_autofocus",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.disable_autofocus")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.disable_autofocus")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.keep_filters_on_search??!1}
                @change=${t=>this._updateConfig("keep_filters_on_search",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.keep_filters")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.search_within_filter")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dismiss-search-on-play-toggle"
                .checked=${this._config.dismiss_search_on_play??!0}
                @change=${t=>this._updateConfig("dismiss_search_on_play",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.dismiss_on_play")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.close_search_on_play")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div style="${this._config.entities?.length===1&&this._config.always_collapsed===!0&&this._config.expand_on_search!==!0?"opacity: 0.5;":""}"
              title="${this._config.entities?.length===1&&this._config.always_collapsed===!0&&this._config.expand_on_search!==!0?"Not available with one entity in Always Collapsed mode unless Expand on Search is enabled":""}">
              <ha-switch
                id="pin-search-headers-toggle"
                .checked=${this._config.pin_search_headers??!1}
                @change=${t=>this._updateConfig("pin_search_headers",t.target.checked)}
                .disabled=${this._config.entities?.length===1&&this._config.always_collapsed===!0&&this._config.expand_on_search!==!0}
              ></ha-switch>
              <span>${h("editor.labels.pin_headers")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.pin_search_headers")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="hide-search-headers-on-idle-toggle"
                .checked=${this._config.hide_search_headers_on_idle??!1}
                @change=${t=>this._updateConfig("hide_search_headers_on_idle",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.hide_search_headers_on_idle")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.hide_search_headers_on_idle")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="disable-mass-queue-toggle"
                .checked=${this._config.disable_mass_queue??!1}
                @change=${t=>this._updateConfig("disable_mass_queue",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.disable_mass")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.disable_mass")}</div>
          </div>
            <div class="form-row form-row-multi-column">
              <div class="grow-children number-input-with-note">
                <ha-selector-number
                  .selector=${{number:{min:0,max:1e3,step:1,mode:"box"}}}
                  .value=${this._config.search_results_limit??20}
                  label="${h("editor.fields.search_limit")}"
                  helper="${h("editor.subtitles.search_limit_full")}"
                  @value-changed=${t=>this._updateConfig("search_results_limit",t.detail.value)}
                ></ha-selector-number>
                ${e?m`
                  <div class="config-subtitle warning">
                    Warning: requesting higher results can cause performance issues.
                  </div>
                `:b}
            </div>
            <ha-icon
              class="icon-button"
              id="search-limit-reset"
              icon="mdi:restore"
              title="${h("common.reset_default")}"
              @click=${()=>this._updateConfig("search_results_limit",20)}
            ></ha-icon>
          </div>

          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"all",label:h("search.filters.all")},{value:"artist",label:h("search.filters.artist")},{value:"album",label:h("search.filters.album")},{value:"track",label:h("search.filters.track")},{value:"playlist",label:h("search.filters.playlist")},{value:"radio",label:h("search.filters.radio")},{value:"podcast",label:h("search.filters.podcast")},{value:"audiobook",label:h("search.filters.audiobook")}]}}}
              .value=${this._config.default_search_filter??"all"}
              label="${h("editor.labels.default_search_filter")}"
              helper="${h("editor.subtitles.default_search_filter_full")}"
              @value-changed=${t=>this._updateConfig("default_search_filter",t.detail.value)}
            ></ha-selector>
          </div>

          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:"Default"},{value:"name",label:"Name (A\u2192Z)"},{value:"name_desc",label:"Name (Z\u2192A)"},{value:"sort_name",label:"Sort Name (A\u2192Z)"},{value:"sort_name_desc",label:"Sort Name (Z\u2192A)"},{value:"timestamp_added",label:"Date Added (Oldest)"},{value:"timestamp_added_desc",label:"Date Added (Newest)"},{value:"last_played",label:"Last Played (Oldest)"},{value:"last_played_desc",label:"Last Played (Recent)"},{value:"play_count",label:"Play Count (Low\u2192High)"},{value:"play_count_desc",label:"Play Count (High\u2192Low)"},{value:"year",label:"Year (Oldest)"},{value:"year_desc",label:"Year (Newest)"},{value:"position",label:"Position (Asc)"},{value:"position_desc",label:"Position (Desc)"},{value:"artist_name",label:"Artist (A\u2192Z)"},{value:"artist_name_desc",label:"Artist (Z\u2192A)"},{value:"random",label:"Random"},{value:"random_play_count",label:"Random + Least Played"}]}}}
              .value=${this._config.search_results_sort??"default"}
              label="${h("editor.fields.result_sorting")}"
              helper="${h("editor.subtitles.result_sorting_full")}"
              @value-changed=${t=>this._updateConfig("search_results_sort",t.detail.value)}
            ></ha-selector>
          </div>
        </div>
      `}_renderVisualTab(){const e=this._config.volume_mode==="stepper"?m`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{number:{min:.01,max:1,step:.01,unit_of_measurement:"",mode:"box"}}}
                .value=${this._config.volume_step??.05}
                label="${h("editor.fields.vol_step")}"
                @value-changed=${t=>this._updateConfig("volume_step",t.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${h("common.reset_default")}"
              @click=${()=>this._updateConfig("volume_step",.05)}
            ></ha-icon>
          </div>
        `:b;return m`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.look_and_feel.theme_layout.title")}</div>
            <div class="section-description">${h("editor.sections.look_and_feel.theme_layout.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="match-theme-toggle"
                .checked=${this._config.match_theme??!1}
                @change=${t=>this._updateConfig("match_theme",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.match_theme")}</span>
            </div>
            <div>
              <ha-switch
                id="alternate-progress-bar-toggle"
                .checked=${this._config.alternate_progress_bar??!1}
                @change=${t=>this._updateConfig("alternate_progress_bar",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.alt_progress")}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div title=${this._config.alternate_progress_bar||this._config.always_collapsed?h("editor.subtitles.not_available_alt_collapsed"):""}>
              <ha-switch
                id="display-timestamps-toggle"
                .checked=${this._config.display_timestamps??!1}
                @change=${t=>this._updateConfig("display_timestamps",t.target.checked)}
                .disabled=${this._config.alternate_progress_bar||this._config.always_collapsed}
              ></ha-switch>
              <span>${h("editor.labels.display_timestamps")}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-textfield
                class="full-width"
                type="number"
                min="0"
                label="${h("editor.fields.card_height")}"
                .value=${this._config.card_height??""}
                helper="${h("editor.subtitles.card_height_full")}"
                .helperPersistent=${!0}
                @input=${t=>{const a=t.target.value;if(a===""){this._updateConfig("card_height",void 0);return}const s=Number(a);this._updateConfig("card_height",Number.isFinite(s)&&s>0?s:void 0)}}
              ></ha-textfield>
            </div>
            <ha-icon
                class="icon-button"
                icon="mdi:restore"
                title="${h("common.reset_default")}"
                @click=${()=>this._updateConfig("card_height",void 0)}
              ></ha-icon>
            </div>
            <div class="form-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:[{value:"list",label:h("editor.search_view_options.list")},{value:"card",label:h("editor.search_view_options.card")}]}}}
                .value=${this._config.search_view??"list"}
                label="${h("editor.fields.search_view")}"
                helper="${h("editor.subtitles.search_view")}"
                @value-changed=${t=>this._updateConfig("search_view",t.detail.value)}
              ></ha-selector>
            </div>
            ${this._config.search_view==="card"?m`
              <div class="form-row">
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{number:{min:1,max:12,step:1,mode:"box"}}}
                  .value=${this._config.search_card_columns??4}
                  label="${h("editor.fields.search_card_columns")}"
                  helper="${h("editor.subtitles.search_card_columns")}"
                  @value-changed=${t=>this._updateConfig("search_card_columns",t.detail.value)}
                ></ha-selector>
              </div>
            `:b}
          </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.look_and_feel.controls_typography.title")}</div>
            <div class="section-description">${h("editor.sections.look_and_feel.controls_typography.description")}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"classic",label:"Classic"},{value:"modern",label:"Modern"}]}}}
              .value=${this._config.control_layout??"classic"}
              label="${h("editor.fields.control_layout")}"
              helper="${h("editor.subtitles.control_layout_full")}"
              @value-changed=${t=>this._updateConfig("control_layout",t.detail.value)}
            ></ha-selector>
          </div>
          <div class="form-row"
            style="${(this._config.control_layout??"classic")==="modern"?"":"opacity: 0.5;"}"
            title="${(this._config.control_layout??"classic")==="modern"?"":h("editor.subtitles.only_available_modern")}"}>
            <div>
              <ha-switch
                .checked=${this._config.swap_pause_for_stop??!1}
                @change=${t=>this._updateConfig("swap_pause_for_stop",t.target.checked)}
                .disabled=${(this._config.control_layout??"classic")!=="modern"}
              ></ha-switch>
              <span>${h("editor.labels.swap_pause_stop")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.swap_pause_stop")}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="adaptive-controls-toggle"
                .checked=${this._config.adaptive_controls??!1}
                @change=${t=>this._updateConfig("adaptive_controls",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.adaptive_controls")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.adaptive_controls")}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="hide-active-entity-label-toggle"
                .checked=${this._config.hide_active_entity_label??!1}
                @change=${t=>this._updateConfig("hide_active_entity_label",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.hide_active_entity")}</span>
            </div>
            <div class="config-subtitle">${h("editor.subtitles.hide_menu_player")}</div>
          </div>
        <div class="form-row">
          <div class="full-width">
            <span class="form-label">${h("editor.labels.adaptive_text_elements")}</span>
            <div class="config-subtitle">${h("editor.subtitles.adaptive_text")}</div>
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{multiple:!0,options:Zr}}}
              .value=${this._getAdaptiveTextTargetsValue()}
              @value-changed=${t=>this._onAdaptiveTextTargetsChanged(t.detail.value)}
            ></ha-selector>
          </div>
        </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"slider",label:"Slider"},{value:"stepper",label:"Stepper"},{value:"hidden",label:"Hidden"}]}}}
              .value=${this._config.volume_mode??"slider"}
              label="${h("editor.fields.volume_mode")}"
              @value-changed=${t=>this._updateConfig("volume_mode",t.detail.value)}
            ></ha-selector>
          </div>
          ${e}
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${h("editor.sections.look_and_feel.collapsed_idle.title")}</div>
            <div class="section-description">${h("editor.sections.look_and_feel.collapsed_idle.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="collapse-on-idle-toggle"
                .checked=${this._config.collapse_on_idle??!1}
                @change=${t=>this._updateConfig("collapse_on_idle",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.collapse_on_idle")}</span>
            </div>
            <div style="${this._config.always_collapsed?"opacity: 0.5;":""}"
              title="${this._config.always_collapsed?h("editor.subtitles.not_available_collapsed"):""}">
              <ha-switch
                id="hide-menu-player-toggle"
                .checked=${this._config.hide_menu_player??!1}
                @change=${t=>this._updateConfig("hide_menu_player",t.target.checked)}
                .disabled=${!!this._config.always_collapsed||this._config.always_collapsed===!0&&this._config.pin_search_headers===!0&&this._config.expand_on_search===!0}
              ></ha-switch>
              <span>${h("editor.labels.hide_menu_player_toggle")}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="always-collapsed-toggle"
                .checked=${this._config.always_collapsed??!1}
                @change=${t=>this._updateConfig("always_collapsed",t.target.checked)}
              ></ha-switch>
              <span>${h("editor.labels.always_collapsed")}</span>
            </div>
            <div style="${this._config.always_collapsed?"":"opacity: 0.5;"}"
              title="${this._config.always_collapsed?"":h("editor.subtitles.only_available_collapsed")}">
              <ha-switch
                id="expand-on-search-toggle"
                .checked=${this._config.expand_on_search??!1}
                @change=${t=>this._updateConfig("expand_on_search",t.target.checked)}
                .disabled=${!this._config.always_collapsed}
              ></ha-switch>
              <span>${h("editor.labels.expand_on_search")}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="config-subtitle">${h("editor.subtitles.collapse_expand")}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:"Default"},{value:"search",label:"Search"},{value:"search-recently-played",label:"Recently Played"},{value:"search-next-up",label:"Next Up"}]}}}
              .value=${this._config.idle_screen??"default"}
              label="${h("editor.fields.idle_screen")}"
              @value-changed=${t=>this._updateConfig("idle_screen",t.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${h("editor.subtitles.idle_screen")}</div>
          </div>
        </div>

      `}_renderActionsTab(){let e=[...this._config.actions??[]];return m`
        <div class="action-group config-section">
          <div class="action-group-header section-header">
            <div class="action-group-title section-title">${h("editor.sections.actions.title")}</div>
            <div class="section-description">${h("editor.sections.actions.description")}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${t=>this._onActionMoved(t)}>
              <div class="sortable-container">
                ${e.map((t,a)=>m`
                  <div class="action-row-inner sortable-item">
                    <div class="handle action-handle">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    ${t?.icon?m`
                      <ha-icon class="action-icon" icon="${t?.icon}" title="Action Icon"></ha-icon>
                    `:m`<span class="action-icon-placeholder"></span>`}
                    <div class="grow-children">
                      <ha-textfield
                        placeholder="(Icon Only)"
                        .value=${t?.name??""}
                        .helper=${this._getActionHelperText(t)}
                        .helperPersistent=${!0}
                        @input=${s=>this._onActionChanged(a,s.target.value)}
                      ></ha-textfield>
                    </div>
                    <div class="action-row-actions">
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:pencil"
                        title="${h("common.edit_action")}"
                        @click=${()=>this._onEditAction(a)}
                      ></ha-icon>
                      ${t?.action!=="sync_selected_entity"?m`
                      <ha-icon
                        class="icon-button icon-button-compact icon-button-toggle ${t?.in_menu==="hidden"?"icon-button-disabled":t?.in_menu===!0?"active":""}"
                        icon="${t?.in_menu===!0?"mdi:menu":t?.in_menu==="hidden"?t?.card_trigger&&t.card_trigger!=="none"?"mdi:image-outline":"mdi:eye-off-outline":"mdi:view-grid-outline"}"
                        title="${t?.in_menu==="hidden"?t?.card_trigger&&t.card_trigger!=="none"?h("editor.placements.hidden"):`${h("editor.placements.hidden")} (${h("editor.placements.not_triggerable")})`:t?.in_menu?h("editor.fields.move_to_main"):h("editor.fields.move_to_menu")}"
                        role="button"
                        aria-label="${t?.in_menu===!0?h("editor.fields.move_to_main"):h("editor.fields.move_to_menu")}"
                        @click=${()=>{t?.in_menu!=="hidden"&&this._toggleActionInMenu(a)}}
                      ></ha-icon>
                      `:m`
                      <ha-icon
                        class="icon-button icon-button-compact icon-button-disabled"
                        icon="mdi:eye-off-outline"
                        title="${h("editor.action_types.sync_selected_entity")}"
                      ></ha-icon>
                      `}
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:trash-can"
                        title="${h("editor.fields.delete_action")}"
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
      `}_renderEntityEditor(e){const t=this.hass?.states?.[e?.entity_id],a=this._isGroupCapable(t);return m`
        <div class="entity-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            title="${h("common.back")}"
            @click=${this._onBackFromEntityEditor}>
          </ha-icon>
          <div class="entity-editor-title">${h("editor.titles.edit_entity")}</div>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{entity:{domain:"media_player"}}}
            .value=${e?.entity_id??""}
          
            disabled
          ></ha-selector>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="${h("editor.fields.name")}"
            .value=${e?.name??""}
            @input=${s=>this._updateEntityProperty("name",s.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",multiple:!0,options:[{value:"previous",label:"Previous Track"},{value:"play_pause",label:"Play/Pause"},{value:"stop",label:"Stop"},{value:"next",label:"Next Track"},{value:"shuffle",label:"Shuffle"},{value:"repeat",label:"Repeat"},{value:"favorite",label:"Favorite"},{value:"power",label:"Power"}]}}}
            .value=${Array.isArray(e?.hidden_controls)?e.hidden_controls:[]}
            .required=${!1}
            .invalid=${!1}
            label="${h("editor.fields.hidden_controls")}"
            helper="${h("editor.subtitles.hide_controls")}"
            @value-changed=${s=>this._updateEntityProperty("hidden_controls",s.detail.value)}
          ></ha-selector>
        </div>

 

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="ma-template-toggle"
              .checked=${this._useTemplate??this._looksLikeTemplate(e?.music_assistant_entity)}
              @change=${s=>{this._useTemplate=s.target.checked}}
            ></ha-switch>
            <label for="ma-template-toggle">${h("editor.labels.use_ma_template")}</label>
          </div>
        </div>

        ${this._useTemplate??this._looksLikeTemplate(e?.music_assistant_entity)?m`
      <div class="form-row">
        <div class=${this._yamlError&&(e?.music_assistant_entity??"").trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}>
          <ha-code-editor
            id="ma-template-editor"
            label="${h("editor.fields.ma_template")}"
            .hass=${this.hass}
            mode="jinja2"
            autocomplete-entities
            .value=${e?.music_assistant_entity??""}
            @value-changed=${s=>this._updateEntityProperty("music_assistant_entity",s.detail.value)}
          ></ha-code-editor>
          <div class="help-text">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            ${h("editor.subtitles.jinja_template_hint")}
            <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_select.kitchen_stream_source','Music Stream 1') %}
  media_player.picore_house
{% else %}
  media_player.ma_wiim_mini
{% endif %}</pre>
           </pre>
          </div>
        </div>
      </div>
    `:m`
      <div class="form-row">
        <ha-generic-picker
          .hass=${this.hass}
          .value=${this._isEntityId(e?.music_assistant_entity)?e.music_assistant_entity:""}
          .label=${h("editor.fields.ma_entity")}
          .valueRenderer=${s=>this._entityValueRenderer(s)}
          .rowRenderer=${s=>this._entityRowRenderer(s)}
          .getItems=${this._getEntityItems(["media_player"])}
          @value-changed=${s=>this._updateEntityProperty("music_assistant_entity",s.detail.value)}
          allow-custom-value
        ></ha-generic-picker>
      </div>
      ${(()=>{const s=e?.entity_id,r=s?this.hass?.states?.[s]:void 0,n=r?tt(r):!1,o=e?.music_assistant_entity,l=this._looksLikeTemplate?.(o),c=typeof o=="string"&&!l?o:void 0,u=c?this.hass?.states?.[c]:void 0,d=u?tt(u):!1;return n||d?m`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",multiple:!0,options:[{value:"artist",label:"Artist"},{value:"album",label:"Album"},{value:"track",label:"Track"},{value:"playlist",label:"Playlist"},{value:"radio",label:"Radio"},{value:"podcast",label:"Podcast"},{value:"episode",label:"Episode"}]}}}
              .value=${Array.isArray(e?.hidden_filter_chips)?e.hidden_filter_chips:[]}
              .required=${!1}
              .invalid=${!1}
              label="${h("editor.fields.hidden_chips")}"
              helper="${h("editor.subtitles.hide_search_chips")}"
              @value-changed=${p=>this._updateEntityProperty("hidden_filter_chips",p.detail.value)}
            ></ha-selector>
          </div>
        `:b})()}
    `}

        <div class="form-row">
          <ha-switch
            id="disable-auto-select-toggle"
            .checked=${e?.disable_auto_select??!1}
            @change=${s=>this._updateEntityProperty("disable_auto_select",s.target.checked)}
          ></ha-switch>
          <label for="disable-auto-select-toggle">${h("editor.labels.disable_auto_select")}</label>
          <div class="config-subtitle">${h("editor.subtitles.disable_auto_select")}</div>
        </div>

        ${a?m`
          <div class="form-row">
            <ha-switch
              id="group-volume-toggle"
              .checked=${e?.group_volume??!0}
              @change=${s=>this._updateEntityProperty("group_volume",s.target.checked)}
            ></ha-switch>
            <label for="group-volume-toggle">Group Volume</label>
          </div>
        `:b}

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="follow-active-toggle"
              .checked=${e?.follow_active_volume??!1}
              @change=${s=>this._updateEntityProperty("follow_active_volume",s.target.checked)}
            ></ha-switch>
            <label for="follow-active-toggle">${h("editor.labels.follow_active_entity")}</label>
          </div>
          ${e?.follow_active_volume??!1?b:m`
            <div>
              <ha-switch
                id="vol-template-toggle"
                .checked=${this._useVolTemplate??this._looksLikeTemplate(e?.volume_entity)}
                @change=${s=>{this._useVolTemplate=s.target.checked}}
              ></ha-switch>
              <label for="vol-template-toggle">${h("editor.labels.use_vol_template")}</label>
            </div>
          `}
        </div>

        ${e?.follow_active_volume??!1?b:m`
          ${this._useVolTemplate??this._looksLikeTemplate(e?.volume_entity)?m`
                <div class="form-row">
                  <div class=${this._yamlError&&(e?.volume_entity??"").trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}>
                    <ha-code-editor
                      id="vol-template-editor"
                      label="${h("editor.fields.vol_template")}"
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      .value=${e?.volume_entity??""}
                      @value-changed=${s=>this._updateEntityProperty("volume_entity",s.detail.value)}
                    ></ha-code-editor>
                    <div class="help-text">
                      <ha-icon icon="mdi:information-outline"></ha-icon>
                      ${h("editor.subtitles.jinja_template_vol_hint")}
                      <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_boolean.tv_volume','on') %}
  remote.soundbar
{% else %}
  media_player.office_homepod
{% endif %}</pre>
                    </div>
                  </div>
                </div>
              `:m`
                <div class="form-row">
                  <ha-generic-picker
                    .hass=${this.hass}
                    .value=${this._isEntityId(e?.volume_entity)?e.volume_entity:e?.entity_id??""}
                    .label=${h("editor.fields.vol_entity")}
                    .valueRenderer=${s=>this._entityValueRenderer(s)}
                    .rowRenderer=${s=>this._entityRowRenderer(s)}
                    .getItems=${this._getEntityItems(["media_player","remote"])}
                    @value-changed=${s=>{const r=s.detail.value;this._updateEntityProperty("volume_entity",r),(!r||r===e.entity_id)&&this._updateEntityProperty("sync_power",!1)}}
                    allow-custom-value
                  ></ha-generic-picker>
                </div>
              `}
        `}

        ${e?.volume_entity&&e.volume_entity!==e.entity_id&&!(e?.follow_active_volume??!1)?m`
              <div class="form-row form-row-multi-column">
                <div>
                  <ha-switch
                    id="sync-power-toggle"
                    .checked=${e?.sync_power??!1}
                    @change=${s=>this._updateEntityProperty("sync_power",s.target.checked)}
                  ></ha-switch>
                  <label for="sync-power-toggle">Sync Power</label>
                </div>
              </div>
            `:b}

        ${e?.follow_active_volume?m`
            <div class="help-text">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              ${h("editor.subtitles.follow_active_entity")}
              <br><br>
            </div>
        `:b}
        </div>
      `}_renderActionEditor(e){const t=this._actionMode??this._deriveActionMode(e);return m`
        <div class="action-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromActionEditor}>
          </ha-icon>
          <div class="action-editor-title">${h("editor.titles.edit_action")}</div>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="${h("editor.fields.name")}"
            placeholder="(Icon Only)"
            .value=${e?.name??""}
            @input=${a=>this._updateActionProperty("name",a.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="${h("editor.fields.icon")}"
            .hass=${this.hass}
            .value=${e?.icon??""}
            @value-changed=${a=>this._updateActionProperty("icon",a.detail.value)}
          ></ha-icon-picker>
        </div>
 
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${h("editor.fields.placement")}"
              .disabled=${t==="sync_selected_entity"}
              .selector=${{select:{mode:"dropdown",options:[{value:"chip",label:h("editor.placements.chip")},{value:"menu",label:h("editor.placements.menu")},{value:"hidden",label:h("editor.placements.hidden")}]}}}
              .value=${e?.in_menu==="hidden"?"hidden":e?.in_menu?"menu":"chip"}
              @value-changed=${a=>{const s=a.detail.value;let r=!1;s==="menu"?r=!0:s==="hidden"&&(r="hidden"),this._updateActionProperty("in_menu",r),s!=="hidden"&&this._updateActionProperty("card_trigger","none")}}
            ></ha-selector>
          </div>
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${h("editor.fields.card_trigger")}"
              .disabled=${t==="sync_selected_entity"||e?.in_menu!=="hidden"}
              .selector=${{select:{mode:"dropdown",options:[{value:"none",label:h("editor.triggers.none")},{value:"tap",label:h("editor.triggers.tap")},{value:"hold",label:h("editor.triggers.hold")},{value:"double_tap",label:h("editor.triggers.double_tap")},{value:"swipe_left",label:h("editor.triggers.swipe_left")},{value:"swipe_right",label:h("editor.triggers.swipe_right")}]}}}
              .value=${e?.card_trigger||"none"}
              @value-changed=${a=>this._updateActionProperty("card_trigger",a.detail.value)}
            ></ha-selector>
          </div>
        </div>
        ${e?.in_menu==="hidden"&&(!e?.card_trigger||e?.card_trigger==="none")&&t!=="sync_selected_entity"?m`
          <div class="help-text">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${h("editor.placements.hidden")} (${h("editor.placements.not_triggerable")})
          </div>
        `:b}

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="${h("editor.fields.action_type")}"
            .selector=${{select:{mode:"dropdown",options:[{value:"menu",label:h("editor.action_types.menu")},{value:"service",label:h("editor.action_types.service")},{value:"navigate",label:h("editor.action_types.navigate")},{value:"sync_selected_entity",label:h("editor.action_types.sync_selected_entity")}]}}}
            .value=${this._actionMode??this._deriveActionMode(e)}
            @value-changed=${a=>{const s=a.detail.value;this._actionMode=s,s==="service"?(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action",void 0),this._config.actions?.[this._actionEditorIndex]?.service||this._updateActionProperty("service","")):s==="menu"?(this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action",void 0)):s==="navigate"?(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("action","navigate"),e?.navigation_path||this._updateActionProperty("navigation_path","")):s==="sync_selected_entity"&&(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action","sync_selected_entity"),this._updateActionProperty("in_menu","hidden"),this._updateActionProperty("card_trigger","none"),e?.sync_entity_type||this._updateActionProperty("sync_entity_type","yamp_entity"))}}
          ></ha-selector>
        </div>

        
        ${t==="menu"?m`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${h("editor.fields.menu_item")}"
              .selector=${{select:{mode:"dropdown",options:[{value:"",label:""},{value:"search",label:"Search"},{value:"search-recently-played",label:"Recently Played"},{value:"search-next-up",label:"Next Up"},{value:"source",label:"Source"},{value:"more-info",label:"More Info"},{value:"group-players",label:"Group Players"},{value:"transfer-queue",label:"Transfer Queue"}]}}}
              .value=${e?.menu_item??""}
              @value-changed=${a=>this._updateActionProperty("menu_item",a.detail.value||void 0)}
            ></ha-selector>
          </div>
        `:b} 
        ${t==="navigate"?m`
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${h("editor.fields.nav_path")}"
              placeholder="/lovelace/music or #popup"
              .value=${e?.navigation_path??""}
              @input=${a=>{this._updateActionProperty("navigation_path",a.target.value),this._updateActionProperty("action","navigate")}}
            ></ha-textfield>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="navigation-new-tab-toggle"
                .checked=${e?.navigation_new_tab??!1}
                @change=${a=>this._updateActionProperty("navigation_new_tab",a.target.checked)}
              ></ha-switch>
              <label for="navigation-new-tab-toggle">Open External URLs in New Tab</label>
            </div>
          </div>
          <div class="form-row">
            <div class="config-subtitle">Supports dashboard paths, URLs, and anchors (e.g., <code>/lovelace/music</code> or <code>#pop-up-menu</code>).</div>
          </div>
        `:b}
        ${t==="sync_selected_entity"?m`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{entity:{domain:"input_text"}}}
              .value=${e?.sync_entity_helper??""}
              label="${h("editor.fields.selected_entity_helper")}"
              @value-changed=${a=>this._updateActionProperty("sync_entity_helper",a.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${h("editor.subtitles.selected_entity_helper")}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${h("editor.fields.sync_entity_type")}"
              .selector=${{select:{mode:"dropdown",options:[{value:"yamp_entity",label:h("editor.sync_entity_options.yamp_entity")},{value:"yamp_main_entity",label:h("editor.sync_entity_options.yamp_main_entity")},{value:"yamp_playback_entity",label:h("editor.sync_entity_options.yamp_playback_entity")}]}}}
              .value=${e?.sync_entity_type??"yamp_entity"}
              @value-changed=${a=>this._updateActionProperty("sync_entity_type",a.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${h("editor.subtitles.sync_entity_type")}</div>
          </div>
        `:b}
        ${t==="service"?m`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",filterable:!0,options:this._serviceItems||[]}}}
              .value=${e.service??""}
              label="${h("editor.fields.service")}"
              .required=${!0}
              @value-changed=${a=>this._updateActionProperty("service",a.detail.value)}
            ></ha-selector>
          </div>

          ${typeof e.service=="string"&&e.service.startsWith("script.")?m`
            <div class="form-row form-row-multi-column">
              <div>
                <ha-switch
                  id="script-variable-toggle"
                  .checked=${e?.script_variable??!1}
                  @change=${a=>this._updateActionProperty("script_variable",a.target.checked)}
                ></ha-switch>
                <span>${h("editor.labels.script_var")}</span>
              </div>
            </div>
          `:b}

          ${typeof e.service=="string"?m`
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>

              ${h("editor.subtitles.entity_current_hint")}

            </div>
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>
            ${h("editor.subtitles.service_data_note")}
            </div>
            <div class="form-row">
              <div class="service-data-editor-header">
                <div class="service-data-editor-title">${h("editor.titles.service_data")}</div>
                <div class="service-data-editor-actions">
                  <ha-icon
                    class="icon-button ${this._yamlModified?"":"icon-button-disabled"}"
                    icon="mdi:content-save"
                    title="${h("editor.fields.save_service_data")}"
                    @click=${this._saveYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${this._yamlModified?"":"icon-button-disabled"}"
                    icon="mdi:backup-restore"
                    title="${h("editor.fields.revert_service_data")}"
                    @click=${this._revertYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${this._yamlError||this._yamlDraftUsesCurrentEntity()||!e?.service?"icon-button-disabled":""}"
                    icon="mdi:play-circle-outline"
                    title="${h("editor.fields.test_action")}"
                    @click=${this._testServiceCall}
                  ></ha-icon>
              
                </div>
            </div>
            <div class=${this._yamlError&&this._yamlDraft.trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}>
              <ha-code-editor
                id="service-data-editor"
                label="${h("editor.fields.service_data")}"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                mode="yaml"
                .value=${e?.service_data?_t.dump(e.service_data):""}
                @value-changed=${a=>{this._yamlDraft=a.detail.value,this._yamlModified=!0;try{const s=_t.load(this._yamlDraft);s&&typeof s=="object"?this._yamlError=null:this._yamlError="Invalid YAML"}catch(s){this._yamlError=s.message}}}
              ></ha-code-editor>
              ${this._yamlError&&this._yamlDraft.trim()!==""?m`<div class="yaml-error-message">${this._yamlError}</div>`:b}
            </div>
          `:b}
        `:b}
      </div>`}_onEntityChanged(e,t){const a=[...this._config.entities??[]];t?a[e]={...a[e],entity_id:t}:a.splice(e,1);const s=a.filter(r=>r.entity_id&&r.entity_id.trim()!=="");this._updateConfig("entities",s)}_onActionChanged(e,t){const a=[...this._config.actions??[]];a[e]={...a[e],name:t},this._updateConfig("actions",a)}_getActionHelperText(e){const t=e?.in_menu,a=t==="hidden"?"hidden":t===!0?"menu":"chip",s=e?.card_trigger;let r="";a==="menu"?r=" \u2022 In Menu":a==="hidden"&&e?.action!=="sync_selected_entity"&&(!s||s==="none"?r=` \u2022 ${h("editor.placements.hidden")} (${h("editor.placements.not_triggerable")})`:r=` \u2022 ${h("editor.placements.hidden")}`);let n="";if(s&&s!=="none"&&(n=` \u2022 Trigger: ${h(`editor.triggers.${s}`)}`),e?.action==="sync_selected_entity")return`${h("editor.action_helpers.sync_selected_entity")} ${e.sync_entity_helper||h("editor.action_helpers.select_helper")}${r}${n}`;if(e?.menu_item)return`Open Menu Item: ${e.menu_item}${r}${n}`;if(e?.service)return`Call Service: ${e.service}${r}${n}`;if(e?.navigation_path||e?.action==="navigate"){const o=e?.navigation_new_tab?" (New Tab)":"";return`Navigate to ${e.navigation_path||"(missing path)"}${o}${r}${n}`}return r||n?`Not Configured${r}${n}`:"Not Configured"}_onEditEntity(e){this._entityEditorIndex=e;const t=this._config.entities?.[e],a=t?.music_assistant_entity;this._useTemplate=!!this._looksLikeTemplate(a);const s=t?.volume_entity;this._useVolTemplate=!!this._looksLikeTemplate(s)}_onEditAction(e){this._actionEditorIndex=e;const t=this._config.actions?.[e];this._actionMode=this._deriveActionMode(t),this._actionMode==="service"&&typeof t?.service!="string"&&this._updateActionProperty("service","")}_onBackFromEntityEditor(){this._entityEditorIndex=null,this._useTemplate=null,this._useVolTemplate=null}_onBackFromActionEditor(){this._actionEditorIndex=null,this._actionMode=null}_onEntityMoved(e){const{oldIndex:t,newIndex:a}=e.detail,s=[...this._config.entities];if(t>=s.length||a>=s.length)return;const[r]=s.splice(t,1);s.splice(a,0,r),this._updateConfig("entities",s)}_onActionMoved(e){const{oldIndex:t,newIndex:a}=e.detail,s=[...this._config.actions];if(t>=s.length||a>=s.length)return;const[r]=s.splice(t,1);s.splice(a,0,r),this._updateConfig("actions",s)}_removeAction(e){const t=[...this._config.actions??[]];e<0||e>=t.length||(t.splice(e,1),this._updateConfig("actions",t))}_toggleActionInMenu(e){const t=[...this._config.actions??[]];if(!t[e])return;const a=!!t[e].in_menu,s={...t[e],in_menu:!a};delete s.placement,t[e]=s,this._updateConfig("actions",t)}_saveYamlEditor(){try{const e=_t.load(this._yamlDraft);if(!e||typeof e!="object"){this._yamlError="YAML is not a valid object.";return}this._updateActionProperty("service_data",e),this._yamlDraft=_t.dump(e),this._yamlError=null,this._parsedYaml=e}catch(e){this._yamlError=e.message}}_revertYamlEditor(){const e=this.shadowRoot.querySelector("#service-data-editor"),t=this._config.actions?.[this._actionEditorIndex];if(!e||!t)return;const a=t.service_data?_t.dump(t.service_data):"";e.value=a,this._yamlDraft=a,this._yamlError=null,this._yamlModified=!1}_yamlDraftUsesCurrentEntity(){return this._yamlDraft?/^\s*entity_id\s*:\s*current\s*$/m.test(this._yamlDraft):!1}async _testServiceCall(){if(this._yamlError||!this._yamlDraft?.trim())return;let e;try{if(e=_t.load(this._yamlDraft),typeof e!="object"||e===null){console.error("yamp: Service data must be a valid object.");return}}catch(r){this._yamlError=r.message;return}const t=this._config.actions?.[this._actionEditorIndex]?.service;if(!t||!this.hass)return;const[a,s]=t.split(".");if(!(!a||!s))try{await this.hass.callService(a,s,e)}catch(r){console.error("yamp: Failed to call service:",r)}}_onToggleChanged(e){const t={...this._config,always_collapsed:e.target.checked};this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))}_looksLikeUrlOrPath(e){return e?e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")||e.includes(".jpg")||e.includes(".jpeg")||e.includes(".png")||e.includes(".gif")||e.includes(".webp"):!1}}customElements.define("yet-another-media-player-editor",Cd);var Td=Object.defineProperty,Md=(i,e,t)=>e in i?Td(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,He=(i,e,t)=>Md(i,typeof e!="symbol"?e+"":e,t);const Kr=Object.freeze(["details","menu","action_chips"]),Fd=Object.freeze([...Kr]),Dd=Object.freeze({details:"--yamp-text-scale-details",menu:"--yamp-text-scale-menu",action_chips:"--yamp-text-scale-action-chips"}),Xr=Object.freeze(["media_title","media_artist","media_album_name","media_content_id","media_channel","app_name","media_content_type","entity_id","entity_state"]),Jr=500,xt=15,en=300,jd=300,tn=50;window.customCards=window.customCards||[],window.customCards.push({type:"yet-another-media-player",name:"Yet Another Media Player",description:"YAMP is a multi-entity media card with custom actions",preview:!0});class Da extends et{constructor(){super(),He(this,"_hoveredSourceLetterIndex",null),He(this,"_lastGroupingMasterId",null),He(this,"_groupedSortedCache",null),He(this,"_cardTriggers",{tap:null,hold:null,double_tap:null,swipe_left:null,swipe_right:null}),He(this,"_lastHassVersion",null),He(this,"_debouncedVolumeTimer",null),this._selectedIndex=0,this._lastSyncedEntityId=null,this._lastPlaying=null,this._manualSelect=!1,this._lastActiveEntityId=null,this._playTimestamps={},this._lastMediaTitle=null,this._showSourceMenu=!1,this._shouldDropdownOpenUp=!1,this._collapsedArtDominantColor="#444",this._lastArtworkUrl=null,this._progressTimer=null,this._progressValue=null,this._lastProgressEntityId=null,this._pinnedIndex=null,this._customAccent="#ff9800",this._sourceDropdownOutsideHandler=null,this._isIdle=!1,this._idleTimeout=null,this._showEntityOptions=!1,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._hasTransferQueueForCurrent=!1,this._transferQueueAutoCloseTimer=null,this._alternateProgressBar=!1,this._groupBaseVolume=null,this._searchOpen=!1,this._searchQuery="",this._searchLoading=!1,this._searchResults=[],this._searchDisplaySortOverride=null,this._searchError="",this._searchTotalRows=15,this._searchResultsByType={},this._currentSearchQuery="",this._latestSearchToken=0,this._searchTimeoutHandle=null,this._latestSearchToken=0,this._searchTimeoutHandle=null,this._swapPauseForStop=!1,this._controlLayout="classic",this._searchHierarchy=[],this._searchBreadcrumb="",this._playbackLingerByIdx={},this._lastResolvedEntityIdByChip={},this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._showQueueSuccessMessage=!1,this._searchActiveOptionsItem=null,this._activeSearchRowMenuId=null,this._successSearchRowMenuId=null,this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._radioModeActive=!1,this._massQueueAvailable=!1,this._hasMassQueueIntegration=null,this._checkingMassQueueIntegration=!1,this._quickMenuInvoke=!1,this._collapsedBaselineHeight=220,this._lastRenderedCollapsed=!1,this._lastRenderedHideControls=!1,this._artworkObjectFit="cover",this._idleScreen="default",this._idleScreenApplied=!1,this._hasSeenPlayback=!1,this._adaptiveText=!1,this._textResizeObserver=null,this._currentTextScale=null,this._adaptiveTextTargets=new Set,this._idleImageTemplate=null,this._idleImageTemplateResult="",this._resolvingIdleImageTemplate=!1,this._idleImageTemplateNeedsResolve=!1,this._artworkOverrideTemplateCache={},this._artworkOverrideIndexMap=null,this._hideActiveEntityLabel=!1,this._currentDetailsScale=null,this._lastTitleLength=0,this._suspendAdaptiveScaling=!1,this._pendingAdaptiveScaleUpdate=!1,this._adaptiveScrollTimer=null,this._handleGlobalScroll=this._handleGlobalScroll.bind(this),this._handleViewportResize=this._handleViewportResize.bind(this),this._isNarrowViewport=!1,setTimeout(()=>{if(this.hass&&this.entityIds&&this.entityIds.length>0){const e=this.hass.states[this.entityIds[this._selectedIndex]],t=this._playbackLingerByIdx?.[this._selectedIndex]&&this._playbackLingerByIdx[this._selectedIndex].until>Date.now(),a=this._isEntityPlaying(e);e&&!a&&!t&&this._idleTimeoutMs>0&&(this._isIdle=!0,this.requestUpdate())}},0),this._prevCollapsed=null,this._searchAttempted=!1,this._searchMediaClassFilter="all",this._lastSearchChipClasses="",this._swipeStartX=null,this._searchSwipeAttached=!1,this._manualSelectPlayingSet=null,this._idleTimeoutMs=6e4,this._volumeStep=.05,this._searchInputAutoFocused=!1,this._disableSearchAutofocus=!1,this._optimisticPlayback=null,this._lastPlaybackEntityId=null,this._entitySwitchDebounceTimer=null,this._lastMainState=null,this._lastMaState=null,this._maResolveCache={},this._maResolveTtlMs=7e3,this._manualSelectTimeout=null,this._volResolveCache={},this._volResolveTtlMs=7e3,this._lastPlayingEntityId=null,this._controlFocusEntityId=null,this._lastActiveEntityIdByChip={},this._playerStateCache={}}_handleChipPointerDown(e,t){this._chipGestureStartX=e.clientX,this._chipGestureStartY=e.clientY,this._holdToPin&&this._holdHandler&&this._holdHandler.pointerDown(e,t)}_applyIdleScreen(){if(!this._idleScreenApplied){switch(this._idleScreen||"default"){case"search":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("default");break;case"search-recently-played":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("recently-played");break;case"search-next-up":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("next-up");break;default:return}this._idleScreenApplied=!0}}_resetIdleScreen(){if(this._idleScreenApplied){switch(this._idleScreen){case"search":case"search-recently-played":case"search-next-up":this._hideSearchSheetInOptions(),this._showEntityOptions=!1;break}this._idleScreenApplied=!1,this.requestUpdate()}}_handleChipPointerMove(e,t){this._holdToPin&&this._holdHandler&&this._holdHandler.pointerMove(e,t)}_handleChipPointerUp(e,t){if(this._holdToPin&&this._holdHandler&&this._holdHandler.pointerUp(e,t),e.pointerType!=="touch"&&e.pointerType!=="pen"||e.type!=="pointerup")return;const a=e.clientX-this._chipGestureStartX,s=e.clientY-this._chipGestureStartY,r=Math.abs(a),n=Math.abs(s);if(r>xt||n>xt)return;const o=Date.now(),l=o-(this._lastChipTapTime||0);this._lastChipTapTime=o,l<en&&this._lastChipTapIdx===t&&(this._lastChipTapTime=0,this._quickGroupingMode=!this._quickGroupingMode,this.requestUpdate()),this._lastChipTapIdx=t}_supportsFeature(e,t){return!e||typeof e.attributes.supported_features!="number"?!1:(e.attributes.supported_features&t)!==0}_isGroupCapable(e){return!e||e.attributes?.mass_player_type==="group"?!1:this._supportsFeature(e,Sr)?!0:Array.isArray(e.attributes?.group_members)}_isCurrentlyGrouped(e){return this._isGroupCapable(e)?Array.isArray(e?.attributes?.group_members)&&e.attributes.group_members.length>1:!1}_findAssociatedButtonEntities(e){return ro(this.hass,e)}_getFavoriteButtonEntity(){if(!this.entityObjs[this._selectedIndex])return null;const e=this._getActivePlaybackEntityId(this._selectedIndex);if(!e)return null;const t=this.hass?.states?.[e];return!t||!tt(t)?null:this._findAssociatedButtonEntities(e).find(a=>a.friendly_name.toLowerCase().includes("favorite")||a.friendly_name.toLowerCase().includes("like")||a.device_class==="favorite"||a.entity_id.toLowerCase().includes("favorite"))?.entity_id||null}_getMusicAssistantState(){const e=this._getActivePlaybackEntityId(this._selectedIndex);return e?no(this.hass,e):null}_isCurrentTrackFavorited(){if(!this.entityObjs[this._selectedIndex])return!1;const e=this._getMusicAssistantState();if(!e)return!1;const t=e.attributes?.media_content_id;if(!t)return!1;if(typeof e.attributes?.is_favorite=="boolean")return e.attributes.is_favorite;if(this._favoriteStatusCache&&this._favoriteStatusCache[t]!==void 0){const a=this._favoriteStatusCache[t];if(typeof a=="object"&&a.isFavorited!==void 0)return a.isFavorited;if(typeof a=="boolean")return a}return(!this._checkingFavorites||this._checkingFavorites!==t)&&(this._checkingFavorites=t,this._checkFavoriteStatusAsync(t)),!1}async _checkFavoriteStatusAsync(e){if(!(!e||!this.hass))try{const t=this._getMusicAssistantState(),a=t?.entity_id,s=t.attributes?.media_title,r=t.attributes?.media_artist,n=await Fo(this.hass,e,a,s,r,200);this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[e]={isFavorited:n},this._checkingFavorites=null,this.requestUpdate()}catch{this._checkingFavorites=null}}connectedCallback(){super.connectedCallback(),window.addEventListener("scroll",this._handleGlobalScroll,{passive:!0}),window.addEventListener("resize",this._handleViewportResize,{passive:!0}),this._updateViewportFlags(),this._updateAdaptiveTextObserverState()}_scrollToSourceLetter(e){const t=this.renderRoot.querySelector(".entity-options-sheet");if(!t)return;const a=Array.from(t.querySelectorAll(".entity-options-item")).find(s=>(s.textContent||"").trim().toUpperCase().startsWith(e));a&&a.scrollIntoView({behavior:"smooth",block:"center"})}_shouldShowStopButton(e){if(!this._supportsFeature(e,ed))return!1;const t=this.renderRoot?.querySelector(".controls-row");if(!t)return!0;const a=t.offsetWidth>480,s=!!this._getFavoriteButtonEntity()&&!this._getHiddenControlsForCurrentEntity().favorite,r=Zi(e,(n,o)=>this._supportsFeature(n,o),s,this._getHiddenControlsForCurrentEntity(),!0,this._controlLayout);return a||r<=5}_isAutoSelectDisabled(e){const t=this.config.entities[e];return typeof t=="string"?!1:!!t.disable_auto_select}get sortedEntityIds(){return this.entityIds.map((e,t)=>{const a=this._isAutoSelectDisabled(t)?0:this._playTimestamps[e]||0;return{id:e,idx:t,ts:a}}).sort((e,t)=>e.ts===t.ts?e.idx-t.idx:t.ts-e.ts).map(e=>e.id)}get groupedSortedEntityIds(){const e=this.entityIds;if(!e||!Array.isArray(e))return[];if(this._groupedSortedCache&&this.hass===this._lastHassVersion)return this._groupedSortedCache;const t=new Set(e),a={};for(let r=0;r<e.length;r++){const n=e[r];let o=this._getGroupKey(n);(this._quickGroupingMode||!t.has(o))&&(o=n),a[o]||(a[o]={ids:[],ts:0,minIdx:r}),a[o].ids.push(n);const l=this._isAutoSelectDisabled(r)?0:this._playTimestamps[n]||0;a[o].ts=Math.max(a[o].ts,l)}const s=Object.values(a).sort((r,n)=>n.ts===r.ts?r.minIdx-n.minIdx:n.ts-r.ts).map(r=>r.ids.sort());return this._groupedSortedCache=s,this._lastHassVersion=this.hass,s}async _ensureResolvedMaForIndex(e){const t=this.entityObjs?.[e];if(!t)return;const a=t.music_assistant_entity;if(!a||typeof a!="string"){delete this._maResolveCache[e];return}const s=a.includes("{{")||a.includes("{%"),r=Date.now(),n=this._maResolveCache[e];if(!s){this._maResolveCache[e]={id:a,ts:r};return}if(!(n&&r-n.ts<this._maResolveTtlMs&&n.id))try{const o=await this._resolveTemplateAtActionTime(a,t.entity_id);o&&typeof o=="string"&&(this._maResolveCache[e]={id:o,ts:r},this.requestUpdate())}catch{}}async _ensureResolvedVolForIndex(e){const t=this.entityObjs?.[e];if(!t)return;if(t.follow_active_volume){delete this._volResolveCache[e];return}const a=t.volume_entity;if(!a||typeof a!="string"){delete this._volResolveCache[e];return}const s=a.includes("{{")||a.includes("{%"),r=Date.now(),n=this._volResolveCache[e];if(!s){this._volResolveCache[e]={id:a,ts:r};return}if(!(n&&r-n.ts<this._volResolveTtlMs&&n.id))try{const o=await this._resolveTemplateAtActionTime(a,t.entity_id);o&&typeof o=="string"&&(this._volResolveCache[e]={id:o,ts:r},this.requestUpdate())}catch{}}_getResolvedPlaybackEntityIdSync(e){return this._getEntityForPurpose(e,"playback_control")}_getResolvedVolumeEntityIdSync(e){const t=this.entityObjs[e];if(!t)return null;if(t.follow_active_volume)return this._getActivePlaybackEntityId();const a=this._volResolveCache?.[e]?.id;if(a&&typeof a=="string")return a;const s=t.volume_entity;return s&&typeof s=="string"&&!(s.includes("{{")||s.includes("{%"))?s:t.entity_id}_getActualResolvedMaEntityForState(e){const t=this.entityObjs[e];if(!t)return null;const a=this._maResolveCache?.[e]?.id;if(a&&typeof a=="string")return a;const s=t.music_assistant_entity;return s&&typeof s=="string"&&!s.includes("{{")&&!s.includes("{%")?s:t.entity_id}_isEntityPlaying(e){if(!e)return!1;const t=e.state?.toLowerCase();return t==="playing"||t==="buffering"}_isCurrentEntityPlaying(){const e=this.currentEntityId,t=this._getActualResolvedMaEntityForState(this._selectedIndex),a=e?this.hass?.states?.[e]:null,s=t?this.hass?.states?.[t]:null;return this._isEntityPlaying(a)||this._isEntityPlaying(s)}async _resolveTemplateAtActionTime(e,t){return io(this.hass,e,t)}_attachSearchSwipe(){if(this._searchSwipeAttached)return;const e=this.renderRoot.querySelector(".entity-options-search-results");if(!e||this._searchHierarchy.length>0)return;this._searchSwipeAttached=!0;const t=40,a=r=>{r.touches.length===1&&(this._swipeStartX=r.touches[0].clientX)},s=r=>{if(this._swipeStartX===null)return;const n=r.changedTouches&&r.changedTouches[0].clientX||null;if(n===null){this._swipeStartX=null;return}const o=n-this._swipeStartX;if(Math.abs(o)>t){const l=new Set;Object.values(this._searchResultsByType).forEach(y=>{y.forEach(k=>{k.media_class&&l.add(k.media_class)})});const c=this.entityObjs?.[this._selectedIndex]||null,u=new Set(c?.hidden_filter_chips||[]),d=["all",...Array.from(l).filter(y=>!u.has(y))],p=d.indexOf(this._searchMediaClassFilter||"all"),_=o<0?1:-1;let f=(p+_+d.length)%d.length;const g=d[f];this._doSearch(g==="all"?null:g)}this._swipeStartX=null};e.addEventListener("touchstart",a,{passive:!0}),e.addEventListener("touchend",s,{passive:!0}),e._searchSwipeHandlers={touchstart:a,touchend:s}}_searchArtistFromNowPlaying(){const e=(this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj)?.attributes?.media_artist||"";e&&(this._showEntityOptions=!0,this._showSearchInSheet=!0,this._searchInputAutoFocused=!1,this._searchQuery=e,this._searchError="",this._searchAttempted=!1,this._searchLoading=!1,this._searchResultsByType={},this._currentSearchQuery=e,this._searchHierarchy=[],this._searchBreadcrumb="",this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this.requestUpdate(),this._doSearch().catch(t=>{console.error("yamp: artist quick-search failed:",t)}))}_showSearchSheetInOptions(e="default"){if(this._showSearchInSheet=!0,this._searchInputAutoFocused=!1,this._searchError="",this._searchResults=[],this._searchQuery="",this._searchAttempted=!1,this._searchResultsByType={},this._currentSearchQuery="",this._searchHierarchy=[],this._searchBreadcrumb="",this._usingMusicAssistant=!1,this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this.requestUpdate(),setTimeout(()=>{let t;switch(e){case"recently-played":t=this._toggleRecentlyPlayedFilter(!0);break;case"next-up":t=this._toggleUpcomingFilter(!0);break;case"recommendations":t=this._toggleRecommendationsFilter(!0);break;default:{const a=this.config.default_search_filter==="all"?null:this.config.default_search_filter;t=this._doSearch(a)}break}t?.catch&&t.catch(a=>{console.error("yamp: search initialization failed:",a)})},100),!this._disableSearchAutofocus){const t=this._alwaysCollapsed&&this._expandOnSearch?300:200;setTimeout(()=>{const a=this.renderRoot.querySelector("#search-input-box");a?a.focus():setTimeout(()=>{const s=this.renderRoot.querySelector("#search-input-box");s&&s.focus()},200)},t)}}_openQuickSearchOverlay(e="default"){this._quickMenuInvoke=!0,this._showEntityOptions=!0,this._showSearchSheetInOptions(e),setTimeout(()=>{this._notifyResize()},0)}_handleNavigate(e,t=!1){if(typeof e!="string"||!e.trim())return;const a=e.trim(),s=new CustomEvent("hass-navigate",{detail:{path:a},bubbles:!0,composed:!0});if(this.dispatchEvent(s),s.defaultPrevented)return;let r=!1;if(a.startsWith("#"))window.location.hash=a,r=!0;else if(/^https?:\/\//i.test(a)){if(t){window.open(a,"_blank","noopener,noreferrer");return}window.location.assign(a),r=!0}else this.hass?.navigate?(this.hass.navigate(a),r=!0):(window.history.pushState(null,"",a),r=!0);r&&window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_hideSearchSheetInOptions(){this._showSearchInSheet=!1,this._searchError="",this._searchResults=[],this._searchQuery="",this._searchDisplaySortOverride=null,this._searchInputAutoFocused=!1,this._searchLoading=!1,this._searchAttempted=!1,this._searchResultsByType={},this._currentSearchQuery="",this._searchHierarchy=[],this._searchBreadcrumb="",this._recommendationsFilterActive=!1,this._quickMenuInvoke&&(this._showEntityOptions=!1,this._quickMenuInvoke=!1),this.requestUpdate(),setTimeout(()=>{this._notifyResize()},0)}_searchOpenSheet(){this._searchOpen=!0,this._searchError="",this._searchResults=[],this._searchQuery="",this.requestUpdate()}_searchCloseSheet(){this._searchOpen=!1,this._searchError="",this._searchResults=[],this._searchQuery="",this._searchDisplaySortOverride=null,this._searchLoading=!1,this._searchInputAutoFocused=!1,this._searchResultsByType={},this._currentSearchQuery="",this._searchHierarchy=[],this._searchBreadcrumb="",this._recommendationsFilterActive=!1,this._quickMenuInvoke&&(this._showEntityOptions=!1,this._showSearchInSheet=!1,this._quickMenuInvoke=!1),this.requestUpdate()}_closeMenuIfOpen(){this._queueActionsMenuOpenId&&this._closeQueueActionsMenu()}_sortSearchResults(e,t=null){const a=t??this._getConfiguredSearchResultsSortMode(),s=Array.isArray(e)?[...e]:[];if(a==="random"){for(let r=s.length-1;r>0;r--){const n=Math.floor(Math.random()*(r+1));[s[r],s[n]]=[s[n],s[r]]}return s}return s}_getConfiguredSearchResultsSortMode(){const e=this.config?.search_results_sort,t=typeof e=="string"?e:"default";return this._mapLegacySortOption(t)}_mapLegacySortOption(e){return e?{title_asc:"name",title_desc:"name_desc",artist_asc:"artist_name",artist_desc:"artist_name_desc"}[e]||e:"default"}_isSortableSearchMode(e){return!(!e||e==="default"||e==="random"||e==="random_play_count")}_getOppositeSearchSortMode(e){return!e||e==="default"||e==="random"||e==="random_play_count"?null:e.endsWith("_desc")?e.replace(/_desc$/,""):`${e}_desc`}_shouldShowSearchSortToggle(){return this._isSortableSearchMode(this._getConfiguredSearchResultsSortMode())}_toggleSearchResultsSortDirection(){if(!this._shouldShowSearchSortToggle()){this._searchDisplaySortOverride=null;return}const e=this._getConfiguredSearchResultsSortMode(),t=this._getOppositeSearchSortMode(e);if(!t){this._searchDisplaySortOverride=null;return}this._searchDisplaySortOverride===t?this._searchDisplaySortOverride=null:this._searchDisplaySortOverride=t,this._searchResultsByType={},this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter,{orderBy:this._getActiveSearchDisplaySortMode()}),this.requestUpdate()}_getActiveSearchDisplaySortMode(){if(!this._shouldShowSearchSortToggle())return this._getConfiguredSearchResultsSortMode();const e=this._searchDisplaySortOverride;return e&&this._isSortableSearchMode(e)?e:this._getConfiguredSearchResultsSortMode()}_getSearchSortToggleIcon(){const e=this._getActiveSearchDisplaySortMode();return this._isSortableSearchMode(e)?e.endsWith("_desc")?"mdi:sort-descending":"mdi:sort-ascending":"mdi:sort-variant"}_getSearchSortToggleTitle(){const e=this._getActiveSearchDisplaySortMode();if(!this._isSortableSearchMode(e))return"Toggle search result order";const t=e.endsWith("_desc");return`Sort by ${(t?e.replace(/_desc$/,""):e).replace(/_/g," ")} ${t?"descending":"ascending"}`}_getDisplaySearchResults(){return Array.isArray(this._searchResults)?this._searchResults:[]}_getSearchResultsLimit(){const e=Number(this.config?.search_results_limit);return Number.isFinite(e)?e===0?0:Math.min(Math.max(e,1),1e3):20}_getSearchResultsCount(){return Array.isArray(this._searchResults)?this._searchResults.length:0}_shouldShowSearchResultsCount(){return this._isNarrowViewport||!this._usingMusicAssistant||this._searchLoading?!1:this._getSearchResultsCount()>0?!0:this._searchAttempted||this._initialFavoritesLoaded||this._favoritesFilterActive||this._recentlyPlayedFilterActive||this._upcomingFilterActive||this._recommendationsFilterActive}_getSearchResultsCountLabel(){const e=this._getSearchResultsCount();return`${e} ${h(e===1?"search.result":"search.results")}`}async _doSearch(e=null,t={}){this._searchAttempted=!0,this._closeMenuIfOpen(),this._searchMediaClassFilter=e&&e!=="favorites"?e:"all";const a=!!(t.favorites||(this._favoritesFilterActive||this._initialFavoritesLoaded||this._lastSearchUsedServerFavorites)&&!t.clearFilters);a&&(this._favoritesFilterActive=!0);const s=!!(t.isRecentlyPlayed||this._recentlyPlayedFilterActive&&!t.clearFilters),r=!!(t.isUpcoming||this._upcomingFilterActive&&!t.clearFilters),n=!!(t.isRecommendations||this._recommendationsFilterActive&&!t.clearFilters);this._currentSearchQuery!==this._searchQuery&&(this._searchResultsByType={},this._currentSearchQuery=this._searchQuery);const o=this._getActiveSearchDisplaySortMode(),l=`${e||"all"}${a?"_favorites":""}${s?"_recently_played":""}${r?"_upcoming":""}${n?"_recommendations":""}_sort_${o}`;if(this._searchResultsByType[l]){this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken=0,this._searchResults=this._sortSearchResults(this._searchResultsByType[l]),this._searchLoading=!1,this._searchError="",this.requestUpdate();return}this._searchLoading=!0,this._searchError="",this._searchResults=[],this.requestUpdate();const c=Date.now();this._latestSearchToken=c;const u=d=>this._handleProgressiveSearchResults(d,l,c);this._searchTimeoutHandle&&clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=window.setTimeout(()=>{this._latestSearchToken===c&&this._searchLoading&&(this._searchLoading=!1,this._searchError="Search timed out. Try again.",this.requestUpdate())},this.config?.search_timeout_ms?Number(this.config.search_timeout_ms):15e3);try{const d=this._getSearchEntityId(this._selectedIndex),p=await this._resolveTemplateAtActionTime(d,this.currentEntityId);let _;if(s)this._initialFavoritesLoaded=!1,_=await Co(this.hass,p,e,this._getSearchResultsLimit(),{onChunk:u}),this._lastSearchUsedServerFavorites=!1;else if(r)this._initialFavoritesLoaded=!1,_=await this._getUpcomingQueue(this.hass,p,this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1;else if(n)this._initialFavoritesLoaded=!1,_=await this._getRecommendations(this.hass,p,e,this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1;else if(a){this._initialFavoritesLoaded=!1;const x=this._getActiveSearchDisplaySortMode();_=await xs(this.hass,p,this._searchQuery,e,{...t,favorites:!0,orderBy:x!=="default"?x:void 0},this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!0}else if((!this._searchQuery||this._searchQuery.trim()==="")&&!a&&!s&&(e==="all"||!e)){const x=this._getActiveSearchDisplaySortMode();_=await ws(this.hass,p,e==="favorites"?null:e,this._getSearchResultsLimit(),{onChunk:u,orderBy:x!=="default"?x:void 0}),(!this._searchQuery||this._searchQuery.trim()==="")&&(this._initialFavoritesLoaded=!0),this._lastSearchUsedServerFavorites=!0}else{this._initialFavoritesLoaded=!1;const x=this._getActiveSearchDisplaySortMode();_=await xs(this.hass,p,this._searchQuery,e,{...t,orderBy:x!=="default"?x:void 0},this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1}if((s||r||n)&&this._searchQuery&&this._searchQuery.trim()!==""){const x=this._searchQuery.trim().toLowerCase();_&&_.results&&(_.results=_.results.filter(M=>{const E=(M.title||"").toLowerCase(),G=(M.artist||"").toLowerCase(),U=(M.album||"").toLowerCase();return E.includes(x)||G.includes(x)||U.includes(x)}))}const f=_.results||[];this._usingMusicAssistant=_.usedMusicAssistant||!1;const g=this._currentSearchQuery!==this._searchQuery;g&&(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1);const y=Array.isArray(f)?f:[];this._searchResults=this._sortSearchResults(y),!g&&this._favoritesFilterActive&&!this._lastSearchUsedServerFavorites&&await this._applyFavoritesFilterIfActive(),this._searchResultsByType[l]=y;const k=Array.isArray(this._searchResults)?this._searchResults.length:0;this._searchTotalRows=Math.max(15,k)}catch(d){this._searchError=d&&d.message||"Unknown error",this._searchResults=[],this._searchTotalRows=0}this._latestSearchToken===c&&this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken===c&&(this._latestSearchToken=0),this._searchLoading=!1,this.requestUpdate()}_handleSearchSubmit(){const e=this._keepFiltersOnSearch;e||(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1);const t=!e;this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter,{clearFilters:t})}_handleProgressiveSearchResults(e,t,a){if(!Array.isArray(e)||!e.length||this._latestSearchToken!==a)return;const s=(this._searchResultsByType[t]||[]).concat(e);this._searchResultsByType[t]=s,this._searchResults=this._sortSearchResults(s);const r=Array.isArray(s)?s.length:0;this._searchTotalRows=Math.max(15,r),this.requestUpdate()}_getVisibleSearchFilterClasses(){const e=this.entityObjs?.[this._selectedIndex]||null,t=new Set(e?.hidden_filter_chips||[]);return Tt.filter(a=>!t.has(a))}async _playMediaFromSearch(e){const t=this._getSearchEntityId(this._selectedIndex),a=await this._resolveTemplateAtActionTime(t,this.currentEntityId);if(this._searchError="",!await this._performSearchPlayback(e,a)){this._searchError="Unable to start playback. Please try again.",this.requestUpdate();return}this.config.dismiss_search_on_play!==!1?(this._showSearchInSheet&&(this._closeEntityOptions(),this._showSearchInSheet=!1),this._searchCloseSheet()):this.requestUpdate()}async _performSearchPlayback(e,t){if(e.queue_item_id&&this._upcomingFilterActive&&this._isMusicAssistantEntity()&&this._massQueueAvailable)try{const n=this._getMusicAssistantState()?.entity_id;if(n)return await this.hass.callService("mass_queue","play_queue_item",{entity:n,queue_item_id:e.queue_item_id}),this._invalidateUpcomingCache(),!0}catch(n){return console.error("yamp: Error playing queue item:",n),await this.hass.callService("media_player","media_next_track",{entity_id:t}),!0}if(!t)return!1;const a=this._collectPlaybackMonitorIds(t),s=this._snapshotPlaybackState(a);if(!await this._invokePlayMedia(t,e))return!1;if(await this._waitForPlaybackChange(s,a))return!0;const r=this._snapshotPlaybackState(a);return await this._invokePlayMedia(t,e)?await this._waitForPlaybackChange(r,a):!1}_collectPlaybackMonitorIds(e){const t=new Set;e&&t.add(e);const a=this._getPlaybackEntityId(this._selectedIndex);a&&t.add(a);const s=this.currentEntityId;s&&t.add(s);const r=this._getActualResolvedMaEntityForState(this._selectedIndex);return r&&t.add(r),Array.from(t).filter(Boolean)}_snapshotPlaybackState(e){const t={};return Array.isArray(e)&&e.forEach(a=>{const s=a?this.hass?.states?.[a]:null;t[a]={state:s?.state??null,mediaId:s?.attributes?.media_content_id??null,mediaTitle:s?.attributes?.media_title??null}}),t}async _waitForPlaybackChange(e,t,a=2500){if(!Array.isArray(t)||t.length===0)return!0;const s=Date.now();for(;Date.now()-s<a;){await this._delay(150);for(const r of t){if(!r)continue;const n=this.hass?.states?.[r];if(!n)continue;if(this._isEntityPlaying(n))return!0;const o=e[r]||{},l=n.attributes?.media_content_id??null,c=n.attributes?.media_title??null;if(l&&l!==o.mediaId||c&&c!==o.mediaTitle||!o.mediaId&&l||!o.mediaTitle&&c)return!0}}return!1}async _performSearchOptionAction(e,t){const a=this._getSearchEntityId(this._selectedIndex),s=await this._resolveTemplateAtActionTime(a,this.currentEntityId);try{const r={entity_id:s,media_id:e.media_content_id,media_type:e.media_content_type,enqueue:t};this._radioModeActive&&(r.radio_mode=!0),await this.hass.callService("music_assistant","play_media",r),this._invalidateUpcomingCache(),t==="replace"?(this.config.dismiss_search_on_play!==!1&&this._closeEntityOptions(),this._activeSearchRowMenuId=null):(this._successSearchRowMenuId=e.media_content_id,this.requestUpdate(),setTimeout(()=>{this._successSearchRowMenuId=null,this._activeSearchRowMenuId=null,this.requestUpdate()},2e3))}catch(r){console.error("Failed to perform search option action:",r),this._searchError="Action failed: "+r.message,this.requestUpdate()}}async _invokePlayMedia(e,t){try{return this._radioModeActive?await this.hass.callService("music_assistant","play_media",{entity_id:e,media_id:t.media_content_id,media_type:t.media_content_type,radio_mode:!0}):await Mo(this.hass,e,t),!0}catch(a){return console.error("yamp: Error starting playback from search:",a),!1}}_delay(e){return new Promise(t=>{(typeof window<"u"?window:globalThis).setTimeout(t,e)})}async _queueMediaFromSearch(e){const t=this._getSearchEntityId(this._selectedIndex),a=await this._resolveTemplateAtActionTime(t,this.currentEntityId);this._radioModeActive?this.hass.callService("music_assistant","play_media",{entity_id:a,media_id:e.media_content_id,media_type:e.media_content_type,enqueue:"add",radio_mode:!0}):this.hass.callService("media_player","play_media",{entity_id:a,media_content_type:e.media_content_type,media_content_id:e.media_content_id,enqueue:"next"}),this._invalidateUpcomingCache(),this._showQueueSuccessMessage=!0,this.requestUpdate(),setTimeout(()=>{this._showQueueSuccessMessage=!1,this.requestUpdate()},3e3)}async _searchArtistAlbums(e){this._searchHierarchy.push({type:"artist",name:e,query:this._searchQuery}),this._searchBreadcrumb=`Albums by ${e}`,this._searchQuery=e,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="album",this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._initialFavoritesLoaded=!1,this._removeSearchSwipeHandlers(),await this._doSearch("album",{clearFilters:!0})}_goBackInSearch(){if(this._searchHierarchy.length===0)return;this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const e=this._searchHierarchy.pop();if(this._searchQuery=e.query,this._currentSearchQuery=e.query,this._searchResultsByType={},this._searchHierarchy.length===0)this._searchBreadcrumb="",this._searchMediaClassFilter="all",this._doSearch();else{const t=this._searchHierarchy[this._searchHierarchy.length-1];if(t.type==="artist")this._searchBreadcrumb=`Albums by ${t.name}`,this._searchMediaClassFilter="album",this._doSearch("album",{artist:t.name});else if(t.type==="album"){if(this._searchBreadcrumb=`Tracks from ${t.name}`,this._searchMediaClassFilter="track",t.uri&&this._isMusicAssistantEntity()){this._searchQuery=t.name,this._searchAlbumTracks(t.name,null,t.uri);return}const a=this._searchHierarchy.find(r=>r.type==="artist"),s={album:t.name};a&&(s.artist=a.name),this._doSearch("track",s)}else if(t.type==="playlist"){if(this._searchBreadcrumb=`Tracks in ${t.name}`,this._searchMediaClassFilter="track",t.uri&&this._isMusicAssistantEntity()){this._searchQuery=t.name,this._showPlaylistTracks({title:t.name,media_content_id:t.uri});return}this._doSearch("track")}}}_isClickableSearchResult(e){return e?!!e.is_browsable:!1}_handleSearchResultTouch(e,t){if(!("ontouchstart"in window))return;const a=t.touches[0],s=a.clientX,r=a.clientY;let n=!1;const o=10,l=u=>{const d=u.touches[0],p=Math.abs(d.clientX-s),_=Math.abs(d.clientY-r);(p>o||_>o)&&(n=!0)},c=u=>{document.removeEventListener("touchmove",l,{passive:!0}),document.removeEventListener("touchend",c,{passive:!0}),n||this._handleSearchResultClick(e)};document.addEventListener("touchmove",l,{passive:!0}),document.addEventListener("touchend",c,{passive:!0})}_getSearchResultClickTitle(e){return this._isClickableSearchResult(e)?oo(e):""}_invalidateUpcomingCache(){const e=`${this._searchMediaClassFilter||"all"}_upcoming`;this._searchResultsByType&&(delete this._searchResultsByType[e],this.requestUpdate())}_toggleRadioMode(){this._radioModeActive=!this._radioModeActive,this.requestUpdate()}async _toggleFavoritesFilter(){if(this._favoritesFilterActive=!this._favoritesFilterActive,this._favoritesFilterActive&&(this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1),this._favoritesFilterActive){const e=this._searchMediaClassFilter;try{await this._doSearch(e,{favorites:!0})}catch(t){console.error("yamp: Error searching favorites:",t)}}else{const e=this._searchMediaClassFilter;this._lastSearchUsedServerFavorites=!1,this._initialFavoritesLoaded=!1,await this._doSearch(e,{clearFilters:!0})}}async _toggleRecentlyPlayedFilter(e=null){const t=typeof e=="boolean"?e:!this._recentlyPlayedFilterActive;if(this._recentlyPlayedFilterActive,this._recentlyPlayedFilterActive=t,this._recentlyPlayedFilterActive&&(this._favoritesFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1),this._recentlyPlayedFilterActive){this._searchQuery="";try{await this._doSearch("all",{isRecentlyPlayed:!0,clearFilters:!0})}catch(a){console.error("yamp: Error in _doSearch for recently played:",a)}}else if(this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _toggleUpcomingFilter(e=null){const t=typeof e=="boolean"?e:!this._upcomingFilterActive;if(this._upcomingFilterActive,this._upcomingFilterActive=t,this._upcomingFilterActive&&(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1),this._upcomingFilterActive){this._searchQuery="";const a=`${this._searchMediaClassFilter||"all"}_upcoming`;delete this._searchResultsByType[a],await this._subscribeToQueueUpdates();try{await this._doSearch("all",{isUpcoming:!0,clearFilters:!0})}catch(s){console.error("yamp: Error in _doSearch for upcoming queue:",s)}}else if(this._unsubscribeFromQueueUpdates(),this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _toggleRecommendationsFilter(e=null){const t=typeof e=="boolean"?e:!this._recommendationsFilterActive;if(this._recommendationsFilterActive,this._recommendationsFilterActive=t,this._recommendationsFilterActive){this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._initialFavoritesLoaded=!1,this._searchQuery="";try{const a=await this._isMassQueueIntegrationAvailable(this.hass);if(this._hasMassQueueIntegration=a,this._massQueueAvailable=a,!a){this._recommendationsFilterActive=!1,this._searchError="Recommendations require the Music Assistant queue integration.",this.requestUpdate();return}await this._doSearch("all",{isRecommendations:!0,clearFilters:!0})}catch(a){console.error("yamp: Error in _doSearch for recommendations:",a),this._searchError="Unable to load recommendations.",this._recommendationsFilterActive=!1,this.requestUpdate()}}else if(this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _getUpcomingQueue(e,t,a=20){try{const s=await this._isMassQueueIntegrationAvailable(e);if(this._massQueueAvailable=s,this._hasMassQueueIntegration=s,s)try{const r=await this._getUpcomingQueueWithMassQueue(e,t,a);return!r.results||r.results.length===0?(this._massQueueAvailable=!1,await this._getUpcomingQueueOriginal(e,t,a)):r}catch{return this._massQueueAvailable=!1,await this._getUpcomingQueueOriginal(e,t,a)}return await this._getUpcomingQueueOriginal(e,t,a)}catch(s){return console.error("yamp: Error getting upcoming queue:",s),this._massQueueAvailable=!1,{results:[],usedMusicAssistant:!1}}}async _getRecommendations(e,t,a=null,s=20){try{const r=await this._isMassQueueIntegrationAvailable(e);if(this._hasMassQueueIntegration=r,this._massQueueAvailable=r,!r)throw new Error("mass_queue integration unavailable");const n=Math.max(s||0,this._getSearchResultsLimit()),o={type:"call_service",domain:"mass_queue",service:"get_recommendations",service_data:{entity:t},return_response:!0},l=(await e.connection.sendMessagePromise(o))?.response;let c=[];Array.isArray(l)?c=l:l&&typeof l=="object"&&(Array.isArray(l[t])?c=l[t]:Object.values(l).forEach(y=>{Array.isArray(y)?c.push(...y):y&&typeof y=="object"&&c.push(y)}),c.length===0&&Array.isArray(l.items)&&(c=l.items));const u=y=>{if(!y||typeof y!="string")return"track";const k=y.toLowerCase();switch(k){case"song":case"music":return"track";case"podcast_episode":case"episode":return"podcast";case"station":return"radio";case"directory":case"folder":return"playlist";default:return k}},d=y=>y?y.toString().replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/\b\w/g,k=>k.toUpperCase()):"",p=a&&a!=="all"?u(a):null,_=[];let f=0;const g=n>0?n:1/0;for(const y of c){if(f>=g)break;const k=y?.name||y?.sort_name||"",x=typeof y?.image=="string"&&y.image.trim()!==""?y.image:null,M=Array.isArray(y?.items)&&y.items.length>0?y.items:[y];for(const E of M){if(f>=g)break;const G=E?.uri||E?.item_id;if(!G)continue;const U=typeof E?.image=="string"&&E.image.trim()!==""?E.image:null,O=E?.media_type||y?.media_type||"music",z=u(O);if(p&&z!==p)continue;const N=d(O)||d(z),C=d(E?.provider||y?.provider),I=N?[N]:[];k?I.push(k):C&&I.push(C),_.push({media_content_id:G,media_content_type:O||z,media_class:z,title:E?.name||E?.sort_name||k||"Recommendation",artist:I.join(" \u2022 "),thumbnail:U||x||null,provider:E?.provider||y?.provider||null}),f+=1}}return{results:_,usedMusicAssistant:!0,source:"mass_queue"}}catch(r){throw console.error("yamp: Error getting recommendations from mass_queue:",r),r}}async _isMassQueueIntegrationAvailable(e){if(this.config.disable_mass_queue===!0)return!1;try{const t=await e.callWS({type:"get_services"});let a=!1;return Array.isArray(t)?a=t.some(s=>s.domain==="mass_queue"):t&&typeof t=="object"&&(a=t.hasOwnProperty("mass_queue")||Object.keys(t).some(s=>s==="mass_queue")),!!a}catch{return!1}}async _getUpcomingQueueWithMassQueue(e,t,a=20){try{const s=e.states[t]?.attributes?.media_content_id,r={type:"call_service",domain:"mass_queue",service:"get_queue_items",service_data:{entity:t,limit_before:5},return_response:!0},n=this._getSearchResultsLimit(),o=Number.isFinite(a)?a:n,l=Math.max(o||0,n||0);l>0&&(r.service_data.limit_after=l);const c=(await e.connection.sendMessagePromise(r))?.response?.[t];if(!Array.isArray(c))throw new Error("Invalid response from mass_queue");const u=c.findIndex(_=>_.media_content_id===s),d=u>=0?c.slice(u+1):c,p=(o>0?d.slice(0,o):d).map((_,f)=>({media_content_id:_.media_content_id||`queue_${f}`,media_content_type:"track",media_class:"track",title:_.media_title||"Unknown Track",artist:_.media_artist||"Unknown Artist",album:_.media_album_name||"Unknown Album",thumbnail:_.media_image||null,duration:null,position:f+1,queue_item_id:_.queue_item_id||null}));return{results:p,usedMusicAssistant:!0,total:p.length,source:"mass_queue"}}catch(s){throw console.error("yamp: mass_queue service call failed:",s),s}}async _moveQueueItemUp(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"up"),await this.hass.callService("mass_queue","move_queue_item_up",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}async _moveQueueItemDown(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"down"),await this.hass.callService("mass_queue","move_queue_item_down",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}async _moveQueueItemNext(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"next"),await this.hass.callService("mass_queue","move_queue_item_next",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}async _removeQueueItem(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._removeQueueItemFromUI(e),await this.hass.callService("mass_queue","remove_queue_item",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}_showQueueError(e){console.error("yamp: Queue operation failed:",e)}_moveQueueItemInUI(e,t){const a=`${this._searchMediaClassFilter||"all"}_upcoming`,s=this._searchResultsByType[a];if(!s||!Array.isArray(s.results))return;const r=s.results.findIndex(l=>l.queue_item_id===e);if(r===-1)return;let n;switch(t){case"up":n=Math.max(0,r-1);break;case"down":n=Math.min(s.results.length-1,r+1);break;case"next":n=0;break;default:return}s.results[r];const o=s.results.splice(r,1)[0];s.results.splice(n,0,o),s.results.forEach((l,c)=>{l.position=c+1}),o._justMoved=!0,setTimeout(()=>{delete o._justMoved,this.requestUpdate()},1e3),this.requestUpdate()}_removeQueueItemFromUI(e){const t=`${this._searchMediaClassFilter||"all"}_upcoming`,a=this._searchResultsByType[t];!a||!Array.isArray(a.results)||(a.results=a.results.filter(s=>s.queue_item_id!==e),this.requestUpdate())}_isMusicAssistantEntity(){const e=this._getMusicAssistantState();return e?tt(e)||e.attributes?.mass_player_id||e.attributes?.active_queue||this._upcomingFilterActive&&this._searchResultsByType[`${this._searchMediaClassFilter||"all"}_upcoming`]?.results?.some(t=>t.queue_item_id):!1}_looksLikeMusicAssistantState(e){return e?tt(e)||!!e.attributes?.mass_player_id||!!e.attributes?.active_queue:!1}_getTransferQueueTargets(){if(!this.hass?.services?.music_assistant?.transfer_queue)return[];const e=this._selectedIndex;if(e==null||e<0)return[];const t=this._getActualResolvedMaEntityForState(e);if(!t)return[];const a=new Set([t]),s=[];for(let r=0;r<this.entityObjs.length;r++){const n=this.entityObjs[r];if(!n)continue;const o=this._getActualResolvedMaEntityForState(r);if(!o||a.has(o))continue;const l=this.hass?.states?.[o],c=this.hass?.states?.[n.entity_id];if(!this._looksLikeMusicAssistantState(l)&&!this._looksLikeMusicAssistantState(c))continue;a.add(o);const u=l||c,d=n?.name||c?.attributes?.friendly_name||l?.attributes?.friendly_name||n.entity_id;s.push({index:r,entityId:n.entity_id,maEntityId:o,name:d,subtitle:o!==n.entity_id?o:n.entity_id,state:u?.state,icon:u?.attributes?.icon||"mdi:music"})}return s}_hasQueueInState(e){if(!e)return!1;const t=e.attributes||{},a=["queue_items","queue","media_queue","mass_queue_items"];for(const o of a){const l=t[o];if(Array.isArray(l)&&l.length>0)return!0}const s=["queue_length","queue_size","queue_total_items","queue_pending","queue_remaining","items_in_queue"];for(const o of s){const l=t[o];if(typeof l=="number"&&l>0)return!0}if(t.next_item||t.current_queue_item||t.queue_item_id||t.media_content_id)return!0;const r=`${this._searchMediaClassFilter||"all"}_upcoming`,n=this._searchResultsByType?.[r];return!!(n&&Array.isArray(n.results)&&n.results.length>0)}async _updateTransferQueueAvailability({refresh:e=!1}={}){const t=this._getMusicAssistantState(),a=this._looksLikeMusicAssistantState(t);if(!t||!a)return this._hasTransferQueueForCurrent&&(this._hasTransferQueueForCurrent=!1,this.requestUpdate()),!1;let s=this._hasQueueInState(t);if(!s&&e&&this.hass){const r=this._getActualResolvedMaEntityForState(this._selectedIndex);if(r)try{const n=await this._getUpcomingQueue(this.hass,r,2);(Array.isArray(n?.results)&&n.results.length>0||this._isEntityPlaying(t)||t.state==="paused"||t.attributes?.media_content_id)&&(s=!0)}catch{}}return this._hasTransferQueueForCurrent!==s&&(this._hasTransferQueueForCurrent=s,this.requestUpdate()),s}_canShowTransferQueueOption(){return this._hasTransferQueueForCurrent?this._getTransferQueueTargets().length>0:!1}_openTransferQueue(){this._showEntityOptions=!0,this._showTransferQueue=!0,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),this.requestUpdate()}_closeTransferQueue(){this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),this.requestUpdate()}async _transferQueueTo(e){if(!e)return;const t=this._getActualResolvedMaEntityForState(this._selectedIndex);if(t){this._transferQueuePendingTarget=e.maEntityId,this._transferQueueStatus=null,this.requestUpdate();try{const a=this._buildTransferQueuePayload(t,e.maEntityId);await this.hass.callService("music_assistant","transfer_queue",a),this._transferQueueStatus={type:"success",message:`Queue sent to ${e.name}.`};const s=typeof e.index=="number"?e.index:this.entityIds.indexOf(e.entityId);if(s!=null&&s>=0){const r=this._pinnedIndex;if(r===null||r===s){this._selectedIndex=s,this._manualSelect=!0,this._manualSelectPlayingSet=null,r===s&&(this._pinnedIndex=s);const n=e.maEntityId||this.entityObjs[s]?.entity_id;n&&(this._playbackLingerByIdx||(this._playbackLingerByIdx={}),this._playbackLingerByIdx[s]={entityId:n,until:Date.now()+5e3},this._lastPlayingEntityIdByChip||(this._lastPlayingEntityIdByChip={}),this._lastPlayingEntityIdByChip[s]=n),this._ensureResolvedMaForIndex(s),this._ensureResolvedVolForIndex(s)}}await this._updateTransferQueueAvailability({refresh:!0}),this._transferQueueAutoCloseTimer&&clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=setTimeout(()=>{this._transferQueueAutoCloseTimer=null,this._showEntityOptions&&this._showTransferQueue&&this._dismissWithAnimation()},2e3)}catch(a){console.error("yamp: Error transferring queue:",a),this._transferQueueStatus={type:"error",message:a?.message||"Failed to transfer queue."},this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null)}finally{this._transferQueuePendingTarget=null,this.requestUpdate()}}}_buildTransferQueuePayload(e,t){const a=this.hass?.services?.music_assistant?.transfer_queue?.fields||{},s={},r=(l,c)=>{for(const u of l)if(a[u]!==void 0)return s[u]=c,!0;return!1},n=r(["source_player","source_player_id","player_id","source"],e),o=r(["target_player","target_player_id","target","entity_id"],t);if(!n){const l=o?"source_player":"entity_id";s[l]=e}return o||(s.entity_id===e?(s.entity_id=t,s.source_player=e):(s.source_player,s.entity_id=t)),s}_refreshQueue(){if(this._upcomingFilterActive){const e=`${this._searchMediaClassFilter||"all"}_upcoming`;delete this._searchResultsByType[e],this._doSearch("all",{isUpcoming:!0}).catch(t=>{console.error("yamp: Error refreshing queue:",t)})}}async _subscribeToQueueUpdates(){if(!this._queueEventSubscription)try{this._queueEventSubscription=await this.hass.connection.subscribeEvents(e=>{e.data.type==="queue_updated"&&this._refreshQueue()},"mass_queue")}catch(e){console.error("yamp: Failed to subscribe to queue updates:",e)}}_unsubscribeFromQueueUpdates(){this._queueEventSubscription&&(this._queueEventSubscription(),this._queueEventSubscription=null)}async _getUpcomingQueueOriginal(e,t,a=20){try{const s={type:"call_service",domain:"music_assistant",service:"get_queue",service_data:{entity_id:t},return_response:!0},r=(await e.connection.sendMessagePromise(s))?.response?.[t];if(!r)return{results:[],usedMusicAssistant:!0};const n=[];if(!r)return{results:[],usedMusicAssistant:!0};if(r.next_item){const o=r.next_item;n.push({media_content_id:o.media_item?.uri||"queue_next",media_content_type:o.media_item?.media_type||"track",media_class:"track",title:o.name||o.media_item?.name||"Unknown Track",artist:o.media_item?.artists?.[0]?.name||"Unknown Artist",album:o.media_item?.album?.name||"Unknown Album",thumbnail:o.media_item?.image||null,duration:o.duration||null,position:1,queue_item_id:o.queue_item_id||null})}return{results:n,usedMusicAssistant:!0,total:n.length,source:"music_assistant"}}catch(s){throw console.error("yamp: Error in original queue method:",s),s}}async _applyFavoritesFilterIfActive(){if(!this._favoritesFilterActive)return;const e=this._getSearchEntityId(this._selectedIndex),t=await this._resolveTemplateAtActionTime(e,this.currentEntityId);try{const a=(await ws(this.hass,t,this._searchMediaClassFilter,this._getSearchResultsLimit())).results||[],s=new Set(a.map(n=>n.media_content_id)),r=this._searchResults||[];this._searchResults=this._sortSearchResults(r.filter(n=>s.has(n.media_content_id)))}catch{}}async _handleSearchResultClick(e,t){if(this._isClickableSearchResult(e)&&!("ontouchstart"in window&&t&&t.sourceCapabilities&&t.sourceCapabilities.firesTouchEvents))if(e.media_class==="artist")await this._searchArtistAlbums(e.title);else if(e.media_class==="album"){let a=null;this._searchHierarchy.length>0&&this._searchHierarchy[this._searchHierarchy.length-1].type==="artist"?a=this._searchHierarchy[this._searchHierarchy.length-1].name:e.artist&&(a=e.artist),await this._searchAlbumTracks(e.title,a,e.media_content_id)}else e.media_class==="playlist"&&await this._searchPlaylistTracks(e.title,e.media_content_id)}async _searchAlbumTracks(e,t,a=null){this._searchHierarchy.push({type:"album",name:e,query:this._searchQuery,uri:a}),this._searchBreadcrumb=`Tracks from ${e}`,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="track",this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const s=await this._fetchMassQueueTracks(a,"get_album_tracks");if(s&&s.length>0){this._setSearchResultsFromMassQueue(s,e);return}if(a&&this._isMusicAssistantEntity())try{const o=this._getSearchEntityId(this._selectedIndex),l=await this._resolveTemplateAtActionTime(o,this.currentEntityId),c={type:"call_service",domain:"media_player",service:"browse_media",service_data:{entity_id:l,media_content_id:a},return_response:!0},u=await this.hass.connection.sendMessagePromise(c),d=(u?.response?.[l]?.result||u?.result||{}).children||[];if(d.length>0){this._searchQuery=e,this._searchResults=this._sortSearchResults(d),this._searchTotalRows=Math.max(15,d.length),this._searchLoading=!1,this.requestUpdate();return}}catch(o){console.error("yamp: Failed to browse album tracks:",o)}let r=e;t&&(r=`${t} ${e}`),this._searchQuery=r,this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._initialFavoritesLoaded=!1;const n={album:e,clearFilters:!0};t&&(n.artist=t),this._removeSearchSwipeHandlers(),await this._doSearch("track",n)}async _searchPlaylistTracks(e,t){this._searchHierarchy.push({type:"playlist",name:e,query:this._searchQuery,uri:t}),this._searchBreadcrumb=`Tracks from ${e}`,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="track",this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const a=await this._fetchMassQueueTracks(t,"get_playlist_tracks");if(a&&a.length>0){this._setSearchResultsFromMassQueue(a,e);return}this._searchQuery=e,this._searchResults=[],this._searchLoading=!1,this.requestUpdate()}async _fetchMassQueueTracks(e,t){try{if(!await this._isMassQueueIntegrationAvailable(this.hass))return null;const a=await So(this.hass);let s=[];if(a&&e)try{const r={type:"call_service",domain:"mass_queue",service:t,service_data:{config_entry_id:a,uri:e},return_response:!0},n=await this.hass.connection.sendMessagePromise(r);n?.response?.tracks&&(s=n.response.tracks)}catch(r){console.warn(`yamp: mass_queue.${t} failed with config_entry_id, trying fallback with entity_id`,r);const n=this._getMusicAssistantState()?.entity_id;if(n)try{const o={type:"call_service",domain:"mass_queue",service:t,service_data:{entity:n,uri:e},return_response:!0},l=await this.hass.connection.sendMessagePromise(o);l?.response?.tracks&&(s=l.response.tracks)}catch(o){throw console.warn(`yamp: mass_queue.${t} fallback with entity_id also failed.`,o),r}else throw r}return s}catch(a){return console.error(`yamp: Error fetching ${t} via mass_queue:`,a),null}}_setSearchResultsFromMassQueue(e,t){this._searchResults=e.map(a=>({media_content_id:a.media_content_id,media_content_type:"track",media_class:"track",title:a.media_title,artist:a.media_artist,album:a.media_album_name,thumbnail:a.media_image,duration:a.duration,is_browsable:!1,favorite:a.favorite})),this._searchQuery=t,this._searchTotalRows=Math.max(15,e.length),this._searchLoading=!1,this.requestUpdate()}_notifyResize(){this.dispatchEvent(new Event("iron-resize",{bubbles:!0,composed:!0}))}_setupAdaptiveTextObserver(){!this._adaptiveText||this._textResizeObserver||typeof ResizeObserver>"u"||!this.isConnected||(this._textResizeObserver=new ResizeObserver(()=>this._updateAdaptiveTextScale()),this._textResizeObserver.observe(this),this._updateAdaptiveTextScale())}_teardownAdaptiveTextObserver(){this._textResizeObserver&&(this._textResizeObserver.disconnect(),this._textResizeObserver=null),this._currentTextScale=null,this._setAdaptiveTextVars(1,new Set)}_setAdaptiveTextVars(e,t,a){if(!this.style)return;const s=t||this._adaptiveTextTargets,r=Number.isFinite(e)?e:1,n=r.toFixed(2);this.style.setProperty("--yamp-text-scale",n);for(const[p,_]of Object.entries(Dd)){const f=!!s?.has(p);this.style.setProperty(_,f?n:"1")}const o=!!s?.has("details"),l=Number.isFinite(a)?a:r,c=o?l.toFixed(2):"1",u=o?this._calculateDetailsLineHeight(l):1.2;this.style.setProperty("--yamp-details-scale",c),this.style.setProperty("--yamp-details-line-height",u.toFixed(2));const d=o?l>=2?3:l>=1.3?2:1:3;this.style.setProperty("--yamp-details-max-lines",d.toString())}_updateAdaptiveTextObserverState(){this._adaptiveText&&this.isConnected?this._setupAdaptiveTextObserver():this._teardownAdaptiveTextObserver()}_handleGlobalScroll(){this._adaptiveText&&(this._suspendAdaptiveScaling=!0,this._pendingAdaptiveScaleUpdate=!0,clearTimeout(this._adaptiveScrollTimer),this._adaptiveScrollTimer=setTimeout(()=>{this._suspendAdaptiveScaling=!1,this._pendingAdaptiveScaleUpdate&&(this._pendingAdaptiveScaleUpdate=!1,this._updateAdaptiveTextScale(!0))},400))}_handleViewportResize(){this._updateViewportFlags()}_updateViewportFlags(){if(typeof window>"u")return;const e=typeof document<"u"?document.documentElement?.clientWidth:0,t=window.innerWidth||e||0,a=t>0?t<=520:this._isNarrowViewport;a!==this._isNarrowViewport&&(this._isNarrowViewport=a,this.requestUpdate())}_updateAdaptiveTextScale(e=!1){if(!this._adaptiveText)return;if(this._suspendAdaptiveScaling&&!e){this._pendingAdaptiveScaleUpdate=!0;return}const t=this.getBoundingClientRect(),a=t?.width||0;if(!a)return;const s=this._getAdaptiveBaselineHeight(this._lastRenderedCollapsed||!1)||t?.height||a,r=a/360,n=s/360,o=r*.8+n*.2,l=Math.max(.85,Math.min(1.4,o)),c=this._calculateDetailsScale(a,s,l,this._lastTitleLength||0),u=this._currentTextScale===null||Math.abs(this._currentTextScale-l)>.01,d=this._currentDetailsScale===null||Math.abs(this._currentDetailsScale-c)>.02;(u||d)&&(this._currentTextScale=l,this._currentDetailsScale=c,this._setAdaptiveTextVars(l,void 0,c))}_calculateDetailsScale(e,t,a=1){if(!this._adaptiveTextTargets?.has("details"))return 1;const s=Math.min(Math.max(1,e/360),3.2),r=Math.max(1,Math.min(t/330,2.4)),n=Math.max(s*.7+r*.3,r),o=Math.min(3.25,1+(r-1)*1.35),l=Math.max(a,n*1.18),c=Math.max(1,Math.min(l,o)),u=this._lastTitleLength||0,d=u>0?Math.max(.62,Math.min(1,30/Math.min(u,72))):1;return 1+(c-1)*d}_calculateDetailsLineHeight(e){const t=Math.max(1,Math.min(e,2.6)),a=Math.max(0,t-1);return Math.min(1.55,1.2+a*.35)}_getAdaptiveBaselineHeight(e=!1){const t=this.config?.card_height;if(typeof t=="number"&&Number.isFinite(t)&&t>0)return t;if(typeof t=="string"){const a=t.trim();if(a){const s=Number(a);if(Number.isFinite(s)&&s>0)return s}}return e||this._alwaysCollapsed?this._collapsedBaselineHeight||220:350}async _resolveIdleImageTemplate(){if(!(!this._idleImageTemplate||this._resolvingIdleImageTemplate||!this.hass)){this._resolvingIdleImageTemplate=!0;try{const e=await this.hass.callApi("POST","template",{template:this._idleImageTemplate});this._idleImageTemplateResult=(e??"").toString().trim()}catch{this._idleImageTemplateResult=""}finally{this._resolvingIdleImageTemplate=!1,this._idleImageTemplateNeedsResolve=!1,this.requestUpdate()}}}_ensureArtworkOverrideIndexMap(){this._artworkOverrideIndexMap||(this._artworkOverrideIndexMap=new WeakMap,(Array.isArray(this.config?.media_artwork_overrides)?this.config.media_artwork_overrides:[]).forEach((e,t)=>{e&&typeof e=="object"&&this._artworkOverrideIndexMap.set(e,t)}))}_getArtworkOverrideCacheKey(e,t="image",a=null){this._ensureArtworkOverrideIndexMap();const s=a?.attributes?.media_title||"",r=a?.attributes?.media_artist||"",n=`${s}:${r}`,o=e&&this._artworkOverrideIndexMap?.get(e);return`${typeof o=="number"?o:"generic"}:${t}:${n}`}_getResolvedArtworkOverrideSource(e,t,a="image",s=null){if(!t||typeof t!="string")return null;const r=this._normalizeImageSourceValue(t);if(!r)return null;if(!(t.includes("{{")||t.includes("{%")))return r;this._artworkOverrideTemplateCache||(this._artworkOverrideTemplateCache={});const n=this._getArtworkOverrideCacheKey(e,a,s);this._artworkOverrideTemplateCache[n]||(this._artworkOverrideTemplateCache[n]={value:null,resolving:!1});const o=this._artworkOverrideTemplateCache[n];return o.value||!o.resolving&&this.hass&&(o.resolving=!0,this.hass.callApi("POST","template",{template:t}).then(l=>{o.value=this._normalizeImageSourceValue((l??"").toString())}).catch(()=>{o.value=""}).finally(()=>{o.resolving=!1,this.requestUpdate()})),o.value}_getCollapsedArtworkStyle(){if(this._alwaysCollapsed){const e=!!this._getFavoriteButtonEntity()&&!this._getHiddenControlsForCurrentEntity().favorite;if(Zi(this.currentActivePlaybackStateObj,(t,a)=>this._supportsFeature(t,a),e,this._getHiddenControlsForCurrentEntity(),!0,this._controlLayout)>6&&window.innerWidth<=768)return"width: 60px; height: 60px; object-fit: var(--yamp-artwork-fit, cover); border-radius: 8px;"}return""}_getArtworkUrl(e){if(!e||!e.attributes)return null;const t=e.attributes,a=e.entity_id;t.app_id;const s=this.config?.artwork_hostname||"";let r=null,n=null,o=null;const l=Array.isArray(this.config?.media_artwork_overrides)?this.config.media_artwork_overrides:null;if(l&&l.length){const c=()=>l.find(f=>Xr.some(g=>{const y=f[g];if(y===void 0)return!1;const k=g==="entity_id"?a:g==="entity_state"?e?.state:t[g];return y==="*"?!0:f.__cachedRegexes?.[g]?f.__cachedRegexes[g].test(String(k||"")):k===y})),u=xe(t,"entity_picture_local")||xe(t,"entity_picture")||xe(t,"album_art");let d=c(),p=null,_="image";if(d?.image_url?p=d.image_url:d?.missing_art_url&&!u&&(p=d.missing_art_url,_="missing"),!d&&!u){const f=l.find(g=>g?.missing_art_url);f?.missing_art_url&&(d=f,p=f.missing_art_url,_="missing")}if(d&&p){const f=this._getResolvedArtworkOverrideSource(d,p,_,e);f&&(r=f,n=d?.size_percentage,o=d?.object_fit??null)}}if(r||(r=xe(t,"entity_picture_local")||xe(t,"entity_picture")||xe(t,"album_art")||null),!r){const c=this.config?.fallback_artwork;c&&(c==="smart"?t.media_title==="TV"||t.media_channel||t.app_id==="tv"||t.app_id==="androidtv"?r="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvcj4KPHJlY3QgeD0iNjgiIHk9IjEyMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHJlY3QgeD0iODAiIHk9IjEzMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==":r="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=":typeof c=="string"&&(r=c),r&&(o=this._artworkObjectFit))}if(r&&s&&!r.startsWith("http")&&!r.startsWith("data:")){const c=s.endsWith("/")?s.slice(0,-1):s,u=r.startsWith("/")?r:`/${r}`;r=c+u}return r&&!this._isValidArtworkUrl(r)&&(r=null),o||(o=this._artworkObjectFit),{url:r,sizePercentage:n,objectFit:o}}_getBackgroundSizeForFit(e){switch(e){case"contain":return"contain";case"fill":return"100% 100%";case"scale-down":return"contain";case"none":return"auto";case"scaled-contain":return"80%";default:return"cover"}}_isValidArtworkUrl(e){if(!e||typeof e!="string")return!1;if(e.startsWith("data:")||e.startsWith("/")||e.startsWith("./")||e.startsWith("../"))return!0;if(e.includes("undefined")||e.includes("null")||e.trim()==="")return!1;try{return new URL(e),!0}catch{return!1}}async _extractDominantColor(e){return new Promise(t=>{const a=new window.Image;a.crossOrigin="Anonymous",a.src=e,a.onload=function(){const s=document.createElement("canvas");s.width=1,s.height=1;const r=s.getContext("2d");r.drawImage(a,0,0,1,1);const[n,o,l]=r.getImageData(0,0,1,1).data;t(`rgb(${n},${o},${l})`)},a.onerror=function(){t("#888")}})}_normalizeAdaptiveTextTargets(e){return Array.isArray(e?.adaptive_text_targets)?e.adaptive_text_targets.map(t=>typeof t=="string"?t.trim().toLowerCase():"").filter(t=>Kr.includes(t)):e?.adaptive_text===!0?[...Fd]:[]}_normalizeImageSourceValue(e){if(!e||typeof e!="string")return"";let t=e.trim();if(!t)return"";(t.startsWith("'")&&t.endsWith("'")||t.startsWith('"')&&t.endsWith('"'))&&t.length>=2&&(t=t.slice(1,-1).trim());const a=t.match(/^url\((.*)\)$/i);if(a&&a[1]!==void 0){let s=a[1].trim();return(s.startsWith("'")&&s.endsWith("'")||s.startsWith('"')&&s.endsWith('"'))&&(s=s.slice(1,-1).trim()),s}return t}setConfig(e){if(!e.entities||!Array.isArray(e.entities)||e.entities.length===0)throw new Error("You must define at least one media_player entity.");const t=this.config;this.config={...e};const a=typeof e.control_layout=="string"?e.control_layout.toLowerCase():"classic";this._controlLayout=a==="modern"?"modern":"classic",this._swapPauseForStop=e.swap_pause_for_stop===!0,this._holdToPin=!!e.hold_to_pin,this._disableSearchAutofocus=e.disable_autofocus===!0,this._holdToPin&&(this._holdHandler=uo({onPin:o=>this._pinChip(o),onHoldEnd:()=>{},holdTime:650,moveThreshold:8}));const s=this._selectedIndex||0;if(this._selectedIndex=s<this.entityIds.length?s:0,this._lastPlaying=null,this._lastActiveEntityId=null,this.config.match_theme===!0){const o=getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();this._customAccent=o||"#ff9800"}else this._customAccent="#ff9800";const r=new Set(["cover","contain","fill","scale-down","none","scaled-contain"]);if(this._artworkObjectFit=r.has(e.artwork_object_fit)?e.artwork_object_fit:"cover",this._extendArtwork=e.extend_artwork===!0,this._idleScreen=e.idle_screen||"default",this._idleScreenApplied=!1,this._hasSeenPlayback=!1,this._isIdle&&this._applyIdleScreen(),this.shadowRoot&&this.shadowRoot.host){this.shadowRoot.host.setAttribute("data-match-theme",String(this.config.match_theme===!0)),this.shadowRoot.host.setAttribute("data-always-collapsed",String(this.config.always_collapsed===!0));const o=this.config.always_collapsed===!0&&this.config.pin_search_headers===!0&&this.config.expand_on_search===!0;this.shadowRoot.host.setAttribute("data-hide-menu-player",String(this.config.hide_menu_player===!0||o)),this.shadowRoot.host.setAttribute("data-extend-artwork",String(this._extendArtwork))}this._collapseOnIdle=!!e.collapse_on_idle,this._alwaysCollapsed=!!e.always_collapsed,this._expandOnSearch=!!e.expand_on_search,this._alternateProgressBar=!!e.alternate_progress_bar,this._displayTimestamps=!!e.display_timestamps,this._keepFiltersOnSearch=!!e.keep_filters_on_search,this._adaptiveControls=e.adaptive_controls===!0;const n=this._normalizeAdaptiveTextTargets(e);if(this._adaptiveTextTargets=new Set(n),this._adaptiveText=this._adaptiveTextTargets.size>0,this._currentDetailsScale=null,this._updateAdaptiveTextObserverState(),e.always_show_quick_group!==t?.always_show_quick_group&&(this._quickGroupingMode=!!e.always_show_quick_group),this._adaptiveText){const o=this._currentTextScale??1,l=this._currentDetailsScale??1;this._setAdaptiveTextVars(o,void 0,l),this._updateAdaptiveTextScale()}else this._setAdaptiveTextVars(1,new Set,1);this._hideActiveEntityLabel=e.hide_active_entity_label===!0,this._artworkOverrideTemplateCache={},this._artworkOverrideIndexMap=null,Array.isArray(e.media_artwork_overrides)&&(this.config.media_artwork_overrides=e.media_artwork_overrides.map(o=>({...o})),this.config.media_artwork_overrides.forEach(o=>{!o||typeof o!="object"||(o.__cachedRegexes={},Xr.forEach(l=>{const c=o[l];if(typeof c=="string"&&c.includes("*")&&c!=="*")try{const u=c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\\\*/g,".*");o.__cachedRegexes[l]=new RegExp(`^${u}$`,"i")}catch{console.warn("yamp: Failed to compile artwork override regex for",l,c)}}))})),typeof e.idle_image=="string"&&(e.idle_image.includes("{{")||e.idle_image.includes("{%"))?(this._idleImageTemplate=e.idle_image,this._idleImageTemplateResult="",this._idleImageTemplateNeedsResolve=!0):(this._idleImageTemplate=null,this._idleImageTemplateResult="",this._idleImageTemplateNeedsResolve=!1),this._idleTimeoutMs=typeof e.idle_timeout_ms=="number"?e.idle_timeout_ms:6e4,this._idleTimeoutMs===0&&(this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate())),this._volumeStep=typeof e.volume_step=="number"?e.volume_step:.05}get entityObjs(){return this.config.entities.map((e,t)=>{const a=typeof e=="string"?e:e.entity_id,s=typeof e=="string"?"":e.name||"",r=typeof e=="string"?void 0:e.volume_entity,n=typeof e=="string"?void 0:e.music_assistant_entity,o=typeof e=="string"?!1:!!e.sync_power,l=typeof e=="string"?!1:!!e.follow_active_volume,c=typeof e=="string"?void 0:e.hidden_controls;let u;if(typeof e=="object"&&typeof e.group_volume<"u")u=e.group_volume;else{const d=this.hass?.states?.[a];if(d&&Array.isArray(d.attributes.group_members)&&d.attributes.group_members.length>0){const p=d.attributes.group_members.filter(f=>f!==a),_=this.config.entities.map(f=>typeof f=="string"?f:f.entity_id);u=p.filter(f=>_.includes(f)).length>0}}return{entity_id:a,name:s,volume_entity:r,music_assistant_entity:n,sync_power:o,follow_active_volume:l,hidden_controls:c,hidden_filter_chips:typeof e=="string"?void 0:e.hidden_filter_chips,disable_auto_select:this._isAutoSelectDisabled(t),...typeof u<"u"?{group_volume:u}:{}}})}_getEntityForPurpose(e,t){const a=this.entityObjs[e];if(!a)return null;switch(t){case"volume_control":return a.follow_active_volume?this._getActivePlaybackEntityForIndex(e)||a.entity_id:this._resolveEntity(a.volume_entity,a.entity_id,e)||a.entity_id;case"volume_display":return a.follow_active_volume?this._getActivePlaybackEntityForIndex(e)||a.entity_id:this._resolveEntity(a.volume_entity,a.entity_id,e)||a.entity_id;case"grouping_control":const s=this.hass.states[a.entity_id];return this._isGroupCapable(s)?a.entity_id:this._resolveEntity(a.music_assistant_entity,a.entity_id,e)||a.entity_id;case"playback_control":return this._getActivePlaybackEntityForIndex(e)||a.entity_id;case"sorting":return this._getActivePlaybackEntityForIndex(e)||a.entity_id;default:return a.entity_id}}_resolveEntity(e,t,a){return e?typeof e=="string"&&(e.includes("{{")||e.includes("{%"))?this._maResolveCache?.[a]?.id||t:e:null}_getActivePlaybackEntityForIndex(e){const t=this.entityObjs[e];if(!t)return null;const a=t.entity_id,s=this._resolveEntity(t.music_assistant_entity,t.entity_id,e),r=a?this.hass?.states?.[a]:null,n=s?this.hass?.states?.[s]:null;return s===a?a:this._getActivePlaybackEntityForIndexInternal(e,a,s,r,n)}_getActivePlaybackEntityForIndexInternal(e,t,a,s,r){const n=this._lastResolvedEntityIdByChip[e],o=_=>(this._lastResolvedEntityIdByChip[e]=_,_),l=this._playbackLingerByIdx?.[e],c=Date.now();if(l&&l.until>c)return this._isEntityPlaying(s)&&this._lastPlayingEntityIdByChip?.[e]===t?o(t):o(l.entityId);l&&l.until<=c&&delete this._playbackLingerByIdx[e];const u=this._isEntityPlaying(r),d=this._isEntityPlaying(s);if(u&&d)return o(n===t?t:a);if(u)return o(a);if(d)return o(t);const p=this._lastPlayingEntityIdByChip?.[e];if(p===a)return o(a);if(p===t)return o(t);if(a&&a!==t){const _=a===n;return t===n&&s&&s.state!=="off"&&s.state!=="unavailable"?o(t):(_&&r&&r.state!=="off"&&r.state,o(a))}else return o(t)}_getVolumeEntity(e){return this._getEntityForPurpose(e,"volume_control")}_getVolumeEntityForGrouping(e){return this._getEntityForPurpose(e,"grouping_control")}_getSearchEntityId(e){const t=this.entityObjs[e];return!t||!t.music_assistant_entity?t?.entity_id:(typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%")),t.music_assistant_entity)}_getPlaybackEntityId(e){return this._getEntityForPurpose(e,"playback_control")}_getActivePlaybackEntityId(e=this._selectedIndex){const t=this.entityObjs?.[e];if(!t)return null;const a=t.entity_id,s=this._getActualResolvedMaEntityForState(e),r=a?this.hass?.states?.[a]:null,n=s?this.hass?.states?.[s]:null;return this._getActivePlaybackEntityIdInternal(e,a,s,r,n)}_getActivePlaybackEntityIdInternal(e,t,a,s,r){if(a===t)return t;const n=Date.now(),o=this._playTimestamps?.[a]||0,l=this._playTimestamps?.[t]||0,c=this._playerStateCache[a]==="playing"&&r?.state!=="playing",u=this._playerStateCache[t]==="playing"&&s?.state!=="playing",d=c||n-o<5e3,p=u||n-l<5e3;if(this._isEntityPlaying(r))return this._lastActiveEntityIdByChip[e]=a,a;if(d&&r?.state!=="playing")return a;if(this._isEntityPlaying(s))return this._lastActiveEntityIdByChip[e]=t,t;if(p&&s?.state!=="playing")return t;const _=this._lastActiveEntityIdByChip?.[e];return _&&(_===a||_===t)?_:a&&a!==t?a:t}_getHiddenControlsForCurrentEntity(){const e=this.entityObjs[this._selectedIndex];if(!e?.hidden_controls)return{};const t={};return Array.isArray(e.hidden_controls)?e.hidden_controls.forEach(a=>{t[a]=!0}):typeof e.hidden_controls=="object"&&Object.assign(t,e.hidden_controls),t}_getActivePlaybackEntityIdForIndex(e){return this._getActivePlaybackEntityId(e)}_getGroupingEntityId(e){const t=this.entityObjs[e];return t?t.music_assistant_entity?typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%"))?this._maResolveCache?.[e]?.id||t.entity_id:t.music_assistant_entity:t.entity_id:null}_getGroupingEntityIdByEntityId(e){const t=this.entityIds.indexOf(e);return t<0?e:this._getGroupingEntityId(t)}_findEntityObjByAnyId(e){return this.entityObjs.find(t=>t.entity_id===e||t.music_assistant_entity===e)||null}_resolveMusicAssistantEntity(e){const t=this.entityObjs[e];if(!t||!t.music_assistant_entity)return t?.entity_id;try{return typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%")),t.music_assistant_entity}catch{return t.entity_id}}_getGroupKey(e){const t=this._getGroupingEntityIdByEntityId(e),a=this.hass?.states?.[t];if(!a||!this._isGroupCapable(a))return e;const s=Array.isArray(a.attributes.group_members)?a.attributes.group_members:[];if(s.length<=1)return e;const r=s[0],n=this.hass?.states?.[r];return this._isGroupCapable(n)?this.entityIds.find(o=>this._getGroupingEntityIdByEntityId(o)===r)||r:e}get entityIds(){return this.entityObjs.map(e=>e.entity_id)}getChipName(e){const t=this.entityObjs.find(a=>a.entity_id===e);return t&&t.name?t.name:this.hass.states[e]?.attributes.friendly_name||e}_getActualGroupMaster(e){if(!e||!e.length)return null;if(!this.hass||e.length===1)return e[0];if(this._lastGroupingMasterId&&e.includes(this._lastGroupingMasterId))return this._lastGroupingMasterId;const t=e.map(a=>{const s=this._getGroupingEntityIdByEntityId(a),r=s?this.hass.states[s]:null;return r?{id:a,groupingId:s,state:r}:null}).filter(Boolean);if(!t.length)return e[0];for(const a of t){const s=a.state?.attributes?.group_members;if(Array.isArray(s)&&s.length>0){const r=s[0],n=t.find(o=>o.groupingId===r);if(n)return n.id}}return e[0]}_getGroupingMasterId(){if(!this.entityIds||!this.entityIds.length)return null;const e=this.groupedSortedEntityIds||[],t=this.currentEntityId||this.entityIds[0];let a=t;if(this._lastGroupingMasterId&&this.entityIds.includes(this._lastGroupingMasterId)){const r=e.find(n=>n.includes(this._lastGroupingMasterId));r&&r.length>1&&r.includes(t)&&(a=this._lastGroupingMasterId)}const s=a?e.find(r=>r.includes(a)):null;if(s&&s.length>1){const r=this._getActualGroupMaster(s);if(r&&this.entityIds.includes(r))return r}return a}_getGroupingMasterIndex(){const e=this._getGroupingMasterId();return e?this.entityIds.indexOf(e):-1}_getGroupingMasterObj(){const e=this._getGroupingMasterIndex();return e>=0?this.entityObjs[e]:null}_resolveGroupingEntityId(e,t){if(!e?.music_assistant_entity)return t;if(typeof e.music_assistant_entity=="string"&&(e.music_assistant_entity.includes("{{")||e.music_assistant_entity.includes("{%"))){const a=this.entityIds.indexOf(t);return this._maResolveCache?.[a]?.id||t}return e.music_assistant_entity}get currentEntityId(){return this.entityIds[this._selectedIndex]}get currentStateObj(){return!this.hass||!this.currentEntityId?null:this.hass.states[this.currentEntityId]}get currentPlaybackEntityId(){return this._getPlaybackEntityId(this._selectedIndex)}get currentPlaybackStateObj(){const e=this._getResolvedPlaybackEntityIdSync(this._selectedIndex);return!this.hass||!e?this.currentStateObj:this.hass.states[e]}get currentActivePlaybackEntityId(){const e=`${this._selectedIndex}-${this.hass?.states?.[this.currentEntityId]?.state}-${this.hass?.states?.[this._getSearchEntityId(this._selectedIndex)]?.state}`;return(this._cachedActivePlaybackEntityId===void 0||this._cachedActivePlaybackEntityKey!==e)&&(this._cachedActivePlaybackEntityId=this._getActivePlaybackEntityId(this._selectedIndex),this._cachedActivePlaybackEntityKey=e),this._cachedActivePlaybackEntityId}get currentActivePlaybackStateObj(){const e=this.currentActivePlaybackEntityId;return e?this.hass?.states?.[e]:null}get currentVolumeStateObj(){const e=this._getVolumeEntity(this._selectedIndex);return e?this.hass.states[e]:null}get isAnyMenuOpen(){return this._showEntityOptions||this._showGrouping||this._showSourceList||this._showTransferQueue||this._searchOpen||this._showSourceMenu||!!this._searchActiveOptionsItem||!!this._activeSearchRowMenuId||!!this._queueActionsMenuOpenId}_renderMainMenu(e,t,a){return m`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>this._closeEntityOptions()}>
          ${h("common.close")}
        </button>
        <div class="entity-options-divider"></div>
      </div>
      <div class="entity-options-menu ${a?"chips-in-menu":""} entity-options-scroll" style="display:flex; flex-direction:column;">
        <button class="entity-options-item" @click=${()=>{const s=this._getResolvedEntitiesForCurrentChip();s.length===1?(this._openMoreInfoForEntity(s[0]),this._showEntityOptions=!1):this._showResolvedEntities=!0,this.requestUpdate()}}>${h("card.menu.more_info")}</button>
        <button class="entity-options-item" @click=${()=>{this._showSearchSheetInOptions()}}>${h("common.search")}</button>

        ${Array.isArray(e)&&e.length>0?m`
          <button class="entity-options-item" @click=${()=>this._openSourceList()}>${h("card.menu.source")}</button>
        `:b}
        
        ${this._canShowTransferQueueOption()?m`
          <button class="entity-options-item" @click=${()=>this._openTransferQueue()}>${h("card.menu.transfer_queue")}</button>
        `:b}
        
        ${this._renderGroupingMenuOption()}
        
        ${t.length?m`
          ${t.map(({action:s,idx:r})=>{const n=this._getActionLabel(s);return m`
              <button
                class="entity-options-item menu-action-item"
                @click=${()=>this._onMenuActionClick(r)}
              >
                ${s.icon?m`
                  <ha-icon
                    class="menu-action-icon"
                    .icon=${s.icon}
                  ></ha-icon>
                `:b}
                ${n?m`<span class="menu-action-label">${n}</span>`:b}
              </button>
            `})}
        `:b}
      </div>
    `}_getChipRowProps(){return{groupedSortedEntityIds:this.groupedSortedEntityIds,entityIds:this.entityIds,selectedEntityId:this.currentEntityId,pinnedIndex:this._pinnedIndex,holdToPin:this._holdToPin,getChipName:e=>this.getChipName(e),getActualGroupMaster:e=>this._getActualGroupMaster(e),artworkHostname:this.config?.artwork_hostname||"",mediaArtworkOverrides:this.config?.media_artwork_overrides||[],fallbackArtwork:this.config?.fallback_artwork||null,getIsChipPlaying:(e,t)=>{const a=this._findEntityObjByAnyId(e)?.entity_id||e,s=this.entityIds.indexOf(a);if(s<0)return!1;const r=this._getEntityForPurpose(s,"playback_control"),n=this.hass?.states?.[r];return this._isEntityPlaying(n)},getChipArt:e=>{const t=this._findEntityObjByAnyId(e)?.entity_id||e,a=this.entityIds.indexOf(t);if(a<0)return null;const s=this._getEntityForPurpose(a,"playback_control"),r=this.hass?.states?.[s],n=this.hass?.states?.[t],o=this._getArtworkUrl(r),l=this._getArtworkUrl(n);return o||l},getIsMaActive:e=>{const t=this._findEntityObjByAnyId(e)?.entity_id||e,a=this.entityIds.indexOf(t);if(a<0)return!1;const s=this.entityObjs[a];if(!s?.music_assistant_entity)return!1;const r=this._getEntityForPurpose(a,"playback_control"),n=this.hass?.states?.[r];return r===this._resolveEntity(s.music_assistant_entity,s.entity_id,a)&&this._isEntityPlaying(n)},isIdle:this._isIdle,hass:this.hass,onChipClick:e=>this._onChipClick(e),onIconClick:(e,t)=>{const a=this.entityIds[e],s=this.groupedSortedEntityIds.find(r=>r.includes(a));s&&s.length>1&&(this._selectedIndex=e,this._showEntityOptions=!0,this._showGrouping=!0,this.requestUpdate())},onPinClick:(e,t)=>{t.stopPropagation(),this._onPinClick(t)},onPointerDown:(e,t)=>this._handleChipPointerDown(e,t),onPointerMove:(e,t)=>this._handleChipPointerMove(e,t),onPointerUp:(e,t)=>this._handleChipPointerUp(e,t),quickGroupingMode:this._quickGroupingMode,getQuickGroupingState:e=>{const t=this.currentEntityId,a=this.entityIds.indexOf(t),s=a>=0?this._getGroupingEntityId(a):t,r=s?this.hass.states[s]:null,n=this._getGroupKey(this.currentEntityId);return this._getGroupPlayerState(e,t,null,r,n)},onQuickGroupClick:(e,t)=>{const a=this.entityIds[e];a&&this._toggleGroup(a)},onDoubleClick:e=>{e.stopPropagation(),this._quickGroupingMode=!this._quickGroupingMode,this.requestUpdate()}}}_renderInlineChipRow(e,t){return e?m`
      <div class="chip-row" style="${t?"visibility: hidden; pointer-events: none;":""}">
        ${gs(this._getChipRowProps())}
      </div>
    `:b}_renderInlineActionRow(e){return!e||!e.length?b:m`
      <div style="${this._showEntityOptions?"visibility: hidden; pointer-events: none;":""}">
        ${ho({actions:e.map(({action:t})=>t),onActionChipClick:t=>{const a=e[t];a&&this._onActionChipClick(a.idx)}})}
      </div>
    `}_renderGroupingMenuOption(){if(this.entityIds.length<=1)return b;const e=this.entityIds.reduce((n,o,l)=>{const c=this._getGroupingEntityId(l),u=this.hass.states[c];return n+(this._isGroupCapable(u)?1:0)},0),t=this._getGroupingEntityId(this._selectedIndex),a=this.hass.states[t],s=this.currentEntityId,r=this._getGroupKey(s)!==s;return e>1&&this._isGroupCapable(a)&&!r?m`
        <button class="entity-options-item" @click=${()=>this._openGrouping()}>${h("card.menu.group_players")}</button>
      `:b}_getGroupPlayerState(e,t,a,s,r){const n=this.entityIds.indexOf(e);if(n<0)return{isGroupable:!1,isBusy:!1,busyLabel:"",grouped:!1};const o=this._getGroupingEntityId(n),l=this.hass.states[o];if(!l||!this._isGroupCapable(l))return{isGroupable:!1,isBusy:!1,busyLabel:"",grouped:!1};const c=this._getGroupKey(e);let u=!1,d="";(c!==e&&c!==r||c===e&&c!==r&&l.attributes?.group_members?.length>1)&&(u=!0,d=h("common.unavailable"));const p=(Array.isArray(s?.attributes?.group_members)?s.attributes.group_members:[]).includes(o),_=e===r,f=this.getChipName(t);let g="";return _?g=h("card.grouping.master"):p?(g=h("card.grouping.unjoin_from","{master}",f),g==="card.grouping.unjoin_from"&&(g=`Unjoin from ${f}`)):(g=h("card.grouping.join_with","{master}",f),g==="card.grouping.join_with"&&(g=`Join with ${f}`)),{isGroupable:!0,isBusy:u,busyLabel:d,grouped:p,isPrimary:_,entityToCheck:o,tooltip:g}}_renderGroupingSheet(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this._getGroupingEntityId(t):e,s=a?this.hass.states[a]:null,r=Array.isArray(s?.attributes?.group_members)&&s.attributes.group_members.length>1,n=[];this.entityIds.indexOf(this.currentEntityId);const o=this._getGroupKey(this.currentEntityId);this.entityIds.forEach(g=>{const y=this._getGroupPlayerState(g,this.currentEntityId,null,s,o);y.isGroupable&&n.push({id:g,groupId:y.entityToCheck,isBusy:y.isBusy,busyLabel:y.busyLabel})});const l=this.currentEntityId,c=this.entityIds.indexOf(l),u=c>=0?this._getGroupingEntityId(c):null,d=u?this.hass.states[u]:null,p=d?this._isGroupCapable(d):!1,_=this._getGroupKey(l)!==l;if(!r&&(!p||_))return m`
        <div class="entity-options-header">
          <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeGrouping()}}>
            ${h("common.back")}
          </button>
          <div class="entity-options-divider"></div>
        </div>
        <div class="entity-options-title" style="margin-bottom:8px;">${h("card.grouping.title")}</div>
        <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
          ${h(_?"card.grouping.unavailable":"card.grouping.no_players")}
        </div>
      `;const f=[...n].sort((g,y)=>{if(r){if(g.id===e)return-1;if(y.id===e)return 1}else{if(g.id===l)return-1;if(y.id===l)return 1}return g.isBusy===y.isBusy?0:g.isBusy?1:-1});return m`
      <div class="grouping-header group-list-header">
        <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeGrouping()}}>
          ${h("common.back")}
        </button>
      </div>
      <div class="entity-options-title" style="margin-bottom:8px; margin-top:8px;">${h("card.grouping.title")}</div>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        ${r?m`
          <button class="entity-options-item"
            @click=${()=>this._syncGroupVolume()}
            style="flex:0 0 auto; min-width:140px; text-align:center;">
            ${h("card.grouping.sync_volume")}
          </button>
        `:b}
        <button class="entity-options-item"
          @click=${()=>r?this._ungroupAll():this._groupAll()}
          style="flex:0 0 auto; min-width:140px; text-align:center; margin-left:auto;">
          ${h(r?"card.grouping.ungroup_all":"card.grouping.group_all")}
        </button>
      </div>
      <div class="group-list-scroll">
        ${f.length===0?m`
          <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
            ${h("card.grouping.no_players")}
          </div>
        `:f.map(g=>{const y=g.id,k=g.groupId,x=(Array.isArray(s?.attributes?.group_members)?s.attributes.group_members:[]).includes(k),M=this.getChipName(y),E=g.isBusy,G=g.busyLabel,U=this.entityIds.indexOf(y),O=this._getVolumeEntityForGrouping(U)||k,z=this.hass.states[O],N=O?.startsWith&&O.startsWith("remote."),C=Number(z?.attributes?.volume_level||0),I=y===e,R=!I;let B=h(r?I?"card.grouping.master":x?"card.grouping.joined":"card.grouping.available":y===l?"card.grouping.current":"card.grouping.available");return E&&(B=G||"Unavailable"),m`
            <div class="entity-options-item group-player-row" style="
              display:flex;
              align-items:center;
              gap:6px;
              padding:4px 8px;
              margin-bottom:1px;
              ${E?"opacity: 0.5;":""}
            ">
              <div style="flex:1; min-width:120px;">
                <div style="font-weight:600; text-align:left;">${M}</div>
                <div style="font-size:0.8em; opacity:0.7; text-align:left;">${B}</div>
              </div>
              <div style="flex:1.8;display:flex;align-items:center;gap:4px;margin:0 6px; min-width:160px;">
                ${N?m`
                    <div class="vol-stepper" style="display:flex;align-items:center;gap:4px;">
                      <button @click=${()=>this._onGroupVolumeStep(O,-1)} title="Vol Down" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:minus"></ha-icon>
                      </button>
                      <button @click=${()=>this._onGroupVolumeStep(O,1)} title="Vol Up" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:plus"></ha-icon>
                      </button>
                    </div>
                  `:m`
                    <input
                      class="vol-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      .value=${C}
                      @change=${te=>this._onGroupVolumeChange(y,O,te)}
                      title="Volume"
                      style="width:100%;max-width:260px;"
                    />
                  `}
                <span style="min-width:36px;display:inline-block;text-align:right;">${typeof C=="number"?Math.round(C*100)+"%":"--"}</span>
              </div>
              ${R?m`
                    <button class="group-toggle-btn"
                            @click=${()=>!E&&this._toggleGroup(y)}
                            title=${E?"Player is unavailable":x?"Unjoin":"Join"}
                            style="margin-left:4px; ${E?"cursor: not-allowed; opacity: 0.5;":""}">
                      <ha-icon icon=${x?"mdi:minus-circle-outline":"mdi:plus-circle-outline"}></ha-icon>
                    </button>
                  `:m`<span style="margin-left:4px;margin-right:10px;width:32px;display:inline-block;"></span>`}
            </div>
          `})}
      </div>
    `}_renderTransferQueueSheet(){const e=this._getTransferQueueTargets();return m`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeTransferQueue()}}>
          ${h("common.back")}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-title" style="margin-bottom:12px;">${h("card.menu.transfer_to")}</div>
      </div>
      <div class="entity-options-scroll">
        ${e.length?m`
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${e.map(t=>m`
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
                ${t.state?m`<div style="margin-left:auto;font-size:0.82em;opacity:0.7;text-transform:capitalize;">${t.state}</div>`:b}
              </button>
            `)}
          </div>
        `:m`
          <div style="padding: 12px; opacity: 0.75;">${h("card.menu.no_players")}</div>
        `}
        ${this._transferQueueStatus?m`
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
        `:b}
      </div>
    `}_renderResolvedEntitiesSheet(){return m`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>{this._showResolvedEntities=!1,this.requestUpdate()}}>
          ${h("common.back")}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-resolved-entities" style="margin-top:12px;">
          <div class="entity-options-title">${h("card.menu.select_entity")}</div>
          <div class="entity-options-resolved-entities-list">
            ${this._getResolvedEntitiesForCurrentChip().map(e=>{const t=this.hass?.states?.[e],a=t?.attributes?.friendly_name||e,s=t?.attributes?.icon||"mdi:help-circle",r=this._selectedIndex,n=this.entityObjs[r];let o="Main Entity",l=!1;if(n){const c=this._getActualResolvedMaEntityForState(r),u=this._getVolumeEntity(r);l=(this._getActivePlaybackEntityForIndex(r)||n.entity_id)===e,e===c&&c!==n.entity_id?o="Music Assistant Entity":e===u&&u!==n.entity_id&&u!==c&&(o="Volume Entity")}return m`
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
    `}updated(e){if(this._idleImageTemplate&&e.has("hass")&&(this._idleImageTemplateNeedsResolve=!0),(e.has("_selectedIndex")||e.has("hass"))&&this._updateTransferQueueAvailability({refresh:!1}),this.hass&&this._hasMassQueueIntegration===null&&!this._checkingMassQueueIntegration&&(this._checkingMassQueueIntegration=!0,this._isMassQueueIntegrationAvailable(this.hass).then(s=>{this._hasMassQueueIntegration=s,s&&(this._massQueueAvailable=this._massQueueAvailable||s)}).catch(()=>{this._hasMassQueueIntegration=!1}).finally(()=>{this._checkingMassQueueIntegration=!1,this.requestUpdate()})),this.hass&&this.entityIds){if(this._upcomingFilterActive){const o=this.currentActivePlaybackEntityId;if(o){const l=this.hass.states[o]?.attributes?.media_title;if(l&&l!==this._lastMediaTitle){this._lastMediaTitle=l,this._searchLoading=!0,this.requestUpdate();const c=`${this._searchMediaClassFilter||"all"}_upcoming`;delete this._searchResultsByType[c],setTimeout(()=>{this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter)},4e3)}}}const s=Date.now();for(let o=0;o<this.entityIds.length;o++){const l=this.entityIds[o],c=this.entityObjs[o];if(!c)continue;const u=c.entity_id,d=this._getActualResolvedMaEntityForState(o),p=this.hass.states[u]?.state,_=this._playerStateCache[u];if(p==="playing"?(this._playTimestamps[u]=s,this._lastActiveEntityIdByChip[o]=u):_==="playing"&&p!=="playing"&&(this._playTimestamps[u]=s),this._playerStateCache[u]=p,d&&d!==u){const g=this.hass.states[d]?.state,y=this._playerStateCache[d];g==="playing"?(this._playTimestamps[d]=s,this._lastActiveEntityIdByChip[o]=d):y==="playing"&&g!=="playing"&&(this._playTimestamps[d]=s),this._playerStateCache[d]=g}const f=this._getEntityForPurpose(o,"sorting");f&&this.hass.states[f]?.state==="playing"&&(this._playTimestamps[l]=s)}if(this._manualSelect&&this._pinnedIndex===null&&this._manualSelectPlayingSet){for(const o of[...this._manualSelectPlayingSet]){const l=this.hass.states[o];this._isEntityPlaying(l)||this._manualSelectPlayingSet.delete(o)}for(const o of this.entityIds){const l=this.hass.states[o];if(this._isEntityPlaying(l)&&!this._manualSelectPlayingSet.has(o)){this._manualSelect=!1,this._manualSelectPlayingSet=null;break}}}if(this._updateIdleState(),!this._manualSelect&&!this.isAnyMenuOpen){const o=this.sortedEntityIds;if(o.length>0){let l=o[0];const c=l?(this.groupedSortedEntityIds||[]).find(f=>f.includes(l)):null;if(c&&c.length>1){const f=this._getActualGroupMaster(c);f&&(l=f)}const u=this.entityIds.indexOf(l),d=u>=0?this._getEntityForPurpose(u,"sorting"):null,p=d?this.hass.states[d]:null,_=this._isCurrentEntityPlaying();this._isEntityPlaying(p)&&this.entityIds[this._selectedIndex]!==l&&(!this._idleTimeout||!this._hasSeenPlayback)&&!_&&!this.entityObjs[u]?.disable_auto_select&&(this._selectedIndex=u)}}const r=this.entityIds[this._selectedIndex],n=r?(this.groupedSortedEntityIds||[]).find(o=>o.includes(r)):null;if(n&&n.length>1){const o=this._getActualGroupMaster(n);if(o&&o!==r){const l=this.entityIds.indexOf(o);l>=0&&!this.entityObjs[l]?.disable_auto_select&&(this._selectedIndex=l,this._lastGroupingMasterId=o)}}this._ensureResolvedMaForIndex(this._selectedIndex),this._ensureResolvedVolForIndex(this._selectedIndex),this._updateSelectedEntityHelper()}super.updated?.(e),this._progressTimer&&(clearInterval(this._progressTimer),this._progressTimer=null);const t=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;if(this._isEntityPlaying(t)&&t.attributes.media_duration&&(this._progressTimer=setInterval(()=>{this.requestUpdate()},500)),this._alwaysCollapsed&&this._expandOnSearch&&(this._searchOpen||this._showSearchInSheet)){this._prevCollapsed!==!1&&(this._prevCollapsed=!1,this._notifyResize());return}const a=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1;if(this._prevCollapsed!==a&&(this._prevCollapsed=a,this._notifyResize()),this._addGrabScroll(".chip-row"),this._addGrabScroll(".action-chip-row"),this._addGrabScroll(".search-filter-chips"),this._addVerticalGrabScroll(".floating-source-index"),this._lastRenderedCollapsed&&!this._lastRenderedHideControls){const s=this.renderRoot?.querySelector(".card-lower-content");if(s){const r=s.offsetHeight;if(r&&r>0){const n=Number(this.config?.card_height);Number.isFinite(n)&&n>0?(!this._collapsedBaselineHeight||r<this._collapsedBaselineHeight-1)&&(this._collapsedBaselineHeight=r):this._collapsedBaselineHeight=r}}}this._showSearchInSheet&&(this._alwaysCollapsed&&this._expandOnSearch,setTimeout(()=>{const s=()=>{const o=this.renderRoot.querySelector("#search-input-box");return o?(o.focus(),this._searchInputAutoFocused=!0,!0):!1};!this._disableSearchAutofocus&&!this._searchInputAutoFocused&&(s()||setTimeout(()=>{this._showSearchInSheet&&!this._disableSearchAutofocus&&!this._searchInputAutoFocused&&s()},200));const r=this._getVisibleSearchFilterClasses().join(",");if((!this._searchLoading||r)&&this._lastSearchChipClasses!==r){const o=this.renderRoot.querySelector(".search-filter-chips");o&&(o.scrollLeft=0);const l=this.renderRoot.querySelector(".entity-options-overlay");l&&(l.scrollTop=0);const c=this.renderRoot.querySelector(".entity-options-sheet");c&&(c.scrollTop=0),this._lastSearchChipClasses=r}const n=this.renderRoot.querySelector("#search-filter-chip-row");n&&(n.scrollWidth>n.clientWidth+2?n.style.justifyContent="flex-start":n.style.justifyContent="center")},200)),this._showSourceList&&setTimeout(()=>{const s=this.renderRoot.querySelector(".entity-options-overlay");s&&(s.scrollTop=0)},0)}_toggleSourceMenu(){this._showSourceMenu=!this._showSourceMenu,this._showSourceMenu?(this._manualSelect=!0,setTimeout(()=>{this._shouldDropdownOpenUp=!0,this.requestUpdate(),this._addSourceDropdownOutsideHandler()},0)):(this._manualSelect=!1,this._removeSourceDropdownOutsideHandler())}_addSourceDropdownOutsideHandler(){this._sourceDropdownOutsideHandler||(this._sourceDropdownOutsideHandler=e=>{const t=this.renderRoot.querySelector(".source-dropdown"),a=this.renderRoot.querySelector(".source-menu-btn"),s=e.composedPath?e.composedPath():[];t&&s.includes(t)||a&&s.includes(a)||(this._showSourceMenu=!1,this._manualSelect=!1,this._removeSourceDropdownOutsideHandler(),this.requestUpdate())},window.addEventListener("mousedown",this._sourceDropdownOutsideHandler,!0),window.addEventListener("touchstart",this._sourceDropdownOutsideHandler,!0))}_removeSourceDropdownOutsideHandler(){this._sourceDropdownOutsideHandler&&(window.removeEventListener("mousedown",this._sourceDropdownOutsideHandler,!0),window.removeEventListener("touchstart",this._sourceDropdownOutsideHandler,!0),this._sourceDropdownOutsideHandler=null)}_selectSource(e){const t=this.currentEntityId;!t||!e||(this.hass.callService("media_player","select_source",{entity_id:t,source:e}),this._closeEntityOptions())}_onPinClick(e){e.stopPropagation(),this._manualSelect=!1,this._pinnedIndex=null,this._manualSelectPlayingSet=null}_onChipClick(e){if(this._holdToPin&&this._justPinned){this._justPinned=!1;return}if(this._selectedIndex=e,this._lastActiveEntityId=null,clearTimeout(this._manualSelectTimeout),this._holdToPin)if(this._pinnedIndex!==null)this._manualSelect=!0;else{this._manualSelect=!0,this._manualSelectPlayingSet=new Set;for(const t of this.entityIds){const a=this.hass?.states?.[t];this._isEntityPlaying(a)&&this._manualSelectPlayingSet.add(t)}}else this._manualSelect=!0,this._pinnedIndex=e;this.requestUpdate()}_pinChip(e){this._justPinned=!0,clearTimeout(this._manualSelectTimeout),this._manualSelectPlayingSet=null,this._pinnedIndex=e,this._manualSelect=!0,this.requestUpdate()}async _onActionChipClick(e){const t=this.config.actions[e];t&&await this._handleAction(t)}async _handleAction(e){if(!e)return;if(e.menu_item){switch(this._quickMenuInvoke=!0,e.menu_item){case"more-info":this._openMoreInfo(),this._showEntityOptions=!1,this.requestUpdate();break;case"group-players":this._showEntityOptions=!0,this._showGrouping=!0,this.requestUpdate();break;case"search":this._openQuickSearchOverlay();break;case"search-recently-played":this._showEntityOptions=!0,this._showSearchSheetInOptions("recently-played"),setTimeout(()=>{this._notifyResize()},0);break;case"search-next-up":this._showEntityOptions=!0,this._showSearchSheetInOptions("next-up"),setTimeout(()=>{this._notifyResize()},0);break;case"source":this._showEntityOptions=!0,this._showSourceList=!0,this._showGrouping=!1,this.requestUpdate();break;case"transfer-queue":this._showEntityOptions=!0,this._openTransferQueue();break}return}if(typeof e.navigation_path=="string"&&e.navigation_path.trim()!==""||e.action==="navigate"){let r=(typeof e.navigation_path=="string"?e.navigation_path:e.path||"").trim();const n=e.navigation_new_tab===!0,o={current:this.currentActivePlaybackEntityId||this.currentEntityId||""};let l=null;n&&(l=so(this.hass,r,o)),l!=null?this._handleNavigate(l,n):(r=await ao(this.hass,r,o),this._handleNavigate(r,n));return}if(!e.service)return;const[t,a]=e.service.split(".");let s={...e.service_data||{}};if(t==="script"&&e.script_variable===!0){const r=this.currentEntityId,n=this._getSearchEntityId(this._selectedIndex),o=await this._resolveTemplateAtActionTime(n,r),l=this.currentActivePlaybackEntityId||this._getPlaybackEntityId(this._selectedIndex),c=await this._resolveTemplateAtActionTime(l,r);(s.entity_id==="current"||s.entity_id==="$current"||s.entity_id==="this")&&delete s.entity_id,s.yamp_entity=o||r,s.yamp_main_entity=r,s.yamp_playback_entity=c}else if(!(t==="script"&&e.script_variable===!0)&&(s.entity_id==="current"||s.entity_id==="$current"||s.entity_id==="this"||!s.entity_id))if(t==="music_assistant"){const r=this._getSearchEntityId(this._selectedIndex);s.entity_id=await this._resolveTemplateAtActionTime(r,this.currentEntityId)}else if(t==="media_player"){const r=this.currentActivePlaybackEntityId||this._getPlaybackEntityId(this._selectedIndex);s.entity_id=await this._resolveTemplateAtActionTime(r,this.currentEntityId)}else s.entity_id=this.currentEntityId;this.hass.callService(t,a,s)}_onTapAreaPointerDown(e){this.isAnyMenuOpen||e.composedPath().some(t=>t.tagName==="BUTTON"||t.tagName==="HA-ICON"||t.tagName==="INPUT"||t.classList&&t.classList.contains("clickable-artist")||t.classList&&t.classList.contains("details"))||(this._gestureActive=!0,this._gestureStartTime=Date.now(),this._gestureStartX=e.clientX,this._gestureStartY=e.clientY,this._gestureHoldTriggered=!1,this._gestureTapArea=e.currentTarget,this._cardTriggers?.hold&&(this._gestureHoldTimer=setTimeout(()=>{this._gestureActive&&(this._gestureHoldTriggered=!0,this._showGestureFeedback("hold",this._gestureStartX,this._gestureStartY),this._handleAction(this._cardTriggers.hold))},Jr)))}_onTapAreaPointerMove(e){if(!this._gestureActive)return;const t=Math.abs(e.clientX-this._gestureStartX),a=Math.abs(e.clientY-this._gestureStartY);(t>xt||a>xt)&&clearTimeout(this._gestureHoldTimer)}_onTapAreaPointerUp(e){if(!this._gestureActive||(this._gestureActive=!1,clearTimeout(this._gestureHoldTimer),this._gestureHoldTriggered)||Date.now()-this._gestureStartTime>Jr)return;const t=e.clientX-this._gestureStartX,a=e.clientY-this._gestureStartY,s=Math.abs(t),r=Math.abs(a);if(s>=tn&&r<tn){clearTimeout(this._tapTimer);const u=e.clientX,d=e.clientY;if(t<0&&this._cardTriggers?.swipe_left){this._showGestureFeedback("swipe_left",u,d),this._handleAction(this._cardTriggers.swipe_left);return}else if(t>0&&this._cardTriggers?.swipe_right){this._showGestureFeedback("swipe_right",u,d),this._handleAction(this._cardTriggers.swipe_right);return}}if(s>xt||r>xt)return;const n=Date.now(),o=n-(this._lastTapTime||0);this._lastTapTime=n;const l=e.clientX,c=e.clientY;o<en?(clearTimeout(this._tapTimer),this._cardTriggers?.double_tap&&(this._showGestureFeedback("double_tap",l,c),this._handleAction(this._cardTriggers.double_tap))):this._tapTimer=setTimeout(()=>{this._cardTriggers?.tap&&(this._showGestureFeedback("tap",l,c),this._handleAction(this._cardTriggers.tap))},jd)}_showGestureFeedback(e,t,a){const s=this._gestureTapArea||this.shadowRoot?.querySelector(".card-artwork-spacer")||this.shadowRoot?.querySelector(".collapsed-artwork-container");if(!s)return;const r=s.getBoundingClientRect(),n=t-r.left,o=a-r.top,l=document.createElement("div");l.className=`gesture-ripple ${e}`,l.style.left=`${n}px`,l.style.top=`${o}px`;let c=s.querySelector(".gesture-feedback-container");c||(c=document.createElement("div"),c.className="gesture-feedback-container",s.appendChild(c)),l.addEventListener("animationend",()=>l.remove()),c.appendChild(l)}_onMenuActionClick(e){const t=this.config.actions?.[e];t&&(t.menu_item||(this._quickMenuInvoke=!0),this._onActionChipClick(e),t.menu_item||this._dismissWithAnimation())}_getActionLabel(e){if(!e)return"";if(typeof e.name=="string"&&e.name.trim()!=="")return e.name.trim();const t=!!e.icon;return e.menu_item?t?"":{search:"Search","search-recently-played":"Recently Played","search-next-up":"Next Up",source:"Source","more-info":"More Info","group-players":"Group Players","transfer-queue":"Transfer Queue"}[e.menu_item]??e.menu_item:typeof e.navigation_path=="string"&&e.navigation_path.trim()!==""||e.action==="navigate"?t?"":"Navigate":e.service?t?"":e.service:t?"":"Action"}async _onControlClick(e){const t=this._getEntityForPurpose(this._selectedIndex,"playback_control");if(!t)return;const a=this.hass?.states?.[t]||this.currentStateObj;switch(e){case"play_pause":this._isEntityPlaying(a)?(this.hass.callService("media_player","media_pause",{entity_id:t}),this._lastPlayingEntityIdByChip||(this._lastPlayingEntityIdByChip={}),this._lastPlayingEntityIdByChip[this._selectedIndex]=t,this._pauseTimestamps||(this._pauseTimestamps={}),this._pauseTimestamps[this._selectedIndex]=Date.now(),this._controlFocusEntityId=t,this._optimisticPlayback={entity_id:t,state:"paused",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200)):(this.hass.callService("media_player","media_play",{entity_id:t}),this._lastPlayingEntityIdByChip&&delete this._lastPlayingEntityIdByChip[this._selectedIndex],this._pauseTimestamps&&delete this._pauseTimestamps[this._selectedIndex],this._controlFocusEntityId=t,this._optimisticPlayback={entity_id:t,state:"playing",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200));break;case"next":this.hass.callService("media_player","media_next_track",{entity_id:t});break;case"prev":this.hass.callService("media_player","media_previous_track",{entity_id:t});break;case"stop":if(this.hass.callService("media_player","media_stop",{entity_id:t}),a){const s=t;this._optimisticPlayback={entity_id:s,state:"idle",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200)}break;case"shuffle":{const s=!!a.attributes.shuffle;this.hass.callService("media_player","shuffle_set",{entity_id:t,shuffle:!s});break}case"repeat":{let s=a.attributes.repeat||"off",r;s==="off"?r="all":s==="all"?r="one":r="off",this.hass.callService("media_player","repeat_set",{entity_id:t,repeat:r});break}case"power":{const s=this.currentEntityId,r=(this.hass?.states?.[s]||a)?.state==="off"?"turn_on":"turn_off";this.hass.callService("media_player",r,{entity_id:s});const n=this.entityObjs[this._selectedIndex];if(n&&n.sync_power){const o=this._getVolumeEntity(this._selectedIndex);o&&o!==n.entity_id&&this.hass.callService("media_player",r,{entity_id:o})}break}case"favorite":{const s=this._getFavoriteButtonEntity(),r=this.hass?.states?.[t]?.attributes?.media_content_id,n=this._isCurrentTrackFavorited(),o=await this._isMassQueueIntegrationAvailable(this.hass);if(n&&o){const l=this._getMusicAssistantState()?.entity_id;if(l)try{const c={type:"call_service",domain:"mass_queue",service:"unfavorite_current_item",service_data:{entity:l}};await this.hass.connection.sendMessagePromise(c),r&&(this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[r]={isFavorited:!1}),this._searchResultsByType&&Object.keys(this._searchResultsByType).forEach(u=>{(u.includes("_favorites")||u==="favorites")&&delete this._searchResultsByType[u]}),this._checkingFavorites=null,this.requestUpdate()}catch(c){console.error("yamp: Failed to unfavorite current item:",c)}}else s&&(this.hass.callService("button","press",{entity_id:s}),r&&(this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[r]={isFavorited:!0},this._checkingFavorites=null,this._searchResultsByType&&Object.keys(this._searchResultsByType).forEach(l=>{(l.includes("_favorites")||l==="favorites")&&delete this._searchResultsByType[l]}),this.requestUpdate()));break}}}async _onVolumeChange(e){const t=this._selectedIndex,a=this._getGroupingEntityId(t),s=await this._resolveTemplateAtActionTime(a,this.currentEntityId),r=this.hass.states[s],n=Number(e.target.value),o=this.entityObjs[t];if(!(typeof o.group_volume!="boolean"||o.group_volume)||this._quickGroupingMode){this.hass.callService("media_player","volume_set",{entity_id:this._getVolumeEntity(t),volume_level:n});return}if(this._isCurrentlyGrouped(r)){const l=this.entityObjs[t].entity_id,c=[...new Set([l,...r.attributes.group_members])],u=typeof this._groupBaseVolume=="number"?this._groupBaseVolume:Number(this.currentVolumeStateObj?.attributes.volume_level||0),d=n-u;for(const p of c){for(const y of this.entityObjs){let k;if(y.music_assistant_entity)if(typeof y.music_assistant_entity=="string"&&(y.music_assistant_entity.includes("{{")||y.music_assistant_entity.includes("{%")))try{k=await this._resolveTemplateAtActionTime(y.music_assistant_entity,y.entity_id)}catch{k=y.entity_id}else k=y.music_assistant_entity;else k=y.entity_id;if(k===p)break}const _=p,f=this.hass.states[_];if(!f)continue;let g=Number(f.attributes.volume_level||0)+d;g=Math.max(0,Math.min(1,g)),g=Math.round(g*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:_,volume_level:g})}this._groupBaseVolume=n}else{const l=this._getVolumeEntity(t);this.hass.callService("media_player","volume_set",{entity_id:l,volume_level:n})}}async _onVolumeStep(e){const t=this._selectedIndex,a=this._getVolumeEntity(t);if(!a)return;const s=a.startsWith&&a.startsWith("remote."),r=this.currentVolumeStateObj;if(!r)return;if(s){this.hass.callService("remote","send_command",{entity_id:a,command:e>0?"volume_up":"volume_down"});return}const n=this._getGroupingEntityId(t),o=await this._resolveTemplateAtActionTime(n,this.currentEntityId),l=this.hass.states[o];if(this._isCurrentlyGrouped(l)){const c=this.entityObjs[t].entity_id,u=[...new Set([c,...l.attributes.group_members])],d=this._volumeStep*e;for(const p of u){for(const y of this.entityObjs){let k;if(y.music_assistant_entity)if(typeof y.music_assistant_entity=="string"&&(y.music_assistant_entity.includes("{{")||y.music_assistant_entity.includes("{%")))try{k=await this._resolveTemplateAtActionTime(y.music_assistant_entity,y.entity_id)}catch{k=y.entity_id}else k=y.music_assistant_entity;else k=y.entity_id;if(k===p)break}const _=p,f=this.hass.states[_];if(!f)continue;let g=Number(f.attributes.volume_level||0)+d;g=Math.max(0,Math.min(1,g)),g=Math.round(g*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:_,volume_level:g})}}else{let c=Number(r.attributes.volume_level||0);c+=this._volumeStep*e,c=Math.max(0,Math.min(1,c)),c=Math.round(c*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:a,volume_level:c})}}async _onMuteToggle(){const e=this._selectedIndex,t=this._getVolumeEntity(e);if(!t)return;const a=t.startsWith&&t.startsWith("remote."),s=this.currentVolumeStateObj;if(!s)return;const r=s.attributes.is_volume_muted??!1,n=s.attributes.volume_level??0;if(a){r?this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:.5}):this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:0});return}if(!this._supportsFeature(s,pa)){if(n>0)this._previousVolume=n,this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:0});else{const u=this._previousVolume??.5;this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:u}),this._previousVolume=null}return}let o,l,c;try{o=this._getGroupingEntityId(e),l=await this._resolveTemplateAtActionTime(o,this.currentEntityId),c=this.hass.states[l]}catch(u){console.error("yamp: Error in grouping detection:",u)}if(this._isCurrentlyGrouped(c)){const u=this.entityObjs[e].entity_id,d=[...new Set([u,...c.attributes.group_members])];for(const p of d){const _=p,f=this.hass.states[_];f&&this._supportsFeature(f,pa)?this.hass.callService("media_player","volume_mute",{entity_id:_,is_volume_muted:!r}):(f?.attributes?.volume_level??0)>0?this.hass.callService("media_player","volume_set",{entity_id:_,volume_level:0}):this.hass.callService("media_player","volume_set",{entity_id:_,volume_level:.5})}}else this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!r})}_onVolumeDragStart(e){if(!this.hass)return;const t=this.currentVolumeStateObj;this._groupBaseVolume=t?Number(t.attributes.volume_level||0):0}_onVolumeDragEnd(e){this._groupBaseVolume=null}_onGroupVolumeChange(e,t,a){const s=Number(a.target.value);this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:s}),this.requestUpdate()}_onGroupVolumeStep(e,t){this.hass.callService("remote","send_command",{entity_id:e,command:t>0?"volume_up":"volume_down"}),this.requestUpdate()}_onSourceChange(e){const t=this.currentEntityId,a=e.target.value;!t||!a||this.hass.callService("media_player","select_source",{entity_id:t,source:a})}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.currentEntityId},bubbles:!0,composed:!0}))}async _onProgressBarClick(e){try{e.stopPropagation();const t=this.currentEntityId,a=this._getActualResolvedMaEntityForState(this._selectedIndex),s=t?this.hass?.states?.[t]:null,r=a?this.hass?.states?.[a]:null;let n;if(this._controlFocusEntityId&&(this._controlFocusEntityId===a||this._controlFocusEntityId===t))n=this._controlFocusEntityId;else if(this._isEntityPlaying(r))n=a;else if(this._isEntityPlaying(s))n=t;else{const p=this._lastPlayingEntityIdByChip?.[this._selectedIndex];if(p&&(p===a||p===t))n=p;else{const _=this._getPlaybackEntityId(this._selectedIndex);n=await this._resolveTemplateAtActionTime(_,this.currentEntityId)}}const o=this.hass?.states?.[n]||this.currentStateObj;if(!n||!o||!o.attributes){console.warn("YAMP: Cannot seek - invalid target or state",n,o);return}const l=o.attributes.media_duration;if(!l)return;const c=e.target.getBoundingClientRect(),u=(e.clientX-c.left)/c.width,d=Math.floor(u*l);this._seekAnchor={position:d,timestamp:Date.now(),trackId:o.attributes.media_content_id||o.attributes.media_title},this._seekConvergenceLock=Date.now()+2e3,this._seekOffset=null,this.requestUpdate(),this.hass.callService("media_player","media_seek",{entity_id:n,seek_position:d})}catch(t){console.error("YAMP: Error in _onProgressBarClick",t)}}render(){if(!this.hass||!this.config)return b;const e=this.config.card_height,t=typeof e=="string"?e:Number(e),a=typeof t=="number"&&Number.isFinite(t)&&t>0||typeof t=="string"&&t.trim()!=="",s=this._collapsedBaselineHeight||220,r=this.entityObjs.length===1,n=r&&this.config.always_collapsed===!0&&this.config.expand_on_search!==!0,o=this.config.pin_search_headers===!0&&!n,l=!(this.config.hide_search_headers_on_idle===!0&&this._isIdle);if(this.shadowRoot&&this.shadowRoot.host){this.shadowRoot.host.setAttribute("data-match-theme",String(this.config.match_theme===!0)),this.shadowRoot.host.setAttribute("data-always-collapsed",String(this.config.always_collapsed===!0));const v=this.config.always_collapsed===!0&&this.config.pin_search_headers===!0&&this.config.expand_on_search===!0;this.shadowRoot.host.setAttribute("data-hide-menu-player",String(this.config.hide_menu_player===!0||v)),this.shadowRoot.host.setAttribute("data-extend-artwork",String(this.config.extend_artwork===!0)),this.shadowRoot.host.setAttribute("data-control-layout",this._controlLayout),this.shadowRoot.host.setAttribute("data-pin-search-headers",String(o)),a?this.shadowRoot.host.setAttribute("data-has-custom-height","true"):this.shadowRoot.host.removeAttribute("data-has-custom-height")}const c=this.config.show_chip_row||"auto",u=this.entityObjs.length>1,d=(c==="in_menu"||c==="in_menu_on_idle"&&this._isIdle)&&u,p=c!=="in_menu"&&(u||c==="always"),_=c==="in_menu_on_idle"&&this._isIdle&&u,f=c==="in_menu_on_idle"&&u,g=(this.config.actions??[]).map((v,j)=>({action:v,idx:j})).filter(({action:v})=>v?.action!=="sync_selected_entity"),y=v=>v?.placement?v.placement:v?.in_menu==="hidden"?"hidden":v?.in_menu===!0?"menu":"chip",k=g.filter(({action:v})=>y(v)==="chip"),x=g.filter(({action:v})=>y(v)==="menu"),M=g.find(({action:v})=>v?.card_trigger==="tap"),E=g.find(({action:v})=>v?.card_trigger==="hold"),G=g.find(({action:v})=>v?.card_trigger==="double_tap"),U=g.find(({action:v})=>v?.card_trigger==="swipe_left"),O=g.find(({action:v})=>v?.card_trigger==="swipe_right");this._cardTriggers={tap:M?.action,hold:E?.action,double_tap:G?.action,swipe_left:U?.action,swipe_right:O?.action};const z=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj,N=this.getChipName(this.currentEntityId);if(!z)return m`<div class="details">${h("common.not_found")}</div>`;const C=this._getHiddenControlsForCurrentEntity(),I=!!this._getFavoriteButtonEntity()&&!C.favorite,R=this._isCurrentTrackFavorited(),B=!C.power&&(this._supportsFeature(z,Jc)||this._supportsFeature(z,Xc)),te=this._controlLayout==="modern"&&B,ie=this._controlLayout==="modern"&&I;let Z=b;te?Z=m`
          <button
            class="volume-icon-btn favorite-volume-btn${z?.state!=="off"?" active":""}"
            @click=${()=>this._onControlClick("power")}
            title="${h("common.power")}"
          >
            <ha-icon .icon=${"mdi:power"}></ha-icon>
          </button>
        `:this._controlLayout==="modern"&&(Z=m`
          <button
            class="volume-icon-btn favorite-volume-btn"
            @click=${()=>this._openQuickSearchOverlay()}
            title="${h("common.search")}"
          >
            <ha-icon .icon=${"mdi:magnify"}></ha-icon>
          </button>
        `);const ne=ie?m`
        <button
          class="volume-icon-btn favorite-volume-btn${R?" active":""}"
          @click=${()=>this._onControlClick("favorite")}
          title="${h("common.favorite")}"
        >
          <ha-icon
            style=${R?"color: var(--custom-accent);":b}
            .icon=${R?"mdi:heart":"mdi:heart-outline"}
          ></ha-icon>
        </button>
      `:b,oe=z.attributes.source_list||[],Ae=new Set(oe.map(v=>v&&v[0]?v[0].toUpperCase():"")),pe="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");this._idleImageTemplate&&this._idleImageTemplateNeedsResolve&&!this._resolvingIdleImageTemplate&&this._isIdle&&this._resolveIdleImageTemplate();const ae=this._idleImageTemplate?this._idleImageTemplateResult:this.config.idle_image,Pe=this._normalizeImageSourceValue(ae);let Ve=null;if(Pe&&this._isIdle)if(this.hass.states[Pe]){const v=this.hass.states[Pe];Ve=v.attributes.entity_picture_local||v.attributes.entity_picture||(v.state&&v.startsWith("http")?v.state:null)}else(Pe.startsWith("http")||Pe.startsWith("/"))&&(Ve=Pe);const ja=!!Ve,Qe=this._isIdle,an=this._isIdle,sn=this._artworkObjectFit==="scaled-contain",Pa=this.config.extend_artwork===!0||_||sn,Oa=this.currentStateObj;this.currentPlaybackStateObj,this._optimisticPlayback?.entity_id,this._getResolvedPlaybackEntityIdSync(this._selectedIndex);const wt=this._getActualResolvedMaEntityForState(this._selectedIndex),rn=wt?this.hass?.states?.[wt]:null,nn=this._lastMainState,Ra=this._lastMaState;this._lastMainState=Oa?.state,this._lastMaState=rn?.state;const _e=this._selectedIndex;if(Ra==="playing"&&this._lastMaState!=="playing"){const v=Math.max(Number(this._idleTimeoutMs||this.config?.idle_timeout_ms||6e4),500);this._playbackLingerByIdx[_e]={entityId:wt,until:Date.now()+v}}if(Ra==="playing"&&this._lastMaState==="paused"&&this._lastPlayingEntityIdByChip?.[_e]===wt||nn==="playing"&&this._lastMainState==="paused"&&this._lastPlayingEntityIdByChip?.[_e]===Oa?.entity_id){const v=this._lastPlayingEntityIdByChip[_e],j=Math.max(Number(this._idleTimeoutMs||this.config?.idle_timeout_ms||6e4),500);this._playbackLingerByIdx[_e]={entityId:v,until:Date.now()+j}}this._lastMaState==="playing"&&this._playbackLingerByIdx?.[_e]&&delete this._playbackLingerByIdx[_e];const on=this.config.entities[_e]?.music_assistant_entity,ln=this._getEntityForPurpose(_e,"ma_resolve"),kt=this._lastPlayingEntityIdByChip?.[_e],cn=this._maResolveCache?.[_e]?.id,dn=!!(kt&&(kt===cn||kt===ln||kt===on||kt===wt));this._lastMainState==="playing"&&this._playbackLingerByIdx?.[_e]&&!dn&&delete this._playbackLingerByIdx[_e];const za=this._getEntityForPurpose(this._selectedIndex,"playback_control"),We=this.hass?.states?.[za],Et=We,un=za;Et?.state,this._optimisticPlayback&&this._optimisticPlayback.entity_id===un&&this._optimisticPlayback.state;const hn=!!Et?.attributes?.shuffle,pn=Et?.attributes?.repeat&&Et?.attributes?.repeat!=="off",Ye=this._idleTimeoutMs===0?this._isEntityPlaying(We):!this._isIdle&&this._isEntityPlaying(We),Ci=this.currentStateObj,Ti=this._getArtworkUrl(Ci),Mi=this._getArtworkUrl(We);(this._idleTimeoutMs===0?Ye&&(Ti?.url||Mi?.url):!this._isIdle&&Ye&&(Ti?.url||Mi?.url))&&(Ti?.url||Mi?.url);const Oe=this._idleTimeoutMs===0?!0:Ye,ve=Et||Ci,Kt=Oe&&ve?.attributes?.media_title||"",La=Oe&&(ve?.attributes?.media_artist||ve?.attributes?.media_series_title||ve?.attributes?.app_name)||"";this._lastTitleLength=Kt?Kt.length:0,this._adaptiveText&&this._updateAdaptiveTextScale(!0);let nt=ve?.attributes?.media_position||0;const At=ve?.attributes?.media_duration||0;let Xt=nt;if(Ye&&ve){const v=ve.attributes?.media_position_updated_at?Date.parse(ve.attributes.media_position_updated_at):ve.last_changed?Date.parse(ve.last_changed):Date.now(),j=(Date.now()-v)/1e3;Xt+=j}const _n=ve?.attributes?.media_content_id||ve?.attributes?.media_title,Na=Date.now();if(this._seekAnchor&&this._seekAnchor.trackId===_n){let v=this._seekAnchor.position;Ye&&(v+=(Na-this._seekAnchor.timestamp)/1e3);const j=this._seekConvergenceLock&&Na<this._seekConvergenceLock,H=Math.abs(Xt-v);!j&&H<2?(this._seekAnchor=null,this._seekConvergenceLock=null,nt=Xt):nt=v}else this._seekAnchor=null,this._seekConvergenceLock=null,nt=Xt;const qa=At?Math.min(1,nt/At):0,Fi=this._getVolumeEntity(_e),mn=Fi&&Fi.startsWith&&Fi.startsWith("remote."),fn=Number(this.currentVolumeStateObj?.attributes.volume_level||0),gn=this.config.volume_mode!=="stepper";let Q;this._alwaysCollapsed&&this._expandOnSearch&&(this._searchOpen||this._showSearchInSheet)?Q=!1:Q=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1;const Te=Q&&this._alwaysCollapsed&&a?Math.max(0,t-s):0,vn=Q&&p?48:0,yn=Q&&k.length>0?40:0,bn=vn+yn,Di=48,Re=Math.max(0,Te-bn),Jt=Te>0?Math.min(240,102+Re*.75):102,Ua=Re>0?Math.min(Re*.45,96):0,xn=Re>0?Math.round(Di+Ua):Di,wn=Q?xn:Di,ji=Re>0?Math.max(0,Re-Ua):0;let Pi=!1;const Ba=350,kn=(Q?a?t:this._collapsedBaselineHeight||220:Ba)>=Ba,Ga=this.config.hide_menu_player===!0?!1:!Q||kn,En=ji>=48,Oi=Te>0?Math.max(100,Math.round(Jt+24+Math.min(40,Te*.12))):null,An=En?0:Oi??0;let Ha=this.offsetWidth||(this.shadowRoot?.host?.offsetWidth??0);const Ri=Ha>380?Math.min(1.6,1+(Ha-380)/520):1,zi=Te>0?Math.min(1.45,1+Re/180):1,Va=zi>1||Ri>1?Math.min(1.6,Math.max(zi,Ri)):1,Qa=Math.min(1.5,Math.max(zi*.92,Ri*.92));this.shadowRoot&&this.shadowRoot.host&&(Te>0&&(Oi!=null&&this.shadowRoot.host.style.setProperty("--yamp-collapsed-details-offset",`${Oi}px`),this.shadowRoot.host.style.setProperty("--yamp-collapsed-controls-offset",`${An}px`),this.shadowRoot.host.style.setProperty("--yamp-collapsed-title-scale",Va.toFixed(3)),this.shadowRoot.host.style.setProperty("--yamp-collapsed-artist-scale",Qa.toFixed(3))),this.shadowRoot.host.style.setProperty("--yamp-collapsed-title-scale",Va.toFixed(3)),this.shadowRoot.host.style.setProperty("--yamp-collapsed-artist-scale",Qa.toFixed(3)),Te>0&&a||(this.shadowRoot.host.style.removeProperty("--yamp-collapsed-controls-offset"),this.shadowRoot.host.style.removeProperty("--yamp-collapsed-details-offset")),Ga?this.shadowRoot.host.removeAttribute("data-hide-persistent-controls"):this.shadowRoot.host.setAttribute("data-hide-persistent-controls","true"));let le=null,Li=null,Wa=this._artworkObjectFit;if(!this._isIdle){const v=this._getArtworkUrl(We),j=this._getArtworkUrl(Ci),H=v?.url?v:j;le=H?.url||null,Li=H?.sizePercentage,H?.objectFit&&(Wa=H.objectFit)}Pi=Q&&!le&&!Ve&&Re>=40,Q&&le&&le!==this._lastArtworkUrl&&(this._extractDominantColor(le).then(v=>{this._collapsedArtDominantColor=v,this.requestUpdate()}),this._lastArtworkUrl=le);const Ya=Qe?Q?this._collapsedBaselineHeight||220:325:null;this._lastRenderedCollapsed=Q,this._lastRenderedHideControls=Qe;const ei=Wa||this._artworkObjectFit,ti=ei==="scaled-contain"&&!Q&&!this._alwaysCollapsed,Sn=ei==="scaled-contain"&&(c==="in_menu"||r&&c!=="always");let Ni=this._getBackgroundSizeForFit(ei);Li&&(Ni=`${Li}%`);const Za=Ve?`url('${Ve}')`:le?`url('${le}')`:"none",Ka=Za!=="none",$n=le&&(Q||ti)?"blur(18px) brightness(0.7) saturate(1.15)":"none",Xa=[`background-image: ${Za}`,`background-size: ${ti?"cover":Ni}`,`background-position: ${this.config.artwork_position||"top center"}`,"background-repeat: no-repeat",`filter: ${$n}`].join("; ");return this.shadowRoot&&this.shadowRoot.host&&(this.shadowRoot.host.style.setProperty("--yamp-artwork-fit",ei),this.shadowRoot.host.style.setProperty("--yamp-artwork-bg-size",Ni)),m`
        <ha-card class="yamp-card" style=${a&&(!Q||this._alwaysCollapsed)?`height:${t}px;`:b}>
          <div
            data-match-theme="${String(this.config.match_theme===!0)}"
            class=${to({"yamp-card-inner":!0,"dim-idle":an,"no-chip-dim":this.config.dim_chips_on_idle===!1})}
          >
            ${Pa&&Ka?m`
              <div class="full-bleed-artwork-bg" style="${Xa}"></div>
              ${ja?b:m`<div class="full-bleed-artwork-fade"></div>`}
            `:b}
            ${_?m`${this._renderInlineActionRow(k)}${this._renderInlineChipRow(p,_)}`:m`${this._renderInlineChipRow(p,_)}${this._renderInlineActionRow(k)}`}
            <div class="card-lower-content-container" style="${Ya?`min-height:${Ya}px;`:""}">
              <div class="card-lower-content-bg"
                style="${(()=>{const v=[];return Pa&&Ka?v.push("background-image: none","filter: none"):v.push(Xa),v.push(`min-height: ${Q?Qe?`${this._collapsedBaselineHeight||220}px`:"0px":"350px"}`),v.push("transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s"),v.join("; ")})()}"
              ></div>
              ${ja?b:m`<div class="card-lower-fade"></div>`}
              <div class="card-lower-content${Q?" collapsed transitioning":" transitioning"}${Q&&le?" has-artwork":""}" style="${Qe?Q?`min-height: ${this._collapsedBaselineHeight||220}px;`:"min-height: 350px;":""}">
                ${Q&&le&&this._isValidArtworkUrl(le)?m`
                  <div
                    class="collapsed-artwork-container"
                    @pointerdown=${v=>this._onTapAreaPointerDown(v)}
                    @pointermove=${v=>this._onTapAreaPointerMove(v)}
                    @pointerup=${v=>this._onTapAreaPointerUp(v)}
                    @pointercancel=${()=>{this._gestureActive=!1,clearTimeout(this._gestureHoldTimer)}}
                    style="${[`background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%)`,Te>0?`width:${Math.round(Jt+8)}px`:"",this._cardTriggers.tap||this._cardTriggers.hold||this._cardTriggers.double_tap||this._cardTriggers.swipe_left||this._cardTriggers.swipe_right?"cursor:pointer; pointer-events:auto;":""].filter(Boolean).join("; ")}"
                  >
                    <img
                      class="collapsed-artwork"
                      src="${le}" 
                      style="${[this._getCollapsedArtworkStyle(),Te>0?`width:${Math.round(Jt)}px; height:${Math.round(Jt)}px;`:""].filter(Boolean).join(" ")}" 
                      onload="this.style.display='block'"
                      onerror="this.style.display='none'" />
                  </div>
                `:b}
                ${Pi||!Q?m`
                  <div class="card-artwork-spacer${Pi?" show-placeholder":""}"
                    @pointerdown=${v=>this._onTapAreaPointerDown(v)}
                    @pointermove=${v=>this._onTapAreaPointerMove(v)}
                    @pointerup=${v=>this._onTapAreaPointerUp(v)}
                    @pointercancel=${()=>{this._gestureActive=!1,clearTimeout(this._gestureHoldTimer)}}
                    style="${this._cardTriggers.tap||this._cardTriggers.hold||this._cardTriggers.double_tap||this._cardTriggers.swipe_left||this._cardTriggers.swipe_right?"cursor:pointer; pointer-events:auto;":""}"
                  >
                    ${ti&&le?m`
                      <div style="position: absolute; ${Sn?"top: 20px; right: 0; bottom: 0; left: 0;":"inset: 0;"} display: flex; align-items: center; justify-content: center; pointer-events: none;">
                        <img 
                          src="${le}" 
                          style="max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: none;" 
                        />
                      </div>
                    `:b}
                    ${!ti&&!le&&!Ve?m`
                      <div class="media-artwork-placeholder">
                        <svg
                          viewBox="0 0 184 184"
                          style="${this.config.match_theme===!0?"color:#fff;":`color:${this._customAccent};`}"
                          xmlns="http://www.w3.org/2000/svg">
                          <rect x="36" y="86" width="22" height="62" rx="8" fill="currentColor"></rect>
                          <rect x="68" y="58" width="22" height="90" rx="8" fill="currentColor"></rect>
                          <rect x="100" y="34" width="22" height="114" rx="8" fill="currentColor"></rect>
                          <rect x="132" y="74" width="22" height="74" rx="8" fill="currentColor"></rect>
                        </svg>
                      </div>
                    `:b}
                  </div>
                `:b}
                <div class="details" style="${(()=>{const v=[];return this._showEntityOptions&&v.push("visibility:hidden"),v.push(`min-height:${wn}px`),Oe||v.push("opacity:0"),v.join(";")})()}">
                  <div class="title">
                    ${Oe&&Kt?Kt:m`&nbsp;`}
                  </div>
                  <div
                      class="artist ${Oe&&z.attributes.media_artist?"clickable-artist":""}"
                      @click=${()=>{Oe&&z.attributes.media_artist&&this._searchArtistFromNowPlaying()}}
                      title=${Oe&&z.attributes.media_artist?h("search.search_artist"):""}
                    >${Oe&&La?La:m`&nbsp;`}</div>
                </div>
                ${!Q&&!this._alternateProgressBar?ni(Ye&&At?{progress:qa,seekEnabled:!0,onSeek:v=>this._onProgressBarClick(v),collapsed:!1,accent:this._customAccent,style:this._showEntityOptions?"visibility:hidden":"",displayTimestamps:this._displayTimestamps,currentTime:nt,duration:At}:{progress:0,seekEnabled:!1,collapsed:!1,accent:this._customAccent,style:"visibility:hidden",displayTimestamps:this._displayTimestamps,currentTime:0,duration:0}):b}
                ${Q||this._alternateProgressBar?ni(Ye&&At?{progress:qa,collapsed:!0,accent:this._customAccent,style:this._showEntityOptions?"visibility:hidden":""}:{progress:0,collapsed:!0,accent:this._customAccent,style:"visibility:hidden"}):b}
                ${!Qe&&ji>0?m`
                  <div class="collapsed-flex-spacer" style="flex: 1 0 ${Math.round(ji)}px;"></div>
                `:b}
                <div style="${Qe||this._showEntityOptions?"visibility:hidden; pointer-events:none;":""}">
                    ${wo({stateObj:We,showStop:this._shouldShowStopButton(We),shuffleActive:hn,repeatActive:pn,onControlClick:v=>this._onControlClick(v),supportsFeature:(v,j)=>this._supportsFeature(v,j),showFavorite:I,favoriteActive:R,hiddenControls:C,adaptiveControls:this._adaptiveControls,controlLayout:this._controlLayout,swapPauseForStop:this._controlLayout==="modern"&&this._swapPauseForStop})}

                    ${ko({isRemoteVolumeEntity:mn,showSlider:gn,vol:fn,isMuted:this.currentVolumeStateObj?.attributes?.is_volume_muted??!1,supportsMute:this.currentVolumeStateObj?this._supportsFeature(this.currentVolumeStateObj,pa):!1,onVolumeDragStart:v=>this._onVolumeDragStart(v),onVolumeDragEnd:v=>this._onVolumeDragEnd(v),onVolumeChange:v=>this._onVolumeChange(v),onVolumeStep:v=>this._onVolumeStep(v),onMuteToggle:()=>this._onMuteToggle(),leadingControlTemplate:Z,reserveLeadingControlSpace:this._controlLayout==="modern",showRightPlaceholder:this._controlLayout==="modern",rightSlotTemplate:ne,hideVolume:this.config.volume_mode==="hidden",moreInfoMenu:m`
                        <div class="more-info-menu">
                          <button class="more-info-btn" @click=${async()=>await this._openEntityOptions()}>
                            <span class="more-info-icon">&#9776;</span>
                          </button>
                        </div>
                      `})}
                  </div>
            ${Qe&&!this._showEntityOptions?m`
              <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: ${q.FLOATING_ELEMENT};">
                <button class="more-info-btn" @click=${async()=>await this._openEntityOptions()}>
                  <span class="more-info-icon">&#9776;</span>
                </button>
              </div>
            `:b}
            ${d&&!this._showEntityOptions&&!this._hideActiveEntityLabel?m`
              <div class="in-menu-active-label">${N}</div>
            `:b}
          </div>
        </div>

      ${this._showEntityOptions?m`
      <div class="entity-options-overlay entity-options-overlay-opening" @click=${v=>this._closeEntityOptions(v)}>
        <div class="entity-options-container entity-options-container-opening">
          <div class="entity-options-sheet${d||f?" chips-mode":""} entity-options-sheet-opening" 
               @click=${v=>v.stopPropagation()}
               data-pin-search-headers="${o}">
            ${d||f?m`
                <div class="entity-options-chips-wrapper" style="${f&&!d?"visibility:hidden;pointer-events:none;":""}" @click=${v=>v.stopPropagation()}>
                <div class="chip-row entity-options-chips-strip">
                  ${gs(this._getChipRowProps())}
                </div>
              </div>
            `:b}
              ${!this._showGrouping&&!this._showSourceList&&!this._showSearchInSheet&&!this._showResolvedEntities&&!this._showTransferQueue?this._renderMainMenu(oe,x,d):this._showGrouping?this._renderGroupingSheet():this._showTransferQueue?this._renderTransferQueueSheet():this._showResolvedEntities?this._renderResolvedEntitiesSheet():this._showSearchInSheet?m`
              <div class="entity-options-search" style = "margin-top:12px;" >
                ${this._searchHierarchy.length>0?m`
                    <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._goBackInSearch()}}>
                      Back
                    </button>
                    <div class="entity-options-divider"></div>
                  `:b}
                  ${l&&this._searchBreadcrumb?m`
                    <div class="entity-options-search-breadcrumb">
                      <div class="entity-options-search-breadcrumb-text">${this._searchBreadcrumb}</div>
                    </div>
                  `:l?m`<div class="entity-options-search-skeleton"></div>`:b}
                  ${l?m`
                  <div class="entity-options-search-row">
                      <input
                        type="text"
                        id="search-input-box"
                        ?autofocus=${!this._disableSearchAutofocus}
                        class="entity-options-search-input"
                        .value=${this._searchQuery}
                        @input=${v=>{this._searchQuery=v.target.value,this.requestUpdate()}}
                        @keydown=${v=>{v.key==="Enter"?(v.preventDefault(),this._handleSearchSubmit()):v.key==="Escape"&&(v.preventDefault(),this._hideSearchSheetInOptions())}}
                        placeholder="${h("editor.placeholders.search")}"
                        style="flex:1; min-width:0; font-size:1.1em;"
                      />
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${()=>this._handleSearchSubmit()}
                      ?disabled=${this._searchLoading}>
                      ${h("common.search")}
                    </button>
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._hideSearchSheetInOptions()}}>
              ${h("common.cancel")}
                    </button>
                  </div>
                  `:b}
                  <!--FILTER CHIPS-->
               ${l?(()=>{const v=this._getVisibleSearchFilterClasses(),j=this._searchMediaClassFilter||"all";return this._searchHierarchy.length>0||v.length<2&&!this._usingMusicAssistant?b:m`
                      <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center; align-items: center;">
                        <button
                          class="chip"
                          style="
                            width: 72px;
                            background: ${j==="all"?this._customAccent:"#282828"};
                            opacity: ${j==="all"?"1":"0.8"};
                            font-weight: ${j==="all"?"bold":"normal"};
                          "
                          ?selected=${j==="all"}
                          @click=${()=>this._doSearch()}
                        >${h("search.filters.all")}</button>
                        ${v.map(H=>m`
                          <button
                            class="chip"
                            style="
                              width: 72px;
                              background: ${j===H?this._customAccent:"#282828"};
                              opacity: ${j===H?"1":"0.8"};
                              font-weight: ${j===H?"bold":"normal"};
                            "
                            ?selected=${j===H}
                            @click=${()=>this._doSearch(H)}
                          >
                            ${h(`search.filters.${H}`)}
                          </button>
                        `)}
                      </div>
                    `})():b}
                  ${l&&this._searchLoading?m`<div class="entity-options-search-loading">${h("common.loading")}</div>`:b}
                  ${l&&this._searchError?m`<div class="entity-options-search-error">${this._searchError}</div>`:b}
                  
                  ${l&&this._usingMusicAssistant&&!this._searchLoading?m`
                    <div class="search-sub-filters" style="display: flex; align-items: center; margin-bottom: 2px; margin-top: 4px; padding-left: 3px; width: 100%; gap: 8px;">
                      <div style="display: flex; align-items: center; flex-wrap: wrap; flex: 1; min-width: 0;">
                        <button
                          class="button${this._initialFavoritesLoaded||this._favoritesFilterActive?" active":""}"
                          style="
                            background: none;
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
                          title="${h("search.favorites")}"
                        >
                                                  <ha-icon .icon=${this._initialFavoritesLoaded||this._favoritesFilterActive?"mdi:cards-heart":"mdi:cards-heart-outline"}></ha-icon>
                          ${this._initialFavoritesLoaded||this._favoritesFilterActive?m`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                              ${h("search.favorites")}
                            </span>
                          `:b}
                      </button>
                      <button
                          class="button${this._recentlyPlayedFilterActive?" active":""}"
                          style="
                            background: none;
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
                          title="${h("search.recently_played")}"
                        >
                          <ha-icon .icon=${this._recentlyPlayedFilterActive?"mdi:clock":"mdi:clock-outline"}></ha-icon>
                          ${this._recentlyPlayedFilterActive?m`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                              ${h("search.recently_played")}
                            </span>
                          `:b}
                      </button>
                      ${this._isMusicAssistantEntity()?m`
                        <button
                            class="button${this._upcomingFilterActive?" active":""}"
                            style="
                              background: none;
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
                            title="${h("search.next_up")}"
                          >
                            <ha-icon .icon=${this._upcomingFilterActive?"mdi:playlist-music":"mdi:playlist-music-outline"}></ha-icon>
                            ${this._upcomingFilterActive?m`
                              <span style="margin-left:6px;font-size:0.82em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                                ${h("search.next_up")}
                              </span>
                            `:b}
                        </button>
                        ${this._hasMassQueueIntegration?m`
                          <button
                              class="button${this._recommendationsFilterActive?" active":""}"
                              style="
                                background: none;
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
                              title="${h("search.recommendations")}"
                            >
                              <ha-icon .icon=${this._recommendationsFilterActive?"mdi:thumb-up":"mdi:thumb-up-outline"}></ha-icon>
                              ${this._recommendationsFilterActive?m`
                                <span style="margin-left:6px;font-size:0.81em;font-weight:600;color:rgba(255,255,255,0.85);white-space:nowrap;">
                                  ${h("search.recommendations")}
                                </span>
                              `:b}
                          </button>
                        `:b}
                      `:b}
                      <button
                          class="radio-mode-button${this._radioModeActive?" active":""}"
                          @click=${()=>this._toggleRadioMode()}
                          title="Radio Mode"
                        >
                          <ha-icon .icon=${this._radioModeActive?"mdi:radio":"mdi:radio-off"}></ha-icon>
                      </button>
                      ${this._shouldShowSearchSortToggle()?m`
                        <button
                          class="button"
                          style="
                            background: none;
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
                      `:b}
                      ${this._shouldShowSearchResultsCount()?m`
                        <span class="search-results-count">
                          ${this._getSearchResultsCountLabel()}
                        </span>
                      `:b}
                    </div>
                  `:b}

            <div class="entity-options-search-results ${this.config.search_view==="card"?"search-results-card-view":"list-view"}" 
                 style="${this.config.search_view==="card"?`--search-card-columns: ${this.config.search_card_columns||4};`:""}">
              ${(()=>{this._searchMediaClassFilter;const v=this._getDisplaySearchResults(),j=Math.max(15,this._searchTotalRows||v.length),H=[...v,...Array.from({length:Math.max(0,j-v.length)},()=>null)];return this._searchAttempted&&v.length===0&&!this._searchLoading?m`<div class="entity-options-search-empty">${h("common.no_results")}</div>`:H.map(L=>L?m`
                            <!-- EXISTING non‑placeholder row markup -->
                            <div class="entity-options-search-result ${this.config.search_view==="card"?"search-result-card":""} ${L._justMoved?"just-moved":""} ${L.media_content_id!=null&&this._activeSearchRowMenuId===L.media_content_id?"menu-active":""}">
                               <div class="search-sheet-thumb-container"
                                    data-clickable="${this.config.search_view==="card"}"
                                    @click=${this.config.search_view==="card"?()=>this._playMediaFromSearch(L):null}>
                                ${L.thumbnail&&this._isValidArtworkUrl(L.thumbnail)&&!String(L.thumbnail).includes("imageproxy")?m`
                                   <img
                                     class="entity-options-search-thumb"
                                     src=${L.thumbnail}
                                     alt=${L.title}
                                     onerror="this.style.display='none'"
                                   />
                                `:m`
                                   <div class="entity-options-search-thumb-placeholder">
                                     <ha-icon icon="mdi:music"></ha-icon>
                                   </div>
                                `}
                                ${this.config.search_view==="card"?li({item:L,onPlay:F=>this._playMediaFromSearch(F),onOptionsToggle:F=>{this._activeSearchRowMenuId=F?.media_content_id||null,this.requestUpdate()},upcomingFilterActive:!!this._upcomingFilterActive,isMusicAssistant:this._isMusicAssistantEntity(),massQueueAvailable:this._massQueueAvailable,searchView:"card"}):b}
                               </div>
                               <div class="search-sheet-info">
                                <span class="${this._isClickableSearchResult(L)?"clickable-search-result":""} ${this.config.search_view==="card"?"search-sheet-title":""}"
                                      @touchstart=${F=>this._handleSearchResultTouch(L,F)}
                                      @click=${()=>this._handleSearchResultClick(L)}
                                      title=${this._getSearchResultClickTitle(L)}>
                                  ${L.title}
                                </span>
                                 <span class="search-sheet-subtitle">
                                  ${(()=>{const F=this._searchMediaClassFilter==="track"||this._searchMediaClassFilter==="album",Se=!!this._recentlyPlayedFilterActive,In=!!this._upcomingFilterActive,Cn=!!this._recommendationsFilterActive;return(F||Se||In||Cn)&&L.artist?L.artist:L.media_class?L.media_class.charAt(0).toUpperCase()+L.media_class.slice(1):""})()}
                                </span>
                                ${this.config.search_view==="card"?m`
                                  <div class="card-menu-button" @click=${F=>{F.preventDefault(),F.stopPropagation(),this._activeSearchRowMenuId=L.media_content_id,this.requestUpdate()}}>
                                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                                  </div>
                                `:b}
                              </div>
                              ${this.config.search_view!=="card"?li({item:L,onPlay:F=>this._playMediaFromSearch(F),onOptionsToggle:F=>{this._activeSearchRowMenuId=F?.media_content_id||null,this.requestUpdate()},upcomingFilterActive:!!this._upcomingFilterActive,isMusicAssistant:this._isMusicAssistantEntity(),massQueueAvailable:this._massQueueAvailable,searchView:"list",isInline:!0,onMoveUp:F=>this._moveQueueItemUp(F.queue_item_id),onMoveDown:F=>this._moveQueueItemDown(F.queue_item_id),onMoveNext:F=>this._moveQueueItemNext(F.queue_item_id),onRemove:F=>this._removeQueueItem(F.queue_item_id)}):b}

                                ${bs({item:L,activeSearchRowMenuId:this._activeSearchRowMenuId,successSearchRowMenuId:this._successSearchRowMenuId,onPlayOption:(F,Se)=>this._performSearchOptionAction(F,Se),onOptionsToggle:F=>{this._activeSearchRowMenuId=F?.media_content_id||null,this.requestUpdate()},searchView:this.config.search_view,isQueueItem:this._isMusicAssistantEntity()&&L.queue_item_id&&!!this._upcomingFilterActive&&this._massQueueAvailable,onMoveUp:F=>this._moveQueueItemUp(F.queue_item_id),onMoveDown:F=>this._moveQueueItemDown(F.queue_item_id),onMoveNext:F=>this._moveQueueItemNext(F.queue_item_id),onRemove:F=>this._removeQueueItem(F.queue_item_id)})}
                            </div>
                          `:m`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `)})()}
            </div>
                  </div>
                </div>
              `:this._showGrouping?this._renderGroupingSheet():m`
                <div class="entity-options-header">
                  <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeSourceList()}}>
                    ${h("common.back")}
                  </button>
                  <div class="entity-options-divider"></div>
                </div>
                <div class="entity-options-scroll source-list-centering-wrapper">
                  <div class="source-list-sheet">
                    <div class="source-list-scroll">
                      ${oe.map(v=>m`
                        <div class="entity-options-item" data-source-name="${v}" @click=${()=>this._selectSource(v)}>${v}</div>
                      `)}
                    </div>
                  </div>
                </div>
                <div class="floating-source-index">
                  ${pe.map((v,j)=>{const H=Ae.has(v),L=this._hoveredSourceLetterIndex;let F="";if(H&&L!==null&&L!==void 0){const Se=Math.abs(L-j);Se===0?F="max":Se===1?F="large":Se===2&&(F="med")}return m`
                      <button
                        class="source-index-letter"
                        ?disabled=${!H}
                        data-scale=${F}
                        @mouseenter=${H?()=>{this._hoveredSourceLetterIndex=j,this.requestUpdate()}:b}
                        @mouseleave=${()=>{this._hoveredSourceLetterIndex=null,this.requestUpdate()}}
                        @click=${H?()=>this._scrollToSourceLetter(v):b}
                      >
                        ${v}
                      </button>
                    `})}
                </div>
`}
              </div>
            </div>
            <!-- Persistent Media Controls Section - Outside Scrollable Area -->
            ${Ga?m`
              <div class="persistent-media-controls" @click=${v=>v.stopPropagation()}>
                <div class="persistent-controls-artwork">
                  ${(()=>{const v=this.currentPlaybackStateObj,j=this.currentStateObj,H=this._getArtworkUrl(v)||this._getArtworkUrl(j);return H?.url&&this._isValidArtworkUrl(H.url)?m`
                      <img src="${H.url}" alt="Album Art" class="persistent-artwork" onerror="this.style.display='none'">
                    `:m`
                      <div class="persistent-artwork-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `})()}
                </div>
                <div class="persistent-controls-buttons">
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("prev")} title="${h("card.media_controls.previous")}">
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("play_pause")} title="${h("card.media_controls.play_pause")}">
                    <ha-icon icon=${this._isEntityPlaying(this.currentPlaybackStateObj)?"mdi:pause":"mdi:play"}></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("next")} title="${h("card.media_controls.next")}">
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </button>
                </div>
                ${(()=>{const v=this._selectedIndex,j=this._getVolumeEntity(v);if(!j)return b;const H=j.startsWith&&j.startsWith("remote."),L=this.currentVolumeStateObj,F=Number(L?.attributes?.volume_level??0),Se=H?null:`${Math.round((F||0)*100)}%`;return this.config.volume_mode==="hidden"?b:m`
                    <div class="persistent-volume-stepper">
                      <button class="stepper-btn" @click=${()=>this._onVolumeStep(-1)} title="${h("common.vol_down")}">–</button>
                      ${Se?m`<span class="stepper-value">${Se}</span>`:b}
                      <button class="stepper-btn" @click=${()=>this._onVolumeStep(1)} title="${h("common.vol_up")}">+</button>
                    </div>
                  `})()}
              </div>
            `:b}
          </div>
        `:b}
          ${this._searchActiveOptionsItem?Io({item:this._searchActiveOptionsItem,onClose:()=>{this._searchActiveOptionsItem=null,this.requestUpdate()},onPlayOption:(v,j)=>this._performSearchOptionAction(v,j)}):b}
          ${this._searchOpen?$o({open:this._searchOpen,query:this._searchQuery,loading:this._searchLoading,results:this._getDisplaySearchResults(),error:this._searchError,matchTheme:this.config?.match_theme,onClose:()=>this._searchCloseSheet(),onQueryInput:v=>{this._searchQuery=v.target.value,this.requestUpdate()},onSearch:()=>{this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter)},onPlay:v=>this._playMediaFromSearch(v),onQueue:v=>this._queueMediaFromSearch(v),onPlayOption:(v,j)=>this._performSearchOptionAction(v,j),onResultClick:v=>this._handleSearchResultClick(v),activeSearchRowMenuId:this._activeSearchRowMenuId,successSearchRowMenuId:this._successSearchRowMenuId,onOptionsToggle:v=>{this._activeSearchRowMenuId=v?v.media_content_id:null,this.requestUpdate()},upcomingFilterActive:this._upcomingFilterActive,disableAutofocus:this._disableSearchAutofocus,searchView:this.config.search_view||"list",searchCardColumns:this.config.search_card_columns||4,massQueueAvailable:this._massQueueAvailable,onMoveUp:v=>this._moveQueueItemUp(v.queue_item_id),onMoveDown:v=>this._moveQueueItemDown(v.queue_item_id),onMoveNext:v=>this._moveQueueItemNext(v.queue_item_id),onRemove:v=>this._removeQueueItem(v.queue_item_id)}):b}
          </div>
    </ha-card>
  `}_updateIdleState(){const e=this.entityIds.some((s,r)=>{if(this._isAutoSelectDisabled(r))return!1;const n=this._getEntityForPurpose(r,"sorting");return this._isEntityPlaying(this.hass.states[n])}),t=this._isCurrentEntityPlaying();let a=!1;if(this._isIdle||!this._hasSeenPlayback?a=e:a=t,a)this._idleTimeout&&clearTimeout(this._idleTimeout),this._idleTimeout=null,this._hasSeenPlayback=!0,this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate());else{if(!this._hasSeenPlayback){this._idleTimeoutMs>0?this._isIdle||(this._isIdle=!0,this._idleScreenApplied=!1,this._applyIdleScreen(),this.requestUpdate()):this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate());return}!this._isIdle&&!this._idleTimeout&&this._idleTimeoutMs>0&&(this._idleTimeout=setTimeout(()=>{this._isIdle=!0,this._idleTimeout=null,this._idleScreenApplied=!1,this._pinnedIndex===null&&(this._manualSelect=!1,this._manualSelectPlayingSet=null),this._applyIdleScreen(),this.requestUpdate()},this._idleTimeoutMs)),this._idleTimeoutMs===0&&this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate())}}getGridOptions(){let e;return this._alwaysCollapsed&&this._expandOnSearch&&(this._searchOpen||this._showSearchInSheet)?e=!1:e=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1,{min_rows:e?2:4,columns:12}}static get _schema(){return[{name:"entities",selector:{entity:{multiple:!0,domain:"media_player"}},required:!0},{name:"show_chip_row",selector:{select:{options:[{value:"auto",label:"Auto"},{value:"always",label:"Always"},{value:"in_menu",label:"In Menu"},{value:"in_menu_on_idle",label:"In Menu on Idle"}]}},required:!1},{name:"idle_screen",selector:{select:{options:[{value:"default",label:"Default"},{value:"search",label:"Search"},{value:"source",label:"Source"},{value:"more-info",label:"More Info"},{value:"group-players",label:"Group Players"},{value:"transfer-queue",label:"Transfer Queue"}]}},required:!1},{name:"hold_to_pin",selector:{boolean:{}},required:!1},{name:"disable_autofocus",selector:{boolean:{}},required:!1},{name:"idle_image",selector:{entity:{domain:"",multiple:!1}},required:!1},{name:"match_theme",selector:{boolean:{}},required:!1},{name:"collapse_on_idle",selector:{boolean:{}},required:!1},{name:"always_collapsed",selector:{boolean:{}},required:!1},{name:"expand_on_search",selector:{boolean:{}},required:!1},{name:"alternate_progress_bar",selector:{boolean:{}},required:!1},{name:"idle_timeout_ms",selector:{number:{min:0,step:1e3,unit_of_measurement:"ms",mode:"box"}},required:!1},{name:"volume_step",selector:{number:{min:.01,max:1,step:.01,unit_of_measurement:"",mode:"box"}},required:!1},{name:"volume_mode",selector:{select:{options:[{value:"slider",label:"Slider"},{value:"stepper",label:"Stepper"}]}},required:!1},{name:"actions",selector:{object:{}},required:!1},{name:"dim_chips_on_idle",selector:{boolean:{}},required:!1},{name:"pin_search_headers",selector:{boolean:{}},required:!1}]}firstUpdated(){super.firstUpdated?.();const e=this.renderRoot.querySelector(".floating-source-index");e&&e.addEventListener("wheel",function(t){const{scrollTop:a,scrollHeight:s,clientHeight:r}=e,n=t.deltaY;(n<0&&a===0||n>0&&a+r>=s)&&(t.preventDefault(),t.stopPropagation())},{passive:!1})}_addGrabScroll(e){const t=this.renderRoot.querySelector(e);if(!t||t._grabScrollAttached)return;let a=!1,s,r;const n=d=>{a=!0,t._dragged=!1,t.classList.add("grab-scroll-active"),s=d.pageX-t.offsetLeft,r=t.scrollLeft,d.preventDefault()},o=()=>{a=!1,t.classList.remove("grab-scroll-active")},l=()=>{a=!1,t.classList.remove("grab-scroll-active")},c=d=>{if(!a)return;const p=d.pageX-t.offsetLeft-s;Math.abs(p)>5&&(t._dragged=!0),d.preventDefault(),t.scrollLeft=r-p},u=d=>{t._dragged&&(d.stopPropagation(),d.preventDefault(),t._dragged=!1)};t.addEventListener("mousedown",n),t.addEventListener("mouseleave",o),t.addEventListener("mouseup",l),t.addEventListener("mousemove",c),t.addEventListener("click",u,!0),t._grabScrollHandlers={mousedown:n,mouseleave:o,mouseup:l,mousemove:c,click:u},t._grabScrollAttached=!0}_addVerticalGrabScroll(e){const t=this.renderRoot.querySelector(e);if(!t||t._grabScrollAttached)return;let a=!1,s,r;const n=d=>{a=!0,t._dragged=!1,t.classList.add("grab-scroll-active"),s=d.pageY-t.getBoundingClientRect().top,r=t.scrollTop,d.preventDefault()},o=()=>{a=!1,t.classList.remove("grab-scroll-active")},l=()=>{a=!1,t.classList.remove("grab-scroll-active")},c=d=>{if(!a)return;const p=d.pageY-t.getBoundingClientRect().top-s;Math.abs(p)>5&&(t._dragged=!0),d.preventDefault(),t.scrollTop=r-p},u=d=>{t._dragged&&(d.stopPropagation(),d.preventDefault(),t._dragged=!1)};t.addEventListener("mousedown",n),t.addEventListener("mouseleave",o),t.addEventListener("mouseup",l),t.addEventListener("mousemove",c),t.addEventListener("click",u,!0),t._grabScrollHandlers={mousedown:n,mouseleave:o,mouseup:l,mousemove:c,click:u},t._grabScrollAttached=!0}_removeGrabScrollHandlers(){this.renderRoot.querySelectorAll("[data-grab-scroll]").forEach(e=>{if(e._grabScrollHandlers){const t=e._grabScrollHandlers;e.removeEventListener("mousedown",t.mousedown),e.removeEventListener("mouseleave",t.mouseleave),e.removeEventListener("mouseup",t.mouseup),e.removeEventListener("mousemove",t.mousemove),e.removeEventListener("click",t.click,!0),delete e._grabScrollHandlers,e._grabScrollAttached=!1}})}_removeSearchSwipeHandlers(){const e=this.renderRoot.querySelector(".entity-options-search-results");if(e&&e._searchSwipeHandlers){const t=e._searchSwipeHandlers;e.removeEventListener("touchstart",t.touchstart),e.removeEventListener("touchend",t.touchend),delete e._searchSwipeHandlers,this._searchSwipeAttached=!1}}disconnectedCallback(){this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),this._unsubscribeFromQueueUpdates(),super.disconnectedCallback?.(),this._progressTimer&&(clearInterval(this._progressTimer),this._progressTimer=null),this._debouncedVolumeTimer&&(clearTimeout(this._debouncedVolumeTimer),this._debouncedVolumeTimer=null),this._manualSelectTimeout&&(clearTimeout(this._manualSelectTimeout),this._manualSelectTimeout=null),this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken=0,this._removeSourceDropdownOutsideHandler(),this._removeGrabScrollHandlers(),this._removeSearchSwipeHandlers(),window.removeEventListener("scroll",this._handleGlobalScroll),window.removeEventListener("resize",this._handleViewportResize),this._adaptiveScrollTimer&&(clearTimeout(this._adaptiveScrollTimer),this._adaptiveScrollTimer=null),this._lastPlayingEntityId=null,this._controlFocusEntityId=null,this._teardownAdaptiveTextObserver()}_applyClosingAnimations(){const e=this.renderRoot.querySelector(".entity-options-overlay"),t=this.renderRoot.querySelector(".entity-options-container"),a=this.renderRoot.querySelector(".entity-options-sheet");e&&(e.classList.remove("entity-options-overlay-opening"),e.classList.add("entity-options-overlay-closing")),t&&(t.classList.remove("entity-options-container-opening"),t.classList.add("entity-options-container-closing")),a&&(a.classList.remove("entity-options-sheet-opening"),a.classList.add("entity-options-sheet-closing"))}_dismissWithAnimation(){this._applyClosingAnimations(),this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),setTimeout(()=>{this._showEntityOptions=!1,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._quickMenuInvoke=!1,this.requestUpdate()},200)}_closeEntityOptions(){this._applyClosingAnimations(),this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),setTimeout(()=>{if(this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._showGrouping){this._showGrouping=!1,this._showEntityOptions=!1;const e=this.groupedSortedEntityIds,t=this.currentEntityId,a=e.find(s=>s.includes(t));if(a&&a.length>1){const s=this._getActualGroupMaster(a),r=this.entityIds.indexOf(s);r>=0&&(this._selectedIndex=r)}this.requestUpdate()}else this._showEntityOptions=!1,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._searchInputAutoFocused=!1,this.requestUpdate();this._quickMenuInvoke=!1},200)}async _openEntityOptions(){for(let e=0;e<this.entityObjs.length;e++)await this._ensureResolvedMaForIndex(e);await this._updateTransferQueueAvailability({refresh:!0}),this._showEntityOptions=!0,this.requestUpdate(),this.updateComplete.then(()=>{const e=this.renderRoot?.querySelector(".entity-options-chips-strip");e&&(e.scrollLeft=0)})}_openGrouping(){this._showEntityOptions=!0,this._showGrouping=!0;const e=this.currentEntityId;let t=e;if(e){const a=(this.groupedSortedEntityIds||[]).find(s=>s.includes(e));if(a&&a.length){const s=this._getActualGroupMaster(a);s&&(t=s)}}!t&&this.entityIds&&this.entityIds.length&&(t=this.entityIds[0]),this._lastGroupingMasterId=t,this.requestUpdate()}_openSourceList(){this._showEntityOptions=!0,this._showSourceList=!0,this._showGrouping=!1,this.requestUpdate()}_closeSourceList(){this._showSourceList=!1,this.requestUpdate()}_closeGrouping(){this._showGrouping=!1}async _toggleGroup(e){const t=this._getGroupingMasterId(),a=t?this.entityIds.indexOf(t):-1,s=a>=0?this.entityObjs[a]:null;if(!s)return;const r=await this._resolveGroupingEntityId(s,t);if(!r)return;const n=this.entityObjs.find(c=>c.entity_id===e);if(!n)return;const o=await this._resolveGroupingEntityId(n,e);if(!o)return;const l=r?this.hass.states[r]:null;Array.isArray(l?.attributes?.group_members)&&l.attributes.group_members.includes(o)?await this.hass.callService("media_player","unjoin",{entity_id:o}):await this.hass.callService("media_player","join",{entity_id:r,group_members:[o]}),this._lastGroupingMasterId=t||e}static getConfigElement(){return document.createElement("yet-another-media-player-editor")}static getStubConfig(e,t){return{entities:(t||[]).filter(a=>a.startsWith("media_player.")).slice(0,2),disable_mass_queue:!1}}async _groupAll(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this.entityObjs[t]:null;if(!a)return;const s=await this._resolveGroupingEntityId(a,e);if(!s)return;const r=this.hass.states[s];if(!this._isGroupCapable(r))return;const n=Array.isArray(r.attributes?.group_members)?r.attributes.group_members:[],o=[];for(const l of this.entityIds){if(l===e)continue;const c=this.entityObjs.find(p=>p.entity_id===l);if(!c)continue;const u=await this._resolveGroupingEntityId(c,l);if(!u)continue;const d=this.hass.states[u];this._isGroupCapable(d)&&!n.includes(u)&&o.push(u)}o.length>0&&await this.hass.callService("media_player","join",{entity_id:s,group_members:o}),this._lastGroupingMasterId=e||this.currentEntityId}async _ungroupAll(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this.entityObjs[t]:null;if(!a)return;const s=await this._resolveGroupingEntityId(a,e);if(!s)return;const r=this.hass.states[s];if(!this._isGroupCapable(r))return;const n=(Array.isArray(r.attributes?.group_members)?r.attributes.group_members:[]).filter(o=>{const l=this.hass.states[o];return this._isGroupCapable(l)});for(const o of n)await this.hass.callService("media_player","unjoin",{entity_id:o});this._lastGroupingMasterId=e||this.currentEntityId}_syncGroupVolume(){const e=this._getGroupingMasterId();if(!e)return;const t=this.entityIds.indexOf(e);if(t===-1)return;const a=this._getGroupingEntityId(t),s=a?this.hass.states[a]:null;if(!s||!this._isGroupCapable(s))return;const r=this._getVolumeEntityForGrouping(t)||a,n=this.hass.states[r],o=Number(n?.attributes?.volume_level);if(isNaN(o))return;const l=Array.isArray(s.attributes.group_members)?s.attributes.group_members:[],c=new Map;this.entityObjs.forEach((u,d)=>{c.set(this._getGroupingEntityId(d),d)});for(const u of l){if(u===a)continue;const d=c.get(u);if(d!==void 0){const p=this._getVolumeEntityForGrouping(d)||u;this.hass.callService("media_player","volume_set",{entity_id:p,volume_level:o})}else this.hass.callService("media_player","volume_set",{entity_id:u,volume_level:o})}}_getResolvedEntitiesForCurrentChip(){const e=new Set,t=this._selectedIndex,a=this.entityObjs[t];if(!a)return[];e.add(a.entity_id);const s=this._getActualResolvedMaEntityForState(t);s&&s!==a.entity_id&&e.add(s);const r=this._getVolumeEntity(t);return r&&r!==a.entity_id&&r!==s&&e.add(r),Array.from(e)}_openMoreInfoForEntity(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_updateSelectedEntityHelper(){if(!this.hass||!this.config?.actions)return;const e=this._selectedIndex;if(e==null||!this.entityObjs[e])return;this._lastSyncedActionValues||(this._lastSyncedActionValues=new Map);const t=this.config.actions.filter(a=>a.action==="sync_selected_entity"&&a.sync_entity_helper);if(t.length!==0)for(const a of t){const s=a.sync_entity_helper,r=a.sync_entity_type||"yamp_entity";let n;if(r==="yamp_main_entity"?n=this.entityIds[e]:r==="yamp_playback_entity"?n=this._getActivePlaybackEntityId(e):n=this._getActualResolvedMaEntityForState(e)||this.entityIds[e],!n)continue;const o=`${s}-${r}`;this._lastSyncedActionValues.get(o)!==n&&(this.hass.states[s]?.state!==n&&this.hass.callService("input_text","set_value",{entity_id:s,value:n}),this._lastSyncedActionValues.set(o,n))}}}He(Da,"properties",{_quickGroupingMode:{state:!0},hass:{},config:{},_selectedIndex:{state:!0},_lastPlaying:{state:!0},_shouldDropdownOpenUp:{state:!0},_pinnedIndex:{state:!0},_showSourceList:{state:!0},_holdToPin:{state:!0},_showQueueSuccessMessage:{state:!0},_searchActiveOptionsItem:{state:!0},_activeSearchRowMenuId:{state:!0},_successSearchRowMenuId:{state:!0},_radioModeActive:{state:!0},_showEntityOptions:{state:!0},_showGrouping:{state:!0},_showTransferQueue:{state:!0},_showResolvedEntities:{state:!0},_showSearchInSheet:{state:!0}}),He(Da,"styles",Eo),customElements.define("yet-another-media-player",Da);
